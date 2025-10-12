"use client"

import { useState } from "react"
import { Button } from "@/src/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/shared/components/ui/card"
import { Input } from "@/src/shared/components/ui/input"
import { Label } from "@/src/shared/components/ui/label"
import { Textarea } from "@/src/shared/components/ui/textarea"
import { Badge } from "@/src/shared/components/ui/badge"
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
import {
  Plus,
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle,
  Search,
  Download,
  Eye,
  Edit,
  QrCode,
} from "lucide-react"

const sampleContracts = [
  {
    id: "CNT-2024-001",
    client: "Juan Pérez",
    email: "juan.perez@email.com",
    phone: "555-0101",
    vehicle: "Honda Civic 2020",
    service: "Seguro Completo",
    amount: 2500,
    startDate: "2024-01-15",
    endDate: "2025-01-15",
    status: "Vigente",
    paymentStatus: "Pagado",
    qrCode: "QR001234567890",
    createdDate: "2024-01-15",
  },
  {
    id: "CNT-2024-002",
    client: "María González",
    email: "maria.gonzalez@email.com",
    phone: "555-0102",
    vehicle: "Toyota Corolla 2019",
    service: "Reparación Motor",
    amount: 3200,
    startDate: "2024-02-20",
    endDate: "2024-08-20",
    status: "Caducado",
    paymentStatus: "Pagado",
    qrCode: "QR001234567891",
    createdDate: "2024-02-20",
  },
  {
    id: "CNT-2024-003",
    client: "Carlos Ruiz",
    email: "carlos.ruiz@email.com",
    phone: "555-0103",
    vehicle: "Nissan Sentra 2021",
    service: "Mantenimiento",
    amount: 1800,
    startDate: "2024-03-10",
    endDate: "2025-03-10",
    status: "Vigente",
    paymentStatus: "Pendiente",
    qrCode: "QR001234567892",
    createdDate: "2024-03-10",
  },
  {
    id: "CNT-2024-004",
    client: "Ana López",
    email: "ana.lopez@email.com",
    phone: "555-0104",
    vehicle: "Ford Focus 2018",
    service: "Pintura y Carrocería",
    amount: 4200,
    startDate: "2024-01-05",
    endDate: "2024-07-05",
    status: "Cancelado",
    paymentStatus: "Reembolsado",
    qrCode: "QR001234567893",
    createdDate: "2024-01-05",
  },
]

export function ContractsManagement() {
  const [isNewContractOpen, setIsNewContractOpen] = useState(false)
  // const [isNewTemplateOpen, setIsNewTemplateOpen] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Contratos</h1>
          <p className="text-muted-foreground">Administra contratos, genera PDFs</p>
        </div>
        <Dialog open={isNewContractOpen} onOpenChange={setIsNewContractOpen}>
          <DialogTrigger asChild>
            <Button className="bg-accent hover:bg-accent/90">
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Contrato
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Contrato</DialogTitle>
              <DialogDescription>Genera un contrato con código QR automático</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contract-client">Cliente</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="juan">Juan Pérez</SelectItem>
                    <SelectItem value="maria">María González</SelectItem>
                    <SelectItem value="carlos">Carlos Ruiz</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="contract-vehicle">Vehículo</Label>
                <Input id="contract-vehicle" placeholder="Honda Civic 2020" />
              </div>
              <div>
                <Label htmlFor="contract-service">Servicio</Label>
                <Input id="contract-service" placeholder="Seguro Completo" />
              </div>
              <div>
                <Label htmlFor="contract-amount">Monto Total</Label>
                <Input id="contract-amount" type="number" placeholder="2500" />
              </div>
              <div>
                <Label htmlFor="contract-duration">Duración (meses)</Label>
                <Input id="contract-duration" type="number" placeholder="12" />
              </div>
              <div>
                <Label htmlFor="contract-start">Fecha Inicio</Label>
                <Input id="contract-start" type="date" />
              </div>
              <div>
                <Label htmlFor="contract-end">Fecha Fin</Label>
                <Input id="contract-end" type="date" />
              </div>
              <div className="col-span-2">
                <Label htmlFor="contract-terms">Términos Especiales</Label>
                <Textarea id="contract-terms" placeholder="Condiciones adicionales del contrato..." />
              </div>
              <div className="col-span-2 flex gap-2">
                <Button onClick={() => setIsNewContractOpen(false)} variant="outline" className="flex-1">
                  Cancelar
                </Button>
                <Button onClick={() => setIsNewContractOpen(false)} className="flex-1 bg-accent hover:bg-accent/90">
                  Crear Contrato y PDF
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Contratos Vigentes</CardTitle>
                <CheckCircle className="w-4 h-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{sampleContracts.filter((c) => c.status === "Vigente").length}</div>
                <p className="text-xs text-muted-foreground">Activos actualmente</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pendientes Pago</CardTitle>
                <Clock className="w-4 h-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {sampleContracts.filter((c) => c.paymentStatus === "Pendiente").length}
                </div>
                <p className="text-xs text-muted-foreground">Requieren pago</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Caducados</CardTitle>
                <AlertTriangle className="w-4 h-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {sampleContracts.filter((c) => c.status === "Caducado").length}
                </div>
                <p className="text-xs text-muted-foreground">Vencidos</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cancelados</CardTitle>
                <XCircle className="w-4 h-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {sampleContracts.filter((c) => c.status === "Cancelado").length}
                </div>
                <p className="text-xs text-muted-foreground">Terminados</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Todos los Contratos</CardTitle>
                <div className="flex items-center space-x-2">
                  <Select>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filtrar estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="vigente">Vigentes</SelectItem>
                      <SelectItem value="caducado">Caducados</SelectItem>
                      <SelectItem value="cancelado">Cancelados</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input placeholder="Buscar contratos..." className="w-64" />
                  <Button variant="outline" size="sm">
                    <Search className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Contrato</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Servicio</TableHead>
                    <TableHead>Monto</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Pago</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sampleContracts.map((contract) => (
                    <TableRow key={contract.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{contract.id}</p>
                          <p className="text-sm text-muted-foreground">{contract.createdDate}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{contract.client}</p>
                          <p className="text-sm text-muted-foreground">{contract.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{contract.service}</p>
                          <p className="text-sm text-muted-foreground">{contract.vehicle}</p>
                        </div>
                      </TableCell>
                      <TableCell>${contract.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            contract.status === "Vigente"
                              ? "default"
                              : contract.status === "Caducado"
                                ? "destructive"
                                : "secondary"
                          }
                        >
                          {contract.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            contract.paymentStatus === "Pagado"
                              ? "default"
                              : contract.paymentStatus === "Pendiente"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {contract.paymentStatus}
                        </Badge>
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
                            <QrCode className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
    </div>
  )
}
