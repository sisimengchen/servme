const Router = require('koa-router');
const router = new Router();

const JwtCtrl = require('../../../controllers/jwt');

router.post('/generate', JwtCtrl.generate); // generate jwt

router.get('/verify', JwtCtrl.verify); // verify jwt

module.exports = router;
