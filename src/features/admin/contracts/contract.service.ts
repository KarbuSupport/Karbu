import { prisma } from "@/src/lib/prisma"
import { Prisma } from "@prisma/client"

export class ContractService {
  static async createContract(data: {
    clientName: string
    vehicleId: number
    quoteId?: number
    startDate: Date
    endDate?: Date
    status: string
    responsibleUser: number
    services: Array<{ serviceId: number; price: number }>
    clientRFC?: string
    clientStreet?: string
    clientExteriorNumber?: string
    clientInteriorNumber?: string
    clientNeighborhood?: string
    clientPostalCode?: string
    clientCity?: string
    clientState?: string
    marketingConsent?: boolean
    advertisingConsent?: boolean
    profecoNumber?: string
    profecoDate?: Date
    clientSignature?: string
    qrCode?: string
  }) {
    try {
      const contract = await prisma.contract.create({
        data: {
          clientName: data.clientName,
          clientRFC: data.clientRFC,
          clientStreet: data.clientStreet,
          clientExteriorNumber: data.clientExteriorNumber,
          clientInteriorNumber: data.clientInteriorNumber,
          clientNeighborhood: data.clientNeighborhood,
          clientPostalCode: data.clientPostalCode,
          clientCity: data.clientCity,
          clientState: data.clientState,
          vehicleId: data.vehicleId,
          quoteId: data.quoteId,
          startDate: data.startDate,
          endDate: data.endDate,
          status: data.status,
          responsibleUser: data.responsibleUser,
          marketingConsent: data.marketingConsent || false,
          advertisingConsent: data.advertisingConsent || false,
          profecoNumber: data.profecoNumber,
          profecoDate: data.profecoDate,
          clientSignature: data.clientSignature,
          qrCode: data.qrCode || `QR${Date.now()}${Math.random().toString(36).substr(2, 9)}`,
          services: {
            create: data.services.map((s) => ({
              serviceId: s.serviceId,
              price: new Prisma.Decimal(s.price),
            })),
          },
        },
        include: {
          vehicle: true,
          services: {
            include: {
              service: true,
            },
          },
          responsible: {
            select: {
              id: true,
              firstName: true,
              lastName1: true,
              email: true,
            },
          },
        },
      })
      return contract
    } catch (error) {
      console.error("Error creating contract:", error)
      throw error
    }
  }

