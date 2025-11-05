"use client"

import { useState, useEffect } from "react"
import { Button } from "@/src/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/shared/components/ui/card"
import { Plus, FileText, DollarSign, Calendar } from "lucide-react"
import { QuoteFormModal } from "@/src/features/admin/quotes/components/quotes-form-modal"
import { QuotesTable } from "@/src/features/admin/quotes/components/quotes-table"
import { getAllQuotesAction, getQuotesStatsAction } from "@/src/features/admin/quotes/quotes.actions"
import type { QuoteWithRelations } from "@/src/shared/types/quote"

export function QuotesManagement() {
  const [quotes, setQuotes] = useState<QuoteWithRelations[]>([])
  const [stats, setStats] = useState({ total: 0, withPurchaseCheck: 0, totalEstimate: 0 })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEdit, setIsEdit] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<QuoteWithRelations | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const loadData = async () => {
    setIsLoading(true)
    try {
      const [quotesResult, statsResult] = await Promise.all([getAllQuotesAction(), getQuotesStatsAction()])

      if (quotesResult.success) {
        setQuotes(quotesResult.data as any)
      }
      if (statsResult.success) {
        setStats(statsResult.data as any)
      }
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleEdit = (quote: QuoteWithRelations) => {
    setSelectedQuote(quote)
    setIsModalOpen(true)
    setIsEdit(true);
  }

  const handleCreate = () => {
    setIsModalOpen(true);
    setIsEdit(false);
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setSelectedQuote(null)
    setIsEdit(false);
  }

  const handleSuccess = () => {
    loadData()
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(amount)
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Cotizaciones</h1>
          <p className="text-muted-foreground">Administra todas las cotizaciones de servicios</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="bg-accent hover:bg-accent/90">
          <Plus className="w-4 h-4 mr-2" />
          Nueva Cotización
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cotizaciones</CardTitle>
            <FileText className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Cotizaciones registradas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chequeo Compra-Venta</CardTitle>
            <DollarSign className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.withPurchaseCheck}</div>
            <p className="text-xs text-muted-foreground">Con chequeo de compra-venta</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total Estimado</CardTitle>
            <Calendar className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(Number(stats.totalEstimate))}</div>
            <p className="text-xs text-muted-foreground">Suma de presupuestos</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Cotizaciones</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-center text-muted-foreground py-8">Cargando cotizaciones...</p>
          ) : (
            <QuotesTable quotes={quotes} onEdit={handleEdit} onRefresh={loadData} />
          )}
        </CardContent>
      </Card>

      <QuoteFormModal
        open={isModalOpen}
        onOpenChange={handleModalClose}
        quote={selectedQuote}
        onSuccess={handleSuccess}
        isEdit={isEdit}
      />
    </div>
  )
}
