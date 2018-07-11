const Router = require('koa-router');
const router = new Router();

const { login, permission } = require('../../../middlewares/auth');
const UerCtrl = require('../../../controllers/user');

router.get('/', login, UerCtrl.getUser); // 用户信息

router.get('/logout', UerCtrl.logout); // 登录退出

router.put('/auth', login, permission(100), UerCtrl.setPermission); // 用户授权

module.exports = router;
