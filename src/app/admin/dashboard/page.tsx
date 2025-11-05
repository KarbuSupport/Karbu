"use client"

import { useState, useEffect } from "react"
import { AdminLayout } from "@/src/features/admin/layout/admin-layout"
import { DashboardOverview } from "@/src/features/admin/dashboard/dashboard-overview"
import { QuotesManagement } from "@/src/features/admin/quotes/quotes-management"
import { RolesManagement } from "@/src/features/admin/user-roles-management/user-roles-management"
import { useAuth } from "@/src/shared/context/AuthContext"
import { ContractsManagement } from "@/src/features/admin/contracts/contract-management"
import { PaymentsManagement } from "@/src/features/admin/payments/payments-management"
import { QRSearch } from "@/src/features/admin/qr-search/qr-search"

export default function AdminPage() {
  const { permissions } = useAuth()
  const [activeSection, setActiveSection] = useState("dashboard")

  const sectionPermissions: Record<string, string> = {
    dashboard: "View_Dashboard",
    quotes: "View_Quotations",
    contracts: "View_Contracts",
    payments: "View_Payments",
    "qr-search": "QR_Search",
    "user-management": "View_Roles_and_Permissions",
  }

  // Lista de secciones permitidas
  const allowedSections = Object.keys(sectionPermissions).filter((section) =>
    permissions.includes(sectionPermissions[section])
  )

  // Redirige a la primera sección permitida si la activa no tiene acceso
  useEffect(() => {
    if (allowedSections.length === 0) return // no hay permisos
    if (!allowedSections.includes(activeSection)) {
      setActiveSection(allowedSections[0])
    }
  }, [activeSection, allowedSections])

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <DashboardOverview onSectionChange={setActiveSection} />
      case "quotes":
        return <QuotesManagement />
      case "contracts":
        return <ContractsManagement />
      case "payments":
        return <PaymentsManagement />
      case "qr-search":
        return <QRSearch />
      case "user-management":
        return <RolesManagement />
      default:
        return (
          <div className="flex items-center justify-center h-full">
            <p className="text-lg font-semibold text-muted-foreground">
              Selecciona una sección para comenzar
            </p>
          </div>
        )
    }
  }

  return (
    <AdminLayout activeSection={activeSection} onSectionChange={setActiveSection}>
      {renderContent()}
    </AdminLayout>
  )
}
