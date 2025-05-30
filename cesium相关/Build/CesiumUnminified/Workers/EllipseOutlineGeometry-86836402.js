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

define(['exports', './Transforms-e81b498a', './Cartesian3-5587e0cf', './ComponentDatatype-4ab1a86a', './defined-a5305fd6', './Check-0f680516', './EllipseGeometryLibrary-fb14daaf', './Cartesian2-b941a975', './GeometryAttribute-a065274b', './GeometryAttributes-ae79d5fa', './GeometryOffsetAttribute-102da468', './IndexDatatype-be8e0e62', './Math-79d70b44'], (function (exports, Transforms, Cartesian3, ComponentDatatype, defined, Check, EllipseGeometryLibrary, Cartesian2, GeometryAttribute, GeometryAttributes, GeometryOffsetAttribute, IndexDatatype, Math$1) { 'use strict';

  const scratchCartesian1 = new Cartesian3.Cartesian3();
  let boundingSphereCenter = new Cartesian3.Cartesian3();

  function computeEllipse(options) {
    const center = options.center;
    boundingSphereCenter = Cartesian3.Cartesian3.multiplyByScalar(
      options.ellipsoid.geodeticSurfaceNormal(center, boundingSphereCenter),
      options.height,
      boundingSphereCenter
    );
    boundingSphereCenter = Cartesian3.Cartesian3.add(
      center,
      boundingSphereCenter,
      boundingSphereCenter
    );
    const boundingSphere = new Transforms.BoundingSphere(
      boundingSphereCenter,
      options.semiMajorAxis
    );
    const positions = EllipseGeometryLibrary.EllipseGeometryLibrary.computeEllipsePositions(
      options,
      false,
      true
    ).outerPositions;

    const attributes = new GeometryAttributes.GeometryAttributes({
      position: new GeometryAttribute.GeometryAttribute({
        componentDatatype: ComponentDatatype.ComponentDatatype.DOUBLE,
        componentsPerAttribute: 3,
        values: EllipseGeometryLibrary.EllipseGeometryLibrary.raisePositionsToHeight(
          positions,
          options,
          false
        ),
      }),
    });

    const length = positions.length / 3;
    const indices = IndexDatatype.IndexDatatype.createTypedArray(length, length * 2);
    let index = 0;
    for (let i = 0; i < length; ++i) {
      indices[index++] = i;
      indices[index++] = (i + 1) % length;
    }

    return {
      boundingSphere: boundingSphere,
      attributes: attributes,
      indices: indices,
    };
  }

  const topBoundingSphere = new Transforms.BoundingSphere();
  const bottomBoundingSphere = new Transforms.BoundingSphere();
  function computeExtrudedEllipse(options) {
    const center = options.center;
    const ellipsoid = options.ellipsoid;
    const semiMajorAxis = options.semiMajorAxis;
    let scaledNormal = Cartesian3.Cartesian3.multiplyByScalar(
      ellipsoid.geodeticSurfaceNormal(center, scratchCartesian1),
      options.height,
      scratchCartesian1
    );
    topBoundingSphere.center = Cartesian3.Cartesian3.add(
      center,
      scaledNormal,
      topBoundingSphere.center
    );
    topBoundingSphere.radius = semiMajorAxis;

    scaledNormal = Cartesian3.Cartesian3.multiplyByScalar(
      ellipsoid.geodeticSurfaceNormal(center, scaledNormal),
      options.extrudedHeight,
      scaledNormal
    );
    bottomBoundingSphere.center = Cartesian3.Cartesian3.add(
      center,
      scaledNormal,
      bottomBoundingSphere.center
    );
    bottomBoundingSphere.radius = semiMajorAxis;

    let positions = EllipseGeometryLibrary.EllipseGeometryLibrary.computeEllipsePositions(
      options,
      false,
      true
    ).outerPositions;
    const attributes = new GeometryAttributes.GeometryAttributes({
      position: new GeometryAttribute.GeometryAttribute({
        componentDatatype: ComponentDatatype.ComponentDatatype.DOUBLE,
        componentsPerAttribute: 3,
        values: EllipseGeometryLibrary.EllipseGeometryLibrary.raisePositionsToHeight(
          positions,
          options,
          true
        ),
      }),
    });

    positions = attributes.position.values;
    const boundingSphere = Transforms.BoundingSphere.union(
      topBoundingSphere,
      bottomBoundingSphere
    );
    let length = positions.length / 3;

    if (defined.defined(options.offsetAttribute)) {
      let applyOffset = new Uint8Array(length);
      if (options.offsetAttribute === GeometryOffsetAttribute.GeometryOffsetAttribute.TOP) {
        applyOffset = applyOffset.fill(1, 0, length / 2);
      } else {
        const offsetValue =
          options.offsetAttribute === GeometryOffsetAttribute.GeometryOffsetAttribute.NONE ? 0 : 1;
        applyOffset = applyOffset.fill(offsetValue);
      }

      attributes.applyOffset = new GeometryAttribute.GeometryAttribute({
        componentDatatype: ComponentDatatype.ComponentDatatype.UNSIGNED_BYTE,
        componentsPerAttribute: 1,
        values: applyOffset,
      });
    }

    let numberOfVerticalLines = defined.defaultValue(options.numberOfVerticalLines, 16);
    numberOfVerticalLines = Math$1.CesiumMath.clamp(
      numberOfVerticalLines,
      0,
      length / 2
    );

    const indices = IndexDatatype.IndexDatatype.createTypedArray(
      length,
      length * 2 + numberOfVerticalLines * 2
    );

    length /= 2;
    let index = 0;
    let i;
    for (i = 0; i < length; ++i) {
      indices[index++] = i;
      indices[index++] = (i + 1) % length;
      indices[index++] = i + length;
      indices[index++] = ((i + 1) % length) + length;
    }

    let numSide;
    if (numberOfVerticalLines > 0) {
      const numSideLines = Math.min(numberOfVerticalLines, length);
      numSide = Math.round(length / numSideLines);

      const maxI = Math.min(numSide * numberOfVerticalLines, length);
      for (i = 0; i < maxI; i += numSide) {
        indices[index++] = i;
        indices[index++] = i + length;
      }
    }

    return {
      boundingSphere: boundingSphere,
      attributes: attributes,
      indices: indices,
    };
  }

  /**
   * A description of the outline of an ellipse on an ellipsoid.
   *
   * @alias EllipseOutlineGeometry
   * @constructor
   *
   * @param {Object} options Object with the following properties:
   * @param {Cartesian3} options.center The ellipse's center point in the fixed frame.
   * @param {Number} options.semiMajorAxis The length of the ellipse's semi-major axis in meters.
   * @param {Number} options.semiMinorAxis The length of the ellipse's semi-minor axis in meters.
   * @param {Ellipsoid} [options.ellipsoid=Ellipsoid.WGS84] The ellipsoid the ellipse will be on.
   * @param {Number} [options.height=0.0] The distance in meters between the ellipse and the ellipsoid surface.
   * @param {Number} [options.extrudedHeight] The distance in meters between the ellipse's extruded face and the ellipsoid surface.
   * @param {Number} [options.rotation=0.0] The angle from north (counter-clockwise) in radians.
   * @param {Number} [options.granularity=0.02] The angular distance between points on the ellipse in radians.
   * @param {Number} [options.numberOfVerticalLines=16] Number of lines to draw between the top and bottom surface of an extruded ellipse.
   *
   * @exception {DeveloperError} semiMajorAxis and semiMinorAxis must be greater than zero.
   * @exception {DeveloperError} semiMajorAxis must be greater than or equal to the semiMinorAxis.
   * @exception {DeveloperError} granularity must be greater than zero.
   *
   * @see EllipseOutlineGeometry.createGeometry
   *
   * @example
   * const ellipse = new Cesium.EllipseOutlineGeometry({
   *   center : Cesium.Cartesian3.fromDegrees(-75.59777, 40.03883),
   *   semiMajorAxis : 500000.0,
   *   semiMinorAxis : 300000.0,
   *   rotation : Cesium.Math.toRadians(60.0)
   * });
   * const geometry = Cesium.EllipseOutlineGeometry.createGeometry(ellipse);
   */
  function EllipseOutlineGeometry(options) {
    options = defined.defaultValue(options, defined.defaultValue.EMPTY_OBJECT);

    const center = options.center;
    const ellipsoid = defined.defaultValue(options.ellipsoid, Cartesian2.Ellipsoid.WGS84);
    const semiMajorAxis = options.semiMajorAxis;
    const semiMinorAxis = options.semiMinorAxis;
    const granularity = defined.defaultValue(
      options.granularity,
      Math$1.CesiumMath.RADIANS_PER_DEGREE
    );

    //>>includeStart('debug', pragmas.debug);
    if (!defined.defined(center)) {
      throw new Check.DeveloperError("center is required.");
    }
    if (!defined.defined(semiMajorAxis)) {
      throw new Check.DeveloperError("semiMajorAxis is required.");
    }
    if (!defined.defined(semiMinorAxis)) {
      throw new Check.DeveloperError("semiMinorAxis is required.");
    }
    if (semiMajorAxis < semiMinorAxis) {
      throw new Check.DeveloperError(
        "semiMajorAxis must be greater than or equal to the semiMinorAxis."
      );
    }
    if (granularity <= 0.0) {
      throw new Check.DeveloperError("granularity must be greater than zero.");
    }
    //>>includeEnd('debug');

    const height = defined.defaultValue(options.height, 0.0);
    const extrudedHeight = defined.defaultValue(options.extrudedHeight, height);

    this._center = Cartesian3.Cartesian3.clone(center);
    this._semiMajorAxis = semiMajorAxis;
    this._semiMinorAxis = semiMinorAxis;
    this._ellipsoid = Cartesian2.Ellipsoid.clone(ellipsoid);
    this._rotation = defined.defaultValue(options.rotation, 0.0);
    this._height = Math.max(extrudedHeight, height);
    this._granularity = granularity;
    this._extrudedHeight = Math.min(extrudedHeight, height);
    this._numberOfVerticalLines = Math.max(
      defined.defaultValue(options.numberOfVerticalLines, 16),
      0
    );
    this._offsetAttribute = options.offsetAttribute;
    this._workerName = "createEllipseOutlineGeometry";
  }

  /**
   * The number of elements used to pack the object into an array.
   * @type {Number}
   */
  EllipseOutlineGeometry.packedLength =
    Cartesian3.Cartesian3.packedLength + Cartesian2.Ellipsoid.packedLength + 8;

  /**
   * Stores the provided instance into the provided array.
   *
   * @param {EllipseOutlineGeometry} value The value to pack.
   * @param {Number[]} array The array to pack into.
   * @param {Number} [startingIndex=0] The index into the array at which to start packing the elements.
   *
   * @returns {Number[]} The array that was packed into
   */
  EllipseOutlineGeometry.pack = function (value, array, startingIndex) {
    //>>includeStart('debug', pragmas.debug);
    if (!defined.defined(value)) {
      throw new Check.DeveloperError("value is required");
    }
    if (!defined.defined(array)) {
      throw new Check.DeveloperError("array is required");
    }
    //>>includeEnd('debug');

    startingIndex = defined.defaultValue(startingIndex, 0);

    Cartesian3.Cartesian3.pack(value._center, array, startingIndex);
    startingIndex += Cartesian3.Cartesian3.packedLength;

    Cartesian2.Ellipsoid.pack(value._ellipsoid, array, startingIndex);
    startingIndex += Cartesian2.Ellipsoid.packedLength;

    array[startingIndex++] = value._semiMajorAxis;
    array[startingIndex++] = value._semiMinorAxis;
    array[startingIndex++] = value._rotation;
    array[startingIndex++] = value._height;
    array[startingIndex++] = value._granularity;
    array[startingIndex++] = value._extrudedHeight;
    array[startingIndex++] = value._numberOfVerticalLines;
    array[startingIndex] = defined.defaultValue(value._offsetAttribute, -1);

    return array;
  };

  const scratchCenter = new Cartesian3.Cartesian3();
  const scratchEllipsoid = new Cartesian2.Ellipsoid();
  const scratchOptions = {
    center: scratchCenter,
    ellipsoid: scratchEllipsoid,
    semiMajorAxis: undefined,
    semiMinorAxis: undefined,
    rotation: undefined,
    height: undefined,
    granularity: undefined,
    extrudedHeight: undefined,
    numberOfVerticalLines: undefined,
    offsetAttribute: undefined,
  };

  /**
   * Retrieves an instance from a packed array.
   *
   * @param {Number[]} array The packed array.
   * @param {Number} [startingIndex=0] The starting index of the element to be unpacked.
   * @param {EllipseOutlineGeometry} [result] The object into which to store the result.
   * @returns {EllipseOutlineGeometry} The modified result parameter or a new EllipseOutlineGeometry instance if one was not provided.
   */
  EllipseOutlineGeometry.unpack = function (array, startingIndex, result) {
    //>>includeStart('debug', pragmas.debug);
    if (!defined.defined(array)) {
      throw new Check.DeveloperError("array is required");
    }
    //>>includeEnd('debug');

    startingIndex = defined.defaultValue(startingIndex, 0);

    const center = Cartesian3.Cartesian3.unpack(array, startingIndex, scratchCenter);
    startingIndex += Cartesian3.Cartesian3.packedLength;

    const ellipsoid = Cartesian2.Ellipsoid.unpack(array, startingIndex, scratchEllipsoid);
    startingIndex += Cartesian2.Ellipsoid.packedLength;

    const semiMajorAxis = array[startingIndex++];
    const semiMinorAxis = array[startingIndex++];
    const rotation = array[startingIndex++];
    const height = array[startingIndex++];
    const granularity = array[startingIndex++];
    const extrudedHeight = array[startingIndex++];
    const numberOfVerticalLines = array[startingIndex++];
    const offsetAttribute = array[startingIndex];

    if (!defined.defined(result)) {
      scratchOptions.height = height;
      scratchOptions.extrudedHeight = extrudedHeight;
      scratchOptions.granularity = granularity;
      scratchOptions.rotation = rotation;
      scratchOptions.semiMajorAxis = semiMajorAxis;
      scratchOptions.semiMinorAxis = semiMinorAxis;
      scratchOptions.numberOfVerticalLines = numberOfVerticalLines;
      scratchOptions.offsetAttribute =
        offsetAttribute === -1 ? undefined : offsetAttribute;

      return new EllipseOutlineGeometry(scratchOptions);
    }

    result._center = Cartesian3.Cartesian3.clone(center, result._center);
    result._ellipsoid = Cartesian2.Ellipsoid.clone(ellipsoid, result._ellipsoid);
    result._semiMajorAxis = semiMajorAxis;
    result._semiMinorAxis = semiMinorAxis;
    result._rotation = rotation;
    result._height = height;
    result._granularity = granularity;
    result._extrudedHeight = extrudedHeight;
    result._numberOfVerticalLines = numberOfVerticalLines;
    result._offsetAttribute =
      offsetAttribute === -1 ? undefined : offsetAttribute;

    return result;
  };

  /**
   * Computes the geometric representation of an outline of an ellipse on an ellipsoid, including its vertices, indices, and a bounding sphere.
   *
   * @param {EllipseOutlineGeometry} ellipseGeometry A description of the ellipse.
   * @returns {Geometry|undefined} The computed vertices and indices.
   */
  EllipseOutlineGeometry.createGeometry = function (ellipseGeometry) {
    if (
      ellipseGeometry._semiMajorAxis <= 0.0 ||
      ellipseGeometry._semiMinorAxis <= 0.0
    ) {
      return;
    }

    const height = ellipseGeometry._height;
    const extrudedHeight = ellipseGeometry._extrudedHeight;
    const extrude = !Math$1.CesiumMath.equalsEpsilon(
      height,
      extrudedHeight,
      0,
      Math$1.CesiumMath.EPSILON2
    );

    ellipseGeometry._center = ellipseGeometry._ellipsoid.scaleToGeodeticSurface(
      ellipseGeometry._center,
      ellipseGeometry._center
    );
    const options = {
      center: ellipseGeometry._center,
      semiMajorAxis: ellipseGeometry._semiMajorAxis,
      semiMinorAxis: ellipseGeometry._semiMinorAxis,
      ellipsoid: ellipseGeometry._ellipsoid,
      rotation: ellipseGeometry._rotation,
      height: height,
      granularity: ellipseGeometry._granularity,
      numberOfVerticalLines: ellipseGeometry._numberOfVerticalLines,
    };
    let geometry;
    if (extrude) {
      options.extrudedHeight = extrudedHeight;
      options.offsetAttribute = ellipseGeometry._offsetAttribute;
      geometry = computeExtrudedEllipse(options);
    } else {
      geometry = computeEllipse(options);

      if (defined.defined(ellipseGeometry._offsetAttribute)) {
        const length = geometry.attributes.position.values.length;
        const offsetValue =
          ellipseGeometry._offsetAttribute === GeometryOffsetAttribute.GeometryOffsetAttribute.NONE
            ? 0
            : 1;
        const applyOffset = new Uint8Array(length / 3).fill(offsetValue);
        geometry.attributes.applyOffset = new GeometryAttribute.GeometryAttribute({
          componentDatatype: ComponentDatatype.ComponentDatatype.UNSIGNED_BYTE,
          componentsPerAttribute: 1,
          values: applyOffset,
        });
      }
    }

    return new GeometryAttribute.Geometry({
      attributes: geometry.attributes,
      indices: geometry.indices,
      primitiveType: GeometryAttribute.PrimitiveType.LINES,
      boundingSphere: geometry.boundingSphere,
      offsetAttribute: ellipseGeometry._offsetAttribute,
    });
  };

  exports.EllipseOutlineGeometry = EllipseOutlineGeometry;

}));
//# sourceMappingURL=EllipseOutlineGeometry-86836402.js.map
