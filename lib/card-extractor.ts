import { z } from "zod";
import { API_KEYS, GEMINI_2_API_URL, GEMINI_1_5_API_URL } from "./apiConfig";

const ExtractedDataSchema = z.object({
  name: z.string().nullable(),
  companyName: z.string().nullable(),
  website: z.string().nullable(),
  email: z.string().nullable(),
  address: z.string().nullable(),
  contactNumbers: z.string().nullable(),
  state: z.string().nullable(),
  country: z.string().nullable(),
  city: z.string().nullable(),
  description: z.string().nullable(),
});

type ExtractedData = z.infer<typeof ExtractedDataSchema>;

async function makeApiRequest(
  apiUrl: string,
  apiKey: string,
  data: any
): Promise<Response> {
  console.log(`Making API request to: ${apiUrl} (key ending in ...${apiKey.slice(-6)})`);
  
  const url = `${apiUrl}?key=${apiKey}`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  console.log(`Response status: ${response.status} ${response.statusText}`);

  if (!response.ok) {
    const errorText = await response.text().catch(() => "Unknown error");
    console.error(`API request failed with status ${response.status}: ${errorText}`);
    throw new Error(`API request failed: ${response.status} - ${errorText}`);
  }

  console.log("API request successful");
  return response;
}

async function tryApiKeys(
  apiKeys: string[],
  apiUrl: string,
  data: any
): Promise<Response> {
  console.log(`Trying ${apiKeys.length} API keys for ${apiUrl}`);
  const errors: Error[] = [];

  for (const apiKey of apiKeys) {
    console.log(`Attempting with API key ending in ...${apiKey.slice(-6)}`);
    try {
      const response = await makeApiRequest(apiUrl, apiKey, data);
      console.log(`Success with key ending in ...${apiKey.slice(-6)}`);
      return response;
    } catch (error: any) {
      console.error(`API key failed: ...${apiKey.slice(-6)}. Error: ${error.message}`);
      errors.push(error as Error);
    }
  }

  console.error("All API keys failed for this endpoint");
  throw new AggregateError(errors, "All API keys failed");
}

