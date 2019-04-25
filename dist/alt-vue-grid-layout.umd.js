(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("vue"));
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["AltVueGridLayout"] = factory(require("vue"));
	else
		root["AltVueGridLayout"] = factory(root["Vue"]);
})((typeof self !== 'undefined' ? self : this), function(__WEBPACK_EXTERNAL_MODULE__8bbf__) {
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
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "fb15");
/******/ })
/************************************************************************/
/******/ ({

/***/ "01f9":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var LIBRARY = __webpack_require__("2d00");
var $export = __webpack_require__("5ca1");
var redefine = __webpack_require__("2aba");
var hide = __webpack_require__("32e9");
var Iterators = __webpack_require__("84f2");
var $iterCreate = __webpack_require__("41a0");
var setToStringTag = __webpack_require__("7f20");
var getPrototypeOf = __webpack_require__("38fd");
var ITERATOR = __webpack_require__("2b4c")('iterator');
var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
var FF_ITERATOR = '@@iterator';
var KEYS = 'keys';
var VALUES = 'values';

var returnThis = function () { return this; };

module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  $iterCreate(Constructor, NAME, next);
  var getMethod = function (kind) {
    if (!BUGGY && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS: return function keys() { return new Constructor(this, kind); };
      case VALUES: return function values() { return new Constructor(this, kind); };
    } return function entries() { return new Constructor(this, kind); };
  };
  var TAG = NAME + ' Iterator';
  var DEF_VALUES = DEFAULT == VALUES;
  var VALUES_BUG = false;
  var proto = Base.prototype;
  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
  var $default = $native || getMethod(DEFAULT);
  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
  var methods, key, IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if (!LIBRARY && typeof IteratorPrototype[ITERATOR] != 'function') hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() { return $native.call(this); };
  }
  // Define iterator
  if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG] = returnThis;
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};


/***/ }),

/***/ "0bfb":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 21.2.5.3 get RegExp.prototype.flags
var anObject = __webpack_require__("cb7c");
module.exports = function () {
  var that = anObject(this);
  var result = '';
  if (that.global) result += 'g';
  if (that.ignoreCase) result += 'i';
  if (that.multiline) result += 'm';
  if (that.unicode) result += 'u';
  if (that.sticky) result += 'y';
  return result;
};


/***/ }),

/***/ "0d58":
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = __webpack_require__("ce10");
var enumBugKeys = __webpack_require__("e11e");

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};


/***/ }),

/***/ "11e9":
/***/ (function(module, exports, __webpack_require__) {

var pIE = __webpack_require__("52a7");
var createDesc = __webpack_require__("4630");
var toIObject = __webpack_require__("6821");
var toPrimitive = __webpack_require__("6a99");
var has = __webpack_require__("69a8");
var IE8_DOM_DEFINE = __webpack_require__("c69a");
var gOPD = Object.getOwnPropertyDescriptor;

exports.f = __webpack_require__("9e1e") ? gOPD : function getOwnPropertyDescriptor(O, P) {
  O = toIObject(O);
  P = toPrimitive(P, true);
  if (IE8_DOM_DEFINE) try {
    return gOPD(O, P);
  } catch (e) { /* empty */ }
  if (has(O, P)) return createDesc(!pIE.f.call(O, P), O[P]);
};


/***/ }),

/***/ "1495":
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__("86cc");
var anObject = __webpack_require__("cb7c");
var getKeys = __webpack_require__("0d58");

module.exports = __webpack_require__("9e1e") ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = getKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) dP.f(O, P = keys[i++], Properties[P]);
  return O;
};


/***/ }),

/***/ "214f":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var hide = __webpack_require__("32e9");
var redefine = __webpack_require__("2aba");
var fails = __webpack_require__("79e5");
var defined = __webpack_require__("be13");
var wks = __webpack_require__("2b4c");

module.exports = function (KEY, length, exec) {
  var SYMBOL = wks(KEY);
  var fns = exec(defined, SYMBOL, ''[KEY]);
  var strfn = fns[0];
  var rxfn = fns[1];
  if (fails(function () {
    var O = {};
    O[SYMBOL] = function () { return 7; };
    return ''[KEY](O) != 7;
  })) {
    redefine(String.prototype, KEY, strfn);
    hide(RegExp.prototype, SYMBOL, length == 2
      // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
      // 21.2.5.11 RegExp.prototype[@@split](string, limit)
      ? function (string, arg) { return rxfn.call(string, this, arg); }
      // 21.2.5.6 RegExp.prototype[@@match](string)
      // 21.2.5.9 RegExp.prototype[@@search](string)
      : function (string) { return rxfn.call(string, this); }
    );
  }
};


/***/ }),

/***/ "230e":
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__("d3f4");
var document = __webpack_require__("7726").document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};


/***/ }),

/***/ "2350":
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),

/***/ "28a5":
/***/ (function(module, exports, __webpack_require__) {

// @@split logic
__webpack_require__("214f")('split', 2, function (defined, SPLIT, $split) {
  'use strict';
  var isRegExp = __webpack_require__("aae3");
  var _split = $split;
  var $push = [].push;
  var $SPLIT = 'split';
  var LENGTH = 'length';
  var LAST_INDEX = 'lastIndex';
  if (
    'abbc'[$SPLIT](/(b)*/)[1] == 'c' ||
    'test'[$SPLIT](/(?:)/, -1)[LENGTH] != 4 ||
    'ab'[$SPLIT](/(?:ab)*/)[LENGTH] != 2 ||
    '.'[$SPLIT](/(.?)(.?)/)[LENGTH] != 4 ||
    '.'[$SPLIT](/()()/)[LENGTH] > 1 ||
    ''[$SPLIT](/.?/)[LENGTH]
  ) {
    var NPCG = /()??/.exec('')[1] === undefined; // nonparticipating capturing group
    // based on es5-shim implementation, need to rework it
    $split = function (separator, limit) {
      var string = String(this);
      if (separator === undefined && limit === 0) return [];
      // If `separator` is not a regex, use native split
      if (!isRegExp(separator)) return _split.call(string, separator, limit);
      var output = [];
      var flags = (separator.ignoreCase ? 'i' : '') +
                  (separator.multiline ? 'm' : '') +
                  (separator.unicode ? 'u' : '') +
                  (separator.sticky ? 'y' : '');
      var lastLastIndex = 0;
      var splitLimit = limit === undefined ? 4294967295 : limit >>> 0;
      // Make `global` and avoid `lastIndex` issues by working with a copy
      var separatorCopy = new RegExp(separator.source, flags + 'g');
      var separator2, match, lastIndex, lastLength, i;
      // Doesn't need flags gy, but they don't hurt
      if (!NPCG) separator2 = new RegExp('^' + separatorCopy.source + '$(?!\\s)', flags);
      while (match = separatorCopy.exec(string)) {
        // `separatorCopy.lastIndex` is not reliable cross-browser
        lastIndex = match.index + match[0][LENGTH];
        if (lastIndex > lastLastIndex) {
          output.push(string.slice(lastLastIndex, match.index));
          // Fix browsers whose `exec` methods don't consistently return `undefined` for NPCG
          // eslint-disable-next-line no-loop-func
          if (!NPCG && match[LENGTH] > 1) match[0].replace(separator2, function () {
            for (i = 1; i < arguments[LENGTH] - 2; i++) if (arguments[i] === undefined) match[i] = undefined;
          });
          if (match[LENGTH] > 1 && match.index < string[LENGTH]) $push.apply(output, match.slice(1));
          lastLength = match[0][LENGTH];
          lastLastIndex = lastIndex;
          if (output[LENGTH] >= splitLimit) break;
        }
        if (separatorCopy[LAST_INDEX] === match.index) separatorCopy[LAST_INDEX]++; // Avoid an infinite loop
      }
      if (lastLastIndex === string[LENGTH]) {
        if (lastLength || !separatorCopy.test('')) output.push('');
      } else output.push(string.slice(lastLastIndex));
      return output[LENGTH] > splitLimit ? output.slice(0, splitLimit) : output;
    };
  // Chakra, V8
  } else if ('0'[$SPLIT](undefined, 0)[LENGTH]) {
    $split = function (separator, limit) {
      return separator === undefined && limit === 0 ? [] : _split.call(this, separator, limit);
    };
  }
  // 21.1.3.17 String.prototype.split(separator, limit)
  return [function split(separator, limit) {
    var O = defined(this);
    var fn = separator == undefined ? undefined : separator[SPLIT];
    return fn !== undefined ? fn.call(separator, O, limit) : $split.call(String(O), separator, limit);
  }, $split];
});


/***/ }),

/***/ "2aba":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("7726");
var hide = __webpack_require__("32e9");
var has = __webpack_require__("69a8");
var SRC = __webpack_require__("ca5a")('src');
var TO_STRING = 'toString';
var $toString = Function[TO_STRING];
var TPL = ('' + $toString).split(TO_STRING);

__webpack_require__("8378").inspectSource = function (it) {
  return $toString.call(it);
};

(module.exports = function (O, key, val, safe) {
  var isFunction = typeof val == 'function';
  if (isFunction) has(val, 'name') || hide(val, 'name', key);
  if (O[key] === val) return;
  if (isFunction) has(val, SRC) || hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
  if (O === global) {
    O[key] = val;
  } else if (!safe) {
    delete O[key];
    hide(O, key, val);
  } else if (O[key]) {
    O[key] = val;
  } else {
    hide(O, key, val);
  }
// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
})(Function.prototype, TO_STRING, function toString() {
  return typeof this == 'function' && this[SRC] || $toString.call(this);
});


/***/ }),

/***/ "2aeb":
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject = __webpack_require__("cb7c");
var dPs = __webpack_require__("1495");
var enumBugKeys = __webpack_require__("e11e");
var IE_PROTO = __webpack_require__("613b")('IE_PROTO');
var Empty = function () { /* empty */ };
var PROTOTYPE = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = __webpack_require__("230e")('iframe');
  var i = enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  __webpack_require__("fab2").appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (i--) delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty();
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};


/***/ }),

/***/ "2b4c":
/***/ (function(module, exports, __webpack_require__) {

var store = __webpack_require__("5537")('wks');
var uid = __webpack_require__("ca5a");
var Symbol = __webpack_require__("7726").Symbol;
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;


/***/ }),

/***/ "2d00":
/***/ (function(module, exports) {

module.exports = false;


/***/ }),

/***/ "2d95":
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};


/***/ }),

/***/ "2f6a":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("f729");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__("499e").default
var update = add("37b4ad21", content, true, {"sourceMap":false,"shadowMode":false});

/***/ }),

/***/ "32e9":
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__("86cc");
var createDesc = __webpack_require__("4630");
module.exports = __webpack_require__("9e1e") ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),

/***/ "36bd":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)

var toObject = __webpack_require__("4bf8");
var toAbsoluteIndex = __webpack_require__("77f1");
var toLength = __webpack_require__("9def");
module.exports = function fill(value /* , start = 0, end = @length */) {
  var O = toObject(this);
  var length = toLength(O.length);
  var aLen = arguments.length;
  var index = toAbsoluteIndex(aLen > 1 ? arguments[1] : undefined, length);
  var end = aLen > 2 ? arguments[2] : undefined;
  var endPos = end === undefined ? length : toAbsoluteIndex(end, length);
  while (endPos > index) O[index++] = value;
  return O;
};


/***/ }),

/***/ "3846":
/***/ (function(module, exports, __webpack_require__) {

// 21.2.5.3 get RegExp.prototype.flags()
if (__webpack_require__("9e1e") && /./g.flags != 'g') __webpack_require__("86cc").f(RegExp.prototype, 'flags', {
  configurable: true,
  get: __webpack_require__("0bfb")
});


/***/ }),

/***/ "386d":
/***/ (function(module, exports, __webpack_require__) {

// @@search logic
__webpack_require__("214f")('search', 1, function (defined, SEARCH, $search) {
  // 21.1.3.15 String.prototype.search(regexp)
  return [function search(regexp) {
    'use strict';
    var O = defined(this);
    var fn = regexp == undefined ? undefined : regexp[SEARCH];
    return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[SEARCH](String(O));
  }, $search];
});


/***/ }),

/***/ "38fd":
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has = __webpack_require__("69a8");
var toObject = __webpack_require__("4bf8");
var IE_PROTO = __webpack_require__("613b")('IE_PROTO');
var ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};


/***/ }),

/***/ "3b2b":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("7726");
var inheritIfRequired = __webpack_require__("5dbc");
var dP = __webpack_require__("86cc").f;
var gOPN = __webpack_require__("9093").f;
var isRegExp = __webpack_require__("aae3");
var $flags = __webpack_require__("0bfb");
var $RegExp = global.RegExp;
var Base = $RegExp;
var proto = $RegExp.prototype;
var re1 = /a/g;
var re2 = /a/g;
// "new" creates a new object, old webkit buggy here
var CORRECT_NEW = new $RegExp(re1) !== re1;

