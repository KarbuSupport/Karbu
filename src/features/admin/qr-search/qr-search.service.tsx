import { prisma } from "@/src/lib/prisma"

export async function searchContractByQR(qrCode: string) {
  try {
    const contract = await prisma.contract.findFirst({
      where: { qrCode },
      include: {
        vehicle: true,
        responsible: {
          select: {
            id: true,
            firstName: true,
            lastName1: true,
            lastName2: true,
            email: true,
          },
        },
        services: {
          include: {
            service: true,
          },
        },
        quote: true,
      },
    })

    if (!contract) {
      return { success: false, error: "Contrato no encontrado" }
    }

    return { success: true, data: contract }
  } catch (error) {
    console.error("Error searching contract by QR:", error)
    return { success: false, error: "Error al buscar el contrato" }
  }
}

export async function getAllContracts() {
  try {
    const contracts = await prisma.contract.findMany({
      include: {
        vehicle: true,
        responsible: {
          select: {
            id: true,
            firstName: true,
            lastName1: true,
            lastName2: true,
            email: true,
          },
        },
        services: {
          include: {
            service: true,
          },
        },
      },
    })

    return { success: true, data: contracts }
  } catch (error) {
    console.error("Error fetching contracts:", error)
    return { success: false, error: "Error al obtener los contratos" }
  }
}
