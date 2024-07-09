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

define(['./LinkedQueue'], (function (LinkedQueue) { 'use strict';

    /**
     * Created by kongjian on 2018/6/12.
     * 缓存工具类
     */
    class Cache{
        constructor(limit){
            this.init(limit);
        }

        init(limit){
            this.limit = limit || 10;
            this.map = {};
            this.keys = new LinkedQueue();
        };

        set(key,value){
            let map = this.map;
            let keys = this.keys;
            let deleteItem = null;
            if (!Object.prototype.hasOwnProperty.call(map,key)) {
                if (keys.length === this.limit) {
                    let name = keys.shift();//先进先出，删除队列第一个元素
                    deleteItem = map[name];
                    delete map[name];
                }
                keys.push(key);
            }
            map[key] = value;//无论存在与否都对map中的key赋值
            return deleteItem;
        }
        get(key){
            return this.map[key];
        }
    }

    return Cache;

}));
//# sourceMappingURL=Cache.js.map
