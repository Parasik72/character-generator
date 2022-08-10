const router = require('express');
const StatsController = require('./stats.controller');
const isLoggedIn = require('../middlewares/is-logged-in.middleware');
const Roles = require('../middlewares/roles.middleware');
const { RoleTypes } = require('../roles/roles.type');
const { check } = require('express-validator');

const StatsRouter = router();

StatsRouter.get('/', [
    isLoggedIn,
    Roles([RoleTypes.ADMIN])
], StatsController.getAll);

StatsRouter.post('/', [
    isLoggedIn,
    Roles([RoleTypes.ADMIN]),
    check('name', 'Incorrect name')
        .isString()
        .isLength({min: 1, max: 20})
], StatsController.create);

StatsRouter.patch('/:statId', [
    isLoggedIn,
    Roles([RoleTypes.ADMIN]),
    check('name', 'Incorrect name')
        .isString()
        .isLength({min: 1, max: 20})
], StatsController.update);

StatsRouter.delete('/:statId', [
    isLoggedIn,
    Roles([RoleTypes.ADMIN])
], StatsController.delete);

module.exports = StatsRouter;