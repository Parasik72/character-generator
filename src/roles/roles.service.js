const PostgreSQLPrisma = require("../db/postgreSQL.prisma.service");
const { v4 } = require('uuid');

class RolesService {
    async createRole(dto) {
        return PostgreSQLPrisma.role.create({data: dto});
    }

    async getAll() {
        return PostgreSQLPrisma.role.findMany();
    }

    async getRoleByName(name){
        return PostgreSQLPrisma.role.findFirst({where: {name}});
    }

    async getRoleById(id) {
        return PostgreSQLPrisma.role.findFirst({where: {id}});
    }

    async deleteRoleByName(name) {
        const role = await PostgreSQLPrisma.role.findFirst({where: {name}});
        if(!role)
            return null;
        await PostgreSQLPrisma.role.delete({where: {id: role.id}});
        return name;
    }

    async setRoleToUser(role, user) {
        return PostgreSQLPrisma.user.update({data: {roleId: role.id}, where: {id: user.id}});;
    }

    async generateRoleId() {
        let role, id;
        do {
            id = v4();
            role = await PostgreSQLPrisma.role.findUnique({where: {id}});
        } while (role);
        return id;
    }
}

module.exports = new RolesService();