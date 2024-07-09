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

define(['./createTaskProcessorWorker', './Resource-0c25a925', './Cartesian3-5587e0cf', './HouseDrawer', './ParseBinaryData', './GetPrimitiveData', './Cache', './PolygonBuffer', './defer-bfc6471e', './defined-a5305fd6', './_commonjsHelpers-89c9b271', './Check-0f680516', './combine-eceb7722', './Math-79d70b44', './RuntimeError-8d8b6ef6', './Buffer', './base64', './ieee754', './isArray', './VarintReader', './snappyJs', './CodeTool', './LayerContentModel', './GisTools', './Color-22035b49', './Transforms-e81b498a', './Cartesian2-b941a975', './GeographicProjection-bcd5d069', './Matrix2-81068516', './ComponentDatatype-4ab1a86a', './WebGLConstants-d81b330d', './GeometryInstance-2afc3d77', './PolygonGeometry-2cebb17c', './ArcType-b714639b', './BoundingRectangle-030bccf7', './EllipsoidGeodesic-04edecba', './EllipsoidTangentPlane-fc899479', './AxisAlignedBoundingBox-1a14512c', './IntersectionTests-8d40a746', './Plane-20e816c1', './GeometryAttribute-a065274b', './GeometryOffsetAttribute-102da468', './GeometryPipeline-8667588a', './AttributeCompression-59630bdd', './EncodedCartesian3-3b2d3f49', './IndexDatatype-be8e0e62', './PolygonGeometryLibrary-08f40462', './arrayRemoveDuplicates-1c85c3e7', './EllipsoidRhumbLine-90229f69', './GeometryAttributes-ae79d5fa', './PolygonPipeline-ddb4fc8b', './VertexFormat-26a1b05a', './PolygonOutlineGeometry-a84047fb', './PixelFormat-3c3c79f0', './PrimitivePipeline-90d56cdf', './WebMercatorProjection-7ce9285b', './GetRidingLanternGeometry', './LinkedQueue', './turf.min'], (function (createTaskProcessorWorker, Resource, Cartesian3, HouseDrawer, ParseBinaryData, GetPrimitiveData, Cache, PolygonBuffer, defer, defined, _commonjsHelpers, Check, combine, Math$1, RuntimeError, Buffer, base64, ieee754, isArray, VarintReader, snappyJs, CodeTool, LayerContentModel, GisTools, Color, Transforms, Cartesian2, GeographicProjection, Matrix2, ComponentDatatype, WebGLConstants, GeometryInstance, PolygonGeometry, ArcType, BoundingRectangle, EllipsoidGeodesic, EllipsoidTangentPlane, AxisAlignedBoundingBox, IntersectionTests, Plane, GeometryAttribute, GeometryOffsetAttribute, GeometryPipeline, AttributeCompression, EncodedCartesian3, IndexDatatype, PolygonGeometryLibrary, arrayRemoveDuplicates, EllipsoidRhumbLine, GeometryAttributes, PolygonPipeline, VertexFormat, PolygonOutlineGeometry, PixelFormat, PrimitivePipeline, WebMercatorProjection, GetRidingLanternGeometry, LinkedQueue, turf_min) { 'use strict';

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
    let options = {};

    let serverInfo = {};
    let layerFieldMap = {};

    //默认当前屏幕最多10万个房屋缓存
    new Cache(100000);

        function init(parameters){
            let deferred = defer.defer();
            styleFun = new Function("render","level", parameters.styleStr);
            tileSize = parameters.tileSize;
            parameters.return_type;
            options = parameters;

            serverInfo = parameters.serverInfo;
            layerFieldMap = parameters.layerFieldMap;
            deferred.resolve({});
            return deferred.promise;
        }

        /* global require */
        function createGeometry(parameters, transferableObjects) {
                if(parameters.init ==true){
                    init(parameters);
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
                jsonPromise.then(function(data) {
                    if(!data){
                        deferred.resolve({});
                        return;
                    }
                    let layers =  ParseBinaryData(data,layerFieldMap,serverInfo);
                    let featureMap =  parseData(layers,parameters);
                    //将瓦片内坐标转为地心坐标
                    featureMapToLonLat(featureMap,parameters);
                    if(parameters.bufferDistance !=0){
                        PolygonBuffer.buffer(featureMap,parameters.bufferDistance*0.001);
                    }

                    toCartesian3(featureMap);
                    let primitiveData = GetPrimitiveData(featureMap, parameters.level, options, transferableObjects);
                    deferred.resolve(primitiveData);
                },function (e){
                    deferred.reject(e);
                });
                return deferred.promise;
            }


            function parseData(data,parameters){
                if(data){
                    decodeData(data,parameters.needDecode);
                    //设置样式
                    let featureMap = {};
                    let drawer = new HouseDrawer([data], parameters.level, featureMap,parameters.controlVector,
                        parameters.highLightVector,parameters.filterLayerId);
                    styleFun.call({}, drawer, parameters.level);
                    formatGeometrys(featureMap);
                    return featureMap;
                }
                return {};
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


            /**
             *  解析多面
             * @param featureMap
             */
            function formatGeometrys(featureMap){
                for(let key in featureMap){
                    let features = featureMap[key];
                    for(let i = 0;i<features.length;i++){
                        let feature = features[i];
                        let geometrys = [];
                        recursiveFormat(geometrys,feature.data);
                        delete feature.data;
                        feature.geometrys = geometrys;


                        let height = 0;
                        if(options.hasOwnProperty('heightProperty')){
                            let heightProperty = options.heightProperty;
                            height = feature.properties[heightProperty];
                            if(options.hasOwnProperty('heightScale')){
                                height = height * parseFloat(options.heightScale);
                            }
                        }
                        //不考虑地形，房子的本身高度
                        feature.height = height;
                        feature.totalHeight = height;
                    }
                }
            }

            function recursiveFormat(geometrys,components){
                if (Array.isArray(components[0])) {
                    let len = components.length;
                    for (let i = 0; i < len; i++) {
                        let component = components[i];
                        recursiveFormat(geometrys,component);
                    }
                } else {
                    geometrys.push(components);
                }
            }

            function featureMapToLonLat(featureMap,parameters){
                for(let key in featureMap){
                    let features = featureMap[key];
                    for(let i = 0;i<features.length;i++){
                        let feature = features[i];
                        let polygons = [];
                        for(let j =0;j<feature.geometrys.length;j++){
                            let geometry = feature.geometrys[j];
                            let positions = geometryToLonLat(geometry,parameters);
                            polygons.push(positions);
                        }
                        feature.geometrys = polygons;
                    }
                }
            }

            function geometryToLonLat(geometry,parameters){
                let rectangle = parameters.rectangle ;
                var positions = [];
                for (var i = 0; i < geometry.length; i++) {
                    var pt = formatToDegrees(geometry[i],geometry[i+1],rectangle);
                    positions.push(pt[0]);
                    positions.push(pt[1]);
                    i++;
                }
                return positions;
            }

            function formatToDegrees(x,y,rectangle){
                var lon = toDegrees(rectangle.west + rectangle.width/ tileSize* x);
                var lat = toDegrees(rectangle.north - rectangle.height/ tileSize* y);
                lon = Number(lon.toFixed(6));
                lat = Number(lat.toFixed(6));
                return [lon,lat];
            }

            function toDegrees (radians) {
                return radians * 180.0 / Math.PI;
            }
            function toCartesian3(featureMap){
                for(let key in featureMap){
                    let features = featureMap[key];
                    features.map((item) => {
                        let polygons = [];
                        for(let i =0;i<item.geometrys.length;i++){
                            let geometry = item.geometrys[i];
                            let positions = [];
                            for(let j = 0;j<geometry.length;j++){
                                let lon = geometry[j];
                                let lat = geometry[j+1];
                                let cartesian3 =Cartesian3.Cartesian3.fromDegrees(lon, lat);
                                positions.push(cartesian3);
                                j++;
                            }
                            polygons.push(positions);
                        }
                        item.polygons = polygons;
                        delete item.geometrys;
                    });
                }
            }

        var result = createTaskProcessorWorker(createGeometry);

    return result;

}));
//# sourceMappingURL=EnvelopeBinaryWorker.js.map
