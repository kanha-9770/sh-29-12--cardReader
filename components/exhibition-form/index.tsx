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
// export default ExhibitionForm;


// "use client";
// import React, {
//   useCallback,
//   useEffect,
//   useMemo,
//   useRef,
//   useState,
// } from "react";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Switch } from "@/components/ui/switch";
// import { Checkbox } from "@/components/ui/checkbox";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import Image from "next/image";
// import {
//   Upload,
//   X,
//   Camera,
//   RefreshCw,
//   GripVertical,
//   Trash2,
//   Settings,
//   ChevronDown,
//   Calendar,
//   Columns,
//   Zap,
//   Plus,
// } from "lucide-react";
// import { Progress } from "@/components/ui/progress";
// import { type FormData } from "@/types/form";
// import { PopupModal } from "@/components/popup-modal";
// import { useRouter, useSearchParams } from "next/navigation";
// import { toast as toastify, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// /* DnD-kit */
// import {
//   DndContext,
//   closestCenter,
//   PointerSensor,
//   useSensor,
//   useSensors,
//   DragOverlay,
//   MeasuringStrategy,
//   useDroppable,
//   useDraggable,
// } from "@dnd-kit/core";
// import {
//   SortableContext,
//   verticalListSortingStrategy,
//   useSortable,
//   arrayMove,
// } from "@dnd-kit/sortable";
// import { CSS } from "@dnd-kit/utilities";
// import { motion, AnimatePresence } from "framer-motion";

// type FieldType =
//   | "text"
//   | "email"
//   | "number"
//   | "textarea"
//   | "select"
//   | "checkbox"
//   | "radio"
//   | "date"
//   | "file";

// interface FieldOption {
//   label: string;
//   value: string;
// }

// interface BuilderField {
//   uid: string;
//   type: FieldType;
//   label: string;
//   name: string;
//   placeholder?: string;
//   required?: boolean;
//   options?: FieldOption[];
//   accept?: string;
//   colSpan?: 1 | 2 | 3 | 4;
// }

// interface ExhibitionFormProps {
//   initialData?: Partial<FormData>;
//   onSubmit?: (data: FormData) => Promise<void> | void;
//   isEdit?: boolean;
//   formId?: string;
// }

// function uid(prefix = "") {
//   return `${prefix}${Math.random().toString(36).slice(2, 9)}`;
// }

// function SortableFieldItem({
//   id,
//   children,
//   sortable = true,
// }: {
//   id: string;
//   children: React.ReactNode;
//   sortable?: boolean;
// }) {
//   const {
//     attributes,
//     listeners,
//     setNodeRef,
//     transform,
//     transition,
//     isDragging,
//   } = useSortable({ id });
//   const style = {
//     transform: CSS.Transform.toString(transform),
//     transition,
//     opacity: isDragging ? 0.8 : 1,
//     cursor: sortable ? "grab" : "default",
//   } as React.CSSProperties;

//   return (
//     <motion.div
//       ref={setNodeRef}
//       style={style}
//       {...attributes}
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: -20, scale: 0.95 }}
//       transition={{ duration: 0.2 }}
//       className="overflow-hidden"
//     >
//       {sortable ? (
//         <div className="flex items-start gap-3">
//           <motion.div
//             {...listeners}
//             className="pt-2 cursor-grab active:cursor-grabbing"
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//           >
//             <div className="p-2 rounded-md bg-gray-100 border border-gray-200">
//               <GripVertical className="w-4 h-4 text-gray-600" />
//             </div>
//           </motion.div>
//           <div className="flex-1">{children}</div>
//         </div>
//       ) : (
//         <div>{children}</div>
//       )}
//     </motion.div>
//   );
// }

// function DraggableBlock({
//   id,
//   children,
// }: {
//   id: string;
//   children: React.ReactNode;
// }) {
//   const { attributes, listeners, setNodeRef, transform, isDragging } =
//     useDraggable({ id });
//   const style = {
//     transform: CSS.Transform.toString(transform),
//   } as React.CSSProperties;

//   return (
//     <motion.div
//       ref={setNodeRef}
//       style={style}
//       {...attributes}
//       {...listeners}
//       className={`flex items-center justify-between p-3 border rounded-lg cursor-grab hover:bg-gray-50 transition-all duration-200 ${
//         isDragging ? "opacity-50 scale-105 shadow-lg" : ""
//       }`}
//       whileHover={{ scale: 1.02 }}
//       whileTap={{ scale: 0.98 }}
//     >
//       {children}
//     </motion.div>
//   );
// }

// function DroppableFormArea({ children }: { children: React.ReactNode }) {
//   const { setNodeRef, isOver } = useDroppable({ id: "form-drop" });
//   return (
//     <motion.div
//       ref={setNodeRef}
//       className={`border border-dashed rounded-md p-2 sm:p-4 transition-all duration-300 min-h-64 sm:min-h-96 ${
//         isOver
//           ? "border-blue-400 bg-blue-50 shadow-md"
//           : "border-gray-200 bg-gray-50"
//       }`}
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       whileHover={{ scale: 1.005 }}
//     >
//       <AnimatePresence>
//         {isOver && (
//           <motion.div
//             initial={{ opacity: 0, scale: 0.9 }}
//             animate={{ opacity: 1, scale: 1 }}
//             exit={{ opacity: 0, scale: 0.9 }}
//             className="text-center text-blue-600 text-sm mb-4 p-2 bg-blue-100 rounded"
//           >
//             Drop here to add field
//           </motion.div>
//         )}
//       </AnimatePresence>
//       {children}
//     </motion.div>
//   );
// }

// function DroppableFieldSlot({ id }: { id: string }) {
//   const { setNodeRef, isOver } = useDroppable({ id });
//   return (
//     <div
//       ref={setNodeRef}
//       className={`w-full transition-all duration-200 ${
//         isOver
//           ? "h-4 bg-blue-50 border-2 border-dashed border-blue-400 rounded-md flex items-center justify-center"
//           : "h-0"
//       }`}
//     >
//       {isOver && <span className="text-xs text-blue-600">Drop field here</span>}
//     </div>
//   );
// }

// function FieldEditor({
//   field,
//   onSave,
//   onClose,
// }: {
//   field: BuilderField;
//   onSave: (updated: BuilderField) => void;
//   onClose: () => void;
// }) {
//   const [edited, setEdited] = useState(field);

//   const addOption = () => {
//     setEdited({
//       ...edited,
//       options: [...(edited.options || []), { label: "", value: "" }],
//     });
//   };

//   const updateOption = (idx: number, key: "label" | "value", val: string) => {
//     const opts = [...(edited.options || [])];
//     opts[idx] = { ...opts[idx], [key]: val };
//     setEdited({ ...edited, options: opts });
//   };

//   const removeOption = (idx: number) => {
//     setEdited({
//       ...edited,
//       options: (edited.options || []).filter((_, i) => i !== idx),
//     });
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <motion.div
//         initial={{ scale: 0.9, opacity: 0 }}
//         animate={{ scale: 1, opacity: 1 }}
//         className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 max-h-screen overflow-y-auto"
//       >
//         <h3 className="text-lg font-semibold mb-4">Edit Field</h3>
//         <div className="space-y-4">
//           <div>
//             <Label>Field Label *</Label>
//             <Input
//               value={edited.label}
//               onChange={(e) => setEdited({ ...edited, label: e.target.value })}
//             />
//           </div>
//           <div>
//             <Label>Field Name (key) *</Label>
//             <Input
//               value={edited.name}
//               onChange={(e) => setEdited({ ...edited, name: e.target.value })}
//               placeholder="e.g. phone, company"
//             />
//           </div>
//           {["text", "email", "textarea"].includes(edited.type) && (
//             <div>
//               <Label>Placeholder</Label>
//               <Input
//                 value={edited.placeholder || ""}
//                 onChange={(e) =>
//                   setEdited({ ...edited, placeholder: e.target.value })
//                 }
//               />
//             </div>
//           )}
//           {(edited.type === "select" || edited.type === "radio") && (
//             <div>
//               <Label>Options</Label>
//               <div className="space-y-2">
//                 {(edited.options || []).map((opt, idx) => (
//                   <div key={idx} className="flex gap-2">
//                     <Input
//                       placeholder="Label"
//                       value={opt.label}
//                       onChange={(e) =>
//                         updateOption(idx, "label", e.target.value)
//                       }
//                     />
//                     <Input
//                       placeholder="Value"
//                       value={opt.value}
//                       onChange={(e) =>
//                         updateOption(idx, "value", e.target.value)
//                       }
//                     />
//                     <Button
//                       size="icon"
//                       variant="ghost"
//                       onClick={() => removeOption(idx)}
//                     >
//                       <X className="w-4 h-4" />
//                     </Button>
//                   </div>
//                 ))}
//                 <Button size="sm" variant="outline" onClick={addOption}>
//                   Add Option
//                 </Button>
//               </div>
//             </div>
//           )}
//           {edited.type === "file" && (
//             <div>
//               <Label>Accept (MIME types)</Label>
//               <Input
//                 value={edited.accept || ""}
//                 onChange={(e) =>
//                   setEdited({ ...edited, accept: e.target.value })
//                 }
//                 placeholder="e.g. image/*, .pdf"
//               />
//             </div>
//           )}
//           <div className="flex items-center gap-2">
//             <Switch
//               checked={edited.required || false}
//               onCheckedChange={(c) => setEdited({ ...edited, required: c })}
//               className="data-[state=checked]:bg-[#3c335f]"
//             />
//             <Label>Required</Label>
//           </div>

//           <div>
//             <Label>Width in Row</Label>
//             <div className="grid grid-cols-4 gap-2 mt-2">
//               {[1, 2, 3, 4].map((span) => {
//                 const active = edited.colSpan === span;
//                 return (
//                   <Button
//                     key={span}
//                     size="sm"
//                     variant={active ? "default" : "outline"}
//                     onClick={() =>
//                       setEdited({ ...edited, colSpan: span as 1 | 2 | 3 | 4 })
//                     }
//                     className={`flex items-center gap-1 ${
//                       active
//                         ? "bg-gradient-to-r from-[#483d73] to-[#352c55] text-white"
//                         : ""
//                     }`}
//                   >
//                     <Columns className="w-3 h-3" />
//                     {span}
//                   </Button>
//                 );
//               })}
//             </div>
//           </div>
//         </div>
//         <div className="flex justify-end gap-2 mt-6">
//           <Button variant="outline" onClick={onClose}>
//             Cancel
//           </Button>
//           <Button
//             className="text-white bg-[#483d73] hover:bg-[#352c55]"
//             onClick={() => {
//               if (!edited.label || !edited.name) {
//                 toastify.error("Label and Name are required");
//                 return;
//               }
//               onSave(edited);
//               onClose();
//             }}
//           >
//             Save
//           </Button>
//         </div>
//       </motion.div>
//     </div>
//   );
// }

// export function ExhibitionForm({
//   initialData = {},
//   onSubmit,
//   isEdit = false,
// }: ExhibitionFormProps) {
//   const searchParams = useSearchParams();
//   const router = useRouter();

