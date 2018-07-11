const Koa = require('koa');
const path = require('path');
const favicon = require('koa-favicon');
const Views = require('koa-views');
const staticCache = require('koa-static-cache');
const Logger = require('koa-logger');
const Bodyparser = require('koa-bodyparser');
const Router = require('koa-router');

const { debug, debugUser, keys } = require('./config');
const models = require('./models');

const apiRouter = require('./routers/api');
const pageRouter = require('./routers/page');

const app = new Koa();
const router = new Router();

app.keys = keys;

app.use(favicon(path.join(__dirname, '../static/common/img/favicon.ico')));

app.use(Logger());

app.use(staticCache({
  prefix: '',
  gzip: true,
  dynamic: true,
  maxAge: 60 * 60 * 24 * 30
}));

app.use(Bodyparser());

app.use(Views(path.join(__dirname, '../views'), {
  map: { html: 'ejs', pug: 'pug' }
})); // 模板配置

app.use(async (ctx, next) => {
  if (ctx.url.indexOf('/api') === 0) {
    ctx.state.api = true;
  }
  if (!ctx.models) {
    // 挂载模型
    ctx.models = models;
  }
  await next();
}); // 环境预处理

app.use(async (ctx, next) => {
  if (debug && ctx.cookies.get('debugmode', { signed: false }) === 'debugmode') {
    console.log(`【debugmode】当前启用debug模式`);
    ctx.state.user = debugUser;
  } else {
    const email = ctx.cookies.get('fess', { signed: true });
    console.log(`【cookie】${email}`);
    if (email) {
      const User = ctx.models('user');
      const user = await User.getUser(email);
      if (user) {
        ctx.state.user = user;
      }
    }
  }

  await next();
}); // 用户预处理

// 路由配置
router.use('', pageRouter.routes(), pageRouter.allowedMethods());
router.use('/api', apiRouter.routes(), apiRouter.allowedMethods());

app.use(router.routes());
app.use(router.allowedMethods());

app.use(async (ctx) => {
  ctx.status = 404;
  await ctx.render('error/404');
}); // 错误页

app.on('error', (err, ctx) => {
  console.error(err);
});

module.exports = app;
