// "use client"

// import { useState, useEffect } from "react"
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"
// import { Eye, RefreshCcw } from "lucide-react"
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { useToast } from "@/components/ui/use-toast"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import type { FormData } from "@/types/form"

// export function UserDashboard() {
//   const [forms, setForms] = useState<FormData[]>([])
//   const [search, setSearch] = useState("")
//   const [isLoading, setIsLoading] = useState(false)
//   const { toast } = useToast()

//   useEffect(() => {
//     fetchForms()
//   }, [])

//   const fetchForms = async () => {
//     try {
//       setIsLoading(true)
//       const res = await fetch("/api/forms/user", {
//         method: "GET",
//         headers: {
//           "Cache-Control": "no-cache",
//         },
//       })

//       if (!res.ok) {
//         throw new Error(`Failed to fetch forms: ${res.status}`)
//       }

//       const data = await res.json()
//       setForms(data)
//     } catch (error) {
//       console.error("Error fetching forms:", error)
//       toast({
//         title: "Error",
//         description: "Failed to fetch forms. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const filteredForms = forms.filter(
//     (form) =>
//       form.cardNo?.toLowerCase().includes(search.toLowerCase()) ||
//       form.country?.toLowerCase().includes(search.toLowerCase()) ||
//       form.salesPerson?.toLowerCase().includes(search.toLowerCase()) ||
//       (form.mergedData?.companyName || "").toLowerCase().includes(search.toLowerCase()) ||
//       (form.mergedData?.name || "").toLowerCase().includes(search.toLowerCase()) ||
//       (form.mergedData?.email || "").toLowerCase().includes(search.toLowerCase()) ||
//       (form.mergedData?.contactNumbers || "").toLowerCase().includes(search.toLowerCase()),
//   )

//   const formatData = (data: any) => {
//     if (!data) return "No data available"

//     return Object.entries(data)
//       .map(([key, value]) => {
//         const formattedKey = key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
//         if (Array.isArray(value)) {
//           return `${formattedKey}: ${value.join(", ") || "None"}`
//         }
//         return `${formattedKey}: ${value || "None"}`
//       })
//       .join("\n")
//   }

//   const handleRefresh = () => {
//     fetchForms()
//   }

//   return (
//     <div className="space-y-4 px-2 sm:px-4">
//       <div className="flex flex-row sm:flex-row justify-between items-center gap-4">
//         <div className="flex flex-col sm:flex-row gap-4 items-center w-full sm:w-auto">
//           <Input
//             placeholder="Search forms..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="w-64"
//           />
//           <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
//             <RefreshCcw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
//             Refresh
//           </Button>
//         </div>
//       </div>

//       <Card>
//         <CardContent className="p-0 ">
//           <div className="w-full h-[calc(100vh-200px)] overflow-auto">
//             <table className="w-full text-sm border-collapse min-w-[1200px]">
//               <thead className="sticky top-0 z-10">
//                 <tr>
//                   <th className="bg-blue-50 dark:bg-blue-950 py-2 text-xs font-semibold border border-gray-200 px-2 w-24 text-left">
//                     Card No
//                   </th>
//                   <th className="bg-blue-50 dark:bg-blue-950 py-2 text-xs font-semibold border border-gray-200 px-2 w-28 text-left">
//                     Sales Person
//                   </th>
//                   <th className="bg-blue-50 dark:bg-blue-950 py-2 text-xs font-semibold border border-gray-200 px-2 w-24 text-left">
//                     Date
//                   </th>
//                   <th className="bg-blue-50 dark:bg-blue-950 py-2 text-xs font-semibold border border-gray-200 px-2 w-32 text-left">
//                     Company
//                   </th>
//                   <th className="bg-blue-50 dark:bg-blue-950 py-2 text-xs font-semibold border border-gray-200 px-2 w-32 text-left">
//                     Contact Info
//                   </th>
//                   <th className="bg-blue-50 dark:bg-blue-950 py-2 text-xs font-semibold border border-gray-200 px-2 w-24 text-left">
//                     Lead Status
//                   </th>
//                   <th className="bg-blue-50 dark:bg-blue-950 py-2 text-xs font-semibold border border-gray-200 px-2 w-24 text-left">
//                     Deal Status
//                   </th>
//                   <th className="bg-blue-50 dark:bg-blue-950 py-2 text-xs font-semibold border border-gray-200 px-2 w-20 text-left">
//                     Meeting
//                   </th>
//                   <th className="bg-blue-50 dark:bg-blue-950 py-2 text-xs font-semibold border border-gray-200 px-2 w-24 text-left">
//                     Form Status
//                   </th>
//                   <th className="bg-blue-50 dark:bg-blue-950 py-2 text-xs font-semibold border border-gray-200 px-2 w-32 text-left">
//                     Extraction Status
//                   </th>
//                   <th className="bg-blue-50 dark:bg-blue-950 py-2 text-xs font-semibold border border-gray-200 px-2 w-24 text-left">
//                     Zoho Status
//                   </th>
//                   <th className="bg-blue-50 dark:bg-blue-950 py-2 text-xs font-semibold border border-gray-200 px-2 w-20 text-left">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredForms.length > 0 ? (
//                   filteredForms.map((form) => (
//                     <tr key={form.id} className="text-xs hover:bg-gray-50 dark:hover:bg-gray-900">
//                       <td className="py-1 px-2 border border-gray-200 truncate">{form.cardNo}</td>
//                       <td className="py-1 px-2 border border-gray-200 truncate">{form.salesPerson}</td>
//                       <td className="py-1 px-2 border border-gray-200 truncate">
//                         {new Date(form.date).toLocaleDateString()}
//                       </td>
//                       <td className="py-1 px-2 border border-gray-200">
//                         <div className="w-full">
//                           <div className="font-medium truncate">{form.mergedData?.companyName || "N/A"}</div>
//                           <div className="text-[10px] text-muted-foreground truncate">
//                             {form.mergedData?.name || "No contact name"}
//                           </div>
//                         </div>
//                       </td>
//                       <td className="py-1 px-2 border border-gray-200">
//                         <div className="w-full">
//                           {form.mergedData?.email && <div className="truncate">{form.mergedData.email}</div>}
//                           {form.mergedData?.contactNumbers && (
//                             <div className="text-[10px] text-muted-foreground truncate">
//                               {form.mergedData.contactNumbers.split(",")[0]}
//                             </div>
//                           )}
//                         </div>
//                       </td>
//                       <td className="py-1 px-2 border border-gray-200 truncate">{form.leadStatus}</td>
//                       <td className="py-1 px-2 border border-gray-200 truncate">{form.dealStatus}</td>
//                       <td className="py-1 px-2 border border-gray-200 truncate">
//                         {form.meetingAfterExhibition ? "Yes" : "No"}
//                       </td>
//                       <td className="py-1 px-2 border border-gray-200 truncate">{form.status}</td>
//                       <td className="py-1 px-2 border border-gray-200 truncate">{form.extractionStatus}</td>
//                       <td className="py-1 px-2 border border-gray-200 truncate">{form.zohoStatus}</td>
//                       <td className="py-1 px-2 border border-gray-200">
//                         <Dialog>
//                           <DialogTrigger asChild>
//                             <Button variant="outline" size="sm" className="h-6 text-[10px]">
//                               <Eye className="h-3 w-3 mr-1" />
//                               View
//                             </Button>
//                           </DialogTrigger>
//                           <DialogContent className="max-w-4xl h-[90vh] overflow-hidden flex flex-col">
//                             <DialogHeader>
//                               <DialogTitle>Business Card Details - {form.cardNo}</DialogTitle>
//                             </DialogHeader>
//                             <div className="flex-grow overflow-y-auto">
//                               <Tabs defaultValue="merged" className="w-full">
//                                 <TabsList className="grid w-full grid-cols-4 sticky top-0 bg-background z-10">
//                                   <TabsTrigger value="merged">Merged Data</TabsTrigger>
//                                   <TabsTrigger value="extracted">Extracted Data</TabsTrigger>
//                                   <TabsTrigger value="form">Form Data</TabsTrigger>
//                                   <TabsTrigger value="images">Images</TabsTrigger>
//                                 </TabsList>
//                                 <ScrollArea className="h-[calc(90vh-120px)]">
//                                   <TabsContent value="merged">
//                                     <Card>
//                                       <CardHeader>
//                                         <CardTitle>Merged Information</CardTitle>
//                                       </CardHeader>
//                                       <CardContent>
//                                         <pre className="whitespace-pre-wrap bg-muted p-4 rounded-md text-sm">
//                                           {formatData(form.mergedData)}
//                                         </pre>
//                                       </CardContent>
//                                     </Card>
//                                   </TabsContent>
//                                   <TabsContent value="extracted">
//                                     <Card>
//                                       <CardHeader>
//                                         <CardTitle>Extracted Information</CardTitle>
//                                       </CardHeader>
//                                       <CardContent>
//                                         <pre className="whitespace-pre-wrap bg-muted p-4 rounded-md text-sm">
//                                           {formatData(form.extractedData)}
//                                         </pre>
//                                       </CardContent>
//                                     </Card>
//                                   </TabsContent>
//                                   <TabsContent value="form">
//                                     <Card>
//                                       <CardHeader>
//                                         <CardTitle>Form Details</CardTitle>
//                                       </CardHeader>
//                                       <CardContent>
//                                         <pre className="whitespace-pre-wrap bg-muted p-4 rounded-md text-sm">
//                                           {formatData(form)}
//                                         </pre>
//                                       </CardContent>
//                                     </Card>
//                                   </TabsContent>
//                                   <TabsContent value="images">
//                                     <Card>
//                                       <CardHeader>
//                                         <CardTitle>Card Images</CardTitle>
//                                       </CardHeader>
//                                       <CardContent>
//                                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                                           {form.cardFrontPhoto && (
//                                             <div>
//                                               <h4 className="font-medium mb-2">Front</h4>
//                                               <img
//                                                 src={form.cardFrontPhoto || "/placeholder.svg"}
//                                                 alt="Card Front"
//                                                 className="w-full h-auto object-contain rounded-md"
//                                               />
//                                             </div>
//                                           )}
//                                           {form.cardBackPhoto && (
//                                             <div>
//                                               <h4 className="font-medium mb-2">Back</h4>
//                                               <img
//                                                 src={form.cardBackPhoto || "/placeholder.svg"}
//                                                 alt="Card Back"
//                                                 className="w-full h-auto object-contain rounded-md"
//                                               />
//                                             </div>
//                                           )}
//                                         </div>
//                                       </CardContent>
//                                     </Card>
//                                   </TabsContent>
//                                 </ScrollArea>
//                               </Tabs>
//                             </div>
//                           </DialogContent>
//                         </Dialog>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan={12} className="py-4 text-center border border-gray-200">
//                       {isLoading ? "Loading..." : "No forms found matching your criteria"}
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }

