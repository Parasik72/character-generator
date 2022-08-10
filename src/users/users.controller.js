const HttpException = require('../exceptions/HttpException');
const UsersService = require('./users.service');
const { SelectAuthUser } = require("./user.select");
const LogsService = require('../logs/logs.service');

class UsersController {
    async getAll(req, res){
        try {
            const userReq = req.user;
            const users = await UsersService.getAll(SelectAuthUser);
            await LogsService.create({operation: 'Get all the users.', createdBy: userReq.id});
            return res.json(users);
        } catch (error) {
            if(error instanceof HttpException)
                return res.status(error.statusCode).json({message: error.message});
            console.log(error);
            return res.status(500).json({message: 'Error getting all the users.'});
        }
    }
}

module.exports = new UsersController();