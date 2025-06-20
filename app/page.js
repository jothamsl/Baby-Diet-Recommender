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
  Loader2,
  ChefHat,
  Apple,
  AlertCircle,
  CheckCircle,
  Info,
  BarChart,
  Utensils,
  User,
  Scale,
  Ruler,
  Calendar,
  FileText,
  Target,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { submitBabyInfo, downloadMealPlan, handleApiError } from "@/lib/api";
import ConnectionTest from "@/components/ConnectionTest";

export default function Home() {
  const [formData, setFormData] = useState({
    parent_name: "",
    name: "",
    age: "",
    weight: "",
    height: "",
    sex: "",
    allergies: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [activeTab, setActiveTab] = useState("recommendations");
  const [results, setResults] = useState(null);
  const [validationErrors, setValidationErrors] = useState([]);
  const [showConnectionTest, setShowConnectionTest] = useState(false);

  // Validation function
  const validateForm = () => {
    const errors = [];

    if (!formData.parent_name.trim()) {
      errors.push("Parent name is required");
    } else if (formData.parent_name.length > 50) {
      errors.push("Parent name must be 50 characters or less");
    }

    if (!formData.name.trim()) {
      errors.push("Baby name is required");
    } else if (formData.name.length > 50) {
      errors.push("Baby name must be 50 characters or less");
    }

    const age = parseFloat(formData.age);
    if (!formData.age || isNaN(age) || age < 0 || age > 36) {
      errors.push("Age must be between 0 and 36 months");
    }

    const weight = parseFloat(formData.weight);
    if (!formData.weight || isNaN(weight) || weight <= 0) {
      errors.push("Weight must be greater than 0");
    }

    const height = parseFloat(formData.height);
    if (!formData.height || isNaN(height) || height <= 0) {
      errors.push("Height must be greater than 0");
    }

    if (!formData.sex) {
      errors.push("Sex must be selected");
    }

    return errors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear validation errors when user starts typing
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
  };

  const handleSelectChange = (value) => {
    setFormData((prev) => ({ ...prev, sex: value }));
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    const errors = validateForm();
    if (errors.length > 0) {
      setValidationErrors(errors);
      toast.error("Please fix the form errors before submitting");
      return;
    }

    setIsLoading(true);
    setValidationErrors([]);

    try {
      const babyData = {
        parent_name: formData.parent_name.trim(),
        name: formData.name.trim(),
        age: parseFloat(formData.age),
        weight: parseFloat(formData.weight),
        height: parseFloat(formData.height),
        sex: formData.sex,
        allergies: formData.allergies.trim(),
      };

      const result = await submitBabyInfo(babyData);

      if (result.success) {
        setResults(result.data);
        setSubmitted(true);
        setShowResults(true);
        toast.success("Meal recommendations generated successfully!");
      } else {
        if (result.errors) {
          setValidationErrors(result.errors);
          toast.error("Please fix the form errors");
        } else {
          toast.error(result.message || "Failed to generate recommendations");
        }
      }
    } catch (error) {
      const errorMessage = handleApiError(error);
      toast.error(errorMessage);

      // Show connection test if it's a network error
      if (error.message && error.message.includes("connect to the server")) {
        setShowConnectionTest(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadPlan = async () => {
    if (!results) return;

    try {
      const mealPlanData = {
        baby_info: results.baby_info,
        meal_plan: results.meal_plan,
      };

      const blob = await downloadMealPlan(mealPlanData);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `meal_plan_${results.baby_info.name.replace(" ", "_")}_${new Date().getTime()}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success("Meal plan downloaded successfully!");
    } catch (error) {
      const errorMessage = handleApiError(
        error,
        "Failed to download meal plan",
      );
      toast.error(errorMessage);
    }
  };

  const resetForm = () => {
    setFormData({
      parent_name: "",
      name: "",
      age: "",
      weight: "",
      height: "",
      sex: "",
      allergies: "",
    });
    setSubmitted(false);
    setShowResults(false);
    setResults(null);
    setValidationErrors([]);
    setActiveTab("recommendations");
  };

  const renderNutritionalStatus = (status) => {
    const statusConfig = {
      Normal: { color: "bg-green-100 text-green-800", icon: CheckCircle },
      "Moderately underweight": {
        color: "bg-yellow-100 text-yellow-800",
        icon: AlertCircle,
      },
      "Severely underweight": {
        color: "bg-red-100 text-red-800",
        icon: AlertCircle,
      },
      Overweight: { color: "bg-orange-100 text-orange-800", icon: AlertCircle },
    };

    const config = statusConfig[status] || statusConfig["Normal"];
    const IconComponent = config.icon;

    return (
      <Badge className={config.color}>
        <IconComponent className="w-3 h-3 mr-1" />
        {status}
      </Badge>
    );
  };

  const renderMealRecommendation = (meal, index) => (
    <Card key={index} className="mb-4">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{meal.meal_name}</CardTitle>
            <CardDescription className="flex items-center gap-2 mt-2">
              <Badge variant="outline">{meal.similarity_score}% Match</Badge>
              <Badge variant="secondary">{meal.preparation_time} min</Badge>
              <Badge variant="secondary">{meal.difficulty}</Badge>
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">Meal ID</div>
            <div className="font-mono text-sm">{meal.meal_id}</div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2 flex items-center">
              <Apple className="w-4 h-4 mr-2" />
              Ingredients
            </h4>
            <p className="text-sm text-gray-600">{meal.ingredients}</p>
          </div>

          <div>
            <h4 className="font-semibold mb-2 flex items-center">
              <ChefHat className="w-4 h-4 mr-2" />
              Procedure
            </h4>
            <p className="text-sm text-gray-600">{meal.procedure}</p>
          </div>

          <Separator />

          <div>
            <h4 className="font-semibold mb-3 flex items-center">
              <Target className="w-4 h-4 mr-2" />
              Nutritional Information
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(meal.nutrition).map(([nutrient, value]) => {
                const percentage = meal.match_percentages[nutrient] || 0;
                const unit = nutrient === "calories" ? "kcal" : "g";

                return (
                  <div key={nutrient} className="text-center">
                    <div className="text-sm font-medium capitalize">
                      {nutrient}
                    </div>
                    <div className="text-lg font-bold">
                      {value}
                      {unit}
                    </div>
                    <Progress value={percentage} className="mt-1" />
                    <div className="text-xs text-gray-500 mt-1">
                      {percentage}% of target
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {meal.explanation && (
            <div>
              <h4 className="font-semibold mb-2">Match Explanation</h4>
              <p className="text-sm text-gray-600">{meal.explanation}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (!submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="bg-gradient-to-br from-blue-500 to-green-500 p-4 rounded-full">
                  <Baby className="h-12 w-12 text-white" />
                </div>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                AI-Based Nutrition Guide System
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Get personalized, age-appropriate meal recommendations for your
                baby (0-36 months) based on WHO growth standards and nutritional
                science.
              </p>
            </div>

            {/* Connection Test */}
            {showConnectionTest && (
              <div className="mb-6">
                <ConnectionTest />
              </div>
            )}

            {/* Validation Errors */}
            {validationErrors.length > 0 && (
              <Alert className="mb-6 border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertTitle className="text-red-800">
                  Please fix the following errors:
                </AlertTitle>
                <AlertDescription>
                  <ul className="list-disc list-inside mt-2 text-red-700">
                    {validationErrors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {/* Form */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <User className="mr-2 h-6 w-6" />
                  Baby Information
                </CardTitle>
                <CardDescription>
                  Please provide accurate information for the best meal
                  recommendations. All fields marked with * are required.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Parent Name */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="parent_name"
                        className="flex items-center"
                      >
                        <User className="w-4 h-4 mr-2" />
                        Parent/Caregiver Name *
                      </Label>
                      <Input
                        id="parent_name"
                        name="parent_name"
                        type="text"
                        value={formData.parent_name}
                        onChange={handleInputChange}
                        placeholder="Enter your name"
                        maxLength={50}
                        className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                        required
                      />
                      <div className="text-xs text-gray-500">
                        {formData.parent_name.length}/50 characters
                      </div>
                    </div>

                    {/* Baby Name */}
                    <div className="space-y-2">
                      <Label htmlFor="name" className="flex items-center">
                        <Baby className="w-4 h-4 mr-2" />
                        Baby Name *
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter baby's name"
                        maxLength={50}
                        className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                        required
                      />
                      <div className="text-xs text-gray-500">
                        {formData.name.length}/50 characters
                      </div>
                    </div>

                    {/* Age */}
                    <div className="space-y-2">
                      <Label htmlFor="age" className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        Age (months) *
                      </Label>
                      <Input
                        id="age"
                        name="age"
                        type="number"
                        min="0"
                        max="36"
                        step="0.1"
                        value={formData.age}
                        onChange={handleInputChange}
                        placeholder="0-36 months"
                        className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                        required
                      />
                      <div className="text-xs text-gray-500">
                        Range: 0-36 months
                      </div>
                    </div>

                    {/* Weight */}
                    <div className="space-y-2">
                      <Label htmlFor="weight" className="flex items-center">
                        <Scale className="w-4 h-4 mr-2" />
                        Weight (kg) *
                      </Label>
                      <Input
                        id="weight"
                        name="weight"
                        type="number"
                        min="0.1"
                        step="0.1"
                        value={formData.weight}
                        onChange={handleInputChange}
                        placeholder="Weight in kg"
                        className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                        required
                      />
                      <div className="text-xs text-gray-500">
                        Must be greater than 0
                      </div>
                    </div>

                    {/* Height */}
                    <div className="space-y-2">
                      <Label htmlFor="height" className="flex items-center">
                        <Ruler className="w-4 h-4 mr-2" />
                        Height (cm) *
                      </Label>
                      <Input
                        id="height"
                        name="height"
                        type="number"
                        min="1"
                        step="0.1"
                        value={formData.height}
                        onChange={handleInputChange}
                        placeholder="Height in cm"
                        className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                        required
                      />
                      <div className="text-xs text-gray-500">
                        Must be greater than 0
                      </div>
                    </div>

                    {/* Sex */}
                    <div className="space-y-2">
                      <Label className="flex items-center">
                        <User className="w-4 h-4 mr-2" />
                        Sex *
                      </Label>
                      <Select
                        value={formData.sex}
                        onValueChange={handleSelectChange}
                        required
                      >
                        <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-blue-500">
                          <SelectValue placeholder="Select sex" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Allergies */}
                  <div className="space-y-2">
                    <Label htmlFor="allergies" className="flex items-center">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      Known Allergies or Food Sensitivities (Optional)
                    </Label>
                    <Textarea
                      id="allergies"
                      name="allergies"
                      value={formData.allergies}
                      onChange={handleInputChange}
                      placeholder="List any known allergies separated by commas (e.g., eggs, dairy, nuts, gluten)"
                      className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                      rows={3}
                    />
                    <div className="text-xs text-gray-500">
                      This helps us filter out meals containing allergens. Leave
                      blank if none.
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-center pt-4 space-x-4">
                    <Button
                      type="submit"
                      size="lg"
                      disabled={isLoading}
                      className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white px-8 py-3 text-lg font-semibold rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Generating Recommendations...
                        </>
                      ) : (
                        <>
                          <ChefHat className="mr-2 h-5 w-5" />
                          Get Meal Recommendations
                        </>
                      )}
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      onClick={() => setShowConnectionTest(!showConnectionTest)}
                      className="px-6 py-3"
                    >
                      {showConnectionTest ? "Hide" : "Test"} Connection
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="p-6 text-center">
                  <BarChart className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-blue-900 mb-2">
                    WHO Standards
                  </h3>
                  <p className="text-sm text-blue-700">
                    Uses official WHO LMS growth charts for accurate Z-score
                    calculations
                  </p>
                </CardContent>
              </Card>

              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-6 text-center">
                  <Apple className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-green-900 mb-2">
                    Age-Appropriate
                  </h3>
                  <p className="text-sm text-green-700">
                    Meals categorized by age groups with appropriate textures
                    and nutrients
                  </p>
                </CardContent>
              </Card>

              <Card className="border-purple-200 bg-purple-50">
                <CardContent className="p-6 text-center">
                  <Heart className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-purple-900 mb-2">
                    Safety First
                  </h3>
                  <p className="text-sm text-purple-700">
                    Allergen filtering and age-appropriate food safety
                    recommendations
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Results View
  if (results && showResults) {
    // Check if baby is too young for solid foods
    if (results.age_category === 0) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
              <Card className="shadow-lg">
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="bg-gradient-to-br from-blue-500 to-green-500 p-4 rounded-full">
                      <Baby className="h-12 w-12 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-2xl">
                    {results.baby_info.name} is Too Young for Solid Foods
                  </CardTitle>
                  <CardDescription>
                    At {results.baby_info.age_months} months old, exclusive
                    breastfeeding is recommended.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Alert className="mb-6 border-blue-200 bg-blue-50">
                    <Info className="h-4 w-4 text-blue-600" />
                    <AlertTitle className="text-blue-800">
                      {results.breastfeeding_advice.primary_recommendation}
                    </AlertTitle>
                    <AlertDescription>
                      <ul className="list-disc list-inside mt-2 text-blue-700 space-y-1">
                        {results.breastfeeding_advice.key_points.map(
                          (point, index) => (
                            <li key={index}>{point}</li>
                          ),
                        )}
                      </ul>
                    </AlertDescription>
                  </Alert>

                  <Alert className="mb-6 border-amber-200 bg-amber-50">
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                    <AlertTitle className="text-amber-800">
                      Important Notice
                    </AlertTitle>
                    <AlertDescription className="text-amber-700">
                      {results.breastfeeding_advice.warning}
                    </AlertDescription>
                  </Alert>

                  <div className="text-center">
                    <Button onClick={resetForm} variant="outline">
                      <ArrowRight className="mr-2 h-4 w-4" />
                      Start New Assessment
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="bg-gradient-to-br from-blue-500 to-green-500 p-4 rounded-full">
                  <ChefHat className="h-12 w-12 text-white" />
                </div>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Meal Recommendations for {results.baby_info.name}
              </h1>
              <p className="text-gray-600">
                Personalized nutrition plan based on WHO growth standards
              </p>
              <div className="flex justify-center gap-4 mt-4">
                <Button
                  onClick={handleDownloadPlan}
                  variant="outline"
                  size="sm"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Plan (CSV)
                </Button>
                <Button onClick={resetForm} variant="outline" size="sm">
                  <ArrowRight className="mr-2 h-4 w-4" />
                  New Assessment
                </Button>
              </div>
            </div>

            {/* Baby Information Summary */}
            <Card className="mb-8 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Baby Information & Growth Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-sm text-gray-600">Age</div>
                    <div className="text-lg font-bold">
                      {results.baby_info.age} months
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-600">Weight</div>
                    <div className="text-lg font-bold">
                      {results.baby_info.weight} kg
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-600">Height</div>
                    <div className="text-lg font-bold">
                      {results.baby_info.height} cm
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-600">Sex</div>
                    <div className="text-lg font-bold capitalize">
                      {results.baby_info.sex}
                    </div>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-sm text-gray-600">
                      Nutritional Status
                    </div>
                    <div className="mt-2">
                      {renderNutritionalStatus(
                        results.growth_metrics.nutritional_status,
                      )}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-600">
                      Weight-for-Age Z-Score
                    </div>
                    <div className="text-lg font-bold">
                      {results.growth_metrics.weight_z_score}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-600">
                      Height-for-Age Z-Score
                    </div>
                    <div className="text-lg font-bold">
                      {results.growth_metrics.height_z_score}
                    </div>
                  </div>
                </div>

                {results.baby_info.allergens &&
                  results.baby_info.allergens.length > 0 && (
                    <div className="mt-4">
                      <div className="text-sm text-gray-600 mb-2">
                        Allergens to Avoid:
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {results.baby_info.allergens.map((allergen, index) => (
                          <Badge key={index} variant="destructive">
                            {allergen}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
              </CardContent>
            </Card>

            {/* Daily Nutritional Needs */}
            <Card className="mb-8 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="mr-2 h-5 w-5" />
                  Daily Nutritional Needs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-sm text-gray-600">Total Calories</div>
                    <div className="text-2xl font-bold text-blue-600">
                      {results.growth_metrics.daily_needs.calories}
                    </div>
                    <div className="text-xs text-gray-500">kcal/day</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-600">Protein</div>
                    <div className="text-2xl font-bold text-green-600">
                      {results.growth_metrics.daily_needs.protein}
                    </div>
                    <div className="text-xs text-gray-500">g/day</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-600">Fat</div>
                    <div className="text-2xl font-bold text-orange-600">
                      {results.growth_metrics.daily_needs.fat}
                    </div>
                    <div className="text-xs text-gray-500">g/day</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-600">Carbohydrates</div>
                    <div className="text-2xl font-bold text-purple-600">
                      {results.growth_metrics.daily_needs.carbohydrates}
                    </div>
                    <div className="text-xs text-gray-500">g/day</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Meal Plan Tabs */}
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger
                  value="recommendations"
                  className="flex items-center gap-2"
                >
                  <Utensils className="h-4 w-4" />
                  All Meals
                </TabsTrigger>
                <TabsTrigger
                  value="breakfast"
                  className="flex items-center gap-2"
                >
                  <ChefHat className="h-4 w-4" />
                  Breakfast (30%)
                </TabsTrigger>
                <TabsTrigger value="lunch" className="flex items-center gap-2">
                  <Apple className="h-4 w-4" />
                  Lunch (40%)
                </TabsTrigger>
              </TabsList>

              {/* All Recommendations Tab */}
              <TabsContent value="recommendations" className="mt-6">
                <div className="space-y-8">
                  {Object.entries(results.meal_plan).map(
                    ([mealType, mealInfo]) => (
                      <Card key={mealType} className="shadow-lg">
                        <CardHeader>
                          <CardTitle className="text-xl capitalize flex items-center justify-between">
                            <div className="flex items-center">
                              {mealType === "breakfast" && (
                                <ChefHat className="mr-2 h-5 w-5" />
                              )}
                              {mealType === "lunch" && (
                                <Apple className="mr-2 h-5 w-5" />
                              )}
                              {mealType === "dinner" && (
                                <Utensils className="mr-2 h-5 w-5" />
                              )}
                              {mealType} Recommendations
                            </div>
                            <Badge variant="outline">
                              {mealType === "breakfast" &&
                                "30% of daily nutrition"}
                              {mealType === "lunch" && "40% of daily nutrition"}
                              {mealType === "dinner" &&
                                "30% of daily nutrition"}
                            </Badge>
                          </CardTitle>
                          <CardDescription>
                            Target: {mealInfo.target_nutrition.calories} kcal,{" "}
                            {mealInfo.target_nutrition.protein}g protein,{" "}
                            {mealInfo.target_nutrition.fat}g fat,{" "}
                            {mealInfo.target_nutrition.carbohydrates}g carbs
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {mealInfo.recommendations &&
                            mealInfo.recommendations.length > 0 ? (
                              mealInfo.recommendations.map((meal, index) =>
                                renderMealRecommendation(
                                  meal,
                                  `${mealType}-${index}`,
                                ),
                              )
                            ) : (
                              <Alert>
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>
                                  No suitable meals found for this category.
                                  This may be due to allergen restrictions or
                                  limited meal options for this age group.
                                </AlertDescription>
                              </Alert>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ),
                  )}
                </div>
              </TabsContent>

              {/* Individual Meal Type Tabs */}
              {Object.entries(results.meal_plan).map(([mealType, mealInfo]) => (
                <TabsContent key={mealType} value={mealType} className="mt-6">
                  <Card className="shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-2xl capitalize flex items-center">
                        {mealType === "breakfast" && (
                          <ChefHat className="mr-2 h-6 w-6" />
                        )}
                        {mealType === "lunch" && (
                          <Apple className="mr-2 h-6 w-6" />
                        )}
                        {mealType === "dinner" && (
                          <Utensils className="mr-2 h-6 w-6" />
                        )}
                        {mealType} Options
                      </CardTitle>
                      <CardDescription>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                          <div className="text-center">
                            <div className="text-sm text-gray-600">
                              Target Calories
                            </div>
                            <div className="text-lg font-bold">
                              {mealInfo.target_nutrition.calories} kcal
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm text-gray-600">
                              Target Protein
                            </div>
                            <div className="text-lg font-bold">
                              {mealInfo.target_nutrition.protein}g
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm text-gray-600">
                              Target Fat
                            </div>
                            <div className="text-lg font-bold">
                              {mealInfo.target_nutrition.fat}g
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm text-gray-600">
                              Target Carbs
                            </div>
                            <div className="text-lg font-bold">
                              {mealInfo.target_nutrition.carbohydrates}g
                            </div>
                          </div>
                        </div>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {mealInfo.recommendations &&
                        mealInfo.recommendations.length > 0 ? (
                          mealInfo.recommendations.map((meal, index) =>
                            renderMealRecommendation(
                              meal,
                              `${mealType}-detail-${index}`,
                            ),
                          )
                        ) : (
                          <Alert>
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                              No suitable meals found for this category. This
                              may be due to allergen restrictions or limited
                              meal options for this age group.
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 mt-8">
              <Button
                onClick={handleDownloadPlan}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Download className="mr-2 h-5 w-5" />
                Download Full Plan (CSV)
              </Button>
              <Button onClick={resetForm} variant="outline" size="lg">
                <ArrowRight className="mr-2 h-5 w-5" />
                New Assessment
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
