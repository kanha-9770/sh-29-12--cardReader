import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export function FormStep3({ data, setData }: any) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Extracted Data</h3>
      {data.extractedData ? (
        <>
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={data.extractedData.name || ""}
              onChange={(e) =>
                setData({
                  ...data,
                  extractedData: { ...data.extractedData, name: e.target.value },
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              value={data.extractedData.company_name || ""}
              onChange={(e) =>
                setData({
                  ...data,
                  extractedData: { ...data.extractedData, company_name: e.target.value },
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={
                Array.isArray(data.extractedData.email) ? data.extractedData.email[0] : data.extractedData.email || ""
              }
              onChange={(e) =>
                setData({
                  ...data,
                  extractedData: { ...data.extractedData, email: e.target.value },
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={
                Array.isArray(data.extractedData.contact_numbers)
                  ? data.extractedData.contact_numbers[0]
                  : data.extractedData.contact_numbers || ""
              }
              onChange={(e) =>
                setData({
                  ...data,
                  extractedData: { ...data.extractedData, contact_numbers: [e.target.value] },
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={data.extractedData.address || ""}
              onChange={(e) =>
                setData({
                  ...data,
                  extractedData: { ...data.extractedData, address: e.target.value },
                })
              }
            />
          </div>
        </>
      ) : (
        <p>No data extracted. Please upload images in the previous step.</p>
      )}
    </div>
  )
}

