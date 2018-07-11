const Router = require('koa-router');
const router = new Router();

const { login, permission } = require('../../../middlewares/auth');
const PMCtrl = require('../../../controllers/pagemaker');

router.post('/page', login, permission(2), PMCtrl.add); // 页面发布

router.get('/record/:path', login, permission(2), PMCtrl.getRecord); // 发布路径检测

router.get('/config/:path', login, permission(2), PMCtrl.getConfig); // 配置获取

router.get('/records', login, permission(2), PMCtrl.getRecords); // 发布记录获取

module.exports = router;
