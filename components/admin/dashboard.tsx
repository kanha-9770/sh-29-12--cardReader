// "use client"

// import { useState, useEffect, useCallback } from "react"
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"
// import {
//   Eye,
//   RefreshCcw,
//   ChevronLeft,
//   ChevronRight,
//   ChevronsLeft,
//   ChevronsRight,
//   Trash,
// } from "lucide-react"
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
//   DialogClose,
// } from "@/components/ui/dialog"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { useToast } from "@/components/ui/use-toast"
// import {
//   Tabs,
//   TabsContent,
//   TabsList,
//   TabsTrigger,
// } from "@/components/ui/tabs"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"
// import type { FormData } from "@/types/form"
// import { ExhibitionForm } from "@/components/exhibition-form"

// export function AdminDashboard() {
//   const [forms, setForms] = useState<FormData[]>([])
//   const [users, setUsers] = useState<{ id: string; email: string }[]>([])
//   const [search, setSearch] = useState("")
//   const [selectedUser, setSelectedUser] = useState<string>("all")
//   const [isLoading, setIsLoading] = useState(false)
//   const { toast } = useToast()
//   const [currentPage, setCurrentPage] = useState(1)
//   const [itemsPerPage, setItemsPerPage] = useState(10)

//   useEffect(() => {
//     fetchForms()
//   }, [])

//   useEffect(() => {
//     setCurrentPage(1)
//   }, [search, selectedUser])