if (__webpack_require__("9e1e") && (!CORRECT_NEW || __webpack_require__("79e5")(function () {
  re2[__webpack_require__("2b4c")('match')] = false;
  // RegExp constructor can alter flags and IsRegExp works correct with @@match
  return $RegExp(re1) != re1 || $RegExp(re2) == re2 || $RegExp(re1, 'i') != '/a/i';
}))) {
  $RegExp = function RegExp(p, f) {
    var tiRE = this instanceof $RegExp;
    var piRE = isRegExp(p);
    var fiU = f === undefined;
    return !tiRE && piRE && p.constructor === $RegExp && fiU ? p
      : inheritIfRequired(CORRECT_NEW
        ? new Base(piRE && !fiU ? p.source : p, f)
        : Base((piRE = p instanceof $RegExp) ? p.source : p, piRE && fiU ? $flags.call(p) : f)
      , tiRE ? this : proto, $RegExp);
  };
  var proxy = function (key) {
    key in $RegExp || dP($RegExp, key, {
      configurable: true,
      get: function () { return Base[key]; },
      set: function (it) { Base[key] = it; }
    });
  };
  for (var keys = gOPN(Base), i = 0; keys.length > i;) proxy(keys[i++]);
  proto.constructor = $RegExp;
  $RegExp.prototype = proto;
  __webpack_require__("2aba")(global, 'RegExp', $RegExp);
}

__webpack_require__("7a56")('RegExp');


/***/ }),

/***/ "41a0":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var create = __webpack_require__("2aeb");
var descriptor = __webpack_require__("4630");
var setToStringTag = __webpack_require__("7f20");
var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
__webpack_require__("32e9")(IteratorPrototype, __webpack_require__("2b4c")('iterator'), function () { return this; });

module.exports = function (Constructor, NAME, next) {
  Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
  setToStringTag(Constructor, NAME + ' Iterator');
};


/***/ }),

/***/ "456d":
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 Object.keys(O)
var toObject = __webpack_require__("4bf8");
var $keys = __webpack_require__("0d58");

__webpack_require__("5eda")('keys', function () {
  return function keys(it) {
    return $keys(toObject(it));
  };
});


/***/ }),

/***/ "4588":
/***/ (function(module, exports) {

// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};


/***/ }),

/***/ "4630":
/***/ (function(module, exports) {

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ }),

/***/ "4917":
/***/ (function(module, exports, __webpack_require__) {

// @@match logic
__webpack_require__("214f")('match', 1, function (defined, MATCH, $match) {
  // 21.1.3.11 String.prototype.match(regexp)
  return [function match(regexp) {
    'use strict';
    var O = defined(this);
    var fn = regexp == undefined ? undefined : regexp[MATCH];
    return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[MATCH](String(O));
  }, $match];
});


/***/ }),

/***/ "499e":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/vue-style-loader/lib/listToStyles.js
/**
 * Translates the list format produced by css-loader into something
 * easier to manipulate.
 */
function listToStyles (parentId, list) {
  var styles = []
  var newStyles = {}
  for (var i = 0; i < list.length; i++) {
    var item = list[i]
    var id = item[0]
    var css = item[1]
    var media = item[2]
    var sourceMap = item[3]
    var part = {
      id: parentId + ':' + i,
      css: css,
      media: media,
      sourceMap: sourceMap
    }
    if (!newStyles[id]) {
      styles.push(newStyles[id] = { id: id, parts: [part] })
    } else {
      newStyles[id].parts.push(part)
    }
  }
  return styles
}

// CONCATENATED MODULE: ./node_modules/vue-style-loader/lib/addStylesClient.js
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return addStylesClient; });
/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
  Modified by Evan You @yyx990803
*/



var hasDocument = typeof document !== 'undefined'

if (typeof DEBUG !== 'undefined' && DEBUG) {
  if (!hasDocument) {
    throw new Error(
    'vue-style-loader cannot be used in a non-browser environment. ' +
    "Use { target: 'node' } in your Webpack config to indicate a server-rendering environment."
  ) }
}

/*
type StyleObject = {
  id: number;
  parts: Array<StyleObjectPart>
}

type StyleObjectPart = {
  css: string;
  media: string;
  sourceMap: ?string
}
*/

var stylesInDom = {/*
  [id: number]: {
    id: number,
    refs: number,
    parts: Array<(obj?: StyleObjectPart) => void>
  }
*/}

var head = hasDocument && (document.head || document.getElementsByTagName('head')[0])
var singletonElement = null
var singletonCounter = 0
var isProduction = false
var noop = function () {}
var options = null
var ssrIdKey = 'data-vue-ssr-id'

// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
// tags it will allow on a page
var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\b/.test(navigator.userAgent.toLowerCase())

function addStylesClient (parentId, list, _isProduction, _options) {
  isProduction = _isProduction

  options = _options || {}

  var styles = listToStyles(parentId, list)
  addStylesToDom(styles)

  return function update (newList) {
    var mayRemove = []
    for (var i = 0; i < styles.length; i++) {
      var item = styles[i]
      var domStyle = stylesInDom[item.id]
      domStyle.refs--
      mayRemove.push(domStyle)
    }
    if (newList) {
      styles = listToStyles(parentId, newList)
      addStylesToDom(styles)
    } else {
      styles = []
    }
    for (var i = 0; i < mayRemove.length; i++) {
      var domStyle = mayRemove[i]
      if (domStyle.refs === 0) {
        for (var j = 0; j < domStyle.parts.length; j++) {
          domStyle.parts[j]()
        }
        delete stylesInDom[domStyle.id]
      }
    }
  }
}

function addStylesToDom (styles /* Array<StyleObject> */) {
  for (var i = 0; i < styles.length; i++) {
    var item = styles[i]
    var domStyle = stylesInDom[item.id]
    if (domStyle) {
      domStyle.refs++
      for (var j = 0; j < domStyle.parts.length; j++) {
        domStyle.parts[j](item.parts[j])
      }
      for (; j < item.parts.length; j++) {
        domStyle.parts.push(addStyle(item.parts[j]))
      }
      if (domStyle.parts.length > item.parts.length) {
        domStyle.parts.length = item.parts.length
      }
    } else {
      var parts = []
      for (var j = 0; j < item.parts.length; j++) {
        parts.push(addStyle(item.parts[j]))
      }
      stylesInDom[item.id] = { id: item.id, refs: 1, parts: parts }
    }
  }
}

function createStyleElement () {
  var styleElement = document.createElement('style')
  styleElement.type = 'text/css'
  head.appendChild(styleElement)
  return styleElement
}

function addStyle (obj /* StyleObjectPart */) {
  var update, remove
  var styleElement = document.querySelector('style[' + ssrIdKey + '~="' + obj.id + '"]')

  if (styleElement) {
    if (isProduction) {
      // has SSR styles and in production mode.
      // simply do nothing.
      return noop
    } else {
      // has SSR styles but in dev mode.
      // for some reason Chrome can't handle source map in server-rendered
      // style tags - source maps in <style> only works if the style tag is
      // created and inserted dynamically. So we remove the server rendered
      // styles and inject new ones.
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  if (isOldIE) {
    // use singleton mode for IE9.
    var styleIndex = singletonCounter++
    styleElement = singletonElement || (singletonElement = createStyleElement())
    update = applyToSingletonTag.bind(null, styleElement, styleIndex, false)
    remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true)
  } else {
    // use multi-style-tag mode in all other cases
    styleElement = createStyleElement()
    update = applyToTag.bind(null, styleElement)
    remove = function () {
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  update(obj)

  return function updateStyle (newObj /* StyleObjectPart */) {
    if (newObj) {
      if (newObj.css === obj.css &&
          newObj.media === obj.media &&
          newObj.sourceMap === obj.sourceMap) {
        return
      }
      update(obj = newObj)
    } else {
      remove()
    }
  }
}

var replaceText = (function () {
  var textStore = []

  return function (index, replacement) {
    textStore[index] = replacement
    return textStore.filter(Boolean).join('\n')
  }
})()

function applyToSingletonTag (styleElement, index, remove, obj) {
  var css = remove ? '' : obj.css

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = replaceText(index, css)
  } else {
    var cssNode = document.createTextNode(css)
    var childNodes = styleElement.childNodes
    if (childNodes[index]) styleElement.removeChild(childNodes[index])
    if (childNodes.length) {
      styleElement.insertBefore(cssNode, childNodes[index])
    } else {
      styleElement.appendChild(cssNode)
    }
  }
}

function applyToTag (styleElement, obj) {
  var css = obj.css
  var media = obj.media
  var sourceMap = obj.sourceMap

  if (media) {
    styleElement.setAttribute('media', media)
  }
  if (options.ssrId) {
    styleElement.setAttribute(ssrIdKey, obj.id)
  }

  if (sourceMap) {
    // https://developer.chrome.com/devtools/docs/javascript-debugging
    // this makes source maps inside style tags work properly in Chrome
    css += '\n/*# sourceURL=' + sourceMap.sources[0] + ' */'
    // http://stackoverflow.com/a/26603875
    css += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + ' */'
  }

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild)
    }
    styleElement.appendChild(document.createTextNode(css))
  }
}


/***/ }),

/***/ "4bf8":
/***/ (function(module, exports, __webpack_require__) {

// 7.1.13 ToObject(argument)
var defined = __webpack_require__("be13");
module.exports = function (it) {
  return Object(defined(it));
};


/***/ }),

/***/ "52a7":
/***/ (function(module, exports) {

exports.f = {}.propertyIsEnumerable;


/***/ }),

/***/ "5537":
/***/ (function(module, exports, __webpack_require__) {

var core = __webpack_require__("8378");
var global = __webpack_require__("7726");
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: core.version,
  mode: __webpack_require__("2d00") ? 'pure' : 'global',
  copyright: '© 2018 Denis Pushkarev (zloirock.ru)'
});


/***/ }),

/***/ "5ca1":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("7726");
var core = __webpack_require__("8378");
var hide = __webpack_require__("32e9");
var redefine = __webpack_require__("2aba");
var ctx = __webpack_require__("9b43");
var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] || (global[name] = {}) : (global[name] || {})[PROTOTYPE];
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE] || (exports[PROTOTYPE] = {});
  var key, own, out, exp;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    // export native or passed
    out = (own ? target : source)[key];
    // bind timers to global for call from export context
    exp = IS_BIND && own ? ctx(out, global) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // extend global
    if (target) redefine(target, key, out, type & $export.U);
    // export
    if (exports[key] != out) hide(exports, key, exp);
    if (IS_PROTO && expProto[key] != out) expProto[key] = out;
  }
};
global.core = core;
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;


/***/ }),

/***/ "5dbc":
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__("d3f4");
var setPrototypeOf = __webpack_require__("8b97").set;
module.exports = function (that, target, C) {
  var S = target.constructor;
  var P;
  if (S !== C && typeof S == 'function' && (P = S.prototype) !== C.prototype && isObject(P) && setPrototypeOf) {
    setPrototypeOf(that, P);
  } return that;
};


/***/ }),

/***/ "5eda":
/***/ (function(module, exports, __webpack_require__) {

// most Object methods by ES6 should accept primitives
var $export = __webpack_require__("5ca1");
var core = __webpack_require__("8378");
var fails = __webpack_require__("79e5");
module.exports = function (KEY, exec) {
  var fn = (core.Object || {})[KEY] || Object[KEY];
  var exp = {};
  exp[KEY] = exec(fn);
  $export($export.S + $export.F * fails(function () { fn(1); }), 'Object', exp);
};


/***/ }),

/***/ "613b":
/***/ (function(module, exports, __webpack_require__) {

var shared = __webpack_require__("5537")('keys');
var uid = __webpack_require__("ca5a");
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};


/***/ }),

/***/ "626a":
/***/ (function(module, exports, __webpack_require__) {

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = __webpack_require__("2d95");
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};


/***/ }),

/***/ "6821":
/***/ (function(module, exports, __webpack_require__) {

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = __webpack_require__("626a");
var defined = __webpack_require__("be13");
module.exports = function (it) {
  return IObject(defined(it));
};


/***/ }),

/***/ "69a8":
/***/ (function(module, exports) {

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};


/***/ }),

/***/ "6a99":
/***/ (function(module, exports, __webpack_require__) {

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = __webpack_require__("d3f4");
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};


/***/ }),

/***/ "6b54":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

__webpack_require__("3846");
var anObject = __webpack_require__("cb7c");
var $flags = __webpack_require__("0bfb");
var DESCRIPTORS = __webpack_require__("9e1e");
var TO_STRING = 'toString';
var $toString = /./[TO_STRING];

var define = function (fn) {
  __webpack_require__("2aba")(RegExp.prototype, TO_STRING, fn, true);
};

