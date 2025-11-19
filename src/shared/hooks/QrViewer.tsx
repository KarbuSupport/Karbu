import { generateQrImg } from "@/src/lib/generateQr"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"

export function QrViewer({ qrId }: { qrId: string }) {
  const [qrImg, setQrImg] = useState<string | null>(null)

  useEffect(() => {
    async function loadQr() {
      const { qrBase64 } = await generateQrImg(qrId)
      setQrImg(qrBase64)
    }
    loadQr()
  }, [qrId])

  return (
    <>
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Código QR</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col items-center justify-center">
        {qrImg ? (
          <img src={qrImg} alt="QR" className="w-40 h-40 rounded-lg" />
        ) : (
          <p>Cargando QR...</p>
        )}

        <p className="font-mono text-xs text-muted-foreground mt-3 break-all text-center">
          {qrId}
        </p>
      </CardContent>
    </Card>
    </>
  )
}