  static async getContracts(filters?: {
    status?: string
    search?: string
    skip?: number
    take?: number
  }) {
    try {
      const where: Prisma.ContractWhereInput = {}

      if (filters?.status && filters.status !== "all") {
        where.status = filters.status
      }

      if (filters?.search) {
        const searchRaw = filters.search.trim()
        const search = searchRaw.replace(/^CNT-/i, "") // quitar prefijo CNT- si existe
        const searchLower = search.toLowerCase()

        const searchNumber = Number(search)
        const isNumeric = !isNaN(searchNumber)

        // mapping meses (español + inglés) -> índice 0-11
        const monthMap: Record<string, number> = {
          enero: 0, february: 1, feb: 1, febrero: 1, marzo: 2, mar: 2,
          abril: 3, apr: 3, mayo: 4, may: 4, junio: 5, jun: 5,
          julio: 6, jul: 6, agosto: 7, aug: 7, septiembre: 8, sep: 8, sept: 8,
          octubre: 9, oct: 9, noviembre: 10, nov: 10, diciembre: 11, dec: 11, december: 11
        }

        // ayudantes para rangos
        const makeDayRange = (date: Date) => {
          const start = new Date(date)
          start.setHours(0, 0, 0, 0)
          const end = new Date(start)
          end.setDate(start.getDate() + 1)
          return { gte: start, lt: end }
        }

        const orConditions: any[] = []

        // Cliente
        orConditions.push({ clientName: { contains: searchRaw, mode: "insensitive" } })

        // Estado
        orConditions.push({ status: { contains: searchRaw, mode: "insensitive" } })

        // Vehículo: brand / model / licensePlate
        orConditions.push({
          vehicle: {
            OR: [
              { brand: { contains: searchRaw, mode: "insensitive" } },
              { model: { contains: searchRaw, mode: "insensitive" } },
              { licensePlate: { contains: searchRaw, mode: "insensitive" } },
            ],
          },
        })

        // ID tipo CNT-123 o solo número -> buscar por id
        if (!isNaN(Number(search))) {
          orConditions.push({ id: Number(search) })
        }

        // --------- Fecha avanzada -----------
        // 1) intentar parsear como fecha completa (ISO / '20/11/2025' / '20 nov 2025', etc.)
        const parsed = new Date(search)
        if (!isNaN(parsed.getTime())) {
          // rango del día detectado
          orConditions.push({ createdAt: makeDayRange(parsed) })
        } else {
          // 2) detectar patrón dd/mm/yyyy o dd-mm-yyyy manualmente (para mayor robustez)
          const dmY = search.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})$/)
          if (dmY) {
            const d = Number(dmY[1])
            const m = Number(dmY[2]) - 1
            let y = Number(dmY[3])
            if (y < 100) y += 2000
            const dt = new Date(y, m, d)
            orConditions.push({ createdAt: makeDayRange(dt) })
          } else {
            // 3) buscar por mes por nombre (ej: "noviembre" o "nov")
            for (const key of Object.keys(monthMap)) {
              if (searchLower.includes(key)) {
                const monthIndex = monthMap[key]
                // si el search incluye un año (ej "noviembre 2025")
                const yearMatch = search.match(/(19|20)\d{2}/)
                const yearNum = yearMatch ? Number(yearMatch[0]) : new Date().getFullYear()
                const monthStart = new Date(yearNum, monthIndex, 1)
                const monthEnd = new Date(yearNum, monthIndex + 1, 1)
                orConditions.push({ createdAt: { gte: monthStart, lt: monthEnd } })
                break
              }
            }

            // 4) buscar por año solamente (ej "2025")
            const yearOnly = search.match(/^(19|20)\d{2}$/)
            if (yearOnly) {
              const y = Number(yearOnly[0])
              const start = new Date(y, 0, 1)
              const end = new Date(y + 1, 0, 1)
              orConditions.push({ createdAt: { gte: start, lt: end } })
            }

            // 5) búsqueda por día del mes solamente (ej "20") -> interpreto como día del mes actual
            const dayOnly = search.match(/^(\d{1,2})$/)
            if (dayOnly) {
              const dayNum = Number(dayOnly[1])
              if (dayNum >= 1 && dayNum <= 31) {
                const now = new Date()
                const start = new Date(now.getFullYear(), now.getMonth(), dayNum)
                const end = new Date(start)
                end.setDate(start.getDate() + 1)
                // sólo agregar si la fecha resultante es válida (evitar 31 febrero)
                if (!isNaN(start.getTime())) {
                  orConditions.push({ createdAt: { gte: start, lt: end } })
                }
              }
            }
          }
        }

        // Asignar OR al where (si ya existe, concatena)
        if (!where.OR) where.OR = []
        where.OR = where.OR.concat(orConditions)

