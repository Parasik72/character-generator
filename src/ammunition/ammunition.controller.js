const HttpException = require('../exceptions/HttpException');
const AmmunitionService = require('./ammunition.service');
const { validationResult } = require('express-validator');
const AmmunitionTypeService = require('../ammunition-type/ammunition-type.service');
const { SelectAmmunition } = require('./ammunition.select');
const LogsService = require('../logs/logs.service');
const ammunitionOnUserService = require('../ammunition-on-user/ammunition-on-user.service');

class AmmunitionController {
    async getAll(req, res){
        try {
            const userReq = req.user;
            const users = await AmmunitionService.getAll();
            await LogsService.create({operation: 'Get all the ammunition', createdBy: userReq.id});
            return res.json(users);
        } catch (error) {
            if(error instanceof HttpException)
                return res.status(error.statusCode).json({message: error.message});
            console.log(error);
            return res.status(500).json({message: 'Error getting all the ammunition.'});
        }
    }

    async create(req, res){
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty())
                throw new HttpException(errors.errors[0].msg, 400);
            const userReq = req.user;
            const pictureFile = req.files?.picture;
            const dto = req.body;
            const ammunitionType = await AmmunitionTypeService.getOneByType(dto.type);
            if(!ammunitionType)
                throw new HttpException('The ammunition type was not found.', 404);
            let picture = null;
            if(pictureFile)
                picture = AmmunitionService.uploadFile(pictureFile);
            const id = await AmmunitionService.generateAmmunitionId();
            const ammunition = await AmmunitionService
                .create({id, name: dto.name, picture, ammunitionTypeId: ammunitionType.id});
            await LogsService.create({operation: `Create an ammunition. Ammunition id: < ${ammunition.id} >`, createdBy: userReq.id});
            return res.status(201).json(ammunition);
        } catch (error) {
            if(error instanceof HttpException)
                return res.status(error.statusCode).json({message: error.message});
            console.log(error);
            return res.status(500).json({message: 'Error creating the ammunition.'});
        }
    }

    async addAmmunition(req, res){
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty())
                throw new HttpException(errors.errors[0].msg, 400);
            const userReq = req.user;
            const dto = req.body;
            const ammunition = await AmmunitionService.getOneByName(dto.name);
            if(!ammunition)
                throw new HttpException('The ammunition was not found.', 404);
            let ammunitionOnUser = await ammunitionOnUserService.getByAmmunitionIdAndUserId(ammunition.id, userReq.id);
            if(ammunitionOnUser)
                throw new HttpException('The user already has that ammunition.', 400);
            ammunitionOnUser = await ammunitionOnUserService.create({ammunitionId: ammunition.id, userId: userReq.id});
            await LogsService.create({operation: `Add < ${ammunition.id} > ammunition to the user.`, createdBy: userReq.id});
            return res.json(ammunitionOnUser);
        } catch (error) {
            if(error instanceof HttpException)
                return res.status(error.statusCode).json({message: error.message});
            console.log(error);
            return res.status(500).json({message: 'Error add the ammunition to the user.'});
        }
    }

    async removeAmmunition(req, res){
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty())
                throw new HttpException(errors.errors[0].msg, 400);
            const userReq = req.user;
            const dto = req.body;
            const ammunition = await AmmunitionService.getOneByName(dto.name);
            if(!ammunition)
                throw new HttpException('The ammunition was not found.', 404);
            const ammunitionOnUser = await ammunitionOnUserService.getByAmmunitionIdAndUserId(ammunition.id, userReq.id);
            if(!ammunitionOnUser)
                throw new HttpException('The user has not that ammunition.', 404);
            
            await ammunitionOnUserService.delete(ammunition.id, userReq.id);
            await LogsService.create({operation: `Remove < ${ammunition.id} > ammunition from the user.`, createdBy: userReq.id});
            return res.json({message: `The < ${ammunition.id} > ammunition has been removed successfully.`});
        } catch (error) {
            if(error instanceof HttpException)
                return res.status(error.statusCode).json({message: error.message});
            console.log(error);
            return res.status(500).json({message: 'Error remove the ammunition from the user.'});
        }
    }

    async addCharacteristics(req, res){
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty())
                throw new HttpException(errors.errors[0].msg, 400);
            const userReq = req.user;
            const params = req.params;
            let ammunition = await AmmunitionService.getOneById(params.ammunitionId, SelectAmmunition);
            if(!ammunition)
                throw new HttpException('The ammunition was not found.', 404);
            const dto = req.body;
            const characteristics = await AmmunitionService.addCharacteristics(dto, ammunition.id);
            await LogsService.create({operation: `Add characteristics to < ${ammunition.id} > ammunition.`, createdBy: userReq.id});
            return res.json(characteristics);
        } catch (error) {
            if(error instanceof HttpException)
                return res.status(error.statusCode).json({message: error.message});
            console.log(error);
            return res.status(500).json({message: 'Error adding the characters to the ammunition.'});
        }
    }

    async addStats(req, res){
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty())
                throw new HttpException(errors.errors[0].msg, 400);
            const userReq = req.user;
            const params = req.params;
            let ammunition = await AmmunitionService.getOneById(params.ammunitionId, SelectAmmunition);
            if(!ammunition)
                throw new HttpException('The ammunition was not found.', 404);
            const dto = req.body;
            const stats = await AmmunitionService.addStats(dto, ammunition.id);
            await LogsService.create({operation: `Add stats to < ${ammunition.id} > ammunition.`, createdBy: userReq.id});
            return res.json(stats);
        } catch (error) {
            if(error instanceof HttpException)
                return res.status(error.statusCode).json({message: error.message});
            console.log(error);
            return res.status(500).json({message: 'Error adding the stats to the ammunition.'});
        }
    }

    async addSkills(req, res){
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty())
                throw new HttpException(errors.errors[0].msg, 400);
            const userReq = req.user;
            const params = req.params;
            let ammunition = await AmmunitionService.getOneById(params.ammunitionId, SelectAmmunition);
            if(!ammunition)
                throw new HttpException('The ammunition was not found.', 404);
            const dto = req.body;
            const skills = await AmmunitionService.addSkills(dto, ammunition.id);
            await LogsService.create({operation: `Add skills to < ${ammunition.id} > ammunition.`, createdBy: userReq.id});
            return res.json(skills);
        } catch (error) {
            if(error instanceof HttpException)
                return res.status(error.statusCode).json({message: error.message});
            console.log(error);
            return res.status(500).json({message: 'Error adding the skills to the ammunition.'});
        }
    }

    async removeSkills(req, res){
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty())
                throw new HttpException(errors.errors[0].msg, 400);
            const userReq = req.user;
            const params = req.params;
            let ammunition = await AmmunitionService.getOneById(params.ammunitionId, SelectAmmunition);
            if(!ammunition)
                throw new HttpException('The ammunition was not found.', 404);
            const dto = req.body;
            const skills = await AmmunitionService.removeSkills(dto, ammunition.id);
            await LogsService.create({operation: `Remove skills from < ${ammunition.id} > ammunition.`, createdBy: userReq.id});
            return res.json(skills);
        } catch (error) {
            if(error instanceof HttpException)
                return res.status(error.statusCode).json({message: error.message});
            console.log(error);
            return res.status(500).json({message: 'Error removing the skills from the ammunition.'});
        }
    }

    async removeCharacteristics(req, res){
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty())
                throw new HttpException(errors.errors[0].msg, 400);
            const userReq = req.user;
            const params = req.params;
            let ammunition = await AmmunitionService.getOneById(params.ammunitionId, SelectAmmunition);
            if(!ammunition)
                throw new HttpException('The ammunition was not found.', 404);
            const dto = req.body;
            const characteristics = await AmmunitionService.removeCharacteristics(dto, ammunition.id);
            await LogsService.create({operation: `Remove characteristics from < ${ammunition.id} > ammunition.`, createdBy: userReq.id});
            return res.json(characteristics);
        } catch (error) {
            if(error instanceof HttpException)
                return res.status(error.statusCode).json({message: error.message});
            console.log(error);
            return res.status(500).json({message: 'Error removing the characters from the ammunition.'});
        }
    }

    async removeStats(req, res){
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty())
                throw new HttpException(errors.errors[0].msg, 400);
            const userReq = req.user;
            const params = req.params;
            let ammunition = await AmmunitionService.getOneById(params.ammunitionId, SelectAmmunition);
            if(!ammunition)
                throw new HttpException('The ammunition was not found.', 404);
            const dto = req.body;
            const stats = await AmmunitionService.removeStats(dto, ammunition.id);
            await LogsService.create({operation: `Remove stats from < ${ammunition.id} > ammunition.`, createdBy: userReq.id});
            return res.json(stats);
        } catch (error) {
            if(error instanceof HttpException)
                return res.status(error.statusCode).json({message: error.message});
            console.log(error);
            return res.status(500).json({message: 'Error removing the stats from the ammunition.'});
        }
    }

    async update(req, res){
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty())
                throw new HttpException(errors.errors[0].msg, 400);
            const userReq = req.user;
            const params = req.params;
            let ammunition = await AmmunitionService.getOneById(params.ammunitionId);
            if(!ammunition)
                throw new HttpException('The ammunition was not found.', 404);
            const dto = req.body;
            const pictureFile = req.files?.picture;
            if(pictureFile){
                const picture = await AmmunitionService.uploadFile(pictureFile, ammunition);
                ammunition = await AmmunitionService.updateAmmunition({picture}, ammunition, SelectAmmunition);
            }
            if(dto.type){
                const ammunitionType = await AmmunitionTypeService.getOneByType(dto.type);
                if(ammunitionType)
                    ammunition = await AmmunitionService.updateAmmunition({ammunitionTypeId: ammunitionType.id}, ammunition, SelectAmmunition);
            }
            if(dto.name){
                const checkName = await AmmunitionService.getOneByName(dto.name);
                if(!checkName)
                    ammunition = await AmmunitionService.updateAmmunition({name: dto.name}, ammunition, SelectAmmunition);
            } 
            await LogsService.create({operation: `Update < ${ammunition.id} > ammunition.`, createdBy: userReq.id});
            return res.json(ammunition);
        } catch (error) {
            if(error instanceof HttpException)
                return res.status(error.statusCode).json({message: error.message});
            console.log(error);
            return res.status(500).json({message: 'Error updating the ammunition.'});
        }
    }

    async delete(req, res){
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty())
                throw new HttpException(errors.errors[0].msg, 400);
            const userReq = req.user;
            const params = req.params;
            const ammunition = await AmmunitionService.getOneById(params.ammunitionId);
            if(!ammunition)
                throw new HttpException('The ammunition was not found.', 404);
            AmmunitionService.deleteFile(ammunition);
            await AmmunitionService.deleteAmmunition(ammunition);
            await LogsService.create({operation: `Delete < ${ammunition.id} > ammunition.`, createdBy: userReq.id});
            return res.json({message: `The ammunition < ${ammunition.name} > has been deleted successfully.`});
        } catch (error) {
            if(error instanceof HttpException)
                return res.status(error.statusCode).json({message: error.message});
            console.log(error);
            return res.status(500).json({message: 'Error deleting the ammunition.'});
        }
    }
}

module.exports = new AmmunitionController();