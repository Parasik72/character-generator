const PostgreSQLPrisma = require("../db/postgreSQL.prisma.service");

class CharacteristicTypeOnStatService {
    async getByCharacteristicTypeId(characteristicTypeId){
        return PostgreSQLPrisma.characteristicTypeOnStat.findMany({where: {characteristicTypeId}});
    }

    async deleteByCharacteristicTypeId(characteristicTypeId) {
        return PostgreSQLPrisma.characteristicTypeOnStat.deleteMany({where: {characteristicTypeId}});
    }

    async deleteByStatId(statId) {
        return PostgreSQLPrisma.characteristicTypeOnStat.deleteMany({where: {statId}});
    }

    async getOneByCharacteristicTypeIdAndStatId(characteristicTypeId, statId){
        return PostgreSQLPrisma.characteristicTypeOnStat.findFirst({where: {characteristicTypeId, statId}});
    }

    async create(dto) {
        return PostgreSQLPrisma.characteristicTypeOnStat.create({data: dto});
    }

    async delete(characteristicTypeId, statId) {
        return PostgreSQLPrisma.characteristicTypeOnStat
            .delete({where: {characteristicTypeId_statId: {characteristicTypeId, statId}}})
    }

    async update(dto, characteristicTypeId, statId) {
        return PostgreSQLPrisma.characteristicTypeOnStat
            .update({data: dto, where: {characteristicTypeId_statId: {characteristicTypeId, statId}}});
    }
}

module.exports = new CharacteristicTypeOnStatService();