//   const LIMIT = 15;
//   const [submissionCount, setSubmissionCount] = useState<number>(0);
//   const [isLoadingCount, setIsLoadingCount] = useState<boolean>(true);
//   const [limitReached, setLimitReached] = useState<boolean>(false);
//   const [mobileFieldPanelOpen, setMobileFieldPanelOpen] = useState(false);
//   const [isAdmin, setIsAdmin] = useState<boolean>(false);
//   const [isCheckingAdmin, setIsCheckingAdmin] = useState<boolean>(true);

//   const defaultFormData: FormData = {
//     cardNo: (searchParams?.get("cardNo") as string) || "",
//     salesPerson: (searchParams?.get("salesPerson") as string) || "",
//     date: new Date().toISOString().split("T")[0],
//     country:
//       (searchParams?.get("exhibition") as string) || "LABEL EXPO SPAIN 2025",
//     cardFrontPhoto: "",
//     cardBackPhoto: "",
//     leadStatus: (searchParams?.get("leadStatus") as string) || "",
//     dealStatus: (searchParams?.get("dealStatus") as string) || "",
//     meetingAfterExhibition:
//       searchParams?.get("meetingAfterExhibition")?.toLowerCase() === "true" ||
//       false,
//     industryCategories:
//       (searchParams?.get("industryCategories") as string) || "",
//     description: "",
//     extractedData: null,
//     mergedData: null,
//     status: "PENDING",
//     extractionStatus: "PENDING",
//     zohoStatus: "PENDING",
//     userId: undefined,
//     user: undefined,
//     createdAt: undefined,
//     updatedAt: undefined,
//   };

//   const [formData, setFormData] = useState<FormData & Record<string, any>>({
//     ...defaultFormData,
//     ...initialData,
//   });

//   useEffect(() => {
//     if (initialData?.additionalData && isEdit) {
//       setFormData((prev) => ({ ...prev, ...initialData.additionalData }));
//     }
//   }, [initialData, isEdit]);

//   useEffect(() => {
//     if (!isEdit && !formData.cardNo.trim()) {
//       const generateCardNo = async () => {
//         try {
//           const countRes = await fetch("/api/form-count", {
//             credentials: "include",
//           });
//           if (!countRes.ok) throw new Error("Failed to fetch form count");
//           const { count } = await countRes.json();
//           const nextNo = String(count + 1).padStart(3, "0");
//           setFormData((prev) => ({ ...prev, cardNo: nextNo }));
//           toastify.success(`Auto-generated Card Number: ${nextNo}`);
//         } catch (err) {
//           console.error("Error generating card number:", err);
//           toastify.error("Failed to auto-generate card number.");
//         }
//       };
//       generateCardNo();
//     }
//   }, [isEdit, formData.cardNo]);

//   const [frontImagePreview, setFrontImagePreview] = useState<string | null>(
//     initialData?.cardFrontPhoto || null
//   );
//   const [backImagePreview, setBackImagePreview] = useState<string | null>(
//     initialData?.cardBackPhoto || null
//   );
//   const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
//   const [showBackImageModal, setShowBackImageModal] = useState<boolean>(false);
//   const [frontUploadProgress, setFrontUploadProgress] = useState<number>(0);
//   const [backUploadProgress, setBackUploadProgress] = useState<number>(0);

//   const videoRef = useRef<HTMLVideoElement>(null);
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);
//   const [currentImageType, setCurrentImageType] = useState<
//     "front" | "back" | null
//   >(null);
//   const [facingMode, setFacingMode] = useState<"user" | "environment">(
//     "environment"
//   );


//   const [formFields, setFormFields] = useState<BuilderField[]>([]);
//   const [editingField, setEditingField] = useState<BuilderField | null>(null);
//   const [pendingInsertIndex, setPendingInsertIndex] = useState<number | null>(
//     null
//   );

//   const defaultDynamicFields: Omit<BuilderField, "uid">[] = [
//     {
//       type: "text",
//       label: "Company",
//       name: "company",
//       required: true,
//       colSpan: 2,
//     },
//     {
//       type: "text",
//       label: "Contact Person",
//       name: "contactPerson",
//       required: true,
//       colSpan: 2,
//     },
//     {
//       type: "text",
//       label: "Phone",
//       name: "phone",
//       required: true,
//       colSpan: 2,
//       placeholder: "+91 98765 43210",
//     },
//     {
//       type: "email",
//       label: "Email",
//       name: "email",
//       required: true,
//       colSpan: 2,
//       placeholder: "name@company.com",
//     },
//   ];

//   const freshDefaults = useMemo(
//     () =>
//       defaultDynamicFields.map((f) => ({
//         ...f,
//         uid: uid("f_"),
//       })),
//     []
//   );

//   // Load form fields
//   useEffect(() => {
//     const loadFields = async () => {
//       setIsCheckingAdmin(true);

//       if (isEdit) {
//         setFormFields(freshDefaults);
//         setIsCheckingAdmin(false);
//         return;
//       }

//       try {
//         // FETCH FROM CORRECT ENDPOINT
//         const res = await fetch("/api/current-user", {
//           credentials: "include",
//         });

//         if (!res.ok) throw new Error("Failed to fetch user");

//         const { isAdmin: admin } = await res.json();
//         setIsAdmin(admin);

//         // Load saved fields only for admin
//         if (admin) {
//           const saved = localStorage.getItem("exhibitionFormFields");
//           if (saved) {
//             try {
//               const parsed = JSON.parse(saved);
//               setFormFields(parsed);
//               toastify.success("Custom form loaded");
//             } catch (e) {
//               console.error("Invalid saved fields:", e);
//               setFormFields(freshDefaults);
//             }
//           } else {
//             setFormFields(freshDefaults);
//           }
//         } else {
//           setFormFields(freshDefaults);
//           toastify.info("Form locked — fill & submit only");
//         }
//       } catch (err) {
//         console.log("No session or API error → user mode");
//         setIsAdmin(false);
//         setFormFields(freshDefaults);
//       } finally {
//         setIsCheckingAdmin(false);
//       }
//     };

//     loadFields();
//   }, [isEdit, freshDefaults]);

//   // Save form fields to localStorage (only for admins, not in edit mode)
//   useEffect(() => {
//     if (isEdit || !isAdmin || formFields.length === 0) return;
//     localStorage.setItem("exhibitionFormFields", JSON.stringify(formFields));
//   }, [formFields, isEdit, isAdmin]);

//   const availableFieldTypes = [
//     {
//       type: "text" as const,
//       label: "Single line text",
//       icon: <div className="w-5 h-5 border rounded" />,
//     },
//     {
//       type: "email" as const,
//       label: "Email",
//       icon: <div className="w-5 h-5 border rounded" />,
//     },
//     {
//       type: "number" as const,
//       label: "Number",
//       icon: <div className="w-5 h-5 border rounded" />,
//     },
//     {
//       type: "textarea" as const,
//       label: "Multi line text",
//       icon: <div className="w-3 h-3 border rounded mx-auto" />,
//     },
//     {
//       type: "select" as const,
//       label: "Dropdown",
//       icon: <ChevronDown className="w-5 h-5" />,
//     },
//     {
//       type: "checkbox" as const,
//       label: "Checkbox",
//       icon: <div className="w-4 h-4 border rounded" />,
//     },
//     {
//       type: "radio" as const,
//       label: "Radio Group",
//       icon: <div className="w-4 h-4 rounded-full border" />,
//     },
//     {
//       type: "date" as const,
//       label: "Date",
//       icon: <Calendar className="w-5 h-5" />,
//     },
//     {
//       type: "file" as const,
//       label: "File Upload",
//       icon: <Upload className="w-5 h-5" />,
//     },
//   ];


//   const addDefaultFields = () => {
//     const newFields = defaultDynamicFields.map((f) => ({
//       ...f,
//       uid: uid("f_"),
//     }));
//     setFormFields((prev) => [...prev, ...newFields]);
//     toastify.success("Default form fields added!");
//     setMobileFieldPanelOpen(false);
//   };

//   const handleMobileTapAdd = (type: FieldType) => {
//     const newField: BuilderField = {
//       uid: uid("f_"),
//       type,
//       label: type.charAt(0).toUpperCase() + type.slice(1),
//       name: `field_${uid()}`,
//       required: false,
//       colSpan: 2,
//       options:
//         type === "select" || type === "radio"
//           ? [{ label: "Option 1", value: "1" }]
//           : undefined,
//     };
//     setPendingInsertIndex(formFields.length);
//     setEditingField(newField);
//     setMobileFieldPanelOpen(false);
//     toastify.info("Editing new field...");
//   };

//   const saveField = (field: BuilderField) => {
//     setFormFields((prev) => {
//       const exists = prev.some((f) => f.uid === field.uid);
//       if (exists) {
//         return prev.map((f) => (f.uid === field.uid ? field : f));
//       } else {
//         const index = pendingInsertIndex ?? prev.length;
//         return [...prev.slice(0, index), field, ...prev.slice(index)];
//       }
//     });
//     setPendingInsertIndex(null);
//     toastify.success("Field saved!");
//   };

//   const removeField = (uid: string) => {
//     setFormFields((prev) => prev.filter((f) => f.uid !== uid));
//     toastify.success("Field removed");
//   };

//   const sensors = useSensors(
//     useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
//   );
//   const [activeDragId, setActiveDragId] = useState<string | null>(null);

//   const groupFieldsIntoRows = useCallback((fields: BuilderField[]) => {
//     const rows: BuilderField[][] = [];
//     let currentRow: BuilderField[] = [];
//     let currentCols = 0;

//     fields.forEach((field) => {
//       const span = field.colSpan || 1;
//       if (currentCols + span > 4) {
//         rows.push(currentRow);
//         currentRow = [field];
//         currentCols = span;
//       } else {
//         currentRow.push(field);
//         currentCols += span;
//       }
//     });

//     if (currentRow.length > 0) {
//       rows.push(currentRow);
//     }

//     return rows;
//   }, []);

//   const fieldRows = useMemo(
//     () => groupFieldsIntoRows(formFields),
//     [formFields, groupFieldsIntoRows]
//   );

//   const getInsertIndex = useCallback(
//     (overId: string) => {
//       if (overId === "slot-start") {
//         return 0;
//       } else if (overId === "form-drop") {
//         return formFields.length;
//       } else if (overId.startsWith("slot-row-")) {
//         const rowIndex = parseInt(overId.split("-")[2]);
//         return fieldRows
//           .slice(0, rowIndex + 1)
//           .reduce((sum, row) => sum + row.length, 0);
//       } else {
//         const fieldIndex = formFields.findIndex((f) => f.uid === overId);
//         return fieldIndex >= 0 ? fieldIndex + 1 : formFields.length;
//       }
//     },
//     [formFields, fieldRows]
//   );

//   const onDragStart = ({ active }: any) => setActiveDragId(active.id);
//   const onDragEnd = ({ active, over }: any) => {
//     if (!isAdmin || isEdit || isCheckingAdmin) {
//       setActiveDragId(null);
//       return;
//     }
//     setActiveDragId(null);
//     if (!over) return;

