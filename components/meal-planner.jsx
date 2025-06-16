"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Download, Plus, Trash } from "lucide-react"

export function MealPlanner({ recommendedMeals }) {
  const [weeklyPlan, setWeeklyPlan] = useState({
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: [],
  })

  const daysOfWeek = [
    { key: "monday", label: "Monday" },
    { key: "tuesday", label: "Tuesday" },
    { key: "wednesday", label: "Wednesday" },
    { key: "thursday", label: "Thursday" },
    { key: "friday", label: "Friday" },
    { key: "saturday", label: "Saturday" },
    { key: "sunday", label: "Sunday" },
  ]

  const mealTimes = ["Breakfast", "Lunch", "Dinner", "Snack"]

  const addMealToDay = (day, meal) => {
    setWeeklyPlan((prev) => ({
      ...prev,
      [day]: [...prev[day], { ...meal, mealTime: "Breakfast" }],
    }))
  }

  const removeMealFromDay = (day, mealIndex) => {
    setWeeklyPlan((prev) => ({
      ...prev,
      [day]: prev[day].filter((_, index) => index !== mealIndex),
    }))
  }

  const updateMealTime = (day, mealIndex, newMealTime) => {
    setWeeklyPlan((prev) => ({
      ...prev,
      [day]: prev[day].map((meal, index) => (index === mealIndex ? { ...meal, mealTime: newMealTime } : meal)),
    }))
  }

  return (
    <Card className="mb-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-semibold">Weekly Meal Planner</CardTitle>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Download className="h-4 w-4" />
          <span>Export Plan</span>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {daysOfWeek.map((day) => (
            <div key={day.key} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-medium flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  {day.label}
                </h3>
                <div className="flex gap-2">
                  <div className="relative">
                    <select
                      className="appearance-none bg-transparent border border-gray-300 rounded px-2 py-1 pr-8 text-sm"
                      onChange={(e) => {
                        const selectedMeal = recommendedMeals.find((m) => m.id === Number.parseInt(e.target.value))
                        if (selectedMeal) {
                          addMealToDay(day.key, selectedMeal)
                        }
                      }}
                      value=""
                    >
                      <option value="" disabled>
                        Add meal
                      </option>
                      {recommendedMeals.map((meal) => (
                        <option key={meal.id} value={meal.id}>
                          {meal.name}
                        </option>
                      ))}
                    </select>
                    <Plus className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 pointer-events-none" />
                  </div>
                </div>
              </div>

              {weeklyPlan[day.key].length === 0 ? (
                <p className="text-sm text-gray-500 italic">No meals planned</p>
              ) : (
                <div className="space-y-2">
                  {weeklyPlan[day.key].map((meal, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <select
                            className="appearance-none bg-transparent border border-gray-300 rounded px-2 py-1 pr-8 text-xs"
                            value={meal.mealTime}
                            onChange={(e) => updateMealTime(day.key, index, e.target.value)}
                          >
                            {mealTimes.map((time) => (
                              <option key={time} value={time}>
                                {time}
                              </option>
                            ))}
                          </select>
                          <Clock className="absolute right-2 top-1/2 transform -translate-y-1/2 h-3 w-3 pointer-events-none" />
                        </div>
                        <span className="text-sm font-medium">{meal.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {meal.tag}
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => removeMealFromDay(day.key, index)}
                      >
                        <Trash className="h-3 w-3" />
                        <span className="sr-only">Remove</span>
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
