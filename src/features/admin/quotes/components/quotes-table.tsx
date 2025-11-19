"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/shared/components/ui/table"
import { Button } from "@/src/shared/components/ui/button"
import { Badge } from "@/src/shared/components/ui/badge"
import { Eye, Pencil, Trash2 } from "lucide-react"
import type { QuoteWithRelations } from "@/src/shared/types/quote"
import { deleteQuoteAction, getQuoteByIdAction } from "@/src/features/admin/quotes/quotes.actions"
import { useToast } from "@/src/shared/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/src/shared/components/ui/alert-dialog"
import { QuoteViewModal } from "./quote-view-modal"
import { useAuth } from "@/src/shared/context/AuthContext"
import { can } from "@/src/shared/functions/permissions"

interface QuotesTableProps {
  quotes: QuoteWithRelations[]
  onEdit: (quote: QuoteWithRelations) => void
  onRefresh: () => void
}

export function QuotesTable({ quotes, onEdit, onRefresh }: QuotesTableProps) {
  const { toast } = useToast()
  const systemPermissions = useAuth().permissions;
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [selectedQuote, setSelectedQuote] = useState<QuoteWithRelations | null>(null)

  const handleDelete = async () => {
    if (!deleteId) return

    setIsDeleting(true)
    try {
      const result = await deleteQuoteAction(deleteId)
      if (result.success) {
        toast({
          title: "Cotización eliminada",
          description: "La cotización se eliminó correctamente",
        })
        onRefresh()
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Ocurrió un error al eliminar la cotización",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setDeleteId(null)
    }
  }

  const handleViewQuote = async (id: number) => {
    try {
      const result = await getQuoteByIdAction(id)
      if (result.success) {
        setSelectedQuote(result.data as any)
        setIsViewOpen(true)
      }
    } catch (error) {
      console.error("Error loading contract:", error)
    }
  }

  const formatCurrency = (amount: number | null) => {
    if (!amount) return "-"
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(Number(amount))
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("es-MX", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(date))
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Vehículo</TableHead>
              <TableHead>Año</TableHead>
              <TableHead>Placas</TableHead>
              <TableHead>Presupuesto</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {quotes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground">
                  No hay cotizaciones registradas
                </TableCell>
              </TableRow>
            ) : (
              quotes.map((quote) => (
                <TableRow key={quote.id}>
                  <TableCell className="font-medium">QTZ-{quote.id}</TableCell>
                  <TableCell>
                    {quote.vehicle.brand} {quote.vehicle.model}
                  </TableCell>
                  <TableCell>{quote.vehicle.year}</TableCell>
                  <TableCell>{quote.vehicle.licensePlate || "-"}</TableCell>
                  <TableCell>{formatCurrency(quote.repairEstimate)}</TableCell>
                  <TableCell>{formatDate(quote.createdAt)}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {quote.purchaseCheck && (
                        <Badge variant="secondary" className="text-xs">
                          Compra-Venta
                        </Badge>
                      )}
                      {quote.fullVisualInspection && (
                        <Badge variant="outline" className="text-xs">
                          Inspección
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="">
                    {/* <Actions> */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewQuote(quote.id)}
                      title="Ver detalles"
                      className="hover:cursor-pointer"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    {can(systemPermissions, "Edit_Quotations") && (
                      <Button
                      variant="ghost"
                      className="h-8 w-8 p-0 hover:cursor-pointer"
                      onClick={() => onEdit(quote)}>
                        <Pencil className="" />
                      </Button>
                      )
                    }
                    
                    {can(systemPermissions, "Delete_Quotations") && (
                      <Button
                        variant="ghost"
                        className="h-8 w-8 p-0 text-destructive hover:cursor-pointer"
                        onClick={() => setDeleteId(quote.id)}
                        >
                      <Trash2 className="" />
                    </Button>)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente la cotización y todos sus datos
              relacionados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <QuoteViewModal quote={selectedQuote} open={isViewOpen} onOpenChange={setIsViewOpen} />
    </>
  )
}
