import { db } from './database.js';

// Nutritional feature weights for importance scoring
const NUTRITIONAL_WEIGHTS = {
  calories: 0.20,
  protein: 0.18,
  iron: 0.15,
  calcium: 0.12,
  vitaminC: 0.10,
  fiber: 0.08,
  fat: 0.10,
  carbohydrates: 0.07
};

// Age-based nutritional requirements (per 100g serving)
const AGE_NUTRITIONAL_REQUIREMENTS = {
  0: { calories: 60, protein: 1.0, iron: 0.3, calcium: 200, vitaminC: 40, fiber: 0, fat: 3.3, carbohydrates: 7.0 },
  3: { calories: 65, protein: 1.2, iron: 0.5, calcium: 210, vitaminC: 40, fiber: 0, fat: 3.5, carbohydrates: 7.5 },
  6: { calories: 80, protein: 1.8, iron: 7.0, calcium: 260, vitaminC: 50, fiber: 2, fat: 4.0, carbohydrates: 9.0 },
  9: { calories: 95, protein: 2.2, iron: 7.5, calcium: 270, vitaminC: 50, fiber: 3, fat: 4.2, carbohydrates: 11.0 },
  12: { calories: 110, protein: 2.5, iron: 8.0, calcium: 280, vitaminC: 15, fiber: 4, fat: 4.5, carbohydrates: 13.0 },
  18: { calories: 130, protein: 3.0, iron: 8.5, calcium: 300, vitaminC: 15, fiber: 5, fat: 5.0, carbohydrates: 15.0 },
  24: { calories: 150, protein: 3.5, iron: 9.0, calcium: 320, vitaminC: 15, fiber: 6, fat: 5.5, carbohydrates: 17.0 },
  36: { calories: 170, protein: 4.0, iron: 10.0, calcium: 350, vitaminC: 15, fiber: 8, fat: 6.0, carbohydrates: 20.0 }
};

// Mock DecisionTreeRegressor - In production, this would load from a .pkl file
class MockDecisionTreeRegressor {
  predict(features) {
    // Simplified decision tree logic for demonstration
    // In production, this would be a trained scikit-learn model
    const [age, weight_z, height_z, calories, protein, iron, calcium] = features;
    
    let score = 0.5; // Base score
    
    // Age appropriateness rules
    if (age >= 6 && age <= 24) {
      score += 0.2;
    } else if (age > 24) {
      score += 0.15;
    }
    
    // Growth status rules
    if (weight_z < -1) {
      // Underweight - prioritize calories
      score += (calories / 200) * 0.2;
    }
    
    if (height_z < -1) {
      // Stunted - prioritize protein and calcium
      score += (protein / 10) * 0.15;
      score += (calcium / 500) * 0.1;
    }
    
    // Iron requirement (critical for this age group)
    if (iron > 5) {
      score += 0.15;
    }
    
    // Normalize to 0-1 range
    return Math.max(0, Math.min(1, score));
  }
}

// Initialize mock model
const decisionTreeModel = new MockDecisionTreeRegressor();

// Calculate child's nutritional needs based on age, growth status, and individual factors
export function calculateChildNutritionalNeeds(childProfile) {
  const { currentAge, currentWeight, currentHeight, sex, allergens = [], medicalConditions = [] } = childProfile;
  
  // Get base requirements for age
  const baseAge = Object.keys(AGE_NUTRITIONAL_REQUIREMENTS)
    .map(Number)
    .reduce((prev, curr) => Math.abs(curr - currentAge) < Math.abs(prev - currentAge) ? curr : prev);
  
  let nutritionalNeeds = { ...AGE_NUTRITIONAL_REQUIREMENTS[baseAge] };
  
  // Calculate growth metrics to adjust needs
  const growthMetrics = calculateGrowthMetrics(currentAge, currentWeight, currentHeight, sex);
  
  // Adjust based on growth status
  if (growthMetrics.weightForAge < -2) {
    // Severe underweight - increase caloric needs significantly
    nutritionalNeeds.calories *= 1.5;
    nutritionalNeeds.fat *= 1.4;
    nutritionalNeeds.protein *= 1.3;
  } else if (growthMetrics.weightForAge < -1) {
    // Moderate underweight - increase caloric needs
    nutritionalNeeds.calories *= 1.3;
    nutritionalNeeds.fat *= 1.2;
    nutritionalNeeds.protein *= 1.15;
  }
  
  if (growthMetrics.heightForAge < -2) {
    // Severe stunting - focus on protein and micronutrients
    nutritionalNeeds.protein *= 1.4;
    nutritionalNeeds.calcium *= 1.3;
    nutritionalNeeds.iron *= 1.2;
  } else if (growthMetrics.heightForAge < -1) {
    // Moderate stunting
    nutritionalNeeds.protein *= 1.2;
    nutritionalNeeds.calcium *= 1.15;
    nutritionalNeeds.iron *= 1.1;
  }
  
  // Adjust for medical conditions
  if (medicalConditions.includes('anemia') || medicalConditions.includes('iron_deficiency')) {
    nutritionalNeeds.iron *= 1.5;
    nutritionalNeeds.vitaminC *= 1.3; // Enhances iron absorption
  }
  
  if (medicalConditions.includes('failure_to_thrive')) {
    nutritionalNeeds.calories *= 1.4;
    nutritionalNeeds.protein *= 1.3;
    nutritionalNeeds.fat *= 1.2;
  }
  
  // Age-specific adjustments
  if (currentAge >= 6 && currentAge < 12) {
    // First foods period - emphasize iron and gentle introduction
    nutritionalNeeds.iron *= 1.2;
  } else if (currentAge >= 12 && currentAge < 24) {
    // Toddler period - balanced growth
    nutritionalNeeds.protein *= 1.1;
    nutritionalNeeds.calcium *= 1.1;
  }
  
  return {
    nutritionalNeeds,
    growthMetrics,
    adjustmentFactors: {
      weightStatus: growthMetrics.weightForAge,
      heightStatus: growthMetrics.heightForAge,
      medicalConditions,
      ageGroup: getAgeGroup(currentAge)
    }
  };
}

