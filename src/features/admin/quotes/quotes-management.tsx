"use client"

import { useState } from "react"
import { Button } from "@/src/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/shared/components/ui/card"
import { Input } from "@/src/shared/components/ui/input"
import { Label } from "@/src/shared/components/ui/label"
import { Textarea } from "@/src/shared/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/shared/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/shared/components/ui/dialog"
import { Plus, FileText, DollarSign, Calendar } from "lucide-react"

export function QuotesManagement() {
  const [isNewQuoteOpen, setIsNewQuoteOpen] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Cotizaciones</h1>
          <p className="text-muted-foreground">Administra todas las cotizaciones de servicios</p>
        </div>
        <Dialog open={isNewQuoteOpen} onOpenChange={setIsNewQuoteOpen}>
          <DialogTrigger asChild>
            <Button className="bg-accent hover:bg-accent/90 hover:cursor-pointer">
              <Plus className="w-4 h-4 mr-2" />
              Nueva Cotización
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Crear Nueva Cotización</DialogTitle>
              <DialogDescription>Ingresa los datos para generar una cotización</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="client-name">Nombre del Cliente</Label>
                <Input id="client-name" placeholder="Roberto Silva" />
              </div>
              <div>
                <Label htmlFor="client-email">Correo Electrónico</Label>
                <Input id="client-email" type="email" placeholder="roberto@email.com" />
              </div>
              <div>
                <Label htmlFor="client-phone">Teléfono</Label>
                <Input id="client-phone" placeholder="555-0123" />
              </div>
              <div>
                <Label htmlFor="vehicle">Vehículo</Label>
                <Input id="vehicle" placeholder="Honda Civic 2020" />
              </div>
              <div>
                <Label htmlFor="service">Tipo de Servicio</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar servicio" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="seguro-completo">Seguro Completo</SelectItem>
                    <SelectItem value="reparacion-motor">Reparación Motor</SelectItem>
                    <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
                    <SelectItem value="pintura">Pintura y Carrocería</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="amount">Monto Estimado</Label>
                <Input id="amount" type="number" placeholder="2500" />
              </div>
              <div className="col-span-2">
                <Label htmlFor="description">Descripción del Servicio</Label>
                <Textarea id="description" placeholder="Detalles adicionales del servicio..." />
              </div>
              <div className="col-span-2 flex gap-2">
                <Button onClick={() => setIsNewQuoteOpen(false)} variant="outline" className="flex-1">
                  Cancelar
                </Button>
                <Button onClick={() => setIsNewQuoteOpen(false)} className="flex-1 bg-accent hover:bg-accent/90">
                  Crear Cotización
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cotizaciones Pendientes</CardTitle>
            <FileText className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 desde ayer</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cotizaciones Aprobadas</CardTitle>
            <DollarSign className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">+1 desde ayer</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total Mes</CardTitle>
            <Calendar className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,200</div>
            <p className="text-xs text-muted-foreground">+12% vs mes anterior</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Cotizaciones</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Tabla de cotizaciones pendiente de implementar...</p>
        </CardContent>
      </Card>
    </div>
  )
}
