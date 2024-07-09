/** @license
 *
 *  Copyright (C) 2012 K. Arthur Endsley (kaendsle@mtu.edu)
 *  Michigan Tech Research Institute (MTRI)
 *  3600 Green Court, Suite 100, Ann Arbor, MI, 48105
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

(function (root, factory) {

    if (typeof define === "function" && define.amd) {
        // AMD (+ global for extensions)
        define(function () {
            return factory();
        });
    } else if (typeof module !== 'undefined' && typeof exports === "object") {
        // CommonJS
        module.exports = factory();
    } else {
        // Browser
        root.Wkt = factory();
    }
}(this, function () {


    var beginsWith, endsWith, root, Wkt;

    // Establish the root object, window in the browser, or exports on the server
    root = this;

    /**
     * @desc The Wkt namespace.
     * @property    {String}    delimiter   - The default delimiter for separating components of atomic geometry (coordinates)
     * @namespace
     * @global
     */
    Wkt = function (obj) {
        if (obj instanceof Wkt) return obj;
        if (!(this instanceof Wkt)) return new Wkt(obj);
        this._wrapped = obj;
    };



    /**
     * Returns true if the substring is found at the beginning of the string.
     * @param   str {String}    The String to search
     * @param   sub {String}    The substring of interest
     * @return      {Boolean}
     * @private
     */
    beginsWith = function (str, sub) {
        return str.substring(0, sub.length) === sub;
    };

    /**
     * Returns true if the substring is found at the end of the string.
     * @param   str {String}    The String to search
     * @param   sub {String}    The substring of interest
     * @return      {Boolean}
     * @private
     */
    endsWith = function (str, sub) {
        return str.substring(str.length - sub.length) === sub;
    };


    /**
     * Removes given character String(s) from a String.
     * @param   str {String}    The String to search
     * @param   sub {String}    The String character(s) to trim
     * @return      {String}    The trimmed string
     * @member Wkt.trim
     * @method
     */
    Wkt.trim = function (str, sub) {
        sub = sub || ' '; // Defaults to trimming spaces
        // Trim beginning spaces
        while (beginsWith(str, sub)) {
            str = str.substring(1);
        }
        // Trim ending spaces
        while (endsWith(str, sub)) {
            str = str.substring(0, str.length - 1);
        }
        return str;
    };

    /**
     * An object for reading WKT strings and writing geographic features
     * @constructor this.Wkt.Wkt
     * @param   initializer {String}    An optional WKT string for immediate read
     * @property            {Array}     components      - Holder for atomic geometry objects (internal representation of geometric components)
     * @property            {String}    delimiter       - The default delimiter for separating components of atomic geometry (coordinates)
     * @property            {Object}    regExes         - Some regular expressions copied from OpenLayers.Format.WKT.js
     * @property            {String}    type            - The Well-Known Text name (e.g. 'point') of the geometry
     * @property            {Boolean}   wrapVerticies   - True to wrap vertices in MULTIPOINT geometries; If true: MULTIPOINT((30 10),(10 30),(40 40)); If false: MULTIPOINT(30 10,10 30,40 40)
     * @return              {this.Wkt.Wkt}
     * @memberof Wkt
     */
    Wkt.Wkt = function (initializer) {

        /**
         * The default delimiter between X and Y coordinates.
         * @ignore
         */
        // this.delimiter = Wkt.delimiter || ' ';

        /**
         * Configuration parameter for controlling how Wicket seralizes
         * MULTIPOINT strings. Examples; both are valid WKT:
         * If true: MULTIPOINT((30 10),(10 30),(40 40))
         * If false: MULTIPOINT(30 10,10 30,40 40)
         * @ignore
         */
        // this.wrapVertices = true;

        /**
         * Some regular expressions copied from OpenLayers.Format.WKT.js
         * @ignore
         */
        this.regExes = {
            'typeStr': /^\s*(\w+)\s*\(\s*(.*)\s*\)\s*$/,
            'spaces': /\s+|\+/, // Matches the '+' or the empty space
            'numeric': /-*\d+(\.*\d+)?/,
            'comma': /\s*,\s*/,
            'parenComma': /\)\s*,\s*\(/,
            'coord': /-*\d+\.*\d+ -*\d+\.*\d+/, // e.g. "24 -14"
            'doubleParenComma': /\)\s*\)\s*,\s*\(\s*\(/,
            'ogcTypes': /^(multi)?(point|line|polygon|box)?(string)?$/i, // Captures e.g. "Multi","Line","String"
            'crudeJson': /^{.*"(type|coordinates|geometries|features)":.*}$/ // Attempts to recognize JSON strings
        };

        /**
         * Strip any whitespace and parens from front and back.
         * This is the equivalent of s/^\s*\(?(.*)\)?\s*$/$1/ but without the risk of catastrophic backtracking.
         * @param   str {String}
         */
        this._stripWhitespaceAndParens = function (fullStr) {
            var trimmed = fullStr.trim();
            var noParens = trimmed.replace(/^\(?(.*?)\)?$/, '$1');
            return noParens;
        };

        /**
         * The internal representation of geometry--the "components" of geometry.
         * @ignore
         */
        this.components = undefined;

        // An initial WKT string may be provided
        if (initializer && typeof initializer === 'string') {
            this.read(initializer);
        } else if (initializer && typeof initializer !== undefined) {
            this.fromObject(initializer);
        }

    };




    /**
     * Reads a WKT string, validating and incorporating it.
     * @param   str {String}    A WKT or GeoJSON string
     * @return	{this.Wkt.Wkt}	The object itself
     * @memberof this.Wkt.Wkt
     * @method
     */
    Wkt.Wkt.prototype.read = function (str) {
        var matches;
        matches = this.regExes.typeStr.exec(str);
        if (matches) {
            this.type = matches[1].toLowerCase();
            this.base = matches[2];
            if (this.ingest[this.type]) {
                this.components = this.ingest[this.type].apply(this, [this.base]);
            }
        }
        return this;
    }; // eo readWkt

    /**
     * This object contains functions as property names that ingest WKT
     * strings into the internal representation.
     * @memberof this.Wkt.Wkt
     * @namespace this.Wkt.Wkt.ingest
     * @instance
     */
    Wkt.Wkt.prototype.ingest = {

        /**
         * Return point feature given a point WKT fragment.
         * @param   str {String}    A WKT fragment representing the point
         * @memberof this.Wkt.Wkt.ingest
         * @instance
         */
        point: function (str) {
            var coords = Wkt.trim(str).split(this.regExes.spaces);
            // In case a parenthetical group of coordinates is passed...
            return [{ // ...Search for numeric substrings
                x: parseFloat(this.regExes.numeric.exec(coords[0])[0]),
                y: parseFloat(this.regExes.numeric.exec(coords[1])[0])
            }];
        },

        /**
         * Return a multipoint feature given a multipoint WKT fragment.
         * @param   str {String}    A WKT fragment representing the multipoint
         * @memberof this.Wkt.Wkt.ingest
         * @instance
         */
        multipoint: function (str) {
            var i, components, points;
            components = [];
            points = Wkt.trim(str).split(this.regExes.comma);
            for (i = 0; i < points.length; i += 1) {
                components.push(this.ingest.point.apply(this, [points[i]]));
            }
            return components;
        },

        /**
         * Return a linestring feature given a linestring WKT fragment.
         * @param   str {String}    A WKT fragment representing the linestring
         * @memberof this.Wkt.Wkt.ingest
         * @instance
         */
        linestring: function (str) {
            var i, multipoints, components;

            // In our x-and-y representation of components, parsing
            //  multipoints is the same as parsing linestrings
            multipoints = this.ingest.multipoint.apply(this, [str]);

            // However, the points need to be joined
            components = [];
            for (i = 0; i < multipoints.length; i += 1) {
                components = components.concat(multipoints[i]);
            }
            return components;
        },

        /**
         * Return a multilinestring feature given a multilinestring WKT fragment.
         * @param   str {String}    A WKT fragment representing the multilinestring
         * @memberof this.Wkt.Wkt.ingest
         * @instance
         */
        multilinestring: function (str) {
            var i, components, line, lines;
            components = [];

            lines = Wkt.trim(str).split(this.regExes.doubleParenComma);
            if (lines.length === 1) { // If that didn't work...
                lines = Wkt.trim(str).split(this.regExes.parenComma);
            }

            for (i = 0; i < lines.length; i += 1) {
                line = this._stripWhitespaceAndParens(lines[i]);
                components.push(this.ingest.linestring.apply(this, [line]));
            }

            return components;
        },

        /**
         * Return a polygon feature given a polygon WKT fragment.
         * @param   str {String}    A WKT fragment representing the polygon
         * @memberof this.Wkt.Wkt.ingest
         * @instance
         */
        polygon: function (str) {
            var i, j, components, subcomponents, ring, rings;
            rings = Wkt.trim(str).split(this.regExes.parenComma);
            components = []; // Holds one or more rings
            for (i = 0; i < rings.length; i += 1) {
                ring = this._stripWhitespaceAndParens(rings[i]).split(this.regExes.comma);
                subcomponents = []; // Holds the outer ring and any inner rings (holes)
                for (j = 0; j < ring.length; j += 1) {
                    // Split on the empty space or '+' character (between coordinates)
                    var split = ring[j].split(this.regExes.spaces);
                    if (split.length > 2) {
                        //remove the elements which are blanks
                        split = split.filter(function (n) {
                            return n != ""
                        });
                    }
                    if (split.length === 2) {
                        var x_cord = split[0];
                        var y_cord = split[1];

                        //now push
                        subcomponents.push({
                            x: parseFloat(x_cord),
                            y: parseFloat(y_cord)
                        });
                    }
                }
                components.push(subcomponents);
            }
            return components;
        },

        /**
         * Return box vertices (which would become the Rectangle bounds) given a Box WKT fragment.
         * @param   str {String}    A WKT fragment representing the box
         * @memberof this.Wkt.Wkt.ingest
         * @instance
         */
        box: function (str) {
            var i, multipoints, components;

            // In our x-and-y representation of components, parsing
            //  multipoints is the same as parsing linestrings
            multipoints = this.ingest.multipoint.apply(this, [str]);

            // However, the points need to be joined
            components = [];
            for (i = 0; i < multipoints.length; i += 1) {
                components = components.concat(multipoints[i]);
            }

            return components;
        },

        /**
         * Return a multipolygon feature given a multipolygon WKT fragment.
         * @param   str {String}    A WKT fragment representing the multipolygon
         * @memberof this.Wkt.Wkt.ingest
         * @instance
         */
        multipolygon: function (str) {
            var i, components, polygon, polygons;
            components = [];
            polygons = Wkt.trim(str).split(this.regExes.doubleParenComma);
            for (i = 0; i < polygons.length; i += 1) {
                polygon = this._stripWhitespaceAndParens(polygons[i]);
                components.push(this.ingest.polygon.apply(this, [polygon]));
            }
            return components;
        }

    }; // eo ingest

    return Wkt;
}));