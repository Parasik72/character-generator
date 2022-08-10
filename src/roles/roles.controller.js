const HttpException = require('../exceptions/HttpException');
const RolesService = require('./roles.service');
const { validationResult } = require('express-validator');
const LogsService = require('../logs/logs.service');

class RolesController {
    async create(req, res){
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty())
                throw new HttpException(errors.errors[0].msg, 400);
            const userReq = req.user;
            const dto = req.body;
            const checkRole = await RolesService.getRoleByName(dto.name);
            if(checkRole)
                throw new HttpException('This role already exists.', 400);
            const roleId = await RolesService.generateRoleId();
            const role = await RolesService.createRole({...dto, id: roleId});
            await LogsService.create({operation: `Create a role. Role id: < ${role.id} >.`, createdBy: userReq.id});
            return res.status(201).json(role);
        } catch (error) {
            if(error instanceof HttpException)
                return res.status(error.statusCode).json({message: error.message});
            console.log(error);
            return res.status(500).json({message: 'Error creating a role.'});
        }
    }

    async delete(req, res){
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty())
                throw new HttpException(errors.errors[0].msg, 400);
            const params = req.params;
            const userReq = req.user;
            const roleName = await RolesService.deleteRoleByName(params.name);
            if(!roleName)
                throw new HttpException('This role was not found.', 404);
            await LogsService.create({operation: `Delete < ${roleName} > role.`, createdBy: userReq.id});
            return res.json({roleName});
        } catch (error) {
            if(error instanceof HttpException)
                return res.status(error.statusCode).json({message: error.message});
            console.log(error);
            return res.status(500).json({message: 'Error deleting the role.'});
        }
    }

    async getAll(req, res){
        try {
            const userReq = req.user;
            const users = await RolesService.getAll();
            await LogsService.create({operation: 'Get all the roles', createdBy: userReq.id});
            return res.json(users);
        } catch (error) {
            if(error instanceof HttpException)
                return res.status(error.statusCode).json({message: error.message});
            console.log(error);
            return res.status(500).json({message: 'Error getting all the roles.'});
        }
    }
}

module.exports = new RolesController();