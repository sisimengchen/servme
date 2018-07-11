const Router = require('koa-router');

const common = require('./common');
const user = require('./user');
const pagemaker = require('./pagemaker');
const jwt = require('./jwt');

const router = new Router();

router.use('/v1/common', common.routes(), common.allowedMethods());

router.use('/v1/user', user.routes(), user.allowedMethods());

router.use('/v1/pagemaker', pagemaker.routes(), pagemaker.allowedMethods());

router.use('/v1/jwt', jwt.routes(), jwt.allowedMethods());

module.exports = router;
