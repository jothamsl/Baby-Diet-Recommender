"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function ComparativeGrowthChart({ babyData, type = "weight" }) {
  const canvasRef = useRef(null)
  const [chartDrawn, setChartDrawn] = useState(false)

  // Sample dataset of other babies for comparison
  const comparisonData = {
    weight: [
      { age: 6, values: [6.2, 6.8, 7.1, 7.4, 7.8, 8.2, 8.5, 8.9, 9.2, 9.6] },
      { age: 7, values: [6.5, 7.1, 7.4, 7.7, 8.1, 8.5, 8.8, 9.2, 9.5, 9.9] },
      { age: 8, values: [6.8, 7.4, 7.7, 8.0, 8.4, 8.8, 9.1, 9.5, 9.8, 10.2] },
      { age: 9, values: [7.1, 7.7, 8.0, 8.3, 8.7, 9.1, 9.4, 9.8, 10.1, 10.5] },
      { age: 10, values: [7.4, 8.0, 8.3, 8.6, 9.0, 9.4, 9.7, 10.1, 10.4, 10.8] },
      { age: 11, values: [7.6, 8.2, 8.5, 8.8, 9.2, 9.6, 9.9, 10.3, 10.6, 11.0] },
      { age: 12, values: [7.8, 8.4, 8.7, 9.0, 9.4, 9.8, 10.1, 10.5, 10.8, 11.2] },
    ],
    height: [
      { age: 6, values: [63.2, 65.5, 67.0, 68.2, 69.8, 71.2, 72.5, 73.8, 75.0, 76.5] },
      { age: 7, values: [64.8, 67.1, 68.6, 69.8, 71.4, 72.8, 74.1, 75.4, 76.6, 78.1] },
      { age: 8, values: [66.2, 68.5, 70.0, 71.2, 72.8, 74.2, 75.5, 76.8, 78.0, 79.5] },
      { age: 9, values: [67.5, 69.8, 71.3, 72.5, 74.1, 75.5, 76.8, 78.1, 79.3, 80.8] },
      { age: 10, values: [68.7, 71.0, 72.5, 73.7, 75.3, 76.7, 78.0, 79.3, 80.5, 82.0] },
      { age: 11, values: [69.9, 72.2, 73.7, 74.9, 76.5, 77.9, 79.2, 80.5, 81.7, 83.2] },
      { age: 12, values: [71.0, 73.3, 74.8, 76.0, 77.6, 79.0, 80.3, 81.6, 82.8, 84.3] },
    ],
  }

  // Single draw function without animation loop
  useEffect(() => {
    if (!canvasRef.current || !babyData || chartDrawn) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")

    // Set fixed canvas dimensions to avoid resize issues
    const width = 600
    const height = 320

    canvas.width = width
    canvas.height = height
    canvas.style.width = "100%"
    canvas.style.height = "100%"

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Chart settings
    const padding = 60
    const chartWidth = width - padding * 2
    const chartHeight = height - padding * 2

    const data = comparisonData[type]
    const babyAge = babyData.age
    const babyValue = babyData.value

    // Find age range for chart
    const minAge = Math.max(6, babyAge - 2)
    const maxAge = Math.min(12, babyAge + 2)
    const ageRange = data.filter((d) => d.age >= minAge && d.age <= maxAge)

    if (ageRange.length === 0) return

    // Find value range
    const allValues = ageRange.flatMap((d) => d.values)
    const minValue = Math.min(...allValues) - 0.5
    const maxValue = Math.max(...allValues) + 0.5

    // Helper functions
    const getX = (age) => padding + ((age - minAge) / (maxAge - minAge)) * chartWidth
    const getY = (value) => height - padding - ((value - minValue) / (maxValue - minValue)) * chartHeight

    // Draw background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, height)
    gradient.addColorStop(0, "rgba(251, 207, 232, 0.1)")
    gradient.addColorStop(1, "rgba(254, 215, 170, 0.1)")
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)

    // Draw percentile bands
    const percentiles = [10, 25, 50, 75, 90]
    const colors = [
      "rgba(239, 68, 68, 0.1)",
      "rgba(245, 158, 11, 0.1)",
      "rgba(34, 197, 94, 0.1)",
      "rgba(245, 158, 11, 0.1)",
      "rgba(239, 68, 68, 0.1)",
    ]

    percentiles.forEach((percentile, index) => {
      ctx.beginPath()
      ctx.fillStyle = colors[index]

      ageRange.forEach((ageData, i) => {
        const x = getX(ageData.age)
        const valueIndex = Math.floor((percentile / 100) * (ageData.values.length - 1))
        const y = getY(ageData.values[valueIndex])

        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })

      // Complete the band
      for (let i = ageRange.length - 1; i >= 0; i--) {
        const ageData = ageRange[i]
        const x = getX(ageData.age)
        const nextPercentile = percentiles[index + 1] || 100
        const valueIndex = Math.floor((nextPercentile / 100) * (ageData.values.length - 1))
        const y = getY(ageData.values[Math.min(valueIndex, ageData.values.length - 1)])
        ctx.lineTo(x, y)
      }

      ctx.closePath()
      ctx.fill()
    })

    // Draw median line (50th percentile)
    ctx.beginPath()
    ctx.strokeStyle = "#10b981"
    ctx.lineWidth = 2
    ctx.setLineDash([5, 5])

    ageRange.forEach((ageData, i) => {
      const x = getX(ageData.age)
      const medianIndex = Math.floor(ageData.values.length / 2)
      const y = getY(ageData.values[medianIndex])

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    ctx.stroke()
    ctx.setLineDash([])

    // Draw axes
    ctx.beginPath()
    ctx.strokeStyle = "#d1d5db"
    ctx.lineWidth = 1

    // X-axis
    ctx.moveTo(padding, height - padding)
    ctx.lineTo(width - padding, height - padding)

    // Y-axis
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, height - padding)
    ctx.stroke()

    // Draw baby's point (static, no animation)
    const babyX = getX(babyAge)
    const babyY = getY(babyValue)

    // Outer glow
    const glowGradient = ctx.createRadialGradient(babyX, babyY, 0, babyX, babyY, 15)
    glowGradient.addColorStop(0, "rgba(236, 72, 153, 0.3)")
    glowGradient.addColorStop(1, "rgba(236, 72, 153, 0)")
    ctx.fillStyle = glowGradient
    ctx.beginPath()
    ctx.arc(babyX, babyY, 15, 0, Math.PI * 2)
    ctx.fill()

    // Main point
    ctx.fillStyle = "#ec4899"
    ctx.beginPath()
    ctx.arc(babyX, babyY, 8, 0, Math.PI * 2)
    ctx.fill()

    // Inner highlight
    ctx.fillStyle = "#fce7f3"
    ctx.beginPath()
    ctx.arc(babyX, babyY, 5, 0, Math.PI * 2)
    ctx.fill()

    // Draw labels
    ctx.fillStyle = "#374151"
    ctx.font = "12px sans-serif"
    ctx.textAlign = "center"

    // X-axis labels (ages)
    for (let age = minAge; age <= maxAge; age++) {
      const x = getX(age)
      ctx.fillText(`${age}m`, x, height - padding + 20)
    }

    // Y-axis labels
    ctx.textAlign = "right"
    const numYLabels = 5
    for (let i = 0; i <= numYLabels; i++) {
      const value = minValue + (i / numYLabels) * (maxValue - minValue)
      const y = getY(value)
      ctx.fillText(value.toFixed(1), padding - 10, y + 4)
    }

    // Chart title
    ctx.fillStyle = "#1f2937"
    ctx.font = "bold 16px sans-serif"
    ctx.textAlign = "center"
    const title = type === "weight" ? "Weight Comparison (kg)" : "Height Comparison (cm)"
    ctx.fillText(title, width / 2, 30)

    // Legend
    ctx.font = "11px sans-serif"
    ctx.textAlign = "left"
    ctx.fillStyle = "#6b7280"
    ctx.fillText("Your baby", width - 120, 50)
    ctx.fillStyle = "#10b981"
    ctx.fillText("Average (50th percentile)", width - 120, 70)

    setChartDrawn(true)
  }, [babyData, type, chartDrawn])

  // Calculate percentile position
  const calculatePercentile = () => {
    if (!babyData) return 50

    const data = comparisonData[type]
    const ageData = data.find((d) => d.age === babyData.age)

    if (!ageData) return 50

    const sortedValues = [...ageData.values].sort((a, b) => a - b)
    const position = sortedValues.findIndex((val) => val >= babyData.value)

    if (position === -1) return 95
    return Math.round((position / sortedValues.length) * 100)
  }

  const percentile = calculatePercentile()
  const getPercentileColor = (p) => {
    if (p < 10) return "bg-red-100 text-red-800"
    if (p < 25) return "bg-orange-100 text-orange-800"
    if (p < 75) return "bg-green-100 text-green-800"
    if (p < 90) return "bg-orange-100 text-orange-800"
    return "bg-red-100 text-red-800"
  }

  const getPercentileMessage = (p) => {
    if (p < 10) return "Below average - consider consulting your pediatrician"
    if (p < 25) return "Slightly below average - within normal range"
    if (p < 75) return "Average - healthy development"
    if (p < 90) return "Above average - excellent growth"
    return "Well above average - very strong growth"
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <span>Growth Comparison</span>
          <Badge className={getPercentileColor(percentile)}>{percentile}th percentile</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full mb-4 bg-gray-50 rounded-lg overflow-hidden">
          <canvas
            ref={canvasRef}
            className="w-full h-full object-contain"
            style={{ maxWidth: "100%", height: "100%" }}
          />
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">{getPercentileMessage(percentile)}</p>
          <p className="text-xs text-gray-500">
            Your baby is in the {percentile}th percentile compared to other babies of the same age
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
