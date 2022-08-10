const HttpException = require('../exceptions/HttpException');
const LogsService = require('./logs.service');

class LogsController {
    async getAll(req, res) {
        try {
            const logs = await LogsService.getAll();
            return res.json(logs);
        } catch (error) {
            if(error instanceof HttpException)
                return res.status(error.statusCode).json({message: error.message});
            console.log(error);
            return res.status(500).json({message: 'Error getting all the logs.'});
        }
    }
}

module.exports = new LogsController();