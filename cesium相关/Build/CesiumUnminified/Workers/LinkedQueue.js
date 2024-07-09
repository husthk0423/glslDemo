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

    /**
     * 链表队列，适合存储大数据量的队列
     * @constructor
     */
    function LinkedQueue() {
        let Node = function (ele) {
            this.ele = ele;
            this.next = null;
        };

        let length = 0,
            front, //队首指针
            rear; //队尾指针
        this.push = function (ele) {
            let node = new Node(ele),
                temp;

            if (length == 0) {
                front = node;
            } else {
                temp = rear;
                temp.next = node;
            }
            rear = node;
            length++;
            return true;
        };

        this.shift = function () {
            let temp = front;
            front = front.next;
            length--;
            temp.next = null;
            return temp.ele;
        };

        this.size = function () {
            return length;
        };
        this.getFront = function () {
            return front.ele;
            // 有没有什么思路只获取队列的头结点,而不是获取整个队列
        };
        this.getRear = function () {
            return rear.ele;
        };
        this.toString = function () {
            let string = '',
                temp = front;
            while (temp) {
                string += temp.ele + ' ';
                temp = temp.next;
            }
            return string;
        };
        this.clear = function () {
            front = null;
            rear = null;
            length = 0;
            return true;
        };
    }

    return LinkedQueue;

}));
//# sourceMappingURL=LinkedQueue.js.map
