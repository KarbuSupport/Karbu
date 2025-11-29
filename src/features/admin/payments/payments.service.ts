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
        const totalPaymentAmount =
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

        if (paidAmount >= totalPaymentAmount) {
            newStatus = "CurrentAndPaid"
        } else if (paidAmount > 0 && paidAmount < totalPaymentAmount) {
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
console.log('filters :', filters);
  try {
    const where: any = {};

    // Filtrado directo por IDs
    if (filters?.contractId) where.contractId = filters.contractId
    if (filters?.quoteId) where.quoteId = filters.quoteId
    if (filters?.responsibleUser) where.responsibleUser = filters.responsibleUser
    if (filters?.status) where.contract.status = filters.status;

    // --------------------------
    // 🔎 BÚSQUEDA GLOBAL
    // --------------------------
    if (filters?.search) {
      const searchRaw = filters.search.trim();
      const search = searchRaw.replace(/,/g, ''); // quitar comas para montos "2,000"
      let numericId: number | undefined;

      // Detectamos etiquetas PAY-, CNT-, QTZ-, COT-
      const tagMatch = searchRaw.match(/^(PAY|CNT|QTZ|COT)-(\d+)$/i);
      if (tagMatch) {
        numericId = Number(tagMatch[2]);
      } else if (!isNaN(Number(search))) {
        numericId = Number(search);
      }

      where.OR = [
        // Client name
        { contract: { clientName: { contains: searchRaw, mode: "insensitive" } } },

        // Responsible User
        { responsible: {
            OR: [
              { firstName: { contains: searchRaw, mode: "insensitive" } },
              { lastName1: { contains: searchRaw, mode: "insensitive" } },
              { lastName2: { contains: searchRaw, mode: "insensitive" } },
            ]
        }},

        // Status
        // { contract: { status: { contains: searchRaw, mode: "insensitive" } } },
      ];

      // Si es número → buscamos por IDs, montos
      if (numericId !== undefined) {
      console.log('numericId :', numericId);
        where.OR.push(
          { id: numericId },          // PAY-3 → payment.id
          { contractId: numericId },  // CNT-3
          { quoteId: numericId },     // QTZ-3
          { amount: numericId }       // monto exacto 2000
        );
      }
    }

    // Ejecutar consulta
    const payments = await prisma.payment.findMany({
      where,
      include: {
        contract: { include: { vehicle: true, responsible: true } },
        quote: { include: { vehicle: true } },
        responsible: true,
      },
      orderBy: { id: "desc" },
    });

    return payments;

  } catch (error) {
    console.error("Error fetching payments:", error);
    throw new Error("Failed to fetch payments");
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
                        services: true,
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
        });

        if (!payment) return null;
        if (!payment.contract) {
            if (payment.quote) {
                const totalPaymentAmount = Number(payment.quote.repairEstimate)
                const totalPaidResult = Number(payment.amount)
                const missingPayment = totalPaymentAmount - totalPaidResult
                return {
                    ...payment,
                    totalPaymentAmount,
                    totalPaid: totalPaidResult,
                    missingPayment,
                };
            }
            return {
                ...payment,
                totalPaymentAmount: 0,
                totalPaid: 0,
                missingPayment: 0,
            };
        }

        // 1. Total del contrato (suma de servicios)
        const totalPaymentAmount =
            payment.contract.services?.reduce((sum, s) => {
                const price = typeof s.price === "number" ? s.price : Number(s.price);
                return sum + price;
            }, 0) || 0;

        // 2. Total pagado (USAR EL contractId DEL PAGO)
        const totalPaidResult = await prisma.payment.aggregate({
            where: { contractId: payment.contractId },
            _sum: { amount: true },
        });

        const totalPaid = Number(totalPaidResult._sum.amount) ?? 0;

        // 3. Pago faltante
        const missingPayment = totalPaymentAmount - totalPaid;

        return {
            ...payment,
            totalPaymentAmount,
            totalPaid,
            missingPayment,
        };

    } catch (error) {
        console.error("Error fetching payment:", error);
        throw new Error("Failed to fetch payment");
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
            orderBy: { id: "desc" }
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
            orderBy: { id: "desc" }
        })
        // console.log('quotes :', quotes);
        return quotes;
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