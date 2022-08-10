const { PrismaClient } = require('../../prisma/MongoDB/generated/client');
const MongoDB = new PrismaClient();

module.exports = MongoDB;