// Min-max normalization for features
function minMaxNormalize(values, min, max) {
  if (max === min) return values.map(() => 0.5);
  return values.map(val => (val - min) / (max - min));
}

// Calculate cosine similarity between child needs and meal nutrition
function calculateCosineSimilarity(childNeeds, mealNutrition) {
  const features = ['calories', 'protein', 'iron', 'calcium', 'vitaminC', 'fiber', 'fat', 'carbohydrates'];
  
  // Extract feature vectors
  const childVector = features.map(feature => childNeeds[feature] || 0);
  const mealVector = features.map(feature => mealNutrition[feature] || 0);
  
  // Apply min-max normalization
  const allValues = [...childVector, ...mealVector];
  const minVal = Math.min(...allValues);
  const maxVal = Math.max(...allValues);
  
  const normalizedChildVector = minMaxNormalize(childVector, minVal, maxVal);
  const normalizedMealVector = minMaxNormalize(mealVector, minVal, maxVal);
  
  // Calculate cosine similarity
  let dotProduct = 0;
  let childMagnitude = 0;
  let mealMagnitude = 0;
  
  for (let i = 0; i < normalizedChildVector.length; i++) {
    dotProduct += normalizedChildVector[i] * normalizedMealVector[i];
    childMagnitude += normalizedChildVector[i] * normalizedChildVector[i];
    mealMagnitude += normalizedMealVector[i] * normalizedMealVector[i];
  }
  
  if (childMagnitude === 0 || mealMagnitude === 0) {
    return 0;
  }
  
  const cosineSimilarity = dotProduct / (Math.sqrt(childMagnitude) * Math.sqrt(mealMagnitude));
  
  return Math.max(0, Math.min(1, cosineSimilarity));
}

// Decision tree prediction for meal suitability
function getDecisionTreeScore(meal, childProfile, nutritionalAnalysis) {
  const { currentAge, currentWeight, currentHeight, sex } = childProfile;
  const { growthMetrics } = nutritionalAnalysis;
  
  // Prepare features for decision tree model
  const features = [
    currentAge,
    growthMetrics.weightForAge,
    growthMetrics.heightForAge,
    meal.nutrition.calories || 0,
    meal.nutrition.protein || 0,
    meal.nutrition.iron || 0,
    meal.nutrition.calcium || 0
  ];
  
  return decisionTreeModel.predict(features);
}

// Generate feature importance explanation
function calculateFeatureImportance(meal, childNeeds) {
  const features = ['calories', 'protein', 'iron', 'calcium', 'vitaminC', 'fiber', 'fat', 'carbohydrates'];
  const importance = {};
  
  features.forEach(feature => {
    const childNeed = childNeeds[feature] || 0;
    const mealProvides = meal.nutrition[feature] || 0;
    const weight = NUTRITIONAL_WEIGHTS[feature] || 0.1;
    
    // Calculate how well this meal meets the need for this nutrient
    let meetPercentage = 0;
    if (childNeed > 0) {
      meetPercentage = Math.min(100, (mealProvides / childNeed) * 100);
    }
    
    importance[feature] = {
      childNeeds: childNeed,
      mealProvides: mealProvides,
      meetPercentage: Math.round(meetPercentage),
      weight: weight,
      contributionScore: meetPercentage * weight
    };
  });
  
  return importance;
}

