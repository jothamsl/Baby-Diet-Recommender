#!/usr/bin/env node

/**
 * Simple connection test script for Baby Diet Recommender backend
 * Run this to quickly verify if the backend is responding correctly
 */

const https = require("http");

const API_BASE_URL = "https://baby-diet-flask-backend.onrender.com";

// Colors for console output
const colors = {
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  reset: "\x1b[0m",
  bold: "\x1b[1m",
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function makeRequest(path, method = "GET", data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(API_BASE_URL + path);

    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };

    const req = https.request(options, (res) => {
      let body = "";

      res.on("data", (chunk) => {
        body += chunk;
      });

      res.on("end", () => {
        try {
          const jsonData = JSON.parse(body);
          resolve({
            status: res.statusCode,
            data: jsonData,
            headers: res.headers,
          });
        } catch (error) {
          resolve({
            status: res.statusCode,
            data: body,
            headers: res.headers,
            parseError: error.message,
          });
        }
      });
    });

    req.on("error", (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

async function testEndpoint(name, path, method = "GET", data = null) {
  try {
    log(`\n🧪 Testing ${name}...`, colors.blue);
    log(`   ${method} ${API_BASE_URL}${path}`, colors.yellow);

    const response = await makeRequest(path, method, data);

    if (response.status >= 200 && response.status < 300) {
      log(`   ✅ Success (${response.status})`, colors.green);

      if (response.data && typeof response.data === "object") {
        if (response.data.success !== undefined) {
          log(
            `   📊 Response: ${response.data.success ? "Success" : "Failed"}`,
            response.data.success ? colors.green : colors.red,
          );
        }
        if (response.data.message) {
          log(`   💬 Message: ${response.data.message}`, colors.reset);
        }
      }

      return true;
    } else {
      log(`   ❌ Failed (${response.status})`, colors.red);
      if (response.data) {
        log(
          `   📄 Response: ${JSON.stringify(response.data, null, 2)}`,
          colors.yellow,
        );
      }
      return false;
    }
  } catch (error) {
    log(`   ❌ Error: ${error.message}`, colors.red);

    if (error.code === "ECONNREFUSED") {
      log(
        `   💡 Backend server is not running or not accessible`,
        colors.yellow,
      );
    } else if (error.code === "ENOTFOUND") {
      log(
        `   💡 Cannot resolve hostname. Check your connection.`,
        colors.yellow,
      );
    }

    return false;
  }
}

async function runTests() {
  log(
    `${colors.bold}🍼 Baby Diet Recommender - Backend Connection Test${colors.reset}`,
  );
  log(`${"=".repeat(60)}`);
  log(`🔗 Testing backend at: ${API_BASE_URL}`, colors.blue);

  const tests = [
    {
      name: "Health Check",
      path: "/api/health",
      method: "GET",
    },
    {
      name: "Meals Endpoint",
      path: "/api/meals",
      method: "GET",
    },
    {
      name: "Sample Submission",
      path: "/api/submissions",
      method: "POST",
      data: {
        parent_name: "Test Parent",
        name: "Test Baby",
        age: 12,
        weight: 9.5,
        height: 75,
        sex: "male",
        allergies: "",
      },
    },
  ];

  let passedTests = 0;
  const totalTests = tests.length;

  for (const test of tests) {
    const passed = await testEndpoint(
      test.name,
      test.path,
      test.method,
      test.data,
    );
    if (passed) passedTests++;
  }

  // Summary
  log(`\n${"=".repeat(60)}`);
  log(
    `📊 Test Results: ${passedTests}/${totalTests} passed`,
    passedTests === totalTests ? colors.green : colors.red,
  );

  if (passedTests === totalTests) {
    log(
      `\n🎉 All tests passed! The backend is working correctly.`,
      colors.green,
    );
    log(`\n🚀 You can now start the frontend with:`, colors.blue);
    log(`   npm run dev`, colors.yellow);
    log(`\n🌐 Then open: http://localhost:3000`, colors.blue);
  } else {
    log(`\n⚠️  Some tests failed. Backend issues detected.`, colors.red);
    log(`\n🔧 To fix the backend:`, colors.blue);
    log(`   1. Make sure you're in the project directory`, colors.yellow);
    log(`   2. cd flask_backend`, colors.yellow);
    log(`   3. python -m venv venv`, colors.yellow);
    log(
      `   4. source venv/bin/activate  # On Windows: venv\\Scripts\\activate`,
      colors.yellow,
    );
    log(`   5. pip install -r requirements.txt`, colors.yellow);
    log(`   6. python run.py`, colors.yellow);
  }

  // Connection tips
  if (passedTests === 0) {
    log(`\n💡 Connection Tips:`, colors.blue);
    log(`   • Check if the backend server is running`, colors.yellow);
    log(`   • Make sure no firewall is blocking the connection`, colors.yellow);
    log(`   • Verify the backend started without errors`, colors.yellow);
    log(
      `   • Check if the production server at ${API_BASE_URL} is accessible`,
      colors.yellow,
    );
  }

  process.exit(passedTests === totalTests ? 0 : 1);
}

// Handle graceful shutdown
process.on("SIGINT", () => {
  log(`\n\n👋 Test interrupted by user`, colors.yellow);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  log(`\n❌ Unhandled rejection: ${reason}`, colors.red);
  process.exit(1);
});

// Run the tests
runTests().catch((error) => {
  log(`\n❌ Test runner error: ${error.message}`, colors.red);
  process.exit(1);
});
