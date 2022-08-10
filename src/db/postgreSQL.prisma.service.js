const { PrismaClient } = require('../../prisma/PostgreSQL/generated/client');
const PostgreSQLPrisma = new PrismaClient();

module.exports = PostgreSQLPrisma