// Generate explanation for meal recommendation
function generateMealExplanation(meal, childProfile, nutritionalAnalysis, similarityScore, decisionTreeScore) {
  const { nutritionalNeeds, growthMetrics } = nutritionalAnalysis;
  const reasons = [];
  
  // Age appropriateness
  if (childProfile.currentAge >= meal.minAge && childProfile.currentAge <= meal.maxAge) {
    reasons.push(`Age-appropriate for ${childProfile.currentAge}-month-old children`);
  }
  
  // Nutritional highlights
  const nutrition = meal.nutrition;
  if (nutrition.iron && nutrition.iron > 5) {
    const ironPercentage = Math.round((nutrition.iron / nutritionalNeeds.iron) * 100);
    reasons.push(`Excellent iron source (${ironPercentage}% of daily needs)`);
  }
  
  if (nutrition.protein && nutrition.protein > 3) {
    const proteinPercentage = Math.round((nutrition.protein / nutritionalNeeds.protein) * 100);
    reasons.push(`Good protein content (${proteinPercentage}% of daily needs)`);
  }
  
  if (nutrition.calcium && nutrition.calcium > 100) {
    reasons.push(`Rich in calcium for bone development`);
  }
  
  // Growth-specific recommendations
  if (growthMetrics.weightForAge < -1 && nutrition.calories && nutrition.calories > 120) {
    reasons.push(`High-calorie option recommended for healthy weight gain`);
  }
  
  if (growthMetrics.heightForAge < -1 && nutrition.protein && nutrition.protein > 4) {
    reasons.push(`Protein-rich to support linear growth`);
  }
  
  // Safety and developmental benefits
  if (meal.allergens && meal.allergens.length === 0) {
    reasons.push(`Allergen-free and safe`);
  }
  
  if (meal.developmentalBenefits && meal.developmentalBenefits.length > 0) {
    reasons.push(`Supports: ${meal.developmentalBenefits.slice(0, 2).join(', ')}`);
  }
  
  // AI model confidence
  const overallScore = (similarityScore * 0.6 + decisionTreeScore * 0.4) * 100;
  reasons.push(`AI confidence: ${Math.round(overallScore)}%`);
  
  return {
    summary: reasons.slice(0, 3).join('. ') + '.',
    detailedReasons: reasons,
    scores: {
      similarity: Math.round(similarityScore * 100),
      decisionTree: Math.round(decisionTreeScore * 100),
      overall: Math.round(overallScore)
    }
  };
}

// Main AI recommendation engine
export function generateAIRecommendations(childProfile, options = {}) {
  try {
    const { maxRecommendations = 5, includeExplanations = true, filterAllergens = true } = options;
    
    // Calculate child's nutritional needs
    const nutritionalAnalysis = calculateChildNutritionalNeeds(childProfile);
    const { nutritionalNeeds, growthMetrics } = nutritionalAnalysis;
    
    // Get candidate meals
    let candidateMeals = db.meals.getAll()
      .filter(meal => {
        // Age filtering
        return childProfile.currentAge >= meal.minAge && childProfile.currentAge <= meal.maxAge;
      });
    
    // Filter out allergens if requested
    if (filterAllergens && childProfile.allergens && childProfile.allergens.length > 0) {
      candidateMeals = candidateMeals.filter(meal => {
        return !childProfile.allergens.some(allergen => 
          meal.allergens && meal.allergens.includes(allergen)
        );
      });
    }
    
    if (candidateMeals.length === 0) {
      return {
        success: false,
        recommendations: [],
        explanation: "No suitable meals found matching the criteria and safety requirements.",
        childAnalysis: nutritionalAnalysis
      };
    }
    
    // Score each meal using hybrid AI approach
    const scoredMeals = candidateMeals.map(meal => {
      // 1. Calculate cosine similarity between child needs and meal nutrition
      const similarityScore = calculateCosineSimilarity(nutritionalNeeds, meal.nutrition);
      
      // 2. Get decision tree prediction for meal suitability
      const decisionTreeScore = getDecisionTreeScore(meal, childProfile, nutritionalAnalysis);
      
      // 3. Combine scores (60% similarity, 40% decision tree as per hybrid approach)
      const finalScore = (similarityScore * 0.6) + (decisionTreeScore * 0.4);
      
      // 4. Generate explanations and feature importance
      const explanation = includeExplanations ? 
        generateMealExplanation(meal, childProfile, nutritionalAnalysis, similarityScore, decisionTreeScore) : 
        null;
      
      const featureImportance = includeExplanations ? 
        calculateFeatureImportance(meal, nutritionalNeeds) : 
        null;
      
      return {
        ...meal,
        aiScores: {
          cosineSimilarity: similarityScore,
          decisionTree: decisionTreeScore,
          finalScore: finalScore,
          confidence: (similarityScore + decisionTreeScore) / 2
        },
        explanation: explanation,
        featureImportance: featureImportance,
        nutritionalMatch: {
          meetsNeeds: Object.keys(nutritionalNeeds).reduce((acc, nutrient) => {
            const need = nutritionalNeeds[nutrient];
            const provides = meal.nutrition[nutrient] || 0;
            acc[nutrient] = need > 0 ? Math.min(100, (provides / need) * 100) : 0;
            return acc;
          }, {})
        }
      };
    });
    
    // Sort by final AI score and return top recommendations
    const topRecommendations = scoredMeals
      .sort((a, b) => b.aiScores.finalScore - a.aiScores.finalScore)
      .slice(0, maxRecommendations);
    
    // Generate overall explanation
    const overallExplanation = generateOverallExplanation(
      topRecommendations, 
      childProfile, 
      nutritionalAnalysis
    );
    
    return {
      success: true,
      recommendations: topRecommendations,
      explanation: overallExplanation,
      childAnalysis: nutritionalAnalysis,
      metadata: {
        totalCandidates: candidateMeals.length,
        recommendationCount: topRecommendations.length,
        averageConfidence: topRecommendations.reduce((sum, meal) => 
          sum + meal.aiScores.confidence, 0) / topRecommendations.length,
        timestamp: new Date().toISOString()
      }
    };
    
  } catch (error) {
    console.error('Error in AI recommendation engine:', error);
    return {
      success: false,
      recommendations: [],
      explanation: "An error occurred while generating recommendations. Please try again.",
      error: error.message
    };
  }
}

