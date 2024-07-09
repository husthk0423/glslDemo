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

define(['exports', './Cartesian3-5587e0cf', './Cartesian2-b941a975', './defined-a5305fd6', './Check-0f680516'], (function (exports, Cartesian3, Cartesian2, defined, Check) { 'use strict';

  /**
   * A simple map projection where longitude and latitude are linearly mapped to X and Y by multiplying
   * them by the {@link Ellipsoid#maximumRadius}.  This projection
   * is commonly known as geographic, equirectangular, equidistant cylindrical, or plate carrée.  It
   * is also known as EPSG:4326.
   *
   * @alias GeographicProjection
   * @constructor
   *
   * @param {Ellipsoid} [ellipsoid=Ellipsoid.WGS84] The ellipsoid.
   *
   * @see WebMercatorProjection
   */
  function GeographicProjection(ellipsoid) {
    this._ellipsoid = defined.defaultValue(ellipsoid, Cartesian2.Ellipsoid.WGS84);
    this._semimajorAxis = this._ellipsoid.maximumRadius;
    this._oneOverSemimajorAxis = 1.0 / this._semimajorAxis;
  }

  Object.defineProperties(GeographicProjection.prototype, {
    /**
     * Gets the {@link Ellipsoid}.
     *
     * @memberof GeographicProjection.prototype
     *
     * @type {Ellipsoid}
     * @readonly
     */
    ellipsoid: {
      get: function () {
        return this._ellipsoid;
      },
    },
  });

  /**
   * Projects a set of {@link Cartographic} coordinates, in radians, to map coordinates, in meters.
   * X and Y are the longitude and latitude, respectively, multiplied by the maximum radius of the
   * ellipsoid.  Z is the unmodified height.
   *
   * @param {Cartographic} cartographic The coordinates to project.
   * @param {Cartesian3} [result] An instance into which to copy the result.  If this parameter is
   *        undefined, a new instance is created and returned.
   * @returns {Cartesian3} The projected coordinates.  If the result parameter is not undefined, the
   *          coordinates are copied there and that instance is returned.  Otherwise, a new instance is
   *          created and returned.
   */
  GeographicProjection.prototype.project = function (cartographic, result) {
    // Actually this is the special case of equidistant cylindrical called the plate carree
    const semimajorAxis = this._semimajorAxis;
    const x = cartographic.longitude * semimajorAxis;
    const y = cartographic.latitude * semimajorAxis;
    const z = cartographic.height;

    if (!defined.defined(result)) {
      return new Cartesian3.Cartesian3(x, y, z);
    }

    result.x = x;
    result.y = y;
    result.z = z;
    return result;
  };

  /**
   * Unprojects a set of projected {@link Cartesian3} coordinates, in meters, to {@link Cartographic}
   * coordinates, in radians.  Longitude and Latitude are the X and Y coordinates, respectively,
   * divided by the maximum radius of the ellipsoid.  Height is the unmodified Z coordinate.
   *
   * @param {Cartesian3} cartesian The Cartesian position to unproject with height (z) in meters.
   * @param {Cartographic} [result] An instance into which to copy the result.  If this parameter is
   *        undefined, a new instance is created and returned.
   * @returns {Cartographic} The unprojected coordinates.  If the result parameter is not undefined, the
   *          coordinates are copied there and that instance is returned.  Otherwise, a new instance is
   *          created and returned.
   */
  GeographicProjection.prototype.unproject = function (cartesian, result) {
    //>>includeStart('debug', pragmas.debug);
    if (!defined.defined(cartesian)) {
      throw new Check.DeveloperError("cartesian is required");
    }
    //>>includeEnd('debug');

    const oneOverEarthSemimajorAxis = this._oneOverSemimajorAxis;
    const longitude = cartesian.x * oneOverEarthSemimajorAxis;
    const latitude = cartesian.y * oneOverEarthSemimajorAxis;
    const height = cartesian.z;

    if (!defined.defined(result)) {
      return new Cartesian2.Cartographic(longitude, latitude, height);
    }

    result.longitude = longitude;
    result.latitude = latitude;
    result.height = height;
    return result;
  };

  exports.GeographicProjection = GeographicProjection;

}));
//# sourceMappingURL=GeographicProjection-bcd5d069.js.map