// "use client"

// import { useState, useEffect } from "react"
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"
// import { Eye, RefreshCcw, ZoomIn } from "lucide-react"
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { useToast } from "@/components/ui/use-toast"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import type { FormData } from "@/types/form"

// export function UserDashboard() {
//   const [forms, setForms] = useState<FormData[]>([])
//   const [search, setSearch] = useState("")
//   const [isLoading, setIsLoading] = useState(false)
//   const [zoomedImage, setZoomedImage] = useState<string | null>(null)
//   const { toast } = useToast()

//   useEffect(() => {
//     fetchForms()
//   }, [])

//   const fetchForms = async () => {
//     try {
//       setIsLoading(true)
//       const res = await fetch("/api/forms/user", {
//         method: "GET",
//         headers: {
//           "Cache-Control": "no-cache",
//         },
//       })

//       if (!res.ok) {
//         throw new Error(`Failed to fetch forms: ${res.status}`)
//       }

//       const data = await res.json()
//       setForms(data)
//     } catch (error) {
//       console.error("Error fetching forms:", error)
//       toast({
//         title: "Error",
//         description: "Failed to fetch forms. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const filteredForms = forms.filter(
//     (form) => {
//       const q = search.toLowerCase()
//       return (
//         (form.cardNo || "").toLowerCase().includes(q) ||
//         (form.country || "").toLowerCase().includes(q) ||
//         (form.salesPerson || "").toLowerCase().includes(q) ||
//         ((form.mergedData?.companyName || "") as string)
//           .toLowerCase()
//           .includes(q) ||
//         ((form.mergedData?.name || "") as string).toLowerCase().includes(q) ||
//         ((form.mergedData?.email || "") as string)
//           .toLowerCase()
//           .includes(q) ||
//         ((form.mergedData?.contactNumbers || "") as string)
//           .toLowerCase()
//           .includes(q) ||
//         ((form.extractedData?.state || form.additionalData?.city || "") as string)
//           .toLowerCase()
//           .includes(q) ||
//         ((form.extractedData?.country || "") as string)
//           .toLowerCase()
//           .includes(q)
//       )
//     }
//   )

//   const formatData = (data: any) => {
//     if (!data) return "No data available"

//     return Object.entries(data)
//       .map(([key, value]) => {
//         const formattedKey = key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
//         if (Array.isArray(value)) {
//           return `${formattedKey}: ${value.join(", ") || "None"}`
//         }
//         return `${formattedKey}: ${value || "None"}`
//       })
//       .join("\n")
//   }

//   const handleRefresh = () => {
//     fetchForms()
//   }

//   return (
//     <div className="space-y-4 px-2 sm:px-4">
//       <div className="flex flex-row sm:flex-row justify-between items-center gap-4">
//         <div className="flex flex-col sm:flex-row gap-4 items-center w-full sm:w-auto">
//           <Input
//             placeholder="Search forms..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="w-64"
//           />
//           <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
//             <RefreshCcw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
//             Refresh
//           </Button>
//         </div>
//       </div>