//     const activeId = String(active.id);
//     const overId = String(over.id);
//     const isNewField = activeId.startsWith("block-");

//     if (isNewField) {
//       const type = activeId.replace("block-", "") as FieldType;
//       const insertIndex = getInsertIndex(overId);

//       const newField: BuilderField = {
//         uid: uid("f_"),
//         type,
//         label: type.charAt(0).toUpperCase() + type.slice(1),
//         name: `field_${uid()}`,
//         required: false,
//         colSpan: 1,
//         options:
//           type === "select" || type === "radio"
//             ? [{ label: "Option 1", value: "1" }]
//             : undefined,
//       };

//       setPendingInsertIndex(insertIndex);
//       setEditingField(newField);
//       return;
//     }

//     // Reordering existing field
//     const oldIndex = formFields.findIndex((f) => f.uid === activeId);
//     if (oldIndex === -1) return;

//     const newIndex = getInsertIndex(overId);

//     if (oldIndex !== newIndex && oldIndex !== newIndex - 1) {
//       setFormFields((items) =>
//         arrayMove(
//           items,
//           oldIndex,
//           newIndex > oldIndex ? newIndex - 1 : newIndex
//         )
//       );
//     }
//   };

//   const onDragCancel = () => setActiveDragId(null);

//   const isFormValid = useMemo(() => {
//     if (!formData.cardNo?.trim()) return false;
//     if (!formData.cardFrontPhoto) return false;

//     for (const field of formFields) {
//       if (field.required) {
//         const value = (formData as any)[field.name];
//         if (field.type === "checkbox") {
//           if (value !== true) return false;
//         } else if (field.type === "file") {
//           if (!value) return false;
//         } else {
//           if (!value || (typeof value === "string" && !value.trim())) {
//             return false;
//           }
//         }
//       }
//     }
//     return true;
//   }, [formData, formFields]);

//   const renderField = (field: BuilderField) => {
//     const value = (formData as any)[field.name] || "";
//     const setValue = (val: any) =>
//       setFormData((prev) => ({ ...prev, [field.name]: val }));

//     switch (field.type) {
//       case "text":
//       case "email":
//       case "number":
//         return (
//           <Input
//             type={field.type}
//             placeholder={field.placeholder}
//             value={value}
//             onChange={(e) => setValue(e.target.value)}
//             required={field.required}
//             className="h-9 sm:h-auto"
//           />
//         );
//       case "textarea":
//         return (
//           <Textarea
//             placeholder={field.placeholder}
//             value={value}
//             onChange={(e) => setValue(e.target.value)}
//             required={field.required}
//             className="h-16 sm:h-auto"
//           />
//         );
//       case "select":
//         return (
//           <Select value={value} onValueChange={setValue}>
//             <SelectTrigger className="h-9 sm:h-auto">
//               <SelectValue placeholder={field.placeholder || "Select..."} />
//             </SelectTrigger>
//             <SelectContent>
//               {field.options?.map((opt) => (
//                 <SelectItem key={opt.value} value={opt.value}>
//                   {opt.label}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         );
//       case "checkbox":
//         return (
//           <div className="flex items-center gap-2">
//             <Checkbox
//               checked={value === true}
//               onCheckedChange={setValue}
//               required={field.required}
//             />
//           </div>
//         );
//       case "radio":
//         return (
//           <RadioGroup value={value} onValueChange={setValue}>
//             {field.options?.map((opt) => (
//               <div key={opt.value} className="flex items-center gap-2">
//                 <RadioGroupItem value={opt.value} />
//                 <Label>{opt.label}</Label>
//               </div>
//             ))}
//           </RadioGroup>
//         );
//       case "date":
//         return (
//           <Input
//             type="date"
//             value={value}
//             onChange={(e) => setValue(e.target.value)}
//             required={field.required}
//             className="h-9 sm:h-auto"
//           />
//         );
//       case "file":
//         return (
//           <Input
//             type="file"
//             accept={field.accept}
//             onChange={(e) => {
//               const file = e.target.files?.[0];
//               if (file) setValue(file);
//             }}
//             required={field.required}
//             className="h-9 sm:h-auto"
//           />
//         );
//       default:
//         return null;
//     }
//   };

//   const renderRow = (fields: BuilderField[]) => {
//     const canEdit = isAdmin && !isEdit && !isCheckingAdmin;
//     const totalCols = fields.reduce((sum, f) => sum + (f.colSpan || 1), 0);
//     const effectiveCols = totalCols > 4 ? 4 : totalCols;

//     return (
//       <div className="grid grid-cols-4 gap-2 sm:gap-4">
//         {fields.map((field) => {
//           const span = field.colSpan || 1;
//           const colClass =
//             span === 1
//               ? "col-span-4 sm:col-span-2 lg:col-span-1"
//               : span === 2
//               ? "col-span-4 sm:col-span-2 lg:col-span-2"
//               : span === 3
//               ? "col-span-4 lg:col-span-3"
//               : "col-span-4";

//           return (
//             <div key={field.uid} className={colClass}>
//               <SortableFieldItem id={field.uid} sortable={canEdit}>
//                 <div className="bg-gray-50 p-2 sm:p-4 rounded-lg border space-y-2 sm:space-y-3">
//                   <div className="flex justify-between items-start">
//                     <div>
//                       <h4 className="font-medium text-xs sm:text-sm">
//                         {field.label}
//                       </h4>
//                       <p className="text-xs text-gray-500">{field.type}</p>
//                     </div>
//                     {canEdit && (
//                       <div className="flex gap-1">
//                         <Button
//                           size="icon"
//                           variant="ghost"
//                           onClick={() => setEditingField(field)}
//                         >
//                           <Settings className="w-3 h-3" />
//                         </Button>
//                         <Button
//                           size="icon"
//                           variant="ghost"
//                           onClick={() => removeField(field.uid)}
//                         >
//                           <Trash2 className="w-3 h-3" />
//                         </Button>
//                       </div>
//                     )}
//                   </div>
//                   <div className="space-y-1">
//                     <Label className="text-xs">
//                       {field.label}{" "}
//                       {field.required && (
//                         <span className="text-red-500">*</span>
//                       )}
//                     </Label>
//                     {renderField(field)}
//                   </div>
//                 </div>
//               </SortableFieldItem>
//             </div>
//           );
//         })}
//         {effectiveCols < 4 &&
//           Array.from({ length: 4 - effectiveCols }).map((_, i) => (
//             <div key={`empty-${i}`} className="col-span-1" />
//           ))}
//       </div>
//     );
//   };

//   const renderDragOverlay = () => {
//     if (!activeDragId) return null;
//     if (String(activeDragId).startsWith("block-")) {
//       const type = String(activeDragId).replace("block-", "");
//       const block = availableFieldTypes.find((b) => b.type === type);
//       return block ? (
//         <div className="p-3 bg-white border rounded-lg shadow-lg">
//           <div className="text-sm font-medium">{block.label}</div>
//         </div>
//       ) : null;
//     }
//     const field = formFields.find((f) => f.uid === activeDragId);
//     return field ? (
//       <div className="bg-gray-50 border rounded-lg p-4 shadow-lg">
//         <div className="font-medium">{field.label}</div>
//         <div className="text-xs text-gray-500">{field.type}</div>
//       </div>
//     ) : null;
//   };

//   const openCamera = useCallback(
//     (type: "front" | "back") => {
//       if (limitReached) return;
//       setCurrentImageType(type);
//       setIsCameraOpen(true);
//       startCameraStream();
//     },
//     [limitReached]
//   );

//   const startCameraStream = async () => {
//     try {
//       if (videoRef.current) {
//         stopCameraStream();
//         const stream = await navigator.mediaDevices.getUserMedia({
//           video: {
//             facingMode: { ideal: facingMode },
//             width: { ideal: 1280 },
//             height: { ideal: 720 },
//           },
//         });
//         videoRef.current.srcObject = stream;
//         await videoRef.current.play();
//       }
//     } catch (err) {
//       console.error("Camera error:", err);
//       toastify.error(
//         "Camera access denied or unavailable. Please check permissions and try again."
//       );
//       setIsCameraOpen(false);
//     }
//   };

//   useEffect(() => {
//     if (isCameraOpen) startCameraStream();
//     return () => stopCameraStream();
//   }, [isCameraOpen, facingMode]);

//   const captureImage = () => {
//     if (videoRef.current && canvasRef.current && currentImageType) {
//       const video = videoRef.current;
//       const canvas = canvasRef.current;
//       canvas.width = video.videoWidth;
//       canvas.height = video.videoHeight;
//       const ctx = canvas.getContext("2d");
//       if (ctx) {
//         ctx.drawImage(video, 0, 0);
//         canvas.toBlob(
//           (blob) => {
//             if (blob) {
//               const file = new File([blob], `${currentImageType}.jpg`, {
//                 type: "image/jpeg",
//               });
//               handleImageChange(
//                 { target: { files: [file] } } as any,
//                 currentImageType
//               );
//             }
//           },
//           "image/jpeg",
//           0.9
//         );
//       }
//       closeCamera();
//     }
//   };

//   const stopCameraStream = () => {
//     if (videoRef.current?.srcObject) {
//       (videoRef.current.srcObject as MediaStream)
//         .getTracks()
//         .forEach((t) => t.stop());
//     }
//   };
//   const closeCamera = () => {
//     setIsCameraOpen(false);
//     stopCameraStream();
//   };

//   const handleImageChange = async (
//     e: React.ChangeEvent<HTMLInputElement>,
//     type: "front" | "back"
//   ) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     const reader = new FileReader();
//     reader.onload = (ev) =>
//       type === "front"
//         ? setFrontImagePreview(ev.target?.result as string)
//         : setBackImagePreview(ev.target?.result as string);
//     reader.readAsDataURL(file);
//     await uploadImage(file, type);
//   };

//   const uploadImage = async (file: File, type: "front" | "back") => {
//     const fd = new FormData();
//     fd.append("image", file);
//     fd.append("type", type);
//     const setter =
//       type === "front" ? setFrontUploadProgress : setBackUploadProgress;
//     setter(0);
//     const xhr = new XMLHttpRequest();
//     xhr.open("POST", "/api/upload-image", true);
//     xhr.upload.onprogress = (ev) => {
//       if (ev.lengthComputable) setter((ev.loaded / ev.total) * 100);
//     };
//     xhr.onload = () => {
//       if (xhr.status === 200) {
//         const resp = JSON.parse(xhr.responseText);
//         const url = resp.imageUrl || resp.url;
//         setFormData((prev) => ({
//           ...prev,
//           [type === "front" ? "cardFrontPhoto" : "cardBackPhoto"]: url,
//         }));
//         type === "front" ? setFrontImagePreview(url) : setBackImagePreview(url);
//       }
//       setter(0);
//     };
//     xhr.send(fd);
//   };

