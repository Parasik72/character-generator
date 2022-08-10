const HttpException = require('../exceptions/HttpException');
const StatsService = require('./stats.service.js');
const { validationResult } = require('express-validator');
const LogsService = require('../logs/logs.service');

class StatsController {
    async getAll(req, res){
        try {
            const userReq = req.user;
            const stats = await StatsService.getAll();
            await LogsService.create({operation: 'Get all the stats.', createdBy: userReq.id});
            return res.json(stats);
        } catch (error) {
            if(error instanceof HttpException)
                return res.status(error.statusCode).json({message: error.message});
            console.log(error);
            return res.status(500).json({message: 'Error getting all the stats.'});
        }
    }

    async create(req, res) {
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty())
                throw new HttpException(errors.errors[0].msg, 400);
            const userReq = req.user;
            const dto = req.body;
            let stat = await StatsService.getOneByName(dto.name);
            if(stat)
                throw new HttpException('This stat already exists.', 400);
            const id = await StatsService.generateStatId();
            stat = await StatsService.create({id, name: dto.name});
            await LogsService.create({operation: `Create a stat. Stat id: < ${stat.id} >.`, createdBy: userReq.id});
            return res.status(201).json(stat);
        } catch (error) {
            if(error instanceof HttpException)
                return res.status(error.statusCode).json({message: error.message});
            console.log(error);
            return res.status(500).json({message: 'Error creating a stat.'});
        }
    }

    async update(req, res) {
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty())
                throw new HttpException(errors.errors[0].msg, 400);
            const userReq = req.user;
            const params = req.params;
            let stat = await StatsService.getOneById(params.statId);
            if(!stat)
                throw new HttpException('The stat was not found.', 404);
            const dto = req.body;
            if(dto.name){
                const checkName = await StatsService.getOneByName(dto.name);
                if(!checkName)
                    stat = await StatsService.update({name: dto.name}, stat.id);
            }
            await LogsService.create({operation: `Update < ${stat.id} > stat.`, createdBy: userReq.id});
            return res.json(stat);
        } catch (error) {
            if(error instanceof HttpException)
                return res.status(error.statusCode).json({message: error.message});
            console.log(error);
            return res.status(500).json({message: 'Error updating the stat.'});
        }
    }

    async delete(req, res) {
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty())
                throw new HttpException(errors.errors[0].msg, 400);
            const userReq = req.user;
            const params = req.params;
            let stat = await StatsService.getOneById(params.statId);
            if(!stat)
                throw new HttpException('The stat was not found.', 404);
            stat = await StatsService.delete(stat.id);
            await LogsService.create({operation: `Delete < ${stat.id} > stat.`, createdBy: userReq.id});
            return res.json({message: `The < ${stat.name} > stat has been deleted successfully.`});
        } catch (error) {
            if(error instanceof HttpException)
                return res.status(error.statusCode).json({message: error.message});
            console.log(error);
            return res.status(500).json({message: 'Error deleting the stat.'});
        }
    }
}

module.exports = new StatsController();