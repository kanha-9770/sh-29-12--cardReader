export interface FormData {
  createdAt: any;
  updatedAt: any;
  userId: any;
  user: any;
  id?: string;
  cardNo: string;
  salesPerson: string;
  date: string;
  country: string;
  cardFrontPhoto?: string;
  cardBackPhoto?: string;
  leadStatus: string;
  dealStatus: string;
  meetingAfterExhibition: boolean;
  industryCategories: string;
  description: string;
  extractedData?: any;
  mergedData?: any;
  status?: string;
  extractionStatus?: string;
  zohoStatus?: string;
  stitchedImage?: string;
}

export const salesPersons = [
  "Bhavishya Central Sales 3",
  "Daniel Chase",
  "David Fadel",
  "Manish South Sales 1",
  "Marketing Team",
  "Mohit Saraswat West Sales 1",
  "Peter Jones",
  "Rajat Nessco Sales 1",
  "Rakesh West Sales",
  "Sanjay",
  "Service Team",
  "Shubham Khandelwal Central Sales",
  "Yogesh",
  "Harshit",
];

export const leadStatuses = [
  "JUST LEAD",
  "QUALIFIED LEAD",
  "NEW DEAL",
  "OLD DEAL",
  "EXISTING CUSTOMER",
];

export const dealStatuses = ["SUPER HOT", "HOT", "WARM", "COLD"];

export const industryCategories = [
  "Having PCM",
  "OFFSET PRINTER",
  "Having Paper Bag Machine",
  "Having Salad Bowl Machine",
  "Having Paper Straw Machine",
  "Having PaperLidMachine",
  "Having Soup Bowl Machine",
  "Paper Container Manufacturer",
  "Disposable Traders",
  "Machine Trader",
  "PP Manufacturer",
  "Paper Plate Manufacturer",
  "CUP RAW MATERIAL",
  "Tissue Manufacturer",
  "Sugarcane Bagasse Manufacturers",
  "Spare Parts",
  "Related Industries",
  "OTHER",
  "I Don't Know",
];
