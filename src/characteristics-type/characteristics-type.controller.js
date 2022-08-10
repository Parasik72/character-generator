const HttpException = require('../exceptions/HttpException');
const CharacteristicsTypeService = require('./characteristics-type.service');
const { SelectCharacteristicsType } = require('./characteristics-type.select');
const { validationResult } = require('express-validator');
const LogsService = require('../logs/logs.service');

class CharacteristicsTypeController {
    async getAll(req, res){
        try {
            const userReq = req.user;
            const types = await CharacteristicsTypeService.getAll(SelectCharacteristicsType);
            await LogsService.create({operation: 'Get all the characteristic types.', createdBy: userReq.id});
            return res.json(types);
        } catch (error) {
            if(error instanceof HttpException)
                return res.status(error.statusCode).json({message: error.message});
            console.log(error);
            return res.status(500).json({message: 'Error getting all the characteristic types.'});
        }
    }

    async create(req, res){
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty())
                throw new HttpException(errors.errors[0].msg, 400);
            const userReq = req.user;
            const dto = req.body;
            let characteristicType = await CharacteristicsTypeService.getOneByName(dto.name);
            if(characteristicType)
                throw new HttpException('This characteristic type already exists.', 400);
            const id = await CharacteristicsTypeService.generateCharacteristicTypeId();
            characteristicType = await CharacteristicsTypeService.create({id, name: dto.name});
            await LogsService.create({operation: `Create a characteristic type. Characteristic type id: < ${characteristicType.id} >.`, createdBy: userReq.id});
            return res.status(201).json(characteristicType);
        } catch (error) {
            if(error instanceof HttpException)
                return res.status(error.statusCode).json({message: error.message});
            console.log(error);
            return res.status(500).json({message: 'Error creating the characteristic type.'});
        }
    }

    async update(req, res){
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty())
                throw new HttpException(errors.errors[0].msg, 400);
            const userReq = req.user;
            const params = req.params;
            let characteristicType = await CharacteristicsTypeService.getOneById(params.characteristicTypeId);
            if(!characteristicType)
                throw new HttpException('The characteristic type was not found.', 404);
            const dto = req.body;
            if(dto.name){
                const checkName = await CharacteristicsTypeService.getOneByName(dto.name);
                if(!checkName)
                    characteristicType = await CharacteristicsTypeService.update({name: dto.name}, characteristicType.id);
            }
            await LogsService.create({operation: `Update < ${characteristicType.id} > characteristic type.`, createdBy: userReq.id});
            return res.json(characteristicType);
        } catch (error) {
            if(error instanceof HttpException)
                return res.status(error.statusCode).json({message: error.message});
            console.log(error);
            return res.status(500).json({message: 'Error updating the characteristic type.'});
        }
    }

    async delete(req, res){
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty())
                throw new HttpException(errors.errors[0].msg, 400);
            const userReq = req.user;
            const params = req.params;
            let characteristicType = await CharacteristicsTypeService.getOneById(params.characteristicTypeId);
            if(!characteristicType)
                throw new HttpException('The characteristic type was not found.', 404);
            characteristicType = await CharacteristicsTypeService.delete(characteristicType.id);
            await LogsService.create({operation: `Delete < ${characteristicType.id} > characteristic type.`, createdBy: userReq.id});
            return res.json({message: `The < ${characteristicType.name} characteristic type has been deleted successfully.>`});
        } catch (error) {
            if(error instanceof HttpException)
                return res.status(error.statusCode).json({message: error.message});
            console.log(error);
            return res.status(500).json({message: 'Error deleting the characteristic type.'});
        }
    }

    async addStats(req, res){
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty())
                throw new HttpException(errors.errors[0].msg, 400);
            const userReq = req.user;
            const params = req.params;
            let characteristicType = await CharacteristicsTypeService.getOneById(params.characteristicTypeId);
            if(!characteristicType)
                throw new HttpException('The characteristic type was not found.', 404);
            const dto = req.body;
            const stats = await CharacteristicsTypeService.addStats(dto, characteristicType.id);
            await LogsService.create({operation: `Add stats to < ${characteristicType.id} > characteristic type.`, createdBy: userReq.id});
            return res.json(stats);
        } catch (error) {
            if(error instanceof HttpException)
                return res.status(error.statusCode).json({message: error.message});
            console.log(error);
            return res.status(500).json({message: 'Error adding the stats to the characteristic type.'});
        }
    }

    async removeStats(req, res){
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty())
                throw new HttpException(errors.errors[0].msg, 400);
            const userReq = req.user;
            const params = req.params;
            let characteristicType = await CharacteristicsTypeService.getOneById(params.characteristicTypeId);
            if(!characteristicType)
                throw new HttpException('The characteristic type was not found.', 404);
            const dto = req.body;
            const stats = await CharacteristicsTypeService.removeStats(dto, characteristicType.id);
            await LogsService.create({operation: `Remove stats from < ${characteristicType.id} > characteristic type.`, createdBy: userReq.id});
            return res.json(stats);
        } catch (error) {
            if(error instanceof HttpException)
                return res.status(error.statusCode).json({message: error.message});
            console.log(error);
            return res.status(500).json({message: 'Error removing the stats from the characteristic type.'});
        }
    }
}

module.exports = new CharacteristicsTypeController();