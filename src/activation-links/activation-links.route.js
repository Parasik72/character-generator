const router = require('express');
const ActivationLinksController = require('./activation-links.controller');
const { check } = require('express-validator');

const ActivationLinksRouter = router();

ActivationLinksRouter.post('/phone/:userId/:link', [
    check('phoneNumber', 'Incorrect phone number')
        .matches(/^\+([0-9]){10,15}$/)
], ActivationLinksController.phoneVerification);

ActivationLinksRouter.post('/activationReg/:userId/:link', [
    check('phoneCode', 'Incorrect phone code')
        .isNumeric()
        .matches(/^([0-9]){4}$/)
], ActivationLinksController.activationReg);

ActivationLinksRouter.post('/activationLog/:userId', [
    check('phoneCode', 'Incorrect phone code')
        .isNumeric()
        .matches(/^([0-9]){4}$/)
], ActivationLinksController.activationLog);

module.exports = ActivationLinksRouter;