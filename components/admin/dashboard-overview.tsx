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
// import { format } from "date-fns"

// interface DashboardOverviewProps {
//   forms: FormData[]
// }

// export function DashboardOverview({ forms }: DashboardOverviewProps) {
//   // === Key Metrics ===
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

//   // === Chart Data ===
//   const leadStatusChart = Object.entries(leadStatusData).map(([name, value]) => ({
//     name,
//     value,
//   }))

//   const dealStatusChart = Object.entries(dealStatusData).map(([name, value]) => ({
//     name,
//     value,
//   }))

//   // === USER PERFORMANCE (REAL USERS – NOT salesPerson field) ===
//   const userPerformance = forms.reduce((acc: Record<string.annotations, any>, form) => {
//     const userId = form.userId || "unknown"
//     const userEmail = form.user?.email || "Unknown User"

//     if (!acc[userId]) {
//       acc[userId] = {
//         userId,
//         email: userEmail,
//         totalScans: 0,
//         hotLeads: 0,
//         meetings: 0,
//         dealsClosed: 0,
//         lastActive: null as Date | null,
//       }
//     }

//     acc[userId].totalScans += 1
//     if (form.leadStatus === "Hot") acc[userId].hotLeads += 1
//     if (form.meetingAfterExhibition) acc[userId].meetings += 1
//     if (form.dealStatus === "Closed") acc[userId].dealsClosed += 1

//     const createdAt = form.createdAt ? new Date(form.createdAt) : null
//     if (createdAt && (!acc[userId].lastActive || createdAt > acc[userId].lastActive)) {
//       acc[userId].lastActive = createdAt
//     }

//     return acc
//   }, {} as Record<string, any>)

//   const userChartData = Object.values(userPerformance)
//     .map((u: any) => ({
//       name: u.email.split("@")[0].substring(0, 12),
//       fullName: u.email,
//       scans: u.totalScans,
//       hot: u.hotLeads,
//       meetings: u.meetings,
//       deals: u.dealsClosed,
//     }))
//     .sort((a: any, b: any) => b.scans - a.scans)
//     .slice(0, 10)

//   // === Time Series (Last 7 Days) ===
//   const dateData = forms.reduce((acc: Record<string, number>, form) => {
//     if (form.date) {
//       const date = new Date(form.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })
//       acc[date] = (acc[date] || 0) + 1
//     }
//     return acc
//   }, {})

//   const timeSeriesChart = Object.entries(dateData)
//     .map(([date, count]) => ({ date, scans: count }))
//     .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
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
//             <p className="text-xs text-muted-foreground mt-1">Team members scanning</p>
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
//               {totalCards > 0 ? ((meetingsScheduled / totalCards) * 100).toFixed(1) : 0}% conversion
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
//               {totalCards > 0 ? ((extractionSuccessRate / totalCards) * 100).toFixed(1) : 0}% success rate
//             </p>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Charts Section */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Lead Status */}
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

//         {/* Deal Status */}
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

//         {/* USER PERFORMANCE – REAL SALES TEAM */}
//         <Card className="lg:col-span-2">
//           <CardHeader>
//             <CardTitle className="text-base flex items-center gap-2">
//               User Performance (Your Sales Team)
//               <span className="text-xs font-normal text-muted-foreground">
//                 Real users who scanned cards
//               </span>
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <ResponsiveContainer width="100%" height={320}>
//               <BarChart data={userChartData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis
//                   dataKey="name"
//                   angle={-45}
//                   textAnchor="end"
//                   height={90}
//                   interval={0}
//                   tick={{ fontSize: 11 }}
//                 />
//                 <YAxis />
//                 <Tooltip
//                   content={({ active, payload }) => {
//                     if (active && payload && payload.length) {
//                       const data = payload[0].payload
//                       return (
//                         <div className="bg-background border rounded-lg shadow-lg p-4 text-sm">
//                           <p className="font-bold text-base">{data.fullName}</p>
//                           <div className="space-y-1 mt-2">
//                             <p>Total Scans: <strong>{data.scans}</strong></p>
//                             <p>Hot Leads: <strong className="text-red-600">{data.hot}</strong></p>
//                             <p>Meetings: <strong className="text-green-600">{data.meetings}</strong></p>
//                             <p>Deals Closed: <strong className="text-blue-600">{data.deals}</strong></p>
//                           </div>
//                         </div>
//                       )
//                     }
//                     return null
//                   }}
//                 />
//                 <Legend />
//                 <Bar dataKey="scans" fill="hsl(var(--chart-1))" radius={[8, 8, 0, 0]} name="Total Scans" />
//                 <Bar dataKey="hot" fill="hsl(var(--chart-2))" radius={[8, 8, 0, 0]} name="Hot Leads" />
//                 <Bar dataKey="meetings" fill="hsl(var(--chart-3))" radius={[8, 8, 0, 0]} name="Meetings" />
//               </BarChart>
//             </ResponsiveContainer>

//             {/* Leaderboard Table */}
//             {userChartData.length > 0 && (
//               <div className="mt-6 border rounded-lg overflow-hidden">
//                 <table className="w-full text-xs">
//                   <thead className="bg-muted">
//                     <tr>
//                       <th className="text-left py-3 px-4 font-medium">Rank</th>
//                       <th className="text-left py-3 px-4 font-medium">User</th>
//                       <th className="text-center py-3 px-4">Scans</th>
//                       <th className="text-center py-3 px-4">Hot</th>
//                       <th className="text-center py-3 px-4">Meetings</th>
//                       <th className="text-center py-3 px-4">Deals</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {userChartData.map((user: any, idx: number) => (
//                       <tr key={user.fullName} className="border-t hover:bg-muted/50">
//                         <td className="py-3 px-4">
//                           {idx === 0 && "1st"} {idx === 1 && "2nd"} {idx === 2 && "3rd"} {idx > 2 && `${idx + 1}th`}
//                         </td>
//                         <td className="py-3 px-4 font-medium">{user.fullName}</td>
//                         <td className="text-center font-bold text-lg">{user.scans}</td>
//                         <td className="text-center text-red-600 font-semibold">{user.hot}</td>
//                         <td className="text-center text-green-600 font-semibold">{user.meetings}</td>
//                         <td className="text-center text-blue-600 font-semibold">{user.deals}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}
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
//                   strokeWidth={3}
//                   dot={{ fill: "hsl(var(--chart-2))", r: 6 }}
//                   activeDot={{ r: 8 }}
//                 />
//               </LineChart>
//             </ResponsiveContainer>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }

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
// import { format } from "date-fns"
// import React, { lazy, Suspense, useEffect, useMemo } from "react"

