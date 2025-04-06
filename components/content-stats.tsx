"use client"

import { useEffect, useState } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import type { ContentStats as ContentStatsType } from "@/lib/schemas/content-types"
import { getMockContentStats } from "@/lib/services/mock-data-service"

interface ContentStatsProps {
  userId: string
}

export function ContentStats({ userId }: ContentStatsProps) {
  const [stats, setStats] = useState<ContentStatsType | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await getMockContentStats(userId)
        setStats(data)
      } catch (error) {
        console.error("Error fetching content stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [userId])

  if (loading || !stats) {
    return <div className="flex justify-center items-center h-[350px]">Loading statistics...</div>
  }

  // Map categories to colors
  const categoryColors: Record<string, string> = {
    "Hate Speech": "#ef4444",
    Misinformation: "#f97316",
    Cyberbullying: "#8b5cf6",
    Harassment: "#06b6d4",
    Other: "#6b7280",
  }

  const data = stats.categoryBreakdown.map((item) => ({
    name: item.category,
    value: item.percentage,
    color: categoryColors[item.category] || "#6b7280",
  }))

  return (
    <ResponsiveContainer width="100%" height={350}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={120}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => `${value}%`} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}

