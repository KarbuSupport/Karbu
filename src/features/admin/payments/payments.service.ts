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
        const payments = await prisma.payment.findMany({
            where: {
                ...(filters?.contractId && { contractId: filters.contractId }),
                ...(filters?.quoteId && { quoteId: filters.quoteId }),
                ...(filters?.responsibleUser && { responsibleUser: filters.responsibleUser }),
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
            orderBy: {
                id: "desc"
            },
        })
        console.log('payments :', payments);
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