//   const handleRemoveImage = (type: "front" | "back") => {
//     if (type === "front") {
//       setFrontImagePreview(null);
//       setFormData((prev) => ({ ...prev, cardFrontPhoto: "" }));
//     } else {
//       setBackImagePreview(null);
//       setFormData((prev) => ({ ...prev, cardBackPhoto: "" }));
//     }
//   };

//   const handleSubmit = async (e?: React.FormEvent) => {
//     e?.preventDefault();
//     if (!isFormValid || isSubmitting || limitReached) {
//       toastify.error(
//         "Please fill all required fields and upload front card image."
//       );
//       return;
//     }
//     setIsSubmitting(true);
//     try {
//       const submissionData: any = { ...formData };
//       if (!submissionData.cardBackPhoto) delete submissionData.cardBackPhoto;

//       if (onSubmit && isEdit) await onSubmit(submissionData);
//       else {
//         const res = await fetch("/api/submit-form", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(submissionData),
//         });
//         if (!res.ok) throw new Error("Submit failed");
//         const data = await res.json();
//         router.push(`/submission/${data.formId}`);
//       }

//       toastify.success("Submitted!");
//       if (!isEdit) {
//         setSubmissionCount((c) => c + 1);
//         setFormData(defaultFormData);
//         setFrontImagePreview(null);
//         setBackImagePreview(null);
//       }
//     } catch (err) {
//       toastify.error(err instanceof Error ? err.message : "Submit failed");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   useEffect(() => {
//     const fetchCount = async () => {
//       try {
//         setIsLoadingCount(true);
//         const res = await fetch("/api/form-count", { credentials: "include" });
//         if (res.ok) {
//           const data = await res.json();
//           const count = data.count ?? 0;
//           setSubmissionCount(count);
//           if (!isEdit && count >= LIMIT) {
//             setLimitReached(true);
//             router.replace("/pricing");
//           }
//         } else if (res.status === 403) {
//           const data = await res.json();
//           if (data.limitReached && !isEdit) {
//             setLimitReached(true);
//             router.replace("/pricing");
//           }
//         }
//       } catch (err) {
//         toastify.error("Failed to load limit");
//       } finally {
//         setIsLoadingCount(false);
//       }
//     };
//     fetchCount();
//   }, [isEdit, router]);


//   const canBuildForm = isAdmin && !isEdit && !isCheckingAdmin;

//   if (isCheckingAdmin) {
//     return (
//       <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#483d73] mx-auto mb-4"></div>
//           <p>Checking permissions...</p>
//         </div>
//       </div>
//     );
//   }

//   function toggleCamera(
//     event: MouseEvent<HTMLButtonElement, MouseEvent>
//   ): void {
//     throw new Error("Function not implemented.");
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-6 sm:py-12">
//       <div className="max-w-7xl mx-auto grid grid-cols-12 gap-3 sm:gap-6 px-3 sm:px-4">
//         <DndContext
//           sensors={sensors}
//           collisionDetection={closestCenter}
//           onDragStart={onDragStart}
//           onDragEnd={onDragEnd}
//           onDragCancel={onDragCancel}
//           measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
//         >
//           {/* Desktop Sidebar - Only for admins in build mode */}
//           {canBuildForm && (
//             <div className="col-span-3 bg-white rounded-xl p-5 shadow-sm sticky top-6 h-fit hidden lg:block">
//               <h3 className="font-bold text-lg mb-3">Form Fields</h3>
//               <div className="space-y-2">
//                 <Button
//                   onClick={addDefaultFields}
//                   className="w-full justify-start bg-gradient-to-r from-[#483d73] to-[#352c55] text-white hover:from-[#352c55] hover:to-[#483d73]"
//                 >
//                   <Zap className="w-4 h-4 mr-2" />
//                   Add Default Form Fields
//                 </Button>
//                 <div className="h-px bg-gray-200 my-3" />
//                 {availableFieldTypes.map((f) => (
//                   <DraggableBlock key={f.type} id={`block-${f.type}`}>
//                     <div className="flex items-center gap-2">
//                       {f.icon}
//                       <span className="text-sm">{f.label}</span>
//                     </div>
//                   </DraggableBlock>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Main Form */}
//           <div
//             className={`col-span-12 ${
//               canBuildForm ? "lg:col-span-9" : "col-span-12"
//             }`}
//           >
//             <Card className="shadow-xl">
//               <CardHeader className="p-3 sm:p-6">
//                 <CardTitle className="text-base sm:text-xl">
//                   Custom Form Builder
//                 </CardTitle>
//                 {!isEdit && (
//                   <p className="text-xs text-gray-600 mt-1">
//                     Free submissions left:{" "}
//                     {isLoadingCount
//                       ? "..."
//                       : Math.max(0, LIMIT - submissionCount)}
//                   </p>
//                 )}
//                 {isAdmin && !isEdit && (
//                   <p className="text-xs text-green-600 mt-1">
//                     Admin mode: Form builder active
//                   </p>
//                 )}
//                 {!isAdmin && !isEdit && (
//                   <p className="text-xs text-amber-600 mt-1">
//                     Form is locked. Contact admin to modify fields.
//                   </p>
//                 )}
//               </CardHeader>
//               <CardContent className="p-3 sm:p-6 space-y-3 sm:space-y-6">
//                 <div className="space-y-1">
//                   <Label className="text-xs">
//                     Card Number <span className="text-red-500">*</span>
//                   </Label>
//                   <Input
//                     value={formData.cardNo}
//                     onChange={(e) =>
//                       setFormData({ ...formData, cardNo: e.target.value })
//                     }
//                     placeholder="Auto-generating..."
//                     className="h-8 sm:h-auto bg-gray-50"
//                   />
//                 </div>

//                 <div className="grid grid-cols-2 gap-2">
//                   <div className="space-y-1 sm:space-y-2">
//                     <Label className="text-xs">
//                       Card Front <span className="text-red-500">*</span>
//                     </Label>
//                     <div className="relative">
//                       <input
//                         id="front"
//                         type="file"
//                         accept="image/*"
//                         className="hidden"
//                         onChange={(e) => handleImageChange(e, "front")}
//                       />
//                       <label
//                         htmlFor="front"
//                         className="block h-32 sm:h-60 border-2 border-dashed rounded-lg cursor-pointer flex items-center justify-center relative overflow-hidden"
//                       >
//                         {frontImagePreview ? (
//                           <Image
//                             src={frontImagePreview}
//                             alt=""
//                             fill
//                             className="object-cover"
//                           />
//                         ) : (
//                           <Upload className="w-6 sm:w-10 h-6 sm:h-10 text-gray-400" />
//                         )}
//                       </label>
//                       <Button
//                         size="icon"
//                         className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2"
//                         onClick={() => openCamera("front")}
//                       >
//                         <Camera className="w-3 sm:w-4 h-3 sm:h-4" />
//                       </Button>
//                       {frontImagePreview && (
//                         <Button
//                           size="icon"
//                           variant="destructive"
//                           className="absolute top-1 right-1 sm:top-2 sm:right-2"
//                           onClick={() => handleRemoveImage("front")}
//                         >
//                           <X className="w-3 sm:w-4 h-3 sm:h-4" />
//                         </Button>
//                       )}
//                     </div>
//                     {frontUploadProgress > 0 && frontUploadProgress < 100 && (
//                       <Progress value={frontUploadProgress} className="h-1" />
//                     )}
//                   </div>

//                   <div className="space-y-1 sm:space-y-2">
//                     <Label className="text-xs">Card Back</Label>
//                     <div className="relative">
//                       <input
//                         id="back"
//                         type="file"
//                         accept="image/*"
//                         className="hidden"
//                         onChange={(e) => handleImageChange(e, "back")}
//                       />
//                       <label
//                         htmlFor="back"
//                         className="block h-32 sm:h-60 border-2 border-dashed rounded-lg cursor-pointer flex items-center justify-center relative overflow-hidden"
//                       >
//                         {backImagePreview ? (
//                           <Image
//                             src={backImagePreview}
//                             alt=""
//                             fill
//                             className="object-cover"
//                           />
//                         ) : (
//                           <Upload className="w-6 sm:w-10 h-6 sm:h-10 text-gray-400" />
//                         )}
//                       </label>
//                       <Button
//                         size="icon"
//                         className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2"
//                         onClick={() => setShowBackImageModal(true)}
//                       >
//                         <Camera className="w-3 sm:w-4 h-3 sm:h-4" />
//                       </Button>
//                       {backImagePreview && (
//                         <Button
//                           size="icon"
//                           variant="destructive"
//                           className="absolute top-1 right-1 sm:top-2 sm:right-2"
//                           onClick={() => handleRemoveImage("back")}
//                         >
//                           <X className="w-3 sm:w-4 h-3 sm:h-4" />
//                         </Button>
//                       )}
//                     </div>
//                     {backUploadProgress > 0 && backUploadProgress < 100 && (
//                       <Progress value={backUploadProgress} className="h-1" />
//                     )}
//                   </div>
//                 </div>

//                 <div className="space-y-1">
//                   <Label className="text-xs">Lead Status</Label>
//                   <Select
//                     value={formData.leadStatus}
//                     onValueChange={(val) =>
//                       setFormData({ ...formData, leadStatus: val })
//                     }
//                   >
//                     <SelectTrigger className="h-8 sm:h-auto">
//                       <SelectValue placeholder="Select lead status" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="hot">Hot</SelectItem>
//                       <SelectItem value="warm">Warm</SelectItem>
//                       <SelectItem value="cold">Cold</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <div className="space-y-1">
//                   <Label className="text-xs">Description</Label>
//                   <Textarea
//                     value={formData.description}
//                     onChange={(e) =>
//                       setFormData({ ...formData, description: e.target.value })
//                     }
//                     placeholder="Enter description"
//                     className="h-12 sm:h-auto"
//                   />
//                 </div>

//                 <div className="flex items-center space-x-2 sm:space-x-3">
//                   <Switch
//                     id="meeting"
//                     checked={formData.meetingAfterExhibition}
//                     onCheckedChange={(checked) =>
//                       setFormData({
//                         ...formData,
//                         meetingAfterExhibition: checked,
//                       })
//                     }
//                     className="data-[state=checked]:bg-[#483d73]"
//                     disabled={isSubmitting || !isFormValid || limitReached}
//                   />
//                   <Label
//                     htmlFor="meeting"
//                     className="text-xs font-medium text-gray-800"
//                   >
//                     Meeting After Exhibition
//                   </Label>
//                 </div>

