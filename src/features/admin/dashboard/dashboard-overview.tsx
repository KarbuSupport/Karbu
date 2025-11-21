"use client"

import { Button } from "@/src/shared/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/shared/components/ui/card"
import { FileText, LucideContrast as FileContract, CreditCard, QrCode } from "lucide-react"
import { getContractsWithStatusAction } from "../contracts/contract.actions"
import { useEffect, useState } from "react"
import { useAuth } from "@/src/shared/context/AuthContext"
import { can } from "@/src/shared/functions/permissions"

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
  const systemPermissions = useAuth().permissions;
  const handleContracts = async () => {
    const result = await getContractsWithStatusAction()
    console.log('result :', result);
    if (result.success && result.data) {
      const statusGroups = result.data
      setContractStats([
        { ...contractStats[0], value: (statusGroups["CurrentAndPaid"] || []).length },
        { ...contractStats[1], value: (statusGroups["CurrentAndInDebt"] || []).length },
        { ...contractStats[2], value: (statusGroups["Expired"] || []).length },
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
      <div>
        {/* Aqui va el char */}
      </div>

      {/* Fast Action */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Accion Rápida</CardTitle>
            {/* <CardDescription>Funciones más utilizadas del sistema</CardDescription> */}
          </CardHeader>
          <CardContent>
            {can(systemPermissions, "QR_Search") && (<div className="grid grid-cols-1 gap-4">
              <Button
                variant="outline"
                className="h-20 flex-col bg-transparent hover:cursor-pointer"
                onClick={() => onSectionChange?.("qr-search")}
              >
                <QrCode className="w-6 h-6 mb-2" />
                Buscar por QR
              </Button>
            </div>)}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
