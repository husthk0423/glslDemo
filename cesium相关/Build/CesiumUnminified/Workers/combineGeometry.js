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

define(['./PrimitivePipeline-90d56cdf', './createTaskProcessorWorker', './Transforms-e81b498a', './Cartesian3-5587e0cf', './Check-0f680516', './defined-a5305fd6', './Math-79d70b44', './Cartesian2-b941a975', './GeographicProjection-bcd5d069', './Matrix2-81068516', './RuntimeError-8d8b6ef6', './Resource-0c25a925', './_commonjsHelpers-89c9b271', './combine-eceb7722', './defer-bfc6471e', './ComponentDatatype-4ab1a86a', './WebGLConstants-d81b330d', './GeometryAttribute-a065274b', './GeometryAttributes-ae79d5fa', './GeometryPipeline-8667588a', './AttributeCompression-59630bdd', './EncodedCartesian3-3b2d3f49', './IndexDatatype-be8e0e62', './IntersectionTests-8d40a746', './Plane-20e816c1', './WebMercatorProjection-7ce9285b'], (function (PrimitivePipeline, createTaskProcessorWorker, Transforms, Cartesian3, Check, defined, Math, Cartesian2, GeographicProjection, Matrix2, RuntimeError, Resource, _commonjsHelpers, combine, defer, ComponentDatatype, WebGLConstants, GeometryAttribute, GeometryAttributes, GeometryPipeline, AttributeCompression, EncodedCartesian3, IndexDatatype, IntersectionTests, Plane, WebMercatorProjection) { 'use strict';

  function combineGeometry(packedParameters, transferableObjects) {
    const parameters = PrimitivePipeline.PrimitivePipeline.unpackCombineGeometryParameters(
      packedParameters
    );
    const results = PrimitivePipeline.PrimitivePipeline.combineGeometry(parameters);
    return PrimitivePipeline.PrimitivePipeline.packCombineGeometryResults(
      results,
      transferableObjects
    );
  }
  var combineGeometry$1 = createTaskProcessorWorker(combineGeometry);

  return combineGeometry$1;

}));
//# sourceMappingURL=combineGeometry.js.map
