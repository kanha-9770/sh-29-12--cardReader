// File: lib/googleSheetsSubmit.ts

import { google } from "googleapis";

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: "admin-site@isadmin-447207.iam.gserviceaccount.com",
    private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCcEcMeGbJi5EXJ\nfNY1hjTy9hXMwvgUDZdR/NHgpSw1M8rJdvruO62bToktU6OO+z2vOWg95dhmUzM/\n72A0/zvdMd+9vTl0JastuRtSsNUEaW4jULdj7Sv++Ibe0ReHlfeqyR4xRmmcIzrY\nF1uD7cT0Ae6QASf2vf8vObU20wKZBTCbGqvZhpKCOKIxp4PSRynkntZhd2rsYQKv\naTqlhXbHyvWAT5TRfwsYTIEHc34B7fWsWeXiDGxvM97UzaLhSRD7A8RzNUir1531\nWlX7WcY//bvz9gxXY9zM3EKURH/dBOt7J9kvzLEXfJoVrV+xu/QLdI/F4Sm6I/zw\nlmkO6V0LAgMBAAECggEAQoRfgMi6+uMHy2Rld9KHZrXzfJ3sVb+lKtByMyiyusok\nN9F6CWduCq9iT+tB3oK+O5xgDWGU5ae4RBumCXBu90t2bMvlXNdhKc+nEYtEfujg\nhDS2tOQ0yCrscLL1MFh+gk/NinrUMDPjtI3f906zjrv0DXQwsD0yMdKKpZ8xkD23\nG4Wyu3R82esctGD0GdWA71j6m5hJLSBnNmec7U6XEgNVvtXrQqw7t0bryhdmGOIC\nVX7pnQs/uGxvtSvxv6Vu/L4/oS8iXnQqj1RVpLVJrLVyiPvTZntdM431Zy3+cU9D\nshxQWfYm5Skq0AM/3JuwzHF4wPFy7Gt1MTfSD+2/YQKBgQDYR32lNcEpzVM5Ffun\nlP9k6zzLgVljhw8H2C0eQQ44E7j6oL4PNxj+CK7EaQYhg09x79acly3MK7hr3eLF\nUwacUYA/Z5rnA19+IwtxAjSF3EGwLexW+0UHguOEHWsIEcnkOY718Kzl+bhqD7C+\nssL1hz+XHR1ft5YTqdmsuUgN/QKBgQC4u3cPy1W9ClC6dlqnKog61GlksDZT5KoJ\nAKwBN/bkqOdF0vXXpNCZ4NmTQa8EuhTcmxqONuseyCetwM9OgqVOCetgGMaGVzTX\n0zK682ZNT/uMgLpfJmM1M9+DSKmvOxpIBc3NhdG8RmwXvkv2mXbDayWi42a+/qWB\ne/7gtDdBpwKBgQCQYGECuXiiFBvbPs6Il1FKKDKkU0u9wfoJrYio6pq4WoogXM+j\nTo+TfW5VVRqvon2VPJrSW6VJ52GsOCnaucru7QUkzl+8mSbVCEXqAaPYPClpl65u\nfjwdgIWquwypDV7tyHKjwS9aMjKmMqU1GBZHWyrbEKd8LwyzQa46vFDabQKBgC2e\nXbCQzgN44KarQ4e0gR/GBKDQwxnEhhjjCZbjcxzUeQhNKFiwYrMdS52Jwuav7Sbt\nRomIFlfrpaDK1GbW7GtxF6cLdzsFng8OIKD6KnE9JylzQJLur+Ebhj6tWvni5oKS\nrFfsi/aqjVbvr2KeUy2+7/Rho6XWzJhFPpPO7TZRAoGAelPATck2GE32Je4BxjGP\n8D/6LStqODdg4ReA4DZRee0SVhX3FvLZtGMxYBe4UsrwsKywxcM0x95qm2BblEYc\nwnxgo1nmOFzNiGjsZmni7GYlR9KYagL5iVA9iwEdUiqjkK0OfLzkMc/0EAIecyzs\nr7bYFyfmzMzARQnrbB6uHfA=\n-----END PRIVATE KEY-----\n",
  },
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });
const SPREADSHEET_ID = "1LEMjhySSsL6U1425CMcrcCKpbl3tGVQnpagsfgjIxbw";