// Generate overall explanation for the recommendation set
function generateOverallExplanation(recommendations, childProfile, nutritionalAnalysis) {
  if (recommendations.length === 0) {
    return "No suitable recommendations could be generated based on the current criteria.";
  }
  
  const { growthMetrics } = nutritionalAnalysis;
  const topMeal = recommendations[0];
  
  let explanation = `Based on your ${childProfile.currentAge}-month-old's profile `;
  
  if (growthMetrics.status !== 'Normal') {
    explanation += `and ${growthMetrics.status.toLowerCase()} growth status, `;
  }
  
  explanation += `our AI recommends ${recommendations.length} meals that best match their nutritional needs. `;
  
  explanation += `The top recommendation, "${topMeal.name}", has a ${Math.round(topMeal.aiScores.finalScore * 100)}% `;
  explanation += `compatibility score based on nutritional similarity and developmental appropriateness. `;
  
  // Highlight key nutritional focuses
  const focusAreas = [];
  if (growthMetrics.weightForAge < -1) {
    focusAreas.push("calorie-dense foods for healthy weight gain");
  }
  if (growthMetrics.heightForAge < -1) {
    focusAreas.push("protein and calcium-rich options for growth");
  }
  if (childProfile.currentAge >= 6 && childProfile.currentAge <= 12) {
    focusAreas.push("iron-fortified foods for development");
  }
  
  if (focusAreas.length > 0) {
    explanation += `These recommendations emphasize ${focusAreas.join(', ')}.`;
  }
  
  return explanation;
}

// Helper function to get age group
function getAgeGroup(ageInMonths) {
  if (ageInMonths < 6) return 'milk_only';
  if (ageInMonths < 9) return 'early_solids';
  if (ageInMonths < 12) return 'established_solids';
  if (ageInMonths < 24) return 'toddler_foods';
  return 'family_foods';
}

// Helper function for growth metrics (simplified version)
function calculateGrowthMetrics(age, weight, height, sex) {
  // This would typically call the database function
  // Simplified for this AI engine
  const mockMetrics = {
    weightForAge: (Math.random() - 0.5) * 4, // -2 to +2 range
    heightForAge: (Math.random() - 0.5) * 4,
    weightForHeight: (Math.random() - 0.5) * 4,
    status: 'Normal'
  };
  
  if (mockMetrics.weightForAge < -2 || mockMetrics.heightForAge < -2) {
    mockMetrics.status = 'Moderate malnutrition';
  } else if (mockMetrics.weightForAge < -3 || mockMetrics.heightForAge < -3) {
    mockMetrics.status = 'Severe malnutrition';
  } else if (mockMetrics.weightForAge > 2) {
    mockMetrics.status = 'Overweight';
  } else if (mockMetrics.weightForAge < -1 || mockMetrics.heightForAge < -1) {
    mockMetrics.status = 'At risk';
  }
  
  return mockMetrics;
}

// Export utility functions for testing and external use
export {
  calculateCosineSimilarity,
  calculateFeatureImportance,
  minMaxNormalize,
  getDecisionTreeScore,
  NUTRITIONAL_WEIGHTS,
  AGE_NUTRITIONAL_REQUIREMENTS
};