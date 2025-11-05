"use client"

import { Button } from "@/src/shared/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/shared/components/ui/card"
import { FileText, LucideContrast as FileContract, CreditCard, QrCode } from "lucide-react"
import { getContractsWithStatusAction } from "../contracts/contract.actions"
import { useEffect, useState } from "react"

const initialStats = [
  { label: "Contratos Vigentes y Pagados", value: 0, color: "bg-green-500" },
  { label: "Contratos Vigentes y Con Deuda", value: 0, color: "bg-yellow-500" },
  { label: "Contratos Vencidos", value: 0, color: "bg-red-500" },
]

const recentActivity = [
  { id: 1, type: "Contrato Creado", client: "Juan Pérez", amount: "$2,500", time: "10:30 AM" },
  { id: 2, type: "Pago Recibido", client: "María González", amount: "$1,800", time: "09:15 AM" },
  { id: 3, type: "Cotización Nueva", client: "Carlos Ruiz", amount: "$3,200", time: "08:45 AM" },
  { id: 4, type: "Contrato Vencido", client: "Ana López", amount: "$2,100", time: "08:00 AM" },
]

interface DashboardOverviewProps {
  onSectionChange?: (section: string) => void
}

export function DashboardOverview({ onSectionChange }: DashboardOverviewProps) {
  const [contractStats, setContractStats] = useState(initialStats)
  const handleContracts = async () => {
    const result = await getContractsWithStatusAction()
    if (result.success && result.data) {
      const statusCount = result.data
      setContractStats([
      {...contractStats[0], value: statusCount.CurrentAndPaid},
      {...contractStats[1], value: statusCount.CurrentAndInDebt},
      {...contractStats[2], value: statusCount.Expired},
      ])
    } else {
      console.error("Error fetching contract stats:", result.error)
    }
  }

  useEffect(() => {
    handleContracts()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">Panel de Administración</h1>
          <p className="text-muted-foreground">Karbu.com.mx - Sistema de Seguros Automotrices</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contractStats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-pretty">{stat.label}</CardTitle>
              <div className={`w-3 h-3 rounded-full ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        {/* <Card>
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
            <CardDescription>Últimas transacciones y eventos del sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{activity.type}</p>
                    <p className="text-sm text-muted-foreground">{activity.client}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{activity.amount}</p>
                    <p className="text-sm text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card> */}

        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
            <CardDescription>Funciones más utilizadas del sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="h-20 flex-col bg-transparent hover:cursor-pointer"
                onClick={() => onSectionChange?.("quotes")}
              >
                <FileText className="w-6 h-6 mb-2" />
                Nueva Cotización
              </Button>
              <Button
                variant="outline"
                className="h-20 flex-col bg-transparent hover:cursor-pointer"
                onClick={() => onSectionChange?.("contracts")}
              >
                <FileContract className="w-6 h-6 mb-2" />
                Crear Contrato
              </Button>
              <Button
                variant="outline"
                className="h-20 flex-col bg-transparent hover:cursor-pointer"
                onClick={() => onSectionChange?.("payments")}
              >
                <CreditCard className="w-6 h-6 mb-2" />
                Registrar Pago
              </Button>
              <Button
                variant="outline"
                className="h-20 flex-col bg-transparent hover:cursor-pointer"
                onClick={() => onSectionChange?.("qr-search")}
              >
                <QrCode className="w-6 h-6 mb-2" />
                Buscar por QR
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
