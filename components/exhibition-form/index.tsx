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
  Zap,
  Globe,
  Columns,
} from "lucide-react";
import { toast as toastify, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { rectSortingStrategy } from "@dnd-kit/sortable";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  useDraggable,
  UniqueIdentifier,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";

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

function uid(prefix = "") {
  return `${prefix}${Math.random().toString(36).slice(2, 9)}`;
}

/* ==================== CAMERA MODAL - MOBILE FRIENDLY ==================== */
function CameraModal({
  isOpen,
  onClose,
  onCapture,
}: {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (file: File) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">(
    "environment"
  );

  const startStream = async () => {
    if (!videoRef.current) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode, width: { ideal: 1280 }, height: { ideal: 1280 } },
      });
      videoRef.current.srcObject = stream;
    } catch (err) {
      toastify.error("Camera access denied");
      onClose();
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
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
            const file = new File([blob], `capture-${Date.now()}.jpg`, {
              type: "image/jpeg",
            });
            onCapture(file);
            onClose(); // Auto-close after capture
          }
        },
        "image/jpeg",
        0.95
      );
    }
  };

  const switchCamera = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  };

  useEffect(() => {
    if (isOpen) startStream();
    return () => {
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream)
          .getTracks()
          .forEach((track) => track.stop());
      }
    };
  }, [isOpen, facingMode]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-6">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-xl shadow-2xl overflow-hidden max-w-lg w-full"
      >
        {/* Header */}
        <div className="p-4 bg-gray-200 border-b border-gray-300 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Capture Photo</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-2 hover:bg-gray-300"
          >
            <X className="w-5 h-5 text-gray-700" />
          </Button>
        </div>

        {/* Video Feed - Full width, natural aspect ratio */}
        <div className="relative bg-black">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-auto max-h-96 object-cover"
          />
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Bottom Controls */}
        <div className="p-4 bg-gray-200 flex justify-between items-center gap-4">
          <Button
            variant="outline"
            onClick={switchCamera}
            className="flex items-center gap-2 border-gray-400 hover:bg-gray-300"
          >
            <RefreshCw className="w-4 h-4" />
            Switch Camera
          </Button>

          <div className="flex gap-3">
            <Button
              onClick={capturePhoto}
              className="bg-[#483d73] hover:bg-[#5a5570] text-white font-medium px-6"
            >
              Capture Photo
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
/* ==================== Sidebar Draggable Block ==================== */
function SidebarFieldBlock({
  type,
  label,
  handleAddField,
  setMobileDrawerOpen,
}: {
  type: FieldType;
  label: string;
  handleAddField: (type: FieldType) => void;
  setMobileDrawerOpen: (open: boolean) => void;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `sidebar-${type}`,
    data: { type, isSidebar: true },
  });

  // Detect tap instead of drag
  function handleClick(e: React.MouseEvent) {
    // If dragging, do NOT treat it as a tap
    if (isDragging) return;
    handleAddField(type);
    setMobileDrawerOpen(false);
  }

  return (
    <motion.div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      onClick={handleClick} // 👈 tap to add
      className={`flex items-center justify-between p-3 border rounded-lg 
        cursor-grab hover:bg-gray-50 transition-all 
        ${isDragging ? "opacity-50 scale-105 shadow-lg" : ""}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 border rounded" />
        <span className="text-sm font-medium">{label}</span>
      </div>
    </motion.div>
  );
}

/* ==================== Sortable Field in Form ==================== */
function SortableFormField({
  field,
  children,
  isAdmin,
  onEdit,
  onDelete,
}: {
  field: BuilderField;
  children: React.ReactNode;
  isAdmin: boolean;
  onEdit: (f: BuilderField) => void;
  onDelete: (uid: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.uid, disabled: !isAdmin });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.7 : 1,
  };

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
          <div
            {...listeners}
            className="pt-3 cursor-grab active:cursor-grabbing select-none"
          ></div>
        )}
        <div className="flex-1 bg-white border rounded-lg p-3 shadow-sm">
          {children}
          {isAdmin && (
            <div className="flex justify-end gap-1 mt-2 -mb-2">
              <Button size="icon" variant="ghost" onClick={() => onEdit(field)}>
                <Settings className="w-4 h-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => onDelete(field.uid)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ==================== Drag Overlay ==================== */
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
    file: ""
  };

  return (
    <div className="bg-white border-2 border-blue-500 rounded-lg p-5 shadow-2xl flex items-center gap-4">
      <div className="w-8 h-8 bg-blue-100 border-2 border-blue-500 rounded flex items-center justify-center">
        <Columns className="w-5 h-5 text-blue-600" />
      </div>
      <span className="font-semibold text-lg">{labels[type] || type}</span>
    </div>
  );
}

/* ==================== Field Editor Modal ==================== */
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
        className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 max-h-screen overflow-y-auto"
      >
        <h3 className="text-xl font-bold mb-6">Edit Field</h3>
        <div className="space-y-5">
          <div>
            <Label>Field Label *</Label>
            <Input
              value={edited.label}
              onChange={(e) => setEdited({ ...edited, label: e.target.value })}
              className="mt-1"
            />
          </div>
          <div>
            <Label>Field Name (unique key) *</Label>
            <Input
              value={edited.name}
              onChange={(e) => setEdited({ ...edited, name: e.target.value })}
              placeholder="e.g. company_name"
              className="mt-1"
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
                className="mt-1"
              />
            </div>
          )}
          {(edited.type === "select" || edited.type === "radio") && (
            <div>
              <Label>Options</Label>
              <div className="space-y-2 mt-2">
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
                className="mt-1"
              />
            </div>
          )}
          <div className="flex items-center gap-3">
            <Switch
              checked={edited.required || false}
              onCheckedChange={(c) => setEdited({ ...edited, required: c })}
              className="
      data-[state=checked]:bg-gradient-to-r 
      data-[state=checked]:from-[#483d73] 
      data-[state=checked]:to-[#352c55]
    "
            />
            <Label>Required field</Label>
          </div>
          <div>
            <Label>Column Width</Label>
            <div className="grid grid-cols-4 gap-3 mt-3 ">
              {[1, 2, 3, 4].map((span) => (
                <Button
                  key={span}
                  variant={edited.colSpan === span ? "default" : "outline"}
                  size="sm"
                  onClick={() => setEdited({ ...edited, colSpan: span as any })}
                  className={`flex items-center gap-2 
    ${
      edited.colSpan === span
        ? "bg-gradient-to-r from-[#483d73] to-[#352c55] text-white border-0"
        : ""
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
                toastify.error("Label and Name are required");
                return;
              }
              onSave(edited);
              onClose();
            }}
          >
            Save Changes
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

