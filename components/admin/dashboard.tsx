// "use client";

// import { useState, useEffect, useCallback, useRef, useMemo } from "react";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import {
//   Eye,
//   Trash,
//   MoreHorizontal,
//   Edit,
//   ZoomIn,
//   Download,
//   Loader2,
// } from "lucide-react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { useToast } from "@/components/ui/use-toast";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import * as XLSX from "xlsx"; // NEW: Excel library
// import type { FormData } from "@/types/form";
// import { ExhibitionForm } from "@/components/exhibition-form";

// export function AdminDashboard() {
//   const [forms, setForms] = useState<FormData[]>([]);
//   const [users, setUsers] = useState<{ id: string; email: string }[]>([]);
//   const [search, setSearch] = useState("");
//   const [selectedUser, setSelectedUser] = useState<string>("all");
//   const [isLoading, setIsLoading] = useState(false);
//   const [isDownloading, setIsDownloading] = useState(false); // NEW: Download loading state
//   const { toast } = useToast();
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(10);
//   const [openView, setOpenView] = useState<string | null>(null);
//   const [openEdit, setOpenEdit] = useState<string | null>(null);
//   const [zoomedImage, setZoomedImage] = useState<string | null>(null);

//   useEffect(() => {
//     fetchForms();
//   }, []);

//   useEffect(() => {
//     setCurrentPage(1);
//   }, [search, selectedUser]);

//   const fetchForms = async () => {
//     try {
//       setIsLoading(true);
//       const res = await fetch("/api/forms", {
//         method: "GET",
//         headers: { "Cache-Control": "no-cache" },
//       });
//       if (!res.ok) {
//         const errorData = await res.json().catch(() => ({}));
//         if (errorData.limitReached) {
//           toast({
//             title: "Limit Reached",
//             description:
//               errorData.message ||
//               "Form submission limit reached. Please upgrade your plan.",
//             variant: "destructive",
//           });
//           setForms([]);
//           extractUniqueUsers([]);
//           return;
//         }
//         throw new Error(`Failed to fetch forms: ${res.status}`);
//       }
//       const data = await res.json();
//       const fetchedForms = data.forms || data || [];
//       setForms(fetchedForms);
//       extractUniqueUsers(fetchedForms);
//     } catch (error) {
//       console.error("Error fetching forms:", error);
//       toast({
//         title: "Error",
//         description: "Failed to fetch forms.",
//         variant: "destructive",
//       });
//       setForms([]);
//       extractUniqueUsers([]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const extractUniqueUsers = (data: FormData[] = forms) => {
//     if (!data || data.length === 0) return setUsers([]);
//     const usersMap = new Map<string, { id: string; email: string }>();
//     data.forEach((form) => {
//       if (form.userId)
//         usersMap.set(form.userId, {
//           id: form.userId,
//           email: form.user?.email || "Unknown",
//         });
//     });
//     setUsers(Array.from(usersMap.values()));
//   };

//   // --------------------------------------------------------------------- //
//   //  NEW: EXCEL DOWNLOAD FUNCTION
//   // --------------------------------------------------------------------- //
//   const handleDownloadExcel = async () => {
//     try {
//       setIsDownloading(true);

//       // Get filtered data (same as table)
//       const filteredData = forms.filter((form) => {
//         if (selectedUser !== "all" && form.userId !== selectedUser)
//           return false;
//         const q = search.toLowerCase();
//         return (
//           (form.cardNo || "").toLowerCase().includes(q) ||
//           (form.country || "").toLowerCase().includes(q) ||
//           (form.salesPerson || "").toLowerCase().includes(q) ||
//           ((form.mergedData?.companyName || "") as string)
//             .toLowerCase()
//             .includes(q) ||
//           ((form.mergedData?.name || "") as string).toLowerCase().includes(q) ||
//           ((form.mergedData?.email || "") as string)
//             .toLowerCase()
//             .includes(q) ||
//           ((form.mergedData?.contactNumbers || "") as string)
//             .toLowerCase()
//             .includes(q) ||
//           ((form.user?.email || "") as string).toLowerCase().includes(q)
//         );
//       });

//       if (filteredData.length === 0) {
//         toast({
//           title: "No Data",
//           description: "No data available to export.",
//           variant: "default",
//         });
//         return;
//       }

//       // Transform data for Excel
//       const excelData = filteredData.map((form) => ({
//         "Card Image": form.cardFrontPhoto || "",
//         "Card No": form.cardNo || "",
//         "Sales Person": form.salesPerson || "",
//         Date: form.date ? new Date(form.date).toLocaleDateString() : "",
//         "User Email": form.user?.email || "",
//         "Company Name": form.mergedData?.companyName || "",
//         "Contact Name": form.mergedData?.name || "",
//         "Contact Email": form.mergedData?.email || "",
//         "Contact Numbers": form.mergedData?.contactNumbers || "",
//         Country: form.country || "",
//         "Lead Status": form.leadStatus || "",
//         "Deal Status": form.dealStatus || "",
//         "Meeting After Exhibition": form.meetingAfterExhibition ? "Yes" : "No",
//         "Form Status": form.status || "",
//         "Extraction Status": form.extractionStatus || "",
//         "Zoho Status": form.zohoStatus || "",
//         "Industry Categories": Array.isArray(form.industryCategories)
//           ? form.industryCategories.join(", ")
//           : form.industryCategories || "",
//         Description: form.description || "",
//         "Created At": form.createdAt
//           ? new Date(form.createdAt).toLocaleString()
//           : "",
//         "Updated At": form.updatedAt
//           ? new Date(form.updatedAt).toLocaleString()
//           : "",
//         "Form ID": form.id || "",
//         "User ID": form.userId || "",
//         "Card Back Image": form.cardBackPhoto || "",
//       }));

//       // Create workbook and worksheet
//       const workbook = XLSX.utils.book_new();
//       const worksheet = XLSX.utils.json_to_sheet(excelData);

//       // Auto-size columns
//       const colWidths = [
//         { wch: 15 }, // Card Image
//         { wch: 12 }, // Card No
//         { wch: 15 }, // Sales Person
//         { wch: 12 }, // Date
//         { wch: 25 }, // User Email
//         { wch: 25 }, // Company Name
//         { wch: 20 }, // Contact Name
//         { wch: 25 }, // Contact Email
//         { wch: 20 }, // Contact Numbers
//         { wch: 12 }, // Country
//         { wch: 12 }, // Lead Status
//         { wch: 12 }, // Deal Status
//         { wch: 22 }, // Meeting After Exhibition
//         { wch: 12 }, // Form Status
//         { wch: 18 }, // Extraction Status
//         { wch: 12 }, // Zoho Status
//         { wch: 20 }, // Industry Categories
//         { wch: 30 }, // Description
//         { wch: 18 }, // Created At
//         { wch: 18 }, // Updated At
//         { wch: 20 }, // Form ID
//         { wch: 20 }, // User ID
//         { wch: 15 }, // Card Back Image
//       ];
//       worksheet["!cols"] = colWidths;

//       // Add worksheet to workbook
//       XLSX.utils.book_append_sheet(workbook, worksheet, "Business Cards");

//       // Generate filename with timestamp
//       const timestamp = new Date()
//         .toISOString()
//         .slice(0, 19)
//         .replace(/:/g, "-");
//       const filename = `Business_Cards_${timestamp}.xlsx`;

//       // Download file
//       XLSX.writeFile(workbook, filename);

//       toast({
//         title: "Download Complete",
//         description: `${filteredData.length} records exported to Excel successfully!`,
//       });
//     } catch (error) {
//       console.error("Error downloading Excel:", error);
//       toast({
//         title: "Export Failed",
//         description: "Failed to download Excel file.",
//         variant: "destructive",
//       });
//     } finally {
//       setIsDownloading(false);
//     }
//   };

//   const handleDelete = async (id?: string) => {
//     if (!id) {
//       return toast({
//         title: "Unable to delete",
//         description: "Form id is missing.",
//         variant: "destructive",
//       });
//     }
//     if (
//       !confirm(
//         "Are you sure you want to delete this record? This action cannot be undone."
//       )
//     )
//       return;
//     try {
//       setIsLoading(true);
//       const res = await fetch(`/api/forms/${encodeURIComponent(id)}`, {
//         method: "DELETE",
//       });
//       if (!res.ok) {
//         const errorData = await res.text();
//         throw new Error(
//           `Failed to delete form: ${res.status} ${
//             errorData || "No response body"
//           }`
//         );
//       }
//       setForms((prev) => prev.filter((f) => f.id !== id));
//       toast({ title: "Deleted", description: "Form deleted successfully." });
//     } catch (err) {
//       console.error("Error deleting form:", err);
//       toast({
//         title: "Error",
//         description: "Failed to delete form.",
//         variant: "destructive",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const formatData = (data: any) => {
//     if (!data) return "No data available";
//     return Object.entries(data)
//       .map(([key, value]) => {
//         const formattedKey = key
//           .replace(/_/g, " ")
//           .replace(/\b\w/g, (l) => l.toUpperCase());
//         if (Array.isArray(value))
//           return `${formattedKey}: ${value.join(", ") || "None"}`;
//         return `${formattedKey}: ${value ?? "None"}`;
//       })
//       .join("\n");
//   };

//   const handleUpdate = useCallback(
//     async (updatedData: any, formId: string, closeDialog: () => void) => {
//       const submissionData = {
//         ...updatedData,
//         date: updatedData.date
//           ? new Date(updatedData.date).toISOString()
//           : undefined,
//       };
//       try {
//         const res = await fetch(`/api/forms/${encodeURIComponent(formId)}`, {
//           method: "PATCH",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(submissionData),
//         });

//         if (!res.ok) {
//           const text = await res.text();
//           throw new Error(
//             `Failed to update form: ${res.status} ${text || "No response body"}`
//           );
//         }

//         const responseData = await res.json();
//         setForms((prev) =>
//           prev.map((f) => (f.id === formId ? { ...f, ...submissionData } : f))
//         );

//         toast({
//           title: "Form Updated",
//           description: "Changes saved successfully!",
//         });
//         closeDialog();
//         fetchForms();
//       } catch (err) {
//         console.error("Error updating form:", err);
//         toast({
//           title: "Error updating form",
//           description:
//             err instanceof Error ? err.message : "Failed to update form.",
//           variant: "destructive",
//         });
//       }
//     },
//     [toast, fetchForms]
//   );

//   const handleExtractedDataUpdate = useCallback(
//     async (updatedData: any, formId: string, closeDialog: () => void) => {
//       try {
//         const res = await fetch(`/api/forms/${encodeURIComponent(formId)}`, {
//           method: "PATCH",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ extractedData: updatedData }),
//         });

//         if (!res.ok) {
//           const text = await res.text();
//           throw new Error(
//             `Failed to update extracted data: ${res.status} ${
//               text || "No response body"
//             }`
//           );
//         }

//         const responseData = await res.json();
//         setForms((prev) =>
//           prev.map((f) =>
//             f.id === formId ? { ...f, extractedData: updatedData } : f
//           )
//         );
//         toast({
//           title: "Extracted Data Updated",
//           description: "Changes saved successfully!",
//         });
//         closeDialog();
//         fetchForms();
//       } catch (err) {
//         console.error("Error updating extracted data:", err);
//         toast({
//           title: "Error updating extracted data",
//           description:
//             err instanceof Error
//               ? err.message
//               : "Failed to update extracted data.",
//           variant: "destructive",
//         });
//       }
//     },
//     [toast, fetchForms]
//   );

//   const filteredForms = forms.filter((form) => {
//     if (selectedUser !== "all" && form.userId !== selectedUser) return false;
//     const q = search.toLowerCase();
//     return (
//       (form.cardNo || "").toLowerCase().includes(q) ||
//       (form.country || "").toLowerCase().includes(q) ||
//       (form.salesPerson || "").toLowerCase().includes(q) ||
//       ((form.mergedData?.companyName || "") as string)
//         .toLowerCase()
//         .includes(q) ||
//       ((form.mergedData?.name || "") as string).toLowerCase().includes(q) ||
//       ((form.mergedData?.email || "") as string).toLowerCase().includes(q) ||
//       ((form.mergedData?.contactNumbers || "") as string)
//         .toLowerCase()
//         .includes(q) ||
//       ((form.user?.email || "") as string).toLowerCase().includes(q)
//     );
//   });

//   const totalPages = Math.ceil(filteredForms.length / itemsPerPage);
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentItems = filteredForms.slice(indexOfFirstItem, indexOfLastItem);

//   const handlePageChange = (page: number) => {
//     if (page < 1 || page > totalPages) return;
//     setCurrentPage(page);
//   };
//   const handleItemsPerPageChange = (value: string) => {
//     setItemsPerPage(Number(value));
//     setCurrentPage(1);
//   };

//   const ExtractedDataForm = ({
//     form,
//     closeDialog,
//   }: {
//     form: FormData;
//     closeDialog: () => void;
//   }) => {
//     const initialData = useRef(form.extractedData || {});
//     const [formData, setFormData] = useState<Record<string, string>>(() => ({
//       ...(form.extractedData || {}),
//     }));
//     const disabledFields = ["id", "formId", "createdAt", "updatedAt", "status"];

//     const hasChanges = useMemo(
//       () => JSON.stringify(formData) !== JSON.stringify(initialData.current),
//       [formData]
//     );

