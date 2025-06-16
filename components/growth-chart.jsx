"use client"

import { useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"

export function GrowthChart({ data, type = "weight" }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!canvasRef.current || !data || data.length === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Chart settings
    const padding = 40
    const chartWidth = canvas.width - padding * 2
    const chartHeight = canvas.height - padding * 2

    // Find min and max values
    const values = data.map((d) => d.value)
    const minValue = Math.min(...values) - 0.5
    const maxValue = Math.max(...values) + 0.5

    // Draw axes
    ctx.beginPath()
    ctx.strokeStyle = "#ccc"
    ctx.lineWidth = 1

    // X-axis
    ctx.moveTo(padding, canvas.height - padding)
    ctx.lineTo(canvas.width - padding, canvas.height - padding)

    // Y-axis
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, canvas.height - padding)
    ctx.stroke()

    // Draw data points and lines
    ctx.beginPath()
    ctx.strokeStyle = type === "weight" ? "#f472b6" : "#60a5fa"
    ctx.lineWidth = 2

    data.forEach((point, i) => {
      const x = padding + (i / (data.length - 1)) * chartWidth
      const y = canvas.height - padding - ((point.value - minValue) / (maxValue - minValue)) * chartHeight

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }

      // Draw point
      ctx.fillStyle = type === "weight" ? "#f472b6" : "#60a5fa"
      ctx.beginPath()
      ctx.arc(x, y, 4, 0, Math.PI * 2)
      ctx.fill()
    })

    ctx.stroke()

    // Draw X-axis labels (months)
    ctx.fillStyle = "#666"
    ctx.font = "10px sans-serif"
    ctx.textAlign = "center"

    data.forEach((point, i) => {
      const x = padding + (i / (data.length - 1)) * chartWidth
      ctx.fillText(point.month + "m", x, canvas.height - padding + 15)
    })

    // Draw Y-axis labels
    ctx.textAlign = "right"

    const numYLabels = 5
    for (let i = 0; i <= numYLabels; i++) {
      const value = minValue + (i / numYLabels) * (maxValue - minValue)
      const y = canvas.height - padding - (i / numYLabels) * chartHeight
      ctx.fillText(value.toFixed(1), padding - 5, y + 3)
    }

    // Draw chart title
    ctx.fillStyle = "#333"
    ctx.font = "bold 14px sans-serif"
    ctx.textAlign = "center"
    ctx.fillText(type === "weight" ? "Weight Over Time (kg)" : "Height Over Time (cm)", canvas.width / 2, padding / 2)
  }, [data, type])

  return (
    <Card className="p-4">
      <div className="h-64 w-full">
        <canvas ref={canvasRef} className="w-full h-full"></canvas>
      </div>
    </Card>
  )
}
