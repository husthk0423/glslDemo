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

define(['./AttributeCompression-59630bdd', './Cartesian3-5587e0cf', './Cartesian2-b941a975', './Math-79d70b44', './createTaskProcessorWorker', './ComponentDatatype-4ab1a86a', './defined-a5305fd6', './Check-0f680516', './WebGLConstants-d81b330d', './Matrix2-81068516', './RuntimeError-8d8b6ef6'], (function (AttributeCompression, Cartesian3, Cartesian2, Math, createTaskProcessorWorker, ComponentDatatype, defined, Check, WebGLConstants, Matrix2, RuntimeError) { 'use strict';

  const maxShort = 32767;

  const scratchBVCartographic = new Cartesian2.Cartographic();
  const scratchEncodedPosition = new Cartesian3.Cartesian3();

  const scratchRectangle = new Cartesian2.Rectangle();
  const scratchEllipsoid = new Cartesian2.Ellipsoid();
  const scratchMinMaxHeights = {
    min: undefined,
    max: undefined,
  };

  function unpackBuffer(packedBuffer) {
    packedBuffer = new Float64Array(packedBuffer);

    let offset = 0;
    scratchMinMaxHeights.min = packedBuffer[offset++];
    scratchMinMaxHeights.max = packedBuffer[offset++];

    Cartesian2.Rectangle.unpack(packedBuffer, offset, scratchRectangle);
    offset += Cartesian2.Rectangle.packedLength;

    Cartesian2.Ellipsoid.unpack(packedBuffer, offset, scratchEllipsoid);
  }

  function createVectorTilePoints(parameters, transferableObjects) {
    const positions = new Uint16Array(parameters.positions);

    unpackBuffer(parameters.packedBuffer);
    const rectangle = scratchRectangle;
    const ellipsoid = scratchEllipsoid;
    const minimumHeight = scratchMinMaxHeights.min;
    const maximumHeight = scratchMinMaxHeights.max;

    const positionsLength = positions.length / 3;
    const uBuffer = positions.subarray(0, positionsLength);
    const vBuffer = positions.subarray(positionsLength, 2 * positionsLength);
    const heightBuffer = positions.subarray(
      2 * positionsLength,
      3 * positionsLength
    );
    AttributeCompression.AttributeCompression.zigZagDeltaDecode(uBuffer, vBuffer, heightBuffer);

    const decoded = new Float64Array(positions.length);
    for (let i = 0; i < positionsLength; ++i) {
      const u = uBuffer[i];
      const v = vBuffer[i];
      const h = heightBuffer[i];

      const lon = Math.CesiumMath.lerp(rectangle.west, rectangle.east, u / maxShort);
      const lat = Math.CesiumMath.lerp(rectangle.south, rectangle.north, v / maxShort);
      const alt = Math.CesiumMath.lerp(minimumHeight, maximumHeight, h / maxShort);

      const cartographic = Cartesian2.Cartographic.fromRadians(
        lon,
        lat,
        alt,
        scratchBVCartographic
      );
      const decodedPosition = ellipsoid.cartographicToCartesian(
        cartographic,
        scratchEncodedPosition
      );
      Cartesian3.Cartesian3.pack(decodedPosition, decoded, i * 3);
    }

    transferableObjects.push(decoded.buffer);

    return {
      positions: decoded.buffer,
    };
  }
  var createVectorTilePoints$1 = createTaskProcessorWorker(createVectorTilePoints);

  return createVectorTilePoints$1;

}));
//# sourceMappingURL=createVectorTilePoints.js.map
