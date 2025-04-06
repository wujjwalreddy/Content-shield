"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { getMockAnalyticsData } from "@/lib/services/mock-data-service"

interface OverviewProps {
  userId?: string
}

export function Overview({ userId = "123456" }: OverviewProps) {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const analyticsData = await getMockAnalyticsData(userId)

        // Transform the categoryTrends data for the chart
        const transformedData = analyticsData.categoryTrends.map((item) => {
          const { date, ...categories } = item
          return {
            name: date,
            ...categories,
          }
        })

        setData(transformedData)
      } catch (error) {
        console.error("Error fetching overview data:", error)
        // Fallback to static data if there's an error
        setData([
          {
            name: "Jan",
            "Hate Speech": 240,
            Misinformation: 180,
            Cyberbullying: 150,
            Harassment: 120,
          },
          {
            name: "Feb",
            "Hate Speech": 300,
            Misinformation: 200,
            Cyberbullying: 170,
            Harassment: 140,
          },
          {
            name: "Mar",
            "Hate Speech": 280,
            Misinformation: 220,
            Cyberbullying: 190,
            Harassment: 160,
          },
          {
            name: "Apr",
            "Hate Speech": 320,
            Misinformation: 250,
            Cyberbullying: 220,
            Harassment: 180,
          },
          {
            name: "May",
            "Hate Speech": 380,
            Misinformation: 310,
            Cyberbullying: 250,
            Harassment: 210,
          },
          {
            name: "Jun",
            "Hate Speech": 420,
            Misinformation: 350,
            Cyberbullying: 280,
            Harassment: 240,
          },
          {
            name: "Jul",
            "Hate Speech": 450,
            Misinformation: 380,
            Cyberbullying: 300,
            Harassment: 260,
          },
          {
            name: "Aug",
            "Hate Speech": 480,
            Misinformation: 400,
            Cyberbullying: 320,
            Harassment: 280,
          },
          {
            name: "Sep",
            "Hate Speech": 510,
            Misinformation: 430,
            Cyberbullying: 350,
            Harassment: 300,
          },
          {
            name: "Oct",
            "Hate Speech": 540,
            Misinformation: 460,
            Cyberbullying: 380,
            Harassment: 320,
          },
          {
            name: "Nov",
            "Hate Speech": 570,
            Misinformation: 490,
            Cyberbullying: 410,
            Harassment: 340,
          },
          {
            name: "Dec",
            "Hate Speech": 600,
            Misinformation: 520,
            Cyberbullying: 440,
            Harassment: 360,
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [userId])

  if (loading) {
    return <div className="flex justify-center items-center h-[350px]">Loading chart data...</div>
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
        <Tooltip />
        <Bar dataKey="Hate Speech" fill="#ef4444" radius={[4, 4, 0, 0]} name="Hate Speech" />
        <Bar dataKey="Misinformation" fill="#f97316" radius={[4, 4, 0, 0]} name="Misinformation" />
        <Bar dataKey="Cyberbullying" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Cyberbullying" />
        <Bar dataKey="Harassment" fill="#06b6d4" radius={[4, 4, 0, 0]} name="Harassment" />
      </BarChart>
    </ResponsiveContainer>
  )
}

