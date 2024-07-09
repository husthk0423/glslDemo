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

define(['./createTaskProcessorWorker', './Resource-0c25a925', './Cache', './defer-bfc6471e', './defined-a5305fd6', './_commonjsHelpers-89c9b271', './Check-0f680516', './combine-eceb7722', './Math-79d70b44', './RuntimeError-8d8b6ef6', './LinkedQueue'], (function (createTaskProcessorWorker, Resource, Cache, defer, defined, _commonjsHelpers, Check, combine, Math$1, RuntimeError, LinkedQueue) { 'use strict';

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

  //默认当前屏幕最多10万个房屋缓存
  new Cache(100000);

      function init(parameters){
          let deferred = defer.defer();
          deferred.resolve({});
          return deferred.promise;
      }

      /* global require */
    function createGeometry(parameters, transferableObjects) {
              if(parameters.init ==true){
                  init();
                  return;
              }

              var url = parameters.url;
              var resource = new Resource.Resource({url:url});
              resource.request.throttle = false;
              resource.request.throttleByServer = true;
              resource.request.type = 1;

              var jsonPromise = resource.fetchArrayBuffer();
              if(!jsonPromise){
                  return true;
              }


              let deferred = defer.defer();
              jsonPromise.then(function(imageData) {
                  if(!imageData){
                      deferred.resolve({});
                      return;
                  }
               //    let featureMap = {wmts:[{type:'Polygon',geometrys:[[0,0,tileSize,0,tileSize,tileSize,0,tileSize]]}]};
               // //将瓦片内坐标转为地心坐标
               //  featureMapToLonLat(featureMap,parameters);
               //  toCartesian3(featureMap);
                // let primitiveData = getPrimitiveData(featureMap, parameters.level, options, transferableObjects);
                //   transferableObjects.push(imageData);
                deferred.resolve(imageData);
            },function (e){
                deferred.reject(e);
            });
            return deferred.promise;
          }

      var result = createTaskProcessorWorker(createGeometry);

  return result;

}));
//# sourceMappingURL=EnvelopeWmtsWorker.js.map
