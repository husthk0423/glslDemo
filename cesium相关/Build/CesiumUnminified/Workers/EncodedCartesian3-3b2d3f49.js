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

define(['exports', './Cartesian3-5587e0cf', './Check-0f680516', './defined-a5305fd6'], (function (exports, Cartesian3, Check, defined) { 'use strict';

  /**
   * A fixed-point encoding of a {@link Cartesian3} with 64-bit floating-point components, as two {@link Cartesian3}
   * values that, when converted to 32-bit floating-point and added, approximate the original input.
   * <p>
   * This is used to encode positions in vertex buffers for rendering without jittering artifacts
   * as described in {@link http://help.agi.com/AGIComponents/html/BlogPrecisionsPrecisions.htm|Precisions, Precisions}.
   * </p>
   *
   * @alias EncodedCartesian3
   * @constructor
   *
   * @private
   */
  function EncodedCartesian3() {
    /**
     * The high bits for each component.  Bits 0 to 22 store the whole value.  Bits 23 to 31 are not used.
     *
     * @type {Cartesian3}
     * @default {@link Cartesian3.ZERO}
     */
    this.high = Cartesian3.Cartesian3.clone(Cartesian3.Cartesian3.ZERO);

    /**
     * The low bits for each component.  Bits 7 to 22 store the whole value, and bits 0 to 6 store the fraction.  Bits 23 to 31 are not used.
     *
     * @type {Cartesian3}
     * @default {@link Cartesian3.ZERO}
     */
    this.low = Cartesian3.Cartesian3.clone(Cartesian3.Cartesian3.ZERO);
  }

  /**
   * Encodes a 64-bit floating-point value as two floating-point values that, when converted to
   * 32-bit floating-point and added, approximate the original input.  The returned object
   * has <code>high</code> and <code>low</code> properties for the high and low bits, respectively.
   * <p>
   * The fixed-point encoding follows {@link http://help.agi.com/AGIComponents/html/BlogPrecisionsPrecisions.htm|Precisions, Precisions}.
   * </p>
   *
   * @param {Number} value The floating-point value to encode.
   * @param {Object} [result] The object onto which to store the result.
   * @returns {Object} The modified result parameter or a new instance if one was not provided.
   *
   * @example
   * const value = 1234567.1234567;
   * const splitValue = Cesium.EncodedCartesian3.encode(value);
   */
  EncodedCartesian3.encode = function (value, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.number("value", value);
    //>>includeEnd('debug');

    if (!defined.defined(result)) {
      result = {
        high: 0.0,
        low: 0.0,
      };
    }

    let doubleHigh;
    if (value >= 0.0) {
      doubleHigh = Math.floor(value / 65536.0) * 65536.0;
      result.high = doubleHigh;
      result.low = value - doubleHigh;
    } else {
      doubleHigh = Math.floor(-value / 65536.0) * 65536.0;
      result.high = -doubleHigh;
      result.low = value + doubleHigh;
    }

    return result;
  };

  const scratchEncode = {
    high: 0.0,
    low: 0.0,
  };

  /**
   * Encodes a {@link Cartesian3} with 64-bit floating-point components as two {@link Cartesian3}
   * values that, when converted to 32-bit floating-point and added, approximate the original input.
   * <p>
   * The fixed-point encoding follows {@link https://help.agi.com/AGIComponents/html/BlogPrecisionsPrecisions.htm|Precisions, Precisions}.
   * </p>
   *
   * @param {Cartesian3} cartesian The cartesian to encode.
   * @param {EncodedCartesian3} [result] The object onto which to store the result.
   * @returns {EncodedCartesian3} The modified result parameter or a new EncodedCartesian3 instance if one was not provided.
   *
   * @example
   * const cart = new Cesium.Cartesian3(-10000000.0, 0.0, 10000000.0);
   * const encoded = Cesium.EncodedCartesian3.fromCartesian(cart);
   */
  EncodedCartesian3.fromCartesian = function (cartesian, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("cartesian", cartesian);
    //>>includeEnd('debug');

    if (!defined.defined(result)) {
      result = new EncodedCartesian3();
    }

    const high = result.high;
    const low = result.low;

    EncodedCartesian3.encode(cartesian.x, scratchEncode);
    high.x = scratchEncode.high;
    low.x = scratchEncode.low;

    EncodedCartesian3.encode(cartesian.y, scratchEncode);
    high.y = scratchEncode.high;
    low.y = scratchEncode.low;

    EncodedCartesian3.encode(cartesian.z, scratchEncode);
    high.z = scratchEncode.high;
    low.z = scratchEncode.low;

    return result;
  };

  const encodedP = new EncodedCartesian3();

  /**
   * Encodes the provided <code>cartesian</code>, and writes it to an array with <code>high</code>
   * components followed by <code>low</code> components, i.e. <code>[high.x, high.y, high.z, low.x, low.y, low.z]</code>.
   * <p>
   * This is used to create interleaved high-precision position vertex attributes.
   * </p>
   *
   * @param {Cartesian3} cartesian The cartesian to encode.
   * @param {Number[]} cartesianArray The array to write to.
   * @param {Number} index The index into the array to start writing.  Six elements will be written.
   *
   * @exception {DeveloperError} index must be a number greater than or equal to 0.
   *
   * @example
   * const positions = [
   *    new Cesium.Cartesian3(),
   *    // ...
   * ];
   * const encodedPositions = new Float32Array(2 * 3 * positions.length);
   * let j = 0;
   * for (let i = 0; i < positions.length; ++i) {
   *   Cesium.EncodedCartesian3.writeElement(positions[i], encodedPositions, j);
   *   j += 6;
   * }
   */
  EncodedCartesian3.writeElements = function (cartesian, cartesianArray, index) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.defined("cartesianArray", cartesianArray);
    Check.Check.typeOf.number("index", index);
    Check.Check.typeOf.number.greaterThanOrEquals("index", index, 0);
    //>>includeEnd('debug');

    EncodedCartesian3.fromCartesian(cartesian, encodedP);
    const high = encodedP.high;
    const low = encodedP.low;

    cartesianArray[index] = high.x;
    cartesianArray[index + 1] = high.y;
    cartesianArray[index + 2] = high.z;
    cartesianArray[index + 3] = low.x;
    cartesianArray[index + 4] = low.y;
    cartesianArray[index + 5] = low.z;
  };

  exports.EncodedCartesian3 = EncodedCartesian3;

}));
//# sourceMappingURL=EncodedCartesian3-3b2d3f49.js.map
