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

define(['./AttributeCompression-59630bdd', './Cartesian3-5587e0cf', './Cartesian2-b941a975', './combine-eceb7722', './IndexDatatype-be8e0e62', './Math-79d70b44', './createTaskProcessorWorker', './ComponentDatatype-4ab1a86a', './defined-a5305fd6', './Check-0f680516', './WebGLConstants-d81b330d', './Matrix2-81068516', './RuntimeError-8d8b6ef6'], (function (AttributeCompression, Cartesian3, Cartesian2, combine, IndexDatatype, Math$1, createTaskProcessorWorker, ComponentDatatype, defined, Check, WebGLConstants, Matrix2, RuntimeError) { 'use strict';

  const MAX_SHORT = 32767;
  const MITER_BREAK = Math.cos(Math$1.CesiumMath.toRadians(150.0));

  const scratchBVCartographic = new Cartesian2.Cartographic();
  const scratchEncodedPosition = new Cartesian3.Cartesian3();

  function decodePositions(
    uBuffer,
    vBuffer,
    heightBuffer,
    rectangle,
    minimumHeight,
    maximumHeight,
    ellipsoid
  ) {
    const positionsLength = uBuffer.length;
    const decodedPositions = new Float64Array(positionsLength * 3);
    for (let i = 0; i < positionsLength; ++i) {
      const u = uBuffer[i];
      const v = vBuffer[i];
      const h = heightBuffer[i];

      const lon = Math$1.CesiumMath.lerp(rectangle.west, rectangle.east, u / MAX_SHORT);
      const lat = Math$1.CesiumMath.lerp(
        rectangle.south,
        rectangle.north,
        v / MAX_SHORT
      );
      const alt = Math$1.CesiumMath.lerp(minimumHeight, maximumHeight, h / MAX_SHORT);

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
      Cartesian3.Cartesian3.pack(decodedPosition, decodedPositions, i * 3);
    }
    return decodedPositions;
  }

  function getPositionOffsets(counts) {
    const countsLength = counts.length;
    const positionOffsets = new Uint32Array(countsLength + 1);
    let offset = 0;
    for (let i = 0; i < countsLength; ++i) {
      positionOffsets[i] = offset;
      offset += counts[i];
    }
    positionOffsets[countsLength] = offset;
    return positionOffsets;
  }

  const previousCompressedCartographicScratch = new Cartesian2.Cartographic();
  const currentCompressedCartographicScratch = new Cartesian2.Cartographic();
  function removeDuplicates(uBuffer, vBuffer, heightBuffer, counts) {
    const countsLength = counts.length;
    const positionsLength = uBuffer.length;
    const markRemoval = new Uint8Array(positionsLength);
    const previous = previousCompressedCartographicScratch;
    const current = currentCompressedCartographicScratch;
    let offset = 0;
    for (let i = 0; i < countsLength; i++) {
      const count = counts[i];
      let updatedCount = count;
      for (let j = 1; j < count; j++) {
        const index = offset + j;
        const previousIndex = index - 1;
        current.longitude = uBuffer[index];
        current.latitude = vBuffer[index];
        previous.longitude = uBuffer[previousIndex];
        previous.latitude = vBuffer[previousIndex];

        if (Cartesian2.Cartographic.equals(current, previous)) {
          updatedCount--;
          markRemoval[previousIndex] = 1;
        }
      }
      counts[i] = updatedCount;
      offset += count;
    }

    let nextAvailableIndex = 0;
    for (let k = 0; k < positionsLength; k++) {
      if (markRemoval[k] !== 1) {
        uBuffer[nextAvailableIndex] = uBuffer[k];
        vBuffer[nextAvailableIndex] = vBuffer[k];
        heightBuffer[nextAvailableIndex] = heightBuffer[k];
        nextAvailableIndex++;
      }
    }
  }

  function VertexAttributesAndIndices(volumesCount) {
    const vertexCount = volumesCount * 8;
    const vec3Floats = vertexCount * 3;
    const vec4Floats = vertexCount * 4;
    this.startEllipsoidNormals = new Float32Array(vec3Floats);
    this.endEllipsoidNormals = new Float32Array(vec3Floats);
    this.startPositionAndHeights = new Float32Array(vec4Floats);
    this.startFaceNormalAndVertexCornerIds = new Float32Array(vec4Floats);
    this.endPositionAndHeights = new Float32Array(vec4Floats);
    this.endFaceNormalAndHalfWidths = new Float32Array(vec4Floats);
    this.vertexBatchIds = new Uint16Array(vertexCount);

    this.indices = IndexDatatype.IndexDatatype.createTypedArray(vertexCount, 36 * volumesCount);

    this.vec3Offset = 0;
    this.vec4Offset = 0;
    this.batchIdOffset = 0;
    this.indexOffset = 0;

    this.volumeStartIndex = 0;
  }

  const towardCurrScratch = new Cartesian3.Cartesian3();
  const towardNextScratch = new Cartesian3.Cartesian3();
  function computeMiteredNormal(
    previousPosition,
    position,
    nextPosition,
    ellipsoidSurfaceNormal,
    result
  ) {
    const towardNext = Cartesian3.Cartesian3.subtract(
      nextPosition,
      position,
      towardNextScratch
    );
    let towardCurr = Cartesian3.Cartesian3.subtract(
      position,
      previousPosition,
      towardCurrScratch
    );
    Cartesian3.Cartesian3.normalize(towardNext, towardNext);
    Cartesian3.Cartesian3.normalize(towardCurr, towardCurr);

    if (Cartesian3.Cartesian3.dot(towardNext, towardCurr) < MITER_BREAK) {
      towardCurr = Cartesian3.Cartesian3.multiplyByScalar(
        towardCurr,
        -1.0,
        towardCurrScratch
      );
    }

    Cartesian3.Cartesian3.add(towardNext, towardCurr, result);
    if (Cartesian3.Cartesian3.equals(result, Cartesian3.Cartesian3.ZERO)) {
      result = Cartesian3.Cartesian3.subtract(previousPosition, position);
    }

    // Make sure the normal is orthogonal to the ellipsoid surface normal
    Cartesian3.Cartesian3.cross(result, ellipsoidSurfaceNormal, result);
    Cartesian3.Cartesian3.cross(ellipsoidSurfaceNormal, result, result);
    Cartesian3.Cartesian3.normalize(result, result);
    return result;
  }

  // Winding order is reversed so each segment's volume is inside-out
  //          3-----------7
  //         /|   left   /|
  //        / | 1       / |
  //       2-----------6  5  end
  //       | /         | /
  // start |/  right   |/
  //       0-----------4
  //
  const REFERENCE_INDICES = [
    0,
    2,
    6,
    0,
    6,
    4, // right
    0,
    1,
    3,
    0,
    3,
    2, // start face
    0,
    4,
    5,
    0,
    5,
    1, // bottom
    5,
    3,
    1,
    5,
    7,
    3, // left
    7,
    5,
    4,
    7,
    4,
    6, // end face
    7,
    6,
    2,
    7,
    2,
    3, // top
  ];
  const REFERENCE_INDICES_LENGTH = REFERENCE_INDICES.length;

  const positionScratch = new Cartesian3.Cartesian3();
  const scratchStartEllipsoidNormal = new Cartesian3.Cartesian3();
  const scratchStartFaceNormal = new Cartesian3.Cartesian3();
  const scratchEndEllipsoidNormal = new Cartesian3.Cartesian3();
  const scratchEndFaceNormal = new Cartesian3.Cartesian3();
  VertexAttributesAndIndices.prototype.addVolume = function (
    preStartRTC,
    startRTC,
    endRTC,
    postEndRTC,
    startHeight,
    endHeight,
    halfWidth,
    batchId,
    center,
    ellipsoid
  ) {
    let position = Cartesian3.Cartesian3.add(startRTC, center, positionScratch);
    const startEllipsoidNormal = ellipsoid.geodeticSurfaceNormal(
      position,
      scratchStartEllipsoidNormal
    );
    position = Cartesian3.Cartesian3.add(endRTC, center, positionScratch);
    const endEllipsoidNormal = ellipsoid.geodeticSurfaceNormal(
      position,
      scratchEndEllipsoidNormal
    );

    const startFaceNormal = computeMiteredNormal(
      preStartRTC,
      startRTC,
      endRTC,
      startEllipsoidNormal,
      scratchStartFaceNormal
    );
    const endFaceNormal = computeMiteredNormal(
      postEndRTC,
      endRTC,
      startRTC,
      endEllipsoidNormal,
      scratchEndFaceNormal
    );

    const startEllipsoidNormals = this.startEllipsoidNormals;
    const endEllipsoidNormals = this.endEllipsoidNormals;
    const startPositionAndHeights = this.startPositionAndHeights;
    const startFaceNormalAndVertexCornerIds = this
      .startFaceNormalAndVertexCornerIds;
    const endPositionAndHeights = this.endPositionAndHeights;
    const endFaceNormalAndHalfWidths = this.endFaceNormalAndHalfWidths;
    const vertexBatchIds = this.vertexBatchIds;

    let batchIdOffset = this.batchIdOffset;
    let vec3Offset = this.vec3Offset;
    let vec4Offset = this.vec4Offset;

    let i;
    for (i = 0; i < 8; i++) {
      Cartesian3.Cartesian3.pack(startEllipsoidNormal, startEllipsoidNormals, vec3Offset);
      Cartesian3.Cartesian3.pack(endEllipsoidNormal, endEllipsoidNormals, vec3Offset);

      Cartesian3.Cartesian3.pack(startRTC, startPositionAndHeights, vec4Offset);
      startPositionAndHeights[vec4Offset + 3] = startHeight;

      Cartesian3.Cartesian3.pack(endRTC, endPositionAndHeights, vec4Offset);
      endPositionAndHeights[vec4Offset + 3] = endHeight;

      Cartesian3.Cartesian3.pack(
        startFaceNormal,
        startFaceNormalAndVertexCornerIds,
        vec4Offset
      );
      startFaceNormalAndVertexCornerIds[vec4Offset + 3] = i;

      Cartesian3.Cartesian3.pack(endFaceNormal, endFaceNormalAndHalfWidths, vec4Offset);
      endFaceNormalAndHalfWidths[vec4Offset + 3] = halfWidth;

      vertexBatchIds[batchIdOffset++] = batchId;

      vec3Offset += 3;
      vec4Offset += 4;
    }

    this.batchIdOffset = batchIdOffset;
    this.vec3Offset = vec3Offset;
    this.vec4Offset = vec4Offset;
    const indices = this.indices;
    const volumeStartIndex = this.volumeStartIndex;

    const indexOffset = this.indexOffset;
    for (i = 0; i < REFERENCE_INDICES_LENGTH; i++) {
      indices[indexOffset + i] = REFERENCE_INDICES[i] + volumeStartIndex;
    }

    this.volumeStartIndex += 8;
    this.indexOffset += REFERENCE_INDICES_LENGTH;
  };

  const scratchRectangle = new Cartesian2.Rectangle();
  const scratchEllipsoid = new Cartesian2.Ellipsoid();
  const scratchCenter = new Cartesian3.Cartesian3();

  const scratchPrev = new Cartesian3.Cartesian3();
  const scratchP0 = new Cartesian3.Cartesian3();
  const scratchP1 = new Cartesian3.Cartesian3();
  const scratchNext = new Cartesian3.Cartesian3();
  function createVectorTileClampedPolylines(parameters, transferableObjects) {
    const encodedPositions = new Uint16Array(parameters.positions);
    const widths = new Uint16Array(parameters.widths);
    const counts = new Uint32Array(parameters.counts);
    const batchIds = new Uint16Array(parameters.batchIds);

    // Unpack tile decoding parameters
    const rectangle = scratchRectangle;
    const ellipsoid = scratchEllipsoid;
    const center = scratchCenter;
    const packedBuffer = new Float64Array(parameters.packedBuffer);

    let offset = 0;
    const minimumHeight = packedBuffer[offset++];
    const maximumHeight = packedBuffer[offset++];

    Cartesian2.Rectangle.unpack(packedBuffer, offset, rectangle);
    offset += Cartesian2.Rectangle.packedLength;

    Cartesian2.Ellipsoid.unpack(packedBuffer, offset, ellipsoid);
    offset += Cartesian2.Ellipsoid.packedLength;

    Cartesian3.Cartesian3.unpack(packedBuffer, offset, center);

    let i;

    // Unpack positions and generate volumes
    let positionsLength = encodedPositions.length / 3;
    const uBuffer = encodedPositions.subarray(0, positionsLength);
    const vBuffer = encodedPositions.subarray(
      positionsLength,
      2 * positionsLength
    );
    const heightBuffer = encodedPositions.subarray(
      2 * positionsLength,
      3 * positionsLength
    );
    AttributeCompression.AttributeCompression.zigZagDeltaDecode(uBuffer, vBuffer, heightBuffer);

    removeDuplicates(uBuffer, vBuffer, heightBuffer, counts);

    // Figure out how many volumes and how many vertices there will be.
    const countsLength = counts.length;
    let volumesCount = 0;
    for (i = 0; i < countsLength; i++) {
      const polylinePositionCount = counts[i];
      volumesCount += polylinePositionCount - 1;
    }

    const attribsAndIndices = new VertexAttributesAndIndices(volumesCount);

    const positions = decodePositions(
      uBuffer,
      vBuffer,
      heightBuffer,
      rectangle,
      minimumHeight,
      maximumHeight,
      ellipsoid);

    positionsLength = uBuffer.length;
    const positionsRTC = new Float32Array(positionsLength * 3);
    for (i = 0; i < positionsLength; ++i) {
      positionsRTC[i * 3] = positions[i * 3] - center.x;
      positionsRTC[i * 3 + 1] = positions[i * 3 + 1] - center.y;
      positionsRTC[i * 3 + 2] = positions[i * 3 + 2] - center.z;
    }

    let currentPositionIndex = 0;
    let currentHeightIndex = 0;
    for (i = 0; i < countsLength; i++) {
      const polylineVolumeCount = counts[i] - 1;
      const halfWidth = widths[i] * 0.5;
      const batchId = batchIds[i];
      const volumeFirstPositionIndex = currentPositionIndex;
      for (let j = 0; j < polylineVolumeCount; j++) {
        const volumeStart = Cartesian3.Cartesian3.unpack(
          positionsRTC,
          currentPositionIndex,
          scratchP0
        );
        const volumeEnd = Cartesian3.Cartesian3.unpack(
          positionsRTC,
          currentPositionIndex + 3,
          scratchP1
        );

        let startHeight = heightBuffer[currentHeightIndex];
        let endHeight = heightBuffer[currentHeightIndex + 1];
        startHeight = Math$1.CesiumMath.lerp(
          minimumHeight,
          maximumHeight,
          startHeight / MAX_SHORT
        );
        endHeight = Math$1.CesiumMath.lerp(
          minimumHeight,
          maximumHeight,
          endHeight / MAX_SHORT
        );

        currentHeightIndex++;

        let preStart = scratchPrev;
        let postEnd = scratchNext;
        if (j === 0) {
          // Check if this volume is like a loop
          const finalPositionIndex =
            volumeFirstPositionIndex + polylineVolumeCount * 3;
          const finalPosition = Cartesian3.Cartesian3.unpack(
            positionsRTC,
            finalPositionIndex,
            scratchPrev
          );
          if (Cartesian3.Cartesian3.equals(finalPosition, volumeStart)) {
            Cartesian3.Cartesian3.unpack(positionsRTC, finalPositionIndex - 3, preStart);
          } else {
            const offsetPastStart = Cartesian3.Cartesian3.subtract(
              volumeStart,
              volumeEnd,
              scratchPrev
            );
            preStart = Cartesian3.Cartesian3.add(offsetPastStart, volumeStart, scratchPrev);
          }
        } else {
          Cartesian3.Cartesian3.unpack(positionsRTC, currentPositionIndex - 3, preStart);
        }

        if (j === polylineVolumeCount - 1) {
          // Check if this volume is like a loop
          const firstPosition = Cartesian3.Cartesian3.unpack(
            positionsRTC,
            volumeFirstPositionIndex,
            scratchNext
          );
          if (Cartesian3.Cartesian3.equals(firstPosition, volumeEnd)) {
            Cartesian3.Cartesian3.unpack(
              positionsRTC,
              volumeFirstPositionIndex + 3,
              postEnd
            );
          } else {
            const offsetPastEnd = Cartesian3.Cartesian3.subtract(
              volumeEnd,
              volumeStart,
              scratchNext
            );
            postEnd = Cartesian3.Cartesian3.add(offsetPastEnd, volumeEnd, scratchNext);
          }
        } else {
          Cartesian3.Cartesian3.unpack(positionsRTC, currentPositionIndex + 6, postEnd);
        }

        attribsAndIndices.addVolume(
          preStart,
          volumeStart,
          volumeEnd,
          postEnd,
          startHeight,
          endHeight,
          halfWidth,
          batchId,
          center,
          ellipsoid
        );

        currentPositionIndex += 3;
      }
      currentPositionIndex += 3;
      currentHeightIndex++;
    }

    const indices = attribsAndIndices.indices;

    transferableObjects.push(attribsAndIndices.startEllipsoidNormals.buffer);
    transferableObjects.push(attribsAndIndices.endEllipsoidNormals.buffer);
    transferableObjects.push(attribsAndIndices.startPositionAndHeights.buffer);
    transferableObjects.push(
      attribsAndIndices.startFaceNormalAndVertexCornerIds.buffer
    );
    transferableObjects.push(attribsAndIndices.endPositionAndHeights.buffer);
    transferableObjects.push(attribsAndIndices.endFaceNormalAndHalfWidths.buffer);
    transferableObjects.push(attribsAndIndices.vertexBatchIds.buffer);
    transferableObjects.push(indices.buffer);

    let results = {
      indexDatatype:
        indices.BYTES_PER_ELEMENT === 2
          ? IndexDatatype.IndexDatatype.UNSIGNED_SHORT
          : IndexDatatype.IndexDatatype.UNSIGNED_INT,
      startEllipsoidNormals: attribsAndIndices.startEllipsoidNormals.buffer,
      endEllipsoidNormals: attribsAndIndices.endEllipsoidNormals.buffer,
      startPositionAndHeights: attribsAndIndices.startPositionAndHeights.buffer,
      startFaceNormalAndVertexCornerIds:
        attribsAndIndices.startFaceNormalAndVertexCornerIds.buffer,
      endPositionAndHeights: attribsAndIndices.endPositionAndHeights.buffer,
      endFaceNormalAndHalfWidths:
        attribsAndIndices.endFaceNormalAndHalfWidths.buffer,
      vertexBatchIds: attribsAndIndices.vertexBatchIds.buffer,
      indices: indices.buffer,
    };

    if (parameters.keepDecodedPositions) {
      const positionOffsets = getPositionOffsets(counts);
      transferableObjects.push(positions.buffer, positionOffsets.buffer);
      results = combine.combine(results, {
        decodedPositions: positions.buffer,
        decodedPositionOffsets: positionOffsets.buffer,
      });
    }

    return results;
  }
  var createVectorTileClampedPolylines$1 = createTaskProcessorWorker(createVectorTileClampedPolylines);

  return createVectorTileClampedPolylines$1;

}));
//# sourceMappingURL=createVectorTileClampedPolylines.js.map
