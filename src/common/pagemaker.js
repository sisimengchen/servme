/**
 * @file 页面生成组件
 * @author mengchen <mengchen@corp.netease.com>
 * @module com/pagemaker
 */
const fse = require('fs-extra');
const path = require('path');
const { minify } = require('html-minifier');
const UglifyJS = require('uglify-js');
// const async = require('async');
const process = require('process');

module.exports = {
  /**
   * 页面创建接口
   * @param  {String}    dirname    - 待发布的路径名
   * @param  {String}    html       - 待发布的路径名
   * @param  {Function}  callback   - 回调函数
   */
  creat: async function(dirname, rawHtml) {
    if (!rawHtml || !dirname) {
      return false;
    }
    rawHtml = this.htmlMinifier(rawHtml);
    const result = this.urlParse(dirname, rawHtml);
    const { urlMap, html } = result;
    try {
      for (const key in urlMap) {
        if (Object.prototype.hasOwnProperty.call(urlMap, key)) {
          const item = urlMap[key];
          await fse.copySync(item.absoluteSrc, item.absoluteDest);
        }
      }
      const dest = path.resolve(path.resolve(process.cwd(), 'release'), dirname, 'index.html');
      await fse.outputFile(dest, html);
      return true;
    } catch (err) {
      // console.error(err);
      return err;
    }
  },
  /**
   * html压缩接口
   * @param  {String}    dirname    - 待发布的路径名
   * @return {String}    html       - 压缩后的html
   */
  htmlMinifier: function(html) {
    if (!html) {
      return;
    }
    return minify(html, {
      collapseWhitespace: true,
      minifyJS: true,
      minifyCSS: true
    });
  },
  /**
   * url解析接口
   * @param  {String}    dirname   - 待发布的路径名
   * @param {String}     html      - 待解析的html
   * @return {Object}    html      - 解析结果
   */
  urlParse: function(dirname, html) {
    if (!html || !dirname) {
      return;
    }
    const keyword = 'pagemaker';
    const reg = new RegExp(`['"\\(]\\s*([\\w\\_\\/\\.\\-]+\\#${keyword})\\s*['"\\)]`, 'gi');
    const publishDir = path.join(path.resolve(process.cwd(), 'release'), dirname);
    const urlMap = {};
    (html.match(reg) || []).forEach((relative, index) => {
      reg.lastIndex = 0;
      const result = reg.exec(relative);
      const relativeStr = result[1]; // 预览路径 /tmp/uploads/xxxxx/png/xxxx.png#pagemaker
      const relativeSrc = relativeStr.replace(/\#[^\#]+$/, ''); // 预览路径（去掉标示） /tmp/uploads/xxxxx/png/xxxx.png
      const absoluteSrc = path.join(process.cwd(), relativeSrc); // 绝对路径  /****/***/feserver/tmp/uploads/xxxxx/png/xxxx.png
      const extname = path.extname(absoluteSrc); // 扩展名
      const basename = path.basename(absoluteSrc); // 文件名
      // let absoluteDest; // 生成拷贝目标绝对路径
      // let relativeDest; // 生成拷贝目标相对于发布目录的路径
      let type = 'asset';
      if (extname === '.js') {
        type = 'js';
      } else if (extname === '.css') {
        type = 'css';
      }
      const absoluteDest = path.join(publishDir, type, basename); // 生成拷贝目标绝对路径
      const relativeDest = path.relative(publishDir, absoluteDest); // 生成拷贝目标相对于发布目录的路径
      urlMap[relativeStr] = {
        absoluteSrc: absoluteSrc,
        absoluteDest: absoluteDest,
        relativeDest: relativeDest,
        type: type
      };
    });
    return {
      urlMap: urlMap,
      html: html.replace(reg, (str, key) => str.replace(key, urlMap[key].relativeDest))
    };
  },
  /**
   * js压缩合并接口
   * @param  {Object[]}   jsList   - js路径列表
   * @return {String}              - 压缩合并后的js字符
   */
  jsUglify: function(jsList) {
    if (!jsList || !jsList.length) {
      return;
    }
    const flieIn = [];
    const options = { toplevel: true };
    jsList.forEach((item, index) => {
      flieIn.push(fse.readFileSync(item.absoluteSrc, 'utf8'));
    });
    return UglifyJS.minify(flieIn, options).code;
  }
};