//     const handleChange = (key: string, value: string) => {
//       setFormData((prev) => ({ ...prev, [key]: value }));
//     };

//     const handleSubmit = () => {
//       const updatedData = { ...form.extractedData, ...formData };
//       disabledFields.forEach((field) => {
//         if (form.extractedData?.[field] !== undefined) {
//           updatedData[field] = form.extractedData[field];
//         }
//       });
//       if (form.id) {
//         handleExtractedDataUpdate(updatedData, form.id, closeDialog);
//       }
//     };

//     return (
//       <div className="space-y-4">
//         {Object.entries(form.extractedData || {}).map(([key, value]) => (
//           <div key={key} className="flex flex-col gap-2">
//             <label className="text-sm font-medium">
//               {key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
//             </label>
//             <Input
//               value={
//                 formData[key as keyof typeof formData] ??
//                 (value as string) ??
//                 ""
//               }
//               onChange={(e) => handleChange(key, e.target.value)}
//               className="w-full"
//               disabled={disabledFields.includes(key)}
//             />
//           </div>
//         ))}
//         {Object.keys(form.extractedData || {}).length === 0 && (
//           <div className="text-sm text-muted-foreground">
//             No extracted data available
//           </div>
//         )}
//         <div className="flex justify-end gap-2">
//           <Button variant="outline" onClick={closeDialog}>
//             Cancel
//           </Button>
//           <Button
//             className="bg-[#62588b] hover:bg-[#31294e]"
//             onClick={handleSubmit}
//             disabled={
//               !hasChanges || Object.keys(form.extractedData || {}).length === 0
//             }
//           >
//             Save Changes
//           </Button>
//         </div>
//       </div>
//     );
//   };

//   const MergedDataView = ({ data }: { data: any }) => {
//     const [view, setView] = useState<"raw" | "table">("table");

