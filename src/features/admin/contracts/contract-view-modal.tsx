"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/src/shared/components/ui/dialog"
import { Button } from "@/src/shared/components/ui/button"
import { Badge } from "@/src/shared/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/shared/components/ui/card"
import { Download, Eye, X } from "lucide-react"
import { downloadContractPDF } from "@/src/lib/contract-pdf-generator"
import { QrViewer } from "@/src/shared/hooks/QrViewer"
import { generateQrImg } from "@/src/lib/generateQr"

interface ContractViewModalProps {
  contract: any
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ContractViewModal({ contract, open, onOpenChange }: ContractViewModalProps) {
  if (!contract) return null

  const totalPrice =
    contract.services?.reduce((sum: number, s: any) => {
      const price = typeof s.price === "number" ? s.price : Number(s.price)
      return sum + price
    }, 0) || 0

  const handleStatusNames = (name: string): string => {
    const statusNames: Record<string, string> = {
      CurrentAndPaid: "Al corriente y pagado",
      CurrentAndInDebt: "Al corriente y con deuda",
      Expired: "Vencido",
    }
    return statusNames[name] || "Desconocido"
  }

  async function handleDownloadContract(contract: any) {
    let contractWithQr = { ...contract }

    // Si tiene qrId pero no qrCode, generamos QR
    if (contract.qrCode) {
      const { qrBase64, qrId } = await generateQrImg(contract.qrCode)
      contractWithQr.qrCode = qrBase64.replace(/^data:image\/png;base64,/, "")
      contractWithQr.qrCodeId = qrId
    }

    downloadContractPDF(contractWithQr)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Eye className="h-5 w-5 text-primary" />
            </div>
            <DialogTitle className="text-2xl font-bold">Detalles del Contrato CNT-{contract.id}</DialogTitle>
            {/* <DialogDescription>Información completa del contrato y servicios</DialogDescription> */}
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Responsable */}
          <Card>
            <CardHeader><CardTitle className="text-lg">Responsable</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 gap-2">
              <div>
                {/* <p className="text-sm text-muted-foreground">Responsable</p> */}
                <p className="font-medium">
                  {contract.responsible?.firstName} {contract.responsible?.lastName1} {contract.responsible?.lastName2}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Client Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Información del Cliente</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Nombre</p>
                <p className="font-medium">{contract.clientName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Estado</p>
                <Badge
                  className={contract.status === "Expired"
                    ? "bg-destructive"
                    : contract.status === "CurrentAndInDebt"
                      ? "bg-amber-400"
                      : "bg-secondary"
                  }
                >
                  {handleStatusNames(contract.status)}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">RFC</p>
                <p className="font-medium">{contract.clientRFC}</p>
              </div>
            </CardContent>
          </Card>

          {/* Client Direction */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Dirección del Cliente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Calle</p>
                <p className="font-medium">{contract.clientStreet}</p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Número Exterior</p>
                  <p className="font-medium">{contract.clientExteriorNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Número Interior</p>
                  <p className="font-medium">{contract.clientInteriorNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Código Postal</p>
                  <p className="font-medium">{contract.clientPostalCode}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Colonia</p>
                  <p className="font-medium">{contract.clientNeighborhood}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ciudad</p>
                  <p className="font-medium">{contract.clientCity}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Estado</p>
                  <p className="font-medium">{contract.clientState}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* PROFECO Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Información PROFECO</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Número de Registro PROFECO</p>
                  <p className="font-medium">{contract.profecoNumber}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Fecha de Registro PROFECO</p>
                <p className="font-medium">{new Date(contract.profecoDate).toLocaleDateString("es-ES")}</p>
              </div>
            </CardContent>
          </Card>

          {/* Consentimientos */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Consentimientos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 border rounded-xl bg-muted/30 flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Autorización para uso de datos mercadotécnicos
                  </p>
                  <span className="text-lg">{contract.marketingConsent ? "✅" : "❌"}</span>
                </div>

                <div className="p-4 border rounded-xl bg-muted/30 flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Autorización para recibir publicidad
                  </p>
                  <span className="text-lg">{contract.advertisingConsent ? "✅" : "❌"}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vehicle Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Información del Vehículo</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Marca</p>
                <p className="font-medium">{contract.vehicle?.brand}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Modelo</p>
                <p className="font-medium">{contract.vehicle?.model}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Año</p>
                <p className="font-medium">{contract.vehicle?.year}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Placa</p>
                <p className="font-medium">{contract.vehicle?.licensePlate || "N/A"}</p>
              </div>
            </CardContent>
          </Card>

          {/* Services */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Servicios Contratados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {contract.services?.map((service: any, index: number) => {
                  const price = typeof service.price === "number" ? service.price : Number(service.price)
                  return (
                    <div key={index} className="flex justify-between items-center pb-3 border-b last:border-b-0">
                      <span className="font-medium">{service.service.name}</span>
                      <span className="text-lg font-bold">${price.toLocaleString()}</span>
                    </div>
                  )
                })}
                {/* TOTAL */}
                <div className="flex justify-between items-center pt-3 border-t-2 font-bold text-lg">
                  <span>Total</span>
                  <span>${totalPrice.toLocaleString()}</span>
                </div>

                {/* ESTADO DEL PAGO */}
                <div className="mt-4 p-3 rounded-lg bg-muted flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">
                    {contract.missingPayment > 0 ? "Saldo pendiente" : "Estado del contrato"}
                  </p>

                  {contract.missingPayment > 0 ? (
                    <span className="text-red-600 font-semibold text-lg">
                      ${contract.missingPayment.toLocaleString()}
                    </span>
                  ) : (
                    <span className="text-green-600 font-semibold text-lg">
                      Liquidado
                    </span>
                  )}
                </div>

              </div>
            </CardContent>
          </Card>

          {/* Dates */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Vigencia del Contrato</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Fecha Inicio</p>
                <p className="font-medium">{new Date(contract.startDate).toLocaleDateString("es-ES")}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Fecha Fin</p>
                <p className="font-medium">
                  {contract.endDate ? new Date(contract.endDate).toLocaleDateString("es-ES") : "Indefinida"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* QR Code */}
          {contract.qrCode && (
            <QrViewer qrId={contract.qrCode} />
          )}

          {/* Actions */}
          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="hover:cursor-pointer">
              <X className="w-4 h-4 mr-2" />
              Cerrar
            </Button>
            <Button
              onClick={() => handleDownloadContract(contract as any)}
              className="hover:cursor-pointer">
              <Download className="w-4 h-4 mr-2" />
              Descargar PDF
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
