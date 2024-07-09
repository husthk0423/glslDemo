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

define(['./createTaskProcessorWorker', './Resource-0c25a925', './VectorDrawer', './point-e73d3a16', './ColorUtil', './ParseBinaryData', './defined-a5305fd6', './_commonjsHelpers-89c9b271', './Check-0f680516', './combine-eceb7722', './defer-bfc6471e', './Math-79d70b44', './RuntimeError-8d8b6ef6', './Buffer', './base64', './ieee754', './isArray', './VarintReader', './snappyJs', './CodeTool', './LayerContentModel', './GisTools'], (function (createTaskProcessorWorker, Resource, VectorDrawer, point, ColorUtil, ParseBinaryData, defined, _commonjsHelpers, Check, combine, defer, Math, RuntimeError, Buffer, base64, ieee754, isArray, VarintReader, snappyJs, CodeTool, LayerContentModel, GisTools) { 'use strict';

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

  let styleFun = undefined;
  let tileSize = 512;

  let serverInfo = {};
  let layerFieldMap = {};


      /* global require */
    function createGeometry(parameters, transferableObjects) {
              //初始化
              if(parameters.init ==true){
                  styleFun = new Function("render","level", parameters.styleStr);
                  tileSize = parameters.tileSize;
                  parameters.return_type;
                  serverInfo = parameters.serverInfo;
                  layerFieldMap = parameters.layerFieldMap;
                  return true;
              }

              //更改样式
              if(parameters.changeStyle == true){
                  let layers =  ParseBinaryData(parameters.tileData,layerFieldMap,serverInfo);
                  let featureMap =  parseData(layers,parameters);

                  return  createBuckets(featureMap,transferableObjects);
              }


              //初次请求url
              var url = parameters.url;
              var resource = new Resource.Resource({url:url});
              resource.request.throttle = false;
              resource.request.throttleByServer = true;
              resource.request.type = 1;

              var jsonPromise = resource.fetchArrayBuffer();

              if(!jsonPromise){
                  return true;
              }

              return jsonPromise.then(function(data){
                  let layers =  ParseBinaryData(data,layerFieldMap,serverInfo);
                  let featureMap =  parseData(layers,parameters);

                  let buckets =  createBuckets(featureMap,transferableObjects);
                  return {tileData:data,buckets:buckets};
              });
          }

          function parseData(data,parameters){
              if(!data){
                  return {};
              }
              data =  data.layer? data.layer:data;

              decodeData(data,parameters.needDecode);
              //设置样式
              let featureMap = {};
              let render = new VectorDrawer([data], parameters.level, featureMap,parameters.controlVector,
                  parameters.highLightVector,parameters.filterLayerId);
              styleFun.call({}, render, parameters.level);
              return featureMap;
          }

          /**
           *  解码数据，包括点坐标偏移，正方形F的解码等
           * @param data
           */
          function decodeData(data,needDecode){
              for(let layername in data){
                  let features = data[layername].features;
                  if(!features){
                      features = data[layername].datas;
                  }
                  for(let i = 0;i<features.length;i++){
                      recursiveDecode(features[i][2],needDecode);
                  }
              }
          }

          function recursiveDecode(components,needDecode){
              if(components[0] == 'F'){
                  components[0] = formatF();
                  return;
              }

              if (Array.isArray(components[0])) {
                  let len = components.length;
                  for (let i = 0; i < len; i++) {
                      let component = components[i];
                      recursiveDecode(component,needDecode);
                  }
              } else {
                  if(needDecode){
                      recoveryData(components);
                  }
              }
          }

          function recoveryData(components){
              let prevPoint = [components[0],components[1]];
              for(let j =2;j<components.length;j++){
                  let x = prevPoint[0]+components[j];
                  let y = prevPoint[1]+components[j+1];
                  components[j] = x;
                  components[j+1] = y;
                  prevPoint = [x,y];
                  j++;
              }
          }

          function formatF(){
              return [-tileSize*0.05,-tileSize*0.05,tileSize*1.05,-tileSize*0.05,
                  tileSize*1.05,tileSize*1.05,-tileSize*0.05,tileSize*1.05];
          }


          function createBuckets(featureMap,transferableObjects,parameters){
              let buckets = [];
              for(let i =0;i<featureMap.keyArr.length;i++){
                  let styleKey = featureMap.keyArr[i];
                  let styleFeature = featureMap[styleKey];
                  let style = styleFeature.style;
                  formatStyleColor(style);

                  if(styleFeature.lineFeatues.length > 0){
                      let lineBucket = new point.LineBucket({style:style,type:'line',tileSize:tileSize});
                      for (let feature of styleFeature.lineFeatues) {
                          //抽稀
                          sparsityFeature(feature,style);
                          //坐标转换
                          let featureGeometry = formatGeometry(feature);

                          lineBucket.addFeature(featureGeometry);
                      }
                      lineBucket = lineBucket.serialize(transferableObjects);
                      buckets.push(lineBucket);
                      continue;
                  }
                  if(styleFeature.fillFeatures.length > 0){
                      let fillBucket = new point.FillBucket({style:style,type:'fill',tileSize:tileSize});
                      //面边线
                      let lineBucket = new point.LineBucket({style:style,type:'line',tileSize:tileSize});
                      for (let feature of styleFeature.fillFeatures) {
                          //抽稀
                          sparsityFeature(feature,style);
                          //坐标转换
                          let featureGeometry = formatGeometry(feature);
                          fillBucket.addFeature(featureGeometry);

                          if(style.stroke){
                              lineBucket.addFeature(featureGeometry);
                          }
                      }

                      fillBucket = fillBucket.serialize(transferableObjects);
                      buckets.push(fillBucket);

                      if(style.stroke){
                          lineBucket = lineBucket.serialize(transferableObjects);
                          buckets.push(lineBucket);
                      }
                  }
              }
              return buckets;
          }

          function sparsityFeature(feature,style,close){
              if(!style.sparsity){
                  return;
              }
              let sparsity = parseFloat(style.sparsity);

              for(let i = 0;i<feature.data.length;i++){
                  let points = feature.data[i];
                  if (sparsity != null || sparsity != 1) {
                      feature.data[i] = point.simplify(points, sparsity / 4, true);
                  }
              }
          }

          function formatGeometry(feature){
              let n  = 256/tileSize*32;
              let geometry = [];
              for(let i = 0;i<feature.data.length;i++){
                  geometry[i] = [];
                  let ring = feature.data[i];
                  for(let j =0;j<ring.length;j++){
                      if(j%2 == 0){
                          let x = ring[j]*n;
                          let y = ring[j+1]*n;
                          geometry[i].push(new point.Point(x,y));
                      }
                  }
              }

              return geometry;
          }

      function formatStyleColor(style){
          let color = new ColorUtil();
          if(style.fillColor){
              color.fromHex(style.fillColor);
              let fillColor = [color.rgb[0]/255.0,color.rgb[1]/255.0,color.rgb[2]/255.0,1.0];
              style.fillColor = fillColor;
          }

          if(style.strokeColor){
              color = new ColorUtil();
              color.fromHex(style.strokeColor);
              let strokeColor = [color.rgb[0]/255.0,color.rgb[1]/255.0,color.rgb[2]/255.0,1.0];
              style.strokeColor = strokeColor;
          }
      }

      var result = createTaskProcessorWorker(createGeometry);

  return result;

}));
//# sourceMappingURL=VectorBinaryWorker.js.map
