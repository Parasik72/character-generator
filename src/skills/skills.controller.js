const HttpException = require('../exceptions/HttpException');
const { validationResult } = require('express-validator');
const SkillsService = require('./skills.service');
const SkillOnUsersService = require('../skill-on-users/skill-on-users.service');
const { SelectSkill } = require('./skill.select');
const LogsService = require('../logs/logs.service');

class SkillsController {
    async getAll(req, res){
        try {
            const userReq = req.user;
            const skills = await SkillsService.getAll(SelectSkill);
            await LogsService.create({operation: 'Get all the skills.', createdBy: userReq.id});
            return res.json(skills);
        } catch (error) {
            if(error instanceof HttpException)
                return res.status(error.statusCode).json({message: error.message});
            console.log(error);
            return res.status(500).json({message: 'Error getting all the skills.'});
        }
    }

    async create(req, res){
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty())
                throw new HttpException(errors.errors[0].msg, 400);
            const userReq = req.user;
            const dto = req.body;
            let skill = await SkillsService.getOneByName(dto.name);
            if(skill)
                throw new HttpException('This skill already exists.', 400);
            const id = await SkillsService.generateSkillId();
            skill = await SkillsService.create({id, name: dto.name});
            await LogsService.create({operation: `Create a skill. Skill id: < ${skill.id} >.`, createdBy: userReq.id});
            return res.status(201).json(skill);
        } catch (error) {
            if(error instanceof HttpException)
                return res.status(error.statusCode).json({message: error.message});
            console.log(error);
            return res.status(500).json({message: 'Error creating a skill.'});
        }
    }

    async update(req, res){
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty())
                throw new HttpException(errors.errors[0].msg, 400);
            const userReq = req.user;
            const dto = req.body;
            const params = req.params;
            let skill = await SkillsService.getOneById(params.skillId);
            if(!skill)
                throw new HttpException('The skill was not found.', 404);
            if(dto.name){
                const checkName = await SkillsService.getOneByName(dto.name);
                if(!checkName)
                    skill = await SkillsService.update({name: dto.name}, skill.id);
            }
            await LogsService.create({operation: `Update < ${skill.id} > skill.`, createdBy: userReq.id});
            return res.json(skill);
        } catch (error) {
            if(error instanceof HttpException)
                return res.status(error.statusCode).json({message: error.message});
            console.log(error);
            return res.status(500).json({message: 'Error updating the skill.'});
        }
    }

    async delete(req, res){
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty())
                throw new HttpException(errors.errors[0].msg, 400);
            const userReq = req.user;
            const params = req.params;
            let skill = await SkillsService.getOneById(params.skillId);
            if(!skill)
                throw new HttpException('The skill was not found.', 404);
            skill = await SkillsService.delete(skill.id);
            await LogsService.create({operation: `Delete < ${skill.id} > skill.`, createdBy: userReq.id});
            return res.json({message: `The < ${skill.name} > skill has been deleted successfully.>`});
        } catch (error) {
            if(error instanceof HttpException)
                return res.status(error.statusCode).json({message: error.message});
            console.log(error);
            return res.status(500).json({message: 'Error deleting the skill.'});
        }
    }

    async addCharacteristics(req, res){
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty())
                throw new HttpException(errors.errors[0].msg, 400);
            const userReq = req.user;
            const params = req.params;
            const skill  = await SkillsService.getOneById(params.skillId);
            if(!skill)
                throw new HttpException('The skill was not found.', 404);
            const dto = req.body;
            const characteristics = await SkillsService.addCharacteristics(dto, skill.id);
            await LogsService.create({operation: `Add characteristics to < ${skill.id} > skill.`, createdBy: userReq.id});
            return res.json(characteristics);
        } catch (error) {
            if(error instanceof HttpException)
                return res.status(error.statusCode).json({message: error.message});
            console.log(error);
            return res.status(500).json({message: 'Error add the characteristics to the skill.'});
        }
    }

    async addStats(req, res){
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty())
                throw new HttpException(errors.errors[0].msg, 400);
            const userReq = req.user;
            const params = req.params;
            const skill  = await SkillsService.getOneById(params.skillId);
            if(!skill)
                throw new HttpException('The skill was not found.', 404);
            const dto = req.body;
            const stats = await SkillsService.addStats(dto, skill.id);
            await LogsService.create({operation: `Add stats to < ${skill.id} > skill.`, createdBy: userReq.id});
            return res.json(stats);
        } catch (error) {
            if(error instanceof HttpException)
                return res.status(error.statusCode).json({message: error.message});
            console.log(error);
            return res.status(500).json({message: 'Error add the stats to the skill.'});
        }
    }

    async removeStats(req, res){
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty())
                throw new HttpException(errors.errors[0].msg, 400);
            const userReq = req.user;
            const params = req.params;
            const skill  = await SkillsService.getOneById(params.skillId);
            if(!skill)
                throw new HttpException('The skill was not found.', 404);
            const dto = req.body;
            const stats = await SkillsService.removeStats(dto, skill.id);
            await LogsService.create({operation: `Remove stats from < ${skill.id} > skill.`, createdBy: userReq.id});
            return res.json(stats);
        } catch (error) {
            if(error instanceof HttpException)
                return res.status(error.statusCode).json({message: error.message});
            console.log(error);
            return res.status(500).json({message: 'Error remove the stats from the skill.'});
        }
    }

    async removeCharacteristics(req, res){
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty())
                throw new HttpException(errors.errors[0].msg, 400);
            const userReq = req.user;
            const params = req.params;
            const skill  = await SkillsService.getOneById(params.skillId);
            if(!skill)
                throw new HttpException('The skill was not found.', 404);
            const dto = req.body;
            const characteristics = await SkillsService.removeCharacteristics(dto, skill.id);
            await LogsService.create({operation: `Remove characteristics from < ${skill.id} > skill.`, createdBy: userReq.id});
            return res.json(characteristics);
        } catch (error) {
            if(error instanceof HttpException)
                return res.status(error.statusCode).json({message: error.message});
            console.log(error);
            return res.status(500).json({message: 'Error removing the characteristics from the skill.'});
        }
    }

    async addSkill(req, res){
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty())
                throw new HttpException(errors.errors[0].msg, 400);
            const userReq = req.user;
            const dto = req.body;
            const skill  = await SkillsService.getOneByName(dto.name);
            if(!skill)
                throw new HttpException('The skill was not found.', 404);
            let skillOnUser = await SkillOnUsersService.getOneBySkillIdAndUserId(skill.id, userReq.id);
            if(skillOnUser)
                throw new HttpException('The user already has that skill.', 400);
            skillOnUser = await SkillOnUsersService.create(skill.id, userReq.id);
            await LogsService.create({operation: `Add < ${skill.id} > skill to the user.`, createdBy: userReq.id});
            return res.json(skillOnUser);
        } catch (error) {
            if(error instanceof HttpException)
                return res.status(error.statusCode).json({message: error.message});
            console.log(error);
            return res.status(500).json({message: 'Error add the skill to the user.'});
        }
    }
    
    async removeSkill(req, res){
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty())
                throw new HttpException(errors.errors[0].msg, 400);
            const userReq = req.user;
            const dto = req.body;
            const skill  = await SkillsService.getOneByName(dto.name);
            if(!skill)
                throw new HttpException('The skill was not found.', 404);
            const skillOnUser = await SkillOnUsersService.getOneBySkillIdAndUserId(skill.id, userReq.id);
            if(!skillOnUser)
                throw new HttpException('The user has not that skill.', 404);
            await SkillOnUsersService.delete(skillOnUser.skillId, skillOnUser.userId);
            await LogsService.create({operation: `Remove < ${skill.id} > skill from the user.`, createdBy: userReq.id});
            return res.json({message: `The < ${skill.name} > skill has been removed successfully.`});
        } catch (error) {
            if(error instanceof HttpException)
                return res.status(error.statusCode).json({message: error.message});
            console.log(error);
            return res.status(500).json({message: 'Error remove the skill from the user.'});
        }
    }
}

module.exports = new SkillsController();