        // --------- Manejo de búsqueda por monto total (post-filter) -----------
        // Si el usuario escribió un número con decimales o con separadores (ej "12,500" o "12500")
        // lo consideramos búsqueda posible de totalPrice; no se puede hacer en Prisma sin un campo agregado,
        // así que devolvemos una marca para filtrar después de la consulta.
        // Para detectar montos escritos con comas o puntos:
        const numericLike = searchRaw.replace(/[,\s]/g, "").replace(/^\$/, "")
        const maybeAmount = Number(numericLike)
          // exporta dos variables auxiliares que puedes usar después:
          // - needsPostFilterByTotal: boolean
          // - postFilterTotalValue: number | undefined
          ; (filters as any).needsPostFilterByTotal = !isNaN(maybeAmount) && maybeAmount > 0 ? true : false
          ; (filters as any).postFilterTotalValue = !isNaN(maybeAmount) && maybeAmount > 0 ? maybeAmount : undefined
      }



      const contracts = await prisma.contract.findMany({
        where,
        include: {
          vehicle: true,
          services: {
            include: {
              service: true,
            },
          },
          responsible: {
            select: {
              id: true,
              firstName: true,
              lastName1: true,
              email: true,
            },
          },
          payments: true,
        },
        orderBy: { id: "desc" },
        skip: filters?.skip || 0,
        take: filters?.take || 10,
      })

      return contracts
    } catch (error) {
      console.error("Error fetching contracts:", error)
      throw error
    }
  }

  static async getContractById(id: number) {
    try {
      const contract = await prisma.contract.findUnique({
        where: { id },
        include: {
          vehicle: true,
          services: {
            include: {
              service: true,
            },
          },
          responsible: {
            select: {
              id: true,
              firstName: true,
              lastName1: true,
              email: true,
            },
          },
          payments: true,
        },
      })
      return contract
    } catch (error) {
      console.error("Error fetching contract:", error)
      throw error
    }
  }

  static async updateContract(
    id: number,
    data: {
      clientName?: string
      clientRFC?: string
      clientStreet?: string
      clientExteriorNumber?: string
      clientInteriorNumber?: string
      clientNeighborhood?: string
      clientPostalCode?: string
      clientCity?: string
      clientState?: string
      vehicleId?: number
      quoteId?: number
      startDate?: Date
      endDate?: Date
      status?: string
      marketingConsent?: boolean
      advertisingConsent?: boolean
      profecoNumber?: string
      profecoDate?: Date
      clientSignature?: string
      services?: Array<{ serviceId: number; price: number }>
    },
  ) {
    try {
      if (data.services) {
        await prisma.contractService.deleteMany({
          where: { contractId: id },
        })
      }

      const contract = await prisma.contract.update({
        where: { id },
        data: {
          clientName: data.clientName,
          clientRFC: data.clientRFC,
          clientStreet: data.clientStreet,
          clientExteriorNumber: data.clientExteriorNumber,
          clientInteriorNumber: data.clientInteriorNumber,
          clientNeighborhood: data.clientNeighborhood,
          clientPostalCode: data.clientPostalCode,
          clientCity: data.clientCity,
          clientState: data.clientState,
          vehicleId: data.vehicleId,
          quoteId: data.quoteId,
          startDate: data.startDate,
          endDate: data.endDate,
          status: data.status,
          marketingConsent: data.marketingConsent,
          advertisingConsent: data.advertisingConsent,
          profecoNumber: data.profecoNumber,
          profecoDate: data.profecoDate,
          clientSignature: data.clientSignature,
          services: data.services
            ? {
              create: data.services.map((s) => ({
                serviceId: s.serviceId,
                price: new Prisma.Decimal(s.price),
              })),
            }
            : undefined,
        },
        include: {
          vehicle: true,
          services: {
            include: {
              service: true,
            },
          },
          responsible: {
            select: {
              id: true,
              firstName: true,
              lastName1: true,
              email: true,
            },
          },
        },
      })
      return contract
    } catch (error) {
      console.error("Error updating contract:", error)
      throw error
    }
  }

  static async deleteContract(id: number) {
    try {
      await prisma.contractService.deleteMany({
        where: { contractId: id },
      })

      await prisma.payment.deleteMany({
        where: { contractId: id },
      })

      const contract = await prisma.contract.delete({
        where: { id },
      })
      return contract
    } catch (error) {
      console.error("Error deleting contract:", error)
      throw error
    }
  }

  static async getContractStats() {
    try {
      const [CurrentAndPaid, CurrentAndInDebt, Expired] = await Promise.all([
        prisma.contract.count({ where: { status: "CurrentAndPaid" } }),
        prisma.contract.count({ where: { status: "CurrentAndInDebt" } }),
        prisma.contract.count({ where: { status: "Expired" } }),
      ])

      return {
        CurrentAndPaid,
        CurrentAndInDebt,
        Expired,
      }
    } catch (error) {
      console.error("Error fetching contract stats:", error)
      throw error
    }
  }

  static async getVehicles() {
    try {
      const vehicles = await prisma.vehicle.findMany({
        orderBy: { id: "asc" },
      })
      return vehicles
    } catch (error) {
      console.error("Error fetching vehicles:", error)
      throw error
    }
  }

  static async getServices() {
    try {
      const services = await prisma.service.findMany({
        orderBy: { name: "asc" },
      })
      return services
    } catch (error) {
      console.error("Error fetching services:", error)
      throw error
    }
  }
}
