const FTPClient = require('ftp');
const path = require('path');

const { useftp, ftp } = require('../config');
const dir = require('node-dir');

class FTPAgent {
  constructor(config) {
    this._config = Object.assign({}, ftp, config);
    this._publicPath = useftp ? this._config.publicPath || '/release/' : '/release/';
    this._ready = false;
    this._client = new FTPClient();
  }

  // 判断当前连接是否可用 如果不可用则建立连接
  ready() {
    if (this._ready) {
      return new Promise.resolve();
    } else {
      return new Promise((resolve, reject) => {
        this._client.on('ready', () => {
          console.log(`ftp连接成功:${this._config.host}`);
          resolve();
        });
        this._client.on('error', (err) => {
          console.log(`ftp连接失败:${err}`);
          reject(err);
        });
        this._client.on('end', () => {
          console.log(`ftp连接结束:${this._config.host}`);
          this._ready = false;
        });
        this._client.on('close', () => {
          console.log(`ftp连接关闭:${this._config.host}`);
          this._ready = false;
        });
        console.log(`ftp连接开始:${this._config.host}`);
        this._client.connect(this._config);
      });
    }
  }

  // 创建远程目录
  mkdir(dirname) {
    return new Promise((resolve, reject) => {
      // 生成ftp绝对路径
      dirname = path.join('/', this._config.dirname || '', dirname || '');
      // 创建目录
      console.log(`ftp创建远程目录:${dirname}`);
      this._client.mkdir(dirname, true, (e) => {
        // console.log(e);
        e ? reject(e) : resolve(dirname);
      });
    });
  }

  // 推送文件到对应ftp目录
  put(file) {
    return new Promise((resolve, reject) => {
      // 生成ftp绝对路径
      const destFile = path.join('/', this._config.dirname || '', path.relative('release', file));
      console.log(`ftp推送文件:${file} ${destFile}`);
      this._client.put(file, destFile, (e) => {
        e ? reject(e) : resolve(destFile);
      });
    });
  }

  getPageUrl(dirname) {
    return `${this._publicPath.replace(/\/*$/, '')}/${dirname}/index.html`;
  }

  // 推送生成的目录
  async pushDir(dirname) {
    if (!useftp) {
      return true;
    }
    let nReturn = false;
    try {
      // 准备连接
      await this.ready();
      // 创建远程目录
      await this.mkdir(dirname);
      await this.mkdir(`${dirname}/js`);
      await this.mkdir(`${dirname}/css`);
      await this.mkdir(`${dirname}/asset`);
      // 获取目录下所有文件路径
      const files = await dir.promiseFiles(path.resolve('release', dirname));
      // 推送文件
      for (let i = 0; i < files.length; i++) {
        await this.put(files[i]);
      }
      nReturn = true;
    } catch (e) {
      console.log('ftp推送目录异常', e);
      nReturn = e;
    }
    this._client.end();
    return nReturn;
  }
}

// const tt = new FTPAgent();
// console.log(tt.getPageUrl('lmlc'));
// tt.pushDir('lmlc');
// const ret = await ftpAgent.pushDir('lmlc');
// console.log(ftpAgent);
module.exports = FTPAgent;
