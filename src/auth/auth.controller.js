const HttpException = require('../exceptions/HttpException');
const UsersService = require('../users/users.service');
const MailTransporterService = require('../mail-transporter/mail-transporter.service');
const bcrypt = require('bcryptjs');
const ActivationLinksService = require('../activation-links/activation-links.service');
const TokensService = require('../tokens/tokens.service');
const { validationResult } = require('express-validator');
const twilio = require('../sms-transporter/sms-transporter');
const LogsService = require('../logs/logs.service');

class AuthController {
    async register(req, res){
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty())
                throw new HttpException(errors.errors[0].msg, 400);
            const dto = req.body;
            const user = await UsersService.getOneByEmail(dto.email);
            if(user)
                throw new HttpException('This email is already in use.', 400);
            const hashPassword = await bcrypt.hash(dto.password, 5);
            const id = await UsersService.generateUserId();
            const newUser = await UsersService.createUser({id, password: hashPassword, email: dto.email });
            if (!newUser)
                throw new HttpException('Error creating user.', 400);
            const link = await ActivationLinksService.generateLink();
            const linkURL = ActivationLinksService.createPhoneVerificationLinkUrl(newUser.id, link);
            await ActivationLinksService.createActiovationLink({link, userId: newUser.id});
            await MailTransporterService.sendEmail(newUser.email, 'Activation link', `Your activation link: < ${linkURL} >`);
            await LogsService.create({operation: 'Registration', createdBy: newUser.id});
            return res.status(201).json({ message: 'To complete your registration you have to move on the link in your email.' });
        } catch (error) {
            if(error instanceof HttpException)
                return res.status(error.statusCode).json({message: error.message});
            console.log(error);
            return res.status(500).json({message: 'Error registration.'});
        }
    }

    async login(req, res){
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty())
                throw new HttpException(errors.errors[0].msg, 400);
            const dto = req.body;
            const user = await UsersService.getOneByEmail(dto.email);
            if(!user)
                throw new HttpException('The user was not found.', 404);
            const activationLink = await ActivationLinksService.getOneByUserId(user.id);
            if(!activationLink || !activationLink.isActivated)
                throw new HttpException('Incorrect data.', 400);
            const comparePasswords = await bcrypt.compare(dto.password, user.password);
            if(!comparePasswords)
                throw new HttpException('Incorrect data.', 400);
            const phoneCode = ActivationLinksService.generatePhoneCode();
            await ActivationLinksService.updateActivationLink({phoneCode}, activationLink);
            const fromPhoneNumber = process.env.SMSAPI_PHONE || 'SMSAPI_PHONE';
            await twilio.messages.create({from: fromPhoneNumber, to: user.phoneNumber, body: `Your code: < ${phoneCode} >`});
            const link = ActivationLinksService.createActivationLogLinkUrl(activationLink.userId, activationLink.link);
            await LogsService.create({operation: 'Login', createdBy: user.id});
            return res.json({ link });
        } catch (error) {
            if(error instanceof HttpException)
                return res.status(error.statusCode).json({message: error.message});
            console.log(error);
            return res.status(500).json({message: 'Error login.'});
        }
    }

    async logout(req, res){
        try {
            const userReq = req.user;
            const token = await TokensService.getOneByUserId(userReq.id);
            if(!token)
                throw new HttpException('The token was not found.', 404);
            await TokensService.disactivateToken(token);
            await LogsService.create({operation: 'Logout', createdBy: userReq.id});
            return res.json({ message: 'Logout has been executed successfully.' });
        } catch (error) {
            if(error instanceof HttpException)
                return res.status(error.statusCode).json({message: error.message});
            console.log(error);
            return res.status(500).json({message: 'Error logout.'});
        }
    }
}

module.exports = new AuthController();