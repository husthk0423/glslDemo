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

define(['exports', './Cartesian2-b941a975', './Check-0f680516', './defined-a5305fd6', './GeographicProjection-bcd5d069', './Math-79d70b44'], (function (exports, Cartesian2, Check, defined, GeographicProjection, Math) { 'use strict';

  /**
   * A tiling scheme for geometry referenced to a simple {@link GeographicProjection} where
   * longitude and latitude are directly mapped to X and Y.  This projection is commonly
   * known as geographic, equirectangular, equidistant cylindrical, or plate carrée.
   *
   * @alias GeographicTilingScheme
   * @constructor
   *
   * @param {Object} [options] Object with the following properties:
   * @param {Ellipsoid} [options.ellipsoid=Ellipsoid.WGS84] The ellipsoid whose surface is being tiled. Defaults to
   * the WGS84 ellipsoid.
   * @param {Rectangle} [options.rectangle=Rectangle.MAX_VALUE] The rectangle, in radians, covered by the tiling scheme.
   * @param {Number} [options.numberOfLevelZeroTilesX=2] The number of tiles in the X direction at level zero of
   * the tile tree.
   * @param {Number} [options.numberOfLevelZeroTilesY=1] The number of tiles in the Y direction at level zero of
   * the tile tree.
   */
  function GeographicTilingScheme(options) {
    options = defined.defaultValue(options, defined.defaultValue.EMPTY_OBJECT);

    this._ellipsoid = defined.defaultValue(options.ellipsoid, Cartesian2.Ellipsoid.WGS84);
    this._rectangle = defined.defaultValue(options.rectangle, Cartesian2.Rectangle.MAX_VALUE);
    this._projection = new GeographicProjection.GeographicProjection(this._ellipsoid);
    this._numberOfLevelZeroTilesX = defined.defaultValue(
      options.numberOfLevelZeroTilesX,
      2
    );
    this._numberOfLevelZeroTilesY = defined.defaultValue(
      options.numberOfLevelZeroTilesY,
      1
    );
  }

  Object.defineProperties(GeographicTilingScheme.prototype, {
    /**
     * Gets the ellipsoid that is tiled by this tiling scheme.
     * @memberof GeographicTilingScheme.prototype
     * @type {Ellipsoid}
     */
    ellipsoid: {
      get: function () {
        return this._ellipsoid;
      },
    },

    /**
     * Gets the rectangle, in radians, covered by this tiling scheme.
     * @memberof GeographicTilingScheme.prototype
     * @type {Rectangle}
     */
    rectangle: {
      get: function () {
        return this._rectangle;
      },
    },

    /**
     * Gets the map projection used by this tiling scheme.
     * @memberof GeographicTilingScheme.prototype
     * @type {MapProjection}
     */
    projection: {
      get: function () {
        return this._projection;
      },
    },
  });

  /**
   * Gets the total number of tiles in the X direction at a specified level-of-detail.
   *
   * @param {Number} level The level-of-detail.
   * @returns {Number} The number of tiles in the X direction at the given level.
   */
  GeographicTilingScheme.prototype.getNumberOfXTilesAtLevel = function (level) {
    return this._numberOfLevelZeroTilesX << level;
  };

  /**
   * Gets the total number of tiles in the Y direction at a specified level-of-detail.
   *
   * @param {Number} level The level-of-detail.
   * @returns {Number} The number of tiles in the Y direction at the given level.
   */
  GeographicTilingScheme.prototype.getNumberOfYTilesAtLevel = function (level) {
    return this._numberOfLevelZeroTilesY << level;
  };

  /**
   * Transforms a rectangle specified in geodetic radians to the native coordinate system
   * of this tiling scheme.
   *
   * @param {Rectangle} rectangle The rectangle to transform.
   * @param {Rectangle} [result] The instance to which to copy the result, or undefined if a new instance
   *        should be created.
   * @returns {Rectangle} The specified 'result', or a new object containing the native rectangle if 'result'
   *          is undefined.
   */
  GeographicTilingScheme.prototype.rectangleToNativeRectangle = function (
    rectangle,
    result
  ) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.defined("rectangle", rectangle);
    //>>includeEnd('debug');

    const west = Math.CesiumMath.toDegrees(rectangle.west);
    const south = Math.CesiumMath.toDegrees(rectangle.south);
    const east = Math.CesiumMath.toDegrees(rectangle.east);
    const north = Math.CesiumMath.toDegrees(rectangle.north);

    if (!defined.defined(result)) {
      return new Cartesian2.Rectangle(west, south, east, north);
    }

    result.west = west;
    result.south = south;
    result.east = east;
    result.north = north;
    return result;
  };

  /**
   * Converts tile x, y coordinates and level to a rectangle expressed in the native coordinates
   * of the tiling scheme.
   *
   * @param {Number} x The integer x coordinate of the tile.
   * @param {Number} y The integer y coordinate of the tile.
   * @param {Number} level The tile level-of-detail.  Zero is the least detailed.
   * @param {Object} [result] The instance to which to copy the result, or undefined if a new instance
   *        should be created.
   * @returns {Rectangle} The specified 'result', or a new object containing the rectangle
   *          if 'result' is undefined.
   */
  GeographicTilingScheme.prototype.tileXYToNativeRectangle = function (
    x,
    y,
    level,
    result
  ) {
    const rectangleRadians = this.tileXYToRectangle(x, y, level, result);
    rectangleRadians.west = Math.CesiumMath.toDegrees(rectangleRadians.west);
    rectangleRadians.south = Math.CesiumMath.toDegrees(rectangleRadians.south);
    rectangleRadians.east = Math.CesiumMath.toDegrees(rectangleRadians.east);
    rectangleRadians.north = Math.CesiumMath.toDegrees(rectangleRadians.north);
    return rectangleRadians;
  };

  /**
   * Converts tile x, y coordinates and level to a cartographic rectangle in radians.
   *
   * @param {Number} x The integer x coordinate of the tile.
   * @param {Number} y The integer y coordinate of the tile.
   * @param {Number} level The tile level-of-detail.  Zero is the least detailed.
   * @param {Object} [result] The instance to which to copy the result, or undefined if a new instance
   *        should be created.
   * @returns {Rectangle} The specified 'result', or a new object containing the rectangle
   *          if 'result' is undefined.
   */
  GeographicTilingScheme.prototype.tileXYToRectangle = function (
    x,
    y,
    level,
    result
  ) {
    const rectangle = this._rectangle;

    const xTiles = this.getNumberOfXTilesAtLevel(level);
    const yTiles = this.getNumberOfYTilesAtLevel(level);

    const xTileWidth = rectangle.width / xTiles;
    const west = x * xTileWidth + rectangle.west;
    const east = (x + 1) * xTileWidth + rectangle.west;

    const yTileHeight = rectangle.height / yTiles;
    const north = rectangle.north - y * yTileHeight;
    const south = rectangle.north - (y + 1) * yTileHeight;

    if (!defined.defined(result)) {
      result = new Cartesian2.Rectangle(west, south, east, north);
    }

    result.west = west;
    result.south = south;
    result.east = east;
    result.north = north;
    return result;
  };

  /**
   * Calculates the tile x, y coordinates of the tile containing
   * a given cartographic position.
   *
   * @param {Cartographic} position The position.
   * @param {Number} level The tile level-of-detail.  Zero is the least detailed.
   * @param {Cartesian2} [result] The instance to which to copy the result, or undefined if a new instance
   *        should be created.
   * @returns {Cartesian2} The specified 'result', or a new object containing the tile x, y coordinates
   *          if 'result' is undefined.
   */
  GeographicTilingScheme.prototype.positionToTileXY = function (
    position,
    level,
    result
  ) {
    const rectangle = this._rectangle;
    if (!Cartesian2.Rectangle.contains(rectangle, position)) {
      // outside the bounds of the tiling scheme
      return undefined;
    }

    const xTiles = this.getNumberOfXTilesAtLevel(level);
    const yTiles = this.getNumberOfYTilesAtLevel(level);

    const xTileWidth = rectangle.width / xTiles;
    const yTileHeight = rectangle.height / yTiles;

    let longitude = position.longitude;
    if (rectangle.east < rectangle.west) {
      longitude += Math.CesiumMath.TWO_PI;
    }

    let xTileCoordinate = ((longitude - rectangle.west) / xTileWidth) | 0;
    if (xTileCoordinate >= xTiles) {
      xTileCoordinate = xTiles - 1;
    }

    let yTileCoordinate =
      ((rectangle.north - position.latitude) / yTileHeight) | 0;
    if (yTileCoordinate >= yTiles) {
      yTileCoordinate = yTiles - 1;
    }

    if (!defined.defined(result)) {
      return new Cartesian2.Cartesian2(xTileCoordinate, yTileCoordinate);
    }

    result.x = xTileCoordinate;
    result.y = yTileCoordinate;
    return result;
  };

  exports.GeographicTilingScheme = GeographicTilingScheme;

}));
//# sourceMappingURL=GeographicTilingScheme-7a0162b7.js.map
