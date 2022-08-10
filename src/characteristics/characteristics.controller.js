const HttpException = require('../exceptions/HttpException');
const { validationResult } = require('express-validator');
const CharacteristicsService = require('./characteristics.service');
const { SelectCharacteristics } = require('./characteristics.select');
const LogsService = require('../logs/logs.service');

class CharacteristicsController {
    async update(req, res){
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty())
                throw new HttpException(errors.errors[0].msg, 400);
            const userReq = req.user;
            const dto = req.body;
            let characteristics = await CharacteristicsService.getByUserId(userReq.id, SelectCharacteristics);
            characteristics = await CharacteristicsService.updateCharacteristic(characteristics, dto);
            await LogsService.create({operation: `Update the user characteristics.`, createdBy: userReq.id});
            return res.json(characteristics);
        } catch (error) {
            if(error instanceof HttpException)
                return res.status(error.statusCode).json({message: error.message});
            console.log(error);
            return res.status(500).json({message: 'Error updating the user characteristics.'});
        }
    }
}

module.exports = new CharacteristicsController();