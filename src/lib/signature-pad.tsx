"use client"

import { useRef, useState } from "react"
import SignatureCanvas from "react-signature-canvas"
import { Button } from "@/src/shared/components/ui/button"
import { Trash2 } from "lucide-react"
import type { SignatureCanvas as SignatureCanvasType } from "react-signature-canvas"

interface SignaturePadProps {
  onSignatureChange?: (dataUrl: string | null) => void
}

export function SignaturePad({ onSignatureChange }: SignaturePadProps) {
  const signaturePadRef = useRef<SignatureCanvasType | null>(null)
  const [isEmpty, setIsEmpty] = useState(true)

  const handleEndStroke = () => {
    if (signaturePadRef.current && !signaturePadRef.current.isEmpty()) {
      setIsEmpty(false)
      const dataUrl = signaturePadRef.current.toDataURL("image/png")
      onSignatureChange?.(dataUrl)
    }
  }

  const handleClear = () => {
    signaturePadRef.current?.clear()
    setIsEmpty(true)
    onSignatureChange?.(null)
  }

  return (
    <div className="w-full space-y-3">
      <div className="border-2 border-gray-300 rounded-lg overflow-hidden bg-white">
        <SignatureCanvas
          ref={signaturePadRef}
          canvasProps={{
            className: "w-full",
            width: 600,
            height: 200,
          }}
          onEnd={handleEndStroke}
          penColor="#000"
          backgroundColor="transparent"
        />
      </div>

      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleClear}
          className="hover:cursor-pointer bg-transparent"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Limpiar Firma
        </Button>
        <p className="text-xs text-gray-500">{isEmpty ? "Dibuja tu firma arriba" : "✓ Firma capturada"}</p>
      </div>
    </div>
  )
}
