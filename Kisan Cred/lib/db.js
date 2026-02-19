import { PrismaClient } from '@prisma/client'

/** @type {PrismaClient} */
let prisma

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient()
} else {
  // Reuse client across hot-reloads in development / serverless cold starts
  if (!globalThis.__prisma) {
    globalThis.__prisma = new PrismaClient()
  }
  prisma = globalThis.__prisma
}

export default prisma
