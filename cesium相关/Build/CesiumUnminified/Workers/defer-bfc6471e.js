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

define(['exports'], (function (exports) { 'use strict';

  /**
   * A function used to resolve a promise upon completion .
   * @callback defer.resolve
   *
   * @param {*} value The resulting value.
   */

  /**
   * A function used to reject a promise upon failure.
   * @callback defer.reject
   *
   * @param {*} error The error.
   */

  /**
   * An object which contains a promise object, and functions to resolve or reject the promise.
   *
   * @typedef {Object} defer.deferred
   * @property {defer.resolve} resolve Resolves the promise when called.
   * @property {defer.reject} reject Rejects the promise when called.
   * @property {Promise} promise Promise object.
   */

  /**
   * Creates a deferred object, containing a promise object, and functions to resolve or reject the promise.
   * @returns {defer.deferred}
   * @private
   */
  function defer() {
    let resolve;
    let reject;
    const promise = new Promise(function (res, rej) {
      resolve = res;
      reject = rej;
    });

    return {
      resolve: resolve,
      reject: reject,
      promise: promise,
    };
  }

  exports.defer = defer;

}));
//# sourceMappingURL=defer-bfc6471e.js.map
