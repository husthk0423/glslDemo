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

define(['./defined-a5305fd6', './Cartesian2-b941a975', './PolygonOutlineGeometry-a84047fb', './Cartesian3-5587e0cf', './Check-0f680516', './Math-79d70b44', './ArcType-b714639b', './Transforms-e81b498a', './GeographicProjection-bcd5d069', './Matrix2-81068516', './RuntimeError-8d8b6ef6', './Resource-0c25a925', './_commonjsHelpers-89c9b271', './combine-eceb7722', './defer-bfc6471e', './ComponentDatatype-4ab1a86a', './WebGLConstants-d81b330d', './EllipsoidTangentPlane-fc899479', './AxisAlignedBoundingBox-1a14512c', './IntersectionTests-8d40a746', './Plane-20e816c1', './GeometryAttribute-a065274b', './GeometryAttributes-ae79d5fa', './GeometryInstance-2afc3d77', './GeometryOffsetAttribute-102da468', './GeometryPipeline-8667588a', './AttributeCompression-59630bdd', './EncodedCartesian3-3b2d3f49', './IndexDatatype-be8e0e62', './PolygonGeometryLibrary-08f40462', './arrayRemoveDuplicates-1c85c3e7', './EllipsoidRhumbLine-90229f69', './PolygonPipeline-ddb4fc8b'], (function (defined, Cartesian2, PolygonOutlineGeometry, Cartesian3, Check, Math, ArcType, Transforms, GeographicProjection, Matrix2, RuntimeError, Resource, _commonjsHelpers, combine, defer, ComponentDatatype, WebGLConstants, EllipsoidTangentPlane, AxisAlignedBoundingBox, IntersectionTests, Plane, GeometryAttribute, GeometryAttributes, GeometryInstance, GeometryOffsetAttribute, GeometryPipeline, AttributeCompression, EncodedCartesian3, IndexDatatype, PolygonGeometryLibrary, arrayRemoveDuplicates, EllipsoidRhumbLine, PolygonPipeline) { 'use strict';

  function createPolygonOutlineGeometry(polygonGeometry, offset) {
    if (defined.defined(offset)) {
      polygonGeometry = PolygonOutlineGeometry.PolygonOutlineGeometry.unpack(polygonGeometry, offset);
    }
    polygonGeometry._ellipsoid = Cartesian2.Ellipsoid.clone(polygonGeometry._ellipsoid);
    return PolygonOutlineGeometry.PolygonOutlineGeometry.createGeometry(polygonGeometry);
  }

  return createPolygonOutlineGeometry;

}));
//# sourceMappingURL=createPolygonOutlineGeometry.js.map
