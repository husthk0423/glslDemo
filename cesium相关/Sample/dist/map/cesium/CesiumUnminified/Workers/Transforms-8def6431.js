/**
 * Cesium - https://github.com/CesiumGS/cesium
 *
 * Copyright 2011-2020 Cesium Contributors
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
 * See https://github.com/CesiumGS/cesium/blob/master/LICENSE.md for full licensing details.
 */

define(['exports', './when-c305ab76', './Cartesian2-30a7929d', './Check-1d0ca1d6', './defaultValue-e27640a4', './Math-dc70d5e5', './Resource-194cece5', './RuntimeError-b7a272ee'], (function (exports, when, Cartesian2, Check, defaultValue, _Math, Resource, RuntimeError) { 'use strict';

    /**
         * A 3x3 matrix, indexable as a column-major order array.
         * Constructor parameters are in row-major order for code readability.
         * @alias Matrix3
         * @constructor
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
         * @see Matrix3.fromColumnMajorArray
         * @see Matrix3.fromRowMajorArray
         * @see Matrix3.fromQuaternion
         * @see Matrix3.fromScale
         * @see Matrix3.fromUniformScale
         * @see Matrix2
         * @see Matrix4
         */
        function Matrix3(column0Row0, column1Row0, column2Row0,
                               column0Row1, column1Row1, column2Row1,
                               column0Row2, column1Row2, column2Row2) {
            this[0] = defaultValue.defaultValue(column0Row0, 0.0);
            this[1] = defaultValue.defaultValue(column0Row1, 0.0);
            this[2] = defaultValue.defaultValue(column0Row2, 0.0);
            this[3] = defaultValue.defaultValue(column1Row0, 0.0);
            this[4] = defaultValue.defaultValue(column1Row1, 0.0);
            this[5] = defaultValue.defaultValue(column1Row2, 0.0);
            this[6] = defaultValue.defaultValue(column2Row0, 0.0);
            this[7] = defaultValue.defaultValue(column2Row1, 0.0);
            this[8] = defaultValue.defaultValue(column2Row2, 0.0);
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
        Matrix3.pack = function(value, array, startingIndex) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('value', value);
            Check.Check.defined('array', array);
            //>>includeEnd('debug');

            startingIndex = defaultValue.defaultValue(startingIndex, 0);

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
        Matrix3.unpack = function(array, startingIndex, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.defined('array', array);
            //>>includeEnd('debug');

            startingIndex = defaultValue.defaultValue(startingIndex, 0);

            if (!defaultValue.defined(result)) {
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
         * Duplicates a Matrix3 instance.
         *
         * @param {Matrix3} matrix The matrix to duplicate.
         * @param {Matrix3} [result] The object onto which to store the result.
         * @returns {Matrix3} The modified result parameter or a new Matrix3 instance if one was not provided. (Returns undefined if matrix is undefined)
         */
        Matrix3.clone = function(matrix, result) {
            if (!defaultValue.defined(matrix)) {
                return undefined;
            }
            if (!defaultValue.defined(result)) {
                return new Matrix3(matrix[0], matrix[3], matrix[6],
                                   matrix[1], matrix[4], matrix[7],
                                   matrix[2], matrix[5], matrix[8]);
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
         * var v = [1.0, 1.0, 1.0, 2.0, 2.0, 2.0, 3.0, 3.0, 3.0];
         * var m = Cesium.Matrix3.fromArray(v);
         *
         * // Create same Matrix3 with using an offset into an array
         * var v2 = [0.0, 0.0, 1.0, 1.0, 1.0, 2.0, 2.0, 2.0, 3.0, 3.0, 3.0];
         * var m2 = Cesium.Matrix3.fromArray(v2, 2);
         */
        Matrix3.fromArray = function(array, startingIndex, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.defined('array', array);
            //>>includeEnd('debug');

            startingIndex = defaultValue.defaultValue(startingIndex, 0);

            if (!defaultValue.defined(result)) {
                result = new Matrix3();
            }

            result[0] = array[startingIndex];
            result[1] = array[startingIndex + 1];
            result[2] = array[startingIndex + 2];
            result[3] = array[startingIndex + 3];
            result[4] = array[startingIndex + 4];
            result[5] = array[startingIndex + 5];
            result[6] = array[startingIndex + 6];
            result[7] = array[startingIndex + 7];
            result[8] = array[startingIndex + 8];
            return result;
        };

        /**
         * Creates a Matrix3 instance from a column-major order array.
         *
         * @param {Number[]} values The column-major order array.
         * @param {Matrix3} [result] The object in which the result will be stored, if undefined a new instance will be created.
         * @returns {Matrix3} The modified result parameter, or a new Matrix3 instance if one was not provided.
         */
        Matrix3.fromColumnMajorArray = function(values, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.defined('values', values);
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
        Matrix3.fromRowMajorArray = function(values, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.defined('values', values);
            //>>includeEnd('debug');

            if (!defaultValue.defined(result)) {
                return new Matrix3(values[0], values[1], values[2],
                                   values[3], values[4], values[5],
                                   values[6], values[7], values[8]);
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
        Matrix3.fromQuaternion = function(quaternion, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('quaternion', quaternion);
            //>>includeEnd('debug');

            var x2 = quaternion.x * quaternion.x;
            var xy = quaternion.x * quaternion.y;
            var xz = quaternion.x * quaternion.z;
            var xw = quaternion.x * quaternion.w;
            var y2 = quaternion.y * quaternion.y;
            var yz = quaternion.y * quaternion.z;
            var yw = quaternion.y * quaternion.w;
            var z2 = quaternion.z * quaternion.z;
            var zw = quaternion.z * quaternion.w;
            var w2 = quaternion.w * quaternion.w;

            var m00 = x2 - y2 - z2 + w2;
            var m01 = 2.0 * (xy - zw);
            var m02 = 2.0 * (xz + yw);

            var m10 = 2.0 * (xy + zw);
            var m11 = -x2 + y2 - z2 + w2;
            var m12 = 2.0 * (yz - xw);

            var m20 = 2.0 * (xz - yw);
            var m21 = 2.0 * (yz + xw);
            var m22 = -x2 - y2 + z2 + w2;

            if (!defaultValue.defined(result)) {
                return new Matrix3(m00, m01, m02,
                                   m10, m11, m12,
                                   m20, m21, m22);
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
        Matrix3.fromHeadingPitchRoll = function(headingPitchRoll, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('headingPitchRoll', headingPitchRoll);
            //>>includeEnd('debug');

            var cosTheta = Math.cos(-headingPitchRoll.pitch);
            var cosPsi = Math.cos(-headingPitchRoll.heading);
            var cosPhi = Math.cos(headingPitchRoll.roll);
            var sinTheta = Math.sin(-headingPitchRoll.pitch);
            var sinPsi = Math.sin(-headingPitchRoll.heading);
            var sinPhi = Math.sin(headingPitchRoll.roll);

            var m00 = cosTheta * cosPsi;
            var m01 = -cosPhi * sinPsi + sinPhi * sinTheta * cosPsi;
            var m02 = sinPhi * sinPsi + cosPhi * sinTheta * cosPsi;

            var m10 = cosTheta * sinPsi;
            var m11 = cosPhi * cosPsi + sinPhi * sinTheta * sinPsi;
            var m12 = -sinPhi * cosPsi + cosPhi * sinTheta * sinPsi;

            var m20 = -sinTheta;
            var m21 = sinPhi * cosTheta;
            var m22 = cosPhi * cosTheta;

            if (!defaultValue.defined(result)) {
                return new Matrix3(m00, m01, m02,
                    m10, m11, m12,
                    m20, m21, m22);
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
         * var m = Cesium.Matrix3.fromScale(new Cesium.Cartesian3(7.0, 8.0, 9.0));
         */
        Matrix3.fromScale = function(scale, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('scale', scale);
            //>>includeEnd('debug');

            if (!defaultValue.defined(result)) {
                return new Matrix3(
                    scale.x, 0.0,     0.0,
                    0.0,     scale.y, 0.0,
                    0.0,     0.0,     scale.z);
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
         * var m = Cesium.Matrix3.fromUniformScale(2.0);
         */
        Matrix3.fromUniformScale = function(scale, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.number('scale', scale);
            //>>includeEnd('debug');

            if (!defaultValue.defined(result)) {
                return new Matrix3(
                    scale, 0.0,   0.0,
                    0.0,   scale, 0.0,
                    0.0,   0.0,   scale);
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
         * var m = Cesium.Matrix3.fromCrossProduct(new Cesium.Cartesian3(7.0, 8.0, 9.0));
         */
        Matrix3.fromCrossProduct = function(vector, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('vector', vector);
            //>>includeEnd('debug');

            if (!defaultValue.defined(result)) {
                return new Matrix3(
                          0.0, -vector.z,  vector.y,
                     vector.z,       0.0, -vector.x,
                    -vector.y,  vector.x,       0.0);
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
         * var p = new Cesium.Cartesian3(5, 6, 7);
         * var m = Cesium.Matrix3.fromRotationX(Cesium.Math.toRadians(45.0));
         * var rotated = Cesium.Matrix3.multiplyByVector(m, p, new Cesium.Cartesian3());
         */
        Matrix3.fromRotationX = function(angle, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.number('angle', angle);
            //>>includeEnd('debug');

            var cosAngle = Math.cos(angle);
            var sinAngle = Math.sin(angle);

            if (!defaultValue.defined(result)) {
                return new Matrix3(
                    1.0, 0.0, 0.0,
                    0.0, cosAngle, -sinAngle,
                    0.0, sinAngle, cosAngle);
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
         * var p = new Cesium.Cartesian3(5, 6, 7);
         * var m = Cesium.Matrix3.fromRotationY(Cesium.Math.toRadians(45.0));
         * var rotated = Cesium.Matrix3.multiplyByVector(m, p, new Cesium.Cartesian3());
         */
        Matrix3.fromRotationY = function(angle, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.number('angle', angle);
            //>>includeEnd('debug');

            var cosAngle = Math.cos(angle);
            var sinAngle = Math.sin(angle);

            if (!defaultValue.defined(result)) {
                return new Matrix3(
                    cosAngle, 0.0, sinAngle,
                    0.0, 1.0, 0.0,
                    -sinAngle, 0.0, cosAngle);
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
         * var p = new Cesium.Cartesian3(5, 6, 7);
         * var m = Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(45.0));
         * var rotated = Cesium.Matrix3.multiplyByVector(m, p, new Cesium.Cartesian3());
         */
        Matrix3.fromRotationZ = function(angle, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.number('angle', angle);
            //>>includeEnd('debug');

            var cosAngle = Math.cos(angle);
            var sinAngle = Math.sin(angle);

            if (!defaultValue.defined(result)) {
                return new Matrix3(
                    cosAngle, -sinAngle, 0.0,
                    sinAngle, cosAngle, 0.0,
                    0.0, 0.0, 1.0);
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
        Matrix3.toArray = function(matrix, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('matrix', matrix);
            //>>includeEnd('debug');

            if (!defaultValue.defined(result)) {
                return [matrix[0], matrix[1], matrix[2], matrix[3], matrix[4], matrix[5], matrix[6], matrix[7], matrix[8]];
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
         * @param {Number} row The zero-based index of the row.
         * @param {Number} column The zero-based index of the column.
         * @returns {Number} The index of the element at the provided row and column.
         *
         * @exception {DeveloperError} row must be 0, 1, or 2.
         * @exception {DeveloperError} column must be 0, 1, or 2.
         *
         * @example
         * var myMatrix = new Cesium.Matrix3();
         * var column1Row0Index = Cesium.Matrix3.getElementIndex(1, 0);
         * var column1Row0 = myMatrix[column1Row0Index]
         * myMatrix[column1Row0Index] = 10.0;
         */
        Matrix3.getElementIndex = function(column, row) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.number.greaterThanOrEquals('row', row, 0);
            Check.Check.typeOf.number.lessThanOrEquals('row', row, 2);
            Check.Check.typeOf.number.greaterThanOrEquals('column', column, 0);
            Check.Check.typeOf.number.lessThanOrEquals('column', column, 2);
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
        Matrix3.getColumn = function(matrix, index, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('matrix', matrix);
            Check.Check.typeOf.number.greaterThanOrEquals('index', index, 0);
            Check.Check.typeOf.number.lessThanOrEquals('index', index, 2);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            var startIndex = index * 3;
            var x = matrix[startIndex];
            var y = matrix[startIndex + 1];
            var z = matrix[startIndex + 2];

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
        Matrix3.setColumn = function(matrix, index, cartesian, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('matrix', matrix);
            Check.Check.typeOf.number.greaterThanOrEquals('index', index, 0);
            Check.Check.typeOf.number.lessThanOrEquals('index', index, 2);
            Check.Check.typeOf.object('cartesian', cartesian);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            result = Matrix3.clone(matrix, result);
            var startIndex = index * 3;
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
        Matrix3.getRow = function(matrix, index, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('matrix', matrix);
            Check.Check.typeOf.number.greaterThanOrEquals('index', index, 0);
            Check.Check.typeOf.number.lessThanOrEquals('index', index, 2);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            var x = matrix[index];
            var y = matrix[index + 3];
            var z = matrix[index + 6];

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
        Matrix3.setRow = function(matrix, index, cartesian, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('matrix', matrix);
            Check.Check.typeOf.number.greaterThanOrEquals('index', index, 0);
            Check.Check.typeOf.number.lessThanOrEquals('index', index, 2);
            Check.Check.typeOf.object('cartesian', cartesian);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            result = Matrix3.clone(matrix, result);
            result[index] = cartesian.x;
            result[index + 3] = cartesian.y;
            result[index + 6] = cartesian.z;
            return result;
        };

        var scratchColumn$1 = new Cartesian2.Cartesian3();

        /**
         * Extracts the non-uniform scale assuming the matrix is an affine transformation.
         *
         * @param {Matrix3} matrix The matrix.
         * @param {Cartesian3} result The object onto which to store the result.
         * @returns {Cartesian3} The modified result parameter.
         */
        Matrix3.getScale = function(matrix, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('matrix', matrix);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            result.x = Cartesian2.Cartesian3.magnitude(Cartesian2.Cartesian3.fromElements(matrix[0], matrix[1], matrix[2], scratchColumn$1));
            result.y = Cartesian2.Cartesian3.magnitude(Cartesian2.Cartesian3.fromElements(matrix[3], matrix[4], matrix[5], scratchColumn$1));
            result.z = Cartesian2.Cartesian3.magnitude(Cartesian2.Cartesian3.fromElements(matrix[6], matrix[7], matrix[8], scratchColumn$1));
            return result;
        };

        var scratchScale$2 = new Cartesian2.Cartesian3();

        /**
         * Computes the maximum scale assuming the matrix is an affine transformation.
         * The maximum scale is the maximum length of the column vectors.
         *
         * @param {Matrix3} matrix The matrix.
         * @returns {Number} The maximum scale.
         */
        Matrix3.getMaximumScale = function(matrix) {
            Matrix3.getScale(matrix, scratchScale$2);
            return Cartesian2.Cartesian3.maximumComponent(scratchScale$2);
        };

        /**
         * Computes the product of two matrices.
         *
         * @param {Matrix3} left The first matrix.
         * @param {Matrix3} right The second matrix.
         * @param {Matrix3} result The object onto which to store the result.
         * @returns {Matrix3} The modified result parameter.
         */
        Matrix3.multiply = function(left, right, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('left', left);
            Check.Check.typeOf.object('right', right);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            var column0Row0 = left[0] * right[0] + left[3] * right[1] + left[6] * right[2];
            var column0Row1 = left[1] * right[0] + left[4] * right[1] + left[7] * right[2];
            var column0Row2 = left[2] * right[0] + left[5] * right[1] + left[8] * right[2];

            var column1Row0 = left[0] * right[3] + left[3] * right[4] + left[6] * right[5];
            var column1Row1 = left[1] * right[3] + left[4] * right[4] + left[7] * right[5];
            var column1Row2 = left[2] * right[3] + left[5] * right[4] + left[8] * right[5];

            var column2Row0 = left[0] * right[6] + left[3] * right[7] + left[6] * right[8];
            var column2Row1 = left[1] * right[6] + left[4] * right[7] + left[7] * right[8];
            var column2Row2 = left[2] * right[6] + left[5] * right[7] + left[8] * right[8];

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
        Matrix3.add = function(left, right, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('left', left);
            Check.Check.typeOf.object('right', right);
            Check.Check.typeOf.object('result', result);
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
        Matrix3.subtract = function(left, right, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('left', left);
            Check.Check.typeOf.object('right', right);
            Check.Check.typeOf.object('result', result);
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
        Matrix3.multiplyByVector = function(matrix, cartesian, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('matrix', matrix);
            Check.Check.typeOf.object('cartesian', cartesian);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            var vX = cartesian.x;
            var vY = cartesian.y;
            var vZ = cartesian.z;

            var x = matrix[0] * vX + matrix[3] * vY + matrix[6] * vZ;
            var y = matrix[1] * vX + matrix[4] * vY + matrix[7] * vZ;
            var z = matrix[2] * vX + matrix[5] * vY + matrix[8] * vZ;

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
        Matrix3.multiplyByScalar = function(matrix, scalar, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('matrix', matrix);
            Check.Check.typeOf.number('scalar', scalar);
            Check.Check.typeOf.object('result', result);
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
         * @param {Cartesian3} scale The non-uniform scale on the right-hand side.
         * @param {Matrix3} result The object onto which to store the result.
         * @returns {Matrix3} The modified result parameter.
         *
         *
         * @example
         * // Instead of Cesium.Matrix3.multiply(m, Cesium.Matrix3.fromScale(scale), m);
         * Cesium.Matrix3.multiplyByScale(m, scale, m);
         *
         * @see Matrix3.fromScale
         * @see Matrix3.multiplyByUniformScale
         */
        Matrix3.multiplyByScale = function(matrix, scale, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('matrix', matrix);
            Check.Check.typeOf.object('scale', scale);
            Check.Check.typeOf.object('result', result);
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
         * Creates a negated copy of the provided matrix.
         *
         * @param {Matrix3} matrix The matrix to negate.
         * @param {Matrix3} result The object onto which to store the result.
         * @returns {Matrix3} The modified result parameter.
         */
        Matrix3.negate = function(matrix, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('matrix', matrix);
            Check.Check.typeOf.object('result', result);
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
        Matrix3.transpose = function(matrix, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('matrix', matrix);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            var column0Row0 = matrix[0];
            var column0Row1 = matrix[3];
            var column0Row2 = matrix[6];
            var column1Row0 = matrix[1];
            var column1Row1 = matrix[4];
            var column1Row2 = matrix[7];
            var column2Row0 = matrix[2];
            var column2Row1 = matrix[5];
            var column2Row2 = matrix[8];

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

        var UNIT = new Cartesian2.Cartesian3(1, 1, 1);

        /**
         * Extracts the rotation assuming the matrix is an affine transformation.
         *
         * @param {Matrix3} matrix The matrix.
         * @param {Matrix3} result The object onto which to store the result.
         * @returns {Matrix3} The modified result parameter
         */
        Matrix3.getRotation = function(matrix, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('matrix', matrix);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            var inverseScale = Cartesian2.Cartesian3.divideComponents(UNIT, Matrix3.getScale(matrix, scratchScale$2), scratchScale$2);
            result = Matrix3.multiplyByScale(matrix, inverseScale, result);

            return result;
        };

        function computeFrobeniusNorm(matrix) {
            var norm = 0.0;
            for (var i = 0; i < 9; ++i) {
                var temp = matrix[i];
                norm += temp * temp;
            }

            return Math.sqrt(norm);
        }

        var rowVal = [1, 0, 0];
        var colVal = [2, 2, 1];

        function offDiagonalFrobeniusNorm(matrix) {
            // Computes the "off-diagonal" Frobenius norm.
            // Assumes matrix is symmetric.

            var norm = 0.0;
            for (var i = 0; i < 3; ++i) {
                var temp = matrix[Matrix3.getElementIndex(colVal[i], rowVal[i])];
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

            var tolerance = _Math.CesiumMath.EPSILON15;

            var maxDiagonal = 0.0;
            var rotAxis = 1;

            // find pivot (rotAxis) based on max diagonal of matrix
            for (var i = 0; i < 3; ++i) {
                var temp = Math.abs(matrix[Matrix3.getElementIndex(colVal[i], rowVal[i])]);
                if (temp > maxDiagonal) {
                    rotAxis = i;
                    maxDiagonal = temp;
                }
            }

            var c = 1.0;
            var s = 0.0;

            var p = rowVal[rotAxis];
            var q = colVal[rotAxis];

            if (Math.abs(matrix[Matrix3.getElementIndex(q, p)]) > tolerance) {
                var qq = matrix[Matrix3.getElementIndex(q, q)];
                var pp = matrix[Matrix3.getElementIndex(p, p)];
                var qp = matrix[Matrix3.getElementIndex(q, p)];

                var tau = (qq - pp) / 2.0 / qp;
                var t;

                if (tau < 0.0) {
                    t = -1.0 / (-tau + Math.sqrt(1.0 + tau * tau));
                } else {
                    t = 1.0 / (tau + Math.sqrt(1.0 + tau * tau));
                }

                c = 1.0 / Math.sqrt(1.0 + t * t);
                s = t * c;
            }

            result = Matrix3.clone(Matrix3.IDENTITY, result);

            result[Matrix3.getElementIndex(p, p)] = result[Matrix3.getElementIndex(q, q)] = c;
            result[Matrix3.getElementIndex(q, p)] = s;
            result[Matrix3.getElementIndex(p, q)] = -s;

            return result;
        }

        var jMatrix = new Matrix3();
        var jMatrixTranspose = new Matrix3();

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
         * var a = //... symetric matrix
         * var result = {
         *     unitary : new Cesium.Matrix3(),
         *     diagonal : new Cesium.Matrix3()
         * };
         * Cesium.Matrix3.computeEigenDecomposition(a, result);
         *
         * var unitaryTranspose = Cesium.Matrix3.transpose(result.unitary, new Cesium.Matrix3());
         * var b = Cesium.Matrix3.multiply(result.unitary, result.diagonal, new Cesium.Matrix3());
         * Cesium.Matrix3.multiply(b, unitaryTranspose, b); // b is now equal to a
         *
         * var lambda = Cesium.Matrix3.getColumn(result.diagonal, 0, new Cesium.Cartesian3()).x;  // first eigenvalue
         * var v = Cesium.Matrix3.getColumn(result.unitary, 0, new Cesium.Cartesian3());          // first eigenvector
         * var c = Cesium.Cartesian3.multiplyByScalar(v, lambda, new Cesium.Cartesian3());        // equal to Cesium.Matrix3.multiplyByVector(a, v)
         */
        Matrix3.computeEigenDecomposition = function(matrix, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('matrix', matrix);
            //>>includeEnd('debug');

            // This routine was created based upon Matrix Computations, 3rd ed., by Golub and Van Loan,
            // section 8.4.3 The Classical Jacobi Algorithm

            var tolerance = _Math.CesiumMath.EPSILON20;
            var maxSweeps = 10;

            var count = 0;
            var sweep = 0;

            if (!defaultValue.defined(result)) {
                result = {};
            }

            var unitaryMatrix = result.unitary = Matrix3.clone(Matrix3.IDENTITY, result.unitary);
            var diagMatrix = result.diagonal = Matrix3.clone(matrix, result.diagonal);

            var epsilon = tolerance * computeFrobeniusNorm(diagMatrix);

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
        Matrix3.abs = function(matrix, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('matrix', matrix);
            Check.Check.typeOf.object('result', result);
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
        Matrix3.determinant = function(matrix) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('matrix', matrix);
            //>>includeEnd('debug');

            var m11 = matrix[0];
            var m21 = matrix[3];
            var m31 = matrix[6];
            var m12 = matrix[1];
            var m22 = matrix[4];
            var m32 = matrix[7];
            var m13 = matrix[2];
            var m23 = matrix[5];
            var m33 = matrix[8];

            return m11 * (m22 * m33 - m23 * m32) + m12 * (m23 * m31 - m21 * m33) + m13 * (m21 * m32 - m22 * m31);
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
        Matrix3.inverse = function(matrix, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('matrix', matrix);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            var m11 = matrix[0];
            var m21 = matrix[1];
            var m31 = matrix[2];
            var m12 = matrix[3];
            var m22 = matrix[4];
            var m32 = matrix[5];
            var m13 = matrix[6];
            var m23 = matrix[7];
            var m33 = matrix[8];

            var determinant = Matrix3.determinant(matrix);

            //>>includeStart('debug', pragmas.debug);
            if (Math.abs(determinant) <= _Math.CesiumMath.EPSILON15) {
                throw new Check.DeveloperError('matrix is not invertible');
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

           var scale = 1.0 / determinant;
           return Matrix3.multiplyByScalar(result, scale, result);
        };

        /**
         * Compares the provided matrices componentwise and returns
         * <code>true</code> if they are equal, <code>false</code> otherwise.
         *
         * @param {Matrix3} [left] The first matrix.
         * @param {Matrix3} [right] The second matrix.
         * @returns {Boolean} <code>true</code> if left and right are equal, <code>false</code> otherwise.
         */
        Matrix3.equals = function(left, right) {
            return (left === right) ||
                   (defaultValue.defined(left) &&
                    defaultValue.defined(right) &&
                    left[0] === right[0] &&
                    left[1] === right[1] &&
                    left[2] === right[2] &&
                    left[3] === right[3] &&
                    left[4] === right[4] &&
                    left[5] === right[5] &&
                    left[6] === right[6] &&
                    left[7] === right[7] &&
                    left[8] === right[8]);
        };

        /**
         * Compares the provided matrices componentwise and returns
         * <code>true</code> if they are within the provided epsilon,
         * <code>false</code> otherwise.
         *
         * @param {Matrix3} [left] The first matrix.
         * @param {Matrix3} [right] The second matrix.
         * @param {Number} epsilon The epsilon to use for equality testing.
         * @returns {Boolean} <code>true</code> if left and right are within the provided epsilon, <code>false</code> otherwise.
         */
        Matrix3.equalsEpsilon = function(left, right, epsilon) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.number('epsilon', epsilon);
            //>>includeEnd('debug');

            return (left === right) ||
                    (defaultValue.defined(left) &&
                    defaultValue.defined(right) &&
                    Math.abs(left[0] - right[0]) <= epsilon &&
                    Math.abs(left[1] - right[1]) <= epsilon &&
                    Math.abs(left[2] - right[2]) <= epsilon &&
                    Math.abs(left[3] - right[3]) <= epsilon &&
                    Math.abs(left[4] - right[4]) <= epsilon &&
                    Math.abs(left[5] - right[5]) <= epsilon &&
                    Math.abs(left[6] - right[6]) <= epsilon &&
                    Math.abs(left[7] - right[7]) <= epsilon &&
                    Math.abs(left[8] - right[8]) <= epsilon);
        };

        /**
         * An immutable Matrix3 instance initialized to the identity matrix.
         *
         * @type {Matrix3}
         * @constant
         */
        Matrix3.IDENTITY = Object.freeze(new Matrix3(1.0, 0.0, 0.0,
                                                    0.0, 1.0, 0.0,
                                                    0.0, 0.0, 1.0));

        /**
         * An immutable Matrix3 instance initialized to the zero matrix.
         *
         * @type {Matrix3}
         * @constant
         */
        Matrix3.ZERO = Object.freeze(new Matrix3(0.0, 0.0, 0.0,
                                                0.0, 0.0, 0.0,
                                                0.0, 0.0, 0.0));

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
            length : {
                get : function() {
                    return Matrix3.packedLength;
                }
            }
        });

        /**
         * Duplicates the provided Matrix3 instance.
         *
         * @param {Matrix3} [result] The object onto which to store the result.
         * @returns {Matrix3} The modified result parameter or a new Matrix3 instance if one was not provided.
         */
        Matrix3.prototype.clone = function(result) {
            return Matrix3.clone(this, result);
        };

        /**
         * Compares this matrix to the provided matrix componentwise and returns
         * <code>true</code> if they are equal, <code>false</code> otherwise.
         *
         * @param {Matrix3} [right] The right hand side matrix.
         * @returns {Boolean} <code>true</code> if they are equal, <code>false</code> otherwise.
         */
        Matrix3.prototype.equals = function(right) {
            return Matrix3.equals(this, right);
        };

        /**
         * @private
         */
        Matrix3.equalsArray = function(matrix, array, offset) {
            return matrix[0] === array[offset] &&
                   matrix[1] === array[offset + 1] &&
                   matrix[2] === array[offset + 2] &&
                   matrix[3] === array[offset + 3] &&
                   matrix[4] === array[offset + 4] &&
                   matrix[5] === array[offset + 5] &&
                   matrix[6] === array[offset + 6] &&
                   matrix[7] === array[offset + 7] &&
                   matrix[8] === array[offset + 8];
        };

        /**
         * Compares this matrix to the provided matrix componentwise and returns
         * <code>true</code> if they are within the provided epsilon,
         * <code>false</code> otherwise.
         *
         * @param {Matrix3} [right] The right hand side matrix.
         * @param {Number} epsilon The epsilon to use for equality testing.
         * @returns {Boolean} <code>true</code> if they are within the provided epsilon, <code>false</code> otherwise.
         */
        Matrix3.prototype.equalsEpsilon = function(right, epsilon) {
            return Matrix3.equalsEpsilon(this, right, epsilon);
        };

        /**
         * Creates a string representing this Matrix with each row being
         * on a separate line and in the format '(column0, column1, column2)'.
         *
         * @returns {String} A string representing the provided Matrix with each row being on a separate line and in the format '(column0, column1, column2)'.
         */
        Matrix3.prototype.toString = function() {
            return '(' + this[0] + ', ' + this[3] + ', ' + this[6] + ')\n' +
                   '(' + this[1] + ', ' + this[4] + ', ' + this[7] + ')\n' +
                   '(' + this[2] + ', ' + this[5] + ', ' + this[8] + ')';
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
            this.x = defaultValue.defaultValue(x, 0.0);

            /**
             * The Y component.
             * @type {Number}
             * @default 0.0
             */
            this.y = defaultValue.defaultValue(y, 0.0);

            /**
             * The Z component.
             * @type {Number}
             * @default 0.0
             */
            this.z = defaultValue.defaultValue(z, 0.0);

            /**
             * The W component.
             * @type {Number}
             * @default 0.0
             */
            this.w = defaultValue.defaultValue(w, 0.0);
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
        Cartesian4.fromElements = function(x, y, z, w, result) {
            if (!defaultValue.defined(result)) {
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
        Cartesian4.fromColor = function(color, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('color', color);
            //>>includeEnd('debug');
            if (!defaultValue.defined(result)) {
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
        Cartesian4.clone = function(cartesian, result) {
            if (!defaultValue.defined(cartesian)) {
                return undefined;
            }

            if (!defaultValue.defined(result)) {
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
        Cartesian4.pack = function(value, array, startingIndex) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('value', value);
            Check.Check.defined('array', array);
            //>>includeEnd('debug');

            startingIndex = defaultValue.defaultValue(startingIndex, 0);

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
        Cartesian4.unpack = function(array, startingIndex, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.defined('array', array);
            //>>includeEnd('debug');

            startingIndex = defaultValue.defaultValue(startingIndex, 0);

            if (!defaultValue.defined(result)) {
                result = new Cartesian4();
            }
            result.x = array[startingIndex++];
            result.y = array[startingIndex++];
            result.z = array[startingIndex++];
            result.w = array[startingIndex];
            return result;
        };

        /**
         * Flattens an array of Cartesian4s into and array of components.
         *
         * @param {Cartesian4[]} array The array of cartesians to pack.
         * @param {Number[]} [result] The array onto which to store the result. If this is a typed array, it must have array.length * 4 components, else a {@link DeveloperError} will be thrown. If it is a regular array, it will be resized to have (array.length * 4) elements.

         * @returns {Number[]} The packed array.
         */
        Cartesian4.packArray = function(array, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.defined('array', array);
            //>>includeEnd('debug');

            var length = array.length;
            var resultLength = length * 4;
            if (!defaultValue.defined(result)) {
                result = new Array(resultLength);
            } else if (!Array.isArray(result) && result.length !== resultLength) {
                throw new Check.DeveloperError('If result is a typed array, it must have exactly array.length * 4 elements');
            } else if (result.length !== resultLength) {
                result.length = resultLength;
            }

            for (var i = 0; i < length; ++i) {
                Cartesian4.pack(array[i], result, i * 4);
            }
            return result;
        };

        /**
         * Unpacks an array of cartesian components into and array of Cartesian4s.
         *
         * @param {Number[]} array The array of components to unpack.
         * @param {Cartesian4[]} [result] The array onto which to store the result.
         * @returns {Cartesian4[]} The unpacked array.
         */
        Cartesian4.unpackArray = function(array, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.defined('array', array);
            Check.Check.typeOf.number.greaterThanOrEquals('array.length', array.length, 4);
            if (array.length % 4 !== 0) {
                throw new Check.DeveloperError('array length must be a multiple of 4.');
            }
            //>>includeEnd('debug');

            var length = array.length;
            if (!defaultValue.defined(result)) {
                result = new Array(length / 4);
            } else {
                result.length = length / 4;
            }

            for (var i = 0; i < length; i += 4) {
                var index = i / 4;
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
         * var v = [1.0, 2.0, 3.0, 4.0];
         * var p = Cesium.Cartesian4.fromArray(v);
         *
         * // Create a Cartesian4 with (1.0, 2.0, 3.0, 4.0) using an offset into an array
         * var v2 = [0.0, 0.0, 1.0, 2.0, 3.0, 4.0];
         * var p2 = Cesium.Cartesian4.fromArray(v2, 2);
         */
        Cartesian4.fromArray = Cartesian4.unpack;

        /**
         * Computes the value of the maximum component for the supplied Cartesian.
         *
         * @param {Cartesian4} cartesian The cartesian to use.
         * @returns {Number} The value of the maximum component.
         */
        Cartesian4.maximumComponent = function(cartesian) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('cartesian', cartesian);
            //>>includeEnd('debug');

            return Math.max(cartesian.x, cartesian.y, cartesian.z, cartesian.w);
        };

        /**
         * Computes the value of the minimum component for the supplied Cartesian.
         *
         * @param {Cartesian4} cartesian The cartesian to use.
         * @returns {Number} The value of the minimum component.
         */
        Cartesian4.minimumComponent = function(cartesian) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('cartesian', cartesian);
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
        Cartesian4.minimumByComponent = function(first, second, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('first', first);
            Check.Check.typeOf.object('second', second);
            Check.Check.typeOf.object('result', result);
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
        Cartesian4.maximumByComponent = function(first, second, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('first', first);
            Check.Check.typeOf.object('second', second);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            result.x = Math.max(first.x, second.x);
            result.y = Math.max(first.y, second.y);
            result.z = Math.max(first.z, second.z);
            result.w = Math.max(first.w, second.w);

            return result;
        };

        /**
         * Computes the provided Cartesian's squared magnitude.
         *
         * @param {Cartesian4} cartesian The Cartesian instance whose squared magnitude is to be computed.
         * @returns {Number} The squared magnitude.
         */
        Cartesian4.magnitudeSquared = function(cartesian) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('cartesian', cartesian);
            //>>includeEnd('debug');

            return cartesian.x * cartesian.x + cartesian.y * cartesian.y + cartesian.z * cartesian.z + cartesian.w * cartesian.w;
        };

        /**
         * Computes the Cartesian's magnitude (length).
         *
         * @param {Cartesian4} cartesian The Cartesian instance whose magnitude is to be computed.
         * @returns {Number} The magnitude.
         */
        Cartesian4.magnitude = function(cartesian) {
            return Math.sqrt(Cartesian4.magnitudeSquared(cartesian));
        };

        var distanceScratch = new Cartesian4();

        /**
         * Computes the 4-space distance between two points.
         *
         * @param {Cartesian4} left The first point to compute the distance from.
         * @param {Cartesian4} right The second point to compute the distance to.
         * @returns {Number} The distance between two points.
         *
         * @example
         * // Returns 1.0
         * var d = Cesium.Cartesian4.distance(
         *   new Cesium.Cartesian4(1.0, 0.0, 0.0, 0.0),
         *   new Cesium.Cartesian4(2.0, 0.0, 0.0, 0.0));
         */
        Cartesian4.distance = function(left, right) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('left', left);
            Check.Check.typeOf.object('right', right);
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
         * var d = Cesium.Cartesian4.distance(
         *   new Cesium.Cartesian4(1.0, 0.0, 0.0, 0.0),
         *   new Cesium.Cartesian4(3.0, 0.0, 0.0, 0.0));
         */
        Cartesian4.distanceSquared = function(left, right) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('left', left);
            Check.Check.typeOf.object('right', right);
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
        Cartesian4.normalize = function(cartesian, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('cartesian', cartesian);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            var magnitude = Cartesian4.magnitude(cartesian);

            result.x = cartesian.x / magnitude;
            result.y = cartesian.y / magnitude;
            result.z = cartesian.z / magnitude;
            result.w = cartesian.w / magnitude;

            //>>includeStart('debug', pragmas.debug);
            if (isNaN(result.x) || isNaN(result.y) || isNaN(result.z) || isNaN(result.w)) {
                throw new Check.DeveloperError('normalized result is not a number');
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
        Cartesian4.dot = function(left, right) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('left', left);
            Check.Check.typeOf.object('right', right);
            //>>includeEnd('debug');

            return left.x * right.x + left.y * right.y + left.z * right.z + left.w * right.w;
        };

        /**
         * Computes the componentwise product of two Cartesians.
         *
         * @param {Cartesian4} left The first Cartesian.
         * @param {Cartesian4} right The second Cartesian.
         * @param {Cartesian4} result The object onto which to store the result.
         * @returns {Cartesian4} The modified result parameter.
         */
        Cartesian4.multiplyComponents = function(left, right, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('left', left);
            Check.Check.typeOf.object('right', right);
            Check.Check.typeOf.object('result', result);
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
        Cartesian4.divideComponents = function(left, right, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('left', left);
            Check.Check.typeOf.object('right', right);
            Check.Check.typeOf.object('result', result);
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
        Cartesian4.add = function(left, right, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('left', left);
            Check.Check.typeOf.object('right', right);
            Check.Check.typeOf.object('result', result);
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
        Cartesian4.subtract = function(left, right, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('left', left);
            Check.Check.typeOf.object('right', right);
            Check.Check.typeOf.object('result', result);
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
        Cartesian4.multiplyByScalar = function(cartesian, scalar, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('cartesian', cartesian);
            Check.Check.typeOf.number('scalar', scalar);
            Check.Check.typeOf.object('result', result);
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
        Cartesian4.divideByScalar = function(cartesian, scalar, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('cartesian', cartesian);
            Check.Check.typeOf.number('scalar', scalar);
            Check.Check.typeOf.object('result', result);
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
        Cartesian4.negate = function(cartesian, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('cartesian', cartesian);
            Check.Check.typeOf.object('result', result);
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
        Cartesian4.abs = function(cartesian, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('cartesian', cartesian);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            result.x = Math.abs(cartesian.x);
            result.y = Math.abs(cartesian.y);
            result.z = Math.abs(cartesian.z);
            result.w = Math.abs(cartesian.w);
            return result;
        };

        var lerpScratch$1 = new Cartesian4();
        /**
         * Computes the linear interpolation or extrapolation at t using the provided cartesians.
         *
         * @param {Cartesian4} start The value corresponding to t at 0.0.
         * @param {Cartesian4}end The value corresponding to t at 1.0.
         * @param {Number} t The point along t at which to interpolate.
         * @param {Cartesian4} result The object onto which to store the result.
         * @returns {Cartesian4} The modified result parameter.
         */
        Cartesian4.lerp = function(start, end, t, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('start', start);
            Check.Check.typeOf.object('end', end);
            Check.Check.typeOf.number('t', t);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            Cartesian4.multiplyByScalar(end, t, lerpScratch$1);
            result = Cartesian4.multiplyByScalar(start, 1.0 - t, result);
            return Cartesian4.add(lerpScratch$1, result, result);
        };

        var mostOrthogonalAxisScratch = new Cartesian4();
        /**
         * Returns the axis that is most orthogonal to the provided Cartesian.
         *
         * @param {Cartesian4} cartesian The Cartesian on which to find the most orthogonal axis.
         * @param {Cartesian4} result The object onto which to store the result.
         * @returns {Cartesian4} The most orthogonal axis.
         */
        Cartesian4.mostOrthogonalAxis = function(cartesian, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('cartesian', cartesian);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            var f = Cartesian4.normalize(cartesian, mostOrthogonalAxisScratch);
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
        Cartesian4.equals = function(left, right) {
            return (left === right) ||
                   ((defaultValue.defined(left)) &&
                    (defaultValue.defined(right)) &&
                    (left.x === right.x) &&
                    (left.y === right.y) &&
                    (left.z === right.z) &&
                    (left.w === right.w));
        };

        /**
         * @private
         */
        Cartesian4.equalsArray = function(cartesian, array, offset) {
            return cartesian.x === array[offset] &&
                   cartesian.y === array[offset + 1] &&
                   cartesian.z === array[offset + 2] &&
                   cartesian.w === array[offset + 3];
        };

        /**
         * Compares the provided Cartesians componentwise and returns
         * <code>true</code> if they pass an absolute or relative tolerance test,
         * <code>false</code> otherwise.
         *
         * @param {Cartesian4} [left] The first Cartesian.
         * @param {Cartesian4} [right] The second Cartesian.
         * @param {Number} relativeEpsilon The relative epsilon tolerance to use for equality testing.
         * @param {Number} [absoluteEpsilon=relativeEpsilon] The absolute epsilon tolerance to use for equality testing.
         * @returns {Boolean} <code>true</code> if left and right are within the provided epsilon, <code>false</code> otherwise.
         */
        Cartesian4.equalsEpsilon = function(left, right, relativeEpsilon, absoluteEpsilon) {
            return (left === right) ||
                   (defaultValue.defined(left) &&
                    defaultValue.defined(right) &&
                    _Math.CesiumMath.equalsEpsilon(left.x, right.x, relativeEpsilon, absoluteEpsilon) &&
                    _Math.CesiumMath.equalsEpsilon(left.y, right.y, relativeEpsilon, absoluteEpsilon) &&
                    _Math.CesiumMath.equalsEpsilon(left.z, right.z, relativeEpsilon, absoluteEpsilon) &&
                    _Math.CesiumMath.equalsEpsilon(left.w, right.w, relativeEpsilon, absoluteEpsilon));
        };

        /**
         * An immutable Cartesian4 instance initialized to (0.0, 0.0, 0.0, 0.0).
         *
         * @type {Cartesian4}
         * @constant
         */
        Cartesian4.ZERO = Object.freeze(new Cartesian4(0.0, 0.0, 0.0, 0.0));

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
        Cartesian4.prototype.clone = function(result) {
            return Cartesian4.clone(this, result);
        };

        /**
         * Compares this Cartesian against the provided Cartesian componentwise and returns
         * <code>true</code> if they are equal, <code>false</code> otherwise.
         *
         * @param {Cartesian4} [right] The right hand side Cartesian.
         * @returns {Boolean} <code>true</code> if they are equal, <code>false</code> otherwise.
         */
        Cartesian4.prototype.equals = function(right) {
            return Cartesian4.equals(this, right);
        };

        /**
         * Compares this Cartesian against the provided Cartesian componentwise and returns
         * <code>true</code> if they pass an absolute or relative tolerance test,
         * <code>false</code> otherwise.
         *
         * @param {Cartesian4} [right] The right hand side Cartesian.
         * @param {Number} relativeEpsilon The relative epsilon tolerance to use for equality testing.
         * @param {Number} [absoluteEpsilon=relativeEpsilon] The absolute epsilon tolerance to use for equality testing.
         * @returns {Boolean} <code>true</code> if they are within the provided epsilon, <code>false</code> otherwise.
         */
        Cartesian4.prototype.equalsEpsilon = function(right, relativeEpsilon, absoluteEpsilon) {
            return Cartesian4.equalsEpsilon(this, right, relativeEpsilon, absoluteEpsilon);
        };

        /**
         * Creates a string representing this Cartesian in the format '(x, y, z, w)'.
         *
         * @returns {String} A string representing the provided Cartesian in the format '(x, y, z, w)'.
         */
        Cartesian4.prototype.toString = function() {
            return '(' + this.x + ', ' + this.y + ', ' + this.z + ', ' + this.w + ')';
        };

        var scratchFloatArray = new Float32Array(1);
        var SHIFT_LEFT_8 = 256.0;
        var SHIFT_LEFT_16 = 65536.0;
        var SHIFT_LEFT_24 = 16777216.0;

        var SHIFT_RIGHT_8 = 1.0 / SHIFT_LEFT_8;
        var SHIFT_RIGHT_16 = 1.0 / SHIFT_LEFT_16;
        var SHIFT_RIGHT_24 = 1.0 / SHIFT_LEFT_24;

        var BIAS = 38.0;

        /**
         * Packs an arbitrary floating point value to 4 values representable using uint8.
         *
         * @param {Number} value A floating point number
         * @param {Cartesian4} [result] The Cartesian4 that will contain the packed float.
         * @returns {Cartesian4} A Cartesian4 representing the float packed to values in x, y, z, and w.
         */
        Cartesian4.packFloat = function(value, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.number('value', value);
            //>>includeEnd('debug');

            if (!defaultValue.defined(result)) {
                result = new Cartesian4();
            }

            // Force the value to 32 bit precision
            scratchFloatArray[0] = value;
            value = scratchFloatArray[0];

            if (value === 0.0) {
                return Cartesian4.clone(Cartesian4.ZERO, result);
            }

            var sign = value < 0.0 ? 1.0 : 0.0;
            var exponent;

            if (!isFinite(value)) {
                value = 0.1;
                exponent = BIAS;
            } else {
                value = Math.abs(value);
                exponent = Math.floor(_Math.CesiumMath.logBase(value, 10)) + 1.0;
                value = value / Math.pow(10.0, exponent);
            }

            var temp = value * SHIFT_LEFT_8;
            result.x = Math.floor(temp);
            temp = (temp - result.x) * SHIFT_LEFT_8;
            result.y = Math.floor(temp);
            temp = (temp - result.y) * SHIFT_LEFT_8;
            result.z = Math.floor(temp);
            result.w = (exponent + BIAS) * 2.0 + sign;

            return result;
        };

        /**
         * Unpacks a float packed using Cartesian4.packFloat.
         *
         * @param {Cartesian4} packedFloat A Cartesian4 containing a float packed to 4 values representable using uint8.
         * @returns {Number} The unpacked float.
         * @private
         */
        Cartesian4.unpackFloat = function(packedFloat) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('packedFloat', packedFloat);
            //>>includeEnd('debug');

            var temp = packedFloat.w / 2.0;
            var exponent = Math.floor(temp);
            var sign = (temp - exponent) * 2.0;
            exponent = exponent - BIAS;

            sign = sign * 2.0 - 1.0;
            sign = -sign;

            if (exponent >= BIAS) {
                return sign < 0.0 ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY;
            }

            var unpacked = sign * packedFloat.x * SHIFT_RIGHT_8;
            unpacked += sign * packedFloat.y * SHIFT_RIGHT_16;
            unpacked += sign * packedFloat.z * SHIFT_RIGHT_24;

            return unpacked * Math.pow(10.0, exponent);
        };

    /**
         * A 4x4 matrix, indexable as a column-major order array.
         * Constructor parameters are in row-major order for code readability.
         * @alias Matrix4
         * @constructor
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
         * @see Matrix4.fromColumnMajorArray
         * @see Matrix4.fromRowMajorArray
         * @see Matrix4.fromRotationTranslation
         * @see Matrix4.fromTranslationRotationScale
         * @see Matrix4.fromTranslationQuaternionRotationScale
         * @see Matrix4.fromTranslation
         * @see Matrix4.fromScale
         * @see Matrix4.fromUniformScale
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
        function Matrix4(column0Row0, column1Row0, column2Row0, column3Row0,
                         column0Row1, column1Row1, column2Row1, column3Row1,
                         column0Row2, column1Row2, column2Row2, column3Row2,
                         column0Row3, column1Row3, column2Row3, column3Row3) {
            this[0] = defaultValue.defaultValue(column0Row0, 0.0);
            this[1] = defaultValue.defaultValue(column0Row1, 0.0);
            this[2] = defaultValue.defaultValue(column0Row2, 0.0);
            this[3] = defaultValue.defaultValue(column0Row3, 0.0);
            this[4] = defaultValue.defaultValue(column1Row0, 0.0);
            this[5] = defaultValue.defaultValue(column1Row1, 0.0);
            this[6] = defaultValue.defaultValue(column1Row2, 0.0);
            this[7] = defaultValue.defaultValue(column1Row3, 0.0);
            this[8] = defaultValue.defaultValue(column2Row0, 0.0);
            this[9] = defaultValue.defaultValue(column2Row1, 0.0);
            this[10] = defaultValue.defaultValue(column2Row2, 0.0);
            this[11] = defaultValue.defaultValue(column2Row3, 0.0);
            this[12] = defaultValue.defaultValue(column3Row0, 0.0);
            this[13] = defaultValue.defaultValue(column3Row1, 0.0);
            this[14] = defaultValue.defaultValue(column3Row2, 0.0);
            this[15] = defaultValue.defaultValue(column3Row3, 0.0);
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
        Matrix4.pack = function(value, array, startingIndex) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('value', value);
            Check.Check.defined('array', array);
            //>>includeEnd('debug');

            startingIndex = defaultValue.defaultValue(startingIndex, 0);

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
        Matrix4.unpack = function(array, startingIndex, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.defined('array', array);
            //>>includeEnd('debug');

            startingIndex = defaultValue.defaultValue(startingIndex, 0);

            if (!defaultValue.defined(result)) {
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
         * Duplicates a Matrix4 instance.
         *
         * @param {Matrix4} matrix The matrix to duplicate.
         * @param {Matrix4} [result] The object onto which to store the result.
         * @returns {Matrix4} The modified result parameter or a new Matrix4 instance if one was not provided. (Returns undefined if matrix is undefined)
         */
        Matrix4.clone = function(matrix, result) {
            if (!defaultValue.defined(matrix)) {
                return undefined;
            }
            if (!defaultValue.defined(result)) {
                return new Matrix4(matrix[0], matrix[4], matrix[8], matrix[12],
                                   matrix[1], matrix[5], matrix[9], matrix[13],
                                   matrix[2], matrix[6], matrix[10], matrix[14],
                                   matrix[3], matrix[7], matrix[11], matrix[15]);
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
         * var v = [1.0, 1.0, 1.0, 1.0, 2.0, 2.0, 2.0, 2.0, 3.0, 3.0, 3.0, 3.0, 4.0, 4.0, 4.0, 4.0];
         * var m = Cesium.Matrix4.fromArray(v);
         *
         * // Create same Matrix4 with using an offset into an array
         * var v2 = [0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 2.0, 2.0, 2.0, 2.0, 3.0, 3.0, 3.0, 3.0, 4.0, 4.0, 4.0, 4.0];
         * var m2 = Cesium.Matrix4.fromArray(v2, 2);
         */
        Matrix4.fromArray = Matrix4.unpack;

        /**
         * Computes a Matrix4 instance from a column-major order array.
         *
         * @param {Number[]} values The column-major order array.
         * @param {Matrix4} [result] The object in which the result will be stored, if undefined a new instance will be created.
         * @returns {Matrix4} The modified result parameter, or a new Matrix4 instance if one was not provided.
         */
        Matrix4.fromColumnMajorArray = function(values, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.defined('values', values);
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
        Matrix4.fromRowMajorArray = function(values, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.defined('values', values);
            //>>includeEnd('debug');

            if (!defaultValue.defined(result)) {
                return new Matrix4(values[0], values[1], values[2], values[3],
                                   values[4], values[5], values[6], values[7],
                                   values[8], values[9], values[10], values[11],
                                   values[12], values[13], values[14], values[15]);
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
        Matrix4.fromRotationTranslation = function(rotation, translation, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('rotation', rotation);
            //>>includeEnd('debug');

            translation = defaultValue.defaultValue(translation, Cartesian2.Cartesian3.ZERO);

            if (!defaultValue.defined(result)) {
                return new Matrix4(rotation[0], rotation[3], rotation[6], translation.x,
                                   rotation[1], rotation[4], rotation[7], translation.y,
                                   rotation[2], rotation[5], rotation[8], translation.z,
                                           0.0,         0.0,         0.0,           1.0);
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
         * var result = Cesium.Matrix4.fromTranslationQuaternionRotationScale(
         *   new Cesium.Cartesian3(1.0, 2.0, 3.0), // translation
         *   Cesium.Quaternion.IDENTITY,           // rotation
         *   new Cesium.Cartesian3(7.0, 8.0, 9.0), // scale
         *   result);
         */
        Matrix4.fromTranslationQuaternionRotationScale = function(translation, rotation, scale, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('translation', translation);
            Check.Check.typeOf.object('rotation', rotation);
            Check.Check.typeOf.object('scale', scale);
            //>>includeEnd('debug');

            if (!defaultValue.defined(result)) {
                result = new Matrix4();
            }

            var scaleX = scale.x;
            var scaleY = scale.y;
            var scaleZ = scale.z;

            var x2 = rotation.x * rotation.x;
            var xy = rotation.x * rotation.y;
            var xz = rotation.x * rotation.z;
            var xw = rotation.x * rotation.w;
            var y2 = rotation.y * rotation.y;
            var yz = rotation.y * rotation.z;
            var yw = rotation.y * rotation.w;
            var z2 = rotation.z * rotation.z;
            var zw = rotation.z * rotation.w;
            var w2 = rotation.w * rotation.w;

            var m00 = x2 - y2 - z2 + w2;
            var m01 = 2.0 * (xy - zw);
            var m02 = 2.0 * (xz + yw);

            var m10 = 2.0 * (xy + zw);
            var m11 = -x2 + y2 - z2 + w2;
            var m12 = 2.0 * (yz - xw);

            var m20 = 2.0 * (xz - yw);
            var m21 = 2.0 * (yz + xw);
            var m22 = -x2 - y2 + z2 + w2;

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
        Matrix4.fromTranslationRotationScale = function(translationRotationScale, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('translationRotationScale', translationRotationScale);
            //>>includeEnd('debug');

            return Matrix4.fromTranslationQuaternionRotationScale(translationRotationScale.translation, translationRotationScale.rotation, translationRotationScale.scale, result);
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
        Matrix4.fromTranslation = function(translation, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('translation', translation);
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
         * var m = Cesium.Matrix4.fromScale(new Cesium.Cartesian3(7.0, 8.0, 9.0));
         */
        Matrix4.fromScale = function(scale, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('scale', scale);
            //>>includeEnd('debug');

            if (!defaultValue.defined(result)) {
                return new Matrix4(
                    scale.x, 0.0,     0.0,     0.0,
                    0.0,     scale.y, 0.0,     0.0,
                    0.0,     0.0,     scale.z, 0.0,
                    0.0,     0.0,     0.0,     1.0);
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
         * var m = Cesium.Matrix4.fromUniformScale(2.0);
         */
        Matrix4.fromUniformScale = function(scale, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.number('scale', scale);
            //>>includeEnd('debug');

            if (!defaultValue.defined(result)) {
                return new Matrix4(scale, 0.0,   0.0,   0.0,
                                   0.0,   scale, 0.0,   0.0,
                                   0.0,   0.0,   scale, 0.0,
                                   0.0,   0.0,   0.0,   1.0);
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

        var fromCameraF = new Cartesian2.Cartesian3();
        var fromCameraR = new Cartesian2.Cartesian3();
        var fromCameraU = new Cartesian2.Cartesian3();

        /**
         * Computes a Matrix4 instance from a Camera.
         *
         * @param {Camera} camera The camera to use.
         * @param {Matrix4} [result] The object in which the result will be stored, if undefined a new instance will be created.
         * @returns {Matrix4} The modified result parameter, or a new Matrix4 instance if one was not provided.
         */
        Matrix4.fromCamera = function(camera, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('camera', camera);
            //>>includeEnd('debug');

            var position = camera.position;
            var direction = camera.direction;
            var up = camera.up;

            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('camera.position', position);
            Check.Check.typeOf.object('camera.direction', direction);
            Check.Check.typeOf.object('camera.up', up);
            //>>includeEnd('debug');

            Cartesian2.Cartesian3.normalize(direction, fromCameraF);
            Cartesian2.Cartesian3.normalize(Cartesian2.Cartesian3.cross(fromCameraF, up, fromCameraR), fromCameraR);
            Cartesian2.Cartesian3.normalize(Cartesian2.Cartesian3.cross(fromCameraR, fromCameraF, fromCameraU), fromCameraU);

            var sX = fromCameraR.x;
            var sY = fromCameraR.y;
            var sZ = fromCameraR.z;
            var fX = fromCameraF.x;
            var fY = fromCameraF.y;
            var fZ = fromCameraF.z;
            var uX = fromCameraU.x;
            var uY = fromCameraU.y;
            var uZ = fromCameraU.z;
            var positionX = position.x;
            var positionY = position.y;
            var positionZ = position.z;
            var t0 = sX * -positionX + sY * -positionY + sZ * -positionZ;
            var t1 = uX * -positionX + uY * -positionY + uZ * -positionZ;
            var t2 = fX * positionX + fY * positionY + fZ * positionZ;

            // The code below this comment is an optimized
            // version of the commented lines.
            // Rather that create two matrices and then multiply,
            // we just bake in the multiplcation as part of creation.
            // var rotation = new Matrix4(
            //                 sX,  sY,  sZ, 0.0,
            //                 uX,  uY,  uZ, 0.0,
            //                -fX, -fY, -fZ, 0.0,
            //                 0.0,  0.0,  0.0, 1.0);
            // var translation = new Matrix4(
            //                 1.0, 0.0, 0.0, -position.x,
            //                 0.0, 1.0, 0.0, -position.y,
            //                 0.0, 0.0, 1.0, -position.z,
            //                 0.0, 0.0, 0.0, 1.0);
            // return rotation.multiply(translation);
            if (!defaultValue.defined(result)) {
                return new Matrix4(
                        sX,   sY,  sZ, t0,
                        uX,   uY,  uZ, t1,
                       -fX,  -fY, -fZ, t2,
                        0.0, 0.0, 0.0, 1.0);
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
        Matrix4.computePerspectiveFieldOfView = function(fovY, aspectRatio, near, far, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.number.greaterThan('fovY', fovY, 0.0);
            Check.Check.typeOf.number.lessThan('fovY', fovY, Math.PI);
            Check.Check.typeOf.number.greaterThan('near', near, 0.0);
            Check.Check.typeOf.number.greaterThan('far', far, 0.0);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            var bottom = Math.tan(fovY * 0.5);

            var column1Row1 = 1.0 / bottom;
            var column0Row0 = column1Row1 / aspectRatio;
            var column2Row2 = (far + near) / (near - far);
            var column3Row2 = (2.0 * far * near) / (near - far);

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
        Matrix4.computeOrthographicOffCenter = function(left, right, bottom, top, near, far, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.number('left', left);
            Check.Check.typeOf.number('right', right);
            Check.Check.typeOf.number('bottom', bottom);
            Check.Check.typeOf.number('top', top);
            Check.Check.typeOf.number('near', near);
            Check.Check.typeOf.number('far', far);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            var a = 1.0 / (right - left);
            var b = 1.0 / (top - bottom);
            var c = 1.0 / (far - near);

            var tx = -(right + left) * a;
            var ty = -(top + bottom) * b;
            var tz = -(far + near) * c;
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
        Matrix4.computePerspectiveOffCenter = function(left, right, bottom, top, near, far, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.number('left', left);
            Check.Check.typeOf.number('right', right);
            Check.Check.typeOf.number('bottom', bottom);
            Check.Check.typeOf.number('top', top);
            Check.Check.typeOf.number('near', near);
            Check.Check.typeOf.number('far', far);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            var column0Row0 = 2.0 * near / (right - left);
            var column1Row1 = 2.0 * near / (top - bottom);
            var column2Row0 = (right + left) / (right - left);
            var column2Row1 = (top + bottom) / (top - bottom);
            var column2Row2 = -(far + near) / (far - near);
            var column2Row3 = -1.0;
            var column3Row2 = -2.0 * far * near / (far - near);

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
        Matrix4.computeInfinitePerspectiveOffCenter = function(left, right, bottom, top, near, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.number('left', left);
            Check.Check.typeOf.number('right', right);
            Check.Check.typeOf.number('bottom', bottom);
            Check.Check.typeOf.number('top', top);
            Check.Check.typeOf.number('near', near);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            var column0Row0 = 2.0 * near / (right - left);
            var column1Row1 = 2.0 * near / (top - bottom);
            var column2Row0 = (right + left) / (right - left);
            var column2Row1 = (top + bottom) / (top - bottom);
            var column2Row2 = -1.0;
            var column2Row3 = -1.0;
            var column3Row2 = -2.0 * near;

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
         * @param {Object}[viewport = { x : 0.0, y : 0.0, width : 0.0, height : 0.0 }] The viewport's corners as shown in Example 1.
         * @param {Number}[nearDepthRange=0.0] The near plane distance in window coordinates.
         * @param {Number}[farDepthRange=1.0] The far plane distance in window coordinates.
         * @param {Matrix4} result The object in which the result will be stored.
         * @returns {Matrix4} The modified result parameter.
         *
         * @example
         * // Create viewport transformation using an explicit viewport and depth range.
         * var m = Cesium.Matrix4.computeViewportTransformation({
         *     x : 0.0,
         *     y : 0.0,
         *     width : 1024.0,
         *     height : 768.0
         * }, 0.0, 1.0, new Cesium.Matrix4());
         */
        Matrix4.computeViewportTransformation = function(viewport, nearDepthRange, farDepthRange, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            viewport = defaultValue.defaultValue(viewport, defaultValue.defaultValue.EMPTY_OBJECT);
            var x = defaultValue.defaultValue(viewport.x, 0.0);
            var y = defaultValue.defaultValue(viewport.y, 0.0);
            var width = defaultValue.defaultValue(viewport.width, 0.0);
            var height = defaultValue.defaultValue(viewport.height, 0.0);
            nearDepthRange = defaultValue.defaultValue(nearDepthRange, 0.0);
            farDepthRange = defaultValue.defaultValue(farDepthRange, 1.0);

            var halfWidth = width * 0.5;
            var halfHeight = height * 0.5;
            var halfDepth = (farDepthRange - nearDepthRange) * 0.5;

            var column0Row0 = halfWidth;
            var column1Row1 = halfHeight;
            var column2Row2 = halfDepth;
            var column3Row0 = x + halfWidth;
            var column3Row1 = y + halfHeight;
            var column3Row2 = nearDepthRange + halfDepth;
            var column3Row3 = 1.0;

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
        Matrix4.computeView = function(position, direction, up, right, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('position', position);
            Check.Check.typeOf.object('direction', direction);
            Check.Check.typeOf.object('up', up);
            Check.Check.typeOf.object('right', right);
            Check.Check.typeOf.object('result', result);
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
            result[12] = -Cartesian2.Cartesian3.dot(right, position);
            result[13] = -Cartesian2.Cartesian3.dot(up, position);
            result[14] = Cartesian2.Cartesian3.dot(direction, position);
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
         * var a = Cesium.Matrix4.toArray(m);
         *
         * // m remains the same
         * //creates a = [10.0, 11.0, 12.0, 13.0, 14.0, 15.0, 16.0, 17.0, 18.0, 19.0, 20.0, 21.0, 22.0, 23.0, 24.0, 25.0]
         */
        Matrix4.toArray = function(matrix, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('matrix', matrix);
            //>>includeEnd('debug');

            if (!defaultValue.defined(result)) {
                return [matrix[0], matrix[1], matrix[2], matrix[3],
                        matrix[4], matrix[5], matrix[6], matrix[7],
                        matrix[8], matrix[9], matrix[10], matrix[11],
                        matrix[12], matrix[13], matrix[14], matrix[15]];
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
         * var myMatrix = new Cesium.Matrix4();
         * var column1Row0Index = Cesium.Matrix4.getElementIndex(1, 0);
         * var column1Row0 = myMatrix[column1Row0Index];
         * myMatrix[column1Row0Index] = 10.0;
         */
        Matrix4.getElementIndex = function(column, row) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.number.greaterThanOrEquals('row', row, 0);
            Check.Check.typeOf.number.lessThanOrEquals('row', row, 3);

            Check.Check.typeOf.number.greaterThanOrEquals('column', column, 0);
            Check.Check.typeOf.number.lessThanOrEquals('column', column, 3);
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
         * var a = Cesium.Matrix4.getColumn(m, 2, new Cesium.Cartesian4());
         *
         * @example
         * //Example 2: Sets values for Cartesian instance
         * var a = new Cesium.Cartesian4();
         * Cesium.Matrix4.getColumn(m, 2, a);
         *
         * // a.x = 12.0; a.y = 16.0; a.z = 20.0; a.w = 24.0;
         */
        Matrix4.getColumn = function(matrix, index, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('matrix', matrix);

            Check.Check.typeOf.number.greaterThanOrEquals('index', index, 0);
            Check.Check.typeOf.number.lessThanOrEquals('index', index, 3);

            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            var startIndex = index * 4;
            var x = matrix[startIndex];
            var y = matrix[startIndex + 1];
            var z = matrix[startIndex + 2];
            var w = matrix[startIndex + 3];

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
         * var a = Cesium.Matrix4.setColumn(m, 2, new Cesium.Cartesian4(99.0, 98.0, 97.0, 96.0), new Cesium.Matrix4());
         *
         * // m remains the same
         * // a = [10.0, 11.0, 99.0, 13.0]
         * //     [14.0, 15.0, 98.0, 17.0]
         * //     [18.0, 19.0, 97.0, 21.0]
         * //     [22.0, 23.0, 96.0, 25.0]
         */
        Matrix4.setColumn = function(matrix, index, cartesian, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('matrix', matrix);

            Check.Check.typeOf.number.greaterThanOrEquals('index', index, 0);
            Check.Check.typeOf.number.lessThanOrEquals('index', index, 3);

            Check.Check.typeOf.object('cartesian', cartesian);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            result = Matrix4.clone(matrix, result);
            var startIndex = index * 4;
            result[startIndex] = cartesian.x;
            result[startIndex + 1] = cartesian.y;
            result[startIndex + 2] = cartesian.z;
            result[startIndex + 3] = cartesian.w;
            return result;
        };

        /**
         * Computes a new matrix that replaces the translation in the rightmost column of the provided
         * matrix with the provided translation.  This assumes the matrix is an affine transformation
         *
         * @param {Matrix4} matrix The matrix to use.
         * @param {Cartesian3} translation The translation that replaces the translation of the provided matrix.
         * @param {Matrix4} result The object onto which to store the result.
         * @returns {Matrix4} The modified result parameter.
         */
        Matrix4.setTranslation = function(matrix, translation, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('matrix', matrix);
            Check.Check.typeOf.object('translation', translation);
            Check.Check.typeOf.object('result', result);
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

        var scaleScratch = new Cartesian2.Cartesian3();
        /**
         * Computes a new matrix that replaces the scale with the provided scale.  This assumes the matrix is an affine transformation
         *
         * @param {Matrix4} matrix The matrix to use.
         * @param {Cartesian3} scale The scale that replaces the scale of the provided matrix.
         * @param {Matrix4} result The object onto which to store the result.
         * @returns {Matrix4} The modified result parameter.
         */
        Matrix4.setScale = function(matrix, scale, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('matrix', matrix);
            Check.Check.typeOf.object('scale', scale);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            var existingScale = Matrix4.getScale(matrix, scaleScratch);
            var newScale = Cartesian2.Cartesian3.divideComponents(scale, existingScale, scaleScratch);
            return Matrix4.multiplyByScale(matrix, newScale, result);
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
         * var a = Cesium.Matrix4.getRow(m, 2, new Cesium.Cartesian4());
         *
         * @example
         * //Example 2: Sets values for a Cartesian instance
         * var a = new Cesium.Cartesian4();
         * Cesium.Matrix4.getRow(m, 2, a);
         *
         * // a.x = 18.0; a.y = 19.0; a.z = 20.0; a.w = 21.0;
         */
        Matrix4.getRow = function(matrix, index, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('matrix', matrix);

            Check.Check.typeOf.number.greaterThanOrEquals('index', index, 0);
            Check.Check.typeOf.number.lessThanOrEquals('index', index, 3);

            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            var x = matrix[index];
            var y = matrix[index + 4];
            var z = matrix[index + 8];
            var w = matrix[index + 12];

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
         * var a = Cesium.Matrix4.setRow(m, 2, new Cesium.Cartesian4(99.0, 98.0, 97.0, 96.0), new Cesium.Matrix4());
         *
         * // m remains the same
         * // a = [10.0, 11.0, 12.0, 13.0]
         * //     [14.0, 15.0, 16.0, 17.0]
         * //     [99.0, 98.0, 97.0, 96.0]
         * //     [22.0, 23.0, 24.0, 25.0]
         */
        Matrix4.setRow = function(matrix, index, cartesian, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('matrix', matrix);

            Check.Check.typeOf.number.greaterThanOrEquals('index', index, 0);
            Check.Check.typeOf.number.lessThanOrEquals('index', index, 3);

            Check.Check.typeOf.object('cartesian', cartesian);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            result = Matrix4.clone(matrix, result);
            result[index] = cartesian.x;
            result[index + 4] = cartesian.y;
            result[index + 8] = cartesian.z;
            result[index + 12] = cartesian.w;
            return result;
        };

        var scratchColumn = new Cartesian2.Cartesian3();

        /**
         * Extracts the non-uniform scale assuming the matrix is an affine transformation.
         *
         * @param {Matrix4} matrix The matrix.
         * @param {Cartesian3} result The object onto which to store the result.
         * @returns {Cartesian3} The modified result parameter
         */
        Matrix4.getScale = function(matrix, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('matrix', matrix);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            result.x = Cartesian2.Cartesian3.magnitude(Cartesian2.Cartesian3.fromElements(matrix[0], matrix[1], matrix[2], scratchColumn));
            result.y = Cartesian2.Cartesian3.magnitude(Cartesian2.Cartesian3.fromElements(matrix[4], matrix[5], matrix[6], scratchColumn));
            result.z = Cartesian2.Cartesian3.magnitude(Cartesian2.Cartesian3.fromElements(matrix[8], matrix[9], matrix[10], scratchColumn));
            return result;
        };

        var scratchScale$1 = new Cartesian2.Cartesian3();

        /**
         * Computes the maximum scale assuming the matrix is an affine transformation.
         * The maximum scale is the maximum length of the column vectors in the upper-left
         * 3x3 matrix.
         *
         * @param {Matrix4} matrix The matrix.
         * @returns {Number} The maximum scale.
         */
        Matrix4.getMaximumScale = function(matrix) {
            Matrix4.getScale(matrix, scratchScale$1);
            return Cartesian2.Cartesian3.maximumComponent(scratchScale$1);
        };

        /**
         * Computes the product of two matrices.
         *
         * @param {Matrix4} left The first matrix.
         * @param {Matrix4} right The second matrix.
         * @param {Matrix4} result The object onto which to store the result.
         * @returns {Matrix4} The modified result parameter.
         */
        Matrix4.multiply = function(left, right, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('left', left);
            Check.Check.typeOf.object('right', right);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            var left0 = left[0];
            var left1 = left[1];
            var left2 = left[2];
            var left3 = left[3];
            var left4 = left[4];
            var left5 = left[5];
            var left6 = left[6];
            var left7 = left[7];
            var left8 = left[8];
            var left9 = left[9];
            var left10 = left[10];
            var left11 = left[11];
            var left12 = left[12];
            var left13 = left[13];
            var left14 = left[14];
            var left15 = left[15];

            var right0 = right[0];
            var right1 = right[1];
            var right2 = right[2];
            var right3 = right[3];
            var right4 = right[4];
            var right5 = right[5];
            var right6 = right[6];
            var right7 = right[7];
            var right8 = right[8];
            var right9 = right[9];
            var right10 = right[10];
            var right11 = right[11];
            var right12 = right[12];
            var right13 = right[13];
            var right14 = right[14];
            var right15 = right[15];

            var column0Row0 = left0 * right0 + left4 * right1 + left8 * right2 + left12 * right3;
            var column0Row1 = left1 * right0 + left5 * right1 + left9 * right2 + left13 * right3;
            var column0Row2 = left2 * right0 + left6 * right1 + left10 * right2 + left14 * right3;
            var column0Row3 = left3 * right0 + left7 * right1 + left11 * right2 + left15 * right3;

            var column1Row0 = left0 * right4 + left4 * right5 + left8 * right6 + left12 * right7;
            var column1Row1 = left1 * right4 + left5 * right5 + left9 * right6 + left13 * right7;
            var column1Row2 = left2 * right4 + left6 * right5 + left10 * right6 + left14 * right7;
            var column1Row3 = left3 * right4 + left7 * right5 + left11 * right6 + left15 * right7;

            var column2Row0 = left0 * right8 + left4 * right9 + left8 * right10 + left12 * right11;
            var column2Row1 = left1 * right8 + left5 * right9 + left9 * right10 + left13 * right11;
            var column2Row2 = left2 * right8 + left6 * right9 + left10 * right10 + left14 * right11;
            var column2Row3 = left3 * right8 + left7 * right9 + left11 * right10 + left15 * right11;

            var column3Row0 = left0 * right12 + left4 * right13 + left8 * right14 + left12 * right15;
            var column3Row1 = left1 * right12 + left5 * right13 + left9 * right14 + left13 * right15;
            var column3Row2 = left2 * right12 + left6 * right13 + left10 * right14 + left14 * right15;
            var column3Row3 = left3 * right12 + left7 * right13 + left11 * right14 + left15 * right15;

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
        Matrix4.add = function(left, right, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('left', left);
            Check.Check.typeOf.object('right', right);
            Check.Check.typeOf.object('result', result);
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
        Matrix4.subtract = function(left, right, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('left', left);
            Check.Check.typeOf.object('right', right);
            Check.Check.typeOf.object('result', result);
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
         * Computes the product of two matrices assuming the matrices are
         * affine transformation matrices, where the upper left 3x3 elements
         * are a rotation matrix, and the upper three elements in the fourth
         * column are the translation.  The bottom row is assumed to be [0, 0, 0, 1].
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
         * var m1 = new Cesium.Matrix4(1.0, 6.0, 7.0, 0.0, 2.0, 5.0, 8.0, 0.0, 3.0, 4.0, 9.0, 0.0, 0.0, 0.0, 0.0, 1.0);
         * var m2 = Cesium.Transforms.eastNorthUpToFixedFrame(new Cesium.Cartesian3(1.0, 1.0, 1.0));
         * var m3 = Cesium.Matrix4.multiplyTransformation(m1, m2, new Cesium.Matrix4());
         */
        Matrix4.multiplyTransformation = function(left, right, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('left', left);
            Check.Check.typeOf.object('right', right);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            var left0 = left[0];
            var left1 = left[1];
            var left2 = left[2];
            var left4 = left[4];
            var left5 = left[5];
            var left6 = left[6];
            var left8 = left[8];
            var left9 = left[9];
            var left10 = left[10];
            var left12 = left[12];
            var left13 = left[13];
            var left14 = left[14];

            var right0 = right[0];
            var right1 = right[1];
            var right2 = right[2];
            var right4 = right[4];
            var right5 = right[5];
            var right6 = right[6];
            var right8 = right[8];
            var right9 = right[9];
            var right10 = right[10];
            var right12 = right[12];
            var right13 = right[13];
            var right14 = right[14];

            var column0Row0 = left0 * right0 + left4 * right1 + left8 * right2;
            var column0Row1 = left1 * right0 + left5 * right1 + left9 * right2;
            var column0Row2 = left2 * right0 + left6 * right1 + left10 * right2;

            var column1Row0 = left0 * right4 + left4 * right5 + left8 * right6;
            var column1Row1 = left1 * right4 + left5 * right5 + left9 * right6;
            var column1Row2 = left2 * right4 + left6 * right5 + left10 * right6;

            var column2Row0 = left0 * right8 + left4 * right9 + left8 * right10;
            var column2Row1 = left1 * right8 + left5 * right9 + left9 * right10;
            var column2Row2 = left2 * right8 + left6 * right9 + left10 * right10;

            var column3Row0 = left0 * right12 + left4 * right13 + left8 * right14 + left12;
            var column3Row1 = left1 * right12 + left5 * right13 + left9 * right14 + left13;
            var column3Row2 = left2 * right12 + left6 * right13 + left10 * right14 + left14;

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
        Matrix4.multiplyByMatrix3 = function(matrix, rotation, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('matrix', matrix);
            Check.Check.typeOf.object('rotation', rotation);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            var left0 = matrix[0];
            var left1 = matrix[1];
            var left2 = matrix[2];
            var left4 = matrix[4];
            var left5 = matrix[5];
            var left6 = matrix[6];
            var left8 = matrix[8];
            var left9 = matrix[9];
            var left10 = matrix[10];

            var right0 = rotation[0];
            var right1 = rotation[1];
            var right2 = rotation[2];
            var right4 = rotation[3];
            var right5 = rotation[4];
            var right6 = rotation[5];
            var right8 = rotation[6];
            var right9 = rotation[7];
            var right10 = rotation[8];

            var column0Row0 = left0 * right0 + left4 * right1 + left8 * right2;
            var column0Row1 = left1 * right0 + left5 * right1 + left9 * right2;
            var column0Row2 = left2 * right0 + left6 * right1 + left10 * right2;

            var column1Row0 = left0 * right4 + left4 * right5 + left8 * right6;
            var column1Row1 = left1 * right4 + left5 * right5 + left9 * right6;
            var column1Row2 = left2 * right4 + left6 * right5 + left10 * right6;

            var column2Row0 = left0 * right8 + left4 * right9 + left8 * right10;
            var column2Row1 = left1 * right8 + left5 * right9 + left9 * right10;
            var column2Row2 = left2 * right8 + left6 * right9 + left10 * right10;

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
        Matrix4.multiplyByTranslation = function(matrix, translation, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('matrix', matrix);
            Check.Check.typeOf.object('translation', translation);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            var x = translation.x;
            var y = translation.y;
            var z = translation.z;

            var tx = (x * matrix[0]) + (y * matrix[4]) + (z * matrix[8]) + matrix[12];
            var ty = (x * matrix[1]) + (y * matrix[5]) + (z * matrix[9]) + matrix[13];
            var tz = (x * matrix[2]) + (y * matrix[6]) + (z * matrix[10]) + matrix[14];

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

        var uniformScaleScratch = new Cartesian2.Cartesian3();

        /**
         * Multiplies an affine transformation matrix (with a bottom row of <code>[0.0, 0.0, 0.0, 1.0]</code>)
         * by an implicit uniform scale matrix.  This is an optimization
         * for <code>Matrix4.multiply(m, Matrix4.fromUniformScale(scale), m);</code>, where
         * <code>m</code> must be an affine matrix.
         * This function performs fewer allocations and arithmetic operations.
         *
         * @param {Matrix4} matrix The affine matrix on the left-hand side.
         * @param {Number} scale The uniform scale on the right-hand side.
         * @param {Matrix4} result The object onto which to store the result.
         * @returns {Matrix4} The modified result parameter.
         *
         *
         * @example
         * // Instead of Cesium.Matrix4.multiply(m, Cesium.Matrix4.fromUniformScale(scale), m);
         * Cesium.Matrix4.multiplyByUniformScale(m, scale, m);
         *
         * @see Matrix4.fromUniformScale
         * @see Matrix4.multiplyByScale
         */
        Matrix4.multiplyByUniformScale = function(matrix, scale, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('matrix', matrix);
            Check.Check.typeOf.number('scale', scale);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            uniformScaleScratch.x = scale;
            uniformScaleScratch.y = scale;
            uniformScaleScratch.z = scale;
            return Matrix4.multiplyByScale(matrix, uniformScaleScratch, result);
        };

        /**
         * Multiplies an affine transformation matrix (with a bottom row of <code>[0.0, 0.0, 0.0, 1.0]</code>)
         * by an implicit non-uniform scale matrix.  This is an optimization
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
         * @see Matrix4.fromScale
         * @see Matrix4.multiplyByUniformScale
         */
        Matrix4.multiplyByScale = function(matrix, scale, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('matrix', matrix);
            Check.Check.typeOf.object('scale', scale);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            var scaleX = scale.x;
            var scaleY = scale.y;
            var scaleZ = scale.z;

            // Faster than Cartesian3.equals
            if ((scaleX === 1.0) && (scaleY === 1.0) && (scaleZ === 1.0)) {
                return Matrix4.clone(matrix, result);
            }

            result[0] = scaleX * matrix[0];
            result[1] = scaleX * matrix[1];
            result[2] = scaleX * matrix[2];
            result[3] = 0.0;
            result[4] = scaleY * matrix[4];
            result[5] = scaleY * matrix[5];
            result[6] = scaleY * matrix[6];
            result[7] = 0.0;
            result[8] = scaleZ * matrix[8];
            result[9] = scaleZ * matrix[9];
            result[10] = scaleZ * matrix[10];
            result[11] = 0.0;
            result[12] = matrix[12];
            result[13] = matrix[13];
            result[14] = matrix[14];
            result[15] = 1.0;
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
        Matrix4.multiplyByVector = function(matrix, cartesian, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('matrix', matrix);
            Check.Check.typeOf.object('cartesian', cartesian);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            var vX = cartesian.x;
            var vY = cartesian.y;
            var vZ = cartesian.z;
            var vW = cartesian.w;

            var x = matrix[0] * vX + matrix[4] * vY + matrix[8] * vZ + matrix[12] * vW;
            var y = matrix[1] * vX + matrix[5] * vY + matrix[9] * vZ + matrix[13] * vW;
            var z = matrix[2] * vX + matrix[6] * vY + matrix[10] * vZ + matrix[14] * vW;
            var w = matrix[3] * vX + matrix[7] * vY + matrix[11] * vZ + matrix[15] * vW;

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
         * var p = new Cesium.Cartesian3(1.0, 2.0, 3.0);
         * var result = Cesium.Matrix4.multiplyByPointAsVector(matrix, p, new Cesium.Cartesian3());
         * // A shortcut for
         * //   Cartesian3 p = ...
         * //   Cesium.Matrix4.multiplyByVector(matrix, new Cesium.Cartesian4(p.x, p.y, p.z, 0.0), result);
         */
        Matrix4.multiplyByPointAsVector = function(matrix, cartesian, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('matrix', matrix);
            Check.Check.typeOf.object('cartesian', cartesian);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            var vX = cartesian.x;
            var vY = cartesian.y;
            var vZ = cartesian.z;

            var x = matrix[0] * vX + matrix[4] * vY + matrix[8] * vZ;
            var y = matrix[1] * vX + matrix[5] * vY + matrix[9] * vZ;
            var z = matrix[2] * vX + matrix[6] * vY + matrix[10] * vZ;

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
         * var p = new Cesium.Cartesian3(1.0, 2.0, 3.0);
         * var result = Cesium.Matrix4.multiplyByPoint(matrix, p, new Cesium.Cartesian3());
         */
        Matrix4.multiplyByPoint = function(matrix, cartesian, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('matrix', matrix);
            Check.Check.typeOf.object('cartesian', cartesian);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            var vX = cartesian.x;
            var vY = cartesian.y;
            var vZ = cartesian.z;

            var x = matrix[0] * vX + matrix[4] * vY + matrix[8] * vZ + matrix[12];
            var y = matrix[1] * vX + matrix[5] * vY + matrix[9] * vZ + matrix[13];
            var z = matrix[2] * vX + matrix[6] * vY + matrix[10] * vZ + matrix[14];

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
         * var a = Cesium.Matrix4.multiplyByScalar(m, -2, new Cesium.Matrix4());
         *
         * // m remains the same
         * // a = [-20.0, -22.0, -24.0, -26.0]
         * //     [-28.0, -30.0, -32.0, -34.0]
         * //     [-36.0, -38.0, -40.0, -42.0]
         * //     [-44.0, -46.0, -48.0, -50.0]
         */
        Matrix4.multiplyByScalar = function(matrix, scalar, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('matrix', matrix);
            Check.Check.typeOf.number('scalar', scalar);
            Check.Check.typeOf.object('result', result);
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
         * var a = Cesium.Matrix4.negate(m, new Cesium.Matrix4());
         *
         * // m remains the same
         * // a = [-10.0, -11.0, -12.0, -13.0]
         * //     [-14.0, -15.0, -16.0, -17.0]
         * //     [-18.0, -19.0, -20.0, -21.0]
         * //     [-22.0, -23.0, -24.0, -25.0]
         */
        Matrix4.negate = function(matrix, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('matrix', matrix);
            Check.Check.typeOf.object('result', result);
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
         * var a = Cesium.Matrix4.transpose(m, new Cesium.Matrix4());
         *
         * // m remains the same
         * // a = [10.0, 14.0, 18.0, 22.0]
         * //     [11.0, 15.0, 19.0, 23.0]
         * //     [12.0, 16.0, 20.0, 24.0]
         * //     [13.0, 17.0, 21.0, 25.0]
         */
        Matrix4.transpose = function(matrix, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('matrix', matrix);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            var matrix1 = matrix[1];
            var matrix2 = matrix[2];
            var matrix3 = matrix[3];
            var matrix6 = matrix[6];
            var matrix7 = matrix[7];
            var matrix11 = matrix[11];

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
        Matrix4.abs = function(matrix, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('matrix', matrix);
            Check.Check.typeOf.object('result', result);
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
        Matrix4.equals = function(left, right) {
            // Given that most matrices will be transformation matrices, the elements
            // are tested in order such that the test is likely to fail as early
            // as possible.  I _think_ this is just as friendly to the L1 cache
            // as testing in index order.  It is certainty faster in practice.
            return (left === right) ||
                   (defaultValue.defined(left) &&
                    defaultValue.defined(right) &&
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
                    left[15] === right[15]);
        };

        /**
         * Compares the provided matrices componentwise and returns
         * <code>true</code> if they are within the provided epsilon,
         * <code>false</code> otherwise.
         *
         * @param {Matrix4} [left] The first matrix.
         * @param {Matrix4} [right] The second matrix.
         * @param {Number} epsilon The epsilon to use for equality testing.
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
        Matrix4.equalsEpsilon = function(left, right, epsilon) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.number('epsilon', epsilon);
            //>>includeEnd('debug');

            return (left === right) ||
                   (defaultValue.defined(left) &&
                    defaultValue.defined(right) &&
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
                    Math.abs(left[15] - right[15]) <= epsilon);
        };

        /**
         * Gets the translation portion of the provided matrix, assuming the matrix is a affine transformation matrix.
         *
         * @param {Matrix4} matrix The matrix to use.
         * @param {Cartesian3} result The object onto which to store the result.
         * @returns {Cartesian3} The modified result parameter.
         */
        Matrix4.getTranslation = function(matrix, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('matrix', matrix);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            result.x = matrix[12];
            result.y = matrix[13];
            result.z = matrix[14];
            return result;
        };

        /**
         * Gets the upper left 3x3 rotation matrix of the provided matrix, assuming the matrix is an affine transformation matrix.
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
         * var b = new Cesium.Matrix3();
         * Cesium.Matrix4.getMatrix3(m,b);
         *
         * // b = [10.0, 14.0, 18.0]
         * //     [11.0, 15.0, 19.0]
         * //     [12.0, 16.0, 20.0]
         */
        Matrix4.getMatrix3 = function(matrix, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('matrix', matrix);
            Check.Check.typeOf.object('result', result);
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

        var scratchInverseRotation = new Matrix3();
        var scratchMatrix3Zero = new Matrix3();
        var scratchBottomRow = new Cartesian4();
        var scratchExpectedBottomRow = new Cartesian4(0.0, 0.0, 0.0, 1.0);

        /**
         * Computes the inverse of the provided matrix using Cramers Rule.
         * If the determinant is zero, the matrix can not be inverted, and an exception is thrown.
         * If the matrix is an affine transformation matrix, it is more efficient
         * to invert it with {@link Matrix4.inverseTransformation}.
         *
         * @param {Matrix4} matrix The matrix to invert.
         * @param {Matrix4} result The object onto which to store the result.
         * @returns {Matrix4} The modified result parameter.
         *
         * @exception {RuntimeError} matrix is not invertible because its determinate is zero.
         */
        Matrix4.inverse = function(matrix, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('matrix', matrix);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');
            //
            // Ported from:
            //   ftp://download.intel.com/design/PentiumIII/sml/24504301.pdf
            //
            var src0 = matrix[0];
            var src1 = matrix[4];
            var src2 = matrix[8];
            var src3 = matrix[12];
            var src4 = matrix[1];
            var src5 = matrix[5];
            var src6 = matrix[9];
            var src7 = matrix[13];
            var src8 = matrix[2];
            var src9 = matrix[6];
            var src10 = matrix[10];
            var src11 = matrix[14];
            var src12 = matrix[3];
            var src13 = matrix[7];
            var src14 = matrix[11];
            var src15 = matrix[15];

            // calculate pairs for first 8 elements (cofactors)
            var tmp0 = src10 * src15;
            var tmp1 = src11 * src14;
            var tmp2 = src9 * src15;
            var tmp3 = src11 * src13;
            var tmp4 = src9 * src14;
            var tmp5 = src10 * src13;
            var tmp6 = src8 * src15;
            var tmp7 = src11 * src12;
            var tmp8 = src8 * src14;
            var tmp9 = src10 * src12;
            var tmp10 = src8 * src13;
            var tmp11 = src9 * src12;

            // calculate first 8 elements (cofactors)
            var dst0 = (tmp0 * src5 + tmp3 * src6 + tmp4 * src7) - (tmp1 * src5 + tmp2 * src6 + tmp5 * src7);
            var dst1 = (tmp1 * src4 + tmp6 * src6 + tmp9 * src7) - (tmp0 * src4 + tmp7 * src6 + tmp8 * src7);
            var dst2 = (tmp2 * src4 + tmp7 * src5 + tmp10 * src7) - (tmp3 * src4 + tmp6 * src5 + tmp11 * src7);
            var dst3 = (tmp5 * src4 + tmp8 * src5 + tmp11 * src6) - (tmp4 * src4 + tmp9 * src5 + tmp10 * src6);
            var dst4 = (tmp1 * src1 + tmp2 * src2 + tmp5 * src3) - (tmp0 * src1 + tmp3 * src2 + tmp4 * src3);
            var dst5 = (tmp0 * src0 + tmp7 * src2 + tmp8 * src3) - (tmp1 * src0 + tmp6 * src2 + tmp9 * src3);
            var dst6 = (tmp3 * src0 + tmp6 * src1 + tmp11 * src3) - (tmp2 * src0 + tmp7 * src1 + tmp10 * src3);
            var dst7 = (tmp4 * src0 + tmp9 * src1 + tmp10 * src2) - (tmp5 * src0 + tmp8 * src1 + tmp11 * src2);

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
            var dst8 = (tmp0 * src13 + tmp3 * src14 + tmp4 * src15) - (tmp1 * src13 + tmp2 * src14 + tmp5 * src15);
            var dst9 = (tmp1 * src12 + tmp6 * src14 + tmp9 * src15) - (tmp0 * src12 + tmp7 * src14 + tmp8 * src15);
            var dst10 = (tmp2 * src12 + tmp7 * src13 + tmp10 * src15) - (tmp3 * src12 + tmp6 * src13 + tmp11 * src15);
            var dst11 = (tmp5 * src12 + tmp8 * src13 + tmp11 * src14) - (tmp4 * src12 + tmp9 * src13 + tmp10 * src14);
            var dst12 = (tmp2 * src10 + tmp5 * src11 + tmp1 * src9) - (tmp4 * src11 + tmp0 * src9 + tmp3 * src10);
            var dst13 = (tmp8 * src11 + tmp0 * src8 + tmp7 * src10) - (tmp6 * src10 + tmp9 * src11 + tmp1 * src8);
            var dst14 = (tmp6 * src9 + tmp11 * src11 + tmp3 * src8) - (tmp10 * src11 + tmp2 * src8 + tmp7 * src9);
            var dst15 = (tmp10 * src10 + tmp4 * src8 + tmp9 * src9) - (tmp8 * src9 + tmp11 * src10 + tmp5 * src8);

            // calculate determinant
            var det = src0 * dst0 + src1 * dst1 + src2 * dst2 + src3 * dst3;

            if (Math.abs(det) < _Math.CesiumMath.EPSILON21) {
                // Special case for a zero scale matrix that can occur, for example,
                // when a model's node has a [0, 0, 0] scale.
                if (Matrix3.equalsEpsilon(Matrix4.getMatrix3(matrix, scratchInverseRotation), scratchMatrix3Zero, _Math.CesiumMath.EPSILON7) &&
                    Cartesian4.equals(Matrix4.getRow(matrix, 3, scratchBottomRow), scratchExpectedBottomRow)) {

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

                throw new RuntimeError.RuntimeError('matrix is not invertible because its determinate is zero.');
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
         * Computes the inverse of the provided matrix assuming it is
         * an affine transformation matrix, where the upper left 3x3 elements
         * are a rotation matrix, and the upper three elements in the fourth
         * column are the translation.  The bottom row is assumed to be [0, 0, 0, 1].
         * The matrix is not verified to be in the proper form.
         * This method is faster than computing the inverse for a general 4x4
         * matrix using {@link Matrix4.inverse}.
         *
         * @param {Matrix4} matrix The matrix to invert.
         * @param {Matrix4} result The object onto which to store the result.
         * @returns {Matrix4} The modified result parameter.
         */
        Matrix4.inverseTransformation = function(matrix, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('matrix', matrix);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            //This function is an optimized version of the below 4 lines.
            //var rT = Matrix3.transpose(Matrix4.getMatrix3(matrix));
            //var rTN = Matrix3.negate(rT);
            //var rTT = Matrix3.multiplyByVector(rTN, Matrix4.getTranslation(matrix));
            //return Matrix4.fromRotationTranslation(rT, rTT, result);

            var matrix0 = matrix[0];
            var matrix1 = matrix[1];
            var matrix2 = matrix[2];
            var matrix4 = matrix[4];
            var matrix5 = matrix[5];
            var matrix6 = matrix[6];
            var matrix8 = matrix[8];
            var matrix9 = matrix[9];
            var matrix10 = matrix[10];

            var vX = matrix[12];
            var vY = matrix[13];
            var vZ = matrix[14];

            var x = -matrix0 * vX - matrix1 * vY - matrix2 * vZ;
            var y = -matrix4 * vX - matrix5 * vY - matrix6 * vZ;
            var z = -matrix8 * vX - matrix9 * vY - matrix10 * vZ;

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

        /**
         * An immutable Matrix4 instance initialized to the identity matrix.
         *
         * @type {Matrix4}
         * @constant
         */
        Matrix4.IDENTITY = Object.freeze(new Matrix4(1.0, 0.0, 0.0, 0.0,
                                                    0.0, 1.0, 0.0, 0.0,
                                                    0.0, 0.0, 1.0, 0.0,
                                                    0.0, 0.0, 0.0, 1.0));

        /**
         * An immutable Matrix4 instance initialized to the zero matrix.
         *
         * @type {Matrix4}
         * @constant
         */
        Matrix4.ZERO = Object.freeze(new Matrix4(0.0, 0.0, 0.0, 0.0,
                                                0.0, 0.0, 0.0, 0.0,
                                                0.0, 0.0, 0.0, 0.0,
                                                0.0, 0.0, 0.0, 0.0));

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
            length : {
                get : function() {
                    return Matrix4.packedLength;
                }
            }
        });

        /**
         * Duplicates the provided Matrix4 instance.
         *
         * @param {Matrix4} [result] The object onto which to store the result.
         * @returns {Matrix4} The modified result parameter or a new Matrix4 instance if one was not provided.
         */
        Matrix4.prototype.clone = function(result) {
            return Matrix4.clone(this, result);
        };

        /**
         * Compares this matrix to the provided matrix componentwise and returns
         * <code>true</code> if they are equal, <code>false</code> otherwise.
         *
         * @param {Matrix4} [right] The right hand side matrix.
         * @returns {Boolean} <code>true</code> if they are equal, <code>false</code> otherwise.
         */
        Matrix4.prototype.equals = function(right) {
            return Matrix4.equals(this, right);
        };

        /**
         * @private
         */
        Matrix4.equalsArray = function(matrix, array, offset) {
            return matrix[0] === array[offset] &&
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
                   matrix[15] === array[offset + 15];
        };

        /**
         * Compares this matrix to the provided matrix componentwise and returns
         * <code>true</code> if they are within the provided epsilon,
         * <code>false</code> otherwise.
         *
         * @param {Matrix4} [right] The right hand side matrix.
         * @param {Number} epsilon The epsilon to use for equality testing.
         * @returns {Boolean} <code>true</code> if they are within the provided epsilon, <code>false</code> otherwise.
         */
        Matrix4.prototype.equalsEpsilon = function(right, epsilon) {
            return Matrix4.equalsEpsilon(this, right, epsilon);
        };

        /**
         * Computes a string representing this Matrix with each row being
         * on a separate line and in the format '(column0, column1, column2, column3)'.
         *
         * @returns {String} A string representing the provided Matrix with each row being on a separate line and in the format '(column0, column1, column2, column3)'.
         */
        Matrix4.prototype.toString = function() {
            return '(' + this[0] + ', ' + this[4] + ', ' + this[8] + ', ' + this[12] + ')\n' +
                   '(' + this[1] + ', ' + this[5] + ', ' + this[9] + ', ' + this[13] + ')\n' +
                   '(' + this[2] + ', ' + this[6] + ', ' + this[10] + ', ' + this[14] + ')\n' +
                   '(' + this[3] + ', ' + this[7] + ', ' + this[11] + ', ' + this[15] + ')';
        };

    var _supportsFullscreen;
        var _names = {
            requestFullscreen : undefined,
            exitFullscreen : undefined,
            fullscreenEnabled : undefined,
            fullscreenElement : undefined,
            fullscreenchange : undefined,
            fullscreenerror : undefined
        };

        /**
         * Browser-independent functions for working with the standard fullscreen API.
         *
         * @exports Fullscreen
         * @namespace
         *
         * @see {@link http://dvcs.w3.org/hg/fullscreen/raw-file/tip/Overview.html|W3C Fullscreen Living Specification}
         */
        var Fullscreen = {};

        Object.defineProperties(Fullscreen, {
            /**
             * The element that is currently fullscreen, if any.  To simply check if the
             * browser is in fullscreen mode or not, use {@link Fullscreen#fullscreen}.
             * @memberof Fullscreen
             * @type {Object}
             * @readonly
             */
            element : {
                get : function() {
                    if (!Fullscreen.supportsFullscreen()) {
                        return undefined;
                    }

                    return document[_names.fullscreenElement];
                }
            },

            /**
             * The name of the event on the document that is fired when fullscreen is
             * entered or exited.  This event name is intended for use with addEventListener.
             * In your event handler, to determine if the browser is in fullscreen mode or not,
             * use {@link Fullscreen#fullscreen}.
             * @memberof Fullscreen
             * @type {String}
             * @readonly
             */
            changeEventName : {
                get : function() {
                    if (!Fullscreen.supportsFullscreen()) {
                        return undefined;
                    }

                    return _names.fullscreenchange;
                }
            },

            /**
             * The name of the event that is fired when a fullscreen error
             * occurs.  This event name is intended for use with addEventListener.
             * @memberof Fullscreen
             * @type {String}
             * @readonly
             */
            errorEventName : {
                get : function() {
                    if (!Fullscreen.supportsFullscreen()) {
                        return undefined;
                    }

                    return _names.fullscreenerror;
                }
            },

            /**
             * Determine whether the browser will allow an element to be made fullscreen, or not.
             * For example, by default, iframes cannot go fullscreen unless the containing page
             * adds an "allowfullscreen" attribute (or prefixed equivalent).
             * @memberof Fullscreen
             * @type {Boolean}
             * @readonly
             */
            enabled : {
                get : function() {
                    if (!Fullscreen.supportsFullscreen()) {
                        return undefined;
                    }

                    return document[_names.fullscreenEnabled];
                }
            },

            /**
             * Determines if the browser is currently in fullscreen mode.
             * @memberof Fullscreen
             * @type {Boolean}
             * @readonly
             */
            fullscreen : {
                get : function() {
                    if (!Fullscreen.supportsFullscreen()) {
                        return undefined;
                    }

                    return Fullscreen.element !== null;
                }
            }
        });

        /**
         * Detects whether the browser supports the standard fullscreen API.
         *
         * @returns {Boolean} <code>true</code> if the browser supports the standard fullscreen API,
         * <code>false</code> otherwise.
         */
        Fullscreen.supportsFullscreen = function() {
            if (defaultValue.defined(_supportsFullscreen)) {
                return _supportsFullscreen;
            }

            _supportsFullscreen = false;

            var body = document.body;
            if (typeof body.requestFullscreen === 'function') {
                // go with the unprefixed, standard set of names
                _names.requestFullscreen = 'requestFullscreen';
                _names.exitFullscreen = 'exitFullscreen';
                _names.fullscreenEnabled = 'fullscreenEnabled';
                _names.fullscreenElement = 'fullscreenElement';
                _names.fullscreenchange = 'fullscreenchange';
                _names.fullscreenerror = 'fullscreenerror';
                _supportsFullscreen = true;
                return _supportsFullscreen;
            }

            //check for the correct combination of prefix plus the various names that browsers use
            var prefixes = ['webkit', 'moz', 'o', 'ms', 'khtml'];
            var name;
            for (var i = 0, len = prefixes.length; i < len; ++i) {
                var prefix = prefixes[i];

                // casing of Fullscreen differs across browsers
                name = prefix + 'RequestFullscreen';
                if (typeof body[name] === 'function') {
                    _names.requestFullscreen = name;
                    _supportsFullscreen = true;
                } else {
                    name = prefix + 'RequestFullScreen';
                    if (typeof body[name] === 'function') {
                        _names.requestFullscreen = name;
                        _supportsFullscreen = true;
                    }
                }

                // disagreement about whether it's "exit" as per spec, or "cancel"
                name = prefix + 'ExitFullscreen';
                if (typeof document[name] === 'function') {
                    _names.exitFullscreen = name;
                } else {
                    name = prefix + 'CancelFullScreen';
                    if (typeof document[name] === 'function') {
                        _names.exitFullscreen = name;
                    }
                }

                // casing of Fullscreen differs across browsers
                name = prefix + 'FullscreenEnabled';
                if (document[name] !== undefined) {
                    _names.fullscreenEnabled = name;
                } else {
                    name = prefix + 'FullScreenEnabled';
                    if (document[name] !== undefined) {
                        _names.fullscreenEnabled = name;
                    }
                }

                // casing of Fullscreen differs across browsers
                name = prefix + 'FullscreenElement';
                if (document[name] !== undefined) {
                    _names.fullscreenElement = name;
                } else {
                    name = prefix + 'FullScreenElement';
                    if (document[name] !== undefined) {
                        _names.fullscreenElement = name;
                    }
                }

                // thankfully, event names are all lowercase per spec
                name = prefix + 'fullscreenchange';
                // event names do not have 'on' in the front, but the property on the document does
                if (document['on' + name] !== undefined) {
                    //except on IE
                    if (prefix === 'ms') {
                        name = 'MSFullscreenChange';
                    }
                    _names.fullscreenchange = name;
                }

                name = prefix + 'fullscreenerror';
                if (document['on' + name] !== undefined) {
                    //except on IE
                    if (prefix === 'ms') {
                        name = 'MSFullscreenError';
                    }
                    _names.fullscreenerror = name;
                }
            }

            return _supportsFullscreen;
        };

        /**
         * Asynchronously requests the browser to enter fullscreen mode on the given element.
         * If fullscreen mode is not supported by the browser, does nothing.
         *
         * @param {Object} element The HTML element which will be placed into fullscreen mode.
         * @param {HMDVRDevice} [vrDevice] The VR device.
         *
         * @example
         * // Put the entire page into fullscreen.
         * Cesium.Fullscreen.requestFullscreen(document.body)
         *
         * // Place only the Cesium canvas into fullscreen.
         * Cesium.Fullscreen.requestFullscreen(scene.canvas)
         */
        Fullscreen.requestFullscreen = function(element, vrDevice) {
            if (!Fullscreen.supportsFullscreen()) {
                return;
            }

            element[_names.requestFullscreen]({ vrDisplay: vrDevice });
        };

        /**
         * Asynchronously exits fullscreen mode.  If the browser is not currently
         * in fullscreen, or if fullscreen mode is not supported by the browser, does nothing.
         */
        Fullscreen.exitFullscreen = function() {
            if (!Fullscreen.supportsFullscreen()) {
                return;
            }

            document[_names.exitFullscreen]();
        };

        //For unit tests
        Fullscreen._names = _names;

    /*global CanvasPixelArray*/

        var theNavigator;
        if (typeof navigator !== 'undefined') {
            theNavigator = navigator;
        } else {
            theNavigator = {};
        }

        function extractVersion(versionString) {
            var parts = versionString.split('.');
            for (var i = 0, len = parts.length; i < len; ++i) {
                parts[i] = parseInt(parts[i], 10);
            }
            return parts;
        }

        var isChromeResult;
        var chromeVersionResult;
        function isChrome() {
            if (!defaultValue.defined(isChromeResult)) {
                isChromeResult = false;
                // Edge contains Chrome in the user agent too
                if (!isEdge()) {
                    var fields = (/ Chrome\/([\.0-9]+)/).exec(theNavigator.userAgent);
                    if (fields !== null) {
                        isChromeResult = true;
                        chromeVersionResult = extractVersion(fields[1]);
                    }
                }
            }

            return isChromeResult;
        }

        function chromeVersion() {
            return isChrome() && chromeVersionResult;
        }

        var isSafariResult;
        var safariVersionResult;
        function isSafari() {
            if (!defaultValue.defined(isSafariResult)) {
                isSafariResult = false;

                // Chrome and Edge contain Safari in the user agent too
                if (!isChrome() && !isEdge() && (/ Safari\/[\.0-9]+/).test(theNavigator.userAgent)) {
                    var fields = (/ Version\/([\.0-9]+)/).exec(theNavigator.userAgent);
                    if (fields !== null) {
                        isSafariResult = true;
                        safariVersionResult = extractVersion(fields[1]);
                    }
                }
            }

            return isSafariResult;
        }

        function safariVersion() {
            return isSafari() && safariVersionResult;
        }

        var isWebkitResult;
        var webkitVersionResult;
        function isWebkit() {
            if (!defaultValue.defined(isWebkitResult)) {
                isWebkitResult = false;

                var fields = (/ AppleWebKit\/([\.0-9]+)(\+?)/).exec(theNavigator.userAgent);
                if (fields !== null) {
                    isWebkitResult = true;
                    webkitVersionResult = extractVersion(fields[1]);
                    webkitVersionResult.isNightly = !!fields[2];
                }
            }

            return isWebkitResult;
        }

        function webkitVersion() {
            return isWebkit() && webkitVersionResult;
        }

        var isInternetExplorerResult;
        var internetExplorerVersionResult;
        function isInternetExplorer() {
            if (!defaultValue.defined(isInternetExplorerResult)) {
                isInternetExplorerResult = false;

                var fields;
                if (theNavigator.appName === 'Microsoft Internet Explorer') {
                    fields = /MSIE ([0-9]{1,}[\.0-9]{0,})/.exec(theNavigator.userAgent);
                    if (fields !== null) {
                        isInternetExplorerResult = true;
                        internetExplorerVersionResult = extractVersion(fields[1]);
                    }
                } else if (theNavigator.appName === 'Netscape') {
                    fields = /Trident\/.*rv:([0-9]{1,}[\.0-9]{0,})/.exec(theNavigator.userAgent);
                    if (fields !== null) {
                        isInternetExplorerResult = true;
                        internetExplorerVersionResult = extractVersion(fields[1]);
                    }
                }
            }
            return isInternetExplorerResult;
        }

        function internetExplorerVersion() {
            return isInternetExplorer() && internetExplorerVersionResult;
        }

        var isEdgeResult;
        var edgeVersionResult;
        function isEdge() {
            if (!defaultValue.defined(isEdgeResult)) {
                isEdgeResult = false;
                var fields = (/ Edge\/([\.0-9]+)/).exec(theNavigator.userAgent);
                if (fields !== null) {
                    isEdgeResult = true;
                    edgeVersionResult = extractVersion(fields[1]);
                }
            }
            return isEdgeResult;
        }

        function edgeVersion() {
            return isEdge() && edgeVersionResult;
        }

        var isFirefoxResult;
        var firefoxVersionResult;
        function isFirefox() {
            if (!defaultValue.defined(isFirefoxResult)) {
                isFirefoxResult = false;

                var fields = /Firefox\/([\.0-9]+)/.exec(theNavigator.userAgent);
                if (fields !== null) {
                    isFirefoxResult = true;
                    firefoxVersionResult = extractVersion(fields[1]);
                }
            }
            return isFirefoxResult;
        }

        var isWindowsResult;
        function isWindows() {
            if (!defaultValue.defined(isWindowsResult)) {
                isWindowsResult = /Windows/i.test(theNavigator.appVersion);
            }
            return isWindowsResult;
        }

        function firefoxVersion() {
            return isFirefox() && firefoxVersionResult;
        }

        var hasPointerEvents;
        function supportsPointerEvents() {
            if (!defaultValue.defined(hasPointerEvents)) {
                //While navigator.pointerEnabled is deprecated in the W3C specification
                //we still need to use it if it exists in order to support browsers
                //that rely on it, such as the Windows WebBrowser control which defines
                //PointerEvent but sets navigator.pointerEnabled to false.

                //Firefox disabled because of https://github.com/CesiumGS/cesium/issues/6372
                hasPointerEvents = !isFirefox() && typeof PointerEvent !== 'undefined' && (!defaultValue.defined(theNavigator.pointerEnabled) || theNavigator.pointerEnabled);
            }
            return hasPointerEvents;
        }

        var imageRenderingValueResult;
        var supportsImageRenderingPixelatedResult;
        function supportsImageRenderingPixelated() {
            if (!defaultValue.defined(supportsImageRenderingPixelatedResult)) {
                var canvas = document.createElement('canvas');
                canvas.setAttribute('style',
                                    'image-rendering: -moz-crisp-edges;' +
                                    'image-rendering: pixelated;');
                //canvas.style.imageRendering will be undefined, null or an empty string on unsupported browsers.
                var tmp = canvas.style.imageRendering;
                supportsImageRenderingPixelatedResult = defaultValue.defined(tmp) && tmp !== '';
                if (supportsImageRenderingPixelatedResult) {
                    imageRenderingValueResult = tmp;
                }
            }
            return supportsImageRenderingPixelatedResult;
        }

        function imageRenderingValue() {
            return supportsImageRenderingPixelated() ? imageRenderingValueResult : undefined;
        }

        function supportsWebP() {
            //>>includeStart('debug', pragmas.debug);
            if (!supportsWebP.initialized) {
                throw new Check.DeveloperError('You must call FeatureDetection.supportsWebP.initialize and wait for the promise to resolve before calling FeatureDetection.supportsWebP');
            }
            //>>includeEnd('debug');
            return supportsWebP._result;
        }
        supportsWebP._promise = undefined;
        supportsWebP._result = undefined;
        supportsWebP.initialize = function() {
            // From https://developers.google.com/speed/webp/faq#how_can_i_detect_browser_support_for_webp
            if (defaultValue.defined(supportsWebP._promise)) {
                return supportsWebP._promise;
            }

            var supportsWebPDeferred = when.when.defer();
            supportsWebP._promise = supportsWebPDeferred.promise;
            if (isEdge()) {
                // Edge's WebP support with WebGL is incomplete.
                // See bug report: https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/19221241/
                supportsWebP._result = false;
                supportsWebPDeferred.resolve(supportsWebP._result);
                return supportsWebPDeferred.promise;
            }

            var image = new Image();
            image.onload = function () {
                supportsWebP._result = (image.width > 0) && (image.height > 0);
                supportsWebPDeferred.resolve(supportsWebP._result);
            };

            image.onerror = function () {
                supportsWebP._result = false;
                supportsWebPDeferred.resolve(supportsWebP._result);
            };

            image.src = 'data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA';

            return supportsWebPDeferred.promise;
        };
        Object.defineProperties(supportsWebP, {
            initialized: {
                get: function() {
                    return defaultValue.defined(supportsWebP._result);
                }
            }
        });

        var typedArrayTypes = [];
        if (typeof ArrayBuffer !== 'undefined') {
            typedArrayTypes.push(Int8Array, Uint8Array, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array);

            if (typeof Uint8ClampedArray !== 'undefined') {
                typedArrayTypes.push(Uint8ClampedArray);
            }

            if (typeof CanvasPixelArray !== 'undefined') {
                typedArrayTypes.push(CanvasPixelArray);
            }
        }

        /**
         * A set of functions to detect whether the current browser supports
         * various features.
         *
         * @exports FeatureDetection
         */
        var FeatureDetection = {
            isChrome : isChrome,
            chromeVersion : chromeVersion,
            isSafari : isSafari,
            safariVersion : safariVersion,
            isWebkit : isWebkit,
            webkitVersion : webkitVersion,
            isInternetExplorer : isInternetExplorer,
            internetExplorerVersion : internetExplorerVersion,
            isEdge : isEdge,
            edgeVersion : edgeVersion,
            isFirefox : isFirefox,
            firefoxVersion : firefoxVersion,
            isWindows : isWindows,
            hardwareConcurrency : defaultValue.defaultValue(theNavigator.hardwareConcurrency, 3),
            supportsPointerEvents : supportsPointerEvents,
            supportsImageRenderingPixelated: supportsImageRenderingPixelated,
            supportsWebP: supportsWebP,
            imageRenderingValue: imageRenderingValue,
            typedArrayTypes: typedArrayTypes
        };

        /**
         * Detects whether the current browser supports the full screen standard.
         *
         * @returns {Boolean} true if the browser supports the full screen standard, false if not.
         *
         * @see Fullscreen
         * @see {@link http://dvcs.w3.org/hg/fullscreen/raw-file/tip/Overview.html|W3C Fullscreen Living Specification}
         */
        FeatureDetection.supportsFullscreen = function() {
            return Fullscreen.supportsFullscreen();
        };

        /**
         * Detects whether the current browser supports typed arrays.
         *
         * @returns {Boolean} true if the browser supports typed arrays, false if not.
         *
         * @see {@link http://www.khronos.org/registry/typedarray/specs/latest/|Typed Array Specification}
         */
        FeatureDetection.supportsTypedArrays = function() {
            return typeof ArrayBuffer !== 'undefined';
        };

        /**
         * Detects whether the current browser supports Web Workers.
         *
         * @returns {Boolean} true if the browsers supports Web Workers, false if not.
         *
         * @see {@link http://www.w3.org/TR/workers/}
         */
        FeatureDetection.supportsWebWorkers = function() {
            return typeof Worker !== 'undefined';
        };

        /**
         * Detects whether the current browser supports Web Assembly.
         *
         * @returns {Boolean} true if the browsers supports Web Assembly, false if not.
         *
         * @see {@link https://developer.mozilla.org/en-US/docs/WebAssembly}
         */
        FeatureDetection.supportsWebAssembly = function() {
            return typeof WebAssembly !== 'undefined' && !FeatureDetection.isEdge();
        };

    /**
         * A set of 4-dimensional coordinates used to represent rotation in 3-dimensional space.
         * @alias Quaternion
         * @constructor
         *
         * @param {Number} [x=0.0] The X component.
         * @param {Number} [y=0.0] The Y component.
         * @param {Number} [z=0.0] The Z component.
         * @param {Number} [w=0.0] The W component.
         *
         * @see PackableForInterpolation
         */
        function Quaternion(x, y, z, w) {
            /**
             * The X component.
             * @type {Number}
             * @default 0.0
             */
            this.x = defaultValue.defaultValue(x, 0.0);

            /**
             * The Y component.
             * @type {Number}
             * @default 0.0
             */
            this.y = defaultValue.defaultValue(y, 0.0);

            /**
             * The Z component.
             * @type {Number}
             * @default 0.0
             */
            this.z = defaultValue.defaultValue(z, 0.0);

            /**
             * The W component.
             * @type {Number}
             * @default 0.0
             */
            this.w = defaultValue.defaultValue(w, 0.0);
        }

        var fromAxisAngleScratch = new Cartesian2.Cartesian3();

        /**
         * Computes a quaternion representing a rotation around an axis.
         *
         * @param {Cartesian3} axis The axis of rotation.
         * @param {Number} angle The angle in radians to rotate around the axis.
         * @param {Quaternion} [result] The object onto which to store the result.
         * @returns {Quaternion} The modified result parameter or a new Quaternion instance if one was not provided.
         */
        Quaternion.fromAxisAngle = function(axis, angle, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('axis', axis);
            Check.Check.typeOf.number('angle', angle);
            //>>includeEnd('debug');

            var halfAngle = angle / 2.0;
            var s = Math.sin(halfAngle);
            fromAxisAngleScratch = Cartesian2.Cartesian3.normalize(axis, fromAxisAngleScratch);

            var x = fromAxisAngleScratch.x * s;
            var y = fromAxisAngleScratch.y * s;
            var z = fromAxisAngleScratch.z * s;
            var w = Math.cos(halfAngle);
            if (!defaultValue.defined(result)) {
                return new Quaternion(x, y, z, w);
            }
            result.x = x;
            result.y = y;
            result.z = z;
            result.w = w;
            return result;
        };

        var fromRotationMatrixNext = [1, 2, 0];
        var fromRotationMatrixQuat = new Array(3);
        /**
         * Computes a Quaternion from the provided Matrix3 instance.
         *
         * @param {Matrix3} matrix The rotation matrix.
         * @param {Quaternion} [result] The object onto which to store the result.
         * @returns {Quaternion} The modified result parameter or a new Quaternion instance if one was not provided.
         *
         * @see Matrix3.fromQuaternion
         */
        Quaternion.fromRotationMatrix = function(matrix, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('matrix', matrix);
            //>>includeEnd('debug');

            var root;
            var x;
            var y;
            var z;
            var w;

            var m00 = matrix[Matrix3.COLUMN0ROW0];
            var m11 = matrix[Matrix3.COLUMN1ROW1];
            var m22 = matrix[Matrix3.COLUMN2ROW2];
            var trace = m00 + m11 + m22;

            if (trace > 0.0) {
                // |w| > 1/2, may as well choose w > 1/2
                root = Math.sqrt(trace + 1.0); // 2w
                w = 0.5 * root;
                root = 0.5 / root; // 1/(4w)

                x = (matrix[Matrix3.COLUMN1ROW2] - matrix[Matrix3.COLUMN2ROW1]) * root;
                y = (matrix[Matrix3.COLUMN2ROW0] - matrix[Matrix3.COLUMN0ROW2]) * root;
                z = (matrix[Matrix3.COLUMN0ROW1] - matrix[Matrix3.COLUMN1ROW0]) * root;
            } else {
                // |w| <= 1/2
                var next = fromRotationMatrixNext;

                var i = 0;
                if (m11 > m00) {
                    i = 1;
                }
                if (m22 > m00 && m22 > m11) {
                    i = 2;
                }
                var j = next[i];
                var k = next[j];

                root = Math.sqrt(matrix[Matrix3.getElementIndex(i, i)] - matrix[Matrix3.getElementIndex(j, j)] - matrix[Matrix3.getElementIndex(k, k)] + 1.0);

                var quat = fromRotationMatrixQuat;
                quat[i] = 0.5 * root;
                root = 0.5 / root;
                w = (matrix[Matrix3.getElementIndex(k, j)] - matrix[Matrix3.getElementIndex(j, k)]) * root;
                quat[j] = (matrix[Matrix3.getElementIndex(j, i)] + matrix[Matrix3.getElementIndex(i, j)]) * root;
                quat[k] = (matrix[Matrix3.getElementIndex(k, i)] + matrix[Matrix3.getElementIndex(i, k)]) * root;

                x = -quat[0];
                y = -quat[1];
                z = -quat[2];
            }

            if (!defaultValue.defined(result)) {
                return new Quaternion(x, y, z, w);
            }
            result.x = x;
            result.y = y;
            result.z = z;
            result.w = w;
            return result;
        };

        var scratchHPRQuaternion$1 = new Quaternion();
        var scratchHeadingQuaternion = new Quaternion();
        var scratchPitchQuaternion = new Quaternion();
        var scratchRollQuaternion = new Quaternion();

        /**
         * Computes a rotation from the given heading, pitch and roll angles. Heading is the rotation about the
         * negative z axis. Pitch is the rotation about the negative y axis. Roll is the rotation about
         * the positive x axis.
         *
         * @param {HeadingPitchRoll} headingPitchRoll The rotation expressed as a heading, pitch and roll.
         * @param {Quaternion} [result] The object onto which to store the result.
         * @returns {Quaternion} The modified result parameter or a new Quaternion instance if none was provided.
         */
        Quaternion.fromHeadingPitchRoll = function(headingPitchRoll, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('headingPitchRoll', headingPitchRoll);
            //>>includeEnd('debug');

            scratchRollQuaternion = Quaternion.fromAxisAngle(Cartesian2.Cartesian3.UNIT_X, headingPitchRoll.roll, scratchHPRQuaternion$1);
            scratchPitchQuaternion = Quaternion.fromAxisAngle(Cartesian2.Cartesian3.UNIT_Y, -headingPitchRoll.pitch, result);
            result = Quaternion.multiply(scratchPitchQuaternion, scratchRollQuaternion, scratchPitchQuaternion);
            scratchHeadingQuaternion = Quaternion.fromAxisAngle(Cartesian2.Cartesian3.UNIT_Z, -headingPitchRoll.heading, scratchHPRQuaternion$1);
            return Quaternion.multiply(scratchHeadingQuaternion, result, result);
        };

        var sampledQuaternionAxis = new Cartesian2.Cartesian3();
        var sampledQuaternionRotation = new Cartesian2.Cartesian3();
        var sampledQuaternionTempQuaternion = new Quaternion();
        var sampledQuaternionQuaternion0 = new Quaternion();
        var sampledQuaternionQuaternion0Conjugate = new Quaternion();

        /**
         * The number of elements used to pack the object into an array.
         * @type {Number}
         */
        Quaternion.packedLength = 4;

        /**
         * Stores the provided instance into the provided array.
         *
         * @param {Quaternion} value The value to pack.
         * @param {Number[]} array The array to pack into.
         * @param {Number} [startingIndex=0] The index into the array at which to start packing the elements.
         *
         * @returns {Number[]} The array that was packed into
         */
        Quaternion.pack = function(value, array, startingIndex) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('value', value);
            Check.Check.defined('array', array);
            //>>includeEnd('debug');

            startingIndex = defaultValue.defaultValue(startingIndex, 0);

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
         * @param {Quaternion} [result] The object into which to store the result.
         * @returns {Quaternion} The modified result parameter or a new Quaternion instance if one was not provided.
         */
        Quaternion.unpack = function(array, startingIndex, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.defined('array', array);
            //>>includeEnd('debug');

            startingIndex = defaultValue.defaultValue(startingIndex, 0);

            if (!defaultValue.defined(result)) {
                result = new Quaternion();
            }
            result.x = array[startingIndex];
            result.y = array[startingIndex + 1];
            result.z = array[startingIndex + 2];
            result.w = array[startingIndex + 3];
            return result;
        };

        /**
         * The number of elements used to store the object into an array in its interpolatable form.
         * @type {Number}
         */
        Quaternion.packedInterpolationLength = 3;

        /**
         * Converts a packed array into a form suitable for interpolation.
         *
         * @param {Number[]} packedArray The packed array.
         * @param {Number} [startingIndex=0] The index of the first element to be converted.
         * @param {Number} [lastIndex=packedArray.length] The index of the last element to be converted.
         * @param {Number[]} result The object into which to store the result.
         */
        Quaternion.convertPackedArrayForInterpolation = function(packedArray, startingIndex, lastIndex, result) {
            Quaternion.unpack(packedArray, lastIndex * 4, sampledQuaternionQuaternion0Conjugate);
            Quaternion.conjugate(sampledQuaternionQuaternion0Conjugate, sampledQuaternionQuaternion0Conjugate);

            for (var i = 0, len = lastIndex - startingIndex + 1; i < len; i++) {
                var offset = i * 3;
                Quaternion.unpack(packedArray, (startingIndex + i) * 4, sampledQuaternionTempQuaternion);

                Quaternion.multiply(sampledQuaternionTempQuaternion, sampledQuaternionQuaternion0Conjugate, sampledQuaternionTempQuaternion);

                if (sampledQuaternionTempQuaternion.w < 0) {
                    Quaternion.negate(sampledQuaternionTempQuaternion, sampledQuaternionTempQuaternion);
                }

                Quaternion.computeAxis(sampledQuaternionTempQuaternion, sampledQuaternionAxis);
                var angle = Quaternion.computeAngle(sampledQuaternionTempQuaternion);
                result[offset] = sampledQuaternionAxis.x * angle;
                result[offset + 1] = sampledQuaternionAxis.y * angle;
                result[offset + 2] = sampledQuaternionAxis.z * angle;
            }
        };

        /**
         * Retrieves an instance from a packed array converted with {@link convertPackedArrayForInterpolation}.
         *
         * @param {Number[]} array The array previously packed for interpolation.
         * @param {Number[]} sourceArray The original packed array.
         * @param {Number} [firstIndex=0] The firstIndex used to convert the array.
         * @param {Number} [lastIndex=packedArray.length] The lastIndex used to convert the array.
         * @param {Quaternion} [result] The object into which to store the result.
         * @returns {Quaternion} The modified result parameter or a new Quaternion instance if one was not provided.
         */
        Quaternion.unpackInterpolationResult = function(array, sourceArray, firstIndex, lastIndex, result) {
            if (!defaultValue.defined(result)) {
                result = new Quaternion();
            }
            Cartesian2.Cartesian3.fromArray(array, 0, sampledQuaternionRotation);
            var magnitude = Cartesian2.Cartesian3.magnitude(sampledQuaternionRotation);

            Quaternion.unpack(sourceArray, lastIndex * 4, sampledQuaternionQuaternion0);

            if (magnitude === 0) {
                Quaternion.clone(Quaternion.IDENTITY, sampledQuaternionTempQuaternion);
            } else {
                Quaternion.fromAxisAngle(sampledQuaternionRotation, magnitude, sampledQuaternionTempQuaternion);
            }

            return Quaternion.multiply(sampledQuaternionTempQuaternion, sampledQuaternionQuaternion0, result);
        };

        /**
         * Duplicates a Quaternion instance.
         *
         * @param {Quaternion} quaternion The quaternion to duplicate.
         * @param {Quaternion} [result] The object onto which to store the result.
         * @returns {Quaternion} The modified result parameter or a new Quaternion instance if one was not provided. (Returns undefined if quaternion is undefined)
         */
        Quaternion.clone = function(quaternion, result) {
            if (!defaultValue.defined(quaternion)) {
                return undefined;
            }

            if (!defaultValue.defined(result)) {
                return new Quaternion(quaternion.x, quaternion.y, quaternion.z, quaternion.w);
            }

            result.x = quaternion.x;
            result.y = quaternion.y;
            result.z = quaternion.z;
            result.w = quaternion.w;
            return result;
        };

        /**
         * Computes the conjugate of the provided quaternion.
         *
         * @param {Quaternion} quaternion The quaternion to conjugate.
         * @param {Quaternion} result The object onto which to store the result.
         * @returns {Quaternion} The modified result parameter.
         */
        Quaternion.conjugate = function(quaternion, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('quaternion', quaternion);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            result.x = -quaternion.x;
            result.y = -quaternion.y;
            result.z = -quaternion.z;
            result.w = quaternion.w;
            return result;
        };

        /**
         * Computes magnitude squared for the provided quaternion.
         *
         * @param {Quaternion} quaternion The quaternion to conjugate.
         * @returns {Number} The magnitude squared.
         */
        Quaternion.magnitudeSquared = function(quaternion) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('quaternion', quaternion);
            //>>includeEnd('debug');

            return quaternion.x * quaternion.x + quaternion.y * quaternion.y + quaternion.z * quaternion.z + quaternion.w * quaternion.w;
        };

        /**
         * Computes magnitude for the provided quaternion.
         *
         * @param {Quaternion} quaternion The quaternion to conjugate.
         * @returns {Number} The magnitude.
         */
        Quaternion.magnitude = function(quaternion) {
            return Math.sqrt(Quaternion.magnitudeSquared(quaternion));
        };

        /**
         * Computes the normalized form of the provided quaternion.
         *
         * @param {Quaternion} quaternion The quaternion to normalize.
         * @param {Quaternion} result The object onto which to store the result.
         * @returns {Quaternion} The modified result parameter.
         */
        Quaternion.normalize = function(quaternion, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            var inverseMagnitude = 1.0 / Quaternion.magnitude(quaternion);
            var x = quaternion.x * inverseMagnitude;
            var y = quaternion.y * inverseMagnitude;
            var z = quaternion.z * inverseMagnitude;
            var w = quaternion.w * inverseMagnitude;

            result.x = x;
            result.y = y;
            result.z = z;
            result.w = w;
            return result;
        };

        /**
         * Computes the inverse of the provided quaternion.
         *
         * @param {Quaternion} quaternion The quaternion to normalize.
         * @param {Quaternion} result The object onto which to store the result.
         * @returns {Quaternion} The modified result parameter.
         */
        Quaternion.inverse = function(quaternion, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            var magnitudeSquared = Quaternion.magnitudeSquared(quaternion);
            result = Quaternion.conjugate(quaternion, result);
            return Quaternion.multiplyByScalar(result, 1.0 / magnitudeSquared, result);
        };

        /**
         * Computes the componentwise sum of two quaternions.
         *
         * @param {Quaternion} left The first quaternion.
         * @param {Quaternion} right The second quaternion.
         * @param {Quaternion} result The object onto which to store the result.
         * @returns {Quaternion} The modified result parameter.
         */
        Quaternion.add = function(left, right, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('left', left);
            Check.Check.typeOf.object('right', right);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            result.x = left.x + right.x;
            result.y = left.y + right.y;
            result.z = left.z + right.z;
            result.w = left.w + right.w;
            return result;
        };

        /**
         * Computes the componentwise difference of two quaternions.
         *
         * @param {Quaternion} left The first quaternion.
         * @param {Quaternion} right The second quaternion.
         * @param {Quaternion} result The object onto which to store the result.
         * @returns {Quaternion} The modified result parameter.
         */
        Quaternion.subtract = function(left, right, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('left', left);
            Check.Check.typeOf.object('right', right);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            result.x = left.x - right.x;
            result.y = left.y - right.y;
            result.z = left.z - right.z;
            result.w = left.w - right.w;
            return result;
        };

        /**
         * Negates the provided quaternion.
         *
         * @param {Quaternion} quaternion The quaternion to be negated.
         * @param {Quaternion} result The object onto which to store the result.
         * @returns {Quaternion} The modified result parameter.
         */
        Quaternion.negate = function(quaternion, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('quaternion', quaternion);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            result.x = -quaternion.x;
            result.y = -quaternion.y;
            result.z = -quaternion.z;
            result.w = -quaternion.w;
            return result;
        };

        /**
         * Computes the dot (scalar) product of two quaternions.
         *
         * @param {Quaternion} left The first quaternion.
         * @param {Quaternion} right The second quaternion.
         * @returns {Number} The dot product.
         */
        Quaternion.dot = function(left, right) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('left', left);
            Check.Check.typeOf.object('right', right);
            //>>includeEnd('debug');

            return left.x * right.x + left.y * right.y + left.z * right.z + left.w * right.w;
        };

        /**
         * Computes the product of two quaternions.
         *
         * @param {Quaternion} left The first quaternion.
         * @param {Quaternion} right The second quaternion.
         * @param {Quaternion} result The object onto which to store the result.
         * @returns {Quaternion} The modified result parameter.
         */
        Quaternion.multiply = function(left, right, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('left', left);
            Check.Check.typeOf.object('right', right);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            var leftX = left.x;
            var leftY = left.y;
            var leftZ = left.z;
            var leftW = left.w;

            var rightX = right.x;
            var rightY = right.y;
            var rightZ = right.z;
            var rightW = right.w;

            var x = leftW * rightX + leftX * rightW + leftY * rightZ - leftZ * rightY;
            var y = leftW * rightY - leftX * rightZ + leftY * rightW + leftZ * rightX;
            var z = leftW * rightZ + leftX * rightY - leftY * rightX + leftZ * rightW;
            var w = leftW * rightW - leftX * rightX - leftY * rightY - leftZ * rightZ;

            result.x = x;
            result.y = y;
            result.z = z;
            result.w = w;
            return result;
        };

        /**
         * Multiplies the provided quaternion componentwise by the provided scalar.
         *
         * @param {Quaternion} quaternion The quaternion to be scaled.
         * @param {Number} scalar The scalar to multiply with.
         * @param {Quaternion} result The object onto which to store the result.
         * @returns {Quaternion} The modified result parameter.
         */
        Quaternion.multiplyByScalar = function(quaternion, scalar, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('quaternion', quaternion);
            Check.Check.typeOf.number('scalar', scalar);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            result.x = quaternion.x * scalar;
            result.y = quaternion.y * scalar;
            result.z = quaternion.z * scalar;
            result.w = quaternion.w * scalar;
            return result;
        };

        /**
         * Divides the provided quaternion componentwise by the provided scalar.
         *
         * @param {Quaternion} quaternion The quaternion to be divided.
         * @param {Number} scalar The scalar to divide by.
         * @param {Quaternion} result The object onto which to store the result.
         * @returns {Quaternion} The modified result parameter.
         */
        Quaternion.divideByScalar = function(quaternion, scalar, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('quaternion', quaternion);
            Check.Check.typeOf.number('scalar', scalar);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            result.x = quaternion.x / scalar;
            result.y = quaternion.y / scalar;
            result.z = quaternion.z / scalar;
            result.w = quaternion.w / scalar;
            return result;
        };

        /**
         * Computes the axis of rotation of the provided quaternion.
         *
         * @param {Quaternion} quaternion The quaternion to use.
         * @param {Cartesian3} result The object onto which to store the result.
         * @returns {Cartesian3} The modified result parameter.
         */
        Quaternion.computeAxis = function(quaternion, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('quaternion', quaternion);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            var w = quaternion.w;
            if (Math.abs(w - 1.0) < _Math.CesiumMath.EPSILON6) {
                result.x = result.y = result.z = 0;
                return result;
            }

            var scalar = 1.0 / Math.sqrt(1.0 - (w * w));

            result.x = quaternion.x * scalar;
            result.y = quaternion.y * scalar;
            result.z = quaternion.z * scalar;
            return result;
        };

        /**
         * Computes the angle of rotation of the provided quaternion.
         *
         * @param {Quaternion} quaternion The quaternion to use.
         * @returns {Number} The angle of rotation.
         */
        Quaternion.computeAngle = function(quaternion) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('quaternion', quaternion);
            //>>includeEnd('debug');

            if (Math.abs(quaternion.w - 1.0) < _Math.CesiumMath.EPSILON6) {
                return 0.0;
            }
            return 2.0 * Math.acos(quaternion.w);
        };

        var lerpScratch = new Quaternion();
        /**
         * Computes the linear interpolation or extrapolation at t using the provided quaternions.
         *
         * @param {Quaternion} start The value corresponding to t at 0.0.
         * @param {Quaternion} end The value corresponding to t at 1.0.
         * @param {Number} t The point along t at which to interpolate.
         * @param {Quaternion} result The object onto which to store the result.
         * @returns {Quaternion} The modified result parameter.
         */
        Quaternion.lerp = function(start, end, t, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('start', start);
            Check.Check.typeOf.object('end', end);
            Check.Check.typeOf.number('t', t);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            lerpScratch = Quaternion.multiplyByScalar(end, t, lerpScratch);
            result = Quaternion.multiplyByScalar(start, 1.0 - t, result);
            return Quaternion.add(lerpScratch, result, result);
        };

        var slerpEndNegated = new Quaternion();
        var slerpScaledP = new Quaternion();
        var slerpScaledR = new Quaternion();
        /**
         * Computes the spherical linear interpolation or extrapolation at t using the provided quaternions.
         *
         * @param {Quaternion} start The value corresponding to t at 0.0.
         * @param {Quaternion} end The value corresponding to t at 1.0.
         * @param {Number} t The point along t at which to interpolate.
         * @param {Quaternion} result The object onto which to store the result.
         * @returns {Quaternion} The modified result parameter.
         *
         * @see Quaternion#fastSlerp
         */
        Quaternion.slerp = function(start, end, t, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('start', start);
            Check.Check.typeOf.object('end', end);
            Check.Check.typeOf.number('t', t);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            var dot = Quaternion.dot(start, end);

            // The angle between start must be acute. Since q and -q represent
            // the same rotation, negate q to get the acute angle.
            var r = end;
            if (dot < 0.0) {
                dot = -dot;
                r = slerpEndNegated = Quaternion.negate(end, slerpEndNegated);
            }

            // dot > 0, as the dot product approaches 1, the angle between the
            // quaternions vanishes. use linear interpolation.
            if (1.0 - dot < _Math.CesiumMath.EPSILON6) {
                return Quaternion.lerp(start, r, t, result);
            }

            var theta = Math.acos(dot);
            slerpScaledP = Quaternion.multiplyByScalar(start, Math.sin((1 - t) * theta), slerpScaledP);
            slerpScaledR = Quaternion.multiplyByScalar(r, Math.sin(t * theta), slerpScaledR);
            result = Quaternion.add(slerpScaledP, slerpScaledR, result);
            return Quaternion.multiplyByScalar(result, 1.0 / Math.sin(theta), result);
        };

        /**
         * The logarithmic quaternion function.
         *
         * @param {Quaternion} quaternion The unit quaternion.
         * @param {Cartesian3} result The object onto which to store the result.
         * @returns {Cartesian3} The modified result parameter.
         */
        Quaternion.log = function(quaternion, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('quaternion', quaternion);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            var theta = _Math.CesiumMath.acosClamped(quaternion.w);
            var thetaOverSinTheta = 0.0;

            if (theta !== 0.0) {
                thetaOverSinTheta = theta / Math.sin(theta);
            }

            return Cartesian2.Cartesian3.multiplyByScalar(quaternion, thetaOverSinTheta, result);
        };

        /**
         * The exponential quaternion function.
         *
         * @param {Cartesian3} cartesian The cartesian.
         * @param {Quaternion} result The object onto which to store the result.
         * @returns {Quaternion} The modified result parameter.
         */
        Quaternion.exp = function(cartesian, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('cartesian', cartesian);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            var theta = Cartesian2.Cartesian3.magnitude(cartesian);
            var sinThetaOverTheta = 0.0;

            if (theta !== 0.0) {
                sinThetaOverTheta = Math.sin(theta) / theta;
            }

            result.x = cartesian.x * sinThetaOverTheta;
            result.y = cartesian.y * sinThetaOverTheta;
            result.z = cartesian.z * sinThetaOverTheta;
            result.w = Math.cos(theta);

            return result;
        };

        var squadScratchCartesian0 = new Cartesian2.Cartesian3();
        var squadScratchCartesian1 = new Cartesian2.Cartesian3();
        var squadScratchQuaternion0 = new Quaternion();
        var squadScratchQuaternion1 = new Quaternion();

        /**
         * Computes an inner quadrangle point.
         * <p>This will compute quaternions that ensure a squad curve is C<sup>1</sup>.</p>
         *
         * @param {Quaternion} q0 The first quaternion.
         * @param {Quaternion} q1 The second quaternion.
         * @param {Quaternion} q2 The third quaternion.
         * @param {Quaternion} result The object onto which to store the result.
         * @returns {Quaternion} The modified result parameter.
         *
         * @see Quaternion#squad
         */
        Quaternion.computeInnerQuadrangle = function(q0, q1, q2, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('q0', q0);
            Check.Check.typeOf.object('q1', q1);
            Check.Check.typeOf.object('q2', q2);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            var qInv = Quaternion.conjugate(q1, squadScratchQuaternion0);
            Quaternion.multiply(qInv, q2, squadScratchQuaternion1);
            var cart0 = Quaternion.log(squadScratchQuaternion1, squadScratchCartesian0);

            Quaternion.multiply(qInv, q0, squadScratchQuaternion1);
            var cart1 = Quaternion.log(squadScratchQuaternion1, squadScratchCartesian1);

            Cartesian2.Cartesian3.add(cart0, cart1, cart0);
            Cartesian2.Cartesian3.multiplyByScalar(cart0, 0.25, cart0);
            Cartesian2.Cartesian3.negate(cart0, cart0);
            Quaternion.exp(cart0, squadScratchQuaternion0);

            return Quaternion.multiply(q1, squadScratchQuaternion0, result);
        };

        /**
         * Computes the spherical quadrangle interpolation between quaternions.
         *
         * @param {Quaternion} q0 The first quaternion.
         * @param {Quaternion} q1 The second quaternion.
         * @param {Quaternion} s0 The first inner quadrangle.
         * @param {Quaternion} s1 The second inner quadrangle.
         * @param {Number} t The time in [0,1] used to interpolate.
         * @param {Quaternion} result The object onto which to store the result.
         * @returns {Quaternion} The modified result parameter.
         *
         *
         * @example
         * // 1. compute the squad interpolation between two quaternions on a curve
         * var s0 = Cesium.Quaternion.computeInnerQuadrangle(quaternions[i - 1], quaternions[i], quaternions[i + 1], new Cesium.Quaternion());
         * var s1 = Cesium.Quaternion.computeInnerQuadrangle(quaternions[i], quaternions[i + 1], quaternions[i + 2], new Cesium.Quaternion());
         * var q = Cesium.Quaternion.squad(quaternions[i], quaternions[i + 1], s0, s1, t, new Cesium.Quaternion());
         *
         * // 2. compute the squad interpolation as above but where the first quaternion is a end point.
         * var s1 = Cesium.Quaternion.computeInnerQuadrangle(quaternions[0], quaternions[1], quaternions[2], new Cesium.Quaternion());
         * var q = Cesium.Quaternion.squad(quaternions[0], quaternions[1], quaternions[0], s1, t, new Cesium.Quaternion());
         *
         * @see Quaternion#computeInnerQuadrangle
         */
        Quaternion.squad = function(q0, q1, s0, s1, t, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('q0', q0);
            Check.Check.typeOf.object('q1', q1);
            Check.Check.typeOf.object('s0', s0);
            Check.Check.typeOf.object('s1', s1);
            Check.Check.typeOf.number('t', t);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            var slerp0 = Quaternion.slerp(q0, q1, t, squadScratchQuaternion0);
            var slerp1 = Quaternion.slerp(s0, s1, t, squadScratchQuaternion1);
            return Quaternion.slerp(slerp0, slerp1, 2.0 * t * (1.0 - t), result);
        };

        var fastSlerpScratchQuaternion = new Quaternion();
        var opmu = 1.90110745351730037;
        var u = FeatureDetection.supportsTypedArrays() ? new Float32Array(8) : [];
        var v = FeatureDetection.supportsTypedArrays() ? new Float32Array(8) : [];
        var bT = FeatureDetection.supportsTypedArrays() ? new Float32Array(8) : [];
        var bD = FeatureDetection.supportsTypedArrays() ? new Float32Array(8) : [];

        for (var i = 0; i < 7; ++i) {
            var s = i + 1.0;
            var t = 2.0 * s + 1.0;
            u[i] = 1.0 / (s * t);
            v[i] = s / t;
        }

        u[7] = opmu / (8.0 * 17.0);
        v[7] = opmu * 8.0 / 17.0;

        /**
         * Computes the spherical linear interpolation or extrapolation at t using the provided quaternions.
         * This implementation is faster than {@link Quaternion#slerp}, but is only accurate up to 10<sup>-6</sup>.
         *
         * @param {Quaternion} start The value corresponding to t at 0.0.
         * @param {Quaternion} end The value corresponding to t at 1.0.
         * @param {Number} t The point along t at which to interpolate.
         * @param {Quaternion} result The object onto which to store the result.
         * @returns {Quaternion} The modified result parameter.
         *
         * @see Quaternion#slerp
         */
        Quaternion.fastSlerp = function(start, end, t, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('start', start);
            Check.Check.typeOf.object('end', end);
            Check.Check.typeOf.number('t', t);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            var x = Quaternion.dot(start, end);

            var sign;
            if (x >= 0) {
                sign = 1.0;
            } else {
                sign = -1.0;
                x = -x;
            }

            var xm1 = x - 1.0;
            var d = 1.0 - t;
            var sqrT = t * t;
            var sqrD = d * d;

            for (var i = 7; i >= 0; --i) {
                bT[i] = (u[i] * sqrT - v[i]) * xm1;
                bD[i] = (u[i] * sqrD - v[i]) * xm1;
            }

            var cT = sign * t * (
                1.0 + bT[0] * (1.0 + bT[1] * (1.0 + bT[2] * (1.0 + bT[3] * (
                1.0 + bT[4] * (1.0 + bT[5] * (1.0 + bT[6] * (1.0 + bT[7]))))))));
            var cD = d * (
                1.0 + bD[0] * (1.0 + bD[1] * (1.0 + bD[2] * (1.0 + bD[3] * (
                1.0 + bD[4] * (1.0 + bD[5] * (1.0 + bD[6] * (1.0 + bD[7]))))))));

            var temp = Quaternion.multiplyByScalar(start, cD, fastSlerpScratchQuaternion);
            Quaternion.multiplyByScalar(end, cT, result);
            return Quaternion.add(temp, result, result);
        };

        /**
         * Computes the spherical quadrangle interpolation between quaternions.
         * An implementation that is faster than {@link Quaternion#squad}, but less accurate.
         *
         * @param {Quaternion} q0 The first quaternion.
         * @param {Quaternion} q1 The second quaternion.
         * @param {Quaternion} s0 The first inner quadrangle.
         * @param {Quaternion} s1 The second inner quadrangle.
         * @param {Number} t The time in [0,1] used to interpolate.
         * @param {Quaternion} result The object onto which to store the result.
         * @returns {Quaternion} The modified result parameter or a new instance if none was provided.
         *
         * @see Quaternion#squad
         */
        Quaternion.fastSquad = function(q0, q1, s0, s1, t, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('q0', q0);
            Check.Check.typeOf.object('q1', q1);
            Check.Check.typeOf.object('s0', s0);
            Check.Check.typeOf.object('s1', s1);
            Check.Check.typeOf.number('t', t);
            Check.Check.typeOf.object('result', result);
            //>>includeEnd('debug');

            var slerp0 = Quaternion.fastSlerp(q0, q1, t, squadScratchQuaternion0);
            var slerp1 = Quaternion.fastSlerp(s0, s1, t, squadScratchQuaternion1);
            return Quaternion.fastSlerp(slerp0, slerp1, 2.0 * t * (1.0 - t), result);
        };

        /**
         * Compares the provided quaternions componentwise and returns
         * <code>true</code> if they are equal, <code>false</code> otherwise.
         *
         * @param {Quaternion} [left] The first quaternion.
         * @param {Quaternion} [right] The second quaternion.
         * @returns {Boolean} <code>true</code> if left and right are equal, <code>false</code> otherwise.
         */
        Quaternion.equals = function(left, right) {
            return (left === right) ||
                   ((defaultValue.defined(left)) &&
                    (defaultValue.defined(right)) &&
                    (left.x === right.x) &&
                    (left.y === right.y) &&
                    (left.z === right.z) &&
                    (left.w === right.w));
        };

        /**
         * Compares the provided quaternions componentwise and returns
         * <code>true</code> if they are within the provided epsilon,
         * <code>false</code> otherwise.
         *
         * @param {Quaternion} [left] The first quaternion.
         * @param {Quaternion} [right] The second quaternion.
         * @param {Number} epsilon The epsilon to use for equality testing.
         * @returns {Boolean} <code>true</code> if left and right are within the provided epsilon, <code>false</code> otherwise.
         */
        Quaternion.equalsEpsilon = function(left, right, epsilon) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.number('epsilon', epsilon);
            //>>includeEnd('debug');

            return (left === right) ||
                   ((defaultValue.defined(left)) &&
                    (defaultValue.defined(right)) &&
                    (Math.abs(left.x - right.x) <= epsilon) &&
                    (Math.abs(left.y - right.y) <= epsilon) &&
                    (Math.abs(left.z - right.z) <= epsilon) &&
                    (Math.abs(left.w - right.w) <= epsilon));
        };

        /**
         * An immutable Quaternion instance initialized to (0.0, 0.0, 0.0, 0.0).
         *
         * @type {Quaternion}
         * @constant
         */
        Quaternion.ZERO = Object.freeze(new Quaternion(0.0, 0.0, 0.0, 0.0));

        /**
         * An immutable Quaternion instance initialized to (0.0, 0.0, 0.0, 1.0).
         *
         * @type {Quaternion}
         * @constant
         */
        Quaternion.IDENTITY = Object.freeze(new Quaternion(0.0, 0.0, 0.0, 1.0));

        /**
         * Duplicates this Quaternion instance.
         *
         * @param {Quaternion} [result] The object onto which to store the result.
         * @returns {Quaternion} The modified result parameter or a new Quaternion instance if one was not provided.
         */
        Quaternion.prototype.clone = function(result) {
            return Quaternion.clone(this, result);
        };

        /**
         * Compares this and the provided quaternion componentwise and returns
         * <code>true</code> if they are equal, <code>false</code> otherwise.
         *
         * @param {Quaternion} [right] The right hand side quaternion.
         * @returns {Boolean} <code>true</code> if left and right are equal, <code>false</code> otherwise.
         */
        Quaternion.prototype.equals = function(right) {
            return Quaternion.equals(this, right);
        };

        /**
         * Compares this and the provided quaternion componentwise and returns
         * <code>true</code> if they are within the provided epsilon,
         * <code>false</code> otherwise.
         *
         * @param {Quaternion} [right] The right hand side quaternion.
         * @param {Number} epsilon The epsilon to use for equality testing.
         * @returns {Boolean} <code>true</code> if left and right are within the provided epsilon, <code>false</code> otherwise.
         */
        Quaternion.prototype.equalsEpsilon = function(right, epsilon) {
            return Quaternion.equalsEpsilon(this, right, epsilon);
        };

        /**
         * Returns a string representing this quaternion in the format (x, y, z, w).
         *
         * @returns {String} A string representing this Quaternion.
         */
        Quaternion.prototype.toString = function() {
            return '(' + this.x + ', ' + this.y + ', ' + this.z + ', ' + this.w + ')';
        };

    /**
         * Finds an item in a sorted array.
         *
         * @exports binarySearch
         * @param {Array} array The sorted array to search.
         * @param {*} itemToFind The item to find in the array.
         * @param {binarySearch~Comparator} comparator The function to use to compare the item to
         *        elements in the array.
         * @returns {Number} The index of <code>itemToFind</code> in the array, if it exists.  If <code>itemToFind</code>
         *        does not exist, the return value is a negative number which is the bitwise complement (~)
         *        of the index before which the itemToFind should be inserted in order to maintain the
         *        sorted order of the array.
         *
         * @example
         * // Create a comparator function to search through an array of numbers.
         * function comparator(a, b) {
         *     return a - b;
         * };
         * var numbers = [0, 2, 4, 6, 8];
         * var index = Cesium.binarySearch(numbers, 6, comparator); // 3
         */
        function binarySearch(array, itemToFind, comparator) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.defined('array', array);
            Check.Check.defined('itemToFind', itemToFind);
            Check.Check.defined('comparator', comparator);
            //>>includeEnd('debug');

            var low = 0;
            var high = array.length - 1;
            var i;
            var comparison;

            while (low <= high) {
                i = ~~((low + high) / 2);
                comparison = comparator(array[i], itemToFind);
                if (comparison < 0) {
                    low = i + 1;
                    continue;
                }
                if (comparison > 0) {
                    high = i - 1;
                    continue;
                }
                return i;
            }
            return ~(high + 1);
        }

    /**
         * A set of Earth Orientation Parameters (EOP) sampled at a time.
         *
         * @alias EarthOrientationParametersSample
         * @constructor
         *
         * @param {Number} xPoleWander The pole wander about the X axis, in radians.
         * @param {Number} yPoleWander The pole wander about the Y axis, in radians.
         * @param {Number} xPoleOffset The offset to the Celestial Intermediate Pole (CIP) about the X axis, in radians.
         * @param {Number} yPoleOffset The offset to the Celestial Intermediate Pole (CIP) about the Y axis, in radians.
         * @param {Number} ut1MinusUtc The difference in time standards, UT1 - UTC, in seconds.
         *
         * @private
         */
        function EarthOrientationParametersSample(xPoleWander, yPoleWander, xPoleOffset, yPoleOffset, ut1MinusUtc) {
            /**
             * The pole wander about the X axis, in radians.
             * @type {Number}
             */
            this.xPoleWander = xPoleWander;

            /**
             * The pole wander about the Y axis, in radians.
             * @type {Number}
             */
            this.yPoleWander = yPoleWander;

            /**
             * The offset to the Celestial Intermediate Pole (CIP) about the X axis, in radians.
             * @type {Number}
             */
            this.xPoleOffset = xPoleOffset;

            /**
             * The offset to the Celestial Intermediate Pole (CIP) about the Y axis, in radians.
             * @type {Number}
             */
            this.yPoleOffset = yPoleOffset;

            /**
             * The difference in time standards, UT1 - UTC, in seconds.
             * @type {Number}
             */
            this.ut1MinusUtc = ut1MinusUtc;
        }

    /**
    @license
    sprintf.js from the php.js project - https://github.com/kvz/phpjs
    Directly from https://github.com/kvz/phpjs/blob/master/functions/strings/sprintf.js

    php.js is copyright 2012 Kevin van Zonneveld.

    Portions copyright Brett Zamir (http://brett-zamir.me), Kevin van Zonneveld
    (http://kevin.vanzonneveld.net), Onno Marsman, Theriault, Michael White
    (http://getsprink.com), Waldo Malqui Silva, Paulo Freitas, Jack, Jonas
    Raoni Soares Silva (http://www.jsfromhell.com), Philip Peterson, Legaev
    Andrey, Ates Goral (http://magnetiq.com), Alex, Ratheous, Martijn Wieringa,
    Rafa? Kukawski (http://blog.kukawski.pl), lmeyrick
    (https://sourceforge.net/projects/bcmath-js/), Nate, Philippe Baumann,
    Enrique Gonzalez, Webtoolkit.info (http://www.webtoolkit.info/), Carlos R.
    L. Rodrigues (http://www.jsfromhell.com), Ash Searle
    (http://hexmen.com/blog/), Jani Hartikainen, travc, Ole Vrijenhoek,
    Erkekjetter, Michael Grier, Rafa? Kukawski (http://kukawski.pl), Johnny
    Mast (http://www.phpvrouwen.nl), T.Wild, d3x,
    http://stackoverflow.com/questions/57803/how-to-convert-decimal-to-hex-in-javascript,
    Rafa? Kukawski (http://blog.kukawski.pl/), stag019, pilus, WebDevHobo
    (http://webdevhobo.blogspot.com/), marrtins, GeekFG
    (http://geekfg.blogspot.com), Andrea Giammarchi
    (http://webreflection.blogspot.com), Arpad Ray (mailto:arpad@php.net),
    gorthaur, Paul Smith, Tim de Koning (http://www.kingsquare.nl), Joris, Oleg
    Eremeev, Steve Hilder, majak, gettimeofday, KELAN, Josh Fraser
    (http://onlineaspect.com/2007/06/08/auto-detect-a-time-zone-with-javascript/),
    Marc Palau, Martin
    (http://www.erlenwiese.de/), Breaking Par Consulting Inc
    (http://www.breakingpar.com/bkp/home.nsf/0/87256B280015193F87256CFB006C45F7),
    Chris, Mirek Slugen, saulius, Alfonso Jimenez
    (http://www.alfonsojimenez.com), Diplom@t (http://difane.com/), felix,
    Mailfaker (http://www.weedem.fr/), Tyler Akins (http://rumkin.com), Caio
    Ariede (http://caioariede.com), Robin, Kankrelune
    (http://www.webfaktory.info/), Karol Kowalski, Imgen Tata
    (http://www.myipdf.com/), mdsjack (http://www.mdsjack.bo.it), Dreamer,
    Felix Geisendoerfer (http://www.debuggable.com/felix), Lars Fischer, AJ,
    David, Aman Gupta, Michael White, Public Domain
    (http://www.json.org/json2.js), Steven Levithan
    (http://blog.stevenlevithan.com), Sakimori, Pellentesque Malesuada,
    Thunder.m, Dj (http://phpjs.org/functions/htmlentities:425#comment_134018),
    Steve Clay, David James, Francois, class_exists, nobbler, T. Wild, Itsacon
    (http://www.itsacon.net/), date, Ole Vrijenhoek (http://www.nervous.nl/),
    Fox, Raphael (Ao RUDLER), Marco, noname, Mateusz "loonquawl" Zalega, Frank
    Forte, Arno, ger, mktime, john (http://www.jd-tech.net), Nick Kolosov
    (http://sammy.ru), marc andreu, Scott Cariss, Douglas Crockford
    (http://javascript.crockford.com), madipta, Slawomir Kaniecki,
    ReverseSyntax, Nathan, Alex Wilson, kenneth, Bayron Guevara, Adam Wallner
    (http://web2.bitbaro.hu/), paulo kuong, jmweb, Lincoln Ramsay, djmix,
    Pyerre, Jon Hohle, Thiago Mata (http://thiagomata.blog.com), lmeyrick
    (https://sourceforge.net/projects/bcmath-js/this.), Linuxworld, duncan,
    Gilbert, Sanjoy Roy, Shingo, sankai, Oskar Larsson H?gfeldt
    (http://oskar-lh.name/), Denny Wardhana, 0m3r, Everlasto, Subhasis Deb,
    josh, jd, Pier Paolo Ramon (http://www.mastersoup.com/), P, merabi, Soren
    Hansen, Eugene Bulkin (http://doubleaw.com/), Der Simon
    (http://innerdom.sourceforge.net/), echo is bad, Ozh, XoraX
    (http://www.xorax.info), EdorFaus, JB, J A R, Marc Jansen, Francesco, LH,
    Stoyan Kyosev (http://www.svest.org/), nord_ua, omid
    (http://phpjs.org/functions/380:380#comment_137122), Brad Touesnard, MeEtc
    (http://yass.meetcweb.com), Peter-Paul Koch
    (http://www.quirksmode.org/js/beat.html), Olivier Louvignes
    (http://mg-crea.com/), T0bsn, Tim Wiel, Bryan Elliott, Jalal Berrami,
    Martin, JT, David Randall, Thomas Beaucourt (http://www.webapp.fr), taith,
    vlado houba, Pierre-Luc Paour, Kristof Coomans (SCK-CEN Belgian Nucleair
    Research Centre), Martin Pool, Kirk Strobeck, Rick Waldron, Brant Messenger
    (http://www.brantmessenger.com/), Devan Penner-Woelk, Saulo Vallory, Wagner
    B. Soares, Artur Tchernychev, Valentina De Rosa, Jason Wong
    (http://carrot.org/), Christoph, Daniel Esteban, strftime, Mick@el, rezna,
    Simon Willison (http://simonwillison.net), Anton Ongson, Gabriel Paderni,
    Marco van Oort, penutbutterjelly, Philipp Lenssen, Bjorn Roesbeke
    (http://www.bjornroesbeke.be/), Bug?, Eric Nagel, Tomasz Wesolowski,
    Evertjan Garretsen, Bobby Drake, Blues (http://tech.bluesmoon.info/), Luke
    Godfrey, Pul, uestla, Alan C, Ulrich, Rafal Kukawski, Yves Sucaet,
    sowberry, Norman "zEh" Fuchs, hitwork, Zahlii, johnrembo, Nick Callen,
    Steven Levithan (stevenlevithan.com), ejsanders, Scott Baker, Brian Tafoya
    (http://www.premasolutions.com/), Philippe Jausions
    (http://pear.php.net/user/jausions), Aidan Lister
    (http://aidanlister.com/), Rob, e-mike, HKM, ChaosNo1, metjay, strcasecmp,
    strcmp, Taras Bogach, jpfle, Alexander Ermolaev
    (http://snippets.dzone.com/user/AlexanderErmolaev), DxGx, kilops, Orlando,
    dptr1988, Le Torbi, James (http://www.james-bell.co.uk/), Pedro Tainha
    (http://www.pedrotainha.com), James, Arnout Kazemier
    (http://www.3rd-Eden.com), Chris McMacken, gabriel paderni, Yannoo,
    FGFEmperor, baris ozdil, Tod Gentille, Greg Frazier, jakes, 3D-GRAF, Allan
    Jensen (http://www.winternet.no), Howard Yeend, Benjamin Lupton, davook,
    daniel airton wermann (http://wermann.com.br), Atli T¨®r, Maximusya, Ryan
    W Tenney (http://ryan.10e.us), Alexander M Beedie, fearphage
    (http://http/my.opera.com/fearphage/), Nathan Sepulveda, Victor, Matteo,
    Billy, stensi, Cord, Manish, T.J. Leahy, Riddler
    (http://www.frontierwebdev.com/), Rafa? Kukawski, FremyCompany, Matt
    Bradley, Tim de Koning, Luis Salazar (http://www.freaky-media.com/), Diogo
    Resende, Rival, Andrej Pavlovic, Garagoth, Le Torbi
    (http://www.letorbi.de/), Dino, Josep Sanz (http://www.ws3.es/), rem,
    Russell Walker (http://www.nbill.co.uk/), Jamie Beck
    (http://www.terabit.ca/), setcookie, Michael, YUI Library:
    http://developer.yahoo.com/yui/docs/YAHOO.util.DateLocale.html, Blues at
    http://hacks.bluesmoon.info/strftime/strftime.js, Ben
    (http://benblume.co.uk/), DtTvB
    (http://dt.in.th/2008-09-16.string-length-in-bytes.html), Andreas, William,
    meo, incidence, Cagri Ekin, Amirouche, Amir Habibi
    (http://www.residence-mixte.com/), Luke Smith (http://lucassmith.name),
    Kheang Hok Chin (http://www.distantia.ca/), Jay Klehr, Lorenzo Pisani,
    Tony, Yen-Wei Liu, Greenseed, mk.keck, Leslie Hoare, dude, booeyOH, Ben
    Bryan

    Licensed under the MIT (MIT-LICENSE.txt) license.

    Permission is hereby granted, free of charge, to any person obtaining a
    copy of this software and associated documentation files (the
    "Software"), to deal in the Software without restriction, including
    without limitation the rights to use, copy, modify, merge, publish,
    distribute, sublicense, and/or sell copies of the Software, and to
    permit persons to whom the Software is furnished to do so, subject to
    the following conditions:

    The above copyright notice and this permission notice shall be included
    in all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
    OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
    MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
    IN NO EVENT SHALL KEVIN VAN ZONNEVELD BE LIABLE FOR ANY CLAIM, DAMAGES
    OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
    ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
    OTHER DEALINGS IN THE SOFTWARE.
    */

    function sprintf () {
      // http://kevin.vanzonneveld.net
      // +   original by: Ash Searle (http://hexmen.com/blog/)
      // + namespaced by: Michael White (http://getsprink.com)
      // +    tweaked by: Jack
      // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
      // +      input by: Paulo Freitas
      // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
      // +      input by: Brett Zamir (http://brett-zamir.me)
      // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
      // +   improved by: Dj
      // +   improved by: Allidylls
      // *     example 1: sprintf("%01.2f", 123.1);
      // *     returns 1: 123.10
      // *     example 2: sprintf("[%10s]", 'monkey');
      // *     returns 2: '[    monkey]'
      // *     example 3: sprintf("[%'#10s]", 'monkey');
      // *     returns 3: '[####monkey]'
      // *     example 4: sprintf("%d", 123456789012345);
      // *     returns 4: '123456789012345'
      var regex = /%%|%(\d+\$)?([-+\'#0 ]*)(\*\d+\$|\*|\d+)?(\.(\*\d+\$|\*|\d+))?([scboxXuideEfFgG])/g;
      var a = arguments,
        i = 0,
        format = a[i++];

      // pad()
      var pad = function (str, len, chr, leftJustify) {
        if (!chr) {
          chr = ' ';
        }

        var padding = (str.length >= len) ? '' : Array(1 + len - str.length >>> 0).join(chr);
        return leftJustify ? str + padding : padding + str;
      };

      // justify()
      var justify = function (value, prefix, leftJustify, minWidth, zeroPad, customPadChar) {
        var diff = minWidth - value.length;
        if (diff > 0) {
          if (leftJustify || !zeroPad) {
            value = pad(value, minWidth, customPadChar, leftJustify);
          } else {
            value = value.slice(0, prefix.length) + pad('', diff, '0', true) + value.slice(prefix.length);
          }
        }
        return value;
      };

      // formatBaseX()
      var formatBaseX = function (value, base, prefix, leftJustify, minWidth, precision, zeroPad) {
        // Note: casts negative numbers to positive ones
        var number = value >>> 0;
        prefix = prefix && number && {
          '2': '0b',
          '8': '0',
          '16': '0x'
        }[base] || '';
        value = prefix + pad(number.toString(base), precision || 0, '0', false);
        return justify(value, prefix, leftJustify, minWidth, zeroPad);
      };

      // formatString()
      var formatString = function (value, leftJustify, minWidth, precision, zeroPad, customPadChar) {
        if (precision != null) {
          value = value.slice(0, precision);
        }
        return justify(value, '', leftJustify, minWidth, zeroPad, customPadChar);
      };

      // doFormat()
      var doFormat = function (substring, valueIndex, flags, minWidth, _, precision, type) {
        var number;
        var prefix;
        var method;
        var textTransform;
        var value;

        if (substring == '%%') {
          return '%';
        }

        // parse flags
        var leftJustify = false,
          positivePrefix = '',
          zeroPad = false,
          prefixBaseX = false,
          customPadChar = ' ';
        var flagsl = flags.length;
        for (var j = 0; flags && j < flagsl; j++) {
          switch (flags.charAt(j)) {
          case ' ':
            positivePrefix = ' ';
            break;
          case '+':
            positivePrefix = '+';
            break;
          case '-':
            leftJustify = true;
            break;
          case "'":
            customPadChar = flags.charAt(j + 1);
            break;
          case '0':
            zeroPad = true;
            break;
          case '#':
            prefixBaseX = true;
            break;
          }
        }

        // parameters may be null, undefined, empty-string or real valued
        // we want to ignore null, undefined and empty-string values
        if (!minWidth) {
          minWidth = 0;
        } else if (minWidth == '*') {
          minWidth = +a[i++];
        } else if (minWidth.charAt(0) == '*') {
          minWidth = +a[minWidth.slice(1, -1)];
        } else {
          minWidth = +minWidth;
        }

        // Note: undocumented perl feature:
        if (minWidth < 0) {
          minWidth = -minWidth;
          leftJustify = true;
        }

        if (!isFinite(minWidth)) {
          throw new Error('sprintf: (minimum-)width must be finite');
        }

        if (!precision) {
          precision = 'fFeE'.indexOf(type) > -1 ? 6 : (type == 'd') ? 0 : undefined;
        } else if (precision == '*') {
          precision = +a[i++];
        } else if (precision.charAt(0) == '*') {
          precision = +a[precision.slice(1, -1)];
        } else {
          precision = +precision;
        }

        // grab value using valueIndex if required?
        value = valueIndex ? a[valueIndex.slice(0, -1)] : a[i++];

        switch (type) {
        case 's':
          return formatString(String(value), leftJustify, minWidth, precision, zeroPad, customPadChar);
        case 'c':
          return formatString(String.fromCharCode(+value), leftJustify, minWidth, precision, zeroPad);
        case 'b':
          return formatBaseX(value, 2, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
        case 'o':
          return formatBaseX(value, 8, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
        case 'x':
          return formatBaseX(value, 16, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
        case 'X':
          return formatBaseX(value, 16, prefixBaseX, leftJustify, minWidth, precision, zeroPad).toUpperCase();
        case 'u':
          return formatBaseX(value, 10, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
        case 'i':
        case 'd':
          number = +value || 0;
          number = Math.round(number - number % 1); // Plain Math.round doesn't just truncate
          prefix = number < 0 ? '-' : positivePrefix;
          value = prefix + pad(String(Math.abs(number)), precision, '0', false);
          return justify(value, prefix, leftJustify, minWidth, zeroPad);
        case 'e':
        case 'E':
        case 'f': // Should handle locales (as per setlocale)
        case 'F':
        case 'g':
        case 'G':
          number = +value;
          prefix = number < 0 ? '-' : positivePrefix;
          method = ['toExponential', 'toFixed', 'toPrecision']['efg'.indexOf(type.toLowerCase())];
          textTransform = ['toString', 'toUpperCase']['eEfFgG'.indexOf(type) % 2];
          value = prefix + Math.abs(number)[method](precision);
          return justify(value, prefix, leftJustify, minWidth, zeroPad)[textTransform]();
        default:
          return substring;
        }
      };

      return format.replace(regex, doFormat);
    }

    /**
         * Represents a Gregorian date in a more precise format than the JavaScript Date object.
         * In addition to submillisecond precision, this object can also represent leap seconds.
         * @alias GregorianDate
         * @constructor
         *
         * @see JulianDate#toGregorianDate
         */
        function GregorianDate(year, month, day, hour, minute, second, millisecond, isLeapSecond) {
            /**
             * Gets or sets the year as a whole number.
             * @type {Number}
             */
            this.year = year;
            /**
             * Gets or sets the month as a whole number with range [1, 12].
             * @type {Number}
             */
            this.month = month;
            /**
             * Gets or sets the day of the month as a whole number starting at 1.
             * @type {Number}
             */
            this.day = day;
            /**
             * Gets or sets the hour as a whole number with range [0, 23].
             * @type {Number}
             */
            this.hour = hour;
            /**
             * Gets or sets the minute of the hour as a whole number with range [0, 59].
             * @type {Number}
             */
            this.minute = minute;
            /**
             * Gets or sets the second of the minute as a whole number with range [0, 60], with 60 representing a leap second.
             * @type {Number}
             */
            this.second = second;
            /**
             * Gets or sets the millisecond of the second as a floating point number with range [0.0, 1000.0).
             * @type {Number}
             */
            this.millisecond = millisecond;
            /**
             * Gets or sets whether this time is during a leap second.
             * @type {Boolean}
             */
            this.isLeapSecond = isLeapSecond;
        }

    /**
         * Determines if a given date is a leap year.
         *
         * @exports isLeapYear
         *
         * @param {Number} year The year to be tested.
         * @returns {Boolean} True if <code>year</code> is a leap year.
         *
         * @example
         * var leapYear = Cesium.isLeapYear(2000); // true
         */
        function isLeapYear(year) {
            //>>includeStart('debug', pragmas.debug);
            if (year === null || isNaN(year)) {
                throw new Check.DeveloperError('year is required and must be a number.');
            }
            //>>includeEnd('debug');

            return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
        }

    /**
         * Describes a single leap second, which is constructed from a {@link JulianDate} and a
         * numerical offset representing the number of seconds TAI is ahead of the UTC time standard.
         * @alias LeapSecond
         * @constructor
         *
         * @param {JulianDate} [date] A Julian date representing the time of the leap second.
         * @param {Number} [offset] The cumulative number of seconds that TAI is ahead of UTC at the provided date.
         */
        function LeapSecond(date, offset) {
            /**
             * Gets or sets the date at which this leap second occurs.
             * @type {JulianDate}
             */
            this.julianDate = date;

            /**
             * Gets or sets the cumulative number of seconds between the UTC and TAI time standards at the time
             * of this leap second.
             * @type {Number}
             */
            this.offset = offset;
        }

    /**
         * Constants for time conversions like those done by {@link JulianDate}.
         *
         * @exports TimeConstants
         *
         * @see JulianDate
         *
         * @private
         */
        var TimeConstants = {
            /**
             * The number of seconds in one millisecond: <code>0.001</code>
             * @type {Number}
             * @constant
             */
            SECONDS_PER_MILLISECOND : 0.001,

            /**
             * The number of seconds in one minute: <code>60</code>.
             * @type {Number}
             * @constant
             */
            SECONDS_PER_MINUTE : 60.0,

            /**
             * The number of minutes in one hour: <code>60</code>.
             * @type {Number}
             * @constant
             */
            MINUTES_PER_HOUR : 60.0,

            /**
             * The number of hours in one day: <code>24</code>.
             * @type {Number}
             * @constant
             */
            HOURS_PER_DAY : 24.0,

            /**
             * The number of seconds in one hour: <code>3600</code>.
             * @type {Number}
             * @constant
             */
            SECONDS_PER_HOUR : 3600.0,

            /**
             * The number of minutes in one day: <code>1440</code>.
             * @type {Number}
             * @constant
             */
            MINUTES_PER_DAY : 1440.0,

            /**
             * The number of seconds in one day, ignoring leap seconds: <code>86400</code>.
             * @type {Number}
             * @constant
             */
            SECONDS_PER_DAY : 86400.0,

            /**
             * The number of days in one Julian century: <code>36525</code>.
             * @type {Number}
             * @constant
             */
            DAYS_PER_JULIAN_CENTURY : 36525.0,

            /**
             * One trillionth of a second.
             * @type {Number}
             * @constant
             */
            PICOSECOND : 0.000000001,

            /**
             * The number of days to subtract from a Julian date to determine the
             * modified Julian date, which gives the number of days since midnight
             * on November 17, 1858.
             * @type {Number}
             * @constant
             */
            MODIFIED_JULIAN_DATE_DIFFERENCE : 2400000.5
        };
    var TimeConstants$1 = Object.freeze(TimeConstants);

    /**
         * Provides the type of time standards which JulianDate can take as input.
         *
         * @exports TimeStandard
         *
         * @see JulianDate
         */
        var TimeStandard = {
            /**
             * Represents the coordinated Universal Time (UTC) time standard.
             *
             * UTC is related to TAI according to the relationship
             * <code>UTC = TAI - deltaT</code> where <code>deltaT</code> is the number of leap
             * seconds which have been introduced as of the time in TAI.
             *
             * @type {Number}
             * @constant
             */
            UTC : 0,

            /**
             * Represents the International Atomic Time (TAI) time standard.
             * TAI is the principal time standard to which the other time standards are related.
             *
             * @type {Number}
             * @constant
             */
            TAI : 1
        };
    var TimeStandard$1 = Object.freeze(TimeStandard);

    var gregorianDateScratch = new GregorianDate();
        var daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        var daysInLeapFeburary = 29;

        function compareLeapSecondDates$1(leapSecond, dateToFind) {
            return JulianDate.compare(leapSecond.julianDate, dateToFind.julianDate);
        }

        // we don't really need a leap second instance, anything with a julianDate property will do
        var binarySearchScratchLeapSecond = new LeapSecond();

        function convertUtcToTai(julianDate) {
            //Even though julianDate is in UTC, we'll treat it as TAI and
            //search the leap second table for it.
            binarySearchScratchLeapSecond.julianDate = julianDate;
            var leapSeconds = JulianDate.leapSeconds;
            var index = binarySearch(leapSeconds, binarySearchScratchLeapSecond, compareLeapSecondDates$1);

            if (index < 0) {
                index = ~index;
            }

            if (index >= leapSeconds.length) {
                index = leapSeconds.length - 1;
            }

            var offset = leapSeconds[index].offset;
            if (index > 0) {
                //Now we have the index of the closest leap second that comes on or after our UTC time.
                //However, if the difference between the UTC date being converted and the TAI
                //defined leap second is greater than the offset, we are off by one and need to use
                //the previous leap second.
                var difference = JulianDate.secondsDifference(leapSeconds[index].julianDate, julianDate);
                if (difference > offset) {
                    index--;
                    offset = leapSeconds[index].offset;
                }
            }

            JulianDate.addSeconds(julianDate, offset, julianDate);
        }

        function convertTaiToUtc(julianDate, result) {
            binarySearchScratchLeapSecond.julianDate = julianDate;
            var leapSeconds = JulianDate.leapSeconds;
            var index = binarySearch(leapSeconds, binarySearchScratchLeapSecond, compareLeapSecondDates$1);
            if (index < 0) {
                index = ~index;
            }

            //All times before our first leap second get the first offset.
            if (index === 0) {
                return JulianDate.addSeconds(julianDate, -leapSeconds[0].offset, result);
            }

            //All times after our leap second get the last offset.
            if (index >= leapSeconds.length) {
                return JulianDate.addSeconds(julianDate, -leapSeconds[index - 1].offset, result);
            }

            //Compute the difference between the found leap second and the time we are converting.
            var difference = JulianDate.secondsDifference(leapSeconds[index].julianDate, julianDate);

            if (difference === 0) {
                //The date is in our leap second table.
                return JulianDate.addSeconds(julianDate, -leapSeconds[index].offset, result);
            }

            if (difference <= 1.0) {
                //The requested date is during the moment of a leap second, then we cannot convert to UTC
                return undefined;
            }

            //The time is in between two leap seconds, index is the leap second after the date
            //we're converting, so we subtract one to get the correct LeapSecond instance.
            return JulianDate.addSeconds(julianDate, -leapSeconds[--index].offset, result);
        }

        function setComponents(wholeDays, secondsOfDay, julianDate) {
            var extraDays = (secondsOfDay / TimeConstants$1.SECONDS_PER_DAY) | 0;
            wholeDays += extraDays;
            secondsOfDay -= TimeConstants$1.SECONDS_PER_DAY * extraDays;

            if (secondsOfDay < 0) {
                wholeDays--;
                secondsOfDay += TimeConstants$1.SECONDS_PER_DAY;
            }

            julianDate.dayNumber = wholeDays;
            julianDate.secondsOfDay = secondsOfDay;
            return julianDate;
        }

        function computeJulianDateComponents(year, month, day, hour, minute, second, millisecond) {
            // Algorithm from page 604 of the Explanatory Supplement to the
            // Astronomical Almanac (Seidelmann 1992).

            var a = ((month - 14) / 12) | 0;
            var b = year + 4800 + a;
            var dayNumber = (((1461 * b) / 4) | 0) + (((367 * (month - 2 - 12 * a)) / 12) | 0) - (((3 * (((b + 100) / 100) | 0)) / 4) | 0) + day - 32075;

            // JulianDates are noon-based
            hour = hour - 12;
            if (hour < 0) {
                hour += 24;
            }

            var secondsOfDay = second + ((hour * TimeConstants$1.SECONDS_PER_HOUR) + (minute * TimeConstants$1.SECONDS_PER_MINUTE) + (millisecond * TimeConstants$1.SECONDS_PER_MILLISECOND));

            if (secondsOfDay >= 43200.0) {
                dayNumber -= 1;
            }

            return [dayNumber, secondsOfDay];
        }

        //Regular expressions used for ISO8601 date parsing.
        //YYYY
        var matchCalendarYear = /^(\d{4})$/;
        //YYYY-MM (YYYYMM is invalid)
        var matchCalendarMonth = /^(\d{4})-(\d{2})$/;
        //YYYY-DDD or YYYYDDD
        var matchOrdinalDate = /^(\d{4})-?(\d{3})$/;
        //YYYY-Www or YYYYWww or YYYY-Www-D or YYYYWwwD
        var matchWeekDate = /^(\d{4})-?W(\d{2})-?(\d{1})?$/;
        //YYYY-MM-DD or YYYYMMDD
        var matchCalendarDate = /^(\d{4})-?(\d{2})-?(\d{2})$/;
        // Match utc offset
        var utcOffset = /([Z+\-])?(\d{2})?:?(\d{2})?$/;
        // Match hours HH or HH.xxxxx
        var matchHours = /^(\d{2})(\.\d+)?/.source + utcOffset.source;
        // Match hours/minutes HH:MM HHMM.xxxxx
        var matchHoursMinutes = /^(\d{2}):?(\d{2})(\.\d+)?/.source + utcOffset.source;
        // Match hours/minutes HH:MM:SS HHMMSS.xxxxx
        var matchHoursMinutesSeconds = /^(\d{2}):?(\d{2}):?(\d{2})(\.\d+)?/.source + utcOffset.source;

        var iso8601ErrorMessage = 'Invalid ISO 8601 date.';

        /**
         * Represents an astronomical Julian date, which is the number of days since noon on January 1, -4712 (4713 BC).
         * For increased precision, this class stores the whole number part of the date and the seconds
         * part of the date in separate components.  In order to be safe for arithmetic and represent
         * leap seconds, the date is always stored in the International Atomic Time standard
         * {@link TimeStandard.TAI}.
         * @alias JulianDate
         * @constructor
         *
         * @param {Number} [julianDayNumber=0.0] The Julian Day Number representing the number of whole days.  Fractional days will also be handled correctly.
         * @param {Number} [secondsOfDay=0.0] The number of seconds into the current Julian Day Number.  Fractional seconds, negative seconds and seconds greater than a day will be handled correctly.
         * @param {TimeStandard} [timeStandard=TimeStandard.UTC] The time standard in which the first two parameters are defined.
         */
        function JulianDate(julianDayNumber, secondsOfDay, timeStandard) {
            /**
             * Gets or sets the number of whole days.
             * @type {Number}
             */
            this.dayNumber = undefined;

            /**
             * Gets or sets the number of seconds into the current day.
             * @type {Number}
             */
            this.secondsOfDay = undefined;

            julianDayNumber = defaultValue.defaultValue(julianDayNumber, 0.0);
            secondsOfDay = defaultValue.defaultValue(secondsOfDay, 0.0);
            timeStandard = defaultValue.defaultValue(timeStandard, TimeStandard$1.UTC);

            //If julianDayNumber is fractional, make it an integer and add the number of seconds the fraction represented.
            var wholeDays = julianDayNumber | 0;
            secondsOfDay = secondsOfDay + (julianDayNumber - wholeDays) * TimeConstants$1.SECONDS_PER_DAY;

            setComponents(wholeDays, secondsOfDay, this);

            if (timeStandard === TimeStandard$1.UTC) {
                convertUtcToTai(this);
            }
        }

        /**
         * Creates a new instance from a GregorianDate.
         *
         * @param {GregorianDate} date A GregorianDate.
         * @param {JulianDate} [result] An existing instance to use for the result.
         * @returns {JulianDate} The modified result parameter or a new instance if none was provided.
         *
         * @exception {DeveloperError} date must be a valid GregorianDate.
         */
        JulianDate.fromGregorianDate = function(date, result) {
            //>>includeStart('debug', pragmas.debug);
            if (!(date instanceof GregorianDate)) {
                throw new Check.DeveloperError('date must be a valid GregorianDate.');
            }
            //>>includeEnd('debug');

            var components = computeJulianDateComponents(date.year, date.month, date.day, date.hour, date.minute, date.second, date.millisecond);
            if (!defaultValue.defined(result)) {
                return new JulianDate(components[0], components[1], TimeStandard$1.UTC);
            }
            setComponents(components[0], components[1], result);
            convertUtcToTai(result);
            return result;
        };

        /**
         * Creates a new instance from a JavaScript Date.
         *
         * @param {Date} date A JavaScript Date.
         * @param {JulianDate} [result] An existing instance to use for the result.
         * @returns {JulianDate} The modified result parameter or a new instance if none was provided.
         *
         * @exception {DeveloperError} date must be a valid JavaScript Date.
         */
        JulianDate.fromDate = function(date, result) {
            //>>includeStart('debug', pragmas.debug);
            if (!(date instanceof Date) || isNaN(date.getTime())) {
                throw new Check.DeveloperError('date must be a valid JavaScript Date.');
            }
            //>>includeEnd('debug');

            var components = computeJulianDateComponents(date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds(), date.getUTCMilliseconds());
            if (!defaultValue.defined(result)) {
                return new JulianDate(components[0], components[1], TimeStandard$1.UTC);
            }
            setComponents(components[0], components[1], result);
            convertUtcToTai(result);
            return result;
        };

        /**
         * Creates a new instance from a from an {@link http://en.wikipedia.org/wiki/ISO_8601|ISO 8601} date.
         * This method is superior to <code>Date.parse</code> because it will handle all valid formats defined by the ISO 8601
         * specification, including leap seconds and sub-millisecond times, which discarded by most JavaScript implementations.
         *
         * @param {String} iso8601String An ISO 8601 date.
         * @param {JulianDate} [result] An existing instance to use for the result.
         * @returns {JulianDate} The modified result parameter or a new instance if none was provided.
         *
         * @exception {DeveloperError} Invalid ISO 8601 date.
         */
        JulianDate.fromIso8601 = function(iso8601String, result) {
            //>>includeStart('debug', pragmas.debug);
            if (typeof iso8601String !== 'string') {
                throw new Check.DeveloperError(iso8601ErrorMessage);
            }
            //>>includeEnd('debug');

            //Comma and decimal point both indicate a fractional number according to ISO 8601,
            //start out by blanket replacing , with . which is the only valid such symbol in JS.
            iso8601String = iso8601String.replace(',', '.');

            //Split the string into its date and time components, denoted by a mandatory T
            var tokens = iso8601String.split('T');
            var year;
            var month = 1;
            var day = 1;
            var hour = 0;
            var minute = 0;
            var second = 0;
            var millisecond = 0;

            //Lacking a time is okay, but a missing date is illegal.
            var date = tokens[0];
            var time = tokens[1];
            var tmp;
            var inLeapYear;
            //>>includeStart('debug', pragmas.debug);
            if (!defaultValue.defined(date)) {
                throw new Check.DeveloperError(iso8601ErrorMessage);
            }

            var dashCount;
            //>>includeEnd('debug');

            //First match the date against possible regular expressions.
            tokens = date.match(matchCalendarDate);
            if (tokens !== null) {
                //>>includeStart('debug', pragmas.debug);
                dashCount = date.split('-').length - 1;
                if (dashCount > 0 && dashCount !== 2) {
                    throw new Check.DeveloperError(iso8601ErrorMessage);
                }
                //>>includeEnd('debug');
                year = +tokens[1];
                month = +tokens[2];
                day = +tokens[3];
            } else {
                tokens = date.match(matchCalendarMonth);
                if (tokens !== null) {
                    year = +tokens[1];
                    month = +tokens[2];
                } else {
                    tokens = date.match(matchCalendarYear);
                    if (tokens !== null) {
                        year = +tokens[1];
                    } else {
                        //Not a year/month/day so it must be an ordinal date.
                        var dayOfYear;
                        tokens = date.match(matchOrdinalDate);
                        if (tokens !== null) {

                            year = +tokens[1];
                            dayOfYear = +tokens[2];
                            inLeapYear = isLeapYear(year);

                            //This validation is only applicable for this format.
                            //>>includeStart('debug', pragmas.debug);
                            if (dayOfYear < 1 || (inLeapYear && dayOfYear > 366) || (!inLeapYear && dayOfYear > 365)) {
                                throw new Check.DeveloperError(iso8601ErrorMessage);
                            }
                            //>>includeEnd('debug')
                        } else {
                            tokens = date.match(matchWeekDate);
                            if (tokens !== null) {
                                //ISO week date to ordinal date from
                                //http://en.wikipedia.org/w/index.php?title=ISO_week_date&oldid=474176775
                                year = +tokens[1];
                                var weekNumber = +tokens[2];
                                var dayOfWeek = +tokens[3] || 0;

                                //>>includeStart('debug', pragmas.debug);
                                dashCount = date.split('-').length - 1;
                                if (dashCount > 0 &&
                                   ((!defaultValue.defined(tokens[3]) && dashCount !== 1) ||
                                   (defaultValue.defined(tokens[3]) && dashCount !== 2))) {
                                    throw new Check.DeveloperError(iso8601ErrorMessage);
                                }
                                //>>includeEnd('debug')

                                var january4 = new Date(Date.UTC(year, 0, 4));
                                dayOfYear = (weekNumber * 7) + dayOfWeek - january4.getUTCDay() - 3;
                            } else {
                                //None of our regular expressions succeeded in parsing the date properly.
                                //>>includeStart('debug', pragmas.debug);
                                throw new Check.DeveloperError(iso8601ErrorMessage);
                                //>>includeEnd('debug')
                            }
                        }
                        //Split an ordinal date into month/day.
                        tmp = new Date(Date.UTC(year, 0, 1));
                        tmp.setUTCDate(dayOfYear);
                        month = tmp.getUTCMonth() + 1;
                        day = tmp.getUTCDate();
                    }
                }
            }

            //Now that we have all of the date components, validate them to make sure nothing is out of range.
            inLeapYear = isLeapYear(year);
            //>>includeStart('debug', pragmas.debug);
            if (month < 1 || month > 12 || day < 1 || ((month !== 2 || !inLeapYear) && day > daysInMonth[month - 1]) || (inLeapYear && month === 2 && day > daysInLeapFeburary)) {
                throw new Check.DeveloperError(iso8601ErrorMessage);
            }
            //>>includeEnd('debug')

            //Now move onto the time string, which is much simpler.
            //If no time is specified, it is considered the beginning of the day, UTC to match Javascript's implementation.
            var offsetIndex;
            if (defaultValue.defined(time)) {
                tokens = time.match(matchHoursMinutesSeconds);
                if (tokens !== null) {
                    //>>includeStart('debug', pragmas.debug);
                    dashCount = time.split(':').length - 1;
                    if (dashCount > 0 && dashCount !== 2 && dashCount !== 3) {
                        throw new Check.DeveloperError(iso8601ErrorMessage);
                    }
                    //>>includeEnd('debug')

                    hour = +tokens[1];
                    minute = +tokens[2];
                    second = +tokens[3];
                    millisecond = +(tokens[4] || 0) * 1000.0;
                    offsetIndex = 5;
                } else {
                    tokens = time.match(matchHoursMinutes);
                    if (tokens !== null) {
                        //>>includeStart('debug', pragmas.debug);
                        dashCount = time.split(':').length - 1;
                        if (dashCount > 2) {
                            throw new Check.DeveloperError(iso8601ErrorMessage);
                        }
                        //>>includeEnd('debug')

                        hour = +tokens[1];
                        minute = +tokens[2];
                        second = +(tokens[3] || 0) * 60.0;
                        offsetIndex = 4;
                    } else {
                        tokens = time.match(matchHours);
                        if (tokens !== null) {
                            hour = +tokens[1];
                            minute = +(tokens[2] || 0) * 60.0;
                            offsetIndex = 3;
                        } else {
                            //>>includeStart('debug', pragmas.debug);
                            throw new Check.DeveloperError(iso8601ErrorMessage);
                            //>>includeEnd('debug')
                        }
                    }
                }

                //Validate that all values are in proper range.  Minutes and hours have special cases at 60 and 24.
                //>>includeStart('debug', pragmas.debug);
                if (minute >= 60 || second >= 61 || hour > 24 || (hour === 24 && (minute > 0 || second > 0 || millisecond > 0))) {
                    throw new Check.DeveloperError(iso8601ErrorMessage);
                }
                //>>includeEnd('debug');

                //Check the UTC offset value, if no value exists, use local time
                //a Z indicates UTC, + or - are offsets.
                var offset = tokens[offsetIndex];
                var offsetHours = +(tokens[offsetIndex + 1]);
                var offsetMinutes = +(tokens[offsetIndex + 2] || 0);
                switch (offset) {
                case '+':
                    hour = hour - offsetHours;
                    minute = minute - offsetMinutes;
                    break;
                case '-':
                    hour = hour + offsetHours;
                    minute = minute + offsetMinutes;
                    break;
                case 'Z':
                    break;
                default:
                    minute = minute + new Date(Date.UTC(year, month - 1, day, hour, minute)).getTimezoneOffset();
                    break;
                }
            }

            //ISO8601 denotes a leap second by any time having a seconds component of 60 seconds.
            //If that's the case, we need to temporarily subtract a second in order to build a UTC date.
            //Then we add it back in after converting to TAI.
            var isLeapSecond = second === 60;
            if (isLeapSecond) {
                second--;
            }

            //Even if we successfully parsed the string into its components, after applying UTC offset or
            //special cases like 24:00:00 denoting midnight, we need to normalize the data appropriately.

            //milliseconds can never be greater than 1000, and seconds can't be above 60, so we start with minutes
            while (minute >= 60) {
                minute -= 60;
                hour++;
            }

            while (hour >= 24) {
                hour -= 24;
                day++;
            }

            tmp = (inLeapYear && month === 2) ? daysInLeapFeburary : daysInMonth[month - 1];
            while (day > tmp) {
                day -= tmp;
                month++;

                if (month > 12) {
                    month -= 12;
                    year++;
                }

                tmp = (inLeapYear && month === 2) ? daysInLeapFeburary : daysInMonth[month - 1];
            }

            //If UTC offset is at the beginning/end of the day, minutes can be negative.
            while (minute < 0) {
                minute += 60;
                hour--;
            }

            while (hour < 0) {
                hour += 24;
                day--;
            }

            while (day < 1) {
                month--;
                if (month < 1) {
                    month += 12;
                    year--;
                }

                tmp = (inLeapYear && month === 2) ? daysInLeapFeburary : daysInMonth[month - 1];
                day += tmp;
            }

            //Now create the JulianDate components from the Gregorian date and actually create our instance.
            var components = computeJulianDateComponents(year, month, day, hour, minute, second, millisecond);

            if (!defaultValue.defined(result)) {
                result = new JulianDate(components[0], components[1], TimeStandard$1.UTC);
            } else {
                setComponents(components[0], components[1], result);
                convertUtcToTai(result);
            }

            //If we were on a leap second, add it back.
            if (isLeapSecond) {
                JulianDate.addSeconds(result, 1, result);
            }

            return result;
        };

        /**
         * Creates a new instance that represents the current system time.
         * This is equivalent to calling <code>JulianDate.fromDate(new Date());</code>.
         *
         * @param {JulianDate} [result] An existing instance to use for the result.
         * @returns {JulianDate} The modified result parameter or a new instance if none was provided.
         */
        JulianDate.now = function(result) {
            return JulianDate.fromDate(new Date(), result);
        };

        var toGregorianDateScratch = new JulianDate(0, 0, TimeStandard$1.TAI);

        /**
         * Creates a {@link GregorianDate} from the provided instance.
         *
         * @param {JulianDate} julianDate The date to be converted.
         * @param {GregorianDate} [result] An existing instance to use for the result.
         * @returns {GregorianDate} The modified result parameter or a new instance if none was provided.
         */
        JulianDate.toGregorianDate = function(julianDate, result) {
            //>>includeStart('debug', pragmas.debug);
            if (!defaultValue.defined(julianDate)) {
                throw new Check.DeveloperError('julianDate is required.');
            }
            //>>includeEnd('debug');

            var isLeapSecond = false;
            var thisUtc = convertTaiToUtc(julianDate, toGregorianDateScratch);
            if (!defaultValue.defined(thisUtc)) {
                //Conversion to UTC will fail if we are during a leap second.
                //If that's the case, subtract a second and convert again.
                //JavaScript doesn't support leap seconds, so this results in second 59 being repeated twice.
                JulianDate.addSeconds(julianDate, -1, toGregorianDateScratch);
                thisUtc = convertTaiToUtc(toGregorianDateScratch, toGregorianDateScratch);
                isLeapSecond = true;
            }

            var julianDayNumber = thisUtc.dayNumber;
            var secondsOfDay = thisUtc.secondsOfDay;

            if (secondsOfDay >= 43200.0) {
                julianDayNumber += 1;
            }

            // Algorithm from page 604 of the Explanatory Supplement to the
            // Astronomical Almanac (Seidelmann 1992).
            var L = (julianDayNumber + 68569) | 0;
            var N = (4 * L / 146097) | 0;
            L = (L - (((146097 * N + 3) / 4) | 0)) | 0;
            var I = ((4000 * (L + 1)) / 1461001) | 0;
            L = (L - (((1461 * I) / 4) | 0) + 31) | 0;
            var J = ((80 * L) / 2447) | 0;
            var day = (L - (((2447 * J) / 80) | 0)) | 0;
            L = (J / 11) | 0;
            var month = (J + 2 - 12 * L) | 0;
            var year = (100 * (N - 49) + I + L) | 0;

            var hour = (secondsOfDay / TimeConstants$1.SECONDS_PER_HOUR) | 0;
            var remainingSeconds = secondsOfDay - (hour * TimeConstants$1.SECONDS_PER_HOUR);
            var minute = (remainingSeconds / TimeConstants$1.SECONDS_PER_MINUTE) | 0;
            remainingSeconds = remainingSeconds - (minute * TimeConstants$1.SECONDS_PER_MINUTE);
            var second = remainingSeconds | 0;
            var millisecond = ((remainingSeconds - second) / TimeConstants$1.SECONDS_PER_MILLISECOND);

            // JulianDates are noon-based
            hour += 12;
            if (hour > 23) {
                hour -= 24;
            }

            //If we were on a leap second, add it back.
            if (isLeapSecond) {
                second += 1;
            }

            if (!defaultValue.defined(result)) {
                return new GregorianDate(year, month, day, hour, minute, second, millisecond, isLeapSecond);
            }

            result.year = year;
            result.month = month;
            result.day = day;
            result.hour = hour;
            result.minute = minute;
            result.second = second;
            result.millisecond = millisecond;
            result.isLeapSecond = isLeapSecond;
            return result;
        };

        /**
         * Creates a JavaScript Date from the provided instance.
         * Since JavaScript dates are only accurate to the nearest millisecond and
         * cannot represent a leap second, consider using {@link JulianDate.toGregorianDate} instead.
         * If the provided JulianDate is during a leap second, the previous second is used.
         *
         * @param {JulianDate} julianDate The date to be converted.
         * @returns {Date} A new instance representing the provided date.
         */
        JulianDate.toDate = function(julianDate) {
            //>>includeStart('debug', pragmas.debug);
            if (!defaultValue.defined(julianDate)) {
                throw new Check.DeveloperError('julianDate is required.');
            }
            //>>includeEnd('debug');

            var gDate = JulianDate.toGregorianDate(julianDate, gregorianDateScratch);
            var second = gDate.second;
            if (gDate.isLeapSecond) {
                second -= 1;
            }
            return new Date(Date.UTC(gDate.year, gDate.month - 1, gDate.day, gDate.hour, gDate.minute, second, gDate.millisecond));
        };

        /**
         * Creates an ISO8601 representation of the provided date.
         *
         * @param {JulianDate} julianDate The date to be converted.
         * @param {Number} [precision] The number of fractional digits used to represent the seconds component.  By default, the most precise representation is used.
         * @returns {String} The ISO8601 representation of the provided date.
         */
        JulianDate.toIso8601 = function(julianDate, precision) {
            //>>includeStart('debug', pragmas.debug);
            if (!defaultValue.defined(julianDate)) {
                throw new Check.DeveloperError('julianDate is required.');
            }
            //>>includeEnd('debug');

            var gDate = JulianDate.toGregorianDate(julianDate, gregorianDateScratch);
            var year = gDate.year;
            var month = gDate.month;
            var day = gDate.day;
            var hour = gDate.hour;
            var minute = gDate.minute;
            var second = gDate.second;
            var millisecond = gDate.millisecond;

            // special case - Iso8601.MAXIMUM_VALUE produces a string which we can't parse unless we adjust.
            // 10000-01-01T00:00:00 is the same instant as 9999-12-31T24:00:00
            if (year === 10000 && month === 1 && day === 1 && hour === 0 && minute === 0 && second === 0 && millisecond === 0) {
                year = 9999;
                month = 12;
                day = 31;
                hour = 24;
            }

            var millisecondStr;

            if (!defaultValue.defined(precision) && millisecond !== 0) {
                //Forces milliseconds into a number with at least 3 digits to whatever the default toString() precision is.
                millisecondStr = (millisecond * 0.01).toString().replace('.', '');
                return sprintf('%04d-%02d-%02dT%02d:%02d:%02d.%sZ', year, month, day, hour, minute, second, millisecondStr);
            }

            //Precision is either 0 or milliseconds is 0 with undefined precision, in either case, leave off milliseconds entirely
            if (!defaultValue.defined(precision) || precision === 0) {
                return sprintf('%04d-%02d-%02dT%02d:%02d:%02dZ', year, month, day, hour, minute, second);
            }

            //Forces milliseconds into a number with at least 3 digits to whatever the specified precision is.
            millisecondStr = (millisecond * 0.01).toFixed(precision).replace('.', '').slice(0, precision);
            return sprintf('%04d-%02d-%02dT%02d:%02d:%02d.%sZ', year, month, day, hour, minute, second, millisecondStr);
        };

        /**
         * Duplicates a JulianDate instance.
         *
         * @param {JulianDate} julianDate The date to duplicate.
         * @param {JulianDate} [result] An existing instance to use for the result.
         * @returns {JulianDate} The modified result parameter or a new instance if none was provided. Returns undefined if julianDate is undefined.
         */
        JulianDate.clone = function(julianDate, result) {
            if (!defaultValue.defined(julianDate)) {
                return undefined;
            }
            if (!defaultValue.defined(result)) {
                return new JulianDate(julianDate.dayNumber, julianDate.secondsOfDay, TimeStandard$1.TAI);
            }
            result.dayNumber = julianDate.dayNumber;
            result.secondsOfDay = julianDate.secondsOfDay;
            return result;
        };

        /**
         * Compares two instances.
         *
         * @param {JulianDate} left The first instance.
         * @param {JulianDate} right The second instance.
         * @returns {Number} A negative value if left is less than right, a positive value if left is greater than right, or zero if left and right are equal.
         */
        JulianDate.compare = function(left, right) {
            //>>includeStart('debug', pragmas.debug);
            if (!defaultValue.defined(left)) {
                throw new Check.DeveloperError('left is required.');
            }
            if (!defaultValue.defined(right)) {
                throw new Check.DeveloperError('right is required.');
            }
            //>>includeEnd('debug');

            var julianDayNumberDifference = left.dayNumber - right.dayNumber;
            if (julianDayNumberDifference !== 0) {
                return julianDayNumberDifference;
            }
            return left.secondsOfDay - right.secondsOfDay;
        };

        /**
         * Compares two instances and returns <code>true</code> if they are equal, <code>false</code> otherwise.
         *
         * @param {JulianDate} [left] The first instance.
         * @param {JulianDate} [right] The second instance.
         * @returns {Boolean} <code>true</code> if the dates are equal; otherwise, <code>false</code>.
         */
        JulianDate.equals = function(left, right) {
            return (left === right) ||
                   (defaultValue.defined(left) &&
                    defaultValue.defined(right) &&
                    left.dayNumber === right.dayNumber &&
                    left.secondsOfDay === right.secondsOfDay);
        };

        /**
         * Compares two instances and returns <code>true</code> if they are within <code>epsilon</code> seconds of
         * each other.  That is, in order for the dates to be considered equal (and for
         * this function to return <code>true</code>), the absolute value of the difference between them, in
         * seconds, must be less than <code>epsilon</code>.
         *
         * @param {JulianDate} [left] The first instance.
         * @param {JulianDate} [right] The second instance.
         * @param {Number} epsilon The maximum number of seconds that should separate the two instances.
         * @returns {Boolean} <code>true</code> if the two dates are within <code>epsilon</code> seconds of each other; otherwise <code>false</code>.
         */
        JulianDate.equalsEpsilon = function(left, right, epsilon) {
            //>>includeStart('debug', pragmas.debug);
            if (!defaultValue.defined(epsilon)) {
                throw new Check.DeveloperError('epsilon is required.');
            }
            //>>includeEnd('debug');

            return (left === right) ||
                   (defaultValue.defined(left) &&
                    defaultValue.defined(right) &&
                    Math.abs(JulianDate.secondsDifference(left, right)) <= epsilon);
        };

        /**
         * Computes the total number of whole and fractional days represented by the provided instance.
         *
         * @param {JulianDate} julianDate The date.
         * @returns {Number} The Julian date as single floating point number.
         */
        JulianDate.totalDays = function(julianDate) {
            //>>includeStart('debug', pragmas.debug);
            if (!defaultValue.defined(julianDate)) {
                throw new Check.DeveloperError('julianDate is required.');
            }
            //>>includeEnd('debug');
            return julianDate.dayNumber + (julianDate.secondsOfDay / TimeConstants$1.SECONDS_PER_DAY);
        };

        /**
         * Computes the difference in seconds between the provided instance.
         *
         * @param {JulianDate} left The first instance.
         * @param {JulianDate} right The second instance.
         * @returns {Number} The difference, in seconds, when subtracting <code>right</code> from <code>left</code>.
         */
        JulianDate.secondsDifference = function(left, right) {
            //>>includeStart('debug', pragmas.debug);
            if (!defaultValue.defined(left)) {
                throw new Check.DeveloperError('left is required.');
            }
            if (!defaultValue.defined(right)) {
                throw new Check.DeveloperError('right is required.');
            }
            //>>includeEnd('debug');

            var dayDifference = (left.dayNumber - right.dayNumber) * TimeConstants$1.SECONDS_PER_DAY;
            return (dayDifference + (left.secondsOfDay - right.secondsOfDay));
        };

        /**
         * Computes the difference in days between the provided instance.
         *
         * @param {JulianDate} left The first instance.
         * @param {JulianDate} right The second instance.
         * @returns {Number} The difference, in days, when subtracting <code>right</code> from <code>left</code>.
         */
        JulianDate.daysDifference = function(left, right) {
            //>>includeStart('debug', pragmas.debug);
            if (!defaultValue.defined(left)) {
                throw new Check.DeveloperError('left is required.');
            }
            if (!defaultValue.defined(right)) {
                throw new Check.DeveloperError('right is required.');
            }
            //>>includeEnd('debug');

            var dayDifference = (left.dayNumber - right.dayNumber);
            var secondDifference = (left.secondsOfDay - right.secondsOfDay) / TimeConstants$1.SECONDS_PER_DAY;
            return dayDifference + secondDifference;
        };

        /**
         * Computes the number of seconds the provided instance is ahead of UTC.
         *
         * @param {JulianDate} julianDate The date.
         * @returns {Number} The number of seconds the provided instance is ahead of UTC
         */
        JulianDate.computeTaiMinusUtc = function(julianDate) {
            binarySearchScratchLeapSecond.julianDate = julianDate;
            var leapSeconds = JulianDate.leapSeconds;
            var index = binarySearch(leapSeconds, binarySearchScratchLeapSecond, compareLeapSecondDates$1);
            if (index < 0) {
                index = ~index;
                --index;
                if (index < 0) {
                    index = 0;
                }
            }
            return leapSeconds[index].offset;
        };

        /**
         * Adds the provided number of seconds to the provided date instance.
         *
         * @param {JulianDate} julianDate The date.
         * @param {Number} seconds The number of seconds to add or subtract.
         * @param {JulianDate} result An existing instance to use for the result.
         * @returns {JulianDate} The modified result parameter.
         */
        JulianDate.addSeconds = function(julianDate, seconds, result) {
            //>>includeStart('debug', pragmas.debug);
            if (!defaultValue.defined(julianDate)) {
                throw new Check.DeveloperError('julianDate is required.');
            }
            if (!defaultValue.defined(seconds)) {
                throw new Check.DeveloperError('seconds is required.');
            }
            if (!defaultValue.defined(result)) {
                throw new Check.DeveloperError('result is required.');
            }
            //>>includeEnd('debug');

            return setComponents(julianDate.dayNumber, julianDate.secondsOfDay + seconds, result);
        };

        /**
         * Adds the provided number of minutes to the provided date instance.
         *
         * @param {JulianDate} julianDate The date.
         * @param {Number} minutes The number of minutes to add or subtract.
         * @param {JulianDate} result An existing instance to use for the result.
         * @returns {JulianDate} The modified result parameter.
         */
        JulianDate.addMinutes = function(julianDate, minutes, result) {
            //>>includeStart('debug', pragmas.debug);
            if (!defaultValue.defined(julianDate)) {
                throw new Check.DeveloperError('julianDate is required.');
            }
            if (!defaultValue.defined(minutes)) {
                throw new Check.DeveloperError('minutes is required.');
            }
            if (!defaultValue.defined(result)) {
                throw new Check.DeveloperError('result is required.');
            }
            //>>includeEnd('debug');

            var newSecondsOfDay = julianDate.secondsOfDay + (minutes * TimeConstants$1.SECONDS_PER_MINUTE);
            return setComponents(julianDate.dayNumber, newSecondsOfDay, result);
        };

        /**
         * Adds the provided number of hours to the provided date instance.
         *
         * @param {JulianDate} julianDate The date.
         * @param {Number} hours The number of hours to add or subtract.
         * @param {JulianDate} result An existing instance to use for the result.
         * @returns {JulianDate} The modified result parameter.
         */
        JulianDate.addHours = function(julianDate, hours, result) {
            //>>includeStart('debug', pragmas.debug);
            if (!defaultValue.defined(julianDate)) {
                throw new Check.DeveloperError('julianDate is required.');
            }
            if (!defaultValue.defined(hours)) {
                throw new Check.DeveloperError('hours is required.');
            }
            if (!defaultValue.defined(result)) {
                throw new Check.DeveloperError('result is required.');
            }
            //>>includeEnd('debug');

            var newSecondsOfDay = julianDate.secondsOfDay + (hours * TimeConstants$1.SECONDS_PER_HOUR);
            return setComponents(julianDate.dayNumber, newSecondsOfDay, result);
        };

        /**
         * Adds the provided number of days to the provided date instance.
         *
         * @param {JulianDate} julianDate The date.
         * @param {Number} days The number of days to add or subtract.
         * @param {JulianDate} result An existing instance to use for the result.
         * @returns {JulianDate} The modified result parameter.
         */
        JulianDate.addDays = function(julianDate, days, result) {
            //>>includeStart('debug', pragmas.debug);
            if (!defaultValue.defined(julianDate)) {
                throw new Check.DeveloperError('julianDate is required.');
            }
            if (!defaultValue.defined(days)) {
                throw new Check.DeveloperError('days is required.');
            }
            if (!defaultValue.defined(result)) {
                throw new Check.DeveloperError('result is required.');
            }
            //>>includeEnd('debug');

            var newJulianDayNumber = julianDate.dayNumber + days;
            return setComponents(newJulianDayNumber, julianDate.secondsOfDay, result);
        };

        /**
         * Compares the provided instances and returns <code>true</code> if <code>left</code> is earlier than <code>right</code>, <code>false</code> otherwise.
         *
         * @param {JulianDate} left The first instance.
         * @param {JulianDate} right The second instance.
         * @returns {Boolean} <code>true</code> if <code>left</code> is earlier than <code>right</code>, <code>false</code> otherwise.
         */
        JulianDate.lessThan = function(left, right) {
            return JulianDate.compare(left, right) < 0;
        };

        /**
         * Compares the provided instances and returns <code>true</code> if <code>left</code> is earlier than or equal to <code>right</code>, <code>false</code> otherwise.
         *
         * @param {JulianDate} left The first instance.
         * @param {JulianDate} right The second instance.
         * @returns {Boolean} <code>true</code> if <code>left</code> is earlier than or equal to <code>right</code>, <code>false</code> otherwise.
         */
        JulianDate.lessThanOrEquals = function(left, right) {
            return JulianDate.compare(left, right) <= 0;
        };

        /**
         * Compares the provided instances and returns <code>true</code> if <code>left</code> is later than <code>right</code>, <code>false</code> otherwise.
         *
         * @param {JulianDate} left The first instance.
         * @param {JulianDate} right The second instance.
         * @returns {Boolean} <code>true</code> if <code>left</code> is later than <code>right</code>, <code>false</code> otherwise.
         */
        JulianDate.greaterThan = function(left, right) {
            return JulianDate.compare(left, right) > 0;
        };

        /**
         * Compares the provided instances and returns <code>true</code> if <code>left</code> is later than or equal to <code>right</code>, <code>false</code> otherwise.
         *
         * @param {JulianDate} left The first instance.
         * @param {JulianDate} right The second instance.
         * @returns {Boolean} <code>true</code> if <code>left</code> is later than or equal to <code>right</code>, <code>false</code> otherwise.
         */
        JulianDate.greaterThanOrEquals = function(left, right) {
            return JulianDate.compare(left, right) >= 0;
        };

        /**
         * Duplicates this instance.
         *
         * @param {JulianDate} [result] An existing instance to use for the result.
         * @returns {JulianDate} The modified result parameter or a new instance if none was provided.
         */
        JulianDate.prototype.clone = function(result) {
            return JulianDate.clone(this, result);
        };

        /**
         * Compares this and the provided instance and returns <code>true</code> if they are equal, <code>false</code> otherwise.
         *
         * @param {JulianDate} [right] The second instance.
         * @returns {Boolean} <code>true</code> if the dates are equal; otherwise, <code>false</code>.
         */
        JulianDate.prototype.equals = function(right) {
            return JulianDate.equals(this, right);
        };

        /**
         * Compares this and the provided instance and returns <code>true</code> if they are within <code>epsilon</code> seconds of
         * each other.  That is, in order for the dates to be considered equal (and for
         * this function to return <code>true</code>), the absolute value of the difference between them, in
         * seconds, must be less than <code>epsilon</code>.
         *
         * @param {JulianDate} [right] The second instance.
         * @param {Number} epsilon The maximum number of seconds that should separate the two instances.
         * @returns {Boolean} <code>true</code> if the two dates are within <code>epsilon</code> seconds of each other; otherwise <code>false</code>.
         */
        JulianDate.prototype.equalsEpsilon = function(right, epsilon) {
            return JulianDate.equalsEpsilon(this, right, epsilon);
        };

        /**
         * Creates a string representing this date in ISO8601 format.
         *
         * @returns {String} A string representing this date in ISO8601 format.
         */
        JulianDate.prototype.toString = function() {
            return JulianDate.toIso8601(this);
        };

        /**
         * Gets or sets the list of leap seconds used throughout Cesium.
         * @memberof JulianDate
         * @type {LeapSecond[]}
         */
        JulianDate.leapSeconds = [
                                   new LeapSecond(new JulianDate(2441317, 43210.0, TimeStandard$1.TAI), 10), // January 1, 1972 00:00:00 UTC
                                   new LeapSecond(new JulianDate(2441499, 43211.0, TimeStandard$1.TAI), 11), // July 1, 1972 00:00:00 UTC
                                   new LeapSecond(new JulianDate(2441683, 43212.0, TimeStandard$1.TAI), 12), // January 1, 1973 00:00:00 UTC
                                   new LeapSecond(new JulianDate(2442048, 43213.0, TimeStandard$1.TAI), 13), // January 1, 1974 00:00:00 UTC
                                   new LeapSecond(new JulianDate(2442413, 43214.0, TimeStandard$1.TAI), 14), // January 1, 1975 00:00:00 UTC
                                   new LeapSecond(new JulianDate(2442778, 43215.0, TimeStandard$1.TAI), 15), // January 1, 1976 00:00:00 UTC
                                   new LeapSecond(new JulianDate(2443144, 43216.0, TimeStandard$1.TAI), 16), // January 1, 1977 00:00:00 UTC
                                   new LeapSecond(new JulianDate(2443509, 43217.0, TimeStandard$1.TAI), 17), // January 1, 1978 00:00:00 UTC
                                   new LeapSecond(new JulianDate(2443874, 43218.0, TimeStandard$1.TAI), 18), // January 1, 1979 00:00:00 UTC
                                   new LeapSecond(new JulianDate(2444239, 43219.0, TimeStandard$1.TAI), 19), // January 1, 1980 00:00:00 UTC
                                   new LeapSecond(new JulianDate(2444786, 43220.0, TimeStandard$1.TAI), 20), // July 1, 1981 00:00:00 UTC
                                   new LeapSecond(new JulianDate(2445151, 43221.0, TimeStandard$1.TAI), 21), // July 1, 1982 00:00:00 UTC
                                   new LeapSecond(new JulianDate(2445516, 43222.0, TimeStandard$1.TAI), 22), // July 1, 1983 00:00:00 UTC
                                   new LeapSecond(new JulianDate(2446247, 43223.0, TimeStandard$1.TAI), 23), // July 1, 1985 00:00:00 UTC
                                   new LeapSecond(new JulianDate(2447161, 43224.0, TimeStandard$1.TAI), 24), // January 1, 1988 00:00:00 UTC
                                   new LeapSecond(new JulianDate(2447892, 43225.0, TimeStandard$1.TAI), 25), // January 1, 1990 00:00:00 UTC
                                   new LeapSecond(new JulianDate(2448257, 43226.0, TimeStandard$1.TAI), 26), // January 1, 1991 00:00:00 UTC
                                   new LeapSecond(new JulianDate(2448804, 43227.0, TimeStandard$1.TAI), 27), // July 1, 1992 00:00:00 UTC
                                   new LeapSecond(new JulianDate(2449169, 43228.0, TimeStandard$1.TAI), 28), // July 1, 1993 00:00:00 UTC
                                   new LeapSecond(new JulianDate(2449534, 43229.0, TimeStandard$1.TAI), 29), // July 1, 1994 00:00:00 UTC
                                   new LeapSecond(new JulianDate(2450083, 43230.0, TimeStandard$1.TAI), 30), // January 1, 1996 00:00:00 UTC
                                   new LeapSecond(new JulianDate(2450630, 43231.0, TimeStandard$1.TAI), 31), // July 1, 1997 00:00:00 UTC
                                   new LeapSecond(new JulianDate(2451179, 43232.0, TimeStandard$1.TAI), 32), // January 1, 1999 00:00:00 UTC
                                   new LeapSecond(new JulianDate(2453736, 43233.0, TimeStandard$1.TAI), 33), // January 1, 2006 00:00:00 UTC
                                   new LeapSecond(new JulianDate(2454832, 43234.0, TimeStandard$1.TAI), 34), // January 1, 2009 00:00:00 UTC
                                   new LeapSecond(new JulianDate(2456109, 43235.0, TimeStandard$1.TAI), 35), // July 1, 2012 00:00:00 UTC
                                   new LeapSecond(new JulianDate(2457204, 43236.0, TimeStandard$1.TAI), 36), // July 1, 2015 00:00:00 UTC
                                   new LeapSecond(new JulianDate(2457754, 43237.0, TimeStandard$1.TAI), 37)  // January 1, 2017 00:00:00 UTC
                                 ];

    /**
         * Specifies Earth polar motion coordinates and the difference between UT1 and UTC.
         * These Earth Orientation Parameters (EOP) are primarily used in the transformation from
         * the International Celestial Reference Frame (ICRF) to the International Terrestrial
         * Reference Frame (ITRF).
         *
         * @alias EarthOrientationParameters
         * @constructor
         *
         * @param {Object} [options] Object with the following properties:
         * @param {Resource|String} [options.url] The URL from which to obtain EOP data.  If neither this
         *                 parameter nor options.data is specified, all EOP values are assumed
         *                 to be 0.0.  If options.data is specified, this parameter is
         *                 ignored.
         * @param {Object} [options.data] The actual EOP data.  If neither this
         *                 parameter nor options.data is specified, all EOP values are assumed
         *                 to be 0.0.
         * @param {Boolean} [options.addNewLeapSeconds=true] True if leap seconds that
         *                  are specified in the EOP data but not in {@link JulianDate.leapSeconds}
         *                  should be added to {@link JulianDate.leapSeconds}.  False if
         *                  new leap seconds should be handled correctly in the context
         *                  of the EOP data but otherwise ignored.
         *
         * @example
         * // An example EOP data file, EOP.json:
         * {
         *   "columnNames" : ["dateIso8601","modifiedJulianDateUtc","xPoleWanderRadians","yPoleWanderRadians","ut1MinusUtcSeconds","lengthOfDayCorrectionSeconds","xCelestialPoleOffsetRadians","yCelestialPoleOffsetRadians","taiMinusUtcSeconds"],
         *   "samples" : [
         *      "2011-07-01T00:00:00Z",55743.0,2.117957047295119e-7,2.111518721609984e-6,-0.2908948,-2.956e-4,3.393695767766752e-11,3.3452143996557983e-10,34.0,
         *      "2011-07-02T00:00:00Z",55744.0,2.193297093339541e-7,2.115460256837405e-6,-0.29065,-1.824e-4,-8.241832578862112e-11,5.623838700870617e-10,34.0,
         *      "2011-07-03T00:00:00Z",55745.0,2.262286080161428e-7,2.1191157519929706e-6,-0.2905572,1.9e-6,-3.490658503988659e-10,6.981317007977318e-10,34.0
         *   ]
         * }
         *
         * @example
         * // Loading the EOP data
         * var eop = new Cesium.EarthOrientationParameters({ url : 'Data/EOP.json' });
         * Cesium.Transforms.earthOrientationParameters = eop;
         *
         * @private
         */
        function EarthOrientationParameters(options) {
            options = defaultValue.defaultValue(options, defaultValue.defaultValue.EMPTY_OBJECT);

            this._dates = undefined;
            this._samples = undefined;

            this._dateColumn = -1;
            this._xPoleWanderRadiansColumn = -1;
            this._yPoleWanderRadiansColumn = -1;
            this._ut1MinusUtcSecondsColumn = -1;
            this._xCelestialPoleOffsetRadiansColumn = -1;
            this._yCelestialPoleOffsetRadiansColumn = -1;
            this._taiMinusUtcSecondsColumn = -1;

            this._columnCount = 0;
            this._lastIndex = -1;

            this._downloadPromise = undefined;
            this._dataError = undefined;

            this._addNewLeapSeconds = defaultValue.defaultValue(options.addNewLeapSeconds, true);

            if (defaultValue.defined(options.data)) {
                // Use supplied EOP data.
                onDataReady(this, options.data);
            } else if (defaultValue.defined(options.url)) {
                var resource = Resource.Resource.createIfNeeded(options.url);

                // Download EOP data.
                var that = this;
                this._downloadPromise = when.when(resource.fetchJson(), function(eopData) {
                    onDataReady(that, eopData);
                }, function() {
                    that._dataError = 'An error occurred while retrieving the EOP data from the URL ' + resource.url + '.';
                });
            } else {
                // Use all zeros for EOP data.
                onDataReady(this, {
                    'columnNames' : ['dateIso8601', 'modifiedJulianDateUtc', 'xPoleWanderRadians', 'yPoleWanderRadians', 'ut1MinusUtcSeconds', 'lengthOfDayCorrectionSeconds', 'xCelestialPoleOffsetRadians', 'yCelestialPoleOffsetRadians', 'taiMinusUtcSeconds'],
                    'samples' : []
                });
            }
        }

        /**
         * A default {@link EarthOrientationParameters} instance that returns zero for all EOP values.
         */
        EarthOrientationParameters.NONE = Object.freeze({
                getPromiseToLoad : function() {
                    return when.when();
                },
                compute : function(date, result) {
                    if (!defaultValue.defined(result)) {
                        result = new EarthOrientationParametersSample(0.0, 0.0, 0.0, 0.0, 0.0);
                    } else {
                        result.xPoleWander = 0.0;
                        result.yPoleWander = 0.0;
                        result.xPoleOffset = 0.0;
                        result.yPoleOffset = 0.0;
                        result.ut1MinusUtc = 0.0;
                    }
                    return result;
                }
        });

        /**
         * Gets a promise that, when resolved, indicates that the EOP data has been loaded and is
         * ready to use.
         *
         * @returns {Promise} The promise.
         *
         * @see when
         */
        EarthOrientationParameters.prototype.getPromiseToLoad = function() {
            return when.when(this._downloadPromise);
        };

        /**
         * Computes the Earth Orientation Parameters (EOP) for a given date by interpolating.
         * If the EOP data has not yet been download, this method returns undefined.
         *
         * @param {JulianDate} date The date for each to evaluate the EOP.
         * @param {EarthOrientationParametersSample} [result] The instance to which to copy the result.
         *        If this parameter is undefined, a new instance is created and returned.
         * @returns {EarthOrientationParametersSample} The EOP evaluated at the given date, or
         *          undefined if the data necessary to evaluate EOP at the date has not yet been
         *          downloaded.
         *
         * @exception {RuntimeError} The loaded EOP data has an error and cannot be used.
         *
         * @see EarthOrientationParameters#getPromiseToLoad
         */
        EarthOrientationParameters.prototype.compute = function(date, result) {
            // We cannot compute until the samples are available.
            if (!defaultValue.defined(this._samples)) {
                if (defaultValue.defined(this._dataError)) {
                    throw new RuntimeError.RuntimeError(this._dataError);
                }

                return undefined;
            }

            if (!defaultValue.defined(result)) {
                result = new EarthOrientationParametersSample(0.0, 0.0, 0.0, 0.0, 0.0);
            }

            if (this._samples.length === 0) {
                result.xPoleWander = 0.0;
                result.yPoleWander = 0.0;
                result.xPoleOffset = 0.0;
                result.yPoleOffset = 0.0;
                result.ut1MinusUtc = 0.0;
                return result;
            }

            var dates = this._dates;
            var lastIndex = this._lastIndex;

            var before = 0;
            var after = 0;
            if (defaultValue.defined(lastIndex)) {
                var previousIndexDate = dates[lastIndex];
                var nextIndexDate = dates[lastIndex + 1];
                var isAfterPrevious = JulianDate.lessThanOrEquals(previousIndexDate, date);
                var isAfterLastSample = !defaultValue.defined(nextIndexDate);
                var isBeforeNext = isAfterLastSample || JulianDate.greaterThanOrEquals(nextIndexDate, date);

                if (isAfterPrevious && isBeforeNext) {
                    before = lastIndex;

                    if (!isAfterLastSample && nextIndexDate.equals(date)) {
                        ++before;
                    }
                    after = before + 1;

                    interpolate(this, dates, this._samples, date, before, after, result);
                    return result;
                }
            }

            var index = binarySearch(dates, date, JulianDate.compare, this._dateColumn);
            if (index >= 0) {
                // If the next entry is the same date, use the later entry.  This way, if two entries
                // describe the same moment, one before a leap second and the other after, then we will use
                // the post-leap second data.
                if (index < dates.length - 1 && dates[index + 1].equals(date)) {
                    ++index;
                }
                before = index;
                after = index;
            } else {
                after = ~index;
                before = after - 1;

                // Use the first entry if the date requested is before the beginning of the data.
                if (before < 0) {
                    before = 0;
                }
            }

            this._lastIndex = before;

            interpolate(this, dates, this._samples, date, before, after, result);
            return result;
        };

        function compareLeapSecondDates(leapSecond, dateToFind) {
            return JulianDate.compare(leapSecond.julianDate, dateToFind);
        }

        function onDataReady(eop, eopData) {
            if (!defaultValue.defined(eopData.columnNames)) {
                eop._dataError = 'Error in loaded EOP data: The columnNames property is required.';
                return;
            }

            if (!defaultValue.defined(eopData.samples)) {
                eop._dataError = 'Error in loaded EOP data: The samples property is required.';
                return;
            }

            var dateColumn = eopData.columnNames.indexOf('modifiedJulianDateUtc');
            var xPoleWanderRadiansColumn = eopData.columnNames.indexOf('xPoleWanderRadians');
            var yPoleWanderRadiansColumn = eopData.columnNames.indexOf('yPoleWanderRadians');
            var ut1MinusUtcSecondsColumn = eopData.columnNames.indexOf('ut1MinusUtcSeconds');
            var xCelestialPoleOffsetRadiansColumn = eopData.columnNames.indexOf('xCelestialPoleOffsetRadians');
            var yCelestialPoleOffsetRadiansColumn = eopData.columnNames.indexOf('yCelestialPoleOffsetRadians');
            var taiMinusUtcSecondsColumn = eopData.columnNames.indexOf('taiMinusUtcSeconds');

            if (dateColumn < 0 || xPoleWanderRadiansColumn < 0 || yPoleWanderRadiansColumn < 0 || ut1MinusUtcSecondsColumn < 0 || xCelestialPoleOffsetRadiansColumn < 0 || yCelestialPoleOffsetRadiansColumn < 0 || taiMinusUtcSecondsColumn < 0) {
                eop._dataError = 'Error in loaded EOP data: The columnNames property must include modifiedJulianDateUtc, xPoleWanderRadians, yPoleWanderRadians, ut1MinusUtcSeconds, xCelestialPoleOffsetRadians, yCelestialPoleOffsetRadians, and taiMinusUtcSeconds columns';
                return;
            }

            var samples = eop._samples = eopData.samples;
            var dates = eop._dates = [];

            eop._dateColumn = dateColumn;
            eop._xPoleWanderRadiansColumn = xPoleWanderRadiansColumn;
            eop._yPoleWanderRadiansColumn = yPoleWanderRadiansColumn;
            eop._ut1MinusUtcSecondsColumn = ut1MinusUtcSecondsColumn;
            eop._xCelestialPoleOffsetRadiansColumn = xCelestialPoleOffsetRadiansColumn;
            eop._yCelestialPoleOffsetRadiansColumn = yCelestialPoleOffsetRadiansColumn;
            eop._taiMinusUtcSecondsColumn = taiMinusUtcSecondsColumn;

            eop._columnCount = eopData.columnNames.length;
            eop._lastIndex = undefined;

            var lastTaiMinusUtc;

            var addNewLeapSeconds = eop._addNewLeapSeconds;

            // Convert the ISO8601 dates to JulianDates.
            for (var i = 0, len = samples.length; i < len; i += eop._columnCount) {
                var mjd = samples[i + dateColumn];
                var taiMinusUtc = samples[i + taiMinusUtcSecondsColumn];
                var day = mjd + TimeConstants$1.MODIFIED_JULIAN_DATE_DIFFERENCE;
                var date = new JulianDate(day, taiMinusUtc, TimeStandard$1.TAI);
                dates.push(date);

                if (addNewLeapSeconds) {
                    if (taiMinusUtc !== lastTaiMinusUtc && defaultValue.defined(lastTaiMinusUtc)) {
                        // We crossed a leap second boundary, so add the leap second
                        // if it does not already exist.
                        var leapSeconds = JulianDate.leapSeconds;
                        var leapSecondIndex = binarySearch(leapSeconds, date, compareLeapSecondDates);
                        if (leapSecondIndex < 0) {
                            var leapSecond = new LeapSecond(date, taiMinusUtc);
                            leapSeconds.splice(~leapSecondIndex, 0, leapSecond);
                        }
                    }
                    lastTaiMinusUtc = taiMinusUtc;
                }
            }
        }

        function fillResultFromIndex(eop, samples, index, columnCount, result) {
            var start = index * columnCount;
            result.xPoleWander = samples[start + eop._xPoleWanderRadiansColumn];
            result.yPoleWander = samples[start + eop._yPoleWanderRadiansColumn];
            result.xPoleOffset = samples[start + eop._xCelestialPoleOffsetRadiansColumn];
            result.yPoleOffset = samples[start + eop._yCelestialPoleOffsetRadiansColumn];
            result.ut1MinusUtc = samples[start + eop._ut1MinusUtcSecondsColumn];
        }

        function linearInterp(dx, y1, y2) {
            return y1 + dx * (y2 - y1);
        }

        function interpolate(eop, dates, samples, date, before, after, result) {
            var columnCount = eop._columnCount;

            // First check the bounds on the EOP data
            // If we are after the bounds of the data, return zeros.
            // The 'before' index should never be less than zero.
            if (after > dates.length - 1) {
                result.xPoleWander = 0;
                result.yPoleWander = 0;
                result.xPoleOffset = 0;
                result.yPoleOffset = 0;
                result.ut1MinusUtc = 0;
                return result;
            }

            var beforeDate = dates[before];
            var afterDate = dates[after];
            if (beforeDate.equals(afterDate) || date.equals(beforeDate)) {
                fillResultFromIndex(eop, samples, before, columnCount, result);
                return result;
            } else if (date.equals(afterDate)) {
                fillResultFromIndex(eop, samples, after, columnCount, result);
                return result;
            }

            var factor = JulianDate.secondsDifference(date, beforeDate) / JulianDate.secondsDifference(afterDate, beforeDate);

            var startBefore = before * columnCount;
            var startAfter = after * columnCount;

            // Handle UT1 leap second edge case
            var beforeUt1MinusUtc = samples[startBefore + eop._ut1MinusUtcSecondsColumn];
            var afterUt1MinusUtc = samples[startAfter + eop._ut1MinusUtcSecondsColumn];

            var offsetDifference = afterUt1MinusUtc - beforeUt1MinusUtc;
            if (offsetDifference > 0.5 || offsetDifference < -0.5) {
                // The absolute difference between the values is more than 0.5, so we may have
                // crossed a leap second.  Check if this is the case and, if so, adjust the
                // afterValue to account for the leap second.  This way, our interpolation will
                // produce reasonable results.
                var beforeTaiMinusUtc = samples[startBefore + eop._taiMinusUtcSecondsColumn];
                var afterTaiMinusUtc = samples[startAfter + eop._taiMinusUtcSecondsColumn];
                if (beforeTaiMinusUtc !== afterTaiMinusUtc) {
                    if (afterDate.equals(date)) {
                        // If we are at the end of the leap second interval, take the second value
                        // Otherwise, the interpolation below will yield the wrong side of the
                        // discontinuity
                        // At the end of the leap second, we need to start accounting for the jump
                        beforeUt1MinusUtc = afterUt1MinusUtc;
                    } else {
                        // Otherwise, remove the leap second so that the interpolation is correct
                        afterUt1MinusUtc -= afterTaiMinusUtc - beforeTaiMinusUtc;
                    }
                }
            }

            result.xPoleWander = linearInterp(factor, samples[startBefore + eop._xPoleWanderRadiansColumn], samples[startAfter + eop._xPoleWanderRadiansColumn]);
            result.yPoleWander = linearInterp(factor, samples[startBefore + eop._yPoleWanderRadiansColumn], samples[startAfter + eop._yPoleWanderRadiansColumn]);
            result.xPoleOffset = linearInterp(factor, samples[startBefore + eop._xCelestialPoleOffsetRadiansColumn], samples[startAfter + eop._xCelestialPoleOffsetRadiansColumn]);
            result.yPoleOffset = linearInterp(factor, samples[startBefore + eop._yCelestialPoleOffsetRadiansColumn], samples[startAfter + eop._yCelestialPoleOffsetRadiansColumn]);
            result.ut1MinusUtc = linearInterp(factor, beforeUt1MinusUtc, afterUt1MinusUtc);
            return result;
        }

    /**
         * A rotation expressed as a heading, pitch, and roll. Heading is the rotation about the
         * negative z axis. Pitch is the rotation about the negative y axis. Roll is the rotation about
         * the positive x axis.
         * @alias HeadingPitchRoll
         * @constructor
         *
         * @param {Number} [heading=0.0] The heading component in radians.
         * @param {Number} [pitch=0.0] The pitch component in radians.
         * @param {Number} [roll=0.0] The roll component in radians.
         */
        function HeadingPitchRoll(heading, pitch, roll) {
            this.heading = defaultValue.defaultValue(heading, 0.0);
            this.pitch = defaultValue.defaultValue(pitch, 0.0);
            this.roll = defaultValue.defaultValue(roll, 0.0);
        }

        /**
         * Computes the heading, pitch and roll from a quaternion (see http://en.wikipedia.org/wiki/Conversion_between_quaternions_and_Euler_angles )
         *
         * @param {Quaternion} quaternion The quaternion from which to retrieve heading, pitch, and roll, all expressed in radians.
         * @param {HeadingPitchRoll} [result] The object in which to store the result. If not provided, a new instance is created and returned.
         * @returns {HeadingPitchRoll} The modified result parameter or a new HeadingPitchRoll instance if one was not provided.
         */
        HeadingPitchRoll.fromQuaternion = function(quaternion, result) {
            //>>includeStart('debug', pragmas.debug);
            if (!defaultValue.defined(quaternion)) {
                throw new Check.DeveloperError('quaternion is required');
            }
            //>>includeEnd('debug');
            if (!defaultValue.defined(result)) {
                result = new HeadingPitchRoll();
            }
            var test = 2 * (quaternion.w * quaternion.y - quaternion.z * quaternion.x);
            var denominatorRoll = 1 - 2 * (quaternion.x * quaternion.x + quaternion.y * quaternion.y);
            var numeratorRoll = 2 * (quaternion.w * quaternion.x + quaternion.y * quaternion.z);
            var denominatorHeading = 1 - 2 * (quaternion.y * quaternion.y + quaternion.z * quaternion.z);
            var numeratorHeading = 2 * (quaternion.w * quaternion.z + quaternion.x * quaternion.y);
            result.heading = -Math.atan2(numeratorHeading, denominatorHeading);
            result.roll = Math.atan2(numeratorRoll, denominatorRoll);
            result.pitch = -_Math.CesiumMath.asinClamped(test);
            return result;
        };

        /**
         * Returns a new HeadingPitchRoll instance from angles given in degrees.
         *
         * @param {Number} heading the heading in degrees
         * @param {Number} pitch the pitch in degrees
         * @param {Number} roll the heading in degrees
         * @param {HeadingPitchRoll} [result] The object in which to store the result. If not provided, a new instance is created and returned.
         * @returns {HeadingPitchRoll} A new HeadingPitchRoll instance
         */
        HeadingPitchRoll.fromDegrees = function(heading, pitch, roll, result) {
            //>>includeStart('debug', pragmas.debug);
            if (!defaultValue.defined(heading)) {
                throw new Check.DeveloperError('heading is required');
            }
            if (!defaultValue.defined(pitch)) {
                throw new Check.DeveloperError('pitch is required');
            }
            if (!defaultValue.defined(roll)) {
                throw new Check.DeveloperError('roll is required');
            }
            //>>includeEnd('debug');
            if (!defaultValue.defined(result)) {
                result = new HeadingPitchRoll();
            }
            result.heading = heading * _Math.CesiumMath.RADIANS_PER_DEGREE;
            result.pitch = pitch * _Math.CesiumMath.RADIANS_PER_DEGREE;
            result.roll = roll * _Math.CesiumMath.RADIANS_PER_DEGREE;
            return result;
        };

        /**
         * Duplicates a HeadingPitchRoll instance.
         *
         * @param {HeadingPitchRoll} headingPitchRoll The HeadingPitchRoll to duplicate.
         * @param {HeadingPitchRoll} [result] The object onto which to store the result.
         * @returns {HeadingPitchRoll} The modified result parameter or a new HeadingPitchRoll instance if one was not provided. (Returns undefined if headingPitchRoll is undefined)
         */
        HeadingPitchRoll.clone = function(headingPitchRoll, result) {
            if (!defaultValue.defined(headingPitchRoll)) {
                return undefined;
            }
            if (!defaultValue.defined(result)) {
                return new HeadingPitchRoll(headingPitchRoll.heading, headingPitchRoll.pitch, headingPitchRoll.roll);
            }
            result.heading = headingPitchRoll.heading;
            result.pitch = headingPitchRoll.pitch;
            result.roll = headingPitchRoll.roll;
            return result;
        };

        /**
         * Compares the provided HeadingPitchRolls componentwise and returns
         * <code>true</code> if they are equal, <code>false</code> otherwise.
         *
         * @param {HeadingPitchRoll} [left] The first HeadingPitchRoll.
         * @param {HeadingPitchRoll} [right] The second HeadingPitchRoll.
         * @returns {Boolean} <code>true</code> if left and right are equal, <code>false</code> otherwise.
         */
        HeadingPitchRoll.equals = function(left, right) {
            return (left === right) ||
                ((defaultValue.defined(left)) &&
                    (defaultValue.defined(right)) &&
                    (left.heading === right.heading) &&
                    (left.pitch === right.pitch) &&
                    (left.roll === right.roll));
        };

        /**
         * Compares the provided HeadingPitchRolls componentwise and returns
         * <code>true</code> if they pass an absolute or relative tolerance test,
         * <code>false</code> otherwise.
         *
         * @param {HeadingPitchRoll} [left] The first HeadingPitchRoll.
         * @param {HeadingPitchRoll} [right] The second HeadingPitchRoll.
         * @param {Number} relativeEpsilon The relative epsilon tolerance to use for equality testing.
         * @param {Number} [absoluteEpsilon=relativeEpsilon] The absolute epsilon tolerance to use for equality testing.
         * @returns {Boolean} <code>true</code> if left and right are within the provided epsilon, <code>false</code> otherwise.
         */
        HeadingPitchRoll.equalsEpsilon = function(left, right, relativeEpsilon, absoluteEpsilon) {
            return (left === right) ||
                (defaultValue.defined(left) &&
                    defaultValue.defined(right) &&
                    _Math.CesiumMath.equalsEpsilon(left.heading, right.heading, relativeEpsilon, absoluteEpsilon) &&
                    _Math.CesiumMath.equalsEpsilon(left.pitch, right.pitch, relativeEpsilon, absoluteEpsilon) &&
                    _Math.CesiumMath.equalsEpsilon(left.roll, right.roll, relativeEpsilon, absoluteEpsilon));
        };

        /**
         * Duplicates this HeadingPitchRoll instance.
         *
         * @param {HeadingPitchRoll} [result] The object onto which to store the result.
         * @returns {HeadingPitchRoll} The modified result parameter or a new HeadingPitchRoll instance if one was not provided.
         */
        HeadingPitchRoll.prototype.clone = function(result) {
            return HeadingPitchRoll.clone(this, result);
        };

        /**
         * Compares this HeadingPitchRoll against the provided HeadingPitchRoll componentwise and returns
         * <code>true</code> if they are equal, <code>false</code> otherwise.
         *
         * @param {HeadingPitchRoll} [right] The right hand side HeadingPitchRoll.
         * @returns {Boolean} <code>true</code> if they are equal, <code>false</code> otherwise.
         */
        HeadingPitchRoll.prototype.equals = function(right) {
            return HeadingPitchRoll.equals(this, right);
        };

        /**
         * Compares this HeadingPitchRoll against the provided HeadingPitchRoll componentwise and returns
         * <code>true</code> if they pass an absolute or relative tolerance test,
         * <code>false</code> otherwise.
         *
         * @param {HeadingPitchRoll} [right] The right hand side HeadingPitchRoll.
         * @param {Number} relativeEpsilon The relative epsilon tolerance to use for equality testing.
         * @param {Number} [absoluteEpsilon=relativeEpsilon] The absolute epsilon tolerance to use for equality testing.
         * @returns {Boolean} <code>true</code> if they are within the provided epsilon, <code>false</code> otherwise.
         */
        HeadingPitchRoll.prototype.equalsEpsilon = function(right, relativeEpsilon, absoluteEpsilon) {
            return HeadingPitchRoll.equalsEpsilon(this, right, relativeEpsilon, absoluteEpsilon);
        };

        /**
         * Creates a string representing this HeadingPitchRoll in the format '(heading, pitch, roll)' in radians.
         *
         * @returns {String} A string representing the provided HeadingPitchRoll in the format '(heading, pitch, roll)'.
         */
        HeadingPitchRoll.prototype.toString = function() {
            return '(' + this.heading + ', ' + this.pitch + ', ' + this.roll + ')';
        };

    /*global CESIUM_BASE_URL*/

        var cesiumScriptRegex = /((?:.*\/)|^)Cesium\.js$/;
        function getBaseUrlFromCesiumScript() {
            var scripts = document.getElementsByTagName('script');
            for ( var i = 0, len = scripts.length; i < len; ++i) {
                var src = scripts[i].getAttribute('src');
                var result = cesiumScriptRegex.exec(src);
                if (result !== null) {
                    return result[1];
                }
            }
            return undefined;
        }

        var a;
        function tryMakeAbsolute(url) {
            if (typeof document === 'undefined') {
                //Node.js and Web Workers. In both cases, the URL will already be absolute.
                return url;
            }

            if (!defaultValue.defined(a)) {
                a = document.createElement('a');
            }
            a.href = url;

            // IE only absolutizes href on get, not set
            a.href = a.href; // eslint-disable-line no-self-assign
            return a.href;
        }

        var baseResource;
        function getCesiumBaseUrl() {
            if (defaultValue.defined(baseResource)) {
                return baseResource;
            }

            var baseUrlString;
            if (typeof CESIUM_BASE_URL !== 'undefined') {
                baseUrlString = CESIUM_BASE_URL;
            } else if (typeof define === 'object' && defaultValue.defined(define.amd) && !define.amd.toUrlUndefined && defaultValue.defined(require.toUrl)) {
                baseUrlString = Resource.getAbsoluteUri('..', buildModuleUrl('Core/buildModuleUrl.js'));
            } else {
                baseUrlString = getBaseUrlFromCesiumScript();
            }

            //>>includeStart('debug', pragmas.debug);
            if (!defaultValue.defined(baseUrlString)) {
                throw new Check.DeveloperError('Unable to determine Cesium base URL automatically, try defining a global variable called CESIUM_BASE_URL.');
            }
            //>>includeEnd('debug');

            baseResource = new Resource.Resource({
                url: tryMakeAbsolute(baseUrlString)
            });
            baseResource.appendForwardSlash();

            return baseResource;
        }

        function buildModuleUrlFromRequireToUrl(moduleID) {
            //moduleID will be non-relative, so require it relative to this module, in Core.
            return tryMakeAbsolute(require.toUrl('../' + moduleID));
        }

        function buildModuleUrlFromBaseUrl(moduleID) {
            var resource = getCesiumBaseUrl().getDerivedResource({
                url: moduleID
            });
            return resource.url;
        }

        var implementation;

        /**
         * Given a non-relative moduleID, returns an absolute URL to the file represented by that module ID,
         * using, in order of preference, require.toUrl, the value of a global CESIUM_BASE_URL, or
         * the base URL of the Cesium.js script.
         *
         * @private
         */
        function buildModuleUrl(moduleID) {
            if (!defaultValue.defined(implementation)) {
                //select implementation
                if (typeof define === 'object' && defaultValue.defined(define.amd) && !define.amd.toUrlUndefined && defaultValue.defined(require.toUrl)) {
                    implementation = buildModuleUrlFromRequireToUrl;
                } else {
                    implementation = buildModuleUrlFromBaseUrl;
                }
            }

            var url = implementation(moduleID);
            return url;
        }

        // exposed for testing
        buildModuleUrl._cesiumScriptRegex = cesiumScriptRegex;
        buildModuleUrl._buildModuleUrlFromBaseUrl = buildModuleUrlFromBaseUrl;
        buildModuleUrl._clearBaseResource = function() {
            baseResource = undefined;
        };

        /**
         * Sets the base URL for resolving modules.
         * @param {String} value The new base URL.
         */
        buildModuleUrl.setBaseUrl = function(value) {
            baseResource = Resource.Resource.DEFAULT.getDerivedResource({
                url: value
            });
        };

        /**
         * Gets the base URL for resolving modules.
         */
        buildModuleUrl.getCesiumBaseUrl = getCesiumBaseUrl;

    /**
         * An IAU 2006 XYS value sampled at a particular time.
         *
         * @alias Iau2006XysSample
         * @constructor
         *
         * @param {Number} x The X value.
         * @param {Number} y The Y value.
         * @param {Number} s The S value.
         *
         * @private
         */
        function Iau2006XysSample(x, y, s) {
            /**
             * The X value.
             * @type {Number}
             */
            this.x = x;

            /**
             * The Y value.
             * @type {Number}
             */
            this.y = y;

            /**
             * The S value.
             * @type {Number}
             */
            this.s = s;
        }

    /**
         * A set of IAU2006 XYS data that is used to evaluate the transformation between the International
         * Celestial Reference Frame (ICRF) and the International Terrestrial Reference Frame (ITRF).
         *
         * @alias Iau2006XysData
         * @constructor
         *
         * @param {Object} [options] Object with the following properties:
         * @param {Resource|String} [options.xysFileUrlTemplate='Assets/IAU2006_XYS/IAU2006_XYS_{0}.json'] A template URL for obtaining the XYS data.  In the template,
         *                 `{0}` will be replaced with the file index.
         * @param {Number} [options.interpolationOrder=9] The order of interpolation to perform on the XYS data.
         * @param {Number} [options.sampleZeroJulianEphemerisDate=2442396.5] The Julian ephemeris date (JED) of the
         *                 first XYS sample.
         * @param {Number} [options.stepSizeDays=1.0] The step size, in days, between successive XYS samples.
         * @param {Number} [options.samplesPerXysFile=1000] The number of samples in each XYS file.
         * @param {Number} [options.totalSamples=27426] The total number of samples in all XYS files.
         *
         * @private
         */
        function Iau2006XysData(options) {
            options = defaultValue.defaultValue(options, defaultValue.defaultValue.EMPTY_OBJECT);

            this._xysFileUrlTemplate = Resource.Resource.createIfNeeded(options.xysFileUrlTemplate);
            this._interpolationOrder = defaultValue.defaultValue(options.interpolationOrder, 9);
            this._sampleZeroJulianEphemerisDate = defaultValue.defaultValue(options.sampleZeroJulianEphemerisDate, 2442396.5);
            this._sampleZeroDateTT = new JulianDate(this._sampleZeroJulianEphemerisDate, 0.0, TimeStandard$1.TAI);
            this._stepSizeDays = defaultValue.defaultValue(options.stepSizeDays, 1.0);
            this._samplesPerXysFile = defaultValue.defaultValue(options.samplesPerXysFile, 1000);
            this._totalSamples = defaultValue.defaultValue(options.totalSamples, 27426);
            this._samples = new Array(this._totalSamples * 3);
            this._chunkDownloadsInProgress = [];

            var order = this._interpolationOrder;

            // Compute denominators and X values for interpolation.
            var denom = this._denominators = new Array(order + 1);
            var xTable = this._xTable = new Array(order + 1);

            var stepN = Math.pow(this._stepSizeDays, order);

            for ( var i = 0; i <= order; ++i) {
                denom[i] = stepN;
                xTable[i] = i * this._stepSizeDays;

                for ( var j = 0; j <= order; ++j) {
                    if (j !== i) {
                        denom[i] *= (i - j);
                    }
                }

                denom[i] = 1.0 / denom[i];
            }

            // Allocate scratch arrays for interpolation.
            this._work = new Array(order + 1);
            this._coef = new Array(order + 1);
        }

        var julianDateScratch = new JulianDate(0, 0.0, TimeStandard$1.TAI);

        function getDaysSinceEpoch(xys, dayTT, secondTT) {
            var dateTT = julianDateScratch;
            dateTT.dayNumber = dayTT;
            dateTT.secondsOfDay = secondTT;
            return JulianDate.daysDifference(dateTT, xys._sampleZeroDateTT);
        }

        /**
         * Preloads XYS data for a specified date range.
         *
         * @param {Number} startDayTT The Julian day number of the beginning of the interval to preload, expressed in
         *                 the Terrestrial Time (TT) time standard.
         * @param {Number} startSecondTT The seconds past noon of the beginning of the interval to preload, expressed in
         *                 the Terrestrial Time (TT) time standard.
         * @param {Number} stopDayTT The Julian day number of the end of the interval to preload, expressed in
         *                 the Terrestrial Time (TT) time standard.
         * @param {Number} stopSecondTT The seconds past noon of the end of the interval to preload, expressed in
         *                 the Terrestrial Time (TT) time standard.
         * @returns {Promise} A promise that, when resolved, indicates that the requested interval has been
         *                    preloaded.
         */
        Iau2006XysData.prototype.preload = function(startDayTT, startSecondTT, stopDayTT, stopSecondTT) {
            var startDaysSinceEpoch = getDaysSinceEpoch(this, startDayTT, startSecondTT);
            var stopDaysSinceEpoch = getDaysSinceEpoch(this, stopDayTT, stopSecondTT);

            var startIndex = (startDaysSinceEpoch / this._stepSizeDays - this._interpolationOrder / 2) | 0;
            if (startIndex < 0) {
                startIndex = 0;
            }

            var stopIndex = (stopDaysSinceEpoch / this._stepSizeDays - this._interpolationOrder / 2) | 0 + this._interpolationOrder;
            if (stopIndex >= this._totalSamples) {
                stopIndex = this._totalSamples - 1;
            }

            var startChunk = (startIndex / this._samplesPerXysFile) | 0;
            var stopChunk = (stopIndex / this._samplesPerXysFile) | 0;

            var promises = [];
            for ( var i = startChunk; i <= stopChunk; ++i) {
                promises.push(requestXysChunk(this, i));
            }

            return when.when.all(promises);
        };

        /**
         * Computes the XYS values for a given date by interpolating.  If the required data is not yet downloaded,
         * this method will return undefined.
         *
         * @param {Number} dayTT The Julian day number for which to compute the XYS value, expressed in
         *                 the Terrestrial Time (TT) time standard.
         * @param {Number} secondTT The seconds past noon of the date for which to compute the XYS value, expressed in
         *                 the Terrestrial Time (TT) time standard.
         * @param {Iau2006XysSample} [result] The instance to which to copy the interpolated result.  If this parameter
         *                           is undefined, a new instance is allocated and returned.
         * @returns {Iau2006XysSample} The interpolated XYS values, or undefined if the required data for this
         *                             computation has not yet been downloaded.
         *
         * @see Iau2006XysData#preload
         */
        Iau2006XysData.prototype.computeXysRadians = function(dayTT, secondTT, result) {
            var daysSinceEpoch = getDaysSinceEpoch(this, dayTT, secondTT);
            if (daysSinceEpoch < 0.0) {
                // Can't evaluate prior to the epoch of the data.
                return undefined;
            }

            var centerIndex = (daysSinceEpoch / this._stepSizeDays) | 0;
            if (centerIndex >= this._totalSamples) {
                // Can't evaluate after the last sample in the data.
                return undefined;
            }

            var degree = this._interpolationOrder;

            var firstIndex = centerIndex - ((degree / 2) | 0);
            if (firstIndex < 0) {
                firstIndex = 0;
            }
            var lastIndex = firstIndex + degree;
            if (lastIndex >= this._totalSamples) {
                lastIndex = this._totalSamples - 1;
                firstIndex = lastIndex - degree;
                if (firstIndex < 0) {
                    firstIndex = 0;
                }
            }

            // Are all the samples we need present?
            // We can assume so if the first and last are present
            var isDataMissing = false;
            var samples = this._samples;
            if (!defaultValue.defined(samples[firstIndex * 3])) {
                requestXysChunk(this, (firstIndex / this._samplesPerXysFile) | 0);
                isDataMissing = true;
            }

            if (!defaultValue.defined(samples[lastIndex * 3])) {
                requestXysChunk(this, (lastIndex / this._samplesPerXysFile) | 0);
                isDataMissing = true;
            }

            if (isDataMissing) {
                return undefined;
            }

            if (!defaultValue.defined(result)) {
                result = new Iau2006XysSample(0.0, 0.0, 0.0);
            } else {
                result.x = 0.0;
                result.y = 0.0;
                result.s = 0.0;
            }

            var x = daysSinceEpoch - firstIndex * this._stepSizeDays;

            var work = this._work;
            var denom = this._denominators;
            var coef = this._coef;
            var xTable = this._xTable;

            var i, j;
            for (i = 0; i <= degree; ++i) {
                work[i] = x - xTable[i];
            }

            for (i = 0; i <= degree; ++i) {
                coef[i] = 1.0;

                for (j = 0; j <= degree; ++j) {
                    if (j !== i) {
                        coef[i] *= work[j];
                    }
                }

                coef[i] *= denom[i];

                var sampleIndex = (firstIndex + i) * 3;
                result.x += coef[i] * samples[sampleIndex++];
                result.y += coef[i] * samples[sampleIndex++];
                result.s += coef[i] * samples[sampleIndex];
            }

            return result;
        };

        function requestXysChunk(xysData, chunkIndex) {
            if (xysData._chunkDownloadsInProgress[chunkIndex]) {
                // Chunk has already been requested.
                return xysData._chunkDownloadsInProgress[chunkIndex];
            }

            var deferred = when.when.defer();

            xysData._chunkDownloadsInProgress[chunkIndex] = deferred;

            var chunkUrl;
            var xysFileUrlTemplate = xysData._xysFileUrlTemplate;
            if (defaultValue.defined(xysFileUrlTemplate)) {
                chunkUrl = xysFileUrlTemplate.getDerivedResource({
                    templateValues: {
                        '0': chunkIndex
                    }
                });
            } else {
                chunkUrl = new Resource.Resource({
                    url : buildModuleUrl('Assets/IAU2006_XYS/IAU2006_XYS_' + chunkIndex + '.json')
                });
            }

            when.when(chunkUrl.fetchJson(), function(chunk) {
                xysData._chunkDownloadsInProgress[chunkIndex] = false;

                var samples = xysData._samples;
                var newSamples = chunk.samples;
                var startIndex = chunkIndex * xysData._samplesPerXysFile * 3;

                for ( var i = 0, len = newSamples.length; i < len; ++i) {
                    samples[startIndex + i] = newSamples[i];
                }

                deferred.resolve();
            });

            return deferred.promise;
        }

    /**
         * Contains functions for transforming positions to various reference frames.
         *
         * @exports Transforms
         * @namespace
         */
        var Transforms = {};

        var vectorProductLocalFrame = {
            up : {
                south : 'east',
                north : 'west',
                west : 'south',
                east : 'north'
            },
            down : {
                south : 'west',
                north : 'east',
                west : 'north',
                east : 'south'
            },
            south : {
                up : 'west',
                down : 'east',
                west : 'down',
                east : 'up'
            },
            north : {
                up : 'east',
                down : 'west',
                west : 'up',
                east : 'down'
            },
            west : {
                up : 'north',
                down : 'south',
                north : 'down',
                south : 'up'
            },
            east : {
                up : 'south',
                down : 'north',
                north : 'up',
                south : 'down'
            }
        };

        var degeneratePositionLocalFrame = {
            north : [-1, 0, 0],
            east : [0, 1, 0],
            up : [0, 0, 1],
            south : [1, 0, 0],
            west : [0, -1, 0],
            down : [0, 0, -1]
        };

        var localFrameToFixedFrameCache = {};

        var scratchCalculateCartesian = {
            east : new Cartesian2.Cartesian3(),
            north : new Cartesian2.Cartesian3(),
            up : new Cartesian2.Cartesian3(),
            west : new Cartesian2.Cartesian3(),
            south : new Cartesian2.Cartesian3(),
            down : new Cartesian2.Cartesian3()
        };
        var scratchFirstCartesian = new Cartesian2.Cartesian3();
        var scratchSecondCartesian = new Cartesian2.Cartesian3();
        var scratchThirdCartesian = new Cartesian2.Cartesian3();
        /**
        * Generates a function that computes a 4x4 transformation matrix from a reference frame
        * centered at the provided origin to the provided ellipsoid's fixed reference frame.
        * @param  {String} firstAxis  name of the first axis of the local reference frame. Must be
        *  'east', 'north', 'up', 'west', 'south' or 'down'.
        * @param  {String} secondAxis  name of the second axis of the local reference frame. Must be
        *  'east', 'north', 'up', 'west', 'south' or 'down'.
        * @return {localFrameToFixedFrameGenerator~resultat} The function that will computes a
        * 4x4 transformation matrix from a reference frame, with first axis and second axis compliant with the parameters,
        */
        Transforms.localFrameToFixedFrameGenerator = function (firstAxis, secondAxis) {
            if (!vectorProductLocalFrame.hasOwnProperty(firstAxis) || !vectorProductLocalFrame[firstAxis].hasOwnProperty(secondAxis)) {
                throw new Check.DeveloperError('firstAxis and secondAxis must be east, north, up, west, south or down.');
            }
            var thirdAxis = vectorProductLocalFrame[firstAxis][secondAxis];

            /**
             * Computes a 4x4 transformation matrix from a reference frame
             * centered at the provided origin to the provided ellipsoid's fixed reference frame.
             * @callback Transforms~LocalFrameToFixedFrame
             * @param {Cartesian3} origin The center point of the local reference frame.
             * @param {Ellipsoid} [ellipsoid=Ellipsoid.WGS84] The ellipsoid whose fixed frame is used in the transformation.
             * @param {Matrix4} [result] The object onto which to store the result.
             * @returns {Matrix4} The modified result parameter or a new Matrix4 instance if none was provided.
             */
            var resultat;
            var hashAxis = firstAxis + secondAxis;
            if (defaultValue.defined(localFrameToFixedFrameCache[hashAxis])) {
                resultat = localFrameToFixedFrameCache[hashAxis];
            } else {
                resultat = function (origin, ellipsoid, result) {
                    //>>includeStart('debug', pragmas.debug);
                    if (!defaultValue.defined(origin)) {
                        throw new Check.DeveloperError('origin is required.');
                    }
                    //>>includeEnd('debug');
                    if (!defaultValue.defined(result)) {
                        result = new Matrix4();
                    }
                    if (Cartesian2.Cartesian3.equalsEpsilon(origin, Cartesian2.Cartesian3.ZERO, _Math.CesiumMath.EPSILON14)) {
                        // If x, y, and z are zero, use the degenerate local frame, which is a special case
                        Cartesian2.Cartesian3.unpack(degeneratePositionLocalFrame[firstAxis], 0, scratchFirstCartesian);
                        Cartesian2.Cartesian3.unpack(degeneratePositionLocalFrame[secondAxis], 0, scratchSecondCartesian);
                        Cartesian2.Cartesian3.unpack(degeneratePositionLocalFrame[thirdAxis], 0, scratchThirdCartesian);
                    } else if (_Math.CesiumMath.equalsEpsilon(origin.x, 0.0, _Math.CesiumMath.EPSILON14) && _Math.CesiumMath.equalsEpsilon(origin.y, 0.0, _Math.CesiumMath.EPSILON14)) {
                        // If x and y are zero, assume origin is at a pole, which is a special case.
                        var sign = _Math.CesiumMath.sign(origin.z);

                        Cartesian2.Cartesian3.unpack(degeneratePositionLocalFrame[firstAxis], 0, scratchFirstCartesian);
                        if (firstAxis !== 'east' && firstAxis !== 'west') {
                            Cartesian2.Cartesian3.multiplyByScalar(scratchFirstCartesian, sign, scratchFirstCartesian);
                        }

                        Cartesian2.Cartesian3.unpack(degeneratePositionLocalFrame[secondAxis], 0, scratchSecondCartesian);
                        if (secondAxis !== 'east' && secondAxis !== 'west') {
                            Cartesian2.Cartesian3.multiplyByScalar(scratchSecondCartesian, sign, scratchSecondCartesian);
                        }

                        Cartesian2.Cartesian3.unpack(degeneratePositionLocalFrame[thirdAxis], 0, scratchThirdCartesian);
                        if (thirdAxis !== 'east' && thirdAxis !== 'west') {
                            Cartesian2.Cartesian3.multiplyByScalar(scratchThirdCartesian, sign, scratchThirdCartesian);
                        }
                    } else {
                        ellipsoid = defaultValue.defaultValue(ellipsoid, Cartesian2.Ellipsoid.WGS84);
                        ellipsoid.geodeticSurfaceNormal(origin, scratchCalculateCartesian.up);

                        var up = scratchCalculateCartesian.up;
                        var east = scratchCalculateCartesian.east;
                        east.x = -origin.y;
                        east.y = origin.x;
                        east.z = 0.0;
                        Cartesian2.Cartesian3.normalize(east, scratchCalculateCartesian.east);
                        Cartesian2.Cartesian3.cross(up, east, scratchCalculateCartesian.north);

                        Cartesian2.Cartesian3.multiplyByScalar(scratchCalculateCartesian.up, -1, scratchCalculateCartesian.down);
                        Cartesian2.Cartesian3.multiplyByScalar(scratchCalculateCartesian.east, -1, scratchCalculateCartesian.west);
                        Cartesian2.Cartesian3.multiplyByScalar(scratchCalculateCartesian.north, -1, scratchCalculateCartesian.south);

                        scratchFirstCartesian = scratchCalculateCartesian[firstAxis];
                        scratchSecondCartesian = scratchCalculateCartesian[secondAxis];
                        scratchThirdCartesian = scratchCalculateCartesian[thirdAxis];
                    }
                    result[0] = scratchFirstCartesian.x;
                    result[1] = scratchFirstCartesian.y;
                    result[2] = scratchFirstCartesian.z;
                    result[3] = 0.0;
                    result[4] = scratchSecondCartesian.x;
                    result[5] = scratchSecondCartesian.y;
                    result[6] = scratchSecondCartesian.z;
                    result[7] = 0.0;
                    result[8] = scratchThirdCartesian.x;
                    result[9] = scratchThirdCartesian.y;
                    result[10] = scratchThirdCartesian.z;
                    result[11] = 0.0;
                    result[12] = origin.x;
                    result[13] = origin.y;
                    result[14] = origin.z;
                    result[15] = 1.0;
                    return result;
                };
                localFrameToFixedFrameCache[hashAxis] = resultat;
            }
            return resultat;
        };

        /**
         * Computes a 4x4 transformation matrix from a reference frame with an east-north-up axes
         * centered at the provided origin to the provided ellipsoid's fixed reference frame.
         * The local axes are defined as:
         * <ul>
         * <li>The <code>x</code> axis points in the local east direction.</li>
         * <li>The <code>y</code> axis points in the local north direction.</li>
         * <li>The <code>z</code> axis points in the direction of the ellipsoid surface normal which passes through the position.</li>
         * </ul>
         *
         * @function
         * @param {Cartesian3} origin The center point of the local reference frame.
         * @param {Ellipsoid} [ellipsoid=Ellipsoid.WGS84] The ellipsoid whose fixed frame is used in the transformation.
         * @param {Matrix4} [result] The object onto which to store the result.
         * @returns {Matrix4} The modified result parameter or a new Matrix4 instance if none was provided.
         *
         * @example
         * // Get the transform from local east-north-up at cartographic (0.0, 0.0) to Earth's fixed frame.
         * var center = Cesium.Cartesian3.fromDegrees(0.0, 0.0);
         * var transform = Cesium.Transforms.eastNorthUpToFixedFrame(center);
         */
        Transforms.eastNorthUpToFixedFrame = Transforms.localFrameToFixedFrameGenerator('east','north');

        /**
         * Computes a 4x4 transformation matrix from a reference frame with an north-east-down axes
         * centered at the provided origin to the provided ellipsoid's fixed reference frame.
         * The local axes are defined as:
         * <ul>
         * <li>The <code>x</code> axis points in the local north direction.</li>
         * <li>The <code>y</code> axis points in the local east direction.</li>
         * <li>The <code>z</code> axis points in the opposite direction of the ellipsoid surface normal which passes through the position.</li>
         * </ul>
         *
         * @function
         * @param {Cartesian3} origin The center point of the local reference frame.
         * @param {Ellipsoid} [ellipsoid=Ellipsoid.WGS84] The ellipsoid whose fixed frame is used in the transformation.
         * @param {Matrix4} [result] The object onto which to store the result.
         * @returns {Matrix4} The modified result parameter or a new Matrix4 instance if none was provided.
         *
         * @example
         * // Get the transform from local north-east-down at cartographic (0.0, 0.0) to Earth's fixed frame.
         * var center = Cesium.Cartesian3.fromDegrees(0.0, 0.0);
         * var transform = Cesium.Transforms.northEastDownToFixedFrame(center);
         */
        Transforms.northEastDownToFixedFrame = Transforms.localFrameToFixedFrameGenerator('north','east');

        /**
         * Computes a 4x4 transformation matrix from a reference frame with an north-up-east axes
         * centered at the provided origin to the provided ellipsoid's fixed reference frame.
         * The local axes are defined as:
         * <ul>
         * <li>The <code>x</code> axis points in the local north direction.</li>
         * <li>The <code>y</code> axis points in the direction of the ellipsoid surface normal which passes through the position.</li>
         * <li>The <code>z</code> axis points in the local east direction.</li>
         * </ul>
         *
         * @function
         * @param {Cartesian3} origin The center point of the local reference frame.
         * @param {Ellipsoid} [ellipsoid=Ellipsoid.WGS84] The ellipsoid whose fixed frame is used in the transformation.
         * @param {Matrix4} [result] The object onto which to store the result.
         * @returns {Matrix4} The modified result parameter or a new Matrix4 instance if none was provided.
         *
         * @example
         * // Get the transform from local north-up-east at cartographic (0.0, 0.0) to Earth's fixed frame.
         * var center = Cesium.Cartesian3.fromDegrees(0.0, 0.0);
         * var transform = Cesium.Transforms.northUpEastToFixedFrame(center);
         */
        Transforms.northUpEastToFixedFrame = Transforms.localFrameToFixedFrameGenerator('north','up');

        /**
         * Computes a 4x4 transformation matrix from a reference frame with an north-west-up axes
         * centered at the provided origin to the provided ellipsoid's fixed reference frame.
         * The local axes are defined as:
         * <ul>
         * <li>The <code>x</code> axis points in the local north direction.</li>
         * <li>The <code>y</code> axis points in the local west direction.</li>
         * <li>The <code>z</code> axis points in the direction of the ellipsoid surface normal which passes through the position.</li>
         * </ul>
         *
         * @function
         * @param {Cartesian3} origin The center point of the local reference frame.
         * @param {Ellipsoid} [ellipsoid=Ellipsoid.WGS84] The ellipsoid whose fixed frame is used in the transformation.
         * @param {Matrix4} [result] The object onto which to store the result.
         * @returns {Matrix4} The modified result parameter or a new Matrix4 instance if none was provided.
         *
          * @example
         * // Get the transform from local north-West-Up at cartographic (0.0, 0.0) to Earth's fixed frame.
         * var center = Cesium.Cartesian3.fromDegrees(0.0, 0.0);
         * var transform = Cesium.Transforms.northWestUpToFixedFrame(center);
         */
        Transforms.northWestUpToFixedFrame = Transforms.localFrameToFixedFrameGenerator('north','west');

        var scratchHPRQuaternion = new Quaternion();
        var scratchScale = new Cartesian2.Cartesian3(1.0, 1.0, 1.0);
        var scratchHPRMatrix4 = new Matrix4();

        /**
         * Computes a 4x4 transformation matrix from a reference frame with axes computed from the heading-pitch-roll angles
         * centered at the provided origin to the provided ellipsoid's fixed reference frame. Heading is the rotation from the local north
         * direction where a positive angle is increasing eastward. Pitch is the rotation from the local east-north plane. Positive pitch angles
         * are above the plane. Negative pitch angles are below the plane. Roll is the first rotation applied about the local east axis.
         *
         * @param {Cartesian3} origin The center point of the local reference frame.
         * @param {HeadingPitchRoll} headingPitchRoll The heading, pitch, and roll.
         * @param {Ellipsoid} [ellipsoid=Ellipsoid.WGS84] The ellipsoid whose fixed frame is used in the transformation.
         * @param {Transforms~LocalFrameToFixedFrame} [fixedFrameTransform=Transforms.eastNorthUpToFixedFrame] A 4x4 transformation
         *  matrix from a reference frame to the provided ellipsoid's fixed reference frame
         * @param {Matrix4} [result] The object onto which to store the result.
         * @returns {Matrix4} The modified result parameter or a new Matrix4 instance if none was provided.
         *
         * @example
         * // Get the transform from local heading-pitch-roll at cartographic (0.0, 0.0) to Earth's fixed frame.
         * var center = Cesium.Cartesian3.fromDegrees(0.0, 0.0);
         * var heading = -Cesium.Math.PI_OVER_TWO;
         * var pitch = Cesium.Math.PI_OVER_FOUR;
         * var roll = 0.0;
         * var hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
         * var transform = Cesium.Transforms.headingPitchRollToFixedFrame(center, hpr);
         */
        Transforms.headingPitchRollToFixedFrame = function(origin, headingPitchRoll, ellipsoid, fixedFrameTransform, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object( 'HeadingPitchRoll', headingPitchRoll);
            //>>includeEnd('debug');

            fixedFrameTransform = defaultValue.defaultValue(fixedFrameTransform, Transforms.eastNorthUpToFixedFrame);
            var hprQuaternion = Quaternion.fromHeadingPitchRoll(headingPitchRoll, scratchHPRQuaternion);
            var hprMatrix = Matrix4.fromTranslationQuaternionRotationScale(Cartesian2.Cartesian3.ZERO, hprQuaternion, scratchScale, scratchHPRMatrix4);
            result = fixedFrameTransform(origin, ellipsoid, result);
            return Matrix4.multiply(result, hprMatrix, result);
        };

        var scratchENUMatrix4 = new Matrix4();
        var scratchHPRMatrix3 = new Matrix3();

        /**
         * Computes a quaternion from a reference frame with axes computed from the heading-pitch-roll angles
         * centered at the provided origin. Heading is the rotation from the local north
         * direction where a positive angle is increasing eastward. Pitch is the rotation from the local east-north plane. Positive pitch angles
         * are above the plane. Negative pitch angles are below the plane. Roll is the first rotation applied about the local east axis.
         *
         * @param {Cartesian3} origin The center point of the local reference frame.
         * @param {HeadingPitchRoll} headingPitchRoll The heading, pitch, and roll.
         * @param {Ellipsoid} [ellipsoid=Ellipsoid.WGS84] The ellipsoid whose fixed frame is used in the transformation.
         * @param {Transforms~LocalFrameToFixedFrame} [fixedFrameTransform=Transforms.eastNorthUpToFixedFrame] A 4x4 transformation
         *  matrix from a reference frame to the provided ellipsoid's fixed reference frame
         * @param {Quaternion} [result] The object onto which to store the result.
         * @returns {Quaternion} The modified result parameter or a new Quaternion instance if none was provided.
         *
         * @example
         * // Get the quaternion from local heading-pitch-roll at cartographic (0.0, 0.0) to Earth's fixed frame.
         * var center = Cesium.Cartesian3.fromDegrees(0.0, 0.0);
         * var heading = -Cesium.Math.PI_OVER_TWO;
         * var pitch = Cesium.Math.PI_OVER_FOUR;
         * var roll = 0.0;
         * var hpr = new HeadingPitchRoll(heading, pitch, roll);
         * var quaternion = Cesium.Transforms.headingPitchRollQuaternion(center, hpr);
         */
        Transforms.headingPitchRollQuaternion = function(origin, headingPitchRoll, ellipsoid, fixedFrameTransform, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object( 'HeadingPitchRoll', headingPitchRoll);
            //>>includeEnd('debug');

            var transform = Transforms.headingPitchRollToFixedFrame(origin, headingPitchRoll, ellipsoid, fixedFrameTransform, scratchENUMatrix4);
            var rotation = Matrix4.getMatrix3(transform, scratchHPRMatrix3);
            return Quaternion.fromRotationMatrix(rotation, result);
        };

        var noScale = new Cartesian2.Cartesian3(1.0, 1.0, 1.0);
        var hprCenterScratch = new Cartesian2.Cartesian3();
        var ffScratch = new Matrix4();
        var hprTransformScratch = new Matrix4();
        var hprRotationScratch = new Matrix3();
        var hprQuaternionScratch = new Quaternion();
        /**
         * Computes heading-pitch-roll angles from a transform in a particular reference frame. Heading is the rotation from the local north
         * direction where a positive angle is increasing eastward. Pitch is the rotation from the local east-north plane. Positive pitch angles
         * are above the plane. Negative pitch angles are below the plane. Roll is the first rotation applied about the local east axis.
         *
         * @param {Matrix4} transform The transform
         * @param {Ellipsoid} [ellipsoid=Ellipsoid.WGS84] The ellipsoid whose fixed frame is used in the transformation.
         * @param {Transforms~LocalFrameToFixedFrame} [fixedFrameTransform=Transforms.eastNorthUpToFixedFrame] A 4x4 transformation
         *  matrix from a reference frame to the provided ellipsoid's fixed reference frame
         * @param {HeadingPitchRoll} [result] The object onto which to store the result.
         * @returns {HeadingPitchRoll} The modified result parameter or a new HeadingPitchRoll instance if none was provided.
         */
        Transforms.fixedFrameToHeadingPitchRoll = function(transform, ellipsoid, fixedFrameTransform, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.defined('transform', transform);
            //>>includeEnd('debug');

            ellipsoid = defaultValue.defaultValue(ellipsoid, Cartesian2.Ellipsoid.WGS84);
            fixedFrameTransform = defaultValue.defaultValue(fixedFrameTransform, Transforms.eastNorthUpToFixedFrame);
            if (!defaultValue.defined(result)) {
                result = new HeadingPitchRoll();
            }

            var center = Matrix4.getTranslation(transform, hprCenterScratch);
            if (Cartesian2.Cartesian3.equals(center, Cartesian2.Cartesian3.ZERO)) {
                result.heading = 0;
                result.pitch = 0;
                result.roll = 0;
                return result;
            }
            var toFixedFrame = Matrix4.inverseTransformation(fixedFrameTransform(center, ellipsoid, ffScratch), ffScratch);
            var transformCopy = Matrix4.setScale(transform, noScale, hprTransformScratch);
            transformCopy = Matrix4.setTranslation(transformCopy, Cartesian2.Cartesian3.ZERO, transformCopy);

            toFixedFrame = Matrix4.multiply(toFixedFrame, transformCopy, toFixedFrame);
            var quaternionRotation = Quaternion.fromRotationMatrix(Matrix4.getMatrix3(toFixedFrame, hprRotationScratch), hprQuaternionScratch);
            quaternionRotation = Quaternion.normalize(quaternionRotation, quaternionRotation);

            return HeadingPitchRoll.fromQuaternion(quaternionRotation, result);
        };

        var gmstConstant0 = 6 * 3600 + 41 * 60 + 50.54841;
        var gmstConstant1 = 8640184.812866;
        var gmstConstant2 = 0.093104;
        var gmstConstant3 = -6.2E-6;
        var rateCoef = 1.1772758384668e-19;
        var wgs84WRPrecessing = 7.2921158553E-5;
        var twoPiOverSecondsInDay = _Math.CesiumMath.TWO_PI / 86400.0;
        var dateInUtc = new JulianDate();

        /**
         * Computes a rotation matrix to transform a point or vector from True Equator Mean Equinox (TEME) axes to the
         * pseudo-fixed axes at a given time.  This method treats the UT1 time standard as equivalent to UTC.
         *
         * @param {JulianDate} date The time at which to compute the rotation matrix.
         * @param {Matrix3} [result] The object onto which to store the result.
         * @returns {Matrix3} The modified result parameter or a new Matrix3 instance if none was provided.
         *
         * @example
         * //Set the view to the inertial frame.
         * scene.postUpdate.addEventListener(function(scene, time) {
         *    var now = Cesium.JulianDate.now();
         *    var offset = Cesium.Matrix4.multiplyByPoint(camera.transform, camera.position, new Cesium.Cartesian3());
         *    var transform = Cesium.Matrix4.fromRotationTranslation(Cesium.Transforms.computeTemeToPseudoFixedMatrix(now));
         *    var inverseTransform = Cesium.Matrix4.inverseTransformation(transform, new Cesium.Matrix4());
         *    Cesium.Matrix4.multiplyByPoint(inverseTransform, offset, offset);
         *    camera.lookAtTransform(transform, offset);
         * });
         */
        Transforms.computeTemeToPseudoFixedMatrix = function (date, result) {
            //>>includeStart('debug', pragmas.debug);
            if (!defaultValue.defined(date)) {
                throw new Check.DeveloperError('date is required.');
            }
            //>>includeEnd('debug');

            // GMST is actually computed using UT1.  We're using UTC as an approximation of UT1.
            // We do not want to use the function like convertTaiToUtc in JulianDate because
            // we explicitly do not want to fail when inside the leap second.

            dateInUtc = JulianDate.addSeconds(date, -JulianDate.computeTaiMinusUtc(date), dateInUtc);
            var utcDayNumber = dateInUtc.dayNumber;
            var utcSecondsIntoDay = dateInUtc.secondsOfDay;

            var t;
            var diffDays = utcDayNumber - 2451545;
            if (utcSecondsIntoDay >= 43200.0) {
                t = (diffDays + 0.5) / TimeConstants$1.DAYS_PER_JULIAN_CENTURY;
            } else {
                t = (diffDays - 0.5) / TimeConstants$1.DAYS_PER_JULIAN_CENTURY;
            }

            var gmst0 = gmstConstant0 + t * (gmstConstant1 + t * (gmstConstant2 + t * gmstConstant3));
            var angle = (gmst0 * twoPiOverSecondsInDay) % _Math.CesiumMath.TWO_PI;
            var ratio = wgs84WRPrecessing + rateCoef * (utcDayNumber - 2451545.5);
            var secondsSinceMidnight = (utcSecondsIntoDay + TimeConstants$1.SECONDS_PER_DAY * 0.5) % TimeConstants$1.SECONDS_PER_DAY;
            var gha = angle + (ratio * secondsSinceMidnight);
            var cosGha = Math.cos(gha);
            var sinGha = Math.sin(gha);

            if (!defaultValue.defined(result)) {
                return new Matrix3(cosGha, sinGha, 0.0,
                                  -sinGha, cosGha, 0.0,
                                      0.0,    0.0, 1.0);
            }
            result[0] = cosGha;
            result[1] = -sinGha;
            result[2] = 0.0;
            result[3] = sinGha;
            result[4] = cosGha;
            result[5] = 0.0;
            result[6] = 0.0;
            result[7] = 0.0;
            result[8] = 1.0;
            return result;
        };

        /**
         * The source of IAU 2006 XYS data, used for computing the transformation between the
         * Fixed and ICRF axes.
         * @type {Iau2006XysData}
         *
         * @see Transforms.computeIcrfToFixedMatrix
         * @see Transforms.computeFixedToIcrfMatrix
         *
         * @private
         */
        Transforms.iau2006XysData = new Iau2006XysData();

        /**
         * The source of Earth Orientation Parameters (EOP) data, used for computing the transformation
         * between the Fixed and ICRF axes.  By default, zero values are used for all EOP values,
         * yielding a reasonable but not completely accurate representation of the ICRF axes.
         * @type {EarthOrientationParameters}
         *
         * @see Transforms.computeIcrfToFixedMatrix
         * @see Transforms.computeFixedToIcrfMatrix
         *
         * @private
         */
        Transforms.earthOrientationParameters = EarthOrientationParameters.NONE;

        var ttMinusTai = 32.184;
        var j2000ttDays = 2451545.0;

        /**
         * Preloads the data necessary to transform between the ICRF and Fixed axes, in either
         * direction, over a given interval.  This function returns a promise that, when resolved,
         * indicates that the preload has completed.
         *
         * @param {TimeInterval} timeInterval The interval to preload.
         * @returns {Promise} A promise that, when resolved, indicates that the preload has completed
         *          and evaluation of the transformation between the fixed and ICRF axes will
         *          no longer return undefined for a time inside the interval.
         *
         *
         * @example
         * var interval = new Cesium.TimeInterval(...);
         * when(Cesium.Transforms.preloadIcrfFixed(interval), function() {
         *     // the data is now loaded
         * });
         *
         * @see Transforms.computeIcrfToFixedMatrix
         * @see Transforms.computeFixedToIcrfMatrix
         * @see when
         */
        Transforms.preloadIcrfFixed = function(timeInterval) {
            var startDayTT = timeInterval.start.dayNumber;
            var startSecondTT = timeInterval.start.secondsOfDay + ttMinusTai;
            var stopDayTT = timeInterval.stop.dayNumber;
            var stopSecondTT = timeInterval.stop.secondsOfDay + ttMinusTai;

            var xysPromise = Transforms.iau2006XysData.preload(startDayTT, startSecondTT, stopDayTT, stopSecondTT);
            var eopPromise = Transforms.earthOrientationParameters.getPromiseToLoad();

            return when.when.all([xysPromise, eopPromise]);
        };

        /**
         * Computes a rotation matrix to transform a point or vector from the International Celestial
         * Reference Frame (GCRF/ICRF) inertial frame axes to the Earth-Fixed frame axes (ITRF)
         * at a given time.  This function may return undefined if the data necessary to
         * do the transformation is not yet loaded.
         *
         * @param {JulianDate} date The time at which to compute the rotation matrix.
         * @param {Matrix3} [result] The object onto which to store the result.  If this parameter is
         *                  not specified, a new instance is created and returned.
         * @returns {Matrix3} The rotation matrix, or undefined if the data necessary to do the
         *                   transformation is not yet loaded.
         *
         *
         * @example
         * scene.postUpdate.addEventListener(function(scene, time) {
         *   // View in ICRF.
         *   var icrfToFixed = Cesium.Transforms.computeIcrfToFixedMatrix(time);
         *   if (Cesium.defined(icrfToFixed)) {
         *     var offset = Cesium.Cartesian3.clone(camera.position);
         *     var transform = Cesium.Matrix4.fromRotationTranslation(icrfToFixed);
         *     camera.lookAtTransform(transform, offset);
         *   }
         * });
         *
         * @see Transforms.preloadIcrfFixed
         */
        Transforms.computeIcrfToFixedMatrix = function(date, result) {
            //>>includeStart('debug', pragmas.debug);
            if (!defaultValue.defined(date)) {
                throw new Check.DeveloperError('date is required.');
            }
            //>>includeEnd('debug');
            if (!defaultValue.defined(result)) {
                result = new Matrix3();
            }

            var fixedToIcrfMtx = Transforms.computeFixedToIcrfMatrix(date, result);
            if (!defaultValue.defined(fixedToIcrfMtx)) {
                return undefined;
            }

            return Matrix3.transpose(fixedToIcrfMtx, result);
        };

        var xysScratch = new Iau2006XysSample(0.0, 0.0, 0.0);
        var eopScratch = new EarthOrientationParametersSample(0.0, 0.0, 0.0, 0.0, 0.0, 0.0);
        var rotation1Scratch = new Matrix3();
        var rotation2Scratch = new Matrix3();

        /**
         * Computes a rotation matrix to transform a point or vector from the Earth-Fixed frame axes (ITRF)
         * to the International Celestial Reference Frame (GCRF/ICRF) inertial frame axes
         * at a given time.  This function may return undefined if the data necessary to
         * do the transformation is not yet loaded.
         *
         * @param {JulianDate} date The time at which to compute the rotation matrix.
         * @param {Matrix3} [result] The object onto which to store the result.  If this parameter is
         *                  not specified, a new instance is created and returned.
         * @returns {Matrix3} The rotation matrix, or undefined if the data necessary to do the
         *                   transformation is not yet loaded.
         *
         *
         * @example
         * // Transform a point from the ICRF axes to the Fixed axes.
         * var now = Cesium.JulianDate.now();
         * var pointInFixed = Cesium.Cartesian3.fromDegrees(0.0, 0.0);
         * var fixedToIcrf = Cesium.Transforms.computeIcrfToFixedMatrix(now);
         * var pointInInertial = new Cesium.Cartesian3();
         * if (Cesium.defined(fixedToIcrf)) {
         *     pointInInertial = Cesium.Matrix3.multiplyByVector(fixedToIcrf, pointInFixed, pointInInertial);
         * }
         *
         * @see Transforms.preloadIcrfFixed
         */
        Transforms.computeFixedToIcrfMatrix = function(date, result) {
            //>>includeStart('debug', pragmas.debug);
            if (!defaultValue.defined(date)) {
                throw new Check.DeveloperError('date is required.');
            }
            //>>includeEnd('debug');

            if (!defaultValue.defined(result)) {
                result = new Matrix3();
            }

            // Compute pole wander
            var eop = Transforms.earthOrientationParameters.compute(date, eopScratch);
            if (!defaultValue.defined(eop)) {
                return undefined;
            }

            // There is no external conversion to Terrestrial Time (TT).
            // So use International Atomic Time (TAI) and convert using offsets.
            // Here we are assuming that dayTT and secondTT are positive
            var dayTT = date.dayNumber;
            // It's possible here that secondTT could roll over 86400
            // This does not seem to affect the precision (unit tests check for this)
            var secondTT = date.secondsOfDay + ttMinusTai;

            var xys = Transforms.iau2006XysData.computeXysRadians(dayTT, secondTT, xysScratch);
            if (!defaultValue.defined(xys)) {
                return undefined;
            }

            var x = xys.x + eop.xPoleOffset;
            var y = xys.y + eop.yPoleOffset;

            // Compute XYS rotation
            var a = 1.0 / (1.0 + Math.sqrt(1.0 - x * x - y * y));

            var rotation1 = rotation1Scratch;
            rotation1[0] = 1.0 - a * x * x;
            rotation1[3] = -a * x * y;
            rotation1[6] = x;
            rotation1[1] = -a * x * y;
            rotation1[4] = 1 - a * y * y;
            rotation1[7] = y;
            rotation1[2] = -x;
            rotation1[5] = -y;
            rotation1[8] = 1 - a * (x * x + y * y);

            var rotation2 = Matrix3.fromRotationZ(-xys.s, rotation2Scratch);
            var matrixQ = Matrix3.multiply(rotation1, rotation2, rotation1Scratch);

            // Similar to TT conversions above
            // It's possible here that secondTT could roll over 86400
            // This does not seem to affect the precision (unit tests check for this)
            var dateUt1day = date.dayNumber;
            var dateUt1sec = date.secondsOfDay - JulianDate.computeTaiMinusUtc(date) + eop.ut1MinusUtc;

            // Compute Earth rotation angle
            // The IERS standard for era is
            //    era = 0.7790572732640 + 1.00273781191135448 * Tu
            // where
            //    Tu = JulianDateInUt1 - 2451545.0
            // However, you get much more precision if you make the following simplification
            //    era = a + (1 + b) * (JulianDayNumber + FractionOfDay - 2451545)
            //    era = a + (JulianDayNumber - 2451545) + FractionOfDay + b (JulianDayNumber - 2451545 + FractionOfDay)
            //    era = a + FractionOfDay + b (JulianDayNumber - 2451545 + FractionOfDay)
            // since (JulianDayNumber - 2451545) represents an integer number of revolutions which will be discarded anyway.
            var daysSinceJ2000 = dateUt1day - 2451545;
            var fractionOfDay = dateUt1sec / TimeConstants$1.SECONDS_PER_DAY;
            var era = 0.7790572732640 + fractionOfDay + 0.00273781191135448 * (daysSinceJ2000 + fractionOfDay);
            era = (era % 1.0) * _Math.CesiumMath.TWO_PI;

            var earthRotation = Matrix3.fromRotationZ(era, rotation2Scratch);

            // pseudoFixed to ICRF
            var pfToIcrf = Matrix3.multiply(matrixQ, earthRotation, rotation1Scratch);

            // Compute pole wander matrix
            var cosxp = Math.cos(eop.xPoleWander);
            var cosyp = Math.cos(eop.yPoleWander);
            var sinxp = Math.sin(eop.xPoleWander);
            var sinyp = Math.sin(eop.yPoleWander);

            var ttt = (dayTT - j2000ttDays) + secondTT / TimeConstants$1.SECONDS_PER_DAY;
            ttt /= 36525.0;

            // approximate sp value in rad
            var sp = -47.0e-6 * ttt * _Math.CesiumMath.RADIANS_PER_DEGREE / 3600.0;
            var cossp = Math.cos(sp);
            var sinsp = Math.sin(sp);

            var fToPfMtx = rotation2Scratch;
            fToPfMtx[0] = cosxp * cossp;
            fToPfMtx[1] = cosxp * sinsp;
            fToPfMtx[2] = sinxp;
            fToPfMtx[3] = -cosyp * sinsp + sinyp * sinxp * cossp;
            fToPfMtx[4] = cosyp * cossp + sinyp * sinxp * sinsp;
            fToPfMtx[5] = -sinyp * cosxp;
            fToPfMtx[6] = -sinyp * sinsp - cosyp * sinxp * cossp;
            fToPfMtx[7] = sinyp * cossp - cosyp * sinxp * sinsp;
            fToPfMtx[8] = cosyp * cosxp;

            return Matrix3.multiply(pfToIcrf, fToPfMtx, result);
        };

        var pointToWindowCoordinatesTemp = new Cartesian4();

        /**
         * Transform a point from model coordinates to window coordinates.
         *
         * @param {Matrix4} modelViewProjectionMatrix The 4x4 model-view-projection matrix.
         * @param {Matrix4} viewportTransformation The 4x4 viewport transformation.
         * @param {Cartesian3} point The point to transform.
         * @param {Cartesian2} [result] The object onto which to store the result.
         * @returns {Cartesian2} The modified result parameter or a new Cartesian2 instance if none was provided.
         */
        Transforms.pointToWindowCoordinates = function (modelViewProjectionMatrix, viewportTransformation, point, result) {
            result = Transforms.pointToGLWindowCoordinates(modelViewProjectionMatrix, viewportTransformation, point, result);
            result.y = 2.0 * viewportTransformation[5] - result.y;
            return result;
        };

        /**
         * @private
         */
        Transforms.pointToGLWindowCoordinates = function(modelViewProjectionMatrix, viewportTransformation, point, result) {
            //>>includeStart('debug', pragmas.debug);
            if (!defaultValue.defined(modelViewProjectionMatrix)) {
                throw new Check.DeveloperError('modelViewProjectionMatrix is required.');
            }

            if (!defaultValue.defined(viewportTransformation)) {
                throw new Check.DeveloperError('viewportTransformation is required.');
            }

            if (!defaultValue.defined(point)) {
                throw new Check.DeveloperError('point is required.');
            }
            //>>includeEnd('debug');

            if (!defaultValue.defined(result)) {
                result = new Cartesian2.Cartesian2();
            }

            var tmp = pointToWindowCoordinatesTemp;

            Matrix4.multiplyByVector(modelViewProjectionMatrix, Cartesian4.fromElements(point.x, point.y, point.z, 1, tmp), tmp);
            Cartesian4.multiplyByScalar(tmp, 1.0 / tmp.w, tmp);
            Matrix4.multiplyByVector(viewportTransformation, tmp, tmp);
            return Cartesian2.Cartesian2.fromCartesian4(tmp, result);
        };

        var normalScratch = new Cartesian2.Cartesian3();
        var rightScratch = new Cartesian2.Cartesian3();
        var upScratch = new Cartesian2.Cartesian3();

        /**
         * @private
         */
        Transforms.rotationMatrixFromPositionVelocity = function(position, velocity, ellipsoid, result) {
            //>>includeStart('debug', pragmas.debug);
            if (!defaultValue.defined(position)) {
                throw new Check.DeveloperError('position is required.');
            }

            if (!defaultValue.defined(velocity)) {
                throw new Check.DeveloperError('velocity is required.');
            }
            //>>includeEnd('debug');

            var normal = defaultValue.defaultValue(ellipsoid, Cartesian2.Ellipsoid.WGS84).geodeticSurfaceNormal(position, normalScratch);
            var right = Cartesian2.Cartesian3.cross(velocity, normal, rightScratch);

            if (Cartesian2.Cartesian3.equalsEpsilon(right, Cartesian2.Cartesian3.ZERO, _Math.CesiumMath.EPSILON6)) {
                right = Cartesian2.Cartesian3.clone(Cartesian2.Cartesian3.UNIT_X, right);
            }

            var up = Cartesian2.Cartesian3.cross(right, velocity, upScratch);
            Cartesian2.Cartesian3.normalize(up, up);
            Cartesian2.Cartesian3.cross(velocity, up, right);
            Cartesian2.Cartesian3.negate(right, right);
            Cartesian2.Cartesian3.normalize(right, right);

            if (!defaultValue.defined(result)) {
                result = new Matrix3();
            }

            result[0] = velocity.x;
            result[1] = velocity.y;
            result[2] = velocity.z;
            result[3] = right.x;
            result[4] = right.y;
            result[5] = right.z;
            result[6] = up.x;
            result[7] = up.y;
            result[8] = up.z;

            return result;
        };

        var swizzleMatrix = new Matrix4(
            0.0, 0.0, 1.0, 0.0,
            1.0, 0.0, 0.0, 0.0,
            0.0, 1.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 1.0
        );

        var scratchCartographic = new Cartesian2.Cartographic();
        var scratchCartesian3Projection = new Cartesian2.Cartesian3();
        var scratchCenter = new Cartesian2.Cartesian3();
        var scratchRotation = new Matrix3();
        var scratchFromENU = new Matrix4();
        var scratchToENU = new Matrix4();

        /**
         * @private
         */
        Transforms.basisTo2D = function(projection, matrix, result) {
            //>>includeStart('debug', pragmas.debug);
            if (!defaultValue.defined(projection)) {
                throw new Check.DeveloperError('projection is required.');
            }
            if (!defaultValue.defined(matrix)) {
                throw new Check.DeveloperError('matrix is required.');
            }
            if (!defaultValue.defined(result)) {
                throw new Check.DeveloperError('result is required.');
            }
            //>>includeEnd('debug');

            var rtcCenter = Matrix4.getTranslation(matrix, scratchCenter);
            var ellipsoid = projection.ellipsoid;

            // Get the 2D Center
            var cartographic = ellipsoid.cartesianToCartographic(rtcCenter, scratchCartographic);
            var projectedPosition = projection.project(cartographic, scratchCartesian3Projection);
            Cartesian2.Cartesian3.fromElements(projectedPosition.z, projectedPosition.x, projectedPosition.y, projectedPosition);

            // Assuming the instance are positioned in WGS84, invert the WGS84 transform to get the local transform and then convert to 2D
            var fromENU = Transforms.eastNorthUpToFixedFrame(rtcCenter, ellipsoid, scratchFromENU);
            var toENU = Matrix4.inverseTransformation(fromENU, scratchToENU);
            var rotation = Matrix4.getMatrix3(matrix, scratchRotation);
            var local = Matrix4.multiplyByMatrix3(toENU, rotation, result);
            Matrix4.multiply(swizzleMatrix, local, result); // Swap x, y, z for 2D
            Matrix4.setTranslation(result, projectedPosition, result); // Use the projected center

            return result;
        };

        /**
         * @private
         */
        Transforms.wgs84To2DModelMatrix = function(projection, center, result) {
            //>>includeStart('debug', pragmas.debug);
            if (!defaultValue.defined(projection)) {
                throw new Check.DeveloperError('projection is required.');
            }
            if (!defaultValue.defined(center)) {
                throw new Check.DeveloperError('center is required.');
            }
            if (!defaultValue.defined(result)) {
                throw new Check.DeveloperError('result is required.');
            }
            //>>includeEnd('debug');

            var ellipsoid = projection.ellipsoid;

            var fromENU = Transforms.eastNorthUpToFixedFrame(center, ellipsoid, scratchFromENU);
            var toENU = Matrix4.inverseTransformation(fromENU, scratchToENU);

            var cartographic = ellipsoid.cartesianToCartographic(center, scratchCartographic);
            var projectedPosition = projection.project(cartographic, scratchCartesian3Projection);
            Cartesian2.Cartesian3.fromElements(projectedPosition.z, projectedPosition.x, projectedPosition.y, projectedPosition);

            var translation = Matrix4.fromTranslation(projectedPosition, scratchFromENU);
            Matrix4.multiply(swizzleMatrix, toENU, result);
            Matrix4.multiply(translation, result, result);

            return result;
        };

    exports.Cartesian4 = Cartesian4;
    exports.FeatureDetection = FeatureDetection;
    exports.Matrix3 = Matrix3;
    exports.Matrix4 = Matrix4;
    exports.Quaternion = Quaternion;
    exports.Transforms = Transforms;
    exports.buildModuleUrl = buildModuleUrl;

}));
//# sourceMappingURL=Transforms-8def6431.js.map
