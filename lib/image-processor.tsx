import { Client } from "basic-ftp"
import { Readable } from "stream"

const FTP_HOST = "217.21.82.234"
const FTP_USER = "u386199748.businesscard"
const FTP_PASSWORD = "Kafka@India1122"
const FTP_PORT = 21
const PUBLIC_URL = "https://businesscard.nesscoindustries.com/public_html"

export async function uploadFile(buffer: Buffer, filename: string): Promise<string> {
  const client = new Client()

  try {
    await client.access({
      host: FTP_HOST,
      user: FTP_USER,
      password: FTP_PASSWORD,
      port: FTP_PORT,
      secure: false,
    })

    const stream = Readable.from(buffer)
    await client.uploadFrom(stream, filename)

    return `${PUBLIC_URL}/${filename}`
  } finally {
    client.close()
  }
}

export async function processAndUploadImages(frontImage: File | null, backImage: File | null) {
  let frontImageBuffer: Buffer | null = null
  let backImageBuffer: Buffer | null = null
  let frontImageUrl: string | null = null
  let backImageUrl: string | null = null

  if (frontImage) {
    frontImageBuffer = Buffer.from(await frontImage.arrayBuffer())
  }

  if (backImage) {
    backImageBuffer = Buffer.from(await backImage.arrayBuffer())
  }

  // Upload images to FTP server
  if (frontImageBuffer) {
    const frontFilename = `front_${Date.now()}.jpg`
    frontImageUrl = await uploadFile(frontImageBuffer, frontFilename)
  }

  if (backImageBuffer) {
    const backFilename = `back_${Date.now()}.jpg`
    backImageUrl = await uploadFile(backImageBuffer, backFilename)
  }

  return {
    frontImageBuffer,
    backImageBuffer,
    frontImageUrl,
    backImageUrl,
  }
}

