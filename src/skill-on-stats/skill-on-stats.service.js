const PostgreSQLPrisma = require("../db/postgreSQL.prisma.service");

class SkillOnStatsService {
    async getOneBySkillIdAndStatId(skillId, statId) {
        return PostgreSQLPrisma.skillOnStats.findFirst({where: {skillId, statId}});
    }

    async deleteBySkillId(skillId) {
        return PostgreSQLPrisma.skillOnStats.deleteMany({where: {skillId}});
    }

    async deleteByStatId(statId) {
        return PostgreSQLPrisma.skillOnStats.deleteMany({where: {statId}});
    }

    async create(dto) {
        return PostgreSQLPrisma.skillOnStats.create({data: dto});
    }

    async delete(skillId, statId) {
        return PostgreSQLPrisma.skillOnStats
            .delete({where: {statId_skillId: {statId, skillId}}});
    }

    async update(dto, skillId, statId) {
        return PostgreSQLPrisma.skillOnStats
            .update({data: dto, where: {statId_skillId: {statId, skillId}}});
    }
}

module.exports = new SkillOnStatsService();