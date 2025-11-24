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
import { Plus, Receipt, TrendingUp, Clock, Search, Eye, Edit, Download, Trash2, FileText } from 'lucide-react'
import {
  getPaymentsAction,
  createPaymentAction,
  getContractsAvailableForPaymentAction,
  getQuotesAvailableForPaymentAction,
  updatePaymentAction,
  deletePaymentAction,
  getPaymentsStatsAction,
} from "@/src/features/admin/payments/payments.actions"
import { useAuth } from "@/src/shared/context/AuthContext"
import { can } from "@/src/shared/functions/permissions"
import { PaymentViewReadOnly } from "@/src/features/admin/payments/PaymentViewReadOnly"
import { PaymentEditModal } from "@/src/features/admin/payments/PaymentEditModal"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/src/shared/components/ui/alert-dialog"
import { generatePaymentPDF } from "@/src/lib/payment-pdf-generator"

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

interface Quote {
  id: number
  repairEstimate: any
}

export function PaymentsManagement() {
  const systemPermissions = useAuth().permissions;
  const currentUserId = useAuth().userId;
  const [isNewPaymentOpen, setIsNewPaymentOpen] = useState(false)
  const [payments, setPayments] = useState<Payment[]>([])
  const [contracts, setContracts] = useState<Contract[]>([])
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    CurrentAndInDebt: 0,
    monthlyIncome: 0,
    todayPayments: 0,
    totalProcessed: 0,
  })

  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [paymentToDelete, setPaymentToDelete] = useState<Payment | null>(null)

  const [formData, setFormData] = useState({
    paymentType: "contract", // "contract" or "quote"
    contractId: "",
    quoteId: "",
    amount: "",
    method: "",
    paymentDate: "",
    voucherNumber: "",
    notes: "",
  })

  useEffect(() => {
    loadData()
  }, [])

  // Filtrado cuando cambia searchTerm
  useEffect(() => {
    if (searchTerm.trim() === "") {
      loadData() // Si el buscador está vacío, mostrar todo
    } else {
      searchPayments(searchTerm)
    }
  }, [searchTerm])

  async function loadData() {
    try {
      setIsLoading(true)
      const [paymentsData, contractsData, quotesData, statsData] = await Promise.all([
        getPaymentsAction(),
        getContractsAvailableForPaymentAction(),
        getQuotesAvailableForPaymentAction(),
        getPaymentsStatsAction(),
      ])
      setPayments(paymentsData)
      setContracts(contractsData)
      setQuotes(quotesData)
      setStats(statsData)
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Búsqueda de pagos según searchTerm
  async function searchPayments(term: string) {
    try {
      setIsLoading(true)
      const paymentsData = await getPaymentsAction({ search: term })
      setPayments(paymentsData)
    } catch (error) {
      console.error("Error searching payments:", error)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleCreatePayment() {
    const isQuotePayment = formData.paymentType === "quote"
    const relatedId = isQuotePayment ? formData.quoteId : formData.contractId

    if (!relatedId || !formData.amount || !formData.method || !formData.paymentDate) {
      alert("Por favor completa todos los campos requeridos")
      return
    }

    const selectedDate = new Date(formData.paymentDate)
    const fixedDate = new Date(selectedDate.getTime() + selectedDate.getTimezoneOffset() * 60000)
    try {
      await createPaymentAction({
        contractId: isQuotePayment ? undefined : Number.parseInt(formData.contractId),
        quoteId: isQuotePayment ? Number.parseInt(formData.quoteId) : undefined,
        amount: Number.parseFloat(formData.amount),
        method: formData.method,
        paymentDate: fixedDate,
        voucherNumber: formData.voucherNumber || undefined,
        responsibleUser: Number(currentUserId) || 1, // TODO: Get from current user context
      })

      // Reset form and reload data
      setFormData({
        paymentType: "contract",
        contractId: "",
        quoteId: "",
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

  async function handleEditPayment(data: {
    id: number
    amount: number
    method: string
    paymentDate: Date
    voucherNumber?: string
  }) {
    try {
      await updatePaymentAction(data)
      setIsEditOpen(false)
      setSelectedPayment(null)
      await loadData()
    } catch (error) {
      console.error("Error updating payment:", error)
      alert("Error al actualizar el pago")
    }
  }

  async function handleDeletePayment(paymentId: number) {
    try {
      console.log("[v0] Deleting payment:", paymentId)
      await deletePaymentAction(paymentId)
      setIsDeleteConfirmOpen(false)
      setPaymentToDelete(null)
      await loadData()
    } catch (error) {
      console.error("Error deleting payment:", error)
      alert("Error al eliminar el pago")
    }
  }

  // const todayPayments = payments.filter((p) => {
  //   const paymentDate = new Date(p.paymentDate)
  //   const today = new Date()
  //   return paymentDate.toDateString() === today.toDateString()
  // }).length

  // const monthlyIncome = payments
  //   .filter((p) => {
  //     const paymentDate = new Date(p.paymentDate)
  //     const now = new Date()
  //     return paymentDate.getMonth() === now.getMonth() && paymentDate.getFullYear() === now.getFullYear()
  //   })
  //   .reduce((sum, p) => sum + (typeof p.amount === "number" ? p.amount : Number.parseFloat(p.amount)), 0)

  // const totalProcessed = payments.reduce(
  //   (sum, p) => sum + (typeof p.amount === "number" ? p.amount : Number.parseFloat(p.amount)),
  //   0,
  // )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Pagos</h1>
          <p className="text-muted-foreground">Registra y administra pagos de contratos y cotizaciones</p>
        </div>
        <Dialog open={isNewPaymentOpen} onOpenChange={setIsNewPaymentOpen}>
          <DialogTrigger asChild>
            {can(systemPermissions, "Create_Payments") && (
              <Button className="bg-accent hover:bg-accent/90 hover:cursor-pointer">
                <Plus className="w-4 h-4 mr-2" />
                Registrar Pago
              </Button>)}
          </DialogTrigger>
          <DialogContent className="md:min-w-2xl max-w-2xl">
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <DialogTitle>Registrar Nuevo Pago</DialogTitle>
                </div>
              </div>
              {/* <DialogDescription>Registra un pago para un contrato o cotización existente</DialogDescription> */}
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="payment-type">Tipo de Pago</Label>
                <Select
                  value={formData.paymentType}
                  onValueChange={(value) => setFormData({ ...formData, paymentType: value, contractId: "", quoteId: "" })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="contract">Pago de Contrato</SelectItem>
                    <SelectItem value="quote">Pago de Cotización</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.paymentType === "contract" ? (
                <div className="col-span-2">
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
              ) : (
                <div className="col-span-2">
                  <Label htmlFor="payment-quote">Cotización</Label>
                  <Select
                    value={formData.quoteId}
                    onValueChange={(value) => setFormData({ ...formData, quoteId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar cotización" />
                    </SelectTrigger>
                    <SelectContent>
                      {quotes.map((quote) => (
                        <SelectItem className="hover:cursor-pointer" key={quote.id} value={quote.id.toString()}>
                          Cotización {quote.id}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

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
              {/* <div className="col-span-2">
                <Label htmlFor="payment-notes">Notas</Label>
                <Textarea
                  id="payment-notes"
                  placeholder="Observaciones adicionales..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div> */}
              <div className="col-span-2 flex gap-2">
                <Button
                  onClick={() => setIsNewPaymentOpen(false)}
                  variant="outline"
                  className="flex-1 hover:cursor-pointer">
                  Cancelar
                </Button>
                <Button
                  onClick={handleCreatePayment}
                  className="flex-1 bg-accent hover:bg-accent/90 hover:cursor-pointer">
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
            <div className="text-2xl font-bold">{stats.todayPayments.toLocaleString("es-MX")}</div>
            <p className="text-xs text-muted-foreground">Transacciones completadas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos del Mes</CardTitle>
            <TrendingUp className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.monthlyIncome.toLocaleString("es-MX")}</div>
            <p className="text-xs text-muted-foreground">Mes actual</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pagos Pendientes</CardTitle>
            <Clock className="w-4 h-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.CurrentAndInDebt.toLocaleString("es-MX")}</div>
            <p className="text-xs text-muted-foreground">Requieren seguimiento</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Procesado</CardTitle>
            <Receipt className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalProcessed.toLocaleString("es-MX")}</div>
            <p className="text-xs text-muted-foreground">Todos los tiempos</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Historial de Pagos</CardTitle>
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Buscar pagos..."
                className="max-w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button
                variant="outline"
                size="sm"
                className="hover:cursor-pointer">
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
                  <TableHead>Tipo</TableHead>
                  <TableHead>Contrato/Cotización</TableHead>
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
                      <TableCell>
                        <span className={`text-xs font-medium px-2 py-1 rounded ${payment.contractId
                          ? "bg-blue-100 text-blue-700"
                          : "bg-green-100 text-green-700"
                          }`}>
                          {payment.contractId ? "Contrato" : "Cotización"}
                        </span>
                      </TableCell>
                      <TableCell>{payment.contractId ? `CNT-${payment.contractId}` : `QTZ-${payment.quoteId}`}</TableCell>
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
                          <Button
                            variant="ghost"
                            size="sm"
                            className="hover:cursor-pointer"
                            onClick={() => {
                              setSelectedPayment(payment)
                              setIsViewOpen(true)
                            }}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="hover:cursor-pointer"
                            onClick={() => generatePaymentPDF(payment)}>
                            <Download className="w-4 h-4" />
                          </Button>
                          {
                            can(systemPermissions, "Edit_Payments") && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="hover:cursor-pointer"
                                onClick={() => {
                                  setSelectedPayment(payment)
                                  setIsEditOpen(true)
                                }}>
                                <Edit className="w-4 h-4" />
                              </Button>
                            )
                          }
                          {
                            can(systemPermissions, "Delete_Payments") && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="hover:cursor-pointer text-red-500 hover:text-red-700"
                                onClick={() => {
                                  setPaymentToDelete(payment)
                                  setIsDeleteConfirmOpen(true)
                                }}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )
                          }
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

      {selectedPayment && (
        <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Eye className="h-5 w-5 text-primary" />
                </div>
                <DialogTitle className="text-2xl font-bold">Detalles del Pago PAY-{selectedPayment.id}</DialogTitle>
              </div>

            </DialogHeader>
            <PaymentViewReadOnly payment={selectedPayment} />
            <Button
              onClick={() => setIsViewOpen(false)}
              variant="outline"
              className="flex-1 hover:cursor-pointer">
              Cancelar
            </Button>
          </DialogContent>
        </Dialog>
      )}

      {selectedPayment && (
        <PaymentEditModal
          open={isEditOpen}
          onOpenChange={setIsEditOpen}
          payment={selectedPayment}
          onSuccess={loadData}
          onSubmit={handleEditPayment}
        />
      )}

      <AlertDialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar Pago</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas eliminar el pago PAY-{paymentToDelete?.id}?
              <br />
              Monto: ${typeof paymentToDelete?.amount === "number"
                ? paymentToDelete.amount.toLocaleString()
                : Number.parseFloat(paymentToDelete?.amount || "0").toLocaleString()}
              <br />
              <span className="text-red-500 font-semibold mt-2 block">Esta acción no se puede deshacer.</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-4">
            <AlertDialogCancel className="flex-1 hover:cursor-pointer">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => paymentToDelete && handleDeletePayment(paymentToDelete.id)}
              className="flex-1 bg-red-500 hover:bg-red-600 hover:cursor-pointer"
            >
              Eliminar
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