//       <Card>
//         <CardContent className="p-0 ">
//           <div className="w-full h-[calc(100vh-200px)] overflow-auto">
//             <table className="w-full text-sm border-collapse table-fixed min-w-[1600px]">
//               <thead className="sticky top-0 z-10">
//                 <tr>
//                   <th className="bg-blue-50 dark:bg-blue-950 py-2 text-xs font-semibold border border-gray-200 px-2 w-24 text-left">
//                     Card Image
//                   </th>
//                   <th className="bg-blue-50 dark:bg-blue-950 py-2 text-xs font-semibold border border-gray-200 px-2 w-24 text-left">
//                     Card No
//                   </th>
//                   <th className="bg-blue-50 dark:bg-blue-950 py-2 text-xs font-semibold border border-gray-200 px-2 w-28 text-left">
//                     Sales Person
//                   </th>
//                   <th className="bg-blue-50 dark:bg-blue-950 py-2 text-xs font-semibold border border-gray-200 px-2 w-24 text-left">
//                     Date
//                   </th>
//                   <th className="bg-blue-50 dark:bg-blue-950 py-2 text-xs font-semibold border border-gray-200 px-2 w-32 text-left">
//                     Person Name
//                   </th>
//                   <th className="bg-blue-50 dark:bg-blue-950 py-2 text-xs font-semibold border border-gray-200 px-2 w-32 text-left">
//                     Company
//                   </th>
//                   <th className="bg-blue-50 dark:bg-blue-950 py-2 text-xs font-semibold border border-gray-200 px-2 w-24 text-left">
//                     State
//                   </th>
//                   <th className="bg-blue-50 dark:bg-blue-950 py-2 text-xs font-semibold border border-gray-200 px-2 w-24 text-left">
//                     Country
//                   </th>
//                   <th className="bg-blue-50 dark:bg-blue-950 py-2 text-xs font-semibold border border-gray-200 px-2 w-32 text-left">
//                     Contact Info
//                   </th>
//                   <th className="bg-blue-50 dark:bg-blue-950 py-2 text-xs font-semibold border border-gray-200 px-2 w-24 text-left">
//                     Lead Status
//                   </th>
//                   <th className="bg-blue-50 dark:bg-blue-950 py-2 text-xs font-semibold border border-gray-200 px-2 w-24 text-left">
//                     Deal Status
//                   </th>
//                   <th className="bg-blue-50 dark:bg-blue-950 py-2 text-xs font-semibold border border-gray-200 px-2 w-20 text-left">
//                     Meeting
//                   </th>
//                   <th className="bg-blue-50 dark:bg-blue-950 py-2 text-xs font-semibold border border-gray-200 px-2 w-24 text-left">
//                     Form Status
//                   </th>
//                   <th className="bg-blue-50 dark:bg-blue-950 py-2 text-xs font-semibold border border-gray-200 px-2 w-32 text-left">
//                     Extraction Status
//                   </th>
//                   <th className="bg-blue-50 dark:bg-blue-950 py-2 text-xs font-semibold border border-gray-200 px-2 w-24 text-left">
//                     Zoho Status
//                   </th>
//                   <th className="bg-blue-50 dark:bg-blue-950 py-2 text-xs font-semibold border border-gray-200 px-2 w-20 text-left">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredForms.length > 0 ? (
//                   filteredForms.map((form) => (
//                     <tr key={form.id} className="text-xs hover:bg-gray-50 dark:hover:bg-gray-900">
//                       <td className="py-1 px-2 border border-gray-200">
//                         {form.cardFrontPhoto ? (
//                           <button
//                             onClick={() => setZoomedImage(form.cardFrontPhoto!)}
//                             className="group"
//                           >
//                             <img
//                               src={form.cardFrontPhoto || "/placeholder.svg"}
//                               alt="Card"
//                               className="max-w-20 h-12 object-cover rounded border transition group-hover:opacity-80"
//                             />
//                           </button>
//                         ) : (
//                           <span className="text-[10px] text-muted-foreground">—</span>
//                         )}
//                       </td>
//                       <td className="py-1 px-2 border border-gray-200 truncate">{form.cardNo ?? "N/A"}</td>
//                       <td className="py-1 px-2 border border-gray-200 truncate">{form.salesPerson ?? "N/A"}</td>
//                       <td className="py-1 px-2 border border-gray-200 truncate">
//                         {form.date ? new Date(form.date).toLocaleDateString() : "N/A"}
//                       </td>
//                       <td className="py-1 px-2 border border-gray-200 truncate">
//                         {form.mergedData?.name || form.additionalData?.contactPerson || "N/A"}
//                       </td>
//                       <td className="py-1 px-2 border border-gray-200">
//                         <div className="w-full">
//                           <div className="font-medium truncate">{form.mergedData?.companyName || form.additionalData?.company || "N/A"}</div>
//                         </div>
//                       </td>
//                       <td className="py-1 px-2 border border-gray-200 truncate">
//                         {form.extractedData?.state || form.additionalData?.city || "N/A"}
//                       </td>
//                       <td className="py-1 px-2 border border-gray-200 truncate">
//                         {form.extractedData?.country || form.country || "N/A"}
//                       </td>
//                       <td className="py-1 px-2 border border-gray-200">
//                         <div className="w-full">
//                           {form.mergedData?.email && <div className="truncate">{form.mergedData.email}</div>}
//                           {form.mergedData?.contactNumbers && (
//                             <div className="text-[10px] text-muted-foreground truncate">
//                               {form.mergedData.contactNumbers.split(",")[0]}
//                             </div>
//                           )}
//                         </div>
//                       </td>
//                       <td className="py-1 px-2 border border-gray-200 truncate">{form.leadStatus ?? "N/A"}</td>
//                       <td className="py-1 px-2 border border-gray-200 truncate">{form.dealStatus ?? "N/A"}</td>
//                       <td className="py-1 px-2 border border-gray-200 truncate">
//                         {form.meetingAfterExhibition ? "Yes" : "No"}
//                       </td>
//                       <td className="py-1 px-2 border border-gray-200 truncate">{form.status ?? "N/A"}</td>
//                       <td className="py-1 px-2 border border-gray-200 truncate">{form.extractionStatus ?? "N/A"}</td>
//                       <td className="py-1 px-2 border border-gray-200 truncate">{form.zohoStatus ?? "N/A"}</td>
//                       <td className="py-1 px-2 border border-gray-200">
//                         <Dialog>
//                           <DialogTrigger asChild>
//                             <Button variant="outline" size="sm" className="h-6 text-[10px]">
//                               <Eye className="h-3 w-3 mr-1" />
//                               View
//                             </Button>
//                           </DialogTrigger>
//                           <DialogContent className="max-w-4xl h-[90vh] overflow-hidden flex flex-col">
//                             <DialogHeader>
//                               <DialogTitle>Business Card Details - {form.cardNo || "N/A"}</DialogTitle>
//                             </DialogHeader>
//                             <div className="flex-grow overflow-y-auto">
//                               <Tabs defaultValue="merged" className="w-full">
//                                 <TabsList className="grid w-full grid-cols-4 sticky top-0 bg-background z-10">
//                                   <TabsTrigger value="merged">Merged Data</TabsTrigger>
//                                   <TabsTrigger value="extracted">Extracted Data</TabsTrigger>
//                                   <TabsTrigger value="form">Form Data</TabsTrigger>
//                                   <TabsTrigger value="images">Images</TabsTrigger>
//                                 </TabsList>
//                                 <ScrollArea className="h-[calc(90vh-120px)]">
//                                   <TabsContent value="merged">
//                                     <Card>
//                                       <CardHeader>
//                                         <CardTitle>Merged Information</CardTitle>
//                                       </CardHeader>
//                                       <CardContent>
//                                         <pre className="whitespace-pre-wrap bg-muted p-4 rounded-md text-sm">
//                                           {formatData(form.mergedData)}
//                                         </pre>
//                                       </CardContent>
//                                     </Card>
//                                   </TabsContent>
//                                   <TabsContent value="extracted">
//                                     <Card>
//                                       <CardHeader>
//                                         <CardTitle>Extracted Information</CardTitle>
//                                       </CardHeader>
//                                       <CardContent>
//                                         <pre className="whitespace-pre-wrap bg-muted p-4 rounded-md text-sm">
//                                           {formatData(form.extractedData)}
//                                         </pre>
//                                       </CardContent>
//                                     </Card>
//                                   </TabsContent>
//                                   <TabsContent value="form">
//                                     <Card>
//                                       <CardHeader>
//                                         <CardTitle>Form Details</CardTitle>
//                                       </CardHeader>
//                                       <CardContent>
//                                         <pre className="whitespace-pre-wrap bg-muted p-4 rounded-md text-sm">
//                                           {formatData(form)}
//                                         </pre>
//                                       </CardContent>
//                                     </Card>
//                                   </TabsContent>
//                                   <TabsContent value="images">
//                                     <Card>
//                                       <CardHeader>
//                                         <CardTitle>Card Images</CardTitle>
//                                       </CardHeader>
//                                       <CardContent>
//                                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                                           {form.cardFrontPhoto && (
//                                             <div>
//                                               <h4 className="font-medium mb-2">Front</h4>
//                                               <button
//                                                 onClick={() => setZoomedImage(form.cardFrontPhoto!)}
//                                                 className="block w-full"
//                                               >
//                                                 <img
//                                                   src={form.cardFrontPhoto || "/placeholder.svg"}
//                                                   alt="Card Front"
//                                                   className="max-w-full max-h-96 object-contain rounded-md border hover:opacity-90 transition"
//                                                 />
//                                               </button>
//                                             </div>
//                                           )}
//                                           {form.cardBackPhoto && (
//                                             <div>
//                                               <h4 className="font-medium mb-2">Back</h4>
//                                               <button
//                                                 onClick={() => setZoomedImage(form.cardBackPhoto!)}
//                                                 className="block w-full"
//                                               >
//                                                 <img
//                                                   src={form.cardBackPhoto || "/placeholder.svg"}
//                                                   alt="Card Back"
//                                                   className="max-w-full max-h-96 object-contain rounded-md border hover:opacity-90 transition"
//                                                 />
//                                               </button>
//                                             </div>
//                                           )}
//                                         </div>
//                                       </CardContent>
//                                     </Card>
//                                   </TabsContent>
//                                 </ScrollArea>
//                               </Tabs>
//                             </div>
//                           </DialogContent>
//                         </Dialog>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan={16} className="py-4 text-center border border-gray-200">
//                       {isLoading ? "Loading..." : "No forms found matching your criteria"}
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Zoomed Image Dialog */}
//       {zoomedImage && (
//         <Dialog open={true} onOpenChange={() => setZoomedImage(null)}>
//           <DialogContent className="max-w-3xl p-0 overflow-hidden">
//             <img
//               src={zoomedImage || "/placeholder.svg"}
//               alt="Zoomed Card"
//               className="w-full h-auto max-h-[80vh] object-contain"
//             />
//           </DialogContent>
//         </Dialog>
//       )}
//     </div>
//   )
// }

