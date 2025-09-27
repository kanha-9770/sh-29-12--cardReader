import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import Image from "next/image"
import { useToast } from "@/components/ui/use-toast"
import { Progress } from "@/components/ui/progress"
import { Upload } from "lucide-react"
import type React from "react" // Added import for React

export function FormStep2({ data, setData }: any) {
  const [frontImagePreview, setFrontImagePreview] = useState<string | null>(null)
  const [backImagePreview, setBackImagePreview] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const { toast } = useToast()

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>, type: "front" | "back") => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (type === "front") {
          setFrontImagePreview(e.target?.result as string)
        } else {
          setBackImagePreview(e.target?.result as string)
        }
      }
      reader.readAsDataURL(file)

      setData((prev: any) => ({
        ...prev,
        [`card${type === "front" ? "Front" : "Back"}Photo`]: file,
      }))

      setUploadProgress(0)
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            return 100
          }
          return prev + 10
        })
      }, 200)

      toast({
        title: "Image uploaded",
        description: `${type === "front" ? "Front" : "Back"} image uploaded successfully.`,
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="cardFront">Card Front Photo</Label>
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
              className="flex items-center justify-center w-full h-32 border-2 border-dashed rounded-md cursor-pointer hover:border-primary"
            >
              {frontImagePreview ? (
                <Image
                  src={frontImagePreview || "/placeholder.svg"}
                  alt="Card Front Preview"
                  width={100}
                  height={60}
                  className="rounded-md object-cover"
                />
              ) : (
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <span className="mt-2 block text-sm font-medium text-gray-900">Upload front image</span>
                </div>
              )}
            </Label>
          </div>
          {frontImagePreview && <Progress value={uploadProgress} className="mt-2" />}
        </div>
        <div className="space-y-2">
          <Label htmlFor="cardBack">Card Back Photo</Label>
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
              className="flex items-center justify-center w-full h-32 border-2 border-dashed rounded-md cursor-pointer hover:border-primary"
            >
              {backImagePreview ? (
                <Image
                  src={backImagePreview || "/placeholder.svg"}
                  alt="Card Back Preview"
                  width={100}
                  height={60}
                  className="rounded-md object-cover"
                />
              ) : (
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <span className="mt-2 block text-sm font-medium text-gray-900">Upload back image</span>
                </div>
              )}
            </Label>
          </div>
          {backImagePreview && <Progress value={uploadProgress} className="mt-2" />}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={data.description}
          onChange={(e) => setData({ ...data, description: e.target.value })}
          rows={4}
        />
      </div>
    </div>
  )
}

