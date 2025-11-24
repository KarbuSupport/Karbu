"use client"

import { useState, useEffect } from "react"
import { Button } from "@/src/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/shared/components/ui/card"
import { Input } from "@/src/shared/components/ui/input"
import { Badge } from "@/src/shared/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/shared/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/shared/components/ui/select"
import { Plus, CheckCircle, Clock, AlertTriangle, Search, Download, Eye, Edit, Trash2, Contact } from "lucide-react"
import {
  getContractsAction,
  createContractAction,
  updateContractAction,
  deleteContractAction,
  getContractStatsAction,
  getContractByIdAction,
  getVehiclesAction,
  getServicesAction,
} from "@/src/features/admin/contracts/contract.actions"
import { ContractFormModal } from "./contract-form-modal"
import { ContractViewModal } from "./contract-view-modal"
import { downloadContractPDF } from "@/src/lib/contract-pdf-generator"
import { generateQrImg, generateQrWithId } from "@/src/lib/generateQr"
import { can } from "@/src/shared/functions/permissions"
import { useAuth } from "@/src/shared/context/AuthContext"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle } from "@radix-ui/react-alert-dialog"
import { AlertDialogHeader } from "@/src/shared/components/ui/alert-dialog"

interface Contract {
  id: number
  clientName: string
  vehicleId: number
  startDate: Date
  endDate?: Date
  status: string
  qrCode?: string
  createdAt: Date
  vehicle?: {
    brand: string
    model: string
    licensePlate?: string
  }
  services?: Array<{
    service: {
      name: string
    }
    price: number
  }>
  payments?: Array<{
    amount: number
    paymentDate: Date
  }>
}

interface Stats {
  CurrentAndPaid: number
  CurrentAndInDebt: number
  Expired: number
}

