"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Eye,
  Trash,
  MoreHorizontal,
  Edit,
  ZoomIn,
  Download,
  Loader2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import * as XLSX from "xlsx";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import type { FormData } from "@/types/form";
import { ExhibitionForm } from "@/components/exhibition-form";
import { DashboardOverview } from "@/components/admin/dashboard-overview";
import {
  ChevronDown,
  ChevronUp,
  MessageSquare,
  User,
  Scan,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function AdminDashboardEnhanced() {
  const [forms, setForms] = useState<FormData[]>([]);
  const [users, setUsers] = useState<{ id: string; email: string }[]>([]);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [openView, setOpenView] = useState<string | null>(null);
  const [openEdit, setOpenEdit] = useState<string | null>(null);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [showManage, setShowManage] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [showNotes, setShowNotes] = useState(false);
  const [templateFields, setTemplateFields] = useState<any[]>([]);
  const [isSilentLoading, setIsSilentLoading] = useState(false); // ← ADD THIS LINE
  const [visibleColumns, setVisibleColumns] = useState<string[]>(() => {
    // Load saved columns from localStorage (persists user choice)
    const saved = localStorage.getItem("dashboard-visible-columns");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.warn("Failed to parse saved columns");
      }
    }

    // Default visible columns
    const defaults = [
      "cardImage",
      "cardNo",
      "date",
      "user",
      "personName",
      "company",
      "city",
      "state",
      "country",
      "leadStatus",
      "meeting",
    ];

    // Auto-detect ALL dynamic fields that exist in any submission
    const dynamicKeys = forms
      .flatMap((f) => Object.keys(f.additionalData || {}))
      .filter((key) => key !== "description"); // optional: exclude description

    const dynamicIds = [...new Set(dynamicKeys)].map((key) => `add_${key}`);

    return [...defaults, ...dynamicIds];
  });

  const possibleColumns = useMemo(() => {
    const fixedColumns = [
      {
        id: "cardImage",
        label: "Card Image",
        width: "w-24",
        render: (form: FormData) =>
          form.cardFrontPhoto ? (
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
          ),
      },
      {
        id: "cardNo",
        label: "Card No",
        width: "w-24",
        render: (form: FormData) => form.cardNo ?? "N/A",
      },
      {
        id: "salesPerson",
        label: "Sales Person",
        width: "w-28",
        render: (form: FormData) => form.salesPerson ?? "N/A",
      },
      {
        id: "date",
        label: "Date",
        width: "w-24",
        render: (form: FormData) =>
          form.date ? new Date(form.date).toLocaleDateString() : "N/A",
      },
      {
        id: "user",
        label: "User",
        width: "w-40",
        render: (form: FormData) => form.user?.email || "N/A",
      },
      {
        id: "personName",
        label: "Person Name",
        width: "w-32",
        render: (form: FormData) =>
          form.mergedData?.name || form.additionalData?.contactPerson || "N/A",
      },
      // Example: Company column
      {
        id: "company",
        label: "Company Name",
        width: "w-32",
        render: (form: FormData) => {
          const extracted = form.extractedData?.companyName;
          const manual = form.additionalData?.company;
          const status = form.extractionStatus;

          // If OCR is still running → show "Processing..."
          if (status === "PENDING" || status === "PROCESSING") {
            return (
              <span className="text-xs text-amber-600 italic">
                Processing AI...
              </span>
            );
          }

          // If OCR failed → show manual or "Failed"
          if (status === "FAILED") {
            return (
              manual || <span className="text-xs text-red-600">OCR Failed</span>
            );
          }

          // OCR done → show extracted (or fallback to manual)
          return extracted || manual || "N/A";
        },
      },
      {
        id: "city",
        label: "City",
        width: "w-28",
        render: (form: FormData) => {
          const extracted = form.extractedData?.city;
          const manual = form.additionalData?.city;
          const status = form.extractionStatus;

          // If OCR is still running → show "Processing..."
          if (status === "PENDING" || status === "PROCESSING") {
            return (
              <span className="text-xs text-amber-600 italic">
                Processing AI...
              </span>
            );
          }

          // If OCR failed → show manual or "Failed"
          if (status === "FAILED") {
            return (
              manual || <span className="text-xs text-red-600">OCR Failed</span>
            );
          }

          // OCR done → show extracted (or fallback to manual)
          return extracted || manual || "N/A";
        },
      },
      {
        id: "state",
        label: "State",
        width: "w-24",
        render: (form: FormData) => {
          const extracted = form.extractedData?.state;
          const manual = form.additionalData?.state;
          const status = form.extractionStatus;

          // If OCR is still running → show "Processing..."
          if (status === "PENDING" || status === "PROCESSING") {
            return (
              <span className="text-xs text-amber-600 italic">
                Processing AI...
              </span>
            );
          }

          // If OCR failed → show manual or "Failed"
          if (status === "FAILED") {
            return (
              manual || <span className="text-xs text-red-600">OCR Failed</span>
            );
          }

          // OCR done → show extracted (or fallback to manual)
          return extracted || manual || "N/A";
        },
      },
      {
        id: "country",
        label: "Country",
        width: "w-24",
        render: (form: FormData) => {
          const extracted = form.extractedData?.country;
          const manual = form.additionalData?.country;
          const status = form.extractionStatus;

          // If OCR is still running → show "Processing..."
          if (status === "PENDING" || status === "PROCESSING") {
            return (
              <span className="text-xs text-amber-600 italic">
                Processing AI...
              </span>
            );
          }

          // If OCR failed → show manual or "Failed"
          if (status === "FAILED") {
            return (
              manual || <span className="text-xs text-red-600">OCR Failed</span>
            );
          }

          // OCR done → show extracted (or fallback to manual)
          return extracted || manual || "N/A";
        },
      },
      {
        id: "contactInfo",
        label: "Contact Info",
        width: "w-32",
        render: (form: FormData) => {
          const merged = form.mergedData;
          return (
            <>
              {merged?.email && <div className="truncate">{merged.email}</div>}
              {merged?.contactNumbers && (
                <div className="text-[10px] text-muted-foreground truncate">
                  {merged.contactNumbers.split(",")[0]}
                </div>
              )}
            </>
          );
        },
      },
      {
        id: "leadStatus",
        label: "Lead Status",
        width: "w-24",
        render: (form: FormData) => form.leadStatus ?? "N/A",
      },
      {
        id: "meeting",
        label: "Meeting",
        width: "w-20",
        render: (form: FormData) =>
          form.meetingAfterExhibition ? "Yes" : "No",
      },
      {
        id: "description",
        label: "Description",
        width: "w-72",
        render: (form: FormData) => {
          const desc = form.description?.trim();
          if (desc) {
            return (
              <div className="text-xs leading-relaxed">
                <span className="text-gray-800 dark:text-[#d1d5db]">
                  {desc.length > 100 ? desc.slice(0, 100) + "..." : desc}
                </span>
              </div>
            );
          }
          return (
            <span className="text-[12px] text-muted-foreground">
              No Description Provided by the User
            </span>
          );
        },
      },
      {
        id: "formStatus",
        label: "Form Status",
        width: "w-24",
        render: (form: FormData) => form.status ?? "N/A",
      },
{
  id: "extractionStatus",
  label: "OCR Status",
  width: "w-36",
  render: (form: FormData) => {
    const status = form.extractionStatus || "NOT_STARTED";
    const isProcessing = status === "PENDING" || status === "PROCESSING";

    return (
      <div className="flex items-center gap-2">
        {isProcessing && (
          <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
        )}
        <span className={`font-medium text-xs ${
          status === "COMPLETED" ? "text-green-600" :
          status === "FAILED" ? "text-red-600" :
          isProcessing ? "text-blue-600" : "text-gray-500"
        }`}>
          {isProcessing ? "Processing AI..." : 
           status === "COMPLETED" ? "Completed" :
           status === "FAILED" ? "Failed" : status}
        </span>
      </div>
    );
  },
},
      {
        id: "zohoStatus",
        label: "Zoho Status",
        width: "w-24",
        render: (form: FormData) => form.zohoStatus ?? "N/A",
      },
      {
        id: "actions",
        label: "Actions",
        width: "w-24",
        render: (form: FormData) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-[10px]"
              >
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setOpenView(form.id!)}>
                <Eye className="mr-2 h-3 w-3" /> View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setOpenEdit(form.id!)}>
                <Edit className="mr-2 h-3 w-3" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setPendingDeleteId(form.id!);
                  setConfirmDeleteOpen(true);
                }}
                className="focus:bg-destructive focus:text-destructive-foreground"
              >
                <Trash className="mr-2 h-3 w-3" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ];

    const priorityExtractedKeys = [
      "address",
      "contactNumbers",
      "email",
      "website",
    ];

    const priorityExtractedColumns = priorityExtractedKeys.map((key) => ({
      id: `ext_${key}`,
      label:
        key === "contactNumbers"
          ? "Contact Number"
          : key === "website"
          ? "Website"
          : key.charAt(0).toUpperCase() + key.slice(1),
      width: "w-40",
      render: (form: FormData) => {
        const value = form.extractedData?.[key];
        if (!value) return "—";

        if (key === "website" && value) {
          const url = value.startsWith("http") ? value : `https://${value}`;
          return (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline text-xs"
            >
              {value.length > 35 ? value.slice(0, 35) + "..." : value}
            </a>
          );
        }

        const str = String(value);
        return (
          <div className="text-xs text-gray-800 dark:text-[#d1d5db]">
            {str.length > 50 ? str.slice(0, 50) + "..." : str}
          </div>
        );
      },
    }));

    // Dynamic additionalData columns
    const blockedAdditionalKeys = [
      "id",
      "Id",
      "ID",
      "formId",
      "FormId",
      "formID",
      "createdAt",
      "CreatedAt",
      "created_at",
      "updatedAt",
      "UpdatedAt",
      "updated_at",
      "status",
      "Status",
      "description",
      "Description",
      "extractionStatus",
      "ExtractionStatus",
      "zohoStatus",
      "ZohoStatus",
      "userId",
      "UserId",
      "mergedData",
      "extractedData",
      "__v",
      "_id",
    ];

    const allAdditionalKeys = forms
      .flatMap((f) => Object.keys(f.additionalData || {}))
      .filter(
        (key) =>
          !blockedAdditionalKeys.some(
            (blocked) => key.toLowerCase() === blocked.toLowerCase()
          )
      );

    const uniqueAdditional = [...new Set(allAdditionalKeys)];

    const additionalColumns = uniqueAdditional.map((key) => ({
      id: `add_${key}`,
      label: key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
      width: "w-36",
      render: (form: FormData) => {
        const value = form.additionalData?.[key];
        if (!value) return "—";
        const str = String(value);
        return (
          <div className="text-xs text-gray-800 dark:text-[#d1d5db]">
            {str.length > 50 ? str.slice(0, 50) + "..." : str}
          </div>
        );
      },
    }));

    // FIXED: Dynamic extractedData columns — ONLY block exact matches
    const allExtractedKeys = forms.flatMap((f) =>
      Object.keys(f.extractedData || {})
    );
    const blockedKeys = [
      "companyName",
      "name",
      "email",
      "contactNumbers",
      "city",
      "state",
      "country",
      "address",
      "description",
      "website",
    ];
    const uniqueExtracted = [...new Set(allExtractedKeys)]
      .filter((key) => !blockedKeys.includes(key))
      .slice(0, 15);

    const extractedColumns = uniqueExtracted.map((key) => ({
      id: `ext_${key}`,
      label: key
        .replace(/_/g, " ")
        .replace(/\b\w/g, (l: string) => l.toUpperCase()),
      width: "w-36",
      render: (form: FormData) => form.extractedData?.[key] || "—",
    }));

    return [
      ...fixedColumns,
      ...priorityExtractedColumns,
      ...additionalColumns,
      ...extractedColumns,
    ];
  }, [forms]);

  const displayColumns = useMemo(
    () => [...visibleColumns, "actions"],
    [visibleColumns]
  );

