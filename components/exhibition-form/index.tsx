"use client"
import type React from "react"
import { useEffect, useMemo, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import Image from "next/image"
import { Upload, X, Camera, RefreshCw, GripVertical, Trash2, Settings, Zap, Globe, Columns } from "lucide-react"
import { toast } from "sonner"
import { rectSortingStrategy } from "@dnd-kit/sortable"
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
  DragOverlay,
  useDraggable,
  type UniqueIdentifier,
} from "@dnd-kit/core"
import { SortableContext, arrayMove } from "@dnd-kit/sortable"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter, useSearchParams } from "next/navigation"

const INDUSTRY_OPTIONS = [
  { value: "having_pcm", label: "Having PCM" },
  { value: "offset_printer", label: "OFFSET PRINTER" },
  { value: "paper_bag_machine", label: "Having Paper Bag Machine" },
  { value: "salad_bowl_machine", label: "Having Salad Bowl Machine" },
  { value: "paper_straw_machine", label: "Having Paper Straw Machine" },
  { value: "paper_lid_machine", label: "Having PaperLidMachine" },
  { value: "soup_bowl_machine", label: "Having Soup Bowl Machine" },
  { value: "paper_container", label: "Paper Container Manufacturer" },
  { value: "disposable_traders", label: "Disposable Traders" },
  { value: "machine_trader", label: "Machine Trader" },
  { value: "pp_manufacturer", label: "PP Manufacturer" },
  { value: "paper_plate", label: "Paper Plate Manufacturer" },
  { value: "cup_raw_material", label: "CUP RAW MATERIAL" },
  { value: "tissue_manufacturer", label: "Tissue Manufacturer" },
  { value: "sugarcane_bagasse", label: "Sugarcane Bagasse Manufacturers" },
  { value: "spare_parts", label: "Spare Parts" },
  { value: "related_industries", label: "Related Industries" },
  { value: "other", label: "OTHER" },
  { value: "dont_know", label: "I Don't Know" },
] as const

type FieldType = "text" | "email" | "number" | "textarea" | "select" | "checkbox" | "radio" | "date" | "file"

interface FieldOption {
  label: string
  value: string
}

interface BuilderField {
  uid: string
  type: FieldType
  label: string
  name: string
  placeholder?: string
  required?: boolean
  options?: FieldOption[]
  accept?: string
  colSpan?: 1 | 2 | 3 | 4
}

function uid(prefix = "") {
  return `${prefix}${Math.random().toString(36).slice(2, 9)}`
}

interface ExhibitionFormProps {
  initialData?: Record<string, any>
  onSubmit?: (data: any) => void
  isEdit?: boolean
  formId?: string
  disabledFields?: string[]
  forceRestoreFields?: string[]
  prefillValues?: Record<string, any>
}

