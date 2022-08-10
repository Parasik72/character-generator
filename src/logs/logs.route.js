const router = require('express');
const LogsController = require('./logs.controller');
const isLoggedIn = require('../middlewares/is-logged-in.middleware');
const Roles = require('../middlewares/roles.middleware');
const { RoleTypes } = require('../roles/roles.type');

const LogsRouter = router();

LogsRouter.get('/', [
    isLoggedIn,
    Roles([RoleTypes.ADMIN])
], LogsController.getAll);

module.exports = LogsRouter;