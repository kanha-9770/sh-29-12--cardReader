// extractCardDetails.ts
import { z } from "zod";
import { API_KEYS, GEMINI_2_API_URL, GEMINI_1_5_API_URL } from "./apiConfig";

// Polyfill Buffer for Vercel / Serverless / Workers
import { Buffer } from "buffer";

// Zod schema
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

// Safe fetch + base64 encoder (works everywhere in 2025)
async function fetchAndEncodeImage(url: string): Promise<string> {
  console.log(`[Image] Fetching → ${url}`);

  const response = await fetch(url);

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    console.error(`[Image] Failed → ${response.status} ${response.statusText} | ${text}`);
    throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
  }

  console.log(`[Image] Downloaded → ${response.headers.get("content-length") || "?"} bytes`);
  const arrayBuffer = await response.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");

  console.log(`[Image] Encoded → ${base64.length.toLocaleString()} chars`);
  return base64;
}

async function makeApiRequest(
  apiUrl: string,
  apiKey: string,
  data: any
): Promise<Response> {
  const keySuffix = apiKey.slice(-6);
  console.log(`[API] POST → ${apiUrl}?key=...${keySuffix}`);

  const url = `${apiUrl}?key=${apiKey}`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  console.log(`[API] Response → ${response.status} ${response.statusText}`);

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "");
    console.error(`[API] Failed → ${response.status} | ${errorBody}`);
    throw new Error(`API request failed: ${response.status}`);
  }

  console.log(`[API] Success with key ...${keySuffix}`);
  return response;
}

async function tryApiKeys(
  apiKeys: string[],
  apiUrl: string,
  data: any
): Promise<Response> {
  console.log(`[API] Trying ${apiKeys.length} keys on ${apiUrl.split("/").pop()}`);

  const errors: Error[] = [];
  for (const key of apiKeys) {
    try {
      return await makeApiRequest(apiUrl, key, data);
    } catch (err: any) {
      console.warn(`[API] Key failed → ...${key.slice(-6)} | ${err.message}`);
      errors.push(err);
    }
  }

  throw new AggregateError(errors, "All API keys failed");
}

export async function extractCardDetails(
  frontImageUrl: string,
  backImageUrl: string | null = null
): Promise<ExtractedData> {
  console.log("extractCardDetails() called");
  console.log("Front URL:", frontImageUrl);
  console.log("Back URL:", backImageUrl || "none");

  try {
    if (!frontImageUrl) throw new Error("Front image URL is required");

    // Fetch and encode images
    console.log("Fetching front image...");
    const frontImageBase64 = await fetchAndEncodeImage(frontImageUrl);

    let backImageBase64: string | null = null;
    if (backImageUrl) {
      console.log("Fetching back image...");
      backImageBase64 = await fetchAndEncodeImage(backImageUrl);
    } else {
      console.log("No back image provided");
    }

    // Build prompt
    const prompt = `You are an expert at reading business cards. Extract ALL visible text and return ONLY a valid JSON object with these exact keys (case-sensitive). Use null if missing.

{
  "Name": "John Doe",
  "Company": "ABC Corp",
  "Mobile": "+1 234-567-8900",
  "Mobile_2": null,
  "Phone": null,
  "Address": "123 Main St, Suite 100",
  "City": "New York",
  "State": "NY",
  "Country": "United States",
  "Email": "john@abc.com",
  "Secondary_Email": null,
  "Website": "www.abc.com",
  "description": ""
}

Rules:
- Fix spelling of Country (e.g. "USA" → "United States")
- Put extra phone/email/website in "description" if more than allowed
- Never add explanations or markdown
- Return only the JSON`;

    const payload: any = {
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
      console.log("Adding back image to payload");
      payload.contents[0].parts.push({
        inline_data: { mime_type: "image/jpeg", data: backImageBase64 },
      });
    }

    console.log("Payload ready → sending to Gemini...");

    // Try Gemini 2.0 → fallback to 1.5
    let response: Response;
    try {
      response = await tryApiKeys(API_KEYS, GEMINI_2_API_URL, payload);
      console.log("Gemini 2.0 succeeded");
    } catch {
      console.warn("Gemini 2.0 failed → trying 1.5");
      response = await tryApiKeys(API_KEYS, GEMINI_1_5_API_URL, payload);
      console.log("Gemini 1.5 succeeded");
    }

    const result = await response.json();
    console.log("Raw Gemini response:", JSON.stringify(result, null, 2));

    const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error("No text returned from Gemini");

    console.log("Gemini text output:", text.trim());

    // Extract JSON block
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found in Gemini response");

    const jsonString = jsonMatch[0];
    console.log("Extracted JSON:", jsonString);

    const rawData = JSON.parse(jsonString);
    console.log("Parsed data:", rawData);

    // Map to our schema
    const mappedData = {
      name: rawData.Name || rawData.name || null,
      companyName: rawData.Company || rawData.companyName || null,
      website: rawData.Website || rawData.website || null,
      email: rawData.Email || rawData.email || null,
      address: rawData.Address || rawData.address || null,
      contactNumbers: [
        rawData.Mobile,
        rawData.Mobile_2,
        rawData.Phone,
        rawData.mobile,
        rawData.mobile_2,
        rawData.phone,
      ]
        .filter(Boolean)
        .join(", ") || null,
      state: rawData.State || rawData.state || null,
      country: rawData.Country || rawData.country || null,
      city: rawData.City || rawData.city || null,
      description: rawData.description || null,
    };

    console.log("Final mapped data:", mappedData);

    const validated = ExtractedDataSchema.parse(mappedData);
    console.log("Zod validation passed → returning result");
    return validated;
  } catch (error: any) {
    console.error("extractCardDetails FAILED:", error.message);
    console.error("Stack:", error.stack);

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