/**
 * @file 文件上传组件
 * @author mengchen <mengchen@corp.netease.com>
 * @module com/upload
 */

const path = require('path');
const originalMulter = require('multer');
const multer = require('koa-multer');
const process = require('process');
const fse = require('fs-extra');
module.exports = multer({
  storage: originalMulter.diskStorage({
    destination: function(req, file, cb) {
      // 生成上传目录
      const now = new Date();
      let month = now.getMonth() + 1;
      month = month > 9 ? `${month}` : `0${month}`;
      const time = now.getFullYear() + month;
      const extname = path.extname(file.originalname).replace(/^./, '');
      const dirPath = path.join(process.cwd(), 'tmp', 'upload', time, extname);
      fse.ensureDirSync(dirPath);
      cb(null, dirPath);
    },
    filename: function(req, file, cb) {
      // 生成随机的文件名
      const extname = path.extname(file.originalname);
      cb(
        null,
        Math.random()
          .toString(36)
          .slice(2) + extname
      );
    }
  })
});
