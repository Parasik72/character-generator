const HttpException = require('../exceptions/HttpException');
const UsersService = require('../users/users.service');
const { SelectStandardUser } = require("../users/user.select");
const CharacteristicsService = require('../characteristics/characteristics.service');
const StatsService = require('../stats/stats.service');
const AmmunitionService = require('../ammunition/ammunition.service');
const SkillsService = require('../skills/skills.service');
const LogsService = require('../logs/logs.service');
const { validationResult } = require('express-validator');

class ProfilesController {
    async getProfile(req, res) {
        try {
            const userReq = req.user;
            const user = await UsersService.getOneById(userReq.id, SelectStandardUser);
            if(!user)
                throw new HttpException('The user was not found.', 404);
            const characteristics = await CharacteristicsService.calculateCharacteristics(user.id);
            const stats = await StatsService.calculateStats(user.id, characteristics);
            const ammunitions = await AmmunitionService.getByUserId(user.id);
            const skills = await SkillsService.getByUserId(user.id);
            await LogsService.create({operation: 'Get the user profile.', createdBy: userReq.id});
            return res.json({...user, characteristics, stats, ammunitions, skills});
        } catch (error) {
            if(error instanceof HttpException)
                return res.status(error.statusCode).json({message: error.message});
            console.log(error);
            return res.status(500).json({message: 'Error getting the user profile.'});
        }
    }

    async changeProfile(req, res) {
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty())
                throw new HttpException(errors.errors[0].msg, 400);
            const userReq = req.user;
            const dto = req.body;
            let user = await UsersService.getOneById(userReq.id, SelectStandardUser);
            if(!user)
                throw new HttpException('The user was not found.', 404);
            const avatarFile = req.files?.avatar;
            if(avatarFile){
                const avatarPath = await UsersService.uploadAvatar(user, avatarFile);
                user = await UsersService.updateUser({avatar: avatarPath}, user, SelectStandardUser);
            }
            if(dto.description)
                user = await UsersService.updateUser({description: dto.description}, user, SelectStandardUser);
            await LogsService.create({operation: 'Update the user profile.', createdBy: userReq.id});
            return res.json(user);
        } catch (error) {
            if(error instanceof HttpException)
                return res.status(error.statusCode).json({message: error.message});
            console.log(error);
            return res.status(500).json({message: 'Error getting the user profile.'});
        }
    }
}

module.exports = new ProfilesController();