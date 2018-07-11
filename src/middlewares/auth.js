/**
 * @file 认证中间件
 * @author mengchen <mengchen@corp.netease.com>
 * @module controller/auth
 */
const { URL } = require('url');
const https = require('https');
const responese = require('../common/responese');

const maxAge = 60 * 60 * 60 * 1000;

const startLogin = function(ctx) {
  return new Promise((resolve, reject) => {
    const { ticket } = ctx.query;
    if (ticket) {
      console.log('【登录执行接口】换取ticket');
      const opsreq = https.request(`https://opsso.easecreate.com/ticket?ticket=${ticket}`, (opsres) => {
        const { statusCode } = opsres;
        let error;
        if (statusCode !== 200) {
          error = new Error('请求失败。\n' + `状态码: ${statusCode}`);
        }
        if (error) {
          console.error(error.message);
          // 消耗响应数据以释放内存
          opsres.resume();
          reject();
          return;
        }
        opsres.setEncoding('utf8');
        let rawData = '';
        opsres.on('data', (chunk) => {
          rawData += chunk;
        });
        opsres.on('end', () => {
          try {
            const userinfo = JSON.parse(rawData);
            console.log(`【登录执行接口】换取ticket成功${userinfo.pticket}`, '用户名：', userinfo.email);
            resolve(userinfo);
          } catch (e) {
            console.error('【登录执行接口】换取ticket异常,', e.message);
            reject(e);
          }
        });
      });
      opsreq.on('error', (e) => {
        console.log('【登录执行接口】换取ticket异常', e);
        reject(e);
      });
      opsreq.end();
    } else {
      console.log('【登录执行接口】未带ticket参数');
      reject(new Error('请求失败。'));
    }
  });
};

// 登录控制中间件
const login = async function(ctx, next) {
  if (!ctx.state.user) {
    console.log(`【登录控制中间件】未登录用户`);
    if (ctx.state.api) {
      // 如果是api接口
      await responese(ctx, { code: 0, message: '您未登录' }, 401);
      return;
    }
    const redirectTo = new URL(ctx.href);
    redirectTo.searchParams.delete('ticket');
    try {
      const userinfo = await startLogin(ctx);
      console.log(userinfo);
      try {
        // 插入用户表
        const User = ctx.models('user');
        const user = await User.getUser(userinfo.email);
        if (!user) {
          const newUser = new User(userinfo);
          await newUser.save();
        }
        console.log(`【登录控制中间件】写cookie`);
        ctx.cookies.set('fess', userinfo.email, {
          path: '/',
          maxAge: maxAge,
          signed: true,
          httpOnly: true
        });
        ctx.cookies.set('feinfo', userinfo.email, {
          path: '/',
          maxAge: maxAge,
          signed: false,
          httpOnly: false
        });
        ctx.status = 302;
        ctx.redirect(redirectTo);
      } catch (e) {
        console.log(`【登录控制中间件】用户插入异常`, e.message);
        ctx.status = 302;
        ctx.redirect(`https://opsso.easecreate.com/login?return_to=${encodeURIComponent(redirectTo)}`);
      }
    } catch (e) {
      ctx.status = 302;
      ctx.redirect(`https://opsso.easecreate.com/login?return_to=${encodeURIComponent(redirectTo)}`);
    }
  } else {
    console.log(`【登录控制中间件】用户名${ctx.state.user.email}`);
    await next();
  }
};

// 操作权限控制中间件（务必在userLogin之后调用）
const permission = function(permission = 1) {
  return async function(ctx, next) {
    console.log(`【权限控制中间件】用户权限${ctx.state.user.permission},接口权限${permission}`);
    if (ctx.state.user && ctx.state.user.permission < permission) {
      await responese(
        ctx,
        {
          code: ctx.state.user.permission,
          message: '权限不足',
          view: '404'
        },
        401
      );
      return;
    }
    await next();
  };
};

module.exports = {
  login: login,
  permission: permission
};
