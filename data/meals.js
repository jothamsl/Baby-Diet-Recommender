// Comprehensive database of baby meals organized by age range
export const mealDatabase = {
  // 6-8 months
  "6-8": [
    {
      id: 1,
      name: "Mashed Sweet Potato & Lentils",
      ingredients: ["Sweet potato", "Red lentils", "Olive oil", "Cinnamon"],
      nutrition: {
        calories: 120,
        protein: "4g",
        iron: "2mg",
        fiber: "3g",
      },
      tag: "Rich in Iron",
      allergies: [],
      ageRange: "6-8",
      texture: "Smooth puree",
    },
    {
      id: 2,
      name: "Banana Avocado Puree",
      ingredients: ["Ripe banana", "Avocado", "Breast milk or formula"],
      nutrition: {
        calories: 150,
        protein: "2g",
        fat: "9g",
        potassium: "450mg",
      },
      tag: "Healthy Fats",
      allergies: [],
      ageRange: "6-8",
      texture: "Smooth puree",
    },
    {
      id: 3,
      name: "Apple Oatmeal",
      ingredients: ["Apple", "Oats", "Cinnamon", "Breast milk or formula"],
      nutrition: {
        calories: 110,
        protein: "3g",
        fiber: "4g",
        iron: "1mg",
      },
      tag: "Fiber-rich",
      allergies: ["Gluten"],
      ageRange: "6-8",
      texture: "Smooth puree",
    },
    {
      id: 4,
      name: "Pear and Spinach Puree",
      ingredients: ["Pear", "Spinach", "Breast milk or formula"],
      nutrition: {
        calories: 90,
        protein: "1g",
        iron: "1.5mg",
        vitamin_c: "8mg",
      },
      tag: "Vitamin-rich",
      allergies: [],
      ageRange: "6-8",
      texture: "Smooth puree",
    },
    {
      id: 5,
      name: "Carrot and Apple Puree",
      ingredients: ["Carrots", "Apple", "Breast milk or formula"],
      nutrition: {
        calories: 85,
        protein: "1g",
        vitamin_a: "300mcg",
        fiber: "2g",
      },
      tag: "Vitamin A-rich",
      allergies: [],
      ageRange: "6-8",
      texture: "Smooth puree",
    },
  ],

  // 9-11 months
  "9-11": [
    {
      id: 6,
      name: "Soft Vegetable Risotto",
      ingredients: ["Arborio rice", "Carrots", "Peas", "Vegetable stock", "Parmesan cheese"],
      nutrition: {
        calories: 180,
        protein: "5g",
        calcium: "120mg",
        iron: "1.5mg",
      },
      tag: "Balanced Meal",
      allergies: ["Dairy"],
      ageRange: "9-11",
      texture: "Soft with small lumps",
    },
    {
      id: 7,
      name: "Chicken and Sweet Potato Mash",
      ingredients: ["Chicken breast", "Sweet potato", "Peas", "Olive oil"],
      nutrition: {
        calories: 160,
        protein: "12g",
        iron: "1.8mg",
        zinc: "1.2mg",
      },
      tag: "Protein-rich",
      allergies: [],
      ageRange: "9-11",
      texture: "Soft with small lumps",
    },
    {
      id: 8,
      name: "Lentil and Vegetable Soup",
      ingredients: ["Red lentils", "Carrots", "Zucchini", "Onion", "Vegetable stock"],
      nutrition: {
        calories: 140,
        protein: "7g",
        iron: "3mg",
        fiber: "5g",
      },
      tag: "Iron-rich",
      allergies: [],
      ageRange: "9-11",
      texture: "Soft with small lumps",
    },
    {
      id: 9,
      name: "Banana Pancakes",
      ingredients: ["Banana", "Egg", "Whole wheat flour", "Cinnamon"],
      nutrition: {
        calories: 170,
        protein: "6g",
        carbs: "25g",
        fiber: "3g",
      },
      tag: "Finger Food",
      allergies: ["Eggs", "Gluten"],
      ageRange: "9-11",
      texture: "Soft finger food",
    },
    {
      id: 10,
      name: "Yogurt with Mashed Berries",
      ingredients: ["Plain yogurt", "Mixed berries", "Ground flaxseed"],
      nutrition: {
        calories: 120,
        protein: "5g",
        calcium: "200mg",
        vitamin_c: "15mg",
      },
      tag: "Probiotic-rich",
      allergies: ["Dairy"],
      ageRange: "9-11",
      texture: "Smooth with small lumps",
    },
  ],

  // 12+ months
  "12+": [
    {
      id: 11,
      name: "Mini Vegetable Omelette",
      ingredients: ["Eggs", "Bell peppers", "Spinach", "Cheese", "Olive oil"],
      nutrition: {
        calories: 180,
        protein: "10g",
        calcium: "150mg",
        vitamin_a: "250mcg",
      },
      tag: "Protein-rich",
      allergies: ["Eggs", "Dairy"],
      ageRange: "12+",
      texture: "Soft pieces",
    },
    {
      id: 12,
      name: "Quinoa and Vegetable Bowl",
      ingredients: ["Quinoa", "Broccoli", "Carrots", "Olive oil", "Mild herbs"],
      nutrition: {
        calories: 200,
        protein: "6g",
        iron: "2.5mg",
        fiber: "5g",
      },
      tag: "Complete Protein",
      allergies: [],
      ageRange: "12+",
      texture: "Soft pieces",
    },
    {
      id: 13,
      name: "Fish and Sweet Potato Cakes",
      ingredients: ["White fish", "Sweet potato", "Breadcrumbs", "Parsley", "Lemon zest"],
      nutrition: {
        calories: 160,
        protein: "12g",
        omega_3: "800mg",
        vitamin_d: "5mcg",
      },
      tag: "Omega-3 rich",
      allergies: ["Fish", "Gluten"],
      ageRange: "12+",
      texture: "Soft pieces",
    },
    {
      id: 14,
      name: "Pasta with Tomato Sauce",
      ingredients: ["Pasta", "Tomatoes", "Onion", "Garlic", "Olive oil", "Basil"],
      nutrition: {
        calories: 190,
        protein: "5g",
        carbs: "30g",
        vitamin_c: "12mg",
      },
      tag: "Energy-boosting",
      allergies: ["Gluten"],
      ageRange: "12+",
      texture: "Soft pieces",
    },
    {
      id: 15,
      name: "Fruit and Vegetable Smoothie",
      ingredients: ["Banana", "Spinach", "Yogurt", "Avocado", "Chia seeds"],
      nutrition: {
        calories: 170,
        protein: "6g",
        calcium: "180mg",
        healthy_fats: "8g",
      },
      tag: "Nutrient-dense",
      allergies: ["Dairy"],
      ageRange: "12+",
      texture: "Smooth drink",
    },
  ],
}

