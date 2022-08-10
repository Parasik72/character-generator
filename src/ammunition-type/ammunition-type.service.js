const PostgreSQLPrisma = require("../db/postgreSQL.prisma.service");
const { v4 } = require('uuid');
const AmmunitionService = require("../ammunition/ammunition.service");

class AmmunitionTypeService {
    async getAll(){
        return PostgreSQLPrisma.ammunitionType.findMany();
    }

    async getOneById(id){
        return PostgreSQLPrisma.ammunitionType.findUnique({where: {id}});
    }

    async getOneByType(type){
        return PostgreSQLPrisma.ammunitionType.findFirst({where: {type}});
    }

    async create(dto) {
        return PostgreSQLPrisma.ammunitionType.create({data: dto});
    }

    async generateAmmunitionTypeId() {
        let ammunitionType, id;
        do {
            id = v4();
            ammunitionType = await PostgreSQLPrisma.ammunitionType.findUnique({where: {id}});
        } while (ammunitionType);
        return id;
    }
    
    async update(dto, id) {
        return PostgreSQLPrisma.ammunitionType.update({where: {id}, data: dto});
    }

    async delete(id) {
        const ammunitions = await AmmunitionService.getByAmmunitionTypeId(id);
        for(const ammunition of ammunitions)
            await AmmunitionService.deleteAmmunition(ammunition);
        return PostgreSQLPrisma.ammunitionType.delete({where: {id}});
    }
}

module.exports = new AmmunitionTypeService();