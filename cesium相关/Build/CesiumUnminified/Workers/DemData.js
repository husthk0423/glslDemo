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

    // @flow
    // DEMData is a data structure for decoding, backfilling, and storing elevation data for processing in the hillshade shaders
    // data can be populated either from a pngraw image tile or from serliazed data sent back from a worker. When data is initially
    // loaded from a image tile, we decode the pixel values using the appropriate decoding formula, but we store the
    // elevation data as an Int32 value. we add 65536 (2^16) to eliminate negative values and enable the use of
    // integer overflow when creating the texture used in the hillshadePrepare step.

    // DEMData also handles the backfilling of data from a tile's neighboring tiles. This is necessary because we use a pixel's 8
    // surrounding pixel values to compute the slope at that pixel, and we cannot accurately calculate the slope at pixels on a
    // tile's edge without backfilling from neighboring tiles.

    class DEMData {
        // data: Int32Array;
        // stride: number;
        // dim: number;

        constructor( data, encoding) {
            if (data.height !== data.width) throw new RangeError('DEM tiles must be square');
            if (encoding && encoding !== "mapbox" && encoding !== "terrarium") return console.log(
                `"${encoding}" is not a valid encoding type. Valid types include "mapbox" and "terrarium".`
            );
            const dim = this.dim = data.height;
            this.stride = this.dim + 2;
            this.data = new Int32Array(this.stride * this.stride);
            // this.data = new Int32Array(512 * 512);

            const pixels = data.data;
            const unpack = encoding === "terrarium" ? this._unpackTerrarium : this._unpackMapbox;
            for (let y = 0; y < dim; y++) {
                for (let x = 0; x < dim; x++) {
                    const i = y * dim + x;
                    const j = i * 4;
                    this.set(x, y, unpack(pixels[j], pixels[j + 1], pixels[j + 2]));
                }
            }

            // in order to avoid flashing seams between tiles, here we are initially populating a 1px border of pixels around the image
            // with the data of the nearest pixel from the image. this data is eventually replaced when the tile's neighboring
            // tiles are loaded and the accurate data can be backfilled using DEMData#backfillBorder
            for (let x = 0; x < dim; x++) {
                // left vertical border
                this.set(-1, x, this.get(0, x));
                // right vertical border
                this.set(dim, x, this.get(dim - 1, x));
                // left horizontal border
                this.set(x, -1, this.get(x, 0));
                // right horizontal border
                this.set(x, dim, this.get(x, dim - 1));
            }
            // corners
            this.set(-1, -1, this.get(0, 0));
            this.set(dim, -1, this.get(dim - 1, 0));
            this.set(-1, dim, this.get(0, dim - 1));
            this.set(dim, dim, this.get(dim - 1, dim - 1));

        }

        set(x, y, value) {
            // this.data[this._idx(x, y)] = value ;
            this.data[this._idx(x, y)] = value + 65536;
        }

        get(x, y) {
            // return this.data[this._idx(x, y)];
            return this.data[this._idx(x, y)] - 65536;
        }

        _idx(x, y) {
            if (x < -1 || x >= this.dim + 1 ||  y < -1 || y >= this.dim + 1) throw new RangeError('out of range source coordinates for DEM data');
            // return y  * this.dim + x ;
            return (y + 1) * this.stride + (x + 1);
        }

        _unpackMapbox(r, g, b) {
            // unpacking formula for mapbox.terrain-rgb:
            // https://www.mapbox.com/help/access-elevation-data/#mapbox-terrain-rgb
            return ((r * 256 * 256 + g * 256.0 + b) / 10.0 - 10000.0);
        }

        _unpackTerrarium(r, g, b) {
            // unpacking formula for mapzen terrarium:
            // https://aws.amazon.com/public-datasets/terrain/
            return ((r * 256 + g + b / 256) - 32768.0);
        }

        getPixels() {
            // return new RGBAImage({width: this.stride, height: this.stride}, new Uint8Array(this.data.buffer));
        }

        backfillBorder(borderTile, dx, dy) {
            if (this.dim !== borderTile.dim) throw new Error('dem dimension mismatch');

            let xMin = dx * this.dim,
                xMax = dx * this.dim + this.dim,
                yMin = dy * this.dim,
                yMax = dy * this.dim + this.dim;

            switch (dx) {
            case -1:
                xMin = xMax - 1;
                break;
            case 1:
                xMax = xMin + 1;
                break;
            }

            switch (dy) {
            case -1:
                yMin = yMax - 1;
                break;
            case 1:
                yMax = yMin + 1;
                break;
            }

            const ox = -dx * this.dim;
            const oy = -dy * this.dim;
            for (let y = yMin; y < yMax; y++) {
                for (let x = xMin; x < xMax; x++) {
                    this.set(x, y, borderTile.get(x + ox, y + oy));
                }
            }
        }
    }

    return DEMData;

}));
//# sourceMappingURL=DemData.js.map
