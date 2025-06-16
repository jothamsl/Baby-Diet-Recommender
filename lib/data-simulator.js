// Data simulation service for generating realistic user data
export class DataSimulator {
  static getRandomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  }

  static getRandomWeight(ageMonths, sex) {
    // WHO growth standards - approximate average weights by age and sex
    const weightStandards = {
      male: {
        0: 3.3, 1: 4.5, 2: 5.6, 3: 6.4, 4: 7.0, 5: 7.5, 6: 7.9,
        7: 8.3, 8: 8.6, 9: 8.9, 10: 9.2, 11: 9.4, 12: 9.6,
        13: 9.9, 14: 10.1, 15: 10.3, 16: 10.5, 17: 10.7, 18: 10.9,
        19: 11.1, 20: 11.3, 21: 11.5, 22: 11.8, 23: 12.0, 24: 12.2
      },
      female: {
        0: 3.2, 1: 4.2, 2: 5.1, 3: 5.8, 4: 6.4, 5: 6.9, 6: 7.3,
        7: 7.6, 8: 7.9, 9: 8.2, 10: 8.5, 11: 8.7, 12: 8.9,
        13: 9.2, 14: 9.4, 15: 9.6, 16: 9.8, 17: 10.0, 18: 10.2,
        19: 10.4, 20: 10.6, 21: 10.9, 22: 11.1, 23: 11.3, 24: 11.5
      }
    };

    const baseWeight = weightStandards[sex][ageMonths] || weightStandards[sex][24];
    // Add some realistic variation (±15%)
    const variation = (Math.random() - 0.5) * 0.3 * baseWeight;
    return Math.max(2.0, parseFloat((baseWeight + variation).toFixed(1)));
  }

  static getRandomHeight(ageMonths, sex) {
    // WHO growth standards - approximate average heights by age and sex
    const heightStandards = {
      male: {
        0: 49.9, 1: 54.7, 2: 58.4, 3: 61.4, 4: 63.9, 5: 65.9, 6: 67.6,
        7: 69.2, 8: 70.6, 9: 72.0, 10: 73.3, 11: 74.5, 12: 75.7,
        13: 76.9, 14: 78.0, 15: 79.1, 16: 80.2, 17: 81.2, 18: 82.3,
        19: 83.2, 20: 84.2, 21: 85.1, 22: 86.0, 23: 86.9, 24: 87.8
      },
      female: {
        0: 49.1, 1: 53.7, 2: 57.1, 3: 59.8, 4: 62.1, 5: 64.0, 6: 65.7,
        7: 67.3, 8: 68.7, 9: 70.1, 10: 71.5, 11: 72.8, 12: 74.0,
        13: 75.2, 14: 76.4, 15: 77.5, 16: 78.6, 17: 79.7, 18: 80.7,
        19: 81.7, 20: 82.7, 21: 83.7, 22: 84.6, 23: 85.5, 24: 86.4
      }
    };

    const baseHeight = heightStandards[sex][ageMonths] || heightStandards[sex][24];
    // Add some realistic variation (±10%)
    const variation = (Math.random() - 0.5) * 0.2 * baseHeight;
    return Math.max(40.0, parseFloat((baseHeight + variation).toFixed(1)));
  }

  static getGrowthMetrics(weight, height, age, sex) {
    // Simplified z-score calculation (in reality this would use WHO growth charts)
    const weightForAge = parseFloat((Math.random() * 4 - 2).toFixed(1)); // -2 to +2
    const heightForAge = parseFloat((Math.random() * 4 - 2).toFixed(1)); // -2 to +2
    const weightForHeight = parseFloat((Math.random() * 4 - 2).toFixed(1)); // -2 to +2
    
    return { weightForAge, heightForAge, weightForHeight };
  }

  static getRecommendations(age, growthMetrics) {
    const allRecommendations = {
      "0-3": [
        "Breast Milk/Formula",
        "Vitamin D Supplements",
        "Iron Supplements (if needed)"
      ],
      "4-6": [
        "Rice Cereal",
        "Apple Puree",
        "Sweet Potato Puree",
        "Banana Mash",
        "Carrot Puree",
        "Avocado Puree",
        "Pear Puree"
      ],
      "7-9": [
        "Finger Foods",
        "Soft Cooked Vegetables",
        "Mashed Beans",
        "Soft Pasta",
        "Cheese Cubes",
        "Scrambled Eggs",
        "Fish Flakes",
        "Yogurt",
        "Oatmeal"
      ],
      "10-12": [
        "Chopped Fruits",
        "Small Pasta Pieces",
        "Soft Meat Pieces",
        "Toast Fingers",
        "Cooked Rice",
        "Steamed Broccoli",
        "Cottage Cheese",
        "Pancake Pieces"
      ],
      "13-18": [
        "Family Meals (Modified)",
        "Chicken Stew",
        "Vegetable Curry",
        "Quinoa Salad",
        "Fish Curry",
        "Lentil Soup",
        "Mixed Fruit Bowl",
        "Whole Grain Bread"
      ],
      "19-24": [
        "Regular Family Foods",
        "Balanced Meals",
        "Variety of Textures",
        "Cultural Foods",
        "Seasonal Vegetables",
        "Protein-rich Foods",
        "Calcium-rich Foods"
      ]
    };

    let ageGroup;
    if (age <= 3) ageGroup = "0-3";
    else if (age <= 6) ageGroup = "4-6";
    else if (age <= 9) ageGroup = "7-9";
    else if (age <= 12) ageGroup = "10-12";
    else if (age <= 18) ageGroup = "13-18";
    else ageGroup = "19-24";

    const recommendations = allRecommendations[ageGroup];
    // Return 3-5 random recommendations
    const shuffled = [...recommendations].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.floor(Math.random() * 3) + 3);
  }

  static generateUserRecord(id, baseDate) {
    const age = Math.floor(Math.random() * 24) + 1; // 1-24 months
    const sex = Math.random() > 0.5 ? "male" : "female";
    const weight = this.getRandomWeight(age, sex);
    const height = this.getRandomHeight(age, sex);
    const growthMetrics = this.getGrowthMetrics(weight, height, age, sex);
    const recommendations = this.getRecommendations(age, growthMetrics);

    // Generate date within the last 30 days from baseDate
    const date = this.getRandomDate(
      new Date(baseDate.getTime() - 30 * 24 * 60 * 60 * 1000),
      baseDate
    );

    return {
      id,
      date: date.toISOString().split('T')[0],
      babyAge: age,
      babyWeight: weight,
      babyHeight: height,
      babySex: sex,
      weightForAge: growthMetrics.weightForAge,
      heightForAge: growthMetrics.heightForAge,
      weightForHeight: growthMetrics.weightForHeight,
      recommendations
    };
  }

  static generateBatchData(count = 50, startDate = new Date()) {
    const data = [];
    for (let i = 1; i <= count; i++) {
      data.push(this.generateUserRecord(i, startDate));
    }
    return data.sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  static addNewRecord(existingData, startId = null) {
    const newId = startId || (Math.max(...existingData.map(d => d.id)) + 1);
    const newRecord = this.generateUserRecord(newId, new Date());
    return [...existingData, newRecord].sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  static getAgeGroupStatistics(data) {
    const ageGroups = [
      { label: "0-3 months", min: 0, max: 3 },
      { label: "4-6 months", min: 4, max: 6 },
      { label: "7-9 months", min: 7, max: 9 },
      { label: "10-12 months", min: 10, max: 12 },
      { label: "13-18 months", min: 13, max: 18 },
      { label: "19-24 months", min: 19, max: 24 },
    ];

    return ageGroups.map(group => {
      const groupData = data.filter(
        user => user.babyAge >= group.min && user.babyAge <= group.max
      );
      
      return {
        group: group.label,
        count: groupData.length,
        avgWeight: groupData.length > 0 
          ? parseFloat((groupData.reduce((sum, user) => sum + user.babyWeight, 0) / groupData.length).toFixed(1))
          : 0,
        avgHeight: groupData.length > 0
          ? parseFloat((groupData.reduce((sum, user) => sum + user.babyHeight, 0) / groupData.length).toFixed(1))
          : 0
      };
    });
  }

  static getGrowthTrends(data, days = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    const recentData = data.filter(user => new Date(user.date) >= cutoffDate);
    
    // Group by date and calculate averages
    const dailyAverages = {};
    recentData.forEach(user => {
      if (!dailyAverages[user.date]) {
        dailyAverages[user.date] = { weights: [], heights: [], count: 0 };
      }
      dailyAverages[user.date].weights.push(user.babyWeight);
      dailyAverages[user.date].heights.push(user.babyHeight);
      dailyAverages[user.date].count++;
    });

    return Object.entries(dailyAverages)
      .map(([date, data]) => ({
        date,
        avgWeight: parseFloat((data.weights.reduce((a, b) => a + b, 0) / data.weights.length).toFixed(1)),
        avgHeight: parseFloat((data.heights.reduce((a, b) => a + b, 0) / data.heights.length).toFixed(1)),
        count: data.count
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }
}

// Export default for easy importing
export default DataSimulator;