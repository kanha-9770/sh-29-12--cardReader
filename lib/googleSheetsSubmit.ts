// // File: lib/googleSheetsSubmit.ts

// import { google } from "googleapis";

// const auth = new google.auth.GoogleAuth({
//   credentials: {
//     client_email: "app6-704@sheet-api-474608.iam.gserviceaccount.com",
//     private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDh838sQas5QXpu\niEdZro0hqNlBJAAl0l5WIyMB4yIkAJ6b4daVi9ywVrVHFXaHlv918PJi3B8JtdX+\nsVCFJU9oxUFyNatrbVbqIJ9Zj++m0LOdjWygYQiiqMGJ0y4uKzx3r3Vm484UAveZ\n2XBpvFxDr+n/3vQSv+1gR9oKrSamrlfZKXfcq2XUXA51qUm4/w0Ixt3JaRu0yN/U\nWA7xTYJJdnJeQZwZa060309AhqeaoRH4eFeWW9Mq/M23NIEoudoQuVFINGpWivU1\n2ZRJTfsCPyn/5eYoF9Jr35cuCY4croInDg5jIbtJoEkacIs5x5lNppIErdZ2qns1\nCsytPhFfAgMBAAECggEAASUsTFZK3rVBFcVVYz7PZ/pvRiAUwMb9A7/ALNbGCgZX\nch/QvXJM3Iyb9O/Gvtovkkf12orAvNpclXgNmex9/LXJ5qEfV3c257nhmjZwtwOQ\nyCglgvdARXQd2FZ8ge8Qf+TLmglmi9MWBoQZHe1pTviEcu+3hKQkuQZe3wtQn6tO\ncOBHyPYnpxu9s0MzOJGvTCVGkKcn90IlupK8Rk6PRsIfJ7x/SQhsLGvxFFnlrBi3\npbu4MKMa+amvGMHPVSuN4N38i/djtDMKnaYE7O6J2YA3ORJo64LpHdOhPR55hNBy\nFKMsNZ93LonbvYUxNHLoRWiwlnSwtDzvUTb6BgSMgQKBgQDxyDXOCOlLaj/ApdkA\n9jgvsxNeYAx3+feLwml7E5WdQfL/UpL1gSOJQZXDvbaUOGxPUhGyZHQMuWTPez77\nyD6fS2NC5Pe1H5Lw6qYreqm3tlco9ddW/22nsMixSwbs3GiSJoAYpElNloyJajt5\nSpoq+FRgOKZ5Ca7eJdyL6pjegQKBgQDvPPfHLyHWpaohn1YkM8GzdmZD/pQJyNwg\nxvHn98r4LiB7P1R2Zy5OwSrYOf/4KDthUsEiB6y67vdcDD9wU5hZqMvISl35OXom\ncYDOtJgZpgcLeprVGJxTAnIs2yOJAiGJ8wAkJRW4lR4RFyW9TkWqt75aBJbZLYzY\n7hIyHxK/3wKBgQC6jdduFRQk+2Mbexv4EQMDUvID5KpaPEYT0TrgGxla0FL1TDpW\nMYFA25j6AjyJGwv/G/zJn5anZrjxGlBbp4MiF+IL8G1slGMlfngenjOrq4aO9Tll\nSArM06vWmGRMiDgrZId7++8PbbUcJhqjmLthomBAKhXQ2HbTs3T7hFTVgQKBgQCT\nRO2mYL4s2wgy8FnfqTipF852NsW8jDftuWn6iNAaHJMEK4T76iJYepK8Tl/izClZ\njM60+xJ6dFYzBJscs2kKcF0Zq6XToG0wMxi+pe8ngsu9ZjjfyumYM95C/JcQZQ5u\nU/cXSPjpCmpazOv/b6p1H+z+juqpQF/+vfbXgcdR8wKBgQCWmEY8rDE5P+QG0lQa\ntxrH+CbW9HuhC5sjoDPL8JjHeXCmjCQ+VKkUDtcBMbSaZRLYBbq9yVlf+8NuEDv9\nPHKCB+yR8tJrNifLX9ZnAnPNmp67G9UCIBx+34w5AhJr/py8oNOuVNUTF9shh24L\n6fY7nh882MyCnIRtRyiT8dK8Pg==\n-----END PRIVATE KEY-----\n"},
//   scopes: ["https://www.googleapis.com/auth/spreadsheets"],
// });

// const sheets = google.sheets({ version: "v4", auth });
// const SPREADSHEET_ID = "1mO5zJLPNT9zLFWrZrYIixuZbK3SXHadVENW_ahjyxOE";

// async function appendToSheet(sheetName: string, data: any) {
//   try {
//     const headersResponse = await sheets.spreadsheets.values.get({
//       spreadsheetId: SPREADSHEET_ID,
//       range: `${sheetName}!1:1`,
//     });

//     const headers = Object.keys(data);

