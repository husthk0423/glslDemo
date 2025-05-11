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

define(['./createTaskProcessorWorker', './Resource-0c25a925', './defined-a5305fd6', './_commonjsHelpers-89c9b271', './Check-0f680516', './combine-eceb7722', './defer-bfc6471e', './Math-79d70b44', './RuntimeError-8d8b6ef6'], (function (createTaskProcessorWorker, Resource, defined, _commonjsHelpers, Check, combine, defer, Math, RuntimeError) { 'use strict';

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

    function request(parameters, transferableObjects) {

        var url = parameters.url;
        var methodName = parameters.methodName;
        var headers = parameters.headers;
        var resource = new Resource.Resource({url:url});
        resource.request.throttle = false;
        resource.request.throttleByServer = true;
        resource.request.type = 1;
        resource.headers = headers;

        var jsonPromise= resource[methodName].call(resource);
        // var jsonPromise= resource.fetchArrayBuffer();

        if(!jsonPromise){
            return false;
        }
        return jsonPromise.then(function(result){
            transferableObjects.push(result);
            return {
                result : result
            };
        });
    }

    var result = createTaskProcessorWorker(request);

    return result;

}));
//# sourceMappingURL=RequestData.js.map
