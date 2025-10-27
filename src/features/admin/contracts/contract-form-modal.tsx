"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/src/shared/components/ui/dialog"
import { Button } from "@/src/shared/components/ui/button"
import { Input } from "@/src/shared/components/ui/input"
import { Label } from "@/src/shared/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/shared/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/shared/components/ui/card"
import { Plus, Trash2 } from "lucide-react"
import { getVehiclesAction, getServicesAction } from "@/src/features/admin/contracts/contract.actions"

interface ContractFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: any) => Promise<void>
  initialData?: any
  isLoading?: boolean
}

export function ContractFormModal({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  isLoading = false,
}: ContractFormModalProps) {
  const [vehicles, setVehicles] = useState<any[]>([])
  const [services, setServices] = useState<any[]>([])
  const [selectedServices, setSelectedServices] = useState<Array<{ serviceId: number; price: number }>>([])
  const [formData, setFormData] = useState({
    clientName: "",
    vehicleId: "",
    startDate: "",
    endDate: "",
    status: "CurrentAndPaid",
  })

  useEffect(() => {
    if (open) {
      loadVehiclesAndServices()
      if (initialData) {
        setFormData({
          clientName: initialData.clientName,
          vehicleId: initialData.vehicleId.toString(),
          startDate: new Date(initialData.startDate).toISOString().split("T")[0],
          endDate: initialData.endDate ? new Date(initialData.endDate).toISOString().split("T")[0] : "",
          status: initialData.status,
        })
        setSelectedServices(initialData.services || [])
      }
    }
  }, [open, initialData])

  const loadVehiclesAndServices = async () => {
    try {
      const [vehiclesRes, servicesRes] = await Promise.all([getVehiclesAction(), getServicesAction()])

      if (vehiclesRes.success) setVehicles(vehiclesRes.data as any)
      if (servicesRes.success) setServices(servicesRes.data as any)
    } catch (error) {
      console.error("Error loading data:", error)
    }
  }

  const handleAddService = () => {
    if (services.length > 0) {
      setSelectedServices([
        ...selectedServices,
        {
          serviceId: services[0].id,
          price: Number(services[0].basePrice),
        },
      ])
    }
  }

  const handleRemoveService = (index: number) => {
    setSelectedServices(selectedServices.filter((_, i) => i !== index))
  }

  const handleServiceChange = (index: number, field: string, value: any) => {
    const updated = [...selectedServices]
    if (field === "serviceId") {
      const service = services.find((s) => s.id === Number(value))
      updated[index] = {
        serviceId: Number(value),
        price: service ? Number(service.basePrice) : updated[index].price,
      }
    } else {
      updated[index] = { ...updated[index], [field]: Number(value) }
    }
    setSelectedServices(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit({
      ...formData,
      vehicleId: Number(formData.vehicleId),
      startDate: new Date(formData.startDate),
      endDate: formData.endDate ? new Date(formData.endDate) : undefined,
      services: selectedServices,
      responsibleUser: 1, // TODO: Get from current user
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? "Editar Contrato" : "Crear Nuevo Contrato"}</DialogTitle>
          <DialogDescription>
            {initialData
              ? "Actualiza los detalles del contrato"
              : "Completa la información para crear un nuevo contrato"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Client Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Información del Cliente</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="clientName">Nombre del Cliente</Label>
                <Input
                  id="clientName"
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  placeholder="Nombre completo"
                  required
                />
              </div>
              <div>
                <Label htmlFor="status">Estado</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CurrentAndPaid" >Vigente y pagado</SelectItem>
                    <SelectItem value="CurrentAndInDebt">Vigente y con deuda</SelectItem>
                    <SelectItem value="Expired">Caducado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Vehicle Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Vehículo</CardTitle>
            </CardHeader>
            <CardContent>
              <Label htmlFor="vehicleId">Selecciona un vehículo</Label>
              <Select
                value={formData.vehicleId}
                onValueChange={(value) => setFormData({ ...formData, vehicleId: value })}
              >
                <SelectTrigger id="vehicleId">
                  <SelectValue placeholder="Selecciona un vehículo" />
                </SelectTrigger>
                <SelectContent>
                  {vehicles.map((vehicle) => (
                    <SelectItem key={vehicle.id} value={vehicle.id.toString()}>
                      {vehicle.brand} {vehicle.model} ({vehicle.licensePlate || "Sin placa"})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Services */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Servicios</CardTitle>
              <Button type="button" size="sm" onClick={handleAddService} variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Agregar Servicio
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {selectedServices.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  No hay servicios agregados. Haz clic en "Agregar Servicio"
                </p>
              ) : (
                selectedServices.map((service, index) => (
                  <div key={index} className="flex gap-2 items-end">
                    <div className="flex-1">
                      <Label htmlFor={`service-${index}`} className="text-xs">
                        Servicio
                      </Label>
                      <Select
                        value={service.serviceId.toString()}
                        onValueChange={(value) => handleServiceChange(index, "serviceId", value)}
                      >
                        <SelectTrigger id={`service-${index}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {services.map((svc) => (
                            <SelectItem key={svc.id} value={svc.id.toString()}>
                              {svc.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="w-32">
                      <Label htmlFor={`price-${index}`} className="text-xs">
                        Precio
                      </Label>
                      <Input
                        id={`price-${index}`}
                        type="number"
                        value={service.price}
                        onChange={(e) => handleServiceChange(index, "price", e.target.value)}
                        step="0.01"
                      />
                    </div>
                    <Button type="button" size="sm" variant="destructive" onClick={() => handleRemoveService(index)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Dates */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Vigencia del Contrato</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Fecha Inicio</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="endDate">Fecha Fin (Opcional)</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Guardando..." : initialData ? "Actualizar Contrato" : "Crear Contrato"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
