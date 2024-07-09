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

define(['./turf.min'], (function (turf_min) { 'use strict';

    // @flow
    // DEMData also handles the backfilling of data from a tile's neighboring tiles. This is necessary because we use a pixel's 8
    // surrounding pixel values to compute the slope at that pixel, and we cannot accurately calculate the slope at pixels on a
    // tile's edge without backfilling from neighboring tiles.
    class PolygonBuffer {
        static buffer(featuremap,distance){
            for(let key in featuremap){
                let features = featuremap[key];
                features.map((item) => {
                    for(let i =0;i<item.geometrys.length;i++){
                        if (item.geometrys[i].length < 8) {//少于8个坐标点直接返回直接返回
                            continue;
                        }
                        let convertedPolygon = PolygonBuffer.convertGeometory(item.geometrys[i]);
                        let tmpGeo = turf_min.polygon(convertedPolygon);//暂不考虑多地块要素
                        let bufferedGeo = turf_min.buffer(tmpGeo, distance, { units: 'kilometers' });
                        item.geometrys[i] = bufferedGeo.geometry.coordinates[0].flat();
                    }
                });
            }
        }

        static convertGeometory(dots){
            if (!(dots[0] == dots[dots.length - 2] && dots[1] == dots[dots.length - 1])) {
                //如果收尾不相接则接起来
                dots.push(dots[0], dots[1]);
            }
            let newdots = [];
            for (let i = 0; i < dots.length; i = i + 2) {
                dots[i];
                newdots.push([dots[i], dots[i + 1]]);
            }
            return [newdots];
        }

    }

    return PolygonBuffer;

}));
//# sourceMappingURL=PolygonBuffer.js.map
