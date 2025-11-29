"use client"

import type React from "react"
import { Button } from "@/src/shared/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/shared/components/ui/dialog"
import { ScrollArea } from "@/src/shared/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/shared/components/ui/card"
import { Car, ClipboardCheck, FileEdit, FileText, Loader2, Wrench, Eye } from 'lucide-react'
import { Badge } from "@/src/shared/components/ui/badge"
import { Separator } from "@/src/shared/components/ui/separator"
import { QuoteFormData, QuoteWithRelations } from "@/src/shared/types/quote"
import { generateQuotePDF } from "@/src/lib/pdf-generator"

interface QuoteReadViewModal {
  open: boolean
  onOpenChange: (open: boolean) => void
  quote: QuoteWithRelations | null
}
const getReadableValue = (value: string | number | boolean | null | undefined): string => {
  if (value === null || value === undefined) return "-"
  if (typeof value === "boolean") return value ? "Sí" : "No"
  return String(value)
}

export function QuoteViewModal({ quote, open, onOpenChange }: QuoteReadViewModal) {
  // TODO: Visualizar quien la realizo
  if (!quote) return null

  const vehicleCheck = quote.vehicleChecks[0] || {}
  const vehicleService = quote.vehicleServices[0] || {}

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[95vh] p-0 gap-0 bg-gradient-to-br from-background to-muted/20 overflow-auto">
        <DialogHeader className="px-6 pt-6 pb-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Eye className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold">Detalles de Cotización QTZ-{quote.id}</DialogTitle>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6 py-4 max-h-[calc(95vh-160px)]">
          <div className="space-y-6 pb-4">
            {/* Vehicle Data Card */}
            <Card className="border-2 shadow-sm">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20">
                <div className="flex items-center gap-2">
                  <Car className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <CardTitle className="text-lg">Datos del Vehículo</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-muted-foreground">Marca</p>
                    <p className="text-base font-medium">{getReadableValue(quote.vehicle.brand)}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-muted-foreground">Modelo</p>
                    <p className="text-base font-medium">{getReadableValue(quote.vehicle.model)}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-muted-foreground">Año</p>
                    <p className="text-base font-medium">{getReadableValue(quote.vehicle.year)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-muted-foreground">Placas</p>
                    <p className="text-base font-medium">{getReadableValue(quote.vehicle.licensePlate)}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-muted-foreground">Tipo de Motor</p>
                    <p className="text-base font-medium">{getReadableValue(quote.vehicle.engineType)}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-muted-foreground">Transmisión</p>
                    <p className="text-base font-medium">{getReadableValue(quote.vehicle.transmission)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-muted-foreground">Número de Motor</p>
                    <p className="text-base font-medium">{getReadableValue(quote.vehicle.engineNumber)}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-muted-foreground">Número de Serie (VIN)</p>
                    <p className="text-base font-medium">{getReadableValue(quote.vehicle.vin)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Vehicle Inspection Card */}
            <Card className="border-2 shadow-sm">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
                <div className="flex items-center gap-2">
                  <ClipboardCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <CardTitle className="text-lg">Inspección del Vehículo</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                {/* Fluid Levels */}
                <div>
                  <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                    <Badge variant="outline">Niveles de Fluidos</Badge>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-3 rounded-lg border bg-muted/50">
                      <p className="text-xs font-semibold text-muted-foreground mb-1">Nivel de Aceite</p>
                      <p className="text-sm font-medium">{getReadableValue(vehicleCheck?.oilLevel)}</p>
                    </div>
                    <div className="p-3 rounded-lg border bg-muted/50">
                      <p className="text-xs font-semibold text-muted-foreground mb-1">Temperatura</p>
                      <p className="text-sm font-medium">{getReadableValue(vehicleCheck?.temperatureLevel)}</p>
                    </div>
                    <div className="p-3 rounded-lg border bg-muted/50">
                      <p className="text-xs font-semibold text-muted-foreground mb-1">Nivel de Gasolina</p>
                      <p className="text-sm font-medium">{getReadableValue(vehicleCheck?.fuelLevel)}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Battery */}
                <div>
                  <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                    <Badge variant="outline">Batería</Badge>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-3 rounded-lg border bg-muted/50">
                      <p className="text-xs font-semibold text-muted-foreground mb-1">Tipo de Batería</p>
                      <p className="text-sm font-medium">{getReadableValue(vehicleCheck?.batteryType)}</p>
                    </div>
                    <div className="p-3 rounded-lg border bg-muted/50">
                      <p className="text-xs font-semibold text-muted-foreground mb-1">Marca de Batería</p>
                      <p className="text-sm font-medium">{getReadableValue(vehicleCheck?.batteryBrand)}</p>
                    </div>
                    <div className="p-3 rounded-lg border bg-muted/50">
                      <p className="text-xs font-semibold text-muted-foreground mb-1">Estado de Batería</p>
                      <p className="text-sm font-medium">{getReadableValue(vehicleCheck?.batteryStatus)}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                    <Badge variant="outline">Daños Externos</Badge>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-3 rounded-lg border bg-muted/50">
                      <p className="text-xs font-semibold text-muted-foreground mb-1">Rayones</p>
                      <p className="text-sm font-medium">{getReadableValue(vehicleCheck?.scratches)}</p>
                    </div>
                    <div className="p-3 rounded-lg border bg-muted/50">
                      <p className="text-xs font-semibold text-muted-foreground mb-1">Abolladuras</p>
                      <p className="text-sm font-medium">{getReadableValue(vehicleCheck?.dents)}</p>
                    </div>
                    <div className="p-3 rounded-lg border bg-muted/50">
                      <p className="text-xs font-semibold text-muted-foreground mb-1">Colisiones Previas</p>
                      <p className="text-sm font-medium">{getReadableValue(vehicleCheck?.collisions)}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                    <Badge variant="outline">Vidrios</Badge>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg border bg-muted/50">
                      <p className="text-xs font-semibold text-muted-foreground mb-1">Estado del Parabrisas</p>
                      <p className="text-sm font-medium">{getReadableValue(vehicleCheck?.windshieldStatus)}</p>
                    </div>
                    <div className="p-3 rounded-lg border bg-muted/50">
                      <p className="text-xs font-semibold text-muted-foreground mb-1">Estado de Cristales</p>
                      <p className="text-sm font-medium">{getReadableValue(vehicleCheck?.glassStatus)}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                    <Badge variant="outline">Fluidos Adicionales</Badge>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg border bg-muted/50">
                      <p className="text-xs font-semibold text-muted-foreground mb-1">Aceite de Transmisión</p>
                      <p className="text-sm font-medium">{getReadableValue(vehicleCheck?.transmissionOil)}</p>
                    </div>
                    <div className="p-3 rounded-lg border bg-muted/50">
                      <p className="text-xs font-semibold text-muted-foreground mb-1">Aceite de Dirección</p>
                      <p className="text-sm font-medium">{getReadableValue(vehicleCheck?.steeringOil)}</p>
                    </div>
                    <div className="p-3 rounded-lg border bg-muted/50">
                      <p className="text-xs font-semibold text-muted-foreground mb-1">Líquido de Frenos</p>
                      <p className="text-sm font-medium">{getReadableValue(vehicleCheck?.brakeFluid)}</p>
                    </div>
                    <div className="p-3 rounded-lg border bg-muted/50">
                      <p className="text-xs font-semibold text-muted-foreground mb-1">Líquido Limpiaparabrisas</p>
                      <p className="text-sm font-medium">{getReadableValue(vehicleCheck?.wiperFluid)}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Engine Oil Status */}
                <div>
                  <h4 className="font-semibold text-sm mb-3">Estado del Aceite de Motor</h4>
                  <div className="inline-flex items-center px-3 py-2 rounded-lg border-2 bg-muted">
                    <p className="text-sm font-medium">{getReadableValue(vehicleCheck?.engineOil)}</p>
                  </div>
                </div>

                <Separator />

                {/* Tires and Brakes */}
                <div>
                  <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                    <Badge variant="outline">Llantas y Frenos</Badge>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg border bg-muted/50">
                      <p className="text-xs font-semibold text-muted-foreground mb-1">Llantas Delanteras</p>
                      <p className="text-sm font-medium">{getReadableValue(vehicleCheck?.frontTires)}</p>
                    </div>
                    <div className="p-3 rounded-lg border bg-muted/50">
                      <p className="text-xs font-semibold text-muted-foreground mb-1">Frenos Delanteros</p>
                      <p className="text-sm font-medium">{getReadableValue(vehicleCheck?.frontBrakes)}</p>
                    </div>
                    <div className="p-3 rounded-lg border bg-muted/50">
                      <p className="text-xs font-semibold text-muted-foreground mb-1">Llantas Traseras</p>
                      <p className="text-sm font-medium">{getReadableValue(vehicleCheck?.rearTires)}</p>
                    </div>
                    <div className="p-3 rounded-lg border bg-muted/50">
                      <p className="text-xs font-semibold text-muted-foreground mb-1">Frenos Traseros</p>
                      <p className="text-sm font-medium">{getReadableValue(vehicleCheck?.rearBrakes)}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                    <Badge variant="outline">Sistemas</Badge>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg border bg-muted/50">
                      <p className="text-xs font-semibold text-muted-foreground mb-1">Inspección de Fugas</p>
                      <p className="text-sm font-medium">{getReadableValue(vehicleCheck?.leakInspection)}</p>
                    </div>
                    <div className="p-3 rounded-lg border bg-muted/50">
                      <p className="text-xs font-semibold text-muted-foreground mb-1">Sistema de Frenos</p>
                      <p className="text-sm font-medium">{getReadableValue(vehicleCheck?.brakeSystem)}</p>
                    </div>
                    <div className="p-3 rounded-lg border bg-muted/50">
                      <p className="text-xs font-semibold text-muted-foreground mb-1">Sistema de Motor</p>
                      <p className="text-sm font-medium">{getReadableValue(vehicleCheck?.engineSystem)}</p>
                    </div>
                    <div className="p-3 rounded-lg border bg-muted/50">
                      <p className="text-xs font-semibold text-muted-foreground mb-1">Sistema de Enfriamiento Motor</p>
                      <p className="text-sm font-medium">{getReadableValue(vehicleCheck?.engineCoolingSystem)}</p>
                    </div>
                    <div className="p-3 rounded-lg border bg-muted/50">
                      <p className="text-xs font-semibold text-muted-foreground mb-1">Sistema de Enfriamiento Transmisión</p>
                      <p className="text-sm font-medium">{getReadableValue(vehicleCheck?.transmissionCoolingSystem)}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                    <Badge variant="outline">Componentes Mecánicos</Badge>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg border bg-muted/50">
                      <p className="text-xs font-semibold text-muted-foreground mb-1">Amortiguadores</p>
                      <p className="text-sm font-medium">{getReadableValue(vehicleCheck?.shockAbsorbers)}</p>
                    </div>
                    <div className="p-3 rounded-lg border bg-muted/50">
                      <p className="text-xs font-semibold text-muted-foreground mb-1">Bandas</p>
                      <p className="text-sm font-medium">{getReadableValue(vehicleCheck?.belts)}</p>
                    </div>
                    <div className="p-3 rounded-lg border bg-muted/50">
                      <p className="text-xs font-semibold text-muted-foreground mb-1">Mangueras</p>
                      <p className="text-sm font-medium">{getReadableValue(vehicleCheck?.hoses)}</p>
                    </div>
                    <div className="p-3 rounded-lg border bg-muted/50">
                      <p className="text-xs font-semibold text-muted-foreground mb-1">Filtro de Aire</p>
                      <p className="text-sm font-medium">{getReadableValue(vehicleCheck?.airFilter)}</p>
                    </div>
                    <div className="p-3 rounded-lg border bg-muted/50">
                      <p className="text-xs font-semibold text-muted-foreground mb-1">Mecanismo de Dirección</p>
                      <p className="text-sm font-medium">{getReadableValue(vehicleCheck?.steeringMechanism)}</p>
                    </div>
                    <div className="p-3 rounded-lg border bg-muted/50">
                      <p className="text-xs font-semibold text-muted-foreground mb-1">Guardapolvos de Flechas</p>
                      <p className="text-sm font-medium">{getReadableValue(vehicleCheck?.dustCoverArrows)}</p>
                    </div>
                    <div className="p-3 rounded-lg border bg-muted/50">
                      <p className="text-xs font-semibold text-muted-foreground mb-1">Sistema de Escape</p>
                      <p className="text-sm font-medium">{getReadableValue(vehicleCheck?.exhaustSystem)}</p>
                    </div>
                    <div className="p-3 rounded-lg border bg-muted/50">
                      <p className="text-xs font-semibold text-muted-foreground mb-1">Barra de Dirección</p>
                      <p className="text-sm font-medium">{getReadableValue(vehicleCheck?.steeringRod)}</p>
                    </div>
                    <div className="p-3 rounded-lg border bg-muted/50">
                      <p className="text-xs font-semibold text-muted-foreground mb-1">Bujes de Suspensión</p>
                      <p className="text-sm font-medium">{getReadableValue(vehicleCheck?.suspensionBushings)}</p>
                    </div>
                    <div className="p-3 rounded-lg border bg-muted/50">
                      <p className="text-xs font-semibold text-muted-foreground mb-1">Baleros</p>
                      <p className="text-sm font-medium">{getReadableValue(vehicleCheck?.bearings)}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Services Card */}
            <Card className="border-2 shadow-sm">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20">
                <div className="flex items-center gap-2">
                  <Wrench className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  <CardTitle className="text-lg">Servicios Requeridos</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { id: "basicMaintenance", label: "Mantenimiento Básico" },
                    { id: "preventiveMaintenance", label: "Mantenimiento Preventivo" },
                    { id: "electronicDiagnostics", label: "Diagnóstico Electrónico" },
                    { id: "fuelSystemService", label: "Servicio Sistema Combustible" },
                    { id: "coolingSystemService", label: "Servicio Sistema Enfriamiento" },
                    { id: "brakeService", label: "Servicio de Frenos" },
                    { id: "suspensionAndSteering", label: "Suspensión y Dirección" },
                    { id: "generalMechanics", label: "Mecánica General" },
                    { id: "electricalSystem", label: "Sistema Eléctrico" },
                    { id: "generalInspection", label: "Inspección General" },
                    { id: "tripInspection", label: "Revisión Previaje" },
                    { id: "emissionsPreparation", label: "Preparación Verificación" },
                    { id: "accessoriesInstallation", label: "Instalación Accesorios" },
                    { id: "repairInsurance", label: "Seguro de Reparación" }
                  ].map((service) => {
                    const isSelected = vehicleService?.[service.id as keyof typeof vehicleService]
                    return (
                      <div
                        key={service.id}
                        className={`p-3 rounded-lg border-2 ${isSelected
                          ? "bg-green-50 border-green-300 dark:bg-green-950/20 dark:border-green-800"
                          : "bg-muted/50 border-border opacity-50"
                          }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${isSelected ? "bg-green-500 border-green-600" : "border-muted-foreground"
                            }`}>
                            {isSelected && <span className="text-white text-xs">✓</span>}
                          </div>
                          <p className="text-sm font-medium">{service.label}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Notes Card */}
            <Card className="border-2 shadow-sm">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
                <div className="flex items-center gap-2">
                  <FileEdit className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  <CardTitle className="text-lg">Notas y Presupuesto</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-muted-foreground">Presupuesto de Reparaciones</p>
                  <div className="p-3 rounded-lg border bg-muted/50">
                    <p className="text-lg font-bold text-green-600 dark:text-green-400">
                      ${Number(quote.repairEstimate || 0).toLocaleString("es-MX", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg border bg-muted/50">
                    <p className="text-xs font-semibold text-muted-foreground mb-1">Chequeo Compra-Venta</p>
                    <p className="text-sm font-medium">{quote.purchaseCheck ? "Sí" : "No"}</p>
                  </div>
                  <div className="p-3 rounded-lg border bg-muted/50">
                    <p className="text-xs font-semibold text-muted-foreground mb-1">Inspección Visual Completa</p>
                    <p className="text-sm font-medium">{quote.fullVisualInspection ? "Sí" : "No"}</p>
                  </div>
                </div>

                {quote.generalNotes && (
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-muted-foreground">Notas Generales</p>
                    <div className="p-3 rounded-lg border bg-muted/50">
                      <p className="text-sm whitespace-pre-wrap">{quote.generalNotes}</p>
                    </div>
                  </div>
                )}

                {quote.chassisReview && (
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-muted-foreground">Revisión de Chasis</p>
                    <div className="p-3 rounded-lg border bg-muted/50">
                      <p className="text-sm whitespace-pre-wrap">{quote.chassisReview}</p>
                    </div>
                  </div>
                )}

                {quote.visibleDamages && (
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-muted-foreground">Daños Visibles</p>
                    <div className="p-3 rounded-lg border bg-muted/50">
                      <p className="text-sm whitespace-pre-wrap">{quote.visibleDamages}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          <div className="px-6 py-4 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1 h-11 hover:cursor-pointer"
              >
                Cerrar
              </Button>

              <Button
                type="button"
                onClick={() => {
                  generateQuotePDF(quote as QuoteFormData, String(quote.id))
                }}
                className="flex-1 h-11 hover:cursor-pointer"
              >
                <FileText className="mr-2 h-4 w-4" />
                Descargar PDF
              </Button>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