function CameraModal({
  isOpen,
  onClose,
  onCapture,
}: {
  isOpen: boolean
  onClose: () => void
  onCapture: (file: File) => void
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment")

  const startStream = async () => {
    if (!videoRef.current) return
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode, width: { ideal: 1280 }, height: { ideal: 1280 } },
      })
      videoRef.current.srcObject = stream
    } catch (err) {
      toast.error("Camera access denied")
      onClose()
    }
  }

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return
    const video = videoRef.current
    const canvas = canvasRef.current
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext("2d")
    if (ctx) {
      ctx.drawImage(video, 0, 0)
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const file = new File([blob], `capture-${Date.now()}.jpg`, {
              type: "image/jpeg",
            })
            onCapture(file)
            onClose()
          }
        },
        "image/jpeg",
        0.95,
      )
    }
  }

  const switchCamera = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"))
  }

  useEffect(() => {
    if (isOpen) startStream()
    return () => {
      if (videoRef.current?.srcObject) {
        ;(videoRef.current.srcObject as MediaStream).getTracks().forEach((track) => track.stop())
      }
    }
  }, [isOpen, facingMode])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg w-full p-0 gap-0 dark:bg-gray-800">
        <DialogHeader className="p-4 bg-gray-200 dark:bg-gray-700 border-b border-gray-300 dark:border-gray-600">
          <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-white">Capture Photo</DialogTitle>
        </DialogHeader>
        <div className="relative bg-black">
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-[260px] sm:h-[320px] object-cover" />
          <canvas ref={canvasRef} className="hidden" />
        </div>
        <DialogFooter className="p-4 bg-gray-200 dark:bg-gray-700 flex justify-between items-center gap-4 flex-col sm:flex-row">
          <Button
            variant="outline"
            onClick={switchCamera}
            className="flex items-center gap-2 border-gray-400 dark:border-gray-500 hover:bg-gray-300 dark:hover:bg-gray-600 w-full sm:w-auto bg-transparent"
          >
            <RefreshCw className="w-4 h-4" />
            Switch Camera
          </Button>
          <div className="flex gap-3 w-full sm:w-auto">
            <Button
              onClick={capturePhoto}
              className="bg-[#483d73] hover:bg-[#5a5570] text-white font-medium px-6 flex-1 sm:flex-none"
            >
              Capture Photo
            </Button>
            <Button variant="ghost" onClick={onClose} className="flex-1 sm:flex-none">
              Close
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function SidebarFieldBlock({
  type,
  label,
  handleAddField,
  setMobileDrawerOpen,
}: {
  type: FieldType
  label: string
  handleAddField: (type: FieldType) => void
  setMobileDrawerOpen: (open: boolean) => void
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `sidebar-${type}`,
    data: { type, isSidebar: true },
  })

  function handleClick(e: React.MouseEvent) {
    if (isDragging) return
    handleAddField(type)
    setMobileDrawerOpen(false)
  }

  return (
    <motion.div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      onClick={handleClick}
      className={`flex items-center justify-between p-3 border rounded-lg 
        cursor-grab hover:bg-gray-50 dark:hover:bg-gray-700 transition-all 
        ${isDragging ? "opacity-50 scale-105 shadow-lg" : ""}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 border rounded dark:border-gray-600" />
        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{label}</span>
      </div>
    </motion.div>
  )
}

function SortableFormField({
  field,
  children,
  isAdmin,
  onEdit,
  onDelete,
}: {
  field: BuilderField
  children: React.ReactNode
  isAdmin: boolean
  onEdit: (f: BuilderField) => void
  onDelete: (uid: string) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: field.uid,
    disabled: !isAdmin,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.7 : 1,
  }

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="relative"
    >
      <div className="flex items-start gap-3">
        {isAdmin && (
          <div {...listeners} className="pt-3 cursor-grab active:cursor-grabbing select-none">
            <GripVertical className="w-5 h-5 text-gray-400" />
          </div>
        )}
        <div className="flex-1 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-3 shadow-sm">
          {children}
          {isAdmin && (
            <div className="flex justify-end gap-1 mt-2 -mb-2">
              <Button size="icon" variant="ghost" onClick={() => onEdit(field)}>
                <Settings className="w-4 h-4" />
              </Button>
              <Button size="icon" variant="ghost" onClick={() => onDelete(field.uid)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

function FieldDragOverlay({ type }: { type: FieldType }) {
  const labels: Record<FieldType, string> = {
    text: "Single Line Text",
    email: "Email",
    number: "Number",
    textarea: "Multi-line Text",
    select: "Dropdown",
    checkbox: "Checkbox",
    radio: "Radio Group",
    date: "Date",
    file: "File Upload",
  }

  return (
    <div className="bg-white dark:bg-gray-800 border-2 border-blue-500 rounded-lg p-5 shadow-2xl flex items-center gap-4">
      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 border-2 border-blue-500 rounded flex items-center justify-center">
        <Columns className="w-5 h-5 text-blue-600 dark:text-blue-400" />
      </div>
      <span className="font-semibold text-lg text-gray-900 dark:text-white">{labels[type] || type}</span>
    </div>
  )
}

function FieldEditor({
  field,
  onSave,
  onClose,
}: {
  field: BuilderField
  onSave: (updated: BuilderField) => void
  onClose: () => void
}) {
  const [edited, setEdited] = useState(field)

  const addOption = () => {
    setEdited({
      ...edited,
      options: [...(edited.options || []), { label: "", value: "" }],
    })
  }

  const updateOption = (idx: number, key: "label" | "value", val: string) => {
    const opts = [...(edited.options || [])]
    opts[idx] = { ...opts[idx], [key]: val }
    setEdited({ ...edited, options: opts })
  }

  const removeOption = (idx: number) => {
    setEdited({
      ...edited,
      options: (edited.options || []).filter((_, i) => i !== idx),
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full p-6 max-h-screen overflow-y-auto"
      >
        <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Edit Field</h3>
        <div className="space-y-5">
          <div>
            <Label className="text-gray-900 dark:text-gray-200">Field Label *</Label>
            <Input
              value={edited.label}
              onChange={(e) => setEdited({ ...edited, label: e.target.value })}
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-gray-900 dark:text-gray-200">Field Name (unique key) *</Label>
            <Input
              value={edited.name}
              onChange={(e) => setEdited({ ...edited, name: e.target.value })}
              placeholder="e.g. company_name"
              className="mt-1"
            />
          </div>
          {["text", "email", "textarea"].includes(edited.type) && (
            <div>
              <Label className="text-gray-900 dark:text-gray-200">Placeholder</Label>
              <Input
                value={edited.placeholder || ""}
                onChange={(e) => setEdited({ ...edited, placeholder: e.target.value })}
                className="mt-1"
              />
            </div>
          )}
          {(edited.type === "select" || edited.type === "radio") && (
            <div>
              <Label className="text-gray-900 dark:text-gray-200">Options</Label>
              <div className="space-y-2 mt-2">
                {(edited.options || []).map((opt, idx) => (
                  <div key={idx} className="flex gap-2">
                    <Input
                      placeholder="Label"
                      value={opt.label}
                      onChange={(e) => updateOption(idx, "label", e.target.value)}
                    />
                    <Input
                      placeholder="Value"
                      value={opt.value}
                      onChange={(e) => updateOption(idx, "value", e.target.value)}
                    />
                    <Button size="icon" variant="ghost" onClick={() => removeOption(idx)}>
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
              <Label className="text-gray-900 dark:text-gray-200">Accept (MIME types)</Label>
              <Input
                value={edited.accept || ""}
                onChange={(e) => setEdited({ ...edited, accept: e.target.value })}
                placeholder="e.g. image/*, .pdf"
                className="mt-1"
              />
            </div>
          )}
          <div className="flex items-center gap-3">
            <Switch
              checked={edited.required || false}
              onCheckedChange={(c) => setEdited({ ...edited, required: c })}
              className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-[#483d73] data-[state=checked]:to-[#352c55]"
            />
            <Label className="text-gray-900 dark:text-gray-200">Required field</Label>
          </div>
          <div>
            <Label className="text-gray-900 dark:text-gray-200">Column Width</Label>
            <div className="grid grid-cols-4 gap-3 mt-3">
              {[1, 2, 3, 4].map((span) => (
                <Button
                  key={span}
                  variant={edited.colSpan === span ? "default" : "outline"}
                  size="sm"
                  onClick={() => setEdited({ ...edited, colSpan: span as any })}
                  className={`flex items-center gap-2
                    ${
                      edited.colSpan === span ? "bg-gradient-to-r from-[#483d73] to-[#352c55] text-white border-0" : ""
                    }`}
                >
                  <Columns className="w-4 h-4" />
                  {span}/4
                </Button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-8">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="bg-gradient-to-r from-[#483d73] to-[#352c55] text-white"
            onClick={() => {
              if (!edited.label || !edited.name) {
                toast.error("Label and Name are required")
                return
              }
              onSave(edited)
              onClose()
            }}
          >
            Save Changes
          </Button>
        </div>
      </motion.div>
    </div>
  )
}

export function ExhibitionForm({
  initialData = {},
  onSubmit,
  isEdit = false,
  formId,
  disabledFields = [],
  forceRestoreFields = [],
  prefillValues = {},
}: ExhibitionFormProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const LIMIT = 1500
  const [submissionCount, setSubmissionCount] = useState<number>(0)
  const [isLoadingCount, setIsLoadingCount] = useState<boolean>(true)
  const [limitReached, setLimitReached] = useState<boolean>(false)
  const [formFields, setFormFields] = useState<BuilderField[]>([])
  const [isAdmin, setIsAdmin] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [editingField, setEditingField] = useState<BuilderField | null>(null)
  const [activeDragId, setActiveDragId] = useState<UniqueIdentifier | null>(null)
  const [frontImagePreview, setFrontImagePreview] = useState<string | null>(initialData.cardFrontPhoto || null)
  const [backImagePreview, setBackImagePreview] = useState<string | null>(initialData.cardBackPhoto || null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [cameraOpen, setCameraOpen] = useState(false)
  const [cameraSide, setCameraSide] = useState<"front" | "back">("front")
  const [formData, setFormData] = useState<Record<string, any>>({
    cardNo: initialData.cardNo || searchParams?.get("cardNo") || "",
    salesPerson: initialData.salesPerson || searchParams?.get("salesPerson") || "",
    date: initialData.date
      ? new Date(initialData.date).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
    country: initialData.country || "N/A",
    cardFrontPhoto: initialData.cardFrontPhoto || "",
    cardBackPhoto: initialData.cardBackPhoto || "",
    leadStatus: initialData.leadStatus || "",
    dealStatus: initialData.dealStatus || "",
    meetingAfterExhibition: initialData.meetingAfterExhibition || false,
    description: initialData.description || "",
    industry: initialData.industry || [],
    ...prefillValues,
  })

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
    {
      type: "checkbox",
      label: "Industry Category",
      name: "industry",
      required: true,
      colSpan: 4,
      options: INDUSTRY_OPTIONS.map((o) => ({
        label: o.label,
        value: o.value,
      })),
    },
  ]

  const [publishModalOpen, setPublishModalOpen] = useState(false)
  const freshDefaults = useMemo(() => defaultDynamicFields.map((f) => ({ ...f, uid: uid("f_") })), [])
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  )

  useEffect(() => {
    async function loadEverything() {
      try {
        const templateRes = await fetch("/api/form-template")
        const templateData = templateRes.ok ? await templateRes.json() : { fields: [] }
        const loaded = (templateData.fields || []).map((f: any) => ({
          ...f,
          uid: f.uid || uid("f_"),
        }))
        setFormFields(loaded.length > 0 ? loaded : [])

        const sessionRes = await fetch("/api/auth/me")
        if (sessionRes.ok) {
          const session = await sessionRes.json()
          setIsAdmin(session?.user?.isAdmin === true)
        }

        const countRes = await fetch("/api/form-count")
        if (countRes.ok) {
          const { count } = await countRes.json()
          setSubmissionCount(count)
          setLimitReached(count >= LIMIT)
        }
      } catch (err) {
        setFormFields([])
      } finally {
        setIsLoading(false)
        setIsLoadingCount(false)
      }
    }

    loadEverything()
  }, [freshDefaults])

  useEffect(() => {
    if (!formData.cardNo && !isLoadingCount) {
      const generate = async () => {
        const res = await fetch("/api/form-count")
        if (res.ok) {
          const { count } = await res.json()
          setFormData((prev) => ({
            ...prev,
            cardNo: String(count + 1).padStart(3, "0"),
          }))
        }
      }
      generate()
    }
  }, [isLoadingCount, formData.cardNo])

  const publishToAll = async () => {
    if (formFields.length === 0) {
      toast.error("Cannot publish empty form")
      return
    }
    setPublishModalOpen(true)
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>, type: "front" | "back") => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      if (type === "front") setFrontImagePreview(reader.result as string)
      else setBackImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    const fd = new FormData()
    fd.append("image", file)
    fd.append("type", type)

    const res = await fetch("/api/upload-image", { method: "POST", body: fd })
    if (res.ok) {
      const data = await res.json()
      setFormData((prev) => ({
        ...prev,
        [type === "front" ? "cardFrontPhoto" : "cardBackPhoto"]: data.imageUrl || data.url,
      }))
      toast.success("Uploaded!")
    } else toast.error("Upload failed")
  }

  const handleSubmit = async () => {
    if (!formData.cardFrontPhoto) return toast.error("Front photo required")
    if (limitReached) return toast.error("Limit reached")

    setIsSubmitting(true)
    try {
      const submission = {
        cardNo: formData.cardNo,
        salesPerson: formData.salesPerson,
        date: formData.date,
        country: formData.country,
        cardFrontPhoto: formData.cardFrontPhoto,
        cardBackPhoto: formData.cardBackPhoto || "",
        leadStatus: formData.leadStatus || "Warm",
        dealStatus: formData.dealStatus || "",
        meetingAfterExhibition: formData.meetingAfterExhibition || false,
        description: formData.description || "",
        ...Object.fromEntries(
          Object.entries(formData).filter(
            ([k]) =>
              ![
                "cardNo",
                "salesPerson",
                "date",
                "country",
                "cardFrontPhoto",
                "cardBackPhoto",
                "leadStatus",
                "dealStatus",
                "meetingAfterExhibition",
                "description",
              ].includes(k),
          ),
        ),
      }

      const res = await fetch("/api/submit-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submission),
      })

      if (res.ok) {
        toast.success("Submitted!")
        setTimeout(() => {
          window.location.reload()
        }, 1500)
      } else {
        const err = await res.json()
        toast.error(err.message || "Failed")
      }
    } catch {
      toast.error("Network error")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDragStart = (event: DragStartEvent) => {
    setActiveDragId(event.active.id)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over) return

    const activeId = String(active.id)
    const overId = String(over?.id)

    if (activeId.startsWith("sidebar-")) {
      const type = activeId.replace("sidebar-", "") as FieldType
      const newField: BuilderField = {
        uid: uid("f_"),
        type,
        label: type.charAt(0).toUpperCase() + type.slice(1).replace(/_/g, " ") + " Field",
        name: `${type}_${Date.now()}`,
        required: false,
        colSpan: 2,
        options: type === "select" || type === "radio" ? [{ label: "Option 1", value: "option1" }] : undefined,
      }

      let insertIndex = formFields.length
      if (overId && !overId.startsWith("sidebar-")) {
        const overIndex = formFields.findIndex((f) => f.uid === overId)
        if (overIndex !== -1) insertIndex = overIndex + 1
      }

      setFormFields((prev) => {
        const updated = [...prev]
        updated.splice(insertIndex, 0, newField)
        return updated
      })
      toast.success("Field added via drag!")
    } else if (activeId !== overId && !activeId.startsWith("sidebar-")) {
      setFormFields((fields) => {
        const oldIndex = fields.findIndex((f) => f.uid === activeId)
        const newIndex = fields.findIndex((f) => f.uid === overId)
        if (oldIndex === -1 || newIndex === -1) return fields
        return arrayMove(fields, oldIndex, newIndex)
      })
    }

    setActiveDragId(null)
  }

  const sidebarItems = [
    { type: "text" as const, label: "Single Line Text" },
    { type: "email" as const, label: "Email" },
    { type: "number" as const, label: "Number" },
    { type: "textarea" as const, label: "Multi-line Text" },
    { type: "select" as const, label: "Dropdown" },
    { type: "checkbox" as const, label: "Checkbox" },
    { type: "radio" as const, label: "Radio Group" },
    { type: "date" as const, label: "Date" },
  ]

  const renderFieldInput = (field: BuilderField, isAdmin: boolean) => {
    const value = formData[field.name] || ""
    const baseClass = "mt-2"

    const onChange = (val: any) => {
      setFormData((prev) => ({ ...prev, [field.name]: val }))
    }

    // Multi-select checkbox group (e.g. Industry Category)
    if (field.type === "checkbox" && field.options && field.options.length > 1) {
      const selected = Array.isArray(value) ? value : []
      const handleCheckedChange = (optionValue: string, checked: boolean) => {
        if (optionValue === "dont_know") {
          return checked ? onChange(["dont_know"]) : onChange([])
        }
        if (checked) {
          onChange([...selected.filter((v: string) => v !== "dont_know"), optionValue])
        } else {
          onChange(selected.filter((v: string) => v !== optionValue))
        }
      }

      return (
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {field.required && <span className="text-red-500">*</span>}
          </p>
          <p className="text-xs text-muted-foreground mb-4">Select all that apply</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto p-4 border rounded-lg bg-gray-50 dark:bg-gray-900">
            {field.options.map((opt) => (
              <div key={opt.value} className="flex items-center space-x-3">
                <Checkbox
                  id={`${field.uid}-${opt.value}`}
                  checked={selected.includes(opt.value)}
                  onCheckedChange={(c) => handleCheckedChange(opt.value, c as boolean)}
                />
                <Label
                  htmlFor={`${field.uid}-${opt.value}`}
                  className="font-normal cursor-pointer text-sm leading-none"
                >
                  {opt.label}
                </Label>
              </div>
            ))}
          </div>
        </div>
      )
    }

    // Single checkbox (boolean)
    if (field.type === "checkbox") {
      return (
        <div className="flex items-center space-x-3 mt-4">
          <Checkbox id={field.uid} checked={!!value} onCheckedChange={onChange} />
          <Label htmlFor={field.uid} className="font-normal cursor-pointer">
            {field.label} {field.required && <span className="text-red-500">*</span>}
          </Label>
        </div>
      )
    }

    switch (field.type) {
      case "textarea":
        return (
          <Textarea
            placeholder={field.placeholder || ""}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={baseClass}
          />
        )
      case "select":
        return (
          <Select value={value} onValueChange={onChange}>
            <SelectTrigger className={baseClass}>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {(field.options || []).map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      case "radio":
        return (
          <RadioGroup value={value} onValueChange={onChange}>
            <div className="space-y-3 mt-3">
              {(field.options || []).map((option) => (
                <div key={option.value} className="flex items-center space-x-3">
                  <RadioGroupItem value={option.value} id={`${field.uid}-${option.value}`} />
                  <Label htmlFor={`${field.uid}-${option.value}`} className="font-normal cursor-pointer">
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        )
      case "date":
        const today = new Date().toISOString().split("T")[0]
        const dateValue = value || (!isAdmin ? today : "")
        return <Input type="date" value={dateValue} onChange={(e) => onChange(e.target.value)} className={baseClass} />
      case "file":
        return (
          <Input
            type="file"
            accept={field.accept}
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) onChange(file)
            }}
            className={baseClass}
          />
        )
      default:
        return (
          <Input
            type={field.type === "email" ? "email" : field.type === "number" ? "number" : "text"}
            placeholder={field.placeholder || "Enter value"}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={baseClass}
          />
        )
    }
  }

  const handleRemoveImage = (side: "front" | "back") => {
    if (side === "front") {
      setFrontImagePreview(null)
      setFormData((prev) => ({ ...prev, cardFrontPhoto: "" }))
    } else {
      setBackImagePreview(null)
      setFormData((prev) => ({ ...prev, cardBackPhoto: "" }))
    }
  }

  const handleAddField = (type: FieldType) => {
    const newField: BuilderField = {
      uid: uid("f_"),
      type,
      label: type.charAt(0).toUpperCase() + type.slice(1).replace(/_/g, " "),
      name: `${type}_${Date.now()}`,
      required: false,
      colSpan: 2,
      options: type === "select" || type === "radio" ? [{ label: "Option 1", value: "1" }] : undefined,
    }
    setFormFields((prev) => [...prev, newField])
    toast.success("Field added!")
    setMobileDrawerOpen(false)
  }

  const openCamera = (side: "front" | "back") => {
    setCameraSide(side)
    setCameraOpen(true)
  }

  const handleCapture = async (file: File) => {
    const url = URL.createObjectURL(file)
    if (cameraSide === "front") setFrontImagePreview(url)
    else setBackImagePreview(url)

    const fd = new FormData()
    fd.append("image", file, `card-${cameraSide}.jpg`)
    fd.append("type", cameraSide)

    try {
      const res = await fetch("/api/upload-image", {
        method: "POST",
        body: fd,
      })
      if (!res.ok) throw new Error(`Server error: ${res.status}`)
      const data = await res.json()
      setFormData((prev) => ({
        ...prev,
        [cameraSide === "front" ? "cardFrontPhoto" : "cardBackPhoto"]: data.imageUrl || data.url,
      }))
      toast.success("Photo captured & uploaded!")
    } catch (err) {
      console.error("Upload error:", err)
      toast.error("Upload failed - check internet connection")
    }
  }

  const isFormValid = useMemo(() => {
    if (!formData.cardFrontPhoto) return false
    for (const field of formFields) {
      if (field.required) {
        const value = formData[field.name]
        if (!value || (typeof value === "string" && value.trim() === "")) {
          return false
        }
      }
    }
    return true
  }, [formData, formFields])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#483d73] mx-auto mb-4" />
          <p className="text-gray-700 dark:text-gray-300">Loading form...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div
        className={`${
          isAdmin
            ? "min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-6 sm:py-12"
            : "w-full max-w-4xl mx-auto overflow-hidden bg-gradient-to-b dark:from-gray-900 dark:to-gray-800 py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6 px-4">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            {/* Mobile-Only LEFT Sidebar Drawer */}
            {isAdmin && (
              <>
                <motion.div
                  drag
                  dragMomentum={false}
                  dragElastic={0.15}
                  whileDrag={{ scale: 1.15, zIndex: 999 }}
                  className="fixed top-16 right-6 z-50 lg:hidden cursor-grab active:cursor-grabbing"
                  style={{ touchAction: "none" }}
                >
                  <button
                    onClick={() => setMobileDrawerOpen(true)}
                    className="bg-gradient-to-r from-[#483d73] to-[#352c55] text-white
              rounded-full p-5 shadow-2xl hover:scale-110 transition-all
              flex items-center justify-center"
                  >
                    <Zap className="w-5 h-5" />
                  </button>
                </motion.div>
                <AnimatePresence>
                  {mobileDrawerOpen && (
                    <>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setMobileDrawerOpen(false)}
                        className="fixed inset-0 bg-black/50 z-50 lg:hidden"
                      />
                      <motion.div
                        initial={{ x: "-100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "-100%" }}
                        transition={{
                          type: "spring",
                          damping: 25,
                          stiffness: 300,
                        }}
                        className="fixed left-0 top-0 w-80 max-w-[90vw] bg-white dark:bg-gray-800 shadow-2xl z-50 lg:hidden overflow-y-auto max-h-screen"
                      >
                        <div className="p-6 border-b bg-gradient-to-r from-[#483d73] to-[#352c55] text-white">
                          <div className="flex items-center justify-between">
                            <h3 className="font-bold text-xl">Form Builder</h3>
                            <button
                              onClick={() => setMobileDrawerOpen(false)}
                              className="p-2 hover:bg-white/20 rounded-full transition"
                            >
                              <X className="w-6 h-6" />
                            </button>
                          </div>
                        </div>
                        <div className="h-[calc(100vh-88px)] overflow-y-auto p-6 space-y-6">
                          <Button
                            onClick={() => {
                              setFormFields((prev) => [...prev, ...freshDefaults])
                              setMobileDrawerOpen(false)
                              toast.success("Default fields")
                            }}
                            className="w-full bg-gradient-to-r from-[#483d73] to-[#352c55] text-white"
                          >
                            <Zap className="w-5 h-5 mr-2" />
                            Add Default Fields
                          </Button>
                          <div className="space-y-3">
                            {sidebarItems.map((item) => (
                              <SidebarFieldBlock
                                key={item.type}
                                type={item.type}
                                label={item.label}
                                handleAddField={handleAddField}
                                setMobileDrawerOpen={setMobileDrawerOpen}
                              />
                            ))}
                          </div>
                          <div className="pt-6 border-t">
                            <Button
                              onClick={publishToAll}
                              className="w-full bg-gradient-to-r from-[#483d73] to-[#352c55] text-white"
                            >
                              <Globe className="w-5 h-5 mr-2" />
                              Publish to All Users
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </>
            )}

            {/* Desktop Sidebar */}
            {isAdmin && (
              <div className="hidden lg:block col-span-12 lg:col-span-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 sticky top-6 h-fit">
                <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">Form Builder</h3>
                <Button
                  onClick={() => setFormFields((prev) => [...prev, ...freshDefaults])}
                  className="w-full mb-4 bg-gradient-to-r from-[#483d73] to-[#352c55] text-white"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Add Default Fields
                </Button>
                <div className="space-y-3">
                  {sidebarItems.map((item) => (
                    <SidebarFieldBlock
                      key={item.type}
                      type={item.type}
                      label={item.label}
                      handleAddField={handleAddField}
                      setMobileDrawerOpen={(open: boolean): void => {
                        throw new Error("Function not implemented.")
                      }}
                    />
                  ))}
                </div>
                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    onClick={publishToAll}
                    className="w-full bg-gradient-to-r from-[#483d73] to-[#352c55] text-white"
                  >
                    <Globe className="w-5 h-5 mr-2" />
                    Publish to All Users
                  </Button>
                </div>
              </div>
            )}

            {/* Main Form */}
            <div className={isAdmin ? "col-span-12 lg:col-span-9" : "col-span-12"}>
              <Card className="shadow-xl bg-white dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white">Exhibition Lead Capture</CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Submissions: {submissionCount} / {LIMIT} {limitReached && " (Limit reached)"}
                  </p>
                </CardHeader>
                <CardContent
                  className={isAdmin ? "space-y-8" : "space-y-6"} // Less space for normal users
                >
                  {/* Card Number */}
                  <div className="space-y-1">
                    <Label className="text-xs text-gray-700 dark:text-gray-300">
                      Card Number <span className="text-red-500">*</span>
                    </Label>
                    <Input value={formData.cardNo} readOnly className="bg-gray-100 dark:bg-gray-700" />
                  </div>

                  {/* Image Uploads - More compact on small screens */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Front Card */}
                    <div>
                      <Label className="text-gray-700 dark:text-gray-300 text-sm">
                        Card Front <span className="text-red-500">*</span>
                      </Label>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        id="front"
                        onChange={(e) => handleImageChange(e, "front")}
                      />
                      <label
                        htmlFor="front"
                        className="block mt-2 h-40 sm:h-48 lg:h-56 border-2 border-dashed rounded-lg cursor-pointer flex items-center justify-center overflow-hidden relative hover:border-[#483d73] dark:hover:border-[#6350af] transition"
                      >
                        {frontImagePreview ? (
                          <div className="relative w-full h-full">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleRemoveImage("front")
                              }}
                              className="absolute top-2 right-2 z-10 bg-black/70 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm hover:bg-black"
                            >
                              ×
                            </button>
                            <Image
                              src={frontImagePreview || "/placeholder.svg"}
                              alt="Front"
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <Upload className="w-10 h-10 text-gray-400" />
                        )}
                        <Button
                          onClick={(e) => {
                            e.preventDefault()
                            openCamera("front")
                          }}
                          size="sm"
                          className="absolute bottom-2 right-2 bg-[#483d73]/90 hover:bg-[#483d73] text-white"
                        >
                          <Camera className="w-4 h-4" />
                        </Button>
                      </label>
                    </div>

                    {/* Back Card */}
                    <div>
                      <Label className="text-gray-700 dark:text-gray-300 text-sm">Card Back</Label>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        id="back"
                        onChange={(e) => handleImageChange(e, "back")}
                      />
                      <label
                        htmlFor={!backImagePreview ? "back" : undefined}
                        className="block mt-2 h-40 sm:h-48 lg:h-56 border-2 border-dashed rounded-lg cursor-pointer flex items-center justify-center overflow-hidden relative hover:border-[#483d73] dark:hover:border-[#6350af] transition"
                      >
                        {backImagePreview ? (
                          <div className="relative w-full h-full">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleRemoveImage("back")
                              }}
                              className="absolute top-2 right-2 z-10 bg-black/70 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm hover:bg-black"
                            >
                              ×
                            </button>
                            <Image
                              src={backImagePreview || "/placeholder.svg"}
                              alt="Back"
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <Upload className="w-10 h-10 text-gray-400" />
                        )}
                        <Button
                          onClick={(e) => {
                            e.preventDefault()
                            openCamera("back")
                          }}
                          size="sm"
                          className="absolute bottom-2 right-2 bg-[#483d73]/90 hover:bg-[#483d73] text-white"
                        >
                          <Camera className="w-4 h-4" />
                        </Button>
                      </label>
                    </div>
                  </div>

                  {/* Lead Status */}
                  <div className="space-y-2">
                    <Label className="text-sm">Lead Status</Label>
                    <Select
                      value={formData.leadStatus}
                      onValueChange={(val) => setFormData((prev) => ({ ...prev, leadStatus: val }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select lead status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="JUST LEAD">JUST LEAD</SelectItem>
                        <SelectItem value="QUALIFIED LEAD">QUALIFIED LEAD</SelectItem>
                        <SelectItem value="NEW DEAL">NEW DEAL</SelectItem>
                        <SelectItem value="OLD DEAL">OLD DEAL</SelectItem>
                        <SelectItem value="EXISTING CUSTOMER">EXISTING CUSTOMER</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label className="text-sm">Description</Label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      placeholder="Enter description..."
                      className="w-full min-h-20 rounded-md border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-ring"
                      rows={3}
                    />
                  </div>

                  {/* Meeting Switch */}
                  <div className="flex items-center gap-3 py-2">
                    <Switch
                      id="meeting"
                      checked={formData.meetingAfterExhibition}
                      onCheckedChange={(c) =>
                        setFormData((prev) => ({
                          ...prev,
                          meetingAfterExhibition: c,
                        }))
                      }
                      className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-[#483d73] data-[state=checked]:to-[#352c55]"
                    />
                    <Label htmlFor="meeting" className="text-sm font-medium cursor-pointer">
                      Meeting After Exhibition
                    </Label>
                  </div>

                  {/* Dynamic Fields Grid - Tighter & Cleaner for Normal Users */}
                  <div
                    className={
                      isAdmin
                        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                        : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
                    }
                  >
                    <SortableContext items={formFields.map((f) => f.uid)} strategy={rectSortingStrategy}>
                      <AnimatePresence>
                        {formFields.length === 0 ? (
                          <div className="col-span-full text-center py-16 text-gray-500">
                            <p className="text-lg font-medium">No additional fields required</p>
                          </div>
                        ) : (
                          formFields.map((field) => (
                            <div
                              key={field.uid}
                              className={
                                field.colSpan === 1
                                  ? "sm:col-span-1"
                                  : field.colSpan === 2
                                    ? "sm:col-span-2"
                                    : field.colSpan === 3
                                      ? "sm:col-span-3"
                                      : "sm:col-span-full"
                              }
                            >
                              <SortableFormField
                                field={field}
                                isAdmin={isAdmin}
                                onEdit={setEditingField}
                                onDelete={(uid) => setFormFields((prev) => prev.filter((f) => f.uid !== uid))}
                              >
                                <div className={!isAdmin ? "space-y-2" : ""}>
                                  <Label className="text-sm font-medium text-gray-900 dark:text-gray-200">
                                    {field.label}
                                    {field.required && <span className="text-red-500 ml-1">*</span>}
                                  </Label>
                                  {renderFieldInput(field, isAdmin)}
                                </div>
                              </SortableFormField>
                            </div>
                          ))
                        )}
                      </AnimatePresence>
                    </SortableContext>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting || limitReached || !isFormValid}
                    className="w-full bg-gradient-to-r from-[#483d73] to-[#352c55] text-white font-medium py-6 text-lg"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Lead"}
                  </Button>
                </CardFooter>
              </Card>
            </div>

            {publishModalOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[100] p-4">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
                >
                  {/* Header */}
                  <div className="bg-gradient-to-r from-[#483d73] to-[#352c55] p-6 text-white">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                        <Globe className="w-7 h-7" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold">Publish Form Globally?</h2>
                        <p className="text-white/80 text-sm mt-1">
                          This will affect <strong>all users</strong> immediately
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 space-y-5">
                    <div className="flex items-start gap-3 text-amber-600 dark:text-amber-400">
                      <svg className="w-6 h-6 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <p className="text-gray-700 dark:text-gray-300">
                        You're about to publish{" "}
                        <strong>
                          {formFields.length} field
                          {formFields.length !== 1 ? "s" : ""}
                        </strong>{" "}
                        to every user. This action <strong>cannot be undone</strong> without republishing.
                      </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Users will see this exact form layout on their next visit or refresh.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3 p-6 bg-gray-50 dark:bg-gray-900">
                    <Button variant="outline" onClick={() => setPublishModalOpen(false)} className="flex-1">
                      Cancel
                    </Button>
                    <Button
                      onClick={async () => {
                        setPublishModalOpen(false)
                        try {
                          const res = await fetch("/api/form-template", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ fields: formFields }),
                          })
                          if (res.ok) {
                            toast.success("Form published to all users!")
                          } else {
                            toast.error("Publish failed")
                          }
                        } catch {
                          toast.error("Network error")
                        }
                      }}
                      className="flex-1 bg-gradient-to-r from-[#483d73] to-[#352c55] text-white hover:from-[#5a5570] hover:to-[#483d73]"
                    >
                      <Globe className="w-4 h-4 mr-2" />
                      Yes, Publish Now
                    </Button>
                  </div>
                </motion.div>
              </div>
            )}

            <CameraModal isOpen={cameraOpen} onClose={() => setCameraOpen(false)} onCapture={handleCapture} />

            <DragOverlay>
              {activeDragId && activeDragId.toString().startsWith("sidebar-") ? (
                <FieldDragOverlay type={activeDragId.toString().replace("sidebar-", "") as FieldType} />
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>
      </div>

      {editingField && (
        <FieldEditor
          field={editingField}
          onSave={(updated) => {
            setFormFields((prev) => prev.map((f) => (f.uid === updated.uid ? updated : f)))
            setEditingField(null)
          }}
          onClose={() => setEditingField(null)}
        />
      )}
    </>
  )
}

export default ExhibitionForm
