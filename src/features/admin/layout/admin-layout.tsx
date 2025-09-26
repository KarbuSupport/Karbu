"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/src/shared/components/ui/button"
import { Input } from "@/src/shared/components/ui/input"
import { Badge } from "@/src/shared/components/ui/badge"
import {
  Car,
  Menu,
  X,
  Search,
  LayoutDashboard,
  FileText,
  LucideContrast as FileContract,
  Users,
  UserCheck,
  CreditCard,
  QrCode,
  BarChart3,
  Settings,
} from "lucide-react"

const navigationItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "quotes", label: "Cotizaciones", icon: FileText },
  { id: "contracts", label: "Contratos", icon: FileContract },
  { id: "payments", label: "Pagos", icon: CreditCard },
  { id: "users", label: "Usuarios", icon: Users },
//   { id: "pending", label: "Pendientes", icon: UserCheck },
  { id: "qr-search", label: "Búsqueda QR", icon: QrCode },
//   { id: "reports", label: "Reportes", icon: BarChart3 },
  { id: "user-management", label: "Roles y Permisos", icon: Settings },
]

interface AdminLayoutProps {
  children: React.ReactNode
  activeSection: string
  onSectionChange: (section: string) => void
}

export function AdminLayout({ children, activeSection, onSectionChange }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div
        className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-sidebar-border">
          <div className="flex items-center space-x-2">
            <Car className="w-8 h-8 text-accent" />
            <span className="text-xl font-bold">Karbu.com.mx</span>
          </div>
          <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <nav className="p-4 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon
            return (
              <Button
                key={item.id}
                variant={activeSection === item.id ? "default" : "ghost"}
                className={`w-full justify-start ${
                  activeSection === item.id
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
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
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
          <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-4 h-4" />
          </Button>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input placeholder="Buscar contratos, usuarios..." className="pl-10 w-64" />
            </div>
            {/* Type of logged-in user */}
            <Badge variant="secondary" className="bg-accent text-accent-foreground">
              Admin
            </Badge>
          </div>
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
