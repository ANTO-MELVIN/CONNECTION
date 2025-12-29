const { PrismaClient } = require('@prisma/client');

let prisma;

const globalForPrisma = global;

if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = new PrismaClient();
}

prisma = globalForPrisma.prisma;

module.exports = prisma;
