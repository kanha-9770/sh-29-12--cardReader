// "use client"
// import React, { useState, useCallback, useEffect, useRef, useMemo } from "react"
// import { Button } from "@/components/ui/button"
// import {
//   Card,
//   CardContent,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"
// import { Switch } from "@/components/ui/switch"
// import { Checkbox } from "@/components/ui/checkbox"
// import Image from "next/image"
// import { Upload, X, Camera, RefreshCw } from "lucide-react"
// import { Progress } from "@/components/ui/progress"
// import {
//   salesPersons,
//   leadStatuses,
//   dealStatuses,
//   industryCategories,
//   type FormData,
// } from "@/types/form"
// import { PopupModal } from "@/components/popup-modal"
// import { useRouter, useSearchParams } from "next/navigation"
// import { ToastContainer, toast as toastify } from "react-toastify"
// import "react-toastify/dist/ReactToastify.css"
// interface ExhibitionFormProps {
//   initialData?: Partial<FormData>
//   onSubmit?: (data: FormData) => Promise<void> | void
//   isEdit?: boolean
//   formId?: string
//   // new prop to disable specific fields (AdminDashboard will pass ["cardNo","date"])
//   disabledFields?: string[]
// }
// export function ExhibitionForm({
//   initialData = {},
//   onSubmit,
//   isEdit = false,
//   formId,
//   disabledFields = [],
// }: ExhibitionFormProps) {
//   const searchParams = useSearchParams()
//   const router = useRouter()
//   // LIMIT constant
//   const LIMIT = 15
//   // submission count state fetched from server
//   const [submissionCount, setSubmissionCount] = useState<number>(0)
//   const [isLoadingCount, setIsLoadingCount] = useState<boolean>(true)
//   // when true, blocking modal is shown and the form is disabled for create mode
//   const [showLimitModal, setShowLimitModal] = useState<boolean>(false)
//   const [limitReached, setLimitReached] = useState<boolean>(false)
//   // default form data
//   const defaultFormData: FormData = {
//     cardNo: (searchParams?.get("cardNo") as string) || "",
//     salesPerson: (searchParams?.get("salesPerson") as string) || "",
//     date: new Date().toISOString().split("T")[0],
//     country: (searchParams?.get("exhibition") as string) || "LABEL EXPO SPAIN 2025",
//     cardFrontPhoto: "",
//     cardBackPhoto: "",
//     leadStatus: (searchParams?.get("leadStatus") as string) || "",
//     dealStatus: (searchParams?.get("dealStatus") as string) || "",
//     meetingAfterExhibition: (searchParams?.get("meetingAfterExhibition")?.toLowerCase() === "true") || false,
//     industryCategories: (searchParams?.get("industryCategories") as string) || "",
//     description: "",
//     extractedData: null,
//     mergedData: null,
//     status: "PENDING",
//     extractionStatus: "PENDING",
//     zohoStatus: "PENDING",
//     userId: undefined,
//     user: undefined,
//     createdAt: undefined,
//     updatedAt: undefined
//   }
//   // Merge provided initialData with defaults
//   const [formData, setFormData] = useState<FormData>({ ...defaultFormData, ...initialData })
//   const [frontImagePreview, setFrontImagePreview] = useState<string | null>(initialData?.cardFrontPhoto || null)
//   const [backImagePreview, setBackImagePreview] = useState<string | null>(initialData?.cardBackPhoto || null)
//   const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
//   const [showBackImageModal, setShowBackImageModal] = useState<boolean>(false)
//   const [frontUploadProgress, setFrontUploadProgress] = useState<number>(0)
//   const [backUploadProgress, setBackUploadProgress] = useState<number>(0)
//   const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})
//   const videoRef = useRef<HTMLVideoElement>(null)
//   const canvasRef = useRef<HTMLCanvasElement>(null)
//   const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false)
//   const [currentImageType, setCurrentImageType] = useState<"front" | "back" | null>(null)
//   const [facingMode, setFacingMode] = useState<"user" | "environment">("environment")
//   const [consoleData, setConsoleData] = useState<string[]>([])
//   const [showConsole, setShowConsole] = useState<boolean>(false)
//   // Capture initial data for change detection
//   const initialRef = useRef<FormData>({ ...defaultFormData, ...initialData });
//   // Detect changes for edit mode
//   const hasChanges = useMemo(() => {
//     return JSON.stringify(formData) !== JSON.stringify(initialRef.current);
//   }, [formData]);
//   // helper to respect disabledFields OR edit-mode disabling
//   const fieldDisabled = (fieldName: string) => {
//     return disabledFields.includes(fieldName)
//   }
//   const addConsoleLog = useCallback((message: string) => {
//     setConsoleData((prev) => [...prev, `${new Date().toISOString()} - ${message}`])
//   }, [])
//   // Fetch submission count on mount
//   useEffect(() => {
//     let mounted = true
//     const fetchSubmissionCount = async () => {
//       try {
//         setIsLoadingCount(true)
//         const res = await fetch("/api/form-count", {
//           method: "GET",
//           credentials: "include", // assumes your auth uses cookies/sessions; adapt if you use tokens
//         });
//         if (res.ok) {
//           const data = await res.json();
//           const count = typeof data.count === "number" ? data.count : Number(data.count || 0)
//           if (mounted) {
//             setSubmissionCount(count)
//             // Only block when creating (not editing)
//             if (!isEdit && count >= LIMIT) {
//               setLimitReached(true)
//               setShowLimitModal(true)
//             } else {
//               setLimitReached(false)
//             }
//           }
//         } else {
//           console.error("Failed to fetch submission count")
//         }
//       } catch (error) {
//         console.error("Error fetching submission count:", error)
//         toastify.error("Could not load submission limit. Please refresh.")
//       } finally {
//         if (mounted) setIsLoadingCount(false)
//       }
//     };
//     fetchSubmissionCount();
//     return () => { mounted = false }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [])
//   // computed boolean for limit
//   const isBlocked = !isEdit && limitReached
//   // Show modal if limit reached; modal is blocking and close is disabled (user must click Buy Plan)
//   // We already set showLimitModal during fetch; here we keep effect to ensure consistent behavior if count changes later.
//   useEffect(() => {
//     if (!isEdit && submissionCount >= LIMIT) {
//       setLimitReached(true)
//       setShowLimitModal(true)
//     }
//   }, [submissionCount, isEdit])
//   // keep existing initial previews behavior
//   useEffect(() => {
//     if (initialData?.cardFrontPhoto) {
//       setFrontImagePreview(initialData.cardFrontPhoto)
//     }
//     if (initialData?.cardBackPhoto) {
//       setBackImagePreview(initialData.cardBackPhoto)
//     }
//     if (initialData?.date && (initialData.date as string).includes("T")) {
//       setFormData((prev) => ({ ...prev, date: (initialData.date as string).split("T")[0] || "" }))
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [initialData])
//   // Camera functions (do not open camera if blocked)
//   const openCamera = useCallback((type: "front" | "back") => {
//     if (isBlocked) {
//       setShowLimitModal(true)
//       return
//     }
//     addConsoleLog(`[Camera] Opening camera for ${type}`)
//     setCurrentImageType(type)
//     setIsCameraOpen(true)
//     startCameraStream()
//   }, [addConsoleLog, isBlocked])
//   const startCameraStream = async () => {
//     addConsoleLog("[Camera] Starting camera stream.")
//     try {
//       if (videoRef.current) {
//         stopCameraStream()
//         const constraints = {
//           video: {
//             facingMode: facingMode,
//             width: { ideal: 1280 },
//             height: { ideal: 720 },
//           },
//         }
//         addConsoleLog(`[Camera] Requesting user media: ${JSON.stringify(constraints)}`)
//         const stream = await navigator.mediaDevices.getUserMedia(constraints)
//         videoRef.current.srcObject = stream
//         await videoRef.current.play().catch((err) => {
//           console.error("Error playing video:", err)
//           addConsoleLog(`[Camera] Error playing video: ${err}`)
//         })
//         addConsoleLog("[Camera] Camera stream started.")
//       }
//     } catch (err) {
//       console.error("Error accessing camera:", err)
//       toastify.error("Failed to access camera. Check permissions or try a different browser.")
//       addConsoleLog(`[Camera] Error accessing camera: ${err instanceof Error ? err.message : err}`)
//       setIsCameraOpen(false)
//     }
//   }
//   useEffect(() => {
//     if (isCameraOpen) {
//       startCameraStream()
//     }
//     return () => {
//       if (isCameraOpen) stopCameraStream()
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [facingMode, isCameraOpen])
//   const toggleCamera = () => {
//     if (isBlocked) return
//     setFacingMode((prev) => (prev === "user" ? "environment" : "user"))
//     addConsoleLog("[Camera] Toggling camera facing mode")
//   }
//   const captureImage = () => {
//     if (isBlocked) {
//       setShowLimitModal(true)
//       return
//     }
//     addConsoleLog("[Camera] Capturing image.")
//     if (videoRef.current && canvasRef.current && videoRef.current.videoWidth > 0) {
//       const video = videoRef.current
//       const canvas = canvasRef.current
//       canvas.width = video.videoWidth
//       canvas.height = video.videoHeight
//       const context = canvas.getContext("2d")
//       if (context) {
//         context.drawImage(video, 0, 0, canvas.width, canvas.height)
//         canvas.toBlob(
//           (blob) => {
//             if (blob) {
//               addConsoleLog(`[Camera] Blob created: ${blob.size} bytes`)
//               const file = new File([blob], `${currentImageType}_image.jpg`, { type: "image/jpeg" })
//               addConsoleLog(`[Camera] File created from blob: ${file.name}, size: ${file.size}`)
//               // reuse upload flow
//               handleImageChange({ target: { files: [file] } } as any, currentImageType as "front" | "back")
//             } else {
//               toastify.error("Could not create image blob.")
//               addConsoleLog("[Camera] Could not create blob")
//             }
//           },
//           "image/jpeg",
//           0.9
//         )
//       }
//       closeCamera()
//     } else {
//       toastify.error("Could not capture image. Try again.")
//       addConsoleLog("[Camera] Capture failed - no video/canvas")
//     }
//   }
//   const stopCameraStream = () => {
//     addConsoleLog("[Camera] Stopping camera stream.")
//     if (videoRef.current && videoRef.current.srcObject) {
//       const stream = videoRef.current.srcObject as MediaStream
//       const tracks = stream.getTracks()
//       tracks.forEach((trk) => trk.stop())
//       videoRef.current.srcObject = null
//     }
//   }
//   const closeCamera = () => {
//     addConsoleLog("[Camera] Closing camera.")
//     setIsCameraOpen(false)
//     stopCameraStream()
//   }
//   // Image change/upload. Block upload if blocked.
//   const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>, type: "front" | "back") => {
//     if (isBlocked) {
//       setShowLimitModal(true)
//       return
//     }
//     const file = e.target.files?.[0]
//     if (!file) {
//       addConsoleLog("[Image] No file selected.")
//       return
//     }
//     addConsoleLog(`[Image] Selected ${type} file: ${file.name}, ${file.size} bytes`)
//     // Show a local preview immediately
//     const reader = new FileReader()
//     reader.onload = (ev) => {
//       if (type === "front") {
//         setFrontImagePreview(ev.target?.result as string)
//         addConsoleLog("[Image] Set front preview")
//       } else {
//         setBackImagePreview(ev.target?.result as string)
//         addConsoleLog("[Image] Set back preview")
//       }
//     }
//     reader.readAsDataURL(file)
//     // Upload
//     await uploadImage(file, type)
//     // reset input value if needed by caller
//     if ((e.target as HTMLInputElement)) (e.target as HTMLInputElement).value = ""
//   }
//   const uploadImage = async (file: File, type: "front" | "back") => {
//     addConsoleLog(`[Upload] Uploading ${type} image: ${file.name}`)
//     const fd = new FormData()
//     fd.append("image", file)
//     fd.append("type", type)
//     try {
//       const progressSetter = type === "front" ? setFrontUploadProgress : setBackUploadProgress
//       progressSetter(0)
//       const xhr = new XMLHttpRequest()
//       xhr.open("POST", "/api/upload-image", true)
//       xhr.upload.onprogress = (event) => {
//         if (event.lengthComputable) {
//           const percent = (event.loaded / event.total) * 100
//           progressSetter(percent)
//           addConsoleLog(`[Upload] ${type} progress: ${percent.toFixed(2)}%`)
//         }
//       }
//       xhr.onload = () => {
//         addConsoleLog(`[Upload] ${type} onload - status ${xhr.status}`)
//         if (xhr.status === 200) {
//           try {
//             const resp = JSON.parse(xhr.responseText)
//             const imageUrl = resp.imageUrl || resp.url || ""
//             setFormData((prev) => ({
//               ...prev,
//               [type === "front" ? "cardFrontPhoto" : "cardBackPhoto"]: imageUrl,
//             }))
//             if (type === "front") setFrontImagePreview(imageUrl)
//             else setBackImagePreview(imageUrl)
//           } catch (err) {
//             console.error("Upload response parse error", err)
//             toastify.error(`Failed to parse upload response for ${type}`)
//             addConsoleLog(`[Upload] ${type} parse error: ${err instanceof Error ? err.message : err}`)
//           }
//         } else {
//           console.error(`[Upload] Server returned ${xhr.status}`)
//           toastify.error(`Upload failed with status ${xhr.status}`)
//           addConsoleLog(`[Upload] ${type} failed status ${xhr.status}`)
//         }
//         progressSetter(0)
//         addConsoleLog(`[Upload] ${type} upload finished`)
//       }
//       xhr.onerror = () => {
//         console.error("[Upload] XHR onerror")
//         toastify.error(`Network error while uploading ${type}`)
//         const progressSetter = type === "front" ? setFrontUploadProgress : setBackUploadProgress
//         progressSetter(0)
//         addConsoleLog(`[Upload] ${type} network error`)
//       }
//       xhr.send(fd)
//     } catch (error) {
//       console.error(`[Upload] Exception uploading ${type}:`, error)
//       toastify.error(`Unexpected error while uploading ${type}`)
//       const progressSetter = type === "front" ? setFrontUploadProgress : setBackUploadProgress
//       progressSetter(0)
//       addConsoleLog(`[Upload] ${type} exception: ${error instanceof Error ? error.message : error}`)
//     }
//   }
//   const handleRemoveImage = (type: "front" | "back") => {
//     addConsoleLog(`[Image] Removing ${type}`)
//     if (type === "front") {
//       setFrontImagePreview(null)
//       setFormData((prev) => ({ ...prev, cardFrontPhoto: "" }))
//     } else {
//       setBackImagePreview(null)
//       setFormData((prev) => ({ ...prev, cardBackPhoto: "" }))
//     }
//   }
//   const handleBackImageModalConfirm = () => {
//     if (isBlocked) {
//       setShowLimitModal(true)
//       return
//     }
//     setShowBackImageModal(false)
//     const backImageInput = document.getElementById("cardBack") as HTMLInputElement
//     backImageInput?.click()
//   }
//   const handleBackImageModalClose = () => setShowBackImageModal(false)
//   // Validation
//   const validateForm = useCallback((): boolean => {
//     const newErrors: Partial<Record<keyof FormData, string>> = {}
//     if (!formData.cardNo) newErrors.cardNo = "Card number is required"
//     if (!formData.salesPerson) newErrors.salesPerson = "Sales person is required"
//     if (!formData.date) newErrors.date = "Date is required"
//     setErrors(newErrors)
//     addConsoleLog(`[Validation] errors: ${JSON.stringify(newErrors)}`)
//     return Object.keys(newErrors).length === 0
//   }, [formData, addConsoleLog])
//   // default submit for creation
//   const defaultOnSubmit = async (submissionData: FormData) => {
//     addConsoleLog(`[Submit] Default submit invoked: ${JSON.stringify(submissionData)}`)
//     const res = await fetch("/api/submit-form", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(submissionData),
//     })
//     if (!res.ok) {
//       const errorData = await res.json().catch(() => ({ error: "Unknown" }))
//       addConsoleLog(`[Submit] Default submit error: ${JSON.stringify(errorData)}`)
//       throw new Error(errorData?.error || "Failed to submit form")
//     }
//     const data = await res.json()
//     addConsoleLog(`[Submit] Default submit success: ${JSON.stringify(data)}`)
//     // navigate to submission view if provided
//     if (data?.formId) router.push(`/submission/${data.formId}`)
//   }
//   const handleSubmit = useCallback(async (e: React.FormEvent) => {
//     e.preventDefault()
//     if (isSubmitting) {
//       addConsoleLog("[Submit] Already submitting - blocked")
//       return
//     }
//     // STRICT BLOCK: if blocked (limit reached) do not proceed; show modal
//     if (isBlocked) {
//       setShowLimitModal(true)
//       toastify.error(`You have reached the free submission limit (${LIMIT}).`)
//       return
//     }
//     if (!validateForm()) {
//       toastify.error("Please fill in required fields.")
//       return
//     }
//     setIsSubmitting(true)
//     try {
//       const submissionData: FormData = {
//         ...formData,
//         date: new Date(formData.date).toISOString(),
//         ...(isEdit && formId ? { id: formId } : {}),
//       } as FormData
//       if (!submissionData.cardBackPhoto) delete submissionData.cardBackPhoto
//       addConsoleLog(`[Submit] Prepared submission data: ${JSON.stringify(submissionData)}`)
//       if (onSubmit && isEdit) {
//         await onSubmit(submissionData)
//       } else {
//         await defaultOnSubmit(submissionData)
//       }
//       toastify.success(`Form ${isEdit ? "updated" : "submitted"} successfully.`)
//       let newSubmissionCount = submissionCount
//       // Increase local count after successful submission (helps immediate UX) and show notification
//       if (!isEdit) {
//         newSubmissionCount = submissionCount + 1
//         setSubmissionCount(newSubmissionCount)
//         toastify.info(`Thank you for submitting! Your submission count is now ${newSubmissionCount}.`)
//       }
//       if (!isEdit) {
//         setFormData(defaultFormData)
//         setFrontImagePreview(null)
//         setBackImagePreview(null)
//       }
//     } catch (error) {
//       console.error("Submit error:", error)
//       addConsoleLog(`[Submit] Error: ${error instanceof Error ? error.message : error}`)
//       toastify.error(error instanceof Error ? error.message : `Failed to ${isEdit ? "update" : "submit"} form.`)
//     } finally {
//       setIsSubmitting(false)
//       addConsoleLog("[Submit] Submission finished")
//     }
//   }, [formData, isSubmitting, isEdit, formId, onSubmit, defaultOnSubmit, validateForm, addConsoleLog, router, defaultFormData, isBlocked, submissionCount])
//   const isSubmitDisabled = isSubmitting ||
//     (!isEdit
//       ? (!formData.cardNo || !formData.salesPerson || !formData.date) || isBlocked
//       : !hasChanges
//     );
//   const toggleConsole = () => setShowConsole((prev) => !prev)
//   const wrapperClass = isEdit ? "" : "min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12"
//   // Render
//   return (
//     <div className={wrapperClass}>
//       <Card className="w-full max-w-4xl mx-auto shadow-lg bg-white rounded-xl overflow-hidden border border-gray-200" aria-hidden={isBlocked}>
//         <CardHeader className="bg-gray-100 border-b border-blue-100 p-6">
//           <CardTitle className="text-3xl font-bold text-gray-900">
//             {isEdit ? "Edit" : "Exhibition"} Form
//           </CardTitle>
//           {!isEdit && (
//             <p className="text-sm text-gray-600 mt-2" aria-live="polite">
//               Your free card submissions left: {isLoadingCount ? "Loading..." : Math.max(0, LIMIT - submissionCount)}
//             </p>
//           )}
//         </CardHeader>
//         <CardContent className={`p-8 ${isBlocked ? "pointer-events-none select-none" : ""}`}>
//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div className="space-y-2">
//                 <Label htmlFor="cardNo" className="text-sm font-medium text-gray-800">Card Number</Label>
//                 <Input
//                   id="cardNo"
//                   value={formData.cardNo}
//                   onChange={(e) => setFormData({ ...formData, cardNo: e.target.value })}
//                   className={`w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300 ${fieldDisabled("cardNo") || isBlocked ? "opacity-70 cursor-not-allowed" : ""}`}
//                   placeholder="Enter card number"
//                   disabled={fieldDisabled("cardNo") || isBlocked}
//                 />
//                 {errors.cardNo && <p className="text-sm text-red-600 mt-1">{errors.cardNo}</p>}
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="salesPerson" className="text-sm font-medium text-gray-800">NESSCO Sales Person</Label>
//                 <Select
//                   value={formData.salesPerson}
//                   onValueChange={(value) => setFormData({ ...formData, salesPerson: value })}
//                   disabled={isBlocked}
//                 >
//                   <SelectTrigger className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed">
//                     <SelectValue placeholder="Select sales person" />
//                   </SelectTrigger>
//                   <SelectContent className="bg-white border border-gray-200 rounded-lg">
//                     {salesPersons.map((person) => (
//                       <SelectItem key={person} value={person} className="hover:bg-blue-50">{person}</SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//                 {errors.salesPerson && <p className="text-sm text-red-600 mt-1">{errors.salesPerson}</p>}
//               </div>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div className="space-y-2">
//                 <Label htmlFor="date" className="text-sm font-medium text-gray-800">Date</Label>
//                 <Input
//                   id="date"
//                   type="date"
//                   value={formData.date}
//                   onChange={(e) => setFormData({ ...formData, date: e.target.value })}
//                   className={`w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-[#b5acda] focus:border-transparent transition-all duration-300 ${fieldDisabled("date") || isBlocked ? "opacity-70 cursor-not-allowed" : ""}`}
//                   disabled={fieldDisabled("date") || isBlocked}
//                 />
//                 {errors.date && <p className="text-sm text-red-600 mt-1">{errors.date}</p>}
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="country" className="text-sm font-medium text-gray-800">Exhibition</Label>
//                 <Input
//                   id="country"
//                   value={formData.country}
//                   onChange={(e) => setFormData({ ...formData, country: e.target.value })}
//                   className={`w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-[#b5acda] focus:border-transparent transition-all duration-300 ${isBlocked ? "opacity-70 cursor-not-allowed" : ""}`}
//                   placeholder="Enter exhibition name"
//                   disabled={isBlocked}
//                 />
//               </div>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div className="space-y-2">
//                 <Label htmlFor="cardFront" className="text-sm font-medium text-gray-800">Card Front Photo</Label>
//                 <div className="relative">
//                   <Input id="cardFront" type="file" accept="image/*" onChange={(e) => handleImageChange(e, "front")} className="hidden" disabled={isBlocked} />
//                   <Label htmlFor="cardFront" className={`flex items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-purple-300 hover:bg-gray-100 transition-all duration-300 ${isBlocked ? "opacity-70 cursor-not-allowed" : ""}`}>
//                     {frontImagePreview ? (
//                       <div className="relative w-full h-full">
//                         <Image src={frontImagePreview || "/placeholder.svg"} alt="Card Front Preview" fill style={{ objectFit: "cover" }} className="rounded-lg" />
//                         <button type="button" onClick={() => handleRemoveImage("front")} className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-all duration-300" disabled={isBlocked}>
//                           <X className="w-5 h-5" />
//                         </button>
//                       </div>
//                     ) : (
//                       <div className="text-center">
//                         <Upload className="mx-auto h-12 w-12 text-gray-400" />
//                         <span className="mt-2 block text-sm font-medium text-gray-600">Upload or capture front image</span>
//                       </div>
//                     )}
//                   </Label>
//                   <Button type="button" onClick={() => openCamera("front")} className="absolute bottom-3 right-3 bg-black text-white rounded-full p-3 hover:bg-gray-100 hover:text-black transition-all duration-300" disabled={isBlocked}>
//                     <Camera className="w-5 h-5" />
//                   </Button>
//                 </div>
//                 {frontUploadProgress > 0 && frontUploadProgress < 100 && <Progress value={frontUploadProgress} className="w-full h-2 mt-3 bg-gray-200 rounded-full" />}
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="cardBack" className="text-sm font-medium text-gray-800">Card Back Photo</Label>
//                 <div className="relative">
//                   <Input id="cardBack" type="file" accept="image/*" onChange={(e) => handleImageChange(e, "back")} className="hidden" disabled={isBlocked} />
//                   <Label htmlFor="cardBack" className={`flex items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-purple-300 hover:bg-gray-100 transition-all duration-300 ${isBlocked ? "opacity-70 cursor-not-allowed" : ""}`}>
//                     {backImagePreview ? (
//                       <div className="relative w-full h-full">
//                         <Image src={backImagePreview || "/placeholder.svg"} alt="Card Back Preview" fill style={{ objectFit: "cover" }} className="rounded-lg" />
//                         <button type="button" onClick={() => handleRemoveImage("back")} className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-all duration-300" disabled={isBlocked}>
//                           <X className="w-5 h-5" />
//                         </button>
//                       </div>
//                     ) : (
//                       <div className="text-center">
//                         <Upload className="mx-auto h-12 w-12 text-gray-400" />
//                         <span className="mt-2 block text-sm font-medium text-gray-600">Upload or capture back image</span>
//                       </div>
//                     )}
//                   </Label>
//                   <Button type="button" onClick={() => setShowBackImageModal(true)} className="absolute bottom-3 right-3 bg-black text-white rounded-full p-3 hover:bg-gray-200 hover:text-black transition-all duration-300" disabled={isBlocked}>
//                     <Camera className="w-5 h-5" />
//                   </Button>
//                 </div>
//                 {backUploadProgress > 0 && backUploadProgress < 100 && <Progress value={backUploadProgress} className="w-full h-2 mt-3 bg-gray-200 rounded-full" />}
//               </div>
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="description" className="text-sm font-medium text-gray-800">Description</Label>
//               <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={4} className={`w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-[#b5acda] focus:border-transparent transition-all duration-300 ${isBlocked ? "opacity-70 cursor-not-allowed" : ""}`} placeholder="Enter additional details" disabled={isBlocked} />
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div className="space-y-2">
//                 <Label htmlFor="leadStatus" className="text-sm font-medium text-gray-800">Lead Status</Label>
//                 <Select value={formData.leadStatus} onValueChange={(value) => setFormData({ ...formData, leadStatus: value })} disabled={isBlocked}>
//                   <SelectTrigger className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"><SelectValue placeholder="Select lead status" /></SelectTrigger>
//                   <SelectContent className="bg-white border border-gray-200 rounded-lg">
//                     {leadStatuses.map((status) => <SelectItem key={status} value={status} className="hover:bg-blue-50">{status}</SelectItem>)}
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="dealStatus" className="text-sm font-medium text-gray-800">Deal Status</Label>
//                 <Select value={formData.dealStatus} onValueChange={(value) => setFormData({ ...formData, dealStatus: value })} disabled={isBlocked}>
//                   <SelectTrigger className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"><SelectValue placeholder="Select deal status" /></SelectTrigger>
//                   <SelectContent className="bg-white border border-gray-200 rounded-lg">
//                     {dealStatuses.map((status) => <SelectItem key={status} value={status} className="hover:bg-blue-50">{status}</SelectItem>)}
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>
//             <div className="flex items-center space-x-3">
//               <Switch id="meeting" checked={formData.meetingAfterExhibition} onCheckedChange={(checked) => setFormData({ ...formData, meetingAfterExhibition: checked })} className="data-[state=checked]:bg-[#483d73]" disabled={isBlocked} />
//               <Label htmlFor="meeting" className="text-sm font-medium text-gray-800">Meeting After Exhibition</Label>
//             </div>
//             <div className="space-y-4">
//               <Label className="text-sm font-medium text-gray-800">Industry Category</Label>
//               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//                 {industryCategories.map((category) => {
//                   const checked = formData.industryCategories ? formData.industryCategories.split(",").includes(category) : false
//                   return (
//                     <div key={category} className="flex items-center space-x-2">
//                       <Checkbox
//                         id={category}
//                         checked={checked}
//                         onCheckedChange={(checked) => {
//                           const currentCategories = formData.industryCategories ? formData.industryCategories.split(",").filter(Boolean) : []
//                           const updatedCategories = checked ? [...currentCategories, category] : currentCategories.filter((c) => c !== category)
//                           setFormData({ ...formData, industryCategories: updatedCategories.join(",") })
//                         }}
//                         className="border-gray-300 data-[state=checked]:bg-[#483d73] data-[state=checked]:border-[#483d73]"
//                         disabled={isBlocked}
//                       />
//                       <Label htmlFor={category} className="text-sm text-gray-700">{category}</Label>
//                     </div>
//                   )
//                 })}
//               </div>
//             </div>
//           </form>
//         </CardContent>
//         <CardFooter className="bg-gray-100 border-t border-blue-100 p-6">
//           <Button type="button" onClick={handleSubmit} className="w-full bg-[#483d73] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#5a5570] transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed" disabled={isSubmitDisabled || isBlocked}>
//             {isSubmitting ? "Submitting..." : isEdit ? "Save Changes" : "Submit Form"}
//           </Button>
//         </CardFooter>
//       </Card>
//       {showConsole && (
//         <div className="fixed bottom-0 left-0 w-full h-64 bg-gray-900 text-white overflow-y-auto p-4 z-50">
//           <h3 className="text-lg font-semibold mb-2">Console Output</h3>
//           {consoleData.map((log, index) => <div key={index} className="text-sm">{log}</div>)}
//         </div>
//       )}
//       <PopupModal
//         isOpen={showBackImageModal}
//         onClose={handleBackImageModalClose}
//         onConfirm={handleBackImageModalConfirm}
//         title="Upload Back Image"
//         description="Do you want to upload the back image of the business card?"
//       />
//       {/* Blocking limit modal: cannot close via onClose; only Buy Plan */}
//       <PopupModal
//         isOpen={showLimitModal}
//         // disable closing by providing a no-op onClose handler so the modal can't be dismissed
//         onClose={() => {}}
//         onConfirm={() => {
//           // user clicked Buy Plan
//           setShowLimitModal(false)
//           router.push("/pricing")
//         }}
//         title="Limit Reached"
//         description="Your submission limit has been reached. Please buy a plan to submit more."
//         // Optionally you can add custom button text via the modal's implementation if supported
//       />
//       {isCameraOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-6">
//           <div className="bg-white rounded-xl shadow-2xl overflow-hidden max-w-lg w-full">
//             <div className="p-4 bg-gray-200 border-b border-blue-100 flex justify-between items-center">
//               <h3 className="text-lg font-semibold text-gray-900">Capture Photo</h3>
//               <Button variant="ghost" size="sm" onClick={closeCamera} className="p-2 hover:bg-gray-100">
//                 <X className="w-5 h-5 text-gray-600" />
//               </Button>
//             </div>
//             <div className="relative bg-black">
//               <video ref={videoRef} className="w-full h-auto" autoPlay playsInline muted />
//               <canvas ref={canvasRef} className="hidden" />
//             </div>
//             <div className="p-4 flex justify-between items-center bg-gray-200">
//               <Button variant="outline" onClick={toggleCamera} className="flex items-center gap-2 border-gray-300 hover:bg-gray-100">
//                 <RefreshCw className="w-4 h-4" />
//                 Switch Camera
//               </Button>
//               <div className="flex gap-2">
//                 <Button onClick={captureImage} className="bg-[#483d73] hover:bg-[#5a5570] text-white">Capture Photo</Button>
//                 <Button variant="ghost" onClick={closeCamera}>Close</Button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//       <ToastContainer position="top-right" autoClose={2500} />
//     </div>
//   )
// }
// export default ExhibitionForm