// // -------------------------------------------------------------------
// // Lazy-load heavy charts only on mobile (they are cheap on desktop anyway)
// const LazyPieChart = lazy(() => import("recharts").then((module) => ({ default: module.PieChart })))
// const LazyBarChart = lazy(() => import("recharts").then((module) => ({ default: module.BarChart })))
// const LazyLineChart = lazy(() => import("recharts").then((module) => ({ default: module.LineChart })))

// interface DashboardOverviewProps {
//   forms: FormData[]
// }

// export function DashboardOverview({ forms }: DashboardOverviewProps) {
//   // -----------------------------------------------------------------
//   // === Key Metrics (memoized) ===
//   const {
//     totalCards,
//     totalUsers,
//     meetingsScheduled,
//     extractionSuccessRate,
//     leadStatusChart,
//     dealStatusChart,
//     userChartData,
//     timeSeriesChart,
//   } = useMemo(() => {
//     const totalCards = forms.length
//     const totalUsers = new Set(forms.map((f) => f.userId)).size

//     const leadStatusData = forms.reduce((acc: Record<string, number>, f) => {
//       const s = f.leadStatus || "Unspecified"
//       acc[s] = (acc[s] || 0) + 1
//       return acc
//     }, {})

//     const dealStatusData = forms.reduce((acc: Record<string, number>, f) => {
//       const s = f.dealStatus || "Unspecified"
//       acc[s] = (acc[s] || 0) + 1
//       return acc
//     }, {})

//     const meetingsScheduled = forms.filter((f) => f.meetingAfterExhibition).length
//     const extractionSuccessRate = forms.filter((f) => f.extractionStatus === "completed").length

//     const leadStatusChart = Object.entries(leadStatusData).map(([name, value]) => ({
//       name,
//       value,
//     }))

//     const dealStatusChart = Object.entries(dealStatusData).map(([name, value]) => ({
//       name,
//       value,
//     }))

//     // USER PERFORMANCE
//     const userPerf = forms.reduce((acc: Record<string, any>, f) => {
//       const uid = f.userId || "unknown"
//       const email = f.user?.email || "Unknown User"

//       if (!acc[uid]) {
//         acc[uid] = {
//           userId: uid,
//           email,
//           totalScans: 0,
//           hotLeads: 0,
//           meetings: 0,
//           dealsClosed: 0,
//           lastActive: null as Date | null,
//         }
//       }

//       acc[uid].totalScans += 1
//       if (f.leadStatus === "Hot") acc[uid].hotLeads += 1
//       if (f.meetingAfterExhibition) acc[uid].meetings += 1
//       if (f.dealStatus === "Closed") acc[uid].dealsClosed += 1

//       const created = f.createdAt ? new Date(f.createdAt) : null
//       if (created && (!acc[uid].lastActive || created > acc[uid].lastActive)) {
//         acc[uid].lastActive = created
//       }
//       return acc
//     }, {} as Record<string, any>)

//     const userChartData = Object.values(userPerf)
//       .map((u: any) => ({
//         name: u.email.split("@")[0].substring(0, 10),
//         fullName: u.email,
//         scans: u.totalScans,
//         hot: u.hotLeads,
//         meetings: u.meetings,
//         deals: u.dealsClosed,
//       }))
//       .sort((a: any, b: any) => b.scans - a.scans)
//       .slice(0, 10)

//     // TIME SERIES (last 7 days)
//     const dateMap = forms.reduce((acc: Record<string, number>, f) => {
//       if (f.date) {
//         const d = new Date(f.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })
//         acc[d] = (acc[d] || 0) + 1
//       }
//       return acc
//     }, {})

//     const timeSeriesChart = Object.entries(dateMap)
//       .map(([date, count]) => ({ date, scans: count }))
//       .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
//       .slice(-7)

//     return {
//       totalCards,
//       totalUsers,
//       meetingsScheduled,
//       extractionSuccessRate,
//       leadStatusChart,
//       dealStatusChart,
//       userChartData,
//       timeSeriesChart,
//     }
//   }, [forms])

//   const COLORS = [
//     "hsl(var(--chart-1))",
//     "hsl(var(--chart-2))",
//     "hsl(var(--chart-3))",
//     "hsl(var(--chart-4))",
//     "hsl(var(--chart-5))",
//   ]

//   // -----------------------------------------------------------------
//   // Optional: pre-warm chart bundles on idle (mobile only)
//   useEffect(() => {
//     if (window.innerWidth < 640 && "requestIdleCallback" in window) {
//       requestIdleCallback(() => {
//         import("recharts")
//       })
//     }
//   }, [])

//   // -----------------------------------------------------------------
//   return (
//     <div className="space-y-4 sm:space-y-6">
//       {/* ==================== KEY METRICS ==================== */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
//         {/* Total Card Scans */}
//         <Card className="border-l-4 border-l-blue-500">
//           <CardHeader className="flex flex-row items-center justify-between pb-1.5">
//             <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
//               Total Card Scans
//             </CardTitle>
//             <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
//           </CardHeader>
//           <CardContent className="pt-1">
//             <div className="text-2xl sm:text-3xl font-bold">{totalCards}</div>
//             <p className="text-xs text-muted-foreground">scanned</p>
//           </CardContent>
//         </Card>

