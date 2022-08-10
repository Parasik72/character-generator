const HttpException = require('../exceptions/HttpException');
const AmmunitionTypeService = require('./ammunition-type.service');
const { validationResult } = require('express-validator');
const LogsService = require('../logs/logs.service');

class AmmunitionTypeController {
    async getAll(req, res) {
        try {
            const userReq = req.user;
            const types = await AmmunitionTypeService.getAll();
            await LogsService.create({operation: 'Get all the ammunition types', createdBy: userReq.id});
            return res.json(types);
        } catch (error) {
            if(error instanceof HttpException)
                return res.status(error.statusCode).json({message: error.message});
            console.log(error);
            return res.status(500).json({message: 'Error getting all the ammunition types.'});
        }
    }

    async create(req, res) {
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty())
                throw new HttpException(errors.errors[0].msg, 400);
            const userReq = req.user;
            const dto = req.body;
            let ammunitionType = await AmmunitionTypeService.getOneByType(dto.type);
            if(ammunitionType)
                throw new HttpException('This ammunition type already exists.', 400);
            const id = await AmmunitionTypeService.generateAmmunitionTypeId();
            ammunitionType = await AmmunitionTypeService.create({id, type: dto.type});
            await LogsService.create({operation: `Create an ammunition type. Ammunition type id: < ${ammunitionType.id} >`, createdBy: userReq.id});
            return res.status(201).json(ammunitionType);
        } catch (error) {
            if(error instanceof HttpException)
                return res.status(error.statusCode).json({message: error.message});
            console.log(error);
            return res.status(500).json({message: 'Error creating the ammunition type.'});
        }
    }

    async update(req, res) {
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty())
                throw new HttpException(errors.errors[0].msg, 400);
            const userReq = req.user;
            const params = req.params;
            let ammunitionType = await AmmunitionTypeService.getOneById(params.ammunitionTypeId);
            if(!ammunitionType)
                throw new HttpException('The ammunition type was not found', 404);
            const dto = req.body;
            if(dto.type){
                const checkType = await AmmunitionTypeService.getOneByType(dto.type);
                if(!checkType)
                    ammunitionType = await AmmunitionTypeService.update({type: dto.type}, ammunitionType.id);
            }
            await LogsService.create({operation: `Update < ${ammunitionType.id} > ammunition type.`, createdBy: userReq.id});
            return res.json(ammunitionType);
        } catch (error) {
            if(error instanceof HttpException)
                return res.status(error.statusCode).json({message: error.message});
            console.log(error);
            return res.status(500).json({message: 'Error updating the ammunition type.'});
        }
    }

    async delete(req, res) {
        try {
            const userReq = req.user;
            const params = req.params;
            let ammunitionType = await AmmunitionTypeService.getOneById(params.ammunitionTypeId);
            if(!ammunitionType)
                throw new HttpException('The ammunition type was not found', 404);
            ammunitionType = await AmmunitionTypeService.delete(ammunitionType.id);
            await LogsService.create({operation: `Delete < ${ammunitionType.id} > ammunition type.`, createdBy: userReq.id});
            return res.json({message: `The < ${ammunitionType.type} > ammunition type has been deleted successfully.`});
        } catch (error) {
            if(error instanceof HttpException)
                return res.status(error.statusCode).json({message: error.message});
            console.log(error);
            return res.status(500).json({message: 'Error updating the ammunition type.'});
        }
    }
}

module.exports = new AmmunitionTypeController();