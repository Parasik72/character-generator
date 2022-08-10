const PostgreSQLPrisma = require("../db/postgreSQL.prisma.service");

class AmmunitionOnStatsService {
    async getOneByAmmunitionIdAndStatId(ammunitionId, statId){
        return PostgreSQLPrisma.ammunitionOnStats.findFirst({where: {ammunitionId, statId}});
    }

    async deleteByAmmunitionId(ammunitionId) {
        return PostgreSQLPrisma.ammunitionOnStats.deleteMany({where: {ammunitionId}});
    }

    async deleteByStatId(statId) {
        return PostgreSQLPrisma.ammunitionOnStats.deleteMany({where: {statId}});
    }

    async create(dto) {
        return PostgreSQLPrisma.ammunitionOnStats.create({data: dto});
    }

    async delete(ammunitionId, statId) {
        return PostgreSQLPrisma.ammunitionOnStats
            .delete({where: {statId_ammunitionId: {statId, ammunitionId}}})
    }

    async update(dto, ammunitionId, statId) {
        return PostgreSQLPrisma.ammunitionOnStats
            .update({data: dto, where: {statId_ammunitionId: {statId, ammunitionId}}});
    }
}

module.exports = new AmmunitionOnStatsService();