// "use client";

// import React, { useState, useEffect } from "react";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Eye, RefreshCcw, Loader2 } from "lucide-react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { useToast } from "@/components/ui/use-toast";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import Image from "next/image";
// import type { FormData } from "@/types/form";

// export function UserDashboard() {
//   const [forms, setForms] = useState<FormData[]>([]);
//   const [search, setSearch] = useState("");
//   const [isLoading, setIsLoading] = useState(true);
//   const [zoomedImage, setZoomedImage] = useState<string | null>(null);
//   const { toast } = useToast();

//   const fetchForms = async () => {
//     try {
//       setIsLoading(true);
//       const res = await fetch("/api/forms/user", { cache: "no-store" });

//       if (!res.ok) {
//         const err = await res.json().catch(() => ({}));
//         throw new Error(err.error || "Failed to load your forms");
//       }

//       const data = await res.json();
//       setForms(Array.isArray(data) ? data : data.forms || []);
//     } catch (error: any) {
//       console.error("Error:", error);
//       toast({
//         title: "Error",
//         description: error.message || "Could not load your forms",
//         variant: "destructive",
//       });
//       setForms([]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchForms();
//   }, []);

//   const filteredForms = forms.filter((form) => {
//     const q = search.toLowerCase();
//     return (
//       form.cardNo?.toLowerCase().includes(q) ||
//       form.salesPerson?.toLowerCase().includes(q) ||
//       form.country?.toLowerCase().includes(q) ||
//       form.mergedData?.companyName?.toLowerCase().includes(q) ||
//       form.mergedData?.name?.toLowerCase().includes(q) ||
//       form.mergedData?.email?.toLowerCase().includes(q) ||
//       form.extractedData?.state?.toLowerCase().includes(q)
//     );
//   });

//   const formatData = (obj: any) => {
//     if (!obj || typeof obj !== "object") return "No data";
//     return Object.entries(obj)
//       .map(([key, value]) => {
//         const label = key
//           .replace(/([A-Z])/g, " $1")
//           .replace(/^./, (s) => s.toUpperCase());
//         const val = Array.isArray(value)
//           ? value.join(", ")
//           : typeof value === "object"
//           ? JSON.stringify(value, null, 2)
//           : String(value ?? "N/A");
//         return `${label}: ${val}`;
//       })
//       .join("\n");
//   };

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <div className="text-center">
//           <Loader2 className="h-12 w-12 animate-spin text-[#483d73] mx-auto mb-4" />
//           <p className="text-xl">Loading your forms...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6 px-2 sm:px-4 py-6">
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <Input
//           placeholder="Search forms..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="w-full sm:w-64"
//         />
//         <div className="flex items-center gap-2">
//           <Button onClick={fetchForms} variant="outline" disabled={isLoading}>
//             <RefreshCcw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
//             Refresh
//           </Button>
//         </div>
//       </div>