export async function extractCardDetails(
  frontImageUrl: string,
  backImageUrl: string | null
): Promise<ExtractedData> {
  console.log("extractCardDetails() called");
  console.log("Front image URL:", frontImageUrl);
  console.log("Back image URL:", backImageUrl || "none");

  try {
    console.log("Starting card detail extraction...");

    if (!frontImageUrl) {
      console.error("Front image URL is missing!");
      throw new Error("Front image URL is required");
    }

    console.log("Fetching and encoding front image...");
    const frontImageBase64 = await fetchAndEncodeImage(frontImageUrl);
    console.log(`Front image fetched and encoded (size: ${frontImageBase64.length} chars)`);

    let backImageBase64: string | null = null;
    if (backImageUrl) {
      console.log("Fetching and encoding back image...");
      backImageBase64 = await fetchAndEncodeImage(backImageUrl);
      console.log(`Back image fetched and encoded (size: ${backImageBase64.length} chars)`);
    } else {
      console.log("No back image provided");
    }

    console.log("Building prompt and request payload...");
    const prompt = `
      Analyze the provided front and back images of a business card. Extract the following information and format it into a JSON object according to these specifications:

      *   **Name:** The name of the individual.
      *   **Company:** The name of the company.
      *   **Mobile:** The primary contact number.
      *   **Mobile_2:** The second contact number (if present).
      *   **Phone:** A third contact number (if present).
      *   **Address:** The full street address.
      *   **City:** The city within the address.
      *   **State:** The state within the address.
      *   **Country:** The country within the address. Ensure the country name is spelled correctly and uses its full proper name. Correct any spelling errors.
      *   **Email:** The primary email address.
      *   **Secondary_Email:** A secondary email address (if present).
      *   **Website:** The company website.
      *   **description:** Any additional information that doesn't fit into the above categories, such as a fourth phone number, a second website, a third email, or any unidentifiable text. If no extra information is found, set this to an empty string. If the information is not clear, put in description.

      Follow these rules strictly:

      1.  Extract ALL text visible in the image. Do not omit any text.
      2.  Include ALL contact numbers found, populating \`Mobile\`, \`Mobile_2\`, and \`Phone\` accordingly.
      3.  Include ALL email addresses found, populating \`Email\` and \`Secondary_Email\` accordingly.
      4.  If a field is not found, set it to null.
      5.  Do not add any explanations or markdown. Return ONLY the JSON object.
     
      Output the information in a JSON object with the keys exactly as specified above.

      {
        "Name": null,
        "Company": null,
        "Mobile": null,
        "Mobile_2": null,
        "Phone": null,
        "Address": null,
        "State": null,
        "City": null,
        "Country": null,
        "Email": null,
        "Secondary_Email": null,
        "Website": null,
        "description": null
      }
    `;

    const data = {
      contents: [
        {
          parts: [
            { text: prompt },
            {
              inline_data: {
                mime_type: "image/jpeg",
                data: frontImageBase64,
              },
            },
          ],
        },
      ],
    };

    if (backImageBase64) {
      console.log("Adding back image to request payload");
      data.contents[0].parts.push({
        inline_data: {
          mime_type: "image/jpeg",
          data: backImageBase64,
        },
      });
    }

    console.log("Final request payload ready (contains front + back image:", !!backImageBase64, ")");

    let response: Response;

    console.log("Attempting Gemini 2.0 API...");
    try {
      response = await tryApiKeys(API_KEYS, GEMINI_2_API_URL, data);
      console.log("Gemini 2.0 request succeeded");
    } catch (error) {
      console.warn("Gemini 2.0 failed entirely. Falling back to Gemini 1.5...");
      try {
        response = await tryApiKeys(API_KEYS, GEMINI_1_5_API_URL, data);
        console.log("Gemini 1.5 request succeeded");
      } catch (fallbackError) {
        console.error("Both Gemini 2.0 and 1.5 failed");
        throw new Error("All API keys failed for both Gemini 2.0 and 1.5");
      }
    }

    console.log("Parsing API response...");
    const result = await response.json();
    console.log("Raw API Response:", JSON.stringify(result, null, 2));

    if (!result.candidates?.[0]?.content?.parts?.[0]?.text) {
      console.error("Invalid or empty response from Gemini:", JSON.stringify(result, null, 2));
      throw new Error("Invalid API response structure - no text in candidates");
    }

    const extractedText = result.candidates[0].content.parts[0].text;
    console.log("Extracted text from Gemini:", extractedText);

    const jsonStartIndex = extractedText.indexOf("{");
    const jsonEndIndex = extractedText.lastIndexOf("}") + 1;

    if (jsonStartIndex === -1 || jsonEndIndex === 0) {
      console.error("Could not find JSON object in response");
      throw new Error("No valid JSON found in Gemini response");
    }

    const jsonString = extractedText.slice(jsonStartIndex, jsonEndIndex);
    console.log("Extracted JSON string:", jsonString);

    let extractedData: any;
    try {
      extractedData = JSON.parse(jsonString);
      console.log("Successfully parsed JSON:", extractedData);
    } catch (parseError) {
      console.error("Failed to parse JSON from Gemini response:", parseError);
      throw new Error("Invalid JSON returned by Gemini");
    }

    console.log("Mapping extracted data to final schema...");
    const mappedData = {
      name: extractedData.Name || extractedData.name || null,
      companyName: extractedData.Company || extractedData.companyName || null,
      website: extractedData.Website || extractedData.website || null,
      email: extractedData.Email || extractedData.email || null,
      address: extractedData.Address || extractedData.address || null,
      contactNumbers: [
        extractedData.Mobile,
        extractedData.Mobile_2,
        extractedData.Phone,
        extractedData.mobile,
        extractedData.mobile_2,
        extractedData.phone,
      ]
        .filter(Boolean)
        .join(", ") || null,
      state: extractedData.State || extractedData.state || null,
      country: extractedData.Country || extractedData.country || null,
      city: extractedData.City || extractedData.city || null,
      description: extractedData.description || null,
    };

    console.log("Final mapped data before validation:", mappedData);

    const validatedData = ExtractedDataSchema.parse(mappedData);
    console.log("Zod validation passed. Returning result.");
    return validatedData;
  } catch (error) {
    console.error("extractCardDetails failed with error:", error);
    console.error("Stack trace:", error instanceof Error ? error.stack : "No stack");

    return {
      name: null,
      companyName: null,
      website: null,
      email: null,
      address: null,
      contactNumbers: null,
      state: null,
      country: null,
      city: null,
      description: null,
    };
  }
}

async function fetchAndEncodeImage(url: string): Promise<string> {
  console.log(`Fetching image from URL: ${url}`);
  const response = await fetch(url);

  if (!response.ok) {
    console.error(`Failed to fetch image. Status: ${response.status} ${response.statusText}`);
    throw new Error(`Failed to fetch image: ${response.statusText}`);
  }

  console.log("Image fetched successfully, converting to base64...");
  const arrayBuffer = await response.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");
  console.log(`Image converted to base64 (length: ${base64.length} chars)`);
  return base64;
}