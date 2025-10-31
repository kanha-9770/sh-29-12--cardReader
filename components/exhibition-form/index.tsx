"use client"
import React, { useState, useCallback, useEffect, useRef, useMemo } from "react"
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
import { ToastContainer, toast as toastify } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
interface ExhibitionFormProps {
  initialData?: Partial<FormData>
  onSubmit?: (data: FormData) => Promise<void> | void
  isEdit?: boolean
  formId?: string
  // new prop to disable specific fields (AdminDashboard will pass ["cardNo","date"])
  disabledFields?: string[]
}
export function ExhibitionForm({
  initialData = {},
  onSubmit,
  isEdit = false,
  formId,
  disabledFields = [],
}: ExhibitionFormProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  // LIMIT constant
  const LIMIT = 15
  // submission count state fetched from server
  const [submissionCount, setSubmissionCount] = useState<number>(0)
  const [isLoadingCount, setIsLoadingCount] = useState<boolean>(true)
  // when true, blocking modal is shown and the form is disabled for create mode
  const [showLimitModal, setShowLimitModal] = useState<boolean>(false)
  const [limitReached, setLimitReached] = useState<boolean>(false)
  // default form data
  const defaultFormData: FormData = {
    cardNo: (searchParams?.get("cardNo") as string) || "",
    salesPerson: (searchParams?.get("salesPerson") as string) || "",
    date: new Date().toISOString().split("T")[0],
    country: (searchParams?.get("exhibition") as string) || "LABEL EXPO SPAIN 2025",
    cardFrontPhoto: "",
    cardBackPhoto: "",
    leadStatus: (searchParams?.get("leadStatus") as string) || "",
    dealStatus: (searchParams?.get("dealStatus") as string) || "",
    meetingAfterExhibition:
      (searchParams?.get("meetingAfterExhibition")?.toLowerCase() === "true") || false,
    industryCategories: (searchParams?.get("industryCategories") as string) || "",
    description: "",
    extractedData: null,
    mergedData: null,
    status: "PENDING",
    extractionStatus: "PENDING",
    zohoStatus: "PENDING",
    userId: undefined,
    user: undefined,
  }
  // Merge provided initialData with defaults
  const [formData, setFormData] = useState<FormData>({ ...defaultFormData, ...initialData })
  const [frontImagePreview, setFrontImagePreview] = useState<string | null>(initialData?.cardFrontPhoto || null)
  const [backImagePreview, setBackImagePreview] = useState<string | null>(initialData?.cardBackPhoto || null)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [showBackImageModal, setShowBackImageModal] = useState<boolean>(false)
  const [frontUploadProgress, setFrontUploadProgress] = useState<number>(0)
  const [backUploadProgress, setBackUploadProgress] = useState<number>(0)
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false)
  const [currentImageType, setCurrentImageType] = useState<"front" | "back" | null>(null)
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment")
  const [consoleData, setConsoleData] = useState<string[]>([])
  const [showConsole, setShowConsole] = useState<boolean>(false)
  // Capture initial data for change detection
  const initialRef = useRef<FormData>({ ...defaultFormData, ...initialData });
  // Detect changes for edit mode
  const hasChanges = useMemo(() => {
    return JSON.stringify(formData) !== JSON.stringify(initialRef.current);
  }, [formData]);
  // helper to respect disabledFields OR edit-mode disabling
  const fieldDisabled = (fieldName: string) => {
    return disabledFields.includes(fieldName)
  }
  const addConsoleLog = useCallback((message: string) => {
    setConsoleData((prev) => [...prev, `${new Date().toISOString()} - ${message}`])
  }, [])
  // Fetch submission count on mount
  useEffect(() => {
    let mounted = true
    const fetchSubmissionCount = async () => {
      try {
        setIsLoadingCount(true)
        const res = await fetch("/api/form-count", {
          method: "GET",
          credentials: "include", // assumes your auth uses cookies/sessions; adapt if you use tokens
        });
        if (res.ok) {
          const data = await res.json();
          const count = typeof data.count === "number" ? data.count : Number(data.count || 0)
          if (mounted) {
            setSubmissionCount(count)
            // Only block when creating (not editing)
            if (!isEdit && count >= LIMIT) {
              setLimitReached(true)
              setShowLimitModal(true)
            } else {
              setLimitReached(false)
            }
          }
          toastify.info(`Thank You for submiting your limit reaches ${count}`)
        } else {
          console.error("Failed to fetch submission count")
        }
      } catch (error) {
        console.error("Error fetching submission count:", error)
        toastify.error("Could not load submission limit. Please refresh.")
      } finally {
        if (mounted) setIsLoadingCount(false)
      }
    };
    fetchSubmissionCount();
    return () => { mounted = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  // computed boolean for limit
  const isBlocked = !isEdit && limitReached
  // Show modal if limit reached; modal is blocking and close is disabled (user must click Buy Plan)
  // We already set showLimitModal during fetch; here we keep effect to ensure consistent behavior if count changes later.
  useEffect(() => {
    if (!isEdit && submissionCount >= LIMIT) {
      setLimitReached(true)
      setShowLimitModal(true)
    }
  }, [submissionCount, isEdit])
  // keep existing initial previews behavior
  useEffect(() => {
    if (initialData?.cardFrontPhoto) {
      setFrontImagePreview(initialData.cardFrontPhoto)
    }
    if (initialData?.cardBackPhoto) {
      setBackImagePreview(initialData.cardBackPhoto)
    }
    if (initialData?.date && (initialData.date as string).includes("T")) {
      setFormData((prev) => ({ ...prev, date: (initialData.date as string).split("T")[0] || "" }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData])
  // Camera functions (do not open camera if blocked)
  const openCamera = useCallback((type: "front" | "back") => {
    if (isBlocked) {
      setShowLimitModal(true)
      return
    }
    addConsoleLog(`[Camera] Opening camera for ${type}`)
    setCurrentImageType(type)
    setIsCameraOpen(true)
    startCameraStream()
  }, [addConsoleLog, isBlocked])
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
        addConsoleLog(`[Camera] Requesting user media: ${JSON.stringify(constraints)}`)
        const stream = await navigator.mediaDevices.getUserMedia(constraints)
        videoRef.current.srcObject = stream
        await videoRef.current.play().catch((err) => {
          console.error("Error playing video:", err)
          addConsoleLog(`[Camera] Error playing video: ${err}`)
        })
        addConsoleLog("[Camera] Camera stream started.")
      }
    } catch (err) {
      console.error("Error accessing camera:", err)
      toastify.error("Failed to access camera. Check permissions or try a different browser.")
      addConsoleLog(`[Camera] Error accessing camera: ${err instanceof Error ? err.message : err}`)
      setIsCameraOpen(false)
    }
  }
  useEffect(() => {
    if (isCameraOpen) {
      startCameraStream()
    }
    return () => {
      if (isCameraOpen) stopCameraStream()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facingMode, isCameraOpen])
  const toggleCamera = () => {
    if (isBlocked) return
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"))
    addConsoleLog("[Camera] Toggling camera facing mode")
  }
  const captureImage = () => {
    if (isBlocked) {
      setShowLimitModal(true)
      return
    }
    addConsoleLog("[Camera] Capturing image.")
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
              addConsoleLog(`[Camera] File created from blob: ${file.name}, size: ${file.size}`)
              // reuse upload flow
              handleImageChange({ target: { files: [file] } } as any, currentImageType as "front" | "back")
            } else {
              toastify.error("Could not create image blob.")
              addConsoleLog("[Camera] Could not create blob")
            }
          },
          "image/jpeg",
          0.9
        )
      }
      closeCamera()
    } else {
      toastify.error("Could not capture image. Try again.")
      addConsoleLog("[Camera] Capture failed - no video/canvas")
    }
  }
  const stopCameraStream = () => {
    addConsoleLog("[Camera] Stopping camera stream.")
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      const tracks = stream.getTracks()
      tracks.forEach((trk) => trk.stop())
      videoRef.current.srcObject = null
    }
  }
  const closeCamera = () => {
    addConsoleLog("[Camera] Closing camera.")
    setIsCameraOpen(false)
    stopCameraStream()
  }
  // Image change/upload. Block upload if blocked.
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>, type: "front" | "back") => {
    if (isBlocked) {
      setShowLimitModal(true)
      return
    }
    const file = e.target.files?.[0]
    if (!file) {
      addConsoleLog("[Image] No file selected.")
      return
    }
    addConsoleLog(`[Image] Selected ${type} file: ${file.name}, ${file.size} bytes`)
    // Show a local preview immediately
    const reader = new FileReader()
    reader.onload = (ev) => {
      if (type === "front") {
        setFrontImagePreview(ev.target?.result as string)
        addConsoleLog("[Image] Set front preview")
      } else {
        setBackImagePreview(ev.target?.result as string)
        addConsoleLog("[Image] Set back preview")
      }
    }
    reader.readAsDataURL(file)
    // Upload
    await uploadImage(file, type)
    // reset input value if needed by caller
    if ((e.target as HTMLInputElement)) (e.target as HTMLInputElement).value = ""
  }
  const uploadImage = async (file: File, type: "front" | "back") => {
    addConsoleLog(`[Upload] Uploading ${type} image: ${file.name}`)
    const fd = new FormData()
    fd.append("image", file)
    fd.append("type", type)
    try {
      const progressSetter = type === "front" ? setFrontUploadProgress : setBackUploadProgress
      progressSetter(0)
      const xhr = new XMLHttpRequest()
      xhr.open("POST", "/api/upload-image", true)
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = (event.loaded / event.total) * 100
          progressSetter(percent)
          addConsoleLog(`[Upload] ${type} progress: ${percent.toFixed(2)}%`)
        }
      }
      xhr.onload = () => {
        addConsoleLog(`[Upload] ${type} onload - status ${xhr.status}`)
        if (xhr.status === 200) {
          try {
            const resp = JSON.parse(xhr.responseText)
            const imageUrl = resp.imageUrl || resp.url || ""
            setFormData((prev) => ({
              ...prev,
              [type === "front" ? "cardFrontPhoto" : "cardBackPhoto"]: imageUrl,
            }))
            if (type === "front") setFrontImagePreview(imageUrl)
            else setBackImagePreview(imageUrl)
          } catch (err) {
            console.error("Upload response parse error", err)
            toastify.error(`Failed to parse upload response for ${type}`)
            addConsoleLog(`[Upload] ${type} parse error: ${err instanceof Error ? err.message : err}`)
          }
        } else {
          console.error(`[Upload] Server returned ${xhr.status}`)
          toastify.error(`Upload failed with status ${xhr.status}`)
          addConsoleLog(`[Upload] ${type} failed status ${xhr.status}`)
        }
        progressSetter(0)
        addConsoleLog(`[Upload] ${type} upload finished`)
      }
      xhr.onerror = () => {
        console.error("[Upload] XHR onerror")
        toastify.error(`Network error while uploading ${type}`)
        const progressSetter = type === "front" ? setFrontUploadProgress : setBackUploadProgress
        progressSetter(0)
        addConsoleLog(`[Upload] ${type} network error`)
      }
      xhr.send(fd)
    } catch (error) {
      console.error(`[Upload] Exception uploading ${type}:`, error)
      toastify.error(`Unexpected error while uploading ${type}`)
      const progressSetter = type === "front" ? setFrontUploadProgress : setBackUploadProgress
      progressSetter(0)
      addConsoleLog(`[Upload] ${type} exception: ${error instanceof Error ? error.message : error}`)
    }
  }
  const handleRemoveImage = (type: "front" | "back") => {
    addConsoleLog(`[Image] Removing ${type}`)
    if (type === "front") {
      setFrontImagePreview(null)
      setFormData((prev) => ({ ...prev, cardFrontPhoto: "" }))
    } else {
      setBackImagePreview(null)
      setFormData((prev) => ({ ...prev, cardBackPhoto: "" }))
    }
  }
  const handleBackImageModalConfirm = () => {
    if (isBlocked) {
      setShowLimitModal(true)
      return
    }
    setShowBackImageModal(false)
    const backImageInput = document.getElementById("cardBack") as HTMLInputElement
    backImageInput?.click()
  }
  const handleBackImageModalClose = () => setShowBackImageModal(false)
  // Validation
  const validateForm = useCallback((): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {}
    if (!formData.cardNo) newErrors.cardNo = "Card number is required"
    if (!formData.salesPerson) newErrors.salesPerson = "Sales person is required"
    if (!formData.date) newErrors.date = "Date is required"
    setErrors(newErrors)
    addConsoleLog(`[Validation] errors: ${JSON.stringify(newErrors)}`)
    return Object.keys(newErrors).length === 0
  }, [formData, addConsoleLog])
  // default submit for creation
  const defaultOnSubmit = async (submissionData: FormData) => {
    addConsoleLog(`[Submit] Default submit invoked: ${JSON.stringify(submissionData)}`)
    const res = await fetch("/api/submit-form", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(submissionData),
    })
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ error: "Unknown" }))
      addConsoleLog(`[Submit] Default submit error: ${JSON.stringify(errorData)}`)
      throw new Error(errorData?.error || "Failed to submit form")
    }
    const data = await res.json()
    addConsoleLog(`[Submit] Default submit success: ${JSON.stringify(data)}`)
    toastify.success("Form submitted successfully.")
    // navigate to submission view if provided
    if (data?.formId) router.push(`/submission/${data.formId}`)
  }
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) {
      addConsoleLog("[Submit] Already submitting - blocked")
      return
    }
    // STRICT BLOCK: if blocked (limit reached) do not proceed; show modal
    if (isBlocked) {
      setShowLimitModal(true)
      toastify.error(`You have reached the free submission limit (${LIMIT}).`)
      return
    }
    if (!validateForm()) {
      toastify.error("Please fill in required fields.")
      return
    }
    setIsSubmitting(true)
    try {
      const submissionData: FormData = {
        ...formData,
        date: new Date(formData.date).toISOString(),
        ...(isEdit && formId ? { id: formId } : {}),
      } as FormData
      if (!submissionData.cardBackPhoto) delete submissionData.cardBackPhoto
      addConsoleLog(`[Submit] Prepared submission data: ${JSON.stringify(submissionData)}`)
      if (onSubmit && isEdit) {
        await onSubmit(submissionData)
      } else {
        await defaultOnSubmit(submissionData)
      }
      toastify.success(`Form ${isEdit ? "updated" : "submitted"} successfully.`)
      // Increase local count after successful submission (helps immediate UX)
      if (!isEdit) {
        setSubmissionCount((prev) => prev + 1)
      }
      if (!isEdit) {
        setFormData(defaultFormData)
        setFrontImagePreview(null)
        setBackImagePreview(null)
      }
    } catch (error) {
      console.error("Submit error:", error)
      addConsoleLog(`[Submit] Error: ${error instanceof Error ? error.message : error}`)
      toastify.error(error instanceof Error ? error.message : `Failed to ${isEdit ? "update" : "submit"} form.`)
    } finally {
      setIsSubmitting(false)
      addConsoleLog("[Submit] Submission finished")
    }
  }, [formData, isSubmitting, isEdit, formId, onSubmit, defaultOnSubmit, validateForm, addConsoleLog, router, defaultFormData, isBlocked])
  const isSubmitDisabled = isSubmitting ||
    (!isEdit
      ? (!formData.cardNo || !formData.salesPerson || !formData.date) || isBlocked
      : !hasChanges
    );
  const toggleConsole = () => setShowConsole((prev) => !prev)
  const wrapperClass = isEdit ? "" : "min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12"
  // Render
  return (
    <div className={wrapperClass}>
      <Card className="w-full max-w-4xl mx-auto shadow-lg bg-white rounded-xl overflow-hidden border border-gray-200" aria-hidden={isBlocked}>
        <CardHeader className="bg-gray-100 border-b border-blue-100 p-6">
          <CardTitle className="text-3xl font-bold text-gray-900">
            {isEdit ? "Edit" : "Exhibition"} Form
          </CardTitle>
          {!isEdit && (
            <p className="text-sm text-gray-600 mt-2" aria-live="polite">
              Submissions left: {isLoadingCount ? "Loading..." : Math.max(0, LIMIT - submissionCount)}
            </p>
          )}
        </CardHeader>
        <CardContent className={`p-8 ${isBlocked ? "pointer-events-none select-none" : ""}`}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="cardNo" className="text-sm font-medium text-gray-800">Card Number</Label>
                <Input
                  id="cardNo"
                  value={formData.cardNo}
                  onChange={(e) => setFormData({ ...formData, cardNo: e.target.value })}
                  className={`w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300 ${fieldDisabled("cardNo") || isBlocked ? "opacity-70 cursor-not-allowed" : ""}`}
                  placeholder="Enter card number"
                  disabled={fieldDisabled("cardNo") || isBlocked}
                />
                {errors.cardNo && <p className="text-sm text-red-600 mt-1">{errors.cardNo}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="salesPerson" className="text-sm font-medium text-gray-800">NESSCO Sales Person</Label>
                <Select
                  value={formData.salesPerson}
                  onValueChange={(value) => setFormData({ ...formData, salesPerson: value })}
                  disabled={isBlocked}
                >
                  <SelectTrigger className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed">
                    <SelectValue placeholder="Select sales person" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 rounded-lg">
                    {salesPersons.map((person) => (
                      <SelectItem key={person} value={person} className="hover:bg-blue-50">{person}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.salesPerson && <p className="text-sm text-red-600 mt-1">{errors.salesPerson}</p>}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="date" className="text-sm font-medium text-gray-800">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className={`w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-[#b5acda] focus:border-transparent transition-all duration-300 ${fieldDisabled("date") || isBlocked ? "opacity-70 cursor-not-allowed" : ""}`}
                  disabled={fieldDisabled("date") || isBlocked}
                />
                {errors.date && <p className="text-sm text-red-600 mt-1">{errors.date}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="country" className="text-sm font-medium text-gray-800">Exhibition</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className={`w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-[#b5acda] focus:border-transparent transition-all duration-300 ${isBlocked ? "opacity-70 cursor-not-allowed" : ""}`}
                  placeholder="Enter exhibition name"
                  disabled={isBlocked}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="cardFront" className="text-sm font-medium text-gray-800">Card Front Photo</Label>
                <div className="relative">
                  <Input id="cardFront" type="file" accept="image/*" onChange={(e) => handleImageChange(e, "front")} className="hidden" disabled={isBlocked} />
                  <Label htmlFor="cardFront" className={`flex items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-purple-300 hover:bg-gray-100 transition-all duration-300 ${isBlocked ? "opacity-70 cursor-not-allowed" : ""}`}>
                    {frontImagePreview ? (
                      <div className="relative w-full h-full">
                        <Image src={frontImagePreview || "/placeholder.svg"} alt="Card Front Preview" fill style={{ objectFit: "cover" }} className="rounded-lg" />
                        <button type="button" onClick={() => handleRemoveImage("front")} className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-all duration-300" disabled={isBlocked}>
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <span className="mt-2 block text-sm font-medium text-gray-600">Upload or capture front image</span>
                      </div>
                    )}
                  </Label>
                  <Button type="button" onClick={() => openCamera("front")} className="absolute bottom-3 right-3 bg-black text-white rounded-full p-3 hover:bg-gray-100 hover:text-black transition-all duration-300" disabled={isBlocked}>
                    <Camera className="w-5 h-5" />
                  </Button>
                </div>
                {frontUploadProgress > 0 && frontUploadProgress < 100 && <Progress value={frontUploadProgress} className="w-full h-2 mt-3 bg-gray-200 rounded-full" />}
              </div>
              <div className="space-y-2">
                <Label htmlFor="cardBack" className="text-sm font-medium text-gray-800">Card Back Photo</Label>
                <div className="relative">
                  <Input id="cardBack" type="file" accept="image/*" onChange={(e) => handleImageChange(e, "back")} className="hidden" disabled={isBlocked} />
                  <Label htmlFor="cardBack" className={`flex items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-purple-300 hover:bg-gray-100 transition-all duration-300 ${isBlocked ? "opacity-70 cursor-not-allowed" : ""}`}>
                    {backImagePreview ? (
                      <div className="relative w-full h-full">
                        <Image src={backImagePreview || "/placeholder.svg"} alt="Card Back Preview" fill style={{ objectFit: "cover" }} className="rounded-lg" />
                        <button type="button" onClick={() => handleRemoveImage("back")} className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-all duration-300" disabled={isBlocked}>
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <span className="mt-2 block text-sm font-medium text-gray-600">Upload or capture back image</span>
                      </div>
                    )}
                  </Label>
                  <Button type="button" onClick={() => setShowBackImageModal(true)} className="absolute bottom-3 right-3 bg-black text-white rounded-full p-3 hover:bg-gray-200 hover:text-black transition-all duration-300" disabled={isBlocked}>
                    <Camera className="w-5 h-5" />
                  </Button>
                </div>
                {backUploadProgress > 0 && backUploadProgress < 100 && <Progress value={backUploadProgress} className="w-full h-2 mt-3 bg-gray-200 rounded-full" />}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium text-gray-800">Description</Label>
              <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={4} className={`w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-[#b5acda] focus:border-transparent transition-all duration-300 ${isBlocked ? "opacity-70 cursor-not-allowed" : ""}`} placeholder="Enter additional details" disabled={isBlocked} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="leadStatus" className="text-sm font-medium text-gray-800">Lead Status</Label>
                <Select value={formData.leadStatus} onValueChange={(value) => setFormData({ ...formData, leadStatus: value })} disabled={isBlocked}>
                  <SelectTrigger className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"><SelectValue placeholder="Select lead status" /></SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 rounded-lg">
                    {leadStatuses.map((status) => <SelectItem key={status} value={status} className="hover:bg-blue-50">{status}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dealStatus" className="text-sm font-medium text-gray-800">Deal Status</Label>
                <Select value={formData.dealStatus} onValueChange={(value) => setFormData({ ...formData, dealStatus: value })} disabled={isBlocked}>
                  <SelectTrigger className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"><SelectValue placeholder="Select deal status" /></SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 rounded-lg">
                    {dealStatuses.map((status) => <SelectItem key={status} value={status} className="hover:bg-blue-50">{status}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Switch id="meeting" checked={formData.meetingAfterExhibition} onCheckedChange={(checked) => setFormData({ ...formData, meetingAfterExhibition: checked })} className="data-[state=checked]:bg-[#483d73]" disabled={isBlocked} />
              <Label htmlFor="meeting" className="text-sm font-medium text-gray-800">Meeting After Exhibition</Label>
            </div>
            <div className="space-y-4">
              <Label className="text-sm font-medium text-gray-800">Industry Category</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {industryCategories.map((category) => {
                  const checked = formData.industryCategories ? formData.industryCategories.split(",").includes(category) : false
                  return (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={category}
                        checked={checked}
                        onCheckedChange={(checked) => {
                          const currentCategories = formData.industryCategories ? formData.industryCategories.split(",").filter(Boolean) : []
                          const updatedCategories = checked ? [...currentCategories, category] : currentCategories.filter((c) => c !== category)
                          setFormData({ ...formData, industryCategories: updatedCategories.join(",") })
                        }}
                        className="border-gray-300 data-[state=checked]:bg-[#483d73] data-[state=checked]:border-[#483d73]"
                        disabled={isBlocked}
                      />
                      <Label htmlFor={category} className="text-sm text-gray-700">{category}</Label>
                    </div>
                  )
                })}
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="bg-gray-100 border-t border-blue-100 p-6">
          <Button type="button" onClick={handleSubmit} className="w-full bg-[#483d73] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#5a5570] transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed" disabled={isSubmitDisabled || isBlocked}>
            {isSubmitting ? "Submitting..." : isEdit ? "Save Changes" : "Submit Form"}
          </Button>
        </CardFooter>
      </Card>
      {showConsole && (
        <div className="fixed bottom-0 left-0 w-full h-64 bg-gray-900 text-white overflow-y-auto p-4 z-50">
          <h3 className="text-lg font-semibold mb-2">Console Output</h3>
          {consoleData.map((log, index) => <div key={index} className="text-sm">{log}</div>)}
        </div>
      )}
      <PopupModal
        isOpen={showBackImageModal}
        onClose={handleBackImageModalClose}
        onConfirm={handleBackImageModalConfirm}
        title="Upload Back Image"
        description="Do you want to upload the back image of the business card?"
      />
      {/* Blocking limit modal: cannot close via onClose; only Buy Plan */}
      <PopupModal
        isOpen={showLimitModal}
        // disable closing by providing a no-op onClose handler so the modal can't be dismissed
        onClose={() => {}}
        onConfirm={() => {
          // user clicked Buy Plan
          setShowLimitModal(false)
          router.push("/pricing")
        }}
        title="Limit Reached"
        description="Your submission limit has been reached. Please buy a plan to submit more."
        // Optionally you can add custom button text via the modal's implementation if supported
      />
      {isCameraOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-xl shadow-2xl overflow-hidden max-w-lg w-full">
            <div className="p-4 bg-gray-200 border-b border-blue-100 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Capture Photo</h3>
              <Button variant="ghost" size="sm" onClick={closeCamera} className="p-2 hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-600" />
              </Button>
            </div>
            <div className="relative bg-black">
              <video ref={videoRef} className="w-full h-auto" autoPlay playsInline muted />
              <canvas ref={canvasRef} className="hidden" />
            </div>
            <div className="p-4 flex justify-between items-center bg-gray-200">
              <Button variant="outline" onClick={toggleCamera} className="flex items-center gap-2 border-gray-300 hover:bg-gray-100">
                <RefreshCw className="w-4 h-4" />
                Switch Camera
              </Button>
              <div className="flex gap-2">
                <Button onClick={captureImage} className="bg-[#483d73] hover:bg-[#5a5570] text-white">Capture Photo</Button>
                <Button variant="ghost" onClick={closeCamera}>Close</Button>
              </div>
            </div>
          </div>
        </div>
      )}
      <ToastContainer position="top-right" autoClose={2500} />
    </div>
  )
}
export default ExhibitionForm