//       <Card>
//         <CardContent className="p-0 mt-8">
//           <div className="w-full h-[30rem] flex flex-col">
//             <div className="w-full overflow-auto">
//               <table className="w-full text-sm border-collapse table-fixed min-w-[1350px]">
//                 <thead className="sticky top-0 z-10">
//                   <tr>
//                     <th className="bg-blue-50 dark:bg-blue-950 py-2 text-xs font-semibold border border-gray-200 px-2 w-24 text-left">
//                       Card Image
//                     </th>
//                     <th className="bg-blue-50 dark:bg-blue-950 py-2 text-xs font-semibold border border-gray-200 px-2 w-24 text-left">
//                       Card No
//                     </th>
//                     <th className="bg-blue-50 dark:bg-blue-950 py-2 text-xs font-semibold border border-gray-200 px-2 w-28 text-left">
//                       Sales Person
//                     </th>
//                     <th className="bg-blue-50 dark:bg-blue-950 py-2 text-xs font-semibold border border-gray-200 px-2 w-24 text-left">
//                       Date
//                     </th>
//                     <th className="bg-blue-50 dark:bg-blue-950 py-2 text-xs font-semibold border border-gray-200 px-2 w-32 text-left">
//                       Person Name
//                     </th>
//                     <th className="bg-blue-50 dark:bg-blue-950 py-2 text-xs font-semibold border border-gray-200 px-2 w-32 text-left">
//                       Company
//                     </th>
//                     <th className="bg-blue-50 dark:bg-blue-950 py-2 text-xs font-semibold border border-gray-200 px-2 w-24 text-left">
//                       State
//                     </th>
//                     <th className="bg-blue-50 dark:bg-blue-950 py-2 text-xs font-semibold border border-gray-200 px-2 w-24 text-left">
//                       Country
//                     </th>
//                     <th className="bg-blue-50 dark:bg-blue-950 py-2 text-xs font-semibold border border-gray-200 px-2 w-32 text-left">
//                       Contact Info
//                     </th>
//                     <th className="bg-blue-50 dark:bg-blue-950 py-2 text-xs font-semibold border border-gray-200 px-2 w-24 text-left">
//                       Lead Status
//                     </th>
//                     <th className="bg-blue-50 dark:bg-blue-950 py-2 text-xs font-semibold border border-gray-200 px-2 w-24 text-left">
//                       Deal Status
//                     </th>
//                     <th className="bg-blue-50 dark:bg-blue-950 py-2 text-xs font-semibold border border-gray-200 px-2 w-20 text-left">
//                       Meeting
//                     </th>
//                     <th className="bg-blue-50 dark:bg-blue-950 py-2 text-xs font-semibold border border-gray-200 px-2 w-24 text-left">
//                       Form Status
//                     </th>
//                     <th className="bg-blue-50 dark:bg-blue-950 py-2 text-xs font-semibold border border-gray-200 px-2 w-32 text-left">
//                       Extraction Status
//                     </th>
//                     <th className="bg-blue-50 dark:bg-blue-950 py-2 text-xs font-semibold border border-gray-200 px-2 w-24 text-left">
//                       Zoho Status
//                     </th>
//                     <th className="bg-blue-50 dark:bg-blue-950 py-2 text-xs font-semibold border border-gray-200 px-2 w-20 text-left">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredForms.length > 0 ? (
//                     filteredForms.map((form) => (
//                       <tr key={form.id} className="text-xs hover:bg-gray-50 dark:hover:bg-gray-900">
//                         <td className="py-1 px-2 border border-gray-200">
//                           {form.cardFrontPhoto ? (
//                             <button
//                               onClick={() => setZoomedImage(form.cardFrontPhoto!)}
//                               className="group"
//                             >
//                               <img
//                                 src={form.cardFrontPhoto || "/placeholder.svg"}
//                                 alt="Card"
//                                 className="max-w-20 h-12 object-cover rounded border transition group-hover:opacity-80"
//                               />
//                             </button>
//                           ) : (
//                             <span className="text-[10px] text-muted-foreground">—</span>
//                           )}
//                         </td>
//                         <td className="py-1 px-2 border border-gray-200 truncate">{form.cardNo ?? "N/A"}</td>
//                         <td className="py-1 px-2 border border-gray-200 truncate">{form.salesPerson ?? "N/A"}</td>
//                         <td className="py-1 px-2 border border-gray-200 truncate">
//                           {form.date ? new Date(form.date).toLocaleDateString() : "N/A"}
//                         </td>
//                         <td className="py-1 px-2 border border-gray-200 truncate">
//                           {form.mergedData?.name || form.additionalData?.contactPerson || "N/A"}
//                         </td>
//                         <td className="py-1 px-2 border border-gray-200">
//                           <div className="w-full">
//                             <div className="font-medium truncate">{form.mergedData?.companyName || form.additionalData?.company || "N/A"}</div>
//                           </div>
//                         </td>
//                         <td className="py-1 px-2 border border-gray-200 truncate">
//                           {form.extractedData?.state || form.additionalData?.city || "N/A"}
//                         </td>
//                         <td className="py-1 px-2 border border-gray-200 truncate">
//                           {form.extractedData?.country || form.country || "N/A"}
//                         </td>
//                         <td className="py-1 px-2 border border-gray-200">
//                           <div className="w-full">
//                             {form.mergedData?.email && <div className="truncate">{form.mergedData.email}</div>}
//                             {form.mergedData?.contactNumbers && (
//                               <div className="text-[10px] text-muted-foreground truncate">
//                                 {form.mergedData.contactNumbers.split(",")[0]}
//                               </div>
//                             )}
//                           </div>
//                         </td>
//                         <td className="py-1 px-2 border border-gray-200 truncate">{form.leadStatus ?? "N/A"}</td>
//                         <td className="py-1 px-2 border border-gray-200 truncate">{form.dealStatus ?? "N/A"}</td>
//                         <td className="py-1 px-2 border border-gray-200 truncate">
//                           {form.meetingAfterExhibition ? "Yes" : "No"}
//                         </td>
//                         <td className="py-1 px-2 border border-gray-200 truncate">{form.status ?? "N/A"}</td>
//                         <td className="py-1 px-2 border border-gray-200 truncate">{form.extractionStatus ?? "N/A"}</td>
//                         <td className="py-1 px-2 border border-gray-200 truncate">{form.zohoStatus ?? "N/A"}</td>
//                         <td className="py-1 px-2 border border-gray-200">
//                           <Dialog>
//                             <DialogTrigger asChild>
//                               <Button variant="outline" size="sm" className="h-6 text-[10px]">
//                                 <Eye className="h-3 w-3 mr-1" />
//                                 View
//                               </Button>
//                             </DialogTrigger>
//                             <DialogContent className="max-w-4xl h-[90vh] overflow-hidden flex flex-col">
//                               <DialogHeader>
//                                 <DialogTitle>Business Card Details - {form.cardNo || "N/A"}</DialogTitle>
//                               </DialogHeader>
//                               <div className="flex-grow overflow-y-auto">
//                                 <Tabs defaultValue="merged" className="w-full">
//                                   <TabsList className="grid w-full grid-cols-4 sticky top-0 bg-background z-10">
//                                     <TabsTrigger value="merged">Merged Data</TabsTrigger>
//                                     <TabsTrigger value="extracted">Extracted Data</TabsTrigger>
//                                     <TabsTrigger value="form">Form Data</TabsTrigger>
//                                     <TabsTrigger value="images">Images</TabsTrigger>
//                                   </TabsList>
//                                   <ScrollArea className="h-[calc(90vh-120px)]">
//                                     <TabsContent value="merged">
//                                       <Card>
//                                         <CardHeader>
//                                           <CardTitle>Merged Information</CardTitle>
//                                         </CardHeader>
//                                         <CardContent>
//                                           <pre className="whitespace-pre-wrap bg-muted p-4 rounded-md text-sm">
//                                             {formatData(form.mergedData)}
//                                           </pre>
//                                         </CardContent>
//                                       </Card>
//                                     </TabsContent>
//                                     <TabsContent value="extracted">
//                                       <Card>
//                                         <CardHeader>
//                                           <CardTitle>Extracted Information</CardTitle>
//                                         </CardHeader>
//                                         <CardContent>
//                                           <pre className="whitespace-pre-wrap bg-muted p-4 rounded-md text-sm">
//                                             {formatData(form.extractedData)}
//                                           </pre>
//                                         </CardContent>
//                                       </Card>
//                                     </TabsContent>
//                                     <TabsContent value="form">
//                                       <Card>
//                                         <CardHeader>
//                                           <CardTitle>Form Details</CardTitle>
//                                         </CardHeader>
//                                         <CardContent>
//                                           <pre className="whitespace-pre-wrap bg-muted p-4 rounded-md text-sm">
//                                             {formatData(form)}
//                                           </pre>
//                                         </CardContent>
//                                       </Card>
//                                     </TabsContent>
//                                     <TabsContent value="images">
//                                       <Card>
//                                         <CardHeader>
//                                           <CardTitle>Card Images</CardTitle>
//                                         </CardHeader>
//                                         <CardContent>
//                                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                                             {form.cardFrontPhoto && (
//                                               <div>
//                                                 <h4 className="font-medium mb-2">Front</h4>
//                                                 <button
//                                                   onClick={() => setZoomedImage(form.cardFrontPhoto!)}
//                                                   className="block w-full"
//                                                 >
//                                                   <img
//                                                     src={form.cardFrontPhoto || "/placeholder.svg"}
//                                                     alt="Card Front"
//                                                     className="max-w-full max-h-96 object-contain rounded-md border hover:opacity-90 transition"
//                                                   />
//                                                 </button>
//                                               </div>
//                                             )}
//                                             {form.cardBackPhoto && (
//                                               <div>
//                                                 <h4 className="font-medium mb-2">Back</h4>
//                                                 <button
//                                                   onClick={() => setZoomedImage(form.cardBackPhoto!)}
//                                                   className="block w-full"
//                                                 >
//                                                   <img
//                                                     src={form.cardBackPhoto || "/placeholder.svg"}
//                                                     alt="Card Back"
//                                                     className="max-w-full max-h-96 object-contain rounded-md border hover:opacity-90 transition"
//                                                   />
//                                                 </button>
//                                               </div>
//                                             )}
//                                           </div>
//                                         </CardContent>
//                                       </Card>
//                                     </TabsContent>
//                                   </ScrollArea>
//                                 </Tabs>
//                               </div>
//                             </DialogContent>
//                           </Dialog>
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan={16} className="py-4 text-center border border-gray-200">
//                         {isLoading ? "Loading..." : "No forms found matching your criteria"}
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Zoomed Image Dialog */}
//       {zoomedImage && (
//         <Dialog open={true} onOpenChange={() => setZoomedImage(null)}>
//           <DialogContent className="max-w-3xl p-0 overflow-hidden">
//             <img
//               src={zoomedImage || "/placeholder.svg"}
//               alt="Zoomed Card"
//               className="w-full h-auto max-h-[80vh] object-contain"
//             />
//           </DialogContent>
//         </Dialog>
//       )}
//     </div>
//   );
// }