//     if (!headersResponse.data.values || headersResponse.data.values[0].length === 0) {
//       await sheets.spreadsheets.values.append({
//         spreadsheetId: SPREADSHEET_ID,
//         range: sheetName,
//         valueInputOption: "USER_ENTERED",
//         requestBody: {
//           values: [headers],
//         },
//       });
//       console.log(`Headers added to ${sheetName}.`);
//     }

//     const response = await sheets.spreadsheets.values.append({
//       spreadsheetId: SPREADSHEET_ID,
//       range: sheetName,
//       valueInputOption: "USER_ENTERED",
//       requestBody: {
//         values: [Object.values(data)],
//       },
//     });

//     if (response.data.updates) {
//       console.log(`${response.data.updates.updatedCells} cells appended to ${sheetName}.`);
//       return true;
//     } else {
//       console.log(`Data appended to ${sheetName}, but no update information received.`);
//       return true;
//     }
//   } catch (error) {
//     console.error(`Error appending to ${sheetName}:`, error);
//     return false;
//   }
// }

// export async function appendToGoogleSheet(formData: any, extractedData: any, mergedData: any) {
//   console.log("Preparing data for Google Sheets submission...");

//   const formSheetData = {
//     Card_No: formData.cardNo || "",
//     Sales_Person: formData.salesPerson || "",
//     Date: formData.date ? new Date(formData.date).toISOString().split("T")[0] : "",
//     Country: formData.country || "",
//     Card_Front_Photo: formData.cardFrontPhoto || "",
//     Card_Back_Photo: formData.cardBackPhoto || "",
//     Lead_Status: formData.leadStatus || "",
//     Deal_Status: formData.dealStatus || "",
//     Meeting_After_Exhibition: formData.meetingAfterExhibition ? "Yes" : "No",
//     Industry_Categories: formData.industryCategories || "",
//     Description: formData.description || "",
//   };

//   const extractedSheetData = {
//     Card_No: formData.cardNo || "",
//     Name: extractedData.name || "",
//     Company_Name: extractedData.companyName || "",
//     Website: extractedData.website || "",
//     Email: extractedData.email || "",
//     Address: extractedData.address || "",
//     Contact_Numbers: `\`${extractedData.contactNumbers}\`` || "",
//     State: extractedData.state || "",
//     City: extractedData.city || "",
//     Country: extractedData.country || "",
//     description:extractedData.description || ""
//   };

//   const mergedSheetData = {
//     Card_No: mergedData.cardNo || "",
//     Sales_Person: mergedData.salesPerson || "",
//     Date: mergedData.date ? new Date(mergedData.date).toISOString().split("T")[0] : "",
//     Country: mergedData.country || "",
//     Card_Front_Photo: mergedData.cardFrontPhoto || "",
//     Card_Back_Photo: mergedData.cardBackPhoto || "",
//     Lead_Status: mergedData.leadStatus || "",
//     Deal_Status: mergedData.dealStatus || "",
//     Meeting_After_Exhibition: mergedData.meetingAfterExhibition ? "Yes" : "No",
//     Industry_Categories: mergedData.industryCategories || "",
//     Description: mergedData.description || "",
//     Name: mergedData.name || "",
//     Company: mergedData.companyName || "",
//     Email: mergedData.email || "",
//     Mobile: mergedData.contactNumbers ? `\`${mergedData.contactNumbers.split(",")[0]}\`` : "",
//     Mobile_2: mergedData.contactNumbers ? `\`${mergedData.contactNumbers.split(",")[1] || ""}\`` : "",
//     Phone: mergedData.contactNumbers ? `\`${mergedData.contactNumbers.split(",")[2] || ""}\`` : "",
//     Address: mergedData.address || "",
//     State: mergedData.state || "",
//     City: mergedData.city || "",
//     Website: mergedData.website || "",
//     Extracted_Country: mergedData.extractedCountry || "",
//   };

//   console.log("Formatted data for Google Sheets:", {
//     formData: formSheetData,
//     extractedData: extractedSheetData,
//     mergedData: mergedSheetData,
//   });

//   const formSuccess = await appendToSheet("formData", formSheetData);
//   const extractedSuccess = await appendToSheet("extractedData", extractedSheetData);
//   const mergedSuccess = await appendToSheet("Sheet1", mergedSheetData);

//   return formSuccess && extractedSuccess && mergedSuccess;
// }




import { google } from "googleapis";

