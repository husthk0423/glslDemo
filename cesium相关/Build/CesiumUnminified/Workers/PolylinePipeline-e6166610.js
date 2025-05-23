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

define(['exports', './Cartesian3-5587e0cf', './Cartesian2-b941a975', './defined-a5305fd6', './Check-0f680516', './EllipsoidGeodesic-04edecba', './EllipsoidRhumbLine-90229f69', './IntersectionTests-8d40a746', './Math-79d70b44', './Matrix2-81068516', './Plane-20e816c1'], (function (exports, Cartesian3, Cartesian2, defined, Check, EllipsoidGeodesic, EllipsoidRhumbLine, IntersectionTests, Math$1, Matrix2, Plane) { 'use strict';

  /**
   * @private
   */
  const PolylinePipeline = {};

  PolylinePipeline.numberOfPoints = function (p0, p1, minDistance) {
    const distance = Cartesian3.Cartesian3.distance(p0, p1);
    return Math.ceil(distance / minDistance);
  };

  PolylinePipeline.numberOfPointsRhumbLine = function (p0, p1, granularity) {
    const radiansDistanceSquared =
      Math.pow(p0.longitude - p1.longitude, 2) +
      Math.pow(p0.latitude - p1.latitude, 2);

    return Math.max(
      1,
      Math.ceil(Math.sqrt(radiansDistanceSquared / (granularity * granularity)))
    );
  };

  const cartoScratch = new Cartesian2.Cartographic();
  PolylinePipeline.extractHeights = function (positions, ellipsoid) {
    const length = positions.length;
    const heights = new Array(length);
    for (let i = 0; i < length; i++) {
      const p = positions[i];
      heights[i] = ellipsoid.cartesianToCartographic(p, cartoScratch).height;
    }
    return heights;
  };

  const wrapLongitudeInversMatrix = new Matrix2.Matrix4();
  const wrapLongitudeOrigin = new Cartesian3.Cartesian3();
  const wrapLongitudeXZNormal = new Cartesian3.Cartesian3();
  const wrapLongitudeXZPlane = new Plane.Plane(Cartesian3.Cartesian3.UNIT_X, 0.0);
  const wrapLongitudeYZNormal = new Cartesian3.Cartesian3();
  const wrapLongitudeYZPlane = new Plane.Plane(Cartesian3.Cartesian3.UNIT_X, 0.0);
  const wrapLongitudeIntersection = new Cartesian3.Cartesian3();
  const wrapLongitudeOffset = new Cartesian3.Cartesian3();

  const subdivideHeightsScratchArray = [];

  function subdivideHeights(numPoints, h0, h1) {
    const heights = subdivideHeightsScratchArray;
    heights.length = numPoints;

    let i;
    if (h0 === h1) {
      for (i = 0; i < numPoints; i++) {
        heights[i] = h0;
      }
      return heights;
    }

    const dHeight = h1 - h0;
    const heightPerVertex = dHeight / numPoints;

    for (i = 0; i < numPoints; i++) {
      const h = h0 + i * heightPerVertex;
      heights[i] = h;
    }

    return heights;
  }

  const carto1 = new Cartesian2.Cartographic();
  const carto2 = new Cartesian2.Cartographic();
  const cartesian = new Cartesian3.Cartesian3();
  const scaleFirst = new Cartesian3.Cartesian3();
  const scaleLast = new Cartesian3.Cartesian3();
  const ellipsoidGeodesic = new EllipsoidGeodesic.EllipsoidGeodesic();
  let ellipsoidRhumb = new EllipsoidRhumbLine.EllipsoidRhumbLine();

  //Returns subdivided line scaled to ellipsoid surface starting at p1 and ending at p2.
  //Result includes p1, but not include p2.  This function is called for a sequence of line segments,
  //and this prevents duplication of end point.
  function generateCartesianArc(
    p0,
    p1,
    minDistance,
    ellipsoid,
    h0,
    h1,
    array,
    offset
  ) {
    const first = ellipsoid.scaleToGeodeticSurface(p0, scaleFirst);
    const last = ellipsoid.scaleToGeodeticSurface(p1, scaleLast);
    const numPoints = PolylinePipeline.numberOfPoints(p0, p1, minDistance);
    const start = ellipsoid.cartesianToCartographic(first, carto1);
    const end = ellipsoid.cartesianToCartographic(last, carto2);
    const heights = subdivideHeights(numPoints, h0, h1);

    ellipsoidGeodesic.setEndPoints(start, end);
    const surfaceDistanceBetweenPoints =
      ellipsoidGeodesic.surfaceDistance / numPoints;

    let index = offset;
    start.height = h0;
    let cart = ellipsoid.cartographicToCartesian(start, cartesian);
    Cartesian3.Cartesian3.pack(cart, array, index);
    index += 3;

    for (let i = 1; i < numPoints; i++) {
      const carto = ellipsoidGeodesic.interpolateUsingSurfaceDistance(
        i * surfaceDistanceBetweenPoints,
        carto2
      );
      carto.height = heights[i];
      cart = ellipsoid.cartographicToCartesian(carto, cartesian);
      Cartesian3.Cartesian3.pack(cart, array, index);
      index += 3;
    }

    return index;
  }

  //Returns subdivided line scaled to ellipsoid surface starting at p1 and ending at p2.
  //Result includes p1, but not include p2.  This function is called for a sequence of line segments,
  //and this prevents duplication of end point.
  function generateCartesianRhumbArc(
    p0,
    p1,
    granularity,
    ellipsoid,
    h0,
    h1,
    array,
    offset
  ) {
    const start = ellipsoid.cartesianToCartographic(p0, carto1);
    const end = ellipsoid.cartesianToCartographic(p1, carto2);
    const numPoints = PolylinePipeline.numberOfPointsRhumbLine(
      start,
      end,
      granularity
    );
    start.height = 0.0;
    end.height = 0.0;
    const heights = subdivideHeights(numPoints, h0, h1);

    if (!ellipsoidRhumb.ellipsoid.equals(ellipsoid)) {
      ellipsoidRhumb = new EllipsoidRhumbLine.EllipsoidRhumbLine(undefined, undefined, ellipsoid);
    }
    ellipsoidRhumb.setEndPoints(start, end);
    const surfaceDistanceBetweenPoints =
      ellipsoidRhumb.surfaceDistance / numPoints;

    let index = offset;
    start.height = h0;
    let cart = ellipsoid.cartographicToCartesian(start, cartesian);
    Cartesian3.Cartesian3.pack(cart, array, index);
    index += 3;

    for (let i = 1; i < numPoints; i++) {
      const carto = ellipsoidRhumb.interpolateUsingSurfaceDistance(
        i * surfaceDistanceBetweenPoints,
        carto2
      );
      carto.height = heights[i];
      cart = ellipsoid.cartographicToCartesian(carto, cartesian);
      Cartesian3.Cartesian3.pack(cart, array, index);
      index += 3;
    }

    return index;
  }

  /**
   * Breaks a {@link Polyline} into segments such that it does not cross the &plusmn;180 degree meridian of an ellipsoid.
   *
   * @param {Cartesian3[]} positions The polyline's Cartesian positions.
   * @param {Matrix4} [modelMatrix=Matrix4.IDENTITY] The polyline's model matrix. Assumed to be an affine
   * transformation matrix, where the upper left 3x3 elements are a rotation matrix, and
   * the upper three elements in the fourth column are the translation.  The bottom row is assumed to be [0, 0, 0, 1].
   * The matrix is not verified to be in the proper form.
   * @returns {Object} An object with a <code>positions</code> property that is an array of positions and a
   * <code>segments</code> property.
   *
   *
   * @example
   * const polylines = new Cesium.PolylineCollection();
   * const polyline = polylines.add(...);
   * const positions = polyline.positions;
   * const modelMatrix = polylines.modelMatrix;
   * const segments = Cesium.PolylinePipeline.wrapLongitude(positions, modelMatrix);
   *
   * @see PolygonPipeline.wrapLongitude
   * @see Polyline
   * @see PolylineCollection
   */
  PolylinePipeline.wrapLongitude = function (positions, modelMatrix) {
    const cartesians = [];
    const segments = [];

    if (defined.defined(positions) && positions.length > 0) {
      modelMatrix = defined.defaultValue(modelMatrix, Matrix2.Matrix4.IDENTITY);
      const inverseModelMatrix = Matrix2.Matrix4.inverseTransformation(
        modelMatrix,
        wrapLongitudeInversMatrix
      );

      const origin = Matrix2.Matrix4.multiplyByPoint(
        inverseModelMatrix,
        Cartesian3.Cartesian3.ZERO,
        wrapLongitudeOrigin
      );
      const xzNormal = Cartesian3.Cartesian3.normalize(
        Matrix2.Matrix4.multiplyByPointAsVector(
          inverseModelMatrix,
          Cartesian3.Cartesian3.UNIT_Y,
          wrapLongitudeXZNormal
        ),
        wrapLongitudeXZNormal
      );
      const xzPlane = Plane.Plane.fromPointNormal(
        origin,
        xzNormal,
        wrapLongitudeXZPlane
      );
      const yzNormal = Cartesian3.Cartesian3.normalize(
        Matrix2.Matrix4.multiplyByPointAsVector(
          inverseModelMatrix,
          Cartesian3.Cartesian3.UNIT_X,
          wrapLongitudeYZNormal
        ),
        wrapLongitudeYZNormal
      );
      const yzPlane = Plane.Plane.fromPointNormal(
        origin,
        yzNormal,
        wrapLongitudeYZPlane
      );

      let count = 1;
      cartesians.push(Cartesian3.Cartesian3.clone(positions[0]));
      let prev = cartesians[0];

      const length = positions.length;
      for (let i = 1; i < length; ++i) {
        const cur = positions[i];

        // intersects the IDL if either endpoint is on the negative side of the yz-plane
        if (
          Plane.Plane.getPointDistance(yzPlane, prev) < 0.0 ||
          Plane.Plane.getPointDistance(yzPlane, cur) < 0.0
        ) {
          // and intersects the xz-plane
          const intersection = IntersectionTests.IntersectionTests.lineSegmentPlane(
            prev,
            cur,
            xzPlane,
            wrapLongitudeIntersection
          );
          if (defined.defined(intersection)) {
            // move point on the xz-plane slightly away from the plane
            const offset = Cartesian3.Cartesian3.multiplyByScalar(
              xzNormal,
              5.0e-9,
              wrapLongitudeOffset
            );
            if (Plane.Plane.getPointDistance(xzPlane, prev) < 0.0) {
              Cartesian3.Cartesian3.negate(offset, offset);
            }

            cartesians.push(
              Cartesian3.Cartesian3.add(intersection, offset, new Cartesian3.Cartesian3())
            );
            segments.push(count + 1);

            Cartesian3.Cartesian3.negate(offset, offset);
            cartesians.push(
              Cartesian3.Cartesian3.add(intersection, offset, new Cartesian3.Cartesian3())
            );
            count = 1;
          }
        }

        cartesians.push(Cartesian3.Cartesian3.clone(positions[i]));
        count++;

        prev = cur;
      }

      segments.push(count);
    }

    return {
      positions: cartesians,
      lengths: segments,
    };
  };

  /**
   * Subdivides polyline and raises all points to the specified height.  Returns an array of numbers to represent the positions.
   * @param {Object} options Object with the following properties:
   * @param {Cartesian3[]} options.positions The array of type {Cartesian3} representing positions.
   * @param {Number|Number[]} [options.height=0.0] A number or array of numbers representing the heights of each position.
   * @param {Number} [options.granularity = CesiumMath.RADIANS_PER_DEGREE] The distance, in radians, between each latitude and longitude. Determines the number of positions in the buffer.
   * @param {Ellipsoid} [options.ellipsoid=Ellipsoid.WGS84] The ellipsoid on which the positions lie.
   * @returns {Number[]} A new array of positions of type {Number} that have been subdivided and raised to the surface of the ellipsoid.
   *
   * @example
   * const positions = Cesium.Cartesian3.fromDegreesArray([
   *   -105.0, 40.0,
   *   -100.0, 38.0,
   *   -105.0, 35.0,
   *   -100.0, 32.0
   * ]);
   * const surfacePositions = Cesium.PolylinePipeline.generateArc({
   *   positons: positions
   * });
   */
  PolylinePipeline.generateArc = function (options) {
    if (!defined.defined(options)) {
      options = {};
    }
    const positions = options.positions;
    //>>includeStart('debug', pragmas.debug);
    if (!defined.defined(positions)) {
      throw new Check.DeveloperError("options.positions is required.");
    }
    //>>includeEnd('debug');

    const length = positions.length;
    const ellipsoid = defined.defaultValue(options.ellipsoid, Cartesian2.Ellipsoid.WGS84);
    let height = defined.defaultValue(options.height, 0);
    const hasHeightArray = Array.isArray(height);

    if (length < 1) {
      return [];
    } else if (length === 1) {
      const p = ellipsoid.scaleToGeodeticSurface(positions[0], scaleFirst);
      height = hasHeightArray ? height[0] : height;
      if (height !== 0) {
        const n = ellipsoid.geodeticSurfaceNormal(p, cartesian);
        Cartesian3.Cartesian3.multiplyByScalar(n, height, n);
        Cartesian3.Cartesian3.add(p, n, p);
      }

      return [p.x, p.y, p.z];
    }

    let minDistance = options.minDistance;
    if (!defined.defined(minDistance)) {
      const granularity = defined.defaultValue(
        options.granularity,
        Math$1.CesiumMath.RADIANS_PER_DEGREE
      );
      minDistance = Math$1.CesiumMath.chordLength(granularity, ellipsoid.maximumRadius);
    }

    let numPoints = 0;
    let i;

    for (i = 0; i < length - 1; i++) {
      numPoints += PolylinePipeline.numberOfPoints(
        positions[i],
        positions[i + 1],
        minDistance
      );
    }

    const arrayLength = (numPoints + 1) * 3;
    const newPositions = new Array(arrayLength);
    let offset = 0;

    for (i = 0; i < length - 1; i++) {
      const p0 = positions[i];
      const p1 = positions[i + 1];

      const h0 = hasHeightArray ? height[i] : height;
      const h1 = hasHeightArray ? height[i + 1] : height;

      offset = generateCartesianArc(
        p0,
        p1,
        minDistance,
        ellipsoid,
        h0,
        h1,
        newPositions,
        offset
      );
    }

    subdivideHeightsScratchArray.length = 0;

    const lastPoint = positions[length - 1];
    const carto = ellipsoid.cartesianToCartographic(lastPoint, carto1);
    carto.height = hasHeightArray ? height[length - 1] : height;
    const cart = ellipsoid.cartographicToCartesian(carto, cartesian);
    Cartesian3.Cartesian3.pack(cart, newPositions, arrayLength - 3);

    return newPositions;
  };

  const scratchCartographic0 = new Cartesian2.Cartographic();
  const scratchCartographic1 = new Cartesian2.Cartographic();

  /**
   * Subdivides polyline and raises all points to the specified height using Rhumb lines.  Returns an array of numbers to represent the positions.
   * @param {Object} options Object with the following properties:
   * @param {Cartesian3[]} options.positions The array of type {Cartesian3} representing positions.
   * @param {Number|Number[]} [options.height=0.0] A number or array of numbers representing the heights of each position.
   * @param {Number} [options.granularity = CesiumMath.RADIANS_PER_DEGREE] The distance, in radians, between each latitude and longitude. Determines the number of positions in the buffer.
   * @param {Ellipsoid} [options.ellipsoid=Ellipsoid.WGS84] The ellipsoid on which the positions lie.
   * @returns {Number[]} A new array of positions of type {Number} that have been subdivided and raised to the surface of the ellipsoid.
   *
   * @example
   * const positions = Cesium.Cartesian3.fromDegreesArray([
   *   -105.0, 40.0,
   *   -100.0, 38.0,
   *   -105.0, 35.0,
   *   -100.0, 32.0
   * ]);
   * const surfacePositions = Cesium.PolylinePipeline.generateRhumbArc({
   *   positons: positions
   * });
   */
  PolylinePipeline.generateRhumbArc = function (options) {
    if (!defined.defined(options)) {
      options = {};
    }
    const positions = options.positions;
    //>>includeStart('debug', pragmas.debug);
    if (!defined.defined(positions)) {
      throw new Check.DeveloperError("options.positions is required.");
    }
    //>>includeEnd('debug');

    const length = positions.length;
    const ellipsoid = defined.defaultValue(options.ellipsoid, Cartesian2.Ellipsoid.WGS84);
    let height = defined.defaultValue(options.height, 0);
    const hasHeightArray = Array.isArray(height);

    if (length < 1) {
      return [];
    } else if (length === 1) {
      const p = ellipsoid.scaleToGeodeticSurface(positions[0], scaleFirst);
      height = hasHeightArray ? height[0] : height;
      if (height !== 0) {
        const n = ellipsoid.geodeticSurfaceNormal(p, cartesian);
        Cartesian3.Cartesian3.multiplyByScalar(n, height, n);
        Cartesian3.Cartesian3.add(p, n, p);
      }

      return [p.x, p.y, p.z];
    }

    const granularity = defined.defaultValue(
      options.granularity,
      Math$1.CesiumMath.RADIANS_PER_DEGREE
    );

    let numPoints = 0;
    let i;

    let c0 = ellipsoid.cartesianToCartographic(
      positions[0],
      scratchCartographic0
    );
    let c1;
    for (i = 0; i < length - 1; i++) {
      c1 = ellipsoid.cartesianToCartographic(
        positions[i + 1],
        scratchCartographic1
      );
      numPoints += PolylinePipeline.numberOfPointsRhumbLine(c0, c1, granularity);
      c0 = Cartesian2.Cartographic.clone(c1, scratchCartographic0);
    }

    const arrayLength = (numPoints + 1) * 3;
    const newPositions = new Array(arrayLength);
    let offset = 0;

    for (i = 0; i < length - 1; i++) {
      const p0 = positions[i];
      const p1 = positions[i + 1];

      const h0 = hasHeightArray ? height[i] : height;
      const h1 = hasHeightArray ? height[i + 1] : height;

      offset = generateCartesianRhumbArc(
        p0,
        p1,
        granularity,
        ellipsoid,
        h0,
        h1,
        newPositions,
        offset
      );
    }

    subdivideHeightsScratchArray.length = 0;

    const lastPoint = positions[length - 1];
    const carto = ellipsoid.cartesianToCartographic(lastPoint, carto1);
    carto.height = hasHeightArray ? height[length - 1] : height;
    const cart = ellipsoid.cartographicToCartesian(carto, cartesian);
    Cartesian3.Cartesian3.pack(cart, newPositions, arrayLength - 3);

    return newPositions;
  };

  /**
   * Subdivides polyline and raises all points to the specified height. Returns an array of new {Cartesian3} positions.
   * @param {Object} options Object with the following properties:
   * @param {Cartesian3[]} options.positions The array of type {Cartesian3} representing positions.
   * @param {Number|Number[]} [options.height=0.0] A number or array of numbers representing the heights of each position.
   * @param {Number} [options.granularity = CesiumMath.RADIANS_PER_DEGREE] The distance, in radians, between each latitude and longitude. Determines the number of positions in the buffer.
   * @param {Ellipsoid} [options.ellipsoid=Ellipsoid.WGS84] The ellipsoid on which the positions lie.
   * @returns {Cartesian3[]} A new array of cartesian3 positions that have been subdivided and raised to the surface of the ellipsoid.
   *
   * @example
   * const positions = Cesium.Cartesian3.fromDegreesArray([
   *   -105.0, 40.0,
   *   -100.0, 38.0,
   *   -105.0, 35.0,
   *   -100.0, 32.0
   * ]);
   * const surfacePositions = Cesium.PolylinePipeline.generateCartesianArc({
   *   positons: positions
   * });
   */
  PolylinePipeline.generateCartesianArc = function (options) {
    const numberArray = PolylinePipeline.generateArc(options);
    const size = numberArray.length / 3;
    const newPositions = new Array(size);
    for (let i = 0; i < size; i++) {
      newPositions[i] = Cartesian3.Cartesian3.unpack(numberArray, i * 3);
    }
    return newPositions;
  };

  /**
   * Subdivides polyline and raises all points to the specified height using Rhumb Lines. Returns an array of new {Cartesian3} positions.
   * @param {Object} options Object with the following properties:
   * @param {Cartesian3[]} options.positions The array of type {Cartesian3} representing positions.
   * @param {Number|Number[]} [options.height=0.0] A number or array of numbers representing the heights of each position.
   * @param {Number} [options.granularity = CesiumMath.RADIANS_PER_DEGREE] The distance, in radians, between each latitude and longitude. Determines the number of positions in the buffer.
   * @param {Ellipsoid} [options.ellipsoid=Ellipsoid.WGS84] The ellipsoid on which the positions lie.
   * @returns {Cartesian3[]} A new array of cartesian3 positions that have been subdivided and raised to the surface of the ellipsoid.
   *
   * @example
   * const positions = Cesium.Cartesian3.fromDegreesArray([
   *   -105.0, 40.0,
   *   -100.0, 38.0,
   *   -105.0, 35.0,
   *   -100.0, 32.0
   * ]);
   * const surfacePositions = Cesium.PolylinePipeline.generateCartesianRhumbArc({
   *   positons: positions
   * });
   */
  PolylinePipeline.generateCartesianRhumbArc = function (options) {
    const numberArray = PolylinePipeline.generateRhumbArc(options);
    const size = numberArray.length / 3;
    const newPositions = new Array(size);
    for (let i = 0; i < size; i++) {
      newPositions[i] = Cartesian3.Cartesian3.unpack(numberArray, i * 3);
    }
    return newPositions;
  };
  var PolylinePipeline$1 = PolylinePipeline;

  exports.PolylinePipeline = PolylinePipeline$1;

}));
//# sourceMappingURL=PolylinePipeline-e6166610.js.map
