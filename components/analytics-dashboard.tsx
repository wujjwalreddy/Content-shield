"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { AnalyticsData } from "@/lib/schemas/content-types"
import { getMockAnalyticsData } from "@/lib/services/mock-data-service"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

interface AnalyticsDashboardProps {
  userId: string
}

export function AnalyticsDashboard({ userId }: AnalyticsDashboardProps) {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [timeRange, setTimeRange] = useState<"day" | "week" | "month" | "year">("month")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const data = await getMockAnalyticsData(userId)
        setAnalyticsData(data)
      } catch (error) {
        console.error("Error fetching analytics data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [userId, timeRange])

  if (loading || !analyticsData) {
    return <div className="flex justify-center items-center h-[600px]">Loading analytics...</div>
  }

  // Platform colors
  const platformColors: Record<string, string> = {
    Twitter: "#1da1f2",
    Reddit: "#ff4500",
    Facebook: "#4267B2",
    Instagram: "#C13584",
    YouTube: "#FF0000",
    TikTok: "#000000",
    Other: "#6b7280",
  }

  // Category colors
  const categoryColors: Record<string, string> = {
    "Hate Speech": "#ef4444",
    Misinformation: "#f97316",
    Cyberbullying: "#8b5cf6",
    Harassment: "#06b6d4",
    "Self-harm": "#ec4899",
    Threats: "#dc2626",
    Other: "#6b7280",
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h2>
        <Select value={timeRange} onValueChange={(value) => setTimeRange(value as any)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">Last 24 Hours</SelectItem>
            <SelectItem value="week">Last Week</SelectItem>
            <SelectItem value="month">Last Month</SelectItem>
            <SelectItem value="year">Last Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="bg-white dark:bg-gray-800 shadow-md w-full justify-start">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="content">Content Analysis</TabsTrigger>
          <TabsTrigger value="platforms">Platform Breakdown</TabsTrigger>
          <TabsTrigger value="accuracy">AI Accuracy</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="bg-white dark:bg-gray-800 shadow-md border-none">
              <CardHeader>
                <CardTitle>Flagged Content Over Time</CardTitle>
                <CardDescription>Number of flagged items per day</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={analyticsData.flaggedOverTime}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="count"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        activeDot={{ r: 8 }}
                        name="Flagged Content"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 shadow-md border-none">
              <CardHeader>
                <CardTitle>Platform Distribution</CardTitle>
                <CardDescription>Breakdown by platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analyticsData.platformBreakdown}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="percentage"
                        nameKey="platform"
                        label={({ name, percent }) => `${name} ${(percent).toFixed(0)}%`}
                      >
                        {analyticsData.platformBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={platformColors[entry.platform] || "#6b7280"} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}%`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-white dark:bg-gray-800 shadow-md border-none">
            <CardHeader>
              <CardTitle>Category Trends</CardTitle>
              <CardDescription>How different types of harmful content have changed over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analyticsData.categoryTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {Object.keys(analyticsData.categoryTrends[0])
                      .filter((key) => key !== "date")
                      .map((key, index) => (
                        <Line
                          key={index}
                          type="monotone"
                          dataKey={key}
                          stroke={categoryColors[key] || "#6b7280"}
                          strokeWidth={2}
                          name={key}
                        />
                      ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <Card className="bg-white dark:bg-gray-800 shadow-md border-none">
            <CardHeader>
              <CardTitle>Content Categories</CardTitle>
              <CardDescription>Distribution of harmful content by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: "Hate Speech", value: 35 },
                      { name: "Misinformation", value: 25 },
                      { name: "Cyberbullying", value: 20 },
                      { name: "Harassment", value: 15 },
                      { name: "Self-harm", value: 5 },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#8b5cf6" name="Count">
                      {[
                        { name: "Hate Speech", value: 35 },
                        { name: "Misinformation", value: 25 },
                        { name: "Cyberbullying", value: 20 },
                        { name: "Harassment", value: 15 },
                        { name: "Self-harm", value: 5 },
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={categoryColors[entry.name] || "#6b7280"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="bg-white dark:bg-gray-800 shadow-md border-none">
              <CardHeader>
                <CardTitle>Severity Distribution</CardTitle>
                <CardDescription>Breakdown by severity level</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: "Critical", value: 35, color: "#ef4444" },
                          { name: "High", value: 45, color: "#f97316" },
                          { name: "Medium", value: 15, color: "#eab308" },
                          { name: "Low", value: 5, color: "#22c55e" },
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {[
                          { name: "Critical", value: 35, color: "#ef4444" },
                          { name: "High", value: 45, color: "#f97316" },
                          { name: "Medium", value: 15, color: "#eab308" },
                          { name: "Low", value: 5, color: "#22c55e" },
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}%`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 shadow-md border-none">
              <CardHeader>
                <CardTitle>AI Decision Distribution</CardTitle>
                <CardDescription>Breakdown by AI recommendation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: "Remove", value: 65, color: "#ef4444" },
                          { name: "Flag for Review", value: 30, color: "#f97316" },
                          { name: "Approve", value: 5, color: "#22c55e" },
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {[
                          { name: "Remove", value: 65, color: "#ef4444" },
                          { name: "Flag for Review", value: 30, color: "#f97316" },
                          { name: "Approve", value: 5, color: "#22c55e" },
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}%`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="platforms" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="bg-white dark:bg-gray-800 shadow-md border-none">
              <CardHeader>
                <CardTitle>Platform Distribution</CardTitle>
                <CardDescription>Breakdown by platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analyticsData.platformBreakdown} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="platform" type="category" />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="percentage" name="Percentage" fill="#3b82f6" radius={[0, 4, 4, 0]}>
                        {analyticsData.platformBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={platformColors[entry.platform] || "#6b7280"} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 shadow-md border-none">
              <CardHeader>
                <CardTitle>Platform-specific Categories</CardTitle>
                <CardDescription>Most common harmful content by platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { platform: "Twitter", "Hate Speech": 40, Misinformation: 25, Harassment: 20, Other: 15 },
                        { platform: "Reddit", "Hate Speech": 30, Misinformation: 35, Harassment: 25, Other: 10 },
                        { platform: "Facebook", "Hate Speech": 25, Misinformation: 45, Harassment: 15, Other: 15 },
                        { platform: "Instagram", "Hate Speech": 20, Misinformation: 15, Harassment: 45, Other: 20 },
                        { platform: "YouTube", "Hate Speech": 35, Misinformation: 30, Harassment: 25, Other: 10 },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="platform" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="Hate Speech" stackId="a" fill={categoryColors["Hate Speech"]} />
                      <Bar dataKey="Misinformation" stackId="a" fill={categoryColors["Misinformation"]} />
                      <Bar dataKey="Harassment" stackId="a" fill={categoryColors["Harassment"]} />
                      <Bar dataKey="Other" stackId="a" fill={categoryColors["Other"]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-white dark:bg-gray-800 shadow-md border-none">
            <CardHeader>
              <CardTitle>Platform Activity Over Time</CardTitle>
              <CardDescription>Flagged content by platform over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={[
                      { date: "2023-01-01", Twitter: 45, Reddit: 32, Facebook: 28, Instagram: 20, YouTube: 15 },
                      { date: "2023-01-08", Twitter: 52, Reddit: 38, Facebook: 32, Instagram: 25, YouTube: 18 },
                      { date: "2023-01-15", Twitter: 58, Reddit: 42, Facebook: 35, Instagram: 28, YouTube: 22 },
                      { date: "2023-01-22", Twitter: 65, Reddit: 48, Facebook: 40, Instagram: 32, YouTube: 25 },
                      { date: "2023-01-29", Twitter: 72, Reddit: 53, Facebook: 45, Instagram: 35, YouTube: 28 },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="Twitter" stroke={platformColors["Twitter"]} strokeWidth={2} />
                    <Line type="monotone" dataKey="Reddit" stroke={platformColors["Reddit"]} strokeWidth={2} />
                    <Line type="monotone" dataKey="Facebook" stroke={platformColors["Facebook"]} strokeWidth={2} />
                    <Line type="monotone" dataKey="Instagram" stroke={platformColors["Instagram"]} strokeWidth={2} />
                    <Line type="monotone" dataKey="YouTube" stroke={platformColors["YouTube"]} strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accuracy" className="space-y-4">
          <Card className="bg-white dark:bg-gray-800 shadow-md border-none">
            <CardHeader>
              <CardTitle>AI Accuracy Over Time</CardTitle>
              <CardDescription>How AI detection accuracy has improved</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analyticsData.accuracyOverTime}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[80, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="accuracy"
                      stroke="#10b981"
                      strokeWidth={3}
                      activeDot={{ r: 8 }}
                      name="AI Accuracy (%)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="bg-white dark:bg-gray-800 shadow-md border-none">
              <CardHeader>
                <CardTitle>Accuracy by Category</CardTitle>
                <CardDescription>AI performance across different content types</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { category: "Hate Speech", accuracy: 95.2 },
                        { category: "Misinformation", accuracy: 89.7 },
                        { category: "Cyberbullying", accuracy: 92.5 },
                        { category: "Harassment", accuracy: 91.8 },
                        { category: "Self-harm", accuracy: 94.3 },
                        { category: "Threats", accuracy: 93.6 },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category" />
                      <YAxis domain={[80, 100]} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="accuracy" name="Accuracy (%)" fill="#10b981" radius={[4, 4, 0, 0]}>
                        {[
                          { category: "Hate Speech", accuracy: 95.2 },
                          { category: "Misinformation", accuracy: 89.7 },
                          { category: "Cyberbullying", accuracy: 92.5 },
                          { category: "Harassment", accuracy: 91.8 },
                          { category: "Self-harm", accuracy: 94.3 },
                          { category: "Threats", accuracy: 93.6 },
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={categoryColors[entry.category] || "#6b7280"} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 shadow-md border-none">
              <CardHeader>
                <CardTitle>Human Override Rate</CardTitle>
                <CardDescription>Percentage of AI decisions overridden by humans</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={[
                        { date: "2023-01-01", rate: 12.5 },
                        { date: "2023-01-08", rate: 11.2 },
                        { date: "2023-01-15", rate: 9.8 },
                        { date: "2023-01-22", rate: 8.5 },
                        { date: "2023-01-29", rate: 7.3 },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="rate"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        activeDot={{ r: 8 }}
                        name="Override Rate (%)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

