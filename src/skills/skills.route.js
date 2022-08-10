const router = require('express');
const SkillsController = require('./skills.controller');
const { check, body } = require('express-validator');
const isLoggedIn = require('../middlewares/is-logged-in.middleware');
const Roles = require('../middlewares/roles.middleware');
const { RoleTypes } = require('../roles/roles.type');

const SkillsRouter = router();

SkillsRouter.get('/', [
    isLoggedIn
], SkillsController.getAll);

SkillsRouter.post('/', [
    isLoggedIn,
    Roles([RoleTypes.ADMIN]),
    check('name', 'Incorrect name')
        .isString()
        .isLength({min: 1, max: 20})
], SkillsController.create);

SkillsRouter.post('/add', [
    isLoggedIn,
    check('name', 'Incorrect name')
        .isString()
        .isLength({min: 1, max: 20})
], SkillsController.addSkill);

SkillsRouter.post('/add-characteristics/:skillId', [
    isLoggedIn,
    Roles([RoleTypes.ADMIN]),
    body().isArray(),
    body('*.name', 'Incorrect name')
        .isString()
        .isLength({min: 1, max: 20}),
    body('*.value', 'Incorrect value')
        .isNumeric()
], SkillsController.addCharacteristics);

SkillsRouter.post('/add-stats/:skillId', [
    isLoggedIn,
    Roles([RoleTypes.ADMIN]),
    body().isArray(),
    body('*.name', 'Incorrect name')
        .isString()
        .isLength({min: 1, max: 20}),
    body('*.value', 'Incorrect value')
        .isNumeric()
], SkillsController.addStats);

SkillsRouter.patch('/:skillId', [
    isLoggedIn,
    Roles([RoleTypes.ADMIN]),
    check('name', 'Incorrect name')
        .isString()
        .isLength({min: 1, max: 20})
], SkillsController.update);

SkillsRouter.delete('/remove', [
    isLoggedIn,
    check('name', 'Incorrect name')
        .isString()
        .isLength({min: 1, max: 20})
], SkillsController.removeSkill);

SkillsRouter.delete('/:skillId', [
    isLoggedIn,
    Roles([RoleTypes.ADMIN])
], SkillsController.delete);

SkillsRouter.delete('/remove-characteristics/:skillId', [
    isLoggedIn,
    Roles([RoleTypes.ADMIN]),
    body().isArray(),
    body('*.name', 'Incorrect name')
        .isString()
        .isLength({min: 1, max: 20})
], SkillsController.removeCharacteristics);

SkillsRouter.delete('/remove-stats/:skillId', [
    isLoggedIn,
    Roles([RoleTypes.ADMIN]),
    body().isArray(),
    body('*.name', 'Incorrect name')
        .isString()
        .isLength({min: 1, max: 20})
], SkillsController.removeStats);

module.exports = SkillsRouter;