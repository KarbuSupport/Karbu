import QRCode from "qrcode"
import { nanoid } from "nanoid"

/**
 * Genera un identificador único y su QR correspondiente.
 * @param baseUrl URL base que recibirá el ID (por ejemplo, "https://miapp.com/scan")
 * @returns { id, qrBase64 }
 */
export async function generateQrWithId(typeQR: string) {
  try {
    // 1️⃣ Generar ID único
    const id = nanoid(12) // Ejemplo: "J4ewr465n-hyg5"

    // 2️⃣ Crear URL completa con el identificador
    const qrId = `${typeQR}-${id}`

    // 3️⃣ Retornar ID 
    return { qrId }
  } catch (error) {
    console.error("Error generando QR:", error)
    throw new Error("No se pudo generar el código QR")
  }
}

export async function generateQrImg(qrId: string) {
  try {
    // Generar QR en base64 (para insertar en PDF)
    const qrBase64 = await QRCode.toDataURL(qrId, {
      type: "image/png",
      errorCorrectionLevel: "H",
      margin: 1,
      scale: 6,
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
    })

    return { qrBase64, qrId };
  } catch (error) {
    console.error("Error generando QR:", error)
    throw new Error("No se pudo generar el código QR")
  }
}