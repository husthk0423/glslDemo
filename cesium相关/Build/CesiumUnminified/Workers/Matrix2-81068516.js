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

define(['exports', './Cartesian3-5587e0cf', './Check-0f680516', './defined-a5305fd6', './Math-79d70b44', './RuntimeError-8d8b6ef6', './Cartesian2-b941a975'], (function (exports, Cartesian3, Check, defined, Math$1, RuntimeError, Cartesian2) { 'use strict';

  /**
   * A 3x3 matrix, indexable as a column-major order array.
   * Constructor parameters are in row-major order for code readability.
   * @alias Matrix3
   * @constructor
   * @implements {ArrayLike<number>}
   *
   * @param {Number} [column0Row0=0.0] The value for column 0, row 0.
   * @param {Number} [column1Row0=0.0] The value for column 1, row 0.
   * @param {Number} [column2Row0=0.0] The value for column 2, row 0.
   * @param {Number} [column0Row1=0.0] The value for column 0, row 1.
   * @param {Number} [column1Row1=0.0] The value for column 1, row 1.
   * @param {Number} [column2Row1=0.0] The value for column 2, row 1.
   * @param {Number} [column0Row2=0.0] The value for column 0, row 2.
   * @param {Number} [column1Row2=0.0] The value for column 1, row 2.
   * @param {Number} [column2Row2=0.0] The value for column 2, row 2.
   *
   * @see Matrix3.fromArray
   * @see Matrix3.fromColumnMajorArray
   * @see Matrix3.fromRowMajorArray
   * @see Matrix3.fromQuaternion
   * @see Matrix3.fromHeadingPitchRoll
   * @see Matrix3.fromScale
   * @see Matrix3.fromUniformScale
   * @see Matrix3.fromCrossProduct
   * @see Matrix3.fromRotationX
   * @see Matrix3.fromRotationY
   * @see Matrix3.fromRotationZ
   * @see Matrix2
   * @see Matrix4
   */
  function Matrix3(
    column0Row0,
    column1Row0,
    column2Row0,
    column0Row1,
    column1Row1,
    column2Row1,
    column0Row2,
    column1Row2,
    column2Row2
  ) {
    this[0] = defined.defaultValue(column0Row0, 0.0);
    this[1] = defined.defaultValue(column0Row1, 0.0);
    this[2] = defined.defaultValue(column0Row2, 0.0);
    this[3] = defined.defaultValue(column1Row0, 0.0);
    this[4] = defined.defaultValue(column1Row1, 0.0);
    this[5] = defined.defaultValue(column1Row2, 0.0);
    this[6] = defined.defaultValue(column2Row0, 0.0);
    this[7] = defined.defaultValue(column2Row1, 0.0);
    this[8] = defined.defaultValue(column2Row2, 0.0);
  }

  /**
   * The number of elements used to pack the object into an array.
   * @type {Number}
   */
  Matrix3.packedLength = 9;

  /**
   * Stores the provided instance into the provided array.
   *
   * @param {Matrix3} value The value to pack.
   * @param {Number[]} array The array to pack into.
   * @param {Number} [startingIndex=0] The index into the array at which to start packing the elements.
   *
   * @returns {Number[]} The array that was packed into
   */
  Matrix3.pack = function (value, array, startingIndex) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("value", value);
    Check.Check.defined("array", array);
    //>>includeEnd('debug');

    startingIndex = defined.defaultValue(startingIndex, 0);

    array[startingIndex++] = value[0];
    array[startingIndex++] = value[1];
    array[startingIndex++] = value[2];
    array[startingIndex++] = value[3];
    array[startingIndex++] = value[4];
    array[startingIndex++] = value[5];
    array[startingIndex++] = value[6];
    array[startingIndex++] = value[7];
    array[startingIndex++] = value[8];

    return array;
  };

  /**
   * Retrieves an instance from a packed array.
   *
   * @param {Number[]} array The packed array.
   * @param {Number} [startingIndex=0] The starting index of the element to be unpacked.
   * @param {Matrix3} [result] The object into which to store the result.
   * @returns {Matrix3} The modified result parameter or a new Matrix3 instance if one was not provided.
   */
  Matrix3.unpack = function (array, startingIndex, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.defined("array", array);
    //>>includeEnd('debug');

    startingIndex = defined.defaultValue(startingIndex, 0);

    if (!defined.defined(result)) {
      result = new Matrix3();
    }

    result[0] = array[startingIndex++];
    result[1] = array[startingIndex++];
    result[2] = array[startingIndex++];
    result[3] = array[startingIndex++];
    result[4] = array[startingIndex++];
    result[5] = array[startingIndex++];
    result[6] = array[startingIndex++];
    result[7] = array[startingIndex++];
    result[8] = array[startingIndex++];
    return result;
  };

  /**
   * Flattens an array of Matrix3s into an array of components. The components
   * are stored in column-major order.
   *
   * @param {Matrix3[]} array The array of matrices to pack.
   * @param {Number[]} [result] The array onto which to store the result. If this is a typed array, it must have array.length * 9 components, else a {@link DeveloperError} will be thrown. If it is a regular array, it will be resized to have (array.length * 9) elements.
   * @returns {Number[]} The packed array.
   */
  Matrix3.packArray = function (array, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.defined("array", array);
    //>>includeEnd('debug');

    const length = array.length;
    const resultLength = length * 9;
    if (!defined.defined(result)) {
      result = new Array(resultLength);
    } else if (!Array.isArray(result) && result.length !== resultLength) {
      //>>includeStart('debug', pragmas.debug);
      throw new Check.DeveloperError(
        "If result is a typed array, it must have exactly array.length * 9 elements"
      );
      //>>includeEnd('debug');
    } else if (result.length !== resultLength) {
      result.length = resultLength;
    }

    for (let i = 0; i < length; ++i) {
      Matrix3.pack(array[i], result, i * 9);
    }
    return result;
  };

  /**
   * Unpacks an array of column-major matrix components into an array of Matrix3s.
   *
   * @param {Number[]} array The array of components to unpack.
   * @param {Matrix3[]} [result] The array onto which to store the result.
   * @returns {Matrix3[]} The unpacked array.
   */
  Matrix3.unpackArray = function (array, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.defined("array", array);
    Check.Check.typeOf.number.greaterThanOrEquals("array.length", array.length, 9);
    if (array.length % 9 !== 0) {
      throw new Check.DeveloperError("array length must be a multiple of 9.");
    }
    //>>includeEnd('debug');

    const length = array.length;
    if (!defined.defined(result)) {
      result = new Array(length / 9);
    } else {
      result.length = length / 9;
    }

    for (let i = 0; i < length; i += 9) {
      const index = i / 9;
      result[index] = Matrix3.unpack(array, i, result[index]);
    }
    return result;
  };

  /**
   * Duplicates a Matrix3 instance.
   *
   * @param {Matrix3} matrix The matrix to duplicate.
   * @param {Matrix3} [result] The object onto which to store the result.
   * @returns {Matrix3} The modified result parameter or a new Matrix3 instance if one was not provided. (Returns undefined if matrix is undefined)
   */
  Matrix3.clone = function (matrix, result) {
    if (!defined.defined(matrix)) {
      return undefined;
    }
    if (!defined.defined(result)) {
      return new Matrix3(
        matrix[0],
        matrix[3],
        matrix[6],
        matrix[1],
        matrix[4],
        matrix[7],
        matrix[2],
        matrix[5],
        matrix[8]
      );
    }
    result[0] = matrix[0];
    result[1] = matrix[1];
    result[2] = matrix[2];
    result[3] = matrix[3];
    result[4] = matrix[4];
    result[5] = matrix[5];
    result[6] = matrix[6];
    result[7] = matrix[7];
    result[8] = matrix[8];
    return result;
  };

  /**
   * Creates a Matrix3 from 9 consecutive elements in an array.
   *
   * @function
   * @param {Number[]} array The array whose 9 consecutive elements correspond to the positions of the matrix.  Assumes column-major order.
   * @param {Number} [startingIndex=0] The offset into the array of the first element, which corresponds to first column first row position in the matrix.
   * @param {Matrix3} [result] The object onto which to store the result.
   * @returns {Matrix3} The modified result parameter or a new Matrix3 instance if one was not provided.
   *
   * @example
   * // Create the Matrix3:
   * // [1.0, 2.0, 3.0]
   * // [1.0, 2.0, 3.0]
   * // [1.0, 2.0, 3.0]
   *
   * const v = [1.0, 1.0, 1.0, 2.0, 2.0, 2.0, 3.0, 3.0, 3.0];
   * const m = Cesium.Matrix3.fromArray(v);
   *
   * // Create same Matrix3 with using an offset into an array
   * const v2 = [0.0, 0.0, 1.0, 1.0, 1.0, 2.0, 2.0, 2.0, 3.0, 3.0, 3.0];
   * const m2 = Cesium.Matrix3.fromArray(v2, 2);
   */
  Matrix3.fromArray = Matrix3.unpack;

  /**
   * Creates a Matrix3 instance from a column-major order array.
   *
   * @param {Number[]} values The column-major order array.
   * @param {Matrix3} [result] The object in which the result will be stored, if undefined a new instance will be created.
   * @returns {Matrix3} The modified result parameter, or a new Matrix3 instance if one was not provided.
   */
  Matrix3.fromColumnMajorArray = function (values, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.defined("values", values);
    //>>includeEnd('debug');

    return Matrix3.clone(values, result);
  };

  /**
   * Creates a Matrix3 instance from a row-major order array.
   * The resulting matrix will be in column-major order.
   *
   * @param {Number[]} values The row-major order array.
   * @param {Matrix3} [result] The object in which the result will be stored, if undefined a new instance will be created.
   * @returns {Matrix3} The modified result parameter, or a new Matrix3 instance if one was not provided.
   */
  Matrix3.fromRowMajorArray = function (values, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.defined("values", values);
    //>>includeEnd('debug');

    if (!defined.defined(result)) {
      return new Matrix3(
        values[0],
        values[1],
        values[2],
        values[3],
        values[4],
        values[5],
        values[6],
        values[7],
        values[8]
      );
    }
    result[0] = values[0];
    result[1] = values[3];
    result[2] = values[6];
    result[3] = values[1];
    result[4] = values[4];
    result[5] = values[7];
    result[6] = values[2];
    result[7] = values[5];
    result[8] = values[8];
    return result;
  };

  /**
   * Computes a 3x3 rotation matrix from the provided quaternion.
   *
   * @param {Quaternion} quaternion the quaternion to use.
   * @param {Matrix3} [result] The object in which the result will be stored, if undefined a new instance will be created.
   * @returns {Matrix3} The 3x3 rotation matrix from this quaternion.
   */
  Matrix3.fromQuaternion = function (quaternion, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("quaternion", quaternion);
    //>>includeEnd('debug');

    const x2 = quaternion.x * quaternion.x;
    const xy = quaternion.x * quaternion.y;
    const xz = quaternion.x * quaternion.z;
    const xw = quaternion.x * quaternion.w;
    const y2 = quaternion.y * quaternion.y;
    const yz = quaternion.y * quaternion.z;
    const yw = quaternion.y * quaternion.w;
    const z2 = quaternion.z * quaternion.z;
    const zw = quaternion.z * quaternion.w;
    const w2 = quaternion.w * quaternion.w;

    const m00 = x2 - y2 - z2 + w2;
    const m01 = 2.0 * (xy - zw);
    const m02 = 2.0 * (xz + yw);

    const m10 = 2.0 * (xy + zw);
    const m11 = -x2 + y2 - z2 + w2;
    const m12 = 2.0 * (yz - xw);

    const m20 = 2.0 * (xz - yw);
    const m21 = 2.0 * (yz + xw);
    const m22 = -x2 - y2 + z2 + w2;

    if (!defined.defined(result)) {
      return new Matrix3(m00, m01, m02, m10, m11, m12, m20, m21, m22);
    }
    result[0] = m00;
    result[1] = m10;
    result[2] = m20;
    result[3] = m01;
    result[4] = m11;
    result[5] = m21;
    result[6] = m02;
    result[7] = m12;
    result[8] = m22;
    return result;
  };

  /**
   * Computes a 3x3 rotation matrix from the provided headingPitchRoll. (see http://en.wikipedia.org/wiki/Conversion_between_quaternions_and_Euler_angles )
   *
   * @param {HeadingPitchRoll} headingPitchRoll the headingPitchRoll to use.
   * @param {Matrix3} [result] The object in which the result will be stored, if undefined a new instance will be created.
   * @returns {Matrix3} The 3x3 rotation matrix from this headingPitchRoll.
   */
  Matrix3.fromHeadingPitchRoll = function (headingPitchRoll, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("headingPitchRoll", headingPitchRoll);
    //>>includeEnd('debug');

    const cosTheta = Math.cos(-headingPitchRoll.pitch);
    const cosPsi = Math.cos(-headingPitchRoll.heading);
    const cosPhi = Math.cos(headingPitchRoll.roll);
    const sinTheta = Math.sin(-headingPitchRoll.pitch);
    const sinPsi = Math.sin(-headingPitchRoll.heading);
    const sinPhi = Math.sin(headingPitchRoll.roll);

    const m00 = cosTheta * cosPsi;
    const m01 = -cosPhi * sinPsi + sinPhi * sinTheta * cosPsi;
    const m02 = sinPhi * sinPsi + cosPhi * sinTheta * cosPsi;

    const m10 = cosTheta * sinPsi;
    const m11 = cosPhi * cosPsi + sinPhi * sinTheta * sinPsi;
    const m12 = -sinPhi * cosPsi + cosPhi * sinTheta * sinPsi;

    const m20 = -sinTheta;
    const m21 = sinPhi * cosTheta;
    const m22 = cosPhi * cosTheta;

    if (!defined.defined(result)) {
      return new Matrix3(m00, m01, m02, m10, m11, m12, m20, m21, m22);
    }
    result[0] = m00;
    result[1] = m10;
    result[2] = m20;
    result[3] = m01;
    result[4] = m11;
    result[5] = m21;
    result[6] = m02;
    result[7] = m12;
    result[8] = m22;
    return result;
  };

  /**
   * Computes a Matrix3 instance representing a non-uniform scale.
   *
   * @param {Cartesian3} scale The x, y, and z scale factors.
   * @param {Matrix3} [result] The object in which the result will be stored, if undefined a new instance will be created.
   * @returns {Matrix3} The modified result parameter, or a new Matrix3 instance if one was not provided.
   *
   * @example
   * // Creates
   * //   [7.0, 0.0, 0.0]
   * //   [0.0, 8.0, 0.0]
   * //   [0.0, 0.0, 9.0]
   * const m = Cesium.Matrix3.fromScale(new Cesium.Cartesian3(7.0, 8.0, 9.0));
   */
  Matrix3.fromScale = function (scale, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("scale", scale);
    //>>includeEnd('debug');

    if (!defined.defined(result)) {
      return new Matrix3(scale.x, 0.0, 0.0, 0.0, scale.y, 0.0, 0.0, 0.0, scale.z);
    }

    result[0] = scale.x;
    result[1] = 0.0;
    result[2] = 0.0;
    result[3] = 0.0;
    result[4] = scale.y;
    result[5] = 0.0;
    result[6] = 0.0;
    result[7] = 0.0;
    result[8] = scale.z;
    return result;
  };

  /**
   * Computes a Matrix3 instance representing a uniform scale.
   *
   * @param {Number} scale The uniform scale factor.
   * @param {Matrix3} [result] The object in which the result will be stored, if undefined a new instance will be created.
   * @returns {Matrix3} The modified result parameter, or a new Matrix3 instance if one was not provided.
   *
   * @example
   * // Creates
   * //   [2.0, 0.0, 0.0]
   * //   [0.0, 2.0, 0.0]
   * //   [0.0, 0.0, 2.0]
   * const m = Cesium.Matrix3.fromUniformScale(2.0);
   */
  Matrix3.fromUniformScale = function (scale, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.number("scale", scale);
    //>>includeEnd('debug');

    if (!defined.defined(result)) {
      return new Matrix3(scale, 0.0, 0.0, 0.0, scale, 0.0, 0.0, 0.0, scale);
    }

    result[0] = scale;
    result[1] = 0.0;
    result[2] = 0.0;
    result[3] = 0.0;
    result[4] = scale;
    result[5] = 0.0;
    result[6] = 0.0;
    result[7] = 0.0;
    result[8] = scale;
    return result;
  };

  /**
   * Computes a Matrix3 instance representing the cross product equivalent matrix of a Cartesian3 vector.
   *
   * @param {Cartesian3} vector the vector on the left hand side of the cross product operation.
   * @param {Matrix3} [result] The object in which the result will be stored, if undefined a new instance will be created.
   * @returns {Matrix3} The modified result parameter, or a new Matrix3 instance if one was not provided.
   *
   * @example
   * // Creates
   * //   [0.0, -9.0,  8.0]
   * //   [9.0,  0.0, -7.0]
   * //   [-8.0, 7.0,  0.0]
   * const m = Cesium.Matrix3.fromCrossProduct(new Cesium.Cartesian3(7.0, 8.0, 9.0));
   */
  Matrix3.fromCrossProduct = function (vector, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("vector", vector);
    //>>includeEnd('debug');

    if (!defined.defined(result)) {
      return new Matrix3(
        0.0,
        -vector.z,
        vector.y,
        vector.z,
        0.0,
        -vector.x,
        -vector.y,
        vector.x,
        0.0
      );
    }

    result[0] = 0.0;
    result[1] = vector.z;
    result[2] = -vector.y;
    result[3] = -vector.z;
    result[4] = 0.0;
    result[5] = vector.x;
    result[6] = vector.y;
    result[7] = -vector.x;
    result[8] = 0.0;
    return result;
  };

  /**
   * Creates a rotation matrix around the x-axis.
   *
   * @param {Number} angle The angle, in radians, of the rotation.  Positive angles are counterclockwise.
   * @param {Matrix3} [result] The object in which the result will be stored, if undefined a new instance will be created.
   * @returns {Matrix3} The modified result parameter, or a new Matrix3 instance if one was not provided.
   *
   * @example
   * // Rotate a point 45 degrees counterclockwise around the x-axis.
   * const p = new Cesium.Cartesian3(5, 6, 7);
   * const m = Cesium.Matrix3.fromRotationX(Cesium.Math.toRadians(45.0));
   * const rotated = Cesium.Matrix3.multiplyByVector(m, p, new Cesium.Cartesian3());
   */
  Matrix3.fromRotationX = function (angle, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.number("angle", angle);
    //>>includeEnd('debug');

    const cosAngle = Math.cos(angle);
    const sinAngle = Math.sin(angle);

    if (!defined.defined(result)) {
      return new Matrix3(
        1.0,
        0.0,
        0.0,
        0.0,
        cosAngle,
        -sinAngle,
        0.0,
        sinAngle,
        cosAngle
      );
    }

    result[0] = 1.0;
    result[1] = 0.0;
    result[2] = 0.0;
    result[3] = 0.0;
    result[4] = cosAngle;
    result[5] = sinAngle;
    result[6] = 0.0;
    result[7] = -sinAngle;
    result[8] = cosAngle;

    return result;
  };

  /**
   * Creates a rotation matrix around the y-axis.
   *
   * @param {Number} angle The angle, in radians, of the rotation.  Positive angles are counterclockwise.
   * @param {Matrix3} [result] The object in which the result will be stored, if undefined a new instance will be created.
   * @returns {Matrix3} The modified result parameter, or a new Matrix3 instance if one was not provided.
   *
   * @example
   * // Rotate a point 45 degrees counterclockwise around the y-axis.
   * const p = new Cesium.Cartesian3(5, 6, 7);
   * const m = Cesium.Matrix3.fromRotationY(Cesium.Math.toRadians(45.0));
   * const rotated = Cesium.Matrix3.multiplyByVector(m, p, new Cesium.Cartesian3());
   */
  Matrix3.fromRotationY = function (angle, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.number("angle", angle);
    //>>includeEnd('debug');

    const cosAngle = Math.cos(angle);
    const sinAngle = Math.sin(angle);

    if (!defined.defined(result)) {
      return new Matrix3(
        cosAngle,
        0.0,
        sinAngle,
        0.0,
        1.0,
        0.0,
        -sinAngle,
        0.0,
        cosAngle
      );
    }

    result[0] = cosAngle;
    result[1] = 0.0;
    result[2] = -sinAngle;
    result[3] = 0.0;
    result[4] = 1.0;
    result[5] = 0.0;
    result[6] = sinAngle;
    result[7] = 0.0;
    result[8] = cosAngle;

    return result;
  };

  /**
   * Creates a rotation matrix around the z-axis.
   *
   * @param {Number} angle The angle, in radians, of the rotation.  Positive angles are counterclockwise.
   * @param {Matrix3} [result] The object in which the result will be stored, if undefined a new instance will be created.
   * @returns {Matrix3} The modified result parameter, or a new Matrix3 instance if one was not provided.
   *
   * @example
   * // Rotate a point 45 degrees counterclockwise around the z-axis.
   * const p = new Cesium.Cartesian3(5, 6, 7);
   * const m = Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(45.0));
   * const rotated = Cesium.Matrix3.multiplyByVector(m, p, new Cesium.Cartesian3());
   */
  Matrix3.fromRotationZ = function (angle, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.number("angle", angle);
    //>>includeEnd('debug');

    const cosAngle = Math.cos(angle);
    const sinAngle = Math.sin(angle);

    if (!defined.defined(result)) {
      return new Matrix3(
        cosAngle,
        -sinAngle,
        0.0,
        sinAngle,
        cosAngle,
        0.0,
        0.0,
        0.0,
        1.0
      );
    }

    result[0] = cosAngle;
    result[1] = sinAngle;
    result[2] = 0.0;
    result[3] = -sinAngle;
    result[4] = cosAngle;
    result[5] = 0.0;
    result[6] = 0.0;
    result[7] = 0.0;
    result[8] = 1.0;

    return result;
  };

  /**
   * Creates an Array from the provided Matrix3 instance.
   * The array will be in column-major order.
   *
   * @param {Matrix3} matrix The matrix to use..
   * @param {Number[]} [result] The Array onto which to store the result.
   * @returns {Number[]} The modified Array parameter or a new Array instance if one was not provided.
   */
  Matrix3.toArray = function (matrix, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("matrix", matrix);
    //>>includeEnd('debug');

    if (!defined.defined(result)) {
      return [
        matrix[0],
        matrix[1],
        matrix[2],
        matrix[3],
        matrix[4],
        matrix[5],
        matrix[6],
        matrix[7],
        matrix[8],
      ];
    }
    result[0] = matrix[0];
    result[1] = matrix[1];
    result[2] = matrix[2];
    result[3] = matrix[3];
    result[4] = matrix[4];
    result[5] = matrix[5];
    result[6] = matrix[6];
    result[7] = matrix[7];
    result[8] = matrix[8];
    return result;
  };

  /**
   * Computes the array index of the element at the provided row and column.
   *
   * @param {Number} column The zero-based index of the column.
   * @param {Number} row The zero-based index of the row.
   * @returns {Number} The index of the element at the provided row and column.
   *
   * @exception {DeveloperError} row must be 0, 1, or 2.
   * @exception {DeveloperError} column must be 0, 1, or 2.
   *
   * @example
   * const myMatrix = new Cesium.Matrix3();
   * const column1Row0Index = Cesium.Matrix3.getElementIndex(1, 0);
   * const column1Row0 = myMatrix[column1Row0Index]
   * myMatrix[column1Row0Index] = 10.0;
   */
  Matrix3.getElementIndex = function (column, row) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.number.greaterThanOrEquals("row", row, 0);
    Check.Check.typeOf.number.lessThanOrEquals("row", row, 2);
    Check.Check.typeOf.number.greaterThanOrEquals("column", column, 0);
    Check.Check.typeOf.number.lessThanOrEquals("column", column, 2);
    //>>includeEnd('debug');

    return column * 3 + row;
  };

  /**
   * Retrieves a copy of the matrix column at the provided index as a Cartesian3 instance.
   *
   * @param {Matrix3} matrix The matrix to use.
   * @param {Number} index The zero-based index of the column to retrieve.
   * @param {Cartesian3} result The object onto which to store the result.
   * @returns {Cartesian3} The modified result parameter.
   *
   * @exception {DeveloperError} index must be 0, 1, or 2.
   */
  Matrix3.getColumn = function (matrix, index, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("matrix", matrix);
    Check.Check.typeOf.number.greaterThanOrEquals("index", index, 0);
    Check.Check.typeOf.number.lessThanOrEquals("index", index, 2);
    Check.Check.typeOf.object("result", result);
    //>>includeEnd('debug');

    const startIndex = index * 3;
    const x = matrix[startIndex];
    const y = matrix[startIndex + 1];
    const z = matrix[startIndex + 2];

    result.x = x;
    result.y = y;
    result.z = z;
    return result;
  };

  /**
   * Computes a new matrix that replaces the specified column in the provided matrix with the provided Cartesian3 instance.
   *
   * @param {Matrix3} matrix The matrix to use.
   * @param {Number} index The zero-based index of the column to set.
   * @param {Cartesian3} cartesian The Cartesian whose values will be assigned to the specified column.
   * @param {Matrix3} result The object onto which to store the result.
   * @returns {Matrix3} The modified result parameter.
   *
   * @exception {DeveloperError} index must be 0, 1, or 2.
   */
  Matrix3.setColumn = function (matrix, index, cartesian, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("matrix", matrix);
    Check.Check.typeOf.number.greaterThanOrEquals("index", index, 0);
    Check.Check.typeOf.number.lessThanOrEquals("index", index, 2);
    Check.Check.typeOf.object("cartesian", cartesian);
    Check.Check.typeOf.object("result", result);
    //>>includeEnd('debug');

    result = Matrix3.clone(matrix, result);
    const startIndex = index * 3;
    result[startIndex] = cartesian.x;
    result[startIndex + 1] = cartesian.y;
    result[startIndex + 2] = cartesian.z;
    return result;
  };

  /**
   * Retrieves a copy of the matrix row at the provided index as a Cartesian3 instance.
   *
   * @param {Matrix3} matrix The matrix to use.
   * @param {Number} index The zero-based index of the row to retrieve.
   * @param {Cartesian3} result The object onto which to store the result.
   * @returns {Cartesian3} The modified result parameter.
   *
   * @exception {DeveloperError} index must be 0, 1, or 2.
   */
  Matrix3.getRow = function (matrix, index, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("matrix", matrix);
    Check.Check.typeOf.number.greaterThanOrEquals("index", index, 0);
    Check.Check.typeOf.number.lessThanOrEquals("index", index, 2);
    Check.Check.typeOf.object("result", result);
    //>>includeEnd('debug');

    const x = matrix[index];
    const y = matrix[index + 3];
    const z = matrix[index + 6];

    result.x = x;
    result.y = y;
    result.z = z;
    return result;
  };

  /**
   * Computes a new matrix that replaces the specified row in the provided matrix with the provided Cartesian3 instance.
   *
   * @param {Matrix3} matrix The matrix to use.
   * @param {Number} index The zero-based index of the row to set.
   * @param {Cartesian3} cartesian The Cartesian whose values will be assigned to the specified row.
   * @param {Matrix3} result The object onto which to store the result.
   * @returns {Matrix3} The modified result parameter.
   *
   * @exception {DeveloperError} index must be 0, 1, or 2.
   */
  Matrix3.setRow = function (matrix, index, cartesian, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("matrix", matrix);
    Check.Check.typeOf.number.greaterThanOrEquals("index", index, 0);
    Check.Check.typeOf.number.lessThanOrEquals("index", index, 2);
    Check.Check.typeOf.object("cartesian", cartesian);
    Check.Check.typeOf.object("result", result);
    //>>includeEnd('debug');

    result = Matrix3.clone(matrix, result);
    result[index] = cartesian.x;
    result[index + 3] = cartesian.y;
    result[index + 6] = cartesian.z;
    return result;
  };

  const scaleScratch1$2 = new Cartesian3.Cartesian3();

  /**
   * Computes a new matrix that replaces the scale with the provided scale.
   * This assumes the matrix is an affine transformation.
   *
   * @param {Matrix3} matrix The matrix to use.
   * @param {Cartesian3} scale The scale that replaces the scale of the provided matrix.
   * @param {Matrix3} result The object onto which to store the result.
   * @returns {Matrix3} The modified result parameter.
   *
   * @see Matrix3.setUniformScale
   * @see Matrix3.fromScale
   * @see Matrix3.fromUniformScale
   * @see Matrix3.multiplyByScale
   * @see Matrix3.multiplyByUniformScale
   * @see Matrix3.getScale
   */
  Matrix3.setScale = function (matrix, scale, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("matrix", matrix);
    Check.Check.typeOf.object("scale", scale);
    Check.Check.typeOf.object("result", result);
    //>>includeEnd('debug');

    const existingScale = Matrix3.getScale(matrix, scaleScratch1$2);
    const scaleRatioX = scale.x / existingScale.x;
    const scaleRatioY = scale.y / existingScale.y;
    const scaleRatioZ = scale.z / existingScale.z;

    result[0] = matrix[0] * scaleRatioX;
    result[1] = matrix[1] * scaleRatioX;
    result[2] = matrix[2] * scaleRatioX;
    result[3] = matrix[3] * scaleRatioY;
    result[4] = matrix[4] * scaleRatioY;
    result[5] = matrix[5] * scaleRatioY;
    result[6] = matrix[6] * scaleRatioZ;
    result[7] = matrix[7] * scaleRatioZ;
    result[8] = matrix[8] * scaleRatioZ;

    return result;
  };

  const scaleScratch2$2 = new Cartesian3.Cartesian3();

  /**
   * Computes a new matrix that replaces the scale with the provided uniform scale.
   * This assumes the matrix is an affine transformation.
   *
   * @param {Matrix3} matrix The matrix to use.
   * @param {Number} scale The uniform scale that replaces the scale of the provided matrix.
   * @param {Matrix3} result The object onto which to store the result.
   * @returns {Matrix3} The modified result parameter.
   *
   * @see Matrix3.setScale
   * @see Matrix3.fromScale
   * @see Matrix3.fromUniformScale
   * @see Matrix3.multiplyByScale
   * @see Matrix3.multiplyByUniformScale
   * @see Matrix3.getScale
   */
  Matrix3.setUniformScale = function (matrix, scale, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("matrix", matrix);
    Check.Check.typeOf.number("scale", scale);
    Check.Check.typeOf.object("result", result);
    //>>includeEnd('debug');

    const existingScale = Matrix3.getScale(matrix, scaleScratch2$2);
    const scaleRatioX = scale / existingScale.x;
    const scaleRatioY = scale / existingScale.y;
    const scaleRatioZ = scale / existingScale.z;

    result[0] = matrix[0] * scaleRatioX;
    result[1] = matrix[1] * scaleRatioX;
    result[2] = matrix[2] * scaleRatioX;
    result[3] = matrix[3] * scaleRatioY;
    result[4] = matrix[4] * scaleRatioY;
    result[5] = matrix[5] * scaleRatioY;
    result[6] = matrix[6] * scaleRatioZ;
    result[7] = matrix[7] * scaleRatioZ;
    result[8] = matrix[8] * scaleRatioZ;

    return result;
  };

  const scratchColumn$2 = new Cartesian3.Cartesian3();

  /**
   * Extracts the non-uniform scale assuming the matrix is an affine transformation.
   *
   * @param {Matrix3} matrix The matrix.
   * @param {Cartesian3} result The object onto which to store the result.
   * @returns {Cartesian3} The modified result parameter.
   *
   * @see Matrix3.multiplyByScale
   * @see Matrix3.multiplyByUniformScale
   * @see Matrix3.fromScale
   * @see Matrix3.fromUniformScale
   * @see Matrix3.setScale
   * @see Matrix3.setUniformScale
   */
  Matrix3.getScale = function (matrix, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("matrix", matrix);
    Check.Check.typeOf.object("result", result);
    //>>includeEnd('debug');

    result.x = Cartesian3.Cartesian3.magnitude(
      Cartesian3.Cartesian3.fromElements(matrix[0], matrix[1], matrix[2], scratchColumn$2)
    );
    result.y = Cartesian3.Cartesian3.magnitude(
      Cartesian3.Cartesian3.fromElements(matrix[3], matrix[4], matrix[5], scratchColumn$2)
    );
    result.z = Cartesian3.Cartesian3.magnitude(
      Cartesian3.Cartesian3.fromElements(matrix[6], matrix[7], matrix[8], scratchColumn$2)
    );
    return result;
  };

  const scaleScratch3$2 = new Cartesian3.Cartesian3();

  /**
   * Computes the maximum scale assuming the matrix is an affine transformation.
   * The maximum scale is the maximum length of the column vectors.
   *
   * @param {Matrix3} matrix The matrix.
   * @returns {Number} The maximum scale.
   */
  Matrix3.getMaximumScale = function (matrix) {
    Matrix3.getScale(matrix, scaleScratch3$2);
    return Cartesian3.Cartesian3.maximumComponent(scaleScratch3$2);
  };

  const scaleScratch4$2 = new Cartesian3.Cartesian3();

  /**
   * Sets the rotation assuming the matrix is an affine transformation.
   *
   * @param {Matrix3} matrix The matrix.
   * @param {Matrix3} rotation The rotation matrix.
   * @returns {Matrix3} The modified result parameter.
   *
   * @see Matrix3.getRotation
   */
  Matrix3.setRotation = function (matrix, rotation, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("matrix", matrix);
    Check.Check.typeOf.object("result", result);
    //>>includeEnd('debug');

    const scale = Matrix3.getScale(matrix, scaleScratch4$2);

    result[0] = rotation[0] * scale.x;
    result[1] = rotation[1] * scale.x;
    result[2] = rotation[2] * scale.x;
    result[3] = rotation[3] * scale.y;
    result[4] = rotation[4] * scale.y;
    result[5] = rotation[5] * scale.y;
    result[6] = rotation[6] * scale.z;
    result[7] = rotation[7] * scale.z;
    result[8] = rotation[8] * scale.z;

    return result;
  };

  const scaleScratch5$2 = new Cartesian3.Cartesian3();

  /**
   * Extracts the rotation matrix assuming the matrix is an affine transformation.
   *
   * @param {Matrix3} matrix The matrix.
   * @param {Matrix3} result The object onto which to store the result.
   * @returns {Matrix3} The modified result parameter.
   *
   * @see Matrix3.setRotation
   */
  Matrix3.getRotation = function (matrix, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("matrix", matrix);
    Check.Check.typeOf.object("result", result);
    //>>includeEnd('debug');

    const scale = Matrix3.getScale(matrix, scaleScratch5$2);

    result[0] = matrix[0] / scale.x;
    result[1] = matrix[1] / scale.x;
    result[2] = matrix[2] / scale.x;
    result[3] = matrix[3] / scale.y;
    result[4] = matrix[4] / scale.y;
    result[5] = matrix[5] / scale.y;
    result[6] = matrix[6] / scale.z;
    result[7] = matrix[7] / scale.z;
    result[8] = matrix[8] / scale.z;

    return result;
  };

  /**
   * Computes the product of two matrices.
   *
   * @param {Matrix3} left The first matrix.
   * @param {Matrix3} right The second matrix.
   * @param {Matrix3} result The object onto which to store the result.
   * @returns {Matrix3} The modified result parameter.
   */
  Matrix3.multiply = function (left, right, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("left", left);
    Check.Check.typeOf.object("right", right);
    Check.Check.typeOf.object("result", result);
    //>>includeEnd('debug');

    const column0Row0 =
      left[0] * right[0] + left[3] * right[1] + left[6] * right[2];
    const column0Row1 =
      left[1] * right[0] + left[4] * right[1] + left[7] * right[2];
    const column0Row2 =
      left[2] * right[0] + left[5] * right[1] + left[8] * right[2];

    const column1Row0 =
      left[0] * right[3] + left[3] * right[4] + left[6] * right[5];
    const column1Row1 =
      left[1] * right[3] + left[4] * right[4] + left[7] * right[5];
    const column1Row2 =
      left[2] * right[3] + left[5] * right[4] + left[8] * right[5];

    const column2Row0 =
      left[0] * right[6] + left[3] * right[7] + left[6] * right[8];
    const column2Row1 =
      left[1] * right[6] + left[4] * right[7] + left[7] * right[8];
    const column2Row2 =
      left[2] * right[6] + left[5] * right[7] + left[8] * right[8];

    result[0] = column0Row0;
    result[1] = column0Row1;
    result[2] = column0Row2;
    result[3] = column1Row0;
    result[4] = column1Row1;
    result[5] = column1Row2;
    result[6] = column2Row0;
    result[7] = column2Row1;
    result[8] = column2Row2;
    return result;
  };

  /**
   * Computes the sum of two matrices.
   *
   * @param {Matrix3} left The first matrix.
   * @param {Matrix3} right The second matrix.
   * @param {Matrix3} result The object onto which to store the result.
   * @returns {Matrix3} The modified result parameter.
   */
  Matrix3.add = function (left, right, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("left", left);
    Check.Check.typeOf.object("right", right);
    Check.Check.typeOf.object("result", result);
    //>>includeEnd('debug');

    result[0] = left[0] + right[0];
    result[1] = left[1] + right[1];
    result[2] = left[2] + right[2];
    result[3] = left[3] + right[3];
    result[4] = left[4] + right[4];
    result[5] = left[5] + right[5];
    result[6] = left[6] + right[6];
    result[7] = left[7] + right[7];
    result[8] = left[8] + right[8];
    return result;
  };

  /**
   * Computes the difference of two matrices.
   *
   * @param {Matrix3} left The first matrix.
   * @param {Matrix3} right The second matrix.
   * @param {Matrix3} result The object onto which to store the result.
   * @returns {Matrix3} The modified result parameter.
   */
  Matrix3.subtract = function (left, right, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("left", left);
    Check.Check.typeOf.object("right", right);
    Check.Check.typeOf.object("result", result);
    //>>includeEnd('debug');

    result[0] = left[0] - right[0];
    result[1] = left[1] - right[1];
    result[2] = left[2] - right[2];
    result[3] = left[3] - right[3];
    result[4] = left[4] - right[4];
    result[5] = left[5] - right[5];
    result[6] = left[6] - right[6];
    result[7] = left[7] - right[7];
    result[8] = left[8] - right[8];
    return result;
  };

  /**
   * Computes the product of a matrix and a column vector.
   *
   * @param {Matrix3} matrix The matrix.
   * @param {Cartesian3} cartesian The column.
   * @param {Cartesian3} result The object onto which to store the result.
   * @returns {Cartesian3} The modified result parameter.
   */
  Matrix3.multiplyByVector = function (matrix, cartesian, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("matrix", matrix);
    Check.Check.typeOf.object("cartesian", cartesian);
    Check.Check.typeOf.object("result", result);
    //>>includeEnd('debug');

    const vX = cartesian.x;
    const vY = cartesian.y;
    const vZ = cartesian.z;

    const x = matrix[0] * vX + matrix[3] * vY + matrix[6] * vZ;
    const y = matrix[1] * vX + matrix[4] * vY + matrix[7] * vZ;
    const z = matrix[2] * vX + matrix[5] * vY + matrix[8] * vZ;

    result.x = x;
    result.y = y;
    result.z = z;
    return result;
  };

  /**
   * Computes the product of a matrix and a scalar.
   *
   * @param {Matrix3} matrix The matrix.
   * @param {Number} scalar The number to multiply by.
   * @param {Matrix3} result The object onto which to store the result.
   * @returns {Matrix3} The modified result parameter.
   */
  Matrix3.multiplyByScalar = function (matrix, scalar, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("matrix", matrix);
    Check.Check.typeOf.number("scalar", scalar);
    Check.Check.typeOf.object("result", result);
    //>>includeEnd('debug');

    result[0] = matrix[0] * scalar;
    result[1] = matrix[1] * scalar;
    result[2] = matrix[2] * scalar;
    result[3] = matrix[3] * scalar;
    result[4] = matrix[4] * scalar;
    result[5] = matrix[5] * scalar;
    result[6] = matrix[6] * scalar;
    result[7] = matrix[7] * scalar;
    result[8] = matrix[8] * scalar;
    return result;
  };

  /**
   * Computes the product of a matrix times a (non-uniform) scale, as if the scale were a scale matrix.
   *
   * @param {Matrix3} matrix The matrix on the left-hand side.
   * @param {Number} scale The non-uniform scale on the right-hand side.
   * @param {Matrix3} result The object onto which to store the result.
   * @returns {Matrix3} The modified result parameter.
   *
   *
   * @example
   * // Instead of Cesium.Matrix3.multiply(m, Cesium.Matrix3.fromScale(scale), m);
   * Cesium.Matrix3.multiplyByScale(m, scale, m);
   *
   * @see Matrix3.multiplyByUniformScale
   * @see Matrix3.fromScale
   * @see Matrix3.fromUniformScale
   * @see Matrix3.setScale
   * @see Matrix3.setUniformScale
   * @see Matrix3.getScale
   */
  Matrix3.multiplyByScale = function (matrix, scale, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("matrix", matrix);
    Check.Check.typeOf.object("scale", scale);
    Check.Check.typeOf.object("result", result);
    //>>includeEnd('debug');

    result[0] = matrix[0] * scale.x;
    result[1] = matrix[1] * scale.x;
    result[2] = matrix[2] * scale.x;
    result[3] = matrix[3] * scale.y;
    result[4] = matrix[4] * scale.y;
    result[5] = matrix[5] * scale.y;
    result[6] = matrix[6] * scale.z;
    result[7] = matrix[7] * scale.z;
    result[8] = matrix[8] * scale.z;

    return result;
  };

  /**
   * Computes the product of a matrix times a uniform scale, as if the scale were a scale matrix.
   *
   * @param {Matrix3} matrix The matrix on the left-hand side.
   * @param {Number} scale The uniform scale on the right-hand side.
   * @param {Matrix3} result The object onto which to store the result.
   * @returns {Matrix3} The modified result parameter.
   *
   * @example
   * // Instead of Cesium.Matrix3.multiply(m, Cesium.Matrix3.fromUniformScale(scale), m);
   * Cesium.Matrix3.multiplyByUniformScale(m, scale, m);
   *
   * @see Matrix3.multiplyByScale
   * @see Matrix3.fromScale
   * @see Matrix3.fromUniformScale
   * @see Matrix3.setScale
   * @see Matrix3.setUniformScale
   * @see Matrix3.getScale
   */
  Matrix3.multiplyByUniformScale = function (matrix, scale, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("matrix", matrix);
    Check.Check.typeOf.number("scale", scale);
    Check.Check.typeOf.object("result", result);
    //>>includeEnd('debug');

    result[0] = matrix[0] * scale;
    result[1] = matrix[1] * scale;
    result[2] = matrix[2] * scale;
    result[3] = matrix[3] * scale;
    result[4] = matrix[4] * scale;
    result[5] = matrix[5] * scale;
    result[6] = matrix[6] * scale;
    result[7] = matrix[7] * scale;
    result[8] = matrix[8] * scale;

    return result;
  };

  /**
   * Creates a negated copy of the provided matrix.
   *
   * @param {Matrix3} matrix The matrix to negate.
   * @param {Matrix3} result The object onto which to store the result.
   * @returns {Matrix3} The modified result parameter.
   */
  Matrix3.negate = function (matrix, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("matrix", matrix);
    Check.Check.typeOf.object("result", result);
    //>>includeEnd('debug');

    result[0] = -matrix[0];
    result[1] = -matrix[1];
    result[2] = -matrix[2];
    result[3] = -matrix[3];
    result[4] = -matrix[4];
    result[5] = -matrix[5];
    result[6] = -matrix[6];
    result[7] = -matrix[7];
    result[8] = -matrix[8];
    return result;
  };

  /**
   * Computes the transpose of the provided matrix.
   *
   * @param {Matrix3} matrix The matrix to transpose.
   * @param {Matrix3} result The object onto which to store the result.
   * @returns {Matrix3} The modified result parameter.
   */
  Matrix3.transpose = function (matrix, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("matrix", matrix);
    Check.Check.typeOf.object("result", result);
    //>>includeEnd('debug');

    const column0Row0 = matrix[0];
    const column0Row1 = matrix[3];
    const column0Row2 = matrix[6];
    const column1Row0 = matrix[1];
    const column1Row1 = matrix[4];
    const column1Row2 = matrix[7];
    const column2Row0 = matrix[2];
    const column2Row1 = matrix[5];
    const column2Row2 = matrix[8];

    result[0] = column0Row0;
    result[1] = column0Row1;
    result[2] = column0Row2;
    result[3] = column1Row0;
    result[4] = column1Row1;
    result[5] = column1Row2;
    result[6] = column2Row0;
    result[7] = column2Row1;
    result[8] = column2Row2;
    return result;
  };

  function computeFrobeniusNorm(matrix) {
    let norm = 0.0;
    for (let i = 0; i < 9; ++i) {
      const temp = matrix[i];
      norm += temp * temp;
    }

    return Math.sqrt(norm);
  }

  const rowVal = [1, 0, 0];
  const colVal = [2, 2, 1];

  function offDiagonalFrobeniusNorm(matrix) {
    // Computes the "off-diagonal" Frobenius norm.
    // Assumes matrix is symmetric.

    let norm = 0.0;
    for (let i = 0; i < 3; ++i) {
      const temp = matrix[Matrix3.getElementIndex(colVal[i], rowVal[i])];
      norm += 2.0 * temp * temp;
    }

    return Math.sqrt(norm);
  }

  function shurDecomposition(matrix, result) {
    // This routine was created based upon Matrix Computations, 3rd ed., by Golub and Van Loan,
    // section 8.4.2 The 2by2 Symmetric Schur Decomposition.
    //
    // The routine takes a matrix, which is assumed to be symmetric, and
    // finds the largest off-diagonal term, and then creates
    // a matrix (result) which can be used to help reduce it

    const tolerance = Math$1.CesiumMath.EPSILON15;

    let maxDiagonal = 0.0;
    let rotAxis = 1;

    // find pivot (rotAxis) based on max diagonal of matrix
    for (let i = 0; i < 3; ++i) {
      const temp = Math.abs(
        matrix[Matrix3.getElementIndex(colVal[i], rowVal[i])]
      );
      if (temp > maxDiagonal) {
        rotAxis = i;
        maxDiagonal = temp;
      }
    }

    let c = 1.0;
    let s = 0.0;

    const p = rowVal[rotAxis];
    const q = colVal[rotAxis];

    if (Math.abs(matrix[Matrix3.getElementIndex(q, p)]) > tolerance) {
      const qq = matrix[Matrix3.getElementIndex(q, q)];
      const pp = matrix[Matrix3.getElementIndex(p, p)];
      const qp = matrix[Matrix3.getElementIndex(q, p)];

      const tau = (qq - pp) / 2.0 / qp;
      let t;

      if (tau < 0.0) {
        t = -1.0 / (-tau + Math.sqrt(1.0 + tau * tau));
      } else {
        t = 1.0 / (tau + Math.sqrt(1.0 + tau * tau));
      }

      c = 1.0 / Math.sqrt(1.0 + t * t);
      s = t * c;
    }

    result = Matrix3.clone(Matrix3.IDENTITY, result);

    result[Matrix3.getElementIndex(p, p)] = result[
      Matrix3.getElementIndex(q, q)
    ] = c;
    result[Matrix3.getElementIndex(q, p)] = s;
    result[Matrix3.getElementIndex(p, q)] = -s;

    return result;
  }

  const jMatrix = new Matrix3();
  const jMatrixTranspose = new Matrix3();

  /**
   * Computes the eigenvectors and eigenvalues of a symmetric matrix.
   * <p>
   * Returns a diagonal matrix and unitary matrix such that:
   * <code>matrix = unitary matrix * diagonal matrix * transpose(unitary matrix)</code>
   * </p>
   * <p>
   * The values along the diagonal of the diagonal matrix are the eigenvalues. The columns
   * of the unitary matrix are the corresponding eigenvectors.
   * </p>
   *
   * @param {Matrix3} matrix The matrix to decompose into diagonal and unitary matrix. Expected to be symmetric.
   * @param {Object} [result] An object with unitary and diagonal properties which are matrices onto which to store the result.
   * @returns {Object} An object with unitary and diagonal properties which are the unitary and diagonal matrices, respectively.
   *
   * @example
   * const a = //... symetric matrix
   * const result = {
   *     unitary : new Cesium.Matrix3(),
   *     diagonal : new Cesium.Matrix3()
   * };
   * Cesium.Matrix3.computeEigenDecomposition(a, result);
   *
   * const unitaryTranspose = Cesium.Matrix3.transpose(result.unitary, new Cesium.Matrix3());
   * const b = Cesium.Matrix3.multiply(result.unitary, result.diagonal, new Cesium.Matrix3());
   * Cesium.Matrix3.multiply(b, unitaryTranspose, b); // b is now equal to a
   *
   * const lambda = Cesium.Matrix3.getColumn(result.diagonal, 0, new Cesium.Cartesian3()).x;  // first eigenvalue
   * const v = Cesium.Matrix3.getColumn(result.unitary, 0, new Cesium.Cartesian3());          // first eigenvector
   * const c = Cesium.Cartesian3.multiplyByScalar(v, lambda, new Cesium.Cartesian3());        // equal to Cesium.Matrix3.multiplyByVector(a, v)
   */
  Matrix3.computeEigenDecomposition = function (matrix, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("matrix", matrix);
    //>>includeEnd('debug');

    // This routine was created based upon Matrix Computations, 3rd ed., by Golub and Van Loan,
    // section 8.4.3 The Classical Jacobi Algorithm

    const tolerance = Math$1.CesiumMath.EPSILON20;
    const maxSweeps = 10;

    let count = 0;
    let sweep = 0;

    if (!defined.defined(result)) {
      result = {};
    }

    const unitaryMatrix = (result.unitary = Matrix3.clone(
      Matrix3.IDENTITY,
      result.unitary
    ));
    const diagMatrix = (result.diagonal = Matrix3.clone(matrix, result.diagonal));

    const epsilon = tolerance * computeFrobeniusNorm(diagMatrix);

    while (sweep < maxSweeps && offDiagonalFrobeniusNorm(diagMatrix) > epsilon) {
      shurDecomposition(diagMatrix, jMatrix);
      Matrix3.transpose(jMatrix, jMatrixTranspose);
      Matrix3.multiply(diagMatrix, jMatrix, diagMatrix);
      Matrix3.multiply(jMatrixTranspose, diagMatrix, diagMatrix);
      Matrix3.multiply(unitaryMatrix, jMatrix, unitaryMatrix);

      if (++count > 2) {
        ++sweep;
        count = 0;
      }
    }

    return result;
  };

  /**
   * Computes a matrix, which contains the absolute (unsigned) values of the provided matrix's elements.
   *
   * @param {Matrix3} matrix The matrix with signed elements.
   * @param {Matrix3} result The object onto which to store the result.
   * @returns {Matrix3} The modified result parameter.
   */
  Matrix3.abs = function (matrix, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("matrix", matrix);
    Check.Check.typeOf.object("result", result);
    //>>includeEnd('debug');

    result[0] = Math.abs(matrix[0]);
    result[1] = Math.abs(matrix[1]);
    result[2] = Math.abs(matrix[2]);
    result[3] = Math.abs(matrix[3]);
    result[4] = Math.abs(matrix[4]);
    result[5] = Math.abs(matrix[5]);
    result[6] = Math.abs(matrix[6]);
    result[7] = Math.abs(matrix[7]);
    result[8] = Math.abs(matrix[8]);

    return result;
  };

  /**
   * Computes the determinant of the provided matrix.
   *
   * @param {Matrix3} matrix The matrix to use.
   * @returns {Number} The value of the determinant of the matrix.
   */
  Matrix3.determinant = function (matrix) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("matrix", matrix);
    //>>includeEnd('debug');

    const m11 = matrix[0];
    const m21 = matrix[3];
    const m31 = matrix[6];
    const m12 = matrix[1];
    const m22 = matrix[4];
    const m32 = matrix[7];
    const m13 = matrix[2];
    const m23 = matrix[5];
    const m33 = matrix[8];

    return (
      m11 * (m22 * m33 - m23 * m32) +
      m12 * (m23 * m31 - m21 * m33) +
      m13 * (m21 * m32 - m22 * m31)
    );
  };

  /**
   * Computes the inverse of the provided matrix.
   *
   * @param {Matrix3} matrix The matrix to invert.
   * @param {Matrix3} result The object onto which to store the result.
   * @returns {Matrix3} The modified result parameter.
   *
   * @exception {DeveloperError} matrix is not invertible.
   */
  Matrix3.inverse = function (matrix, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("matrix", matrix);
    Check.Check.typeOf.object("result", result);
    //>>includeEnd('debug');

    const m11 = matrix[0];
    const m21 = matrix[1];
    const m31 = matrix[2];
    const m12 = matrix[3];
    const m22 = matrix[4];
    const m32 = matrix[5];
    const m13 = matrix[6];
    const m23 = matrix[7];
    const m33 = matrix[8];

    const determinant = Matrix3.determinant(matrix);

    //>>includeStart('debug', pragmas.debug);
    if (Math.abs(determinant) <= Math$1.CesiumMath.EPSILON15) {
      throw new Check.DeveloperError("matrix is not invertible");
    }
    //>>includeEnd('debug');

    result[0] = m22 * m33 - m23 * m32;
    result[1] = m23 * m31 - m21 * m33;
    result[2] = m21 * m32 - m22 * m31;
    result[3] = m13 * m32 - m12 * m33;
    result[4] = m11 * m33 - m13 * m31;
    result[5] = m12 * m31 - m11 * m32;
    result[6] = m12 * m23 - m13 * m22;
    result[7] = m13 * m21 - m11 * m23;
    result[8] = m11 * m22 - m12 * m21;

    const scale = 1.0 / determinant;
    return Matrix3.multiplyByScalar(result, scale, result);
  };

  const scratchTransposeMatrix$1 = new Matrix3();

  /**
   * Computes the inverse transpose of a matrix.
   *
   * @param {Matrix3} matrix The matrix to transpose and invert.
   * @param {Matrix3} result The object onto which to store the result.
   * @returns {Matrix3} The modified result parameter.
   */
  Matrix3.inverseTranspose = function (matrix, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("matrix", matrix);
    Check.Check.typeOf.object("result", result);
    //>>includeEnd('debug');

    return Matrix3.inverse(
      Matrix3.transpose(matrix, scratchTransposeMatrix$1),
      result
    );
  };

  /**
   * Compares the provided matrices componentwise and returns
   * <code>true</code> if they are equal, <code>false</code> otherwise.
   *
   * @param {Matrix3} [left] The first matrix.
   * @param {Matrix3} [right] The second matrix.
   * @returns {Boolean} <code>true</code> if left and right are equal, <code>false</code> otherwise.
   */
  Matrix3.equals = function (left, right) {
    return (
      left === right ||
      (defined.defined(left) &&
        defined.defined(right) &&
        left[0] === right[0] &&
        left[1] === right[1] &&
        left[2] === right[2] &&
        left[3] === right[3] &&
        left[4] === right[4] &&
        left[5] === right[5] &&
        left[6] === right[6] &&
        left[7] === right[7] &&
        left[8] === right[8])
    );
  };

  /**
   * Compares the provided matrices componentwise and returns
   * <code>true</code> if they are within the provided epsilon,
   * <code>false</code> otherwise.
   *
   * @param {Matrix3} [left] The first matrix.
   * @param {Matrix3} [right] The second matrix.
   * @param {Number} [epsilon=0] The epsilon to use for equality testing.
   * @returns {Boolean} <code>true</code> if left and right are within the provided epsilon, <code>false</code> otherwise.
   */
  Matrix3.equalsEpsilon = function (left, right, epsilon) {
    epsilon = defined.defaultValue(epsilon, 0);

    return (
      left === right ||
      (defined.defined(left) &&
        defined.defined(right) &&
        Math.abs(left[0] - right[0]) <= epsilon &&
        Math.abs(left[1] - right[1]) <= epsilon &&
        Math.abs(left[2] - right[2]) <= epsilon &&
        Math.abs(left[3] - right[3]) <= epsilon &&
        Math.abs(left[4] - right[4]) <= epsilon &&
        Math.abs(left[5] - right[5]) <= epsilon &&
        Math.abs(left[6] - right[6]) <= epsilon &&
        Math.abs(left[7] - right[7]) <= epsilon &&
        Math.abs(left[8] - right[8]) <= epsilon)
    );
  };

  /**
   * An immutable Matrix3 instance initialized to the identity matrix.
   *
   * @type {Matrix3}
   * @constant
   */
  Matrix3.IDENTITY = Object.freeze(
    new Matrix3(1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0)
  );

  /**
   * An immutable Matrix3 instance initialized to the zero matrix.
   *
   * @type {Matrix3}
   * @constant
   */
  Matrix3.ZERO = Object.freeze(
    new Matrix3(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0)
  );

  /**
   * The index into Matrix3 for column 0, row 0.
   *
   * @type {Number}
   * @constant
   */
  Matrix3.COLUMN0ROW0 = 0;

  /**
   * The index into Matrix3 for column 0, row 1.
   *
   * @type {Number}
   * @constant
   */
  Matrix3.COLUMN0ROW1 = 1;

  /**
   * The index into Matrix3 for column 0, row 2.
   *
   * @type {Number}
   * @constant
   */
  Matrix3.COLUMN0ROW2 = 2;

  /**
   * The index into Matrix3 for column 1, row 0.
   *
   * @type {Number}
   * @constant
   */
  Matrix3.COLUMN1ROW0 = 3;

  /**
   * The index into Matrix3 for column 1, row 1.
   *
   * @type {Number}
   * @constant
   */
  Matrix3.COLUMN1ROW1 = 4;

  /**
   * The index into Matrix3 for column 1, row 2.
   *
   * @type {Number}
   * @constant
   */
  Matrix3.COLUMN1ROW2 = 5;

  /**
   * The index into Matrix3 for column 2, row 0.
   *
   * @type {Number}
   * @constant
   */
  Matrix3.COLUMN2ROW0 = 6;

  /**
   * The index into Matrix3 for column 2, row 1.
   *
   * @type {Number}
   * @constant
   */
  Matrix3.COLUMN2ROW1 = 7;

  /**
   * The index into Matrix3 for column 2, row 2.
   *
   * @type {Number}
   * @constant
   */
  Matrix3.COLUMN2ROW2 = 8;

  Object.defineProperties(Matrix3.prototype, {
    /**
     * Gets the number of items in the collection.
     * @memberof Matrix3.prototype
     *
     * @type {Number}
     */
    length: {
      get: function () {
        return Matrix3.packedLength;
      },
    },
  });

  /**
   * Duplicates the provided Matrix3 instance.
   *
   * @param {Matrix3} [result] The object onto which to store the result.
   * @returns {Matrix3} The modified result parameter or a new Matrix3 instance if one was not provided.
   */
  Matrix3.prototype.clone = function (result) {
    return Matrix3.clone(this, result);
  };

  /**
   * Compares this matrix to the provided matrix componentwise and returns
   * <code>true</code> if they are equal, <code>false</code> otherwise.
   *
   * @param {Matrix3} [right] The right hand side matrix.
   * @returns {Boolean} <code>true</code> if they are equal, <code>false</code> otherwise.
   */
  Matrix3.prototype.equals = function (right) {
    return Matrix3.equals(this, right);
  };

  /**
   * @private
   */
  Matrix3.equalsArray = function (matrix, array, offset) {
    return (
      matrix[0] === array[offset] &&
      matrix[1] === array[offset + 1] &&
      matrix[2] === array[offset + 2] &&
      matrix[3] === array[offset + 3] &&
      matrix[4] === array[offset + 4] &&
      matrix[5] === array[offset + 5] &&
      matrix[6] === array[offset + 6] &&
      matrix[7] === array[offset + 7] &&
      matrix[8] === array[offset + 8]
    );
  };

  /**
   * Compares this matrix to the provided matrix componentwise and returns
   * <code>true</code> if they are within the provided epsilon,
   * <code>false</code> otherwise.
   *
   * @param {Matrix3} [right] The right hand side matrix.
   * @param {Number} [epsilon=0] The epsilon to use for equality testing.
   * @returns {Boolean} <code>true</code> if they are within the provided epsilon, <code>false</code> otherwise.
   */
  Matrix3.prototype.equalsEpsilon = function (right, epsilon) {
    return Matrix3.equalsEpsilon(this, right, epsilon);
  };

  /**
   * Creates a string representing this Matrix with each row being
   * on a separate line and in the format '(column0, column1, column2)'.
   *
   * @returns {String} A string representing the provided Matrix with each row being on a separate line and in the format '(column0, column1, column2)'.
   */
  Matrix3.prototype.toString = function () {
    return (
      `(${this[0]}, ${this[3]}, ${this[6]})\n` +
      `(${this[1]}, ${this[4]}, ${this[7]})\n` +
      `(${this[2]}, ${this[5]}, ${this[8]})`
    );
  };

  /**
   * A 4D Cartesian point.
   * @alias Cartesian4
   * @constructor
   *
   * @param {Number} [x=0.0] The X component.
   * @param {Number} [y=0.0] The Y component.
   * @param {Number} [z=0.0] The Z component.
   * @param {Number} [w=0.0] The W component.
   *
   * @see Cartesian2
   * @see Cartesian3
   * @see Packable
   */
  function Cartesian4(x, y, z, w) {
    /**
     * The X component.
     * @type {Number}
     * @default 0.0
     */
    this.x = defined.defaultValue(x, 0.0);

    /**
     * The Y component.
     * @type {Number}
     * @default 0.0
     */
    this.y = defined.defaultValue(y, 0.0);

    /**
     * The Z component.
     * @type {Number}
     * @default 0.0
     */
    this.z = defined.defaultValue(z, 0.0);

    /**
     * The W component.
     * @type {Number}
     * @default 0.0
     */
    this.w = defined.defaultValue(w, 0.0);
  }

  /**
   * Creates a Cartesian4 instance from x, y, z and w coordinates.
   *
   * @param {Number} x The x coordinate.
   * @param {Number} y The y coordinate.
   * @param {Number} z The z coordinate.
   * @param {Number} w The w coordinate.
   * @param {Cartesian4} [result] The object onto which to store the result.
   * @returns {Cartesian4} The modified result parameter or a new Cartesian4 instance if one was not provided.
   */
  Cartesian4.fromElements = function (x, y, z, w, result) {
    if (!defined.defined(result)) {
      return new Cartesian4(x, y, z, w);
    }

    result.x = x;
    result.y = y;
    result.z = z;
    result.w = w;
    return result;
  };

  /**
   * Creates a Cartesian4 instance from a {@link Color}. <code>red</code>, <code>green</code>, <code>blue</code>,
   * and <code>alpha</code> map to <code>x</code>, <code>y</code>, <code>z</code>, and <code>w</code>, respectively.
   *
   * @param {Color} color The source color.
   * @param {Cartesian4} [result] The object onto which to store the result.
   * @returns {Cartesian4} The modified result parameter or a new Cartesian4 instance if one was not provided.
   */
  Cartesian4.fromColor = function (color, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("color", color);
    //>>includeEnd('debug');
    if (!defined.defined(result)) {
      return new Cartesian4(color.red, color.green, color.blue, color.alpha);
    }

    result.x = color.red;
    result.y = color.green;
    result.z = color.blue;
    result.w = color.alpha;
    return result;
  };

  /**
   * Duplicates a Cartesian4 instance.
   *
   * @param {Cartesian4} cartesian The Cartesian to duplicate.
   * @param {Cartesian4} [result] The object onto which to store the result.
   * @returns {Cartesian4} The modified result parameter or a new Cartesian4 instance if one was not provided. (Returns undefined if cartesian is undefined)
   */
  Cartesian4.clone = function (cartesian, result) {
    if (!defined.defined(cartesian)) {
      return undefined;
    }

    if (!defined.defined(result)) {
      return new Cartesian4(cartesian.x, cartesian.y, cartesian.z, cartesian.w);
    }

    result.x = cartesian.x;
    result.y = cartesian.y;
    result.z = cartesian.z;
    result.w = cartesian.w;
    return result;
  };

  /**
   * The number of elements used to pack the object into an array.
   * @type {Number}
   */
  Cartesian4.packedLength = 4;

  /**
   * Stores the provided instance into the provided array.
   *
   * @param {Cartesian4} value The value to pack.
   * @param {Number[]} array The array to pack into.
   * @param {Number} [startingIndex=0] The index into the array at which to start packing the elements.
   *
   * @returns {Number[]} The array that was packed into
   */
  Cartesian4.pack = function (value, array, startingIndex) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("value", value);
    Check.Check.defined("array", array);
    //>>includeEnd('debug');

    startingIndex = defined.defaultValue(startingIndex, 0);

    array[startingIndex++] = value.x;
    array[startingIndex++] = value.y;
    array[startingIndex++] = value.z;
    array[startingIndex] = value.w;

    return array;
  };

  /**
   * Retrieves an instance from a packed array.
   *
   * @param {Number[]} array The packed array.
   * @param {Number} [startingIndex=0] The starting index of the element to be unpacked.
   * @param {Cartesian4} [result] The object into which to store the result.
   * @returns {Cartesian4}  The modified result parameter or a new Cartesian4 instance if one was not provided.
   */
  Cartesian4.unpack = function (array, startingIndex, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.defined("array", array);
    //>>includeEnd('debug');

    startingIndex = defined.defaultValue(startingIndex, 0);

    if (!defined.defined(result)) {
      result = new Cartesian4();
    }
    result.x = array[startingIndex++];
    result.y = array[startingIndex++];
    result.z = array[startingIndex++];
    result.w = array[startingIndex];
    return result;
  };

  /**
   * Flattens an array of Cartesian4s into an array of components.
   *
   * @param {Cartesian4[]} array The array of cartesians to pack.
   * @param {Number[]} [result] The array onto which to store the result. If this is a typed array, it must have array.length * 4 components, else a {@link DeveloperError} will be thrown. If it is a regular array, it will be resized to have (array.length * 4) elements.
   * @returns {Number[]} The packed array.
   */
  Cartesian4.packArray = function (array, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.defined("array", array);
    //>>includeEnd('debug');

    const length = array.length;
    const resultLength = length * 4;
    if (!defined.defined(result)) {
      result = new Array(resultLength);
    } else if (!Array.isArray(result) && result.length !== resultLength) {
      //>>includeStart('debug', pragmas.debug);
      throw new Check.DeveloperError(
        "If result is a typed array, it must have exactly array.length * 4 elements"
      );
      //>>includeEnd('debug');
    } else if (result.length !== resultLength) {
      result.length = resultLength;
    }

    for (let i = 0; i < length; ++i) {
      Cartesian4.pack(array[i], result, i * 4);
    }
    return result;
  };

  /**
   * Unpacks an array of cartesian components into an array of Cartesian4s.
   *
   * @param {Number[]} array The array of components to unpack.
   * @param {Cartesian4[]} [result] The array onto which to store the result.
   * @returns {Cartesian4[]} The unpacked array.
   */
  Cartesian4.unpackArray = function (array, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.defined("array", array);
    Check.Check.typeOf.number.greaterThanOrEquals("array.length", array.length, 4);
    if (array.length % 4 !== 0) {
      throw new Check.DeveloperError("array length must be a multiple of 4.");
    }
    //>>includeEnd('debug');

    const length = array.length;
    if (!defined.defined(result)) {
      result = new Array(length / 4);
    } else {
      result.length = length / 4;
    }

    for (let i = 0; i < length; i += 4) {
      const index = i / 4;
      result[index] = Cartesian4.unpack(array, i, result[index]);
    }
    return result;
  };

  /**
   * Creates a Cartesian4 from four consecutive elements in an array.
   * @function
   *
   * @param {Number[]} array The array whose four consecutive elements correspond to the x, y, z, and w components, respectively.
   * @param {Number} [startingIndex=0] The offset into the array of the first element, which corresponds to the x component.
   * @param {Cartesian4} [result] The object onto which to store the result.
   * @returns {Cartesian4}  The modified result parameter or a new Cartesian4 instance if one was not provided.
   *
   * @example
   * // Create a Cartesian4 with (1.0, 2.0, 3.0, 4.0)
   * const v = [1.0, 2.0, 3.0, 4.0];
   * const p = Cesium.Cartesian4.fromArray(v);
   *
   * // Create a Cartesian4 with (1.0, 2.0, 3.0, 4.0) using an offset into an array
   * const v2 = [0.0, 0.0, 1.0, 2.0, 3.0, 4.0];
   * const p2 = Cesium.Cartesian4.fromArray(v2, 2);
   */
  Cartesian4.fromArray = Cartesian4.unpack;

  /**
   * Computes the value of the maximum component for the supplied Cartesian.
   *
   * @param {Cartesian4} cartesian The cartesian to use.
   * @returns {Number} The value of the maximum component.
   */
  Cartesian4.maximumComponent = function (cartesian) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("cartesian", cartesian);
    //>>includeEnd('debug');

    return Math.max(cartesian.x, cartesian.y, cartesian.z, cartesian.w);
  };

  /**
   * Computes the value of the minimum component for the supplied Cartesian.
   *
   * @param {Cartesian4} cartesian The cartesian to use.
   * @returns {Number} The value of the minimum component.
   */
  Cartesian4.minimumComponent = function (cartesian) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("cartesian", cartesian);
    //>>includeEnd('debug');

    return Math.min(cartesian.x, cartesian.y, cartesian.z, cartesian.w);
  };

  /**
   * Compares two Cartesians and computes a Cartesian which contains the minimum components of the supplied Cartesians.
   *
   * @param {Cartesian4} first A cartesian to compare.
   * @param {Cartesian4} second A cartesian to compare.
   * @param {Cartesian4} result The object into which to store the result.
   * @returns {Cartesian4} A cartesian with the minimum components.
   */
  Cartesian4.minimumByComponent = function (first, second, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("first", first);
    Check.Check.typeOf.object("second", second);
    Check.Check.typeOf.object("result", result);
    //>>includeEnd('debug');

    result.x = Math.min(first.x, second.x);
    result.y = Math.min(first.y, second.y);
    result.z = Math.min(first.z, second.z);
    result.w = Math.min(first.w, second.w);

    return result;
  };

  /**
   * Compares two Cartesians and computes a Cartesian which contains the maximum components of the supplied Cartesians.
   *
   * @param {Cartesian4} first A cartesian to compare.
   * @param {Cartesian4} second A cartesian to compare.
   * @param {Cartesian4} result The object into which to store the result.
   * @returns {Cartesian4} A cartesian with the maximum components.
   */
  Cartesian4.maximumByComponent = function (first, second, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("first", first);
    Check.Check.typeOf.object("second", second);
    Check.Check.typeOf.object("result", result);
    //>>includeEnd('debug');

    result.x = Math.max(first.x, second.x);
    result.y = Math.max(first.y, second.y);
    result.z = Math.max(first.z, second.z);
    result.w = Math.max(first.w, second.w);

    return result;
  };

  /**
   * Constrain a value to lie between two values.
   *
   * @param {Cartesian4} value The value to clamp.
   * @param {Cartesian4} min The minimum bound.
   * @param {Cartesian4} max The maximum bound.
   * @param {Cartesian4} result The object into which to store the result.
   * @returns {Cartesian4} The clamped value such that min <= result <= max.
   */
  Cartesian4.clamp = function (value, min, max, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("value", value);
    Check.Check.typeOf.object("min", min);
    Check.Check.typeOf.object("max", max);
    Check.Check.typeOf.object("result", result);
    //>>includeEnd('debug');

    const x = Math$1.CesiumMath.clamp(value.x, min.x, max.x);
    const y = Math$1.CesiumMath.clamp(value.y, min.y, max.y);
    const z = Math$1.CesiumMath.clamp(value.z, min.z, max.z);
    const w = Math$1.CesiumMath.clamp(value.w, min.w, max.w);

    result.x = x;
    result.y = y;
    result.z = z;
    result.w = w;

    return result;
  };

  /**
   * Computes the provided Cartesian's squared magnitude.
   *
   * @param {Cartesian4} cartesian The Cartesian instance whose squared magnitude is to be computed.
   * @returns {Number} The squared magnitude.
   */
  Cartesian4.magnitudeSquared = function (cartesian) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("cartesian", cartesian);
    //>>includeEnd('debug');

    return (
      cartesian.x * cartesian.x +
      cartesian.y * cartesian.y +
      cartesian.z * cartesian.z +
      cartesian.w * cartesian.w
    );
  };

  /**
   * Computes the Cartesian's magnitude (length).
   *
   * @param {Cartesian4} cartesian The Cartesian instance whose magnitude is to be computed.
   * @returns {Number} The magnitude.
   */
  Cartesian4.magnitude = function (cartesian) {
    return Math.sqrt(Cartesian4.magnitudeSquared(cartesian));
  };

  const distanceScratch = new Cartesian4();

  /**
   * Computes the 4-space distance between two points.
   *
   * @param {Cartesian4} left The first point to compute the distance from.
   * @param {Cartesian4} right The second point to compute the distance to.
   * @returns {Number} The distance between two points.
   *
   * @example
   * // Returns 1.0
   * const d = Cesium.Cartesian4.distance(
   *   new Cesium.Cartesian4(1.0, 0.0, 0.0, 0.0),
   *   new Cesium.Cartesian4(2.0, 0.0, 0.0, 0.0));
   */
  Cartesian4.distance = function (left, right) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("left", left);
    Check.Check.typeOf.object("right", right);
    //>>includeEnd('debug');

    Cartesian4.subtract(left, right, distanceScratch);
    return Cartesian4.magnitude(distanceScratch);
  };

  /**
   * Computes the squared distance between two points.  Comparing squared distances
   * using this function is more efficient than comparing distances using {@link Cartesian4#distance}.
   *
   * @param {Cartesian4} left The first point to compute the distance from.
   * @param {Cartesian4} right The second point to compute the distance to.
   * @returns {Number} The distance between two points.
   *
   * @example
   * // Returns 4.0, not 2.0
   * const d = Cesium.Cartesian4.distance(
   *   new Cesium.Cartesian4(1.0, 0.0, 0.0, 0.0),
   *   new Cesium.Cartesian4(3.0, 0.0, 0.0, 0.0));
   */
  Cartesian4.distanceSquared = function (left, right) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("left", left);
    Check.Check.typeOf.object("right", right);
    //>>includeEnd('debug');

    Cartesian4.subtract(left, right, distanceScratch);
    return Cartesian4.magnitudeSquared(distanceScratch);
  };

  /**
   * Computes the normalized form of the supplied Cartesian.
   *
   * @param {Cartesian4} cartesian The Cartesian to be normalized.
   * @param {Cartesian4} result The object onto which to store the result.
   * @returns {Cartesian4} The modified result parameter.
   */
  Cartesian4.normalize = function (cartesian, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("cartesian", cartesian);
    Check.Check.typeOf.object("result", result);
    //>>includeEnd('debug');

    const magnitude = Cartesian4.magnitude(cartesian);

    result.x = cartesian.x / magnitude;
    result.y = cartesian.y / magnitude;
    result.z = cartesian.z / magnitude;
    result.w = cartesian.w / magnitude;

    //>>includeStart('debug', pragmas.debug);
    if (
      isNaN(result.x) ||
      isNaN(result.y) ||
      isNaN(result.z) ||
      isNaN(result.w)
    ) {
      throw new Check.DeveloperError("normalized result is not a number");
    }
    //>>includeEnd('debug');

    return result;
  };

  /**
   * Computes the dot (scalar) product of two Cartesians.
   *
   * @param {Cartesian4} left The first Cartesian.
   * @param {Cartesian4} right The second Cartesian.
   * @returns {Number} The dot product.
   */
  Cartesian4.dot = function (left, right) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("left", left);
    Check.Check.typeOf.object("right", right);
    //>>includeEnd('debug');

    return (
      left.x * right.x + left.y * right.y + left.z * right.z + left.w * right.w
    );
  };

  /**
   * Computes the componentwise product of two Cartesians.
   *
   * @param {Cartesian4} left The first Cartesian.
   * @param {Cartesian4} right The second Cartesian.
   * @param {Cartesian4} result The object onto which to store the result.
   * @returns {Cartesian4} The modified result parameter.
   */
  Cartesian4.multiplyComponents = function (left, right, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("left", left);
    Check.Check.typeOf.object("right", right);
    Check.Check.typeOf.object("result", result);
    //>>includeEnd('debug');

    result.x = left.x * right.x;
    result.y = left.y * right.y;
    result.z = left.z * right.z;
    result.w = left.w * right.w;
    return result;
  };

  /**
   * Computes the componentwise quotient of two Cartesians.
   *
   * @param {Cartesian4} left The first Cartesian.
   * @param {Cartesian4} right The second Cartesian.
   * @param {Cartesian4} result The object onto which to store the result.
   * @returns {Cartesian4} The modified result parameter.
   */
  Cartesian4.divideComponents = function (left, right, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("left", left);
    Check.Check.typeOf.object("right", right);
    Check.Check.typeOf.object("result", result);
    //>>includeEnd('debug');

    result.x = left.x / right.x;
    result.y = left.y / right.y;
    result.z = left.z / right.z;
    result.w = left.w / right.w;
    return result;
  };

  /**
   * Computes the componentwise sum of two Cartesians.
   *
   * @param {Cartesian4} left The first Cartesian.
   * @param {Cartesian4} right The second Cartesian.
   * @param {Cartesian4} result The object onto which to store the result.
   * @returns {Cartesian4} The modified result parameter.
   */
  Cartesian4.add = function (left, right, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("left", left);
    Check.Check.typeOf.object("right", right);
    Check.Check.typeOf.object("result", result);
    //>>includeEnd('debug');

    result.x = left.x + right.x;
    result.y = left.y + right.y;
    result.z = left.z + right.z;
    result.w = left.w + right.w;
    return result;
  };

  /**
   * Computes the componentwise difference of two Cartesians.
   *
   * @param {Cartesian4} left The first Cartesian.
   * @param {Cartesian4} right The second Cartesian.
   * @param {Cartesian4} result The object onto which to store the result.
   * @returns {Cartesian4} The modified result parameter.
   */
  Cartesian4.subtract = function (left, right, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("left", left);
    Check.Check.typeOf.object("right", right);
    Check.Check.typeOf.object("result", result);
    //>>includeEnd('debug');

    result.x = left.x - right.x;
    result.y = left.y - right.y;
    result.z = left.z - right.z;
    result.w = left.w - right.w;
    return result;
  };

  /**
   * Multiplies the provided Cartesian componentwise by the provided scalar.
   *
   * @param {Cartesian4} cartesian The Cartesian to be scaled.
   * @param {Number} scalar The scalar to multiply with.
   * @param {Cartesian4} result The object onto which to store the result.
   * @returns {Cartesian4} The modified result parameter.
   */
  Cartesian4.multiplyByScalar = function (cartesian, scalar, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("cartesian", cartesian);
    Check.Check.typeOf.number("scalar", scalar);
    Check.Check.typeOf.object("result", result);
    //>>includeEnd('debug');

    result.x = cartesian.x * scalar;
    result.y = cartesian.y * scalar;
    result.z = cartesian.z * scalar;
    result.w = cartesian.w * scalar;
    return result;
  };

  /**
   * Divides the provided Cartesian componentwise by the provided scalar.
   *
   * @param {Cartesian4} cartesian The Cartesian to be divided.
   * @param {Number} scalar The scalar to divide by.
   * @param {Cartesian4} result The object onto which to store the result.
   * @returns {Cartesian4} The modified result parameter.
   */
  Cartesian4.divideByScalar = function (cartesian, scalar, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("cartesian", cartesian);
    Check.Check.typeOf.number("scalar", scalar);
    Check.Check.typeOf.object("result", result);
    //>>includeEnd('debug');

    result.x = cartesian.x / scalar;
    result.y = cartesian.y / scalar;
    result.z = cartesian.z / scalar;
    result.w = cartesian.w / scalar;
    return result;
  };

  /**
   * Negates the provided Cartesian.
   *
   * @param {Cartesian4} cartesian The Cartesian to be negated.
   * @param {Cartesian4} result The object onto which to store the result.
   * @returns {Cartesian4} The modified result parameter.
   */
  Cartesian4.negate = function (cartesian, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("cartesian", cartesian);
    Check.Check.typeOf.object("result", result);
    //>>includeEnd('debug');

    result.x = -cartesian.x;
    result.y = -cartesian.y;
    result.z = -cartesian.z;
    result.w = -cartesian.w;
    return result;
  };

  /**
   * Computes the absolute value of the provided Cartesian.
   *
   * @param {Cartesian4} cartesian The Cartesian whose absolute value is to be computed.
   * @param {Cartesian4} result The object onto which to store the result.
   * @returns {Cartesian4} The modified result parameter.
   */
  Cartesian4.abs = function (cartesian, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("cartesian", cartesian);
    Check.Check.typeOf.object("result", result);
    //>>includeEnd('debug');

    result.x = Math.abs(cartesian.x);
    result.y = Math.abs(cartesian.y);
    result.z = Math.abs(cartesian.z);
    result.w = Math.abs(cartesian.w);
    return result;
  };

  const lerpScratch = new Cartesian4();
  /**
   * Computes the linear interpolation or extrapolation at t using the provided cartesians.
   *
   * @param {Cartesian4} start The value corresponding to t at 0.0.
   * @param {Cartesian4}end The value corresponding to t at 1.0.
   * @param {Number} t The point along t at which to interpolate.
   * @param {Cartesian4} result The object onto which to store the result.
   * @returns {Cartesian4} The modified result parameter.
   */
  Cartesian4.lerp = function (start, end, t, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("start", start);
    Check.Check.typeOf.object("end", end);
    Check.Check.typeOf.number("t", t);
    Check.Check.typeOf.object("result", result);
    //>>includeEnd('debug');

    Cartesian4.multiplyByScalar(end, t, lerpScratch);
    result = Cartesian4.multiplyByScalar(start, 1.0 - t, result);
    return Cartesian4.add(lerpScratch, result, result);
  };

  const mostOrthogonalAxisScratch = new Cartesian4();
  /**
   * Returns the axis that is most orthogonal to the provided Cartesian.
   *
   * @param {Cartesian4} cartesian The Cartesian on which to find the most orthogonal axis.
   * @param {Cartesian4} result The object onto which to store the result.
   * @returns {Cartesian4} The most orthogonal axis.
   */
  Cartesian4.mostOrthogonalAxis = function (cartesian, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("cartesian", cartesian);
    Check.Check.typeOf.object("result", result);
    //>>includeEnd('debug');

    const f = Cartesian4.normalize(cartesian, mostOrthogonalAxisScratch);
    Cartesian4.abs(f, f);

    if (f.x <= f.y) {
      if (f.x <= f.z) {
        if (f.x <= f.w) {
          result = Cartesian4.clone(Cartesian4.UNIT_X, result);
        } else {
          result = Cartesian4.clone(Cartesian4.UNIT_W, result);
        }
      } else if (f.z <= f.w) {
        result = Cartesian4.clone(Cartesian4.UNIT_Z, result);
      } else {
        result = Cartesian4.clone(Cartesian4.UNIT_W, result);
      }
    } else if (f.y <= f.z) {
      if (f.y <= f.w) {
        result = Cartesian4.clone(Cartesian4.UNIT_Y, result);
      } else {
        result = Cartesian4.clone(Cartesian4.UNIT_W, result);
      }
    } else if (f.z <= f.w) {
      result = Cartesian4.clone(Cartesian4.UNIT_Z, result);
    } else {
      result = Cartesian4.clone(Cartesian4.UNIT_W, result);
    }

    return result;
  };

  /**
   * Compares the provided Cartesians componentwise and returns
   * <code>true</code> if they are equal, <code>false</code> otherwise.
   *
   * @param {Cartesian4} [left] The first Cartesian.
   * @param {Cartesian4} [right] The second Cartesian.
   * @returns {Boolean} <code>true</code> if left and right are equal, <code>false</code> otherwise.
   */
  Cartesian4.equals = function (left, right) {
    return (
      left === right ||
      (defined.defined(left) &&
        defined.defined(right) &&
        left.x === right.x &&
        left.y === right.y &&
        left.z === right.z &&
        left.w === right.w)
    );
  };

  /**
   * @private
   */
  Cartesian4.equalsArray = function (cartesian, array, offset) {
    return (
      cartesian.x === array[offset] &&
      cartesian.y === array[offset + 1] &&
      cartesian.z === array[offset + 2] &&
      cartesian.w === array[offset + 3]
    );
  };

  /**
   * Compares the provided Cartesians componentwise and returns
   * <code>true</code> if they pass an absolute or relative tolerance test,
   * <code>false</code> otherwise.
   *
   * @param {Cartesian4} [left] The first Cartesian.
   * @param {Cartesian4} [right] The second Cartesian.
   * @param {Number} [relativeEpsilon=0] The relative epsilon tolerance to use for equality testing.
   * @param {Number} [absoluteEpsilon=relativeEpsilon] The absolute epsilon tolerance to use for equality testing.
   * @returns {Boolean} <code>true</code> if left and right are within the provided epsilon, <code>false</code> otherwise.
   */
  Cartesian4.equalsEpsilon = function (
    left,
    right,
    relativeEpsilon,
    absoluteEpsilon
  ) {
    return (
      left === right ||
      (defined.defined(left) &&
        defined.defined(right) &&
        Math$1.CesiumMath.equalsEpsilon(
          left.x,
          right.x,
          relativeEpsilon,
          absoluteEpsilon
        ) &&
        Math$1.CesiumMath.equalsEpsilon(
          left.y,
          right.y,
          relativeEpsilon,
          absoluteEpsilon
        ) &&
        Math$1.CesiumMath.equalsEpsilon(
          left.z,
          right.z,
          relativeEpsilon,
          absoluteEpsilon
        ) &&
        Math$1.CesiumMath.equalsEpsilon(
          left.w,
          right.w,
          relativeEpsilon,
          absoluteEpsilon
        ))
    );
  };

  /**
   * An immutable Cartesian4 instance initialized to (0.0, 0.0, 0.0, 0.0).
   *
   * @type {Cartesian4}
   * @constant
   */
  Cartesian4.ZERO = Object.freeze(new Cartesian4(0.0, 0.0, 0.0, 0.0));

  /**
   * An immutable Cartesian4 instance initialized to (1.0, 1.0, 1.0, 1.0).
   *
   * @type {Cartesian4}
   * @constant
   */
  Cartesian4.ONE = Object.freeze(new Cartesian4(1.0, 1.0, 1.0, 1.0));

  /**
   * An immutable Cartesian4 instance initialized to (1.0, 0.0, 0.0, 0.0).
   *
   * @type {Cartesian4}
   * @constant
   */
  Cartesian4.UNIT_X = Object.freeze(new Cartesian4(1.0, 0.0, 0.0, 0.0));

  /**
   * An immutable Cartesian4 instance initialized to (0.0, 1.0, 0.0, 0.0).
   *
   * @type {Cartesian4}
   * @constant
   */
  Cartesian4.UNIT_Y = Object.freeze(new Cartesian4(0.0, 1.0, 0.0, 0.0));

  /**
   * An immutable Cartesian4 instance initialized to (0.0, 0.0, 1.0, 0.0).
   *
   * @type {Cartesian4}
   * @constant
   */
  Cartesian4.UNIT_Z = Object.freeze(new Cartesian4(0.0, 0.0, 1.0, 0.0));

  /**
   * An immutable Cartesian4 instance initialized to (0.0, 0.0, 0.0, 1.0).
   *
   * @type {Cartesian4}
   * @constant
   */
  Cartesian4.UNIT_W = Object.freeze(new Cartesian4(0.0, 0.0, 0.0, 1.0));

  /**
   * Duplicates this Cartesian4 instance.
   *
   * @param {Cartesian4} [result] The object onto which to store the result.
   * @returns {Cartesian4} The modified result parameter or a new Cartesian4 instance if one was not provided.
   */
  Cartesian4.prototype.clone = function (result) {
    return Cartesian4.clone(this, result);
  };

  /**
   * Compares this Cartesian against the provided Cartesian componentwise and returns
   * <code>true</code> if they are equal, <code>false</code> otherwise.
   *
   * @param {Cartesian4} [right] The right hand side Cartesian.
   * @returns {Boolean} <code>true</code> if they are equal, <code>false</code> otherwise.
   */
  Cartesian4.prototype.equals = function (right) {
    return Cartesian4.equals(this, right);
  };

  /**
   * Compares this Cartesian against the provided Cartesian componentwise and returns
   * <code>true</code> if they pass an absolute or relative tolerance test,
   * <code>false</code> otherwise.
   *
   * @param {Cartesian4} [right] The right hand side Cartesian.
   * @param {Number} [relativeEpsilon=0] The relative epsilon tolerance to use for equality testing.
   * @param {Number} [absoluteEpsilon=relativeEpsilon] The absolute epsilon tolerance to use for equality testing.
   * @returns {Boolean} <code>true</code> if they are within the provided epsilon, <code>false</code> otherwise.
   */
  Cartesian4.prototype.equalsEpsilon = function (
    right,
    relativeEpsilon,
    absoluteEpsilon
  ) {
    return Cartesian4.equalsEpsilon(
      this,
      right,
      relativeEpsilon,
      absoluteEpsilon
    );
  };

  /**
   * Creates a string representing this Cartesian in the format '(x, y, z, w)'.
   *
   * @returns {String} A string representing the provided Cartesian in the format '(x, y, z, w)'.
   */
  Cartesian4.prototype.toString = function () {
    return `(${this.x}, ${this.y}, ${this.z}, ${this.w})`;
  };

  // scratchU8Array and scratchF32Array are views into the same buffer
  const scratchF32Array = new Float32Array(1);
  const scratchU8Array = new Uint8Array(scratchF32Array.buffer);

  const testU32 = new Uint32Array([0x11223344]);
  const testU8 = new Uint8Array(testU32.buffer);
  const littleEndian = testU8[0] === 0x44;

  /**
   * Packs an arbitrary floating point value to 4 values representable using uint8.
   *
   * @param {Number} value A floating point number.
   * @param {Cartesian4} [result] The Cartesian4 that will contain the packed float.
   * @returns {Cartesian4} A Cartesian4 representing the float packed to values in x, y, z, and w.
   */
  Cartesian4.packFloat = function (value, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.number("value", value);
    //>>includeEnd('debug');

    if (!defined.defined(result)) {
      result = new Cartesian4();
    }

    // scratchU8Array and scratchF32Array are views into the same buffer
    scratchF32Array[0] = value;

    if (littleEndian) {
      result.x = scratchU8Array[0];
      result.y = scratchU8Array[1];
      result.z = scratchU8Array[2];
      result.w = scratchU8Array[3];
    } else {
      // convert from big-endian to little-endian
      result.x = scratchU8Array[3];
      result.y = scratchU8Array[2];
      result.z = scratchU8Array[1];
      result.w = scratchU8Array[0];
    }
    return result;
  };

  /**
   * Unpacks a float packed using Cartesian4.packFloat.
   *
   * @param {Cartesian4} packedFloat A Cartesian4 containing a float packed to 4 values representable using uint8.
   * @returns {Number} The unpacked float.
   * @private
   */
  Cartesian4.unpackFloat = function (packedFloat) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("packedFloat", packedFloat);
    //>>includeEnd('debug');

    // scratchU8Array and scratchF32Array are views into the same buffer
    if (littleEndian) {
      scratchU8Array[0] = packedFloat.x;
      scratchU8Array[1] = packedFloat.y;
      scratchU8Array[2] = packedFloat.z;
      scratchU8Array[3] = packedFloat.w;
    } else {
      // convert from little-endian to big-endian
      scratchU8Array[0] = packedFloat.w;
      scratchU8Array[1] = packedFloat.z;
      scratchU8Array[2] = packedFloat.y;
      scratchU8Array[3] = packedFloat.x;
    }
    return scratchF32Array[0];
  };

  /**
   * A 4x4 matrix, indexable as a column-major order array.
   * Constructor parameters are in row-major order for code readability.
   * @alias Matrix4
   * @constructor
   * @implements {ArrayLike<number>}
   *
   * @param {Number} [column0Row0=0.0] The value for column 0, row 0.
   * @param {Number} [column1Row0=0.0] The value for column 1, row 0.
   * @param {Number} [column2Row0=0.0] The value for column 2, row 0.
   * @param {Number} [column3Row0=0.0] The value for column 3, row 0.
   * @param {Number} [column0Row1=0.0] The value for column 0, row 1.
   * @param {Number} [column1Row1=0.0] The value for column 1, row 1.
   * @param {Number} [column2Row1=0.0] The value for column 2, row 1.
   * @param {Number} [column3Row1=0.0] The value for column 3, row 1.
   * @param {Number} [column0Row2=0.0] The value for column 0, row 2.
   * @param {Number} [column1Row2=0.0] The value for column 1, row 2.
   * @param {Number} [column2Row2=0.0] The value for column 2, row 2.
   * @param {Number} [column3Row2=0.0] The value for column 3, row 2.
   * @param {Number} [column0Row3=0.0] The value for column 0, row 3.
   * @param {Number} [column1Row3=0.0] The value for column 1, row 3.
   * @param {Number} [column2Row3=0.0] The value for column 2, row 3.
   * @param {Number} [column3Row3=0.0] The value for column 3, row 3.
   *
   * @see Matrix4.fromArray
   * @see Matrix4.fromColumnMajorArray
   * @see Matrix4.fromRowMajorArray
   * @see Matrix4.fromRotationTranslation
   * @see Matrix4.fromTranslationQuaternionRotationScale
   * @see Matrix4.fromTranslationRotationScale
   * @see Matrix4.fromTranslation
   * @see Matrix4.fromScale
   * @see Matrix4.fromUniformScale
   * @see Matrix4.fromRotation
   * @see Matrix4.fromCamera
   * @see Matrix4.computePerspectiveFieldOfView
   * @see Matrix4.computeOrthographicOffCenter
   * @see Matrix4.computePerspectiveOffCenter
   * @see Matrix4.computeInfinitePerspectiveOffCenter
   * @see Matrix4.computeViewportTransformation
   * @see Matrix4.computeView
   * @see Matrix2
   * @see Matrix3
   * @see Packable
   */
  function Matrix4(
    column0Row0,
    column1Row0,
    column2Row0,
    column3Row0,
    column0Row1,
    column1Row1,
    column2Row1,
    column3Row1,
    column0Row2,
    column1Row2,
    column2Row2,
    column3Row2,
    column0Row3,
    column1Row3,
    column2Row3,
    column3Row3
  ) {
    this[0] = defined.defaultValue(column0Row0, 0.0);
    this[1] = defined.defaultValue(column0Row1, 0.0);
    this[2] = defined.defaultValue(column0Row2, 0.0);
    this[3] = defined.defaultValue(column0Row3, 0.0);
    this[4] = defined.defaultValue(column1Row0, 0.0);
    this[5] = defined.defaultValue(column1Row1, 0.0);
    this[6] = defined.defaultValue(column1Row2, 0.0);
    this[7] = defined.defaultValue(column1Row3, 0.0);
    this[8] = defined.defaultValue(column2Row0, 0.0);
    this[9] = defined.defaultValue(column2Row1, 0.0);
    this[10] = defined.defaultValue(column2Row2, 0.0);
    this[11] = defined.defaultValue(column2Row3, 0.0);
    this[12] = defined.defaultValue(column3Row0, 0.0);
    this[13] = defined.defaultValue(column3Row1, 0.0);
    this[14] = defined.defaultValue(column3Row2, 0.0);
    this[15] = defined.defaultValue(column3Row3, 0.0);
  }

  /**
   * The number of elements used to pack the object into an array.
   * @type {Number}
   */
  Matrix4.packedLength = 16;

  /**
   * Stores the provided instance into the provided array.
   *
   * @param {Matrix4} value The value to pack.
   * @param {Number[]} array The array to pack into.
   * @param {Number} [startingIndex=0] The index into the array at which to start packing the elements.
   *
   * @returns {Number[]} The array that was packed into
   */
  Matrix4.pack = function (value, array, startingIndex) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("value", value);
    Check.Check.defined("array", array);
    //>>includeEnd('debug');

    startingIndex = defined.defaultValue(startingIndex, 0);

    array[startingIndex++] = value[0];
    array[startingIndex++] = value[1];
    array[startingIndex++] = value[2];
    array[startingIndex++] = value[3];
    array[startingIndex++] = value[4];
    array[startingIndex++] = value[5];
    array[startingIndex++] = value[6];
    array[startingIndex++] = value[7];
    array[startingIndex++] = value[8];
    array[startingIndex++] = value[9];
    array[startingIndex++] = value[10];
    array[startingIndex++] = value[11];
    array[startingIndex++] = value[12];
    array[startingIndex++] = value[13];
    array[startingIndex++] = value[14];
    array[startingIndex] = value[15];

    return array;
  };

  /**
   * Retrieves an instance from a packed array.
   *
   * @param {Number[]} array The packed array.
   * @param {Number} [startingIndex=0] The starting index of the element to be unpacked.
   * @param {Matrix4} [result] The object into which to store the result.
   * @returns {Matrix4} The modified result parameter or a new Matrix4 instance if one was not provided.
   */
  Matrix4.unpack = function (array, startingIndex, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.defined("array", array);
    //>>includeEnd('debug');

    startingIndex = defined.defaultValue(startingIndex, 0);

    if (!defined.defined(result)) {
      result = new Matrix4();
    }

    result[0] = array[startingIndex++];
    result[1] = array[startingIndex++];
    result[2] = array[startingIndex++];
    result[3] = array[startingIndex++];
    result[4] = array[startingIndex++];
    result[5] = array[startingIndex++];
    result[6] = array[startingIndex++];
    result[7] = array[startingIndex++];
    result[8] = array[startingIndex++];
    result[9] = array[startingIndex++];
    result[10] = array[startingIndex++];
    result[11] = array[startingIndex++];
    result[12] = array[startingIndex++];
    result[13] = array[startingIndex++];
    result[14] = array[startingIndex++];
    result[15] = array[startingIndex];
    return result;
  };

  /**
   * Flattens an array of Matrix4s into an array of components. The components
   * are stored in column-major order.
   *
   * @param {Matrix4[]} array The array of matrices to pack.
   * @param {Number[]} [result] The array onto which to store the result. If this is a typed array, it must have array.length * 16 components, else a {@link DeveloperError} will be thrown. If it is a regular array, it will be resized to have (array.length * 16) elements.
   * @returns {Number[]} The packed array.
   */
  Matrix4.packArray = function (array, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.defined("array", array);
    //>>includeEnd('debug');

    const length = array.length;
    const resultLength = length * 16;
    if (!defined.defined(result)) {
      result = new Array(resultLength);
    } else if (!Array.isArray(result) && result.length !== resultLength) {
      //>>includeStart('debug', pragmas.debug);
      throw new Check.DeveloperError(
        "If result is a typed array, it must have exactly array.length * 16 elements"
      );
      //>>includeEnd('debug');
    } else if (result.length !== resultLength) {
      result.length = resultLength;
    }

    for (let i = 0; i < length; ++i) {
      Matrix4.pack(array[i], result, i * 16);
    }
    return result;
  };

  /**
   * Unpacks an array of column-major matrix components into an array of Matrix4s.
   *
   * @param {Number[]} array The array of components to unpack.
   * @param {Matrix4[]} [result] The array onto which to store the result.
   * @returns {Matrix4[]} The unpacked array.
   */
  Matrix4.unpackArray = function (array, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.defined("array", array);
    Check.Check.typeOf.number.greaterThanOrEquals("array.length", array.length, 16);
    if (array.length % 16 !== 0) {
      throw new Check.DeveloperError("array length must be a multiple of 16.");
    }
    //>>includeEnd('debug');

    const length = array.length;
    if (!defined.defined(result)) {
      result = new Array(length / 16);
    } else {
      result.length = length / 16;
    }

    for (let i = 0; i < length; i += 16) {
      const index = i / 16;
      result[index] = Matrix4.unpack(array, i, result[index]);
    }
    return result;
  };

  /**
   * Duplicates a Matrix4 instance.
   *
   * @param {Matrix4} matrix The matrix to duplicate.
   * @param {Matrix4} [result] The object onto which to store the result.
   * @returns {Matrix4} The modified result parameter or a new Matrix4 instance if one was not provided. (Returns undefined if matrix is undefined)
   */
  Matrix4.clone = function (matrix, result) {
    if (!defined.defined(matrix)) {
      return undefined;
    }
    if (!defined.defined(result)) {
      return new Matrix4(
        matrix[0],
        matrix[4],
        matrix[8],
        matrix[12],
        matrix[1],
        matrix[5],
        matrix[9],
        matrix[13],
        matrix[2],
        matrix[6],
        matrix[10],
        matrix[14],
        matrix[3],
        matrix[7],
        matrix[11],
        matrix[15]
      );
    }
    result[0] = matrix[0];
    result[1] = matrix[1];
    result[2] = matrix[2];
    result[3] = matrix[3];
    result[4] = matrix[4];
    result[5] = matrix[5];
    result[6] = matrix[6];
    result[7] = matrix[7];
    result[8] = matrix[8];
    result[9] = matrix[9];
    result[10] = matrix[10];
    result[11] = matrix[11];
    result[12] = matrix[12];
    result[13] = matrix[13];
    result[14] = matrix[14];
    result[15] = matrix[15];
    return result;
  };

  /**
   * Creates a Matrix4 from 16 consecutive elements in an array.
   * @function
   *
   * @param {Number[]} array The array whose 16 consecutive elements correspond to the positions of the matrix.  Assumes column-major order.
   * @param {Number} [startingIndex=0] The offset into the array of the first element, which corresponds to first column first row position in the matrix.
   * @param {Matrix4} [result] The object onto which to store the result.
   * @returns {Matrix4} The modified result parameter or a new Matrix4 instance if one was not provided.
   *
   * @example
   * // Create the Matrix4:
   * // [1.0, 2.0, 3.0, 4.0]
   * // [1.0, 2.0, 3.0, 4.0]
   * // [1.0, 2.0, 3.0, 4.0]
   * // [1.0, 2.0, 3.0, 4.0]
   *
   * const v = [1.0, 1.0, 1.0, 1.0, 2.0, 2.0, 2.0, 2.0, 3.0, 3.0, 3.0, 3.0, 4.0, 4.0, 4.0, 4.0];
   * const m = Cesium.Matrix4.fromArray(v);
   *
   * // Create same Matrix4 with using an offset into an array
   * const v2 = [0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 2.0, 2.0, 2.0, 2.0, 3.0, 3.0, 3.0, 3.0, 4.0, 4.0, 4.0, 4.0];
   * const m2 = Cesium.Matrix4.fromArray(v2, 2);
   */
  Matrix4.fromArray = Matrix4.unpack;

  /**
   * Computes a Matrix4 instance from a column-major order array.
   *
   * @param {Number[]} values The column-major order array.
   * @param {Matrix4} [result] The object in which the result will be stored, if undefined a new instance will be created.
   * @returns {Matrix4} The modified result parameter, or a new Matrix4 instance if one was not provided.
   */
  Matrix4.fromColumnMajorArray = function (values, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.defined("values", values);
    //>>includeEnd('debug');

    return Matrix4.clone(values, result);
  };

  /**
   * Computes a Matrix4 instance from a row-major order array.
   * The resulting matrix will be in column-major order.
   *
   * @param {Number[]} values The row-major order array.
   * @param {Matrix4} [result] The object in which the result will be stored, if undefined a new instance will be created.
   * @returns {Matrix4} The modified result parameter, or a new Matrix4 instance if one was not provided.
   */
  Matrix4.fromRowMajorArray = function (values, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.defined("values", values);
    //>>includeEnd('debug');

    if (!defined.defined(result)) {
      return new Matrix4(
        values[0],
        values[1],
        values[2],
        values[3],
        values[4],
        values[5],
        values[6],
        values[7],
        values[8],
        values[9],
        values[10],
        values[11],
        values[12],
        values[13],
        values[14],
        values[15]
      );
    }
    result[0] = values[0];
    result[1] = values[4];
    result[2] = values[8];
    result[3] = values[12];
    result[4] = values[1];
    result[5] = values[5];
    result[6] = values[9];
    result[7] = values[13];
    result[8] = values[2];
    result[9] = values[6];
    result[10] = values[10];
    result[11] = values[14];
    result[12] = values[3];
    result[13] = values[7];
    result[14] = values[11];
    result[15] = values[15];
    return result;
  };

  /**
   * Computes a Matrix4 instance from a Matrix3 representing the rotation
   * and a Cartesian3 representing the translation.
   *
   * @param {Matrix3} rotation The upper left portion of the matrix representing the rotation.
   * @param {Cartesian3} [translation=Cartesian3.ZERO] The upper right portion of the matrix representing the translation.
   * @param {Matrix4} [result] The object in which the result will be stored, if undefined a new instance will be created.
   * @returns {Matrix4} The modified result parameter, or a new Matrix4 instance if one was not provided.
   */
  Matrix4.fromRotationTranslation = function (rotation, translation, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("rotation", rotation);
    //>>includeEnd('debug');

    translation = defined.defaultValue(translation, Cartesian3.Cartesian3.ZERO);

    if (!defined.defined(result)) {
      return new Matrix4(
        rotation[0],
        rotation[3],
        rotation[6],
        translation.x,
        rotation[1],
        rotation[4],
        rotation[7],
        translation.y,
        rotation[2],
        rotation[5],
        rotation[8],
        translation.z,
        0.0,
        0.0,
        0.0,
        1.0
      );
    }

    result[0] = rotation[0];
    result[1] = rotation[1];
    result[2] = rotation[2];
    result[3] = 0.0;
    result[4] = rotation[3];
    result[5] = rotation[4];
    result[6] = rotation[5];
    result[7] = 0.0;
    result[8] = rotation[6];
    result[9] = rotation[7];
    result[10] = rotation[8];
    result[11] = 0.0;
    result[12] = translation.x;
    result[13] = translation.y;
    result[14] = translation.z;
    result[15] = 1.0;
    return result;
  };

  /**
   * Computes a Matrix4 instance from a translation, rotation, and scale (TRS)
   * representation with the rotation represented as a quaternion.
   *
   * @param {Cartesian3} translation The translation transformation.
   * @param {Quaternion} rotation The rotation transformation.
   * @param {Cartesian3} scale The non-uniform scale transformation.
   * @param {Matrix4} [result] The object in which the result will be stored, if undefined a new instance will be created.
   * @returns {Matrix4} The modified result parameter, or a new Matrix4 instance if one was not provided.
   *
   * @example
   * const result = Cesium.Matrix4.fromTranslationQuaternionRotationScale(
   *   new Cesium.Cartesian3(1.0, 2.0, 3.0), // translation
   *   Cesium.Quaternion.IDENTITY,           // rotation
   *   new Cesium.Cartesian3(7.0, 8.0, 9.0), // scale
   *   result);
   */
  Matrix4.fromTranslationQuaternionRotationScale = function (
    translation,
    rotation,
    scale,
    result
  ) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("translation", translation);
    Check.Check.typeOf.object("rotation", rotation);
    Check.Check.typeOf.object("scale", scale);
    //>>includeEnd('debug');

    if (!defined.defined(result)) {
      result = new Matrix4();
    }

    const scaleX = scale.x;
    const scaleY = scale.y;
    const scaleZ = scale.z;

    const x2 = rotation.x * rotation.x;
    const xy = rotation.x * rotation.y;
    const xz = rotation.x * rotation.z;
    const xw = rotation.x * rotation.w;
    const y2 = rotation.y * rotation.y;
    const yz = rotation.y * rotation.z;
    const yw = rotation.y * rotation.w;
    const z2 = rotation.z * rotation.z;
    const zw = rotation.z * rotation.w;
    const w2 = rotation.w * rotation.w;

    const m00 = x2 - y2 - z2 + w2;
    const m01 = 2.0 * (xy - zw);
    const m02 = 2.0 * (xz + yw);

    const m10 = 2.0 * (xy + zw);
    const m11 = -x2 + y2 - z2 + w2;
    const m12 = 2.0 * (yz - xw);

    const m20 = 2.0 * (xz - yw);
    const m21 = 2.0 * (yz + xw);
    const m22 = -x2 - y2 + z2 + w2;

    result[0] = m00 * scaleX;
    result[1] = m10 * scaleX;
    result[2] = m20 * scaleX;
    result[3] = 0.0;
    result[4] = m01 * scaleY;
    result[5] = m11 * scaleY;
    result[6] = m21 * scaleY;
    result[7] = 0.0;
    result[8] = m02 * scaleZ;
    result[9] = m12 * scaleZ;
    result[10] = m22 * scaleZ;
    result[11] = 0.0;
    result[12] = translation.x;
    result[13] = translation.y;
    result[14] = translation.z;
    result[15] = 1.0;

    return result;
  };

  /**
   * Creates a Matrix4 instance from a {@link TranslationRotationScale} instance.
   *
   * @param {TranslationRotationScale} translationRotationScale The instance.
   * @param {Matrix4} [result] The object in which the result will be stored, if undefined a new instance will be created.
   * @returns {Matrix4} The modified result parameter, or a new Matrix4 instance if one was not provided.
   */
  Matrix4.fromTranslationRotationScale = function (
    translationRotationScale,
    result
  ) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("translationRotationScale", translationRotationScale);
    //>>includeEnd('debug');

    return Matrix4.fromTranslationQuaternionRotationScale(
      translationRotationScale.translation,
      translationRotationScale.rotation,
      translationRotationScale.scale,
      result
    );
  };

  /**
   * Creates a Matrix4 instance from a Cartesian3 representing the translation.
   *
   * @param {Cartesian3} translation The upper right portion of the matrix representing the translation.
   * @param {Matrix4} [result] The object in which the result will be stored, if undefined a new instance will be created.
   * @returns {Matrix4} The modified result parameter, or a new Matrix4 instance if one was not provided.
   *
   * @see Matrix4.multiplyByTranslation
   */
  Matrix4.fromTranslation = function (translation, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("translation", translation);
    //>>includeEnd('debug');

    return Matrix4.fromRotationTranslation(Matrix3.IDENTITY, translation, result);
  };

  /**
   * Computes a Matrix4 instance representing a non-uniform scale.
   *
   * @param {Cartesian3} scale The x, y, and z scale factors.
   * @param {Matrix4} [result] The object in which the result will be stored, if undefined a new instance will be created.
   * @returns {Matrix4} The modified result parameter, or a new Matrix4 instance if one was not provided.
   *
   * @example
   * // Creates
   * //   [7.0, 0.0, 0.0, 0.0]
   * //   [0.0, 8.0, 0.0, 0.0]
   * //   [0.0, 0.0, 9.0, 0.0]
   * //   [0.0, 0.0, 0.0, 1.0]
   * const m = Cesium.Matrix4.fromScale(new Cesium.Cartesian3(7.0, 8.0, 9.0));
   */
  Matrix4.fromScale = function (scale, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("scale", scale);
    //>>includeEnd('debug');

    if (!defined.defined(result)) {
      return new Matrix4(
        scale.x,
        0.0,
        0.0,
        0.0,
        0.0,
        scale.y,
        0.0,
        0.0,
        0.0,
        0.0,
        scale.z,
        0.0,
        0.0,
        0.0,
        0.0,
        1.0
      );
    }

    result[0] = scale.x;
    result[1] = 0.0;
    result[2] = 0.0;
    result[3] = 0.0;
    result[4] = 0.0;
    result[5] = scale.y;
    result[6] = 0.0;
    result[7] = 0.0;
    result[8] = 0.0;
    result[9] = 0.0;
    result[10] = scale.z;
    result[11] = 0.0;
    result[12] = 0.0;
    result[13] = 0.0;
    result[14] = 0.0;
    result[15] = 1.0;
    return result;
  };

  /**
   * Computes a Matrix4 instance representing a uniform scale.
   *
   * @param {Number} scale The uniform scale factor.
   * @param {Matrix4} [result] The object in which the result will be stored, if undefined a new instance will be created.
   * @returns {Matrix4} The modified result parameter, or a new Matrix4 instance if one was not provided.
   *
   * @example
   * // Creates
   * //   [2.0, 0.0, 0.0, 0.0]
   * //   [0.0, 2.0, 0.0, 0.0]
   * //   [0.0, 0.0, 2.0, 0.0]
   * //   [0.0, 0.0, 0.0, 1.0]
   * const m = Cesium.Matrix4.fromUniformScale(2.0);
   */
  Matrix4.fromUniformScale = function (scale, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.number("scale", scale);
    //>>includeEnd('debug');

    if (!defined.defined(result)) {
      return new Matrix4(
        scale,
        0.0,
        0.0,
        0.0,
        0.0,
        scale,
        0.0,
        0.0,
        0.0,
        0.0,
        scale,
        0.0,
        0.0,
        0.0,
        0.0,
        1.0
      );
    }

    result[0] = scale;
    result[1] = 0.0;
    result[2] = 0.0;
    result[3] = 0.0;
    result[4] = 0.0;
    result[5] = scale;
    result[6] = 0.0;
    result[7] = 0.0;
    result[8] = 0.0;
    result[9] = 0.0;
    result[10] = scale;
    result[11] = 0.0;
    result[12] = 0.0;
    result[13] = 0.0;
    result[14] = 0.0;
    result[15] = 1.0;
    return result;
  };

  /**
   * Creates a rotation matrix.
   *
   * @param {Matrix3} rotation The rotation matrix.
   * @param {Matrix4} [result] The object in which the result will be stored, if undefined a new instance will be created.
   * @returns {Matrix4} The modified result parameter, or a new Matrix4 instance if one was not provided.
   */
  Matrix4.fromRotation = function (rotation, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("rotation", rotation);
    //>>includeEnd('debug');

    if (!defined.defined(result)) {
      result = new Matrix4();
    }
    result[0] = rotation[0];
    result[1] = rotation[1];
    result[2] = rotation[2];
    result[3] = 0.0;

    result[4] = rotation[3];
    result[5] = rotation[4];
    result[6] = rotation[5];
    result[7] = 0.0;

    result[8] = rotation[6];
    result[9] = rotation[7];
    result[10] = rotation[8];
    result[11] = 0.0;

    result[12] = 0.0;
    result[13] = 0.0;
    result[14] = 0.0;
    result[15] = 1.0;

    return result;
  };

  const fromCameraF = new Cartesian3.Cartesian3();
  const fromCameraR = new Cartesian3.Cartesian3();
  const fromCameraU = new Cartesian3.Cartesian3();

  /**
   * Computes a Matrix4 instance from a Camera.
   *
   * @param {Camera} camera The camera to use.
   * @param {Matrix4} [result] The object in which the result will be stored, if undefined a new instance will be created.
   * @returns {Matrix4} The modified result parameter, or a new Matrix4 instance if one was not provided.
   */
  Matrix4.fromCamera = function (camera, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("camera", camera);
    //>>includeEnd('debug');

    const position = camera.position;
    const direction = camera.direction;
    const up = camera.up;

    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("camera.position", position);
    Check.Check.typeOf.object("camera.direction", direction);
    Check.Check.typeOf.object("camera.up", up);
    //>>includeEnd('debug');

    Cartesian3.Cartesian3.normalize(direction, fromCameraF);
    Cartesian3.Cartesian3.normalize(
      Cartesian3.Cartesian3.cross(fromCameraF, up, fromCameraR),
      fromCameraR
    );
    Cartesian3.Cartesian3.normalize(
      Cartesian3.Cartesian3.cross(fromCameraR, fromCameraF, fromCameraU),
      fromCameraU
    );

    const sX = fromCameraR.x;
    const sY = fromCameraR.y;
    const sZ = fromCameraR.z;
    const fX = fromCameraF.x;
    const fY = fromCameraF.y;
    const fZ = fromCameraF.z;
    const uX = fromCameraU.x;
    const uY = fromCameraU.y;
    const uZ = fromCameraU.z;
    const positionX = position.x;
    const positionY = position.y;
    const positionZ = position.z;
    const t0 = sX * -positionX + sY * -positionY + sZ * -positionZ;
    const t1 = uX * -positionX + uY * -positionY + uZ * -positionZ;
    const t2 = fX * positionX + fY * positionY + fZ * positionZ;

    // The code below this comment is an optimized
    // version of the commented lines.
    // Rather that create two matrices and then multiply,
    // we just bake in the multiplcation as part of creation.
    // const rotation = new Matrix4(
    //                 sX,  sY,  sZ, 0.0,
    //                 uX,  uY,  uZ, 0.0,
    //                -fX, -fY, -fZ, 0.0,
    //                 0.0,  0.0,  0.0, 1.0);
    // const translation = new Matrix4(
    //                 1.0, 0.0, 0.0, -position.x,
    //                 0.0, 1.0, 0.0, -position.y,
    //                 0.0, 0.0, 1.0, -position.z,
    //                 0.0, 0.0, 0.0, 1.0);
    // return rotation.multiply(translation);
    if (!defined.defined(result)) {
      return new Matrix4(
        sX,
        sY,
        sZ,
        t0,
        uX,
        uY,
        uZ,
        t1,
        -fX,
        -fY,
        -fZ,
        t2,
        0.0,
        0.0,
        0.0,
        1.0
      );
    }
    result[0] = sX;
    result[1] = uX;
    result[2] = -fX;
    result[3] = 0.0;
    result[4] = sY;
    result[5] = uY;
    result[6] = -fY;
    result[7] = 0.0;
    result[8] = sZ;
    result[9] = uZ;
    result[10] = -fZ;
    result[11] = 0.0;
    result[12] = t0;
    result[13] = t1;
    result[14] = t2;
    result[15] = 1.0;
    return result;
  };

  /**
   * Computes a Matrix4 instance representing a perspective transformation matrix.
   *
   * @param {Number} fovY The field of view along the Y axis in radians.
   * @param {Number} aspectRatio The aspect ratio.
   * @param {Number} near The distance to the near plane in meters.
   * @param {Number} far The distance to the far plane in meters.
   * @param {Matrix4} result The object in which the result will be stored.
   * @returns {Matrix4} The modified result parameter.
   *
   * @exception {DeveloperError} fovY must be in (0, PI].
   * @exception {DeveloperError} aspectRatio must be greater than zero.
   * @exception {DeveloperError} near must be greater than zero.
   * @exception {DeveloperError} far must be greater than zero.
   */
  Matrix4.computePerspectiveFieldOfView = function (
    fovY,
    aspectRatio,
    near,
    far,
    result
  ) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.number.greaterThan("fovY", fovY, 0.0);
    Check.Check.typeOf.number.lessThan("fovY", fovY, Math.PI);
    Check.Check.typeOf.number.greaterThan("near", near, 0.0);
    Check.Check.typeOf.number.greaterThan("far", far, 0.0);
    Check.Check.typeOf.object("result", result);
    //>>includeEnd('debug');

    const bottom = Math.tan(fovY * 0.5);

    const column1Row1 = 1.0 / bottom;
    const column0Row0 = column1Row1 / aspectRatio;
    const column2Row2 = (far + near) / (near - far);
    const column3Row2 = (2.0 * far * near) / (near - far);

    result[0] = column0Row0;
    result[1] = 0.0;
    result[2] = 0.0;
    result[3] = 0.0;
    result[4] = 0.0;
    result[5] = column1Row1;
    result[6] = 0.0;
    result[7] = 0.0;
    result[8] = 0.0;
    result[9] = 0.0;
    result[10] = column2Row2;
    result[11] = -1.0;
    result[12] = 0.0;
    result[13] = 0.0;
    result[14] = column3Row2;
    result[15] = 0.0;
    return result;
  };

  /**
   * Computes a Matrix4 instance representing an orthographic transformation matrix.
   *
   * @param {Number} left The number of meters to the left of the camera that will be in view.
   * @param {Number} right The number of meters to the right of the camera that will be in view.
   * @param {Number} bottom The number of meters below of the camera that will be in view.
   * @param {Number} top The number of meters above of the camera that will be in view.
   * @param {Number} near The distance to the near plane in meters.
   * @param {Number} far The distance to the far plane in meters.
   * @param {Matrix4} result The object in which the result will be stored.
   * @returns {Matrix4} The modified result parameter.
   */
  Matrix4.computeOrthographicOffCenter = function (
    left,
    right,
    bottom,
    top,
    near,
    far,
    result
  ) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.number("left", left);
    Check.Check.typeOf.number("right", right);
    Check.Check.typeOf.number("bottom", bottom);
    Check.Check.typeOf.number("top", top);
    Check.Check.typeOf.number("near", near);
    Check.Check.typeOf.number("far", far);
    Check.Check.typeOf.object("result", result);
    //>>includeEnd('debug');

    let a = 1.0 / (right - left);
    let b = 1.0 / (top - bottom);
    let c = 1.0 / (far - near);

    const tx = -(right + left) * a;
    const ty = -(top + bottom) * b;
    const tz = -(far + near) * c;
    a *= 2.0;
    b *= 2.0;
    c *= -2.0;

    result[0] = a;
    result[1] = 0.0;
    result[2] = 0.0;
    result[3] = 0.0;
    result[4] = 0.0;
    result[5] = b;
    result[6] = 0.0;
    result[7] = 0.0;
    result[8] = 0.0;
    result[9] = 0.0;
    result[10] = c;
    result[11] = 0.0;
    result[12] = tx;
    result[13] = ty;
    result[14] = tz;
    result[15] = 1.0;
    return result;
  };

  /**
   * Computes a Matrix4 instance representing an off center perspective transformation.
   *
   * @param {Number} left The number of meters to the left of the camera that will be in view.
   * @param {Number} right The number of meters to the right of the camera that will be in view.
   * @param {Number} bottom The number of meters below of the camera that will be in view.
   * @param {Number} top The number of meters above of the camera that will be in view.
   * @param {Number} near The distance to the near plane in meters.
   * @param {Number} far The distance to the far plane in meters.
   * @param {Matrix4} result The object in which the result will be stored.
   * @returns {Matrix4} The modified result parameter.
   */
  Matrix4.computePerspectiveOffCenter = function (
    left,
    right,
    bottom,
    top,
    near,
    far,
    result
  ) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.number("left", left);
    Check.Check.typeOf.number("right", right);
    Check.Check.typeOf.number("bottom", bottom);
    Check.Check.typeOf.number("top", top);
    Check.Check.typeOf.number("near", near);
    Check.Check.typeOf.number("far", far);
    Check.Check.typeOf.object("result", result);
    //>>includeEnd('debug');

    const column0Row0 = (2.0 * near) / (right - left);
    const column1Row1 = (2.0 * near) / (top - bottom);
    const column2Row0 = (right + left) / (right - left);
    const column2Row1 = (top + bottom) / (top - bottom);
    const column2Row2 = -(far + near) / (far - near);
    const column2Row3 = -1.0;
    const column3Row2 = (-2.0 * far * near) / (far - near);

    result[0] = column0Row0;
    result[1] = 0.0;
    result[2] = 0.0;
    result[3] = 0.0;
    result[4] = 0.0;
    result[5] = column1Row1;
    result[6] = 0.0;
    result[7] = 0.0;
    result[8] = column2Row0;
    result[9] = column2Row1;
    result[10] = column2Row2;
    result[11] = column2Row3;
    result[12] = 0.0;
    result[13] = 0.0;
    result[14] = column3Row2;
    result[15] = 0.0;
    return result;
  };

  /**
   * Computes a Matrix4 instance representing an infinite off center perspective transformation.
   *
   * @param {Number} left The number of meters to the left of the camera that will be in view.
   * @param {Number} right The number of meters to the right of the camera that will be in view.
   * @param {Number} bottom The number of meters below of the camera that will be in view.
   * @param {Number} top The number of meters above of the camera that will be in view.
   * @param {Number} near The distance to the near plane in meters.
   * @param {Matrix4} result The object in which the result will be stored.
   * @returns {Matrix4} The modified result parameter.
   */
  Matrix4.computeInfinitePerspectiveOffCenter = function (
    left,
    right,
    bottom,
    top,
    near,
    result
  ) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.number("left", left);
    Check.Check.typeOf.number("right", right);
    Check.Check.typeOf.number("bottom", bottom);
    Check.Check.typeOf.number("top", top);
    Check.Check.typeOf.number("near", near);
    Check.Check.typeOf.object("result", result);
    //>>includeEnd('debug');

    const column0Row0 = (2.0 * near) / (right - left);
    const column1Row1 = (2.0 * near) / (top - bottom);
    const column2Row0 = (right + left) / (right - left);
    const column2Row1 = (top + bottom) / (top - bottom);
    const column2Row2 = -1.0;
    const column2Row3 = -1.0;
    const column3Row2 = -2.0 * near;

    result[0] = column0Row0;
    result[1] = 0.0;
    result[2] = 0.0;
    result[3] = 0.0;
    result[4] = 0.0;
    result[5] = column1Row1;
    result[6] = 0.0;
    result[7] = 0.0;
    result[8] = column2Row0;
    result[9] = column2Row1;
    result[10] = column2Row2;
    result[11] = column2Row3;
    result[12] = 0.0;
    result[13] = 0.0;
    result[14] = column3Row2;
    result[15] = 0.0;
    return result;
  };

  /**
   * Computes a Matrix4 instance that transforms from normalized device coordinates to window coordinates.
   *
   * @param {Object} [viewport = { x : 0.0, y : 0.0, width : 0.0, height : 0.0 }] The viewport's corners as shown in Example 1.
   * @param {Number} [nearDepthRange=0.0] The near plane distance in window coordinates.
   * @param {Number} [farDepthRange=1.0] The far plane distance in window coordinates.
   * @param {Matrix4} [result] The object in which the result will be stored.
   * @returns {Matrix4} The modified result parameter.
   *
   * @example
   * // Create viewport transformation using an explicit viewport and depth range.
   * const m = Cesium.Matrix4.computeViewportTransformation({
   *     x : 0.0,
   *     y : 0.0,
   *     width : 1024.0,
   *     height : 768.0
   * }, 0.0, 1.0, new Cesium.Matrix4());
   */
  Matrix4.computeViewportTransformation = function (
    viewport,
    nearDepthRange,
    farDepthRange,
    result
  ) {
    if (!defined.defined(result)) {
      result = new Matrix4();
    }

    viewport = defined.defaultValue(viewport, defined.defaultValue.EMPTY_OBJECT);
    const x = defined.defaultValue(viewport.x, 0.0);
    const y = defined.defaultValue(viewport.y, 0.0);
    const width = defined.defaultValue(viewport.width, 0.0);
    const height = defined.defaultValue(viewport.height, 0.0);
    nearDepthRange = defined.defaultValue(nearDepthRange, 0.0);
    farDepthRange = defined.defaultValue(farDepthRange, 1.0);

    const halfWidth = width * 0.5;
    const halfHeight = height * 0.5;
    const halfDepth = (farDepthRange - nearDepthRange) * 0.5;

    const column0Row0 = halfWidth;
    const column1Row1 = halfHeight;
    const column2Row2 = halfDepth;
    const column3Row0 = x + halfWidth;
    const column3Row1 = y + halfHeight;
    const column3Row2 = nearDepthRange + halfDepth;
    const column3Row3 = 1.0;

    result[0] = column0Row0;
    result[1] = 0.0;
    result[2] = 0.0;
    result[3] = 0.0;
    result[4] = 0.0;
    result[5] = column1Row1;
    result[6] = 0.0;
    result[7] = 0.0;
    result[8] = 0.0;
    result[9] = 0.0;
    result[10] = column2Row2;
    result[11] = 0.0;
    result[12] = column3Row0;
    result[13] = column3Row1;
    result[14] = column3Row2;
    result[15] = column3Row3;

    return result;
  };

  /**
   * Computes a Matrix4 instance that transforms from world space to view space.
   *
   * @param {Cartesian3} position The position of the camera.
   * @param {Cartesian3} direction The forward direction.
   * @param {Cartesian3} up The up direction.
   * @param {Cartesian3} right The right direction.
   * @param {Matrix4} result The object in which the result will be stored.
   * @returns {Matrix4} The modified result parameter.
   */
  Matrix4.computeView = function (position, direction, up, right, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("position", position);
    Check.Check.typeOf.object("direction", direction);
    Check.Check.typeOf.object("up", up);
    Check.Check.typeOf.object("right", right);
    Check.Check.typeOf.object("result", result);
    //>>includeEnd('debug');

    result[0] = right.x;
    result[1] = up.x;
    result[2] = -direction.x;
    result[3] = 0.0;
    result[4] = right.y;
    result[5] = up.y;
    result[6] = -direction.y;
    result[7] = 0.0;
    result[8] = right.z;
    result[9] = up.z;
    result[10] = -direction.z;
    result[11] = 0.0;
    result[12] = -Cartesian3.Cartesian3.dot(right, position);
    result[13] = -Cartesian3.Cartesian3.dot(up, position);
    result[14] = Cartesian3.Cartesian3.dot(direction, position);
    result[15] = 1.0;
    return result;
  };

  /**
   * Computes an Array from the provided Matrix4 instance.
   * The array will be in column-major order.
   *
   * @param {Matrix4} matrix The matrix to use..
   * @param {Number[]} [result] The Array onto which to store the result.
   * @returns {Number[]} The modified Array parameter or a new Array instance if one was not provided.
   *
   * @example
   * //create an array from an instance of Matrix4
   * // m = [10.0, 14.0, 18.0, 22.0]
   * //     [11.0, 15.0, 19.0, 23.0]
   * //     [12.0, 16.0, 20.0, 24.0]
   * //     [13.0, 17.0, 21.0, 25.0]
   * const a = Cesium.Matrix4.toArray(m);
   *
   * // m remains the same
   * //creates a = [10.0, 11.0, 12.0, 13.0, 14.0, 15.0, 16.0, 17.0, 18.0, 19.0, 20.0, 21.0, 22.0, 23.0, 24.0, 25.0]
   */
  Matrix4.toArray = function (matrix, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("matrix", matrix);
    //>>includeEnd('debug');

    if (!defined.defined(result)) {
      return [
        matrix[0],
        matrix[1],
        matrix[2],
        matrix[3],
        matrix[4],
        matrix[5],
        matrix[6],
        matrix[7],
        matrix[8],
        matrix[9],
        matrix[10],
        matrix[11],
        matrix[12],
        matrix[13],
        matrix[14],
        matrix[15],
      ];
    }
    result[0] = matrix[0];
    result[1] = matrix[1];
    result[2] = matrix[2];
    result[3] = matrix[3];
    result[4] = matrix[4];
    result[5] = matrix[5];
    result[6] = matrix[6];
    result[7] = matrix[7];
    result[8] = matrix[8];
    result[9] = matrix[9];
    result[10] = matrix[10];
    result[11] = matrix[11];
    result[12] = matrix[12];
    result[13] = matrix[13];
    result[14] = matrix[14];
    result[15] = matrix[15];
    return result;
  };

  /**
   * Computes the array index of the element at the provided row and column.
   *
   * @param {Number} row The zero-based index of the row.
   * @param {Number} column The zero-based index of the column.
   * @returns {Number} The index of the element at the provided row and column.
   *
   * @exception {DeveloperError} row must be 0, 1, 2, or 3.
   * @exception {DeveloperError} column must be 0, 1, 2, or 3.
   *
   * @example
   * const myMatrix = new Cesium.Matrix4();
   * const column1Row0Index = Cesium.Matrix4.getElementIndex(1, 0);
   * const column1Row0 = myMatrix[column1Row0Index];
   * myMatrix[column1Row0Index] = 10.0;
   */
  Matrix4.getElementIndex = function (column, row) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.number.greaterThanOrEquals("row", row, 0);
    Check.Check.typeOf.number.lessThanOrEquals("row", row, 3);

    Check.Check.typeOf.number.greaterThanOrEquals("column", column, 0);
    Check.Check.typeOf.number.lessThanOrEquals("column", column, 3);
    //>>includeEnd('debug');

    return column * 4 + row;
  };

  /**
   * Retrieves a copy of the matrix column at the provided index as a Cartesian4 instance.
   *
   * @param {Matrix4} matrix The matrix to use.
   * @param {Number} index The zero-based index of the column to retrieve.
   * @param {Cartesian4} result The object onto which to store the result.
   * @returns {Cartesian4} The modified result parameter.
   *
   * @exception {DeveloperError} index must be 0, 1, 2, or 3.
   *
   * @example
   * //returns a Cartesian4 instance with values from the specified column
   * // m = [10.0, 11.0, 12.0, 13.0]
   * //     [14.0, 15.0, 16.0, 17.0]
   * //     [18.0, 19.0, 20.0, 21.0]
   * //     [22.0, 23.0, 24.0, 25.0]
   *
   * //Example 1: Creates an instance of Cartesian
   * const a = Cesium.Matrix4.getColumn(m, 2, new Cesium.Cartesian4());
   *
   * @example
   * //Example 2: Sets values for Cartesian instance
   * const a = new Cesium.Cartesian4();
   * Cesium.Matrix4.getColumn(m, 2, a);
   *
   * // a.x = 12.0; a.y = 16.0; a.z = 20.0; a.w = 24.0;
   */
  Matrix4.getColumn = function (matrix, index, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("matrix", matrix);

    Check.Check.typeOf.number.greaterThanOrEquals("index", index, 0);
    Check.Check.typeOf.number.lessThanOrEquals("index", index, 3);

    Check.Check.typeOf.object("result", result);
    //>>includeEnd('debug');

    const startIndex = index * 4;
    const x = matrix[startIndex];
    const y = matrix[startIndex + 1];
    const z = matrix[startIndex + 2];
    const w = matrix[startIndex + 3];

    result.x = x;
    result.y = y;
    result.z = z;
    result.w = w;
    return result;
  };

  /**
   * Computes a new matrix that replaces the specified column in the provided matrix with the provided Cartesian4 instance.
   *
   * @param {Matrix4} matrix The matrix to use.
   * @param {Number} index The zero-based index of the column to set.
   * @param {Cartesian4} cartesian The Cartesian whose values will be assigned to the specified column.
   * @param {Matrix4} result The object onto which to store the result.
   * @returns {Matrix4} The modified result parameter.
   *
   * @exception {DeveloperError} index must be 0, 1, 2, or 3.
   *
   * @example
   * //creates a new Matrix4 instance with new column values from the Cartesian4 instance
   * // m = [10.0, 11.0, 12.0, 13.0]
   * //     [14.0, 15.0, 16.0, 17.0]
   * //     [18.0, 19.0, 20.0, 21.0]
   * //     [22.0, 23.0, 24.0, 25.0]
   *
   * const a = Cesium.Matrix4.setColumn(m, 2, new Cesium.Cartesian4(99.0, 98.0, 97.0, 96.0), new Cesium.Matrix4());
   *
   * // m remains the same
   * // a = [10.0, 11.0, 99.0, 13.0]
   * //     [14.0, 15.0, 98.0, 17.0]
   * //     [18.0, 19.0, 97.0, 21.0]
   * //     [22.0, 23.0, 96.0, 25.0]
   */
  Matrix4.setColumn = function (matrix, index, cartesian, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("matrix", matrix);

    Check.Check.typeOf.number.greaterThanOrEquals("index", index, 0);
    Check.Check.typeOf.number.lessThanOrEquals("index", index, 3);

    Check.Check.typeOf.object("cartesian", cartesian);
    Check.Check.typeOf.object("result", result);
    //>>includeEnd('debug');

    result = Matrix4.clone(matrix, result);
    const startIndex = index * 4;
    result[startIndex] = cartesian.x;
    result[startIndex + 1] = cartesian.y;
    result[startIndex + 2] = cartesian.z;
    result[startIndex + 3] = cartesian.w;
    return result;
  };

  /**
   * Retrieves a copy of the matrix row at the provided index as a Cartesian4 instance.
   *
   * @param {Matrix4} matrix The matrix to use.
   * @param {Number} index The zero-based index of the row to retrieve.
   * @param {Cartesian4} result The object onto which to store the result.
   * @returns {Cartesian4} The modified result parameter.
   *
   * @exception {DeveloperError} index must be 0, 1, 2, or 3.
   *
   * @example
   * //returns a Cartesian4 instance with values from the specified column
   * // m = [10.0, 11.0, 12.0, 13.0]
   * //     [14.0, 15.0, 16.0, 17.0]
   * //     [18.0, 19.0, 20.0, 21.0]
   * //     [22.0, 23.0, 24.0, 25.0]
   *
   * //Example 1: Returns an instance of Cartesian
   * const a = Cesium.Matrix4.getRow(m, 2, new Cesium.Cartesian4());
   *
   * @example
   * //Example 2: Sets values for a Cartesian instance
   * const a = new Cesium.Cartesian4();
   * Cesium.Matrix4.getRow(m, 2, a);
   *
   * // a.x = 18.0; a.y = 19.0; a.z = 20.0; a.w = 21.0;
   */
  Matrix4.getRow = function (matrix, index, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("matrix", matrix);

    Check.Check.typeOf.number.greaterThanOrEquals("index", index, 0);
    Check.Check.typeOf.number.lessThanOrEquals("index", index, 3);

    Check.Check.typeOf.object("result", result);
    //>>includeEnd('debug');

    const x = matrix[index];
    const y = matrix[index + 4];
    const z = matrix[index + 8];
    const w = matrix[index + 12];

    result.x = x;
    result.y = y;
    result.z = z;
    result.w = w;
    return result;
  };

  /**
   * Computes a new matrix that replaces the specified row in the provided matrix with the provided Cartesian4 instance.
   *
   * @param {Matrix4} matrix The matrix to use.
   * @param {Number} index The zero-based index of the row to set.
   * @param {Cartesian4} cartesian The Cartesian whose values will be assigned to the specified row.
   * @param {Matrix4} result The object onto which to store the result.
   * @returns {Matrix4} The modified result parameter.
   *
   * @exception {DeveloperError} index must be 0, 1, 2, or 3.
   *
   * @example
   * //create a new Matrix4 instance with new row values from the Cartesian4 instance
   * // m = [10.0, 11.0, 12.0, 13.0]
   * //     [14.0, 15.0, 16.0, 17.0]
   * //     [18.0, 19.0, 20.0, 21.0]
   * //     [22.0, 23.0, 24.0, 25.0]
   *
   * const a = Cesium.Matrix4.setRow(m, 2, new Cesium.Cartesian4(99.0, 98.0, 97.0, 96.0), new Cesium.Matrix4());
   *
   * // m remains the same
   * // a = [10.0, 11.0, 12.0, 13.0]
   * //     [14.0, 15.0, 16.0, 17.0]
   * //     [99.0, 98.0, 97.0, 96.0]
   * //     [22.0, 23.0, 24.0, 25.0]
   */
  Matrix4.setRow = function (matrix, index, cartesian, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("matrix", matrix);

    Check.Check.typeOf.number.greaterThanOrEquals("index", index, 0);
    Check.Check.typeOf.number.lessThanOrEquals("index", index, 3);

    Check.Check.typeOf.object("cartesian", cartesian);
    Check.Check.typeOf.object("result", result);
    //>>includeEnd('debug');

    result = Matrix4.clone(matrix, result);
    result[index] = cartesian.x;
    result[index + 4] = cartesian.y;
    result[index + 8] = cartesian.z;
    result[index + 12] = cartesian.w;
    return result;
  };

  /**
   * Computes a new matrix that replaces the translation in the rightmost column of the provided
   * matrix with the provided translation. This assumes the matrix is an affine transformation.
   *
   * @param {Matrix4} matrix The matrix to use.
   * @param {Cartesian3} translation The translation that replaces the translation of the provided matrix.
   * @param {Matrix4} result The object onto which to store the result.
   * @returns {Matrix4} The modified result parameter.
   */
  Matrix4.setTranslation = function (matrix, translation, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("matrix", matrix);
    Check.Check.typeOf.object("translation", translation);
    Check.Check.typeOf.object("result", result);
    //>>includeEnd('debug');

    result[0] = matrix[0];
    result[1] = matrix[1];
    result[2] = matrix[2];
    result[3] = matrix[3];

    result[4] = matrix[4];
    result[5] = matrix[5];
    result[6] = matrix[6];
    result[7] = matrix[7];

    result[8] = matrix[8];
    result[9] = matrix[9];
    result[10] = matrix[10];
    result[11] = matrix[11];

    result[12] = translation.x;
    result[13] = translation.y;
    result[14] = translation.z;
    result[15] = matrix[15];

    return result;
  };

  const scaleScratch1$1 = new Cartesian3.Cartesian3();

  /**
   * Computes a new matrix that replaces the scale with the provided scale.
   * This assumes the matrix is an affine transformation.
   *
   * @param {Matrix4} matrix The matrix to use.
   * @param {Cartesian3} scale The scale that replaces the scale of the provided matrix.
   * @param {Matrix4} result The object onto which to store the result.
   * @returns {Matrix4} The modified result parameter.
   *
   * @see Matrix4.setUniformScale
   * @see Matrix4.fromScale
   * @see Matrix4.fromUniformScale
   * @see Matrix4.multiplyByScale
   * @see Matrix4.multiplyByUniformScale
   * @see Matrix4.getScale
   */
  Matrix4.setScale = function (matrix, scale, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("matrix", matrix);
    Check.Check.typeOf.object("scale", scale);
    Check.Check.typeOf.object("result", result);
    //>>includeEnd('debug');

    const existingScale = Matrix4.getScale(matrix, scaleScratch1$1);
    const scaleRatioX = scale.x / existingScale.x;
    const scaleRatioY = scale.y / existingScale.y;
    const scaleRatioZ = scale.z / existingScale.z;

    result[0] = matrix[0] * scaleRatioX;
    result[1] = matrix[1] * scaleRatioX;
    result[2] = matrix[2] * scaleRatioX;
    result[3] = matrix[3];

    result[4] = matrix[4] * scaleRatioY;
    result[5] = matrix[5] * scaleRatioY;
    result[6] = matrix[6] * scaleRatioY;
    result[7] = matrix[7];

    result[8] = matrix[8] * scaleRatioZ;
    result[9] = matrix[9] * scaleRatioZ;
    result[10] = matrix[10] * scaleRatioZ;
    result[11] = matrix[11];

    result[12] = matrix[12];
    result[13] = matrix[13];
    result[14] = matrix[14];
    result[15] = matrix[15];

    return result;
  };

  const scaleScratch2$1 = new Cartesian3.Cartesian3();

  /**
   * Computes a new matrix that replaces the scale with the provided uniform scale.
   * This assumes the matrix is an affine transformation.
   *
   * @param {Matrix4} matrix The matrix to use.
   * @param {Number} scale The uniform scale that replaces the scale of the provided matrix.
   * @param {Matrix4} result The object onto which to store the result.
   * @returns {Matrix4} The modified result parameter.
   *
   * @see Matrix4.setScale
   * @see Matrix4.fromScale
   * @see Matrix4.fromUniformScale
   * @see Matrix4.multiplyByScale
   * @see Matrix4.multiplyByUniformScale
   * @see Matrix4.getScale
   */
  Matrix4.setUniformScale = function (matrix, scale, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("matrix", matrix);
    Check.Check.typeOf.number("scale", scale);
    Check.Check.typeOf.object("result", result);
    //>>includeEnd('debug');

    const existingScale = Matrix4.getScale(matrix, scaleScratch2$1);
    const scaleRatioX = scale / existingScale.x;
    const scaleRatioY = scale / existingScale.y;
    const scaleRatioZ = scale / existingScale.z;

    result[0] = matrix[0] * scaleRatioX;
    result[1] = matrix[1] * scaleRatioX;
    result[2] = matrix[2] * scaleRatioX;
    result[3] = matrix[3];

    result[4] = matrix[4] * scaleRatioY;
    result[5] = matrix[5] * scaleRatioY;
    result[6] = matrix[6] * scaleRatioY;
    result[7] = matrix[7];

    result[8] = matrix[8] * scaleRatioZ;
    result[9] = matrix[9] * scaleRatioZ;
    result[10] = matrix[10] * scaleRatioZ;
    result[11] = matrix[11];

    result[12] = matrix[12];
    result[13] = matrix[13];
    result[14] = matrix[14];
    result[15] = matrix[15];

    return result;
  };

  const scratchColumn$1 = new Cartesian3.Cartesian3();

  /**
   * Extracts the non-uniform scale assuming the matrix is an affine transformation.
   *
   * @param {Matrix4} matrix The matrix.
   * @param {Cartesian3} result The object onto which to store the result.
   * @returns {Cartesian3} The modified result parameter
   *
   * @see Matrix4.multiplyByScale
   * @see Matrix4.multiplyByUniformScale
   * @see Matrix4.fromScale
   * @see Matrix4.fromUniformScale
   * @see Matrix4.setScale
   * @see Matrix4.setUniformScale
   */
  Matrix4.getScale = function (matrix, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("matrix", matrix);
    Check.Check.typeOf.object("result", result);
    //>>includeEnd('debug');

    result.x = Cartesian3.Cartesian3.magnitude(
      Cartesian3.Cartesian3.fromElements(matrix[0], matrix[1], matrix[2], scratchColumn$1)
    );
    result.y = Cartesian3.Cartesian3.magnitude(
      Cartesian3.Cartesian3.fromElements(matrix[4], matrix[5], matrix[6], scratchColumn$1)
    );
    result.z = Cartesian3.Cartesian3.magnitude(
      Cartesian3.Cartesian3.fromElements(matrix[8], matrix[9], matrix[10], scratchColumn$1)
    );
    return result;
  };

  const scaleScratch3$1 = new Cartesian3.Cartesian3();

  /**
   * Computes the maximum scale assuming the matrix is an affine transformation.
   * The maximum scale is the maximum length of the column vectors in the upper-left
   * 3x3 matrix.
   *
   * @param {Matrix4} matrix The matrix.
   * @returns {Number} The maximum scale.
   */
  Matrix4.getMaximumScale = function (matrix) {
    Matrix4.getScale(matrix, scaleScratch3$1);
    return Cartesian3.Cartesian3.maximumComponent(scaleScratch3$1);
  };

  const scaleScratch4$1 = new Cartesian3.Cartesian3();

  /**
   * Sets the rotation assuming the matrix is an affine transformation.
   *
   * @param {Matrix4} matrix The matrix.
   * @param {Matrix3} rotation The rotation matrix.
   * @returns {Matrix4} The modified result parameter.
   *
   * @see Matrix4.fromRotation
   * @see Matrix4.getRotation
   */
  Matrix4.setRotation = function (matrix, rotation, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("matrix", matrix);
    Check.Check.typeOf.object("result", result);
    //>>includeEnd('debug');

    const scale = Matrix4.getScale(matrix, scaleScratch4$1);

    result[0] = rotation[0] * scale.x;
    result[1] = rotation[1] * scale.x;
    result[2] = rotation[2] * scale.x;
    result[3] = matrix[3];

    result[4] = rotation[3] * scale.y;
    result[5] = rotation[4] * scale.y;
    result[6] = rotation[5] * scale.y;
    result[7] = matrix[7];

    result[8] = rotation[6] * scale.z;
    result[9] = rotation[7] * scale.z;
    result[10] = rotation[8] * scale.z;
    result[11] = matrix[11];

    result[12] = matrix[12];
    result[13] = matrix[13];
    result[14] = matrix[14];
    result[15] = matrix[15];

    return result;
  };

  const scaleScratch5$1 = new Cartesian3.Cartesian3();

  /**
   * Extracts the rotation matrix assuming the matrix is an affine transformation.
   *
   * @param {Matrix4} matrix The matrix.
   * @param {Matrix3} result The object onto which to store the result.
   * @returns {Matrix3} The modified result parameter.
   *
   * @see Matrix4.setRotation
   * @see Matrix4.fromRotation
   */
  Matrix4.getRotation = function (matrix, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("matrix", matrix);
    Check.Check.typeOf.object("result", result);
    //>>includeEnd('debug');

    const scale = Matrix4.getScale(matrix, scaleScratch5$1);

    result[0] = matrix[0] / scale.x;
    result[1] = matrix[1] / scale.x;
    result[2] = matrix[2] / scale.x;

    result[3] = matrix[4] / scale.y;
    result[4] = matrix[5] / scale.y;
    result[5] = matrix[6] / scale.y;

    result[6] = matrix[8] / scale.z;
    result[7] = matrix[9] / scale.z;
    result[8] = matrix[10] / scale.z;

    return result;
  };

  /**
   * Computes the product of two matrices.
   *
   * @param {Matrix4} left The first matrix.
   * @param {Matrix4} right The second matrix.
   * @param {Matrix4} result The object onto which to store the result.
   * @returns {Matrix4} The modified result parameter.
   */
  Matrix4.multiply = function (left, right, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("left", left);
    Check.Check.typeOf.object("right", right);
    Check.Check.typeOf.object("result", result);
    //>>includeEnd('debug');

    const left0 = left[0];
    const left1 = left[1];
    const left2 = left[2];
    const left3 = left[3];
    const left4 = left[4];
    const left5 = left[5];
    const left6 = left[6];
    const left7 = left[7];
    const left8 = left[8];
    const left9 = left[9];
    const left10 = left[10];
    const left11 = left[11];
    const left12 = left[12];
    const left13 = left[13];
    const left14 = left[14];
    const left15 = left[15];

    const right0 = right[0];
    const right1 = right[1];
    const right2 = right[2];
    const right3 = right[3];
    const right4 = right[4];
    const right5 = right[5];
    const right6 = right[6];
    const right7 = right[7];
    const right8 = right[8];
    const right9 = right[9];
    const right10 = right[10];
    const right11 = right[11];
    const right12 = right[12];
    const right13 = right[13];
    const right14 = right[14];
    const right15 = right[15];

    const column0Row0 =
      left0 * right0 + left4 * right1 + left8 * right2 + left12 * right3;
    const column0Row1 =
      left1 * right0 + left5 * right1 + left9 * right2 + left13 * right3;
    const column0Row2 =
      left2 * right0 + left6 * right1 + left10 * right2 + left14 * right3;
    const column0Row3 =
      left3 * right0 + left7 * right1 + left11 * right2 + left15 * right3;

    const column1Row0 =
      left0 * right4 + left4 * right5 + left8 * right6 + left12 * right7;
    const column1Row1 =
      left1 * right4 + left5 * right5 + left9 * right6 + left13 * right7;
    const column1Row2 =
      left2 * right4 + left6 * right5 + left10 * right6 + left14 * right7;
    const column1Row3 =
      left3 * right4 + left7 * right5 + left11 * right6 + left15 * right7;

    const column2Row0 =
      left0 * right8 + left4 * right9 + left8 * right10 + left12 * right11;
    const column2Row1 =
      left1 * right8 + left5 * right9 + left9 * right10 + left13 * right11;
    const column2Row2 =
      left2 * right8 + left6 * right9 + left10 * right10 + left14 * right11;
    const column2Row3 =
      left3 * right8 + left7 * right9 + left11 * right10 + left15 * right11;

    const column3Row0 =
      left0 * right12 + left4 * right13 + left8 * right14 + left12 * right15;
    const column3Row1 =
      left1 * right12 + left5 * right13 + left9 * right14 + left13 * right15;
    const column3Row2 =
      left2 * right12 + left6 * right13 + left10 * right14 + left14 * right15;
    const column3Row3 =
      left3 * right12 + left7 * right13 + left11 * right14 + left15 * right15;

    result[0] = column0Row0;
    result[1] = column0Row1;
    result[2] = column0Row2;
    result[3] = column0Row3;
    result[4] = column1Row0;
    result[5] = column1Row1;
    result[6] = column1Row2;
    result[7] = column1Row3;
    result[8] = column2Row0;
    result[9] = column2Row1;
    result[10] = column2Row2;
    result[11] = column2Row3;
    result[12] = column3Row0;
    result[13] = column3Row1;
    result[14] = column3Row2;
    result[15] = column3Row3;
    return result;
  };

  /**
   * Computes the sum of two matrices.
   *
   * @param {Matrix4} left The first matrix.
   * @param {Matrix4} right The second matrix.
   * @param {Matrix4} result The object onto which to store the result.
   * @returns {Matrix4} The modified result parameter.
   */
  Matrix4.add = function (left, right, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("left", left);
    Check.Check.typeOf.object("right", right);
    Check.Check.typeOf.object("result", result);
    //>>includeEnd('debug');

    result[0] = left[0] + right[0];
    result[1] = left[1] + right[1];
    result[2] = left[2] + right[2];
    result[3] = left[3] + right[3];
    result[4] = left[4] + right[4];
    result[5] = left[5] + right[5];
    result[6] = left[6] + right[6];
    result[7] = left[7] + right[7];
    result[8] = left[8] + right[8];
    result[9] = left[9] + right[9];
    result[10] = left[10] + right[10];
    result[11] = left[11] + right[11];
    result[12] = left[12] + right[12];
    result[13] = left[13] + right[13];
    result[14] = left[14] + right[14];
    result[15] = left[15] + right[15];
    return result;
  };

  /**
   * Computes the difference of two matrices.
   *
   * @param {Matrix4} left The first matrix.
   * @param {Matrix4} right The second matrix.
   * @param {Matrix4} result The object onto which to store the result.
   * @returns {Matrix4} The modified result parameter.
   */
  Matrix4.subtract = function (left, right, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("left", left);
    Check.Check.typeOf.object("right", right);
    Check.Check.typeOf.object("result", result);
    //>>includeEnd('debug');

    result[0] = left[0] - right[0];
    result[1] = left[1] - right[1];
    result[2] = left[2] - right[2];
    result[3] = left[3] - right[3];
    result[4] = left[4] - right[4];
    result[5] = left[5] - right[5];
    result[6] = left[6] - right[6];
    result[7] = left[7] - right[7];
    result[8] = left[8] - right[8];
    result[9] = left[9] - right[9];
    result[10] = left[10] - right[10];
    result[11] = left[11] - right[11];
    result[12] = left[12] - right[12];
    result[13] = left[13] - right[13];
    result[14] = left[14] - right[14];
    result[15] = left[15] - right[15];
    return result;
  };

  /**
   * Computes the product of two matrices assuming the matrices are affine transformation matrices,
   * where the upper left 3x3 elements are any matrix, and
   * the upper three elements in the fourth column are the translation.
   * The bottom row is assumed to be [0, 0, 0, 1].
   * The matrix is not verified to be in the proper form.
   * This method is faster than computing the product for general 4x4
   * matrices using {@link Matrix4.multiply}.
   *
   * @param {Matrix4} left The first matrix.
   * @param {Matrix4} right The second matrix.
   * @param {Matrix4} result The object onto which to store the result.
   * @returns {Matrix4} The modified result parameter.
   *
   * @example
   * const m1 = new Cesium.Matrix4(1.0, 6.0, 7.0, 0.0, 2.0, 5.0, 8.0, 0.0, 3.0, 4.0, 9.0, 0.0, 0.0, 0.0, 0.0, 1.0);
   * const m2 = Cesium.Transforms.eastNorthUpToFixedFrame(new Cesium.Cartesian3(1.0, 1.0, 1.0));
   * const m3 = Cesium.Matrix4.multiplyTransformation(m1, m2, new Cesium.Matrix4());
   */
  Matrix4.multiplyTransformation = function (left, right, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("left", left);
    Check.Check.typeOf.object("right", right);
    Check.Check.typeOf.object("result", result);
    //>>includeEnd('debug');

    const left0 = left[0];
    const left1 = left[1];
    const left2 = left[2];
    const left4 = left[4];
    const left5 = left[5];
    const left6 = left[6];
    const left8 = left[8];
    const left9 = left[9];
    const left10 = left[10];
    const left12 = left[12];
    const left13 = left[13];
    const left14 = left[14];

    const right0 = right[0];
    const right1 = right[1];
    const right2 = right[2];
    const right4 = right[4];
    const right5 = right[5];
    const right6 = right[6];
    const right8 = right[8];
    const right9 = right[9];
    const right10 = right[10];
    const right12 = right[12];
    const right13 = right[13];
    const right14 = right[14];

    const column0Row0 = left0 * right0 + left4 * right1 + left8 * right2;
    const column0Row1 = left1 * right0 + left5 * right1 + left9 * right2;
    const column0Row2 = left2 * right0 + left6 * right1 + left10 * right2;

    const column1Row0 = left0 * right4 + left4 * right5 + left8 * right6;
    const column1Row1 = left1 * right4 + left5 * right5 + left9 * right6;
    const column1Row2 = left2 * right4 + left6 * right5 + left10 * right6;

    const column2Row0 = left0 * right8 + left4 * right9 + left8 * right10;
    const column2Row1 = left1 * right8 + left5 * right9 + left9 * right10;
    const column2Row2 = left2 * right8 + left6 * right9 + left10 * right10;

    const column3Row0 =
      left0 * right12 + left4 * right13 + left8 * right14 + left12;
    const column3Row1 =
      left1 * right12 + left5 * right13 + left9 * right14 + left13;
    const column3Row2 =
      left2 * right12 + left6 * right13 + left10 * right14 + left14;

    result[0] = column0Row0;
    result[1] = column0Row1;
    result[2] = column0Row2;
    result[3] = 0.0;
    result[4] = column1Row0;
    result[5] = column1Row1;
    result[6] = column1Row2;
    result[7] = 0.0;
    result[8] = column2Row0;
    result[9] = column2Row1;
    result[10] = column2Row2;
    result[11] = 0.0;
    result[12] = column3Row0;
    result[13] = column3Row1;
    result[14] = column3Row2;
    result[15] = 1.0;
    return result;
  };

  /**
   * Multiplies a transformation matrix (with a bottom row of <code>[0.0, 0.0, 0.0, 1.0]</code>)
   * by a 3x3 rotation matrix.  This is an optimization
   * for <code>Matrix4.multiply(m, Matrix4.fromRotationTranslation(rotation), m);</code> with less allocations and arithmetic operations.
   *
   * @param {Matrix4} matrix The matrix on the left-hand side.
   * @param {Matrix3} rotation The 3x3 rotation matrix on the right-hand side.
   * @param {Matrix4} result The object onto which to store the result.
   * @returns {Matrix4} The modified result parameter.
   *
   * @example
   * // Instead of Cesium.Matrix4.multiply(m, Cesium.Matrix4.fromRotationTranslation(rotation), m);
   * Cesium.Matrix4.multiplyByMatrix3(m, rotation, m);
   */
  Matrix4.multiplyByMatrix3 = function (matrix, rotation, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("matrix", matrix);
    Check.Check.typeOf.object("rotation", rotation);
    Check.Check.typeOf.object("result", result);
    //>>includeEnd('debug');

    const left0 = matrix[0];
    const left1 = matrix[1];
    const left2 = matrix[2];
    const left4 = matrix[4];
    const left5 = matrix[5];
    const left6 = matrix[6];
    const left8 = matrix[8];
    const left9 = matrix[9];
    const left10 = matrix[10];

    const right0 = rotation[0];
    const right1 = rotation[1];
    const right2 = rotation[2];
    const right4 = rotation[3];
    const right5 = rotation[4];
    const right6 = rotation[5];
    const right8 = rotation[6];
    const right9 = rotation[7];
    const right10 = rotation[8];

    const column0Row0 = left0 * right0 + left4 * right1 + left8 * right2;
    const column0Row1 = left1 * right0 + left5 * right1 + left9 * right2;
    const column0Row2 = left2 * right0 + left6 * right1 + left10 * right2;

    const column1Row0 = left0 * right4 + left4 * right5 + left8 * right6;
    const column1Row1 = left1 * right4 + left5 * right5 + left9 * right6;
    const column1Row2 = left2 * right4 + left6 * right5 + left10 * right6;

    const column2Row0 = left0 * right8 + left4 * right9 + left8 * right10;
    const column2Row1 = left1 * right8 + left5 * right9 + left9 * right10;
    const column2Row2 = left2 * right8 + left6 * right9 + left10 * right10;

    result[0] = column0Row0;
    result[1] = column0Row1;
    result[2] = column0Row2;
    result[3] = 0.0;
    result[4] = column1Row0;
    result[5] = column1Row1;
    result[6] = column1Row2;
    result[7] = 0.0;
    result[8] = column2Row0;
    result[9] = column2Row1;
    result[10] = column2Row2;
    result[11] = 0.0;
    result[12] = matrix[12];
    result[13] = matrix[13];
    result[14] = matrix[14];
    result[15] = matrix[15];
    return result;
  };

  /**
   * Multiplies a transformation matrix (with a bottom row of <code>[0.0, 0.0, 0.0, 1.0]</code>)
   * by an implicit translation matrix defined by a {@link Cartesian3}.  This is an optimization
   * for <code>Matrix4.multiply(m, Matrix4.fromTranslation(position), m);</code> with less allocations and arithmetic operations.
   *
   * @param {Matrix4} matrix The matrix on the left-hand side.
   * @param {Cartesian3} translation The translation on the right-hand side.
   * @param {Matrix4} result The object onto which to store the result.
   * @returns {Matrix4} The modified result parameter.
   *
   * @example
   * // Instead of Cesium.Matrix4.multiply(m, Cesium.Matrix4.fromTranslation(position), m);
   * Cesium.Matrix4.multiplyByTranslation(m, position, m);
   */
  Matrix4.multiplyByTranslation = function (matrix, translation, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("matrix", matrix);
    Check.Check.typeOf.object("translation", translation);
    Check.Check.typeOf.object("result", result);
    //>>includeEnd('debug');

    const x = translation.x;
    const y = translation.y;
    const z = translation.z;

    const tx = x * matrix[0] + y * matrix[4] + z * matrix[8] + matrix[12];
    const ty = x * matrix[1] + y * matrix[5] + z * matrix[9] + matrix[13];
    const tz = x * matrix[2] + y * matrix[6] + z * matrix[10] + matrix[14];

    result[0] = matrix[0];
    result[1] = matrix[1];
    result[2] = matrix[2];
    result[3] = matrix[3];
    result[4] = matrix[4];
    result[5] = matrix[5];
    result[6] = matrix[6];
    result[7] = matrix[7];
    result[8] = matrix[8];
    result[9] = matrix[9];
    result[10] = matrix[10];
    result[11] = matrix[11];
    result[12] = tx;
    result[13] = ty;
    result[14] = tz;
    result[15] = matrix[15];
    return result;
  };

  /**
   * Multiplies an affine transformation matrix (with a bottom row of <code>[0.0, 0.0, 0.0, 1.0]</code>)
   * by an implicit non-uniform scale matrix. This is an optimization
   * for <code>Matrix4.multiply(m, Matrix4.fromUniformScale(scale), m);</code>, where
   * <code>m</code> must be an affine matrix.
   * This function performs fewer allocations and arithmetic operations.
   *
   * @param {Matrix4} matrix The affine matrix on the left-hand side.
   * @param {Cartesian3} scale The non-uniform scale on the right-hand side.
   * @param {Matrix4} result The object onto which to store the result.
   * @returns {Matrix4} The modified result parameter.
   *
   *
   * @example
   * // Instead of Cesium.Matrix4.multiply(m, Cesium.Matrix4.fromScale(scale), m);
   * Cesium.Matrix4.multiplyByScale(m, scale, m);
   *
   * @see Matrix4.multiplyByUniformScale
   * @see Matrix4.fromScale
   * @see Matrix4.fromUniformScale
   * @see Matrix4.setScale
   * @see Matrix4.setUniformScale
   * @see Matrix4.getScale
   */
  Matrix4.multiplyByScale = function (matrix, scale, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("matrix", matrix);
    Check.Check.typeOf.object("scale", scale);
    Check.Check.typeOf.object("result", result);
    //>>includeEnd('debug');

    const scaleX = scale.x;
    const scaleY = scale.y;
    const scaleZ = scale.z;

    // Faster than Cartesian3.equals
    if (scaleX === 1.0 && scaleY === 1.0 && scaleZ === 1.0) {
      return Matrix4.clone(matrix, result);
    }

    result[0] = scaleX * matrix[0];
    result[1] = scaleX * matrix[1];
    result[2] = scaleX * matrix[2];
    result[3] = matrix[3];

    result[4] = scaleY * matrix[4];
    result[5] = scaleY * matrix[5];
    result[6] = scaleY * matrix[6];
    result[7] = matrix[7];

    result[8] = scaleZ * matrix[8];
    result[9] = scaleZ * matrix[9];
    result[10] = scaleZ * matrix[10];
    result[11] = matrix[11];

    result[12] = matrix[12];
    result[13] = matrix[13];
    result[14] = matrix[14];
    result[15] = matrix[15];

    return result;
  };

  /**
   * Computes the product of a matrix times a uniform scale, as if the scale were a scale matrix.
   *
   * @param {Matrix4} matrix The matrix on the left-hand side.
   * @param {Number} scale The uniform scale on the right-hand side.
   * @param {Matrix4} result The object onto which to store the result.
   * @returns {Matrix4} The modified result parameter.
   *
   * @example
   * // Instead of Cesium.Matrix4.multiply(m, Cesium.Matrix4.fromUniformScale(scale), m);
   * Cesium.Matrix4.multiplyByUniformScale(m, scale, m);
   *
   * @see Matrix4.multiplyByScale
   * @see Matrix4.fromScale
   * @see Matrix4.fromUniformScale
   * @see Matrix4.setScale
   * @see Matrix4.setUniformScale
   * @see Matrix4.getScale
   */
  Matrix4.multiplyByUniformScale = function (matrix, scale, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("matrix", matrix);
    Check.Check.typeOf.number("scale", scale);
    Check.Check.typeOf.object("result", result);
    //>>includeEnd('debug');

    result[0] = matrix[0] * scale;
    result[1] = matrix[1] * scale;
    result[2] = matrix[2] * scale;
    result[3] = matrix[3];

    result[4] = matrix[4] * scale;
    result[5] = matrix[5] * scale;
    result[6] = matrix[6] * scale;
    result[7] = matrix[7];

    result[8] = matrix[8] * scale;
    result[9] = matrix[9] * scale;
    result[10] = matrix[10] * scale;
    result[11] = matrix[11];

    result[12] = matrix[12];
    result[13] = matrix[13];
    result[14] = matrix[14];
    result[15] = matrix[15];

    return result;
  };

  /**
   * Computes the product of a matrix and a column vector.
   *
   * @param {Matrix4} matrix The matrix.
   * @param {Cartesian4} cartesian The vector.
   * @param {Cartesian4} result The object onto which to store the result.
   * @returns {Cartesian4} The modified result parameter.
   */
  Matrix4.multiplyByVector = function (matrix, cartesian, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("matrix", matrix);
    Check.Check.typeOf.object("cartesian", cartesian);
    Check.Check.typeOf.object("result", result);
    //>>includeEnd('debug');

    const vX = cartesian.x;
    const vY = cartesian.y;
    const vZ = cartesian.z;
    const vW = cartesian.w;

    const x = matrix[0] * vX + matrix[4] * vY + matrix[8] * vZ + matrix[12] * vW;
    const y = matrix[1] * vX + matrix[5] * vY + matrix[9] * vZ + matrix[13] * vW;
    const z = matrix[2] * vX + matrix[6] * vY + matrix[10] * vZ + matrix[14] * vW;
    const w = matrix[3] * vX + matrix[7] * vY + matrix[11] * vZ + matrix[15] * vW;

    result.x = x;
    result.y = y;
    result.z = z;
    result.w = w;
    return result;
  };

  /**
   * Computes the product of a matrix and a {@link Cartesian3}.  This is equivalent to calling {@link Matrix4.multiplyByVector}
   * with a {@link Cartesian4} with a <code>w</code> component of zero.
   *
   * @param {Matrix4} matrix The matrix.
   * @param {Cartesian3} cartesian The point.
   * @param {Cartesian3} result The object onto which to store the result.
   * @returns {Cartesian3} The modified result parameter.
   *
   * @example
   * const p = new Cesium.Cartesian3(1.0, 2.0, 3.0);
   * const result = Cesium.Matrix4.multiplyByPointAsVector(matrix, p, new Cesium.Cartesian3());
   * // A shortcut for
   * //   Cartesian3 p = ...
   * //   Cesium.Matrix4.multiplyByVector(matrix, new Cesium.Cartesian4(p.x, p.y, p.z, 0.0), result);
   */
  Matrix4.multiplyByPointAsVector = function (matrix, cartesian, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("matrix", matrix);
    Check.Check.typeOf.object("cartesian", cartesian);
    Check.Check.typeOf.object("result", result);
    //>>includeEnd('debug');

    const vX = cartesian.x;
    const vY = cartesian.y;
    const vZ = cartesian.z;

    const x = matrix[0] * vX + matrix[4] * vY + matrix[8] * vZ;
    const y = matrix[1] * vX + matrix[5] * vY + matrix[9] * vZ;
    const z = matrix[2] * vX + matrix[6] * vY + matrix[10] * vZ;

    result.x = x;
    result.y = y;
    result.z = z;
    return result;
  };

  /**
   * Computes the product of a matrix and a {@link Cartesian3}. This is equivalent to calling {@link Matrix4.multiplyByVector}
   * with a {@link Cartesian4} with a <code>w</code> component of 1, but returns a {@link Cartesian3} instead of a {@link Cartesian4}.
   *
   * @param {Matrix4} matrix The matrix.
   * @param {Cartesian3} cartesian The point.
   * @param {Cartesian3} result The object onto which to store the result.
   * @returns {Cartesian3} The modified result parameter.
   *
   * @example
   * const p = new Cesium.Cartesian3(1.0, 2.0, 3.0);
   * const result = Cesium.Matrix4.multiplyByPoint(matrix, p, new Cesium.Cartesian3());
   */
  Matrix4.multiplyByPoint = function (matrix, cartesian, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("matrix", matrix);
    Check.Check.typeOf.object("cartesian", cartesian);
    Check.Check.typeOf.object("result", result);
    //>>includeEnd('debug');

    const vX = cartesian.x;
    const vY = cartesian.y;
    const vZ = cartesian.z;

    const x = matrix[0] * vX + matrix[4] * vY + matrix[8] * vZ + matrix[12];
    const y = matrix[1] * vX + matrix[5] * vY + matrix[9] * vZ + matrix[13];
    const z = matrix[2] * vX + matrix[6] * vY + matrix[10] * vZ + matrix[14];

    result.x = x;
    result.y = y;
    result.z = z;
    return result;
  };

  /**
   * Computes the product of a matrix and a scalar.
   *
   * @param {Matrix4} matrix The matrix.
   * @param {Number} scalar The number to multiply by.
   * @param {Matrix4} result The object onto which to store the result.
   * @returns {Matrix4} The modified result parameter.
   *
   * @example
   * //create a Matrix4 instance which is a scaled version of the supplied Matrix4
   * // m = [10.0, 11.0, 12.0, 13.0]
   * //     [14.0, 15.0, 16.0, 17.0]
   * //     [18.0, 19.0, 20.0, 21.0]
   * //     [22.0, 23.0, 24.0, 25.0]
   *
   * const a = Cesium.Matrix4.multiplyByScalar(m, -2, new Cesium.Matrix4());
   *
   * // m remains the same
   * // a = [-20.0, -22.0, -24.0, -26.0]
   * //     [-28.0, -30.0, -32.0, -34.0]
   * //     [-36.0, -38.0, -40.0, -42.0]
   * //     [-44.0, -46.0, -48.0, -50.0]
   */
  Matrix4.multiplyByScalar = function (matrix, scalar, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("matrix", matrix);
    Check.Check.typeOf.number("scalar", scalar);
    Check.Check.typeOf.object("result", result);
    //>>includeEnd('debug');

    result[0] = matrix[0] * scalar;
    result[1] = matrix[1] * scalar;
    result[2] = matrix[2] * scalar;
    result[3] = matrix[3] * scalar;
    result[4] = matrix[4] * scalar;
    result[5] = matrix[5] * scalar;
    result[6] = matrix[6] * scalar;
    result[7] = matrix[7] * scalar;
    result[8] = matrix[8] * scalar;
    result[9] = matrix[9] * scalar;
    result[10] = matrix[10] * scalar;
    result[11] = matrix[11] * scalar;
    result[12] = matrix[12] * scalar;
    result[13] = matrix[13] * scalar;
    result[14] = matrix[14] * scalar;
    result[15] = matrix[15] * scalar;
    return result;
  };

  /**
   * Computes a negated copy of the provided matrix.
   *
   * @param {Matrix4} matrix The matrix to negate.
   * @param {Matrix4} result The object onto which to store the result.
   * @returns {Matrix4} The modified result parameter.
   *
   * @example
   * //create a new Matrix4 instance which is a negation of a Matrix4
   * // m = [10.0, 11.0, 12.0, 13.0]
   * //     [14.0, 15.0, 16.0, 17.0]
   * //     [18.0, 19.0, 20.0, 21.0]
   * //     [22.0, 23.0, 24.0, 25.0]
   *
   * const a = Cesium.Matrix4.negate(m, new Cesium.Matrix4());
   *
   * // m remains the same
   * // a = [-10.0, -11.0, -12.0, -13.0]
   * //     [-14.0, -15.0, -16.0, -17.0]
   * //     [-18.0, -19.0, -20.0, -21.0]
   * //     [-22.0, -23.0, -24.0, -25.0]
   */
  Matrix4.negate = function (matrix, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("matrix", matrix);
    Check.Check.typeOf.object("result", result);
    //>>includeEnd('debug');

    result[0] = -matrix[0];
    result[1] = -matrix[1];
    result[2] = -matrix[2];
    result[3] = -matrix[3];
    result[4] = -matrix[4];
    result[5] = -matrix[5];
    result[6] = -matrix[6];
    result[7] = -matrix[7];
    result[8] = -matrix[8];
    result[9] = -matrix[9];
    result[10] = -matrix[10];
    result[11] = -matrix[11];
    result[12] = -matrix[12];
    result[13] = -matrix[13];
    result[14] = -matrix[14];
    result[15] = -matrix[15];
    return result;
  };

  /**
   * Computes the transpose of the provided matrix.
   *
   * @param {Matrix4} matrix The matrix to transpose.
   * @param {Matrix4} result The object onto which to store the result.
   * @returns {Matrix4} The modified result parameter.
   *
   * @example
   * //returns transpose of a Matrix4
   * // m = [10.0, 11.0, 12.0, 13.0]
   * //     [14.0, 15.0, 16.0, 17.0]
   * //     [18.0, 19.0, 20.0, 21.0]
   * //     [22.0, 23.0, 24.0, 25.0]
   *
   * const a = Cesium.Matrix4.transpose(m, new Cesium.Matrix4());
   *
   * // m remains the same
   * // a = [10.0, 14.0, 18.0, 22.0]
   * //     [11.0, 15.0, 19.0, 23.0]
   * //     [12.0, 16.0, 20.0, 24.0]
   * //     [13.0, 17.0, 21.0, 25.0]
   */
  Matrix4.transpose = function (matrix, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("matrix", matrix);
    Check.Check.typeOf.object("result", result);
    //>>includeEnd('debug');

    const matrix1 = matrix[1];
    const matrix2 = matrix[2];
    const matrix3 = matrix[3];
    const matrix6 = matrix[6];
    const matrix7 = matrix[7];
    const matrix11 = matrix[11];

    result[0] = matrix[0];
    result[1] = matrix[4];
    result[2] = matrix[8];
    result[3] = matrix[12];
    result[4] = matrix1;
    result[5] = matrix[5];
    result[6] = matrix[9];
    result[7] = matrix[13];
    result[8] = matrix2;
    result[9] = matrix6;
    result[10] = matrix[10];
    result[11] = matrix[14];
    result[12] = matrix3;
    result[13] = matrix7;
    result[14] = matrix11;
    result[15] = matrix[15];
    return result;
  };

  /**
   * Computes a matrix, which contains the absolute (unsigned) values of the provided matrix's elements.
   *
   * @param {Matrix4} matrix The matrix with signed elements.
   * @param {Matrix4} result The object onto which to store the result.
   * @returns {Matrix4} The modified result parameter.
   */
  Matrix4.abs = function (matrix, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("matrix", matrix);
    Check.Check.typeOf.object("result", result);
    //>>includeEnd('debug');

    result[0] = Math.abs(matrix[0]);
    result[1] = Math.abs(matrix[1]);
    result[2] = Math.abs(matrix[2]);
    result[3] = Math.abs(matrix[3]);
    result[4] = Math.abs(matrix[4]);
    result[5] = Math.abs(matrix[5]);
    result[6] = Math.abs(matrix[6]);
    result[7] = Math.abs(matrix[7]);
    result[8] = Math.abs(matrix[8]);
    result[9] = Math.abs(matrix[9]);
    result[10] = Math.abs(matrix[10]);
    result[11] = Math.abs(matrix[11]);
    result[12] = Math.abs(matrix[12]);
    result[13] = Math.abs(matrix[13]);
    result[14] = Math.abs(matrix[14]);
    result[15] = Math.abs(matrix[15]);

    return result;
  };

  /**
   * Compares the provided matrices componentwise and returns
   * <code>true</code> if they are equal, <code>false</code> otherwise.
   *
   * @param {Matrix4} [left] The first matrix.
   * @param {Matrix4} [right] The second matrix.
   * @returns {Boolean} <code>true</code> if left and right are equal, <code>false</code> otherwise.
   *
   * @example
   * //compares two Matrix4 instances
   *
   * // a = [10.0, 14.0, 18.0, 22.0]
   * //     [11.0, 15.0, 19.0, 23.0]
   * //     [12.0, 16.0, 20.0, 24.0]
   * //     [13.0, 17.0, 21.0, 25.0]
   *
   * // b = [10.0, 14.0, 18.0, 22.0]
   * //     [11.0, 15.0, 19.0, 23.0]
   * //     [12.0, 16.0, 20.0, 24.0]
   * //     [13.0, 17.0, 21.0, 25.0]
   *
   * if(Cesium.Matrix4.equals(a,b)) {
   *      console.log("Both matrices are equal");
   * } else {
   *      console.log("They are not equal");
   * }
   *
   * //Prints "Both matrices are equal" on the console
   */
  Matrix4.equals = function (left, right) {
    // Given that most matrices will be transformation matrices, the elements
    // are tested in order such that the test is likely to fail as early
    // as possible.  I _think_ this is just as friendly to the L1 cache
    // as testing in index order.  It is certainty faster in practice.
    return (
      left === right ||
      (defined.defined(left) &&
        defined.defined(right) &&
        // Translation
        left[12] === right[12] &&
        left[13] === right[13] &&
        left[14] === right[14] &&
        // Rotation/scale
        left[0] === right[0] &&
        left[1] === right[1] &&
        left[2] === right[2] &&
        left[4] === right[4] &&
        left[5] === right[5] &&
        left[6] === right[6] &&
        left[8] === right[8] &&
        left[9] === right[9] &&
        left[10] === right[10] &&
        // Bottom row
        left[3] === right[3] &&
        left[7] === right[7] &&
        left[11] === right[11] &&
        left[15] === right[15])
    );
  };

  /**
   * Compares the provided matrices componentwise and returns
   * <code>true</code> if they are within the provided epsilon,
   * <code>false</code> otherwise.
   *
   * @param {Matrix4} [left] The first matrix.
   * @param {Matrix4} [right] The second matrix.
   * @param {Number} [epsilon=0] The epsilon to use for equality testing.
   * @returns {Boolean} <code>true</code> if left and right are within the provided epsilon, <code>false</code> otherwise.
   *
   * @example
   * //compares two Matrix4 instances
   *
   * // a = [10.5, 14.5, 18.5, 22.5]
   * //     [11.5, 15.5, 19.5, 23.5]
   * //     [12.5, 16.5, 20.5, 24.5]
   * //     [13.5, 17.5, 21.5, 25.5]
   *
   * // b = [10.0, 14.0, 18.0, 22.0]
   * //     [11.0, 15.0, 19.0, 23.0]
   * //     [12.0, 16.0, 20.0, 24.0]
   * //     [13.0, 17.0, 21.0, 25.0]
   *
   * if(Cesium.Matrix4.equalsEpsilon(a,b,0.1)){
   *      console.log("Difference between both the matrices is less than 0.1");
   * } else {
   *      console.log("Difference between both the matrices is not less than 0.1");
   * }
   *
   * //Prints "Difference between both the matrices is not less than 0.1" on the console
   */
  Matrix4.equalsEpsilon = function (left, right, epsilon) {
    epsilon = defined.defaultValue(epsilon, 0);

    return (
      left === right ||
      (defined.defined(left) &&
        defined.defined(right) &&
        Math.abs(left[0] - right[0]) <= epsilon &&
        Math.abs(left[1] - right[1]) <= epsilon &&
        Math.abs(left[2] - right[2]) <= epsilon &&
        Math.abs(left[3] - right[3]) <= epsilon &&
        Math.abs(left[4] - right[4]) <= epsilon &&
        Math.abs(left[5] - right[5]) <= epsilon &&
        Math.abs(left[6] - right[6]) <= epsilon &&
        Math.abs(left[7] - right[7]) <= epsilon &&
        Math.abs(left[8] - right[8]) <= epsilon &&
        Math.abs(left[9] - right[9]) <= epsilon &&
        Math.abs(left[10] - right[10]) <= epsilon &&
        Math.abs(left[11] - right[11]) <= epsilon &&
        Math.abs(left[12] - right[12]) <= epsilon &&
        Math.abs(left[13] - right[13]) <= epsilon &&
        Math.abs(left[14] - right[14]) <= epsilon &&
        Math.abs(left[15] - right[15]) <= epsilon)
    );
  };

  /**
   * Gets the translation portion of the provided matrix, assuming the matrix is an affine transformation matrix.
   *
   * @param {Matrix4} matrix The matrix to use.
   * @param {Cartesian3} result The object onto which to store the result.
   * @returns {Cartesian3} The modified result parameter.
   */
  Matrix4.getTranslation = function (matrix, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("matrix", matrix);
    Check.Check.typeOf.object("result", result);
    //>>includeEnd('debug');

    result.x = matrix[12];
    result.y = matrix[13];
    result.z = matrix[14];
    return result;
  };

  /**
   * Gets the upper left 3x3 matrix of the provided matrix.
   *
   * @param {Matrix4} matrix The matrix to use.
   * @param {Matrix3} result The object onto which to store the result.
   * @returns {Matrix3} The modified result parameter.
   *
   * @example
   * // returns a Matrix3 instance from a Matrix4 instance
   *
   * // m = [10.0, 14.0, 18.0, 22.0]
   * //     [11.0, 15.0, 19.0, 23.0]
   * //     [12.0, 16.0, 20.0, 24.0]
   * //     [13.0, 17.0, 21.0, 25.0]
   *
   * const b = new Cesium.Matrix3();
   * Cesium.Matrix4.getMatrix3(m,b);
   *
   * // b = [10.0, 14.0, 18.0]
   * //     [11.0, 15.0, 19.0]
   * //     [12.0, 16.0, 20.0]
   */
  Matrix4.getMatrix3 = function (matrix, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("matrix", matrix);
    Check.Check.typeOf.object("result", result);
    //>>includeEnd('debug');

    result[0] = matrix[0];
    result[1] = matrix[1];
    result[2] = matrix[2];
    result[3] = matrix[4];
    result[4] = matrix[5];
    result[5] = matrix[6];
    result[6] = matrix[8];
    result[7] = matrix[9];
    result[8] = matrix[10];
    return result;
  };

  const scratchInverseRotation = new Matrix3();
  const scratchMatrix3Zero = new Matrix3();
  const scratchBottomRow = new Cartesian4();
  const scratchExpectedBottomRow = new Cartesian4(0.0, 0.0, 0.0, 1.0);

  /**
   * Computes the inverse of the provided matrix using Cramers Rule.
   * If the determinant is zero, the matrix can not be inverted, and an exception is thrown.
   * If the matrix is a proper rigid transformation, it is more efficient
   * to invert it with {@link Matrix4.inverseTransformation}.
   *
   * @param {Matrix4} matrix The matrix to invert.
   * @param {Matrix4} result The object onto which to store the result.
   * @returns {Matrix4} The modified result parameter.
   *
   * @exception {RuntimeError} matrix is not invertible because its determinate is zero.
   */
  Matrix4.inverse = function (matrix, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("matrix", matrix);
    Check.Check.typeOf.object("result", result);
    //>>includeEnd('debug');
    //
    // Ported from:
    //   ftp://download.intel.com/design/PentiumIII/sml/24504301.pdf
    //
    const src0 = matrix[0];
    const src1 = matrix[4];
    const src2 = matrix[8];
    const src3 = matrix[12];
    const src4 = matrix[1];
    const src5 = matrix[5];
    const src6 = matrix[9];
    const src7 = matrix[13];
    const src8 = matrix[2];
    const src9 = matrix[6];
    const src10 = matrix[10];
    const src11 = matrix[14];
    const src12 = matrix[3];
    const src13 = matrix[7];
    const src14 = matrix[11];
    const src15 = matrix[15];

    // calculate pairs for first 8 elements (cofactors)
    let tmp0 = src10 * src15;
    let tmp1 = src11 * src14;
    let tmp2 = src9 * src15;
    let tmp3 = src11 * src13;
    let tmp4 = src9 * src14;
    let tmp5 = src10 * src13;
    let tmp6 = src8 * src15;
    let tmp7 = src11 * src12;
    let tmp8 = src8 * src14;
    let tmp9 = src10 * src12;
    let tmp10 = src8 * src13;
    let tmp11 = src9 * src12;

    // calculate first 8 elements (cofactors)
    const dst0 =
      tmp0 * src5 +
      tmp3 * src6 +
      tmp4 * src7 -
      (tmp1 * src5 + tmp2 * src6 + tmp5 * src7);
    const dst1 =
      tmp1 * src4 +
      tmp6 * src6 +
      tmp9 * src7 -
      (tmp0 * src4 + tmp7 * src6 + tmp8 * src7);
    const dst2 =
      tmp2 * src4 +
      tmp7 * src5 +
      tmp10 * src7 -
      (tmp3 * src4 + tmp6 * src5 + tmp11 * src7);
    const dst3 =
      tmp5 * src4 +
      tmp8 * src5 +
      tmp11 * src6 -
      (tmp4 * src4 + tmp9 * src5 + tmp10 * src6);
    const dst4 =
      tmp1 * src1 +
      tmp2 * src2 +
      tmp5 * src3 -
      (tmp0 * src1 + tmp3 * src2 + tmp4 * src3);
    const dst5 =
      tmp0 * src0 +
      tmp7 * src2 +
      tmp8 * src3 -
      (tmp1 * src0 + tmp6 * src2 + tmp9 * src3);
    const dst6 =
      tmp3 * src0 +
      tmp6 * src1 +
      tmp11 * src3 -
      (tmp2 * src0 + tmp7 * src1 + tmp10 * src3);
    const dst7 =
      tmp4 * src0 +
      tmp9 * src1 +
      tmp10 * src2 -
      (tmp5 * src0 + tmp8 * src1 + tmp11 * src2);

    // calculate pairs for second 8 elements (cofactors)
    tmp0 = src2 * src7;
    tmp1 = src3 * src6;
    tmp2 = src1 * src7;
    tmp3 = src3 * src5;
    tmp4 = src1 * src6;
    tmp5 = src2 * src5;
    tmp6 = src0 * src7;
    tmp7 = src3 * src4;
    tmp8 = src0 * src6;
    tmp9 = src2 * src4;
    tmp10 = src0 * src5;
    tmp11 = src1 * src4;

    // calculate second 8 elements (cofactors)
    const dst8 =
      tmp0 * src13 +
      tmp3 * src14 +
      tmp4 * src15 -
      (tmp1 * src13 + tmp2 * src14 + tmp5 * src15);
    const dst9 =
      tmp1 * src12 +
      tmp6 * src14 +
      tmp9 * src15 -
      (tmp0 * src12 + tmp7 * src14 + tmp8 * src15);
    const dst10 =
      tmp2 * src12 +
      tmp7 * src13 +
      tmp10 * src15 -
      (tmp3 * src12 + tmp6 * src13 + tmp11 * src15);
    const dst11 =
      tmp5 * src12 +
      tmp8 * src13 +
      tmp11 * src14 -
      (tmp4 * src12 + tmp9 * src13 + tmp10 * src14);
    const dst12 =
      tmp2 * src10 +
      tmp5 * src11 +
      tmp1 * src9 -
      (tmp4 * src11 + tmp0 * src9 + tmp3 * src10);
    const dst13 =
      tmp8 * src11 +
      tmp0 * src8 +
      tmp7 * src10 -
      (tmp6 * src10 + tmp9 * src11 + tmp1 * src8);
    const dst14 =
      tmp6 * src9 +
      tmp11 * src11 +
      tmp3 * src8 -
      (tmp10 * src11 + tmp2 * src8 + tmp7 * src9);
    const dst15 =
      tmp10 * src10 +
      tmp4 * src8 +
      tmp9 * src9 -
      (tmp8 * src9 + tmp11 * src10 + tmp5 * src8);

    // calculate determinant
    let det = src0 * dst0 + src1 * dst1 + src2 * dst2 + src3 * dst3;

    if (Math.abs(det) < Math$1.CesiumMath.EPSILON21) {
      // Special case for a zero scale matrix that can occur, for example,
      // when a model's node has a [0, 0, 0] scale.
      if (
        Matrix3.equalsEpsilon(
          Matrix4.getMatrix3(matrix, scratchInverseRotation),
          scratchMatrix3Zero,
          Math$1.CesiumMath.EPSILON7
        ) &&
        Cartesian4.equals(
          Matrix4.getRow(matrix, 3, scratchBottomRow),
          scratchExpectedBottomRow
        )
      ) {
        result[0] = 0.0;
        result[1] = 0.0;
        result[2] = 0.0;
        result[3] = 0.0;
        result[4] = 0.0;
        result[5] = 0.0;
        result[6] = 0.0;
        result[7] = 0.0;
        result[8] = 0.0;
        result[9] = 0.0;
        result[10] = 0.0;
        result[11] = 0.0;
        result[12] = -matrix[12];
        result[13] = -matrix[13];
        result[14] = -matrix[14];
        result[15] = 1.0;
        return result;
      }

      throw new RuntimeError.RuntimeError(
        "matrix is not invertible because its determinate is zero."
      );
    }

    // calculate matrix inverse
    det = 1.0 / det;

    result[0] = dst0 * det;
    result[1] = dst1 * det;
    result[2] = dst2 * det;
    result[3] = dst3 * det;
    result[4] = dst4 * det;
    result[5] = dst5 * det;
    result[6] = dst6 * det;
    result[7] = dst7 * det;
    result[8] = dst8 * det;
    result[9] = dst9 * det;
    result[10] = dst10 * det;
    result[11] = dst11 * det;
    result[12] = dst12 * det;
    result[13] = dst13 * det;
    result[14] = dst14 * det;
    result[15] = dst15 * det;
    return result;
  };

  /**
   * Computes the inverse of the provided matrix assuming it is a proper rigid matrix,
   * where the upper left 3x3 elements are a rotation matrix,
   * and the upper three elements in the fourth column are the translation.
   * The bottom row is assumed to be [0, 0, 0, 1].
   * The matrix is not verified to be in the proper form.
   * This method is faster than computing the inverse for a general 4x4
   * matrix using {@link Matrix4.inverse}.
   *
   * @param {Matrix4} matrix The matrix to invert.
   * @param {Matrix4} result The object onto which to store the result.
   * @returns {Matrix4} The modified result parameter.
   */
  Matrix4.inverseTransformation = function (matrix, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("matrix", matrix);
    Check.Check.typeOf.object("result", result);
    //>>includeEnd('debug');

    //This function is an optimized version of the below 4 lines.
    //const rT = Matrix3.transpose(Matrix4.getMatrix3(matrix));
    //const rTN = Matrix3.negate(rT);
    //const rTT = Matrix3.multiplyByVector(rTN, Matrix4.getTranslation(matrix));
    //return Matrix4.fromRotationTranslation(rT, rTT, result);

    const matrix0 = matrix[0];
    const matrix1 = matrix[1];
    const matrix2 = matrix[2];
    const matrix4 = matrix[4];
    const matrix5 = matrix[5];
    const matrix6 = matrix[6];
    const matrix8 = matrix[8];
    const matrix9 = matrix[9];
    const matrix10 = matrix[10];

    const vX = matrix[12];
    const vY = matrix[13];
    const vZ = matrix[14];

    const x = -matrix0 * vX - matrix1 * vY - matrix2 * vZ;
    const y = -matrix4 * vX - matrix5 * vY - matrix6 * vZ;
    const z = -matrix8 * vX - matrix9 * vY - matrix10 * vZ;

    result[0] = matrix0;
    result[1] = matrix4;
    result[2] = matrix8;
    result[3] = 0.0;
    result[4] = matrix1;
    result[5] = matrix5;
    result[6] = matrix9;
    result[7] = 0.0;
    result[8] = matrix2;
    result[9] = matrix6;
    result[10] = matrix10;
    result[11] = 0.0;
    result[12] = x;
    result[13] = y;
    result[14] = z;
    result[15] = 1.0;
    return result;
  };

  const scratchTransposeMatrix = new Matrix4();

  /**
   * Computes the inverse transpose of a matrix.
   *
   * @param {Matrix4} matrix The matrix to transpose and invert.
   * @param {Matrix4} result The object onto which to store the result.
   * @returns {Matrix4} The modified result parameter.
   */
  Matrix4.inverseTranspose = function (matrix, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("matrix", matrix);
    Check.Check.typeOf.object("result", result);
    //>>includeEnd('debug');

    return Matrix4.inverse(
      Matrix4.transpose(matrix, scratchTransposeMatrix),
      result
    );
  };

  /**
   * An immutable Matrix4 instance initialized to the identity matrix.
   *
   * @type {Matrix4}
   * @constant
   */
  Matrix4.IDENTITY = Object.freeze(
    new Matrix4(
      1.0,
      0.0,
      0.0,
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,
      0.0,
      0.0,
      1.0
    )
  );

  /**
   * An immutable Matrix4 instance initialized to the zero matrix.
   *
   * @type {Matrix4}
   * @constant
   */
  Matrix4.ZERO = Object.freeze(
    new Matrix4(
      0.0,
      0.0,
      0.0,
      0.0,
      0.0,
      0.0,
      0.0,
      0.0,
      0.0,
      0.0,
      0.0,
      0.0,
      0.0,
      0.0,
      0.0,
      0.0
    )
  );

  /**
   * The index into Matrix4 for column 0, row 0.
   *
   * @type {Number}
   * @constant
   */
  Matrix4.COLUMN0ROW0 = 0;

  /**
   * The index into Matrix4 for column 0, row 1.
   *
   * @type {Number}
   * @constant
   */
  Matrix4.COLUMN0ROW1 = 1;

  /**
   * The index into Matrix4 for column 0, row 2.
   *
   * @type {Number}
   * @constant
   */
  Matrix4.COLUMN0ROW2 = 2;

  /**
   * The index into Matrix4 for column 0, row 3.
   *
   * @type {Number}
   * @constant
   */
  Matrix4.COLUMN0ROW3 = 3;

  /**
   * The index into Matrix4 for column 1, row 0.
   *
   * @type {Number}
   * @constant
   */
  Matrix4.COLUMN1ROW0 = 4;

  /**
   * The index into Matrix4 for column 1, row 1.
   *
   * @type {Number}
   * @constant
   */
  Matrix4.COLUMN1ROW1 = 5;

  /**
   * The index into Matrix4 for column 1, row 2.
   *
   * @type {Number}
   * @constant
   */
  Matrix4.COLUMN1ROW2 = 6;

  /**
   * The index into Matrix4 for column 1, row 3.
   *
   * @type {Number}
   * @constant
   */
  Matrix4.COLUMN1ROW3 = 7;

  /**
   * The index into Matrix4 for column 2, row 0.
   *
   * @type {Number}
   * @constant
   */
  Matrix4.COLUMN2ROW0 = 8;

  /**
   * The index into Matrix4 for column 2, row 1.
   *
   * @type {Number}
   * @constant
   */
  Matrix4.COLUMN2ROW1 = 9;

  /**
   * The index into Matrix4 for column 2, row 2.
   *
   * @type {Number}
   * @constant
   */
  Matrix4.COLUMN2ROW2 = 10;

  /**
   * The index into Matrix4 for column 2, row 3.
   *
   * @type {Number}
   * @constant
   */
  Matrix4.COLUMN2ROW3 = 11;

  /**
   * The index into Matrix4 for column 3, row 0.
   *
   * @type {Number}
   * @constant
   */
  Matrix4.COLUMN3ROW0 = 12;

  /**
   * The index into Matrix4 for column 3, row 1.
   *
   * @type {Number}
   * @constant
   */
  Matrix4.COLUMN3ROW1 = 13;

  /**
   * The index into Matrix4 for column 3, row 2.
   *
   * @type {Number}
   * @constant
   */
  Matrix4.COLUMN3ROW2 = 14;

  /**
   * The index into Matrix4 for column 3, row 3.
   *
   * @type {Number}
   * @constant
   */
  Matrix4.COLUMN3ROW3 = 15;

  Object.defineProperties(Matrix4.prototype, {
    /**
     * Gets the number of items in the collection.
     * @memberof Matrix4.prototype
     *
     * @type {Number}
     */
    length: {
      get: function () {
        return Matrix4.packedLength;
      },
    },
  });

  /**
   * Duplicates the provided Matrix4 instance.
   *
   * @param {Matrix4} [result] The object onto which to store the result.
   * @returns {Matrix4} The modified result parameter or a new Matrix4 instance if one was not provided.
   */
  Matrix4.prototype.clone = function (result) {
    return Matrix4.clone(this, result);
  };

  /**
   * Compares this matrix to the provided matrix componentwise and returns
   * <code>true</code> if they are equal, <code>false</code> otherwise.
   *
   * @param {Matrix4} [right] The right hand side matrix.
   * @returns {Boolean} <code>true</code> if they are equal, <code>false</code> otherwise.
   */
  Matrix4.prototype.equals = function (right) {
    return Matrix4.equals(this, right);
  };

  /**
   * @private
   */
  Matrix4.equalsArray = function (matrix, array, offset) {
    return (
      matrix[0] === array[offset] &&
      matrix[1] === array[offset + 1] &&
      matrix[2] === array[offset + 2] &&
      matrix[3] === array[offset + 3] &&
      matrix[4] === array[offset + 4] &&
      matrix[5] === array[offset + 5] &&
      matrix[6] === array[offset + 6] &&
      matrix[7] === array[offset + 7] &&
      matrix[8] === array[offset + 8] &&
      matrix[9] === array[offset + 9] &&
      matrix[10] === array[offset + 10] &&
      matrix[11] === array[offset + 11] &&
      matrix[12] === array[offset + 12] &&
      matrix[13] === array[offset + 13] &&
      matrix[14] === array[offset + 14] &&
      matrix[15] === array[offset + 15]
    );
  };

  /**
   * Compares this matrix to the provided matrix componentwise and returns
   * <code>true</code> if they are within the provided epsilon,
   * <code>false</code> otherwise.
   *
   * @param {Matrix4} [right] The right hand side matrix.
   * @param {Number} [epsilon=0] The epsilon to use for equality testing.
   * @returns {Boolean} <code>true</code> if they are within the provided epsilon, <code>false</code> otherwise.
   */
  Matrix4.prototype.equalsEpsilon = function (right, epsilon) {
    return Matrix4.equalsEpsilon(this, right, epsilon);
  };

  /**
   * Computes a string representing this Matrix with each row being
   * on a separate line and in the format '(column0, column1, column2, column3)'.
   *
   * @returns {String} A string representing the provided Matrix with each row being on a separate line and in the format '(column0, column1, column2, column3)'.
   */
  Matrix4.prototype.toString = function () {
    return (
      `(${this[0]}, ${this[4]}, ${this[8]}, ${this[12]})\n` +
      `(${this[1]}, ${this[5]}, ${this[9]}, ${this[13]})\n` +
      `(${this[2]}, ${this[6]}, ${this[10]}, ${this[14]})\n` +
      `(${this[3]}, ${this[7]}, ${this[11]}, ${this[15]})`
    );
  };

  /**
   * A 2x2 matrix, indexable as a column-major order array.
   * Constructor parameters are in row-major order for code readability.
   * @alias Matrix2
   * @constructor
   * @implements {ArrayLike<number>}
   *
   * @param {Number} [column0Row0=0.0] The value for column 0, row 0.
   * @param {Number} [column1Row0=0.0] The value for column 1, row 0.
   * @param {Number} [column0Row1=0.0] The value for column 0, row 1.
   * @param {Number} [column1Row1=0.0] The value for column 1, row 1.
   *
   * @see Matrix2.fromArray
   * @see Matrix2.fromColumnMajorArray
   * @see Matrix2.fromRowMajorArray
   * @see Matrix2.fromScale
   * @see Matrix2.fromUniformScale
   * @see Matrix2.fromRotation
   * @see Matrix3
   * @see Matrix4
   */
  function Matrix2(column0Row0, column1Row0, column0Row1, column1Row1) {
    this[0] = defined.defaultValue(column0Row0, 0.0);
    this[1] = defined.defaultValue(column0Row1, 0.0);
    this[2] = defined.defaultValue(column1Row0, 0.0);
    this[3] = defined.defaultValue(column1Row1, 0.0);
  }

  /**
   * The number of elements used to pack the object into an array.
   * @type {Number}
   */
  Matrix2.packedLength = 4;

  /**
   * Stores the provided instance into the provided array.
   *
   * @param {Matrix2} value The value to pack.
   * @param {Number[]} array The array to pack into.
   * @param {Number} [startingIndex=0] The index into the array at which to start packing the elements.
   *
   * @returns {Number[]} The array that was packed into
   */
  Matrix2.pack = function (value, array, startingIndex) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("value", value);
    Check.Check.defined("array", array);
    //>>includeEnd('debug');

    startingIndex = defined.defaultValue(startingIndex, 0);

    array[startingIndex++] = value[0];
    array[startingIndex++] = value[1];
    array[startingIndex++] = value[2];
    array[startingIndex++] = value[3];

    return array;
  };

  /**
   * Retrieves an instance from a packed array.
   *
   * @param {Number[]} array The packed array.
   * @param {Number} [startingIndex=0] The starting index of the element to be unpacked.
   * @param {Matrix2} [result] The object into which to store the result.
   * @returns {Matrix2} The modified result parameter or a new Matrix2 instance if one was not provided.
   */
  Matrix2.unpack = function (array, startingIndex, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.defined("array", array);
    //>>includeEnd('debug');

    startingIndex = defined.defaultValue(startingIndex, 0);

    if (!defined.defined(result)) {
      result = new Matrix2();
    }

    result[0] = array[startingIndex++];
    result[1] = array[startingIndex++];
    result[2] = array[startingIndex++];
    result[3] = array[startingIndex++];
    return result;
  };

  /**
   * Flattens an array of Matrix2s into an array of components. The components
   * are stored in column-major order.
   *
   * @param {Matrix2[]} array The array of matrices to pack.
   * @param {Number[]} [result] The array onto which to store the result. If this is a typed array, it must have array.length * 4 components, else a {@link DeveloperError} will be thrown. If it is a regular array, it will be resized to have (array.length * 4) elements.
   * @returns {Number[]} The packed array.
   */
  Matrix2.packArray = function (array, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.defined("array", array);
    //>>includeEnd('debug');

    const length = array.length;
    const resultLength = length * 4;
    if (!defined.defined(result)) {
      result = new Array(resultLength);
    } else if (!Array.isArray(result) && result.length !== resultLength) {
      //>>includeStart('debug', pragmas.debug);
      throw new Check.DeveloperError(
        "If result is a typed array, it must have exactly array.length * 4 elements"
      );
      //>>includeEnd('debug');
    } else if (result.length !== resultLength) {
      result.length = resultLength;
    }

    for (let i = 0; i < length; ++i) {
      Matrix2.pack(array[i], result, i * 4);
    }
    return result;
  };

  /**
   * Unpacks an array of column-major matrix components into an array of Matrix2s.
   *
   * @param {Number[]} array The array of components to unpack.
   * @param {Matrix2[]} [result] The array onto which to store the result.
   * @returns {Matrix2[]} The unpacked array.
   */
  Matrix2.unpackArray = function (array, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.defined("array", array);
    Check.Check.typeOf.number.greaterThanOrEquals("array.length", array.length, 4);
    if (array.length % 4 !== 0) {
      throw new Check.DeveloperError("array length must be a multiple of 4.");
    }
    //>>includeEnd('debug');

    const length = array.length;
    if (!defined.defined(result)) {
      result = new Array(length / 4);
    } else {
      result.length = length / 4;
    }

    for (let i = 0; i < length; i += 4) {
      const index = i / 4;
      result[index] = Matrix2.unpack(array, i, result[index]);
    }
    return result;
  };

  /**
   * Duplicates a Matrix2 instance.
   *
   * @param {Matrix2} matrix The matrix to duplicate.
   * @param {Matrix2} [result] The object onto which to store the result.
   * @returns {Matrix2} The modified result parameter or a new Matrix2 instance if one was not provided. (Returns undefined if matrix is undefined)
   */
  Matrix2.clone = function (matrix, result) {
    if (!defined.defined(matrix)) {
      return undefined;
    }
    if (!defined.defined(result)) {
      return new Matrix2(matrix[0], matrix[2], matrix[1], matrix[3]);
    }
    result[0] = matrix[0];
    result[1] = matrix[1];
    result[2] = matrix[2];
    result[3] = matrix[3];
    return result;
  };

  /**
   * Creates a Matrix2 from 4 consecutive elements in an array.
   *
   * @function
   * @param {Number[]} array The array whose 4 consecutive elements correspond to the positions of the matrix.  Assumes column-major order.
   * @param {Number} [startingIndex=0] The offset into the array of the first element, which corresponds to first column first row position in the matrix.
   * @param {Matrix2} [result] The object onto which to store the result.
   * @returns {Matrix2} The modified result parameter or a new Matrix2 instance if one was not provided.
   *
   * @example
   * // Create the Matrix2:
   * // [1.0, 2.0]
   * // [1.0, 2.0]
   *
   * const v = [1.0, 1.0, 2.0, 2.0];
   * const m = Cesium.Matrix2.fromArray(v);
   *
   * // Create same Matrix2 with using an offset into an array
   * const v2 = [0.0, 0.0, 1.0, 1.0, 2.0, 2.0];
   * const m2 = Cesium.Matrix2.fromArray(v2, 2);
   */
  Matrix2.fromArray = Matrix2.unpack;
  /**
   * Creates a Matrix2 instance from a column-major order array.
   *
   * @param {Number[]} values The column-major order array.
   * @param {Matrix2} [result] The object in which the result will be stored, if undefined a new instance will be created.
   * @returns {Matrix2} The modified result parameter, or a new Matrix2 instance if one was not provided.
   */
  Matrix2.fromColumnMajorArray = function (values, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.defined("values", values);
    //>>includeEnd('debug');

    return Matrix2.clone(values, result);
  };

  /**
   * Creates a Matrix2 instance from a row-major order array.
   * The resulting matrix will be in column-major order.
   *
   * @param {Number[]} values The row-major order array.
   * @param {Matrix2} [result] The object in which the result will be stored, if undefined a new instance will be created.
   * @returns {Matrix2} The modified result parameter, or a new Matrix2 instance if one was not provided.
   */
  Matrix2.fromRowMajorArray = function (values, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.defined("values", values);
    //>>includeEnd('debug');

    if (!defined.defined(result)) {
      return new Matrix2(values[0], values[1], values[2], values[3]);
    }
    result[0] = values[0];
    result[1] = values[2];
    result[2] = values[1];
    result[3] = values[3];
    return result;
  };

  /**
   * Computes a Matrix2 instance representing a non-uniform scale.
   *
   * @param {Cartesian2} scale The x and y scale factors.
   * @param {Matrix2} [result] The object in which the result will be stored, if undefined a new instance will be created.
   * @returns {Matrix2} The modified result parameter, or a new Matrix2 instance if one was not provided.
   *
   * @example
   * // Creates
   * //   [7.0, 0.0]
   * //   [0.0, 8.0]
   * const m = Cesium.Matrix2.fromScale(new Cesium.Cartesian2(7.0, 8.0));
   */
  Matrix2.fromScale = function (scale, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("scale", scale);
    //>>includeEnd('debug');

    if (!defined.defined(result)) {
      return new Matrix2(scale.x, 0.0, 0.0, scale.y);
    }

    result[0] = scale.x;
    result[1] = 0.0;
    result[2] = 0.0;
    result[3] = scale.y;
    return result;
  };

  /**
   * Computes a Matrix2 instance representing a uniform scale.
   *
   * @param {Number} scale The uniform scale factor.
   * @param {Matrix2} [result] The object in which the result will be stored, if undefined a new instance will be created.
   * @returns {Matrix2} The modified result parameter, or a new Matrix2 instance if one was not provided.
   *
   * @example
   * // Creates
   * //   [2.0, 0.0]
   * //   [0.0, 2.0]
   * const m = Cesium.Matrix2.fromUniformScale(2.0);
   */
  Matrix2.fromUniformScale = function (scale, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.number("scale", scale);
    //>>includeEnd('debug');

    if (!defined.defined(result)) {
      return new Matrix2(scale, 0.0, 0.0, scale);
    }

    result[0] = scale;
    result[1] = 0.0;
    result[2] = 0.0;
    result[3] = scale;
    return result;
  };

  /**
   * Creates a rotation matrix.
   *
   * @param {Number} angle The angle, in radians, of the rotation.  Positive angles are counterclockwise.
   * @param {Matrix2} [result] The object in which the result will be stored, if undefined a new instance will be created.
   * @returns {Matrix2} The modified result parameter, or a new Matrix2 instance if one was not provided.
   *
   * @example
   * // Rotate a point 45 degrees counterclockwise.
   * const p = new Cesium.Cartesian2(5, 6);
   * const m = Cesium.Matrix2.fromRotation(Cesium.Math.toRadians(45.0));
   * const rotated = Cesium.Matrix2.multiplyByVector(m, p, new Cesium.Cartesian2());
   */
  Matrix2.fromRotation = function (angle, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.number("angle", angle);
    //>>includeEnd('debug');

    const cosAngle = Math.cos(angle);
    const sinAngle = Math.sin(angle);

    if (!defined.defined(result)) {
      return new Matrix2(cosAngle, -sinAngle, sinAngle, cosAngle);
    }
    result[0] = cosAngle;
    result[1] = sinAngle;
    result[2] = -sinAngle;
    result[3] = cosAngle;
    return result;
  };

  /**
   * Creates an Array from the provided Matrix2 instance.
   * The array will be in column-major order.
   *
   * @param {Matrix2} matrix The matrix to use..
   * @param {Number[]} [result] The Array onto which to store the result.
   * @returns {Number[]} The modified Array parameter or a new Array instance if one was not provided.
   */
  Matrix2.toArray = function (matrix, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("matrix", matrix);
    //>>includeEnd('debug');

    if (!defined.defined(result)) {
      return [matrix[0], matrix[1], matrix[2], matrix[3]];
    }
    result[0] = matrix[0];
    result[1] = matrix[1];
    result[2] = matrix[2];
    result[3] = matrix[3];
    return result;
  };

  /**
   * Computes the array index of the element at the provided row and column.
   *
   * @param {Number} row The zero-based index of the row.
   * @param {Number} column The zero-based index of the column.
   * @returns {Number} The index of the element at the provided row and column.
   *
   * @exception {DeveloperError} row must be 0 or 1.
   * @exception {DeveloperError} column must be 0 or 1.
   *
   * @example
   * const myMatrix = new Cesium.Matrix2();
   * const column1Row0Index = Cesium.Matrix2.getElementIndex(1, 0);
   * const column1Row0 = myMatrix[column1Row0Index]
   * myMatrix[column1Row0Index] = 10.0;
   */
  Matrix2.getElementIndex = function (column, row) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.number.greaterThanOrEquals("row", row, 0);
    Check.Check.typeOf.number.lessThanOrEquals("row", row, 1);

    Check.Check.typeOf.number.greaterThanOrEquals("column", column, 0);
    Check.Check.typeOf.number.lessThanOrEquals("column", column, 1);
    //>>includeEnd('debug');

    return column * 2 + row;
  };

  /**
   * Retrieves a copy of the matrix column at the provided index as a Cartesian2 instance.
   *
   * @param {Matrix2} matrix The matrix to use.
   * @param {Number} index The zero-based index of the column to retrieve.
   * @param {Cartesian2} result The object onto which to store the result.
   * @returns {Cartesian2} The modified result parameter.
   *
   * @exception {DeveloperError} index must be 0 or 1.
   */
  Matrix2.getColumn = function (matrix, index, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("matrix", matrix);

    Check.Check.typeOf.number.greaterThanOrEquals("index", index, 0);
    Check.Check.typeOf.number.lessThanOrEquals("index", index, 1);

    Check.Check.typeOf.object("result", result);
    //>>includeEnd('debug');

    const startIndex = index * 2;
    const x = matrix[startIndex];
    const y = matrix[startIndex + 1];

    result.x = x;
    result.y = y;
    return result;
  };

  /**
   * Computes a new matrix that replaces the specified column in the provided matrix with the provided Cartesian2 instance.
   *
   * @param {Matrix2} matrix The matrix to use.
   * @param {Number} index The zero-based index of the column to set.
   * @param {Cartesian2} cartesian The Cartesian whose values will be assigned to the specified column.
   * @param {Cartesian2} result The object onto which to store the result.
   * @returns {Matrix2} The modified result parameter.
   *
   * @exception {DeveloperError} index must be 0 or 1.
   */
  Matrix2.setColumn = function (matrix, index, cartesian, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("matrix", matrix);

    Check.Check.typeOf.number.greaterThanOrEquals("index", index, 0);
    Check.Check.typeOf.number.lessThanOrEquals("index", index, 1);

    Check.Check.typeOf.object("cartesian", cartesian);
    Check.Check.typeOf.object("result", result);
    //>>includeEnd('debug');

    result = Matrix2.clone(matrix, result);
    const startIndex = index * 2;
    result[startIndex] = cartesian.x;
    result[startIndex + 1] = cartesian.y;
    return result;
  };

  /**
   * Retrieves a copy of the matrix row at the provided index as a Cartesian2 instance.
   *
   * @param {Matrix2} matrix The matrix to use.
   * @param {Number} index The zero-based index of the row to retrieve.
   * @param {Cartesian2} result The object onto which to store the result.
   * @returns {Cartesian2} The modified result parameter.
   *
   * @exception {DeveloperError} index must be 0 or 1.
   */
  Matrix2.getRow = function (matrix, index, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("matrix", matrix);

    Check.Check.typeOf.number.greaterThanOrEquals("index", index, 0);
    Check.Check.typeOf.number.lessThanOrEquals("index", index, 1);

    Check.Check.typeOf.object("result", result);
    //>>includeEnd('debug');

    const x = matrix[index];
    const y = matrix[index + 2];

    result.x = x;
    result.y = y;
    return result;
  };

  /**
   * Computes a new matrix that replaces the specified row in the provided matrix with the provided Cartesian2 instance.
   *
   * @param {Matrix2} matrix The matrix to use.
   * @param {Number} index The zero-based index of the row to set.
   * @param {Cartesian2} cartesian The Cartesian whose values will be assigned to the specified row.
   * @param {Matrix2} result The object onto which to store the result.
   * @returns {Matrix2} The modified result parameter.
   *
   * @exception {DeveloperError} index must be 0 or 1.
   */
  Matrix2.setRow = function (matrix, index, cartesian, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("matrix", matrix);

    Check.Check.typeOf.number.greaterThanOrEquals("index", index, 0);
    Check.Check.typeOf.number.lessThanOrEquals("index", index, 1);

    Check.Check.typeOf.object("cartesian", cartesian);
    Check.Check.typeOf.object("result", result);
    //>>includeEnd('debug');

    result = Matrix2.clone(matrix, result);
    result[index] = cartesian.x;
    result[index + 2] = cartesian.y;
    return result;
  };

  const scaleScratch1 = new Cartesian2.Cartesian2();

  /**
   * Computes a new matrix that replaces the scale with the provided scale.
   * This assumes the matrix is an affine transformation.
   *
   * @param {Matrix2} matrix The matrix to use.
   * @param {Cartesian2} scale The scale that replaces the scale of the provided matrix.
   * @param {Matrix2} result The object onto which to store the result.
   * @returns {Matrix2} The modified result parameter.
   *
   * @see Matrix2.setUniformScale
   * @see Matrix2.fromScale
   * @see Matrix2.fromUniformScale
   * @see Matrix2.multiplyByScale
   * @see Matrix2.multiplyByUniformScale
   * @see Matrix2.getScale
   */
  Matrix2.setScale = function (matrix, scale, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("matrix", matrix);
    Check.Check.typeOf.object("scale", scale);
    Check.Check.typeOf.object("result", result);
    //>>includeEnd('debug');

    const existingScale = Matrix2.getScale(matrix, scaleScratch1);
    const scaleRatioX = scale.x / existingScale.x;
    const scaleRatioY = scale.y / existingScale.y;

    result[0] = matrix[0] * scaleRatioX;
    result[1] = matrix[1] * scaleRatioX;
    result[2] = matrix[2] * scaleRatioY;
    result[3] = matrix[3] * scaleRatioY;

    return result;
  };

  const scaleScratch2 = new Cartesian2.Cartesian2();

  /**
   * Computes a new matrix that replaces the scale with the provided uniform scale.
   * This assumes the matrix is an affine transformation.
   *
   * @param {Matrix2} matrix The matrix to use.
   * @param {Number} scale The uniform scale that replaces the scale of the provided matrix.
   * @param {Matrix2} result The object onto which to store the result.
   * @returns {Matrix2} The modified result parameter.
   *
   * @see Matrix2.setScale
   * @see Matrix2.fromScale
   * @see Matrix2.fromUniformScale
   * @see Matrix2.multiplyByScale
   * @see Matrix2.multiplyByUniformScale
   * @see Matrix2.getScale
   */
  Matrix2.setUniformScale = function (matrix, scale, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("matrix", matrix);
    Check.Check.typeOf.number("scale", scale);
    Check.Check.typeOf.object("result", result);
    //>>includeEnd('debug');

    const existingScale = Matrix2.getScale(matrix, scaleScratch2);
    const scaleRatioX = scale / existingScale.x;
    const scaleRatioY = scale / existingScale.y;

    result[0] = matrix[0] * scaleRatioX;
    result[1] = matrix[1] * scaleRatioX;
    result[2] = matrix[2] * scaleRatioY;
    result[3] = matrix[3] * scaleRatioY;

    return result;
  };

  const scratchColumn = new Cartesian2.Cartesian2();

  /**
   * Extracts the non-uniform scale assuming the matrix is an affine transformation.
   *
   * @param {Matrix2} matrix The matrix.
   * @param {Cartesian2} result The object onto which to store the result.
   * @returns {Cartesian2} The modified result parameter.
   *
   * @see Matrix2.multiplyByScale
   * @see Matrix2.multiplyByUniformScale
   * @see Matrix2.fromScale
   * @see Matrix2.fromUniformScale
   * @see Matrix2.setScale
   * @see Matrix2.setUniformScale
   */
  Matrix2.getScale = function (matrix, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("matrix", matrix);
    Check.Check.typeOf.object("result", result);
    //>>includeEnd('debug');

    result.x = Cartesian2.Cartesian2.magnitude(
      Cartesian2.Cartesian2.fromElements(matrix[0], matrix[1], scratchColumn)
    );
    result.y = Cartesian2.Cartesian2.magnitude(
      Cartesian2.Cartesian2.fromElements(matrix[2], matrix[3], scratchColumn)
    );
    return result;
  };

  const scaleScratch3 = new Cartesian2.Cartesian2();

  /**
   * Computes the maximum scale assuming the matrix is an affine transformation.
   * The maximum scale is the maximum length of the column vectors.
   *
   * @param {Matrix2} matrix The matrix.
   * @returns {Number} The maximum scale.
   */
  Matrix2.getMaximumScale = function (matrix) {
    Matrix2.getScale(matrix, scaleScratch3);
    return Cartesian2.Cartesian2.maximumComponent(scaleScratch3);
  };

  const scaleScratch4 = new Cartesian2.Cartesian2();

  /**
   * Sets the rotation assuming the matrix is an affine transformation.
   *
   * @param {Matrix2} matrix The matrix.
   * @param {Matrix2} rotation The rotation matrix.
   * @returns {Matrix2} The modified result parameter.
   *
   * @see Matrix2.fromRotation
   * @see Matrix2.getRotation
   */
  Matrix2.setRotation = function (matrix, rotation, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("matrix", matrix);
    Check.Check.typeOf.object("result", result);
    //>>includeEnd('debug');

    const scale = Matrix2.getScale(matrix, scaleScratch4);

    result[0] = rotation[0] * scale.x;
    result[1] = rotation[1] * scale.x;
    result[2] = rotation[2] * scale.y;
    result[3] = rotation[3] * scale.y;

    return result;
  };

  const scaleScratch5 = new Cartesian2.Cartesian2();

  /**
   * Extracts the rotation matrix assuming the matrix is an affine transformation.
   *
   * @param {Matrix2} matrix The matrix.
   * @param {Matrix2} result The object onto which to store the result.
   * @returns {Matrix2} The modified result parameter.
   *
   * @see Matrix2.setRotation
   * @see Matrix2.fromRotation
   */
  Matrix2.getRotation = function (matrix, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("matrix", matrix);
    Check.Check.typeOf.object("result", result);
    //>>includeEnd('debug');

    const scale = Matrix2.getScale(matrix, scaleScratch5);

    result[0] = matrix[0] / scale.x;
    result[1] = matrix[1] / scale.x;
    result[2] = matrix[2] / scale.y;
    result[3] = matrix[3] / scale.y;

    return result;
  };

  /**
   * Computes the product of two matrices.
   *
   * @param {Matrix2} left The first matrix.
   * @param {Matrix2} right The second matrix.
   * @param {Matrix2} result The object onto which to store the result.
   * @returns {Matrix2} The modified result parameter.
   */
  Matrix2.multiply = function (left, right, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("left", left);
    Check.Check.typeOf.object("right", right);
    Check.Check.typeOf.object("result", result);
    //>>includeEnd('debug');

    const column0Row0 = left[0] * right[0] + left[2] * right[1];
    const column1Row0 = left[0] * right[2] + left[2] * right[3];
    const column0Row1 = left[1] * right[0] + left[3] * right[1];
    const column1Row1 = left[1] * right[2] + left[3] * right[3];

    result[0] = column0Row0;
    result[1] = column0Row1;
    result[2] = column1Row0;
    result[3] = column1Row1;
    return result;
  };

  /**
   * Computes the sum of two matrices.
   *
   * @param {Matrix2} left The first matrix.
   * @param {Matrix2} right The second matrix.
   * @param {Matrix2} result The object onto which to store the result.
   * @returns {Matrix2} The modified result parameter.
   */
  Matrix2.add = function (left, right, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("left", left);
    Check.Check.typeOf.object("right", right);
    Check.Check.typeOf.object("result", result);
    //>>includeEnd('debug');

    result[0] = left[0] + right[0];
    result[1] = left[1] + right[1];
    result[2] = left[2] + right[2];
    result[3] = left[3] + right[3];
    return result;
  };

  /**
   * Computes the difference of two matrices.
   *
   * @param {Matrix2} left The first matrix.
   * @param {Matrix2} right The second matrix.
   * @param {Matrix2} result The object onto which to store the result.
   * @returns {Matrix2} The modified result parameter.
   */
  Matrix2.subtract = function (left, right, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("left", left);
    Check.Check.typeOf.object("right", right);
    Check.Check.typeOf.object("result", result);
    //>>includeEnd('debug');

    result[0] = left[0] - right[0];
    result[1] = left[1] - right[1];
    result[2] = left[2] - right[2];
    result[3] = left[3] - right[3];
    return result;
  };

  /**
   * Computes the product of a matrix and a column vector.
   *
   * @param {Matrix2} matrix The matrix.
   * @param {Cartesian2} cartesian The column.
   * @param {Cartesian2} result The object onto which to store the result.
   * @returns {Cartesian2} The modified result parameter.
   */
  Matrix2.multiplyByVector = function (matrix, cartesian, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("matrix", matrix);
    Check.Check.typeOf.object("cartesian", cartesian);
    Check.Check.typeOf.object("result", result);
    //>>includeEnd('debug');

    const x = matrix[0] * cartesian.x + matrix[2] * cartesian.y;
    const y = matrix[1] * cartesian.x + matrix[3] * cartesian.y;

    result.x = x;
    result.y = y;
    return result;
  };

  /**
   * Computes the product of a matrix and a scalar.
   *
   * @param {Matrix2} matrix The matrix.
   * @param {Number} scalar The number to multiply by.
   * @param {Matrix2} result The object onto which to store the result.
   * @returns {Matrix2} The modified result parameter.
   */
  Matrix2.multiplyByScalar = function (matrix, scalar, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("matrix", matrix);
    Check.Check.typeOf.number("scalar", scalar);
    Check.Check.typeOf.object("result", result);
    //>>includeEnd('debug');

    result[0] = matrix[0] * scalar;
    result[1] = matrix[1] * scalar;
    result[2] = matrix[2] * scalar;
    result[3] = matrix[3] * scalar;
    return result;
  };

  /**
   * Computes the product of a matrix times a (non-uniform) scale, as if the scale were a scale matrix.
   *
   * @param {Matrix2} matrix The matrix on the left-hand side.
   * @param {Number} scale The non-uniform scale on the right-hand side.
   * @param {Matrix2} result The object onto which to store the result.
   * @returns {Matrix2} The modified result parameter.
   *
   *
   * @example
   * // Instead of Cesium.Matrix2.multiply(m, Cesium.Matrix2.fromScale(scale), m);
   * Cesium.Matrix2.multiplyByScale(m, scale, m);
   *
   * @see Matrix2.multiplyByUniformScale
   * @see Matrix2.fromScale
   * @see Matrix2.fromUniformScale
   * @see Matrix2.setScale
   * @see Matrix2.setUniformScale
   * @see Matrix2.getScale
   */
  Matrix2.multiplyByScale = function (matrix, scale, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("matrix", matrix);
    Check.Check.typeOf.object("scale", scale);
    Check.Check.typeOf.object("result", result);
    //>>includeEnd('debug');

    result[0] = matrix[0] * scale.x;
    result[1] = matrix[1] * scale.x;
    result[2] = matrix[2] * scale.y;
    result[3] = matrix[3] * scale.y;

    return result;
  };

  /**
   * Computes the product of a matrix times a uniform scale, as if the scale were a scale matrix.
   *
   * @param {Matrix2} matrix The matrix on the left-hand side.
   * @param {Number} scale The uniform scale on the right-hand side.
   * @param {Matrix2} result The object onto which to store the result.
   * @returns {Matrix2} The modified result parameter.
   *
   * @example
   * // Instead of Cesium.Matrix2.multiply(m, Cesium.Matrix2.fromUniformScale(scale), m);
   * Cesium.Matrix2.multiplyByUniformScale(m, scale, m);
   *
   * @see Matrix2.multiplyByScale
   * @see Matrix2.fromScale
   * @see Matrix2.fromUniformScale
   * @see Matrix2.setScale
   * @see Matrix2.setUniformScale
   * @see Matrix2.getScale
   */
  Matrix2.multiplyByUniformScale = function (matrix, scale, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("matrix", matrix);
    Check.Check.typeOf.number("scale", scale);
    Check.Check.typeOf.object("result", result);
    //>>includeEnd('debug');

    result[0] = matrix[0] * scale;
    result[1] = matrix[1] * scale;
    result[2] = matrix[2] * scale;
    result[3] = matrix[3] * scale;

    return result;
  };

  /**
   * Creates a negated copy of the provided matrix.
   *
   * @param {Matrix2} matrix The matrix to negate.
   * @param {Matrix2} result The object onto which to store the result.
   * @returns {Matrix2} The modified result parameter.
   */
  Matrix2.negate = function (matrix, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("matrix", matrix);
    Check.Check.typeOf.object("result", result);
    //>>includeEnd('debug');

    result[0] = -matrix[0];
    result[1] = -matrix[1];
    result[2] = -matrix[2];
    result[3] = -matrix[3];
    return result;
  };

  /**
   * Computes the transpose of the provided matrix.
   *
   * @param {Matrix2} matrix The matrix to transpose.
   * @param {Matrix2} result The object onto which to store the result.
   * @returns {Matrix2} The modified result parameter.
   */
  Matrix2.transpose = function (matrix, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("matrix", matrix);
    Check.Check.typeOf.object("result", result);
    //>>includeEnd('debug');

    const column0Row0 = matrix[0];
    const column0Row1 = matrix[2];
    const column1Row0 = matrix[1];
    const column1Row1 = matrix[3];

    result[0] = column0Row0;
    result[1] = column0Row1;
    result[2] = column1Row0;
    result[3] = column1Row1;
    return result;
  };

  /**
   * Computes a matrix, which contains the absolute (unsigned) values of the provided matrix's elements.
   *
   * @param {Matrix2} matrix The matrix with signed elements.
   * @param {Matrix2} result The object onto which to store the result.
   * @returns {Matrix2} The modified result parameter.
   */
  Matrix2.abs = function (matrix, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("matrix", matrix);
    Check.Check.typeOf.object("result", result);
    //>>includeEnd('debug');

    result[0] = Math.abs(matrix[0]);
    result[1] = Math.abs(matrix[1]);
    result[2] = Math.abs(matrix[2]);
    result[3] = Math.abs(matrix[3]);

    return result;
  };

  /**
   * Compares the provided matrices componentwise and returns
   * <code>true</code> if they are equal, <code>false</code> otherwise.
   *
   * @param {Matrix2} [left] The first matrix.
   * @param {Matrix2} [right] The second matrix.
   * @returns {Boolean} <code>true</code> if left and right are equal, <code>false</code> otherwise.
   */
  Matrix2.equals = function (left, right) {
    return (
      left === right ||
      (defined.defined(left) &&
        defined.defined(right) &&
        left[0] === right[0] &&
        left[1] === right[1] &&
        left[2] === right[2] &&
        left[3] === right[3])
    );
  };

  /**
   * @private
   */
  Matrix2.equalsArray = function (matrix, array, offset) {
    return (
      matrix[0] === array[offset] &&
      matrix[1] === array[offset + 1] &&
      matrix[2] === array[offset + 2] &&
      matrix[3] === array[offset + 3]
    );
  };

  /**
   * Compares the provided matrices componentwise and returns
   * <code>true</code> if they are within the provided epsilon,
   * <code>false</code> otherwise.
   *
   * @param {Matrix2} [left] The first matrix.
   * @param {Matrix2} [right] The second matrix.
   * @param {Number} [epsilon=0] The epsilon to use for equality testing.
   * @returns {Boolean} <code>true</code> if left and right are within the provided epsilon, <code>false</code> otherwise.
   */
  Matrix2.equalsEpsilon = function (left, right, epsilon) {
    epsilon = defined.defaultValue(epsilon, 0);
    return (
      left === right ||
      (defined.defined(left) &&
        defined.defined(right) &&
        Math.abs(left[0] - right[0]) <= epsilon &&
        Math.abs(left[1] - right[1]) <= epsilon &&
        Math.abs(left[2] - right[2]) <= epsilon &&
        Math.abs(left[3] - right[3]) <= epsilon)
    );
  };

  /**
   * An immutable Matrix2 instance initialized to the identity matrix.
   *
   * @type {Matrix2}
   * @constant
   */
  Matrix2.IDENTITY = Object.freeze(new Matrix2(1.0, 0.0, 0.0, 1.0));

  /**
   * An immutable Matrix2 instance initialized to the zero matrix.
   *
   * @type {Matrix2}
   * @constant
   */
  Matrix2.ZERO = Object.freeze(new Matrix2(0.0, 0.0, 0.0, 0.0));

  /**
   * The index into Matrix2 for column 0, row 0.
   *
   * @type {Number}
   * @constant
   *
   * @example
   * const matrix = new Cesium.Matrix2();
   * matrix[Cesium.Matrix2.COLUMN0ROW0] = 5.0; // set column 0, row 0 to 5.0
   */
  Matrix2.COLUMN0ROW0 = 0;

  /**
   * The index into Matrix2 for column 0, row 1.
   *
   * @type {Number}
   * @constant
   *
   * @example
   * const matrix = new Cesium.Matrix2();
   * matrix[Cesium.Matrix2.COLUMN0ROW1] = 5.0; // set column 0, row 1 to 5.0
   */
  Matrix2.COLUMN0ROW1 = 1;

  /**
   * The index into Matrix2 for column 1, row 0.
   *
   * @type {Number}
   * @constant
   *
   * @example
   * const matrix = new Cesium.Matrix2();
   * matrix[Cesium.Matrix2.COLUMN1ROW0] = 5.0; // set column 1, row 0 to 5.0
   */
  Matrix2.COLUMN1ROW0 = 2;

  /**
   * The index into Matrix2 for column 1, row 1.
   *
   * @type {Number}
   * @constant
   *
   * @example
   * const matrix = new Cesium.Matrix2();
   * matrix[Cesium.Matrix2.COLUMN1ROW1] = 5.0; // set column 1, row 1 to 5.0
   */
  Matrix2.COLUMN1ROW1 = 3;

  Object.defineProperties(Matrix2.prototype, {
    /**
     * Gets the number of items in the collection.
     * @memberof Matrix2.prototype
     *
     * @type {Number}
     */
    length: {
      get: function () {
        return Matrix2.packedLength;
      },
    },
  });

  /**
   * Duplicates the provided Matrix2 instance.
   *
   * @param {Matrix2} [result] The object onto which to store the result.
   * @returns {Matrix2} The modified result parameter or a new Matrix2 instance if one was not provided.
   */
  Matrix2.prototype.clone = function (result) {
    return Matrix2.clone(this, result);
  };

  /**
   * Compares this matrix to the provided matrix componentwise and returns
   * <code>true</code> if they are equal, <code>false</code> otherwise.
   *
   * @param {Matrix2} [right] The right hand side matrix.
   * @returns {Boolean} <code>true</code> if they are equal, <code>false</code> otherwise.
   */
  Matrix2.prototype.equals = function (right) {
    return Matrix2.equals(this, right);
  };

  /**
   * Compares this matrix to the provided matrix componentwise and returns
   * <code>true</code> if they are within the provided epsilon,
   * <code>false</code> otherwise.
   *
   * @param {Matrix2} [right] The right hand side matrix.
   * @param {Number} [epsilon=0] The epsilon to use for equality testing.
   * @returns {Boolean} <code>true</code> if they are within the provided epsilon, <code>false</code> otherwise.
   */
  Matrix2.prototype.equalsEpsilon = function (right, epsilon) {
    return Matrix2.equalsEpsilon(this, right, epsilon);
  };

  /**
   * Creates a string representing this Matrix with each row being
   * on a separate line and in the format '(column0, column1)'.
   *
   * @returns {String} A string representing the provided Matrix with each row being on a separate line and in the format '(column0, column1)'.
   */
  Matrix2.prototype.toString = function () {
    return `(${this[0]}, ${this[2]})\n` + `(${this[1]}, ${this[3]})`;
  };

  exports.Cartesian4 = Cartesian4;
  exports.Matrix2 = Matrix2;
  exports.Matrix3 = Matrix3;
  exports.Matrix4 = Matrix4;

}));
//# sourceMappingURL=Matrix2-81068516.js.map
