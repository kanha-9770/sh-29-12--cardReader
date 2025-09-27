import axios from "axios"

const ZOHO_API_URL = process.env.ZOHO_API_URL

if (!ZOHO_API_URL) {
  console.error("ZOHO_API_URL environment variable is not set!")
}

export async function submitToZoho(mergedData: any) {
  console.log("Preparing data for Zoho submission...")

  try {
    // Format data for Zoho
    const zohoData = {
      Card_No: mergedData.cardNo || null,
      Sales_Person: mergedData.salesPerson || null,
      Date: mergedData.date ? new Date(mergedData.date).toISOString() : null,
      Country: mergedData.country || null,
      Card_Front_Photo: mergedData.cardFrontPhoto || null,
      Card_Back_Photo: mergedData.cardBackPhoto || null,
      Lead_Status: mergedData.leadStatus || null,
      Deal_Status: mergedData.dealStatus || null,
      Meeting_After_Exhibition: mergedData.meetingAfterExhibition ? "Yes" : "No",
      Industry_Categories: mergedData.industryCategories || null,
      Description: mergedData.description || null,
      Last_Name: mergedData.name || mergedData.cardNo || null,
      Company: mergedData.companyName || "No Company",
      Mobile: mergedData.contactNumbers ? mergedData.contactNumbers.split(",")[0] : null,
      Mobile_2: mergedData.contactNumbers ? mergedData.contactNumbers.split(",")[1] : null,
      Phone: mergedData.contactNumbers ? mergedData.contactNumbers.split(",")[2] : null,
      Address: mergedData.address || "No Address Provided",
      State: mergedData.state || null,
      Email: mergedData.email || null,
      Website: mergedData.website || "No Website Provided",
      Extracted_Country: mergedData.extractedCountry || null,
    }

    console.log("Sending data to Zoho:", JSON.stringify(zohoData, null, 2))

    if (!ZOHO_API_URL) {
      throw new Error("ZOHO_API_URL is not configured")
    }

    const response = await axios.post(
      ZOHO_API_URL,
      {
        business_cards: [zohoData],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 10000, // 10 second timeout
      },
    )

    console.log("Zoho API Response:", response.data)
    if (response.data.error) {
      throw new Error(`Zoho API Error: ${response.data.error}`)
    }

    return response.data
  } catch (error) {
    console.error("Error submitting to Zoho:", error)

    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error("Zoho API Error Response:", error.response.data)
        throw new Error(`Zoho API Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`)
      } else if (error.request) {
        throw new Error("No response received from Zoho API")
      } else {
        throw new Error(`Error setting up Zoho request: ${error.message}`)
      }
    }

    throw error
  }
}