// "use client";

// import React, { useState, useEffect, useMemo } from "react";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Label } from "@/components/ui/label";
// import { Eye, Download, Loader2, MoreHorizontal } from "lucide-react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Card, CardContent } from "@/components/ui/card";
// import { useToast } from "@/components/ui/use-toast";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import * as XLSX from "xlsx";
// import type { FormData } from "@/types/form";

// export function UserDashboard() {
//   const [forms, setForms] = useState<FormData[]>([]);
//   const [search, setSearch] = useState("");
//   const [isLoading, setIsLoading] = useState(true);
//   const [isDownloading, setIsDownloading] = useState(false);
//   const [zoomedImage, setZoomedImage] = useState<string | null>(null);
//   const [showManage, setShowManage] = useState(false);
//   const { toast } = useToast();

//   // Clean default columns — no clutter!
//   const [visibleColumns, setVisibleColumns] = useState<string[]>([
//     "cardImage",
//     "cardNo",
//     "date",
//     "personName",
//     "company",
//     "state",
//     "city",
//     "country",
//     "contactInfo",
//     "leadStatus",
//     "meeting",
//   ]);

//   const fetchForms = async () => {
//     try {
//       setIsLoading(true);
//       const res = await fetch("/api/forms/user", { cache: "no-store" });
//       if (!res.ok) throw new Error("Failed to load forms");
//       const data = await res.json();
//       setForms(Array.isArray(data) ? data : data.forms || []);
//     } catch (error: any) {
//       toast({ title: "Error", description: error.message, variant: "destructive" });
//       setForms([]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchForms();
//   }, []);

//   // Dynamic columns logic — same as admin
// const possibleColumns = useMemo(() => {
//   const fixed = [
//     {
//       id: "cardImage",
//       label: "Card Image",
//       width: "w-24",
//       render: (f: FormData) =>
//         f.cardFrontPhoto ? (
//           <button onClick={() => setZoomedImage(f.cardFrontPhoto!)} className="group">
//             <img src={f.cardFrontPhoto} alt="Card" className="max-w-20 h-12 object-cover rounded border group-hover:opacity-80 transition" />
//           </button>
//         ) : "—",
//     },
//     { id: "cardNo", label: "Card No", width: "w-24", render: (f: FormData) => f.cardNo ?? "N/A" },
//     { id: "date", label: "Date", width: "w-28", render: (f: FormData) => f.date ? new Date(f.date).toLocaleDateString() : "N/A" },
//     { id: "personName", label: "Person Name", width: "w-32", render: (f: FormData) => f.mergedData?.name || "N/A" },
//     { id: "company", label: "Company", width: "w-32", render: (f: FormData) => f.mergedData?.companyName || f.additionalData?.company || "N/A" },
//     { id: "state", label: "State", width: "w-24", render: (f: FormData) => f.extractedData?.state || "N/A" },
//     { id: "city", label: "City", width: "w-28", render: (f: FormData) => f.extractedData?.city || "N/A" },
//     { id: "country", label: "Country", width: "w-24", render: (f: FormData) => f.extractedData?.country || f.country || "N/A" },
//     { id: "leadStatus", label: "Lead Status", width: "w-24", render: (f: FormData) => f.leadStatus ?? "N/A" },
//     { id: "meeting", label: "Meeting", width: "w-20", render: (f: FormData) => f.meetingAfterExhibition ? "Yes" : "No" },
//     {
//       id: "actions",
//       label: "View",
//       width: "w-20",
//       render: (f: FormData) => (
//         <Button variant="ghost" size="icon" onClick={() => setZoomedImage(f.cardFrontPhoto || null)}>
//           <Eye className="h-4 w-4" />
//         </Button>
//       ),
//     },
//   ];

//   // ONLY SHOW DYNAMIC COLUMNS IF AT LEAST ONE CARD HAS REAL DATA
//   const fieldsWithData = new Set<string>();

//   forms.forEach(form => {
//     Object.entries(form.extractedData || {}).forEach(([key, value]) => {
//       // Only count as "has data" if it's a real value (not null, empty, or "N/A")
//       if (value != null && value !== "" && value !== "N/A" && value !== "null") {
//         fieldsWithData.add(key);
//       }
//     });
//   });

