"use client"

import type React from "react"
import { useState, useCallback, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import { Upload, X, Camera, RefreshCw } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import {
  salesPersons,
  leadStatuses,
  dealStatuses,
  industryCategories,
  type FormData,
} from "@/types/form"
import { PopupModal } from "@/components/popup-modal"
import { useRouter, useSearchParams } from "next/navigation"

interface ExhibitionFormProps {
  initialData?: Partial<FormData>
  onSubmit?: (data: FormData) => Promise<void>
  isEdit?: boolean
  formId?: string
}

export function ExhibitionForm({ initialData = {}, onSubmit, isEdit = false, formId }: ExhibitionFormProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()

  const defaultFormData: FormData = {
    cardNo: searchParams?.get("cardNo") || "",
    salesPerson: searchParams?.get("salesPerson") || "",
    date: new Date().toISOString().split("T")[0],
    country: searchParams?.get("exhibition") || "LABEL EXPO SPAIN 2025",
    cardFrontPhoto: "",
    cardBackPhoto: "",
    leadStatus: searchParams?.get("leadStatus") || "",
    dealStatus: searchParams?.get("dealStatus") || "",
    meetingAfterExhibition:
      searchParams?.get("meetingAfterExhibition")?.toLowerCase() === "true" || false,
    industryCategories: searchParams?.get("industryCategories") || "",
    description: "",
    extractedData: null,
    mergedData: null,
    status: "PENDING",
    extractionStatus: "PENDING",
    zohoStatus: "PENDING",
    userId: undefined,
    user: undefined,
  }

  const [formData, setFormData] = useState<FormData>({ ...defaultFormData, ...initialData })
  const [frontImagePreview, setFrontImagePreview] = useState<string | null>(initialData?.cardFrontPhoto || null)
  const [backImagePreview, setBackImagePreview] = useState<string | null>(initialData?.cardBackPhoto || null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showBackImageModal, setShowBackImageModal] = useState(false)
  const [frontUploadProgress, setFrontUploadProgress] = useState(0)
  const [backUploadProgress, setBackUploadProgress] = useState(0)
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isCameraOpen, setIsCameraOpen] = useState(false)
  const [currentImageType, setCurrentImageType] = useState<"front" | "back" | null>(null)
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment")
  const [consoleData, setConsoleData] = useState<string[]>([])
  const [showConsole, setShowConsole] = useState(false)

  const addConsoleLog = useCallback((message: string) => {
    setConsoleData((prev) => [...prev, message])
  }, [])

  useEffect(() => {
    if (!isEdit) {
      const formUpdates: Partial<FormData> = {}
      const getParam = (key: string): string => {
        const value = searchParams?.get(key)
        return value ? decodeURIComponent(value.replace(/\+/g, " ")) : ""
      }

      const salesPerson = getParam("salesPerson")
      if (salesPerson && salesPersons.includes(salesPerson)) {
        formUpdates.salesPerson = salesPerson
      }

      const leadStatus = getParam("leadStatus")
      if (leadStatus && leadStatuses.includes(leadStatus)) {
        formUpdates.leadStatus = leadStatus
      }

      const dealStatus = getParam("dealStatus")
      if (dealStatus && dealStatuses.includes(dealStatus)) {
        formUpdates.dealStatus = dealStatus
      }

      const categoriesParam = getParam("industryCategories")
      if (categoriesParam) {
        const categories = categoriesParam.split(",").map((cat) => cat.trim())
        const validCategories = categories.filter((cat) => industryCategories.includes(cat))
        formUpdates.industryCategories = validCategories.join(",")
      }

      if (Object.keys(formUpdates).length > 0) {
        setFormData((prev) => ({ ...prev, ...formUpdates }))
      }
    }
  }, [searchParams, isEdit])

  useEffect(() => {
    if (initialData?.cardFrontPhoto) {
      setFrontImagePreview(initialData.cardFrontPhoto)
    }
    if (initialData?.cardBackPhoto) {
      setBackImagePreview(initialData.cardBackPhoto)
    }
    if (initialData?.date && initialData.date.includes("T")) {
      setFormData((prev) => ({ ...prev, date: initialData.date?.split("T")[0] || "" }))
    }
  }, [initialData])

  const openCamera = useCallback((type: "front" | "back") => {
    addConsoleLog(`[Camera] Opening camera for ${type} image.`)
    setCurrentImageType(type)
    setIsCameraOpen(true)
    startCameraStream()
  }, [addConsoleLog])

  const startCameraStream = async () => {
    addConsoleLog("[Camera] Starting camera stream.")
    try {
      if (videoRef.current) {
        stopCameraStream()
        const constraints = {
          video: {
            facingMode: facingMode,
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        }
        addConsoleLog(`[Camera] Requesting user media with constraints: ${JSON.stringify(constraints)}`)
        const stream = await navigator.mediaDevices.getUserMedia(constraints)
        videoRef.current.srcObject = stream
        await videoRef.current.play().catch((err) => {
          console.error("Error playing video:", err)
          addConsoleLog(`[Camera] Error playing video: ${err}`)
        })
        addConsoleLog("[Camera] Camera stream started successfully.")
      }
    } catch (err) {
      console.error("Error accessing camera:", err)
      toast({
        title: "Camera Error",
        description: "Failed to access camera. Please check your permissions or try a different browser.",
        variant: "destructive",
      })
      addConsoleLog(`[Camera] Error accessing camera: ${err}`)
      setIsCameraOpen(false)
    }
  }

  const toggleCamera = () => {
    addConsoleLog("[Camera] Toggling camera facing mode.")
    setFacingMode(facingMode === "user" ? "environment" : "user")
  }

  useEffect(() => {
    if (isCameraOpen) {
      startCameraStream()
    }
    return () => {
      if (isCameraOpen) {
        stopCameraStream()
      }
    }
  }, [facingMode, isCameraOpen])

  const captureImage = () => {
    addConsoleLog("[Camera] Capturing image from camera.")
    if (videoRef.current && canvasRef.current && videoRef.current.videoWidth > 0) {
      const video = videoRef.current
      const canvas = canvasRef.current
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const context = canvas.getContext("2d")
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height)
        canvas.toBlob(
          (blob) => {
            if (blob) {
              addConsoleLog(`[Camera] Blob created: ${blob.size} bytes`)
              const file = new File([blob], `${currentImageType}_image.jpg`, { type: "image/jpeg" })
              addConsoleLog(`[Camera] File created from Blob: ${file.size} bytes, type: ${file.type}`)
              handleImageChange({ target: { files: [file] } } as any, currentImageType as "front" | "back")
            } else {
              toast({
                title: "Error",
                description: "Could not create image blob.",
                variant: "destructive",
              })
              addConsoleLog("[Camera] Could not create image blob.")
            }
          },
          "image/jpeg",
          0.9
        )
      }
      closeCamera()
    } else {
      toast({
        title: "Camera Error",
        description: "Could not capture image. Please try again.",
        variant: "destructive",
      })
      addConsoleLog("[Camera] Could not capture image.")
    }
  }

  const stopCameraStream = () => {
    addConsoleLog("[Camera] Stopping camera stream.")
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      const tracks = stream.getTracks()
      tracks.forEach((track) => track.stop())
      videoRef.current.srcObject = null
    }
  }

  const closeCamera = () => {
    addConsoleLog("[Camera] Closing camera.")
    setIsCameraOpen(false)
    stopCameraStream()
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>, type: "front" | "back") => {
    const file = e.target.files?.[0]
    if (!file) {
      console.warn("No file selected.")
      addConsoleLog("No file selected.")
      return
    }
    addConsoleLog(`[Image Upload] Selected ${type} image: ${file.name}, size: ${file.size} bytes`)
    const reader = new FileReader()
    reader.onload = (e) => {
      if (type === "front") {
        setFrontImagePreview(e.target?.result as string)
        addConsoleLog("[Image Upload] Set front image preview.")
      } else {
        setBackImagePreview(e.target?.result as string)
        addConsoleLog("[Image Upload] Set back image preview.")
      }
    }
    reader.readAsDataURL(file)
    await uploadImage(file, type)
    e.target.value = ""
  }

  const uploadImage = async (file: File, type: "front" | "back") => {
    addConsoleLog(`[Image Upload] About to upload ${type} image: ${file.name}, size: ${file.size} bytes`)
    const formData = new FormData()
    formData.append("image", file)
    formData.append("type", type)
    try {
      const progressSetter = type === "front" ? setFrontUploadProgress : setBackUploadProgress
      progressSetter(0)
      addConsoleLog(`[Image Upload] Uploading ${type} image started.`)
      const xhr = new XMLHttpRequest()
      xhr.open("POST", "/api/upload-image", true)
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100
          progressSetter(percentComplete)
          addConsoleLog(`[Image Upload] ${type} image upload progress: ${percentComplete.toFixed(2)}%`)
        }
      }
      xhr.onload = () => {
        addConsoleLog(`[Image Upload] XHR onload - Status: ${xhr.status}`)
        if (xhr.status === 200) {
          const { imageUrl } = JSON.parse(xhr.responseText)
          addConsoleLog(`[Image Upload] ${type} image uploaded successfully. Image URL: ${imageUrl}`)
          setFormData((prev) => ({
            ...prev,
            [type === "front" ? "cardFrontPhoto" : "cardBackPhoto"]: imageUrl,
          }))
          toast({
            title: "Success",
            description: `${type === "front" ? "Front" : "Back"} image uploaded successfully`,
          })
        } else {
          console.error(`[Image Upload] Failed to upload ${type} image. Server returned status: ${xhr.status}`)
          toast({
            title: "Error",
            description: `Failed to upload ${type} image. Server returned status: ${xhr.status}`,
            variant: "destructive",
          })
          addConsoleLog(`[Image Upload] Failed to upload ${type} image. Server returned status: ${xhr.status}`)
        }
        progressSetter(0)
        addConsoleLog(`[Image Upload] Uploading ${type} image Ended.`)
      }
      xhr.onerror = () => {
        addConsoleLog(`[Image Upload] XHR onerror`)
        console.error(`[Image Upload] Failed to upload ${type} image. Network error.`)
        toast({
          title: "Error",
          description: `Failed to upload ${type} image. Network error.`,
          variant: "destructive",
        })
        progressSetter(0)
        addConsoleLog(`[Image Upload] Uploading ${type} image Ended.`)
      }
      xhr.onabort = () => {
        addConsoleLog(`[Image Upload] XHR onabort`)
        console.error(`[Image Upload] Upload was aborted.`)
        toast({
          title: "Error",
          description: `Failed to upload ${type} image. Upload was aborted.`,
          variant: "destructive",
        })
        progressSetter(0)
        addConsoleLog(`[Image Upload] Uploading ${type} image Ended.`)
      }
      xhr.send(formData)
    } catch (error) {
      console.error(`Error uploading ${type} image:`, error)
      toast({
        title: "Error",
        description: `Failed to upload ${type} image. An unexpected error occurred.`,
        variant: "destructive",
      })
      addConsoleLog(`[Image Upload] Error uploading ${type} image: ${error instanceof Error ? error.message : "Unknown error"}`)
      const progressSetter = type === "front" ? setFrontUploadProgress : setBackUploadProgress
      progressSetter(0)
      addConsoleLog(`[Image Upload] Uploading ${type} image Ended.`)
    }
  }

  const handleRemoveImage = (type: "front" | "back") => {
    addConsoleLog(`[Image Remove] Removing ${type} image.`)
    if (type === "front") {
      setFrontImagePreview(null)
      setFormData((prev) => ({ ...prev, cardFrontPhoto: "" }))
    } else {
      setBackImagePreview(null)
      setFormData((prev) => ({ ...prev, cardBackPhoto: "" }))
    }
  }

  const handleBackImageModalConfirm = () => {
    setShowBackImageModal(false)
    const backImageInput = document.getElementById("cardBack") as HTMLInputElement
    backImageInput.click()
  }

  const handleBackImageModalClose = () => {
    setShowBackImageModal(false)
  }

  const validateForm = useCallback((): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {}
    if (!formData.cardNo) newErrors.cardNo = "Card number is required"
    if (!formData.salesPerson) newErrors.salesPerson = "Sales person is required"
    if (!formData.date) newErrors.date = "Date is required"
    setErrors(newErrors)
    addConsoleLog(`[Validation] Errors: ${JSON.stringify(newErrors)}`)
    return Object.keys(newErrors).length === 0
  }, [formData, addConsoleLog])

  const defaultOnSubmit = async (submissionData: FormData) => {
    addConsoleLog(`[Submit] Submitting form (create mode): ${JSON.stringify(submissionData)}`)
    const res = await fetch("/api/submit-form", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(submissionData),
    })
    if (!res.ok) {
      const errorData = await res.json()
      addConsoleLog(`[Submit] Error: ${JSON.stringify(errorData)}`)
      throw new Error(errorData.error || "Failed to submit form")
    }
    const responseData = await res.json()
    addConsoleLog(`[Submit] Success: ${JSON.stringify(responseData)}`)
    toast({
      title: "Success",
      description: "Form submitted successfully.",
    })
    router.push(`/submission/${responseData.formId}`)
  }

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) {
      addConsoleLog("[Submit] Submission blocked: already submitting")
      return
    }
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }
    setIsSubmitting(true)
    try {
      const submissionData = {
        ...formData,
        date: new Date(formData.date).toISOString(),
        ...(isEdit && formId ? { id: formId } : {}), // Include formId in edit mode
      }
      if (!submissionData.cardBackPhoto) {
        delete submissionData.cardBackPhoto
      }
      addConsoleLog(`[Submit] Submitting form data: ${JSON.stringify(submissionData)}`)
      if (onSubmit && isEdit) {
        await onSubmit(submissionData)
      } else {
        await defaultOnSubmit(submissionData)
      }
      toast({
        title: "Success",
        description: `Form ${isEdit ? "updated" : "submitted"} successfully.`,
      })
      if (!isEdit) {
        setFormData(defaultFormData)
        setFrontImagePreview(null)
        setBackImagePreview(null)
      }
    } catch (error) {
      console.error(`Error ${isEdit ? "updating" : "submitting"} form:`, error)
      addConsoleLog(`[Submit] Error: ${error instanceof Error ? error.message : "Unknown error"}`)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : `Failed to ${isEdit ? "update" : "submit"} form. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
      addConsoleLog("[Submit] Submission completed")
    }
  }, [formData, isSubmitting, isEdit, formId, onSubmit, defaultOnSubmit, validateForm, addConsoleLog, toast, router])

  const isSubmitDisabled = !formData.cardNo || !formData.salesPerson || !formData.date || isSubmitting

  const toggleConsole = () => {
    setShowConsole((prev) => !prev)
  }

  const wrapperClass = isEdit ? "" : "min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12"

  return (
    <div className={wrapperClass}>
      <Card className="w-full max-w-4xl mx-auto shadow-lg bg-white rounded-xl overflow-hidden border border-gray-200">
        <CardHeader className="bg-gray-100 border-b border-blue-100 p-6">
          <CardTitle className="text-3xl font-bold text-gray-900">
            {isEdit ? "Edit" : "Exhibition"} Form
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="cardNo" className="text-sm font-semibold text-gray-800">
                  Card Number
                </Label>
                <Input
                  id="cardNo"
                  value={formData.cardNo}
                  onChange={(e) => setFormData({ ...formData, cardNo: e.target.value })}
                  className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300"
                  placeholder="Enter card number"
                />
                {errors.cardNo && (
                  <p className="text-sm text-red-600 mt-1">{errors.cardNo}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="salesPerson" className="text-sm font-semibold text-gray-800">
                  NESSCO Sales Person
                </Label>
                <Select
                  value={formData.salesPerson}
                  onValueChange={(value) => setFormData({ ...formData, salesPerson: value })}
                >
                  <SelectTrigger className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300">
                    <SelectValue placeholder="Select sales person" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 rounded-lg">
                    {salesPersons.map((person) => (
                      <SelectItem key={person} value={person} className="hover:bg-blue-50">
                        {person}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.salesPerson && (
                  <p className="text-sm text-red-600 mt-1">{errors.salesPerson}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="date" className="text-sm font-semibold text-gray-800">
                  Date
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-[#b5acda] focus:border-transparent transition-all duration-300"
                />
                {errors.date && (
                  <p className="text-sm text-red-600 mt-1">{errors.date}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="country" className="text-sm font-semibold text-gray-800">
                  Exhibition
                </Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-[#b5acda] focus:border-transparent transition-all duration-300"
                  placeholder="Enter exhibition name"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="cardFront" className="text-sm font-semibold text-gray-800">
                  Card Front Photo
                </Label>
                <div className="relative">
                  <Input
                    id="cardFront"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, "front")}
                    className="hidden"
                  />
                  <Label
                    htmlFor="cardFront"
                    className="flex items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-purple-300 hover:bg-gray-100 transition-all duration-300"
                  >
                    {frontImagePreview ? (
                      <div className="relative w-full h-full">
                        <Image
                          src={frontImagePreview || "/placeholder.svg"}
                          alt="Card Front Preview"
                          layout="fill"
                          objectFit="cover"
                          className="rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage("front")}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-all duration-300"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <span className="mt-2 block text-sm font-medium text-gray-600">
                          Upload or capture front image
                        </span>
                      </div>
                    )}
                  </Label>
                  <Button
                    type="button"
                    onClick={() => openCamera("front")}
                    className="absolute bottom-3 right-3 bg-black text-white rounded-full p-3 hover:bg-gray-100 hover:text-black transition-all duration-300"
                  >
                    <Camera className="w-5 h-5" />
                  </Button>
                </div>
                {frontUploadProgress > 0 && frontUploadProgress < 100 && (
                  <Progress
                    value={frontUploadProgress}
                    className="w-full h-2 mt-3 bg-gray-200 rounded-full"
                  />
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="cardBack" className="text-sm font-semibold text-gray-800">
                  Card Back Photo
                </Label>
                <div className="relative">
                  <Input
                    id="cardBack"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, "back")}
                    className="hidden"
                  />
                  <Label
                    htmlFor="cardBack"
                    className="flex items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-purple-300 hover:bg-gray-100 transition-all duration-300"
                  >
                    {backImagePreview ? (
                      <div className="relative w-full h-full">
                        <Image
                          src={backImagePreview || "/placeholder.svg"}
                          alt="Card Back Preview"
                          layout="fill"
                          objectFit="cover"
                          className="rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage("back")}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-all duration-300"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <span className="mt-2 block text-sm font-medium text-gray-600">
                          Upload or capture back image
                        </span>
                      </div>
                    )}
                  </Label>
                  <Button
                    type="button"
                    onClick={() => openCamera("back")}
                    className="absolute bottom-3 right-3 bg-black text-white rounded-full p-3 hover:bg-gray-200 hover:text-black transition-all duration-300"
                  >
                    <Camera className="w-5 h-5" />
                  </Button>
                </div>
                {backUploadProgress > 0 && backUploadProgress < 100 && (
                  <Progress
                    value={backUploadProgress}
                    className="w-full h-2 mt-3 bg-gray-200 rounded-full"
                  />
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-semibold text-gray-800">
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-[#b5acda] focus:border-transparent transition-all duration-300"
                placeholder="Enter additional details"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="leadStatus" className="text-sm font-semibold text-gray-800">
                  Lead Status
                </Label>
                <Select
                  value={formData.leadStatus}
                  onValueChange={(value) => setFormData({ ...formData, leadStatus: value })}
                >
                  <SelectTrigger className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300">
                    <SelectValue placeholder="Select lead status" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 rounded-lg">
                    {leadStatuses.map((status) => (
                      <SelectItem key={status} value={status} className="hover:bg-blue-50">
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dealStatus" className="text-sm font-semibold text-gray-800">
                  Deal Status
                </Label>
                <Select
                  value={formData.dealStatus}
                  onValueChange={(value) => setFormData({ ...formData, dealStatus: value })}
                >
                  <SelectTrigger className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300">
                    <SelectValue placeholder="Select deal status" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 rounded-lg">
                    {dealStatuses.map((status) => (
                      <SelectItem key={status} value={status} className="hover:bg-blue-50">
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Switch
                id="meeting"
                checked={formData.meetingAfterExhibition}
                onCheckedChange={(checked) => setFormData({ ...formData, meetingAfterExhibition: checked })}
                className="data-[state=checked]:bg-[#483d73]"
              />
              <Label htmlFor="meeting" className="text-sm font-semibold text-gray-800">
                Meeting After Exhibition
              </Label>
            </div>

            <div className="space-y-4">
              <Label className="text-sm font-semibold text-gray-800">
                Industry Category
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {industryCategories.map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={category}
                      checked={formData.industryCategories.split(",").includes(category)}
                      onCheckedChange={(checked) => {
                        const currentCategories = formData.industryCategories
                          ? formData.industryCategories.split(",").filter(Boolean)
                          : []
                        const updatedCategories = checked
                          ? [...currentCategories, category]
                          : currentCategories.filter((c) => c !== category)
                        setFormData({
                          ...formData,
                          industryCategories: updatedCategories.join(","),
                        })
                      }}
                      className="border-gray-300 data-[state=checked]:bg-[#483d73] data-[state=checked]:border-[#483d73]"
                    />
                    <Label htmlFor={category} className="text-sm text-gray-700">
                      {category}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="bg-gray-100 border-t border-blue-100 p-6">
          <Button
            type="submit"
            onClick={handleSubmit}
            className="w-full bg-[#483d73] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#5a5570] transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={isSubmitDisabled}
          >
            {isSubmitting ? "Submitting..." : isEdit ? "Save Changes" : "Submit Form"}
          </Button>
        </CardFooter>
      </Card>

      {showConsole && (
        <div
          className="fixed bottom-0 left-0 w-full h-64 bg-gray-900 text-white overflow-y-auto p-4 z-50"
        >
          <h3 className="text-lg font-semibold mb-2">Console Output</h3>
          {consoleData.map((log, index) => (
            <div key={index} className="text-sm">{log}</div>
          ))}
        </div>
      )}

      <PopupModal
        isOpen={showBackImageModal}
        onClose={handleBackImageModalClose}
        onConfirm={handleBackImageModalConfirm}
        title="Upload Back Image"
        description="Do you want to upload the back image of the business card?"
      />

      {isCameraOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-xl shadow-2xl overflow-hidden max-w-lg w-full">
            <div className="p-4 bg-gray-200 border-b border-blue-100 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Capture Photo</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeCamera}
                className="p-2 hover:bg-gray-100"
              >
                <X className="w-5 h-5 text-gray-600" />
              </Button>
            </div>
            <div className="relative bg-black">
              <video
                ref={videoRef}
                className="w-full h-auto"
                autoPlay
                playsInline
                muted
              />
              <canvas ref={canvasRef} className="hidden" />
            </div>
            <div className="p-4 flex justify-between items-center bg-gray-200">
              <Button
                variant="outline"
                onClick={toggleCamera}
                className="flex items-center gap-2 border-gray-300 hover:bg-gray-100"
              >
                <RefreshCw className="w-4 h-4" />
                Switch Camera
              </Button>
              <Button
                onClick={captureImage}
                className="bg-[#483d73] hover:bg-[#5a5570] text-white"
              >
                Capture Photo
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}