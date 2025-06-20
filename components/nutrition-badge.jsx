"use client";

import React from "react";
import { Badge } from "./ui/badge";
import { ProgressRing } from "./ui/progress-ring";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

/**
 * Nutrition Badge Component
 *
 * Displays a nutritional information badge with visual indicators.
 *
 * @param {Object} props
 * @param {string} props.name - Name of the nutrient
 * @param {number|string} props.value - Value of the nutrient
 * @param {number} [props.percentage] - Percentage filled (0-100)
 * @param {string} [props.unit] - Unit of measurement
 * @param {string} [props.type] - Type determines the color scheme ("protein", "fat", "carbs", "vitamin", "mineral")
 * @param {string} [props.description] - Tooltip description
 * @param {string} [props.className] - Additional CSS class
 */
export function NutritionBadge({ 
  name, 
  value, 
  percentage = null,
  unit = "", 
  type = "default",
  description = "",
  className = "",
  ...props 
}) {
  // Determine color scheme based on type
  const getColorScheme = () => {
    switch (type.toLowerCase()) {
      case "protein":
        return {
          bg: "bg-blue-50",
          text: "text-blue-700",
          ring: "#3b82f6",
          hover: "hover:bg-blue-100"
        };
      case "fat":
      case "fats":
        return {
          bg: "bg-amber-50",
          text: "text-amber-700",
          ring: "#f59e0b",
          hover: "hover:bg-amber-100"
        };
      case "carb":
      case "carbs":
        return {
          bg: "bg-purple-50",
          text: "text-purple-700",
          ring: "#8b5cf6",
          hover: "hover:bg-purple-100"
        };
      case "vitamin":
        return {
          bg: "bg-green-50",
          text: "text-green-700",
          ring: "#10b981",
          hover: "hover:bg-green-100"
        };
      case "mineral":
        return {
          bg: "bg-orange-50",
          text: "text-orange-700",
          ring: "#f97316",
          hover: "hover:bg-orange-100"
        };
      case "calorie":
      case "calories":
        return {
          bg: "bg-rose-50",
          text: "text-rose-700",
          ring: "#e11d48",
          hover: "hover:bg-rose-100"
        };
      default:
        return {
          bg: "bg-gray-50",
          text: "text-gray-700",
          ring: "#6b7280",
          hover: "hover:bg-gray-100"
        };
    }
  };

  const colors = getColorScheme();
  
  // Format display value
  const displayValue = () => {
    if (typeof value === "number") {
      return value % 1 === 0 ? value : value.toFixed(1);
    }
    return value;
  };
  
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge 
            className={`
              ${colors.bg} ${colors.text} ${colors.hover} 
              px-3 py-1.5 font-medium shadow-sm transition-all duration-200
              flex items-center gap-2 cursor-default group
              ${className}
            `}
            {...props}
          >
            {percentage !== null && (
              <ProgressRing 
                progress={percentage} 
                size={24} 
                thickness={3} 
                color={colors.ring} 
                bgColor={`${colors.ring}25`}
                className="mr-1"
              >
                <span className={`text-[9px] font-bold ${colors.text}`}>
                  {Math.round(percentage)}%
                </span>
              </ProgressRing>
            )}
            
            <div className="flex items-baseline">
              <span className="font-semibold">{name}</span>
              <span className="ml-1.5 whitespace-nowrap">
                {displayValue()}
                {unit && <span className="ml-0.5 text-xs opacity-80">{unit}</span>}
              </span>
            </div>
          </Badge>
        </TooltipTrigger>
        {description && (
          <TooltipContent className="max-w-[250px] text-sm">
            <p>{description}</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
}

export default NutritionBadge;