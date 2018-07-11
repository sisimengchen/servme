const Router = require('koa-router');
const router = new Router();

const upload = require('../../../common/upload');
const { login } = require('../../../middlewares/auth');
const CommonController = require('../../../controllers/common');

router.post('/upload', login, upload.any(), CommonController.upload); // 文件上传

router.post('/download', login, CommonController.download); // 通用json下载

module.exports = router;
