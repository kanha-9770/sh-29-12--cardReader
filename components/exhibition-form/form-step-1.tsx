import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { salesPersons } from "@/types/form"

export function FormStep1({ data, setData }: any) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="cardNo">Card No.</Label>
        <Input id="cardNo" value={data.cardNo} onChange={(e) => setData({ ...data, cardNo: e.target.value })} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="salesPerson">Met with NESSCO Sales Person</Label>
        <Select value={data.salesPerson} onValueChange={(value) => setData({ ...data, salesPerson: value })}>
          <SelectTrigger>
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

      <div className="space-y-2">
        <Label htmlFor="date">Date</Label>
        <Input id="date" type="date" value={data.date} onChange={(e) => setData({ ...data, date: e.target.value })} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="country">Country</Label>
        <Input id="country" value={data.country} onChange={(e) => setData({ ...data, country: e.target.value })} />
      </div>
    </div>
  )
}

