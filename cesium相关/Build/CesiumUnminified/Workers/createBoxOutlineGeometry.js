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

define(['./Transforms-e81b498a', './Cartesian3-5587e0cf', './Check-0f680516', './ComponentDatatype-4ab1a86a', './defined-a5305fd6', './GeometryAttribute-a065274b', './GeometryAttributes-ae79d5fa', './GeometryOffsetAttribute-102da468', './Cartesian2-b941a975', './Math-79d70b44', './GeographicProjection-bcd5d069', './Matrix2-81068516', './RuntimeError-8d8b6ef6', './Resource-0c25a925', './_commonjsHelpers-89c9b271', './combine-eceb7722', './defer-bfc6471e', './WebGLConstants-d81b330d'], (function (Transforms, Cartesian3, Check, ComponentDatatype, defined, GeometryAttribute, GeometryAttributes, GeometryOffsetAttribute, Cartesian2, Math, GeographicProjection, Matrix2, RuntimeError, Resource, _commonjsHelpers, combine, defer, WebGLConstants) { 'use strict';

  const diffScratch = new Cartesian3.Cartesian3();

  /**
   * A description of the outline of a cube centered at the origin.
   *
   * @alias BoxOutlineGeometry
   * @constructor
   *
   * @param {Object} options Object with the following properties:
   * @param {Cartesian3} options.minimum The minimum x, y, and z coordinates of the box.
   * @param {Cartesian3} options.maximum The maximum x, y, and z coordinates of the box.
   *
   * @see BoxOutlineGeometry.fromDimensions
   * @see BoxOutlineGeometry.createGeometry
   * @see Packable
   *
   * @example
   * const box = new Cesium.BoxOutlineGeometry({
   *   maximum : new Cesium.Cartesian3(250000.0, 250000.0, 250000.0),
   *   minimum : new Cesium.Cartesian3(-250000.0, -250000.0, -250000.0)
   * });
   * const geometry = Cesium.BoxOutlineGeometry.createGeometry(box);
   */
  function BoxOutlineGeometry(options) {
    options = defined.defaultValue(options, defined.defaultValue.EMPTY_OBJECT);

    const min = options.minimum;
    const max = options.maximum;

    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("min", min);
    Check.Check.typeOf.object("max", max);
    if (
      defined.defined(options.offsetAttribute) &&
      options.offsetAttribute === GeometryOffsetAttribute.GeometryOffsetAttribute.TOP
    ) {
      throw new Check.DeveloperError(
        "GeometryOffsetAttribute.TOP is not a supported options.offsetAttribute for this geometry."
      );
    }
    //>>includeEnd('debug');

    this._min = Cartesian3.Cartesian3.clone(min);
    this._max = Cartesian3.Cartesian3.clone(max);
    this._offsetAttribute = options.offsetAttribute;
    this._workerName = "createBoxOutlineGeometry";
  }

  /**
   * Creates an outline of a cube centered at the origin given its dimensions.
   *
   * @param {Object} options Object with the following properties:
   * @param {Cartesian3} options.dimensions The width, depth, and height of the box stored in the x, y, and z coordinates of the <code>Cartesian3</code>, respectively.
   * @returns {BoxOutlineGeometry}
   *
   * @exception {DeveloperError} All dimensions components must be greater than or equal to zero.
   *
   *
   * @example
   * const box = Cesium.BoxOutlineGeometry.fromDimensions({
   *   dimensions : new Cesium.Cartesian3(500000.0, 500000.0, 500000.0)
   * });
   * const geometry = Cesium.BoxOutlineGeometry.createGeometry(box);
   *
   * @see BoxOutlineGeometry.createGeometry
   */
  BoxOutlineGeometry.fromDimensions = function (options) {
    options = defined.defaultValue(options, defined.defaultValue.EMPTY_OBJECT);
    const dimensions = options.dimensions;

    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("dimensions", dimensions);
    Check.Check.typeOf.number.greaterThanOrEquals("dimensions.x", dimensions.x, 0);
    Check.Check.typeOf.number.greaterThanOrEquals("dimensions.y", dimensions.y, 0);
    Check.Check.typeOf.number.greaterThanOrEquals("dimensions.z", dimensions.z, 0);
    //>>includeEnd('debug');

    const corner = Cartesian3.Cartesian3.multiplyByScalar(dimensions, 0.5, new Cartesian3.Cartesian3());

    return new BoxOutlineGeometry({
      minimum: Cartesian3.Cartesian3.negate(corner, new Cartesian3.Cartesian3()),
      maximum: corner,
      offsetAttribute: options.offsetAttribute,
    });
  };

  /**
   * Creates an outline of a cube from the dimensions of an AxisAlignedBoundingBox.
   *
   * @param {AxisAlignedBoundingBox} boundingBox A description of the AxisAlignedBoundingBox.
   * @returns {BoxOutlineGeometry}
   *
   *
   *
   * @example
   * const aabb = Cesium.AxisAlignedBoundingBox.fromPoints(Cesium.Cartesian3.fromDegreesArray([
   *      -72.0, 40.0,
   *      -70.0, 35.0,
   *      -75.0, 30.0,
   *      -70.0, 30.0,
   *      -68.0, 40.0
   * ]));
   * const box = Cesium.BoxOutlineGeometry.fromAxisAlignedBoundingBox(aabb);
   *
   *  @see BoxOutlineGeometry.createGeometry
   */
  BoxOutlineGeometry.fromAxisAlignedBoundingBox = function (boundingBox) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("boundindBox", boundingBox);
    //>>includeEnd('debug');

    return new BoxOutlineGeometry({
      minimum: boundingBox.minimum,
      maximum: boundingBox.maximum,
    });
  };

  /**
   * The number of elements used to pack the object into an array.
   * @type {Number}
   */
  BoxOutlineGeometry.packedLength = 2 * Cartesian3.Cartesian3.packedLength + 1;

  /**
   * Stores the provided instance into the provided array.
   *
   * @param {BoxOutlineGeometry} value The value to pack.
   * @param {Number[]} array The array to pack into.
   * @param {Number} [startingIndex=0] The index into the array at which to start packing the elements.
   *
   * @returns {Number[]} The array that was packed into
   */
  BoxOutlineGeometry.pack = function (value, array, startingIndex) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("value", value);
    Check.Check.defined("array", array);
    //>>includeEnd('debug');

    startingIndex = defined.defaultValue(startingIndex, 0);

    Cartesian3.Cartesian3.pack(value._min, array, startingIndex);
    Cartesian3.Cartesian3.pack(value._max, array, startingIndex + Cartesian3.Cartesian3.packedLength);
    array[startingIndex + Cartesian3.Cartesian3.packedLength * 2] = defined.defaultValue(
      value._offsetAttribute,
      -1
    );

    return array;
  };

  const scratchMin = new Cartesian3.Cartesian3();
  const scratchMax = new Cartesian3.Cartesian3();
  const scratchOptions = {
    minimum: scratchMin,
    maximum: scratchMax,
    offsetAttribute: undefined,
  };

  /**
   * Retrieves an instance from a packed array.
   *
   * @param {Number[]} array The packed array.
   * @param {Number} [startingIndex=0] The starting index of the element to be unpacked.
   * @param {BoxOutlineGeometry} [result] The object into which to store the result.
   * @returns {BoxOutlineGeometry} The modified result parameter or a new BoxOutlineGeometry instance if one was not provided.
   */
  BoxOutlineGeometry.unpack = function (array, startingIndex, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.defined("array", array);
    //>>includeEnd('debug');

    startingIndex = defined.defaultValue(startingIndex, 0);

    const min = Cartesian3.Cartesian3.unpack(array, startingIndex, scratchMin);
    const max = Cartesian3.Cartesian3.unpack(
      array,
      startingIndex + Cartesian3.Cartesian3.packedLength,
      scratchMax
    );
    const offsetAttribute = array[startingIndex + Cartesian3.Cartesian3.packedLength * 2];

    if (!defined.defined(result)) {
      scratchOptions.offsetAttribute =
        offsetAttribute === -1 ? undefined : offsetAttribute;
      return new BoxOutlineGeometry(scratchOptions);
    }

    result._min = Cartesian3.Cartesian3.clone(min, result._min);
    result._max = Cartesian3.Cartesian3.clone(max, result._max);
    result._offsetAttribute =
      offsetAttribute === -1 ? undefined : offsetAttribute;

    return result;
  };

  /**
   * Computes the geometric representation of an outline of a box, including its vertices, indices, and a bounding sphere.
   *
   * @param {BoxOutlineGeometry} boxGeometry A description of the box outline.
   * @returns {Geometry|undefined} The computed vertices and indices.
   */
  BoxOutlineGeometry.createGeometry = function (boxGeometry) {
    const min = boxGeometry._min;
    const max = boxGeometry._max;

    if (Cartesian3.Cartesian3.equals(min, max)) {
      return;
    }

    const attributes = new GeometryAttributes.GeometryAttributes();
    const indices = new Uint16Array(12 * 2);
    const positions = new Float64Array(8 * 3);

    positions[0] = min.x;
    positions[1] = min.y;
    positions[2] = min.z;
    positions[3] = max.x;
    positions[4] = min.y;
    positions[5] = min.z;
    positions[6] = max.x;
    positions[7] = max.y;
    positions[8] = min.z;
    positions[9] = min.x;
    positions[10] = max.y;
    positions[11] = min.z;

    positions[12] = min.x;
    positions[13] = min.y;
    positions[14] = max.z;
    positions[15] = max.x;
    positions[16] = min.y;
    positions[17] = max.z;
    positions[18] = max.x;
    positions[19] = max.y;
    positions[20] = max.z;
    positions[21] = min.x;
    positions[22] = max.y;
    positions[23] = max.z;

    attributes.position = new GeometryAttribute.GeometryAttribute({
      componentDatatype: ComponentDatatype.ComponentDatatype.DOUBLE,
      componentsPerAttribute: 3,
      values: positions,
    });

    // top
    indices[0] = 4;
    indices[1] = 5;
    indices[2] = 5;
    indices[3] = 6;
    indices[4] = 6;
    indices[5] = 7;
    indices[6] = 7;
    indices[7] = 4;

    // bottom
    indices[8] = 0;
    indices[9] = 1;
    indices[10] = 1;
    indices[11] = 2;
    indices[12] = 2;
    indices[13] = 3;
    indices[14] = 3;
    indices[15] = 0;

    // left
    indices[16] = 0;
    indices[17] = 4;
    indices[18] = 1;
    indices[19] = 5;

    //right
    indices[20] = 2;
    indices[21] = 6;
    indices[22] = 3;
    indices[23] = 7;

    const diff = Cartesian3.Cartesian3.subtract(max, min, diffScratch);
    const radius = Cartesian3.Cartesian3.magnitude(diff) * 0.5;

    if (defined.defined(boxGeometry._offsetAttribute)) {
      const length = positions.length;
      const offsetValue =
        boxGeometry._offsetAttribute === GeometryOffsetAttribute.GeometryOffsetAttribute.NONE ? 0 : 1;
      const applyOffset = new Uint8Array(length / 3).fill(offsetValue);
      attributes.applyOffset = new GeometryAttribute.GeometryAttribute({
        componentDatatype: ComponentDatatype.ComponentDatatype.UNSIGNED_BYTE,
        componentsPerAttribute: 1,
        values: applyOffset,
      });
    }

    return new GeometryAttribute.Geometry({
      attributes: attributes,
      indices: indices,
      primitiveType: GeometryAttribute.PrimitiveType.LINES,
      boundingSphere: new Transforms.BoundingSphere(Cartesian3.Cartesian3.ZERO, radius),
      offsetAttribute: boxGeometry._offsetAttribute,
    });
  };

  function createBoxOutlineGeometry(boxGeometry, offset) {
    if (defined.defined(offset)) {
      boxGeometry = BoxOutlineGeometry.unpack(boxGeometry, offset);
    }
    return BoxOutlineGeometry.createGeometry(boxGeometry);
  }

  return createBoxOutlineGeometry;

}));
//# sourceMappingURL=createBoxOutlineGeometry.js.map