// Helper function to get meals by age range
export function getMealsByAge(ageInMonths) {
  if (ageInMonths >= 6 && ageInMonths <= 8) {
    return mealDatabase["6-8"]
  } else if (ageInMonths >= 9 && ageInMonths <= 11) {
    return mealDatabase["9-11"]
  } else if (ageInMonths >= 12) {
    return mealDatabase["12+"]
  }
  return []
}

// Helper function to get recommended meals based on growth metrics
export function getRecommendedMeals(ageInMonths, weightForAge, heightForAge, weightForHeight) {
  const meals = getMealsByAge(ageInMonths)

  // Logic to prioritize meals based on growth metrics
  // This is a simplified example - in a real app, this would be more sophisticated
  let prioritizedMeals = [...meals]

  // If underweight, prioritize high-calorie, protein-rich meals
  if (weightForAge < -1) {
    prioritizedMeals.sort((a, b) => {
      const aCalories = Number.parseInt(a.nutrition.calories)
      const bCalories = Number.parseInt(b.nutrition.calories)
      return bCalories - aCalories
    })
  }

  // If stunted growth, prioritize protein and nutrient-dense meals
  if (heightForAge < -1) {
    prioritizedMeals = prioritizedMeals.filter(
      (meal) => meal.tag.includes("Protein") || meal.tag.includes("Nutrient") || meal.tag.includes("Iron"),
    )
  }

  // Return top 5 meals or all if less than 5
  return prioritizedMeals.slice(0, 5)
}
