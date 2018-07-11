(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("lmfe.class", [], factory);
	else if(typeof exports === 'object')
		exports["lmfe.class"] = factory();
	else
		root["Class"] = factory();
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
/******/ 	return __webpack_require__(__webpack_require__.s = "JgE+");
/******/ })
/************************************************************************/
/******/ ({

/***/ "0gxg":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * @namespace
 * @name ClassManager
 */
var ClassManager = function ClassManager() {
    // var id = (0 | (Math.random() * 998));
    var instanceId = 0 | Math.random() * 998;

    // this.getNewID = function () {
    //     return id++;
    // };

    this.getNewInstanceId = function () {
        return instanceId++;
    };
};
var classManager = new ClassManager();
/* Simple JavaScript Inheritance
 * By John Resig https://johnresig.com/
 * MIT Licensed.
 */
// Inspired by base2 and Prototype

// Create a new Clazz that inherits from this Clazz
var ClassBase = function ClassBase() {},
    initializing = false;
// fnTest = /xyz/.test(function () { xyz; }) ?  : /.*/;

// Create a new Clazz that inherits from this Clazz
ClassBase.extend = function (prop) {
    var _super = this.prototype;

    // Instantiate a base Clazz (but only create the instance,
    // don't run the init constructor)
    initializing = true;
    var prototype = new this();
    initializing = false;

    // Copy the properties over onto the new prototype
    for (var name in prop) {
        // Check if we're overwriting an existing function
        if (typeof prop[name] == "function" && typeof _super[name] == "function" && /\b_super\b/.test(prop[name])) {
            prototype[name] = function (pname, fn) {
                return function () {
                    var tmp = this._super;

                    // Add a new ._super() method that is the same method
                    // but on the super-Clazz
                    this._super = _super[pname];

                    // The method only need to be bound temporarily, so we
                    // remove it when we're done executing
                    var ret = fn.apply(this, arguments);
                    this._super = tmp;

                    return ret;
                };
            }(name, prop[name]);
        } else {
            prototype[name] = prop[name];
        }
    }

    // The dummy Clazz constructor
    function Class() {
        // All construction is actually done in the init method
        if (!initializing && this.init) {
            this._instanceId = classManager.getNewInstanceId();
            this.init.apply(this, arguments);
        }
    }

    // Populate our constructed prototype object
    Class.prototype = prototype;

    // Enforce the constructor to be what we expect
    Class.prototype.constructor = Class;

    // And make this Clazz extendable
    Class.extend = ClassBase.extend;

    return Class;
};

var Class = ClassBase.extend({
    _className: "Class",
    init: function init() {
        this._super();
    },
    className: function className() {
        return this._className;
    },
    instanceId: function instanceId() {
        return this._instanceId;
    }
});

exports.default = Class;
module.exports = exports["default"];

/***/ }),

/***/ "JgE+":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _class = __webpack_require__("0gxg");

var _class2 = _interopRequireDefault(_class);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var EventClass = _class2.default.extend({
    _className: "EventClass",
    _handlers: null,
    _eventCache: null,
    init: function init() {
        this._handlers = {};
        this._eventCache = {};
    },
    // 绑定监听一次
    one: function one(eventName, handler, context) {
        if (!eventName || !handler) {
            return this;
        }
        var _handlers = this._handlers;
        if (!_handlers[eventName]) {
            _handlers[eventName] = [];
        }
        _handlers[eventName].push({
            context: context || this,
            handler: handler,
            one: true
        });
        return this;
    },
    // 绑定监听
    bind: function bind(eventName, handler, context) {
        if (!eventName || !handler) {
            return this;
        }
        var _handlers = this._handlers;
        if (!_handlers[eventName]) {
            _handlers[eventName] = [];
        }
        _handlers[eventName].push({
            context: context || this,
            handler: handler,
            one: false
        });
        return this;
    },
    // 接触绑定
    unbind: function unbind(eventName, handler) {
        var _handlers = this._handlers;
        if (!eventName) {
            this._handlers = {};
            return this;
        }
        if (handler) {
            if (_handlers[eventName]) {
                var newList = [];
                for (var i = 0, l = _handlers[eventName].length; i < l; i++) {
                    if (_handlers[eventName][i]['handler'] != handler) {
                        newList.push(_handlers[eventName][i]);
                    }
                }
                _handlers[eventName] = newList;
            }
            if (_handlers[eventName] && _handlers[eventName].length === 0) {
                delete _handlers[eventName];
            }
        } else {
            delete _handlers[eventName];
        }
        return this;
    },
    // 事件派发
    dispatch: function dispatch(eventName) {
        var falseNum = 0;
        if (!eventName) {
            return falseNum === 0;
        }
        var _handlers = this._handlers[eventName];
        if (_handlers) {
            var args = Array.prototype.slice.call(arguments, 1),
                len = _handlers.length;
            for (var i = 0; i < len;) {
                if (_handlers[i]['handler'].apply(_handlers[i]['context'], args) === false) {
                    falseNum++;
                }
                if (_handlers[i]['one']) {
                    _handlers.splice(i, 1);
                    len--;
                } else {
                    i++;
                }
            }
        }
        return falseNum === 0;
    },
    // 指定上下文的事件派发
    dispatchWithContext: function dispatchWithContext(eventName) {
        var falseNum = 0;
        if (!eventName) {
            return falseNum === 0;
        }
        var _handlers = this._handlers[eventName];
        if (this._handlers[eventName]) {
            var context = arguments[arguments.length - 1],
                args = Array.prototype.slice.call(arguments, 1, arguments.length - 1),
                len = _handlers.length;
            for (var i = 0; i < len;) {
                if (_handlers[i]['handler'].apply(context, args) === false) {
                    falseNum++;
                }
                if (_handlers[i]['one']) {
                    _handlers.splice(i, 1);
                    len--;
                } else {
                    i++;
                }
            }
        }
        return falseNum === 0;
    },
    // 动态添加自定义事件缓存
    // eventNames 仅仅支持字符串类型数据，空格分割的函数名称，建议事件名都添加 on/before/after 等明显前缀
    _createEvent: function _createEvent(eventNames) {
        if (typeof eventNames !== "string") {
            return;
        }
        var me = this,
            cache = me._eventCache,
            eventList = eventNames.split(" "),
            len = eventList.length;
        for (var i = 0; i < len; i++) {
            var eventName = eventList[i];
            cache[eventName] = cache[eventName] || [];
            me[eventName] = function (ename) {
                return function (fn) {
                    if (Object.prototype.toString.call(fn) == "[object Function]") {
                        me.bind(ename, fn);
                        return me;
                    } else {
                        return me.dispatch.apply(me, [ename].concat(Array.prototype.slice.call(arguments, 0)));
                    }
                };
            }(eventName);
        }
    }
});

exports.default = EventClass;
module.exports = exports['default'];

/***/ })

/******/ });
});
//# sourceMappingURL=index.js.map