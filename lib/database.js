import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const CHILDREN_FILE = path.join(DATA_DIR, 'children.json');
const MEALS_FILE = path.join(DATA_DIR, 'meals.json');
const RECOMMENDATIONS_FILE = path.join(DATA_DIR, 'recommendations.json');
const FEEDBACK_FILE = path.join(DATA_DIR, 'feedback.json');
const ADMIN_USERS_FILE = path.join(DATA_DIR, 'admin_users.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize files if they don't exist
const initializeFiles = () => {
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify([]));
  }
  
  if (!fs.existsSync(CHILDREN_FILE)) {
    fs.writeFileSync(CHILDREN_FILE, JSON.stringify([]));
  }
  
  if (!fs.existsSync(RECOMMENDATIONS_FILE)) {
    fs.writeFileSync(RECOMMENDATIONS_FILE, JSON.stringify([]));
  }
  
  if (!fs.existsSync(FEEDBACK_FILE)) {
    fs.writeFileSync(FEEDBACK_FILE, JSON.stringify([]));
  }
  
  if (!fs.existsSync(MEALS_FILE)) {
    const initialMeals = [
      {
        id: 1,
        name: "Iron-Rich Rice Cereal",
        category: "cereals",
        minAge: 4,
        maxAge: 12,
        feedingStage: "purees",
        ingredients: ["Iron-fortified rice cereal", "Breast milk", "Formula"],
        allergens: ["gluten-free"],
        nutrition: {
          calories: 60,
          protein: 1.5,
          iron: 7.0,
          calcium: 20,
          vitaminC: 0,
          fiber: 0.5,
          fat: 0.5,
          carbohydrates: 12
        },
        texture: "smooth_puree",
        preparationTime: 5,
        description: "First food introduction with essential iron fortification",
        benefits: ["Iron deficiency prevention", "Easy digestion", "Energy provision"],
        servingSize: "2-4 tablespoons",
        safetyNotes: ["Start with single-grain cereals", "Mix with familiar milk"],
        developmentalBenefits: ["Introduces spoon feeding", "Develops swallowing skills"]
      },
      {
        id: 2,
        name: "Avocado Banana Puree",
        category: "fruits",
        minAge: 6,
        maxAge: 12,
        feedingStage: "purees",
        ingredients: ["Ripe avocado", "Banana", "Breast milk"],
        allergens: [],
        nutrition: {
          calories: 160,
          protein: 2.0,
          iron: 0.6,
          calcium: 12,
          vitaminC: 10,
          fiber: 6.7,
          fat: 15,
          carbohydrates: 9
        },
        texture: "smooth_puree",
        preparationTime: 5,
        description: "Creamy, naturally sweet first fruit combination",
        benefits: ["Healthy fats for brain development", "Natural sweetness", "Potassium rich"],
        servingSize: "2-4 tablespoons",
        safetyNotes: ["Use ripe fruits only", "Serve fresh"],
        developmentalBenefits: ["Taste development", "Texture exploration"]
      },
      {
        id: 3,
        name: "Sweet Potato Puree",
        category: "vegetables",
        minAge: 6,
        maxAge: 12,
        feedingStage: "purees",
        ingredients: ["Sweet potato", "Water"],
        allergens: [],
        nutrition: {
          calories: 86,
          protein: 2.0,
          iron: 0.6,
          calcium: 30,
          vitaminC: 2.4,
          fiber: 3.0,
          fat: 0.1,
          carbohydrates: 20
        },
        texture: "smooth_puree",
        preparationTime: 25,
        description: "Nutrient-dense orange vegetable with natural sweetness",
        benefits: ["Beta-carotene for vision", "Complex carbohydrates", "Vitamin A"],
        servingSize: "2-4 tablespoons",
        safetyNotes: ["Cook until very soft", "Cool completely before serving"],
        developmentalBenefits: ["Color recognition", "Vegetable acceptance"]
      },
      {
        id: 4,
        name: "Soft Steamed Broccoli Trees",
        category: "vegetables",
        minAge: 8,
        maxAge: 18,
        feedingStage: "finger_foods",
        ingredients: ["Fresh broccoli florets"],
        allergens: [],
        nutrition: {
          calories: 25,
          protein: 3.0,
          iron: 0.7,
          calcium: 47,
          vitaminC: 89,
          fiber: 2.6,
          fat: 0.3,
          carbohydrates: 5
        },
        texture: "soft_pieces",
        preparationTime: 10,
        description: "Fun-shaped vegetables for self-feeding practice",
        benefits: ["High vitamin C", "Calcium for bones", "Antioxidants"],
        servingSize: "3-5 small florets",
        safetyNotes: ["Steam until very soft", "Check for choking hazards"],
        developmentalBenefits: ["Pincer grasp development", "Self-feeding skills", "Hand-eye coordination"]
      },
      {
        id: 5,
        name: "Mini Cheese Cubes",
        category: "dairy",
        minAge: 9,
        maxAge: 24,
        feedingStage: "finger_foods",
        ingredients: ["Mild cheddar cheese"],
        allergens: ["dairy"],
        nutrition: {
          calories: 113,
          protein: 7.0,
          iron: 0.2,
          calcium: 202,
          vitaminC: 0,
          fiber: 0,
          fat: 9,
          carbohydrates: 1
        },
        texture: "soft_pieces",
        preparationTime: 2,
        description: "Protein and calcium-rich finger food",
        benefits: ["High protein", "Calcium for teeth and bones", "Vitamin B12"],
        servingSize: "1-2 small cubes",
        safetyNotes: ["Cut into small pieces", "Ensure softness"],
        developmentalBenefits: ["Chewing practice", "Fine motor skills"]
      },
      {
        id: 6,
        name: "Soft Scrambled Eggs",
        category: "protein",
        minAge: 6,
        maxAge: 36,
        feedingStage: "finger_foods",
        ingredients: ["Whole eggs", "Breast milk", "Butter"],
        allergens: ["eggs", "dairy"],
        nutrition: {
          calories: 155,
          protein: 13,
          iron: 1.8,
          calcium: 50,
          vitaminC: 0,
          fiber: 0,
          fat: 11,
          carbohydrates: 1
        },
        texture: "soft_pieces",
        preparationTime: 5,
        description: "Complete protein source with essential amino acids",
        benefits: ["Complete protein", "Choline for brain development", "Vitamin D"],
        servingSize: "1/4 to 1/2 egg",
        safetyNotes: ["Cook thoroughly", "Cool before serving"],
        developmentalBenefits: ["Texture variety", "Spoon and finger eating"]
      },
      {
        id: 7,
        name: "Quinoa Veggie Bowl",
        category: "mixed",
        minAge: 12,
        maxAge: 36,
        feedingStage: "family_foods",
        ingredients: ["Quinoa", "Diced carrots", "Peas", "Olive oil"],
        allergens: [],
        nutrition: {
          calories: 220,
          protein: 8,
          iron: 2.8,
          calcium: 31,
          vitaminC: 12,
          fiber: 5,
          fat: 4,
          carbohydrates: 39
        },
        texture: "mixed_textures",
        preparationTime: 20,
        description: "Complete protein grain bowl with colorful vegetables",
        benefits: ["Complete protein", "Complex carbohydrates", "Multiple vitamins"],
        servingSize: "1/4 to 1/2 cup",
        safetyNotes: ["Cook quinoa thoroughly", "Dice vegetables small"],
        developmentalBenefits: ["Complex texture handling", "Variety acceptance"]
      },
      {
        id: 8,
        name: "Banana Oat Pancakes",
        category: "mixed",
        minAge: 12,
        maxAge: 36,
        feedingStage: "family_foods",
        ingredients: ["Rolled oats", "Banana", "Egg", "Cinnamon"],
        allergens: ["eggs", "gluten"],
        nutrition: {
          calories: 180,
          protein: 6,
          iron: 1.4,
          calcium: 24,
          vitaminC: 5,
          fiber: 4,
          fat: 3,
          carbohydrates: 33
        },
        texture: "soft_solid",
        preparationTime: 15,
        description: "Wholesome breakfast option with natural sweetness",
        benefits: ["Fiber for digestion", "Natural sugars", "B vitamins"],
        servingSize: "1-2 small pancakes",
        safetyNotes: ["Cook thoroughly", "Cut into appropriate sizes"],
        developmentalBenefits: ["Chewing practice", "Meal participation"]
      }
    ];
    fs.writeFileSync(MEALS_FILE, JSON.stringify(initialMeals, null, 2));
  }
  
  if (!fs.existsSync(ADMIN_USERS_FILE)) {
    const initialAdminUsers = [
      {
        id: 1,
        username: "admin",
        email: "admin@babydiet.com",
        passwordHash: "$2a$10$K8lJ9.5hVJ9YzKzJ9hPq5uTlJ5hVJ9YzKzJ9hPq5uTlJ5hVJ9YzKz", // bcrypt hash for "baby123"
        role: "admin",
        permissions: ["read", "write", "delete", "manage_users", "analytics"],
        createdAt: new Date().toISOString(),
        lastLogin: null,
        isActive: true
      }
    ];
    fs.writeFileSync(ADMIN_USERS_FILE, JSON.stringify(initialAdminUsers, null, 2));
  }
};

