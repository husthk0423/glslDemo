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

define(['exports', './arrayRemoveDuplicates-1c85c3e7', './Cartesian3-5587e0cf', './Cartesian2-b941a975', './defined-a5305fd6', './Math-79d70b44', './PolylinePipeline-e6166610'], (function (exports, arrayRemoveDuplicates, Cartesian3, Cartesian2, defined, Math, PolylinePipeline) { 'use strict';

  /**
   * @private
   */
  const WallGeometryLibrary = {};

  function latLonEquals(c0, c1) {
    return (
      Math.CesiumMath.equalsEpsilon(c0.latitude, c1.latitude, Math.CesiumMath.EPSILON10) &&
      Math.CesiumMath.equalsEpsilon(c0.longitude, c1.longitude, Math.CesiumMath.EPSILON10)
    );
  }

  const scratchCartographic1 = new Cartesian2.Cartographic();
  const scratchCartographic2 = new Cartesian2.Cartographic();
  function removeDuplicates(ellipsoid, positions, topHeights, bottomHeights) {
    positions = arrayRemoveDuplicates.arrayRemoveDuplicates(positions, Cartesian3.Cartesian3.equalsEpsilon);

    const length = positions.length;
    if (length < 2) {
      return;
    }

    const hasBottomHeights = defined.defined(bottomHeights);
    const hasTopHeights = defined.defined(topHeights);

    const cleanedPositions = new Array(length);
    const cleanedTopHeights = new Array(length);
    const cleanedBottomHeights = new Array(length);

    const v0 = positions[0];
    cleanedPositions[0] = v0;

    const c0 = ellipsoid.cartesianToCartographic(v0, scratchCartographic1);
    if (hasTopHeights) {
      c0.height = topHeights[0];
    }

    cleanedTopHeights[0] = c0.height;

    if (hasBottomHeights) {
      cleanedBottomHeights[0] = bottomHeights[0];
    } else {
      cleanedBottomHeights[0] = 0.0;
    }

    const startTopHeight = cleanedTopHeights[0];
    const startBottomHeight = cleanedBottomHeights[0];
    let hasAllSameHeights = startTopHeight === startBottomHeight;

    let index = 1;
    for (let i = 1; i < length; ++i) {
      const v1 = positions[i];
      const c1 = ellipsoid.cartesianToCartographic(v1, scratchCartographic2);
      if (hasTopHeights) {
        c1.height = topHeights[i];
      }
      hasAllSameHeights = hasAllSameHeights && c1.height === 0;

      if (!latLonEquals(c0, c1)) {
        cleanedPositions[index] = v1; // Shallow copy!
        cleanedTopHeights[index] = c1.height;

        if (hasBottomHeights) {
          cleanedBottomHeights[index] = bottomHeights[i];
        } else {
          cleanedBottomHeights[index] = 0.0;
        }
        hasAllSameHeights =
          hasAllSameHeights &&
          cleanedTopHeights[index] === cleanedBottomHeights[index];

        Cartesian2.Cartographic.clone(c1, c0);
        ++index;
      } else if (c0.height < c1.height) {
        // two adjacent positions are the same, so use whichever has the greater height
        cleanedTopHeights[index - 1] = c1.height;
      }
    }

    if (hasAllSameHeights || index < 2) {
      return;
    }

    cleanedPositions.length = index;
    cleanedTopHeights.length = index;
    cleanedBottomHeights.length = index;

    return {
      positions: cleanedPositions,
      topHeights: cleanedTopHeights,
      bottomHeights: cleanedBottomHeights,
    };
  }

  const positionsArrayScratch = new Array(2);
  const heightsArrayScratch = new Array(2);
  const generateArcOptionsScratch = {
    positions: undefined,
    height: undefined,
    granularity: undefined,
    ellipsoid: undefined,
  };

  /**
   * @private
   */
  WallGeometryLibrary.computePositions = function (
    ellipsoid,
    wallPositions,
    maximumHeights,
    minimumHeights,
    granularity,
    duplicateCorners
  ) {
    const o = removeDuplicates(
      ellipsoid,
      wallPositions,
      maximumHeights,
      minimumHeights
    );

    if (!defined.defined(o)) {
      return;
    }

    wallPositions = o.positions;
    maximumHeights = o.topHeights;
    minimumHeights = o.bottomHeights;

    const length = wallPositions.length;
    const numCorners = length - 2;
    let topPositions;
    let bottomPositions;

    const minDistance = Math.CesiumMath.chordLength(
      granularity,
      ellipsoid.maximumRadius
    );

    const generateArcOptions = generateArcOptionsScratch;
    generateArcOptions.minDistance = minDistance;
    generateArcOptions.ellipsoid = ellipsoid;

    if (duplicateCorners) {
      let count = 0;
      let i;

      for (i = 0; i < length - 1; i++) {
        count +=
          PolylinePipeline.PolylinePipeline.numberOfPoints(
            wallPositions[i],
            wallPositions[i + 1],
            minDistance
          ) + 1;
      }

      topPositions = new Float64Array(count * 3);
      bottomPositions = new Float64Array(count * 3);

      const generateArcPositions = positionsArrayScratch;
      const generateArcHeights = heightsArrayScratch;
      generateArcOptions.positions = generateArcPositions;
      generateArcOptions.height = generateArcHeights;

      let offset = 0;
      for (i = 0; i < length - 1; i++) {
        generateArcPositions[0] = wallPositions[i];
        generateArcPositions[1] = wallPositions[i + 1];

        generateArcHeights[0] = maximumHeights[i];
        generateArcHeights[1] = maximumHeights[i + 1];

        const pos = PolylinePipeline.PolylinePipeline.generateArc(generateArcOptions);
        topPositions.set(pos, offset);

        generateArcHeights[0] = minimumHeights[i];
        generateArcHeights[1] = minimumHeights[i + 1];

        bottomPositions.set(
          PolylinePipeline.PolylinePipeline.generateArc(generateArcOptions),
          offset
        );

        offset += pos.length;
      }
    } else {
      generateArcOptions.positions = wallPositions;
      generateArcOptions.height = maximumHeights;
      topPositions = new Float64Array(
        PolylinePipeline.PolylinePipeline.generateArc(generateArcOptions)
      );

      generateArcOptions.height = minimumHeights;
      bottomPositions = new Float64Array(
        PolylinePipeline.PolylinePipeline.generateArc(generateArcOptions)
      );
    }

    return {
      bottomPositions: bottomPositions,
      topPositions: topPositions,
      numCorners: numCorners,
    };
  };
  var WallGeometryLibrary$1 = WallGeometryLibrary;

  exports.WallGeometryLibrary = WallGeometryLibrary$1;

}));
//# sourceMappingURL=WallGeometryLibrary-c6f598c7.js.map
