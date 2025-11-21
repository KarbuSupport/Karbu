import { prisma } from "@/src/lib/prisma"
import { Decimal } from "@prisma/client/runtime/library"

export interface CreatePaymentInput {
    contractId?: number
    quoteId?: number
    amount: number
    method: string
    paymentDate: Date
    voucherNumber?: string
    voucherImage?: string
    responsibleUser: number
}

export interface UpdatePaymentInput extends Partial<CreatePaymentInput> {
    id: number
}

export interface PaymentFilters {
    status?: string
    contractId?: number
    quoteId?: number
    responsibleUser?: number
    search?: string
}

// CREATE
export async function createPayment(data: CreatePaymentInput) {
    try {
        const payment = await prisma.payment.create({
            data: {
                contractId: data.contractId,
                quoteId: data.quoteId,
                amount: new Decimal(data.amount),
                method: data.method,
                paymentDate: data.paymentDate,
                voucherNumber: data.voucherNumber,
                voucherImage: data.voucherImage,
                responsibleUser: data.responsibleUser,
            },
            include: {
                contract: {
                    include: {
                        vehicle: true,
                        responsible: true,
                        services: true
                    },
                },
                quote: {
                    include: {
                        vehicle: true,
                    },
                },
                responsible: true,
            },
        })

        if (!payment) { throw new Error("Payment could not be created.") }

        if (!payment.contract) {
            // Es un pago de cotización, sin contrato
            return {
                message: "Payment created for quote (no contract yet).",
                payment,
                newStatus: null
            }
        }
        // Calcular el total del contrato basado en los servicios
        const totalContractAmount =
            payment.contract.services?.reduce((sum, s) => {
                const price = typeof s.price === "number" ? s.price : Number(s.price)
                return sum + price
            }, 0) || 0

        // Calcular el total pagado hasta ahora
        const totalPaid = await prisma.payment.aggregate({
            where: { contractId: payment.contractId },
            _sum: { amount: true },
        })

        const paidAmount = Number(totalPaid._sum.amount || 0)

        // Determinar nuevo estado del contrato
        let newStatus: "CurrentAndPaid" | "CurrentAndInDebt" | "Expired"

        if (paidAmount >= totalContractAmount) {
            newStatus = "CurrentAndPaid"
        } else if (paidAmount > 0 && paidAmount < totalContractAmount) {
            newStatus = "CurrentAndInDebt"
        } else {
            newStatus = "Expired"
        }

        // Actualizar el contrato con el nuevo estado
        await prisma.contract.update({
            where: { id: payment.contractId as number },
            data: { status: newStatus },
        })

        return {
            message: "Payment created successfully and contract status updated.",
            payment,
            newStatus,
        }
    } catch (error) {
        console.error("Error creating payment:", error)
        throw new Error("Failed to create payment and update contract status.")
    }
}

// READ - Get all payments with filters
export async function getPayments(filters?: PaymentFilters) {
    try {
        const where: any = {}

        // Filtrado directo por IDs
        if (filters?.contractId) where.contractId = filters.contractId
        if (filters?.quoteId) where.quoteId = filters.quoteId
        if (filters?.responsibleUser) where.responsibleUser = filters.responsibleUser

        // Filtro de búsqueda
        if (filters?.search) {
            const search = filters.search.trim()
            let numericId: number | undefined

            // Si empieza con PAY-, CNT- o COT-, extraemos el número
            if (/^(PAY|CNT|COT)-(\d+)$/i.test(search)) {
                numericId = parseInt(search.split("-")[1])
            } else if (!isNaN(Number(search))) {
                numericId = Number(search)
            }

            where.OR = [
                { contract: { clientName: { contains: search, mode: "insensitive" } } },
            ]

            if (numericId !== undefined) {
                where.OR.push(
                    { id: numericId },        // ID del pago
                    { contractId: numericId }, // ID del contrato
                    { quoteId: numericId }    // ID de la cotización
                )
            }
        }

        const payments = await prisma.payment.findMany({
            where,
            include: {
                contract: { include: { vehicle: true, responsible: true } },
                quote: { include: { vehicle: true } },
                responsible: true,
            },
            orderBy: { id: "desc" },
        })

        return payments
    } catch (error) {
        console.error("Error fetching payments:", error)
        throw new Error("Failed to fetch payments")
    }
}


// READ - Get single payment
export async function getPaymentById(id: number) {
    try {
        const payment = await prisma.payment.findUnique({
            where: { id },
            include: {
                contract: {
                    include: {
                        vehicle: true,
                        responsible: true,
                    },
                },
                quote: {
                    include: {
                        vehicle: true,
                    },
                },
                responsible: true,
            },
        })
        return payment
    } catch (error) {
        console.error("Error fetching payment:", error)
        throw new Error("Failed to fetch payment")
    }
}

