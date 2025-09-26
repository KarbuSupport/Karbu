"use client"

import { useState } from "react"
import { AdminLayout } from "@/src/features/admin/layout/admin-layout"
import { DashboardOverview } from "@/src/features/admin/dashboard/dashboard-overview"
import { QuotesManagement } from "@/src/features/admin/quotes/quotes-management"

// DashboardOvervie
// QuotesManagement
// ContractsManagement
// UsersManagement
// PendingManagement
// PaymentsManagement
// QRSearct
// ReportsManagement
// UserRolesManagement

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
      case "users":
        // return <UsersManagement />
      case "pending":
        // return <PendingManagement />
      case "payments":
        // return <PaymentsManagement />
      case "qr-search":
        // return <QRSearch />
      case "reports":
        // return <ReportsManagement />
      case "user-management":
        // return <UserRolesManagement />
      default:
        // return <DashboardOverview />
    }
  }

  return (
    <AdminLayout activeSection={activeSection} onSectionChange={setActiveSection}>
      {renderContent()}
    </AdminLayout>
  )
}
