/*!
 * 
 *          Copyright© 1999 - 2020 Geoway Software Co.Ltd
 *          license: 
 *          version: v1.0.0
 *         
 */
/******/ (function (modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__ (moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if (installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
      /******/
    }
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
      /******/
    };
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
    /******/
  }
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function (exports, name, getter) {
/******/ 		if (!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
      /******/
    }
    /******/
  };
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function (exports) {
/******/ 		if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
      /******/
    }
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
    /******/
  };
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function (value, mode) {
/******/ 		if (mode & 1) value = __webpack_require__(value);
/******/ 		if (mode & 8) return value;
/******/ 		if ((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if (mode & 2 && typeof value != 'string') for (var key in value) __webpack_require__.d(ns, key, function (key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
    /******/
  };
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function (module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault () { return module['default']; } :
/******/ 			function getModuleExports () { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
    /******/
  };
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function (object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 39);
  /******/
})
/************************************************************************/
/******/([
/* 0 */
/***/ (function (module, exports) {

    module.exports = L;

    /***/
  }),
/* 1 */
/***/ (function (module, __webpack_exports__, __webpack_require__) {

    "use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function () { return Deferred; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function () { return getJSON; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function () { return getParamJSON; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function () { return getBufferData; });
    var jx = __webpack_require__(41);

    var Deferred = function Deferred () {
      this.promise = new Promise(function (resolve, reject) {
        this.resolve = resolve;
        this.reject = reject;
      }.bind(this));
      this.then = this.promise.then.bind(this.promise);
      this["catch"] = this.promise["catch"].bind(this.promise);
    };

    var getJSON = function getJSON (param) {
      if (!param.type) {
        param.type = 'GET';
      }

      if (!param.dataType) {
        param.dataType = 'json';
      }

      return new Promise(function (resolve, reject) {
        sendAjax(resolve, reject, param);
      });
    };

    var getBufferData = function getBufferData (param) {
      if (!param.type) {
        param.type = 'GET';
      }

      if (!param.dataType) {
        param.dataType = 'arraybuffer';
      }

      var xhr;
      var promise = new Promise(function (resolve, reject) {
        xhr = sendAjax(resolve, reject, param, true);
      });
      promise.xhr = xhr;
      return promise;
    };

    var sendAjax = function sendAjax (resolve, reject, param, returnParam) {
      var UType = param.type.toUpperCase();
      var rq;

      if (param.dataType == "arraybuffer") {
        rq = jx.get(param.url, true);
      } else {
        if (UType == 'GET') {
          rq = jx.get(param.url);
        }

        if (UType == 'POST') {
          rq = jx.post(param.url, param.data);
        }
      }

      var timeout = 30000;
      var time = false; //是否超时

      var timer = setTimeout(function () {
        if (rq.request.status >= 300 || rq.request.status < 200) {
          time = true;
          rq.request.abort(); //请求中止

          console.warn('timeout: ' + param.url);
          reject({
            param: param,
            data: 'getParamJSON: ' + param.url + ' timeout '
          });
        }
      }, timeout);
      rq.success(function (results) {
        if (time) {
          clearTimeout(timer);
          return; //忽略中止请求
        }

        if (param.dataType == 'json' && typeof results == 'string') {
          results = JSON.parse(results);
        }

        if (returnParam) {
          resolve({
            param: param,
            data: results
          });
        } else {
          resolve(results);
        }
      });
      rq.error(function (results, request) {
        if (time) {
          clearTimeout(timer);
          return; //终止请求报错
        }

        reject({
          param: param,
          data: 'getParamJSON: ' + param.url + ' failed with status: ' + request.status + ''
        });
      });
      return rq.request;
    };

    var getParamJSON = function getParamJSON (param) {
      if (!param.type) {
        param.type = 'GET';
      }

      if (!param.dataType) {
        param.dataType = 'json';
      }

      var xhr;
      var promise = new Promise(function (resolve, reject) {
        xhr = sendAjax(resolve, reject, param, true);
      });
      promise.xhr = xhr;
      return promise;
    };



    /***/
  }),
/* 2 */
/***/ (function (module, __webpack_exports__, __webpack_require__) {

    "use strict";
    /*
     * @Author: your name
     * @Date: 2020-10-19 09:50:54
     * @LastEditTime: 2021-05-14 09:42:09
     * @LastEditors: Please set LastEditors
     * @Description: In User Settings Edit
     * @FilePath: \leaflet_sdk_v4\src\ext\Version.js
     */
    var Version = 'jssdk_bate@ leaflet 3.0.12';
/* harmony default export */ __webpack_exports__["a"] = (Version);

    /***/
  }),
/* 3 */
/***/ (function (module, __webpack_exports__, __webpack_require__) {

    "use strict";
    function _classCallCheck (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    function _defineProperties (target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

    function _createClass (Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

    var Font = null; //import fonts from "./../../../../src/utils/font/Font";

    var AvoidUtil = /*#__PURE__*/function () {
      function AvoidUtil () {
        _classCallCheck(this, AvoidUtil);
      }

      _createClass(AvoidUtil, null, [{
        key: "getRealLength",
        value: function getRealLength (str) {
          var length = str.length;
          var realLength = 0;

          for (var i = 0; i < length; i++) {
            var charCode = str.charCodeAt(i);

            if (charCode >= 0 && charCode <= 128) {
              realLength += 0.5;
            } else {
              realLength += 1;
            }
          }

          return realLength;
        }
        /**
         * 判断文本是否不为空
         *  Parameters :
         *  label - 要显示的文本
         *
         */

      }, {
        key: "isNotNull",
        value: function isNotNull (label) {
          if (!label && label != 0) {
            return false;
          } //如果是字符串


          if (typeof label == 'string') {
            label = label.toLowerCase();

            if (label == '' || label == 'undefined' || label == 'null') {
              return false;
            }
          }

          return true;
        }
        /**
         * 统一转为微软雅黑
         */

      }, {
        key: "formatFont",
        value: function formatFont (font, ratio, isChangeFont) {
          //console.log(font)
          var fontArr = font;

          if (isChangeFont) {
            if (Font == null) {
              Font = null;
            }

            var farr = font.split(' '); // farr[farr.length -1] = 'Comic Sans';

            if (farr.length - 1 != 0) {
              if ("italic" == farr[0].toLowerCase()) {
                if (farr[farr.length - 1] != "simhei") {
                  farr[farr.length - 1] = Font.getDefaultFont() + "_italic";
                }
              } else {
                farr[farr.length - 1] = Font.getDefaultFont();
              }
            } else {
              farr[farr.length - 1] = Font.getDefaultFont();
            }

            fontArr = farr.join(' ');
          }

          return fontArr.replace(/(\d+\.?\d*)(px|em|rem|pt)/g, function (w, m, u) {
            // if (m < 12) {
            //     m = m * ratio;
            // } else {
            // }
            m = Math.round(m) * ratio;
            return m + u;
          });
        }
      }, {
        key: "formatLabel",

        /**
         * 对注记进行去空格等处理
         */
        value: function formatLabel (label) {
          if (label && label.length > 0) {
            //去掉不可见字符
            label = label.replace(/([\x00-\x1f\x7f])/g, '');
            label = label.replace(/(\s*$)/g, "");
            label = label.replace(/<br\/>/g, "");
          }

          return label;
        } //获取两点连线与y轴的夹角

      }, {
        key: "getAngle",
        value: function getAngle (p1, p2) {
          if (p2[0] - p1[0] == 0) {
            if (p2[1] > p1[0]) {
              return 90;
            } else {
              return -90;
            }
          }

          var k = (p2[1] - p1[1]) / (p2[0] - p1[0]);
          var angle = 360 * Math.atan(k) / (2 * Math.PI);
          return angle;
        }
      }]);

      return AvoidUtil;
    }();

/* harmony default export */ __webpack_exports__["a"] = (AvoidUtil);

    /***/
  }),
/* 4 */
/***/ (function (module, __webpack_exports__, __webpack_require__) {

    "use strict";
    function _classCallCheck (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    function _defineProperties (target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

    function _createClass (Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

    var Util = /*#__PURE__*/function () {
      function Util () {
        _classCallCheck(this, Util);
      }

      _createClass(Util, null, [{
        key: "measureText",
        value: function measureText (label, font, ctx) {
          return ctx.measureText(label).width;
        } //要素排序.

      }, {
        key: "sort",
        value: function sort (features, styleMap, hasImportant) {
          if (features.length > 0) {
            //从大到少排序
            return features.sort(function (a, b) {
              if (hasImportant) {
                var aStyle = styleMap[a.styleId] ? styleMap[a.styleId] : a.style;
                var bStyle = styleMap[b.styleId] ? styleMap[b.styleId] : b.style;

                if (aStyle.isImportant && !bStyle.isImportant) {
                  return -1;
                }

                if (bStyle.isImportant && !aStyle.isImportant) {
                  return 1;
                }
              }

              var aAttr = a.weight;
              var bAttr = b.weight; // let aId = a.attributeId;
              // let bId = b.attributeId;

              var aId = a.primaryId;
              var bId = b.primaryId;
              var aSort = a._sort;
              var bSort = b._sort;

              if (aSort == null) {
                aSort = -1;
              }

              if (bSort == null) {
                bSort = -1;
              }

              if (!aAttr) {
                aAttr = -1;
              }

              if (!bAttr) {
                bAttr = -1;
              }

              if (aAttr < bAttr) {
                return 1;
              } else if (aAttr == bAttr) {
                if (aSort > bSort) {
                  return 1;
                } else if (aSort < bSort) {
                  return -1;
                } else if (aId < bId) {
                  return 1;
                } else {
                  return -1;
                }
              } else {
                return -1;
              }
            }.bind(this));
          }
        } //要素排序.

      }, {
        key: "sortPrimaryId",
        value: function sortPrimaryId (features) {
          if (features.length > 0) {
            //从大到少排序
            return features.sort(function (a, b) {
              var aAttr = a.weight;
              var bAttr = b.weight;
              var aId = a.primaryId;
              var bId = b.primaryId;

              if (!aAttr) {
                aAttr = -1;
              }

              if (!bAttr) {
                bAttr = -1;
              }

              if (aAttr < bAttr) {
                return 1;
              } else if (aAttr == bAttr) {
                if (aId < bId) {
                  return 1;
                } else {
                  return -1;
                }
              } else {
                return -1;
              }
            }.bind(this));
          }
        }
        /**
         * 把注记按照显示的注记名称分组
         * @param features
         * @returns {{}}
         */

      }, {
        key: "groupByLabel",
        value: function groupByLabel (features) {
          var labelMap = {};

          for (var i = 0; i < features.length; i++) {
            var feature = features[i];

            if (feature.label == null && feature.iconImg != null) {
              if (labelMap[feature.attributeId] == null) {
                labelMap[feature.attributeId] = [];
              }

              labelMap[feature.attributeId].push(feature);
            } else {
              if (!labelMap[feature.type + '_' + feature.label]) {
                labelMap[feature.type + '_' + feature.label] = [];
              }

              labelMap[feature.type + '_' + feature.label].push(feature);
            }
          }

          return labelMap;
        }
      }]);

      return Util;
    }();

/* harmony default export */ __webpack_exports__["a"] = (Util);

    /***/
  }),
/* 5 */
/***/ (function (module, __webpack_exports__, __webpack_require__) {

    "use strict";
    function _classCallCheck (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    function _defineProperties (target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

    function _createClass (Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

    /**
     * Created by matt on 2017/7/16.
     */
    //几个像素可以算是命中
    var _dis = 5;

    var GisTools = /*#__PURE__*/function () {
      function GisTools () {
        _classCallCheck(this, GisTools);
      }

      _createClass(GisTools, null, [{
        key: "pointDistToLine",
        value: function pointDistToLine (x, y, startx, starty, endx, endy) {
          var se = (startx - endx) * (startx - endx) + (starty - endy) * (starty - endy);
          var p = (x - startx) * (endx - startx) + (y - starty) * (endy - starty);
          var r = p / se;
          var outx = startx + r * (endx - startx);
          var outy = starty + r * (endy - starty);
          var des = Math.sqrt((x - outx) * (x - outx) + (y - outy) * (y - outy)); //console.log(des);

          return des;
        }
      }, {
        key: "isPointOnSegment",
        value: function isPointOnSegment (px, py, p1x, p1y, p2x, p2y) {
          if (px - _dis > p1x && px + _dis > p2x || px + _dis < p1x && px - _dis < p2x) {
            return 0;
          }

          if (py - _dis > p1y && py + _dis > p2y || py + _dis < p1y && py - _dis < p2y) {
            return 0;
          }

          var d = GisTools.pointDistToLine(px, py, p1x, p1y, p2x, p2y);

          if (d < _dis) {
            return 1;
          } else {
            return 0;
          }
        }
      }, {
        key: "pointInLine",
        value: function pointInLine (px, py, polyline) {
          var flag = 0;
          var line = [];

          if (Array.isArray(polyline[0])) {
            line = polyline;
          } else {
            line.push(polyline);
          }

          for (var polyIndex = 0; polyIndex < line.length; polyIndex++) {
            var subpoly = line[polyIndex];
            var length = subpoly.length / 2; // for (var i = 0, l = length, j = l - 1; i < l; j = i, i++) {

            for (var i = 0; i < length - 1; i++) {
              var j = void 0;
              j = i + 1;
              var sx = subpoly[2 * i],
                sy = subpoly[2 * i + 1],
                tx = subpoly[2 * j],
                ty = subpoly[2 * j + 1];

              if (GisTools.isPointOnSegment(px, py, sx, sy, tx, ty) == 1) {
                return 1;
              }
            }
          }

          return 0;
        }
      }, {
        key: "pointInPolygon",
        value: function pointInPolygon (px, py, polygen) {
          var flag = 0;
          var poly = [];

          if (Array.isArray(polygen[0])) {
            poly = polygen;
          } else {
            poly.push(polygen);
          }

          for (var polyIndex = 0; polyIndex < poly.length; polyIndex++) {
            var subpoly = poly[polyIndex];
            var length = subpoly.length / 2;

            for (var i = 0, l = length, j = l - 1; i < l; j = i, i++) {
              var sx = subpoly[2 * i],
                sy = subpoly[2 * i + 1],
                tx = subpoly[2 * j],
                ty = subpoly[2 * j + 1]; // 点与多边形顶点重合

              if (sx === px && sy === py || tx === px && ty === py) {
                return 1;
              } // 判断线段两端点是否在射线两侧


              if (sy < py && ty >= py || sy >= py && ty < py) {
                // 线段上与射线 Y 坐标相同的点的 X 坐标
                var x = sx + (py - sy) * (tx - sx) / (ty - sy); // 点在多边形的边上

                if (x === px) {
                  return 1;
                }

                if (x > px) {
                  flag = !flag;
                }
              }
            }
          }

          return flag ? 1 : 0;
        }
      }, {
        key: "lineIntersects",
        value: function lineIntersects (line1StartX, line1StartY, line1EndX, line1EndY, line2StartX, line2StartY, line2EndX, line2EndY) {
          var denominator,
            a,
            b,
            numerator1,
            numerator2,
            onLine1 = false,
            onLine2 = false,
            res = [null, null];
          denominator = (line2EndY - line2StartY) * (line1EndX - line1StartX) - (line2EndX - line2StartX) * (line1EndY - line1StartY);

          if (denominator === 0) {
            if (res[0] !== null && res[1] !== null) {
              return res;
            } else {
              return false;
            }
          }

          a = line1StartY - line2StartY;
          b = line1StartX - line2StartX;
          numerator1 = (line2EndX - line2StartX) * a - (line2EndY - line2StartY) * b;
          numerator2 = (line1EndX - line1StartX) * a - (line1EndY - line1StartY) * b;
          a = numerator1 / denominator;
          b = numerator2 / denominator; // if we cast these lines infinitely in both directions, they intersect here:

          res[0] = line1StartX + a * (line1EndX - line1StartX);
          res[1] = line1StartY + a * (line1EndY - line1StartY); // if line2 is a segment and line1 is infinite, they intersect if:

          if (b > 0 && b < 1) {
            return res;
          } else {
            return false;
          }
        }
        /**
         * 判断两个poly的关系
         * @param polyOut
         * @param polyIn
         * @returns {1,相交，2包涵，3，没关系}
         */

      }, {
        key: "polyWith",
        value: function polyWith (polyOut, polyIn) {
          var lengthOut = polyOut.length / 2;
          var lengthIn = polyIn.length / 2;
          var flag = false;
          var bY;
          var aX;
          var aY;
          var bX;
          var dY;
          var cX;
          var cY;
          var dX;

          for (var i = 0; i < lengthOut; i++) {
            if (i != lengthOut - 1) {
              aX = polyOut[i * 2];
              aY = polyOut[i * 2 + 1];
              bX = polyOut[i * 2 + 2];
              bY = polyOut[i * 2 + 3];
            } else {
              aX = polyOut[i * 2];
              aY = polyOut[i * 2 + 1];
              bX = polyOut[0];
              bY = polyOut[1];
            }

            for (var j = 0; j < lengthIn; j++) {
              if (j != lengthIn - 1) {
                cX = polyIn[j * 2];
                cY = polyIn[j * 2 + 1];
                dX = polyIn[j * 2 + 2];
                dY = polyIn[j * 2 + 3];
              } else {
                cX = polyIn[j * 2];
                cY = polyIn[j * 2 + 1];
                dX = polyIn[0];
                dY = polyIn[1];
              }

              if (GisTools.lineIntersects(aX, aY, bX, bY, cX, cY, dX, dY) != false) {
                return 1;
              }
            }
          }

          var firstX = polyIn[0];
          var firstY = polyIn[1];

          if (GisTools.pointInPolygon(firstX, firstY, polyOut)) {
            return 2;
          }

          return 3;
        }
        /**
         * 把bbox转成double Array
         * @param left
         * @param bottom
         * @param right
         * @param top
         * @returns {Array}
         */

      }, {
        key: "boxToPolyArr",
        value: function boxToPolyArr (left, bottom, right, top) {
          var arr = [];
          arr.push(left);
          arr.push(bottom);
          arr.push(left);
          arr.push(top);
          arr.push(right);
          arr.push(top);
          arr.push(right);
          arr.push(bottom);
          arr.push(left);
          arr.push(bottom);
          return arr;
        }
      }, {
        key: "getExtensionPoint",
        value: function getExtensionPoint (p1, p2, d) {
          var xab = p2[0] - p1[0];
          var yab = p2[1] - p1[1];
          var xd = p2[0];
          var yd = p2[1];

          if (xab == 0) {
            if (yab > 0) {
              yd = p2[1] + d;
            } else {
              yd = p2[1] - d;
            }
          } else {
            var xbd = Math.sqrt(d * d / (yab / xab * (yab / xab) + 1));

            if (xab < 0) {
              xbd = -xbd;
            }

            xd = p2[0] + xbd;
            yd = p2[1] + yab / xab * xbd;
          }

          return [xd, yd];
        }
        /**
         * 线平行偏移
         * @param coords
         * @param distance
         * @returns {Array}
         */

      }, {
        key: "lineOffset",
        value: function lineOffset (coords, distance) {
          var segments = [];
          var finalCoords = [];
          coords.forEach(function (currentCoords, index) {
            if (index !== coords.length - 1) {
              var segment = GisTools.processSegment(currentCoords, coords[index + 1], distance);
              segments.push(segment);

              if (index > 0) {
                var seg2Coords = segments[index - 1];
                var intersects = GisTools.lineIntersects(segment[0][0], segment[0][1], segment[1][0], segment[1][1], seg2Coords[0][0], seg2Coords[0][1], seg2Coords[1][0], seg2Coords[1][1]); // Handling for line segments that aren't straight

                if (intersects !== false) {
                  seg2Coords[1] = intersects;
                  segment[0] = intersects;
                }

                finalCoords.push(seg2Coords[0]);

                if (index === coords.length - 2) {
                  finalCoords.push(segment[0]);
                  finalCoords.push(segment[1]);
                }
              } // Handling for lines that only have 1 segment


              if (coords.length === 2) {
                finalCoords.push(segment[0]);
                finalCoords.push(segment[1]);
              }
            }
          });
          return finalCoords;
        }
        /**
         * Process Segment
         * Inspiration taken from http://stackoverflow.com/questions/2825412/draw-a-parallel-line
         *
         * @private
         * @param {Array<number>} point1 Point coordinates
         * @param {Array<number>} point2 Point coordinates
         * @param {number} offset Offset
         * @returns {Array<Array<number>>} offset points
         */

      }, {
        key: "processSegment",
        value: function processSegment (pointAngle1, pointAngle2, offset) {
          var point1 = pointAngle1[0];
          var point2 = pointAngle2[0];
          var L = Math.sqrt((point1[0] - point2[0]) * (point1[0] - point2[0]) + (point1[1] - point2[1]) * (point1[1] - point2[1]));
          var out1x = point1[0] + offset * (point2[1] - point1[1]) / L;
          var out2x = point2[0] + offset * (point2[1] - point1[1]) / L;
          var out1y = point1[1] + offset * (point1[0] - point2[0]) / L;
          var out2y = point2[1] + offset * (point1[0] - point2[0]) / L;
          return [[[out1x, out1y], pointAngle1[1]], [[out2x, out2y], pointAngle2[1]]];
        }
        /**
         *  判断box1是否在box2内部
         * @param box1
         * @param box2
         */

      }, {
        key: "isInBox",
        value: function isInBox (box1, box2) {
          if (box1[0] >= box2[0] && box1[1] >= box2[1] && box1[2] <= box2[2] && box1[3] <= box2[3]) {
            return true;
          }

          return false;
        }
      }, {
        key: "Utf8ArrayToStr",
        value: function Utf8ArrayToStr (array) {
          var out, i, len, c;
          var char2, char3;
          out = "";
          len = array.length;
          i = 0;

          while (i < len) {
            c = array[i++];

            switch (c >> 4) {
              case 0:
              case 1:
              case 2:
              case 3:
              case 4:
              case 5:
              case 6:
              case 7:
                // 0xxxxxxx
                out += String.fromCharCode(c);
                break;

              case 12:
              case 13:
                // 110x xxxx   10xx xxxx
                char2 = array[i++];
                out += String.fromCharCode((c & 0x1F) << 6 | char2 & 0x3F);
                break;

              case 14:
                // 1110 xxxx  10xx xxxx  10xx xxxx
                char2 = array[i++];
                char3 = array[i++];
                out += String.fromCharCode((c & 0x0F) << 12 | (char2 & 0x3F) << 6 | (char3 & 0x3F) << 0);
                break;
            }
          }

          return out;
        }
      }]);

      return GisTools;
    }();

/* harmony default export */ __webpack_exports__["a"] = (GisTools);

    /***/
  }),
/* 6 */
/***/ (function (module, __webpack_exports__, __webpack_require__) {

    "use strict";
/* harmony import */ var _GCutLine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(17);
/* harmony import */ var _AvoidUtil__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);
    function _classCallCheck (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    function _defineProperties (target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

    function _createClass (Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }


    //import textureManager from './../../../../src/process/texture/TextureManager';

    var TextureManager = null;

    var ParseLabelData = /*#__PURE__*/function () {
      function ParseLabelData () {
        _classCallCheck(this, ParseLabelData);
      }

      _createClass(ParseLabelData, null, [{
        key: "parseLayerDatas",

        /**
         * 解析瓦片内注记数据
         * @param layerDatas
         * @param styleMap
         * @param isClient
         * @param maxExtent
         * @param extent
         * @param res
         * @param tileSize
         */
        value: function parseLayerDatas (layerDatas, styleMap, xyz, isClient, maxExtent, extent, res, tileSize) {
          var pointFeatures = [];
          var lineFeatures = [];

          for (var layername in layerDatas) {
            if (layername == '_layerAvoids') {
              continue;
            }

            var layerData = layerDatas[layername];
            layerData.xyz = xyz;
            var propertyGetter = ParseLabelData.getProperty(layerData.fieldsConfig);

            if (layerData.type == 1) {
              var pfs = ParseLabelData.parsePointLayer(layerData, layername, propertyGetter, styleMap, isClient, maxExtent, extent, res, tileSize);
              pointFeatures = pointFeatures.concat(pfs);
            }

            if (layerData.type == 2) {
              var lfs = ParseLabelData.parseLineLayer(layerData, layername, propertyGetter, styleMap, isClient, maxExtent, extent, res, tileSize);
              lineFeatures = lineFeatures.concat(lfs);
            }
          }

          return {
            pointFeatures: pointFeatures,
            lineFeatures: lineFeatures
          };
        }
      }, {
        key: "updateFeatureAttr",
        value: function updateFeatureAttr (features, styleMap, ratio, textures, isClient, maxExtent, extent, res, tileSize) {
          for (var i = 0; i < features.length; i++) {
            var feature = features[i];
            var style = styleMap[feature.styleId] ? styleMap[feature.styleId] : feature.style;

            if (isClient) {
              feature.iconImg = textures[style.texture];
            } else {
              if (TextureManager == null) {
                TextureManager = null;
              }

              if (style.texture) {
                var texture = TextureManager.getTexture(style.texture);

                if (texture != null) {
                  feature.iconImg = texture.toPattern(ratio);
                }
              }
            }

            ParseLabelData.parsePoint(feature, style, isClient, maxExtent, extent, res, tileSize);
          }

          return features;
        }
        /**
         *  解析点图层数据
         */

      }, {
        key: "parsePointLayer",
        value: function parsePointLayer (layerData, layername, propertyGetter, styleMap, isClient, maxExtent, extent, res, tileSize) {
          var pointFeatures = [];

          for (var i = 0; i < layerData.features.length; i++) {
            var feature = layerData.features[i];
            var style = styleMap[feature.styleId] ? styleMap[feature.styleId] : feature.style;

            if (!style || !style.show || style.type != "_default__" && !style.labelfield && !style.texture) {
              continue;
            }

            feature.centerPoint = feature[2];
            feature.attributeId = layername + '__' + feature[1][propertyGetter.idIndex];
            feature.layerName = layername;
            feature.xyz = layerData.xyz;
            feature.propertyGetter = propertyGetter;
            feature.type = layerData.type;
            feature.weight = feature.avoidWeight;

            if (feature.avoidWeight == null || isNaN(feature.avoidWeight)) {
              feature.avoidWeight = style.avoidWeight;
              feature.weight = feature.avoidWeight;

              if (feature.weight == null) {
                feature.weight = 0;
                feature.avoidWeight = 0;
              }
            }

            if (style.isImportant) {
              feature.avoidWeight = 99999999;
              feature.weight = 99999999;
            }

            pointFeatures.push(feature);
          }

          return pointFeatures;
        }
        /**
         *  解析线图层数据
         */

      }, {
        key: "parseLineLayer",
        value: function parseLineLayer (layerData, layername, propertyGetter, styleMap, isClient, maxExtent, extent, res, tileSize) {
          var lineFeatures = [];

          for (var i = 0; i < layerData.features.length; i++) {
            var feature = layerData.features[i];
            var style = styleMap[feature.styleId] ? styleMap[feature.styleId] : feature.style;

            if (!style || !style.show || style.type != "_default__" && !style.labelfield && !style.roadCodeLabel) {
              continue;
            }

            feature.layerName = layername;
            var features = ParseLabelData.parseLine(feature, style, layerData, propertyGetter, isClient, maxExtent, extent, res, tileSize);
            lineFeatures = lineFeatures.concat(features);
          }

          return lineFeatures;
        }
        /**
         *  解析点数据
         * @param feature
         * @param style
         * @param isClient
         * @returns {Array}
         */

      }, {
        key: "parsePoint",
        value: function parsePoint (feature, style, isClient, maxExtent, extent, res, tileSize) {
          feature.attributes = ParseLabelData.getAttributes(feature[1], feature.propertyGetter);
          var point = feature[2];
          var sourceAngleData = [[point, 0]];
          var label = feature.attributes[style.labelfield];
          feature.primaryId = feature.attributeId + '_row_' + feature.xyz.y + '_col_' + feature.xyz.x + '_level_' + feature.xyz.l + '_x_' + sourceAngleData[0][0][0] + '_y_' + sourceAngleData[0][0][1]; //去掉尾部的空格

          feature.label = _AvoidUtil__WEBPACK_IMPORTED_MODULE_1__[/* default */ "a"].formatLabel(label);
          feature.weight = feature.avoidWeight;
          var radius = 0;

          if (style.pointBoxDisance) {
            radius = style.pointBoxDisance * 0.5;
          }

          if (!style.pointOffsetX) {
            style.pointOffsetX = 0;
          }

          if (!style.pointOffsetY) {
            style.pointOffsetY = 0;
          }

          feature.filterBox = [feature.centerPoint[0] + style.pointOffsetX - radius, feature.centerPoint[1] + style.pointOffsetY - radius, feature.centerPoint[0] + style.pointOffsetX + radius, feature.centerPoint[1] + style.pointOffsetY + radius]; // feature.directions = directions;

          feature.sourceData = point;
          feature.sourceAngleData = sourceAngleData;

          if (isClient) {
            feature.id = Math.round(Math.random() * 256 * 256 * 256);
            feature.datas = ParseLabelData.transformData(sourceAngleData, feature.xyz, maxExtent, extent, res, tileSize);
          } else {
            feature.datas = sourceAngleData;
          }

          return feature;
        }
        /**
         *  解析线数据
         * @param itemData
         * @param style
         * @param isClient
         * @returns {Array}
         */

      }, {
        key: "parseLine",
        value: function parseLine (feature, style, layerData, propertyGetter, isClient, maxExtent, extent, res, tileSize) {
          if (feature[2].length == 0) {
            return [];
          }

          var lines = [];
          ParseLabelData.processLineString(lines, feature[2], feature, style, layerData, propertyGetter, isClient, maxExtent, extent, res, tileSize);
          return lines;
        }
      }, {
        key: "processLineString",
        value: function processLineString (lines, components, feature, style, layerData, propertyGetter, isClient, maxExtent, extent, res, tileSize) {
          if (Array.isArray(components[0])) {
            var len = components.length;

            for (var i = 0; i < len; i++) {
              var component = components[i];
              ParseLabelData.processLineString(lines, component, feature, style, layerData, propertyGetter, isClient, maxExtent, extent, res, tileSize);
            }
          } else {
            var ls = ParseLabelData.parseMultiLine(feature, components, layerData, propertyGetter, style, isClient, maxExtent, extent, res, tileSize);

            for (var _i = 0; _i < ls.length; _i++) {
              lines.push(ls[_i]);
            }
          }
        }
        /**
         *  解析多线数据
         * @param itemData
         * @param style
         * @param isClient
         * @returns {Array}
         */

      }, {
        key: "parseMultiLine",
        value: function parseMultiLine (feature, line, layerData, propertyGetter, style, isClient, maxExtent, extent, res, tileSize) {
          var attributes = ParseLabelData.getAttributes(feature[1], propertyGetter);
          var multiLines = [];
          var label = attributes[style.labelfield];
          var roadCodeLabel = attributes[style.roadCodeLabel]; //去掉尾部的空格

          label = _AvoidUtil__WEBPACK_IMPORTED_MODULE_1__[/* default */ "a"].formatLabel(label); //去掉尾部的空格

          roadCodeLabel = _AvoidUtil__WEBPACK_IMPORTED_MODULE_1__[/* default */ "a"].formatLabel(roadCodeLabel);
          var attributeId = feature.layerName + '__' + feature[1][propertyGetter.idIndex];
          var weight = feature.avoidWeight;

          if (style.isImportant) {
            weight = 99999999;
          }

          var featureItem = {
            type: layerData.type,
            sourceData: line,
            label: label,
            weight: feature.avoidWeight,
            codeAvoidWeight: feature.codeAvoidWeight,
            arrowAvoidWeight: feature.arrowAvoidWeight,
            roadCodeLabel: roadCodeLabel,
            attributes: attributes,
            attributeId: attributeId,
            styleId: feature.styleId,
            xyz: layerData.xyz,
            layerName: feature.layerName
          };
          multiLines = multiLines.concat(ParseLabelData.cutLineFeature(featureItem, style, isClient, false, maxExtent, extent, res, tileSize));
          return multiLines;
        }
        /**
         *  切割线注记
         * @param feature
         * @param style
         * @param isClient
         * @param isLocal
         * @returns {*}
         */

      }, {
        key: "cutLineFeature",
        value: function cutLineFeature (feature, style, isClient, isLocal, maxExtent, extent, res, tileSize) {
          if (isClient) {
            if (style.type == '_default__') {
              feature.sourceAngleData = ParseLabelData.lineToSourceAngleData(feature.sourceData);
              feature.datas = ParseLabelData.transformData(feature.sourceAngleData, feature.xyz, maxExtent, extent, res, tileSize);
              return [feature];
            }
          }

          var features = _GCutLine__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"].cutLineFeature(feature, style, isClient); //默认外扩为10

          var radius = 0.1;

          for (var i = 0; i < features.length; i++) {
            var f = features[i];
            f.primaryId = f.attributeId + '_row_' + feature.xyz.y + '_col_' + feature.xyz.x + '_level_' + feature.xyz.l + '_x_' + f.sourceAngleData[0][0][0] + '_y_' + f.sourceAngleData[0][0][1];

            if (isClient) {
              //转换为屏幕坐标
              if (isLocal) {
                f.datas = feature.transformData(this.extent, this.res);
              } else {
                f.datas = ParseLabelData.transformData(f.sourceAngleData, f.xyz, maxExtent, extent, res, tileSize);
              } //用于拾取的id


              f.id = Math.round(Math.random() * 256 * 256 * 256);
            } else {
              f.datas = f.sourceAngleData;
            }

            f.layerName = feature.layerName; //获取注记的中心点

            if (f.lineType == 'text') {
              var centerIndex = Math.floor(f.sourceAngleData.length / 2);
              f.centerPoint = f.sourceAngleData[centerIndex][0];

              if (style.lineTextBoxDisance) {
                //杭州的外扩距离设置太大，导致大片没线注记，故注释掉了这段
                radius = style.lineTextBoxDisance * 0.5;
              }
            } //获取注记的中心点


            if (f.lineType == 'code') {
              f.centerPoint = f.sourceAngleData[0][0];

              if (style.lineCodeBoxDisance) {
                radius = style.lineCodeBoxDisance * 0.5;
              }
            } //获取注记的中心点


            if (f.lineType == 'arrow') {
              f.centerPoint = f.sourceAngleData[1][0];
            } //第二次过滤的box


            f.filterBox = [f.centerPoint[0] - radius, f.centerPoint[1] - radius, f.centerPoint[0] + radius, f.centerPoint[1] + radius];
          }

          return features;
        }
        /**
         * 将线注记原始坐标带点和角度的格式，和切过的线的格式一致（针对默认样式的线主机）
         * Parameters:
         * line - 线注记原始数据
         * Returns:
         */

      }, {
        key: "lineToSourceAngleData",
        value: function lineToSourceAngleData (line) {
          var sourceAngleData = [];

          for (var i = 0; i < line.length; i++) {
            var x = line[i];
            var y = line[i + 1];
            sourceAngleData.push([[x, y], 0]);
            i++;
          }

          return sourceAngleData;
        }
      }, {
        key: "transformData",

        /**
         * 将瓦片内坐标转换为当前屏幕坐标
         * Parameters:
         * points - 瓦片内坐标数组,item示例：[[12,20],0] [12,20]为点坐标，0为旋转的角度
         * xyz - 瓦片的层行列号
         * Returns:
         * rdata - 本地屏幕内坐标数组
         */
        value: function transformData (points, xyz, maxExtent, extent, res, tileSize) {
          //取出当前视口左上角的地理坐标
          var left = extent[0];
          var top = extent[3]; //地图最大的范围

          var mLeft = maxExtent[0];
          var mTop = maxExtent[3]; //计算坐上角的屏幕坐标

          var x = (left - mLeft) / res;
          var y = (mTop - top) / res;
          var rPoint = [];

          for (var i = 0; i < points.length; i++) {
            var point = points[i][0];
            var gx = point[0] + xyz.x * tileSize;
            var gy = point[1] + xyz.y * tileSize;
            var p = [gx - x, gy - y];
            rPoint.push([p, points[i][1]]);
          }

          return rPoint;
        }
      }, {
        key: "parseAvoidLine",

        /**
         * 解析图元线要素
         * Parameters:
         * layerAvoids - 需要避让的线图层数据
         * xyz - 层行列号对象
         * maxExtent 地图的最大范围
         * extent 地图的当前视口
         * isClient 是否为客户端
         * Returns:
         * avoidLineFeatures - 需要避让的线要素
         */
        value: function parseAvoidLine (layerAvoids, xyz, isClient, maxExtent, extent, res, tileSize) {
          var avoidLineFeatures = [];

          for (var weight in layerAvoids) {
            var lines = layerAvoids[weight];
            weight = parseInt(weight);

            for (var i = 0; i < lines.length; i++) {
              var feature = {};
              feature.weight = weight;
              feature.sourceDatas = lines[i];

              if (isClient) {
                feature.datas = ParseLabelData.transformAvoidLine(lines[i], xyz, maxExtent, extent, res, tileSize);
              }

              feature.xyz = xyz;
              avoidLineFeatures.push(feature);
            }
          }

          return avoidLineFeatures;
        }
      }, {
        key: "transformAvoidLine",

        /**
         * 将瓦片内坐标转换为当前屏幕坐标
         * Parameters:
         * line - 原始的需要避让的线
         * xyz - 瓦片的层行列号
         * Returns:
         * rdata - 本地屏幕内坐标数组
         */
        value: function transformAvoidLine (line, xyz, maxExtent, extent, res, tileSize) {
          //取出当前视口左上角的地理坐标
          var left = extent[0];
          var top = extent[3]; //地图最大的范围

          var mLeft = maxExtent[0];
          var mTop = maxExtent[3]; //计算坐上角的屏幕坐标

          var x = (left - mLeft) / res;
          var y = (mTop - top) / res;
          var newLine = [];

          for (var i = 0; i < line.length / 2; i++) {
            var px = line[2 * i];
            var py = line[2 * i + 1];
            var gx = px + xyz.x * tileSize;
            var gy = py + xyz.y * tileSize;
            newLine.push(gx - x);
            newLine.push(gy - y);
          }

          return newLine;
        }
      }, {
        key: "getProperty",
        value: function getProperty (fieldsConfig) {
          var propertyConfig = {};
          var idIndex = 0;

          for (var i = 0; i < fieldsConfig.length; i++) {
            if (fieldsConfig[i].id == 'true' || fieldsConfig[i].id == true) {
              idIndex = fieldsConfig[i].index;
            }

            propertyConfig[fieldsConfig[i].name] = parseInt(fieldsConfig[i].index);
          }

          return {
            propertyConfig: propertyConfig,
            idIndex: idIndex
          };
        }
      }, {
        key: "getAttributes",
        value: function getAttributes (feature, propertyGetter) {
          var attributes = {};
          var propertyConfig = propertyGetter.propertyConfig;

          for (var name in propertyConfig) {
            attributes[name] = feature[propertyConfig[name]];
          }

          return attributes;
        }
      }]);

      return ParseLabelData;
    }();

/* harmony default export */ __webpack_exports__["a"] = (ParseLabelData);

    /***/
  }),
/* 7 */
/***/ (function (module, __webpack_exports__, __webpack_require__) {

    "use strict";

    // CONCATENATED MODULE: ./src/utils/gistools/BoxSet.js
    function _classCallCheck (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    function _defineProperties (target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

    function _createClass (Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

    var _quadrant_left = 1;
    var _quadrant_left_bottom = 2;
    var _quadrant_bottom = 3;
    var _quadrant_right_bottom = 4;
    var _quadrant_right = 5;
    var _quadrant_right_top = 6;
    var _quadrant_top = 7;
    var _quadrant_left_top = 8;
    var _inner = 9;
    var _save = 1;
    var _question = 2;
    var _out = 3;

    var BoxSet = /*#__PURE__*/function () {
      function BoxSet (left, right, bottom, top, base, bufferPercent) {
        _classCallCheck(this, BoxSet);

        if (bufferPercent == null) {
          bufferPercent = 5;
        }

        var buffer = base * 5 / 100;
        this.left = left - buffer;
        this.right = right + buffer;
        this.bottom = bottom - buffer;
        this.top = top + buffer;
        this.previous = BoxSet.createEmptyDoubleArray();
        this.now = BoxSet.createEmptyDoubleArray();
        this.question = BoxSet.createEmptyDoubleArray();
        this.point_previous_quadrant = -1;
        this.point_now_quadrant = -1;
        this.point_question_quadrant = -1;
      }

      _createClass(BoxSet, [{
        key: "copy",
        value: function copy (form, to) {
          to[0] = form[0];
          to[1] = form[1];
        }
      }, {
        key: "isQuadrant",
        value: function isQuadrant (point) {
          var x = point[0];
          var y = point[1];

          if (x < this.left) {
            if (y > this.top) {
              return _quadrant_left_top;
            }

            if (y < this.bottom) {
              return _quadrant_left_bottom;
            } else {
              return _quadrant_left;
            }
          }

          if (x > this.right) {
            if (y > this.top) {
              return _quadrant_right_top;
            }

            if (y < this.bottom) {
              return _quadrant_right_bottom;
            } else {
              return _quadrant_right;
            }
          } else {
            if (y > this.top) {
              return _quadrant_top;
            }

            if (y < this.bottom) {
              return _quadrant_bottom;
            } else {
              return _inner;
            }
          }
        }
      }, {
        key: "passrule",
        value: function passrule (point_previous_quadrant, point_now_quadrant) {
          if (point_previous_quadrant == 1) {
            if (point_now_quadrant == 1 || point_now_quadrant == 2 || point_now_quadrant == 8) {
              return _question;
            } else {
              return _save;
            }
          }

          if (point_previous_quadrant == 2) {
            if (point_now_quadrant == 1 || point_now_quadrant == 2 || point_now_quadrant == 8 || point_now_quadrant == 3 || point_now_quadrant == 4) {
              return _question;
            } else {
              return _save;
            }
          }

          if (this.point_previous_quadrant == 3) {
            if (this.point_now_quadrant == 2 || this.point_now_quadrant == 3 || this.point_now_quadrant == 4) {
              return _question;
            } else {
              return _save;
            }
          }

          if (point_previous_quadrant == 4) {
            if (point_now_quadrant == 2 || point_now_quadrant == 3 || point_now_quadrant == 4 || point_now_quadrant == 5 || point_now_quadrant == 6) {
              return _question;
            } else {
              return _save;
            }
          }

          if (point_previous_quadrant == 5) {
            if (point_now_quadrant == 4 || point_now_quadrant == 5 || point_now_quadrant == 6) {
              return _question;
            } else {
              return _save;
            }
          }

          if (point_previous_quadrant == 6) {
            if (point_now_quadrant == 4 || point_now_quadrant == 5 || point_now_quadrant == 6 || point_now_quadrant == 7 || point_now_quadrant == 8) {
              return _question;
            } else {
              return _save;
            }
          }

          if (point_previous_quadrant == 7) {
            if (point_now_quadrant == 6 || point_now_quadrant == 7 || point_now_quadrant == 8) {
              return _question;
            } else {
              return _save;
            }
          }

          if (point_previous_quadrant == 8) {
            if (point_now_quadrant == 6 || point_now_quadrant == 7 || point_now_quadrant == 8 || point_now_quadrant == 1 || point_now_quadrant == 2) {
              return _question;
            } else {
              return _save;
            }
          }

          if (point_previous_quadrant == 9) {
            return _save;
          } else {
            return _save;
          }
        }
      }, {
        key: "reset",
        value: function reset () {
          this.previous[0] = NaN;
          this.previous[1] = NaN;
          this.question[0] = NaN;
          this.question[1] = NaN;
          this.now[0] = NaN;
          this.now[1] = NaN;
          this.point_previous_quadrant = -1;
          this.point_now_quadrant = -1;
          this.point_question_quadrant = -1;
        }
      }, {
        key: "in",
        value: function _in (now) {
          if (now[0] < this.left || now[0] > this.right) {
            return false;
          }

          if (now[1] < this.bottom || now[1] > this.top) {
            return false;
          }

          return true;
        }
      }, {
        key: "push",
        value: function push (x, y) {
          this.now[0] = x;
          this.now[1] = y;

          if (BoxSet.isEmpty(this.previous)) {
            this.copy(this.now, this.previous);
            this.point_previous_quadrant = this.isQuadrant(this.now);
            return [this.now];
          } else {
            this.point_now_quadrant = this.isQuadrant(this.now);
            var passrule = this.passrule(this.point_previous_quadrant, this.point_now_quadrant);

            if (passrule == _save) {
              this.point_previous_quadrant = this.isQuadrant(this.now);
              this.copy(this.now, this.previous);

              if (!BoxSet.isEmpty(this.question)) {
                var returnPoint = [];
                this.copy(this.question, returnPoint);
                this.question = BoxSet.createEmptyDoubleArray();
                return [returnPoint, this.now];
              } else {
                return [this.now];
              }
            }

            if (passrule == _question) {
              //如果存疑，则需要和存疑点比对
              if (!BoxSet.isEmpty(this.question)) {
                //point_question_quadrant = this.isQuadrant(question);
                passrule = this.passrule(this.point_question_quadrant, this.point_now_quadrant);

                if (passrule == _save) {
                  var _returnPoint = [];
                  this.copy(this.question, _returnPoint);
                  this.question = BoxSet.createEmptyDoubleArray();
                  return [_returnPoint, this.now];
                } // if (passrule == _question) {
                // }

              }

              this.copy(this.now, this.question);
              this.point_question_quadrant = this.point_now_quadrant;
              return null;
            } else {
              return null;
            }
          }
        }
      }], [{
        key: "createEmptyDoubleArray",
        value: function createEmptyDoubleArray () {
          return [NaN, NaN];
        }
      }, {
        key: "isEmpty",
        value: function isEmpty (array) {
          if (array == null) {
            return true;
          }

          if (isNaN(array[0]) || isNaN(array[1])) {
            return true;
          } else {
            return false;
          }
        }
      }, {
        key: "length",
        value: function length (x0, y0, x1, y1) {
          var dx = x1 - x0;
          var dy = y1 - y0;
          var len = Math.sqrt(dx * dx + dy * dy);
          return len;
        }
      }]);

      return BoxSet;
    }();

/* harmony default export */ var gistools_BoxSet = (BoxSet);
    // EXTERNAL MODULE: ./src/utils/gistools/GisTools.js
    var GisTools = __webpack_require__(5);

    // EXTERNAL MODULE: ./src/layer/label/avoid/Util.js
    var Util = __webpack_require__(4);

    // EXTERNAL MODULE: ./src/layer/label/avoid/AvoidUtil.js
    var AvoidUtil = __webpack_require__(3);

    // EXTERNAL MODULE: ./src/layer/label/avoid/GDistance.js
    var GDistance = __webpack_require__(12);

    // CONCATENATED MODULE: ./src/layer/label/avoid/GDrawGeomerty.js
    function GDrawGeomerty_classCallCheck (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    function GDrawGeomerty_defineProperties (target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

    function GDrawGeomerty_createClass (Constructor, protoProps, staticProps) { if (protoProps) GDrawGeomerty_defineProperties(Constructor.prototype, protoProps); if (staticProps) GDrawGeomerty_defineProperties(Constructor, staticProps); return Constructor; }

    /**
     * Created by kongjian on 2017/6/26.
     * 绘制点，线面的工具类
     */






    var _boxSet512 = new gistools_BoxSet(0, 512, 0, 512, 512, 5);

    var _boxSet256 = new gistools_BoxSet(0, 256, 0, 256, 256, 5);

    var _boxSet256_0 = new gistools_BoxSet(0, 256, 0, 256, 256, 5);

    var _boxSet256_1 = new gistools_BoxSet(256, 512, 0, 256, 256, 5);

    var _boxSet256_2 = new gistools_BoxSet(0, 256, 256, 512, 256, 5);

    var _boxSet256_3 = new gistools_BoxSet(256, 512, 256, 512, 256, 5);

    var GDrawGeomerty_GDrawGeomerty = /*#__PURE__*/function () {
      function GDrawGeomerty () {
        GDrawGeomerty_classCallCheck(this, GDrawGeomerty);
      }

      GDrawGeomerty_createClass(GDrawGeomerty, null, [{
        key: "draw",

        /**
         * 画注记
         * Parameters:
         * features - 设置过样式，转换过为屏幕坐标，避让过的注记数据
         */
        value: function draw (ctx, features, styleMap, ratio, checkDraw, isChangeFont, hitCtx, hitDetection, quadrant, debug) {
          ctx.lineJoin = "round";
          var drewMap = null;

          if (checkDraw) {
            drewMap = new Map();
          } //如果是调试模式，先会被隐藏的，后画能正常显示的


          if (debug) {
            features = this.sort(features);
          }

          for (var i = 0; i < features.length; i++) {
            var feature = features[i];
            var style = styleMap[feature.styleId] ? styleMap[feature.styleId] : feature.style; //画点注记

            if (feature.type == 1) {
              this.drawPointIcon(ctx, feature, style, ratio, drewMap, hitCtx, hitDetection);
              this.drawPoint(ctx, feature, style, ratio, drewMap, isChangeFont, hitCtx, hitDetection, quadrant);

              if (debug) {
                this.drawAvoidBox(ctx, feature.box, feature.hidden);
              }

              continue;
            } //画线注记


            if (feature.type == 2) {
              this.drawLine(ctx, feature, style, ratio, drewMap, isChangeFont, hitCtx, hitDetection, quadrant);

              if (debug) {
                for (var j = 0; j < feature.boxs.length; j++) {
                  var box = feature.boxs[j];
                  this.drawAvoidBox(ctx, box, feature.hidden);
                }
              }
            }
          }

          drewMap = null;
        }
      }, {
        key: "drawDefaultStyle",

        /**
         * 画默认样式注记
         * Parameters:
         * features - 设置过样式，转换过为屏幕坐标，避让过的注记数据
         */
        value: function drawDefaultStyle (ctx, features, styleMap, ratio, checkDraw, isChangeFont, hitCtx, hitDetection) {
          var drewMap = null;

          if (checkDraw) {
            drewMap = new Map();
          }

          for (var i = 0; i < features.length; i++) {
            var feature = features[i];
            var style = styleMap[feature.styleId] ? styleMap[feature.styleId] : feature.style; //画点注记

            if (feature.type == 1) {
              this.drawPointDefaultStyle(ctx, feature, style, ratio, drewMap, isChangeFont, hitCtx, hitDetection);
              continue;
            } //画线注记


            if (feature.type == 2) {
              this.drawLineDefaultStyle(ctx, feature, style, ratio, drewMap, isChangeFont, hitCtx, hitDetection);
            }
          }

          drewMap = null;
        }
      }, {
        key: "drawPointIcon",

        /**
         * 画点注记图标
         * Parameters:
         *  ctx - 画布对象
         *  hitCtx - 画拾取box的画布对象
         * hitDetection - 是否绘制拾取的box
         * feature - 设置过样式，转换过为屏幕坐标，避让过的注记数据
         */
        value: function drawPointIcon (ctx, feature, style, ratio, drewMap, hitCtx, hitDetection) {
          if (!style.texture) {
            return;
          }

          var width = style.graphicWidth;
          var height = style.graphicHeight;
          var img = feature.iconImg;

          if (!img) {
            return;
          }

          if (!width || !height) {
            width = img.width;
            height = img.height;

            if (drewMap) {
              width = width / ratio;
              height = height / ratio;
            }
          }

          var xOffset = style.graphicXOffset - 0.5 * width;
          var yOffset = style.graphicYOffset - 0.5 * height;
          var pointOffsetX = style.pointOffsetX;
          var pointOffsetY = style.pointOffsetY;

          if (!pointOffsetX) {
            pointOffsetX = 0;
          }

          if (!pointOffsetY) {
            pointOffsetY = 0;
          }

          var point = [feature.datas[0][0][0], feature.datas[0][0][1]];
          point[0] = point[0] + pointOffsetX;
          point[1] = point[1] + pointOffsetY;
          var x = point[0] + xOffset;
          var y = point[1] + yOffset;
          var opacity = style.pointFillAlpha || 1; // 画过的不画

          if (drewMap) {
            var drewMark = style.texture + "_" + x + "_" + y;

            if (drewMap.get(drewMark) == null) {
              drewMap.set(drewMark, true);
            } else {
              return;
            }
          }

          ctx.save();
          ctx.globalAlpha = opacity;
          ctx.drawImage(img, x * ratio, y * ratio, width * ratio, height * ratio);
          ctx.restore(); //拾取检测用的矩形

          if (hitDetection) {
            hitCtx.save();
            this.setHitContextStyle(hitCtx, feature.id);
            hitCtx.fillRect(x, y, width, height);
            hitCtx.restore();
          }
        }
        /**
         * 画点注记
         * Parameters:
         *  ctx - 画布对象
         *  hitCtx - 画拾取box的画布对象
         * hitDetection - 是否绘制拾取的box
         * feature - 设置过样式，转换过为屏幕坐标，避让过的注记数据
         */

      }, {
        key: "drawPoint",
        value: function drawPoint (ctx, feature, style, ratio, drewMap, isChangeFont, hitCtx, hitDetection, quadrant) {
          if (!feature.label) {
            return;
          } //不在范围内的不绘制


          var pt = feature.textPoint;

          if (drewMap) {
            //如果这个注记不在渲染格网里面，则不绘制；
            var polyIn = GisTools["a" /* default */].boxToPolyArr(feature.box[0], feature.box[1], feature.box[2], feature.box[3]);
            var polyOut;

            if (ctx.canvas.width / ratio == 512) {
              polyOut = GisTools["a" /* default */].boxToPolyArr(-20, -20, 532, 532);
            } else if (ctx.canvas.width / ratio == 256) {
              switch (quadrant) {
                case 0:
                  polyOut = GisTools["a" /* default */].boxToPolyArr(-15, -15, 271, 271);
                  break;

                case 1:
                  polyOut = GisTools["a" /* default */].boxToPolyArr(-15 + 256, -15, 271 + 256, 271);
                  break;

                case 2:
                  polyOut = GisTools["a" /* default */].boxToPolyArr(-15, -15 + 256, 271, 271 + 256);
                  break;

                case 3:
                  polyOut = GisTools["a" /* default */].boxToPolyArr(-15 + 256, -15 + 256, 271 + 256, 271 + 256);
                  break;
              }
            }

            if (GisTools["a" /* default */].polyWith(polyOut, polyIn) == 3) {
              return;
            }

            var drewKey = feature.label + "_" + pt[0] + "_" + pt[1];

            if (drewMap.get(drewKey) == null) {
              drewMap.set(drewKey, true);
            } else {
              return;
            }
          }

          var labelRows = feature.label.split(' ');
          var numRows = labelRows.length;
          var lineHeight = style.pointHeight;
          lineHeight = lineHeight + 2;
          var pointFillFont = AvoidUtil["a" /* default */].formatFont(style.pointFillFont, ratio, isChangeFont);
          var pointStrokeFont = AvoidUtil["a" /* default */].formatFont(style.pointStrokeFont, ratio, isChangeFont);
          ctx.save();
          ctx.font = pointStrokeFont;
          var maxWidth = 0;
          var rowWidths = [];

          for (var i = 0; i < numRows; i++) {
            var itemWdith = Util["a" /* default */].measureText(labelRows[i].replace(/&nbsp;/g, " "), ctx.font, ctx);
            rowWidths.push(itemWdith);

            if (itemWdith > maxWidth) {
              maxWidth = itemWdith;
            }
          }

          ctx.restore();
          var rectX = pt[0] - style.pointBackgroundGap;
          var rectY = pt[1] - style.pointBackgroundGap - style.pointHeight / 2;

          if (style.pointHashBackground == true) {
            ctx.save();
            ctx.globalAlpha = style.pointBackgroundAlpha;
            ctx.strokeStyle = style.pointBackgroundLineColor;
            ctx.lineWidth = style.pointBackgroundLineWidth;
            ctx.fillStyle = style.pointBackgroundColor;
            ctx.font = style.pointFillFont;
            this.drawRoundRect(ctx, rectX, rectY, maxWidth / ratio + style.pointBackgroundGap * 2, style.pointHeight * numRows + style.pointBackgroundGap * 2 + (numRows - 1) * 2, style.pointBackgroundRadius, ratio);
            ctx.fill();
            ctx.restore();
          } //获取文字在图标的哪个方向


          var direction = this.getPointTextDirection(pt[0], feature.datas[0][0][0], maxWidth);
          this.drawPointText(ctx, labelRows, direction, style, pointFillFont, pointStrokeFont, lineHeight, ratio, pt, rowWidths, maxWidth, feature); //拾取检测用的矩形

          if (hitDetection) {
            if (style.pointHashBackground == true) {
              hitCtx.save();
              this.setHitContextStyle(hitCtx, feature.id);
              this.drawHitRoundRect(hitCtx, rectX, rectY, maxWidth / ratio + style.pointBackgroundGap * 2, lineHeight * numRows + style.pointBackgroundGap * 2, style.pointBackgroundRadius);
              hitCtx.fill();
              hitCtx.restore();
            } else {
              hitCtx.save();
              this.setHitContextStyle(hitCtx, feature.id);
              hitCtx.textBaseline = "middle";
              hitCtx.fillRect(pt[0], pt[1] - style.pointHeight / 2, maxWidth / ratio, lineHeight * numRows);
              hitCtx.restore();
            }
          }
        }
      }, {
        key: "getPointTextDirection",
        value: function getPointTextDirection (textPointX, iconPointX, maxWidth) {
          //文字在图标的右侧
          if (textPointX > iconPointX) {
            return 0;
          } //文字在图标左侧


          if (iconPointX > textPointX + maxWidth) {
            return 1;
          }

          return 2;
        }
      }, {
        key: "drawPointText",
        value: function drawPointText (ctx, labelRows, direction, style, pointFillFont, pointStrokeFont, lineHeight, ratio, pt, rowWidths, maxWidth, feature) {
          var numRows = labelRows.length;

          for (var i = 0; i < numRows; i++) {
            var rowWidth = rowWidths[i];
            var x = pt[0]; //文字在图标左侧

            if (direction == 1) {
              x = pt[0] + (maxWidth - rowWidth);
            } //文字在图标上方或者下方


            if (direction == 2) {
              x = pt[0] + (maxWidth - rowWidth) * 0.5;
            }

            if (style.pointHashOutline == true) {
              ctx.save();
              ctx.textBaseline = "middle";
              ctx.globalAlpha = style.pointStrokeAlpha;
              ctx.strokeStyle = style.pointStrokeStyle;
              ctx.lineWidth = style.pointLineWidth;
              ctx.font = pointStrokeFont;
              ctx.strokeText(labelRows[i].replace(/&nbsp;/g, " "), x * ratio, (pt[1] + lineHeight * i) * ratio);
              ctx.restore();
            }

            ctx.save();
            ctx.textBaseline = "middle";
            ctx.globalAlpha = style.pointFillAlpha;

            if (feature.hasOwnProperty('lightColor')) {
              ctx.fillStyle = feature.lightColor;
            } else {
              if (feature.hidden) {
                ctx.fillStyle = '#969393';
              } else {
                ctx.fillStyle = style.pointFillStyle;
              }
            }

            ctx.font = pointFillFont;
            ctx.fillText(labelRows[i].replace(/&nbsp;/g, " "), x * ratio, (pt[1] + lineHeight * i) * ratio);
            ctx.restore();
          }
        }
        /**
         * 画线注记
         * Parameters:
         *  ctx - 画布对象
         * hitCtx - 画拾取box的画布对象
         * hitDetection - 是否绘制拾取的box
         * feature - 设置过样式，转换过为屏幕坐标，避让过的注记数据
         */

      }, {
        key: "drawLine",
        value: function drawLine (ctx, feature, style, ratio, drewMap, isChangeFont, hitCtx, hitDetection, quadrant) {
          if (feature.lineType == 'text') {
            this.drawLineText(ctx, feature, style, ratio, drewMap, isChangeFont, hitCtx, hitDetection, quadrant);
          }

          if (feature.lineType == 'code') {
            this.drawLineCode(ctx, feature, style, ratio, drewMap, isChangeFont, hitCtx, hitDetection);
          }

          if (feature.lineType == 'arrow') {
            this.drawLineArrow(ctx, feature, style, ratio, drewMap, hitCtx, hitDetection);
          }
        }
        /**
         * 画线文本注记
         * Parameters:
         *  ctx - 画布对象
         * hitCtx - 画拾取box的画布对象
         * hitDetection - 是否绘制拾取的box
         * feature - 设置过样式，转换过为屏幕坐标，避让过的注记数据
         */

      }, {
        key: "drawLineText",
        value: function drawLineText (ctx, feature, style, ratio, drewMap, isChangeFont, hitCtx, hitDetection, quadrant) {
          var label = feature.label;
          var textPoints = feature.textPoints;
          var lineBoxSet;

          if (drewMap) {
            // 如果是512 则使用boxset 512
            if (ctx.canvas.width / ratio == 512) {
              lineBoxSet = _boxSet512;
            } else if (ctx.canvas.width / ratio == 256) {
              // lineBoxSet = _boxSet256;
              switch (quadrant) {
                case 0:
                  lineBoxSet = _boxSet256_0;
                  break;

                case 1:
                  lineBoxSet = _boxSet256_1;
                  break;

                case 2:
                  lineBoxSet = _boxSet256_2;
                  break;

                case 3:
                  lineBoxSet = _boxSet256_3;
                  break;
              }
            }
          }

          var lineFillFont = AvoidUtil["a" /* default */].formatFont(style.lineFillFont, ratio, isChangeFont);
          var lineStrokeFont = AvoidUtil["a" /* default */].formatFont(style.lineStrokeFont, ratio, isChangeFont); //去掉尾部的空格
          //只有一个点，或者是有线背景矩形框

          if (style.lineHashBackground == true || textPoints.length == 1) {
            var index = Math.floor(textPoints.length / 2);
            var localPoint = textPoints[index][0];

            if (textPoints.length == 1) {
              this.drawBgText(ctx, label, ratio, localPoint, style.backgroundAlpha, style.backgroundLineColor, style.backgroundLineWidth, style.backgroundColor, style.lineFillFont, style.lineBackgroundGap, style.lineHeight, style.lineBackgroundRadius, style.lineHashOutline, style.lineStrokeAlpha, style.lineStrokeStyle, style.lineLineWidth, style.lineStrokeFont, style.lineFillAlpha, style.lineFillStyle, hitCtx, hitDetection, feature.id, style.lineHashBackground, isChangeFont, feature);
            } else {
              this.drawBgText(ctx, label, ratio, localPoint, style.backgroundAlpha, style.backgroundLineColor, style.backgroundLineWidth, style.backgroundColor, style.lineFillFont, style.lineBackgroundGap, style.lineHeight, style.lineBackgroundRadius, style.lineHashOutline, style.lineStrokeAlpha, style.lineStrokeStyle, style.lineLineWidth, style.lineStrokeFont, style.lineFillAlpha, style.lineFillStyle, hitCtx, hitDetection, feature.id, false, isChangeFont, feature);
            }
          } else {
            var lineFillStyle = feature.lineFillStyle ? feature.lineFillStyle : style.lineFillStyle; //开始绘制线注记

            for (var j = 0; j < label.length; j++) {
              var pa = textPoints[j];
              var angle = pa[1];
              var point = pa[0];
              var labelChar = label.charAt(j);

              if (drewMap) {
                var drewKey = labelChar + "_" + point[0] + "_" + point[1] + "_" + angle;

                if (drewMap.get(drewKey) != null) {
                  continue;
                }

                drewMap.set(drewKey, true);

                if (!lineBoxSet["in"]([point[0] / ratio, point[1] / ratio])) {
                  continue;
                }
              }

              if (style.lineHashOutline == true) {
                ctx.save();
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.globalAlpha = style.lineStrokeAlpha;
                ctx.strokeStyle = style.lineStrokeStyle;
                ctx.lineWidth = style.lineLineWidth;
                ctx.font = lineStrokeFont;
                ctx.translate(point[0] * ratio, point[1] * ratio);
                ctx.rotate(angle * Math.PI / 180);
                ctx.strokeText(labelChar, 0, 0);
                ctx.restore();
              }

              ctx.save();
              ctx.textAlign = "center";
              ctx.textBaseline = "middle";
              ctx.globalAlpha = style.lineFillAlpha;

              if (feature.hasOwnProperty('lightColor')) {
                ctx.fillStyle = feature.lightColor;
              } else {
                if (feature.hidden) {
                  ctx.fillStyle = '#969393';
                } else {
                  ctx.fillStyle = lineFillStyle;
                }
              }

              ctx.font = lineFillFont;
              ctx.translate(point[0] * ratio, point[1] * ratio);
              ctx.rotate(angle * Math.PI / 180);
              ctx.fillText(labelChar, 0, 0);
              ctx.restore(); //拾取检测用的矩形

              if (hitDetection) {
                hitCtx.save();
                this.setHitContextStyle(hitCtx, feature.id);
                hitCtx.translate(point[0], point[1]);
                hitCtx.rotate(angle * Math.PI / 180);
                hitCtx.fillRect(-style.lineHeight * 1.2 * 0.5, -style.lineHeight * 1.2 * 0.5, style.lineHeight * 1.2, style.lineHeight * 1.2);
                hitCtx.restore();
              }
            }
          }
        }
        /**
         * 画线编码注记
         * Parameters:
         *  ctx - 画布对象
         * hitCtx - 画拾取box的画布对象
         * hitDetection - 是否绘制拾取的box
         * feature - 设置过样式，转换过为屏幕坐标，避让过的注记数据
         */

      }, {
        key: "drawLineCode",
        value: function drawLineCode (ctx, feature, style, ratio, drewMap, isChangeFont, hitCtx, hitDetection) {
          var localPoint = feature.codePoint;
          var codeLabel = feature.label;

          if (style.showRoadCode == true && codeLabel && codeLabel.length > 0) {
            this.drawBgText(ctx, codeLabel, ratio, localPoint, style.codeBackgroundAlpha, style.codeBackgroundLineColor, style.codeBackgroundLineWidth, style.codeBackgroundColor, style.codeLineFillFont, style.codeLineBackgroundGap, style.codeLineHeight, style.codeLineBackgroundRadius, style.codeLineHashOutline, style.codeLineStrokeAlpha, style.codeLineStrokeStyle, style.codeLineLineWidth, style.codeLineStrokeFont, style.codeLineFillAlpha, style.codeLineFillStyle, hitCtx, hitDetection, feature.id, true, isChangeFont, feature);
          }
        }
        /**
         * 画线箭头
         * Parameters:
         *  ctx - 画布对象
         * hitCtx - 画拾取box的画布对象
         * hitDetection - 是否绘制拾取的box
         * feature - 设置过样式，转换过为屏幕坐标，避让过的注记数据
         */

      }, {
        key: "drawLineArrow",
        value: function drawLineArrow (ctx, feature, style, ratio, drewMap, hitCtx, hitDetection) {
          var points = feature.arrowPoint;
          var direction = style.arrowDirectionValue;

          if (style.arrowDirectionField) {
            direction = feature.attributes[style.arrowDirectionField];
          }

          var p1 = points[0][0];
          var p2 = points[1][0];

          if (direction == 0 || direction == null) {
            p1 = points[1][0];
            p2 = points[2][0];
          }

          ctx.save();
          ctx.lineWidth = style.arrowLineWidth;
          ctx.strokeStyle = style.arrowFillStyle;

          if (feature.hasOwnProperty('lightColor')) {
            ctx.fillStyle = feature.lightColor;
          } else {
            if (feature.hidden) {
              ctx.fillStyle = '#969393';
            } else {
              ctx.fillStyle = style.arrowFillStyle;
            }
          } //画线


          ctx.beginPath();
          var d = new GDistance["a" /* default */]();
          var arrowMin = d.length(p1[0], p1[1], p2[0], p2[1]) - style.arrowDistance;

          if (Math.abs(arrowMin) != 0) {
            var point = d.getLengthPoint(p1[0], p1[1], p2[0], p2[1], style.arrowDistance, null);
            p2 = point;
          }

          ctx.moveTo(p1[0] * ratio, p1[1] * ratio);
          ctx.lineTo(p2[0] * ratio, p2[1] * ratio);
          ctx.stroke();
          var startRadians = 0;
          var radians = 0;

          if (p2[0] == p1[0]) {
            if (direction && p2[1] > p1[1] || !direction && p2[1] < p1[1]) {
              startRadians = Math.PI;
            }
          } else {
            startRadians = Math.atan((p2[1] - p1[1]) / (p2[0] - p1[0]));
            radians = (p2[0] > p1[0] ? 90 : -90) * Math.PI / 180;
          } //画箭头


          if (direction == 0) {
            startRadians = startRadians - radians;
            this.drawArrowhead(ctx, p1[0], p1[1], startRadians, ratio, style.arrowSize);
          } else {
            startRadians = startRadians + radians;
            this.drawArrowhead(ctx, p2[0], p2[1], startRadians, ratio, style.arrowSize);
          }

          ctx.restore();
        }
        /**
         * 画箭头的头
         * Parameters:
         */

      }, {
        key: "drawArrowhead",
        value: function drawArrowhead (ctx, x, y, radians, ratio, size) {
          ctx.beginPath();
          ctx.translate(x * ratio, y * ratio);
          ctx.rotate(radians);
          ctx.moveTo(0, -size * ratio);
          ctx.lineTo(size * 0.5 * ratio, 0);
          ctx.lineTo(-size * 0.5 * ratio, 0);
          ctx.closePath();
          ctx.fill();
        }
        /**
         * 画圆角矩形
         */

      }, {
        key: "drawRoundRect",
        value: function drawRoundRect (ctx, x, y, width, height, radius, ratio) {
          ctx.beginPath();
          ctx.arc((x + radius) * ratio, (y + radius) * ratio, radius * ratio, Math.PI, Math.PI * 3 / 2);
          ctx.lineTo((width - radius + x) * ratio, y * ratio);
          ctx.arc((width - radius + x) * ratio, (radius + y) * ratio, radius * ratio, Math.PI * 3 / 2, Math.PI * 2);
          ctx.lineTo((width + x) * ratio, (height + y - radius) * ratio);
          ctx.arc((width - radius + x) * ratio, (height - radius + y) * ratio, radius * ratio, 0, Math.PI * 1 / 2);
          ctx.lineTo((radius + x) * ratio, (height + y) * ratio);
          ctx.arc((radius + x) * ratio, (height - radius + y) * ratio, radius * ratio, Math.PI * 1 / 2, Math.PI);
          ctx.closePath();
        }
        /**
         * 绘制带背景的线文本
         */

      }, {
        key: "drawBgText",
        value: function drawBgText (ctx, label, ratio, localPoint, backgroundAlpha, backgroundLineColor, backgroundLineWidth, backgroundColor, lineFillFont, lineBackgroundGap, lineHeight, lineBackgroundRadius, lineHashOutline, lineStrokeAlpha, lineStrokeStyle, lineLineWidth, lineStrokeFont, lineFillAlpha, lineFillStyle, hitCtx, hitDetection, featureId, isDrawbg, isChangeFont, feature) {
          localPoint[0] = Math.round(localPoint[0]);
          localPoint[1] = Math.round(localPoint[1]);
          ctx.save();
          ctx.globalAlpha = backgroundAlpha;
          ctx.strokeStyle = backgroundLineColor;
          ctx.lineWidth = backgroundLineWidth;
          ctx.fillStyle = backgroundColor;
          ctx.font = AvoidUtil["a" /* default */].formatFont(lineFillFont, 1, isChangeFont);
          var w = Util["a" /* default */].measureText(label, ctx.font, ctx);
          var rectX = localPoint[0] - w / 2 - lineBackgroundGap;
          var rectY = localPoint[1] - lineHeight / 2 - lineBackgroundGap;

          if (isDrawbg) {
            this.drawRoundRect(ctx, rectX, rectY, w + lineBackgroundGap * 2, lineHeight + lineBackgroundGap * 2, lineBackgroundRadius, ratio);
            ctx.fill();
          }

          ctx.restore();
          lineFillFont = AvoidUtil["a" /* default */].formatFont(lineFillFont, ratio, isChangeFont);
          lineStrokeFont = AvoidUtil["a" /* default */].formatFont(lineStrokeFont, ratio, isChangeFont);

          if (lineHashOutline == true) {
            ctx.save();
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.globalAlpha = lineStrokeAlpha;
            ctx.strokeStyle = lineStrokeStyle;
            ctx.lineWidth = lineLineWidth;
            ctx.font = lineStrokeFont;
            ctx.translate(localPoint[0] * ratio, localPoint[1] * ratio);
            ctx.strokeText(label, 0, 0);
            ctx.restore();
          }

          ctx.save();
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.globalAlpha = lineFillAlpha;

          if (feature.hasOwnProperty('lightColor')) {
            ctx.fillStyle = feature.lightColor;
          } else {
            if (feature.hidden) {
              ctx.fillStyle = '#969393';
            } else {
              ctx.fillStyle = lineFillStyle;
            }
          }

          ctx.font = lineFillFont;
          ctx.translate(localPoint[0] * ratio, localPoint[1] * ratio);
          ctx.fillText(label, 0, 0);
          ctx.restore(); //拾取检测用的矩形

          if (hitDetection) {
            hitCtx.save();
            this.setHitContextStyle(hitCtx, featureId);
            this.drawHitRoundRect(hitCtx, rectX, rectY, w + lineBackgroundGap * 2, lineHeight + lineBackgroundGap * 2, lineBackgroundRadius);
            hitCtx.fill();
            hitCtx.restore();
          }
        }
        /**
         * 绘制点的默认样式
         */

      }, {
        key: "drawPointDefaultStyle",
        value: function drawPointDefaultStyle (ctx, feature, style, ratio, drewMap, isChangeFont, hitCtx, hitDetection) {
          var pt = feature.datas[0][0];
          ctx.save();
          ctx.fillStyle = style.pointFillStyle;
          ctx.beginPath();
          ctx.arc(pt[0], pt[1], style.radius, 0, 2 * Math.PI);
          ctx.fill();
          ctx.restore(); //拾取检测用的矩形

          if (hitDetection) {
            hitCtx.save();
            this.setHitContextStyle(hitCtx, feature.id);
            hitCtx.beginPath();
            hitCtx.arc(pt[0], pt[1], style.radius, 0, 2 * Math.PI);
            hitCtx.fill();
            hitCtx.restore();
          }
        }
        /**
         * 绘制线的默认样式
         */

      }, {
        key: "drawLineDefaultStyle",
        value: function drawLineDefaultStyle (ctx, feature, style, ratio, drewMap, isChangeFont, hitCtx, hitDetection) {
          var datas = feature.datas;
          ctx.save();
          ctx.lineWidth = style.lineWidth;
          ctx.strokeStyle = style.lineFillStyle;
          ctx.beginPath();
          ctx.moveTo(datas[0][0][0], datas[0][0][1]);

          for (var i = 1; i < datas.length; i++) {
            ctx.lineTo(datas[i][0][0], datas[i][0][1]);
          }

          ctx.stroke();
          ctx.restore();
        }
        /**
         * 根据featureId生成颜色值
         */

      }, {
        key: "featureIdToHex",
        value: function featureIdToHex (featureId) {
          var id = Number(featureId) + 1;
          var hex = "000000" + id.toString(16);
          var len = hex.length;
          hex = "#" + hex.substring(len - 6, len);
          return hex;
        }
      }, {
        key: "setHitContextStyle",
        value: function setHitContextStyle (hitCtx, featureId) {
          var hex = this.featureIdToHex(featureId);
          hitCtx.globalAlpha = 1;
          hitCtx.fillStyle = hex;
        }
        /**
         * 绘制拾取背景框
         */

      }, {
        key: "drawHitRoundRect",
        value: function drawHitRoundRect (hitCtx, x, y, width, height, radius) {
          hitCtx.beginPath();
          hitCtx.arc(x + radius, y + radius, radius, Math.PI, Math.PI * 3 / 2);
          hitCtx.lineTo(width - radius + x, y);
          hitCtx.arc(width - radius + x, radius + y, radius, Math.PI * 3 / 2, Math.PI * 2);
          hitCtx.lineTo(width + x, height + y - radius);
          hitCtx.arc(width - radius + x, height - radius + y, radius, 0, Math.PI * 1 / 2);
          hitCtx.lineTo(radius + x, height + y);
          hitCtx.arc(radius + x, height - radius + y, radius, Math.PI * 1 / 2, Math.PI);
          hitCtx.closePath();
        }
        /**
         *  画线注记的线
         * @param ctx
         * @param features
         * @param styleMap
         * @param ratio
         * @param checkDraw
         * @param isChangeFont
         * @param hitCtx
         * @param hitDetection
         * @param canvaLayer
         */

      }, {
        key: "drawLines",
        value: function drawLines (ctx, features, styleMap, ratio, checkDraw, isChangeFont, hitCtx, hitDetection, canvaLayer) {
          var drewMap = null;

          if (checkDraw) {
            drewMap = new Map();
          }

          for (var i = 0; i < features.length; i++) {
            var feature = features[i]; //画线注记

            if (feature.type == 2) {
              var data = canvaLayer.lineToSourceAngleData(feature.sourceData);
              feature.lines = canvaLayer.transformData(data, feature.xyz);
              var style = styleMap[feature.styleId] ? styleMap[feature.styleId] : feature.style;
              this.drawLineStyle(ctx, feature, style, ratio, drewMap, isChangeFont, hitCtx, hitDetection);
            }
          }

          drewMap = null;
        }
      }, {
        key: "drawLineStyle",

        /**
         * 绘制线的默认样式
         */
        value: function drawLineStyle (ctx, feature, style, ratio, drewMap, isChangeFont, hitCtx, hitDetection) {
          var datas = feature.lines;
          ctx.save();
          ctx.lineWidth = style.lineWidth;
          ctx.strokeStyle = style.lineFillStyle;
          ctx.beginPath();
          ctx.moveTo(datas[0][0][0], datas[0][0][1]);

          for (var i = 1; i < datas.length; i++) {
            ctx.lineTo(datas[i][0][0], datas[i][0][1]);
          }

          ctx.stroke();
          ctx.restore();
        } //画避让盒子

      }, {
        key: "drawAvoidBox",
        value: function drawAvoidBox (ctx, box, hidden) {
          ctx.save();
          ctx.lineWidth = 1;

          if (hidden) {
            ctx.strokeStyle = '#969393';
          } else {
            ctx.strokeStyle = '#2d8cf0';
          }

          ctx.beginPath();
          ctx.moveTo(box[0], box[1]);
          ctx.lineTo(box[2], box[1]);
          ctx.lineTo(box[2], box[3]);
          ctx.lineTo(box[0], box[3]);
          ctx.lineTo(box[0], box[1]);
          ctx.stroke();
          ctx.restore();
        } //隐藏的注记排前面先画

      }, {
        key: "sort",
        value: function sort (features) {
          if (features.length > 0) {
            //从大到少排序
            return features.sort(function (a, b) {
              if (!a.hidden && b.hidden) {
                return 1;
              }

              if (a.hidden && !b.hidden) {
                return -1;
              }

              return 0;
            });
          }
        }
      }]);

      return GDrawGeomerty;
    }();

/* harmony default export */ var avoid_GDrawGeomerty = __webpack_exports__["a"] = (GDrawGeomerty_GDrawGeomerty);

    /***/
  }),
/* 8 */
/***/ (function (module, __webpack_exports__, __webpack_require__) {

    "use strict";
/* harmony import */ var _utils_es6_promise__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _filter_Filter__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(13);
/* harmony import */ var _filter_FilterLayer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(11);
/* harmony import */ var _ext_Version__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(2);
    function _classCallCheck (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    function _defineProperties (target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

    function _createClass (Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

    /**
     * Created by kongjian on 2017/6/26.
     */





    var GXYZUtil = /*#__PURE__*/function () {
      function GXYZUtil () {
        _classCallCheck(this, GXYZUtil);

        this.tileSize = 256;
      }
      /**
       * 设置过滤条件
       */


      _createClass(GXYZUtil, [{
        key: "setFilter",
        value: function setFilter (filter, callback) {
          for (var i = 0; i < filter.layers.length; i++) {
            var filterLayer = filter.layers[i];

            if (!filterLayer.id) {
              filter.layers.splice(i, 1);
            }
          }

          var control = JSON.stringify(filter);

          if (this.isIE()) {
            //设置过滤条件
            Object(_utils_es6_promise__WEBPACK_IMPORTED_MODULE_0__[/* getJSON */ "c"])({
              type: 'post',
              url: this.host + '/mapserver/vmap/' + this.servername + '/setControl',
              data: 'control= ' + control,
              dataType: 'json'
            }).then(function (result) {
              result.isIE = true;
              callback(result);
            }.bind(this));
          } else {
            var result = {
              isIE: false,
              id: encodeURIComponent(control)
            };
            callback(result);
          }
        }
        /**
         * 解析url
         */

      }, {
        key: "parseUrl",
        value: function parseUrl (url) {
          var urlParts = url.split('?'); // var urlPartOne = urlParts[0].split('/mapserver/vmap/');

          var urlPartOne = urlParts[0].split('/mapserver/');
          this.host = urlPartOne[0];
          this.servername = urlPartOne[1].split('/')[1];
          var params = urlParts[1].split('&');

          for (var i = 0; i < params.length; i++) {
            var param = params[i];
            var keyValue = param.split('=');

            if (keyValue[0] == 'styleId') {
              this.styleId = keyValue[1];
              return;
            }
          }
        }
        /**
         * 拾取要素
         * Parameters :
         * level 要拾取的要素所在的层级
         * lat 经纬度值
         * lon 经纬度值
         * callback - 拾取到要素后的回调函数
         */

      }, {
        key: "pickupFeaturesBylatlng",
        value: function pickupFeaturesBylatlng (level, control, controlId, lat, lon, includelabel, timeStamp, callback) {
          var url = this.host + '/mapserver/' + this.servername + '/' + this.styleId + '/pickup?level=' + level + '&lon=' + lon + '&lat=' + lat + '&clientVersion=' + _ext_Version__WEBPACK_IMPORTED_MODULE_3__[/* default */ "a"] + "&includelabel=" + includelabel;

          if (control) {
            url = url + '&control=' + control;
          }

          if (timeStamp) {
            url = url + '&_t__=' + timeStamp;
          }

          if (controlId) {
            url = url + '&controlId=' + controlId;
          }

          Object(_utils_es6_promise__WEBPACK_IMPORTED_MODULE_0__[/* getJSON */ "c"])({
            url: url,
            dataType: "json"
          }).then(function (features) {
            callback(features);
          }, function () {
            callback([]);
          });
        }
        /**
         * 拾取要素
         * Parameters :
         * row - 要拾取的要素所在的行
         * col - 要拾取的要素所在的列
         * level - 要拾取的要素所在的层级
         * x - 要拾取的要素所在瓦片内的x坐标
         * y - 要拾取的要素所在瓦片内y坐标
         * control - 过滤的json对象
         * controlId - 过滤对象在服务器上存的key
         * callback - 拾取到要素后的回调函数
         */

      }, {
        key: "pickupFeatures",
        value: function pickupFeatures (row, col, level, x, y, control, controlId, timeStamp, callback) {
          var url = this.host + '/mapserver/pickup/' + this.servername + '/getData?x=' + col + '&y=' + row + '&l=' + level + '&pixelX=' + x + '&pixelY=' + y + '&styleId=' + this.styleId + '&tilesize=' + this.tileSize + '&clientVersion=' + _ext_Version__WEBPACK_IMPORTED_MODULE_3__[/* default */ "a"];

          if (control) {
            url = url + '&control=' + control;
          }

          if (timeStamp) {
            url = url + '&_t__=' + timeStamp;
          }

          if (controlId) {
            url = url + '&controlId=' + controlId;
          }

          Object(_utils_es6_promise__WEBPACK_IMPORTED_MODULE_0__[/* getJSON */ "c"])({
            url: url,
            dataType: "json"
          }).then(function (features) {
            callback(features);
          }, function () {
            callback([]);
          });
        }
        /**
         * 构造高亮的filter
         * Parameters :
         * features - 要素数组
         * style - 高亮样式 如：{color:"red",opacity:0.8};
         */
        // CreateHighlightFilter(layerFeatures,style){
        //     var filter = new Filter();
        //     filter.otherDisplay = false;
        //
        //     for(var layerId in layerFeatures){
        //         var fs = layerFeatures[layerId];
        //         var hasFid = false;
        //         for(var fid in fs){
        //             var filterLayer = new FilterLayer();
        //             filterLayer.id = layerId;
        //             filterLayer.idFilter = fid;
        //             filterLayer.color = style;
        //             filter.addFilterLayer(filterLayer);
        //             hasFid = true;
        //         }
        //         if(!hasFid){
        //             var filterLayer = new FilterLayer();
        //             filterLayer.id = layerId;
        //             filterLayer.color = style;
        //             filter.addFilterLayer(filterLayer);
        //         }
        //     }
        //     return filter;
        // };

      }, {
        key: "CreateHighlightFilter",
        value: function CreateHighlightFilter (layerFeatures, style) {
          var filter = new _filter_Filter__WEBPACK_IMPORTED_MODULE_1__[/* default */ "a"]();
          filter.otherDisplay = false;

          for (var layerId in layerFeatures) {
            var fs = layerFeatures[layerId];
            var filterLayer = new _filter_FilterLayer__WEBPACK_IMPORTED_MODULE_2__[/* default */ "a"]();
            filterLayer.id = layerId;
            filterLayer.color = style;
            var idFilter = '';

            for (var fid in fs) {
              idFilter = idFilter + fid + ',';
            }

            if (idFilter.length > 0) {
              idFilter = idFilter.substr(0, idFilter.length - 1);
              filterLayer.idFilter = idFilter;
            }

            filter.addFilterLayer(filterLayer);
          }

          return filter;
        }
        /**
         * 构造高亮的filter,每个要素都有高亮样式
         * Parameters :
         * layerFeatures - 要素数组
         */

      }, {
        key: "CreateEveryHighlightFilter",
        value: function CreateEveryHighlightFilter (layerFeatures) {
          var filter = new _filter_Filter__WEBPACK_IMPORTED_MODULE_1__[/* default */ "a"]();
          filter.otherDisplay = false;

          for (var layerId in layerFeatures) {
            var fs = layerFeatures[layerId];
            var layerStyle = fs.style;
            var hasFid = false;

            for (var fid in fs) {
              var style = fs[fid].style; // style.color = style.color.replace('#','%23');

              var filterLayer = new _filter_FilterLayer__WEBPACK_IMPORTED_MODULE_2__[/* default */ "a"]();
              filterLayer.id = layerId;
              filterLayer.idFilter = fid;
              filterLayer.color = style;
              filter.addFilterLayer(filterLayer);
              hasFid = true;
            }

            if (!hasFid && layerStyle) {
              // layerStyle.color = layerStyle.color.replace('#','%23');
              var filterLayer1 = new _filter_FilterLayer__WEBPACK_IMPORTED_MODULE_2__[/* default */ "a"]();
              filterLayer1.id = layerId;
              filterLayer1.color = layerStyle;
              filter.addFilterLayer(filterLayer1);
            }
          }

          return filter;
        }
        /**
         * 是否为ie浏览器,ie9 除外，ie9无法跨域发送post带数据的请求
         */

      }, {
        key: "isIE",
        value: function isIE () {
          if (!!window.ActiveXObject || "ActiveXObject" in window) {
            //ie9 除外，ie9无法跨域发送post带数据的请求
            var b_version = navigator.appVersion;
            var version = b_version.split(";");

            if (version[1]) {
              var trim_Version = version[1].replace(/[ ]/g, "");

              if (trim_Version == 'MSIE9.0') {
                return false;
              }
            }

            return true;
          } else return false;
        }
      }]);

      return GXYZUtil;
    }();

/* harmony default export */ __webpack_exports__["a"] = (GXYZUtil);

    /***/
  }),
/* 9 */
/***/ (function (module, __webpack_exports__, __webpack_require__) {

    "use strict";
/* harmony import */ var _GXYZUtil__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8);
/* harmony import */ var _utils_es6_promise__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1);
    function _typeof (obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof (obj) { return typeof obj; }; } else { _typeof = function _typeof (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

    function _classCallCheck (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    function _defineProperties (target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

    function _createClass (Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

    function _inherits (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

    function _setPrototypeOf (o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf (o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

    function _createSuper (Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal () { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

    function _possibleConstructorReturn (self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

    function _assertThisInitialized (self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

    function _isNativeReflectConstruct () { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () { })); return true; } catch (e) { return false; } }

    function _getPrototypeOf (o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf (o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }




    var GVMapGridUtil = /*#__PURE__*/function (_GXYZUtil) {
      _inherits(GVMapGridUtil, _GXYZUtil);

      var _super = _createSuper(GVMapGridUtil);

      function GVMapGridUtil (isDynamicMap) {
        var _this;

        _classCallCheck(this, GVMapGridUtil);

        _this = _super.call(this); //纹理

        _this.textures = {};
        _this.isDynamicMap = isDynamicMap;
        _this.styleObj = {};
        return _this;
      }
      /**
       * 设置样式文件
       */


      _createClass(GVMapGridUtil, [{
        key: "setStyle",
        value: function setStyle (styleObj) {
          this.styleObj = styleObj; // this.styleFun = new Function("drawer","level", styleStr);
          // if(this.styleDef){
          //     this.styleDef.resolve();
          // }
        }
      }, {
        key: "formatStyle",
        value: function formatStyle (styleObj, successFun) {
          this.styleObj = styleObj;
          var styleJson = JSON.stringify(this.styleObj);
          Object(_utils_es6_promise__WEBPACK_IMPORTED_MODULE_1__[/* getJSON */ "c"])({
            type: 'post',
            url: this.host + '/mapserver/styleInfo/format.do',
            data: 'styleJson= ' + styleJson,
            dataType: 'json'
          }).then(function (result) {
            this.styleFun = new Function("drawer", "level", result.styleJs);
            successFun();
          }.bind(this));
        }
        /**
         * 加载样式文件和纹理数据
         */

      }, {
        key: "loadStyle",
        value: function loadStyle (styleType) {
          var def1 = new _utils_es6_promise__WEBPACK_IMPORTED_MODULE_1__[/* Deferred */ "a"]();
          var def2 = new _utils_es6_promise__WEBPACK_IMPORTED_MODULE_1__[/* Deferred */ "a"]();

          if (!styleType) {
            styleType = 'label';
          }

          if (this.isDynamicMap) {
            var styleJson = JSON.stringify(this.styleObj);
            Object(_utils_es6_promise__WEBPACK_IMPORTED_MODULE_1__[/* getJSON */ "c"])({
              type: 'post',
              url: 'http://127.0.0.1/mapserver/styleInfo/format.do',
              data: 'styleJson= ' + styleJson,
              dataType: 'json'
            }).then(function (result) {
              this.styleFun = new Function("drawer", "level", result.styleJs);
              def1.resolve();
            }.bind(this));
          } else {
            //请求样式文件
            Object(_utils_es6_promise__WEBPACK_IMPORTED_MODULE_1__[/* getJSON */ "c"])({
              url: this.host + '/mapserver/styleInfo/' + this.servername + '/' + this.styleId + '/' + styleType + '/style.js?' + Math.random(),
              dataType: 'text'
            }).then(function (result) {
              this.styleFun = new Function("drawer", "level", result);
              def1.resolve();
            }.bind(this));
          } //请求图标纹理


          Object(_utils_es6_promise__WEBPACK_IMPORTED_MODULE_1__[/* getJSON */ "c"])({
            url: this.host + '/mapserver/styleInfo/' + this.servername + '/' + this.styleId + '/label/texture.js?' + Math.random(),
            dataType: 'text'
          }).then(function (result) {
            var textures = JSON.parse(result);
            var totalCount = 0;

            for (var i in textures) {
              if (textures[i]) {
                totalCount++;
              }
            }

            if (totalCount == 0) {
              def2.resolve();
              return;
            }

            var count = 0;

            for (var key in textures) {
              var img = new Image();
              img.name = key;

              img.onload = function (data) {
                count++;
                var name = data.target.name;
                this.textures[name] = data.target;

                if (count == totalCount) {
                  def2.resolve();
                }
              }.bind(this);

              img.src = textures[key];
            }
          }.bind(this));
          return [def1, def2];
        }
      }]);

      return GVMapGridUtil;
    }(_GXYZUtil__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"]);

/* harmony default export */ __webpack_exports__["a"] = (GVMapGridUtil);

    /***/
  }),
/* 10 */
/***/ (function (module, __webpack_exports__, __webpack_require__) {

    "use strict";

    // CONCATENATED MODULE: ./src/utils/uuid.js
    function UUID () {
      this.id = this.createUUID();
    }

    UUID.prototype.valueOf = function () {
      return this.id;
    };

    UUID.prototype.toString = function () {
      return this.id;
    };

    UUID.prototype.createUUID = function () {
      var c = new Date(1582, 10, 15, 0, 0, 0, 0);
      var f = new Date();
      var h = f.getTime() - c.getTime();
      var i = UUID.getIntegerBits(h, 0, 31);
      var g = UUID.getIntegerBits(h, 32, 47);
      var e = UUID.getIntegerBits(h, 48, 59) + "2";
      var b = UUID.getIntegerBits(UUID.rand(4095), 0, 7);
      var d = UUID.getIntegerBits(UUID.rand(4095), 0, 7);
      var a = UUID.getIntegerBits(UUID.rand(8191), 0, 7) + UUID.getIntegerBits(UUID.rand(8191), 8, 15) + UUID.getIntegerBits(UUID.rand(8191), 0, 7) + UUID.getIntegerBits(UUID.rand(8191), 8, 15) + UUID.getIntegerBits(UUID.rand(8191), 0, 15);
      return i + g + e + b + d + a;
    };

    UUID.getIntegerBits = function (f, g, b) {
      var a = UUID.returnBase(f, 16);
      var d = new Array();
      var e = "";
      var c = 0;

      for (c = 0; c < a.length; c++) {
        d.push(a.substring(c, c + 1));
      }

      for (c = Math.floor(g / 4); c <= Math.floor(b / 4); c++) {
        if (!d[c] || d[c] == "") {
          e += "0";
        } else {
          e += d[c];
        }
      }

      return e;
    };

    UUID.returnBase = function (c, d) {
      var e = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

      if (c < d) {
        var b = e[c];
      } else {
        var f = "" + Math.floor(c / d);
        var a = c - f * d;

        if (f >= d) {
          var b = this.returnBase(f, d) + e[a];
        } else {
          var b = e[f] + e[a];
        }
      }

      return b;
    };

    UUID.rand = function (a) {
      return Math.floor(Math.random() * a);
    };

/* harmony default export */ var uuid = (UUID);
    // CONCATENATED MODULE: ./src/layer/datasource/DataSource.js
    function _classCallCheck (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    /**
     * Created by kongjian on 2017/6/30.
     */


    var DataSource_DataSource = function DataSource () {
      _classCallCheck(this, DataSource);

      //数据源id
      this.id = new uuid().valueOf(); //数据源类型

      this.type = ""; //key为文件名，value为image对象

      this.textures = {};
    };

/* harmony default export */ var datasource_DataSource = __webpack_exports__["a"] = (DataSource_DataSource);

    /***/
  }),
/* 11 */
/***/ (function (module, __webpack_exports__, __webpack_require__) {

    "use strict";
    function _classCallCheck (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    function _defineProperties (target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

    function _createClass (Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

    /**
     * Created by kongjian on 2017/6/30.
     */
    var FilterLayer = /*#__PURE__*/function () {
      function FilterLayer () {
        _classCallCheck(this, FilterLayer);

        //过滤图层的唯一标识
        this.id = null; //过滤条件

        this.filters = {}; //过滤数据的唯一id标识

        this.idFilter = null; //过滤字符串,与制图系统中的过滤字符串一致，如果同时也有filters，服务会优先使用filterStr

        this.filterStr = null; //是否显示

        this.display = true; //高亮对象,默认为null时，使用配图的默认样式。 示例：{"color":"%23f00fff","opacity":0.9}， 其中颜色值必须用%23开头

        this.color = null;
      }
      /**
       * 添加字段过滤条件
       * Parameters :
       * key - 如： Q_fcode_S_EQ，表示fcode等于value的值
       * value - 如：2101010500
       */


      _createClass(FilterLayer, [{
        key: "addFilterField",
        value: function addFilterField (key, value) {
          this.filters[key] = value;
        }
        /**
         * 添加字段过滤条件
         * Parameters :
         * key
         */

      }, {
        key: "removeFilterField",
        value: function removeFilterField (key) {
          delete this.filters[key];
        }
      }]);

      return FilterLayer;
    }();

/* harmony default export */ __webpack_exports__["a"] = (FilterLayer);

    /***/
  }),
/* 12 */
/***/ (function (module, __webpack_exports__, __webpack_require__) {

    "use strict";
    function _classCallCheck (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    function _defineProperties (target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

    function _createClass (Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

    /**
     * Created by matt on 2017/3/5.
     */
    var GDistance = /*#__PURE__*/function () {
      function GDistance () {
        _classCallCheck(this, GDistance);
      }

      _createClass(GDistance, [{
        key: "getLengthPoint",
        value: function getLengthPoint (fromX, fromY, toX, toY, len, index) {
          var dx = toX - fromX;
          var dy = toY - fromY;
          var x_new;
          var y_new;

          if (dx == 0) {
            x_new = toX;

            if (dy > 0) {
              y_new = fromY + len;
            } else {
              y_new = fromY - len;
            }

            if (index == null) {
              return [x_new, y_new];
            } else {
              return [x_new, y_new, index];
            }
          }

          var tan = dy / dx;
          var sec = Math.sqrt(tan * tan + 1);
          var dx_new = Math.abs(len / sec);
          var dy_new = Math.abs(dx_new * tan);

          if (dx > 0) {
            x_new = fromX + dx_new;
          } else {
            x_new = fromX - dx_new;
          }

          if (dy > 0) {
            y_new = fromY + dy_new;
          } else {
            y_new = fromY - dy_new;
          }

          if (index == null) {
            return [x_new, y_new];
          } else {
            return [x_new, y_new, index];
          }
        }
      }, {
        key: "getAngle",
        value: function getAngle (p1, p2) {
          if (p2[0] - p1[0] == 0) {
            if (p2[1] > p1[0]) {
              return 90;
            } else {
              return -90;
            }
          }

          var k = (p2[1] - p1[1]) / (p2[0] - p1[0]);
          var angle = 360 * Math.atan(k) / (2 * Math.PI);
          return angle;
        }
      }, {
        key: "length",
        value: function length (x0, y0, x1, y1) {
          var dx = x1 - x0;
          var dy = y1 - y0;
          var len = Math.sqrt(dx * dx + dy * dy);
          return len;
        }
      }, {
        key: "getNodePath",
        value: function getNodePath (coords, interval) {
          var previous = [];
          var points = {};
          var pointList = [];
          var intervalLength = interval.length; //初始化标记长度等于单位长度

          var fun_getInterval = function fun_getInterval (interval) {
            var value = interval[0];
            interval.splice(0, 1);
            return value;
          };

          var markLength = fun_getInterval(interval);
          var index = 0;

          while (1 == 1) {
            if (pointList.length == intervalLength) {
              points.index = index;
              points.pointList = pointList;
              return points;
            }

            if (index >= coords.length) {
              points.index = index;
              points.pointList = pointList;
              return points;
            }

            var x = coords[index];
            var y = coords[index + 1]; //判断上一个节点是否为空

            if (previous.length == 0) {
              //如果为空就设置当前点到 上一个节点上
              previous[0] = x;
              previous[1] = y;
              continue;
            } else {
              //如果不为空则需要求上一个节点与当前结点的距离
              var lengthPath = this.length(previous[0], previous[1], x, y); //把节点长度加起来

              if (lengthPath >= markLength) {
                //如果长度大于标记长度，则需要上一点到标记成都的点
                var savePoint = this.getLengthPoint(previous[0], previous[1], x, y, markLength, null);
                var angle = this.getAngle(previous, [x, y]);

                if (angle == 90) {
                  angle = 0;
                }

                if (angle == -90) {
                  angle = 0;
                }

                if (angle == 0) {
                  angle = 0.5;
                } //保证竖方向的字是正的


                if (angle >= 45) {
                  angle = angle - 90;
                } else {
                  if (angle <= -45) {
                    angle = angle + 90;
                  }
                }

                var pointAngle = [savePoint, angle];
                pointList.push(pointAngle);
                previous[0] = savePoint[0];
                previous[1] = savePoint[1];
                markLength = fun_getInterval(interval);
              } else {
                markLength = markLength - lengthPath;
                previous[0] = x;
                previous[1] = y;
                index = index + 2;
              }
            }
          }

          points.index = index;
          points.pointList = pointList;
          return points;
        }
      }]);

      return GDistance;
    }();

/* harmony default export */ __webpack_exports__["a"] = (GDistance);

    /***/
  }),
/* 13 */
/***/ (function (module, __webpack_exports__, __webpack_require__) {

    "use strict";
    function _classCallCheck (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    function _defineProperties (target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

    function _createClass (Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

    /**
     * Created by kongjian on 2017/6/30.
     */
    var Filter = /*#__PURE__*/function () {
      function Filter () {
        _classCallCheck(this, Filter);

        //该值为ture时，后面的layers是全部要显示的，如果为false，后面的layers全部不显示,顶替上面的cmdAll
        this.otherDisplay = true; //图层集合

        this.layers = []; //里面存放layerName，最终渲染的图层顺序以该图层存放的顺序为准，如果为空数组，则以样式文件中的顺序为准. 注记图层，该属性会被忽略

        this.order = [];
      }
      /**
       * 添加过滤图层
       * Parameters :
       * filterLayer - 过滤图层
       */


      _createClass(Filter, [{
        key: "addFilterLayer",
        value: function addFilterLayer (filterLayer) {
          this.layers.push(filterLayer);
        }
        /**
         * 移除过滤图层
         * Parameters :
         * filterLayerId - 过滤图层ID
         */

      }, {
        key: "removeFilterLayerById",
        value: function removeFilterLayerById (filterLayerId) {
          for (var i = 0; i < this.layers.length; i++) {
            if (this.layers[i].id == filterLayerId) {
              this.layers.splice(i, 1);
            }
          }
        }
      }]);

      return Filter;
    }();

/* harmony default export */ __webpack_exports__["a"] = (Filter);

    /***/
  }),
/* 14 */
/***/ (function (module, __webpack_exports__, __webpack_require__) {

    "use strict";

    // CONCATENATED MODULE: ./src/utils/gistools/GridFilter.js
    function _classCallCheck (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    function _defineProperties (target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

    function _createClass (Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

    var GridFilter = /*#__PURE__*/function () {
      /**
       *
       * @param tilesize 瓦片大小
       * @param cellsize 小正方形网格的宽
       * @param buffer  外扩多少像素
       * @param maxPerCell  小正方形中允许放多小个注记
       */
      function GridFilter (tilesize, cellsize, buffer, maxPerCell) {
        _classCallCheck(this, GridFilter);

        var n = tilesize / cellsize;
        var padding = buffer / cellsize;
        this.maxPerCell = maxPerCell == null ? 1 : maxPerCell;
        this.cells = {};
        this.d = n + 2 * padding;
        this.n = n;
        this.padding = padding;
        this.scale = n / tilesize;
        var p = padding / n * tilesize;
        this.min = -p;
        this.max = tilesize + p;
      }
      /**
       *  是否能放下指定的点
       * @param x
       * @param y
       * @returns {boolean}
       */


      _createClass(GridFilter, [{
        key: "filter",
        value: function filter (x, y) {
          if (x < this.min || x > this.max || y < this.min || y > this.max) {
            return false;
          }

          var cx = this.convertToCellCoord(x);
          var cy = this.convertToCellCoord(y);
          var cellIndex = this.d * cy + cx; //console.log('格网号：'+cellIndex);

          if (this.cells[cellIndex] >= this.maxPerCell) {
            return false;
          } else {
            var i = this.cells[cellIndex];

            if (i == null) {
              this.cells[cellIndex] = 1;
            } else {
              this.cells[cellIndex] = i++;
            }

            return true;
          }
        }
        /**
         *  是否能放下指定的box
         * @param box
         * @returns {boolean}
         */

      }, {
        key: "filterByBox",
        value: function filterByBox (box) {
          var startX = this.convertToCellCoord(box[0]);
          var endX = this.convertToCellCoord(box[2]);
          var startY = this.convertToCellCoord(box[1]);
          var endY = this.convertToCellCoord(box[3]);

          for (var i = startX; i <= endX; i++) {
            for (var j = startY; j <= endY; j++) {
              var cellIndex = this.d * j + i; //如果任意一个小格网被占用，则本box不能放下

              if (this.cells[cellIndex]) {
                return false;
              }
            }
          } //标识小格网被占用


          for (var _i = startX; _i <= endX; _i++) {
            for (var _j = startY; _j <= endY; _j++) {
              var _cellIndex = this.d * _j + _i;

              this.cells[_cellIndex] = 1;
            }
          }

          return true;
        }
      }, {
        key: "clean",
        value: function clean () {
          this.cells = {};
          this.saveCount = 0;
        }
      }, {
        key: "convertToCellCoord",
        value: function convertToCellCoord (x) {
          return Math.max(0, Math.min(this.d - 1, Math.floor(x * this.scale) + this.padding));
        }
      }]);

      return GridFilter;
    }();

/* harmony default export */ var gistools_GridFilter = (GridFilter);
    // EXTERNAL MODULE: ./src/layer/label/avoid/Util.js
    var Util = __webpack_require__(4);

    // EXTERNAL MODULE: ./src/utils/gistools/GisTools.js
    var GisTools = __webpack_require__(5);

    // CONCATENATED MODULE: ./src/layer/label/avoid/GridFilterLabel.js
    function GridFilterLabel_classCallCheck (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    function GridFilterLabel_defineProperties (target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

    function GridFilterLabel_createClass (Constructor, protoProps, staticProps) { if (protoProps) GridFilterLabel_defineProperties(Constructor.prototype, protoProps); if (staticProps) GridFilterLabel_defineProperties(Constructor, staticProps); return Constructor; }





    var GridFilterLabel_GridFilterLabel = /*#__PURE__*/function () {
      function GridFilterLabel () {
        GridFilterLabel_classCallCheck(this, GridFilterLabel);
      }

      GridFilterLabel_createClass(GridFilterLabel, null, [{
        key: "fristFilter",

        /**
         *  第一次初步过滤
         * @param pointFeatures 点注记集合
         * @param lineFeatures 线注记集合
         * @param styleMap 样式map
         * @param ableWeight 全局是否权重避让
         * @param needSort 第一次过滤是否需要排序
         * @param tilesize 瓦片大小
         * @param cellsize 每个小网格宽度
         * @param buffer 外扩多大像素
         * @param maxPerCell 每个网格内最多放多少个点
         * @returns {{pointFeatures: Array, lineFeatures: Array, importantFeatures: Array}}
         */
        value: function fristFilter (pointFeatures, lineFeatures, styleMap, ableWeight, needSort, tilesize, cellsize, buffer, maxPerCell) {
          if (ableWeight && needSort) {
            Util["a" /* default */].sort(pointFeatures);
            Util["a" /* default */].sort(lineFeatures);
          } //第一次过滤


          pointFeatures = GridFilterLabel.fristFilterStart(pointFeatures, tilesize, cellsize, buffer, maxPerCell);
          lineFeatures = GridFilterLabel.fristFilterStart(lineFeatures, tilesize, cellsize, buffer, maxPerCell);
          return {
            pointFeatures: pointFeatures,
            lineFeatures: lineFeatures
          };
        }
        /**
         *  第二次初步过滤
         * @param pointFeatures 点注记集合
         * @param lineFeatures 线注记集合
         * @param styleMap 样式map
         * @param ableWeight 全局是否权重避让
         * @param needSort 第二次过滤是否需要排序
         * @param tilesize 全局画布最大宽
         * @param cellsize 每个小网格宽度
         * @param buffer 外扩多大像素
         * @param maxPerCell 每个网格内最多放多少个点
         * @returns {{pointFeatures: Array, lineFeatures: Array, importantFeatures: Array}}
         */

      }, {
        key: "scendFilter",
        value: function scendFilter (pointFeatures, lineFeatures, styleMap, ableWeight, needSort, tilesize, cellsize, buffer, maxPerCell) {
          if (ableWeight && needSort) {
            Util["a" /* default */].sort(pointFeatures);
            Util["a" /* default */].sort(lineFeatures);
          } //第二次过滤


          pointFeatures = GridFilterLabel.scendFilterStart(pointFeatures, tilesize, 16, buffer);
          lineFeatures = GridFilterLabel.scendFilterStart(lineFeatures, tilesize, 16, buffer);
          var returnFeatures = [];
          returnFeatures = returnFeatures.concat(pointFeatures);
          returnFeatures = returnFeatures.concat(lineFeatures);
          return returnFeatures;
        } // /**
        //  * 将注记分类为点注记，线注记和重要的注记
        //  * @param labelFeatures
        //  * @param styleMap
        //  * @returns {{pointFeatures: Array, lineFeatures: Array, importantFeatures: Array}}
        //  */
        // static getPointLineFeatures(labelFeatures,styleMap){
        //     let pointFeatures = [];
        //     let lineFeatures = [];
        //     //所有需要保留不参与第二次过滤的注记
        //     let importantFeatures = [];
        //     //分离出点注记和线注记
        //     for(let i = 0;i<labelFeatures.length;i++){
        //         let feature = labelFeatures[i];
        //         let style = styleMap[feature.styleId];
        //         //如果不是重要的必须显示要素
        //         if(style.isImportant){
        //             importantFeatures.push(feature);
        //         }else{
        //             let radius = 0;
        //             let p = [0,0];
        //             if(feature.type == 1){
        //                 if(style.pointBoxDisance){
        //                     radius = style.pointBoxDisance*0.5;
        //                     p = feature.datas[0];
        //                     feature.filterBox = [p[0]-radius,p[1]-radius,p[0]+radius,p[1]+radius];
        //                     pointFeatures.push(feature);
        //                 }
        //             }
        //
        //             if(feature.type == 2){
        //                 if(feature.lineType == 'text'){
        //                     //线文字注记默认外扩距离设置为100
        //                     radius = 50;
        //                     let centerIndex = Math.floor(feature.datas.length / 2);
        //                     p = feature.datas[centerIndex][0];
        //                     // if(style.lineTextBoxDisance){
        //                     //     radius = style.lineTextBoxDisance*0.5;
        //                     // }
        //                 }
        //                 if(feature.lineType == 'code'){
        //                     p = feature.datas[0][0];
        //                     if(style.lineCodeBoxDisance){
        //                         radius = style.lineCodeBoxDisance*0.5;
        //                     }
        //                 }
        //             }
        //
        //             //设置外扩距离的注记才进行第二次过滤
        //             if(radius > 0){
        //                 feature.filterBox = [p[0]-radius,p[1]-radius,p[0]+radius,p[1]+radius];
        //                 lineFeatures.push(feature);
        //             }else{
        //                 importantFeatures.push(feature);
        //             }
        //         }
        //     }
        //
        //     return {pointFeatures:pointFeatures,lineFeatures:lineFeatures,importantFeatures:importantFeatures};
        // }

        /**
         *  移除瓦片外的点注记
         * @param features
         * @param tilesize
         */

      }, {
        key: "removeTileOutPointFeatures",
        value: function removeTileOutPointFeatures (features, tileSize) {
          var newFeatures = [];

          for (var i = 0; i < features.length; i++) {
            var feature = features[i];
            var pt = feature.centerPoint;

            if (pt[0] >= 0 && pt[0] <= tileSize && pt[1] >= 0 && pt[1] <= tileSize) {
              newFeatures.push(feature);
            }
          }

          return newFeatures;
        }
        /**
         *  移除瓦片外的线注记
         * @param features
         * @param tilesize
         */

      }, {
        key: "removeTileOutLineFeatures",
        value: function removeTileOutLineFeatures (features, tileSize) {
          var newFeatures = [];

          for (var i = 0; i < features.length; i++) {
            var feature = features[i];

            for (var j = 0; j < feature.datas.length; j++) {
              var pt = feature.datas[j][0];

              if (pt[0] >= 0 && pt[0] <= tileSize && pt[1] >= 0 && pt[1] <= tileSize) {
                newFeatures.push(feature);
                break;
              }
            }
          }

          return newFeatures;
        }
        /**
         *  注记第一次初步格网过滤
         * @param features
         * @param tilesize 瓦片大小
         * @param cellsize 小正方形网格的宽
         * @param buffer  外扩多少像素
         * @param maxPerCell  小正方形中允许放多小个注记
         * @returns {Array}
         */

      }, {
        key: "fristFilterStart",
        value: function fristFilterStart (features, tilesize, cellsize, buffer, maxPerCell) {
          var gridFilter = new gistools_GridFilter(tilesize, cellsize, buffer, maxPerCell);
          var returnFeatures = [];

          for (var i = 0; i < features.length; i++) {
            var feature = features[i];
            var bool = gridFilter.filter(feature.centerPoint[0], feature.centerPoint[1]);

            if (bool) {
              returnFeatures.push(feature);
            }
          }

          return returnFeatures;
        }
        /**
         *  注记第二次box格网过滤
         * @param features
         * @param tilesize 瓦片大小
         * @param cellsize 小正方形网格的宽
         * @param buffer  外扩多少像素
         * @param maxPerCell  小正方形中允许放多小个注记
         * @returns {Array}
         */

      }, {
        key: "scendFilterStart",
        value: function scendFilterStart (features, tilesize, cellsize, buffer) {
          var gridFilter = new gistools_GridFilter(tilesize, cellsize, buffer, 1);
          var returnFeatures = [];

          for (var i = 0; i < features.length; i++) {
            var feature = features[i];
            var bool = gridFilter.filterByBox(feature.filterBox);

            if (bool) {
              returnFeatures.push(feature);
            }
          }

          return returnFeatures;
        }
        /**
         *  第三次过滤，注记去重
         * @param features
         * @param tileSize
         * @returns {Array}
         */

      }, {
        key: "threeFilter",
        value: function threeFilter (features, styleMap, tileSize) {
          var fs = GridFilterLabel.getImportantOtherFeatures(features, styleMap);
          var labelMap = Util["a" /* default */].groupByLabel(fs.otherFeatures);
          var returnFeatures = [];
          var box2 = [0, 0, tileSize, tileSize];

          for (var label in labelMap) {
            var labelArr = labelMap[label];

            if (labelArr.length == 1) {
              returnFeatures.push(labelArr[0]);
            } else {
              var inBoxFeatures = [];

              for (var i = 0; i < labelArr.length; i++) {
                var feature = labelArr[i];

                if (feature.type == 1) {
                  if (GisTools["a" /* default */].isInBox(feature.box, box2)) {
                    inBoxFeatures.push(feature);
                  } else {
                    returnFeatures.push(feature);
                  }
                }

                if (feature.type == 2) {
                  var isInBox = true;

                  for (var j = 0; j < feature.boxs.length; j++) {
                    var box = feature.boxs[j];

                    if (!GisTools["a" /* default */].isInBox(box, box2)) {
                      isInBox = false;
                      break;
                    }
                  }

                  if (isInBox) {
                    inBoxFeatures.push(feature);
                  } else {
                    returnFeatures.push(feature);
                  }
                }
              }

              if (inBoxFeatures.length > 0) {
                //按照权重排序
                inBoxFeatures = Util["a" /* default */].sortPrimaryId(inBoxFeatures); //保留第一个
                // returnFeatures.push(inBoxFeatures[0]);

                returnFeatures = returnFeatures.concat(GridFilterLabel.distinctFeatures(inBoxFeatures, styleMap));
              }
            }
          }

          returnFeatures = returnFeatures.concat(fs.importantFeatures);
          return returnFeatures;
        }
      }, {
        key: "distinctFeatures",
        value: function distinctFeatures (features, styleMap) {
          var feature = features[0];
          var field = '';

          if (feature.type == 1) {
            field = 'distance';
          }

          if (feature.type == 2) {
            if (feature.lineType == 'text') {
              field = 'lineTextDistance';
            }

            if (feature.lineType == 'code') {
              field = 'lineCodeDistance';
            }
          }

          var fs = [];
          fs.push(features[0]);

          for (var i = 0; i < features.length - 1; i++) {
            var _feature = features[i];

            if (_feature.hidden == true) {
              continue;
            }

            var nextFeature = features[i + 1]; //求两个点注记之间的距离

            var distance = GridFilterLabel.getDistance(_feature.centerPoint, nextFeature.centerPoint);
            var style = styleMap[_feature.styleId] ? styleMap[_feature.styleId] : _feature.style;
            var d = style[field] ? style[field] : 0;

            if (distance < d) {
              nextFeature.hidden = true;
            } else {
              fs.push(nextFeature);
            }
          }

          return fs;
        }
        /**
         * 求两点之间的距离
         */

      }, {
        key: "getDistance",
        value: function getDistance (p1, p2) {
          var calX = p2[0] - p1[0];
          var calY = p2[1] - p1[1];
          return Math.pow(calX * calX + calY * calY, 0.5);
        }
        /**
         *  将注记分为重要注记和非重要注记
         * @param features
         * @param styleMap
         */

      }, {
        key: "getImportantOtherFeatures",
        value: function getImportantOtherFeatures (features, styleMap) {
          var importantFeatures = [];
          var otherFeatures = [];

          for (var i = 0; i < features.length; i++) {
            var feature = features[i];
            var style = styleMap[feature.styleId];

            if (style.isImportant) {
              importantFeatures.push(feature);
            } else {
              otherFeatures.push(feature);
            }
          }

          return {
            otherFeatures: otherFeatures,
            importantFeatures: importantFeatures
          };
        }
      }]);

      return GridFilterLabel;
    }();

/* harmony default export */ var avoid_GridFilterLabel = __webpack_exports__["a"] = (GridFilterLabel_GridFilterLabel);

    /***/
  }),
/* 15 */
/***/ (function (module, exports, __webpack_require__) {

    "use strict";
/* WEBPACK VAR INJECTION */(function (global) {/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <http://feross.org>
 * @license  MIT
 */

      /* eslint-disable no-proto */


      var base64 = __webpack_require__(42);

      var ieee754 = __webpack_require__(43);

      var isArray = __webpack_require__(44);

      exports.Buffer = Buffer;
      exports.SlowBuffer = SlowBuffer;
      exports.INSPECT_MAX_BYTES = 50;
      /**
       * If `Buffer.TYPED_ARRAY_SUPPORT`:
       *   === true    Use Uint8Array implementation (fastest)
       *   === false   Use Object implementation (most compatible, even IE6)
       *
       * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
       * Opera 11.6+, iOS 4.2+.
       *
       * Due to various browser bugs, sometimes the Object implementation will be used even
       * when the browser supports typed arrays.
       *
       * Note:
       *
       *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
       *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
       *
       *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
       *
       *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
       *     incorrect length in some situations.
      
       * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
       * get the Object implementation, which is slower but behaves correctly.
       */

      Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined ? global.TYPED_ARRAY_SUPPORT : typedArraySupport();
      /*
       * Export kMaxLength after typed array support is determined.
       */

      exports.kMaxLength = kMaxLength();

      function typedArraySupport () {
        try {
          var arr = new Uint8Array(1);
          arr.__proto__ = {
            __proto__: Uint8Array.prototype,
            foo: function foo () {
              return 42;
            }
          };
          return arr.foo() === 42 && // typed array instances can be augmented
            typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
            arr.subarray(1, 1).byteLength === 0; // ie10 has broken `subarray`
        } catch (e) {
          return false;
        }
      }

      function kMaxLength () {
        return Buffer.TYPED_ARRAY_SUPPORT ? 0x7fffffff : 0x3fffffff;
      }

      function createBuffer (that, length) {
        if (kMaxLength() < length) {
          throw new RangeError('Invalid typed array length');
        }

        if (Buffer.TYPED_ARRAY_SUPPORT) {
          // Return an augmented `Uint8Array` instance, for best performance
          that = new Uint8Array(length);
          that.__proto__ = Buffer.prototype;
        } else {
          // Fallback: Return an object instance of the Buffer class
          if (that === null) {
            that = new Buffer(length);
          }

          that.length = length;
        }

        return that;
      }
      /**
       * The Buffer constructor returns instances of `Uint8Array` that have their
       * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
       * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
       * and the `Uint8Array` methods. Square bracket notation works as expected -- it
       * returns a single octet.
       *
       * The `Uint8Array` prototype remains unmodified.
       */


      function Buffer (arg, encodingOrOffset, length) {
        if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
          return new Buffer(arg, encodingOrOffset, length);
        } // Common case.


        if (typeof arg === 'number') {
          if (typeof encodingOrOffset === 'string') {
            throw new Error('If encoding is specified then the first argument must be a string');
          }

          return allocUnsafe(this, arg);
        }

        return from(this, arg, encodingOrOffset, length);
      }

      Buffer.poolSize = 8192; // not used by this implementation
      // TODO: Legacy, not needed anymore. Remove in next major version.

      Buffer._augment = function (arr) {
        arr.__proto__ = Buffer.prototype;
        return arr;
      };

      function from (that, value, encodingOrOffset, length) {
        if (typeof value === 'number') {
          throw new TypeError('"value" argument must not be a number');
        }

        if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
          return fromArrayBuffer(that, value, encodingOrOffset, length);
        }

        if (typeof value === 'string') {
          return fromString(that, value, encodingOrOffset);
        }

        return fromObject(that, value);
      }
      /**
       * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
       * if value is a number.
       * Buffer.from(str[, encoding])
       * Buffer.from(array)
       * Buffer.from(buffer)
       * Buffer.from(arrayBuffer[, byteOffset[, length]])
       **/


      Buffer.from = function (value, encodingOrOffset, length) {
        return from(null, value, encodingOrOffset, length);
      };

      if (Buffer.TYPED_ARRAY_SUPPORT) {
        Buffer.prototype.__proto__ = Uint8Array.prototype;
        Buffer.__proto__ = Uint8Array;

        if (typeof Symbol !== 'undefined' && Symbol.species && Buffer[Symbol.species] === Buffer) {
          // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
          Object.defineProperty(Buffer, Symbol.species, {
            value: null,
            configurable: true
          });
        }
      }

      function assertSize (size) {
        if (typeof size !== 'number') {
          throw new TypeError('"size" argument must be a number');
        } else if (size < 0) {
          throw new RangeError('"size" argument must not be negative');
        }
      }

      function alloc (that, size, fill, encoding) {
        assertSize(size);

        if (size <= 0) {
          return createBuffer(that, size);
        }

        if (fill !== undefined) {
          // Only pay attention to encoding if it's a string. This
          // prevents accidentally sending in a number that would
          // be interpretted as a start offset.
          return typeof encoding === 'string' ? createBuffer(that, size).fill(fill, encoding) : createBuffer(that, size).fill(fill);
        }

        return createBuffer(that, size);
      }
      /**
       * Creates a new filled Buffer instance.
       * alloc(size[, fill[, encoding]])
       **/


      Buffer.alloc = function (size, fill, encoding) {
        return alloc(null, size, fill, encoding);
      };

      function allocUnsafe (that, size) {
        assertSize(size);
        that = createBuffer(that, size < 0 ? 0 : checked(size) | 0);

        if (!Buffer.TYPED_ARRAY_SUPPORT) {
          for (var i = 0; i < size; ++i) {
            that[i] = 0;
          }
        }

        return that;
      }
      /**
       * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
       * */


      Buffer.allocUnsafe = function (size) {
        return allocUnsafe(null, size);
      };
      /**
       * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
       */


      Buffer.allocUnsafeSlow = function (size) {
        return allocUnsafe(null, size);
      };

      function fromString (that, string, encoding) {
        if (typeof encoding !== 'string' || encoding === '') {
          encoding = 'utf8';
        }

        if (!Buffer.isEncoding(encoding)) {
          throw new TypeError('"encoding" must be a valid string encoding');
        }

        var length = byteLength(string, encoding) | 0;
        that = createBuffer(that, length);
        var actual = that.write(string, encoding);

        if (actual !== length) {
          // Writing a hex string, for example, that contains invalid characters will
          // cause everything after the first invalid character to be ignored. (e.g.
          // 'abxxcd' will be treated as 'ab')
          that = that.slice(0, actual);
        }

        return that;
      }

      function fromArrayLike (that, array) {
        var length = array.length < 0 ? 0 : checked(array.length) | 0;
        that = createBuffer(that, length);

        for (var i = 0; i < length; i += 1) {
          that[i] = array[i] & 255;
        }

        return that;
      }

      function fromArrayBuffer (that, array, byteOffset, length) {
        array.byteLength; // this throws if `array` is not a valid ArrayBuffer

        if (byteOffset < 0 || array.byteLength < byteOffset) {
          throw new RangeError('\'offset\' is out of bounds');
        }

        if (array.byteLength < byteOffset + (length || 0)) {
          throw new RangeError('\'length\' is out of bounds');
        }

        if (byteOffset === undefined && length === undefined) {
          array = new Uint8Array(array);
        } else if (length === undefined) {
          array = new Uint8Array(array, byteOffset);
        } else {
          array = new Uint8Array(array, byteOffset, length);
        }

        if (Buffer.TYPED_ARRAY_SUPPORT) {
          // Return an augmented `Uint8Array` instance, for best performance
          that = array;
          that.__proto__ = Buffer.prototype;
        } else {
          // Fallback: Return an object instance of the Buffer class
          that = fromArrayLike(that, array);
        }

        return that;
      }

      function fromObject (that, obj) {
        if (Buffer.isBuffer(obj)) {
          var len = checked(obj.length) | 0;
          that = createBuffer(that, len);

          if (that.length === 0) {
            return that;
          }

          obj.copy(that, 0, 0, len);
          return that;
        }

        if (obj) {
          if (typeof ArrayBuffer !== 'undefined' && obj.buffer instanceof ArrayBuffer || 'length' in obj) {
            if (typeof obj.length !== 'number' || isnan(obj.length)) {
              return createBuffer(that, 0);
            }

            return fromArrayLike(that, obj);
          }

          if (obj.type === 'Buffer' && isArray(obj.data)) {
            return fromArrayLike(that, obj.data);
          }
        }

        throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.');
      }

      function checked (length) {
        // Note: cannot use `length < kMaxLength()` here because that fails when
        // length is NaN (which is otherwise coerced to zero.)
        if (length >= kMaxLength()) {
          throw new RangeError('Attempt to allocate Buffer larger than maximum ' + 'size: 0x' + kMaxLength().toString(16) + ' bytes');
        }

        return length | 0;
      }

      function SlowBuffer (length) {
        if (+length != length) {
          // eslint-disable-line eqeqeq
          length = 0;
        }

        return Buffer.alloc(+length);
      }

      Buffer.isBuffer = function isBuffer (b) {
        return !!(b != null && b._isBuffer);
      };

      Buffer.compare = function compare (a, b) {
        if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
          throw new TypeError('Arguments must be Buffers');
        }

        if (a === b) return 0;
        var x = a.length;
        var y = b.length;

        for (var i = 0, len = Math.min(x, y); i < len; ++i) {
          if (a[i] !== b[i]) {
            x = a[i];
            y = b[i];
            break;
          }
        }

        if (x < y) return -1;
        if (y < x) return 1;
        return 0;
      };

      Buffer.isEncoding = function isEncoding (encoding) {
        switch (String(encoding).toLowerCase()) {
          case 'hex':
          case 'utf8':
          case 'utf-8':
          case 'ascii':
          case 'latin1':
          case 'binary':
          case 'base64':
          case 'ucs2':
          case 'ucs-2':
          case 'utf16le':
          case 'utf-16le':
            return true;

          default:
            return false;
        }
      };

      Buffer.concat = function concat (list, length) {
        if (!isArray(list)) {
          throw new TypeError('"list" argument must be an Array of Buffers');
        }

        if (list.length === 0) {
          return Buffer.alloc(0);
        }

        var i;

        if (length === undefined) {
          length = 0;

          for (i = 0; i < list.length; ++i) {
            length += list[i].length;
          }
        }

        var buffer = Buffer.allocUnsafe(length);
        var pos = 0;

        for (i = 0; i < list.length; ++i) {
          var buf = list[i];

          if (!Buffer.isBuffer(buf)) {
            throw new TypeError('"list" argument must be an Array of Buffers');
          }

          buf.copy(buffer, pos);
          pos += buf.length;
        }

        return buffer;
      };

      function byteLength (string, encoding) {
        if (Buffer.isBuffer(string)) {
          return string.length;
        }

        if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' && (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
          return string.byteLength;
        }

        if (typeof string !== 'string') {
          string = '' + string;
        }

        var len = string.length;
        if (len === 0) return 0; // Use a for loop to avoid recursion

        var loweredCase = false;

        for (; ;) {
          switch (encoding) {
            case 'ascii':
            case 'latin1':
            case 'binary':
              return len;

            case 'utf8':
            case 'utf-8':
            case undefined:
              return utf8ToBytes(string).length;

            case 'ucs2':
            case 'ucs-2':
            case 'utf16le':
            case 'utf-16le':
              return len * 2;

            case 'hex':
              return len >>> 1;

            case 'base64':
              return base64ToBytes(string).length;

            default:
              if (loweredCase) return utf8ToBytes(string).length; // assume utf8

              encoding = ('' + encoding).toLowerCase();
              loweredCase = true;
          }
        }
      }

      Buffer.byteLength = byteLength;

      function slowToString (encoding, start, end) {
        var loweredCase = false; // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
        // property of a typed array.
        // This behaves neither like String nor Uint8Array in that we set start/end
        // to their upper/lower bounds if the value passed is out of range.
        // undefined is handled specially as per ECMA-262 6th Edition,
        // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.

        if (start === undefined || start < 0) {
          start = 0;
        } // Return early if start > this.length. Done here to prevent potential uint32
        // coercion fail below.


        if (start > this.length) {
          return '';
        }

        if (end === undefined || end > this.length) {
          end = this.length;
        }

        if (end <= 0) {
          return '';
        } // Force coersion to uint32. This will also coerce falsey/NaN values to 0.


        end >>>= 0;
        start >>>= 0;

        if (end <= start) {
          return '';
        }

        if (!encoding) encoding = 'utf8';

        while (true) {
          switch (encoding) {
            case 'hex':
              return hexSlice(this, start, end);

            case 'utf8':
            case 'utf-8':
              return utf8Slice(this, start, end);

            case 'ascii':
              return asciiSlice(this, start, end);

            case 'latin1':
            case 'binary':
              return latin1Slice(this, start, end);

            case 'base64':
              return base64Slice(this, start, end);

            case 'ucs2':
            case 'ucs-2':
            case 'utf16le':
            case 'utf-16le':
              return utf16leSlice(this, start, end);

            default:
              if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding);
              encoding = (encoding + '').toLowerCase();
              loweredCase = true;
          }
        }
      } // The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
      // Buffer instances.


      Buffer.prototype._isBuffer = true;

      function swap (b, n, m) {
        var i = b[n];
        b[n] = b[m];
        b[m] = i;
      }

      Buffer.prototype.swap16 = function swap16 () {
        var len = this.length;

        if (len % 2 !== 0) {
          throw new RangeError('Buffer size must be a multiple of 16-bits');
        }

        for (var i = 0; i < len; i += 2) {
          swap(this, i, i + 1);
        }

        return this;
      };

      Buffer.prototype.swap32 = function swap32 () {
        var len = this.length;

        if (len % 4 !== 0) {
          throw new RangeError('Buffer size must be a multiple of 32-bits');
        }

        for (var i = 0; i < len; i += 4) {
          swap(this, i, i + 3);
          swap(this, i + 1, i + 2);
        }

        return this;
      };

      Buffer.prototype.swap64 = function swap64 () {
        var len = this.length;

        if (len % 8 !== 0) {
          throw new RangeError('Buffer size must be a multiple of 64-bits');
        }

        for (var i = 0; i < len; i += 8) {
          swap(this, i, i + 7);
          swap(this, i + 1, i + 6);
          swap(this, i + 2, i + 5);
          swap(this, i + 3, i + 4);
        }

        return this;
      };

      Buffer.prototype.toString = function toString () {
        var length = this.length | 0;
        if (length === 0) return '';
        if (arguments.length === 0) return utf8Slice(this, 0, length);
        return slowToString.apply(this, arguments);
      };

      Buffer.prototype.equals = function equals (b) {
        if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer');
        if (this === b) return true;
        return Buffer.compare(this, b) === 0;
      };

      Buffer.prototype.inspect = function inspect () {
        var str = '';
        var max = exports.INSPECT_MAX_BYTES;

        if (this.length > 0) {
          str = this.toString('hex', 0, max).match(/.{2}/g).join(' ');
          if (this.length > max) str += ' ... ';
        }

        return '<Buffer ' + str + '>';
      };

      Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
        if (!Buffer.isBuffer(target)) {
          throw new TypeError('Argument must be a Buffer');
        }

        if (start === undefined) {
          start = 0;
        }

        if (end === undefined) {
          end = target ? target.length : 0;
        }

        if (thisStart === undefined) {
          thisStart = 0;
        }

        if (thisEnd === undefined) {
          thisEnd = this.length;
        }

        if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
          throw new RangeError('out of range index');
        }

        if (thisStart >= thisEnd && start >= end) {
          return 0;
        }

        if (thisStart >= thisEnd) {
          return -1;
        }

        if (start >= end) {
          return 1;
        }

        start >>>= 0;
        end >>>= 0;
        thisStart >>>= 0;
        thisEnd >>>= 0;
        if (this === target) return 0;
        var x = thisEnd - thisStart;
        var y = end - start;
        var len = Math.min(x, y);
        var thisCopy = this.slice(thisStart, thisEnd);
        var targetCopy = target.slice(start, end);

        for (var i = 0; i < len; ++i) {
          if (thisCopy[i] !== targetCopy[i]) {
            x = thisCopy[i];
            y = targetCopy[i];
            break;
          }
        }

        if (x < y) return -1;
        if (y < x) return 1;
        return 0;
      }; // Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
      // OR the last index of `val` in `buffer` at offset <= `byteOffset`.
      //
      // Arguments:
      // - buffer - a Buffer to search
      // - val - a string, Buffer, or number
      // - byteOffset - an index into `buffer`; will be clamped to an int32
      // - encoding - an optional encoding, relevant is val is a string
      // - dir - true for indexOf, false for lastIndexOf


      function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
        // Empty buffer means no match
        if (buffer.length === 0) return -1; // Normalize byteOffset

        if (typeof byteOffset === 'string') {
          encoding = byteOffset;
          byteOffset = 0;
        } else if (byteOffset > 0x7fffffff) {
          byteOffset = 0x7fffffff;
        } else if (byteOffset < -0x80000000) {
          byteOffset = -0x80000000;
        }

        byteOffset = +byteOffset; // Coerce to Number.

        if (isNaN(byteOffset)) {
          // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
          byteOffset = dir ? 0 : buffer.length - 1;
        } // Normalize byteOffset: negative offsets start from the end of the buffer


        if (byteOffset < 0) byteOffset = buffer.length + byteOffset;

        if (byteOffset >= buffer.length) {
          if (dir) return -1; else byteOffset = buffer.length - 1;
        } else if (byteOffset < 0) {
          if (dir) byteOffset = 0; else return -1;
        } // Normalize val


        if (typeof val === 'string') {
          val = Buffer.from(val, encoding);
        } // Finally, search either indexOf (if dir is true) or lastIndexOf


        if (Buffer.isBuffer(val)) {
          // Special case: looking for empty string/buffer always fails
          if (val.length === 0) {
            return -1;
          }

          return arrayIndexOf(buffer, val, byteOffset, encoding, dir);
        } else if (typeof val === 'number') {
          val = val & 0xFF; // Search for a byte value [0-255]

          if (Buffer.TYPED_ARRAY_SUPPORT && typeof Uint8Array.prototype.indexOf === 'function') {
            if (dir) {
              return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset);
            } else {
              return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset);
            }
          }

          return arrayIndexOf(buffer, [val], byteOffset, encoding, dir);
        }

        throw new TypeError('val must be string, number or Buffer');
      }

      function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
        var indexSize = 1;
        var arrLength = arr.length;
        var valLength = val.length;

        if (encoding !== undefined) {
          encoding = String(encoding).toLowerCase();

          if (encoding === 'ucs2' || encoding === 'ucs-2' || encoding === 'utf16le' || encoding === 'utf-16le') {
            if (arr.length < 2 || val.length < 2) {
              return -1;
            }

            indexSize = 2;
            arrLength /= 2;
            valLength /= 2;
            byteOffset /= 2;
          }
        }

        function read (buf, i) {
          if (indexSize === 1) {
            return buf[i];
          } else {
            return buf.readUInt16BE(i * indexSize);
          }
        }

        var i;

        if (dir) {
          var foundIndex = -1;

          for (i = byteOffset; i < arrLength; i++) {
            if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
              if (foundIndex === -1) foundIndex = i;
              if (i - foundIndex + 1 === valLength) return foundIndex * indexSize;
            } else {
              if (foundIndex !== -1) i -= i - foundIndex;
              foundIndex = -1;
            }
          }
        } else {
          if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength;

          for (i = byteOffset; i >= 0; i--) {
            var found = true;

            for (var j = 0; j < valLength; j++) {
              if (read(arr, i + j) !== read(val, j)) {
                found = false;
                break;
              }
            }

            if (found) return i;
          }
        }

        return -1;
      }

      Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
        return this.indexOf(val, byteOffset, encoding) !== -1;
      };

      Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
        return bidirectionalIndexOf(this, val, byteOffset, encoding, true);
      };

      Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
        return bidirectionalIndexOf(this, val, byteOffset, encoding, false);
      };

      function hexWrite (buf, string, offset, length) {
        offset = Number(offset) || 0;
        var remaining = buf.length - offset;

        if (!length) {
          length = remaining;
        } else {
          length = Number(length);

          if (length > remaining) {
            length = remaining;
          }
        } // must be an even number of digits


        var strLen = string.length;
        if (strLen % 2 !== 0) throw new TypeError('Invalid hex string');

        if (length > strLen / 2) {
          length = strLen / 2;
        }

        for (var i = 0; i < length; ++i) {
          var parsed = parseInt(string.substr(i * 2, 2), 16);
          if (isNaN(parsed)) return i;
          buf[offset + i] = parsed;
        }

        return i;
      }

      function utf8Write (buf, string, offset, length) {
        return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length);
      }

      function asciiWrite (buf, string, offset, length) {
        return blitBuffer(asciiToBytes(string), buf, offset, length);
      }

      function latin1Write (buf, string, offset, length) {
        return asciiWrite(buf, string, offset, length);
      }

      function base64Write (buf, string, offset, length) {
        return blitBuffer(base64ToBytes(string), buf, offset, length);
      }

      function ucs2Write (buf, string, offset, length) {
        return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length);
      }

      Buffer.prototype.write = function write (string, offset, length, encoding) {
        // Buffer#write(string)
        if (offset === undefined) {
          encoding = 'utf8';
          length = this.length;
          offset = 0; // Buffer#write(string, encoding)
        } else if (length === undefined && typeof offset === 'string') {
          encoding = offset;
          length = this.length;
          offset = 0; // Buffer#write(string, offset[, length][, encoding])
        } else if (isFinite(offset)) {
          offset = offset | 0;

          if (isFinite(length)) {
            length = length | 0;
            if (encoding === undefined) encoding = 'utf8';
          } else {
            encoding = length;
            length = undefined;
          } // legacy write(string, encoding, offset, length) - remove in v0.13

        } else {
          throw new Error('Buffer.write(string, encoding, offset[, length]) is no longer supported');
        }

        var remaining = this.length - offset;
        if (length === undefined || length > remaining) length = remaining;

        if (string.length > 0 && (length < 0 || offset < 0) || offset > this.length) {
          throw new RangeError('Attempt to write outside buffer bounds');
        }

        if (!encoding) encoding = 'utf8';
        var loweredCase = false;

        for (; ;) {
          switch (encoding) {
            case 'hex':
              return hexWrite(this, string, offset, length);

            case 'utf8':
            case 'utf-8':
              return utf8Write(this, string, offset, length);

            case 'ascii':
              return asciiWrite(this, string, offset, length);

            case 'latin1':
            case 'binary':
              return latin1Write(this, string, offset, length);

            case 'base64':
              // Warning: maxLength not taken into account in base64Write
              return base64Write(this, string, offset, length);

            case 'ucs2':
            case 'ucs-2':
            case 'utf16le':
            case 'utf-16le':
              return ucs2Write(this, string, offset, length);

            default:
              if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding);
              encoding = ('' + encoding).toLowerCase();
              loweredCase = true;
          }
        }
      };

      Buffer.prototype.toJSON = function toJSON () {
        return {
          type: 'Buffer',
          data: Array.prototype.slice.call(this._arr || this, 0)
        };
      };

      function base64Slice (buf, start, end) {
        if (start === 0 && end === buf.length) {
          return base64.fromByteArray(buf);
        } else {
          return base64.fromByteArray(buf.slice(start, end));
        }
      }

      function utf8Slice (buf, start, end) {
        end = Math.min(buf.length, end);
        var res = [];
        var i = start;

        while (i < end) {
          var firstByte = buf[i];
          var codePoint = null;
          var bytesPerSequence = firstByte > 0xEF ? 4 : firstByte > 0xDF ? 3 : firstByte > 0xBF ? 2 : 1;

          if (i + bytesPerSequence <= end) {
            var secondByte, thirdByte, fourthByte, tempCodePoint;

            switch (bytesPerSequence) {
              case 1:
                if (firstByte < 0x80) {
                  codePoint = firstByte;
                }

                break;

              case 2:
                secondByte = buf[i + 1];

                if ((secondByte & 0xC0) === 0x80) {
                  tempCodePoint = (firstByte & 0x1F) << 0x6 | secondByte & 0x3F;

                  if (tempCodePoint > 0x7F) {
                    codePoint = tempCodePoint;
                  }
                }

                break;

              case 3:
                secondByte = buf[i + 1];
                thirdByte = buf[i + 2];

                if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
                  tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | thirdByte & 0x3F;

                  if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
                    codePoint = tempCodePoint;
                  }
                }

                break;

              case 4:
                secondByte = buf[i + 1];
                thirdByte = buf[i + 2];
                fourthByte = buf[i + 3];

                if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
                  tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | fourthByte & 0x3F;

                  if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
                    codePoint = tempCodePoint;
                  }
                }

            }
          }

          if (codePoint === null) {
            // we did not generate a valid codePoint so insert a
            // replacement char (U+FFFD) and advance only 1 byte
            codePoint = 0xFFFD;
            bytesPerSequence = 1;
          } else if (codePoint > 0xFFFF) {
            // encode to utf16 (surrogate pair dance)
            codePoint -= 0x10000;
            res.push(codePoint >>> 10 & 0x3FF | 0xD800);
            codePoint = 0xDC00 | codePoint & 0x3FF;
          }

          res.push(codePoint);
          i += bytesPerSequence;
        }

        return decodeCodePointsArray(res);
      } // Based on http://stackoverflow.com/a/22747272/680742, the browser with
      // the lowest limit is Chrome, with 0x10000 args.
      // We go 1 magnitude less, for safety


      var MAX_ARGUMENTS_LENGTH = 0x1000;

      function decodeCodePointsArray (codePoints) {
        var len = codePoints.length;

        if (len <= MAX_ARGUMENTS_LENGTH) {
          return String.fromCharCode.apply(String, codePoints); // avoid extra slice()
        } // Decode in chunks to avoid "call stack size exceeded".


        var res = '';
        var i = 0;

        while (i < len) {
          res += String.fromCharCode.apply(String, codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH));
        }

        return res;
      }

      function asciiSlice (buf, start, end) {
        var ret = '';
        end = Math.min(buf.length, end);

        for (var i = start; i < end; ++i) {
          ret += String.fromCharCode(buf[i] & 0x7F);
        }

        return ret;
      }

      function latin1Slice (buf, start, end) {
        var ret = '';
        end = Math.min(buf.length, end);

        for (var i = start; i < end; ++i) {
          ret += String.fromCharCode(buf[i]);
        }

        return ret;
      }

      function hexSlice (buf, start, end) {
        var len = buf.length;
        if (!start || start < 0) start = 0;
        if (!end || end < 0 || end > len) end = len;
        var out = '';

        for (var i = start; i < end; ++i) {
          out += toHex(buf[i]);
        }

        return out;
      }

      function utf16leSlice (buf, start, end) {
        var bytes = buf.slice(start, end);
        var res = '';

        for (var i = 0; i < bytes.length; i += 2) {
          res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
        }

        return res;
      }

      Buffer.prototype.slice = function slice (start, end) {
        var len = this.length;
        start = ~~start;
        end = end === undefined ? len : ~~end;

        if (start < 0) {
          start += len;
          if (start < 0) start = 0;
        } else if (start > len) {
          start = len;
        }

        if (end < 0) {
          end += len;
          if (end < 0) end = 0;
        } else if (end > len) {
          end = len;
        }

        if (end < start) end = start;
        var newBuf;

        if (Buffer.TYPED_ARRAY_SUPPORT) {
          newBuf = this.subarray(start, end);
          newBuf.__proto__ = Buffer.prototype;
        } else {
          var sliceLen = end - start;
          newBuf = new Buffer(sliceLen, undefined);

          for (var i = 0; i < sliceLen; ++i) {
            newBuf[i] = this[i + start];
          }
        }

        return newBuf;
      };
      /*
       * Need to make sure that buffer isn't trying to write out of bounds.
       */


      function checkOffset (offset, ext, length) {
        if (offset % 1 !== 0 || offset < 0) throw new RangeError('offset is not uint');
        if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length');
      }

      Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
        offset = offset | 0;
        byteLength = byteLength | 0;
        if (!noAssert) checkOffset(offset, byteLength, this.length);
        var val = this[offset];
        var mul = 1;
        var i = 0;

        while (++i < byteLength && (mul *= 0x100)) {
          val += this[offset + i] * mul;
        }

        return val;
      };

      Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
        offset = offset | 0;
        byteLength = byteLength | 0;

        if (!noAssert) {
          checkOffset(offset, byteLength, this.length);
        }

        var val = this[offset + --byteLength];
        var mul = 1;

        while (byteLength > 0 && (mul *= 0x100)) {
          val += this[offset + --byteLength] * mul;
        }

        return val;
      };

      Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
        if (!noAssert) checkOffset(offset, 1, this.length);
        return this[offset];
      };

      Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
        if (!noAssert) checkOffset(offset, 2, this.length);
        return this[offset] | this[offset + 1] << 8;
      };

      Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
        if (!noAssert) checkOffset(offset, 2, this.length);
        return this[offset] << 8 | this[offset + 1];
      };

      Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
        if (!noAssert) checkOffset(offset, 4, this.length);
        return (this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16) + this[offset + 3] * 0x1000000;
      };

      Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
        if (!noAssert) checkOffset(offset, 4, this.length);
        return this[offset] * 0x1000000 + (this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3]);
      };

      Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
        offset = offset | 0;
        byteLength = byteLength | 0;
        if (!noAssert) checkOffset(offset, byteLength, this.length);
        var val = this[offset];
        var mul = 1;
        var i = 0;

        while (++i < byteLength && (mul *= 0x100)) {
          val += this[offset + i] * mul;
        }

        mul *= 0x80;
        if (val >= mul) val -= Math.pow(2, 8 * byteLength);
        return val;
      };

      Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
        offset = offset | 0;
        byteLength = byteLength | 0;
        if (!noAssert) checkOffset(offset, byteLength, this.length);
        var i = byteLength;
        var mul = 1;
        var val = this[offset + --i];

        while (i > 0 && (mul *= 0x100)) {
          val += this[offset + --i] * mul;
        }

        mul *= 0x80;
        if (val >= mul) val -= Math.pow(2, 8 * byteLength);
        return val;
      };

      Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
        if (!noAssert) checkOffset(offset, 1, this.length);
        if (!(this[offset] & 0x80)) return this[offset];
        return (0xff - this[offset] + 1) * -1;
      };

      Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
        if (!noAssert) checkOffset(offset, 2, this.length);
        var val = this[offset] | this[offset + 1] << 8;
        return val & 0x8000 ? val | 0xFFFF0000 : val;
      };

      Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
        if (!noAssert) checkOffset(offset, 2, this.length);
        var val = this[offset + 1] | this[offset] << 8;
        return val & 0x8000 ? val | 0xFFFF0000 : val;
      };

      Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
        if (!noAssert) checkOffset(offset, 4, this.length);
        return this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16 | this[offset + 3] << 24;
      };

      Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
        if (!noAssert) checkOffset(offset, 4, this.length);
        return this[offset] << 24 | this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3];
      };

      Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
        if (!noAssert) checkOffset(offset, 4, this.length);
        return ieee754.read(this, offset, true, 23, 4);
      };

      Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
        if (!noAssert) checkOffset(offset, 4, this.length);
        return ieee754.read(this, offset, false, 23, 4);
      };

      Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
        if (!noAssert) checkOffset(offset, 8, this.length);
        return ieee754.read(this, offset, true, 52, 8);
      };

      Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
        if (!noAssert) checkOffset(offset, 8, this.length);
        return ieee754.read(this, offset, false, 52, 8);
      };

      function checkInt (buf, value, offset, ext, max, min) {
        if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance');
        if (value > max || value < min) throw new RangeError('"value" argument is out of bounds');
        if (offset + ext > buf.length) throw new RangeError('Index out of range');
      }

      Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
        value = +value;
        offset = offset | 0;
        byteLength = byteLength | 0;

        if (!noAssert) {
          var maxBytes = Math.pow(2, 8 * byteLength) - 1;
          checkInt(this, value, offset, byteLength, maxBytes, 0);
        }

        var mul = 1;
        var i = 0;
        this[offset] = value & 0xFF;

        while (++i < byteLength && (mul *= 0x100)) {
          this[offset + i] = value / mul & 0xFF;
        }

        return offset + byteLength;
      };

      Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
        value = +value;
        offset = offset | 0;
        byteLength = byteLength | 0;

        if (!noAssert) {
          var maxBytes = Math.pow(2, 8 * byteLength) - 1;
          checkInt(this, value, offset, byteLength, maxBytes, 0);
        }

        var i = byteLength - 1;
        var mul = 1;
        this[offset + i] = value & 0xFF;

        while (--i >= 0 && (mul *= 0x100)) {
          this[offset + i] = value / mul & 0xFF;
        }

        return offset + byteLength;
      };

      Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
        value = +value;
        offset = offset | 0;
        if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0);
        if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
        this[offset] = value & 0xff;
        return offset + 1;
      };

      function objectWriteUInt16 (buf, value, offset, littleEndian) {
        if (value < 0) value = 0xffff + value + 1;

        for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
          buf[offset + i] = (value & 0xff << 8 * (littleEndian ? i : 1 - i)) >>> (littleEndian ? i : 1 - i) * 8;
        }
      }

      Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
        value = +value;
        offset = offset | 0;
        if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);

        if (Buffer.TYPED_ARRAY_SUPPORT) {
          this[offset] = value & 0xff;
          this[offset + 1] = value >>> 8;
        } else {
          objectWriteUInt16(this, value, offset, true);
        }

        return offset + 2;
      };

      Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
        value = +value;
        offset = offset | 0;
        if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);

        if (Buffer.TYPED_ARRAY_SUPPORT) {
          this[offset] = value >>> 8;
          this[offset + 1] = value & 0xff;
        } else {
          objectWriteUInt16(this, value, offset, false);
        }

        return offset + 2;
      };

      function objectWriteUInt32 (buf, value, offset, littleEndian) {
        if (value < 0) value = 0xffffffff + value + 1;

        for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
          buf[offset + i] = value >>> (littleEndian ? i : 3 - i) * 8 & 0xff;
        }
      }

      Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
        value = +value;
        offset = offset | 0;
        if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);

        if (Buffer.TYPED_ARRAY_SUPPORT) {
          this[offset + 3] = value >>> 24;
          this[offset + 2] = value >>> 16;
          this[offset + 1] = value >>> 8;
          this[offset] = value & 0xff;
        } else {
          objectWriteUInt32(this, value, offset, true);
        }

        return offset + 4;
      };

      Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
        value = +value;
        offset = offset | 0;
        if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);

        if (Buffer.TYPED_ARRAY_SUPPORT) {
          this[offset] = value >>> 24;
          this[offset + 1] = value >>> 16;
          this[offset + 2] = value >>> 8;
          this[offset + 3] = value & 0xff;
        } else {
          objectWriteUInt32(this, value, offset, false);
        }

        return offset + 4;
      };

      Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
        value = +value;
        offset = offset | 0;

        if (!noAssert) {
          var limit = Math.pow(2, 8 * byteLength - 1);
          checkInt(this, value, offset, byteLength, limit - 1, -limit);
        }

        var i = 0;
        var mul = 1;
        var sub = 0;
        this[offset] = value & 0xFF;

        while (++i < byteLength && (mul *= 0x100)) {
          if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
            sub = 1;
          }

          this[offset + i] = (value / mul >> 0) - sub & 0xFF;
        }

        return offset + byteLength;
      };

      Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
        value = +value;
        offset = offset | 0;

        if (!noAssert) {
          var limit = Math.pow(2, 8 * byteLength - 1);
          checkInt(this, value, offset, byteLength, limit - 1, -limit);
        }

        var i = byteLength - 1;
        var mul = 1;
        var sub = 0;
        this[offset + i] = value & 0xFF;

        while (--i >= 0 && (mul *= 0x100)) {
          if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
            sub = 1;
          }

          this[offset + i] = (value / mul >> 0) - sub & 0xFF;
        }

        return offset + byteLength;
      };

      Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
        value = +value;
        offset = offset | 0;
        if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80);
        if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
        if (value < 0) value = 0xff + value + 1;
        this[offset] = value & 0xff;
        return offset + 1;
      };

      Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
        value = +value;
        offset = offset | 0;
        if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);

        if (Buffer.TYPED_ARRAY_SUPPORT) {
          this[offset] = value & 0xff;
          this[offset + 1] = value >>> 8;
        } else {
          objectWriteUInt16(this, value, offset, true);
        }

        return offset + 2;
      };

      Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
        value = +value;
        offset = offset | 0;
        if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);

        if (Buffer.TYPED_ARRAY_SUPPORT) {
          this[offset] = value >>> 8;
          this[offset + 1] = value & 0xff;
        } else {
          objectWriteUInt16(this, value, offset, false);
        }

        return offset + 2;
      };

      Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
        value = +value;
        offset = offset | 0;
        if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);

        if (Buffer.TYPED_ARRAY_SUPPORT) {
          this[offset] = value & 0xff;
          this[offset + 1] = value >>> 8;
          this[offset + 2] = value >>> 16;
          this[offset + 3] = value >>> 24;
        } else {
          objectWriteUInt32(this, value, offset, true);
        }

        return offset + 4;
      };

      Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
        value = +value;
        offset = offset | 0;
        if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
        if (value < 0) value = 0xffffffff + value + 1;

        if (Buffer.TYPED_ARRAY_SUPPORT) {
          this[offset] = value >>> 24;
          this[offset + 1] = value >>> 16;
          this[offset + 2] = value >>> 8;
          this[offset + 3] = value & 0xff;
        } else {
          objectWriteUInt32(this, value, offset, false);
        }

        return offset + 4;
      };

      function checkIEEE754 (buf, value, offset, ext, max, min) {
        if (offset + ext > buf.length) throw new RangeError('Index out of range');
        if (offset < 0) throw new RangeError('Index out of range');
      }

      function writeFloat (buf, value, offset, littleEndian, noAssert) {
        if (!noAssert) {
          checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38);
        }

        ieee754.write(buf, value, offset, littleEndian, 23, 4);
        return offset + 4;
      }

      Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
        return writeFloat(this, value, offset, true, noAssert);
      };

      Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
        return writeFloat(this, value, offset, false, noAssert);
      };

      function writeDouble (buf, value, offset, littleEndian, noAssert) {
        if (!noAssert) {
          checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308);
        }

        ieee754.write(buf, value, offset, littleEndian, 52, 8);
        return offset + 8;
      }

      Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
        return writeDouble(this, value, offset, true, noAssert);
      };

      Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
        return writeDouble(this, value, offset, false, noAssert);
      }; // copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)


      Buffer.prototype.copy = function copy (target, targetStart, start, end) {
        if (!start) start = 0;
        if (!end && end !== 0) end = this.length;
        if (targetStart >= target.length) targetStart = target.length;
        if (!targetStart) targetStart = 0;
        if (end > 0 && end < start) end = start; // Copy 0 bytes; we're done

        if (end === start) return 0;
        if (target.length === 0 || this.length === 0) return 0; // Fatal error conditions

        if (targetStart < 0) {
          throw new RangeError('targetStart out of bounds');
        }

        if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds');
        if (end < 0) throw new RangeError('sourceEnd out of bounds'); // Are we oob?

        if (end > this.length) end = this.length;

        if (target.length - targetStart < end - start) {
          end = target.length - targetStart + start;
        }

        var len = end - start;
        var i;

        if (this === target && start < targetStart && targetStart < end) {
          // descending copy from end
          for (i = len - 1; i >= 0; --i) {
            target[i + targetStart] = this[i + start];
          }
        } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
          // ascending copy from start
          for (i = 0; i < len; ++i) {
            target[i + targetStart] = this[i + start];
          }
        } else {
          Uint8Array.prototype.set.call(target, this.subarray(start, start + len), targetStart);
        }

        return len;
      }; // Usage:
      //    buffer.fill(number[, offset[, end]])
      //    buffer.fill(buffer[, offset[, end]])
      //    buffer.fill(string[, offset[, end]][, encoding])


      Buffer.prototype.fill = function fill (val, start, end, encoding) {
        // Handle string cases:
        if (typeof val === 'string') {
          if (typeof start === 'string') {
            encoding = start;
            start = 0;
            end = this.length;
          } else if (typeof end === 'string') {
            encoding = end;
            end = this.length;
          }

          if (val.length === 1) {
            var code = val.charCodeAt(0);

            if (code < 256) {
              val = code;
            }
          }

          if (encoding !== undefined && typeof encoding !== 'string') {
            throw new TypeError('encoding must be a string');
          }

          if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
            throw new TypeError('Unknown encoding: ' + encoding);
          }
        } else if (typeof val === 'number') {
          val = val & 255;
        } // Invalid ranges are not set to a default, so can range check early.


        if (start < 0 || this.length < start || this.length < end) {
          throw new RangeError('Out of range index');
        }

        if (end <= start) {
          return this;
        }

        start = start >>> 0;
        end = end === undefined ? this.length : end >>> 0;
        if (!val) val = 0;
        var i;

        if (typeof val === 'number') {
          for (i = start; i < end; ++i) {
            this[i] = val;
          }
        } else {
          var bytes = Buffer.isBuffer(val) ? val : utf8ToBytes(new Buffer(val, encoding).toString());
          var len = bytes.length;

          for (i = 0; i < end - start; ++i) {
            this[i + start] = bytes[i % len];
          }
        }

        return this;
      }; // HELPER FUNCTIONS
      // ================


      var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g;

      function base64clean (str) {
        // Node strips out invalid characters like \n and \t from the string, base64-js does not
        str = stringtrim(str).replace(INVALID_BASE64_RE, ''); // Node converts strings with length < 2 to ''

        if (str.length < 2) return ''; // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not

        while (str.length % 4 !== 0) {
          str = str + '=';
        }

        return str;
      }

      function stringtrim (str) {
        if (str.trim) return str.trim();
        return str.replace(/^\s+|\s+$/g, '');
      }

      function toHex (n) {
        if (n < 16) return '0' + n.toString(16);
        return n.toString(16);
      }

      function utf8ToBytes (string, units) {
        units = units || Infinity;
        var codePoint;
        var length = string.length;
        var leadSurrogate = null;
        var bytes = [];

        for (var i = 0; i < length; ++i) {
          codePoint = string.charCodeAt(i); // is surrogate component

          if (codePoint > 0xD7FF && codePoint < 0xE000) {
            // last char was a lead
            if (!leadSurrogate) {
              // no lead yet
              if (codePoint > 0xDBFF) {
                // unexpected trail
                if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
                continue;
              } else if (i + 1 === length) {
                // unpaired lead
                if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
                continue;
              } // valid lead


              leadSurrogate = codePoint;
              continue;
            } // 2 leads in a row


            if (codePoint < 0xDC00) {
              if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
              leadSurrogate = codePoint;
              continue;
            } // valid surrogate pair


            codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000;
          } else if (leadSurrogate) {
            // valid bmp char, but last char was a lead
            if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
          }

          leadSurrogate = null; // encode utf8

          if (codePoint < 0x80) {
            if ((units -= 1) < 0) break;
            bytes.push(codePoint);
          } else if (codePoint < 0x800) {
            if ((units -= 2) < 0) break;
            bytes.push(codePoint >> 0x6 | 0xC0, codePoint & 0x3F | 0x80);
          } else if (codePoint < 0x10000) {
            if ((units -= 3) < 0) break;
            bytes.push(codePoint >> 0xC | 0xE0, codePoint >> 0x6 & 0x3F | 0x80, codePoint & 0x3F | 0x80);
          } else if (codePoint < 0x110000) {
            if ((units -= 4) < 0) break;
            bytes.push(codePoint >> 0x12 | 0xF0, codePoint >> 0xC & 0x3F | 0x80, codePoint >> 0x6 & 0x3F | 0x80, codePoint & 0x3F | 0x80);
          } else {
            throw new Error('Invalid code point');
          }
        }

        return bytes;
      }

      function asciiToBytes (str) {
        var byteArray = [];

        for (var i = 0; i < str.length; ++i) {
          // Node's code seems to be doing this and not & 0x7F..
          byteArray.push(str.charCodeAt(i) & 0xFF);
        }

        return byteArray;
      }

      function utf16leToBytes (str, units) {
        var c, hi, lo;
        var byteArray = [];

        for (var i = 0; i < str.length; ++i) {
          if ((units -= 2) < 0) break;
          c = str.charCodeAt(i);
          hi = c >> 8;
          lo = c % 256;
          byteArray.push(lo);
          byteArray.push(hi);
        }

        return byteArray;
      }

      function base64ToBytes (str) {
        return base64.toByteArray(base64clean(str));
      }

      function blitBuffer (src, dst, offset, length) {
        for (var i = 0; i < length; ++i) {
          if (i + offset >= dst.length || i >= src.length) break;
          dst[i + offset] = src[i];
        }

        return i;
      }

      function isnan (val) {
        return val !== val; // eslint-disable-line no-self-compare
      }
      /* WEBPACK VAR INJECTION */
    }.call(this, __webpack_require__(23)))

    /***/
  }),
/* 16 */
/***/ (function (module, __webpack_exports__, __webpack_require__) {

    "use strict";
/* harmony import */ var _DataSource__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(10);
/* harmony import */ var _utils_es6_promise__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1);
/* harmony import */ var _ext_Version__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(2);
    function _typeof (obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof (obj) { return typeof obj; }; } else { _typeof = function _typeof (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

    function _classCallCheck (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    function _defineProperties (target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

    function _createClass (Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

    function _inherits (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

    function _setPrototypeOf (o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf (o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

    function _createSuper (Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal () { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

    function _possibleConstructorReturn (self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

    function _assertThisInitialized (self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

    function _isNativeReflectConstruct () { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () { })); return true; } catch (e) { return false; } }

    function _getPrototypeOf (o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf (o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

    /**
     * Created by kongjian on 2017/6/30.
     */




    var URLDataSource = /*#__PURE__*/function (_DataSource) {
      _inherits(URLDataSource, _DataSource);

      var _super = _createSuper(URLDataSource);

      function URLDataSource () {
        var _this;

        _classCallCheck(this, URLDataSource);

        _this = _super.call(this); //多个服务器url的域名，用于解决一个域名只有6条请求管线的限制

        _this.urlArray = []; //数据源类型

        _this.type = 'URLDataSource'; //注记数据的请求url

        _this.url = null; //样式文件的请求接口url

        _this.styleUrl = null; //样式文件Id

        _this.styleId = 'style'; //过滤条件

        _this.filter = null; //纹理

        _this.textures = {}; //过滤条件字符

        _this.control = null; //过滤的id

        _this.controlId = null; // 不带过滤条件的url

        _this.sourceUrl = null; //域名

        _this.host = ''; //服务名

        _this.servername = '';
        _this.newEngine = false;
        _this.serverInfo = {};
        _this.layerFieldMap = {}; //生僻字

        _this.foreendFont = "";
        _this.isLoadServerInfoDef = new _utils_es6_promise__WEBPACK_IMPORTED_MODULE_1__[/* Deferred */ "a"]();
        return _this;
      }
      /**
       * 加载样式文件和纹理数据
       */


      _createClass(URLDataSource, [{
        key: "loadStyle",
        value: function loadStyle (styleType) {
          var _this2 = this;

          var def0 = new _utils_es6_promise__WEBPACK_IMPORTED_MODULE_1__[/* Deferred */ "a"]();
          var def1 = new _utils_es6_promise__WEBPACK_IMPORTED_MODULE_1__[/* Deferred */ "a"]();
          var def2 = new _utils_es6_promise__WEBPACK_IMPORTED_MODULE_1__[/* Deferred */ "a"]();
          var def3 = new _utils_es6_promise__WEBPACK_IMPORTED_MODULE_1__[/* Deferred */ "a"]();
          var def4 = new _utils_es6_promise__WEBPACK_IMPORTED_MODULE_1__[/* Deferred */ "a"](); //this.loadServerInfo(def5);

          this.isLoadServerInfoDef.then(function () {
            var queryParam = _this2.url.split('?')[1];

            if (!_this2.sourceUrl) {
              _this2.sourceUrl = _this2.url + '&clientVersion=' + _ext_Version__WEBPACK_IMPORTED_MODULE_2__[/* default */ "a"];
              _this2.url = _this2.url + '&clientVersion=' + _ext_Version__WEBPACK_IMPORTED_MODULE_2__[/* default */ "a"];
            }

            if (_this2.control && _this2.isIE()) {
              //设置过滤条件
              Object(_utils_es6_promise__WEBPACK_IMPORTED_MODULE_1__[/* getJSON */ "c"])({
                type: 'post',
                url: _this2.host + '/mapserver/vmap/' + _this2.servername + '/setControl',
                data: 'control=' + _this2.control,
                dataType: 'json'
              }).then(function (result) {
                this.controlId = result.id;
                this.url = this.sourceUrl + '&controlId=' + result.id;
                def0.resolve();
              }.bind(_this2));
            } else {
              if (_this2.control) {
                _this2.url = _this2.sourceUrl + '&control=' + encodeURIComponent(_this2.control);
              } else {
                _this2.url = _this2.sourceUrl;
              }

              def0.resolve();
            }

            if (!styleType) {
              styleType = 'label';
            }

            if (_this2.styleId == '_default__') {
              var styleStr = 'let layers = drawer.getAllLayer(); layers.setStyle(function(level , get){' + ' return {"type":"_default__","_id":"1","show":true,"pointFillStyle":"#ff0000","radius":5,"lineFillStyle":"#00ff00","lineWidth":3 }' + '})';
              _this2.styleFun = new Function("drawer", "level", styleStr);
              return [def0];
            } //请求样式文件


            Object(_utils_es6_promise__WEBPACK_IMPORTED_MODULE_1__[/* getJSON */ "c"])({
              url: _this2.host + '/mapserver/styleInfo/' + _this2.servername + '/' + _this2.styleId + '/' + styleType + '/style.js?' + Math.random() + '&' + queryParam,
              dataType: 'text'
            }).then(function (result) {
              if (this.newEngine) {
                this.styleFun = new Function("render", "level", result);
              } else {
                this.styleFun = new Function("drawer", "level", result);
              }

              def1.resolve();
            }.bind(_this2)); //请求图标纹理

            Object(_utils_es6_promise__WEBPACK_IMPORTED_MODULE_1__[/* getJSON */ "c"])({
              url: _this2.host + '/mapserver/styleInfo/' + _this2.servername + '/' + _this2.styleId + '/label/texture.js?' + Math.random() + '&' + queryParam,
              dataType: 'text'
            }).then(function (result) {
              var textures = JSON.parse(result);
              var totalCount = 0;

              for (var i in textures) {
                if (textures[i]) {
                  totalCount++;
                }
              }

              if (totalCount == 0) {
                def2.resolve();
                return;
              }

              var count = 0;

              for (var key in textures) {
                var img = new Image();
                img.name = key;

                img.onload = function (data) {
                  count++;
                  var name = data.target.name;
                  this.textures[name] = data.target;

                  if (count == totalCount) {
                    def2.resolve();
                  }
                }.bind(this);

                img.src = textures[key];
              }
            }.bind(_this2));

            _this2.loadFonts(queryParam, def3);

            _this2.loadforeendUnCommonFonts(queryParam, def4);
          });
          return [def0, def1, def2, def3, def4];
        } //加载生僻字

      }, {
        key: "loadforeendUnCommonFonts",
        value: function loadforeendUnCommonFonts (queryParam, def4) {
          Object(_utils_es6_promise__WEBPACK_IMPORTED_MODULE_1__[/* getJSON */ "c"])({
            url: this.host + '/mapserver/styleInfo/fonts/list.json?' + Math.random() + '&' + queryParam,
            dataType: 'json'
          }).then(function (result) {
            if (result) {
              if (result.foreendUnCommonFont) {
                this.foreendFont = result.foreendUnCommonFont;
                var paramsfont = {
                  "font-family": this.foreendFont,
                  "font-weight": "normal",
                  "font-style": "normal",
                  "urls": {
                    "ttf": {
                      "url": this.foreendFont + "_normal_normal" + ".ttf",
                      "format": "truetype"
                    },
                    "woff": {
                      "url": this.foreendFont + "_normal_normal" + ".woff",
                      "format": "woff"
                    },
                    "eot": {
                      "url": this.foreendFont + "_normal_normal" + ".eot?#iefix",
                      "format": "embedded-opentype"
                    },
                    "svg": {
                      "url": this.foreendFont + "_normal_normal" + ".svg#iconfont",
                      "format": "svg"
                    }
                  }
                };
                this.loadFont(paramsfont).then(function () {
                  def4.resolve();
                });
              } else {
                def4.resolve();
              }
            }
          }.bind(this), function (err) {
            def4.resolve();
          });
        }
      }, {
        key: "loadServerInfo",
        value: function loadServerInfo () {
          var _this3 = this;

          if (Object.keys(this.serverInfo).length > 0) {
            return;
          } //解析url，获取servername,styleId


          this.parseUrl();

          if (this.host && this.servername) {
            Object(_utils_es6_promise__WEBPACK_IMPORTED_MODULE_1__[/* getJSON */ "c"])({
              type: 'get',
              url: this.host + '/mapserver/serverInfo/' + this.servername + '.json',
              dataType: 'json'
            }).then(function (results) {
              if (results && results.layerMap) {
                if (results.layerMap) {
                  _this3.newEngine = true;

                  for (var key in results.layerMap) {
                    if (results.layerMap[key].label && results.layerMap[key].label.type.toLowerCase() == "area") {
                      // results.layerMap[key].fields.push({id:false,index:results.layerMap[key].fields.length,name:"_sort",type: "double"});
                      _this3.serverInfo[key] = {
                        geometryType: results.layerMap[key].geometryType,
                        fieldsConfig: results.layerMap[key].fields
                      };

                      if (!_this3.layerFieldMap[key]) {
                        _this3.layerFieldMap[key] = results.layerMap[key].fields.length + 1;
                      }
                    } else {
                      _this3.serverInfo[key] = {
                        geometryType: results.layerMap[key].geometryType,
                        fieldsConfig: results.layerMap[key].fields
                      };

                      if (!_this3.layerFieldMap[key]) {
                        _this3.layerFieldMap[key] = results.layerMap[key].fields.length;
                      }
                    }
                  }
                } else {
                  _this3.newEngine = false;
                }
              }

              _this3.isLoadServerInfoDef.resolve();
            }, function (error) {
              _this3.isLoadServerInfoDef.resolve();
            });
          }
        }
      }, {
        key: "loadFonts",
        value: function loadFonts (queryParam, def3) {
          Object(_utils_es6_promise__WEBPACK_IMPORTED_MODULE_1__[/* getJSON */ "c"])({
            url: this.host + '/mapserver/styleInfo/fonts/' + this.servername + '/' + this.styleId + '/list.json?' + Math.random() + '&' + queryParam,
            dataType: 'json'
          }).then(function (list) {
            var loadFontRequest = [];

            for (var i = 0; i < list.length; i++) {
              var item = list[i];
              loadFontRequest.push(this.loadFont(item));
            }

            Promise.all(loadFontRequest).then(function () {
              def3.resolve();
            });
          }.bind(this), function (err) {
            def3.resolve();
          });
        }
      }, {
        key: "loadFont",
        value: function loadFont (fontParsm) {
          var def0 = new _utils_es6_promise__WEBPACK_IMPORTED_MODULE_1__[/* Deferred */ "a"]();
          var fontFaceName = fontParsm['font-family'];
          var fontFileUrl = this.getBrowserFontUrl(fontParsm['urls']);
          var request = new XMLHttpRequest();
          var that = this;
          request.addEventListener('readystatechange', function () {
            if (request.readyState == 4) {
              if ('fonts' in document) {
                var junction_font = new FontFace(fontFaceName, request.response);
                junction_font.load().then(function (loaded_face) {
                  document.fonts.add(loaded_face);
                  def0.resolve();
                })["catch"](function (error) {
                  console.log("加载字体失败" + fontFaceName + error);
                });
              } else {
                if ('head' in document) {
                  var base64FontHeader = "data:application/x-font-eot;charset=utf-8;base64,";
                  var codes = new Uint8Array(request.response);
                  var bin = "";

                  for (var i = 0; i < codes.byteLength; i++) {
                    bin += String.fromCharCode(codes[i]);
                  }

                  var base64String = btoa(bin);
                  var dataUrl = base64FontHeader + base64String;
                  var cssText = "@font-face{font-family:" + fontFaceName + ";src:url('" + dataUrl + "');}";
                  that.createStyleTag(cssText);
                  def0.resolve();
                }
              }
            }
          });
          request.open('GET', fontFileUrl);
          request.responseType = 'arraybuffer';
          request.send();
          return def0;
        }
      }, {
        key: "checkFont",
        value: function checkFont (name) {
          var values = document.fonts.values();
          var isHave = false;
          var item = values.next();

          while (!item.done && !isHave) {
            var fontFace = item.value;

            if (fontFace.family == name) {
              isHave = true;
            }

            item = values.next();
          }

          return isHave;
        }
      }, {
        key: "createStyleTag",
        value: function createStyleTag (cssText) {
          if (cssText) {
            var head = document.head || document.getElementsByTagName('head')[0];
            var style = document.createElement('style');
            style.appendChild(document.createTextNode(cssText));
            head.appendChild(style);
          }
        }
        /**
         * 解析url
         */

      }, {
        key: "parseUrl",
        value: function parseUrl () {
          var urlParts = this.url.split('?');
          var urlPartOne = urlParts[0].split('/mapserver/');
          this.host = urlPartOne[0];
          this.servername = urlPartOne[1].split('/')[1];
          var params = urlParts[1].split('&');

          for (var i = 0; i < params.length; i++) {
            var param = params[i];
            var keyValue = param.split('=');

            if (keyValue[0] == 'styleId') {
              this.styleId = keyValue[1];
              return;
            }
          }
        }
        /**
         * 设置过滤条件
         */

      }, {
        key: "setFilter",
        value: function setFilter (filter) {
          this.control = null;

          if (!this.url || !filter || filter.layers.length == 0 && filter.order.length == 0) {
            return;
          }

          for (var i = 0; i < filter.layers.length; i++) {
            var filterLayer = filter.layers[i];

            if (!filterLayer.id) {
              filter.layers.splice(i, 1);
            }
          }

          this.control = JSON.stringify(filter);
        }
      }, {
        key: "getTexture",
        value: function getTexture (key) {
          return this.textures[key];
        }
      }, {
        key: "addTexture",
        value: function addTexture (key, texture) {
          this.textures[key] = texture;
        }
        /**
         * 是否为ie浏览器,ie9 除外，ie9无法跨域发送post带数据的请求
         */

      }, {
        key: "isIE",
        value: function isIE () {
          if (!!window.ActiveXObject || "ActiveXObject" in window) {
            //ie9 除外，ie9无法跨域发送post带数据的请求
            var b_version = navigator.appVersion;
            var version = b_version.split(";");

            if (version[1]) {
              var trim_Version = version[1].replace(/[ ]/g, "");

              if (trim_Version == 'MSIE9.0') {
                return false;
              }
            }

            return true;
          } else return false;
        }
      }, {
        key: "getBrowserFontUrl",
        value: function getBrowserFontUrl (urls) {
          var urlHead = this.host + '/mapserver/styleInfo/fonts/';
          var explorer = navigator.userAgent;
          var isIE = !!window.ActiveXObject || "ActiveXObject" in window; //ie

          if (explorer.indexOf("MSIE") > 0 || isIE) {
            return urlHead + urls['eot'].url;
          } //firefox
          else if (explorer.indexOf("Firefox") > 0) {
            return urlHead + urls['woff'].url;
          } //Chrome
          else if (explorer.indexOf("Chrome") > 0) {
            return urlHead + urls['ttf'].url;
          } //Opera
          //else if (explorer.indexOf("Opera") > 0) {}
          //Safari
          //else if (explorer.indexOf("Safari") > 0) {}
          //Netscape
          //else if (explorer.indexOf("Netscape") > 0) {}


          return null;
        }
      }]);

      return URLDataSource;
    }(_DataSource__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"]);

    ;
/* harmony default export */ __webpack_exports__["a"] = (URLDataSource);

    /***/
  }),
/* 17 */
/***/ (function (module, __webpack_exports__, __webpack_require__) {

    "use strict";
/* harmony import */ var _GDistance__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(12);
/* harmony import */ var _utils_gistools_GisTools__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5);
/* harmony import */ var _AvoidUtil__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3);
    function _classCallCheck (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    function _defineProperties (target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

    function _createClass (Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }





    var GCutLine = /*#__PURE__*/function () {
      function GCutLine () {
        _classCallCheck(this, GCutLine);
      }

      _createClass(GCutLine, null, [{
        key: "cutLineFeature",
        value: function cutLineFeature (feature, style) {
          var fs = [];
          var index = 0;

          if (feature.sourceData.length < 4) {
            return fs;
          }

          var cutFunctionArray = [{
            weight: feature.codeAvoidWeight,
            fun: this.createLineCodeFeatrue
          }, {
            weight: feature.weight,
            fun: this.createLineTextFeatrue
          }, {
            weight: feature.arrowAvoidWeight,
            fun: this.createLineArrowFeatrue
          }];
          cutFunctionArray = this.sort(cutFunctionArray);

          for (var i = 0; i < cutFunctionArray.length; i++) {
            var cutFun = cutFunctionArray[i].fun;
            var f = cutFun.call(this, feature, style, index);
            index = f.index;

            if (f.feature) {
              fs.push(f.feature);
            }
          } // let lineText = this.createLineTextFeatrue(feature,style,index);
          // index = lineText.index;
          // if(lineText.feature){
          //     fs.push(lineText.feature);
          // }
          //
          // let lineCode= this.createLineCodeFeatrue(feature,style,index);
          // index = lineCode.index;
          // if(lineCode.feature){
          //     fs.push(lineCode.feature);
          // }
          //
          // let lineArrow= this.createLineArrowFeatrue(feature,style,index);
          // if(lineArrow.feature){
          //     fs.push(lineArrow.feature);
          // }


          return fs;
        } //线编码，线文字，线箭头权重排序.

      }, {
        key: "sort",
        value: function sort (array) {
          if (array.length > 0) {
            //从大到少排序
            return array.sort(function (a, b) {
              if (a.weight < b.weight) {
                return 1;
              } else if (a.weight == b.weight) {
                return 0;
              } else {
                return -1;
              }
            });
          }
        }
        /**
         * 创建线文字注记
         *  Parameters :
         *  feature
         *  index - 可用的line的index位置
         */

      }, {
        key: "createLineTextFeatrue",
        value: function createLineTextFeatrue (feature, style, index) {
          var line = feature.sourceData;
          var d = new _GDistance__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"]();
          var gaps = [];
          var textFeature = null;

          if (_AvoidUtil__WEBPACK_IMPORTED_MODULE_2__[/* default */ "a"].isNotNull(feature.label) && index < line.length) {
            //线注记的文字内容
            feature.label = feature.label + '';

            if (style.lineHashBackground || style.isTransverse) {
              for (var count = 0; count < feature.label.length; count++) {
                gaps.push(style.lineHeight * 1.2 + 2);
              }
            } else {
              for (var _count = 0; _count < feature.label.length; _count++) {
                gaps.push(style.lineHeight * 1.2 + 2 + style.gap);
              }
            }

            gaps[0] = gaps[0] + 30;
            var cloneGaps = [].concat(gaps);
            var points = d.getNodePath(line, gaps);
            var textPoints = points.pointList;

            if (textPoints.length > 0) {
              var p1 = [textPoints[0][0][0], textPoints[0][0][1]];
              var p2 = textPoints[textPoints.length - 1][0]; //获取两点连线与x轴的夹角

              var angle = _AvoidUtil__WEBPACK_IMPORTED_MODULE_2__[/* default */ "a"].getAngle(p1, p2);

              if (style.changeDirection != false) {
                //改变方向
                //判断是否应该换方向
                var showChanged = this.isChangeDirection(feature.label, p1, p2, angle);

                if (showChanged) {
                  textPoints = textPoints.reverse();
                }
              }

              index = points.index;

              if (style.isTransverse || style.lineHashBackground) {
                textFeature = this.cloneFeature(feature);
                textFeature.attributeId = textFeature.attributeId + '_text';
                textFeature.sourceAngleData = [textPoints[0]];
                textFeature.lineType = 'text'; // return {feature:textFeature,index:index};
              } else {
                //需要延长的字个数
                var delayLength = feature.label.length - textPoints.length;

                if (delayLength > 0) {
                  index = line.length; //摆不下的字数少于3个字延长

                  if (delayLength < style.extendedNum) {
                    this.delayTextPoint(line, textPoints, feature.label, style.chinaLabelWidth + style.gap);
                  } else {
                    return {
                      feature: null,
                      index: index
                    };
                  }
                }

                textFeature = this.cloneFeature(feature);
                textFeature.angle = angle;
                textFeature.attributeId = textFeature.attributeId + '_text';
                textFeature.sourceAngleData = textPoints;
                textFeature.lineType = 'text';
              }
            } //平移


            if (style.lineOffset && textFeature) {
              if (textFeature.sourceAngleData.length == 1) {
                textFeature.sourceAngleData[0][0][1] = textFeature.sourceAngleData[0][0][1] - style.lineOffset;
              } else {
                textFeature.sourceAngleData = _utils_gistools_GisTools__WEBPACK_IMPORTED_MODULE_1__[/* default */ "a"].lineOffset(textFeature.sourceAngleData, style.lineOffset);
              }
            }
          }

          return {
            feature: textFeature,
            index: index
          };
        }
      }, {
        key: "boxScale",
        value: function boxScale (box, pointBoxDisance) {
          if (!pointBoxDisance && pointBoxDisance != 0) {
            pointBoxDisance = this.boxDistance;
          }

          box[0] = box[0] - pointBoxDisance * 0.5;
          box[1] = box[1] - pointBoxDisance * 0.5;
          box[2] = box[2] + pointBoxDisance * 0.5;
          box[3] = box[3] + pointBoxDisance * 0.5;
          return box;
        }
        /**
         * 创建线编码注记
         *  Parameters :
         *  feature
         *  index - 可用的line的index位置
         */

      }, {
        key: "createLineCodeFeatrue",
        value: function createLineCodeFeatrue (feature, style, index) {
          var line = feature.sourceData;
          var d = new _GDistance__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"]();
          var gaps = [];
          var codeFeature = null;
          var roadLabel = feature.roadCodeLabel; //如果有道路编码

          if (style.showRoadCode && _AvoidUtil__WEBPACK_IMPORTED_MODULE_2__[/* default */ "a"].isNotNull(roadLabel) && index < line.length) {
            var codeLine = line.slice(index, line.length - 1); //默认是30个像素

            gaps.push(30);
            var cPoints = d.getNodePath(codeLine, gaps);
            var codePoints = cPoints.pointList;

            if (codePoints.length == 1) {
              index = index + cPoints.index;
              codeFeature = this.cloneFeature(feature);
              codeFeature.attributeId = codeFeature.attributeId + '_code';
              codeFeature.sourceAngleData = codePoints;
              codeFeature.lineType = 'code';
              codeFeature.label = roadLabel + '';
              codeFeature.weight = feature.codeAvoidWeight;
            } //
            // if(codePoints.length ==0){
            //     codeFeature =  this.cloneFeature(feature);
            //     codeFeature.attributeId = codeFeature.attributeId+'_code';
            //     codeFeature.sourceAngleData = [[[line[0],line[1]],0]];
            //     codeFeature.lineType = 'code';
            //     codeFeature.label = roadLabel+'';
            //     index = index  + 2;
            //     return {feature:codeFeature,index:index};
            // }

          }

          return {
            feature: codeFeature,
            index: index
          };
        }
        /**
         * 创建线箭头注记
         *  Parameters :
         *  feature
         *  index - 可用的line的index位置
         */

      }, {
        key: "createLineArrowFeatrue",
        value: function createLineArrowFeatrue (feature, style, index) {
          var line = feature.sourceData;
          var d = new _GDistance__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"]();
          var gaps = [];
          var arrowFeature = null; //如果有箭头

          if (style.showArrow && index < line.length) {
            var direction = style.arrowDirectionValue;

            if (style.arrowDirectionField) {
              direction = feature.attributes[style.arrowDirectionField];
            }

            style.arrowSize = style.arrowSize ? style.arrowSize : 6;
            style.arrowDistance = style.arrowDistance ? style.arrowDistance : 12;
            style.arrowLineWidth = style.arrowLineWidth ? style.arrowLineWidth : 2;
            style.arrowStrokeStyle = style.arrowStrokeStyle ? style.arrowStrokeStyle : '#666666';
            style.arrowFillStyle = style.arrowFillStyle ? style.arrowFillStyle : '#666666';
            style.arrowDirectionValue = style.arrowDirectionValue ? style.arrowDirectionValue : 0;
            var arrowLine = line.slice(index, line.length - 1);
            gaps.push(16);

            if (direction == 0 || direction == null) {
              gaps.push(style.arrowSize);
              gaps.push(style.arrowDistance);
            } else {
              gaps.push(style.arrowDistance);
              gaps.push(style.arrowSize);
            }

            var aPoints = d.getNodePath(arrowLine, gaps);
            var arrowPoints = aPoints.pointList;

            if (arrowPoints.length == 3) {
              arrowFeature = this.cloneFeature(feature);
              arrowFeature.attributeId = arrowFeature.attributeId + '_arrow';
              arrowFeature.sourceAngleData = arrowPoints;
              arrowFeature.lineType = 'arrow';
              arrowFeature.weight = feature.arrowAvoidWeight;
            }
          }

          return {
            feature: arrowFeature,
            index: index
          };
        }
        /**
         * 当线文字放不下时，获取延长线上的点
         *  Parameters :
         *  line - 原始线坐标
         *  textPoints - 切割之后的点坐标
         *  label - 线注记
         *  gap - 每个字之间的间隔
         *  showChanged
         *
         */

      }, {
        key: "delayTextPoint",
        value: function delayTextPoint (line, textPoints, label, gap) {
          var fristPoint = null;
          var secondPoint = null; //如果只能放下一个字

          if (textPoints.length == 1) {
            fristPoint = [line[0], line[1]];
          } else {
            fristPoint = textPoints[textPoints.length - 2][0];
          }

          secondPoint = textPoints[textPoints.length - 1][0];
          var angle = textPoints[textPoints.length - 1][1];
          var len = textPoints.length;

          for (var i = 1; i < label.length - len + 1; i++) {
            var p = this.getPoint(fristPoint, secondPoint, gap * i);
            var textPoint = [p, angle];
            textPoints.push(textPoint);
          }
        }
        /**
         * 克隆feature
         *  Parameters :
         *  feature - 单个线注记要素
         */

      }, {
        key: "cloneFeature",
        value: function cloneFeature (feature) {
          return {
            type: feature.type,
            datas: feature.datas,
            centerPoint: feature.centerPoint,
            sourceData: feature.sourceData,
            label: feature.label,
            roadCodeLabel: feature.roadCodeLabel,
            attributes: feature.attributes,
            attributeId: feature.attributeId,
            styleId: feature.styleId,
            textures: feature.textures,
            xyz: feature.xyz,
            lineType: feature.lineType,
            weight: feature.weight
          };
        }
        /**
         * 是否需要改变线的方向
         *  Parameters :
         *  p1 - 线段起点
         *  p2 -线段的重点
         *  angle - 两点连线与x轴的夹角
         */

      }, {
        key: "isChangeDirection",
        value: function isChangeDirection (label, p1, p2, angle) {
          var showChange = false; //判断是否包含汉字

          if (/.*[\u4e00-\u9fa5]+.*$/.test(label)) {
            //如果是垂直线
            if (p1[0] == p2[0]) {
              if (p1[1] > p2[1]) {
                showChange = true;
                return showChange;
              }
            } //如果是反斜线，并且夹角与x轴的夹角大于45度


            if (angle < -45 && angle > -90) {
              if (p1[0] < p2[0]) {
                showChange = true;
              }
            } else {
              if (p1[0] > p2[0]) {
                showChange = true;
              }
            }
          } else {
            if (p1[0] > p2[0]) {
              showChange = true;
            }
          }

          return showChange;
        }
        /**
         * 求两点之间的距离
         */

      }, {
        key: "getDistance",
        value: function getDistance (p1, p2) {
          var calX = p2[0] - p1[0];
          var calY = p2[1] - p1[1];
          return Math.pow(calX * calX + calY * calY, 0.5);
        }
        /**
         * 获取线的长度
         */

      }, {
        key: "getLineDistance",
        value: function getLineDistance (line) {
          if (line.length < 4) {
            return 0;
          }

          var dis = 0;

          for (var i = 0; i < line.length / 2 - 1; i++) {
            var p1 = [line[2 * i], line[2 * i + 1]];
            var p2 = [line[2 * (i + 1)], line[2 * (i + 1) + 1]];
            dis = dis + this.getDistance(p1, p2);
          }

          return dis;
        }
        /**
         * 已知两点，延长距离，获取延长线上的点坐标
         */

      }, {
        key: "getPoint",
        value: function getPoint (p1, p2, d) {
          var xab = p2[0] - p1[0];
          var yab = p2[1] - p1[1];
          var xd = p2[0];
          var yd = p2[1];

          if (xab == 0) {
            if (yab > 0) {
              yd = p2[1] + d;
            } else {
              yd = p2[1] - d;
            }
          } else {
            var xbd = Math.sqrt(d * d / (yab / xab * (yab / xab) + 1));

            if (xab < 0) {
              xbd = -xbd;
            }

            xd = p2[0] + xbd;
            yd = p2[1] + yab / xab * xbd;
          }

          return [xd, yd];
        }
      }]);

      return GCutLine;
    }();

/* harmony default export */ __webpack_exports__["a"] = (GCutLine);

    /***/
  }),
/* 18 */
/***/ (function (module, __webpack_exports__, __webpack_require__) {

    "use strict";

    // EXTERNAL MODULE: external "L"
    var external_L_ = __webpack_require__(0);
    var external_L_default = /*#__PURE__*/__webpack_require__.n(external_L_);

    // EXTERNAL MODULE: ./src/utils/es6-promise.js
    var es6_promise = __webpack_require__(1);

    // EXTERNAL MODULE: ./src/layer/vector/draw/GVMapGridUtil.js
    var GVMapGridUtil = __webpack_require__(9);

    // CONCATENATED MODULE: ./src/layer/vector/draw/PropertyGetter.js
    function _classCallCheck (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    function _defineProperties (target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

    function _createClass (Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

    /**
     * Created by kongjian on 2017/6/26.
     */
    var PropertyGetter = /*#__PURE__*/function () {
      function PropertyGetter (propertyConfig) {
        _classCallCheck(this, PropertyGetter);

        this.propertyConfig = {};

        for (var i = 0; i < propertyConfig.length; i++) {
          if (propertyConfig[i].id == 'true' || propertyConfig[i].id == true) {
            this.idIndex = propertyConfig[i].index;
          }

          this.propertyConfig[propertyConfig[i].name] = parseInt(propertyConfig[i].index);
        }
      }

      _createClass(PropertyGetter, [{
        key: "get",
        value: function get (data, propertyName) {
          var value = data[this.propertyConfig[propertyName]];
          return value;
        }
      }, {
        key: "getId",
        value: function getId (data) {
          return data[this.idIndex];
        }
      }]);

      return PropertyGetter;
    }();

/* harmony default export */ var draw_PropertyGetter = (PropertyGetter);
    // CONCATENATED MODULE: ./src/layer/vector/draw/AbstractDataHolder.js
    function AbstractDataHolder_classCallCheck (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    function AbstractDataHolder_defineProperties (target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

    function AbstractDataHolder_createClass (Constructor, protoProps, staticProps) { if (protoProps) AbstractDataHolder_defineProperties(Constructor.prototype, protoProps); if (staticProps) AbstractDataHolder_defineProperties(Constructor, staticProps); return Constructor; }

    /**
     * Created by kongjian on 2017/6/26.
     */


    var AbstractDataHolder_AbstractDataHolder = /*#__PURE__*/function () {
      function AbstractDataHolder (config, drawerCalss) {
        AbstractDataHolder_classCallCheck(this, AbstractDataHolder);

        this.layerDataMap = config.layerDataMap;
        this.extent = config.extent;
        this.ctx = config.ctx;
        this.ratio = config.ratio;
        this.control = config.control;
        this.drawerCalss = drawerCalss;
        this.config = config;
        this.textures = config.textures;
      }

      AbstractDataHolder_createClass(AbstractDataHolder, [{
        key: "_emptyDrawer",
        value: function _emptyDrawer (styleLayerID) {
          var drawer = new this.drawerCalss(null);
          return drawer;
        }
      }, {
        key: "getLayer",
        value: function getLayer (dataLayerID, styleLayerID) {
          if (styleLayerID == null) {
            styleLayerID = dataLayerID;
          }

          if (null == this.layerDataMap) {
            return this._emptyDrawer(styleLayerID);
          } //判断其他图层是否显示Control otherDisplay,如果是其他图层不显示，则需要在这里处理


          if (this.control != null) {
            //      console.log(this.control.controlObj.otherDisplay);
            if (this.control.controlObj.otherDisplay == false) {
              if (this.control.controlObj.controlLayersArr.indexOf(styleLayerID) == -1) {
                return this._emptyDrawer(styleLayerID);
              }
            }
          }

          var data = this.layerDataMap[dataLayerID];

          if (data == null) {
            return this._emptyDrawer(styleLayerID);
          } else {
            //修正一个十分傻逼的错误,好吧，我英语不好
            if (data.datas) {
              data.features = data.datas;
            } // delete data.datas;


            if (data.features == null) {
              return this._emptyDrawer(styleLayerID);
            }

            var propertyGetter = null;

            if (null !== data.fieldsConfig) {
              propertyGetter = new draw_PropertyGetter(data.fieldsConfig);
            }

            this.config['dataLayerID'] = dataLayerID;
            this.config['styleLayerID'] = styleLayerID;
            this.config['propertyGetter'] = propertyGetter;
            this.config['control'] = this.control;
            this.config['textures'] = this.textures;
            var drawer = new this.drawerCalss(this.config);

            if (!Array.isArray(data.features)) {
              for (var index in data.features) {
                var feature = data.features[index];
                feature.type = data.type;
                drawer.addFeatures(feature);
              }
            } else {
              var _feature = data.features;
              _feature.type = data.type;
              drawer.addFeatures(_feature);
            }

            return drawer;
          }
        }
      }, {
        key: "getGroupLayer",
        value: function getGroupLayer (dataLayerID, value, styleLayerID) {
          if (this.layerDataMap == null) {
            return this._emptyDrawer(styleLayerID);
          }

          if (styleLayerID == null) {
            styleLayerID = dataLayerID;
          } //判断其他图层是否显示Control otherDisplay,如果是其他图层不显示，则需要在这里处理


          if (this.control != null) {
            //      console.log(this.control.controlObj.otherDisplay);
            if (this.control.controlObj.otherDisplay == false) {
              if (this.control.controlObj.controlLayersArr.indexOf(styleLayerID) == -1) {
                return this._emptyDrawer(styleLayerID);
              }
            }
          }

          var data = this.layerDataMap[dataLayerID];

          if (this.layerDataMap == null) {
            return this._emptyDrawer(styleLayerID);
          }

          if (data == null) {
            return this._emptyDrawer(styleLayerID);
          }

          if (data.datas == null && data.data == null) {
            return this._emptyDrawer(styleLayerID);
          }

          var valueArr = value.split(',');
          var length = valueArr.length;

          if (length == 0) {
            return this._emptyDrawer(styleLayerID);
          }

          var propertyGetter = null;

          if (data.fieldsConfig != null) {
            propertyGetter = new draw_PropertyGetter(data.fieldsConfig);
          }

          this.config['dataLayerID'] = dataLayerID;
          this.config['styleLayerID'] = styleLayerID;
          this.config['propertyGetter'] = propertyGetter;
          this.config['control'] = this.control;
          this.config['textures'] = this.textures;
          var drawer = new this.drawerCalss(this.config);

          if (data.data == null) {
            data.features = data.datas;
          } else {
            data.features = data.data;
          }

          for (var i = 0; i < length; i++) {
            var dataArr = data.features[valueArr[i]];

            if (dataArr == null) {
              continue;
            }

            dataArr.type = data.type;
            drawer.addFeatures(dataArr);
          }

          return drawer;
        }
      }]);

      return AbstractDataHolder;
    }();

/* harmony default export */ var draw_AbstractDataHolder = (AbstractDataHolder_AbstractDataHolder);
    // CONCATENATED MODULE: ./src/layer/vector/draw/AbstractVTileProcess.js
    function AbstractVTileProcess_classCallCheck (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    function AbstractVTileProcess_defineProperties (target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

    function AbstractVTileProcess_createClass (Constructor, protoProps, staticProps) { if (protoProps) AbstractVTileProcess_defineProperties(Constructor.prototype, protoProps); if (staticProps) AbstractVTileProcess_defineProperties(Constructor, staticProps); return Constructor; }

    /**
     * Created by kongjian on 2017/6/26.
     */
    var AbstractVTileProcess = /*#__PURE__*/function () {
      function AbstractVTileProcess (config) {
        AbstractVTileProcess_classCallCheck(this, AbstractVTileProcess);

        if (config) {
          //放数据的容器
          this.featuresArr = []; //属性构造器

          this.propertyGetter = config.propertyGetter; //网格

          this.extent = config.extent;
          /**
           * 缩放比例
           * @type {*|number}
           */

          this.ratio = config.ratio;
          this.resize = false;

          if (this.ratio != 1) {
            this.resize = true;
          }
          /**
           * 等级
           */


          this.level = this.extent.level;
          /**
           * 数据层级ID
           */

          this.dataLayerID = config.dataLayerID;
          /**
           * 样式层级ID
           */

          this.styleLayerID = config.styleLayerID;
          /**
           * 过滤器
           * @type {*|null}
           */

          this.control = config.control;
        }
      }
      /**
       * 加入处理数据
       * @param features
       */


      AbstractVTileProcess_createClass(AbstractVTileProcess, [{
        key: "addFeatures",
        value: function addFeatures (features) {
          this.featuresArr.push(features);
        }
        /**
         * 加入处理样式
         * @param fn
         */

      }, {
        key: "setStyle",
        value: function setStyle (fn) {
          this.styleOperator = fn;
        }
        /**
         *处理
         */

      }, {
        key: "process",
        value: function process () {
          var queryFilter = null;

          if (this.featuresArr == null) {
            return;
          }

          var length = this.featuresArr.length;

          if (length == 0) {
            return;
          }

          for (var i = 0; i < length; i++) {
            var features = this.featuresArr[i];

            this._processFeatures(features);
          }
        }
      }, {
        key: "_processFeature",
        value: function _processFeature (gjson) {
          throw "抽象方法";
        }
      }, {
        key: "_processFeatures",
        value: function _processFeatures (features) {
          for (var i = 0; i < features.length; i++) {
            var gjson = features[i];

            this._processFeature(gjson);
          }

          return;
        }
      }, {
        key: "_getProperty",
        value: function _getProperty (data) {
          return data[1];
        }
      }, {
        key: "_getPoints",
        value: function _getPoints (data) {
          return data[2];
        }
      }, {
        key: "_getType",
        value: function _getType (data) {
          return data[0];
        }
      }, {
        key: "_filterByStyle",
        value: function _filterByStyle (gjson) {
          var type = this._getType(gjson);

          var points = this._getPoints(gjson);

          var property = this._getProperty(gjson);

          if (points == null) {
            throw "绘制失败,数据中缺少Geometry";
          }

          if (type == null) {
            type = "POLYGON";
          }

          var controlRes = null;
          var style = null;

          if (this.styleOperator == null) {
            return null;
          } else {
            this.propertyGetter;
            var id = this.propertyGetter.getId(property);
            var _propertyGetter = this.propertyGetter;

            var get = function get (fieldName) {
              return _propertyGetter.get(property, fieldName);
            };

            if (this.control) {
              if (typeof this.control.controlFn == "function") {
                controlRes = this.control.controlFn.call({}, id, get, this.styleLayerID);

                if (controlRes == false || controlRes == null) {
                  return {
                    display: false
                  };
                }
              }
            }

            style = this.styleOperator.call({}, this.level, get); //   } catch (e) {
            //        throw e;
            //    }
          }

          if (style == null) {
            return null;
          }

          if (style.display != null) {
            if (style.display == false) {
              return {
                display: false
              };
            }
          }

          if (controlRes != null) {
            style.customeColor = controlRes;
          }

          return style;
        }
      }]);

      return AbstractVTileProcess;
    }();

/* harmony default export */ var draw_AbstractVTileProcess = (AbstractVTileProcess);
    // CONCATENATED MODULE: ./src/layer/vector/draw/Drawer.js
    function _typeof (obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof (obj) { return typeof obj; }; } else { _typeof = function _typeof (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

    function Drawer_classCallCheck (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    function Drawer_defineProperties (target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

    function Drawer_createClass (Constructor, protoProps, staticProps) { if (protoProps) Drawer_defineProperties(Constructor.prototype, protoProps); if (staticProps) Drawer_defineProperties(Constructor, staticProps); return Constructor; }

    function _inherits (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

    function _setPrototypeOf (o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf (o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

    function _createSuper (Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal () { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

    function _possibleConstructorReturn (self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

    function _assertThisInitialized (self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

    function _isNativeReflectConstruct () { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () { })); return true; } catch (e) { return false; } }

    function _getPrototypeOf (o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf (o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

    /**
     * Created by kongjian on 2017/5/1.
     */


    var Drawer = /*#__PURE__*/function (_AbstractVTileProcess) {
      _inherits(Drawer, _AbstractVTileProcess);

      var _super = _createSuper(Drawer);

      function Drawer (config) {
        var _this;

        Drawer_classCallCheck(this, Drawer);

        _this = _super.call(this, config);

        if (config) {
          _this.ctx = config.ctx;
          _this.shadowDatas = [];
          _this.textures = config.textures;
        }

        return _this;
      }

      Drawer_createClass(Drawer, [{
        key: "draw",
        value: function draw () {
          if (this.featuresArr == null) {
            return;
          }

          this.process();

          for (var j = 0; j < this.shadowDatas.length; j++) {
            var shadowData = this.shadowDatas[j];

            this._drawShape(shadowData.data);

            this._processShadowEnd(shadowData.style);
          }
        }
      }, {
        key: "_processShadowEnd",
        value: function _processShadowEnd (style) {
          this.ctx.closePath();

          if (style['shadowColor']) {
            this.ctx.globalAlpha = 1;
            this.ctx.fillStyle = style['shadowColor'];
            this.ctx.fill();
          }
        }
      }, {
        key: "_drawShape",
        value: function _drawShape (points) {
          var context = this.ctx;

          if (!points.length) {
            return;
          }

          context.beginPath();

          if (this.resize) {
            context.moveTo(points[0] * this.ratio, points[1] * this.ratio);

            for (var i = 2, il = points.length; i < il; i += 2) {
              context.lineTo(points[i] * this.ratio, points[i + 1] * this.ratio);
            }
          } else {
            context.moveTo(points[0], points[1]);

            for (var i = 2, il = points.length; i < il; i += 2) {
              context.lineTo(points[i], points[i + 1]);
            }
          }

          context.closePath();
        }
      }, {
        key: "_processFeature",
        value: function _processFeature (gjson) {
          var style = this._filterByStyle(gjson);

          if (style == null) {
            return;
          }

          if (style.display == false) {
            return;
          }

          this._beginDraw();

          this._drawFeature(gjson, style);
        }
      }, {
        key: "_beginDraw",
        value: function _beginDraw () {
          this.ctx.beginPath();
        }
      }, {
        key: "_drawFeature",
        value: function _drawFeature (gjson, style) {
          var type = this._getType(gjson);

          var points = this._getPoints(gjson);

          var property = this._getProperty(gjson);

          if (points == null) {
            throw "绘制失败,数据中缺少Geometry";
          }

          if (type == null) {
            type = "POLYGON";
          }

          var sparsity = null;

          if (style.sparsity != null) {
            sparsity = parseFloat(style.sparsity);
          }

          switch (type) {
            case "PT":
              this._processPoint(points);

              break;

            case "LINESTRING":
              this._processLineString(points, sparsity);

              this._processLineStringEnd(style);

              break;

            case "MULTILINESTRING":
              this._processLineString(points, sparsity);

              this._processLineStringEnd(style);

              break;

            case "MULTIPOLYGON":
              this._processPolygon(points, sparsity);

              this._processPolygonEnd(style);

              break;

            case "POLYGON":
              this._processPolygon(points, sparsity);

              this._processPolygonEnd(style);

              break;

            default:
              break;
          }

          if (style['shadowColor']) {
            this._processShadow(points, style, type);
          }
        }
      }, {
        key: "_processShadow",
        value: function _processShadow (components, style, type) {
          var len = components.length;

          for (var i = 0; i < len; i++) {
            var component = components[i];

            if (Array.isArray(component)) {
              if (component.length == 0) {
                return;
              }

              if (Array.isArray(component[0])) {
                this._processShadow(component);
              } else {
                this._drawShadow(component, style, type);
              }
            } else {
              var PS = component.PS;

              this._drawShadow(PS, style, type);
            }
          }
        }
      }, {
        key: "_drawShadow",
        value: function _drawShadow (points, style, type) {
          var h = -3.5;

          if (type == 'MULTIPOLYGON' || type == 'POLYGON') {
            for (var i = 0; i < points.length - 3; i += 2) {
              var _a = {};
              var _b = {};
              _a.x = points[i];
              _a.y = points[i + 1];
              _b.x = points[i + 2];
              _b.y = points[i + 3];
              var ax = _a.x;
              var ay = _a.y + h;
              var bx = _b.x;
              var by = _b.y + h;

              if ((bx - ax) * (_a.y - ay) < (_a.x - ax) * (by - ay)) {
                // this._drawShape([
                //     bx , by ,
                //     ax , ay ,
                //     _a.x, _a.y,
                //     _b.x, _b.y
                // ],true);
                // this._processShadowEnd(style);
                var shadowData = {};
                shadowData.data = [bx, by, ax, ay, _a.x, _a.y, _b.x, _b.y];
                shadowData.style = style;
                this.shadowDatas.push(shadowData);
              }
            }
          }
        }
      }, {
        key: "_processPoint",
        value: function _processPoint (points) { }
      }, {
        key: "_processLineString",
        value: function _processLineString (components, sparsity) {
          if (Array.isArray(components[0])) {
            var len = components.length;

            for (var i = 0; i < len; i++) {
              var component = components[i];

              this._processLineString(component, sparsity);
            }
          } else {
            this._renderLinePath(components, false, sparsity);
          }
        }
      }, {
        key: "_processLineStringEnd",
        value: function _processLineStringEnd (style) {
          var stroke = true;

          if (style.stroke == false) {
            stroke = false;
          }

          if (stroke != false) {
            if (this.resize) {
              this.ctx.lineWidth = style.strokeWidth * this.ratio;
            } else {
              this.ctx.lineWidth = style.strokeWidth;
            }

            this.ctx.strokeStyle = style.strokeColor;
            this.ctx.globalAlpha = style.strokeOpacity;

            if (style.dash != null) {
              this.ctx.setLineDash(style.dash);
            }

            if (style.lineCap) {
              this.ctx.lineCap = style.lineCap;
            }

            this.ctx.stroke();
            var customeColor = style['customeColor'];

            if (_typeof(customeColor) == "object" && customeColor['color'] != null) {
              this.ctx.strokeStyle = customeColor['color'];
              this.ctx.globalAlpha = customeColor['opacity'];
              this.ctx.stroke();
            }

            this.ctx.setLineDash([]);
            this.ctx.lineJoin = "round";
            this.ctx.lineCap = "butt";
          }
        }
      }, {
        key: "_processPolygon",
        value: function _processPolygon (components, sparsity) {
          if (Array.isArray(components[0])) {
            var len = components.length;

            for (var i = 0; i < len; i++) {
              var component = components[i];

              this._processPolygon(component, sparsity);
            }
          } else {
            this._renderLinePath(components, true, sparsity);
          }
        }
      }, {
        key: "_processPolygonEnd",
        value: function _processPolygonEnd (style) {
          var stroke = false;
          var fill = false;

          if (style.stroke == true) {
            stroke = true;
          }

          if (style.fill == true) {
            fill = true;
          }

          if (fill) {
            if (style['fillColor']) {
              this.ctx.fillStyle = style['fillColor'];
            }

            if (style['fillOpacity']) {
              this.ctx.globalAlpha = style['fillOpacity'];
            } else {
              this.ctx.globalAlpha = 1;
            }

            this.ctx.fill();
          }

          if (stroke) {
            if (style['strokeWidth']) {
              if (this.resize) {
                this.ctx.lineWidth = style.strokeWidth * this.ratio;
              } else {
                this.ctx.lineWidth = style.strokeWidth;
              }
            }

            if (style['strokeColor']) {
              this.ctx.strokeStyle = style['strokeColor'];
            }

            if (style['strokeOpacity']) {
              this.ctx.globalAlpha = style['strokeOpacity'];
            } else {
              this.ctx.globalAlpha = 1;
            }

            this.ctx.stroke();
          }

          if (style['texture']) {
            var textureId = style['texture'];
            var texture = this.textures(textureId);

            if (texture != null) {
              var ratio = style['textureratio'];
              var pat = this.ctx.createPattern(texture.toPattern(ratio), "repeat");
              this.ctx.fillStyle = pat;
              this.ctx.fill();
            }
          }

          var customeColor = style['customeColor'];

          if (_typeof(customeColor) == "object" && customeColor['color'] != null) {
            this.ctx.fillStyle = customeColor['color'];
            this.ctx.globalAlpha = customeColor['opacity'];
            this.ctx.fill();
          }
        }
      }, {
        key: "_isSavePoint",
        value: function _isSavePoint (previous, now, next, sparsity) {
          if (previous == null || next == null) {
            return true;
          }

          var dx = now[0] - previous[0];
          var dy = now[1] - previous[1];
          var dx1 = next[0] - now[0];
          var dy1 = next[1] - now[1];

          if (Math.sqrt(dx * dx + dy * dy) < sparsity && Math.sqrt(dx1 * dx1 + dy1 * dy1) < sparsity) {
            return false;
          } else {
            return true;
          }
        }
      }, {
        key: "_renderLinePath",
        value: function _renderLinePath (points, close, sparsity) {
          //   sparsity = 2.5
          if (this.resize) {
            this.ctx.moveTo(points[0] * this.ratio, points[1] * this.ratio);
          } else {
            this.ctx.moveTo(points[0], points[1]);
          }

          var i = 2;
          var len = points.length;

          if (len % 2 != 0) {
            len = len - 1;
          }

          var previous = [points[0], points[1]];
          var now = null;
          var next = null;

          while (i < len) {
            var gap = 0;
            now = [points[i], points[i + 1]];

            if (sparsity != null) {
              if (i + 2 > len) {
                next = null;
              } else {
                next = [points[i + 2], points[i + 3]];
              }

              while (!this._isSavePoint(previous, now, next, sparsity * this.ratio)) {
                gap = gap + 2;
                now = [points[i + gap], points[i + 1 + gap]];

                if (i + 2 + gap > len) {
                  next = null;
                } else {
                  next = [points[i + 2 + gap], points[i + 3 + gap]];
                }
              }
            }

            if (this.resize) {
              this.ctx.lineTo(now[0] * this.ratio, now[1] * this.ratio);
            } else {
              this.ctx.lineTo(now[0], now[1]);
            }

            previous = now;
            i = i + gap + 2;
          }

          if (close) {
            if (this.resize) {
              this.ctx.lineTo(points[0] * this.ratio, points[1] * this.ratio);
            } else {
              this.ctx.lineTo(points[0], points[1]);
            }

            this.ctx.closePath();
          }
        }
      }]);

      return Drawer;
    }(draw_AbstractVTileProcess);

/* harmony default export */ var draw_Drawer = (Drawer);
    // CONCATENATED MODULE: ./src/layer/vector/draw/BackgroundDrawer.js
    function BackgroundDrawer_classCallCheck (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    function BackgroundDrawer_defineProperties (target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

    function BackgroundDrawer_createClass (Constructor, protoProps, staticProps) { if (protoProps) BackgroundDrawer_defineProperties(Constructor.prototype, protoProps); if (staticProps) BackgroundDrawer_defineProperties(Constructor, staticProps); return Constructor; }

    /**
     * Created by kongjian on 2017/6/26.
     */
    var BackgroundDrawer = /*#__PURE__*/function () {
      function BackgroundDrawer (config) {
        BackgroundDrawer_classCallCheck(this, BackgroundDrawer);

        this.ratio = config.ratio;
        this.datasArr = [];
        this.ctx = config.ctx;
        this.extent = config.extent;
        this.control = config.control;
        this.styleFn = null;
        this.drawable = false;
      }

      BackgroundDrawer_createClass(BackgroundDrawer, [{
        key: "getName",
        value: function getName () {
          return this.name;
        }
        /**
         * 加入样式队列
         * @param fn
         */

      }, {
        key: "setStyle",
        value: function setStyle (fn) {
          this.styleFn = fn;
        }
      }, {
        key: "draw",
        value: function draw () {
          this.drawable = true;
          this.doDraw();
        }
        /**
         * 绘制
         */

      }, {
        key: "doDraw",
        value: function doDraw (layerFilter) {
          return; // if (this.drawable) {
          //     // console.log(this.control.controlObj)
          //     if (this.control != null) {
          //         if (this.control.controlObj != null) {
          //             if (this.control.controlObj.otherDisplay == false) {
          //                 return;
          //             }
          //         }
          //     }
          //     let style = null;
          //     style = this.styleFn.call({}, this.level);
          //     if (style.backgroundColor == "undefined") {
          //         return;
          //     }
          //     if (style.backgroundColor) {
          //         this.ctx.fillStyle = style.backgroundColor;
          //     }
          //     if (style.fillOpacity) {
          //         this.ctx.globalAlpha = style.fillOpacity / 100;
          //     } else {
          //         this.ctx.globalAlpha = 1;
          //     }
          //     this.ctx.fillRect(0, 0, 512 * this.ratio, 512 * this.ratio);
          // }
        }
      }]);

      return BackgroundDrawer;
    }();

/* harmony default export */ var draw_BackgroundDrawer = (BackgroundDrawer);
    // CONCATENATED MODULE: ./src/layer/vector/draw/DataHolder.js
    function DataHolder_typeof (obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { DataHolder_typeof = function _typeof (obj) { return typeof obj; }; } else { DataHolder_typeof = function _typeof (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return DataHolder_typeof(obj); }

    function DataHolder_classCallCheck (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    function DataHolder_defineProperties (target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

    function DataHolder_createClass (Constructor, protoProps, staticProps) { if (protoProps) DataHolder_defineProperties(Constructor.prototype, protoProps); if (staticProps) DataHolder_defineProperties(Constructor, staticProps); return Constructor; }

    function DataHolder_inherits (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) DataHolder_setPrototypeOf(subClass, superClass); }

    function DataHolder_setPrototypeOf (o, p) { DataHolder_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf (o, p) { o.__proto__ = p; return o; }; return DataHolder_setPrototypeOf(o, p); }

    function DataHolder_createSuper (Derived) { var hasNativeReflectConstruct = DataHolder_isNativeReflectConstruct(); return function _createSuperInternal () { var Super = DataHolder_getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = DataHolder_getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return DataHolder_possibleConstructorReturn(this, result); }; }

    function DataHolder_possibleConstructorReturn (self, call) { if (call && (DataHolder_typeof(call) === "object" || typeof call === "function")) { return call; } return DataHolder_assertThisInitialized(self); }

    function DataHolder_assertThisInitialized (self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

    function DataHolder_isNativeReflectConstruct () { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () { })); return true; } catch (e) { return false; } }

    function DataHolder_getPrototypeOf (o) { DataHolder_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf (o) { return o.__proto__ || Object.getPrototypeOf(o); }; return DataHolder_getPrototypeOf(o); }

    /**
     * Created by kongjian on 2017/6/26.
     */




    var DataHolder_DataHolder = /*#__PURE__*/function (_AbstractDataHolder) {
      DataHolder_inherits(DataHolder, _AbstractDataHolder);

      var _super = DataHolder_createSuper(DataHolder);

      function DataHolder (config) {
        DataHolder_classCallCheck(this, DataHolder);

        return _super.call(this, config, draw_Drawer);
      }

      DataHolder_createClass(DataHolder, [{
        key: "getBackground",
        value: function getBackground () {
          var backgroundDrawer = new draw_BackgroundDrawer({
            extent: this.extent,
            ctx: this.ctx,
            control: this.control,
            ratio: this.ratio
          });
          return backgroundDrawer;
        }
      }, {
        key: "getWatermark",
        value: function getWatermark () { }
      }]);

      return DataHolder;
    }(draw_AbstractDataHolder);

/* harmony default export */ var draw_DataHolder = (DataHolder_DataHolder);
    // EXTERNAL MODULE: ./src/ext/Version.js
    var Version = __webpack_require__(2);

    // CONCATENATED MODULE: ./src/layer/vector/GVMapGrid.js
    /**
     * Created by kongjian on 2017/9/26.
     * 前端绘制底图layer
     */





    var GVMapGrid = external_L_default.a.TileLayer.extend({
      //多个服务器url的域名，用于解决一个域名只有6条请求管线的限制
      urlArray: [],
      // 不带过滤条件的url
      sourceUrl: null,
      // 纹理图标集合
      textures: {},
      //瓦片队列
      tileQueue: [],
      //缩放比例
      ratio: 1,
      //过滤json对象
      control: null,
      //过滤的id
      controlId: null,
      //瓦片大小
      tilesize: 256,
      initialize: function initialize (url, options) {
        if (window.devicePixelRatio > 1.5) {
          this.ratio = 2;
        }

        if (!this.sourceUrl) {
          this.sourceUrl = url;
        }

        if (options && options.tileSize) {
          this.tilesize = options.tileSize;
        }

        this.gVMapGridUtil = new GVMapGridUtil["a" /* default */]();
        this.gVMapGridUtil.tileSize = this.tilesize;
        this.gVMapGridUtil.parseUrl(url);
        this._url = url + '&ratio=' + this.ratio + '&tilesize=' + this.tilesize + '&clientVersion=' + Version["a" /* default */];
        external_L_default.a.setOptions(this, options);
        this.on('tileunload', this._onTileRemove);
        this.on('tileload', this._onTileLoad);
        this.on('tileerror', this._onTileError);
      },
      onAdd: function onAdd () {
        if (this.control) {
          this._url = this.sourceUrl + '&ratio=' + this.ratio + '&tilesize=' + this.tilesize + '&clientVersion=' + Version["a" /* default */] + '&control=' + this.control;
        }

        if (this.controlId) {
          this._url = this.sourceUrl + '&ratio=' + this.ratio + '&tilesize=' + this.tilesize + '&clientVersion=' + Version["a" /* default */] + '&controlId=' + this.controlId;
        }

        this._initContainer();

        this._levels = {};
        this._tiles = {};
        var reqArr = this.gVMapGridUtil.loadStyle('layer');
        Promise.all(reqArr).then(function () {
          this._resetView();

          this._update();
        }.bind(this));
      },

      /**
       * 重写构造瓦片的方法
       */
      createTile: function createTile (coords, done) {
        //从队列中取canvas，避免频繁创建canvas
        var tile = this.tileQueue.pop();

        if (!tile) {
          tile = this.initTile();
        } else {
          this._cleanTile(tile);
        }

        var url = this.getTileUrl(coords);
        Object(es6_promise["c" /* getJSON */])({
          url: url,
          dataType: 'json'
        }).then(function (data) {
          tile.data = data;

          this._tileOnLoad.apply(this, [done, tile]);
        }.bind(this), function (error) {
          this._tileOnError.apply(this, [done, tile, error]);
        }.bind(this));
        return tile;
      },

      /**
       * 获取url的方法
       */
      getTileUrl: function getTileUrl (coords) {
        var data = {
          r: external_L_default.a.Browser.retina ? '@2x' : '',
          s: this._getSubdomain(coords),
          x: coords.x,
          y: coords.y,
          z: this._getZoomForUrl()
        };

        if (this._map && !this._map.options.crs.infinite) {
          var invertedY = this._globalTileRange.max.y - coords.y;

          if (this.options.tms) {
            data['y'] = invertedY;
          }

          data['-y'] = invertedY;
        }

        if (this.urlArray.length == 0) {
          return external_L_default.a.Util.template(this._url, external_L_default.a.extend(data, this.options));
        } else {
          //从urlArray中随机取出一个url
          var len = this.urlArray.length - 1;
          var index = Math.round(Math.random() * len);
          var url = this.urlArray[index];

          var array = this._url.split('/mapserver');

          var partUrl = array[1];
          url = url + '/mapserver' + partUrl;
          return external_L_default.a.Util.template(url, external_L_default.a.extend(data, this.options));
        }
      },

      /**
       *  初始化canvas
       */
      initTile: function initTile () {
        // console.time('initTile');
        var tile = document.createElement("canvas");
        tile.style.width = this.tilesize + "px";
        tile.style.height = this.tilesize + "px";
        tile.width = this.tilesize;
        tile.height = this.tilesize;
        var ctx = tile.getContext("2d", {
          isQuality: true
        });
        tile.ctx = ctx; // console.timeEnd('initTile');

        return tile;
      },
      //移除瓦片
      _onTileRemove: function _onTileRemove (e) {
        //加入到瓦片队列
        this.tileQueue.push(e.tile);
      },

      /**
       *  重写，取消请求的操作
       */
      _abortLoading: function _abortLoading () {
        var i, tile;

        for (i in this._tiles) {
          if (this._tiles[i].coords.z !== this._tileZoom) {
            tile = this._tiles[i].el;

            if (!tile.complete) {
              external_L_default.a.DomUtil.remove(tile);
            }
          }
        }
      },
      _onTileLoad: function _onTileLoad (item) {
        var tile = item.tile;

        this._drawTile(tile, tile.data);

        tile.complete = true;
      },
      _onTileError: function _onTileError (item) {
        var tile = item.tile;
        tile.complete = true;
        this.tileQueue.push(tile);
      },
      _tileOnError: function _tileOnError (done, tile, e) {
        done(e, tile);
      },
      _drawTile: function _drawTile (tile, features) {
        // console.time('_drawTile');
        var ctx = tile.ctx;
        var level = Math.floor(this._map.getZoom());
        var holder = new draw_DataHolder({
          layerDataMap: features,
          ctx: ctx,
          ratio: 1,
          control: null,
          textures: this.gVMapGridUtil.textures,
          extent: {
            level: level
          }
        });
        this.gVMapGridUtil.styleFun.call({}, holder, level); // console.timeEnd('_drawTile');
      },
      _cleanTile: function _cleanTile (tile) {
        tile.ctx.clearRect(0, 0, this.tilesize, this.tilesize);
      },
      _update: function _update () {
        if (this.isSetIngFilter) {
          return;
        }

        external_L_default.a.TileLayer.prototype._update.call(this);
      },

      /**
       * 设置过滤条件
       */
      setFilter: function setFilter (filter) {
        this.isSetIngFilter = true;

        if (!this._url || !filter || filter.layers.length == 0 && filter.order.length == 0) {
          this.isSetIngFilter = false;
          this.controlId = null;
          this.control = null;
          this.setUrl(this.sourceUrl + '&ratio=' + this.ratio + '&tilesize=' + this.tilesize + '&clientVersion=' + Version["a" /* default */]);
          return;
        }

        this.gVMapGridUtil.setFilter(filter, function (result) {
          this.isSetIngFilter = false;

          if (result.isIE) {
            this.controlId = result.id;
            this.setUrl(this.sourceUrl + '&ratio=' + this.ratio + '&tilesize=' + this.tilesize + '&clientVersion=' + Version["a" /* default */] + '&controlId=' + result.id);
          } else {
            this.control = result.id;
            this.setUrl(this.sourceUrl + '&ratio=' + this.ratio + '&tilesize=' + this.tilesize + '&clientVersion=' + Version["a" /* default */] + '&control=' + result.id);
          }
        }.bind(this));
      },

      /**
       * 根据屏幕坐标获取拾取到的要素
       * Parameters :
       * x -
       * y -
       * callback - 拾取成功的回调函数
       */
      getFeatureByXY: function getFeatureByXY (x, y, callback) {
        var latLng = this._map.containerPointToLatLng(new external_L_default.a.point(x, y));

        this.getFeatureByLonlat(latLng, callback);
      },

      /**
       * 根据地理坐标获取拾取到的要素
       * Parameters :
       * lonlat - 地理坐标对象
       * callback - 拾取成功的回调函数
       */
      getFeatureByLonlat: function getFeatureByLonlat (latLng, callback) {
        var maxBounds = this._map.options.crs.projection.bounds; //地图当前范围

        var bounds = this._map.getBounds();

        var pBounds = this._map.getPixelBounds(); //地图当前分辨率


        var res = (bounds._northEast.lat - bounds._southWest.lat) / (pBounds.max.y - pBounds.min.y);
        var tileSize = this.options.tileSize;
        var row = (maxBounds.max.y - latLng.lat) / (res * tileSize);
        var col = (latLng.lng - maxBounds.min.x) / (res * tileSize);

        var level = this._map.getZoom();

        var tx = (col - Math.floor(col)) * tileSize;
        var ty = (row - Math.floor(row)) * tileSize;
        this.gVMapGridUtil.pickupFeatures(row, col, level, tx, ty, this.control, this.controlId, function (features) {
          callback(features);
        });
      },

      /**
       * 根据指定的样式高亮要素
       * Parameters :
       * layerFeatures - 要素数组
       * style - 高亮样式 如：{color:"red",opacity:0.8};
       */
      highlightFeatures: function highlightFeatures (layerFeatures, style) {
        //获取高亮的过滤条件
        var filter = this.gVMapGridUtil.CreateHighlightFilter(layerFeatures, style); //如果没有过滤任何要素

        if (filter.layers.length == 0) {
          return;
        } // style.color = style.color.replace('#','%23');


        if (!this.highlightLayer) {
          //构造高亮图层
          var url = this.gVMapGridUtil.host + '/mapserver/vmap/' + this.gVMapGridUtil.servername + '/getMAP?x={x}&y={y}&l={z}' + '&styleId=' + this.gVMapGridUtil.styleId;

          if (this.control) {
            url = url + '&control=' + this.control;
          }

          if (this.controlId) {
            url = url + '&controlId=' + this.controlId;
          }

          this.highlightLayer = new external_L_default.a.GXYZ(url, this.options);

          this._map.addLayer(this.highlightLayer);
        }

        this.highlightLayer.options.opacity = style.opacity;

        this.highlightLayer._updateOpacity(); //设置高亮过滤条件


        this.highlightLayer.setFilter(filter); //获取当前图层的index

        var index = this.options.zIndex; //设置高亮图层在当前底图图层之上

        this.highlightLayer.setZIndex(index + 1);
      },

      /**
       * 根据Filter高亮指定要素
       * Parameters :
       * filter - Filter对象
       */
      highlightByFilter: function highlightByFilter (filter) {
        //如果没有过滤任何要素
        if (filter.layers.length == 0) {
          return;
        } // style.color = style.color.replace('#','%23');


        if (!this.highlightLayer) {
          //构造高亮图层
          var url = this.gVMapGridUtil.host + '/mapserver/vmap/' + this.gVMapGridUtil.servername + '/getMAP?x={x}&y={y}&l={z}' + '&styleId=' + this.gVMapGridUtil.styleId;

          if (this.control) {
            url = url + '&control=' + this.control;
          }

          if (this.controlId) {
            url = url + '&controlId=' + this.controlId;
          }

          this.highlightLayer = new external_L_default.a.GXYZ(url, this.options);

          this._map.addLayer(this.highlightLayer);
        }

        this.highlightLayer.options.opacity = 1;

        this.highlightLayer._updateOpacity(); //设置高亮过滤条件


        this.highlightLayer.setFilter(filter); //获取当前图层的index

        var index = this.options.zIndex; //设置高亮图层在当前底图图层之上

        this.highlightLayer.setZIndex(index + 1);
      },

      /**
       * 取消高亮
       */
      cancelHighlight: function cancelHighlight () {
        if (this.highlightLayer) {
          this._map.removeLayer(this.highlightLayer);

          this.highlightLayer = null;
        }
      }
    });
/* harmony default export */ var vector_GVMapGrid = __webpack_exports__["a"] = (GVMapGrid);

    /***/
  }),
/* 19 */
/***/ (function (module, __webpack_exports__, __webpack_require__) {

    "use strict";
/* WEBPACK VAR INJECTION */(function (Buffer) {
      function _toConsumableArray (arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

      function _nonIterableSpread () { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

      function _unsupportedIterableToArray (o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

      function _iterableToArray (iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

      function _arrayWithoutHoles (arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

      function _arrayLikeToArray (arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

      function _classCallCheck (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

      function _defineProperties (target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

      function _createClass (Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

      /**
       * 编码工具类
       */
      var CodeTool = /*#__PURE__*/function () {
        function CodeTool () {
          _classCallCheck(this, CodeTool);
        }
        /**
         * //生成随机头
         * @returns {[]}
         */


        _createClass(CodeTool, null, [{
          key: "getHeaderArray",
          value: function getHeaderArray (headerLength) {
            var harr = [];

            for (var i = 0; i < headerLength; i++) {
              harr[i] = this._getRandomNum();
            }

            return harr;
          }
          /**
           * 生成随机数头
           * @returns {number}
           * @private
           */

        }, {
          key: "_getRandomNum",
          value: function _getRandomNum () {
            var Range = 80;
            var Rand = Math.random();
            return 50 + Math.round(Rand * Range);
          }
          /**
           * 字符串转byte数组
           * @param str 字符串
           * @param encoding 字符串编码;默认utf8
           * @returns {[]} 字节数组
           */

        }, {
          key: "stringToByte",
          value: function stringToByte (str, encoding) {
            if (encoding === undefined) {
              encoding = "utf8";
            }

            var bytes = [];
            var buffer = Buffer.from(str, encoding);

            for (var i = 0; i < buffer.length; i++) {
              bytes.push(buffer[i]);
            }

            return bytes;
          }
          /**
           * byte数组转字符串
           * @param bytes 字节数组
           * @param encoding 字符串编码;默认utf8
           * @returns {string}
           */

        }, {
          key: "byteToString",
          value: function byteToString (bytes, encoding) {
            if (encoding === undefined) {
              encoding = "utf8";
            }

            return Buffer.from(bytes).toString(encoding);
          }
          /**
           * 数字转byte数组
           * @param num
           * @returns {number[]}
           */

        }, {
          key: "intToBytes",
          value: function intToBytes (num) {
            return [num >> 24 & 0x00ff, num >> 16 & 0x00ff, num >> 8 & 0x00ff, num & 0x00ff];
          }
          /**
           * byte数组转数字
           * @param bytes
           * @returns {number}
           */

        }, {
          key: "bytesToInt",
          value: function bytesToInt (bytes) {
            return bytes[0] << 24 | bytes[1] << 16 | bytes[2] << 8 | bytes[3];
          }
          /**
           * varint转数字
           * @param buffer 单个数字的varint编码
           * @returns {number}
           */

        }, {
          key: "varintToInt",
          value: function varintToInt (buffer) {
            var intBuffer = [];
            var highBuffer = [];
            var j = 3;
            var offset = 0;

            for (var i = buffer.length - 1; i >= 0; i--) {
              if (i - 1 >= 0) {
                highBuffer[0] = buffer[i - 1] << 7 - offset;
              } else {
                highBuffer[0] = 0;
              }

              if (j === -1) {
                break;
              }

              intBuffer[j] = (buffer[i] & 0x7f) >> offset | highBuffer[0];
              j--;
              offset++;
            }

            var t = intBuffer[0] << 24 & 0xff000000 | intBuffer[1] << 16 & 0x00ff0000 | intBuffer[2] << 8 & 0x0000ff00 | intBuffer[3] & 0x000000ff;
            t = t >> 1 ^ -(t & 1);
            return t;
          }
          /**
           * 数字转varint编码
           * @param num
           * @returns {[]|number[]}
           */

        }, {
          key: "intToVarint",
          value: function intToVarint (num) {
            if (num === 0) {
              return [0];
            }

            num = this._zigZagEncoding(num);
            var buffer = [];
            var now;
            var high = 0;

            for (var i = 5; i > 0; i--) {
              now = num >> (i - 1) * 7 & 0x7f;

              if (high !== 0) {
                now = now | 0x80;
              }

              if (now !== 0) {
                buffer.push(now);
              }

              high = now;
            }

            return buffer;
          }
          /**
           * varint编码转数字数组
           * @param buffer
           * @returns {[]}
           */

        }, {
          key: "varintToIntArray",
          value: function varintToIntArray (buffer) {
            var varintCode = [];
            var high;
            var bf_index = 0;
            var nums = [];

            for (var i = 0; i < buffer.length; i++) {
              high = 0x00000000 | buffer[i] >> 7 & 0x01;

              if (high === 0) {
                if (bf_index > 0 && bf_index <= 5) {
                  nums.push(this.varintToInt(varintCode));
                  varintCode = [];
                  bf_index = 0;
                }
              }

              varintCode.push(buffer[i]);
              bf_index++;
            }

            nums.push(this.varintToInt(varintCode));
            return nums;
          }
          /**
           * 数字数组转varint编码buffer
           * @param numArray 数字数组
           * @returns {Buffer} varint编码buffer
           */

        }, {
          key: "intArrayToVarintBuffer",
          value: function intArrayToVarintBuffer (numArray) {
            var bytea = [];
            var numBytes;

            for (var i = 0; i < numArray.length; i++) {
              numBytes = this.intToVarint(numArray[i]);
              bytea.push.apply(bytea, _toConsumableArray(numBytes));
            }

            return Buffer.from(bytea);
          }
          /**
           * 负数转正数编码
           * @param num
           * @returns {number}
           * @private
           */

        }, {
          key: "_zigZagEncoding",
          value: function _zigZagEncoding (num) {
            return num >> 31 ^ num << 1;
          }
        }]);

        return CodeTool;
      }();

/* harmony default export */ __webpack_exports__["a"] = (CodeTool);
      /* WEBPACK VAR INJECTION */
    }.call(this, __webpack_require__(15).Buffer))

    /***/
  }),
/* 20 */
/***/ (function (module, __webpack_exports__, __webpack_require__) {

    "use strict";
    function _classCallCheck (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    function _defineProperties (target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

    function _createClass (Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

    /**
     * Created by kongjian on 2017/5/1.
     */
    var LabelDrawer = /*#__PURE__*/function () {
      function LabelDrawer (layerDataMap, styleMap, level, foreendFont) {
        _classCallCheck(this, LabelDrawer);

        this.layerDataMap = layerDataMap;
        this.level = level;
        this.styleMap = styleMap;
        this.propertyGetterMap = {};
        this.foreendFont = foreendFont;
      }

      _createClass(LabelDrawer, [{
        key: "getLayer",
        value: function getLayer (layername) {
          this.layerDatas = {};
          var data = this.layerDataMap[layername];

          if (data == null || data.features == null) {
            return this;
          }

          this.propertyGetterMap[layername] = this.getProperty(data.fieldsConfig);
          this.layerDatas[layername] = data;
          return this;
        }
      }, {
        key: "getAllLayer",
        value: function getAllLayer () {
          this.layerDatas = this.layerDataMap;

          for (var layername in this.layerDataMap) {
            this.propertyGetterMap[layername] = this.getProperty(this.layerDataMap[layername].fieldsConfig);
          }

          return this;
        }
      }, {
        key: "getGroupLayer",
        value: function getGroupLayer (layername, value) {
          this.layerDatas = {};
          var valueArr = value.split(',');
          var length = valueArr.length;

          if (length == 0) {
            return this;
          }

          var data = this.layerDataMap[layername];

          if (data == null || data.features == null) {
            return this;
          }

          this.propertyGetterMap[layername] = this.getProperty(data.fieldsConfig);
          this.layerDatas[layername] = data;
          return this;
        }
      }, {
        key: "getProperty",
        value: function getProperty (fieldsConfig) {
          var propertyConfig = {};
          var propertyTypes = {};
          var idIndex = 0;

          for (var i = 0; i < fieldsConfig.length; i++) {
            if (fieldsConfig[i].id == 'true' || fieldsConfig[i].id == true) {
              idIndex = fieldsConfig[i].index;
            }

            propertyConfig[fieldsConfig[i].name] = parseInt(fieldsConfig[i].index);
            propertyTypes[fieldsConfig[i].name] = fieldsConfig[i].type;
          }

          return {
            propertyConfig: propertyConfig,
            idIndex: idIndex,
            propertyTypes: propertyTypes
          };
        }
      }, {
        key: "setStyle",
        value: function setStyle (fn) {
          var _this = this;

          var _loop = function _loop (layername) {
            var layerData = _this.layerDatas[layername];
            var propertyGetter = _this.propertyGetterMap[layername];

            var _loop2 = function _loop2 (i) {
              var feature = layerData.features[i];

              var get = function get (key) {
                if (propertyGetter.propertyTypes[key].toLowerCase().indexOf('integer') > -1 || propertyGetter.propertyTypes[key].toLowerCase().indexOf('float') > -1 || propertyGetter.propertyTypes[key].toLowerCase().indexOf('int') > -1 || propertyGetter.propertyTypes[key].toLowerCase().indexOf('double') > -1 || propertyGetter.propertyTypes[key].toLowerCase().indexOf('bigdecimal') > -1) {
                  return Number(feature[1][propertyGetter.propertyConfig[key]]);
                } else if (propertyGetter.propertyTypes[key].toLowerCase().indexOf('timestamp') > -1) {
                  var value = feature[1][propertyGetter.propertyConfig[key]];
                  var numberPat = new RegExp('^\\d{1,13}$');

                  if (numberPat.test(value)) {
                    value = Number(value);
                  } //应该写成与1970年的差别


                  var date = new Date(value);
                  value = date.getTime();
                  return value;
                }

                return feature[1][propertyGetter.propertyConfig[key]];
              };

              var style = fn.call({}, _this.level, get);

              if (style && style.show == true) {
                if (!_this.styleMap[style._id]) {
                  _this.styleMap[style._id] = style;
                }

                feature.avoidWeight = _this.getWeight(style, feature, propertyGetter, 'avoidWeight', 'avoidField');

                if (feature[1].length > Object.keys(propertyGetter.propertyConfig).length) {
                  feature._sort = Number(feature[1][feature[1].length - 1]);
                }

                if (_this.foreendFont) {
                  if (style["lineStrokeFont"]) {
                    fontStr = style["lineStrokeFont"];

                    if (fontStr.indexOf(",") > -1) {
                      style["lineStrokeFont"] = fontStr.split(",")[0] + "," + _this.foreendFont;
                    } else {
                      style["lineStrokeFont"] = fontStr + "," + _this.foreendFont;
                    }
                  }

                  if (style["codeLineFillFont"]) {
                    fontStr = style["codeLineFillFont"];

                    if (fontStr.indexOf(",") > -1) {
                      style["codeLineFillFont"] = fontStr.split(",")[0] + "," + _this.foreendFont;
                    } else {
                      style["codeLineFillFont"] = fontStr + "," + _this.foreendFont;
                    }
                  }

                  if (style["lineFillFont"]) {
                    fontStr = style["lineFillFont"];

                    if (fontStr.indexOf(",") > -1) {
                      style["lineFillFont"] = fontStr.split(",")[0] + "," + _this.foreendFont;
                    } else {
                      style["lineFillFont"] = fontStr + "," + _this.foreendFont;
                    }
                  }

                  if (style["pointFillFont"]) {
                    fontStr = style["pointFillFont"];

                    if (fontStr.indexOf(",") > -1) {
                      style["pointFillFont"] = fontStr.split(",")[0] + "," + _this.foreendFont;
                    } else {
                      style["pointFillFont"] = fontStr + "," + _this.foreendFont;
                    }
                  }

                  if (style["pointStrokeFont"]) {
                    fontStr = style["pointStrokeFont"];

                    if (fontStr.indexOf(",") > -1) {
                      style["pointStrokeFont"] = fontStr.split(",")[0] + "," + _this.foreendFont;
                    } else {
                      style["pointStrokeFont"] = fontStr + "," + _this.foreendFont;
                    }
                  }
                }

                if (feature[0] != 'POINT') {
                  if (style.hasOwnProperty('codeAvoidWeight') && style.hasOwnProperty('codeAvoidField')) {
                    feature.codeAvoidWeight = _this.getWeight(style, feature, propertyGetter, 'codeAvoidWeight', 'codeAvoidField');
                    feature.codeAvoidWeight = feature.codeAvoidWeight == feature.avoidWeight ? feature.avoidWeight + 1 : feature.codeAvoidWeight;
                  } else {
                    feature.codeAvoidWeight = feature.avoidWeight + 1;
                  }

                  if (style.hasOwnProperty('arrowAvoidWeight') && style.hasOwnProperty('arrowAvoidField')) {
                    feature.arrowAvoidWeight = _this.getWeight(style, feature, propertyGetter, 'arrowAvoidWeight', 'arrowAvoidField');
                    feature.arrowAvoidWeight = feature.arrowAvoidWeight == feature.avoidWeight ? feature.avoidWeight - 1 : feature.arrowAvoidWeight;
                    feature.arrowAvoidWeight = feature.arrowAvoidWeight == feature.codeAvoidWeight ? feature.codeAvoidWeight - 1 : feature.arrowAvoidWeight;
                  } else {
                    feature.arrowAvoidWeight = feature.avoidWeight - 1;
                  }

                  if (feature.codeAvoidWeight == feature.arrowAvoidWeight) {
                    feature.arrowAvoidWeight = feature.codeAvoidWeight - 1;
                  }
                }

                feature.styleId = style._id;
              }
            };

            for (var i = 0; i < layerData.features.length; i++) {
              _loop2(i);
            }
          };

          for (var layername in this.layerDatas) {
            var fontStr;
            var fontStr;
            var fontStr;
            var fontStr;
            var fontStr;

            _loop(layername);
          }
        }
      }, {
        key: "setGlobalStyle",
        value: function setGlobalStyle (fn) {
          this.globalStyle = fn.call({});
        }
      }, {
        key: "getWeight",
        value: function getWeight (style, feature, propertyGetter, weightValueStyle, weightField) {
          var weight = feature[1][propertyGetter.propertyConfig[style[weightField]]];

          if (weight) {
            weight = parseInt(weight);

            if (isNaN(weight)) {
              weight = 0;
            }
          } else {
            weight = 0;
          }

          if (weight == 0) {
            if (style[weightValueStyle]) {
              return style[weightValueStyle];
            }
          }

          return weight;
        }
      }, {
        key: "draw",
        value: function draw () { }
      }]);

      return LabelDrawer;
    }();

/* harmony default export */ __webpack_exports__["a"] = (LabelDrawer);

    /***/
  }),
/* 21 */
/***/ (function (module, exports, __webpack_require__) {

    "use strict";
/* WEBPACK VAR INJECTION */(function (process, Buffer) {// The MIT License (MIT)
      //
      // Copyright (c) 2016 Zhipeng Jia
      //
      // Permission is hereby granted, free of charge, to any person obtaining a copy
      // of this software and associated documentation files (the "Software"), to deal
      // in the Software without restriction, including without limitation the rights
      // to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
      // copies of the Software, and to permit persons to whom the Software is
      // furnished to do so, subject to the following conditions:
      //
      // The above copyright notice and this permission notice shall be included in all
      // copies or substantial portions of the Software.
      //
      // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
      // IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
      // FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
      // AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
      // LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
      // OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
      // SOFTWARE.


      function _typeof (obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof (obj) { return typeof obj; }; } else { _typeof = function _typeof (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

      function isNode () {
        if ((typeof process === "undefined" ? "undefined" : _typeof(process)) === 'object') {
          if (_typeof(process.versions) === 'object') {
            if (typeof process.versions.node !== 'undefined') {
              return true;
            }
          }
        }

        return false;
      }

      function isUint8Array (object) {
        return object instanceof Uint8Array && (!isNode() || !Buffer.isBuffer(object));
      }

      function isArrayBuffer (object) {
        return object instanceof ArrayBuffer;
      }

      function isBuffer (object) {
        if (!isNode()) {
          return false;
        }

        return Buffer.isBuffer(object);
      }

      var SnappyDecompressor = __webpack_require__(46).SnappyDecompressor;

      var SnappyCompressor = __webpack_require__(47).SnappyCompressor;

      var TYPE_ERROR_MSG = 'Argument compressed must be type of ArrayBuffer, Buffer, or Uint8Array';

      function uncompress (compressed) {
        if (!isUint8Array(compressed) && !isArrayBuffer(compressed) && !isBuffer(compressed)) {
          throw new TypeError(TYPE_ERROR_MSG);
        }

        var uint8Mode = false;
        var arrayBufferMode = false;

        if (isUint8Array(compressed)) {
          uint8Mode = true;
        } else if (isArrayBuffer(compressed)) {
          arrayBufferMode = true;
          compressed = new Uint8Array(compressed);
        }

        var decompressor = new SnappyDecompressor(compressed);
        var length = decompressor.readUncompressedLength();

        if (length === -1) {
          throw new Error('Invalid Snappy bitstream');
        }

        var uncompressed, uncompressedView;

        if (uint8Mode) {
          uncompressed = new Uint8Array(length);

          if (!decompressor.uncompressToBuffer(uncompressed)) {
            throw new Error('Invalid Snappy bitstream');
          }
        } else if (arrayBufferMode) {
          uncompressed = new ArrayBuffer(length);
          uncompressedView = new Uint8Array(uncompressed);

          if (!decompressor.uncompressToBuffer(uncompressedView)) {
            throw new Error('Invalid Snappy bitstream');
          }
        } else {
          uncompressed = Buffer.alloc(length);

          if (!decompressor.uncompressToBuffer(uncompressed)) {
            throw new Error('Invalid Snappy bitstream');
          }
        }

        return uncompressed;
      }

      function compress (uncompressed) {
        if (!isUint8Array(uncompressed) && !isArrayBuffer(uncompressed) && !isBuffer(uncompressed)) {
          throw new TypeError(TYPE_ERROR_MSG);
        }

        var uint8Mode = false;
        var arrayBufferMode = false;

        if (isUint8Array(uncompressed)) {
          uint8Mode = true;
        } else if (isArrayBuffer(uncompressed)) {
          arrayBufferMode = true;
          uncompressed = new Uint8Array(uncompressed);
        }

        var compressor = new SnappyCompressor(uncompressed);
        var maxLength = compressor.maxCompressedLength();
        var compressed, compressedView;
        var length;

        if (uint8Mode) {
          compressed = new Uint8Array(maxLength);
          length = compressor.compressToBuffer(compressed);
        } else if (arrayBufferMode) {
          compressed = new ArrayBuffer(maxLength);
          compressedView = new Uint8Array(compressed);
          length = compressor.compressToBuffer(compressedView);
        } else {
          compressed = Buffer.alloc(maxLength);
          length = compressor.compressToBuffer(compressed);
        }

        return compressed.slice(0, length);
      }

      exports.uncompress = uncompress;
      exports.compress = compress;
      /* WEBPACK VAR INJECTION */
    }.call(this, __webpack_require__(45), __webpack_require__(15).Buffer))

    /***/
  }),
/* 22 */
/***/ (function (module, __webpack_exports__, __webpack_require__) {

    "use strict";

    // CONCATENATED MODULE: ./src/layer/label/avoid/GGridIndex.js
    var NUM_PARAMS = 3;

    function GGridIndex (extent, n, padding) {
      var cells = this.cells = [];

      if (extent instanceof ArrayBuffer) {
        this.arrayBuffer = extent;
        var array = new Int32Array(this.arrayBuffer);
        extent = array[0];
        n = array[1];
        padding = array[2];
        this.d = n + 2 * padding;

        for (var k = 0; k < this.d * this.d; k++) {
          var start = array[NUM_PARAMS + k];
          var end = array[NUM_PARAMS + k + 1];
          cells.push(start === end ? null : array.subarray(start, end));
        }

        var keysOffset = array[NUM_PARAMS + cells.length];
        var bboxesOffset = array[NUM_PARAMS + cells.length + 1];
        this.keys = array.subarray(keysOffset, bboxesOffset);
        this.bboxes = array.subarray(bboxesOffset);
        this.insert = this._insertReadonly;
      } else {
        this.d = n + 2 * padding;

        for (var i = 0; i < this.d * this.d; i++) {
          cells.push([]);
        }

        this.keys = [];
        this.bboxes = [];
      }

      this.n = n;
      this.extent = extent;
      this.padding = padding;
      this.scale = n / extent;
      this.uid = 0;
      var p = padding / n * extent;
      this.min = -p;
      this.max = extent + p;
    }

    GGridIndex.prototype.insert = function (key, x1, y1, x2, y2) {
      this._forEachCell(x1, y1, x2, y2, this._insertCell, this.uid++);

      this.keys.push(key);
      this.bboxes.push(x1);
      this.bboxes.push(y1);
      this.bboxes.push(x2);
      this.bboxes.push(y2);
    };

    GGridIndex.prototype._insertReadonly = function () {
      throw 'Cannot insert into a GridIndex created from an ArrayBuffer.';
    };

    GGridIndex.prototype._insertCell = function (x1, y1, x2, y2, cellIndex, uid) {
      this.cells[cellIndex].push(uid);
    };

    GGridIndex.prototype.query = function (x1, y1, x2, y2) {
      var min = this.min;
      var max = this.max;

      if (x1 <= min && y1 <= min && max <= x2 && max <= y2) {
        // We use `Array#slice` because `this.keys` may be a `Int32Array` and
        // some browsers (Safari and IE) do not support `TypedArray#slice`
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/slice#Browser_compatibility
        return Array.prototype.slice.call(this.keys);
      } else {
        var result = [];
        var seenUids = {};

        this._forEachCell(x1, y1, x2, y2, this._queryCell, result, seenUids);

        return result;
      }
    };

    GGridIndex.prototype._queryCell = function (x1, y1, x2, y2, cellIndex, result, seenUids) {
      var cell = this.cells[cellIndex];

      if (cell !== null) {
        var keys = this.keys;
        var bboxes = this.bboxes;

        for (var u = 0; u < cell.length; u++) {
          var uid = cell[u];

          if (seenUids[uid] === undefined) {
            var offset = uid * 4;

            if (x1 <= bboxes[offset + 2] && y1 <= bboxes[offset + 3] && x2 >= bboxes[offset + 0] && y2 >= bboxes[offset + 1]) {
              seenUids[uid] = true;
              result.push(keys[uid]);
            } else {
              seenUids[uid] = false;
            }
          }
        }
      }
    };

    GGridIndex.prototype._forEachCell = function (x1, y1, x2, y2, fn, arg1, arg2) {
      var cx1 = this._convertToCellCoord(x1);

      var cy1 = this._convertToCellCoord(y1);

      var cx2 = this._convertToCellCoord(x2);

      var cy2 = this._convertToCellCoord(y2);

      for (var x = cx1; x <= cx2; x++) {
        for (var y = cy1; y <= cy2; y++) {
          var cellIndex = this.d * y + x;
          if (fn.call(this, x1, y1, x2, y2, cellIndex, arg1, arg2)) return;
        }
      }
    };

    GGridIndex.prototype._convertToCellCoord = function (x) {
      return Math.max(0, Math.min(this.d - 1, Math.floor(x * this.scale) + this.padding));
    };

    GGridIndex.prototype.toArrayBuffer = function () {
      if (this.arrayBuffer) return this.arrayBuffer;
      var cells = this.cells;
      var metadataLength = NUM_PARAMS + this.cells.length + 1 + 1;
      var totalCellLength = 0;

      for (var i = 0; i < this.cells.length; i++) {
        totalCellLength += this.cells[i].length;
      }

      var array = new Int32Array(metadataLength + totalCellLength + this.keys.length + this.bboxes.length);
      array[0] = this.extent;
      array[1] = this.n;
      array[2] = this.padding;
      var offset = metadataLength;

      for (var k = 0; k < cells.length; k++) {
        var cell = cells[k];
        array[NUM_PARAMS + k] = offset;
        array.set(cell, offset);
        offset += cell.length;
      }

      array[NUM_PARAMS + cells.length] = offset;
      array.set(this.keys, offset);
      offset += this.keys.length;
      array[NUM_PARAMS + cells.length + 1] = offset;
      array.set(this.bboxes, offset);
      offset += this.bboxes.length;
      return array.buffer;
    };

/* harmony default export */ var avoid_GGridIndex = (GGridIndex);
    // EXTERNAL MODULE: ./src/layer/label/avoid/AvoidUtil.js
    var AvoidUtil = __webpack_require__(3);

    // EXTERNAL MODULE: ./src/layer/label/avoid/Util.js
    var Util = __webpack_require__(4);

    // CONCATENATED MODULE: ./src/layer/label/avoid/GLabelBox.js
    function _classCallCheck (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    function _defineProperties (target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

    function _createClass (Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

    /**
     * Class: GLabelBox
     *  计算注记避让box类
     *
     * Inherits:
     *  - <Object>
     */



    var GLabelBox_GLabelBox = /*#__PURE__*/function () {
      function GLabelBox (ctx, formatFont) {
        _classCallCheck(this, GLabelBox);

        this.boxDistance = 0;
        this.ctx = ctx;
        this.formatFont = formatFont;
      }

      _createClass(GLabelBox, [{
        key: "setBox",
        value: function setBox (features, styleMap, isClient) {
          features.forEach(function (f, index) {
            f.hidden = false;
            var style = styleMap[f.styleId] ? styleMap[f.styleId] : f.style; //如果要素不显示,没字就不画

            if (style.show == false) {
              f.hidden = true;
              return;
            }

            if (f.type == 1) {
              //构造点盒子
              if (isClient) {
                this.setPointBox(f, f.datas, this.ctx, style);
              } else {
                this.setPointBox(f, f.sourceAngleData, this.ctx, style);
              }
            }

            if (f.type == 2) {
              //如果是线文本注记             
              if (f.lineType == 'text') {
                if (isClient) {
                  this.setTextLineBox(f, f.datas, this.ctx, style);
                } else {
                  this.setTextLineBox(f, f.sourceAngleData, this.ctx, style);
                }
              } //如果是线编码注记


              if (f.lineType == 'code') {
                if (isClient) {
                  this.setCodeLineBox(f, f.datas, this.ctx, style);
                } else {
                  this.setCodeLineBox(f, f.sourceAngleData, this.ctx, style);
                }
              } //如果是线箭头注记


              if (f.lineType == 'arrow') {
                if (isClient) {
                  this.setArrowLineBox(f, f.datas, style);
                } else {
                  this.setArrowLineBox(f, f.sourceAngleData, style);
                }
              }
            }
          }.bind(this));
          return this.filterFeature(features);
        } //构造点注记的boxs,上下左右四个方向

      }, {
        key: "setPointBox",
        value: function setPointBox (feature, datas, ctx, style) {
          //对要显示的点注记内容按照用户的转换函数进行转换
          if (style.labelFunction) {
            var labelFunction = new Function("label", style.labelFunction);

            try {
              feature.label = labelFunction.call({}, feature.attributes[style.labelfield]);
            } catch (e) {
              console.warn(feature.label + ': 调用labelFunction失败!');
            }
          }

          var labelIsNotNull = AvoidUtil["a" /* default */].isNotNull(feature.label); //如既没有文字，又没有图标,则不显示

          if (!labelIsNotNull && !feature.iconImg) {
            feature.hidden = true;
            return;
          }

          var param = this.getFontWidthHeight(ctx, feature, style, labelIsNotNull);
          var graphicWidth = param.graphicWidth;
          var graphicHeight = param.graphicHeight;
          var fontWidth = param.fontWidth;
          var fontHeight = param.fontHeight;
          var maxFontheight = param.maxFontheight;
          var pointOffsetX = style.pointOffsetX;
          var pointOffsetY = style.pointOffsetY;

          if (!pointOffsetX) {
            pointOffsetX = 0;
          }

          if (!pointOffsetY) {
            pointOffsetY = 0;
          }

          var pt = [datas[0][0][0], datas[0][0][1]];
          pt[0] = pt[0] + pointOffsetX;
          pt[1] = pt[1] + pointOffsetY;
          var pointBackgroundGap = style.pointBackgroundGap;

          if (style.pointHashBackground != true) {
            pointBackgroundGap = 0;
          }

          var graphicDistance = style.graphicDistance;

          if (graphicHeight == 0 || graphicWidth == 0) {
            graphicDistance = 0;
          }

          if (!style.hasOwnProperty('direction')) {
            style.direction = 0;
          }

          var boxs = [];
          var fourPoints = []; //如果有图标

          if (style.texture && feature.iconImg) {
            var graphicYOffset = style.graphicYOffset;
            var graphicXOffset = style.graphicXOffset;

            if (!graphicXOffset) {
              graphicXOffset = 0;
            }

            if (!graphicYOffset) {
              graphicYOffset = 0;
            }

            pt[0] = pt[0] + graphicXOffset;
            pt[1] = pt[1] + graphicYOffset; //如果有文字;

            if (feature.label) {
              boxs = this.getPointAvoidBox(pt, style, graphicDistance, pointBackgroundGap, graphicWidth, graphicHeight, fontWidth, maxFontheight);
              fourPoints = this.getPointDrawPosition(pt, style, graphicDistance, pointBackgroundGap, graphicWidth, graphicHeight, fontWidth, fontHeight, maxFontheight);
            } else {
              //只有图标，没有文字
              var middleBox = [pt[0] - graphicWidth * 0.5, pt[1] - fontHeight * 0.5, pt[0] + graphicWidth * 0.5, pt[1] + fontHeight * 0.5];
              middleBox = this.boxScale(middleBox, style.pointBoxDisance);
              boxs = [middleBox];
              fourPoints = [[pt[0], pt[1]]];
            }
          } else {
            var _middleBox = [pt[0] - fontWidth * 0.5 - pointBackgroundGap, pt[1] - pointBackgroundGap - maxFontheight * 0.5, pt[0] + fontWidth * 0.5 + pointBackgroundGap, pt[1] + pointBackgroundGap + maxFontheight * 0.5];
            _middleBox = this.boxScale(_middleBox, style.pointBoxDisance);
            boxs = [_middleBox];
            var mPoint = [pt[0] - fontWidth * 0.5, pt[1] - fontHeight * 0.5 + style.pointHeight * 0.5];
            fourPoints = [mPoint];
          }

          feature.boxs = boxs;
          feature.box = boxs[0]; // feature.direction = 0;

          feature.fourPoints = fourPoints;
          feature.textPoint = fourPoints[0];
        }
        /**
         *  获取点注记的图标宽高，和注记的宽高和注记的最大高度
         * @param ctx
         * @param feature
         * @param style
         * @param labelIsNotNull
         * @returns {{}}
         */

      }, {
        key: "getFontWidthHeight",
        value: function getFontWidthHeight (ctx, feature, style, labelIsNotNull) {
          var currPara = {};
          var graphicWidth = style.graphicWidth;
          var graphicHeight = style.graphicHeight;
          var img = feature.iconImg;

          if (img) {
            //如果没有
            if (!graphicWidth || !graphicHeight) {
              graphicWidth = img.width;
              graphicHeight = img.height;
            }
          } else {
            graphicWidth = 0;
            graphicHeight = 0;
          }

          currPara.graphicWidth = graphicWidth;
          currPara.graphicHeight = graphicHeight;
          currPara.fontWidth = graphicWidth;
          currPara.fontHeight = graphicHeight;

          if (labelIsNotNull) {
            //转换为字符串
            feature.label = feature.label + '';
            var tmpLabels = feature.label.split(' ');
            var tmpLabelWidth = 0;
            ctx.save();
            ctx.font = AvoidUtil["a" /* default */].formatFont(style.pointStrokeFont, 1, this.formatFont);

            for (var i = 0; i < tmpLabels.length; i++) {
              var oneRowLabelWidth = Util["a" /* default */].measureText(tmpLabels[i].replace(/&nbsp;/g, " "), ctx.font, ctx);
              tmpLabelWidth = oneRowLabelWidth > tmpLabelWidth ? oneRowLabelWidth : tmpLabelWidth;
            }

            ctx.restore(); //各行的最宽宽度

            currPara.fontWidth = tmpLabelWidth; //文字的高度 * 文字的行数+  行间距

            currPara.fontHeight = style.pointHeight * tmpLabels.length + 2 * (tmpLabels.length - 1); // 如果点符号高度（用点符号宽度代替）高于文字高度 则用点符号高度替换文字高度

            currPara.maxFontheight = currPara.fontHeight > graphicHeight ? currPara.fontHeight : graphicHeight;
          }

          return currPara;
        }
        /**
         *  获取点注记有图标也有文字时的避让boxs
         * @param pt
         * @param style
         * @param graphicDistance
         * @param pointBackgroundGap
         * @param graphicWidth
         * @param graphicHeight
         * @param fontWidth
         * @param maxFontheight
         * @returns {[*,*,*,*]}
         */

      }, {
        key: "getPointAvoidBox",
        value: function getPointAvoidBox (pt, style, pointBackgroundGap, graphicDistance, graphicWidth, graphicHeight, fontWidth, maxFontheight) {
          var rightBox = [pt[0] - graphicWidth * 0.5, pt[1] - pointBackgroundGap - maxFontheight * 0.5, pt[0] + graphicWidth * 0.5 + graphicDistance + fontWidth + pointBackgroundGap * 2, pt[1] + maxFontheight * 0.5 + pointBackgroundGap];
          var leftBox = [pt[0] - graphicWidth * 0.5 - graphicDistance - fontWidth - pointBackgroundGap * 2, rightBox[1], pt[0] + graphicWidth * 0.5, rightBox[3]];
          var bottomBox = [pt[0] - fontWidth * 0.5 - pointBackgroundGap, pt[1] - graphicHeight * 0.5, pt[0] + fontWidth * 0.5 + pointBackgroundGap, pt[1] + graphicHeight * 0.5 + graphicDistance + pointBackgroundGap * 2 + maxFontheight];
          var topBox = [bottomBox[0], pt[1] - graphicDistance - pointBackgroundGap * 2 - maxFontheight - graphicHeight * 0.5, bottomBox[2], pt[1] + graphicHeight * 0.5];
          rightBox = this.boxScale(rightBox, style.pointBoxDisance);
          leftBox = this.boxScale(leftBox, style.pointBoxDisance);
          bottomBox = this.boxScale(bottomBox, style.pointBoxDisance);
          topBox = this.boxScale(topBox, style.pointBoxDisance);
          var boxs = [rightBox, leftBox, bottomBox, topBox];

          if (!style.isFourDirections && !style.isEightDirections) {
            return [boxs[style.direction]];
          }

          if (style.isFourDirections) {
            if (style.direction > 0) {
              var item = boxs.splice(style.direction, 1);
              boxs.unshift(item[0]);
            }

            return boxs;
          }

          var rightTopBox = [rightBox[0], topBox[1], rightBox[2], pt[1] + graphicHeight * 0.5];
          var rightBottomBox = [rightBox[0], pt[1] - graphicHeight * 0.5, rightBox[2], bottomBox[3]];
          var leftTopBox = [leftBox[0], topBox[1], leftBox[2], pt[1] + graphicHeight * 0.5];
          var leftBottomBox = [leftBox[0], pt[1] - graphicHeight * 0.5, leftBox[2], bottomBox[3]];
          boxs = [rightBox, leftBox, bottomBox, topBox, rightTopBox, rightBottomBox, leftTopBox, leftBottomBox];

          if (style.direction > 0) {
            var _item = boxs.splice(style.direction, 1);

            boxs.unshift(_item[0]);
          }

          return boxs;
        }
      }, {
        key: "getPointDrawPosition",
        value: function getPointDrawPosition (pt, style, graphicDistance, pointBackgroundGap, graphicWidth, graphicHeight, fontWidth, fontHeight, maxFontheight) {
          //单行最大高度
          var pointHeight = style.pointHeight;

          if (graphicHeight > pointHeight) {
            pointHeight = graphicHeight;
          } //不包括点图标,用于文字绘制的起点坐标


          var rPoint = [pt[0] + graphicWidth * 0.5 + graphicDistance + pointBackgroundGap, pt[1] - fontHeight * 0.5 + pointHeight * 0.5];
          var lPoint = [pt[0] - graphicWidth * 0.5 - graphicDistance - pointBackgroundGap - fontWidth, pt[1] - fontHeight * 0.5 + pointHeight * 0.5];
          var bPoint = [pt[0] - fontWidth * 0.5, pt[1] + graphicDistance + pointBackgroundGap + pointHeight * 0.5 + graphicHeight * 0.5];
          var tPoint = [bPoint[0], pt[1] - graphicDistance - pointBackgroundGap - fontHeight + pointHeight * 0.5 - graphicHeight * 0.5];
          var drawPositions = [rPoint, lPoint, bPoint, tPoint];

          if (!style.isFourDirections && !style.isEightDirections) {
            return [drawPositions[style.direction]];
          }

          if (style.isFourDirections) {
            if (style.direction > 0) {
              var item = drawPositions.splice(style.direction, 1);
              drawPositions.unshift(item[0]);
            }

            return drawPositions;
          }

          var rtPoint = [rPoint[0], tPoint[1]];
          var rbPoint = [rPoint[0], bPoint[1]];
          var ltPoint = [lPoint[0], tPoint[1]];
          var lbPoint = [lPoint[0], bPoint[1]];
          drawPositions = [rPoint, lPoint, bPoint, tPoint, rtPoint, rbPoint, ltPoint, lbPoint];

          if (style.direction > 0) {
            var _item2 = drawPositions.splice(style.direction, 1);

            drawPositions.unshift(_item2[0]);
          }

          return drawPositions;
        }
        /**
         * 设置线文字的box
         *  Parameters :
         *  feature - 单个线注记要素
         */

      }, {
        key: "setTextLineBox",
        value: function setTextLineBox (feature, datas, ctx, style) {
          var label = feature.label;
          var textPoints = datas;

          if (textPoints.length == 0) {
            feature.hidden = true;
            return;
          } //将分段的点数据和角度数据保留，留给后面绘制


          feature.textPoints = textPoints; //线的boxs

          var lineBoxs = []; //如果线注记带底色

          if (style.lineHashBackground == true || textPoints.length == 1) {
            var p = textPoints[0][0];

            if (textPoints.length > 1) {
              //获取线段的中间点
              var index = Math.floor(label.length / 2);
              p = textPoints[index][0];
            }

            ctx.save();

            if (this.formatFont) {
              ctx.font = Util["a" /* default */].formatFont(style.lineFillFont, 1, true);
            } else {
              ctx.font = style.lineFillFont;
            }

            var w = Util["a" /* default */].measureText(feature.label, ctx.font, ctx);
            ctx.restore();

            if (!style.lineBackgroundGap) {
              style.lineBackgroundGap = 0;
            }

            var minX = p[0] - w / 2 - style.lineBackgroundGap;
            var maxX = p[0] + w / 2 + style.lineBackgroundGap;
            var minY = p[1] - style.lineHeight * 0.5 - style.lineBackgroundGap;
            var maxY = p[1] + style.lineHeight * 0.5 + style.lineBackgroundGap;
            var box = [minX, minY, maxX, maxY];
            this.boxScale(box, style.lineTextBoxDisance);
            lineBoxs.push(box);
          } else {
            //如果文字需要旋转
            if (style.lineTextRotate || style.lineTextRotate == 0) {
              for (var m = 0; m < textPoints.length; m++) {
                textPoints[m][1] = style.lineTextRotate;
              }
            } else {
              //如果文字注记旋转角度方向不一致(有的字向左，有的字向右旋转)，则调整为一致
              this.textToSameBearing(feature.angle, textPoints);

              if (!style.isImportant) {
                //判断线文字之间的最大夹角是否大于指定的阈值
                if (this.isMessy(feature, textPoints, style, label)) {
                  feature.hidden = true;
                  return;
                }
              }
            } //获取每个字的box,判断每个字之前是否有压盖


            var boxs = this.getLineBoxs(label, textPoints, style);

            if (boxs) {
              lineBoxs = lineBoxs.concat(boxs);
            } else {
              feature.hidden = true;
              return;
            }
          }

          feature.boxs = lineBoxs;
        }
        /**
         * 设置线编码的box
         *  Parameters :
         *  feature - 单个线注记要素
         */

      }, {
        key: "setCodeLineBox",
        value: function setCodeLineBox (feature, datas, ctx, style) {
          var codePoints = datas;

          if (codePoints.length == 0) {
            feature.hidden = true;
            return;
          } //如果要显示道路编号


          var p = codePoints[0][0];
          ctx.save();

          if (this.formatFont) {
            ctx.font = Util["a" /* default */].formatFont(style.codeLineFillFont, 1, true);
          } else {
            ctx.font = style.codeLineFillFont;
          }

          var w = Util["a" /* default */].measureText(feature.label, ctx.font, ctx);
          ctx.restore();
          var minX = p[0] - w / 2 - style.codeLineBackgroundGap;
          var maxX = p[0] + w / 2 + style.codeLineBackgroundGap;
          var minY = p[1] - style.codeLineHeight * 0.5 - style.codeLineBackgroundGap;
          var maxY = p[1] + style.codeLineHeight * 0.5 + style.codeLineBackgroundGap;
          var box = [minX, minY, maxX, maxY];
          this.boxScale(box, style.lineCodeBoxDisance);
          feature.boxs = [box];
          feature.codePoint = p;
        }
        /**
         * 设置线箭头的box
         *  Parameters :
         *  feature - 单个线注记要素
         */

      }, {
        key: "setArrowLineBox",
        value: function setArrowLineBox (feature, datas, style) {
          var arrowPoints = datas;

          if (arrowPoints.length != 3) {
            feature.hiden = true;
            return;
          }

          var p = arrowPoints[0][0];
          var p1 = arrowPoints[2][0];
          var minX = p[0] < p1[0] ? p[0] : p1[0];
          var maxX = p[0] > p1[0] ? p[0] : p1[0];
          var minY = p[1] < p1[1] ? p[1] : p1[1];
          var maxY = p[1] > p1[1] ? p[1] : p1[1];
          var box = [minX, minY, maxX, maxY];
          this.boxScale(box, style.lineArrowBoxDisance);
          feature.boxs = [box];
          feature.arrowPoint = arrowPoints;
        } // 获取过滤后的要素.

      }, {
        key: "filterFeature",
        value: function filterFeature (features) {
          var returnFeatures = []; //剔除需避让的要素

          for (var i = 0; i < features.length; i++) {
            if (!features[i].hidden) {
              returnFeatures.push(features[i]);
            }
          }

          return returnFeatures;
        }
        /**
         * 判断线文字之间的最大夹角是否大于指定的阈值
         *  Parameters :
         * textPoints - 文本注记的线段数组
         *  style -要素的样式
         */

      }, {
        key: "isMessy",
        value: function isMessy (feature, textPoints, style, label) {
          var firstPoint = textPoints[0][0];
          var minX = firstPoint[0];
          var minY = firstPoint[1];
          var maxX = firstPoint[0];
          var maxY = firstPoint[1];
          var minAngle = textPoints[0][1];
          var maxAngle = textPoints[0][1];

          for (var i = 0; i < label.length; i++) {
            var currPoint = textPoints[i][0];
            var currAngle = textPoints[i][1];
            if (currPoint[0] > maxX) // 判断最大值
              maxX = currPoint[0];
            if (currPoint[0] < minX) // 判断最小值
              minX = currPoint[0];
            if (currPoint[1] > maxY) // 判断最大值
              maxY = currPoint[1];
            if (currPoint[1] < minY) // 判断最小值
              minY = currPoint[1];
            if (currAngle > maxAngle) // 判断最大值
              maxAngle = currAngle;
            if (currAngle < minAngle) // 判断最小值
              minAngle = currAngle;
          } //如果文字之间，相差的最大角度大于配置的角度度则不画


          if (maxAngle - minAngle > style.angle) {
            if (style.angleSwitch == false && style.angleColor) {
              feature.lineFillStyle = style.angleColor;
            } else {
              return true;
            }
          }

          return false;
        }
        /**
         * 检测线文字之间是否有自压盖
         *  Parameters :
         * boxs -
         *  style -要素的样式
         */

      }, {
        key: "getLineBoxs",
        value: function getLineBoxs (label, textPoints, style) {
          //和其它注记避让的boxs
          var boxs = []; //自相交避让的boxs

          var owmCrashBoxs = [];

          for (var i = 0; i < label.length; i++) {
            var pt = textPoints[i][0]; //解决旋转后的注记和不旋转的注记样式不一致的问题

            if (textPoints[i][1] == 0) {
              textPoints[i][1] = 0.5;
            } //考虑到线文字注记有角度偏转，box统一增加1.2倍


            var labelBox = [pt[0] - style.lineHeight * 1.2 * 0.5, pt[1] - style.lineHeight * 1.2 * 0.5, pt[0] + style.lineHeight * 1.2 * 0.5, pt[1] + style.lineHeight * 1.2 * 0.5];
            this.boxScale(labelBox, style.lineTextBoxDisance);
            var owmCrashBox = [pt[0] - style.lineHeight * 0.5, pt[1] - style.lineHeight * 1.2 * 0.5, pt[0] + style.lineHeight * 0.5, pt[1] + style.lineHeight * 0.5];
            owmCrashBoxs.push(owmCrashBox);
            boxs.push(labelBox);
          }

          if (!style.isImportant) {
            for (var j = 0; j < owmCrashBoxs.length - 1; j++) {
              var box1 = owmCrashBoxs[j];

              for (var k = j + 1; k < owmCrashBoxs.length; k++) {
                var box2 = owmCrashBoxs[k];

                if (this.crashBox(box1, box2)) {
                  return null;
                }
              }
            }
          }

          return boxs;
        }
      }, {
        key: "boxScale",
        value: function boxScale (box, pointBoxDisance) {
          if (!pointBoxDisance && pointBoxDisance != 0) {
            pointBoxDisance = this.boxDistance;
          }

          box[0] = box[0] - pointBoxDisance * 0.5;
          box[1] = box[1] - pointBoxDisance * 0.5;
          box[2] = box[2] + pointBoxDisance * 0.5;
          box[3] = box[3] + pointBoxDisance * 0.5;
          return box;
        } // 两个盒子是否相交.

      }, {
        key: "crashBox",
        value: function crashBox (ibox, jbox) {
          return ibox[0] <= jbox[2] && ibox[2] >= jbox[0] && ibox[1] <= jbox[3] && ibox[3] >= jbox[1];
        }
        /**
         * 如果文字注记旋转角度方向不一致(有的字向左，有的字向右旋转)，则调整为一致
         * @param textPoints
         */

      }, {
        key: "textToSameBearing",
        value: function textToSameBearing (angle, textPoints) {
          //保证竖方向的字是正的
          if (angle >= 45) {
            angle = angle - 90;
          } else {
            if (angle <= -45) {
              angle = angle + 90;
            }
          }

          for (var i = 0; i < textPoints.length; i++) {
            var p = textPoints[i][1];
            var offsetAngle = angle - p;

            if (offsetAngle > 45) {
              textPoints[i][1] = p + 90;
            }

            if (offsetAngle < -45) {
              textPoints[i][1] = p - 90;
            }
          }
        }
      }]);

      return GLabelBox;
    }();

/* harmony default export */ var avoid_GLabelBox = (GLabelBox_GLabelBox);
    // CONCATENATED MODULE: ./src/layer/label/avoid/GAnnoAvoid.js
    function GAnnoAvoid_classCallCheck (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    function GAnnoAvoid_defineProperties (target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

    function GAnnoAvoid_createClass (Constructor, protoProps, staticProps) { if (protoProps) GAnnoAvoid_defineProperties(Constructor.prototype, protoProps); if (staticProps) GAnnoAvoid_defineProperties(Constructor, staticProps); return Constructor; }

    /**
     * Class: GAnnoAvoid
     * 避让策略类
     *
     * Inherits:
     *  - <Object>
     */




    var GAnnoAvoid_GAnnoAvoid = /*#__PURE__*/function () {
      function GAnnoAvoid (ctx, formatFont, debug) {
        GAnnoAvoid_classCallCheck(this, GAnnoAvoid);

        this.grid = null;
        this.GLabelBox = new avoid_GLabelBox(ctx, formatFont);
        this.debug = debug;
      } //注记和线图元进行避让


      GAnnoAvoid_createClass(GAnnoAvoid, [{
        key: "avoid",
        value: function avoid (labelFeatures, styleMap, avoidLineFeatures) {
          for (var i = 0; i < labelFeatures.length; i++) {
            var labelFeature = labelFeatures[i];
            var style = styleMap[labelFeature.styleId];

            if (labelFeature.type == 1) {
              this.avoidPointLine(labelFeature, avoidLineFeatures, style);
            }

            if (labelFeature.type == 2) {
              labelFeature.isCollision = this.avoidLineLine(labelFeature, avoidLineFeatures);
            }
          }

          return labelFeatures;
        } //点注记和线图元避让

      }, {
        key: "avoidPointLine",
        value: function avoidPointLine (feature, avoidLineFeatures, style) {
          var weight = feature.weight; //获取需要与注记避让的线图元

          avoidLineFeatures = this.getAvoidLineFeatures(weight, avoidLineFeatures);
          var boxCount = feature.boxs.length;
          feature.boxIndexs = {};

          for (var k = 0; k < boxCount; k++) {
            feature.boxIndexs[k] = true;
          } //删除的方向个数


          var delDirectionCount = 0;

          for (var i = 0; i < avoidLineFeatures.length; i++) {
            var avoidLineFeature = avoidLineFeatures[i];

            for (var j = 0; j < boxCount; j++) {
              var box = feature.boxs[j];
              var b = this.crashBoxLine(box, avoidLineFeature.sourceDatas, false);

              if (b) {
                if (feature.boxIndexs[j]) {
                  delete feature.boxIndexs[j];
                  delDirectionCount++; //如果所有方向都压盖，则压盖

                  if (delDirectionCount == boxCount) {
                    return true;
                  }
                }
              }
            }
          }

          return false;
        } //线注记和线图元避让

      }, {
        key: "avoidLineLine",
        value: function avoidLineLine (feature, avoidLineFeatures) {
          var weight = feature.weight; //获取需要与注记避让的线图元

          avoidLineFeatures = this.getAvoidLineFeatures(weight, avoidLineFeatures);

          for (var j = 0; j < avoidLineFeatures.length; j++) {
            var avoidLineFeature = avoidLineFeatures[j];
            var isleftCollision = false;
            var isRightCollision = false;

            for (var i = 0; i < feature.boxs.length; i++) {
              var box = feature.boxs[i],
                boxArr = [];
              boxArr.push([box[0], box[1], box[2], box[3]]);
              boxArr.push([box[2], box[1], box[0], box[3]]);
              isleftCollision = this.crashPartLineLine(boxArr[0], avoidLineFeature.sourceDatas);
              isRightCollision = this.crashPartLineLine(boxArr[1], avoidLineFeature.sourceDatas);

              if (isleftCollision || isRightCollision) {
                return true;
              }
            }
          }

          return false;
        } //获取权重比点注记高的先图元要素

      }, {
        key: "getAvoidLineFeatures",
        value: function getAvoidLineFeatures (weight, avoidLineFeatures) {
          var alFeatures = [];

          for (var i = 0; i < avoidLineFeatures.length; i++) {
            var avoidLineFeature = avoidLineFeatures[i];
            var lineWeight = avoidLineFeature.weight;

            if (lineWeight > weight) {
              alFeatures.push(avoidLineFeature);
            }
          }

          return alFeatures;
        } // box和line是否相交

      }, {
        key: "crashBoxLine",
        value: function crashBoxLine (box, line, isFour) {
          var boxLines = [];

          if (isFour) {
            boxLines.push([box[0], box[1], box[2], box[1]]);
            boxLines.push([box[2], box[1], box[2], box[3]]);
            boxLines.push([box[2], box[3], box[0], box[3]]);
            boxLines.push([box[0], box[3], box[0], box[1]]);
          } else {
            boxLines.push([box[0], box[1], box[2], box[3]]);
            boxLines.push([box[2], box[1], box[0], box[3]]);
          }

          for (var i = 0; i < boxLines.length; i++) {
            var boxLine = boxLines[i];

            for (var j = 0; j < line.length / 2 - 1; j++) {
              var partLine = [line[2 * j], line[2 * j + 1], line[2 * (j + 1)], line[2 * (j + 1) + 1]];

              if (this.crashPartLinePartLine(boxLine, partLine)) {
                return true;
              }
            }
          }

          return false;
        } // 两条线是否相交

      }, {
        key: "crashLineLine",
        value: function crashLineLine (line1, line2) {
          for (var i = 0; i < line1.length / 2 - 1; i++) {
            var partLine1 = [line1[2 * i], line1[2 * i + 1], line1[2 * (i + 1)], line1[2 * (i + 1) + 1]];

            for (var j = 0; j < line2.length / 2 - 1; j++) {
              var partLine2 = [line2[2 * j], line2[2 * j + 1], line2[2 * (j + 1)], line2[2 * (j + 1) + 1]];

              if (this.crashPartLinePartLine(partLine1, partLine2)) {
                return true;
              }
            }
          }

          return false;
        } // 两条线是否相交

      }, {
        key: "crashPartLineLine",
        value: function crashPartLineLine (partLine, line2) {
          for (var j = 0; j < line2.length / 2 - 1; j++) {
            var partLine2 = [line2[2 * j], line2[2 * j + 1], line2[2 * (j + 1)], line2[2 * (j + 1) + 1]];

            if (this.crashPartLinePartLine(partLine, partLine2)) {
              return true;
            }
          }

          return false;
        } // 两条线段是否相交

      }, {
        key: "crashPartLinePartLine",
        value: function crashPartLinePartLine (line1, line2) {
          var p0_x = line1[0];
          var p0_y = line1[1];
          var p1_x = line1[2];
          var p1_y = line1[3];
          var p2_x = line2[0];
          var p2_y = line2[1];
          var p3_x = line2[2];
          var p3_y = line2[3];
          var s02_x, s02_y, s10_x, s10_y, s32_x, s32_y, s_numer, t_numer, denom, t;
          s10_x = p1_x - p0_x;
          s10_y = p1_y - p0_y;
          s32_x = p3_x - p2_x;
          s32_y = p3_y - p2_y;
          denom = s10_x * s32_y - s32_x * s10_y;
          if (denom == 0 //平行或共线
          ) return 0; // Collinear

          var denomPositive = denom > 0;
          s02_x = p0_x - p2_x;
          s02_y = p0_y - p2_y;
          s_numer = s10_x * s02_y - s10_y * s02_x;
          if (s_numer < 0 == denomPositive //参数是大于等于0且小于等于1的，分子分母必须同号且分子小于等于分母
          ) return 0; // No collision

          t_numer = s32_x * s02_y - s32_y * s02_x;
          if (t_numer < 0 == denomPositive) return 0; // No collision

          if (s_numer > denom == denomPositive || t_numer > denom == denomPositive) return 0; // No collision

          return 1;
        } //避让

      }, {
        key: "defaultAvoid",
        value: function defaultAvoid (features, styleMap, isClient, hasImportant, ableWeight) {
          if (isClient) {
            this.grid = new avoid_GGridIndex(4096, 32, 0);
          } else {
            this.grid = new avoid_GGridIndex(512, 32, 32);
          }

          if (features == null || features.length < 1) return []; // console.time('计算box');
          // //设置box,如果有线编码或者线箭头，则会新增要素

          features = this.GLabelBox.setBox(features, styleMap, isClient); // console.timeEnd('计算box');
          // console.time('mergeFeatures');

          features = this.mergeFeatures(features); // console.timeEnd('mergeFeatures');
          // console.time('排序');

          if (ableWeight) {
            //权值排序
            Util["a" /* default */].sort(features, styleMap, hasImportant);
          } // console.timeEnd('排序');
          // console.time('避让');
          //将注记添加到单元格中，进行避让


          for (var i = 0; i < features.length; i++) {
            var feature = features[i];
            var style = styleMap[feature.styleId] ? styleMap[feature.styleId] : feature.style;
            this.avoidFeature(feature, style);
          } // console.timeEnd('避让');


          var newFeatures = this.GLabelBox.filterFeature(features); //注记去重

          this.removeRepeat(newFeatures, styleMap); // console.timeEnd('去重');

          newFeatures = this.filterFeature(newFeatures);
          this.prevFeatures = newFeatures;

          if (this.debug) {
            return features;
          }

          return newFeatures;
        }
        /**
         * 给要素设置避让的box和注记的绘制坐标
         * @param f
         */

      }, {
        key: "avoidFeature",
        value: function avoidFeature (f, style) {
          if (style.show == false || f.hidden == true) {
            f.hidden = true;
            return;
          }

          if (f.boxs) {
            if (f.type == 1) {
              //点注记跟其它注记避让
              this.avoidPoint(f, style);
            } else {
              if (f.isCollision) {
                f.hidden = true;
              } else {
                //线注记跟其它注记进行避让
                this.avoidLine(f, style);
              }
            }
          } else {
            f.hidden = true;
          }
        }
        /**
         * 将点注记加入到计算出的多个单元格中
         * @param feature
         */

      }, {
        key: "avoidPoint",
        value: function avoidPoint (feature, style) {
          //如果为重要的，则不避让
          if (style.isImportant == true) {
            // let box = feature.boxs[feature.direction];
            this.addBoxToCells(feature.primaryId, feature.box);
            return;
          } //如果前面有小图标，并且开启了四宫格避让


          if ((style.isFourDirections || style.isEightDirections) && style.texture) {
            this.addFourCollisionFeatureToCells(feature, style, 0);
          } else {
            //如果没有指定的方向
            if (feature.boxIndexs && !feature.boxIndexs[0]) {
              feature.hidden = true;
              return;
            }

            var isCollision = this.isCollision(feature.box);

            if (isCollision) {
              feature.hidden = true;
              return;
            }

            this.addBoxToCells(feature.primaryId, feature.box);
          }
        }
        /**
         * 将线注记加入到计算出的多个单元格中
         * @param feature
         */

      }, {
        key: "avoidLine",
        value: function avoidLine (feature, style) {
          //如果为重要的，则不避让
          if (style.isImportant == true) {
            for (var i = 0; i < feature.boxs.length; i++) {
              var box = feature.boxs[i];
              this.addBoxToCells(feature.primaryId + 'index_' + i, box);
            }

            return;
          } //线注记是否与其它注记相交


          var isCollision = false;

          for (var _i = 0; _i < feature.boxs.length; _i++) {
            var _box = feature.boxs[_i];

            if (this.isCollision(_box)) {
              isCollision = true;
              break;
            }
          }

          if (isCollision) {
            feature.hidden = true;
          } else {
            for (var _i2 = 0; _i2 < feature.boxs.length; _i2++) {
              var _box2 = feature.boxs[_i2];
              this.addBoxToCells(feature.primaryId + 'index_' + _i2, _box2);
            }
          }
        }
        /**
         * 将点注记添加到单元格中
         * @param feature 点注记
         * @param index 点注记四宫格的index
         */

      }, {
        key: "addFourCollisionFeatureToCells",
        value: function addFourCollisionFeatureToCells (feature, style, index) {
          var isCollision = true;
          var box = []; //如果有指定的方向

          if (!feature.boxIndexs || feature.boxIndexs && feature.boxIndexs[index]) {
            box = feature.boxs[index];
            isCollision = this.isCollision(box);
          } // 如果相交,进行四宫,八宫格避让


          if (isCollision) {
            index++;

            if (index == feature.boxs.length) {
              index = index - feature.boxs.length;
            } //所有方向全部避让完成，仍然相交


            if (index == 0) {
              feature.hidden = true;
              return;
            } else {
              //换个点注记方向的box，再进行递归避让检测
              this.addFourCollisionFeatureToCells(feature, style, index);
            }
          } else {
            feature.textPoint = feature.fourPoints[index];
            feature.box = box; // feature.direction = index;

            this.addBoxToCells(feature.primaryId, box);
          }
        }
        /**
         *  返回注记的box是否与其它注记相交
         * @param row
         * @param col
         * @param feature
         */

      }, {
        key: "isCollision",
        value: function isCollision (box) {
          var x1 = box[0];
          var y1 = box[1];
          var x2 = box[2];
          var y2 = box[3];
          var result = this.grid.query(x1, y1, x2, y2);
          return result.length > 0;
        }
        /**
         *  注记box所占的单元格标识为true
         */

      }, {
        key: "addBoxToCells",
        value: function addBoxToCells (key, box) {
          var x1 = box[0];
          var y1 = box[1];
          var x2 = box[2];
          var y2 = box[3];
          this.grid.insert(key, x1, y1, x2, y2);
        } //attributeId当相同时，点注记的四个方向合并。线注记有一个是和图元压盖时，其它的线注记也不显示

      }, {
        key: "mergeFeatures",
        value: function mergeFeatures (features) {
          var map = {};

          for (var i = 0; i < features.length; i++) {
            var feature = features[i];

            if (!map[feature.attributeId]) {
              map[feature.attributeId] = [];
            }

            map[feature.attributeId].push(feature);
          }

          for (var key in map) {
            var array = map[key];

            if (array.length > 1) {
              var fristFeature = array[0];

              if (!fristFeature.boxIndexs) {
                continue;
              } //点注记，合并四宫格方向


              if (fristFeature.type == '1') {
                var boxIndexs = fristFeature.boxIndexs;

                for (var j = 1; j < array.length; j++) {
                  boxIndexs = this.getBothDirection(boxIndexs, array[j].boxIndexs);
                }

                var isEmpty = true;

                for (var dKey in boxIndexs) {
                  isEmpty = false;
                  break;
                }

                for (var k = 0; k < array.length; k++) {
                  if (isEmpty) {
                    array[k].hidden = true;
                  } else {
                    array[k].boxIndexs = boxIndexs;
                  }
                }
              } //是线注记,如果一条线压盖，其它的线也不显示


              if (fristFeature.type == '2') {// let isCollision = false;
                // for (let n = 0; n < array.length; n++) {
                //     if (array[n].isCollision == true) {
                //         isCollision = true;
                //         break;
                //     }
                // }
                //
                // if (isCollision) {
                //     for (let m = 0; m < array.length; m++) {
                //         array[m].hidden = true
                //     }
                // }
              }
            }
          } //去掉隐藏的注记


          return this.GLabelBox.filterFeature(features);
        } //合并两个点注记的方向

      }, {
        key: "getBothDirection",
        value: function getBothDirection (boxIndexs1, boxIndexs2) {
          var boxIndexs = {};

          if (boxIndexs2) {
            for (var key in boxIndexs1) {
              if (boxIndexs2 && boxIndexs2[key]) {
                boxIndexs[key] = true;
              }
            }
          }

          return boxIndexs;
        }
        /**
         * 求两点之间的距离
         */

      }, {
        key: "getDistance",
        value: function getDistance (p1, p2) {
          var calX = p2[0] - p1[0];
          var calY = p2[1] - p1[1];
          return Math.pow(calX * calX + calY * calY, 0.5);
        } // 获取过滤后的要素.

      }, {
        key: "filterFeature",
        value: function filterFeature (features) {
          var returnFeatures = []; //剔除需避让的要素

          for (var i = 0; i < features.length; i++) {
            if (!features[i].hidden) {
              features[i].drawed = true;
              returnFeatures.push(features[i]);
            }
          }

          return returnFeatures;
        } //去掉重复的注记

      }, {
        key: "removeRepeat",
        value: function removeRepeat (features, styleMap) {
          var pointsFs = [];
          var lineTextFs = [];
          var lineCodeFs = [];
          var drawedPointFs = [];
          var drawedLineTextFs = [];
          var drawedLineCodeFs = [];

          for (var i = 0; i < features.length; i++) {
            var f = features[i];

            if (f.type == 1) {
              if (f.drawed == true) {
                drawedPointFs.push(f);
              } else {
                pointsFs.push(f);
              }
            } else if (f.type == 2) {
              if (f.lineType == 'text') {
                if (f.drawed == true) {
                  drawedLineTextFs.push(f);
                } else {
                  lineTextFs.push(f);
                }
              }

              if (f.lineType == 'code') {
                if (f.drawed == true) {
                  drawedLineCodeFs.push(f);
                } else {
                  lineCodeFs.push(f);
                }
              }
            }
          }

          for (var j = 0; j < pointsFs.length; j++) {
            var pf = pointsFs[j];
            this.getShowPointFeatrues(drawedPointFs, pf, styleMap);
          }

          for (var k = 0; k < lineTextFs.length; k++) {
            var ltf = lineTextFs[k];
            this.getShowLineTextFeatrues(drawedLineTextFs, ltf, styleMap);
          }

          for (var n = 0; n < lineCodeFs.length; n++) {
            var lcf = lineCodeFs[n];
            this.getShowLineCodeFeatrues(drawedLineCodeFs, lcf, styleMap);
          } //清除上一屏的注记的绘制状态


          if (this.prevFeatures) {
            for (var m = 0; m < this.prevFeatures.length; m++) {
              var _pf = this.prevFeatures[m];
              _pf.drawed = false;
            }
          }
        }
      }, {
        key: "getShowPointFeatrues",
        value: function getShowPointFeatrues (features, feature, styleMap) {
          var hidden = false;
          var sIndex = -1;

          for (var i = 0; i < features.length; i++) {
            var f = features[i];
            var style = styleMap[f.styleId];

            if (f.label == feature.label && style.distance && styleMap[feature.styleId].distance) {
              //求两个点注记之间的距离
              var distance = this.getDistance(f.datas[0][0], feature.datas[0][0]);

              if (distance < style.distance) {
                // if(f._sort != undefined && feature._sort != undefined){
                //     if(feature._sort <= f._sort && !feature.hidden){
                //         sIndex = i;
                //     }else{
                //         hidden = true;
                //         feature.hidden = true;
                //     }
                // }else{
                //     hidden = true;
                //     feature.hidden = true;
                // }
                hidden = true;
                feature.hidden = true;
              }
            }
          }

          if (!hidden) {
            if (sIndex == -1) {
              features.push(feature);
            } else {
              features.splice(sIndex, 1, feature);
            }
          }
        }
      }, {
        key: "getShowLineTextFeatrues",
        value: function getShowLineTextFeatrues (features, feature, styleMap) {
          var hidden = false;

          for (var i = 0; i < features.length; i++) {
            var f = features[i];
            var style = styleMap[f.styleId];

            if (f.label == feature.label && style.lineTextDistance && styleMap[feature.styleId].lineTextDistance) {
              //求两个点注记之间的距离
              var distance = this.getDistance(f.centerPoint, feature.centerPoint);

              if (distance < style.lineTextDistance) {
                hidden = true;
                feature.hidden = true;
              }
            }
          }

          if (!hidden) {
            features.push(feature);
          }
        }
      }, {
        key: "getShowLineCodeFeatrues",
        value: function getShowLineCodeFeatrues (features, feature, styleMap) {
          var hidden = false;

          for (var i = 0; i < features.length; i++) {
            var f = features[i];
            var style = styleMap[f.styleId];

            if (f.label == feature.label && style.lineCodeDistance && styleMap[feature.styleId].lineCodeDistance) {
              //求两个点注记之间的距离
              var distance = this.getDistance(f.centerPoint, feature.centerPoint);

              if (distance < style.lineCodeDistance) {
                hidden = true;
                feature.hidden = true;
              }
            }
          }

          if (!hidden) {
            features.push(feature);
          }
        }
      }]);

      return GAnnoAvoid;
    }();

/* harmony default export */ var avoid_GAnnoAvoid = __webpack_exports__["a"] = (GAnnoAvoid_GAnnoAvoid);

    /***/
  }),
/* 23 */
/***/ (function (module, exports) {

    function _typeof (obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof (obj) { return typeof obj; }; } else { _typeof = function _typeof (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

    var g; // This works in non-strict mode

    g = function () {
      return this;
    }();

    try {
      // This works if eval is allowed (see CSP)
      g = g || new Function("return this")();
    } catch (e) {
      // This works if the window reference is available
      if ((typeof window === "undefined" ? "undefined" : _typeof(window)) === "object") g = window;
    } // g can still be undefined, but nothing to do about it...
    // We return undefined, instead of nothing here, so it's
    // easier to handle this case. if(!global) { ...}


    module.exports = g;

    /***/
  }),
/* 24 */
/***/ (function (module, __webpack_exports__, __webpack_require__) {

    "use strict";
/* harmony import */ var leaflet__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);
/* harmony import */ var leaflet__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(leaflet__WEBPACK_IMPORTED_MODULE_0__);
    /*
     * @namespace CRS
     * @crs L.CRS.EPSG4326
     *
     * A common CRS among GIS enthusiasts. Uses simple Equirectangular projection.
     *
     * Leaflet 1.0.x complies with the [TMS coordinate scheme for EPSG:4326](https://wiki.osgeo.org/wiki/Tile_Map_Service_Specification#global-geodetic),
     * which is a breaking change from 0.7.x behaviour.  If you are using a `TileLayer`
     * with this CRS, ensure that there are two 256x256 pixel tiles covering the
     * whole earth at zoom level zero, and that the tile coordinate origin is (-180,+90),
     * or (-180,-90) for `TileLayer`s with [the `tms` option](#tilelayer-tms) set.
     */

    var CustomEPSG4326 = leaflet__WEBPACK_IMPORTED_MODULE_0___default.a.extend({}, leaflet__WEBPACK_IMPORTED_MODULE_0___default.a.CRS.Earth, {
      code: 'EPSG:4326',
      projection: leaflet__WEBPACK_IMPORTED_MODULE_0___default.a.Projection.LonLat,
      transformation: new leaflet__WEBPACK_IMPORTED_MODULE_0___default.a.Transformation(1 / 180, 1, -1 / 180, 0.5),
      scale: function scale (zoom) {
        return 256 * Math.pow(2, zoom - 1);
      }
    });
/* harmony default export */ __webpack_exports__["a"] = (CustomEPSG4326);

    /***/
  }),
/* 25 */
/***/ (function (module, __webpack_exports__, __webpack_require__) {

    "use strict";
/* harmony import */ var _DataSource__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(10);
/* harmony import */ var _utils_es6_promise__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1);
    function _typeof (obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof (obj) { return typeof obj; }; } else { _typeof = function _typeof (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

    function _classCallCheck (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    function _defineProperties (target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

    function _createClass (Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

    function _inherits (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

    function _setPrototypeOf (o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf (o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

    function _createSuper (Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal () { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

    function _possibleConstructorReturn (self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

    function _assertThisInitialized (self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

    function _isNativeReflectConstruct () { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () { })); return true; } catch (e) { return false; } }

    function _getPrototypeOf (o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf (o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }



    /**
     * Created by kongjian on 2017/6/30.
     */

    var LocalDataSource = /*#__PURE__*/function (_DataSource) {
      _inherits(LocalDataSource, _DataSource);

      var _super = _createSuper(LocalDataSource);

      function LocalDataSource () {
        var _this;

        _classCallCheck(this, LocalDataSource);

        _this = _super.call(this); //数据源类型

        _this.type = 'LocalDataSource'; //本地要素集合

        _this.features = []; //图标url Map：{name:1.png,value:'http://localhost:8080/mapserver/1.png'}

        _this.textureUrls = {};
        return _this;
      }
      /**
       * 添加feature
       * Parameters :
       * feature
       */


      _createClass(LocalDataSource, [{
        key: "addFeature",
        value: function addFeature (feature) {
          this.features.push(feature);
        }
        /**
         * 添加url图标
         * Parameters :
         * name 图标名称,如：1.png
         * url 图标的请求地址
         */

      }, {
        key: "addTextureUrl",
        value: function addTextureUrl (name, url) {
          this.textureUrls[name] = url;
        }
        /**
         * 移除url图标
         * Parameters :
         * name 图标名称,如：1.png
         */

      }, {
        key: "removeTextureUrl",
        value: function removeTextureUrl (name) {
          delete this.textureUrls[name];
        }
        /**
         * 加载纹理
         */

      }, {
        key: "loadTexture",
        value: function loadTexture () {
          var def = new _utils_es6_promise__WEBPACK_IMPORTED_MODULE_1__[/* Deferred */ "a"]();
          var totalCount = 0;

          for (var i in this.textureUrls) {
            if (this.textureUrls[i]) {
              totalCount++;
            }
          }

          if (totalCount == 0) {
            def.resolve();
            return;
          }

          var count = 0;

          for (var key in this.textureUrls) {
            var img = new Image();
            img.name = key;

            img.onload = function (data) {
              count++;
              var name = data.target.name;
              this.textures[name] = data.target;

              if (count == totalCount) {
                def.resolve();
              }
            }.bind(this);

            img.src = this.textureUrls[key];
          }

          return def;
        }
        /**
         * 通过featureId移除feature
         * Parameters :
         * featureId
         */

      }, {
        key: "removeFeatureById",
        value: function removeFeatureById (featureId) {
          for (var i = 0; i < this.features.length; i++) {
            var feature = this.features[i];

            if (feature.id == featureId) {
              this.features.splice(i, 1);
            }
          }
        }
      }]);

      return LocalDataSource;
    }(_DataSource__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"]);

    ;
/* harmony default export */ __webpack_exports__["a"] = (LocalDataSource);

    /***/
  }),
/* 26 */
/***/ (function (module, __webpack_exports__, __webpack_require__) {

    "use strict";
/* harmony import */ var leaflet__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);
/* harmony import */ var leaflet__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(leaflet__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _vector_draw_GXYZUtil__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8);
/* harmony import */ var _ext_Version__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(2);
/* harmony import */ var _avoid_GDrawGeomerty__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(7);
/* harmony import */ var _utils_es6_promise__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(1);
    /**
     * Created by kongjian on 2017/9/26.
     * 后端避让后的注记，前端绘制显示图层
     */





    var GLabelGrid = leaflet__WEBPACK_IMPORTED_MODULE_0___default.a.TileLayer.extend({
      //多个服务器url的域名，用于解决一个域名只有6条请求管线的限制
      urlArray: [],
      // 不带过滤条件的url
      sourceUrl: null,
      // 纹理图标集合
      textures: {},
      //瓦片队列
      tileQueue: [],
      //缩放比例
      ratio: 1,
      //瓦片大小
      tilesize: 256,
      //过滤json对象
      control: null,
      //过滤的id
      controlId: null,
      //是否支持注记拾取
      hitDetection: false,
      initialize: function initialize (url, options) {
        if (window.devicePixelRatio > 1.5) {
          this.ratio = 2;
        }

        if (!this.sourceUrl) {
          this.sourceUrl = url;
        }

        if (options && options.tileSize) {
          this.tilesize = options.tileSize;
        }

        this.gxyzUtil = new _vector_draw_GXYZUtil__WEBPACK_IMPORTED_MODULE_1__[/* default */ "a"]();
        this.gxyzUtil.tileSize = this.tilesize;
        this.gxyzUtil.parseUrl(url);
        this._url = url + '&tilesize=' + this.tilesize + '&clientVersion=' + _ext_Version__WEBPACK_IMPORTED_MODULE_2__[/* default */ "a"];
        leaflet__WEBPACK_IMPORTED_MODULE_0___default.a.setOptions(this, options);

        if (options) {
          this.hitDetection = options.hitDetection;
        }

        this.on('tileunload', this._onTileRemove);
        this.on('tileload', this._onTileLoad);
        this.on('tileerror', this._onTileError);
      },
      _initContainer: function _initContainer () {
        if (this._container) {
          return;
        }

        this._container = leaflet__WEBPACK_IMPORTED_MODULE_0___default.a.DomUtil.create('div', 'leaflet-pane leaflet-overlay-pane');
        this.getPane().appendChild(this._container);
      },
      onAdd: function onAdd () {
        if (this.control) {
          this._url = this.sourceUrl + '&tilesize=' + this.tilesize + '&clientVersion=' + _ext_Version__WEBPACK_IMPORTED_MODULE_2__[/* default */ "a"] + '&control=' + this.control;
        }

        if (this.controlId) {
          this._url = this.sourceUrl + '&tilesize=' + this.tilesize + '&clientVersion=' + _ext_Version__WEBPACK_IMPORTED_MODULE_2__[/* default */ "a"] + '&controlId=' + this.controlId;
        }

        this._initContainer();

        this._levels = {};
        this._tiles = {}; //请求图标纹理

        Object(_utils_es6_promise__WEBPACK_IMPORTED_MODULE_4__[/* getJSON */ "c"])({
          url: this.gxyzUtil.host + '/mapserver/styleInfo/' + this.gxyzUtil.servername + '/' + this.gxyzUtil.styleId + '/label/texture.js',
          dataType: 'text'
        }).then(function (result) {
          var textures = JSON.parse(result);
          var totalCount = 0;

          for (var i in textures) {
            totalCount++;
          }

          if (totalCount == 0) {
            this._resetView();

            this._update();
          }

          var count = 0;

          for (var key in textures) {
            var img = new Image();
            img.name = key;

            img.onload = function (data) {
              count++;
              var name = data.target.name;
              this.textures[name] = data.target;

              if (count == totalCount) {
                this._resetView();

                this._update();
              }
            }.bind(this);

            img.src = textures[key];
          }
        }.bind(this));
      },

      /**
       * 重写构造瓦片的方法
       */
      createTile: function createTile (coords, done) {
        //从队列中取canvas，避免频繁创建canvas
        var tile = this.tileQueue.pop();

        if (!tile) {
          tile = this.initTile();
        } else {
          this._cleanTile(tile);
        }

        var url = this.getTileUrl(coords);
        Object(_utils_es6_promise__WEBPACK_IMPORTED_MODULE_4__[/* getJSON */ "c"])({
          url: url,
          dataType: 'json'
        }).then(function (data) {
          tile.data = data;

          this._tileOnLoad.apply(this, [done, tile]);
        }.bind(this), function (error) {
          this._tileOnError.apply(this, [done, tile, error]);
        }.bind(this));
        return tile;
      },

      /**
       * 获取url的方法
       */
      getTileUrl: function getTileUrl (coords) {
        var data = {
          r: leaflet__WEBPACK_IMPORTED_MODULE_0___default.a.Browser.retina ? '@2x' : '',
          s: this._getSubdomain(coords),
          x: coords.x,
          y: coords.y,
          z: this._getZoomForUrl()
        };

        if (this._map && !this._map.options.crs.infinite) {
          var invertedY = this._globalTileRange.max.y - coords.y;

          if (this.options.tms) {
            data['y'] = invertedY;
          }

          data['-y'] = invertedY;
        }

        if (this.urlArray.length == 0) {
          return leaflet__WEBPACK_IMPORTED_MODULE_0___default.a.Util.template(this._url, leaflet__WEBPACK_IMPORTED_MODULE_0___default.a.extend(data, this.options));
        } else {
          //从urlArray中随机取出一个url
          var len = this.urlArray.length - 1;
          var index = Math.round(Math.random() * len);
          var url = this.urlArray[index];

          var array = this._url.split('/mapserver');

          var partUrl = array[1];
          url = url + '/mapserver' + partUrl;
          return leaflet__WEBPACK_IMPORTED_MODULE_0___default.a.Util.template(url, leaflet__WEBPACK_IMPORTED_MODULE_0___default.a.extend(data, this.options));
        }
      },

      /**
       *  初始化canvas
       */
      initTile: function initTile () {
        // console.time('initTile');
        var tile = document.createElement("canvas");
        tile.style.width = this.tilesize + "px";
        tile.style.height = this.tilesize + "px";
        tile.width = this.tilesize;
        tile.height = this.tilesize;
        var ctx = tile.getContext("2d", {
          isQuality: true
        });
        tile.ctx = ctx;

        if (this.hitDetection) {
          var canvas = document.createElement("canvas");
          canvas.style.width = this.tilesize + "px";
          canvas.style.height = this.tilesize + "px";
          canvas.width = this.tilesize;
          canvas.height = this.tilesize;
          var hitCtx = canvas.getContext("2d", {
            isQuality: true
          });
          tile.hitCtx = hitCtx;
        } // console.timeEnd('initTile');


        return tile;
      },
      //移除瓦片
      _onTileRemove: function _onTileRemove (e) {
        //加入到瓦片队列
        this.tileQueue.push(e.tile);
      },

      /**
       *  重写，取消请求的操作
       */
      _abortLoading: function _abortLoading () {
        var i, tile;

        for (i in this._tiles) {
          if (this._tiles[i].coords.z !== this._tileZoom) {
            tile = this._tiles[i].el; // if (!tile.complete) { // 是否要缩放时，注记放大效果

            leaflet__WEBPACK_IMPORTED_MODULE_0___default.a.DomUtil.remove(tile); // }
          }
        }
      },
      _onTileLoad: function _onTileLoad (item) {
        var tile = item.tile;

        this._drawTile(tile, tile.data);

        tile.complete = true;
      },
      _onTileError: function _onTileError (item) {
        var tile = item.tile;
        tile.complete = true;
        this.tileQueue.push(tile);
      },
      _tileOnError: function _tileOnError (done, tile, e) {
        done(e, tile);
      },
      _drawTile: function _drawTile (tile, features) {
        // console.time('_drawTile');
        var ctx = tile.ctx;
        var hitCtx = tile.hitCtx;
        var featureIdMap = {};

        for (var i = 0; i < features.length; i++) {
          var feature = features[i]; //画点注记

          if (feature.type == 1) {
            feature.id = Math.round(Math.random() * 256 * 256 * 256);
            featureIdMap[feature.id] = feature;
            feature.iconImg = this.textures[feature.style.texture];
            _avoid_GDrawGeomerty__WEBPACK_IMPORTED_MODULE_3__[/* default */ "a"].drawPointIcon(ctx, feature, this.ratio, false, tile.hitCtx, this.hitDetection);
            _avoid_GDrawGeomerty__WEBPACK_IMPORTED_MODULE_3__[/* default */ "a"].drawPoint(ctx, feature, this.ratio, false, false, tile.hitCtx, this.hitDetection);
            continue;
          } //画线注记


          if (feature.type == 2) {
            _avoid_GDrawGeomerty__WEBPACK_IMPORTED_MODULE_3__[/* default */ "a"].drawLine(ctx, feature, this.ratio);
          }
        } //用于拾取查找


        tile.featureIdMap = featureIdMap; // console.timeEnd('_drawTile');
      },
      _cleanTile: function _cleanTile (tile) {
        tile.ctx.clearRect(0, 0, this.tilesize, this.tilesize);

        if (tile.hitCtx) {
          tile.hitCtx.clearRect(0, 0, this.tilesize, this.tilesize);
        }
      },

      /**
       * 根据屏幕坐标获取feature
       * Parameters :
       * x
       * y
       */
      getFeatureByXY: function getFeatureByXY (x, y) {
        var feature = null;

        if (this.hitDetection) {
          var featureId;

          var latLng = this._map.containerPointToLatLng(new leaflet__WEBPACK_IMPORTED_MODULE_0___default.a.point(x, y));

          var maxBounds = this._map.options.crs.projection.bounds; //地图当前范围

          var bounds = this._map.getBounds();

          var pBounds = this._map.getPixelBounds(); //地图当前分辨率


          var res = (bounds._northEast.lat - bounds._southWest.lat) / (pBounds.max.y - pBounds.min.y);
          var tileSize = this.tilesize;
          var row = (maxBounds.max.y - latLng.lat) / (res * tileSize);
          var col = (latLng.lng - maxBounds.min.x) / (res * tileSize);
          var frow = Math.floor(row);
          var fcol = Math.floor(col);

          var level = this._map.getZoom();

          var tile = this._tiles[fcol + ':' + frow + ':' + level].el;
          var tx = (col - fcol) * tileSize;
          var ty = (row - frow) * tileSize;
          var data = tile.hitCtx.getImageData(tx, ty, 1, 1).data;

          if (data[3] === 255) {
            // antialiased
            var id = data[2] + 256 * (data[1] + 256 * data[0]);

            if (id) {
              featureId = id - 1;

              try {
                feature = tile.featureIdMap[featureId];
              } catch (err) {
                console.log(err);
              }
            }
          }
        }

        return feature;
      },
      _update: function _update (center) {
        if (this.isSetIngFilter) {
          return;
        }

        leaflet__WEBPACK_IMPORTED_MODULE_0___default.a.TileLayer.prototype._update.call(this);
      },

      /**
       * 设置过滤条件
       */
      setFilter: function setFilter (filter) {
        this.isSetIngFilter = true;

        if (!this._url || !filter || filter.layers.length == 0 && filter.order.length == 0) {
          this.isSetIngFilter = false;
          this.controlId = null;
          this.control = null;
          this.setUrl(this.sourceUrl + '&tilesize=' + this.tilesize + '&clientVersion=' + _ext_Version__WEBPACK_IMPORTED_MODULE_2__[/* default */ "a"]);
          return;
        }

        this.gxyzUtil.setFilter(filter, function (result) {
          this.isSetIngFilter = false;

          if (result.isIE) {
            this.controlId = result.id;
            this.setUrl(this.sourceUrl + '&tilesize=' + this.tilesize + '&clientVersion=' + _ext_Version__WEBPACK_IMPORTED_MODULE_2__[/* default */ "a"] + '&controlId=' + result.id);
          } else {
            this.control = result.id;
            this.setUrl(this.sourceUrl + '&tilesize=' + this.tilesize + '&clientVersion=' + _ext_Version__WEBPACK_IMPORTED_MODULE_2__[/* default */ "a"] + '&control=' + result.id);
          }
        }.bind(this));
      }
    });
/* harmony default export */ __webpack_exports__["a"] = (GLabelGrid);

    /***/
  }),
/* 27 */
/***/ (function (module, __webpack_exports__, __webpack_require__) {

    "use strict";
/* harmony import */ var leaflet__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);
/* harmony import */ var leaflet__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(leaflet__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _draw_CanvasLayer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(28);
    /**
     * Created by kongjian on 2017/6/26.
     * 前端注记避让并绘制layer
     */


    var GWVTAnno = leaflet__WEBPACK_IMPORTED_MODULE_0___default.a.Layer.extend({
      canvasLayer: null,
      currLevel: 2,
      //缩放比例
      ratio: 1,
      //是否允许拾取
      hitDetection: true,
      cellsize: 4,
      options: {
        tileSize: 256,
        //图层透明度
        opacity: 1,
        zoomOffset: 0
      },

      /**
       * 构造方法
       */
      initialize: function initialize (options) {
        leaflet__WEBPACK_IMPORTED_MODULE_0___default.a.setOptions(this, options);

        if (this.options.hasOwnProperty('hitDetection')) {
          this.hitDetection = this.options.hitDetection;
        }

        if (this.options.hasOwnProperty('cellsize')) {
          this.cellsize = this.options.cellsize;
        }

        if (window.devicePixelRatio > 1.5) {
          this.ratio = 2;
        }

        this.canvasLayer = new _draw_CanvasLayer__WEBPACK_IMPORTED_MODULE_1__[/* default */ "a"]();
        this.canvasLayer.tileSize = this.options.tileSize;

        if (this.options.hasOwnProperty('ableAvoid')) {
          this.canvasLayer.ableAvoid = this.options.ableAvoid;
        }

        if (this.options.hasOwnProperty('debug')) {
          this.debug = this.options.debug;
          this.canvasLayer.setDebug(this.debug);
        }

        this.animating = false;
      },

      /**
       * 图层被添加到地图中调用
       */
      onAdd: function onAdd () {
        this.canvasLayer.hitDetection = this.hitDetection;
        this.canvasLayer.ratio = this.ratio; //地图最大范围

        var maxExtent = this._map.options.crs.projection.bounds;
        this.canvasLayer.init(this._map._size.x, this._map._size.y, this.options.tileSize, this);
        this.canvasLayer.maxExtent = [maxExtent.min.x, maxExtent.min.y, maxExtent.max.x, maxExtent.max.y];
        this._container = this.canvasLayer.root;

        if (this._zoomAnimated) {
          leaflet__WEBPACK_IMPORTED_MODULE_0___default.a.DomUtil.addClass(this._container, 'leaflet-zoom-animated');
        }

        this.canvasLayer.root.style.opacity = this.options.opacity;
        this.getPane().appendChild(this.canvasLayer.root);

        this._update();
      },
      setOpacity: function setOpacity (opacity) {
        this.options.opacity = opacity;

        if (this.canvasLayer.root) {
          this.canvasLayer.root.style.opacity = this.options.opacity;
        }
      },
      setAbleAvoid: function setAbleAvoid (ableAvoid) {
        if (this.canvasLayer) {
          this.canvasLayer.ableAvoid = ableAvoid;
          this.redraw();
        }
      },

      /**
       * 注册事件
       */
      getEvents: function getEvents () {
        var events = {
          resize: this.onResize,
          movestart: this.onMoveStart,
          zoom: this._onZoom,
          moveend: this._onMoveend
        };

        if (this._zoomAnimated) {
          events.zoomanim = this._onAnimZoom;
        }

        return events;
      },

      /**
       * 浏览器窗口缩放事件
       */
      onResize: function onResize (e) {
        this.canvasLayer.tileSize = this.options.tileSize;
        this.canvasLayer.gwvtAnno = this;
        this.canvasLayer.initCanvas(this._map._size.x, this._map._size.y);

        this._update();
      },
      _onAnimZoom: function _onAnimZoom (ev) {
        this.updateTransform(ev.center, ev.zoom);
      },
      _onZoom: function _onZoom () {
        this.updateTransform(this._map.getCenter(), this._map.getZoom());
      },
      _onMoveend: function _onMoveend () {
        this.animating = false;

        this._update();
      },

      /**
       * 缩放时更新注记层的位置
       */
      updateTransform: function updateTransform (center, zoom) {
        if (!this._zoom || !this._center) {
          this._zoom = this._map.getZoom();
          this._center = this._map.getCenter();
        }

        var scale = this._map.getZoomScale(zoom, this._zoom),
          position = this.getCanvasXY(),
          viewHalf = this._map.getSize().multiplyBy(0.5),
          currentCenterPoint = this._map.project(this._center, zoom),
          destCenterPoint = this._map.project(center, zoom),
          centerOffset = destCenterPoint.subtract(currentCenterPoint),
          topLeftOffset = viewHalf.multiplyBy(-scale).add(position).add(viewHalf).subtract(centerOffset);

        if (leaflet__WEBPACK_IMPORTED_MODULE_0___default.a.Browser.any3d) {
          leaflet__WEBPACK_IMPORTED_MODULE_0___default.a.DomUtil.setTransform(this.canvasLayer.root, topLeftOffset, scale);
        } else {
          leaflet__WEBPACK_IMPORTED_MODULE_0___default.a.DomUtil.setPosition(this.canvasLayer.root, topLeftOffset);
        }
      },

      /**
       * 缩放，平移完成的回调
       */
      onMoveStart: function onMoveStart () {
        this.animating = true;
      },

      /**
       * 缩放，平移完成的回调
       */
      _update: function _update () {
        var map = this._map;

        if (!map) {
          return;
        } //地图当前范围


        var bounds = map.getBounds();
        var pBounds = map.getPixelBounds();
        var east = map.options.crs.projection.project(bounds._northEast);
        var west = map.options.crs.projection.project(bounds._southWest); //地图当前分辨率

        var res = (east.y - west.y) / (pBounds.max.y - pBounds.min.y); //地图最大范围

        var maxExtent = map.options.crs.projection.bounds; //需要请求行列号

        var minRow = Math.floor((maxExtent.max.y - east.y) / (res * this.options.tileSize));
        var maxRow = Math.ceil((maxExtent.max.y - west.y) / (res * this.options.tileSize));
        var minCol = Math.floor((west.x - maxExtent.min.x) / (res * this.options.tileSize));
        var maxCol = Math.ceil((east.x - maxExtent.min.x) / (res * this.options.tileSize));
        var level = map.getZoom();
        var zoomChanged = this.currLevel != level;

        if (map.options.crs && map.options.crs.code && map.options.crs.code.indexOf("3857") > -1) {
          level = level + this.options.zoomOffset;
        } //发送请求


        var grid = this.getGrid(minRow, maxRow, minCol, maxCol, level);
        this.canvasLayer.extent = [west.x, west.y, east.x, east.y];
        this.canvasLayer.res = res;
        this.canvasLayer.requestLabelTiles(grid, zoomChanged);
        this.currLevel = level;
      },

      /**
       * 根据当前视口获取要请求的瓦片的行列号
       * Parameters (single argument):
       * bounds - 当前视口范围
       * Returns:
       * grid -  当前范围对应的瓦片层行列号
       */
      getGrid: function getGrid (minRow, maxRow, minCol, maxCol, level) {
        var grid = [];

        for (var col = minCol; col < maxCol; col++) {
          for (var row = minRow; row < maxRow; row++) {
            grid.push({
              "row": row,
              "col": col,
              "level": level
            });
          }
        }

        return grid;
      },

      /**
       * 当图层缩放，平移后，更新canvas的位置
       * 考虑到它的位置信息存到了map中，不同的map sdk实现机制不一样
       * 所以考虑将该方法提到本类中
       */
      resetCanvasDiv: function resetCanvasDiv () {
        if (this._map) {
          var p = this.getCanvasXY();
          leaflet__WEBPACK_IMPORTED_MODULE_0___default.a.DomUtil.setPosition(this._container, p);
          this._center = this._map.getCenter();
          this._zoom = this._map.getZoom();
        }
      },

      /**
       * 获取canvas的坐标
       */
      getCanvasXY: function getCanvasXY () {
        if (this._map) {
          var style = this._map.dragging._draggable._element.style;
          var offset;

          if (style.transform) {
            offset = style.transform.match(/(-?\d+\.?\d*)(px)/g);
          } else {
            offset = [style.left, style.top];
          }

          var x = offset[0].replace('px', '');
          var y = offset[1].replace('px', '');
          return {
            x: -x,
            y: -y
          };
        } else {
          return {
            x: 0,
            y: 0
          };
        }
      },

      /**
       * 重新绘制注记要素，当动态更改DataSouce数据源后，需要调用redraw方法
       */
      redraw: function redraw () {
        if (this.canvasLayer) {
          this.canvasLayer.redraw();
        }
      },

      /**
       * 添加数据源
       * Parameters :
       * dataSource
       */
      addDataSource: function addDataSource (dataSource) {
        this.canvasLayer.addDataSource(dataSource);
      },

      /**
       * 根据dataSoucceId移除数据源
       * Parameters :
       * dataSoucceId
       */
      removeDataSourceById: function removeDataSourceById (dataSoucceId) {
        this.canvasLayer.removeDataSourceById(dataSoucceId);
      },
      onRemove: function onRemove (map) {
        leaflet__WEBPACK_IMPORTED_MODULE_0___default.a.DomUtil.remove(this.canvasLayer.root);
      },
      addToMap: function addToMap (map) {
        map.addLayer(this);
      },

      /**
       * 根据屏幕坐标获取feature
       * Parameters :
       * x
       * y
       */
      getFeatureByXY: function getFeatureByXY (x, y, callback) {
        return this.canvasLayer.getFeatureByXY(x, y, callback);
      },

      /**
       * 是否支持isImportant属性，默认值为true
       * Parameters :
       * b
       */
      setHasImportant: function setHasImportant (b) {
        if (this.canvasLayer) {
          this.canvasLayer.hasImportant = b;
        }
      },

      /**
       * 获取支持isImportant属性，返回true 或者false
       */
      getHasImportant: function getHasImportant () {
        if (this.canvasLayer) {
          return this.canvasLayer.hasImportant;
        } else {
          return true;
        }
      },
      setDebug: function setDebug (debug) {
        if (this.debug != debug) {
          this.debug = debug;

          if (this.canvasLayer) {
            this.canvasLayer.setDebug(this.debug);

            this._update();
          }
        }
      },

      /**
       * 根据屏幕坐标获取feature, 可以拾取叠加的注记，效率比getFeatureByXY低
       * Parameters :
       * x
       * y
       */
      getFeaturesByXY: function getFeaturesByXY (x, y) {
        return this.canvasLayer.getFeaturesByXY(x, y);
      },

      /**
       * 高亮指定的注记
       * Parameters :
       * featrueIds 需要高亮的注记id数组
       * lightColor 注记高亮的填充色
       */
      highlightLabel: function highlightLabel (featrueIds, lightColor) {
        if (!lightColor) {
          lightColor = '#ff0000';
        }

        this.canvasLayer.highlightLabel(featrueIds, lightColor);

        this._update();
      },

      /**
       *  获取当前屏幕范围内的所有注记
       */
      getCurrentLabels: function getCurrentLabels () {
        return this.canvasLayer.features;
      },
      CLASS_NAME: "L.GWVTAnno"
    });
/* harmony default export */ __webpack_exports__["a"] = (GWVTAnno);

    /***/
  }),
/* 28 */
/***/ (function (module, __webpack_exports__, __webpack_require__) {

    "use strict";
/* WEBPACK VAR INJECTION */(function (Buffer) {/* harmony import */ var _utils_Cache__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(29);
/* harmony import */ var _avoid_GDrawGeomerty__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7);
/* harmony import */ var _utils_es6_promise__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(1);
/* harmony import */ var _utils_gistools_GisTools__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(5);
/* harmony import */ var _LabelDrawer__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(20);
/* harmony import */ var _avoid_GAnnoAvoid__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(22);
/* harmony import */ var _avoid_ParseLabelData__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(6);
/* harmony import */ var _avoid_GridFilterLabel__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(14);
/* harmony import */ var _avoid_GCutLine__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(17);
/* harmony import */ var _VarintReader__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(30);
      function _classCallCheck (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

      function _defineProperties (target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

      function _createClass (Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

      /**
       * Created by kongjian on 2017/6/26.
       */











      var CanvasLayer = /*#__PURE__*/function () {
        function CanvasLayer () {
          _classCallCheck(this, CanvasLayer);

          this.width = 0;
          this.height = 0; //当前屏幕的瓦片层行列号集合

          this.grid = [];
          this.cache = new _utils_Cache__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"](256); //注记图层对象

          this.gwvtAnno = null; //数据源集合

          this.dataSource = []; //如果dataSource是urldatasource,那么样式纹理是否加载完成。 如果只有localDataSource,则为true

          this.isReady = false; //地图的最大范围

          this.maxExtent = []; //地图的当前视口

          this.extent = []; //地图的当前分辨率

          this.res = 0; //瓦片大小

          this.tileSize = 256; //是否允许拾取

          this.hitDetection = false; //当前屏幕内的features

          this.features = []; //正在请求中的瓦片请求集合,还没返回的请求

          this.requestingTiles = {}; // 是否支持有isImportant属性

          this.hasImportant = true; //缩放比例

          this.ratio = 1;
          var canvas = document.createElement('CANVAS');
          this.ctx = canvas.getContext('2d', {
            isQuality: true
          }); // //是否已经设置过全局样式
          // this.isSetGlobalStyle = false;
          //全局是否开启避让

          this.ableAvoid = true; //全局是否开启权重排序

          this.ableWeight = true; //过滤格网大小

          this.cellsize = 4; //网格内保留点的个数

          this.maxPerCell = 1; //样式map

          this.styleMap = {}; //避让调试工具模式

          this.debug = false;
          this.GAnnoAvoid = new _avoid_GAnnoAvoid__WEBPACK_IMPORTED_MODULE_5__[/* default */ "a"](this.ctx, false, this.debug);
          this.highlightLabels = {};
        }

        _createClass(CanvasLayer, [{
          key: "setDebug",
          value: function setDebug (debug) {
            this.debug = debug;
            this.GAnnoAvoid = new _avoid_GAnnoAvoid__WEBPACK_IMPORTED_MODULE_5__[/* default */ "a"](this.ctx, false, this.debug);
          }
          /**
           * 初始化
           */

        }, {
          key: "init",
          value: function init (w, h, tileSize, gwvtAnno) {
            this.tileSize = tileSize;
            this.gwvtAnno = gwvtAnno;
            this.cellsize = gwvtAnno.cellsize;
            this.initCanvas(w, h);
            this.loadResources();
          }
        }, {
          key: "loadResources",

          /**
           * 加载dataSource的样式文件和纹理，所有dataSource的
           * 样式文件和纹理加载完成，则isReady设置为ture
           */
          value: function loadResources () {
            if (this.dataSource.length == 0) {
              this.isReady = false;
              return;
            }

            this.cache.clean();
            this.requestingTiles = {};
            var reqArr = [];

            for (var i = 0; i < this.dataSource.length; i++) {
              var ds = this.dataSource[i];

              if (ds.type == 'URLDataSource') {
                reqArr = reqArr.concat(ds.loadStyle());
              }

              if (ds.type == 'LocalDataSource') {
                reqArr = reqArr.concat(ds.loadTexture());
              }
            }

            if (reqArr.length > 0) {
              Promise.all(reqArr).then(function () {
                this.isReady = true; //重新请求注记数据

                if (this.grid.length > 0) {
                  this.requestLabelTiles(this.grid);
                }
              }.bind(this));
            } else {
              this.isReady = true;
            }
          }
        }, {
          key: "initCanvas",

          /**
           * 初始化画布
           * Parameters :
           * w - 图层宽
           * h - 图层高
           */
          value: function initCanvas (w, h) {
            this.width = w;
            this.height = h;

            if (!this.root) {
              this.root = document.createElement("canvas");
            }

            this.root.style.width = this.width + "px";
            this.root.style.height = this.height + "px";
            this.root.width = this.width * this.ratio;
            this.root.height = this.height * this.ratio;
            this.root.id = 'labelCanvas';
            this.canvas = this.root.getContext("2d", {
              isQuality: true
            });

            if (this.hitDetection) {
              if (!this.hitCanvas) {
                this.hitCanvas = document.createElement("canvas");
              }

              this.hitCanvas.style.width = this.width + "px";
              this.hitCanvas.style.height = this.height + "px";
              this.hitCanvas.width = this.width;
              this.hitCanvas.height = this.height;
              this.hitContext = this.hitCanvas.getContext("2d", {
                isQuality: true
              });
            }
          }
        }, {
          key: "addDataSource",

          /**
           * 添加数据源
           * Parameters :
           * dataSource
           */
          value: function addDataSource (dataSource) {
            if (dataSource.type == 'URLDataSource') {
              dataSource.url = dataSource.url + '&tilesize=' + this.tileSize;
              dataSource.loadServerInfo();
            }

            if (dataSource.type == 'URLDataSource' || dataSource.type == 'LocalDataSource') {
              this.dataSource.push(dataSource);
            }
          }
        }, {
          key: "removeDataSourceById",

          /**
           * 根据dataSoucceId移除数据源
           * Parameters :
           * dataSoucceId
           */
          value: function removeDataSourceById (dataSoucceId) {
            for (var i = 0; i < this.dataSource.length; i++) {
              if (this.dataSource[i].id == dataSoucceId) {
                this.dataSource.splice(i, 1);
                return;
              }
            }
          }
        }, {
          key: "getDataSourceById",

          /**
           * 根据dataSoucceId获取数据源
           * Parameters :
           * dataSoucceId
           */
          value: function getDataSourceById (dataSoucceId) {
            for (var i = 0; i < this.dataSource.length; i++) {
              if (this.dataSource[i].id == dataSoucceId) {
                return this.dataSource[i];
              }
            }
          }
        }, {
          key: "clean",

          /**
           * 清空画布
           */
          value: function clean () {
            this.canvas.clearRect(0, 0, this.width * this.ratio, this.height * this.ratio);

            if (this.hitContext) {
              this.hitContext.clearRect(0, 0, this.width, this.height);
            }
          }
        }, {
          key: "redraw",

          /**
           * 重新绘制注记要素，当动态更改DataSouce数据源后，需要调用redraw方法
           */
          value: function redraw () {
            if (this.grid.length == 0) {
              return;
            } //重置styleMap


            this.styleMap = {}; //重新加载样式，纹理文件

            this.loadResources();
          }
        }, {
          key: "requestLabelTiles",

          /**
           * 请求注记瓦片
           * Parameters :
           * grid - 当前视口内，瓦片的层行列号集合
           * zoomChanged - 是否进行了缩放操作
           */
          value: function requestLabelTiles (grid, zoomChanged) {
            this.grid = grid; //如果数据源没有准备好

            if (!this.isReady) {
              return;
            } //获取需要请求的url


            var requestTileUrls = this.getRequestTileUrls(grid);
            this.sendRequest(requestTileUrls);
          }
        }, {
          key: "cutLineFeature",

          /**
           * 将线切多段，分为线文字，线编码，线箭头,并转换为屏幕坐标
           * Parameters:
           * feature - 瓦片内坐标的注记数据
           * isLocal - true为本地Feature,false为远程请求的feature
           * Returns:
           * features - 切好的线文字，线编码，线箭头要素集合
           */
          value: function cutLineFeature (feature, isLocal) {
            if (feature.style.type == '_default__') {
              feature.sourceAngleData = this.lineToSourceAngleData(feature.sourceData);
              feature.datas = this.transformData(feature.sourceAngleData, feature.xyz);
              return [feature];
            }

            var features = _avoid_GCutLine__WEBPACK_IMPORTED_MODULE_8__[/* default */ "a"].cutLineFeature(feature, feature.style);

            for (var i = 0; i < features.length; i++) {
              var f = features[i]; //转换为屏幕坐标

              if (isLocal) {
                f.datas = f.sourceAngleData;
              } else {
                f.datas = this.transformData(f.sourceAngleData, f.xyz);
                f.primaryId = f.attributeId + '_row_' + feature.xyz.row + '_col_' + feature.xyz.col + '_level_' + feature.xyz.level + '_x_' + f.sourceAngleData[0][0][0] + '_y_' + f.sourceAngleData[0][0][1];
              } //用于拾取的id


              f.id = Math.round(Math.random() * 256 * 256 * 256);
              f.layerName = feature.layerName; //获取注记的中心点

              if (f.lineType == 'text') {
                var centerIndex = Math.floor(f.datas.length / 2);
                f.centerPoint = f.datas[centerIndex][0];
              } //获取注记的中心点


              if (f.lineType == 'code') {
                f.centerPoint = f.datas[0][0];
              }
            }

            return features;
          }
        }, {
          key: "getLocalLabelDatas",

          /**
           * 获取localDataSource中在当前屏幕范围内的注记要素
           */
          value: function getLocalLabelDatas () {
            var localFeatures = [];

            for (var i = 0; i < this.dataSource.length; i++) {
              var ds = this.dataSource[i];

              if (ds.type == 'LocalDataSource') {
                for (var j = 0; j < ds.features.length; j++) {
                  var feature = ds.features[j];

                  if (feature.latlngData.length == 0) {
                    feature.latlngData = feature.sourceData;
                    feature.weight = feature.style.avoidWeight;
                  } //找出在当前视口内的要素


                  if (feature.inBounds(this.extent)) {
                    feature.attributeId = feature.attributes['attributeId'];
                    feature.primaryId = feature.attributeId;

                    if (feature.type == 1) {
                      //转换要素的地理坐标为屏幕坐标
                      feature.sourceAngleData = [[feature.sourceData, 0]];
                      feature.transformData(this.extent, this.res);
                      feature.label = feature.getFeatureLabel(); // feature.textures = ds.textures;

                      feature.iconImg = ds.textures[feature.style.texture];
                      localFeatures.push(feature);
                    }

                    if (feature.type == 2) {
                      feature.label = feature.getFeatureLabel();
                      feature.transformData(this.extent, this.res);
                      feature.textures = ds.textures;
                      var tempLineFeature = this.cutLineFeature(feature, true);

                      for (var temp = 0; temp < tempLineFeature.length; temp++) {
                        tempLineFeature[temp].style = feature.style;
                      }

                      localFeatures = localFeatures.concat(tempLineFeature);
                    }
                  }
                }
              }
            }

            return localFeatures;
          }
        }, {
          key: "getRequestTileUrls",

          /**
           * 计算需要请求的瓦片的url
           * Parameters :
           * requestTiles - 需要请求的瓦片层行列号集合
           */
          value: function getRequestTileUrls (grid) {
            this.hitCacheUrls = [];
            this.currentTileDatas = [];
            this.defaultStyeTileDatas = []; //本次需要请求的url

            var requestTileUrls = {}; //请求队列中找到的url集合

            var findedRequestUrls = {};

            for (var i = 0; i < this.dataSource.length; i++) {
              var dataSource = this.dataSource[i]; //url数据源

              if (dataSource.type == 'URLDataSource') {
                var url = dataSource.url;

                for (var j = 0; j < grid.length; j++) {
                  var item = grid[j];
                  var tileUrl = url.replace('${x}', item.col).replace('{x}', item.col);
                  tileUrl = tileUrl.replace('${y}', item.row).replace('{y}', item.row);
                  tileUrl = tileUrl.replace('${z}', item.level).replace('{z}', item.level); //多域名url

                  if (dataSource.urlArray.length > 0) {
                    var len = dataSource.urlArray.length - 1;
                    var index = Math.round(Math.random() * len);
                    var domainUrl = dataSource.urlArray[index];
                    var array = tileUrl.split('/mapserver');
                    var partUrl = array[1];
                    tileUrl = domainUrl + '/mapserver' + partUrl;
                  } //判断缓存中有没有该注记


                  var cacheItem = this.cache.getItem(tileUrl);

                  if (cacheItem) {
                    this.hitCacheUrls.push({
                      url: tileUrl,
                      isDefaultStyle: dataSource.styleId == '_default__'
                    });
                  } else {
                    //已经发送的请求队列中找,队列中没找到的需要发送请求
                    if (!this.requestingTiles[tileUrl]) {
                      requestTileUrls[tileUrl] = {
                        url: tileUrl,
                        xyz: item,
                        dataSourceId: dataSource.id,
                        dataType: dataSource.newEngine ? 'arraybuffer' : "json"
                      };
                    } else {
                      findedRequestUrls[tileUrl] = true;
                    }
                  }
                }
              }
            } // console.log('total count  =================' + grid.length);
            //关闭上次不需要的请求


            this.cancelRequest(findedRequestUrls);
            return requestTileUrls;
          }
        }, {
          key: "cancelRequest",

          /**
           * 取消上次不需要的请求
           * Parameters :
           * findedRequestUrls - 请求队列中找到的url集合
           */
          value: function cancelRequest (findedRequestUrls) {
            for (var tileUrl in this.requestingTiles) {
              if (!findedRequestUrls[tileUrl]) {
                var requestTile = this.requestingTiles[tileUrl];
                delete this.requestingTiles[tileUrl];
                requestTile.xhr.abort();
                requestTile.requestItem.cancel = true;
              }
            }
          }
        }, {
          key: "sendRequest",

          /**
           * 发送请求，取注记瓦片数据
           * Parameters :
           * requestTileUrls - 需要请求的瓦片url集合
           */
          value: function sendRequest (requestTileUrls) {
            var count = 0;

            for (var url in requestTileUrls) {
              var item = requestTileUrls[url];
              var promise = null;

              if (item.dataType == "json") {
                promise = Object(_utils_es6_promise__WEBPACK_IMPORTED_MODULE_2__[/* getParamJSON */ "d"])(item);
              } else if (item.dataType == "arraybuffer") {
                promise = Object(_utils_es6_promise__WEBPACK_IMPORTED_MODULE_2__[/* getBufferData */ "b"])(item);
              }

              this.requestingTiles[item.url] = {
                xhr: promise.xhr,
                requestItem: item
              };
              promise.then(this.tileSuccessFunction.bind(this), this.tileFailFunction.bind(this));
              count++;
            } // console.log('sendRequest count ==============='+count);


            if (count == 0) {
              this.sendSuccess([], []);
            }
          }
        }, {
          key: "toBuffer",
          value: function toBuffer (ab) {
            var buf = new Buffer(ab.byteLength);
            var view = new Uint8Array(ab);

            for (var i = 0; i < buf.length; ++i) {
              buf[i] = view[i];
            }

            return buf;
          }
        }, {
          key: "tileSuccessFunction",

          /**
           * 单个瓦片注记请求成功的回调
           */
          value: function tileSuccessFunction (data) {
            if (data.param.cancel == true || this.isEmptyObject(this.requestingTiles)) {
              //请求取消失败的，直接返回
              return;
            } //var buf = Buffer.from(data.data);        
            // var buf = this.toBuffer(data.data);
            // if (buf.length > 0) {
            //     var vant = new VarintReader(buf, 4);
            //     var layerNameArr = vant.getAllLayerNames();
            // }
            // return;


            var url = data.param.url; //删除正在请求的url

            delete this.requestingTiles[url];
            var dataSourceId = data.param.dataSourceId;
            var dataSource = this.getDataSourceById(dataSourceId);
            var features = null;

            if (dataSource && dataSource.newEngine) {
              var buf = this.toBuffer(data.data);
              var dataObj = {
                param: data.param,
                tileData: {}
              };

              if (buf.byteLength > 0) {
                var vant = new _VarintReader__WEBPACK_IMPORTED_MODULE_9__[/* default */ "a"](buf, 4, dataSource.layerFieldMap);
                var layerNameArr = vant.getAllLayerNames();

                for (var i = 0; i < layerNameArr.length; i++) {
                  if (layerNameArr[i].indexOf("layerAvoids_") > -1) {
                    dataObj.tileData[layerNameArr[i]] = {
                      geometryType: vant.getGeometryType(layerNameArr[i]),
                      props: vant.getAllCoordinates(layerNameArr[i], 10)
                    };
                  } else {
                    dataObj.tileData[layerNameArr[i]] = {
                      geometryType: vant.getGeometryType(layerNameArr[i]),
                      props: vant.getLayerPro(layerNameArr[i])
                    };
                  }
                }

                dataObj["vant"] = vant;
              }

              features = this.parseFeature(dataObj, dataSource);
            } else {
              features = this.parseFeature(data, dataSource);
            }

            var labelFeatures = [];

            if (features.styleId == null) {
              this.currentTileDatas.push({
                url: url,
                labelFeatures: [],
                avoidLineFeatures: features.avoidLineFeatures
              });
              return;
            }

            if (features.styleId == '_default__') {
              _avoid_ParseLabelData__WEBPACK_IMPORTED_MODULE_6__[/* default */ "a"].updateFeatureAttr(features.pointFeatures, this.styleMap, this.ratio, {}, true, this.maxExtent, this.extent, this.res, this.tileSize);
              labelFeatures = labelFeatures.concat(features.lineFeatures);
              labelFeatures = labelFeatures.concat(features.pointFeatures);
              this.defaultStyeTileDatas.push({
                url: url,
                labelFeatures: labelFeatures,
                avoidLineFeatures: features.avoidLineFeatures
              });
            } else {
              //如果需要避让
              if (this.ableAvoid) {
                // console.time('fristFilter');
                //第一次格网过滤
                labelFeatures = _avoid_GridFilterLabel__WEBPACK_IMPORTED_MODULE_7__[/* default */ "a"].fristFilter(features.pointFeatures, features.lineFeatures, this.styleMap, this.ableWeight, true, this.tileSize, this.cellsize, this.tileSize * 1.0, this.maxPerCell); //第一次过滤后的点注记，设置更多的属性

                _avoid_ParseLabelData__WEBPACK_IMPORTED_MODULE_6__[/* default */ "a"].updateFeatureAttr(labelFeatures.pointFeatures, this.styleMap, this.ratio, dataSource.textures, true, this.maxExtent, this.extent, this.res, this.tileSize); // console.timeEnd('fristFilter');
                //第二次格网过滤
                // console.time('scendFilter');

                labelFeatures = _avoid_GridFilterLabel__WEBPACK_IMPORTED_MODULE_7__[/* default */ "a"].scendFilter(labelFeatures.pointFeatures, labelFeatures.lineFeatures, this.styleMap, this.ableWeight, true, this.tileSize, this.cellsize, this.tileSize * 1.0); // console.timeEnd('scendFilter');
                //设置boxs

                labelFeatures = this.GAnnoAvoid.GLabelBox.setBox(labelFeatures, this.styleMap, false); //第三次过滤去重

                labelFeatures = _avoid_GridFilterLabel__WEBPACK_IMPORTED_MODULE_7__[/* default */ "a"].threeFilter(labelFeatures, this.styleMap, this.tileSize); //console.log(labelFeatures);

                if (features.avoidLineFeatures.length > 0) {
                  // //设置boxs
                  // labelFeatures = this.GAnnoAvoid.GLabelBox.setBox(labelFeatures,this.styleMap,false);
                  labelFeatures = this.GAnnoAvoid.avoid(labelFeatures, this.styleMap, features.avoidLineFeatures);
                } // ParseLabelData.updateFeatureAttr(features.pointImportantFeatures,this.styleMap,this.ratio,dataSource.textures,
                //     true,this.maxExtent,this.extent,this.res,this.tileSize);

              } else {
                _avoid_ParseLabelData__WEBPACK_IMPORTED_MODULE_6__[/* default */ "a"].updateFeatureAttr(features.pointFeatures, this.styleMap, this.ratio, dataSource.textures, true, this.maxExtent, this.extent, this.res, this.tileSize); // ParseLabelData.updateFeatureAttr(features.pointImportantFeatures,this.styleMap,this.ratio,dataSource.textures,
                //     true,this.maxExtent,this.extent,this.res,this.tileSize);

                labelFeatures = features.pointFeatures.concat(features.lineFeatures);
              }

              this.currentTileDatas.push({
                url: url,
                labelFeatures: labelFeatures,
                avoidLineFeatures: features.avoidLineFeatures
              });
            } //如果所有的瓦片请求成功


            if (this.isEmptyObject(this.requestingTiles)) {
              this.sendSuccess(this.currentTileDatas, this.defaultStyeTileDatas);
            }
          }
        }, {
          key: "isEmptyObject",
          //判断map是否为空
          value: function isEmptyObject (e) {
            for (var t in e) {
              return !1;
            }

            return !0;
          }
        }, {
          key: "tileFailFunction",

          /**
           * 单个瓦片注记请求失败的回调
           */
          value: function tileFailFunction (data) {
            if (data.param.cancel == true || this.isEmptyObject(this.requestingTiles)) {
              //请求取消失败的，直接返回
              return;
            }

            var url = data.param.url;
            delete this.requestingTiles[url]; //如果所有的瓦片请求成功

            if (this.isEmptyObject(this.requestingTiles)) {
              this.sendSuccess(this.currentTileDatas, this.defaultStyeTileDatas);
            }
          }
        }, {
          key: "sendSuccess",

          /**
           * 请求成功的回调函数，没有请求url，也会执行该回调
           * Parameters :
           * results - 请求成功的结果
           */
          value: function sendSuccess (results, defaultStyleResult) {
            if (this.gwvtAnno.animating) {
              return;
            } //重置图层位置


            this.gwvtAnno.resetCanvasDiv();
            this.clean(); //保证当前屏幕内需要拾取的要素

            if (this.hitDetection) {
              this.features = [];
            }

            this.drawLabel(results);
            this.drawDefaultStyleLabel(defaultStyleResult);
          }
        }, {
          key: "drawDefaultStyleLabel",

          /**
           * 合并本地注记，绘制注记 (默认样式的注记)
           * Parameters :
           * results - 请求成功的结果
           */
          value: function drawDefaultStyleLabel (results) {
            //合并上次在当前视口范围内的注记要素(不包括本地要素)
            var mergeFeatures = this.mergeLabelData(results, this.hitCacheUrls, true);
            var labelFeatures = mergeFeatures.labelFeatures;

            for (var i = 0; i < results.length; i++) {
              var item = results[i];
              this.cache.push(item.url, item);
            } //保证当前屏幕内需要拾取的要素


            if (this.hitDetection) {
              for (var _i = 0; _i < labelFeatures.length; _i++) {
                var feature = labelFeatures[_i];
                this.features[feature.id] = feature;
              }
            } //绘制注记要素


            _avoid_GDrawGeomerty__WEBPACK_IMPORTED_MODULE_1__[/* default */ "a"].drawDefaultStyle(this.canvas, labelFeatures, this.styleMap, this.ratio, false, false, this.hitContext, this.hitDetection);
          }
          /**
           * 合并本地注记，注记避让，绘制注记
           * Parameters :
           * results - 请求成功的结果
           */

        }, {
          key: "drawLabel",
          value: function drawLabel (results) {
            //合并上次在当前视口范围内的注记要素(不包括本地要素)
            var mergeFeatures = this.mergeLabelData(results, this.hitCacheUrls, false);
            var labelFeatures = mergeFeatures.labelFeatures;

            for (var i = 0; i < results.length; i++) {
              var item = results[i];
              this.cache.push(item.url, item);
            } //获取localDataSource中在当前屏幕范围内的注记要素


            var localFeatures = this.getLocalLabelDatas();
            labelFeatures = labelFeatures.concat(localFeatures); //设置boxs

            labelFeatures = this.GAnnoAvoid.GLabelBox.setBox(labelFeatures, this.styleMap, true);
            var avoidlabelDatas = labelFeatures;

            if (this.ableAvoid) {
              avoidlabelDatas = this.GAnnoAvoid.defaultAvoid(labelFeatures, this.styleMap, true, this.hasImportant, this.ableWeight);
            } // this.drawAvoidLine(mergeFeatures.avoidLineFeatures);
            //保证当前屏幕内需要拾取的要素


            if (this.hitDetection) {
              for (var _i2 = 0; _i2 < avoidlabelDatas.length; _i2++) {
                var feature = avoidlabelDatas[_i2];
                this.features[feature.id] = feature;
              }
            } //绘制注记要素


            _avoid_GDrawGeomerty__WEBPACK_IMPORTED_MODULE_1__[/* default */ "a"].draw(this.canvas, avoidlabelDatas, this.styleMap, this.ratio, false, false, this.hitContext, this.hitDetection, false, this.debug); //绘制道路线
            // GDrawGeomerty.drawLines(this.canvas,avoidlabelDatas,this.styleMap,this.ratio,false,false,this.hitContext, this.hitDetection,this);
          }
        }, {
          key: "drawAvoidLine",
          value: function drawAvoidLine (avoidLineFeatures) {
            this.canvas.save();
            this.canvas.beginPath();

            for (var i = 0; i < avoidLineFeatures.length; i++) {
              var avoidLineFeature = avoidLineFeatures[i];
              this.canvas.lineWidth = 1;
              this.canvas.strokeStyle = "#fff000"; //画线

              this.canvas.moveTo(avoidLineFeature.datas[0], avoidLineFeature.datas[1]);

              for (var j = 1; j < avoidLineFeature.datas.length / 2; j++) {
                this.canvas.lineTo(avoidLineFeature.datas[j * 2], avoidLineFeature.datas[j * 2 + 1]);
              }
            }

            this.canvas.stroke();
            this.canvas.restore();
          }
        }, {
          key: "parseFeature",

          /**
           * 解析返回的注记信息
           * Parameters:
           * tileData - 请求返回的注记数据
           * Returns:
           * labelDatas - 设置过样式,坐标由瓦片内坐标转为屏幕坐标的注记数据
           */
          value: function parseFeature (tileData, dataSource) {
            var layers = {};

            if (dataSource && dataSource.newEngine) {
              var sTileDataObj = tileData.tileData;

              for (var key in sTileDataObj) {
                var layerAvoidIndex = key.indexOf("layerAvoids_");

                if (layerAvoidIndex > -1) {
                  var weight = key.substring(layerAvoidIndex + 12);

                  if (layers["_layerAvoids"]) {
                    layers["_layerAvoids"][weight] = sTileDataObj[key].props;
                  } else {
                    layers["_layerAvoids"] = {};
                    layers["_layerAvoids"][weight] = sTileDataObj[key].props;
                  }
                } else {
                  layers[key] = {
                    features: [],
                    fieldsConfig: dataSource.serverInfo[key] ? dataSource.serverInfo[key].fieldsConfig : {},
                    serverId: dataSource.servername,
                    type: 1
                  };

                  if (sTileDataObj[key].geometryType.toLowerCase() == "point") {
                    layers[key].type = 1;
                  } else if (sTileDataObj[key].geometryType.toLowerCase() == "line" || sTileDataObj[key].geometryType.toLowerCase() == "linestring" || sTileDataObj[key].geometryType.toLowerCase() == "multilinestring") {
                    layers[key].type = 2;
                  }

                  if (sTileDataObj[key].props && sTileDataObj[key].props.length > 0) {
                    for (var k = 0; k < sTileDataObj[key].props.length; k++) {
                      var tDataArr = [];
                      tDataArr.push(sTileDataObj[key].geometryType);
                      tDataArr.push(sTileDataObj[key].props[k]);
                      tDataArr.push(tileData.vant.getCoordinatesByIndex(key, k, 10));
                      layers[key].features.push(tDataArr);
                    }
                  }
                }
              }
            } else {
              layers = tileData.data;
            }

            var xyz = {
              x: tileData.param.xyz.col,
              y: tileData.param.xyz.row,
              l: tileData.param.xyz.level
            };
            var count = 0;

            for (var _key in layers) {
              var layerData = layers[_key];
              count++;
            }

            var features = {
              pointFeatures: [],
              lineFeatures: [],
              pointImportantFeatures: [],
              lineImportantFeatures: []
            };

            if (count > 0 && dataSource && dataSource.styleFun) {
              //设置样式
              var itemDatas = [];
              var level = xyz.l;

              if (dataSource.newEngine) {
                var render = new _LabelDrawer__WEBPACK_IMPORTED_MODULE_4__[/* default */ "a"](layers, this.styleMap, level, dataSource.foreendFont);
                dataSource.styleFun.call({}, render, level);
              } else {
                var drawer = new _LabelDrawer__WEBPACK_IMPORTED_MODULE_4__[/* default */ "a"](layers, this.styleMap, level, dataSource.foreendFont);
                dataSource.styleFun.call({}, drawer, level);
              } //转换瓦片坐标为屏幕坐标,并构造label数据


              features = _avoid_ParseLabelData__WEBPACK_IMPORTED_MODULE_6__[/* default */ "a"].parseLayerDatas(layers, this.styleMap, xyz, true, this.maxExtent, this.extent, this.res, this.tileSize);
            }

            var avoidLineFeatures = _avoid_ParseLabelData__WEBPACK_IMPORTED_MODULE_6__[/* default */ "a"].parseAvoidLine(layers['_layerAvoids'], xyz, true, this.maxExtent, this.extent, this.res, this.tileSize);
            var pointFeatures = _avoid_GridFilterLabel__WEBPACK_IMPORTED_MODULE_7__[/* default */ "a"].removeTileOutPointFeatures(features.pointFeatures, this.tileSize); // let lineFeatures = GridFilterLabel.removeTileOutLineFeatures(features.lineFeatures,this.tileSize);

            var lineFeatures = features.lineFeatures;
            var styleId = dataSource ? dataSource.styleId : null;
            return {
              styleId: styleId,
              pointFeatures: pointFeatures,
              lineFeatures: lineFeatures,
              avoidLineFeatures: avoidLineFeatures
            };
          }
        }, {
          key: "setGlobalStyle",
          value: function setGlobalStyle (globalStyle) {
            this.ableAvoid = !globalStyle.disableAvoid;
            this.ableWeight = !globalStyle.disableWeight;
            this.boxDistance = globalStyle.boxDistance;
          }
          /**
           * 将本次请求的注记数据和上次在本视口范围内的要素合并
           * Returns:
           * labelDatas - 合并后的注记数据，当前视口整个屏幕的数据
           */

        }, {
          key: "mergeLabelData",
          value: function mergeLabelData (results, hitCacheUrls, isDefaultStyle) {
            var labelFeatures = [];
            var avoidLineFeatures = [];

            for (var j = 0; j < results.length; j++) {
              var result = results[j];
              labelFeatures = labelFeatures.concat(result.labelFeatures);
              avoidLineFeatures = avoidLineFeatures.concat(result.avoidLineFeatures);
            }

            var urls = [];

            for (var m = 0; m < hitCacheUrls.length; m++) {
              var item = hitCacheUrls[m];

              if (item.isDefaultStyle == isDefaultStyle) {
                urls.push(item.url);
              }
            }

            for (var i = 0; i < urls.length; i++) {
              var cacheLabelFeatures = this.cache.getItem(urls[i]).labelFeatures;

              for (var _j = 0; _j < cacheLabelFeatures.length; _j++) {
                var labelFeature = cacheLabelFeatures[_j]; //重新计算当前屏幕坐标

                labelFeature.datas = _avoid_ParseLabelData__WEBPACK_IMPORTED_MODULE_6__[/* default */ "a"].transformData(labelFeature.sourceAngleData, labelFeature.xyz, this.maxExtent, this.extent, this.res, this.tileSize);
              }

              labelFeatures = labelFeatures.concat(cacheLabelFeatures);
              var cacheAvoidLineFeatures = this.cache.getItem(urls[i]).avoidLineFeatures;

              for (var _j2 = 0; _j2 < cacheAvoidLineFeatures.length; _j2++) {
                var avoidLineFeature = cacheAvoidLineFeatures[_j2]; //重新计算当前屏幕坐标

                avoidLineFeature.datas = _avoid_ParseLabelData__WEBPACK_IMPORTED_MODULE_6__[/* default */ "a"].transformAvoidLine(avoidLineFeature.sourceDatas, avoidLineFeature.xyz, this.maxExtent, this.extent, this.res, this.tileSize);
              }

              avoidLineFeatures = avoidLineFeatures.concat(cacheAvoidLineFeatures);
            }

            return {
              labelFeatures: labelFeatures,
              avoidLineFeatures: avoidLineFeatures
            };
          }
        }, {
          key: "getFeatureByXY",

          /**
           * 根据屏幕坐标获取feature
           * Parameters :
           * x
           * y
           */
          value: function getFeatureByXY (x, y, callback) {
            var feature = null;

            if (this.hitDetection) {
              var featureId;
              var data = this.hitContext.getImageData(x, y, 1, 1).data;

              if (data[3] === 255) {
                // antialiased
                var id = data[2] + 256 * (data[1] + 256 * data[0]);

                if (id) {
                  featureId = id - 1;

                  try {
                    feature = this.features[featureId];
                    callback && callback(feature);
                  } catch (err) {
                    console.log(err);
                  }
                }
              }
            }

            return feature;
          }
          /**
           * 根据屏幕坐标获取feature, 可以拾取叠加的注记，效率比getFeatureByXY低
           * Parameters :
           * x
           * y
           */

        }, {
          key: "getFeaturesByXY",
          value: function getFeaturesByXY (x, y) {
            var pickFeatures = [];

            for (var key in this.features) {
              var feature = this.features[key];

              if (feature.type == 1) {
                if (this.isInBox(x, y, feature.box)) {
                  pickFeatures.push(feature);
                  continue;
                }
              }

              if (feature.type == 2) {
                for (var j = 0; j < feature.boxs.length; j++) {
                  var box = feature.boxs[j];

                  if (this.isInBox(x, y, box)) {
                    pickFeatures.push(feature);
                    break;
                  }
                }
              }
            }

            return pickFeatures;
          }
          /**
           * 将线注记原始坐标带点和角度的格式，和切过的线的格式一致（针对默认样式的线主机）
           * Parameters:
           * line - 线注记原始数据
           * Returns:
           */

        }, {
          key: "lineToSourceAngleData",
          value: function lineToSourceAngleData (line) {
            var sourceAngleData = [];

            for (var i = 0; i < line.length; i++) {
              var x = line[i];
              var y = line[i + 1];
              sourceAngleData.push([[x, y], 0]);
              i++;
            }

            return sourceAngleData;
          }
        }, {
          key: "transformData",

          /**
           * 将瓦片内坐标转换为当前屏幕坐标
           * Parameters:
           * points - 瓦片内坐标数组,item示例：[[12,20],0] [12,20]为点坐标，0为旋转的角度
           * xyz - 瓦片的层行列号
           * Returns:
           * rdata - 本地屏幕内坐标数组
           */
          value: function transformData (points, xyz) {
            //取出当前视口左上角的地理坐标
            var left = this.extent[0];
            var top = this.extent[3]; //地图最大的范围

            var mLeft = this.maxExtent[0];
            var mTop = this.maxExtent[3]; //计算坐上角的屏幕坐标

            var x = (left - mLeft) / this.res;
            var y = (mTop - top) / this.res;
            var rPoint = [];

            for (var i = 0; i < points.length; i++) {
              var point = points[i][0];
              var gx = point[0] + xyz.x * this.tileSize;
              var gy = point[1] + xyz.y * this.tileSize;
              var p = [gx - x, gy - y];
              rPoint.push([p, points[i][1]]);
            }

            return rPoint;
          }
        }, {
          key: "isInBox",
          value: function isInBox (x, y, box) {
            if (x > box[0] && x < box[2] && y > box[1] && y < box[3]) {
              return true;
            }

            return false;
          }
        }, {
          key: "highlightLabel",

          /**
           * 高亮指定的注记
           * Parameters :
           * featrueIds 需要高亮的注记id数组
           * lightColor 注记高亮的填充色
           */
          value: function highlightLabel (featrueIds, lightColor) {
            for (var key in this.highlightLabels) {
              var feature = this.highlightLabels[key];
              delete feature['lightColor'];
            }

            this.highlightLabels = {};

            for (var i = 0; i < featrueIds.length; i++) {
              var id = featrueIds[i];
              var _feature = this.features[id];
              _feature.lightColor = lightColor;
              this.highlightLabels[id] = _feature;
            }
          }
        }]);

        return CanvasLayer;
      }();

/* harmony default export */ __webpack_exports__["a"] = (CanvasLayer);
      /* WEBPACK VAR INJECTION */
    }.call(this, __webpack_require__(15).Buffer))

    /***/
  }),
/* 29 */
/***/ (function (module, __webpack_exports__, __webpack_require__) {

    "use strict";
    function _classCallCheck (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    function _defineProperties (target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

    function _createClass (Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

    /**
     * Created by kongjian on 2018/6/12.
     * 注记瓦片队列缓存工具类
     */
    var Cache = /*#__PURE__*/function () {
      function Cache (size) {
        _classCallCheck(this, Cache);

        this.size = size;
        this.map = {};
        this.list = [];
      } //往缓存中加入数据


      _createClass(Cache, [{
        key: "push",
        value: function push (key, item) {
          if (this.list.length > this.size - 1) {
            var removeKey = this.list.shift();
            delete this.map[removeKey];
          }

          this.list.push(key);
          this.map[key] = item;
        } //获取缓存数据

      }, {
        key: "getItem",
        value: function getItem (key) {
          return this.map[key];
        } //清空缓存

      }, {
        key: "clean",
        value: function clean () {
          this.map = {};
          this.list = [];
        } //获取缓存的长度

      }, {
        key: "length",
        value: function length () {
          return this.list.length;
        }
      }]);

      return Cache;
    }();

/* harmony default export */ __webpack_exports__["a"] = (Cache);

    /***/
  }),
/* 30 */
/***/ (function (module, __webpack_exports__, __webpack_require__) {

    "use strict";
/* harmony import */ var snappyjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(21);
/* harmony import */ var snappyjs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(snappyjs__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _CodeTool__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(19);
/* harmony import */ var _LayerContentModel__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(31);
/* harmony import */ var _utils_gistools_GisTools__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(5);
    function _toConsumableArray (arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

    function _nonIterableSpread () { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

    function _unsupportedIterableToArray (o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

    function _iterableToArray (iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

    function _arrayWithoutHoles (arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

    function _arrayLikeToArray (arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

    function _classCallCheck (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    function _defineProperties (target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

    function _createClass (Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }





    /**
     * 瓦片数据解析
     */

    var VarintReader = /*#__PURE__*/function () {
      /**
       * 构造函数
       * @param vectorVarintBuffer {Buffer} vector或layer格式buffer
       * @param headerLength {number} 数据头长度
       * @param proSizeObj {Object} 要素属性数量
       */
      function VarintReader (vectorVarintBuffer, headerLength, proSizeObj) {
        _classCallCheck(this, VarintReader);

        //缩进长度
        this.headerLength = headerLength; //要素属性数量

        this.proSizeObj = proSizeObj; //数字类型的byte长度

        this.intLength = 4; //瓦片数据的标识

        this.vectorName = "vector"; //空间类型的key

        this.gTypeKey = "gType"; //字符串编码

        this.encoding = "utf8"; //要素属性间隔

        this.featureSpace = "#@"; //瓦片buffer

        this.vectorVarintBuffer = vectorVarintBuffer; //图层buffer

        this.layerMap = new Object(); //瓦片头带有的属性

        this.vectorHeaderProMap = new Object(); //图层头带的属性

        this.layerHeaderProMap = new Object();
        this.layerHeaderProBuffer = new Object(); //图层的空间数据类型

        this.geometyTypeMap = new Object(); //图层要素

        this.featureMap = new Object();
        this.featureArrayMap = new Object(); //图层坐标索引buffer

        this.offsetBufferMap = new Object(); //图层坐标索引数组

        this.offsetArrayMap = new Object(); //图层坐标

        this.varintMap = new Object();

        this._parseVector(vectorVarintBuffer);
      }
      /**
       * 获取vector的头属性
       * @returns {Object}
       */


      _createClass(VarintReader, [{
        key: "getVectorHeaderProMap",
        value: function getVectorHeaderProMap () {
          return this.vectorHeaderProMap;
        }
        /**
         * 获取layer的头属性
         * @returns {Object}
         */

      }, {
        key: "getLayerHeaderProMap",
        value: function getLayerHeaderProMap () {
          return this.layerHeaderProMap;
        }
        /**
         * 获得图层varint编码buffer
         * @param layerName {string}
         * @returns {Buffer}
         */

      }, {
        key: "getLayerBuffer",
        value: function getLayerBuffer (layerName) {
          return this.layerMap[layerName];
        }
        /**
         * 通过要素过滤对应的buffer
         * @param layerName {string}图层名称
         * @param featureIndexArray {[number]}选择的要素数组下标
         * @returns {LayerContentModel}
         */

      }, {
        key: "getLayerProByFilter",
        value: function getLayerProByFilter (layerName, featureIndexArray) {
          var coordinateBufferArray = [];
          var offsetArray = this.offsetArrayMap[layerName];

          var featureArray = this._lazyParseFeature(layerName);

          var filterArray = [];
          var idx;
          var offset;
          var length;
          var proSize = this.proSizeObj[layerName];

          for (var i = 0; i < featureIndexArray.length; i++) {
            idx = featureIndexArray[i]; //挑选要素

            filterArray.push.apply(filterArray, _toConsumableArray(featureArray[idx])); //挑选要素对应的坐标索引

            offset = offsetArray[idx * 2];
            length = offsetArray[idx * 2 + 1];
            coordinateBufferArray.push(this.varintMap[layerName].slice(offset, offset + length));
          }

          var model = new _LayerContentModel__WEBPACK_IMPORTED_MODULE_2__[/* default */ "a"]();
          model.setLayerHeaderProBuffer(this.layerHeaderProBuffer[layerName]);
          model.setFeatureArray(filterArray);
          model.setCoordinateBufferArray(coordinateBufferArray);
          return model;
        }
        /**
         * 获得图层名称数组
         * @returns {[图层名称1， 图层名称2， ...]}
         */

      }, {
        key: "getAllLayerNames",
        value: function getAllLayerNames () {
          var layerNames = [];

          for (var value in this.layerMap) {
            layerNames.push(value);
          }

          return layerNames;
        }
        /**
         * 图层的空间类型
         * @param {string} layerName
         * @returns {any}
         */

      }, {
        key: "getGeometryType",
        value: function getGeometryType (layerName) {
          return this.geometyTypeMap[layerName];
        }
        /**
         * 获取指定的图层要素属性
         * @param layerName {string} 图层名称
         * @param featureIndex {number}要素数组的下标
         * @returns {*|string[]}
         */

      }, {
        key: "getLayerProByIndex",
        value: function getLayerProByIndex (layerName, featureIndex) {
          var featureArray = this._lazyParseFeature(layerName);

          return featureArray[featureIndex];
        }
        /**
         * 图层的属性信息
         * @param layerName {string}图层名称
         * @returns {[属性数组]}
         */

      }, {
        key: "getLayerPro",
        value: function getLayerPro (layerName) {
          return this._lazyParseFeature(layerName);
        }
        /**
         * 获得图层所有坐标数组的偏移量数组
         * @param layerName {string}图层名称
         * @returns {[number]} [属性1字节开始位置，属性1坐标字节长度 ,属性2字节开始位置，属性2坐标字节长度 ,....]
         */

      }, {
        key: "getOffsetArray",
        value: function getOffsetArray (layerName) {
          return this.offsetArrayMap[layerName];
        }
        /**
         * 获得图层某个属性的坐标偏移量数组
         * @param layerName {string}图层名称
         * @param featureIndex {number} 要素所在数组的位置
         * @returns {[属性字节开始位置，属性坐标字节长度]}
         */

      }, {
        key: "getOffsetByIndex",
        value: function getOffsetByIndex (layerName, featureIndex) {
          var all = this.offsetArrayMap[layerName];
          var arr = [];
          arr.push(all[featureIndex * 2]);
          arr.push(all[featureIndex * 2 + 1]);
          return arr;
        }
        /**
         * 获得图层的所有坐标字节
         * @param layerName {string}图层名称
         * @returns {Buffer}
         */

      }, {
        key: "getLayerCoordinate",
        value: function getLayerCoordinate (layerName) {
          return this.varintMap[layerName];
        }
        /**
         * 获得要素
         * @param layerName {string}图层名称
         * @returns {[object]} [要素属性数组， 坐标偏移量， 坐标varint数组]
         */

      }, {
        key: "getLayerFeature",
        value: function getLayerFeature (layerName) {
          return [this.featureMap[layerName], this.offsetArrayMap[layerName], this.varintMap[layerName]];
        }
        /**
         * 图层所有数字坐标
         * @param layerName {string} 图层名称
         * @param precision {number} 数字精度
         * @returns {[[number]]} [[要素1坐标],[要素2坐标],...]
         */

      }, {
        key: "getAllCoordinates",
        value: function getAllCoordinates (layerName, precision) {
          var ofs = this.offsetArrayMap[layerName];
          var buffer = this.varintMap[layerName];
          var coorArray = [];
          var offset;
          var length;
          var bf;

          for (var i = 0; i < ofs.length / 2; i++) {
            offset = ofs[i * 2];
            length = ofs[i * 2 + 1];
            bf = buffer.slice(offset, offset + length);
            coorArray.push(this._bufferToDoubleArray(bf, precision)[0]);
          }

          return coorArray;
        }
        /**
         * 图层某个要素的数字坐标
         * @param layerName {string}图层名称
         * @param proIndex {[number]} 属性所在数组的位置
         * @param precision {number} 数字精度
         * @returns {[number]} 要素坐标
         */

      }, {
        key: "getCoordinatesByIndex",
        value: function getCoordinatesByIndex (layerName, proIndex, precision) {
          var ofs = this.getOffsetByIndex(layerName, proIndex);
          var buffer = this.varintMap[layerName];
          var offset = ofs[0];
          var length = ofs[1];
          var bf = buffer.slice(offset, offset + length);
          return this._bufferToDoubleArray(bf, precision)[0];
        }
        /**
         * 解析瓦片数据
         * @param vectorVarintBuffer {Buffer} varint编码Buffer
         * @private
         */

      }, {
        key: "_parseVector",
        value: function _parseVector (vectorVarintBuffer) {
          //读取geometry类型的字节长度
          var offset = this.headerLength;
          var typeLength = vectorVarintBuffer.readInt32BE(offset);
          offset = offset + this.intLength; //读取数据类型。vector是多图层结构；其它geometry类型的为单图层结构

          var type = vectorVarintBuffer.slice(offset, offset + typeLength).toString("utf-8");
          offset = offset + typeLength;

          if (type !== this.vectorName) {
            console.error("不是瓦片数据！");
            return;
          } //读取vector头属性


          var array = this._parseHeaderPro(vectorVarintBuffer, offset);

          offset = array[0];
          this.vectorHeaderProMap = array[1]; //读取坐标数据索引字节开始位置

          var indexLength = vectorVarintBuffer.readInt32BE(offset); //截取index表述字节

          offset = offset + this.intLength;
          var indexBuffer = vectorVarintBuffer.slice(offset, offset + indexLength); //截取数字字节

          offset = offset + indexLength;
          var dataBuffer = vectorVarintBuffer.slice(offset, this.vectorVarintBuffer.length);
          var layerNameLength = 0;
          var layerName;
          var dataLength;
          var dataBegin = 0;
          var begin = 0;
          var end = 0;
          var layerBuffer;

          for (var i = 0; i < indexBuffer.length;) {
            begin = i;
            layerNameLength = indexBuffer.readInt32BE(begin);
            begin = begin + this.intLength;
            end = begin + layerNameLength;
            layerName = indexBuffer.toString(this.encoding, begin, end);
            begin = end;
            dataLength = indexBuffer.readInt32BE(begin);
            begin = begin + this.intLength; //截取每个layer的坐标字节段

            layerBuffer = dataBuffer.slice(dataBegin, dataBegin + dataLength);
            dataBegin = dataBegin + dataLength;
            this.layerMap[layerName] = layerBuffer;

            this._parseLayer(layerName, layerBuffer);

            i = begin;
          }
        }
        /**
         * 解析图层Buffer
         * @param layerName 图层名
         * @param buffer varint编码Buffer
         * @private
         */

      }, {
        key: "_parseLayer",
        value: function _parseLayer (layerName, layerBuffer) {
          if (layerBuffer.length === 0) {
            return;
          }

          var offset = this.headerLength; //读取layer头属性

          var array = this._parseHeaderPro(layerBuffer, offset);

          offset = array[0];
          this.layerHeaderProMap[layerName] = array[1];
          this.layerHeaderProBuffer[layerName] = array[2]; //读取空间类型

          var geometrytype = this.layerHeaderProMap[layerName][this.gTypeKey];
          this.geometyTypeMap[layerName] = geometrytype; //要素数组

          var featureLength = layerBuffer.readInt32BE(offset);
          offset = offset + this.intLength;
          var featureBuffer = layerBuffer.slice(offset, offset + featureLength);
          featureBuffer = snappyjs__WEBPACK_IMPORTED_MODULE_0___default.a.uncompress(featureBuffer);
          offset = offset + featureLength;
          this.featureMap[layerName] = featureBuffer; //读取偏移量数组

          var indexRes = this._parseIndex(layerBuffer, offset);

          offset = indexRes.offset;
          this.offsetBufferMap[layerName] = indexRes.buffer;
          this.offsetArrayMap[layerName] = indexRes.array; //读取坐标

          var varintBuf = layerBuffer.slice(offset);
          this.varintMap[layerName] = varintBuf;
        }
        /**
         * 解析头属性
         * @param varintBuffer
         * @param offset
         * @returns {(*|Map<any, any>)[]}
         * @private
         */

      }, {
        key: "_parseHeaderPro",
        value: function _parseHeaderPro (varintBuffer, offset) {
          var proMap = new Object();
          var headerProLength = varintBuffer.readInt32BE(offset);
          offset = offset + this.intLength;
          var headerProBuffer = varintBuffer.slice(offset, offset + headerProLength);
          offset = offset + headerProLength;

          if (headerProLength == 0) {
            return [offset, proMap];
          }

          var headerProArray = _utils_gistools_GisTools__WEBPACK_IMPORTED_MODULE_3__[/* default */ "a"].Utf8ArrayToStr(snappyjs__WEBPACK_IMPORTED_MODULE_0___default.a.uncompress(headerProBuffer)).split(":");

          for (var i = 0; i < headerProArray.length / 2; i++) {
            proMap[headerProArray[i * 2]] = headerProArray[i * 2 + 1];
          }

          return [offset, proMap, headerProBuffer];
        }
        /**
         * 解析偏移量数组
         * @param layerBuffer
         * @param offset
         * @returns {{offset: *, array: *[], buffer: *}}
         * @private
         */

      }, {
        key: "_parseIndex",
        value: function _parseIndex (layerBuffer, offset) {
          //读取偏移量数组长度
          var length = layerBuffer.readInt32BE(offset);
          offset = offset + this.intLength; //截取出偏移量数组

          var buffer = layerBuffer.slice(offset, offset + length);
          offset = offset + length; //把varint编码的byte流转换为数组

          var array = _CodeTool__WEBPACK_IMPORTED_MODULE_1__[/* default */ "a"].varintToIntArray(buffer);
          return {
            "offset": offset,
            "buffer": buffer,
            "array": array
          };
        }
      }, {
        key: "_lazyParseFeature",
        value: function _lazyParseFeature (layerName) {
          var featureArray = this.featureArrayMap[layerName];
          var proSize = this.proSizeObj[layerName];

          if (featureArray == undefined) {
            var buffer = this.featureMap[layerName];
            var props = [];

            if (buffer.length > 0) {
              props = _utils_gistools_GisTools__WEBPACK_IMPORTED_MODULE_3__[/* default */ "a"].Utf8ArrayToStr(this.featureMap[layerName]).split(this.featureSpace);
            } else {
              this.featureArrayMap[layerName] = [];
              return [];
            }

            var item = [];
            var length = (props.length - 1) / proSize;
            featureArray = [];
            var current = 0;
            var next = current;

            for (var i = 0; i < length; i++) {
              next = current + proSize;
              item = props.slice(current, next);
              featureArray.push(item);
              current = next;
            }

            this.featureArrayMap[layerName] = featureArray;
          }

          return featureArray;
        }
        /**
         * varint坐标转数字坐标
         * @param buffer varint字节数组
         * @param precision 数字精度
         * @returns {[number]} 数字坐标
         * @private
         */

      }, {
        key: "_bufferToDoubleArray",
        value: function _bufferToDoubleArray (buffer, precision) {
          var varintCode = [];
          var path = [];
          var high;
          var bf_index = 0;
          var nums = [];
          var oldX = 0;
          var oldY = 0;
          var x;
          var y;
          var isX = true; //多循环一次处理最后一段数据

          for (var i = 0; i <= buffer.length; i++) {
            //buffer.length
            high = 0x00000000 | buffer[i] >> 7 & 0x01;

            if (high === 0 && bf_index > 0) {
              if (bf_index > 0 && bf_index <= 5) {
                if (isX) {
                  x = _CodeTool__WEBPACK_IMPORTED_MODULE_1__[/* default */ "a"].varintToInt(varintCode) + oldX;
                  path.push(x / precision);
                  isX = false;
                  oldX = x;
                } else {
                  y = _CodeTool__WEBPACK_IMPORTED_MODULE_1__[/* default */ "a"].varintToInt(varintCode) + oldY;
                  path.push(y / precision);
                  isX = true;
                  oldY = y;
                }

                bf_index = 0;
                varintCode = [];
              } else if (bf_index > 5) {
                //bf_index > 5为间隔符
                oldX = 0;
                oldY = 0;
                bf_index = 0;
                varintCode = [];
                nums.push(path);
                path = [];
              }
            }

            if (i !== buffer.length) {
              varintCode.push(buffer[i]);
              bf_index++;
            } else {
              if (path.length > 0) {
                nums.push(path);
              }
            }
          }

          return nums;
        }
      }]);

      return VarintReader;
    }();

/* harmony default export */ __webpack_exports__["a"] = (VarintReader);

    /***/
  }),
/* 31 */
/***/ (function (module, __webpack_exports__, __webpack_require__) {

    "use strict";
/* WEBPACK VAR INJECTION */(function (Buffer) {
      function _classCallCheck (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

      function _defineProperties (target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

      function _createClass (Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

      var LayerContentModel = /*#__PURE__*/function () {
        function LayerContentModel () {
          _classCallCheck(this, LayerContentModel);

          this.layerHeaderProBuffer = Buffer.alloc(0);
          this.coordinateBufferArray = [];
          this.featureArray = [];
        }
        /**
         * 获取头属性
         * @returns {Buffer}
         */


        _createClass(LayerContentModel, [{
          key: "getLayerHeaderProBuffer",
          value: function getLayerHeaderProBuffer () {
            return this.layerHeaderProBuffer;
          }
          /**
           * 设置头属性
           * @param headerProMap {Buffer}
           */

        }, {
          key: "setLayerHeaderProBuffer",
          value: function setLayerHeaderProBuffer (layerHeaderProBuffer) {
            this.layerHeaderProBuffer = layerHeaderProBuffer;
          }
          /**
           * 获得要素buffer数组
           * @returns {[Buffer]}
           */

        }, {
          key: "getFeatureArray",
          value: function getFeatureArray () {
            return this.featureArray;
          }
          /**
           * 设置要素buffer数组
           * @param featureArray {[Buffer]}
           */

        }, {
          key: "setFeatureArray",
          value: function setFeatureArray (featureArray) {
            this.featureArray = featureArray;
          }
          /**
           * 获得坐标buffer数组
           * @returns {[Buffer]}
           */

        }, {
          key: "getCoordinateBufferArray",
          value: function getCoordinateBufferArray () {
            return this.coordinateBufferArray;
          }
          /**
           * 设置坐标buffer数组
           * @param coordinateBufferArray {[Buffer]}
           */

        }, {
          key: "setCoordinateBufferArray",
          value: function setCoordinateBufferArray (coordinateBufferArray) {
            this.coordinateBufferArray = coordinateBufferArray;
          }
        }]);

        return LayerContentModel;
      }();

/* harmony default export */ __webpack_exports__["a"] = (LayerContentModel);
      /* WEBPACK VAR INJECTION */
    }.call(this, __webpack_require__(15).Buffer))

    /***/
  }),
/* 32 */
/***/ (function (module, __webpack_exports__, __webpack_require__) {

    "use strict";
    function _classCallCheck (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    function _defineProperties (target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

    function _createClass (Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

    /**
     * Created by kongjian on 2017/6/27.
     */
    var Feature = /*#__PURE__*/function () {
      function Feature () {
        _classCallCheck(this, Feature);

        this.id = Math.round(Math.random() * 256 * 256 * 256); //要素类型，1代表点，2代表线

        this.type = 1; //数据一维数组，里面依次存放x,y地理坐标

        this.sourceData = []; //根据sourceAngleData转换为屏幕坐标的集合

        this.datas = []; //由原始sourceData切断过，带角度的数据

        this.sourceAngleData = [];
        this.latlngData = [];
        this.attributes = {}; //单个注记的样式

        this.style = {};
      }
      /**
       * 添加属性字段
       * Parameters :
       * key
       * value
       */


      _createClass(Feature, [{
        key: "addAttribute",
        value: function addAttribute (key, value) {
          this.attributes[key] = value;
        }
        /**
         * 根据字段名删除属性
         * Parameters :
         * key
         * value
         */

      }, {
        key: "removeAttributeByKey",
        value: function removeAttributeByKey (key) {
          delete this.attributes[key];
        }
        /**
         * 计算feature的最大外接矩形
         */

      }, {
        key: "getLineLabelMaxExtent",
        value: function getLineLabelMaxExtent () {
          if (this.latlngData.length == 0) {
            return null;
          }

          var minX = this.latlngData[0];
          var maxX = this.latlngData[0];
          var minY = this.latlngData[1];
          var maxY = this.latlngData[1];

          for (var i = 2; i < this.latlngData.length; i++) {
            var tempX = this.latlngData[i];
            var tempY = this.latlngData[i + 1];
            if (tempX > maxX) // 判断最大值
              maxX = tempX;
            if (tempX < minX) // 判断最小值
              minX = tempX;
            if (tempY > maxY) // 判断最大值
              maxY = tempY;
            if (tempY < minY) // 判断最小值
              minY = tempY;
            i++;
          }

          return [minX, minY, maxX, maxY];
        }
      }, {
        key: "getMaxExtent",

        /**
         * 计算feature的最大外接矩形
         */
        value: function getMaxExtent () {
          if (this.sourceData.length == 0) {
            return null;
          }

          var minX = this.sourceData[0];
          var maxX = this.sourceData[0];
          var minY = this.sourceData[1];
          var maxY = this.sourceData[1];

          for (var i = 2; i < this.sourceData.length; i++) {
            var tempX = this.sourceData[i];
            var tempY = this.sourceData[i + 1];
            if (tempX > maxX) // 判断最大值
              maxX = tempX;
            if (tempX < minX) // 判断最小值
              minX = tempX;
            if (tempY > maxY) // 判断最大值
              maxY = tempY;
            if (tempY < minY) // 判断最小值
              minY = tempY;
            i++;
          }

          return [minX, minY, maxX, maxY];
        }
        /**
         * 判断feature是否在当前视口中
         * Parameters :
         * srceenBounds - 当前视口的外接矩形
         */

      }, {
        key: "inBounds",
        value: function inBounds (srceenBounds) {
          var featureBounds = null;

          if (this.type == 1) {
            featureBounds = this.getMaxExtent();
          } else {
            featureBounds = this.getLineLabelMaxExtent();
          }

          if (!featureBounds) {
            return false;
          }

          return featureBounds[0] <= srceenBounds[2] && featureBounds[2] >= srceenBounds[0] && featureBounds[1] <= srceenBounds[3] && featureBounds[3] >= srceenBounds[1];
        }
        /**
         * 将要素的地理坐标转换为当前的屏幕坐标
         * Parameters:
         * srceenBounds - 当前视口的外接矩形
         * res - 当前地图的分辨率
         */

      }, {
        key: "transformData",
        value: function transformData (srceenBounds, res) {
          this.datas = [];

          if (this.sourceData.length == 0) {
            return;
          } //取出当前视口左上角的地理坐标


          var left = srceenBounds[0];
          var top = srceenBounds[3]; // for(let i = 0;i< this.sourceData.length;i++){
          //     let sx = this.sourceData[i];
          //     let sy = this.sourceData[i+1];
          //     this.datas.push((sx - left)/res);
          //     this.datas.push((top - sy)/res);
          //     i++;
          // }

          if (this.type == 1) {
            var rPoints = [];

            for (var i = 0; i < this.sourceAngleData.length; i++) {
              var point = this.sourceAngleData[i][0];
              var gx = (point[0] - left) / res;
              var gy = (top - point[1]) / res;
              var p = [gx, gy];
              rPoints.push([p, this.sourceAngleData[i][1]]);
            }

            this.datas = rPoints;
          } else {
            var datas = [];

            for (var _i = 0; _i < this.latlngData.length; _i++) {
              var sx = this.latlngData[_i];
              var sy = this.latlngData[_i + 1];
              datas.push((sx - left) / res);
              datas.push((top - sy) / res);
              _i++;
            }

            this.sourceData = datas;
          }
        }
        /**
         * 获取要素要显示的文字内容
         */

      }, {
        key: "getFeatureLabel",
        value: function getFeatureLabel () {
          var labelField = this.style['labelfield'];

          if (labelField) {
            if (this.attributes[labelField]) {
              return this.attributes[labelField] + '';
            }
          }

          return null;
        }
      }]);

      return Feature;
    }();

/* harmony default export */ __webpack_exports__["a"] = (Feature);

    /***/
  }),
/* 33 */
/***/ (function (module, __webpack_exports__, __webpack_require__) {

    "use strict";
    function _classCallCheck (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    function _defineProperties (target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

    function _createClass (Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

    var GStyleItem = /*#__PURE__*/function () {
      function GStyleItem (styleId, layerId) {
        _classCallCheck(this, GStyleItem);

        this.style = {};
        this.style.id = styleId;
        this.style.layer = layerId;
        this.style.type = 'style';
        this.style.children = [];
      }
      /**
       * 设置sql查询条件
       * Parameters : sqlFilter  示例： fcode  = "2602000500" or fcode  = "2507000500"
       *  fileds 示例： {"gid":{"name":"gid","type":"String"}}
       */


      _createClass(GStyleItem, [{
        key: "queryFilter",
        value: function queryFilter (sqlFilter, fileds) {
          if (sqlFilter) {
            this.style.query = sqlFilter;
            this.style.fields = fileds;
          } else {
            this.style.query = '';
          }
        }
        /**
         * 设置样式
         * Parameters : styleArr  示例：[{
         *			"text": "省界",
         *			"name": "省界",
         *			"filter": "fcode  = \"6302011314\"",
         *			"query": "Q_fcode_S_EQ=6302011314",
         *			"isleaf": true,
         *			"type": "style",
         *			"iconCls": "icon-line",
         *			"id": "11_境界线_省界",
         *			"style": [{
         *				"stroke": false,
         *				"strokeWidth": 0,
         *				"strokeColor": "#ED22AB",
         *				"strokeOpacity": 1,
         *				"dash": null,
         *				"lineCap": "butt",
         *				"lineJoin": "miter",
         * 				"sparsity": 1
         *			}]
         */

      }, {
        key: "setStyle",
        value: function setStyle (styleArr) {
          this.style.style = styleArr;
        }
        /**
         * 添加子样式
         * Parameters : gStyleItem  GStyleItem对象实例
         */

      }, {
        key: "addSubStyle",
        value: function addSubStyle (gStyleItem) {
          this.style.children.push(gStyleItem.style);
        }
      }]);

      return GStyleItem;
    }();

/* harmony default export */ __webpack_exports__["a"] = (GStyleItem);

    /***/
  }),
/* 34 */
/***/ (function (module, __webpack_exports__, __webpack_require__) {

    "use strict";
/* harmony import */ var leaflet__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);
/* harmony import */ var leaflet__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(leaflet__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _GVMapGrid__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(18);
/* harmony import */ var _draw_GVMapGridUtil__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(9);
/* harmony import */ var _ext_Version__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(2);
    /**
     * Created by kongjian on 2017/9/26.
     * 前端绘制底图layer
     */




    var GDynamicMap = _GVMapGrid__WEBPACK_IMPORTED_MODULE_1__[/* default */ "a"].extend({
      // styleObj对象
      styleObj: {},
      //sytle的js形式，为字符串
      styleJs: null,
      initialize: function initialize (url, options) {
        options.isDynamicMap = true;

        if (window.devicePixelRatio > 1.5) {
          this.ratio = 2;
        }

        if (!this.sourceUrl) {
          this.sourceUrl = url;
        }

        if (options && options.tileSize) {
          this.tilesize = options.tileSize;
        }

        this.gVMapGridUtil = new _draw_GVMapGridUtil__WEBPACK_IMPORTED_MODULE_2__[/* default */ "a"](options.isDynamicMap);
        this.gVMapGridUtil.tileSize = this.tilesize;
        this.gVMapGridUtil.parseUrl(url);
        this._url = url + '&ratio=' + this.ratio + '&tilesize=' + this.tilesize + '&clientVersion=' + _ext_Version__WEBPACK_IMPORTED_MODULE_3__[/* default */ "a"];
        leaflet__WEBPACK_IMPORTED_MODULE_0___default.a.setOptions(this, options);
        this.on('tileunload', this._onTileRemove);
        this.on('tileload', this._onTileLoad);
        this.on('tileerror', this._onTileError);
      },
      onAdd: function onAdd () {
        if (this.control) {
          this._url = this.sourceUrl + '&ratio=' + this.ratio + '&tilesize=' + this.tilesize + '&clientVersion=' + _ext_Version__WEBPACK_IMPORTED_MODULE_3__[/* default */ "a"] + '&control=' + this.control;
        }

        if (this.controlId) {
          this._url = this.sourceUrl + '&ratio=' + this.ratio + '&tilesize=' + this.tilesize + '&clientVersion=' + _ext_Version__WEBPACK_IMPORTED_MODULE_3__[/* default */ "a"] + '&controlId=' + this.controlId;
        }

        this._initContainer();

        this._levels = {};
        this._tiles = {};
        this.gVMapGridUtil.setStyle(this.styleObj);
        var reqArr = this.gVMapGridUtil.loadStyle('layer');
        Promise.all(reqArr).then(function () {
          this._resetView();

          this._update();
        }.bind(this));
      },
      addLevels: function addLevels (gLevels) {
        this.styleObj[gLevels.levelsKey] = gLevels.levelsData;
      },
      redraw: function redraw () {
        this.gVMapGridUtil.formatStyle(this.styleObj, function () {
          if (this._map) {
            this._removeAllTiles();

            this._update();
          }
        });
        return this;
      }
    });
/* harmony default export */ __webpack_exports__["a"] = (GDynamicMap);

    /***/
  }),
/* 35 */
/***/ (function (module, __webpack_exports__, __webpack_require__) {

    "use strict";
/* harmony import */ var leaflet__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);
/* harmony import */ var leaflet__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(leaflet__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _draw_GXYZUtil__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8);
/* harmony import */ var _ext_Version__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(2);
    /**
     * Created by kongjian on 2017/7/3.
     * 后端绘制底图layer
     */



    var GXYZ = leaflet__WEBPACK_IMPORTED_MODULE_0___default.a.TileLayer.extend({
      //多个服务器url的域名，用于解决一个域名只有6条请求管线的限制
      urlArray: [],
      // 不带过滤条件的url
      sourceUrl: null,
      //底图图层的代理类，负责封装过滤，拾取高亮等接口
      gxyzUtil: null,
      //高亮图层
      highlightLayer: null,
      //缩放比例
      ratio: 1,
      //过滤json对象
      control: null,
      //过滤的id
      controlId: null,
      //瓦片大小
      tilesize: 256,
      //默认后端不拾取注记
      includelabel: false,
      initialize: function initialize (url, options) {
        if (window.devicePixelRatio > 1.5) {
          this.ratio = 2;
        }

        if (!this.sourceUrl) {
          this.sourceUrl = url;
        }

        if (options && options.tileSize) {
          this.tilesize = options.tileSize;
        }

        if (options) {
          this.includelabel = options.includeLabel;
        }

        this.gxyzUtil = new _draw_GXYZUtil__WEBPACK_IMPORTED_MODULE_1__[/* default */ "a"]();
        this.gxyzUtil.tileSize = this.tilesize;
        this.gxyzUtil.parseUrl(url);
        this._url = url + '&ratio=' + this.ratio + '&tilesize=' + this.tilesize + '&clientVersion=' + _ext_Version__WEBPACK_IMPORTED_MODULE_2__[/* default */ "a"];
        leaflet__WEBPACK_IMPORTED_MODULE_0___default.a.setOptions(this, options);
      },
      onAdd: function onAdd () {
        if (this.control) {
          this._url = this.sourceUrl + '&ratio=' + this.ratio + '&tilesize=' + this.tilesize + '&clientVersion=' + _ext_Version__WEBPACK_IMPORTED_MODULE_2__[/* default */ "a"] + '&control=' + this.control;
        }

        if (this.controlId) {
          this._url = this.sourceUrl + '&ratio=' + this.ratio + '&tilesize=' + this.tilesize + '&clientVersion=' + _ext_Version__WEBPACK_IMPORTED_MODULE_2__[/* default */ "a"] + '&controlId=' + this.controlId;
        }

        this._initContainer();

        this._levels = {};
        this._tiles = {};

        this._resetView();

        this._update();
      },
      _update: function _update () {
        if (this.isSetIngFilter) {
          return;
        }

        leaflet__WEBPACK_IMPORTED_MODULE_0___default.a.TileLayer.prototype._update.call(this);
      },

      /**
       * 获取url的方法
       */
      getTileUrl: function getTileUrl (coords) {
        var data = {
          r: leaflet__WEBPACK_IMPORTED_MODULE_0___default.a.Browser.retina ? '@2x' : '',
          s: this._getSubdomain(coords),
          x: coords.x,
          y: coords.y,
          z: this._getZoomForUrl()
        };

        if (this._map && !this._map.options.crs.infinite) {
          var invertedY = this._globalTileRange.max.y - coords.y;

          if (this.options.tms) {
            data['y'] = invertedY;
          }

          data['-y'] = invertedY;
        }

        if (this.urlArray.length == 0) {
          return leaflet__WEBPACK_IMPORTED_MODULE_0___default.a.Util.template(this._url, leaflet__WEBPACK_IMPORTED_MODULE_0___default.a.extend(data, this.options));
        } else {
          //从urlArray中随机取出一个url
          var len = this.urlArray.length - 1;
          var index = Math.round(Math.random() * len);
          var url = this.urlArray[index];

          var array = this._url.split('/mapserver');

          var partUrl = array[1];
          url = url + '/mapserver' + partUrl;
          return leaflet__WEBPACK_IMPORTED_MODULE_0___default.a.Util.template(url, leaflet__WEBPACK_IMPORTED_MODULE_0___default.a.extend(data, this.options));
        }
      },

      /**
       * 设置过滤条件
       */
      setFilter: function setFilter (filter) {
        this.isSetIngFilter = true;

        if (!this._url || !filter || filter.layers.length == 0 && filter.order.length == 0) {
          this.isSetIngFilter = false;
          this.controlId = null;
          this.control = null;
          this.setUrl(this.sourceUrl + '&ratio=' + this.ratio + '&tilesize=' + this.tilesize + '&clientVersion=' + _ext_Version__WEBPACK_IMPORTED_MODULE_2__[/* default */ "a"]);
          return;
        }

        this.gxyzUtil.setFilter(filter, function (result) {
          this.isSetIngFilter = false;

          if (result.isIE) {
            this.controlId = result.id;
            this.setUrl(this.sourceUrl + '&ratio=' + this.ratio + '&tilesize=' + this.tilesize + '&clientVersion=' + _ext_Version__WEBPACK_IMPORTED_MODULE_2__[/* default */ "a"] + '&controlId=' + result.id);
          } else {
            this.control = result.id;
            this.setUrl(this.sourceUrl + '&ratio=' + this.ratio + '&tilesize=' + this.tilesize + '&clientVersion=' + _ext_Version__WEBPACK_IMPORTED_MODULE_2__[/* default */ "a"] + '&control=' + result.id);
          }
        }.bind(this));
      },
      //设置后端拾取注记
      setIncludelabel: function setIncludelabel (includelabel) {
        this.includelabel = includelabel;
      },

      /**
       * 根据屏幕坐标获取拾取到的要素
       * Parameters :
       * x -
       * y -
       * callback - 拾取成功的回调函数
       */
      getFeatureByXY: function getFeatureByXY (x, y, callback, timeStamp) {
        var latLng = this._map.containerPointToLatLng(new leaflet__WEBPACK_IMPORTED_MODULE_0___default.a.point(x, y));

        var level = this._map.getZoom();

        var smta = this._map.options.crs.project(latLng);

        this.gxyzUtil.pickupFeaturesBylatlng(level, this.control, this.controlId, smta.y, smta.x, this.includelabel, timeStamp, callback); //this.getFeatureByLonlat(latLng,callback);
      },

      /**
       * 根据地理坐标获取拾取到的要素
       * Parameters :
       * lonlat - 地理坐标对象
       * callback - 拾取成功的回调函数
       */
      getFeatureByLonlat: function getFeatureByLonlat (latLng, callback, timeStamp) {
        var pt = this._map.options.crs.projection.project(latLng);

        var maxBounds = this._map.options.crs.projection.bounds; //地图当前范围

        var bounds = this._map.getBounds();

        var pBounds = this._map.getPixelBounds();

        var east = this._map.options.crs.projection.project(bounds._northEast);

        var west = this._map.options.crs.projection.project(bounds._southWest); //地图当前分辨率


        var res = (east.y - west.y) / (pBounds.max.y - pBounds.min.y);
        var tileSize = this.options.tileSize;
        var row = (maxBounds.max.y - pt.y) / (res * tileSize);
        var col = (pt.x - maxBounds.min.x) / (res * tileSize);

        var level = this._map.getZoom();

        var tx = (col - Math.floor(col)) * tileSize;
        var ty = (row - Math.floor(row)) * tileSize;
        this.gxyzUtil.pickupFeatures(row, col, level, tx, ty, this.control, this.controlId, timeStamp, function (features) {
          callback(features);
        });
      },

      /**
       * 根据指定的样式高亮要素
       * Parameters :
       * layerFeatures - 要素map集合
       * style - 高亮样式 如：{color:"red",opacity:0.8};
       */
      highlightFeatures: function highlightFeatures (layerFeatures, style) {
        //获取高亮的过滤条件
        var filter = this.gxyzUtil.CreateHighlightFilter(layerFeatures, style); //如果没有过滤任何要素

        if (filter.layers.length == 0) {
          return;
        } // style.color = style.color.replace('#','%23');


        if (!this.highlightLayer) {
          //构造高亮图层
          this.highlightLayer = new leaflet__WEBPACK_IMPORTED_MODULE_0___default.a.GXYZ(this.sourceUrl, this.options);

          this._map.addLayer(this.highlightLayer);
        }

        this.highlightLayer.options.opacity = style.opacity;

        this.highlightLayer._updateOpacity(); //设置高亮过滤条件


        this.highlightLayer.setFilter(filter); //获取当前图层的index

        var index = this.options.zIndex; //设置高亮图层在当前底图图层之上

        this.highlightLayer.setZIndex(index + 1);
      },

      /**
       * 根据指定的样式高亮要素，每个要素都可以有不同的样式
       * Parameters :
       * layerFeatures - 要素map集合
       * opacity - 透明度，所有要高亮的要素都是必须是相同的透明度;
       */
      highlightEveryFeatures: function highlightEveryFeatures (layerFeatures, opacity) {
        //获取高亮的过滤条件
        var filter = this.gxyzUtil.CreateEveryHighlightFilter(layerFeatures); //如果没有过滤任何要素

        if (filter.layers.length == 0) {
          return;
        }

        if (!this.highlightLayer) {
          //构造高亮图层
          this.highlightLayer = new leaflet__WEBPACK_IMPORTED_MODULE_0___default.a.GXYZ(this.sourceUrl, this.options);

          this._map.addLayer(this.highlightLayer);
        }

        this.highlightLayer.options.opacity = opacity;

        this.highlightLayer._updateOpacity(); //设置高亮过滤条件


        this.highlightLayer.setFilter(filter); //获取当前图层的index

        var index = this.options.zIndex; //设置高亮图层在当前底图图层之上

        this.highlightLayer.setZIndex(index + 1);
      },

      /**
       * 根据Filter高亮指定要素
       * Parameters :
       * filter - Filter对象
       */
      highlightByFilter: function highlightByFilter (filter) {
        //如果没有过滤任何要素
        if (filter.layers.length == 0) {
          return;
        }

        if (!this.highlightLayer) {
          //构造高亮图层
          this.highlightLayer = new leaflet__WEBPACK_IMPORTED_MODULE_0___default.a.GXYZ(this.sourceUrl, this.options);

          this._map.addLayer(this.highlightLayer);
        }

        this.highlightLayer.options.opacity = 1;

        this.highlightLayer._updateOpacity(); //设置高亮过滤条件


        this.highlightLayer.setFilter(filter); //获取当前图层的index

        var index = this.options.zIndex; //设置高亮图层在当前底图图层之上

        this.highlightLayer.setZIndex(index + 1);
      },

      /**
       * 取消高亮
       */
      cancelHighlight: function cancelHighlight () {
        if (this.highlightLayer) {
          this._map.removeLayer(this.highlightLayer);

          this.highlightLayer = null;
        }
      }
    });
/* harmony default export */ __webpack_exports__["a"] = (GXYZ);

    /***/
  }),
/* 36 */
/***/ (function (module, __webpack_exports__, __webpack_require__) {

    "use strict";
/* harmony import */ var leaflet__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);
/* harmony import */ var leaflet__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(leaflet__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _datasource_URLDataSource__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(16);
    function _classCallCheck (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    function _defineProperties (target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

    function _createClass (Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

    /**
     * Created by kongjian on 2017/6/26.
     */



    var GServiceGroup = /*#__PURE__*/function () {
      function GServiceGroup (layerId, url, map, options) {
        _classCallCheck(this, GServiceGroup);

        this.map = null;
        this.layer = null;
        this.label = null;
        this.layerType = 0;
        this.labelType = 2;
        this.map = map;
        this.url = url;
        this.layerId = layerId;
        this.styleId = null;
        this.tileSize = 256;
        this.options = options;
      }

      _createClass(GServiceGroup, [{
        key: "addServiceGroup",
        value: function addServiceGroup () {
          if (this.options && this.options.styleId) {
            this.styleId = this.options.styleId;
          }

          if (this.options && this.options.tileSize) {
            this.tileSize = this.options.tileSize;
          }

          switch (this.layerType) {
            case 0:
              this.addBaseLayer();
              break;

            case 1:
              this.addFrontBaseLayer();
              break;
          }

          switch (this.labelType) {
            case 2:
              this.addFrontLabel();
              break;

            case 3:
              this.AddImgLabel();
              break;

            case 4:
              this.addAvoidLabel();
              break;
          }
        }
        /*后端底图*/

      }, {
        key: "addBaseLayer",
        value: function addBaseLayer () {
          this.layer = new leaflet__WEBPACK_IMPORTED_MODULE_0___default.a.GXYZ(this.url + "&x={x}&y={y}&l={z}&tileType=" + this.layerType, {
            sphericalMercator: false,
            isBaseLayer: false,
            tileSize: this.tileSize
          });
          this.map.addLayer(this.layer);
        }
        /*前端底图*/

      }, {
        key: "addFrontBaseLayer",
        value: function addFrontBaseLayer () {
          this.layer = new leaflet__WEBPACK_IMPORTED_MODULE_0___default.a.GVMapGrid(this.url + "&x={x}&y={y}&l={z}&tileType=" + this.layerType, {
            maxZoom: 21,
            keepBuffer: 0,
            updateWhenZooming: false,
            tileSize: this.tileSize
          });
          this.map.addLayer(this.layer);
        } //////////////////////////////////////////////////////////////////////////

        /*后端注记绘制*/

      }, {
        key: "AddImgLabel",
        value: function AddImgLabel () {
          this.label = new leaflet__WEBPACK_IMPORTED_MODULE_0___default.a.GXYZ(this.url + "&x={x}&y={y}&l={z}&tileType=" + this.labelType, {
            sphericalMercator: false,
            isBaseLayer: false,
            tileSize: this.tileSize
          });
          this.map.addLayer(this.label);
        }
        /*后端注记避让*/

      }, {
        key: "addAvoidLabel",
        value: function addAvoidLabel () {
          this.label = new leaflet__WEBPACK_IMPORTED_MODULE_0___default.a.GLabelGrid(this.url + '&x={x}&y={y}&l={z}&tileType=' + this.labelType, {
            hitDetection: true,
            keepBuffer: 0,
            updateWhenZooming: false,
            tileSize: this.tileSize
          });
          this.map.addLayer(this.label);
        }
        /*前端*/

      }, {
        key: "addFrontLabel",
        value: function addFrontLabel () {
          this.label = new leaflet__WEBPACK_IMPORTED_MODULE_0___default.a.GWVTAnno("GWVTanno", {
            tileSize: this.tileSize
          });
          var dataSource = new _datasource_URLDataSource__WEBPACK_IMPORTED_MODULE_1__[/* default */ "a"]();
          dataSource.url = this.url + '&x=${x}&y=${y}&l=${z}&tileType=' + this.labelType;
          this.label.addDataSource(dataSource);
          this.map.addLayer(this.label);
        }
      }, {
        key: "setLayerType",
        value: function setLayerType (layerType) {
          if (layerType == "Img") {
            this.layerType = 0;
          } else if (layerType == "Data") {
            this.layerType = 1;
          }
        }
      }, {
        key: "setLabelType",
        value: function setLabelType (labelType) {
          if (labelType == "Data") {
            this.labelType = 2;
          } else if (labelType == "Img") {
            this.labelType = 3;
          } else if (labelType == "AvoidImg") {
            this.labelType = 4;
          }
        }
      }, {
        key: "setTileSize",
        value: function setTileSize (tileSize) {
          this.tileSize = tileSize;
        }
      }, {
        key: "getLayer",
        value: function getLayer () {
          return this.layer;
        }
      }, {
        key: "getLabel",
        value: function getLabel () {
          return this.label;
        }
      }, {
        key: "removeGroupLayer",
        value: function removeGroupLayer () {
          if (this.layer) {
            this.map.removeLayer(this.layer);
          }

          if (this.label) {
            this.map.removeLayer(this.label);
          }
        }
      }]);

      return GServiceGroup;
    }();

/* harmony default export */ __webpack_exports__["a"] = (GServiceGroup);

    /***/
  }),
/* 37 */
/***/ (function (module, __webpack_exports__, __webpack_require__) {

    "use strict";
    function _classCallCheck (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    function _defineProperties (target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

    function _createClass (Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

    var GGroup = /*#__PURE__*/function () {
      function GGroup (groupName) {
        _classCallCheck(this, GGroup);

        this.group = {};
        this.group.id = groupName;
        this.group.type = 'group';
        this.group.children = [];
      }
      /**
       * 添加样式
       * Parameters : gStyleItem  GStyleItem对象实例
       */


      _createClass(GGroup, [{
        key: "addStyle",
        value: function addStyle (gStyleItem) {
          this.group.children.push(gStyleItem.style);
        }
      }]);

      return GGroup;
    }();

/* harmony default export */ __webpack_exports__["a"] = (GGroup);

    /***/
  }),
/* 38 */
/***/ (function (module, __webpack_exports__, __webpack_require__) {

    "use strict";
    function _classCallCheck (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    function _defineProperties (target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

    function _createClass (Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

    var GLevels = /*#__PURE__*/function () {
      function GLevels (startLevel, endLevel) {
        _classCallCheck(this, GLevels);

        this.levelsData = [];
        this.levelsKey = startLevel + '-' + endLevel;
      }
      /**
       * 添加组
       * Parameters : gGroup  GGroup对象实例
       */


      _createClass(GLevels, [{
        key: "addGroup",
        value: function addGroup (gGroup) {
          this.levelsData.push(gGroup.group);
        }
        /**
         * 添加组
         * Parameters : gGroup  GGroup对象实例
         */

      }, {
        key: "addStyleItem",
        value: function addStyleItem (gStyleItem) {
          this.levelsData.push(gStyleItem.style);
        }
      }]);

      return GLevels;
    }();

/* harmony default export */ __webpack_exports__["a"] = (GLevels);

    /***/
  }),
/* 39 */
/***/ (function (module, __webpack_exports__, __webpack_require__) {

    "use strict";
    __webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function (global) {/* harmony import */ var leaflet__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);
/* harmony import */ var leaflet__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(leaflet__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _ext_LeafletExt__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(40);
/* harmony import */ var _ext_CRS_CustomEPSG4326__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(24);
/* harmony import */ var _layer_datasource_DataSource__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(10);
/* harmony import */ var _layer_datasource_URLDataSource__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(16);
/* harmony import */ var _layer_datasource_LocalDataSource__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(25);
/* harmony import */ var _layer_label_GLabelGrid__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(26);
/* harmony import */ var _layer_label_GWVTAnno__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(27);
/* harmony import */ var _layer_label_feature_Feature__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(32);
/* harmony import */ var _layer_vector_stylejs_GStyleItem__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(33);
/* harmony import */ var _layer_vector_GDynamicMap__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(34);
/* harmony import */ var _layer_vector_GVMapGrid__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(18);
/* harmony import */ var _layer_vector_GXYZ__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(35);
/* harmony import */ var _layer_GServiceGroup__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(36);
/* harmony import */ var _layer_vector_draw_GVMapGridUtil__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(9);
/* harmony import */ var _filter_Filter__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(13);
/* harmony import */ var _filter_FilterLayer__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(11);
/* harmony import */ var _layer_vector_stylejs_GGroup__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(37);
/* harmony import */ var _layer_vector_stylejs_GLevels__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(38);

      var g = window || global;
      g.Custom = g.Custom || {};


















      leaflet__WEBPACK_IMPORTED_MODULE_0___default.a.CRS.CustomEPSG4326 = _ext_CRS_CustomEPSG4326__WEBPACK_IMPORTED_MODULE_2__[/* default */ "a"];
      leaflet__WEBPACK_IMPORTED_MODULE_0___default.a.GLabelGrid = _layer_label_GLabelGrid__WEBPACK_IMPORTED_MODULE_6__[/* default */ "a"];
      leaflet__WEBPACK_IMPORTED_MODULE_0___default.a.GDynamicMap = _layer_vector_GDynamicMap__WEBPACK_IMPORTED_MODULE_10__[/* default */ "a"];
      leaflet__WEBPACK_IMPORTED_MODULE_0___default.a.GVMapGrid = _layer_vector_GVMapGrid__WEBPACK_IMPORTED_MODULE_11__[/* default */ "a"];
      leaflet__WEBPACK_IMPORTED_MODULE_0___default.a.GXYZ = _layer_vector_GXYZ__WEBPACK_IMPORTED_MODULE_12__[/* default */ "a"];
      leaflet__WEBPACK_IMPORTED_MODULE_0___default.a.GWVTAnno = _layer_label_GWVTAnno__WEBPACK_IMPORTED_MODULE_7__[/* default */ "a"];
      Custom.DataSource = _layer_datasource_DataSource__WEBPACK_IMPORTED_MODULE_3__[/* default */ "a"];
      Custom.URLDataSource = _layer_datasource_URLDataSource__WEBPACK_IMPORTED_MODULE_4__[/* default */ "a"];
      Custom.LocalDataSource = _layer_datasource_LocalDataSource__WEBPACK_IMPORTED_MODULE_5__[/* default */ "a"];
      Custom.Feature = _layer_label_feature_Feature__WEBPACK_IMPORTED_MODULE_8__[/* default */ "a"];
      Custom.GGroup = _layer_vector_stylejs_GGroup__WEBPACK_IMPORTED_MODULE_17__[/* default */ "a"];
      Custom.GLevels = _layer_vector_stylejs_GLevels__WEBPACK_IMPORTED_MODULE_18__[/* default */ "a"];
      Custom.GStyleItem = _layer_vector_stylejs_GStyleItem__WEBPACK_IMPORTED_MODULE_9__[/* default */ "a"];
      Custom.GServiceGroup = _layer_GServiceGroup__WEBPACK_IMPORTED_MODULE_13__[/* default */ "a"];
      Custom.GVMapGridUtil = _layer_vector_draw_GVMapGridUtil__WEBPACK_IMPORTED_MODULE_14__[/* default */ "a"];
      Custom.Filter = _filter_Filter__WEBPACK_IMPORTED_MODULE_15__[/* default */ "a"];
      Custom.FilterLayer = _filter_FilterLayer__WEBPACK_IMPORTED_MODULE_16__[/* default */ "a"];
/* harmony default export */ __webpack_exports__["default"] = (Custom);
      /* WEBPACK VAR INJECTION */
    }.call(this, __webpack_require__(23)))

    /***/
  }),
/* 40 */
/***/ (function (module, __webpack_exports__, __webpack_require__) {

    "use strict";
/* harmony import */ var leaflet__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);
/* harmony import */ var leaflet__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(leaflet__WEBPACK_IMPORTED_MODULE_0__);

    /**
     * 重写Attribution方法的options属性，去掉leaflet商标
     */

    leaflet__WEBPACK_IMPORTED_MODULE_0___default.a.Control.Attribution.prototype.options = {
      position: 'bottomright'
    };
    /**
     * 重写手势缩放的bug
     */

    leaflet__WEBPACK_IMPORTED_MODULE_0___default.a.Map.TouchZoom.prototype._onTouchMove = function () {
      return function (e) {
        if (!e.touches || e.touches.length !== 2 || !this._zooming) {
          return;
        }

        var map = this._map,
          p1 = map.mouseEventToContainerPoint(e.touches[0]),
          p2 = map.mouseEventToContainerPoint(e.touches[1]),
          scale = p1.distanceTo(p2) / this._startDist;

        this._zoom = map.getScaleZoom(scale, this._startZoom) + 1;

        if (!map.options.bounceAtZoomLimits && (this._zoom < map.getMinZoom() && scale < 1 || this._zoom > map.getMaxZoom() && scale > 1)) {
          this._zoom = map._limitZoom(this._zoom);
        }

        if (map.options.touchZoom === 'center') {
          this._center = this._startLatLng;

          if (scale === 1) {
            return;
          }
        } else {
          // Get delta from pinch to center, so centerLatLng is delta applied to initial pinchLatLng
          var delta = p1._add(p2)._divideBy(2)._subtract(this._centerPoint);

          if (scale === 1 && delta.x === 0 && delta.y === 0) {
            return;
          }

          this._center = map.unproject(map.project(this._pinchStartLatLng, this._zoom).subtract(delta), this._zoom);
        }

        if (!this._moved) {
          map._moveStart(true);

          this._moved = true;
        }

        leaflet__WEBPACK_IMPORTED_MODULE_0___default.a.Util.cancelAnimFrame(this._animRequest);
        var moveFn = leaflet__WEBPACK_IMPORTED_MODULE_0___default.a.bind(map._move, map, this._center, this._zoom, {
          pinch: true,
          round: false
        });
        this._animRequest = leaflet__WEBPACK_IMPORTED_MODULE_0___default.a.Util.requestAnimFrame(moveFn, this, true);
        leaflet__WEBPACK_IMPORTED_MODULE_0___default.a.DomEvent.preventDefault(e);
      };
    }(leaflet__WEBPACK_IMPORTED_MODULE_0___default.a.Map.TouchZoom.prototype._onTouchMove);
    /**
     * 重写flyTo函数，解决该函数产生的小数缩放级别的bug
     */


    leaflet__WEBPACK_IMPORTED_MODULE_0___default.a.Map.prototype.flyTo = function () {
      return function (targetCenter, targetZoom, options) {
        options = options || {};

        if (options.animate === false || !leaflet__WEBPACK_IMPORTED_MODULE_0___default.a.Browser.any3d) {
          return this.setView(targetCenter, targetZoom, options);
        }

        this._stop();

        var from = this.project(this.getCenter()),
          to = this.project(targetCenter),
          size = this.getSize(),
          startZoom = this._zoom;
        targetCenter = leaflet__WEBPACK_IMPORTED_MODULE_0___default.a.latLng(targetCenter);
        targetZoom = targetZoom === undefined ? startZoom : targetZoom;
        var w0 = Math.max(size.x, size.y),
          w1 = w0 * this.getZoomScale(startZoom, targetZoom),
          u1 = to.distanceTo(from) || 1,
          rho = 1.42,
          rho2 = rho * rho;

        function r (i) {
          var s1 = i ? -1 : 1,
            s2 = i ? w1 : w0,
            t1 = w1 * w1 - w0 * w0 + s1 * rho2 * rho2 * u1 * u1,
            b1 = 2 * s2 * rho2 * u1,
            b = t1 / b1,
            sq = Math.sqrt(b * b + 1) - b; // workaround for floating point precision bug when sq = 0, log = -Infinite,
          // thus triggering an infinite loop in flyTo

          var log = sq < 0.000000001 ? -18 : Math.log(sq);
          return log;
        }

        function sinh (n) {
          return (Math.exp(n) - Math.exp(-n)) / 2;
        }

        function cosh (n) {
          return (Math.exp(n) + Math.exp(-n)) / 2;
        }

        function tanh (n) {
          return sinh(n) / cosh(n);
        }

        var r0 = r(0);

        function w (s) {
          return w0 * (cosh(r0) / cosh(r0 + rho * s));
        }

        function u (s) {
          return w0 * (cosh(r0) * tanh(r0 + rho * s) - sinh(r0)) / rho2;
        }

        function easeOut (t) {
          return 1 - Math.pow(1 - t, 1.5);
        }

        var start = Date.now(),
          S = (r(1) - r0) / rho,
          duration = options.duration ? 1000 * options.duration : 1000 * S * 0.8;

        function frame () {
          var t = (Date.now() - start) / duration,
            s = easeOut(t) * S;

          if (t <= 1) {
            this._flyToFrame = leaflet__WEBPACK_IMPORTED_MODULE_0___default.a.Util.requestAnimFrame(frame, this);

            this._move(this.unproject(from.add(to.subtract(from).multiplyBy(u(s) / u1)), startZoom), this.getScaleZoom(w0 / w(s), startZoom), {
              flyTo: true
            });
          } else {
            //增加这行，保证flyto完成后，地图的层级为整数
            targetZoom = Math.round(targetZoom);

            this._move(targetCenter, targetZoom)._moveEnd(true);
          }
        }

        this._moveStart(true);

        frame.call(this);
        return this;
      };
    }(leaflet__WEBPACK_IMPORTED_MODULE_0___default.a.Map.prototype.flyTo);
    /**
     * 如果是ie浏览器，则增加startsWith和endsWith方法
     */


    if (!!window.ActiveXObject || "ActiveXObject" in window) {
      String.prototype.startsWith = function (str) {
        if (str == null || str == "" || this.length == 0 || str.length > this.length) return false;

        if (this.substr(0, str.length) == str) {
          return true;
        } else {
          return false;
        }
      };

      String.prototype.endsWith = function (str) {
        if (!!window.ActiveXObject || "ActiveXObject" in window) {
          return this.indexOf(str, this.length - str.length) !== -1;
        } else {
          return this.endsWith(str);
        }
      };
    }

    /***/
  }),
/* 41 */
/***/ (function (module, __webpack_exports__, __webpack_require__) {

    "use strict";
    __webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "get", function () { return get; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "post", function () { return post; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "patch", function () { return patch; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "json", function () { return json; });
    function toString (obj) {
      return Object.prototype.toString.call(obj);
    }

    function set (request, header, value) {
      request.setRequestHeader(header, value);
    }

    function noop () { }

    ;
    var isRequested = false;
    var isIE9 = false;

    function req (url, type, json, data, buf) {
      var methods = {
        success: noop,
        error: noop
      };
      var request;

      if (!isRequested) {
        var b_version = navigator.appVersion;
        var version = b_version.split(";");

        if (version[1]) {
          var trim_Version = version[1].replace(/[ ]/g, "");
          isIE9 = trim_Version == 'MSIE9.0';
        }

        isRequested = true;
      }

      if (isIE9) {
        request = new window.XDomainRequest();
      } else {
        request = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
      }

      if (buf) {
        request.responseType = "arraybuffer";
      }

      var hasPayload = type === 'POST' || type === 'PATCH' || type === 'DELETE';
      request.open(type, url, true);

      if (!isIE9) {
        if (json) {
          set(request, 'Content-Type', 'application/json');
          set(request, 'Accept', 'application/json');
        } else {
          if (!buf) {
            set(request, 'Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
          }
        }
      }

      if (hasPayload) {
        if (json) data = JSON.stringify(data); // set(request, 'X-CSRFToken', csrf());
      } // set(request, 'X-Requested-With', 'XMLHttpRequest');


      request.onreadystatechange = function () {
        if (request.readyState === 4) {
          if (request.status >= 200 && request.status < 300) {
            if (buf) {
              methods.success.call(request, request.response, request);
            } else {
              methods.success.call(request, request.responseText, request);
            }
          } else {
            if (request.responseType == "arraybuffer") {
              methods.error.call(request, request.response, request);
            } else {
              methods.error.call(request, request.responseText, request);
            }
          }
        }
      };

      request.onerror = function () {
        if (buf) {
          methods.error.call(request, request.statusText, request);
        } else {
          methods.error.call(request, request.responseText, request);
        }
      };

      request.onload = function () {
        if (buf) {
          methods.success.call(request, request.response, request);
        } else {
          methods.success.call(request, request.responseText, request);
        }
      };

      hasPayload ? request.send(data) : request.send();
      var returned = {
        success: function success (callback) {
          methods.success = callback;
          return returned;
        },
        error: function error (callback) {
          methods.error = callback;
          return returned;
        },
        request: request
      };
      return returned;
    }

    var get = function get (url, buf) {
      return req(url, 'GET', false, null, buf);
    };

    var post = function post (url, data) {
      return req(url, 'POST', false, data);
    };

    var patch = function patch (url, data) {
      return req(url, 'PATCH', false, data);
    };

    var json = {
      get: function get (url) {
        return req(url, 'GET', true, null);
      },
      post: function post (url, data) {
        return req(url, 'POST', true, data);
      },
      patch: function patch (url, data) {
        return req(url, 'PATCH', true, data);
      }
    }; //   const delete = function(url) {
    //       return req(url, 'DELETE', false, null);
    //   }



    /***/
  }),
/* 42 */
/***/ (function (module, exports, __webpack_require__) {

    "use strict";


    exports.byteLength = byteLength;
    exports.toByteArray = toByteArray;
    exports.fromByteArray = fromByteArray;
    var lookup = [];
    var revLookup = [];
    var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array;
    var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

    for (var i = 0, len = code.length; i < len; ++i) {
      lookup[i] = code[i];
      revLookup[code.charCodeAt(i)] = i;
    } // Support decoding URL-safe base64 strings, as Node.js does.
    // See: https://en.wikipedia.org/wiki/Base64#URL_applications


    revLookup['-'.charCodeAt(0)] = 62;
    revLookup['_'.charCodeAt(0)] = 63;

    function getLens (b64) {
      var len = b64.length;

      if (len % 4 > 0) {
        throw new Error('Invalid string. Length must be a multiple of 4');
      } // Trim off extra bytes after placeholder bytes are found
      // See: https://github.com/beatgammit/base64-js/issues/42


      var validLen = b64.indexOf('=');
      if (validLen === -1) validLen = len;
      var placeHoldersLen = validLen === len ? 0 : 4 - validLen % 4;
      return [validLen, placeHoldersLen];
    } // base64 is 4/3 + up to two characters of the original data


    function byteLength (b64) {
      var lens = getLens(b64);
      var validLen = lens[0];
      var placeHoldersLen = lens[1];
      return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
    }

    function _byteLength (b64, validLen, placeHoldersLen) {
      return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
    }

    function toByteArray (b64) {
      var tmp;
      var lens = getLens(b64);
      var validLen = lens[0];
      var placeHoldersLen = lens[1];
      var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen));
      var curByte = 0; // if there are placeholders, only get up to the last complete 4 chars

      var len = placeHoldersLen > 0 ? validLen - 4 : validLen;
      var i;

      for (i = 0; i < len; i += 4) {
        tmp = revLookup[b64.charCodeAt(i)] << 18 | revLookup[b64.charCodeAt(i + 1)] << 12 | revLookup[b64.charCodeAt(i + 2)] << 6 | revLookup[b64.charCodeAt(i + 3)];
        arr[curByte++] = tmp >> 16 & 0xFF;
        arr[curByte++] = tmp >> 8 & 0xFF;
        arr[curByte++] = tmp & 0xFF;
      }

      if (placeHoldersLen === 2) {
        tmp = revLookup[b64.charCodeAt(i)] << 2 | revLookup[b64.charCodeAt(i + 1)] >> 4;
        arr[curByte++] = tmp & 0xFF;
      }

      if (placeHoldersLen === 1) {
        tmp = revLookup[b64.charCodeAt(i)] << 10 | revLookup[b64.charCodeAt(i + 1)] << 4 | revLookup[b64.charCodeAt(i + 2)] >> 2;
        arr[curByte++] = tmp >> 8 & 0xFF;
        arr[curByte++] = tmp & 0xFF;
      }

      return arr;
    }

    function tripletToBase64 (num) {
      return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F];
    }

    function encodeChunk (uint8, start, end) {
      var tmp;
      var output = [];

      for (var i = start; i < end; i += 3) {
        tmp = (uint8[i] << 16 & 0xFF0000) + (uint8[i + 1] << 8 & 0xFF00) + (uint8[i + 2] & 0xFF);
        output.push(tripletToBase64(tmp));
      }

      return output.join('');
    }

    function fromByteArray (uint8) {
      var tmp;
      var len = uint8.length;
      var extraBytes = len % 3; // if we have 1 byte left, pad 2 bytes

      var parts = [];
      var maxChunkLength = 16383; // must be multiple of 3
      // go through the array every three bytes, we'll deal with trailing stuff later

      for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
        parts.push(encodeChunk(uint8, i, i + maxChunkLength > len2 ? len2 : i + maxChunkLength));
      } // pad the end with zeros, but make sure to not forget the extra bytes


      if (extraBytes === 1) {
        tmp = uint8[len - 1];
        parts.push(lookup[tmp >> 2] + lookup[tmp << 4 & 0x3F] + '==');
      } else if (extraBytes === 2) {
        tmp = (uint8[len - 2] << 8) + uint8[len - 1];
        parts.push(lookup[tmp >> 10] + lookup[tmp >> 4 & 0x3F] + lookup[tmp << 2 & 0x3F] + '=');
      }

      return parts.join('');
    }

    /***/
  }),
/* 43 */
/***/ (function (module, exports) {

    exports.read = function (buffer, offset, isLE, mLen, nBytes) {
      var e, m;
      var eLen = nBytes * 8 - mLen - 1;
      var eMax = (1 << eLen) - 1;
      var eBias = eMax >> 1;
      var nBits = -7;
      var i = isLE ? nBytes - 1 : 0;
      var d = isLE ? -1 : 1;
      var s = buffer[offset + i];
      i += d;
      e = s & (1 << -nBits) - 1;
      s >>= -nBits;
      nBits += eLen;

      for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) { }

      m = e & (1 << -nBits) - 1;
      e >>= -nBits;
      nBits += mLen;

      for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) { }

      if (e === 0) {
        e = 1 - eBias;
      } else if (e === eMax) {
        return m ? NaN : (s ? -1 : 1) * Infinity;
      } else {
        m = m + Math.pow(2, mLen);
        e = e - eBias;
      }

      return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
    };

    exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
      var e, m, c;
      var eLen = nBytes * 8 - mLen - 1;
      var eMax = (1 << eLen) - 1;
      var eBias = eMax >> 1;
      var rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
      var i = isLE ? 0 : nBytes - 1;
      var d = isLE ? 1 : -1;
      var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;
      value = Math.abs(value);

      if (isNaN(value) || value === Infinity) {
        m = isNaN(value) ? 1 : 0;
        e = eMax;
      } else {
        e = Math.floor(Math.log(value) / Math.LN2);

        if (value * (c = Math.pow(2, -e)) < 1) {
          e--;
          c *= 2;
        }

        if (e + eBias >= 1) {
          value += rt / c;
        } else {
          value += rt * Math.pow(2, 1 - eBias);
        }

        if (value * c >= 2) {
          e++;
          c /= 2;
        }

        if (e + eBias >= eMax) {
          m = 0;
          e = eMax;
        } else if (e + eBias >= 1) {
          m = (value * c - 1) * Math.pow(2, mLen);
          e = e + eBias;
        } else {
          m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
          e = 0;
        }
      }

      for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) { }

      e = e << mLen | m;
      eLen += mLen;

      for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) { }

      buffer[offset + i - d] |= s * 128;
    };

    /***/
  }),
/* 44 */
/***/ (function (module, exports) {

    var toString = {}.toString;

    module.exports = Array.isArray || function (arr) {
      return toString.call(arr) == '[object Array]';
    };

    /***/
  }),
/* 45 */
/***/ (function (module, exports) {

    // shim for using process in browser
    var process = module.exports = {}; // cached from whatever global is present so that test runners that stub it
    // don't break things.  But we need to wrap it in a try catch in case it is
    // wrapped in strict mode code which doesn't define any globals.  It's inside a
    // function because try/catches deoptimize in certain engines.

    var cachedSetTimeout;
    var cachedClearTimeout;

    function defaultSetTimout () {
      throw new Error('setTimeout has not been defined');
    }

    function defaultClearTimeout () {
      throw new Error('clearTimeout has not been defined');
    }

    (function () {
      try {
        if (typeof setTimeout === 'function') {
          cachedSetTimeout = setTimeout;
        } else {
          cachedSetTimeout = defaultSetTimout;
        }
      } catch (e) {
        cachedSetTimeout = defaultSetTimout;
      }

      try {
        if (typeof clearTimeout === 'function') {
          cachedClearTimeout = clearTimeout;
        } else {
          cachedClearTimeout = defaultClearTimeout;
        }
      } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
      }
    })();

    function runTimeout (fun) {
      if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
      } // if setTimeout wasn't available but was latter defined


      if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
      }

      try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
      } catch (e) {
        try {
          // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
          return cachedSetTimeout.call(null, fun, 0);
        } catch (e) {
          // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
          return cachedSetTimeout.call(this, fun, 0);
        }
      }
    }

    function runClearTimeout (marker) {
      if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
      } // if clearTimeout wasn't available but was latter defined


      if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
      }

      try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
      } catch (e) {
        try {
          // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
          return cachedClearTimeout.call(null, marker);
        } catch (e) {
          // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
          // Some versions of I.E. have different rules for clearTimeout vs setTimeout
          return cachedClearTimeout.call(this, marker);
        }
      }
    }

    var queue = [];
    var draining = false;
    var currentQueue;
    var queueIndex = -1;

    function cleanUpNextTick () {
      if (!draining || !currentQueue) {
        return;
      }

      draining = false;

      if (currentQueue.length) {
        queue = currentQueue.concat(queue);
      } else {
        queueIndex = -1;
      }

      if (queue.length) {
        drainQueue();
      }
    }

    function drainQueue () {
      if (draining) {
        return;
      }

      var timeout = runTimeout(cleanUpNextTick);
      draining = true;
      var len = queue.length;

      while (len) {
        currentQueue = queue;
        queue = [];

        while (++queueIndex < len) {
          if (currentQueue) {
            currentQueue[queueIndex].run();
          }
        }

        queueIndex = -1;
        len = queue.length;
      }

      currentQueue = null;
      draining = false;
      runClearTimeout(timeout);
    }

    process.nextTick = function (fun) {
      var args = new Array(arguments.length - 1);

      if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
          args[i - 1] = arguments[i];
        }
      }

      queue.push(new Item(fun, args));

      if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
      }
    }; // v8 likes predictible objects


    function Item (fun, array) {
      this.fun = fun;
      this.array = array;
    }

    Item.prototype.run = function () {
      this.fun.apply(null, this.array);
    };

    process.title = 'browser';
    process.browser = true;
    process.env = {};
    process.argv = [];
    process.version = ''; // empty string to avoid regexp issues

    process.versions = {};

    function noop () { }

    process.on = noop;
    process.addListener = noop;
    process.once = noop;
    process.off = noop;
    process.removeListener = noop;
    process.removeAllListeners = noop;
    process.emit = noop;
    process.prependListener = noop;
    process.prependOnceListener = noop;

    process.listeners = function (name) {
      return [];
    };

    process.binding = function (name) {
      throw new Error('process.binding is not supported');
    };

    process.cwd = function () {
      return '/';
    };

    process.chdir = function (dir) {
      throw new Error('process.chdir is not supported');
    };

    process.umask = function () {
      return 0;
    };

    /***/
  }),
/* 46 */
/***/ (function (module, exports, __webpack_require__) {

    "use strict";
    // The MIT License (MIT)
    //
    // Copyright (c) 2016 Zhipeng Jia
    //
    // Permission is hereby granted, free of charge, to any person obtaining a copy
    // of this software and associated documentation files (the "Software"), to deal
    // in the Software without restriction, including without limitation the rights
    // to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    // copies of the Software, and to permit persons to whom the Software is
    // furnished to do so, subject to the following conditions:
    //
    // The above copyright notice and this permission notice shall be included in all
    // copies or substantial portions of the Software.
    //
    // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    // IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    // FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    // AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    // LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    // OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    // SOFTWARE.


    var WORD_MASK = [0, 0xff, 0xffff, 0xffffff, 0xffffffff];

    function copyBytes (fromArray, fromPos, toArray, toPos, length) {
      var i;

      for (i = 0; i < length; i++) {
        toArray[toPos + i] = fromArray[fromPos + i];
      }
    }

    function selfCopyBytes (array, pos, offset, length) {
      var i;

      for (i = 0; i < length; i++) {
        array[pos + i] = array[pos - offset + i];
      }
    }

    function SnappyDecompressor (compressed) {
      this.array = compressed;
      this.pos = 0;
    }

    SnappyDecompressor.prototype.readUncompressedLength = function () {
      var result = 0;
      var shift = 0;
      var c, val;

      while (shift < 32 && this.pos < this.array.length) {
        c = this.array[this.pos];
        this.pos += 1;
        val = c & 0x7f;

        if (val << shift >>> shift !== val) {
          return -1;
        }

        result |= val << shift;

        if (c < 128) {
          return result;
        }

        shift += 7;
      }

      return -1;
    };

    SnappyDecompressor.prototype.uncompressToBuffer = function (outBuffer) {
      var array = this.array;
      var arrayLength = array.length;
      var pos = this.pos;
      var outPos = 0;
      var c, len, smallLen;
      var offset;

      while (pos < array.length) {
        c = array[pos];
        pos += 1;

        if ((c & 0x3) === 0) {
          // Literal
          len = (c >>> 2) + 1;

          if (len > 60) {
            if (pos + 3 >= arrayLength) {
              return false;
            }

            smallLen = len - 60;
            len = array[pos] + (array[pos + 1] << 8) + (array[pos + 2] << 16) + (array[pos + 3] << 24);
            len = (len & WORD_MASK[smallLen]) + 1;
            pos += smallLen;
          }

          if (pos + len > arrayLength) {
            return false;
          }

          copyBytes(array, pos, outBuffer, outPos, len);
          pos += len;
          outPos += len;
        } else {
          switch (c & 0x3) {
            case 1:
              len = (c >>> 2 & 0x7) + 4;
              offset = array[pos] + (c >>> 5 << 8);
              pos += 1;
              break;

            case 2:
              if (pos + 1 >= arrayLength) {
                return false;
              }

              len = (c >>> 2) + 1;
              offset = array[pos] + (array[pos + 1] << 8);
              pos += 2;
              break;

            case 3:
              if (pos + 3 >= arrayLength) {
                return false;
              }

              len = (c >>> 2) + 1;
              offset = array[pos] + (array[pos + 1] << 8) + (array[pos + 2] << 16) + (array[pos + 3] << 24);
              pos += 4;
              break;

            default:
              break;
          }

          if (offset === 0 || offset > outPos) {
            return false;
          }

          selfCopyBytes(outBuffer, outPos, offset, len);
          outPos += len;
        }
      }

      return true;
    };

    exports.SnappyDecompressor = SnappyDecompressor;

    /***/
  }),
/* 47 */
/***/ (function (module, exports, __webpack_require__) {

    "use strict";
    // The MIT License (MIT)
    //
    // Copyright (c) 2016 Zhipeng Jia
    //
    // Permission is hereby granted, free of charge, to any person obtaining a copy
    // of this software and associated documentation files (the "Software"), to deal
    // in the Software without restriction, including without limitation the rights
    // to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    // copies of the Software, and to permit persons to whom the Software is
    // furnished to do so, subject to the following conditions:
    //
    // The above copyright notice and this permission notice shall be included in all
    // copies or substantial portions of the Software.
    //
    // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    // IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    // FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    // AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    // LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    // OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    // SOFTWARE.


    var BLOCK_LOG = 16;
    var BLOCK_SIZE = 1 << BLOCK_LOG;
    var MAX_HASH_TABLE_BITS = 14;
    var globalHashTables = new Array(MAX_HASH_TABLE_BITS + 1);

    function hashFunc (key, hashFuncShift) {
      return key * 0x1e35a7bd >>> hashFuncShift;
    }

    function load32 (array, pos) {
      return array[pos] + (array[pos + 1] << 8) + (array[pos + 2] << 16) + (array[pos + 3] << 24);
    }

    function equals32 (array, pos1, pos2) {
      return array[pos1] === array[pos2] && array[pos1 + 1] === array[pos2 + 1] && array[pos1 + 2] === array[pos2 + 2] && array[pos1 + 3] === array[pos2 + 3];
    }

    function copyBytes (fromArray, fromPos, toArray, toPos, length) {
      var i;

      for (i = 0; i < length; i++) {
        toArray[toPos + i] = fromArray[fromPos + i];
      }
    }

    function emitLiteral (input, ip, len, output, op) {
      if (len <= 60) {
        output[op] = len - 1 << 2;
        op += 1;
      } else if (len < 256) {
        output[op] = 60 << 2;
        output[op + 1] = len - 1;
        op += 2;
      } else {
        output[op] = 61 << 2;
        output[op + 1] = len - 1 & 0xff;
        output[op + 2] = len - 1 >>> 8;
        op += 3;
      }

      copyBytes(input, ip, output, op, len);
      return op + len;
    }

    function emitCopyLessThan64 (output, op, offset, len) {
      if (len < 12 && offset < 2048) {
        output[op] = 1 + (len - 4 << 2) + (offset >>> 8 << 5);
        output[op + 1] = offset & 0xff;
        return op + 2;
      } else {
        output[op] = 2 + (len - 1 << 2);
        output[op + 1] = offset & 0xff;
        output[op + 2] = offset >>> 8;
        return op + 3;
      }
    }

    function emitCopy (output, op, offset, len) {
      while (len >= 68) {
        op = emitCopyLessThan64(output, op, offset, 64);
        len -= 64;
      }

      if (len > 64) {
        op = emitCopyLessThan64(output, op, offset, 60);
        len -= 60;
      }

      return emitCopyLessThan64(output, op, offset, len);
    }

    function compressFragment (input, ip, inputSize, output, op) {
      var hashTableBits = 1;

      while (1 << hashTableBits <= inputSize && hashTableBits <= MAX_HASH_TABLE_BITS) {
        hashTableBits += 1;
      }

      hashTableBits -= 1;
      var hashFuncShift = 32 - hashTableBits;

      if (typeof globalHashTables[hashTableBits] === 'undefined') {
        globalHashTables[hashTableBits] = new Uint16Array(1 << hashTableBits);
      }

      var hashTable = globalHashTables[hashTableBits];
      var i;

      for (i = 0; i < hashTable.length; i++) {
        hashTable[i] = 0;
      }

      var ipEnd = ip + inputSize;
      var ipLimit;
      var baseIp = ip;
      var nextEmit = ip;
      var hash, nextHash;
      var nextIp, candidate, skip;
      var bytesBetweenHashLookups;
      var base, matched, offset;
      var prevHash, curHash;
      var flag = true;
      var INPUT_MARGIN = 15;

      if (inputSize >= INPUT_MARGIN) {
        ipLimit = ipEnd - INPUT_MARGIN;
        ip += 1;
        nextHash = hashFunc(load32(input, ip), hashFuncShift);

        while (flag) {
          skip = 32;
          nextIp = ip;

          do {
            ip = nextIp;
            hash = nextHash;
            bytesBetweenHashLookups = skip >>> 5;
            skip += 1;
            nextIp = ip + bytesBetweenHashLookups;

            if (ip > ipLimit) {
              flag = false;
              break;
            }

            nextHash = hashFunc(load32(input, nextIp), hashFuncShift);
            candidate = baseIp + hashTable[hash];
            hashTable[hash] = ip - baseIp;
          } while (!equals32(input, ip, candidate));

          if (!flag) {
            break;
          }

          op = emitLiteral(input, nextEmit, ip - nextEmit, output, op);

          do {
            base = ip;
            matched = 4;

            while (ip + matched < ipEnd && input[ip + matched] === input[candidate + matched]) {
              matched += 1;
            }

            ip += matched;
            offset = base - candidate;
            op = emitCopy(output, op, offset, matched);
            nextEmit = ip;

            if (ip >= ipLimit) {
              flag = false;
              break;
            }

            prevHash = hashFunc(load32(input, ip - 1), hashFuncShift);
            hashTable[prevHash] = ip - 1 - baseIp;
            curHash = hashFunc(load32(input, ip), hashFuncShift);
            candidate = baseIp + hashTable[curHash];
            hashTable[curHash] = ip - baseIp;
          } while (equals32(input, ip, candidate));

          if (!flag) {
            break;
          }

          ip += 1;
          nextHash = hashFunc(load32(input, ip), hashFuncShift);
        }
      }

      if (nextEmit < ipEnd) {
        op = emitLiteral(input, nextEmit, ipEnd - nextEmit, output, op);
      }

      return op;
    }

    function putVarint (value, output, op) {
      do {
        output[op] = value & 0x7f;
        value = value >>> 7;

        if (value > 0) {
          output[op] += 0x80;
        }

        op += 1;
      } while (value > 0);

      return op;
    }

    function SnappyCompressor (uncompressed) {
      this.array = uncompressed;
    }

    SnappyCompressor.prototype.maxCompressedLength = function () {
      var sourceLen = this.array.length;
      return 32 + sourceLen + Math.floor(sourceLen / 6);
    };

    SnappyCompressor.prototype.compressToBuffer = function (outBuffer) {
      var array = this.array;
      var length = array.length;
      var pos = 0;
      var outPos = 0;
      var fragmentSize;
      outPos = putVarint(length, outBuffer, outPos);

      while (pos < length) {
        fragmentSize = Math.min(length - pos, BLOCK_SIZE);
        outPos = compressFragment(array, pos, fragmentSize, outBuffer, outPos);
        pos += fragmentSize;
      }

      return outPos;
    };

    exports.SnappyCompressor = SnappyCompressor;

    /***/
  })
/******/]);