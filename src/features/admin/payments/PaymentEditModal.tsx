"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/src/shared/components/ui/dialog"
import { Button } from "@/src/shared/components/ui/button"
import { Input } from "@/src/shared/components/ui/input"
import { Label } from "@/src/shared/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/shared/components/ui/select"

interface PaymentEditModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
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
  }
  onSuccess?: () => void
  onSubmit?: (data: {
    id: number
    amount: number
    method: string
    paymentDate: Date
    voucherNumber?: string
  }) => Promise<void>
}

export function PaymentEditModal({
  open,
  onOpenChange,
  payment,
  onSuccess,
  onSubmit,
}: PaymentEditModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    amount: typeof payment.amount === "number" 
      ? payment.amount.toString() 
      : payment.amount.toString(),
    method: payment.method,
    paymentDate: new Date(payment.paymentDate).toISOString().split('T')[0],
    voucherNumber: payment.voucherNumber || "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      if (!formData.amount || !formData.method || !formData.paymentDate) {
        setError("Por favor completa todos los campos requeridos")
        setIsLoading(false)
        return
      }

      const paymentDate = new Date(formData.paymentDate)
      const fixedDate = new Date(paymentDate.getTime() + paymentDate.getTimezoneOffset() * 60000)

      if (onSubmit) {
        await onSubmit({
          id: payment.id,
          amount: Number.parseFloat(formData.amount),
          method: formData.method,
          paymentDate: fixedDate,
          voucherNumber: formData.voucherNumber || undefined,
        })
      } else {
        // Default implementation - you need to connect this to your server action
        console.log("Payment update submitted:", {
          id: payment.id,
          amount: Number.parseFloat(formData.amount),
          method: formData.method,
          paymentDate: fixedDate,
          voucherNumber: formData.voucherNumber || undefined,
        })
      }

      onOpenChange(false)
      onSuccess?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al actualizar el pago")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Pago</DialogTitle>
          <DialogDescription>
            Actualiza los detalles del pago PAY-{payment.id}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Información de solo lectura */}
          <div className="bg-muted px-3 py-2 rounded-md space-y-2">
            <div className="text-sm">
              <span className="text-muted-foreground">Contrato:</span>
              <p className="font-semibold">{payment.contractId || "N/A"}</p>
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Cliente:</span>
              <p className="font-semibold">{payment.contract?.clientName || "N/A"}</p>
            </div>
          </div>

          {/* Monto */}
          <div className="space-y-2">
            <Label htmlFor="edit-amount">Monto del Pago</Label>
            <Input
              id="edit-amount"
              type="number"
              step="0.01"
              placeholder="1500.00"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              disabled={isLoading}
            />
          </div>

          {/* Método de Pago */}
          <div className="space-y-2">
            <Label htmlFor="edit-method">Método de Pago</Label>
            <Select 
              value={formData.method} 
              onValueChange={(value) => setFormData({ ...formData, method: value })}
              disabled={isLoading}
            >
              <SelectTrigger id="edit-method">
                <SelectValue placeholder="Seleccionar método" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="efectivo">Efectivo</SelectItem>
                <SelectItem value="transferencia">Transferencia</SelectItem>
                <SelectItem value="tarjeta">Tarjeta de Crédito/Débito</SelectItem>
                <SelectItem value="cheque">Cheque</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Fecha de Pago */}
          <div className="space-y-2">
            <Label htmlFor="edit-date">Fecha de Pago</Label>
            <Input
              id="edit-date"
              type="date"
              value={formData.paymentDate}
              onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
              disabled={isLoading}
            />
          </div>

          {/* Referencia/Folio */}
          <div className="space-y-2">
            <Label htmlFor="edit-voucher">Referencia/Folio (Opcional)</Label>
            <Input
              id="edit-voucher"
              placeholder="TRF-123456"
              value={formData.voucherNumber}
              onChange={(e) => setFormData({ ...formData, voucherNumber: e.target.value })}
              disabled={isLoading}
            />
          </div>

          {/* Mensajes de error */}
          {error && (
            <div className="bg-destructive/10 border border-destructive/30 text-destructive text-sm px-3 py-2 rounded-md">
              {error}
            </div>
          )}

          {/* Botones */}
          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-accent hover:bg-accent/90"
              disabled={isLoading}
            >
              {isLoading ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
