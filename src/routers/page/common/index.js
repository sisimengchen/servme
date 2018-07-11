const Router = require('koa-router');
const router = new Router();

router.get('', async (ctx, next) => {
  try {
    await ctx.render('index/index');
  } catch (e) {
    await next();
  }
}); // 站点首页

router.get('about', async (ctx, next) => {
  try {
    await ctx.render('about/index');
  } catch (e) {
    await next();
  }
}); // 关于

router.get('lmui', async (ctx, next) => {
  try {
    await ctx.render('lmui/index');
  } catch (e) {
    await next();
  }
}); // lmui

module.exports = router;
