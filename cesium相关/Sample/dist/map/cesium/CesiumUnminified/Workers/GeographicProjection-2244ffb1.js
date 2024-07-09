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
 * See https://github.com/CesiumGS/cesium/blob/main/LICENSE.md for full licensing details.
 */

define(['exports', './Cartesian2-d1e6e2fc', './defaultValue-81eec7ed', './Check-edea0f91'], (function (exports, Cartesian2, defaultValue, Check) { 'use strict';

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
    this._ellipsoid = defaultValue.defaultValue(ellipsoid, Cartesian2.Ellipsoid.WGS84);
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
    var semimajorAxis = this._semimajorAxis;
    var x = cartographic.longitude * semimajorAxis;
    var y = cartographic.latitude * semimajorAxis;
    var z = cartographic.height;

    if (!defaultValue.defined(result)) {
      return new Cartesian2.Cartesian3(x, y, z);
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
    if (!defaultValue.defined(cartesian)) {
      throw new Check.DeveloperError("cartesian is required");
    }
    //>>includeEnd('debug');

    var oneOverEarthSemimajorAxis = this._oneOverSemimajorAxis;
    var longitude = cartesian.x * oneOverEarthSemimajorAxis;
    var latitude = cartesian.y * oneOverEarthSemimajorAxis;
    var height = cartesian.z;

    if (!defaultValue.defined(result)) {
      return new Cartesian2.Cartographic(longitude, latitude, height);
    }

    result.longitude = longitude;
    result.latitude = latitude;
    result.height = height;
    return result;
  };

  exports.GeographicProjection = GeographicProjection;

}));
//# sourceMappingURL=GeographicProjection-2244ffb1.js.map
