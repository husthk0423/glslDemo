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

define((function () { 'use strict';

    class LayerContentModel {

        constructor() {
            this.layerHeaderProBuffer = Buffer.alloc(0);
            this.coordinateBufferArray = [];
            this.featureArray = [];
        }

        /**
         * 获取头属性
         * @returns {Buffer}
         */
        getLayerHeaderProBuffer() {
            return this.layerHeaderProBuffer;
        }

        /**
         * 设置头属性
         * @param headerProMap {Buffer}
         */
        setLayerHeaderProBuffer(layerHeaderProBuffer) {
            this.layerHeaderProBuffer = layerHeaderProBuffer;
        }

        /**
         * 获得要素buffer数组
         * @returns {[Buffer]}
         */
        getFeatureArray() {
            return this.featureArray;
        }

        /**
         * 设置要素buffer数组
         * @param featureArray {[Buffer]}
         */
        setFeatureArray(featureArray) {
            this.featureArray = featureArray;
        }

        /**
         * 获得坐标buffer数组
         * @returns {[Buffer]}
         */
        getCoordinateBufferArray() {
            return this.coordinateBufferArray;
        }

        /**
         * 设置坐标buffer数组
         * @param coordinateBufferArray {[Buffer]}
         */
        setCoordinateBufferArray(coordinateBufferArray) {
            this.coordinateBufferArray = coordinateBufferArray;
        }

    }

    return LayerContentModel;

}));
//# sourceMappingURL=LayerContentModel.js.map
