const router = require('express');
const UsersController = require('./users.controller');
const isLoggedIn = require('../middlewares/is-logged-in.middleware');
const Roles = require('../middlewares/roles.middleware');
const { RoleTypes } = require('../roles/roles.type');

const UsersRouter = router();

UsersRouter.get('/', [
    isLoggedIn,
    Roles([RoleTypes.ADMIN])
], UsersController.getAll);

module.exports = UsersRouter;