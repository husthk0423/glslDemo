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

define(['exports', './Cartesian3-5587e0cf', './Cartesian2-b941a975', './Check-0f680516', './defined-a5305fd6', './GeographicProjection-bcd5d069', './Math-79d70b44', './Matrix2-81068516', './Resource-0c25a925', './RuntimeError-8d8b6ef6'], (function (exports, Cartesian3, Cartesian2, Check, defined, GeographicProjection, Math$1, Matrix2, Resource, RuntimeError) { 'use strict';

  /**
   * This enumerated type is used in determining where, relative to the frustum, an
   * object is located. The object can either be fully contained within the frustum (INSIDE),
   * partially inside the frustum and partially outside (INTERSECTING), or somewhere entirely
   * outside of the frustum's 6 planes (OUTSIDE).
   *
   * @enum {Number}
   */
  const Intersect = {
    /**
     * Represents that an object is not contained within the frustum.
     *
     * @type {Number}
     * @constant
     */
    OUTSIDE: -1,

    /**
     * Represents that an object intersects one of the frustum's planes.
     *
     * @type {Number}
     * @constant
     */
    INTERSECTING: 0,

    /**
     * Represents that an object is fully within the frustum.
     *
     * @type {Number}
     * @constant
     */
    INSIDE: 1,
  };
  var Intersect$1 = Object.freeze(Intersect);

  /**
   * Represents the closed interval [start, stop].
   * @alias Interval
   * @constructor
   *
   * @param {Number} [start=0.0] The beginning of the interval.
   * @param {Number} [stop=0.0] The end of the interval.
   */
  function Interval(start, stop) {
    /**
     * The beginning of the interval.
     * @type {Number}
     * @default 0.0
     */
    this.start = defined.defaultValue(start, 0.0);
    /**
     * The end of the interval.
     * @type {Number}
     * @default 0.0
     */
    this.stop = defined.defaultValue(stop, 0.0);
  }

  /**
   * A bounding sphere with a center and a radius.
   * @alias BoundingSphere
   * @constructor
   *
   * @param {Cartesian3} [center=Cartesian3.ZERO] The center of the bounding sphere.
   * @param {Number} [radius=0.0] The radius of the bounding sphere.
   *
   * @see AxisAlignedBoundingBox
   * @see BoundingRectangle
   * @see Packable
   */
  function BoundingSphere(center, radius) {
    /**
     * The center point of the sphere.
     * @type {Cartesian3}
     * @default {@link Cartesian3.ZERO}
     */
    this.center = Cartesian3.Cartesian3.clone(defined.defaultValue(center, Cartesian3.Cartesian3.ZERO));

    /**
     * The radius of the sphere.
     * @type {Number}
     * @default 0.0
     */
    this.radius = defined.defaultValue(radius, 0.0);
  }

  const fromPointsXMin = new Cartesian3.Cartesian3();
  const fromPointsYMin = new Cartesian3.Cartesian3();
  const fromPointsZMin = new Cartesian3.Cartesian3();
  const fromPointsXMax = new Cartesian3.Cartesian3();
  const fromPointsYMax = new Cartesian3.Cartesian3();
  const fromPointsZMax = new Cartesian3.Cartesian3();
  const fromPointsCurrentPos = new Cartesian3.Cartesian3();
  const fromPointsScratch = new Cartesian3.Cartesian3();
  const fromPointsRitterCenter = new Cartesian3.Cartesian3();
  const fromPointsMinBoxPt = new Cartesian3.Cartesian3();
  const fromPointsMaxBoxPt = new Cartesian3.Cartesian3();
  const fromPointsNaiveCenterScratch = new Cartesian3.Cartesian3();
  const volumeConstant = (4.0 / 3.0) * Math$1.CesiumMath.PI;

  /**
   * Computes a tight-fitting bounding sphere enclosing a list of 3D Cartesian points.
   * The bounding sphere is computed by running two algorithms, a naive algorithm and
   * Ritter's algorithm. The smaller of the two spheres is used to ensure a tight fit.
   *
   * @param {Cartesian3[]} [positions] An array of points that the bounding sphere will enclose.  Each point must have <code>x</code>, <code>y</code>, and <code>z</code> properties.
   * @param {BoundingSphere} [result] The object onto which to store the result.
   * @returns {BoundingSphere} The modified result parameter or a new BoundingSphere instance if one was not provided.
   *
   * @see {@link http://help.agi.com/AGIComponents/html/BlogBoundingSphere.htm|Bounding Sphere computation article}
   */
  BoundingSphere.fromPoints = function (positions, result) {
    if (!defined.defined(result)) {
      result = new BoundingSphere();
    }

    if (!defined.defined(positions) || positions.length === 0) {
      result.center = Cartesian3.Cartesian3.clone(Cartesian3.Cartesian3.ZERO, result.center);
      result.radius = 0.0;
      return result;
    }

    const currentPos = Cartesian3.Cartesian3.clone(positions[0], fromPointsCurrentPos);

    const xMin = Cartesian3.Cartesian3.clone(currentPos, fromPointsXMin);
    const yMin = Cartesian3.Cartesian3.clone(currentPos, fromPointsYMin);
    const zMin = Cartesian3.Cartesian3.clone(currentPos, fromPointsZMin);

    const xMax = Cartesian3.Cartesian3.clone(currentPos, fromPointsXMax);
    const yMax = Cartesian3.Cartesian3.clone(currentPos, fromPointsYMax);
    const zMax = Cartesian3.Cartesian3.clone(currentPos, fromPointsZMax);

    const numPositions = positions.length;
    let i;
    for (i = 1; i < numPositions; i++) {
      Cartesian3.Cartesian3.clone(positions[i], currentPos);

      const x = currentPos.x;
      const y = currentPos.y;
      const z = currentPos.z;

      // Store points containing the the smallest and largest components
      if (x < xMin.x) {
        Cartesian3.Cartesian3.clone(currentPos, xMin);
      }

      if (x > xMax.x) {
        Cartesian3.Cartesian3.clone(currentPos, xMax);
      }

      if (y < yMin.y) {
        Cartesian3.Cartesian3.clone(currentPos, yMin);
      }

      if (y > yMax.y) {
        Cartesian3.Cartesian3.clone(currentPos, yMax);
      }

      if (z < zMin.z) {
        Cartesian3.Cartesian3.clone(currentPos, zMin);
      }

      if (z > zMax.z) {
        Cartesian3.Cartesian3.clone(currentPos, zMax);
      }
    }

    // Compute x-, y-, and z-spans (Squared distances b/n each component's min. and max.).
    const xSpan = Cartesian3.Cartesian3.magnitudeSquared(
      Cartesian3.Cartesian3.subtract(xMax, xMin, fromPointsScratch)
    );
    const ySpan = Cartesian3.Cartesian3.magnitudeSquared(
      Cartesian3.Cartesian3.subtract(yMax, yMin, fromPointsScratch)
    );
    const zSpan = Cartesian3.Cartesian3.magnitudeSquared(
      Cartesian3.Cartesian3.subtract(zMax, zMin, fromPointsScratch)
    );

    // Set the diameter endpoints to the largest span.
    let diameter1 = xMin;
    let diameter2 = xMax;
    let maxSpan = xSpan;
    if (ySpan > maxSpan) {
      maxSpan = ySpan;
      diameter1 = yMin;
      diameter2 = yMax;
    }
    if (zSpan > maxSpan) {
      maxSpan = zSpan;
      diameter1 = zMin;
      diameter2 = zMax;
    }

    // Calculate the center of the initial sphere found by Ritter's algorithm
    const ritterCenter = fromPointsRitterCenter;
    ritterCenter.x = (diameter1.x + diameter2.x) * 0.5;
    ritterCenter.y = (diameter1.y + diameter2.y) * 0.5;
    ritterCenter.z = (diameter1.z + diameter2.z) * 0.5;

    // Calculate the radius of the initial sphere found by Ritter's algorithm
    let radiusSquared = Cartesian3.Cartesian3.magnitudeSquared(
      Cartesian3.Cartesian3.subtract(diameter2, ritterCenter, fromPointsScratch)
    );
    let ritterRadius = Math.sqrt(radiusSquared);

    // Find the center of the sphere found using the Naive method.
    const minBoxPt = fromPointsMinBoxPt;
    minBoxPt.x = xMin.x;
    minBoxPt.y = yMin.y;
    minBoxPt.z = zMin.z;

    const maxBoxPt = fromPointsMaxBoxPt;
    maxBoxPt.x = xMax.x;
    maxBoxPt.y = yMax.y;
    maxBoxPt.z = zMax.z;

    const naiveCenter = Cartesian3.Cartesian3.midpoint(
      minBoxPt,
      maxBoxPt,
      fromPointsNaiveCenterScratch
    );

    // Begin 2nd pass to find naive radius and modify the ritter sphere.
    let naiveRadius = 0;
    for (i = 0; i < numPositions; i++) {
      Cartesian3.Cartesian3.clone(positions[i], currentPos);

      // Find the furthest point from the naive center to calculate the naive radius.
      const r = Cartesian3.Cartesian3.magnitude(
        Cartesian3.Cartesian3.subtract(currentPos, naiveCenter, fromPointsScratch)
      );
      if (r > naiveRadius) {
        naiveRadius = r;
      }

      // Make adjustments to the Ritter Sphere to include all points.
      const oldCenterToPointSquared = Cartesian3.Cartesian3.magnitudeSquared(
        Cartesian3.Cartesian3.subtract(currentPos, ritterCenter, fromPointsScratch)
      );
      if (oldCenterToPointSquared > radiusSquared) {
        const oldCenterToPoint = Math.sqrt(oldCenterToPointSquared);
        // Calculate new radius to include the point that lies outside
        ritterRadius = (ritterRadius + oldCenterToPoint) * 0.5;
        radiusSquared = ritterRadius * ritterRadius;
        // Calculate center of new Ritter sphere
        const oldToNew = oldCenterToPoint - ritterRadius;
        ritterCenter.x =
          (ritterRadius * ritterCenter.x + oldToNew * currentPos.x) /
          oldCenterToPoint;
        ritterCenter.y =
          (ritterRadius * ritterCenter.y + oldToNew * currentPos.y) /
          oldCenterToPoint;
        ritterCenter.z =
          (ritterRadius * ritterCenter.z + oldToNew * currentPos.z) /
          oldCenterToPoint;
      }
    }

    if (ritterRadius < naiveRadius) {
      Cartesian3.Cartesian3.clone(ritterCenter, result.center);
      result.radius = ritterRadius;
    } else {
      Cartesian3.Cartesian3.clone(naiveCenter, result.center);
      result.radius = naiveRadius;
    }

    return result;
  };

  const defaultProjection = new GeographicProjection.GeographicProjection();
  const fromRectangle2DLowerLeft = new Cartesian3.Cartesian3();
  const fromRectangle2DUpperRight = new Cartesian3.Cartesian3();
  const fromRectangle2DSouthwest = new Cartesian2.Cartographic();
  const fromRectangle2DNortheast = new Cartesian2.Cartographic();

  /**
   * Computes a bounding sphere from a rectangle projected in 2D.
   *
   * @param {Rectangle} [rectangle] The rectangle around which to create a bounding sphere.
   * @param {Object} [projection=GeographicProjection] The projection used to project the rectangle into 2D.
   * @param {BoundingSphere} [result] The object onto which to store the result.
   * @returns {BoundingSphere} The modified result parameter or a new BoundingSphere instance if none was provided.
   */
  BoundingSphere.fromRectangle2D = function (rectangle, projection, result) {
    return BoundingSphere.fromRectangleWithHeights2D(
      rectangle,
      projection,
      0.0,
      0.0,
      result
    );
  };

  /**
   * Computes a bounding sphere from a rectangle projected in 2D.  The bounding sphere accounts for the
   * object's minimum and maximum heights over the rectangle.
   *
   * @param {Rectangle} [rectangle] The rectangle around which to create a bounding sphere.
   * @param {Object} [projection=GeographicProjection] The projection used to project the rectangle into 2D.
   * @param {Number} [minimumHeight=0.0] The minimum height over the rectangle.
   * @param {Number} [maximumHeight=0.0] The maximum height over the rectangle.
   * @param {BoundingSphere} [result] The object onto which to store the result.
   * @returns {BoundingSphere} The modified result parameter or a new BoundingSphere instance if none was provided.
   */
  BoundingSphere.fromRectangleWithHeights2D = function (
    rectangle,
    projection,
    minimumHeight,
    maximumHeight,
    result
  ) {
    if (!defined.defined(result)) {
      result = new BoundingSphere();
    }

    if (!defined.defined(rectangle)) {
      result.center = Cartesian3.Cartesian3.clone(Cartesian3.Cartesian3.ZERO, result.center);
      result.radius = 0.0;
      return result;
    }

    projection = defined.defaultValue(projection, defaultProjection);

    Cartesian2.Rectangle.southwest(rectangle, fromRectangle2DSouthwest);
    fromRectangle2DSouthwest.height = minimumHeight;
    Cartesian2.Rectangle.northeast(rectangle, fromRectangle2DNortheast);
    fromRectangle2DNortheast.height = maximumHeight;

    const lowerLeft = projection.project(
      fromRectangle2DSouthwest,
      fromRectangle2DLowerLeft
    );
    const upperRight = projection.project(
      fromRectangle2DNortheast,
      fromRectangle2DUpperRight
    );

    const width = upperRight.x - lowerLeft.x;
    const height = upperRight.y - lowerLeft.y;
    const elevation = upperRight.z - lowerLeft.z;

    result.radius =
      Math.sqrt(width * width + height * height + elevation * elevation) * 0.5;
    const center = result.center;
    center.x = lowerLeft.x + width * 0.5;
    center.y = lowerLeft.y + height * 0.5;
    center.z = lowerLeft.z + elevation * 0.5;
    return result;
  };

  const fromRectangle3DScratch = [];

  /**
   * Computes a bounding sphere from a rectangle in 3D. The bounding sphere is created using a subsample of points
   * on the ellipsoid and contained in the rectangle. It may not be accurate for all rectangles on all types of ellipsoids.
   *
   * @param {Rectangle} [rectangle] The valid rectangle used to create a bounding sphere.
   * @param {Ellipsoid} [ellipsoid=Ellipsoid.WGS84] The ellipsoid used to determine positions of the rectangle.
   * @param {Number} [surfaceHeight=0.0] The height above the surface of the ellipsoid.
   * @param {BoundingSphere} [result] The object onto which to store the result.
   * @returns {BoundingSphere} The modified result parameter or a new BoundingSphere instance if none was provided.
   */
  BoundingSphere.fromRectangle3D = function (
    rectangle,
    ellipsoid,
    surfaceHeight,
    result
  ) {
    ellipsoid = defined.defaultValue(ellipsoid, Cartesian2.Ellipsoid.WGS84);
    surfaceHeight = defined.defaultValue(surfaceHeight, 0.0);

    if (!defined.defined(result)) {
      result = new BoundingSphere();
    }

    if (!defined.defined(rectangle)) {
      result.center = Cartesian3.Cartesian3.clone(Cartesian3.Cartesian3.ZERO, result.center);
      result.radius = 0.0;
      return result;
    }

    const positions = Cartesian2.Rectangle.subsample(
      rectangle,
      ellipsoid,
      surfaceHeight,
      fromRectangle3DScratch
    );
    return BoundingSphere.fromPoints(positions, result);
  };

  /**
   * Computes a tight-fitting bounding sphere enclosing a list of 3D points, where the points are
   * stored in a flat array in X, Y, Z, order.  The bounding sphere is computed by running two
   * algorithms, a naive algorithm and Ritter's algorithm. The smaller of the two spheres is used to
   * ensure a tight fit.
   *
   * @param {Number[]} [positions] An array of points that the bounding sphere will enclose.  Each point
   *        is formed from three elements in the array in the order X, Y, Z.
   * @param {Cartesian3} [center=Cartesian3.ZERO] The position to which the positions are relative, which need not be the
   *        origin of the coordinate system.  This is useful when the positions are to be used for
   *        relative-to-center (RTC) rendering.
   * @param {Number} [stride=3] The number of array elements per vertex.  It must be at least 3, but it may
   *        be higher.  Regardless of the value of this parameter, the X coordinate of the first position
   *        is at array index 0, the Y coordinate is at array index 1, and the Z coordinate is at array index
   *        2.  When stride is 3, the X coordinate of the next position then begins at array index 3.  If
   *        the stride is 5, however, two array elements are skipped and the next position begins at array
   *        index 5.
   * @param {BoundingSphere} [result] The object onto which to store the result.
   * @returns {BoundingSphere} The modified result parameter or a new BoundingSphere instance if one was not provided.
   *
   * @example
   * // Compute the bounding sphere from 3 positions, each specified relative to a center.
   * // In addition to the X, Y, and Z coordinates, the points array contains two additional
   * // elements per point which are ignored for the purpose of computing the bounding sphere.
   * const center = new Cesium.Cartesian3(1.0, 2.0, 3.0);
   * const points = [1.0, 2.0, 3.0, 0.1, 0.2,
   *               4.0, 5.0, 6.0, 0.1, 0.2,
   *               7.0, 8.0, 9.0, 0.1, 0.2];
   * const sphere = Cesium.BoundingSphere.fromVertices(points, center, 5);
   *
   * @see {@link http://blogs.agi.com/insight3d/index.php/2008/02/04/a-bounding/|Bounding Sphere computation article}
   */
  BoundingSphere.fromVertices = function (positions, center, stride, result) {
    if (!defined.defined(result)) {
      result = new BoundingSphere();
    }

    if (!defined.defined(positions) || positions.length === 0) {
      result.center = Cartesian3.Cartesian3.clone(Cartesian3.Cartesian3.ZERO, result.center);
      result.radius = 0.0;
      return result;
    }

    center = defined.defaultValue(center, Cartesian3.Cartesian3.ZERO);

    stride = defined.defaultValue(stride, 3);

    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.number.greaterThanOrEquals("stride", stride, 3);
    //>>includeEnd('debug');

    const currentPos = fromPointsCurrentPos;
    currentPos.x = positions[0] + center.x;
    currentPos.y = positions[1] + center.y;
    currentPos.z = positions[2] + center.z;

    const xMin = Cartesian3.Cartesian3.clone(currentPos, fromPointsXMin);
    const yMin = Cartesian3.Cartesian3.clone(currentPos, fromPointsYMin);
    const zMin = Cartesian3.Cartesian3.clone(currentPos, fromPointsZMin);

    const xMax = Cartesian3.Cartesian3.clone(currentPos, fromPointsXMax);
    const yMax = Cartesian3.Cartesian3.clone(currentPos, fromPointsYMax);
    const zMax = Cartesian3.Cartesian3.clone(currentPos, fromPointsZMax);

    const numElements = positions.length;
    let i;
    for (i = 0; i < numElements; i += stride) {
      const x = positions[i] + center.x;
      const y = positions[i + 1] + center.y;
      const z = positions[i + 2] + center.z;

      currentPos.x = x;
      currentPos.y = y;
      currentPos.z = z;

      // Store points containing the the smallest and largest components
      if (x < xMin.x) {
        Cartesian3.Cartesian3.clone(currentPos, xMin);
      }

      if (x > xMax.x) {
        Cartesian3.Cartesian3.clone(currentPos, xMax);
      }

      if (y < yMin.y) {
        Cartesian3.Cartesian3.clone(currentPos, yMin);
      }

      if (y > yMax.y) {
        Cartesian3.Cartesian3.clone(currentPos, yMax);
      }

      if (z < zMin.z) {
        Cartesian3.Cartesian3.clone(currentPos, zMin);
      }

      if (z > zMax.z) {
        Cartesian3.Cartesian3.clone(currentPos, zMax);
      }
    }

    // Compute x-, y-, and z-spans (Squared distances b/n each component's min. and max.).
    const xSpan = Cartesian3.Cartesian3.magnitudeSquared(
      Cartesian3.Cartesian3.subtract(xMax, xMin, fromPointsScratch)
    );
    const ySpan = Cartesian3.Cartesian3.magnitudeSquared(
      Cartesian3.Cartesian3.subtract(yMax, yMin, fromPointsScratch)
    );
    const zSpan = Cartesian3.Cartesian3.magnitudeSquared(
      Cartesian3.Cartesian3.subtract(zMax, zMin, fromPointsScratch)
    );

    // Set the diameter endpoints to the largest span.
    let diameter1 = xMin;
    let diameter2 = xMax;
    let maxSpan = xSpan;
    if (ySpan > maxSpan) {
      maxSpan = ySpan;
      diameter1 = yMin;
      diameter2 = yMax;
    }
    if (zSpan > maxSpan) {
      maxSpan = zSpan;
      diameter1 = zMin;
      diameter2 = zMax;
    }

    // Calculate the center of the initial sphere found by Ritter's algorithm
    const ritterCenter = fromPointsRitterCenter;
    ritterCenter.x = (diameter1.x + diameter2.x) * 0.5;
    ritterCenter.y = (diameter1.y + diameter2.y) * 0.5;
    ritterCenter.z = (diameter1.z + diameter2.z) * 0.5;

    // Calculate the radius of the initial sphere found by Ritter's algorithm
    let radiusSquared = Cartesian3.Cartesian3.magnitudeSquared(
      Cartesian3.Cartesian3.subtract(diameter2, ritterCenter, fromPointsScratch)
    );
    let ritterRadius = Math.sqrt(radiusSquared);

    // Find the center of the sphere found using the Naive method.
    const minBoxPt = fromPointsMinBoxPt;
    minBoxPt.x = xMin.x;
    minBoxPt.y = yMin.y;
    minBoxPt.z = zMin.z;

    const maxBoxPt = fromPointsMaxBoxPt;
    maxBoxPt.x = xMax.x;
    maxBoxPt.y = yMax.y;
    maxBoxPt.z = zMax.z;

    const naiveCenter = Cartesian3.Cartesian3.midpoint(
      minBoxPt,
      maxBoxPt,
      fromPointsNaiveCenterScratch
    );

    // Begin 2nd pass to find naive radius and modify the ritter sphere.
    let naiveRadius = 0;
    for (i = 0; i < numElements; i += stride) {
      currentPos.x = positions[i] + center.x;
      currentPos.y = positions[i + 1] + center.y;
      currentPos.z = positions[i + 2] + center.z;

      // Find the furthest point from the naive center to calculate the naive radius.
      const r = Cartesian3.Cartesian3.magnitude(
        Cartesian3.Cartesian3.subtract(currentPos, naiveCenter, fromPointsScratch)
      );
      if (r > naiveRadius) {
        naiveRadius = r;
      }

      // Make adjustments to the Ritter Sphere to include all points.
      const oldCenterToPointSquared = Cartesian3.Cartesian3.magnitudeSquared(
        Cartesian3.Cartesian3.subtract(currentPos, ritterCenter, fromPointsScratch)
      );
      if (oldCenterToPointSquared > radiusSquared) {
        const oldCenterToPoint = Math.sqrt(oldCenterToPointSquared);
        // Calculate new radius to include the point that lies outside
        ritterRadius = (ritterRadius + oldCenterToPoint) * 0.5;
        radiusSquared = ritterRadius * ritterRadius;
        // Calculate center of new Ritter sphere
        const oldToNew = oldCenterToPoint - ritterRadius;
        ritterCenter.x =
          (ritterRadius * ritterCenter.x + oldToNew * currentPos.x) /
          oldCenterToPoint;
        ritterCenter.y =
          (ritterRadius * ritterCenter.y + oldToNew * currentPos.y) /
          oldCenterToPoint;
        ritterCenter.z =
          (ritterRadius * ritterCenter.z + oldToNew * currentPos.z) /
          oldCenterToPoint;
      }
    }

    if (ritterRadius < naiveRadius) {
      Cartesian3.Cartesian3.clone(ritterCenter, result.center);
      result.radius = ritterRadius;
    } else {
      Cartesian3.Cartesian3.clone(naiveCenter, result.center);
      result.radius = naiveRadius;
    }

    return result;
  };

  /**
   * Computes a tight-fitting bounding sphere enclosing a list of EncodedCartesian3s, where the points are
   * stored in parallel flat arrays in X, Y, Z, order.  The bounding sphere is computed by running two
   * algorithms, a naive algorithm and Ritter's algorithm. The smaller of the two spheres is used to
   * ensure a tight fit.
   *
   * @param {Number[]} [positionsHigh] An array of high bits of the encoded cartesians that the bounding sphere will enclose.  Each point
   *        is formed from three elements in the array in the order X, Y, Z.
   * @param {Number[]} [positionsLow] An array of low bits of the encoded cartesians that the bounding sphere will enclose.  Each point
   *        is formed from three elements in the array in the order X, Y, Z.
   * @param {BoundingSphere} [result] The object onto which to store the result.
   * @returns {BoundingSphere} The modified result parameter or a new BoundingSphere instance if one was not provided.
   *
   * @see {@link http://blogs.agi.com/insight3d/index.php/2008/02/04/a-bounding/|Bounding Sphere computation article}
   */
  BoundingSphere.fromEncodedCartesianVertices = function (
    positionsHigh,
    positionsLow,
    result
  ) {
    if (!defined.defined(result)) {
      result = new BoundingSphere();
    }

    if (
      !defined.defined(positionsHigh) ||
      !defined.defined(positionsLow) ||
      positionsHigh.length !== positionsLow.length ||
      positionsHigh.length === 0
    ) {
      result.center = Cartesian3.Cartesian3.clone(Cartesian3.Cartesian3.ZERO, result.center);
      result.radius = 0.0;
      return result;
    }

    const currentPos = fromPointsCurrentPos;
    currentPos.x = positionsHigh[0] + positionsLow[0];
    currentPos.y = positionsHigh[1] + positionsLow[1];
    currentPos.z = positionsHigh[2] + positionsLow[2];

    const xMin = Cartesian3.Cartesian3.clone(currentPos, fromPointsXMin);
    const yMin = Cartesian3.Cartesian3.clone(currentPos, fromPointsYMin);
    const zMin = Cartesian3.Cartesian3.clone(currentPos, fromPointsZMin);

    const xMax = Cartesian3.Cartesian3.clone(currentPos, fromPointsXMax);
    const yMax = Cartesian3.Cartesian3.clone(currentPos, fromPointsYMax);
    const zMax = Cartesian3.Cartesian3.clone(currentPos, fromPointsZMax);

    const numElements = positionsHigh.length;
    let i;
    for (i = 0; i < numElements; i += 3) {
      const x = positionsHigh[i] + positionsLow[i];
      const y = positionsHigh[i + 1] + positionsLow[i + 1];
      const z = positionsHigh[i + 2] + positionsLow[i + 2];

      currentPos.x = x;
      currentPos.y = y;
      currentPos.z = z;

      // Store points containing the the smallest and largest components
      if (x < xMin.x) {
        Cartesian3.Cartesian3.clone(currentPos, xMin);
      }

      if (x > xMax.x) {
        Cartesian3.Cartesian3.clone(currentPos, xMax);
      }

      if (y < yMin.y) {
        Cartesian3.Cartesian3.clone(currentPos, yMin);
      }

      if (y > yMax.y) {
        Cartesian3.Cartesian3.clone(currentPos, yMax);
      }

      if (z < zMin.z) {
        Cartesian3.Cartesian3.clone(currentPos, zMin);
      }

      if (z > zMax.z) {
        Cartesian3.Cartesian3.clone(currentPos, zMax);
      }
    }

    // Compute x-, y-, and z-spans (Squared distances b/n each component's min. and max.).
    const xSpan = Cartesian3.Cartesian3.magnitudeSquared(
      Cartesian3.Cartesian3.subtract(xMax, xMin, fromPointsScratch)
    );
    const ySpan = Cartesian3.Cartesian3.magnitudeSquared(
      Cartesian3.Cartesian3.subtract(yMax, yMin, fromPointsScratch)
    );
    const zSpan = Cartesian3.Cartesian3.magnitudeSquared(
      Cartesian3.Cartesian3.subtract(zMax, zMin, fromPointsScratch)
    );

    // Set the diameter endpoints to the largest span.
    let diameter1 = xMin;
    let diameter2 = xMax;
    let maxSpan = xSpan;
    if (ySpan > maxSpan) {
      maxSpan = ySpan;
      diameter1 = yMin;
      diameter2 = yMax;
    }
    if (zSpan > maxSpan) {
      maxSpan = zSpan;
      diameter1 = zMin;
      diameter2 = zMax;
    }

    // Calculate the center of the initial sphere found by Ritter's algorithm
    const ritterCenter = fromPointsRitterCenter;
    ritterCenter.x = (diameter1.x + diameter2.x) * 0.5;
    ritterCenter.y = (diameter1.y + diameter2.y) * 0.5;
    ritterCenter.z = (diameter1.z + diameter2.z) * 0.5;

    // Calculate the radius of the initial sphere found by Ritter's algorithm
    let radiusSquared = Cartesian3.Cartesian3.magnitudeSquared(
      Cartesian3.Cartesian3.subtract(diameter2, ritterCenter, fromPointsScratch)
    );
    let ritterRadius = Math.sqrt(radiusSquared);

    // Find the center of the sphere found using the Naive method.
    const minBoxPt = fromPointsMinBoxPt;
    minBoxPt.x = xMin.x;
    minBoxPt.y = yMin.y;
    minBoxPt.z = zMin.z;

    const maxBoxPt = fromPointsMaxBoxPt;
    maxBoxPt.x = xMax.x;
    maxBoxPt.y = yMax.y;
    maxBoxPt.z = zMax.z;

    const naiveCenter = Cartesian3.Cartesian3.midpoint(
      minBoxPt,
      maxBoxPt,
      fromPointsNaiveCenterScratch
    );

    // Begin 2nd pass to find naive radius and modify the ritter sphere.
    let naiveRadius = 0;
    for (i = 0; i < numElements; i += 3) {
      currentPos.x = positionsHigh[i] + positionsLow[i];
      currentPos.y = positionsHigh[i + 1] + positionsLow[i + 1];
      currentPos.z = positionsHigh[i + 2] + positionsLow[i + 2];

      // Find the furthest point from the naive center to calculate the naive radius.
      const r = Cartesian3.Cartesian3.magnitude(
        Cartesian3.Cartesian3.subtract(currentPos, naiveCenter, fromPointsScratch)
      );
      if (r > naiveRadius) {
        naiveRadius = r;
      }

      // Make adjustments to the Ritter Sphere to include all points.
      const oldCenterToPointSquared = Cartesian3.Cartesian3.magnitudeSquared(
        Cartesian3.Cartesian3.subtract(currentPos, ritterCenter, fromPointsScratch)
      );
      if (oldCenterToPointSquared > radiusSquared) {
        const oldCenterToPoint = Math.sqrt(oldCenterToPointSquared);
        // Calculate new radius to include the point that lies outside
        ritterRadius = (ritterRadius + oldCenterToPoint) * 0.5;
        radiusSquared = ritterRadius * ritterRadius;
        // Calculate center of new Ritter sphere
        const oldToNew = oldCenterToPoint - ritterRadius;
        ritterCenter.x =
          (ritterRadius * ritterCenter.x + oldToNew * currentPos.x) /
          oldCenterToPoint;
        ritterCenter.y =
          (ritterRadius * ritterCenter.y + oldToNew * currentPos.y) /
          oldCenterToPoint;
        ritterCenter.z =
          (ritterRadius * ritterCenter.z + oldToNew * currentPos.z) /
          oldCenterToPoint;
      }
    }

    if (ritterRadius < naiveRadius) {
      Cartesian3.Cartesian3.clone(ritterCenter, result.center);
      result.radius = ritterRadius;
    } else {
      Cartesian3.Cartesian3.clone(naiveCenter, result.center);
      result.radius = naiveRadius;
    }

    return result;
  };

  /**
   * Computes a bounding sphere from the corner points of an axis-aligned bounding box.  The sphere
   * tightly and fully encompasses the box.
   *
   * @param {Cartesian3} [corner] The minimum height over the rectangle.
   * @param {Cartesian3} [oppositeCorner] The maximum height over the rectangle.
   * @param {BoundingSphere} [result] The object onto which to store the result.
   * @returns {BoundingSphere} The modified result parameter or a new BoundingSphere instance if none was provided.
   *
   * @example
   * // Create a bounding sphere around the unit cube
   * const sphere = Cesium.BoundingSphere.fromCornerPoints(new Cesium.Cartesian3(-0.5, -0.5, -0.5), new Cesium.Cartesian3(0.5, 0.5, 0.5));
   */
  BoundingSphere.fromCornerPoints = function (corner, oppositeCorner, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("corner", corner);
    Check.Check.typeOf.object("oppositeCorner", oppositeCorner);
    //>>includeEnd('debug');

    if (!defined.defined(result)) {
      result = new BoundingSphere();
    }

    const center = Cartesian3.Cartesian3.midpoint(corner, oppositeCorner, result.center);
    result.radius = Cartesian3.Cartesian3.distance(center, oppositeCorner);
    return result;
  };

  /**
   * Creates a bounding sphere encompassing an ellipsoid.
   *
   * @param {Ellipsoid} ellipsoid The ellipsoid around which to create a bounding sphere.
   * @param {BoundingSphere} [result] The object onto which to store the result.
   * @returns {BoundingSphere} The modified result parameter or a new BoundingSphere instance if none was provided.
   *
   * @example
   * const boundingSphere = Cesium.BoundingSphere.fromEllipsoid(ellipsoid);
   */
  BoundingSphere.fromEllipsoid = function (ellipsoid, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("ellipsoid", ellipsoid);
    //>>includeEnd('debug');

    if (!defined.defined(result)) {
      result = new BoundingSphere();
    }

    Cartesian3.Cartesian3.clone(Cartesian3.Cartesian3.ZERO, result.center);
    result.radius = ellipsoid.maximumRadius;
    return result;
  };

  const fromBoundingSpheresScratch = new Cartesian3.Cartesian3();

  /**
   * Computes a tight-fitting bounding sphere enclosing the provided array of bounding spheres.
   *
   * @param {BoundingSphere[]} [boundingSpheres] The array of bounding spheres.
   * @param {BoundingSphere} [result] The object onto which to store the result.
   * @returns {BoundingSphere} The modified result parameter or a new BoundingSphere instance if none was provided.
   */
  BoundingSphere.fromBoundingSpheres = function (boundingSpheres, result) {
    if (!defined.defined(result)) {
      result = new BoundingSphere();
    }

    if (!defined.defined(boundingSpheres) || boundingSpheres.length === 0) {
      result.center = Cartesian3.Cartesian3.clone(Cartesian3.Cartesian3.ZERO, result.center);
      result.radius = 0.0;
      return result;
    }

    const length = boundingSpheres.length;
    if (length === 1) {
      return BoundingSphere.clone(boundingSpheres[0], result);
    }

    if (length === 2) {
      return BoundingSphere.union(boundingSpheres[0], boundingSpheres[1], result);
    }

    const positions = [];
    let i;
    for (i = 0; i < length; i++) {
      positions.push(boundingSpheres[i].center);
    }

    result = BoundingSphere.fromPoints(positions, result);

    const center = result.center;
    let radius = result.radius;
    for (i = 0; i < length; i++) {
      const tmp = boundingSpheres[i];
      radius = Math.max(
        radius,
        Cartesian3.Cartesian3.distance(center, tmp.center, fromBoundingSpheresScratch) +
          tmp.radius
      );
    }
    result.radius = radius;

    return result;
  };

  const fromOrientedBoundingBoxScratchU = new Cartesian3.Cartesian3();
  const fromOrientedBoundingBoxScratchV = new Cartesian3.Cartesian3();
  const fromOrientedBoundingBoxScratchW = new Cartesian3.Cartesian3();

  /**
   * Computes a tight-fitting bounding sphere enclosing the provided oriented bounding box.
   *
   * @param {OrientedBoundingBox} orientedBoundingBox The oriented bounding box.
   * @param {BoundingSphere} [result] The object onto which to store the result.
   * @returns {BoundingSphere} The modified result parameter or a new BoundingSphere instance if none was provided.
   */
  BoundingSphere.fromOrientedBoundingBox = function (
    orientedBoundingBox,
    result
  ) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.defined("orientedBoundingBox", orientedBoundingBox);
    //>>includeEnd('debug');

    if (!defined.defined(result)) {
      result = new BoundingSphere();
    }

    const halfAxes = orientedBoundingBox.halfAxes;
    const u = Matrix2.Matrix3.getColumn(halfAxes, 0, fromOrientedBoundingBoxScratchU);
    const v = Matrix2.Matrix3.getColumn(halfAxes, 1, fromOrientedBoundingBoxScratchV);
    const w = Matrix2.Matrix3.getColumn(halfAxes, 2, fromOrientedBoundingBoxScratchW);

    Cartesian3.Cartesian3.add(u, v, u);
    Cartesian3.Cartesian3.add(u, w, u);

    result.center = Cartesian3.Cartesian3.clone(orientedBoundingBox.center, result.center);
    result.radius = Cartesian3.Cartesian3.magnitude(u);

    return result;
  };

  const scratchFromTransformationCenter = new Cartesian3.Cartesian3();
  const scratchFromTransformationScale = new Cartesian3.Cartesian3();

  /**
   * Computes a tight-fitting bounding sphere enclosing the provided affine transformation.
   *
   * @param {Matrix4} transformation The affine transformation.
   * @param {BoundingSphere} [result] The object onto which to store the result.
   * @returns {BoundingSphere} The modified result parameter or a new BoundingSphere instance if none was provided.
   */
  BoundingSphere.fromTransformation = function (transformation, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("transformation", transformation);
    //>>includeEnd('debug');

    if (!defined.defined(result)) {
      result = new BoundingSphere();
    }

    const center = Matrix2.Matrix4.getTranslation(
      transformation,
      scratchFromTransformationCenter
    );
    const scale = Matrix2.Matrix4.getScale(
      transformation,
      scratchFromTransformationScale
    );
    const radius = 0.5 * Cartesian3.Cartesian3.magnitude(scale);
    result.center = Cartesian3.Cartesian3.clone(center, result.center);
    result.radius = radius;

    return result;
  };

  /**
   * Duplicates a BoundingSphere instance.
   *
   * @param {BoundingSphere} sphere The bounding sphere to duplicate.
   * @param {BoundingSphere} [result] The object onto which to store the result.
   * @returns {BoundingSphere} The modified result parameter or a new BoundingSphere instance if none was provided. (Returns undefined if sphere is undefined)
   */
  BoundingSphere.clone = function (sphere, result) {
    if (!defined.defined(sphere)) {
      return undefined;
    }

    if (!defined.defined(result)) {
      return new BoundingSphere(sphere.center, sphere.radius);
    }

    result.center = Cartesian3.Cartesian3.clone(sphere.center, result.center);
    result.radius = sphere.radius;
    return result;
  };

  /**
   * The number of elements used to pack the object into an array.
   * @type {Number}
   */
  BoundingSphere.packedLength = 4;

  /**
   * Stores the provided instance into the provided array.
   *
   * @param {BoundingSphere} value The value to pack.
   * @param {Number[]} array The array to pack into.
   * @param {Number} [startingIndex=0] The index into the array at which to start packing the elements.
   *
   * @returns {Number[]} The array that was packed into
   */
  BoundingSphere.pack = function (value, array, startingIndex) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("value", value);
    Check.Check.defined("array", array);
    //>>includeEnd('debug');

    startingIndex = defined.defaultValue(startingIndex, 0);

    const center = value.center;
    array[startingIndex++] = center.x;
    array[startingIndex++] = center.y;
    array[startingIndex++] = center.z;
    array[startingIndex] = value.radius;

    return array;
  };

  /**
   * Retrieves an instance from a packed array.
   *
   * @param {Number[]} array The packed array.
   * @param {Number} [startingIndex=0] The starting index of the element to be unpacked.
   * @param {BoundingSphere} [result] The object into which to store the result.
   * @returns {BoundingSphere} The modified result parameter or a new BoundingSphere instance if one was not provided.
   */
  BoundingSphere.unpack = function (array, startingIndex, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.defined("array", array);
    //>>includeEnd('debug');

    startingIndex = defined.defaultValue(startingIndex, 0);

    if (!defined.defined(result)) {
      result = new BoundingSphere();
    }

    const center = result.center;
    center.x = array[startingIndex++];
    center.y = array[startingIndex++];
    center.z = array[startingIndex++];
    result.radius = array[startingIndex];
    return result;
  };

  const unionScratch = new Cartesian3.Cartesian3();
  const unionScratchCenter = new Cartesian3.Cartesian3();
  /**
   * Computes a bounding sphere that contains both the left and right bounding spheres.
   *
   * @param {BoundingSphere} left A sphere to enclose in a bounding sphere.
   * @param {BoundingSphere} right A sphere to enclose in a bounding sphere.
   * @param {BoundingSphere} [result] The object onto which to store the result.
   * @returns {BoundingSphere} The modified result parameter or a new BoundingSphere instance if none was provided.
   */
  BoundingSphere.union = function (left, right, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("left", left);
    Check.Check.typeOf.object("right", right);
    //>>includeEnd('debug');

    if (!defined.defined(result)) {
      result = new BoundingSphere();
    }

    const leftCenter = left.center;
    const leftRadius = left.radius;
    const rightCenter = right.center;
    const rightRadius = right.radius;

    const toRightCenter = Cartesian3.Cartesian3.subtract(
      rightCenter,
      leftCenter,
      unionScratch
    );
    const centerSeparation = Cartesian3.Cartesian3.magnitude(toRightCenter);

    if (leftRadius >= centerSeparation + rightRadius) {
      // Left sphere wins.
      left.clone(result);
      return result;
    }

    if (rightRadius >= centerSeparation + leftRadius) {
      // Right sphere wins.
      right.clone(result);
      return result;
    }

    // There are two tangent points, one on far side of each sphere.
    const halfDistanceBetweenTangentPoints =
      (leftRadius + centerSeparation + rightRadius) * 0.5;

    // Compute the center point halfway between the two tangent points.
    const center = Cartesian3.Cartesian3.multiplyByScalar(
      toRightCenter,
      (-leftRadius + halfDistanceBetweenTangentPoints) / centerSeparation,
      unionScratchCenter
    );
    Cartesian3.Cartesian3.add(center, leftCenter, center);
    Cartesian3.Cartesian3.clone(center, result.center);
    result.radius = halfDistanceBetweenTangentPoints;

    return result;
  };

  const expandScratch = new Cartesian3.Cartesian3();
  /**
   * Computes a bounding sphere by enlarging the provided sphere to contain the provided point.
   *
   * @param {BoundingSphere} sphere A sphere to expand.
   * @param {Cartesian3} point A point to enclose in a bounding sphere.
   * @param {BoundingSphere} [result] The object onto which to store the result.
   * @returns {BoundingSphere} The modified result parameter or a new BoundingSphere instance if none was provided.
   */
  BoundingSphere.expand = function (sphere, point, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("sphere", sphere);
    Check.Check.typeOf.object("point", point);
    //>>includeEnd('debug');

    result = BoundingSphere.clone(sphere, result);

    const radius = Cartesian3.Cartesian3.magnitude(
      Cartesian3.Cartesian3.subtract(point, result.center, expandScratch)
    );
    if (radius > result.radius) {
      result.radius = radius;
    }

    return result;
  };

  /**
   * Determines which side of a plane a sphere is located.
   *
   * @param {BoundingSphere} sphere The bounding sphere to test.
   * @param {Plane} plane The plane to test against.
   * @returns {Intersect} {@link Intersect.INSIDE} if the entire sphere is on the side of the plane
   *                      the normal is pointing, {@link Intersect.OUTSIDE} if the entire sphere is
   *                      on the opposite side, and {@link Intersect.INTERSECTING} if the sphere
   *                      intersects the plane.
   */
  BoundingSphere.intersectPlane = function (sphere, plane) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("sphere", sphere);
    Check.Check.typeOf.object("plane", plane);
    //>>includeEnd('debug');

    const center = sphere.center;
    const radius = sphere.radius;
    const normal = plane.normal;
    const distanceToPlane = Cartesian3.Cartesian3.dot(normal, center) + plane.distance;

    if (distanceToPlane < -radius) {
      // The center point is negative side of the plane normal
      return Intersect$1.OUTSIDE;
    } else if (distanceToPlane < radius) {
      // The center point is positive side of the plane, but radius extends beyond it; partial overlap
      return Intersect$1.INTERSECTING;
    }
    return Intersect$1.INSIDE;
  };

  /**
   * Applies a 4x4 affine transformation matrix to a bounding sphere.
   *
   * @param {BoundingSphere} sphere The bounding sphere to apply the transformation to.
   * @param {Matrix4} transform The transformation matrix to apply to the bounding sphere.
   * @param {BoundingSphere} [result] The object onto which to store the result.
   * @returns {BoundingSphere} The modified result parameter or a new BoundingSphere instance if none was provided.
   */
  BoundingSphere.transform = function (sphere, transform, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("sphere", sphere);
    Check.Check.typeOf.object("transform", transform);
    //>>includeEnd('debug');

    if (!defined.defined(result)) {
      result = new BoundingSphere();
    }

    result.center = Matrix2.Matrix4.multiplyByPoint(
      transform,
      sphere.center,
      result.center
    );
    result.radius = Matrix2.Matrix4.getMaximumScale(transform) * sphere.radius;

    return result;
  };

  const distanceSquaredToScratch = new Cartesian3.Cartesian3();

  /**
   * Computes the estimated distance squared from the closest point on a bounding sphere to a point.
   *
   * @param {BoundingSphere} sphere The sphere.
   * @param {Cartesian3} cartesian The point
   * @returns {Number} The distance squared from the bounding sphere to the point. Returns 0 if the point is inside the sphere.
   *
   * @example
   * // Sort bounding spheres from back to front
   * spheres.sort(function(a, b) {
   *     return Cesium.BoundingSphere.distanceSquaredTo(b, camera.positionWC) - Cesium.BoundingSphere.distanceSquaredTo(a, camera.positionWC);
   * });
   */
  BoundingSphere.distanceSquaredTo = function (sphere, cartesian) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("sphere", sphere);
    Check.Check.typeOf.object("cartesian", cartesian);
    //>>includeEnd('debug');

    const diff = Cartesian3.Cartesian3.subtract(
      sphere.center,
      cartesian,
      distanceSquaredToScratch
    );

    const distance = Cartesian3.Cartesian3.magnitude(diff) - sphere.radius;
    if (distance <= 0.0) {
      return 0.0;
    }

    return distance * distance;
  };

  /**
   * Applies a 4x4 affine transformation matrix to a bounding sphere where there is no scale
   * The transformation matrix is not verified to have a uniform scale of 1.
   * This method is faster than computing the general bounding sphere transform using {@link BoundingSphere.transform}.
   *
   * @param {BoundingSphere} sphere The bounding sphere to apply the transformation to.
   * @param {Matrix4} transform The transformation matrix to apply to the bounding sphere.
   * @param {BoundingSphere} [result] The object onto which to store the result.
   * @returns {BoundingSphere} The modified result parameter or a new BoundingSphere instance if none was provided.
   *
   * @example
   * const modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(positionOnEllipsoid);
   * const boundingSphere = new Cesium.BoundingSphere();
   * const newBoundingSphere = Cesium.BoundingSphere.transformWithoutScale(boundingSphere, modelMatrix);
   */
  BoundingSphere.transformWithoutScale = function (sphere, transform, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("sphere", sphere);
    Check.Check.typeOf.object("transform", transform);
    //>>includeEnd('debug');

    if (!defined.defined(result)) {
      result = new BoundingSphere();
    }

    result.center = Matrix2.Matrix4.multiplyByPoint(
      transform,
      sphere.center,
      result.center
    );
    result.radius = sphere.radius;

    return result;
  };

  const scratchCartesian3 = new Cartesian3.Cartesian3();
  /**
   * The distances calculated by the vector from the center of the bounding sphere to position projected onto direction
   * plus/minus the radius of the bounding sphere.
   * <br>
   * If you imagine the infinite number of planes with normal direction, this computes the smallest distance to the
   * closest and farthest planes from position that intersect the bounding sphere.
   *
   * @param {BoundingSphere} sphere The bounding sphere to calculate the distance to.
   * @param {Cartesian3} position The position to calculate the distance from.
   * @param {Cartesian3} direction The direction from position.
   * @param {Interval} [result] A Interval to store the nearest and farthest distances.
   * @returns {Interval} The nearest and farthest distances on the bounding sphere from position in direction.
   */
  BoundingSphere.computePlaneDistances = function (
    sphere,
    position,
    direction,
    result
  ) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("sphere", sphere);
    Check.Check.typeOf.object("position", position);
    Check.Check.typeOf.object("direction", direction);
    //>>includeEnd('debug');

    if (!defined.defined(result)) {
      result = new Interval();
    }

    const toCenter = Cartesian3.Cartesian3.subtract(
      sphere.center,
      position,
      scratchCartesian3
    );
    const mag = Cartesian3.Cartesian3.dot(direction, toCenter);

    result.start = mag - sphere.radius;
    result.stop = mag + sphere.radius;
    return result;
  };

  const projectTo2DNormalScratch = new Cartesian3.Cartesian3();
  const projectTo2DEastScratch = new Cartesian3.Cartesian3();
  const projectTo2DNorthScratch = new Cartesian3.Cartesian3();
  const projectTo2DWestScratch = new Cartesian3.Cartesian3();
  const projectTo2DSouthScratch = new Cartesian3.Cartesian3();
  const projectTo2DCartographicScratch = new Cartesian2.Cartographic();
  const projectTo2DPositionsScratch = new Array(8);
  for (let n = 0; n < 8; ++n) {
    projectTo2DPositionsScratch[n] = new Cartesian3.Cartesian3();
  }

  const projectTo2DProjection = new GeographicProjection.GeographicProjection();
  /**
   * Creates a bounding sphere in 2D from a bounding sphere in 3D world coordinates.
   *
   * @param {BoundingSphere} sphere The bounding sphere to transform to 2D.
   * @param {Object} [projection=GeographicProjection] The projection to 2D.
   * @param {BoundingSphere} [result] The object onto which to store the result.
   * @returns {BoundingSphere} The modified result parameter or a new BoundingSphere instance if none was provided.
   */
  BoundingSphere.projectTo2D = function (sphere, projection, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("sphere", sphere);
    //>>includeEnd('debug');

    projection = defined.defaultValue(projection, projectTo2DProjection);

    const ellipsoid = projection.ellipsoid;
    let center = sphere.center;
    const radius = sphere.radius;

    let normal;
    if (Cartesian3.Cartesian3.equals(center, Cartesian3.Cartesian3.ZERO)) {
      // Bounding sphere is at the center. The geodetic surface normal is not
      // defined here so pick the x-axis as a fallback.
      normal = Cartesian3.Cartesian3.clone(Cartesian3.Cartesian3.UNIT_X, projectTo2DNormalScratch);
    } else {
      normal = ellipsoid.geodeticSurfaceNormal(center, projectTo2DNormalScratch);
    }
    const east = Cartesian3.Cartesian3.cross(
      Cartesian3.Cartesian3.UNIT_Z,
      normal,
      projectTo2DEastScratch
    );
    Cartesian3.Cartesian3.normalize(east, east);
    const north = Cartesian3.Cartesian3.cross(normal, east, projectTo2DNorthScratch);
    Cartesian3.Cartesian3.normalize(north, north);

    Cartesian3.Cartesian3.multiplyByScalar(normal, radius, normal);
    Cartesian3.Cartesian3.multiplyByScalar(north, radius, north);
    Cartesian3.Cartesian3.multiplyByScalar(east, radius, east);

    const south = Cartesian3.Cartesian3.negate(north, projectTo2DSouthScratch);
    const west = Cartesian3.Cartesian3.negate(east, projectTo2DWestScratch);

    const positions = projectTo2DPositionsScratch;

    // top NE corner
    let corner = positions[0];
    Cartesian3.Cartesian3.add(normal, north, corner);
    Cartesian3.Cartesian3.add(corner, east, corner);

    // top NW corner
    corner = positions[1];
    Cartesian3.Cartesian3.add(normal, north, corner);
    Cartesian3.Cartesian3.add(corner, west, corner);

    // top SW corner
    corner = positions[2];
    Cartesian3.Cartesian3.add(normal, south, corner);
    Cartesian3.Cartesian3.add(corner, west, corner);

    // top SE corner
    corner = positions[3];
    Cartesian3.Cartesian3.add(normal, south, corner);
    Cartesian3.Cartesian3.add(corner, east, corner);

    Cartesian3.Cartesian3.negate(normal, normal);

    // bottom NE corner
    corner = positions[4];
    Cartesian3.Cartesian3.add(normal, north, corner);
    Cartesian3.Cartesian3.add(corner, east, corner);

    // bottom NW corner
    corner = positions[5];
    Cartesian3.Cartesian3.add(normal, north, corner);
    Cartesian3.Cartesian3.add(corner, west, corner);

    // bottom SW corner
    corner = positions[6];
    Cartesian3.Cartesian3.add(normal, south, corner);
    Cartesian3.Cartesian3.add(corner, west, corner);

    // bottom SE corner
    corner = positions[7];
    Cartesian3.Cartesian3.add(normal, south, corner);
    Cartesian3.Cartesian3.add(corner, east, corner);

    const length = positions.length;
    for (let i = 0; i < length; ++i) {
      const position = positions[i];
      Cartesian3.Cartesian3.add(center, position, position);
      const cartographic = ellipsoid.cartesianToCartographic(
        position,
        projectTo2DCartographicScratch
      );
      projection.project(cartographic, position);
    }

    result = BoundingSphere.fromPoints(positions, result);

    // swizzle center components
    center = result.center;
    const x = center.x;
    const y = center.y;
    const z = center.z;
    center.x = z;
    center.y = x;
    center.z = y;

    return result;
  };

  /**
   * Determines whether or not a sphere is hidden from view by the occluder.
   *
   * @param {BoundingSphere} sphere The bounding sphere surrounding the occludee object.
   * @param {Occluder} occluder The occluder.
   * @returns {Boolean} <code>true</code> if the sphere is not visible; otherwise <code>false</code>.
   */
  BoundingSphere.isOccluded = function (sphere, occluder) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("sphere", sphere);
    Check.Check.typeOf.object("occluder", occluder);
    //>>includeEnd('debug');
    return !occluder.isBoundingSphereVisible(sphere);
  };

  /**
   * Compares the provided BoundingSphere componentwise and returns
   * <code>true</code> if they are equal, <code>false</code> otherwise.
   *
   * @param {BoundingSphere} [left] The first BoundingSphere.
   * @param {BoundingSphere} [right] The second BoundingSphere.
   * @returns {Boolean} <code>true</code> if left and right are equal, <code>false</code> otherwise.
   */
  BoundingSphere.equals = function (left, right) {
    return (
      left === right ||
      (defined.defined(left) &&
        defined.defined(right) &&
        Cartesian3.Cartesian3.equals(left.center, right.center) &&
        left.radius === right.radius)
    );
  };

  /**
   * Determines which side of a plane the sphere is located.
   *
   * @param {Plane} plane The plane to test against.
   * @returns {Intersect} {@link Intersect.INSIDE} if the entire sphere is on the side of the plane
   *                      the normal is pointing, {@link Intersect.OUTSIDE} if the entire sphere is
   *                      on the opposite side, and {@link Intersect.INTERSECTING} if the sphere
   *                      intersects the plane.
   */
  BoundingSphere.prototype.intersectPlane = function (plane) {
    return BoundingSphere.intersectPlane(this, plane);
  };

  /**
   * Computes the estimated distance squared from the closest point on a bounding sphere to a point.
   *
   * @param {Cartesian3} cartesian The point
   * @returns {Number} The estimated distance squared from the bounding sphere to the point.
   *
   * @example
   * // Sort bounding spheres from back to front
   * spheres.sort(function(a, b) {
   *     return b.distanceSquaredTo(camera.positionWC) - a.distanceSquaredTo(camera.positionWC);
   * });
   */
  BoundingSphere.prototype.distanceSquaredTo = function (cartesian) {
    return BoundingSphere.distanceSquaredTo(this, cartesian);
  };

  /**
   * The distances calculated by the vector from the center of the bounding sphere to position projected onto direction
   * plus/minus the radius of the bounding sphere.
   * <br>
   * If you imagine the infinite number of planes with normal direction, this computes the smallest distance to the
   * closest and farthest planes from position that intersect the bounding sphere.
   *
   * @param {Cartesian3} position The position to calculate the distance from.
   * @param {Cartesian3} direction The direction from position.
   * @param {Interval} [result] A Interval to store the nearest and farthest distances.
   * @returns {Interval} The nearest and farthest distances on the bounding sphere from position in direction.
   */
  BoundingSphere.prototype.computePlaneDistances = function (
    position,
    direction,
    result
  ) {
    return BoundingSphere.computePlaneDistances(
      this,
      position,
      direction,
      result
    );
  };

  /**
   * Determines whether or not a sphere is hidden from view by the occluder.
   *
   * @param {Occluder} occluder The occluder.
   * @returns {Boolean} <code>true</code> if the sphere is not visible; otherwise <code>false</code>.
   */
  BoundingSphere.prototype.isOccluded = function (occluder) {
    return BoundingSphere.isOccluded(this, occluder);
  };

  /**
   * Compares this BoundingSphere against the provided BoundingSphere componentwise and returns
   * <code>true</code> if they are equal, <code>false</code> otherwise.
   *
   * @param {BoundingSphere} [right] The right hand side BoundingSphere.
   * @returns {Boolean} <code>true</code> if they are equal, <code>false</code> otherwise.
   */
  BoundingSphere.prototype.equals = function (right) {
    return BoundingSphere.equals(this, right);
  };

  /**
   * Duplicates this BoundingSphere instance.
   *
   * @param {BoundingSphere} [result] The object onto which to store the result.
   * @returns {BoundingSphere} The modified result parameter or a new BoundingSphere instance if none was provided.
   */
  BoundingSphere.prototype.clone = function (result) {
    return BoundingSphere.clone(this, result);
  };

  /**
   * Computes the radius of the BoundingSphere.
   * @returns {Number} The radius of the BoundingSphere.
   */
  BoundingSphere.prototype.volume = function () {
    const radius = this.radius;
    return volumeConstant * radius * radius * radius;
  };

  let _supportsFullscreen;
  const _names = {
    requestFullscreen: undefined,
    exitFullscreen: undefined,
    fullscreenEnabled: undefined,
    fullscreenElement: undefined,
    fullscreenchange: undefined,
    fullscreenerror: undefined,
  };

  /**
   * Browser-independent functions for working with the standard fullscreen API.
   *
   * @namespace Fullscreen
   *
   * @see {@link http://dvcs.w3.org/hg/fullscreen/raw-file/tip/Overview.html|W3C Fullscreen Living Specification}
   */
  const Fullscreen = {};

  Object.defineProperties(Fullscreen, {
    /**
     * The element that is currently fullscreen, if any.  To simply check if the
     * browser is in fullscreen mode or not, use {@link Fullscreen#fullscreen}.
     * @memberof Fullscreen
     * @type {Object}
     * @readonly
     */
    element: {
      get: function () {
        if (!Fullscreen.supportsFullscreen()) {
          return undefined;
        }

        return document[_names.fullscreenElement];
      },
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
    changeEventName: {
      get: function () {
        if (!Fullscreen.supportsFullscreen()) {
          return undefined;
        }

        return _names.fullscreenchange;
      },
    },

    /**
     * The name of the event that is fired when a fullscreen error
     * occurs.  This event name is intended for use with addEventListener.
     * @memberof Fullscreen
     * @type {String}
     * @readonly
     */
    errorEventName: {
      get: function () {
        if (!Fullscreen.supportsFullscreen()) {
          return undefined;
        }

        return _names.fullscreenerror;
      },
    },

    /**
     * Determine whether the browser will allow an element to be made fullscreen, or not.
     * For example, by default, iframes cannot go fullscreen unless the containing page
     * adds an "allowfullscreen" attribute (or prefixed equivalent).
     * @memberof Fullscreen
     * @type {Boolean}
     * @readonly
     */
    enabled: {
      get: function () {
        if (!Fullscreen.supportsFullscreen()) {
          return undefined;
        }

        return document[_names.fullscreenEnabled];
      },
    },

    /**
     * Determines if the browser is currently in fullscreen mode.
     * @memberof Fullscreen
     * @type {Boolean}
     * @readonly
     */
    fullscreen: {
      get: function () {
        if (!Fullscreen.supportsFullscreen()) {
          return undefined;
        }

        return Fullscreen.element !== null;
      },
    },
  });

  /**
   * Detects whether the browser supports the standard fullscreen API.
   *
   * @returns {Boolean} <code>true</code> if the browser supports the standard fullscreen API,
   * <code>false</code> otherwise.
   */
  Fullscreen.supportsFullscreen = function () {
    if (defined.defined(_supportsFullscreen)) {
      return _supportsFullscreen;
    }

    _supportsFullscreen = false;

    const body = document.body;
    if (typeof body.requestFullscreen === "function") {
      // go with the unprefixed, standard set of names
      _names.requestFullscreen = "requestFullscreen";
      _names.exitFullscreen = "exitFullscreen";
      _names.fullscreenEnabled = "fullscreenEnabled";
      _names.fullscreenElement = "fullscreenElement";
      _names.fullscreenchange = "fullscreenchange";
      _names.fullscreenerror = "fullscreenerror";
      _supportsFullscreen = true;
      return _supportsFullscreen;
    }

    //check for the correct combination of prefix plus the various names that browsers use
    const prefixes = ["webkit", "moz", "o", "ms", "khtml"];
    let name;
    for (let i = 0, len = prefixes.length; i < len; ++i) {
      const prefix = prefixes[i];

      // casing of Fullscreen differs across browsers
      name = `${prefix}RequestFullscreen`;
      if (typeof body[name] === "function") {
        _names.requestFullscreen = name;
        _supportsFullscreen = true;
      } else {
        name = `${prefix}RequestFullScreen`;
        if (typeof body[name] === "function") {
          _names.requestFullscreen = name;
          _supportsFullscreen = true;
        }
      }

      // disagreement about whether it's "exit" as per spec, or "cancel"
      name = `${prefix}ExitFullscreen`;
      if (typeof document[name] === "function") {
        _names.exitFullscreen = name;
      } else {
        name = `${prefix}CancelFullScreen`;
        if (typeof document[name] === "function") {
          _names.exitFullscreen = name;
        }
      }

      // casing of Fullscreen differs across browsers
      name = `${prefix}FullscreenEnabled`;
      if (document[name] !== undefined) {
        _names.fullscreenEnabled = name;
      } else {
        name = `${prefix}FullScreenEnabled`;
        if (document[name] !== undefined) {
          _names.fullscreenEnabled = name;
        }
      }

      // casing of Fullscreen differs across browsers
      name = `${prefix}FullscreenElement`;
      if (document[name] !== undefined) {
        _names.fullscreenElement = name;
      } else {
        name = `${prefix}FullScreenElement`;
        if (document[name] !== undefined) {
          _names.fullscreenElement = name;
        }
      }

      // thankfully, event names are all lowercase per spec
      name = `${prefix}fullscreenchange`;
      // event names do not have 'on' in the front, but the property on the document does
      if (document[`on${name}`] !== undefined) {
        //except on IE
        if (prefix === "ms") {
          name = "MSFullscreenChange";
        }
        _names.fullscreenchange = name;
      }

      name = `${prefix}fullscreenerror`;
      if (document[`on${name}`] !== undefined) {
        //except on IE
        if (prefix === "ms") {
          name = "MSFullscreenError";
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
   * @param {Object} [vrDevice] The HMDVRDevice device.
   *
   * @example
   * // Put the entire page into fullscreen.
   * Cesium.Fullscreen.requestFullscreen(document.body)
   *
   * // Place only the Cesium canvas into fullscreen.
   * Cesium.Fullscreen.requestFullscreen(scene.canvas)
   */
  Fullscreen.requestFullscreen = function (element, vrDevice) {
    if (!Fullscreen.supportsFullscreen()) {
      return;
    }

    element[_names.requestFullscreen]({ vrDisplay: vrDevice });
  };

  /**
   * Asynchronously exits fullscreen mode.  If the browser is not currently
   * in fullscreen, or if fullscreen mode is not supported by the browser, does nothing.
   */
  Fullscreen.exitFullscreen = function () {
    if (!Fullscreen.supportsFullscreen()) {
      return;
    }

    document[_names.exitFullscreen]();
  };

  //For unit tests
  Fullscreen._names = _names;
  var Fullscreen$1 = Fullscreen;

  let theNavigator;
  if (typeof navigator !== "undefined") {
    theNavigator = navigator;
  } else {
    theNavigator = {};
  }

  function extractVersion(versionString) {
    const parts = versionString.split(".");
    for (let i = 0, len = parts.length; i < len; ++i) {
      parts[i] = parseInt(parts[i], 10);
    }
    return parts;
  }

  let isChromeResult;
  let chromeVersionResult;
  function isChrome() {
    if (!defined.defined(isChromeResult)) {
      isChromeResult = false;
      // Edge contains Chrome in the user agent too
      if (!isEdge()) {
        const fields = / Chrome\/([\.0-9]+)/.exec(theNavigator.userAgent);
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

  let isSafariResult;
  let safariVersionResult;
  function isSafari() {
    if (!defined.defined(isSafariResult)) {
      isSafariResult = false;

      // Chrome and Edge contain Safari in the user agent too
      if (
        !isChrome() &&
        !isEdge() &&
        / Safari\/[\.0-9]+/.test(theNavigator.userAgent)
      ) {
        const fields = / Version\/([\.0-9]+)/.exec(theNavigator.userAgent);
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

  let isWebkitResult;
  let webkitVersionResult;
  function isWebkit() {
    if (!defined.defined(isWebkitResult)) {
      isWebkitResult = false;

      const fields = / AppleWebKit\/([\.0-9]+)(\+?)/.exec(theNavigator.userAgent);
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

  let isInternetExplorerResult;
  let internetExplorerVersionResult;
  function isInternetExplorer() {
    if (!defined.defined(isInternetExplorerResult)) {
      isInternetExplorerResult = false;

      let fields;
      if (theNavigator.appName === "Microsoft Internet Explorer") {
        fields = /MSIE ([0-9]{1,}[\.0-9]{0,})/.exec(theNavigator.userAgent);
        if (fields !== null) {
          isInternetExplorerResult = true;
          internetExplorerVersionResult = extractVersion(fields[1]);
        }
      } else if (theNavigator.appName === "Netscape") {
        fields = /Trident\/.*rv:([0-9]{1,}[\.0-9]{0,})/.exec(
          theNavigator.userAgent
        );
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

  let isEdgeResult;
  let edgeVersionResult;
  function isEdge() {
    if (!defined.defined(isEdgeResult)) {
      isEdgeResult = false;
      const fields = / Edg\/([\.0-9]+)/.exec(theNavigator.userAgent);
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

  let isFirefoxResult;
  let firefoxVersionResult;
  function isFirefox() {
    if (!defined.defined(isFirefoxResult)) {
      isFirefoxResult = false;

      const fields = /Firefox\/([\.0-9]+)/.exec(theNavigator.userAgent);
      if (fields !== null) {
        isFirefoxResult = true;
        firefoxVersionResult = extractVersion(fields[1]);
      }
    }
    return isFirefoxResult;
  }

  let isWindowsResult;
  function isWindows() {
    if (!defined.defined(isWindowsResult)) {
      isWindowsResult = /Windows/i.test(theNavigator.appVersion);
    }
    return isWindowsResult;
  }

  let isIPadOrIOSResult;
  function isIPadOrIOS() {
    if (!defined.defined(isIPadOrIOSResult)) {
      isIPadOrIOSResult =
        navigator.platform === "iPhone" ||
        navigator.platform === "iPod" ||
        navigator.platform === "iPad";
    }

    return isIPadOrIOSResult;
  }

  function firefoxVersion() {
    return isFirefox() && firefoxVersionResult;
  }

  let hasPointerEvents;
  function supportsPointerEvents() {
    if (!defined.defined(hasPointerEvents)) {
      //While navigator.pointerEnabled is deprecated in the W3C specification
      //we still need to use it if it exists in order to support browsers
      //that rely on it, such as the Windows WebBrowser control which defines
      //PointerEvent but sets navigator.pointerEnabled to false.

      //Firefox disabled because of https://github.com/CesiumGS/cesium/issues/6372
      hasPointerEvents =
        !isFirefox() &&
        typeof PointerEvent !== "undefined" &&
        (!defined.defined(theNavigator.pointerEnabled) || theNavigator.pointerEnabled);
    }
    return hasPointerEvents;
  }

  let imageRenderingValueResult;
  let supportsImageRenderingPixelatedResult;
  function supportsImageRenderingPixelated() {
    if (!defined.defined(supportsImageRenderingPixelatedResult)) {
      const canvas = document.createElement("canvas");
      canvas.setAttribute(
        "style",
        "image-rendering: -moz-crisp-edges;" + "image-rendering: pixelated;"
      );
      //canvas.style.imageRendering will be undefined, null or an empty string on unsupported browsers.
      const tmp = canvas.style.imageRendering;
      supportsImageRenderingPixelatedResult = defined.defined(tmp) && tmp !== "";
      if (supportsImageRenderingPixelatedResult) {
        imageRenderingValueResult = tmp;
      }
    }
    return supportsImageRenderingPixelatedResult;
  }

  function imageRenderingValue() {
    return supportsImageRenderingPixelated()
      ? imageRenderingValueResult
      : undefined;
  }

  function supportsWebP() {
    //>>includeStart('debug', pragmas.debug);
    if (!supportsWebP.initialized) {
      throw new Check.DeveloperError(
        "You must call FeatureDetection.supportsWebP.initialize and wait for the promise to resolve before calling FeatureDetection.supportsWebP"
      );
    }
    //>>includeEnd('debug');
    return supportsWebP._result;
  }
  supportsWebP._promise = undefined;
  supportsWebP._result = undefined;
  supportsWebP.initialize = function () {
    // From https://developers.google.com/speed/webp/faq#how_can_i_detect_browser_support_for_webp
    if (defined.defined(supportsWebP._promise)) {
      return supportsWebP._promise;
    }

    supportsWebP._promise = new Promise((resolve) => {
      const image = new Image();
      image.onload = function () {
        supportsWebP._result = image.width > 0 && image.height > 0;
        resolve(supportsWebP._result);
      };

      image.onerror = function () {
        supportsWebP._result = false;
        resolve(supportsWebP._result);
      };
      image.src =
        "data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA";
    });

    return supportsWebP._promise;
  };
  Object.defineProperties(supportsWebP, {
    initialized: {
      get: function () {
        return defined.defined(supportsWebP._result);
      },
    },
  });

  const typedArrayTypes = [];
  if (typeof ArrayBuffer !== "undefined") {
    typedArrayTypes.push(
      Int8Array,
      Uint8Array,
      Int16Array,
      Uint16Array,
      Int32Array,
      Uint32Array,
      Float32Array,
      Float64Array
    );

    if (typeof Uint8ClampedArray !== "undefined") {
      typedArrayTypes.push(Uint8ClampedArray);
    }

    if (typeof Uint8ClampedArray !== "undefined") {
      typedArrayTypes.push(Uint8ClampedArray);
    }

    if (typeof BigInt64Array !== "undefined") {
      // eslint-disable-next-line no-undef
      typedArrayTypes.push(BigInt64Array);
    }

    if (typeof BigUint64Array !== "undefined") {
      // eslint-disable-next-line no-undef
      typedArrayTypes.push(BigUint64Array);
    }
  }

  /**
   * A set of functions to detect whether the current browser supports
   * various features.
   *
   * @namespace FeatureDetection
   */
  const FeatureDetection = {
    isChrome: isChrome,
    chromeVersion: chromeVersion,
    isSafari: isSafari,
    safariVersion: safariVersion,
    isWebkit: isWebkit,
    webkitVersion: webkitVersion,
    isInternetExplorer: isInternetExplorer,
    internetExplorerVersion: internetExplorerVersion,
    isEdge: isEdge,
    edgeVersion: edgeVersion,
    isFirefox: isFirefox,
    firefoxVersion: firefoxVersion,
    isWindows: isWindows,
    isIPadOrIOS: isIPadOrIOS,
    hardwareConcurrency: defined.defaultValue(theNavigator.hardwareConcurrency, 3),
    supportsPointerEvents: supportsPointerEvents,
    supportsImageRenderingPixelated: supportsImageRenderingPixelated,
    supportsWebP: supportsWebP,
    imageRenderingValue: imageRenderingValue,
    typedArrayTypes: typedArrayTypes,
  };

  /**
   * Detects whether the current browser supports Basis Universal textures and the web assembly modules needed to transcode them.
   *
   * @param {Scene} scene
   * @returns {Boolean} true if the browser supports web assembly modules and the scene supports Basis Universal textures, false if not.
   */
  FeatureDetection.supportsBasis = function (scene) {
    return FeatureDetection.supportsWebAssembly() && scene.context.supportsBasis;
  };

  /**
   * Detects whether the current browser supports the full screen standard.
   *
   * @returns {Boolean} true if the browser supports the full screen standard, false if not.
   *
   * @see Fullscreen
   * @see {@link http://dvcs.w3.org/hg/fullscreen/raw-file/tip/Overview.html|W3C Fullscreen Living Specification}
   */
  FeatureDetection.supportsFullscreen = function () {
    return Fullscreen$1.supportsFullscreen();
  };

  /**
   * Detects whether the current browser supports typed arrays.
   *
   * @returns {Boolean} true if the browser supports typed arrays, false if not.
   *
   * @see {@link https://tc39.es/ecma262/#sec-typedarray-objects|Typed Array Specification}
   */
  FeatureDetection.supportsTypedArrays = function () {
    return typeof ArrayBuffer !== "undefined";
  };

  /**
   * Detects whether the current browser supports BigInt64Array typed arrays.
   *
   * @returns {Boolean} true if the browser supports BigInt64Array typed arrays, false if not.
   *
   * @see {@link https://tc39.es/ecma262/#sec-typedarray-objects|Typed Array Specification}
   */
  FeatureDetection.supportsBigInt64Array = function () {
    return typeof BigInt64Array !== "undefined";
  };

  /**
   * Detects whether the current browser supports BigUint64Array typed arrays.
   *
   * @returns {Boolean} true if the browser supports BigUint64Array typed arrays, false if not.
   *
   * @see {@link https://tc39.es/ecma262/#sec-typedarray-objects|Typed Array Specification}
   */
  FeatureDetection.supportsBigUint64Array = function () {
    return typeof BigUint64Array !== "undefined";
  };

  /**
   * Detects whether the current browser supports BigInt.
   *
   * @returns {Boolean} true if the browser supports BigInt, false if not.
   *
   * @see {@link https://tc39.es/ecma262/#sec-bigint-objects|BigInt Specification}
   */
  FeatureDetection.supportsBigInt = function () {
    return typeof BigInt !== "undefined";
  };

  /**
   * Detects whether the current browser supports Web Workers.
   *
   * @returns {Boolean} true if the browsers supports Web Workers, false if not.
   *
   * @see {@link http://www.w3.org/TR/workers/}
   */
  FeatureDetection.supportsWebWorkers = function () {
    return typeof Worker !== "undefined";
  };

  /**
   * Detects whether the current browser supports Web Assembly.
   *
   * @returns {Boolean} true if the browsers supports Web Assembly, false if not.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/WebAssembly}
   */
  FeatureDetection.supportsWebAssembly = function () {
    return typeof WebAssembly !== "undefined";
  };
  var FeatureDetection$1 = FeatureDetection;

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

  let fromAxisAngleScratch = new Cartesian3.Cartesian3();

  /**
   * Computes a quaternion representing a rotation around an axis.
   *
   * @param {Cartesian3} axis The axis of rotation.
   * @param {Number} angle The angle in radians to rotate around the axis.
   * @param {Quaternion} [result] The object onto which to store the result.
   * @returns {Quaternion} The modified result parameter or a new Quaternion instance if one was not provided.
   */
  Quaternion.fromAxisAngle = function (axis, angle, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("axis", axis);
    Check.Check.typeOf.number("angle", angle);
    //>>includeEnd('debug');

    const halfAngle = angle / 2.0;
    const s = Math.sin(halfAngle);
    fromAxisAngleScratch = Cartesian3.Cartesian3.normalize(axis, fromAxisAngleScratch);

    const x = fromAxisAngleScratch.x * s;
    const y = fromAxisAngleScratch.y * s;
    const z = fromAxisAngleScratch.z * s;
    const w = Math.cos(halfAngle);
    if (!defined.defined(result)) {
      return new Quaternion(x, y, z, w);
    }
    result.x = x;
    result.y = y;
    result.z = z;
    result.w = w;
    return result;
  };

  const fromRotationMatrixNext = [1, 2, 0];
  const fromRotationMatrixQuat = new Array(3);
  /**
   * Computes a Quaternion from the provided Matrix3 instance.
   *
   * @param {Matrix3} matrix The rotation matrix.
   * @param {Quaternion} [result] The object onto which to store the result.
   * @returns {Quaternion} The modified result parameter or a new Quaternion instance if one was not provided.
   *
   * @see Matrix3.fromQuaternion
   */
  Quaternion.fromRotationMatrix = function (matrix, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("matrix", matrix);
    //>>includeEnd('debug');

    let root;
    let x;
    let y;
    let z;
    let w;

    const m00 = matrix[Matrix2.Matrix3.COLUMN0ROW0];
    const m11 = matrix[Matrix2.Matrix3.COLUMN1ROW1];
    const m22 = matrix[Matrix2.Matrix3.COLUMN2ROW2];
    const trace = m00 + m11 + m22;

    if (trace > 0.0) {
      // |w| > 1/2, may as well choose w > 1/2
      root = Math.sqrt(trace + 1.0); // 2w
      w = 0.5 * root;
      root = 0.5 / root; // 1/(4w)

      x = (matrix[Matrix2.Matrix3.COLUMN1ROW2] - matrix[Matrix2.Matrix3.COLUMN2ROW1]) * root;
      y = (matrix[Matrix2.Matrix3.COLUMN2ROW0] - matrix[Matrix2.Matrix3.COLUMN0ROW2]) * root;
      z = (matrix[Matrix2.Matrix3.COLUMN0ROW1] - matrix[Matrix2.Matrix3.COLUMN1ROW0]) * root;
    } else {
      // |w| <= 1/2
      const next = fromRotationMatrixNext;

      let i = 0;
      if (m11 > m00) {
        i = 1;
      }
      if (m22 > m00 && m22 > m11) {
        i = 2;
      }
      const j = next[i];
      const k = next[j];

      root = Math.sqrt(
        matrix[Matrix2.Matrix3.getElementIndex(i, i)] -
          matrix[Matrix2.Matrix3.getElementIndex(j, j)] -
          matrix[Matrix2.Matrix3.getElementIndex(k, k)] +
          1.0
      );

      const quat = fromRotationMatrixQuat;
      quat[i] = 0.5 * root;
      root = 0.5 / root;
      w =
        (matrix[Matrix2.Matrix3.getElementIndex(k, j)] -
          matrix[Matrix2.Matrix3.getElementIndex(j, k)]) *
        root;
      quat[j] =
        (matrix[Matrix2.Matrix3.getElementIndex(j, i)] +
          matrix[Matrix2.Matrix3.getElementIndex(i, j)]) *
        root;
      quat[k] =
        (matrix[Matrix2.Matrix3.getElementIndex(k, i)] +
          matrix[Matrix2.Matrix3.getElementIndex(i, k)]) *
        root;

      x = -quat[0];
      y = -quat[1];
      z = -quat[2];
    }

    if (!defined.defined(result)) {
      return new Quaternion(x, y, z, w);
    }
    result.x = x;
    result.y = y;
    result.z = z;
    result.w = w;
    return result;
  };

  const scratchHPRQuaternion$1 = new Quaternion();
  let scratchHeadingQuaternion = new Quaternion();
  let scratchPitchQuaternion = new Quaternion();
  let scratchRollQuaternion = new Quaternion();

  /**
   * Computes a rotation from the given heading, pitch and roll angles. Heading is the rotation about the
   * negative z axis. Pitch is the rotation about the negative y axis. Roll is the rotation about
   * the positive x axis.
   *
   * @param {HeadingPitchRoll} headingPitchRoll The rotation expressed as a heading, pitch and roll.
   * @param {Quaternion} [result] The object onto which to store the result.
   * @returns {Quaternion} The modified result parameter or a new Quaternion instance if none was provided.
   */
  Quaternion.fromHeadingPitchRoll = function (headingPitchRoll, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("headingPitchRoll", headingPitchRoll);
    //>>includeEnd('debug');

    scratchRollQuaternion = Quaternion.fromAxisAngle(
      Cartesian3.Cartesian3.UNIT_X,
      headingPitchRoll.roll,
      scratchHPRQuaternion$1
    );
    scratchPitchQuaternion = Quaternion.fromAxisAngle(
      Cartesian3.Cartesian3.UNIT_Y,
      -headingPitchRoll.pitch,
      result
    );
    result = Quaternion.multiply(
      scratchPitchQuaternion,
      scratchRollQuaternion,
      scratchPitchQuaternion
    );
    scratchHeadingQuaternion = Quaternion.fromAxisAngle(
      Cartesian3.Cartesian3.UNIT_Z,
      -headingPitchRoll.heading,
      scratchHPRQuaternion$1
    );
    return Quaternion.multiply(scratchHeadingQuaternion, result, result);
  };

  const sampledQuaternionAxis = new Cartesian3.Cartesian3();
  const sampledQuaternionRotation = new Cartesian3.Cartesian3();
  const sampledQuaternionTempQuaternion = new Quaternion();
  const sampledQuaternionQuaternion0 = new Quaternion();
  const sampledQuaternionQuaternion0Conjugate = new Quaternion();

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
  Quaternion.pack = function (value, array, startingIndex) {
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
   * @param {Quaternion} [result] The object into which to store the result.
   * @returns {Quaternion} The modified result parameter or a new Quaternion instance if one was not provided.
   */
  Quaternion.unpack = function (array, startingIndex, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.defined("array", array);
    //>>includeEnd('debug');

    startingIndex = defined.defaultValue(startingIndex, 0);

    if (!defined.defined(result)) {
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
   * @param {Number[]} [result] The object into which to store the result.
   */
  Quaternion.convertPackedArrayForInterpolation = function (
    packedArray,
    startingIndex,
    lastIndex,
    result
  ) {
    Quaternion.unpack(
      packedArray,
      lastIndex * 4,
      sampledQuaternionQuaternion0Conjugate
    );
    Quaternion.conjugate(
      sampledQuaternionQuaternion0Conjugate,
      sampledQuaternionQuaternion0Conjugate
    );

    for (let i = 0, len = lastIndex - startingIndex + 1; i < len; i++) {
      const offset = i * 3;
      Quaternion.unpack(
        packedArray,
        (startingIndex + i) * 4,
        sampledQuaternionTempQuaternion
      );

      Quaternion.multiply(
        sampledQuaternionTempQuaternion,
        sampledQuaternionQuaternion0Conjugate,
        sampledQuaternionTempQuaternion
      );

      if (sampledQuaternionTempQuaternion.w < 0) {
        Quaternion.negate(
          sampledQuaternionTempQuaternion,
          sampledQuaternionTempQuaternion
        );
      }

      Quaternion.computeAxis(
        sampledQuaternionTempQuaternion,
        sampledQuaternionAxis
      );
      const angle = Quaternion.computeAngle(sampledQuaternionTempQuaternion);
      if (!defined.defined(result)) {
        result = [];
      }
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
  Quaternion.unpackInterpolationResult = function (
    array,
    sourceArray,
    firstIndex,
    lastIndex,
    result
  ) {
    if (!defined.defined(result)) {
      result = new Quaternion();
    }
    Cartesian3.Cartesian3.fromArray(array, 0, sampledQuaternionRotation);
    const magnitude = Cartesian3.Cartesian3.magnitude(sampledQuaternionRotation);

    Quaternion.unpack(sourceArray, lastIndex * 4, sampledQuaternionQuaternion0);

    if (magnitude === 0) {
      Quaternion.clone(Quaternion.IDENTITY, sampledQuaternionTempQuaternion);
    } else {
      Quaternion.fromAxisAngle(
        sampledQuaternionRotation,
        magnitude,
        sampledQuaternionTempQuaternion
      );
    }

    return Quaternion.multiply(
      sampledQuaternionTempQuaternion,
      sampledQuaternionQuaternion0,
      result
    );
  };

  /**
   * Duplicates a Quaternion instance.
   *
   * @param {Quaternion} quaternion The quaternion to duplicate.
   * @param {Quaternion} [result] The object onto which to store the result.
   * @returns {Quaternion} The modified result parameter or a new Quaternion instance if one was not provided. (Returns undefined if quaternion is undefined)
   */
  Quaternion.clone = function (quaternion, result) {
    if (!defined.defined(quaternion)) {
      return undefined;
    }

    if (!defined.defined(result)) {
      return new Quaternion(
        quaternion.x,
        quaternion.y,
        quaternion.z,
        quaternion.w
      );
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
  Quaternion.conjugate = function (quaternion, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("quaternion", quaternion);
    Check.Check.typeOf.object("result", result);
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
  Quaternion.magnitudeSquared = function (quaternion) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("quaternion", quaternion);
    //>>includeEnd('debug');

    return (
      quaternion.x * quaternion.x +
      quaternion.y * quaternion.y +
      quaternion.z * quaternion.z +
      quaternion.w * quaternion.w
    );
  };

  /**
   * Computes magnitude for the provided quaternion.
   *
   * @param {Quaternion} quaternion The quaternion to conjugate.
   * @returns {Number} The magnitude.
   */
  Quaternion.magnitude = function (quaternion) {
    return Math.sqrt(Quaternion.magnitudeSquared(quaternion));
  };

  /**
   * Computes the normalized form of the provided quaternion.
   *
   * @param {Quaternion} quaternion The quaternion to normalize.
   * @param {Quaternion} result The object onto which to store the result.
   * @returns {Quaternion} The modified result parameter.
   */
  Quaternion.normalize = function (quaternion, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("result", result);
    //>>includeEnd('debug');

    const inverseMagnitude = 1.0 / Quaternion.magnitude(quaternion);
    const x = quaternion.x * inverseMagnitude;
    const y = quaternion.y * inverseMagnitude;
    const z = quaternion.z * inverseMagnitude;
    const w = quaternion.w * inverseMagnitude;

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
  Quaternion.inverse = function (quaternion, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("result", result);
    //>>includeEnd('debug');

    const magnitudeSquared = Quaternion.magnitudeSquared(quaternion);
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
  Quaternion.add = function (left, right, result) {
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
   * Computes the componentwise difference of two quaternions.
   *
   * @param {Quaternion} left The first quaternion.
   * @param {Quaternion} right The second quaternion.
   * @param {Quaternion} result The object onto which to store the result.
   * @returns {Quaternion} The modified result parameter.
   */
  Quaternion.subtract = function (left, right, result) {
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
   * Negates the provided quaternion.
   *
   * @param {Quaternion} quaternion The quaternion to be negated.
   * @param {Quaternion} result The object onto which to store the result.
   * @returns {Quaternion} The modified result parameter.
   */
  Quaternion.negate = function (quaternion, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("quaternion", quaternion);
    Check.Check.typeOf.object("result", result);
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
  Quaternion.dot = function (left, right) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("left", left);
    Check.Check.typeOf.object("right", right);
    //>>includeEnd('debug');

    return (
      left.x * right.x + left.y * right.y + left.z * right.z + left.w * right.w
    );
  };

  /**
   * Computes the product of two quaternions.
   *
   * @param {Quaternion} left The first quaternion.
   * @param {Quaternion} right The second quaternion.
   * @param {Quaternion} result The object onto which to store the result.
   * @returns {Quaternion} The modified result parameter.
   */
  Quaternion.multiply = function (left, right, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("left", left);
    Check.Check.typeOf.object("right", right);
    Check.Check.typeOf.object("result", result);
    //>>includeEnd('debug');

    const leftX = left.x;
    const leftY = left.y;
    const leftZ = left.z;
    const leftW = left.w;

    const rightX = right.x;
    const rightY = right.y;
    const rightZ = right.z;
    const rightW = right.w;

    const x = leftW * rightX + leftX * rightW + leftY * rightZ - leftZ * rightY;
    const y = leftW * rightY - leftX * rightZ + leftY * rightW + leftZ * rightX;
    const z = leftW * rightZ + leftX * rightY - leftY * rightX + leftZ * rightW;
    const w = leftW * rightW - leftX * rightX - leftY * rightY - leftZ * rightZ;

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
  Quaternion.multiplyByScalar = function (quaternion, scalar, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("quaternion", quaternion);
    Check.Check.typeOf.number("scalar", scalar);
    Check.Check.typeOf.object("result", result);
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
  Quaternion.divideByScalar = function (quaternion, scalar, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("quaternion", quaternion);
    Check.Check.typeOf.number("scalar", scalar);
    Check.Check.typeOf.object("result", result);
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
  Quaternion.computeAxis = function (quaternion, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("quaternion", quaternion);
    Check.Check.typeOf.object("result", result);
    //>>includeEnd('debug');

    const w = quaternion.w;
    if (Math.abs(w - 1.0) < Math$1.CesiumMath.EPSILON6) {
      result.x = result.y = result.z = 0;
      return result;
    }

    const scalar = 1.0 / Math.sqrt(1.0 - w * w);

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
  Quaternion.computeAngle = function (quaternion) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("quaternion", quaternion);
    //>>includeEnd('debug');

    if (Math.abs(quaternion.w - 1.0) < Math$1.CesiumMath.EPSILON6) {
      return 0.0;
    }
    return 2.0 * Math.acos(quaternion.w);
  };

  let lerpScratch = new Quaternion();
  /**
   * Computes the linear interpolation or extrapolation at t using the provided quaternions.
   *
   * @param {Quaternion} start The value corresponding to t at 0.0.
   * @param {Quaternion} end The value corresponding to t at 1.0.
   * @param {Number} t The point along t at which to interpolate.
   * @param {Quaternion} result The object onto which to store the result.
   * @returns {Quaternion} The modified result parameter.
   */
  Quaternion.lerp = function (start, end, t, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("start", start);
    Check.Check.typeOf.object("end", end);
    Check.Check.typeOf.number("t", t);
    Check.Check.typeOf.object("result", result);
    //>>includeEnd('debug');

    lerpScratch = Quaternion.multiplyByScalar(end, t, lerpScratch);
    result = Quaternion.multiplyByScalar(start, 1.0 - t, result);
    return Quaternion.add(lerpScratch, result, result);
  };

  let slerpEndNegated = new Quaternion();
  let slerpScaledP = new Quaternion();
  let slerpScaledR = new Quaternion();
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
  Quaternion.slerp = function (start, end, t, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("start", start);
    Check.Check.typeOf.object("end", end);
    Check.Check.typeOf.number("t", t);
    Check.Check.typeOf.object("result", result);
    //>>includeEnd('debug');

    let dot = Quaternion.dot(start, end);

    // The angle between start must be acute. Since q and -q represent
    // the same rotation, negate q to get the acute angle.
    let r = end;
    if (dot < 0.0) {
      dot = -dot;
      r = slerpEndNegated = Quaternion.negate(end, slerpEndNegated);
    }

    // dot > 0, as the dot product approaches 1, the angle between the
    // quaternions vanishes. use linear interpolation.
    if (1.0 - dot < Math$1.CesiumMath.EPSILON6) {
      return Quaternion.lerp(start, r, t, result);
    }

    const theta = Math.acos(dot);
    slerpScaledP = Quaternion.multiplyByScalar(
      start,
      Math.sin((1 - t) * theta),
      slerpScaledP
    );
    slerpScaledR = Quaternion.multiplyByScalar(
      r,
      Math.sin(t * theta),
      slerpScaledR
    );
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
  Quaternion.log = function (quaternion, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("quaternion", quaternion);
    Check.Check.typeOf.object("result", result);
    //>>includeEnd('debug');

    const theta = Math$1.CesiumMath.acosClamped(quaternion.w);
    let thetaOverSinTheta = 0.0;

    if (theta !== 0.0) {
      thetaOverSinTheta = theta / Math.sin(theta);
    }

    return Cartesian3.Cartesian3.multiplyByScalar(quaternion, thetaOverSinTheta, result);
  };

  /**
   * The exponential quaternion function.
   *
   * @param {Cartesian3} cartesian The cartesian.
   * @param {Quaternion} result The object onto which to store the result.
   * @returns {Quaternion} The modified result parameter.
   */
  Quaternion.exp = function (cartesian, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("cartesian", cartesian);
    Check.Check.typeOf.object("result", result);
    //>>includeEnd('debug');

    const theta = Cartesian3.Cartesian3.magnitude(cartesian);
    let sinThetaOverTheta = 0.0;

    if (theta !== 0.0) {
      sinThetaOverTheta = Math.sin(theta) / theta;
    }

    result.x = cartesian.x * sinThetaOverTheta;
    result.y = cartesian.y * sinThetaOverTheta;
    result.z = cartesian.z * sinThetaOverTheta;
    result.w = Math.cos(theta);

    return result;
  };

  const squadScratchCartesian0 = new Cartesian3.Cartesian3();
  const squadScratchCartesian1 = new Cartesian3.Cartesian3();
  const squadScratchQuaternion0 = new Quaternion();
  const squadScratchQuaternion1 = new Quaternion();

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
  Quaternion.computeInnerQuadrangle = function (q0, q1, q2, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("q0", q0);
    Check.Check.typeOf.object("q1", q1);
    Check.Check.typeOf.object("q2", q2);
    Check.Check.typeOf.object("result", result);
    //>>includeEnd('debug');

    const qInv = Quaternion.conjugate(q1, squadScratchQuaternion0);
    Quaternion.multiply(qInv, q2, squadScratchQuaternion1);
    const cart0 = Quaternion.log(squadScratchQuaternion1, squadScratchCartesian0);

    Quaternion.multiply(qInv, q0, squadScratchQuaternion1);
    const cart1 = Quaternion.log(squadScratchQuaternion1, squadScratchCartesian1);

    Cartesian3.Cartesian3.add(cart0, cart1, cart0);
    Cartesian3.Cartesian3.multiplyByScalar(cart0, 0.25, cart0);
    Cartesian3.Cartesian3.negate(cart0, cart0);
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
   * const s0 = Cesium.Quaternion.computeInnerQuadrangle(quaternions[i - 1], quaternions[i], quaternions[i + 1], new Cesium.Quaternion());
   * const s1 = Cesium.Quaternion.computeInnerQuadrangle(quaternions[i], quaternions[i + 1], quaternions[i + 2], new Cesium.Quaternion());
   * const q = Cesium.Quaternion.squad(quaternions[i], quaternions[i + 1], s0, s1, t, new Cesium.Quaternion());
   *
   * // 2. compute the squad interpolation as above but where the first quaternion is a end point.
   * const s1 = Cesium.Quaternion.computeInnerQuadrangle(quaternions[0], quaternions[1], quaternions[2], new Cesium.Quaternion());
   * const q = Cesium.Quaternion.squad(quaternions[0], quaternions[1], quaternions[0], s1, t, new Cesium.Quaternion());
   *
   * @see Quaternion#computeInnerQuadrangle
   */
  Quaternion.squad = function (q0, q1, s0, s1, t, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("q0", q0);
    Check.Check.typeOf.object("q1", q1);
    Check.Check.typeOf.object("s0", s0);
    Check.Check.typeOf.object("s1", s1);
    Check.Check.typeOf.number("t", t);
    Check.Check.typeOf.object("result", result);
    //>>includeEnd('debug');

    const slerp0 = Quaternion.slerp(q0, q1, t, squadScratchQuaternion0);
    const slerp1 = Quaternion.slerp(s0, s1, t, squadScratchQuaternion1);
    return Quaternion.slerp(slerp0, slerp1, 2.0 * t * (1.0 - t), result);
  };

  const fastSlerpScratchQuaternion = new Quaternion();
  // eslint-disable-next-line no-loss-of-precision
  const opmu = 1.90110745351730037;
  const u = FeatureDetection$1.supportsTypedArrays() ? new Float32Array(8) : [];
  const v = FeatureDetection$1.supportsTypedArrays() ? new Float32Array(8) : [];
  const bT = FeatureDetection$1.supportsTypedArrays() ? new Float32Array(8) : [];
  const bD = FeatureDetection$1.supportsTypedArrays() ? new Float32Array(8) : [];

  for (let i = 0; i < 7; ++i) {
    const s = i + 1.0;
    const t = 2.0 * s + 1.0;
    u[i] = 1.0 / (s * t);
    v[i] = s / t;
  }

  u[7] = opmu / (8.0 * 17.0);
  v[7] = (opmu * 8.0) / 17.0;

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
  Quaternion.fastSlerp = function (start, end, t, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("start", start);
    Check.Check.typeOf.object("end", end);
    Check.Check.typeOf.number("t", t);
    Check.Check.typeOf.object("result", result);
    //>>includeEnd('debug');

    let x = Quaternion.dot(start, end);

    let sign;
    if (x >= 0) {
      sign = 1.0;
    } else {
      sign = -1.0;
      x = -x;
    }

    const xm1 = x - 1.0;
    const d = 1.0 - t;
    const sqrT = t * t;
    const sqrD = d * d;

    for (let i = 7; i >= 0; --i) {
      bT[i] = (u[i] * sqrT - v[i]) * xm1;
      bD[i] = (u[i] * sqrD - v[i]) * xm1;
    }

    const cT =
      sign *
      t *
      (1.0 +
        bT[0] *
          (1.0 +
            bT[1] *
              (1.0 +
                bT[2] *
                  (1.0 +
                    bT[3] *
                      (1.0 +
                        bT[4] *
                          (1.0 + bT[5] * (1.0 + bT[6] * (1.0 + bT[7]))))))));
    const cD =
      d *
      (1.0 +
        bD[0] *
          (1.0 +
            bD[1] *
              (1.0 +
                bD[2] *
                  (1.0 +
                    bD[3] *
                      (1.0 +
                        bD[4] *
                          (1.0 + bD[5] * (1.0 + bD[6] * (1.0 + bD[7]))))))));

    const temp = Quaternion.multiplyByScalar(
      start,
      cD,
      fastSlerpScratchQuaternion
    );
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
  Quaternion.fastSquad = function (q0, q1, s0, s1, t, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("q0", q0);
    Check.Check.typeOf.object("q1", q1);
    Check.Check.typeOf.object("s0", s0);
    Check.Check.typeOf.object("s1", s1);
    Check.Check.typeOf.number("t", t);
    Check.Check.typeOf.object("result", result);
    //>>includeEnd('debug');

    const slerp0 = Quaternion.fastSlerp(q0, q1, t, squadScratchQuaternion0);
    const slerp1 = Quaternion.fastSlerp(s0, s1, t, squadScratchQuaternion1);
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
  Quaternion.equals = function (left, right) {
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
   * Compares the provided quaternions componentwise and returns
   * <code>true</code> if they are within the provided epsilon,
   * <code>false</code> otherwise.
   *
   * @param {Quaternion} [left] The first quaternion.
   * @param {Quaternion} [right] The second quaternion.
   * @param {Number} [epsilon=0] The epsilon to use for equality testing.
   * @returns {Boolean} <code>true</code> if left and right are within the provided epsilon, <code>false</code> otherwise.
   */
  Quaternion.equalsEpsilon = function (left, right, epsilon) {
    epsilon = defined.defaultValue(epsilon, 0);

    return (
      left === right ||
      (defined.defined(left) &&
        defined.defined(right) &&
        Math.abs(left.x - right.x) <= epsilon &&
        Math.abs(left.y - right.y) <= epsilon &&
        Math.abs(left.z - right.z) <= epsilon &&
        Math.abs(left.w - right.w) <= epsilon)
    );
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
  Quaternion.prototype.clone = function (result) {
    return Quaternion.clone(this, result);
  };

  /**
   * Compares this and the provided quaternion componentwise and returns
   * <code>true</code> if they are equal, <code>false</code> otherwise.
   *
   * @param {Quaternion} [right] The right hand side quaternion.
   * @returns {Boolean} <code>true</code> if left and right are equal, <code>false</code> otherwise.
   */
  Quaternion.prototype.equals = function (right) {
    return Quaternion.equals(this, right);
  };

  /**
   * Compares this and the provided quaternion componentwise and returns
   * <code>true</code> if they are within the provided epsilon,
   * <code>false</code> otherwise.
   *
   * @param {Quaternion} [right] The right hand side quaternion.
   * @param {Number} [epsilon=0] The epsilon to use for equality testing.
   * @returns {Boolean} <code>true</code> if left and right are within the provided epsilon, <code>false</code> otherwise.
   */
  Quaternion.prototype.equalsEpsilon = function (right, epsilon) {
    return Quaternion.equalsEpsilon(this, right, epsilon);
  };

  /**
   * Returns a string representing this quaternion in the format (x, y, z, w).
   *
   * @returns {String} A string representing this Quaternion.
   */
  Quaternion.prototype.toString = function () {
    return `(${this.x}, ${this.y}, ${this.z}, ${this.w})`;
  };

  /**
   * Finds an item in a sorted array.
   *
   * @function
   * @param {Array} array The sorted array to search.
   * @param {*} itemToFind The item to find in the array.
   * @param {binarySearchComparator} comparator The function to use to compare the item to
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
   * const numbers = [0, 2, 4, 6, 8];
   * const index = Cesium.binarySearch(numbers, 6, comparator); // 3
   */
  function binarySearch(array, itemToFind, comparator) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.defined("array", array);
    Check.Check.defined("itemToFind", itemToFind);
    Check.Check.defined("comparator", comparator);
    //>>includeEnd('debug');

    let low = 0;
    let high = array.length - 1;
    let i;
    let comparison;

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
  function EarthOrientationParametersSample(
    xPoleWander,
    yPoleWander,
    xPoleOffset,
    yPoleOffset,
    ut1MinusUtc
  ) {
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
   * Represents a Gregorian date in a more precise format than the JavaScript Date object.
   * In addition to submillisecond precision, this object can also represent leap seconds.
   * @alias GregorianDate
   * @constructor
   *
   * @param {Number} [year] The year as a whole number.
   * @param {Number} [month] The month as a whole number with range [1, 12].
   * @param {Number} [day] The day of the month as a whole number starting at 1.
   * @param {Number} [hour] The hour as a whole number with range [0, 23].
   * @param {Number} [minute] The minute of the hour as a whole number with range [0, 59].
   * @param {Number} [second] The second of the minute as a whole number with range [0, 60], with 60 representing a leap second.
   * @param {Number} [millisecond] The millisecond of the second as a floating point number with range [0.0, 1000.0).
   * @param {Boolean} [isLeapSecond] Whether this time is during a leap second.
   *
   * @see JulianDate#toGregorianDate
   */
  function GregorianDate(
    year,
    month,
    day,
    hour,
    minute,
    second,
    millisecond,
    isLeapSecond
  ) {
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
   * @function isLeapYear
   *
   * @param {Number} year The year to be tested.
   * @returns {Boolean} True if <code>year</code> is a leap year.
   *
   * @example
   * const leapYear = Cesium.isLeapYear(2000); // true
   */
  function isLeapYear(year) {
    //>>includeStart('debug', pragmas.debug);
    if (year === null || isNaN(year)) {
      throw new Check.DeveloperError("year is required and must be a number.");
    }
    //>>includeEnd('debug');

    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
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
   * @namespace TimeConstants
   *
   * @see JulianDate
   *
   * @private
   */
  const TimeConstants = {
    /**
     * The number of seconds in one millisecond: <code>0.001</code>
     * @type {Number}
     * @constant
     */
    SECONDS_PER_MILLISECOND: 0.001,

    /**
     * The number of seconds in one minute: <code>60</code>.
     * @type {Number}
     * @constant
     */
    SECONDS_PER_MINUTE: 60.0,

    /**
     * The number of minutes in one hour: <code>60</code>.
     * @type {Number}
     * @constant
     */
    MINUTES_PER_HOUR: 60.0,

    /**
     * The number of hours in one day: <code>24</code>.
     * @type {Number}
     * @constant
     */
    HOURS_PER_DAY: 24.0,

    /**
     * The number of seconds in one hour: <code>3600</code>.
     * @type {Number}
     * @constant
     */
    SECONDS_PER_HOUR: 3600.0,

    /**
     * The number of minutes in one day: <code>1440</code>.
     * @type {Number}
     * @constant
     */
    MINUTES_PER_DAY: 1440.0,

    /**
     * The number of seconds in one day, ignoring leap seconds: <code>86400</code>.
     * @type {Number}
     * @constant
     */
    SECONDS_PER_DAY: 86400.0,

    /**
     * The number of days in one Julian century: <code>36525</code>.
     * @type {Number}
     * @constant
     */
    DAYS_PER_JULIAN_CENTURY: 36525.0,

    /**
     * One trillionth of a second.
     * @type {Number}
     * @constant
     */
    PICOSECOND: 0.000000001,

    /**
     * The number of days to subtract from a Julian date to determine the
     * modified Julian date, which gives the number of days since midnight
     * on November 17, 1858.
     * @type {Number}
     * @constant
     */
    MODIFIED_JULIAN_DATE_DIFFERENCE: 2400000.5,
  };
  var TimeConstants$1 = Object.freeze(TimeConstants);

  /**
   * Provides the type of time standards which JulianDate can take as input.
   *
   * @enum {Number}
   *
   * @see JulianDate
   */
  const TimeStandard = {
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
    UTC: 0,

    /**
     * Represents the International Atomic Time (TAI) time standard.
     * TAI is the principal time standard to which the other time standards are related.
     *
     * @type {Number}
     * @constant
     */
    TAI: 1,
  };
  var TimeStandard$1 = Object.freeze(TimeStandard);

  const gregorianDateScratch = new GregorianDate();
  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const daysInLeapFeburary = 29;

  function compareLeapSecondDates$1(leapSecond, dateToFind) {
    return JulianDate.compare(leapSecond.julianDate, dateToFind.julianDate);
  }

  // we don't really need a leap second instance, anything with a julianDate property will do
  const binarySearchScratchLeapSecond = new LeapSecond();

  function convertUtcToTai(julianDate) {
    //Even though julianDate is in UTC, we'll treat it as TAI and
    //search the leap second table for it.
    binarySearchScratchLeapSecond.julianDate = julianDate;
    const leapSeconds = JulianDate.leapSeconds;
    let index = binarySearch(
      leapSeconds,
      binarySearchScratchLeapSecond,
      compareLeapSecondDates$1
    );

    if (index < 0) {
      index = ~index;
    }

    if (index >= leapSeconds.length) {
      index = leapSeconds.length - 1;
    }

    let offset = leapSeconds[index].offset;
    if (index > 0) {
      //Now we have the index of the closest leap second that comes on or after our UTC time.
      //However, if the difference between the UTC date being converted and the TAI
      //defined leap second is greater than the offset, we are off by one and need to use
      //the previous leap second.
      const difference = JulianDate.secondsDifference(
        leapSeconds[index].julianDate,
        julianDate
      );
      if (difference > offset) {
        index--;
        offset = leapSeconds[index].offset;
      }
    }

    JulianDate.addSeconds(julianDate, offset, julianDate);
  }

  function convertTaiToUtc(julianDate, result) {
    binarySearchScratchLeapSecond.julianDate = julianDate;
    const leapSeconds = JulianDate.leapSeconds;
    let index = binarySearch(
      leapSeconds,
      binarySearchScratchLeapSecond,
      compareLeapSecondDates$1
    );
    if (index < 0) {
      index = ~index;
    }

    //All times before our first leap second get the first offset.
    if (index === 0) {
      return JulianDate.addSeconds(julianDate, -leapSeconds[0].offset, result);
    }

    //All times after our leap second get the last offset.
    if (index >= leapSeconds.length) {
      return JulianDate.addSeconds(
        julianDate,
        -leapSeconds[index - 1].offset,
        result
      );
    }

    //Compute the difference between the found leap second and the time we are converting.
    const difference = JulianDate.secondsDifference(
      leapSeconds[index].julianDate,
      julianDate
    );

    if (difference === 0) {
      //The date is in our leap second table.
      return JulianDate.addSeconds(
        julianDate,
        -leapSeconds[index].offset,
        result
      );
    }

    if (difference <= 1.0) {
      //The requested date is during the moment of a leap second, then we cannot convert to UTC
      return undefined;
    }

    //The time is in between two leap seconds, index is the leap second after the date
    //we're converting, so we subtract one to get the correct LeapSecond instance.
    return JulianDate.addSeconds(
      julianDate,
      -leapSeconds[--index].offset,
      result
    );
  }

  function setComponents(wholeDays, secondsOfDay, julianDate) {
    const extraDays = (secondsOfDay / TimeConstants$1.SECONDS_PER_DAY) | 0;
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

  function computeJulianDateComponents(
    year,
    month,
    day,
    hour,
    minute,
    second,
    millisecond
  ) {
    // Algorithm from page 604 of the Explanatory Supplement to the
    // Astronomical Almanac (Seidelmann 1992).

    const a = ((month - 14) / 12) | 0;
    const b = year + 4800 + a;
    let dayNumber =
      (((1461 * b) / 4) | 0) +
      (((367 * (month - 2 - 12 * a)) / 12) | 0) -
      (((3 * (((b + 100) / 100) | 0)) / 4) | 0) +
      day -
      32075;

    // JulianDates are noon-based
    hour = hour - 12;
    if (hour < 0) {
      hour += 24;
    }

    const secondsOfDay =
      second +
      (hour * TimeConstants$1.SECONDS_PER_HOUR +
        minute * TimeConstants$1.SECONDS_PER_MINUTE +
        millisecond * TimeConstants$1.SECONDS_PER_MILLISECOND);

    if (secondsOfDay >= 43200.0) {
      dayNumber -= 1;
    }

    return [dayNumber, secondsOfDay];
  }

  //Regular expressions used for ISO8601 date parsing.
  //YYYY
  const matchCalendarYear = /^(\d{4})$/;
  //YYYY-MM (YYYYMM is invalid)
  const matchCalendarMonth = /^(\d{4})-(\d{2})$/;
  //YYYY-DDD or YYYYDDD
  const matchOrdinalDate = /^(\d{4})-?(\d{3})$/;
  //YYYY-Www or YYYYWww or YYYY-Www-D or YYYYWwwD
  const matchWeekDate = /^(\d{4})-?W(\d{2})-?(\d{1})?$/;
  //YYYY-MM-DD or YYYYMMDD
  const matchCalendarDate = /^(\d{4})-?(\d{2})-?(\d{2})$/;
  // Match utc offset
  const utcOffset = /([Z+\-])?(\d{2})?:?(\d{2})?$/;
  // Match hours HH or HH.xxxxx
  const matchHours = /^(\d{2})(\.\d+)?/.source + utcOffset.source;
  // Match hours/minutes HH:MM HHMM.xxxxx
  const matchHoursMinutes = /^(\d{2}):?(\d{2})(\.\d+)?/.source + utcOffset.source;
  // Match hours/minutes HH:MM:SS HHMMSS.xxxxx
  const matchHoursMinutesSeconds =
    /^(\d{2}):?(\d{2}):?(\d{2})(\.\d+)?/.source + utcOffset.source;

  const iso8601ErrorMessage = "Invalid ISO 8601 date.";

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

    julianDayNumber = defined.defaultValue(julianDayNumber, 0.0);
    secondsOfDay = defined.defaultValue(secondsOfDay, 0.0);
    timeStandard = defined.defaultValue(timeStandard, TimeStandard$1.UTC);

    //If julianDayNumber is fractional, make it an integer and add the number of seconds the fraction represented.
    const wholeDays = julianDayNumber | 0;
    secondsOfDay =
      secondsOfDay +
      (julianDayNumber - wholeDays) * TimeConstants$1.SECONDS_PER_DAY;

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
  JulianDate.fromGregorianDate = function (date, result) {
    //>>includeStart('debug', pragmas.debug);
    if (!(date instanceof GregorianDate)) {
      throw new Check.DeveloperError("date must be a valid GregorianDate.");
    }
    //>>includeEnd('debug');

    const components = computeJulianDateComponents(
      date.year,
      date.month,
      date.day,
      date.hour,
      date.minute,
      date.second,
      date.millisecond
    );
    if (!defined.defined(result)) {
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
  JulianDate.fromDate = function (date, result) {
    //>>includeStart('debug', pragmas.debug);
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      throw new Check.DeveloperError("date must be a valid JavaScript Date.");
    }
    //>>includeEnd('debug');

    const components = computeJulianDateComponents(
      date.getUTCFullYear(),
      date.getUTCMonth() + 1,
      date.getUTCDate(),
      date.getUTCHours(),
      date.getUTCMinutes(),
      date.getUTCSeconds(),
      date.getUTCMilliseconds()
    );
    if (!defined.defined(result)) {
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
  JulianDate.fromIso8601 = function (iso8601String, result) {
    //>>includeStart('debug', pragmas.debug);
    if (typeof iso8601String !== "string") {
      throw new Check.DeveloperError(iso8601ErrorMessage);
    }
    //>>includeEnd('debug');

    //Comma and decimal point both indicate a fractional number according to ISO 8601,
    //start out by blanket replacing , with . which is the only valid such symbol in JS.
    iso8601String = iso8601String.replace(",", ".");

    //Split the string into its date and time components, denoted by a mandatory T
    let tokens = iso8601String.split("T");
    let year;
    let month = 1;
    let day = 1;
    let hour = 0;
    let minute = 0;
    let second = 0;
    let millisecond = 0;

    //Lacking a time is okay, but a missing date is illegal.
    const date = tokens[0];
    const time = tokens[1];
    let tmp;
    let inLeapYear;
    //>>includeStart('debug', pragmas.debug);
    if (!defined.defined(date)) {
      throw new Check.DeveloperError(iso8601ErrorMessage);
    }

    let dashCount;
    //>>includeEnd('debug');

    //First match the date against possible regular expressions.
    tokens = date.match(matchCalendarDate);
    if (tokens !== null) {
      //>>includeStart('debug', pragmas.debug);
      dashCount = date.split("-").length - 1;
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
          let dayOfYear;
          tokens = date.match(matchOrdinalDate);
          if (tokens !== null) {
            year = +tokens[1];
            dayOfYear = +tokens[2];
            inLeapYear = isLeapYear(year);

            //This validation is only applicable for this format.
            //>>includeStart('debug', pragmas.debug);
            if (
              dayOfYear < 1 ||
              (inLeapYear && dayOfYear > 366) ||
              (!inLeapYear && dayOfYear > 365)
            ) {
              throw new Check.DeveloperError(iso8601ErrorMessage);
            }
            //>>includeEnd('debug')
          } else {
            tokens = date.match(matchWeekDate);
            if (tokens !== null) {
              //ISO week date to ordinal date from
              //http://en.wikipedia.org/w/index.php?title=ISO_week_date&oldid=474176775
              year = +tokens[1];
              const weekNumber = +tokens[2];
              const dayOfWeek = +tokens[3] || 0;

              //>>includeStart('debug', pragmas.debug);
              dashCount = date.split("-").length - 1;
              if (
                dashCount > 0 &&
                ((!defined.defined(tokens[3]) && dashCount !== 1) ||
                  (defined.defined(tokens[3]) && dashCount !== 2))
              ) {
                throw new Check.DeveloperError(iso8601ErrorMessage);
              }
              //>>includeEnd('debug')

              const january4 = new Date(Date.UTC(year, 0, 4));
              dayOfYear = weekNumber * 7 + dayOfWeek - january4.getUTCDay() - 3;
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
    if (
      month < 1 ||
      month > 12 ||
      day < 1 ||
      ((month !== 2 || !inLeapYear) && day > daysInMonth[month - 1]) ||
      (inLeapYear && month === 2 && day > daysInLeapFeburary)
    ) {
      throw new Check.DeveloperError(iso8601ErrorMessage);
    }
    //>>includeEnd('debug')

    //Now move onto the time string, which is much simpler.
    //If no time is specified, it is considered the beginning of the day, UTC to match Javascript's implementation.
    let offsetIndex;
    if (defined.defined(time)) {
      tokens = time.match(matchHoursMinutesSeconds);
      if (tokens !== null) {
        //>>includeStart('debug', pragmas.debug);
        dashCount = time.split(":").length - 1;
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
          dashCount = time.split(":").length - 1;
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
      if (
        minute >= 60 ||
        second >= 61 ||
        hour > 24 ||
        (hour === 24 && (minute > 0 || second > 0 || millisecond > 0))
      ) {
        throw new Check.DeveloperError(iso8601ErrorMessage);
      }
      //>>includeEnd('debug');

      //Check the UTC offset value, if no value exists, use local time
      //a Z indicates UTC, + or - are offsets.
      const offset = tokens[offsetIndex];
      const offsetHours = +tokens[offsetIndex + 1];
      const offsetMinutes = +(tokens[offsetIndex + 2] || 0);
      switch (offset) {
        case "+":
          hour = hour - offsetHours;
          minute = minute - offsetMinutes;
          break;
        case "-":
          hour = hour + offsetHours;
          minute = minute + offsetMinutes;
          break;
        case "Z":
          break;
        default:
          minute =
            minute +
            new Date(
              Date.UTC(year, month - 1, day, hour, minute)
            ).getTimezoneOffset();
          break;
      }
    }

    //ISO8601 denotes a leap second by any time having a seconds component of 60 seconds.
    //If that's the case, we need to temporarily subtract a second in order to build a UTC date.
    //Then we add it back in after converting to TAI.
    const isLeapSecond = second === 60;
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

    tmp = inLeapYear && month === 2 ? daysInLeapFeburary : daysInMonth[month - 1];
    while (day > tmp) {
      day -= tmp;
      month++;

      if (month > 12) {
        month -= 12;
        year++;
      }

      tmp =
        inLeapYear && month === 2 ? daysInLeapFeburary : daysInMonth[month - 1];
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

      tmp =
        inLeapYear && month === 2 ? daysInLeapFeburary : daysInMonth[month - 1];
      day += tmp;
    }

    //Now create the JulianDate components from the Gregorian date and actually create our instance.
    const components = computeJulianDateComponents(
      year,
      month,
      day,
      hour,
      minute,
      second,
      millisecond
    );

    if (!defined.defined(result)) {
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
  JulianDate.now = function (result) {
    return JulianDate.fromDate(new Date(), result);
  };

  const toGregorianDateScratch = new JulianDate(0, 0, TimeStandard$1.TAI);

  /**
   * Creates a {@link GregorianDate} from the provided instance.
   *
   * @param {JulianDate} julianDate The date to be converted.
   * @param {GregorianDate} [result] An existing instance to use for the result.
   * @returns {GregorianDate} The modified result parameter or a new instance if none was provided.
   */
  JulianDate.toGregorianDate = function (julianDate, result) {
    //>>includeStart('debug', pragmas.debug);
    if (!defined.defined(julianDate)) {
      throw new Check.DeveloperError("julianDate is required.");
    }
    //>>includeEnd('debug');

    let isLeapSecond = false;
    let thisUtc = convertTaiToUtc(julianDate, toGregorianDateScratch);
    if (!defined.defined(thisUtc)) {
      //Conversion to UTC will fail if we are during a leap second.
      //If that's the case, subtract a second and convert again.
      //JavaScript doesn't support leap seconds, so this results in second 59 being repeated twice.
      JulianDate.addSeconds(julianDate, -1, toGregorianDateScratch);
      thisUtc = convertTaiToUtc(toGregorianDateScratch, toGregorianDateScratch);
      isLeapSecond = true;
    }

    let julianDayNumber = thisUtc.dayNumber;
    const secondsOfDay = thisUtc.secondsOfDay;

    if (secondsOfDay >= 43200.0) {
      julianDayNumber += 1;
    }

    // Algorithm from page 604 of the Explanatory Supplement to the
    // Astronomical Almanac (Seidelmann 1992).
    let L = (julianDayNumber + 68569) | 0;
    const N = ((4 * L) / 146097) | 0;
    L = (L - (((146097 * N + 3) / 4) | 0)) | 0;
    const I = ((4000 * (L + 1)) / 1461001) | 0;
    L = (L - (((1461 * I) / 4) | 0) + 31) | 0;
    const J = ((80 * L) / 2447) | 0;
    const day = (L - (((2447 * J) / 80) | 0)) | 0;
    L = (J / 11) | 0;
    const month = (J + 2 - 12 * L) | 0;
    const year = (100 * (N - 49) + I + L) | 0;

    let hour = (secondsOfDay / TimeConstants$1.SECONDS_PER_HOUR) | 0;
    let remainingSeconds = secondsOfDay - hour * TimeConstants$1.SECONDS_PER_HOUR;
    const minute = (remainingSeconds / TimeConstants$1.SECONDS_PER_MINUTE) | 0;
    remainingSeconds =
      remainingSeconds - minute * TimeConstants$1.SECONDS_PER_MINUTE;
    let second = remainingSeconds | 0;
    const millisecond =
      (remainingSeconds - second) / TimeConstants$1.SECONDS_PER_MILLISECOND;

    // JulianDates are noon-based
    hour += 12;
    if (hour > 23) {
      hour -= 24;
    }

    //If we were on a leap second, add it back.
    if (isLeapSecond) {
      second += 1;
    }

    if (!defined.defined(result)) {
      return new GregorianDate(
        year,
        month,
        day,
        hour,
        minute,
        second,
        millisecond,
        isLeapSecond
      );
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
  JulianDate.toDate = function (julianDate) {
    //>>includeStart('debug', pragmas.debug);
    if (!defined.defined(julianDate)) {
      throw new Check.DeveloperError("julianDate is required.");
    }
    //>>includeEnd('debug');

    const gDate = JulianDate.toGregorianDate(julianDate, gregorianDateScratch);
    let second = gDate.second;
    if (gDate.isLeapSecond) {
      second -= 1;
    }
    return new Date(
      Date.UTC(
        gDate.year,
        gDate.month - 1,
        gDate.day,
        gDate.hour,
        gDate.minute,
        second,
        gDate.millisecond
      )
    );
  };

  /**
   * Creates an ISO8601 representation of the provided date.
   *
   * @param {JulianDate} julianDate The date to be converted.
   * @param {Number} [precision] The number of fractional digits used to represent the seconds component.  By default, the most precise representation is used.
   * @returns {String} The ISO8601 representation of the provided date.
   */
  JulianDate.toIso8601 = function (julianDate, precision) {
    //>>includeStart('debug', pragmas.debug);
    if (!defined.defined(julianDate)) {
      throw new Check.DeveloperError("julianDate is required.");
    }
    //>>includeEnd('debug');

    const gDate = JulianDate.toGregorianDate(julianDate, gregorianDateScratch);
    let year = gDate.year;
    let month = gDate.month;
    let day = gDate.day;
    let hour = gDate.hour;
    const minute = gDate.minute;
    const second = gDate.second;
    const millisecond = gDate.millisecond;

    // special case - Iso8601.MAXIMUM_VALUE produces a string which we can't parse unless we adjust.
    // 10000-01-01T00:00:00 is the same instant as 9999-12-31T24:00:00
    if (
      year === 10000 &&
      month === 1 &&
      day === 1 &&
      hour === 0 &&
      minute === 0 &&
      second === 0 &&
      millisecond === 0
    ) {
      year = 9999;
      month = 12;
      day = 31;
      hour = 24;
    }

    let millisecondStr;

    if (!defined.defined(precision) && millisecond !== 0) {
      //Forces milliseconds into a number with at least 3 digits to whatever the default toString() precision is.
      millisecondStr = (millisecond * 0.01).toString().replace(".", "");
      return `${year.toString().padStart(4, "0")}-${month
      .toString()
      .padStart(2, "0")}-${day
      .toString()
      .padStart(2, "0")}T${hour
      .toString()
      .padStart(2, "0")}:${minute
      .toString()
      .padStart(2, "0")}:${second
      .toString()
      .padStart(2, "0")}.${millisecondStr}Z`;
    }

    //Precision is either 0 or milliseconds is 0 with undefined precision, in either case, leave off milliseconds entirely
    if (!defined.defined(precision) || precision === 0) {
      return `${year.toString().padStart(4, "0")}-${month
      .toString()
      .padStart(2, "0")}-${day
      .toString()
      .padStart(2, "0")}T${hour
      .toString()
      .padStart(2, "0")}:${minute
      .toString()
      .padStart(2, "0")}:${second.toString().padStart(2, "0")}Z`;
    }

    //Forces milliseconds into a number with at least 3 digits to whatever the specified precision is.
    millisecondStr = (millisecond * 0.01)
      .toFixed(precision)
      .replace(".", "")
      .slice(0, precision);
    return `${year.toString().padStart(4, "0")}-${month
    .toString()
    .padStart(2, "0")}-${day
    .toString()
    .padStart(2, "0")}T${hour
    .toString()
    .padStart(2, "0")}:${minute
    .toString()
    .padStart(2, "0")}:${second
    .toString()
    .padStart(2, "0")}.${millisecondStr}Z`;
  };

  /**
   * Duplicates a JulianDate instance.
   *
   * @param {JulianDate} julianDate The date to duplicate.
   * @param {JulianDate} [result] An existing instance to use for the result.
   * @returns {JulianDate} The modified result parameter or a new instance if none was provided. Returns undefined if julianDate is undefined.
   */
  JulianDate.clone = function (julianDate, result) {
    if (!defined.defined(julianDate)) {
      return undefined;
    }
    if (!defined.defined(result)) {
      return new JulianDate(
        julianDate.dayNumber,
        julianDate.secondsOfDay,
        TimeStandard$1.TAI
      );
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
  JulianDate.compare = function (left, right) {
    //>>includeStart('debug', pragmas.debug);
    if (!defined.defined(left)) {
      throw new Check.DeveloperError("left is required.");
    }
    if (!defined.defined(right)) {
      throw new Check.DeveloperError("right is required.");
    }
    //>>includeEnd('debug');

    const julianDayNumberDifference = left.dayNumber - right.dayNumber;
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
  JulianDate.equals = function (left, right) {
    return (
      left === right ||
      (defined.defined(left) &&
        defined.defined(right) &&
        left.dayNumber === right.dayNumber &&
        left.secondsOfDay === right.secondsOfDay)
    );
  };

  /**
   * Compares two instances and returns <code>true</code> if they are within <code>epsilon</code> seconds of
   * each other.  That is, in order for the dates to be considered equal (and for
   * this function to return <code>true</code>), the absolute value of the difference between them, in
   * seconds, must be less than <code>epsilon</code>.
   *
   * @param {JulianDate} [left] The first instance.
   * @param {JulianDate} [right] The second instance.
   * @param {Number} [epsilon=0] The maximum number of seconds that should separate the two instances.
   * @returns {Boolean} <code>true</code> if the two dates are within <code>epsilon</code> seconds of each other; otherwise <code>false</code>.
   */
  JulianDate.equalsEpsilon = function (left, right, epsilon) {
    epsilon = defined.defaultValue(epsilon, 0);

    return (
      left === right ||
      (defined.defined(left) &&
        defined.defined(right) &&
        Math.abs(JulianDate.secondsDifference(left, right)) <= epsilon)
    );
  };

  /**
   * Computes the total number of whole and fractional days represented by the provided instance.
   *
   * @param {JulianDate} julianDate The date.
   * @returns {Number} The Julian date as single floating point number.
   */
  JulianDate.totalDays = function (julianDate) {
    //>>includeStart('debug', pragmas.debug);
    if (!defined.defined(julianDate)) {
      throw new Check.DeveloperError("julianDate is required.");
    }
    //>>includeEnd('debug');
    return (
      julianDate.dayNumber +
      julianDate.secondsOfDay / TimeConstants$1.SECONDS_PER_DAY
    );
  };

  /**
   * Computes the difference in seconds between the provided instance.
   *
   * @param {JulianDate} left The first instance.
   * @param {JulianDate} right The second instance.
   * @returns {Number} The difference, in seconds, when subtracting <code>right</code> from <code>left</code>.
   */
  JulianDate.secondsDifference = function (left, right) {
    //>>includeStart('debug', pragmas.debug);
    if (!defined.defined(left)) {
      throw new Check.DeveloperError("left is required.");
    }
    if (!defined.defined(right)) {
      throw new Check.DeveloperError("right is required.");
    }
    //>>includeEnd('debug');

    const dayDifference =
      (left.dayNumber - right.dayNumber) * TimeConstants$1.SECONDS_PER_DAY;
    return dayDifference + (left.secondsOfDay - right.secondsOfDay);
  };

  /**
   * Computes the difference in days between the provided instance.
   *
   * @param {JulianDate} left The first instance.
   * @param {JulianDate} right The second instance.
   * @returns {Number} The difference, in days, when subtracting <code>right</code> from <code>left</code>.
   */
  JulianDate.daysDifference = function (left, right) {
    //>>includeStart('debug', pragmas.debug);
    if (!defined.defined(left)) {
      throw new Check.DeveloperError("left is required.");
    }
    if (!defined.defined(right)) {
      throw new Check.DeveloperError("right is required.");
    }
    //>>includeEnd('debug');

    const dayDifference = left.dayNumber - right.dayNumber;
    const secondDifference =
      (left.secondsOfDay - right.secondsOfDay) / TimeConstants$1.SECONDS_PER_DAY;
    return dayDifference + secondDifference;
  };

  /**
   * Computes the number of seconds the provided instance is ahead of UTC.
   *
   * @param {JulianDate} julianDate The date.
   * @returns {Number} The number of seconds the provided instance is ahead of UTC
   */
  JulianDate.computeTaiMinusUtc = function (julianDate) {
    binarySearchScratchLeapSecond.julianDate = julianDate;
    const leapSeconds = JulianDate.leapSeconds;
    let index = binarySearch(
      leapSeconds,
      binarySearchScratchLeapSecond,
      compareLeapSecondDates$1
    );
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
  JulianDate.addSeconds = function (julianDate, seconds, result) {
    //>>includeStart('debug', pragmas.debug);
    if (!defined.defined(julianDate)) {
      throw new Check.DeveloperError("julianDate is required.");
    }
    if (!defined.defined(seconds)) {
      throw new Check.DeveloperError("seconds is required.");
    }
    if (!defined.defined(result)) {
      throw new Check.DeveloperError("result is required.");
    }
    //>>includeEnd('debug');

    return setComponents(
      julianDate.dayNumber,
      julianDate.secondsOfDay + seconds,
      result
    );
  };

  /**
   * Adds the provided number of minutes to the provided date instance.
   *
   * @param {JulianDate} julianDate The date.
   * @param {Number} minutes The number of minutes to add or subtract.
   * @param {JulianDate} result An existing instance to use for the result.
   * @returns {JulianDate} The modified result parameter.
   */
  JulianDate.addMinutes = function (julianDate, minutes, result) {
    //>>includeStart('debug', pragmas.debug);
    if (!defined.defined(julianDate)) {
      throw new Check.DeveloperError("julianDate is required.");
    }
    if (!defined.defined(minutes)) {
      throw new Check.DeveloperError("minutes is required.");
    }
    if (!defined.defined(result)) {
      throw new Check.DeveloperError("result is required.");
    }
    //>>includeEnd('debug');

    const newSecondsOfDay =
      julianDate.secondsOfDay + minutes * TimeConstants$1.SECONDS_PER_MINUTE;
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
  JulianDate.addHours = function (julianDate, hours, result) {
    //>>includeStart('debug', pragmas.debug);
    if (!defined.defined(julianDate)) {
      throw new Check.DeveloperError("julianDate is required.");
    }
    if (!defined.defined(hours)) {
      throw new Check.DeveloperError("hours is required.");
    }
    if (!defined.defined(result)) {
      throw new Check.DeveloperError("result is required.");
    }
    //>>includeEnd('debug');

    const newSecondsOfDay =
      julianDate.secondsOfDay + hours * TimeConstants$1.SECONDS_PER_HOUR;
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
  JulianDate.addDays = function (julianDate, days, result) {
    //>>includeStart('debug', pragmas.debug);
    if (!defined.defined(julianDate)) {
      throw new Check.DeveloperError("julianDate is required.");
    }
    if (!defined.defined(days)) {
      throw new Check.DeveloperError("days is required.");
    }
    if (!defined.defined(result)) {
      throw new Check.DeveloperError("result is required.");
    }
    //>>includeEnd('debug');

    const newJulianDayNumber = julianDate.dayNumber + days;
    return setComponents(newJulianDayNumber, julianDate.secondsOfDay, result);
  };

  /**
   * Compares the provided instances and returns <code>true</code> if <code>left</code> is earlier than <code>right</code>, <code>false</code> otherwise.
   *
   * @param {JulianDate} left The first instance.
   * @param {JulianDate} right The second instance.
   * @returns {Boolean} <code>true</code> if <code>left</code> is earlier than <code>right</code>, <code>false</code> otherwise.
   */
  JulianDate.lessThan = function (left, right) {
    return JulianDate.compare(left, right) < 0;
  };

  /**
   * Compares the provided instances and returns <code>true</code> if <code>left</code> is earlier than or equal to <code>right</code>, <code>false</code> otherwise.
   *
   * @param {JulianDate} left The first instance.
   * @param {JulianDate} right The second instance.
   * @returns {Boolean} <code>true</code> if <code>left</code> is earlier than or equal to <code>right</code>, <code>false</code> otherwise.
   */
  JulianDate.lessThanOrEquals = function (left, right) {
    return JulianDate.compare(left, right) <= 0;
  };

  /**
   * Compares the provided instances and returns <code>true</code> if <code>left</code> is later than <code>right</code>, <code>false</code> otherwise.
   *
   * @param {JulianDate} left The first instance.
   * @param {JulianDate} right The second instance.
   * @returns {Boolean} <code>true</code> if <code>left</code> is later than <code>right</code>, <code>false</code> otherwise.
   */
  JulianDate.greaterThan = function (left, right) {
    return JulianDate.compare(left, right) > 0;
  };

  /**
   * Compares the provided instances and returns <code>true</code> if <code>left</code> is later than or equal to <code>right</code>, <code>false</code> otherwise.
   *
   * @param {JulianDate} left The first instance.
   * @param {JulianDate} right The second instance.
   * @returns {Boolean} <code>true</code> if <code>left</code> is later than or equal to <code>right</code>, <code>false</code> otherwise.
   */
  JulianDate.greaterThanOrEquals = function (left, right) {
    return JulianDate.compare(left, right) >= 0;
  };

  /**
   * Duplicates this instance.
   *
   * @param {JulianDate} [result] An existing instance to use for the result.
   * @returns {JulianDate} The modified result parameter or a new instance if none was provided.
   */
  JulianDate.prototype.clone = function (result) {
    return JulianDate.clone(this, result);
  };

  /**
   * Compares this and the provided instance and returns <code>true</code> if they are equal, <code>false</code> otherwise.
   *
   * @param {JulianDate} [right] The second instance.
   * @returns {Boolean} <code>true</code> if the dates are equal; otherwise, <code>false</code>.
   */
  JulianDate.prototype.equals = function (right) {
    return JulianDate.equals(this, right);
  };

  /**
   * Compares this and the provided instance and returns <code>true</code> if they are within <code>epsilon</code> seconds of
   * each other.  That is, in order for the dates to be considered equal (and for
   * this function to return <code>true</code>), the absolute value of the difference between them, in
   * seconds, must be less than <code>epsilon</code>.
   *
   * @param {JulianDate} [right] The second instance.
   * @param {Number} [epsilon=0] The maximum number of seconds that should separate the two instances.
   * @returns {Boolean} <code>true</code> if the two dates are within <code>epsilon</code> seconds of each other; otherwise <code>false</code>.
   */
  JulianDate.prototype.equalsEpsilon = function (right, epsilon) {
    return JulianDate.equalsEpsilon(this, right, epsilon);
  };

  /**
   * Creates a string representing this date in ISO8601 format.
   *
   * @returns {String} A string representing this date in ISO8601 format.
   */
  JulianDate.prototype.toString = function () {
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
    new LeapSecond(new JulianDate(2457754, 43237.0, TimeStandard$1.TAI), 37), // January 1, 2017 00:00:00 UTC
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
   * const eop = new Cesium.EarthOrientationParameters({ url : 'Data/EOP.json' });
   * Cesium.Transforms.earthOrientationParameters = eop;
   *
   * @private
   */
  function EarthOrientationParameters(options) {
    options = defined.defaultValue(options, defined.defaultValue.EMPTY_OBJECT);

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

    this._addNewLeapSeconds = defined.defaultValue(options.addNewLeapSeconds, true);

    if (defined.defined(options.data)) {
      // Use supplied EOP data.
      onDataReady(this, options.data);
    } else if (defined.defined(options.url)) {
      const resource = Resource.Resource.createIfNeeded(options.url);

      // Download EOP data.
      const that = this;
      this._downloadPromise = resource
        .fetchJson()
        .then(function (eopData) {
          onDataReady(that, eopData);
        })
        .catch(function () {
          that._dataError = `An error occurred while retrieving the EOP data from the URL ${resource.url}.`;
        });
    } else {
      // Use all zeros for EOP data.
      onDataReady(this, {
        columnNames: [
          "dateIso8601",
          "modifiedJulianDateUtc",
          "xPoleWanderRadians",
          "yPoleWanderRadians",
          "ut1MinusUtcSeconds",
          "lengthOfDayCorrectionSeconds",
          "xCelestialPoleOffsetRadians",
          "yCelestialPoleOffsetRadians",
          "taiMinusUtcSeconds",
        ],
        samples: [],
      });
    }
  }

  /**
   * A default {@link EarthOrientationParameters} instance that returns zero for all EOP values.
   */
  EarthOrientationParameters.NONE = Object.freeze({
    getPromiseToLoad: function () {
      return Promise.resolve();
    },
    compute: function (date, result) {
      if (!defined.defined(result)) {
        result = new EarthOrientationParametersSample(0.0, 0.0, 0.0, 0.0, 0.0);
      } else {
        result.xPoleWander = 0.0;
        result.yPoleWander = 0.0;
        result.xPoleOffset = 0.0;
        result.yPoleOffset = 0.0;
        result.ut1MinusUtc = 0.0;
      }
      return result;
    },
  });

  /**
   * Gets a promise that, when resolved, indicates that the EOP data has been loaded and is
   * ready to use.
   *
   * @returns {Promise<void>} The promise.
   */
  EarthOrientationParameters.prototype.getPromiseToLoad = function () {
    return Promise.resolve(this._downloadPromise);
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
  EarthOrientationParameters.prototype.compute = function (date, result) {
    // We cannot compute until the samples are available.
    if (!defined.defined(this._samples)) {
      if (defined.defined(this._dataError)) {
        throw new RuntimeError.RuntimeError(this._dataError);
      }

      return undefined;
    }

    if (!defined.defined(result)) {
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

    const dates = this._dates;
    const lastIndex = this._lastIndex;

    let before = 0;
    let after = 0;
    if (defined.defined(lastIndex)) {
      const previousIndexDate = dates[lastIndex];
      const nextIndexDate = dates[lastIndex + 1];
      const isAfterPrevious = JulianDate.lessThanOrEquals(
        previousIndexDate,
        date
      );
      const isAfterLastSample = !defined.defined(nextIndexDate);
      const isBeforeNext =
        isAfterLastSample || JulianDate.greaterThanOrEquals(nextIndexDate, date);

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

    let index = binarySearch(dates, date, JulianDate.compare, this._dateColumn);
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
    if (!defined.defined(eopData.columnNames)) {
      eop._dataError =
        "Error in loaded EOP data: The columnNames property is required.";
      return;
    }

    if (!defined.defined(eopData.samples)) {
      eop._dataError =
        "Error in loaded EOP data: The samples property is required.";
      return;
    }

    const dateColumn = eopData.columnNames.indexOf("modifiedJulianDateUtc");
    const xPoleWanderRadiansColumn = eopData.columnNames.indexOf(
      "xPoleWanderRadians"
    );
    const yPoleWanderRadiansColumn = eopData.columnNames.indexOf(
      "yPoleWanderRadians"
    );
    const ut1MinusUtcSecondsColumn = eopData.columnNames.indexOf(
      "ut1MinusUtcSeconds"
    );
    const xCelestialPoleOffsetRadiansColumn = eopData.columnNames.indexOf(
      "xCelestialPoleOffsetRadians"
    );
    const yCelestialPoleOffsetRadiansColumn = eopData.columnNames.indexOf(
      "yCelestialPoleOffsetRadians"
    );
    const taiMinusUtcSecondsColumn = eopData.columnNames.indexOf(
      "taiMinusUtcSeconds"
    );

    if (
      dateColumn < 0 ||
      xPoleWanderRadiansColumn < 0 ||
      yPoleWanderRadiansColumn < 0 ||
      ut1MinusUtcSecondsColumn < 0 ||
      xCelestialPoleOffsetRadiansColumn < 0 ||
      yCelestialPoleOffsetRadiansColumn < 0 ||
      taiMinusUtcSecondsColumn < 0
    ) {
      eop._dataError =
        "Error in loaded EOP data: The columnNames property must include modifiedJulianDateUtc, xPoleWanderRadians, yPoleWanderRadians, ut1MinusUtcSeconds, xCelestialPoleOffsetRadians, yCelestialPoleOffsetRadians, and taiMinusUtcSeconds columns";
      return;
    }

    const samples = (eop._samples = eopData.samples);
    const dates = (eop._dates = []);

    eop._dateColumn = dateColumn;
    eop._xPoleWanderRadiansColumn = xPoleWanderRadiansColumn;
    eop._yPoleWanderRadiansColumn = yPoleWanderRadiansColumn;
    eop._ut1MinusUtcSecondsColumn = ut1MinusUtcSecondsColumn;
    eop._xCelestialPoleOffsetRadiansColumn = xCelestialPoleOffsetRadiansColumn;
    eop._yCelestialPoleOffsetRadiansColumn = yCelestialPoleOffsetRadiansColumn;
    eop._taiMinusUtcSecondsColumn = taiMinusUtcSecondsColumn;

    eop._columnCount = eopData.columnNames.length;
    eop._lastIndex = undefined;

    let lastTaiMinusUtc;

    const addNewLeapSeconds = eop._addNewLeapSeconds;

    // Convert the ISO8601 dates to JulianDates.
    for (let i = 0, len = samples.length; i < len; i += eop._columnCount) {
      const mjd = samples[i + dateColumn];
      const taiMinusUtc = samples[i + taiMinusUtcSecondsColumn];
      const day = mjd + TimeConstants$1.MODIFIED_JULIAN_DATE_DIFFERENCE;
      const date = new JulianDate(day, taiMinusUtc, TimeStandard$1.TAI);
      dates.push(date);

      if (addNewLeapSeconds) {
        if (taiMinusUtc !== lastTaiMinusUtc && defined.defined(lastTaiMinusUtc)) {
          // We crossed a leap second boundary, so add the leap second
          // if it does not already exist.
          const leapSeconds = JulianDate.leapSeconds;
          const leapSecondIndex = binarySearch(
            leapSeconds,
            date,
            compareLeapSecondDates
          );
          if (leapSecondIndex < 0) {
            const leapSecond = new LeapSecond(date, taiMinusUtc);
            leapSeconds.splice(~leapSecondIndex, 0, leapSecond);
          }
        }
        lastTaiMinusUtc = taiMinusUtc;
      }
    }
  }

  function fillResultFromIndex(eop, samples, index, columnCount, result) {
    const start = index * columnCount;
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
    const columnCount = eop._columnCount;

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

    const beforeDate = dates[before];
    const afterDate = dates[after];
    if (beforeDate.equals(afterDate) || date.equals(beforeDate)) {
      fillResultFromIndex(eop, samples, before, columnCount, result);
      return result;
    } else if (date.equals(afterDate)) {
      fillResultFromIndex(eop, samples, after, columnCount, result);
      return result;
    }

    const factor =
      JulianDate.secondsDifference(date, beforeDate) /
      JulianDate.secondsDifference(afterDate, beforeDate);

    const startBefore = before * columnCount;
    const startAfter = after * columnCount;

    // Handle UT1 leap second edge case
    let beforeUt1MinusUtc = samples[startBefore + eop._ut1MinusUtcSecondsColumn];
    let afterUt1MinusUtc = samples[startAfter + eop._ut1MinusUtcSecondsColumn];

    const offsetDifference = afterUt1MinusUtc - beforeUt1MinusUtc;
    if (offsetDifference > 0.5 || offsetDifference < -0.5) {
      // The absolute difference between the values is more than 0.5, so we may have
      // crossed a leap second.  Check if this is the case and, if so, adjust the
      // afterValue to account for the leap second.  This way, our interpolation will
      // produce reasonable results.
      const beforeTaiMinusUtc =
        samples[startBefore + eop._taiMinusUtcSecondsColumn];
      const afterTaiMinusUtc =
        samples[startAfter + eop._taiMinusUtcSecondsColumn];
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

    result.xPoleWander = linearInterp(
      factor,
      samples[startBefore + eop._xPoleWanderRadiansColumn],
      samples[startAfter + eop._xPoleWanderRadiansColumn]
    );
    result.yPoleWander = linearInterp(
      factor,
      samples[startBefore + eop._yPoleWanderRadiansColumn],
      samples[startAfter + eop._yPoleWanderRadiansColumn]
    );
    result.xPoleOffset = linearInterp(
      factor,
      samples[startBefore + eop._xCelestialPoleOffsetRadiansColumn],
      samples[startAfter + eop._xCelestialPoleOffsetRadiansColumn]
    );
    result.yPoleOffset = linearInterp(
      factor,
      samples[startBefore + eop._yCelestialPoleOffsetRadiansColumn],
      samples[startAfter + eop._yCelestialPoleOffsetRadiansColumn]
    );
    result.ut1MinusUtc = linearInterp(
      factor,
      beforeUt1MinusUtc,
      afterUt1MinusUtc
    );
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
    /**
     * Gets or sets the heading.
     * @type {Number}
     * @default 0.0
     */
    this.heading = defined.defaultValue(heading, 0.0);
    /**
     * Gets or sets the pitch.
     * @type {Number}
     * @default 0.0
     */
    this.pitch = defined.defaultValue(pitch, 0.0);
    /**
     * Gets or sets the roll.
     * @type {Number}
     * @default 0.0
     */
    this.roll = defined.defaultValue(roll, 0.0);
  }

  /**
   * Computes the heading, pitch and roll from a quaternion (see http://en.wikipedia.org/wiki/Conversion_between_quaternions_and_Euler_angles )
   *
   * @param {Quaternion} quaternion The quaternion from which to retrieve heading, pitch, and roll, all expressed in radians.
   * @param {HeadingPitchRoll} [result] The object in which to store the result. If not provided, a new instance is created and returned.
   * @returns {HeadingPitchRoll} The modified result parameter or a new HeadingPitchRoll instance if one was not provided.
   */
  HeadingPitchRoll.fromQuaternion = function (quaternion, result) {
    //>>includeStart('debug', pragmas.debug);
    if (!defined.defined(quaternion)) {
      throw new Check.DeveloperError("quaternion is required");
    }
    //>>includeEnd('debug');
    if (!defined.defined(result)) {
      result = new HeadingPitchRoll();
    }
    const test = 2 * (quaternion.w * quaternion.y - quaternion.z * quaternion.x);
    const denominatorRoll =
      1 - 2 * (quaternion.x * quaternion.x + quaternion.y * quaternion.y);
    const numeratorRoll =
      2 * (quaternion.w * quaternion.x + quaternion.y * quaternion.z);
    const denominatorHeading =
      1 - 2 * (quaternion.y * quaternion.y + quaternion.z * quaternion.z);
    const numeratorHeading =
      2 * (quaternion.w * quaternion.z + quaternion.x * quaternion.y);
    result.heading = -Math.atan2(numeratorHeading, denominatorHeading);
    result.roll = Math.atan2(numeratorRoll, denominatorRoll);
    result.pitch = -Math$1.CesiumMath.asinClamped(test);
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
  HeadingPitchRoll.fromDegrees = function (heading, pitch, roll, result) {
    //>>includeStart('debug', pragmas.debug);
    if (!defined.defined(heading)) {
      throw new Check.DeveloperError("heading is required");
    }
    if (!defined.defined(pitch)) {
      throw new Check.DeveloperError("pitch is required");
    }
    if (!defined.defined(roll)) {
      throw new Check.DeveloperError("roll is required");
    }
    //>>includeEnd('debug');
    if (!defined.defined(result)) {
      result = new HeadingPitchRoll();
    }
    result.heading = heading * Math$1.CesiumMath.RADIANS_PER_DEGREE;
    result.pitch = pitch * Math$1.CesiumMath.RADIANS_PER_DEGREE;
    result.roll = roll * Math$1.CesiumMath.RADIANS_PER_DEGREE;
    return result;
  };

  /**
   * Duplicates a HeadingPitchRoll instance.
   *
   * @param {HeadingPitchRoll} headingPitchRoll The HeadingPitchRoll to duplicate.
   * @param {HeadingPitchRoll} [result] The object onto which to store the result.
   * @returns {HeadingPitchRoll} The modified result parameter or a new HeadingPitchRoll instance if one was not provided. (Returns undefined if headingPitchRoll is undefined)
   */
  HeadingPitchRoll.clone = function (headingPitchRoll, result) {
    if (!defined.defined(headingPitchRoll)) {
      return undefined;
    }
    if (!defined.defined(result)) {
      return new HeadingPitchRoll(
        headingPitchRoll.heading,
        headingPitchRoll.pitch,
        headingPitchRoll.roll
      );
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
  HeadingPitchRoll.equals = function (left, right) {
    return (
      left === right ||
      (defined.defined(left) &&
        defined.defined(right) &&
        left.heading === right.heading &&
        left.pitch === right.pitch &&
        left.roll === right.roll)
    );
  };

  /**
   * Compares the provided HeadingPitchRolls componentwise and returns
   * <code>true</code> if they pass an absolute or relative tolerance test,
   * <code>false</code> otherwise.
   *
   * @param {HeadingPitchRoll} [left] The first HeadingPitchRoll.
   * @param {HeadingPitchRoll} [right] The second HeadingPitchRoll.
   * @param {Number} [relativeEpsilon=0] The relative epsilon tolerance to use for equality testing.
   * @param {Number} [absoluteEpsilon=relativeEpsilon] The absolute epsilon tolerance to use for equality testing.
   * @returns {Boolean} <code>true</code> if left and right are within the provided epsilon, <code>false</code> otherwise.
   */
  HeadingPitchRoll.equalsEpsilon = function (
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
          left.heading,
          right.heading,
          relativeEpsilon,
          absoluteEpsilon
        ) &&
        Math$1.CesiumMath.equalsEpsilon(
          left.pitch,
          right.pitch,
          relativeEpsilon,
          absoluteEpsilon
        ) &&
        Math$1.CesiumMath.equalsEpsilon(
          left.roll,
          right.roll,
          relativeEpsilon,
          absoluteEpsilon
        ))
    );
  };

  /**
   * Duplicates this HeadingPitchRoll instance.
   *
   * @param {HeadingPitchRoll} [result] The object onto which to store the result.
   * @returns {HeadingPitchRoll} The modified result parameter or a new HeadingPitchRoll instance if one was not provided.
   */
  HeadingPitchRoll.prototype.clone = function (result) {
    return HeadingPitchRoll.clone(this, result);
  };

  /**
   * Compares this HeadingPitchRoll against the provided HeadingPitchRoll componentwise and returns
   * <code>true</code> if they are equal, <code>false</code> otherwise.
   *
   * @param {HeadingPitchRoll} [right] The right hand side HeadingPitchRoll.
   * @returns {Boolean} <code>true</code> if they are equal, <code>false</code> otherwise.
   */
  HeadingPitchRoll.prototype.equals = function (right) {
    return HeadingPitchRoll.equals(this, right);
  };

  /**
   * Compares this HeadingPitchRoll against the provided HeadingPitchRoll componentwise and returns
   * <code>true</code> if they pass an absolute or relative tolerance test,
   * <code>false</code> otherwise.
   *
   * @param {HeadingPitchRoll} [right] The right hand side HeadingPitchRoll.
   * @param {Number} [relativeEpsilon=0] The relative epsilon tolerance to use for equality testing.
   * @param {Number} [absoluteEpsilon=relativeEpsilon] The absolute epsilon tolerance to use for equality testing.
   * @returns {Boolean} <code>true</code> if they are within the provided epsilon, <code>false</code> otherwise.
   */
  HeadingPitchRoll.prototype.equalsEpsilon = function (
    right,
    relativeEpsilon,
    absoluteEpsilon
  ) {
    return HeadingPitchRoll.equalsEpsilon(
      this,
      right,
      relativeEpsilon,
      absoluteEpsilon
    );
  };

  /**
   * Creates a string representing this HeadingPitchRoll in the format '(heading, pitch, roll)' in radians.
   *
   * @returns {String} A string representing the provided HeadingPitchRoll in the format '(heading, pitch, roll)'.
   */
  HeadingPitchRoll.prototype.toString = function () {
    return `(${this.heading}, ${this.pitch}, ${this.roll})`;
  };

  /*global CESIUM_BASE_URL,define,require*/

  const cesiumScriptRegex = /((?:.*\/)|^)Cesium\.js(?:\?|\#|$)/;
  function getBaseUrlFromCesiumScript() {
    const scripts = document.getElementsByTagName("script");
    for (let i = 0, len = scripts.length; i < len; ++i) {
      const src = scripts[i].getAttribute("src");
      const result = cesiumScriptRegex.exec(src);
      if (result !== null) {
        return result[1];
      }
    }
    return undefined;
  }

  let a;
  function tryMakeAbsolute(url) {
    if (typeof document === "undefined") {
      //Node.js and Web Workers. In both cases, the URL will already be absolute.
      return url;
    }

    if (!defined.defined(a)) {
      a = document.createElement("a");
    }
    a.href = url;

    // IE only absolutizes href on get, not set
    // eslint-disable-next-line no-self-assign
    a.href = a.href;
    return a.href;
  }

  let baseResource;
  function getCesiumBaseUrl() {
    if (defined.defined(baseResource)) {
      return baseResource;
    }

    let baseUrlString;
    if (typeof CESIUM_BASE_URL !== "undefined") {
      baseUrlString = CESIUM_BASE_URL;
    } else if (
      typeof define === "object" &&
      defined.defined(define.amd) &&
      !define.amd.toUrlUndefined &&
      defined.defined(require.toUrl)
    ) {
      baseUrlString = Resource.getAbsoluteUri(
        "..",
        buildModuleUrl("Core/buildModuleUrl.js")
      );
    } else {
      baseUrlString = getBaseUrlFromCesiumScript();
    }

    //>>includeStart('debug', pragmas.debug);
    if (!defined.defined(baseUrlString)) {
      throw new Check.DeveloperError(
        "Unable to determine Cesium base URL automatically, try defining a global variable called CESIUM_BASE_URL."
      );
    }
    //>>includeEnd('debug');

    baseResource = new Resource.Resource({
      url: tryMakeAbsolute(baseUrlString),
    });
    baseResource.appendForwardSlash();

    return baseResource;
  }

  function buildModuleUrlFromRequireToUrl(moduleID) {
    //moduleID will be non-relative, so require it relative to this module, in Core.
    return tryMakeAbsolute(require.toUrl(`../${moduleID}`));
  }

  function buildModuleUrlFromBaseUrl(moduleID) {
    const resource = getCesiumBaseUrl().getDerivedResource({
      url: moduleID,
    });
    return resource.url;
  }

  let implementation;

  /**
   * Given a relative URL under the Cesium base URL, returns an absolute URL.
   * @function
   *
   * @param {String} relativeUrl The relative path.
   * @returns {String} The absolutely URL representation of the provided path.
   *
   * @example
   * const viewer = new Cesium.Viewer("cesiumContainer", {
   *   imageryProvider: new Cesium.TileMapServiceImageryProvider({
   *   url: Cesium.buildModuleUrl("Assets/Textures/NaturalEarthII"),
   *   }),
   *   baseLayerPicker: false,
   * });
   */
  function buildModuleUrl(relativeUrl) {
    if (!defined.defined(implementation)) {
      //select implementation
      if (
        typeof define === "object" &&
        defined.defined(define.amd) &&
        !define.amd.toUrlUndefined &&
        defined.defined(require.toUrl)
      ) {
        implementation = buildModuleUrlFromRequireToUrl;
      } else {
        implementation = buildModuleUrlFromBaseUrl;
      }
    }

    const url = implementation(relativeUrl);
    return url;
  }

  // exposed for testing
  buildModuleUrl._cesiumScriptRegex = cesiumScriptRegex;
  buildModuleUrl._buildModuleUrlFromBaseUrl = buildModuleUrlFromBaseUrl;
  buildModuleUrl._clearBaseResource = function () {
    baseResource = undefined;
  };

  /**
   * Sets the base URL for resolving modules.
   * @param {String} value The new base URL.
   */
  buildModuleUrl.setBaseUrl = function (value) {
    baseResource = Resource.Resource.DEFAULT.getDerivedResource({
      url: value,
    });
  };

  /**
   * Gets the base URL for resolving modules.
   *
   * @function
   * @returns {String} The configured base URL
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
    options = defined.defaultValue(options, defined.defaultValue.EMPTY_OBJECT);

    this._xysFileUrlTemplate = Resource.Resource.createIfNeeded(
      options.xysFileUrlTemplate
    );
    this._interpolationOrder = defined.defaultValue(options.interpolationOrder, 9);
    this._sampleZeroJulianEphemerisDate = defined.defaultValue(
      options.sampleZeroJulianEphemerisDate,
      2442396.5
    );
    this._sampleZeroDateTT = new JulianDate(
      this._sampleZeroJulianEphemerisDate,
      0.0,
      TimeStandard$1.TAI
    );
    this._stepSizeDays = defined.defaultValue(options.stepSizeDays, 1.0);
    this._samplesPerXysFile = defined.defaultValue(options.samplesPerXysFile, 1000);
    this._totalSamples = defined.defaultValue(options.totalSamples, 27426);
    this._samples = new Array(this._totalSamples * 3);
    this._chunkDownloadsInProgress = [];

    const order = this._interpolationOrder;

    // Compute denominators and X values for interpolation.
    const denom = (this._denominators = new Array(order + 1));
    const xTable = (this._xTable = new Array(order + 1));

    const stepN = Math.pow(this._stepSizeDays, order);

    for (let i = 0; i <= order; ++i) {
      denom[i] = stepN;
      xTable[i] = i * this._stepSizeDays;

      for (let j = 0; j <= order; ++j) {
        if (j !== i) {
          denom[i] *= i - j;
        }
      }

      denom[i] = 1.0 / denom[i];
    }

    // Allocate scratch arrays for interpolation.
    this._work = new Array(order + 1);
    this._coef = new Array(order + 1);
  }

  const julianDateScratch = new JulianDate(0, 0.0, TimeStandard$1.TAI);

  function getDaysSinceEpoch(xys, dayTT, secondTT) {
    const dateTT = julianDateScratch;
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
   * @returns {Promise<void>} A promise that, when resolved, indicates that the requested interval has been
   *                    preloaded.
   */
  Iau2006XysData.prototype.preload = function (
    startDayTT,
    startSecondTT,
    stopDayTT,
    stopSecondTT
  ) {
    const startDaysSinceEpoch = getDaysSinceEpoch(
      this,
      startDayTT,
      startSecondTT
    );
    const stopDaysSinceEpoch = getDaysSinceEpoch(this, stopDayTT, stopSecondTT);

    let startIndex =
      (startDaysSinceEpoch / this._stepSizeDays - this._interpolationOrder / 2) |
      0;
    if (startIndex < 0) {
      startIndex = 0;
    }

    let stopIndex =
      (stopDaysSinceEpoch / this._stepSizeDays - this._interpolationOrder / 2) |
      (0 + this._interpolationOrder);
    if (stopIndex >= this._totalSamples) {
      stopIndex = this._totalSamples - 1;
    }

    const startChunk = (startIndex / this._samplesPerXysFile) | 0;
    const stopChunk = (stopIndex / this._samplesPerXysFile) | 0;

    const promises = [];
    for (let i = startChunk; i <= stopChunk; ++i) {
      promises.push(requestXysChunk(this, i));
    }

    return Promise.all(promises);
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
  Iau2006XysData.prototype.computeXysRadians = function (
    dayTT,
    secondTT,
    result
  ) {
    const daysSinceEpoch = getDaysSinceEpoch(this, dayTT, secondTT);
    if (daysSinceEpoch < 0.0) {
      // Can't evaluate prior to the epoch of the data.
      return undefined;
    }

    const centerIndex = (daysSinceEpoch / this._stepSizeDays) | 0;
    if (centerIndex >= this._totalSamples) {
      // Can't evaluate after the last sample in the data.
      return undefined;
    }

    const degree = this._interpolationOrder;

    let firstIndex = centerIndex - ((degree / 2) | 0);
    if (firstIndex < 0) {
      firstIndex = 0;
    }
    let lastIndex = firstIndex + degree;
    if (lastIndex >= this._totalSamples) {
      lastIndex = this._totalSamples - 1;
      firstIndex = lastIndex - degree;
      if (firstIndex < 0) {
        firstIndex = 0;
      }
    }

    // Are all the samples we need present?
    // We can assume so if the first and last are present
    let isDataMissing = false;
    const samples = this._samples;
    if (!defined.defined(samples[firstIndex * 3])) {
      requestXysChunk(this, (firstIndex / this._samplesPerXysFile) | 0);
      isDataMissing = true;
    }

    if (!defined.defined(samples[lastIndex * 3])) {
      requestXysChunk(this, (lastIndex / this._samplesPerXysFile) | 0);
      isDataMissing = true;
    }

    if (isDataMissing) {
      return undefined;
    }

    if (!defined.defined(result)) {
      result = new Iau2006XysSample(0.0, 0.0, 0.0);
    } else {
      result.x = 0.0;
      result.y = 0.0;
      result.s = 0.0;
    }

    const x = daysSinceEpoch - firstIndex * this._stepSizeDays;

    const work = this._work;
    const denom = this._denominators;
    const coef = this._coef;
    const xTable = this._xTable;

    let i, j;
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

      let sampleIndex = (firstIndex + i) * 3;
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

    let chunkUrl;
    const xysFileUrlTemplate = xysData._xysFileUrlTemplate;
    if (defined.defined(xysFileUrlTemplate)) {
      chunkUrl = xysFileUrlTemplate.getDerivedResource({
        templateValues: {
          0: chunkIndex,
        },
      });
    } else {
      chunkUrl = new Resource.Resource({
        url: buildModuleUrl(`Assets/IAU2006_XYS/IAU2006_XYS_${chunkIndex}.json`),
      });
    }

    const promise = chunkUrl.fetchJson().then(function (chunk) {
      xysData._chunkDownloadsInProgress[chunkIndex] = false;

      const samples = xysData._samples;
      const newSamples = chunk.samples;
      const startIndex = chunkIndex * xysData._samplesPerXysFile * 3;

      for (let i = 0, len = newSamples.length; i < len; ++i) {
        samples[startIndex + i] = newSamples[i];
      }
    });
    xysData._chunkDownloadsInProgress[chunkIndex] = promise;

    return promise;
  }

  /**
   * Contains functions for transforming positions to various reference frames.
   *
   * @namespace Transforms
   */
  const Transforms = {};

  const vectorProductLocalFrame = {
    up: {
      south: "east",
      north: "west",
      west: "south",
      east: "north",
    },
    down: {
      south: "west",
      north: "east",
      west: "north",
      east: "south",
    },
    south: {
      up: "west",
      down: "east",
      west: "down",
      east: "up",
    },
    north: {
      up: "east",
      down: "west",
      west: "up",
      east: "down",
    },
    west: {
      up: "north",
      down: "south",
      north: "down",
      south: "up",
    },
    east: {
      up: "south",
      down: "north",
      north: "up",
      south: "down",
    },
  };

  const degeneratePositionLocalFrame = {
    north: [-1, 0, 0],
    east: [0, 1, 0],
    up: [0, 0, 1],
    south: [1, 0, 0],
    west: [0, -1, 0],
    down: [0, 0, -1],
  };

  const localFrameToFixedFrameCache = {};

  const scratchCalculateCartesian = {
    east: new Cartesian3.Cartesian3(),
    north: new Cartesian3.Cartesian3(),
    up: new Cartesian3.Cartesian3(),
    west: new Cartesian3.Cartesian3(),
    south: new Cartesian3.Cartesian3(),
    down: new Cartesian3.Cartesian3(),
  };
  let scratchFirstCartesian = new Cartesian3.Cartesian3();
  let scratchSecondCartesian = new Cartesian3.Cartesian3();
  let scratchThirdCartesian = new Cartesian3.Cartesian3();
  /**
   * Generates a function that computes a 4x4 transformation matrix from a reference frame
   * centered at the provided origin to the provided ellipsoid's fixed reference frame.
   * @param  {String} firstAxis  name of the first axis of the local reference frame. Must be
   *  'east', 'north', 'up', 'west', 'south' or 'down'.
   * @param  {String} secondAxis  name of the second axis of the local reference frame. Must be
   *  'east', 'north', 'up', 'west', 'south' or 'down'.
   * @return {Transforms.LocalFrameToFixedFrame} The function that will computes a
   * 4x4 transformation matrix from a reference frame, with first axis and second axis compliant with the parameters,
   */
  Transforms.localFrameToFixedFrameGenerator = function (firstAxis, secondAxis) {
    if (
      !vectorProductLocalFrame.hasOwnProperty(firstAxis) ||
      !vectorProductLocalFrame[firstAxis].hasOwnProperty(secondAxis)
    ) {
      throw new Check.DeveloperError(
        "firstAxis and secondAxis must be east, north, up, west, south or down."
      );
    }
    const thirdAxis = vectorProductLocalFrame[firstAxis][secondAxis];

    /**
     * Computes a 4x4 transformation matrix from a reference frame
     * centered at the provided origin to the provided ellipsoid's fixed reference frame.
     * @callback Transforms.LocalFrameToFixedFrame
     * @param {Cartesian3} origin The center point of the local reference frame.
     * @param {Ellipsoid} [ellipsoid=Ellipsoid.WGS84] The ellipsoid whose fixed frame is used in the transformation.
     * @param {Matrix4} [result] The object onto which to store the result.
     * @returns {Matrix4} The modified result parameter or a new Matrix4 instance if none was provided.
     */
    let resultat;
    const hashAxis = firstAxis + secondAxis;
    if (defined.defined(localFrameToFixedFrameCache[hashAxis])) {
      resultat = localFrameToFixedFrameCache[hashAxis];
    } else {
      resultat = function (origin, ellipsoid, result) {
        //>>includeStart('debug', pragmas.debug);
        if (!defined.defined(origin)) {
          throw new Check.DeveloperError("origin is required.");
        }
        //>>includeEnd('debug');
        if (!defined.defined(result)) {
          result = new Matrix2.Matrix4();
        }
        if (
          Cartesian3.Cartesian3.equalsEpsilon(origin, Cartesian3.Cartesian3.ZERO, Math$1.CesiumMath.EPSILON14)
        ) {
          // If x, y, and z are zero, use the degenerate local frame, which is a special case
          Cartesian3.Cartesian3.unpack(
            degeneratePositionLocalFrame[firstAxis],
            0,
            scratchFirstCartesian
          );
          Cartesian3.Cartesian3.unpack(
            degeneratePositionLocalFrame[secondAxis],
            0,
            scratchSecondCartesian
          );
          Cartesian3.Cartesian3.unpack(
            degeneratePositionLocalFrame[thirdAxis],
            0,
            scratchThirdCartesian
          );
        } else if (
          Math$1.CesiumMath.equalsEpsilon(origin.x, 0.0, Math$1.CesiumMath.EPSILON14) &&
          Math$1.CesiumMath.equalsEpsilon(origin.y, 0.0, Math$1.CesiumMath.EPSILON14)
        ) {
          // If x and y are zero, assume origin is at a pole, which is a special case.
          const sign = Math$1.CesiumMath.sign(origin.z);

          Cartesian3.Cartesian3.unpack(
            degeneratePositionLocalFrame[firstAxis],
            0,
            scratchFirstCartesian
          );
          if (firstAxis !== "east" && firstAxis !== "west") {
            Cartesian3.Cartesian3.multiplyByScalar(
              scratchFirstCartesian,
              sign,
              scratchFirstCartesian
            );
          }

          Cartesian3.Cartesian3.unpack(
            degeneratePositionLocalFrame[secondAxis],
            0,
            scratchSecondCartesian
          );
          if (secondAxis !== "east" && secondAxis !== "west") {
            Cartesian3.Cartesian3.multiplyByScalar(
              scratchSecondCartesian,
              sign,
              scratchSecondCartesian
            );
          }

          Cartesian3.Cartesian3.unpack(
            degeneratePositionLocalFrame[thirdAxis],
            0,
            scratchThirdCartesian
          );
          if (thirdAxis !== "east" && thirdAxis !== "west") {
            Cartesian3.Cartesian3.multiplyByScalar(
              scratchThirdCartesian,
              sign,
              scratchThirdCartesian
            );
          }
        } else {
          ellipsoid = defined.defaultValue(ellipsoid, Cartesian2.Ellipsoid.WGS84);
          ellipsoid.geodeticSurfaceNormal(origin, scratchCalculateCartesian.up);

          const up = scratchCalculateCartesian.up;
          const east = scratchCalculateCartesian.east;
          east.x = -origin.y;
          east.y = origin.x;
          east.z = 0.0;
          Cartesian3.Cartesian3.normalize(east, scratchCalculateCartesian.east);
          Cartesian3.Cartesian3.cross(up, east, scratchCalculateCartesian.north);

          Cartesian3.Cartesian3.multiplyByScalar(
            scratchCalculateCartesian.up,
            -1,
            scratchCalculateCartesian.down
          );
          Cartesian3.Cartesian3.multiplyByScalar(
            scratchCalculateCartesian.east,
            -1,
            scratchCalculateCartesian.west
          );
          Cartesian3.Cartesian3.multiplyByScalar(
            scratchCalculateCartesian.north,
            -1,
            scratchCalculateCartesian.south
          );

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
   * const center = Cesium.Cartesian3.fromDegrees(0.0, 0.0);
   * const transform = Cesium.Transforms.eastNorthUpToFixedFrame(center);
   */
  Transforms.eastNorthUpToFixedFrame = Transforms.localFrameToFixedFrameGenerator(
    "east",
    "north"
  );

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
   * const center = Cesium.Cartesian3.fromDegrees(0.0, 0.0);
   * const transform = Cesium.Transforms.northEastDownToFixedFrame(center);
   */
  Transforms.northEastDownToFixedFrame = Transforms.localFrameToFixedFrameGenerator(
    "north",
    "east"
  );

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
   * const center = Cesium.Cartesian3.fromDegrees(0.0, 0.0);
   * const transform = Cesium.Transforms.northUpEastToFixedFrame(center);
   */
  Transforms.northUpEastToFixedFrame = Transforms.localFrameToFixedFrameGenerator(
    "north",
    "up"
  );

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
   * const center = Cesium.Cartesian3.fromDegrees(0.0, 0.0);
   * const transform = Cesium.Transforms.northWestUpToFixedFrame(center);
   */
  Transforms.northWestUpToFixedFrame = Transforms.localFrameToFixedFrameGenerator(
    "north",
    "west"
  );

  const scratchHPRQuaternion = new Quaternion();
  const scratchScale = new Cartesian3.Cartesian3(1.0, 1.0, 1.0);
  const scratchHPRMatrix4 = new Matrix2.Matrix4();

  /**
   * Computes a 4x4 transformation matrix from a reference frame with axes computed from the heading-pitch-roll angles
   * centered at the provided origin to the provided ellipsoid's fixed reference frame. Heading is the rotation from the local north
   * direction where a positive angle is increasing eastward. Pitch is the rotation from the local east-north plane. Positive pitch angles
   * are above the plane. Negative pitch angles are below the plane. Roll is the first rotation applied about the local east axis.
   *
   * @param {Cartesian3} origin The center point of the local reference frame.
   * @param {HeadingPitchRoll} headingPitchRoll The heading, pitch, and roll.
   * @param {Ellipsoid} [ellipsoid=Ellipsoid.WGS84] The ellipsoid whose fixed frame is used in the transformation.
   * @param {Transforms.LocalFrameToFixedFrame} [fixedFrameTransform=Transforms.eastNorthUpToFixedFrame] A 4x4 transformation
   *  matrix from a reference frame to the provided ellipsoid's fixed reference frame
   * @param {Matrix4} [result] The object onto which to store the result.
   * @returns {Matrix4} The modified result parameter or a new Matrix4 instance if none was provided.
   *
   * @example
   * // Get the transform from local heading-pitch-roll at cartographic (0.0, 0.0) to Earth's fixed frame.
   * const center = Cesium.Cartesian3.fromDegrees(0.0, 0.0);
   * const heading = -Cesium.Math.PI_OVER_TWO;
   * const pitch = Cesium.Math.PI_OVER_FOUR;
   * const roll = 0.0;
   * const hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
   * const transform = Cesium.Transforms.headingPitchRollToFixedFrame(center, hpr);
   */
  Transforms.headingPitchRollToFixedFrame = function (
    origin,
    headingPitchRoll,
    ellipsoid,
    fixedFrameTransform,
    result
  ) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("HeadingPitchRoll", headingPitchRoll);
    //>>includeEnd('debug');

    fixedFrameTransform = defined.defaultValue(
      fixedFrameTransform,
      Transforms.eastNorthUpToFixedFrame
    );
    const hprQuaternion = Quaternion.fromHeadingPitchRoll(
      headingPitchRoll,
      scratchHPRQuaternion
    );
    const hprMatrix = Matrix2.Matrix4.fromTranslationQuaternionRotationScale(
      Cartesian3.Cartesian3.ZERO,
      hprQuaternion,
      scratchScale,
      scratchHPRMatrix4
    );
    result = fixedFrameTransform(origin, ellipsoid, result);
    return Matrix2.Matrix4.multiply(result, hprMatrix, result);
  };

  const scratchENUMatrix4 = new Matrix2.Matrix4();
  const scratchHPRMatrix3 = new Matrix2.Matrix3();

  /**
   * Computes a quaternion from a reference frame with axes computed from the heading-pitch-roll angles
   * centered at the provided origin. Heading is the rotation from the local north
   * direction where a positive angle is increasing eastward. Pitch is the rotation from the local east-north plane. Positive pitch angles
   * are above the plane. Negative pitch angles are below the plane. Roll is the first rotation applied about the local east axis.
   *
   * @param {Cartesian3} origin The center point of the local reference frame.
   * @param {HeadingPitchRoll} headingPitchRoll The heading, pitch, and roll.
   * @param {Ellipsoid} [ellipsoid=Ellipsoid.WGS84] The ellipsoid whose fixed frame is used in the transformation.
   * @param {Transforms.LocalFrameToFixedFrame} [fixedFrameTransform=Transforms.eastNorthUpToFixedFrame] A 4x4 transformation
   *  matrix from a reference frame to the provided ellipsoid's fixed reference frame
   * @param {Quaternion} [result] The object onto which to store the result.
   * @returns {Quaternion} The modified result parameter or a new Quaternion instance if none was provided.
   *
   * @example
   * // Get the quaternion from local heading-pitch-roll at cartographic (0.0, 0.0) to Earth's fixed frame.
   * const center = Cesium.Cartesian3.fromDegrees(0.0, 0.0);
   * const heading = -Cesium.Math.PI_OVER_TWO;
   * const pitch = Cesium.Math.PI_OVER_FOUR;
   * const roll = 0.0;
   * const hpr = new HeadingPitchRoll(heading, pitch, roll);
   * const quaternion = Cesium.Transforms.headingPitchRollQuaternion(center, hpr);
   */
  Transforms.headingPitchRollQuaternion = function (
    origin,
    headingPitchRoll,
    ellipsoid,
    fixedFrameTransform,
    result
  ) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.object("HeadingPitchRoll", headingPitchRoll);
    //>>includeEnd('debug');

    const transform = Transforms.headingPitchRollToFixedFrame(
      origin,
      headingPitchRoll,
      ellipsoid,
      fixedFrameTransform,
      scratchENUMatrix4
    );
    const rotation = Matrix2.Matrix4.getMatrix3(transform, scratchHPRMatrix3);
    return Quaternion.fromRotationMatrix(rotation, result);
  };

  const noScale = new Cartesian3.Cartesian3(1.0, 1.0, 1.0);
  const hprCenterScratch = new Cartesian3.Cartesian3();
  const ffScratch = new Matrix2.Matrix4();
  const hprTransformScratch = new Matrix2.Matrix4();
  const hprRotationScratch = new Matrix2.Matrix3();
  const hprQuaternionScratch = new Quaternion();
  /**
   * Computes heading-pitch-roll angles from a transform in a particular reference frame. Heading is the rotation from the local north
   * direction where a positive angle is increasing eastward. Pitch is the rotation from the local east-north plane. Positive pitch angles
   * are above the plane. Negative pitch angles are below the plane. Roll is the first rotation applied about the local east axis.
   *
   * @param {Matrix4} transform The transform
   * @param {Ellipsoid} [ellipsoid=Ellipsoid.WGS84] The ellipsoid whose fixed frame is used in the transformation.
   * @param {Transforms.LocalFrameToFixedFrame} [fixedFrameTransform=Transforms.eastNorthUpToFixedFrame] A 4x4 transformation
   *  matrix from a reference frame to the provided ellipsoid's fixed reference frame
   * @param {HeadingPitchRoll} [result] The object onto which to store the result.
   * @returns {HeadingPitchRoll} The modified result parameter or a new HeadingPitchRoll instance if none was provided.
   */
  Transforms.fixedFrameToHeadingPitchRoll = function (
    transform,
    ellipsoid,
    fixedFrameTransform,
    result
  ) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.defined("transform", transform);
    //>>includeEnd('debug');

    ellipsoid = defined.defaultValue(ellipsoid, Cartesian2.Ellipsoid.WGS84);
    fixedFrameTransform = defined.defaultValue(
      fixedFrameTransform,
      Transforms.eastNorthUpToFixedFrame
    );
    if (!defined.defined(result)) {
      result = new HeadingPitchRoll();
    }

    const center = Matrix2.Matrix4.getTranslation(transform, hprCenterScratch);
    if (Cartesian3.Cartesian3.equals(center, Cartesian3.Cartesian3.ZERO)) {
      result.heading = 0;
      result.pitch = 0;
      result.roll = 0;
      return result;
    }
    let toFixedFrame = Matrix2.Matrix4.inverseTransformation(
      fixedFrameTransform(center, ellipsoid, ffScratch),
      ffScratch
    );
    let transformCopy = Matrix2.Matrix4.setScale(transform, noScale, hprTransformScratch);
    transformCopy = Matrix2.Matrix4.setTranslation(
      transformCopy,
      Cartesian3.Cartesian3.ZERO,
      transformCopy
    );

    toFixedFrame = Matrix2.Matrix4.multiply(toFixedFrame, transformCopy, toFixedFrame);
    let quaternionRotation = Quaternion.fromRotationMatrix(
      Matrix2.Matrix4.getMatrix3(toFixedFrame, hprRotationScratch),
      hprQuaternionScratch
    );
    quaternionRotation = Quaternion.normalize(
      quaternionRotation,
      quaternionRotation
    );

    return HeadingPitchRoll.fromQuaternion(quaternionRotation, result);
  };

  const gmstConstant0 = 6 * 3600 + 41 * 60 + 50.54841;
  const gmstConstant1 = 8640184.812866;
  const gmstConstant2 = 0.093104;
  const gmstConstant3 = -6.2e-6;
  const rateCoef = 1.1772758384668e-19;
  const wgs84WRPrecessing = 7.2921158553e-5;
  const twoPiOverSecondsInDay = Math$1.CesiumMath.TWO_PI / 86400.0;
  let dateInUtc = new JulianDate();

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
   *    const now = Cesium.JulianDate.now();
   *    const offset = Cesium.Matrix4.multiplyByPoint(camera.transform, camera.position, new Cesium.Cartesian3());
   *    const transform = Cesium.Matrix4.fromRotationTranslation(Cesium.Transforms.computeTemeToPseudoFixedMatrix(now));
   *    const inverseTransform = Cesium.Matrix4.inverseTransformation(transform, new Cesium.Matrix4());
   *    Cesium.Matrix4.multiplyByPoint(inverseTransform, offset, offset);
   *    camera.lookAtTransform(transform, offset);
   * });
   */
  Transforms.computeTemeToPseudoFixedMatrix = function (date, result) {
    //>>includeStart('debug', pragmas.debug);
    if (!defined.defined(date)) {
      throw new Check.DeveloperError("date is required.");
    }
    //>>includeEnd('debug');

    // GMST is actually computed using UT1.  We're using UTC as an approximation of UT1.
    // We do not want to use the function like convertTaiToUtc in JulianDate because
    // we explicitly do not want to fail when inside the leap second.

    dateInUtc = JulianDate.addSeconds(
      date,
      -JulianDate.computeTaiMinusUtc(date),
      dateInUtc
    );
    const utcDayNumber = dateInUtc.dayNumber;
    const utcSecondsIntoDay = dateInUtc.secondsOfDay;

    let t;
    const diffDays = utcDayNumber - 2451545;
    if (utcSecondsIntoDay >= 43200.0) {
      t = (diffDays + 0.5) / TimeConstants$1.DAYS_PER_JULIAN_CENTURY;
    } else {
      t = (diffDays - 0.5) / TimeConstants$1.DAYS_PER_JULIAN_CENTURY;
    }

    const gmst0 =
      gmstConstant0 +
      t * (gmstConstant1 + t * (gmstConstant2 + t * gmstConstant3));
    const angle = (gmst0 * twoPiOverSecondsInDay) % Math$1.CesiumMath.TWO_PI;
    const ratio = wgs84WRPrecessing + rateCoef * (utcDayNumber - 2451545.5);
    const secondsSinceMidnight =
      (utcSecondsIntoDay + TimeConstants$1.SECONDS_PER_DAY * 0.5) %
      TimeConstants$1.SECONDS_PER_DAY;
    const gha = angle + ratio * secondsSinceMidnight;
    const cosGha = Math.cos(gha);
    const sinGha = Math.sin(gha);

    if (!defined.defined(result)) {
      return new Matrix2.Matrix3(
        cosGha,
        sinGha,
        0.0,
        -sinGha,
        cosGha,
        0.0,
        0.0,
        0.0,
        1.0
      );
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

  const ttMinusTai = 32.184;
  const j2000ttDays = 2451545.0;

  /**
   * Preloads the data necessary to transform between the ICRF and Fixed axes, in either
   * direction, over a given interval.  This function returns a promise that, when resolved,
   * indicates that the preload has completed.
   *
   * @param {TimeInterval} timeInterval The interval to preload.
   * @returns {Promise<void>} A promise that, when resolved, indicates that the preload has completed
   *          and evaluation of the transformation between the fixed and ICRF axes will
   *          no longer return undefined for a time inside the interval.
   *
   *
   * @example
   * const interval = new Cesium.TimeInterval(...);
   * Promise.resolve(Cesium.Transforms.preloadIcrfFixed(interval)).then(function() {
   *     // the data is now loaded
   * });
   *
   * @see Transforms.computeIcrfToFixedMatrix
   * @see Transforms.computeFixedToIcrfMatrix
   */
  Transforms.preloadIcrfFixed = function (timeInterval) {
    const startDayTT = timeInterval.start.dayNumber;
    const startSecondTT = timeInterval.start.secondsOfDay + ttMinusTai;
    const stopDayTT = timeInterval.stop.dayNumber;
    const stopSecondTT = timeInterval.stop.secondsOfDay + ttMinusTai;

    const xysPromise = Transforms.iau2006XysData.preload(
      startDayTT,
      startSecondTT,
      stopDayTT,
      stopSecondTT
    );
    const eopPromise = Transforms.earthOrientationParameters.getPromiseToLoad();

    return Promise.all([xysPromise, eopPromise]);
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
   *   const icrfToFixed = Cesium.Transforms.computeIcrfToFixedMatrix(time);
   *   if (Cesium.defined(icrfToFixed)) {
   *     const offset = Cesium.Cartesian3.clone(camera.position);
   *     const transform = Cesium.Matrix4.fromRotationTranslation(icrfToFixed);
   *     camera.lookAtTransform(transform, offset);
   *   }
   * });
   *
   * @see Transforms.preloadIcrfFixed
   */
  Transforms.computeIcrfToFixedMatrix = function (date, result) {
    //>>includeStart('debug', pragmas.debug);
    if (!defined.defined(date)) {
      throw new Check.DeveloperError("date is required.");
    }
    //>>includeEnd('debug');
    if (!defined.defined(result)) {
      result = new Matrix2.Matrix3();
    }

    const fixedToIcrfMtx = Transforms.computeFixedToIcrfMatrix(date, result);
    if (!defined.defined(fixedToIcrfMtx)) {
      return undefined;
    }

    return Matrix2.Matrix3.transpose(fixedToIcrfMtx, result);
  };

  const xysScratch = new Iau2006XysSample(0.0, 0.0, 0.0);
  const eopScratch = new EarthOrientationParametersSample(
    0.0,
    0.0,
    0.0,
    0.0,
    0.0);
  const rotation1Scratch = new Matrix2.Matrix3();
  const rotation2Scratch = new Matrix2.Matrix3();

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
   * const now = Cesium.JulianDate.now();
   * const pointInFixed = Cesium.Cartesian3.fromDegrees(0.0, 0.0);
   * const fixedToIcrf = Cesium.Transforms.computeIcrfToFixedMatrix(now);
   * let pointInInertial = new Cesium.Cartesian3();
   * if (Cesium.defined(fixedToIcrf)) {
   *     pointInInertial = Cesium.Matrix3.multiplyByVector(fixedToIcrf, pointInFixed, pointInInertial);
   * }
   *
   * @see Transforms.preloadIcrfFixed
   */
  Transforms.computeFixedToIcrfMatrix = function (date, result) {
    //>>includeStart('debug', pragmas.debug);
    if (!defined.defined(date)) {
      throw new Check.DeveloperError("date is required.");
    }
    //>>includeEnd('debug');

    if (!defined.defined(result)) {
      result = new Matrix2.Matrix3();
    }

    // Compute pole wander
    const eop = Transforms.earthOrientationParameters.compute(date, eopScratch);
    if (!defined.defined(eop)) {
      return undefined;
    }

    // There is no external conversion to Terrestrial Time (TT).
    // So use International Atomic Time (TAI) and convert using offsets.
    // Here we are assuming that dayTT and secondTT are positive
    const dayTT = date.dayNumber;
    // It's possible here that secondTT could roll over 86400
    // This does not seem to affect the precision (unit tests check for this)
    const secondTT = date.secondsOfDay + ttMinusTai;

    const xys = Transforms.iau2006XysData.computeXysRadians(
      dayTT,
      secondTT,
      xysScratch
    );
    if (!defined.defined(xys)) {
      return undefined;
    }

    const x = xys.x + eop.xPoleOffset;
    const y = xys.y + eop.yPoleOffset;

    // Compute XYS rotation
    const a = 1.0 / (1.0 + Math.sqrt(1.0 - x * x - y * y));

    const rotation1 = rotation1Scratch;
    rotation1[0] = 1.0 - a * x * x;
    rotation1[3] = -a * x * y;
    rotation1[6] = x;
    rotation1[1] = -a * x * y;
    rotation1[4] = 1 - a * y * y;
    rotation1[7] = y;
    rotation1[2] = -x;
    rotation1[5] = -y;
    rotation1[8] = 1 - a * (x * x + y * y);

    const rotation2 = Matrix2.Matrix3.fromRotationZ(-xys.s, rotation2Scratch);
    const matrixQ = Matrix2.Matrix3.multiply(rotation1, rotation2, rotation1Scratch);

    // Similar to TT conversions above
    // It's possible here that secondTT could roll over 86400
    // This does not seem to affect the precision (unit tests check for this)
    const dateUt1day = date.dayNumber;
    const dateUt1sec =
      date.secondsOfDay - JulianDate.computeTaiMinusUtc(date) + eop.ut1MinusUtc;

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
    const daysSinceJ2000 = dateUt1day - 2451545;
    const fractionOfDay = dateUt1sec / TimeConstants$1.SECONDS_PER_DAY;
    let era =
      0.779057273264 +
      fractionOfDay +
      0.00273781191135448 * (daysSinceJ2000 + fractionOfDay);
    era = (era % 1.0) * Math$1.CesiumMath.TWO_PI;

    const earthRotation = Matrix2.Matrix3.fromRotationZ(era, rotation2Scratch);

    // pseudoFixed to ICRF
    const pfToIcrf = Matrix2.Matrix3.multiply(matrixQ, earthRotation, rotation1Scratch);

    // Compute pole wander matrix
    const cosxp = Math.cos(eop.xPoleWander);
    const cosyp = Math.cos(eop.yPoleWander);
    const sinxp = Math.sin(eop.xPoleWander);
    const sinyp = Math.sin(eop.yPoleWander);

    let ttt = dayTT - j2000ttDays + secondTT / TimeConstants$1.SECONDS_PER_DAY;
    ttt /= 36525.0;

    // approximate sp value in rad
    const sp = (-47.0e-6 * ttt * Math$1.CesiumMath.RADIANS_PER_DEGREE) / 3600.0;
    const cossp = Math.cos(sp);
    const sinsp = Math.sin(sp);

    const fToPfMtx = rotation2Scratch;
    fToPfMtx[0] = cosxp * cossp;
    fToPfMtx[1] = cosxp * sinsp;
    fToPfMtx[2] = sinxp;
    fToPfMtx[3] = -cosyp * sinsp + sinyp * sinxp * cossp;
    fToPfMtx[4] = cosyp * cossp + sinyp * sinxp * sinsp;
    fToPfMtx[5] = -sinyp * cosxp;
    fToPfMtx[6] = -sinyp * sinsp - cosyp * sinxp * cossp;
    fToPfMtx[7] = sinyp * cossp - cosyp * sinxp * sinsp;
    fToPfMtx[8] = cosyp * cosxp;

    return Matrix2.Matrix3.multiply(pfToIcrf, fToPfMtx, result);
  };

  const pointToWindowCoordinatesTemp = new Matrix2.Cartesian4();

  /**
   * Transform a point from model coordinates to window coordinates.
   *
   * @param {Matrix4} modelViewProjectionMatrix The 4x4 model-view-projection matrix.
   * @param {Matrix4} viewportTransformation The 4x4 viewport transformation.
   * @param {Cartesian3} point The point to transform.
   * @param {Cartesian2} [result] The object onto which to store the result.
   * @returns {Cartesian2} The modified result parameter or a new Cartesian2 instance if none was provided.
   */
  Transforms.pointToWindowCoordinates = function (
    modelViewProjectionMatrix,
    viewportTransformation,
    point,
    result
  ) {
    result = Transforms.pointToGLWindowCoordinates(
      modelViewProjectionMatrix,
      viewportTransformation,
      point,
      result
    );
    result.y = 2.0 * viewportTransformation[5] - result.y;
    return result;
  };

  /**
   * @private
   */
  Transforms.pointToGLWindowCoordinates = function (
    modelViewProjectionMatrix,
    viewportTransformation,
    point,
    result
  ) {
    //>>includeStart('debug', pragmas.debug);
    if (!defined.defined(modelViewProjectionMatrix)) {
      throw new Check.DeveloperError("modelViewProjectionMatrix is required.");
    }

    if (!defined.defined(viewportTransformation)) {
      throw new Check.DeveloperError("viewportTransformation is required.");
    }

    if (!defined.defined(point)) {
      throw new Check.DeveloperError("point is required.");
    }
    //>>includeEnd('debug');

    if (!defined.defined(result)) {
      result = new Cartesian2.Cartesian2();
    }

    const tmp = pointToWindowCoordinatesTemp;

    Matrix2.Matrix4.multiplyByVector(
      modelViewProjectionMatrix,
      Matrix2.Cartesian4.fromElements(point.x, point.y, point.z, 1, tmp),
      tmp
    );
    Matrix2.Cartesian4.multiplyByScalar(tmp, 1.0 / tmp.w, tmp);
    Matrix2.Matrix4.multiplyByVector(viewportTransformation, tmp, tmp);
    return Cartesian2.Cartesian2.fromCartesian4(tmp, result);
  };

  const normalScratch = new Cartesian3.Cartesian3();
  const rightScratch = new Cartesian3.Cartesian3();
  const upScratch = new Cartesian3.Cartesian3();

  /**
   * Transform a position and velocity to a rotation matrix.
   *
   * @param {Cartesian3} position The position to transform.
   * @param {Cartesian3} velocity The velocity vector to transform.
   * @param {Ellipsoid} [ellipsoid=Ellipsoid.WGS84] The ellipsoid whose fixed frame is used in the transformation.
   * @param {Matrix3} [result] The object onto which to store the result.
   * @returns {Matrix3} The modified result parameter or a new Matrix3 instance if none was provided.
   */
  Transforms.rotationMatrixFromPositionVelocity = function (
    position,
    velocity,
    ellipsoid,
    result
  ) {
    //>>includeStart('debug', pragmas.debug);
    if (!defined.defined(position)) {
      throw new Check.DeveloperError("position is required.");
    }

    if (!defined.defined(velocity)) {
      throw new Check.DeveloperError("velocity is required.");
    }
    //>>includeEnd('debug');

    const normal = defined.defaultValue(ellipsoid, Cartesian2.Ellipsoid.WGS84).geodeticSurfaceNormal(
      position,
      normalScratch
    );
    let right = Cartesian3.Cartesian3.cross(velocity, normal, rightScratch);

    if (Cartesian3.Cartesian3.equalsEpsilon(right, Cartesian3.Cartesian3.ZERO, Math$1.CesiumMath.EPSILON6)) {
      right = Cartesian3.Cartesian3.clone(Cartesian3.Cartesian3.UNIT_X, right);
    }

    const up = Cartesian3.Cartesian3.cross(right, velocity, upScratch);
    Cartesian3.Cartesian3.normalize(up, up);
    Cartesian3.Cartesian3.cross(velocity, up, right);
    Cartesian3.Cartesian3.negate(right, right);
    Cartesian3.Cartesian3.normalize(right, right);

    if (!defined.defined(result)) {
      result = new Matrix2.Matrix3();
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

  const swizzleMatrix = new Matrix2.Matrix4(
    0.0,
    0.0,
    1.0,
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
    0.0,
    1.0
  );

  const scratchCartographic = new Cartesian2.Cartographic();
  const scratchCartesian3Projection = new Cartesian3.Cartesian3();
  const scratchCenter = new Cartesian3.Cartesian3();
  const scratchRotation = new Matrix2.Matrix3();
  const scratchFromENU = new Matrix2.Matrix4();
  const scratchToENU = new Matrix2.Matrix4();

  /**
   * @private
   */
  Transforms.basisTo2D = function (projection, matrix, result) {
    //>>includeStart('debug', pragmas.debug);
    if (!defined.defined(projection)) {
      throw new Check.DeveloperError("projection is required.");
    }
    if (!defined.defined(matrix)) {
      throw new Check.DeveloperError("matrix is required.");
    }
    if (!defined.defined(result)) {
      throw new Check.DeveloperError("result is required.");
    }
    //>>includeEnd('debug');

    const rtcCenter = Matrix2.Matrix4.getTranslation(matrix, scratchCenter);
    const ellipsoid = projection.ellipsoid;

    // Get the 2D Center
    const cartographic = ellipsoid.cartesianToCartographic(
      rtcCenter,
      scratchCartographic
    );
    const projectedPosition = projection.project(
      cartographic,
      scratchCartesian3Projection
    );
    Cartesian3.Cartesian3.fromElements(
      projectedPosition.z,
      projectedPosition.x,
      projectedPosition.y,
      projectedPosition
    );

    // Assuming the instance are positioned in WGS84, invert the WGS84 transform to get the local transform and then convert to 2D
    const fromENU = Transforms.eastNorthUpToFixedFrame(
      rtcCenter,
      ellipsoid,
      scratchFromENU
    );
    const toENU = Matrix2.Matrix4.inverseTransformation(fromENU, scratchToENU);
    const rotation = Matrix2.Matrix4.getMatrix3(matrix, scratchRotation);
    const local = Matrix2.Matrix4.multiplyByMatrix3(toENU, rotation, result);
    Matrix2.Matrix4.multiply(swizzleMatrix, local, result); // Swap x, y, z for 2D
    Matrix2.Matrix4.setTranslation(result, projectedPosition, result); // Use the projected center

    return result;
  };

  /**
   * @private
   */
  Transforms.wgs84To2DModelMatrix = function (projection, center, result) {
    //>>includeStart('debug', pragmas.debug);
    if (!defined.defined(projection)) {
      throw new Check.DeveloperError("projection is required.");
    }
    if (!defined.defined(center)) {
      throw new Check.DeveloperError("center is required.");
    }
    if (!defined.defined(result)) {
      throw new Check.DeveloperError("result is required.");
    }
    //>>includeEnd('debug');

    const ellipsoid = projection.ellipsoid;

    const fromENU = Transforms.eastNorthUpToFixedFrame(
      center,
      ellipsoid,
      scratchFromENU
    );
    const toENU = Matrix2.Matrix4.inverseTransformation(fromENU, scratchToENU);

    const cartographic = ellipsoid.cartesianToCartographic(
      center,
      scratchCartographic
    );
    const projectedPosition = projection.project(
      cartographic,
      scratchCartesian3Projection
    );
    Cartesian3.Cartesian3.fromElements(
      projectedPosition.z,
      projectedPosition.x,
      projectedPosition.y,
      projectedPosition
    );

    const translation = Matrix2.Matrix4.fromTranslation(
      projectedPosition,
      scratchFromENU
    );
    Matrix2.Matrix4.multiply(swizzleMatrix, toENU, result);
    Matrix2.Matrix4.multiply(translation, result, result);

    return result;
  };
  var Transforms$1 = Transforms;

  exports.BoundingSphere = BoundingSphere;
  exports.FeatureDetection = FeatureDetection$1;
  exports.Intersect = Intersect$1;
  exports.Interval = Interval;
  exports.Quaternion = Quaternion;
  exports.Transforms = Transforms$1;
  exports.buildModuleUrl = buildModuleUrl;

}));
//# sourceMappingURL=Transforms-e81b498a.js.map
