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
        const searchNumber = Number(filters.search.replace(/^CNT-/, ""))
        where.OR = [
          { clientName: { contains: filters.search, mode: "insensitive" } },
          { vehicle: { licensePlate: { contains: filters.search, mode: "insensitive" } } },
        ]
        if (!isNaN(searchNumber)) {
          where.OR.push({ id: searchNumber })
        }
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