//         {/* Active Users */}
//         <Card className="border-l-4 border-l-purple-500">
//           <CardHeader className="flex flex-row items-center justify-between pb-1.5">
//             <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
//               Active Users
//             </CardTitle>
//             <Users className="h-3 w-3 sm:h-4 sm:w-4 text-purple-500" />
//           </CardHeader>
//           <CardContent className="pt-1">
//             <div className="text-2xl sm:text-3xl font-bold">{totalUsers}</div>
//             <p className="text-xs text-muted-foreground">team members</p>
//           </CardContent>
//         </Card>

//         {/* Meetings Scheduled */}
//         <Card className="border-l-4 border-l-green-500">
//           <CardHeader className="flex flex-row items-center justify-between pb-1.5">
//             <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
//               Meetings Scheduled
//             </CardTitle>
//             <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
//           </CardHeader>
//           <CardContent className="pt-1">
//             <div className="text-2xl sm:text-3xl font-bold">{meetingsScheduled}</div>
//             <p className="text-xs text-muted-foreground">
//               {totalCards > 0 ? ((meetingsScheduled / totalCards) * 100).toFixed(1) : 0}% conv.
//             </p>
//           </CardContent>
//         </Card>

//         {/* Extraction Success */}
//         <Card className="border-l-4 border-l-orange-500">
//           <CardHeader className="flex flex-row items-center justify-between pb-1.5">
//             <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
//               Extraction Success
//             </CardTitle>
//             <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-orange-500" />
//           </CardHeader>
//           <CardContent className="pt-1">
//             <div className="text-2xl sm:text-3xl font-bold">{extractionSuccessRate}</div>
//             <p className="text-xs text-muted-foreground">
//               {totalCards > 0 ? ((extractionSuccessRate / totalCards) * 100).toFixed(1) : 0}% rate
//             </p>
//           </CardContent>
//         </Card>
//       </div>

//       {/* ==================== CHARTS ==================== */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         {/* Lead Status Pie */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="text-sm sm:text-base">Lead Status</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <Suspense fallback={<div className="h-56 w-full animate-pulse bg-muted/30" />}>
//               <ResponsiveContainer width="100%" height={window.innerWidth < 640 ? 220 : 300}>
//                 <LazyPieChart>
//                   <Pie
//                     data={leadStatusChart}
//                     cx="50%"
//                     cy="50%"
//                     labelLine={false}
//                     label={({ name, value }) => `${name}: ${value}`}
//                     outerRadius={window.innerWidth < 640 ? 70 : 100}
//                     fill="#8884d8"
//                     dataKey="value"
//                   >
//                     {leadStatusChart.map((_, i) => (
//                       <Cell key={i} fill={COLORS[i % COLORS.length]} />
//                     ))}
//                   </Pie>
//                   <Tooltip />
//                 </LazyPieChart>
//               </ResponsiveContainer>
//             </Suspense>
//           </CardContent>
//         </Card>

//         {/* USER PERFORMANCE BAR + LEADERBOARD */}
//         <Card className="md:col-span-2">
//           <CardHeader>
//             <CardTitle className="text-sm sm:text-base flex flex-col sm:flex-row sm:items-center gap-1">
//               User Performance
//               <span className="text-xs font-normal text-muted-foreground">
//                 Real users who scanned cards
//               </span>
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             {/* Bar Chart */}
//             <Suspense fallback={<div className="h-64 w-full animate-pulse bg-muted/30" />}>
//               <ResponsiveContainer width="100%" height={window.innerWidth < 640 ? 240 : 320}>
//                 <LazyBarChart
//                   data={userChartData}
//                   margin={{ top: 20, right: 10, left: 10, bottom: window.innerWidth < 640 ? 60 : 80 }}
//                 >
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis
//                     dataKey="name"
//                     angle={window.innerWidth < 640 ? -30 : -45}
//                     textAnchor="end"
//                     height={window.innerWidth < 640 ? 70 : 90}
//                     interval={window.innerWidth < 640 ? "preserveStartEnd" : 0}
//                     tick={{ fontSize: window.innerWidth < 640 ? 10 : 11 }}
//                   />
//                   <YAxis />
//                   <Tooltip
//                     content={({ active, payload }) => {
//                       if (active && payload?.length) {
//                         const d = payload[0].payload
//                         return (
//                           <div className="bg-background border rounded-lg shadow-lg p-3 text-xs">
//                             <p className="font-semibold">{d.fullName}</p>
//                             <div className="mt-1 space-y-0.5">
//                               <p>Scans: <strong>{d.scans}</strong></p>
//                               <p>Hot: <strong className="text-red-600">{d.hot}</strong></p>
//                               <p>Meetings: <strong className="text-green-600">{d.meetings}</strong></p>
//                               <p>Deals: <strong className="text-blue-600">{d.deals}</strong></p>
//                             </div>
//                           </div>
//                         )
//                       }
//                       return null
//                     }}
//                   />
//                   <Legend />
//                   <Bar dataKey="scans" fill="hsl(var(--chart-1))" radius={[6, 6, 0, 0]} name="Scans" />
//                   <Bar dataKey="hot" fill="hsl(var(--chart-2))" radius={[6, 6, 0, 0]} name="Hot Leads" />
//                   <Bar dataKey="meetings" fill="hsl(var(--chart-3))" radius={[6, 6, 0, 0]} name="Meetings" />
//                 </LazyBarChart>
//               </ResponsiveContainer>
//             </Suspense>

