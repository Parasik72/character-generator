const router = require('express');
const AmmunitionTypeController = require('./ammunition-type.controller');
const isLoggedIn = require('../middlewares/is-logged-in.middleware');
const Roles = require('../middlewares/roles.middleware');
const { RoleTypes } = require('../roles/roles.type');
const { check } = require('express-validator');

const AmmunitionTypeRouter = router();

AmmunitionTypeRouter.get('/', [
    isLoggedIn,
    Roles([RoleTypes.ADMIN])
], AmmunitionTypeController.getAll);

AmmunitionTypeRouter.post('/', [
    isLoggedIn,
    Roles([RoleTypes.ADMIN]),
    check('type', 'Incorrect type')
        .isString()
        .isLength({min: 1, max: 20})
], AmmunitionTypeController.create);

AmmunitionTypeRouter.patch('/:ammunitionTypeId', [
    isLoggedIn,
    Roles([RoleTypes.ADMIN]),
    check('type', 'Incorrect type')
        .isString()
        .isLength({min: 1, max: 20})
], AmmunitionTypeController.update);

AmmunitionTypeRouter.delete('/:ammunitionTypeId', [
    isLoggedIn,
    Roles([RoleTypes.ADMIN])
], AmmunitionTypeController.delete);

module.exports = AmmunitionTypeRouter;