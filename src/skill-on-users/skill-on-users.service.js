const PostgreSQLPrisma = require("../db/postgreSQL.prisma.service");

class SkillOnUsersService {
    async getOneBySkillIdAndUserId(skillId, userId) {
        return PostgreSQLPrisma.skillOnUsers.findFirst({where: {userId, skillId}});
    }

    async getByUserId(userId) {
        return PostgreSQLPrisma.skillOnUsers.findMany({where: {userId}});
    }

    async create(skillId, userId) {
        return PostgreSQLPrisma.skillOnUsers.create({data: {skillId, userId}});
    }

    async delete(skillId, userId) {
        return PostgreSQLPrisma.skillOnUsers.delete({where: {userId_skillId: {userId, skillId}}});
    }

    async deleteBySkillId(skillId) {
        return PostgreSQLPrisma.skillOnUsers.deleteMany({where: {skillId}});
    }
}

module.exports = new SkillOnUsersService();