// 21.2.5.14 RegExp.prototype.toString()
if (__webpack_require__("79e5")(function () { return $toString.call({ source: 'a', flags: 'b' }) != '/a/b'; })) {
  define(function toString() {
    var R = anObject(this);
    return '/'.concat(R.source, '/',
      'flags' in R ? R.flags : !DESCRIPTORS && R instanceof RegExp ? $flags.call(R) : undefined);
  });
// FF44- RegExp#toString has a wrong name
} else if ($toString.name != TO_STRING) {
  define(function toString() {
    return $toString.call(this);
  });
}


/***/ }),

/***/ "6c7b":
/***/ (function(module, exports, __webpack_require__) {

// 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)
var $export = __webpack_require__("5ca1");

$export($export.P, 'Array', { fill: __webpack_require__("36bd") });

__webpack_require__("9c6c")('fill');


/***/ }),

/***/ "7726":
/***/ (function(module, exports) {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef


/***/ }),

/***/ "77f1":
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__("4588");
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};


/***/ }),

/***/ "79e5":
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};


/***/ }),

/***/ "7a56":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var global = __webpack_require__("7726");
var dP = __webpack_require__("86cc");
var DESCRIPTORS = __webpack_require__("9e1e");
var SPECIES = __webpack_require__("2b4c")('species');

module.exports = function (KEY) {
  var C = global[KEY];
  if (DESCRIPTORS && C && !C[SPECIES]) dP.f(C, SPECIES, {
    configurable: true,
    get: function () { return this; }
  });
};


/***/ }),

/***/ "7cdf":
/***/ (function(module, exports, __webpack_require__) {

// 20.1.2.3 Number.isInteger(number)
var $export = __webpack_require__("5ca1");

$export($export.S, 'Number', { isInteger: __webpack_require__("9c12") });


/***/ }),

/***/ "7f20":
/***/ (function(module, exports, __webpack_require__) {

var def = __webpack_require__("86cc").f;
var has = __webpack_require__("69a8");
var TAG = __webpack_require__("2b4c")('toStringTag');

module.exports = function (it, tag, stat) {
  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};


/***/ }),

/***/ "8378":
/***/ (function(module, exports) {

var core = module.exports = { version: '2.5.7' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef


/***/ }),

/***/ "84f2":
/***/ (function(module, exports) {

module.exports = {};


/***/ }),

/***/ "86cc":
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__("cb7c");
var IE8_DOM_DEFINE = __webpack_require__("c69a");
var toPrimitive = __webpack_require__("6a99");
var dP = Object.defineProperty;

exports.f = __webpack_require__("9e1e") ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),

/***/ "8b97":
/***/ (function(module, exports, __webpack_require__) {

// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var isObject = __webpack_require__("d3f4");
var anObject = __webpack_require__("cb7c");
var check = function (O, proto) {
  anObject(O);
  if (!isObject(proto) && proto !== null) throw TypeError(proto + ": can't set as prototype!");
};
module.exports = {
  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
    function (test, buggy, set) {
      try {
        set = __webpack_require__("9b43")(Function.call, __webpack_require__("11e9").f(Object.prototype, '__proto__').set, 2);
        set(test, []);
        buggy = !(test instanceof Array);
      } catch (e) { buggy = true; }
      return function setPrototypeOf(O, proto) {
        check(O, proto);
        if (buggy) O.__proto__ = proto;
        else set(O, proto);
        return O;
      };
    }({}, false) : undefined),
  check: check
};


/***/ }),

/***/ "8bbf":
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__8bbf__;

/***/ }),

/***/ "9093":
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var $keys = __webpack_require__("ce10");
var hiddenKeys = __webpack_require__("e11e").concat('length', 'prototype');

exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return $keys(O, hiddenKeys);
};


/***/ }),

/***/ "9b43":
/***/ (function(module, exports, __webpack_require__) {

// optional / simple context binding
var aFunction = __webpack_require__("d8e8");
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};


/***/ }),

/***/ "9c12":
/***/ (function(module, exports, __webpack_require__) {

// 20.1.2.3 Number.isInteger(number)
var isObject = __webpack_require__("d3f4");
var floor = Math.floor;
module.exports = function isInteger(it) {
  return !isObject(it) && isFinite(it) && floor(it) === it;
};


/***/ }),

/***/ "9c6c":
/***/ (function(module, exports, __webpack_require__) {

// 22.1.3.31 Array.prototype[@@unscopables]
var UNSCOPABLES = __webpack_require__("2b4c")('unscopables');
var ArrayProto = Array.prototype;
if (ArrayProto[UNSCOPABLES] == undefined) __webpack_require__("32e9")(ArrayProto, UNSCOPABLES, {});
module.exports = function (key) {
  ArrayProto[UNSCOPABLES][key] = true;
};


/***/ }),

/***/ "9def":
/***/ (function(module, exports, __webpack_require__) {

// 7.1.15 ToLength
var toInteger = __webpack_require__("4588");
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};


/***/ }),

/***/ "9e1e":
/***/ (function(module, exports, __webpack_require__) {

// Thank's IE8 for his funny defineProperty
module.exports = !__webpack_require__("79e5")(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),

/***/ "a481":
/***/ (function(module, exports, __webpack_require__) {

// @@replace logic
__webpack_require__("214f")('replace', 2, function (defined, REPLACE, $replace) {
  // 21.1.3.14 String.prototype.replace(searchValue, replaceValue)
  return [function replace(searchValue, replaceValue) {
    'use strict';
    var O = defined(this);
    var fn = searchValue == undefined ? undefined : searchValue[REPLACE];
    return fn !== undefined
      ? fn.call(searchValue, O, replaceValue)
      : $replace.call(String(O), searchValue, replaceValue);
  }, $replace];
});


/***/ }),

/***/ "aa77":
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__("5ca1");
var defined = __webpack_require__("be13");
var fails = __webpack_require__("79e5");
var spaces = __webpack_require__("fdef");
var space = '[' + spaces + ']';
var non = '\u200b\u0085';
var ltrim = RegExp('^' + space + space + '*');
var rtrim = RegExp(space + space + '*$');

var exporter = function (KEY, exec, ALIAS) {
  var exp = {};
  var FORCE = fails(function () {
    return !!spaces[KEY]() || non[KEY]() != non;
  });
  var fn = exp[KEY] = FORCE ? exec(trim) : spaces[KEY];
  if (ALIAS) exp[ALIAS] = fn;
  $export($export.P + $export.F * FORCE, 'String', exp);
};

// 1 -> String#trimLeft
// 2 -> String#trimRight
// 3 -> String#trim
var trim = exporter.trim = function (string, TYPE) {
  string = String(defined(string));
  if (TYPE & 1) string = string.replace(ltrim, '');
  if (TYPE & 2) string = string.replace(rtrim, '');
  return string;
};

module.exports = exporter;


/***/ }),

/***/ "aae3":
/***/ (function(module, exports, __webpack_require__) {

// 7.2.8 IsRegExp(argument)
var isObject = __webpack_require__("d3f4");
var cof = __webpack_require__("2d95");
var MATCH = __webpack_require__("2b4c")('match');
module.exports = function (it) {
  var isRegExp;
  return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : cof(it) == 'RegExp');
};


/***/ }),

/***/ "ac6a":
/***/ (function(module, exports, __webpack_require__) {

var $iterators = __webpack_require__("cadf");
var getKeys = __webpack_require__("0d58");
var redefine = __webpack_require__("2aba");
var global = __webpack_require__("7726");
var hide = __webpack_require__("32e9");
var Iterators = __webpack_require__("84f2");
var wks = __webpack_require__("2b4c");
var ITERATOR = wks('iterator');
var TO_STRING_TAG = wks('toStringTag');
var ArrayValues = Iterators.Array;

var DOMIterables = {
  CSSRuleList: true, // TODO: Not spec compliant, should be false.
  CSSStyleDeclaration: false,
  CSSValueList: false,
  ClientRectList: false,
  DOMRectList: false,
  DOMStringList: false,
  DOMTokenList: true,
  DataTransferItemList: false,
  FileList: false,
  HTMLAllCollection: false,
  HTMLCollection: false,
  HTMLFormElement: false,
  HTMLSelectElement: false,
  MediaList: true, // TODO: Not spec compliant, should be false.
  MimeTypeArray: false,
  NamedNodeMap: false,
  NodeList: true,
  PaintRequestList: false,
  Plugin: false,
  PluginArray: false,
  SVGLengthList: false,
  SVGNumberList: false,
  SVGPathSegList: false,
  SVGPointList: false,
  SVGStringList: false,
  SVGTransformList: false,
  SourceBufferList: false,
  StyleSheetList: true, // TODO: Not spec compliant, should be false.
  TextTrackCueList: false,
  TextTrackList: false,
  TouchList: false
};

for (var collections = getKeys(DOMIterables), i = 0; i < collections.length; i++) {
  var NAME = collections[i];
  var explicit = DOMIterables[NAME];
  var Collection = global[NAME];
  var proto = Collection && Collection.prototype;
  var key;
  if (proto) {
    if (!proto[ITERATOR]) hide(proto, ITERATOR, ArrayValues);
    if (!proto[TO_STRING_TAG]) hide(proto, TO_STRING_TAG, NAME);
    Iterators[NAME] = ArrayValues;
    if (explicit) for (key in $iterators) if (!proto[key]) redefine(proto, key, $iterators[key], true);
  }
}


/***/ }),

/***/ "be13":
/***/ (function(module, exports) {

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};


/***/ }),

/***/ "c366":
/***/ (function(module, exports, __webpack_require__) {

// false -> Array#indexOf
// true  -> Array#includes
var toIObject = __webpack_require__("6821");
var toLength = __webpack_require__("9def");
var toAbsoluteIndex = __webpack_require__("77f1");
module.exports = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};


/***/ }),

/***/ "c5f6":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var global = __webpack_require__("7726");
var has = __webpack_require__("69a8");
var cof = __webpack_require__("2d95");
var inheritIfRequired = __webpack_require__("5dbc");
var toPrimitive = __webpack_require__("6a99");
var fails = __webpack_require__("79e5");
var gOPN = __webpack_require__("9093").f;
var gOPD = __webpack_require__("11e9").f;
var dP = __webpack_require__("86cc").f;
var $trim = __webpack_require__("aa77").trim;
var NUMBER = 'Number';
var $Number = global[NUMBER];
var Base = $Number;
var proto = $Number.prototype;
// Opera ~12 has broken Object#toString
var BROKEN_COF = cof(__webpack_require__("2aeb")(proto)) == NUMBER;
var TRIM = 'trim' in String.prototype;

// 7.1.3 ToNumber(argument)
var toNumber = function (argument) {
  var it = toPrimitive(argument, false);
  if (typeof it == 'string' && it.length > 2) {
    it = TRIM ? it.trim() : $trim(it, 3);
    var first = it.charCodeAt(0);
    var third, radix, maxCode;
    if (first === 43 || first === 45) {
      third = it.charCodeAt(2);
      if (third === 88 || third === 120) return NaN; // Number('+0x1') should be NaN, old V8 fix
    } else if (first === 48) {
      switch (it.charCodeAt(1)) {
        case 66: case 98: radix = 2; maxCode = 49; break; // fast equal /^0b[01]+$/i
        case 79: case 111: radix = 8; maxCode = 55; break; // fast equal /^0o[0-7]+$/i
        default: return +it;
      }
      for (var digits = it.slice(2), i = 0, l = digits.length, code; i < l; i++) {
        code = digits.charCodeAt(i);
        // parseInt parses a string to a first unavailable symbol
        // but ToNumber should return NaN if a string contains unavailable symbols
        if (code < 48 || code > maxCode) return NaN;
      } return parseInt(digits, radix);
    }
  } return +it;
};

if (!$Number(' 0o1') || !$Number('0b1') || $Number('+0x1')) {
  $Number = function Number(value) {
    var it = arguments.length < 1 ? 0 : value;
    var that = this;
    return that instanceof $Number
      // check on 1..constructor(foo) case
      && (BROKEN_COF ? fails(function () { proto.valueOf.call(that); }) : cof(that) != NUMBER)
        ? inheritIfRequired(new Base(toNumber(it)), that, $Number) : toNumber(it);
  };
  for (var keys = __webpack_require__("9e1e") ? gOPN(Base) : (
    // ES3:
    'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' +
    // ES6 (in case, if modules with ES6 Number statics required before):
    'EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,' +
    'MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger'
  ).split(','), j = 0, key; keys.length > j; j++) {
    if (has(Base, key = keys[j]) && !has($Number, key)) {
      dP($Number, key, gOPD(Base, key));
    }
  }
  $Number.prototype = proto;
  proto.constructor = $Number;
  __webpack_require__("2aba")(global, NUMBER, $Number);
}


/***/ }),

