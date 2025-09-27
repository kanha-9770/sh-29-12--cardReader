"use client";

import type React from "react";

import { useState, useCallback, useEffect, useRef } from "react";
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
import { useToast } from "@/hooks/use-toast";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Upload, X, Camera, RefreshCw } from "lucide-react";
import { Progress } from "@/components/ui/progress";

import {
  salesPersons,
  leadStatuses,
  dealStatuses,
  industryCategories,
  type FormData,
} from "@/types/form";
import { PopupModal } from "@/components/popup-modal";

export function ExhibitionForm() {
  const searchParams = useSearchParams();

  // Initialize form data with URL parameters
  const initialFormData: FormData = {
    cardNo: searchParams.get("cardNo") || "",
    salesPerson: searchParams.get("salesPerson") || "",
    date: new Date().toISOString().split("T")[0],
    country: searchParams.get("exhibition") || "LABEL EXPO SPAIN 2025",
    cardFrontPhoto: "",
    cardBackPhoto: "",
    leadStatus: searchParams.get("leadStatus") || "",
    dealStatus: searchParams.get("dealStatus") || "",
    meetingAfterExhibition:
      searchParams.get("meetingAfterExhibition")?.toLowerCase() === "true" ||
      false,
    industryCategories: searchParams.get("industryCategories") || "",
    description: "",
    extractedData: null,
    mergedData: null,
    status: "PENDING",
    extractionStatus: "PENDING",
    zohoStatus: "PENDING",
    userId: undefined,
    user: undefined,
  };

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [frontImagePreview, setFrontImagePreview] = useState<string | null>(
    null
  );
  const [backImagePreview, setBackImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showBackImageModal, setShowBackImageModal] = useState(false);
  const [frontUploadProgress, setFrontUploadProgress] = useState(0);
  const [backUploadProgress, setBackUploadProgress] = useState(0);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {}
  );
  // const [fieldLabel, setFieldLabel] = useState("Country");

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [currentImageType, setCurrentImageType] = useState<
    "front" | "back" | null
  >(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">(
    "environment"
  ); // 'environment' for back camera, 'user' for front

  const { toast } = useToast();
  const router = useRouter();

  // State to hold console data
  const [consoleData, setConsoleData] = useState<string[]>([]);
  const [showConsole, setShowConsole] = useState(false);

  // Function to add logs to the consoleData array
  const addConsoleLog = (message: string) => {
    setConsoleData((prev) => [...prev, message]);
  };

  useEffect(() => {
    // Validate and update form data when URL parameters change
    const formUpdates: Partial<FormData> = {};

    // Helper function to get and decode URL parameter
    const getParam = (key: string): string => {
      const value = searchParams.get(key);
      return value ? decodeURIComponent(value.replace(/\+/g, " ")) : "";
    };

    // Handle salesPerson
    const salesPerson = getParam("salesPerson");
    if (salesPerson && salesPersons.includes(salesPerson)) {
      formUpdates.salesPerson = salesPerson;
    }

    // Handle leadStatus
    const leadStatus = getParam("leadStatus");
    if (leadStatus && leadStatuses.includes(leadStatus)) {
      formUpdates.leadStatus = leadStatus;
    }

    // Handle dealStatus
    const dealStatus = getParam("dealStatus");
    if (dealStatus && dealStatuses.includes(dealStatus)) {
      formUpdates.dealStatus = dealStatus;
    }

    // Handle industryCategories
    const categoriesParam = getParam("industryCategories");
    if (categoriesParam) {
      const categories = categoriesParam.split(",").map((cat) => cat.trim());
      const validCategories = categories.filter((cat) =>
        industryCategories.includes(cat)
      );
      formUpdates.industryCategories = validCategories.join(",");
    }

    // Update form data with validated URL parameters
    if (Object.keys(formUpdates).length > 0) {
      setFormData((prev) => ({
        ...prev,
        ...formUpdates,
      }));
    }
  }, [searchParams]);

  const openCamera = (type: "front" | "back") => {
    addConsoleLog(`[Camera] Opening camera for ${type} image.`); // CONSOLE LOG
    setCurrentImageType(type);
    setIsCameraOpen(true);
    startCameraStream();
  };

  const startCameraStream = async () => {
    addConsoleLog("[Camera] Starting camera stream."); // CONSOLE LOG
    try {
      if (videoRef.current) {
        // Stop any existing stream first
        stopCameraStream();

        // Request camera access with proper constraints
        const constraints = {
          video: {
            facingMode: facingMode,
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        };

        addConsoleLog(
          `[Camera] Requesting user media with constraints: ${JSON.stringify(
            constraints
          )}`
        );

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch((err) => {
          console.error("Error playing video:", err);
        });
        addConsoleLog("[Camera] Camera stream started successfully."); // CONSOLE LOG
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      toast({
        title: "Camera Error",
        description:
          "Failed to access camera. Please check your permissions or try a different browser.",
        variant: "destructive",
      });
      setIsCameraOpen(false);
    }
  };

  const toggleCamera = () => {
    addConsoleLog("[Camera] Toggling camera facing mode."); // CONSOLE LOG
    setFacingMode(facingMode === "user" ? "environment" : "user");
  };

  useEffect(() => {
    // Only start camera if modal is open
    if (isCameraOpen) {
      startCameraStream();
    }

    // Clean up function to stop camera when component unmounts or modal closes
    return () => {
      if (isCameraOpen) {
        stopCameraStream();
      }
    };
  }, [facingMode, isCameraOpen]);

  const captureImage = () => {
    addConsoleLog("[Camera] Capturing image from camera."); // CONSOLE LOG
    if (
      videoRef.current &&
      canvasRef.current &&
      videoRef.current.videoWidth > 0
    ) {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const context = canvas.getContext("2d");
      if (context) {
        // Draw the current video frame to the canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convert canvas to blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              addConsoleLog(`[Camera] Blob created: ${blob.size} bytes`);
              const file = new File([blob], `${currentImageType}_image.jpg`, {
                type: "image/jpeg",
              });
              addConsoleLog(
                `[Camera] File created from Blob: ${file.size} bytes, type: ${file.type}`
              );

              // Use the existing image handler
              handleImageChange(
                { target: { files: [file] } } as any,
                currentImageType as "front" | "back"
              );
            } else {
              toast({
                title: "Error",
                description: "Could not create image blob.",
                variant: "destructive",
              });
              addConsoleLog("[Camera] Could not create image blob.");
            }
          },
          "image/jpeg",
          0.9
        ); // 0.9 quality
      }
      closeCamera();
    } else {
      toast({
        title: "Camera Error",
        description: "Could not capture image. Please try again.",
        variant: "destructive",
      });
      addConsoleLog("[Camera] Could not capture image.");
    }
  };

  const stopCameraStream = () => {
    addConsoleLog("[Camera] Stopping camera stream."); // CONSOLE LOG
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const closeCamera = () => {
    addConsoleLog("[Camera] Closing camera."); // CONSOLE LOG
    setIsCameraOpen(false);
    stopCameraStream();
  };

  const handleImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "front" | "back"
  ) => {
    const file = e.target.files?.[0];

    if (!file) {
      console.warn("No file selected.");
      addConsoleLog("No file selected.");
      return;
    }
    addConsoleLog(
      `[Image Upload] Selected ${type} image: ${file.name}, size: ${file.size} bytes`
    ); // CONSOLE LOG

    addConsoleLog(
      `[Image Upload - handleImageChange] File received: ${file.name}, size: ${file.size}, type: ${file.type}`
    );
    const reader = new FileReader();
    reader.onload = (e) => {
      if (type === "front") {
        setFrontImagePreview(e.target?.result as string);
        addConsoleLog("[Image Upload] Set front image preview."); // CONSOLE LOG
      } else {
        setBackImagePreview(e.target?.result as string);
        addConsoleLog("[Image Upload] Set back image preview."); // CONSOLE LOG
      }
    };
    reader.readAsDataURL(file);

    await uploadImage(file, type);
    e.target.value = "";
  };

  const uploadImage = async (file: File, type: "front" | "back") => {
    // Log the file size right before the upload
    addConsoleLog(
      `[Image Upload] About to upload ${type} image: ${file.name}, size: ${file.size} bytes`
    );
    addConsoleLog(`[Image Upload] Uploading ${type} image: ${file.name}`); // CONSOLE LOG
    const formData = new FormData();
    formData.append("image", file);
    formData.append("type", type);

    try {
      const progressSetter =
        type === "front" ? setFrontUploadProgress : setBackUploadProgress;
      progressSetter(0);
      addConsoleLog(`[Image Upload] Uploading ${type} image started.`); // CONSOLE LOG

      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/upload-image", true);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100;
          progressSetter(percentComplete);
          addConsoleLog(
            `[Image Upload] ${type} image upload progress: ${percentComplete.toFixed(
              2
            )}%`
          ); // CONSOLE LOG
        }
      };

      xhr.onload = () => {
        // Also log the status here
        addConsoleLog(`[Image Upload] XHR onload - Status: ${xhr.status}`);
        if (xhr.status === 200) {
          const { imageUrl } = JSON.parse(xhr.responseText);
          addConsoleLog(
            `[Image Upload] ${type} image uploaded successfully. Image URL: ${imageUrl}`
          ); // CONSOLE LOG

          setFormData((prev) => ({
            ...prev,
            [type === "front" ? "cardFrontPhoto" : "cardBackPhoto"]: imageUrl,
          }));
          toast({
            title: "Success",
            description: `${
              type === "front" ? "Front" : "Back"
            } image uploaded successfully`,
          });
        } else {
          console.error(
            `[Image Upload] Failed to upload ${type} image. Server returned status: ${xhr.status}`
          );
          toast({
            title: "Error",
            description: `Failed to upload ${type} image. Server returned status: ${xhr.status}`,
            variant: "destructive",
          });
          addConsoleLog(
            `[Image Upload] Failed to upload ${type} image. Server returned status: ${xhr.status}`
          );
        }
        progressSetter(0); // Reset progress bar on completion or error
        addConsoleLog(`[Image Upload] Uploading ${type} image Ended.`); // CONSOLE LOG
      };

      xhr.onerror = () => {
        // Log the error event
        addConsoleLog(`[Image Upload] XHR onerror`);
        console.error(
          `[Image Upload] Failed to upload ${type} image. Network error.`
        ); // CONSOLE LOG
        toast({
          title: "Error",
          description: `Failed to upload ${type} image. Network error.`,
          variant: "destructive",
        });
        progressSetter(0); // Reset progress bar on completion or error
        addConsoleLog(`[Image Upload] Uploading ${type} image Ended.`); // CONSOLE LOG
      };
      xhr.onabort = () => {
        // Log the abort event
        addConsoleLog(`[Image Upload] XHR onabort`);
        console.error(`[Image Upload] Upload was aborted.`); // CONSOLE LOG
        toast({
          title: "Error",
          description: `Failed to upload ${type} image. Upload was aborted.`,
          variant: "destructive",
        });
        progressSetter(0); // Reset progress bar on completion or error
        addConsoleLog(`[Image Upload] Uploading ${type} image Ended.`); // CONSOLE LOG
      };

      xhr.send(formData); // Send the form data
    } catch (error) {
      console.error(`Error uploading ${type} image:`, error);
      toast({
        title: "Error",
        description: `Failed to upload ${type} image. An unexpected error occurred.`,
        variant: "destructive",
      });
      addConsoleLog(
        `[Image Upload] Error uploading ${type} image: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      const progressSetter =
        type === "front" ? setFrontUploadProgress : setBackUploadProgress;
      progressSetter(0);
      addConsoleLog(`[Image Upload] Uploading ${type} image Ended.`); // CONSOLE LOG
    }
  };

  const handleRemoveImage = (type: "front" | "back") => {
    addConsoleLog(`[Image Remove] Removing ${type} image.`); // CONSOLE LOG
    if (type === "front") {
      setFrontImagePreview(null);
      setFormData((prev) => ({ ...prev, cardFrontPhoto: "" }));
    } else {
      setBackImagePreview(null);
      setFormData((prev) => ({ ...prev, cardBackPhoto: "" }));
    }
  };

  const handleBackImageModalConfirm = () => {
    setShowBackImageModal(false);
    const backImageInput = document.getElementById(
      "cardBack"
    ) as HTMLInputElement;
    backImageInput.click();
  };

  const handleBackImageModalClose = () => {
    setShowBackImageModal(false);
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.cardNo) newErrors.cardNo = "Card number is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const submissionData = {
        ...formData,
        date: new Date(formData.date).toISOString(),
      };

      if (!submissionData.cardBackPhoto) {
        delete submissionData.cardBackPhoto;
      }

      const res = await fetch("/api/submit-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to submit form");
      }

      const responseData = await res.json();

      toast({
        title: "Success",
        description: "Form submitted successfully.",
      });

      router.push(`/submission/${responseData.formId}`);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to submit form. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isSubmitDisabled = !formData.cardNo || isSubmitting;

  const toggleConsole = () => {
    setShowConsole((prev) => !prev);
  };

  return (
    <>
      <Card className="w-full max-w-4xl mx-auto p-8 shadow-[8px_8px_16px_#d1d9e6,-8px_-8px_16px_#ffffff] bg-white rounded-lg overflow-hidden">
        <CardHeader className="bg-gray-50 border-b  border-gray-200 p-6">
          <CardTitle className="text-2xl font-semibold text-gray-800">
            Exhibition Form
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 ">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="cardNo"
                  className="text-sm font-medium text-gray-700"
                >
                  Card No.
                </Label>
                <Input
                  id="cardNo"
                  value={formData.cardNo}
                  onChange={(e) =>
                    setFormData({ ...formData, cardNo: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 shadow-inner shadow-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 rounded-md focus:border-transparent"
                />
                {errors.cardNo && (
                  <p className="text-sm text-red-500 mt-1">{errors.cardNo}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="salesPerson"
                  className="text-sm font-medium text-gray-700"
                >
                  NESSCO Sales Person
                </Label>
                <Select
                  value={formData.salesPerson}
                  onValueChange={(value) =>
                    setFormData({ ...formData, salesPerson: value })
                  }
                >
                  <SelectTrigger className="w-full p-2 border border-gray-300 rounded-md *:focus:border-transparent shadow-inner shadow-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400">
                    <SelectValue placeholder="Select sales person" />
                  </SelectTrigger>
                  <SelectContent>
                    {salesPersons.map((person) => (
                      <SelectItem key={person} value={person}>
                        {person}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="date"
                  className="text-sm font-medium text-gray-700"
                >
                  Date
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded-md shadow-inner shadow-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="country"
                  className="text-sm font-medium text-gray-700"
                >
                  Exhibition
                </Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) =>
                    setFormData({ ...formData, country: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded-md shadow-inner shadow-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="cardFront"
                  className="text-sm font-medium text-gray-700"
                >
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
                    className="flex items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-blue-500 transition-colors duration-300"
                  >
                    {frontImagePreview ? (
                      <div className="relative w-full h-full">
                        <Image
                          src={frontImagePreview || "/placeholder.svg"}
                          alt="Card Front Preview"
                          layout="fill"
                          objectFit="cover"
                          className="rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage("front")}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors duration-300"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <span className="mt-2 block text-sm font-medium text-gray-700">
                          Upload front image
                        </span>
                      </div>
                    )}
                  </Label>
                  <Button
                    type="button"
                    onClick={() => openCamera("front")}
                    className="absolute bottom-2 right-2 flex items-center justify-center rounded-full p-3 bg-black backdrop-blur-md shadow-lg border border-white/20 text-white transition-all duration-300 hover:scale-110 hover:border-white/40 hover:shadow-xl active:scale-95"
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                </div>
                {frontUploadProgress > 0 && frontUploadProgress < 100 && (
                  <Progress
                    value={frontUploadProgress}
                    className="w-full h-1 mt-2"
                  />
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="cardBack"
                  className="text-sm font-medium text-gray-700"
                >
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
                    className="flex items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-blue-500 transition-colors duration-300"
                  >
                    {backImagePreview ? (
                      <div className="relative w-full h-full">
                        <Image
                          src={backImagePreview || "/placeholder.svg"}
                          alt="Card Back Preview"
                          layout="fill"
                          objectFit="cover"
                          className="rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage("back")}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors duration-300"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <span className="mt-2 block text-sm font-medium text-gray-700">
                          Upload back image
                        </span>
                      </div>
                    )}
                  </Label>
                  <Button
                    type="button"
                    onClick={() => openCamera("back")}
                    className="absolute bottom-2 right-2 flex items-center justify-center rounded-full p-3 bg-black backdrop-blur-md shadow-lg border border-white/20 text-white transition-all duration-300 hover:scale-110 hover:border-white/40 hover:shadow-xl active:scale-95"
                  >
                    <Camera className="w-5 h-5 text-white drop-shadow" />
                  </Button>
                </div>
                {backUploadProgress > 0 && backUploadProgress < 100 && (
                  <Progress
                    value={backUploadProgress}
                    className="w-full h-1 mt-2"
                  />
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="description"
                className="text-sm font-medium text-gray-700"
              >
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={4}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="leadStatus"
                  className="text-sm font-medium text-gray-700"
                >
                  Lead Status
                </Label>
                <Select
                  value={formData.leadStatus}
                  onValueChange={(value) =>
                    setFormData({ ...formData, leadStatus: value })
                  }
                >
                  <SelectTrigger className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <SelectValue placeholder="Select lead status" />
                  </SelectTrigger>
                  <SelectContent>
                    {leadStatuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="dealStatus"
                  className="text-sm font-medium text-gray-700"
                >
                  Deal Status
                </Label>
                <Select
                  value={formData.dealStatus}
                  onValueChange={(value) =>
                    setFormData({ ...formData, dealStatus: value })
                  }
                >
                  <SelectTrigger className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <SelectValue placeholder="Select deal status" />
                  </SelectTrigger>
                  <SelectContent>
                    {dealStatuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="meeting"
                checked={formData.meetingAfterExhibition}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, meetingAfterExhibition: checked })
                }
              />
              <Label
                htmlFor="meeting"
                className="text-sm font-medium text-gray-700"
              >
                Meeting After Exhibition
              </Label>
            </div>

            <div className="space-y-4">
              <Label className="text-sm font-medium text-gray-700">
                Industry Category
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {industryCategories.map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={category}
                      checked={formData.industryCategories
                        .split(",")
                        .includes(category)}
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
                    <Label htmlFor={category} className="text-sm text-gray-700">
                      {category}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="bg-gray-50 border-t border-gray-200 p-6">
          <Button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-300"
            onClick={handleSubmit}
            disabled={isSubmitDisabled}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </CardFooter>

        {/* <Button onClick={toggleConsole}>
          {showConsole ? "Hide Console" : "Show Console"}
        </Button> */}

        {showConsole && (
          <div
            style={{
              position: "fixed",
              bottom: 0,
              left: 0,
              width: "100%",
              height: "300px",
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              color: "white",
              overflowY: "scroll",
              padding: "10px",
              zIndex: 1000,
              fontSize: "0.8rem",
            }}
          >
            <h3>Console Output:</h3>
            {consoleData.map((log, index) => (
              <div key={index}>{log}</div>
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
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl overflow-hidden max-w-md w-full">
              <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
                <h3 className="font-medium">Take a Photo</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={closeCamera}
                  className="h-8 w-8 p-0"
                >
                  <X className="w-4 h-4" />
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

              <div className="p-4 flex justify-between items-center">
                <Button
                  variant="outline"
                  onClick={toggleCamera}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Switch Camera
                </Button>

                <Button
                  onClick={captureImage}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Capture Photo
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>
    </>
  );
}
