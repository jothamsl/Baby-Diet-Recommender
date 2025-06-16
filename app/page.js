"use client";

import { useState, useEffect } from "react";
import {
  Baby,
  Download,
  ChevronDown,
  Heart,
  Sparkles,
  ArrowRight,
  Settings,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { ComparativeGrowthChart } from "../components/comparative-growth-chart";
import { MealPlanner } from "../components/meal-planner";
import { getRecommendedMeals } from "../data/meals";

export default function Home() {
  const [formData, setFormData] = useState({
    age: "",
    weight: "",
    height: "",
    sex: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [recommendedMeals, setRecommendedMeals] = useState([]);
  const [showMealPlanner, setShowMealPlanner] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

   const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value) => {
    setFormData((prev) => ({ ...prev, sex: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate AI processing with a delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Calculate mock growth metrics
    const weightForAge = Number.parseFloat((Math.random() * 2 - 1).toFixed(1));
    const heightForAge = Number.parseFloat((Math.random() * 2 - 1).toFixed(1));
    const weightForHeight = Number.parseFloat(
      (Math.random() * 2 - 1).toFixed(1),
    );

    // Get recommended meals based on age and growth metrics
    const meals = getRecommendedMeals(
      Number.parseInt(formData.age),
      weightForAge,
      heightForAge,
      weightForHeight,
    );

    setRecommendedMeals(meals);
    setIsLoading(false);
    setSubmitted(true);

    // Delay showing results for smooth animation
    setTimeout(() => setShowResults(true), 300);
  };

  const resetForm = () => {
    setFormData({ age: "", weight: "", height: "", sex: "" });
    setSubmitted(false);
    setShowResults(false);
    setShowMealPlanner(false);
    setRecommendedMeals([]);
  };

  // Mock data for the results
  const growthMetrics = {
    weightForAge: Number.parseFloat((Math.random() * 2 - 1).toFixed(1)),
    heightForAge: Number.parseFloat((Math.random() * 2 - 1).toFixed(1)),
    weightForHeight: Number.parseFloat((Math.random() * 2 - 1).toFixed(1)),
    status: "Normal",
  };

  const babyGrowthData = {
    age: Number.parseInt(formData.age) || 8,
    value: Number.parseFloat(formData.weight) || 7.5,
  };

  return (
    <div className="min-h-dvh bg-gradient-to-br from-pink-50 via-rose-50 to-orange-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header - simplified animations */}
        <header className="text-center mb-8 relative">
          <div className="absolute top-0 right-0">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              onClick={() => window.location.href = '/admin'}
            >
              <Settings className="h-4 w-4" />
              Admin Dashboard
            </Button>
          </div>
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Baby className="h-16 w-16 text-pink-500" />
              <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-yellow-400" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            AI-Powered Diet Recommender for Babies
          </h1>
          <p className="text-gray-600 text-lg">
            Personalized meal plans using WHO growth standards
          </p>
        </header>

        {/* Main Content - Side by Side Layout */}
        <div className={`flex flex-col lg:flex-row gap-6 ${!showResults ? "justify-center" : ""}`}>
          {/* Left Side - Form */}
          <div className={`${showResults ? "lg:w-1/3 lg:max-w-md" : "max-w-md mx-auto"} flex-shrink-0`}>
            <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0 sticky top-8">
            <form onSubmit={handleSubmit} className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                  <Baby className="mr-2 h-5 w-5 text-pink-500" />
                  Baby Information
                </h2>
                {submitted && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={resetForm}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    New Analysis
                  </Button>
                )}
              </div>

              <div className="space-y-6">
                <div>
                  <Label htmlFor="age" className="text-gray-700 font-medium">
                    Age (months)
                  </Label>
                  <Input
                    id="age"
                    name="age"
                    type="number"
                    placeholder="e.g., 8"
                    value={formData.age}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                    className="mt-2 border-pink-200 focus:border-pink-400 disabled:opacity-50"
                  />
                </div>

                <div>
                  <Label htmlFor="weight" className="text-gray-700 font-medium">
                    Weight (kg)
                  </Label>
                  <Input
                    id="weight"
                    name="weight"
                    type="number"
                    step="0.1"
                    placeholder="e.g., 7.5"
                    value={formData.weight}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                    className="mt-2 border-pink-200 focus:border-pink-400 disabled:opacity-50"
                  />
                </div>

                <div>
                  <Label htmlFor="height" className="text-gray-700 font-medium">
                    Height/Length (cm)
                  </Label>
                  <Input
                    id="height"
                    name="height"
                    type="number"
                    step="0.1"
                    placeholder="e.g., 68.5"
                    value={formData.height}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                    className="mt-2 border-pink-200 focus:border-pink-400 disabled:opacity-50"
                  />
                </div>

                <div>
                  <Label htmlFor="sex" className="text-gray-700 font-medium">
                    Sex
                  </Label>
                  <Select
                    onValueChange={handleSelectChange}
                    value={formData.sex}
                    required
                    disabled={isLoading}
                  >
                    <SelectTrigger
                      id="sex"
                      className="mt-2 border-pink-200 focus:border-pink-400 disabled:opacity-50 w-full"
                    >
                      <SelectValue placeholder="Select sex" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full mt-8 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold py-3 rounded-lg shadow-lg"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Analyzing Growth...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Sparkles className="mr-2 h-5 w-5" />
                    Generate Recommendations
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </div>
                )}
              </Button>

              {/* Summary in form when submitted */}
              {submitted && showResults && (
                <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                  <h3 className="font-semibold text-green-800 mb-2 flex items-center">
                    <Heart className="mr-2 h-4 w-4" />
                    Analysis Complete
                  </h3>
                  <div className="text-sm text-green-700 space-y-1">
                    <div>Age: {formData.age} months</div>
                    <div>Weight: {formData.weight} kg</div>
                    <div>Height: {formData.height} cm</div>
                    <div>
                      Status:{" "}
                      <Badge className="bg-green-100 text-green-800 text-xs">
                        Normal Growth
                      </Badge>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </Card>
          </div>

          {/* Right Side - Results */}
          {submitted && showResults && (
            <div className="flex-1 lg:w-2/3">
              <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0 h-fit">
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {/* Header for Results */}
                    <div className="text-center lg:text-left">
                      <h2 className="text-3xl font-bold text-gray-800 mb-2 flex items-center justify-center lg:justify-start">
                        <Sparkles className="mr-2 h-8 w-8 text-yellow-500" />
                        Personalized Recommendations
                      </h2>
                      <p className="text-gray-600">
                        Crafted with love for your little one's healthy growth
                      </p>
                    </div>

                    {/* Growth Comparison Chart */}
                    <div>
                      <ComparativeGrowthChart
                        babyData={babyGrowthData}
                        type="weight"
                      />
                    </div>

                    {/* Growth Metrics Summary */}
                    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 shadow-xl border-0">
                      <CardContent className="p-6">
                        <h3 className="text-xl font-semibold mb-6 text-gray-800 flex items-center">
                          <Heart className="mr-2 h-5 w-5 text-red-500" />
                          Growth Metrics
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {[
                            {
                              label: "Weight-for-age",
                              value: growthMetrics.weightForAge,
                            },
                            {
                              label: "Height-for-age",
                              value: growthMetrics.heightForAge,
                            },
                            {
                              label: "Weight-for-height",
                              value: growthMetrics.weightForHeight,
                            },
                            {
                              label: "Status",
                              value: growthMetrics.status,
                              isStatus: true,
                            },
                          ].map((metric, index) => (
                            <div
                              key={index}
                              className="bg-white/70 p-4 rounded-xl shadow-md"
                            >
                              <p className="text-sm text-gray-500 mb-2">
                                {metric.label}
                              </p>
                              {metric.isStatus ? (
                                <Badge className="bg-green-100 text-green-800 text-base px-3 py-1">
                                  {metric.value}
                                </Badge>
                              ) : (
                                <p className="text-2xl font-bold text-gray-800">
                                  {metric.value}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Recommended Meals */}
                    <Card className="bg-gradient-to-r from-orange-50 to-pink-50 shadow-xl border-0">
                      <div className="p-6">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
                          <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                            <Sparkles className="mr-2 h-5 w-5 text-yellow-500" />
                            Recommended Meals
                          </h3>
                          <div className="flex gap-3">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex items-center gap-2"
                              onClick={() => setShowMealPlanner(!showMealPlanner)}
                            >
                              {showMealPlanner ? "Hide Planner" : "Show Planner"}
                            </Button>
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

                        <div className="space-y-4">
                          {recommendedMeals.slice(0, 3).map((meal, index) => (
                            <div
                              key={index}
                              className="bg-white/80 border border-pink-200 rounded-xl p-4 shadow-md"
                            >
                              <div className="flex justify-between items-start mb-3">
                                <h4 className="text-lg font-semibold text-gray-800">
                                  {meal.name}
                                </h4>
                                <Badge className="bg-gradient-to-r from-pink-100 to-rose-100 text-pink-800">
                                  {meal.tag}
                                </Badge>
                              </div>

                              <div className="mb-3">
                                <p className="text-sm font-medium text-gray-700 mb-2">
                                  Ingredients:
                                </p>
                                <div className="flex flex-wrap gap-1">
                                  {meal.ingredients
                                    .slice(0, 3)
                                    .map((ingredient, i) => (
                                      <span
                                        key={i}
                                        className="text-xs bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 px-2 py-1 rounded-full"
                                      >
                                        {ingredient}
                                      </span>
                                    ))}
                                  {meal.ingredients.length > 3 && (
                                    <span className="text-xs text-gray-500 px-2 py-1">
                                      +{meal.ingredients.length - 3} more
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="flex flex-wrap gap-1">
                                {Object.entries(meal.nutrition)
                                  .slice(0, 3)
                                  .map(([key, value]) => (
                                    <span
                                      key={key}
                                      className="text-xs bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 px-2 py-1 rounded-full"
                                    >
                                      {key.charAt(0).toUpperCase() +
                                        key.slice(1).replace("_", " ")}
                                      : {value}
                                    </span>
                                  ))}
                              </div>
                            </div>
                          ))}

                          {recommendedMeals.length > 3 && (
                            <div className="text-center">
                              <Button
                                variant="outline"
                                onClick={() => setShowMealPlanner(true)}
                              >
                                View All {recommendedMeals.length} Recommendations
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