/***/ "c69a":
/***/ (function(module, exports, __webpack_require__) {

module.exports = !__webpack_require__("9e1e") && !__webpack_require__("79e5")(function () {
  return Object.defineProperty(__webpack_require__("230e")('div'), 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),

/***/ "ca5a":
/***/ (function(module, exports) {

var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};


/***/ }),

/***/ "cadf":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var addToUnscopables = __webpack_require__("9c6c");
var step = __webpack_require__("d53b");
var Iterators = __webpack_require__("84f2");
var toIObject = __webpack_require__("6821");

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = __webpack_require__("01f9")(Array, 'Array', function (iterated, kind) {
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var kind = this._k;
  var index = this._i++;
  if (!O || index >= O.length) {
    this._t = undefined;
    return step(1);
  }
  if (kind == 'keys') return step(0, index);
  if (kind == 'values') return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');


/***/ }),

/***/ "cb7c":
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__("d3f4");
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};


/***/ }),

/***/ "ce10":
/***/ (function(module, exports, __webpack_require__) {

var has = __webpack_require__("69a8");
var toIObject = __webpack_require__("6821");
var arrayIndexOf = __webpack_require__("c366")(false);
var IE_PROTO = __webpack_require__("613b")('IE_PROTO');

module.exports = function (object, names) {
  var O = toIObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};


/***/ }),

/***/ "d3f4":
/***/ (function(module, exports) {

module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};


/***/ }),

/***/ "d53b":
/***/ (function(module, exports) {

module.exports = function (done, value) {
  return { value: value, done: !!done };
};


/***/ }),

/***/ "d812":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_6_oneOf_1_0_node_modules_css_loader_index_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_lib_index_js_ref_6_oneOf_1_2_node_modules_postcss_loader_lib_index_js_ref_6_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_grid_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2f6a");
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_6_oneOf_1_0_node_modules_css_loader_index_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_lib_index_js_ref_6_oneOf_1_2_node_modules_postcss_loader_lib_index_js_ref_6_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_grid_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_6_oneOf_1_0_node_modules_css_loader_index_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_lib_index_js_ref_6_oneOf_1_2_node_modules_postcss_loader_lib_index_js_ref_6_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_grid_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */
 /* unused harmony default export */ var _unused_webpack_default_export = (_node_modules_vue_style_loader_index_js_ref_6_oneOf_1_0_node_modules_css_loader_index_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_lib_index_js_ref_6_oneOf_1_2_node_modules_postcss_loader_lib_index_js_ref_6_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_grid_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "d8e8":
/***/ (function(module, exports) {

module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};


/***/ }),

/***/ "e11e":
/***/ (function(module, exports) {

// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');


/***/ }),

/***/ "f729":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("2350")(false);
// imports


// module
exports.push([module.i, "\n.alt-grid-container{position:relative\n}\n.alt-grid-container .alt-grid-item{position:absolute;background:grey\n}\n.alt-grid-container .alt-grid-item.can-drag{cursor:move\n}\n.alt-grid-container.alt-grid-container-operating .alt-grid-item{-webkit-transition-duration:.3s;transition-duration:.3s\n}\n.alt-grid-container.alt-grid-container-operating .alt-grid-item.operated-item{-webkit-transition-duration:.1s;transition-duration:.1s\n}\n.alt-grid-container .alt-grid-item:hover .alt-grid-item-resize-handler{display:block\n}\n.alt-grid-container .alt-grid-item-resize-handler{display:none;position:absolute;right:1px;bottom:1px;cursor:se-resize\n}\n.alt-grid-container .alt-g-i-r-h-default-style{width:0;height:0;border-top:5px solid transparent;border-left:5px solid transparent;border-right:5px solid #000;border-bottom:5px solid #000\n}\n.alt-grid-item-drag-placeholder{position:absolute;width:0;height:0;background:red;visibility:hidden\n}\n.alt-grid-container-operating .alt-grid-item-drag-placeholder{visibility:visible\n}\n.alt-grid-container-operating{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none\n}\n.alt-grid-container-operating .mask{width:100%;height:100%;position:absolute;z-index:2\n}\n.alt-grid-container-operating.alt-move .mask{cursor:move\n}\n.alt-grid-container-operating.alt-resize .mask{cursor:se-resize\n}", ""]);

// exports


/***/ }),

/***/ "fab2":
/***/ (function(module, exports, __webpack_require__) {

var document = __webpack_require__("7726").document;
module.exports = document && document.documentElement;


/***/ }),

/***/ "fb15":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/@vue/cli-service/lib/commands/build/setPublicPath.js
// This file is imported into lib/wc client bundles.

if (typeof window !== 'undefined') {
  var setPublicPath_i
  if ((setPublicPath_i = window.document.currentScript) && (setPublicPath_i = setPublicPath_i.src.match(/(.+\/)[^/]+\.js$/))) {
    __webpack_require__.p = setPublicPath_i[1] // eslint-disable-line
  }
}

// Indicate to webpack that this file can be concatenated
/* harmony default export */ var setPublicPath = (null);

// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/builtin/es6/defineProperty.js
function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}
// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/builtin/es6/objectSpread.js

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);

    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }

    ownKeys.forEach(function (key) {
      _defineProperty(target, key, source[key]);
    });
  }

  return target;
}
// EXTERNAL MODULE: external {"commonjs":"vue","commonjs2":"vue","root":"Vue"}
var external_commonjs_vue_commonjs2_vue_root_Vue_ = __webpack_require__("8bbf");
var external_commonjs_vue_commonjs2_vue_root_Vue_default = /*#__PURE__*/__webpack_require__.n(external_commonjs_vue_commonjs2_vue_root_Vue_);

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"6ef977f9-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/grid.vue?vue&type=template&id=9949dff2&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"alt-grid-container",class:_vm.operatorClass,style:(_vm.containerStyle)},[_c('div',{staticClass:"alt-grid-item-drag-placeholder",class:_vm.placeholderClass,style:(_vm.getCardStyleForPlaceholder(_vm.placeholder))}),_vm._l((_vm.innerLayout),function(item,index){return _c('div',{key:item._id,ref:"cards",refInFor:true,staticClass:"alt-grid-item",class:[_vm.canDragClass(item.isDraggable), _vm.gridItemClass, item.gridItemClass],style:(item._alt_style),attrs:{"dg-id":item._id}},[(_vm.getFirstSetValue(item.isShowOriginCloseBtn, _vm.isShowOriginCloseBtn, true))?_c('button',{class:[_vm.closeHandlerClass, item.closeHandlerClass],on:{"click":function($event){_vm.closeWidget(item._id)}}},[_vm._v("关闭")]):_vm._e(),_c(item.type,{ref:item._id,refInFor:true,tag:"component",attrs:{"alt-card-props":_vm.getPropsForInject(index, item)}}),(_vm.getFirstSetValue(item.isResizable, _vm.isResizable, true))?_c('span',{staticClass:"alt-grid-item-resize-handler",class:[_vm.resizeHandlerClass, item.resizeHandlerClass]}):_vm._e()],1)}),_c('div',{staticClass:"mask"})],2)}
var staticRenderFns = []


// CONCATENATED MODULE: ./src/components/grid.vue?vue&type=template&id=9949dff2&

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.regexp.match.js
var es6_regexp_match = __webpack_require__("4917");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.regexp.search.js
var es6_regexp_search = __webpack_require__("386d");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.array.iterator.js
var es6_array_iterator = __webpack_require__("cadf");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.object.keys.js
var es6_object_keys = __webpack_require__("456d");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.regexp.replace.js
var es6_regexp_replace = __webpack_require__("a481");

// EXTERNAL MODULE: ./node_modules/core-js/modules/web.dom.iterable.js
var web_dom_iterable = __webpack_require__("ac6a");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.regexp.split.js
var es6_regexp_split = __webpack_require__("28a5");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.regexp.constructor.js
var es6_regexp_constructor = __webpack_require__("3b2b");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.number.constructor.js
var es6_number_constructor = __webpack_require__("c5f6");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.number.is-integer.js
var es6_number_is_integer = __webpack_require__("7cdf");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.regexp.to-string.js
var es6_regexp_to_string = __webpack_require__("6b54");

// CONCATENATED MODULE: ./src/utils/util.js








 // 深拷贝

function deepCopy() {
  return JSON.parse(JSON.stringify(arguments.length <= 0 ? undefined : arguments[0]));
} // 获取变量类型

function getVariType(vari) {
  return Object.prototype.toString.call(vari).slice(8, -1).toLowerCase();
} // 判断值是否为 undefined 或 null

function isNil(val) {
  return val === undefined || val === null;
} // 获取vue对象

function getVue() {
  var temp = external_commonjs_vue_commonjs2_vue_root_Vue_default.a;
  if (temp) return temp;
  if (window.Vue) return window.Vue;
  return null;
} // 判断是否为整数

function isInteger(num) {
  if (Number.isInteger) return Number.isInteger(num);
  var s = num + '';
  return !~s.indexOf('.');
} // 判断是否含有某个class

function hasClass(dom, className) {
  var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
  var domClassName = dom.className;
  return reg.test(domClassName); // return ~domClassName.indexOf(className);
} // 从event.path中遍历查找包含某个class的元素

function findParentThoughEvtPath(evtPath, parentClass, stopClass) {
  var dom = null;

  for (var i = 0, l = evtPath.length; i < l; i++) {
    dom = evtPath[i];

    if (hasClass(dom, parentClass)) {
      return dom;
    }

    if (hasClass(dom, stopClass)) {
      return null;
    }
  }

  return null;
}
function util_getFirstSetValue() {
  var args = arguments;
  var l = args.length;

  for (var i = 0; i < l; i++) {
    if (!isNil(args[i])) return args[i];
  }

  return args[l - 1];
}
function forEach(arr, callBack) {
  for (var i = 0, j = arr.length; i < j; i++) {
    callBack && callBack(arr[i], i);
  }
}
function forEachValue(obj, fn) {
  Object.keys(obj).forEach(function (key) {
    return fn(obj[key], key);
  });
}
function getIndexOfArrayByAttr(arr, value, attr) {
  for (var i = 0; i < arr.length; i++) {
    if (attr) {
      if (arr[i][attr] === value) return i;
    } else {
      if (arr[i] === value) return i;
    }
  }

  return -1;
} // 获取event.path的polyfill

function getEventPath(event) {
  var target = event.target || null;
  var pathArr = [target];

  if (!target || !target.parentElement) {
    return [];
  }

  while (target.parentElement) {
    target = target.parentElement;
    pathArr.unshift(target);
  }

  return pathArr;
} // 标准化event对象


function normalizeEvent(event) {
  var evt = event;

  if (!evt.path) {
    evt.path = evt.composedPath && evt.composedPath() || getEventPath(event);
  }

  return evt;
}
function isDragIgnoreFrom(target, currentCard, ignoreFrom) {
  var ignoreElementList = currentCard.querySelectorAll(ignoreFrom);

  for (var i = 0, j = ignoreElementList.length; i < j; i++) {
    if (ignoreElementList[i] === target) {
      return true;
    }
  }

  return false;
}
function getUniqueID(len, radix) {
  var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
  var uuid = [],
      i;
  radix = radix || chars.length;

  if (len) {
    // Compact form
    for (i = 0; i < len; i++) {
      uuid[i] = chars[0 | Math.random() * radix];
    }
  } else {
    // 参考rfc4122，https://tools.ietf.org/html/rfc4122
    var r;
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
    uuid[14] = '4';

    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | Math.random() * 16;
        uuid[i] = chars[i == 19 ? r & 0x3 | 0x8 : r];
      }
    }
  }

  return uuid.join('');
}
// CONCATENATED MODULE: ./src/utils/watch-box-size.js
function watchBoxSizeChange(el, handler) {
  if (!(el instanceof HTMLElement)) {
    throw new TypeError('第一个参数必须是一个html元素');
  }

  if (/^(area|base|br|col|embed|hr|img|input|keygen|link|menuitem|meta|param|source|track|wbr|script|style|textarea|title)$/i.test(el.tagName)) {
    throw new TypeError('不支持当前元素类型，可以尝试使用div');
  }

  if (typeof handler !== 'function') {
    throw new TypeError('第二个参数必须是一个函数');
  }

  this.el = el;
  this.handler = handler;
  this.checkHidden();
}

watchBoxSizeChange.prototype.checkHidden = function checkHidden() {
  var _this = this;

  requestAnimationFrame(function () {
    var width = _this.el.offsetWidth;
    var height = _this.el.offsetHeight;

    if (width === 0 && height === 0) {
      checkHidden();
    } else {
      _this.handler();

      _this.init();
    }
  });
};

