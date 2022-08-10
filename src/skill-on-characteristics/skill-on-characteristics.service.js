const PostgreSQLPrisma = require("../db/postgreSQL.prisma.service");

class SkillOnCharacteristicsService {
    async getOneBySkillIdAndCharacteristicTypeId(skillId, characteristicTypeId){
        return PostgreSQLPrisma.skillOnCharacteristics.findFirst({where: {characteristicTypeId, skillId}});
    }

    async deleteByCharacteristicTypeId(characteristicTypeId) {
        return PostgreSQLPrisma.skillOnCharacteristics.deleteMany({where: {characteristicTypeId}});
    }

    async deleteBySkillId(skillId) {
        return PostgreSQLPrisma.skillOnCharacteristics.deleteMany({where: {skillId}});
    }

    async create(dto) {
        return PostgreSQLPrisma.skillOnCharacteristics.create({data: dto});
    }

    async delete(skillId, characteristicTypeId) {
        return PostgreSQLPrisma.skillOnCharacteristics
            .delete({where: {characteristicTypeId_skillId: {characteristicTypeId, skillId}}})
    }

    async update(dto, skillId, characteristicTypeId) {
        return PostgreSQLPrisma.skillOnCharacteristics
            .update({data: dto, where: {characteristicTypeId_skillId: {characteristicTypeId, skillId}}});
    }
}

module.exports = new SkillOnCharacteristicsService();