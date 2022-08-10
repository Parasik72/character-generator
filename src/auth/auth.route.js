const router = require('express');
const AuthController = require('./auth.controller');
const { check } = require('express-validator');
const isLoggedIn = require('../middlewares/is-logged-in.middleware');

const AuthRouter = router();

AuthRouter.post('/registration', [
    check('email', 'Incorrect email')
        .isString()
        .isEmail(),
    check('password', 'The password can contain: 5 min and 30 max characters.')
        .isString()
        .isLength({min: 5, max: 30})
], AuthController.register);

AuthRouter.post('/login', [
    check('email', 'Incorrect email')
        .isString()
        .isEmail(),
    check('password', 'The password can contain: 5 min and 30 max characters.')
        .isString()
        .isLength({min: 5, max: 30})
], AuthController.login);

AuthRouter.get('/logout', [
    isLoggedIn
], AuthController.logout);

module.exports = AuthRouter;