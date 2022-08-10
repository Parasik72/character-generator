const router = require('express');
const AmmunitionController = require('./ammunition.controller');
const isLoggedIn = require('../middlewares/is-logged-in.middleware');
const Roles = require('../middlewares/roles.middleware');
const { RoleTypes } = require('../roles/roles.type');
const { check, body } = require('express-validator');

const AmmunitionRouter = router();

AmmunitionRouter.get('/all', [
    isLoggedIn
], AmmunitionController.getAll);

AmmunitionRouter.post('/', [
    isLoggedIn,
    Roles([RoleTypes.ADMIN]),
    check('name', 'Name length: min is 1, max is 20.')
        .isString()
        .isLength({min: 1, max: 20}),
    check('type', 'Type length: min is 1, max is 20.')
        .isString()
        .isLength({min: 1, max: 20})
], AmmunitionController.create);

AmmunitionRouter.post('/add', [
    isLoggedIn,
    check('name', 'Name length: min is 1, max is 20.')
        .isString()
        .isLength({min: 1, max: 20})
], AmmunitionController.addAmmunition);

AmmunitionRouter.post('/add-characteristics/:ammunitionId', [
    isLoggedIn,
    Roles([RoleTypes.ADMIN]),
    body().isArray(),
    body('*.name', 'Incorrect name')
        .isString()
        .isLength({min: 1, max: 20}),
    body('*.value', 'Incorrect value')
        .isNumeric()
], AmmunitionController.addCharacteristics);

AmmunitionRouter.post('/add-stats/:ammunitionId', [
    isLoggedIn,
    Roles([RoleTypes.ADMIN]),
    body().isArray(),
    body('*.name', 'Incorrect name')
        .isString()
        .isLength({min: 1, max: 20}),
    body('*.value', 'Incorrect value')
        .isNumeric()
], AmmunitionController.addStats);

AmmunitionRouter.post('/add-skills/:ammunitionId', [
    isLoggedIn,
    Roles([RoleTypes.ADMIN]),
    body().isArray(),
    body('*.name', 'Incorrect name')
        .isString()
        .isLength({min: 1, max: 20}),
], AmmunitionController.addSkills);

AmmunitionRouter.delete('/remove', [
    isLoggedIn,
    check('name', 'Name length: min is 1, max is 20.')
        .isString()
        .isLength({min: 1, max: 20})
], AmmunitionController.removeAmmunition);

AmmunitionRouter.delete('/remove-characteristics/:ammunitionId', [
    isLoggedIn,
    Roles([RoleTypes.ADMIN]),
    body().isArray(),
    body('*.name', 'Incorrect name')
        .isString()
        .isLength({min: 1, max: 20})
], AmmunitionController.removeCharacteristics);

AmmunitionRouter.delete('/remove-stats/:ammunitionId', [
    isLoggedIn,
    Roles([RoleTypes.ADMIN]),
    body().isArray(),
    body('*.name', 'Incorrect name')
        .isString()
        .isLength({min: 1, max: 20})
], AmmunitionController.removeStats);

AmmunitionRouter.delete('/remove-skills/:ammunitionId', [
    isLoggedIn,
    Roles([RoleTypes.ADMIN]),
    body().isArray(),
    body('*.name', 'Incorrect name')
        .isString()
        .isLength({min: 1, max: 20})
], AmmunitionController.removeSkills);

AmmunitionRouter.patch('/:ammunitionId', [
    isLoggedIn,
    Roles([RoleTypes.ADMIN]),
    check('name', 'Name length: min is 1, max is 20.')
        .optional()
        .isString()
        .isLength({min: 1, max: 20}),
    check('type', 'Type length: min is 1, max is 20.')
        .optional()
        .isString()
        .isLength({min: 1, max: 20})
], AmmunitionController.update);

AmmunitionRouter.delete('/:ammunitionId', [
    isLoggedIn,
    Roles([RoleTypes.ADMIN]),
], AmmunitionController.delete);

module.exports = AmmunitionRouter;