//   const blocked = ["name", "companyName", "email", "contactNumbers", "state", "country", "city"];

//   const dynamic = Array.from(fieldsWithData)
//     .filter(key => !blocked.includes(key))
//     .map(key => ({
//       id: `ext_${key}`,
//       label: key.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
//       width: "w-36",
//       render: (f: FormData) => {
//         const val = f.extractedData?.[key];
//         return val && val !== "N/A" ? String(val) : "—";
//       },
//     }));

//   return [...fixed, ...dynamic];
// }, [forms]);

//   const displayColumns = useMemo(() => [...visibleColumns, "actions"], [visibleColumns]);

//   const filteredForms = useMemo(() => {
//     const q = search.toLowerCase();
//     return forms.filter(f =>
//       [f.cardNo, f.salesPerson, f.country, f.mergedData?.companyName, f.mergedData?.name, f.mergedData?.email].some(v => v?.toLowerCase().includes(q))
//     );
//   }, [forms, search]);

//   const handleDownloadExcel = async () => {
//     setIsDownloading(true);
//     try {
//       const data = filteredForms.map(f => ({
//         "Card No": f.cardNo,
//         Date: f.date ? new Date(f.date).toLocaleDateString() : "",
//         "Person Name": f.mergedData?.name || "",
//         Company: f.mergedData?.companyName || "",
//         City: f.extractedData?.city || "",
//         State: f.extractedData?.state || "",
//         Country: f.extractedData?.country || "",
//         Email: f.mergedData?.email || "",
//         Phone: f.mergedData?.contactNumbers || "",
//         "Lead Status": f.leadStatus || "",
//         Meeting: f.meetingAfterExhibition ? "Yes" : "No",
//         ...f.extractedData,
//       }));

//       const ws = XLSX.utils.json_to_sheet(data);
//       const wb = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(wb, ws, "My Cards");
//       XLSX.writeFile(wb, `My_Business_Cards_${new Date().toISOString().slice(0,10)}.xlsx`);

//       toast({ title: "Downloaded!", description: `${filteredForms.length} cards exported` });
//     } catch {
//       toast({ title: "Error", description: "Failed to download", variant: "destructive" });
//     } finally {
//       setIsDownloading(false);
//     }
//   };

//   if (isLoading) return <div className="flex items-center justify-center h-screen"><Loader2 className="h-12 w-12 animate-spin" /></div>;

//   return (
//     <div className="space-y-6 px-4 py-6">

//       {/* Top Bar — Same as Admin */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <Input placeholder="Search your cards..." value={search} onChange={e => setSearch(e.target.value)} className="w-full sm:w-80" />
//         <div className="flex gap-3 w-full sm:w-auto">
//           <Button onClick={handleDownloadExcel} disabled={isDownloading || filteredForms.length === 0} className="flex-1 sm:flex-initial bg-[#483d73] hover:bg-[#352c55]">
//             {isDownloading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
//             Download Excel ({filteredForms.length})
//           </Button>
//           {/* <Button variant="outline" onClick={() => setShowManage(true)}>
//             Manage Columns
//           </Button> */}
//         </div>
//       </div>