//             {/* Leaderboard – horizontal scroll on mobile */}
//             {userChartData.length > 0 && (
//               <div className="mt-4 -mx-4 overflow-x-auto sm:mx-0 sm:overflow-visible">
//                 <div className="inline-block min-w-full align-middle">
//                   <table className="w-full text-xs">
//                     <thead className="bg-muted">
//                       <tr>
//                         <th className="sticky left-0 bg-muted text-left py-2 px-3 font-medium">Rank</th>
//                         <th className="text-left py-2 px-3 font-medium">User</th>
//                         <th className="text-center py-2 px-3">Scans</th>
//                         <th className="text-center py-2 px-3">Hot</th>
//                         <th className="text-center py-2 px-3">Meetings</th>
//                         <th className="text-center py-2 px-3">Deals</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {userChartData.map((u: any, i: number) => (
//                         <tr key={u.fullName} className="border-t hover:bg-muted/50">
//                           <td className="sticky left-0 bg-background py-2 px-3">
//                             {i === 0 ? "1st" : i === 1 ? "2nd" : i === 2 ? "3rd" : `${i + 1}th`}
//                           </td>
//                           <td className="py-2 px-3 font-medium truncate max-w-[100px] sm:max-w-none">
//                             {u.fullName}
//                           </td>
//                           <td className="text-center font-bold">{u.scans}</td>
//                           <td className="text-center text-red-600 font-medium">{u.hot}</td>
//                           <td className="text-center text-green-600 font-medium">{u.meetings}</td>
//                           <td className="text-center text-blue-600 font-medium">{u.deals}</td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             )}
//           </CardContent>
//         </Card>

//         {/* CARD SCANS OVER TIME */}
//         <Card className="md:col-span-2">
//           <CardHeader>
//             <CardTitle className="text-sm sm:text-base">Scans Trend (Last 7 Days)</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <Suspense fallback={<div className="h-56 w-full animate-pulse bg-muted/30" />}>
//               <ResponsiveContainer width="100%" height={window.innerWidth < 640 ? 220 : 300}>
//                 <LazyLineChart data={timeSeriesChart}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="date" tick={{ fontSize: 11 }} />
//                   <YAxis />
//                   <Tooltip />
//                   <Legend />
//                   <Line
//                     type="monotone"
//                     dataKey="scans"
//                     stroke="hsl(var(--chart-2))"
//                     strokeWidth={3}
//                     dot={{ fill: "hsl(var(--chart-2))", r: 5 }}
//                     activeDot={{ r: 7 }}
//                   />
//                 </LazyLineChart>
//               </ResponsiveContainer>
//             </Suspense>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }


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
// import React, { lazy, Suspense, useEffect, useMemo } from "react"

// // Lazy-load charts
// const LazyPieChart = lazy(() => import("recharts").then(m => ({ default: m.PieChart })))
// const LazyBarChart = lazy(() => import("recharts").then(m => ({ default: m.BarChart })))
// const LazyLineChart = lazy(() => import("recharts").then(m => ({ default: m.LineChart })))

// interface DashboardOverviewProps {
//   forms: FormData[]
// }

// export function DashboardOverview({ forms }: DashboardOverviewProps) {
//   const {
//     totalCards,
//     totalUsers,
//     meetingsScheduled,
//     extractionSuccessRate,
//     leadStatusChart,
//     dealStatusChart,
//     userChartData,
//     timeSeriesChart,
//   } = useMemo(() => {
//     const totalCards = forms.length
//     const totalUsers = new Set(forms.map(f => f.userId)).size

//     const normalize = (s: string | undefined) => (s || "Unspecified").trim()

//     const leadStatusData = forms.reduce((acc: Record<string, number>, f) => {
//       const s = normalize(f.leadStatus)
//       acc[s] = (acc[s] || 0) + 1
//       return acc
//     }, {})

//     const dealStatusData = forms.reduce((acc: Record<string, number>, f) => {
//       const s = normalize(f.dealStatus)
//       acc[s] = (acc[s] || 0) + 1
//       return acc
//     }, {})

//     const meetingsScheduled = forms.filter(f => f.meetingAfterExhibition).length
//     const extractionSuccessRate = forms.filter(f => f.extractionStatus === "completed").length

//     const leadStatusChart = Object.entries(leadStatusData).map(([name, value]) => ({
//       name,
//       value,
//     }))

//     const dealStatusChart = Object.entries(dealStatusData).map(([name, value]) => ({
//       name,
//       value,
//     }))

//     // USER PERFORMANCE – FIXED: Case-insensitive "hot" & "closed"
//     const userPerf = forms.reduce((acc: Record<string, any>, f) => {
//       const uid = f.userId || "unknown"
//       const email = f.user?.email || "Unknown User"

//       if (!acc[uid]) {
//         acc[uid] = {
//           userId: uid,
//           email,
//           totalScans: 0,
//           hotLeads: 0,
//           meetings: 0,
//           dealsClosed: 0,
//           lastActive: null as Date | null,
//         }
//       }

//       acc[uid].totalScans += 1

//       // FIXED: Case-insensitive match
//       if ((f.leadStatus || "").toLowerCase().trim() === "hot") {
//         acc[uid].hotLeads += 1
//       }
//       if (f.meetingAfterExhibition) acc[uid].meetings += 1
//       if ((f.dealStatus || "").toLowerCase().trim() === "closed") {
//         acc[uid].dealsClosed += 1
//       }

//       const created = f.createdAt ? new Date(f.createdAt) : null
//       if (created && (!acc[uid].lastActive || created > acc[uid].lastActive)) {
//         acc[uid].lastActive = created
//       }
//       return acc

//     }, {} as Record<string, any>)

//     const userChartData = Object.values(userPerf)
//       .map((u: any) => ({
//         name: u.email.split("@")[0].substring(0, 10),
//         fullName: u.email,
//         scans: u.totalScans,
//         hot: u.hotLeads,
//         meetings: u.meetings,
//         deals: u.dealsClosed,
//       }))
//       .sort((a: any, b: any) => b.scans - a.scans)
//       .slice(0, 10)

