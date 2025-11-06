"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts"
import { TrendingUp, Users, FileText, CheckCircle } from "lucide-react"
import type { FormData } from "@/types/form"

interface DashboardOverviewProps {
  forms: FormData[]
}

export function DashboardOverview({ forms }: DashboardOverviewProps) {
  // Calculate metrics
  const totalCards = forms.length
  const totalUsers = new Set(forms.map((f) => f.userId)).size

  const leadStatusData = forms.reduce((acc: Record<string, number>, form) => {
    const status = form.leadStatus || "Unspecified"
    acc[status] = (acc[status] || 0) + 1
    return acc
  }, {})

  const dealStatusData = forms.reduce((acc: Record<string, number>, form) => {
    const status = form.dealStatus || "Unspecified"
    acc[status] = (acc[status] || 0) + 1
    return acc
  }, {})

  const meetingsScheduled = forms.filter((f) => f.meetingAfterExhibition).length
  const extractionSuccessRate = forms.filter((f) => f.extractionStatus === "completed").length

  // Format data for charts
  const leadStatusChart = Object.entries(leadStatusData).map(([name, value]) => ({
    name,
    value,
  }))

  const dealStatusChart = Object.entries(dealStatusData).map(([name, value]) => ({
    name,
    value,
  }))

  // Sales person performance
  const salesPerformance = forms.reduce((acc: Record<string, number>, form) => {
    const person = form.salesPerson || "Unknown"
    acc[person] = (acc[person] || 0) + 1
    return acc
  }, {})

  const salesChart = Object.entries(salesPerformance)
    .map(([name, value]) => ({
      name,
      scans: value,
    }))
    .sort((a, b) => b.scans - a.scans)
    .slice(0, 8)

  // Time series data (cards by date)
  const dateData = forms.reduce((acc: Record<string, number>, form) => {
    if (form.date) {
      const date = new Date(form.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })
      acc[date] = (acc[date] || 0) + 1
    }
    return acc
  }, {})

  const timeSeriesChart = Object.entries(dateData)
    .map(([date, count]) => ({
      date,
      scans: count,
    }))
    .slice(-7)

  const COLORS = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
  ]

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Card Scans</CardTitle>
            <FileText className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalCards}</div>
            <p className="text-xs text-muted-foreground mt-1">Business cards scanned</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Users</CardTitle>
            <Users className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground mt-1">Users scanning cards</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Meetings Scheduled</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{meetingsScheduled}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {((meetingsScheduled / totalCards) * 100).toFixed(1)}% conversion
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Extraction Success</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{extractionSuccessRate}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {((extractionSuccessRate / totalCards) * 100).toFixed(1)}% success rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lead Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Lead Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={leadStatusChart}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {leadStatusChart.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Deal Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Deal Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dealStatusChart}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#82ca9d"
                  dataKey="value"
                >
                  {dealStatusChart.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Sales Performance */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Sales Person Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesChart}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="scans" fill="hsl(var(--chart-1))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Card Scans Over Time */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Card Scans Trend (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timeSeriesChart}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="scans"
                  stroke="hsl(var(--chart-2))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--chart-2))" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