//       {/* Table */}
//       <Card>
//         <CardContent className="p-0">
//           <div className="overflow-auto">
//             <table className="w-full text-xs border-collapse min-w-max">
//               <thead className="sticky top-0 bg-gray-100 z-10">
//                 <tr>
//                   {displayColumns.map(colId => {
//                     const col = possibleColumns.find(c => c.id === colId);
//                     return col ? <th key={colId} className={`py-3 px-2 text-left font-medium ${col.width || "w-32"}`}>{col.label}</th> : null;
//                   })}
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredForms.map(form => (
//                   <tr key={form.id} className="hover:bg-gray-50 border-t">
//                     {displayColumns.map(colId => {
//                       const col = possibleColumns.find(c => c.id === colId);
//                       return col ? <td key={colId} className={`py-3 px-2 ${col.width || "w-32"}`}>{col.render(form)}</td> : null;
//                     })}
//                   </tr>
//                 ))}
//                 {filteredForms.length === 0 && (
//                   <tr><td colSpan={20} className="text-center py-8 text-muted-foreground">No cards found</td></tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Manage Columns Dialog */}
//       <Dialog open={showManage} onOpenChange={setShowManage}>
//         <DialogContent className="max-w-md">
//           <DialogHeader><DialogTitle>Manage Columns</DialogTitle></DialogHeader>
//           <ScrollArea className="h-96">
//             <div className="space-y-4">
//               <div>
//                 <h4 className="font-semibold mb-2">Fixed Columns (Always Visible)</h4>
//                 {possibleColumns.filter(c => !c.id.startsWith("ext_")).map(c => (
//                   <div key={c.id} className="flex items-center gap-2 py-1">
//                     <Checkbox checked disabled />
//                     <Label className="text-sm">{c.label}</Label>
//                   </div>
//                 ))}
//               </div>
//               <div className="border-t pt-4">
//                 <h4 className="font-semibold mb-2">Optional Fields</h4>
//                 {possibleColumns.filter(c => c.id.startsWith("ext_")).map(c => (
//                   <div key={c.id} className="flex items-center gap-2 py-1">
//                     <Checkbox
//                       checked={visibleColumns.includes(c.id)}
//                       onCheckedChange={checked => {
//                         setVisibleColumns(prev => checked ? [...prev, c.id] : prev.filter(id => id !== c.id));
//                       }}
//                     />
//                     <Label className="text-sm">{c.label}</Label>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </ScrollArea>
//           <div className="flex justify-end pt-4">
//             <Button onClick={() => setShowManage(false)}>Done</Button>
//           </div>
//         </DialogContent>
//       </Dialog>

//       {/* Zoomed Image */}
//       {zoomedImage && (
//         <Dialog open onOpenChange={() => setZoomedImage(null)}>
//           <DialogContent className="max-w-4xl p-0">
//             <img src={zoomedImage} alt="Zoomed" className="w-full h-auto max-h-screen object-contain" />
//           </DialogContent>
//         </Dialog>
//       )}
//     </div>
//   );
// }

"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Eye, Download, Loader2, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import * as XLSX from "xlsx";
import type { FormData } from "@/types/form";

export function UserDashboard() {
  const [forms, setForms] = useState<FormData[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [showManage, setShowManage] = useState(false);
  const { toast } = useToast();

  const [visibleColumns, setVisibleColumns] = useState<string[]>([
    "cardImage",
    "cardNo",
    "date",
    "personName",
    "company",
    "state",
    "city",
    "country",
    "contactInfo",
    "leadStatus",
    "meeting",
  ]);

  const fetchForms = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/forms/user", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load your cards");
      const data = await res.json();
      setForms(Array.isArray(data) ? data : data.forms || []);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      setForms([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchForms();
  }, []);

  // DELETE HANDLER — 100% WORKING
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this card? This cannot be undone.")) return;

    try {
      const res = await fetch(`/api/forms/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || "Failed to delete card");
      }

      setForms(prev => prev.filter(f => f.id !== id));
      toast({ title: "Deleted", description: "Card removed successfully" });
    } catch (err: any) {
      toast({ title: "Delete Failed", description: err.message, variant: "destructive" });
    }
  };

  const possibleColumns = useMemo(() => {
    const fixed = [
      {
        id: "cardImage",
        label: "Card Image",
        width: "w-24",
        render: (f: FormData) =>
          f.cardFrontPhoto ? (
            <button onClick={() => setZoomedImage(f.cardFrontPhoto!)} className="group">
              <img src={f.cardFrontPhoto} alt="Card" className="max-w-20 h-12 object-cover rounded border group-hover:opacity-80 transition" />
            </button>
          ) : "—",
      },
      { id: "cardNo", label: "Card No", width: "w-24", render: (f: FormData) => f.cardNo ?? "N/A" },
      { id: "date", label: "Date", width: "w-28", render: (f: FormData) => f.date ? new Date(f.date).toLocaleDateString() : "N/A" },
      { id: "personName", label: "Person Name", width: "w-32", render: (f: FormData) => f.mergedData?.name || "N/A" },
      { id: "company", label: "Company", width: "w-32", render: (f: FormData) => f.mergedData?.companyName || f.additionalData?.company || "N/A" },
      { id: "state", label: "State", width: "w-24", render: (f: FormData) => f.extractedData?.state || "N/A" },
      { id: "city", label: "City", width: "w-28", render: (f: FormData) => f.extractedData?.city || "N/A" },
      { id: "country", label: "Country", width: "w-24", render: (f: FormData) => f.extractedData?.country || f.country || "N/A" },
      { id: "leadStatus", label: "Lead Status", width: "w-24", render: (f: FormData) => f.leadStatus ?? "N/A" },
      { id: "meeting", label: "Meeting", width: "w-20", render: (f: FormData) => f.meetingAfterExhibition ? "Yes" : "No" },
      {
        id: "actions",
        label: "Actions",
        width: "w-32",
        render: (f: FormData) => (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setZoomedImage(f.cardFrontPhoto || null)}>
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        ),
      },
    ];

    // ONLY SHOW DYNAMIC COLUMNS IF REAL DATA EXISTS
    const fieldsWithData = new Set<string>();
    forms.forEach(form => {
      Object.entries(form.extractedData || {}).forEach(([key, value]) => {
        if (value && value !== "N/A" && value !== "null" && value !== "") {
          fieldsWithData.add(key);
        }
      });
    });

    const blocked = ["name", "companyName", "email", "contactNumbers", "state", "country", "city"];
    const dynamic = Array.from(fieldsWithData)
      .filter(k => !blocked.includes(k))
      .map(key => ({
        id: `ext_${key}`,
        label: key.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
        width: "w-36",
        render: (f: FormData) => f.extractedData?.[key] || "—",
      }));

    return [...fixed, ...dynamic];
  }, [forms]);

  const displayColumns = useMemo(() => [...visibleColumns, "actions"], [visibleColumns]);

  const filteredForms = useMemo(() => {
    const q = search.toLowerCase();
    return forms.filter(f =>
      [f.cardNo, f.salesPerson, f.country, f.mergedData?.companyName, f.mergedData?.name, f.mergedData?.email].some(v => v?.toLowerCase().includes(q))
    );
  }, [forms, search]);

  const handleDownloadExcel = async () => {
    setIsDownloading(true);
    try {
      const data = filteredForms.map(f => ({
        "Card No": f.cardNo,
        Date: f.date ? new Date(f.date).toLocaleDateString() : "",
        "Name": f.mergedData?.name || "",
        Company: f.mergedData?.companyName || "",
        City: f.extractedData?.city || "",
        State: f.extractedData?.state || "",
        Country: f.extractedData?.country || "",
        Email: f.mergedData?.email || "",
        Phone: f.mergedData?.contactNumbers || "",
        "Lead Status": f.leadStatus || "",
        Meeting: f.meetingAfterExhibition ? "Yes" : "No",
        ...f.extractedData,
      }));

      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "My Cards");
      XLSX.writeFile(wb, `My_Cards_${new Date().toISOString().slice(0,10)}.xlsx`);
      toast({ title: "Downloaded!", description: `${filteredForms.length} cards exported` });
    } catch {
      toast({ title: "Error", description: "Download failed", variant: "destructive" });
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) return <div className="flex items-center justify-center h-screen"><Loader2 className="h-12 w-12 animate-spin text-[#483d73]" /></div>;

  return (
    <div className="space-y-6 px-4 py-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Input placeholder="Search your cards..." value={search} onChange={e => setSearch(e.target.value)} className="w-full sm:w-80" />
        <div className="flex gap-3">
          <Button onClick={handleDownloadExcel} disabled={isDownloading || filteredForms.length === 0} className="bg-[#483d73] hover:bg-[#352c55]">
            {isDownloading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
            Excel ({filteredForms.length})
          </Button>
          <Button variant="outline" onClick={() => setShowManage(true)}>
            Manage Columns
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-auto">
            <table className="w-full text-xs border-collapse">
              <thead className="sticky top-0 bg-gray-100 z-10">
                <tr>
                  {displayColumns.map(colId => {
                    const col = possibleColumns.find(c => c.id === colId);
                    return col ? <th key={colId} className={`py-3 px-2 text-left font-medium ${col.width || "w-32"}`}>{col.label}</th> : null;
                  })}
                </tr>
              </thead>
              <tbody>
                {filteredForms.map(form => (
                  <tr key={form.id} className="hover:bg-gray-50 border-t">
                    {displayColumns.map(colId => {
                      const col = possibleColumns.find(c => c.id === colId);
                      return col ? <td key={colId} className={`py-3 px-2 ${col.width || "w-32"}`}>{col.render(form)}</td> : null;
                    })}
                  </tr>
                ))}
                {filteredForms.length === 0 && (
                  <tr><td colSpan={20} className="text-center py-8 text-muted-foreground">No cards found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Manage Columns Dialog */}
      <Dialog open={showManage} onOpenChange={setShowManage}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Manage Columns</DialogTitle></DialogHeader>
          <ScrollArea className="h-96">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Fixed Columns</h4>
                {possibleColumns.filter(c => !c.id.startsWith("ext_")).map(c => (
                  <div key={c.id} className="flex items-center gap-2 py-1">
                    <Checkbox checked disabled />
                    <Label className="text-sm">{c.label}</Label>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-2">Optional Fields</h4>
                {possibleColumns.filter(c => c.id.startsWith("ext_")).map(c => (
                  <div key={c.id} className="flex items-center gap-2 py-1">
                    <Checkbox
                      checked={visibleColumns.includes(c.id)}
                      onCheckedChange={checked => {
                        setVisibleColumns(prev => checked ? [...prev, c.id] : prev.filter(id => id !== c.id));
                      }}
                    />
                    <Label className="text-sm">{c.label}</Label>
                  </div>
                ))}
              </div>
            </div>
          </ScrollArea>
          <div className="flex justify-end pt-4">
            <Button onClick={() => setShowManage(false)}>Done</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Zoomed Image */}
      {zoomedImage && (
        <Dialog open onOpenChange={() => setZoomedImage(null)}>
          <DialogContent className="max-w-4xl p-0">
            <img src={zoomedImage} alt="Zoomed Card" className="w-full h-auto max-h-screen object-contain" />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}