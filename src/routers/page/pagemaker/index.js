const Router = require('koa-router');
const router = new Router();

const { login } = require('../../../middlewares/auth');

router.get(['/', '/*'], login, async (ctx, next) => {
  try {
    await ctx.render('open/pagemaker/index');
  } catch (e) {
    await next();
  }
});

module.exports = router;
