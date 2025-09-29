"use client"

import { useState } from "react"
import { AdminLayout } from "@/src/features/admin/layout/admin-layout"
import { DashboardOverview } from "@/src/features/admin/dashboard/dashboard-overview"
import { QuotesManagement } from "@/src/features/admin/quotes/quotes-management"
import { RolesManagement } from "@/src/features/admin/user-roles-management/user-roles-management"

export default function AdminPage() {
  const [activeSection, setActiveSection] = useState("dashboard")

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <DashboardOverview onSectionChange={setActiveSection} />
      case "quotes":
        return <QuotesManagement />
      case "contracts":
        // return <ContractsManagement />
      case "payments":
        // return <PaymentsManagement />
      case "qr-search":
        // return <QRSearch />
      case "user-management":
        return <RolesManagement />
      default:
        // return <DashboardOverview onSectionChange={setActiveSection} />
    }
  }

  return (
    <AdminLayout activeSection={activeSection} onSectionChange={setActiveSection}>
      {renderContent()}
    </AdminLayout>
  )
}
