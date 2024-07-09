/**
 * @license
 * Cesium - https://github.com/CesiumGS/cesium
 * Version 1.97
 *
 * Copyright 2011-2022 Cesium Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Columbus View (Pat. Pend.)
 *
 * Portions licensed separately.
 * See https://github.com/CesiumGS/cesium/blob/main/LICENSE.md for full licensing details.
 */

define(['require', 'exports', './_commonjsHelpers-89c9b271', './Check-0f680516', './defined-a5305fd6', './combine-eceb7722', './defer-bfc6471e', './Math-79d70b44', './RuntimeError-8d8b6ef6'], (function (require, exports, _commonjsHelpers, Check, defined, combine, defer, Math$1, RuntimeError) { 'use strict';

	function _interopNamespace(e) {
		if (e && e.__esModule) return e;
		var n = Object.create(null);
		if (e) {
			Object.keys(e).forEach(function (k) {
				if (k !== 'default') {
					var d = Object.getOwnPropertyDescriptor(e, k);
					Object.defineProperty(n, k, d.get ? d : {
						enumerable: true,
						get: function () { return e[k]; }
					});
				}
			});
		}
		n["default"] = e;
		return Object.freeze(n);
	}

	var punycode = _commonjsHelpers.createCommonjsModule(function (module, exports) {
	(function(root) {

		/** Detect free variables */
		var freeExports = exports &&
			!exports.nodeType && exports;
		var freeModule = module &&
			!module.nodeType && module;
		var freeGlobal = typeof _commonjsHelpers.commonjsGlobal == 'object' && _commonjsHelpers.commonjsGlobal;
		if (
			freeGlobal.global === freeGlobal ||
			freeGlobal.window === freeGlobal ||
			freeGlobal.self === freeGlobal
		) {
			root = freeGlobal;
		}

		/**
		 * The `punycode` object.
		 * @name punycode
		 * @type Object
		 */
		var punycode,

		/** Highest positive signed 32-bit float value */
		maxInt = 2147483647, // aka. 0x7FFFFFFF or 2^31-1

		/** Bootstring parameters */
		base = 36,
		tMin = 1,
		tMax = 26,
		skew = 38,
		damp = 700,
		initialBias = 72,
		initialN = 128, // 0x80
		delimiter = '-', // '\x2D'

		/** Regular expressions */
		regexPunycode = /^xn--/,
		regexNonASCII = /[^\x20-\x7E]/, // unprintable ASCII chars + non-ASCII chars
		regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g, // RFC 3490 separators

		/** Error messages */
		errors = {
			'overflow': 'Overflow: input needs wider integers to process',
			'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
			'invalid-input': 'Invalid input'
		},

		/** Convenience shortcuts */
		baseMinusTMin = base - tMin,
		floor = Math.floor,
		stringFromCharCode = String.fromCharCode,

		/** Temporary variable */
		key;

		/*--------------------------------------------------------------------------*/

		/**
		 * A generic error utility function.
		 * @private
		 * @param {String} type The error type.
		 * @returns {Error} Throws a `RangeError` with the applicable error message.
		 */
		function error(type) {
			throw new RangeError(errors[type]);
		}

		/**
		 * A generic `Array#map` utility function.
		 * @private
		 * @param {Array} array The array to iterate over.
		 * @param {Function} callback The function that gets called for every array
		 * item.
		 * @returns {Array} A new array of values returned by the callback function.
		 */
		function map(array, fn) {
			var length = array.length;
			var result = [];
			while (length--) {
				result[length] = fn(array[length]);
			}
			return result;
		}

		/**
		 * A simple `Array#map`-like wrapper to work with domain name strings or email
		 * addresses.
		 * @private
		 * @param {String} domain The domain name or email address.
		 * @param {Function} callback The function that gets called for every
		 * character.
		 * @returns {Array} A new string of characters returned by the callback
		 * function.
		 */
		function mapDomain(string, fn) {
			var parts = string.split('@');
			var result = '';
			if (parts.length > 1) {
				// In email addresses, only the domain name should be punycoded. Leave
				// the local part (i.e. everything up to `@`) intact.
				result = parts[0] + '@';
				string = parts[1];
			}
			// Avoid `split(regex)` for IE8 compatibility. See #17.
			string = string.replace(regexSeparators, '\x2E');
			var labels = string.split('.');
			var encoded = map(labels, fn).join('.');
			return result + encoded;
		}

		/**
		 * Creates an array containing the numeric code points of each Unicode
		 * character in the string. While JavaScript uses UCS-2 internally,
		 * this function will convert a pair of surrogate halves (each of which
		 * UCS-2 exposes as separate characters) into a single code point,
		 * matching UTF-16.
		 * @see `punycode.ucs2.encode`
		 * @see <https://mathiasbynens.be/notes/javascript-encoding>
		 * @memberOf punycode.ucs2
		 * @name decode
		 * @param {String} string The Unicode input string (UCS-2).
		 * @returns {Array} The new array of code points.
		 */
		function ucs2decode(string) {
			var output = [],
			    counter = 0,
			    length = string.length,
			    value,
			    extra;
			while (counter < length) {
				value = string.charCodeAt(counter++);
				if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
					// high surrogate, and there is a next character
					extra = string.charCodeAt(counter++);
					if ((extra & 0xFC00) == 0xDC00) { // low surrogate
						output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
					} else {
						// unmatched surrogate; only append this code unit, in case the next
						// code unit is the high surrogate of a surrogate pair
						output.push(value);
						counter--;
					}
				} else {
					output.push(value);
				}
			}
			return output;
		}

		/**
		 * Creates a string based on an array of numeric code points.
		 * @see `punycode.ucs2.decode`
		 * @memberOf punycode.ucs2
		 * @name encode
		 * @param {Array} codePoints The array of numeric code points.
		 * @returns {String} The new Unicode string (UCS-2).
		 */
		function ucs2encode(array) {
			return map(array, function(value) {
				var output = '';
				if (value > 0xFFFF) {
					value -= 0x10000;
					output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
					value = 0xDC00 | value & 0x3FF;
				}
				output += stringFromCharCode(value);
				return output;
			}).join('');
		}

		/**
		 * Converts a basic code point into a digit/integer.
		 * @see `digitToBasic()`
		 * @private
		 * @param {Number} codePoint The basic numeric code point value.
		 * @returns {Number} The numeric value of a basic code point (for use in
		 * representing integers) in the range `0` to `base - 1`, or `base` if
		 * the code point does not represent a value.
		 */
		function basicToDigit(codePoint) {
			if (codePoint - 48 < 10) {
				return codePoint - 22;
			}
			if (codePoint - 65 < 26) {
				return codePoint - 65;
			}
			if (codePoint - 97 < 26) {
				return codePoint - 97;
			}
			return base;
		}

		/**
		 * Converts a digit/integer into a basic code point.
		 * @see `basicToDigit()`
		 * @private
		 * @param {Number} digit The numeric value of a basic code point.
		 * @returns {Number} The basic code point whose value (when used for
		 * representing integers) is `digit`, which needs to be in the range
		 * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
		 * used; else, the lowercase form is used. The behavior is undefined
		 * if `flag` is non-zero and `digit` has no uppercase form.
		 */
		function digitToBasic(digit, flag) {
			//  0..25 map to ASCII a..z or A..Z
			// 26..35 map to ASCII 0..9
			return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
		}

		/**
		 * Bias adaptation function as per section 3.4 of RFC 3492.
		 * https://tools.ietf.org/html/rfc3492#section-3.4
		 * @private
		 */
		function adapt(delta, numPoints, firstTime) {
			var k = 0;
			delta = firstTime ? floor(delta / damp) : delta >> 1;
			delta += floor(delta / numPoints);
			for (/* no initialization */; delta > baseMinusTMin * tMax >> 1; k += base) {
				delta = floor(delta / baseMinusTMin);
			}
			return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
		}

		/**
		 * Converts a Punycode string of ASCII-only symbols to a string of Unicode
		 * symbols.
		 * @memberOf punycode
		 * @param {String} input The Punycode string of ASCII-only symbols.
		 * @returns {String} The resulting string of Unicode symbols.
		 */
		function decode(input) {
			// Don't use UCS-2
			var output = [],
			    inputLength = input.length,
			    out,
			    i = 0,
			    n = initialN,
			    bias = initialBias,
			    basic,
			    j,
			    index,
			    oldi,
			    w,
			    k,
			    digit,
			    t,
			    /** Cached calculation results */
			    baseMinusT;

			// Handle the basic code points: let `basic` be the number of input code
			// points before the last delimiter, or `0` if there is none, then copy
			// the first basic code points to the output.

			basic = input.lastIndexOf(delimiter);
			if (basic < 0) {
				basic = 0;
			}

			for (j = 0; j < basic; ++j) {
				// if it's not a basic code point
				if (input.charCodeAt(j) >= 0x80) {
					error('not-basic');
				}
				output.push(input.charCodeAt(j));
			}

			// Main decoding loop: start just after the last delimiter if any basic code
			// points were copied; start at the beginning otherwise.

			for (index = basic > 0 ? basic + 1 : 0; index < inputLength; /* no final expression */) {

				// `index` is the index of the next character to be consumed.
				// Decode a generalized variable-length integer into `delta`,
				// which gets added to `i`. The overflow checking is easier
				// if we increase `i` as we go, then subtract off its starting
				// value at the end to obtain `delta`.
				for (oldi = i, w = 1, k = base; /* no condition */; k += base) {

					if (index >= inputLength) {
						error('invalid-input');
					}

					digit = basicToDigit(input.charCodeAt(index++));

					if (digit >= base || digit > floor((maxInt - i) / w)) {
						error('overflow');
					}

					i += digit * w;
					t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);

					if (digit < t) {
						break;
					}

					baseMinusT = base - t;
					if (w > floor(maxInt / baseMinusT)) {
						error('overflow');
					}

					w *= baseMinusT;

				}

				out = output.length + 1;
				bias = adapt(i - oldi, out, oldi == 0);

				// `i` was supposed to wrap around from `out` to `0`,
				// incrementing `n` each time, so we'll fix that now:
				if (floor(i / out) > maxInt - n) {
					error('overflow');
				}

				n += floor(i / out);
				i %= out;

				// Insert `n` at position `i` of the output
				output.splice(i++, 0, n);

			}

			return ucs2encode(output);
		}

		/**
		 * Converts a string of Unicode symbols (e.g. a domain name label) to a
		 * Punycode string of ASCII-only symbols.
		 * @memberOf punycode
		 * @param {String} input The string of Unicode symbols.
		 * @returns {String} The resulting Punycode string of ASCII-only symbols.
		 */
		function encode(input) {
			var n,
			    delta,
			    handledCPCount,
			    basicLength,
			    bias,
			    j,
			    m,
			    q,
			    k,
			    t,
			    currentValue,
			    output = [],
			    /** `inputLength` will hold the number of code points in `input`. */
			    inputLength,
			    /** Cached calculation results */
			    handledCPCountPlusOne,
			    baseMinusT,
			    qMinusT;

			// Convert the input in UCS-2 to Unicode
			input = ucs2decode(input);

			// Cache the length
			inputLength = input.length;

			// Initialize the state
			n = initialN;
			delta = 0;
			bias = initialBias;

			// Handle the basic code points
			for (j = 0; j < inputLength; ++j) {
				currentValue = input[j];
				if (currentValue < 0x80) {
					output.push(stringFromCharCode(currentValue));
				}
			}

			handledCPCount = basicLength = output.length;

			// `handledCPCount` is the number of code points that have been handled;
			// `basicLength` is the number of basic code points.

			// Finish the basic string - if it is not empty - with a delimiter
			if (basicLength) {
				output.push(delimiter);
			}

			// Main encoding loop:
			while (handledCPCount < inputLength) {

				// All non-basic code points < n have been handled already. Find the next
				// larger one:
				for (m = maxInt, j = 0; j < inputLength; ++j) {
					currentValue = input[j];
					if (currentValue >= n && currentValue < m) {
						m = currentValue;
					}
				}

				// Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
				// but guard against overflow
				handledCPCountPlusOne = handledCPCount + 1;
				if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
					error('overflow');
				}

				delta += (m - n) * handledCPCountPlusOne;
				n = m;

				for (j = 0; j < inputLength; ++j) {
					currentValue = input[j];

					if (currentValue < n && ++delta > maxInt) {
						error('overflow');
					}

					if (currentValue == n) {
						// Represent delta as a generalized variable-length integer
						for (q = delta, k = base; /* no condition */; k += base) {
							t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
							if (q < t) {
								break;
							}
							qMinusT = q - t;
							baseMinusT = base - t;
							output.push(
								stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
							);
							q = floor(qMinusT / baseMinusT);
						}

						output.push(stringFromCharCode(digitToBasic(q, 0)));
						bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
						delta = 0;
						++handledCPCount;
					}
				}

				++delta;
				++n;

			}
			return output.join('');
		}

		/**
		 * Converts a Punycode string representing a domain name or an email address
		 * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
		 * it doesn't matter if you call it on a string that has already been
		 * converted to Unicode.
		 * @memberOf punycode
		 * @param {String} input The Punycoded domain name or email address to
		 * convert to Unicode.
		 * @returns {String} The Unicode representation of the given Punycode
		 * string.
		 */
		function toUnicode(input) {
			return mapDomain(input, function(string) {
				return regexPunycode.test(string)
					? decode(string.slice(4).toLowerCase())
					: string;
			});
		}

		/**
		 * Converts a Unicode string representing a domain name or an email address to
		 * Punycode. Only the non-ASCII parts of the domain name will be converted,
		 * i.e. it doesn't matter if you call it with a domain that's already in
		 * ASCII.
		 * @memberOf punycode
		 * @param {String} input The domain name or email address to convert, as a
		 * Unicode string.
		 * @returns {String} The Punycode representation of the given domain name or
		 * email address.
		 */
		function toASCII(input) {
			return mapDomain(input, function(string) {
				return regexNonASCII.test(string)
					? 'xn--' + encode(string)
					: string;
			});
		}

		/*--------------------------------------------------------------------------*/

		/** Define the public API */
		punycode = {
			/**
			 * A string representing the current Punycode.js version number.
			 * @memberOf punycode
			 * @type String
			 */
			'version': '1.3.2',
			/**
			 * An object of methods to convert from JavaScript's internal character
			 * representation (UCS-2) to Unicode code points, and back.
			 * @see <https://mathiasbynens.be/notes/javascript-encoding>
			 * @memberOf punycode
			 * @type Object
			 */
			'ucs2': {
				'decode': ucs2decode,
				'encode': ucs2encode
			},
			'decode': decode,
			'encode': encode,
			'toASCII': toASCII,
			'toUnicode': toUnicode
		};

		/** Expose `punycode` */
		// Some AMD build optimizers, like r.js, check for specific condition patterns
		// like the following:
		if (freeExports && freeModule) {
			if (module.exports == freeExports) {
				// in Node.js, io.js, or RingoJS v0.8.0+
				freeModule.exports = punycode;
			} else {
				// in Narwhal or RingoJS v0.7.0-
				for (key in punycode) {
					punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
				}
			}
		} else {
			// in Rhino or a web browser
			root.punycode = punycode;
		}

	}(_commonjsHelpers.commonjsGlobal));
	});

	var IPv6 = _commonjsHelpers.createCommonjsModule(function (module) {
	/*!
	 * URI.js - Mutating URLs
	 * IPv6 Support
	 *
	 * Version: 1.19.11
	 *
	 * Author: Rodney Rehm
	 * Web: http://medialize.github.io/URI.js/
	 *
	 * Licensed under
	 *   MIT License http://www.opensource.org/licenses/mit-license
	 *
	 */

	(function (root, factory) {
	  // https://github.com/umdjs/umd/blob/master/returnExports.js
	  if (module.exports) {
	    // Node
	    module.exports = factory();
	  } else {
	    // Browser globals (root is window)
	    root.IPv6 = factory(root);
	  }
	}(_commonjsHelpers.commonjsGlobal, function (root) {

	  /*
	  var _in = "fe80:0000:0000:0000:0204:61ff:fe9d:f156";
	  var _out = IPv6.best(_in);
	  var _expected = "fe80::204:61ff:fe9d:f156";

	  console.log(_in, _out, _expected, _out === _expected);
	  */

	  // save current IPv6 variable, if any
	  var _IPv6 = root && root.IPv6;

	  function bestPresentation(address) {
	    // based on:
	    // Javascript to test an IPv6 address for proper format, and to
	    // present the "best text representation" according to IETF Draft RFC at
	    // http://tools.ietf.org/html/draft-ietf-6man-text-addr-representation-04
	    // 8 Feb 2010 Rich Brown, Dartware, LLC
	    // Please feel free to use this code as long as you provide a link to
	    // http://www.intermapper.com
	    // http://intermapper.com/support/tools/IPV6-Validator.aspx
	    // http://download.dartware.com/thirdparty/ipv6validator.js

	    var _address = address.toLowerCase();
	    var segments = _address.split(':');
	    var length = segments.length;
	    var total = 8;

	    // trim colons (:: or ::a:b:c… or …a:b:c::)
	    if (segments[0] === '' && segments[1] === '' && segments[2] === '') {
	      // must have been ::
	      // remove first two items
	      segments.shift();
	      segments.shift();
	    } else if (segments[0] === '' && segments[1] === '') {
	      // must have been ::xxxx
	      // remove the first item
	      segments.shift();
	    } else if (segments[length - 1] === '' && segments[length - 2] === '') {
	      // must have been xxxx::
	      segments.pop();
	    }

	    length = segments.length;

	    // adjust total segments for IPv4 trailer
	    if (segments[length - 1].indexOf('.') !== -1) {
	      // found a "." which means IPv4
	      total = 7;
	    }

	    // fill empty segments them with "0000"
	    var pos;
	    for (pos = 0; pos < length; pos++) {
	      if (segments[pos] === '') {
	        break;
	      }
	    }

	    if (pos < total) {
	      segments.splice(pos, 1, '0000');
	      while (segments.length < total) {
	        segments.splice(pos, 0, '0000');
	      }
	    }

	    // strip leading zeros
	    var _segments;
	    for (var i = 0; i < total; i++) {
	      _segments = segments[i].split('');
	      for (var j = 0; j < 3 ; j++) {
	        if (_segments[0] === '0' && _segments.length > 1) {
	          _segments.splice(0,1);
	        } else {
	          break;
	        }
	      }

	      segments[i] = _segments.join('');
	    }

	    // find longest sequence of zeroes and coalesce them into one segment
	    var best = -1;
	    var _best = 0;
	    var _current = 0;
	    var current = -1;
	    var inzeroes = false;
	    // i; already declared

	    for (i = 0; i < total; i++) {
	      if (inzeroes) {
	        if (segments[i] === '0') {
	          _current += 1;
	        } else {
	          inzeroes = false;
	          if (_current > _best) {
	            best = current;
	            _best = _current;
	          }
	        }
	      } else {
	        if (segments[i] === '0') {
	          inzeroes = true;
	          current = i;
	          _current = 1;
	        }
	      }
	    }

	    if (_current > _best) {
	      best = current;
	      _best = _current;
	    }

	    if (_best > 1) {
	      segments.splice(best, _best, '');
	    }

	    length = segments.length;

	    // assemble remaining segments
	    var result = '';
	    if (segments[0] === '')  {
	      result = ':';
	    }

	    for (i = 0; i < length; i++) {
	      result += segments[i];
	      if (i === length - 1) {
	        break;
	      }

	      result += ':';
	    }

	    if (segments[length - 1] === '') {
	      result += ':';
	    }

	    return result;
	  }

	  function noConflict() {
	    /*jshint validthis: true */
	    if (root.IPv6 === this) {
	      root.IPv6 = _IPv6;
	    }

	    return this;
	  }

	  return {
	    best: bestPresentation,
	    noConflict: noConflict
	  };
	}));
	});

	var SecondLevelDomains = _commonjsHelpers.createCommonjsModule(function (module) {
	/*!
	 * URI.js - Mutating URLs
	 * Second Level Domain (SLD) Support
	 *
	 * Version: 1.19.11
	 *
	 * Author: Rodney Rehm
	 * Web: http://medialize.github.io/URI.js/
	 *
	 * Licensed under
	 *   MIT License http://www.opensource.org/licenses/mit-license
	 *
	 */

	(function (root, factory) {
	  // https://github.com/umdjs/umd/blob/master/returnExports.js
	  if (module.exports) {
	    // Node
	    module.exports = factory();
	  } else {
	    // Browser globals (root is window)
	    root.SecondLevelDomains = factory(root);
	  }
	}(_commonjsHelpers.commonjsGlobal, function (root) {

	  // save current SecondLevelDomains variable, if any
	  var _SecondLevelDomains = root && root.SecondLevelDomains;

	  var SLD = {
	    // list of known Second Level Domains
	    // converted list of SLDs from https://github.com/gavingmiller/second-level-domains
	    // ----
	    // publicsuffix.org is more current and actually used by a couple of browsers internally.
	    // downside is it also contains domains like "dyndns.org" - which is fine for the security
	    // issues browser have to deal with (SOP for cookies, etc) - but is way overboard for URI.js
	    // ----
	    list: {
	      'ac':' com gov mil net org ',
	      'ae':' ac co gov mil name net org pro sch ',
	      'af':' com edu gov net org ',
	      'al':' com edu gov mil net org ',
	      'ao':' co ed gv it og pb ',
	      'ar':' com edu gob gov int mil net org tur ',
	      'at':' ac co gv or ',
	      'au':' asn com csiro edu gov id net org ',
	      'ba':' co com edu gov mil net org rs unbi unmo unsa untz unze ',
	      'bb':' biz co com edu gov info net org store tv ',
	      'bh':' biz cc com edu gov info net org ',
	      'bn':' com edu gov net org ',
	      'bo':' com edu gob gov int mil net org tv ',
	      'br':' adm adv agr am arq art ato b bio blog bmd cim cng cnt com coop ecn edu eng esp etc eti far flog fm fnd fot fst g12 ggf gov imb ind inf jor jus lel mat med mil mus net nom not ntr odo org ppg pro psc psi qsl rec slg srv tmp trd tur tv vet vlog wiki zlg ',
	      'bs':' com edu gov net org ',
	      'bz':' du et om ov rg ',
	      'ca':' ab bc mb nb nf nl ns nt nu on pe qc sk yk ',
	      'ck':' biz co edu gen gov info net org ',
	      'cn':' ac ah bj com cq edu fj gd gov gs gx gz ha hb he hi hl hn jl js jx ln mil net nm nx org qh sc sd sh sn sx tj tw xj xz yn zj ',
	      'co':' com edu gov mil net nom org ',
	      'cr':' ac c co ed fi go or sa ',
	      'cy':' ac biz com ekloges gov ltd name net org parliament press pro tm ',
	      'do':' art com edu gob gov mil net org sld web ',
	      'dz':' art asso com edu gov net org pol ',
	      'ec':' com edu fin gov info med mil net org pro ',
	      'eg':' com edu eun gov mil name net org sci ',
	      'er':' com edu gov ind mil net org rochest w ',
	      'es':' com edu gob nom org ',
	      'et':' biz com edu gov info name net org ',
	      'fj':' ac biz com info mil name net org pro ',
	      'fk':' ac co gov net nom org ',
	      'fr':' asso com f gouv nom prd presse tm ',
	      'gg':' co net org ',
	      'gh':' com edu gov mil org ',
	      'gn':' ac com gov net org ',
	      'gr':' com edu gov mil net org ',
	      'gt':' com edu gob ind mil net org ',
	      'gu':' com edu gov net org ',
	      'hk':' com edu gov idv net org ',
	      'hu':' 2000 agrar bolt casino city co erotica erotika film forum games hotel info ingatlan jogasz konyvelo lakas media news org priv reklam sex shop sport suli szex tm tozsde utazas video ',
	      'id':' ac co go mil net or sch web ',
	      'il':' ac co gov idf k12 muni net org ',
	      'in':' ac co edu ernet firm gen gov i ind mil net nic org res ',
	      'iq':' com edu gov i mil net org ',
	      'ir':' ac co dnssec gov i id net org sch ',
	      'it':' edu gov ',
	      'je':' co net org ',
	      'jo':' com edu gov mil name net org sch ',
	      'jp':' ac ad co ed go gr lg ne or ',
	      'ke':' ac co go info me mobi ne or sc ',
	      'kh':' com edu gov mil net org per ',
	      'ki':' biz com de edu gov info mob net org tel ',
	      'km':' asso com coop edu gouv k medecin mil nom notaires pharmaciens presse tm veterinaire ',
	      'kn':' edu gov net org ',
	      'kr':' ac busan chungbuk chungnam co daegu daejeon es gangwon go gwangju gyeongbuk gyeonggi gyeongnam hs incheon jeju jeonbuk jeonnam k kg mil ms ne or pe re sc seoul ulsan ',
	      'kw':' com edu gov net org ',
	      'ky':' com edu gov net org ',
	      'kz':' com edu gov mil net org ',
	      'lb':' com edu gov net org ',
	      'lk':' assn com edu gov grp hotel int ltd net ngo org sch soc web ',
	      'lr':' com edu gov net org ',
	      'lv':' asn com conf edu gov id mil net org ',
	      'ly':' com edu gov id med net org plc sch ',
	      'ma':' ac co gov m net org press ',
	      'mc':' asso tm ',
	      'me':' ac co edu gov its net org priv ',
	      'mg':' com edu gov mil nom org prd tm ',
	      'mk':' com edu gov inf name net org pro ',
	      'ml':' com edu gov net org presse ',
	      'mn':' edu gov org ',
	      'mo':' com edu gov net org ',
	      'mt':' com edu gov net org ',
	      'mv':' aero biz com coop edu gov info int mil museum name net org pro ',
	      'mw':' ac co com coop edu gov int museum net org ',
	      'mx':' com edu gob net org ',
	      'my':' com edu gov mil name net org sch ',
	      'nf':' arts com firm info net other per rec store web ',
	      'ng':' biz com edu gov mil mobi name net org sch ',
	      'ni':' ac co com edu gob mil net nom org ',
	      'np':' com edu gov mil net org ',
	      'nr':' biz com edu gov info net org ',
	      'om':' ac biz co com edu gov med mil museum net org pro sch ',
	      'pe':' com edu gob mil net nom org sld ',
	      'ph':' com edu gov i mil net ngo org ',
	      'pk':' biz com edu fam gob gok gon gop gos gov net org web ',
	      'pl':' art bialystok biz com edu gda gdansk gorzow gov info katowice krakow lodz lublin mil net ngo olsztyn org poznan pwr radom slupsk szczecin torun warszawa waw wroc wroclaw zgora ',
	      'pr':' ac biz com edu est gov info isla name net org pro prof ',
	      'ps':' com edu gov net org plo sec ',
	      'pw':' belau co ed go ne or ',
	      'ro':' arts com firm info nom nt org rec store tm www ',
	      'rs':' ac co edu gov in org ',
	      'sb':' com edu gov net org ',
	      'sc':' com edu gov net org ',
	      'sh':' co com edu gov net nom org ',
	      'sl':' com edu gov net org ',
	      'st':' co com consulado edu embaixada gov mil net org principe saotome store ',
	      'sv':' com edu gob org red ',
	      'sz':' ac co org ',
	      'tr':' av bbs bel biz com dr edu gen gov info k12 name net org pol tel tsk tv web ',
	      'tt':' aero biz cat co com coop edu gov info int jobs mil mobi museum name net org pro tel travel ',
	      'tw':' club com ebiz edu game gov idv mil net org ',
	      'mu':' ac co com gov net or org ',
	      'mz':' ac co edu gov org ',
	      'na':' co com ',
	      'nz':' ac co cri geek gen govt health iwi maori mil net org parliament school ',
	      'pa':' abo ac com edu gob ing med net nom org sld ',
	      'pt':' com edu gov int net nome org publ ',
	      'py':' com edu gov mil net org ',
	      'qa':' com edu gov mil net org ',
	      're':' asso com nom ',
	      'ru':' ac adygeya altai amur arkhangelsk astrakhan bashkiria belgorod bir bryansk buryatia cbg chel chelyabinsk chita chukotka chuvashia com dagestan e-burg edu gov grozny int irkutsk ivanovo izhevsk jar joshkar-ola kalmykia kaluga kamchatka karelia kazan kchr kemerovo khabarovsk khakassia khv kirov koenig komi kostroma kranoyarsk kuban kurgan kursk lipetsk magadan mari mari-el marine mil mordovia mosreg msk murmansk nalchik net nnov nov novosibirsk nsk omsk orenburg org oryol penza perm pp pskov ptz rnd ryazan sakhalin samara saratov simbirsk smolensk spb stavropol stv surgut tambov tatarstan tom tomsk tsaritsyn tsk tula tuva tver tyumen udm udmurtia ulan-ude vladikavkaz vladimir vladivostok volgograd vologda voronezh vrn vyatka yakutia yamal yekaterinburg yuzhno-sakhalinsk ',
	      'rw':' ac co com edu gouv gov int mil net ',
	      'sa':' com edu gov med net org pub sch ',
	      'sd':' com edu gov info med net org tv ',
	      'se':' a ac b bd c d e f g h i k l m n o org p parti pp press r s t tm u w x y z ',
	      'sg':' com edu gov idn net org per ',
	      'sn':' art com edu gouv org perso univ ',
	      'sy':' com edu gov mil net news org ',
	      'th':' ac co go in mi net or ',
	      'tj':' ac biz co com edu go gov info int mil name net nic org test web ',
	      'tn':' agrinet com defense edunet ens fin gov ind info intl mincom nat net org perso rnrt rns rnu tourism ',
	      'tz':' ac co go ne or ',
	      'ua':' biz cherkassy chernigov chernovtsy ck cn co com crimea cv dn dnepropetrovsk donetsk dp edu gov if in ivano-frankivsk kh kharkov kherson khmelnitskiy kiev kirovograd km kr ks kv lg lugansk lutsk lviv me mk net nikolaev od odessa org pl poltava pp rovno rv sebastopol sumy te ternopil uzhgorod vinnica vn zaporizhzhe zhitomir zp zt ',
	      'ug':' ac co go ne or org sc ',
	      'uk':' ac bl british-library co cym gov govt icnet jet lea ltd me mil mod national-library-scotland nel net nhs nic nls org orgn parliament plc police sch scot soc ',
	      'us':' dni fed isa kids nsn ',
	      'uy':' com edu gub mil net org ',
	      've':' co com edu gob info mil net org web ',
	      'vi':' co com k12 net org ',
	      'vn':' ac biz com edu gov health info int name net org pro ',
	      'ye':' co com gov ltd me net org plc ',
	      'yu':' ac co edu gov org ',
	      'za':' ac agric alt bourse city co cybernet db edu gov grondar iaccess imt inca landesign law mil net ngo nis nom olivetti org pix school tm web ',
	      'zm':' ac co com edu gov net org sch ',
	      // https://en.wikipedia.org/wiki/CentralNic#Second-level_domains
	      'com': 'ar br cn de eu gb gr hu jpn kr no qc ru sa se uk us uy za ',
	      'net': 'gb jp se uk ',
	      'org': 'ae',
	      'de': 'com '
	    },
	    // gorhill 2013-10-25: Using indexOf() instead Regexp(). Significant boost
	    // in both performance and memory footprint. No initialization required.
	    // http://jsperf.com/uri-js-sld-regex-vs-binary-search/4
	    // Following methods use lastIndexOf() rather than array.split() in order
	    // to avoid any memory allocations.
	    has: function(domain) {
	      var tldOffset = domain.lastIndexOf('.');
	      if (tldOffset <= 0 || tldOffset >= (domain.length-1)) {
	        return false;
	      }
	      var sldOffset = domain.lastIndexOf('.', tldOffset-1);
	      if (sldOffset <= 0 || sldOffset >= (tldOffset-1)) {
	        return false;
	      }
	      var sldList = SLD.list[domain.slice(tldOffset+1)];
	      if (!sldList) {
	        return false;
	      }
	      return sldList.indexOf(' ' + domain.slice(sldOffset+1, tldOffset) + ' ') >= 0;
	    },
	    is: function(domain) {
	      var tldOffset = domain.lastIndexOf('.');
	      if (tldOffset <= 0 || tldOffset >= (domain.length-1)) {
	        return false;
	      }
	      var sldOffset = domain.lastIndexOf('.', tldOffset-1);
	      if (sldOffset >= 0) {
	        return false;
	      }
	      var sldList = SLD.list[domain.slice(tldOffset+1)];
	      if (!sldList) {
	        return false;
	      }
	      return sldList.indexOf(' ' + domain.slice(0, tldOffset) + ' ') >= 0;
	    },
	    get: function(domain) {
	      var tldOffset = domain.lastIndexOf('.');
	      if (tldOffset <= 0 || tldOffset >= (domain.length-1)) {
	        return null;
	      }
	      var sldOffset = domain.lastIndexOf('.', tldOffset-1);
	      if (sldOffset <= 0 || sldOffset >= (tldOffset-1)) {
	        return null;
	      }
	      var sldList = SLD.list[domain.slice(tldOffset+1)];
	      if (!sldList) {
	        return null;
	      }
	      if (sldList.indexOf(' ' + domain.slice(sldOffset+1, tldOffset) + ' ') < 0) {
	        return null;
	      }
	      return domain.slice(sldOffset+1);
	    },
	    noConflict: function(){
	      if (root.SecondLevelDomains === this) {
	        root.SecondLevelDomains = _SecondLevelDomains;
	      }
	      return this;
	    }
	  };

	  return SLD;
	}));
	});

	var URI = _commonjsHelpers.createCommonjsModule(function (module) {
	/*!
	 * URI.js - Mutating URLs
	 *
	 * Version: 1.19.11
	 *
	 * Author: Rodney Rehm
	 * Web: http://medialize.github.io/URI.js/
	 *
	 * Licensed under
	 *   MIT License http://www.opensource.org/licenses/mit-license
	 *
	 */
	(function (root, factory) {
	  // https://github.com/umdjs/umd/blob/master/returnExports.js
	  if (module.exports) {
	    // Node
	    module.exports = factory(punycode, IPv6, SecondLevelDomains);
	  } else {
	    // Browser globals (root is window)
	    root.URI = factory(root.punycode, root.IPv6, root.SecondLevelDomains, root);
	  }
	}(_commonjsHelpers.commonjsGlobal, function (punycode, IPv6, SLD, root) {
	  /*global location, escape, unescape */
	  // FIXME: v2.0.0 renamce non-camelCase properties to uppercase
	  /*jshint camelcase: false */

	  // save current URI variable, if any
	  var _URI = root && root.URI;

	  function URI(url, base) {
	    var _urlSupplied = arguments.length >= 1;
	    var _baseSupplied = arguments.length >= 2;

	    // Allow instantiation without the 'new' keyword
	    if (!(this instanceof URI)) {
	      if (_urlSupplied) {
	        if (_baseSupplied) {
	          return new URI(url, base);
	        }

	        return new URI(url);
	      }

	      return new URI();
	    }

	    if (url === undefined) {
	      if (_urlSupplied) {
	        throw new TypeError('undefined is not a valid argument for URI');
	      }

	      if (typeof location !== 'undefined') {
	        url = location.href + '';
	      } else {
	        url = '';
	      }
	    }

	    if (url === null) {
	      if (_urlSupplied) {
	        throw new TypeError('null is not a valid argument for URI');
	      }
	    }

	    this.href(url);

	    // resolve to base according to http://dvcs.w3.org/hg/url/raw-file/tip/Overview.html#constructor
	    if (base !== undefined) {
	      return this.absoluteTo(base);
	    }

	    return this;
	  }

	  function isInteger(value) {
	    return /^[0-9]+$/.test(value);
	  }

	  URI.version = '1.19.11';

	  var p = URI.prototype;
	  var hasOwn = Object.prototype.hasOwnProperty;

	  function escapeRegEx(string) {
	    // https://github.com/medialize/URI.js/commit/85ac21783c11f8ccab06106dba9735a31a86924d#commitcomment-821963
	    return string.replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
	  }

	  function getType(value) {
	    // IE8 doesn't return [Object Undefined] but [Object Object] for undefined value
	    if (value === undefined) {
	      return 'Undefined';
	    }

	    return String(Object.prototype.toString.call(value)).slice(8, -1);
	  }

	  function isArray(obj) {
	    return getType(obj) === 'Array';
	  }

	  function filterArrayValues(data, value) {
	    var lookup = {};
	    var i, length;

	    if (getType(value) === 'RegExp') {
	      lookup = null;
	    } else if (isArray(value)) {
	      for (i = 0, length = value.length; i < length; i++) {
	        lookup[value[i]] = true;
	      }
	    } else {
	      lookup[value] = true;
	    }

	    for (i = 0, length = data.length; i < length; i++) {
	      /*jshint laxbreak: true */
	      var _match = lookup && lookup[data[i]] !== undefined
	        || !lookup && value.test(data[i]);
	      /*jshint laxbreak: false */
	      if (_match) {
	        data.splice(i, 1);
	        length--;
	        i--;
	      }
	    }

	    return data;
	  }

	  function arrayContains(list, value) {
	    var i, length;

	    // value may be string, number, array, regexp
	    if (isArray(value)) {
	      // Note: this can be optimized to O(n) (instead of current O(m * n))
	      for (i = 0, length = value.length; i < length; i++) {
	        if (!arrayContains(list, value[i])) {
	          return false;
	        }
	      }

	      return true;
	    }

	    var _type = getType(value);
	    for (i = 0, length = list.length; i < length; i++) {
	      if (_type === 'RegExp') {
	        if (typeof list[i] === 'string' && list[i].match(value)) {
	          return true;
	        }
	      } else if (list[i] === value) {
	        return true;
	      }
	    }

	    return false;
	  }

	  function arraysEqual(one, two) {
	    if (!isArray(one) || !isArray(two)) {
	      return false;
	    }

	    // arrays can't be equal if they have different amount of content
	    if (one.length !== two.length) {
	      return false;
	    }

	    one.sort();
	    two.sort();

	    for (var i = 0, l = one.length; i < l; i++) {
	      if (one[i] !== two[i]) {
	        return false;
	      }
	    }

	    return true;
	  }

	  function trimSlashes(text) {
	    var trim_expression = /^\/+|\/+$/g;
	    return text.replace(trim_expression, '');
	  }

	  URI._parts = function() {
	    return {
	      protocol: null,
	      username: null,
	      password: null,
	      hostname: null,
	      urn: null,
	      port: null,
	      path: null,
	      query: null,
	      fragment: null,
	      // state
	      preventInvalidHostname: URI.preventInvalidHostname,
	      duplicateQueryParameters: URI.duplicateQueryParameters,
	      escapeQuerySpace: URI.escapeQuerySpace
	    };
	  };
	  // state: throw on invalid hostname
	  // see https://github.com/medialize/URI.js/pull/345
	  // and https://github.com/medialize/URI.js/issues/354
	  URI.preventInvalidHostname = false;
	  // state: allow duplicate query parameters (a=1&a=1)
	  URI.duplicateQueryParameters = false;
	  // state: replaces + with %20 (space in query strings)
	  URI.escapeQuerySpace = true;
	  // static properties
	  URI.protocol_expression = /^[a-z][a-z0-9.+-]*$/i;
	  URI.idn_expression = /[^a-z0-9\._-]/i;
	  URI.punycode_expression = /(xn--)/i;
	  // well, 333.444.555.666 matches, but it sure ain't no IPv4 - do we care?
	  URI.ip4_expression = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
	  // credits to Rich Brown
	  // source: http://forums.intermapper.com/viewtopic.php?p=1096#1096
	  // specification: http://www.ietf.org/rfc/rfc4291.txt
	  URI.ip6_expression = /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/;
	  // expression used is "gruber revised" (@gruber v2) determined to be the
	  // best solution in a regex-golf we did a couple of ages ago at
	  // * http://mathiasbynens.be/demo/url-regex
	  // * http://rodneyrehm.de/t/url-regex.html
	  URI.find_uri_expression = /\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/ig;
	  URI.findUri = {
	    // valid "scheme://" or "www."
	    start: /\b(?:([a-z][a-z0-9.+-]*:\/\/)|www\.)/gi,
	    // everything up to the next whitespace
	    end: /[\s\r\n]|$/,
	    // trim trailing punctuation captured by end RegExp
	    trim: /[`!()\[\]{};:'".,<>?«»“”„‘’]+$/,
	    // balanced parens inclusion (), [], {}, <>
	    parens: /(\([^\)]*\)|\[[^\]]*\]|\{[^}]*\}|<[^>]*>)/g,
	  };
	  URI.leading_whitespace_expression = /^[\x00-\x20\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]+/;
	  // https://infra.spec.whatwg.org/#ascii-tab-or-newline
	  URI.ascii_tab_whitespace = /[\u0009\u000A\u000D]+/g;
	  // http://www.iana.org/assignments/uri-schemes.html
	  // http://en.wikipedia.org/wiki/List_of_TCP_and_UDP_port_numbers#Well-known_ports
	  URI.defaultPorts = {
	    http: '80',
	    https: '443',
	    ftp: '21',
	    gopher: '70',
	    ws: '80',
	    wss: '443'
	  };
	  // list of protocols which always require a hostname
	  URI.hostProtocols = [
	    'http',
	    'https'
	  ];

	  // allowed hostname characters according to RFC 3986
	  // ALPHA DIGIT "-" "." "_" "~" "!" "$" "&" "'" "(" ")" "*" "+" "," ";" "=" %encoded
	  // I've never seen a (non-IDN) hostname other than: ALPHA DIGIT . - _
	  URI.invalid_hostname_characters = /[^a-zA-Z0-9\.\-:_]/;
	  // map DOM Elements to their URI attribute
	  URI.domAttributes = {
	    'a': 'href',
	    'blockquote': 'cite',
	    'link': 'href',
	    'base': 'href',
	    'script': 'src',
	    'form': 'action',
	    'img': 'src',
	    'area': 'href',
	    'iframe': 'src',
	    'embed': 'src',
	    'source': 'src',
	    'track': 'src',
	    'input': 'src', // but only if type="image"
	    'audio': 'src',
	    'video': 'src'
	  };
	  URI.getDomAttribute = function(node) {
	    if (!node || !node.nodeName) {
	      return undefined;
	    }

	    var nodeName = node.nodeName.toLowerCase();
	    // <input> should only expose src for type="image"
	    if (nodeName === 'input' && node.type !== 'image') {
	      return undefined;
	    }

	    return URI.domAttributes[nodeName];
	  };

	  function escapeForDumbFirefox36(value) {
	    // https://github.com/medialize/URI.js/issues/91
	    return escape(value);
	  }

	  // encoding / decoding according to RFC3986
	  function strictEncodeURIComponent(string) {
	    // see https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/encodeURIComponent
	    return encodeURIComponent(string)
	      .replace(/[!'()*]/g, escapeForDumbFirefox36)
	      .replace(/\*/g, '%2A');
	  }
	  URI.encode = strictEncodeURIComponent;
	  URI.decode = decodeURIComponent;
	  URI.iso8859 = function() {
	    URI.encode = escape;
	    URI.decode = unescape;
	  };
	  URI.unicode = function() {
	    URI.encode = strictEncodeURIComponent;
	    URI.decode = decodeURIComponent;
	  };
	  URI.characters = {
	    pathname: {
	      encode: {
	        // RFC3986 2.1: For consistency, URI producers and normalizers should
	        // use uppercase hexadecimal digits for all percent-encodings.
	        expression: /%(24|26|2B|2C|3B|3D|3A|40)/ig,
	        map: {
	          // -._~!'()*
	          '%24': '$',
	          '%26': '&',
	          '%2B': '+',
	          '%2C': ',',
	          '%3B': ';',
	          '%3D': '=',
	          '%3A': ':',
	          '%40': '@'
	        }
	      },
	      decode: {
	        expression: /[\/\?#]/g,
	        map: {
	          '/': '%2F',
	          '?': '%3F',
	          '#': '%23'
	        }
	      }
	    },
	    reserved: {
	      encode: {
	        // RFC3986 2.1: For consistency, URI producers and normalizers should
	        // use uppercase hexadecimal digits for all percent-encodings.
	        expression: /%(21|23|24|26|27|28|29|2A|2B|2C|2F|3A|3B|3D|3F|40|5B|5D)/ig,
	        map: {
	          // gen-delims
	          '%3A': ':',
	          '%2F': '/',
	          '%3F': '?',
	          '%23': '#',
	          '%5B': '[',
	          '%5D': ']',
	          '%40': '@',
	          // sub-delims
	          '%21': '!',
	          '%24': '$',
	          '%26': '&',
	          '%27': '\'',
	          '%28': '(',
	          '%29': ')',
	          '%2A': '*',
	          '%2B': '+',
	          '%2C': ',',
	          '%3B': ';',
	          '%3D': '='
	        }
	      }
	    },
	    urnpath: {
	      // The characters under `encode` are the characters called out by RFC 2141 as being acceptable
	      // for usage in a URN. RFC2141 also calls out "-", ".", and "_" as acceptable characters, but
	      // these aren't encoded by encodeURIComponent, so we don't have to call them out here. Also
	      // note that the colon character is not featured in the encoding map; this is because URI.js
	      // gives the colons in URNs semantic meaning as the delimiters of path segements, and so it
	      // should not appear unencoded in a segment itself.
	      // See also the note above about RFC3986 and capitalalized hex digits.
	      encode: {
	        expression: /%(21|24|27|28|29|2A|2B|2C|3B|3D|40)/ig,
	        map: {
	          '%21': '!',
	          '%24': '$',
	          '%27': '\'',
	          '%28': '(',
	          '%29': ')',
	          '%2A': '*',
	          '%2B': '+',
	          '%2C': ',',
	          '%3B': ';',
	          '%3D': '=',
	          '%40': '@'
	        }
	      },
	      // These characters are the characters called out by RFC2141 as "reserved" characters that
	      // should never appear in a URN, plus the colon character (see note above).
	      decode: {
	        expression: /[\/\?#:]/g,
	        map: {
	          '/': '%2F',
	          '?': '%3F',
	          '#': '%23',
	          ':': '%3A'
	        }
	      }
	    }
	  };
	  URI.encodeQuery = function(string, escapeQuerySpace) {
	    var escaped = URI.encode(string + '');
	    if (escapeQuerySpace === undefined) {
	      escapeQuerySpace = URI.escapeQuerySpace;
	    }

	    return escapeQuerySpace ? escaped.replace(/%20/g, '+') : escaped;
	  };
	  URI.decodeQuery = function(string, escapeQuerySpace) {
	    string += '';
	    if (escapeQuerySpace === undefined) {
	      escapeQuerySpace = URI.escapeQuerySpace;
	    }

	    try {
	      return URI.decode(escapeQuerySpace ? string.replace(/\+/g, '%20') : string);
	    } catch(e) {
	      // we're not going to mess with weird encodings,
	      // give up and return the undecoded original string
	      // see https://github.com/medialize/URI.js/issues/87
	      // see https://github.com/medialize/URI.js/issues/92
	      return string;
	    }
	  };
	  // generate encode/decode path functions
	  var _parts = {'encode':'encode', 'decode':'decode'};
	  var _part;
	  var generateAccessor = function(_group, _part) {
	    return function(string) {
	      try {
	        return URI[_part](string + '').replace(URI.characters[_group][_part].expression, function(c) {
	          return URI.characters[_group][_part].map[c];
	        });
	      } catch (e) {
	        // we're not going to mess with weird encodings,
	        // give up and return the undecoded original string
	        // see https://github.com/medialize/URI.js/issues/87
	        // see https://github.com/medialize/URI.js/issues/92
	        return string;
	      }
	    };
	  };

	  for (_part in _parts) {
	    URI[_part + 'PathSegment'] = generateAccessor('pathname', _parts[_part]);
	    URI[_part + 'UrnPathSegment'] = generateAccessor('urnpath', _parts[_part]);
	  }

	  var generateSegmentedPathFunction = function(_sep, _codingFuncName, _innerCodingFuncName) {
	    return function(string) {
	      // Why pass in names of functions, rather than the function objects themselves? The
	      // definitions of some functions (but in particular, URI.decode) will occasionally change due
	      // to URI.js having ISO8859 and Unicode modes. Passing in the name and getting it will ensure
	      // that the functions we use here are "fresh".
	      var actualCodingFunc;
	      if (!_innerCodingFuncName) {
	        actualCodingFunc = URI[_codingFuncName];
	      } else {
	        actualCodingFunc = function(string) {
	          return URI[_codingFuncName](URI[_innerCodingFuncName](string));
	        };
	      }

	      var segments = (string + '').split(_sep);

	      for (var i = 0, length = segments.length; i < length; i++) {
	        segments[i] = actualCodingFunc(segments[i]);
	      }

	      return segments.join(_sep);
	    };
	  };

	  // This takes place outside the above loop because we don't want, e.g., encodeUrnPath functions.
	  URI.decodePath = generateSegmentedPathFunction('/', 'decodePathSegment');
	  URI.decodeUrnPath = generateSegmentedPathFunction(':', 'decodeUrnPathSegment');
	  URI.recodePath = generateSegmentedPathFunction('/', 'encodePathSegment', 'decode');
	  URI.recodeUrnPath = generateSegmentedPathFunction(':', 'encodeUrnPathSegment', 'decode');

	  URI.encodeReserved = generateAccessor('reserved', 'encode');

	  URI.parse = function(string, parts) {
	    var pos;
	    if (!parts) {
	      parts = {
	        preventInvalidHostname: URI.preventInvalidHostname
	      };
	    }

	    string = string.replace(URI.leading_whitespace_expression, '');
	    // https://infra.spec.whatwg.org/#ascii-tab-or-newline
	    string = string.replace(URI.ascii_tab_whitespace, '');

	    // [protocol"://"[username[":"password]"@"]hostname[":"port]"/"?][path]["?"querystring]["#"fragment]

	    // extract fragment
	    pos = string.indexOf('#');
	    if (pos > -1) {
	      // escaping?
	      parts.fragment = string.substring(pos + 1) || null;
	      string = string.substring(0, pos);
	    }

	    // extract query
	    pos = string.indexOf('?');
	    if (pos > -1) {
	      // escaping?
	      parts.query = string.substring(pos + 1) || null;
	      string = string.substring(0, pos);
	    }

	    // slashes and backslashes have lost all meaning for the web protocols (https, http, wss, ws)
	    string = string.replace(/^(https?|ftp|wss?)?:+[/\\]*/i, '$1://');
	    // slashes and backslashes have lost all meaning for scheme relative URLs
	    string = string.replace(/^[/\\]{2,}/i, '//');

	    // extract protocol
	    if (string.substring(0, 2) === '//') {
	      // relative-scheme
	      parts.protocol = null;
	      string = string.substring(2);
	      // extract "user:pass@host:port"
	      string = URI.parseAuthority(string, parts);
	    } else {
	      pos = string.indexOf(':');
	      if (pos > -1) {
	        parts.protocol = string.substring(0, pos) || null;
	        if (parts.protocol && !parts.protocol.match(URI.protocol_expression)) {
	          // : may be within the path
	          parts.protocol = undefined;
	        } else if (string.substring(pos + 1, pos + 3).replace(/\\/g, '/') === '//') {
	          string = string.substring(pos + 3);

	          // extract "user:pass@host:port"
	          string = URI.parseAuthority(string, parts);
	        } else {
	          string = string.substring(pos + 1);
	          parts.urn = true;
	        }
	      }
	    }

	    // what's left must be the path
	    parts.path = string;

	    // and we're done
	    return parts;
	  };
	  URI.parseHost = function(string, parts) {
	    if (!string) {
	      string = '';
	    }

	    // Copy chrome, IE, opera backslash-handling behavior.
	    // Back slashes before the query string get converted to forward slashes
	    // See: https://github.com/joyent/node/blob/386fd24f49b0e9d1a8a076592a404168faeecc34/lib/url.js#L115-L124
	    // See: https://code.google.com/p/chromium/issues/detail?id=25916
	    // https://github.com/medialize/URI.js/pull/233
	    string = string.replace(/\\/g, '/');

	    // extract host:port
	    var pos = string.indexOf('/');
	    var bracketPos;
	    var t;

	    if (pos === -1) {
	      pos = string.length;
	    }

	    if (string.charAt(0) === '[') {
	      // IPv6 host - http://tools.ietf.org/html/draft-ietf-6man-text-addr-representation-04#section-6
	      // I claim most client software breaks on IPv6 anyways. To simplify things, URI only accepts
	      // IPv6+port in the format [2001:db8::1]:80 (for the time being)
	      bracketPos = string.indexOf(']');
	      parts.hostname = string.substring(1, bracketPos) || null;
	      parts.port = string.substring(bracketPos + 2, pos) || null;
	      if (parts.port === '/') {
	        parts.port = null;
	      }
	    } else {
	      var firstColon = string.indexOf(':');
	      var firstSlash = string.indexOf('/');
	      var nextColon = string.indexOf(':', firstColon + 1);
	      if (nextColon !== -1 && (firstSlash === -1 || nextColon < firstSlash)) {
	        // IPv6 host contains multiple colons - but no port
	        // this notation is actually not allowed by RFC 3986, but we're a liberal parser
	        parts.hostname = string.substring(0, pos) || null;
	        parts.port = null;
	      } else {
	        t = string.substring(0, pos).split(':');
	        parts.hostname = t[0] || null;
	        parts.port = t[1] || null;
	      }
	    }

	    if (parts.hostname && string.substring(pos).charAt(0) !== '/') {
	      pos++;
	      string = '/' + string;
	    }

	    if (parts.preventInvalidHostname) {
	      URI.ensureValidHostname(parts.hostname, parts.protocol);
	    }

	    if (parts.port) {
	      URI.ensureValidPort(parts.port);
	    }

	    return string.substring(pos) || '/';
	  };
	  URI.parseAuthority = function(string, parts) {
	    string = URI.parseUserinfo(string, parts);
	    return URI.parseHost(string, parts);
	  };
	  URI.parseUserinfo = function(string, parts) {
	    // extract username:password
	    var _string = string;
	    var firstBackSlash = string.indexOf('\\');
	    if (firstBackSlash !== -1) {
	      string = string.replace(/\\/g, '/');
	    }
	    var firstSlash = string.indexOf('/');
	    var pos = string.lastIndexOf('@', firstSlash > -1 ? firstSlash : string.length - 1);
	    var t;

	    // authority@ must come before /path or \path
	    if (pos > -1 && (firstSlash === -1 || pos < firstSlash)) {
	      t = string.substring(0, pos).split(':');
	      parts.username = t[0] ? URI.decode(t[0]) : null;
	      t.shift();
	      parts.password = t[0] ? URI.decode(t.join(':')) : null;
	      string = _string.substring(pos + 1);
	    } else {
	      parts.username = null;
	      parts.password = null;
	    }

	    return string;
	  };
	  URI.parseQuery = function(string, escapeQuerySpace) {
	    if (!string) {
	      return {};
	    }

	    // throw out the funky business - "?"[name"="value"&"]+
	    string = string.replace(/&+/g, '&').replace(/^\?*&*|&+$/g, '');

	    if (!string) {
	      return {};
	    }

	    var items = {};
	    var splits = string.split('&');
	    var length = splits.length;
	    var v, name, value;

	    for (var i = 0; i < length; i++) {
	      v = splits[i].split('=');
	      name = URI.decodeQuery(v.shift(), escapeQuerySpace);
	      // no "=" is null according to http://dvcs.w3.org/hg/url/raw-file/tip/Overview.html#collect-url-parameters
	      value = v.length ? URI.decodeQuery(v.join('='), escapeQuerySpace) : null;

	      if (name === '__proto__') {
	        // ignore attempt at exploiting JavaScript internals
	        continue;
	      } else if (hasOwn.call(items, name)) {
	        if (typeof items[name] === 'string' || items[name] === null) {
	          items[name] = [items[name]];
	        }

	        items[name].push(value);
	      } else {
	        items[name] = value;
	      }
	    }

	    return items;
	  };

	  URI.build = function(parts) {
	    var t = '';
	    var requireAbsolutePath = false;

	    if (parts.protocol) {
	      t += parts.protocol + ':';
	    }

	    if (!parts.urn && (t || parts.hostname)) {
	      t += '//';
	      requireAbsolutePath = true;
	    }

	    t += (URI.buildAuthority(parts) || '');

	    if (typeof parts.path === 'string') {
	      if (parts.path.charAt(0) !== '/' && requireAbsolutePath) {
	        t += '/';
	      }

	      t += parts.path;
	    }

	    if (typeof parts.query === 'string' && parts.query) {
	      t += '?' + parts.query;
	    }

	    if (typeof parts.fragment === 'string' && parts.fragment) {
	      t += '#' + parts.fragment;
	    }
	    return t;
	  };
	  URI.buildHost = function(parts) {
	    var t = '';

	    if (!parts.hostname) {
	      return '';
	    } else if (URI.ip6_expression.test(parts.hostname)) {
	      t += '[' + parts.hostname + ']';
	    } else {
	      t += parts.hostname;
	    }

	    if (parts.port) {
	      t += ':' + parts.port;
	    }

	    return t;
	  };
	  URI.buildAuthority = function(parts) {
	    return URI.buildUserinfo(parts) + URI.buildHost(parts);
	  };
	  URI.buildUserinfo = function(parts) {
	    var t = '';

	    if (parts.username) {
	      t += URI.encode(parts.username);
	    }

	    if (parts.password) {
	      t += ':' + URI.encode(parts.password);
	    }

	    if (t) {
	      t += '@';
	    }

	    return t;
	  };
	  URI.buildQuery = function(data, duplicateQueryParameters, escapeQuerySpace) {
	    // according to http://tools.ietf.org/html/rfc3986 or http://labs.apache.org/webarch/uri/rfc/rfc3986.html
	    // being »-._~!$&'()*+,;=:@/?« %HEX and alnum are allowed
	    // the RFC explicitly states ?/foo being a valid use case, no mention of parameter syntax!
	    // URI.js treats the query string as being application/x-www-form-urlencoded
	    // see http://www.w3.org/TR/REC-html40/interact/forms.html#form-content-type

	    var t = '';
	    var unique, key, i, length;
	    for (key in data) {
	      if (key === '__proto__') {
	        // ignore attempt at exploiting JavaScript internals
	        continue;
	      } else if (hasOwn.call(data, key)) {
	        if (isArray(data[key])) {
	          unique = {};
	          for (i = 0, length = data[key].length; i < length; i++) {
	            if (data[key][i] !== undefined && unique[data[key][i] + ''] === undefined) {
	              t += '&' + URI.buildQueryParameter(key, data[key][i], escapeQuerySpace);
	              if (duplicateQueryParameters !== true) {
	                unique[data[key][i] + ''] = true;
	              }
	            }
	          }
	        } else if (data[key] !== undefined) {
	          t += '&' + URI.buildQueryParameter(key, data[key], escapeQuerySpace);
	        }
	      }
	    }

	    return t.substring(1);
	  };
	  URI.buildQueryParameter = function(name, value, escapeQuerySpace) {
	    // http://www.w3.org/TR/REC-html40/interact/forms.html#form-content-type -- application/x-www-form-urlencoded
	    // don't append "=" for null values, according to http://dvcs.w3.org/hg/url/raw-file/tip/Overview.html#url-parameter-serialization
	    return URI.encodeQuery(name, escapeQuerySpace) + (value !== null ? '=' + URI.encodeQuery(value, escapeQuerySpace) : '');
	  };

	  URI.addQuery = function(data, name, value) {
	    if (typeof name === 'object') {
	      for (var key in name) {
	        if (hasOwn.call(name, key)) {
	          URI.addQuery(data, key, name[key]);
	        }
	      }
	    } else if (typeof name === 'string') {
	      if (data[name] === undefined) {
	        data[name] = value;
	        return;
	      } else if (typeof data[name] === 'string') {
	        data[name] = [data[name]];
	      }

	      if (!isArray(value)) {
	        value = [value];
	      }

	      data[name] = (data[name] || []).concat(value);
	    } else {
	      throw new TypeError('URI.addQuery() accepts an object, string as the name parameter');
	    }
	  };

	  URI.setQuery = function(data, name, value) {
	    if (typeof name === 'object') {
	      for (var key in name) {
	        if (hasOwn.call(name, key)) {
	          URI.setQuery(data, key, name[key]);
	        }
	      }
	    } else if (typeof name === 'string') {
	      data[name] = value === undefined ? null : value;
	    } else {
	      throw new TypeError('URI.setQuery() accepts an object, string as the name parameter');
	    }
	  };

	  URI.removeQuery = function(data, name, value) {
	    var i, length, key;

	    if (isArray(name)) {
	      for (i = 0, length = name.length; i < length; i++) {
	        data[name[i]] = undefined;
	      }
	    } else if (getType(name) === 'RegExp') {
	      for (key in data) {
	        if (name.test(key)) {
	          data[key] = undefined;
	        }
	      }
	    } else if (typeof name === 'object') {
	      for (key in name) {
	        if (hasOwn.call(name, key)) {
	          URI.removeQuery(data, key, name[key]);
	        }
	      }
	    } else if (typeof name === 'string') {
	      if (value !== undefined) {
	        if (getType(value) === 'RegExp') {
	          if (!isArray(data[name]) && value.test(data[name])) {
	            data[name] = undefined;
	          } else {
	            data[name] = filterArrayValues(data[name], value);
	          }
	        } else if (data[name] === String(value) && (!isArray(value) || value.length === 1)) {
	          data[name] = undefined;
	        } else if (isArray(data[name])) {
	          data[name] = filterArrayValues(data[name], value);
	        }
	      } else {
	        data[name] = undefined;
	      }
	    } else {
	      throw new TypeError('URI.removeQuery() accepts an object, string, RegExp as the first parameter');
	    }
	  };
	  URI.hasQuery = function(data, name, value, withinArray) {
	    switch (getType(name)) {
	      case 'String':
	        // Nothing to do here
	        break;

	      case 'RegExp':
	        for (var key in data) {
	          if (hasOwn.call(data, key)) {
	            if (name.test(key) && (value === undefined || URI.hasQuery(data, key, value))) {
	              return true;
	            }
	          }
	        }

	        return false;

	      case 'Object':
	        for (var _key in name) {
	          if (hasOwn.call(name, _key)) {
	            if (!URI.hasQuery(data, _key, name[_key])) {
	              return false;
	            }
	          }
	        }

	        return true;

	      default:
	        throw new TypeError('URI.hasQuery() accepts a string, regular expression or object as the name parameter');
	    }

	    switch (getType(value)) {
	      case 'Undefined':
	        // true if exists (but may be empty)
	        return name in data; // data[name] !== undefined;

	      case 'Boolean':
	        // true if exists and non-empty
	        var _booly = Boolean(isArray(data[name]) ? data[name].length : data[name]);
	        return value === _booly;

	      case 'Function':
	        // allow complex comparison
	        return !!value(data[name], name, data);

	      case 'Array':
	        if (!isArray(data[name])) {
	          return false;
	        }

	        var op = withinArray ? arrayContains : arraysEqual;
	        return op(data[name], value);

	      case 'RegExp':
	        if (!isArray(data[name])) {
	          return Boolean(data[name] && data[name].match(value));
	        }

	        if (!withinArray) {
	          return false;
	        }

	        return arrayContains(data[name], value);

	      case 'Number':
	        value = String(value);
	        /* falls through */
	      case 'String':
	        if (!isArray(data[name])) {
	          return data[name] === value;
	        }

	        if (!withinArray) {
	          return false;
	        }

	        return arrayContains(data[name], value);

	      default:
	        throw new TypeError('URI.hasQuery() accepts undefined, boolean, string, number, RegExp, Function as the value parameter');
	    }
	  };


	  URI.joinPaths = function() {
	    var input = [];
	    var segments = [];
	    var nonEmptySegments = 0;

	    for (var i = 0; i < arguments.length; i++) {
	      var url = new URI(arguments[i]);
	      input.push(url);
	      var _segments = url.segment();
	      for (var s = 0; s < _segments.length; s++) {
	        if (typeof _segments[s] === 'string') {
	          segments.push(_segments[s]);
	        }

	        if (_segments[s]) {
	          nonEmptySegments++;
	        }
	      }
	    }

	    if (!segments.length || !nonEmptySegments) {
	      return new URI('');
	    }

	    var uri = new URI('').segment(segments);

	    if (input[0].path() === '' || input[0].path().slice(0, 1) === '/') {
	      uri.path('/' + uri.path());
	    }

	    return uri.normalize();
	  };

	  URI.commonPath = function(one, two) {
	    var length = Math.min(one.length, two.length);
	    var pos;

	    // find first non-matching character
	    for (pos = 0; pos < length; pos++) {
	      if (one.charAt(pos) !== two.charAt(pos)) {
	        pos--;
	        break;
	      }
	    }

	    if (pos < 1) {
	      return one.charAt(0) === two.charAt(0) && one.charAt(0) === '/' ? '/' : '';
	    }

	    // revert to last /
	    if (one.charAt(pos) !== '/' || two.charAt(pos) !== '/') {
	      pos = one.substring(0, pos).lastIndexOf('/');
	    }

	    return one.substring(0, pos + 1);
	  };

	  URI.withinString = function(string, callback, options) {
	    options || (options = {});
	    var _start = options.start || URI.findUri.start;
	    var _end = options.end || URI.findUri.end;
	    var _trim = options.trim || URI.findUri.trim;
	    var _parens = options.parens || URI.findUri.parens;
	    var _attributeOpen = /[a-z0-9-]=["']?$/i;

	    _start.lastIndex = 0;
	    while (true) {
	      var match = _start.exec(string);
	      if (!match) {
	        break;
	      }

	      var start = match.index;
	      if (options.ignoreHtml) {
	        // attribut(e=["']?$)
	        var attributeOpen = string.slice(Math.max(start - 3, 0), start);
	        if (attributeOpen && _attributeOpen.test(attributeOpen)) {
	          continue;
	        }
	      }

	      var end = start + string.slice(start).search(_end);
	      var slice = string.slice(start, end);
	      // make sure we include well balanced parens
	      var parensEnd = -1;
	      while (true) {
	        var parensMatch = _parens.exec(slice);
	        if (!parensMatch) {
	          break;
	        }

	        var parensMatchEnd = parensMatch.index + parensMatch[0].length;
	        parensEnd = Math.max(parensEnd, parensMatchEnd);
	      }

	      if (parensEnd > -1) {
	        slice = slice.slice(0, parensEnd) + slice.slice(parensEnd).replace(_trim, '');
	      } else {
	        slice = slice.replace(_trim, '');
	      }

	      if (slice.length <= match[0].length) {
	        // the extract only contains the starting marker of a URI,
	        // e.g. "www" or "http://"
	        continue;
	      }

	      if (options.ignore && options.ignore.test(slice)) {
	        continue;
	      }

	      end = start + slice.length;
	      var result = callback(slice, start, end, string);
	      if (result === undefined) {
	        _start.lastIndex = end;
	        continue;
	      }

	      result = String(result);
	      string = string.slice(0, start) + result + string.slice(end);
	      _start.lastIndex = start + result.length;
	    }

	    _start.lastIndex = 0;
	    return string;
	  };

	  URI.ensureValidHostname = function(v, protocol) {
	    // Theoretically URIs allow percent-encoding in Hostnames (according to RFC 3986)
	    // they are not part of DNS and therefore ignored by URI.js

	    var hasHostname = !!v; // not null and not an empty string
	    var hasProtocol = !!protocol;
	    var rejectEmptyHostname = false;

	    if (hasProtocol) {
	      rejectEmptyHostname = arrayContains(URI.hostProtocols, protocol);
	    }

	    if (rejectEmptyHostname && !hasHostname) {
	      throw new TypeError('Hostname cannot be empty, if protocol is ' + protocol);
	    } else if (v && v.match(URI.invalid_hostname_characters)) {
	      // test punycode
	      if (!punycode) {
	        throw new TypeError('Hostname "' + v + '" contains characters other than [A-Z0-9.-:_] and Punycode.js is not available');
	      }
	      if (punycode.toASCII(v).match(URI.invalid_hostname_characters)) {
	        throw new TypeError('Hostname "' + v + '" contains characters other than [A-Z0-9.-:_]');
	      }
	    }
	  };

	  URI.ensureValidPort = function (v) {
	    if (!v) {
	      return;
	    }

	    var port = Number(v);
	    if (isInteger(port) && (port > 0) && (port < 65536)) {
	      return;
	    }

	    throw new TypeError('Port "' + v + '" is not a valid port');
	  };

	  // noConflict
	  URI.noConflict = function(removeAll) {
	    if (removeAll) {
	      var unconflicted = {
	        URI: this.noConflict()
	      };

	      if (root.URITemplate && typeof root.URITemplate.noConflict === 'function') {
	        unconflicted.URITemplate = root.URITemplate.noConflict();
	      }

	      if (root.IPv6 && typeof root.IPv6.noConflict === 'function') {
	        unconflicted.IPv6 = root.IPv6.noConflict();
	      }

	      if (root.SecondLevelDomains && typeof root.SecondLevelDomains.noConflict === 'function') {
	        unconflicted.SecondLevelDomains = root.SecondLevelDomains.noConflict();
	      }

	      return unconflicted;
	    } else if (root.URI === this) {
	      root.URI = _URI;
	    }

	    return this;
	  };

	  p.build = function(deferBuild) {
	    if (deferBuild === true) {
	      this._deferred_build = true;
	    } else if (deferBuild === undefined || this._deferred_build) {
	      this._string = URI.build(this._parts);
	      this._deferred_build = false;
	    }

	    return this;
	  };

	  p.clone = function() {
	    return new URI(this);
	  };

	  p.valueOf = p.toString = function() {
	    return this.build(false)._string;
	  };


	  function generateSimpleAccessor(_part){
	    return function(v, build) {
	      if (v === undefined) {
	        return this._parts[_part] || '';
	      } else {
	        this._parts[_part] = v || null;
	        this.build(!build);
	        return this;
	      }
	    };
	  }

	  function generatePrefixAccessor(_part, _key){
	    return function(v, build) {
	      if (v === undefined) {
	        return this._parts[_part] || '';
	      } else {
	        if (v !== null) {
	          v = v + '';
	          if (v.charAt(0) === _key) {
	            v = v.substring(1);
	          }
	        }

	        this._parts[_part] = v;
	        this.build(!build);
	        return this;
	      }
	    };
	  }

	  p.protocol = generateSimpleAccessor('protocol');
	  p.username = generateSimpleAccessor('username');
	  p.password = generateSimpleAccessor('password');
	  p.hostname = generateSimpleAccessor('hostname');
	  p.port = generateSimpleAccessor('port');
	  p.query = generatePrefixAccessor('query', '?');
	  p.fragment = generatePrefixAccessor('fragment', '#');

	  p.search = function(v, build) {
	    var t = this.query(v, build);
	    return typeof t === 'string' && t.length ? ('?' + t) : t;
	  };
	  p.hash = function(v, build) {
	    var t = this.fragment(v, build);
	    return typeof t === 'string' && t.length ? ('#' + t) : t;
	  };

	  p.pathname = function(v, build) {
	    if (v === undefined || v === true) {
	      var res = this._parts.path || (this._parts.hostname ? '/' : '');
	      return v ? (this._parts.urn ? URI.decodeUrnPath : URI.decodePath)(res) : res;
	    } else {
	      if (this._parts.urn) {
	        this._parts.path = v ? URI.recodeUrnPath(v) : '';
	      } else {
	        this._parts.path = v ? URI.recodePath(v) : '/';
	      }
	      this.build(!build);
	      return this;
	    }
	  };
	  p.path = p.pathname;
	  p.href = function(href, build) {
	    var key;

	    if (href === undefined) {
	      return this.toString();
	    }

	    this._string = '';
	    this._parts = URI._parts();

	    var _URI = href instanceof URI;
	    var _object = typeof href === 'object' && (href.hostname || href.path || href.pathname);
	    if (href.nodeName) {
	      var attribute = URI.getDomAttribute(href);
	      href = href[attribute] || '';
	      _object = false;
	    }

	    // window.location is reported to be an object, but it's not the sort
	    // of object we're looking for:
	    // * location.protocol ends with a colon
	    // * location.query != object.search
	    // * location.hash != object.fragment
	    // simply serializing the unknown object should do the trick
	    // (for location, not for everything...)
	    if (!_URI && _object && href.pathname !== undefined) {
	      href = href.toString();
	    }

	    if (typeof href === 'string' || href instanceof String) {
	      this._parts = URI.parse(String(href), this._parts);
	    } else if (_URI || _object) {
	      var src = _URI ? href._parts : href;
	      for (key in src) {
	        if (key === 'query') { continue; }
	        if (hasOwn.call(this._parts, key)) {
	          this._parts[key] = src[key];
	        }
	      }
	      if (src.query) {
	        this.query(src.query, false);
	      }
	    } else {
	      throw new TypeError('invalid input');
	    }

	    this.build(!build);
	    return this;
	  };

	  // identification accessors
	  p.is = function(what) {
	    var ip = false;
	    var ip4 = false;
	    var ip6 = false;
	    var name = false;
	    var sld = false;
	    var idn = false;
	    var punycode = false;
	    var relative = !this._parts.urn;

	    if (this._parts.hostname) {
	      relative = false;
	      ip4 = URI.ip4_expression.test(this._parts.hostname);
	      ip6 = URI.ip6_expression.test(this._parts.hostname);
	      ip = ip4 || ip6;
	      name = !ip;
	      sld = name && SLD && SLD.has(this._parts.hostname);
	      idn = name && URI.idn_expression.test(this._parts.hostname);
	      punycode = name && URI.punycode_expression.test(this._parts.hostname);
	    }

	    switch (what.toLowerCase()) {
	      case 'relative':
	        return relative;

	      case 'absolute':
	        return !relative;

	      // hostname identification
	      case 'domain':
	      case 'name':
	        return name;

	      case 'sld':
	        return sld;

	      case 'ip':
	        return ip;

	      case 'ip4':
	      case 'ipv4':
	      case 'inet4':
	        return ip4;

	      case 'ip6':
	      case 'ipv6':
	      case 'inet6':
	        return ip6;

	      case 'idn':
	        return idn;

	      case 'url':
	        return !this._parts.urn;

	      case 'urn':
	        return !!this._parts.urn;

	      case 'punycode':
	        return punycode;
	    }

	    return null;
	  };

	  // component specific input validation
	  var _protocol = p.protocol;
	  var _port = p.port;
	  var _hostname = p.hostname;

	  p.protocol = function(v, build) {
	    if (v) {
	      // accept trailing ://
	      v = v.replace(/:(\/\/)?$/, '');

	      if (!v.match(URI.protocol_expression)) {
	        throw new TypeError('Protocol "' + v + '" contains characters other than [A-Z0-9.+-] or doesn\'t start with [A-Z]');
	      }
	    }

	    return _protocol.call(this, v, build);
	  };
	  p.scheme = p.protocol;
	  p.port = function(v, build) {
	    if (this._parts.urn) {
	      return v === undefined ? '' : this;
	    }

	    if (v !== undefined) {
	      if (v === 0) {
	        v = null;
	      }

	      if (v) {
	        v += '';
	        if (v.charAt(0) === ':') {
	          v = v.substring(1);
	        }

	        URI.ensureValidPort(v);
	      }
	    }
	    return _port.call(this, v, build);
	  };
	  p.hostname = function(v, build) {
	    if (this._parts.urn) {
	      return v === undefined ? '' : this;
	    }

	    if (v !== undefined) {
	      var x = { preventInvalidHostname: this._parts.preventInvalidHostname };
	      var res = URI.parseHost(v, x);
	      if (res !== '/') {
	        throw new TypeError('Hostname "' + v + '" contains characters other than [A-Z0-9.-]');
	      }

	      v = x.hostname;
	      if (this._parts.preventInvalidHostname) {
	        URI.ensureValidHostname(v, this._parts.protocol);
	      }
	    }

	    return _hostname.call(this, v, build);
	  };

	  // compound accessors
	  p.origin = function(v, build) {
	    if (this._parts.urn) {
	      return v === undefined ? '' : this;
	    }

	    if (v === undefined) {
	      var protocol = this.protocol();
	      var authority = this.authority();
	      if (!authority) {
	        return '';
	      }

	      return (protocol ? protocol + '://' : '') + this.authority();
	    } else {
	      var origin = URI(v);
	      this
	        .protocol(origin.protocol())
	        .authority(origin.authority())
	        .build(!build);
	      return this;
	    }
	  };
	  p.host = function(v, build) {
	    if (this._parts.urn) {
	      return v === undefined ? '' : this;
	    }

	    if (v === undefined) {
	      return this._parts.hostname ? URI.buildHost(this._parts) : '';
	    } else {
	      var res = URI.parseHost(v, this._parts);
	      if (res !== '/') {
	        throw new TypeError('Hostname "' + v + '" contains characters other than [A-Z0-9.-]');
	      }

	      this.build(!build);
	      return this;
	    }
	  };
	  p.authority = function(v, build) {
	    if (this._parts.urn) {
	      return v === undefined ? '' : this;
	    }

	    if (v === undefined) {
	      return this._parts.hostname ? URI.buildAuthority(this._parts) : '';
	    } else {
	      var res = URI.parseAuthority(v, this._parts);
	      if (res !== '/') {
	        throw new TypeError('Hostname "' + v + '" contains characters other than [A-Z0-9.-]');
	      }

	      this.build(!build);
	      return this;
	    }
	  };
	  p.userinfo = function(v, build) {
	    if (this._parts.urn) {
	      return v === undefined ? '' : this;
	    }

	    if (v === undefined) {
	      var t = URI.buildUserinfo(this._parts);
	      return t ? t.substring(0, t.length -1) : t;
	    } else {
	      if (v[v.length-1] !== '@') {
	        v += '@';
	      }

	      URI.parseUserinfo(v, this._parts);
	      this.build(!build);
	      return this;
	    }
	  };
	  p.resource = function(v, build) {
	    var parts;

	    if (v === undefined) {
	      return this.path() + this.search() + this.hash();
	    }

	    parts = URI.parse(v);
	    this._parts.path = parts.path;
	    this._parts.query = parts.query;
	    this._parts.fragment = parts.fragment;
	    this.build(!build);
	    return this;
	  };

	  // fraction accessors
	  p.subdomain = function(v, build) {
	    if (this._parts.urn) {
	      return v === undefined ? '' : this;
	    }

	    // convenience, return "www" from "www.example.org"
	    if (v === undefined) {
	      if (!this._parts.hostname || this.is('IP')) {
	        return '';
	      }

	      // grab domain and add another segment
	      var end = this._parts.hostname.length - this.domain().length - 1;
	      return this._parts.hostname.substring(0, end) || '';
	    } else {
	      var e = this._parts.hostname.length - this.domain().length;
	      var sub = this._parts.hostname.substring(0, e);
	      var replace = new RegExp('^' + escapeRegEx(sub));

	      if (v && v.charAt(v.length - 1) !== '.') {
	        v += '.';
	      }

	      if (v.indexOf(':') !== -1) {
	        throw new TypeError('Domains cannot contain colons');
	      }

	      if (v) {
	        URI.ensureValidHostname(v, this._parts.protocol);
	      }

	      this._parts.hostname = this._parts.hostname.replace(replace, v);
	      this.build(!build);
	      return this;
	    }
	  };
	  p.domain = function(v, build) {
	    if (this._parts.urn) {
	      return v === undefined ? '' : this;
	    }

	    if (typeof v === 'boolean') {
	      build = v;
	      v = undefined;
	    }

	    // convenience, return "example.org" from "www.example.org"
	    if (v === undefined) {
	      if (!this._parts.hostname || this.is('IP')) {
	        return '';
	      }

	      // if hostname consists of 1 or 2 segments, it must be the domain
	      var t = this._parts.hostname.match(/\./g);
	      if (t && t.length < 2) {
	        return this._parts.hostname;
	      }

	      // grab tld and add another segment
	      var end = this._parts.hostname.length - this.tld(build).length - 1;
	      end = this._parts.hostname.lastIndexOf('.', end -1) + 1;
	      return this._parts.hostname.substring(end) || '';
	    } else {
	      if (!v) {
	        throw new TypeError('cannot set domain empty');
	      }

	      if (v.indexOf(':') !== -1) {
	        throw new TypeError('Domains cannot contain colons');
	      }

	      URI.ensureValidHostname(v, this._parts.protocol);

	      if (!this._parts.hostname || this.is('IP')) {
	        this._parts.hostname = v;
	      } else {
	        var replace = new RegExp(escapeRegEx(this.domain()) + '$');
	        this._parts.hostname = this._parts.hostname.replace(replace, v);
	      }

	      this.build(!build);
	      return this;
	    }
	  };
	  p.tld = function(v, build) {
	    if (this._parts.urn) {
	      return v === undefined ? '' : this;
	    }

	    if (typeof v === 'boolean') {
	      build = v;
	      v = undefined;
	    }

	    // return "org" from "www.example.org"
	    if (v === undefined) {
	      if (!this._parts.hostname || this.is('IP')) {
	        return '';
	      }

	      var pos = this._parts.hostname.lastIndexOf('.');
	      var tld = this._parts.hostname.substring(pos + 1);

	      if (build !== true && SLD && SLD.list[tld.toLowerCase()]) {
	        return SLD.get(this._parts.hostname) || tld;
	      }

	      return tld;
	    } else {
	      var replace;

	      if (!v) {
	        throw new TypeError('cannot set TLD empty');
	      } else if (v.match(/[^a-zA-Z0-9-]/)) {
	        if (SLD && SLD.is(v)) {
	          replace = new RegExp(escapeRegEx(this.tld()) + '$');
	          this._parts.hostname = this._parts.hostname.replace(replace, v);
	        } else {
	          throw new TypeError('TLD "' + v + '" contains characters other than [A-Z0-9]');
	        }
	      } else if (!this._parts.hostname || this.is('IP')) {
	        throw new ReferenceError('cannot set TLD on non-domain host');
	      } else {
	        replace = new RegExp(escapeRegEx(this.tld()) + '$');
	        this._parts.hostname = this._parts.hostname.replace(replace, v);
	      }

	      this.build(!build);
	      return this;
	    }
	  };
	  p.directory = function(v, build) {
	    if (this._parts.urn) {
	      return v === undefined ? '' : this;
	    }

	    if (v === undefined || v === true) {
	      if (!this._parts.path && !this._parts.hostname) {
	        return '';
	      }

	      if (this._parts.path === '/') {
	        return '/';
	      }

	      var end = this._parts.path.length - this.filename().length - 1;
	      var res = this._parts.path.substring(0, end) || (this._parts.hostname ? '/' : '');

	      return v ? URI.decodePath(res) : res;

	    } else {
	      var e = this._parts.path.length - this.filename().length;
	      var directory = this._parts.path.substring(0, e);
	      var replace = new RegExp('^' + escapeRegEx(directory));

	      // fully qualifier directories begin with a slash
	      if (!this.is('relative')) {
	        if (!v) {
	          v = '/';
	        }

	        if (v.charAt(0) !== '/') {
	          v = '/' + v;
	        }
	      }

	      // directories always end with a slash
	      if (v && v.charAt(v.length - 1) !== '/') {
	        v += '/';
	      }

	      v = URI.recodePath(v);
	      this._parts.path = this._parts.path.replace(replace, v);
	      this.build(!build);
	      return this;
	    }
	  };
	  p.filename = function(v, build) {
	    if (this._parts.urn) {
	      return v === undefined ? '' : this;
	    }

	    if (typeof v !== 'string') {
	      if (!this._parts.path || this._parts.path === '/') {
	        return '';
	      }

	      var pos = this._parts.path.lastIndexOf('/');
	      var res = this._parts.path.substring(pos+1);

	      return v ? URI.decodePathSegment(res) : res;
	    } else {
	      var mutatedDirectory = false;

	      if (v.charAt(0) === '/') {
	        v = v.substring(1);
	      }

	      if (v.match(/\.?\//)) {
	        mutatedDirectory = true;
	      }

	      var replace = new RegExp(escapeRegEx(this.filename()) + '$');
	      v = URI.recodePath(v);
	      this._parts.path = this._parts.path.replace(replace, v);

	      if (mutatedDirectory) {
	        this.normalizePath(build);
	      } else {
	        this.build(!build);
	      }

	      return this;
	    }
	  };
	  p.suffix = function(v, build) {
	    if (this._parts.urn) {
	      return v === undefined ? '' : this;
	    }

	    if (v === undefined || v === true) {
	      if (!this._parts.path || this._parts.path === '/') {
	        return '';
	      }

	      var filename = this.filename();
	      var pos = filename.lastIndexOf('.');
	      var s, res;

	      if (pos === -1) {
	        return '';
	      }

	      // suffix may only contain alnum characters (yup, I made this up.)
	      s = filename.substring(pos+1);
	      res = (/^[a-z0-9%]+$/i).test(s) ? s : '';
	      return v ? URI.decodePathSegment(res) : res;
	    } else {
	      if (v.charAt(0) === '.') {
	        v = v.substring(1);
	      }

	      var suffix = this.suffix();
	      var replace;

	      if (!suffix) {
	        if (!v) {
	          return this;
	        }

	        this._parts.path += '.' + URI.recodePath(v);
	      } else if (!v) {
	        replace = new RegExp(escapeRegEx('.' + suffix) + '$');
	      } else {
	        replace = new RegExp(escapeRegEx(suffix) + '$');
	      }

	      if (replace) {
	        v = URI.recodePath(v);
	        this._parts.path = this._parts.path.replace(replace, v);
	      }

	      this.build(!build);
	      return this;
	    }
	  };
	  p.segment = function(segment, v, build) {
	    var separator = this._parts.urn ? ':' : '/';
	    var path = this.path();
	    var absolute = path.substring(0, 1) === '/';
	    var segments = path.split(separator);

	    if (segment !== undefined && typeof segment !== 'number') {
	      build = v;
	      v = segment;
	      segment = undefined;
	    }

	    if (segment !== undefined && typeof segment !== 'number') {
	      throw new Error('Bad segment "' + segment + '", must be 0-based integer');
	    }

	    if (absolute) {
	      segments.shift();
	    }

	    if (segment < 0) {
	      // allow negative indexes to address from the end
	      segment = Math.max(segments.length + segment, 0);
	    }

	    if (v === undefined) {
	      /*jshint laxbreak: true */
	      return segment === undefined
	        ? segments
	        : segments[segment];
	      /*jshint laxbreak: false */
	    } else if (segment === null || segments[segment] === undefined) {
	      if (isArray(v)) {
	        segments = [];
	        // collapse empty elements within array
	        for (var i=0, l=v.length; i < l; i++) {
	          if (!v[i].length && (!segments.length || !segments[segments.length -1].length)) {
	            continue;
	          }

	          if (segments.length && !segments[segments.length -1].length) {
	            segments.pop();
	          }

	          segments.push(trimSlashes(v[i]));
	        }
	      } else if (v || typeof v === 'string') {
	        v = trimSlashes(v);
	        if (segments[segments.length -1] === '') {
	          // empty trailing elements have to be overwritten
	          // to prevent results such as /foo//bar
	          segments[segments.length -1] = v;
	        } else {
	          segments.push(v);
	        }
	      }
	    } else {
	      if (v) {
	        segments[segment] = trimSlashes(v);
	      } else {
	        segments.splice(segment, 1);
	      }
	    }

	    if (absolute) {
	      segments.unshift('');
	    }

	    return this.path(segments.join(separator), build);
	  };
	  p.segmentCoded = function(segment, v, build) {
	    var segments, i, l;

	    if (typeof segment !== 'number') {
	      build = v;
	      v = segment;
	      segment = undefined;
	    }

	    if (v === undefined) {
	      segments = this.segment(segment, v, build);
	      if (!isArray(segments)) {
	        segments = segments !== undefined ? URI.decode(segments) : undefined;
	      } else {
	        for (i = 0, l = segments.length; i < l; i++) {
	          segments[i] = URI.decode(segments[i]);
	        }
	      }

	      return segments;
	    }

	    if (!isArray(v)) {
	      v = (typeof v === 'string' || v instanceof String) ? URI.encode(v) : v;
	    } else {
	      for (i = 0, l = v.length; i < l; i++) {
	        v[i] = URI.encode(v[i]);
	      }
	    }

	    return this.segment(segment, v, build);
	  };

	  // mutating query string
	  var q = p.query;
	  p.query = function(v, build) {
	    if (v === true) {
	      return URI.parseQuery(this._parts.query, this._parts.escapeQuerySpace);
	    } else if (typeof v === 'function') {
	      var data = URI.parseQuery(this._parts.query, this._parts.escapeQuerySpace);
	      var result = v.call(this, data);
	      this._parts.query = URI.buildQuery(result || data, this._parts.duplicateQueryParameters, this._parts.escapeQuerySpace);
	      this.build(!build);
	      return this;
	    } else if (v !== undefined && typeof v !== 'string') {
	      this._parts.query = URI.buildQuery(v, this._parts.duplicateQueryParameters, this._parts.escapeQuerySpace);
	      this.build(!build);
	      return this;
	    } else {
	      return q.call(this, v, build);
	    }
	  };
	  p.setQuery = function(name, value, build) {
	    var data = URI.parseQuery(this._parts.query, this._parts.escapeQuerySpace);

	    if (typeof name === 'string' || name instanceof String) {
	      data[name] = value !== undefined ? value : null;
	    } else if (typeof name === 'object') {
	      for (var key in name) {
	        if (hasOwn.call(name, key)) {
	          data[key] = name[key];
	        }
	      }
	    } else {
	      throw new TypeError('URI.addQuery() accepts an object, string as the name parameter');
	    }

	    this._parts.query = URI.buildQuery(data, this._parts.duplicateQueryParameters, this._parts.escapeQuerySpace);
	    if (typeof name !== 'string') {
	      build = value;
	    }

	    this.build(!build);
	    return this;
	  };
	  p.addQuery = function(name, value, build) {
	    var data = URI.parseQuery(this._parts.query, this._parts.escapeQuerySpace);
	    URI.addQuery(data, name, value === undefined ? null : value);
	    this._parts.query = URI.buildQuery(data, this._parts.duplicateQueryParameters, this._parts.escapeQuerySpace);
	    if (typeof name !== 'string') {
	      build = value;
	    }

	    this.build(!build);
	    return this;
	  };
	  p.removeQuery = function(name, value, build) {
	    var data = URI.parseQuery(this._parts.query, this._parts.escapeQuerySpace);
	    URI.removeQuery(data, name, value);
	    this._parts.query = URI.buildQuery(data, this._parts.duplicateQueryParameters, this._parts.escapeQuerySpace);
	    if (typeof name !== 'string') {
	      build = value;
	    }

	    this.build(!build);
	    return this;
	  };
	  p.hasQuery = function(name, value, withinArray) {
	    var data = URI.parseQuery(this._parts.query, this._parts.escapeQuerySpace);
	    return URI.hasQuery(data, name, value, withinArray);
	  };
	  p.setSearch = p.setQuery;
	  p.addSearch = p.addQuery;
	  p.removeSearch = p.removeQuery;
	  p.hasSearch = p.hasQuery;

	  // sanitizing URLs
	  p.normalize = function() {
	    if (this._parts.urn) {
	      return this
	        .normalizeProtocol(false)
	        .normalizePath(false)
	        .normalizeQuery(false)
	        .normalizeFragment(false)
	        .build();
	    }

	    return this
	      .normalizeProtocol(false)
	      .normalizeHostname(false)
	      .normalizePort(false)
	      .normalizePath(false)
	      .normalizeQuery(false)
	      .normalizeFragment(false)
	      .build();
	  };
	  p.normalizeProtocol = function(build) {
	    if (typeof this._parts.protocol === 'string') {
	      this._parts.protocol = this._parts.protocol.toLowerCase();
	      this.build(!build);
	    }

	    return this;
	  };
	  p.normalizeHostname = function(build) {
	    if (this._parts.hostname) {
	      if (this.is('IDN') && punycode) {
	        this._parts.hostname = punycode.toASCII(this._parts.hostname);
	      } else if (this.is('IPv6') && IPv6) {
	        this._parts.hostname = IPv6.best(this._parts.hostname);
	      }

	      this._parts.hostname = this._parts.hostname.toLowerCase();
	      this.build(!build);
	    }

	    return this;
	  };
	  p.normalizePort = function(build) {
	    // remove port of it's the protocol's default
	    if (typeof this._parts.protocol === 'string' && this._parts.port === URI.defaultPorts[this._parts.protocol]) {
	      this._parts.port = null;
	      this.build(!build);
	    }

	    return this;
	  };
	  p.normalizePath = function(build) {
	    var _path = this._parts.path;
	    if (!_path) {
	      return this;
	    }

	    if (this._parts.urn) {
	      this._parts.path = URI.recodeUrnPath(this._parts.path);
	      this.build(!build);
	      return this;
	    }

	    if (this._parts.path === '/') {
	      return this;
	    }

	    _path = URI.recodePath(_path);

	    var _was_relative;
	    var _leadingParents = '';
	    var _parent, _pos;

	    // handle relative paths
	    if (_path.charAt(0) !== '/') {
	      _was_relative = true;
	      _path = '/' + _path;
	    }

	    // handle relative files (as opposed to directories)
	    if (_path.slice(-3) === '/..' || _path.slice(-2) === '/.') {
	      _path += '/';
	    }

	    // resolve simples
	    _path = _path
	      .replace(/(\/(\.\/)+)|(\/\.$)/g, '/')
	      .replace(/\/{2,}/g, '/');

	    // remember leading parents
	    if (_was_relative) {
	      _leadingParents = _path.substring(1).match(/^(\.\.\/)+/) || '';
	      if (_leadingParents) {
	        _leadingParents = _leadingParents[0];
	      }
	    }

	    // resolve parents
	    while (true) {
	      _parent = _path.search(/\/\.\.(\/|$)/);
	      if (_parent === -1) {
	        // no more ../ to resolve
	        break;
	      } else if (_parent === 0) {
	        // top level cannot be relative, skip it
	        _path = _path.substring(3);
	        continue;
	      }

	      _pos = _path.substring(0, _parent).lastIndexOf('/');
	      if (_pos === -1) {
	        _pos = _parent;
	      }
	      _path = _path.substring(0, _pos) + _path.substring(_parent + 3);
	    }

	    // revert to relative
	    if (_was_relative && this.is('relative')) {
	      _path = _leadingParents + _path.substring(1);
	    }

	    this._parts.path = _path;
	    this.build(!build);
	    return this;
	  };
	  p.normalizePathname = p.normalizePath;
	  p.normalizeQuery = function(build) {
	    if (typeof this._parts.query === 'string') {
	      if (!this._parts.query.length) {
	        this._parts.query = null;
	      } else {
	        this.query(URI.parseQuery(this._parts.query, this._parts.escapeQuerySpace));
	      }

	      this.build(!build);
	    }

	    return this;
	  };
	  p.normalizeFragment = function(build) {
	    if (!this._parts.fragment) {
	      this._parts.fragment = null;
	      this.build(!build);
	    }

	    return this;
	  };
	  p.normalizeSearch = p.normalizeQuery;
	  p.normalizeHash = p.normalizeFragment;

	  p.iso8859 = function() {
	    // expect unicode input, iso8859 output
	    var e = URI.encode;
	    var d = URI.decode;

	    URI.encode = escape;
	    URI.decode = decodeURIComponent;
	    try {
	      this.normalize();
	    } finally {
	      URI.encode = e;
	      URI.decode = d;
	    }
	    return this;
	  };

	  p.unicode = function() {
	    // expect iso8859 input, unicode output
	    var e = URI.encode;
	    var d = URI.decode;

	    URI.encode = strictEncodeURIComponent;
	    URI.decode = unescape;
	    try {
	      this.normalize();
	    } finally {
	      URI.encode = e;
	      URI.decode = d;
	    }
	    return this;
	  };

	  p.readable = function() {
	    var uri = this.clone();
	    // removing username, password, because they shouldn't be displayed according to RFC 3986
	    uri.username('').password('').normalize();
	    var t = '';
	    if (uri._parts.protocol) {
	      t += uri._parts.protocol + '://';
	    }

	    if (uri._parts.hostname) {
	      if (uri.is('punycode') && punycode) {
	        t += punycode.toUnicode(uri._parts.hostname);
	        if (uri._parts.port) {
	          t += ':' + uri._parts.port;
	        }
	      } else {
	        t += uri.host();
	      }
	    }

	    if (uri._parts.hostname && uri._parts.path && uri._parts.path.charAt(0) !== '/') {
	      t += '/';
	    }

	    t += uri.path(true);
	    if (uri._parts.query) {
	      var q = '';
	      for (var i = 0, qp = uri._parts.query.split('&'), l = qp.length; i < l; i++) {
	        var kv = (qp[i] || '').split('=');
	        q += '&' + URI.decodeQuery(kv[0], this._parts.escapeQuerySpace)
	          .replace(/&/g, '%26');

	        if (kv[1] !== undefined) {
	          q += '=' + URI.decodeQuery(kv[1], this._parts.escapeQuerySpace)
	            .replace(/&/g, '%26');
	        }
	      }
	      t += '?' + q.substring(1);
	    }

	    t += URI.decodeQuery(uri.hash(), true);
	    return t;
	  };

	  // resolving relative and absolute URLs
	  p.absoluteTo = function(base) {
	    var resolved = this.clone();
	    var properties = ['protocol', 'username', 'password', 'hostname', 'port'];
	    var basedir, i, p;

	    if (this._parts.urn) {
	      throw new Error('URNs do not have any generally defined hierarchical components');
	    }

	    if (!(base instanceof URI)) {
	      base = new URI(base);
	    }

	    if (resolved._parts.protocol) {
	      // Directly returns even if this._parts.hostname is empty.
	      return resolved;
	    } else {
	      resolved._parts.protocol = base._parts.protocol;
	    }

	    if (this._parts.hostname) {
	      return resolved;
	    }

	    for (i = 0; (p = properties[i]); i++) {
	      resolved._parts[p] = base._parts[p];
	    }

	    if (!resolved._parts.path) {
	      resolved._parts.path = base._parts.path;
	      if (!resolved._parts.query) {
	        resolved._parts.query = base._parts.query;
	      }
	    } else {
	      if (resolved._parts.path.substring(-2) === '..') {
	        resolved._parts.path += '/';
	      }

	      if (resolved.path().charAt(0) !== '/') {
	        basedir = base.directory();
	        basedir = basedir ? basedir : base.path().indexOf('/') === 0 ? '/' : '';
	        resolved._parts.path = (basedir ? (basedir + '/') : '') + resolved._parts.path;
	        resolved.normalizePath();
	      }
	    }

	    resolved.build();
	    return resolved;
	  };
	  p.relativeTo = function(base) {
	    var relative = this.clone().normalize();
	    var relativeParts, baseParts, common, relativePath, basePath;

	    if (relative._parts.urn) {
	      throw new Error('URNs do not have any generally defined hierarchical components');
	    }

	    base = new URI(base).normalize();
	    relativeParts = relative._parts;
	    baseParts = base._parts;
	    relativePath = relative.path();
	    basePath = base.path();

	    if (relativePath.charAt(0) !== '/') {
	      throw new Error('URI is already relative');
	    }

	    if (basePath.charAt(0) !== '/') {
	      throw new Error('Cannot calculate a URI relative to another relative URI');
	    }

	    if (relativeParts.protocol === baseParts.protocol) {
	      relativeParts.protocol = null;
	    }

	    if (relativeParts.username !== baseParts.username || relativeParts.password !== baseParts.password) {
	      return relative.build();
	    }

	    if (relativeParts.protocol !== null || relativeParts.username !== null || relativeParts.password !== null) {
	      return relative.build();
	    }

	    if (relativeParts.hostname === baseParts.hostname && relativeParts.port === baseParts.port) {
	      relativeParts.hostname = null;
	      relativeParts.port = null;
	    } else {
	      return relative.build();
	    }

	    if (relativePath === basePath) {
	      relativeParts.path = '';
	      return relative.build();
	    }

	    // determine common sub path
	    common = URI.commonPath(relativePath, basePath);

	    // If the paths have nothing in common, return a relative URL with the absolute path.
	    if (!common) {
	      return relative.build();
	    }

	    var parents = baseParts.path
	      .substring(common.length)
	      .replace(/[^\/]*$/, '')
	      .replace(/.*?\//g, '../');

	    relativeParts.path = (parents + relativeParts.path.substring(common.length)) || './';

	    return relative.build();
	  };

	  // comparing URIs
	  p.equals = function(uri) {
	    var one = this.clone();
	    var two = new URI(uri);
	    var one_map = {};
	    var two_map = {};
	    var checked = {};
	    var one_query, two_query, key;

	    one.normalize();
	    two.normalize();

	    // exact match
	    if (one.toString() === two.toString()) {
	      return true;
	    }

	    // extract query string
	    one_query = one.query();
	    two_query = two.query();
	    one.query('');
	    two.query('');

	    // definitely not equal if not even non-query parts match
	    if (one.toString() !== two.toString()) {
	      return false;
	    }

	    // query parameters have the same length, even if they're permuted
	    if (one_query.length !== two_query.length) {
	      return false;
	    }

	    one_map = URI.parseQuery(one_query, this._parts.escapeQuerySpace);
	    two_map = URI.parseQuery(two_query, this._parts.escapeQuerySpace);

	    for (key in one_map) {
	      if (hasOwn.call(one_map, key)) {
	        if (!isArray(one_map[key])) {
	          if (one_map[key] !== two_map[key]) {
	            return false;
	          }
	        } else if (!arraysEqual(one_map[key], two_map[key])) {
	          return false;
	        }

	        checked[key] = true;
	      }
	    }

	    for (key in two_map) {
	      if (hasOwn.call(two_map, key)) {
	        if (!checked[key]) {
	          // two contains a parameter not present in one
	          return false;
	        }
	      }
	    }

	    return true;
	  };

	  // state
	  p.preventInvalidHostname = function(v) {
	    this._parts.preventInvalidHostname = !!v;
	    return this;
	  };

	  p.duplicateQueryParameters = function(v) {
	    this._parts.duplicateQueryParameters = !!v;
	    return this;
	  };

	  p.escapeQuerySpace = function(v) {
	    this._parts.escapeQuerySpace = !!v;
	    return this;
	  };

	  return URI;
	}));
	});

	/**
	 * @private
	 */
	function appendForwardSlash(url) {
	  if (url.length === 0 || url[url.length - 1] !== "/") {
	    url = `${url}/`;
	  }
	  return url;
	}

	/**
	 * Clones an object, returning a new object containing the same properties.
	 *
	 * @function
	 *
	 * @param {Object} object The object to clone.
	 * @param {Boolean} [deep=false] If true, all properties will be deep cloned recursively.
	 * @returns {Object} The cloned object.
	 */
	function clone(object, deep) {
	  if (object === null || typeof object !== "object") {
	    return object;
	  }

	  deep = defined.defaultValue(deep, false);

	  const result = new object.constructor();
	  for (const propertyName in object) {
	    if (object.hasOwnProperty(propertyName)) {
	      let value = object[propertyName];
	      if (deep) {
	        value = clone(value, deep);
	      }
	      result[propertyName] = value;
	    }
	  }

	  return result;
	}

	/**
	 * Given a relative Uri and a base Uri, returns the absolute Uri of the relative Uri.
	 * @function
	 *
	 * @param {String} relative The relative Uri.
	 * @param {String} [base] The base Uri.
	 * @returns {String} The absolute Uri of the given relative Uri.
	 *
	 * @example
	 * //absolute Uri will be "https://test.com/awesome.png";
	 * const absoluteUri = Cesium.getAbsoluteUri('awesome.png', 'https://test.com');
	 */
	function getAbsoluteUri(relative, base) {
	  let documentObject;
	  if (typeof document !== "undefined") {
	    documentObject = document;
	  }

	  return getAbsoluteUri._implementation(relative, base, documentObject);
	}

	getAbsoluteUri._implementation = function (relative, base, documentObject) {
	  //>>includeStart('debug', pragmas.debug);
	  if (!defined.defined(relative)) {
	    throw new Check.DeveloperError("relative uri is required.");
	  }
	  //>>includeEnd('debug');

	  if (!defined.defined(base)) {
	    if (typeof documentObject === "undefined") {
	      return relative;
	    }
	    base = defined.defaultValue(documentObject.baseURI, documentObject.location.href);
	  }

	  const relativeUri = new URI(relative);
	  if (relativeUri.scheme() !== "") {
	    return relativeUri.toString();
	  }
	  return relativeUri.absoluteTo(base).toString();
	};

	/**
	 * Given a URI, returns the base path of the URI.
	 * @function
	 *
	 * @param {String} uri The Uri.
	 * @param {Boolean} [includeQuery = false] Whether or not to include the query string and fragment form the uri
	 * @returns {String} The base path of the Uri.
	 *
	 * @example
	 * // basePath will be "/Gallery/";
	 * const basePath = Cesium.getBaseUri('/Gallery/simple.czml?value=true&example=false');
	 *
	 * // basePath will be "/Gallery/?value=true&example=false";
	 * const basePath = Cesium.getBaseUri('/Gallery/simple.czml?value=true&example=false', true);
	 */
	function getBaseUri(uri, includeQuery) {
	  //>>includeStart('debug', pragmas.debug);
	  if (!defined.defined(uri)) {
	    throw new Check.DeveloperError("uri is required.");
	  }
	  //>>includeEnd('debug');

	  let basePath = "";
	  const i = uri.lastIndexOf("/");
	  if (i !== -1) {
	    basePath = uri.substring(0, i + 1);
	  }

	  if (!includeQuery) {
	    return basePath;
	  }

	  uri = new URI(uri);
	  if (uri.query().length !== 0) {
	    basePath += `?${uri.query()}`;
	  }
	  if (uri.fragment().length !== 0) {
	    basePath += `#${uri.fragment()}`;
	  }

	  return basePath;
	}

	/**
	 * Given a URI, returns the extension of the URI.
	 * @function getExtensionFromUri
	 *
	 * @param {String} uri The Uri.
	 * @returns {String} The extension of the Uri.
	 *
	 * @example
	 * //extension will be "czml";
	 * const extension = Cesium.getExtensionFromUri('/Gallery/simple.czml?value=true&example=false');
	 */
	function getExtensionFromUri(uri) {
	  //>>includeStart('debug', pragmas.debug);
	  if (!defined.defined(uri)) {
	    throw new Check.DeveloperError("uri is required.");
	  }
	  //>>includeEnd('debug');

	  const uriObject = new URI(uri);
	  uriObject.normalize();
	  let path = uriObject.path();
	  let index = path.lastIndexOf("/");
	  if (index !== -1) {
	    path = path.substr(index + 1);
	  }
	  index = path.lastIndexOf(".");
	  if (index === -1) {
	    path = "";
	  } else {
	    path = path.substr(index + 1);
	  }
	  return path;
	}

	const context2DsByWidthAndHeight = {};

	/**
	 * Extract a pixel array from a loaded image.  Draws the image
	 * into a canvas so it can read the pixels back.
	 *
	 * @function getImagePixels
	 *
	 * @param {HTMLImageElement|ImageBitmap} image The image to extract pixels from.
	 * @param {Number} width The width of the image. If not defined, then image.width is assigned.
	 * @param {Number} height The height of the image. If not defined, then image.height is assigned.
	 * @returns {ImageData} The pixels of the image.
	 */
	function getImagePixels(image, width, height) {
	  if (!defined.defined(width)) {
	    width = image.width;
	  }
	  if (!defined.defined(height)) {
	    height = image.height;
	  }

	  let context2DsByHeight = context2DsByWidthAndHeight[width];
	  if (!defined.defined(context2DsByHeight)) {
	    context2DsByHeight = {};
	    context2DsByWidthAndHeight[width] = context2DsByHeight;
	  }

	  let context2d = context2DsByHeight[height];
	  if (!defined.defined(context2d)) {
	    const canvas = document.createElement("canvas");
	    canvas.width = width;
	    canvas.height = height;
	    context2d = canvas.getContext("2d");
	    context2d.globalCompositeOperation = "copy";
	    context2DsByHeight[height] = context2d;
	  }

	  context2d.drawImage(image, 0, 0, width, height);
	  return context2d.getImageData(0, 0, width, height).data;
	}

	const blobUriRegex = /^blob:/i;

	/**
	 * Determines if the specified uri is a blob uri.
	 *
	 * @function isBlobUri
	 *
	 * @param {String} uri The uri to test.
	 * @returns {Boolean} true when the uri is a blob uri; otherwise, false.
	 *
	 * @private
	 */
	function isBlobUri(uri) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.Check.typeOf.string("uri", uri);
	  //>>includeEnd('debug');

	  return blobUriRegex.test(uri);
	}

	let a;

	/**
	 * Given a URL, determine whether that URL is considered cross-origin to the current page.
	 *
	 * @private
	 */
	function isCrossOriginUrl(url) {
	  if (!defined.defined(a)) {
	    a = document.createElement("a");
	  }

	  // copy window location into the anchor to get consistent results
	  // when the port is default for the protocol (e.g. 80 for HTTP)
	  a.href = window.location.href;

	  // host includes both hostname and port if the port is not standard
	  const host = a.host;
	  const protocol = a.protocol;

	  a.href = url;
	  // IE only absolutizes href on get, not set
	  // eslint-disable-next-line no-self-assign
	  a.href = a.href;

	  return protocol !== a.protocol || host !== a.host;
	}

	const dataUriRegex$1 = /^data:/i;

	/**
	 * Determines if the specified uri is a data uri.
	 *
	 * @function isDataUri
	 *
	 * @param {String} uri The uri to test.
	 * @returns {Boolean} true when the uri is a data uri; otherwise, false.
	 *
	 * @private
	 */
	function isDataUri(uri) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.Check.typeOf.string("uri", uri);
	  //>>includeEnd('debug');

	  return dataUriRegex$1.test(uri);
	}

	/**
	 * @private
	 */
	function loadAndExecuteScript(url) {
	  const script = document.createElement("script");
	  script.async = true;
	  script.src = url;

	  return new Promise((resolve, reject) => {
	    if (window.crossOriginIsolated) {
	      script.setAttribute("crossorigin", "anonymous");
	    }

	    const head = document.getElementsByTagName("head")[0];
	    script.onload = function () {
	      script.onload = undefined;
	      head.removeChild(script);
	      resolve();
	    };
	    script.onerror = function (e) {
	      reject(e);
	    };

	    head.appendChild(script);
	  });
	}

	/**
	 * Converts an object representing a set of name/value pairs into a query string,
	 * with names and values encoded properly for use in a URL.  Values that are arrays
	 * will produce multiple values with the same name.
	 * @function objectToQuery
	 *
	 * @param {Object} obj The object containing data to encode.
	 * @returns {String} An encoded query string.
	 *
	 *
	 * @example
	 * const str = Cesium.objectToQuery({
	 *     key1 : 'some value',
	 *     key2 : 'a/b',
	 *     key3 : ['x', 'y']
	 * });
	 *
	 * @see queryToObject
	 * // str will be:
	 * // 'key1=some%20value&key2=a%2Fb&key3=x&key3=y'
	 */
	function objectToQuery(obj) {
	  //>>includeStart('debug', pragmas.debug);
	  if (!defined.defined(obj)) {
	    throw new Check.DeveloperError("obj is required.");
	  }
	  //>>includeEnd('debug');

	  let result = "";
	  for (const propName in obj) {
	    if (obj.hasOwnProperty(propName)) {
	      const value = obj[propName];

	      const part = `${encodeURIComponent(propName)}=`;
	      if (Array.isArray(value)) {
	        for (let i = 0, len = value.length; i < len; ++i) {
	          result += `${part + encodeURIComponent(value[i])}&`;
	        }
	      } else {
	        result += `${part + encodeURIComponent(value)}&`;
	      }
	    }
	  }

	  // trim last &
	  result = result.slice(0, -1);

	  // This function used to replace %20 with + which is more compact and readable.
	  // However, some servers didn't properly handle + as a space.
	  // https://github.com/CesiumGS/cesium/issues/2192

	  return result;
	}

	/**
	 * Parses a query string into an object, where the keys and values of the object are the
	 * name/value pairs from the query string, decoded. If a name appears multiple times,
	 * the value in the object will be an array of values.
	 * @function queryToObject
	 *
	 * @param {String} queryString The query string.
	 * @returns {Object} An object containing the parameters parsed from the query string.
	 *
	 *
	 * @example
	 * const obj = Cesium.queryToObject('key1=some%20value&key2=a%2Fb&key3=x&key3=y');
	 * // obj will be:
	 * // {
	 * //   key1 : 'some value',
	 * //   key2 : 'a/b',
	 * //   key3 : ['x', 'y']
	 * // }
	 *
	 * @see objectToQuery
	 */
	function queryToObject(queryString) {
	  //>>includeStart('debug', pragmas.debug);
	  if (!defined.defined(queryString)) {
	    throw new Check.DeveloperError("queryString is required.");
	  }
	  //>>includeEnd('debug');

	  const result = {};
	  if (queryString === "") {
	    return result;
	  }
	  const parts = queryString.replace(/\+/g, "%20").split(/[&;]/);
	  for (let i = 0, len = parts.length; i < len; ++i) {
	    const subparts = parts[i].split("=");

	    const name = decodeURIComponent(subparts[0]);
	    let value = subparts[1];
	    if (defined.defined(value)) {
	      value = decodeURIComponent(value);
	    } else {
	      value = "";
	    }

	    const resultValue = result[name];
	    if (typeof resultValue === "string") {
	      // expand the single value to an array
	      result[name] = [resultValue, value];
	    } else if (Array.isArray(resultValue)) {
	      resultValue.push(value);
	    } else {
	      result[name] = value;
	    }
	  }
	  return result;
	}

	/**
	 * State of the request.
	 *
	 * @enum {Number}
	 */
	const RequestState = {
	  /**
	   * Initial unissued state.
	   *
	   * @type Number
	   * @constant
	   */
	  UNISSUED: 0,

	  /**
	   * Issued but not yet active. Will become active when open slots are available.
	   *
	   * @type Number
	   * @constant
	   */
	  ISSUED: 1,

	  /**
	   * Actual http request has been sent.
	   *
	   * @type Number
	   * @constant
	   */
	  ACTIVE: 2,

	  /**
	   * Request completed successfully.
	   *
	   * @type Number
	   * @constant
	   */
	  RECEIVED: 3,

	  /**
	   * Request was cancelled, either explicitly or automatically because of low priority.
	   *
	   * @type Number
	   * @constant
	   */
	  CANCELLED: 4,

	  /**
	   * Request failed.
	   *
	   * @type Number
	   * @constant
	   */
	  FAILED: 5,
	};
	var RequestState$1 = Object.freeze(RequestState);

	/**
	 * An enum identifying the type of request. Used for finer grained logging and priority sorting.
	 *
	 * @enum {Number}
	 */
	const RequestType = {
	  /**
	   * Terrain request.
	   *
	   * @type Number
	   * @constant
	   */
	  TERRAIN: 0,

	  /**
	   * Imagery request.
	   *
	   * @type Number
	   * @constant
	   */
	  IMAGERY: 1,

	  /**
	   * 3D Tiles request.
	   *
	   * @type Number
	   * @constant
	   */
	  TILES3D: 2,

	  /**
	   * Other request.
	   *
	   * @type Number
	   * @constant
	   */
	  OTHER: 3,
	};
	var RequestType$1 = Object.freeze(RequestType);

	/**
	 * Stores information for making a request. In general this does not need to be constructed directly.
	 *
	 * @alias Request
	 * @constructor

	 * @param {Object} [options] An object with the following properties:
	 * @param {String} [options.url] The url to request.
	 * @param {Request.RequestCallback} [options.requestFunction] The function that makes the actual data request.
	 * @param {Request.CancelCallback} [options.cancelFunction] The function that is called when the request is cancelled.
	 * @param {Request.PriorityCallback} [options.priorityFunction] The function that is called to update the request's priority, which occurs once per frame.
	 * @param {Number} [options.priority=0.0] The initial priority of the request.
	 * @param {Boolean} [options.throttle=false] Whether to throttle and prioritize the request. If false, the request will be sent immediately. If true, the request will be throttled and sent based on priority.
	 * @param {Boolean} [options.throttleByServer=false] Whether to throttle the request by server.
	 * @param {RequestType} [options.type=RequestType.OTHER] The type of request.
	 */
	function Request(options) {
	  options = defined.defaultValue(options, defined.defaultValue.EMPTY_OBJECT);

	  const throttleByServer = defined.defaultValue(options.throttleByServer, false);
	  const throttle = defined.defaultValue(options.throttle, false);

	  /**
	   * The URL to request.
	   *
	   * @type {String}
	   */
	  this.url = options.url;

	  /**
	   * The function that makes the actual data request.
	   *
	   * @type {Request.RequestCallback}
	   */
	  this.requestFunction = options.requestFunction;

	  /**
	   * The function that is called when the request is cancelled.
	   *
	   * @type {Request.CancelCallback}
	   */
	  this.cancelFunction = options.cancelFunction;

	  /**
	   * The function that is called to update the request's priority, which occurs once per frame.
	   *
	   * @type {Request.PriorityCallback}
	   */
	  this.priorityFunction = options.priorityFunction;

	  /**
	   * Priority is a unit-less value where lower values represent higher priority.
	   * For world-based objects, this is usually the distance from the camera.
	   * A request that does not have a priority function defaults to a priority of 0.
	   *
	   * If priorityFunction is defined, this value is updated every frame with the result of that call.
	   *
	   * @type {Number}
	   * @default 0.0
	   */
	  this.priority = defined.defaultValue(options.priority, 0.0);

	  /**
	   * Whether to throttle and prioritize the request. If false, the request will be sent immediately. If true, the
	   * request will be throttled and sent based on priority.
	   *
	   * @type {Boolean}
	   * @readonly
	   *
	   * @default false
	   */
	  this.throttle = throttle;

	  /**
	   * Whether to throttle the request by server. Browsers typically support about 6-8 parallel connections
	   * for HTTP/1 servers, and an unlimited amount of connections for HTTP/2 servers. Setting this value
	   * to <code>true</code> is preferable for requests going through HTTP/1 servers.
	   *
	   * @type {Boolean}
	   * @readonly
	   *
	   * @default false
	   */
	  this.throttleByServer = throttleByServer;

	  /**
	   * Type of request.
	   *
	   * @type {RequestType}
	   * @readonly
	   *
	   * @default RequestType.OTHER
	   */
	  this.type = defined.defaultValue(options.type, RequestType$1.OTHER);

	  /**
	   * A key used to identify the server that a request is going to. It is derived from the url's authority and scheme.
	   *
	   * @type {String}
	   *
	   * @private
	   */
	  this.serverKey = undefined;

	  /**
	   * The current state of the request.
	   *
	   * @type {RequestState}
	   * @readonly
	   */
	  this.state = RequestState$1.UNISSUED;

	  /**
	   * The requests's deferred promise.
	   *
	   * @type {Object}
	   *
	   * @private
	   */
	  this.deferred = undefined;

	  /**
	   * Whether the request was explicitly cancelled.
	   *
	   * @type {Boolean}
	   *
	   * @private
	   */
	  this.cancelled = false;
	}

	/**
	 * Mark the request as cancelled.
	 *
	 * @private
	 */
	Request.prototype.cancel = function () {
	  this.cancelled = true;
	};

	/**
	 * Duplicates a Request instance.
	 *
	 * @param {Request} [result] The object onto which to store the result.
	 *
	 * @returns {Request} The modified result parameter or a new Resource instance if one was not provided.
	 */
	Request.prototype.clone = function (result) {
	  if (!defined.defined(result)) {
	    return new Request(this);
	  }

	  result.url = this.url;
	  result.requestFunction = this.requestFunction;
	  result.cancelFunction = this.cancelFunction;
	  result.priorityFunction = this.priorityFunction;
	  result.priority = this.priority;
	  result.throttle = this.throttle;
	  result.throttleByServer = this.throttleByServer;
	  result.type = this.type;
	  result.serverKey = this.serverKey;

	  // These get defaulted because the cloned request hasn't been issued
	  result.state = this.RequestState.UNISSUED;
	  result.deferred = undefined;
	  result.cancelled = false;

	  return result;
	};

	/**
	 * Parses the result of XMLHttpRequest's getAllResponseHeaders() method into
	 * a dictionary.
	 *
	 * @function parseResponseHeaders
	 *
	 * @param {String} headerString The header string returned by getAllResponseHeaders().  The format is
	 *                 described here: http://www.w3.org/TR/XMLHttpRequest/#the-getallresponseheaders()-method
	 * @returns {Object} A dictionary of key/value pairs, where each key is the name of a header and the corresponding value
	 *                   is that header's value.
	 *
	 * @private
	 */
	function parseResponseHeaders(headerString) {
	  const headers = {};

	  if (!headerString) {
	    return headers;
	  }

	  const headerPairs = headerString.split("\u000d\u000a");

	  for (let i = 0; i < headerPairs.length; ++i) {
	    const headerPair = headerPairs[i];
	    // Can't use split() here because it does the wrong thing
	    // if the header value has the string ": " in it.
	    const index = headerPair.indexOf("\u003a\u0020");
	    if (index > 0) {
	      const key = headerPair.substring(0, index);
	      const val = headerPair.substring(index + 2);
	      headers[key] = val;
	    }
	  }

	  return headers;
	}

	/**
	 * An event that is raised when a request encounters an error.
	 *
	 * @constructor
	 * @alias RequestErrorEvent
	 *
	 * @param {Number} [statusCode] The HTTP error status code, such as 404.
	 * @param {Object} [response] The response included along with the error.
	 * @param {String|Object} [responseHeaders] The response headers, represented either as an object literal or as a
	 *                        string in the format returned by XMLHttpRequest's getAllResponseHeaders() function.
	 */
	function RequestErrorEvent(statusCode, response, responseHeaders) {
	  /**
	   * The HTTP error status code, such as 404.  If the error does not have a particular
	   * HTTP code, this property will be undefined.
	   *
	   * @type {Number}
	   */
	  this.statusCode = statusCode;

	  /**
	   * The response included along with the error.  If the error does not include a response,
	   * this property will be undefined.
	   *
	   * @type {Object}
	   */
	  this.response = response;

	  /**
	   * The headers included in the response, represented as an object literal of key/value pairs.
	   * If the error does not include any headers, this property will be undefined.
	   *
	   * @type {Object}
	   */
	  this.responseHeaders = responseHeaders;

	  if (typeof this.responseHeaders === "string") {
	    this.responseHeaders = parseResponseHeaders(this.responseHeaders);
	  }
	}

	/**
	 * Creates a string representing this RequestErrorEvent.
	 * @memberof RequestErrorEvent
	 *
	 * @returns {String} A string representing the provided RequestErrorEvent.
	 */
	RequestErrorEvent.prototype.toString = function () {
	  let str = "Request has failed.";
	  if (defined.defined(this.statusCode)) {
	    str += ` Status Code: ${this.statusCode}`;
	  }
	  return str;
	};

	/**
	 * A generic utility class for managing subscribers for a particular event.
	 * This class is usually instantiated inside of a container class and
	 * exposed as a property for others to subscribe to.
	 *
	 * @alias Event
	 * @template Listener extends (...args: any[]) => void = (...args: any[]) => void
	 * @constructor
	 * @example
	 * MyObject.prototype.myListener = function(arg1, arg2) {
	 *     this.myArg1Copy = arg1;
	 *     this.myArg2Copy = arg2;
	 * }
	 *
	 * const myObjectInstance = new MyObject();
	 * const evt = new Cesium.Event();
	 * evt.addEventListener(MyObject.prototype.myListener, myObjectInstance);
	 * evt.raiseEvent('1', '2');
	 * evt.removeEventListener(MyObject.prototype.myListener);
	 */
	function Event() {
	  this._listeners = [];
	  this._scopes = [];
	  this._toRemove = [];
	  this._insideRaiseEvent = false;
	}

	Object.defineProperties(Event.prototype, {
	  /**
	   * The number of listeners currently subscribed to the event.
	   * @memberof Event.prototype
	   * @type {Number}
	   * @readonly
	   */
	  numberOfListeners: {
	    get: function () {
	      return this._listeners.length - this._toRemove.length;
	    },
	  },
	});

	/**
	 * Registers a callback function to be executed whenever the event is raised.
	 * An optional scope can be provided to serve as the <code>this</code> pointer
	 * in which the function will execute.
	 *
	 * @param {Listener} listener The function to be executed when the event is raised.
	 * @param {Object} [scope] An optional object scope to serve as the <code>this</code>
	 *        pointer in which the listener function will execute.
	 * @returns {Event.RemoveCallback} A function that will remove this event listener when invoked.
	 *
	 * @see Event#raiseEvent
	 * @see Event#removeEventListener
	 */
	Event.prototype.addEventListener = function (listener, scope) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.Check.typeOf.func("listener", listener);
	  //>>includeEnd('debug');

	  this._listeners.push(listener);
	  this._scopes.push(scope);

	  const event = this;
	  return function () {
	    event.removeEventListener(listener, scope);
	  };
	};

	/**
	 * Unregisters a previously registered callback.
	 *
	 * @param {Listener} listener The function to be unregistered.
	 * @param {Object} [scope] The scope that was originally passed to addEventListener.
	 * @returns {Boolean} <code>true</code> if the listener was removed; <code>false</code> if the listener and scope are not registered with the event.
	 *
	 * @see Event#addEventListener
	 * @see Event#raiseEvent
	 */
	Event.prototype.removeEventListener = function (listener, scope) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.Check.typeOf.func("listener", listener);
	  //>>includeEnd('debug');

	  const listeners = this._listeners;
	  const scopes = this._scopes;

	  let index = -1;
	  for (let i = 0; i < listeners.length; i++) {
	    if (listeners[i] === listener && scopes[i] === scope) {
	      index = i;
	      break;
	    }
	  }

	  if (index !== -1) {
	    if (this._insideRaiseEvent) {
	      //In order to allow removing an event subscription from within
	      //a callback, we don't actually remove the items here.  Instead
	      //remember the index they are at and undefined their value.
	      this._toRemove.push(index);
	      listeners[index] = undefined;
	      scopes[index] = undefined;
	    } else {
	      listeners.splice(index, 1);
	      scopes.splice(index, 1);
	    }
	    return true;
	  }

	  return false;
	};

	function compareNumber(a, b) {
	  return b - a;
	}

	/**
	 * Raises the event by calling each registered listener with all supplied arguments.
	 *
	 * @param {...Parameters<Listener>} arguments This method takes any number of parameters and passes them through to the listener functions.
	 *
	 * @see Event#addEventListener
	 * @see Event#removeEventListener
	 */
	Event.prototype.raiseEvent = function () {
	  this._insideRaiseEvent = true;

	  let i;
	  const listeners = this._listeners;
	  const scopes = this._scopes;
	  let length = listeners.length;

	  for (i = 0; i < length; i++) {
	    const listener = listeners[i];
	    if (defined.defined(listener)) {
	      listeners[i].apply(scopes[i], arguments);
	    }
	  }

	  //Actually remove items removed in removeEventListener.
	  const toRemove = this._toRemove;
	  length = toRemove.length;
	  if (length > 0) {
	    toRemove.sort(compareNumber);
	    for (i = 0; i < length; i++) {
	      const index = toRemove[i];
	      listeners.splice(index, 1);
	      scopes.splice(index, 1);
	    }
	    toRemove.length = 0;
	  }

	  this._insideRaiseEvent = false;
	};

	/**
	 * Array implementation of a heap.
	 *
	 * @alias Heap
	 * @constructor
	 * @private
	 *
	 * @param {Object} options Object with the following properties:
	 * @param {Heap.ComparatorCallback} options.comparator The comparator to use for the heap. If comparator(a, b) is less than 0, sort a to a lower index than b, otherwise sort to a higher index.
	 */
	function Heap(options) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.Check.typeOf.object("options", options);
	  Check.Check.defined("options.comparator", options.comparator);
	  //>>includeEnd('debug');

	  this._comparator = options.comparator;
	  this._array = [];
	  this._length = 0;
	  this._maximumLength = undefined;
	}

	Object.defineProperties(Heap.prototype, {
	  /**
	   * Gets the length of the heap.
	   *
	   * @memberof Heap.prototype
	   *
	   * @type {Number}
	   * @readonly
	   */
	  length: {
	    get: function () {
	      return this._length;
	    },
	  },

	  /**
	   * Gets the internal array.
	   *
	   * @memberof Heap.prototype
	   *
	   * @type {Array}
	   * @readonly
	   */
	  internalArray: {
	    get: function () {
	      return this._array;
	    },
	  },

	  /**
	   * Gets and sets the maximum length of the heap.
	   *
	   * @memberof Heap.prototype
	   *
	   * @type {Number}
	   */
	  maximumLength: {
	    get: function () {
	      return this._maximumLength;
	    },
	    set: function (value) {
	      //>>includeStart('debug', pragmas.debug);
	      Check.Check.typeOf.number.greaterThanOrEquals("maximumLength", value, 0);
	      //>>includeEnd('debug');
	      const originalLength = this._length;
	      if (value < originalLength) {
	        const array = this._array;
	        // Remove trailing references
	        for (let i = value; i < originalLength; ++i) {
	          array[i] = undefined;
	        }
	        this._length = value;
	        array.length = value;
	      }
	      this._maximumLength = value;
	    },
	  },

	  /**
	   * The comparator to use for the heap. If comparator(a, b) is less than 0, sort a to a lower index than b, otherwise sort to a higher index.
	   *
	   * @memberof Heap.prototype
	   *
	   * @type {Heap.ComparatorCallback}
	   */
	  comparator: {
	    get: function () {
	      return this._comparator;
	    },
	  },
	});

	function swap(array, a, b) {
	  const temp = array[a];
	  array[a] = array[b];
	  array[b] = temp;
	}

	/**
	 * Resizes the internal array of the heap.
	 *
	 * @param {Number} [length] The length to resize internal array to. Defaults to the current length of the heap.
	 */
	Heap.prototype.reserve = function (length) {
	  length = defined.defaultValue(length, this._length);
	  this._array.length = length;
	};

	/**
	 * Update the heap so that index and all descendants satisfy the heap property.
	 *
	 * @param {Number} [index=0] The starting index to heapify from.
	 */
	Heap.prototype.heapify = function (index) {
	  index = defined.defaultValue(index, 0);
	  const length = this._length;
	  const comparator = this._comparator;
	  const array = this._array;
	  let candidate = -1;
	  let inserting = true;

	  while (inserting) {
	    const right = 2 * (index + 1);
	    const left = right - 1;

	    if (left < length && comparator(array[left], array[index]) < 0) {
	      candidate = left;
	    } else {
	      candidate = index;
	    }

	    if (right < length && comparator(array[right], array[candidate]) < 0) {
	      candidate = right;
	    }
	    if (candidate !== index) {
	      swap(array, candidate, index);
	      index = candidate;
	    } else {
	      inserting = false;
	    }
	  }
	};

	/**
	 * Resort the heap.
	 */
	Heap.prototype.resort = function () {
	  const length = this._length;
	  for (let i = Math.ceil(length / 2); i >= 0; --i) {
	    this.heapify(i);
	  }
	};

	/**
	 * Insert an element into the heap. If the length would grow greater than maximumLength
	 * of the heap, extra elements are removed.
	 *
	 * @param {*} element The element to insert
	 *
	 * @return {*} The element that was removed from the heap if the heap is at full capacity.
	 */
	Heap.prototype.insert = function (element) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.Check.defined("element", element);
	  //>>includeEnd('debug');

	  const array = this._array;
	  const comparator = this._comparator;
	  const maximumLength = this._maximumLength;

	  let index = this._length++;
	  if (index < array.length) {
	    array[index] = element;
	  } else {
	    array.push(element);
	  }

	  while (index !== 0) {
	    const parent = Math.floor((index - 1) / 2);
	    if (comparator(array[index], array[parent]) < 0) {
	      swap(array, index, parent);
	      index = parent;
	    } else {
	      break;
	    }
	  }

	  let removedElement;

	  if (defined.defined(maximumLength) && this._length > maximumLength) {
	    removedElement = array[maximumLength];
	    this._length = maximumLength;
	  }

	  return removedElement;
	};

	/**
	 * Remove the element specified by index from the heap and return it.
	 *
	 * @param {Number} [index=0] The index to remove.
	 * @returns {*} The specified element of the heap.
	 */
	Heap.prototype.pop = function (index) {
	  index = defined.defaultValue(index, 0);
	  if (this._length === 0) {
	    return undefined;
	  }
	  //>>includeStart('debug', pragmas.debug);
	  Check.Check.typeOf.number.lessThan("index", index, this._length);
	  //>>includeEnd('debug');

	  const array = this._array;
	  const root = array[index];
	  swap(array, index, --this._length);
	  this.heapify(index);
	  array[this._length] = undefined; // Remove trailing reference
	  return root;
	};

	function sortRequests(a, b) {
	  return a.priority - b.priority;
	}

	const statistics = {
	  numberOfAttemptedRequests: 0,
	  numberOfActiveRequests: 0,
	  numberOfCancelledRequests: 0,
	  numberOfCancelledActiveRequests: 0,
	  numberOfFailedRequests: 0,
	  numberOfActiveRequestsEver: 0,
	  lastNumberOfActiveRequests: 0,
	};

	let priorityHeapLength = 20;
	const requestHeap = new Heap({
	  comparator: sortRequests,
	});
	requestHeap.maximumLength = priorityHeapLength;
	requestHeap.reserve(priorityHeapLength);

	const activeRequests = [];
	let numberOfActiveRequestsByServer = {};

	const pageUri =
	  typeof document !== "undefined" ? new URI(document.location.href) : new URI();

	const requestCompletedEvent = new Event();

	/**
	 * The request scheduler is used to track and constrain the number of active requests in order to prioritize incoming requests. The ability
	 * to retain control over the number of requests in CesiumJS is important because due to events such as changes in the camera position,
	 * a lot of new requests may be generated and a lot of in-flight requests may become redundant. The request scheduler manually constrains the
	 * number of requests so that newer requests wait in a shorter queue and don't have to compete for bandwidth with requests that have expired.
	 *
	 * @namespace RequestScheduler
	 *
	 */
	function RequestScheduler() {}

	/**
	 * The maximum number of simultaneous active requests. Un-throttled requests do not observe this limit.
	 * @type {Number}
	 * @default 50
	 */
	RequestScheduler.maximumRequests = 50;

	/**
	 * The maximum number of simultaneous active requests per server. Un-throttled requests or servers specifically
	 * listed in {@link requestsByServer} do not observe this limit.
	 * @type {Number}
	 * @default 6
	 */
	RequestScheduler.maximumRequestsPerServer = 6;

	/**
	 * A per server key list of overrides to use for throttling instead of <code>maximumRequestsPerServer</code>
	 * @type {Object}
	 *
	 * @example
	 * RequestScheduler.requestsByServer = {
	 *   'api.cesium.com:443': 18,
	 *   'assets.cesium.com:443': 18
	 * };
	 */
	RequestScheduler.requestsByServer = {
	  "api.cesium.com:443": 18,
	  "assets.cesium.com:443": 18,
	};

	/**
	 * Specifies if the request scheduler should throttle incoming requests, or let the browser queue requests under its control.
	 * @type {Boolean}
	 * @default true
	 */
	RequestScheduler.throttleRequests = true;

	/**
	 * When true, log statistics to the console every frame
	 * @type {Boolean}
	 * @default false
	 * @private
	 */
	RequestScheduler.debugShowStatistics = false;

	/**
	 * An event that's raised when a request is completed.  Event handlers are passed
	 * the error object if the request fails.
	 *
	 * @type {Event}
	 * @default Event()
	 * @private
	 */
	RequestScheduler.requestCompletedEvent = requestCompletedEvent;

	Object.defineProperties(RequestScheduler, {
	  /**
	   * Returns the statistics used by the request scheduler.
	   *
	   * @memberof RequestScheduler
	   *
	   * @type Object
	   * @readonly
	   * @private
	   */
	  statistics: {
	    get: function () {
	      return statistics;
	    },
	  },

	  /**
	   * The maximum size of the priority heap. This limits the number of requests that are sorted by priority. Only applies to requests that are not yet active.
	   *
	   * @memberof RequestScheduler
	   *
	   * @type {Number}
	   * @default 20
	   * @private
	   */
	  priorityHeapLength: {
	    get: function () {
	      return priorityHeapLength;
	    },
	    set: function (value) {
	      // If the new length shrinks the heap, need to cancel some of the requests.
	      // Since this value is not intended to be tweaked regularly it is fine to just cancel the high priority requests.
	      if (value < priorityHeapLength) {
	        while (requestHeap.length > value) {
	          const request = requestHeap.pop();
	          cancelRequest(request);
	        }
	      }
	      priorityHeapLength = value;
	      requestHeap.maximumLength = value;
	      requestHeap.reserve(value);
	    },
	  },
	});

	function updatePriority(request) {
	  if (defined.defined(request.priorityFunction)) {
	    request.priority = request.priorityFunction();
	  }
	}

	/**
	 * Check if there are open slots for a particular server key. If desiredRequests is greater than 1, this checks if the queue has room for scheduling multiple requests.
	 * @param {String} serverKey The server key returned by {@link RequestScheduler.getServerKey}.
	 * @param {Number} [desiredRequests=1] How many requests the caller plans to request
	 * @return {Boolean} True if there are enough open slots for <code>desiredRequests</code> more requests.
	 * @private
	 */
	RequestScheduler.serverHasOpenSlots = function (serverKey, desiredRequests) {
	  desiredRequests = defined.defaultValue(desiredRequests, 1);

	  const maxRequests = defined.defaultValue(
	    RequestScheduler.requestsByServer[serverKey],
	    RequestScheduler.maximumRequestsPerServer
	  );
	  const hasOpenSlotsServer =
	    numberOfActiveRequestsByServer[serverKey] + desiredRequests <= maxRequests;

	  return hasOpenSlotsServer;
	};

	/**
	 * Check if the priority heap has open slots, regardless of which server they
	 * are from. This is used in {@link Multiple3DTileContent} for determining when
	 * all requests can be scheduled
	 * @param {Number} desiredRequests The number of requests the caller intends to make
	 * @return {Boolean} <code>true</code> if the heap has enough available slots to meet the desiredRequests. <code>false</code> otherwise.
	 *
	 * @private
	 */
	RequestScheduler.heapHasOpenSlots = function (desiredRequests) {
	  const hasOpenSlotsHeap =
	    requestHeap.length + desiredRequests <= priorityHeapLength;
	  return hasOpenSlotsHeap;
	};

	function issueRequest(request) {
	  if (request.state === RequestState$1.UNISSUED) {
	    request.state = RequestState$1.ISSUED;
	    request.deferred = defer.defer();
	  }
	  return request.deferred.promise;
	}

	function getRequestReceivedFunction(request) {
	  return function (results) {
	    if (request.state === RequestState$1.CANCELLED) {
	      // If the data request comes back but the request is cancelled, ignore it.
	      return;
	    }
	    // explicitly set to undefined to ensure GC of request response data. See #8843
	    const deferred = request.deferred;

	    --statistics.numberOfActiveRequests;
	    --numberOfActiveRequestsByServer[request.serverKey];
	    requestCompletedEvent.raiseEvent();
	    request.state = RequestState$1.RECEIVED;
	    request.deferred = undefined;

	    deferred.resolve(results);
	  };
	}

	function getRequestFailedFunction(request) {
	  return function (error) {
	    if (request.state === RequestState$1.CANCELLED) {
	      // If the data request comes back but the request is cancelled, ignore it.
	      return;
	    }
	    ++statistics.numberOfFailedRequests;
	    --statistics.numberOfActiveRequests;
	    --numberOfActiveRequestsByServer[request.serverKey];
	    requestCompletedEvent.raiseEvent(error);
	    request.state = RequestState$1.FAILED;
	    request.deferred.reject(error);
	  };
	}

	function startRequest(request) {
	  const promise = issueRequest(request);
	  request.state = RequestState$1.ACTIVE;
	  activeRequests.push(request);
	  ++statistics.numberOfActiveRequests;
	  ++statistics.numberOfActiveRequestsEver;
	  ++numberOfActiveRequestsByServer[request.serverKey];
	  request
	    .requestFunction()
	    .then(getRequestReceivedFunction(request))
	    .catch(getRequestFailedFunction(request));
	  return promise;
	}

	function cancelRequest(request) {
	  const active = request.state === RequestState$1.ACTIVE;
	  request.state = RequestState$1.CANCELLED;
	  ++statistics.numberOfCancelledRequests;
	  // check that deferred has not been cleared since cancelRequest can be called
	  // on a finished request, e.g. by clearForSpecs during tests
	  if (defined.defined(request.deferred)) {
	    const deferred = request.deferred;
	    request.deferred = undefined;
	    deferred.reject();
	  }

	  if (active) {
	    --statistics.numberOfActiveRequests;
	    --numberOfActiveRequestsByServer[request.serverKey];
	    ++statistics.numberOfCancelledActiveRequests;
	  }

	  if (defined.defined(request.cancelFunction)) {
	    request.cancelFunction();
	  }
	}

	/**
	 * Sort requests by priority and start requests.
	 * @private
	 */
	RequestScheduler.update = function () {
	  let i;
	  let request;

	  // Loop over all active requests. Cancelled, failed, or received requests are removed from the array to make room for new requests.
	  let removeCount = 0;
	  const activeLength = activeRequests.length;
	  for (i = 0; i < activeLength; ++i) {
	    request = activeRequests[i];
	    if (request.cancelled) {
	      // Request was explicitly cancelled
	      cancelRequest(request);
	    }
	    if (request.state !== RequestState$1.ACTIVE) {
	      // Request is no longer active, remove from array
	      ++removeCount;
	      continue;
	    }
	    if (removeCount > 0) {
	      // Shift back to fill in vacated slots from completed requests
	      activeRequests[i - removeCount] = request;
	    }
	  }
	  activeRequests.length -= removeCount;

	  // Update priority of issued requests and resort the heap
	  const issuedRequests = requestHeap.internalArray;
	  const issuedLength = requestHeap.length;
	  for (i = 0; i < issuedLength; ++i) {
	    updatePriority(issuedRequests[i]);
	  }
	  requestHeap.resort();

	  // Get the number of open slots and fill with the highest priority requests.
	  // Un-throttled requests are automatically added to activeRequests, so activeRequests.length may exceed maximumRequests
	  const openSlots = Math.max(
	    RequestScheduler.maximumRequests - activeRequests.length,
	    0
	  );
	  let filledSlots = 0;
	  while (filledSlots < openSlots && requestHeap.length > 0) {
	    // Loop until all open slots are filled or the heap becomes empty
	    request = requestHeap.pop();
	    if (request.cancelled) {
	      // Request was explicitly cancelled
	      cancelRequest(request);
	      continue;
	    }

	    if (
	      request.throttleByServer &&
	      !RequestScheduler.serverHasOpenSlots(request.serverKey)
	    ) {
	      // Open slots are available, but the request is throttled by its server. Cancel and try again later.
	      cancelRequest(request);
	      continue;
	    }

	    startRequest(request);
	    ++filledSlots;
	  }

	  updateStatistics();
	};

	/**
	 * Get the server key from a given url.
	 *
	 * @param {String} url The url.
	 * @returns {String} The server key.
	 * @private
	 */
	RequestScheduler.getServerKey = function (url) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.Check.typeOf.string("url", url);
	  //>>includeEnd('debug');

	  let uri = new URI(url);
	  if (uri.scheme() === "") {
	    uri = new URI(url).absoluteTo(pageUri);
	    uri.normalize();
	  }

	  let serverKey = uri.authority();
	  if (!/:/.test(serverKey)) {
	    // If the authority does not contain a port number, add port 443 for https or port 80 for http
	    serverKey = `${serverKey}:${uri.scheme() === "https" ? "443" : "80"}`;
	  }

	  const length = numberOfActiveRequestsByServer[serverKey];
	  if (!defined.defined(length)) {
	    numberOfActiveRequestsByServer[serverKey] = 0;
	  }

	  return serverKey;
	};

	/**
	 * Issue a request. If request.throttle is false, the request is sent immediately. Otherwise the request will be
	 * queued and sorted by priority before being sent.
	 *
	 * @param {Request} request The request object.
	 *
	 * @returns {Promise|undefined} A Promise for the requested data, or undefined if this request does not have high enough priority to be issued.
	 *
	 * @private
	 */
	RequestScheduler.request = function (request) {
	  //>>includeStart('debug', pragmas.debug);
	  Check.Check.typeOf.object("request", request);
	  Check.Check.typeOf.string("request.url", request.url);
	  Check.Check.typeOf.func("request.requestFunction", request.requestFunction);
	  //>>includeEnd('debug');

	  if (isDataUri(request.url) || isBlobUri(request.url)) {
	    requestCompletedEvent.raiseEvent();
	    request.state = RequestState$1.RECEIVED;
	    return request.requestFunction();
	  }

	  ++statistics.numberOfAttemptedRequests;

	  if (!defined.defined(request.serverKey)) {
	    request.serverKey = RequestScheduler.getServerKey(request.url);
	  }

	  if (
	    RequestScheduler.throttleRequests &&
	    request.throttleByServer &&
	    !RequestScheduler.serverHasOpenSlots(request.serverKey)
	  ) {
	    // Server is saturated. Try again later.
	    return undefined;
	  }

	  if (!RequestScheduler.throttleRequests || !request.throttle) {
	    return startRequest(request);
	  }

	  if (activeRequests.length >= RequestScheduler.maximumRequests) {
	    // Active requests are saturated. Try again later.
	    return undefined;
	  }

	  // Insert into the priority heap and see if a request was bumped off. If this request is the lowest
	  // priority it will be returned.
	  updatePriority(request);
	  const removedRequest = requestHeap.insert(request);

	  if (defined.defined(removedRequest)) {
	    if (removedRequest === request) {
	      // Request does not have high enough priority to be issued
	      return undefined;
	    }
	    // A previously issued request has been bumped off the priority heap, so cancel it
	    cancelRequest(removedRequest);
	  }

	  return issueRequest(request);
	};

	function updateStatistics() {
	  if (!RequestScheduler.debugShowStatistics) {
	    return;
	  }

	  if (
	    statistics.numberOfActiveRequests === 0 &&
	    statistics.lastNumberOfActiveRequests > 0
	  ) {
	    if (statistics.numberOfAttemptedRequests > 0) {
	      console.log(
	        `Number of attempted requests: ${statistics.numberOfAttemptedRequests}`
	      );
	      statistics.numberOfAttemptedRequests = 0;
	    }

	    if (statistics.numberOfCancelledRequests > 0) {
	      console.log(
	        `Number of cancelled requests: ${statistics.numberOfCancelledRequests}`
	      );
	      statistics.numberOfCancelledRequests = 0;
	    }

	    if (statistics.numberOfCancelledActiveRequests > 0) {
	      console.log(
	        `Number of cancelled active requests: ${statistics.numberOfCancelledActiveRequests}`
	      );
	      statistics.numberOfCancelledActiveRequests = 0;
	    }

	    if (statistics.numberOfFailedRequests > 0) {
	      console.log(
	        `Number of failed requests: ${statistics.numberOfFailedRequests}`
	      );
	      statistics.numberOfFailedRequests = 0;
	    }
	  }

	  statistics.lastNumberOfActiveRequests = statistics.numberOfActiveRequests;
	}

	/**
	 * For testing only. Clears any requests that may not have completed from previous tests.
	 *
	 * @private
	 */
	RequestScheduler.clearForSpecs = function () {
	  while (requestHeap.length > 0) {
	    const request = requestHeap.pop();
	    cancelRequest(request);
	  }
	  const length = activeRequests.length;
	  for (let i = 0; i < length; ++i) {
	    cancelRequest(activeRequests[i]);
	  }
	  activeRequests.length = 0;
	  numberOfActiveRequestsByServer = {};

	  // Clear stats
	  statistics.numberOfAttemptedRequests = 0;
	  statistics.numberOfActiveRequests = 0;
	  statistics.numberOfCancelledRequests = 0;
	  statistics.numberOfCancelledActiveRequests = 0;
	  statistics.numberOfFailedRequests = 0;
	  statistics.numberOfActiveRequestsEver = 0;
	  statistics.lastNumberOfActiveRequests = 0;
	};

	/**
	 * For testing only.
	 *
	 * @private
	 */
	RequestScheduler.numberOfActiveRequestsByServer = function (serverKey) {
	  return numberOfActiveRequestsByServer[serverKey];
	};

	/**
	 * For testing only.
	 *
	 * @private
	 */
	RequestScheduler.requestHeap = requestHeap;

	/**
	 * A singleton that contains all of the servers that are trusted. Credentials will be sent with
	 * any requests to these servers.
	 *
	 * @namespace TrustedServers
	 *
	 * @see {@link http://www.w3.org/TR/cors/|Cross-Origin Resource Sharing}
	 */
	const TrustedServers = {};
	let _servers = {};

	/**
	 * Adds a trusted server to the registry
	 *
	 * @param {String} host The host to be added.
	 * @param {Number} port The port used to access the host.
	 *
	 * @example
	 * // Add a trusted server
	 * TrustedServers.add('my.server.com', 80);
	 */
	TrustedServers.add = function (host, port) {
	  //>>includeStart('debug', pragmas.debug);
	  if (!defined.defined(host)) {
	    throw new Check.DeveloperError("host is required.");
	  }
	  if (!defined.defined(port) || port <= 0) {
	    throw new Check.DeveloperError("port is required to be greater than 0.");
	  }
	  //>>includeEnd('debug');

	  const authority = `${host.toLowerCase()}:${port}`;
	  if (!defined.defined(_servers[authority])) {
	    _servers[authority] = true;
	  }
	};

	/**
	 * Removes a trusted server from the registry
	 *
	 * @param {String} host The host to be removed.
	 * @param {Number} port The port used to access the host.
	 *
	 * @example
	 * // Remove a trusted server
	 * TrustedServers.remove('my.server.com', 80);
	 */
	TrustedServers.remove = function (host, port) {
	  //>>includeStart('debug', pragmas.debug);
	  if (!defined.defined(host)) {
	    throw new Check.DeveloperError("host is required.");
	  }
	  if (!defined.defined(port) || port <= 0) {
	    throw new Check.DeveloperError("port is required to be greater than 0.");
	  }
	  //>>includeEnd('debug');

	  const authority = `${host.toLowerCase()}:${port}`;
	  if (defined.defined(_servers[authority])) {
	    delete _servers[authority];
	  }
	};

	function getAuthority(url) {
	  const uri = new URI(url);
	  uri.normalize();

	  // Removes username:password@ so we just have host[:port]
	  let authority = uri.authority();
	  if (authority.length === 0) {
	    return undefined; // Relative URL
	  }
	  uri.authority(authority);

	  if (authority.indexOf("@") !== -1) {
	    const parts = authority.split("@");
	    authority = parts[1];
	  }

	  // If the port is missing add one based on the scheme
	  if (authority.indexOf(":") === -1) {
	    let scheme = uri.scheme();
	    if (scheme.length === 0) {
	      scheme = window.location.protocol;
	      scheme = scheme.substring(0, scheme.length - 1);
	    }
	    if (scheme === "http") {
	      authority += ":80";
	    } else if (scheme === "https") {
	      authority += ":443";
	    } else {
	      return undefined;
	    }
	  }

	  return authority;
	}

	/**
	 * Tests whether a server is trusted or not. The server must have been added with the port if it is included in the url.
	 *
	 * @param {String} url The url to be tested against the trusted list
	 *
	 * @returns {boolean} Returns true if url is trusted, false otherwise.
	 *
	 * @example
	 * // Add server
	 * TrustedServers.add('my.server.com', 81);
	 *
	 * // Check if server is trusted
	 * if (TrustedServers.contains('https://my.server.com:81/path/to/file.png')) {
	 *     // my.server.com:81 is trusted
	 * }
	 * if (TrustedServers.contains('https://my.server.com/path/to/file.png')) {
	 *     // my.server.com isn't trusted
	 * }
	 */
	TrustedServers.contains = function (url) {
	  //>>includeStart('debug', pragmas.debug);
	  if (!defined.defined(url)) {
	    throw new Check.DeveloperError("url is required.");
	  }
	  //>>includeEnd('debug');
	  const authority = getAuthority(url);
	  if (defined.defined(authority) && defined.defined(_servers[authority])) {
	    return true;
	  }

	  return false;
	};

	/**
	 * Clears the registry
	 *
	 * @example
	 * // Remove a trusted server
	 * TrustedServers.clear();
	 */
	TrustedServers.clear = function () {
	  _servers = {};
	};
	var TrustedServers$1 = TrustedServers;

	const xhrBlobSupported = (function () {
	  try {
	    const xhr = new XMLHttpRequest();
	    xhr.open("GET", "#", true);
	    xhr.responseType = "blob";
	    return xhr.responseType === "blob";
	  } catch (e) {
	    return false;
	  }
	})();

	/**
	 * Parses a query string and returns the object equivalent.
	 *
	 * @param {Uri} uri The Uri with a query object.
	 * @param {Resource} resource The Resource that will be assigned queryParameters.
	 * @param {Boolean} merge If true, we'll merge with the resource's existing queryParameters. Otherwise they will be replaced.
	 * @param {Boolean} preserveQueryParameters If true duplicate parameters will be concatenated into an array. If false, keys in uri will take precedence.
	 *
	 * @private
	 */
	function parseQuery(uri, resource, merge, preserveQueryParameters) {
	  const queryString = uri.query();
	  if (queryString.length === 0) {
	    return {};
	  }

	  let query;
	  // Special case we run into where the querystring is just a string, not key/value pairs
	  if (queryString.indexOf("=") === -1) {
	    const result = {};
	    result[queryString] = undefined;
	    query = result;
	  } else {
	    query = queryToObject(queryString);
	  }

	  if (merge) {
	    resource._queryParameters = combineQueryParameters(
	      query,
	      resource._queryParameters,
	      preserveQueryParameters
	    );
	  } else {
	    resource._queryParameters = query;
	  }
	  uri.search("");
	}

	/**
	 * Converts a query object into a string.
	 *
	 * @param {Uri} uri The Uri object that will have the query object set.
	 * @param {Resource} resource The resource that has queryParameters
	 *
	 * @private
	 */
	function stringifyQuery(uri, resource) {
	  const queryObject = resource._queryParameters;

	  const keys = Object.keys(queryObject);

	  // We have 1 key with an undefined value, so this is just a string, not key/value pairs
	  if (keys.length === 1 && !defined.defined(queryObject[keys[0]])) {
	    uri.search(keys[0]);
	  } else {
	    uri.search(objectToQuery(queryObject));
	  }
	}

	/**
	 * Clones a value if it is defined, otherwise returns the default value
	 *
	 * @param {*} [val] The value to clone.
	 * @param {*} [defaultVal] The default value.
	 *
	 * @returns {*} A clone of val or the defaultVal.
	 *
	 * @private
	 */
	function defaultClone(val, defaultVal) {
	  if (!defined.defined(val)) {
	    return defaultVal;
	  }

	  return defined.defined(val.clone) ? val.clone() : clone(val);
	}

	/**
	 * Checks to make sure the Resource isn't already being requested.
	 *
	 * @param {Request} request The request to check.
	 *
	 * @private
	 */
	function checkAndResetRequest(request) {
	  if (
	    request.state === RequestState$1.ISSUED ||
	    request.state === RequestState$1.ACTIVE
	  ) {
	    throw new RuntimeError.RuntimeError("The Resource is already being fetched.");
	  }

	  request.state = RequestState$1.UNISSUED;
	  request.deferred = undefined;
	}

	/**
	 * This combines a map of query parameters.
	 *
	 * @param {Object} q1 The first map of query parameters. Values in this map will take precedence if preserveQueryParameters is false.
	 * @param {Object} q2 The second map of query parameters.
	 * @param {Boolean} preserveQueryParameters If true duplicate parameters will be concatenated into an array. If false, keys in q1 will take precedence.
	 *
	 * @returns {Object} The combined map of query parameters.
	 *
	 * @example
	 * const q1 = {
	 *   a: 1,
	 *   b: 2
	 * };
	 * const q2 = {
	 *   a: 3,
	 *   c: 4
	 * };
	 * const q3 = {
	 *   b: [5, 6],
	 *   d: 7
	 * }
	 *
	 * // Returns
	 * // {
	 * //   a: [1, 3],
	 * //   b: 2,
	 * //   c: 4
	 * // };
	 * combineQueryParameters(q1, q2, true);
	 *
	 * // Returns
	 * // {
	 * //   a: 1,
	 * //   b: 2,
	 * //   c: 4
	 * // };
	 * combineQueryParameters(q1, q2, false);
	 *
	 * // Returns
	 * // {
	 * //   a: 1,
	 * //   b: [2, 5, 6],
	 * //   d: 7
	 * // };
	 * combineQueryParameters(q1, q3, true);
	 *
	 * // Returns
	 * // {
	 * //   a: 1,
	 * //   b: 2,
	 * //   d: 7
	 * // };
	 * combineQueryParameters(q1, q3, false);
	 *
	 * @private
	 */
	function combineQueryParameters(q1, q2, preserveQueryParameters) {
	  if (!preserveQueryParameters) {
	    return combine.combine(q1, q2);
	  }

	  const result = clone(q1, true);
	  for (const param in q2) {
	    if (q2.hasOwnProperty(param)) {
	      let value = result[param];
	      const q2Value = q2[param];
	      if (defined.defined(value)) {
	        if (!Array.isArray(value)) {
	          value = result[param] = [value];
	        }

	        result[param] = value.concat(q2Value);
	      } else {
	        result[param] = Array.isArray(q2Value) ? q2Value.slice() : q2Value;
	      }
	    }
	  }

	  return result;
	}

	/**
	 * @typedef {Object} Resource.ConstructorOptions
	 *
	 * Initialization options for the Resource constructor
	 *
	 * @property {String} url The url of the resource.
	 * @property {Object} [queryParameters] An object containing query parameters that will be sent when retrieving the resource.
	 * @property {Object} [templateValues] Key/Value pairs that are used to replace template values (eg. {x}).
	 * @property {Object} [headers={}] Additional HTTP headers that will be sent.
	 * @property {Proxy} [proxy] A proxy to be used when loading the resource.
	 * @property {Resource.RetryCallback} [retryCallback] The Function to call when a request for this resource fails. If it returns true, the request will be retried.
	 * @property {Number} [retryAttempts=0] The number of times the retryCallback should be called before giving up.
	 * @property {Request} [request] A Request object that will be used. Intended for internal use only.
	 */

	/**
	 * A resource that includes the location and any other parameters we need to retrieve it or create derived resources. It also provides the ability to retry requests.
	 *
	 * @alias Resource
	 * @constructor
	 *
	 * @param {String|Resource.ConstructorOptions} options A url or an object describing initialization options
	 *
	 * @example
	 * function refreshTokenRetryCallback(resource, error) {
	 *   if (error.statusCode === 403) {
	 *     // 403 status code means a new token should be generated
	 *     return getNewAccessToken()
	 *       .then(function(token) {
	 *         resource.queryParameters.access_token = token;
	 *         return true;
	 *       })
	 *       .catch(function() {
	 *         return false;
	 *       });
	 *   }
	 *
	 *   return false;
	 * }
	 *
	 * const resource = new Resource({
	 *    url: 'http://server.com/path/to/resource.json',
	 *    proxy: new DefaultProxy('/proxy/'),
	 *    headers: {
	 *      'X-My-Header': 'valueOfHeader'
	 *    },
	 *    queryParameters: {
	 *      'access_token': '123-435-456-000'
	 *    },
	 *    retryCallback: refreshTokenRetryCallback,
	 *    retryAttempts: 1
	 * });
	 */
	function Resource(options) {
	  options = defined.defaultValue(options, defined.defaultValue.EMPTY_OBJECT);
	  if (typeof options === "string") {
	    options = {
	      url: options,
	    };
	  }

	  //>>includeStart('debug', pragmas.debug);
	  Check.Check.typeOf.string("options.url", options.url);
	  //>>includeEnd('debug');

	  this._url = undefined;
	  this._templateValues = defaultClone(options.templateValues, {});
	  this._queryParameters = defaultClone(options.queryParameters, {});

	  /**
	   * Additional HTTP headers that will be sent with the request.
	   *
	   * @type {Object}
	   */
	  this.headers = defaultClone(options.headers, {});

	  /**
	   * A Request object that will be used. Intended for internal use only.
	   *
	   * @type {Request}
	   */
	  this.request = defined.defaultValue(options.request, new Request());

	  /**
	   * A proxy to be used when loading the resource.
	   *
	   * @type {Proxy}
	   */
	  this.proxy = options.proxy;

	  /**
	   * Function to call when a request for this resource fails. If it returns true or a Promise that resolves to true, the request will be retried.
	   *
	   * @type {Function}
	   */
	  this.retryCallback = options.retryCallback;

	  /**
	   * The number of times the retryCallback should be called before giving up.
	   *
	   * @type {Number}
	   */
	  this.retryAttempts = defined.defaultValue(options.retryAttempts, 0);
	  this._retryCount = 0;

	  const uri = new URI(options.url);
	  parseQuery(uri, this, true, true);

	  // Remove the fragment as it's not sent with a request
	  uri.fragment("");

	  this._url = uri.toString();
	}

	/**
	 * A helper function to create a resource depending on whether we have a String or a Resource
	 *
	 * @param {Resource|String} resource A Resource or a String to use when creating a new Resource.
	 *
	 * @returns {Resource} If resource is a String, a Resource constructed with the url and options. Otherwise the resource parameter is returned.
	 *
	 * @private
	 */
	Resource.createIfNeeded = function (resource) {
	  if (resource instanceof Resource) {
	    // Keep existing request object. This function is used internally to duplicate a Resource, so that it can't
	    //  be modified outside of a class that holds it (eg. an imagery or terrain provider). Since the Request objects
	    //  are managed outside of the providers, by the tile loading code, we want to keep the request property the same so if it is changed
	    //  in the underlying tiling code the requests for this resource will use it.
	    return resource.getDerivedResource({
	      request: resource.request,
	    });
	  }

	  if (typeof resource !== "string") {
	    return resource;
	  }

	  return new Resource({
	    url: resource,
	  });
	};

	let supportsImageBitmapOptionsPromise;
	/**
	 * A helper function to check whether createImageBitmap supports passing ImageBitmapOptions.
	 *
	 * @returns {Promise<Boolean>} A promise that resolves to true if this browser supports creating an ImageBitmap with options.
	 *
	 * @private
	 */
	Resource.supportsImageBitmapOptions = function () {
	  // Until the HTML folks figure out what to do about this, we need to actually try loading an image to
	  // know if this browser supports passing options to the createImageBitmap function.
	  // https://github.com/whatwg/html/pull/4248
	  //
	  // We also need to check whether the colorSpaceConversion option is supported.
	  // We do this by loading a PNG with an embedded color profile, first with
	  // colorSpaceConversion: "none" and then with colorSpaceConversion: "default".
	  // If the pixel color is different then we know the option is working.
	  // As of Webkit 17612.3.6.1.6 the createImageBitmap promise resolves but the
	  // option is not actually supported.
	  if (defined.defined(supportsImageBitmapOptionsPromise)) {
	    return supportsImageBitmapOptionsPromise;
	  }

	  if (typeof createImageBitmap !== "function") {
	    supportsImageBitmapOptionsPromise = Promise.resolve(false);
	    return supportsImageBitmapOptionsPromise;
	  }

	  const imageDataUri =
	    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAABGdBTUEAAE4g3rEiDgAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAADElEQVQI12Ng6GAAAAEUAIngE3ZiAAAAAElFTkSuQmCC";

	  supportsImageBitmapOptionsPromise = Resource.fetchBlob({
	    url: imageDataUri,
	  })
	    .then(function (blob) {
	      const imageBitmapOptions = {
	        imageOrientation: "flipY", // default is "none"
	        premultiplyAlpha: "none", // default is "default"
	        colorSpaceConversion: "none", // default is "default"
	      };
	      return Promise.all([
	        createImageBitmap(blob, imageBitmapOptions),
	        createImageBitmap(blob),
	      ]);
	    })
	    .then(function (imageBitmaps) {
	      // Check whether the colorSpaceConversion option had any effect on the green channel
	      const colorWithOptions = getImagePixels(imageBitmaps[0]);
	      const colorWithDefaults = getImagePixels(imageBitmaps[1]);
	      return colorWithOptions[1] !== colorWithDefaults[1];
	    })
	    .catch(function () {
	      return false;
	    });

	  return supportsImageBitmapOptionsPromise;
	};

	Object.defineProperties(Resource, {
	  /**
	   * Returns true if blobs are supported.
	   *
	   * @memberof Resource
	   * @type {Boolean}
	   *
	   * @readonly
	   */
	  isBlobSupported: {
	    get: function () {
	      return xhrBlobSupported;
	    },
	  },
	});

	Object.defineProperties(Resource.prototype, {
	  /**
	   * Query parameters appended to the url.
	   *
	   * @memberof Resource.prototype
	   * @type {Object}
	   *
	   * @readonly
	   */
	  queryParameters: {
	    get: function () {
	      return this._queryParameters;
	    },
	  },

	  /**
	   * The key/value pairs used to replace template parameters in the url.
	   *
	   * @memberof Resource.prototype
	   * @type {Object}
	   *
	   * @readonly
	   */
	  templateValues: {
	    get: function () {
	      return this._templateValues;
	    },
	  },

	  /**
	   * The url to the resource with template values replaced, query string appended and encoded by proxy if one was set.
	   *
	   * @memberof Resource.prototype
	   * @type {String}
	   */
	  url: {
	    get: function () {
	      return this.getUrlComponent(true, true);
	    },
	    set: function (value) {
	      const uri = new URI(value);

	      parseQuery(uri, this, false);

	      // Remove the fragment as it's not sent with a request
	      uri.fragment("");

	      this._url = uri.toString();
	    },
	  },

	  /**
	   * The file extension of the resource.
	   *
	   * @memberof Resource.prototype
	   * @type {String}
	   *
	   * @readonly
	   */
	  extension: {
	    get: function () {
	      return getExtensionFromUri(this._url);
	    },
	  },

	  /**
	   * True if the Resource refers to a data URI.
	   *
	   * @memberof Resource.prototype
	   * @type {Boolean}
	   */
	  isDataUri: {
	    get: function () {
	      return isDataUri(this._url);
	    },
	  },

	  /**
	   * True if the Resource refers to a blob URI.
	   *
	   * @memberof Resource.prototype
	   * @type {Boolean}
	   */
	  isBlobUri: {
	    get: function () {
	      return isBlobUri(this._url);
	    },
	  },

	  /**
	   * True if the Resource refers to a cross origin URL.
	   *
	   * @memberof Resource.prototype
	   * @type {Boolean}
	   */
	  isCrossOriginUrl: {
	    get: function () {
	      return isCrossOriginUrl(this._url);
	    },
	  },

	  /**
	   * True if the Resource has request headers. This is equivalent to checking if the headers property has any keys.
	   *
	   * @memberof Resource.prototype
	   * @type {Boolean}
	   */
	  hasHeaders: {
	    get: function () {
	      return Object.keys(this.headers).length > 0;
	    },
	  },
	});

	/**
	 * Override Object#toString so that implicit string conversion gives the
	 * complete URL represented by this Resource.
	 *
	 * @returns {String} The URL represented by this Resource
	 */
	Resource.prototype.toString = function () {
	  return this.getUrlComponent(true, true);
	};

	/**
	 * Returns the url, optional with the query string and processed by a proxy.
	 *
	 * @param {Boolean} [query=false] If true, the query string is included.
	 * @param {Boolean} [proxy=false] If true, the url is processed by the proxy object, if defined.
	 *
	 * @returns {String} The url with all the requested components.
	 */
	Resource.prototype.getUrlComponent = function (query, proxy) {
	  if (this.isDataUri) {
	    return this._url;
	  }

	  const uri = new URI(this._url);

	  if (query) {
	    stringifyQuery(uri, this);
	  }

	  // objectToQuery escapes the placeholders.  Undo that.
	  let url = uri.toString().replace(/%7B/g, "{").replace(/%7D/g, "}");

	  const templateValues = this._templateValues;
	  url = url.replace(/{(.*?)}/g, function (match, key) {
	    const replacement = templateValues[key];
	    if (defined.defined(replacement)) {
	      // use the replacement value from templateValues if there is one...
	      return encodeURIComponent(replacement);
	    }
	    // otherwise leave it unchanged
	    return match;
	  });

	  if (proxy && defined.defined(this.proxy)) {
	    url = this.proxy.getURL(url);
	  }
	  return url;
	};

	/**
	 * Combines the specified object and the existing query parameters. This allows you to add many parameters at once,
	 *  as opposed to adding them one at a time to the queryParameters property. If a value is already set, it will be replaced with the new value.
	 *
	 * @param {Object} params The query parameters
	 * @param {Boolean} [useAsDefault=false] If true the params will be used as the default values, so they will only be set if they are undefined.
	 */
	Resource.prototype.setQueryParameters = function (params, useAsDefault) {
	  if (useAsDefault) {
	    this._queryParameters = combineQueryParameters(
	      this._queryParameters,
	      params,
	      false
	    );
	  } else {
	    this._queryParameters = combineQueryParameters(
	      params,
	      this._queryParameters,
	      false
	    );
	  }
	};

	/**
	 * Combines the specified object and the existing query parameters. This allows you to add many parameters at once,
	 *  as opposed to adding them one at a time to the queryParameters property.
	 *
	 * @param {Object} params The query parameters
	 */
	Resource.prototype.appendQueryParameters = function (params) {
	  this._queryParameters = combineQueryParameters(
	    params,
	    this._queryParameters,
	    true
	  );
	};

	/**
	 * Combines the specified object and the existing template values. This allows you to add many values at once,
	 *  as opposed to adding them one at a time to the templateValues property. If a value is already set, it will become an array and the new value will be appended.
	 *
	 * @param {Object} template The template values
	 * @param {Boolean} [useAsDefault=false] If true the values will be used as the default values, so they will only be set if they are undefined.
	 */
	Resource.prototype.setTemplateValues = function (template, useAsDefault) {
	  if (useAsDefault) {
	    this._templateValues = combine.combine(this._templateValues, template);
	  } else {
	    this._templateValues = combine.combine(template, this._templateValues);
	  }
	};

	/**
	 * Returns a resource relative to the current instance. All properties remain the same as the current instance unless overridden in options.
	 *
	 * @param {Object} options An object with the following properties
	 * @param {String} [options.url]  The url that will be resolved relative to the url of the current instance.
	 * @param {Object} [options.queryParameters] An object containing query parameters that will be combined with those of the current instance.
	 * @param {Object} [options.templateValues] Key/Value pairs that are used to replace template values (eg. {x}). These will be combined with those of the current instance.
	 * @param {Object} [options.headers={}] Additional HTTP headers that will be sent.
	 * @param {Proxy} [options.proxy] A proxy to be used when loading the resource.
	 * @param {Resource.RetryCallback} [options.retryCallback] The function to call when loading the resource fails.
	 * @param {Number} [options.retryAttempts] The number of times the retryCallback should be called before giving up.
	 * @param {Request} [options.request] A Request object that will be used. Intended for internal use only.
	 * @param {Boolean} [options.preserveQueryParameters=false] If true, this will keep all query parameters from the current resource and derived resource. If false, derived parameters will replace those of the current resource.
	 *
	 * @returns {Resource} The resource derived from the current one.
	 */
	Resource.prototype.getDerivedResource = function (options) {
	  const resource = this.clone();
	  resource._retryCount = 0;

	  if (defined.defined(options.url)) {
	    const uri = new URI(options.url);

	    const preserveQueryParameters = defined.defaultValue(
	      options.preserveQueryParameters,
	      false
	    );
	    parseQuery(uri, resource, true, preserveQueryParameters);

	    // Remove the fragment as it's not sent with a request
	    uri.fragment("");

	    if (uri.scheme() !== "") {
	      resource._url = uri.toString();
	    } else {
	      resource._url = uri
	        .absoluteTo(new URI(getAbsoluteUri(this._url)))
	        .toString();
	    }
	  }

	  if (defined.defined(options.queryParameters)) {
	    resource._queryParameters = combine.combine(
	      options.queryParameters,
	      resource._queryParameters
	    );
	  }
	  if (defined.defined(options.templateValues)) {
	    resource._templateValues = combine.combine(
	      options.templateValues,
	      resource.templateValues
	    );
	  }
	  if (defined.defined(options.headers)) {
	    resource.headers = combine.combine(options.headers, resource.headers);
	  }
	  if (defined.defined(options.proxy)) {
	    resource.proxy = options.proxy;
	  }
	  if (defined.defined(options.request)) {
	    resource.request = options.request;
	  }
	  if (defined.defined(options.retryCallback)) {
	    resource.retryCallback = options.retryCallback;
	  }
	  if (defined.defined(options.retryAttempts)) {
	    resource.retryAttempts = options.retryAttempts;
	  }

	  return resource;
	};

	/**
	 * Called when a resource fails to load. This will call the retryCallback function if defined until retryAttempts is reached.
	 *
	 * @param {Error} [error] The error that was encountered.
	 *
	 * @returns {Promise<Boolean>} A promise to a boolean, that if true will cause the resource request to be retried.
	 *
	 * @private
	 */
	Resource.prototype.retryOnError = function (error) {
	  const retryCallback = this.retryCallback;
	  if (
	    typeof retryCallback !== "function" ||
	    this._retryCount >= this.retryAttempts
	  ) {
	    return Promise.resolve(false);
	  }

	  const that = this;
	  return Promise.resolve(retryCallback(this, error)).then(function (result) {
	    ++that._retryCount;

	    return result;
	  });
	};

	/**
	 * Duplicates a Resource instance.
	 *
	 * @param {Resource} [result] The object onto which to store the result.
	 *
	 * @returns {Resource} The modified result parameter or a new Resource instance if one was not provided.
	 */
	Resource.prototype.clone = function (result) {
	  if (!defined.defined(result)) {
	    result = new Resource({
	      url: this._url,
	    });
	  }

	  result._url = this._url;
	  result._queryParameters = clone(this._queryParameters);
	  result._templateValues = clone(this._templateValues);
	  result.headers = clone(this.headers);
	  result.proxy = this.proxy;
	  result.retryCallback = this.retryCallback;
	  result.retryAttempts = this.retryAttempts;
	  result._retryCount = 0;
	  result.request = this.request.clone();

	  return result;
	};

	/**
	 * Returns the base path of the Resource.
	 *
	 * @param {Boolean} [includeQuery = false] Whether or not to include the query string and fragment form the uri
	 *
	 * @returns {String} The base URI of the resource
	 */
	Resource.prototype.getBaseUri = function (includeQuery) {
	  return getBaseUri(this.getUrlComponent(includeQuery), includeQuery);
	};

	/**
	 * Appends a forward slash to the URL.
	 */
	Resource.prototype.appendForwardSlash = function () {
	  this._url = appendForwardSlash(this._url);
	};

	/**
	 * Asynchronously loads the resource as raw binary data.  Returns a promise that will resolve to
	 * an ArrayBuffer once loaded, or reject if the resource failed to load.  The data is loaded
	 * using XMLHttpRequest, which means that in order to make requests to another origin,
	 * the server must have Cross-Origin Resource Sharing (CORS) headers enabled.
	 *
	 * @returns {Promise.<ArrayBuffer>|undefined} a promise that will resolve to the requested data when loaded. Returns undefined if <code>request.throttle</code> is true and the request does not have high enough priority.
	 *
	 * @example
	 * // load a single URL asynchronously
	 * resource.fetchArrayBuffer().then(function(arrayBuffer) {
	 *     // use the data
	 * }).catch(function(error) {
	 *     // an error occurred
	 * });
	 *
	 * @see {@link http://www.w3.org/TR/cors/|Cross-Origin Resource Sharing}
	 * @see {@link http://wiki.commonjs.org/wiki/Promises/A|CommonJS Promises/A}
	 */
	Resource.prototype.fetchArrayBuffer = function () {
	  return this.fetch({
	    responseType: "arraybuffer",
	  });
	};

	/**
	 * Creates a Resource and calls fetchArrayBuffer() on it.
	 *
	 * @param {String|Object} options A url or an object with the following properties
	 * @param {String} options.url The url of the resource.
	 * @param {Object} [options.queryParameters] An object containing query parameters that will be sent when retrieving the resource.
	 * @param {Object} [options.templateValues] Key/Value pairs that are used to replace template values (eg. {x}).
	 * @param {Object} [options.headers={}] Additional HTTP headers that will be sent.
	 * @param {Proxy} [options.proxy] A proxy to be used when loading the resource.
	 * @param {Resource.RetryCallback} [options.retryCallback] The Function to call when a request for this resource fails. If it returns true, the request will be retried.
	 * @param {Number} [options.retryAttempts=0] The number of times the retryCallback should be called before giving up.
	 * @param {Request} [options.request] A Request object that will be used. Intended for internal use only.
	 * @returns {Promise.<ArrayBuffer>|undefined} a promise that will resolve to the requested data when loaded. Returns undefined if <code>request.throttle</code> is true and the request does not have high enough priority.
	 */
	Resource.fetchArrayBuffer = function (options) {
	  const resource = new Resource(options);
	  return resource.fetchArrayBuffer();
	};

	/**
	 * Asynchronously loads the given resource as a blob.  Returns a promise that will resolve to
	 * a Blob once loaded, or reject if the resource failed to load.  The data is loaded
	 * using XMLHttpRequest, which means that in order to make requests to another origin,
	 * the server must have Cross-Origin Resource Sharing (CORS) headers enabled.
	 *
	 * @returns {Promise.<Blob>|undefined} a promise that will resolve to the requested data when loaded. Returns undefined if <code>request.throttle</code> is true and the request does not have high enough priority.
	 *
	 * @example
	 * // load a single URL asynchronously
	 * resource.fetchBlob().then(function(blob) {
	 *     // use the data
	 * }).catch(function(error) {
	 *     // an error occurred
	 * });
	 *
	 * @see {@link http://www.w3.org/TR/cors/|Cross-Origin Resource Sharing}
	 * @see {@link http://wiki.commonjs.org/wiki/Promises/A|CommonJS Promises/A}
	 */
	Resource.prototype.fetchBlob = function () {
	  return this.fetch({
	    responseType: "blob",
	  });
	};

	/**
	 * Creates a Resource and calls fetchBlob() on it.
	 *
	 * @param {String|Object} options A url or an object with the following properties
	 * @param {String} options.url The url of the resource.
	 * @param {Object} [options.queryParameters] An object containing query parameters that will be sent when retrieving the resource.
	 * @param {Object} [options.templateValues] Key/Value pairs that are used to replace template values (eg. {x}).
	 * @param {Object} [options.headers={}] Additional HTTP headers that will be sent.
	 * @param {Proxy} [options.proxy] A proxy to be used when loading the resource.
	 * @param {Resource.RetryCallback} [options.retryCallback] The Function to call when a request for this resource fails. If it returns true, the request will be retried.
	 * @param {Number} [options.retryAttempts=0] The number of times the retryCallback should be called before giving up.
	 * @param {Request} [options.request] A Request object that will be used. Intended for internal use only.
	 * @returns {Promise.<Blob>|undefined} a promise that will resolve to the requested data when loaded. Returns undefined if <code>request.throttle</code> is true and the request does not have high enough priority.
	 */
	Resource.fetchBlob = function (options) {
	  const resource = new Resource(options);
	  return resource.fetchBlob();
	};

	/**
	 * Asynchronously loads the given image resource.  Returns a promise that will resolve to
	 * an {@link https://developer.mozilla.org/en-US/docs/Web/API/ImageBitmap|ImageBitmap} if <code>preferImageBitmap</code> is true and the browser supports <code>createImageBitmap</code> or otherwise an
	 * {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement|Image} once loaded, or reject if the image failed to load.
	 *
	 * @param {Object} [options] An object with the following properties.
	 * @param {Boolean} [options.preferBlob=false] If true, we will load the image via a blob.
	 * @param {Boolean} [options.preferImageBitmap=false] If true, image will be decoded during fetch and an <code>ImageBitmap</code> is returned.
	 * @param {Boolean} [options.flipY=false] If true, image will be vertically flipped during decode. Only applies if the browser supports <code>createImageBitmap</code>.
	 * @param {Boolean} [options.skipColorSpaceConversion=false] If true, any custom gamma or color profiles in the image will be ignored. Only applies if the browser supports <code>createImageBitmap</code>.
	 * @returns {Promise.<ImageBitmap|HTMLImageElement>|undefined} a promise that will resolve to the requested data when loaded. Returns undefined if <code>request.throttle</code> is true and the request does not have high enough priority.
	 *
	 *
	 * @example
	 * // load a single image asynchronously
	 * resource.fetchImage().then(function(image) {
	 *     // use the loaded image
	 * }).catch(function(error) {
	 *     // an error occurred
	 * });
	 *
	 * // load several images in parallel
	 * Promise.all([resource1.fetchImage(), resource2.fetchImage()]).then(function(images) {
	 *     // images is an array containing all the loaded images
	 * });
	 *
	 * @see {@link http://www.w3.org/TR/cors/|Cross-Origin Resource Sharing}
	 * @see {@link http://wiki.commonjs.org/wiki/Promises/A|CommonJS Promises/A}
	 */
	Resource.prototype.fetchImage = function (options) {
	  options = defined.defaultValue(options, defined.defaultValue.EMPTY_OBJECT);
	  const inWorker = defined.defaultValue(options.inWorker, false);
	  const preferImageBitmap = defined.defaultValue(options.preferImageBitmap, false);
	  const preferBlob = defined.defaultValue(options.preferBlob, false);
	  const flipY = defined.defaultValue(options.flipY, false);
	  const skipColorSpaceConversion = defined.defaultValue(
	    options.skipColorSpaceConversion,
	    false
	  );

	  checkAndResetRequest(this.request);
	  // We try to load the image normally if
	  // 1. Blobs aren't supported
	  // 2. It's a data URI
	  // 3. It's a blob URI
	  // 4. It doesn't have request headers and we preferBlob is false
	  if (
	    !xhrBlobSupported ||
	    this.isDataUri ||
	    this.isBlobUri ||
	    (!this.hasHeaders && !preferBlob)
	  ) {
	    return fetchImage({
	      resource: this,
	      flipY: flipY,
	      skipColorSpaceConversion: skipColorSpaceConversion,
	      preferImageBitmap: preferImageBitmap,
	      inWorker:inWorker
	    });
	  }

	  const blobPromise = this.fetchBlob();
	  if (!defined.defined(blobPromise)) {
	    return;
	  }

	  let supportsImageBitmap;
	  let useImageBitmap;
	  let generatedBlobResource;
	  let generatedBlob;
	  return Resource.supportsImageBitmapOptions()
	    .then(function (result) {
	      supportsImageBitmap = result;
	      useImageBitmap = supportsImageBitmap && preferImageBitmap;
	      return blobPromise;
	    })
	    .then(function (blob) {
	      if (!defined.defined(blob)) {
	        return;
	      }
	      generatedBlob = blob;
	      if (useImageBitmap) {
	        return Resource.createImageBitmapFromBlob(blob, {
	          flipY: flipY,
	          premultiplyAlpha: false,
	          skipColorSpaceConversion: skipColorSpaceConversion,
	        });
	      }
	      const blobUrl = window.URL.createObjectURL(blob);
	      generatedBlobResource = new Resource({
	        url: blobUrl,
	      });

	      return fetchImage({
	        resource: generatedBlobResource,
	        flipY: flipY,
	        skipColorSpaceConversion: skipColorSpaceConversion,
	        preferImageBitmap: false,
	      });
	    })
	    .then(function (image) {
	      if (!defined.defined(image)) {
	        return;
	      }

	      // The blob object may be needed for use by a TileDiscardPolicy,
	      // so attach it to the image.
	      image.blob = generatedBlob;

	      if (useImageBitmap) {
	        return image;
	      }

	      window.URL.revokeObjectURL(generatedBlobResource.url);
	      return image;
	    })
	    .catch(function (error) {
	      if (defined.defined(generatedBlobResource)) {
	        window.URL.revokeObjectURL(generatedBlobResource.url);
	      }

	      // If the blob load succeeded but the image decode failed, attach the blob
	      // to the error object for use by a TileDiscardPolicy.
	      // In particular, BingMapsImageryProvider uses this to detect the
	      // zero-length response that is returned when a tile is not available.
	      error.blob = generatedBlob;

	      return Promise.reject(error);
	    });
	};

	/**
	 * Fetches an image and returns a promise to it.
	 *
	 * @param {Object} [options] An object with the following properties.
	 * @param {Resource} [options.resource] Resource object that points to an image to fetch.
	 * @param {Boolean} [options.preferImageBitmap] If true, image will be decoded during fetch and an <code>ImageBitmap</code> is returned.
	 * @param {Boolean} [options.flipY] If true, image will be vertically flipped during decode. Only applies if the browser supports <code>createImageBitmap</code>.
	 * @param {Boolean} [options.skipColorSpaceConversion=false] If true, any custom gamma or color profiles in the image will be ignored. Only applies if the browser supports <code>createImageBitmap</code>.
	 * @private
	 */
	function fetchImage(options) {
	  const resource = options.resource;
	  const flipY = options.flipY;
	  const skipColorSpaceConversion = options.skipColorSpaceConversion;
	  const preferImageBitmap = options.preferImageBitmap;

	  const request = resource.request;
	  request.url = resource.url;

	  const inWorker = options.inWorker;
	  request.requestFunction = function () {
	    let crossOrigin = false;

	    // data URIs can't have crossorigin set.
	    if (!inWorker && !resource.isDataUri && !resource.isBlobUri) {
	      crossOrigin = resource.isCrossOriginUrl;
	    }

	    const deferred = defer.defer();
	    Resource._Implementations.createImage(
	      request,
	      crossOrigin,
	      deferred,
	      flipY,
	      skipColorSpaceConversion,
	      preferImageBitmap,
	      inWorker
	    );

	    return deferred.promise;
	  };

	  const promise = RequestScheduler.request(request);
	  if (!defined.defined(promise)) {
	    return;
	  }

	  return promise.catch(function (e) {
	    // Don't retry cancelled or otherwise aborted requests
	    if (request.state !== RequestState$1.FAILED) {
	      return Promise.reject(e);
	    }
	    return resource.retryOnError(e).then(function (retry) {
	      if (retry) {
	        // Reset request so it can try again
	        request.state = RequestState$1.UNISSUED;
	        request.deferred = undefined;

	        return fetchImage({
	          resource: resource,
	          flipY: flipY,
	          skipColorSpaceConversion: skipColorSpaceConversion,
	          preferImageBitmap: preferImageBitmap,
	        });
	      }
	      return Promise.reject(e);
	    });
	  });
	}

	/**
	 * Creates a Resource and calls fetchImage() on it.
	 *
	 * @param {String|Object} options A url or an object with the following properties
	 * @param {String} options.url The url of the resource.
	 * @param {Object} [options.queryParameters] An object containing query parameters that will be sent when retrieving the resource.
	 * @param {Object} [options.templateValues] Key/Value pairs that are used to replace template values (eg. {x}).
	 * @param {Object} [options.headers={}] Additional HTTP headers that will be sent.
	 * @param {Proxy} [options.proxy] A proxy to be used when loading the resource.
	 * @param {Boolean} [options.flipY=false] Whether to vertically flip the image during fetch and decode. Only applies when requesting an image and the browser supports <code>createImageBitmap</code>.
	 * @param {Resource.RetryCallback} [options.retryCallback] The Function to call when a request for this resource fails. If it returns true, the request will be retried.
	 * @param {Number} [options.retryAttempts=0] The number of times the retryCallback should be called before giving up.
	 * @param {Request} [options.request] A Request object that will be used. Intended for internal use only.
	 * @param {Boolean} [options.preferBlob=false]  If true, we will load the image via a blob.
	 * @param {Boolean} [options.preferImageBitmap=false] If true, image will be decoded during fetch and an <code>ImageBitmap</code> is returned.
	 * @param {Boolean} [options.skipColorSpaceConversion=false] If true, any custom gamma or color profiles in the image will be ignored. Only applies when requesting an image and the browser supports <code>createImageBitmap</code>.
	 * @returns {Promise.<ImageBitmap|HTMLImageElement>|undefined} a promise that will resolve to the requested data when loaded. Returns undefined if <code>request.throttle</code> is true and the request does not have high enough priority.
	 */
	Resource.fetchImage = function (options) {
	  const resource = new Resource(options);
	  return resource.fetchImage({
	    flipY: options.flipY,
	    skipColorSpaceConversion: options.skipColorSpaceConversion,
	    preferBlob: options.preferBlob,
	    preferImageBitmap: options.preferImageBitmap,
	  });
	};

	/**
	 * Asynchronously loads the given resource as text.  Returns a promise that will resolve to
	 * a String once loaded, or reject if the resource failed to load.  The data is loaded
	 * using XMLHttpRequest, which means that in order to make requests to another origin,
	 * the server must have Cross-Origin Resource Sharing (CORS) headers enabled.
	 *
	 * @returns {Promise.<String>|undefined} a promise that will resolve to the requested data when loaded. Returns undefined if <code>request.throttle</code> is true and the request does not have high enough priority.
	 *
	 * @example
	 * // load text from a URL, setting a custom header
	 * const resource = new Resource({
	 *   url: 'http://someUrl.com/someJson.txt',
	 *   headers: {
	 *     'X-Custom-Header' : 'some value'
	 *   }
	 * });
	 * resource.fetchText().then(function(text) {
	 *     // Do something with the text
	 * }).catch(function(error) {
	 *     // an error occurred
	 * });
	 *
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest|XMLHttpRequest}
	 * @see {@link http://www.w3.org/TR/cors/|Cross-Origin Resource Sharing}
	 * @see {@link http://wiki.commonjs.org/wiki/Promises/A|CommonJS Promises/A}
	 */
	Resource.prototype.fetchText = function () {
	  return this.fetch({
	    responseType: "text",
	  });
	};

	/**
	 * Creates a Resource and calls fetchText() on it.
	 *
	 * @param {String|Object} options A url or an object with the following properties
	 * @param {String} options.url The url of the resource.
	 * @param {Object} [options.queryParameters] An object containing query parameters that will be sent when retrieving the resource.
	 * @param {Object} [options.templateValues] Key/Value pairs that are used to replace template values (eg. {x}).
	 * @param {Object} [options.headers={}] Additional HTTP headers that will be sent.
	 * @param {Proxy} [options.proxy] A proxy to be used when loading the resource.
	 * @param {Resource.RetryCallback} [options.retryCallback] The Function to call when a request for this resource fails. If it returns true, the request will be retried.
	 * @param {Number} [options.retryAttempts=0] The number of times the retryCallback should be called before giving up.
	 * @param {Request} [options.request] A Request object that will be used. Intended for internal use only.
	 * @returns {Promise.<String>|undefined} a promise that will resolve to the requested data when loaded. Returns undefined if <code>request.throttle</code> is true and the request does not have high enough priority.
	 */
	Resource.fetchText = function (options) {
	  const resource = new Resource(options);
	  return resource.fetchText();
	};

	// note: &#42;&#47;&#42; below is */* but that ends the comment block early
	/**
	 * Asynchronously loads the given resource as JSON.  Returns a promise that will resolve to
	 * a JSON object once loaded, or reject if the resource failed to load.  The data is loaded
	 * using XMLHttpRequest, which means that in order to make requests to another origin,
	 * the server must have Cross-Origin Resource Sharing (CORS) headers enabled. This function
	 * adds 'Accept: application/json,&#42;&#47;&#42;;q=0.01' to the request headers, if not
	 * already specified.
	 *
	 * @returns {Promise.<*>|undefined} a promise that will resolve to the requested data when loaded. Returns undefined if <code>request.throttle</code> is true and the request does not have high enough priority.
	 *
	 *
	 * @example
	 * resource.fetchJson().then(function(jsonData) {
	 *     // Do something with the JSON object
	 * }).catch(function(error) {
	 *     // an error occurred
	 * });
	 *
	 * @see {@link http://www.w3.org/TR/cors/|Cross-Origin Resource Sharing}
	 * @see {@link http://wiki.commonjs.org/wiki/Promises/A|CommonJS Promises/A}
	 */
	Resource.prototype.fetchJson = function () {
	  const promise = this.fetch({
	    responseType: "text",
	    headers: {
	      Accept: "application/json,*/*;q=0.01",
	    },
	  });

	  if (!defined.defined(promise)) {
	    return undefined;
	  }

	  return promise.then(function (value) {
	    if (!defined.defined(value)) {
	      return;
	    }
	    return JSON.parse(value);
	  });
	};

	/**
	 * Creates a Resource and calls fetchJson() on it.
	 *
	 * @param {String|Object} options A url or an object with the following properties
	 * @param {String} options.url The url of the resource.
	 * @param {Object} [options.queryParameters] An object containing query parameters that will be sent when retrieving the resource.
	 * @param {Object} [options.templateValues] Key/Value pairs that are used to replace template values (eg. {x}).
	 * @param {Object} [options.headers={}] Additional HTTP headers that will be sent.
	 * @param {Proxy} [options.proxy] A proxy to be used when loading the resource.
	 * @param {Resource.RetryCallback} [options.retryCallback] The Function to call when a request for this resource fails. If it returns true, the request will be retried.
	 * @param {Number} [options.retryAttempts=0] The number of times the retryCallback should be called before giving up.
	 * @param {Request} [options.request] A Request object that will be used. Intended for internal use only.
	 * @returns {Promise.<*>|undefined} a promise that will resolve to the requested data when loaded. Returns undefined if <code>request.throttle</code> is true and the request does not have high enough priority.
	 */
	Resource.fetchJson = function (options) {
	  const resource = new Resource(options);
	  return resource.fetchJson();
	};

	/**
	 * Asynchronously loads the given resource as XML.  Returns a promise that will resolve to
	 * an XML Document once loaded, or reject if the resource failed to load.  The data is loaded
	 * using XMLHttpRequest, which means that in order to make requests to another origin,
	 * the server must have Cross-Origin Resource Sharing (CORS) headers enabled.
	 *
	 * @returns {Promise.<XMLDocument>|undefined} a promise that will resolve to the requested data when loaded. Returns undefined if <code>request.throttle</code> is true and the request does not have high enough priority.
	 *
	 *
	 * @example
	 * // load XML from a URL, setting a custom header
	 * Cesium.loadXML('http://someUrl.com/someXML.xml', {
	 *   'X-Custom-Header' : 'some value'
	 * }).then(function(document) {
	 *     // Do something with the document
	 * }).catch(function(error) {
	 *     // an error occurred
	 * });
	 *
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest|XMLHttpRequest}
	 * @see {@link http://www.w3.org/TR/cors/|Cross-Origin Resource Sharing}
	 * @see {@link http://wiki.commonjs.org/wiki/Promises/A|CommonJS Promises/A}
	 */
	Resource.prototype.fetchXML = function () {
	  return this.fetch({
	    responseType: "document",
	    overrideMimeType: "text/xml",
	  });
	};

	/**
	 * Creates a Resource and calls fetchXML() on it.
	 *
	 * @param {String|Object} options A url or an object with the following properties
	 * @param {String} options.url The url of the resource.
	 * @param {Object} [options.queryParameters] An object containing query parameters that will be sent when retrieving the resource.
	 * @param {Object} [options.templateValues] Key/Value pairs that are used to replace template values (eg. {x}).
	 * @param {Object} [options.headers={}] Additional HTTP headers that will be sent.
	 * @param {Proxy} [options.proxy] A proxy to be used when loading the resource.
	 * @param {Resource.RetryCallback} [options.retryCallback] The Function to call when a request for this resource fails. If it returns true, the request will be retried.
	 * @param {Number} [options.retryAttempts=0] The number of times the retryCallback should be called before giving up.
	 * @param {Request} [options.request] A Request object that will be used. Intended for internal use only.
	 * @returns {Promise.<XMLDocument>|undefined} a promise that will resolve to the requested data when loaded. Returns undefined if <code>request.throttle</code> is true and the request does not have high enough priority.
	 */
	Resource.fetchXML = function (options) {
	  const resource = new Resource(options);
	  return resource.fetchXML();
	};

	/**
	 * Requests a resource using JSONP.
	 *
	 * @param {String} [callbackParameterName='callback'] The callback parameter name that the server expects.
	 * @returns {Promise.<*>|undefined} a promise that will resolve to the requested data when loaded. Returns undefined if <code>request.throttle</code> is true and the request does not have high enough priority.
	 *
	 *
	 * @example
	 * // load a data asynchronously
	 * resource.fetchJsonp().then(function(data) {
	 *     // use the loaded data
	 * }).catch(function(error) {
	 *     // an error occurred
	 * });
	 *
	 * @see {@link http://wiki.commonjs.org/wiki/Promises/A|CommonJS Promises/A}
	 */
	Resource.prototype.fetchJsonp = function (callbackParameterName) {
	  callbackParameterName = defined.defaultValue(callbackParameterName, "callback");

	  checkAndResetRequest(this.request);

	  //generate a unique function name
	  let functionName;
	  do {
	    functionName = `loadJsonp${Math$1.CesiumMath.nextRandomNumber()
      .toString()
      .substring(2, 8)}`;
	  } while (defined.defined(window[functionName]));

	  return fetchJsonp(this, callbackParameterName, functionName);
	};

	function fetchJsonp(resource, callbackParameterName, functionName) {
	  const callbackQuery = {};
	  callbackQuery[callbackParameterName] = functionName;
	  resource.setQueryParameters(callbackQuery);

	  const request = resource.request;
	  request.url = resource.url;
	  request.requestFunction = function () {
	    const deferred = defer.defer();

	    //assign a function with that name in the global scope
	    window[functionName] = function (data) {
	      deferred.resolve(data);

	      try {
	        delete window[functionName];
	      } catch (e) {
	        window[functionName] = undefined;
	      }
	    };

	    Resource._Implementations.loadAndExecuteScript(
	      resource.url,
	      functionName,
	      deferred
	    );
	    return deferred.promise;
	  };

	  const promise = RequestScheduler.request(request);
	  if (!defined.defined(promise)) {
	    return;
	  }

	  return promise.catch(function (e) {
	    if (request.state !== RequestState$1.FAILED) {
	      return Promise.reject(e);
	    }

	    return resource.retryOnError(e).then(function (retry) {
	      if (retry) {
	        // Reset request so it can try again
	        request.state = RequestState$1.UNISSUED;
	        request.deferred = undefined;

	        return fetchJsonp(resource, callbackParameterName, functionName);
	      }

	      return Promise.reject(e);
	    });
	  });
	}

	/**
	 * Creates a Resource from a URL and calls fetchJsonp() on it.
	 *
	 * @param {String|Object} options A url or an object with the following properties
	 * @param {String} options.url The url of the resource.
	 * @param {Object} [options.queryParameters] An object containing query parameters that will be sent when retrieving the resource.
	 * @param {Object} [options.templateValues] Key/Value pairs that are used to replace template values (eg. {x}).
	 * @param {Object} [options.headers={}] Additional HTTP headers that will be sent.
	 * @param {Proxy} [options.proxy] A proxy to be used when loading the resource.
	 * @param {Resource.RetryCallback} [options.retryCallback] The Function to call when a request for this resource fails. If it returns true, the request will be retried.
	 * @param {Number} [options.retryAttempts=0] The number of times the retryCallback should be called before giving up.
	 * @param {Request} [options.request] A Request object that will be used. Intended for internal use only.
	 * @param {String} [options.callbackParameterName='callback'] The callback parameter name that the server expects.
	 * @returns {Promise.<*>|undefined} a promise that will resolve to the requested data when loaded. Returns undefined if <code>request.throttle</code> is true and the request does not have high enough priority.
	 */
	Resource.fetchJsonp = function (options) {
	  const resource = new Resource(options);
	  return resource.fetchJsonp(options.callbackParameterName);
	};

	/**
	 * @private
	 */
	Resource.prototype._makeRequest = function (options) {
	  const resource = this;
	  checkAndResetRequest(resource.request);

	  const request = resource.request;
	  request.url = resource.url;

	  request.requestFunction = function () {
	    const responseType = options.responseType;
	    const headers = combine.combine(options.headers, resource.headers);
	    const overrideMimeType = options.overrideMimeType;
	    const method = options.method;
	    const data = options.data;
	    const deferred = defer.defer();
	    const xhr = Resource._Implementations.loadWithXhr(
	      resource.url,
	      responseType,
	      method,
	      data,
	      headers,
	      deferred,
	      overrideMimeType
	    );
	    if (defined.defined(xhr) && defined.defined(xhr.abort)) {
	      request.cancelFunction = function () {
	        xhr.abort();
	      };
	    }
	    return deferred.promise;
	  };

	  const promise = RequestScheduler.request(request);
	  if (!defined.defined(promise)) {
	    return;
	  }

	  return promise
	    .then(function (data) {
	      // explicitly set to undefined to ensure GC of request response data. See #8843
	      request.cancelFunction = undefined;
	      return data;
	    })
	    .catch(function (e) {
	      request.cancelFunction = undefined;
	      if (request.state !== RequestState$1.FAILED) {
	        return Promise.reject(e);
	      }

	      return resource.retryOnError(e).then(function (retry) {
	        if (retry) {
	          // Reset request so it can try again
	          request.state = RequestState$1.UNISSUED;
	          request.deferred = undefined;

	          return resource.fetch(options);
	        }

	        return Promise.reject(e);
	      });
	    });
	};

	const dataUriRegex = /^data:(.*?)(;base64)?,(.*)$/;

	function decodeDataUriText(isBase64, data) {
	  const result = decodeURIComponent(data);
	  if (isBase64) {
	    return atob(result);
	  }
	  return result;
	}

	function decodeDataUriArrayBuffer(isBase64, data) {
	  const byteString = decodeDataUriText(isBase64, data);
	  const buffer = new ArrayBuffer(byteString.length);
	  const view = new Uint8Array(buffer);
	  for (let i = 0; i < byteString.length; i++) {
	    view[i] = byteString.charCodeAt(i);
	  }
	  return buffer;
	}

	function decodeDataUri(dataUriRegexResult, responseType) {
	  responseType = defined.defaultValue(responseType, "");
	  const mimeType = dataUriRegexResult[1];
	  const isBase64 = !!dataUriRegexResult[2];
	  const data = dataUriRegexResult[3];
	  let buffer;
	  let parser;

	  switch (responseType) {
	    case "":
	    case "text":
	      return decodeDataUriText(isBase64, data);
	    case "arraybuffer":
	      return decodeDataUriArrayBuffer(isBase64, data);
	    case "blob":
	      buffer = decodeDataUriArrayBuffer(isBase64, data);
	      return new Blob([buffer], {
	        type: mimeType,
	      });
	    case "document":
	      parser = new DOMParser();
	      return parser.parseFromString(
	        decodeDataUriText(isBase64, data),
	        mimeType
	      );
	    case "json":
	      return JSON.parse(decodeDataUriText(isBase64, data));
	    default:
	      //>>includeStart('debug', pragmas.debug);
	      throw new Check.DeveloperError(`Unhandled responseType: ${responseType}`);
	    //>>includeEnd('debug');
	  }
	}

	/**
	 * Asynchronously loads the given resource.  Returns a promise that will resolve to
	 * the result once loaded, or reject if the resource failed to load.  The data is loaded
	 * using XMLHttpRequest, which means that in order to make requests to another origin,
	 * the server must have Cross-Origin Resource Sharing (CORS) headers enabled. It's recommended that you use
	 * the more specific functions eg. fetchJson, fetchBlob, etc.
	 *
	 * @param {Object} [options] Object with the following properties:
	 * @param {String} [options.responseType] The type of response.  This controls the type of item returned.
	 * @param {Object} [options.headers] Additional HTTP headers to send with the request, if any.
	 * @param {String} [options.overrideMimeType] Overrides the MIME type returned by the server.
	 * @returns {Promise.<*>|undefined} a promise that will resolve to the requested data when loaded. Returns undefined if <code>request.throttle</code> is true and the request does not have high enough priority.
	 *
	 *
	 * @example
	 * resource.fetch()
	 *   .then(function(body) {
	 *       // use the data
	 *   }).catch(function(error) {
	 *       // an error occurred
	 *   });
	 *
	 * @see {@link http://www.w3.org/TR/cors/|Cross-Origin Resource Sharing}
	 * @see {@link http://wiki.commonjs.org/wiki/Promises/A|CommonJS Promises/A}
	 */
	Resource.prototype.fetch = function (options) {
	  options = defaultClone(options, {});
	  options.method = "GET";

	  return this._makeRequest(options);
	};

	/**
	 * Creates a Resource from a URL and calls fetch() on it.
	 *
	 * @param {String|Object} options A url or an object with the following properties
	 * @param {String} options.url The url of the resource.
	 * @param {Object} [options.queryParameters] An object containing query parameters that will be sent when retrieving the resource.
	 * @param {Object} [options.templateValues] Key/Value pairs that are used to replace template values (eg. {x}).
	 * @param {Object} [options.headers={}] Additional HTTP headers that will be sent.
	 * @param {Proxy} [options.proxy] A proxy to be used when loading the resource.
	 * @param {Resource.RetryCallback} [options.retryCallback] The Function to call when a request for this resource fails. If it returns true, the request will be retried.
	 * @param {Number} [options.retryAttempts=0] The number of times the retryCallback should be called before giving up.
	 * @param {Request} [options.request] A Request object that will be used. Intended for internal use only.
	 * @param {String} [options.responseType] The type of response.  This controls the type of item returned.
	 * @param {String} [options.overrideMimeType] Overrides the MIME type returned by the server.
	 * @returns {Promise.<*>|undefined} a promise that will resolve to the requested data when loaded. Returns undefined if <code>request.throttle</code> is true and the request does not have high enough priority.
	 */
	Resource.fetch = function (options) {
	  const resource = new Resource(options);
	  return resource.fetch({
	    // Make copy of just the needed fields because headers can be passed to both the constructor and to fetch
	    responseType: options.responseType,
	    overrideMimeType: options.overrideMimeType,
	  });
	};

	/**
	 * Asynchronously deletes the given resource.  Returns a promise that will resolve to
	 * the result once loaded, or reject if the resource failed to load.  The data is loaded
	 * using XMLHttpRequest, which means that in order to make requests to another origin,
	 * the server must have Cross-Origin Resource Sharing (CORS) headers enabled.
	 *
	 * @param {Object} [options] Object with the following properties:
	 * @param {String} [options.responseType] The type of response.  This controls the type of item returned.
	 * @param {Object} [options.headers] Additional HTTP headers to send with the request, if any.
	 * @param {String} [options.overrideMimeType] Overrides the MIME type returned by the server.
	 * @returns {Promise.<*>|undefined} a promise that will resolve to the requested data when loaded. Returns undefined if <code>request.throttle</code> is true and the request does not have high enough priority.
	 *
	 *
	 * @example
	 * resource.delete()
	 *   .then(function(body) {
	 *       // use the data
	 *   }).catch(function(error) {
	 *       // an error occurred
	 *   });
	 *
	 * @see {@link http://www.w3.org/TR/cors/|Cross-Origin Resource Sharing}
	 * @see {@link http://wiki.commonjs.org/wiki/Promises/A|CommonJS Promises/A}
	 */
	Resource.prototype.delete = function (options) {
	  options = defaultClone(options, {});
	  options.method = "DELETE";

	  return this._makeRequest(options);
	};

	/**
	 * Creates a Resource from a URL and calls delete() on it.
	 *
	 * @param {String|Object} options A url or an object with the following properties
	 * @param {String} options.url The url of the resource.
	 * @param {Object} [options.data] Data that is posted with the resource.
	 * @param {Object} [options.queryParameters] An object containing query parameters that will be sent when retrieving the resource.
	 * @param {Object} [options.templateValues] Key/Value pairs that are used to replace template values (eg. {x}).
	 * @param {Object} [options.headers={}] Additional HTTP headers that will be sent.
	 * @param {Proxy} [options.proxy] A proxy to be used when loading the resource.
	 * @param {Resource.RetryCallback} [options.retryCallback] The Function to call when a request for this resource fails. If it returns true, the request will be retried.
	 * @param {Number} [options.retryAttempts=0] The number of times the retryCallback should be called before giving up.
	 * @param {Request} [options.request] A Request object that will be used. Intended for internal use only.
	 * @param {String} [options.responseType] The type of response.  This controls the type of item returned.
	 * @param {String} [options.overrideMimeType] Overrides the MIME type returned by the server.
	 * @returns {Promise.<*>|undefined} a promise that will resolve to the requested data when loaded. Returns undefined if <code>request.throttle</code> is true and the request does not have high enough priority.
	 */
	Resource.delete = function (options) {
	  const resource = new Resource(options);
	  return resource.delete({
	    // Make copy of just the needed fields because headers can be passed to both the constructor and to fetch
	    responseType: options.responseType,
	    overrideMimeType: options.overrideMimeType,
	    data: options.data,
	  });
	};

	/**
	 * Asynchronously gets headers the given resource.  Returns a promise that will resolve to
	 * the result once loaded, or reject if the resource failed to load.  The data is loaded
	 * using XMLHttpRequest, which means that in order to make requests to another origin,
	 * the server must have Cross-Origin Resource Sharing (CORS) headers enabled.
	 *
	 * @param {Object} [options] Object with the following properties:
	 * @param {String} [options.responseType] The type of response.  This controls the type of item returned.
	 * @param {Object} [options.headers] Additional HTTP headers to send with the request, if any.
	 * @param {String} [options.overrideMimeType] Overrides the MIME type returned by the server.
	 * @returns {Promise.<*>|undefined} a promise that will resolve to the requested data when loaded. Returns undefined if <code>request.throttle</code> is true and the request does not have high enough priority.
	 *
	 *
	 * @example
	 * resource.head()
	 *   .then(function(headers) {
	 *       // use the data
	 *   }).catch(function(error) {
	 *       // an error occurred
	 *   });
	 *
	 * @see {@link http://www.w3.org/TR/cors/|Cross-Origin Resource Sharing}
	 * @see {@link http://wiki.commonjs.org/wiki/Promises/A|CommonJS Promises/A}
	 */
	Resource.prototype.head = function (options) {
	  options = defaultClone(options, {});
	  options.method = "HEAD";

	  return this._makeRequest(options);
	};

	/**
	 * Creates a Resource from a URL and calls head() on it.
	 *
	 * @param {String|Object} options A url or an object with the following properties
	 * @param {String} options.url The url of the resource.
	 * @param {Object} [options.queryParameters] An object containing query parameters that will be sent when retrieving the resource.
	 * @param {Object} [options.templateValues] Key/Value pairs that are used to replace template values (eg. {x}).
	 * @param {Object} [options.headers={}] Additional HTTP headers that will be sent.
	 * @param {Proxy} [options.proxy] A proxy to be used when loading the resource.
	 * @param {Resource.RetryCallback} [options.retryCallback] The Function to call when a request for this resource fails. If it returns true, the request will be retried.
	 * @param {Number} [options.retryAttempts=0] The number of times the retryCallback should be called before giving up.
	 * @param {Request} [options.request] A Request object that will be used. Intended for internal use only.
	 * @param {String} [options.responseType] The type of response.  This controls the type of item returned.
	 * @param {String} [options.overrideMimeType] Overrides the MIME type returned by the server.
	 * @returns {Promise.<*>|undefined} a promise that will resolve to the requested data when loaded. Returns undefined if <code>request.throttle</code> is true and the request does not have high enough priority.
	 */
	Resource.head = function (options) {
	  const resource = new Resource(options);
	  return resource.head({
	    // Make copy of just the needed fields because headers can be passed to both the constructor and to fetch
	    responseType: options.responseType,
	    overrideMimeType: options.overrideMimeType,
	  });
	};

	/**
	 * Asynchronously gets options the given resource.  Returns a promise that will resolve to
	 * the result once loaded, or reject if the resource failed to load.  The data is loaded
	 * using XMLHttpRequest, which means that in order to make requests to another origin,
	 * the server must have Cross-Origin Resource Sharing (CORS) headers enabled.
	 *
	 * @param {Object} [options] Object with the following properties:
	 * @param {String} [options.responseType] The type of response.  This controls the type of item returned.
	 * @param {Object} [options.headers] Additional HTTP headers to send with the request, if any.
	 * @param {String} [options.overrideMimeType] Overrides the MIME type returned by the server.
	 * @returns {Promise.<*>|undefined} a promise that will resolve to the requested data when loaded. Returns undefined if <code>request.throttle</code> is true and the request does not have high enough priority.
	 *
	 *
	 * @example
	 * resource.options()
	 *   .then(function(headers) {
	 *       // use the data
	 *   }).catch(function(error) {
	 *       // an error occurred
	 *   });
	 *
	 * @see {@link http://www.w3.org/TR/cors/|Cross-Origin Resource Sharing}
	 * @see {@link http://wiki.commonjs.org/wiki/Promises/A|CommonJS Promises/A}
	 */
	Resource.prototype.options = function (options) {
	  options = defaultClone(options, {});
	  options.method = "OPTIONS";

	  return this._makeRequest(options);
	};

	/**
	 * Creates a Resource from a URL and calls options() on it.
	 *
	 * @param {String|Object} options A url or an object with the following properties
	 * @param {String} options.url The url of the resource.
	 * @param {Object} [options.queryParameters] An object containing query parameters that will be sent when retrieving the resource.
	 * @param {Object} [options.templateValues] Key/Value pairs that are used to replace template values (eg. {x}).
	 * @param {Object} [options.headers={}] Additional HTTP headers that will be sent.
	 * @param {Proxy} [options.proxy] A proxy to be used when loading the resource.
	 * @param {Resource.RetryCallback} [options.retryCallback] The Function to call when a request for this resource fails. If it returns true, the request will be retried.
	 * @param {Number} [options.retryAttempts=0] The number of times the retryCallback should be called before giving up.
	 * @param {Request} [options.request] A Request object that will be used. Intended for internal use only.
	 * @param {String} [options.responseType] The type of response.  This controls the type of item returned.
	 * @param {String} [options.overrideMimeType] Overrides the MIME type returned by the server.
	 * @returns {Promise.<*>|undefined} a promise that will resolve to the requested data when loaded. Returns undefined if <code>request.throttle</code> is true and the request does not have high enough priority.
	 */
	Resource.options = function (options) {
	  const resource = new Resource(options);
	  return resource.options({
	    // Make copy of just the needed fields because headers can be passed to both the constructor and to fetch
	    responseType: options.responseType,
	    overrideMimeType: options.overrideMimeType,
	  });
	};

	/**
	 * Asynchronously posts data to the given resource.  Returns a promise that will resolve to
	 * the result once loaded, or reject if the resource failed to load.  The data is loaded
	 * using XMLHttpRequest, which means that in order to make requests to another origin,
	 * the server must have Cross-Origin Resource Sharing (CORS) headers enabled.
	 *
	 * @param {Object} data Data that is posted with the resource.
	 * @param {Object} [options] Object with the following properties:
	 * @param {Object} [options.data] Data that is posted with the resource.
	 * @param {String} [options.responseType] The type of response.  This controls the type of item returned.
	 * @param {Object} [options.headers] Additional HTTP headers to send with the request, if any.
	 * @param {String} [options.overrideMimeType] Overrides the MIME type returned by the server.
	 * @returns {Promise.<*>|undefined} a promise that will resolve to the requested data when loaded. Returns undefined if <code>request.throttle</code> is true and the request does not have high enough priority.
	 *
	 *
	 * @example
	 * resource.post(data)
	 *   .then(function(result) {
	 *       // use the result
	 *   }).catch(function(error) {
	 *       // an error occurred
	 *   });
	 *
	 * @see {@link http://www.w3.org/TR/cors/|Cross-Origin Resource Sharing}
	 * @see {@link http://wiki.commonjs.org/wiki/Promises/A|CommonJS Promises/A}
	 */
	Resource.prototype.post = function (data, options) {
	  Check.Check.defined("data", data);

	  options = defaultClone(options, {});
	  options.method = "POST";
	  options.data = data;

	  return this._makeRequest(options);
	};

	/**
	 * Creates a Resource from a URL and calls post() on it.
	 *
	 * @param {Object} options A url or an object with the following properties
	 * @param {String} options.url The url of the resource.
	 * @param {Object} options.data Data that is posted with the resource.
	 * @param {Object} [options.queryParameters] An object containing query parameters that will be sent when retrieving the resource.
	 * @param {Object} [options.templateValues] Key/Value pairs that are used to replace template values (eg. {x}).
	 * @param {Object} [options.headers={}] Additional HTTP headers that will be sent.
	 * @param {Proxy} [options.proxy] A proxy to be used when loading the resource.
	 * @param {Resource.RetryCallback} [options.retryCallback] The Function to call when a request for this resource fails. If it returns true, the request will be retried.
	 * @param {Number} [options.retryAttempts=0] The number of times the retryCallback should be called before giving up.
	 * @param {Request} [options.request] A Request object that will be used. Intended for internal use only.
	 * @param {String} [options.responseType] The type of response.  This controls the type of item returned.
	 * @param {String} [options.overrideMimeType] Overrides the MIME type returned by the server.
	 * @returns {Promise.<*>|undefined} a promise that will resolve to the requested data when loaded. Returns undefined if <code>request.throttle</code> is true and the request does not have high enough priority.
	 */
	Resource.post = function (options) {
	  const resource = new Resource(options);
	  return resource.post(options.data, {
	    // Make copy of just the needed fields because headers can be passed to both the constructor and to post
	    responseType: options.responseType,
	    overrideMimeType: options.overrideMimeType,
	  });
	};

	/**
	 * Asynchronously puts data to the given resource.  Returns a promise that will resolve to
	 * the result once loaded, or reject if the resource failed to load.  The data is loaded
	 * using XMLHttpRequest, which means that in order to make requests to another origin,
	 * the server must have Cross-Origin Resource Sharing (CORS) headers enabled.
	 *
	 * @param {Object} data Data that is posted with the resource.
	 * @param {Object} [options] Object with the following properties:
	 * @param {String} [options.responseType] The type of response.  This controls the type of item returned.
	 * @param {Object} [options.headers] Additional HTTP headers to send with the request, if any.
	 * @param {String} [options.overrideMimeType] Overrides the MIME type returned by the server.
	 * @returns {Promise.<*>|undefined} a promise that will resolve to the requested data when loaded. Returns undefined if <code>request.throttle</code> is true and the request does not have high enough priority.
	 *
	 *
	 * @example
	 * resource.put(data)
	 *   .then(function(result) {
	 *       // use the result
	 *   }).catch(function(error) {
	 *       // an error occurred
	 *   });
	 *
	 * @see {@link http://www.w3.org/TR/cors/|Cross-Origin Resource Sharing}
	 * @see {@link http://wiki.commonjs.org/wiki/Promises/A|CommonJS Promises/A}
	 */
	Resource.prototype.put = function (data, options) {
	  Check.Check.defined("data", data);

	  options = defaultClone(options, {});
	  options.method = "PUT";
	  options.data = data;

	  return this._makeRequest(options);
	};

	/**
	 * Creates a Resource from a URL and calls put() on it.
	 *
	 * @param {Object} options A url or an object with the following properties
	 * @param {String} options.url The url of the resource.
	 * @param {Object} options.data Data that is posted with the resource.
	 * @param {Object} [options.queryParameters] An object containing query parameters that will be sent when retrieving the resource.
	 * @param {Object} [options.templateValues] Key/Value pairs that are used to replace template values (eg. {x}).
	 * @param {Object} [options.headers={}] Additional HTTP headers that will be sent.
	 * @param {Proxy} [options.proxy] A proxy to be used when loading the resource.
	 * @param {Resource.RetryCallback} [options.retryCallback] The Function to call when a request for this resource fails. If it returns true, the request will be retried.
	 * @param {Number} [options.retryAttempts=0] The number of times the retryCallback should be called before giving up.
	 * @param {Request} [options.request] A Request object that will be used. Intended for internal use only.
	 * @param {String} [options.responseType] The type of response.  This controls the type of item returned.
	 * @param {String} [options.overrideMimeType] Overrides the MIME type returned by the server.
	 * @returns {Promise.<*>|undefined} a promise that will resolve to the requested data when loaded. Returns undefined if <code>request.throttle</code> is true and the request does not have high enough priority.
	 */
	Resource.put = function (options) {
	  const resource = new Resource(options);
	  return resource.put(options.data, {
	    // Make copy of just the needed fields because headers can be passed to both the constructor and to post
	    responseType: options.responseType,
	    overrideMimeType: options.overrideMimeType,
	  });
	};

	/**
	 * Asynchronously patches data to the given resource.  Returns a promise that will resolve to
	 * the result once loaded, or reject if the resource failed to load.  The data is loaded
	 * using XMLHttpRequest, which means that in order to make requests to another origin,
	 * the server must have Cross-Origin Resource Sharing (CORS) headers enabled.
	 *
	 * @param {Object} data Data that is posted with the resource.
	 * @param {Object} [options] Object with the following properties:
	 * @param {String} [options.responseType] The type of response.  This controls the type of item returned.
	 * @param {Object} [options.headers] Additional HTTP headers to send with the request, if any.
	 * @param {String} [options.overrideMimeType] Overrides the MIME type returned by the server.
	 * @returns {Promise.<*>|undefined} a promise that will resolve to the requested data when loaded. Returns undefined if <code>request.throttle</code> is true and the request does not have high enough priority.
	 *
	 *
	 * @example
	 * resource.patch(data)
	 *   .then(function(result) {
	 *       // use the result
	 *   }).catch(function(error) {
	 *       // an error occurred
	 *   });
	 *
	 * @see {@link http://www.w3.org/TR/cors/|Cross-Origin Resource Sharing}
	 * @see {@link http://wiki.commonjs.org/wiki/Promises/A|CommonJS Promises/A}
	 */
	Resource.prototype.patch = function (data, options) {
	  Check.Check.defined("data", data);

	  options = defaultClone(options, {});
	  options.method = "PATCH";
	  options.data = data;

	  return this._makeRequest(options);
	};

	/**
	 * Creates a Resource from a URL and calls patch() on it.
	 *
	 * @param {Object} options A url or an object with the following properties
	 * @param {String} options.url The url of the resource.
	 * @param {Object} options.data Data that is posted with the resource.
	 * @param {Object} [options.queryParameters] An object containing query parameters that will be sent when retrieving the resource.
	 * @param {Object} [options.templateValues] Key/Value pairs that are used to replace template values (eg. {x}).
	 * @param {Object} [options.headers={}] Additional HTTP headers that will be sent.
	 * @param {Proxy} [options.proxy] A proxy to be used when loading the resource.
	 * @param {Resource.RetryCallback} [options.retryCallback] The Function to call when a request for this resource fails. If it returns true, the request will be retried.
	 * @param {Number} [options.retryAttempts=0] The number of times the retryCallback should be called before giving up.
	 * @param {Request} [options.request] A Request object that will be used. Intended for internal use only.
	 * @param {String} [options.responseType] The type of response.  This controls the type of item returned.
	 * @param {String} [options.overrideMimeType] Overrides the MIME type returned by the server.
	 * @returns {Promise.<*>|undefined} a promise that will resolve to the requested data when loaded. Returns undefined if <code>request.throttle</code> is true and the request does not have high enough priority.
	 */
	Resource.patch = function (options) {
	  const resource = new Resource(options);
	  return resource.patch(options.data, {
	    // Make copy of just the needed fields because headers can be passed to both the constructor and to post
	    responseType: options.responseType,
	    overrideMimeType: options.overrideMimeType,
	  });
	};

	/**
	 * Contains implementations of functions that can be replaced for testing
	 *
	 * @private
	 */
	Resource._Implementations = {};

	Resource._Implementations.loadImageElement = function (
	  url,
	  crossOrigin,
	  deferred
	) {
	  const image = new Image();

	  image.onload = function () {
	    // work-around a known issue with Firefox and dimensionless SVG, see:
	    //   - https://github.com/whatwg/html/issues/3510
	    //   - https://bugzilla.mozilla.org/show_bug.cgi?id=700533
	    if (
	      image.naturalWidth === 0 &&
	      image.naturalHeight === 0 &&
	      image.width === 0 &&
	      image.height === 0
	    ) {
	      // these values affect rasterization and will likely mar the content
	      // until Firefox takes a stance on the issue, marred content is better than no content
	      // Chromium uses a more refined heuristic about its choice given nil viewBox, and a better stance and solution is
	      // proposed later in the original issue thread:
	      //   - Chromium behavior: https://github.com/CesiumGS/cesium/issues/9188#issuecomment-704400825
	      //   - Cesium's stance/solve: https://github.com/CesiumGS/cesium/issues/9188#issuecomment-720645777
	      image.width = 300;
	      image.height = 150;
	    }
	    deferred.resolve(image);
	  };

	  image.onerror = function (e) {
	    deferred.reject(e);
	  };

	  if (crossOrigin) {
	    if (TrustedServers$1.contains(url)) {
	      image.crossOrigin = "use-credentials";
	    } else {
	      image.crossOrigin = "";
	    }
	  }

	  image.src = url;
	};

	Resource._Implementations.createImage = function (
	  request,
	  crossOrigin,
	  deferred,
	  flipY,
	  skipColorSpaceConversion,
	  preferImageBitmap,
	  inWorker
	) {
	  const url = request.url;
	  // Passing an Image to createImageBitmap will force it to run on the main thread
	  // since DOM elements don't exist on workers. We convert it to a blob so it's non-blocking.
	  // See:
	  //    https://bugzilla.mozilla.org/show_bug.cgi?id=1044102#c38
	  //    https://bugs.chromium.org/p/chromium/issues/detail?id=580202#c10
	  Resource.supportsImageBitmapOptions()
	    .then(function (supportsImageBitmap) {
	      // We can only use ImageBitmap if we can flip on decode.
	      // See: https://github.com/CesiumGS/cesium/pull/7579#issuecomment-466146898

	      if (!inWorker && !(supportsImageBitmap && preferImageBitmap)) {
	        Resource._Implementations.loadImageElement(url, crossOrigin, deferred);
	        return;
	      }
	      const responseType = "blob";
	      const method = "GET";
	      const xhrDeferred = defer.defer();
	      const xhr = Resource._Implementations.loadWithXhr(
	        url,
	        responseType,
	        method,
	        undefined,
	        undefined,
	        xhrDeferred,
	        undefined,
	        undefined,
	        undefined
	      );

	      if (defined.defined(xhr) && defined.defined(xhr.abort)) {
	        request.cancelFunction = function () {
	          xhr.abort();
	        };
	      }
	      return xhrDeferred.promise
	        .then(function (blob) {
	          if (!defined.defined(blob)) {
	            deferred.reject(
	              new RuntimeError.RuntimeError(
	                `Successfully retrieved ${url} but it contained no content.`
	              )
	            );
	            return;
	          }

	          return Resource.createImageBitmapFromBlob(blob, {
	            flipY: flipY,
	            premultiplyAlpha: false,
	            skipColorSpaceConversion: skipColorSpaceConversion,
	          });
	        })
	        .then(function (image) {
	          deferred.resolve(image);
	        });
	    })
	    .catch(function (e) {
	      deferred.reject(e);
	    });
	};

	/**
	 * Wrapper for createImageBitmap
	 *
	 * @private
	 */
	Resource.createImageBitmapFromBlob = function (blob, options) {
	  Check.Check.defined("options", options);
	  Check.Check.typeOf.bool("options.flipY", options.flipY);
	  Check.Check.typeOf.bool("options.premultiplyAlpha", options.premultiplyAlpha);
	  Check.Check.typeOf.bool(
	    "options.skipColorSpaceConversion",
	    options.skipColorSpaceConversion
	  );

	  return createImageBitmap(blob, {
	    imageOrientation: options.flipY ? "flipY" : "none",
	    premultiplyAlpha: options.premultiplyAlpha ? "premultiply" : "none",
	    colorSpaceConversion: options.skipColorSpaceConversion ? "none" : "default",
	  });
	};

	function decodeResponse(loadWithHttpResponse, responseType) {
	  switch (responseType) {
	    case "text":
	      return loadWithHttpResponse.toString("utf8");
	    case "json":
	      return JSON.parse(loadWithHttpResponse.toString("utf8"));
	    default:
	      return new Uint8Array(loadWithHttpResponse).buffer;
	  }
	}

	function loadWithHttpRequest(
	  url,
	  responseType,
	  method,
	  data,
	  headers,
	  deferred,
	  overrideMimeType
	) {
	  // Note: only the 'json' and 'text' responseTypes transforms the loaded buffer
	  let URL;
	  let zlib;
	  Promise.all([new Promise(function (resolve, reject) { require(['url'], function (m) { resolve(/*#__PURE__*/_interopNamespace(m)); }, reject); }), new Promise(function (resolve, reject) { require(['zlib'], function (m) { resolve(/*#__PURE__*/_interopNamespace(m)); }, reject); })])
	    .then(([urlImport, zlibImport]) => {
	      URL = urlImport.parse(url);
	      zlib = zlibImport;

	      return URL.protocol === "https:" ? new Promise(function (resolve, reject) { require(['https'], function (m) { resolve(/*#__PURE__*/_interopNamespace(m)); }, reject); }) : new Promise(function (resolve, reject) { require(['http'], function (m) { resolve(/*#__PURE__*/_interopNamespace(m)); }, reject); });
	    })
	    .then((http) => {
	      const options = {
	        protocol: URL.protocol,
	        hostname: URL.hostname,
	        port: URL.port,
	        path: URL.path,
	        query: URL.query,
	        method: method,
	        headers: headers,
	      };
	      http
	        .request(options)
	        .on("response", function (res) {
	          if (res.statusCode < 200 || res.statusCode >= 300) {
	            deferred.reject(
	              new RequestErrorEvent(res.statusCode, res, res.headers)
	            );
	            return;
	          }

	          const chunkArray = [];
	          res.on("data", function (chunk) {
	            chunkArray.push(chunk);
	          });

	          res.on("end", function () {
	            // eslint-disable-next-line no-undef
	            const result = Buffer.concat(chunkArray);
	            if (res.headers["content-encoding"] === "gzip") {
	              zlib.gunzip(result, function (error, resultUnzipped) {
	                if (error) {
	                  deferred.reject(
	                    new RuntimeError.RuntimeError("Error decompressing response.")
	                  );
	                } else {
	                  deferred.resolve(
	                    decodeResponse(resultUnzipped, responseType)
	                  );
	                }
	              });
	            } else {
	              deferred.resolve(decodeResponse(result, responseType));
	            }
	          });
	        })
	        .on("error", function (e) {
	          deferred.reject(new RequestErrorEvent());
	        })
	        .end();
	    });
	}

	const noXMLHttpRequest = typeof XMLHttpRequest === "undefined";
	Resource._Implementations.loadWithXhr = function (
	  url,
	  responseType,
	  method,
	  data,
	  headers,
	  deferred,
	  overrideMimeType
	) {
	  const dataUriRegexResult = dataUriRegex.exec(url);
	  if (dataUriRegexResult !== null) {
	    deferred.resolve(decodeDataUri(dataUriRegexResult, responseType));
	    return;
	  }

	  if (noXMLHttpRequest) {
	    loadWithHttpRequest(
	      url,
	      responseType,
	      method,
	      data,
	      headers,
	      deferred);
	    return;
	  }

	  const xhr = new XMLHttpRequest();

	  if (TrustedServers$1.contains(url)) {
	    xhr.withCredentials = true;
	  }

	  xhr.open(method, url, true);

	  if (defined.defined(overrideMimeType) && defined.defined(xhr.overrideMimeType)) {
	    xhr.overrideMimeType(overrideMimeType);
	  }

	  if (defined.defined(headers)) {
	    for (const key in headers) {
	      if (headers.hasOwnProperty(key)) {
	        xhr.setRequestHeader(key, headers[key]);
	      }
	    }
	  }

	  if (defined.defined(responseType)) {
	    xhr.responseType = responseType;
	  }

	  // While non-standard, file protocol always returns a status of 0 on success
	  let localFile = false;
	  if (typeof url === "string") {
	    localFile =
	      url.indexOf("file://") === 0 ||
	      (typeof window !== "undefined" && window.location.origin === "file://");
	  }

	  xhr.onload = function () {
	    if (
	      (xhr.status < 200 || xhr.status >= 300) &&
	      !(localFile && xhr.status === 0)
	    ) {
	      deferred.reject(
	        new RequestErrorEvent(
	          xhr.status,
	          xhr.response,
	          xhr.getAllResponseHeaders()
	        )
	      );
	      return;
	    }

	    const response = xhr.response;
	    const browserResponseType = xhr.responseType;

	    if (method === "HEAD" || method === "OPTIONS") {
	      const responseHeaderString = xhr.getAllResponseHeaders();
	      const splitHeaders = responseHeaderString.trim().split(/[\r\n]+/);

	      const responseHeaders = {};
	      splitHeaders.forEach(function (line) {
	        const parts = line.split(": ");
	        const header = parts.shift();
	        responseHeaders[header] = parts.join(": ");
	      });

	      deferred.resolve(responseHeaders);
	      return;
	    }

	    //All modern browsers will go into either the first or second if block or last else block.
	    //Other code paths support older browsers that either do not support the supplied responseType
	    //or do not support the xhr.response property.
	    if (xhr.status === 204) {
	      // accept no content
	      deferred.resolve();
	    } else if (
	      defined.defined(response) &&
	      (!defined.defined(responseType) || browserResponseType === responseType)
	    ) {
	      deferred.resolve(response);
	    } else if (responseType === "json" && typeof response === "string") {
	      try {
	        deferred.resolve(JSON.parse(response));
	      } catch (e) {
	        deferred.reject(e);
	      }
	    } else if (
	      (browserResponseType === "" || browserResponseType === "document") &&
	      defined.defined(xhr.responseXML) &&
	      xhr.responseXML.hasChildNodes()
	    ) {
	      deferred.resolve(xhr.responseXML);
	    } else if (
	      (browserResponseType === "" || browserResponseType === "text") &&
	      defined.defined(xhr.responseText)
	    ) {
	      deferred.resolve(xhr.responseText);
	    } else {
	      deferred.reject(
	        new RuntimeError.RuntimeError("Invalid XMLHttpRequest response type.")
	      );
	    }
	  };

	  xhr.onerror = function (e) {
	    deferred.reject(new RequestErrorEvent());
	  };

	  xhr.send(data);

	  return xhr;
	};

	Resource._Implementations.loadAndExecuteScript = function (
	  url,
	  functionName,
	  deferred
	) {
	  return loadAndExecuteScript(url).catch(function (e) {
	    deferred.reject(e);
	  });
	};

	/**
	 * The default implementations
	 *
	 * @private
	 */
	Resource._DefaultImplementations = {};
	Resource._DefaultImplementations.createImage =
	  Resource._Implementations.createImage;
	Resource._DefaultImplementations.loadWithXhr =
	  Resource._Implementations.loadWithXhr;
	Resource._DefaultImplementations.loadAndExecuteScript =
	  Resource._Implementations.loadAndExecuteScript;

	/**
	 * A resource instance initialized to the current browser location
	 *
	 * @type {Resource}
	 * @constant
	 */
	Resource.DEFAULT = Object.freeze(
	  new Resource({
	    url:
	      typeof document === "undefined"
	        ? ""
	        : document.location.href.split("?")[0],
	  })
	);

	exports.Event = Event;
	exports.Resource = Resource;
	exports.URI = URI;
	exports.clone = clone;
	exports.getAbsoluteUri = getAbsoluteUri;
	exports.isCrossOriginUrl = isCrossOriginUrl;

}));
//# sourceMappingURL=Resource-0c25a925.js.map