export function ContractsManagement() {
  const systemPermissions = useAuth().permissions;
  const currentUserId = useAuth().userId;
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [contracts, setContracts] = useState<Contract[]>([])
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null)
  const [editingContract, setEditingContract] = useState<Contract | null>(null)
  const [stats, setStats] = useState<Stats>({
    CurrentAndPaid: 0,
    CurrentAndInDebt: 0,
    Expired: 0,
  })
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [contractToDelete, setContractToDelete] = useState<Contract | null>(null)

  useEffect(() => {
    loadContracts();
    loadStats();
  }, [filterStatus, searchTerm])

  const loadContracts = async () => {
    setLoading(true)
    try {
      const result = await getContractsAction({
        status: filterStatus,
        search: searchTerm,
      })
      if (result.success) {
        setContracts(result.data as any)
      }
    } catch (error) {
      console.error("Error loading contracts:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const result = await getContractStatsAction()
      if (result.success) {
        setStats(result.data as any)
      }
    } catch (error) {
      console.error("Error loading stats:", error)
    }
  }

  const handleStatusNames = (name: string): string => {
    const statusNames: Record<string, string> = {
      CurrentAndPaid: "Vigente y pagado",
      CurrentAndInDebt: "Al corriente y con deuda",
      Expired: "Vencido",
    }
    return statusNames[name] ?? "Desconocido"
  }

  const handleCreateContract = async (data: any) => {
    setIsSubmitting(true)
    try {
      const { qrId } = await generateQrWithId("CNT")
      const contractDataWithQr = {
        ...data,
        qrCode: qrId,
      }
      const result = await createContractAction(contractDataWithQr)
      if (result.success) {
        setIsFormOpen(false)
        setEditingContract(null)
        loadContracts()
        loadStats()
      }
    } catch (error) {
      console.error("Error creating contract:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateContract = async (data: any) => {
    if (!editingContract) return
    setIsSubmitting(true)
    try {
      const result = await updateContractAction(editingContract.id, data)
      if (result.success) {
        setIsFormOpen(false)
        setEditingContract(null)
        loadContracts()
        loadStats()
      }
    } catch (error) {
      console.error("Error updating contract:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleViewContract = async (id: number) => {
    try {
      const result = await getContractByIdAction(id)
      if (result.success) {
        setSelectedContract(result.data as any)
        setIsViewOpen(true)
      }
    } catch (error) {
      console.error("Error loading contract:", error)
    }
  }

  const handleDeleteContract = async (contractId: number) => {
      try {
        const result = await deleteContractAction(contractId)
        if (result.success) {
          loadContracts()
          loadStats()
        }
      } catch (error) {
        console.error("Error deleting contract:", error)
      }
  }

  const handleEditContract = (contract: Contract) => {
    setEditingContract(contract)
    setIsFormOpen(true)
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
    <>
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Contratos</h1>
          <p className="text-muted-foreground">Administra contratos y documentos</p>
        </div>
        {can(systemPermissions, "Create_Contracts") && (
          <Button
            className="bg-accent hover:bg-accent/90 hover:cursor-pointer"
            onClick={() => {
              setEditingContract(null)
              setIsFormOpen(true)
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Contrato
          </Button>)}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contratos Vigentes y Pagados</CardTitle>
            <CheckCircle className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.CurrentAndPaid}</div>
            <p className="text-xs text-muted-foreground">Activos actualmente</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contratos Vigentes y Con Deuda</CardTitle>
            <Clock className="w-4 h-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.CurrentAndInDebt}</div>
            <p className="text-xs text-muted-foreground">Activos actualmente</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contratos Vencidos</CardTitle>
            <AlertTriangle className="w-4 h-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.Expired}</div>
            <p className="text-xs text-muted-foreground">Vencidos</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Todos los Contratos</CardTitle>
            <div className="flex items-center space-x-2">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="max-w-40 hover:cursor-pointer">
                  <SelectValue placeholder="Filtrar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem className="hover:cursor-pointer" value="all">Todos</SelectItem>
                  <SelectItem className="hover:cursor-pointer" value="CurrentAndPaid">Vigente y pagado</SelectItem>
                  <SelectItem className="hover:cursor-pointer" value="CurrentAndInDebt">Vigente y con deuda</SelectItem>
                  <SelectItem className="hover:cursor-pointer" value="Expired">Vencido</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder="Buscar contratos..."
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
          {loading ? (
            <div className="text-center py-8">Cargando contratos...</div>
          ) : contracts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No hay contratos disponibles</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Contrato</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Vehículo</TableHead>
                  <TableHead>Monto Total</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contracts.map((contract) => {
                  const totalPrice =
                    contract.services?.reduce((sum, s) => {
                      const price = typeof s.price === "number" ? s.price : Number(s.price)
                      return sum + price
                    }, 0) || 0

                  return (
                    <TableRow key={contract.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">CNT-{contract.id}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(contract.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">{contract.clientName}</p>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {contract.vehicle?.brand} {contract.vehicle?.model}
                          </p>
                          <p className="text-sm text-muted-foreground">{contract.vehicle?.licensePlate}</p>
                        </div>
                      </TableCell>
                      <TableCell className="font-bold">${totalPrice.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge
                          className={contract.status === "Expired"
                            ? "bg-destructive"
                            : contract.status === "CurrentAndInDebt"
                              ? "bg-amber-400"
                              : "bg-secondary"}
                        >
                          {handleStatusNames(contract.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewContract(contract.id)}
                            title="Ver detalles"
                            className="hover:cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownloadContract(contract as any)}
                            title="Descargar PDF"
                            className="hover:cursor-pointer"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                          {
                            can(systemPermissions, "Edit_Contracts") && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditContract(contract)}
                                title="Editar"
                                className="hover:cursor-pointer">
                                <Edit className="w-4 h-4" />
                              </Button>
                            )}

                          {can(systemPermissions, "Delete_Contracts") && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setContractToDelete(contract)
                                setIsDeleteConfirmOpen(true)
                              }}
                              className="text-red-500 hover:text-red-700 hover:cursor-pointer"
                              title="Eliminar"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <ContractFormModal
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={editingContract ? handleUpdateContract : handleCreateContract}
        initialData={editingContract}
        isLoading={isSubmitting}
        currentUserId={currentUserId}
      />

      <ContractViewModal contract={selectedContract} open={isViewOpen} onOpenChange={setIsViewOpen} />
               <AlertDialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar Pago</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas eliminar el contrato CNT-{contractToDelete?.id}?
              <br />
              <span className="text-red-500 font-semibold mt-2 block">Esta acción no se puede deshacer.</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-4">
            <AlertDialogCancel className="flex-1 hover:cursor-pointer">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => contractToDelete && handleDeleteContract(contractToDelete.id)}
              className="flex-1 bg-red-500 hover:bg-red-600 hover:cursor-pointer"
            >
              Eliminar
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
      </>
  )
}
