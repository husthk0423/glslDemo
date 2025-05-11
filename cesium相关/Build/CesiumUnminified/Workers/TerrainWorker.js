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

define(['./Resource-0c25a925', './GeographicTilingScheme-7a0162b7', './Cartesian2-b941a975', './defined-a5305fd6', './WebMercatorProjection-7ce9285b', './UPNG', './ElevationTool', './TerrainUpsample', './Cache', './defer-bfc6471e', './createTaskProcessorWorker', './_commonjsHelpers-89c9b271', './Check-0f680516', './combine-eceb7722', './Math-79d70b44', './RuntimeError-8d8b6ef6', './GeographicProjection-bcd5d069', './Cartesian3-5587e0cf', './LinkedQueue'], (function (Resource, GeographicTilingScheme, Cartesian2, defined, WebMercatorProjection, UPNG, ElevationTool, TerrainUpsample, Cache, defer, createTaskProcessorWorker, _commonjsHelpers, Check, combine, Math$1, RuntimeError, GeographicProjection, Cartesian3, LinkedQueue) { 'use strict';

  /**
   * A tiling scheme for geometry referenced to a {@link WebMercatorProjection}, EPSG:3857.  This is
   * the tiling scheme used by Google Maps, Microsoft Bing Maps, and most of ESRI ArcGIS Online.
   *
   * @alias WebMercatorTilingScheme
   * @constructor
   *
   * @param {Object} [options] Object with the following properties:
   * @param {Ellipsoid} [options.ellipsoid=Ellipsoid.WGS84] The ellipsoid whose surface is being tiled. Defaults to
   * the WGS84 ellipsoid.
   * @param {Number} [options.numberOfLevelZeroTilesX=1] The number of tiles in the X direction at level zero of
   *        the tile tree.
   * @param {Number} [options.numberOfLevelZeroTilesY=1] The number of tiles in the Y direction at level zero of
   *        the tile tree.
   * @param {Cartesian2} [options.rectangleSouthwestInMeters] The southwest corner of the rectangle covered by the
   *        tiling scheme, in meters.  If this parameter or rectangleNortheastInMeters is not specified, the entire
   *        globe is covered in the longitude direction and an equal distance is covered in the latitude
   *        direction, resulting in a square projection.
   * @param {Cartesian2} [options.rectangleNortheastInMeters] The northeast corner of the rectangle covered by the
   *        tiling scheme, in meters.  If this parameter or rectangleSouthwestInMeters is not specified, the entire
   *        globe is covered in the longitude direction and an equal distance is covered in the latitude
   *        direction, resulting in a square projection.
   */
  function WebMercatorTilingScheme(options) {
    options = defined.defaultValue(options, defined.defaultValue.EMPTY_OBJECT);

    this._ellipsoid = defined.defaultValue(options.ellipsoid, Cartesian2.Ellipsoid.WGS84);
    this._numberOfLevelZeroTilesX = defined.defaultValue(
      options.numberOfLevelZeroTilesX,
      1
    );
    this._numberOfLevelZeroTilesY = defined.defaultValue(
      options.numberOfLevelZeroTilesY,
      1
    );

    this._projection = new WebMercatorProjection.WebMercatorProjection(this._ellipsoid);

    if (
      defined.defined(options.rectangleSouthwestInMeters) &&
      defined.defined(options.rectangleNortheastInMeters)
    ) {
      this._rectangleSouthwestInMeters = options.rectangleSouthwestInMeters;
      this._rectangleNortheastInMeters = options.rectangleNortheastInMeters;
    } else {
      const semimajorAxisTimesPi = this._ellipsoid.maximumRadius * Math.PI;
      this._rectangleSouthwestInMeters = new Cartesian2.Cartesian2(
        -semimajorAxisTimesPi,
        -semimajorAxisTimesPi
      );
      this._rectangleNortheastInMeters = new Cartesian2.Cartesian2(
        semimajorAxisTimesPi,
        semimajorAxisTimesPi
      );
    }

    const southwest = this._projection.unproject(
      this._rectangleSouthwestInMeters
    );
    const northeast = this._projection.unproject(
      this._rectangleNortheastInMeters
    );
    this._rectangle = new Cartesian2.Rectangle(
      southwest.longitude,
      southwest.latitude,
      northeast.longitude,
      northeast.latitude
    );
  }

  Object.defineProperties(WebMercatorTilingScheme.prototype, {
    /**
     * Gets the ellipsoid that is tiled by this tiling scheme.
     * @memberof WebMercatorTilingScheme.prototype
     * @type {Ellipsoid}
     */
    ellipsoid: {
      get: function () {
        return this._ellipsoid;
      },
    },

    /**
     * Gets the rectangle, in radians, covered by this tiling scheme.
     * @memberof WebMercatorTilingScheme.prototype
     * @type {Rectangle}
     */
    rectangle: {
      get: function () {
        return this._rectangle;
      },
    },

    /**
     * Gets the map projection used by this tiling scheme.
     * @memberof WebMercatorTilingScheme.prototype
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
  WebMercatorTilingScheme.prototype.getNumberOfXTilesAtLevel = function (level) {
    return this._numberOfLevelZeroTilesX << level;
  };

  /**
   * Gets the total number of tiles in the Y direction at a specified level-of-detail.
   *
   * @param {Number} level The level-of-detail.
   * @returns {Number} The number of tiles in the Y direction at the given level.
   */
  WebMercatorTilingScheme.prototype.getNumberOfYTilesAtLevel = function (level) {
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
  WebMercatorTilingScheme.prototype.rectangleToNativeRectangle = function (
    rectangle,
    result
  ) {
    const projection = this._projection;
    const southwest = projection.project(Cartesian2.Rectangle.southwest(rectangle));
    const northeast = projection.project(Cartesian2.Rectangle.northeast(rectangle));

    if (!defined.defined(result)) {
      return new Cartesian2.Rectangle(southwest.x, southwest.y, northeast.x, northeast.y);
    }

    result.west = southwest.x;
    result.south = southwest.y;
    result.east = northeast.x;
    result.north = northeast.y;
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
  WebMercatorTilingScheme.prototype.tileXYToNativeRectangle = function (
    x,
    y,
    level,
    result
  ) {
    const xTiles = this.getNumberOfXTilesAtLevel(level);
    const yTiles = this.getNumberOfYTilesAtLevel(level);

    const xTileWidth =
      (this._rectangleNortheastInMeters.x - this._rectangleSouthwestInMeters.x) /
      xTiles;
    const west = this._rectangleSouthwestInMeters.x + x * xTileWidth;
    const east = this._rectangleSouthwestInMeters.x + (x + 1) * xTileWidth;

    const yTileHeight =
      (this._rectangleNortheastInMeters.y - this._rectangleSouthwestInMeters.y) /
      yTiles;
    const north = this._rectangleNortheastInMeters.y - y * yTileHeight;
    const south = this._rectangleNortheastInMeters.y - (y + 1) * yTileHeight;

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
  WebMercatorTilingScheme.prototype.tileXYToRectangle = function (
    x,
    y,
    level,
    result
  ) {
    const nativeRectangle = this.tileXYToNativeRectangle(x, y, level, result);

    const projection = this._projection;
    const southwest = projection.unproject(
      new Cartesian2.Cartesian2(nativeRectangle.west, nativeRectangle.south)
    );
    const northeast = projection.unproject(
      new Cartesian2.Cartesian2(nativeRectangle.east, nativeRectangle.north)
    );

    nativeRectangle.west = southwest.longitude;
    nativeRectangle.south = southwest.latitude;
    nativeRectangle.east = northeast.longitude;
    nativeRectangle.north = northeast.latitude;
    return nativeRectangle;
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
  WebMercatorTilingScheme.prototype.positionToTileXY = function (
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

    const overallWidth =
      this._rectangleNortheastInMeters.x - this._rectangleSouthwestInMeters.x;
    const xTileWidth = overallWidth / xTiles;
    const overallHeight =
      this._rectangleNortheastInMeters.y - this._rectangleSouthwestInMeters.y;
    const yTileHeight = overallHeight / yTiles;

    const projection = this._projection;

    const webMercatorPosition = projection.project(position);
    const distanceFromWest =
      webMercatorPosition.x - this._rectangleSouthwestInMeters.x;
    const distanceFromNorth =
      this._rectangleNortheastInMeters.y - webMercatorPosition.y;

    let xTileCoordinate = (distanceFromWest / xTileWidth) | 0;
    if (xTileCoordinate >= xTiles) {
      xTileCoordinate = xTiles - 1;
    }
    let yTileCoordinate = (distanceFromNorth / yTileHeight) | 0;
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

  /**
   * Cesium - https://github.com/AnalyticalGraphicsInc/cesium
   *
   * Copyright 2011-2017 Cesium Contributors
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
   * See https://github.com/AnalyticalGraphicsInc/cesium/blob/master/LICENSE.md for full licensing details.
   */



  //采样后的地形瓦片宽度
  let w =65;
  let dbMap ={};

  let indexDbName;
  let tilingScheme;
  let maxLevel =16;
  let tileSize =512;
  //地形最大一级的缓存
  let cache = new Cache(100);
  //正在发送请求的map
  let loadingMap = {};
      function init(parameters){
          w = parameters.w;
          indexDbName = parameters.indexDbName;
          tileSize = parameters.tileSize;
          if(parameters.tilingSchemeName == 'GeographicTilingScheme'){
              tilingScheme = new GeographicTilingScheme.GeographicTilingScheme();
          }else {
              tilingScheme = new WebMercatorTilingScheme();
          }
          maxLevel = parameters.maxLevel;

          return ElevationTool.getDBMap([indexDbName],dbMap);
      }

      function getTile(parameters,transferableObjects){
          if(parameters.init == true){
              return init(parameters);
          }

          let deferred = defer.defer();
          parameters.xyzStr =  parameters.xyz.x+'_'+parameters.xyz.y+'_'+parameters.xyz.z;

          let promise = ElevationTool.getElevation(dbMap,[indexDbName],parameters.xyzStr);
          promise.then(function(terrainDataMap){
              for(let key in terrainDataMap){
                  let terrainData = terrainDataMap[key];
                  if(terrainData){
                      let resampleData = resample(terrainData.data,tileSize,transferableObjects);
                      deferred.resolve(resampleData);
                      return;
                  }
              }

              if(parameters.xyz.z > maxLevel){
                  //取父级数据重采样
                  upSample(parameters,maxLevel,deferred,transferableObjects);
                  return deferred.promise;
              }else {
                  //发送请求
                  requestTile(parameters,deferred,transferableObjects);
              }
          });
          return deferred.promise;
      }

      function upSample(parameters,maxLevel,deferred,transferableObjects){
          let scale = Math.pow(2,parameters.xyz.z-maxLevel);
          let parentXYZ = {x:Math.floor(parameters.xyz.x/scale),y:Math.floor(parameters.xyz.y/scale),z:maxLevel};
          let xyz = parameters.xyz;
          let xyzStr = parentXYZ.x+'_'+parentXYZ.y+'_'+parentXYZ.z;
          let cacheTerrainData = cache.get(xyzStr);
          if(cacheTerrainData){
              let data =TerrainUpsample.upsample(tilingScheme,cacheTerrainData,tileSize,tileSize,parentXYZ,xyz);
              let resampleData = resample(data,tileSize,transferableObjects);

              let promise = ElevationTool.updateElevation(dbMap[indexDbName],indexDbName,parameters.xyzStr,data);
              promise.finally(function(e){
                  deferred.resolve(resampleData);
              });
              // promise.then(function(e){
              //     deferred.resolve(resampleData);
              // },function(e){
              //     deferred.resolve(resampleData);
              // });
          }else {
              //请求父级的最大层级的瓦片
              let resourceUrl = parameters.resourceUrl;
              resourceUrl = resourceUrl.replace('{x}',parentXYZ.x);
              resourceUrl = resourceUrl.replace('{y}',parentXYZ.y);
              resourceUrl = resourceUrl.replace('{z}',parentXYZ.z);
              parameters.url = resourceUrl;
              parameters.xyz =  parentXYZ;
              parameters.xyzStr =  parameters.xyz.x+'_'+parameters.xyz.y+'_'+parameters.xyz.z;

              if(loadingMap[resourceUrl]){//如果父级瓦片正在请求中
                  deferred.reject(null);
              }else {
                  let deferred1 = defer.defer();
                  requestTile(parameters,deferred1,transferableObjects);
                  loadingMap[resourceUrl] = true;
                  deferred1.promise.then(function(){
                      let cacheTerrainData = cache.get(parameters.xyzStr);
                      let data =TerrainUpsample.upsample(tilingScheme,cacheTerrainData,tileSize,tileSize,parentXYZ,xyz);
                      let resampleData = resample(data,tileSize,transferableObjects);

                      let key = xyz.x+'_'+xyz.y+'_'+xyz.z;
                      let promise = ElevationTool.updateElevation(dbMap[indexDbName],indexDbName,key,data);
                      promise.finally(function(e){
                          delete loadingMap[resourceUrl];
                          deferred.resolve(resampleData);
                      });
                      // promise.then(function(e){
                      //     delete loadingMap[resourceUrl];
                      //     deferred.resolve(resampleData);
                      // },function(e){
                      //     delete loadingMap[resourceUrl];
                      //     deferred.resolve(resampleData);
                      // });

                  },function(){
                      delete loadingMap[resourceUrl];
                      deferred.reject(null);
                  });
              }
          }
      }

      function requestTile(parameters,deferred,transferableObjects){
          var url = parameters.url;
          var resource = new Resource.Resource({url:url});
          resource.request.throttle = false;
          resource.request.throttleByServer = true;
          resource.request.type = 1;

          var jsonPromise = resource.fetchArrayBuffer();

          if(!jsonPromise){
              deferred.reject(null);
              return;
          }

          jsonPromise.then(function(deferred,arraybuffer){
              let img   = UPNG.decode(arraybuffer);
              let rgba = UPNG.toRGBA8(img)[0];
              let pixels = new Uint8Array(rgba);
              //解码高程
              let data = decode(pixels,img.width);

              //将地形最后一级数据放入缓存中
              if(parameters.xyz.z == maxLevel){
                  cache.set(parameters.xyzStr,data);
              }

              let resampleData = resample(data,img.width,transferableObjects);
              //将地形数据存入indexdb
              let promise = ElevationTool.updateElevation(dbMap[indexDbName],indexDbName,parameters.xyzStr,data);
              promise.then(function(e){
                  deferred.resolve(resampleData);
              },function(e){
                  deferred.resolve(resampleData);
              });
          }.bind(this,deferred));
      }

      /* global require */
    function decode(pixels,width) {
        let data = new Int16Array(width * width);
        const dim = width;

        //解码高程
        for (let y = 0; y < dim; y++) {
            for (let x = 0; x < dim; x++) {
                const i = y * dim + x;
                const j = i * 4;
                let index = y  * dim + x ;
                data[index] = unpack(pixels[j], pixels[j + 1], pixels[j + 2]);
            }
        }
        return data;
    }

   //重采样
    function resample(data,width, transferableObjects){
        let gap = Math.floor(width/(w -1));
        let sData = new Int16Array(w*w);
        let _minimumHeight = 10000;
        let _maximumHeight = -20000;

        for (let y = 0; y < w; y++)
        {
            let yIndex = y * gap * width;
            if(y == w -1){
                yIndex = width * width -width;
            }
            //当前行的最大值
            let maxI = yIndex +width -1;

            for (let x = 0; x < w; x++)
            {
                let i = x * gap + yIndex;
                if(x == w-1){
                    i = maxI;
                }
                let index = x + y * w;
                sData[index] = data[i];

                if(_minimumHeight > data[i]){
                    _minimumHeight = data[i];
                }

                if(_maximumHeight < data[i]){
                    _maximumHeight = data[i];
                }
            }
        }
        transferableObjects.push(sData.buffer);
        return {sData:sData,_minimumHeight:_minimumHeight,_maximumHeight:_maximumHeight};
    }

      function unpack(r, g, b) {
          return Math.round((r * 256 * 256 + g * 256.0 + b) / 10.0 - 10000.0);
      }

      var result = createTaskProcessorWorker(getTile);

  return result;

}));
//# sourceMappingURL=TerrainWorker.js.map
