const path = require('path');
const { version } = require('../package.json');

const env = process.env.NODE_ENV || 'development';
const config = {
  // 调试环境
  debug: true,
  // 调试态用信息
  debugUser: {
    _id: '5a9e464dbdbd6887d358fb62',
    name: 'debuguser',
    mob: '18888888888',
    email: 'debuguser@corp.netease.com',
    permission: 100,
    create_time: 1520322125418.0,
    __v: 0
  },
  // 服务名称
  servernname: 'servme',
  // 版本
  version: version,
  // cookie加密key
  keys: ['servme'],
  // 管理员账号
  admins: ['adminmc'],
  // 数据库配置
  mongodb: {
    user: '',
    pass: '',
    host: 'localhost',
    port: 27017,
    database: 'servme'
  },
  // redis配置 暂未使用
  redis: {},
  // 文件上传配置 暂未使用
  upload: {
    path: '',
    url: '',
    extnames: [],
    fileSize: 0
  },
  // 是否启用ftp推送
  useftp: false,
  // ftp配置
  ftp: {
    host: 'localhost',
    port: 21,
    user: 'mengchen',
    password: 'mengchen',
    secure: false,
    secureOptions: null,
    dirname: 'fe',
    publicPath: 'https://www.servme.com/servme'
  }
};

if (env === 'test') {
  Object.assign(config, {
    mongodb: {
      user: 'xx',
      pass: 'xx@xx',
      host: 'xxx.xxx.xxx.xx',
      port: 27017,
      database: 'xx'
    },
    useftp: true,
    ftp: {
      host: 'xxx.xxx.xxx.xx',
      port: 21,
      user: 'xx',
      password: 'xxxxxx',
      secure: false,
      secureOptions: {},
      dirname: 'xx',
      publicPath: 'https://www.xx.com/xx'
    }
  });
}

if (env === 'production') {
  Object.assign(config, {
    mongodb: {
      user: 'xx',
      pass: 'xx@xx',
      host: 'xxx.xxx.xxx.xx',
      port: 27017,
      database: 'xx'
    },
    useftp: true,
    ftp: {
      host: 'xxx.xxx.xxx.xx',
      port: 21,
      user: 'xx',
      password: 'xxxxxx',
      secure: false,
      secureOptions: {},
      dirname: 'xx',
      publicPath: 'https://www.xx.com/xx'
    }
  });
}

console.log('服务配置对象:', config);
module.exports = config;
