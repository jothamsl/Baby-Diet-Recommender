"use client";

import React, { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { NutritionBadge } from "./nutrition-badge";
import { ComparativeGrowthChart } from "./comparative-growth-chart";
import { MealPlanner } from "./meal-planner";
import { 
  Heart, 
  Sparkles, 
  Download, 
  ChevronRight, 
  Baby, 
  AlertTriangle,
  Check,
  Calendar,
  ArrowRight,
  Star
} from "lucide-react";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ProgressRing } from "./ui/progress-ring";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { ScrollArea } from "./ui/scroll-area";

export function ResultsPanel({ 
  childData, 
  growthMetrics, 
  recommendedMeals = [],
  handleReset,
  className = "" 
}) {
  const [activeTab, setActiveTab] = useState("overview");
  const [showAllMeals, setShowAllMeals] = useState(false);
  
  if (!childData || !growthMetrics) {
    return null;
  }

  // Calculate nutrient fulfillment percentages
  const calculateFulfillmentPercentage = (recommendedMeals) => {
    // This is a simplified calculation. In a real app, you'd sum up all nutrients
    // from recommended meals and compare against the child's needs
    
    // Sum up nutrition from top 3 meals
    const mealData = recommendedMeals.slice(0, 3).reduce(
      (acc, meal) => {
        const nutrition = meal.nutrition || {};
        
        return {
          calories: (acc.calories || 0) + (nutrition.calories || 0),
          protein: (acc.protein || 0) + (nutrition.protein || 0),
          carbs: (acc.carbs || 0) + (nutrition.carbs || 0),
          fats: (acc.fats || 0) + (nutrition.fats || 0),
          iron: (acc.iron || 0) + (nutrition.iron || 0),
          calcium: (acc.calcium || 0) + (nutrition.calcium || 0),
          vitamin_c: (acc.vitamin_c || 0) + (nutrition.vitamin_c || 0),
        };
      },
      {}
    );
    
    // Child's estimated needs based on age and weight
    // This should ideally come from the backend
    const calorieNeeds = childData.age < 12 ? 800 : 1000;
    const proteinNeeds = childData.weight * 1.5;  // ~1.5g per kg body weight
    const carbsNeeds = calorieNeeds * 0.55 / 4;   // 55% of calories from carbs
    const fatsNeeds = calorieNeeds * 0.35 / 9;    // 35% of calories from fats
    
    return {
      calories: Math.min(100, Math.round((mealData.calories || 0) / calorieNeeds * 100)),
      protein: Math.min(100, Math.round((mealData.protein || 0) / proteinNeeds * 100)),
      carbs: Math.min(100, Math.round((mealData.carbs || 0) / carbsNeeds * 100)),
      fats: Math.min(100, Math.round((mealData.fats || 0) / fatsNeeds * 100)),
      iron: Math.min(100, Math.round((mealData.iron || 0) / 7 * 100)),     // Assuming 7mg needed
      calcium: Math.min(100, Math.round((mealData.calcium || 0) / 600 * 100)), // Assuming 600mg needed
      vitamin_c: Math.min(100, Math.round((mealData.vitamin_c || 0) / 15 * 100)), // Assuming 15mg needed
    };
  };

  const fulfillmentPercentages = calculateFulfillmentPercentage(recommendedMeals);
  
  const getGrowthStatusColor = (status) => {
    if (status === "Normal") return "text-green-600";
    if (status === "Underweight" || status === "Stunted") return "text-amber-600";
    if (status === "Overweight") return "text-red-600";
    return "text-blue-600";
  };
  
  const getGrowthStatusIcon = (status) => {
    if (status === "Normal") return <Check className="h-5 w-5 text-green-600" />;
    if (status === "Underweight" || status === "Stunted") return <AlertTriangle className="h-5 w-5 text-amber-600" />;
    if (status === "Overweight") return <AlertTriangle className="h-5 w-5 text-red-600" />;
    return <Baby className="h-5 w-5 text-blue-600" />;
  };
  
  const getZScoreColor = (score) => {
    const absScore = Math.abs(score);
    if (absScore <= 1) return "text-green-600";
    if (absScore <= 2) return "text-amber-600";
    return "text-red-600";
  };
  
  return (
    <div className={`space-y-6 animate-fade-in ${className}`}>
      {/* Header section */}
      <div className="text-center lg:text-left">
        <h2 className="text-3xl font-bold text-gray-800 mb-2 flex items-center justify-center lg:justify-start">
          <Sparkles className="mr-2 h-8 w-8 text-yellow-500" />
          Personalized Recommendations
        </h2>
        <p className="text-gray-600">
          Crafted with love for your little one's healthy growth
        </p>
      </div>

      {/* Main content with tabs */}
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 w-full mb-6">
          <TabsTrigger value="overview" className="text-sm md:text-base">Overview</TabsTrigger>
          <TabsTrigger value="growth" className="text-sm md:text-base">Growth Analysis</TabsTrigger>
          <TabsTrigger value="meals" className="text-sm md:text-base">Recommended Meals</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Summary card */}
          <Card className="bg-white shadow-xl border-0 overflow-hidden">
            <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-6 border-b border-pink-100">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-lg text-gray-800 flex items-center">
                    <Baby className="mr-2 h-5 w-5 text-pink-500" />
                    Child Summary
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">
                    Analysis based on provided measurements
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={handleReset}>
                    New Analysis
                  </Button>
                  <Button size="sm" variant="outline" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    <span className="hidden sm:inline">Export</span>
                  </Button>
                </div>
              </div>
            </div>

            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-gray-500 text-xs mb-1">Age</p>
                  <p className="text-gray-900 font-semibold flex items-baseline">
                    {childData.age} 
                    <span className="text-xs text-gray-500 ml-1">months</span>
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-gray-500 text-xs mb-1">Weight</p>
                  <p className="text-gray-900 font-semibold flex items-baseline">
                    {childData.weight}
                    <span className="text-xs text-gray-500 ml-1">kg</span>
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-gray-500 text-xs mb-1">Height</p>
                  <p className="text-gray-900 font-semibold flex items-baseline">
                    {childData.height}
                    <span className="text-xs text-gray-500 ml-1">cm</span>
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-gray-500 text-xs mb-1">Sex</p>
                  <p className="text-gray-900 font-semibold capitalize">
                    {childData.sex}
                  </p>
                </div>
              </div>

              <div className="bg-green-50 border border-green-100 rounded-lg p-4 flex items-center justify-between mb-6">
                <div className="flex items-center">
                  {getGrowthStatusIcon(growthMetrics.status)}
                  <span className="ml-2 font-medium text-gray-800">
                    Growth Status: <span className={getGrowthStatusColor(growthMetrics.status)}>{growthMetrics.status}</span>
                  </span>
                </div>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="text-green-700 hover:text-green-800 hover:bg-green-100"
                  onClick={() => setActiveTab("growth")}
                >
                  Details
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>

              <h4 className="font-semibold text-gray-700 mb-3">Nutritional Coverage</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                <NutritionBadge 
                  name="Calories" 
                  value={recommendedMeals.slice(0,3).reduce((sum, meal) => sum + (meal.nutrition?.calories || 0), 0)}
                  percentage={fulfillmentPercentages.calories}
                  unit="kcal" 
                  type="calories" 
                  description="Total calories provided by recommended meals relative to estimated needs"
                />
                <NutritionBadge 
                  name="Protein" 
                  value={recommendedMeals.slice(0,3).reduce((sum, meal) => sum + (meal.nutrition?.protein || 0), 0)}
                  percentage={fulfillmentPercentages.protein}
                  unit="g" 
                  type="protein"
                  description="Protein is essential for growth and development"
                />
                <NutritionBadge 
                  name="Carbs" 
                  value={recommendedMeals.slice(0,3).reduce((sum, meal) => sum + (meal.nutrition?.carbs || 0), 0)}
                  percentage={fulfillmentPercentages.carbs}
                  unit="g" 
                  type="carbs"
                  description="Carbohydrates provide energy for daily activities"
                />
                <NutritionBadge 
                  name="Fats" 
                  value={recommendedMeals.slice(0,3).reduce((sum, meal) => sum + (meal.nutrition?.fats || 0), 0)}
                  percentage={fulfillmentPercentages.fats}
                  unit="g" 
                  type="fats"
                  description="Healthy fats are important for brain development"
                />
              </div>
            </CardContent>
          </Card>

          {/* Top recommendations preview */}
          <Card className="bg-white shadow-xl border-0">
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 border-b border-amber-100">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg text-gray-800 flex items-center">
                  <Sparkles className="mr-2 h-5 w-5 text-amber-500" />
                  Top Meal Recommendations
                </h3>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="border-amber-200 text-amber-700 hover:bg-amber-100"
                  onClick={() => setActiveTab("meals")}
                >
                  View All
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
            <CardContent className="p-6">
              {recommendedMeals.slice(0, 3).map((meal, index) => (
                <div 
                  key={index} 
                  className={`bg-white border border-gray-100 rounded-xl p-4 shadow-sm ${index < 2 ? 'mb-4' : ''}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-start">
                      <div className="bg-amber-100 text-amber-700 w-8 h-8 rounded-full flex items-center justify-center mr-3 shrink-0">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="text-gray-800 font-medium">{meal.name}</h4>
                        <div className="flex items-center text-gray-500 text-sm mt-0.5">
                          <Calendar className="h-3.5 w-3.5 mr-1" />
                          <span>{meal.age_range}</span>
                        </div>
                      </div>
                    </div>
                    <Badge className="bg-gradient-to-r from-pink-100 to-rose-100 text-pink-800">
                      {meal.meal_type || "Snack"}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-2">
                    {meal.ingredients
                      .slice(0, 3)
                      .map((ingredient, i) => (
                        <span
                          key={i}
                          className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full"
                        >
                          {ingredient}
                        </span>
                      ))}
                    {meal.ingredients.length > 3 && (
                      <span className="text-xs text-gray-500 px-1 py-0.5">
                        +{meal.ingredients.length - 3} more
                      </span>
                    )}
                  </div>

                  <div className="flex items-center">
                    <div className="flex items-center text-amber-500">
                      {Array(5).fill(0).map((_, i) => (
                        <Star key={i} fill={i < Math.round(meal.hybrid_score * 5) ? "currentColor" : "none"} className="h-3.5 w-3.5" />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500 ml-2">
                      {Math.round(meal.hybrid_score * 100)}% match
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Growth Analysis Tab */}
        <TabsContent value="growth" className="space-y-6">
          <Card className="bg-white shadow-xl border-0">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-blue-100">
              <h3 className="font-semibold text-lg text-gray-800 flex items-center">
                <Heart className="mr-2 h-5 w-5 text-red-500" />
                Growth Analysis
              </h3>
            </div>
            <CardContent className="p-6">
              <div className="mb-6">
                <ComparativeGrowthChart
                  babyData={{ age: Number(childData.age), value: Number(childData.weight) }}
                  type="weight"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {[
                  {
                    label: "Weight-for-age",
                    value: growthMetrics.weightForAge,
                    description: "Compares your child's weight to WHO standards for their age"
                  },
                  {
                    label: "Height-for-age",
                    value: growthMetrics.heightForAge,
                    description: "Compares your child's height to WHO standards for their age"
                  },
                  {
                    label: "Weight-for-height",
                    value: growthMetrics.weightForHeight,
                    description: "Compares your child's weight to WHO standards for their height"
                  },
                  {
                    label: "Status",
                    value: growthMetrics.status,
                    isStatus: true,
                    description: "Overall growth status based on WHO standards"
                  },
                ].map((metric, index) => (
                  <TooltipProvider key={index} delayDuration={300}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                          <p className="text-sm text-gray-500 mb-1">
                            {metric.label}
                          </p>
                          {metric.isStatus ? (
                            <Badge className={`${getGrowthStatusColor(metric.value)} bg-opacity-10 bg-current text-current text-base px-3 py-1`}>
                              {metric.value}
                            </Badge>
                          ) : (
                            <p className={`text-2xl font-bold ${getZScoreColor(metric.value)}`}>
                              {metric.value < 0 ? metric.value : `+${metric.value}`}
                            </p>
                          )}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{metric.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-2">Understanding Z-Scores</h4>
                <p className="text-sm text-blue-700">
                  Z-scores represent how many standard deviations your child's measurements
                  are from the average. A score between -2 and +2 is typically considered normal.
                  Negative values indicate measurements below average, while positive values indicate
                  measurements above average.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Meals Tab */}
        <TabsContent value="meals" className="space-y-6">
          <Card className="bg-white shadow-xl border-0">
            <div className="bg-gradient-to-r from-orange-50 to-pink-50 p-6 border-b border-orange-100">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 gap-4">
                <h3 className="font-semibold text-lg text-gray-800 flex items-center">
                  <Sparkles className="mr-2 h-5 w-5 text-yellow-500" />
                  Recommended Meals
                </h3>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    <span>PDF</span>
                  </Button>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Meals are ranked by nutritional compatibility with your child's needs
              </p>
            </div>
            <CardContent className="p-0">
              <ScrollArea className="h-[500px] p-6">
                <div className="space-y-4">
                  {(showAllMeals ? recommendedMeals : recommendedMeals.slice(0, 5)).map((meal, index) => (
                    <div
                      key={index}
                      className="bg-white border border-gray-100 hover:border-orange-200 rounded-xl p-4 shadow-sm transition-all duration-200"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-start">
                          <div className="bg-orange-100 text-orange-800 w-8 h-8 rounded-full flex items-center justify-center mr-3 shrink-0">
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="text-gray-800 font-medium">{meal.name}</h4>
                            <div className="flex flex-wrap gap-2 items-center text-gray-500 text-sm mt-1">
                              <div className="flex items-center">
                                <Calendar className="h-3.5 w-3.5 mr-1" />
                                <span>{meal.age_range}</span>
                              </div>
                              {meal.preparation_time && (
                                <div className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                                  {meal.preparation_time} min
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <Badge className="bg-gradient-to-r from-pink-100 to-rose-100 text-pink-800">
                          {meal.meal_type || "Snack"}
                        </Badge>
                      </div>

                      {meal.description && (
                        <p className="text-sm text-gray-600 mb-3">{meal.description}</p>
                      )}

                      <div className="mb-3">
                        <p className="text-xs font-medium text-gray-700 mb-2">
                          Ingredients:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {meal.ingredients.map((ingredient, i) => (
                            <span
                              key={i}
                              className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full"
                            >
                              {ingredient}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="mb-3">
                        <p className="text-xs font-medium text-gray-700 mb-2">
                          Nutrition:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          <NutritionBadge name="Calories" value={meal.nutrition?.calories} unit="kcal" type="calories" />
                          <NutritionBadge name="Protein" value={meal.nutrition?.protein} unit="g" type="protein" />
                          <NutritionBadge name="Carbs" value={meal.nutrition?.carbs} unit="g" type="carbs" />
                          <NutritionBadge name="Fats" value={meal.nutrition?.fats} unit="g" type="fats" />
                          {meal.nutrition?.iron && (
                            <NutritionBadge name="Iron" value={meal.nutrition?.iron} unit="mg" type="mineral" />
                          )}
                          {meal.nutrition?.calcium && (
                            <NutritionBadge name="Calcium" value={meal.nutrition?.calcium} unit="mg" type="mineral" />
                          )}
                          {meal.nutrition?.vitamin_c && (
                            <NutritionBadge name="Vit. C" value={meal.nutrition?.vitamin_c} unit="mg" type="vitamin" />
                          )}
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                        <div className="flex items-center">
                          <div className="flex items-center text-amber-500">
                            {Array(5).fill(0).map((_, i) => (
                              <Star key={i} fill={i < Math.round(meal.hybrid_score * 5) ? "currentColor" : "none"} className="h-4 w-4" />
                            ))}
                          </div>
                          <span className="text-xs font-medium text-gray-500 ml-2">
                            {Math.round(meal.hybrid_score * 100)}% match
                          </span>
                        </div>
                        
                        <Button variant="ghost" size="sm" className="text-pink-600 hover:text-pink-700 hover:bg-pink-50">
                          Save
                          <Heart className="ml-1 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  {!showAllMeals && recommendedMeals.length > 5 && (
                    <div className="text-center pt-2">
                      <Button
                        variant="outline"
                        className="border-orange-200 text-orange-700 hover:bg-orange-50"
                        onClick={() => setShowAllMeals(true)}
                      >
                        Show All {recommendedMeals.length} Recommendations
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
          
          {/* Meal Planner */}
          <Card className="bg-white shadow-xl border-0">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 border-b border-green-100">
              <h3 className="font-semibold text-lg text-gray-800 flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-green-600" />
                Weekly Meal Planner
              </h3>
            </div>
            <CardContent className="p-6">
              <MealPlanner meals={recommendedMeals} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default ResultsPanel;