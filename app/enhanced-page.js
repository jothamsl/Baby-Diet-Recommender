"use client";

import { useState, useEffect } from "react";
import {
  Baby,
  Download,
  Sparkles,
  ArrowRight,
  Heart,
  Settings,
  AlertTriangle,
  Check,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { ResultsPanel } from "@/components/results-panel";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NutritionBadge } from "@/components/nutrition-badge";

export default function Home() {
  // Form state
  const [formData, setFormData] = useState({
    age: "",
    weight: "",
    height: "",
    sex: "",
    allergies: "",
  });

  // Application state
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState(null);

  // Results state
  const [growthMetrics, setGrowthMetrics] = useState({
    weightForAge: 0,
    heightForAge: 0,
    weightForHeight: 0,
    status: "Normal",
  });
  const [recommendedMeals, setRecommendedMeals] = useState([]);

  // UI state
  const [activeSection, setActiveSection] = useState("input"); // 'input', 'education', 'about'

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
    setError(null);

    try {
      // In a real app with the Flask backend, we would call the API
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL ||
        "https://baby-diet-flask-backend.onrender.com";

      const response = await fetch(`${API_URL}/api/submissions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          age: Number.parseFloat(formData.age),
          weight: Number.parseFloat(formData.weight),
          height: Number.parseFloat(formData.height),
          sex: formData.sex,
          allergies: formData.allergies,
        }),
      });

      // For demo purposes, if the API isn't available, we'll mock the response
      let result;

      if (response.ok) {
        result = await response.json();
      } else {
        // Mock response for demo purposes
        console.warn("API not available, using mock data");
        result = mockAnalysisResponse(formData);
      }

      if (result.success) {
        const { growthMetrics: apiGrowthMetrics, recommendations } =
          result.data;

        // Update state with response
        setGrowthMetrics(apiGrowthMetrics);
        setRecommendedMeals(recommendations);

        // Delay showing results for smooth animation
        setTimeout(() => setShowResults(true), 300);
      } else {
        console.error("Error:", result.error);
        setError(result.error || "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Network error:", error);
      setError(
        "Unable to connect to the server. Please check your internet connection and try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      age: "",
      weight: "",
      height: "",
      sex: "",
      allergies: "",
    });
    setShowResults(false);
    setError(null);
    setRecommendedMeals([]);
    setGrowthMetrics({
      weightForAge: 0,
      heightForAge: 0,
      weightForHeight: 0,
      status: "Normal",
    });
  };

  // Function for demo mock response
  const mockAnalysisResponse = (formData) => {
    const age = parseFloat(formData.age) || 0;
    const weight = parseFloat(formData.weight) || 0;
    const height = parseFloat(formData.height) || 0;

    // Basic z-score calculation based on WHO averages (simplified for demo)
    const mockWeightZ = weight > 0 ? (weight - (age < 12 ? 8 : 10)) / 2 : 0;
    const mockHeightZ = height > 0 ? (height - (age < 12 ? 70 : 80)) / 5 : 0;

    let status = "Normal";
    if (mockWeightZ < -2) status = "Underweight";
    else if (mockWeightZ > 2) status = "Overweight";
    else if (mockHeightZ < -2) status = "Stunted";

    // Generate mock recommendations
    const mockMeals = [
      {
        name: "Carrot Apple Puree",
        age_range: "6-12 months",
        ingredients: ["Carrot", "Apple", "Cinnamon"],
        nutrition: {
          calories: 85,
          protein: 1.2,
          carbs: 20,
          fats: 0.5,
          vitamin_c: 10,
          iron: 0.8,
        },
        meal_type: "Breakfast",
        hybrid_score: 0.92,
        preparation_time: 15,
        description: "A sweet and nutritious puree perfect for breakfast.",
      },
      {
        name: "Sweet Potato & Chicken Mash",
        age_range: "8-24 months",
        ingredients: [
          "Sweet Potato",
          "Chicken Breast",
          "Olive Oil",
          "Rosemary",
        ],
        nutrition: {
          calories: 165,
          protein: 15,
          carbs: 18,
          fats: 4.5,
          vitamin_c: 3,
          iron: 1.2,
        },
        meal_type: "Lunch",
        hybrid_score: 0.88,
        preparation_time: 25,
        description: "Protein-rich meal that babies love.",
      },
      {
        name: "Banana Avocado Yogurt",
        age_range: "6-36 months",
        ingredients: ["Banana", "Avocado", "Greek Yogurt", "Honey"],
        nutrition: {
          calories: 120,
          protein: 5,
          carbs: 15,
          fats: 8,
          vitamin_c: 12,
          calcium: 150,
        },
        meal_type: "Snack",
        hybrid_score: 0.85,
        preparation_time: 5,
        description: "Quick nutritious snack with healthy fats.",
      },
      {
        name: "Spinach Lentil Stew",
        age_range: "10-36 months",
        ingredients: ["Spinach", "Red Lentils", "Carrot", "Cumin"],
        nutrition: {
          calories: 110,
          protein: 7,
          carbs: 16,
          fats: 2,
          iron: 3.5,
          vitamin_c: 8,
        },
        meal_type: "Dinner",
        hybrid_score: 0.82,
        preparation_time: 30,
        description: "Iron-rich vegetarian meal option.",
      },
      {
        name: "Oatmeal with Berries",
        age_range: "8-36 months",
        ingredients: ["Oats", "Blueberries", "Strawberries", "Milk"],
        nutrition: {
          calories: 140,
          protein: 4,
          carbs: 25,
          fats: 2.5,
          iron: 1.8,
          calcium: 120,
        },
        meal_type: "Breakfast",
        hybrid_score: 0.78,
        preparation_time: 10,
        description: "Fiber-rich breakfast with antioxidants from berries.",
      },
      {
        name: "Pumpkin & Bean Puree",
        age_range: "8-24 months",
        ingredients: ["Pumpkin", "White Beans", "Sage", "Olive Oil"],
        nutrition: {
          calories: 95,
          protein: 5,
          carbs: 14,
          fats: 3,
          iron: 1.5,
          vitamin_c: 6,
        },
        meal_type: "Lunch",
        hybrid_score: 0.75,
        preparation_time: 20,
        description: "Hearty vegetable and protein puree.",
      },
    ];

    return {
      success: true,
      data: {
        growthMetrics: {
          weightForAge: parseFloat(mockWeightZ.toFixed(1)),
          heightForAge: parseFloat(mockHeightZ.toFixed(1)),
          weightForHeight: parseFloat(
            ((weight / height) * 100 - 0.5).toFixed(1),
          ),
          status: status,
        },
        recommendations: mockMeals,
      },
    };
  };

  return (
    <div className="min-h-dvh bg-gradient-to-br from-pink-50 via-rose-50 to-orange-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header with logo and title */}
        <header className="text-center mb-10 relative">
          <div className="absolute top-0 right-0">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              onClick={() => (window.location.href = "/admin")}
            >
              <Settings className="h-4 w-4" />
              Admin Dashboard
            </Button>
          </div>

          <div className="flex justify-center mb-4">
            <div className="relative animate-bounce-gentle">
              <Baby className="h-16 w-16 text-pink-500" />
              <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-yellow-400 animate-twinkle" />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-rose-500 mb-3">
            Baby Diet Recommender
          </h1>

          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Personalized meal plans using WHO growth standards and AI-powered
            recommendations
          </p>

          {/* Navigation Tabs */}
          <div className="mt-8">
            <Tabs
              defaultValue={activeSection}
              onValueChange={setActiveSection}
              className="w-full"
            >
              <TabsList className="grid grid-cols-3 max-w-md mx-auto">
                <TabsTrigger value="input" className="text-sm md:text-base">
                  Get Recommendations
                </TabsTrigger>
                <TabsTrigger value="education" className="text-sm md:text-base">
                  Nutrition Guide
                </TabsTrigger>
                <TabsTrigger value="about" className="text-sm md:text-base">
                  About
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </header>

        {/* Main Content */}
        {activeSection === "input" && (
          <div
            className={`flex flex-col lg:flex-row gap-6 ${!showResults ? "justify-center" : ""}`}
          >
            {/* Left Side - Form */}
            <div
              className={`${showResults ? "lg:w-1/3 lg:max-w-md" : "max-w-md mx-auto"} flex-shrink-0`}
            >
              <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-0 rounded-xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-pink-50 to-purple-50 pb-4">
                  <CardTitle className="flex items-center text-xl font-semibold text-gray-800">
                    <Baby className="mr-2 h-5 w-5 text-pink-500" />
                    Child Information
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <form onSubmit={handleSubmit} className="p-2 pt-4">
                    <div className="space-y-6">
                      <div>
                        <Label
                          htmlFor="age"
                          className="text-gray-700 font-medium"
                        >
                          Age (months)
                        </Label>
                        <Input
                          id="age"
                          name="age"
                          type="number"
                          step="0.5"
                          placeholder="e.g., 8"
                          value={formData.age}
                          onChange={handleInputChange}
                          required
                          min="0"
                          max="36"
                          disabled={isLoading}
                          className="mt-2 border-pink-100 focus:border-pink-300 disabled:opacity-50"
                        />
                      </div>

                      <div>
                        <Label
                          htmlFor="weight"
                          className="text-gray-700 font-medium"
                        >
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
                          min="0"
                          disabled={isLoading}
                          className="mt-2 border-pink-100 focus:border-pink-300 disabled:opacity-50"
                        />
                      </div>

                      <div>
                        <Label
                          htmlFor="height"
                          className="text-gray-700 font-medium"
                        >
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
                          min="0"
                          disabled={isLoading}
                          className="mt-2 border-pink-100 focus:border-pink-300 disabled:opacity-50"
                        />
                      </div>

                      <div>
                        <Label
                          htmlFor="sex"
                          className="text-gray-700 font-medium"
                        >
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
                            className="mt-2 border-pink-100 focus:border-pink-300 disabled:opacity-50 w-full"
                          >
                            <SelectValue placeholder="Select sex" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label
                          htmlFor="allergies"
                          className="text-gray-700 font-medium"
                        >
                          Allergies (optional)
                        </Label>
                        <Input
                          id="allergies"
                          name="allergies"
                          placeholder="e.g., nuts, dairy, eggs"
                          value={formData.allergies}
                          onChange={handleInputChange}
                          disabled={isLoading}
                          className="mt-2 border-pink-100 focus:border-pink-300 disabled:opacity-50"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Separate multiple allergies with commas
                        </p>
                      </div>
                    </div>

                    {/* Error message */}
                    {error && (
                      <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-start">
                        <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                        <p>{error}</p>
                      </div>
                    )}

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full mt-6 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold py-3 rounded-lg shadow-lg transition-all duration-200"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
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
                    {showResults && (
                      <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                        <div className="flex items-start">
                          {growthMetrics.status === "Normal" ? (
                            <Check className="h-5 w-5 mr-2 text-green-600 mt-0.5" />
                          ) : (
                            <AlertTriangle className="h-5 w-5 mr-2 text-amber-600 mt-0.5" />
                          )}
                          <div>
                            <h3 className="font-semibold text-green-800 mb-2">
                              Analysis Complete
                            </h3>
                            <div className="text-sm text-green-700 space-y-1">
                              <div>
                                <span className="font-medium">Age:</span>{" "}
                                {formData.age} months
                              </div>
                              <div>
                                <span className="font-medium">Weight:</span>{" "}
                                {formData.weight} kg
                              </div>
                              <div>
                                <span className="font-medium">Height:</span>{" "}
                                {formData.height} cm
                              </div>
                              <div className="flex items-center">
                                <span className="font-medium mr-1">
                                  Status:
                                </span>
                                <Badge
                                  className={`
                                    ${
                                      growthMetrics.status === "Normal"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-amber-100 text-amber-800"
                                    } text-xs
                                  `}
                                >
                                  {growthMetrics.status}
                                </Badge>
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={resetForm}
                              className="mt-3 text-green-700 hover:text-green-800 hover:bg-green-100 px-0"
                            >
                              <ArrowRight className="mr-1 h-4 w-4" />
                              Start new analysis
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </form>
                </CardContent>
              </Card>

              {/* Nutritional Guide Preview Card (only shown when not showing results) */}
              {!showResults && (
                <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-0 rounded-xl overflow-hidden mt-6 hidden lg:block">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                      <Heart className="h-5 w-5 mr-2 text-pink-500" />
                      Nutrition Tip
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Iron is essential for brain development in babies. Good
                      sources include fortified cereals, pureed meats, and leafy
                      greens mixed with vitamin C rich foods to enhance
                      absorption.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveSection("education")}
                      className="w-full border-pink-200 text-pink-700 hover:bg-pink-50"
                    >
                      More Nutrition Tips
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Side - Results */}
            {showResults && (
              <div className="flex-1 lg:w-2/3">
                <ResultsPanel
                  childData={formData}
                  growthMetrics={growthMetrics}
                  recommendedMeals={recommendedMeals}
                  handleReset={resetForm}
                />
              </div>
            )}
          </div>
        )}

        {/* Education Section */}
        {activeSection === "education" && (
          <div className="max-w-3xl mx-auto">
            <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-0 rounded-xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                <CardTitle className="flex items-center text-xl font-semibold text-gray-800">
                  <Heart className="mr-2 h-5 w-5 text-red-500" />
                  Baby Nutrition Guide
                </CardTitle>
              </CardHeader>

              <CardContent className="p-6">
                <ScrollArea className="h-[600px] pr-4">
                  <div className="space-y-6">
                    <section>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        Age-Based Nutritional Needs
                      </h3>

                      <div className="space-y-4 mt-4">
                        <div className="border border-blue-100 rounded-lg p-4 bg-blue-50">
                          <h4 className="font-semibold text-blue-800 mb-2">
                            0-6 months
                          </h4>
                          <p className="text-blue-700 mb-2 text-sm">
                            Breast milk or formula provides all necessary
                            nutrients during this period.
                          </p>
                          <div className="flex flex-wrap gap-2 mt-3">
                            <NutritionBadge
                              name="Calories"
                              value="400-600"
                              unit="kcal/day"
                              type="calories"
                            />
                            <NutritionBadge
                              name="Protein"
                              value="9-11"
                              unit="g"
                              type="protein"
                            />
                            <NutritionBadge
                              name="Iron"
                              value="0.27-6"
                              unit="mg"
                              type="mineral"
                            />
                          </div>
                        </div>

                        <div className="border border-green-100 rounded-lg p-4 bg-green-50">
                          <h4 className="font-semibold text-green-800 mb-2">
                            6-12 months
                          </h4>
                          <p className="text-green-700 mb-2 text-sm">
                            Start introducing complementary foods while
                            continuing breast milk/formula.
                          </p>
                          <div className="flex flex-wrap gap-2 mt-3">
                            <NutritionBadge
                              name="Calories"
                              value="700-900"
                              unit="kcal/day"
                              type="calories"
                            />
                            <NutritionBadge
                              name="Protein"
                              value="11-14"
                              unit="g"
                              type="protein"
                            />
                            <NutritionBadge
                              name="Iron"
                              value="11"
                              unit="mg"
                              type="mineral"
                            />
                            <NutritionBadge
                              name="Calcium"
                              value="270"
                              unit="mg"
                              type="mineral"
                            />
                          </div>
                        </div>

                        <div className="border border-purple-100 rounded-lg p-4 bg-purple-50">
                          <h4 className="font-semibold text-purple-800 mb-2">
                            12-24 months
                          </h4>
                          <p className="text-purple-700 mb-2 text-sm">
                            Transition to family foods while ensuring nutrient
                            density remains high.
                          </p>
                          <div className="flex flex-wrap gap-2 mt-3">
                            <NutritionBadge
                              name="Calories"
                              value="900-1000"
                              unit="kcal/day"
                              type="calories"
                            />
                            <NutritionBadge
                              name="Protein"
                              value="13-16"
                              unit="g"
                              type="protein"
                            />
                            <NutritionBadge
                              name="Calcium"
                              value="500"
                              unit="mg"
                              type="mineral"
                            />
                            <NutritionBadge
                              name="Vitamin D"
                              value="15"
                              unit="μg"
                              type="vitamin"
                            />
                          </div>
                        </div>

                        <div className="border border-orange-100 rounded-lg p-4 bg-orange-50">
                          <h4 className="font-semibold text-orange-800 mb-2">
                            24-36 months
                          </h4>
                          <p className="text-orange-700 mb-2 text-sm">
                            Continue to offer nutritious foods from all food
                            groups as part of family meals.
                          </p>
                          <div className="flex flex-wrap gap-2 mt-3">
                            <NutritionBadge
                              name="Calories"
                              value="1000-1400"
                              unit="kcal/day"
                              type="calories"
                            />
                            <NutritionBadge
                              name="Protein"
                              value="16-20"
                              unit="g"
                              type="protein"
                            />
                            <NutritionBadge
                              name="Fiber"
                              value="19"
                              unit="g"
                              type="carbs"
                            />
                            <NutritionBadge
                              name="Iron"
                              value="7"
                              unit="mg"
                              type="mineral"
                            />
                          </div>
                        </div>
                      </div>
                    </section>

                    <section>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        Important Nutrients for Babies
                      </h3>
                      <p className="text-gray-600 mb-4">
                        These nutrients are especially crucial during early
                        development:
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="border rounded-lg p-4">
                          <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                            <NutritionBadge
                              name="Iron"
                              type="mineral"
                              className="mr-2"
                            />
                          </h4>
                          <p className="text-gray-600 text-sm">
                            Essential for brain development and oxygen
                            transport. Iron stores from birth deplete around 6
                            months, making iron-rich foods important.
                          </p>
                          <p className="text-gray-700 text-sm font-medium mt-2">
                            Sources: Fortified cereals, pureed meats, beans,
                            dark leafy greens
                          </p>
                        </div>

                        <div className="border rounded-lg p-4">
                          <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                            <NutritionBadge
                              name="Calcium"
                              type="mineral"
                              className="mr-2"
                            />
                          </h4>
                          <p className="text-gray-600 text-sm">
                            Vital for growing strong bones and teeth, muscle
                            function, and nervous system development.
                          </p>
                          <p className="text-gray-700 text-sm font-medium mt-2">
                            Sources: Dairy products, fortified plant milks,
                            tofu, broccoli
                          </p>
                        </div>

                        <div className="border rounded-lg p-4">
                          <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                            <NutritionBadge
                              name="DHA"
                              type="fats"
                              className="mr-2"
                            />
                          </h4>
                          <p className="text-gray-600 text-sm">
                            An omega-3 fatty acid crucial for brain and eye
                            development in infants and toddlers.
                          </p>
                          <p className="text-gray-700 text-sm font-medium mt-2">
                            Sources: Fatty fish, DHA-enriched eggs, algae-based
                            supplements
                          </p>
                        </div>

                        <div className="border rounded-lg p-4">
                          <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                            <NutritionBadge
                              name="Zinc"
                              type="mineral"
                              className="mr-2"
                            />
                          </h4>
                          <p className="text-gray-600 text-sm">
                            Supports immune function, protein synthesis, and
                            cellular growth. Important for taste development.
                          </p>
                          <p className="text-gray-700 text-sm font-medium mt-2">
                            Sources: Meat, poultry, beans, whole grains, yogurt
                          </p>
                        </div>
                      </div>
                    </section>

                    <section>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        Introducing Solid Foods
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Guidelines for starting complementary foods:
                      </p>

                      <div className="bg-rose-50 border border-rose-100 rounded-lg p-4 mb-4">
                        <h4 className="font-semibold text-rose-800 mb-2">
                          When to Start
                        </h4>
                        <ul className="list-disc list-inside text-rose-700 text-sm space-y-1">
                          <li>Around 6 months of age</li>
                          <li>
                            When baby can sit with support and has good head
                            control
                          </li>
                          <li>
                            Shows interest in food and can move food to the back
                            of mouth
                          </li>
                          <li>Has lost the tongue-thrust reflex</li>
                        </ul>
                      </div>

                      <div className="bg-amber-50 border border-amber-100 rounded-lg p-4">
                        <h4 className="font-semibold text-amber-800 mb-2">
                          First Foods to Try
                        </h4>
                        <p className="text-amber-700 text-sm mb-2">
                          Start with single-ingredient foods, offering one new
                          food every 3-5 days to watch for allergies:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <Badge className="bg-amber-100 text-amber-800">
                            Iron-fortified cereals
                          </Badge>
                          <Badge className="bg-amber-100 text-amber-800">
                            Pureed meats
                          </Badge>
                          <Badge className="bg-amber-100 text-amber-800">
                            Sweet potato
                          </Badge>
                          <Badge className="bg-amber-100 text-amber-800">
                            Avocado
                          </Badge>
                          <Badge className="bg-amber-100 text-amber-800">
                            Banana
                          </Badge>
                          <Badge className="bg-amber-100 text-amber-800">
                            Apple
                          </Badge>
                          <Badge className="bg-amber-100 text-amber-800">
                            Pear
                          </Badge>
                          <Badge className="bg-amber-100 text-amber-800">
                            Carrot
                          </Badge>
                          <Badge className="bg-amber-100 text-amber-800">
                            Squash
                          </Badge>
                        </div>
                      </div>
                    </section>

                    <div className="border-t border-gray-200 pt-6">
                      <p className="text-gray-500 text-sm italic">
                        Always consult with your pediatrician or a registered
                        dietitian for personalized nutritional advice for your
                        child.
                      </p>
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        )}

        {/* About Section */}
        {activeSection === "about" && (
          <div className="max-w-3xl mx-auto">
            <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-0 rounded-xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50">
                <CardTitle className="flex items-center text-xl font-semibold text-gray-800">
                  <Sparkles className="mr-2 h-5 w-5 text-purple-500" />
                  About Baby Diet Recommender
                </CardTitle>
              </CardHeader>

              <CardContent className="p-6">
                <div className="space-y-6">
                  <section>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Our Mission
                    </h3>
                    <p className="text-gray-600">
                      Baby Diet Recommender aims to provide personalized
                      nutrition guidance for infants and toddlers aged 0-36
                      months. By combining WHO growth standards with advanced AI
                      recommendation algorithms, we help parents make informed
                      decisions about their child's nutrition during these
                      crucial developmental years.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      How It Works
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div className="border border-purple-100 rounded-lg p-4 bg-purple-50">
                        <h4 className="font-semibold text-purple-800 mb-2 flex items-center">
                          <div className="bg-purple-200 text-purple-800 w-6 h-6 rounded-full flex items-center justify-center mr-2">
                            1
                          </div>
                          Input Data
                        </h4>
                        <p className="text-purple-700 text-sm">
                          We collect basic information about your child
                          including age, weight, height, and sex.
                        </p>
                      </div>

                      <div className="border border-indigo-100 rounded-lg p-4 bg-indigo-50">
                        <h4 className="font-semibold text-indigo-800 mb-2 flex items-center">
                          <div className="bg-indigo-200 text-indigo-800 w-6 h-6 rounded-full flex items-center justify-center mr-2">
                            2
                          </div>
                          Growth Analysis
                        </h4>
                        <p className="text-indigo-700 text-sm">
                          We analyze growth data against WHO standards using
                          z-scores to determine growth status.
                        </p>
                      </div>

                      <div className="border border-blue-100 rounded-lg p-4 bg-blue-50">
                        <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
                          <div className="bg-blue-200 text-blue-800 w-6 h-6 rounded-full flex items-center justify-center mr-2">
                            3
                          </div>
                          Meal Recommendations
                        </h4>
                        <p className="text-blue-700 text-sm">
                          Our AI engine provides personalized meal suggestions
                          based on nutritional needs.
                        </p>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Our Technology
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Baby Diet Recommender uses a hybrid AI approach combining:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border rounded-lg p-4">
                        <h4 className="font-semibold text-gray-800 mb-2">
                          Cosine Similarity
                        </h4>
                        <p className="text-gray-600 text-sm">
                          Matches a child's nutritional needs vector with meal
                          nutritional content vectors to find the closest
                          matches.
                        </p>
                      </div>
                      <div className="border rounded-lg p-4">
                        <h4 className="font-semibold text-gray-800 mb-2">
                          Decision Tree Regressor
                        </h4>
                        <p className="text-gray-600 text-sm">
                          Uses machine learning to improve recommendations based
                          on feedback from other similar children.
                        </p>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Privacy & Data Policy
                    </h3>
                    <p className="text-gray-600 mb-2">
                      We take your child's data privacy seriously. All data is:
                    </p>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>Encrypted in transit and at rest</li>
                      <li>Never shared with third parties</li>
                      <li>Only used to provide personalized recommendations</li>
                      <li>
                        Stored securely and anonymized for research purposes
                        (with consent)
                      </li>
                    </ul>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Disclaimer
                    </h3>
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
                      This tool is designed to provide general recommendations
                      and should not replace professional medical advice. Always
                      consult with your pediatrician or healthcare provider
                      regarding your child's specific nutritional needs and
                      before making significant changes to their diet.
                    </div>
                  </section>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-16 text-center text-gray-500 text-sm pb-8">
          <p className="mb-2">
            © {new Date().getFullYear()} Baby Diet Recommender. All rights
            reserved.
          </p>
          <div className="flex justify-center space-x-4">
            <a
              href="#"
              className="hover:text-gray-800 transition-colors duration-200"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="hover:text-gray-800 transition-colors duration-200"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="hover:text-gray-800 transition-colors duration-200"
            >
              Contact
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}
