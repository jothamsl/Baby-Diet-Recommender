"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Download, 
  RefreshCw, 
  Baby, 
  Heart, 
  Sparkles, 
  Shield, 
  Eye, 
  EyeOff,
  ArrowLeft 
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

// Mock data - In a real app, this would come from an API or database
const mockUserData = [
  {
    id: 1,
    date: "2023-06-12",
    babyAge: 8,
    babyWeight: 7.5,
    babyHeight: 68.5,
    babySex: "female",
    weightForAge: 0.3,
    heightForAge: 0.2,
    weightForHeight: 0.5,
    recommendations: ["Avocado Puree", "Sweet Potato Mash", "Banana Oatmeal"],
  },
  {
    id: 2,
    date: "2023-06-13",
    babyAge: 12,
    babyWeight: 9.1,
    babyHeight: 74.2,
    babySex: "male",
    weightForAge: -0.2,
    heightForAge: 0.8,
    weightForHeight: -0.4,
    recommendations: ["Finger Foods", "Yogurt with Berries", "Lentil Soup"],
  },
  {
    id: 3,
    date: "2023-06-14",
    babyAge: 6,
    babyWeight: 6.8,
    babyHeight: 65.1,
    babySex: "female",
    weightForAge: -0.1,
    heightForAge: -0.3,
    weightForHeight: 0.2,
    recommendations: ["Rice Cereal", "Apple Puree", "Carrot Puree"],
  },
  {
    id: 4,
    date: "2023-06-15",
    babyAge: 18,
    babyWeight: 11.2,
    babyHeight: 82.3,
    babySex: "male",
    weightForAge: 0.7,
    heightForAge: 0.6,
    weightForHeight: 0.4,
    recommendations: ["Chicken Stew", "Tofu Cubes", "Fruit Medley"],
  },
  {
    id: 5,
    date: "2023-06-16",
    babyAge: 10,
    babyWeight: 8.3,
    babyHeight: 71.5,
    babySex: "female",
    weightForAge: 0.1,
    heightForAge: 0.4,
    weightForHeight: -0.1,
    recommendations: ["Soft Pasta", "Mashed Beans", "Mango Puree"],
  },
  {
    id: 6,
    date: "2023-06-17",
    babyAge: 4,
    babyWeight: 6.2,
    babyHeight: 62.8,
    babySex: "male",
    weightForAge: 0.3,
    heightForAge: 0.5,
    weightForHeight: 0.1,
    recommendations: ["Breast Milk/Formula", "Rice Cereal", "Applesauce"],
  },
  {
    id: 7,
    date: "2023-06-18",
    babyAge: 9,
    babyWeight: 8.1,
    babyHeight: 70.2,
    babySex: "female",
    weightForAge: 0.2,
    heightForAge: 0.3,
    weightForHeight: 0.1,
    recommendations: ["Avocado Slices", "Cottage Cheese", "Soft Vegetables"],
  },
  {
    id: 8,
    date: "2023-06-19",
    babyAge: 15,
    babyWeight: 10.5,
    babyHeight: 79.8,
    babySex: "male",
    weightForAge: 0.4,
    heightForAge: 0.6,
    weightForHeight: 0.2,
    recommendations: ["Fish Flakes", "Soft Cooked Vegetables", "Quinoa"],
  },
];

// Age groups for the visualization
const ageGroups = [
  { label: "0-3 months", min: 0, max: 3 },
  { label: "4-6 months", min: 4, max: 6 },
  { label: "7-9 months", min: 7, max: 9 },
  { label: "10-12 months", min: 10, max: 12 },
  { label: "13-18 months", min: 13, max: 18 },
  { label: "19-24 months", min: 19, max: 24 },
];