//   const fetchForms = async () => {
//     try {
//       setIsLoading(true)
//       const res = await fetch("/api/forms", {
//         method: "GET",
//         headers: { "Cache-Control": "no-cache" },
//       })
//       if (!res.ok) throw new Error(`Failed to fetch forms: ${res.status}`)
//       const data = await res.json()
//       setForms(data)
//       extractUniqueUsers(data)
//     } catch (error) {
//       console.error("Error fetching forms:", error)
//       toast({ title: "Error", description: "Failed to fetch forms.", variant: "destructive" })
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const extractUniqueUsers = (data: FormData[] = forms) => {
//     if (!data || data.length === 0) return setUsers([])
//     const usersMap = new Map<string, { id: string; email: string }>()
//     data.forEach((form) => {
//       if (form.userId) usersMap.set(form.userId, { id: form.userId, email: form.user?.email || "Unknown" })
//     })
//     setUsers(Array.from(usersMap.values()))
//   }

//   const handleDelete = async (id?: string) => {
//     if (!id) return toast({ title: "Unable to delete", description: "Form id is missing.", variant: "destructive" })
//     if (!confirm("Are you sure you want to delete this record? This action cannot be undone.")) return
//     try {
//       setIsLoading(true)
//       const res = await fetch(`/api/forms/${encodeURIComponent(id)}`, { method: "DELETE" })
//       if (!res.ok) {
//         const errorData = await res.text()
//         throw new Error(`Failed to delete form: ${res.status} ${errorData || "No response body"}`)
//       }
//       setForms(prev => prev.filter(f => f.id !== id))
//       toast({ title: "Deleted", description: "Form deleted successfully." })
//     } catch (err) {
//       console.error("Error deleting form:", err)
//       toast({ title: "Error", description: "Failed to delete form.", variant: "destructive" })
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const formatData = (data: any) => {
//     if (!data) return "No data available"
//     return Object.entries(data)
//       .map(([key, value]) => {
//         const formattedKey = key.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())
//         if (Array.isArray(value)) return `${formattedKey}: ${value.join(", ") || "None"}`
//         return `${formattedKey}: ${value ?? "None"}`
//       })
//       .join("\n")
//   }

//   const handleRefresh = () => fetchForms()

//   const handleUpdate = useCallback(async (updatedData: { date: string | number | Date }, formId: string, closeDialog: () => void) => {
//     const submissionData = {
//       ...updatedData,
//       date: new Date(updatedData.date).toISOString(),
//     }
//     try {
//       console.log("Sending PATCH request with data:", submissionData)
//       const res = await fetch(`/api/forms/${encodeURIComponent(formId)}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(submissionData),
//       })

//       const contentType = res.headers.get("content-type")
//       console.log("Response status:", res.status, "Content-Type:", contentType)

//       if (!res.ok) {
//         const text = await res.text()
//         console.error("PATCH request failed:", { status: res.status, body: text || "No response body" })
//         if (res.status === 405) {
//           throw new Error("Method not allowed: PATCH is not supported by the server")
//         }
//         throw new Error(`Failed to update form: ${res.status} ${text || "No response body"}`)
//       }

//       if (contentType?.includes("application/json")) {
//         const responseData = await res.json()
//         console.log("PATCH response:", responseData)

//         // Update local state
//         setForms(prev => prev.map(f => f.id === formId ? { ...f, ...submissionData } : f))
        
//         toast({ title: "Form Updated", description: "Changes saved successfully!" })
//         closeDialog()
//         fetchForms()
//       } else {
//         const text = await res.text()
//         console.error("Non-JSON response received:", text || "Empty response")
//         throw new Error("Server returned non-JSON response")
//       }
//     } catch (err) {
//       console.error("Error updating form:", err)
//       toast({ 
//         title: "Error updating form", 
//         description: err instanceof Error ? err.message : "Failed to update form.", 
//         variant: "destructive" 
//       })
//     }
//   }, [toast])

//   const filteredForms = forms.filter(form => {
//     if (selectedUser !== "all" && form.userId !== selectedUser) return false
//     const q = search.toLowerCase()
//     return (
//       (form.cardNo || "").toLowerCase().includes(q) ||
//       (form.country || "").toLowerCase().includes(q) ||
//       (form.salesPerson || "").toLowerCase().includes(q) ||
//       ((form.mergedData?.companyName || "") as string).toLowerCase().includes(q) ||
//       ((form.mergedData?.name || "") as string).toLowerCase().includes(q) ||
//       ((form.mergedData?.email || "") as string).toLowerCase().includes(q) ||
//       ((form.mergedData?.contactNumbers || "") as string).toLowerCase().includes(q) ||
//       ((form.user?.email || "") as string).toLowerCase().includes(q)
//     )
//   })

//   const totalPages = Math.ceil(filteredForms.length / itemsPerPage)
//   const indexOfLastItem = currentPage * itemsPerPage
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage
//   const currentItems = filteredForms.slice(indexOfFirstItem, indexOfLastItem)

//   const handlePageChange = (page: number) => { if (page < 1 || page > totalPages) return; setCurrentPage(page) }
//   const handleItemsPerPageChange = (value: string) => { setItemsPerPage(Number(value)); setCurrentPage(1) }

//   return (
//     <div className="space-y-4 px-2 sm:px-4">
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <Input placeholder="Search forms..." value={search} onChange={e => setSearch(e.target.value)} className="w-full sm:w-64" />
//         <div className="flex items-center gap-2">
//           <Select value={selectedUser} onValueChange={setSelectedUser}>
//             <SelectTrigger className="w-full sm:w-[200px]"><SelectValue placeholder="Filter by user" /></SelectTrigger>
//             <SelectContent>
//               <SelectItem value="all">All Users</SelectItem>
//               {users.map(u => <SelectItem key={u.id} value={u.id}>{u.email}</SelectItem>)}
//             </SelectContent>
//           </Select>
//           <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
//             <RefreshCcw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} /> Refresh
//           </Button>
//         </div>
//       </div>

//       <Card>
//         <CardContent className="p-0 sm:mt-8">
//           <div className="w-full h-[calc(100vh-200px)] flex flex-col">
//             <div className="w-full overflow-auto">
//               <table className="w-full text-sm border-collapse table-fixed min-w-[1200px]">
//                 <thead className="sticky top-0 z-10">
//                   <tr>
//                     <th className="bg-blue-50 py-2 px-2 border w-24">Card No</th>
//                     <th className="bg-blue-50 py-2 px-2 border w-28">Sales Person</th>
//                     <th className="bg-blue-50 py-2 px-2 border w-24">Date</th>
//                     <th className="bg-blue-50 py-2 px-2 border w-40">User</th>
//                     <th className="bg-blue-50 py-2 px-2 border w-32">Company</th>
//                     <th className="bg-blue-50 py-2 px-2 border w-32">Contact Info</th>
//                     <th className="bg-blue-50 py-2 px-2 border w-24">Lead Status</th>
//                     <th className="bg-blue-50 py-2 px-2 border w-24">Deal Status</th>
//                     <th className="bg-blue-50 py-2 px-2 border w-20">Meeting</th>
//                     <th className="bg-blue-50 py-2 px-2 border w-24">Form Status</th>
//                     <th className="bg-blue-50 py-2 px-2 border w-32">Extraction Status</th>
//                     <th className="bg-blue-50 py-2 px-2 border w-24">Zoho Status</th>
//                     <th className="bg-blue-50 py-2 px-2 border w-24">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {currentItems.length > 0 ? (
//                     currentItems.map(form => (
//                       <tr key={form.id} className="text-xs hover:bg-gray-50">
//                         <td className="py-1 px-2 border truncate">{form.cardNo ?? "N/A"}</td>
//                         <td className="py-1 px-2 border truncate">{form.salesPerson ?? "N/A"}</td>
//                         <td className="py-1 px-2 border truncate">{form.date ? new Date(form.date).toLocaleDateString() : "N/A"}</td>
//                         <td className="py-1 px-2 border truncate">{form.user?.email || "N/A"}</td>
//                         <td className="py-1 px-2 border">
//                           <div className="truncate font-medium">{form.mergedData?.companyName || "N/A"}</div>
//                           <div className="text-[10px] text-muted-foreground truncate">{form.mergedData?.name || "No contact"}</div>
//                         </td>
//                         <td className="py-1 px-2 border">
//                           {form.mergedData?.email && <div className="truncate">{form.mergedData.email}</div>}
//                           {form.mergedData?.contactNumbers && <div className="text-[10px] text-muted-foreground truncate">{form.mergedData.contactNumbers.split(",")[0]}</div>}
//                         </td>
//                         <td className="py-1 px-2 border truncate">{form.leadStatus ?? "N/A"}</td>
//                         <td className="py-1 px-2 border truncate">{form.dealStatus ?? "N/A"}</td>
//                         <td className="py-1 px-2 border truncate">{form.meetingAfterExhibition ? "Yes" : "No"}</td>
//                         <td className="py-1 px-2 border truncate">{form.status ?? "N/A"}</td>
//                         <td className="py-1 px-2 border truncate">{form.extractionStatus ?? "N/A"}</td>
//                         <td className="py-1 px-2 border truncate">{form.zohoStatus ?? "N/A"}</td>
//                         <td className="py-1 px-2 border flex flex-col gap-1">
//                           <Dialog>
//                             <DialogTrigger asChild>
//                               <Button variant="outline" size="sm" className="h-6 text-[10px]">
//                                 <Eye className="h-3 w-3 mr-1" /> View
//                               </Button>
//                             </DialogTrigger>
//                             <DialogContent className="max-w-4xl h-[90vh] overflow-hidden flex flex-col">
//                               <DialogHeader>
//                                 <DialogTitle>Business Card akash - {form.cardNo || "N/A"}</DialogTitle>
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
//                                           <pre className="whitespace-pre-wrap bg-muted p-4 rounded-md text-sm">{formatData(form.mergedData)}</pre>
//                                         </CardContent>
//                                       </Card>
//                                     </TabsContent>
//                                     <TabsContent value="extracted">
//                                       <Card>
//                                         <CardHeader>
//                                           <CardTitle>Extracted Information</CardTitle>
//                                         </CardHeader>
//                                         <CardContent>
//                                           <pre className="whitespace-pre-wrap bg-muted p-4 rounded-md text-sm">{formatData(form.extractedData)}</pre>
//                                         </CardContent>
//                                       </Card>
//                                     </TabsContent>
//                                     <TabsContent value="form">
//                                       <Card>
//                                         <CardHeader>
//                                           <CardTitle>Form Details</CardTitle>
//                                         </CardHeader>
//                                         <CardContent>
//                                           <pre className="whitespace-pre-wrap bg-muted p-4 rounded-md text-sm">{formatData(form)}</pre>
//                                         </CardContent>
//                                       </Card>
//                                     </TabsContent>
//                                   </ScrollArea>
//                                 </Tabs>
//                               </div>
//                             </DialogContent>
//                           </Dialog>

//                           <Dialog>
//                             <DialogTrigger asChild>
//                               <Button variant="secondary" size="sm" className="h-6 text-[10px]">✏️ Edit</Button>
//                             </DialogTrigger>
//                             <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
//                               <DialogHeader>
//                                 <DialogTitle>Edit Form - {form.cardNo}</DialogTitle>
//                               </DialogHeader>
//                               <DialogClose asChild>
//                                 <button className="hidden" id={`close-dialog-${form.id}`}></button>
//                               </DialogClose>
//                               <ExhibitionForm
//                                 initialData={{
//                                   cardNo: form.cardNo,
//                                   salesPerson: form.salesPerson,
//                                   date: form.date ? new Date(form.date).toISOString().split("T")[0] : "",
//                                   country: form.country,
//                                   cardFrontPhoto: form.cardFrontPhoto,
//                                   cardBackPhoto: form.cardBackPhoto,
//                                   leadStatus: form.leadStatus,
//                                   dealStatus: form.dealStatus,
//                                   meetingAfterExhibition: form.meetingAfterExhibition,
//                                   industryCategories: form.industryCategories,
//                                   description: form.description,
//                                 }}
//                                 onSubmit={(updatedData) => handleUpdate(updatedData, form.id, () => {
//                                   document.getElementById(`close-dialog-${form.id}`)?.click()
//                                 })}
//                                 isEdit={true}
//                                 formId={form.id}
//                               />
//                             </DialogContent>
//                           </Dialog>

//                           <Button
//                             variant="destructive"
//                             size="sm"
//                             className="h-6 text-[10px]"
//                             onClick={() => handleDelete(form.id)}
//                             disabled={isLoading}
//                           >
//                             <Trash className="h-3 w-3" /> Delete
//                           </Button>
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr><td colSpan={13} className="py-4 text-center border">{isLoading ? "Loading..." : "No forms found"}</td></tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }

// export default AdminDashboard


"use client"

import { useState, useEffect, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Eye,
  RefreshCcw,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Trash,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { FormData } from "@/types/form"
import { ExhibitionForm } from "@/components/exhibition-form"

export function AdminDashboard() {
  const [forms, setForms] = useState<FormData[]>([])
  const [users, setUsers] = useState<{ id: string; email: string }[]>([])
  const [search, setSearch] = useState("")
  const [selectedUser, setSelectedUser] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  useEffect(() => {
    fetchForms()
  }, [])

  useEffect(() => {
    setCurrentPage(1)
  }, [search, selectedUser])

  const fetchForms = async () => {
    try {
      setIsLoading(true)
      const res = await fetch("/api/forms", {
        method: "GET",
        headers: { "Cache-Control": "no-cache" },
      })
      if (!res.ok) throw new Error(`Failed to fetch forms: ${res.status}`)
      const data = await res.json()
      setForms(data)
      extractUniqueUsers(data)
    } catch (error) {
      console.error("Error fetching forms:", error)
      toast({ title: "Error", description: "Failed to fetch forms.", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const extractUniqueUsers = (data: FormData[] = forms) => {
    if (!data || data.length === 0) return setUsers([])
    const usersMap = new Map<string, { id: string; email: string }>()
    data.forEach((form) => {
      if (form.userId) usersMap.set(form.userId, { id: form.userId, email: form.user?.email || "Unknown" })
    })
    setUsers(Array.from(usersMap.values()))
  }

  const handleDelete = async (id?: string) => {
    if (!id) return toast({ title: "Unable to delete", description: "Form id is missing.", variant: "destructive" })
    if (!confirm("Are you sure you want to delete this record? This action cannot be undone.")) return
    try {
      setIsLoading(true)
      const res = await fetch(`/api/forms/${encodeURIComponent(id)}`, { method: "DELETE" })
      if (!res.ok) {
        const errorData = await res.text()
        throw new Error(`Failed to delete form: ${res.status} ${errorData || "No response body"}`)
      }
      setForms(prev => prev.filter(f => f.id !== id))
      toast({ title: "Deleted", description: "Form deleted successfully." })
    } catch (err) {
      console.error("Error deleting form:", err)
      toast({ title: "Error", description: "Failed to delete form.", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const formatData = (data: any) => {
    if (!data) return "No data available"
    return Object.entries(data)
      .map(([key, value]) => {
        const formattedKey = key.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())
        if (Array.isArray(value)) return `${formattedKey}: ${value.join(", ") || "None"}`
        return `${formattedKey}: ${value ?? "None"}`
      })
      .join("\n")
  }

  const handleRefresh = () => fetchForms()

  const handleUpdate = useCallback(async (updatedData: any, formId: string, closeDialog: () => void) => {
    const submissionData = {
      ...updatedData,
      date: updatedData.date ? new Date(updatedData.date).toISOString() : undefined,
    }
    try {
      console.log("Sending PATCH request with data:", submissionData)
      const res = await fetch(`/api/forms/${encodeURIComponent(formId)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      })

      const contentType = res.headers.get("content-type")
      console.log("Response status:", res.status, "Content-Type:", contentType)

      if (!res.ok) {
        const text = await res.text()
        console.error("PATCH request failed:", { status: res.status, body: text || "No response body" })
        if (res.status === 405) {
          throw new Error("Method not allowed: PATCH is not supported by the server")
        }
        throw new Error(`Failed to update form: ${res.status} ${text || "No response body"}`)
      }

      if (contentType?.includes("application/json")) {
        const responseData = await res.json()
        console.log("PATCH response:", responseData)

        setForms(prev => prev.map(f => f.id === formId ? { ...f, ...submissionData } : f))
        
        toast({ title: "Form Updated", description: "Changes saved successfully!" })
        closeDialog()
        fetchForms()
      } else {
        const text = await res.text()
        console.error("Non-JSON response received:", text || "Empty response")
        throw new Error("Server returned non-JSON response")
      }
    } catch (err) {
      console.error("Error updating form:", err)
      toast({ 
        title: "Error updating form", 
        description: err instanceof Error ? err.message : "Failed to update form.", 
        variant: "destructive" 
      })
    }
  }, [toast])

  const handleExtractedDataUpdate = useCallback(async (updatedData: any, formId: string, closeDialog: () => void) => {
    try {
      console.log("Sending PATCH request for extracted data:", updatedData)
      const res = await fetch(`/api/forms/${encodeURIComponent(formId)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ extractedData: updatedData }),
      })

      const contentType = res.headers.get("content-type")
      console.log("Response status:", res.status, "Content-Type:", contentType)

      if (!res.ok) {
        const text = await res.text()
        console.error("PATCH request failed:", { status: res.status, body: text || "No response body" })
        throw new Error(`Failed to update extracted data: ${res.status} ${text || "No response body"}`)
      }

      if (contentType?.includes("application/json")) {
        const responseData = await res.json()
        console.log("PATCH response for extracted data:", responseData)

        setForms(prev => prev.map(f => f.id === formId ? { ...f, extractedData: updatedData } : f))
        toast({ title: "Extracted Data Updated", description: "Changes saved successfully!" })
        closeDialog()
        fetchForms()
      } else {
        const text = await res.text()
        console.error("Non-JSON response received:", text || "Empty response")
        throw new Error("Server returned non-JSON response")
      }
    } catch (err) {
      console.error("Error updating extracted data:", err)
      toast({
        title: "Error updating extracted data",
        description: err instanceof Error ? err.message : "Failed to update extracted data.",
        variant: "destructive"
      })
    }
  }, [toast])

  const filteredForms = forms.filter(form => {
    if (selectedUser !== "all" && form.userId !== selectedUser) return false
    const q = search.toLowerCase()
    return (
      (form.cardNo || "").toLowerCase().includes(q) ||
      (form.country || "").toLowerCase().includes(q) ||
      (form.salesPerson || "").toLowerCase().includes(q) ||
      ((form.mergedData?.companyName || "") as string).toLowerCase().includes(q) ||
      ((form.mergedData?.name || "") as string).toLowerCase().includes(q) ||
      ((form.mergedData?.email || "") as string).toLowerCase().includes(q) ||
      ((form.mergedData?.contactNumbers || "") as string).toLowerCase().includes(q) ||
      ((form.user?.email || "") as string).toLowerCase().includes(q)
    )
  })

  const totalPages = Math.ceil(filteredForms.length / itemsPerPage)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredForms.slice(indexOfFirstItem, indexOfLastItem)

  const handlePageChange = (page: number) => { if (page < 1 || page > totalPages) return; setCurrentPage(page) }
  const handleItemsPerPageChange = (value: string) => { setItemsPerPage(Number(value)); setCurrentPage(1) }

  const ExtractedDataForm = ({ form, closeDialog }: { form: FormData; closeDialog: () => void }) => {
    const [formData, setFormData] = useState({ ...form.extractedData } || {})
    const disabledFields = ['id', 'formId', 'createdAt', 'updatedAt', 'status']

    const handleChange = (key: string, value: string) => {
      console.log(`Updating field ${key} to:`, value)
      setFormData(prev => {
        const updated = { ...prev, [key]: value }
        console.log("Updated formData:", updated)
        return updated
      })
    }

    const handleSubmit = () => {
      console.log("Submitting form data:", formData)
      // Ensure disabled fields are not modified
      const updatedData = { ...form.extractedData, ...formData }
      disabledFields.forEach(field => {
        if (form.extractedData?.[field] !== undefined) {
          updatedData[field] = form.extractedData[field]
        }
      })
      console.log("Final data to submit:", updatedData)
      handleExtractedDataUpdate(updatedData, form.id, closeDialog)
    }

    return (
      <div className="space-y-4">
        {Object.entries(form.extractedData || {}).map(([key, value]) => (
          <div key={key} className="flex flex-col gap-2">
            <label className="text-sm font-medium">
              {key.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
            </label>
            <Input
              value={formData[key] ?? (value as string) ?? ""}
              onChange={(e) => handleChange(key, e.target.value)}
              className="w-full"
              disabled={disabledFields.includes(key)}
            />
          </div>
        ))}
        {Object.keys(form.extractedData || {}).length === 0 && (
          <div className="text-sm text-muted-foreground">No extracted data available</div>
        )}
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={closeDialog}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={Object.keys(form.extractedData || {}).length === 0}>
            Save Changes
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 px-2 sm:px-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Input placeholder="Search forms..." value={search} onChange={e => setSearch(e.target.value)} className="w-full sm:w-64" />
        <div className="flex items-center gap-2">
          <Select value={selectedUser} onValueChange={setSelectedUser}>
            <SelectTrigger className="w-full sm:w-[200px]"><SelectValue placeholder="Filter by user" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              {users.map(u => <SelectItem key={u.id} value={u.id}>{u.email}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCcw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} /> Refresh
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0 sm:mt-8">
          <div className="w-full h-[calc(100vh-200px)] flex flex-col">
            <div className="w-full overflow-auto">
              <table className="w-full text-sm border-collapse table-fixed min-w-[1200px]">
                <thead className="sticky top-0 z-10">
                  <tr>
                    <th className="bg-blue-50 py-2 px-2 border w-24">Card No</th>
                    <th className="bg-blue-50 py-2 px-2 border w-28">Sales Person</th>
                    <th className="bg-blue-50 py-2 px-2 border w-24">Date</th>
                    <th className="bg-blue-50 py-2 px-2 border w-40">User</th>
                    <th className="bg-blue-50 py-2 px-2 border w-32">Company</th>
                    <th className="bg-blue-50 py-2 px-2 border w-32">Contact Info</th>
                    <th className="bg-blue-50 py-2 px-2 border w-24">Lead Status</th>
                    <th className="bg-blue-50 py-2 px-2 border w-24">Deal Status</th>
                    <th className="bg-blue-50 py-2 px-2 border w-20">Meeting</th>
                    <th className="bg-blue-50 py-2 px-2 border w-24">Form Status</th>
                    <th className="bg-blue-50 py-2 px-2 border w-32">Extraction Status</th>
                    <th className="bg-blue-50 py-2 px-2 border w-24">Zoho Status</th>
                    <th className="bg-blue-50 py-2 px-2 border w-24">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.length > 0 ? (
                    currentItems.map(form => (
                      <tr key={form.id} className="text-xs hover:bg-gray-50">
                        <td className="py-1 px-2 border truncate">{form.cardNo ?? "N/A"}</td>
                        <td className="py-1 px-2 border truncate">{form.salesPerson ?? "N/A"}</td>
                        <td className="py-1 px-2 border truncate">{form.date ? new Date(form.date).toLocaleDateString() : "N/A"}</td>
                        <td className="py-1 px-2 border truncate">{form.user?.email || "N/A"}</td>
                        <td className="py-1 px-2 border">
                          <div className="truncate font-medium">{form.mergedData?.companyName || "N/A"}</div>
                          <div className="text-[10px] text-muted-foreground truncate">{form.mergedData?.name || "No contact"}</div>
                        </td>
                        <td className="py-1 px-2 border">
                          {form.mergedData?.email && <div className="truncate">{form.mergedData.email}</div>}
                          {form.mergedData?.contactNumbers && <div className="text-[10px] text-muted-foreground truncate">{form.mergedData.contactNumbers.split(",")[0]}</div>}
                        </td>
                        <td className="py-1 px-2 border truncate">{form.leadStatus ?? "N/A"}</td>
                        <td className="py-1 px-2 border truncate">{form.dealStatus ?? "N/A"}</td>
                        <td className="py-1 px-2 border truncate">{form.meetingAfterExhibition ? "Yes" : "No"}</td>
                        <td className="py-1 px-2 border truncate">{form.status ?? "N/A"}</td>
                        <td className="py-1 px-2 border truncate">{form.extractionStatus ?? "N/A"}</td>
                        <td className="py-1 px-2 border truncate">{form.zohoStatus ?? "N/A"}</td>
                        <td className="py-1 px-2 border flex flex-col gap-1">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" className="h-6 text-[10px]">
                                <Eye className="h-3 w-3 mr-1" /> View
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl h-[90vh] overflow-hidden flex flex-col">
                              <DialogHeader>
                                <DialogTitle>Business Card - {form.cardNo || "N/A"}</DialogTitle>
                              </DialogHeader>
                              <DialogClose asChild>
                                <button className="hidden" id={`close-view-dialog-${form.id}`}></button>
                              </DialogClose>
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
                                          <pre className="whitespace-pre-wrap bg-muted p-4 rounded-md text-sm">{formatData(form.mergedData)}</pre>
                                        </CardContent>
                                      </Card>
                                    </TabsContent>
                                    <TabsContent value="extracted">
                                      <Card>
                                        <CardHeader>
                                          <CardTitle>Extracted Information</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                          <ExtractedDataForm 
                                            form={form} 
                                            closeDialog={() => document.getElementById(`close-view-dialog-${form.id}`)?.click()}
                                          />
                                        </CardContent>
                                      </Card>
                                    </TabsContent>
                                    <TabsContent value="form">
                                      <Card>
                                        <CardHeader>
                                          <CardTitle>Form Details</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                          <div className="flex flex-row gap-4">
                                            {/* Raw Data Column */}
                                            <div className="w-1/2">
                                              <h3 className="text-lg font-semibold mb-2">Raw Data</h3>
                                              <ScrollArea className="h-[calc(90vh-200px)] bg-muted p-4 rounded-md">
                                                <pre className="text-sm whitespace-pre-wrap">{formatData(form)}</pre>
                                              </ScrollArea>
                                            </div>
                                            {/* Table Data Column */}
                                            <div className="w-1/2">
                                              <h3 className="text-lg font-semibold mb-2">Table Data</h3>
                                              <ScrollArea className="h-[calc(90vh-200px)]">
                                                <table className="w-full text-sm border-collapse">
                                                  <thead>
                                                    <tr>
                                                      <th className="bg-gray-100 py-2 px-2 border text-left">Field</th>
                                                      <th className="bg-gray-100 py-2 px-2 border text-left">Value</th>
                                                    </tr>
                                                  </thead>
                                                  <tbody>
                                                    <tr>
                                                      <td className="py-1 px-2 border">Card No</td>
                                                      <td className="py-1 px-2 border">{form.cardNo ?? "N/A"}</td>
                                                    </tr>
                                                    <tr>
                                                      <td className="py-1 px-2 border">Sales Person</td>
                                                      <td className="py-1 px-2 border">{form.salesPerson ?? "N/A"}</td>
                                                    </tr>
                                                    <tr>
                                                      <td className="py-1 px-2 border">Date</td>
                                                      <td className="py-1 px-2 border">{form.date ? new Date(form.date).toLocaleDateString() : "N/A"}</td>
                                                    </tr>
                                                    <tr>
                                                      <td className="py-1 px-2 border">User</td>
                                                      <td className="py-1 px-2 border">{form.user?.email || "N/A"}</td>
                                                    </tr>
                                                    <tr>
                                                      <td className="py-1 px-2 border">Company</td>
                                                      <td className="py-1 px-2 border">
                                                        <div className="font-medium">{form.mergedData?.companyName || "N/A"}</div>
                                                        <div className="text-[10px] text-muted-foreground">{form.mergedData?.name || "No contact"}</div>
                                                      </td>
                                                    </tr>
                                                    <tr>
                                                      <td className="py-1 px-2 border">Contact Info</td>
                                                      <td className="py-1 px-2 border">
                                                        {form.mergedData?.email && <div>{form.mergedData.email}</div>}
                                                        {form.mergedData?.contactNumbers && <div className="text-[10px] text-muted-foreground">{form.mergedData.contactNumbers.split(",")[0]}</div>}
                                                      </td>
                                                    </tr>
                                                    <tr>
                                                      <td className="py-1 px-2 border">Lead Status</td>
                                                      <td className="py-1 px-2 border">{form.leadStatus ?? "N/A"}</td>
                                                    </tr>
                                                    <tr>
                                                      <td className="py-1 px-2 border">Deal Status</td>
                                                      <td className="py-1 px-2 border">{form.dealStatus ?? "N/A"}</td>
                                                    </tr>
                                                    <tr>
                                                      <td className="py-1 px-2 border">Meeting</td>
                                                      <td className="py-1 px-2 border">{form.meetingAfterExhibition ? "Yes" : "No"}</td>
                                                    </tr>
                                                    <tr>
                                                      <td className="py-1 px-2 border">Form Status</td>
                                                      <td className="py-1 px-2 border">{form.status ?? "N/A"}</td>
                                                    </tr>
                                                    <tr>
                                                      <td className="py-1 px-2 border">Extraction Status</td>
                                                      <td className="py-1 px-2 border">{form.extractionStatus ?? "N/A"}</td>
                                                    </tr>
                                                    <tr>
                                                      <td className="py-1 px-2 border">Zoho Status</td>
                                                      <td className="py-1 px-2 border">{form.zohoStatus ?? "N/A"}</td>
                                                    </tr>
                                                  </tbody>
                                                </table>
                                              </ScrollArea>
                                            </div>
                                          </div>
                                        </CardContent>
                                      </Card>
                                    </TabsContent>
                                    <TabsContent value="images">
                                      <Card>
                                        <CardHeader>
                                          <CardTitle>Images</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                          <ScrollArea className="h-[calc(90vh-200px)]">
                                            <div className="space-y-4">
                                              <div>
                                                <h4 className="text-sm font-medium mb-2">Front Image</h4>
                                                {form.cardFrontPhoto ? (
                                                  <img
                                                    src={form.cardFrontPhoto}
                                                    alt="Card Front"
                                                    className="max-w-full max-h-64 object-contain rounded-md"
                                                  />
                                                ) : (
                                                  <div className="text-sm text-muted-foreground">No front image available</div>
                                                )}
                                              </div>
                                              <div>
                                                <h4 className="text-sm font-medium mb-2">Back Image</h4>
                                                {form.cardBackPhoto ? (
                                                  <img
                                                    src={form.cardBackPhoto}
                                                    alt="Card Back"
                                                    className="max-w-full max-h-64 object-contain rounded-md"
                                                  />
                                                ) : (
                                                  <div className="text-sm text-muted-foreground">No back image available</div>
                                                )}
                                              </div>
                                            </div>
                                          </ScrollArea>
                                        </CardContent>
                                      </Card>
                                    </TabsContent>
                                  </ScrollArea>
                                </Tabs>
                              </div>
                            </DialogContent>
                          </Dialog>

                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="secondary" size="sm" className="h-6 text-[10px]">✏️ Edit</Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Edit Form - {form.cardNo}</DialogTitle>
                              </DialogHeader>
                              <DialogClose asChild>
                                <button className="hidden" id={`close-dialog-${form.id}`}></button>
                              </DialogClose>
                              <ExhibitionForm
                                initialData={{
                                  cardNo: form.cardNo,
                                  salesPerson: form.salesPerson,
                                  date: form.date ? new Date(form.date).toISOString().split("T")[0] : "",
                                  country: form.country,
                                  cardFrontPhoto: form.cardFrontPhoto,
                                  cardBackPhoto: form.cardBackPhoto,
                                  leadStatus: form.leadStatus,
                                  dealStatus: form.dealStatus,
                                  meetingAfterExhibition: form.meetingAfterExhibition,
                                  industryCategories: form.industryCategories,
                                  description: form.description,
                                }}
                                onSubmit={(updatedData) => handleUpdate(updatedData, form.id, () => {
                                  document.getElementById(`close-dialog-${form.id}`)?.click()
                                })}
                                isEdit={true}
                                formId={form.id}
                              />
                            </DialogContent>
                          </Dialog>

                          <Button
                            variant="destructive"
                            size="sm"
                            className="h-6 text-[10px]"
                            onClick={() => handleDelete(form.id)}
                            disabled={isLoading}
                          >
                            <Trash className="h-3 w-3" /> Delete
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={13} className="py-4 text-center border">{isLoading ? "Loading..." : "No forms found"}</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AdminDashboard