async function appendToSheet(sheetName: string, data: any) {
  try {
    const headersResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!1:1`,
    });

    const headers = Object.keys(data);

    if (!headersResponse.data.values || headersResponse.data.values[0].length === 0) {
      await sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: sheetName,
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [headers],
        },
      });
      console.log(`Headers added to ${sheetName}.`);
    }

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: sheetName,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [Object.values(data)],
      },
    });

    if (response.data.updates) {
      console.log(`${response.data.updates.updatedCells} cells appended to ${sheetName}.`);
      return true;
    } else {
      console.log(`Data appended to ${sheetName}, but no update information received.`);
      return true;
    }
  } catch (error) {
    console.error(`Error appending to ${sheetName}:`, error);
    return false;
  }
}

export async function appendToGoogleSheet(formData: any, extractedData: any, mergedData: any) {
  console.log("Preparing data for Google Sheets submission...");

  const formSheetData = {
    Card_No: formData.cardNo || "",
    Sales_Person: formData.salesPerson || "",
    Date: formData.date ? new Date(formData.date).toISOString().split("T")[0] : "",
    Country: formData.country || "",
    Card_Front_Photo: formData.cardFrontPhoto || "",
    Card_Back_Photo: formData.cardBackPhoto || "",
    Lead_Status: formData.leadStatus || "",
    Deal_Status: formData.dealStatus || "",
    Meeting_After_Exhibition: formData.meetingAfterExhibition ? "Yes" : "No",
    Industry_Categories: formData.industryCategories || "",
    Description: formData.description || "",
  };

  const extractedSheetData = {
    Card_No: formData.cardNo || "",
    Name: extractedData.name || "",
    Company_Name: extractedData.companyName || "",
    Website: extractedData.website || "",
    Email: extractedData.email || "",
    Address: extractedData.address || "",
    Contact_Numbers: `\`${extractedData.contactNumbers}\`` || "",
    State: extractedData.state || "",
    Country: extractedData.country || "",
    description:extractedData.description || ""
  };

  const mergedSheetData = {
    Card_No: mergedData.cardNo || "",
    Sales_Person: mergedData.salesPerson || "",
    Date: mergedData.date ? new Date(mergedData.date).toISOString().split("T")[0] : "",
    Country: mergedData.country || "",
    Card_Front_Photo: mergedData.cardFrontPhoto || "",
    Card_Back_Photo: mergedData.cardBackPhoto || "",
    Lead_Status: mergedData.leadStatus || "",
    Deal_Status: mergedData.dealStatus || "",
    Meeting_After_Exhibition: mergedData.meetingAfterExhibition ? "Yes" : "No",
    Industry_Categories: mergedData.industryCategories || "",
    Description: mergedData.description || "",
    Name: mergedData.name || "",
    Company: mergedData.companyName || "",
    Email: mergedData.email || "",
    Mobile: mergedData.contactNumbers ? `\`${mergedData.contactNumbers.split(",")[0]}\`` : "",
    Mobile_2: mergedData.contactNumbers ? `\`${mergedData.contactNumbers.split(",")[1] || ""}\`` : "",
    Phone: mergedData.contactNumbers ? `\`${mergedData.contactNumbers.split(",")[2] || ""}\`` : "",
    Address: mergedData.address || "",
    State: mergedData.state || "",
    Website: mergedData.website || "",
    Extracted_Country: mergedData.extractedCountry || "",
  };

  console.log("Formatted data for Google Sheets:", {
    formData: formSheetData,
    extractedData: extractedSheetData,
    mergedData: mergedSheetData,
  });

  const formSuccess = await appendToSheet("formData", formSheetData);
  const extractedSuccess = await appendToSheet("extractedData", extractedSheetData);
  const mergedSuccess = await appendToSheet("Sheet1", mergedSheetData);

  return formSuccess && extractedSuccess && mergedSuccess;
}