// Login Component
function LoginForm({ onLogin }) {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simulate authentication - In production, this would be a real API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (credentials.username === "admin" && credentials.password === "baby123") {
      onLogin();
    } else {
      setError("Invalid username or password");
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-dvh bg-gradient-to-br from-pink-50 via-rose-50 to-orange-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Shield className="h-16 w-16 text-pink-500" />
              <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-yellow-400" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Admin Access
          </h1>
          <p className="text-gray-600 text-lg">
            Secure login to Baby Diet Recommender Dashboard
          </p>
        </header>

        {/* Login Form */}
        <div className="max-w-md mx-auto">
          <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
            <form onSubmit={handleSubmit} className="p-6">
              <div className="flex items-center justify-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                  <Baby className="mr-2 h-5 w-5 text-pink-500" />
                  Admin Login
                </h2>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <Label htmlFor="username" className="text-gray-700 font-medium">
                    Username
                  </Label>
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="Enter username"
                    value={credentials.username}
                    onChange={(e) =>
                      setCredentials((prev) => ({
                        ...prev,
                        username: e.target.value,
                      }))
                    }
                    required
                    disabled={isLoading}
                    className="mt-2 border-pink-200 focus:border-pink-400 disabled:opacity-50"
                  />
                </div>

                <div>
                  <Label htmlFor="password" className="text-gray-700 font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password"
                      value={credentials.password}
                      onChange={(e) =>
                        setCredentials((prev) => ({
                          ...prev,
                          password: e.target.value,
                        }))
                      }
                      required
                      disabled={isLoading}
                      className="mt-2 border-pink-200 focus:border-pink-400 disabled:opacity-50 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
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
                    Authenticating...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Shield className="mr-2 h-5 w-5" />
                    Login to Dashboard
                  </div>
                )}
              </Button>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 mb-2">Demo Credentials:</p>
                <p className="text-xs text-gray-500">
                  Username: <span className="font-mono bg-gray-100 px-1 rounded">admin</span>
                </p>
                <p className="text-xs text-gray-500">
                  Password: <span className="font-mono bg-gray-100 px-1 rounded">baby123</span>
                </p>
              </div>

              <div className="mt-6 text-center">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => window.location.href = '/'}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to App
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(mockUserData);
  const [searchTerm, setSearchTerm] = useState("");
  const [ageFilter, setAgeFilter] = useState("all");
  const [loading, setLoading] = useState(false);

  // Get count of babies in each age group for the chart
  const getAgeGroupCounts = () => {
    const counts = ageGroups.map((group) => {
      const count = userData.filter(
        (user) => user.babyAge >= group.min && user.babyAge <= group.max
      ).length;
      return { group: group.label, count };
    });
    return counts;
  };

  // Filter user data based on search term and age filter
  const filteredData = userData.filter((user) => {
    const matchesSearch =
      searchTerm === "" ||
      user.id.toString().includes(searchTerm) ||
      user.babyWeight.toString().includes(searchTerm) ||
      user.babyHeight.toString().includes(searchTerm) ||
      user.babySex.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesAge =
      ageFilter === "all" ||
      (ageFilter === "0-6" && user.babyAge >= 0 && user.babyAge <= 6) ||
      (ageFilter === "7-12" && user.babyAge >= 7 && user.babyAge <= 12) ||
      (ageFilter === "13-24" && user.babyAge >= 13 && user.babyAge <= 24);

    return matchesSearch && matchesAge;
  });

  // Simulate refreshing data from an API
  const refreshData = () => {
    setLoading(true);
    setTimeout(() => {
      const refreshedData = mockUserData.map((user) => ({
        ...user,
        babyWeight: parseFloat((user.babyWeight + Math.random() * 0.2 - 0.1).toFixed(1)),
        weightForAge: parseFloat((user.weightForAge + Math.random() * 0.4 - 0.2).toFixed(1)),
      }));
      setUserData(refreshedData);
      setLoading(false);
    }, 1000);
  };

  // Export data as CSV
  const exportToCSV = () => {
    const headers = [
      "ID",
      "Date",
      "Age (months)",
      "Weight (kg)",
      "Height (cm)",
      "Sex",
      "Weight-for-age",
      "Height-for-age",
      "Weight-for-height",
      "Recommendations",
    ].join(",");

    const rows = userData.map((user) =>
      [
        user.id,
        user.date,
        user.babyAge,
        user.babyWeight,
        user.babyHeight,
        user.babySex,
        user.weightForAge,
        user.heightForAge,
        user.weightForHeight,
        `"${user.recommendations.join("; ")}"`,
      ].join(",")
    );

    const csv = [headers, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "baby-diet-data.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Helper function to render the growth status badge
  const renderGrowthBadge = (value) => {
    let color;
    let label;

    if (value < -2) {
      color = "bg-red-100 text-red-800";
      label = "Low";
    } else if (value > 2) {
      color = "bg-orange-100 text-orange-800";
      label = "High";
    } else {
      color = "bg-green-100 text-green-800";
      label = "Normal";
    }

    return (
      <Badge className={`${color}`}>
        {label} ({value})
      </Badge>
    );
  };

  // Enhanced visualization components
  const AgeDistributionChart = () => {
    const data = getAgeGroupCounts();
    
    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis 
            dataKey="group" 
            angle={-45}
            textAnchor="end"
            height={80}
            fontSize={12}
            stroke="#6b7280"
          />
          <YAxis stroke="#6b7280" />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '1px solid #f3f4f6',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
          />
          <Bar dataKey="count" fill="#ec4899" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  const GenderDistributionChart = () => {
    const maleCount = userData.filter((user) => user.babySex === "male").length;
    const femaleCount = userData.filter((user) => user.babySex === "female").length;
    
    const data = [
      { name: "Male", value: maleCount, color: "#fb7185" },
      { name: "Female", value: femaleCount, color: "#ec4899" },
    ];

    return (
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  const WeightTrendChart = () => {
    const sortedData = [...userData].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={sortedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis 
            dataKey="date" 
            fontSize={12}
            tickFormatter={(value) => new Date(value).toLocaleDateString()}
            stroke="#6b7280"
          />
          <YAxis stroke="#6b7280" />
          <Tooltip 
            labelFormatter={(value) => new Date(value).toLocaleDateString()}
            formatter={(value, name) => [value + " kg", "Weight"]}
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '1px solid #f3f4f6',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="babyWeight" 
            stroke="#f97316" 
            strokeWidth={2}
            dot={{ fill: "#f97316", r: 4 }}
            name="Weight (kg)"
          />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  // Handle logout
  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return <LoginForm onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-dvh bg-gradient-to-br from-pink-50 via-rose-50 to-orange-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-8">
          <div className="flex justify-between items-center mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.location.href = '/'}
              className="text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to App
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="text-gray-500 hover:text-gray-700 border-gray-300"
            >
              Logout
            </Button>
          </div>
          
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Baby className="h-16 w-16 text-pink-500" />
              <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-yellow-400" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 text-lg">
            Analytics and insights for baby diet recommendations
          </p>
        </header>

        {/* Top Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 flex items-center">
                <Heart className="mr-2 h-4 w-4 text-pink-500" />
                Total Records
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-800">{userData.length}</div>
              <div className="text-gray-500 text-sm mt-1">Active submissions</div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 flex items-center">
                <Baby className="mr-2 h-4 w-4 text-rose-500" />
                Avg. Age (months)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-800">
                {(
                  userData.reduce((sum, user) => sum + user.babyAge, 0) /
                  userData.length
                ).toFixed(1)}
              </div>
              <div className="text-gray-500 text-sm mt-1">Average age range</div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 flex items-center">
                <Sparkles className="mr-2 h-4 w-4 text-orange-500" />
                Avg. Weight (kg)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-800">
                {(
                  userData.reduce((sum, user) => sum + user.babyWeight, 0) /
                  userData.length
                ).toFixed(1)}
              </div>
              <div className="text-gray-500 text-sm mt-1">Average weight</div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 flex items-center">
                <Heart className="mr-2 h-4 w-4 text-pink-500" />
                Male/Female Ratio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-800">
                {userData.filter((user) => user.babySex === "male").length}
                :
                {userData.filter((user) => user.babySex === "female").length}
              </div>
              <div className="text-gray-500 text-sm mt-1">Gender distribution</div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Visualizations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800 flex items-center">
                <Baby className="mr-2 h-5 w-5 text-pink-500" />
                Age Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AgeDistributionChart />
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800 flex items-center">
                <Heart className="mr-2 h-5 w-5 text-rose-500" />
                Gender Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <GenderDistributionChart />
            </CardContent>
          </Card>
        </div>

        {/* Weight Trend Chart */}
        <Card className="mb-8 bg-white/80 backdrop-blur-sm shadow-xl border-0">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-800 flex items-center">
              <Sparkles className="mr-2 h-5 w-5 text-orange-500" />
              Weight Trends Over Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <WeightTrendChart />
          </CardContent>
        </Card>

        {/* Data Table */}
        <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <CardTitle className="text-xl font-semibold text-gray-800 flex items-center">
              <Baby className="mr-2 h-5 w-5 text-pink-500" />
              User Data Analytics
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={refreshData}
                disabled={loading}
                className="flex items-center gap-1 border-pink-200 text-pink-700 hover:bg-pink-50"
              >
                <RefreshCw
                  className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={exportToCSV}
                className="flex items-center gap-1 border-rose-200 text-rose-700 hover:bg-rose-50"
              >
                <Download className="h-4 w-4" />
                Export CSV
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6 p-4 bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg">
              <div className="sm:w-1/2">
                <Label htmlFor="search" className="text-gray-700 font-medium">
                  Search Records
                </Label>
                <Input
                  id="search"
                  placeholder="Search by ID, weight, height, sex..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="mt-1 border-pink-200 focus:border-pink-400"
                />
              </div>
              <div className="sm:w-1/4">
                <Label htmlFor="ageFilter" className="text-gray-700 font-medium">
                  Age Filter
                </Label>
                <Select
                  value={ageFilter}
                  onValueChange={setAgeFilter}
                >
                  <SelectTrigger id="ageFilter" className="w-full mt-1 border-pink-200 focus:border-pink-400">
                    <SelectValue placeholder="Filter by age" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Ages</SelectItem>
                    <SelectItem value="0-6">0-6 months</SelectItem>
                    <SelectItem value="7-12">7-12 months</SelectItem>
                    <SelectItem value="13-24">13-24 months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-pink-50 to-rose-50">
                    <TableHead className="font-semibold text-gray-700">ID</TableHead>
                    <TableHead className="font-semibold text-gray-700">Date</TableHead>
                    <TableHead className="font-semibold text-gray-700">Age (months)</TableHead>
                    <TableHead className="font-semibold text-gray-700">Weight (kg)</TableHead>
                    <TableHead className="font-semibold text-gray-700">Height (cm)</TableHead>
                    <TableHead className="font-semibold text-gray-700">Sex</TableHead>
                    <TableHead className="font-semibold text-gray-700">Weight for Age</TableHead>
                    <TableHead className="font-semibold text-gray-700">Height for Age</TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      Weight for Height
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">Recommendations</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center py-4">
                        No data found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredData.map((user) => (
                      <TableRow key={user.id} className="hover:bg-pink-50">
                        <TableCell>{user.id}</TableCell>
                        <TableCell>{user.date}</TableCell>
                        <TableCell>{user.babyAge}</TableCell>
                        <TableCell>{user.babyWeight}</TableCell>
                        <TableCell>{user.babyHeight}</TableCell>
                        <TableCell className="capitalize">{user.babySex}</TableCell>
                        <TableCell>{renderGrowthBadge(user.weightForAge)}</TableCell>
                        <TableCell>{renderGrowthBadge(user.heightForAge)}</TableCell>
                        <TableCell>
                          {renderGrowthBadge(user.weightForHeight)}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {user.recommendations.slice(0, 2).map((rec, i) => (
                              <span
                                key={i}
                                className="text-xs bg-pink-100 text-pink-800 px-1.5 py-0.5 rounded"
                              >
                                {rec}
                              </span>
                            ))}
                            {user.recommendations.length > 2 && (
                              <span className="text-xs text-gray-500">
                                +{user.recommendations.length - 2}
                              </span>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-end mt-4">
              <div className="text-sm text-gray-600">
                Showing {filteredData.length} of {userData.length} records
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}