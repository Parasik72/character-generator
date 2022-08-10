const PostgreSQLPrisma = require("../db/postgreSQL.prisma.service");
const RolesService = require('../roles/roles.service');
const path = require('path');
const { v4 } = require('uuid');
const { RoleTypes } = require('../roles/roles.type');
const FileUploadService = require("../file-upload/file-upload.service");

class UsersService {
    async createUser(dto) {
        const role = await RolesService.getRoleByName(RoleTypes.USER);
        if(!role)
            return null;
        return PostgreSQLPrisma.user.create({
            data: {
                ...dto,
                roleId: role.id
            }
        });
    }

    async getOneByEmail(email) {
        return PostgreSQLPrisma.user.findFirst({ where: { email }});
    }

    async getOneById(id, select) {
        return PostgreSQLPrisma.user.findFirst({ where: { id }, select});
    }

    async getAll(select) {
        return PostgreSQLPrisma.user.findMany({select});
    }

    async updateUser(dto, user, select) {
        return PostgreSQLPrisma.user.update({data: dto, where: {id: user.id}, select});
    }

    async generateUserId() {
        let user, id;
        do {
            id = v4();
            user = await PostgreSQLPrisma.user.findUnique({where: {id}});
        } while (user);
        return id;
    }

    uploadAvatar(user, avatarFile){
        if(user.avatar)
            FileUploadService.deleteFile(user.avatar);
        const AVATAR_PATH = path.resolve(__dirname, '..', process.env.AVATAR_PATH) || 'avatar_path'
        return FileUploadService.uploadFile(avatarFile, AVATAR_PATH);
    }
}

module.exports = new UsersService();