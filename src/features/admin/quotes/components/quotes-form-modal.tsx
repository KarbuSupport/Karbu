"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/src/shared/components/ui/button"
import { Input } from "@/src/shared/components/ui/input"
import { Label } from "@/src/shared/components/ui/label"
import { Textarea } from "@/src/shared/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/shared/components/ui/select"
import { Checkbox } from "@/src/shared/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/src/shared/components/ui/radio-group"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/src/shared/components/ui/dialog"
import { ScrollArea } from "@/src/shared/components/ui/scroll-area"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/shared/components/ui/card"
import { createQuoteAction, updateQuoteAction } from "@/src/features/admin/quotes/quotes.actions"
import type { QuoteFormData, QuoteWithRelations } from "@/src/shared/types/quote"
import { useToast } from "@/src/shared/hooks/use-toast"
import { Car, ClipboardCheck, FileEdit, FileText, Loader2, Wrench } from "lucide-react"
import { Badge } from "@/src/shared/components/ui/badge"
import { Separator } from "@/src/shared/components/ui/separator"
import { generateQuotePDF } from "@/src/lib/pdf-generator"
import { formQuoteModel } from "@/src/shared/models/quotes"

interface QuoteFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  quote?: QuoteWithRelations | null
  onSuccess?: () => void
  isEdit?: Boolean
}

