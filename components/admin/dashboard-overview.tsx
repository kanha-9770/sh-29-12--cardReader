// "use client"

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import {
//   BarChart,
//   Bar,
//   PieChart,
//   Pie,
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
//   Cell,
// } from "recharts"
// import { TrendingUp, Users, FileText, CheckCircle } from "lucide-react"
// import type { FormData } from "@/types/form"

// interface DashboardOverviewProps {
//   forms: FormData[]
// }

// export function DashboardOverview({ forms }: DashboardOverviewProps) {
//   // Calculate metrics
//   const totalCards = forms.length
//   const totalUsers = new Set(forms.map((f) => f.userId)).size

//   const leadStatusData = forms.reduce((acc: Record<string, number>, form) => {
//     const status = form.leadStatus || "Unspecified"
//     acc[status] = (acc[status] || 0) + 1
//     return acc
//   }, {})

//   const dealStatusData = forms.reduce((acc: Record<string, number>, form) => {
//     const status = form.dealStatus || "Unspecified"
//     acc[status] = (acc[status] || 0) + 1
//     return acc
//   }, {})

//   const meetingsScheduled = forms.filter((f) => f.meetingAfterExhibition).length
//   const extractionSuccessRate = forms.filter((f) => f.extractionStatus === "completed").length

//   // Format data for charts
//   const leadStatusChart = Object.entries(leadStatusData).map(([name, value]) => ({
//     name,
//     value,
//   }))

//   const dealStatusChart = Object.entries(dealStatusData).map(([name, value]) => ({
//     name,
//     value,
//   }))

//   // Sales person performance
//   const salesPerformance = forms.reduce((acc: Record<string, number>, form) => {
//     const person = form.salesPerson || "Unknown"
//     acc[person] = (acc[person] || 0) + 1
//     return acc
//   }, {})

//   const salesChart = Object.entries(salesPerformance)
//     .map(([name, value]) => ({
//       name,
//       scans: value,
//     }))
//     .sort((a, b) => b.scans - a.scans)
//     .slice(0, 8)

//   // Time series data (cards by date)
//   const dateData = forms.reduce((acc: Record<string, number>, form) => {
//     if (form.date) {
//       const date = new Date(form.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })
//       acc[date] = (acc[date] || 0) + 1
//     }
//     return acc
//   }, {})

//   const timeSeriesChart = Object.entries(dateData)
//     .map(([date, count]) => ({
//       date,
//       scans: count,
//     }))
//     .slice(-7)

//   const COLORS = [
//     "hsl(var(--chart-1))",
//     "hsl(var(--chart-2))",
//     "hsl(var(--chart-3))",
//     "hsl(var(--chart-4))",
//     "hsl(var(--chart-5))",
//   ]

//   return (
//     <div className="space-y-6">
//       {/* Key Metrics */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//         <Card className="border-l-4 border-l-blue-500">
//           <CardHeader className="flex flex-row items-center justify-between pb-2">
//             <CardTitle className="text-sm font-medium text-muted-foreground">Total Card Scans</CardTitle>
//             <FileText className="h-4 w-4 text-blue-500" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-3xl font-bold">{totalCards}</div>
//             <p className="text-xs text-muted-foreground mt-1">Business cards scanned</p>
//           </CardContent>
//         </Card>

//         <Card className="border-l-4 border-l-purple-500">
//           <CardHeader className="flex flex-row items-center justify-between pb-2">
//             <CardTitle className="text-sm font-medium text-muted-foreground">Active Users</CardTitle>
//             <Users className="h-4 w-4 text-purple-500" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-3xl font-bold">{totalUsers}</div>
//             <p className="text-xs text-muted-foreground mt-1">Users scanning cards</p>
//           </CardContent>
//         </Card>

//         <Card className="border-l-4 border-l-green-500">
//           <CardHeader className="flex flex-row items-center justify-between pb-2">
//             <CardTitle className="text-sm font-medium text-muted-foreground">Meetings Scheduled</CardTitle>
//             <CheckCircle className="h-4 w-4 text-green-500" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-3xl font-bold">{meetingsScheduled}</div>
//             <p className="text-xs text-muted-foreground mt-1">
//               {((meetingsScheduled / totalCards) * 100).toFixed(1)}% conversion
//             </p>
//           </CardContent>
//         </Card>

//         <Card className="border-l-4 border-l-orange-500">
//           <CardHeader className="flex flex-row items-center justify-between pb-2">
//             <CardTitle className="text-sm font-medium text-muted-foreground">Extraction Success</CardTitle>
//             <TrendingUp className="h-4 w-4 text-orange-500" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-3xl font-bold">{extractionSuccessRate}</div>
//             <p className="text-xs text-muted-foreground mt-1">
//               {((extractionSuccessRate / totalCards) * 100).toFixed(1)}% success rate
//             </p>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Charts Section */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Lead Status Distribution */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="text-base">Lead Status Distribution</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <ResponsiveContainer width="100%" height={300}>
//               <PieChart>
//                 <Pie
//                   data={leadStatusChart}
//                   cx="50%"
//                   cy="50%"
//                   labelLine={false}
//                   label={({ name, value }) => `${name}: ${value}`}
//                   outerRadius={100}
//                   fill="#8884d8"
//                   dataKey="value"
//                 >
//                   {leadStatusChart.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//               </PieChart>
//             </ResponsiveContainer>
//           </CardContent>
//         </Card>

//         {/* Deal Status Distribution */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="text-base">Deal Status Distribution</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <ResponsiveContainer width="100%" height={300}>
//               <PieChart>
//                 <Pie
//                   data={dealStatusChart}
//                   cx="50%"
//                   cy="50%"
//                   labelLine={false}
//                   label={({ name, value }) => `${name}: ${value}`}
//                   outerRadius={100}
//                   fill="#82ca9d"
//                   dataKey="value"
//                 >
//                   {dealStatusChart.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//               </PieChart>
//             </ResponsiveContainer>
//           </CardContent>
//         </Card>

//         {/* Sales Performance */}
//         <Card className="lg:col-span-2">
//           <CardHeader>
//             <CardTitle className="text-base">Sales Person Performance</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={salesChart}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="name" />
//                 <YAxis />
//                 <Tooltip />
//                 <Bar dataKey="scans" fill="hsl(var(--chart-1))" radius={[8, 8, 0, 0]} />
//               </BarChart>
//             </ResponsiveContainer>
//           </CardContent>
//         </Card>

//         {/* Card Scans Over Time */}
//         <Card className="lg:col-span-2">
//           <CardHeader>
//             <CardTitle className="text-base">Card Scans Trend (Last 7 Days)</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <ResponsiveContainer width="100%" height={300}>
//               <LineChart data={timeSeriesChart}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="date" />
//                 <YAxis />
//                 <Tooltip />
//                 <Legend />
//                 <Line
//                   type="monotone"
//                   dataKey="scans"
//                   stroke="hsl(var(--chart-2))"
//                   strokeWidth={2}
//                   dot={{ fill: "hsl(var(--chart-2))" }}
//                 />
//               </LineChart>
//             </ResponsiveContainer>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }


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
import { format } from "date-fns"

interface DashboardOverviewProps {
  forms: FormData[]
}

export function DashboardOverview({ forms }: DashboardOverviewProps) {
  // === Key Metrics ===
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

  // === Chart Data ===
  const leadStatusChart = Object.entries(leadStatusData).map(([name, value]) => ({
    name,
    value,
  }))

  const dealStatusChart = Object.entries(dealStatusData).map(([name, value]) => ({
    name,
    value,
  }))

  // === USER PERFORMANCE (REAL USERS – NOT salesPerson field) ===
  const userPerformance = forms.reduce((acc: Record<string.annotations, any>, form) => {
    const userId = form.userId || "unknown"
    const userEmail = form.user?.email || "Unknown User"

    if (!acc[userId]) {
      acc[userId] = {
        userId,
        email: userEmail,
        totalScans: 0,
        hotLeads: 0,
        meetings: 0,
        dealsClosed: 0,
        lastActive: null as Date | null,
      }
    }

    acc[userId].totalScans += 1
    if (form.leadStatus === "Hot") acc[userId].hotLeads += 1
    if (form.meetingAfterExhibition) acc[userId].meetings += 1
    if (form.dealStatus === "Closed") acc[userId].dealsClosed += 1

    const createdAt = form.createdAt ? new Date(form.createdAt) : null
    if (createdAt && (!acc[userId].lastActive || createdAt > acc[userId].lastActive)) {
      acc[userId].lastActive = createdAt
    }

    return acc
  }, {} as Record<string, any>)

  const userChartData = Object.values(userPerformance)
    .map((u: any) => ({
      name: u.email.split("@")[0].substring(0, 12),
      fullName: u.email,
      scans: u.totalScans,
      hot: u.hotLeads,
      meetings: u.meetings,
      deals: u.dealsClosed,
    }))
    .sort((a: any, b: any) => b.scans - a.scans)
    .slice(0, 10)

  // === Time Series (Last 7 Days) ===
  const dateData = forms.reduce((acc: Record<string, number>, form) => {
    if (form.date) {
      const date = new Date(form.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })
      acc[date] = (acc[date] || 0) + 1
    }
    return acc
  }, {})

  const timeSeriesChart = Object.entries(dateData)
    .map(([date, count]) => ({ date, scans: count }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
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
            <p className="text-xs text-muted-foreground mt-1">Team members scanning</p>
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
              {totalCards > 0 ? ((meetingsScheduled / totalCards) * 100).toFixed(1) : 0}% conversion
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
              {totalCards > 0 ? ((extractionSuccessRate / totalCards) * 100).toFixed(1) : 0}% success rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lead Status */}
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

        {/* Deal Status */}
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

        {/* USER PERFORMANCE – REAL SALES TEAM */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              User Performance (Your Sales Team)
              <span className="text-xs font-normal text-muted-foreground">
                Real users who scanned cards
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={userChartData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={90}
                  interval={0}
                  tick={{ fontSize: 11 }}
                />
                <YAxis />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload
                      return (
                        <div className="bg-background border rounded-lg shadow-lg p-4 text-sm">
                          <p className="font-bold text-base">{data.fullName}</p>
                          <div className="space-y-1 mt-2">
                            <p>Total Scans: <strong>{data.scans}</strong></p>
                            <p>Hot Leads: <strong className="text-red-600">{data.hot}</strong></p>
                            <p>Meetings: <strong className="text-green-600">{data.meetings}</strong></p>
                            <p>Deals Closed: <strong className="text-blue-600">{data.deals}</strong></p>
                          </div>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Legend />
                <Bar dataKey="scans" fill="hsl(var(--chart-1))" radius={[8, 8, 0, 0]} name="Total Scans" />
                <Bar dataKey="hot" fill="hsl(var(--chart-2))" radius={[8, 8, 0, 0]} name="Hot Leads" />
                <Bar dataKey="meetings" fill="hsl(var(--chart-3))" radius={[8, 8, 0, 0]} name="Meetings" />
              </BarChart>
            </ResponsiveContainer>

            {/* Leaderboard Table */}
            {userChartData.length > 0 && (
              <div className="mt-6 border rounded-lg overflow-hidden">
                <table className="w-full text-xs">
                  <thead className="bg-muted">
                    <tr>
                      <th className="text-left py-3 px-4 font-medium">Rank</th>
                      <th className="text-left py-3 px-4 font-medium">User</th>
                      <th className="text-center py-3 px-4">Scans</th>
                      <th className="text-center py-3 px-4">Hot</th>
                      <th className="text-center py-3 px-4">Meetings</th>
                      <th className="text-center py-3 px-4">Deals</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userChartData.map((user: any, idx: number) => (
                      <tr key={user.fullName} className="border-t hover:bg-muted/50">
                        <td className="py-3 px-4">
                          {idx === 0 && "1st"} {idx === 1 && "2nd"} {idx === 2 && "3rd"} {idx > 2 && `${idx + 1}th`}
                        </td>
                        <td className="py-3 px-4 font-medium">{user.fullName}</td>
                        <td className="text-center font-bold text-lg">{user.scans}</td>
                        <td className="text-center text-red-600 font-semibold">{user.hot}</td>
                        <td className="text-center text-green-600 font-semibold">{user.meetings}</td>
                        <td className="text-center text-blue-600 font-semibold">{user.deals}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
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
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--chart-2))", r: 6 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}