const path = require('path');
const process = require('process');
const fs = require('fs');
const fse = require('fs-extra');
const imagemin = require('imagemin');
// const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');
const responese = require('../common/responese');

// 通用控制器
class CommonController {
  // 上传
  static async upload(ctx) {
    ctx.req.files.forEach((item, index) => {
      item.url = path.join('/', path.relative(process.cwd(), item.path)); // 根路径url，主要给预览使用
      item.url = `${item.url}#pagemaker`; // 生成一个pagemakerurl作为发布标示
      item.index = parseInt(ctx.query.index || -1, 10);
      if (path.extname(item.originalname) === '.json') {
        const data = fs.readFileSync(item.path, 'utf8');
        item.data = JSON.parse(data);
      }
      if (item.mimetype.indexOf('image') > -1) {
        imagemin([item.path], item.destination, {
          plugins: [imageminPngquant({ quality: '65-80' })]
        });
      }
    });
    await responese(ctx, {
      data: {
        files: ctx.req.files
      }
    });
  }

  // 下载
  static async download(ctx) {
    const now = new Date();
    let month = now.getMonth() + 1;
    month = month > 9 ? `${month}` : `0${month}`;
    const time = now.getFullYear() + month;
    const fileName = `${Math.random()
      .toString(36)
      .slice(2)}.json`;
    const dirPath = path.join(process.cwd(), 'tmp', 'download', time);
    const filepath = path.join(dirPath, fileName);
    const fileurl = path.join('/', path.relative(process.cwd(), filepath));
    const data = JSON.stringify(ctx.request.body);
    try {
      await fse.outputFile(filepath, data);
      await responese(ctx, {
        data: {
          url: fileurl
        }
      });
    } catch (e) {
      await responese(
        ctx,
        {
          code: 500,
          message: e.message
        },
        500
      );
    }
  }
}

module.exports = CommonController;
