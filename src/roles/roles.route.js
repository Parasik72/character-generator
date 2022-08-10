const router = require('express');
const RolesController = require('./roles.controller');
const isLoggedIn = require('../middlewares/is-logged-in.middleware');
const { check } = require('express-validator');
const Roles = require('../middlewares/roles.middleware');
const { RoleTypes } = require('./roles.type');

const RolesRouter = router();

RolesRouter.post('/create', [
    isLoggedIn,
    Roles([RoleTypes.ADMIN]),
    check('name', 'Incorrect name').isString().isLength({min: 2, max: 20})
], RolesController.create);

RolesRouter.get('/all', [
    isLoggedIn,
    Roles([RoleTypes.ADMIN])
], RolesController.getAll);

RolesRouter.delete('/delete/:name', [
    isLoggedIn,
    Roles([RoleTypes.ADMIN]),
    check('name', 'Incorrect name').isString().isLength({min: 2, max: 20})
], RolesController.delete);

module.exports = RolesRouter;