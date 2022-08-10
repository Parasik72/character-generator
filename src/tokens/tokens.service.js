const jwt = require('jsonwebtoken'); 
const PostgreSQLPrisma = require("../db/postgreSQL.prisma.service");
const RolesService = require('../roles/roles.service');

class TokensService {
    async generateToken(user) {
        const role = await RolesService.getRoleById(user.roleId);
        if(!role)
            return null;
        const payload = {
            id: user.id,
            email: user.email,
            role: role.name
        }
        const secret = process.env.JWT_SECRET || 'jwtsecret';
        return jwt.sign(payload, secret, {expiresIn: '3h'});
    }

    async saveToken(userId, accessToken) {
        const token = await PostgreSQLPrisma.token.findFirst({where: {userId}});
        if(!token)
            return PostgreSQLPrisma.token.create({
                data: {
                    userId,
                    accessToken,
                    isActive: true,
                    lastAuthorization: new Date()
                }
            });
        return PostgreSQLPrisma.token.update({
            data: { accessToken, isActive: true, lastAuthorization: new Date() },
            where: { userId }
        });
    }

    async disactivateToken(token) {
        return PostgreSQLPrisma.token.update({data: {isActive: false}, where: {userId: token.userId}});
    }

    async getOneByUserId(userId) {
        return PostgreSQLPrisma.token.findFirst({where: {userId}});
    }
}

module.exports = new TokensService();