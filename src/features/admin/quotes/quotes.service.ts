import { prisma } from "@/src/lib/prisma"
import type { QuoteFormData, QuoteWithRelations } from "@/src/shared/types/quote"
import type { Prisma } from "@prisma/client"

export class QuoteService {
  /**
   * Get all quotes with vehicle information
   */
  static async getAllQuotes(): Promise<QuoteWithRelations[]> {
    const quotes = await prisma.quote.findMany({
      include: {
        vehicle: true,
        vehicleChecks: true,
        vehicleServices: true,
      },
      orderBy: { createdAt: "desc" },
    })

    if (!quotes) return []

    return quotes.map((quote) => ({
      ...quote,
      repairEstimate: quote.repairEstimate ? Number(quote.repairEstimate) : null,
    }))
  }

  /**
   * Get a single quote by ID
   */
  static async getQuoteById(id: number): Promise<QuoteWithRelations | null> {
    const quote = await prisma.quote.findUnique({
      where: { id },
      include: {
        vehicle: true,
        vehicleChecks: true,
        vehicleServices: true,
      },
    })

    if (!quote) return null

    return {
      ...quote,
      repairEstimate: quote.repairEstimate ? Number(quote.repairEstimate) : null,
    }
  }

  /**
   * Helper to clean empty fields
   */
  private static cleanObject<T extends Record<string, any>>(obj: T): T {
    return Object.fromEntries(
      Object.entries(obj).filter(([_, v]) => v !== undefined && v !== null)
    ) as T
  }

  /**
   * Create a new quote with vehicle and related data
   */
  static async createQuote(data: QuoteFormData): Promise<QuoteWithRelations> {
    const { vehicle, vehicleCheck, vehicleService, ...quoteData } = data

    // Clean objects
    const cleanedVehicleCheck = vehicleCheck
      ? this.cleanObject(vehicleCheck)
      : undefined
    const cleanedVehicleService = vehicleService
      ? this.cleanObject(vehicleService)
      : undefined

    // Ensure vehicle record exists
    let vehicleRecord
    if (vehicle.id) {
      vehicleRecord = await prisma.vehicle.findUnique({
        where: { id: vehicle.id },
      })
    }

    if (!vehicleRecord) {
      vehicleRecord = await prisma.vehicle.create({
        data: {
          brand: vehicle.brand,
          model: vehicle.model,
          year: vehicle.year,
          engineType: vehicle.engineType,
          transmission: vehicle.transmission,
          licensePlate: vehicle.licensePlate,
        },
      })
    }

    // Create quote with nested relations
    const quote = await prisma.quote.create({
      data: {
        vehicleId: vehicleRecord.id,
        generalNotes: quoteData.generalNotes,
        repairEstimate: quoteData.repairEstimate,
        purchaseCheck: quoteData.purchaseCheck,
        fullVisualInspection: quoteData.fullVisualInspection,
        chassisReview: quoteData.chassisReview,
        visibleDamages: quoteData.visibleDamages,
        vehicleChecks: cleanedVehicleCheck
          ? {
              create: [
                cleanedVehicleCheck as Prisma.VehicleCheckCreateWithoutQuoteInput,
              ],
            }
          : undefined,
        vehicleServices: cleanedVehicleService
          ? {
              create: [
                cleanedVehicleService as Prisma.VehicleServiceCreateWithoutQuoteInput,
              ],
            }
          : undefined,
      },
      include: {
        vehicle: true,
        vehicleChecks: true,
        vehicleServices: true,
      },
    })

    return {
      ...quote,
      repairEstimate: quote.repairEstimate ? Number(quote.repairEstimate) : null,
    }
  }

  /**
   * Update an existing quote
   */
  static async updateQuote(id: number, data: QuoteFormData): Promise<QuoteWithRelations> {
    const { vehicle, vehicleCheck, vehicleService, ...quoteData } = data

    // Update vehicle if exists
    if (vehicle.id) {
      await prisma.vehicle.update({
        where: { id: vehicle.id },
        data: {
          brand: vehicle.brand,
          model: vehicle.model,
          year: vehicle.year,
          engineType: vehicle.engineType,
          transmission: vehicle.transmission,
          licensePlate: vehicle.licensePlate,
        },
      })
    }

    // Delete old nested records
    await prisma.vehicleCheck.deleteMany({ where: { quoteId: id } })
    await prisma.vehicleService.deleteMany({ where: { quoteId: id } })

    // Clean new ones
    const cleanedVehicleCheck = vehicleCheck
      ? this.cleanObject(vehicleCheck)
      : undefined
    const cleanedVehicleService = vehicleService
      ? this.cleanObject(vehicleService)
      : undefined

    // Update quote
    const quote = await prisma.quote.update({
      where: { id },
      data: {
        generalNotes: quoteData.generalNotes,
        repairEstimate: quoteData.repairEstimate,
        purchaseCheck: quoteData.purchaseCheck,
        fullVisualInspection: quoteData.fullVisualInspection,
        chassisReview: quoteData.chassisReview,
        visibleDamages: quoteData.visibleDamages,
        vehicleChecks: cleanedVehicleCheck
          ? {
              create: [
                cleanedVehicleCheck as Prisma.VehicleCheckCreateWithoutQuoteInput,
              ],
            }
          : undefined,
        vehicleServices: cleanedVehicleService
          ? {
              create: [
                cleanedVehicleService as Prisma.VehicleServiceCreateWithoutQuoteInput,
              ],
            }
          : undefined,
      },
      include: {
        vehicle: true,
        vehicleChecks: true,
        vehicleServices: true,
      },
    })

    return {
      ...quote,
      repairEstimate: quote.repairEstimate ? Number(quote.repairEstimate) : null,
    }
  }

  /**
   * Delete a quote
   */
  static async deleteQuote(id: number): Promise<void> {
    await prisma.vehicleCheck.deleteMany({ where: { quoteId: id } })
    await prisma.vehicleService.deleteMany({ where: { quoteId: id } })
    await prisma.quote.delete({ where: { id } })
  }

  /**
   * Get quotes statistics
   */
  static async getQuotesStats() {
    const total = await prisma.quote.count()
    const withPurchaseCheck = await prisma.quote.count({
      where: { purchaseCheck: true },
    })
    const totalEstimate = await prisma.quote.aggregate({
      _sum: { repairEstimate: true },
    })

    return {
      total,
      withPurchaseCheck,
      totalEstimate: totalEstimate._sum.repairEstimate || 0,
    }
  }
}
