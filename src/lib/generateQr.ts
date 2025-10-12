import QRCode from "qrcode"
import { nanoid } from "nanoid"

/**
 * Genera un identificador único y su QR correspondiente.
 * @param baseUrl URL base que recibirá el ID (por ejemplo, "https://miapp.com/scan")
 * @returns { id, qrBase64 }
 */
export async function generateQrWithId(baseUrl: string) {
  try {
    // 1️⃣ Generar ID único
    const id = nanoid(12) // Ejemplo: "J4ewr465n-hyg5"

    // 2️⃣ Crear URL completa con el identificador
    const qrUrl = `${baseUrl}?id=${id}`

    // 3️⃣ Generar QR en base64 (para insertar en PDF)
    const qrBase64 = await QRCode.toDataURL(qrUrl, {
      errorCorrectionLevel: "H",
      margin: 1,
      scale: 6,
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
    })

    // 4️⃣ Retornar ID + imagen
    return { id, qrBase64 }
  } catch (error) {
    console.error("Error generando QR:", error)
    throw new Error("No se pudo generar el código QR")
  }
}
