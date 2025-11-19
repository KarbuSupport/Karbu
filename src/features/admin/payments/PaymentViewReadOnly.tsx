import { Card, CardContent, CardHeader, CardTitle } from "@/src/shared/components/ui/card"
import { Badge } from "@/src/shared/components/ui/badge"
import { Eye, Calendar, DollarSign, FileText, User } from 'lucide-react'

interface PaymentViewReadOnlyProps {
  payment: {
    id: number
    contractId?: number | null
    quoteId?: number | null
    amount: any
    method: string
    paymentDate: Date
    voucherNumber?: string | null
    voucherImage?: string | null
    responsibleUser: number
    contract?: {
      id: number
      clientName: string
    } | null
    responsible?: {
      id: number
      firstName: string
      lastName1: string
    } | null
  }
}

export function PaymentViewReadOnly({ payment }: PaymentViewReadOnlyProps) {
  const amount = typeof payment.amount === "number" 
    ? payment.amount 
    : Number.parseFloat(payment.amount)

  const methodLabels: Record<string, string> = {
    efectivo: "Efectivo",
    transferencia: "Transferencia",
    tarjeta: "Tarjeta",
    cheque: "Cheque",
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Detalles del Pago
          </CardTitle>
          <Badge variant="outline">PAY-{payment.id}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Información General */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground font-medium">Contrato</p>
            <p className="text-base font-semibold">{payment.contractId || "N/A"}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground font-medium">Cliente</p>
            <p className="text-base font-semibold">{payment.contract?.clientName || "N/A"}</p>
          </div>
        </div>

        {/* Monto y Método */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-green-500" />
              <p className="text-sm text-muted-foreground font-medium">Monto</p>
            </div>
            <p className="text-2xl font-bold text-green-600">${amount.toLocaleString()}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground font-medium">Método de Pago</p>
            <p className="text-base font-semibold">{methodLabels[payment.method] || payment.method}</p>
          </div>
        </div>

        {/* Fecha y Usuario */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-500" />
              <p className="text-sm text-muted-foreground font-medium">Fecha de Pago</p>
            </div>
            <p className="text-base font-semibold">{new Date(payment.paymentDate).toLocaleDateString('es-MX', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-purple-500" />
              <p className="text-sm text-muted-foreground font-medium">Usuario Responsable</p>
            </div>
            <p className="text-base font-semibold">
              {payment.responsible 
                ? `${payment.responsible.firstName} ${payment.responsible.lastName1}` 
                : "N/A"}
            </p>
          </div>
        </div>

        {/* Referencia/Folio */}
        {payment.voucherNumber && (
          <div className="space-y-2 border-t pt-4">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-orange-500" />
              <p className="text-sm text-muted-foreground font-medium">Referencia/Folio</p>
            </div>
            <p className="text-base font-semibold bg-muted px-3 py-2 rounded-md">{payment.voucherNumber}</p>
          </div>
        )}

        {/* Información Adicional */}
        <div className="border-t pt-4 space-y-2">
          <p className="text-sm text-muted-foreground font-medium">Información Adicional</p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">ID Pago:</span>
              <p className="font-semibold">PAY-{payment.id}</p>
            </div>
            {payment.quoteId && (
              <div>
                <span className="text-muted-foreground">Cotización:</span>
                <p className="font-semibold">{payment.quoteId}</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
