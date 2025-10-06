import { NextResponse } from "next/server";
import { uploadToHostinger } from "@/lib/hostinger-upload";

export async function POST(req: Request) {
  console.log("[API] Received upload request");
  try {
    const formData = await req.formData();
    const image = formData.get("image") as File;
    const type = formData.get("type") as string;

    if (!image) {
      console.warn("[API] No image provided");
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }
    console.log("[API] Image details:", { name: image.name, type: image.type, size: image.size });
    const arrayBuffer = await image.arrayBuffer();
    if (arrayBuffer.byteLength === 0) {
      console.error("[API] Empty array buffer");
      return NextResponse.json({ error: "Empty image data" }, { status: 400 });
    }

    const buffer = Buffer.from(arrayBuffer);
    console.log("[API] Buffer size:", buffer.length);
    const filename = `${type}_${Date.now()}_${image.name}`;
    const imageUrl = await uploadToHostinger(buffer, filename);
    console.log("[API] Upload successful:", imageUrl);

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error("[API] Upload error:", error);
    return NextResponse.json(
      {
        error: "Failed to upload image",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// import { NextResponse } from "next/server";
// import { uploadToHostinger } from "@/lib/hostinger-upload";

// export async function POST(req: Request) {
//   console.log("[API] Received upload request");

//   try {
//     const formData = await req.formData();
//     const image = formData.get("image") as File;
//     const type = (formData.get("type") as string) || "image";

//     if (!image) {
//       console.warn("[API] No image provided");
//       return NextResponse.json({ error: "No image provided" }, { status: 400 });
//     }

//     // Ensure the file has a valid name and type (fix for camera uploads)
//     let filename = image.name || `camera_image_${Date.now()}.jpg`;
//     let mimeType = image.type || "image/jpeg";

//     console.log("[API] Image details:", {
//       name: filename,
//       type: mimeType,
//       size: image.size,
//     });

//     const arrayBuffer = await image.arrayBuffer();
//     if (arrayBuffer.byteLength === 0) {
//       console.error("[API] Empty array buffer");
//       return NextResponse.json({ error: "Empty image data" }, { status: 400 });
//     }

//     const buffer = Buffer.from(arrayBuffer);
//     console.log("[API] Buffer size:", buffer.length);

//     // Generate final filename with type prefix
//     const finalFilename = `${type}_${Date.now()}_${filename}`;

//     // Upload to Hostinger
//     const imageUrl = await uploadToHostinger(buffer, finalFilename);
//     console.log("[API] Upload successful:", imageUrl);

//     return NextResponse.json({ imageUrl });
//   } catch (error) {
//     console.error("[API] Upload error:", error);
//     return NextResponse.json(
//       {
//         error: "Failed to upload image",
//         details: error instanceof Error ? error.message : "Unknown error",
//       },
//       { status: 500 }
//     );
//   }
// }
