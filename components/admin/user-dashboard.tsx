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

"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Eye, RefreshCcw, ZoomIn } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { FormData } from "@/types/form"

export function UserDashboard() {
  const [forms, setForms] = useState<FormData[]>([])
  const [search, setSearch] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [zoomedImage, setZoomedImage] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchForms()
  }, [])

  const fetchForms = async () => {
    try {
      setIsLoading(true)
      const res = await fetch("/api/forms/user", {
        method: "GET",
        headers: {
          "Cache-Control": "no-cache",
        },
      })

      if (!res.ok) {
        throw new Error(`Failed to fetch forms: ${res.status}`)
      }

      const data = await res.json()
      setForms(data)
    } catch (error) {
      console.error("Error fetching forms:", error)
      toast({
        title: "Error",
        description: "Failed to fetch forms. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filteredForms = forms.filter(
    (form) => {
      const q = search.toLowerCase()
      return (
        (form.cardNo || "").toLowerCase().includes(q) ||
        (form.country || "").toLowerCase().includes(q) ||
        (form.salesPerson || "").toLowerCase().includes(q) ||
        ((form.mergedData?.companyName || "") as string)
          .toLowerCase()
          .includes(q) ||
        ((form.mergedData?.name || "") as string).toLowerCase().includes(q) ||
        ((form.mergedData?.email || "") as string)
          .toLowerCase()
          .includes(q) ||
        ((form.mergedData?.contactNumbers || "") as string)
          .toLowerCase()
          .includes(q) ||
        ((form.extractedData?.state || form.additionalData?.city || "") as string)
          .toLowerCase()
          .includes(q) ||
        ((form.extractedData?.country || "") as string)
          .toLowerCase()
          .includes(q)
      )
    }
  )

  const formatData = (data: any) => {
    if (!data) return "No data available"

    return Object.entries(data)
      .map(([key, value]) => {
        const formattedKey = key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
        if (Array.isArray(value)) {
          return `${formattedKey}: ${value.join(", ") || "None"}`
        }
        return `${formattedKey}: ${value || "None"}`
      })
      .join("\n")
  }

  const handleRefresh = () => {
    fetchForms()
  }

  return (
    <div className="space-y-4 px-2 sm:px-4">
      <div className="flex flex-row sm:flex-row justify-between items-center gap-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center w-full sm:w-auto">
          <Input
            placeholder="Search forms..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64"
          />
          <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCcw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0 ">
          <div className="w-full h-[calc(100vh-200px)] overflow-auto">
            <table className="w-full text-sm border-collapse table-fixed min-w-[1600px]">
              <thead className="sticky top-0 z-10">
                <tr>
                  <th className="bg-blue-50 dark:bg-blue-950 py-2 text-xs font-semibold border border-gray-200 px-2 w-24 text-left">
                    Card Image
                  </th>
                  <th className="bg-blue-50 dark:bg-blue-950 py-2 text-xs font-semibold border border-gray-200 px-2 w-24 text-left">
                    Card No
                  </th>
                  <th className="bg-blue-50 dark:bg-blue-950 py-2 text-xs font-semibold border border-gray-200 px-2 w-28 text-left">
                    Sales Person
                  </th>
                  <th className="bg-blue-50 dark:bg-blue-950 py-2 text-xs font-semibold border border-gray-200 px-2 w-24 text-left">
                    Date
                  </th>
                  <th className="bg-blue-50 dark:bg-blue-950 py-2 text-xs font-semibold border border-gray-200 px-2 w-32 text-left">
                    Person Name
                  </th>
                  <th className="bg-blue-50 dark:bg-blue-950 py-2 text-xs font-semibold border border-gray-200 px-2 w-32 text-left">
                    Company
                  </th>
                  <th className="bg-blue-50 dark:bg-blue-950 py-2 text-xs font-semibold border border-gray-200 px-2 w-24 text-left">
                    State
                  </th>
                  <th className="bg-blue-50 dark:bg-blue-950 py-2 text-xs font-semibold border border-gray-200 px-2 w-24 text-left">
                    Country
                  </th>
                  <th className="bg-blue-50 dark:bg-blue-950 py-2 text-xs font-semibold border border-gray-200 px-2 w-32 text-left">
                    Contact Info
                  </th>
                  <th className="bg-blue-50 dark:bg-blue-950 py-2 text-xs font-semibold border border-gray-200 px-2 w-24 text-left">
                    Lead Status
                  </th>
                  <th className="bg-blue-50 dark:bg-blue-950 py-2 text-xs font-semibold border border-gray-200 px-2 w-24 text-left">
                    Deal Status
                  </th>
                  <th className="bg-blue-50 dark:bg-blue-950 py-2 text-xs font-semibold border border-gray-200 px-2 w-20 text-left">
                    Meeting
                  </th>
                  <th className="bg-blue-50 dark:bg-blue-950 py-2 text-xs font-semibold border border-gray-200 px-2 w-24 text-left">
                    Form Status
                  </th>
                  <th className="bg-blue-50 dark:bg-blue-950 py-2 text-xs font-semibold border border-gray-200 px-2 w-32 text-left">
                    Extraction Status
                  </th>
                  <th className="bg-blue-50 dark:bg-blue-950 py-2 text-xs font-semibold border border-gray-200 px-2 w-24 text-left">
                    Zoho Status
                  </th>
                  <th className="bg-blue-50 dark:bg-blue-950 py-2 text-xs font-semibold border border-gray-200 px-2 w-20 text-left">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredForms.length > 0 ? (
                  filteredForms.map((form) => (
                    <tr key={form.id} className="text-xs hover:bg-gray-50 dark:hover:bg-gray-900">
                      <td className="py-1 px-2 border border-gray-200">
                        {form.cardFrontPhoto ? (
                          <button
                            onClick={() => setZoomedImage(form.cardFrontPhoto!)}
                            className="group"
                          >
                            <img
                              src={form.cardFrontPhoto || "/placeholder.svg"}
                              alt="Card"
                              className="max-w-20 h-12 object-cover rounded border transition group-hover:opacity-80"
                            />
                          </button>
                        ) : (
                          <span className="text-[10px] text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="py-1 px-2 border border-gray-200 truncate">{form.cardNo ?? "N/A"}</td>
                      <td className="py-1 px-2 border border-gray-200 truncate">{form.salesPerson ?? "N/A"}</td>
                      <td className="py-1 px-2 border border-gray-200 truncate">
                        {form.date ? new Date(form.date).toLocaleDateString() : "N/A"}
                      </td>
                      <td className="py-1 px-2 border border-gray-200 truncate">
                        {form.mergedData?.name || form.additionalData?.contactPerson || "N/A"}
                      </td>
                      <td className="py-1 px-2 border border-gray-200">
                        <div className="w-full">
                          <div className="font-medium truncate">{form.mergedData?.companyName || form.additionalData?.company || "N/A"}</div>
                        </div>
                      </td>
                      <td className="py-1 px-2 border border-gray-200 truncate">
                        {form.extractedData?.state || form.additionalData?.city || "N/A"}
                      </td>
                      <td className="py-1 px-2 border border-gray-200 truncate">
                        {form.extractedData?.country || form.country || "N/A"}
                      </td>
                      <td className="py-1 px-2 border border-gray-200">
                        <div className="w-full">
                          {form.mergedData?.email && <div className="truncate">{form.mergedData.email}</div>}
                          {form.mergedData?.contactNumbers && (
                            <div className="text-[10px] text-muted-foreground truncate">
                              {form.mergedData.contactNumbers.split(",")[0]}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-1 px-2 border border-gray-200 truncate">{form.leadStatus ?? "N/A"}</td>
                      <td className="py-1 px-2 border border-gray-200 truncate">{form.dealStatus ?? "N/A"}</td>
                      <td className="py-1 px-2 border border-gray-200 truncate">
                        {form.meetingAfterExhibition ? "Yes" : "No"}
                      </td>
                      <td className="py-1 px-2 border border-gray-200 truncate">{form.status ?? "N/A"}</td>
                      <td className="py-1 px-2 border border-gray-200 truncate">{form.extractionStatus ?? "N/A"}</td>
                      <td className="py-1 px-2 border border-gray-200 truncate">{form.zohoStatus ?? "N/A"}</td>
                      <td className="py-1 px-2 border border-gray-200">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="h-6 text-[10px]">
                              <Eye className="h-3 w-3 mr-1" />
                              View
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl h-[90vh] overflow-hidden flex flex-col">
                            <DialogHeader>
                              <DialogTitle>Business Card Details - {form.cardNo || "N/A"}</DialogTitle>
                            </DialogHeader>
                            <div className="flex-grow overflow-y-auto">
                              <Tabs defaultValue="merged" className="w-full">
                                <TabsList className="grid w-full grid-cols-4 sticky top-0 bg-background z-10">
                                  <TabsTrigger value="merged">Merged Data</TabsTrigger>
                                  <TabsTrigger value="extracted">Extracted Data</TabsTrigger>
                                  <TabsTrigger value="form">Form Data</TabsTrigger>
                                  <TabsTrigger value="images">Images</TabsTrigger>
                                </TabsList>
                                <ScrollArea className="h-[calc(90vh-120px)]">
                                  <TabsContent value="merged">
                                    <Card>
                                      <CardHeader>
                                        <CardTitle>Merged Information</CardTitle>
                                      </CardHeader>
                                      <CardContent>
                                        <pre className="whitespace-pre-wrap bg-muted p-4 rounded-md text-sm">
                                          {formatData(form.mergedData)}
                                        </pre>
                                      </CardContent>
                                    </Card>
                                  </TabsContent>
                                  <TabsContent value="extracted">
                                    <Card>
                                      <CardHeader>
                                        <CardTitle>Extracted Information</CardTitle>
                                      </CardHeader>
                                      <CardContent>
                                        <pre className="whitespace-pre-wrap bg-muted p-4 rounded-md text-sm">
                                          {formatData(form.extractedData)}
                                        </pre>
                                      </CardContent>
                                    </Card>
                                  </TabsContent>
                                  <TabsContent value="form">
                                    <Card>
                                      <CardHeader>
                                        <CardTitle>Form Details</CardTitle>
                                      </CardHeader>
                                      <CardContent>
                                        <pre className="whitespace-pre-wrap bg-muted p-4 rounded-md text-sm">
                                          {formatData(form)}
                                        </pre>
                                      </CardContent>
                                    </Card>
                                  </TabsContent>
                                  <TabsContent value="images">
                                    <Card>
                                      <CardHeader>
                                        <CardTitle>Card Images</CardTitle>
                                      </CardHeader>
                                      <CardContent>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                          {form.cardFrontPhoto && (
                                            <div>
                                              <h4 className="font-medium mb-2">Front</h4>
                                              <button
                                                onClick={() => setZoomedImage(form.cardFrontPhoto!)}
                                                className="block w-full"
                                              >
                                                <img
                                                  src={form.cardFrontPhoto || "/placeholder.svg"}
                                                  alt="Card Front"
                                                  className="max-w-full max-h-96 object-contain rounded-md border hover:opacity-90 transition"
                                                />
                                              </button>
                                            </div>
                                          )}
                                          {form.cardBackPhoto && (
                                            <div>
                                              <h4 className="font-medium mb-2">Back</h4>
                                              <button
                                                onClick={() => setZoomedImage(form.cardBackPhoto!)}
                                                className="block w-full"
                                              >
                                                <img
                                                  src={form.cardBackPhoto || "/placeholder.svg"}
                                                  alt="Card Back"
                                                  className="max-w-full max-h-96 object-contain rounded-md border hover:opacity-90 transition"
                                                />
                                              </button>
                                            </div>
                                          )}
                                        </div>
                                      </CardContent>
                                    </Card>
                                  </TabsContent>
                                </ScrollArea>
                              </Tabs>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={16} className="py-4 text-center border border-gray-200">
                      {isLoading ? "Loading..." : "No forms found matching your criteria"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Zoomed Image Dialog */}
      {zoomedImage && (
        <Dialog open={true} onOpenChange={() => setZoomedImage(null)}>
          <DialogContent className="max-w-3xl p-0 overflow-hidden">
            <img
              src={zoomedImage || "/placeholder.svg"}
              alt="Zoomed Card"
              className="w-full h-auto max-h-[80vh] object-contain"
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}