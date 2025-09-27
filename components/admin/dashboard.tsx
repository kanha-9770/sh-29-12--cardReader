"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Eye, RefreshCcw, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { FormData } from "@/types/form"

export function AdminDashboard() {
  const [forms, setForms] = useState<FormData[]>([])
  const [users, setUsers] = useState<{ id: string; email: string }[]>([])
  const [search, setSearch] = useState("")
  const [selectedUser, setSelectedUser] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  useEffect(() => {
    fetchForms()
    extractUniqueUsers()
  }, [])

  // Reset to first page when search or filter changes
  useEffect(() => {
    setCurrentPage(1)
  }, [search, selectedUser])

  const fetchForms = async () => {
    try {
      setIsLoading(true)
      const res = await fetch("/api/forms", {
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
      extractUniqueUsers(data)
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

  // Extract unique users from forms data
  const extractUniqueUsers = (data = forms) => {
    if (!data.length) return

    const uniqueUsers = Array.from(
      new Map(data.map((form) => [form.userId, { id: form.userId, email: form.user?.email || "Unknown" }])).values(),
    )

    setUsers(uniqueUsers)
  }

  const filteredForms = forms.filter((form) => {
    // First filter by selected user if not "all"
    if (selectedUser !== "all" && form.userId !== selectedUser) {
      return false
    }

    // Then filter by search term
    return (
      form.cardNo?.toLowerCase().includes(search.toLowerCase()) ||
      form.country?.toLowerCase().includes(search.toLowerCase()) ||
      form.salesPerson?.toLowerCase().includes(search.toLowerCase()) ||
      (form.mergedData?.companyName || "").toLowerCase().includes(search.toLowerCase()) ||
      (form.mergedData?.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (form.mergedData?.email || "").toLowerCase().includes(search.toLowerCase()) ||
      (form.mergedData?.contactNumbers || "").toLowerCase().includes(search.toLowerCase()) ||
      (form.user?.email || "").toLowerCase().includes(search.toLowerCase())
    )
  })

  // Pagination logic
  const totalPages = Math.ceil(filteredForms.length / itemsPerPage)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredForms.slice(indexOfFirstItem, indexOfLastItem)

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

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return
    setCurrentPage(page)
  }

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value))
    setCurrentPage(1) // Reset to first page when changing items per page
  }

  return (
    <div className="space-y-4 px-2 sm:px-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center w-full">
          <Input
            placeholder="Search forms..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-64"
          />
          <div className="flex items-center gap-2">
            <Select value={selectedUser} onValueChange={setSelectedUser}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filter by user" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
              <RefreshCcw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>
      </div>
      <Card>
        <CardContent className="p-0 sm:mt-8 ">
          <div className="w-full h-[calc(100vh-200px)] flex flex-col">
            {/* Table with fixed header */}
            <div className="w-full overflow-auto">
              <table className="w-full text-sm border-collapse table-fixed min-w-[1200px]">
                <thead className="sticky top-0 z-10">
                  <tr>
                    <th className="bg-blue-50 dark:bg-blue-950 py-2 text-xs font-semibold border border-gray-200 px-2 w-24">
                      Card No
                    </th>
                    <th className="bg-blue-50 dark:bg-blue-950 py-2 text-xs font-semibold border border-gray-200 px-2 w-28">
                      Sales Person
                    </th>
                    <th className="bg-blue-50 dark:bg-blue-950 py-2 text-xs font-semibold border border-gray-200 px-2 w-24">
                      Date
                    </th>
                    <th className="bg-blue-50 dark:bg-blue-950 py-2 text-xs font-semibold border border-gray-200 px-2 w-40">
                      User
                    </th>
                    <th className="bg-blue-50 dark:bg-blue-950 py-2 text-xs font-semibold border border-gray-200 px-2 w-32">
                      Company
                    </th>
                    <th className="bg-blue-50 dark:bg-blue-950 py-2 text-xs font-semibold border border-gray-200 px-2 w-32">
                      Contact Info
                    </th>
                    <th className="bg-blue-50 dark:bg-blue-950 py-2 text-xs font-semibold border border-gray-200 px-2 w-24">
                      Lead Status
                    </th>
                    <th className="bg-blue-50 dark:bg-blue-950 py-2 text-xs font-semibold border border-gray-200 px-2 w-24">
                      Deal Status
                    </th>
                    <th className="bg-blue-50 dark:bg-blue-950 py-2 text-xs font-semibold border border-gray-200 px-2 w-20">
                      Meeting
                    </th>
                    <th className="bg-blue-50 dark:bg-blue-950 py-2 text-xs font-semibold border border-gray-200 px-2 w-24">
                      Form Status
                    </th>
                    <th className="bg-blue-50 dark:bg-blue-950 py-2 text-xs font-semibold border border-gray-200 px-2 w-32">
                      Extraction Status
                    </th>
                    <th className="bg-blue-50 dark:bg-blue-950 py-2 text-xs font-semibold border border-gray-200 px-2 w-24">
                      Zoho Status
                    </th>
                    <th className="bg-blue-50 dark:bg-blue-950 py-2 text-xs font-semibold border border-gray-200 px-2 w-20">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.length > 0 ? (
                    currentItems.map((form) => (
                      <tr key={form.id} className="text-xs hover:bg-gray-50 dark:hover:bg-gray-900">
                        <td className="py-1 px-2 border border-gray-200 truncate">{form.cardNo}</td>
                        <td className="py-1 px-2 border border-gray-200 truncate">{form.salesPerson}</td>
                        <td className="py-1 px-2 border border-gray-200 truncate">
                          {new Date(form.date).toLocaleDateString()}
                        </td>
                        <td className="py-1 px-2 border border-gray-200 truncate">{form.user?.email || "N/A"}</td>
                        <td className="py-1 px-2 border border-gray-200">
                          <div className="w-full">
                            <div className="font-medium truncate">{form.mergedData?.companyName || "N/A"}</div>
                            <div className="text-[10px] text-muted-foreground truncate">
                              {form.mergedData?.name || "No contact name"}
                            </div>
                          </div>
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
                        <td className="py-1 px-2 border border-gray-200 truncate">{form.leadStatus}</td>
                        <td className="py-1 px-2 border border-gray-200 truncate">{form.dealStatus}</td>
                        <td className="py-1 px-2 border border-gray-200 truncate">
                          {form.meetingAfterExhibition ? "Yes" : "No"}
                        </td>
                        <td className="py-1 px-2 border border-gray-200 truncate">{form.status}</td>
                        <td className="py-1 px-2 border border-gray-200 truncate">{form.extractionStatus}</td>
                        <td className="py-1 px-2 border border-gray-200 truncate">{form.zohoStatus}</td>
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
                                <DialogTitle>Business Card Details - {form.cardNo}</DialogTitle>
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
                                                <img
                                                  src={form.cardFrontPhoto || "/placeholder.svg"}
                                                  alt="Card Front"
                                                  className="w-full h-auto object-contain rounded-md"
                                                />
                                              </div>
                                            )}
                                            {form.cardBackPhoto && (
                                              <div>
                                                <h4 className="font-medium mb-2">Back</h4>
                                                <img
                                                  src={form.cardBackPhoto || "/placeholder.svg"}
                                                  alt="Card Back"
                                                  className="w-full h-auto object-contain rounded-md"
                                                />
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
                      <td colSpan={13} className="py-4 text-center border border-gray-200">
                        {isLoading ? "Loading..." : "No forms found matching your criteria"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="border-t border-gray-200 py-4 px-2 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2 text-xs">
                <span>Rows per page:</span>
                <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
                  <SelectTrigger className="h-8 w-[70px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
                <span className="ml-4">
                  {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredForms.length)} of {filteredForms.length}{" "}
                  items
                </span>
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <div className="flex items-center mx-2">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    // Show pages around current page
                    let pageToShow = currentPage
                    if (currentPage <= 3) {
                      pageToShow = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      pageToShow = totalPages - 4 + i
                    } else {
                      pageToShow = currentPage - 2 + i
                    }

                    // Ensure page is within valid range
                    if (pageToShow > 0 && pageToShow <= totalPages) {
                      return (
                        <Button
                          key={pageToShow}
                          variant={currentPage === pageToShow ? "default" : "outline"}
                          size="icon"
                          className="h-8 w-8 mx-0.5"
                          onClick={() => handlePageChange(pageToShow)}
                        >
                          {pageToShow}
                        </Button>
                      )
                    }
                    return null
                  })}
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages || totalPages === 0}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages || totalPages === 0}
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

