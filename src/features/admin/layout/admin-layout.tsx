"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/src/shared/components/ui/button"
import {
  Car,
  Menu,
  X,
  LayoutDashboard,
  FileText,
  LucideContrast as FileContract,
  CreditCard,
  QrCode,
  Settings,
  LogOut,
} from "lucide-react"
import { logoutAction } from "../login/login.actions"
import { useRouter } from "next/navigation"
import { useAuth } from "@/src/shared/context/AuthContext"

const navigationItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, requiredPermission: "View_Dashboard" },
  { id: "quotes", label: "Cotizaciones", icon: FileText, requiredPermission: "View_Quotations" },
  { id: "contracts", label: "Contratos", icon: FileContract, requiredPermission: "View_Contracts" },
  { id: "payments", label: "Pagos", icon: CreditCard, requiredPermission: "View_Payments" },
  { id: "qr-search", label: "Búsqueda QR", icon: QrCode, requiredPermission: "QR_Search" },
  { id: "user-management", label: "Roles y Permisos", icon: Settings, requiredPermission: "View_Roles_and_Permissions" },
]

interface AdminLayoutProps {
  children: React.ReactNode
  activeSection: string
  onSectionChange: (section: string) => void
}



export function AdminLayout({ children, activeSection, onSectionChange }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()
  const { permissions } = useAuth() // 👈 Traemos permisos del contexto

  const handleLogOut = async () => {
    const result = await logoutAction();

    if (result.success) {
      router.push("/admin/login")
    }
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div
        className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 flex flex-col`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-sidebar-border">
          <div className="flex items-center space-x-2">
            <Car className="w-8 h-8 text-accent" />
            <span className="text-xl font-bold">Karbu.com.mx</span>
          </div>
          <Button
          variant="ghost"
          size="sm"
          className="lg:hidden hover:cursor-pointer"
          onClick={() => setSidebarOpen(false)}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <nav className="p-4 space-y-2">
          {navigationItems.filter((item) => permissions.includes(item.requiredPermission)).map((item) => {
            const Icon = item.icon
            return (
              <Button
                key={item.id}
                variant={activeSection === item.id ? "default" : "ghost"}
                className={`w-full justify-start ${activeSection === item.id
                    ? "bg-sidebar-primary text-sidebar-primary-foreground hover:cursor-pointer"
                    : "hover:bg-sidebar-primary hover:text-sidebar-primary-foreground hover:cursor-pointer"
                  }`}
                onClick={() => {
                  onSectionChange(item.id)
                  setSidebarOpen(false)
                }}
              >
                <Icon className="w-4 h-4 mr-3" />
                {item.label}
              </Button>
            )
          })}
        </nav>

        {/* Logout Button - fixed at bottom */}
        <div className="mt-auto p-4">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center w-full hover:bg-destructive hover:text-destructive-foreground hover:cursor-pointer bg-transparent"
            onClick={() => {
              handleLogOut()
            }}
          >
            <LogOut className="w-4 h-4" />
            <span>Cerrar Sesión</span>
          </Button>
        </div>
      </div>


      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
          <Button
          variant="ghost"
          size="sm"
          className="lg:hidden hover:cursor-pointer"
          onClick={() => setSidebarOpen(true)}>
            <Menu className="w-4 h-4" />
          </Button>

          {/* <div className="flex items-center space-x-4"> */}
            {/* Type of logged-in user */}
            {/* <Badge variant="secondary" className="bg-accent text-accent-foreground">
              Admin
            </Badge>
          </div> */}
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  )
}
