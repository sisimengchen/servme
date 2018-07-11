/**
 * Copyright (c) 2018-present, mengchen, Inc.
 *
 * 中国银行外汇爬虫（第一版先支持美元）
 *
 */

const http = require('http');
const { minify } = require('html-minifier');

const dateFormat = function(date, style) {
  const o = {
    'M+': date.getMonth() + 1, // month
    'd+': date.getDate(), // day
    'h+': date.getHours(), // hour
    'm+': date.getMinutes(), // minute
    's+': date.getSeconds(), // second
    'w+': '天一二三四五六'.charAt(date.getDay()), // week
    'q+': Math.floor((date.getMonth() + 3) / 3), // quarter
    'S': date.getMilliseconds() // millisecond
  };
  if (/(y+)/.test(style)) {
    style = style.replace(RegExp.$1, `${date.getFullYear()}`.substr(4 - RegExp.$1.length));
  }
  for (const k in o) {
    if (new RegExp(`(${k})`).test(style)) {
      style = style.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : `00${o[k]}`.substr(`${o[k]}`.length));
    }
  }
  return style;
};

const serialize = function(obj, prefix) {
  const str = [];
  let p;
  for (p in obj) {
    if (obj.hasOwnProperty(p)) {
      let k = prefix ? `${prefix}[${p}]` : p,
        v = obj[p];
      str.push(v !== null && typeof v === 'object' ? serialize(v, k) : `${k}=${v}`);
    }
  }
  return str.join('&');
};

const NAME_CODE_MAP = {
  GBP: 1314, // 英镑
  HKD: 1315, // 港币
  USD: 1316, // 美元
  CHF: 1317, // 瑞士法郎
  DEM: 1318, // 德国马克
  FRF: 1319, // 法国法郎
  SGD: 1375, // 新加坡元
  SEK: 1320, // 瑞典克朗
  DKK: 1321, // 丹麦克朗
  NOK: 1322, // 挪威克朗
  JPY: 1323, // 日元
  CAD: 1324, // 加拿大元
  AUD: 1325, // 澳大利亚元
  EUR: 1326, // 欧元
  MOP: 1327, // 澳门元
  PHP: 1328, // 菲律宾比索
  THB: 1329, // 泰国铢
  NZD: 1330, // 新西兰元
  KRW: 1331, // 韩元
  RUB: 1843, // 卢布
  MYR: 2890, // 林吉特
  TWD: 2895, // 新台币
  ESP: 1370, // 西班牙比塞塔
  ITL: 1371, // 意大利里拉
  ANG: 1372, // 荷兰盾
  BEF: 1373, // 比利时法郎
  FIM: 1374, // 芬兰马克
  IDR: 3030, // 印尼卢比
  BRL: 3253, // 巴西里亚尔
  AED: 3899, // 阿联酋迪拉姆
  INR: 3900, // 印度卢比
  ZAR: 3901, // 南非兰特
  SAR: 4418, // 沙特里亚尔
  TRY: 4560 // 土耳其里拉
};

class BOC {
  constructor(options = {}) {
    this.name = options.name || 'USD';
    this.erectDate = options.erectDate || dateFormat(new Date(), 'yyyy-MM-dd'); // 起始时间 建议大于等于 1995.01.04 00:00:00 之前数据为空
    this.nothing = options.nothing || dateFormat(new Date(), 'yyyy-MM-dd'); // 截止时间
    this.page = options.page || 1; // 起始页码
    this.pjname = NAME_CODE_MAP[this.name]; // 查询代码 1316为美元
  }

  request(options, body) {
    return new Promise((resolve, reject) => {
      const req = http.request(options, (res) => {
        const { statusCode } = res;
        let error;
        if (statusCode !== 200) {
          error = new Error('请求失败。\n' + `状态码: ${statusCode}`);
        }
        if (error) {
          console.error(error.message);
          // 消耗响应数据以释放内存
          res.resume();
          reject();
          return;
        }
        res.setEncoding('utf8');
        let rawData = '';
        res.on('data', (chunk) => {
          rawData += chunk;
        });
        res.on('end', () => {
          resolve(rawData);
        });
      });
      req.on('error', (e) => {
        reject(e);
      });
      req.write(body);
      req.end();
    });
  }

  // 'erectDate=2018-03-28&nothing=2018-03-28&pjname=1316'
  async grab(options = {}, data = {}) {
    options = Object.assign({}, this.getRequestOptions(), options);
    const body = this.getRequestBody(data);
    const rawData = await this.request(options, body);
    const parseData = this.parse(rawData);
    console.log(parseData);
    return parseData;
  }

  // 获取请求默认配置
  getRequestOptions() {
    return {
      hostname: 'srh.bankofchina.com',
      path: '/search/whpj/search.jsp',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };
  }

  // 获取请求默认body
  getRequestBody(data = {}) {
    Object.assign(this, data);
    return serialize({
      erectDate: this.erectDate,
      nothing: this.nothing,
      pjname: NAME_CODE_MAP[this.name],
      page: this.page
    });
  }

  // 返回值解析
  parse(html) {
    // 格式化一下方便解析
    html = minify(html, {
      collapseWhitespace: true,
      minifyJS: true,
      minifyCSS: true
    });
    // 抓取记录总数
    let recordCount = html.match(/m_nRecordCount=(.*?);/gi)[0];
    recordCount = parseInt(recordCount.replace(/\D/gi, ''), 10);
    let currPage = html.match(/m_nCurrPage=(.*?),/gi)[0];
    currPage = parseInt(currPage.replace(/\D/gi, ''), 10);
    let pageSize = html.match(/m_nPageSize=(.*?);/gi)[0];
    pageSize = parseInt(pageSize.replace(/\D/gi, ''), 10);
    // 抓取所有的带数据的tr标签
    html = html.match(/<tr>([^oh]*?)<\/tr>/gi);
    html = html.join('');
    // 抓取所有表格数据
    const datas = html.match(/<td>(.*?)<\/td>/gi);
    const jsons = [];
    let json = null;
    datas.forEach((item, index) => {
      const mod = index % 8;
      item = item.replace(/[<>td\/]/gi, '');
      switch (mod) {
        case 0:
          json = {};
          json.name = item;
          break;
        case 1:
          json.fBuyPri = item;
          break;
        case 2:
          json.mBuyPri = item;
          break;
        case 3:
          json.fSellPri = item;
          break;
        case 4:
          json.mSellPri = item;
          break;
        case 5:
          json.administrationConversionPri = item;
          break;
        case 6:
          json.bankConversionPri = item;
          break;
        case 7:
          json.datetime = item;
          json.timestamp = +new Date(item);
          jsons.push(json);
          break;
        default:
          break;
      }
    });
    return {
      recordCount: recordCount,
      pageSize: pageSize,
      currPage: currPage,
      list: jsons
    };
  }
}

// const tt = new BOC();
// tt.grab(null, {
//   name: 'USD'
//   // erectDate: '1993-01-01',
//   // page: 0
// });

module.exports = BOC;