watchBoxSizeChange.prototype.init = function init() {
  // 最后一次变动的宽高
  this.lastWidth = this.el.offsetWidth || 1;
  this.lastHeight = this.el.offsetHeight || 1; // 最大宽高

  this.maxWidth = 10000 * this.lastWidth;
  this.maxHeight = 10000 * this.lastHeight; // 变动宽高

  this.newWidth = 0;
  this.newHeight = 0;
  this.expand = document.createElement('div');
  this.expand.style.cssText = 'position:absolute;top:0;bottom:0;left:0;right:0;z-index=-10000;overflow:hidden;visibility:hidden;';
  this.shrink = this.expand.cloneNode(false);
  var expandChild = document.createElement('div');
  expandChild.style.cssText = 'transition:0s;animation:none;';
  var shrinkChild = expandChild.cloneNode(false);
  expandChild.style.width = this.maxWidth + 'px';
  expandChild.style.height = this.maxHeight + 'px';
  shrinkChild.style.width = '250%';
  shrinkChild.style.height = '250%';
  this.expand.appendChild(expandChild);
  this.shrink.appendChild(shrinkChild);
  this.el.appendChild(this.expand);
  this.el.appendChild(this.shrink);

  if (this.expand.offsetParent !== this.el) {
    this.el.style.position = 'relative';
  }

  this.expand.scrollTop = this.shrink.scrollTop = this.maxHeight;
  this.expand.scrollLeft = this.shrink.scrollLeft = this.maxWidth;
  this.bindOnScroll = null;
  this.addListener();
};

watchBoxSizeChange.prototype.onScroll = function onScroll() {
  this.newWidth = this.el.offsetWidth || 1;
  this.newHeight = this.el.offsetHeight || 1;

  if (this.newWidth !== this.lastWidth || this.newHeight !== this.lastHeight) {
    requestAnimationFrame(this.onResize.bind(this));
  }

  this.expand.scrollTop = this.shrink.scrollTop = this.maxHeight;
  this.expand.scrollLeft = this.shrink.scrollLeft = this.maxWidth;
};

watchBoxSizeChange.prototype.onResize = function onResize() {
  this.lastWidth = this.newWidth;
  this.lastHeight = this.newHeight;
  this.handler(this.lastWidth, this.lastHeight);
};

watchBoxSizeChange.prototype.addListener = function addListener() {
  this.bindOnScroll = this.onScroll.bind(this);
  this.expand.addEventListener('scroll', this.bindOnScroll, false);
  this.shrink.addEventListener('scroll', this.bindOnScroll, false);
};

watchBoxSizeChange.prototype.removeListener = function removeListener() {
  this.expand.removeEventListener('scroll', this.bindOnScroll, false);
  this.shrink.removeEventListener('scroll', this.bindOnScroll, false);
};

watchBoxSizeChange.prototype.destroy = function destroy() {
  this.removeListener();
  this.el.removeChild(this.expand);
  this.el.removeChild(this.shrink);
};

/* harmony default export */ var watch_box_size = (watchBoxSizeChange);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.array.fill.js
var es6_array_fill = __webpack_require__("6c7b");

// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/builtin/es6/classCallCheck.js
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/builtin/es6/createClass.js
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}
// CONCATENATED MODULE: ./src/utils/rect.js





var rect_Rect =
/*#__PURE__*/
function () {
  function Rect() {
    var info = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var coors = arguments.length > 1 ? arguments[1] : undefined;

    _classCallCheck(this, Rect);

    this.appendUniqueId(info);
    this.x = this.isNotNegativeNumber(info.x) ? info.x : 0;
    this.y = this.isNotNegativeNumber(info.y) ? info.y : 0;
    this.w = this.isPositiveNumber(info.w) ? info.w : 1;
    this.h = this.isPositiveNumber(info.h) ? info.h : 1;
    this.id = info._id;
    this.rawInfo = info;
    this.coors = coors;
  }

  _createClass(Rect, [{
    key: "setPos",
    value: function setPos(pos) {
      var attrs = ['x', 'y', 'w', 'h'];
      var attrName;
      var tempValue;

      for (var i = 0, j = attrs.length; i < j; i++) {
        attrName = attrs[i];
        tempValue = pos[attrName];

        if (!isNil(tempValue)) {
          this[attrName] = tempValue;
          this.rawInfo[attrName] = tempValue;
        }
      }
    }
  }, {
    key: "moveTo",
    value: function moveTo(x, y) {
      if (this.coors.maxWidth && x + this.w > this.coors.maxWidth) {
        x = this.coors.maxWidth - this.w;
      }

      if (x < 0) x = 0;
      if (y < 0) y = 0;

      this.coors._moveTo(this.id, {
        x: x,
        y: y
      });
    }
  }, {
    key: "resizeTo",
    value: function resizeTo(w, h) {
      if (this.coors.maxWidth && w + this.x > this.coors.maxWidth) {
        w = this.coors.maxWidth - this.x;
      }

      if (w < 1) w = 1;
      if (h < 1) h = 1;

      this.coors._resizeTo(this.id, {
        w: w,
        h: h
      });
    }
  }, {
    key: "moveDown",
    value: function moveDown(rows) {
      this.coors._moveDown(this.id, rows);
    }
  }, {
    key: "fill",
    value: function fill(value) {
      this.coors.coorsFillRect(this.x, this.y, this.w, this.h, value);
    } // 判断是否是正整数

  }, {
    key: "isPositiveNumber",
    value: function isPositiveNumber(num) {
      if (isNil(num)) return false;
      return num > 0;
    } // 判断是否为非负数 也就是 大于等于0

  }, {
    key: "isNotNegativeNumber",
    value: function isNotNegativeNumber(num) {
      if (isNil(num)) return false;
      return num >= 0;
    }
  }, {
    key: "appendUniqueId",
    value: function appendUniqueId(item) {
      if (!item._id) {
        item._id = this.getUniqueId();
      }
    }
  }, {
    key: "getUniqueId",
    value: function getUniqueId(len, radix) {
      var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
      var uuid = [],
          i;
      radix = radix || chars.length;

      if (len) {
        // Compact form
        for (i = 0; i < len; i++) {
          uuid[i] = chars[0 | Math.random() * radix];
        }
      } else {
        // 参考rfc4122，https://tools.ietf.org/html/rfc4122
        var r;
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4';

        for (i = 0; i < 36; i++) {
          if (!uuid[i]) {
            r = 0 | Math.random() * 16;
            uuid[i] = chars[i == 19 ? r & 0x3 | 0x8 : r];
          }
        }
      }

      return uuid.join('');
    }
  }]);

  return Rect;
}();

/* harmony default export */ var utils_rect = (rect_Rect);
// CONCATENATED MODULE: ./src/utils/coordinate.js









var coordinate_Coordinate =
/*#__PURE__*/
function () {
  function Coordinate() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Coordinate);

    this.coors = [];
    this.coorItemsMap = {};
    this.maxWidth = options.maxWidth;
  }

  _createClass(Coordinate, [{
    key: "add",
    value: function add(info) {
      /**
       * 1. 判断位置参数合法性，不合法则自动分配
       * 2. 添加到坐标系
       * 3. 返回 id
       */
      var rectItem = new utils_rect(info, this);
      this.distributeRectPosition(rectItem);
      this.coorsFillRect(rectItem.x, rectItem.y, rectItem.w, rectItem.h, rectItem);
      this.coorItemsMap[rectItem.id] = rectItem;
      return rectItem;
    }
  }, {
    key: "coorsFillRect",
    value: function coorsFillRect(x, y, w, h, value) {
      var arr = this.coors;
      var row;

      for (var i = y; i < y + h; i++) {
        row = arr[i];

        if (isNil(row)) {
          arr[i] = [];
        }

        for (var j = x; j < x + w; j++) {
          arr[i][j] = value;
        }
      }
    }
  }, {
    key: "coorsGetRectItems",
    value: function coorsGetRectItems(x, y, w, h) {
      var itemsList = [];
      var row, cell;

      for (var i = y; i < y + h; i++) {
        row = this.coors[i] || [];

        for (var j = x; j < x + w; j++) {
          cell = row[j];

          if (!isNil(cell)) {
            itemsList.push(cell);
          }
        }
      }

      return itemsList;
    }
  }, {
    key: "distributeRectPosition",
    value: function distributeRectPosition(rectInstance) {
      if (!this.checkRectPositionIsLegal(rectInstance, this.coors)) {
        var legalPos = this.getLegalPosition(rectInstance, this.coorItemsMap);
        rectInstance.setPos(legalPos);
      }
    }
  }, {
    key: "getLegalPosition",
    value: function getLegalPosition(rectInstance, itemsMap) {
      var x = rectInstance.x;
      var y = rectInstance.y;
      var w = rectInstance.w;
      var h = rectInstance.h;
      var colsHeight = [];
      var tempItem = null;
      var tempY = 0;
      forEach(Object.keys(itemsMap), function (key) {
        tempItem = itemsMap[key];
        tempY = tempItem.y + tempItem.h;

        for (var m = tempItem.x; m < tempItem.x + tempItem.w; m++) {
          if (tempY > (colsHeight[m] || 0)) {
            colsHeight[m] = tempY;
          }
        }
      });
      var max = this.maxWidth || colsHeight.length + w;

      for (var i = 0; i < max; i++) {
        if (isNil(colsHeight[i])) {
          colsHeight[i] = 0;
        }
      }

      var index = this.getMinPeek(colsHeight, w);
      x = ~index ? index : 0;
      y = colsHeight[x] || 0;
      return {
        x: x,
        y: y,
        w: w,
        h: h
      };
    }
  }, {
    key: "getMinPeek",
    value: function getMinPeek(arr, w) {
      if (w === 1) {
        var minVal = Math.min.apply(null, arr);
        return arr.indexOf(minVal);
      }

      var index = -1;
      var value = Infinity;

      for (var i = 0; i < arr.length - w + 1; i++) {
        var flag = true;
        var item = arr[i];

        for (var j = i + 1; j < i + w; j++) {
          if (item < arr[j]) {
            flag = false;
            break;
          }
        }

        if (flag && item < value) {
          value = item;
          index = i;
        }
      }

      return index;
    } // 检查位置是否合法

  }, {
    key: "checkRectPositionIsLegal",
    value: function checkRectPositionIsLegal(item, coors) {
      var x = item.x;
      var y = item.y;
      var w = item.w;
      var h = item.h;

      for (var i = y; i < y + h; i++) {
        if (isNil(coors[i])) continue;

        for (var j = x; j < x + w; j++) {
          if (!isNil(coors[i][j])) {
            return false;
          }
        }
      }

      return true;
    }
  }, {
    key: "_moveTo",
    value: function _moveTo(id) {
      var pos = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      /**
       * 1. 找到对应的id
       * 2. 判断移动的
       */
      if (isNil(pos.x) || isNil(pos.y)) return;
      var rectItem = this.coorItemsMap[id];
      rectItem.fill(null);
      var targetRect = {
        x: pos.x,
        y: pos.y,
        w: rectItem.w,
        h: rectItem.h
      };
      var targetAreaRectItems = this.coorsGetFirstItemForColsInRect(targetRect);
      var targetBottomLine = {
        x: targetRect.x,
        y: targetRect.y + targetRect.h,
        w: targetRect.w
      };
      forEach(targetAreaRectItems, function (item) {
        item.moveDown(targetBottomLine.y - item.y);
      });
      rectItem.setPos(targetRect);
      this.coorsFillRect(targetRect.x, targetRect.y, targetRect.w, targetRect.h, rectItem);

      this._moveUpAll();
    }
  }, {
    key: "_resizeTo",
    value: function _resizeTo(id) {
      var rect = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      if (isNil(rect.w) || isNil(rect.h)) return;
      var rectItem = this.coorItemsMap[id];
      rectItem.fill(null);
      var targetRect = {
        x: rectItem.x,
        y: rectItem.y,
        w: rect.w,
        h: rect.h
      };
      var targetAreaRectItems = this.coorsGetFirstItemForColsInRect(targetRect);
      var targetBottomLine = {
        x: targetRect.x,
        y: targetRect.y + targetRect.h,
        w: targetRect.w
      };
      forEach(targetAreaRectItems, function (item) {
        item.moveDown(targetBottomLine.y - item.y);
      });
      rectItem.setPos(targetRect);
      rectItem.fill(rectItem); // this.coorsFillRect(targetRect.x, targetRect.y, targetRect.w, targetRect.h, rectItem);

      this._moveUpAll();
    }
  }, {
    key: "_moveDown",
    value: function _moveDown(id, rows) {
      var rectItem = this.coorItemsMap[id];
      rectItem.fill(null);
      var belowItems = this.coorsGetFirstItemForColsInRect({
        x: rectItem.x,
        y: rectItem.y + rectItem.h,
        w: rectItem.w,
        h: rectItem.h + rows
      });
      var targetBottomLine = {
        x: rectItem.x,
        y: rectItem.y + rectItem.h + rows,
        w: rectItem.w
      };
      forEach(belowItems, function (item) {
        item.moveDown(targetBottomLine.y - item.y);
      });
      rectItem.setPos({
        y: rectItem.y + rows
      });
      rectItem.fill(rectItem);
    }
  }, {
    key: "coorsGetFirstItemForColsInRect",
    value: function coorsGetFirstItemForColsInRect(rect) {
      var x = rect.x,
          y = rect.y,
          w = rect.w,
          h = rect.h;
      var itemsList = [];
      var mapList = [];
      var row, cell;

      for (var i = y; i < y + h; i++) {
        row = this.coors[i] || [];

        for (var j = x; j < x + w; j++) {
          cell = row[j];

          if (!isNil(cell) && !mapList[j] && this.checkLineIsLegal(cell, mapList)) {
            mapList[j] = cell;

            if (!~itemsList.indexOf(cell)) {
              itemsList.push(cell);
            }
          }
        }

        if (itemsList.length >= w) break;
      }

      return itemsList;
    }
  }, {
    key: "checkLineIsLegal",
    value: function checkLineIsLegal(cell, line) {
      for (var i = cell.x; i < cell.x + cell.w; i++) {
        if (!isNil(line[i]) && cell !== line[i]) {
          return false;
        }
      }

      return true;
    }
  }, {
    key: "getEmptyRowsBeforeLine",
    value: function getEmptyRowsBeforeLine(x, y, w) {
      if (y === 0) return 0;
      var count = 0;
      var row, cell;

      for (var rowNum = y - 1; rowNum >= 0; rowNum--) {
        row = this.coors[rowNum] || [];

        for (var colNum = x; colNum < x + w; colNum++) {
          cell = row[colNum];

          if (!isNil(cell)) {
            return count;
          }
        }

        count++;
      }

      return count;
    }
  }, {
    key: "_moveUpAll",
    value: function _moveUpAll() {
      var me = this;
      forEach(this.coors, function (row) {
        forEach(row, function (cell) {
          if (!cell || cell.y === 0) return;
          var canUpRows = me.getEmptyRowsBeforeLine(cell.x, cell.y, cell.w);
          cell.fill(null);
          cell.setPos({
            y: cell.y - canUpRows
          });
          cell.fill(cell);
        });
      });
    }
  }, {
    key: "clear",
    value: function clear() {
      this.coors = [];
      this.coorItemsMap = {};
    }
  }, {
    key: "batchAddItem",
    value: function batchAddItem(itemList) {
      var me = this;
      forEach(itemList, function (item) {
        me.add(item);
      });
    }
  }, {
    key: "getAllItems",
    value: function getAllItems() {
      var list = [];
      var itemMap = this.coorItemsMap;
      forEach(Object.keys(itemMap), function (key) {
        list.push(itemMap[key].rawInfo);
      });
      return list;
    }
  }, {
    key: "remove",
    value: function remove(id) {
      var rectItem = this.coorItemsMap[id];

      if (rectItem) {
        rectItem.fill(null);
        delete this.coorItemsMap[id];

        this._moveUpAll();
      }

      return rectItem;
    }
  }, {
    key: "replace",
    value: function replace(id, info) {
      var rectItem = this.coorItemsMap[id];

      if (rectItem && rectItem.x === info.x && rectItem.y === info.y && rectItem.w === info.w && rectItem.h === info.h) {
        rectItem.fill(null);
        delete this.coorItemsMap[id];
        var newRectItem = new utils_rect(info, this);
        newRectItem.fill(newRectItem);
        this.coorItemsMap[newRectItem.id] = newRectItem;
        return newRectItem;
      }

      return null;
    }
  }, {
    key: "getItemById",
    value: function getItemById(id) {
      return this.coorItemsMap[id];
    }
  }]);

  return Coordinate;
}();