//     // TIME SERIES
//     const dateMap = forms.reduce((acc: Record<string, number>, f) => {
//       if (f.date) {
//         const d = new Date(f.date).toLocaleDateString("en-US", {
//           month: "short",
//           day: "numeric"
//         })
//         acc[d] = (acc[d] || 0) + 1
//       }
//       return acc
//     }, {})

//     const timeSeriesChart = Object.entries(dateMap)
//       .map(([date, count]) => ({ date, scans: count }))
//       .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
//       .slice(-7)

//     return {
//       totalCards,
//       totalUsers,
//       meetingsScheduled,
//       extractionSuccessRate,
//       leadStatusChart,
//       dealStatusChart,
//       userChartData,
//       timeSeriesChart,
//     }
//   }, [forms])

//   const COLORS = [
//     "hsl(var(--chart-1))",
//     "hsl(var(--chart-2))",
//     "hsl(var(--chart-3))",
//     "hsl(var(--chart-4))",
//     "hsl(var(--chart-5))",
//   ]

//   useEffect(() => {
//     if (typeof window !== "undefined" && window.innerWidth < 640 && "requestIdleCallback" in window) {
//       requestIdleCallback(() => import("recharts"))
//     }
//   }, [])

//   return (
//     <div className="space-y-4 sm:space-y-6">
//       {/* ==================== KEY METRICS ==================== */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
//         <Card className="border-l-4 border-l-blue-500">
//           <CardHeader className="flex flex-row items-center justify-between pb-1.5">
//             <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
//               Total Card Scans
//             </CardTitle>
//             <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
//           </CardHeader>
//           <CardContent className="pt-1">
//             <div className="text-2xl sm:text-3xl font-bold">{totalCards}</div>
//             <p className="text-xs text-muted-foreground">scanned</p>
//           </CardContent>
//         </Card>

//         <Card className="border-l-4 border-l-purple-500">
//           <CardHeader className="flex flex-row items-center justify-between pb-1.5">
//             <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
//               Active Users
//             </CardTitle>
//             <Users className="h-3 w-3 sm:h-4 sm:w-4 text-purple-500" />
//           </CardHeader>
//           <CardContent className="pt-1">
//             <div className="text-2xl sm:text-3xl font-bold">{totalUsers}</div>
//             <p className="text-xs text-muted-foreground">team members</p>
//           </CardContent>
//         </Card>

//         <Card className="border-l-4 border-l-green-500">
//           <CardHeader className="flex flex-row items-center justify-between pb-1.5">
//             <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
//               Meetings Scheduled
//             </CardTitle>
//             <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
//           </CardHeader>
//           <CardContent className="pt-1">
//             <div className="text-2xl sm:text-3xl font-bold">{meetingsScheduled}</div>
//             <p className="text-xs text-muted-foreground">
//               {totalCards > 0 ? ((meetingsScheduled / totalCards) * 100).toFixed(1) : 0}% conv.
//             </p>
//           </CardContent>
//         </Card>

//         <Card className="border-l-4 border-l-orange-500">
//           <CardHeader className="flex flex-row items-center justify-between pb-1.5">
//             <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
//               Extraction Success
//             </CardTitle>
//             <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-orange-500" />
//           </CardHeader>
//           <CardContent className="pt-1">
//             <div className="text-2xl sm:text-3xl font-bold">{extractionSuccessRate}</div>
//             <p className="text-xs text-muted-foreground">
//               {totalCards > 0 ? ((extractionSuccessRate / totalCards) * 100).toFixed(1) : 0}% rate
//             </p>
//           </CardContent>
//         </Card>
//       </div>

//       {/* ==================== CHARTS ==================== */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         {/* Lead Status Pie */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="text-sm sm:text-base">Lead Status</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <Suspense fallback={<div className="h-56 w-full animate-pulse bg-muted/30" />}>
//               <ResponsiveContainer width="100%" height={window.innerWidth < 640 ? 220 : 300}>
//                 <LazyPieChart>
//                   <Pie
//                     data={leadStatusChart}
//                     cx="50%"
//                     cy="50%"
//                     labelLine={false}
//                     label={({ name, value }) => `${name}: ${value}`}
//                     outerRadius={window.innerWidth < 640 ? 70 : 100}
//                     fill="#8884d8"
//                     dataKey="value"
//                   >
//                     {leadStatusChart.map((_, i) => (
//                       <Cell key={i} fill={COLORS[i % COLORS.length]} />
//                     ))}
//                   </Pie>
//                   <Tooltip />
//                 </LazyPieChart>
//               </ResponsiveContainer>
//             </Suspense>
//           </CardContent>
//         </Card>