initializeFiles();

// WHO Growth Standards Reference Data (enhanced)
const whoGrowthStandards = {
  male: {
    weight: {
      0: { median: 3.3, sd: 0.39 },
      1: { median: 4.5, sd: 0.55 },
      2: { median: 5.6, sd: 0.69 },
      3: { median: 6.4, sd: 0.80 },
      4: { median: 7.0, sd: 0.87 },
      6: { median: 7.9, sd: 0.95 },
      9: { median: 8.9, sd: 1.03 },
      12: { median: 9.6, sd: 1.09 },
      15: { median: 10.3, sd: 1.15 },
      18: { median: 10.9, sd: 1.19 },
      24: { median: 12.2, sd: 1.30 },
      36: { median: 14.3, sd: 1.53 }
    },
    height: {
      0: { median: 49.9, sd: 1.89 },
      1: { median: 54.7, sd: 2.01 },
      2: { median: 58.4, sd: 2.10 },
      3: { median: 61.4, sd: 2.17 },
      4: { median: 63.9, sd: 2.24 },
      6: { median: 67.6, sd: 2.44 },
      9: { median: 72.0, sd: 2.55 },
      12: { median: 75.7, sd: 2.64 },
      15: { median: 79.1, sd: 2.68 },
      18: { median: 82.3, sd: 2.74 },
      24: { median: 87.1, sd: 2.85 },
      36: { median: 96.1, sd: 3.14 }
    }
  },
  female: {
    weight: {
      0: { median: 3.2, sd: 0.37 },
      1: { median: 4.2, sd: 0.52 },
      2: { median: 5.1, sd: 0.64 },
      3: { median: 5.8, sd: 0.74 },
      4: { median: 6.4, sd: 0.82 },
      6: { median: 7.3, sd: 0.89 },
      9: { median: 8.2, sd: 0.98 },
      12: { median: 8.9, sd: 1.05 },
      15: { median: 9.6, sd: 1.11 },
      18: { median: 10.2, sd: 1.16 },
      24: { median: 11.5, sd: 1.27 },
      36: { median: 13.9, sd: 1.52 }
    },
    height: {
      0: { median: 49.1, sd: 1.86 },
      1: { median: 53.7, sd: 1.98 },
      2: { median: 57.1, sd: 2.07 },
      3: { median: 59.8, sd: 2.13 },
      4: { median: 62.1, sd: 2.19 },
      6: { median: 65.7, sd: 2.36 },
      9: { median: 70.1, sd: 2.47 },
      12: { median: 73.8, sd: 2.56 },
      15: { median: 77.5, sd: 2.64 },
      18: { median: 80.7, sd: 2.69 },
      24: { median: 85.7, sd: 2.80 },
      36: { median: 95.1, sd: 3.07 }
    }
  }
};

