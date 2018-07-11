const { URL } = require('url');
const responese = require('../common/responese');

// 用户控制器
class UerController {
  // 用户信息获取
  static async getUser(ctx) {
    await responese(ctx, {
      data: ctx.state.user
    });
  }

  // 用户授权接口
  static async setPermission(ctx) {
    const { permission } = ctx.request.body;
    if (!permission) {
      await responese(ctx, {
        code: 400
      });
      return;
    }
    const { email } = ctx.state.user;
    const User = ctx.models('user');
    try {
      const user = await User.setPermission(email, permission);
      ctx.state.user = user;
      await responese(ctx, {
        data: ctx.state.user
      });
    } catch (e) {
      await responese(ctx, {
        code: 500,
        message: e.message
      });
    }
  }

  // 用户退出登录
  static async logout(ctx) {
    const url = new URL(ctx.href);
    const backurl = url.searchParams.get('backurl') || '/';
    ctx.cookies.set('fess', null, { signed: true });
    ctx.status = 302;
    ctx.redirect(backurl);
  }
}

module.exports = UerController;