//         {/* USER PERFORMANCE – EXCEL TABLE FORMAT */}
//         <Card className="md:col-span-2">
//           <CardHeader>
//             <CardTitle className="text-sm sm:text-base flex flex-col sm:flex-row sm:items-center gap-1">
//               User Performance
//               <span className="text-xs font-normal text-muted-foreground">
//                 Real users who scanned cards
//               </span>
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             {/* Bar Chart */}
//             <Suspense fallback={<div className="h-64 w-full animate-pulse bg-muted/30" />}>
//               <ResponsiveContainer width="100%" height={window.innerWidth < 640 ? 240 : 320}>
//                 <LazyBarChart
//                   data={userChartData}
//                   margin={{ top: 20, right: 10, left: 10, bottom: window.innerWidth < 640 ? 60 : 80 }}
//                 >
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis
//                     dataKey="name"
//                     angle={window.innerWidth < 640 ? -30 : -45}
//                     textAnchor="end"
//                     height={window.innerWidth < 640 ? 70 : 90}
//                     interval={window.innerWidth < 640 ? "preserveStartEnd" : 0}
//                     tick={{ fontSize: window.innerWidth < 640 ? 10 : 11 }}
//                   />
//                   <YAxis />
//                   <Tooltip
//                     content={({ active, payload }) => {
//                       if (active && payload?.length) {
//                         const d = payload[0].payload
//                         return (
//                           <div className="bg-background border rounded-lg shadow-lg p-3 text-xs">
//                             <p className="font-semibold">{d.fullName}</p>
//                             <div className="mt-1 space-y-0.5">
//                               <p>Scans: <strong>{d.scans}</strong></p>
//                               <p>Hot: <strong className="text-red-600">{d.hot}</strong></p>
//                               <p>Meetings: <strong className="text-green-600">{d.meetings}</strong></p>
//                               <p>Deals: <strong className="text-blue-600">{d.deals}</strong></p>
//                             </div>
//                           </div>
//                         )
//                       }
//                       return null
//                     }}
//                   />
//                   <Legend />
//                   <Bar dataKey="scans" fill="hsl(var(--chart-1))" radius={[6, 6, 0, 0]} name="Scans" />
//                   <Bar dataKey="hot" fill="hsl(var(--chart-2))" radius={[6, 6, 0, 0]} name="Hot Leads" />
//                   <Bar dataKey="meetings" fill="hsl(var(--chart-3))" radius={[6, 6, 0, 0]} name="Meetings" />
//                 </LazyBarChart>
//               </ResponsiveContainer>
//             </Suspense>

//             {/* EXCEL-STYLE TABLE – Horizontal Scroll on Mobile */}
//             {userChartData.length > 0 && (
//               <div className="mt-6 -mx-4 overflow-x-auto">
//                 <div className="inline-block min-w-full align-middle">
//                   <table className="w-full text-xs border border-gray-300">
//                     <thead className="bg-gray-100 border-b border-gray-300">
//                       <tr>
//                         <th className="sticky left-0 bg-gray-100 px-4 py-2 text-left font-semibold text-gray-700 border-r border-gray-300">
//                           Rank
//                         </th>
//                         <th className="px-4 py-2 text-left font-semibold text-gray-700 border-r border-gray-300">
//                           User
//                         </th>
//                         <th className="px-4 py-2 text-center font-semibold text-gray-700 border-r border-gray-300">
//                           Scans
//                         </th>
//                         <th className="px-4 py-2 text-center font-semibold text-red-600 border-r border-gray-300">
//                           Hot
//                         </th>
//                         <th className="px-4 py-2 text-center font-semibold text-green-600 border-r border-gray-300">
//                           Meetings
//                         </th>
//                         <th className="px-4 py-2 text-center font-semibold text-blue-600">
//                           Deals
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody className="divide-y divide-gray-200">
//                       {userChartData.map((u: any, i: number) => (
//                         <tr key={u.fullName} className="hover:bg-gray-50 transition-colors">
//                           <td className="sticky left-0 bg-white px-4 py-2 font-medium border-r border-gray-300">
//                             {i === 0 ? "1st" : i === 1 ? "2nd" : i === 2 ? "3rd" : `${i + 1}th`}
//                           </td>
//                           <td className="px-4 py-2 truncate max-w-[150px] sm:max-w-none border-r border-gray-300">
//                             {u.fullName}
//                           </td>
//                           <td className="px-4 py-2 text-center font-bold border-r border-gray-300">
//                             {u.scans}
//                           </td>
//                           <td className="px-4 py-2 text-center font-medium text-red-600 border-r border-gray-300">
//                             {u.hot}
//                           </td>
//                           <td className="px-4 py-2 text-center font-medium text-green-600 border-r border-gray-300">
//                             {u.meetings}
//                           </td>
//                           <td className="px-4 py-2 text-center font-medium text-blue-600">
//                             {u.deals}
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             )}
//           </CardContent>
//         </Card>

//         {/* CARD SCANS OVER TIME */}
//         <Card className="md:col-span-2">
//           <CardHeader>
//             <CardTitle className="text-sm sm:text-base">Scans Trend (Last 7 Days)</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <Suspense fallback={<div className="h-56 w-full animate-pulse bg-muted/30" />}>
//               <ResponsiveContainer width="100%" height={window.innerWidth < 640 ? 220 : 300}>
//                 <LazyLineChart data={timeSeriesChart}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="date" tick={{ fontSize: 11 }} />
//                   <YAxis />
//                   <Tooltip />
//                   <Legend />
//                   <Line
//                     type="monotone"
//                     dataKey="scans"
//                     stroke="hsl(var(--chart-2))"
//                     strokeWidth={3}
//                     dot={{ fill: "hsl(var(--chart-2))", r: 5 }}
//                     activeDot={{ r: 7 }}
//                   />
//                 </LazyLineChart>
//               </ResponsiveContainer>
//             </Suspense>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }

