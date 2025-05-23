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

define(['exports'], (function (exports) { 'use strict';

    // @flow
    class SegmentVector {
        constructor(segments) {
            if(segments){
                this.segments = segments;
            }else {
                this.segments = [];
            }
        }

        prepareSegment(numVertices, layoutVertexArray, indexArray, sortKey) {
            let segment = this.segments[this.segments.length - 1];
            if (numVertices > SegmentVector.MAX_VERTEX_ARRAY_LENGTH) console.log(`Max vertices per segment is ${SegmentVector.MAX_VERTEX_ARRAY_LENGTH}: bucket requested ${numVertices}`);
            if (!segment || segment.vertexLength + numVertices > SegmentVector.MAX_VERTEX_ARRAY_LENGTH || segment.sortKey !== sortKey) {
                segment = ({
                    vertexOffset: layoutVertexArray.length,
                    primitiveOffset: indexArray.length,
                    vertexLength: 0,
                    primitiveLength: 0
                });
                if (sortKey !== undefined) segment.sortKey = sortKey;
                this.segments.push(segment);
            }
            return segment;
        }

        get() {
            return this.segments;
        }

        destroy() {
            for (const segment of this.segments) {
                // for (const k in segment.vaos) {
                //     segment.vaos[k].destroy();
                // }
                if(segment.vao){
                    segment.vao.destroy();
                }
            }
        }

        static simpleSegment(vertexOffset, primitiveOffset, vertexLength, primitiveLength){
            return new SegmentVector([{
                vertexOffset,
                primitiveOffset,
                vertexLength,
                primitiveLength,
                // vaos: {},
                sortKey: 0
            }]);
        }
    }

    /*
     * The maximum size of a vertex array. This limit is imposed by WebGL's 16 bit
     * addressing of vertex buffers.
     * @private
     * @readonly
     */
    SegmentVector.MAX_VERTEX_ARRAY_LENGTH = Math.pow(2, 16) - 1;

    var SegmentVector$1 = SegmentVector;

    /**
     * The `Bucket` class is the single point of knowledge about turning vector
     * tiles into WebGL buffers.
     *
     * `Bucket` is an abstract class. A subclass exists for each style layer type.
     * Create a bucket via the `StyleLayer#createBucket` method.
     *
     * The concrete bucket types, using layout options from the style layer,
     * transform feature geometries into vertex and element data for use by the
     * vertex shader.  They also (via `ProgramConfiguration`) use feature
     * properties and the zoom level to populate the attributes needed for
     * data-driven styling.
     *
     * Buckets are designed to be built on a worker thread and then serialized and
     * transferred back to the main thread for rendering.  On the worker side, a
     * bucket's vertex, element, and attribute data is stored in `bucket.arrays:
     * ArrayGroup`.  When a bucket's data is serialized and sent back to the main
     * thread, is gets deserialized (using `new Bucket(serializedBucketData)`, with
     * the array data now stored in `bucket.buffers: BufferGroup`.  BufferGroups
     * hold the same data as ArrayGroups, but are tuned for consumption by WebGL.
     *
     * @private
     */
    class Bucket {
        /**
         * @param options
         * @param {number} options.zoom Zoom level of the buffers being built. May be
         *     a fractional zoom level.
         * @param options.layer A Mapbox style layer object
         * @param {Object.<string, Buffer>} options.buffers The set of `Buffer`s being
         *     built for this tile. This object facilitates sharing of `Buffer`s be
               between `Bucket`s.
         */
        constructor (options) {
            this.style= options.style;
            this.type = options.type;
            this.tileSize = options.tileSize;
        }


        serialize(transferables) {

        }

        /**
         * Release the WebGL resources associated with the buffers. Note that because
         * buckets are shared between layers having the same layout properties, they
         * must be destroyed in groups (all buckets for a tile, or all symbol buckets).
         *
         * @private
         */
        destroy() {
        }
    }

    var Bucket$1 = Bucket;

    function quickselect(arr, k, left, right, compare) {
        quickselectStep(arr, k, left || 0, right || (arr.length - 1), compare || defaultCompare);
    }
    function quickselectStep(arr, k, left, right, compare) {

        while (right > left) {
            if (right - left > 600) {
                var n = right - left + 1;
                var m = k - left + 1;
                var z = Math.log(n);
                var s = 0.5 * Math.exp(2 * z / 3);
                var sd = 0.5 * Math.sqrt(z * s * (n - s) / n) * (m - n / 2 < 0 ? -1 : 1);
                var newLeft = Math.max(left, Math.floor(k - m * s / n + sd));
                var newRight = Math.min(right, Math.floor(k + (n - m) * s / n + sd));
                quickselectStep(arr, k, newLeft, newRight, compare);
            }

            var t = arr[k];
            var i = left;
            var j = right;

            swap(arr, left, k);
            if (compare(arr[right], t) > 0) swap(arr, left, right);

            while (i < j) {
                swap(arr, i, j);
                i++;
                j--;
                while (compare(arr[i], t) < 0) i++;
                while (compare(arr[j], t) > 0) j--;
            }

            if (compare(arr[left], t) === 0) swap(arr, left, j);
            else {
                j++;
                swap(arr, j, right);
            }

            if (j <= k) left = j + 1;
            if (k <= j) right = j - 1;
        }
    }

    function swap(arr, i, j) {
        var tmp = arr[i];
        arr[i] = arr[j];
        arr[j] = tmp;
    }

    function defaultCompare(a, b) {
        return a < b ? -1 : a > b ? 1 : 0;
    }

    // classifies an array of rings into polygons with outer rings and holes

     function calculateSignedArea(ring){
        let sum = 0;
        for (let i = 0, len = ring.length, j = len - 1, p1, p2; i < len; j = i++) {
            p1 = ring[i];
            p2 = ring[j];
            sum += (p2.x - p1.x) * (p1.y + p2.y);
        }
        return sum;
    }
    function classifyRings(rings, maxRings) {
        const len = rings.length;

        if (len <= 0) return [];

        const polygons = [];
        let polygon =[];
            // ccw;

        for (let i = 0; i < len; i++) {
            const area = calculateSignedArea(rings[i]);
            if (area === 0) continue;

            rings[i].area = Math.abs(area);

            // if (ccw === undefined) ccw = area < 0;
            //
            // if (ccw === area < 0) {
            //     if (polygon) polygons.push(polygon);
            //     polygon = [rings[i]];
            //
            // } else {
                polygon.push(rings[i]);
            // }
        }
        if (polygon) polygons.push(polygon);

        // Earcut performance degrages with the # of rings in a polygon. For this
        // reason, we limit strip out all but the `maxRings` largest rings.
        if (maxRings > 1) {
            for (let j = 0; j < polygons.length; j++) {
                if (polygons[j].length <= maxRings) continue;
                quickselect(polygons[j], maxRings, 1, polygons[j].length - 1, compareAreas);
                polygons[j] = polygons[j].slice(0, maxRings);
            }
        }

        return polygons;
    }
    function compareAreas(a, b) {
        return b.area - a.area;
    }

    /*
    ** SGI FREE SOFTWARE LICENSE B (Version 2.0, Sept. 18, 2008)
    ** Copyright (C) [dates of first publication] Silicon Graphics, Inc.
    ** All Rights Reserved.
    **
    ** Permission is hereby granted, free of charge, to any person obtaining a copy
    ** of this software and associated documentation files (the "Software"), to deal
    ** in the Software without restriction, including without limitation the rights
    ** to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
    ** of the Software, and to permit persons to whom the Software is furnished to do so,
    ** subject to the following conditions:
    **
    ** The above copyright notice including the dates of first publication and either this
    ** permission notice or a reference to http://oss.sgi.com/projects/FreeB/ shall be
    ** included in all copies or substantial portions of the Software.
    **
    ** THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
    ** INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
    ** PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL SILICON GRAPHICS, INC.
    ** BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
    ** TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE
    ** OR OTHER DEALINGS IN THE SOFTWARE.
    **
    ** Except as contained in this notice, the name of Silicon Graphics, Inc. shall not
    ** be used in advertising or otherwise to promote the sale, use or other dealings in
    ** this Software without prior written authorization from Silicon Graphics, Inc.
    */

    /* Public API */

    var Tess2 = {};

    var Tess2$1 = Tess2;

    Tess2.WINDING_ODD = 0;
    Tess2.WINDING_NONZERO = 1;
    Tess2.WINDING_POSITIVE = 2;
    Tess2.WINDING_NEGATIVE = 3;
    Tess2.WINDING_ABS_GEQ_TWO = 4;

    Tess2.POLYGONS = 0;
    Tess2.CONNECTED_POLYGONS = 1;
    Tess2.BOUNDARY_CONTOURS = 2;

    Tess2.tesselate = function(opts) {
        var debug =  opts.debug || false;
        var tess = new Tesselator();
        for (var i = 0; i < opts.contours.length; i++) {
            tess.addContour(opts.vertexSize || 2, opts.contours[i]);
        }
        tess.tesselate(opts.windingRule || Tess2.WINDING_ODD,
            opts.elementType || Tess2.POLYGONS,
            opts.polySize || 3,
            opts.vertexSize || 2,
            opts.normal || [0,0,1]);
        return {
            vertices: tess.vertices,
            vertexIndices: tess.vertexIndices,
            vertexCount: tess.vertexCount,
            elements: tess.elements,
            elementCount: tess.elementCount,
            mesh: debug ? tess.mesh : undefined
        };
    };

    /* Internal */

    var assert = function(cond) {
        if (!cond) {
            throw "Assertion Failed!";
        }
    };

    /* The mesh structure is similar in spirit, notation, and operations
    * to the "quad-edge" structure (see L. Guibas and J. Stolfi, Primitives
    * for the manipulation of general subdivisions and the computation of
    * Voronoi diagrams, ACM Transactions on Graphics, 4(2):74-123, April 1985).
    * For a simplified description, see the course notes for CS348a,
    * "Mathematical Foundations of Computer Graphics", available at the
    * Stanford bookstore (and taught during the fall quarter).
    * The implementation also borrows a tiny subset of the graph-based approach
    * use in Mantyla's Geometric Work Bench (see M. Mantyla, An Introduction
    * to Sold Modeling, Computer Science Press, Rockville, Maryland, 1988).
    *
    * The fundamental data structure is the "half-edge".  Two half-edges
    * go together to make an edge, but they point in opposite directions.
    * Each half-edge has a pointer to its mate (the "symmetric" half-edge Sym),
    * its origin vertex (Org), the face on its left side (Lface), and the
    * adjacent half-edges in the CCW direction around the origin vertex
    * (Onext) and around the left face (Lnext).  There is also a "next"
    * pointer for the global edge list (see below).
    *
    * The notation used for mesh navigation:
    *  Sym   = the mate of a half-edge (same edge, but opposite direction)
    *  Onext = edge CCW around origin vertex (keep same origin)
    *  Dnext = edge CCW around destination vertex (keep same dest)
    *  Lnext = edge CCW around left face (dest becomes new origin)
    *  Rnext = edge CCW around right face (origin becomes new dest)
    *
    * "prev" means to substitute CW for CCW in the definitions above.
    *
    * The mesh keeps global lists of all vertices, faces, and edges,
    * stored as doubly-linked circular lists with a dummy header node.
    * The mesh stores pointers to these dummy headers (vHead, fHead, eHead).
    *
    * The circular edge list is special; since half-edges always occur
    * in pairs (e and e->Sym), each half-edge stores a pointer in only
    * one direction.  Starting at eHead and following the e->next pointers
    * will visit each *edge* once (ie. e or e->Sym, but not both).
    * e->Sym stores a pointer in the opposite direction, thus it is
    * always true that e->Sym->next->Sym->next == e.
    *
    * Each vertex has a pointer to next and previous vertices in the
    * circular list, and a pointer to a half-edge with this vertex as
    * the origin (NULL if this is the dummy header).  There is also a
    * field "data" for client data.
    *
    * Each face has a pointer to the next and previous faces in the
    * circular list, and a pointer to a half-edge with this face as
    * the left face (NULL if this is the dummy header).  There is also
    * a field "data" for client data.
    *
    * Note that what we call a "face" is really a loop; faces may consist
    * of more than one loop (ie. not simply connected), but there is no
    * record of this in the data structure.  The mesh may consist of
    * several disconnected regions, so it may not be possible to visit
    * the entire mesh by starting at a half-edge and traversing the edge
    * structure.
    *
    * The mesh does NOT support isolated vertices; a vertex is deleted along
    * with its last edge.  Similarly when two faces are merged, one of the
    * faces is deleted (see tessMeshDelete below).  For mesh operations,
    * all face (loop) and vertex pointers must not be NULL.  However, once
    * mesh manipulation is finished, TESSmeshZapFace can be used to delete
    * faces of the mesh, one at a time.  All external faces can be "zapped"
    * before the mesh is returned to the client; then a NULL face indicates
    * a region which is not part of the output polygon.
    */

    function TESSvertex() {
        this.next = null;	/* next vertex (never NULL) */
        this.prev = null;	/* previous vertex (never NULL) */
        this.anEdge = null;	/* a half-edge with this origin */

        /* Internal data (keep hidden) */
        this.coords = [0,0,0];	/* vertex location in 3D */
        this.s = 0.0;
        this.t = 0.0;			/* projection onto the sweep plane */
        this.pqHandle = 0;		/* to allow deletion from priority queue */
        this.n = 0;				/* to allow identify unique vertices */
        this.idx = 0;			/* to allow map result to original verts */
    }

    function TESSface() {
        this.next = null;		/* next face (never NULL) */
        this.prev = null;		/* previous face (never NULL) */
        this.anEdge = null;		/* a half edge with this left face */

        /* Internal data (keep hidden) */
        this.trail = null;		/* "stack" for conversion to strips */
        this.n = 0;				/* to allow identiy unique faces */
        this.marked = false;	/* flag for conversion to strips */
        this.inside = false;	/* this face is in the polygon interior */
    }
    function TESShalfEdge(side) {
        this.next = null;		/* doubly-linked list (prev==Sym->next) */
        this.Sym = null;		/* same edge, opposite direction */
        this.Onext = null;		/* next edge CCW around origin */
        this.Lnext = null;		/* next edge CCW around left face */
        this.Org = null;		/* origin vertex (Overtex too long) */
        this.Lface = null;		/* left face */

        /* Internal data (keep hidden) */
        this.activeRegion = null;	/* a region with this upper edge (sweep.c) */
        this.winding = 0;			/* change in winding number when crossing
    									   from the right face to the left face */
        this.side = side;
    }
    TESShalfEdge.prototype = {
        get Rface() { return this.Sym.Lface; },
        set Rface(v) { this.Sym.Lface = v; },
        get Dst() { return this.Sym.Org; },
        set Dst(v) { this.Sym.Org = v; },
        get Oprev() { return this.Sym.Lnext; },
        set Oprev(v) { this.Sym.Lnext = v; },
        get Lprev() { return this.Onext.Sym; },
        set Lprev(v) { this.Onext.Sym = v; },
        get Dprev() { return this.Lnext.Sym; },
        set Dprev(v) { this.Lnext.Sym = v; },
        get Rprev() { return this.Sym.Onext; },
        set Rprev(v) { this.Sym.Onext = v; },
        get Dnext() { return /*this.Rprev*/this.Sym.Onext.Sym; },  /* 3 pointers */
        set Dnext(v) { /*this.Rprev*/this.Sym.Onext.Sym = v; },  /* 3 pointers */
        get Rnext() { return /*this.Oprev*/this.Sym.Lnext.Sym; },  /* 3 pointers */
        set Rnext(v) { /*this.Oprev*/this.Sym.Lnext.Sym = v; },  /* 3 pointers */
    };



    function TESSmesh() {
        var v = new TESSvertex();
        var f = new TESSface();
        var e = new TESShalfEdge(0);
        var eSym = new TESShalfEdge(1);

        v.next = v.prev = v;
        v.anEdge = null;

        f.next = f.prev = f;
        f.anEdge = null;
        f.trail = null;
        f.marked = false;
        f.inside = false;

        e.next = e;
        e.Sym = eSym;
        e.Onext = null;
        e.Lnext = null;
        e.Org = null;
        e.Lface = null;
        e.winding = 0;
        e.activeRegion = null;

        eSym.next = eSym;
        eSym.Sym = e;
        eSym.Onext = null;
        eSym.Lnext = null;
        eSym.Org = null;
        eSym.Lface = null;
        eSym.winding = 0;
        eSym.activeRegion = null;

        this.vHead = v;		/* dummy header for vertex list */
        this.fHead = f;		/* dummy header for face list */
        this.eHead = e;		/* dummy header for edge list */
        this.eHeadSym = eSym;	/* and its symmetric counterpart */
    }
    /* The mesh operations below have three motivations: completeness,
    * convenience, and efficiency.  The basic mesh operations are MakeEdge,
    * Splice, and Delete.  All the other edge operations can be implemented
    * in terms of these.  The other operations are provided for convenience
    * and/or efficiency.
    *
    * When a face is split or a vertex is added, they are inserted into the
    * global list *before* the existing vertex or face (ie. e->Org or e->Lface).
    * This makes it easier to process all vertices or faces in the global lists
    * without worrying about processing the same data twice.  As a convenience,
    * when a face is split, the "inside" flag is copied from the old face.
    * Other internal data (v->data, v->activeRegion, f->data, f->marked,
    * f->trail, e->winding) is set to zero.
    *
    * ********************** Basic Edge Operations **************************
    *
    * tessMeshMakeEdge( mesh ) creates one edge, two vertices, and a loop.
    * The loop (face) consists of the two new half-edges.
    *
    * tessMeshSplice( eOrg, eDst ) is the basic operation for changing the
    * mesh connectivity and topology.  It changes the mesh so that
    *  eOrg->Onext <- OLD( eDst->Onext )
    *  eDst->Onext <- OLD( eOrg->Onext )
    * where OLD(...) means the value before the meshSplice operation.
    *
    * This can have two effects on the vertex structure:
    *  - if eOrg->Org != eDst->Org, the two vertices are merged together
    *  - if eOrg->Org == eDst->Org, the origin is split into two vertices
    * In both cases, eDst->Org is changed and eOrg->Org is untouched.
    *
    * Similarly (and independently) for the face structure,
    *  - if eOrg->Lface == eDst->Lface, one loop is split into two
    *  - if eOrg->Lface != eDst->Lface, two distinct loops are joined into one
    * In both cases, eDst->Lface is changed and eOrg->Lface is unaffected.
    *
    * tessMeshDelete( eDel ) removes the edge eDel.  There are several cases:
    * if (eDel->Lface != eDel->Rface), we join two loops into one; the loop
    * eDel->Lface is deleted.  Otherwise, we are splitting one loop into two;
    * the newly created loop will contain eDel->Dst.  If the deletion of eDel
    * would create isolated vertices, those are deleted as well.
    *
    * ********************** Other Edge Operations **************************
    *
    * tessMeshAddEdgeVertex( eOrg ) creates a new edge eNew such that
    * eNew == eOrg->Lnext, and eNew->Dst is a newly created vertex.
    * eOrg and eNew will have the same left face.
    *
    * tessMeshSplitEdge( eOrg ) splits eOrg into two edges eOrg and eNew,
    * such that eNew == eOrg->Lnext.  The new vertex is eOrg->Dst == eNew->Org.
    * eOrg and eNew will have the same left face.
    *
    * tessMeshConnect( eOrg, eDst ) creates a new edge from eOrg->Dst
    * to eDst->Org, and returns the corresponding half-edge eNew.
    * If eOrg->Lface == eDst->Lface, this splits one loop into two,
    * and the newly created loop is eNew->Lface.  Otherwise, two disjoint
    * loops are merged into one, and the loop eDst->Lface is destroyed.
    *
    * ************************ Other Operations *****************************
    *
    * tessMeshNewMesh() creates a new mesh with no edges, no vertices,
    * and no loops (what we usually call a "face").
    *
    * tessMeshUnion( mesh1, mesh2 ) forms the union of all structures in
    * both meshes, and returns the new mesh (the old meshes are destroyed).
    *
    * tessMeshDeleteMesh( mesh ) will free all storage for any valid mesh.
    *
    * tessMeshZapFace( fZap ) destroys a face and removes it from the
    * global face list.  All edges of fZap will have a NULL pointer as their
    * left face.  Any edges which also have a NULL pointer as their right face
    * are deleted entirely (along with any isolated vertices this produces).
    * An entire mesh can be deleted by zapping its faces, one at a time,
    * in any order.  Zapped faces cannot be used in further mesh operations!
    *
    * tessMeshCheckMesh( mesh ) checks a mesh for self-consistency.
    */

    TESSmesh.prototype = {

        /* MakeEdge creates a new pair of half-edges which form their own loop.
        * No vertex or face structures are allocated, but these must be assigned
        * before the current edge operation is completed.
        */
        //static TESShalfEdge *MakeEdge( TESSmesh* mesh, TESShalfEdge *eNext )
        makeEdge_: function(eNext) {
            var e = new TESShalfEdge(0);
            var eSym = new TESShalfEdge(1);

            /* Make sure eNext points to the first edge of the edge pair */
            if( eNext.Sym.side < eNext.side ) { eNext = eNext.Sym; }

            /* Insert in circular doubly-linked list before eNext.
            * Note that the prev pointer is stored in Sym->next.
            */
            var ePrev = eNext.Sym.next;
            eSym.next = ePrev;
            ePrev.Sym.next = e;
            e.next = eNext;
            eNext.Sym.next = eSym;

            e.Sym = eSym;
            e.Onext = e;
            e.Lnext = eSym;
            e.Org = null;
            e.Lface = null;
            e.winding = 0;
            e.activeRegion = null;

            eSym.Sym = e;
            eSym.Onext = eSym;
            eSym.Lnext = e;
            eSym.Org = null;
            eSym.Lface = null;
            eSym.winding = 0;
            eSym.activeRegion = null;

            return e;
        },

        /* Splice( a, b ) is best described by the Guibas/Stolfi paper or the
        * CS348a notes (see mesh.h).  Basically it modifies the mesh so that
        * a->Onext and b->Onext are exchanged.  This can have various effects
        * depending on whether a and b belong to different face or vertex rings.
        * For more explanation see tessMeshSplice() below.
        */
        // static void Splice( TESShalfEdge *a, TESShalfEdge *b )
        splice_: function(a, b) {
            var aOnext = a.Onext;
            var bOnext = b.Onext;
            aOnext.Sym.Lnext = b;
            bOnext.Sym.Lnext = a;
            a.Onext = bOnext;
            b.Onext = aOnext;
        },

        /* MakeVertex( newVertex, eOrig, vNext ) attaches a new vertex and makes it the
        * origin of all edges in the vertex loop to which eOrig belongs. "vNext" gives
        * a place to insert the new vertex in the global vertex list.  We insert
        * the new vertex *before* vNext so that algorithms which walk the vertex
        * list will not see the newly created vertices.
        */
        //static void MakeVertex( TESSvertex *newVertex, TESShalfEdge *eOrig, TESSvertex *vNext )
        makeVertex_: function(newVertex, eOrig, vNext) {
            var vNew = newVertex;
            assert(vNew !== null);

            /* insert in circular doubly-linked list before vNext */
            var vPrev = vNext.prev;
            vNew.prev = vPrev;
            vPrev.next = vNew;
            vNew.next = vNext;
            vNext.prev = vNew;

            vNew.anEdge = eOrig;
            /* leave coords, s, t undefined */

            /* fix other edges on this vertex loop */
            var e = eOrig;
            do {
                e.Org = vNew;
                e = e.Onext;
            } while(e !== eOrig);
        },

        /* MakeFace( newFace, eOrig, fNext ) attaches a new face and makes it the left
        * face of all edges in the face loop to which eOrig belongs.  "fNext" gives
        * a place to insert the new face in the global face list.  We insert
        * the new face *before* fNext so that algorithms which walk the face
        * list will not see the newly created faces.
        */
        // static void MakeFace( TESSface *newFace, TESShalfEdge *eOrig, TESSface *fNext )
        makeFace_: function(newFace, eOrig, fNext) {
            var fNew = newFace;
            assert(fNew !== null);

            /* insert in circular doubly-linked list before fNext */
            var fPrev = fNext.prev;
            fNew.prev = fPrev;
            fPrev.next = fNew;
            fNew.next = fNext;
            fNext.prev = fNew;

            fNew.anEdge = eOrig;
            fNew.trail = null;
            fNew.marked = false;

            /* The new face is marked "inside" if the old one was.  This is a
            * convenience for the common case where a face has been split in two.
            */
            fNew.inside = fNext.inside;

            /* fix other edges on this face loop */
            var e = eOrig;
            do {
                e.Lface = fNew;
                e = e.Lnext;
            } while(e !== eOrig);
        },

        /* KillEdge( eDel ) destroys an edge (the half-edges eDel and eDel->Sym),
        * and removes from the global edge list.
        */
        //static void KillEdge( TESSmesh *mesh, TESShalfEdge *eDel )
        killEdge_: function(eDel) {
            /* Half-edges are allocated in pairs, see EdgePair above */
            if( eDel.Sym.side < eDel.side ) { eDel = eDel.Sym; }

            /* delete from circular doubly-linked list */
            var eNext = eDel.next;
            var ePrev = eDel.Sym.next;
            eNext.Sym.next = ePrev;
            ePrev.Sym.next = eNext;
        },


        /* KillVertex( vDel ) destroys a vertex and removes it from the global
        * vertex list.  It updates the vertex loop to point to a given new vertex.
        */
        //static void KillVertex( TESSmesh *mesh, TESSvertex *vDel, TESSvertex *newOrg )
        killVertex_: function(vDel, newOrg) {
            var eStart = vDel.anEdge;
            /* change the origin of all affected edges */
            var e = eStart;
            do {
                e.Org = newOrg;
                e = e.Onext;
            } while(e !== eStart);

            /* delete from circular doubly-linked list */
            var vPrev = vDel.prev;
            var vNext = vDel.next;
            vNext.prev = vPrev;
            vPrev.next = vNext;
        },

        /* KillFace( fDel ) destroys a face and removes it from the global face
        * list.  It updates the face loop to point to a given new face.
        */
        //static void KillFace( TESSmesh *mesh, TESSface *fDel, TESSface *newLface )
        killFace_: function(fDel, newLface) {
            var eStart = fDel.anEdge;

            /* change the left face of all affected edges */
            var e = eStart;
            do {
                e.Lface = newLface;
                e = e.Lnext;
            } while(e !== eStart);

            /* delete from circular doubly-linked list */
            var fPrev = fDel.prev;
            var fNext = fDel.next;
            fNext.prev = fPrev;
            fPrev.next = fNext;
        },

        /****************** Basic Edge Operations **********************/

        /* tessMeshMakeEdge creates one edge, two vertices, and a loop (face).
        * The loop consists of the two new half-edges.
        */
        //TESShalfEdge *tessMeshMakeEdge( TESSmesh *mesh )
        makeEdge: function() {
            var newVertex1 = new TESSvertex();
            var newVertex2 = new TESSvertex();
            var newFace = new TESSface();
            var e = this.makeEdge_( this.eHead);
            this.makeVertex_( newVertex1, e, this.vHead );
            this.makeVertex_( newVertex2, e.Sym, this.vHead );
            this.makeFace_( newFace, e, this.fHead );
            return e;
        },

        /* tessMeshSplice( eOrg, eDst ) is the basic operation for changing the
        * mesh connectivity and topology.  It changes the mesh so that
        *	eOrg->Onext <- OLD( eDst->Onext )
        *	eDst->Onext <- OLD( eOrg->Onext )
        * where OLD(...) means the value before the meshSplice operation.
        *
        * This can have two effects on the vertex structure:
        *  - if eOrg->Org != eDst->Org, the two vertices are merged together
        *  - if eOrg->Org == eDst->Org, the origin is split into two vertices
        * In both cases, eDst->Org is changed and eOrg->Org is untouched.
        *
        * Similarly (and independently) for the face structure,
        *  - if eOrg->Lface == eDst->Lface, one loop is split into two
        *  - if eOrg->Lface != eDst->Lface, two distinct loops are joined into one
        * In both cases, eDst->Lface is changed and eOrg->Lface is unaffected.
        *
        * Some special cases:
        * If eDst == eOrg, the operation has no effect.
        * If eDst == eOrg->Lnext, the new face will have a single edge.
        * If eDst == eOrg->Lprev, the old face will have a single edge.
        * If eDst == eOrg->Onext, the new vertex will have a single edge.
        * If eDst == eOrg->Oprev, the old vertex will have a single edge.
        */
        //int tessMeshSplice( TESSmesh* mesh, TESShalfEdge *eOrg, TESShalfEdge *eDst )
        splice: function(eOrg, eDst) {
            var joiningLoops = false;
            var joiningVertices = false;

            if( eOrg === eDst ) return;

            if( eDst.Org !== eOrg.Org ) {
                /* We are merging two disjoint vertices -- destroy eDst->Org */
                joiningVertices = true;
                this.killVertex_( eDst.Org, eOrg.Org );
            }
            if( eDst.Lface !== eOrg.Lface ) {
                /* We are connecting two disjoint loops -- destroy eDst->Lface */
                joiningLoops = true;
                this.killFace_( eDst.Lface, eOrg.Lface );
            }

            /* Change the edge structure */
            this.splice_( eDst, eOrg );

            if( ! joiningVertices ) {
                var newVertex = new TESSvertex();

                /* We split one vertex into two -- the new vertex is eDst->Org.
                * Make sure the old vertex points to a valid half-edge.
                */
                this.makeVertex_( newVertex, eDst, eOrg.Org );
                eOrg.Org.anEdge = eOrg;
            }
            if( ! joiningLoops ) {
                var newFace = new TESSface();

                /* We split one loop into two -- the new loop is eDst->Lface.
                * Make sure the old face points to a valid half-edge.
                */
                this.makeFace_( newFace, eDst, eOrg.Lface );
                eOrg.Lface.anEdge = eOrg;
            }
        },

        /* tessMeshDelete( eDel ) removes the edge eDel.  There are several cases:
        * if (eDel->Lface != eDel->Rface), we join two loops into one; the loop
        * eDel->Lface is deleted.  Otherwise, we are splitting one loop into two;
        * the newly created loop will contain eDel->Dst.  If the deletion of eDel
        * would create isolated vertices, those are deleted as well.
        *
        * This function could be implemented as two calls to tessMeshSplice
        * plus a few calls to memFree, but this would allocate and delete
        * unnecessary vertices and faces.
        */
        //int tessMeshDelete( TESSmesh *mesh, TESShalfEdge *eDel )
        delete: function(eDel) {
            var eDelSym = eDel.Sym;
            var joiningLoops = false;

            /* First step: disconnect the origin vertex eDel->Org.  We make all
            * changes to get a consistent mesh in this "intermediate" state.
            */
            if( eDel.Lface !== eDel.Rface ) {
                /* We are joining two loops into one -- remove the left face */
                joiningLoops = true;
                this.killFace_( eDel.Lface, eDel.Rface );
            }

            if( eDel.Onext === eDel ) {
                this.killVertex_( eDel.Org, null );
            } else {
                /* Make sure that eDel->Org and eDel->Rface point to valid half-edges */
                eDel.Rface.anEdge = eDel.Oprev;
                eDel.Org.anEdge = eDel.Onext;

                this.splice_( eDel, eDel.Oprev );
                if( ! joiningLoops ) {
                    var newFace = new TESSface();

                    /* We are splitting one loop into two -- create a new loop for eDel. */
                    this.makeFace_( newFace, eDel, eDel.Lface );
                }
            }

            /* Claim: the mesh is now in a consistent state, except that eDel->Org
            * may have been deleted.  Now we disconnect eDel->Dst.
            */
            if( eDelSym.Onext === eDelSym ) {
                this.killVertex_( eDelSym.Org, null );
                this.killFace_( eDelSym.Lface, null );
            } else {
                /* Make sure that eDel->Dst and eDel->Lface point to valid half-edges */
                eDel.Lface.anEdge = eDelSym.Oprev;
                eDelSym.Org.anEdge = eDelSym.Onext;
                this.splice_( eDelSym, eDelSym.Oprev );
            }

            /* Any isolated vertices or faces have already been freed. */
            this.killEdge_( eDel );
        },

        /******************** Other Edge Operations **********************/

        /* All these routines can be implemented with the basic edge
        * operations above.  They are provided for convenience and efficiency.
        */


        /* tessMeshAddEdgeVertex( eOrg ) creates a new edge eNew such that
        * eNew == eOrg->Lnext, and eNew->Dst is a newly created vertex.
        * eOrg and eNew will have the same left face.
        */
        // TESShalfEdge *tessMeshAddEdgeVertex( TESSmesh *mesh, TESShalfEdge *eOrg );
        addEdgeVertex: function(eOrg) {
            var eNew = this.makeEdge_( eOrg );
            var eNewSym = eNew.Sym;

            /* Connect the new edge appropriately */
            this.splice_( eNew, eOrg.Lnext );

            /* Set the vertex and face information */
            eNew.Org = eOrg.Dst;

            var newVertex = new TESSvertex();
            this.makeVertex_( newVertex, eNewSym, eNew.Org );

            eNew.Lface = eNewSym.Lface = eOrg.Lface;

            return eNew;
        },


        /* tessMeshSplitEdge( eOrg ) splits eOrg into two edges eOrg and eNew,
        * such that eNew == eOrg->Lnext.  The new vertex is eOrg->Dst == eNew->Org.
        * eOrg and eNew will have the same left face.
        */
        // TESShalfEdge *tessMeshSplitEdge( TESSmesh *mesh, TESShalfEdge *eOrg );
        splitEdge: function(eOrg, eDst) {
            var tempHalfEdge = this.addEdgeVertex( eOrg );
            var eNew = tempHalfEdge.Sym;

            /* Disconnect eOrg from eOrg->Dst and connect it to eNew->Org */
            this.splice_( eOrg.Sym, eOrg.Sym.Oprev );
            this.splice_( eOrg.Sym, eNew );

            /* Set the vertex and face information */
            eOrg.Dst = eNew.Org;
            eNew.Dst.anEdge = eNew.Sym;	/* may have pointed to eOrg->Sym */
            eNew.Rface = eOrg.Rface;
            eNew.winding = eOrg.winding;	/* copy old winding information */
            eNew.Sym.winding = eOrg.Sym.winding;

            return eNew;
        },


        /* tessMeshConnect( eOrg, eDst ) creates a new edge from eOrg->Dst
        * to eDst->Org, and returns the corresponding half-edge eNew.
        * If eOrg->Lface == eDst->Lface, this splits one loop into two,
        * and the newly created loop is eNew->Lface.  Otherwise, two disjoint
        * loops are merged into one, and the loop eDst->Lface is destroyed.
        *
        * If (eOrg == eDst), the new face will have only two edges.
        * If (eOrg->Lnext == eDst), the old face is reduced to a single edge.
        * If (eOrg->Lnext->Lnext == eDst), the old face is reduced to two edges.
        */

        // TESShalfEdge *tessMeshConnect( TESSmesh *mesh, TESShalfEdge *eOrg, TESShalfEdge *eDst );
        connect: function(eOrg, eDst) {
            var joiningLoops = false;
            var eNew = this.makeEdge_( eOrg );
            var eNewSym = eNew.Sym;

            if( eDst.Lface !== eOrg.Lface ) {
                /* We are connecting two disjoint loops -- destroy eDst->Lface */
                joiningLoops = true;
                this.killFace_( eDst.Lface, eOrg.Lface );
            }

            /* Connect the new edge appropriately */
            this.splice_( eNew, eOrg.Lnext );
            this.splice_( eNewSym, eDst );

            /* Set the vertex and face information */
            eNew.Org = eOrg.Dst;
            eNewSym.Org = eDst.Org;
            eNew.Lface = eNewSym.Lface = eOrg.Lface;

            /* Make sure the old face points to a valid half-edge */
            eOrg.Lface.anEdge = eNewSym;

            if( ! joiningLoops ) {
                var newFace = new TESSface();
                /* We split one loop into two -- the new loop is eNew->Lface */
                this.makeFace_( newFace, eNew, eOrg.Lface );
            }
            return eNew;
        },

        /* tessMeshZapFace( fZap ) destroys a face and removes it from the
        * global face list.  All edges of fZap will have a NULL pointer as their
        * left face.  Any edges which also have a NULL pointer as their right face
        * are deleted entirely (along with any isolated vertices this produces).
        * An entire mesh can be deleted by zapping its faces, one at a time,
        * in any order.  Zapped faces cannot be used in further mesh operations!
        */
        zapFace: function( fZap )
        {
            var eStart = fZap.anEdge;
            var e, eNext, eSym;
            var fPrev, fNext;

            /* walk around face, deleting edges whose right face is also NULL */
            eNext = eStart.Lnext;
            do {
                e = eNext;
                eNext = e.Lnext;

                e.Lface = null;
                if( e.Rface === null ) {
                    /* delete the edge -- see TESSmeshDelete above */

                    if( e.Onext === e ) {
                        this.killVertex_( e.Org, null );
                    } else {
                        /* Make sure that e->Org points to a valid half-edge */
                        e.Org.anEdge = e.Onext;
                        this.splice_( e, e.Oprev );
                    }
                    eSym = e.Sym;
                    if( eSym.Onext === eSym ) {
                        this.killVertex_( eSym.Org, null );
                    } else {
                        /* Make sure that eSym->Org points to a valid half-edge */
                        eSym.Org.anEdge = eSym.Onext;
                        this.splice_( eSym, eSym.Oprev );
                    }
                    this.killEdge_( e );
                }
            } while( e != eStart );

            /* delete from circular doubly-linked list */
            fPrev = fZap.prev;
            fNext = fZap.next;
            fNext.prev = fPrev;
            fPrev.next = fNext;
        },

        countFaceVerts_: function(f) {
            var eCur = f.anEdge;
            var n = 0;
            do
            {
                n++;
                eCur = eCur.Lnext;
            }
            while (eCur !== f.anEdge);
            return n;
        },

        //int tessMeshMergeConvexFaces( TESSmesh *mesh, int maxVertsPerFace )
        mergeConvexFaces: function(maxVertsPerFace) {
            var f;
            var eCur, eNext, eSym;
            var vStart;
            var curNv, symNv;

            for( f = this.fHead.next; f !== this.fHead; f = f.next )
            {
                // Skip faces which are outside the result.
                if( !f.inside )
                    continue;

                eCur = f.anEdge;
                vStart = eCur.Org;

                while (true)
                {
                    eNext = eCur.Lnext;
                    eSym = eCur.Sym;

                    // Try to merge if the neighbour face is valid.
                    if( eSym && eSym.Lface && eSym.Lface.inside )
                    {
                        // Try to merge the neighbour faces if the resulting polygons
                        // does not exceed maximum number of vertices.
                        curNv = this.countFaceVerts_( f );
                        symNv = this.countFaceVerts_( eSym.Lface );
                        if( (curNv+symNv-2) <= maxVertsPerFace )
                        {
                            // Merge if the resulting poly is convex.
                            if( Geom.vertCCW( eCur.Lprev.Org, eCur.Org, eSym.Lnext.Lnext.Org ) &&
                                Geom.vertCCW( eSym.Lprev.Org, eSym.Org, eCur.Lnext.Lnext.Org ) )
                            {
                                eNext = eSym.Lnext;
                                this.delete( eSym );
                                eCur = null;
                                eSym = null;
                            }
                        }
                    }

                    if( eCur && eCur.Lnext.Org === vStart )
                        break;

                    // Continue to next edge.
                    eCur = eNext;
                }
            }

            return true;
        },

        /* tessMeshCheckMesh( mesh ) checks a mesh for self-consistency.
        */
        check: function() {
            var fHead = this.fHead;
            var vHead = this.vHead;
            var eHead = this.eHead;
            var f, fPrev, v, vPrev, e, ePrev;

            fPrev = fHead;
            for( fPrev = fHead ; (f = fPrev.next) !== fHead; fPrev = f) {
                assert( f.prev === fPrev );
                e = f.anEdge;
                do {
                    assert( e.Sym !== e );
                    assert( e.Sym.Sym === e );
                    assert( e.Lnext.Onext.Sym === e );
                    assert( e.Onext.Sym.Lnext === e );
                    assert( e.Lface === f );
                    e = e.Lnext;
                } while( e !== f.anEdge );
            }
            assert( f.prev === fPrev && f.anEdge === null );

            vPrev = vHead;
            for( vPrev = vHead ; (v = vPrev.next) !== vHead; vPrev = v) {
                assert( v.prev === vPrev );
                e = v.anEdge;
                do {
                    assert( e.Sym !== e );
                    assert( e.Sym.Sym === e );
                    assert( e.Lnext.Onext.Sym === e );
                    assert( e.Onext.Sym.Lnext === e );
                    assert( e.Org === v );
                    e = e.Onext;
                } while( e !== v.anEdge );
            }
            assert( v.prev === vPrev && v.anEdge === null );

            ePrev = eHead;
            for( ePrev = eHead ; (e = ePrev.next) !== eHead; ePrev = e) {
                assert( e.Sym.next === ePrev.Sym );
                assert( e.Sym !== e );
                assert( e.Sym.Sym === e );
                assert( e.Org !== null );
                assert( e.Dst !== null );
                assert( e.Lnext.Onext.Sym === e );
                assert( e.Onext.Sym.Lnext === e );
            }
            assert( e.Sym.next === ePrev.Sym
                && e.Sym === this.eHeadSym
                && e.Sym.Sym === e
                && e.Org === null && e.Dst === null
                && e.Lface === null && e.Rface === null );
        }

    };

    var Geom = {};

    Geom.vertEq = function(u,v) {
        return (u.s === v.s && u.t === v.t);
    };

    /* Returns TRUE if u is lexicographically <= v. */
    Geom.vertLeq = function(u,v) {
        return ((u.s < v.s) || (u.s === v.s && u.t <= v.t));
    };

    /* Versions of VertLeq, EdgeSign, EdgeEval with s and t transposed. */
    Geom.transLeq = function(u,v) {
        return ((u.t < v.t) || (u.t === v.t && u.s <= v.s));
    };

    Geom.edgeGoesLeft = function(e) {
        return Geom.vertLeq( e.Dst, e.Org );
    };

    Geom.edgeGoesRight = function(e) {
        return Geom.vertLeq( e.Org, e.Dst );
    };

    Geom.vertL1dist = function(u,v) {
        return (Math.abs(u.s - v.s) + Math.abs(u.t - v.t));
    };

    //TESSreal tesedgeEval( TESSvertex *u, TESSvertex *v, TESSvertex *w )
    Geom.edgeEval = function( u, v, w ) {
        /* Given three vertices u,v,w such that VertLeq(u,v) && VertLeq(v,w),
        * evaluates the t-coord of the edge uw at the s-coord of the vertex v.
        * Returns v->t - (uw)(v->s), ie. the signed distance from uw to v.
        * If uw is vertical (and thus passes thru v), the result is zero.
        *
        * The calculation is extremely accurate and stable, even when v
        * is very close to u or w.  In particular if we set v->t = 0 and
        * let r be the negated result (this evaluates (uw)(v->s)), then
        * r is guaranteed to satisfy MIN(u->t,w->t) <= r <= MAX(u->t,w->t).
        */
        assert( Geom.vertLeq( u, v ) && Geom.vertLeq( v, w ));

        var gapL = v.s - u.s;
        var gapR = w.s - v.s;

        if( gapL + gapR > 0.0 ) {
            if( gapL < gapR ) {
                return (v.t - u.t) + (u.t - w.t) * (gapL / (gapL + gapR));
            } else {
                return (v.t - w.t) + (w.t - u.t) * (gapR / (gapL + gapR));
            }
        }
        /* vertical line */
        return 0.0;
    };

    //TESSreal tesedgeSign( TESSvertex *u, TESSvertex *v, TESSvertex *w )
    Geom.edgeSign = function( u, v, w ) {
        /* Returns a number whose sign matches EdgeEval(u,v,w) but which
        * is cheaper to evaluate.  Returns > 0, == 0 , or < 0
        * as v is above, on, or below the edge uw.
        */
        assert( Geom.vertLeq( u, v ) && Geom.vertLeq( v, w ));

        var gapL = v.s - u.s;
        var gapR = w.s - v.s;

        if( gapL + gapR > 0.0 ) {
            return (v.t - w.t) * gapL + (v.t - u.t) * gapR;
        }
        /* vertical line */
        return 0.0;
    };


    /***********************************************************************
     * Define versions of EdgeSign, EdgeEval with s and t transposed.
     */

    //TESSreal testransEval( TESSvertex *u, TESSvertex *v, TESSvertex *w )
    Geom.transEval = function( u, v, w ) {
        /* Given three vertices u,v,w such that TransLeq(u,v) && TransLeq(v,w),
        * evaluates the t-coord of the edge uw at the s-coord of the vertex v.
        * Returns v->s - (uw)(v->t), ie. the signed distance from uw to v.
        * If uw is vertical (and thus passes thru v), the result is zero.
        *
        * The calculation is extremely accurate and stable, even when v
        * is very close to u or w.  In particular if we set v->s = 0 and
        * let r be the negated result (this evaluates (uw)(v->t)), then
        * r is guaranteed to satisfy MIN(u->s,w->s) <= r <= MAX(u->s,w->s).
        */
        assert( Geom.transLeq( u, v ) && Geom.transLeq( v, w ));

        var gapL = v.t - u.t;
        var gapR = w.t - v.t;

        if( gapL + gapR > 0.0 ) {
            if( gapL < gapR ) {
                return (v.s - u.s) + (u.s - w.s) * (gapL / (gapL + gapR));
            } else {
                return (v.s - w.s) + (w.s - u.s) * (gapR / (gapL + gapR));
            }
        }
        /* vertical line */
        return 0.0;
    };

    //TESSreal testransSign( TESSvertex *u, TESSvertex *v, TESSvertex *w )
    Geom.transSign = function( u, v, w ) {
        /* Returns a number whose sign matches TransEval(u,v,w) but which
        * is cheaper to evaluate.  Returns > 0, == 0 , or < 0
        * as v is above, on, or below the edge uw.
        */
        assert( Geom.transLeq( u, v ) && Geom.transLeq( v, w ));

        var gapL = v.t - u.t;
        var gapR = w.t - v.t;

        if( gapL + gapR > 0.0 ) {
            return (v.s - w.s) * gapL + (v.s - u.s) * gapR;
        }
        /* vertical line */
        return 0.0;
    };


    //int tesvertCCW( TESSvertex *u, TESSvertex *v, TESSvertex *w )
    Geom.vertCCW = function( u, v, w ) {
        /* For almost-degenerate situations, the results are not reliable.
        * Unless the floating-point arithmetic can be performed without
        * rounding errors, *any* implementation will give incorrect results
        * on some degenerate inputs, so the client must have some way to
        * handle this situation.
        */
        return (u.s*(v.t - w.t) + v.s*(w.t - u.t) + w.s*(u.t - v.t)) >= 0.0;
    };

    /* Given parameters a,x,b,y returns the value (b*x+a*y)/(a+b),
    * or (x+y)/2 if a==b==0.  It requires that a,b >= 0, and enforces
    * this in the rare case that one argument is slightly negative.
    * The implementation is extremely stable numerically.
    * In particular it guarantees that the result r satisfies
    * MIN(x,y) <= r <= MAX(x,y), and the results are very accurate
    * even when a and b differ greatly in magnitude.
    */
    Geom.interpolate = function(a,x,b,y) {
        return (a = (a < 0) ? 0 : a, b = (b < 0) ? 0 : b, ((a <= b) ? ((b == 0) ? ((x+y) / 2) : (x + (y-x) * (a/(a+b)))) : (y + (x-y) * (b/(a+b)))));
    };

    /*
    #ifndef FOR_TRITE_TEST_PROGRAM
    #define Interpolate(a,x,b,y)	RealInterpolate(a,x,b,y)
    #else

    // Claim: the ONLY property the sweep algorithm relies on is that
    // MIN(x,y) <= r <= MAX(x,y).  This is a nasty way to test that.
    #include <stdlib.h>
    extern int RandomInterpolate;

    double Interpolate( double a, double x, double b, double y)
    {
        printf("*********************%d\n",RandomInterpolate);
        if( RandomInterpolate ) {
            a = 1.2 * drand48() - 0.1;
            a = (a < 0) ? 0 : ((a > 1) ? 1 : a);
            b = 1.0 - a;
        }
        return RealInterpolate(a,x,b,y);
    }
    #endif*/

    Geom.intersect = function( o1, d1, o2, d2, v ) {
        /* Given edges (o1,d1) and (o2,d2), compute their point of intersection.
        * The computed point is guaranteed to lie in the intersection of the
        * bounding rectangles defined by each edge.
        */
        var z1, z2;
        var t;

        /* This is certainly not the most efficient way to find the intersection
        * of two line segments, but it is very numerically stable.
        *
        * Strategy: find the two middle vertices in the VertLeq ordering,
        * and interpolate the intersection s-value from these.  Then repeat
        * using the TransLeq ordering to find the intersection t-value.
        */

        if( ! Geom.vertLeq( o1, d1 )) { t = o1; o1 = d1; d1 = t; } //swap( o1, d1 ); }
        if( ! Geom.vertLeq( o2, d2 )) { t = o2; o2 = d2; d2 = t; } //swap( o2, d2 ); }
        if( ! Geom.vertLeq( o1, o2 )) { t = o1; o1 = o2; o2 = t; t = d1; d1 = d2; d2 = t; }//swap( o1, o2 ); swap( d1, d2 ); }

        if( ! Geom.vertLeq( o2, d1 )) {
            /* Technically, no intersection -- do our best */
            v.s = (o2.s + d1.s) / 2;
        } else if( Geom.vertLeq( d1, d2 )) {
            /* Interpolate between o2 and d1 */
            z1 = Geom.edgeEval( o1, o2, d1 );
            z2 = Geom.edgeEval( o2, d1, d2 );
            if( z1+z2 < 0 ) { z1 = -z1; z2 = -z2; }
            v.s = Geom.interpolate( z1, o2.s, z2, d1.s );
        } else {
            /* Interpolate between o2 and d2 */
            z1 = Geom.edgeSign( o1, o2, d1 );
            z2 = -Geom.edgeSign( o1, d2, d1 );
            if( z1+z2 < 0 ) { z1 = -z1; z2 = -z2; }
            v.s = Geom.interpolate( z1, o2.s, z2, d2.s );
        }

        /* Now repeat the process for t */

        if( ! Geom.transLeq( o1, d1 )) { t = o1; o1 = d1; d1 = t; } //swap( o1, d1 ); }
        if( ! Geom.transLeq( o2, d2 )) { t = o2; o2 = d2; d2 = t; } //swap( o2, d2 ); }
        if( ! Geom.transLeq( o1, o2 )) { t = o1; o1 = o2; o2 = t; t = d1; d1 = d2; d2 = t; } //swap( o1, o2 ); swap( d1, d2 ); }

        if( ! Geom.transLeq( o2, d1 )) {
            /* Technically, no intersection -- do our best */
            v.t = (o2.t + d1.t) / 2;
        } else if( Geom.transLeq( d1, d2 )) {
            /* Interpolate between o2 and d1 */
            z1 = Geom.transEval( o1, o2, d1 );
            z2 = Geom.transEval( o2, d1, d2 );
            if( z1+z2 < 0 ) { z1 = -z1; z2 = -z2; }
            v.t = Geom.interpolate( z1, o2.t, z2, d1.t );
        } else {
            /* Interpolate between o2 and d2 */
            z1 = Geom.transSign( o1, o2, d1 );
            z2 = -Geom.transSign( o1, d2, d1 );
            if( z1+z2 < 0 ) { z1 = -z1; z2 = -z2; }
            v.t = Geom.interpolate( z1, o2.t, z2, d2.t );
        }
    };



    function DictNode() {
        this.key = null;
        this.next = null;
        this.prev = null;
    }
    function Dict(frame, leq) {
        this.head = new DictNode();
        this.head.next = this.head;
        this.head.prev = this.head;
        this.frame = frame;
        this.leq = leq;
    }
    Dict.prototype = {
        min: function() {
            return this.head.next;
        },

        max: function() {
            return this.head.prev;
        },

        insert: function(k) {
            return this.insertBefore(this.head, k);
        },

        search: function(key) {
            /* Search returns the node with the smallest key greater than or equal
            * to the given key.  If there is no such key, returns a node whose
            * key is NULL.  Similarly, Succ(Max(d)) has a NULL key, etc.
            */
            var node = this.head;
            do {
                node = node.next;
            } while( node.key !== null && ! this.leq(this.frame, key, node.key));

            return node;
        },

        insertBefore: function(node, key) {
            do {
                node = node.prev;
            } while( node.key !== null && ! this.leq(this.frame, node.key, key));

            var newNode = new DictNode();
            newNode.key = key;
            newNode.next = node.next;
            node.next.prev = newNode;
            newNode.prev = node;
            node.next = newNode;

            return newNode;
        },

        delete: function(node) {
            node.next.prev = node.prev;
            node.prev.next = node.next;
        }
    };


    function PQnode() {
        this.handle = null;
    }

    function PQhandleElem() {
        this.key = null;
        this.node = null;
    }

    function PriorityQ(size, leq) {
        this.size = 0;
        this.max = size;

        this.nodes = [];
        this.nodes.length = size+1;
        for (var i = 0; i < this.nodes.length; i++)
            this.nodes[i] = new PQnode();

        this.handles = [];
        this.handles.length = size+1;
        for (var i = 0; i < this.handles.length; i++)
            this.handles[i] = new PQhandleElem();

        this.initialized = false;
        this.freeList = 0;
        this.leq = leq;

        this.nodes[1].handle = 1;	/* so that Minimum() returns NULL */
        this.handles[1].key = null;
    }
    PriorityQ.prototype = {

        floatDown_: function( curr )
        {
            var n = this.nodes;
            var h = this.handles;
            var hCurr, hChild;
            var child;

            hCurr = n[curr].handle;
            for( ;; ) {
                child = curr << 1;
                if( child < this.size && this.leq( h[n[child+1].handle].key, h[n[child].handle].key )) {
                    ++child;
                }

                assert(child <= this.max);

                hChild = n[child].handle;
                if( child > this.size || this.leq( h[hCurr].key, h[hChild].key )) {
                    n[curr].handle = hCurr;
                    h[hCurr].node = curr;
                    break;
                }
                n[curr].handle = hChild;
                h[hChild].node = curr;
                curr = child;
            }
        },

        floatUp_: function( curr )
        {
            var n = this.nodes;
            var h = this.handles;
            var hCurr, hParent;
            var parent;

            hCurr = n[curr].handle;
            for( ;; ) {
                parent = curr >> 1;
                hParent = n[parent].handle;
                if( parent == 0 || this.leq( h[hParent].key, h[hCurr].key )) {
                    n[curr].handle = hCurr;
                    h[hCurr].node = curr;
                    break;
                }
                n[curr].handle = hParent;
                h[hParent].node = curr;
                curr = parent;
            }
        },

        init: function() {
            /* This method of building a heap is O(n), rather than O(n lg n). */
            for( var i = this.size; i >= 1; --i ) {
                this.floatDown_( i );
            }
            this.initialized = true;
        },

        min: function() {
            return this.handles[this.nodes[1].handle].key;
        },

        isEmpty: function() {
            this.size === 0;
        },

        /* really pqHeapInsert */
        /* returns INV_HANDLE iff out of memory */
        //PQhandle pqHeapInsert( TESSalloc* alloc, PriorityQHeap *pq, PQkey keyNew )
        insert: function(keyNew)
        {
            var curr;
            var free;

            curr = ++this.size;
            if( (curr*2) > this.max ) {
                this.max *= 2;
                var s;
                s = this.nodes.length;
                this.nodes.length = this.max+1;
                for (var i = s; i < this.nodes.length; i++)
                    this.nodes[i] = new PQnode();

                s = this.handles.length;
                this.handles.length = this.max+1;
                for (var i = s; i < this.handles.length; i++)
                    this.handles[i] = new PQhandleElem();
            }

            if( this.freeList === 0 ) {
                free = curr;
            } else {
                free = this.freeList;
                this.freeList = this.handles[free].node;
            }

            this.nodes[curr].handle = free;
            this.handles[free].node = curr;
            this.handles[free].key = keyNew;

            if( this.initialized ) {
                this.floatUp_( curr );
            }
            return free;
        },

        //PQkey pqHeapExtractMin( PriorityQHeap *pq )
        extractMin: function() {
            var n = this.nodes;
            var h = this.handles;
            var hMin = n[1].handle;
            var min = h[hMin].key;

            if( this.size > 0 ) {
                n[1].handle = n[this.size].handle;
                h[n[1].handle].node = 1;

                h[hMin].key = null;
                h[hMin].node = this.freeList;
                this.freeList = hMin;

                --this.size;
                if( this.size > 0 ) {
                    this.floatDown_( 1 );
                }
            }
            return min;
        },

        delete: function( hCurr ) {
            var n = this.nodes;
            var h = this.handles;
            var curr;

            assert( hCurr >= 1 && hCurr <= this.max && h[hCurr].key !== null );

            curr = h[hCurr].node;
            n[curr].handle = n[this.size].handle;
            h[n[curr].handle].node = curr;

            --this.size;
            if( curr <= this.size ) {
                if( curr <= 1 || this.leq( h[n[curr>>1].handle].key, h[n[curr].handle].key )) {
                    this.floatDown_( curr );
                } else {
                    this.floatUp_( curr );
                }
            }
            h[hCurr].key = null;
            h[hCurr].node = this.freeList;
            this.freeList = hCurr;
        }
    };


    /* For each pair of adjacent edges crossing the sweep line, there is
    * an ActiveRegion to represent the region between them.  The active
    * regions are kept in sorted order in a dynamic dictionary.  As the
    * sweep line crosses each vertex, we update the affected regions.
    */

    function ActiveRegion() {
        this.eUp = null;		/* upper edge, directed right to left */
        this.nodeUp = null;	/* dictionary node corresponding to eUp */
        this.windingNumber = 0;	/* used to determine which regions are
    								* inside the polygon */
        this.inside = false;		/* is this region inside the polygon? */
        this.sentinel = false;	/* marks fake edges at t = +/-infinity */
        this.dirty = false;		/* marks regions where the upper or lower
    						* edge has changed, but we haven't checked
    						* whether they intersect yet */
        this.fixUpperEdge = false;	/* marks temporary edges introduced when
    							* we process a "right vertex" (one without
    							* any edges leaving to the right) */
    }
    var Sweep = {};

    Sweep.regionBelow = function(r) {
        return r.nodeUp.prev.key;
    };

    Sweep.regionAbove = function(r) {
        return r.nodeUp.next.key;
    };

    Sweep.debugEvent = function( tess ) {
        // empty
    };


    /*
    * Invariants for the Edge Dictionary.
    * - each pair of adjacent edges e2=Succ(e1) satisfies EdgeLeq(e1,e2)
    *   at any valid location of the sweep event
    * - if EdgeLeq(e2,e1) as well (at any valid sweep event), then e1 and e2
    *   share a common endpoint
    * - for each e, e->Dst has been processed, but not e->Org
    * - each edge e satisfies VertLeq(e->Dst,event) && VertLeq(event,e->Org)
    *   where "event" is the current sweep line event.
    * - no edge e has zero length
    *
    * Invariants for the Mesh (the processed portion).
    * - the portion of the mesh left of the sweep line is a planar graph,
    *   ie. there is *some* way to embed it in the plane
    * - no processed edge has zero length
    * - no two processed vertices have identical coordinates
    * - each "inside" region is monotone, ie. can be broken into two chains
    *   of monotonically increasing vertices according to VertLeq(v1,v2)
    *   - a non-invariant: these chains may intersect (very slightly)
    *
    * Invariants for the Sweep.
    * - if none of the edges incident to the event vertex have an activeRegion
    *   (ie. none of these edges are in the edge dictionary), then the vertex
    *   has only right-going edges.
    * - if an edge is marked "fixUpperEdge" (it is a temporary edge introduced
    *   by ConnectRightVertex), then it is the only right-going edge from
    *   its associated vertex.  (This says that these edges exist only
    *   when it is necessary.)
    */

    /* When we merge two edges into one, we need to compute the combined
    * winding of the new edge.
    */
    Sweep.addWinding = function(eDst,eSrc) {
        eDst.winding += eSrc.winding;
        eDst.Sym.winding += eSrc.Sym.winding;
    };


    //static int EdgeLeq( TESStesselator *tess, ActiveRegion *reg1, ActiveRegion *reg2 )
    Sweep.edgeLeq = function( tess, reg1, reg2 ) {
        /*
        * Both edges must be directed from right to left (this is the canonical
        * direction for the upper edge of each region).
        *
        * The strategy is to evaluate a "t" value for each edge at the
        * current sweep line position, given by tess->event.  The calculations
        * are designed to be very stable, but of course they are not perfect.
        *
        * Special case: if both edge destinations are at the sweep event,
        * we sort the edges by slope (they would otherwise compare equally).
        */
        var ev = tess.event;
        var t1, t2;

        var e1 = reg1.eUp;
        var e2 = reg2.eUp;

        if( e1.Dst === ev ) {
            if( e2.Dst === ev ) {
                /* Two edges right of the sweep line which meet at the sweep event.
                * Sort them by slope.
                */
                if( Geom.vertLeq( e1.Org, e2.Org )) {
                    return Geom.edgeSign( e2.Dst, e1.Org, e2.Org ) <= 0;
                }
                return Geom.edgeSign( e1.Dst, e2.Org, e1.Org ) >= 0;
            }
            return Geom.edgeSign( e2.Dst, ev, e2.Org ) <= 0;
        }
        if( e2.Dst === ev ) {
            return Geom.edgeSign( e1.Dst, ev, e1.Org ) >= 0;
        }

        /* General case - compute signed distance *from* e1, e2 to event */
        var t1 = Geom.edgeEval( e1.Dst, ev, e1.Org );
        var t2 = Geom.edgeEval( e2.Dst, ev, e2.Org );
        return (t1 >= t2);
    };


    //static void DeleteRegion( TESStesselator *tess, ActiveRegion *reg )
    Sweep.deleteRegion = function( tess, reg ) {
        if( reg.fixUpperEdge ) {
            /* It was created with zero winding number, so it better be
            * deleted with zero winding number (ie. it better not get merged
            * with a real edge).
            */
            assert( reg.eUp.winding === 0 );
        }
        reg.eUp.activeRegion = null;
        tess.dict.delete( reg.nodeUp );
    };

    //static int FixUpperEdge( TESStesselator *tess, ActiveRegion *reg, TESShalfEdge *newEdge )
    Sweep.fixUpperEdge = function( tess, reg, newEdge ) {
        /*
        * Replace an upper edge which needs fixing (see ConnectRightVertex).
        */
        assert( reg.fixUpperEdge );
        tess.mesh.delete( reg.eUp );
        reg.fixUpperEdge = false;
        reg.eUp = newEdge;
        newEdge.activeRegion = reg;
    };

    //static ActiveRegion *TopLeftRegion( TESStesselator *tess, ActiveRegion *reg )
    Sweep.topLeftRegion = function( tess, reg ) {
        var org = reg.eUp.Org;
        var e;

        /* Find the region above the uppermost edge with the same origin */
        do {
            reg = Sweep.regionAbove( reg );
        } while( reg.eUp.Org === org );

        /* If the edge above was a temporary edge introduced by ConnectRightVertex,
        * now is the time to fix it.
        */
        if( reg.fixUpperEdge ) {
            e = tess.mesh.connect( Sweep.regionBelow(reg).eUp.Sym, reg.eUp.Lnext );
            if (e === null) return null;
            Sweep.fixUpperEdge( tess, reg, e );
            reg = Sweep.regionAbove( reg );
        }
        return reg;
    };

    //static ActiveRegion *TopRightRegion( ActiveRegion *reg )
    Sweep.topRightRegion = function( reg )
    {
        var dst = reg.eUp.Dst;
        var reg = null;
        /* Find the region above the uppermost edge with the same destination */
        do {
            reg = Sweep.regionAbove( reg );
        } while( reg.eUp.Dst === dst );
        return reg;
    };

    //static ActiveRegion *AddRegionBelow( TESStesselator *tess, ActiveRegion *regAbove, TESShalfEdge *eNewUp )
    Sweep.addRegionBelow = function( tess, regAbove, eNewUp ) {
        /*
        * Add a new active region to the sweep line, *somewhere* below "regAbove"
        * (according to where the new edge belongs in the sweep-line dictionary).
        * The upper edge of the new region will be "eNewUp".
        * Winding number and "inside" flag are not updated.
        */
        var regNew = new ActiveRegion();
        regNew.eUp = eNewUp;
        regNew.nodeUp = tess.dict.insertBefore( regAbove.nodeUp, regNew );
        //	if (regNew->nodeUp == NULL) longjmp(tess->env,1);
        regNew.fixUpperEdge = false;
        regNew.sentinel = false;
        regNew.dirty = false;

        eNewUp.activeRegion = regNew;
        return regNew;
    };

    //static int IsWindingInside( TESStesselator *tess, int n )
    Sweep.isWindingInside = function( tess, n ) {
        switch( tess.windingRule ) {
            case Tess2.WINDING_ODD:
                return (n & 1) != 0;
            case Tess2.WINDING_NONZERO:
                return (n != 0);
            case Tess2.WINDING_POSITIVE:
                return (n > 0);
            case Tess2.WINDING_NEGATIVE:
                return (n < 0);
            case Tess2.WINDING_ABS_GEQ_TWO:
                return (n >= 2) || (n <= -2);
        }
        assert( false );
        return false;
    };

    //static void ComputeWinding( TESStesselator *tess, ActiveRegion *reg )
    Sweep.computeWinding = function( tess, reg ) {
        reg.windingNumber = Sweep.regionAbove(reg).windingNumber + reg.eUp.winding;
        reg.inside = Sweep.isWindingInside( tess, reg.windingNumber );
    };


    //static void FinishRegion( TESStesselator *tess, ActiveRegion *reg )
    Sweep.finishRegion = function( tess, reg ) {
        /*
        * Delete a region from the sweep line.  This happens when the upper
        * and lower chains of a region meet (at a vertex on the sweep line).
        * The "inside" flag is copied to the appropriate mesh face (we could
        * not do this before -- since the structure of the mesh is always
        * changing, this face may not have even existed until now).
        */
        var e = reg.eUp;
        var f = e.Lface;

        f.inside = reg.inside;
        f.anEdge = e;   /* optimization for tessMeshTessellateMonoRegion() */
        Sweep.deleteRegion( tess, reg );
    };


    //static TESShalfEdge *FinishLeftRegions( TESStesselator *tess, ActiveRegion *regFirst, ActiveRegion *regLast )
    Sweep.finishLeftRegions = function( tess, regFirst, regLast ) {
        /*
        * We are given a vertex with one or more left-going edges.  All affected
        * edges should be in the edge dictionary.  Starting at regFirst->eUp,
        * we walk down deleting all regions where both edges have the same
        * origin vOrg.  At the same time we copy the "inside" flag from the
        * active region to the face, since at this point each face will belong
        * to at most one region (this was not necessarily true until this point
        * in the sweep).  The walk stops at the region above regLast; if regLast
        * is NULL we walk as far as possible.  At the same time we relink the
        * mesh if necessary, so that the ordering of edges around vOrg is the
        * same as in the dictionary.
        */
        var e, ePrev;
        var reg = null;
        var regPrev = regFirst;
        var ePrev = regFirst.eUp;
        while( regPrev !== regLast ) {
            regPrev.fixUpperEdge = false;	/* placement was OK */
            reg = Sweep.regionBelow( regPrev );
            e = reg.eUp;
            if( e.Org != ePrev.Org ) {
                if( ! reg.fixUpperEdge ) {
                    /* Remove the last left-going edge.  Even though there are no further
                    * edges in the dictionary with this origin, there may be further
                    * such edges in the mesh (if we are adding left edges to a vertex
                    * that has already been processed).  Thus it is important to call
                    * FinishRegion rather than just DeleteRegion.
                    */
                    Sweep.finishRegion( tess, regPrev );
                    break;
                }
                /* If the edge below was a temporary edge introduced by
                * ConnectRightVertex, now is the time to fix it.
                */
                e = tess.mesh.connect( ePrev.Lprev, e.Sym );
                //			if (e == NULL) longjmp(tess->env,1);
                Sweep.fixUpperEdge( tess, reg, e );
            }

            /* Relink edges so that ePrev->Onext == e */
            if( ePrev.Onext !== e ) {
                tess.mesh.splice( e.Oprev, e );
                tess.mesh.splice( ePrev, e );
            }
            Sweep.finishRegion( tess, regPrev );	/* may change reg->eUp */
            ePrev = reg.eUp;
            regPrev = reg;
        }
        return ePrev;
    };


    //static void AddRightEdges( TESStesselator *tess, ActiveRegion *regUp, TESShalfEdge *eFirst, TESShalfEdge *eLast, TESShalfEdge *eTopLeft, int cleanUp )
    Sweep.addRightEdges = function( tess, regUp, eFirst, eLast, eTopLeft, cleanUp ) {
        /*
        * Purpose: insert right-going edges into the edge dictionary, and update
        * winding numbers and mesh connectivity appropriately.  All right-going
        * edges share a common origin vOrg.  Edges are inserted CCW starting at
        * eFirst; the last edge inserted is eLast->Oprev.  If vOrg has any
        * left-going edges already processed, then eTopLeft must be the edge
        * such that an imaginary upward vertical segment from vOrg would be
        * contained between eTopLeft->Oprev and eTopLeft; otherwise eTopLeft
        * should be NULL.
        */
        var reg, regPrev;
        var e, ePrev;
        var firstTime = true;

        /* Insert the new right-going edges in the dictionary */
        e = eFirst;
        do {
            assert( Geom.vertLeq( e.Org, e.Dst ));
            Sweep.addRegionBelow( tess, regUp, e.Sym );
            e = e.Onext;
        } while ( e !== eLast );

        /* Walk *all* right-going edges from e->Org, in the dictionary order,
        * updating the winding numbers of each region, and re-linking the mesh
        * edges to match the dictionary ordering (if necessary).
        */
        if( eTopLeft === null ) {
            eTopLeft = Sweep.regionBelow( regUp ).eUp.Rprev;
        }
        regPrev = regUp;
        ePrev = eTopLeft;
        for( ;; ) {
            reg = Sweep.regionBelow( regPrev );
            e = reg.eUp.Sym;
            if( e.Org !== ePrev.Org ) break;

            if( e.Onext !== ePrev ) {
                /* Unlink e from its current position, and relink below ePrev */
                tess.mesh.splice( e.Oprev, e );
                tess.mesh.splice( ePrev.Oprev, e );
            }
            /* Compute the winding number and "inside" flag for the new regions */
            reg.windingNumber = regPrev.windingNumber - e.winding;
            reg.inside = Sweep.isWindingInside( tess, reg.windingNumber );

            /* Check for two outgoing edges with same slope -- process these
            * before any intersection tests (see example in tessComputeInterior).
            */
            regPrev.dirty = true;
            if( ! firstTime && Sweep.checkForRightSplice( tess, regPrev )) {
                Sweep.addWinding( e, ePrev );
                Sweep.deleteRegion( tess, regPrev );
                tess.mesh.delete( ePrev );
            }
            firstTime = false;
            regPrev = reg;
            ePrev = e;
        }
        regPrev.dirty = true;
        assert( regPrev.windingNumber - e.winding === reg.windingNumber );

        if( cleanUp ) {
            /* Check for intersections between newly adjacent edges. */
            Sweep.walkDirtyRegions( tess, regPrev );
        }
    };


    //static void SpliceMergeVertices( TESStesselator *tess, TESShalfEdge *e1, TESShalfEdge *e2 )
    Sweep.spliceMergeVertices = function( tess, e1, e2 ) {
        /*
        * Two vertices with idential coordinates are combined into one.
        * e1->Org is kept, while e2->Org is discarded.
        */
        tess.mesh.splice( e1, e2 );
    };

    //static void VertexWeights( TESSvertex *isect, TESSvertex *org, TESSvertex *dst, TESSreal *weights )
    Sweep.vertexWeights = function( isect, org, dst ) {
        /*
        * Find some weights which describe how the intersection vertex is
        * a linear combination of "org" and "dest".  Each of the two edges
        * which generated "isect" is allocated 50% of the weight; each edge
        * splits the weight between its org and dst according to the
        * relative distance to "isect".
        */
        var t1 = Geom.vertL1dist( org, isect );
        var t2 = Geom.vertL1dist( dst, isect );
        var w0 = 0.5 * t2 / (t1 + t2);
        var w1 = 0.5 * t1 / (t1 + t2);
        isect.coords[0] += w0*org.coords[0] + w1*dst.coords[0];
        isect.coords[1] += w0*org.coords[1] + w1*dst.coords[1];
        isect.coords[2] += w0*org.coords[2] + w1*dst.coords[2];
    };


    //static void GetIntersectData( TESStesselator *tess, TESSvertex *isect, TESSvertex *orgUp, TESSvertex *dstUp, TESSvertex *orgLo, TESSvertex *dstLo )
    Sweep.getIntersectData = function( tess, isect, orgUp, dstUp, orgLo, dstLo ) {
        /*
        * We've computed a new intersection point, now we need a "data" pointer
        * from the user so that we can refer to this new vertex in the
        * rendering callbacks.
        */
        isect.coords[0] = isect.coords[1] = isect.coords[2] = 0;
        isect.idx = -1;
        Sweep.vertexWeights( isect, orgUp, dstUp );
        Sweep.vertexWeights( isect, orgLo, dstLo );
    };

    //static int CheckForRightSplice( TESStesselator *tess, ActiveRegion *regUp )
    Sweep.checkForRightSplice = function( tess, regUp ) {
        /*
        * Check the upper and lower edge of "regUp", to make sure that the
        * eUp->Org is above eLo, or eLo->Org is below eUp (depending on which
        * origin is leftmost).
        *
        * The main purpose is to splice right-going edges with the same
        * dest vertex and nearly identical slopes (ie. we can't distinguish
        * the slopes numerically).  However the splicing can also help us
        * to recover from numerical errors.  For example, suppose at one
        * point we checked eUp and eLo, and decided that eUp->Org is barely
        * above eLo.  Then later, we split eLo into two edges (eg. from
        * a splice operation like this one).  This can change the result of
        * our test so that now eUp->Org is incident to eLo, or barely below it.
        * We must correct this condition to maintain the dictionary invariants.
        *
        * One possibility is to check these edges for intersection again
        * (ie. CheckForIntersect).  This is what we do if possible.  However
        * CheckForIntersect requires that tess->event lies between eUp and eLo,
        * so that it has something to fall back on when the intersection
        * calculation gives us an unusable answer.  So, for those cases where
        * we can't check for intersection, this routine fixes the problem
        * by just splicing the offending vertex into the other edge.
        * This is a guaranteed solution, no matter how degenerate things get.
        * Basically this is a combinatorial solution to a numerical problem.
        */
        var regLo = Sweep.regionBelow(regUp);
        var eUp = regUp.eUp;
        var eLo = regLo.eUp;

        if( Geom.vertLeq( eUp.Org, eLo.Org )) {
            if( Geom.edgeSign( eLo.Dst, eUp.Org, eLo.Org ) > 0 ) return false;

            /* eUp->Org appears to be below eLo */
            if( ! Geom.vertEq( eUp.Org, eLo.Org )) {
                /* Splice eUp->Org into eLo */
                tess.mesh.splitEdge( eLo.Sym );
                tess.mesh.splice( eUp, eLo.Oprev );
                regUp.dirty = regLo.dirty = true;

            } else if( eUp.Org !== eLo.Org ) {
                /* merge the two vertices, discarding eUp->Org */
                tess.pq.delete( eUp.Org.pqHandle );
                Sweep.spliceMergeVertices( tess, eLo.Oprev, eUp );
            }
        } else {
            if( Geom.edgeSign( eUp.Dst, eLo.Org, eUp.Org ) < 0 ) return false;

            /* eLo->Org appears to be above eUp, so splice eLo->Org into eUp */
            Sweep.regionAbove(regUp).dirty = regUp.dirty = true;
            tess.mesh.splitEdge( eUp.Sym );
            tess.mesh.splice( eLo.Oprev, eUp );
        }
        return true;
    };

    //static int CheckForLeftSplice( TESStesselator *tess, ActiveRegion *regUp )
    Sweep.checkForLeftSplice = function( tess, regUp ) {
        /*
        * Check the upper and lower edge of "regUp", to make sure that the
        * eUp->Dst is above eLo, or eLo->Dst is below eUp (depending on which
        * destination is rightmost).
        *
        * Theoretically, this should always be true.  However, splitting an edge
        * into two pieces can change the results of previous tests.  For example,
        * suppose at one point we checked eUp and eLo, and decided that eUp->Dst
        * is barely above eLo.  Then later, we split eLo into two edges (eg. from
        * a splice operation like this one).  This can change the result of
        * the test so that now eUp->Dst is incident to eLo, or barely below it.
        * We must correct this condition to maintain the dictionary invariants
        * (otherwise new edges might get inserted in the wrong place in the
        * dictionary, and bad stuff will happen).
        *
        * We fix the problem by just splicing the offending vertex into the
        * other edge.
        */
        var regLo = Sweep.regionBelow(regUp);
        var eUp = regUp.eUp;
        var eLo = regLo.eUp;
        var e;

        assert( ! Geom.vertEq( eUp.Dst, eLo.Dst ));

        if( Geom.vertLeq( eUp.Dst, eLo.Dst )) {
            if( Geom.edgeSign( eUp.Dst, eLo.Dst, eUp.Org ) < 0 ) return false;

            /* eLo->Dst is above eUp, so splice eLo->Dst into eUp */
            Sweep.regionAbove(regUp).dirty = regUp.dirty = true;
            e = tess.mesh.splitEdge( eUp );
            tess.mesh.splice( eLo.Sym, e );
            e.Lface.inside = regUp.inside;
        } else {
            if( Geom.edgeSign( eLo.Dst, eUp.Dst, eLo.Org ) > 0 ) return false;

            /* eUp->Dst is below eLo, so splice eUp->Dst into eLo */
            regUp.dirty = regLo.dirty = true;
            e = tess.mesh.splitEdge( eLo );
            tess.mesh.splice( eUp.Lnext, eLo.Sym );
            e.Rface.inside = regUp.inside;
        }
        return true;
    };


    //static int CheckForIntersect( TESStesselator *tess, ActiveRegion *regUp )
    Sweep.checkForIntersect = function( tess, regUp ) {
        /*
        * Check the upper and lower edges of the given region to see if
        * they intersect.  If so, create the intersection and add it
        * to the data structures.
        *
        * Returns TRUE if adding the new intersection resulted in a recursive
        * call to AddRightEdges(); in this case all "dirty" regions have been
        * checked for intersections, and possibly regUp has been deleted.
        */
        var regLo = Sweep.regionBelow(regUp);
        var eUp = regUp.eUp;
        var eLo = regLo.eUp;
        var orgUp = eUp.Org;
        var orgLo = eLo.Org;
        var dstUp = eUp.Dst;
        var dstLo = eLo.Dst;
        var tMinUp, tMaxLo;
        var isect = new TESSvertex, orgMin;
        var e;

        assert( ! Geom.vertEq( dstLo, dstUp ));
        assert( Geom.edgeSign( dstUp, tess.event, orgUp ) <= 0 );
        assert( Geom.edgeSign( dstLo, tess.event, orgLo ) >= 0 );
        assert( orgUp !== tess.event && orgLo !== tess.event );
        assert( ! regUp.fixUpperEdge && ! regLo.fixUpperEdge );

        if( orgUp === orgLo ) return false;	/* right endpoints are the same */

        tMinUp = Math.min( orgUp.t, dstUp.t );
        tMaxLo = Math.max( orgLo.t, dstLo.t );
        if( tMinUp > tMaxLo ) return false;	/* t ranges do not overlap */

        if( Geom.vertLeq( orgUp, orgLo )) {
            if( Geom.edgeSign( dstLo, orgUp, orgLo ) > 0 ) return false;
        } else {
            if( Geom.edgeSign( dstUp, orgLo, orgUp ) < 0 ) return false;
        }

        /* At this point the edges intersect, at least marginally */
        Sweep.debugEvent( tess );

        Geom.intersect( dstUp, orgUp, dstLo, orgLo, isect );
        /* The following properties are guaranteed: */
        assert( Math.min( orgUp.t, dstUp.t ) <= isect.t );
        assert( isect.t <= Math.max( orgLo.t, dstLo.t ));
        assert( Math.min( dstLo.s, dstUp.s ) <= isect.s );
        assert( isect.s <= Math.max( orgLo.s, orgUp.s ));

        if( Geom.vertLeq( isect, tess.event )) {
            /* The intersection point lies slightly to the left of the sweep line,
            * so move it until it''s slightly to the right of the sweep line.
            * (If we had perfect numerical precision, this would never happen
            * in the first place).  The easiest and safest thing to do is
            * replace the intersection by tess->event.
            */
            isect.s = tess.event.s;
            isect.t = tess.event.t;
        }
        /* Similarly, if the computed intersection lies to the right of the
        * rightmost origin (which should rarely happen), it can cause
        * unbelievable inefficiency on sufficiently degenerate inputs.
        * (If you have the test program, try running test54.d with the
        * "X zoom" option turned on).
        */
        orgMin = Geom.vertLeq( orgUp, orgLo ) ? orgUp : orgLo;
        if( Geom.vertLeq( orgMin, isect )) {
            isect.s = orgMin.s;
            isect.t = orgMin.t;
        }

        if( Geom.vertEq( isect, orgUp ) || Geom.vertEq( isect, orgLo )) {
            /* Easy case -- intersection at one of the right endpoints */
            Sweep.checkForRightSplice( tess, regUp );
            return false;
        }

        if(    (! Geom.vertEq( dstUp, tess.event )
            && Geom.edgeSign( dstUp, tess.event, isect ) >= 0)
            || (! Geom.vertEq( dstLo, tess.event )
                && Geom.edgeSign( dstLo, tess.event, isect ) <= 0 ))
        {
            /* Very unusual -- the new upper or lower edge would pass on the
            * wrong side of the sweep event, or through it.  This can happen
            * due to very small numerical errors in the intersection calculation.
            */
            if( dstLo === tess.event ) {
                /* Splice dstLo into eUp, and process the new region(s) */
                tess.mesh.splitEdge( eUp.Sym );
                tess.mesh.splice( eLo.Sym, eUp );
                regUp = Sweep.topLeftRegion( tess, regUp );
                //			if (regUp == NULL) longjmp(tess->env,1);
                eUp = Sweep.regionBelow(regUp).eUp;
                Sweep.finishLeftRegions( tess, Sweep.regionBelow(regUp), regLo );
                Sweep.addRightEdges( tess, regUp, eUp.Oprev, eUp, eUp, true );
                return TRUE;
            }
            if( dstUp === tess.event ) {
                /* Splice dstUp into eLo, and process the new region(s) */
                tess.mesh.splitEdge( eLo.Sym );
                tess.mesh.splice( eUp.Lnext, eLo.Oprev );
                regLo = regUp;
                regUp = Sweep.topRightRegion( regUp );
                e = Sweep.regionBelow(regUp).eUp.Rprev;
                regLo.eUp = eLo.Oprev;
                eLo = Sweep.finishLeftRegions( tess, regLo, null );
                Sweep.addRightEdges( tess, regUp, eLo.Onext, eUp.Rprev, e, true );
                return true;
            }
            /* Special case: called from ConnectRightVertex.  If either
            * edge passes on the wrong side of tess->event, split it
            * (and wait for ConnectRightVertex to splice it appropriately).
            */
            if( Geom.edgeSign( dstUp, tess.event, isect ) >= 0 ) {
                Sweep.regionAbove(regUp).dirty = regUp.dirty = true;
                tess.mesh.splitEdge( eUp.Sym );
                eUp.Org.s = tess.event.s;
                eUp.Org.t = tess.event.t;
            }
            if( Geom.edgeSign( dstLo, tess.event, isect ) <= 0 ) {
                regUp.dirty = regLo.dirty = true;
                tess.mesh.splitEdge( eLo.Sym );
                eLo.Org.s = tess.event.s;
                eLo.Org.t = tess.event.t;
            }
            /* leave the rest for ConnectRightVertex */
            return false;
        }

        /* General case -- split both edges, splice into new vertex.
        * When we do the splice operation, the order of the arguments is
        * arbitrary as far as correctness goes.  However, when the operation
        * creates a new face, the work done is proportional to the size of
        * the new face.  We expect the faces in the processed part of
        * the mesh (ie. eUp->Lface) to be smaller than the faces in the
        * unprocessed original contours (which will be eLo->Oprev->Lface).
        */
        tess.mesh.splitEdge( eUp.Sym );
        tess.mesh.splitEdge( eLo.Sym );
        tess.mesh.splice( eLo.Oprev, eUp );
        eUp.Org.s = isect.s;
        eUp.Org.t = isect.t;
        eUp.Org.pqHandle = tess.pq.insert( eUp.Org );
        Sweep.getIntersectData( tess, eUp.Org, orgUp, dstUp, orgLo, dstLo );
        Sweep.regionAbove(regUp).dirty = regUp.dirty = regLo.dirty = true;
        return false;
    };

    //static void WalkDirtyRegions( TESStesselator *tess, ActiveRegion *regUp )
    Sweep.walkDirtyRegions = function( tess, regUp ) {
        /*
        * When the upper or lower edge of any region changes, the region is
        * marked "dirty".  This routine walks through all the dirty regions
        * and makes sure that the dictionary invariants are satisfied
        * (see the comments at the beginning of this file).  Of course
        * new dirty regions can be created as we make changes to restore
        * the invariants.
        */
        var regLo = Sweep.regionBelow(regUp);
        var eUp, eLo;

        for( ;; ) {
            /* Find the lowest dirty region (we walk from the bottom up). */
            while( regLo.dirty ) {
                regUp = regLo;
                regLo = Sweep.regionBelow(regLo);
            }
            if( ! regUp.dirty ) {
                regLo = regUp;
                regUp = Sweep.regionAbove( regUp );
                if( regUp == null || ! regUp.dirty ) {
                    /* We've walked all the dirty regions */
                    return;
                }
            }
            regUp.dirty = false;
            eUp = regUp.eUp;
            eLo = regLo.eUp;

            if( eUp.Dst !== eLo.Dst ) {
                /* Check that the edge ordering is obeyed at the Dst vertices. */
                if( Sweep.checkForLeftSplice( tess, regUp )) {

                    /* If the upper or lower edge was marked fixUpperEdge, then
                    * we no longer need it (since these edges are needed only for
                    * vertices which otherwise have no right-going edges).
                    */
                    if( regLo.fixUpperEdge ) {
                        Sweep.deleteRegion( tess, regLo );
                        tess.mesh.delete( eLo );
                        regLo = Sweep.regionBelow( regUp );
                        eLo = regLo.eUp;
                    } else if( regUp.fixUpperEdge ) {
                        Sweep.deleteRegion( tess, regUp );
                        tess.mesh.delete( eUp );
                        regUp = Sweep.regionAbove( regLo );
                        eUp = regUp.eUp;
                    }
                }
            }
            if( eUp.Org !== eLo.Org ) {
                if(    eUp.Dst !== eLo.Dst
                    && ! regUp.fixUpperEdge && ! regLo.fixUpperEdge
                    && (eUp.Dst === tess.event || eLo.Dst === tess.event) )
                {
                    /* When all else fails in CheckForIntersect(), it uses tess->event
                    * as the intersection location.  To make this possible, it requires
                    * that tess->event lie between the upper and lower edges, and also
                    * that neither of these is marked fixUpperEdge (since in the worst
                    * case it might splice one of these edges into tess->event, and
                    * violate the invariant that fixable edges are the only right-going
                    * edge from their associated vertex).
                    */
                    if( Sweep.checkForIntersect( tess, regUp )) {
                        /* WalkDirtyRegions() was called recursively; we're done */
                        return;
                    }
                } else {
                    /* Even though we can't use CheckForIntersect(), the Org vertices
                    * may violate the dictionary edge ordering.  Check and correct this.
                    */
                    Sweep.checkForRightSplice( tess, regUp );
                }
            }
            if( eUp.Org === eLo.Org && eUp.Dst === eLo.Dst ) {
                /* A degenerate loop consisting of only two edges -- delete it. */
                Sweep.addWinding( eLo, eUp );
                Sweep.deleteRegion( tess, regUp );
                tess.mesh.delete( eUp );
                regUp = Sweep.regionAbove( regLo );
            }
        }
    };


    //static void ConnectRightVertex( TESStesselator *tess, ActiveRegion *regUp, TESShalfEdge *eBottomLeft )
    Sweep.connectRightVertex = function( tess, regUp, eBottomLeft ) {
        /*
        * Purpose: connect a "right" vertex vEvent (one where all edges go left)
        * to the unprocessed portion of the mesh.  Since there are no right-going
        * edges, two regions (one above vEvent and one below) are being merged
        * into one.  "regUp" is the upper of these two regions.
        *
        * There are two reasons for doing this (adding a right-going edge):
        *  - if the two regions being merged are "inside", we must add an edge
        *    to keep them separated (the combined region would not be monotone).
        *  - in any case, we must leave some record of vEvent in the dictionary,
        *    so that we can merge vEvent with features that we have not seen yet.
        *    For example, maybe there is a vertical edge which passes just to
        *    the right of vEvent; we would like to splice vEvent into this edge.
        *
        * However, we don't want to connect vEvent to just any vertex.  We don''t
        * want the new edge to cross any other edges; otherwise we will create
        * intersection vertices even when the input data had no self-intersections.
        * (This is a bad thing; if the user's input data has no intersections,
        * we don't want to generate any false intersections ourselves.)
        *
        * Our eventual goal is to connect vEvent to the leftmost unprocessed
        * vertex of the combined region (the union of regUp and regLo).
        * But because of unseen vertices with all right-going edges, and also
        * new vertices which may be created by edge intersections, we don''t
        * know where that leftmost unprocessed vertex is.  In the meantime, we
        * connect vEvent to the closest vertex of either chain, and mark the region
        * as "fixUpperEdge".  This flag says to delete and reconnect this edge
        * to the next processed vertex on the boundary of the combined region.
        * Quite possibly the vertex we connected to will turn out to be the
        * closest one, in which case we won''t need to make any changes.
        */
        var eNew;
        var eTopLeft = eBottomLeft.Onext;
        var regLo = Sweep.regionBelow(regUp);
        var eUp = regUp.eUp;
        var eLo = regLo.eUp;
        var degenerate = false;

        if( eUp.Dst !== eLo.Dst ) {
            Sweep.checkForIntersect( tess, regUp );
        }

        /* Possible new degeneracies: upper or lower edge of regUp may pass
        * through vEvent, or may coincide with new intersection vertex
        */
        if( Geom.vertEq( eUp.Org, tess.event )) {
            tess.mesh.splice( eTopLeft.Oprev, eUp );
            regUp = Sweep.topLeftRegion( tess, regUp );
            eTopLeft = Sweep.regionBelow( regUp ).eUp;
            Sweep.finishLeftRegions( tess, Sweep.regionBelow(regUp), regLo );
            degenerate = true;
        }
        if( Geom.vertEq( eLo.Org, tess.event )) {
            tess.mesh.splice( eBottomLeft, eLo.Oprev );
            eBottomLeft = Sweep.finishLeftRegions( tess, regLo, null );
            degenerate = true;
        }
        if( degenerate ) {
            Sweep.addRightEdges( tess, regUp, eBottomLeft.Onext, eTopLeft, eTopLeft, true );
            return;
        }

        /* Non-degenerate situation -- need to add a temporary, fixable edge.
        * Connect to the closer of eLo->Org, eUp->Org.
        */
        if( Geom.vertLeq( eLo.Org, eUp.Org )) {
            eNew = eLo.Oprev;
        } else {
            eNew = eUp;
        }
        eNew = tess.mesh.connect( eBottomLeft.Lprev, eNew );

        /* Prevent cleanup, otherwise eNew might disappear before we've even
        * had a chance to mark it as a temporary edge.
        */
        Sweep.addRightEdges( tess, regUp, eNew, eNew.Onext, eNew.Onext, false );
        eNew.Sym.activeRegion.fixUpperEdge = true;
        Sweep.walkDirtyRegions( tess, regUp );
    };

    /* Because vertices at exactly the same location are merged together
    * before we process the sweep event, some degenerate cases can't occur.
    * However if someone eventually makes the modifications required to
    * merge features which are close together, the cases below marked
    * TOLERANCE_NONZERO will be useful.  They were debugged before the
    * code to merge identical vertices in the main loop was added.
    */
    //#define TOLERANCE_NONZERO	FALSE

    //static void ConnectLeftDegenerate( TESStesselator *tess, ActiveRegion *regUp, TESSvertex *vEvent )
    Sweep.connectLeftDegenerate = function( tess, regUp, vEvent ) {
        /*
        * The event vertex lies exacty on an already-processed edge or vertex.
        * Adding the new vertex involves splicing it into the already-processed
        * part of the mesh.
        */
        var e, eTopLeft, eTopRight, eLast;
        var reg;

        e = regUp.eUp;
        if( Geom.vertEq( e.Org, vEvent )) {
            /* e->Org is an unprocessed vertex - just combine them, and wait
            * for e->Org to be pulled from the queue
            */
            assert( false /*TOLERANCE_NONZERO*/ );
            Sweep.spliceMergeVertices( tess, e, vEvent.anEdge );
            return;
        }

        if( ! Geom.vertEq( e.Dst, vEvent )) {
            /* General case -- splice vEvent into edge e which passes through it */
            tess.mesh.splitEdge( e.Sym );
            if( regUp.fixUpperEdge ) {
                /* This edge was fixable -- delete unused portion of original edge */
                tess.mesh.delete( e.Onext );
                regUp.fixUpperEdge = false;
            }
            tess.mesh.splice( vEvent.anEdge, e );
            Sweep.sweepEvent( tess, vEvent );	/* recurse */
            return;
        }

        /* vEvent coincides with e->Dst, which has already been processed.
        * Splice in the additional right-going edges.
        */
        assert( false /*TOLERANCE_NONZERO*/ );
        regUp = Sweep.topRightRegion( regUp );
        reg = Sweep.regionBelow( regUp );
        eTopRight = reg.eUp.Sym;
        eTopLeft = eLast = eTopRight.Onext;
        if( reg.fixUpperEdge ) {
            /* Here e->Dst has only a single fixable edge going right.
            * We can delete it since now we have some real right-going edges.
            */
            assert( eTopLeft !== eTopRight );   /* there are some left edges too */
            Sweep.deleteRegion( tess, reg );
            tess.mesh.delete( eTopRight );
            eTopRight = eTopLeft.Oprev;
        }
        tess.mesh.splice( vEvent.anEdge, eTopRight );
        if( ! Geom.edgeGoesLeft( eTopLeft )) {
            /* e->Dst had no left-going edges -- indicate this to AddRightEdges() */
            eTopLeft = null;
        }
        Sweep.addRightEdges( tess, regUp, eTopRight.Onext, eLast, eTopLeft, true );
    };


    //static void ConnectLeftVertex( TESStesselator *tess, TESSvertex *vEvent )
    Sweep.connectLeftVertex = function( tess, vEvent ) {
        /*
        * Purpose: connect a "left" vertex (one where both edges go right)
        * to the processed portion of the mesh.  Let R be the active region
        * containing vEvent, and let U and L be the upper and lower edge
        * chains of R.  There are two possibilities:
        *
        * - the normal case: split R into two regions, by connecting vEvent to
        *   the rightmost vertex of U or L lying to the left of the sweep line
        *
        * - the degenerate case: if vEvent is close enough to U or L, we
        *   merge vEvent into that edge chain.  The subcases are:
        *	- merging with the rightmost vertex of U or L
        *	- merging with the active edge of U or L
        *	- merging with an already-processed portion of U or L
        */
        var regUp, regLo, reg;
        var eUp, eLo, eNew;
        var tmp = new ActiveRegion();

        /* assert( vEvent->anEdge->Onext->Onext == vEvent->anEdge ); */

        /* Get a pointer to the active region containing vEvent */
        tmp.eUp = vEvent.anEdge.Sym;
        /* __GL_DICTLISTKEY */ /* tessDictListSearch */
        regUp = tess.dict.search( tmp ).key;
        regLo = Sweep.regionBelow( regUp );
        if( !regLo ) {
            // This may happen if the input polygon is coplanar.
            return;
        }
        eUp = regUp.eUp;
        eLo = regLo.eUp;

        /* Try merging with U or L first */
        if( Geom.edgeSign( eUp.Dst, vEvent, eUp.Org ) === 0.0 ) {
            Sweep.connectLeftDegenerate( tess, regUp, vEvent );
            return;
        }

        /* Connect vEvent to rightmost processed vertex of either chain.
        * e->Dst is the vertex that we will connect to vEvent.
        */
        reg = Geom.vertLeq( eLo.Dst, eUp.Dst ) ? regUp : regLo;

        if( regUp.inside || reg.fixUpperEdge) {
            if( reg === regUp ) {
                eNew = tess.mesh.connect( vEvent.anEdge.Sym, eUp.Lnext );
            } else {
                var tempHalfEdge = tess.mesh.connect( eLo.Dnext, vEvent.anEdge);
                eNew = tempHalfEdge.Sym;
            }
            if( reg.fixUpperEdge ) {
                Sweep.fixUpperEdge( tess, reg, eNew );
            } else {
                Sweep.computeWinding( tess, Sweep.addRegionBelow( tess, regUp, eNew ));
            }
            Sweep.sweepEvent( tess, vEvent );
        } else {
            /* The new vertex is in a region which does not belong to the polygon.
            * We don''t need to connect this vertex to the rest of the mesh.
            */
            Sweep.addRightEdges( tess, regUp, vEvent.anEdge, vEvent.anEdge, null, true );
        }
    };


    //static void SweepEvent( TESStesselator *tess, TESSvertex *vEvent )
    Sweep.sweepEvent = function( tess, vEvent ) {
        /*
        * Does everything necessary when the sweep line crosses a vertex.
        * Updates the mesh and the edge dictionary.
        */

        tess.event = vEvent;		/* for access in EdgeLeq() */
        Sweep.debugEvent( tess );

        /* Check if this vertex is the right endpoint of an edge that is
        * already in the dictionary.  In this case we don't need to waste
        * time searching for the location to insert new edges.
        */
        var e = vEvent.anEdge;
        while( e.activeRegion === null ) {
            e = e.Onext;
            if( e == vEvent.anEdge ) {
                /* All edges go right -- not incident to any processed edges */
                Sweep.connectLeftVertex( tess, vEvent );
                return;
            }
        }

        /* Processing consists of two phases: first we "finish" all the
        * active regions where both the upper and lower edges terminate
        * at vEvent (ie. vEvent is closing off these regions).
        * We mark these faces "inside" or "outside" the polygon according
        * to their winding number, and delete the edges from the dictionary.
        * This takes care of all the left-going edges from vEvent.
        */
        var regUp = Sweep.topLeftRegion( tess, e.activeRegion );
        assert( regUp !== null );
        //	if (regUp == NULL) longjmp(tess->env,1);
        var reg = Sweep.regionBelow( regUp );
        var eTopLeft = reg.eUp;
        var eBottomLeft = Sweep.finishLeftRegions( tess, reg, null );

        /* Next we process all the right-going edges from vEvent.  This
        * involves adding the edges to the dictionary, and creating the
        * associated "active regions" which record information about the
        * regions between adjacent dictionary edges.
        */
        if( eBottomLeft.Onext === eTopLeft ) {
            /* No right-going edges -- add a temporary "fixable" edge */
            Sweep.connectRightVertex( tess, regUp, eBottomLeft );
        } else {
            Sweep.addRightEdges( tess, regUp, eBottomLeft.Onext, eTopLeft, eTopLeft, true );
        }
    };


    /* Make the sentinel coordinates big enough that they will never be
    * merged with real input features.
    */

    //static void AddSentinel( TESStesselator *tess, TESSreal smin, TESSreal smax, TESSreal t )
    Sweep.addSentinel = function( tess, smin, smax, t ) {
        /*
        * We add two sentinel edges above and below all other edges,
        * to avoid special cases at the top and bottom.
        */
        var reg = new ActiveRegion();
        var e = tess.mesh.makeEdge();
        //	if (e == NULL) longjmp(tess->env,1);

        e.Org.s = smax;
        e.Org.t = t;
        e.Dst.s = smin;
        e.Dst.t = t;
        tess.event = e.Dst;		/* initialize it */

        reg.eUp = e;
        reg.windingNumber = 0;
        reg.inside = false;
        reg.fixUpperEdge = false;
        reg.sentinel = true;
        reg.dirty = false;
        reg.nodeUp = tess.dict.insert( reg );
        //	if (reg->nodeUp == NULL) longjmp(tess->env,1);
    };


    //static void InitEdgeDict( TESStesselator *tess )
    Sweep.initEdgeDict = function( tess ) {
        /*
        * We maintain an ordering of edge intersections with the sweep line.
        * This order is maintained in a dynamic dictionary.
        */
        tess.dict = new Dict( tess, Sweep.edgeLeq );
        //	if (tess->dict == NULL) longjmp(tess->env,1);

        var w = (tess.bmax[0] - tess.bmin[0]);
        var h = (tess.bmax[1] - tess.bmin[1]);

        var smin = tess.bmin[0] - w;
        var smax = tess.bmax[0] + w;
        var tmin = tess.bmin[1] - h;
        var tmax = tess.bmax[1] + h;

        Sweep.addSentinel( tess, smin, smax, tmin );
        Sweep.addSentinel( tess, smin, smax, tmax );
    };


    Sweep.doneEdgeDict = function( tess )
    {
        var reg;
        var fixedEdges = 0;

        while( (reg = tess.dict.min().key) !== null ) {
            /*
            * At the end of all processing, the dictionary should contain
            * only the two sentinel edges, plus at most one "fixable" edge
            * created by ConnectRightVertex().
            */
            if( ! reg.sentinel ) {
                assert( reg.fixUpperEdge );
                assert( ++fixedEdges == 1 );
            }
            assert( reg.windingNumber == 0 );
            Sweep.deleteRegion( tess, reg );
            /*    tessMeshDelete( reg->eUp );*/
        }
        //	dictDeleteDict( &tess->alloc, tess->dict );
    };


    Sweep.removeDegenerateEdges = function( tess ) {
        /*
        * Remove zero-length edges, and contours with fewer than 3 vertices.
        */
        var e, eNext, eLnext;
        var eHead = tess.mesh.eHead;

        /*LINTED*/
        for( e = eHead.next; e !== eHead; e = eNext ) {
            eNext = e.next;
            eLnext = e.Lnext;

            if( Geom.vertEq( e.Org, e.Dst ) && e.Lnext.Lnext !== e ) {
                /* Zero-length edge, contour has at least 3 edges */
                Sweep.spliceMergeVertices( tess, eLnext, e );	/* deletes e->Org */
                tess.mesh.delete( e ); /* e is a self-loop */
                e = eLnext;
                eLnext = e.Lnext;
            }
            if( eLnext.Lnext === e ) {
                /* Degenerate contour (one or two edges) */
                if( eLnext !== e ) {
                    if( eLnext === eNext || eLnext === eNext.Sym ) { eNext = eNext.next; }
                    tess.mesh.delete( eLnext );
                }
                if( e === eNext || e === eNext.Sym ) { eNext = eNext.next; }
                tess.mesh.delete( e );
            }
        }
    };

    Sweep.initPriorityQ = function( tess ) {
        /*
        * Insert all vertices into the priority queue which determines the
        * order in which vertices cross the sweep line.
        */
        var pq;
        var v, vHead;
        var vertexCount = 0;

        vHead = tess.mesh.vHead;
        for( v = vHead.next; v !== vHead; v = v.next ) {
            vertexCount++;
        }
        /* Make sure there is enough space for sentinels. */
        vertexCount += 8; //MAX( 8, tess->alloc.extraVertices );

        pq = tess.pq = new PriorityQ( vertexCount, Geom.vertLeq );
        //	if (pq == NULL) return 0;

        vHead = tess.mesh.vHead;
        for( v = vHead.next; v !== vHead; v = v.next ) {
            v.pqHandle = pq.insert( v );
            //		if (v.pqHandle == INV_HANDLE)
            //			break;
        }

        if (v !== vHead) {
            return false;
        }

        pq.init();

        return true;
    };


    Sweep.donePriorityQ = function( tess ) {
        tess.pq = null;
    };


    Sweep.removeDegenerateFaces = function( tess, mesh ) {
        /*
        * Delete any degenerate faces with only two edges.  WalkDirtyRegions()
        * will catch almost all of these, but it won't catch degenerate faces
        * produced by splice operations on already-processed edges.
        * The two places this can happen are in FinishLeftRegions(), when
        * we splice in a "temporary" edge produced by ConnectRightVertex(),
        * and in CheckForLeftSplice(), where we splice already-processed
        * edges to ensure that our dictionary invariants are not violated
        * by numerical errors.
        *
        * In both these cases it is *very* dangerous to delete the offending
        * edge at the time, since one of the routines further up the stack
        * will sometimes be keeping a pointer to that edge.
        */
        var f, fNext;
        var e;

        /*LINTED*/
        for( f = mesh.fHead.next; f !== mesh.fHead; f = fNext ) {
            fNext = f.next;
            e = f.anEdge;
            assert( e.Lnext !== e );

            if( e.Lnext.Lnext === e ) {
                /* A face with only two edges */
                Sweep.addWinding( e.Onext, e );
                tess.mesh.delete( e );
            }
        }
        return true;
    };

    Sweep.computeInterior = function( tess ) {
        /*
        * tessComputeInterior( tess ) computes the planar arrangement specified
        * by the given contours, and further subdivides this arrangement
        * into regions.  Each region is marked "inside" if it belongs
        * to the polygon, according to the rule given by tess->windingRule.
        * Each interior region is guaranteed be monotone.
        */
        var v, vNext;

        /* Each vertex defines an event for our sweep line.  Start by inserting
        * all the vertices in a priority queue.  Events are processed in
        * lexicographic order, ie.
        *
        *	e1 < e2  iff  e1.x < e2.x || (e1.x == e2.x && e1.y < e2.y)
        */
        Sweep.removeDegenerateEdges( tess );
        if ( !Sweep.initPriorityQ( tess ) ) return false; /* if error */
        Sweep.initEdgeDict( tess );

        while( (v = tess.pq.extractMin()) !== null ) {
            for( ;; ) {
                vNext = tess.pq.min();
                if( vNext === null || ! Geom.vertEq( vNext, v )) break;

                /* Merge together all vertices at exactly the same location.
                * This is more efficient than processing them one at a time,
                * simplifies the code (see ConnectLeftDegenerate), and is also
                * important for correct handling of certain degenerate cases.
                * For example, suppose there are two identical edges A and B
                * that belong to different contours (so without this code they would
                * be processed by separate sweep events).  Suppose another edge C
                * crosses A and B from above.  When A is processed, we split it
                * at its intersection point with C.  However this also splits C,
                * so when we insert B we may compute a slightly different
                * intersection point.  This might leave two edges with a small
                * gap between them.  This kind of error is especially obvious
                * when using boundary extraction (TESS_BOUNDARY_ONLY).
                */
                vNext = tess.pq.extractMin();
                Sweep.spliceMergeVertices( tess, v.anEdge, vNext.anEdge );
            }
            Sweep.sweepEvent( tess, v );
        }

        /* Set tess->event for debugging purposes */
        tess.event = tess.dict.min().key.eUp.Org;
        Sweep.debugEvent( tess );
        Sweep.doneEdgeDict( tess );
        Sweep.donePriorityQ( tess );

        if ( !Sweep.removeDegenerateFaces( tess, tess.mesh ) ) return false;
        tess.mesh.check();

        return true;
    };


    function Tesselator() {

        /*** state needed for collecting the input data ***/
        this.mesh = null;		/* stores the input contours, and eventually
    							the tessellation itself */

        /*** state needed for projecting onto the sweep plane ***/

        this.normal = [0.0, 0.0, 0.0];	/* user-specified normal (if provided) */
        this.sUnit = [0.0, 0.0, 0.0];	/* unit vector in s-direction (debugging) */
        this.tUnit = [0.0, 0.0, 0.0];	/* unit vector in t-direction (debugging) */

        this.bmin = [0.0, 0.0];
        this.bmax = [0.0, 0.0];

        /*** state needed for the line sweep ***/
        this.windingRule = Tess2.WINDING_ODD;	/* rule for determining polygon interior */

        this.dict = null;		/* edge dictionary for sweep line */
        this.pq = null;		/* priority queue of vertex events */
        this.event = null;		/* current sweep event being processed */

        this.vertexIndexCounter = 0;

        this.vertices = [];
        this.vertexIndices = [];
        this.vertexCount = 0;
        this.elements = [];
        this.elementCount = 0;
    }
    Tesselator.prototype = {

        dot_: function(u, v) {
            return (u[0]*v[0] + u[1]*v[1] + u[2]*v[2]);
        },

        normalize_: function( v ) {
            var len = v[0]*v[0] + v[1]*v[1] + v[2]*v[2];
            assert( len > 0.0 );
            len = Math.sqrt( len );
            v[0] /= len;
            v[1] /= len;
            v[2] /= len;
        },

        longAxis_: function( v ) {
            var i = 0;
            if( Math.abs(v[1]) > Math.abs(v[0]) ) { i = 1; }
            if( Math.abs(v[2]) > Math.abs(v[i]) ) { i = 2; }
            return i;
        },

        computeNormal_: function( norm )
        {
            var v, v1, v2;
            var c, tLen2, maxLen2;
            var maxVal = [0,0,0], minVal = [0,0,0], d1 = [0,0,0], d2 = [0,0,0], tNorm = [0,0,0];
            var maxVert = [null,null,null], minVert = [null,null,null];
            var vHead = this.mesh.vHead;
            var i;

            v = vHead.next;
            for( i = 0; i < 3; ++i ) {
                c = v.coords[i];
                minVal[i] = c;
                minVert[i] = v;
                maxVal[i] = c;
                maxVert[i] = v;
            }

            for( v = vHead.next; v !== vHead; v = v.next ) {
                for( i = 0; i < 3; ++i ) {
                    c = v.coords[i];
                    if( c < minVal[i] ) { minVal[i] = c; minVert[i] = v; }
                    if( c > maxVal[i] ) { maxVal[i] = c; maxVert[i] = v; }
                }
            }

            /* Find two vertices separated by at least 1/sqrt(3) of the maximum
            * distance between any two vertices
            */
            i = 0;
            if( maxVal[1] - minVal[1] > maxVal[0] - minVal[0] ) { i = 1; }
            if( maxVal[2] - minVal[2] > maxVal[i] - minVal[i] ) { i = 2; }
            if( minVal[i] >= maxVal[i] ) {
                /* All vertices are the same -- normal doesn't matter */
                norm[0] = 0; norm[1] = 0; norm[2] = 1;
                return;
            }

            /* Look for a third vertex which forms the triangle with maximum area
            * (Length of normal == twice the triangle area)
            */
            maxLen2 = 0;
            v1 = minVert[i];
            v2 = maxVert[i];
            d1[0] = v1.coords[0] - v2.coords[0];
            d1[1] = v1.coords[1] - v2.coords[1];
            d1[2] = v1.coords[2] - v2.coords[2];
            for( v = vHead.next; v !== vHead; v = v.next ) {
                d2[0] = v.coords[0] - v2.coords[0];
                d2[1] = v.coords[1] - v2.coords[1];
                d2[2] = v.coords[2] - v2.coords[2];
                tNorm[0] = d1[1]*d2[2] - d1[2]*d2[1];
                tNorm[1] = d1[2]*d2[0] - d1[0]*d2[2];
                tNorm[2] = d1[0]*d2[1] - d1[1]*d2[0];
                tLen2 = tNorm[0]*tNorm[0] + tNorm[1]*tNorm[1] + tNorm[2]*tNorm[2];
                if( tLen2 > maxLen2 ) {
                    maxLen2 = tLen2;
                    norm[0] = tNorm[0];
                    norm[1] = tNorm[1];
                    norm[2] = tNorm[2];
                }
            }

            if( maxLen2 <= 0 ) {
                /* All points lie on a single line -- any decent normal will do */
                norm[0] = norm[1] = norm[2] = 0;
                norm[this.longAxis_(d1)] = 1;
            }
        },

        checkOrientation_: function() {
            var area;
            var f, fHead = this.mesh.fHead;
            var v, vHead = this.mesh.vHead;
            var e;

            /* When we compute the normal automatically, we choose the orientation
            * so that the the sum of the signed areas of all contours is non-negative.
            */
            area = 0;
            for( f = fHead.next; f !== fHead; f = f.next ) {
                e = f.anEdge;
                if( e.winding <= 0 ) continue;
                do {
                    area += (e.Org.s - e.Dst.s) * (e.Org.t + e.Dst.t);
                    e = e.Lnext;
                } while( e !== f.anEdge );
            }
            if( area < 0 ) {
                /* Reverse the orientation by flipping all the t-coordinates */
                for( v = vHead.next; v !== vHead; v = v.next ) {
                    v.t = - v.t;
                }
                this.tUnit[0] = - this.tUnit[0];
                this.tUnit[1] = - this.tUnit[1];
                this.tUnit[2] = - this.tUnit[2];
            }
        },

        /*	#ifdef FOR_TRITE_TEST_PROGRAM
            #include <stdlib.h>
            extern int RandomSweep;
            #define S_UNIT_X	(RandomSweep ? (2*drand48()-1) : 1.0)
            #define S_UNIT_Y	(RandomSweep ? (2*drand48()-1) : 0.0)
            #else
            #if defined(SLANTED_SWEEP) */
        /* The "feature merging" is not intended to be complete.  There are
        * special cases where edges are nearly parallel to the sweep line
        * which are not implemented.  The algorithm should still behave
        * robustly (ie. produce a reasonable tesselation) in the presence
        * of such edges, however it may miss features which could have been
        * merged.  We could minimize this effect by choosing the sweep line
        * direction to be something unusual (ie. not parallel to one of the
        * coordinate axes).
        */
        /*	#define S_UNIT_X	(TESSreal)0.50941539564955385	// Pre-normalized
            #define S_UNIT_Y	(TESSreal)0.86052074622010633
            #else
            #define S_UNIT_X	(TESSreal)1.0
            #define S_UNIT_Y	(TESSreal)0.0
            #endif
            #endif*/

        /* Determine the polygon normal and project vertices onto the plane
        * of the polygon.
        */
        projectPolygon_: function() {
            var v, vHead = this.mesh.vHead;
            var norm = [0,0,0];
            var sUnit, tUnit;
            var i, first, computedNormal = false;

            norm[0] = this.normal[0];
            norm[1] = this.normal[1];
            norm[2] = this.normal[2];
            if( norm[0] === 0.0 && norm[1] === 0.0 && norm[2] === 0.0 ) {
                this.computeNormal_( norm );
                computedNormal = true;
            }
            sUnit = this.sUnit;
            tUnit = this.tUnit;
            i = this.longAxis_( norm );

            /*	#if defined(FOR_TRITE_TEST_PROGRAM) || defined(TRUE_PROJECT)
                    // Choose the initial sUnit vector to be approximately perpendicular
                    // to the normal.

                    Normalize( norm );

                    sUnit[i] = 0;
                    sUnit[(i+1)%3] = S_UNIT_X;
                    sUnit[(i+2)%3] = S_UNIT_Y;

                    // Now make it exactly perpendicular
                    w = Dot( sUnit, norm );
                    sUnit[0] -= w * norm[0];
                    sUnit[1] -= w * norm[1];
                    sUnit[2] -= w * norm[2];
                    Normalize( sUnit );

                    // Choose tUnit so that (sUnit,tUnit,norm) form a right-handed frame
                    tUnit[0] = norm[1]*sUnit[2] - norm[2]*sUnit[1];
                    tUnit[1] = norm[2]*sUnit[0] - norm[0]*sUnit[2];
                    tUnit[2] = norm[0]*sUnit[1] - norm[1]*sUnit[0];
                    Normalize( tUnit );
                #else*/
            /* Project perpendicular to a coordinate axis -- better numerically */
            sUnit[i] = 0;
            sUnit[(i+1)%3] = 1.0;
            sUnit[(i+2)%3] = 0.0;

            tUnit[i] = 0;
            tUnit[(i+1)%3] = 0.0;
            tUnit[(i+2)%3] = (norm[i] > 0) ? 1.0 : -1.0;
            //	#endif

            /* Project the vertices onto the sweep plane */
            for( v = vHead.next; v !== vHead; v = v.next ) {
                v.s = this.dot_( v.coords, sUnit );
                v.t = this.dot_( v.coords, tUnit );
            }
            if( computedNormal ) {
                this.checkOrientation_();
            }

            /* Compute ST bounds. */
            first = true;
            for( v = vHead.next; v !== vHead; v = v.next ) {
                if (first) {
                    this.bmin[0] = this.bmax[0] = v.s;
                    this.bmin[1] = this.bmax[1] = v.t;
                    first = false;
                } else {
                    if (v.s < this.bmin[0]) this.bmin[0] = v.s;
                    if (v.s > this.bmax[0]) this.bmax[0] = v.s;
                    if (v.t < this.bmin[1]) this.bmin[1] = v.t;
                    if (v.t > this.bmax[1]) this.bmax[1] = v.t;
                }
            }
        },

        addWinding_: function(eDst,eSrc) {
            eDst.winding += eSrc.winding;
            eDst.Sym.winding += eSrc.Sym.winding;
        },

        /* tessMeshTessellateMonoRegion( face ) tessellates a monotone region
        * (what else would it do??)  The region must consist of a single
        * loop of half-edges (see mesh.h) oriented CCW.  "Monotone" in this
        * case means that any vertical line intersects the interior of the
        * region in a single interval.
        *
        * Tessellation consists of adding interior edges (actually pairs of
        * half-edges), to split the region into non-overlapping triangles.
        *
        * The basic idea is explained in Preparata and Shamos (which I don''t
        * have handy right now), although their implementation is more
        * complicated than this one.  The are two edge chains, an upper chain
        * and a lower chain.  We process all vertices from both chains in order,
        * from right to left.
        *
        * The algorithm ensures that the following invariant holds after each
        * vertex is processed: the untessellated region consists of two
        * chains, where one chain (say the upper) is a single edge, and
        * the other chain is concave.  The left vertex of the single edge
        * is always to the left of all vertices in the concave chain.
        *
        * Each step consists of adding the rightmost unprocessed vertex to one
        * of the two chains, and forming a fan of triangles from the rightmost
        * of two chain endpoints.  Determining whether we can add each triangle
        * to the fan is a simple orientation test.  By making the fan as large
        * as possible, we restore the invariant (check it yourself).
        */
        //	int tessMeshTessellateMonoRegion( TESSmesh *mesh, TESSface *face )
        tessellateMonoRegion_: function( mesh, face ) {
            var up, lo;

            /* All edges are oriented CCW around the boundary of the region.
            * First, find the half-edge whose origin vertex is rightmost.
            * Since the sweep goes from left to right, face->anEdge should
            * be close to the edge we want.
            */
            up = face.anEdge;
            assert( up.Lnext !== up && up.Lnext.Lnext !== up );

            for( ; Geom.vertLeq( up.Dst, up.Org ); up = up.Lprev )
                ;
            for( ; Geom.vertLeq( up.Org, up.Dst ); up = up.Lnext )
                ;
            lo = up.Lprev;

            while( up.Lnext !== lo ) {
                if( Geom.vertLeq( up.Dst, lo.Org )) {
                    /* up->Dst is on the left.  It is safe to form triangles from lo->Org.
                    * The EdgeGoesLeft test guarantees progress even when some triangles
                    * are CW, given that the upper and lower chains are truly monotone.
                    */
                    while( lo.Lnext !== up && (Geom.edgeGoesLeft( lo.Lnext )
                        || Geom.edgeSign( lo.Org, lo.Dst, lo.Lnext.Dst ) <= 0.0 )) {
                        var tempHalfEdge = mesh.connect( lo.Lnext, lo );
                        //if (tempHalfEdge == NULL) return 0;
                        lo = tempHalfEdge.Sym;
                    }
                    lo = lo.Lprev;
                } else {
                    /* lo->Org is on the left.  We can make CCW triangles from up->Dst. */
                    while( lo.Lnext != up && (Geom.edgeGoesRight( up.Lprev )
                        || Geom.edgeSign( up.Dst, up.Org, up.Lprev.Org ) >= 0.0 )) {
                        var tempHalfEdge = mesh.connect( up, up.Lprev );
                        //if (tempHalfEdge == NULL) return 0;
                        up = tempHalfEdge.Sym;
                    }
                    up = up.Lnext;
                }
            }

            /* Now lo->Org == up->Dst == the leftmost vertex.  The remaining region
            * can be tessellated in a fan from this leftmost vertex.
            */
            assert( lo.Lnext !== up );
            while( lo.Lnext.Lnext !== up ) {
                var tempHalfEdge = mesh.connect( lo.Lnext, lo );
                //if (tempHalfEdge == NULL) return 0;
                lo = tempHalfEdge.Sym;
            }

            return true;
        },


        /* tessMeshTessellateInterior( mesh ) tessellates each region of
        * the mesh which is marked "inside" the polygon.  Each such region
        * must be monotone.
        */
        //int tessMeshTessellateInterior( TESSmesh *mesh )
        tessellateInterior_: function( mesh ) {
            var f, next;

            /*LINTED*/
            for( f = mesh.fHead.next; f !== mesh.fHead; f = next ) {
                /* Make sure we don''t try to tessellate the new triangles. */
                next = f.next;
                if( f.inside ) {
                    if ( !this.tessellateMonoRegion_( mesh, f ) ) return false;
                }
            }

            return true;
        },


        /* tessMeshDiscardExterior( mesh ) zaps (ie. sets to NULL) all faces
        * which are not marked "inside" the polygon.  Since further mesh operations
        * on NULL faces are not allowed, the main purpose is to clean up the
        * mesh so that exterior loops are not represented in the data structure.
        */
        //void tessMeshDiscardExterior( TESSmesh *mesh )
        discardExterior_: function( mesh ) {
            var f, next;

            /*LINTED*/
            for( f = mesh.fHead.next; f !== mesh.fHead; f = next ) {
                /* Since f will be destroyed, save its next pointer. */
                next = f.next;
                if( ! f.inside ) {
                    mesh.zapFace( f );
                }
            }
        },

        /* tessMeshSetWindingNumber( mesh, value, keepOnlyBoundary ) resets the
        * winding numbers on all edges so that regions marked "inside" the
        * polygon have a winding number of "value", and regions outside
        * have a winding number of 0.
        *
        * If keepOnlyBoundary is TRUE, it also deletes all edges which do not
        * separate an interior region from an exterior one.
        */
        //	int tessMeshSetWindingNumber( TESSmesh *mesh, int value, int keepOnlyBoundary )
        setWindingNumber_: function( mesh, value, keepOnlyBoundary ) {
            var e, eNext;

            for( e = mesh.eHead.next; e !== mesh.eHead; e = eNext ) {
                eNext = e.next;
                if( e.Rface.inside !== e.Lface.inside ) {

                    /* This is a boundary edge (one side is interior, one is exterior). */
                    e.winding = (e.Lface.inside) ? value : -value;
                } else {

                    /* Both regions are interior, or both are exterior. */
                    if( ! keepOnlyBoundary ) {
                        e.winding = 0;
                    } else {
                        mesh.delete( e );
                    }
                }
            }
        },

        getNeighbourFace_: function(edge)
        {
            if (!edge.Rface)
                return -1;
            if (!edge.Rface.inside)
                return -1;
            return edge.Rface.n;
        },

        outputPolymesh_: function( mesh, elementType, polySize, vertexSize ) {
            var v;
            var f;
            var edge;
            var maxFaceCount = 0;
            var maxVertexCount = 0;
            var faceVerts, i;

            // Assume that the input data is triangles now.
            // Try to merge as many polygons as possible
            if (polySize > 3)
            {
                mesh.mergeConvexFaces( polySize );
            }

            // Mark unused
            for ( v = mesh.vHead.next; v !== mesh.vHead; v = v.next )
                v.n = -1;

            // Create unique IDs for all vertices and faces.
            for ( f = mesh.fHead.next; f != mesh.fHead; f = f.next )
            {
                f.n = -1;
                if( !f.inside ) continue;

                edge = f.anEdge;
                faceVerts = 0;
                do
                {
                    v = edge.Org;
                    if ( v.n === -1 )
                    {
                        v.n = maxVertexCount;
                        maxVertexCount++;
                    }
                    faceVerts++;
                    edge = edge.Lnext;
                }
                while (edge !== f.anEdge);

                assert( faceVerts <= polySize );

                f.n = maxFaceCount;
                ++maxFaceCount;
            }

            this.elementCount = maxFaceCount;
            if (elementType == Tess2.CONNECTED_POLYGONS)
                maxFaceCount *= 2;
            /*		tess.elements = (TESSindex*)tess->alloc.memalloc( tess->alloc.userData,
                                                                      sizeof(TESSindex) * maxFaceCount * polySize );
                    if (!tess->elements)
                    {
                        tess->outOfMemory = 1;
                        return;
                    }*/
            this.elements = [];
            this.elements.length = maxFaceCount * polySize;

            this.vertexCount = maxVertexCount;
            /*		tess->vertices = (TESSreal*)tess->alloc.memalloc( tess->alloc.userData,
                                                                     sizeof(TESSreal) * tess->vertexCount * vertexSize );
                    if (!tess->vertices)
                    {
                        tess->outOfMemory = 1;
                        return;
                    }*/
            this.vertices = [];
            this.vertices.length = maxVertexCount * vertexSize;

            /*		tess->vertexIndices = (TESSindex*)tess->alloc.memalloc( tess->alloc.userData,
                                                                            sizeof(TESSindex) * tess->vertexCount );
                    if (!tess->vertexIndices)
                    {
                        tess->outOfMemory = 1;
                        return;
                    }*/
            this.vertexIndices = [];
            this.vertexIndices.length = maxVertexCount;


            // Output vertices.
            for ( v = mesh.vHead.next; v !== mesh.vHead; v = v.next )
            {
                if ( v.n != -1 )
                {
                    // Store coordinate
                    var idx = v.n * vertexSize;
                    this.vertices[idx+0] = v.coords[0];
                    this.vertices[idx+1] = v.coords[1];
                    if ( vertexSize > 2 )
                        this.vertices[idx+2] = v.coords[2];
                    // Store vertex index.
                    this.vertexIndices[v.n] = v.idx;
                }
            }

            // Output indices.
            var nel = 0;
            for ( f = mesh.fHead.next; f !== mesh.fHead; f = f.next )
            {
                if ( !f.inside ) continue;

                // Store polygon
                edge = f.anEdge;
                faceVerts = 0;
                do
                {
                    v = edge.Org;
                    this.elements[nel++] = v.n;
                    faceVerts++;
                    edge = edge.Lnext;
                }
                while (edge !== f.anEdge);
                // Fill unused.
                for (i = faceVerts; i < polySize; ++i)
                    this.elements[nel++] = -1;

                // Store polygon connectivity
                if ( elementType == Tess2.CONNECTED_POLYGONS )
                {
                    edge = f.anEdge;
                    do
                    {
                        this.elements[nel++] = this.getNeighbourFace_( edge );
                        edge = edge.Lnext;
                    }
                    while (edge !== f.anEdge);
                    // Fill unused.
                    for (i = faceVerts; i < polySize; ++i)
                        this.elements[nel++] = -1;
                }
            }
        },

        //	void OutputContours( TESStesselator *tess, TESSmesh *mesh, int vertexSize )
        outputContours_: function( mesh, vertexSize ) {
            var f;
            var edge;
            var start;
            var startVert = 0;
            var vertCount = 0;

            this.vertexCount = 0;
            this.elementCount = 0;

            for ( f = mesh.fHead.next; f !== mesh.fHead; f = f.next )
            {
                if ( !f.inside ) continue;

                start = edge = f.anEdge;
                do
                {
                    this.vertexCount++;
                    edge = edge.Lnext;
                }
                while ( edge !== start );

                this.elementCount++;
            }

            /*		tess->elements = (TESSindex*)tess->alloc.memalloc( tess->alloc.userData,
                                                                      sizeof(TESSindex) * tess->elementCount * 2 );
                    if (!tess->elements)
                    {
                        tess->outOfMemory = 1;
                        return;
                    }*/
            this.elements = [];
            this.elements.length = this.elementCount * 2;

            /*		tess->vertices = (TESSreal*)tess->alloc.memalloc( tess->alloc.userData,
                                                                      sizeof(TESSreal) * tess->vertexCount * vertexSize );
                    if (!tess->vertices)
                    {
                        tess->outOfMemory = 1;
                        return;
                    }*/
            this.vertices = [];
            this.vertices.length = this.vertexCount * vertexSize;

            /*		tess->vertexIndices = (TESSindex*)tess->alloc.memalloc( tess->alloc.userData,
                                                                            sizeof(TESSindex) * tess->vertexCount );
                    if (!tess->vertexIndices)
                    {
                        tess->outOfMemory = 1;
                        return;
                    }*/
            this.vertexIndices = [];
            this.vertexIndices.length = this.vertexCount;

            var nv = 0;
            var nvi = 0;
            var nel = 0;
            startVert = 0;

            for ( f = mesh.fHead.next; f !== mesh.fHead; f = f.next )
            {
                if ( !f.inside ) continue;

                vertCount = 0;
                start = edge = f.anEdge;
                do
                {
                    this.vertices[nv++] = edge.Org.coords[0];
                    this.vertices[nv++] = edge.Org.coords[1];
                    if ( vertexSize > 2 )
                        this.vertices[nv++] = edge.Org.coords[2];
                    this.vertexIndices[nvi++] = edge.Org.idx;
                    vertCount++;
                    edge = edge.Lnext;
                }
                while ( edge !== start );

                this.elements[nel++] = startVert;
                this.elements[nel++] = vertCount;

                startVert += vertCount;
            }
        },

        addContour: function( size, vertices )
        {
            var e;
            var i;

            if ( this.mesh === null )
                this.mesh = new TESSmesh();
            /*	 	if ( tess->mesh == NULL ) {
                        tess->outOfMemory = 1;
                        return;
                    }*/

            if ( size < 2 )
                size = 2;
            if ( size > 3 )
                size = 3;

            e = null;

            for( i = 0; i < vertices.length; i += size )
            {
                if( e == null ) {
                    /* Make a self-loop (one vertex, one edge). */
                    e = this.mesh.makeEdge();
                    /*				if ( e == NULL ) {
                                        tess->outOfMemory = 1;
                                        return;
                                    }*/
                    this.mesh.splice( e, e.Sym );
                } else {
                    /* Create a new vertex and edge which immediately follow e
                    * in the ordering around the left face.
                    */
                    this.mesh.splitEdge( e );
                    e = e.Lnext;
                }

                /* The new vertex is now e->Org. */
                e.Org.coords[0] = vertices[i+0];
                e.Org.coords[1] = vertices[i+1];
                if ( size > 2 )
                    e.Org.coords[2] = vertices[i+2];
                else
                    e.Org.coords[2] = 0.0;
                /* Store the insertion number so that the vertex can be later recognized. */
                e.Org.idx = this.vertexIndexCounter++;

                /* The winding of an edge says how the winding number changes as we
                * cross from the edge''s right face to its left face.  We add the
                * vertices in such an order that a CCW contour will add +1 to
                * the winding number of the region inside the contour.
                */
                e.winding = 1;
                e.Sym.winding = -1;
            }
        },

        //	int tessTesselate( TESStesselator *tess, int windingRule, int elementType, int polySize, int vertexSize, const TESSreal* normal )
        tesselate: function( windingRule, elementType, polySize, vertexSize, normal ) {
            this.vertices = [];
            this.elements = [];
            this.vertexIndices = [];

            this.vertexIndexCounter = 0;

            if (normal)
            {
                this.normal[0] = normal[0];
                this.normal[1] = normal[1];
                this.normal[2] = normal[2];
            }

            this.windingRule = windingRule;

            if (vertexSize < 2)
                vertexSize = 2;
            if (vertexSize > 3)
                vertexSize = 3;

            /*		if (setjmp(tess->env) != 0) {
                        // come back here if out of memory
                        return 0;
                    }*/

            if (!this.mesh)
            {
                return false;
            }

            /* Determine the polygon normal and project vertices onto the plane
            * of the polygon.
            */
            this.projectPolygon_();

            /* tessComputeInterior( tess ) computes the planar arrangement specified
            * by the given contours, and further subdivides this arrangement
            * into regions.  Each region is marked "inside" if it belongs
            * to the polygon, according to the rule given by tess->windingRule.
            * Each interior region is guaranteed be monotone.
            */
            Sweep.computeInterior( this );

            var mesh = this.mesh;

            /* If the user wants only the boundary contours, we throw away all edges
            * except those which separate the interior from the exterior.
            * Otherwise we tessellate all the regions marked "inside".
            */
            if (elementType == Tess2.BOUNDARY_CONTOURS) {
                this.setWindingNumber_( mesh, 1, true );
            } else {
                this.tessellateInterior_( mesh );
            }
            //		if (rc == 0) longjmp(tess->env,1);  /* could've used a label */

            mesh.check();

            if (elementType == Tess2.BOUNDARY_CONTOURS) {
                this.outputContours_( mesh, vertexSize );     /* output contours */
            }
            else
            {
                this.outputPolymesh_( mesh, elementType, polySize, vertexSize );     /* output polygons */
            }

    //			tess.mesh = null;

            return true;
        }
    };

    /**
     * @enum {string} AttributeType
     * @private
     * @readonly
     */
    const AttributeType = {
        Int8:   'BYTE',
        Uint8:  'UNSIGNED_BYTE',
        Int16:  'SHORT',
        Uint16: 'UNSIGNED_SHORT',
        Int32:  'INT',
        Uint32: 'UNSIGNED_INT',
        Float32: 'FLOAT'
    };

    /**
     * The `Buffer` class turns a `StructArray` into a WebGL buffer. Each member of the StructArray's
     * Struct type is converted to a WebGL atribute.
     * @private
     */
    class BufferUtil {
        /**
         * @param {Object} array A serialized StructArray.
         * @param {Object} arrayType A serialized StructArrayType.
         * @param {BufferType} type
         */
        constructor(array, arrayType, type) {
            this.arrayBuffer = array.arrayBuffer;
            this.length = array.length;
            this.attributes = arrayType.members;
            this.itemSize = arrayType.bytesPerElement;
            this.type = type;
            this.arrayType = arrayType;
        }

        static fromStructArray(array, type) {
            return new BufferUtil(array.serialize(), array.constructor.serialize(), type);
        }

        updateData(gl,array) {
            this.bind(gl);
            gl.bufferSubData(gl.ARRAY_BUFFER, 0, array.arrayBuffer);
        }

        /**
         * Bind this buffer to a WebGL context.
         * @param gl The WebGL context
         */
        bind(gl) {
            const type = gl[this.type];

            if (!this.buffer) {
                this.gl = gl;
                this.buffer = gl.createBuffer();
                gl.bindBuffer(type, this.buffer);
                gl.bufferData(type, this.arrayBuffer, gl.STATIC_DRAW);

                // dump array buffer once it's bound to gl
                this.arrayBuffer = null;
            } else {
                gl.bindBuffer(type, this.buffer);
            }
        }

        enableAttributes (gl, program) {
            for (let j = 0; j < this.attributes.length; j++) {
                const member = this.attributes[j];
                const attribIndex = program[member.name];
                if (attribIndex !== undefined) {
                    gl.enableVertexAttribArray(attribIndex);
                }
            }
        }

        /**
         * Set the attribute pointers in a WebGL context
         * @param gl The WebGL context
         * @param program The active WebGL program
         * @param vertexOffset Index of the starting vertex of the segment
         */
        setVertexAttribPointers(gl, program, vertexOffset) {
            for (let j = 0; j < this.attributes.length; j++) {
                const member = this.attributes[j];
                const attribIndex = program[member.name];

                if (attribIndex !== undefined) {
                    gl.vertexAttribPointer(
                        attribIndex,
                        member.components,
                        gl[AttributeType[member.type]],
                        false,
                        this.arrayType.bytesPerElement,
                        member.offset + (this.arrayType.bytesPerElement * vertexOffset || 0)
                    );
                }
            }
        }

        /**
         * Destroy the GL buffer bound to the given WebGL context
         * @param gl The WebGL context
         */
        destroy() {
            if (this.buffer) {
                this.gl.deleteBuffer(this.buffer);
            }
        }
    }

    /**
     * @enum {string} BufferType
     * @private
     * @readonly
     */
    BufferUtil.BufferType = {
        VERTEX: 'ARRAY_BUFFER',
        ELEMENT: 'ELEMENT_ARRAY_BUFFER'
    };

    var BufferUtil$1 = BufferUtil;

    const viewTypes = {
        'Int8': Int8Array,
        'Uint8': Uint8Array,
        'Uint8Clamped': Uint8ClampedArray,
        'Int16': Int16Array,
        'Uint16': Uint16Array,
        'Int32': Int32Array,
        'Uint32': Uint32Array,
        'Float32': Float32Array,
        'Float64': Float64Array
    };

    /* eslint-disable no-undef */
    // type ViewType = $Keys<typeof viewTypes>;
    /* eslint-enable no-undef */

    /**
     * @typedef {Object} StructMember
     * @private
     * @property {string} name
     * @property {string} type
     * @property {number} components
     */

    /**
     * @private
     */
    class Struct {
        // _pos1: number;
        // _pos2: number;
        // _pos4: number;
        // _pos8: number;
        // _structArray: StructArray;
        // // The following properties are defined on the prototype of sub classes.
        // size: number;
        // alignment: number;
        /**
         * @param {StructArray} structArray The StructArray the struct is stored in
         * @param {number} index The index of the struct in the StructArray.
         * @private
         */
        constructor(structArray, index) {
            this._structArray = structArray;
            this._pos1 = index * this.size;
            this._pos2 = this._pos1 / 2;
            this._pos4 = this._pos1 / 4;
            this._pos8 = this._pos1 / 8;
        }
    }

    const DEFAULT_CAPACITY = 128;
    const RESIZE_MULTIPLIER = 5;

    // type StructArrayMember = {|
    //     name: string,
    //     type: ViewType,
    //     components: number,
    //     offset: number
    // |};

    /**
     * The StructArray class is inherited by the custom StructArrayType classes created with
     * `createStructArrayType(members, options)`.
     * @private
     */
    class StructArray {
        // capacity: number;
        // length: number;
        // isTransferred: boolean;
        // arrayBuffer: ArrayBuffer;
        // int8: ?Int8Array;
        // uint8: Uint8Array;
        // uint8clamped: ?Uint8ClampedArray;
        // int16: ?Int16Array;
        // uint16: ?Uint16Array;
        // int32: ?Int32Array;
        // uint32: ?Uint32Array;
        // float32: ?Float32Array;
        // float64: ?Float64Array;
        // // The following properties aer defined on the prototype.
        // members: Array<StructArrayMember>;
        // StructType: typeof Struct;
        // bytesPerElement: number;
        // _usedTypes: Array<ViewType>;
        // emplaceBack: Function;
        constructor(serialized, length) {
            this.isTransferred = false;

            if (serialized !== undefined) {
            // Create from an serialized StructArray
                this.arrayBuffer = serialized.arrayBuffer;
                this.length = serialized.length;
                this.capacity = this.arrayBuffer.byteLength / this.bytesPerElement;
                this._refreshViews();

            // Create a new StructArray
            } else {
                this.capacity = -1;
                this.resize(0);
            }
        }

        /**
         * Serialize the StructArray type. This serializes the *type* not an instance of the type.
         */
        static serialize() {
            return {
                members: this.prototype.members,
                alignment: this.prototype.StructType.prototype.alignment,
                bytesPerElement: this.prototype.bytesPerElement
            };
        }

        /**
         * Serialize this StructArray instance
         */
        serialize(transferables) {
            // assert(!this.isTransferred);

            this._trim();

            if (transferables) {
                this.isTransferred = true;
                transferables.push(this.arrayBuffer);
            }
            return {
                length: this.length,
                arrayBuffer: this.arrayBuffer
            };
        }

        /**
         * Return the Struct at the given location in the array.
         * @param {number} index The index of the element.
         */
        get(index) {
            // assert(!this.isTransferred);
            return new this.StructType(this, index);
        }

        /**
         * Resize the array to discard unused capacity.
         */
        _trim() {
            if (this.length !== this.capacity) {
                this.capacity = this.length;
                this.arrayBuffer = this.arrayBuffer.slice(0, this.length * this.bytesPerElement);
                this._refreshViews();
            }
        }

        /**
         * Resize the array.
         * If `n` is greater than the current length then additional elements with undefined values are added.
         * If `n` is less than the current length then the array will be reduced to the first `n` elements.
         * @param {number} n The new size of the array.
         */
        resize(n) {
            // assert(!this.isTransferred);

            this.length = n;
            if (n > this.capacity) {
                this.capacity = Math.max(n, Math.floor(this.capacity * RESIZE_MULTIPLIER), DEFAULT_CAPACITY);
                this.arrayBuffer = new ArrayBuffer(this.capacity * this.bytesPerElement);

                const oldUint8Array = this.uint8;
                this._refreshViews();
                if (oldUint8Array) this.uint8.set(oldUint8Array);
            }
        }

        /**
         * Create TypedArray views for the current ArrayBuffer.
         */
        _refreshViews() {
            for (const type of this._usedTypes) {
                // $FlowFixMe
                this[getArrayViewName(type)] = new viewTypes[type](this.arrayBuffer);
            }
        }

        /**
         * Output the `StructArray` between indices `startIndex` and `endIndex` as an array of `StructTypes` to enable sorting
         * @param {number} startIndex
         * @param {number} endIndex
         */
        toArray(startIndex, endIndex) {
            // assert(!this.isTransferred);

            const array = [];

            for (let i = startIndex; i < endIndex; i++) {
                const struct = this.get(i);
                array.push(struct);
            }

            return array;
        }
    }

    const structArrayTypeCache = {};

    /**
     * `createStructArrayType` is used to create new `StructArray` types.
     *
     * `StructArray` provides an abstraction over `ArrayBuffer` and `TypedArray` making it behave like
     * an array of typed structs. A StructArray is comprised of elements. Each element has a set of
     * members that are defined when the `StructArrayType` is created.
     *
     * StructArrays useful for creating large arrays that:
     * - can be transferred from workers as a Transferable object
     * - can be copied cheaply
     * - use less memory for lower-precision members
     * - can be used as buffers in WebGL.
     *
     * @class
     * @param {Object} options
     * @param {number} options.alignment Use `4` to align members to 4 byte boundaries. Default is 1.
     * @param {Array<StructMember>} options.members
     * @example
     *
     * var PointArrayType = createStructArrayType({
     *  members: [
     *      { type: 'Int16', name: 'x' },
     *      { type: 'Int16', name: 'y' }
     *  ]});
     *
     *  var pointArray = new PointArrayType();
     *  pointArray.emplaceBack(10, 15);
     *  pointArray.emplaceBack(20, 35);
     *
     *  point = pointArray.get(0);
     *  assert(point.x === 10);
     *  assert(point.y === 15);
     *
     * @private
     */

    function createStructArrayType(options, name, components,
      alignment) {

        const key = JSON.stringify(options);

        if (structArrayTypeCache[key]) {
            return structArrayTypeCache[key];
        }

        alignment = (options.alignment === undefined) ?
          1 : options.alignment;

        let offset = 0;
        let maxSize = 0;
        const usedTypes = ['Uint8'];

        const members = options.members.map((member) => {
            // assert(member.name.length);
            // assert(member.type in viewTypes);

            if (usedTypes.indexOf(member.type) < 0) usedTypes.push(member.type);

            const typeSize = sizeOf(member.type);
            const memberOffset = offset = align(offset, Math.max(alignment, typeSize));
            const components = member.components || 1;

            maxSize = Math.max(maxSize, typeSize);
            offset += typeSize * components;

            return {
                name: member.name,
                type: member.type,
                components: components,
                offset: memberOffset
            };
        });

        const size = align(offset, Math.max(maxSize, alignment));

        class StructType extends Struct {}

        StructType.prototype.alignment = alignment;
        StructType.prototype.size = size;

        for (const member of members) {
            for (let c = 0; c < member.components; c++) {
                const name = member.name + (member.components === 1 ? '' : c);
                Object.defineProperty(StructType.prototype, name, {
                    get: createGetter(member, c),
                    set: createSetter(member, c)
                });
            }
        }

        class StructArrayType extends StructArray {}

        StructArrayType.prototype.members = members;
        StructArrayType.prototype.StructType = StructType;
        StructArrayType.prototype.bytesPerElement = size;
        StructArrayType.prototype.emplaceBack = createEmplaceBack(members, size);
        StructArrayType.prototype._usedTypes = usedTypes;

        structArrayTypeCache[key] = StructArrayType;

        return StructArrayType;
    }

    function align(offset, size) {
        return Math.ceil(offset / size) * size;
    }

    function sizeOf(type) {
        return viewTypes[type].BYTES_PER_ELEMENT;
    }

    function getArrayViewName(type) {
        return type.toLowerCase();
    }

    /*
     * > I saw major perf gains by shortening the source of these generated methods (i.e. renaming
     * > elementIndex to i) (likely due to v8 inlining heuristics).
     * - lucaswoj
     */
    function createEmplaceBack(members, bytesPerElement) {
        const usedTypeSizes = [];
        const argNames = [];
        let body =
            'var i = this.length;\n' +
            'this.resize(this.length + 1);\n';

        for (const member of members) {
            const size = sizeOf(member.type);

            // array offsets to the end of current data for each type size
            // var o{SIZE} = i * ROUNDED(bytesPerElement / size);
            if (usedTypeSizes.indexOf(size) < 0) {
                usedTypeSizes.push(size);
                body += `var o${size.toFixed(0)} = i * ${(bytesPerElement / size).toFixed(0)};\n`;
            }

            for (let c = 0; c < member.components; c++) {
                // arguments v0, v1, v2, ... are, in order, the components of
                // member 0, then the components of member 1, etc.
                const argName = `v${argNames.length}`;
                // The index for `member` component `c` into the appropriate type array is:
                // this.{TYPE}[o{SIZE} + MEMBER_OFFSET + {c}] = v{X}
                // where MEMBER_OFFSET = ROUND(member.offset / size) is the per-element
                // offset of this member into the array
                const index = `o${size.toFixed(0)} + ${(member.offset / size + c).toFixed(0)}`;
                body += `this.${getArrayViewName(member.type)}[${index}] = ${argName};\n`;
                argNames.push(argName);
            }
        }

        body += 'return i;';

        return new Function(argNames.toString(), body);
    }

    function createMemberComponentString(member, component) {
        const elementOffset = `this._pos${sizeOf(member.type).toFixed(0)}`;
        const componentOffset = (member.offset / sizeOf(member.type) + component).toFixed(0);
        const index = `${elementOffset} + ${componentOffset}`;
        return `this._structArray.${getArrayViewName(member.type)}[${index}]`;
    }

    function createGetter(member, c) {
        return new Function(`return ${createMemberComponentString(member, c)};`);
    }

    function createSetter(member, c) {
        return new Function('x', `${createMemberComponentString(member, c)} = x;`);
    }

    /**
     * An element array stores Uint16 indicies of vertexes in a corresponding vertex array. With no
     * arguments, it defaults to three components per element, forming triangles.
     * @private
     */
    function createElementArrayType(components) {
        return createStructArrayType({
            members: [{
                type: 'Uint16',
                name: 'vertices',
                components: components || 3
            }]
        });
    }

    /**
     * A vertex array stores data for each vertex in a geometry. Elements are aligned to 4 byte
     * boundaries for best performance in WebGL.
     * @private
     */
    function createVertexArrayType(members) {
        return createStructArrayType({
            members: members,
            alignment: 4
        });
    }

    // @flow

    const layoutAttributes$1 = [{name: 'a_pos', components: 2, type: 'Float32'}];
    const FillLayoutArrayType$1 = createVertexArrayType(layoutAttributes$1);
    const IndexArrayType$1 = createElementArrayType(3);
    const IndexArrayType2= createElementArrayType(2);

    const EARCUT_MAX_RINGS = 1500;
    class FillBucket extends Bucket$1{
        constructor(options) {
            super(options);
            this.overscaling = options.overscaling;
            this.layoutVertexArray = new FillLayoutArrayType$1();
            this.layoutVertexArray2 = new FillLayoutArrayType$1();
            this.indexArray = new IndexArrayType$1();
            this.indexArray2 = new IndexArrayType2();
            this.segments = new SegmentVector$1();
            this.segments2 = new SegmentVector$1();
        }

        isEmpty() {
            return this.layoutVertexArray.length === 0;
        }

        destroy() {
            this.segments.destroy();
            this.segments2.destroy();
        }

        addFeature(feature) {
            for (const polygon of classifyRings(feature, EARCUT_MAX_RINGS)) {
                let numVertices = 0;
                let flatteneds = [];
                const holeIndices = [];


                for (const ring of polygon) {
                    const flattened = [];
                    if (ring.length === 0) {
                        continue;
                    }

                    if (ring !== polygon[0]) {
                        holeIndices.push(flattened.length / 2);
                    }

                    const lineSegment = this.segments2.prepareSegment(ring.length, this.layoutVertexArray2, this.indexArray2);
                    const lineIndex = lineSegment.vertexLength;

                    this.layoutVertexArray2.emplaceBack(ring[0].x, ring[0].y);
                    this.indexArray2.emplaceBack(lineIndex + ring.length - 1, lineIndex);
                    flattened.push(ring[0].x);
                    flattened.push(ring[0].y);


                    for (let i = 1; i < ring.length; i++) {
                        this.layoutVertexArray2.emplaceBack(ring[i].x, ring[i].y);
                        this.indexArray2.emplaceBack(lineIndex + i - 1, lineIndex + i);
                        flattened.push(ring[i].x);
                        flattened.push(ring[i].y);
                    }

                    lineSegment.vertexLength += ring.length;
                    lineSegment.primitiveLength += ring.length;

                    flatteneds.push(flattened);
                }


                var res = Tess2$1.tesselate({
                    contours:flatteneds,
                    windingRule: Tess2$1.WINDING_ODD,
                    elementType: Tess2$1.POLYGONS,
                    polySize: 3,
                    vertexSize: 2
                });

                numVertices = res.vertices.length/2;


                const triangleSegment = this.segments.prepareSegment(numVertices, this.layoutVertexArray, this.indexArray);
                const triangleIndex = triangleSegment.vertexLength;
                for(let j = 0;j<res.vertices.length;j+=2){
                    this.layoutVertexArray.emplaceBack(res.vertices[j], res.vertices[j+1]);
                }


                const indices = res.elements;
                for (let i = 0; i < indices.length; i += 3) {
                    this.indexArray.emplaceBack(
                        triangleIndex + indices[i],
                        triangleIndex + indices[i + 1],
                        triangleIndex + indices[i + 2]);
                }

                triangleSegment.vertexLength += numVertices;
                triangleSegment.primitiveLength += indices.length / 3;



                // let numVertices = 0;
                // for (const ring of polygon) {
                //     numVertices += ring.length;
                // }
                //
                // const triangleSegment = arrays.prepareSegment(numVertices);
                // const triangleIndex = triangleSegment.vertexLength;
                //
                // const flattened = [];
                // const holeIndices = [];
                //
                // for (const ring of polygon) {
                //     if (ring.length === 0) {
                //         continue;
                //     }
                //
                //     if (ring !== polygon[0]) {
                //         holeIndices.push(flattened.length / 2);
                //     }
                //
                //     const lineSegment = arrays.prepareSegment2(ring.length);
                //     const lineIndex = lineSegment.vertexLength;
                //
                //     arrays.layoutVertexArray.emplaceBack(ring[0].x, ring[0].y);
                //     arrays.layoutVertexArray2.emplaceBack(ring[0].x, ring[0].y);
                //     arrays.elementArray2.emplaceBack(lineIndex + ring.length - 1, lineIndex);
                //     flattened.push(ring[0].x);
                //     flattened.push(ring[0].y);
                //
                //     for (let i = 1; i < ring.length; i++) {
                //         arrays.layoutVertexArray.emplaceBack(ring[i].x, ring[i].y);
                //         arrays.layoutVertexArray2.emplaceBack(ring[i].x, ring[i].y);
                //         arrays.elementArray2.emplaceBack(lineIndex + i - 1, lineIndex + i);
                //         flattened.push(ring[i].x);
                //         flattened.push(ring[i].y);
                //     }
                //
                //     lineSegment.vertexLength += ring.length;
                //     lineSegment.primitiveLength += ring.length;
                // }
                //
                // const indices = earcut(flattened, holeIndices);
                //
                // for (let i = 0; i < indices.length; i += 3) {
                //     arrays.elementArray.emplaceBack(
                //         triangleIndex + indices[i],
                //         triangleIndex + indices[i + 1],
                //         triangleIndex + indices[i + 2]);
                // }
                //
                // triangleSegment.vertexLength += numVertices;
                // triangleSegment.primitiveLength += indices.length / 3;


                // console.log('顶点个数：'+ triangleSegment.vertexLength + '   三角形个数: '+triangleSegment.primitiveLength );
            }

            // for (const polygon of classifyRings(geometry, EARCUT_MAX_RINGS)) {
            //     let numVertices = 0;
            //     for (const ring of polygon) {
            //         numVertices += ring.length;
            //     }
            //
            //     const triangleSegment = this.segments.prepareSegment(numVertices, this.layoutVertexArray, this.indexArray);
            //     const triangleIndex = triangleSegment.vertexLength;
            //
            //     const flattened = [];
            //     const holeIndices = [];
            //
            //     for (const ring of polygon) {
            //         if (ring.length === 0) {
            //             continue;
            //         }
            //
            //         if (ring !== polygon[0]) {
            //             holeIndices.push(flattened.length / 2);
            //         }
            //
            //         const lineSegment = this.segments2.prepareSegment(ring.length, this.layoutVertexArray, this.indexArray2);
            //         const lineIndex = lineSegment.vertexLength;
            //
            //         this.layoutVertexArray.emplaceBack(ring[0].x, ring[0].y);
            //         this.indexArray2.emplaceBack(lineIndex + ring.length - 1, lineIndex);
            //         flattened.push(ring[0].x);
            //         flattened.push(ring[0].y);
            //
            //         for (let i = 1; i < ring.length; i++) {
            //             this.layoutVertexArray.emplaceBack(ring[i].x, ring[i].y);
            //             this.indexArray2.emplaceBack(lineIndex + i - 1, lineIndex + i);
            //             flattened.push(ring[i].x);
            //             flattened.push(ring[i].y);
            //         }
            //
            //         lineSegment.vertexLength += ring.length;
            //         lineSegment.primitiveLength += ring.length;
            //     }
            //
            //     const indices = earcut(flattened, holeIndices);
            //
            //     for (let i = 0; i < indices.length; i += 3) {
            //         this.indexArray.emplaceBack(
            //             triangleIndex + indices[i],
            //             triangleIndex + indices[i + 1],
            //             triangleIndex + indices[i + 2]);
            //     }
            //
            //     triangleSegment.vertexLength += numVertices;
            //     triangleSegment.primitiveLength += indices.length / 3;
            // }
        }

        serialize(transferables) {
            return {
                type:this.type,
                style:this.style,
                tileSize: this.tileSize,
                layoutVertexArray: this.layoutVertexArray.serialize(transferables),
                layoutVertexArray2: this.layoutVertexArray2.serialize(transferables),
                indexArray:  this.indexArray.serialize(transferables),
                indexArray2: this.indexArray2.serialize(transferables),
                segments: this.segments,
                segments2: this.segments2
            };
        }

        static createBuffer(bucket){
            bucket.layoutVertexBuffer = new BufferUtil$1(bucket.layoutVertexArray,
                FillLayoutArrayType$1.serialize(), BufferUtil$1.BufferType.VERTEX);
            bucket.layoutVertexBuffer2 = new BufferUtil$1(bucket.layoutVertexArray2,
                FillLayoutArrayType$1.serialize(), BufferUtil$1.BufferType.VERTEX);
            bucket.indexBuffer = new BufferUtil$1(bucket.indexArray,
                IndexArrayType$1.serialize(), BufferUtil$1.BufferType.ELEMENT);
            bucket.indexBuffer2 = new BufferUtil$1(bucket.indexArray2,
                IndexArrayType2.serialize(), BufferUtil$1.BufferType.ELEMENT);
        }
    }

    var FillBucket$1 = FillBucket;

    // @flow

    const layoutAttributes = [{name: 'a_pos',  components: 2, type: 'Float32'},
        {name: 'a_data', components: 4, type: 'Uint8'},
        {name: 'a_txy',  components: 2, type: 'Int16'}];
    const FillLayoutArrayType = createVertexArrayType(layoutAttributes);
    const IndexArrayType = createElementArrayType(3);

    const EXTRUDE_SCALE = 63;
    const EXTENT = 8192;

    /*
     * Sharp corners cause dashed lines to tilt because the distance along the line
     * is the same at both the inner and outer corners. To improve the appearance of
     * dashed lines we add extra points near sharp corners so that a smaller part
     * of the line is tilted.
     *
     * COS_HALF_SHARP_CORNER controls how sharp a corner has to be for us to add an
     * extra vertex. The default is 75 degrees.
     *
     * The newly created vertices are placed SHARP_CORNER_OFFSET pixels from the corner.
     */
    const COS_HALF_SHARP_CORNER = Math.cos(75 / 2 * (Math.PI / 180));
    const SHARP_CORNER_OFFSET = 15;

    // The number of bits that is used to store the line distance in the buffer.
    const LINE_DISTANCE_BUFFER_BITS = 15;

    // We don't have enough bits for the line distance as we'd like to have, so
    // use this value to scale the line distance (in tile units) down to a smaller
    // value. This lets us store longer distances while sacrificing precision.
    const LINE_DISTANCE_SCALE = 1 / 2;

    // The maximum line distance, in tile units, that fits in the buffer.
    const MAX_LINE_DISTANCE = Math.pow(2, LINE_DISTANCE_BUFFER_BITS - 1)/ LINE_DISTANCE_SCALE;

    function addLineVertex(layoutVertexBuffer, point, extrude, tx, ty, dir, linesofar) {
        layoutVertexBuffer.emplaceBack(
            // a_pos
            point.x,
            point.y,
            // a_data
            // add 128 to store a byte in an unsigned byte
            Math.round(EXTRUDE_SCALE * extrude.x) + 128,
            Math.round(EXTRUDE_SCALE * extrude.y) + 128,
            // Encode the -1/0/1 direction value into the first two bits of .z of a_data.
            // Combine it with the lower 6 bits of `linesofar` (shifted by 2 bites to make
            // room for the direction value). The upper 8 bits of `linesofar` are placed in
            // the `w` component. `linesofar` is scaled down by `LINE_DISTANCE_SCALE` so that
            // we can store longer distances while sacrificing precision.
            ((dir === 0 ? 0 : (dir < 0 ? -1 : 1)) + 1) | (((linesofar * LINE_DISTANCE_SCALE) & 0x3F) << 2),
            (linesofar * LINE_DISTANCE_SCALE) >> 6,
            tx,
            ty);
    }
    /**
     * @private
     */
    class LineBucket extends Bucket$1{
        constructor(options) {
            super(options);
            this.overscaling = this.tileSize/512;

            this.layoutVertexArray = new FillLayoutArrayType();
            this.indexArray = new IndexArrayType();
            this.segments = new SegmentVector$1();
        }

        upload(context) {
            this.uploaded = true;
        }

        destroy() {
            this.segments.destroy();
        }

        addFeature(feature) {
            const join = 'round';
            const cap = this.style['lineCap']?this.style['lineCap']:'butt';
            const miterLimit = 0;
            const roundLimit = 0;

            for (const line of feature) {
                this.addLine(line, feature, join, cap, miterLimit, roundLimit);
            }
        }

        addLine(vertices, feature, join, cap, miterLimit, roundLimit) {
            // If the line has duplicate vertices at the ends, adjust start/length to remove them.
            let len = vertices.length;
            while (len >= 2 && vertices[len - 1].equals(vertices[len - 2])) {
                len--;
            }
            let first = 0;
            while (first < len - 1 && vertices[first].equals(vertices[first + 1])) {
                first++;
            }

            // Ignore invalid geometry.
            if (len < (2)) return;

            if (join === 'bevel') miterLimit = 1.05;

            const sharpCornerOffset = SHARP_CORNER_OFFSET * (EXTENT / (512 * this.overscaling));

            vertices[first];
            // const arrays = this.arrays;

            // we could be more precise, but it would only save a negligible amount of space
            // const segment = arrays.prepareSegment(len * 10);

            const segment = this.segments.prepareSegment(len * 10, this.layoutVertexArray, this.indexArray);
            this.distance = 0;

            const beginCap = cap,
                endCap = cap;
            let startOfLine = true;
            let currentVertex, prevVertex, nextVertex, prevNormal, nextNormal, offsetA, offsetB;

            // the last three vertices added
            this.e1 = this.e2 = this.e3 = -1;

            for (let i = first; i < len; i++) {

                nextVertex = // if the line is closed, we treat the last vertex like the first
                    vertices[i + 1]; // just the next vertex

                // if two consecutive vertices exist, skip the current one
                if (nextVertex && vertices[i].equals(nextVertex)) continue;

                if (nextNormal) prevNormal = nextNormal;
                if (currentVertex) prevVertex = currentVertex;

                currentVertex = vertices[i];

                // Calculate the normal towards the next vertex in this line. In case
                // there is no next vertex, pretend that the line is continuing straight,
                // meaning that we are just using the previous normal.
                nextNormal = nextVertex ? nextVertex.sub(currentVertex)._unit()._perp() : prevNormal;

                // If we still don't have a previous normal, this is the beginning of a
                // non-closed line, so we're doing a straight "join".
                prevNormal = prevNormal || nextNormal;

                // Determine the normal of the join extrusion. It is the angle bisector
                // of the segments between the previous line and the next line.
                // In the case of 180° angles, the prev and next normals cancel each other out:
                // prevNormal + nextNormal = (0, 0), its magnitude is 0, so the unit vector would be
                // undefined. In that case, we're keeping the joinNormal at (0, 0), so that the cosHalfAngle
                // below will also become 0 and miterLength will become Infinity.
                let joinNormal = prevNormal.add(nextNormal);
                if (joinNormal.x !== 0 || joinNormal.y !== 0) {
                    joinNormal._unit();
                }
                /*  joinNormal     prevNormal
                 *             ↖      ↑
                 *                .________. prevVertex
                 *                |
                 * nextNormal  ←  |  currentVertex
                 *                |
                 *     nextVertex !
                 *
                 */

                // Calculate the length of the miter (the ratio of the miter to the width).
                // Find the cosine of the angle between the next and join normals
                // using dot product. The inverse of that is the miter length.
                const cosHalfAngle = joinNormal.x * nextNormal.x + joinNormal.y * nextNormal.y;
                const miterLength = cosHalfAngle !== 0 ? 1 / cosHalfAngle : Infinity;

                const isSharpCorner = cosHalfAngle < COS_HALF_SHARP_CORNER && prevVertex && nextVertex;

                if (isSharpCorner && i > first) {
                    const prevSegmentLength = currentVertex.dist(prevVertex);
                    if (prevSegmentLength > 2 * sharpCornerOffset) {
                        const newPrevVertex = currentVertex.sub(currentVertex.sub(prevVertex)._mult(sharpCornerOffset / prevSegmentLength)._round());
                        this.distance += newPrevVertex.dist(prevVertex);
                        this.addCurrentVertex(newPrevVertex, this.distance, prevNormal.mult(1), 0, 0, false, segment);
                        prevVertex = newPrevVertex;
                    }
                }

                // The join if a middle vertex, otherwise the cap.
                const middleVertex = prevVertex && nextVertex;
                let currentJoin = middleVertex ? join : nextVertex ? beginCap : endCap;

                if (middleVertex && currentJoin === 'round') {
                    if (miterLength < roundLimit) {
                        currentJoin = 'miter';
                    } else if (miterLength <= 2) {
                        currentJoin = 'fakeround';
                    }
                }

                if (currentJoin === 'miter' && miterLength > miterLimit) {
                    currentJoin = 'bevel';
                }

                if (currentJoin === 'bevel') {
                    // The maximum extrude length is 128 / 63 = 2 times the width of the line
                    // so if miterLength >= 2 we need to draw a different type of bevel here.
                    if (miterLength > 2) currentJoin = 'flipbevel';

                    // If the miterLength is really small and the line bevel wouldn't be visible,
                    // just draw a miter join to save a triangle.
                    if (miterLength < miterLimit) currentJoin = 'miter';
                }

                // Calculate how far along the line the currentVertex is
                if (prevVertex) this.distance += currentVertex.dist(prevVertex);

                if (currentJoin === 'miter') {

                    joinNormal._mult(miterLength);
                    this.addCurrentVertex(currentVertex, this.distance, joinNormal, 0, 0, false, segment);

                } else if (currentJoin === 'flipbevel') {
                    // miter is too big, flip the direction to make a beveled join

                    if (miterLength > 100) {
                        // Almost parallel lines
                        joinNormal = nextNormal.clone().mult(-1);

                    } else {
                        const direction = prevNormal.x * nextNormal.y - prevNormal.y * nextNormal.x > 0 ? -1 : 1;
                        const bevelLength = miterLength * prevNormal.add(nextNormal).mag() / prevNormal.sub(nextNormal).mag();
                        joinNormal._perp()._mult(bevelLength * direction);
                    }
                    this.addCurrentVertex(currentVertex, this.distance, joinNormal, 0, 0, false, segment);
                    this.addCurrentVertex(currentVertex, this.distance, joinNormal.mult(-1), 0, 0, false, segment);

                } else if (currentJoin === 'bevel' || currentJoin === 'fakeround') {
                    const lineTurnsLeft = (prevNormal.x * nextNormal.y - prevNormal.y * nextNormal.x) > 0;
                    const offset = -Math.sqrt(miterLength * miterLength - 1);
                    if (lineTurnsLeft) {
                        offsetB = 0;
                        offsetA = offset;
                    } else {
                        offsetA = 0;
                        offsetB = offset;
                    }

                    // Close previous segment with a bevel
                    if (!startOfLine) {
                        this.addCurrentVertex(currentVertex, this.distance, prevNormal, offsetA, offsetB, false, segment);
                    }

                    if (currentJoin === 'fakeround') {
                        // The join angle is sharp enough that a round join would be visible.
                        // Bevel joins fill the gap between segments with a single pie slice triangle.
                        // Create a round join by adding multiple pie slices. The join isn't actually round, but
                        // it looks like it is at the sizes we render lines at.

                        // Add more triangles for sharper angles.
                        // This math is just a good enough approximation. It isn't "correct".
                        const n = Math.floor((0.5 - (cosHalfAngle - 0.5)) * 8);
                        let approxFractionalJoinNormal;

                        for (let m = 0; m < n; m++) {
                            approxFractionalJoinNormal = nextNormal.mult((m + 1) / (n + 1))._add(prevNormal)._unit();
                            this.addPieSliceVertex(currentVertex, this.distance, approxFractionalJoinNormal, lineTurnsLeft, segment);
                        }

                        this.addPieSliceVertex(currentVertex, this.distance, joinNormal, lineTurnsLeft, segment);

                        for (let k = n - 1; k >= 0; k--) {
                            approxFractionalJoinNormal = prevNormal.mult((k + 1) / (n + 1))._add(nextNormal)._unit();
                            this.addPieSliceVertex(currentVertex, this.distance, approxFractionalJoinNormal, lineTurnsLeft, segment);
                        }
                    }

                    // Start next segment
                    if (nextVertex) {
                        this.addCurrentVertex(currentVertex, this.distance, nextNormal, -offsetA, -offsetB, false, segment);
                    }

                } else if (currentJoin === 'butt') {
                    if (!startOfLine) {
                        // Close previous segment with a butt
                        this.addCurrentVertex(currentVertex, this.distance, prevNormal, 0, 0, false, segment);
                    }

                    // Start next segment with a butt
                    if (nextVertex) {
                        this.addCurrentVertex(currentVertex, this.distance, nextNormal, 0, 0, false, segment);
                    }

                } else if (currentJoin === 'square') {

                    if (!startOfLine) {
                        // Close previous segment with a square cap
                        this.addCurrentVertex(currentVertex, this.distance, prevNormal, 1, 1, false, segment);

                        // The segment is done. Unset vertices to disconnect segments.
                        this.e1 = this.e2 = -1;
                    }

                    // Start next segment
                    if (nextVertex) {
                        this.addCurrentVertex(currentVertex, this.distance, nextNormal, -1, -1, false, segment);
                    }

                } else if (currentJoin === 'round') {

                    if (!startOfLine) {
                        // Close previous segment with butt
                        this.addCurrentVertex(currentVertex, this.distance, prevNormal, 0, 0, false, segment);

                        // Add round cap or linejoin at end of segment
                        this.addCurrentVertex(currentVertex, this.distance, prevNormal, 1, 1, true, segment);

                        // The segment is done. Unset vertices to disconnect segments.
                        this.e1 = this.e2 = -1;
                    }


                    // Start next segment with a butt
                    if (nextVertex) {
                        // Add round cap before first segment
                        this.addCurrentVertex(currentVertex, this.distance, nextNormal, -1, -1, true, segment);

                        this.addCurrentVertex(currentVertex, this.distance, nextNormal, 0, 0, false, segment);
                    }
                }

                if (isSharpCorner && i < len - 1) {
                    const nextSegmentLength = currentVertex.dist(nextVertex);
                    if (nextSegmentLength > 2 * sharpCornerOffset) {
                        const newCurrentVertex = currentVertex.add(nextVertex.sub(currentVertex)._mult(sharpCornerOffset / nextSegmentLength)._round());
                        this.distance += newCurrentVertex.dist(currentVertex);
                        this.addCurrentVertex(newCurrentVertex, this.distance, nextNormal.mult(1), 0, 0, false, segment);
                        currentVertex = newCurrentVertex;
                    }
                }

                startOfLine = false;
            }

            // arrays.populatePaintArrays(featureProperties);
        }

        /**
         * Add two vertices to the buffers.
         *
         * @param {Object} currentVertex the line vertex to add buffer vertices for
         * @param {number} distance the distance from the beginning of the line to the vertex
         * @param {number} endLeft extrude to shift the left vertex along the line
         * @param {number} endRight extrude to shift the left vertex along the line
         * @param {boolean} round whether this is a round cap
         * @private
         */
        addCurrentVertex(currentVertex, distance, normal, endLeft, endRight, round, segment) {
            const tx = round ? 1 : 0;
            let extrude;
            // const arrays = this.arrays;
            // const layoutVertexArray = arrays.layoutVertexArray;
            // const elementArray = arrays.elementArray;

            extrude = normal.clone();
            if (endLeft) extrude._sub(normal.perp()._mult(endLeft));
            addLineVertex(this.layoutVertexArray, currentVertex, extrude, tx, 0, endLeft, distance);
            this.e3 = segment.vertexLength++;
            if (this.e1 >= 0 && this.e2 >= 0) {
                this.indexArray.emplaceBack(this.e1, this.e2, this.e3);
                segment.primitiveLength++;
            }
            this.e1 = this.e2;
            this.e2 = this.e3;

            extrude = normal.mult(-1);
            if (endRight) extrude._sub(normal.perp()._mult(endRight));
            addLineVertex(this.layoutVertexArray, currentVertex, extrude, tx, 1, -endRight, distance);
            this.e3 = segment.vertexLength++;
            if (this.e1 >= 0 && this.e2 >= 0) {
                this.indexArray.emplaceBack(this.e1, this.e2, this.e3);
                segment.primitiveLength++;
            }
            this.e1 = this.e2;
            this.e2 = this.e3;

            // There is a maximum "distance along the line" that we can store in the buffers.
            // When we get close to the distance, reset it to zero and add the vertex again with
            // a distance of zero. The max distance is determined by the number of bits we allocate
            // to `linesofar`.
            if (distance > MAX_LINE_DISTANCE / 2) {
                this.distance = 0;
                this.addCurrentVertex(currentVertex, this.distance, normal, endLeft, endRight, round, segment);
            }
        }

        /**
         * Add a single new vertex and a triangle using two previous vertices.
         * This adds a pie slice triangle near a join to simulate round joins
         *
         * @param {Object} currentVertex the line vertex to add buffer vertices for
         * @param {number} distance the distance from the beggining of the line to the vertex
         * @param {Object} extrude the offset of the new vertex from the currentVertex
         * @param {boolean} whether the line is turning left or right at this angle
         * @private
         */
        addPieSliceVertex(currentVertex, distance, extrude, lineTurnsLeft, segment) {
            const ty = lineTurnsLeft ? 1 : 0;
            extrude = extrude.mult(lineTurnsLeft ? -1 : 1);
            // const arrays = this.arrays;
            // const layoutVertexArray = arrays.layoutVertexArray;
            // const elementArray = arrays.elementArray;

            addLineVertex(this.layoutVertexArray, currentVertex, extrude, 0, ty, 0, distance);
            this.e3 = segment.vertexLength++;
            if (this.e1 >= 0 && this.e2 >= 0) {
                this.indexArray.emplaceBack(this.e1, this.e2, this.e3);
                segment.primitiveLength++;
            }

            if (lineTurnsLeft) {
                this.e2 = this.e3;
            } else {
                this.e1 = this.e3;
            }
        }


        serialize(transferables) {
            return {
                type:this.type,
                style:this.style,
                tileSize: this.tileSize,
                layoutVertexArray: this.layoutVertexArray.serialize(transferables),
                indexArray:  this.indexArray.serialize(transferables),
                segments: this.segments
            };
        }


        static createBuffer(bucket){
            bucket.layoutVertexBuffer = new BufferUtil$1(bucket.layoutVertexArray,
                FillLayoutArrayType.serialize(), BufferUtil$1.BufferType.VERTEX);
            bucket.indexBuffer = new BufferUtil$1(bucket.indexArray,
                IndexArrayType.serialize(), BufferUtil$1.BufferType.ELEMENT);
        }
    }

    var LineBucket$1 = LineBucket;

    /*
     (c) 2017, Vladimir Agafonkin
     Simplify.js, a high-performance JS polyline simplification library
     mourner.github.io/simplify-js
    */

    // to suit your point format, run search/replace for '.x' and '.y';
    // for 3D version, see 3d branch (configurability would draw significant performance overhead)

    // square distance between 2 points
        function getSqDist(p1X,p1Y, p2X,p2Y) {

            var dx = p1X - p2X,
                dy = p1Y - p2Y;

            return dx * dx + dy * dy;
        }

    // square distance from a point to a segment
        function getSqSegDist(pX,pY,p1X,p1Y,p2X,p2Y) {

            var x = p1X,
                y = p1Y,
                dx = p2X - x,
                dy = p2Y - y;

            if (dx !== 0 || dy !== 0) {

                var t = ((pX - x) * dx + (pY - y) * dy) / (dx * dx + dy * dy);

                if (t > 1) {
                    x = p2X;
                    y = p2Y;

                } else if (t > 0) {
                    x += dx * t;
                    y += dy * t;
                }
            }

            dx = pX - x;
            dy = pY - y;

            return dx * dx + dy * dy;
        }
    // rest of the code doesn't care about point format

    // basic distance-based simplification
        function simplifyRadialDist(points, sqTolerance) {

            var prevPointX = points[0];
            var prevPointY = points[1];
            var newPoints = [points[0],points[1]];
            var pointX;
            var pointY;
            var len = points.length / 2;
            for (var i = 1 ; i < len; i++) {
                pointX = points[i * 2];
                pointY = points[i * 2 + 1];

                if (getSqDist(pointX,pointY, prevPointX,prevPointY) > sqTolerance) {
                    newPoints.push(pointX);
                    newPoints.push(pointY);
                    prevPointX = pointX;
                    prevPointY = pointY;
                }
            }

            if (prevPointX !== pointX && prevPointY !== pointY) {
                newPoints.push(pointX);
                newPoints.push(pointY);

            }

            return newPoints;
        }

        function simplifyDPStep(points, first, last, sqTolerance, simplified) {
            var maxSqDist = sqTolerance,
                index;

            for (var i = first + 1; i < last; i++) {
                var sqDist = getSqSegDist(points[i * 2] , points[i * 2 + 1] , points[first * 2] , points[first * 2 + 1] , points[last * 2] , points[last * 2 + 1]);
                if (sqDist > maxSqDist) {
                    index = i;
                    maxSqDist = sqDist;
                }
            }

            if (maxSqDist > sqTolerance) {
                if (index - first > 1) {
                    simplifyDPStep(points, first, index, sqTolerance, simplified);
                }

                simplified.push(points[index * 2]);
                simplified.push(points[index * 2 + 1]);

                if (last - index > 1) {
                    simplifyDPStep(points, index, last, sqTolerance, simplified);
                }
            }
        }

    // simplification using Ramer-Douglas-Peucker algorithm
        function simplifyDouglasPeucker(points, sqTolerance) {
            var last = points.length / 2 - 1;

            var simplified = [points[0],points[1]];

            simplifyDPStep(points, 0, last, sqTolerance , simplified);
            simplified.push(points[last * 2] , points[last * 2 + 1]);

            return simplified;
        }

    // both algorithms combined for awesome performance
        function simplify(points, tolerance, highestQuality) {

            if (points.length <= 4) return points;

            var sqTolerance = tolerance !== undefined ? tolerance * tolerance : 1;

            points = highestQuality ? points : simplifyRadialDist(points, sqTolerance);
            points = simplifyDouglasPeucker(points, sqTolerance);

            return points;
        }

    function Point(x, y) {
        this.x = x;
        this.y = y;
    }

    Point.prototype = {
        clone: function() { return new Point(this.x, this.y); },

        add:     function(p) { return this.clone()._add(p);     },
        sub:     function(p) { return this.clone()._sub(p);     },
        mult:    function(k) { return this.clone()._mult(k);    },
        div:     function(k) { return this.clone()._div(k);     },
        rotate:  function(a) { return this.clone()._rotate(a);  },
        matMult: function(m) { return this.clone()._matMult(m); },
        unit:    function() { return this.clone()._unit(); },
        perp:    function() { return this.clone()._perp(); },
        round:   function() { return this.clone()._round(); },

        mag: function() {
            return Math.sqrt(this.x * this.x + this.y * this.y);
        },

        equals: function(p) {
            return this.x === p.x &&
                this.y === p.y;
        },

        dist: function(p) {
            return Math.sqrt(this.distSqr(p));
        },

        distSqr: function(p) {
            var dx = p.x - this.x,
                dy = p.y - this.y;
            return dx * dx + dy * dy;
        },

        angle: function() {
            return Math.atan2(this.y, this.x);
        },

        angleTo: function(b) {
            return Math.atan2(this.y - b.y, this.x - b.x);
        },

        angleWith: function(b) {
            return this.angleWithSep(b.x, b.y);
        },

        // Find the angle of the two vectors, solving the formula for the cross product a x b = |a||b|sin(θ) for θ.
        angleWithSep: function(x, y) {
            return Math.atan2(
                this.x * y - this.y * x,
                this.x * x + this.y * y);
        },

        _matMult: function(m) {
            var x = m[0] * this.x + m[1] * this.y,
                y = m[2] * this.x + m[3] * this.y;
            this.x = x;
            this.y = y;
            return this;
        },

        _add: function(p) {
            this.x += p.x;
            this.y += p.y;
            return this;
        },

        _sub: function(p) {
            this.x -= p.x;
            this.y -= p.y;
            return this;
        },

        _mult: function(k) {
            this.x *= k;
            this.y *= k;
            return this;
        },

        _div: function(k) {
            this.x /= k;
            this.y /= k;
            return this;
        },

        _unit: function() {
            this._div(this.mag());
            return this;
        },

        _perp: function() {
            var y = this.y;
            this.y = this.x;
            this.x = -y;
            return this;
        },

        _rotate: function(angle) {
            var cos = Math.cos(angle),
                sin = Math.sin(angle),
                x = cos * this.x - sin * this.y,
                y = sin * this.x + cos * this.y;
            this.x = x;
            this.y = y;
            return this;
        },

        _round: function() {
            this.x = Math.round(this.x);
            this.y = Math.round(this.y);
            return this;
        }
    };

    // constructs Point from an array if necessary
    Point.convert = function (a) {
        if (a instanceof Point) {
            return a;
        }
        if (Array.isArray(a)) {
            return new Point(a[0], a[1]);
        }
        return a;
    };

    exports.FillBucket = FillBucket$1;
    exports.LineBucket = LineBucket$1;
    exports.Point = Point;
    exports.simplify = simplify;

}));
//# sourceMappingURL=point-e73d3a16.js.map
