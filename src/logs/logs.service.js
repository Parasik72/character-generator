const MongoDB = require('../db/mongoDB.prisma.service');

class LogsService {
    async getAll(){
        return MongoDB.log.findMany();
    }

    async create(dto) {
        return MongoDB.log.create({data: dto});
    }
}

module.exports = new LogsService();