const fetchForms = useCallback(async (silent = false) => {
  if (!silent) {
    setIsLoading(true);
  } else {
    setIsSilentLoading(true);
  }

  try {
    const res = await fetch("/api/forms", {
      method: "GET",
      headers: { "Cache-Control": "no-cache" },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      if (errorData.limitReached) {
        toast({
          title: "Limit Reached",
          description: errorData.message || "Form submission limit reached.",
          variant: "destructive",
        });
        setForms([]);
        extractUniqueUsers([]);
        return;
      }
      throw new Error(`Failed to fetch forms: ${res.status}`);
    }

    const data = await res.json();
    const fetchedForms = data.forms || data || [];
    setForms(fetchedForms);
    extractUniqueUsers(fetchedForms);

    // Show toast only if OCR completed during this fetch
    const previousProcessing = forms.filter(f => 
      ["PENDING", "PROCESSING"].includes(f.extractionStatus || "")
    );
    const nowCompleted = fetchedForms.filter(f => 
      f.extractionStatus === "COMPLETED" && 
      previousProcessing.some(p => p.id === f.id)
    );

    if (nowCompleted.length > 0) {
      toast({
        title: "OCR Completed!",
        description: `${nowCompleted.length} card${nowCompleted.length > 1 ? 's' : ''} extracted successfully`,
      });
    }

  } catch (error) {
    console.error("Error fetching forms:", error);
    toast({
      title: "Error",
      description: "Failed to fetch forms.",
      variant: "destructive",
    });
    setForms([]);
    extractUniqueUsers([]);
  } finally {
    if (!silent) {
      setIsLoading(false);
    }
    setIsSilentLoading(false);
  }
}, [toast, forms]); // ← Added 'forms' as dependency

  // Load the current published form template (so we know which fields exist)
  useEffect(() => {
    fetch("/api/form-template")
      .then((r) => (r.ok ? r.json() : { fields: [] }))
      .then((data) => setTemplateFields(data.fields || []))
      .catch(() => setTemplateFields([]));
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(
      "dashboard-visible-columns",
      JSON.stringify(visibleColumns)
    );
  }, [visibleColumns]);

  useEffect(() => {
    fetchForms();
  }, [fetchForms]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedUser]);

  const extractUniqueUsers = (data: FormData[] = forms) => {
    if (!data || data.length === 0) return setUsers([]);
    const usersMap = new Map<string, { id: string; email: string }>();
    data.forEach((form) => {
      if (form.userId)
        usersMap.set(form.userId, {
          id: form.userId,
          email: form.user?.email || "Unknown",
        });
    });
    setUsers(Array.from(usersMap.values()));
  };