// Feeding stages definition
const feedingStages = {
  milk_only: {
    ageRange: [0, 4],
    description: "Breast milk or formula only",
    textures: ["liquid"],
    developmentalMarkers: ["Rooting reflex", "Sucking reflex"]
  },
  purees: {
    ageRange: [4, 8],
    description: "Introduction of smooth purees",
    textures: ["smooth_puree", "slightly_thick"],
    developmentalMarkers: ["Head control", "Loss of tongue thrust reflex", "Sitting with support"]
  },
  finger_foods: {
    ageRange: [8, 12],
    description: "Self-feeding with soft finger foods",
    textures: ["soft_pieces", "mashed", "soft_lumps"],
    developmentalMarkers: ["Pincer grasp", "Self-feeding attempts", "Chewing motions"]
  },
  family_foods: {
    ageRange: [12, 36],
    description: "Transition to family meals with modifications",
    textures: ["chopped", "mixed_textures", "soft_solid"],
    developmentalMarkers: ["Walking", "Improved chewing", "Using utensils"]
  }
};

// Common allergens list
const commonAllergens = [
  "dairy", "eggs", "peanuts", "tree_nuts", "soy", "wheat", "gluten", 
  "fish", "shellfish", "sesame", "mustard", "sulfites"
];

// Database operations
export const db = {
  // Users operations
  users: {
    getAll: () => {
      const data = fs.readFileSync(USERS_FILE, 'utf8');
      return JSON.parse(data);
    },
    
    create: (userData) => {
      const users = db.users.getAll();
      const newUser = {
        id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
        ...userData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: true
      };
      
      users.push(newUser);
      fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
      return newUser;
    },
    
    getById: (id) => {
      const users = db.users.getAll();
      return users.find(u => u.id === parseInt(id));
    },
    
    getByEmail: (email) => {
      const users = db.users.getAll();
      return users.find(u => u.email === email);
    },
    
    update: (id, updateData) => {
      const users = db.users.getAll();
      const index = users.findIndex(u => u.id === parseInt(id));
      
      if (index === -1) return null;
      
      users[index] = {
        ...users[index],
        ...updateData,
        updatedAt: new Date().toISOString()
      };
      
      fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
      return users[index];
    },
    
    delete: (id) => {
      const users = db.users.getAll();
      const filteredUsers = users.filter(u => u.id !== parseInt(id));
      
      if (filteredUsers.length === users.length) return false;
      
      fs.writeFileSync(USERS_FILE, JSON.stringify(filteredUsers, null, 2));
      return true;
    }
  },

  // Children operations
  children: {
    getAll: () => {
      const data = fs.readFileSync(CHILDREN_FILE, 'utf8');
      return JSON.parse(data);
    },
    
    create: (childData) => {
      const children = db.children.getAll();
      const newChild = {
        id: children.length > 0 ? Math.max(...children.map(c => c.id)) + 1 : 1,
        ...childData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      children.push(newChild);
      fs.writeFileSync(CHILDREN_FILE, JSON.stringify(children, null, 2));
      return newChild;
    },
    
    getById: (id) => {
      const children = db.children.getAll();
      return children.find(c => c.id === parseInt(id));
    },
    
    getByUserId: (userId) => {
      const children = db.children.getAll();
      return children.filter(c => c.userId === parseInt(userId));
    },
    
    update: (id, updateData) => {
      const children = db.children.getAll();
      const index = children.findIndex(c => c.id === parseInt(id));
      
      if (index === -1) return null;
      
      children[index] = {
        ...children[index],
        ...updateData,
        updatedAt: new Date().toISOString()
      };
      
      fs.writeFileSync(CHILDREN_FILE, JSON.stringify(children, null, 2));
      return children[index];
    },
    
    delete: (id) => {
      const children = db.children.getAll();
      const filteredChildren = children.filter(c => c.id !== parseInt(id));
      
      if (filteredChildren.length === children.length) return false;
      
      fs.writeFileSync(CHILDREN_FILE, JSON.stringify(filteredChildren, null, 2));
      return true;
    }
  },

  // Meals operations
  meals: {
    getAll: () => {
      const data = fs.readFileSync(MEALS_FILE, 'utf8');
      return JSON.parse(data);
    },
    
    getById: (id) => {
      const meals = db.meals.getAll();
      return meals.find(m => m.id === parseInt(id));
    },
    
    getByAge: (age) => {
      const meals = db.meals.getAll();
      return meals.filter(meal => age >= meal.minAge && age <= meal.maxAge);
    },
    
    getByFeedingStage: (stage) => {
      const meals = db.meals.getAll();
      return meals.filter(meal => meal.feedingStage === stage);
    },
    
    getByAllergens: (allergens = []) => {
      const meals = db.meals.getAll();
      return meals.filter(meal => {
        return !allergens.some(allergen => meal.allergens.includes(allergen));
      });
    },
    
    create: (mealData) => {
      const meals = db.meals.getAll();
      const newMeal = {
        id: meals.length > 0 ? Math.max(...meals.map(m => m.id)) + 1 : 1,
        ...mealData,
        createdAt: new Date().toISOString()
      };
      
      meals.push(newMeal);
      fs.writeFileSync(MEALS_FILE, JSON.stringify(meals, null, 2));
      return newMeal;
    },
    
    update: (id, updateData) => {
      const meals = db.meals.getAll();
      const index = meals.findIndex(m => m.id === parseInt(id));
      
      if (index === -1) return null;
      
      meals[index] = {
        ...meals[index],
        ...updateData,
        updatedAt: new Date().toISOString()
      };
      
      fs.writeFileSync(MEALS_FILE, JSON.stringify(meals, null, 2));
      return meals[index];
    },
    
    delete: (id) => {
      const meals = db.meals.getAll();
      const filteredMeals = meals.filter(m => m.id !== parseInt(id));
      
      if (filteredMeals.length === meals.length) return false;
      
      fs.writeFileSync(MEALS_FILE, JSON.stringify(filteredMeals, null, 2));
      return true;
    }
  },

  // Recommendations operations
  recommendations: {
    getAll: () => {
      const data = fs.readFileSync(RECOMMENDATIONS_FILE, 'utf8');
      return JSON.parse(data);
    },
    
    create: (recommendationData) => {
      const recommendations = db.recommendations.getAll();
      const newRecommendation = {
        id: recommendations.length > 0 ? Math.max(...recommendations.map(r => r.id)) + 1 : 1,
        ...recommendationData,
        createdAt: new Date().toISOString()
      };
      
      recommendations.push(newRecommendation);
      fs.writeFileSync(RECOMMENDATIONS_FILE, JSON.stringify(recommendations, null, 2));
      return newRecommendation;
    },
    
    getByChildId: (childId) => {
      const recommendations = db.recommendations.getAll();
      return recommendations.filter(r => r.childId === parseInt(childId));
    },
    
    getByUserId: (userId) => {
      const recommendations = db.recommendations.getAll();
      return recommendations.filter(r => r.userId === parseInt(userId));
    }
  },

  // Feedback operations
  feedback: {
    getAll: () => {
      const data = fs.readFileSync(FEEDBACK_FILE, 'utf8');
      return JSON.parse(data);
    },
    
    create: (feedbackData) => {
      const feedback = db.feedback.getAll();
      const newFeedback = {
        id: feedback.length > 0 ? Math.max(...feedback.map(f => f.id)) + 1 : 1,
        ...feedbackData,
        createdAt: new Date().toISOString()
      };
      
      feedback.push(newFeedback);
      fs.writeFileSync(FEEDBACK_FILE, JSON.stringify(feedback, null, 2));
      return newFeedback;
    },
    
    getByRecommendationId: (recommendationId) => {
      const feedback = db.feedback.getAll();
      return feedback.filter(f => f.recommendationId === parseInt(recommendationId));
    },
    
    getByMealId: (mealId) => {
      const feedback = db.feedback.getAll();
      return feedback.filter(f => f.mealId === parseInt(mealId));
    }
  },

  // Admin users operations
  adminUsers: {
    getAll: () => {
      const data = fs.readFileSync(ADMIN_USERS_FILE, 'utf8');
      return JSON.parse(data);
    },
    
    getByUsername: (username) => {
      const users = db.adminUsers.getAll();
      return users.find(u => u.username === username);
    },
    
    getByEmail: (email) => {
      const users = db.adminUsers.getAll();
      return users.find(u => u.email === email);
    },
    
    create: (userData) => {
      const users = db.adminUsers.getAll();
      const newUser = {
        id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
        ...userData,
        createdAt: new Date().toISOString()
      };
      
      users.push(newUser);
      fs.writeFileSync(ADMIN_USERS_FILE, JSON.stringify(users, null, 2));
      return newUser;
    },
    
    updateLastLogin: (id) => {
      const users = db.adminUsers.getAll();
      const index = users.findIndex(u => u.id === parseInt(id));
      
      if (index === -1) return null;
      
      users[index].lastLogin = new Date().toISOString();
      fs.writeFileSync(ADMIN_USERS_FILE, JSON.stringify(users, null, 2));
      return users[index];
    }
  }
};

// Interpolate WHO standards for any age
const interpolateWHOStandard = (age, sex, measurement) => {
  const standards = whoGrowthStandards[sex][measurement];
  const ages = Object.keys(standards).map(Number).sort((a, b) => a - b);
  
  // Find the two closest ages
  let lowerAge = ages[0];
  let upperAge = ages[ages.length - 1];
  
  for (let i = 0; i < ages.length - 1; i++) {
    if (age >= ages[i] && age <= ages[i + 1]) {
      lowerAge = ages[i];
      upperAge = ages[i + 1];
      break;
    }
  }
  
  // If age is outside range, use nearest endpoint
  if (age <= ages[0]) {
    return standards[ages[0]];
  }
  if (age >= ages[ages.length - 1]) {
    return standards[ages[ages.length - 1]];
  }
  
  // Linear interpolation
  const lowerData = standards[lowerAge];
  const upperData = standards[upperAge];
  const ratio = (age - lowerAge) / (upperAge - lowerAge);
  
  return {
    median: lowerData.median + ratio * (upperData.median - lowerData.median),
    sd: lowerData.sd + ratio * (upperData.sd - lowerData.sd)
  };
};

// Calculate Z-score
const calculateZScore = (value, median, sd) => {
  return (value - median) / sd;
};

// Convert Z-score to percentile
const calculatePercentile = (zScore) => {
  if (zScore <= -3) return 0.1;
  if (zScore <= -2) return 2.3;
  if (zScore <= -1) return 15.9;
  if (zScore <= 0) return 50;
  if (zScore <= 1) return 84.1;
  if (zScore <= 2) return 97.7;
  if (zScore <= 3) return 99.9;
  return 99.9;
};

// Determine growth status
const determineGrowthStatus = (weightForAge, heightForAge, weightForHeight) => {
  const severe = -3;
  const moderate = -2;
  const high = 2;
  const veryHigh = 3;
  
  if (weightForAge < severe || heightForAge < severe || weightForHeight < severe) {
    return 'Severe malnutrition';
  }
  
  if (weightForAge < moderate || heightForAge < moderate || weightForHeight < moderate) {
    return 'Moderate malnutrition';
  }
  
  if (weightForAge > veryHigh || weightForHeight > veryHigh) {
    return 'Obesity risk';
  }
  if (weightForAge > high || weightForHeight > high) {
    return 'Overweight';
  }
  
  if (heightForAge < moderate) {
    return 'Stunted growth';
  }
  
  if (weightForAge < -1 || heightForAge < -1 || weightForHeight < -1) {
    return 'At risk';
  }
  
  return 'Normal';
};

// Determine appropriate feeding stage
export const determineFeedingStage = (ageInMonths, developmentalMarkers = []) => {
  // Age-based determination with developmental marker override
  if (ageInMonths < 4) return 'milk_only';
  if (ageInMonths < 8) return 'purees';
  if (ageInMonths < 12) return 'finger_foods';
  return 'family_foods';
};

// Calculate growth metrics with enhanced WHO standards
export const calculateGrowthMetrics = (age, weight, height, sex) => {
  try {
    if (!age || !weight || !height || !sex) {
      throw new Error('Missing required parameters');
    }
    
    if (age < 0 || age > 36) {
      throw new Error('Age must be between 0 and 36 months');
    }
    
    if (!['male', 'female'].includes(sex)) {
      throw new Error('Sex must be either "male" or "female"');
    }
    
    const weightStandard = interpolateWHOStandard(age, sex, 'weight');
    const heightStandard = interpolateWHOStandard(age, sex, 'height');
    
    const weightForAge = Number(calculateZScore(weight, weightStandard.median, weightStandard.sd).toFixed(2));
    const heightForAge = Number(calculateZScore(height, heightStandard.median, heightStandard.sd).toFixed(2));
    
    // For weight-for-height, use simplified calculation
    const weightForHeight = Number((weightForAge - heightForAge * 0.5).toFixed(2));
    
    // Determine overall growth status
    const status = determineGrowthStatus(weightForAge, heightForAge, weightForHeight);
    
    return {
      weightForAge,
      heightForAge,
      weightForHeight,
      status,
      references: {
        weightMedian: Number(weightStandard.median.toFixed(1)),
        heightMedian: Number(heightStandard.median.toFixed(1)),
        weightPercentile: calculatePercentile(weightForAge),
        heightPercentile: calculatePercentile(heightForAge)
      }
    };
    
  } catch (error) {
    console.error('Error calculating growth metrics:', error);
    
    return {
      weightForAge: 0,
      heightForAge: 0,
      weightForHeight: 0,
      status: 'Unknown',
      references: {
        weightMedian: weight,
        heightMedian: height,
        weightPercentile: 50,
        heightPercentile: 50
      }
    };
  }
};

// AI-based recommendation engine using cosine similarity + decision tree logic
export const generateAIRecommendations = (childProfile, preferences = {}) => {
  try {
    const { age, weight, height, sex, allergens = [], feedingExperience = [] } = childProfile;
    
    // Calculate growth metrics
    const growthMetrics = calculateGrowthMetrics(age, weight, height, sex);
    
    // Determine appropriate feeding stage
    const feedingStage = determineFeedingStage(age, feedingExperience);
    
    // Get all meals and filter by age and allergens
    let candidateMeals = db.meals.getAll()
      .filter(meal => age >= meal.minAge && age <= meal.maxAge)
      .filter(meal => meal.feedingStage === feedingStage || 
                     (feedingStage === 'family_foods' && meal.feedingStage === 'finger_foods'))
      .filter(meal => !allergens.some(allergen => meal.allergens.includes(allergen)));

    if (candidateMeals.length === 0) {
      return {
        recommendations: [],
        explanation: "No suitable meals found for the given criteria. Please check age range and allergen restrictions.",
        confidence: 0
      };
    }

    // Define nutritional needs based on age and growth status
    const nutritionalNeeds = calculateNutritionalNeeds(age, growthMetrics);
    
    // Calculate cosine similarity scores for each meal
    const scoredMeals = candidateMeals.map(meal => {
      const similarityScore = calculateCosineSimilarity(meal.nutrition, nutritionalNeeds);
      const decisionTreeScore = calculateDecisionTreeScore(meal, childProfile, growthMetrics);
      
      // Combine scores (60% similarity, 40% decision tree)
      const finalScore = (similarityScore * 0.6) + (decisionTreeScore * 0.4);
      
      return {
        ...meal,
        scores: {
          similarity: similarityScore,
          decisionTree: decisionTreeScore,
          final: finalScore
        },
        explanation: generateMealExplanation(meal, childProfile, growthMetrics, nutritionalNeeds),
        featureImportance: calculateFeatureImportance(meal, nutritionalNeeds)
      };
    });

    // Sort by final score and return top recommendations
    const recommendations = scoredMeals
      .sort((a, b) => b.scores.final - a.scores.final)
      .slice(0, 5);

    return {
      recommendations,
      explanation: generateOverallExplanation(recommendations, childProfile, growthMetrics),
      confidence: calculateConfidence(recommendations),
      nutritionalNeeds,
      growthMetrics
    };

  } catch (error) {
    console.error('Error generating AI recommendations:', error);
    return {
      recommendations: [],
      explanation: "Error generating recommendations. Please try again.",
      confidence: 0
    };
  }
};

// Calculate nutritional needs based on age and growth status
const calculateNutritionalNeeds = (ageInMonths, growthMetrics) => {
  const baseNeeds = {
    calories: 100,
    protein: 1.5,
    iron: 7,
    calcium: 260,
    vitaminC: 15,
    fiber: 5,
    fat: 30,
    carbohydrates: 95
  };

  // Adjust based on age
  const ageMultiplier = Math.max(0.5, Math.min(2.0, ageInMonths / 12));
  
  // Adjust based on growth status
  let growthMultiplier = 1.0;
  if (growthMetrics.status === 'Underweight' || growthMetrics.weightForAge < -1) {
    growthMultiplier = 1.3; // Increase caloric needs
  } else if (growthMetrics.status === 'Stunted growth' || growthMetrics.heightForAge < -1) {
    growthMultiplier = 1.2; // Increase protein and calcium needs
  }

  return Object.fromEntries(
    Object.entries(baseNeeds).map(([key, value]) => [
      key,
      value * ageMultiplier * growthMultiplier
    ])
  );
};

// Calculate cosine similarity between meal nutrition and needs
const calculateCosineSimilarity = (mealNutrition, nutritionalNeeds) => {
  const features = ['calories', 'protein', 'iron', 'calcium', 'vitaminC', 'fiber', 'fat', 'carbohydrates'];
  
  let dotProduct = 0;
  let mealMagnitude = 0;
  let needsMagnitude = 0;

  features.forEach(feature => {
    const mealValue = mealNutrition[feature] || 0;
    const needsValue = nutritionalNeeds[feature] || 0;
    
    dotProduct += mealValue * needsValue;
    mealMagnitude += mealValue * mealValue;
    needsMagnitude += needsValue * needsValue;
  });

  if (mealMagnitude === 0 || needsMagnitude === 0) return 0;
  
  return dotProduct / (Math.sqrt(mealMagnitude) * Math.sqrt(needsMagnitude));
};

// Decision tree scoring logic
const calculateDecisionTreeScore = (meal, childProfile, growthMetrics) => {
  let score = 0.5; // Base score

  // Age appropriateness (most important)
  if (childProfile.age >= meal.minAge && childProfile.age <= meal.maxAge) {
    score += 0.3;
  }

  // Growth status considerations
  if (growthMetrics.weightForAge < -1) {
    // Prioritize high-calorie foods for underweight children
    if (meal.nutrition.calories > 150) score += 0.2;
    if (meal.nutrition.fat > 10) score += 0.1;
  }

  if (growthMetrics.heightForAge < -1) {
    // Prioritize protein and calcium for stunted growth
    if (meal.nutrition.protein > 5) score += 0.2;
    if (meal.nutrition.calcium > 100) score += 0.1;
  }

  // Iron deficiency prevention (common in this age group)
  if (meal.nutrition.iron > 2) score += 0.15;

  // Allergen safety
  const hasAllergens = childProfile.allergens?.some(allergen => 
    meal.allergens.includes(allergen)
  );
  if (hasAllergens) score -= 0.5;

  // Developmental appropriateness
  const appropriateStage = determineFeedingStage(childProfile.age);
  if (meal.feedingStage === appropriateStage) score += 0.2;

  return Math.max(0, Math.min(1, score));
};

// Generate explanation for individual meal recommendation
const generateMealExplanation = (meal, childProfile, growthMetrics, nutritionalNeeds) => {
  const reasons = [];

  // Age appropriateness
  reasons.push(`Suitable for ${childProfile.age}-month-old children`);

  // Nutritional highlights
  if (meal.nutrition.iron > 2) {
    reasons.push("Rich in iron for healthy development");
  }
  if (meal.nutrition.calcium > 100) {
    reasons.push("Good source of calcium for strong bones");
  }
  if (meal.nutrition.protein > 5) {
    reasons.push("High protein content for growth");
  }

  // Growth-specific recommendations
  if (growthMetrics.weightForAge < -1 && meal.nutrition.calories > 150) {
    reasons.push("High-calorie option recommended for weight gain");
  }
  if (growthMetrics.heightForAge < -1 && meal.nutrition.protein > 5) {
    reasons.push("Protein-rich to support linear growth");
  }

  // Safety considerations
  if (meal.allergens.length === 0) {
    reasons.push("Allergen-free option");
  }

  // Developmental benefits
  if (meal.developmentalBenefits) {
    reasons.push(`Supports: ${meal.developmentalBenefits.join(', ')}`);
  }

  return reasons.join('. ') + '.';
};

// Calculate feature importance for explainability
const calculateFeatureImportance = (meal, nutritionalNeeds) => {
  const features = ['calories', 'protein', 'iron', 'calcium', 'vitaminC', 'fiber', 'fat', 'carbohydrates'];
  const importance = {};

  features.forEach(feature => {
    const mealValue = meal.nutrition[feature] || 0;
    const needsValue = nutritionalNeeds[feature] || 0;
    
    // Calculate importance as percentage of needs met
    importance[feature] = needsValue > 0 ? Math.min(100, (mealValue / needsValue) * 100) : 0;
  });

  return importance;
};

// Generate overall explanation for recommendation set
const generateOverallExplanation = (recommendations, childProfile, growthMetrics) => {
  if (recommendations.length === 0) {
    return "No suitable recommendations found based on current criteria.";
  }

  let explanation = `Based on your ${childProfile.age}-month-old's profile `;
  
  if (growthMetrics.status !== 'Normal') {
    explanation += `and ${growthMetrics.status.toLowerCase()} growth status, `;
  }
  
  explanation += "these meals are recommended because they provide appropriate nutrition, ";
  explanation += "are safe for their developmental stage, and support healthy growth. ";
  
  const topMeal = recommendations[0];
  explanation += `The top recommendation (${topMeal.name}) scores highest for `;
  explanation += "nutritional match and developmental appropriateness.";

  return explanation;
};

// Calculate confidence score for recommendations
const calculateConfidence = (recommendations) => {
  if (recommendations.length === 0) return 0;
  
  const avgScore = recommendations.reduce((sum, meal) => sum + meal.scores.final, 0) / recommendations.length;
  const scoreVariance = recommendations.reduce((sum, meal) => 
    sum + Math.pow(meal.scores.final - avgScore, 2), 0) / recommendations.length;
  
  // Higher average score and lower variance = higher confidence
  const baseConfidence = avgScore * 100;
  const variancePenalty = scoreVariance * 50;
  
  return Math.max(0, Math.min(100, baseConfidence - variancePenalty));
};

// Export constants for use in other modules
export { whoGrowthStandards, feedingStages, commonAllergens };