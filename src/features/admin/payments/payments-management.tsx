"use client"

import { useState, useEffect } from "react"
import { Button } from "@/src/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/shared/components/ui/card"
import { Input } from "@/src/shared/components/ui/input"
import { Label } from "@/src/shared/components/ui/label"
import { Textarea } from "@/src/shared/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/shared/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/shared/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/shared/components/ui/dialog"
import { Plus, Receipt, TrendingUp, Clock, Search, Eye, Edit, Download } from "lucide-react"
import {
  getPaymentsAction,
  createPaymentAction,
  getContractsAvailableForPaymentAction,
} from "@/src/features/admin/payments/payments.actions"

interface Payment {
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

interface Contract {
  id: number
  clientName: string
  status: string
}

export function PaymentsManagement() {
  const [isNewPaymentOpen, setIsNewPaymentOpen] = useState(false)
  const [payments, setPayments] = useState<Payment[]>([])
  const [contracts, setContracts] = useState<Contract[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState({
    contractId: "",
    amount: "",
    method: "",
    paymentDate: "",
    voucherNumber: "",
    notes: "",
  })

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      setIsLoading(true)
      const [paymentsData, contractsData] = await Promise.all([
        getPaymentsAction(),
        getContractsAvailableForPaymentAction(),
      ])
      setPayments(paymentsData)
      setContracts(contractsData)
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleCreatePayment() {
    if (!formData.contractId || !formData.amount || !formData.method || !formData.paymentDate) {
      alert("Por favor completa todos los campos requeridos")
      return
    }

    const selectedDate = new Date(formData.paymentDate)
    const fixedDate = new Date(selectedDate.getTime() + selectedDate.getTimezoneOffset() * 60000)

    try {
      await createPaymentAction({
        contractId: Number.parseInt(formData.contractId),
        amount: Number.parseFloat(formData.amount),
        method: formData.method,
        paymentDate: fixedDate,
        voucherNumber: formData.voucherNumber || undefined,
        responsibleUser: 1, // TODO: Get from current user context
      })

      // Reset form and reload data
      setFormData({
        contractId: "",
        amount: "",
        method: "",
        paymentDate: "",
        voucherNumber: "",
        notes: "",
      })
      setIsNewPaymentOpen(false)
      await loadData()
    } catch (error) {
      console.error("Error creating payment:", error)
      alert("Error al registrar el pago")
    }
  }

  const todayPayments = payments.filter((p) => {
    const paymentDate = new Date(p.paymentDate)
    const today = new Date()
    return paymentDate.toDateString() === today.toDateString()
  }).length

  const monthlyIncome = payments
    .filter((p) => {
      const paymentDate = new Date(p.paymentDate)
      const now = new Date()
      return paymentDate.getMonth() === now.getMonth() && paymentDate.getFullYear() === now.getFullYear()
    })
    .reduce((sum, p) => sum + (typeof p.amount === "number" ? p.amount : Number.parseFloat(p.amount)), 0)

  const totalProcessed = payments.reduce(
    (sum, p) => sum + (typeof p.amount === "number" ? p.amount : Number.parseFloat(p.amount)),
    0,
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Pagos</h1>
          <p className="text-muted-foreground">Registra y administra pagos de contratos</p>
        </div>
        <Dialog open={isNewPaymentOpen} onOpenChange={setIsNewPaymentOpen}>
          <DialogTrigger asChild>
            <Button className="bg-accent hover:bg-accent/90">
              <Plus className="w-4 h-4 mr-2" />
              Registrar Pago
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Registrar Nuevo Pago</DialogTitle>
              <DialogDescription>Registra un pago para un contrato existente</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="payment-contract">Contrato</Label>
                <Select
                  value={formData.contractId}
                  onValueChange={(value) => setFormData({ ...formData, contractId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar contrato" />
                  </SelectTrigger>
                  <SelectContent>
                    {contracts.map((contract) => (
                      <SelectItem key={contract.id} value={contract.id.toString()}>
                        {contract.id} - {contract.clientName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="payment-amount">Monto del Pago</Label>
                <Input
                  id="payment-amount"
                  type="number"
                  placeholder="1500"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="payment-method">Método de Pago</Label>
                <Select value={formData.method} onValueChange={(value) => setFormData({ ...formData, method: value })}>
                  <SelectTrigger>
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
              <div>
                <Label htmlFor="payment-date">Fecha de Pago</Label>
                <Input
                  id="payment-date"
                  type="date"
                  value={formData.paymentDate}
                  onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="payment-reference">Referencia/Folio</Label>
                <Input
                  id="payment-reference"
                  placeholder="TRF-123456"
                  value={formData.voucherNumber}
                  onChange={(e) => setFormData({ ...formData, voucherNumber: e.target.value })}
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="payment-notes">Notas</Label>
                <Textarea
                  id="payment-notes"
                  placeholder="Observaciones adicionales..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>
              <div className="col-span-2 flex gap-2">
                <Button onClick={() => setIsNewPaymentOpen(false)} variant="outline" className="flex-1">
                  Cancelar
                </Button>
                <Button onClick={handleCreatePayment} className="flex-1 bg-accent hover:bg-accent/90">
                  Registrar Pago
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pagos Hoy</CardTitle>
            <Receipt className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayPayments}</div>
            <p className="text-xs text-muted-foreground">Transacciones completadas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos del Mes</CardTitle>
            <TrendingUp className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${monthlyIncome.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Mes actual</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pagos Pendientes</CardTitle>
            <Clock className="w-4 h-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contracts.filter((c) => c.status === "CurrentAndInDebt").length}</div>
            <p className="text-xs text-muted-foreground">Requieren seguimiento</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Procesado</CardTitle>
            <Receipt className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalProcessed.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Todos los tiempos</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Historial de Pagos</CardTitle>
            <div className="flex items-center space-x-2">
              <Input placeholder="Buscar pagos..." className="w-64" />
              <Button variant="outline" size="sm">
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Cargando pagos...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID Pago</TableHead>
                  <TableHead>Contrato</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Método</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      No hay pagos registrados
                    </TableCell>
                  </TableRow>
                ) : (
                  payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">PAY-{payment.id}</p>
                          <p className="text-sm text-muted-foreground">{payment.voucherNumber || "N/A"}</p>
                        </div>
                      </TableCell>
                      <TableCell>{payment.contractId || "N/A"}</TableCell>
                      <TableCell>{payment.contract?.clientName || "N/A"}</TableCell>
                      <TableCell className="font-medium">
                        $
                        {typeof payment.amount === "number"
                          ? payment.amount.toLocaleString()
                          : Number.parseFloat(payment.amount).toLocaleString()}
                      </TableCell>
                      <TableCell>{payment.method}</TableCell>
                      <TableCell>{new Date(payment.paymentDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        {payment.responsible
                          ? `${payment.responsible.firstName} ${payment.responsible.lastName1}`
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