export function QuoteFormModal({ open, onOpenChange, quote, onSuccess, isEdit }: QuoteFormModalProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [savedQuoteId, setSavedQuoteId] = useState<string | null>(null)
  const [formData, setFormData] = useState<QuoteFormData>(formQuoteModel)

  // Load quote data when editing
  useEffect(() => {
    if (!isEdit) {
      setFormData(formQuoteModel);
    }
    if (quote) {
      setFormData({
        vehicle: {
          id: quote.vehicle.id,
          brand: quote.vehicle.brand,
          model: quote.vehicle.model,
          year: quote.vehicle.year,
          engineType: quote.vehicle.engineType,
          transmission: quote.vehicle.transmission,
          licensePlate: quote.vehicle.licensePlate || "",
          engineNumber: quote.vehicle.engineNumber || "",
          vin: quote.vehicle.vin || "",
        },
        generalNotes: quote.generalNotes || "",
        repairEstimate: quote.repairEstimate ? Number(quote.repairEstimate) : 0,
        purchaseCheck: quote.purchaseCheck,
        fullVisualInspection: quote.fullVisualInspection,
        chassisReview: quote.chassisReview || "",
        visibleDamages: quote.visibleDamages || "",
        vehicleCheck: quote.vehicleChecks[0] || {},
        vehicleService: quote.vehicleServices[0] || {
          basicMaintenance: false,
          preventiveMaintenance: false,
          electronicDiagnostics: false,
          fuelSystemService: false,
          coolingSystemService: false,
          brakeService: false,
          suspensionAndSteering: false,
          generalMechanics: false,
          electricalSystem: false,
          generalInspection: false,
          tripInspection: false,
          emissionsPreparation: false,
          accessoriesInstallation: false,
          repairInsurance: false
        },
      })
    }
  }, [quote])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const result = quote ? await updateQuoteAction(quote.id, formData) : await createQuoteAction(formData)

      if (result.success) {
        setSavedQuoteId(result.data?.id.toString() || quote?.id.toString() || null)

        toast({
          title: quote ? "Cotización actualizada" : "Cotización creada",
          description: quote ? "La cotización se actualizó correctamente" : "La cotización se creó correctamente",
        })

        if (!quote) {
          // For new quotes, show success and keep modal open for PDF
        } else {
          onOpenChange(false)
        }

        onSuccess?.()
        onOpenChange(false)
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Ocurrió un error inesperado",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGeneratePDF = () => {
    try {
      generateQuotePDF(formData, String(savedQuoteId || quote?.id || ""))

      toast({
        title: "PDF generado",
        description: "El PDF de la cotización se ha descargado correctamente",
      })
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo generar el PDF",
        variant: "destructive",
      })
    }
  }

  return (<Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="md:max-w-5xl max-h-[95vh] p-0 gap-0 bg-gradient-to-br from-background to-muted/20 overflow-auto">
      <DialogHeader className="px-6 pt-6 pb-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div>
            <DialogTitle className="text-2xl font-bold">
              {quote ? "Editar Cotización" : "Nueva Cotización"}
            </DialogTitle>
            {/* <DialogDescription className="text-sm mt-1">
              {quote ? "Actualiza los datos de la cotización" : "Completa los datos para crear una nueva cotización"}
            </DialogDescription> */}
          </div>
        </div>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="flex flex-col h-full">
        <ScrollArea className="flex-1 px-6 py-4">
          <div className="space-y-6 pb-4">
            {/* Vehicle Data Card */}
            <Card className="border-2 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20">
                <div className="flex items-center gap-2">
                  <Car className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <CardTitle className="text-lg">Datos del Vehículo</CardTitle>
                </div>
                <CardDescription>Información básica del vehículo a inspeccionar</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="brand" className="text-sm font-semibold">
                      Marca <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="brand"
                      placeholder="Ej: Toyota"
                      className="h-11"
                      value={formData.vehicle.brand}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          vehicle: { ...formData.vehicle, brand: e.target.value },
                        })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="model" className="text-sm font-semibold">
                      Modelo <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="model"
                      placeholder="Ej: Corolla"
                      className="h-11"
                      value={formData.vehicle.model}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          vehicle: { ...formData.vehicle, model: e.target.value },
                        })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="year" className="text-sm font-semibold">
                      Año <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="year"
                      type="number"
                      placeholder="2024"
                      className="h-11"
                      value={formData.vehicle.year}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          vehicle: { ...formData.vehicle, year: Number.parseInt(e.target.value) },
                        })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="licensePlate" className="text-sm font-semibold">
                      Placas
                    </Label>
                    <Input
                      id="licensePlate"
                      placeholder="ABC-123"
                      className="h-11 uppercase"
                      value={formData.vehicle.licensePlate}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          vehicle: { ...formData.vehicle, licensePlate: e.target.value.toUpperCase() },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="engineType" className="text-sm font-semibold">
                      Tipo de Motor <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={formData.vehicle.engineType}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
                          vehicle: { ...formData.vehicle, engineType: value },
                        })
                      }
                      required
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Seleccionar tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gasolina">Gasolina</SelectItem>
                        <SelectItem value="diesel">Diesel</SelectItem>
                        <SelectItem value="hibrido">Híbrido</SelectItem>
                        <SelectItem value="electrico">Eléctrico</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="transmission" className="text-sm font-semibold">
                      Transmisión <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={formData.vehicle.transmission}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
                          vehicle: { ...formData.vehicle, transmission: value },
                        })
                      }
                      required
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Seleccionar tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manual">Manual</SelectItem>
                        <SelectItem value="automatica">Automática</SelectItem>
                        <SelectItem value="cvt">CVT</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="engineNumber" className="text-sm font-semibold">
                      Número de Motor
                    </Label>
                    <Input
                      id="engineNumber"
                      type="text"
                      placeholder="Ej: PJ12345U123456 - CAXA"
                      className="h-11"
                      value={formData.vehicle.engineNumber}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          vehicle: { ...formData.vehicle, engineNumber: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vin" className="text-sm font-semibold">
                      Número de Serie (NIV o VIN)
                    </Label>
                    <Input
                      id="vin"
                      type="text"
                      placeholder="Ej: 1HGCM45869F123456"
                      className="h-11"
                      value={formData.vehicle.vin}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          vehicle: { ...formData.vehicle, vin: e.target.value },
                        })
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Vehicle Inspection Card */}
            <Card className="border-2 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
                <div className="flex items-center gap-2">
                  <ClipboardCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <CardTitle className="text-lg">Inspección del Vehículo</CardTitle>
                </div>
                <CardDescription>Estado general y revisión de componentes</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                {/* Fluid Levels */}
                <div>
                  <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                    <Badge variant="outline">Niveles de Fluidos</Badge>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Nivel de Aceite</Label>
                      <Select
                        value={formData.vehicleCheck?.oilLevel ?? undefined}
                        onValueChange={(value) =>
                          setFormData({
                            ...formData,
                            vehicleCheck: { ...formData.vehicleCheck!, oilLevel: value },
                          })
                        }
                      >
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="normal">✓ Normal</SelectItem>
                          <SelectItem value="bajo">⚠ Bajo</SelectItem>
                          <SelectItem value="critico">✗ Crítico</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Temperatura</Label>
                      <Select
                        value={formData.vehicleCheck?.temperatureLevel ?? undefined}
                        onValueChange={(value) =>
                          setFormData({
                            ...formData,
                            vehicleCheck: { ...formData.vehicleCheck!, temperatureLevel: value },
                          })
                        }
                      >
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="normal">✓ Normal</SelectItem>
                          <SelectItem value="alto">⚠ Alto</SelectItem>
                          <SelectItem value="sobrecalentamiento">✗ Sobrecalentamiento</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Nivel de Gasolina</Label>
                      <Select
                        value={formData.vehicleCheck?.fuelLevel ?? undefined}
                        onValueChange={(value) =>
                          setFormData({
                            ...formData,
                            vehicleCheck: { ...formData.vehicleCheck!, fuelLevel: value },
                          })
                        }
                      >
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="lleno">Lleno</SelectItem>
                          <SelectItem value="medio">Medio</SelectItem>
                          <SelectItem value="bajo">Bajo</SelectItem>
                          <SelectItem value="vacio">Vacío</SelectItem>
                        </SelectContent>
                      </Select>
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
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Tipo de Batería</Label>
                      <Input
                        placeholder="Ej: AGM, Plomo-ácido"
                        className="h-10"
                        value={formData.vehicleCheck?.batteryType ?? undefined}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            vehicleCheck: { ...formData.vehicleCheck!, batteryType: e.target.value },
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Marca de Batería</Label>
                      <Input
                        placeholder="Ej: LTH, Bosch"
                        className="h-10"
                        value={formData.vehicleCheck?.batteryBrand ?? undefined}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            vehicleCheck: { ...formData.vehicleCheck!, batteryBrand: e.target.value },
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Estado de Batería</Label>
                      <Select
                        value={formData.vehicleCheck?.batteryStatus ?? undefined}
                        onValueChange={(value) =>
                          setFormData({
                            ...formData,
                            vehicleCheck: { ...formData.vehicleCheck!, batteryStatus: value },
                          })
                        }
                      >
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="excelente">Excelente</SelectItem>
                          <SelectItem value="bueno">Bueno</SelectItem>
                          <SelectItem value="regular">Regular</SelectItem>
                          <SelectItem value="malo">Malo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                    <Badge variant="outline">Daños Externos</Badge>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Rayones</Label>
                      <Select
                        value={formData.vehicleCheck?.scratches ?? undefined}
                        onValueChange={(value) =>
                          setFormData({
                            ...formData,
                            vehicleCheck: { ...formData.vehicleCheck!, scratches: value },
                          })
                        }
                      >
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ninguno">Ninguno</SelectItem>
                          <SelectItem value="leves">Leves</SelectItem>
                          <SelectItem value="moderados">Moderados</SelectItem>
                          <SelectItem value="severos">Severos</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Abolladuras</Label>
                      <Select
                        value={formData.vehicleCheck?.dents ?? undefined}
                        onValueChange={(value) =>
                          setFormData({
                            ...formData,
                            vehicleCheck: { ...formData.vehicleCheck!, dents: value },
                          })
                        }
                      >
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ninguna">Ninguna</SelectItem>
                          <SelectItem value="leves">Leves</SelectItem>
                          <SelectItem value="moderadas">Moderadas</SelectItem>
                          <SelectItem value="severas">Severas</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Colisiones Previas</Label>
                      <Select
                        value={formData.vehicleCheck?.collisions ?? undefined}
                        onValueChange={(value) =>
                          setFormData({
                            ...formData,
                            vehicleCheck: { ...formData.vehicleCheck!, collisions: value },
                          })
                        }
                      >
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ninguna">Ninguna</SelectItem>
                          <SelectItem value="menor">Menor</SelectItem>
                          <SelectItem value="moderada">Moderada</SelectItem>
                          <SelectItem value="severa">Severa</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                    <Badge variant="outline">Vidrios</Badge>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Estado del Parabrisas</Label>
                      <Select
                        value={formData.vehicleCheck?.windshieldStatus ?? undefined}
                        onValueChange={(value) =>
                          setFormData({
                            ...formData,
                            vehicleCheck: { ...formData.vehicleCheck!, windshieldStatus: value },
                          })
                        }
                      >
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="excelente">Excelente</SelectItem>
                          <SelectItem value="bueno">Bueno</SelectItem>
                          <SelectItem value="picaduras">Con Picaduras</SelectItem>
                          <SelectItem value="estrellado">Estrellado</SelectItem>
                          <SelectItem value="requiere-cambio">Requiere Cambio</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Estado de Cristales</Label>
                      <Select
                        value={formData.vehicleCheck?.glassStatus ?? undefined}
                        onValueChange={(value) =>
                          setFormData({
                            ...formData,
                            vehicleCheck: { ...formData.vehicleCheck!, glassStatus: value },
                          })
                        }
                      >
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="excelente">Excelente</SelectItem>
                          <SelectItem value="bueno">Bueno</SelectItem>
                          <SelectItem value="rayados">Rayados</SelectItem>
                          <SelectItem value="rotos">Rotos</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                    <Badge variant="outline">Fluidos Adicionales</Badge>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Aceite de Transmisión</Label>
                      <Select
                        value={formData.vehicleCheck?.transmissionOil ?? undefined}
                        onValueChange={(value) =>
                          setFormData({
                            ...formData,
                            vehicleCheck: { ...formData.vehicleCheck!, transmissionOil: value },
                          })
                        }
                      >
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="excelente">Excelente</SelectItem>
                          <SelectItem value="bueno">Bueno</SelectItem>
                          <SelectItem value="regular">Regular</SelectItem>
                          <SelectItem value="requiere-cambio">Requiere Cambio</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Aceite de Dirección</Label>
                      <Select
                        value={formData.vehicleCheck?.steeringOil ?? undefined}
                        onValueChange={(value) =>
                          setFormData({
                            ...formData,
                            vehicleCheck: { ...formData.vehicleCheck!, steeringOil: value },
                          })
                        }
                      >
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="excelente">Excelente</SelectItem>
                          <SelectItem value="bueno">Bueno</SelectItem>
                          <SelectItem value="bajo">Bajo</SelectItem>
                          <SelectItem value="requiere-cambio">Requiere Cambio</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Líquido de Frenos</Label>
                      <Select
                        value={formData.vehicleCheck?.brakeFluid ?? undefined}
                        onValueChange={(value) =>
                          setFormData({
                            ...formData,
                            vehicleCheck: { ...formData.vehicleCheck!, brakeFluid: value },
                          })
                        }
                      >
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="excelente">Excelente</SelectItem>
                          <SelectItem value="bueno">Bueno</SelectItem>
                          <SelectItem value="bajo">Bajo</SelectItem>
                          <SelectItem value="contaminado">Contaminado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Líquido Limpiaparabrisas</Label>
                      <Select
                        value={formData.vehicleCheck?.wiperFluid ?? undefined}
                        onValueChange={(value) =>
                          setFormData({
                            ...formData,
                            vehicleCheck: { ...formData.vehicleCheck!, wiperFluid: value },
                          })
                        }
                      >
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="lleno">Lleno</SelectItem>
                          <SelectItem value="medio">Medio</SelectItem>
                          <SelectItem value="bajo">Bajo</SelectItem>
                          <SelectItem value="vacio">Vacío</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Engine Oil Status */}
                <div>
                  <h4 className="font-semibold text-sm mb-3">Estado del Aceite de Motor</h4>
                  <RadioGroup
                    value={formData.vehicleCheck?.engineOil ?? undefined}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        vehicleCheck: { ...formData.vehicleCheck!, engineOil: value },
                      })
                    }
                    className="flex flex-wrap gap-4"
                  >
                    <div className="flex items-center space-x-2 px-4 py-2 rounded-lg border-2 border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-800">
                      <RadioGroupItem value="verde" id="verde" />
                      <Label
                        htmlFor="verde"
                        className="text-green-700 dark:text-green-400 font-medium cursor-pointer"
                      >
                        Verde (Excelente)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 px-4 py-2 rounded-lg border-2 border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20 dark:border-yellow-800">
                      <RadioGroupItem value="amarillo" id="amarillo" />
                      <Label
                        htmlFor="amarillo"
                        className="text-yellow-700 dark:text-yellow-400 font-medium cursor-pointer"
                      >
                        Amarillo (Regular)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 px-4 py-2 rounded-lg border-2 border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-800">
                      <RadioGroupItem value="rojo" id="rojo" />
                      <Label htmlFor="rojo" className="text-red-700 dark:text-red-400 font-medium cursor-pointer">
                        Rojo (Crítico)
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <Separator />

                {/* Tires and Brakes */}
                <div>
                  <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                    <Badge variant="outline">Llantas y Frenos</Badge>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Llantas Delanteras</Label>
                      <Select
                        value={formData.vehicleCheck?.frontTires ?? undefined}
                        onValueChange={(value) =>
                          setFormData({
                            ...formData,
                            vehicleCheck: { ...formData.vehicleCheck!, frontTires: value },
                          })
                        }
                      >
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="excelente">Excelente (90-100%)</SelectItem>
                          <SelectItem value="bueno">Bueno (70-89%)</SelectItem>
                          <SelectItem value="regular">Regular (50-69%)</SelectItem>
                          <SelectItem value="malo">Malo (30-49%)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Frenos Delanteros</Label>
                      <Select
                        value={formData.vehicleCheck?.frontBrakes ?? undefined}
                        onValueChange={(value) =>
                          setFormData({
                            ...formData,
                            vehicleCheck: { ...formData.vehicleCheck!, frontBrakes: value },
                          })
                        }
                      >
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="excelente">Excelente</SelectItem>
                          <SelectItem value="bueno">Bueno</SelectItem>
                          <SelectItem value="regular">Regular</SelectItem>
                          <SelectItem value="requiere-cambio">Requiere Cambio</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Llantas Traseras</Label>
                      <Select
                        value={formData.vehicleCheck?.rearTires ?? undefined}
                        onValueChange={(value) =>
                          setFormData({
                            ...formData,
                            vehicleCheck: { ...formData.vehicleCheck!, rearTires: value },
                          })
                        }
                      >
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="excelente">Excelente (90-100%)</SelectItem>
                          <SelectItem value="bueno">Bueno (70-89%)</SelectItem>
                          <SelectItem value="regular">Regular (50-69%)</SelectItem>
                          <SelectItem value="malo">Malo (30-49%)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Frenos Traseros</Label>
                      <Select
                        value={formData.vehicleCheck?.rearBrakes ?? undefined}
                        onValueChange={(value) =>
                          setFormData({
                            ...formData,
                            vehicleCheck: { ...formData.vehicleCheck!, rearBrakes: value },
                          })
                        }
                      >
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="excelente">Excelente</SelectItem>
                          <SelectItem value="bueno">Bueno</SelectItem>
                          <SelectItem value="regular">Regular</SelectItem>
                          <SelectItem value="requiere-cambio">Requiere Cambio</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                    <Badge variant="outline">Sistemas</Badge>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Inspección de Fugas</Label>
                      <Select
                        value={formData.vehicleCheck?.leakInspection ?? undefined}
                        onValueChange={(value) =>
                          setFormData({
                            ...formData,
                            vehicleCheck: { ...formData.vehicleCheck!, leakInspection: value },
                          })
                        }
                      >
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sin-fugas">Sin Fugas</SelectItem>
                          <SelectItem value="fuga-menor">Fuga Menor</SelectItem>
                          <SelectItem value="fuga-moderada">Fuga Moderada</SelectItem>
                          <SelectItem value="fuga-severa">Fuga Severa</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Sistema de Frenos</Label>
                      <Select
                        value={formData.vehicleCheck?.brakeSystem ?? undefined}
                        onValueChange={(value) =>
                          setFormData({
                            ...formData,
                            vehicleCheck: { ...formData.vehicleCheck!, brakeSystem: value },
                          })
                        }
                      >
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="excelente">Excelente</SelectItem>
                          <SelectItem value="bueno">Bueno</SelectItem>
                          <SelectItem value="requiere-atencion">Requiere Atención</SelectItem>
                          <SelectItem value="critico">Crítico</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Sistema de Motor</Label>
                      <Select
                        value={formData.vehicleCheck?.engineSystem ?? undefined}
                        onValueChange={(value) =>
                          setFormData({
                            ...formData,
                            vehicleCheck: { ...formData.vehicleCheck!, engineSystem: value },
                          })
                        }
                      >
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="excelente">Excelente</SelectItem>
                          <SelectItem value="bueno">Bueno</SelectItem>
                          <SelectItem value="requiere-atencion">Requiere Atención</SelectItem>
                          <SelectItem value="critico">Crítico</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Sistema de Enfriamiento Motor</Label>
                      <Select
                        value={formData.vehicleCheck?.engineCoolingSystem ?? undefined}
                        onValueChange={(value) =>
                          setFormData({
                            ...formData,
                            vehicleCheck: { ...formData.vehicleCheck!, engineCoolingSystem: value },
                          })
                        }
                      >
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="excelente">Excelente</SelectItem>
                          <SelectItem value="bueno">Bueno</SelectItem>
                          <SelectItem value="requiere-atencion">Requiere Atención</SelectItem>
                          <SelectItem value="critico">Crítico</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Sistema de Enfriamiento Transmisión</Label>
                      <Select
                        value={formData.vehicleCheck?.transmissionCoolingSystem ?? undefined}
                        onValueChange={(value) =>
                          setFormData({
                            ...formData,
                            vehicleCheck: { ...formData.vehicleCheck!, transmissionCoolingSystem: value },
                          })
                        }
                      >
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="excelente">Excelente</SelectItem>
                          <SelectItem value="bueno">Bueno</SelectItem>
                          <SelectItem value="requiere-atencion">Requiere Atención</SelectItem>
                          <SelectItem value="no-aplica">No Aplica</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                    <Badge variant="outline">Componentes Mecánicos</Badge>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Amortiguadores</Label>
                      <Select
                        value={formData.vehicleCheck?.shockAbsorbers ?? undefined}
                        onValueChange={(value) =>
                          setFormData({
                            ...formData,
                            vehicleCheck: { ...formData.vehicleCheck!, shockAbsorbers: value },
                          })
                        }
                      >
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="excelente">Excelente</SelectItem>
                          <SelectItem value="bueno">Bueno</SelectItem>
                          <SelectItem value="desgastados">Desgastados</SelectItem>
                          <SelectItem value="requiere-cambio">Requiere Cambio</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Bandas</Label>
                      <Select
                        value={formData.vehicleCheck?.belts ?? undefined}
                        onValueChange={(value) =>
                          setFormData({
                            ...formData,
                            vehicleCheck: { ...formData.vehicleCheck!, belts: value },
                          })
                        }
                      >
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="excelente">Excelente</SelectItem>
                          <SelectItem value="bueno">Bueno</SelectItem>
                          <SelectItem value="desgastadas">Desgastadas</SelectItem>
                          <SelectItem value="requiere-cambio">Requiere Cambio</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Mangueras</Label>
                      <Select
                        value={formData.vehicleCheck?.hoses ?? undefined}
                        onValueChange={(value) =>
                          setFormData({
                            ...formData,
                            vehicleCheck: { ...formData.vehicleCheck!, hoses: value },
                          })
                        }
                      >
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="excelente">Excelente</SelectItem>
                          <SelectItem value="bueno">Bueno</SelectItem>
                          <SelectItem value="agrietadas">Agrietadas</SelectItem>
                          <SelectItem value="requiere-cambio">Requiere Cambio</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Filtro de Aire</Label>
                      <Select
                        value={formData.vehicleCheck?.airFilter ?? undefined}
                        onValueChange={(value) =>
                          setFormData({
                            ...formData,
                            vehicleCheck: { ...formData.vehicleCheck!, airFilter: value },
                          })
                        }
                      >
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="limpio">Limpio</SelectItem>
                          <SelectItem value="sucio">Sucio</SelectItem>
                          <SelectItem value="muy-sucio">Muy Sucio</SelectItem>
                          <SelectItem value="requiere-cambio">Requiere Cambio</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Mecanismo de Dirección</Label>
                      <Select
                        value={formData.vehicleCheck?.steeringMechanism ?? undefined}
                        onValueChange={(value) =>
                          setFormData({
                            ...formData,
                            vehicleCheck: { ...formData.vehicleCheck!, steeringMechanism: value },
                          })
                        }
                      >
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="excelente">Excelente</SelectItem>
                          <SelectItem value="bueno">Bueno</SelectItem>
                          <SelectItem value="holgura">Con Holgura</SelectItem>
                          <SelectItem value="requiere-atencion">Requiere Atención</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Guardapolvos de Flechas</Label>
                      <Select
                        value={formData.vehicleCheck?.dustCoverArrows ?? undefined}
                        onValueChange={(value) =>
                          setFormData({
                            ...formData,
                            vehicleCheck: { ...formData.vehicleCheck!, dustCoverArrows: value },
                          })
                        }
                      >
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="excelente">Excelente</SelectItem>
                          <SelectItem value="bueno">Bueno</SelectItem>
                          <SelectItem value="rotos">Rotos</SelectItem>
                          <SelectItem value="requiere-cambio">Requiere Cambio</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Sistema de Escape</Label>
                      <Select
                        value={formData.vehicleCheck?.exhaustSystem ?? undefined}
                        onValueChange={(value) =>
                          setFormData({
                            ...formData,
                            vehicleCheck: { ...formData.vehicleCheck!, exhaustSystem: value },
                          })
                        }
                      >
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="excelente">Excelente</SelectItem>
                          <SelectItem value="bueno">Bueno</SelectItem>
                          <SelectItem value="oxidado">Oxidado</SelectItem>
                          <SelectItem value="requiere-cambio">Requiere Cambio</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Barra de Dirección</Label>
                      <Select
                        value={formData.vehicleCheck?.steeringRod ?? undefined}
                        onValueChange={(value) =>
                          setFormData({
                            ...formData,
                            vehicleCheck: { ...formData.vehicleCheck!, steeringRod: value },
                          })
                        }
                      >
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="excelente">Excelente</SelectItem>
                          <SelectItem value="bueno">Bueno</SelectItem>
                          <SelectItem value="desgastada">Desgastada</SelectItem>
                          <SelectItem value="requiere-cambio">Requiere Cambio</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Bujes de Suspensión</Label>
                      <Select
                        value={formData.vehicleCheck?.suspensionBushings ?? undefined}
                        onValueChange={(value) =>
                          setFormData({
                            ...formData,
                            vehicleCheck: { ...formData.vehicleCheck!, suspensionBushings: value },
                          })
                        }
                      >
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="excelente">Excelente</SelectItem>
                          <SelectItem value="bueno">Bueno</SelectItem>
                          <SelectItem value="desgastados">Desgastados</SelectItem>
                          <SelectItem value="requiere-cambio">Requiere Cambio</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Baleros</Label>
                      <Select
                        value={formData.vehicleCheck?.bearings ?? undefined}
                        onValueChange={(value) =>
                          setFormData({
                            ...formData,
                            vehicleCheck: { ...formData.vehicleCheck!, bearings: value },
                          })
                        }
                      >
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="excelente">Excelente</SelectItem>
                          <SelectItem value="bueno">Bueno</SelectItem>
                          <SelectItem value="ruido">Con Ruido</SelectItem>
                          <SelectItem value="requiere-cambio">Requiere Cambio</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Services Card */}
            <Card className="border-2 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20">
                <div className="flex items-center gap-2">
                  <Wrench className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  <CardTitle className="text-lg">Servicios Requeridos</CardTitle>
                </div>
                <CardDescription>Selecciona los servicios que necesita el vehículo</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { id: "basicMaintenance", label: "Mantenimiento Básico (aceite, filtros, bujías)" },
                    { id: "preventiveMaintenance", label: "Mantenimiento Preventivo (limpiezas y ajustes)" },
                    { id: "electronicDiagnostics", label: "Diagnóstico y Escaneo Electrónico" },
                    { id: "fuelSystemService", label: "Servicio al Sistema de Combustible (inyectores, MAF, cuerpo de aceleración)" },
                    { id: "coolingSystemService", label: "Servicio al Sistema de Enfriamiento" },
                    { id: "brakeService", label: "Servicio de Frenos" },
                    { id: "suspensionAndSteering", label: "Suspensión y Dirección" },
                    { id: "generalMechanics", label: "Mecánica General (motor, transmisión, fugas)" },
                    { id: "electricalSystem", label: "Sistema Eléctrico" },
                    { id: "generalInspection", label: "Inspección General del Vehículo" },
                    { id: "tripInspection", label: "Revisión Previaje / Precompra" },
                    { id: "emissionsPreparation", label: "Preparación para Verificación" },
                    { id: "accessoriesInstallation", label: "Instalación de Accesorios" },
                    { id: "repairInsurance", label: "Seguro de Reparación" }
                  ].map((service) => (
                    <div
                      key={service.id}
                      className="flex items-center space-x-3 p-3 rounded-lg border-2 hover:bg-accent/50 transition-colors"
                    >
                      <Checkbox
                        id={service.id}
                        checked={formData.vehicleService?.[service.id as keyof typeof formData.vehicleService]}
                        onCheckedChange={(checked) =>
                          setFormData({
                            ...formData,
                            vehicleService: {
                              ...formData.vehicleService!,
                              [service.id]: checked as boolean,
                            },
                          })
                        }
                      />
                      <Label htmlFor={service.id} className="font-medium cursor-pointer flex-1">
                        {service.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Notes Card */}
            <Card className="border-2 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
                <div className="flex items-center gap-2">
                  <FileEdit className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  <CardTitle className="text-lg">Notas y Presupuesto</CardTitle>
                </div>
                <CardDescription>Información adicional y estimación de costos</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="repairEstimate" className="text-sm font-semibold">
                    Presupuesto de Reparaciones
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <Input
                      id="repairEstimate"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      className="h-11 pl-8 text-lg font-semibold"
                      value={formData.repairEstimate}
                      onChange={(e) =>
                        setFormData({ ...formData, repairEstimate: Number.parseFloat(e.target.value) || 0 })
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center space-x-3 p-3 rounded-lg border-2 hover:bg-accent/50 transition-colors">
                    <Checkbox
                      id="purchaseCheck"
                      checked={formData.purchaseCheck}
                      onCheckedChange={(checked) => setFormData({ ...formData, purchaseCheck: checked as boolean })}
                    />
                    <Label htmlFor="purchaseCheck" className="font-medium cursor-pointer">
                      Chequeo Compra-Venta
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-lg border-2 hover:bg-accent/50 transition-colors">
                    <Checkbox
                      id="fullVisualInspection"
                      checked={formData.fullVisualInspection}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, fullVisualInspection: checked as boolean })
                      }
                    />
                    <Label htmlFor="fullVisualInspection" className="font-medium cursor-pointer">
                      Inspección Visual Completa
                    </Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="generalNotes" className="text-sm font-semibold">
                    Notas Generales
                  </Label>
                  <Textarea
                    id="generalNotes"
                    placeholder="Observaciones generales sobre el vehículo..."
                    className="min-h-[100px] resize-none"
                    value={formData.generalNotes}
                    onChange={(e) => setFormData({ ...formData, generalNotes: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="chassisReview" className="text-sm font-semibold">
                    Revisión de Chasis
                  </Label>
                  <Textarea
                    id="chassisReview"
                    placeholder="Estado del chasis, corrosión, daños estructurales..."
                    className="min-h-[80px] resize-none"
                    value={formData.chassisReview}
                    onChange={(e) => setFormData({ ...formData, chassisReview: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="visibleDamages" className="text-sm font-semibold">
                    Daños Visibles
                  </Label>
                  <Textarea
                    id="visibleDamages"
                    placeholder="Rayones, abolladuras, daños en pintura..."
                    className="min-h-[80px] resize-none"
                    value={formData.visibleDamages}
                    onChange={(e) => setFormData({ ...formData, visibleDamages: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>

        <div className="px-6 py-4 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 h-11 hover:cursor-pointer"
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 h-11 hover:cursor-pointer">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : quote ? (
                "Actualizar Cotización"
              ) : (
                "Crear Cotización"
              )}
            </Button>
          </div>
        </div>
      </form>
    </DialogContent>
  </Dialog>
  )
}
