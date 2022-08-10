const PostgreSQLPrisma = require("../db/postgreSQL.prisma.service");

class AmmunitionOnSkillsService {
    async getByAmmunitionId(ammunitionId){
        return PostgreSQLPrisma.ammunitionOnSkills.findMany({where: {ammunitionId}});
    }
    
    async getOneByAmmunitionIdAndSkillId(ammunitionId, skillId){
        return PostgreSQLPrisma.ammunitionOnSkills.findFirst({where: {ammunitionId, skillId}});
    }

    async deleteByAmmunitionId(ammunitionId) {
        return PostgreSQLPrisma.ammunitionOnSkills.deleteMany({where: {ammunitionId}});
    }

    async deleteBySkillId(skillId) {
        return PostgreSQLPrisma.ammunitionOnSkills.deleteMany({where: {skillId}});
    }

    async create(dto) {
        return PostgreSQLPrisma.ammunitionOnSkills.create({data: dto});
    }

    async delete(ammunitionId, skillId) {
        return PostgreSQLPrisma.ammunitionOnSkills
            .delete({where: {skillId_ammunitionId: {skillId, ammunitionId}}})
    }

    // async update(dto, ammunitionId, skillId) {
    //     return PostgreSQLPrisma.ammunitionOnSkills
    //         .update({data: dto, where: {skillId_ammunitionId: {skillId, ammunitionId}}});
    // }
}

module.exports = new AmmunitionOnSkillsService();