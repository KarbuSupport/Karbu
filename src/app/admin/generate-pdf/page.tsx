// "use client"

// import { useState } from "react"
// import { generateQrWithId } from "@/src/lib/generateQr"

// export default function QrTestPage() {
//   const [qr, setQr] = useState<string | null>(null)
//   const [loading, setLoading] = useState(false)

//   const handleGenerate = async () => {
//     setLoading(true)
//     const { id, qrBase64 } = await generateQrWithId("https://wdcvxmzq-3000.usw3.devtunnels.ms/admin/generate-pdf")
//     console.log("🆔 ID generado:", id)
//     setQr(qrBase64)
//     setLoading(false)
//   }

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen space-y-6">
//       <button
//         onClick={handleGenerate}
//         className="px-4 py-2 bg-blue-600 text-white rounded-lg"
//       >
//         {loading ? "Generando..." : "Generar QR"}
//       </button>

//       {qr && (
//         <>
//           <img src={qr} alt="QR generado" className="border rounded-md p-2" />
//           <p className="text-sm text-gray-500">Escanea el QR o revisa la consola</p>
//         </>
//       )}
//     </div>
//   )
// }
