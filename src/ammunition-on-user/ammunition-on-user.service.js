const PostgreSQLPrisma = require("../db/postgreSQL.prisma.service");

class AmmunitionOnUserService {
    async getByUserId(userId){
        return PostgreSQLPrisma.ammunitionOnUser.findMany({where: {userId}});
    }

    async deleteByAmmunitionId(ammunitionId) {
        return PostgreSQLPrisma.ammunitionOnUser.deleteMany({where: {ammunitionId}});
    }

    async getByAmmunitionIdAndUserId(ammunitionId, userId){
        return PostgreSQLPrisma.ammunitionOnUser.findFirst({where: {ammunitionId, userId}});
    }

    async create(dto) {
        return PostgreSQLPrisma.ammunitionOnUser.create({data: dto});
    }

    async delete(ammunitionId, userId) {
        return PostgreSQLPrisma.ammunitionOnUser.delete({where: {userId_ammunitionId: {userId, ammunitionId}}});
    }
}

module.exports = new AmmunitionOnUserService();