const handleDownloadExcel = async () => {
  try {
    setIsDownloading(true);

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Business Cards");

    sheet.columns = [
      { header: "Card Image", key: "image", width: 20 },
      { header: "Card No", key: "cardNo", width: 20 },
      { header: "Name", key: "name", width: 25 },
      { header: "Company", key: "company", width: 30 },
      { header: "Email", key: "email", width: 30 },
      { header: "City", key: "city", width: 15 },
      { header: "Country", key: "country", width: 15 }
    ];

    let rowIndex = 2;

    for (const form of filteredForms) {

      // Add normal row first
      sheet.addRow({
        cardNo: form.cardNo || "",
        name: form.mergedData?.name || "",
        company: form.mergedData?.companyName || "",
        email: form.extractedData?.email || "",
        city: form.extractedData?.city || "",
        country: form.extractedData?.country || ""
      });

      // If image exists → embed into Excel
      if (form.cardFrontPhoto) {
        const imageBuffer = await fetch(form.cardFrontPhoto)
          .then(res => res.arrayBuffer());

        const imageId = workbook.addImage({
          buffer: imageBuffer,
          extension: "jpeg"
        });

        sheet.addImage(imageId, {
          tl: { col: 0, row: rowIndex - 1 },
          ext: { width: 50, height: 35 }
        });

        sheet.getRow(rowIndex).height = 30;
      }

      rowIndex++;
    }

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), "Business_Cards.xlsx");

  } catch (error) {
    console.error(error);
    toast({
      title: "Export Failed",
      description: "Could not generate Excel file with images.",
      variant: "destructive"
    });
  } finally {
    setIsDownloading(false);
  }
};

  const handleDelete = async (id?: string) => {
    if (!id) {
      return toast({
        title: "Unable to delete",
        description: "Form id is missing.",
        variant: "destructive",
      });
    }
    try {
      setIsLoading(true);
      const res = await fetch(`/api/forms/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const errorData = await res.text();
        throw new Error(
          `Failed to delete form: ${res.status} ${
            errorData || "No response body"
          }`
        );
      }
      setForms((prev) => prev.filter((f) => f.id !== id));
      toast({ title: "Deleted", description: "Form deleted successfully." });
    } catch (err) {
      console.error("Error deleting form:", err);
      toast({
        title: "Error",
        description: "Failed to delete form.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatData = (data: any) => {
    if (!data) return "No data available";
    return Object.entries(data)
      .map(([key, value]) => {
        const formattedKey = key
          .replace(/_/g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase());
        if (Array.isArray(value))
          return `${formattedKey}: ${value.join(", ") || "None"}`;
        return `${formattedKey}: ${value ?? "None"}`;
      })
      .join("\n");
  };

  const handleUpdate = useCallback(
    async (updatedData: any, formId: string, closeDialog: () => void) => {
      const coreFields = [
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
        "extractionStatus",
      ];

      const submissionData = {
        ...updatedData,
        date: updatedData.date
          ? new Date(updatedData.date).toISOString()
          : undefined,
        additionalData: Object.fromEntries(
          Object.entries(updatedData).filter(
            ([key]) => !coreFields.includes(key)
          )
        ),
      };

      try {
        const res = await fetch(`/api/forms/${encodeURIComponent(formId)}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(submissionData),
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(
            `Failed to update form: ${res.status} ${text || "No response body"}`
          );
        }

        setForms((prev) =>
          prev.map((f) =>
            f.id === formId
              ? {
                  ...f,
                  ...submissionData,
                  additionalData: submissionData.additionalData,
                }
              : f
          )
        );

        toast({
          title: "Form Updated",
          description: "Changes saved successfully!",
        });
        closeDialog();
        fetchForms();
      } catch (err) {
        console.error("Error updating form:", err);
        toast({
          title: "Error updating form",
          description:
            err instanceof Error ? err.message : "Failed to update form.",
          variant: "destructive",
        });
      }
    },
    [toast, fetchForms]
  );

  const handleExtractedDataUpdate = useCallback(
    async (updatedData: any, formId: string, closeDialog: () => void) => {
      try {
        const res = await fetch(`/api/forms/${encodeURIComponent(formId)}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ extractedData: updatedData }),
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(
            `Failed to update extracted data: ${res.status} ${
              text || "No response body"
            }`
          );
        }

        // FIXED: Immediately update local state with the new extractedData
        setForms((prev) =>
          prev.map((f) =>
            f.id === formId ? { ...f, extractedData: updatedData } : f
          )
        );

        toast({
          title: "Extracted Data Updated",
          description: "Changes saved successfully!",
        });
        closeDialog();

        // FIXED: Refetch to ensure consistency, but local update ensures immediate UI refresh
        setTimeout(() => fetchForms(), 500); // Small delay to avoid race condition
      } catch (err) {
        console.error("Error updating extracted data:", err);
        toast({
          title: "Error updating extracted data",
          description:
            err instanceof Error
              ? err.message
              : "Failed to update extracted data.",
          variant: "destructive",
        });
      }
    },
    [toast, fetchForms]
  );

  const filteredForms = useMemo(
    () =>
      forms.filter((form) => {
        if (selectedUser !== "all" && form.userId !== selectedUser)
          return false;
        const q = search.toLowerCase();
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
          ((form.user?.email || "") as string).toLowerCase().includes(q)
        );
      }),
    [forms, search, selectedUser]
  );

  const totalPages = Math.ceil(filteredForms.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredForms.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };
  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  };

  const ExtractedDataForm = ({
    form,
    closeDialog,
  }: {
    form: FormData;
    closeDialog: () => void;
  }) => {
    const initialData = useRef(form.extractedData || {});
    const [formData, setFormData] = useState<Record<string, string>>(() => ({
      ...(form.extractedData || {}),
    }));
    const disabledFields = ["id", "formId", "createdAt", "updatedAt", "status"];

    const hasChanges = useMemo(
      () => JSON.stringify(formData) !== JSON.stringify(initialData.current),
      [formData]
    );

    const handleChange = (key: string, value: string) => {
      setFormData((prev) => ({ ...prev, [key]: value }));
    };

    const handleSubmit = () => {
      // FIXED: Simplify - use formData directly as it's the updated state
      // No need to merge with original or override disabled (since disabled aren't changed)
      const updatedData = { ...formData };

      if (form.id) {
        handleExtractedDataUpdate(updatedData, form.id, closeDialog);
      }
    };

    return (
      <div className="space-y-4">
        {Object.entries(form.extractedData || {}).map(([key]) => (
          <div key={key} className="flex flex-col gap-2">
            <label className="text-sm font-medium">
              {key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
            </label>
            <Input
              value={formData[key] || ""}
              onChange={(e) => handleChange(key, e.target.value)}
              className="w-full"
              disabled={disabledFields.includes(key)}
            />
          </div>
        ))}
        {Object.keys(form.extractedData || {}).length === 0 && (
          <div className="text-sm text-muted-foreground">
            No extracted data available
          </div>
        )}
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={closeDialog}>
            Cancel
          </Button>
          <Button
            className="bg-[#62588b] hover:bg-[#31294e] text-white"
            onClick={handleSubmit}
            disabled={
              !hasChanges || Object.keys(form.extractedData || {}).length === 0
            }
          >
            Save Changes
          </Button>
        </div>
      </div>
    );
  };

  const MergedDataView = ({ data }: { data: any }) => {
    const [view, setView] = useState<"raw" | "table">("table");

    return (
      <Card className="bg-white dark:bg-gray-800 border border-[#e5e2f0] dark:border-gray-700 shadow-sm">
        <CardHeader className="border-b border-[#e5e2f0] dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
          <CardTitle className="text-[#2d2a4a] dark:text-white">
            Merged Information
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex gap-2 mb-4">
            <Button
              className={
                view === "raw"
                  ? "bg-[#62588b] hover:bg-[#31294e] text-white"
                  : "border-[#483d73] text-[#483d73] hover:bg-[#f3f1f8] dark:hover:bg-gray-700"
              }
              variant={view === "raw" ? "default" : "outline"}
              onClick={() => setView("raw")}
            >
              Raw Data
            </Button>
            <Button
              className={
                view === "table"
                  ? "bg-[#62588b] hover:bg-[#31294e] text-white"
                  : "border-[#483d73] text-[#483d73] hover:bg-[#f3f1f8] dark:hover:bg-gray-700"
              }
              variant={view === "table" ? "default" : "outline"}
              onClick={() => setView("table")}
            >
              Table Data
            </Button>
          </div>

          {view === "raw" ? (
            <ScrollArea className="h-[calc(90vh-200px)] bg-muted dark:bg-gray-900 p-4 rounded-md border border-[#e5e2f0] dark:border-gray-700">
              <pre className="text-sm whitespace-pre-wrap text-gray-800 dark:text-gray-300 font-mono">
                {formatData(data)}
              </pre>
            </ScrollArea>
          ) : (
            <ScrollArea className="h-[calc(90vh-200px)]">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr>
                    <th className="bg-gray-100 dark:bg-gray-700 py-2 px-2 border border-[#e5e2f0] dark:border-gray-600 text-left w-1/2 font-medium text-[#2d2a4a] dark:text-gray-200">
                      Field
                    </th>
                    <th className="bg-gray-100 dark:bg-gray-700 py-2 px-2 border border-[#e5e2f0] dark:border-gray-600 text-left w-1/2 font-medium text-[#2d2a4a] dark:text-gray-200">
                      Value
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(data).map(([key, value]) => (
                    <tr
                      key={key}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                    >
                      <td className="py-1 px-2 border border-[#e5e2f0] dark:border-gray-700 w-1/2 whitespace-normal break-words text-gray-800 dark:text-gray-200">
                        {key
                          .replace(/_/g, " ")
                          .replace(/\b\w/g, (l) => l.toUpperCase())}
                      </td>
                      <td className="py-1 px-2 border border-[#e5e2f0] dark:border-gray-700 w-1/2 whitespace-normal break-words text-gray-700 dark:text-gray-300">
                        {typeof value === "object" && value !== null
                          ? JSON.stringify(value, null, 2)
                          : String(value ?? "N/A")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    );
  };

  const FormDataView = ({ data }: { data: FormData }) => {
    const [view, setView] = useState<"raw" | "table">("table");
    const mergedData = data.mergedData;

    return (
      <Card className="bg-white dark:bg-gray-800 border border-[#e5e2f0] dark:border-gray-700 shadow-sm">
        <CardHeader className="border-b border-[#e5e2f0] dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
          <CardTitle className="text-[#2d2a4a] dark:text-white">
            Form Details
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex gap-2 mb-4">
            <Button
              className={
                view === "raw"
                  ? "bg-[#62588b] hover:bg-[#31294e] text-white"
                  : "border-[#483d73] text-[#483d73] hover:bg-[#f3f1f8] dark:hover:bg-gray-700"
              }
              variant={view === "raw" ? "default" : "outline"}
              onClick={() => setView("raw")}
            >
              Raw Data
            </Button>
            <Button
              className={
                view === "table"
                  ? "bg-[#62588b] hover:bg-[#31294e] text-white"
                  : "border-[#483d73] text-[#483d73] hover:bg-[#f3f1f8] dark:hover:bg-gray-700"
              }
              variant={view === "table" ? "default" : "outline"}
              onClick={() => setView("table")}
            >
              Table Data
            </Button>
          </div>

          {view === "raw" ? (
            <ScrollArea className="h-[calc(90vh-200px)] bg-muted dark:bg-gray-900 p-4 rounded-md border border-[#e5e2f0] dark:border-gray-700">
              <pre className="text-sm whitespace-pre-wrap text-gray-800 dark:text-gray-300 font-mono">
                {formatData(data)}
              </pre>
            </ScrollArea>
          ) : (
            <ScrollArea className="h-[calc(90vh-200px)]">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr>
                    <th className="bg-gray-100 dark:bg-gray-700 py-2 px-2 border border-[#e5e2f0] dark:border-gray-600 text-left w-1/2 font-medium text-[#2d2a4a] dark:text-gray-200">
                      Field
                    </th>
                    <th className="bg-gray-100 dark:bg-gray-700 py-2 px-2 border border-[#e5e2f0] dark:border-gray-600 text-left w-1/2 font-medium text-[#2d2a4a] dark:text-gray-200">
                      Value
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                    <td className="py-1 px-2 border border-[#e5e2f0] dark:border-gray-700 w-1/2 whitespace-normal break-words font-medium text-[#2d2a4a] dark:text-white">
                      Card Image
                    </td>
                    <td className="py-1 px-2 border border-[#e5e2f0] dark:border-gray-700 w-1/2">
                      {data.cardFrontPhoto ? (
                        <button
                          onClick={() => setZoomedImage(data.cardFrontPhoto!)}
                          className="group relative block"
                        >
                          <img
                            src={data.cardFrontPhoto || "/placeholder.svg"}
                            alt="Card"
                            className="max-w-32 max-h-20 object-contain rounded border transition group-hover:opacity-80"
                          />
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                            <ZoomIn className="h-5 w-5 text-white drop-shadow" />
                          </div>
                        </button>
                      ) : (
                        <span className="text-muted-foreground dark:text-gray-500 text-xs">
                          No image
                        </span>
                      )}
                    </td>
                  </tr>

                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                    <td className="py-1 px-2 border border-[#e5e2f0] dark:border-gray-700 w-1/2 whitespace-normal break-words text-[#2d2a4a] dark:text-gray-300">
                      Card No
                    </td>
                    <td className="py-1 px-2 border border-[#e5e2f0] dark:border-gray-700 w-1/2 whitespace-normal break-words text-gray-800 dark:text-gray-200">
                      {data.cardNo ?? "N/A"}
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                    <td className="py-1 px-2 border border-[#e5e2f0] dark:border-gray-700 w-1/2 whitespace-normal break-words text-[#2d2a4a] dark:text-gray-300">
                      Sales Person
                    </td>
                    <td className="py-1 px-2 border border-[#e5e2f0] dark:border-gray-700 w-1/2 whitespace-normal break-words text-gray-800 dark:text-gray-200">
                      {data.salesPerson ?? "N/A"}
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                    <td className="py-1 px-2 border border-[#e5e2f0] dark:border-gray-700 w-1/2 whitespace-normal break-words text-[#2d2a4a] dark:text-gray-300">
                      Date
                    </td>
                    <td className="py-1 px-2 border border-[#e5e2f0] dark:border-gray-700 w-1/2 whitespace-normal break-words text-gray-800 dark:text-gray-200">
                      {data.date
                        ? new Date(data.date).toLocaleDateString()
                        : "N/A"}
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                    <td className="py-1 px-2 border border-[#e5e2f0] dark:border-gray-700 w-1/2 whitespace-normal break-words text-[#2d2a4a] dark:text-gray-300">
                      User
                    </td>
                    <td className="py-1 px-2 border border-[#e5e2f0] dark:border-gray-700 w-1/2 whitespace-normal break-words text-gray-800 dark:text-gray-200">
                      {data.user?.email || "N/A"}
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                    <td className="py-1 px-2 border border-[#e5e2f0] dark:border-gray-700 w-1/2 whitespace-normal break-words text-[#2d2a4a] dark:text-gray-300">
                      Company
                    </td>
                    <td className="py-1 px-2 border border-[#e5e2f0] dark:border-gray-700 w-1/2 whitespace-normal break-words">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {mergedData?.companyName || "N/A"}
                      </div>
                      <div className="text-[10px] text-muted-foreground dark:text-gray-500">
                        {mergedData?.name || "No contact"}
                      </div>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                    <td className="py-1 px-2 border border-[#e5e2f0] dark:border-gray-700 w-1/2 whitespace-normal break-words text-[#2d2a4a] dark:text-gray-300">
                      Contact Info
                    </td>
                    <td className="py-1 px-2 border border-[#e5e2f0] dark:border-gray-700 w-1/2 whitespace-normal break-words">
                      {mergedData?.email && (
                        <div className="text-gray-800 dark:text-gray-200">
                          {mergedData.email}
                        </div>
                      )}
                      {mergedData?.contactNumbers && (
                        <div className="text-[10px] text-muted-foreground dark:text-gray-500">
                          {mergedData.contactNumbers.split(",")[0]}
                        </div>
                      )}
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                    <td className="py-1 px-2 border border-[#e5e2f0] dark:border-gray-700 w-1/2 whitespace-normal break-words text-[#2d2a4a] dark:text-gray-300">
                      Lead Status
                    </td>
                    <td className="py-1 px-2 border border-[#e5e2f0] dark:border-gray-700 w-1/2 whitespace-normal break-words text-gray-800 dark:text-gray-200">
                      {data.leadStatus ?? "N/A"}
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                    <td className="py-1 px-2 border border-[#e5e2f0] dark:border-gray-700 w-1/2 whitespace-normal break-words text-[#2d2a4a] dark:text-gray-300">
                      Deal Status
                    </td>
                    <td className="py-1 px-2 border border-[#e5e2f0] dark:border-gray-700 w-1/2 whitespace-normal break-words text-gray-800 dark:text-gray-200">
                      {data.dealStatus ?? "N/A"}
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                    <td className="py-1 px-2 border border-[#e5e2f0] dark:border-gray-700 w-1/2 whitespace-normal break-words text-[#2d2a4a] dark:text-gray-300">
                      Meeting
                    </td>
                    <td className="py-1 px-2 border border-[#e5e2f0] dark:border-gray-700 w-1/2 whitespace-normal break-words text-gray-800 dark:text-gray-200">
                      {data.meetingAfterExhibition ? "Yes" : "No"}
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                    <td className="py-1 px-2 border border-[#e5e2f0] dark:border-gray-700 w-1/2 whitespace-normal break-words text-[#2d2a4a] dark:text-gray-300">
                      Form Status
                    </td>
                    <td className="py-1 px-2 border border-[#e5e2f0] dark:border-gray-700 w-1/2 whitespace-normal break-words text-gray-800 dark:text-gray-200">
                      {data.status ?? "N/A"}
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                    <td className="py-1 px-2 border border-[#e5e2f0] dark:border-gray-700 w-1/2 whitespace-normal break-words text-[#2d2a4a] dark:text-gray-300">
                      Extraction Status
                    </td>
                    <td className="py-1 px-2 border border-[#e5e2f0] dark:border-gray-700 w-1/2 whitespace-normal break-words text-gray-800 dark:text-gray-200">
                      {data.extractionStatus ?? "N/A"}
                    </td>
                  </tr>

                  {/* Dynamic Fields */}
                  {data.additionalData &&
                    Object.keys(data.additionalData).length > 0 && (
                      <>
                        <tr>
                          <td
                            colSpan={2}
                            className="py-2 px-2 border border-[#e5e2f0] dark:border-gray-700 bg-gray-50 dark:bg-gray-900 font-medium text-sm text-[#2d2a4a] dark:text-white"
                          >
                            Custom Fields
                          </td>
                        </tr>
                        {Object.entries(data.additionalData).map(
                          ([key, value]) => (
                            <tr
                              key={key}
                              className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                            >
                              <td className="py-1 px-2 border border-[#e5e2f0] dark:border-gray-700 w-1/2 whitespace-normal break-words text-[#2d2a4a] dark:text-gray-300">
                                {key
                                  .replace(/_/g, " ")
                                  .replace(/\b\w/g, (l) => l.toUpperCase())}
                              </td>
                              <td className="py-1 px-2 border border-[#e5e2f0] dark:border-gray-700 w-1/2 whitespace-normal break-words text-gray-800 dark:text-gray-200">
                                {String(value ?? "N/A")}
                              </td>
                            </tr>
                          )
                        )}
                      </>
                    )}
                </tbody>
              </table>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    );
  };

  const selectedViewForm = openView
    ? forms.find((f) => f.id === openView)
    : null;
  const selectedEditForm = openEdit
    ? forms.find((f) => f.id === openEdit)
    : null;

  return (
    <div className="space-y-6 px-2 sm:px-4 py-6 bg-[#f3f1f8] dark:bg-gray-900 min-h-screen">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-white dark:bg-gray-800 border-b border-[#e5e2f0] dark:border-gray-700">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-[#483d73] data-[state=active]:text-white"
          >
            Dashboard Overview
          </TabsTrigger>
          <TabsTrigger
            value="data"
            className="data-[state=active]:bg-[#483d73] data-[state=active]:text-white"
          >
            Card Data
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <DashboardOverview forms={forms} />
        </TabsContent>

        <TabsContent value="data" className="space-y-4">
          {/* ------------------- MOBILE VERSION ------------------- */}
          <div className="sm:hidden flex flex-col gap-3">
            <div className="flex w-full gap-2">
              <Input
                placeholder="Search forms..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 h-9 px-2 text-sm bg-white dark:bg-gray-800 border-[#e5e2f0] dark:border-gray-700"
              />
              <Select value={selectedUser} onValueChange={setSelectedUser}>
                <SelectTrigger className="h-9 px-2 text-sm w-32 bg-white dark:bg-gray-800 border-[#e5e2f0] dark:border-gray-700">
                  <SelectValue placeholder="Users" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  {users.map((u) => (
                    <SelectItem key={u.id} value={u.id}>
                      {u.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex w-full gap-2">
              <Button
                onClick={handleDownloadExcel}
                disabled={isDownloading || filteredForms.length === 0}
                className="flex-1 h-9 px-2 text-xs bg-[#483d73] hover:bg-[#352c55] text-white"
              >
                {isDownloading ? (
                  <>
                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                    Export
                  </>
                ) : (
                  <>
                    <Download className="h-3.5 w-3.5 mr-1" />
                    Download Excel ({filteredForms.length})
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                onClick={() => setShowManage(true)}
                className="flex-1 h-9 px-2 text-xs border-[#483d73] text-[#483d73] hover:bg-[#483d73]/10 dark:hover:bg-gray-700"
              >
                Manage Columns
              </Button>
            </div>
          </div>

          {/* ------------------- DESKTOP VERSION ------------------- */}
          <div className="hidden sm:flex flex-row justify-between items-center gap-3">
            <Input
              placeholder="Search forms..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-64 h-9 bg-white dark:bg-gray-800 border-[#e5e2f0] dark:border-gray-700"
            />

            <div className="flex items-center gap-2">
              <Select value={selectedUser} onValueChange={setSelectedUser}>
                <SelectTrigger className="w-48 text-xs h-9 bg-white dark:bg-gray-800 border-[#e5e2f0] dark:border-gray-700">
                  <SelectValue placeholder="All Users" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  {users.map((u) => (
                    <SelectItem key={u.id} value={u.id}>
                      {u.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                onClick={handleDownloadExcel}
                disabled={isDownloading || filteredForms.length === 0}
                size="sm"
                className="h-9 px-3 text-xs bg-[#483d73] hover:bg-[#352c55] text-white"
              >
                {isDownloading ? (
                  <>
                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="h-3.5 w-3.5 mr-1" />
                    Download Excel ({filteredForms.length})
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                onClick={() => setShowManage(true)}
                className="bg-[#483d73] hover:bg-[#31294e] text-white hover:text-white h-9 px-3 text-xs"
              >
                Manage Columns
              </Button>
            </div>
          </div>

          {/* ------------------- TABLE + PAGINATION ------------------- */}
          <Card className="bg-white dark:bg-gray-800 shadow-lg border-none">
            <CardContent className="p-0 mt-8">
              <div className="w-full h-[30rem] flex flex-col">
                <div className="w-full overflow-auto">
                  <table className="w-full text-sm border-collapse table-fixed min-w-[1350px]">
                    <thead className="sticky top-0 z-10 bg-gray-100 dark:bg-gray-800">
                      <tr>
                        {displayColumns.map((colId) => {
                          const col = possibleColumns.find(
                            (c) => c.id === colId
                          );
                          if (!col) return null;
                          return (
                            <th
                              key={colId}
                              className={`py-2 px-2 border border-[#e5e2f0] dark:border-gray-700 ${col.width} text-left text-xs font-medium text-gray-700 dark:text-gray-300`}
                            >
                              {col.label}
                            </th>
                          );
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.length > 0 ? (
                        currentItems
                          .filter((form) => form.id)
                          .map((form) => (
                            <tr
                              key={form.id!}
                              className="text-xs hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                            >
                              {displayColumns.map((colId) => {
                                const col = possibleColumns.find(
                                  (c) => c.id === colId
                                );
                                if (!col) return null;
                                return (
                                  <td
                                    key={colId}
                                    className={`py-1 px-2 border border-[#e5e2f0] dark:border-gray-700 ${col.width} text-gray-800 dark:text-gray-300`}
                                  >
                                    {col.render(form)}
                                  </td>
                                );
                              })}
                            </tr>
                          ))
                      ) : (
                        <tr>
                          <td
                            colSpan={displayColumns.length}
                            className="py-8 text-center border border-[#e5e2f0] dark:border-gray-700 text-gray-600 dark:text-gray-400"
                          >
                            {isLoading ? "Loading..." : "No forms found"}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-between items-center mt-2 px-4 py-3 bg-white dark:bg-gray-800 border-t border-[#e5e2f0] dark:border-gray-700">
                  <div className="flex gap-2 items-center">
                    <Button
                      className="bg-[#483d73] hover:bg-[#31294e] text-white"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Prev
                    </Button>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      className="bg-[#483d73] hover:bg-[#31294e] text-white"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>

                  <Select
                    value={String(itemsPerPage)}
                    onValueChange={handleItemsPerPageChange}
                  >
                    <SelectTrigger className="w-[80px] bg-white dark:bg-gray-800 border-[#e5e2f0] dark:border-gray-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[5, 10, 20, 50].map((num) => (
                        <SelectItem key={num} value={String(num)}>
                          {num}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Manage Columns Dialog*/}
<Dialog open={showManage} onOpenChange={setShowManage}>
  <DialogContent className="max-h-[90vh] max-w-lg bg-white dark:bg-gray-800 border border-[#e5e2f0] dark:border-gray-700">
    <DialogHeader className="border-b border-[#e5e2f0] dark:border-gray-700 pb-4">
      <DialogTitle className="text-[#2d2a4a] dark:text-white text-lg font-bold">
        Manage Dashboard Columns
      </DialogTitle>
    </DialogHeader>

    <ScrollArea className="max-h-[60vh] pr-4 py-4">
      <div className="space-y-8">

        {/* Optional Fields */}
        <div className=" border-[#e5e2f0] dark:border-gray-700 pt-2">
          <h4 className="font-bold text-sm mb-4 text-blue-700 dark:text-blue-400">
            Optional Fields
          </h4>
          <div className="space-y-3">
            {possibleColumns.some((col) => col.id === "description") && (
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="opt-user-desc"
                  checked={visibleColumns.includes("description")}
                  onCheckedChange={(checked) => {
                    setVisibleColumns((prev) =>
                      checked
                        ? [...prev, "description"]
                        : prev.filter((id) => id !== "description")
                    );
                  }}
                />
                <Label
                  htmlFor="opt-user-desc"
                  className="text-sm font-medium text-gray-800 dark:text-gray-200 cursor-pointer"
                >
                  Description
                </Label>
              </div>
            )}
          </div>
        </div>

        {/* Form Fields (User-Added via Drag & Drop) */}
        <div className="border-t border-[#e5e2f0] dark:border-gray-700 pt-6">
          <h4 className="font-bold text-sm mb-4 text-green-700 dark:text-green-400 flex items-center gap-2">
            Form Fields
          </h4>
          {possibleColumns.filter((col) => col.id.startsWith("add_")).length > 0 ? (
            <div className="grid gap-3">
              {possibleColumns
                .filter((col) => col.id.startsWith("add_"))
                .sort((a, b) => a.label.localeCompare(b.label))
                .map((col) => (
                  <div key={col.id} className="flex items-center space-x-3">
                    <Checkbox
                      checked={visibleColumns.includes(col.id)}
                      onCheckedChange={(checked) => {
                        setVisibleColumns((prev) =>
                          checked
                            ? [...prev, col.id]
                            : prev.filter((id) => id !== col.id)
                        );
                      }}
                    />
                    <Label className="text-sm font-medium text-gray-800 dark:text-gray-200 cursor-pointer">
                      {col.label}
                    </Label>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400 italic">
              No custom fields added yet
            </p>
          )}
        </div>

        {/* Extracted Fields (Only the 4 you want) */}
        <div className="border-t border-[#e5e2f0] dark:border-gray-700 pt-6">
          <h4 className="font-bold text-sm mb-4 text-purple-700 dark:text-purple-400 flex items-center gap-2">
            Extracted Fields
          </h4>
          <div className="grid gap-3">
            {["address", "contactNumbers", "email", "website"].map((key) => {
              const col = possibleColumns.find((c) => c.id === `ext_${key}`);
              if (!col) return null;

              return (
                <div key={col.id} className="flex items-center space-x-3">
                  <Checkbox
                    id={`extracted-${col.id}`}
                    checked={visibleColumns.includes(col.id)}
                    onCheckedChange={(checked) => {
                      setVisibleColumns((prev) =>
                        checked
                          ? [...prev, col.id]
                          : prev.filter((id) => id !== col.id)
                      );
                    }}
                  />
                  <Label
                    htmlFor={`extracted-${col.id}`}
                    className="text-sm font-medium text-gray-800 dark:text-gray-200 cursor-pointer"
                  >
                    {col.label}
                  </Label>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </ScrollArea>

    <div className="flex justify-end pt-4 border-t border-[#e5e2f0] dark:border-gray-700">
      <Button
        onClick={() => setShowManage(false)}
        className="bg-[#483d73] hover:bg-[#31294e] text-white font-medium px-6"
      >
        Done
      </Button>
    </div>
  </DialogContent>
</Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <DialogContent className="bg-white dark:bg-gray-800 border border-[#e5e2f0] dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-[#2d2a4a] dark:text-white">
              Confirm Delete
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-[#5a5570] dark:text-gray-300">
              Are you sure you want to delete this record? This action cannot be
              undone.
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setConfirmDeleteOpen(false);
                setPendingDeleteId(null);
              }}
              className="border-[#483d73] text-[#483d73] hover:bg-[#f3f1f8] dark:hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={async () => {
                if (pendingDeleteId) {
                  await handleDelete(pendingDeleteId);
                  setConfirmDeleteOpen(false);
                  setPendingDeleteId(null);
                }
              }}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      {selectedViewForm && selectedViewForm.id && (
        <Dialog open={true} onOpenChange={() => setOpenView(null)}>
          <DialogContent className="w-[95vw] max-w-lg sm:max-w-3xl lg:max-w-4xl h-[90vh] p-3 sm:p-6 overflow-hidden flex flex-col bg-white dark:bg-gray-800 border border-[#e5e2f0] dark:border-gray-700">
            <DialogHeader className="border-b border-[#e5e2f0] dark:border-gray-700 pb-4">
              <DialogTitle className="text-base sm:text-lg text-[#2d2a4a] dark:text-white">
                Business Card - {selectedViewForm.cardNo || "N/A"}
              </DialogTitle>
            </DialogHeader>

            <div className="flex-grow overflow-y-auto">
              <Tabs defaultValue="merged" className="w-full">
                <TabsList className="flex overflow-x-auto whitespace-nowrap sticky top-0 bg-white dark:bg-gray-800 z-20 border-b border-[#e5e2f0] dark:border-gray-700">
                  <TabsTrigger
                    className="flex-shrink-0 data-[state=active]:bg-[#483d73] data-[state=active]:text-white"
                    value="merged"
                  >
                    Merged Data
                  </TabsTrigger>
                  <TabsTrigger
                    className="flex-shrink-0 data-[state=active]:bg-[#483d73] data-[state=active]:text-white"
                    value="extracted"
                  >
                    Extracted
                  </TabsTrigger>
                  <TabsTrigger
                    className="flex-shrink-0 data-[state=active]:bg-[#483d73] data-[state=active]:text-white"
                    value="form"
                  >
                    Form
                  </TabsTrigger>
                  <TabsTrigger
                    className="flex-shrink-0 data-[state=active]:bg-[#483d73] data-[state=active]:text-white"
                    value="images"
                  >
                    Images
                  </TabsTrigger>
                </TabsList>

                <ScrollArea className="h-[calc(90vh-140px)] sm:h-[calc(90vh-150px)]">
                  <TabsContent value="merged" className="space-y-6">
                    {(() => {
                      const manualDescription =
                        selectedViewForm.description?.trim();
                      const ocrDescription =
                        selectedViewForm.extractedData?.description?.trim();

                      return (
                        <>
                          <div className="space-y-4">
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full justify-between border-2 border-purple-200 bg-purple-50 hover:bg-purple-100 
               dark:border-purple-700 dark:bg-purple-900/30 dark:hover:bg-purple-900/50"
                              onClick={() => setShowNotes(!showNotes)}
                            >
                              <div className="flex items-center gap-2">
                                <MessageSquare className="w-5 h-5 text-purple-700 dark:text-purple-400" />
                                <span className="font-semibold text-purple-900 dark:text-purple-300">
                                  {showNotes ? "Hide" : "Show"} Notes
                                </span>
                              </div>
                              {showNotes ? (
                                <ChevronUp className="w-5 h-5 text-purple-700 dark:text-purple-400" />
                              ) : (
                                <ChevronDown className="w-5 h-5 text-purple-700 dark:text-purple-400" />
                              )}
                            </Button>

                            <AnimatePresence>
                              {showNotes && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.3 }}
                                  className="overflow-hidden"
                                >
                                  <div className="space-y-4">
                                    {manualDescription ? (
                                      <Card
                                        className="border-2 border-blue-300 bg-gradient-to-br from-blue-50 to-indigo-50 
                            dark:border-purple-300  dark:from-blue-900/40 dark:to-purple-900/40 shadow-lg"
                                      >
                                        <CardHeader className="pb-3">
                                          <CardTitle className="text-lg font-bold text-blue-900 dark:text-blue-900 flex items-center gap-2">
                                            <User className="w-5 h-5" />
                                            Customer Description
                                          </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                          <p className="text-sm text-gray-800 dark:text-gray-800 whitespace-pre-wrap leading-relaxed font-medium">
                                            {manualDescription}
                                          </p>
                                        </CardContent>
                                      </Card>
                                    ) : (
                                      <div className="text-center py-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                                        <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                                          No notes added by the customer
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>

                          <MergedDataView
                            data={{
                              ...selectedViewForm,
                              ...(selectedViewForm.extractedData || {}),
                              description:
                                manualDescription ||
                                ocrDescription ||
                                "No description",
                            }}
                          />
                        </>
                      );
                    })()}
                  </TabsContent>

                  <TabsContent value="extracted">
                    <Card className="bg-white dark:bg-gray-800">
                      <CardHeader>
                        <CardTitle className="text-sm sm:text-base text-[#2d2a4a] dark:text-white">
                          Extracted Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ExtractedDataForm
                          form={selectedViewForm}
                          closeDialog={() => setOpenView(null)}
                        />
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="form">
                    <FormDataView data={selectedViewForm} />
                  </TabsContent>

                  <TabsContent value="images">
                    <Card className="bg-white dark:bg-gray-800">
                      <CardHeader>
                        <CardTitle className="text-sm sm:text-base text-[#2d2a4a] dark:text-white">
                          Card Images
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ScrollArea className="h-[calc(90vh-220px)] sm:h-[calc(90vh-240px)]">
                          <div className="space-y-6">
                            <div>
                              <h4 className="text-sm font-medium mb-3 text-[#2d2a4a] dark:text-white">
                                Front Side
                              </h4>
                              {selectedViewForm.cardFrontPhoto ? (
                                <button
                                  onClick={() =>
                                    setZoomedImage(
                                      selectedViewForm.cardFrontPhoto!
                                    )
                                  }
                                  className="block w-full"
                                >
                                  <img
                                    src={selectedViewForm.cardFrontPhoto}
                                    alt="Card Front"
                                    className="w-full max-h-64 sm:max-h-80 object-contain rounded-md border"
                                  />
                                </button>
                              ) : (
                                <p className="text-xs text-muted-foreground dark:text-gray-500">
                                  No front image available
                                </p>
                              )}
                            </div>

                            {selectedViewForm.cardBackPhoto && (
                              <div>
                                <h4 className="text-sm font-medium mb-3 text-[#2d2a4a] dark:text-white">
                                  Back Side
                                </h4>
                                <button
                                  onClick={() =>
                                    setZoomedImage(
                                      selectedViewForm.cardBackPhoto!
                                    )
                                  }
                                  className="block w-full"
                                >
                                  <img
                                    src={selectedViewForm.cardBackPhoto}
                                    alt="Card Back"
                                    className="w-full max-h-64 sm:max-h-80 object-contain rounded-md border"
                                  />
                                </button>
                              </div>
                            )}
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
      )}

      {/* EDIT DIALOG */}
      {selectedEditForm && selectedEditForm.id && (
        <Dialog open={true} onOpenChange={() => setOpenEdit(null)}>
          <DialogContent
            className="max-w-4xl max-h-[92vh] p-4 sm:p-6 overflow-y-auto bg-white dark:bg-gray-800 border border-[#e5e2f0] dark:border-gray-700"
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            <DialogHeader className="space-y-3 pb-4 border-b border-[#e5e2f0] dark:border-gray-700">
              <DialogTitle className="text-lg sm:text-xl font-semibold text-[#2d2a4a] dark:text-white">
                Edit Lead - {selectedEditForm.cardNo || "N/A"}
              </DialogTitle>
              <p className="text-sm text-[#5a5570] dark:text-gray-400">
                Update lead details and custom fields below
              </p>
            </DialogHeader>

            <div className="mt-5">
              <ExhibitionForm
                initialData={{
                  cardNo: selectedEditForm.cardNo || "",
                  salesPerson: selectedEditForm.salesPerson || "",
                  date: selectedEditForm.date
                    ? new Date(selectedEditForm.date)
                        .toISOString()
                        .split("T")[0]
                    : "",
                  country: selectedEditForm.country || "",
                  cardFrontPhoto: selectedEditForm.cardFrontPhoto || "",
                  cardBackPhoto: selectedEditForm.cardBackPhoto || "",
                  leadStatus: selectedEditForm.leadStatus || "",
                  dealStatus: selectedEditForm.dealStatus || "",
                  meetingAfterExhibition:
                    selectedEditForm.meetingAfterExhibition || false,
                  description: selectedEditForm.description || "",
                }}
                onSubmit={(updatedData: any) =>
                  handleUpdate(updatedData, selectedEditForm.id!, () =>
                    setOpenEdit(null)
                  )
                }
                isEdit={true}
                formId={selectedEditForm.id!}
                disabledFields={["cardNo", "date"]}
                forceRestoreFields={Object.keys(
                  selectedEditForm.additionalData || {}
                )}
                prefillValues={selectedEditForm.additionalData || {}}
                builderMode="compact"
                hidePublishButton={true}
                disableFieldDragging={false}
                maxImageHeight="180px"
              />
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Zoomed Image */}
      {zoomedImage && (
        <Dialog open={true} onOpenChange={() => setZoomedImage(null)}>
          <DialogContent className="max-w-3xl p-0 overflow-hidden bg-black">
            <img
              src={zoomedImage || "/placeholder.svg"}
              alt="Zoomed Card"
              className="w-full h-auto max-h-[80vh] object-contain"
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
