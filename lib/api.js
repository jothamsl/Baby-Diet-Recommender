// API client for Baby Diet Recommender
// Handles all backend API communications with proper error handling

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://baby-diet-flask-backend.onrender.com";

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;

    const defaultOptions = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "omit", // Changed from 'include' to avoid CORS issues
      mode: "cors",
    };

    const config = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    };

    try {
      console.log(`API Request: ${config.method || "GET"} ${url}`);

      const response = await fetch(url, config);

      if (!response.ok) {
        const errorText = await response.text();
        let errorData;

        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { message: errorText || `HTTP ${response.status}` };
        }

        throw new Error(
          errorData.message || `Request failed with status ${response.status}`,
        );
      }

      const data = await response.json();
      console.log(
        `API Response: ${endpoint}`,
        data.success ? "Success" : "Failed",
      );

      return data;
    } catch (error) {
      console.error(`API Error for ${endpoint}:`, error);

      if (error.name === "TypeError" && error.message.includes("fetch")) {
        throw new Error(
          "Unable to connect to the server. Please make sure the backend is running on port 5001.",
        );
      }

      throw error;
    }
  }

  // Health check
  async healthCheck() {
    return this.request("/api/health");
  }

  // Get meals with filters
  async getMeals(filters = {}) {
    const queryParams = new URLSearchParams();

    if (filters.age_category)
      queryParams.append("age_category", filters.age_category);
    if (filters.meal_type) queryParams.append("meal_type", filters.meal_type);
    if (filters.allergens) queryParams.append("allergens", filters.allergens);

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/api/meals?${queryString}` : "/api/meals";

    return this.request(endpoint);
  }

  // Submit baby information for recommendations
  async submitBabyInfo(babyData) {
    return this.request("/api/submissions", {
      method: "POST",
      body: JSON.stringify(babyData),
    });
  }

  // Download meal plan
  async downloadMealPlan(mealPlanData) {
    const url = `${this.baseURL}/api/download-plan`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "omit", // Changed from 'include' to avoid CORS issues
        mode: "cors",
        body: JSON.stringify(mealPlanData),
      });

      if (!response.ok) {
        throw new Error(`Download failed with status ${response.status}`);
      }

      return response.blob();
    } catch (error) {
      console.error("Download error:", error);
      throw error;
    }
  }

  // Get nutrient requirements
  async getNutrientRequirements(params) {
    const queryParams = new URLSearchParams();

    if (params.age) queryParams.append("age", params.age);
    if (params.weight) queryParams.append("weight", params.weight);
    if (params.status) queryParams.append("status", params.status);

    const queryString = queryParams.toString();
    const endpoint = queryString
      ? `/api/nutrient-requirements?${queryString}`
      : "/api/nutrient-requirements";

    return this.request(endpoint);
  }

  // Calculate growth metrics
  async calculateGrowthMetrics(data) {
    return this.request("/api/growth-metrics", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // Get specific recommendations
  async getRecommendations(data) {
    return this.request("/api/recommendations", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // Admin endpoints
  async getAdminDashboard() {
    return this.request("/admin/");
  }

  async getAdminMeals() {
    return this.request("/admin/meals");
  }

  async getRecommendationsLog() {
    return this.request("/admin/recommendations");
  }

  async getSystemInfo() {
    return this.request("/admin/system-info");
  }
}

// Create singleton instance
const apiClient = new ApiClient();

// Export individual methods for easier use
export const healthCheck = () => apiClient.healthCheck();
export const getMeals = (filters) => apiClient.getMeals(filters);
export const submitBabyInfo = (data) => apiClient.submitBabyInfo(data);
export const downloadMealPlan = (data) => apiClient.downloadMealPlan(data);
export const getNutrientRequirements = (params) =>
  apiClient.getNutrientRequirements(params);
export const calculateGrowthMetrics = (data) =>
  apiClient.calculateGrowthMetrics(data);
export const getRecommendations = (data) => apiClient.getRecommendations(data);

// Admin exports
export const getAdminDashboard = () => apiClient.getAdminDashboard();
export const getAdminMeals = () => apiClient.getAdminMeals();
export const getRecommendationsLog = () => apiClient.getRecommendationsLog();
export const getSystemInfo = () => apiClient.getSystemInfo();

// Export the client instance for advanced usage
export default apiClient;

// Utility function to check if backend is available
export const checkBackendConnection = async () => {
  try {
    await healthCheck();
    return true;
  } catch (error) {
    console.error("Backend connection check failed:", error);
    return false;
  }
};

// Helper function for handling API errors in components
export const handleApiError = (
  error,
  fallbackMessage = "An unexpected error occurred",
) => {
  console.error("API Error:", error);

  if (error.message) {
    return error.message;
  }

  return fallbackMessage;
};