/* ==================== MAIN COMPONENT ==================== */
export function ExhibitionForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const LIMIT = 15;
  const [submissionCount, setSubmissionCount] = useState<number>(0);
  const [isLoadingCount, setIsLoadingCount] = useState<boolean>(true);
  const [limitReached, setLimitReached] = useState<boolean>(false);

  const [formFields, setFormFields] = useState<BuilderField[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [editingField, setEditingField] = useState<BuilderField | null>(null);
  const [activeDragId, setActiveDragId] = useState<UniqueIdentifier | null>(
    null
  );

  const [frontImagePreview, setFrontImagePreview] = useState<string | null>(
    null
  );

  const [backImagePreview, setBackImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Camera state
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraSide, setCameraSide] = useState<"front" | "back">("front");

  const [formData, setFormData] = useState<Record<string, any>>({
    cardNo: searchParams?.get("cardNo") || "",
    salesPerson: searchParams?.get("salesPerson") || "",
    date: new Date().toISOString().split("T")[0],
    country: searchParams?.get("country") || "N/A",
    cardFrontPhoto: "",
    cardBackPhoto: "",
    leadStatus: "",
    dealStatus: "",
    meetingAfterExhibition: false,
    description: "",
  });

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
    () => defaultDynamicFields.map((f) => ({ ...f, uid: uid("f_") })),
    []
  );

  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  // Load template + admin + count
  useEffect(() => {
    async function loadEverything() {
      try {
        const templateRes = await fetch("/api/form-template");
        const templateData = templateRes.ok
          ? await templateRes.json()
          : { fields: [] };
        const loaded = (templateData.fields || []).map((f: any) => ({
          ...f,
          uid: f.uid || uid("f_"),
        }));
        setFormFields(loaded.length > 0 ? loaded : []);

        const sessionRes = await fetch("/api/auth/me");
        if (sessionRes.ok) {
          const session = await sessionRes.json();
          setIsAdmin(session?.user?.isAdmin === true);
        }

        const countRes = await fetch("/api/form-count");
        if (countRes.ok) {
          const { count } = await countRes.json();
          setSubmissionCount(count);
          setLimitReached(count >= LIMIT);
        }
      } catch (err) {
        setFormFields([]);
      } finally {
        setIsLoading(false);
        setIsLoadingCount(false);
      }
    }
    loadEverything();
  }, [freshDefaults]);

  // Auto card number
  useEffect(() => {
    if (!formData.cardNo && !isLoadingCount) {
      const generate = async () => {
        const res = await fetch("/api/form-count");
        if (res.ok) {
          const { count } = await res.json();
          setFormData((prev) => ({
            ...prev,
            cardNo: String(count + 1).padStart(3, "0"),
          }));
        }
      };
      generate();
    }
  }, [isLoadingCount, formData.cardNo]);

  const publishToAll = async () => {
    if (!confirm("Publish this form to all users?")) return;
    try {
      const res = await fetch("/api/form-template", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fields: formFields }),
      });
      if (res.ok) toastify.success("Published!");
      else toastify.error("Failed");
    } catch {
      toastify.error("Network error");
    }
  };

  const handleImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "front" | "back"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (type === "front") setFrontImagePreview(reader.result as string);
      else setBackImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    const fd = new FormData();
    fd.append("image", file);
    fd.append("type", type);
    const res = await fetch("/api/upload-image", { method: "POST", body: fd });
    if (res.ok) {
      const data = await res.json();
      setFormData((prev) => ({
        ...prev,
        [type === "front" ? "cardFrontPhoto" : "cardBackPhoto"]:
          data.imageUrl || data.url,
      }));
      toastify.success("Uploaded!");
    } else toastify.error("Upload failed");
  };

  const handleSubmit = async () => {
    if (!formData.cardFrontPhoto) return toastify.error("Front photo required");
    if (limitReached) return toastify.error("Limit reached");

    setIsSubmitting(true);
    try {
      const submission = {
        ...formData,
        additionalData: Object.fromEntries(
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
              ].includes(k)
          )
        ),
      };

      const res = await fetch("/api/submit-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submission),
      });

      if (res.ok) {
        toastify.success("Submitted!");
        router.push("/dashboard");
      } else {
        const err = await res.json();
        toastify.error(err.message || "Failed");
      }
    } catch {
      toastify.error("Network error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Drag & Drop Handlers
  const handleDragStart = (event: DragStartEvent) => {
    setActiveDragId(event.active.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over?.id);

    // Case 1: Dragging from sidebar
    if (activeId.startsWith("sidebar-")) {
      const type = activeId.replace("sidebar-", "") as FieldType;

      const newField: BuilderField = {
        uid: uid("f_"),
        type,
        label:
          type.charAt(0).toUpperCase() +
          type.slice(1).replace(/_/g, " ") +
          " Field",
        name: `${type}_${Date.now()}`,
        required: false,
        colSpan: 2,
        options:
          type === "select" || type === "radio"
            ? [{ label: "Option 1", value: "option1" }]
            : undefined,
      };

      // Find where to insert
      let insertIndex = formFields.length; // default: append

      if (overId && !overId.startsWith("sidebar-")) {
        const overIndex = formFields.findIndex((f) => f.uid === overId);
        if (overIndex !== -1) {
          insertIndex = overIndex + 1; // insert after the dropped-on field
        }
      }

      setFormFields((prev) => {
        const updated = [...prev];
        updated.splice(insertIndex, 0, newField);
        return updated;
      });

      toastify.success("Field added via drag!");
    }
    // Case 2: Reordering existing fields
    else if (activeId !== overId && !activeId.startsWith("sidebar-")) {
      setFormFields((fields) => {
        const oldIndex = fields.findIndex((f) => f.uid === activeId);
        const newIndex = fields.findIndex((f) => f.uid === overId);

        if (oldIndex === -1 || newIndex === -1) return fields;

        return arrayMove(fields, oldIndex, newIndex);
      });
    }

    setActiveDragId(null);
  };

  const sidebarItems = [
    { type: "text" as const, label: "Single Line Text" },
    { type: "email" as const, label: "Email" },
    { type: "number" as const, label: "Number" },
    { type: "textarea" as const, label: "Multi-line Text" },
    { type: "select" as const, label: "Dropdown" },
    { type: "checkbox" as const, label: "Checkbox" },
    { type: "radio" as const, label: "Radio Group" },
    { type: "date" as const, label: "Date" },
  ];

  const renderFieldInput = (field: BuilderField) => {
    const value = formData[field.name] || "";
    const baseClass = "mt-2";

    const onChange = (val: any) => {
      setFormData((prev) => ({ ...prev, [field.name]: val }));
    };

    switch (field.type) {
      case "textarea":
        return (
          <Textarea
            placeholder={field.placeholder || ""}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={baseClass}
          />
        );
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
        );
      case "checkbox":
        return (
          <div className="flex items-center mt-3">
            <Checkbox checked={!!value} onCheckedChange={onChange} />
            <span className="ml-2">Yes</span>
          </div>
        );
      case "date":
        return (
          <Input
            type="date"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={baseClass}
          />
        );
      case "file":
        return (
          <Input
            type="file"
            accept={field.accept}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onChange(file);
            }}
            className={baseClass}
          />
        );
      default:
        return (
          <Input
            placeholder={field.placeholder || "Enter value"}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={baseClass}
          />
        );
    }
  };

  const handleRemoveImage = (side: "front" | "back") => {
    if (side === "front") {
      setFrontImagePreview(null);
      setFormData((prev) => ({ ...prev, cardFrontPhoto: "" }));
    } else {
      setBackImagePreview(null);
      setFormData((prev) => ({ ...prev, cardBackPhoto: "" }));
    }
  };

  const handleAddField = (type: FieldType) => {
    const newField: BuilderField = {
      uid: uid("f_"),
      type,
      label: type.charAt(0).toUpperCase() + type.slice(1).replace(/_/g, " "),
      name: `${type}_${Date.now()}`,
      required: false,
      colSpan: 2,
      options:
        type === "select" || type === "radio"
          ? [{ label: "Option 1", value: "1" }]
          : undefined,
    };

    setFormFields((prev) => [...prev, newField]);
    toastify.success("Field added!");
    setMobileDrawerOpen(false);
  };
  const openCamera = (side: "front" | "back") => {
    setCameraSide(side);
    setCameraOpen(true);
  };

  const handleCapture = async (file: File) => {
    const url = URL.createObjectURL(file);
    if (cameraSide === "front") setFrontImagePreview(url);
    else setBackImagePreview(url);

    const fd = new FormData();
    fd.append("image", file, `card-${cameraSide}.jpg`);
    fd.append("type", cameraSide);

    try {
      const res = await fetch("/api/upload-image", {
        method: "POST",
        body: fd,
        // ← No headers! Browser sets correct boundary
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      const data = await res.json();
      setFormData((prev) => ({
        ...prev,
        [cameraSide === "front" ? "cardFrontPhoto" : "cardBackPhoto"]:
          data.imageUrl || data.url,
      }));
      toastify.success("Photo captured & uploaded!");
    } catch (err) {
      console.error("Upload error:", err);
      toastify.error("Upload failed - check internet connection");
    }
  };

  // Form validation – disables submit until ALL required fields are filled
  const isFormValid = useMemo(() => {
    // Front photo is mandatory
    if (!formData.cardFrontPhoto) return false;

    // Check every dynamic field that is marked as required
    for (const field of formFields) {
      if (field.required) {
        const value = formData[field.name];
        if (!value || (typeof value === "string" && value.trim() === "")) {
          return false;
        }
      }
    }

    return true;
  }, [formData, formFields]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#483d73] mx-auto mb-4" />
          <p>Loading form...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-6 sm:py-12">
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
                {/* Draggable Floating Action Button – Mobile Only */}
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

                {/* Left Drawer */}
                <AnimatePresence>
                  {mobileDrawerOpen && (
                    <>
                      {/* Backdrop */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setMobileDrawerOpen(false)}
                        className="fixed inset-0 bg-black/50 z-50 lg:hidden"
                      />

                      {/* Left Panel */}
                      <motion.div
                        initial={{ x: "-100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "-100%" }}
                        transition={{
                          type: "spring",
                          damping: 25,
                          stiffness: 300,
                        }}
                        className="fixed left-0 top-0 w-80 max-w-[90vw] bg-white shadow-2xl z-50 lg:hidden overflow-y-auto max-h-screen"
                      >
                        {/* Header */}
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

                        {/* Scrollable Content */}
                        <div className="h-[calc(100vh-88px)] overflow-y-auto p-6 space-y-6">
                          {/* Add Default Fields */}
                          <Button
                            onClick={() => {
                              setFormFields((prev) => [
                                ...prev,
                                ...freshDefaults,
                              ]);
                              setMobileDrawerOpen(false);
                            }}
                            className="w-full bg-gradient-to-r from-[#483d73] to-[#352c55] text-white"
                          >
                            <Zap className="w-5 h-5 mr-2" />
                            Add Default Fields
                          </Button>

                          {/* Sidebar Items */}
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

                          {/* Publish Button */}
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

            {/* Desktop Sidebar - ONLY visible on large screens */}
            {isAdmin && (
              <div className="hidden lg:block col-span-12 lg:col-span-3 bg-white rounded-xl shadow-sm p-6 sticky top-6 h-fit">
                <h3 className="font-bold text-lg mb-4">Form Builder</h3>
                <Button
                  onClick={() =>
                    setFormFields((prev) => [...prev, ...freshDefaults])
                  }
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
                      setMobileDrawerOpen={function (open: boolean): void {
                        throw new Error("Function not implemented.");
                      }}
                    />
                  ))}
                </div>
                <div className="mt-8 pt-6 border-t">
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
            <div
              className={isAdmin ? "col-span-12 lg:col-span-9" : "col-span-12"}
            >
              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle>Exhibition Lead Capture</CardTitle>
                  <p className="text-sm text-gray-600">
                    Submissions: {submissionCount} / {LIMIT}{" "}
                    {limitReached && " (Limit reached)"}
                  </p>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* Fixed fields - your existing ones */}

                  {/* Card Number */}
                  <div className="space-y-1">
                    <Label className="text-xs">
                      Card Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      value={formData.cardNo}
                      readOnly
                      className="bg-gray-100"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {/* CARD FRONT */}
                    <div>
                      <Label htmlFor="front">Card Front *</Label>

                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        id="front"
                        onChange={(e) => handleImageChange(e, "front")}
                      />
                      <label
                        htmlFor="front"
                        className="
      block h-32 md:h-48 border-2 border-dashed rounded-lg cursor-pointer 
      flex items-center justify-center overflow-hidden mt-2
      hover:border-[#483d73] transition relative
    "
                      >
                        {frontImagePreview ? (
                          <div className="relative w-full h-full">
                            {/* ❌ Remove Button */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveImage("front");
                              }}
                              className="
            absolute top-2 right-2 z-10
            bg-black/60 text-white w-6 h-6
            rounded-full flex items-center justify-center
            hover:bg-black/80 transition
          "
                            >
                              ✕
                            </button>

                            <Image
                              src={frontImagePreview}
                              alt="Card front preview"
                              fill
                              className="object-cover rounded-lg"
                            />
                          </div>
                        ) : (
                          <Upload className="w-10 h-10 md:w-12 md:h-12 text-gray-400" />
                        )}
                        <Button
                          onClick={() => openCamera("front")}
                          size="sm"
                          className="absolute bottom-1 right-1 bg-[#3a325e] backdrop-blur hover:bg-[#2e274b] text-white shadow-lg"
                        >
                          <Camera className="w-5 h-5" />
                        </Button>
                      </label>
                    </div>

                    {/* CARD BACK */}
                    <div>
                      <Label htmlFor="back">Card Back</Label>

                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        id="back"
                        onChange={(e) => handleImageChange(e, "back")}
                      />

                      <label
                        htmlFor={!backImagePreview ? "back" : undefined}
                        className="
      block h-32 md:h-48 border-2 border-dashed rounded-lg cursor-pointer 
      flex items-center justify-center overflow-hidden mt-2
      hover:border-[#483d73] transition relative
    "
                      >
                        {backImagePreview ? (
                          <div className="relative w-full h-full">
                            {/* ❌ Remove Button */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveImage("back");
                              }}
                              className="
            absolute top-2 right-2 z-10
            bg-black/60 text-white w-6 h-6
            rounded-full flex items-center justify-center
            hover:bg-black/80 transition
          "
                            >
                              ✕
                            </button>

                            <Image
                              src={backImagePreview}
                              alt="Card back preview"
                              fill
                              className="object-cover rounded-lg"
                            />
                          </div>
                        ) : (
                          <Upload className="w-10 h-10 md:w-12 md:h-12 text-gray-400" />
                        )}
                        <Button
                          onClick={() => openCamera("back")}
                          size="sm"
                          className="absolute bottom-1 right-1 bg-[#3a325e] backdrop-blur hover:bg-[#2e274b] text-white shadow-lg"
                        >
                          <Camera className="w-5 h-5" />
                        </Button>
                      </label>
                    </div>
                  </div>

                  {/* Lead Status */}
                  <div className="space-y-1">
                    <Label className="text-xs">Lead Status</Label>
                    <Select
                      value={formData.leadStatus}
                      onValueChange={(val) =>
                        setFormData((prev) => ({ ...prev, leadStatus: val }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select lead status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Hot">Hot</SelectItem>
                        <SelectItem value="Warm">Warm</SelectItem>
                        <SelectItem value="Cold">Cold</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs">Description</Label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      placeholder="Enter description..."
                      className="w-full min-h-24 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                    />
                  </div>

                  {/* Meeting Switch */}
                  <div className="flex items-center space-x-3">
                    <Switch
                      id="meeting"
                      checked={formData.meetingAfterExhibition}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({
                          ...prev,
                          meetingAfterExhibition: checked,
                        }))
                      }
                      className="
      data-[state=checked]:bg-gradient-to-r 
      data-[state=checked]:from-[#483d73] 
      data-[state=checked]:to-[#352c55]
    "
                    />
                    <Label htmlFor="meeting" className="text-sm">
                      Meeting After Exhibition
                    </Label>
                  </div>

                  {/* Dynamic Fields Area - ONLY DROP ZONE, NO FIELDS EVER SHOW UNLESS ADMIN ADDS THEM */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <SortableContext
                      items={formFields.map((f) => f.uid)}
                      strategy={rectSortingStrategy}
                    >
                      <AnimatePresence>
                        {formFields.length === 0 ? (
                          <div className="col-span-full text-center py-20 text-gray-500 bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-300">
                            {isAdmin ? (
                              <div className="space-y-4">
                                <p className="text-xl font-semibold text-gray-700">
                                  Start building your form
                                </p>
                                <p className="text-sm text-gray-600 max-w-md mx-auto">
                                  Drag fields from the sidebar to add them, or
                                  tap the ⚡ button on mobile
                                </p>
                                <p className="text-sm text-gray-600 max-w-md mx-auto">
                                  You have to Publish the form to save changes
                                </p>
                              </div>
                            ) : (
                              <p className="text-lg font-medium text-gray-600">
                                No additional fields required
                              </p>
                            )}
                          </div>
                        ) : (
                          formFields.map((field) => (
                            <div
                              key={field.uid}
                              className={`${
                                field.colSpan === 1
                                  ? "sm:col-span-1"
                                  : field.colSpan === 2
                                  ? "sm:col-span-2"
                                  : field.colSpan === 3
                                  ? "sm:col-span-3"
                                  : "sm:col-span-full lg:col-span-4"
                              }`}
                            >
                              <SortableFormField
                                field={field}
                                isAdmin={isAdmin}
                                onEdit={setEditingField}
                                onDelete={(uid) =>
                                  setFormFields((prev) =>
                                    prev.filter((f) => f.uid !== uid)
                                  )
                                }
                              >
                                <div>
                                  <Label className="text-sm font-medium">
                                    {field.label}{" "}
                                    {field.required && (
                                      <span className="text-red-500">*</span>
                                    )}
                                  </Label>
                                  {renderFieldInput(field)}
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
                    className="w-full bg-gradient-to-r from-[#483d73] to-[#352c55] text-white"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Lead"}
                  </Button>
                </CardFooter>
              </Card>
            </div>

            {/* Camera Modal */}
            <CameraModal
              isOpen={cameraOpen}
              onClose={() => setCameraOpen(false)}
              onCapture={handleCapture}
            />

            <DragOverlay>
              {activeDragId &&
              activeDragId.toString().startsWith("sidebar-") ? (
                <FieldDragOverlay
                  type={
                    activeDragId.toString().replace("sidebar-", "") as FieldType
                  }
                />
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>
      </div>

      {editingField && (
        <FieldEditor
          field={editingField}
          onSave={(updated) => {
            setFormFields((prev) =>
              prev.map((f) => (f.uid === updated.uid ? updated : f))
            );
            setEditingField(null);
          }}
          onClose={() => setEditingField(null)}
        />
      )}

      <ToastContainer position="bottom-right" />
    </>
  );
}

export default ExhibitionForm;
