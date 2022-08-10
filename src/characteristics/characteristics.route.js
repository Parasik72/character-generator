const router = require('express');
const CharacteristicsController = require('./characteristics.controller');
const { body } = require('express-validator');
const isLoggedIn = require('../middlewares/is-logged-in.middleware');

const CharacteristicsRouter = router();

CharacteristicsRouter.patch('/', [
    isLoggedIn,
    body().isArray(),
    body('*.name', 'Incorrect name')
        .isString()
        .isLength({min: 1, max: 20}),
    body('*.value', 'Incorrect value')
        .isNumeric()
], CharacteristicsController.update);

module.exports = CharacteristicsRouter;