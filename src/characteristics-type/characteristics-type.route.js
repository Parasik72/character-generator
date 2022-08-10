const router = require('express');
const CharacteristicsTypeController = require('./characteristics-type.controller');
const isLoggedIn = require('../middlewares/is-logged-in.middleware');
const Roles = require('../middlewares/roles.middleware');
const { RoleTypes } = require('../roles/roles.type');
const { check, body } = require('express-validator');

const CharacteristicsTypeRouter = router();

CharacteristicsTypeRouter.get('/', [
    isLoggedIn,
    Roles([RoleTypes.ADMIN])
], CharacteristicsTypeController.getAll);

CharacteristicsTypeRouter.post('/', [
    isLoggedIn,
    Roles([RoleTypes.ADMIN]),
    check('name', 'Incorrect name')
        .isString()
        .isLength({min: 1, max: 20})
], CharacteristicsTypeController.create);

CharacteristicsTypeRouter.post('/add-stats/:characteristicTypeId', [
    isLoggedIn,
    Roles([RoleTypes.ADMIN]),
    body().isArray(),
    body('*.name', 'Incorrect name')
        .isString()
        .isLength({min: 1, max: 20}),
    body('*.eachDivider', 'Incorrect each divider')
        .isNumeric(),
    body('*.eachUp', 'Incorrect each up')
        .isNumeric()
], CharacteristicsTypeController.addStats);

CharacteristicsTypeRouter.patch('/:characteristicTypeId', [
    isLoggedIn,
    Roles([RoleTypes.ADMIN]),
    check('name', 'Incorrect name')
        .isString()
        .isLength({min: 1, max: 20})
], CharacteristicsTypeController.update);

CharacteristicsTypeRouter.delete('/:characteristicTypeId', [
    isLoggedIn,
    Roles([RoleTypes.ADMIN])
], CharacteristicsTypeController.delete);

CharacteristicsTypeRouter.delete('/remove-stats/:characteristicTypeId', [
    isLoggedIn,
    Roles([RoleTypes.ADMIN]),
    body().isArray(),
    body('*.name', 'Incorrect name')
        .isString()
        .isLength({min: 1, max: 20})
], CharacteristicsTypeController.removeStats);

module.exports = CharacteristicsTypeRouter;