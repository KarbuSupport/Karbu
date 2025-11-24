"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/src/shared/components/ui/dialog"
import { Button } from "@/src/shared/components/ui/button"
import { Input } from "@/src/shared/components/ui/input"
import { Label } from "@/src/shared/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/shared/components/ui/select"
import { Checkbox } from "@/src/shared/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/shared/components/ui/card"
import { FileText, Plus, Trash2 } from "lucide-react"
import { SignaturePad } from "@/src/lib/signature-pad"
import { getServicesAction, getVehiclesAction } from "./contract.actions"

interface ContractFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: any) => Promise<void>
  currentUserId: number | null
  initialData?: any
  isLoading?: boolean
  vehicles?: any[]
  services?: any[]
}

export function ContractFormModal({
  open,
  onOpenChange,
  onSubmit,
  currentUserId,
  initialData,
  isLoading = false,
}: ContractFormModalProps) {
  const [selectedServices, setSelectedServices] = useState<Array<{ serviceId: number; price: number }>>([])
  const [clientSignature, setClientSignature] = useState<string | null>(null)
  const [vehicles, setVehicles] = useState<any[]>([])
  const [services, setServices] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    clientName: "",
    clientRFC: "",
    clientStreet: "",
    clientExteriorNumber: "",
    clientInteriorNumber: "",
    clientNeighborhood: "",
    clientPostalCode: "",
    clientCity: "",
    clientState: "Jalisco",
    marketingConsent: false,
    advertisingConsent: false,
    profecoNumber: "",
    profecoDate: "",
    vehicleId: "",
    startDate: "",
    endDate: "",
    status: "CurrentAndPaid",
  })

  useEffect(() => {
    if (open) {
      if (initialData) {
        setFormData({
          clientName: initialData.clientName,
          clientRFC: initialData.clientRFC || "",
          clientStreet: initialData.clientStreet || "",
          clientExteriorNumber: initialData.clientExteriorNumber || "",
          clientInteriorNumber: initialData.clientInteriorNumber || "",
          clientNeighborhood: initialData.clientNeighborhood || "",
          clientPostalCode: initialData.clientPostalCode || "",
          clientCity: initialData.clientCity || "",
          clientState: initialData.clientState || "Jalisco",
          marketingConsent: initialData.marketingConsent || false,
          advertisingConsent: initialData.advertisingConsent || false,
          profecoNumber: initialData.profecoNumber || "",
          profecoDate: initialData.profecoDate ? new Date(initialData.profecoDate).toISOString().split("T")[0] : "",
          vehicleId: initialData.vehicleId.toString(),
          startDate: new Date(initialData.startDate).toISOString().split("T")[0],
          endDate: initialData.endDate ? new Date(initialData.endDate).toISOString().split("T")[0] : "",
          status: initialData.status,
        })
        setSelectedServices(initialData.services || [])
        setClientSignature(initialData.clientSignature || null)
      }
      loadVehicles();
      loadServices();
    }
  }, [open, initialData])

  const loadVehicles = async () => {
    try {
      const result = await getVehiclesAction()
      if (result.success) {
        setVehicles(result.data as any)
      }
    } catch (error) {
      console.error("Error loading Vehicles", error);
    }
  }

  const loadServices = async () => {
    try {
      const result = await getServicesAction();
      if (result.success) {
        setServices(result.data as any);
      }
    } catch (error) {
      console.error("Error loading Services", error);
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
      profecoDate: formData.profecoDate ? new Date(formData.profecoDate) : undefined,
      services: selectedServices,
      clientSignature: clientSignature,
      responsibleUser: Number(currentUserId),
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="md:min-w-5xl md:max-w-6xl max-w-11/12 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold">{initialData ? "Editar Contrato" : "Crear Nuevo Contrato"}</DialogTitle>
            </div>
          </div>
          {/* <DialogDescription>
            {initialData
              ? "Actualiza los detalles del contrato"
              : "Completa la información para crear un nuevo contrato"}
          </DialogDescription> */}
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Client Info - Básica */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Información del Cliente</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="clientName">Nombre del Cliente *</Label>
                <Input
                  id="clientName"
                  value={formData.clientName}
                  onChange={(e: any) => setFormData({ ...formData, clientName: e.target.value })}
                  placeholder="Nombre completo"
                  required
                />
              </div>
              <div>
                <Label htmlFor="clientRFC">RFC</Label>
                <Input
                  id="clientRFC"
                  value={formData.clientRFC}
                  onChange={(e: any) => setFormData({ ...formData, clientRFC: e.target.value })}
                  placeholder="RFC del cliente"
                />
              </div>
              <div>
                <Label htmlFor="status">Estado del Contrato *</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: any) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CurrentAndPaid">Vigente y pagado</SelectItem>
                    <SelectItem value="CurrentAndInDebt">Vigente y con deuda</SelectItem>
                    <SelectItem value="Expired">Vencido</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Client Address */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Dirección del Cliente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="clientStreet">Calle</Label>
                <Input
                  id="clientStreet"
                  value={formData.clientStreet}
                  onChange={(e: any) => setFormData({ ...formData, clientStreet: e.target.value })}
                  placeholder="Nombre de la calle"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="clientExteriorNumber">Número Exterior</Label>
                  <Input
                    id="clientExteriorNumber"
                    value={formData.clientExteriorNumber}
                    onChange={(e: any) => setFormData({ ...formData, clientExteriorNumber: e.target.value })}
                    placeholder="No. exterior"
                  />
                </div>
                <div>
                  <Label htmlFor="clientInteriorNumber">Número Interior</Label>
                  <Input
                    id="clientInteriorNumber"
                    value={formData.clientInteriorNumber}
                    onChange={(e: any) => setFormData({ ...formData, clientInteriorNumber: e.target.value })}
                    placeholder="No. interior"
                  />
                </div>
                <div>
                  <Label htmlFor="clientPostalCode">Código Postal</Label>
                  <Input
                    id="clientPostalCode"
                    value={formData.clientPostalCode}
                    onChange={(e: any) => setFormData({ ...formData, clientPostalCode: e.target.value })}
                    placeholder="Código postal"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="clientNeighborhood">Colonia</Label>
                  <Input
                    id="clientNeighborhood"
                    value={formData.clientNeighborhood}
                    onChange={(e: any) => setFormData({ ...formData, clientNeighborhood: e.target.value })}
                    placeholder="Colonia"
                  />
                </div>
                <div>
                  <Label htmlFor="clientCity">Ciudad</Label>
                  <Input
                    id="clientCity"
                    value={formData.clientCity}
                    onChange={(e: any) => setFormData({ ...formData, clientCity: e.target.value })}
                    placeholder="Ciudad"
                  />
                </div>
                <div>
                  <Label htmlFor="clientState">Estado</Label>
                  <Input
                    id="clientState"
                    value={formData.clientState}
                    onChange={(e: any) => setFormData({ ...formData, clientState: e.target.value })}
                    placeholder="Estado"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* PROFECO */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Información PROFECO</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="profecoNumber">Número de Registro PROFECO</Label>
                <Input
                  id="profecoNumber"
                  value={formData.profecoNumber}
                  onChange={(e: any) => setFormData({ ...formData, profecoNumber: e.target.value })}
                  placeholder="Número PROFECO"
                />
              </div>
              <div>
                <Label htmlFor="profecoDate">Fecha de Registro PROFECO</Label>
                <Input
                  id="profecoDate"
                  type="date"
                  value={formData.profecoDate}
                  onChange={(e: any) => setFormData({ ...formData, profecoDate: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Consentimientos */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Consentimientos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="marketingConsent"
                  checked={formData.marketingConsent}
                  onCheckedChange={(checked: any) => setFormData({ ...formData, marketingConsent: checked as boolean })}
                />
                <Label htmlFor="marketingConsent" className="hover:cursor-pointer">
                  Autorización para uso de datos mercadotécnicos
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="advertisingConsent"
                  checked={formData.advertisingConsent}
                  onCheckedChange={(checked: any) =>
                    setFormData({ ...formData, advertisingConsent: checked as boolean })
                  }
                />
                <Label htmlFor="advertisingConsent" className="hover:cursor-pointer">
                  Autorización para recibir publicidad
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Vehicle Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Vehículo</CardTitle>
            </CardHeader>
            <CardContent>
              <Label htmlFor="vehicleId">Selecciona un vehículo *</Label>
              <Select
                value={formData.vehicleId}
                onValueChange={(value: any) => setFormData({ ...formData, vehicleId: value })}
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
              <Button
                type="button"
                size="sm"
                onClick={handleAddService}
                variant="outline"
                className="hover:cursor-pointer bg-transparent"
              >
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
                        onValueChange={(value: any) => handleServiceChange(index, "serviceId", value)}
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
                        onChange={(e: any) => handleServiceChange(index, "price", e.target.value)}
                        step="0.01"
                      />
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      onClick={() => handleRemoveService(index)}
                      className="hover:cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Dates and Signature */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Vigencia del Contrato</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Fecha Inicio *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e: any) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="endDate">Fecha Fin (Opcional)</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e: any) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Signature Pad */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Firma del Cliente</CardTitle>
            </CardHeader>
            <CardContent>
              <SignaturePad onSignatureChange={setClientSignature} />
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="hover:cursor-pointer"
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading} className="hover:cursor-pointer">
              {isLoading ? "Guardando..." : initialData ? "Actualizar Contrato" : "Crear Contrato"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
