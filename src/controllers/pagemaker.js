const crypto = require('crypto');
const secret = 'feserver';
const pagemaker = require('../common/pagemaker.js');
const responese = require('../common/responese');
const FTPAgent = require('../common/ftp');

const productcodeSha = '7bc07ecc55c2039dfa45f10bed59910d00e989c07938f669f9c17c34f9eb62c0'; // 平台密码：lmlc

// const passwordSha = 'ae50c9f690a059d4a2bce689bd3a5a8ccfd078d3a3966aab9d2a883e6f0a10a9'; // 发布密码：123456

// 用户控制器
class PageMakerController {
  // 页面发布接口
  static async add(ctx) {
    let { productcode, html, config } = ctx.request.body;
    const { path, password } = ctx.request.body;
    const { email } = ctx.state.user;
    // console.log(path, productcode, password, html, config);
    if (!path || !productcode || !password || !html || !config) {
      await responese(ctx, {
        code: 400
      });
      return;
    }
    html = decodeURI(html);
    config = JSON.stringify(config);
    productcode = crypto
      .createHmac('sha256', secret)
      .update(productcode)
      .digest('hex');
    if (productcode !== productcodeSha) {
      await responese(ctx, {
        code: 403,
        message: '平台密码错误'
      });
      return;
    }
    let isUpate = 0;
    try {
      const Publish = ctx.models('publish');
      const item = await Publish.getTopByPath(path);
      if (item) {
        if (item.password && item.password !== password) {
          await responese(ctx, {
            code: 403,
            message: '发布密码错误'
          });
          return;
        }
        isUpate = 1;
      }
    } catch (e) {
      await responese(ctx, {
        code: 500,
        message: e.message
      });
      return;
    }
    try {
      const pmRet = await pagemaker.creat(path, html);
      if (pmRet !== true) {
        await responese(ctx, {
          code: 500,
          message: pmRet.message
        });
        return;
      }
      const Publish = ctx.models('publish');
      const publish = new Publish({
        email: email,
        path: path,
        file: config,
        password: password,
        is_update: isUpate
      });
      await publish.save();
      // 创建一个ftp代理 推送ftp
      const ftpAgent = new FTPAgent();
      const ret = await ftpAgent.pushDir(path);
      ret === true
        ? await responese(ctx, {
          data: {
            path: path,
            url: ftpAgent.getPageUrl(path),
            isUpate: isUpate
          }
        })
        : await responese(ctx, {
          code: 500,
          message: ret.message
        });
    } catch (e) {
      await responese(ctx, {
        code: 500,
        message: e.message
      });
    }
  }

  // 获取发布日志接口
  static async getRecords(ctx) {
    try {
      const Publish = ctx.models('publish');
      const items = await Publish.getAllPublish();
      await responese(ctx, {
        data: items
      });
    } catch (e) {
      await responese(ctx, {
        code: 500,
        message: e.message
      });
    }
  }

  // 获取最近发布配置接口
  static async getConfig(ctx) {
    const { path } = ctx.params;
    if (!path) {
      await responese(ctx, {
        code: 400
      });
      return;
    }
    const Publish = ctx.models('publish');
    try {
      const item = await Publish.getTopByPath(path);
      if (item) {
        await responese(ctx, {
          data: JSON.parse(item.file)
        });
        return;
      } else {
        await responese(ctx, {
          code: 404,
          message: '发布目录不存在'
        });
        return;
      }
    } catch (e) {
      await responese(ctx, {
        code: 500,
        message: e.message
      });
    }
  }

  // 检测目录可用性
  static async getRecord(ctx) {
    const { path } = ctx.params;
    console.log(path);
    if (!path) {
      responese(ctx, {
        code: 400
      });
      return;
    }
    const Publish = ctx.models('publish');
    try {
      const item = await Publish.getTopByPath(path);
      if (item) {
        responese(ctx, {
          code: 201,
          message: '发布目录已存在'
        });
        return;
      } else {
        responese(ctx, {
          message: '新的发布目录'
        });
        return;
      }
    } catch (e) {
      responese(ctx, {
        code: 500,
        message: e.message
      });
    }
  }
}

module.exports = PageMakerController;
