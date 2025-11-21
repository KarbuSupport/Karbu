"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/src/shared/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/shared/components/ui/card"
import { Input } from "@/src/shared/components/ui/input"
import { Label } from "@/src/shared/components/ui/label"
import { Search, QrCode, XCircle, Loader2 } from "lucide-react"
import ModalOpcionesContrato from "@/src/features/admin/qr-search/qr-modal"
import { useToast } from "@/src/shared/hooks/use-toast"
import { searchContractAction } from "@/src/features/admin/qr-search/qr-search.action"
import { ContractFormModal } from "../contracts/contract-form-modal"
import { ContractViewModal } from "../contracts/contract-view-modal"
import { updateContractAction } from "../contracts/contract.actions"

declare global {
    interface Window {
        Html5Qrcode: any
    }
}

export function QRSearch() {
    const [qrSearchQuery, setQrSearchQuery] = useState("")
    const [qrSearchResult, setQrSearchResult] = useState<any>(null)
    const [isScanning, setIsScanning] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [open, setOpen] = useState(false)
    const [selectedAction, setSelectedAction] = useState<"ver" | "editar" | null>(null)
    const [error, setError] = useState<string | null>(null)
    const scannerRef = useRef<any>(null)
    const qrScannerInstanceRef = useRef<any>(null)
    const { toast } = useToast()

    useEffect(() => {
        const script = document.createElement("script")
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/html5-qrcode/2.3.4/html5-qrcode.min.js"
        script.async = true
        document.body.appendChild(script)

        return () => {
            document.body.removeChild(script)
        }
    }, [])

    const handleSelect = (option: "ver" | "editar" | "cerrar") => {
        setOpen(false)

        if (option === "ver") {
            setSelectedAction("ver")
            setIsModalOpen(true)
        }

        if (option === "editar") {
            setSelectedAction("editar")
            setIsModalOpen(true)
        }

        if (option === "cerrar") {
            toast({
                title: "Contrato cerrado",
                description: "Esta acción cerraría el contrato (pendiente de implementar).",
            })
        }
    }

    const handleUpdateContract = async (data: any) => {
        if (!qrSearchResult) return

        setIsLoading(true)
        try {
            const result = await updateContractAction(
                qrSearchResult.id,
                { ...data },
            )

            if (result.success) {
                toast({
                    title: "Contrato actualizado",
                    description: "Los cambios se guardaron correctamente",
                })
                setIsModalOpen(false)
                setQrSearchResult(result.data)
            } else {
                toast({
                    title: "Error",
                    description: result.error || "No se pudo actualizar el contrato",
                    variant: "destructive",
                })
            }
        } catch (error) {
            console.error("Error updating contract:", error)
            toast({
                title: "Error inesperado",
                description: "Ocurrió un problema al actualizar el contrato",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }


    const searchContractByQRCode = async (qrCode: string) => {
        if (!qrCode.trim()) {
            setError("Por favor ingresa un código QR válido")
            return
        }

        setIsLoading(true)
        setError(null)

        try {
            const result = await searchContractAction(qrCode)

            if (!result.success || !result.data) {
                setError(result.error || "No se encontró contrato con este código QR")
                setQrSearchResult(null)
                setOpen(false);
                toast({
                    title: "Contrato no encontrado",
                    description: result.error || `No hay contrato con el código: ${qrCode}`,
                    variant: "destructive",
                })
                return
            }

            setQrSearchResult(result.data)
            setError(null)
            // setIsModalOpen(true)
            setOpen(true)
            toast({
                title: "Contrato encontrado",
                description: `Contrato de ${result.data.clientName} cargado exitosamente`,
            })

        } catch (err) {
            console.error("[v0] Error searching contract:", err)
            setError("Error al buscar el contrato")
            setQrSearchResult(null)
        } finally {
            setIsLoading(false)
        }
    }

    const handleManualSearch = () => {
        searchContractByQRCode(qrSearchQuery)
    }

    const startScanner = async () => {
        if (!window.Html5Qrcode) {
            toast({
                title: "Error",
                description: "La librería de escaneo QR no se ha cargado",
                variant: "destructive",
            })
            return
        }

        setIsScanning(true)
        setError(null)

        try {
            const html5QrCode = new window.Html5Qrcode("qr-reader")
            qrScannerInstanceRef.current = html5QrCode

            await html5QrCode.start(
                { facingMode: "environment" },
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 },
                },
                (decodedText: string) => {
                    html5QrCode.stop()
                    setIsScanning(false)
                    searchContractByQRCode(decodedText)
                },
                (errorMessage: string) => {
                    // Ignore scanning errors
                },
            )
        } catch (err) {
            console.error("[v0] Error starting scanner:", err)
            setError("No se pudo acceder a la cámara. Verifica los permisos.")
            setIsScanning(false)
            toast({
                title: "Error de cámara",
                description: "No se pudo acceder a la cámara del dispositivo",
                variant: "destructive",
            })
        }
    }

    const stopScanner = async () => {
        const scanner = qrScannerInstanceRef.current
        if (scanner) {
            try {
                // Solo detiene si el escáner realmente está corriendo
                if (scanner.getState && scanner.getState() === 2) { // 2 = SCANNING
                    await scanner.stop()
                }
            } catch (err) {
                console.warn("[QR] No se pudo detener el escáner o ya estaba detenido:", err)
            } finally {
                qrScannerInstanceRef.current = null
                setIsScanning(false)
            }
        }
    }

    // Cleanup al desmontar
    useEffect(() => {
        return () => {
            if (qrScannerInstanceRef.current) {
                stopScanner()
            }
        }
    }, [])


    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Búsqueda por Código QR</h1>
                    <p className="text-muted-foreground">Busca contratos utilizando códigos QR o ID de contrato</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Búsqueda Manual */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Search className="w-5 h-5 mr-2" />
                            Búsqueda Manual
                        </CardTitle>
                        <CardDescription>Ingresa el código QR o ID del contrato</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="qr-input">Código QR o ID de Contrato</Label>
                            <div className="flex space-x-2">
                                <Input
                                    id="qr-input"
                                    placeholder="Ej: QR-CNT-2024-001"
                                    value={qrSearchQuery}
                                    onChange={(e) => setQrSearchQuery(e.target.value)}
                                    onKeyPress={(e) => e.key === "Enter" && handleManualSearch()}
                                    disabled={isLoading}
                                />
                                <Button
                                onClick={handleManualSearch}
                                disabled={isLoading}
                                className="bg-accent hover:bg-accent/90 hover:cursor-pointer">
                                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Escáner QR */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <QrCode className="w-5 h-5 mr-2" />
                            Escáner QR
                        </CardTitle>
                        <CardDescription>Escanea códigos QR directamente con la cámara</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex flex-col items-center space-y-4">
                            <div
                                id="qr-reader"
                                className="w-full max-w-xs rounded-lg overflow-hidden"
                                style={{
                                    display: isScanning ? "block" : "none",
                                }}
                            />
                            {!isScanning && (
                                <div className="w-48 h-48 border-2 border-dashed border-muted-foreground rounded-lg flex items-center justify-center">
                                    <div className="text-center">
                                        <QrCode className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
                                        <p className="text-sm text-muted-foreground">Área de escaneo</p>
                                    </div>
                                </div>
                            )}
                            <Button
                                onClick={isScanning ? stopScanner : startScanner}
                                variant={isScanning ? "destructive" : "default"}
                                className={!isScanning ? "bg-accent hover:bg-accent/90 hover:cursor-pointer" : "hover:cursor-pointer"}
                                disabled={isLoading}
                            >
                                {isScanning ? "Detener Escaneo" : "Iniciar Escaneo"}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Error Message */}
            {error && (
                <Card className="border-destructive bg-destructive/5">
                    <CardContent className="flex items-center justify-center py-6">
                        <div className="text-center">
                            <XCircle className="w-12 h-12 mx-auto mb-4 text-destructive" />
                            <h3 className="text-lg font-medium mb-2">Error en la búsqueda</h3>
                            <p className="text-muted-foreground">{error}</p>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Contract Modals */}
            <ContractViewModal
                open={isModalOpen && selectedAction === "ver"}
                onOpenChange={(open) => {
                    if (!open) setSelectedAction(null)
                    setIsModalOpen(open)
                }}
                contract={qrSearchResult}
            />

            <ContractFormModal
                open={isModalOpen && selectedAction === "editar"}
                onOpenChange={(open) => {
                    if (!open) setSelectedAction(null)
                    setIsModalOpen(open)
                }}
                onSubmit={(data) => handleUpdateContract(data)}
                initialData={qrSearchResult}
                isLoading={isLoading}
            />


            <ModalOpcionesContrato
                isOpen={open}
                onClose={() => setOpen(false)}
                onSelect={handleSelect}
            />

        </div>
    )
}
