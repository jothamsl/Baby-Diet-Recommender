"use client";

import { useState, useEffect } from "react";

/**
 * Progress Ring Component
 * 
 * A circular progress indicator with customizable size, thickness, and color.
 * 
 * @param {Object} props
 * @param {number} props.progress - Progress value (0-100)
 * @param {number} [props.size=80] - Size of the ring in pixels
 * @param {number} [props.thickness=8] - Thickness of the ring in pixels
 * @param {string} [props.color="currentColor"] - Color of the progress ring
 * @param {string} [props.bgColor="#e5e7eb"] - Color of the background ring
 * @param {React.ReactNode} [props.children] - Content to display inside the ring
 * @param {string} [props.className] - Additional CSS classes
 */
export function ProgressRing({
  progress,
  size = 80,
  thickness = 8,
  color = "currentColor",
  bgColor = "#e5e7eb",
  children,
  className,
  ...props
}) {
  const [value, setValue] = useState(0);
  
  // Animate progress on mount and when progress changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setValue(progress);
    }, 100);
    return () => clearTimeout(timer);
  }, [progress]);

  // Calculate SVG parameters
  const center = size / 2;
  const radius = center - thickness / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div 
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      {...props}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={bgColor}
          strokeWidth={thickness}
        />
        
        {/* Progress circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={thickness}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.5s ease-in-out" }}
        />
      </svg>
      
      {/* Center content */}
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
}

export default ProgressRing;