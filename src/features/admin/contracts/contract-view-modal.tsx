"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/src/shared/components/ui/dialog"
import { Button } from "@/src/shared/components/ui/button"
import { Badge } from "@/src/shared/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/shared/components/ui/card"
import { Download, X } from "lucide-react"
import { downloadContractPDF } from "@/src/lib/contract-pdf-generator"

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

  const handleStatusNames = async (name: string): Promise<string> => {
    enum PaymentStatus {
      CurrentAndPaid = "CurrentAndPaid",
      CurrentAndInDebt = "CurrentAndInDebt",
      Expired = "Expired",
    }

    const statusNames: Record<PaymentStatus, string> = {
      [PaymentStatus.CurrentAndPaid]: "Al corriente y pagado",
      [PaymentStatus.CurrentAndInDebt]: "Al corriente y con deuda",
      [PaymentStatus.Expired]: "Vencido",
    }

    return statusNames[name as PaymentStatus] || "Desconocido"
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalles del Contrato CNT-{contract.id}</DialogTitle>
          <DialogDescription>Información completa del contrato y servicios</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
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
                  variant={
                    contract.status === "Vigente"
                      ? "default"
                      : contract.status === "Caducado"
                        ? "destructive"
                        : "secondary"
                  }
                >
                  {handleStatusNames(contract.status)}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Responsable</p>
                <p className="font-medium">
                  {contract.responsible?.firstName} {contract.responsible?.lastName1}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{contract.responsible?.email}</p>
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
                <div className="flex justify-between items-center pt-3 border-t-2 font-bold text-lg">
                  <span>Total</span>
                  <span>${totalPrice.toLocaleString()}</span>
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
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Código QR</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-mono text-sm">{contract.qrCode}</p>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              <X className="w-4 h-4 mr-2" />
              Cerrar
            </Button>
            <Button onClick={() => downloadContractPDF(contract)}>
              <Download className="w-4 h-4 mr-2" />
              Descargar PDF
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
