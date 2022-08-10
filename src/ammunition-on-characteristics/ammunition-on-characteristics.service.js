const PostgreSQLPrisma = require("../db/postgreSQL.prisma.service");

class AmmunitionOnCharacteristicsService {
    async getOneByCharacteristicTypeIdAndAmmunitionId(characteristicTypeId, ammunitionId){
        return PostgreSQLPrisma.ammunitionOnCharacteristics.findFirst({where: {characteristicTypeId, ammunitionId}});
    }

    async deleteByAmmunitionId(ammunitionId) {
        return PostgreSQLPrisma.ammunitionOnCharacteristics.deleteMany({where: {ammunitionId}});
    }

    async create(dto) {
        return PostgreSQLPrisma.ammunitionOnCharacteristics.create({data: dto});
    }

    async delete(characteristicTypeId, ammunitionId) {
        return PostgreSQLPrisma.ammunitionOnCharacteristics
            .delete({where: {characteristicTypeId_ammunitionId: {characteristicTypeId, ammunitionId}}})
    }

    async update(dto, characteristicTypeId, ammunitionId) {
        return PostgreSQLPrisma.ammunitionOnCharacteristics
            .update({data: dto, where: {characteristicTypeId_ammunitionId: {characteristicTypeId, ammunitionId}}});
    }

    async deleteByCharacteristicTypeId(characteristicTypeId) {
        return PostgreSQLPrisma.ammunitionOnCharacteristics.deleteMany({where: {characteristicTypeId}});
    }
}

module.exports = new AmmunitionOnCharacteristicsService();