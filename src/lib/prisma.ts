// import { PrismaClient } from '@prisma/client';

// declare global {
//   // Evitar multiples instancias en desarrollo
//   var prisma: PrismaClient | undefined;
// }

// export const prisma =
//   global.prisma ||
//   new PrismaClient({
//     log: ['query'],
//   });

// if (process.env.NODE_ENV !== 'production') global.prisma = prisma;
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['error', 'warn', 'info'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
