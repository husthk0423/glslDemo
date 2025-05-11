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

define(['./Cartesian3-5587e0cf', './defined-a5305fd6', './EllipseGeometry-ab76c90e', './Cartesian2-b941a975', './Check-0f680516', './Math-79d70b44', './Transforms-e81b498a', './GeographicProjection-bcd5d069', './Matrix2-81068516', './RuntimeError-8d8b6ef6', './Resource-0c25a925', './_commonjsHelpers-89c9b271', './combine-eceb7722', './defer-bfc6471e', './ComponentDatatype-4ab1a86a', './WebGLConstants-d81b330d', './EllipseGeometryLibrary-fb14daaf', './GeometryAttribute-a065274b', './GeometryAttributes-ae79d5fa', './GeometryInstance-2afc3d77', './GeometryOffsetAttribute-102da468', './GeometryPipeline-8667588a', './AttributeCompression-59630bdd', './EncodedCartesian3-3b2d3f49', './IndexDatatype-be8e0e62', './IntersectionTests-8d40a746', './Plane-20e816c1', './VertexFormat-26a1b05a'], (function (Cartesian3, defined, EllipseGeometry, Cartesian2, Check, Math, Transforms, GeographicProjection, Matrix2, RuntimeError, Resource, _commonjsHelpers, combine, defer, ComponentDatatype, WebGLConstants, EllipseGeometryLibrary, GeometryAttribute, GeometryAttributes, GeometryInstance, GeometryOffsetAttribute, GeometryPipeline, AttributeCompression, EncodedCartesian3, IndexDatatype, IntersectionTests, Plane, VertexFormat) { 'use strict';

  function createEllipseGeometry(ellipseGeometry, offset) {
    if (defined.defined(offset)) {
      ellipseGeometry = EllipseGeometry.EllipseGeometry.unpack(ellipseGeometry, offset);
    }
    ellipseGeometry._center = Cartesian3.Cartesian3.clone(ellipseGeometry._center);
    ellipseGeometry._ellipsoid = Cartesian2.Ellipsoid.clone(ellipseGeometry._ellipsoid);
    return EllipseGeometry.EllipseGeometry.createGeometry(ellipseGeometry);
  }

  return createEllipseGeometry;

}));
//# sourceMappingURL=createEllipseGeometry.js.map
