import { NextResponse } from 'next/server';
import { db } from './database';

// Simple session storage (in production, use Redis or database)
const activeSessions = new Map();

export function withAuth(handler) {
  return async (request, ...args) => {
    try {
      // Check for session cookie
      const sessionToken = request.cookies.get('session')?.value;
      
      if (!sessionToken) {
        return NextResponse.json(
          { success: false, error: 'Authentication required' },
          { status: 401 }
        );
      }

      // Validate session token
      const session = activeSessions.get(sessionToken);
      
      if (!session) {
        return NextResponse.json(
          { success: false, error: 'Invalid or expired session' },
          { status: 401 }
        );
      }

      // Check if session is expired
      if (new Date() > new Date(session.expiresAt)) {
        activeSessions.delete(sessionToken);
        return NextResponse.json(
          { success: false, error: 'Session expired' },
          { status: 401 }
        );
      }

      // Get user from database
      const user = db.users.getByUsername(session.username);
      
      if (!user) {
        activeSessions.delete(sessionToken);
        return NextResponse.json(
          { success: false, error: 'User not found' },
          { status: 401 }
        );
      }

      // Add user to request object
      request.user = {
        id: user.id,
        username: user.username,
        role: user.role
      };

      // Call the original handler
      return handler(request, ...args);
      
    } catch (error) {
      console.error('Authentication middleware error:', error);
      return NextResponse.json(
        { success: false, error: 'Authentication failed' },
        { status: 500 }
      );
    }
  };
}

export function withAdminAuth(handler) {
  return withAuth(async (request, ...args) => {
    // Check if user has admin role
    if (request.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      );
    }

    return handler(request, ...args);
  });
}

export function createSession(user) {
  const sessionToken = `session_${Date.now()}_${Math.random().toString(36).substring(2)}`;
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  const sessionData = {
    userId: user.id,
    username: user.username,
    role: user.role,
    createdAt: new Date().toISOString(),
    expiresAt: expiresAt.toISOString()
  };

  activeSessions.set(sessionToken, sessionData);
  
  return { sessionToken, sessionData };
}

export function destroySession(sessionToken) {
  return activeSessions.delete(sessionToken);
}

export function getSession(sessionToken) {
  return activeSessions.get(sessionToken);
}

export function cleanupExpiredSessions() {
  const now = new Date();
  
  for (const [token, session] of activeSessions.entries()) {
    if (now > new Date(session.expiresAt)) {
      activeSessions.delete(token);
    }
  }
}

// Rate limiting middleware
const requestCounts = new Map();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 100; // per window

export function withRateLimit(handler) {
  return async (request, ...args) => {
    try {
      // Get client IP (simplified)
      const ip = request.headers.get('x-forwarded-for') || 
                request.headers.get('x-real-ip') || 
                'unknown';
      
      const now = Date.now();
      const windowStart = now - RATE_LIMIT_WINDOW;
      
      // Get or create request log for this IP
      if (!requestCounts.has(ip)) {
        requestCounts.set(ip, []);
      }
      
      const requests = requestCounts.get(ip);
      
      // Remove old requests outside the window
      const recentRequests = requests.filter(timestamp => timestamp > windowStart);
      requestCounts.set(ip, recentRequests);
      
      // Check if limit exceeded
      if (recentRequests.length >= MAX_REQUESTS) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Too many requests. Please try again later.',
            retryAfter: Math.ceil(RATE_LIMIT_WINDOW / 1000 / 60) // minutes
          },
          { 
            status: 429,
            headers: {
              'Retry-After': Math.ceil(RATE_LIMIT_WINDOW / 1000).toString()
            }
          }
        );
      }
      
      // Add current request
      recentRequests.push(now);
      requestCounts.set(ip, recentRequests);
      
      return handler(request, ...args);
      
    } catch (error) {
      console.error('Rate limiting error:', error);
      // Continue without rate limiting if there's an error
      return handler(request, ...args);
    }
  };
}

// Validation middleware
export function withValidation(schema) {
  return (handler) => {
    return async (request, ...args) => {
      try {
        if (request.method === 'POST' || request.method === 'PUT') {
          const body = await request.json();
          
          // Basic validation based on schema
          for (const [field, rules] of Object.entries(schema)) {
            const value = body[field];
            
            // Required field check
            if (rules.required && (value === undefined || value === null || value === '')) {
              return NextResponse.json(
                { success: false, error: `${field} is required` },
                { status: 400 }
              );
            }
            
            // Type check
            if (value !== undefined && rules.type) {
              if (rules.type === 'number' && (isNaN(value) || typeof value !== 'number')) {
                return NextResponse.json(
                  { success: false, error: `${field} must be a number` },
                  { status: 400 }
                );
              }
              
              if (rules.type === 'string' && typeof value !== 'string') {
                return NextResponse.json(
                  { success: false, error: `${field} must be a string` },
                  { status: 400 }
                );
              }
              
              if (rules.type === 'array' && !Array.isArray(value)) {
                return NextResponse.json(
                  { success: false, error: `${field} must be an array` },
                  { status: 400 }
                );
              }
            }
            
            // Range check for numbers
            if (rules.min !== undefined && value < rules.min) {
              return NextResponse.json(
                { success: false, error: `${field} must be at least ${rules.min}` },
                { status: 400 }
              );
            }
            
            if (rules.max !== undefined && value > rules.max) {
              return NextResponse.json(
                { success: false, error: `${field} must be at most ${rules.max}` },
                { status: 400 }
              );
            }
            
            // Enum check
            if (rules.enum && !rules.enum.includes(value)) {
              return NextResponse.json(
                { success: false, error: `${field} must be one of: ${rules.enum.join(', ')}` },
                { status: 400 }
              );
            }
          }
          
          // Add validated body back to request
          request.validatedBody = body;
        }
        
        return handler(request, ...args);
        
      } catch (error) {
        if (error instanceof SyntaxError) {
          return NextResponse.json(
            { success: false, error: 'Invalid JSON in request body' },
            { status: 400 }
          );
        }
        
        console.error('Validation middleware error:', error);
        return NextResponse.json(
          { success: false, error: 'Validation failed' },
          { status: 500 }
        );
      }
    };
  };
}

// CORS middleware
export function withCors(handler) {
  return async (request, ...args) => {
    const response = await handler(request, ...args);
    
    // Add CORS headers
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.headers.set('Access-Control-Max-Age', '86400');
    
    return response;
  };
}

// Logging middleware
export function withLogging(handler) {
  return async (request, ...args) => {
    const start = Date.now();
    const method = request.method;
    const url = request.url;
    
    console.log(`[${new Date().toISOString()}] ${method} ${url} - Started`);
    
    try {
      const response = await handler(request, ...args);
      const duration = Date.now() - start;
      const status = response.status;
      
      console.log(`[${new Date().toISOString()}] ${method} ${url} - ${status} (${duration}ms)`);
      
      return response;
    } catch (error) {
      const duration = Date.now() - start;
      console.error(`[${new Date().toISOString()}] ${method} ${url} - ERROR (${duration}ms):`, error);
      throw error;
    }
  };
}

// Compose multiple middlewares
export function compose(...middlewares) {
  return (handler) => {
    return middlewares.reduceRight((acc, middleware) => {
      return middleware(acc);
    }, handler);
  };
}

// Clean up expired sessions every hour
setInterval(cleanupExpiredSessions, 60 * 60 * 1000);