//                 <DroppableFormArea>
//                   <SortableContext
//                     items={formFields.map((f) => f.uid)}
//                     strategy={verticalListSortingStrategy}
//                   >
//                     <div className="space-y-4 sm:space-y-6">
//                       {formFields.length === 0 ? (
//                         <div className="p-6 sm:p-10 text-center text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
//                           {typeof window !== "undefined" &&
//                           window.innerWidth < 1024 &&
//                           canBuildForm
//                             ? "Tap the purple button to add fields"
//                             : canBuildForm
//                             ? "Drag fields from the left to start building"
//                             : ""}
//                         </div>
//                       ) : (
//                         <>
//                           <DroppableFieldSlot id="slot-start" />
//                           <AnimatePresence>
//                             {fieldRows.map((row, rowIndex) => {
//                               const rowKey = row.map((f) => f.uid).join("-");
//                               return (
//                                 <motion.div
//                                   key={rowKey}
//                                   initial={{ opacity: 0, y: 20 }}
//                                   animate={{ opacity: 1, y: 0 }}
//                                   exit={{ opacity: 0, y: -20 }}
//                                   transition={{ duration: 0.2 }}
//                                 >
//                                   {renderRow(row)}
//                                   <DroppableFieldSlot
//                                     id={`slot-row-${rowIndex}`}
//                                   />
//                                 </motion.div>
//                               );
//                             })}
//                           </AnimatePresence>
//                         </>
//                       )}
//                     </div>
//                   </SortableContext>
//                 </DroppableFormArea>
//               </CardContent>
//               <CardFooter className="p-3 sm:p-6">
//                 <Button
//                   onClick={handleSubmit}
//                   className="w-full justify-center bg-gradient-to-r from-[#483d73] to-[#352c55] text-white hover:from-[#352c55] hover:to-[#483d73]"
//                   disabled={isSubmitting || !isFormValid || limitReached}
//                 >
//                   {isSubmitting ? "Submitting..." : "Submit Form"}
//                 </Button>
//               </CardFooter>
//             </Card>
//           </div>

//           <DragOverlay>{renderDragOverlay()}</DragOverlay>
//         </DndContext>

//         {/* Mobile FAB + Panel - Only for admins in build mode */}
       
//           {canBuildForm && (
//           <motion.div
//             drag
//             dragMomentum={false}
//             dragElastic={0.3}
//             className="fixed top-8 right-8 z-50"
//             whileDrag={{ scale: 1.2 }}
//           >
//             <Button
//               size="sm"
//               className="rounded-full w-14 h-14 shadow-2xl bg-gradient-to-r from-[#483d73] to-[#352c55] hover:from-[#352c55] hover:to-[#483d73]"
//               onClick={() => setMobileFieldPanelOpen(true)}
//             >
//               <Zap className="w-10 h-10" />
//             </Button>
//           </motion.div>
//         )}
          

//         <AnimatePresence>
//           {mobileFieldPanelOpen && canBuildForm && (
//             <>
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//                 onClick={() => setMobileFieldPanelOpen(false)}
//                 className="fixed inset-0 bg-black bg-opacity-70 z-40 lg:hidden"
//               />
//               <motion.div
//                 initial={{ x: "-100%" }}
//                 animate={{ x: 0 }}
//                 exit={{ x: "-100%" }}
//                 transition={{ type: "spring", damping: 35, stiffness: 400 }}
//                 className="fixed inset-y-0 left-0 z-50 lg:hidden bg-white w-11/12 max-w-sm shadow-2xl flex flex-col"
//               >
//                 {/* Header */}
//                 <div className="p-3 border-b bg-gradient-to-r from-[#483d73] to-[#352c55] flex justify-between items-center shrink-0">
//                   <h3 className="text-white font-bold text-base">Add Field</h3>
//                   <Button
//                     size="icon"
//                     variant="ghost"
//                     className="text-white"
//                     onClick={() => setMobileFieldPanelOpen(false)}
//                   >
//                     <X className="w-4 h-4" />
//                   </Button>
//                 </div>

//                 {/* Scrollable Content */}
//                 <div className="flex-1 overflow-y-auto">
//                   <div className="p-2 space-y-1.5">
//                     {/* Add All Default */}
//                     <motion.button
//                       whileTap={{ scale: 0.98 }}
//                       onClick={addDefaultFields}
//                       className="w-full flex items-center gap-2 p-2 bg-gradient-to-r from-[#483d73] to-[#352c55] text-white rounded-lg font-medium text-xs shadow-md hover:shadow-lg transition-all"
//                     >
//                       <Zap className="w-4 h-6" />
//                       <span>Add All Default Fields</span>
//                     </motion.button>

//                     <div className="h-px bg-gray-200 my-1.5" />

//                     {/* Field List */}
//                     <div className="space-y-1">
//                       {availableFieldTypes.map((f) => (
//                         <motion.button
//                           key={f.type}
//                           whileTap={{ scale: 0.97 }}
//                           onClick={() => handleMobileTapAdd(f.type)}
//                           className="w-full flex items-center gap-2 p-2 bg-gray-50 hover:bg-gray-100 rounded-md transition-all duration-200 border border-gray-200 hover:border-[#483d73] hover:shadow-sm"
//                         >
//                           <div className="p-1 bg-white rounded shadow-sm border border-gray-300">
//                             {React.cloneElement(f.icon as React.ReactElement, {
//                               className: "w-4 h-4 text-[#483d73]",
//                             })}
//                           </div>
//                           <span className="text-sm font-medium text-gray-600 flex-1 text-left">
//                             {f.label}
//                           </span>
//                           <Plus className="w-3 h-3 text-gray-400" />
//                         </motion.button>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               </motion.div>
//             </>
//           )}
//         </AnimatePresence>

//         {/* Camera Modal */}
//         {isCameraOpen && (
//           <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-6">
//             <div className="bg-white rounded-xl shadow-2xl overflow-hidden max-w-lg w-full">
//               <div className="p-4 bg-gray-200 border-b border-blue-100 flex justify-between items-center">
//                 <h3 className="text-lg font-semibold text-gray-900">
//                   Capture Photo
//                 </h3>
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   onClick={closeCamera}
//                   className="p-2 hover:bg-gray-100"
//                 >
//                   <X className="w-5 h-5 text-gray-600" />
//                 </Button>
//               </div>
//               <div className="relative bg-black">
//                 <video
//                   ref={videoRef}
//                   className="w-full h-auto"
//                   autoPlay
//                   playsInline
//                   muted
//                 />
//                 <canvas ref={canvasRef} className="hidden" />
//               </div>
//               <div className="p-4 flex justify-between items-center bg-gray-200">
//                 <Button
//                   variant="outline"
//                   onClick={toggleCamera}
//                   className="flex items-center gap-2 border-gray-300 hover:bg-gray-100"
//                 >
//                   <RefreshCw className="w-4 h-4" />
//                   Switch Camera
//                 </Button>
//                 <div className="flex gap-2">
//                   <Button
//                     onClick={captureImage}
//                     className="bg-[#483d73] hover:bg-[#5a5570] text-white"
//                   >
//                     Capture Photo
//                   </Button>
//                   <Button variant="ghost" onClick={closeCamera}>
//                     Close
//                   </Button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* All Modals */}
//         {editingField && (
//           <FieldEditor
//             field={editingField}
//             onSave={saveField}
//             onClose={() => {
//               setEditingField(null);
//               setPendingInsertIndex(null);
//             }}
//           />
//         )}
//         <PopupModal
//           isOpen={showBackImageModal}
//           onClose={() => setShowBackImageModal(false)}
//           onConfirm={() => {
//             setShowBackImageModal(false);
//             (document.getElementById("back") as HTMLInputElement)?.click();
//           }}
//           title="Upload Back Image"
//           description="Do you want to upload the back image?"
//         />
//         <ToastContainer position="bottom-right" />
//       </div>
//     </div>
//   );
// }

// export default ExhibitionForm;

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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Image from "next/image";
import {
  Upload,
  X,
  Camera,
  RefreshCw,
  GripVertical,
  Trash2,
  Settings,
  ChevronDown,
  Calendar,
  Columns,
  Zap,
  Plus,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { type FormData } from "@/types/form";
import { PopupModal } from "@/components/popup-modal";
import { useRouter, useSearchParams } from "next/navigation";
import { toast as toastify, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/* DnD-kit */
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
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion, AnimatePresence } from "framer-motion";

type FieldType =
  | "text"
  | "email"
  | "number"
  | "textarea"
  | "select"
  | "checkbox"
  | "radio"
  | "date"
  | "file";

interface FieldOption {
  label: string;
  value: string;
}

interface BuilderField {
  uid: string;
  type: FieldType;
  label: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  options?: FieldOption[];
  accept?: string;
  colSpan?: 1 | 2 | 3 | 4;
}

interface ExhibitionFormProps {
  initialData?: Partial<FormData>;
  onSubmit?: (data: FormData) => Promise<void> | void;
  isEdit?: boolean;
  formId?: string;
  additionalData?: Record<string, any>;
  disabledFields?: string[];
}

function uid(prefix = "") {
  return `${prefix}${Math.random().toString(36).slice(2, 9)}`;
}

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
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {children}
    </motion.div>
  );
}

