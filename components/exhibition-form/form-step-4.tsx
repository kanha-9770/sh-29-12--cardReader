import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { leadStatuses, dealStatuses, industryCategories } from "@/types/form"

export function FormStep4({ data, setData }: any) {
  const selectedCategories = data.industryCategories.split(",").filter(Boolean)

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="leadStatus">Lead Status</Label>
          <Select value={data.leadStatus} onValueChange={(value) => setData({ ...data, leadStatus: value })}>
            <SelectTrigger>
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
          <Label htmlFor="dealStatus">Deal Status</Label>
          <Select value={data.dealStatus} onValueChange={(value) => setData({ ...data, dealStatus: value })}>
            <SelectTrigger>
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

        <div className="flex items-center space-x-2">
          <Switch
            id="meeting"
            checked={data.meetingAfterExhibition}
            onCheckedChange={(checked) => setData({ ...data, meetingAfterExhibition: checked })}
          />
          <Label htmlFor="meeting">Meeting After Exhibition</Label>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Industry Category</h3>
        <div className="grid gap-4">
          {industryCategories.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={category}
                checked={selectedCategories.includes(category)}
                onCheckedChange={(checked) => {
                  const updatedCategories = checked
                    ? [...selectedCategories, category]
                    : selectedCategories.filter((c: string) => c !== category)
                  setData({
                    ...data,
                    industryCategories: updatedCategories.join(","),
                  })
                }}
              />
              <Label htmlFor={category}>{category}</Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

