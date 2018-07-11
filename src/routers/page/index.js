const Router = require('koa-router');

const common = require('./common');
const user = require('./user');
const pagemaker = require('./pagemaker');

const router = new Router();

router.use('/', common.routes(), common.allowedMethods());

router.use('/user', user.routes(), user.allowedMethods());

router.use('/pagemaker', pagemaker.routes(), pagemaker.allowedMethods());

module.exports = router;
