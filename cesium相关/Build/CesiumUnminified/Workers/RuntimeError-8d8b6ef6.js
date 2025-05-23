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

define(['exports', './defined-a5305fd6'], (function (exports, defined) { 'use strict';

  /**
   * Constructs an exception object that is thrown due to an error that can occur at runtime, e.g.,
   * out of memory, could not compile shader, etc.  If a function may throw this
   * exception, the calling code should be prepared to catch it.
   * <br /><br />
   * On the other hand, a {@link DeveloperError} indicates an exception due
   * to a developer error, e.g., invalid argument, that usually indicates a bug in the
   * calling code.
   *
   * @alias RuntimeError
   * @constructor
   * @extends Error
   *
   * @param {String} [message] The error message for this exception.
   *
   * @see DeveloperError
   */
  function RuntimeError(message) {
    /**
     * 'RuntimeError' indicating that this exception was thrown due to a runtime error.
     * @type {String}
     * @readonly
     */
    this.name = "RuntimeError";

    /**
     * The explanation for why this exception was thrown.
     * @type {String}
     * @readonly
     */
    this.message = message;

    //Browsers such as IE don't have a stack property until you actually throw the error.
    let stack;
    try {
      throw new Error();
    } catch (e) {
      stack = e.stack;
    }

    /**
     * The stack trace of this exception, if available.
     * @type {String}
     * @readonly
     */
    this.stack = stack;
  }

  if (defined.defined(Object.create)) {
    RuntimeError.prototype = Object.create(Error.prototype);
    RuntimeError.prototype.constructor = RuntimeError;
  }

  RuntimeError.prototype.toString = function () {
    let str = `${this.name}: ${this.message}`;

    if (defined.defined(this.stack)) {
      str += `\n${this.stack.toString()}`;
    }

    return str;
  };

  exports.RuntimeError = RuntimeError;

}));
//# sourceMappingURL=RuntimeError-8d8b6ef6.js.map
