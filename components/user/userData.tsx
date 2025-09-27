"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import type { FormData } from "@/types/form"

export default function SubmissionPage() {
  const [formData, setFormData] = useState<FormData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { id } = useParams()
  const { toast } = useToast()

  const fetchFormData = useCallback(async () => {
    try {
      setIsLoading(true)
      const res = await fetch(`/api/forms/${id}`, {
        method: "GET",
        headers: {
          "Cache-Control": "no-cache",
        },
      })

      if (!res.ok) {
        throw new Error(`Failed to fetch form data: ${res.status}`)
      }

      const data = await res.json()
      setFormData(data)
    } catch (error) {
      console.error("Error fetching form data:", error)
      toast({
        title: "Error",
        description: "Failed to fetch form data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [id, toast])

  useEffect(() => {
    fetchFormData()
  }, [fetchFormData])

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!formData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-4">
          <h2 className="text-xl font-semibold text-gray-800">No data found</h2>
          <p className="text-gray-600 mt-2">No data found for this submission.</p>
        </div>
      </div>
    )
  }

  const availableTabs = ["form"]
  if (formData.mergedData) availableTabs.push("merged")
  if (formData.extractedData) availableTabs.push("extracted")
  if (formData.cardFrontPhoto || formData.cardBackPhoto) availableTabs.push("images")

  return (
    <div className="container mx-auto px-4 py-4 sm:py-8 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <h1 className="text-xl sm:text-2xl font-bold break-words">
          Submission Details - {formData.cardNo}
        </h1>
        <Button
          onClick={fetchFormData}
          variant="outline"
          size="sm"
          className="flex items-center gap-2 whitespace-nowrap"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardContent className="">
          <ScrollArea className="h-[calc(100vh-180px)] sm:h-[calc(100vh-220px)] mt-6">
            <div className="w-full">
              <Tabs defaultValue="form" className="pb-4">
                <TabsList className="grid w-full md:grid-cols-4 grid-cols-2 sticky top-0 z-10 h-max">
                  {availableTabs.map((tab) => (
                    <TabsTrigger
                      key={tab}
                      value={tab}
                      className="text-sm sm:text-base px-2 sm:px-4"
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)} Data
                    </TabsTrigger>
                  ))}
                </TabsList>

                <div className="mt-4 sm:mt-6">
                  <TabsContent value="form">
                    <Card>
                      <CardHeader>
                        <CardTitle>Form Details</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <pre className="whitespace-pre-wrap break-all bg-muted p-3 sm:p-4 rounded-md text-xs sm:text-sm overflow-x-auto">
                          {formatData(formData)}
                        </pre>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {formData.mergedData && (
                    <TabsContent value="merged">
                      <Card>
                        <CardHeader>
                          <CardTitle>Merged Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <pre className="whitespace-pre-wrap break-all bg-muted p-3 sm:p-4 rounded-md text-xs sm:text-sm overflow-x-auto">
                            {formatData(formData.mergedData)}
                          </pre>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  )}

                  {formData.extractedData && (
                    <TabsContent value="extracted">
                      <Card>
                        <CardHeader>
                          <CardTitle>Extracted Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <pre className="whitespace-pre-wrap bg-muted p-3 sm:p-4 rounded-md text-xs sm:text-sm overflow-x-auto">
                            {formatData(formData.extractedData)}
                          </pre>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  )}

                  {(formData.cardFrontPhoto || formData.cardBackPhoto) && (
                    <TabsContent value="images">
                      <Card>
                        <CardHeader>
                          <CardTitle>Card Images</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {formData.cardFrontPhoto && (
                              <div className="space-y-2">
                                <h4 className="font-medium">Front</h4>
                                <div className="relative aspect-[3/2] w-full">
                                  <img
                                    src={formData.cardFrontPhoto}
                                    alt="Card Front"
                                    className="absolute inset-0 w-full h-full object-contain rounded-md bg-gray-50"
                                  />
                                </div>
                              </div>
                            )}
                            {formData.cardBackPhoto && (
                              <div className="space-y-2">
                                <h4 className="font-medium">Back</h4>
                                <div className="relative aspect-[3/2] w-full">
                                  <img
                                    src={formData.cardBackPhoto}
                                    alt="Card Back"
                                    className="absolute inset-0 w-full h-full object-contain rounded-md bg-gray-50"
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  )}
                </div>
              </Tabs>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}