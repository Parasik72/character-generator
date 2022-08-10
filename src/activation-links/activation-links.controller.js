const UsersService = require("../users/users.service");
const { SelectStandardUser } = require("../users/user.select");
const ActivationLinksService = require("../activation-links/activation-links.service");
const HttpException = require('../exceptions/HttpException');
const { validationResult } = require('express-validator');
const TokensService = require("../tokens/tokens.service");
const CharacteristicsService = require("../characteristics/characteristics.service");
const twilio = require("../sms-transporter/sms-transporter");
const LogsService = require('../logs/logs.service');
const CharacteristicsTypeService = require("../characteristics-type/characteristics-type.service");

class ActivationLinksController {
    async phoneVerification(req, res){
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty())
                throw new HttpException(errors.errors[0].msg, 400);
            const dto = req.body;
            const params = req.params;
            let user = await UsersService.getOneById(params.userId, SelectStandardUser);
            if(!user)
                throw new HttpException('The user was not found.', 404);
            const activationLink = await ActivationLinksService.getOneByUserIdAndLink(params.userId, params.link);
            if(!activationLink || activationLink.isActivated)
                throw new HttpException('Incorrect data.', 400);
            user = await UsersService.updateUser({phoneNumber: dto.phoneNumber}, user);
            const phoneCode = ActivationLinksService.generatePhoneCode();
            await ActivationLinksService.updateActivationLink({phoneCode}, activationLink);
            const fromPhoneNumber = process.env.SMSAPI_PHONE || 'SMSAPI_PHONE';
            await twilio.messages.create({from: fromPhoneNumber, to: user.phoneNumber, body: `Your code: < ${phoneCode} >`});
            const link = ActivationLinksService.createActivationRegLinkUrl(activationLink.userId, activationLink.link);
            await LogsService.create({operation: 'Phone verification', createdBy: user.id});
            return res.json({link});
        } catch (error) {
            if(error instanceof HttpException)
                return res.status(error.statusCode).json({message: error.message});
            console.log(error);
            return res.status(500).json({message: 'Error verification the phone number.'});
        }
    }

    async activationReg(req, res){
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty())
                throw new HttpException(errors.errors[0].msg, 400);
            const dto = req.body;
            const params = req.params;
            const user = await UsersService.getOneById(params.userId, SelectStandardUser);
            if(!user)
                throw new HttpException('The user was not found.', 404);
            const activationLink = await ActivationLinksService.getOneByUserIdAndLink(params.userId, params.link);
            if(!activationLink || activationLink.isActivated)
                throw new HttpException('Incorrect data.', 400);
            if(activationLink.phoneCode != dto.phoneCode)
                throw new HttpException('Incorrect phone code.', 400);
            const allTypesArr = await CharacteristicsTypeService.getAll();
            await CharacteristicsService.addCharacteristicsForNewUser(user.id, allTypesArr);
            await ActivationLinksService.updateActivationLink({isActivated: true}, activationLink);
            const token = await TokensService.generateToken(user);
            if(!token)
                throw new HttpException('Error creating token.', 400);
            await TokensService.saveToken(user.id, token);
            await LogsService.create({operation: 'Activation account', createdBy: user.id});
            return res.json({ message: 'Your account has been activated successfully!', token });
        } catch (error) {
            if(error instanceof HttpException)
                return res.status(error.statusCode).json({message: error.message});
            console.log(error);
            return res.status(500).json({message: 'Error activation the user registration.'});
        }
    }

    async activationLog(req, res){
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty())
                throw new HttpException(errors.errors[0].msg, 400);
            const dto = req.body;
            const params = req.params;
            const user = await UsersService.getOneById(params.userId, SelectStandardUser);
            if(!user)
                throw new HttpException('The user was not found.', 404);
            const activationLink = await ActivationLinksService.getOneByUserId(user.id);
            if(!activationLink || !activationLink.isActivated)
                throw new HttpException('Incorrect data.', 400);
            if(activationLink.phoneCode != dto.phoneCode)
                throw new HttpException('Incorrect phone code.', 400);
            const phoneCode = ActivationLinksService.generatePhoneCode();
            await ActivationLinksService.updateActivationLink({phoneCode}, activationLink);
            const token = await TokensService.generateToken(user);
            if(!token)
                throw new HttpException('Error creating token.', 400);
            await TokensService.saveToken(user.id, token);
            await LogsService.create({operation: 'Activation login', createdBy: user.id});
            return res.json({ token });
        } catch (error) {
            if(error instanceof HttpException)
                return res.status(error.statusCode).json({message: error.message});
            console.log(error);
            return res.status(500).json({message: 'Error activation the user login.'});
        }
    }
}

module.exports = new ActivationLinksController();