function DroppableFormArea({ children }: { children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({ id: "form-drop" });
  return (
    <motion.div
      ref={setNodeRef}
      className={`border border-dashed rounded-md p-2 sm:p-4 transition-all duration-300 min-h-64 sm:min-h-96 ${
        isOver
          ? "border-blue-400 bg-blue-50 shadow-md"
          : "border-gray-200 bg-gray-50"
      }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      whileHover={{ scale: 1.005 }}
    >
      <AnimatePresence>
        {isOver && (
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

function DroppableFieldSlot({ id }: { id: string }) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      className={`w-full transition-all duration-200 ${
        isOver
          ? "h-4 bg-blue-50 border-2 border-dashed border-blue-400 rounded-md flex items-center justify-center"
          : "h-0"
      }`}
    >
      {isOver && <span className="text-xs text-blue-600">Drop field here</span>}
    </div>
  );
}

function FieldEditor({
  field,
  onSave,
  onClose,
}: {
  field: BuilderField;
  onSave: (updated: BuilderField) => void;
  onClose: () => void;
}) {
  const [edited, setEdited] = useState(field);

  const addOption = () => {
    setEdited({
      ...edited,
      options: [...(edited.options || []), { label: "", value: "" }],
    });
  };

  const updateOption = (idx: number, key: "label" | "value", val: string) => {
    const opts = [...(edited.options || [])];
    opts[idx] = { ...opts[idx], [key]: val };
    setEdited({ ...edited, options: opts });
  };

  const removeOption = (idx: number) => {
    setEdited({
      ...edited,
      options: (edited.options || []).filter((_, i) => i !== idx),
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 max-h-screen overflow-y-auto"
      >
        <h3 className="text-lg font-semibold mb-4">Edit Field</h3>
        <div className="space-y-4">
          <div>
            <Label>Field Label *</Label>
            <Input
              value={edited.label}
              onChange={(e) => setEdited({ ...edited, label: e.target.value })}
            />
          </div>
          <div>
            <Label>Field Name (key) *</Label>
            <Input
              value={edited.name}
              onChange={(e) => setEdited({ ...edited, name: e.target.value })}
              placeholder="e.g. phone, company"
            />
          </div>
          {["text", "email", "textarea"].includes(edited.type) && (
            <div>
              <Label>Placeholder</Label>
              <Input
                value={edited.placeholder || ""}
                onChange={(e) =>
                  setEdited({ ...edited, placeholder: e.target.value })
                }
              />
            </div>
          )}
          {(edited.type === "select" || edited.type === "radio") && (
            <div>
              <Label>Options</Label>
              <div className="space-y-2">
                {(edited.options || []).map((opt, idx) => (
                  <div key={idx} className="flex gap-2">
                    <Input
                      placeholder="Label"
                      value={opt.label}
                      onChange={(e) =>
                        updateOption(idx, "label", e.target.value)
                      }
                    />
                    <Input
                      placeholder="Value"
                      value={opt.value}
                      onChange={(e) =>
                        updateOption(idx, "value", e.target.value)
                      }
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => removeOption(idx)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button size="sm" variant="outline" onClick={addOption}>
                  Add Option
                </Button>
              </div>
            </div>
          )}
          {edited.type === "file" && (
            <div>
              <Label>Accept (MIME types)</Label>
              <Input
                value={edited.accept || ""}
                onChange={(e) =>
                  setEdited({ ...edited, accept: e.target.value })
                }
                placeholder="e.g. image/*, .pdf"
              />
            </div>
          )}
          <div className="flex items-center gap-2">
            <Switch
              checked={edited.required || false}
              onCheckedChange={(c) => setEdited({ ...edited, required: c })}
              className="data-[state=checked]:bg-[#3c335f]"
            />
            <Label>Required</Label>
          </div>

          <div>
            <Label>Width in Row</Label>
            <div className="grid grid-cols-4 gap-2 mt-2">
              {[1, 2, 3, 4].map((span) => {
                const active = edited.colSpan === span;
                return (
                  <Button
                    key={span}
                    size="sm"
                    variant={active ? "default" : "outline"}
                    onClick={() =>
                      setEdited({ ...edited, colSpan: span as 1 | 2 | 3 | 4 })
                    }
                    className={`flex items-center gap-1 ${
                      active
                        ? "bg-gradient-to-r from-[#483d73] to-[#352c55] text-white"
                        : ""
                    }`}
                  >
                    <Columns className="w-3 h-3" />
                    {span}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="text-white bg-[#483d73] hover:bg-[#352c55]"
            onClick={() => {
              if (!edited.label || !edited.name) {
                toastify.error("Label and Name are required");
                return;
              }
              onSave(edited);
              onClose();
            }}
          >
            Save
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

export function ExhibitionForm({
  initialData = {},
  onSubmit,
  isEdit = false,
  formId,
  additionalData = {},
  disabledFields = [],
}: ExhibitionFormProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const LIMIT = 15;
  const [submissionCount, setSubmissionCount] = useState<number>(0);
  const [isLoadingCount, setIsLoadingCount] = useState<boolean>(true);
  const [limitReached, setLimitReached] = useState<boolean>(false);
  const [mobileFieldPanelOpen, setMobileFieldPanelOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isCheckingAdmin, setIsCheckingAdmin] = useState<boolean>(true);

  const defaultFormData: FormData = {
    cardNo: (searchParams?.get("cardNo") as string) || "",
    salesPerson: (searchParams?.get("salesPerson") as string) || "",
    date: new Date().toISOString().split("T")[0],
    country: (searchParams?.get("exhibition") as string) || "LABEL EXPO SPAIN 2025",
    cardFrontPhoto: "",
    cardBackPhoto: "",
    leadStatus: (searchParams?.get("leadStatus") as string) || "",
    dealStatus: (searchParams?.get("dealStatus") as string) || "",
    meetingAfterExhibition: searchParams?.get("meetingAfterExhibition")?.toLowerCase() === "true" ||
      false,
    industryCategories: (searchParams?.get("industryCategories") as string) || "",
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
    additionalData: undefined
  };

  const [formData, setFormData] = useState<FormData & Record<string, any>>({
    ...defaultFormData,
    ...initialData,
  });

  // Load additionalData into form state
  useEffect(() => {
    if (isEdit && additionalData && Object.keys(additionalData).length > 0) {
      setFormData((prev) => ({
        ...prev,
        ...additionalData,
      }));
    }
  }, [isEdit, additionalData]);

  useEffect(() => {
    if (!isEdit && !formData.cardNo.trim()) {
      const generateCardNo = async () => {
        try {
          const countRes = await fetch("/api/form-count", {
            credentials: "include",
          });
          if (!countRes.ok) throw new Error("Failed to fetch form count");
          const { count } = await countRes.json();
          const nextNo = String(count + 1).padStart(3, "0");
          setFormData((prev) => ({ ...prev, cardNo: nextNo }));
          toastify.success(`Auto-generated Card Number: ${nextNo}`);
        } catch (err) {
          console.error("Error generating card number:", err);
          toastify.error("Failed to auto-generate card number.");
        }
      };
      generateCardNo();
    }
  }, [isEdit, formData.cardNo]);

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

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);
  const [currentImageType, setCurrentImageType] = useState<
    "front" | "back" | null
  >(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">(
    "environment"
  );

  const [formFields, setFormFields] = useState<BuilderField[]>([]);
  const [editingField, setEditingField] = useState<BuilderField | null>(null);
  const [pendingInsertIndex, setPendingInsertIndex] = useState<number | null>(
    null
  );

  const defaultDynamicFields: Omit<BuilderField, "uid">[] = [
    {
      type: "text",
      label: "Company",
      name: "company",
      required: true,
      colSpan: 2,
    },
    {
      type: "text",
      label: "Contact Person",
      name: "contactPerson",
      required: true,
      colSpan: 2,
    },
    {
      type: "text",
      label: "Phone",
      name: "phone",
      required: true,
      colSpan: 2,
      placeholder: "+91 98765 43210",
    },
    {
      type: "email",
      label: "Email",
      name: "email",
      required: true,
      colSpan: 2,
      placeholder: "name@company.com",
    },
  ];

  const freshDefaults = useMemo(
    () =>
      defaultDynamicFields.map((f) => ({
        ...f,
        uid: uid("f_"),
      })),
    []
  );

  useEffect(() => {
    const loadFields = async () => {
      setIsCheckingAdmin(true);

      if (isEdit) {
        setFormFields(freshDefaults);
        setIsCheckingAdmin(false);
        return;
      }

      try {
        const res = await fetch("/api/current-user", {
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to fetch user");

        const { isAdmin: admin } = await res.json();
        setIsAdmin(admin);

        if (admin) {
          const saved = localStorage.getItem("exhibitionFormFields");
          if (saved) {
            try {
              const parsed = JSON.parse(saved);
              setFormFields(parsed);
              toastify.success("Custom form loaded");
            } catch (e) {
              console.error("Invalid saved fields:", e);
              setFormFields(freshDefaults);
            }
          } else {
            setFormFields(freshDefaults);
          }
        } else {
          setFormFields(freshDefaults);
          toastify.info("Form locked — fill & submit only");
        }
      } catch (err) {
        console.log("No session or API error → user mode");
        setIsAdmin(false);
        setFormFields(freshDefaults);
      } finally {
        setIsCheckingAdmin(false);
      }
    };

    loadFields();
  }, [isEdit, freshDefaults]);

  useEffect(() => {
    if (isEdit || !isAdmin || formFields.length === 0) return;
    localStorage.setItem("exhibitionFormFields", JSON.stringify(formFields));
  }, [formFields, isEdit, isAdmin]);

  const availableFieldTypes = [
    {
      type: "text" as const,
      label: "Single line text",
      icon: <div className="w-5 h-5 border rounded" />,
    },
    {
      type: "email" as const,
      label: "Email",
      icon: <div className="w-5 h-5 border rounded" />,
    },
    {
      type: "number" as const,
      label: "Number",
      icon: <div className="w-5 h-5 border rounded" />,
    },
    {
      type: "textarea" as const,
      label: "Multi line text",
      icon: <div className="w-3 h-3 border rounded mx-auto" />,
    },
    {
      type: "select" as const,
      label: "Dropdown",
      icon: <ChevronDown className="w-5 h-5" />,
    },
    {
      type: "checkbox" as const,
      label: "Checkbox",
      icon: <div className="w-4 h-4 border rounded" />,
    },
    {
      type: "radio" as const,
      label: "Radio Group",
      icon: <div className="w-4 h-4 rounded-full border" />,
    },
    {
      type: "date" as const,
      label: "Date",
      icon: <Calendar className="w-5 h-5" />,
    },
    {
      type: "file" as const,
      label: "File Upload",
      icon: <Upload className="w-5 h-5" />,
    },
  ];

  const addDefaultFields = () => {
    const newFields = defaultDynamicFields.map((f) => ({
      ...f,
      uid: uid("f_"),
    }));
    setFormFields((prev) => [...prev, ...newFields]);
    toastify.success("Default form fields added!");
    setMobileFieldPanelOpen(false);
  };

  const handleMobileTapAdd = (type: FieldType) => {
    const newField: BuilderField = {
      uid: uid("f_"),
      type,
      label: type.charAt(0).toUpperCase() + type.slice(1),
      name: `field_${uid()}`,
      required: false,
      colSpan: 2,
      options:
        type === "select" || type === "radio"
          ? [{ label: "Option 1", value: "1" }]
          : undefined,
    };
    setPendingInsertIndex(formFields.length);
    setEditingField(newField);
    setMobileFieldPanelOpen(false);
    toastify.info("Editing new field...");
  };

  const saveField = (field: BuilderField) => {
    setFormFields((prev) => {
      const exists = prev.some((f) => f.uid === field.uid);
      if (exists) {
        return prev.map((f) => (f.uid === field.uid ? field : f));
      } else {
        const index = pendingInsertIndex ?? prev.length;
        return [...prev.slice(0, index), field, ...prev.slice(index)];
      }
    });
    setPendingInsertIndex(null);
    toastify.success("Field saved!");
  };

  const removeField = (uid: string) => {
    setFormFields((prev) => prev.filter((f) => f.uid !== uid));
    toastify.success("Field removed");
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );
  const [activeDragId, setActiveDragId] = useState<string | null>(null);

  const groupFieldsIntoRows = useCallback((fields: BuilderField[]) => {
    const rows: BuilderField[][] = [];
    let currentRow: BuilderField[] = [];
    let currentCols = 0;

    fields.forEach((field) => {
      const span = field.colSpan || 1;
      if (currentCols + span > 4) {
        rows.push(currentRow);
        currentRow = [field];
        currentCols = span;
      } else {
        currentRow.push(field);
        currentCols += span;
      }
    });

    if (currentRow.length > 0) {
      rows.push(currentRow);
    }

    return rows;
  }, []);

  const fieldRows = useMemo(
    () => groupFieldsIntoRows(formFields),
    [formFields, groupFieldsIntoRows]
  );

  const getInsertIndex = useCallback(
    (overId: string) => {
      if (overId === "slot-start") {
        return 0;
      } else if (overId === "form-drop") {
        return formFields.length;
      } else if (overId.startsWith("slot-row-")) {
        const rowIndex = parseInt(overId.split("-")[2]);
        return fieldRows
          .slice(0, rowIndex + 1)
          .reduce((sum, row) => sum + row.length, 0);
      } else {
        const fieldIndex = formFields.findIndex((f) => f.uid === overId);
        return fieldIndex >= 0 ? fieldIndex + 1 : formFields.length;
      }
    },
    [formFields, fieldRows]
  );

  const onDragStart = ({ active }: any) => setActiveDragId(active.id);
  const onDragEnd = ({ active, over }: any) => {
    if (!isAdmin || isEdit || isCheckingAdmin) {
      setActiveDragId(null);
      return;
    }
    setActiveDragId(null);
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);
    const isNewField = activeId.startsWith("block-");

    if (isNewField) {
      const type = activeId.replace("block-", "") as FieldType;
      const insertIndex = getInsertIndex(overId);

      const newField: BuilderField = {
        uid: uid("f_"),
        type,
        label: type.charAt(0).toUpperCase() + type.slice(1),
        name: `field_${uid()}`,
        required: false,
        colSpan: 1,
        options:
          type === "select" || type === "radio"
            ? [{ label: "Option 1", value: "1" }]
            : undefined,
      };

      setPendingInsertIndex(insertIndex);
      setEditingField(newField);
      return;
    }

    const oldIndex = formFields.findIndex((f) => f.uid === activeId);
    if (oldIndex === -1) return;

    const newIndex = getInsertIndex(overId);

    if (oldIndex !== newIndex && oldIndex !== newIndex - 1) {
      setFormFields((items) =>
        arrayMove(
          items,
          oldIndex,
          newIndex > oldIndex ? newIndex - 1 : newIndex
        )
      );
    }
  };

  const onDragCancel = () => setActiveDragId(null);

  const isFormValid = useMemo(() => {
    if (!formData.cardNo?.trim()) return false;
    if (!formData.cardFrontPhoto) return false;

    for (const field of formFields) {
      if (field.required) {
        const value = (formData as any)[field.name];
        if (field.type === "checkbox") {
          if (value !== true) return false;
        } else if (field.type === "file") {
          if (!value) return false;
        } else {
          if (!value || (typeof value === "string" && !value.trim())) {
            return false;
          }
        }
      }
    }
    return true;
  }, [formData, formFields]);

  const renderField = (field: BuilderField) => {
    const value = (formData as any)[field.name] || "";
    const setValue = (val: any) =>
      setFormData((prev) => ({ ...prev, [field.name]: val }));
    const disabled = disabledFields.includes(field.name);

    switch (field.type) {
      case "text":
      case "email":
      case "number":
        return (
          <Input
            type={field.type}
            placeholder={field.placeholder}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            required={field.required}
            disabled={disabled}
            className="h-9 sm:h-auto"
          />
        );
      case "textarea":
        return (
          <Textarea
            placeholder={field.placeholder}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            required={field.required}
            disabled={disabled}
            className="h-16 sm:h-auto"
          />
        );
      case "select":
        return (
          <Select value={value} onValueChange={setValue} disabled={disabled}>
            <SelectTrigger className="h-9 sm:h-auto">
              <SelectValue placeholder={field.placeholder || "Select..."} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case "checkbox":
        return (
          <div className="flex items-center gap-2">
            <Checkbox
              checked={value === true}
              onCheckedChange={setValue}
              required={field.required}
              disabled={disabled}
            />
          </div>
        );
      case "radio":
        return (
          <RadioGroup value={value} onValueChange={setValue} disabled={disabled}>
            {field.options?.map((opt) => (
              <div key={opt.value} className="flex items-center gap-2">
                <RadioGroupItem value={opt.value} />
                <Label>{opt.label}</Label>
              </div>
            ))}
          </RadioGroup>
        );
      case "date":
        return (
          <Input
            type="date"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            required={field.required}
            disabled={disabled}
            className="h-9 sm:h-auto"
          />
        );
      case "file":
        return (
          <Input
            type="file"
            accept={field.accept}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setValue(file);
            }}
            required={field.required}
            disabled={disabled}
            className="h-9 sm:h-auto"
          />
        );
      default:
        return null;
    }
  };

  const renderRow = (fields: BuilderField[]) => {
    const canEdit = isAdmin && !isEdit && !isCheckingAdmin;
    const totalCols = fields.reduce((sum, f) => sum + (f.colSpan || 1), 0);
    const effectiveCols = totalCols > 4 ? 4 : totalCols;

    return (
      <div className="grid grid-cols-4 gap-2 sm:gap-4">
        {fields.map((field) => {
          const span = field.colSpan || 1;
          const colClass =
            span === 1
              ? "col-span-4 sm:col-span-2 lg:col-span-1"
              : span === 2
              ? "col-span-4 sm:col-span-2 lg:col-span-2"
              : span === 3
              ? "col-span-4 lg:col-span-3"
              : "col-span-4";

          return (
            <div key={field.uid} className={colClass}>
              <SortableFieldItem id={field.uid} sortable={canEdit}>
                <div className="bg-gray-50 p-2 sm:p-4 rounded-lg border space-y-2 sm:space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-xs sm:text-sm">
                        {field.label}
                      </h4>
                      <p className="text-xs text-gray-500">{field.type}</p>
                    </div>
                    {canEdit && (
                      <div className="flex gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => setEditingField(field)}
                        >
                          <Settings className="w-3 h-3" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => removeField(field.uid)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">
                      {field.label}{" "}
                      {field.required && (
                        <span className="text-red-500">*</span>
                      )}
                    </Label>
                    {renderField(field)}
                  </div>
                </div>
              </SortableFieldItem>
            </div>
          );
        })}
        {effectiveCols < 4 &&
          Array.from({ length: 4 - effectiveCols }).map((_, i) => (
            <div key={`empty-${i}`} className="col-span-1" />
          ))}
      </div>
    );
  };

  const renderDragOverlay = () => {
    if (!activeDragId) return null;
    if (String(activeDragId).startsWith("block-")) {
      const type = String(activeDragId).replace("block-", "");
      const block = availableFieldTypes.find((b) => b.type === type);
      return block ? (
        <div className="p-3 bg-white border rounded-lg shadow-lg">
          <div className="text-sm font-medium">{block.label}</div>
        </div>
      ) : null;
    }
    const field = formFields.find((f) => f.uid === activeDragId);
    return field ? (
      <div className="bg-gray-50 border rounded-lg p-4 shadow-lg">
        <div className="font-medium">{field.label}</div>
        <div className="text-xs text-gray-500">{field.type}</div>
      </div>
    ) : null;
  };

  const openCamera = useCallback(
    (type: "front" | "back") => {
      if (limitReached) return;
      setCurrentImageType(type);
      setIsCameraOpen(true);
      startCameraStream();
    },
    [limitReached]
  );

  const startCameraStream = async () => {
    try {
      if (videoRef.current) {
        stopCameraStream();
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: facingMode },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        });
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (err) {
      console.error("Camera error:", err);
      toastify.error(
        "Camera access denied or unavailable. Please check permissions and try again."
      );
      setIsCameraOpen(false);
    }
  };

  useEffect(() => {
    if (isCameraOpen) startCameraStream();
    return () => stopCameraStream();
  }, [isCameraOpen, facingMode]);

  const captureImage = () => {
    if (videoRef.current && canvasRef.current && currentImageType) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const file = new File([blob], `${currentImageType}.jpg`, {
                type: "image/jpeg",
              });
              handleImageChange(
                { target: { files: [file] } } as any,
                currentImageType
              );
            }
          },
          "image/jpeg",
          0.9
        );
      }
      closeCamera();
    }
  };

  const stopCameraStream = () => {
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream)
        .getTracks()
        .forEach((t) => t.stop());
    }
  };
  const closeCamera = () => {
    setIsCameraOpen(false);
    stopCameraStream();
  };

  const handleImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "front" | "back"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) =>
      type === "front"
        ? setFrontImagePreview(ev.target?.result as string)
        : setBackImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
    await uploadImage(file, type);
  };

  const uploadImage = async (file: File, type: "front" | "back") => {
    const fd = new FormData();
    fd.append("image", file);
    fd.append("type", type);
    const setter =
      type === "front" ? setFrontUploadProgress : setBackUploadProgress;
    setter(0);
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/upload-image", true);
    xhr.upload.onprogress = (ev) => {
      if (ev.lengthComputable) setter((ev.loaded / ev.total) * 100);
    };
    xhr.onload = () => {
      if (xhr.status === 200) {
        const resp = JSON.parse(xhr.responseText);
        const url = resp.imageUrl || resp.url;
        setFormData((prev) => ({
          ...prev,
          [type === "front" ? "cardFrontPhoto" : "cardBackPhoto"]: url,
        }));
        type === "front" ? setFrontImagePreview(url) : setBackImagePreview(url);
      }
      setter(0);
    };
    xhr.send(fd);
  };

  const handleRemoveImage = (type: "front" | "back") => {
    if (type === "front") {
      setFrontImagePreview(null);
      setFormData((prev) => ({ ...prev, cardFrontPhoto: "" }));
    } else {
      setBackImagePreview(null);
      setFormData((prev) => ({ ...prev, cardBackPhoto: "" }));
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!isFormValid || isSubmitting || limitReached) {
      toastify.error(
        "Please fill all required fields and upload front card image."
      );
      return;
    }
    setIsSubmitting(true);
    try {
      const coreFields = [
        "cardNo", "salesPerson", "date", "country", "cardFrontPhoto", "cardBackPhoto",
        "leadStatus", "dealStatus", "meetingAfterExhibition", "description",
        "extractionStatus", "status", "zohoStatus", "userId", "user", "createdAt", "updatedAt"
      ];

      const submissionData: any = { ...formData };
      const dynamicFields: Record<string, any> = {};

      Object.entries(submissionData).forEach(([key, value]) => {
        if (!coreFields.includes(key) && key !== "additionalData") {
          dynamicFields[key] = value;
          delete submissionData[key];
        }
      });

      submissionData.additionalData = dynamicFields;

      if (!submissionData.cardBackPhoto) delete submissionData.cardBackPhoto;

      if (onSubmit && isEdit) {
        await onSubmit(submissionData);
      } else {
        const res = await fetch("/api/submit-form", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(submissionData),
        });
        if (!res.ok) throw new Error("Submit failed");
        const data = await res.json();
        router.push(`/submission/${data.formId}`);
      }

      toastify.success("Submitted!");
      if (!isEdit) {
        setSubmissionCount((c) => c + 1);
        setFormData(defaultFormData);
        setFrontImagePreview(null);
        setBackImagePreview(null);
      }
    } catch (err) {
      toastify.error(err instanceof Error ? err.message : "Submit failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchCount = async () => {
      try {
        setIsLoadingCount(true);
        const res = await fetch("/api/form-count", { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          const count = data.count ?? 0;
          setSubmissionCount(count);
          if (!isEdit && count >= LIMIT) {
            setLimitReached(true);
            router.replace("/pricing");
          }
        } else if (res.status === 403) {
          const data = await res.json();
          if (data.limitReached && !isEdit) {
            setLimitReached(true);
            router.replace("/pricing");
          }
        }
      } catch (err) {
        toastify.error("Failed to load limit");
      } finally {
        setIsLoadingCount(false);
      }
    };
    fetchCount();
  }, [isEdit, router]);

  const canBuildForm = isAdmin && !isEdit && !isCheckingAdmin;

  if (isCheckingAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#483d73] mx-auto mb-4"></div>
          <p>Checking permissions...</p>
        </div>
      </div>
    );
  }

  const toggleCamera = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-6 sm:py-12">
      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-3 sm:gap-6 px-3 sm:px-4">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onDragCancel={onDragCancel}
          measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
        >
          {canBuildForm && (
            <div className="col-span-3 bg-white rounded-xl p-5 shadow-sm sticky top-6 h-fit hidden lg:block">
              <h3 className="font-bold text-lg mb-3">Form Fields</h3>
              <div className="space-y-2">
                <Button
                  onClick={addDefaultFields}
                  className="w-full justify-start bg-gradient-to-r from-[#483d73] to-[#352c55] text-white hover:from-[#352c55] hover:to-[#483d73]"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Add Default Form Fields
                </Button>
                <div className="h-px bg-gray-200 my-3" />
                {availableFieldTypes.map((f) => (
                  <DraggableBlock key={f.type} id={`block-${f.type}`}>
                    <div className="flex items-center gap-2">
                      {f.icon}
                      <span className="text-sm">{f.label}</span>
                    </div>
                  </DraggableBlock>
                ))}
              </div>
            </div>
          )}

          <div className={`col-span-12 ${canBuildForm ? "lg:col-span-9" : "col-span-12"}`}>
            <Card className="shadow-xl">
              <CardHeader className="p-3 sm:p-6">
                <CardTitle className="text-base sm:text-xl">
                  Custom Form Builder
                </CardTitle>
                {!isEdit && (
                  <p className="text-xs text-gray-600 mt-1">
                    Free submissions left: {isLoadingCount ? "..." : Math.max(0, LIMIT - submissionCount)}
                  </p>
                )}
                {isAdmin && !isEdit && (
                  <p className="text-xs text-green-600 mt-1">
                    Admin mode: Form builder active
                  </p>
                )}
                {!isAdmin && !isEdit && (
                  <p className="text-xs text-amber-600 mt-1">
                    Form is locked. Contact admin to modify fields.
                  </p>
                )}
              </CardHeader>
              <CardContent className="p-3 sm:p-6 space-y-3 sm:space-y-6">
                <div className="space-y-1">
                  <Label className="text-xs">
                    Card Number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={formData.cardNo}
                    onChange={(e) => setFormData({ ...formData, cardNo: e.target.value })}
                    placeholder="Auto-generating..."
                    disabled={disabledFields.includes("cardNo")}
                    className="h-8 sm:h-auto bg-gray-50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1 sm:space-y-2">
                    <Label className="text-xs">
                      Card Front <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <input
                        id="front"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageChange(e, "front")}
                      />
                      <label
                        htmlFor="front"
                        className="block h-32 sm:h-60 border-2 border-dashed rounded-lg cursor-pointer flex items-center justify-center relative overflow-hidden"
                      >
                        {frontImagePreview ? (
                          <Image src={frontImagePreview} alt="" fill className="object-cover" />
                        ) : (
                          <Upload className="w-6 sm:w-10 h-6 sm:h-10 text-gray-400" />
                        )}
                      </label>
                      <Button
                        size="icon"
                        className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2"
                        onClick={() => openCamera("front")}
                      >
                        <Camera className="w-3 sm:w-4 h-3 sm:h-4" />
                      </Button>
                      {frontImagePreview && (
                        <Button
                          size="icon"
                          variant="destructive"
                          className="absolute top-1 right-1 sm:top-2 sm:right-2"
                          onClick={() => handleRemoveImage("front")}
                        >
                          <X className="w-3 sm:w-4 h-3 sm:h-4" />
                        </Button>
                      )}
                    </div>
                    {frontUploadProgress > 0 && frontUploadProgress < 100 && (
                      <Progress value={frontUploadProgress} className="h-1" />
                    )}
                  </div>

                  <div className="space-y-1 sm:space-y-2">
                    <Label className="text-xs">Card Back</Label>
                    <div className="relative">
                      <input
                        id="back"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageChange(e, "back")}
                      />
                      <label
                        htmlFor="back"
                        className="block h-32 sm:h-60 border-2 border-dashed rounded-lg cursor-pointer flex items-center justify-center relative overflow-hidden"
                      >
                        {backImagePreview ? (
                          <Image src={backImagePreview} alt="" fill className="object-cover" />
                        ) : (
                          <Upload className="w-6 sm:w-10 h-6 sm:h-10 text-gray-400" />
                        )}
                      </label>
                      <Button
                        size="icon"
                        className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2"
                        onClick={() => setShowBackImageModal(true)}
                      >
                        <Camera className="w-3 sm:w-4 h-3 sm:h-4" />
                      </Button>
                      {backImagePreview && (
                        <Button
                          size="icon"
                          variant="destructive"
                          className="absolute top-1 right-1 sm:top-2 sm:right-2"
                          onClick={() => handleRemoveImage("back")}
                        >
                          <X className="w-3 sm:w-4 h-3 sm:h-4" />
                        </Button>
                      )}
                    </div>
                    {backUploadProgress > 0 && backUploadProgress < 100 && (
                      <Progress value={backUploadProgress} className="h-1" />
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Lead Status</Label>
                  <Select
                    value={formData.leadStatus}
                    onValueChange={(val) => setFormData({ ...formData, leadStatus: val })}
                  >
                    <SelectTrigger className="h-8 sm:h-auto">
                      <SelectValue placeholder="Select lead status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hot">Hot</SelectItem>
                      <SelectItem value="warm">Warm</SelectItem>
                      <SelectItem value="cold">Cold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Description</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter description"
                    className="h-12 sm:h-auto"
                  />
                </div>

                <div className="flex items-center space-x-2 sm:space-x-3">
                  <Switch
                    id="meeting"
                    checked={formData.meetingAfterExhibition}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        meetingAfterExhibition: checked,
                      })
                    }
                    className="data-[state=checked]:bg-[#483d73]"
                    disabled={isSubmitting || limitReached}
                  />
                  <Label htmlFor="meeting" className="text-xs font-medium text-gray-800">
                    Meeting After Exhibition
                  </Label>
                </div>

                <DroppableFormArea>
                  <SortableContext
                    items={formFields.map((f) => f.uid)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-4 sm:space-y-6">
                      {formFields.length === 0 ? (
                        <div className="p-6 sm:p-10 text-center text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                          {typeof window !== "undefined" && window.innerWidth < 1024 && canBuildForm
                            ? "Tap the purple button to add fields"
                            : canBuildForm
                            ? "Drag fields from the left to start building"
                            : ""}
                        </div>
                      ) : (
                        <>
                          <DroppableFieldSlot id="slot-start" />
                          <AnimatePresence>
                            {fieldRows.map((row, rowIndex) => {
                              const rowKey = row.map((f) => f.uid).join("-");
                              return (
                                <motion.div
                                  key={rowKey}
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -20 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  {renderRow(row)}
                                  <DroppableFieldSlot id={`slot-row-${rowIndex}`} />
                                </motion.div>
                              );
                            })}
                          </AnimatePresence>
                        </>
                      )}
                    </div>
                  </SortableContext>
                </DroppableFormArea>
              </CardContent>
              <CardFooter className="p-3 sm:p-6">
                <Button
                  onClick={handleSubmit}
                  className="w-full justify-center bg-gradient-to-r from-[#483d73] to-[#352c55] text-white hover:from-[#352c55] hover:to-[#483d73]"
                  disabled={isSubmitting || !isFormValid || limitReached}
                >
                  {isSubmitting ? "Submitting..." : "Submit Form"}
                </Button>
              </CardFooter>
            </Card>
          </div>

          <DragOverlay>{renderDragOverlay()}</DragOverlay>
        </DndContext>

      {canBuildForm && (
  <motion.div
    drag
    dragMomentum={false}
    dragElastic={0.3}
    className="fixed top-8 right-8 z-50 lg:hidden block"
    whileDrag={{ scale: 1.2 }}
  >
    <Button
      size="sm"
      className="rounded-full w-14 h-14 shadow-2xl bg-gradient-to-r from-[#483d73] to-[#352c55] hover:from-[#352c55] hover:to-[#483d73]"
      onClick={() => setMobileFieldPanelOpen(true)}
    >
      <Zap className="w-10 h-10" />
    </Button>
  </motion.div>
)}

        <AnimatePresence>
          {mobileFieldPanelOpen && canBuildForm && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileFieldPanelOpen(false)}
                className="fixed inset-0 bg-black bg-opacity-70 z-40 lg:hidden"
              />
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 35, stiffness: 400 }}
                className="fixed inset-y-0 left-0 z-50 lg:hidden bg-white w-11/12 max-w-sm shadow-2xl flex flex-col"
              >
                <div className="p-3 border-b bg-gradient-to-r from-[#483d73] to-[#352c55] flex justify-between items-center shrink-0">
                  <h3 className="text-white font-bold text-base">Add Field</h3>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-white"
                    onClick={() => setMobileFieldPanelOpen(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex-1 overflow-y-auto">
                  <div className="p-2 space-y-1.5">
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={addDefaultFields}
                      className="w-full flex items-center gap-2 p-2 bg-gradient-to-r from-[#483d73] to-[#352c55] text-white rounded-lg font-medium text-xs shadow-md hover:shadow-lg transition-all"
                    >
                      <Zap className="w-4 h-6" />
                      <span>Add All Default Fields</span>
                    </motion.button>
                    <div className="h-px bg-gray-200 my-1.5" />
                    <div className="space-y-1">
                      {availableFieldTypes.map((f) => (
                        <motion.button
                          key={f.type}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => handleMobileTapAdd(f.type)}
                          className="w-full flex items-center gap-2 p-2 bg-gray-50 hover:bg-gray-100 rounded-md transition-all duration-200 border border-gray-200 hover:border-[#483d73] hover:shadow-sm"
                        >
                          <div className="p-1 bg-white rounded shadow-sm border border-gray-300">
                            {React.cloneElement(f.icon as React.ReactElement, {
                              className: "w-4 h-4 text-[#483d73]",
                            })}
                          </div>
                          <span className="text-sm font-medium text-gray-600 flex-1 text-left">
                            {f.label}
                          </span>
                          <Plus className="w-3 h-3 text-gray-400" />
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {isCameraOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-6">
            <div className="bg-white rounded-xl shadow-2xl overflow-hidden max-w-lg w-full">
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
            </div>
          </div>
        )}

        {editingField && (
          <FieldEditor
            field={editingField}
            onSave={saveField}
            onClose={() => {
              setEditingField(null);
              setPendingInsertIndex(null);
            }}
          />
        )}
        <PopupModal
          isOpen={showBackImageModal}
          onClose={() => setShowBackImageModal(false)}
          onConfirm={() => {
            setShowBackImageModal(false);
            (document.getElementById("back") as HTMLInputElement)?.click();
          }}
          title="Upload Back Image"
          description="Do you want to upload the back image?"
        />
        <ToastContainer position="bottom-right" />
      </div>
    </div>
  );
}

export default ExhibitionForm;