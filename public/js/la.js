(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("lmfe.la", [], factory);
	else if(typeof exports === 'object')
		exports["lmfe.la"] = factory();
	else
		root["La"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "./";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "lVK7");
/******/ })
/************************************************************************/
/******/ ({

/***/ "lVK7":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * 立马理财前端数据统计模块
 *
 * 仅立马理财data系统使用
 */
var Tools = {
    // 生成uuid
    uuid: function uuid() {
        try {
            var a = window.crypto.getRandomValues(new Uint32Array(1));
            return a[0] & 2147483647;
        } catch (b) {
            return Math.round(2147483647 * Math.random());
        }
    },
    // cookie
    cookie: {
        set: function set(key, value, options) {
            var expires;
            options.expires && (expires = new Date(), expires.setTime(expires.getTime() + options.expires));
            document.cookie = key + "=" + value + (options.domain ? "; domain=" + options.domain : "") + (options.path ? "; path=" + options.path : "") + (expires ? "; expires=" + expires.toGMTString() : "") + (options.secure ? "; secure" : "");
        },
        get: function get(key) {
            return (key = RegExp("(^| )" + key + "=([^;]*)(;|$)").exec(document.cookie)) ? key[2] : "";
        }
    },
    forEach: function forEach(arr, fn) {
        for (var i = 0; i < arr.length; i++) {
            fn(i, arr[i]);
        }
    },
    // 获取url里的参数
    getPara: function getPara(url, paraName) {
        if (!url && !paraName) {
            return "";
        }
        var search;
        if (url && !paraName) {
            search = location.search;
            paraName = url;
        } else {
            search = url;
        }
        var data = {};

        Tools.forEach(("" + search).match(/([^=&#\?]+)=[^&#]+/g) || [], function (i, para) {
            var d = para.split("="),
                val = d[1];
            if (data[d[0]] !== undefined) {
                data[d[0]] += "," + val;
            } else {
                data[d[0]] = val;
            }
        });
        return paraName !== true ? data[paraName] || "" : data;
    },
    // Json 转化成 pram
    serialize: function serialize(obj, prefix) {
        var str = [],
            p;
        for (p in obj) {
            if (obj.hasOwnProperty(p)) {
                var k = prefix ? prefix + "[" + p + "]" : p,
                    v = obj[p];
                str.push(v !== null && (typeof v === "undefined" ? "undefined" : _typeof(v)) === "object" ? Tools.serialize(v, k) : encodeURIComponent(k) + "=" + encodeURIComponent(v));
            }
        }
        return str.join("&");
    }
};
var Analytics = {
    baseurl: 'https://data.lmlc.com/encrypt/collect/w',
    domain: 'lmlc.com',
    init: function init(config) {
        if (config) {
            this.baseurl = config.baseurl ? config.baseurl : this.baseurl;
            this.domain = config.domain ? config.domain : this.domain;
            this.type = config.type ? config.type : 1;
            this.title = config.title ? config.title : document.title.length > 192 ? document.title.slice(0, 192) : document.title;
        }
        this.pageViewId = +new Date() + '.' + Math.round(2147483647 * Math.random());
        this.clientId = this.getClientId();
        this.seesionId = this.getSeesionId();
        this.channelId = this.getChannelId();
        this.activityId = this.getActivityId();
        this.channelId = this.channelId.length > 100 ? this.channelId.slice(0, 100) : this.channelId;
        this.userId = this.getUserId();
        this.mailtrackId = this.getMailtrackId();
        this.location = document.location.href;
        this.referrer = document.referrer.length > 992 ? document.referrer.slice(0, 992) : document.referrer;
        this.encodeing = document.charset;
        this.platform = navigator.platform || "";
        this.language = navigator.language || navigator.browserLanguage || navigator.systemLanguage || navigator.userLanguage || "";
        this.viewportSize = document.body.clientWidth + 'x' + document.body.clientHeight;
        this.screenResolution = (window.screen.width || 0) + "x" + (window.screen.height || 0);
        this.scrollHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
        this.screenColors = window.screen.colorDepth || 0 + '-bit';
        this.javaEnabled = navigator.javaEnabled() ? 1 : 0;
        this.flashVersion = this.getFlashInfo();
        var now = +new Date();
        if (window.performance) {
            this.navigationStart = performance.timing.navigationStart;
        } else {
            this.navigationStart = window.NRUM && window.NRUM.config && window.NRUM.config.clientStart || now;
        }
        this.loadtime = now - this.navigationStart > 0 ? now - this.navigationStart : 0;
        this.pageView();
    },
    // 获取浏览器id
    getClientId: function getClientId() {
        var cid = Tools.cookie.get('cid');
        if (!cid) {
            cid = Tools.uuid();
            Tools.cookie.set('cid', cid, {
                path: '/',
                domain: this.domain,
                expires: 2 * 365 * 24 * 60 * 60 * 1000 // 有效期两年
            });
        }
        return cid;
    },
    // 获取会话id
    getSeesionId: function getSeesionId() {
        var sid = Tools.cookie.get('sid');
        if (!sid) {
            var start = +new Date();
            sid = (this.clientId ? this.clientId : this.getClientId()) + '_' + start;
            Tools.cookie.set('sid', sid, {
                path: '/',
                domain: this.domain,
                expires: 10 * 60 * 1000 // 有效期10分钟
            });
        }
        return sid;
    },
    // 获取渠道id
    getChannelId: function getChannelId() {
        var cchid = Tools.cookie.get('ch'),
            uhid = Tools.getPara(document.location.href, 'ch') || Tools.getPara(document.location.href, 'from'),
            uhid = uhid.split(',')[0].split(/[^\w|-]/)[0];
        // 如果url上有 cookie里也有
        if (uhid) {
            if (!cchid || cchid != uhid) {
                Tools.cookie.set('ch', uhid, {
                    path: '/',
                    domain: this.domain,
                    expires: 24 * 60 * 60 * 1000 // 有效期一天
                });
            }
            return uhid;
        } else {
            return cchid;
        }
    },
    // 获取页面act活动参数id
    getActivityId: function getActivityId() {
        var cactid = Tools.cookie.get('act'),
            uactid = Tools.getPara(document.location.href, 'act'),
            uactid = uactid.split(',')[0];
        // 如果url上有 cookie里也有
        if (uactid) {
            if (!cactid || cactid != uactid) {
                Tools.cookie.set('act', uactid, {
                    path: '/',
                    domain: this.domain,
                    expires: 24 * 60 * 60 * 1000 // 有效期一天
                });
            }
            return uactid;
        } else {
            return cactid;
        }
    },
    // 获取mail_track
    getMailtrackId: function getMailtrackId() {
        var tid = Tools.cookie.get('mail_track');
        return tid;
    },
    getBaseParam: function getBaseParam() {
        var param = {
            sid: this.getSeesionId(),
            cid: this.getClientId(),
            ch: this.getChannelId(),
            act: this.getActivityId(),
            ac: this.getUserId(),
            re: this.screenResolution,
            pl: this.platform,
            tid: this.getMailtrackId()
        };
        return param;
    },
    // 发送页面pv .slice(0, 512), // referrer截取512个字符
    pageView: function pageView(isCut) {
        var sparam = this.getBaseParam(),
            eparam = {
            wt: this.type,
            tl: this.title,
            url: this.location,
            ref: isCut ? this.referrer.slice(0, 512) : this.referrer,
            lt: this.loadtime,
            be: this.navigationStart
        };
        sparam.pv = [];
        sparam.pv.push(eparam);
        var query = 'data=' + encodeURIComponent(JSON.stringify(sparam)),
            full = this.baseurl + '?' + query;
        // 如果大于2048 直接砍掉多余referrer
        if (!isCut && full.length > 2048) {
            this.pageView(true);
        } else {
            this.send(this.baseurl, query);
        }
    },
    // 发送用户行为统计
    event: function event(name, param, startTime, parentPv) {
        var sparam = this.getBaseParam(),
            eparam = {};
        sparam.ev = [];
        eparam.na = name;
        param ? eparam.ex = param : '';
        eparam.be = startTime ? startTime : +new Date();
        eparam.prv = parentPv ? parentPv : this.location;
        sparam.ev.push(eparam);
        this.send(this.baseurl, 'data=' + encodeURIComponent(JSON.stringify(sparam)));
    },
    // 发送ajax调用统计
    ajax: function ajax(url, requestTime, startTime, param, parentPv) {
        var sparam = this.getBaseParam(),
            aparam = {};
        sparam.aj = [];
        aparam.url = url;
        requestTime ? aparam.lt = requestTime : '';
        startTime ? aparam.be = startTime : '';
        param ? aparam.ex = param : '';
        aparam.prv = parentPv ? parentPv : this.location;
        sparam.aj.push(aparam);
        this.send(this.baseurl, 'data=' + encodeURIComponent(JSON.stringify(sparam)));
    },
    // 发送异常统计
    exception: function exception(name, param, startTime) {
        var sparam = this.getBaseParam(),
            eparam = {};
        sparam.exc = [];
        eparam.na = name;
        param ? eparam.ex = param : '';
        eparam.be = startTime ? startTime : +new Date();
        sparam.exc.push(eparam);
        this.send(this.baseurl, 'data=' + encodeURIComponent(JSON.stringify(sparam)));
    },
    // 获取账号id
    getUserId: function getUserId() {
        var pinfo = Tools.cookie.get('P_INFO_LMLC');
        if (!pinfo) {
            var pinfo = Tools.cookie.get('P_INFO') || Tools.cookie.get('P_OINFO');
            pinfo = pinfo.substr(0, pinfo.indexOf("|"));
        }
        return pinfo.replace(/^"+/g, '').replace(/"+$/g, '');
    },
    // 获取浏览器flash版本
    getFlashInfo: function getFlashInfo() {
        var a, b, c;
        if ((c = (c = window.navigator) ? c.plugins : null) && c.length) for (var d = 0; d < c.length && !b; d++) {
            var e = c[d];-1 < e.name.indexOf("Shockwave Flash") && (b = e.description);
        }
        if (!b) try {
            a = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7"), b = a.GetVariable("$version");
        } catch (g) {}
        if (!b) try {
            a = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6"), b = "WIN 6,0,21,0", a.AllowScriptAccess = "always", b = a.GetVariable("$version");
        } catch (g) {}
        if (!b) try {
            a = new ActiveXObject("ShockwaveFlash.ShockwaveFlash"), b = a.GetVariable("$version");
        } catch (g) {}
        b && (a = b.match(/[\d]+/g)) && 3 <= a.length && (b = a[0] + "." + a[1] + " r" + a[2]);
        return b || void 0;
    },
    // 使用图片发送统计请求
    sendByImage: function sendByImage(baseurl, query, callback) {
        function createImage(src) {
            var img = document.createElement("img");
            img.width = img.height = 1;
            img.src = src;
            return img;
        }
        var img = createImage(baseurl + "?" + query);
        img.onload = img.onerror = function () {
            img.onload = null;
            img.onerror = null;
            callback();
        };
    },
    // 发送统计请求
    sendByXMLHttpRequest: function sendByXMLHttpRequest(baseurl, query, callback) {
        var XMLHttpRequest = window.XMLHttpRequest;
        if (!XMLHttpRequest) return false;
        var request = new XMLHttpRequest();
        if (!("withCredentials" in request)) return false;
        request.open("GET", baseurl + '?' + query, true);
        request.withCredentials = true;
        request.setRequestHeader("Content-Type", "text/plain");
        request.onreadystatechange = function () {
            4 == request.readyState && (callback(), request = null);
        };
        request.send(null);
        return true;
    },
    // 发送统计请求
    sendByBeacon: function sendByBeacon(baseurl, query, callback) {
        // Beacon API 的作用就是为了能让浏览器在类似unload这样的情况下成功发送请求，同时不影响下一个页面的载入
        if (window.navigator.sendBeacon && window.navigator.sendBeacon(baseurl + '?' + query)) {
            callback();
            return true;
        }
        return false;
    },
    // 发送统计请求
    send: function send(baseurl, query, callback) {
        // if ('__environment__' === 'test') return;
        if (!/\.lmlc\.com$/.test(document.location.host)) return;
        callback = callback || function () {};
        var fullurl = baseurl + "?" + query;
        this.sendByImage(baseurl, query, callback);
        // if (2048 >= fullurl.length)
        //  this.sendByImage(baseurl, query, callback);
        // else if (8192 >= fullurl.length)
        //  this.sendByBeacon(baseurl, query, callback) || this.sendByXMLHttpRequest(baseurl, query, callback) || this.sendByImage(baseurl, query, callback);
        // else {
        //  console.log('发送错误！');
        // }
    },
    getPageParam: function getPageParam() {
        return ['pid=' + this.pageViewId, // 一次pv的id 时间戳 + '.' + 随机数
        '&cid=' + this.clientId, // uv的id uuid 保存在浏览器cookie _la中，如果被清掉则视为新的客户端
        '&uid=' + this.userId, // 当前或上一次登录的立马理财账号，保存在cookie P_INFO中
        '&dl=' + this.location, // 当前文档位置url
        '&dr=' + this.referrer, // 文档引荐来源url
        '&dt=' + this.title, // 文档标题
        '&de=' + this.encodeing, // 文档编码 UTF-8
        '&ul=' + this.language, // 用户语言 zh-cn
        '&vp=' + this.viewportSize, // 视口大小 width x height
        '&sr=' + this.screenResolution, // 屏幕分辨率 width x height
        '&sh=' + this.scrollHeight, // 文档滚动高度 
        '&sd=' + this.screenColors, // 屏幕颜色 24-bit
        '&je=' + this.javaEnabled, // 是否启用java 0
        '&fl=' + this.flashVersion // flash版本 
        ].join('');
    },
    /**
     * 事件统计
     * @param  {String} category 类别，通常是用户与之互动的对象（例如 'Video'）
     * @param  {String} action   互动类型（例如 'play'）
     * @param  {String} label    事件标签（例如 'Fall Campaign'）
     * @param  {Number} value    与事件相关的数值（例如 42）
     */
    // event: function(category, action, label, value) {
    //  this.send(this.baseurl, [
    //      this.getPageParam(),
    //      category ? '&ec=' + category : '', // 事件类别
    //      action ? '&ea=' + action : '', // 事件类型
    //      label ? '&el=' + label : '', // 事件标签
    //      value ? '&ev=' + value : '' // 事件价值
    //  ].join(''));
    // },
    // 命令队列
    commandsList: [],
    // 插入命令
    add: function add(command) {
        this.commandsList.push(command);
    },
    // 执行命令队列
    execute: function execute() {
        for (var i = 0, command; command = this.commandsList[i++];) {
            command.execute();
        }
    }
};
exports.default = Analytics;
module.exports = exports["default"];

/***/ })

/******/ });
});
//# sourceMappingURL=index.js.map