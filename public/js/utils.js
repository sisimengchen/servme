(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define('lmfe.utils', factory) :
	(global.Utils = factory());
}(this, (function () { 'use strict';

var isNumber = function(obj) {
	return Object.prototype.toString.apply(obj) == "[object Number]";
};

/**
 * 获取元素item数组array中首次出现的位置, 如果未找到item， 则返回-1。通过start的值可以指定搜索的起始位置。
 * @method indexOf
 * @remind 该方法的匹配过程使用的是恒等“===”
 * @param { Array } array 需要查找的数组对象
 * @param { * } item 需要在目标数组中查找的值
 * @param { int } start 搜索的起始位置
 * @return { int } 返回item在目标数组array中的start位置之后首次出现的位置， 如果在数组中未找到item， 则返回-1
 * @example
 * ```javascript
 * var item = 1,
 *     arr = [ 3, 4, 6, 8, 1, 2, 8, 3, 2, 1, 1, 4 ];
 *
 * //output: 9
 * console.log( UE.utils.indexOf( arr, item, 5 ) );
 * ```
 */
var indexOf = function(array, item, start) {
  var index = -1;
  start = isNumber(start) ? start : 0;
  this.each(array, function(v, i) {
    if (i >= start && v === item) {
      index = i;
      return false;
    }
  });
  return index;
};

var isArray = function(obj) {
	return Object.prototype.toString.apply(obj) == "[object Array]";
};

/**
 * 将字符串数组转换成哈希对象， 其生成的hash对象的key为数组中的元素， value为1
 * @method listToMap
 * @warning 该方法在生成的hash对象中，会为每一个key同时生成一个另一个全大写的key。
 * @param { Array } arr 字符串数组
 * @return { Object } 转化之后的hash对象
 * @example
 * ```javascript
 *
 * //output: Object {UEdtior: 1, UEDTIOR: 1, Hello: 1, HELLO: 1}
 * console.log( UE.utils.listToMap( [ 'UEdtior', 'Hello' ] ) );
 *
 * ```
 */
var listToMap = function(list) {
  if (!list) return {};
  list = isArray(list) ? list : list.split(",");
  for (var i = 0, ci, obj = {};
    (ci = list[i++]);) {
    obj[ci.toUpperCase()] = obj[ci] = 1;
  }
  return obj;
};

/**
 * 移除数组array中所有的元素item
 * @method removeItem
 * @param { Array } array 要移除元素的目标数组
 * @param { * } item 将要被移除的元素
 * @remind 该方法的匹配过程使用的是恒等“===”
 * @example
 * ```javascript
 * var arr = [ 4, 5, 7, 1, 3, 4, 6 ];
 *
 * UE.utils.removeItem( arr, 4 );
 * //output: [ 5, 7, 1, 3, 6 ]
 * console.log( arr );
 *
 * ```
 */
var removeItem = function(array, item) {
  for (var i = 0, l = array.length; i < l; i++) {
    if (array[i] === item) {
      array.splice(i, 1);
      i--;
    }
  }
};

var array = {
	indexOf: indexOf,
	listToMap: listToMap,
	removeItem: removeItem
};

var isRegExp = function(obj) {
	return Object.prototype.toString.apply(obj) == "[object RegExp]";
};

var trim = function(str) {
	return str.replace(/(^[ \t\n\r]+)|([ \t\n\r]+$)/g, "");
};

var hasClass = function(element, className) {
	if (isRegExp(className)) {
		return className.test(element.className);
	}
	className = trim(className).replace(/[ ]{2,}/g, " ").split(" ");
	for (var i = 0, ci, cls = element.className;
		(ci = className[i++]);) {
		if (!new RegExp("\\b" + ci + "\\b", "i").test(cls)) {
			return false;
		}
	}
	return i - 1 == className.length;
};

var addClass = function(elm, classNames) {
	if (!elm) return;
	classNames = trim(classNames).replace(/[ ]{2,}/g, " ").split(" ");
	for (var i = 0, ci, cls = elm.className;
		(ci = classNames[i++]);) {
		if (!new RegExp("\\b" + ci + "\\b").test(cls)) {
			cls += " " + ci;
		}
	}
	elm.className = trim(cls);
};

var removeClass = function(elm, classNames) {
	classNames = isArray(classNames) ? classNames : trim(classNames).replace(/[ ]{2,}/g, " ").split(" ");
	for (var i = 0, ci, cls = elm.className;
		(ci = classNames[i++]);) {
		cls = cls.replace(new RegExp("\\b" + ci + "\\b"), "");
	}
	cls = trim(cls).replace(/[ ]{2,}/g, " ");
	if (cls) {
		elm.className = cls;
	} else {
		domUtils.removeAttributes(elm, ["class"]);
	}
};

/**
 * 为元素element绑定原生DOM事件，type为事件类型，handler为处理函数
 * @method on
 * @param { Node } element 需要绑定事件的节点对象
 * @param { String } type 绑定的事件类型
 * @param { Function } handler 事件处理器
 * @example
 * ```javascript
 * UE.dom.domUtils.on(document.body,"click",function(e){
 *     //e为事件对象，this为被点击元素对戏那个
 * });
 * ```
 */
/**
 * 为元素element绑定原生DOM事件，type为事件类型，handler为处理函数
 * @method on
 * @param { Node } element 需要绑定事件的节点对象
 * @param { Array } type 绑定的事件类型数组
 * @param { Function } handler 事件处理器
 * @example
 * ```javascript
 * UE.dom.domUtils.on(document.body,["click","mousedown"],function(evt){
 *     //evt为事件对象，this为被点击元素对象
 * });
 * ```
 */
var on = function(element, type, handler) {
	var types = isArray(type) ? type : trim(type).split(/\s+/),
		k = types.length;
	if (k)
		while (k--) {
			type = types[k];
			if (element.addEventListener) {
				element.addEventListener(type, handler, false);
			} else {
				if (!handler._d) {
					handler._d = {
						els: []
					};
				}
				var key = type + handler.toString(),
					index = indexOf(handler._d.els, element);
				if (!handler._d[key] || index == -1) {
					if (index == -1) {
						handler._d.els.push(element);
					}
					if (!handler._d[key]) {
						handler._d[key] = function(evt) {
							return handler.call(evt.srcElement, evt || window.event);
						};
					}
					element.attachEvent("on" + type, handler._d[key]);
				}
			}
		}
	element = null;
};

/**
 * 解除DOM事件绑定
 * @method un
 * @param { Node } element 需要解除事件绑定的节点对象
 * @param { String } type 需要接触绑定的事件类型
 * @param { Function } handler 对应的事件处理器
 * @example
 * ```javascript
 * UE.dom.domUtils.un(document.body,"click",function(evt){
 *     //evt为事件对象，this为被点击元素对象
 * });
 * ```
 */

/**
 * 解除DOM事件绑定
 * @method un
 * @param { Node } element 需要解除事件绑定的节点对象
 * @param { Array } type 需要接触绑定的事件类型数组
 * @param { Function } handler 对应的事件处理器
 * @example
 * ```javascript
 * UE.dom.domUtils.un(document.body, ["click","mousedown"],function(evt){
 *     //evt为事件对象，this为被点击元素对象
 * });
 * ```
 */
var un = function(element, type, handler) {
	var types = isArray(type) ? type : trim(type).split(/\s+/),
		k = types.length;
	if (k)
		while (k--) {
			type = types[k];
			if (element.removeEventListener) {
				element.removeEventListener(type, handler, false);
			} else {
				var key = type + handler.toString();
				try {
					element.detachEvent(
						"on" + type,
						handler._d ? handler._d[key] : handler
					);
				} catch (e) {}
				if (handler._d && handler._d[key]) {
					var index = indexOf(handler._d.els, element);
					if (index != -1) {
						handler._d.els.splice(index, 1);
					}
					handler._d.els.length == 0 && delete handler._d[key];
				}
			}
		}
};

var preventDefault = function(event) {
	var event = event || window.event;
	event.preventDefault ? event.preventDefault() : event.returnValue = false;
};

var stopPropagation = function(event) {
	var event = event || window.event;
	event.stopPropagation ? event.stopPropagation() : event.cancelBubble = true;
};

var getClipboardText = function(event) {
	var event = event || window.event;
	var clipboardData = event.clipboardData || window.clipboardData;
	return clipboardData.getData("text");
};

var getDataTransferText = function(event) {
	var event = event || window.event;
	var dataTransfer = event.dataTransfer || window.dataTransfer;
	return dataTransfer.getData("text");
};

var dom = {
	hasClass: hasClass,
	addClass: addClass,
	removeClass: removeClass,
	on: on,
	un: un,
	preventDefault: preventDefault,
	stopPropagation: stopPropagation,
	getClipboardText: getClipboardText,
	getDataTransferText: getDataTransferText
};

/**
 * 用指定的context对象作为函数fn的上下文
 * @method bind
 * @param { Function } fn 需要绑定上下文的函数对象
 * @param { Object } content 函数fn新的上下文对象
 * @return { Function } 一个新的函数， 该函数作为原始函数fn的代理， 将完成fn的上下文调换工作。
 * @example
 * ```javascript
 *
 * var name = 'window',
 *     newTest = null;
 *
 * function test () {
 *     console.log( this.name );
 * }
 *
 * newTest = UE.utils.bind( test, { name: 'object' } );
 *
 * //output: object
 * newTest();
 *
 * //output: window
 * test();
 *
 * ```
 */
var bind = function(func, context) {
  var args = Array.prototype.slice.call(arguments, 2);
  return function() {
    return func.apply(context, args.concat(nativeSlice.call(arguments)));
  };
};

/**
 * 创建延迟指定时间后执行的函数fn, 如果在延迟时间内再次执行该方法， 将会根据指定的exclusion的值，
 * 决定是否取消前一次函数的执行， 如果exclusion的值为true， 则取消执行，反之，将继续执行前一个方法。
 * @method defer
 * @param { Function } fn 需要延迟执行的函数对象
 * @param { int } delay 延迟的时间， 单位是毫秒
 * @param { Boolean } exclusion 如果在延迟时间内再次执行该函数，该值将决定是否取消执行前一次函数的执行，
 *                     值为true表示取消执行， 反之则将在执行前一次函数之后才执行本次函数调用。
 * @warning 该方法的时间控制是不精确的，仅仅只能保证函数的执行是在给定的时间之后，
 *           而不能保证刚好到达延迟时间时执行。
 * @return { Function } 目标函数fn的代理函数， 只有执行该函数才能起到延时效果
 * @example
 * ```javascript
 *
 * function test(){
 *     console.log(1);
 * }
 *
 * var testDefer = UE.utils.defer( test, 1000, true );
 *
 * //output: (两次调用仅有一次输出) 1
 * testDefer();
 * testDefer();
 * ```
 */
var defer = function(fn, delay, exclusion) {
   var timerID;
   return function() {
      if (exclusion) {
         clearTimeout(timerID);
      }
      timerID = setTimeout(fn, delay);
   };
};

var curry = function(func) {
 	var args = Array.prototype.slice.call(arguments, 1);
 	return function() {
 		return func.apply(this, args.concat(Array.prototype.slice.call(arguments)));
 	};
 };

var fun = {
	bind: bind,
	defer: defer,
	curry: curry
};

/**
 * 深度克隆对象，将source的属性克隆到target对象， 会覆盖target重名的属性。
 * @method clone
 * @param { Object } source 源对象
 * @param { Object } target 目标对象
 * @return { Object } 附加了source对象所有属性的target对象
 */
var clone = function(source, target) {
	var tmp;
	target = target || {};
	for (var i in source) {
		if (source.hasOwnProperty(i)) {
			tmp = source[i];
			if (typeof tmp == "object") {
				target[i] = isArray(tmp) ? [] : {};
				clone(source[i], target[i]);
			} else {
				target[i] = tmp;
			}
		}
	}
	return target;
};

/**
 * 将给定的多个对象的属性复制到目标对象target上
 * @method extend
 * @remind 该方法将强制把源对象上的属性复制到target对象上
 * @remind 该方法支持两个及以上的参数， 从第二个参数开始， 其属性都会被复制到第一个参数上。 如果遇到同名的属性，
 *          将会覆盖掉之前的值。
 * @param { Object } target 目标对象， 新的属性将附加到该对象上
 * @param { Object... } source 源对象， 支持多个对象， 该对象的属性会被附加到target对象上
 * @return { Object } 返回target对象
 * @example
 * ```javascript
 *
 * var target = {},
 *     source1 = { name: 'source', age: 17 },
 *     source2 = { title: 'dev' };
 *
 * UE.utils.extend( target, source1, source2 );
 *
 * //output: { name: 'source', age: 17, title: 'dev' }
 * console.log( target );
 *
 * ```
 */
var extend = function(target) {
	for (var i = 1, j = arguments.length; i < j; i++) {
		var source = arguments[i] || {};
		for (var prop in source) {
			if (source.hasOwnProperty(prop)) {
				var value = source[prop];
				if (value !== undefined) {
					target[prop] = value;
				}
			}
		}
	}
	return target;
};

var obj = {
	clone: clone,
	extend: extend
};

var byteLen = function(string) {
	return string.replace(/([^\x00-\xff])/g, 'ma').length;
};

var round = function(number, dot, step) {
	var a = Math.pow(10, dot || 0);
	var precision = 1e-13;

	return step === 0 ? Math.ceil(number * a) / a :
		Math.round(number * a + (5 - (step || 5)) / 10 + precision) / a;
};

var cint = function(number, step) {
	return round(number, 0, step);
};

var cutString = function(string, len, holder) {
	var reg = /([^\x00-\xff])/g;
	var reg2 = /([^\x00-\xff]) /g;
	var hd;
	var hdLen;
	var str;

	if (holder) {
		hd = String(holder);
		hdLen = hd.length;

		str = string.replace(reg, '$1 ');

		len = len >= hdLen ? len - hdLen : 0;
		holder = str.length > len ? hd : '';

		return str.substr(0, len).replace(reg2, '$1') + holder;
	}

	// 算法来源于百度开源前端库
	// https://github.com/BaiduFE/Tangram-more/blob/master/src/SubstrByByte/substrByByte.js
	return string.substr(0, len)
		.replace(reg, '$1 ')
		.substr(0, len)
		.replace(reg2, '$1');
};

var randomString = function(level) {
	var lvl = {
		2: 2,
		3: 3,
		4: 4,
		5: 5
	}[level] || 1;
	var rnd = '';
	var index = 0;

	for (; index < lvl; index++) {
		rnd += Math.random().toString(36).slice(2);
	}

	return rnd;
};

var round465 = function(number, dot) {
	dot = dot || 0;
	var num = '' + number;
	var flag = false;
	var tmp;
	var reg = new RegExp('^(\\d*)(\\d)(\\.)(\\d{' + dot + '})5(\\d*)$');

	if (reg.test(num)) {
		if (dot === 0) {
			num = num.replace(reg, '$1$2');
			tmp = RegExp.$2;
		} else {
			num = num.replace(reg, '$1$2$3$4');
			tmp = RegExp.$4;
		}

		// 5后有非0数字时，则进1，保留的数字最后一位加1
		if (+RegExp.$5 > 0) {
			flag = true;
		} else if (tmp % 2 !== 0) {
			// 5前一位为奇数，则进1
			flag = true;
		}


		if (flag) {
			num = (+num) + 1 / Math.pow(10, dot);
		}
	}

	return round(+num, dot);
};

var safeHTML = function(string) {
	return string.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/'/g, '&quot;')
		.replace(/'/g, '&#39;');
};

var safeRegStr = function(string) {
	return string.replace(/([\\\(\)\{\}\[\]\^\$\+\-\*\?\|])/g, '\\$1');
};

/**
   * 将str中的html符号转义,将转义“'，&，<，"，>，”，“”七个字符
   * @method unhtml
   * @param { String } str 需要转义的字符串
   * @return { String } 转义后的字符串
   * @example
   * ```javascript
   * var html = '<body>&</body>';
   *
   * //output: &lt;body&gt;&amp;&lt;/body&gt;
   * console.log( UE.utils.unhtml( html ) );
   *
   * ```
   */
  var unhtml = function(str, reg) {
  	return str ? str.replace(
  		reg || /[&<">'](?:(amp|lt|ldquo|rdquo|quot|gt|#39|nbsp|#\d+);)?/g,
  		function(a, b) {
  			if (b) {
  				return a;
  			} else {
  				return {
  					"<": "&lt;",
  					"&": "&amp;",
  					'"': "&quot;",
  					"“": "&ldquo;",
  					"”": "&rdquo;",
  					">": "&gt;",
  					"'": "&#39;"
  				}[a];
  			}
  		}
  	) : "";
  };

/**
   * 将str中的转义字符还原成html字符
   * @see UE.utils.unhtml(String);
   * @method html
   * @param { String } str 需要逆转义的字符串
   * @return { String } 逆转义后的字符串
   * @example
   * ```javascript
   *
   * var str = '&lt;body&gt;&amp;&lt;/body&gt;';
   *
   * //output: <body>&</body>
   * console.log( UE.utils.html( str ) );
   *
   * ```
   */
  var html = function(str, reg) {
  	return str ? str.replace(/&((g|l|quo|ldquo|rdquo)t|amp|#39|nbsp);/g, function(m) {
  		return {
  			"&lt;": "<",
  			"&amp;": "&",
  			"&quot;": '"',
  			"&ldquo;": "“",
  			"&rdquo;": "”",
  			"&gt;": ">",
  			"&#39;": "'",
  			"&nbsp;": " "
  		}[m];
  	}) : "";
  };

var string = {
	byteLen: byteLen,
	cutString: cutString,
	randomString: randomString,
	safeHTML: safeHTML,
	safeRegStr: safeRegStr,
	cint: cint,
	round: round,
	round465: round465,
	trim: trim,
	unhtml: unhtml,
	html: html
};

var isDate = function(obj) {
	return Object.prototype.toString.apply(obj) == "[object Date]";
};

var isDom = function(obj) {
	return typeof obj === 'object' && typeof obj.nodeType === 'number' && typeof obj.ownerDocument === 'object';
};

var isFunction = function(obj) {
	return Object.prototype.toString.apply(obj) == "[object Function]";
};

var isObject = function(obj) {
	return Object.prototype.toString.apply(obj) == "[object Object]";
};

var isString = function(obj) {
	return Object.prototype.toString.apply(obj) == "[object String]";
};

var isUndefined = function(obj) {
	return typeof obj === "undefined";
};

var type = {
	isArray: isArray,
	isDate: isDate,
	isDom: isDom,
	isFunction: isFunction,
	isNumber: isNumber,
	isObject: isObject,
	isRegExp: isRegExp,
	isString: isString,
	isUndefined: isUndefined
};

var Utils = {
	array: array,
	dom: dom,
	fun: fun,
	obj: obj,
	string: string,
	isString: type.isString,
	isFunction: type.isFunction,
	isArray: type.isArray,
	isNumber: type.isNumber,
	isRegExp: type.isRegExp,
	isObject: type.isObject,
	isDate: type.isDate,
	isDom: type.isDom
};

return Utils;

})));