// UPDATE
export async function updatePayment(data: UpdatePaymentInput) {
    try {
        const { id, ...updateData } = data
        const payment = await prisma.payment.update({
            where: { id },
            data: {
                ...updateData,
                ...(updateData.amount && { amount: new Decimal(updateData.amount) }),
            },
            include: {
                contract: {
                    include: {
                        vehicle: true,
                        responsible: true,
                    },
                },
                quote: {
                    include: {
                        vehicle: true,
                    },
                },
                responsible: true,
            },
        })
        return payment
    } catch (error) {
        console.error("Error updating payment:", error)
        throw new Error("Failed to update payment")
    }
}

// DELETE
export async function deletePayment(id: number) {
    try {
        const payment = await prisma.payment.delete({
            where: { id },
        })
        return payment
    } catch (error) {
        console.error("Error deleting payment:", error)
        throw new Error("Failed to delete payment")
    }
}

// Get payments by contract
export async function getPaymentsByContract(contractId: number) {
    try {
        const payments = await prisma.payment.findMany({
            where: { contractId },
            include: {
                responsible: true,
            },
            orderBy: {
                id: "desc",
            },
        })
        return payments
    } catch (error) {
        console.error("Error fetching contract payments:", error)
        throw new Error("Failed to fetch contract payments")
    }
}

// Get total amount paid for a contract
export async function getTotalPaidByContract(contractId: number) {
    try {
        const result = await prisma.payment.aggregate({
            where: { contractId },
            _sum: {
                amount: true,
            },
        })
        return result._sum.amount || new Decimal(0)
    } catch (error) {
        console.error("Error calculating total paid:", error)
        throw new Error("Failed to calculate total paid")
    }
}

// Get contracts available for payment (not fully paid)
export async function getContractsAvailableForPayment() {
    try {
        const contracts = await prisma.contract.findMany({
            include: {
                vehicle: true,
                responsible: true,
                payments: true,
            },
        })
        return contracts
    } catch (error) {
        console.error("Error fetching available contracts:", error)
        throw new Error("Failed to fetch available contracts")
    }
}

export async function getQuotesAvailableForPayment() {
    try {
        const quotes = await prisma.quote.findMany({
            include: {
                vehicle: true,
                Payment: true
            },
        })
        console.log('quotes :', quotes);
        return quotes
    } catch (error) {
        console.error("Error fetching available quotes:", error)
        throw new Error("Failed to fetch available quotes")
    }
}

export async function getPaymentsStats() {
    try {
        const now = new Date()

        const day = now.getDate()
        const year = now.getFullYear()
        const monthIndex = now.getMonth()

        const monthNames = [
            "enero", "febrero", "marzo", "abril", "mayo", "junio",
            "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
        ]
        const month = monthNames[monthIndex]

        // 🔹 Obtener todos los pagos
        const payments = await prisma.payment.findMany()

        // -----------------------------------------
        //    PAGOS DEL DÍA
        // -----------------------------------------
        const todayPayments = payments.filter((p) => {
            const paymentDate = new Date(p.paymentDate)
            return paymentDate.toDateString() === now.toDateString()
        }).length

        // -----------------------------------------
        //    INGRESOS DEL MES
        // -----------------------------------------
        const monthlyIncome = payments
            .filter((p) => {
                const paymentDate = new Date(p.paymentDate)
                return (
                    paymentDate.getMonth() === monthIndex &&
                    paymentDate.getFullYear() === year
                )
            })
            .reduce(
                (sum, p) => sum + (typeof p.amount === "number" ? p.amount : Number.parseFloat(String(p.amount))),
                0
            )

        // -----------------------------------------
        //    TOTAL PROCESADO
        // -----------------------------------------
        const totalProcessed = payments.reduce(
            (sum, p) =>
                sum + (typeof p.amount === "number" ? p.amount : Number.parseFloat(String(p.amount))),
            0
        )

        // -----------------------------------------
        //    ESTADÍSTICAS DE CONTRATOS
        // -----------------------------------------
        const [CurrentAndInDebt] = await Promise.all([
            //   prisma.contract.count({ where: { status: "CurrentAndPaid" } }),
            prisma.contract.count({ where: { status: "CurrentAndInDebt" } }),
            //   prisma.contract.count({ where: { status: "Expired" } }),
        ])

        // -----------------------------------------
        //    RESPUESTA FINAL
        // -----------------------------------------
        return {
            success: true,
            data: {
                // ===========
                // Fecha
                // ===========
                // day,
                // month,
                // year,

                // ===========
                // Pagos
                // ===========
                todayPayments,
                monthlyIncome,
                totalProcessed,

                // ===========
                // Contratos
                // ===========
                // CurrentAndPaid,
                CurrentAndInDebt,
                // Expired,
            },
        }
    } catch (error: any) {
        console.error("Error en getPaymentsStatsService:", error)
        return {
            success: false,
            data: {
                todayPayments: 0,
                monthlyIncome: 0,
                totalProcessed: 0,
                CurrentAndPaid: 0,
                CurrentAndInDebt: 0,
                Expired: 0,
            },
            error: error?.message || "Error obteniendo estadísticas",
        }
    }
}