/* harmony default export */ var coordinate = (coordinate_Coordinate);
// CONCATENATED MODULE: ./src/utils/coordinate.test.js
function autoMove(that, layout) {
  // that.coors.moveItemTo(layout[6], {
  //     x: layout[6].x,
  //     y: layout[6].y - 1
  // })
  // for(let i = 4; i > 0; i--){
  //     that.coors.moveItemTo(layout[3], {
  //         x: layout[3].x - 1,
  //         y: layout[3].y
  //     })
  // }
  // for(let i = 4; i > 0; i--){
  //     that.coors.moveItemTo(layout[3], {
  //         x: layout[3].x + 1,
  //         y: layout[3].y
  //     })
  // }
  // that.coors.moveItemTo(layout[0], {
  //     x: layout[0].x + 1,
  //     y: layout[0].y
  // })
  // that.coors.moveItemTo(layout[0], {
  //     x: layout[0].x + 1,
  //     y: layout[0].y
  // })
  // that.coors.moveItemTo(layout[2], {
  //     x: layout[2].x - 1,
  //     y: layout[2].y
  // })
  // for(let i = 4; i > 0; i--){
  //     that.coors.moveItemTo(layout[3], {
  //         x: layout[3].x - 1,
  //         y: layout[3].y
  //     })
  // }
  // that.coors.moveItemTo(layout[3], {
  //     x: layout[3].x,
  //     y: layout[3].y + 1
  // })
  that.coors.moveItemTo(layout[6], {
    x: 2,
    y: 1
  });
}
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"6ef977f9-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/Widget.render.vue?vue&type=template&id=67aab659&
var Widget_rendervue_type_template_id_67aab659_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div')}
var Widget_rendervue_type_template_id_67aab659_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/Widget.render.vue?vue&type=template&id=67aab659&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/Widget.render.vue?vue&type=script&lang=js&
//
//
//
//
/* harmony default export */ var Widget_rendervue_type_script_lang_js_ = ({
  props: ['altCardProps']
});
// CONCATENATED MODULE: ./src/components/Widget.render.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_Widget_rendervue_type_script_lang_js_ = (Widget_rendervue_type_script_lang_js_); 
// CONCATENATED MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file (except for modules).
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

function normalizeComponent (
  scriptExports,
  render,
  staticRenderFns,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier, /* server only */
  shadowMode /* vue-cli only */
) {
  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (render) {
    options.render = render
    options.staticRenderFns = staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = 'data-v-' + scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = shadowMode
      ? function () { injectStyles.call(this, this.$root.$options.shadowRoot) }
      : injectStyles
  }

  if (hook) {
    if (options.functional) {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functioal component in vue file
      var originalRender = options.render
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return originalRender(h, context)
      }
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    }
  }

  return {
    exports: scriptExports,
    options: options
  }
}

// CONCATENATED MODULE: ./src/components/Widget.render.vue





/* normalize component */

var component = normalizeComponent(
  components_Widget_rendervue_type_script_lang_js_,
  Widget_rendervue_type_template_id_67aab659_render,
  Widget_rendervue_type_template_id_67aab659_staticRenderFns,
  false,
  null,
  null,
  null
  
)

