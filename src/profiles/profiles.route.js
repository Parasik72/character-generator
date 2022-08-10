const router = require('express');
const ProfilesController = require('./profiles.controller');
const isLoggedIn = require('../middlewares/is-logged-in.middleware');
const { check } = require('express-validator');

const ProfilesRouter = router();

ProfilesRouter.get('/', [
    isLoggedIn
], ProfilesController.getProfile);

ProfilesRouter.patch('/', [
    isLoggedIn,
    check('description', 'Description length: min is 0, max is 200.')
        .optional()
        .isString()
        .isLength({min: 0, max: 200})
], ProfilesController.changeProfile);

module.exports = ProfilesRouter;