"use client";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import {
  Upload,
  X,
  Camera,
  RefreshCw,
  ArrowRight,
  GripVertical,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
  salesPersons,
  leadStatuses,
  dealStatuses,
  industryCategories,
  type FormData,
} from "@/types/form";
import { PopupModal } from "@/components/popup-modal";
import { useRouter, useSearchParams } from "next/navigation";
import { ToastContainer, toast as toastify } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
/* DnD-kit imports */
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  MeasuringStrategy,
  useDroppable,
  useDraggable,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion, AnimatePresence } from "framer-motion"; // Added for enhanced animations
/**
 * Approach:
 * - Left sidebar contains draggable field blocks (text, textarea, select, switch, checkboxGroup)
 * - Form area accepts drop; dropped fields are appended to formFields[]
 * - The Card Images block (front/back) is fixed and rendered above the sortable list
 * - SortableContext and useSortable are used to reorder user-added fields
 * - Each field item has a unique id (uid) and a type
 * - Enhanced with framer-motion for smooth animations and better UX
 */
/* Helper types */
type FieldType =
  | "text"
  | "textarea"
  | "select"
  | "switch"
  | "checkboxGroup"
  | "date";
type BuilderField = {
  uid: string;
  type: FieldType;
  label: string;
  required?: boolean;
  settings?: Record<string, any>;
};
interface ExhibitionFormProps {
  initialData?: Partial<FormData>;
  onSubmit?: (data: FormData) => Promise<void> | void;
  isEdit?: boolean;
  formId?: string;
  disabledFields?: string[];
}
function uid(prefix = "") {
  return `${prefix}${Math.random().toString(36).slice(2, 9)}`;
}
/* Sortable item wrapper component */
function SortableFieldItem({
  id,
  children,
  sortable = true,
}: {
  id: string;
  children: React.ReactNode;
  sortable?: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
    cursor: sortable ? "grab" : "default",
  } as React.CSSProperties;
  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="overflow-hidden"
    >
      {sortable ? (
        <div className="flex items-start gap-3">
          <motion.div
            {...listeners}
            className="pt-2 cursor-grab active:cursor-grabbing"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.1 }}
          >
            <div className="p-2 rounded-md bg-gray-100 border border-gray-200">
              <GripVertical className="w-4 h-4 text-gray-600" />
            </div>
          </motion.div>
          <div className="flex-1">{children}</div>
        </div>
      ) : (
        <div>{children}</div>
      )}
    </motion.div>
  );
}
/* Draggable block for sidebar */
function DraggableBlock({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
  } as React.CSSProperties;
  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`flex items-center justify-between p-3 border rounded-lg cursor-grab hover:bg-gray-50 transition-all duration-200 ${
        isDragging ? "opacity-50 scale-105 shadow-lg" : ""
      }`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15 }}
    >
      {children}
    </motion.div>
  );
}
/* Droppable form area */
function DroppableFormArea({ children }: { children: React.ReactNode }) {
  const { setNodeRef, isOver: droppableIsOver } = useDroppable({
    id: "form-drop",
  });
  return (
    <motion.div
      ref={setNodeRef}
      className={`border border-dashed rounded-md p-4 transition-all duration-300 ${
        droppableIsOver
          ? "border-gray-400 bg-blue-50 shadow-md"
          : "border-gray-200 bg-gray-50"
      }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      whileHover={{ scale: 1.005 }}
    >
      <AnimatePresence>
        {droppableIsOver && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center text-blue-600 text-sm mb-4 p-2 bg-blue-100 rounded"
          >
            Drop here to add field
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </motion.div>
  );
}
export function ExhibitionForm({
  initialData = {},
  onSubmit,
  isEdit = false,
  formId,
  disabledFields = [],
}: ExhibitionFormProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  // LIMIT constant
  const LIMIT = 15;
  // submission count state fetched from server
  const [submissionCount, setSubmissionCount] = useState<number>(0);
  const [isLoadingCount, setIsLoadingCount] = useState<boolean>(true);
  const [showLimitModal, setShowLimitModal] = useState<boolean>(false);
  const [limitReached, setLimitReached] = useState<boolean>(false);
  /* Default form data (same as your original) */
  const defaultFormData: FormData = {
    cardNo: (searchParams?.get("cardNo") as string) || "",
    salesPerson: (searchParams?.get("salesPerson") as string) || "",
    date: new Date().toISOString().split("T")[0],
    country:
      (searchParams?.get("exhibition") as string) || "LABEL EXPO SPAIN 2025",
    cardFrontPhoto: "",
    cardBackPhoto: "",
    leadStatus: (searchParams?.get("leadStatus") as string) || "",
    dealStatus: (searchParams?.get("dealStatus") as string) || "",
    meetingAfterExhibition:
      searchParams?.get("meetingAfterExhibition")?.toLowerCase() === "true" ||
      false,
    industryCategories:
      (searchParams?.get("industryCategories") as string) || "",
    description: "",
    extractedData: null,
    mergedData: null,
    status: "PENDING",
    extractionStatus: "PENDING",
    zohoStatus: "PENDING",
    userId: undefined,
    user: undefined,
    createdAt: undefined,
    updatedAt: undefined,
  };
  const [formData, setFormData] = useState<FormData>({
    ...defaultFormData,
    ...initialData,
  });
  const [frontImagePreview, setFrontImagePreview] = useState<string | null>(
    initialData?.cardFrontPhoto || null
  );
  const [backImagePreview, setBackImagePreview] = useState<string | null>(
    initialData?.cardBackPhoto || null
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showBackImageModal, setShowBackImageModal] = useState<boolean>(false);
  const [frontUploadProgress, setFrontUploadProgress] = useState<number>(0);
  const [backUploadProgress, setBackUploadProgress] = useState<number>(0);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {}
  );
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);
  const [currentImageType, setCurrentImageType] = useState<
    "front" | "back" | null
  >(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">(
    "environment"
  );
  const initialRef = useRef<FormData>({ ...defaultFormData, ...initialData });
  const hasChanges = useMemo(() => {
    return JSON.stringify(formData) !== JSON.stringify(initialRef.current);
  }, [formData]);
  const fieldDisabled = (fieldName: string) => {
    return disabledFields.includes(fieldName);
  };
  // Console logs kept for debugging
  const [consoleData, setConsoleData] = useState<string[]>([]);
  const addConsoleLog = useCallback((message: string) => {
    setConsoleData((prev) => [
      ...prev,
      `${new Date().toISOString()} - ${message}`,
    ]);
  }, []);
  // Fetch submission count
  useEffect(() => {
    let mounted = true;
    const fetchSubmissionCount = async () => {
      try {
        setIsLoadingCount(true);
        const res = await fetch("/api/form-count", {
          method: "GET",
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          const count =
            typeof data.count === "number"
              ? data.count
              : Number(data.count || 0);
          if (mounted) {
            setSubmissionCount(count);
            if (!isEdit && count >= LIMIT) {
              setLimitReached(true);
              setShowLimitModal(true);
            } else {
              setLimitReached(false);
            }
          }
        } else {
          console.error("Failed to fetch submission count");
        }
      } catch (error) {
        console.error("Error fetching submission count:", error);
        toastify.error("Could not load submission limit. Please refresh.");
      } finally {
        if (mounted) setIsLoadingCount(false);
      }
    };
    fetchSubmissionCount();
    return () => {
      mounted = false;
    };
  }, [isEdit]);
  useEffect(() => {
    if (!isEdit && submissionCount >= LIMIT) {
      setLimitReached(true);
      setShowLimitModal(true);
    }
  }, [submissionCount, isEdit]);
  // keep existing initial previews behavior
  useEffect(() => {
    if (initialData?.cardFrontPhoto) {
      setFrontImagePreview(initialData.cardFrontPhoto);
    }
    if (initialData?.cardBackPhoto) {
      setBackImagePreview(initialData.cardBackPhoto);
    }
    if (initialData?.date && (initialData.date as string).includes("T")) {
      setFormData((prev) => ({
        ...prev,
        date: (initialData.date as string).split("T")[0] || "",
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData]);
  // Camera functions (same as your original)
  const openCamera = useCallback(
    (type: "front" | "back") => {
      if (limitReached) {
        setShowLimitModal(true);
        return;
      }
      addConsoleLog(`[Camera] Opening camera for ${type}`);
      setCurrentImageType(type);
      setIsCameraOpen(true);
      startCameraStream();
    },
    [addConsoleLog, limitReached]
  );
  const startCameraStream = async () => {
    addConsoleLog("[Camera] Starting camera stream.");
    try {
      if (videoRef.current) {
        stopCameraStream();
        const constraints = {
          video: {
            facingMode: facingMode,
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        };
        addConsoleLog(
          `[Camera] Requesting user media: ${JSON.stringify(constraints)}`
        );
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch((err) => {
          console.error("Error playing video:", err);
          addConsoleLog(`[Camera] Error playing video: ${err}`);
        });
        addConsoleLog("[Camera] Camera stream started.");
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      toastify.error(
        "Failed to access camera. Check permissions or try a different browser."
      );
      addConsoleLog(
        `[Camera] Error accessing camera: ${
          err instanceof Error ? err.message : err
        }`
      );
      setIsCameraOpen(false);
    }
  };
  useEffect(() => {
    if (isCameraOpen) {
      startCameraStream();
    }
    return () => {
      if (isCameraOpen) stopCameraStream();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facingMode, isCameraOpen]);
  const toggleCamera = () => {
    if (limitReached) return;
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
    addConsoleLog("[Camera] Toggling camera facing mode");
  };
  const captureImage = () => {
    if (limitReached) {
      setShowLimitModal(true);
      return;
    }
    addConsoleLog("[Camera] Capturing image.");
    if (
      videoRef.current &&
      canvasRef.current &&
      videoRef.current.videoWidth > 0
    ) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext("2d");
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              addConsoleLog(`[Camera] Blob created: ${blob.size} bytes`);
              const file = new File([blob], `${currentImageType}_image.jpg`, {
                type: "image/jpeg",
              });
              addConsoleLog(
                `[Camera] File created from blob: ${file.name}, size: ${file.size}`
              );
              handleImageChange(
                { target: { files: [file] } } as any,
                currentImageType as "front" | "back"
              );
            } else {
              toastify.error("Could not create image blob.");
              addConsoleLog("[Camera] Could not create blob");
            }
          },
          "image/jpeg",
          0.9
        );
      }
      closeCamera();
    } else {
      toastify.error("Could not capture image. Try again.");
      addConsoleLog("[Camera] Capture failed - no video/canvas");
    }
  };
  const stopCameraStream = () => {
    addConsoleLog("[Camera] Stopping camera stream.");
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach((trk) => trk.stop());
      videoRef.current.srcObject = null;
    }
  };
  const closeCamera = () => {
    addConsoleLog("[Camera] Closing camera.");
    setIsCameraOpen(false);
    stopCameraStream();
  };
  // Image upload/change (kept original behavior)
  const handleImageChange = async (
    e: React.ChangeEvent<HTMLInputElement> | any,
    type: "front" | "back"
  ) => {
    if (limitReached) {
      setShowLimitModal(true);
      return;
    }
    const file = e.target.files?.[0];
    if (!file) {
      addConsoleLog("[Image] No file selected.");
      return;
    }
    addConsoleLog(
      `[Image] Selected ${type} file: ${file.name}, ${file.size} bytes`
    );
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (type === "front") {
        setFrontImagePreview(ev.target?.result as string);
        addConsoleLog("[Image] Set front preview");
      } else {
        setBackImagePreview(ev.target?.result as string);
        addConsoleLog("[Image] Set back preview");
      }
    };
    reader.readAsDataURL(file);
    await uploadImage(file, type);
    if (e.target as HTMLInputElement) (e.target as HTMLInputElement).value = "";
  };
  const uploadImage = async (file: File, type: "front" | "back") => {
    addConsoleLog(`[Upload] Uploading ${type} image: ${file.name}`);
    const fd = new FormData();
    fd.append("image", file);
    fd.append("type", type);
    try {
      const progressSetter =
        type === "front" ? setFrontUploadProgress : setBackUploadProgress;
      progressSetter(0);
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/upload-image", true);
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = (event.loaded / event.total) * 100;
          progressSetter(percent);
          addConsoleLog(`[Upload] ${type} progress: ${percent.toFixed(2)}%`);
        }
      };
      xhr.onload = () => {
        addConsoleLog(`[Upload] ${type} onload - status ${xhr.status}`);
        if (xhr.status === 200) {
          try {
            const resp = JSON.parse(xhr.responseText);
            const imageUrl = resp.imageUrl || resp.url || "";
            setFormData((prev) => ({
              ...prev,
              [type === "front" ? "cardFrontPhoto" : "cardBackPhoto"]: imageUrl,
            }));
            if (type === "front") setFrontImagePreview(imageUrl);
            else setBackImagePreview(imageUrl);
          } catch (err) {
            console.error("Upload response parse error", err);
            toastify.error(`Failed to parse upload response for ${type}`);
            addConsoleLog(
              `[Upload] ${type} parse error: ${
                err instanceof Error ? err.message : err
              }`
            );
          }
        } else {
          console.error(`[Upload] Server returned ${xhr.status}`);
          toastify.error(`Upload failed with status ${xhr.status}`);
          addConsoleLog(`[Upload] ${type} failed status ${xhr.status}`);
        }
        progressSetter(0);
        addConsoleLog(`[Upload] ${type} upload finished`);
      };
      xhr.onerror = () => {
        console.error("[Upload] XHR onerror");
        toastify.error(`Network error while uploading ${type}`);
        const progressSetter =
          type === "front" ? setFrontUploadProgress : setBackUploadProgress;
        progressSetter(0);
        addConsoleLog(`[Upload] ${type} network error`);
      };
      xhr.send(fd);
    } catch (error) {
      console.error(`[Upload] Exception uploading ${type}:`, error);
      toastify.error(`Unexpected error while uploading ${type}`);
      const progressSetter =
        type === "front" ? setFrontUploadProgress : setBackUploadProgress;
      progressSetter(0);
      addConsoleLog(
        `[Upload] ${type} exception: ${
          error instanceof Error ? error.message : error
        }`
      );
    }
  };
  const handleRemoveImage = (type: "front" | "back") => {
    addConsoleLog(`[Image] Removing ${type}`);
    if (type === "front") {
      setFrontImagePreview(null);
      setFormData((prev) => ({ ...prev, cardFrontPhoto: "" }));
    } else {
      setBackImagePreview(null);
      setFormData((prev) => ({ ...prev, cardBackPhoto: "" }));
    }
  };
  const handleBackImageModalConfirm = () => {
    if (limitReached) {
      setShowLimitModal(true);
      return;
    }
    setShowBackImageModal(false);
    const backImageInput = document.getElementById(
      "cardBack"
    ) as HTMLInputElement;
    backImageInput?.click();
  };
  const handleBackImageModalClose = () => setShowBackImageModal(false);
  // Validation (kept)
  const validateForm = useCallback((): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    if (!formData.cardNo) newErrors.cardNo = "Card number is required";
    if (!formData.salesPerson)
      newErrors.salesPerson = "Sales person is required";
    if (!formData.date) newErrors.date = "Date is required";
    setErrors(newErrors);
    addConsoleLog(`[Validation] errors: ${JSON.stringify(newErrors)}`);
    return Object.keys(newErrors).length === 0;
  }, [formData, addConsoleLog]);
  // default submit (kept)
  const defaultOnSubmit = async (submissionData: FormData) => {
    addConsoleLog(
      `[Submit] Default submit invoked: ${JSON.stringify(submissionData)}`
    );
    const res = await fetch("/api/submit-form", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(submissionData),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ error: "Unknown" }));
      addConsoleLog(
        `[Submit] Default submit error: ${JSON.stringify(errorData)}`
      );
      throw new Error(errorData?.error || "Failed to submit form");
    }
    const data = await res.json();
    addConsoleLog(`[Submit] Default submit success: ${JSON.stringify(data)}`);
    if (data?.formId) router.push(`/submission/${data.formId}`);
  };
  // --- Builder state & logic ---
  // available blocks in sidebar (draggable)
  const availableBlocks: { type: FieldType; label: string }[] = [
    // { type: "text", label: "Short Text" },
    { type: "textarea", label: "Description" },
    { type: "select", label: "Select (Lead/Deal)" },
    { type: "switch", label: "Schedule Meeting" },
    { type: "checkboxGroup", label: "Industry Categories" },
    { type: "date", label: "Date" },
  ];
  // formFields are user-added and reorderable. We keep the card images block fixed outside this array.
  const [formFields, setFormFields] = useState<BuilderField[]>(() => {
    // default starter fields (excluding card images which are fixed)
    return [
      { uid: uid("f_"), type: "select", label: "Sales Person", required: true },
      { uid: uid("f_"), type: "date", label: "Date", required: true },
      { uid: uid("f_"), type: "text", label: "Exhibition" },
      { uid: uid("f_"), type: "textarea", label: "Description" },
    ];
  });
  // helper to add field of type
  const addFieldOfType = (type: FieldType) => {
    const labelMap: Record<FieldType, string> = {
      text: "",
      textarea: "Description",
      select: "Select",
      switch: "Schedule Meeting",
      checkboxGroup: "Industry Categories",
      date: "Date",
    };
    const existing = formFields.some((f) => f.type === type);
    if (existing) {
      toastify.error(
        `"${labelMap[type]}" field is already added. You can reorder or edit it.`
      );
      return;
    }
    const newField: BuilderField = {
      uid: uid("f_"),
      type,
      label: labelMap[type] || "Field",
    };
    setFormFields((p) => [...p, newField]);
    toastify.success(`${labelMap[type]} field added!`);
  };
  // remove field by uid
  const removeField = (uidToRemove: string) => {
    setFormFields((p) => p.filter((f) => f.uid !== uidToRemove));
    toastify.info("Field removed");
  };
  // update field label/settings
  const updateField = (uidToUpdate: string, patch: Partial<BuilderField>) => {
    setFormFields((p) =>
      p.map((f) => (f.uid === uidToUpdate ? { ...f, ...patch } : f))
    );
  };
  // --- Drag & drop setup (dnd-kit) ---
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  // When a sidebar block is dropped into the form area we add it.
  const onDragStart = ({ active }: any) => {
    setActiveDragId(active.id);
  };
  const onDragEnd = ({ active, over }: any) => {
    setActiveDragId(null);
    // Dropping onto sortable/list (over.id corresponds to uid of list item or "form-drop")
    if (!over) return;
    // If the active item is a sidebar block (prefix "block-") and over is the form container ("form-drop") or over any existing field -> add new field
    const isOverFormArea =
      over.id === "form-drop" || formFields.some((f) => f.uid === over.id);
    if (String(active.id).startsWith("block-") && isOverFormArea) {
      const type = String(active.id).replace("block-", "") as FieldType;
      addFieldOfType(type);
      return;
    }
    // If both active and over are items inside sortable list -> rearrange
    const activeIndex = formFields.findIndex((f) => f.uid === active.id);
    const overIndex = formFields.findIndex((f) => f.uid === over.id);
    if (activeIndex !== -1 && overIndex !== -1 && activeIndex !== overIndex) {
      setFormFields((items) => arrayMove(items, activeIndex, overIndex));
      toastify.info("Field reordered!");
    }
  };
  const onDragCancel = () => setActiveDragId(null);
  const onDragOver = ({ active, over }: any) => {
    // Optional: Add logic for dynamic insertion preview if needed
  };
  // --- Submit logic adapted to builder: stitch data from formFields into formData before submit ---
  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();
      if (isSubmitting) return;
      if (limitReached) {
        setShowLimitModal(true);
        toastify.error(
          `You have reached the free submission limit (${LIMIT}).`
        );
        return;
      }
      // Build submission object: use fields to map values from formData or from temporary per-field store
      // For simplicity we keep canonical keys in formData (cardNo, salesPerson, date, country, description, etc.)
      // – if a field label doesn't match a known key, it will be stored in description as extra data.
      if (!validateForm()) {
        toastify.error("Please fill in required fields.");
        return;
      }
      setIsSubmitting(true);
      try {
        const submissionData: FormData = {
          ...formData,
          date: new Date(formData.date).toISOString(),
          ...(isEdit && formId ? { id: formId } : {}),
        } as FormData;
        if (!submissionData.cardBackPhoto) delete submissionData.cardBackPhoto;
        if (onSubmit && isEdit) {
          await onSubmit(submissionData);
        } else {
          await defaultOnSubmit(submissionData);
        }
        toastify.success(
          `Form ${isEdit ? "updated" : "submitted"} successfully.`
        );
        let newSubmissionCount = submissionCount;
        if (!isEdit) {
          newSubmissionCount = submissionCount + 1;
          setSubmissionCount(newSubmissionCount);
          toastify.info(
            `Thank you for submitting! Your submission count is now ${newSubmissionCount}.`
          );
        }
        if (!isEdit) {
          setFormData(defaultFormData);
          setFrontImagePreview(null);
          setBackImagePreview(null);
        }
      } catch (error) {
        console.error("Submit error:", error);
        toastify.error(
          error instanceof Error
            ? error.message
            : `Failed to ${isEdit ? "update" : "submit"} form.`
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      isSubmitting,
      limitReached,
      LIMIT,
      validateForm,
      formData,
      isEdit,
      formId,
      onSubmit,
      defaultOnSubmit,
      submissionCount,
    ]
  );
  const isSubmitDisabled =
    isSubmitting ||
    (!isEdit
      ? !formData.cardNo ||
        !formData.salesPerson ||
        !formData.date ||
        limitReached
      : !hasChanges);
  const wrapperClass = isEdit
    ? ""
    : "min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12";
  // render individual field block by type (reads/writes to formData where possible)
  const renderFieldByType = (field: BuilderField) => {
    const key = field.uid;
    switch (field.type) {
      case "text":
        // Heuristic mapping by label to existing keys if possible
        const lower = field.label.toLowerCase();
        if (lower.includes("card")) {
          return (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-2"
            >
              <Label className="text-sm font-medium text-gray-800">
                {field.label}
              </Label>
              <Input
                value={formData.cardNo}
                onChange={(e) =>
                  setFormData({ ...formData, cardNo: e.target.value })
                }
                placeholder="Enter card number"
                className="w-full transition-all duration-200 focus:ring-2 focus:ring-gray-500"
              />
            </motion.div>
          );
        }
        if (
          lower.includes("exhibit") ||
          lower.includes("exhibition") ||
          lower.includes("country")
        ) {
          return (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-2"
            >
              <Label className="text-sm font-medium text-gray-800">
                {field.label}
              </Label>
              <Input
                value={formData.country}
                onChange={(e) =>
                  setFormData({ ...formData, country: e.target.value })
                }
                placeholder="Enter exhibition name"
                className="w-full transition-all duration-200 focus:ring-2 focus:ring-gray-500"
              />
            </motion.div>
          );
        }
        // Generic short text stored in description fallback (appends)
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-2"
          >
            <Label className="text-sm font-medium text-gray-800">
              {field.label}
            </Label>
            <Input
              value={(formData as any)[key] || ""}
              onChange={(e) =>
                setFormData((p) => ({ ...p, [key]: e.target.value } as any))
              }
              placeholder={field.label}
              className="w-full transition-all duration-200 focus:ring-2 focus:ring-gray-500"
            />
          </motion.div>
        );
      case "textarea":
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-2"
          >
            <Label className="text-sm font-medium text-gray-800">
              {field.label}
            </Label>
            <Textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              placeholder="Enter additional details"
              className="transition-all duration-200 focus:ring-2 focus:ring-gray-500 resize-none"
            />
          </motion.div>
        );
      case "select":
        // Map to salesPerson / leadStatus / dealStatus based on label heuristics
        if (field.label.toLowerCase().includes("sales")) {
          return (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-2"
            >
              <Label className="text-sm font-medium text-gray-800">
                {field.label}
              </Label>
              <Select
                value={formData.salesPerson}
                onValueChange={(v) =>
                  setFormData({ ...formData, salesPerson: v })
                }
              >
                <SelectTrigger className="w-full p-3 transition-all duration-200 focus:ring-1 focus:ring-gray-500">
                  <SelectValue placeholder="Select sales person" />
                </SelectTrigger>
                <SelectContent>
                  {salesPersons.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </motion.div>
          );
        }
        // default fallback select for lead status
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-2"
          >
            <Label className="text-sm font-medium text-gray-800">
              {field.label}
            </Label>
            <Select
              value={formData.leadStatus}
              onValueChange={(v) => setFormData({ ...formData, leadStatus: v })}
            >
              <SelectTrigger className="w-full p-3 transition-all duration-200 focus:ring-2 focus:ring-gray-500">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {leadStatuses.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </motion.div>
        );
      case "switch":
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3"
          >
            <Switch
            
              checked={formData.meetingAfterExhibition}
              onCheckedChange={(c) =>
                setFormData({ ...formData, meetingAfterExhibition: c })
              }
            />
            <Label className="text-sm font-medium text-gray-800">
              {field.label}
            </Label>
          </motion.div>
        );
      case "checkboxGroup":
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-2"
          >
            <Label className="text-sm font-medium text-gray-800">
              {field.label}
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-2">
              {industryCategories.map((category) => {
                const checked = formData.industryCategories
                  ? formData.industryCategories.split(",").includes(category)
                  : false;
                return (
                  <motion.div
                    key={category}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2 transition-all duration-200"
                  >
                    <Checkbox
                      checked={checked}
                      onCheckedChange={(checked) => {
                        const currentCategories = formData.industryCategories
                          ? formData.industryCategories
                              .split(",")
                              .filter(Boolean)
                          : [];
                        const updatedCategories = checked
                          ? [...currentCategories, category]
                          : currentCategories.filter((c) => c !== category);
                        setFormData({
                          ...formData,
                          industryCategories: updatedCategories.join(","),
                        });
                      }}
                    />
                    <Label className="text-sm">{category}</Label>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        );
      case "date":
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-2"
          >
            <Label className="text-sm font-medium text-gray-800">
              {field.label}
            </Label>
            <Input
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              className="w-full transition-all duration-200 focus:ring-2 focus:ring-gray-500"
            />
          </motion.div>
        );
      default:
        return null;
    }
  };
  // Drag overlay render
  const renderDragOverlay = () => {
    if (!activeDragId) return null;
    if (String(activeDragId).startsWith("block-")) {
      const type = String(activeDragId).replace("block-", "") as FieldType;
      const block = availableBlocks.find((b) => b.type === type);
      if (!block) return null;
      return (
        <motion.div
          className="p-3 bg-white border rounded-lg shadow-lg"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
        >
          <div className="text-sm font-medium">{block.label}</div>
          <div className="text-xs text-gray-500">Drop to add</div>
        </motion.div>
      );
    }
    // For sortable items, render a ghost
    const draggingField = formFields.find((f) => f.uid === activeDragId);
    if (!draggingField) return null;
    return (
      <motion.div
        className="bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-lg w-full max-w-md"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <div className="text-sm font-semibold">{draggingField.label}</div>
        <div className="text-xs text-gray-500">{draggingField.type}</div>
      </motion.div>
    );
  };
  return (
    <div className={wrapperClass}>
      <div className="max-w-6xl mx-auto grid grid-cols-12 gap-6 px-4">
        {/* DnD Context wraps both sidebar and main for cross-container drags */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onDragOver={onDragOver}
          onDragCancel={onDragCancel}
          measuring={{
            droppable: { strategy: MeasuringStrategy.Always },
          }}
        >
          {/* Sidebar - draggable blocks */}
          <motion.div
            className="col-span-3 bg-white rounded-xl p-4 shadow-sm sticky top-6 h-fit"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="font-semibold text-lg mb-3">Build your form</h3>
            <p className="text-sm text-gray-600 mb-4">
              Drag a field into the form area
            </p>
            <div className="space-y-3">
              <AnimatePresence>
                {availableBlocks.map((b, index) => (
                  <motion.div
                    key={b.type}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <DraggableBlock id={`block-${b.type}`}>
                      <div>
                        <div className="text-sm font-medium">{b.label}</div>
                        <div className="text-xs text-gray-500">
                          Field type: {b.type}
                        </div>
                      </div>
                      <div className="text-xs text-gray-400">⠿</div>
                    </DraggableBlock>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <div className="mt-6">
              <Button
                variant="ghost"
                onClick={() => {
                  setFormFields([]);
                  setFormData(defaultFormData);
                }}
                className="w-full transition-all duration-200 hover:bg-[#352c52] bg-[#483f69] text-white hover:text-white" 
              >
                Reset Form
              </Button>
            </div>
          </motion.div>
          {/* Main form builder + form display */}
          <motion.div
            className="col-span-9"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="w-full mx-auto shadow-lg bg-white rounded-xl overflow-hidden border border-gray-200">
              <CardHeader className="bg-gray-100 border-b border-blue-100 p-6">
                <CardTitle className="text-2xl font-bold text-gray-900">
                  {isEdit ? "Edit" : "Exhibition"} Form Builder
                </CardTitle>
                {!isEdit && (
                  <p className="text-sm text-gray-600 mt-2" aria-live="polite">
                    Your free card submissions left:{" "}
                    {isLoadingCount
                      ? "Loading..."
                      : Math.max(0, LIMIT - submissionCount)}
                  </p>
                )}
              </CardHeader>
              <CardContent
                className={`p-6 ${
                  limitReached
                    ? "pointer-events-none select-none opacity-80"
                    : ""
                }`}
              >
                {/* Fixed Card Image block (cannot be moved or removed) */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mb-6 space-y-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-800">Card Number</h4>
                  </div>
                  <Input
                    value={formData.cardNo}
                    onChange={(e) =>
                      setFormData({ ...formData, cardNo: e.target.value })
                    }
                    placeholder="Enter card number"
                    className="w-full transition-all duration-200 focus:ring-2 focus:ring-gray-500"
                  />
                  {errors.cardNo && (
                    <p className="text-red-500 text-xs mt-1 animate-pulse">
                      {errors.cardNo}
                    </p>
                  )}
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-800">Card Images</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Front */}
                    <motion.div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-800">
                        Card Front Photo
                      </Label>
                      <div className="relative">
                        <input
                          id="cardFront"
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageChange(e, "front")}
                          className="hidden"
                        />
                        <label
                          htmlFor="cardFront"
                          className="flex items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-purple-300 hover:bg-gray-100 transition-all duration-300"
                        >
                          <AnimatePresence mode="wait">
                            {frontImagePreview ? (
                              <motion.div
                                key="preview"
                                className="relative w-full h-full"
                                initial={{ scale: 0.95 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0.95 }}
                              >
                                <Image
                                  src={frontImagePreview || "/placeholder.svg"}
                                  alt="Card Front Preview"
                                  fill
                                  style={{ objectFit: "cover" }}
                                  className="rounded-lg"
                                />
                                <motion.button
                                  type="button"
                                  onClick={() => handleRemoveImage("front")}
                                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  <X className="w-5 h-5" />
                                </motion.button>
                              </motion.div>
                            ) : (
                              <motion.div
                                key="upload"
                                className="text-center"
                                initial={{ scale: 0.95 }}
                                animate={{ scale: 1 }}
                              >
                                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                <span className="mt-2 block text-sm font-medium text-gray-600">
                                  Upload or capture front image
                                </span>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </label>
                        <motion.div
                          className="absolute bottom-3 right-3"
                          whileHover={{ scale: 1.05 }}
                        >
                          <Button
                            type="button"
                            onClick={() => openCamera("front")}
                            className="bg-black text-white rounded-full p-3 hover:bg-gray-100 hover:text-black transition-all duration-300"
                          >
                            <Camera className="w-5 h-5" />
                          </Button>
                        </motion.div>
                      </div>
                      <AnimatePresence>
                        {frontUploadProgress > 0 &&
                          frontUploadProgress < 100 && (
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${frontUploadProgress}%` }}
                              className="w-full h-2 mt-3 bg-gray-200 rounded-full overflow-hidden"
                            >
                              <motion.div
                                className="h-full bg-blue-600 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${frontUploadProgress}%` }}
                                transition={{ duration: 0.5 }}
                              />
                            </motion.div>
                          )}
                      </AnimatePresence>
                    </motion.div>
                    {/* Back */}
                    <motion.div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-800">
                        Card Back Photo
                      </Label>
                      <div className="relative">
                        <input
                          id="cardBack"
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageChange(e, "back")}
                          className="hidden"
                        />
                        <label
                          htmlFor="cardBack"
                          className="flex items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-purple-300 hover:bg-gray-100 transition-all duration-300"
                        >
                          <AnimatePresence mode="wait">
                            {backImagePreview ? (
                              <motion.div
                                key="preview"
                                className="relative w-full h-full"
                                initial={{ scale: 0.95 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0.95 }}
                              >
                                <Image
                                  src={backImagePreview || "/placeholder.svg"}
                                  alt="Card Back Preview"
                                  fill
                                  style={{ objectFit: "cover" }}
                                  className="rounded-lg"
                                />
                                <motion.button
                                  type="button"
                                  onClick={() => handleRemoveImage("back")}
                                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  <X className="w-5 h-5" />
                                </motion.button>
                              </motion.div>
                            ) : (
                              <motion.div
                                key="upload"
                                className="text-center"
                                initial={{ scale: 0.95 }}
                                animate={{ scale: 1 }}
                              >
                                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                <span className="mt-2 block text-sm font-medium text-gray-600">
                                  Upload or capture back image
                                </span>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </label>
                        <motion.div
                          className="absolute bottom-3 right-3"
                          whileHover={{ scale: 1.05 }}
                        >
                          <Button
                            type="button"
                            onClick={() => setShowBackImageModal(true)}
                            className="bg-black text-white rounded-full p-3 hover:bg-gray-200 hover:text-black transition-all duration-300"
                          >
                            <Camera className="w-5 h-5" />
                          </Button>
                        </motion.div>
                      </div>
                      <AnimatePresence>
                        {backUploadProgress > 0 && backUploadProgress < 100 && (
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${backUploadProgress}%` }}
                            className="w-full h-2 mt-3 bg-gray-200 rounded-full overflow-hidden"
                          >
                            <motion.div
                              className="h-full bg-blue-600 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${backUploadProgress}%` }}
                              transition={{ duration: 0.5 }}
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </div>
                </motion.div>
                {/* Droppable form area with sortable context */}
                <DroppableFormArea>
                  <SortableContext
                    items={formFields.map((f) => f.uid)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-4" id="form-list">
                      <AnimatePresence>
                        {formFields.map((field, index) => (
                          <motion.div
                            key={field.uid}
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            transition={{ duration: 0.2, delay: index * 0.05 }}
                          >
                            <div className="bg-gray-50 border border-gray-100 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                              <SortableFieldItem id={field.uid}>
                                <div className="flex justify-between items-start">
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                      <div>
                                        <div className="text-sm font-semibold text-gray-800">
                                          {field.label}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                          {field.type}
                                        </div>
                                      </div>
                                      <motion.button
                                        onClick={() => removeField(field.uid)}
                                        className="text-sm text-red-600 hover:text-red-800 transition-colors duration-200"
                                        whileHover={{ scale: 1.05 }}
                                      >
                                        Remove
                                      </motion.button>
                                    </div>
                                    <div className="mt-3">
                                      {renderFieldByType(field)}
                                    </div>
                                  </div>
                                </div>
                              </SortableFieldItem>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                      {/* Drop hint when list is empty */}
                      {formFields.length === 0 && (
                        <motion.div
                          className="p-6 text-center text-gray-500"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          Drag fields from the left to build your form.
                        </motion.div>
                      )}
                    </div>
                  </SortableContext>
                </DroppableFormArea>
                {/* Extra: manual "Add field" buttons as alternative for accessibility */}
                <motion.div
                  className="mt-4 flex flex-wrap gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {availableBlocks.map((b, index) => (
                    <motion.div
                      key={`add-${b.type}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addFieldOfType(b.type)}
                        className="transition-all duration-200 hover:scale-105"
                        whileHover={{ scale: 1.05 }}
                      >
                        {b.label}
                      </Button>
                    </motion.div>
                  ))}
                </motion.div>
              </CardContent>
              <CardFooter className="bg-gray-100 border-t border-blue-100 p-6">
                <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-2">
                    <div className="text-sm text-gray-700 mb-2">
                      Note: Card front/back are fixed and will always be
                      included.
                    </div>
                  </div>
                  <div>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        onClick={handleSubmit}
                        className="w-full bg-[#483d73] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#5a5570] transition-all duration-300"
                        disabled={isSubmitDisabled}
                      >
                        {isSubmitting
                          ? "Submitting..."
                          : isEdit
                          ? "Save Changes"
                          : "Submit Form"}
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </motion.div>
          {/* Drag overlay for visuals */}
          <DragOverlay>{renderDragOverlay()}</DragOverlay>
        </DndContext>
      </div>
      {/* Camera modal */}
      {isCameraOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-xl shadow-2xl overflow-hidden max-w-lg w-full"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
          >
            <div className="p-4 bg-gray-200 border-b border-blue-100 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">
                Capture Photo
              </h3>
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
                className="w-screen h-auto"
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
              <div className="flex gap-2">
                <Button
                  onClick={captureImage}
                  className="bg-[#483d73] hover:bg-[#5a5570] text-white"
                >
                  Capture Photo
                </Button>
                <Button variant="ghost" onClick={closeCamera}>
                  Close
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
      {/* Back image confirmation modal */}
      <PopupModal
        isOpen={showBackImageModal}
        onClose={handleBackImageModalClose}
        onConfirm={handleBackImageModalConfirm}
        title="Upload Back Image"
        description="Do you want to upload the back image of the business card?"
      />
      {/* Limit modal */}
      <PopupModal
        isOpen={showLimitModal}
        onClose={() => {}}
        onConfirm={() => {
          setShowLimitModal(false);
          router.push("/pricing");
        }}
        title="Limit Reached"
        description="Your submission limit has been reached. Please buy a plan to submit more."
      />
      <ToastContainer
        className="toast-container"
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        style={{ zIndex: 9999 }}
      />
    </div>
  );
}
export default ExhibitionForm;