component.options.__file = "Widget.render.vue"
/* harmony default export */ var Widget_render = (component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/Widget.template.vue?vue&type=script&lang=js&
/* harmony default export */ var Widget_templatevue_type_script_lang_js_ = ({
  props: ['altCardProps'],
  template: '<div></div>'
});
// CONCATENATED MODULE: ./src/components/Widget.template.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_Widget_templatevue_type_script_lang_js_ = (Widget_templatevue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/components/Widget.template.vue
var Widget_template_render, Widget_template_staticRenderFns




/* normalize component */

var Widget_template_component = normalizeComponent(
  components_Widget_templatevue_type_script_lang_js_,
  Widget_template_render,
  Widget_template_staticRenderFns,
  false,
  null,
  null,
  null
  
)

Widget_template_component.options.__file = "Widget.template.vue"
/* harmony default export */ var Widget_template = (Widget_template_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/Widget.vuecomponent.vue?vue&type=script&lang=js&
/* harmony default export */ var Widget_vuecomponentvue_type_script_lang_js_ = ({
  props: ['altCardProps']
});
// CONCATENATED MODULE: ./src/components/Widget.vuecomponent.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_Widget_vuecomponentvue_type_script_lang_js_ = (Widget_vuecomponentvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/components/Widget.vuecomponent.vue
var Widget_vuecomponent_render, Widget_vuecomponent_staticRenderFns




/* normalize component */

var Widget_vuecomponent_component = normalizeComponent(
  components_Widget_vuecomponentvue_type_script_lang_js_,
  Widget_vuecomponent_render,
  Widget_vuecomponent_staticRenderFns,
  false,
  null,
  null,
  null
  
)

Widget_vuecomponent_component.options.__file = "Widget.vuecomponent.vue"
/* harmony default export */ var Widget_vuecomponent = (Widget_vuecomponent_component.exports);
// CONCATENATED MODULE: ./src/components/props.js

var props = {
  layout: {
    type: Array,
    default: function _default() {
      return [];
    }
  },
  isDraggable: {
    // 是否可以拖拽
    type: Boolean,
    default: true
  },
  isResizable: {
    // 是否可以调整大小
    type: Boolean,
    default: true
  },
  rowHeight: {
    // 每行高度
    type: Number,
    default: 150,
    validator: function validator(value) {
      return !isNaN(value) && value > 0;
    }
  },
  maxRows: {
    // 最大
    type: Number,
    default: Infinity
  },
  margin: {
    type: Array,
    default: function _default() {
      return [10, 10];
    }
  },
  // 元素的右边距和下边距
  colNum: {
    // 列数
    type: Number,
    default: 12
  },
  backgroundColor: {
    // 背景颜色
    type: String,
    default: 'rgba(200,200,200,1)'
  },
  gridItemClass: {
    // 每一个卡片的class
    type: String,
    default: ''
  },
  closeHandlerClass: {
    // 关闭按钮的class
    type: String,
    default: ''
  },
  resizeHandlerClass: {
    // 设置大小按钮的class
    type: String,
    default: 'alt-g-i-r-h-default-style'
  },
  placeholderClass: {
    // 拖拽时 placeholder 的class
    type: String,
    default: ''
  },
  isShowOriginCloseBtn: {
    type: Boolean,
    default: true
  }
};
/* harmony default export */ var components_props = (props);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/grid.vue?vue&type=script&lang=js&







//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
// import elementResizeDetectorMaker from 'element-resize-detector'








var Vue = getVue();
/* harmony default export */ var gridvue_type_script_lang_js_ = ({
  name: 'alt-grid-layout',
  addWidgetType: function addWidgetType() {
    var args0 = arguments[0];
    var type = getVariType(args0);

    if (type === 'string') {
      this._addWidgetType.apply(this, arguments);
    } else if (type === 'object') {
      for (var key in args0) {
        args0.hasOwnProperty(key) && this._addWidgetType(key, args0[key]);
      }
    }
  },
  // 添加组件类型处理函数
  _addWidgetType: function _addWidgetType(type, widget) {
    var parentWidget = widget.template ? Widget_template : Widget_render;

    if (widget.super == Vue) {
      this.components[type] = widget.extend(Widget_vuecomponent);
      return;
    }

    this.components[type] = _objectSpread({}, widget, {
      extends: parentWidget
    });
  },
  props: components_props,
  data: function data() {
    return {
      innerLayout: [],
      // 布局源数据
      defVal: {
        minH: 1,
        // 默认每个卡片的最小高度
        minW: 1,
        // 默认每个卡片的最小宽度
        maxH: Infinity,
        // 默认每个卡片的最大高度
        maxW: Infinity,
        // 默认每个卡片的最大宽度
        isDraggable: true,
        // 默认每个卡片是否支持拖拽
        isResizable: true,
        // 默认每个卡片是否支持设置大小
        isShowOriginCloseBtn: true,
        // 是否显示默认的关闭按钮
        dragIgnoreFrom: 'a, input, button, textarea'
      },
      containerHeight: 0,
      // 容器高度
      cols: [],
      cacheComputed: {},
      placeholder: null,
      // 拖拽的placeholder
      preOperator: 0,
      // 防止点击事件是触发拖动样式，先赋值给preOperator，如果用户继续执行move，则将preOperator赋值给operator
      operator: 0,
      // 当前操作状态，0 - 无操作，1 - 拖拽， 2 - 缩放
      operatedItem: null,
      // 当前被操作的元素的状态
      containerWidth: 0,
      boxWatchHandler: null,
      coors: null,
      timer: null,
      animation: null,
      animationHandler: null,
      eventHandler: {
        mousedown: null,
        mousemove: null,
        mouseup: null
      }
    };
  },
  mounted: function mounted() {
    var _this = this;

    this.initCols();
    this.boxWatchHandler = new watch_box_size(this.$el, function () {
      _this.initCols();
    });

    if (this.isDraggable || this.isResizable) {
      this.bindEvents();
    }

    this.setLayout(this.layout);
  },
  destroyed: function destroyed() {
    this.boxWatchHandler.destroy(); // this.erd.uninstall(this.$el);

    this.unbindEvents();
  },
  watch: {
    layout: function layout(val) {
      this.setLayout(val);
    },
    rowHeight: function rowHeight() {
      this.reRenderStyle({
        triggerEventEnd: true,
        onlyReRender: true
      });
    },
    colNum: function colNum(val) {
      // console.log('change col number');
      if (this.coors) {
        this.coors.setMaxWidth = parseInt(val);
      }

      this.initCols();
    },
    cols: function cols() {
      // console.log('cols change');
      this.cacheComputed = {};
      if (this.operator) return;
      this.reRenderStyle({
        triggerEventEnd: true,
        onlyReRender: true
      });
    },
    margin: function margin() {
      this.cacheComputed = {};
      this.reRenderStyle();
    },
    backgroundColor: function backgroundColor() {
      // this.reRenderStyle();
      this.forceReRenderStyle();
    }
  },
  computed: {
    containerStyle: function containerStyle() {
      return {
        height: this.containerHeight + 'px'
      };
    },
    operatorClass: function operatorClass() {
      if (!this.operator) return '';

      if (this.operator === 1) {
        return 'alt-grid-container-operating alt-move';
      } else if (this.operator === 2) {
        return 'alt-grid-container-operating alt-resize';
      }

      return '';
    }
  },
  methods: {
    bindEvents: function bindEvents() {
      this.eventHandler.mousedown = this.mousedown.bind(this);
      this.eventHandler.mousemove = this.mousemove.bind(this);
      this.eventHandler.mouseup = this.mouseup.bind(this);
      this.$el.addEventListener('mousedown', this.eventHandler.mousedown);
      document.addEventListener('mousemove', this.eventHandler.mousemove);
      document.addEventListener('mouseup', this.eventHandler.mouseup);
    },
    unbindEvents: function unbindEvents() {
      this.$el.removeEventListener('mousedown', this.eventHandler.mousedown);
      document.removeEventListener('mousemove', this.eventHandler.mousemove);
      document.removeEventListener('mouseup', this.eventHandler.mouseup);
    },
    canDragClass: function canDragClass(isDraggable) {
      return util_getFirstSetValue(isDraggable, this.isDraggable, true) ? 'can-drag' : '';
    },
    forceReRenderStyle: function forceReRenderStyle() {
      var _this2 = this;

      if (this.timer) clearTimeout(this.timer);
      this.timer = setTimeout(function () {
        _this2.innerLayout.forEach(function (item) {
          var style = _this2.getCardStyle(item);

          _this2.$set(item, '_alt_style', style); // item.style = style;

        });
      }, 10);
    },
    reRenderStyle: function reRenderStyle() {
      var _this3 = this;

      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var ignoreId = options.ignoreId;
      var triggerEventEnd = options.triggerEventEnd;
      var onlyReRender = options.onlyReRender;
      if (this.timer) clearTimeout(this.timer);
      this.timer = setTimeout(function () {
        _this3.containerHeight = 0;

        _this3.innerLayout.forEach(function (item, index) {
          if (item._id === ignoreId) return;
          var card = _this3.$refs.cards[index];
          var oldStyle = {
            style: card.style,
            width: card.style.width,
            height: card.style.height,
            transform: card.style.transform
          };

          if (oldStyle.transform) {
            oldStyle.transform = oldStyle.transform.replace(/\s/g, '');
          }

          var styleRaw = _this3.getCardStyle(item, true);

          _this3.$set(item, '_alt_style', styleRaw.style); // item.style = style;


          var status = _this3.getCardRectChangeStatus(oldStyle, styleRaw, ['width', 'height', 'transform'], {
            triggerEventEnd: triggerEventEnd
          });

          if (status === 'none') return;

          _this3.dispatchEvent(item._id, status, {
            w: item.w,
            h: item.h,
            x: item.x,
            y: item.y,
            layout: _this3.innerLayout,
            onlyReRender: onlyReRender
          }); // console.log('create Style:', styleRaw, oldStyle, index);

        });
      }, 10);
    },
    getCardRectChangeStatus: function getCardRectChangeStatus(arg1, arg2, range) {
      var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
      var triggerEventEnd = options.triggerEventEnd;
      var keys = range || Object.keys(arg1);

      for (var i = 0, l = keys.length; i < l; i++) {
        var key = keys[i];

        if (arg1[key] !== arg2[key]) {
          if (key === 'width' || key === 'height') {
            if (triggerEventEnd) {
              return 'resized';
            }

            return 'resize';
          }

          if (key === 'transform') {
            if (triggerEventEnd) {
              return 'moved';
            }

            return 'move';
          }
        }
      }

      return 'none';
    },
    dispatchEvent: function dispatchEvent(dragId, type, pos) {
      var _this4 = this;

      this.$nextTick(function () {
        _this4.$nextTick(function () {
          _this4.$refs[dragId] && _this4.$refs[dragId][0].$emit(type, pos);
        });
      });
    },
    getFirstSetValue: function getFirstSetValue() {
      return util_getFirstSetValue.apply(void 0, arguments);
    },
    getPropsForInject: function getPropsForInject(index, item) {
      return {
        id: item._id,
        card: item,
        layout: this.innerLayout,
        close: this.closeWidget.bind(this, item._id)
      };
    },
    // 初始化每个列宽
    initCols: function initCols() {
      // // // console.log('init cols');
      var containerWidth = this.$el.clientWidth;

      if (this.colNum === this.cols.length && this.containerWidth && this.containerWidth === containerWidth) {
        return;
      }

      this.containerWidth = containerWidth;
      var colNum = this.colNum;
      var cols = []; // let containerWidth = this.$el.clientWidth;

      var remainder = containerWidth % colNum; // 余数

      var quotient = Math.floor(containerWidth / colNum); // 商数

      for (var i = 0; i < colNum; i++) {
        if (remainder) {
          cols[i] = quotient + 1;
          remainder--;
        } else {
          cols[i] = quotient;
        }
      }

      this.cols = cols;
    },
    // 设置布局layout数组
    setLayout: function setLayout(layout) {
      var _this5 = this;

      // this.layout = deepCopy(layout);
      // this.layout = layout;
      // // console.log(deepCopy)
      if (!this.coors) {
        this.coors = new coordinate({
          maxWidth: this.colNum
        });
      }

      this.coors.clear();
      this.coors.batchAddItem(layout);
      var layoutOverCalc = this.coors.getAllItems();
      layoutOverCalc.forEach(function (item) {
        var style = _this5.getCardStyle(item);

        _this5.$set(item, '_alt_style', style); // item.style = style;

      });
      this.innerLayout = layoutOverCalc;

      if (/_env=altdev/.test(window.location.search)) {
        autoMove(this, this.innerLayout);
      }
    },
    // 设置总容器高度
    setContainerHeight: function setContainerHeight(y, h) {
      var containerHeight = this.containerHeight;
      var height = y + h;

      if (height > containerHeight) {
        this.containerHeight = height;
      }
    },
    // 获取卡片大小和位移
    getCardStyle: function getCardStyle(item, raw) {
      if (!item) return {};
      var x = this.computeColsWidth(0, item.x) + 'px';
      var w = this.getCardWidth(item.x, item.x + item.w) + 'px';
      var y = item.y * this.rowHeight + 'px';
      var h = item.h * this.rowHeight - this.margin[1] + 'px';
      this.setContainerHeight(y, h);
      var transform = "translate3d(".concat(x, ",").concat(y, ",0px)");
      var style = "transform:".concat(transform, ";width:").concat(w, ";height:").concat(h, ";background-color:").concat(this.backgroundColor, ";");

      if (raw) {
        return {
          style: style,
          x: x,
          y: y,
          width: w,
          height: h,
          transform: transform
        };
      }

      return style; // return {
      //     transform: `translate(${x}px,${y}px)`,
      //     width: w + 'px',
      //     height: h + 'px'
      // }
    },
    getCardStyleForRealTime: function getCardStyleForRealTime(item) {
      if (!item) return;
      var w = item.w;
      var x = item.x;

      if (x < 0) {
        x = 0;
      } else if (x + w > this.containerWidth) {
        x = this.containerWidth - w;
      }

      var y = item.y;

      if (y < 0) {
        y = 0;
      }

      var transform = "transform:translate3d(".concat(x, "px,").concat(y, "px,0);");
      var style = "".concat(transform, "width:").concat(w, "px;height:").concat(item.h, "px;background-color:").concat(this.backgroundColor, ";z-index:1;");
      return style;
    },
    getCardStyleForPlaceholder: function getCardStyleForPlaceholder(item) {
      if (!item) return {};
      var x = this.computeColsWidth(0, item.x);
      var w = this.getCardWidth(item.x, item.x + item.w);
      var y = item.y * this.rowHeight;
      var h = item.h * this.rowHeight - this.margin[1];
      this.setContainerHeight(y, h);
      var transform = "transform:translate3d(".concat(x, "px,").concat(y, "px,0);");
      var style = "".concat(transform, "width:").concat(w, "px;height:").concat(h, "px;");
      return style;
    },
    // 计算卡片的宽度
    getCardWidth: function getCardWidth(start, end) {
      var width = this.computeColsWidth(start, end);

      if (end !== this.cols.length) {
        width -= this.margin[0];
      }

      return width;
    },
    // 计算某几列的宽度
    computeColsWidth: function computeColsWidth(start, end) {
      var key = start + ';' + end;
      if (this.cacheComputed[key]) return this.cacheComputed[key];
      var cols = this.cols;
      var width = 0;

      for (var i = start; i < end; i++) {
        width += cols[i];
      }

      this.cacheComputed[key] = width;
      return width;
    },
    computeRowsHeight: function computeRowsHeight(start, end) {
      return (end - start) * this.rowHeight;
    },
    mousedown: function mousedown(event) {
      this.mousedownTimeStamp = new Date().getTime();
      var evt = normalizeEvent(event);
      var srcElement = evt.srcElement;
      var target = evt.target;
      var targetCard = findParentThoughEvtPath(evt.path, 'alt-grid-item', 'alt-grid-container');
      if (!targetCard) return;
      var dragId = this.getDragId(targetCard);
      var node = this.getNodeByDragId(dragId);

      if (hasClass(target, this.resizeHandlerClass)) {
        if (!util_getFirstSetValue(node.isResizable, this.isResizable, this.defVal.isResizable)) {
          return;
        }

        this.preOperator = 2; // resize
      }

      if (targetCard && !this.preOperator) {
        if (!util_getFirstSetValue(node.isDraggable, this.isDraggable, this.defVal.isDraggable)) {
          return;
        }

        var dragIgnoreFrom = util_getFirstSetValue(node.dragIgnoreFrom, this.defVal.dragIgnoreFrom);

        if (isDragIgnoreFrom(target, targetCard, dragIgnoreFrom)) return;
        this.preOperator = 1; // 拖拽
      }

      if (!targetCard && !this.preOperator) return; // if(!hasClass(target, 'alt-grid-item')) return;

      var targetCardStyle = targetCard.style;
      var translate = targetCardStyle.transform.match(/\(([-.\d]*)px, ([-.\d]*)px/);
      this.operatedItem = {
        srcElement: srcElement,
        el: targetCard,
        node: node,
        dragId: dragId,
        linkEmit: this.$refs[dragId] ? this.$refs[dragId][0].$emit : function () {},
        startX: evt.clientX,
        startY: evt.clientY,
        cacheStyle: {
          x: parseInt(translate[1]),
          y: parseInt(translate[2]),
          w: parseInt(targetCardStyle.width.match(/\d+/)[0]),
          h: parseInt(targetCardStyle.height.match(/\d+/)[0])
        }
      };
      this.placeholder = {
        _id: '__placeHolder__',
        x: node.x,
        y: node.y,
        w: node.w,
        h: node.h
      };
      this.coors.replace(node._id, this.placeholder); // this.coors.remove(node._id);
      // this.coors.add(this.placeholder);
      // console.log('down', evt, this.operatedItem);
      // if(hasClass(target, this.resizeHandlerClass)){
      //     this.operator = 2;
      // } else {
      //     this.operator = 1;
      // }
    },
    mousemove: function mousemove(evt) {
      if (!this.preOperator) return;
      this.operator = this.preOperator; // console.log('mouse move');

      this.operatedItem.el.classList.add('operated-item');
      var ex = evt.clientX;
      var ey = evt.clientY;
      var sx = this.operatedItem.startX;
      var sy = this.operatedItem.startY;

      if (this.operator === 1) {
        this.dragMove(this.operatedItem, sx, sy, ex, ey);
      } else if (this.operator === 2) {
        this.resizeMove(this.operatedItem, sx, sy, ex, ey);
      }
    },
    mouseup: function mouseup() {
      var time = new Date().getTime();

      if (time - this.mousedownTimeStamp < 10) {
        this.operatedItem && this.operatedItem.srcElement && this.operatedItem.srcElement.click();
      }

      var operatedItem = this.operatedItem;

      if (operatedItem) {
        this.applyChange();
        this.$set(operatedItem.node, '_alt_style', this.getCardStyle(operatedItem.node)); // item.node[] = this.getCardStyle(item.node);

        this.coors.replace(this.placeholder._id, operatedItem.node); // this.coors.remove(this.placeholder._id);
        // this.coors.add(operatedItem.node);
      }

      this.clearDragEnv();
      this.$emit('update:layout', this.innerLayout);
    },
    applyChange: function applyChange() {
      var x = this.placeholder.x;
      var y = this.placeholder.y;
      var w = this.placeholder.w;
      var h = this.placeholder.h;
      var dragId = this.operatedItem.dragId;
      var node = this.operatedItem.node;

      if (this.operator === 1) {
        if (node.x === x && node.y === y) return;
        node.x = x;
        node.y = y;
        this.dispatchEvent(dragId, 'moved', {
          x: x,
          y: y,
          w: node.w,
          h: node.h,
          layout: this.innerLayout
        });
      } else if (this.operator === 2) {
        if (node.w === w && node.h === h) return;
        node.w = this.placeholder.w;
        node.h = this.placeholder.h;
        node.x = this.placeholder.x;
        node.y = this.placeholder.y;
        this.dispatchEvent(dragId, 'resized', {
          x: x,
          y: y,
          w: w,
          h: h,
          layout: this.innerLayout
        });
      }
    },
    clearDragEnv: function clearDragEnv() {
      this.preOperator = 0;
      this.operator = 0;
      this.operatedItem = null;
      this.placeholder = null;
    },
    getNodeByDragId: function getNodeByDragId(dragId) {
      var index = getIndexOfArrayByAttr(this.innerLayout, dragId, '_id');
      if (index === -1) return null;
      return this.innerLayout[index];
    },
    getDragId: function getDragId(target) {
      return target.getAttribute('dg-id');
    },
    dragMove: function dragMove(operatedItem, sx, sy, ex, ey) {
      // console.log('drag move');
      var placeholder = this.placeholder;
      var cacheStyle = operatedItem.cacheStyle;
      var dx = ex - sx;
      var dy = ey - sy;
      var startCol = dx > 0 ? operatedItem.node.x + operatedItem.node.w : operatedItem.node.x;
      var stepX = this.getMoveCols(dx, startCol);
      var stepY = this.getMoveRows(dy, operatedItem.node.y); // console.log('calc over step');

      var targetX = operatedItem.node.x + stepX;
      var targetY = operatedItem.node.y + stepY;
      this.coors.getItemById(placeholder._id).moveTo(targetX, targetY);
      var x = cacheStyle.x + dx;
      var y = cacheStyle.y + dy;
      operatedItem.node['_alt_style'] = this.getCardStyleForRealTime({
        x: x,
        y: y,
        w: cacheStyle.w,
        h: cacheStyle.h
      }); // this.coors.moveAllItemUp();

      this.reRenderStyle({
        ignoreId: operatedItem.dragId
      });
      this.dispatchEvent(operatedItem.dragId, 'move', {
        x: this.placeholder.x,
        y: this.placeholder.y,
        w: this.placeholder.w,
        h: this.placeholder.h,
        layout: this.innerLayout
      });
    },
    resizeMove: function resizeMove(operatedItem, sx, sy, ex, ey) {
      var placeholder = this.placeholder;
      var node = operatedItem.node;
      var cacheStyle = operatedItem.cacheStyle;
      var dx = ex - sx;
      var dy = ey - sy;
      var stepX = this.getMoveCols(dx, node.x + node.w);
      var stepY = this.getMoveRows(dy, node.y + node.h);
      var size = this.getItemLegalSize(node, {
        w: node.w + stepX,
        h: node.h + stepY
      });
      this.coors.getItemById(placeholder._id).resizeTo(size.w, size.h);
      var pixiesSize = this.getItemLegalSizeInPixies(node, {
        width: cacheStyle.w + dx,
        height: cacheStyle.h + dy
      });

      if (cacheStyle.x + pixiesSize.width > this.containerWidth) {
        pixiesSize.width = this.containerWidth - cacheStyle.x;
      }

      operatedItem.node['_alt_style'] = this.getCardStyleForRealTime({
        x: cacheStyle.x,
        y: cacheStyle.y,
        w: pixiesSize.width,
        h: pixiesSize.height
      });
      this.reRenderStyle({
        ignoreId: operatedItem.dragId
      });
      this.dispatchEvent(operatedItem.dragId, 'resize', {
        x: this.placeholder.x,
        y: this.placeholder.y,
        w: this.placeholder.w,
        h: this.placeholder.h,
        layout: this.innerLayout
      });
    },
    getItemLegalSizeInPixies: function getItemLegalSizeInPixies(node, size) {
      var pixiesLimit = this.getPixiesLimit(node);
      var width = size.width;
      var height = size.height;

      if (width > pixiesLimit.maxWidth) {
        width = pixiesLimit.maxWidth;
      } else if (width < pixiesLimit.minWidth - 10) {
        width = pixiesLimit.minWidth - 10;
      }

      if (height > pixiesLimit.maxHeight) {
        height = pixiesLimit.maxHeight;
      } else if (height < pixiesLimit.minHeight - 10) {
        height = pixiesLimit.minHeight - 10;
      }

      return {
        width: width,
        height: height
      };
    },
    getPixiesLimit: function getPixiesLimit(node) {
      var pixiesLimit = {
        minWidth: 0,
        minHeight: 0,
        maxWidth: Infinity,
        maxHeight: Infinity
      };

      var minW = util_getFirstSetValue(node.minW, this.defVal.minW);

      var minH = util_getFirstSetValue(node.minH, this.defVal.minH);

      if (minW && minW > 0) {
        pixiesLimit.minWidth = this.getCardWidth(node.x, node.x + minW);
      }

      if (minH && minH > 0) {
        pixiesLimit.minHeight = minH * this.rowHeight - this.margin[1];
      }

      if (node.maxW && node.maxW > 0) {
        pixiesLimit.maxWidth = this.getCardWidth(node.x, node.x + node.maxW);
      }

      if (node.maxH && node.maxH > 0) {
        pixiesLimit.maxHeight = node.maxH * this.rowHeight - this.margin[1];
      }

      return pixiesLimit;
    },
    getMoveCols: function getMoveCols(dx, startCol) {
      if (startCol <= 0 && dx < 0) return 0;
      var flag = dx < 0 ? '-' : '+';
      var absDx = Math.abs(dx);
      if (absDx < 15) return 0;
      var i = 0;
      var c = startCol;

      while (absDx > 0) {
        if (flag === '-') {
          c--;
          absDx -= this.cols[c] || 0;
          i++;
          if (c <= 0) break;
        } else {
          c++;
          absDx -= this.cols[c] || 0;
          i++;
          if (c >= this.cols.length) break;
        }
      }

      return parseInt(flag + i);
    },
    getMoveRows: function getMoveRows(dy, startRow) {
      if (startRow <= 0 && dy < 0) return 0;
      var flag = dy < 0 ? '-' : '+';
      var absDy = Math.abs(dy);
      if (absDy < this.rowHeight / 2) return 0;
      var i = 0;
      var row = startRow;

      while (absDy > 0) {
        if (flag === '-') {
          absDy -= this.rowHeight;
          i++;
          row--;
          if (row <= 0) break;
        } else {
          absDy -= this.rowHeight;
          i++;
          row++;
        }
      }

      return parseInt(flag + i);
    },
    addItem: function addItem(item) {
      if (this.coors) {
        var distributeItem = this.coors.add(item);
        var style = this.getCardStyle(distributeItem);
        this.$set(distributeItem.rawInfo, '_alt_style', style);
        this.innerLayout.push(distributeItem.rawInfo);
        this.$emit('update:layout', this.innerLayout);
        return distributeItem.id;
      }
    },
    deleteItem: function deleteItem(id) {
      return this.closeWidget(id);
    },
    getAllItems: function getAllItems() {
      return this.innerLayout;
    },
    getItemLegalSize: function getItemLegalSize(item, size) {
      var minH = util_getFirstSetValue(item.minH, this.defVal.minH);

      var minW = util_getFirstSetValue(item.minW, this.defVal.minW);

      var maxH = util_getFirstSetValue(item.maxH, this.defVal.maxH);

      var maxW = util_getFirstSetValue(item.maxW, this.defVal.maxW);

      var h = size.h;
      var w = size.w;

      if (size.h <= minH) {
        h = minH;
      }

      if (size.h >= maxH) {
        h = maxH;
      }

      if (size.w <= minW) {
        w = minW;
      }

      if (size.w >= maxW) {
        w = maxW;
      }

      return {
        h: h,
        w: w
      };
    },
    closeWidget: function closeWidget(_id) {
      var index = getIndexOfArrayByAttr(this.innerLayout, _id, '_id');
      if (index === -1) return false;
      var item = this.innerLayout[index];
      this.coors.remove(item._id); // this.coors.moveAllItemUp();

      this.innerLayout.splice(index, 1);
      this.reRenderStyle(); // this.reRenderCount++;

      this.clearDragEnv();
      this.$emit('update:layout', this.innerLayout);
    }
  }
});
// CONCATENATED MODULE: ./src/components/grid.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_gridvue_type_script_lang_js_ = (gridvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./src/components/grid.vue?vue&type=style&index=0&lang=css&
var gridvue_type_style_index_0_lang_css_ = __webpack_require__("d812");

// CONCATENATED MODULE: ./src/components/grid.vue






/* normalize component */

var grid_component = normalizeComponent(
  components_gridvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

grid_component.options.__file = "grid.vue"
/* harmony default export */ var components_grid = (grid_component.exports);
// CONCATENATED MODULE: ./src/alt-store/mixin.js
function mixin(Vue) {
  Vue.mixin({
    beforeCreate: altStoreInit
  });

  function altStoreInit() {
    var options = this.$options;

    if (options.altStore) {
      this.$altStore = options.altStore;
    } else if (options.parent && options.parent.$altStore) {
      this.$altStore = options.parent.$altStore;
    }
  }
}
// CONCATENATED MODULE: ./src/alt-store/util.js



function util_forEachValue(obj, fn) {
  Object.keys(obj).forEach(function (key) {
    return fn(obj[key], key);
  });
}
// CONCATENATED MODULE: ./src/alt-store/store.js





var store_Vue;
var store_AltStore =
/*#__PURE__*/
function () {
  function AltStore(options) {
    _classCallCheck(this, AltStore);

    this._mutations = Object.create(null);
    this.initVm(options.state);
    this.initMutations(options.mutations);
  }

  _createClass(AltStore, [{
    key: "commit",
    value: function commit(type, payload) {
      var entry = this._mutations[type];

      if (!entry) {
        console.error('[altStore] unknown commit type.');
        return;
      }

      entry.forEach(function (handler) {
        handler(payload);
      });
    }
  }, {
    key: "getOriginState",
    value: function getOriginState() {
      return this._vm._data.$$state;
    }
  }, {
    key: "initMutations",
    value: function initMutations(mutations) {
      var store = this;
      var state = this.getOriginState();
      util_forEachValue(mutations, function (handler, key) {
        var entry = store._mutations[key] || (store._mutations[key] = []);
        entry.push(function wrapperHandler(payload) {
          handler.call(store, state, payload);
        });
      });
    }
  }, {
    key: "initVm",
    value: function initVm(state) {
      var oldVm = this._vm;
      this._vm = new store_Vue({
        data: {
          $$state: state
        }
      });

      if (oldVm) {
        store_Vue.nextTick(function () {
          return oldVm.$destroy();
        });
      }
    }
  }, {
    key: "state",
    get: function get() {
      return this._vm._data.$$state;
    },
    set: function set(v) {
      console.error('cannot set state directly.');
    }
  }]);

  return AltStore;
}();
function install(_Vue) {
  if (store_Vue && _Vue === store_Vue) {
    if (false) {}

    return;
  }

  store_Vue = _Vue;
  mixin(store_Vue);
}
// CONCATENATED MODULE: ./src/alt-store/index.js

/* harmony default export */ var alt_store = ({
  Store: store_AltStore,
  install: install
});
// CONCATENATED MODULE: ./src/index.js




external_commonjs_vue_commonjs2_vue_root_Vue_default.a.use(alt_store); // Vue.component('AltVueGridLayout', VueGridLayout);

function factory() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var grid = _objectSpread({}, components_grid, {
    components: {}
  });

  if (options.altStore && options.altStore instanceof alt_store.Store) {
    grid.altStore = options.altStore;
  }

  return grid;
} // export default VueGridLayout;


/* harmony default export */ var src = ({
  createGrid: factory,
  grid: components_grid,
  altStore: alt_store
});
// CONCATENATED MODULE: ./node_modules/@vue/cli-service/lib/commands/build/entry-lib.js


/* harmony default export */ var entry_lib = __webpack_exports__["default"] = (src);



/***/ }),

/***/ "fdef":
/***/ (function(module, exports) {

module.exports = '\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003' +
  '\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';


/***/ })

/******/ })["default"];
});
//# sourceMappingURL=alt-vue-grid-layout.umd.js.map