// export default DashboardOverview

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
import { TrendingUp, Users, FileText, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react"
import type { FormData } from "@/types/form"
import React, { lazy, Suspense, useEffect, useMemo, useRef } from "react"
import useEmblaCarousel from "embla-carousel-react"

// Lazy-load charts
const LazyPieChart = lazy(() => import("recharts").then(m => ({ default: m.PieChart })))
const LazyBarChart = lazy(() => import("recharts").then(m => ({ default: m.BarChart })))
const LazyLineChart = lazy(() => import("recharts").then(m => ({ default: m.LineChart })))

interface DashboardOverviewProps {
  forms: FormData[]
}

export function DashboardOverview({ forms }: DashboardOverviewProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: "start" })
  const scrollPrev = () => emblaApi?.scrollPrev()
  const scrollNext = () => emblaApi?.scrollNext()

  const {
    totalCards,
    totalUsers,
    meetingsScheduled,
    extractionSuccessRate,
    leadStatusChart,
    dealStatusChart,
    userChartData,
    timeSeriesChart,
  } = useMemo(() => {
    const totalCards = forms.length
    const totalUsers = new Set(forms.map(f => f.userId)).size

    const normalize = (s: string | undefined) => (s || "Unspecified").trim()

    const leadStatusData = forms.reduce((acc: Record<string, number>, f) => {
      const s = normalize(f.leadStatus)
      acc[s] = (acc[s] || 0) + 1
      return acc
    }, {})

    const dealStatusData = forms.reduce((acc: Record<string, number>, f) => {
      const s = normalize(f.dealStatus)
      acc[s] = (acc[s] || 0) + 1
      return acc
    }, {})

    const meetingsScheduled = forms.filter(f => f.meetingAfterExhibition).length
    const extractionSuccessRate = forms.filter(f => f.extractionStatus === "completed").length

    const leadStatusChart = Object.entries(leadStatusData).map(([name, value]) => ({
      name,
      value,
    }))

    const dealStatusChart = Object.entries(dealStatusData).map(([name, value]) => ({
      name,
      value,
    }))

    // USER PERFORMANCE – Case-insensitive "hot" & "closed"
    const userPerf = forms.reduce((acc: Record<string, any>, f) => {
      const uid = f.userId || "unknown"
      const email = f.user?.email || "Unknown User"

      if (!acc[uid]) {
        acc[uid] = {
          userId: uid,
          email,
          totalScans: 0,
          hotLeads: 0,
          meetings: 0,
          dealsClosed: 0,
          lastActive: null as Date | null,
        }
      }

      acc[uid].totalScans += 1
      if ((f.leadStatus || "").toLowerCase().trim() === "hot") acc[uid].hotLeads += 1
      if (f.meetingAfterExhibition) acc[uid].meetings += 1
      if ((f.dealStatus || "").toLowerCase().trim() === "closed") acc[uid].dealsClosed += 1

      const created = f.createdAt ? new Date(f.createdAt) : null
      if (created && (!acc[uid].lastActive || created > acc[uid].lastActive)) {
        acc[uid].lastActive = created
      }
      return acc
    }, {} as Record<string, any>)

    const userChartData = Object.values(userPerf)
      .map((u: any) => ({
        name: u.email.split("@")[0].substring(0, 10),
        fullName: u.email,
        scans: u.totalScans,
        hot: u.hotLeads,
        meetings: u.meetings,
        deals: u.dealsClosed,
      }))
      .sort((a: any, b: any) => b.scans - a.scans)
      .slice(0, 10)

    const dateMap = forms.reduce((acc: Record<string, number>, f) => {
      if (f.date) {
        const d = new Date(f.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric"
        })
        acc[d] = (acc[d] || 0) + 1
      }
      return acc
    }, {})

    const timeSeriesChart = Object.entries(dateMap)
      .map(([date, count]) => ({ date, scans: count }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-7)

    return {
      totalCards,
      totalUsers,
      meetingsScheduled,
      extractionSuccessRate,
      leadStatusChart,
      dealStatusChart,
      userChartData,
      timeSeriesChart,
    }
  }, [forms])

  const COLORS = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
  ]

  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 640 && "requestIdleCallback" in window) {
      requestIdleCallback(() => import("recharts"))
    }
  }, [])

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* ==================== KEY METRICS – MOBILE: SWIPE CARDS ==================== */}
      <div className="block sm:hidden">
        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-3 px-4">
              {/* Total Card Scans */}
              <div className="flex-none w-[70vw] max-w-xs">
                <Card className="h-full border-l-4 border-l-blue-500">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xs font-medium text-muted-foreground">
                        Total Scans
                      </CardTitle>
                      <FileText className="h-4 w-4 text-blue-500" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{totalCards}</div>
                    <p className="text-xs text-muted-foreground">cards scanned</p>
                  </CardContent>
                </Card>
              </div>

              {/* Active Users */}
              <div className="flex-none w-[70vw] max-w-xs">
                <Card className="h-full border-l-4 border-l-purple-500">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xs font-medium text-muted-foreground">
                        Active Users
                      </CardTitle>
                      <Users className="h-4 w-4 text-purple-500" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{totalUsers}</div>
                    <p className="text-xs text-muted-foreground">team members</p>
                  </CardContent>
                </Card>
              </div>

              {/* Meetings */}
              <div className="flex-none w-[70vw] max-w-xs">
                <Card className="h-full border-l-4 border-l-green-500">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xs font-medium text-muted-foreground">
                        Meetings
                      </CardTitle>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{meetingsScheduled}</div>
                    <p className="text-xs text-muted-foreground">
                      {totalCards > 0 ? ((meetingsScheduled / totalCards) * 100).toFixed(0) : 0}% conv.
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Extraction */}
              <div className="flex-none w-[70vw] max-w-xs">
                <Card className="h-full border-l-4 border-l-orange-500">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xs font-medium text-muted-foreground">
                        Extraction
                      </CardTitle>
                      <TrendingUp className="h-4 w-4 text-orange-500" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{extractionSuccessRate}</div>
                    <p className="text-xs text-muted-foreground">
                      {totalCards > 0 ? ((extractionSuccessRate / totalCards) * 100).toFixed(0) : 0}% rate
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={scrollPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 shadow-md"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 shadow-md"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* ==================== DESKTOP: 4-COLUMN GRID ==================== */}
      <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between pb-1.5">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
              Total Card Scans
            </CardTitle>
            <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
          </CardHeader>
          <CardContent className="pt-1">
            <div className="text-2xl sm:text-3xl font-bold">{totalCards}</div>
            <p className="text-xs text-muted-foreground">scanned</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between pb-1.5">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
              Active Users
            </CardTitle>
            <Users className="h-3 w-3 sm:h-4 sm:w-4 text-purple-500" />
          </CardHeader>
          <CardContent className="pt-1">
            <div className="text-2xl sm:text-3xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">team members</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between pb-1.5">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
              Meetings Scheduled
            </CardTitle>
            <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
          </CardHeader>
          <CardContent className="pt-1">
            <div className="text-2xl sm:text-3xl font-bold">{meetingsScheduled}</div>
            <p className="text-xs text-muted-foreground">
              {totalCards > 0 ? ((meetingsScheduled / totalCards) * 100).toFixed(1) : 0}% conv.
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between pb-1.5">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
              Extraction Success
            </CardTitle>
            <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-orange-500" />
          </CardHeader>
          <CardContent className="pt-1">
            <div className="text-2xl sm:text-3xl font-bold">{extractionSuccessRate}</div>
            <p className="text-xs text-muted-foreground">
              {totalCards > 0 ? ((extractionSuccessRate / totalCards) * 100).toFixed(1) : 0}% rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ==================== CHARTS ==================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Lead Status Pie */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm sm:text-base">Lead Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div className="h-56 w-full animate-pulse bg-muted/30" />}>
              <ResponsiveContainer width="100%" height={window.innerWidth < 640 ? 220 : 300}>
                <LazyPieChart>
                  <Pie
                    data={leadStatusChart}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={window.innerWidth < 640 ? 70 : 100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {leadStatusChart.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </LazyPieChart>
              </ResponsiveContainer>
            </Suspense>
          </CardContent>
        </Card>

        {/* USER PERFORMANCE – EXCEL TABLE */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm sm:text-base flex flex-col sm:flex-row sm:items-center gap-1">
              User Performance
              <span className="text-xs font-normal text-muted-foreground">
                Real users who scanned cards
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div className="h-64 w-full animate-pulse bg-muted/30" />}>
              <ResponsiveContainer width="100%" height={window.innerWidth < 640 ? 240 : 320}>
                <LazyBarChart
                  data={userChartData}
                  margin={{ top: 20, right: 10, left: 10, bottom: window.innerWidth < 640 ? 60 : 80 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    angle={window.innerWidth < 640 ? -30 : -45}
                    textAnchor="end"
                    height={window.innerWidth < 640 ? 70 : 90}
                    interval={window.innerWidth < 640 ? "preserveStartEnd" : 0}
                    tick={{ fontSize: window.innerWidth < 640 ? 10 : 11 }}
                  />
                  <YAxis />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload?.length) {
                        const d = payload[0].payload
                        return (
                          <div className="bg-background border rounded-lg shadow-lg p-3 text-xs">
                            <p className="font-semibold">{d.fullName}</p>
                            <div className="mt-1 space-y-0.5">
                              <p>Scans: <strong>{d.scans}</strong></p>
                              <p>Hot: <strong className="text-red-600">{d.hot}</strong></p>
                              <p>Meetings: <strong className="text-green-600">{d.meetings}</strong></p>
                              <p>Deals: <strong className="text-blue-600">{d.deals}</strong></p>
                            </div>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Legend />
                  <Bar dataKey="scans" fill="hsl(var(--chart-1))" radius={[6, 6, 0, 0]} name="Scans" />
                  <Bar dataKey="hot" fill="hsl(var(--chart-2))" radius={[6, 6, 0, 0]} name="Hot Leads" />
                  <Bar dataKey="meetings" fill="hsl(var(--chart-3))" radius={[6, 6, 0, 0]} name="Meetings" />
                </LazyBarChart>
              </ResponsiveContainer>
            </Suspense>

            {/* EXCEL TABLE */}
            {userChartData.length > 0 && (
              <div className="-mx-4 overflow-x-auto">
                <div className="inline-block min-w-full align-middle">
                  <table className="w-full text-xs border border-gray-300">
                    <thead className="bg-gray-100 border-b border-gray-300">
                      <tr>
                        <th className="sticky left-0 bg-gray-100 px-4 py-2 text-left font-semibold text-gray-700 border-r border-gray-300">
                          Rank
                        </th>
                        <th className="px-4 py-2 text-left font-semibold text-gray-700 border-r border-gray-300">
                          User
                        </th>
                        <th className="px-4 py-2 text-center font-semibold text-gray-700 border-r border-gray-300">
                          Scans
                        </th>
                        <th className="px-4 py-2 text-center font-semibold text-red-600 border-r border-gray-300">
                          Hot
                        </th>
                        <th className="px-4 py-2 text-center font-semibold text-green-600 border-r border-gray-300">
                          Meetings
                        </th>
                        <th className="px-4 py-2 text-center font-semibold text-blue-600">
                          Deals
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {userChartData.map((u: any, i: number) => (
                        <tr key={u.fullName} className="hover:bg-gray-50 transition-colors">
                          <td className="sticky left-0 bg-white px-4 py-2 font-medium border-r border-gray-300">
                            {i === 0 ? "1st" : i === 1 ? "2nd" : i === 2 ? "3rd" : `${i + 1}th`}
                          </td>
                          <td className="px-4 py-2 truncate max-w-[150px] sm:max-w-none border-r border-gray-300">
                            {u.fullName}
                          </td>
                          <td className="px-4 py-2 text-center font-bold border-r border-gray-300">
                            {u.scans}
                          </td>
                          <td className="px-4 py-2 text-center font-medium text-red-600 border-r border-gray-300">
                            {u.hot}
                          </td>
                          <td className="px-4 py-2 text-center font-medium text-green-600 border-r border-gray-300">
                            {u.meetings}
                          </td>
                          <td className="px-4 py-2 text-center font-medium text-blue-600">
                            {u.deals}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* CARD SCANS OVER TIME */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm sm:text-base">Scans Trend (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div className="h-56 w-full animate-pulse bg-muted/30" />}>
              <ResponsiveContainer width="100%" height={window.innerWidth < 640 ? 220 : 300}>
                <LazyLineChart data={timeSeriesChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="scans"
                    stroke="hsl(var(--chart-2))"
                    strokeWidth={3}
                    dot={{ fill: "hsl(var(--chart-2))", r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </LazyLineChart>
              </ResponsiveContainer>
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default DashboardOverview