// Use environment variables (best practice & secure)
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: "app6-704@sheet-api-474608.iam.gserviceaccount.com",
    private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDh838sQas5QXpu\niEdZro0hqNlBJAAl0l5WIyMB4yIkAJ6b4daVi9ywVrVHFXaHlv918PJi3B8JtdX+\nsVCFJU9oxUFyNatrbVbqIJ9Zj++m0LOdjWygYQiiqMGJ0y4uKzx3r3Vm484UAveZ\n2XBpvFxDr+n/3vQSv+1gR9oKrSamrlfZKXfcq2XUXA51qUm4/w0Ixt3JaRu0yN/U\nWA7xTYJJdnJeQZwZa060309AhqeaoRH4eFeWW9Mq/M23NIEoudoQuVFINGpWivU1\n2ZRJTfsCPyn/5eYoF9Jr35cuCY4croInDg5jIbtJoEkacIs5x5lNppIErdZ2qns1\nCsytPhFfAgMBAAECggEAASUsTFZK3rVBFcVVYz7PZ/pvRiAUwMb9A7/ALNbGCgZX\nch/QvXJM3Iyb9O/Gvtovkkf12orAvNpclXgNmex9/LXJ5qEfV3c257nhmjZwtwOQ\nyCglgvdARXQd2FZ8ge8Qf+TLmglmi9MWBoQZHe1pTviEcu+3hKQkuQZe3wtQn6tO\ncOBHyPYnpxu9s0MzOJGvTCVGkKcn90IlupK8Rk6PRsIfJ7x/SQhsLGvxFFnlrBi3\npbu4MKMa+amvGMHPVSuN4N38i/djtDMKnaYE7O6J2YA3ORJo64LpHdOhPR55hNBy\nFKMsNZ93LonbvYUxNHLoRWiwlnSwtDzvUTb6BgSMgQKBgQDxyDXOCOlLaj/ApdkA\n9jgvsxNeYAx3+feLwml7E5WdQfL/UpL1gSOJQZXDvbaUOGxPUhGyZHQMuWTPez77\nyD6fS2NC5Pe1H5Lw6qYreqm3tlco9ddW/22nsMixSwbs3GiSJoAYpElNloyJajt5\nSpoq+FRgOKZ5Ca7eJdyL6pjegQKBgQDvPPfHLyHWpaohn1YkM8GzdmZD/pQJyNwg\nxvHn98r4LiB7P1R2Zy5OwSrYOf/4KDthUsEiB6y67vdcDD9wU5hZqMvISl35OXom\ncYDOtJgZpgcLeprVGJxTAnIs2yOJAiGJ8wAkJRW4lR4RFyW9TkWqt75aBJbZLYzY\n7hIyHxK/3wKBgQC6jdduFRQk+2Mbexv4EQMDUvID5KpaPEYT0TrgGxla0FL1TDpW\nMYFA25j6AjyJGwv/G/zJn5anZrjxGlBbp4MiF+IL8G1slGMlfngenjOrq4aO9Tll\nSArM06vWmGRMiDgrZId7++8PbbUcJhqjmLthomBAKhXQ2HbTs3T7hFTVgQKBgQCT\nRO2mYL4s2wgy8FnfqTipF852NsW8jDftuWn6iNAaHJMEK4T76iJYepK8Tl/izClZ\njM60+xJ6dFYzBJscs2kKcF0Zq6XToG0wMxi+pe8ngsu9ZjjfyumYM95C/JcQZQ5u\nU/cXSPjpCmpazOv/b6p1H+z+juqpQF/+vfbXgcdR8wKBgQCWmEY8rDE5P+QG0lQa\ntxrH+CbW9HuhC5sjoDPL8JjHeXCmjCQ+VKkUDtcBMbSaZRLYBbq9yVlf+8NuEDv9\nPHKCB+yR8tJrNifLX9ZnAnPNmp67G9UCIBx+34w5AhJr/py8oNOuVNUTF9shh24L\n6fY7nh882MyCnIRtRyiT8dK8Pg==\n-----END PRIVATE KEY-----\n",
  },
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });
const SPREADSHEET_ID = "1mO5zJLPNT9zLFWrZrYIixuZbK3SXHadVENW_ahjyxOE";

export async function appendToGoogleSheet(
  form: any,
  extractedData: any,
  mergedData: any
): Promise<boolean> {
  try {
    // ONE SINGLE CLEAN ROW — using mergedData (the final source of truth)
    const row = [
      new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }), // Indian timestamp
      mergedData.cardNo || "",
      mergedData.salesPerson || "",
      mergedData.date ? new Date(mergedData.date).toLocaleDateString("en-IN") : "",
      mergedData.name || "",
      mergedData.companyName || "",
      mergedData.email || "",
      extractedData.contactNumbers || "",
      mergedData.website || "",
      mergedData.address || "",
      extractedData.city || "",
      extractedData.state || "",
      extractedData.country || mergedData.extractedCountry || mergedData.country || "",
      mergedData.leadStatus || "",
      mergedData.meetingAfterExhibition ? "Yes" : "No",
      mergedData.industryCategories || "",
      mergedData.description || "",
      mergedData.cardFrontPhoto || "",
      mergedData.cardBackPhoto || "",
    ];

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: "Sheet1!A1", // Only one sheet
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values: [row],
      },
    });

    console.log("Successfully appended 1 clean row to Google Sheets");
    return true;
  } catch (error: any) {
    console.error("Google Sheets Error:", error.message || error);
    return false;
  }
}