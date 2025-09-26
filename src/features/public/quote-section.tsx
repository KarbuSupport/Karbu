"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/shared/components/ui/card"
import { Button } from "@/src/shared/components/ui/button"
import { Input } from "@/src/shared/components/ui/input"
import { Label } from "@/src/shared/components/ui/label"
import { Textarea } from "@/src/shared/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/shared/components/ui/select"
import { Calculator, FileText, Phone } from "lucide-react"

export function QuoteSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    vehicleBrand: "",
    vehicleModel: "",
    vehicleYear: "",
    serviceType: "",
    description: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    // Aquí iría la lógica para enviar el formulario
    alert("¡Cotización enviada! Nos pondremos en contacto contigo pronto.")
  }

  return (
    <section id="cotizacion" className="py-20 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-balance">
            Cotiza tu <span className="text-primary">Servicio</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            Obtén una cotización personalizada para tu vehículo. Nuestros expertos te brindarán la mejor opción de
            servicio y seguro para tus necesidades.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulario de cotización */}
          <div className="lg:col-span-2">
            <Card className="bg-background border-2 border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-6 w-6 text-primary" />
                  Solicitar Cotización
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Nombre Completo</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder="Tu nombre completo"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Correo Electrónico</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="tu@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Teléfono</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        placeholder="+52 (555) 123-4567"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="vehicleYear">Año del Vehículo</Label>
                      <Input
                        id="vehicleYear"
                        value={formData.vehicleYear}
                        onChange={(e) => handleInputChange("vehicleYear", e.target.value)}
                        placeholder="2020"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="vehicleBrand">Marca del Vehículo</Label>
                      <Select onValueChange={(value) => handleInputChange("vehicleBrand", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona la marca" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="toyota">Toyota</SelectItem>
                          <SelectItem value="nissan">Nissan</SelectItem>
                          <SelectItem value="honda">Honda</SelectItem>
                          <SelectItem value="volkswagen">Volkswagen</SelectItem>
                          <SelectItem value="chevrolet">Chevrolet</SelectItem>
                          <SelectItem value="ford">Ford</SelectItem>
                          <SelectItem value="mazda">Mazda</SelectItem>
                          <SelectItem value="hyundai">Hyundai</SelectItem>
                          <SelectItem value="kia">Kia</SelectItem>
                          <SelectItem value="otro">Otro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="vehicleModel">Modelo del Vehículo</Label>
                      <Input
                        id="vehicleModel"
                        value={formData.vehicleModel}
                        onChange={(e) => handleInputChange("vehicleModel", e.target.value)}
                        placeholder="Corolla, Sentra, Civic, etc."
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="serviceType">Tipo de Servicio</Label>
                    <Select onValueChange={(value) => handleInputChange("serviceType", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el servicio" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="seguro-reparacion">Seguro de Reparación</SelectItem>
                        <SelectItem value="mecanica-general">Mecánica General</SelectItem>
                        <SelectItem value="sistema-electrico">Sistema Eléctrico</SelectItem>
                        <SelectItem value="hojalateria-pintura">Hojalatería y Pintura</SelectItem>
                        <SelectItem value="mantenimiento">Mantenimiento Preventivo</SelectItem>
                        <SelectItem value="especializado">Servicio Especializado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="description">Descripción del Problema</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      placeholder="Describe detalladamente el problema o servicio que necesitas..."
                      rows={4}
                    />
                  </div>

                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                    Enviar Cotización
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Información de contacto */}
          <div className="space-y-6">
            <Card className="bg-background border-2 border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-6 w-6 text-primary" />
                  Contacto Directo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Teléfono Principal</h4>
                  <p className="text-muted-foreground">+52 (555) 123-4567</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">WhatsApp</h4>
                  <p className="text-muted-foreground">+52 (555) 765-4321</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Email</h4>
                  <p className="text-muted-foreground">info@tallermendez.com</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Horarios</h4>
                  <p className="text-muted-foreground">
                    Lun - Vie: 8:00 AM - 6:00 PM
                    <br />
                    Sáb: 9:00 AM - 2:00 PM
                    <br />
                    Dom: Emergencias 24/7
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-background border-2 border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-6 w-6 text-primary" />
                  Proceso de Cotización
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-3 text-sm">
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                      1
                    </span>
                    <span>Envía tu solicitud con los datos del vehículo</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                      2
                    </span>
                    <span>Nuestros expertos analizan tu caso</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                      3
                    </span>
                    <span>Recibe tu cotización en menos de 24 horas</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                      4
                    </span>
                    <span>Agenda tu cita y contrata el servicio</span>
                  </li>
                </ol>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