//     return (
//       <Card>
//         <CardHeader>
//           <CardTitle>Merged Information</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="flex gap-2 mb-4">
//             <Button
//               className={
//                 view === "raw"
//                   ? "bg-[#62588b] hover:bg-[#31294e] text-white"
//                   : ""
//               }
//               variant={view === "raw" ? "default" : "outline"}
//               onClick={() => setView("raw")}
//             >
//               Raw Data
//             </Button>
//             <Button
//               className={
//                 view === "table"
//                   ? "bg-[#62588b] hover:bg-[#31294e] text-white"
//                   : ""
//               }
//               variant={view === "table" ? "default" : "outline"}
//               onClick={() => setView("table")}
//             >
//               Table Data
//             </Button>
//           </div>
//           {view === "raw" ? (
//             <ScrollArea className="h-[calc(90vh-200px)] bg-muted p-4 rounded-md">
//               <pre className="text-sm whitespace-pre-wrap">
//                 {formatData(data)}
//               </pre>
//             </ScrollArea>
//           ) : (
//             <ScrollArea className="h-[calc(90vh-200px)]">
//               <table className="w-full text-sm border-collapse">
//                 <thead>
//                   <tr>
//                     <th className="bg-gray-100 py-2 px-2 border text-left w-1/2">
//                       Field
//                     </th>
//                     <th className="bg-gray-100 py-2 px-2 border text-left w-1/2">
//                       Value
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {Object.entries(data).map(([key, value]) => (
//                     <tr key={key}>
//                       <td className="py-1 px-2 border w-1/2 whitespace-normal break-words ">
//                         {key
//                           .replace(/_/g, " ")
//                           .replace(/\b\w/g, (l) => l.toUpperCase())}
//                       </td>
//                       <td className="py-1 px-2 border w-1/2 whitespace-normal break-words">
//                         {typeof value === "object" && value !== null
//                           ? JSON.stringify(value, null, 2)
//                           : String(value ?? "N/A")}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </ScrollArea>
//           )}
//         </CardContent>
//       </Card>
//     );
//   };

//   const FormDataView = ({ data }: { data: FormData }) => {
//     const [view, setView] = useState<"raw" | "table">("table");
//     const mergedData = data.mergedData;

//     return (
//       <Card>
//         <CardHeader>
//           <CardTitle>Form Details</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="flex gap-2 mb-4">
//             <Button
//               className={
//                 view === "raw"
//                   ? "bg-[#62588b] hover:bg-[#31294e] text-white"
//                   : ""
//               }
//               variant={view === "raw" ? "default" : "outline"}
//               onClick={() => setView("raw")}
//             >
//               Raw Data
//             </Button>
//             <Button
//               className={
//                 view === "table"
//                   ? "bg-[#62588b] hover:bg-[#31294e] text-white"
//                   : ""
//               }
//               variant={view === "table" ? "default" : "outline"}
//               onClick={() => setView("table")}
//             >
//               Table Data
//             </Button>
//           </div>
//           {view === "raw" ? (
//             <ScrollArea className="h-[calc(90vh-200px)] bg-muted p-4 rounded-md">
//               <pre className="text-sm whitespace-pre-wrap">
//                 {formatData(data)}
//               </pre>
//             </ScrollArea>
//           ) : (
//             <ScrollArea className="h-[calc(90vh-200px)]">
//               <table className="w-full text-sm border-collapse">
//                 <thead>
//                   <tr>
//                     <th className="bg-gray-100 py-2 px-2 border text-left w-1/2">
//                       Field
//                     </th>
//                     <th className="bg-gray-100 py-2 px-2 border text-left w-1/2">
//                       Value
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {/* FIRST ROW: Card Image */}
//                   <tr>
//                     <td className="py-1 px-2 border w-1/2 whitespace-normal break-words font-medium">
//                       Card Image
//                     </td>
//                     <td className="py-1 px-2 border w-1/2">
//                       {data.cardFrontPhoto ? (
//                         <button
//                           onClick={() => setZoomedImage(data.cardFrontPhoto!)}
//                           className="group relative block"
//                         >
//                           <img
//                             src={data.cardFrontPhoto}
//                             alt="Card"
//                             className="max-w-32 max-h-20 object-contain rounded border transition group-hover:opacity-80"
//                           />
//                           <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
//                             <ZoomIn className="h-5 w-5 text-white drop-shadow" />
//                           </div>
//                         </button>
//                       ) : (
//                         <span className="text-muted-foreground text-xs">
//                           No image
//                         </span>
//                       )}
//                     </td>
//                   </tr>

//                   <tr>
//                     <td className="py-1 px-2 border w-1/2 whitespace-normal break-words">
//                       Card No
//                     </td>
//                     <td className="py-1 px-2 border w-1/2 whitespace-normal break-words">
//                       {data.cardNo ?? "N/A"}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td className="py-1 px-2 border w-1/2 whitespace-normal break-words">
//                       Sales Person
//                     </td>
//                     <td className="py-1 px-2 border w-1/2 whitespace-normal break-words">
//                       {data.salesPerson ?? "N/A"}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td className="py-1 px-2 border w-1/2 whitespace-normal break-words">
//                       Date
//                     </td>
//                     <td className="py-1 px-2 border w-1/2 whitespace-normal break-words">
//                       {data.date
//                         ? new Date(data.date).toLocaleDateString()
//                         : "N/A"}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td className="py-1 px-2 border w-1/2 whitespace-normal break-words">
//                       User
//                     </td>
//                     <td className="py-1 px-2 border w-1/2 whitespace-normal break-words">
//                       {data.user?.email || "N/A"}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td className="py-1 px-2 border w-1/2 whitespace-normal break-words">
//                       Company
//                     </td>
//                     <td className="py-1 px-2 border w-1/2 whitespace-normal break-words">
//                       <div className="font-medium">
//                         {mergedData?.companyName || "N/A"}
//                       </div>
//                       <div className="text-[10px] text-muted-foreground">
//                         {mergedData?.name || "No contact"}
//                       </div>
//                     </td>
//                   </tr>
//                   <tr>
//                     <td className="py-1 px-2 border w-1/2 whitespace-normal break-words">
//                       Contact Info
//                     </td>
//                     <td className="py-1 px-2 border w-1/2 whitespace-normal break-words">
//                       {mergedData?.email && <div>{mergedData.email}</div>}
//                       {mergedData?.contactNumbers && (
//                         <div className="text-[10px] text-muted-foreground">
//                           {mergedData.contactNumbers.split(",")[0]}
//                         </div>
//                       )}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td className="py-1 px-2 border w-1/2 whitespace-normal break-words">
//                       Lead Status
//                     </td>
//                     <td className="py-1 px-2 border w-1/2 whitespace-normal break-words">
//                       {data.leadStatus ?? "N/A"}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td className="py-1 px-2 border w-1/2 whitespace-normal break-words">
//                       Deal Status
//                     </td>
//                     <td className="py-1 px-2 border w-1/2 whitespace-normal break-words">
//                       {data.dealStatus ?? "N/A"}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td className="py-1 px-2 border w-1/2 whitespace-normal break-words">
//                       Meeting
//                     </td>
//                     <td className="py-1 px-2 border w-1/2 whitespace-normal break-words">
//                       {data.meetingAfterExhibition ? "Yes" : "No"}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td className="py-1 px-2 border w-1/2 whitespace-normal break-words">
//                       Form Status
//                     </td>
//                     <td className="py-1 px-2 border w-1/2 whitespace-normal break-words">
//                       {data.status ?? "N/A"}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td className="py-1 px-2 border w-1/2 whitespace-normal break-words">
//                       Extraction Status
//                     </td>
//                     <td className="py-1 px-2 border w-1/2 whitespace-normal break-words">
//                       {data.extractionStatus ?? "N/A"}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td className="py-1 px-2 border w-1/2 whitespace-normal break-words">
//                       Zoho Status
//                     </td>
//                     <td className="py-1 px-2 border w-1/2 whitespace-normal break-words">
//                       {data.zohoStatus ?? "N/A"}
//                     </td>
//                   </tr>
//                 </tbody>
//               </table>
//             </ScrollArea>
//           )}
//         </CardContent>
//       </Card>
//     );
//   };

//   const selectedViewForm = openView
//     ? forms.find((f) => f.id === openView)
//     : null;
//   const selectedEditForm = openEdit
//     ? forms.find((f) => f.id === openEdit)
//     : null;

//   return (
//     <div className="space-y-4 px-2 sm:px-4">
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <Input
//           placeholder="Search forms..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="w-full sm:w-64"
//         />
//         <div className="flex items-center gap-2">
//           <Select value={selectedUser} onValueChange={setSelectedUser}>
//             <SelectTrigger className="w-full sm:w-[200px]">
//               <SelectValue placeholder="Filter by user" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="all">All Users</SelectItem>
//               {users.map((u) => (
//                 <SelectItem key={u.id} value={u.id}>
//                   {u.email}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>

//           {/* REPLACED: Download Excel Button */}
//           <Button
//             onClick={handleDownloadExcel}
//             disabled={isDownloading || filteredForms.length === 0}
//             className="bg-[#483d73] hover:bg-[#31294e] text-white"
//           >
//             {isDownloading ? (
//               <>
//                 <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                 Exporting...
//               </>
//             ) : (
//               <>
//                 <Download className="h-4 w-4 mr-2" />
//                 Download Excel ({filteredForms.length})
//               </>
//             )}
//           </Button>
//         </div>
//       </div>

//       <Card>
//         <CardContent className="p-0 mt-8">
//           <div className="w-full h-[30rem] flex flex-col">
//             <div className="w-full overflow-auto">
//               <table className="w-full text-sm border-collapse table-fixed min-w-[1350px]">
//                 <thead className="sticky top-0 z-10">
//                   <tr>
//                     {/* FIRST COLUMN: Card Image */}
//                     <th className="bg-gray-100 py-2 px-2 border w-24">
//                       Card Image
//                     </th>
//                     <th className="bg-gray-100 py-2 px-2 border w-24">
//                       Card No
//                     </th>
//                     <th className="bg-gray-100 py-2 px-2 border w-28">
//                       Sales Person
//                     </th>
//                     <th className="bg-gray-100 py-2 px-2 border w-24">Date</th>
//                     <th className="bg-gray-100 py-2 px-2 border w-40">User</th>
//                     <th className="bg-gray-100 py-2 px-2 border w-32">
//                       Company
//                     </th>
//                     <th className="bg-gray-100 py-2 px-2 border w-32">
//                       Contact Info
//                     </th>
//                     <th className="bg-gray-100 py-2 px-2 border w-24">
//                       Lead Status
//                     </th>
//                     <th className="bg-gray-100 py-2 px-2 border w-24">
//                       Deal Status
//                     </th>
//                     <th className="bg-gray-100 py-2 px-2 border w-20">
//                       Meeting
//                     </th>
//                     <th className="bg-gray-100 py-2 px-2 border w-24">
//                       Form Status
//                     </th>
//                     <th className="bg-gray-100 py-2 px-2 border w-32">
//                       Extraction Status
//                     </th>
//                     <th className="bg-gray-100 py-2 px-2 border w-24">
//                       Zoho Status
//                     </th>
//                     <th className="bg-gray-100 py-2 px-2 border w-24">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {currentItems.length > 0 ? (
//                     currentItems
//                       .filter((form) => form.id) // Filter out forms without id
//                       .map((form) => {
//                         const mergedData = form.mergedData;
//                         return (
//                           <tr
//                             key={form.id!}
//                             className="text-xs hover:bg-gray-50"
//                           >
//                             {/* FIRST: Card Image */}
//                             <td className="py-1 px-2 border">
//                               {form.cardFrontPhoto ? (
//                                 <button
//                                   onClick={() =>
//                                     setZoomedImage(form.cardFrontPhoto!)
//                                   }
//                                   className="group"
//                                 >
//                                   <img
//                                     src={form.cardFrontPhoto}
//                                     alt="Card"
//                                     className="max-w-20 h-12 object-cover rounded border transition group-hover:opacity-80"
//                                   />
//                                 </button>
//                               ) : (
//                                 <span className="text-[10px] text-muted-foreground">
//                                   —
//                                 </span>
//                               )}
//                             </td>
//                             <td className="py-1 px-2 border truncate">
//                               {form.cardNo ?? "N/A"}
//                             </td>
//                             <td className="py-1 px-2 border truncate">
//                               {form.salesPerson ?? "N/A"}
//                             </td>
//                             <td className="py-1 px-2 border truncate">
//                               {form.date
//                                 ? new Date(form.date).toLocaleDateString()
//                                 : "N/A"}
//                             </td>
//                             <td className="py-1 px-2 border truncate">
//                               {form.user?.email || "N/A"}
//                             </td>
//                             <td className="py-1 px-2 border">
//                               <div className="truncate font-medium">
//                                 {mergedData?.companyName || "N/A"}
//                               </div>
//                               <div className="text-[10px] text-muted-foreground truncate">
//                                 {mergedData?.name || "No contact"}
//                               </div>
//                             </td>
//                             <td className="py-1 px-2 border">
//                               {mergedData?.email && (
//                                 <div className="truncate">
//                                   {mergedData.email}
//                                 </div>
//                               )}
//                               {mergedData?.contactNumbers && (
//                                 <div className="text-[10px] text-muted-foreground truncate">
//                                   {mergedData.contactNumbers.split(",")[0]}
//                                 </div>
//                               )}
//                             </td>
//                             <td className="py-1 px-2 border truncate">
//                               {form.leadStatus ?? "N/A"}
//                             </td>
//                             <td className="py-1 px-2 border truncate">
//                               {form.dealStatus ?? "N/A"}
//                             </td>
//                             <td className="py-1 px-2 border truncate">
//                               {form.meetingAfterExhibition ? "Yes" : "No"}
//                             </td>
//                             <td className="py-1 px-2 border truncate">
//                               {form.status ?? "N/A"}
//                             </td>
//                             <td className="py-1 px-2 border truncate">
//                               {form.extractionStatus ?? "N/A"}
//                             </td>
//                             <td className="py-1 px-2 border truncate">
//                               {form.zohoStatus ?? "N/A"}
//                             </td>
//                             <td className="py-1 px-2 border">
//                               <DropdownMenu>
//                                 <DropdownMenuTrigger asChild>
//                                   <Button
//                                     variant="ghost"
//                                     size="icon"
//                                     className="h-6 w-6 text-[10px]"
//                                   >
//                                     <span className="sr-only">Open menu</span>
//                                     <MoreHorizontal className="h-3 w-3" />
//                                   </Button>
//                                 </DropdownMenuTrigger>
//                                 <DropdownMenuContent align="end">
//                                   <DropdownMenuItem
//                                     onClick={() => setOpenView(form.id!)}
//                                   >
//                                     <Eye className="mr-2 h-3 w-3" /> View
//                                   </DropdownMenuItem>
//                                   <DropdownMenuItem
//                                     onClick={() => setOpenEdit(form.id!)}
//                                   >
//                                     <Edit className="mr-2 h-3 w-3" /> Edit
//                                   </DropdownMenuItem>
//                                   <DropdownMenuItem
//                                     onClick={() => handleDelete(form.id!)}
//                                     className="focus:bg-destructive focus:text-destructive-foreground"
//                                   >
//                                     <Trash className="mr-2 h-3 w-3" /> Delete
//                                   </DropdownMenuItem>
//                                 </DropdownMenuContent>
//                               </DropdownMenu>
//                             </td>
//                           </tr>
//                         );
//                       })
//                   ) : (
//                     <tr>
//                       <td colSpan={14} className="py-4 text-center border">
//                         {isLoading ? "Loading..." : "No forms found"}
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>

//             {/* Pagination */}
//             <div className="flex justify-between items-center mt-2">
//               <div className="flex gap-2 items-center">
//                 <Button
//                   className="bg-[#483d73] hover:bg-[#31294e]"
//                   onClick={() => handlePageChange(currentPage - 1)}
//                   disabled={currentPage === 1}
//                 >
//                   Prev
//                 </Button>
//                 <span>
//                   Page {currentPage} of {totalPages}
//                 </span>
//                 <Button
//                   className="bg-[#483d73] hover:bg-[#31294e]"
//                   onClick={() => handlePageChange(currentPage + 1)}
//                   disabled={currentPage === totalPages}
//                 >
//                   Next
//                 </Button>
//               </div>
//               <Select
//                 value={String(itemsPerPage)}
//                 onValueChange={handleItemsPerPageChange}
//               >
//                 <SelectTrigger className="w-[80px]">
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {[5, 10, 20, 50].map((num) => (
//                     <SelectItem key={num} value={String(num)}>
//                       {num}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* View Dialog */}
//       {selectedViewForm && selectedViewForm.id && (
//         <Dialog open={true} onOpenChange={() => setOpenView(null)}>
//           <DialogContent className="max-w-4xl h-[90vh] overflow-hidden flex flex-col">
//             <DialogHeader>
//               <DialogTitle>
//                 Business Card - {selectedViewForm.cardNo || "N/A"}
//               </DialogTitle>
//             </DialogHeader>
//             <div className="flex-grow overflow-y-auto">
//               <Tabs defaultValue="merged" className="w-full">
//                 <TabsList className="grid w-full grid-cols-4 sticky top-0 bg-background z-10">
//                   <TabsTrigger value="merged">Merged Data</TabsTrigger>
//                   <TabsTrigger value="extracted">Extracted Data</TabsTrigger>
//                   <TabsTrigger value="form">Form Data</TabsTrigger>
//                   <TabsTrigger value="images">Card Image</TabsTrigger>
//                 </TabsList>
//                 <ScrollArea className="h-[calc(90vh-120px)]">
//                   <TabsContent value="merged">
//                     {(() => {
//                       const merged = {
//                         ...selectedViewForm,
//                         ...(selectedViewForm.extractedData || {}),
//                         description:
//                           (selectedViewForm.description || "") +
//                           "\nImg Desc: " +
//                           (selectedViewForm.extractedData?.description || ""),
//                       };
//                       return <MergedDataView data={merged} />;
//                     })()}
//                   </TabsContent>
//                   <TabsContent value="extracted">
//                     <Card>
//                       <CardHeader>
//                         <CardTitle>Extracted Information</CardTitle>
//                       </CardHeader>
//                       <CardContent>
//                         <ExtractedDataForm
//                           form={selectedViewForm}
//                           closeDialog={() => setOpenView(null)}
//                         />
//                       </CardContent>
//                     </Card>
//                   </TabsContent>
//                   <TabsContent value="form">
//                     <FormDataView data={selectedViewForm} />
//                   </TabsContent>
//                   <TabsContent value="images">
//                     <Card>
//                       <CardHeader>
//                         <CardTitle>Card Image</CardTitle>
//                       </CardHeader>
//                       <CardContent>
//                         <ScrollArea className="h-[calc(90vh-200px)]">
//                           <div className="space-y-6">
//                             <div>
//                               <h4 className="text-sm font-medium mb-3">
//                                 Front Side
//                               </h4>
//                               {selectedViewForm.cardFrontPhoto ? (
//                                 <button
//                                   onClick={() =>
//                                     setZoomedImage(
//                                       selectedViewForm.cardFrontPhoto!
//                                     )
//                                   }
//                                   className="block w-full"
//                                 >
//                                   <img
//                                     src={selectedViewForm.cardFrontPhoto}
//                                     alt="Card Front"
//                                     className="max-w-full max-h-96 object-contain rounded-md border hover:opacity-90 transition"
//                                   />
//                                 </button>
//                               ) : (
//                                 <div className="text-sm text-muted-foreground">
//                                   No front image available
//                                 </div>
//                               )}
//                             </div>
//                             {selectedViewForm.cardBackPhoto && (
//                               <div>
//                                 <h4 className="text-sm font-medium mb-3">
//                                   Back Side
//                                 </h4>
//                                 <button
//                                   onClick={() =>
//                                     setZoomedImage(
//                                       selectedViewForm.cardBackPhoto!
//                                     )
//                                   }
//                                   className="block w-full"
//                                 >
//                                   <img
//                                     src={selectedViewForm.cardBackPhoto}
//                                     alt="Card Back"
//                                     className="max-w-full max-h-96 object-contain rounded-md border hover:opacity-90 transition"
//                                   />
//                                 </button>
//                               </div>
//                             )}
//                           </div>
//                         </ScrollArea>
//                       </CardContent>
//                     </Card>
//                   </TabsContent>
//                 </ScrollArea>
//               </Tabs>
//             </div>
//           </DialogContent>
//         </Dialog>
//       )}

//       {/* Edit Dialog */}
//       {selectedEditForm && selectedEditForm.id && (
//         <Dialog open={true} onOpenChange={() => setOpenEdit(null)}>
//           <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
//             <DialogHeader>
//               <DialogTitle>
//                 Edit Form - {selectedEditForm.cardNo || "N/A"}
//               </DialogTitle>
//             </DialogHeader>
//             <ExhibitionForm
//               initialData={{
//                 cardNo: selectedEditForm.cardNo || "",
//                 salesPerson: selectedEditForm.salesPerson || "",
//                 date: selectedEditForm.date
//                   ? new Date(selectedEditForm.date).toISOString().split("T")[0]
//                   : "",
//                 country: selectedEditForm.country || "",
//                 cardFrontPhoto: selectedEditForm.cardFrontPhoto || "",
//                 cardBackPhoto: selectedEditForm.cardBackPhoto || "",
//                 leadStatus: selectedEditForm.leadStatus || "",
//                 dealStatus: selectedEditForm.dealStatus || "",
//                 meetingAfterExhibition:
//                   selectedEditForm.meetingAfterExhibition || false,

//                 description: selectedEditForm.description || "",
//               }}
//               onSubmit={(updatedData) =>
//                 handleUpdate(updatedData, selectedEditForm.id!, () => {
//                   setOpenEdit(null);
//                 })
//               }
//               isEdit={true}
//               formId={selectedEditForm.id!}
//               disabledFields={["cardNo", "date"]}
//             />
//           </DialogContent>
//         </Dialog>
//       )}

//       {/* Zoom Modal */}
//       {zoomedImage && (
//         <Dialog open={true} onOpenChange={() => setZoomedImage(null)}>
//           <DialogContent className="max-w-3xl p-0 overflow-hidden">
//             <img
//               src={zoomedImage}
//               alt="Zoomed Card"
//               className="w-full h-auto max-h-[80vh] object-contain"
//             />
//           </DialogContent>
//         </Dialog>
//       )}
//     </div>
//   );
// }

// export default AdminDashboard;

// "use client";

// import { useState, useEffect, useCallback, useRef, useMemo } from "react";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Label } from "@/components/ui/label";
// import {
//   Eye,
//   Trash,
//   MoreHorizontal,
//   Edit,
//   ZoomIn,
//   Download,
//   Loader2,
// } from "lucide-react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { useToast } from "@/components/ui/use-toast";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import * as XLSX from "xlsx";
// import type { FormData } from "@/types/form";
// import { ExhibitionForm } from "@/components/exhibition-form";
// import { DashboardOverview } from "@/components/admin/dashboard-overview";

// export function AdminDashboardEnhanced() {
//   const [forms, setForms] = useState<FormData[]>([]);
//   const [users, setUsers] = useState<{ id: string; email: string }[]>([]);
//   const [search, setSearch] = useState("");
//   const [selectedUser, setSelectedUser] = useState<string>("all");
//   const [isLoading, setIsLoading] = useState(false);
//   const [isDownloading, setIsDownloading] = useState(false);
//   const { toast } = useToast();
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(10);
//   const [openView, setOpenView] = useState<string | null>(null);
//   const [openEdit, setOpenEdit] = useState<string | null>(null);
//   const [zoomedImage, setZoomedImage] = useState<string | null>(null);
//   const [showManage, setShowManage] = useState(false);
// const [visibleColumns, setVisibleColumns] = useState<string[]>([
//   "cardImage",
//   "cardNo",
//   "date",
//   "user",
//   "personName",
//   "company",
//   "city",
//   "state",
//   "country",
//   "leadStatus",
//   "meeting",
// ]);

//   const possibleColumns = useMemo(() => {
//     const fixedColumns = [
//       {
//         id: "cardImage",
//         label: "Card Image",
//         width: "w-24",
//         render: (form: FormData) =>
//           form.cardFrontPhoto ? (
//             <button
//               onClick={() => setZoomedImage(form.cardFrontPhoto!)}
//               className="group"
//             >
//               <img
//                 src={form.cardFrontPhoto || "/placeholder.svg"}
//                 alt="Card"
//                 className="max-w-20 h-12 object-cover rounded border transition group-hover:opacity-80"
//               />
//             </button>
//           ) : (
//             <span className="text-[10px] text-muted-foreground">—</span>
//           ),
//       },
//       {
//         id: "cardNo",
//         label: "Card No",
//         width: "w-24",
//         render: (form: FormData) => form.cardNo ?? "N/A",
//       },
//       {
//         id: "salesPerson",
//         label: "Sales Person",
//         width: "w-28",
//         render: (form: FormData) => form.salesPerson ?? "N/A",
//       },
//       {
//         id: "date",
//         label: "Date",
//         width: "w-24",
//         render: (form: FormData) =>
//           form.date ? new Date(form.date).toLocaleDateString() : "N/A",
//       },
//       {
//         id: "user",
//         label: "User",
//         width: "w-40",
//         render: (form: FormData) => form.user?.email || "N/A",
//       },
//       {
//         id: "personName",
//         label: "Person Name",
//         width: "w-32",
//         render: (form: FormData) =>
//           form.mergedData?.name || form.additionalData?.contactPerson || "N/A",
//       },
//       {
//         id: "company",
//         label: "Company Name",
//         width: "w-32",
//         render: (form: FormData) =>
//           form.mergedData?.companyName || form.additionalData?.company || "N/A",
//       },
//       {
//   id: "city",
//   label: "City",
//   width: "w-28",
//   render: (form: FormData) => form.extractedData?.city || "N/A",
// },
//       {
//         id: "state",
//         label: "State",
//         width: "w-24",
//         render: (form: FormData) =>
//           form.extractedData?.state || form.additionalData?.city || "N/A",
//       },
//       {
//         id: "country",
//         label: "Country",
//         width: "w-24",
//         render: (form: FormData) =>
//           form.extractedData?.country || form.country || "N/A",
//       },
//       {
//         id: "contactInfo",
//         label: "Contact Info",
//         width: "w-32",
//         render: (form: FormData) => {
//           const merged = form.mergedData;
//           return (
//             <>
//               {merged?.email && <div className="truncate">{merged.email}</div>}
//               {merged?.contactNumbers && (
//                 <div className="text-[10px] text-muted-foreground truncate">
//                   {merged.contactNumbers.split(",")[0]}
//                 </div>
//               )}
//             </>
//           );
//         },
//       },
//       {
//         id: "leadStatus",
//         label: "Lead Status",
//         width: "w-24",
//         render: (form: FormData) => form.leadStatus ?? "N/A",
//       },
//       {
//         id: "dealStatus",
//         label: "Deal Status",
//         width: "w-24",
//         render: (form: FormData) => form.dealStatus ?? "N/A",
//       },
//       {
//         id: "meeting",
//         label: "Meeting",
//         width: "w-20",
//         render: (form: FormData) =>
//           form.meetingAfterExhibition ? "Yes" : "No",
//       },
//       {
//         id: "formStatus",
//         label: "Form Status",
//         width: "w-24",
//         render: (form: FormData) => form.status ?? "N/A",
//       },
//       {
//         id: "extractionStatus",
//         label: "Extraction Status",
//         width: "w-32",
//         render: (form: FormData) => form.extractionStatus ?? "N/A",
//       },
//       {
//         id: "zohoStatus",
//         label: "Zoho Status",
//         width: "w-24",
//         render: (form: FormData) => form.zohoStatus ?? "N/A",
//       },
//       {
//         id: "actions",
//         label: "Actions",
//         width: "w-24",
//         render: (form: FormData) => (
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 className="h-6 w-6 text-[10px]"
//               >
//                 <span className="sr-only">Open menu</span>
//                 <MoreHorizontal className="h-3 w-3" />
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end">
//               <DropdownMenuItem onClick={() => setOpenView(form.id!)}>
//                 <Eye className="mr-2 h-3 w-3" /> View
//               </DropdownMenuItem>
//               <DropdownMenuItem onClick={() => setOpenEdit(form.id!)}>
//                 <Edit className="mr-2 h-3 w-3" /> Edit
//               </DropdownMenuItem>
//               <DropdownMenuItem
//                 onClick={() => handleDelete(form.id!)}
//                 className="focus:bg-destructive focus:text-destructive-foreground"
//               >
//                 <Trash className="mr-2 h-3 w-3" /> Delete
//               </DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         ),
//       },
//     ];

// // Dynamic additionalData columns
//   const allAdditionalKeys = forms.flatMap((f) =>
//     Object.keys(f.additionalData || {})
//   );
//   const uniqueAdditional = [...new Set(allAdditionalKeys)].slice(0, 10);
//   const additionalColumns = uniqueAdditional.map((key) => ({
//     id: `add_${key}`,
//     label: key.replace(/_/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase()),
//     width: "w-32",
//     render: (form: FormData) => form.additionalData?.[key] || "N/A",
//   }));

//   // FIXED: Dynamic extractedData columns — ONLY block exact matches
//   const allExtractedKeys = forms.flatMap((f) =>
//     Object.keys(f.extractedData || {})
//   );
//   const blockedKeys = ["companyName", "name", "email", "contactNumbers", "city" , "state", "country","website", "address"];
//   const uniqueExtracted = [...new Set(allExtractedKeys)]
//     .filter((key) => !blockedKeys.includes(key))  // ← Only block exact keys
//     .slice(0, 15);

//   const extractedColumns = uniqueExtracted.map((key) => ({
//     id: `ext_${key}`,
//     label: key.replace(/_/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase()),
//     width: "w-36",
//     render: (form: FormData) => form.extractedData?.[key] || "—",
//   }));

//   return [...fixedColumns, ...additionalColumns, ...extractedColumns];
// }, [forms]);

//   const displayColumns = useMemo(
//     () => [...visibleColumns, "actions"],
//     [visibleColumns]
//   );

//   const fetchForms = useCallback(async () => {
//     try {
//       setIsLoading(true);
//       const res = await fetch("/api/forms", {
//         method: "GET",
//         headers: { "Cache-Control": "no-cache" },
//       });
//       if (!res.ok) {
//         const errorData = await res.json().catch(() => ({}));
//         if (errorData.limitReached) {
//           toast({
//             title: "Limit Reached",
//             description:
//               errorData.message ||
//               "Form submission limit reached. Please upgrade your plan.",
//             variant: "destructive",
//           });
//           setForms([]);
//           extractUniqueUsers([]);
//           return;
//         }
//         throw new Error(`Failed to fetch forms: ${res.status}`);
//       }
//       const data = await res.json();
//       const fetchedForms = data.forms || data || [];
//       setForms(fetchedForms);
//       extractUniqueUsers(fetchedForms);
//     } catch (error) {
//       console.error("Error fetching forms:", error);
//       toast({
//         title: "Error",
//         description: "Failed to fetch forms.",
//         variant: "destructive",
//       });
//       setForms([]);
//       extractUniqueUsers([]);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [toast]);

//   useEffect(() => {
//     fetchForms();
//   }, [fetchForms]);

//   useEffect(() => {
//     setCurrentPage(1);
//   }, [search, selectedUser]);

//   const extractUniqueUsers = (data: FormData[] = forms) => {
//     if (!data || data.length === 0) return setUsers([]);
//     const usersMap = new Map<string, { id: string; email: string }>();
//     data.forEach((form) => {
//       if (form.userId)
//         usersMap.set(form.userId, {
//           id: form.userId,
//           email: form.user?.email || "Unknown",
//         });
//     });
//     setUsers(Array.from(usersMap.values()));
//   };

//   const handleDownloadExcel = async () => {
//     try {
//       setIsDownloading(true);

//       const filteredData = forms.filter((form) => {
//         if (selectedUser !== "all" && form.userId !== selectedUser)
//           return false;
//         const q = search.toLowerCase();
//         return (
//           (form.cardNo || "").toLowerCase().includes(q) ||
//           (form.country || "").toLowerCase().includes(q) ||
//           (form.salesPerson || "").toLowerCase().includes(q) ||
//           ((form.mergedData?.companyName || "") as string)
//             .toLowerCase()
//             .includes(q) ||
//           ((form.mergedData?.name || "") as string).toLowerCase().includes(q) ||
//           ((form.mergedData?.email || "") as string)
//             .toLowerCase()
//             .includes(q) ||
//           ((form.mergedData?.contactNumbers || "") as string)
//             .toLowerCase()
//             .includes(q) ||
//           ((form.user?.email || "") as string).toLowerCase().includes(q)
//         );
//       });

//       if (filteredData.length === 0) {
//         toast({
//           title: "No Data",
//           description: "No data available to export.",
//           variant: "default",
//         });
//         return;
//       }

//       const excelData = filteredData.map((form) => ({
//         "Card Image": form.cardFrontPhoto || "",
//         "Card No": form.cardNo || "",
//         "Sales Person": form.salesPerson || "",
//         Date: form.date ? new Date(form.date).toLocaleDateString() : "",
//         "User Email": form.user?.email || "",
//         "Company Name": form.extractedData?.companyName || "",
//         "Contact Name": form.mergedData?.name || "",
//         "Contact Email": form.extractedData?.email || "",
//         "Contact Numbers": form.extractedData?.contactNumbers || "",
//         Country: form.country || "",
//         "Lead Status": form.leadStatus || "",
//         "Deal Status": form.dealStatus || "",
//         "Meeting After Exhibition": form.meetingAfterExhibition ? "Yes" : "No",
//         "Form Status": form.status || "",
//         "Extraction Status": form.extractionStatus || "",
//         "Zoho Status": form.zohoStatus || "",
//         "Industry Categories": Array.isArray(form.industryCategories)
//           ? form.industryCategories.join(", ")
//           : form.industryCategories || "",
//         Description: form.description || "",
//         "Created At": form.createdAt
//           ? new Date(form.createdAt).toLocaleString()
//           : "",
//         "Updated At": form.updatedAt
//           ? new Date(form.updatedAt).toLocaleString()
//           : "",
//         "Form ID": form.id || "",
//         "User ID": form.userId || "",
//         "Card Back Image": form.cardBackPhoto || "",
//         ...form.additionalData,
//       }));

//       const workbook = XLSX.utils.book_new();
//       const worksheet = XLSX.utils.json_to_sheet(excelData);

//       const colWidths = [
//         { wch: 15 },
//         { wch: 12 },
//         { wch: 15 },
//         { wch: 12 },
//         { wch: 25 },
//         { wch: 25 },
//         { wch: 20 },
//         { wch: 25 },
//         { wch: 20 },
//         { wch: 12 },
//         { wch: 12 },
//         { wch: 12 },
//         { wch: 22 },
//         { wch: 12 },
//         { wch: 18 },
//         { wch: 12 },
//         { wch: 20 },
//         { wch: 30 },
//         { wch: 18 },
//         { wch: 18 },
//         { wch: 20 },
//         { wch: 20 },
//         { wch: 15 },
//       ];
//       worksheet["!cols"] = colWidths;

//       XLSX.utils.book_append_sheet(workbook, worksheet, "Business Cards");

//       const timestamp = new Date()
//         .toISOString()
//         .slice(0, 19)
//         .replace(/:/g, "-");
//       const filename = `Business_Cards_${timestamp}.xlsx`;

//       XLSX.writeFile(workbook, filename);

//       toast({
//         title: "Download Complete",
//         description: `${filteredData.length} records exported to Excel successfully!`,
//       });
//     } catch (error) {
//       console.error("Error downloading Excel:", error);
//       toast({
//         title: "Export Failed",
//         description: "Failed to download Excel file.",
//         variant: "destructive",
//       });
//     } finally {
//       setIsDownloading(false);
//     }
//   };

//   const handleDelete = async (id?: string) => {
//     if (!id) {
//       return toast({
//         title: "Unable to delete",
//         description: "Form id is missing.",
//         variant: "destructive",
//       });
//     }
//     if (
//       !confirm(
//         "Are you sure you want to delete this record? This action cannot be undone."
//       )
//     )
//       return;
//     try {
//       setIsLoading(true);
//       const res = await fetch(`/api/forms/${id}`, { 
// });
//       if (!res.ok) {
//         const errorData = await res.text();
//         throw new Error(
//           `Failed to delete form: ${res.status} ${
//             errorData || "No response body"
//           }`
//         );
//       }
//       setForms((prev) => prev.filter((f) => f.id !== id));
//       toast({ title: "Deleted", description: "Form deleted successfully." });
//     } catch (err) {
//       console.error("Error deleting form:", err);
//       toast({
//         title: "Error",
//         description: "Failed to delete form.",
//         variant: "destructive",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const formatData = (data: any) => {
//     if (!data) return "No data available";
//     return Object.entries(data)
//       .map(([key, value]) => {
//         const formattedKey = key
//           .replace(/_/g, " ")
//           .replace(/\b\w/g, (l) => l.toUpperCase());
//         if (Array.isArray(value))
//           return `${formattedKey}: ${value.join(", ") || "None"}`;
//         return `${formattedKey}: ${value ?? "None"}`;
//       })
//       .join("\n");
//   };

//   const handleUpdate = useCallback(
//     async (updatedData: any, formId: string, closeDialog: () => void) => {
//       const coreFields = [
//         "cardNo",
//         "salesPerson",
//         "date",
//         "country",
//         "cardFrontPhoto",
//         "cardBackPhoto",
//         "leadStatus",
//         "dealStatus",
//         "meetingAfterExhibition",
//         "description",
//         "extractionStatus",
//       ];

//       const submissionData = {
//         ...updatedData,
//         date: updatedData.date
//           ? new Date(updatedData.date).toISOString()
//           : undefined,
//         additionalData: Object.fromEntries(
//           Object.entries(updatedData).filter(
//             ([key]) => !coreFields.includes(key)
//           )
//         ),
//       };

//       try {
//         const res = await fetch(`/api/forms/${encodeURIComponent(formId)}`, {
//           method: "PATCH",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(submissionData),
//         });

//         if (!res.ok) {
//           const text = await res.text();
//           throw new Error(
//             `Failed to update form: ${res.status} ${text || "No response body"}`
//           );
//         }

//         setForms((prev) =>
//           prev.map((f) =>
//             f.id === formId
//               ? {
//                   ...f,
//                   ...submissionData,
//                   additionalData: submissionData.additionalData,
//                 }
//               : f
//           )
//         );

//         toast({
//           title: "Form Updated",
//           description: "Changes saved successfully!",
//         });
//         closeDialog();
//         fetchForms();
//       } catch (err) {
//         console.error("Error updating form:", err);
//         toast({
//           title: "Error updating form",
//           description:
//             err instanceof Error ? err.message : "Failed to update form.",
//           variant: "destructive",
//         });
//       }
//     },
//     [toast, fetchForms]
//   );

//   const handleExtractedDataUpdate = useCallback(
//     async (updatedData: any, formId: string, closeDialog: () => void) => {
//       try {
//         const res = await fetch(`/api/forms/${encodeURIComponent(formId)}`, {
//           method: "PATCH",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ extractedData: updatedData }),
//         });

//         if (!res.ok) {
//           const text = await res.text();
//           throw new Error(
//             `Failed to update extracted data: ${res.status} ${
//               text || "No response body"
//             }`
//           );
//         }

//         // FIXED: Immediately update local state with the new extractedData
//         setForms((prev) =>
//           prev.map((f) =>
//             f.id === formId ? { ...f, extractedData: updatedData } : f
//           )
//         );

//         toast({
//           title: "Extracted Data Updated",
//           description: "Changes saved successfully!",
//         });
//         closeDialog();

//         // FIXED: Refetch to ensure consistency, but local update ensures immediate UI refresh
//         setTimeout(() => fetchForms(), 500); // Small delay to avoid race condition
//       } catch (err) {
//         console.error("Error updating extracted data:", err);
//         toast({
//           title: "Error updating extracted data",
//           description:
//             err instanceof Error
//               ? err.message
//               : "Failed to update extracted data.",
//           variant: "destructive",
//         });
//       }
//     },
//     [toast, fetchForms]
//   );

//   const filteredForms = useMemo(
//     () =>
//       forms.filter((form) => {
//         if (selectedUser !== "all" && form.userId !== selectedUser)
//           return false;
//         const q = search.toLowerCase();
//         return (
//           (form.cardNo || "").toLowerCase().includes(q) ||
//           (form.country || "").toLowerCase().includes(q) ||
//           (form.salesPerson || "").toLowerCase().includes(q) ||
//           ((form.mergedData?.companyName || "") as string)
//             .toLowerCase()
//             .includes(q) ||
//           ((form.mergedData?.name || "") as string).toLowerCase().includes(q) ||
//           ((form.mergedData?.email || "") as string)
//             .toLowerCase()
//             .includes(q) ||
//           ((form.mergedData?.contactNumbers || "") as string)
//             .toLowerCase()
//             .includes(q) ||
//           ((form.user?.email || "") as string).toLowerCase().includes(q)
//         );
//       }),
//     [forms, search, selectedUser]
//   );

//   const totalPages = Math.ceil(filteredForms.length / itemsPerPage);
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentItems = filteredForms.slice(indexOfFirstItem, indexOfLastItem);

//   const handlePageChange = (page: number) => {
//     if (page < 1 || page > totalPages) return;
//     setCurrentPage(page);
//   };
//   const handleItemsPerPageChange = (value: string) => {
//     setItemsPerPage(Number(value));
//     setCurrentPage(1);
//   };

//   const ExtractedDataForm = ({
//     form,
//     closeDialog,
//   }: {
//     form: FormData;
//     closeDialog: () => void;
//   }) => {
//     const initialData = useRef(form.extractedData || {});
//     const [formData, setFormData] = useState<Record<string, string>>(() => ({
//       ...(form.extractedData || {}),
//     }));
//     const disabledFields = ["id", "formId", "createdAt", "updatedAt", "status"];

//     const hasChanges = useMemo(
//       () => JSON.stringify(formData) !== JSON.stringify(initialData.current),
//       [formData]
//     );

//     const handleChange = (key: string, value: string) => {
//       setFormData((prev) => ({ ...prev, [key]: value }));
//     };

//     const handleSubmit = () => {
//       // FIXED: Simplify - use formData directly as it's the updated state
//       // No need to merge with original or override disabled (since disabled aren't changed)
//       const updatedData = { ...formData };

//       if (form.id) {
//         handleExtractedDataUpdate(updatedData, form.id, closeDialog);
//       }
//     };

//     return (
//       <div className="space-y-4">
//         {Object.entries(form.extractedData || {}).map(([key]) => (
//           <div key={key} className="flex flex-col gap-2">
//             <label className="text-sm font-medium">
//               {key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
//             </label>
//             <Input
//               value={formData[key] || ""}
//               onChange={(e) => handleChange(key, e.target.value)}
//               className="w-full"
//               disabled={disabledFields.includes(key)}
//             />
//           </div>
//         ))}
//         {Object.keys(form.extractedData || {}).length === 0 && (
//           <div className="text-sm text-muted-foreground">
//             No extracted data available
//           </div>
//         )}
//         <div className="flex justify-end gap-2">
//           <Button variant="outline" onClick={closeDialog}>
//             Cancel
//           </Button>
//           <Button
//             className="bg-[#62588b] hover:bg-[#31294e]"
//             onClick={handleSubmit}
//             disabled={
//               !hasChanges || Object.keys(form.extractedData || {}).length === 0
//             }
//           >
//             Save Changes
//           </Button>
//         </div>
//       </div>
//     );
//   };

//   const MergedDataView = ({ data }: { data: any }) => {
//     const [view, setView] = useState<"raw" | "table">("table");

//     return (
//       <Card>
//         <CardHeader>
//           <CardTitle>Merged Information</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="flex gap-2 mb-4">
//             <Button
//               className={
//                 view === "raw"
//                   ? "bg-[#62588b] hover:bg-[#31294e] text-white"
//                   : ""
//               }
//               variant={view === "raw" ? "default" : "outline"}
//               onClick={() => setView("raw")}
//             >
//               Raw Data
//             </Button>
//             <Button
//               className={
//                 view === "table"
//                   ? "bg-[#62588b] hover:bg-[#31294e] text-white"
//                   : ""
//               }
//               variant={view === "table" ? "default" : "outline"}
//               onClick={() => setView("table")}
//             >
//               Table Data
//             </Button>
//           </div>
//           {view === "raw" ? (
//             <ScrollArea className="h-[calc(90vh-200px)] bg-muted p-4 rounded-md">
//               <pre className="text-sm whitespace-pre-wrap">
//                 {formatData(data)}
//               </pre>
//             </ScrollArea>
//           ) : (
//             <ScrollArea className="h-[calc(90vh-200px)]">
//               <table className="w-full text-sm border-collapse">
//                 <thead>
//                   <tr>
//                     <th className="bg-gray-100 py-2 px-2 border text-left w-1/2">
//                       Field
//                     </th>
//                     <th className="bg-gray-100 py-2 px-2 border text-left w-1/2">
//                       Value
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {Object.entries(data).map(([key, value]) => (
//                     <tr key={key}>
//                       <td className="py-1 px-2 border w-1/2 whitespace-normal break-words ">
//                         {key
//                           .replace(/_/g, " ")
//                           .replace(/\b\w/g, (l) => l.toUpperCase())}
//                       </td>
//                       <td className="py-1 px-2 border w-1/2 whitespace-normal break-words">
//                         {typeof value === "object" && value !== null
//                           ? JSON.stringify(value, null, 2)
//                           : String(value ?? "N/A")}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </ScrollArea>
//           )}
//         </CardContent>
//       </Card>
//     );
//   };

//   const FormDataView = ({ data }: { data: FormData }) => {
//     const [view, setView] = useState<"raw" | "table">("table");
//     const mergedData = data.mergedData;

//     return (
//       <Card>
//         <CardHeader>
//           <CardTitle>Form Details</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="flex gap-2 mb-4">
//             <Button
//               className={
//                 view === "raw"
//                   ? "bg-[#62588b] hover:bg-[#31294e] text-white"
//                   : ""
//               }
//               variant={view === "raw" ? "default" : "outline"}
//               onClick={() => setView("raw")}
//             >
//               Raw Data
//             </Button>
//             <Button
//               className={
//                 view === "table"
//                   ? "bg-[#62588b] hover:bg-[#31294e] text-white"
//                   : ""
//               }
//               variant={view === "table" ? "default" : "outline"}
//               onClick={() => setView("table")}
//             >
//               Table Data
//             </Button>
//           </div>
//           {view === "raw" ? (
//             <ScrollArea className="h-[calc(90vh-200px)] bg-muted p-4 rounded-md">
//               <pre className="text-sm whitespace-pre-wrap">
//                 {formatData(data)}
//               </pre>
//             </ScrollArea>
//           ) : (
//             <ScrollArea className="h-[calc(90vh-200px)]">
//               <table className="w-full text-sm border-collapse">
//                 <thead>
//                   <tr>
//                     <th className="bg-gray-100 py-2 px-2 border text-left w-1/2">
//                       Field
//                     </th>
//                     <th className="bg-gray-100 py-2 px-2 border text-left w-1/2">
//                       Value
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   <tr>
//                     <td className="py-1 px-2 border w-1/2 whitespace-normal break-words font-medium">
//                       Card Image
//                     </td>
//                     <td className="py-1 px-2 border w-1/2">
//                       {data.cardFrontPhoto ? (
//                         <button
//                           onClick={() => setZoomedImage(data.cardFrontPhoto!)}
//                           className="group relative block"
//                         >
//                           <img
//                             src={data.cardFrontPhoto || "/placeholder.svg"}
//                             alt="Card"
//                             className="max-w-32 max-h-20 object-contain rounded border transition group-hover:opacity-80"
//                           />
//                           <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
//                             <ZoomIn className="h-5 w-5 text-white drop-shadow" />
//                           </div>
//                         </button>
//                       ) : (
//                         <span className="text-muted-foreground text-xs">
//                           No image
//                         </span>
//                       )}
//                     </td>
//                   </tr>

//                   <tr>
//                     <td className="py-1 px-2 border w-1/2 whitespace-normal break-words">
//                       Card No
//                     </td>
//                     <td className="py-1 px-2 border w-1/2 whitespace-normal break-words">
//                       {data.cardNo ?? "N/A"}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td className="py-1 px-2 border w-1/2 whitespace-normal break-words">
//                       Sales Person
//                     </td>
//                     <td className="py-1 px-2 border w-1/2 whitespace-normal break-words">
//                       {data.salesPerson ?? "N/A"}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td className="py-1 px-2 border w-1/2 whitespace-normal break-words">
//                       Date
//                     </td>
//                     <td className="py-1 px-2 border w-1/2 whitespace-normal break-words">
//                       {data.date
//                         ? new Date(data.date).toLocaleDateString()
//                         : "N/A"}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td className="py-1 px-2 border w-1/2 whitespace-normal break-words">
//                       User
//                     </td>
//                     <td className="py-1 px-2 border w-1/2 whitespace-normal break-words">
//                       {data.user?.email || "N/A"}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td className="py-1 px-2 border w-1/2 whitespace-normal break-words">
//                       Company
//                     </td>
//                     <td className="py-1 px-2 border w-1/2 whitespace-normal break-words">
//                       <div className="font-medium">
//                         {mergedData?.companyName || "N/A"}
//                       </div>
//                       <div className="text-[10px] text-muted-foreground">
//                         {mergedData?.name || "No contact"}
//                       </div>
//                     </td>
//                   </tr>
//                   <tr>
//                     <td className="py-1 px-2 border w-1/2 whitespace-normal break-words">
//                       Contact Info
//                     </td>
//                     <td className="py-1 px-2 border w-1/2 whitespace-normal break-words">
//                       {mergedData?.email && <div>{mergedData.email}</div>}
//                       {mergedData?.contactNumbers && (
//                         <div className="text-[10px] text-muted-foreground">
//                           {mergedData.contactNumbers.split(",")[0]}
//                         </div>
//                       )}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td className="py-1 px-2 border w-1/2 whitespace-normal break-words">
//                       Lead Status
//                     </td>
//                     <td className="py-1 px-2 border w-1/2 whitespace-normal break-words">
//                       {data.leadStatus ?? "N/A"}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td className="py-1 px-2 border w-1/2 whitespace-normal break-words">
//                       Deal Status
//                     </td>
//                     <td className="py-1 px-2 border w-1/2 whitespace-normal break-words">
//                       {data.dealStatus ?? "N/A"}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td className="py-1 px-2 border w-1/2 whitespace-normal break-words">
//                       Meeting
//                     </td>
//                     <td className="py-1 px-2 border w-1/2 whitespace-normal break-words">
//                       {data.meetingAfterExhibition ? "Yes" : "No"}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td className="py-1 px-2 border w-1/2 whitespace-normal break-words">
//                       Form Status
//                     </td>
//                     <td className="py-1 px-2 border w-1/2 whitespace-normal break-words">
//                       {data.status ?? "N/A"}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td className="py-1 px-2 border w-1/2 whitespace-normal break-words">
//                       Extraction Status
//                     </td>
//                     <td className="py-1 px-2 border w-1/2 whitespace-normal break-words">
//                       {data.extractionStatus ?? "N/A"}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td className="py-1 px-2 border w-1/2 whitespace-normal break-words">
//                       Zoho Status
//                     </td>
//                     <td className="py-1 px-2 border w-1/2 whitespace-normal break-words">
//                       {data.zohoStatus ?? "N/A"}
//                     </td>
//                   </tr>

//                   {/* Dynamic Fields */}
//                   {data.additionalData &&
//                     Object.keys(data.additionalData).length > 0 && (
//                       <>
//                         <tr>
//                           <td
//                             colSpan={2}
//                             className="py-2 px-2 border bg-gray-50 font-medium text-sm"
//                           >
//                             Custom Fields
//                           </td>
//                         </tr>
//                         {Object.entries(data.additionalData).map(
//                           ([key, value]) => (
//                             <tr key={key}>
//                               <td className="py-1 px-2 border w-1/2 whitespace-normal break-words">
//                                 {key
//                                   .replace(/_/g, " ")
//                                   .replace(/\b\w/g, (l) => l.toUpperCase())}
//                               </td>
//                               <td className="py-1 px-2 border w-1/2 whitespace-normal break-words">
//                                 {String(value ?? "N/A")}
//                               </td>
//                             </tr>
//                           )
//                         )}
//                       </>
//                     )}
//                 </tbody>
//               </table>
//             </ScrollArea>
//           )}
//         </CardContent>
//       </Card>
//     );
//   };

//   const selectedViewForm = openView
//     ? forms.find((f) => f.id === openView)
//     : null;
//   const selectedEditForm = openEdit
//     ? forms.find((f) => f.id === openEdit)
//     : null;

//   return (
//     <div className="space-y-6 px-2 sm:px-4 py-6">
//       <Tabs defaultValue="overview" className="w-full">
//         <TabsList className="grid w-full grid-cols-2">
//           <TabsTrigger value="overview">Dashboard Overview</TabsTrigger>
//           <TabsTrigger value="data">Card Data</TabsTrigger>
//         </TabsList>

//         <TabsContent value="overview" className="space-y-6">
//           <DashboardOverview forms={forms} />
//         </TabsContent>

//        <TabsContent value="data" className="space-y-4">

//   {/* ------------------- MOBILE VERSION ------------------- */}
//   <div className="sm:hidden flex flex-col gap-3">

//     {/* Row 1: Search + User Filter */}
//     <div className="flex w-full gap-2">
//       <Input
//         placeholder="Search forms..."
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//         className="flex-1 h-9 px-2 text-sm"
//       />

//       <Select value={selectedUser} onValueChange={setSelectedUser}>
//         <SelectTrigger className="h-9 px-2 text-sm w-32">
//           <SelectValue placeholder="Users" />
//         </SelectTrigger>
//         <SelectContent>
//           <SelectItem value="all">All Users</SelectItem>
//           {users.map((u) => (
//             <SelectItem key={u.id} value={u.id}>
//               {u.email}
//             </SelectItem>
//           ))}
//         </SelectContent>
//       </Select>
//     </div>

//     {/* Row 2: Excel + Manage Columns */}
//     <div className="flex w-full gap-2">
//       <Button
//         onClick={handleDownloadExcel}
//         disabled={isDownloading || filteredForms.length === 0}
//         className="flex-1 h-9 px-2 text-xs bg-[#483d73] hover:bg-[#352c55]"
//       >
//         {isDownloading ? (
//           <>
//             <Loader2 className="h-3 w-3 mr-1 animate-spin" />
//             Export
//           </>
//         ) : (
//           <>
//             <Download className="h-3.5 w-3.5 mr-1" />
//             Download Excel ({filteredForms.length})
//           </>
//         )}
//       </Button>

//       <Button
//         variant="outline"
//         onClick={() => setShowManage(true)}
//         className="flex-1 h-9 px-2 text-xs border-[#483d73] text-[#483d73] hover:bg-[#483d73]/10"
//       >
//         Manage Columns
//       </Button>
//     </div>
//   </div>

//   {/* ------------------- DESKTOP VERSION ------------------- */}
//   <div className="hidden sm:flex flex-row justify-between items-center gap-3">

//     {/* Search */}
//     <Input
//       placeholder="Search forms..."
//       value={search}
//       onChange={(e) => setSearch(e.target.value)}
//       className="w-64 h-9"
//     />

//     {/* Filter + Buttons */}
//     <div className="flex items-center gap-2">
//       <Select value={selectedUser} onValueChange={setSelectedUser}>
//         <SelectTrigger className="w-48 text-xs h-9">
//           <SelectValue placeholder="All Users" />
//         </SelectTrigger>
//         <SelectContent>
//           <SelectItem value="all">All Users</SelectItem>
//           {users.map((u) => (
//             <SelectItem key={u.id} value={u.id}>
//               {u.email}
//             </SelectItem>
//           ))}
//         </SelectContent>
//       </Select>

//       <Button
//         onClick={handleDownloadExcel}
//         disabled={isDownloading || filteredForms.length === 0}
//         size="sm"
//         className="h-9 px-3 text-xs bg-[#483d73] hover:bg-[#352c55]"
//       >
//         {isDownloading ? (
//           <>
//             <Loader2 className="h-3 w-3 mr-1 animate-spin" />
//             Exporting...
//           </>
//         ) : (
//           <>
//             <Download className="h-3.5 w-3.5 mr-1" />
//             Download Excel ({filteredForms.length})
//           </>
//         )}
//       </Button>

//       <Button
//         variant="outline"
//         onClick={() => setShowManage(true)}
//         className="bg-[#483d73] hover:bg-[#31294e] text-white hover:text-white h-9 px-3 text-xs"
//       >
//         Manage Columns
//       </Button>
//     </div>
//   </div>

//   {/* ------------------- TABLE + PAGINATION (unchanged) ------------------- */}
//   <Card>
//     <CardContent className="p-0 mt-8">
//       <div className="w-full h-[30rem] flex flex-col">
//         <div className="w-full overflow-auto">
//           <table className="w-full text-sm border-collapse table-fixed min-w-[1350px]">
//             <thead className="sticky top-0 z-10">
//               <tr>
//                 {displayColumns.map((colId) => {
//                   const col = possibleColumns.find((c) => c.id === colId);
//                   if (!col) return null;
//                   return (
//                     <th
//                       key={colId}
//                       className={`bg-gray-100 py-2 px-2 border ${col.width}`}
//                     >
//                       {col.label}
//                     </th>
//                   );
//                 })}
//               </tr>
//             </thead>
//             <tbody>
//               {currentItems.length > 0 ? (
//                 currentItems
//                   .filter((form) => form.id)
//                   .map((form) => (
//                     <tr key={form.id!} className="text-xs hover:bg-gray-50">
//                       {displayColumns.map((colId) => {
//                         const col = possibleColumns.find(
//                           (c) => c.id === colId
//                         );
//                         if (!col) return null;
//                         return (
//                           <td
//                             key={colId}
//                             className={`py-1 px-2 border ${col.width}`}
//                           >
//                             {col.render(form)}
//                           </td>
//                         );
//                       })}
//                     </tr>
//                   ))
//               ) : (
//                 <tr>
//                   <td
//                     colSpan={displayColumns.length}
//                     className="py-4 text-center border"
//                   >
//                     {isLoading ? "Loading..." : "No forms found"}
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         <div className="flex justify-between items-center mt-2">
//           <div className="flex gap-2 items-center">
//             <Button
//               className="bg-[#483d73] hover:bg-[#31294e]"
//               onClick={() => handlePageChange(currentPage - 1)}
//               disabled={currentPage === 1}
//             >
//               Prev
//             </Button>
//             <span>
//               Page {currentPage} of {totalPages}
//             </span>
//             <Button
//               className="bg-[#483d73] hover:bg-[#31294e]"
//               onClick={() => handlePageChange(currentPage + 1)}
//               disabled={currentPage === totalPages}
//             >
//               Next
//             </Button>
//           </div>

//           <Select
//             value={String(itemsPerPage)}
//             onValueChange={handleItemsPerPageChange}
//           >
//             <SelectTrigger className="w-[80px]">
//               <SelectValue />
//             </SelectTrigger>
//             <SelectContent>
//               {[5, 10, 20, 50].map((num) => (
//                 <SelectItem key={num} value={String(num)}>
//                   {num}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </div>
//       </div>
//     </CardContent>
//   </Card>
// </TabsContent>

//       </Tabs>

//      {/* Manage Columns Dialog - Improved & Grouped */}
// <Dialog open={showManage} onOpenChange={setShowManage}>
//   <DialogContent className="max-h-[80vh] max-w-lg">
//     <DialogHeader>
//       <DialogTitle>Manage Dashboard Columns</DialogTitle>
//     </DialogHeader>
//     <ScrollArea className="max-h-[60vh] pr-4">
//       <div className="space-y-6 py-4">

//         {/* Optional Extracted Fields */}
//         <div className="border-t pt-4">
//           <h4 className="font-semibold text-sm mb-3 text-blue-700">Optional Extracted Fields</h4>
//           {possibleColumns
//             .filter(col => col.id.startsWith("ext_"))
//             .sort((a, b) => a.label.localeCompare(b.label))
//             .map(col => (
//               <div key={col.id} className="flex items-center space-x-2 py-1">
//                 <Checkbox
//                   checked={visibleColumns.includes(col.id)}
//                   onCheckedChange={(checked) => {
//                     setVisibleColumns(prev =>
//                       checked ? [...prev, col.id] : prev.filter(id => id !== col.id)
//                     );
//                   }}
//                 />
//                 <Label className="text-sm">{col.label}</Label>
//               </div>
//             ))}
//         </div>

//         {/* Custom Additional Fields */}
//         {possibleColumns.some(col => col.id.startsWith("add_")) && (
//           <div className="border-t pt-4">
//             <h4 className="font-semibold text-sm mb-3 text-purple-700">Custom Fields</h4>
//             {possibleColumns
//               .filter(col => col.id.startsWith("add_"))
//               .map(col => (
//                 <div key={col.id} className="flex items-center space-x-2 py-1">
//                   <Checkbox
//                     checked={visibleColumns.includes(col.id)}
//                     onCheckedChange={(checked) => {
//                       setVisibleColumns(prev =>
//                         checked ? [...prev, col.id] : prev.filter(id => id !== col.id)
//                       );
//                     }}
//                   />
//                   <Label className="text-sm">{col.label}</Label>
//                 </div>
//               ))}
//           </div>
//         )}
//       </div>
//     </ScrollArea>

//     <div className="flex justify-end pt-2  border-t">
//       <Button onClick={() => setShowManage(false)} className="bg-[#483d73] hover:bg-[#31294e]">
//         Done
//       </Button>
//     </div>
//   </DialogContent>
// </Dialog>

//       {/* View Dialog */}
//       {selectedViewForm && selectedViewForm.id && (
//         <Dialog open={true} onOpenChange={() => setOpenView(null)}>
//           <DialogContent className="max-w-4xl h-[90vh] overflow-hidden flex flex-col">
//             <DialogHeader>
//               <DialogTitle>
//                 Business Card - {selectedViewForm.cardNo || "N/A"}
//               </DialogTitle>
//             </DialogHeader>
//             <div className="flex-grow overflow-y-auto">
//               <Tabs defaultValue="merged" className="w-full">
//                 <TabsList className="grid w-full grid-cols-4 sticky top-0 bg-background z-10">
//                   <TabsTrigger value="merged">Merged Data</TabsTrigger>
//                   <TabsTrigger value="extracted">Extracted Data</TabsTrigger>
//                   <TabsTrigger value="form">Form Data</TabsTrigger>
//                   <TabsTrigger value="images">Card Image</TabsTrigger>
//                 </TabsList>
//                 <ScrollArea className="h-[calc(90vh-120px)]">
//                   <TabsContent value="merged">
//                     {(() => {
//                       const merged = {
//                         ...selectedViewForm,
//                         ...(selectedViewForm.extractedData || {}),
//                         description:
//                           (selectedViewForm.description || "") +
//                           "\nImg Desc: " +
//                           (selectedViewForm.extractedData?.description || ""),
//                       };
//                       return <MergedDataView data={merged} />;
//                     })()}
//                   </TabsContent>
//                   <TabsContent value="extracted">
//   <Card>
//     <CardHeader>
//       <CardTitle>Extracted Information</CardTitle>
//     </CardHeader>
//     <CardContent>
//       <ExtractedDataForm
//         form={selectedViewForm}
//         closeDialog={() => setOpenView(null)}
//       />
//     </CardContent>
//   </Card>
// </TabsContent>
//                   <TabsContent value="form">
//                     <FormDataView data={selectedViewForm} />
//                   </TabsContent>
//                   <TabsContent value="images">
//                     <Card>
//                       <CardHeader>
//                         <CardTitle>Card Image</CardTitle>
//                       </CardHeader>
//                       <CardContent>
//                         <ScrollArea className="h-[calc(90vh-200px)]">
//                           <div className="space-y-6">
//                             <div>
//                               <h4 className="text-sm font-medium mb-3">
//                                 Front Side
//                               </h4>
//                               {selectedViewForm.cardFrontPhoto ? (
//                                 <button
//                                   onClick={() =>
//                                     setZoomedImage(
//                                       selectedViewForm.cardFrontPhoto!
//                                     )
//                                   }
//                                   className="block w-full"
//                                 >
//                                   <img
//                                     src={
//                                       selectedViewForm.cardFrontPhoto ||
//                                       "/placeholder.svg"
//                                     }
//                                     alt="Card Front"
//                                     className="max-w-full max-h-96 object-contain rounded-md border hover:opacity-90 transition"
//                                   />
//                                 </button>
//                               ) : (
//                                 <div className="text-sm text-muted-foreground">
//                                   No front image available
//                                 </div>
//                               )}
//                             </div>
//                             {selectedViewForm.cardBackPhoto && (
//                               <div>
//                                 <h4 className="text-sm font-medium mb-3">
//                                   Back Side
//                                 </h4>
//                                 <button
//                                   onClick={() =>
//                                     setZoomedImage(
//                                       selectedViewForm.cardBackPhoto!
//                                     )
//                                   }
//                                   className="block w-full"
//                                 >
//                                   <img
//                                     src={
//                                       selectedViewForm.cardBackPhoto ||
//                                       "/placeholder.svg"
//                                     }
//                                     alt="Card Back"
//                                     className="max-w-full max-h-96 object-contain rounded-md border hover:opacity-90 transition"
//                                   />
//                                 </button>
//                               </div>
//                             )}
//                           </div>
//                         </ScrollArea>
//                       </CardContent>
//                     </Card>
//                   </TabsContent>
//                 </ScrollArea>
//               </Tabs>
//             </div>
//           </DialogContent>
//         </Dialog>
//       )}

//       {/* Edit Dialog */}
//       {selectedEditForm && selectedEditForm.id && (
//         <Dialog open={true} onOpenChange={() => setOpenEdit(null)}>
//           <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
//             <DialogHeader>
//               <DialogTitle>
//                 Edit Form - {selectedEditForm.cardNo || "N/A"}
//               </DialogTitle>
//             </DialogHeader>
//             <ExhibitionForm
//               initialData={{
//                 cardNo: selectedEditForm.cardNo || "",
//                 salesPerson: selectedEditForm.salesPerson || "",
//                 date: selectedEditForm.date
//                   ? new Date(selectedEditForm.date).toISOString().split("T")[0]
//                   : "",
//                 country: selectedEditForm.country || "",
//                 cardFrontPhoto: selectedEditForm.cardFrontPhoto || "",
//                 cardBackPhoto: selectedEditForm.cardBackPhoto || "",
//                 leadStatus: selectedEditForm.leadStatus || "",
//                 dealStatus: selectedEditForm.dealStatus || "",
//                 meetingAfterExhibition:
//                   selectedEditForm.meetingAfterExhibition || false,
//                 description: selectedEditForm.description || "",
//                 extractionStatus:
//                   selectedEditForm.extractionStatus || "PENDING",
//               }}
//               additionalData={selectedEditForm.additionalData || {}}
//               onSubmit={(updatedData: any) =>
//                 handleUpdate(updatedData, selectedEditForm.id!, () => {
//                   setOpenEdit(null);
//                 })
//               }
//               isEdit={true}
//               formId={selectedEditForm.id!}
//               disabledFields={["cardNo", "date"]}
//             />
//           </DialogContent>
//         </Dialog>
//       )}

//       {/* Zoomed Image */}
//       {zoomedImage && (
//         <Dialog open={true} onOpenChange={() => setZoomedImage(null)}>
//           <DialogContent className="max-w-3xl p-0 overflow-hidden">
//             <img
//               src={zoomedImage || "/placeholder.svg"}
//               alt="Zoomed Card"
//               className="w-full h-auto max-h-[80vh] object-contain"
//             />
//           </DialogContent>
//         </Dialog>
//       )}
//     </div>
//   );
// }



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
import type { FormData } from "@/types/form";
import { ExhibitionForm } from "@/components/exhibition-form";
import { DashboardOverview } from "@/components/admin/dashboard-overview";

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
const [visibleColumns, setVisibleColumns] = useState<string[]>([
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
]);

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
      {
        id: "company",
        label: "Company Name",
        width: "w-32",
        render: (form: FormData) =>
          form.extractedData?.companyName || form.additionalData?.company || "N/A",
      },
      {
  id: "city",
  label: "City",
  width: "w-28",
  render: (form: FormData) => form.extractedData?.city || "N/A",
},
      {
        id: "state",
        label: "State",
        width: "w-24",
        render: (form: FormData) =>
          form.extractedData?.state || form.additionalData?.state || "N/A",
      },
      {
        id: "country",
        label: "Country",
        width: "w-24",
        render: (form: FormData) =>
          form.extractedData?.country || form.country || "N/A",
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
        id: "dealStatus",
        label: "Deal Status",
        width: "w-24",
        render: (form: FormData) => form.dealStatus ?? "N/A",
      },
      {
        id: "meeting",
        label: "Meeting",
        width: "w-20",
        render: (form: FormData) =>
          form.meetingAfterExhibition ? "Yes" : "No",
      },
      {
        id: "formStatus",
        label: "Form Status",
        width: "w-24",
        render: (form: FormData) => form.status ?? "N/A",
      },
      {
        id: "extractionStatus",
        label: "Extraction Status",
        width: "w-32",
        render: (form: FormData) => form.extractionStatus ?? "N/A",
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
                onClick={() => handleDelete(form.id!)}
                className="focus:bg-destructive focus:text-destructive-foreground"
              >
                <Trash className="mr-2 h-3 w-3" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ];

// Dynamic additionalData columns
  const allAdditionalKeys = forms.flatMap((f) =>
    Object.keys(f.additionalData || {})
  );
  const uniqueAdditional = [...new Set(allAdditionalKeys)].slice(0, 10);
  const additionalColumns = uniqueAdditional.map((key) => ({
    id: `add_${key}`,
    label: key.replace(/_/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase()),
    width: "w-32",
    render: (form: FormData) => form.additionalData?.[key] || "N/A",
  }));

  // FIXED: Dynamic extractedData columns — ONLY block exact matches
  const allExtractedKeys = forms.flatMap((f) =>
    Object.keys(f.extractedData || {})
  );
  const blockedKeys = ["companyName", "name", "email", "contactNumbers", "city" , "state", "country","website", "address"];
  const uniqueExtracted = [...new Set(allExtractedKeys)]
    .filter((key) => !blockedKeys.includes(key))  // ← Only block exact keys
    .slice(0, 15);

  const extractedColumns = uniqueExtracted.map((key) => ({
    id: `ext_${key}`,
    label: key.replace(/_/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase()),
    width: "w-36",
    render: (form: FormData) => form.extractedData?.[key] || "—",
  }));

  return [...fixedColumns, ...additionalColumns, ...extractedColumns];
}, [forms]);

  const displayColumns = useMemo(
    () => [...visibleColumns, "actions"],
    [visibleColumns]
  );

  const fetchForms = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/forms", {
        method: "GET",
        headers: { "Cache-Control": "no-cache" },
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        if (errorData.limitReached) {
          toast({
            title: "Limit Reached",
            description:
              errorData.message ||
              "Form submission limit reached. Please upgrade your plan.",
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
      setIsLoading(false);
    }
  }, [toast]);

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

      const filteredData = forms.filter((form) => {
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
      });

      if (filteredData.length === 0) {
        toast({
          title: "No Data",
          description: "No data available to export.",
          variant: "default",
        });
        return;
      }

      const excelData = filteredData.map((form) => ({
        "Card Image": form.cardFrontPhoto || "",
        "Card No": form.cardNo || "",
        "Sales Person": form.salesPerson || "",
        Date: form.date ? new Date(form.date).toLocaleDateString() : "",
        "User Email": form.user?.email || "",
        "Company Name": form.extractedData?.companyName || "",
        "Contact Name": form.mergedData?.name || "",
        "Contact Email": form.extractedData?.email || "",
        "Contact Numbers": form.extractedData?.contactNumbers || "",
        Country: form.country || "",
        "Lead Status": form.leadStatus || "",
        "Deal Status": form.dealStatus || "",
        "Meeting After Exhibition": form.meetingAfterExhibition ? "Yes" : "No",
        "Form Status": form.status || "",
        "Extraction Status": form.extractionStatus || "",
        "Zoho Status": form.zohoStatus || "",
        "Industry Categories": Array.isArray(form.industryCategories)
          ? form.industryCategories.join(", ")
          : form.industryCategories || "",
        Description: form.description || "",
        "Created At": form.createdAt
          ? new Date(form.createdAt).toLocaleString()
          : "",
        "Updated At": form.updatedAt
          ? new Date(form.updatedAt).toLocaleString()
          : "",
        "Form ID": form.id || "",
        "User ID": form.userId || "",
        "Card Back Image": form.cardBackPhoto || "",
        ...form.additionalData,
      }));

      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(excelData);

      const colWidths = [
        { wch: 15 },
        { wch: 12 },
        { wch: 15 },
        { wch: 12 },
        { wch: 25 },
        { wch: 25 },
        { wch: 20 },
        { wch: 25 },
        { wch: 20 },
        { wch: 12 },
        { wch: 12 },
        { wch: 12 },
        { wch: 22 },
        { wch: 12 },
        { wch: 18 },
        { wch: 12 },
        { wch: 20 },
        { wch: 30 },
        { wch: 18 },
        { wch: 18 },
        { wch: 20 },
        { wch: 20 },
        { wch: 15 },
      ];
      worksheet["!cols"] = colWidths;

      XLSX.utils.book_append_sheet(workbook, worksheet, "Business Cards");

      const timestamp = new Date()
        .toISOString()
        .slice(0, 19)
        .replace(/:/g, "-");
      const filename = `Business_Cards_${timestamp}.xlsx`;

      XLSX.writeFile(workbook, filename);

      toast({
        title: "Download Complete",
        description: `${filteredData.length} records exported to Excel successfully!`,
      });
    } catch (error) {
      console.error("Error downloading Excel:", error);
      toast({
        title: "Export Failed",
        description: "Failed to download Excel file.",
        variant: "destructive",
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
    if (
      !confirm(
        "Are you sure you want to delete this record? This action cannot be undone."
      )
    )
      return;
    try {
      setIsLoading(true);
      const res = await fetch(`/api/forms/${id}`, { 
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
            className="bg-[#62588b] hover:bg-[#31294e]"
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
      <Card>
        <CardHeader>
          <CardTitle>Merged Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Button
              className={
                view === "raw"
                  ? "bg-[#62588b] hover:bg-[#31294e] text-white"
                  : ""
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
                  : ""
              }
              variant={view === "table" ? "default" : "outline"}
              onClick={() => setView("table")}
            >
              Table Data
            </Button>
          </div>
          {view === "raw" ? (
            <ScrollArea className="h-[calc(90vh-200px)] bg-muted p-4 rounded-md">
              <pre className="text-sm whitespace-pre-wrap">
                {formatData(data)}
              </pre>
            </ScrollArea>
          ) : (
            <ScrollArea className="h-[calc(90vh-200px)]">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr>
                    <th className="bg-gray-100 py-2 px-2 border text-left w-1/2">
                      Field
                    </th>
                    <th className="bg-gray-100 py-2 px-2 border text-left w-1/2">
                      Value
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(data).map(([key, value]) => (
                    <tr key={key}>
                      <td className="py-1 px-2 border w-1/2 whitespace-normal break-words ">
                        {key
                          .replace(/_/g, " ")
                          .replace(/\b\w/g, (l) => l.toUpperCase())}
                      </td>
                      <td className="py-1 px-2 border w-1/2 whitespace-normal break-words">
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
      <Card>
        <CardHeader>
          <CardTitle>Form Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Button
              className={
                view === "raw"
                  ? "bg-[#62588b] hover:bg-[#31294e] text-white"
                  : ""
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
                  : ""
              }
              variant={view === "table" ? "default" : "outline"}
              onClick={() => setView("table")}
            >
              Table Data
            </Button>
          </div>
          {view === "raw" ? (
            <ScrollArea className="h-[calc(90vh-200px)] bg-muted p-4 rounded-md">
              <pre className="text-sm whitespace-pre-wrap">
                {formatData(data)}
              </pre>
            </ScrollArea>
          ) : (
            <ScrollArea className="h-[calc(90vh-200px)]">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr>
                    <th className="bg-gray-100 py-2 px-2 border text-left w-1/2">
                      Field
                    </th>
                    <th className="bg-gray-100 py-2 px-2 border text-left w-1/2">
                      Value
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-1 px-2 border w-1/2 whitespace-normal break-words font-medium">
                      Card Image
                    </td>
                    <td className="py-1 px-2 border w-1/2">
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
                        <span className="text-muted-foreground text-xs">
                          No image
                        </span>
                      )}
                    </td>
                  </tr>

                  <tr>
                    <td className="py-1 px-2 border w-1/2 whitespace-normal break-words">
                      Card No
                    </td>
                    <td className="py-1 px-2 border w-1/2 whitespace-normal break-words">
                      {data.cardNo ?? "N/A"}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1 px-2 border w-1/2 whitespace-normal break-words">
                      Sales Person
                    </td>
                    <td className="py-1 px-2 border w-1/2 whitespace-normal break-words">
                      {data.salesPerson ?? "N/A"}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1 px-2 border w-1/2 whitespace-normal break-words">
                      Date
                    </td>
                    <td className="py-1 px-2 border w-1/2 whitespace-normal break-words">
                      {data.date
                        ? new Date(data.date).toLocaleDateString()
                        : "N/A"}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1 px-2 border w-1/2 whitespace-normal break-words">
                      User
                    </td>
                    <td className="py-1 px-2 border w-1/2 whitespace-normal break-words">
                      {data.user?.email || "N/A"}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1 px-2 border w-1/2 whitespace-normal break-words">
                      Company
                    </td>
                    <td className="py-1 px-2 border w-1/2 whitespace-normal break-words">
                      <div className="font-medium">
                        {mergedData?.companyName || "N/A"}
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        {mergedData?.name || "No contact"}
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1 px-2 border w-1/2 whitespace-normal break-words">
                      Contact Info
                    </td>
                    <td className="py-1 px-2 border w-1/2 whitespace-normal break-words">
                      {mergedData?.email && <div>{mergedData.email}</div>}
                      {mergedData?.contactNumbers && (
                        <div className="text-[10px] text-muted-foreground">
                          {mergedData.contactNumbers.split(",")[0]}
                        </div>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1 px-2 border w-1/2 whitespace-normal break-words">
                      Lead Status
                    </td>
                    <td className="py-1 px-2 border w-1/2 whitespace-normal break-words">
                      {data.leadStatus ?? "N/A"}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1 px-2 border w-1/2 whitespace-normal break-words">
                      Deal Status
                    </td>
                    <td className="py-1 px-2 border w-1/2 whitespace-normal break-words">
                      {data.dealStatus ?? "N/A"}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1 px-2 border w-1/2 whitespace-normal break-words">
                      Meeting
                    </td>
                    <td className="py-1 px-2 border w-1/2 whitespace-normal break-words">
                      {data.meetingAfterExhibition ? "Yes" : "No"}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1 px-2 border w-1/2 whitespace-normal break-words">
                      Form Status
                    </td>
                    <td className="py-1 px-2 border w-1/2 whitespace-normal break-words">
                      {data.status ?? "N/A"}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1 px-2 border w-1/2 whitespace-normal break-words">
                      Extraction Status
                    </td>
                    <td className="py-1 px-2 border w-1/2 whitespace-normal break-words">
                      {data.extractionStatus ?? "N/A"}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1 px-2 border w-1/2 whitespace-normal break-words">
                      Zoho Status
                    </td>
                    <td className="py-1 px-2 border w-1/2 whitespace-normal break-words">
                      {data.zohoStatus ?? "N/A"}
                    </td>
                  </tr>

                  {/* Dynamic Fields */}
                  {data.additionalData &&
                    Object.keys(data.additionalData).length > 0 && (
                      <>
                        <tr>
                          <td
                            colSpan={2}
                            className="py-2 px-2 border bg-gray-50 font-medium text-sm"
                          >
                            Custom Fields
                          </td>
                        </tr>
                        {Object.entries(data.additionalData).map(
                          ([key, value]) => (
                            <tr key={key}>
                              <td className="py-1 px-2 border w-1/2 whitespace-normal break-words">
                                {key
                                  .replace(/_/g, " ")
                                  .replace(/\b\w/g, (l) => l.toUpperCase())}
                              </td>
                              <td className="py-1 px-2 border w-1/2 whitespace-normal break-words">
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
    <div className="space-y-6 px-2 sm:px-4 py-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Dashboard Overview</TabsTrigger>
          <TabsTrigger value="data">Card Data</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <DashboardOverview forms={forms} />
        </TabsContent>

       <TabsContent value="data" className="space-y-4">

  {/* ------------------- MOBILE VERSION ------------------- */}
  <div className="sm:hidden flex flex-col gap-3">

    {/* Row 1: Search + User Filter */}
    <div className="flex w-full gap-2">
      <Input
        placeholder="Search forms..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="flex-1 h-9 px-2 text-sm"
      />

      <Select value={selectedUser} onValueChange={setSelectedUser}>
        <SelectTrigger className="h-9 px-2 text-sm w-32">
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

    {/* Row 2: Excel + Manage Columns */}
    <div className="flex w-full gap-2">
      <Button
        onClick={handleDownloadExcel}
        disabled={isDownloading || filteredForms.length === 0}
        className="flex-1 h-9 px-2 text-xs bg-[#483d73] hover:bg-[#352c55]"
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
        className="flex-1 h-9 px-2 text-xs border-[#483d73] text-[#483d73] hover:bg-[#483d73]/10"
      >
        Manage Columns
      </Button>
    </div>
  </div>

  {/* ------------------- DESKTOP VERSION ------------------- */}
  <div className="hidden sm:flex flex-row justify-between items-center gap-3">

    {/* Search */}
    <Input
      placeholder="Search forms..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="w-64 h-9"
    />

    {/* Filter + Buttons */}
    <div className="flex items-center gap-2">
      <Select value={selectedUser} onValueChange={setSelectedUser}>
        <SelectTrigger className="w-48 text-xs h-9">
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
        className="h-9 px-3 text-xs bg-[#483d73] hover:bg-[#352c55]"
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

  {/* ------------------- TABLE + PAGINATION (unchanged) ------------------- */}
  <Card>
    <CardContent className="p-0 mt-8">
      <div className="w-full h-[30rem] flex flex-col">
        <div className="w-full overflow-auto">
          <table className="w-full text-sm border-collapse table-fixed min-w-[1350px]">
            <thead className="sticky top-0 z-10">
              <tr>
                {displayColumns.map((colId) => {
                  const col = possibleColumns.find((c) => c.id === colId);
                  if (!col) return null;
                  return (
                    <th
                      key={colId}
                      className={`bg-gray-100 py-2 px-2 border ${col.width}`}
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
                    <tr key={form.id!} className="text-xs hover:bg-gray-50">
                      {displayColumns.map((colId) => {
                        const col = possibleColumns.find(
                          (c) => c.id === colId
                        );
                        if (!col) return null;
                        return (
                          <td
                            key={colId}
                            className={`py-1 px-2 border ${col.width}`}
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
                    className="py-4 text-center border"
                  >
                    {isLoading ? "Loading..." : "No forms found"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center mt-2">
          <div className="flex gap-2 items-center">
            <Button
              className="bg-[#483d73] hover:bg-[#31294e]"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Prev
            </Button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <Button
              className="bg-[#483d73] hover:bg-[#31294e]"
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
            <SelectTrigger className="w-[80px]">
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

     {/* Manage Columns Dialog - Improved & Grouped */}
<Dialog open={showManage} onOpenChange={setShowManage}>
  <DialogContent className="max-h-[80vh] max-w-lg">
    <DialogHeader>
      <DialogTitle>Manage Dashboard Columns</DialogTitle>
    </DialogHeader>
    <ScrollArea className="max-h-[60vh] pr-4">
      <div className="space-y-6 py-4">

        {/* Optional Extracted Fields */}
        <div className="border-t pt-4">
          <h4 className="font-semibold text-sm mb-3 text-blue-700">Optional Extracted Fields</h4>
          {possibleColumns
            .filter(col => col.id.startsWith("ext_"))
            .sort((a, b) => a.label.localeCompare(b.label))
            .map(col => (
              <div key={col.id} className="flex items-center space-x-2 py-1">
                <Checkbox
                  checked={visibleColumns.includes(col.id)}
                  onCheckedChange={(checked) => {
                    setVisibleColumns(prev =>
                      checked ? [...prev, col.id] : prev.filter(id => id !== col.id)
                    );
                  }}
                />
                <Label className="text-sm">{col.label}</Label>
              </div>
            ))}
        </div>

        {/* Custom Additional Fields */}
        {possibleColumns.some(col => col.id.startsWith("add_")) && (
          <div className="border-t pt-4">
            <h4 className="font-semibold text-sm mb-3 text-purple-700">Custom Fields</h4>
            {possibleColumns
              .filter(col => col.id.startsWith("add_"))
              .map(col => (
                <div key={col.id} className="flex items-center space-x-2 py-1">
                  <Checkbox
                    checked={visibleColumns.includes(col.id)}
                    onCheckedChange={(checked) => {
                      setVisibleColumns(prev =>
                        checked ? [...prev, col.id] : prev.filter(id => id !== col.id)
                      );
                    }}
                  />
                  <Label className="text-sm">{col.label}</Label>
                </div>
              ))}
          </div>
        )}
      </div>
    </ScrollArea>

    <div className="flex justify-end pt-2  border-t">
      <Button onClick={() => setShowManage(false)} className="bg-[#483d73] hover:bg-[#31294e]">
        Done
      </Button>
    </div>
  </DialogContent>
</Dialog>

      {/* View Dialog */}
      {selectedViewForm && selectedViewForm.id && (
        <Dialog open={true} onOpenChange={() => setOpenView(null)}>
          <DialogContent className="w-[95vw] max-w-md sm:max-w-4xl h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle>
                Business Card - {selectedViewForm.cardNo || "N/A"}
              </DialogTitle>
            </DialogHeader>
            <div className="flex-grow overflow-y-auto">
              <Tabs defaultValue="merged" className="w-full">
                <TabsList className="flex overflow-x-auto whitespace-nowrap sticky top-0 bg-background z-10">
                  <TabsTrigger value="merged">Merged Data</TabsTrigger>
                  <TabsTrigger value="extracted">Extracted Data</TabsTrigger>
                  <TabsTrigger value="form">Form Data</TabsTrigger>
                  <TabsTrigger value="images">Card Image</TabsTrigger>
                </TabsList>
                <ScrollArea className="h-[calc(90vh-120px)]">
                  <TabsContent value="merged">
                    {(() => {
                      const merged = {
                        ...selectedViewForm,
                        ...(selectedViewForm.extractedData || {}),
                        description:
                          (selectedViewForm.description || "") +
                          "\nImg Desc: " +
                          (selectedViewForm.extractedData?.description || ""),
                      };
                      return <MergedDataView data={merged} />;
                    })()}
                  </TabsContent>
                  <TabsContent value="extracted">
  <Card>
    <CardHeader>
      <CardTitle>Extracted Information</CardTitle>
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
                    <Card>
                      <CardHeader>
                        <CardTitle>Card Image</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ScrollArea className="h-[calc(90vh-200px)]">
                          <div className="space-y-6">
                            <div>
                              <h4 className="text-sm font-medium mb-3">
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
                                    src={
                                      selectedViewForm.cardFrontPhoto ||
                                      "/placeholder.svg"
                                    }
                                    alt="Card Front"
                                    className="max-w-full max-h-96 object-contain rounded-md border hover:opacity-90 transition"
                                  />
                                </button>
                              ) : (
                                <div className="text-sm text-muted-foreground">
                                  No front image available
                                </div>
                              )}
                            </div>
                            {selectedViewForm.cardBackPhoto && (
                              <div>
                                <h4 className="text-sm font-medium mb-3">
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
                                    src={
                                      selectedViewForm.cardBackPhoto ||
                                      "/placeholder.svg"
                                    }
                                    alt="Card Back"
                                    className="max-w-full max-h-96 object-contain rounded-md border hover:opacity-90 transition"
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

      {/* Edit Dialog */}
      {selectedEditForm && selectedEditForm.id && (
        <Dialog open={true} onOpenChange={() => setOpenEdit(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                Edit Form - {selectedEditForm.cardNo || "N/A"}
              </DialogTitle>
            </DialogHeader>
            <ExhibitionForm
              initialData={{
                cardNo: selectedEditForm.cardNo || "",
                salesPerson: selectedEditForm.salesPerson || "",
                date: selectedEditForm.date
                  ? new Date(selectedEditForm.date).toISOString().split("T")[0]
                  : "",
                country: selectedEditForm.country || "",
                cardFrontPhoto: selectedEditForm.cardFrontPhoto || "",
                cardBackPhoto: selectedEditForm.cardBackPhoto || "",
                leadStatus: selectedEditForm.leadStatus || "",
                dealStatus: selectedEditForm.dealStatus || "",
                meetingAfterExhibition:
                  selectedEditForm.meetingAfterExhibition || false,
                description: selectedEditForm.description || "",
                extractionStatus:
                  selectedEditForm.extractionStatus || "PENDING",
              }}
              additionalData={selectedEditForm.additionalData || {}}
              onSubmit={(updatedData: any) =>
                handleUpdate(updatedData, selectedEditForm.id!, () => {
                  setOpenEdit(null);
                })
              }
              isEdit={true}
              formId={selectedEditForm.id!}
              disabledFields={["cardNo", "date"]}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Zoomed Image */}
      {zoomedImage && (
        <Dialog open={true} onOpenChange={() => setZoomedImage(null)}>
          <DialogContent className="max-w-3xl p-0 overflow-hidden">
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
