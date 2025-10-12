"use server"

import { revalidatePath } from "next/cache"
import { QuoteService } from "@/src/features/admin/quotes/quotes.service"
import type { QuoteFormData } from "@/src/shared/types/quote"

export async function getAllQuotesAction() {
  try {
    const quotes = await QuoteService.getAllQuotes()
    return { success: true, data: quotes }
  } catch (error) {
    console.error("Error fetching quotes:", error)
    return { success: false, error: "Error al obtener las cotizaciones" }
  }
}

export async function getQuoteByIdAction(id: number) {
  try {
    const quote = await QuoteService.getQuoteById(id)
    if (!quote) {
      return { success: false, error: "Cotización no encontrada" }
    }
    return { success: true, data: quote }
  } catch (error) {
    console.error("Error fetching quote:", error)
    return { success: false, error: "Error al obtener la cotización" }
  }
}

export async function createQuoteAction(data: QuoteFormData) {
  try {
  console.log('data :', data);
    const quote = await QuoteService.createQuote(data)
    revalidatePath("/quotes")
    return { success: true, data: quote }
  } catch (error) {
    console.error("Error creating quote:", error)
    return { success: false, error: "Error al crear la cotización" }
  }
}

export async function updateQuoteAction(id: number, data: QuoteFormData) {
  try {
    const quote = await QuoteService.updateQuote(id, data)
    revalidatePath("/quotes")
    return { success: true, data: quote }
  } catch (error) {
    console.error("Error updating quote:", error)
    return { success: false, error: "Error al actualizar la cotización" }
  }
}

export async function deleteQuoteAction(id: number) {
  try {
    await QuoteService.deleteQuote(id)
    revalidatePath("/quotes")
    return { success: true }
  } catch (error) {
    console.error("Error deleting quote:", error)
    return { success: false, error: "Error al eliminar la cotización" }
  }
}

export async function getQuotesStatsAction() {
  try {
    const stats = await QuoteService.getQuotesStats()
    return { success: true, data: stats }
  } catch (error) {
    console.error("Error fetching stats:", error)
    return { success: false, error: "Error al obtener las estadísticas" }
  }
}
