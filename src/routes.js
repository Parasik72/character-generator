const router = require('express');
const ActivationLinksRouter = require('./activation-links/activation-links.route');
const AmmunitionRouter = require('./ammunition/ammunition.route');
const AuthRouter = require('./auth/auth.route');
const CharacteristicsTypeRouter = require('./characteristics-type/characteristics-type.route');
const CharacteristicsRouter = require('./characteristics/characteristics.route');
const ProfilesRouter = require('./profiles/profiles.route');
const RolesRouter = require('./roles/roles.route');
const SkillsRouter = require('./skills/skills.route');
const UsersRouter = require('./users/users.route');
const StatsRouter = require('./stats/stats.route');
const AmmunitionTypeRouter = require('./ammunition-type/ammunition-type.route');
const LogsRouter = require('./logs/logs.route');

const Router = router();

Router.use('/auth', AuthRouter);
Router.use('/users', UsersRouter);
Router.use('/roles', RolesRouter);
Router.use('/profiles', ProfilesRouter);
Router.use('/skills', SkillsRouter);
Router.use('/characteristics', CharacteristicsRouter);
Router.use('/stats', StatsRouter);
Router.use('/characteristics-type', CharacteristicsTypeRouter);
Router.use('/ammunition-type', AmmunitionTypeRouter);
Router.use('/ammunition', AmmunitionRouter);
Router.use('/activation-links', ActivationLinksRouter);
Router.use('/logs', LogsRouter);
Router.use((req, res) => {
    return res.status(404).json({message: 'This endpoint was not found!'});
});

module.exports = Router;