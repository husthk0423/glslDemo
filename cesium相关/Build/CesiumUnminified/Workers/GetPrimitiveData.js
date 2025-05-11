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

define(['./Color-22035b49', './ComponentDatatype-4ab1a86a', './defined-a5305fd6', './Check-0f680516', './GeometryInstance-2afc3d77', './PolygonGeometry-2cebb17c', './PolygonOutlineGeometry-a84047fb', './VertexFormat-26a1b05a', './Resource-0c25a925', './combine-eceb7722', './WebGLConstants-d81b330d', './Cartesian2-b941a975', './Transforms-e81b498a', './defer-bfc6471e', './RuntimeError-8d8b6ef6', './Matrix2-81068516', './Math-79d70b44', './PixelFormat-3c3c79f0', './GeometryAttribute-a065274b', './GeometryAttributes-ae79d5fa', './PrimitivePipeline-90d56cdf', './GeographicProjection-bcd5d069', './Cartesian3-5587e0cf', './GetRidingLanternGeometry', './ArcType-b714639b', './BoundingRectangle-030bccf7', './EllipsoidGeodesic-04edecba', './EllipsoidTangentPlane-fc899479', './AxisAlignedBoundingBox-1a14512c', './IntersectionTests-8d40a746', './Plane-20e816c1', './GeometryOffsetAttribute-102da468', './GeometryPipeline-8667588a', './AttributeCompression-59630bdd', './EncodedCartesian3-3b2d3f49', './IndexDatatype-be8e0e62', './PolygonGeometryLibrary-08f40462', './arrayRemoveDuplicates-1c85c3e7', './EllipsoidRhumbLine-90229f69', './PolygonPipeline-ddb4fc8b', './_commonjsHelpers-89c9b271', './WebMercatorProjection-7ce9285b'], (function (Color, ComponentDatatype, defined, Check, GeometryInstance, PolygonGeometry, PolygonOutlineGeometry, VertexFormat, Resource, combine, WebGLConstants, Cartesian2, Transforms, defer, RuntimeError, Matrix2, Math$1, PixelFormat, GeometryAttribute, GeometryAttributes, PrimitivePipeline, GeographicProjection, Cartesian3, GetRidingLanternGeometry, ArcType, BoundingRectangle, EllipsoidGeodesic, EllipsoidTangentPlane, AxisAlignedBoundingBox, IntersectionTests, Plane, GeometryOffsetAttribute, GeometryPipeline, AttributeCompression, EncodedCartesian3, IndexDatatype, PolygonGeometryLibrary, arrayRemoveDuplicates, EllipsoidRhumbLine, PolygonPipeline, _commonjsHelpers, WebMercatorProjection) { 'use strict';

  /**
   * Value and type information for per-instance geometry color.
   *
   * @alias ColorGeometryInstanceAttribute
   * @constructor
   *
   * @param {Number} [red=1.0] The red component.
   * @param {Number} [green=1.0] The green component.
   * @param {Number} [blue=1.0] The blue component.
   * @param {Number} [alpha=1.0] The alpha component.
   *
   *
   * @example
   * const instance = new Cesium.GeometryInstance({
   *   geometry : Cesium.BoxGeometry.fromDimensions({
   *     dimensions : new Cesium.Cartesian3(1000000.0, 1000000.0, 500000.0)
   *   }),
   *   modelMatrix : Cesium.Matrix4.multiplyByTranslation(Cesium.Transforms.eastNorthUpToFixedFrame(
   *     Cesium.Cartesian3.fromDegrees(0.0, 0.0)), new Cesium.Cartesian3(0.0, 0.0, 1000000.0), new Cesium.Matrix4()),
   *   id : 'box',
   *   attributes : {
   *     color : new Cesium.ColorGeometryInstanceAttribute(red, green, blue, alpha)
   *   }
   * });
   *
   * @see GeometryInstance
   * @see GeometryInstanceAttribute
   */
  function ColorGeometryInstanceAttribute(red, green, blue, alpha) {
    red = defined.defaultValue(red, 1.0);
    green = defined.defaultValue(green, 1.0);
    blue = defined.defaultValue(blue, 1.0);
    alpha = defined.defaultValue(alpha, 1.0);

    /**
     * The values for the attributes stored in a typed array.
     *
     * @type Uint8Array
     *
     * @default [255, 255, 255, 255]
     */
    this.value = new Uint8Array([
      Color.Color.floatToByte(red),
      Color.Color.floatToByte(green),
      Color.Color.floatToByte(blue),
      Color.Color.floatToByte(alpha),
    ]);
  }

  Object.defineProperties(ColorGeometryInstanceAttribute.prototype, {
    /**
     * The datatype of each component in the attribute, e.g., individual elements in
     * {@link ColorGeometryInstanceAttribute#value}.
     *
     * @memberof ColorGeometryInstanceAttribute.prototype
     *
     * @type {ComponentDatatype}
     * @readonly
     *
     * @default {@link ComponentDatatype.UNSIGNED_BYTE}
     */
    componentDatatype: {
      get: function () {
        return ComponentDatatype.ComponentDatatype.UNSIGNED_BYTE;
      },
    },

    /**
     * The number of components in the attributes, i.e., {@link ColorGeometryInstanceAttribute#value}.
     *
     * @memberof ColorGeometryInstanceAttribute.prototype
     *
     * @type {Number}
     * @readonly
     *
     * @default 4
     */
    componentsPerAttribute: {
      get: function () {
        return 4;
      },
    },

    /**
     * When <code>true</code> and <code>componentDatatype</code> is an integer format,
     * indicate that the components should be mapped to the range [0, 1] (unsigned)
     * or [-1, 1] (signed) when they are accessed as floating-point for rendering.
     *
     * @memberof ColorGeometryInstanceAttribute.prototype
     *
     * @type {Boolean}
     * @readonly
     *
     * @default true
     */
    normalize: {
      get: function () {
        return true;
      },
    },
  });

  /**
   * Creates a new {@link ColorGeometryInstanceAttribute} instance given the provided {@link Color}.
   *
   * @param {Color} color The color.
   * @returns {ColorGeometryInstanceAttribute} The new {@link ColorGeometryInstanceAttribute} instance.
   *
   * @example
   * const instance = new Cesium.GeometryInstance({
   *   geometry : geometry,
   *   attributes : {
   *     color : Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.CORNFLOWERBLUE),
   *   }
   * });
   */
  ColorGeometryInstanceAttribute.fromColor = function (color) {
    //>>includeStart('debug', pragmas.debug);
    if (!defined.defined(color)) {
      throw new Check.DeveloperError("color is required.");
    }
    //>>includeEnd('debug');

    return new ColorGeometryInstanceAttribute(
      color.red,
      color.green,
      color.blue,
      color.alpha
    );
  };

  /**
   * Converts a color to a typed array that can be used to assign a color attribute.
   *
   * @param {Color} color The color.
   * @param {Uint8Array} [result] The array to store the result in, if undefined a new instance will be created.
   *
   * @returns {Uint8Array} The modified result parameter or a new instance if result was undefined.
   *
   * @example
   * const attributes = primitive.getGeometryInstanceAttributes('an id');
   * attributes.color = Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.AQUA, attributes.color);
   */
  ColorGeometryInstanceAttribute.toValue = function (color, result) {
    //>>includeStart('debug', pragmas.debug);
    if (!defined.defined(color)) {
      throw new Check.DeveloperError("color is required.");
    }
    //>>includeEnd('debug');

    if (!defined.defined(result)) {
      return new Uint8Array(color.toBytes());
    }
    return color.toBytes(result);
  };

  /**
   * Compares the provided ColorGeometryInstanceAttributes and returns
   * <code>true</code> if they are equal, <code>false</code> otherwise.
   *
   * @param {ColorGeometryInstanceAttribute} [left] The first ColorGeometryInstanceAttribute.
   * @param {ColorGeometryInstanceAttribute} [right] The second ColorGeometryInstanceAttribute.
   * @returns {Boolean} <code>true</code> if left and right are equal, <code>false</code> otherwise.
   */
  ColorGeometryInstanceAttribute.equals = function (left, right) {
    return (
      left === right ||
      (defined.defined(left) &&
        defined.defined(right) &&
        left.value[0] === right.value[0] &&
        left.value[1] === right.value[1] &&
        left.value[2] === right.value[2] &&
        left.value[3] === right.value[3])
    );
  };

  //This file is automatically rebuilt by the Cesium build process.
  var EllipsoidSurfaceAppearanceFS = "varying vec3 v_positionMC;\n\
varying vec3 v_positionEC;\n\
varying vec2 v_st;\n\
\n\
void main()\n\
{\n\
    czm_materialInput materialInput;\n\
\n\
    vec3 normalEC = normalize(czm_normal3D * czm_geodeticSurfaceNormal(v_positionMC, vec3(0.0), vec3(1.0)));\n\
#ifdef FACE_FORWARD\n\
    normalEC = faceforward(normalEC, vec3(0.0, 0.0, 1.0), -normalEC);\n\
#endif\n\
\n\
    materialInput.s = v_st.s;\n\
    materialInput.st = v_st;\n\
    materialInput.str = vec3(v_st, 0.0);\n\
\n\
    // Convert tangent space material normal to eye space\n\
    materialInput.normalEC = normalEC;\n\
    materialInput.tangentToEyeMatrix = czm_eastNorthUpToEyeCoordinates(v_positionMC, materialInput.normalEC);\n\
\n\
    // Convert view vector to world space\n\
    vec3 positionToEyeEC = -v_positionEC;\n\
    materialInput.positionToEyeEC = positionToEyeEC;\n\
\n\
    czm_material material = czm_getMaterial(materialInput);\n\
\n\
#ifdef FLAT\n\
    gl_FragColor = vec4(material.diffuse + material.emission, material.alpha);\n\
#else\n\
    gl_FragColor = czm_phong(normalize(positionToEyeEC), material, czm_lightDirectionEC);\n\
#endif\n\
}\n\
";

  //This file is automatically rebuilt by the Cesium build process.
  var EllipsoidSurfaceAppearanceVS = "attribute vec3 position3DHigh;\n\
attribute vec3 position3DLow;\n\
attribute vec2 st;\n\
attribute float batchId;\n\
\n\
varying vec3 v_positionMC;\n\
varying vec3 v_positionEC;\n\
varying vec2 v_st;\n\
\n\
void main()\n\
{\n\
    vec4 p = czm_computePosition();\n\
\n\
    v_positionMC = position3DHigh + position3DLow;           // position in model coordinates\n\
    v_positionEC = (czm_modelViewRelativeToEye * p).xyz;     // position in eye coordinates\n\
    v_st = st;\n\
\n\
    gl_Position = czm_modelViewProjectionRelativeToEye * p;\n\
}\n\
";

  /**
   * Determines how two pixels' values are combined.
   *
   * @enum {Number}
   */
  const BlendEquation = {
    /**
     * Pixel values are added componentwise.  This is used in additive blending for translucency.
     *
     * @type {Number}
     * @constant
     */
    ADD: WebGLConstants.WebGLConstants.FUNC_ADD,

    /**
     * Pixel values are subtracted componentwise (source - destination).  This is used in alpha blending for translucency.
     *
     * @type {Number}
     * @constant
     */
    SUBTRACT: WebGLConstants.WebGLConstants.FUNC_SUBTRACT,

    /**
     * Pixel values are subtracted componentwise (destination - source).
     *
     * @type {Number}
     * @constant
     */
    REVERSE_SUBTRACT: WebGLConstants.WebGLConstants.FUNC_REVERSE_SUBTRACT,

    /**
     * Pixel values are given to the minimum function (min(source, destination)).
     *
     * This equation operates on each pixel color component.
     *
     * @type {Number}
     * @constant
     */
    MIN: WebGLConstants.WebGLConstants.MIN,

    /**
     * Pixel values are given to the maximum function (max(source, destination)).
     *
     * This equation operates on each pixel color component.
     *
     * @type {Number}
     * @constant
     */
    MAX: WebGLConstants.WebGLConstants.MAX,
  };
  var BlendEquation$1 = Object.freeze(BlendEquation);

  /**
   * Determines how blending factors are computed.
   *
   * @enum {Number}
   */
  const BlendFunction = {
    /**
     * The blend factor is zero.
     *
     * @type {Number}
     * @constant
     */
    ZERO: WebGLConstants.WebGLConstants.ZERO,

    /**
     * The blend factor is one.
     *
     * @type {Number}
     * @constant
     */
    ONE: WebGLConstants.WebGLConstants.ONE,

    /**
     * The blend factor is the source color.
     *
     * @type {Number}
     * @constant
     */
    SOURCE_COLOR: WebGLConstants.WebGLConstants.SRC_COLOR,

    /**
     * The blend factor is one minus the source color.
     *
     * @type {Number}
     * @constant
     */
    ONE_MINUS_SOURCE_COLOR: WebGLConstants.WebGLConstants.ONE_MINUS_SRC_COLOR,

    /**
     * The blend factor is the destination color.
     *
     * @type {Number}
     * @constant
     */
    DESTINATION_COLOR: WebGLConstants.WebGLConstants.DST_COLOR,

    /**
     * The blend factor is one minus the destination color.
     *
     * @type {Number}
     * @constant
     */
    ONE_MINUS_DESTINATION_COLOR: WebGLConstants.WebGLConstants.ONE_MINUS_DST_COLOR,

    /**
     * The blend factor is the source alpha.
     *
     * @type {Number}
     * @constant
     */
    SOURCE_ALPHA: WebGLConstants.WebGLConstants.SRC_ALPHA,

    /**
     * The blend factor is one minus the source alpha.
     *
     * @type {Number}
     * @constant
     */
    ONE_MINUS_SOURCE_ALPHA: WebGLConstants.WebGLConstants.ONE_MINUS_SRC_ALPHA,

    /**
     * The blend factor is the destination alpha.
     *
     * @type {Number}
     * @constant
     */
    DESTINATION_ALPHA: WebGLConstants.WebGLConstants.DST_ALPHA,

    /**
     * The blend factor is one minus the destination alpha.
     *
     * @type {Number}
     * @constant
     */
    ONE_MINUS_DESTINATION_ALPHA: WebGLConstants.WebGLConstants.ONE_MINUS_DST_ALPHA,

    /**
     * The blend factor is the constant color.
     *
     * @type {Number}
     * @constant
     */
    CONSTANT_COLOR: WebGLConstants.WebGLConstants.CONSTANT_COLOR,

    /**
     * The blend factor is one minus the constant color.
     *
     * @type {Number}
     * @constant
     */
    ONE_MINUS_CONSTANT_COLOR: WebGLConstants.WebGLConstants.ONE_MINUS_CONSTANT_COLOR,

    /**
     * The blend factor is the constant alpha.
     *
     * @type {Number}
     * @constant
     */
    CONSTANT_ALPHA: WebGLConstants.WebGLConstants.CONSTANT_ALPHA,

    /**
     * The blend factor is one minus the constant alpha.
     *
     * @type {Number}
     * @constant
     */
    ONE_MINUS_CONSTANT_ALPHA: WebGLConstants.WebGLConstants.ONE_MINUS_CONSTANT_ALPHA,

    /**
     * The blend factor is the saturated source alpha.
     *
     * @type {Number}
     * @constant
     */
    SOURCE_ALPHA_SATURATE: WebGLConstants.WebGLConstants.SRC_ALPHA_SATURATE,
  };
  var BlendFunction$1 = Object.freeze(BlendFunction);

  /**
   * The blending state combines {@link BlendEquation} and {@link BlendFunction} and the
   * <code>enabled</code> flag to define the full blending state for combining source and
   * destination fragments when rendering.
   * <p>
   * This is a helper when using custom render states with {@link Appearance#renderState}.
   * </p>
   *
   * @namespace
   */
  const BlendingState = {
    /**
     * Blending is disabled.
     *
     * @type {Object}
     * @constant
     */
    DISABLED: Object.freeze({
      enabled: false,
    }),

    /**
     * Blending is enabled using alpha blending, <code>source(source.alpha) + destination(1 - source.alpha)</code>.
     *
     * @type {Object}
     * @constant
     */
    ALPHA_BLEND: Object.freeze({
      enabled: true,
      equationRgb: BlendEquation$1.ADD,
      equationAlpha: BlendEquation$1.ADD,
      functionSourceRgb: BlendFunction$1.SOURCE_ALPHA,
      functionSourceAlpha: BlendFunction$1.ONE,
      functionDestinationRgb: BlendFunction$1.ONE_MINUS_SOURCE_ALPHA,
      functionDestinationAlpha: BlendFunction$1.ONE_MINUS_SOURCE_ALPHA,
    }),

    /**
     * Blending is enabled using alpha blending with premultiplied alpha, <code>source + destination(1 - source.alpha)</code>.
     *
     * @type {Object}
     * @constant
     */
    PRE_MULTIPLIED_ALPHA_BLEND: Object.freeze({
      enabled: true,
      equationRgb: BlendEquation$1.ADD,
      equationAlpha: BlendEquation$1.ADD,
      functionSourceRgb: BlendFunction$1.ONE,
      functionSourceAlpha: BlendFunction$1.ONE,
      functionDestinationRgb: BlendFunction$1.ONE_MINUS_SOURCE_ALPHA,
      functionDestinationAlpha: BlendFunction$1.ONE_MINUS_SOURCE_ALPHA,
    }),

    /**
     * Blending is enabled using additive blending, <code>source(source.alpha) + destination</code>.
     *
     * @type {Object}
     * @constant
     */
    ADDITIVE_BLEND: Object.freeze({
      enabled: true,
      equationRgb: BlendEquation$1.ADD,
      equationAlpha: BlendEquation$1.ADD,
      functionSourceRgb: BlendFunction$1.SOURCE_ALPHA,
      functionSourceAlpha: BlendFunction$1.ONE,
      functionDestinationRgb: BlendFunction$1.ONE,
      functionDestinationAlpha: BlendFunction$1.ONE,
    }),
  };
  var BlendingState$1 = Object.freeze(BlendingState);

  /**
   * Determines which triangles, if any, are culled.
   *
   * @enum {Number}
   */
  const CullFace = {
    /**
     * Front-facing triangles are culled.
     *
     * @type {Number}
     * @constant
     */
    FRONT: WebGLConstants.WebGLConstants.FRONT,

    /**
     * Back-facing triangles are culled.
     *
     * @type {Number}
     * @constant
     */
    BACK: WebGLConstants.WebGLConstants.BACK,

    /**
     * Both front-facing and back-facing triangles are culled.
     *
     * @type {Number}
     * @constant
     */
    FRONT_AND_BACK: WebGLConstants.WebGLConstants.FRONT_AND_BACK,
  };
  var CullFace$1 = Object.freeze(CullFace);

  /**
   * An appearance defines the full GLSL vertex and fragment shaders and the
   * render state used to draw a {@link Primitive}.  All appearances implement
   * this base <code>Appearance</code> interface.
   *
   * @alias Appearance
   * @constructor
   *
   * @param {Object} [options] Object with the following properties:
   * @param {Boolean} [options.translucent=true] When <code>true</code>, the geometry is expected to appear translucent so {@link Appearance#renderState} has alpha blending enabled.
   * @param {Boolean} [options.closed=false] When <code>true</code>, the geometry is expected to be closed so {@link Appearance#renderState} has backface culling enabled.
   * @param {Material} [options.material=Material.ColorType] The material used to determine the fragment color.
   * @param {String} [options.vertexShaderSource] Optional GLSL vertex shader source to override the default vertex shader.
   * @param {String} [options.fragmentShaderSource] Optional GLSL fragment shader source to override the default fragment shader.
   * @param {Object} [options.renderState] Optional render state to override the default render state.
   *
   * @see MaterialAppearance
   * @see EllipsoidSurfaceAppearance
   * @see PerInstanceColorAppearance
   * @see DebugAppearance
   * @see PolylineColorAppearance
   * @see PolylineMaterialAppearance
   *
   * @demo {@link https://sandcastle.cesium.com/index.html?src=Geometry%20and%20Appearances.html|Geometry and Appearances Demo}
   */
  function Appearance(options) {
    options = defined.defaultValue(options, defined.defaultValue.EMPTY_OBJECT);

    /**
     * The material used to determine the fragment color.  Unlike other {@link Appearance}
     * properties, this is not read-only, so an appearance's material can change on the fly.
     *
     * @type Material
     *
     * @see {@link https://github.com/CesiumGS/cesium/wiki/Fabric|Fabric}
     */
    this.material = options.material;

    /**
     * When <code>true</code>, the geometry is expected to appear translucent.
     *
     * @type {Boolean}
     *
     * @default true
     */
    this.translucent = defined.defaultValue(options.translucent, true);

    this._vertexShaderSource = options.vertexShaderSource;
    this._fragmentShaderSource = options.fragmentShaderSource;
    this._renderState = options.renderState;
    this._closed = defined.defaultValue(options.closed, false);
  }

  Object.defineProperties(Appearance.prototype, {
    /**
     * The GLSL source code for the vertex shader.
     *
     * @memberof Appearance.prototype
     *
     * @type {String}
     * @readonly
     */
    vertexShaderSource: {
      get: function () {
        return this._vertexShaderSource;
      },
    },

    /**
     * The GLSL source code for the fragment shader.  The full fragment shader
     * source is built procedurally taking into account the {@link Appearance#material}.
     * Use {@link Appearance#getFragmentShaderSource} to get the full source.
     *
     * @memberof Appearance.prototype
     *
     * @type {String}
     * @readonly
     */
    fragmentShaderSource: {
      get: function () {
        return this._fragmentShaderSource;
      },
    },

    /**
     * The WebGL fixed-function state to use when rendering the geometry.
     *
     * @memberof Appearance.prototype
     *
     * @type {Object}
     * @readonly
     */
    renderState: {
      get: function () {
        return this._renderState;
      },
    },

    /**
     * When <code>true</code>, the geometry is expected to be closed.
     *
     * @memberof Appearance.prototype
     *
     * @type {Boolean}
     * @readonly
     *
     * @default false
     */
    closed: {
      get: function () {
        return this._closed;
      },
    },
  });

  /**
   * Procedurally creates the full GLSL fragment shader source for this appearance
   * taking into account {@link Appearance#fragmentShaderSource} and {@link Appearance#material}.
   *
   * @returns {String} The full GLSL fragment shader source.
   */
  Appearance.prototype.getFragmentShaderSource = function () {
    const parts = [];

    /*************新增开始**************/
    var partbatch = "varying vec4 v_endPlaneNormalEcAndBatchId;";
    parts.push(partbatch);
    /*************新增结束**************/

    if (this.flat) {
      parts.push("#define FLAT");
    }
    if (this.faceForward) {
      parts.push("#define FACE_FORWARD");
    }
    if (defined.defined(this.material)) {
      parts.push(this.material.shaderSource);
    }
    parts.push(this.fragmentShaderSource);

    return parts.join("\n");
  };

  /**
   * Determines if the geometry is translucent based on {@link Appearance#translucent} and {@link Material#isTranslucent}.
   *
   * @returns {Boolean} <code>true</code> if the appearance is translucent.
   */
  Appearance.prototype.isTranslucent = function () {
    return (
      (defined.defined(this.material) && this.material.isTranslucent()) ||
      (!defined.defined(this.material) && this.translucent)
    );
  };

  /**
   * Creates a render state.  This is not the final render state instance; instead,
   * it can contain a subset of render state properties identical to the render state
   * created in the context.
   *
   * @returns {Object} The render state.
   */
  Appearance.prototype.getRenderState = function () {
    const translucent = this.isTranslucent();
    const rs = Resource.clone(this.renderState, false);
    if (translucent) {
      rs.depthMask = false;
      rs.blending = BlendingState$1.ALPHA_BLEND;
    } else {
      rs.depthMask = true;
    }
    return rs;
  };

  /**
   * @private
   */
  Appearance.getDefaultRenderState = function (translucent, closed, existing) {
    let rs = {
      depthTest: {
        enabled: true,
      },
    };

    if (translucent) {
      rs.depthMask = false;
      rs.blending = BlendingState$1.ALPHA_BLEND;
    }

    if (closed) {
      rs.cull = {
        enabled: true,
        face: CullFace$1.BACK,
      };
    }

    if (defined.defined(existing)) {
      rs = combine.combine(existing, rs, true);
    }

    return rs;
  };

  /**
   * Creates a Globally unique identifier (GUID) string.  A GUID is 128 bits long, and can guarantee uniqueness across space and time.
   *
   * @function
   *
   * @returns {String}
   *
   *
   * @example
   * this.guid = Cesium.createGuid();
   *
   * @see {@link http://www.ietf.org/rfc/rfc4122.txt|RFC 4122 A Universally Unique IDentifier (UUID) URN Namespace}
   */
  function createGuid() {
    // http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  function returnTrue() {
    return true;
  }

  /**
   * Destroys an object.  Each of the object's functions, including functions in its prototype,
   * is replaced with a function that throws a {@link DeveloperError}, except for the object's
   * <code>isDestroyed</code> function, which is set to a function that returns <code>true</code>.
   * The object's properties are removed with <code>delete</code>.
   * <br /><br />
   * This function is used by objects that hold native resources, e.g., WebGL resources, which
   * need to be explicitly released.  Client code calls an object's <code>destroy</code> function,
   * which then releases the native resource and calls <code>destroyObject</code> to put itself
   * in a destroyed state.
   *
   * @function
   *
   * @param {Object} object The object to destroy.
   * @param {String} [message] The message to include in the exception that is thrown if
   *                           a destroyed object's function is called.
   *
   *
   * @example
   * // How a texture would destroy itself.
   * this.destroy = function () {
   *     _gl.deleteTexture(_texture);
   *     return Cesium.destroyObject(this);
   * };
   *
   * @see DeveloperError
   */
  function destroyObject(object, message) {
    message = defined.defaultValue(
      message,
      "This object was destroyed, i.e., destroy() was called."
    );

    function throwOnDestroyed() {
      //>>includeStart('debug', pragmas.debug);
      throw new Check.DeveloperError(message);
      //>>includeEnd('debug');
    }

    for (const key in object) {
      if (typeof object[key] === "function") {
        object[key] = throwOnDestroyed;
      }
    }

    object.isDestroyed = returnTrue;

    return undefined;
  }

  /**
   * Describes a compressed texture and contains a compressed texture buffer.
   * @alias CompressedTextureBuffer
   * @constructor
   *
   * @param {PixelFormat} internalFormat The pixel format of the compressed texture.
   * @param {PixelDatatype} pixelDatatype The pixel datatype of the compressed texture.
   * @param {Number} width The width of the texture.
   * @param {Number} height The height of the texture.
   * @param {Uint8Array} buffer The compressed texture buffer.
   */
  function CompressedTextureBuffer(
    internalFormat,
    pixelDatatype,
    width,
    height,
    buffer
  ) {
    this._format = internalFormat;
    this._datatype = pixelDatatype;
    this._width = width;
    this._height = height;
    this._buffer = buffer;
  }

  Object.defineProperties(CompressedTextureBuffer.prototype, {
    /**
     * The format of the compressed texture.
     * @type PixelFormat
     * @readonly
     * @memberof CompressedTextureBuffer.prototype
     */
    internalFormat: {
      get: function () {
        return this._format;
      },
    },
    /**
     * The datatype of the compressed texture.
     * @type PixelDatatype
     * @readonly
     * @memberof CompressedTextureBuffer.prototype
     */
    pixelDatatype: {
      get: function () {
        return this._datatype;
      },
    },
    /**
     * The width of the texture.
     * @type Number
     * @readonly
     * @memberof CompressedTextureBuffer.prototype
     */
    width: {
      get: function () {
        return this._width;
      },
    },
    /**
     * The height of the texture.
     * @type Number
     * @readonly
     * @memberof CompressedTextureBuffer.prototype
     */
    height: {
      get: function () {
        return this._height;
      },
    },
    /**
     * The compressed texture buffer.
     * @type Uint8Array
     * @readonly
     * @memberof CompressedTextureBuffer.prototype
     */
    bufferView: {
      get: function () {
        return this._buffer;
      },
    },
  });

  /**
   * Creates a shallow clone of a compressed texture buffer.
   *
   * @param {CompressedTextureBuffer} object The compressed texture buffer to be cloned.
   * @return {CompressedTextureBuffer} A shallow clone of the compressed texture buffer.
   */
  CompressedTextureBuffer.clone = function (object) {
    if (!defined.defined(object)) {
      return undefined;
    }

    return new CompressedTextureBuffer(
      object._format,
      object._datatype,
      object._width,
      object._height,
      object._buffer
    );
  };

  /**
   * Creates a shallow clone of this compressed texture buffer.
   *
   * @return {CompressedTextureBuffer} A shallow clone of the compressed texture buffer.
   */
  CompressedTextureBuffer.prototype.clone = function () {
    return CompressedTextureBuffer.clone(this);
  };

  function canTransferArrayBuffer() {
    if (!defined.defined(TaskProcessor._canTransferArrayBuffer)) {
      const worker = new Worker(
        getWorkerUrl("Workers/transferTypedArrayTest.js")
      );
      worker.postMessage = defined.defaultValue(
        worker.webkitPostMessage,
        worker.postMessage
      );

      const value = 99;
      const array = new Int8Array([value]);

      try {
        // postMessage might fail with a DataCloneError
        // if transferring array buffers is not supported.
        worker.postMessage(
          {
            array: array,
          },
          [array.buffer]
        );
      } catch (e) {
        TaskProcessor._canTransferArrayBuffer = false;
        return TaskProcessor._canTransferArrayBuffer;
      }

      const deferred = defer.defer();

      worker.onmessage = function (event) {
        const array = event.data.array;

        // some versions of Firefox silently fail to transfer typed arrays.
        // https://bugzilla.mozilla.org/show_bug.cgi?id=841904
        // Check to make sure the value round-trips successfully.
        const result = defined.defined(array) && array[0] === value;
        deferred.resolve(result);

        worker.terminate();

        TaskProcessor._canTransferArrayBuffer = result;
      };

      TaskProcessor._canTransferArrayBuffer = deferred.promise;
    }

    return TaskProcessor._canTransferArrayBuffer;
  }

  const taskCompletedEvent = new Resource.Event();

  function completeTask(processor, data) {
    --processor._activeTasks;

    const id = data.id;
    if (!defined.defined(id)) {
      // This is not one of ours.
      return;
    }

    const deferreds = processor._deferreds;
    const deferred = deferreds[id];

    if (defined.defined(data.error)) {
      let error = data.error;
      if (error.name === "RuntimeError") {
        error = new RuntimeError.RuntimeError(data.error.message);
        error.stack = data.error.stack;
      } else if (error.name === "DeveloperError") {
        error = new Check.DeveloperError(data.error.message);
        error.stack = data.error.stack;
      }
      taskCompletedEvent.raiseEvent(error);
      deferred.reject(error);
    } else {
      taskCompletedEvent.raiseEvent();
      deferred.resolve(data.result);
    }

    delete deferreds[id];
  }

  function getWorkerUrl(moduleID) {
    let url = Transforms.buildModuleUrl(moduleID);

    if (Resource.isCrossOriginUrl(url)) {
      //to load cross-origin, create a shim worker from a blob URL
      const script = `importScripts("${url}");`;

      let blob;
      try {
        blob = new Blob([script], {
          type: "application/javascript",
        });
      } catch (e) {
        const BlobBuilder =
          window.BlobBuilder ||
          window.WebKitBlobBuilder ||
          window.MozBlobBuilder ||
          window.MSBlobBuilder;
        const blobBuilder = new BlobBuilder();
        blobBuilder.append(script);
        blob = blobBuilder.getBlob("application/javascript");
      }

      const URL = window.URL || window.webkitURL;
      url = URL.createObjectURL(blob);
    }

    return url;
  }

  let bootstrapperUrlResult;
  function getBootstrapperUrl() {
    if (!defined.defined(bootstrapperUrlResult)) {
      bootstrapperUrlResult = getWorkerUrl("Workers/cesiumWorkerBootstrapper.js");
    }
    return bootstrapperUrlResult;
  }

  function createWorker(processor) {
    const worker = new Worker(getBootstrapperUrl());
    worker.postMessage = defined.defaultValue(
      worker.webkitPostMessage,
      worker.postMessage
    );

    const bootstrapMessage = {
      loaderConfig: {
        paths: {
          Workers: Transforms.buildModuleUrl("Workers"),
        },
        baseUrl: Transforms.buildModuleUrl.getCesiumBaseUrl().url,
      },
      workerModule: processor._workerPath,
    };

    worker.postMessage(bootstrapMessage);
    worker.onmessage = function (event) {
      completeTask(processor, event.data);
    };

    return worker;
  }

  function getWebAssemblyLoaderConfig(processor, wasmOptions) {
    const config = {
      modulePath: undefined,
      wasmBinaryFile: undefined,
      wasmBinary: undefined,
    };

    // Web assembly not supported, use fallback js module if provided
    if (!Transforms.FeatureDetection.supportsWebAssembly()) {
      if (!defined.defined(wasmOptions.fallbackModulePath)) {
        throw new RuntimeError.RuntimeError(
          `This browser does not support Web Assembly, and no backup module was provided for ${processor._workerPath}`
        );
      }

      config.modulePath = Transforms.buildModuleUrl(wasmOptions.fallbackModulePath);
      return Promise.resolve(config);
    }

    config.modulePath = Transforms.buildModuleUrl(wasmOptions.modulePath);
    config.wasmBinaryFile = Transforms.buildModuleUrl(wasmOptions.wasmBinaryFile);

    return Resource.Resource.fetchArrayBuffer({
      url: config.wasmBinaryFile,
    }).then(function (arrayBuffer) {
      config.wasmBinary = arrayBuffer;
      return config;
    });
  }

  /**
   * A wrapper around a web worker that allows scheduling tasks for a given worker,
   * returning results asynchronously via a promise.
   *
   * The Worker is not constructed until a task is scheduled.
   *
   * @alias TaskProcessor
   * @constructor
   *
   * @param {String} workerPath The Url to the worker. This can either be an absolute path or relative to the Cesium Workers folder.
   * @param {Number} [maximumActiveTasks=Number.POSITIVE_INFINITY] The maximum number of active tasks.  Once exceeded,
   *                                        scheduleTask will not queue any more tasks, allowing
   *                                        work to be rescheduled in future frames.
   */
  function TaskProcessor(workerPath, maximumActiveTasks) {
    const uri = new Resource.URI(workerPath);
    this._workerPath =
      uri.scheme().length !== 0 && uri.fragment().length === 0
        ? workerPath
        : TaskProcessor._workerModulePrefix + workerPath;
    this._maximumActiveTasks = defined.defaultValue(
      maximumActiveTasks,
      Number.POSITIVE_INFINITY
    );
    this._activeTasks = 0;
    this._deferreds = {};
    this._nextID = 0;
  }

  const emptyTransferableObjectArray = [];

  /**
   * Schedule a task to be processed by the web worker asynchronously.  If there are currently more
   * tasks active than the maximum set by the constructor, will immediately return undefined.
   * Otherwise, returns a promise that will resolve to the result posted back by the worker when
   * finished.
   *
   * @param {Object} parameters Any input data that will be posted to the worker.
   * @param {Object[]} [transferableObjects] An array of objects contained in parameters that should be
   *                                      transferred to the worker instead of copied.
   * @returns {Promise.<Object>|undefined} Either a promise that will resolve to the result when available, or undefined
   *                    if there are too many active tasks,
   *
   * @example
   * const taskProcessor = new Cesium.TaskProcessor('myWorkerPath');
   * const promise = taskProcessor.scheduleTask({
   *     someParameter : true,
   *     another : 'hello'
   * });
   * if (!Cesium.defined(promise)) {
   *     // too many active tasks - try again later
   * } else {
   *     promise.then(function(result) {
   *         // use the result of the task
   *     });
   * }
   */
  TaskProcessor.prototype.scheduleTask = function (
    parameters,
    transferableObjects
  ) {
    if (!defined.defined(this._worker)) {
      this._worker = createWorker(this);
    }

    if (this._activeTasks >= this._maximumActiveTasks) {
      return undefined;
    }

    ++this._activeTasks;

    const processor = this;
    return Promise.resolve(canTransferArrayBuffer()).then(function (
      canTransferArrayBuffer
    ) {
      if (!defined.defined(transferableObjects)) {
        transferableObjects = emptyTransferableObjectArray;
      } else if (!canTransferArrayBuffer) {
        transferableObjects.length = 0;
      }

      const id = processor._nextID++;
      const deferred = defer.defer();
      processor._deferreds[id] = deferred;

      processor._worker.postMessage(
        {
          id: id,
          parameters: parameters,
          canTransferArrayBuffer: canTransferArrayBuffer,
        },
        transferableObjects
      );

      return deferred.promise;
    });
  };

  /**
   * Posts a message to a web worker with configuration to initialize loading
   * and compiling a web assembly module asychronously, as well as an optional
   * fallback JavaScript module to use if Web Assembly is not supported.
   *
   * @param {Object} [webAssemblyOptions] An object with the following properties:
   * @param {String} [webAssemblyOptions.modulePath] The path of the web assembly JavaScript wrapper module.
   * @param {String} [webAssemblyOptions.wasmBinaryFile] The path of the web assembly binary file.
   * @param {String} [webAssemblyOptions.fallbackModulePath] The path of the fallback JavaScript module to use if web assembly is not supported.
   * @returns {Promise.<Object>} A promise that resolves to the result when the web worker has loaded and compiled the web assembly module and is ready to process tasks.
   */
  TaskProcessor.prototype.initWebAssemblyModule = function (webAssemblyOptions) {
    if (!defined.defined(this._worker)) {
      this._worker = createWorker(this);
    }

    const deferred = defer.defer();
    const processor = this;
    const worker = this._worker;
    getWebAssemblyLoaderConfig(this, webAssemblyOptions).then(function (
      wasmConfig
    ) {
      return Promise.resolve(canTransferArrayBuffer()).then(function (
        canTransferArrayBuffer
      ) {
        let transferableObjects;
        const binary = wasmConfig.wasmBinary;
        if (defined.defined(binary) && canTransferArrayBuffer) {
          transferableObjects = [binary];
        }

        worker.onmessage = function (event) {
          worker.onmessage = function (event) {
            completeTask(processor, event.data);
          };

          deferred.resolve(event.data);
        };

        worker.postMessage(
          { webAssemblyConfig: wasmConfig },
          transferableObjects
        );
      });
    });

    return deferred.promise;
  };

  /**
   * Returns true if this object was destroyed; otherwise, false.
   * <br /><br />
   * If this object was destroyed, it should not be used; calling any function other than
   * <code>isDestroyed</code> will result in a {@link DeveloperError} exception.
   *
   * @returns {Boolean} True if this object was destroyed; otherwise, false.
   *
   * @see TaskProcessor#destroy
   */
  TaskProcessor.prototype.isDestroyed = function () {
    return false;
  };

  /**
   * Destroys this object.  This will immediately terminate the Worker.
   * <br /><br />
   * Once an object is destroyed, it should not be used; calling any function other than
   * <code>isDestroyed</code> will result in a {@link DeveloperError} exception.
   */
  TaskProcessor.prototype.destroy = function () {
    if (defined.defined(this._worker)) {
      this._worker.terminate();
    }
    return destroyObject(this);
  };

  /**
   * An event that's raised when a task is completed successfully.  Event handlers are passed
   * the error object is a task fails.
   *
   * @type {Event}
   *
   * @private
   */
  TaskProcessor.taskCompletedEvent = taskCompletedEvent;

  // exposed for testing purposes
  TaskProcessor._defaultWorkerModulePrefix = "Workers/";
  TaskProcessor._workerModulePrefix = TaskProcessor._defaultWorkerModulePrefix;
  TaskProcessor._canTransferArrayBuffer = undefined;

  /**
   * Transcodes KTX2 textures using web workers.
   *
   * @private
   */
  function KTX2Transcoder() {}

  KTX2Transcoder._transcodeTaskProcessor = new TaskProcessor(
    "transcodeKTX2",
    Number.POSITIVE_INFINITY // KTX2 transcoding is used in place of Resource.fetchImage, so it can't reject as "just soooo busy right now"
  );

  KTX2Transcoder._readyPromise = undefined;

  function makeReadyPromise() {
    const readyPromise = KTX2Transcoder._transcodeTaskProcessor
      .initWebAssemblyModule({
        modulePath: "ThirdParty/Workers/basis_transcoder.js",
        wasmBinaryFile: "ThirdParty/basis_transcoder.wasm",
      })
      .then(function () {
        return KTX2Transcoder._transcodeTaskProcessor;
      });
    KTX2Transcoder._readyPromise = readyPromise;
  }

  KTX2Transcoder.transcode = function (ktx2Buffer, supportedTargetFormats) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.defined("supportedTargetFormats", supportedTargetFormats);
    //>>includeEnd('debug');

    if (!defined.defined(KTX2Transcoder._readyPromise)) {
      makeReadyPromise();
    }

    return KTX2Transcoder._readyPromise
      .then(function (taskProcessor) {
        let parameters;
        if (ktx2Buffer instanceof ArrayBuffer) {
          const view = new Uint8Array(ktx2Buffer);
          parameters = {
            supportedTargetFormats: supportedTargetFormats,
            ktx2Buffer: view,
          };
          return taskProcessor.scheduleTask(parameters, [ktx2Buffer]);
        }
        parameters = {
          supportedTargetFormats: supportedTargetFormats,
          ktx2Buffer: ktx2Buffer,
        };
        return taskProcessor.scheduleTask(parameters, [ktx2Buffer.buffer]);
      })
      .then(function (result) {
        const levelsLength = result.length;
        const faceKeys = Object.keys(result[0]);
        const faceKeysLength = faceKeys.length;

        let i;
        for (i = 0; i < levelsLength; i++) {
          const faces = result[i];
          for (let j = 0; j < faceKeysLength; j++) {
            const face = faces[faceKeys[j]];
            faces[faceKeys[j]] = new CompressedTextureBuffer(
              face.internalFormat,
              face.datatype,
              face.width,
              face.height,
              face.levelBuffer
            );
          }
        }

        // Cleaning up parsed result if it's a single image
        if (faceKeysLength === 1) {
          for (i = 0; i < levelsLength; ++i) {
            result[i] = result[i][faceKeys[0]];
          }

          if (levelsLength === 1) {
            result = result[0];
          }
        }
        return result;
      })
      .catch(function (error) {
        throw error;
      });
  };

  /**
   * Stores the supported formats that KTX2 can transcode to. Called during context creation.
   *
   * @param {Boolean} s3tc Whether or not S3TC is supported
   * @param {Boolean} pvrtc Whether or not PVRTC is supported
   * @param {Boolean} astc Whether or not ASTC is supported
   * @param {Boolean} etc Whether or not ETC is supported
   * @param {Boolean} etc1 Whether or not ETC1 is supported
   * @param {Boolean} bc7 Whether or not BC7 is supported
   * @private
   */
  let supportedTranscoderFormats;

  loadKTX2.setKTX2SupportedFormats = function (
    s3tc,
    pvrtc,
    astc,
    etc,
    etc1,
    bc7
  ) {
    supportedTranscoderFormats = {
      s3tc: s3tc,
      pvrtc: pvrtc,
      astc: astc,
      etc: etc,
      etc1: etc1,
      bc7: bc7,
    };
  };

  /**
   * Asynchronously loads and parses the given URL to a KTX2 file or parses the raw binary data of a KTX2 file.
   * Returns a promise that will resolve to an object containing the image buffer, width, height, and format once loaded,
   * or reject if the URL failed to load or failed to parse the data. The data is loaded
   * using XMLHttpRequest, which means that in order to make requests to another origin,
   * the server must have Cross-Origin Resource sharing (CORS) headers enabled.
   * <p>
   * The following are part of the KTX2 format specification but are not supported:
   * <ul>
   *     <li>Metadata</li>
   *     <li>3D textures</li>
   *     <li>Texture Arrays</li>
   *     <li>Video</li>
   * </ul>
   * </p>
   *
   * @function loadKTX2
   *
   * @param {Resource|String|ArrayBuffer} resourceOrUrlOrBuffer The URL of the binary data or an ArrayBuffer.
   * @returns {Promise.<CompressedTextureBuffer>|undefined} A promise that will resolve to the requested data when loaded. Returns undefined if <code>request.throttle</code> is true and the request does not have high enough priority.
   *
   * @exception {RuntimeError} Invalid KTX2 file.
   * @exception {RuntimeError} KTX2 texture arrays are not supported.
   * @exception {RuntimeError} KTX2 3D textures are unsupported.
   * @exception {RuntimeError} No transcoding format target available for ETC1S compressed ktx2s.
   * @exception {RuntimeError} No transcoding format target available for UASTC compressed ktx2s.
   * @exception {RuntimeError} startTranscoding() failed.
   * @exception {RuntimeError} transcodeImage() failed.
   *
   * @example
   * // load a single URL asynchronously
   * Cesium.loadKTX2('some/url').then(function (ktx2Data) {
   *     const width = ktx2Data.width;
   *     const height = ktx2Data.height;
   *     const format = ktx2Data.internalFormat;
   *     const arrayBufferView = ktx2Data.bufferView;
   *     // use the data to create a texture
   * }).catch(function (error) {
   *     // an error occurred.
   * });
   *
   * @see {@link https://github.com/KhronosGroup/KTX-Specification|KTX file format}
   * @see {@link http://www.w3.org/TR/cors/|Cross-Origin Resource Sharing}
   * @see {@link http://wiki.commonjs.org/wiki/Promises/A|CommonJS Promises/A}
   * @private
   */
  function loadKTX2(resourceOrUrlOrBuffer) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.defined("resourceOrUrlOrBuffer", resourceOrUrlOrBuffer);
    //>>includeEnd('debug');

    let loadPromise;
    if (
      resourceOrUrlOrBuffer instanceof ArrayBuffer ||
      ArrayBuffer.isView(resourceOrUrlOrBuffer)
    ) {
      loadPromise = Promise.resolve(resourceOrUrlOrBuffer);
    } else {
      const resource = Resource.Resource.createIfNeeded(resourceOrUrlOrBuffer);

      let processor = Cesium.processorMap[resource.request.url];
      loadPromise =  processor.scheduleTask({type:'3dtile',url:resource._url,throttleByServer:false});
    }

    // load module then return
    return loadPromise.then(function (data) {
      return KTX2Transcoder.transcode(data, supportedTranscoderFormats);
    });
  }

  /**
   * @private
   */
  const ContextLimits = {
    _maximumCombinedTextureImageUnits: 0,
    _maximumCubeMapSize: 0,
    _maximumFragmentUniformVectors: 0,
    _maximumTextureImageUnits: 0,
    _maximumRenderbufferSize: 0,
    _maximumTextureSize: 0,
    _maximumVaryingVectors: 0,
    _maximumVertexAttributes: 0,
    _maximumVertexTextureImageUnits: 0,
    _maximumVertexUniformVectors: 0,
    _minimumAliasedLineWidth: 0,
    _maximumAliasedLineWidth: 0,
    _minimumAliasedPointSize: 0,
    _maximumAliasedPointSize: 0,
    _maximumViewportWidth: 0,
    _maximumViewportHeight: 0,
    _maximumTextureFilterAnisotropy: 0,
    _maximumDrawBuffers: 0,
    _maximumColorAttachments: 0,
    _maximumSamples: 0,
    _highpFloatSupported: false,
    _highpIntSupported: false,
  };

  Object.defineProperties(ContextLimits, {
    /**
     * The maximum number of texture units that can be used from the vertex and fragment
     * shader with this WebGL implementation.  The minimum is eight.  If both shaders access the
     * same texture unit, this counts as two texture units.
     * @memberof ContextLimits
     * @type {Number}
     * @see {@link https://www.khronos.org/opengles/sdk/docs/man/xhtml/glGet.xml|glGet} with <code>MAX_COMBINED_TEXTURE_IMAGE_UNITS</code>.
     */
    maximumCombinedTextureImageUnits: {
      get: function () {
        return ContextLimits._maximumCombinedTextureImageUnits;
      },
    },

    /**
     * The approximate maximum cube mape width and height supported by this WebGL implementation.
     * The minimum is 16, but most desktop and laptop implementations will support much larger sizes like 8,192.
     * @memberof ContextLimits
     * @type {Number}
     * @see {@link https://www.khronos.org/opengles/sdk/docs/man/xhtml/glGet.xml|glGet} with <code>MAX_CUBE_MAP_TEXTURE_SIZE</code>.
     */
    maximumCubeMapSize: {
      get: function () {
        return ContextLimits._maximumCubeMapSize;
      },
    },

    /**
     * The maximum number of <code>vec4</code>, <code>ivec4</code>, and <code>bvec4</code>
     * uniforms that can be used by a fragment shader with this WebGL implementation.  The minimum is 16.
     * @memberof ContextLimits
     * @type {Number}
     * @see {@link https://www.khronos.org/opengles/sdk/docs/man/xhtml/glGet.xml|glGet} with <code>MAX_FRAGMENT_UNIFORM_VECTORS</code>.
     */
    maximumFragmentUniformVectors: {
      get: function () {
        return ContextLimits._maximumFragmentUniformVectors;
      },
    },

    /**
     * The maximum number of texture units that can be used from the fragment shader with this WebGL implementation.  The minimum is eight.
     * @memberof ContextLimits
     * @type {Number}
     * @see {@link https://www.khronos.org/opengles/sdk/docs/man/xhtml/glGet.xml|glGet} with <code>MAX_TEXTURE_IMAGE_UNITS</code>.
     */
    maximumTextureImageUnits: {
      get: function () {
        return ContextLimits._maximumTextureImageUnits;
      },
    },

    /**
     * The maximum renderbuffer width and height supported by this WebGL implementation.
     * The minimum is 16, but most desktop and laptop implementations will support much larger sizes like 8,192.
     * @memberof ContextLimits
     * @type {Number}
     * @see {@link https://www.khronos.org/opengles/sdk/docs/man/xhtml/glGet.xml|glGet} with <code>MAX_RENDERBUFFER_SIZE</code>.
     */
    maximumRenderbufferSize: {
      get: function () {
        return ContextLimits._maximumRenderbufferSize;
      },
    },

    /**
     * The approximate maximum texture width and height supported by this WebGL implementation.
     * The minimum is 64, but most desktop and laptop implementations will support much larger sizes like 8,192.
     * @memberof ContextLimits
     * @type {Number}
     * @see {@link https://www.khronos.org/opengles/sdk/docs/man/xhtml/glGet.xml|glGet} with <code>MAX_TEXTURE_SIZE</code>.
     */
    maximumTextureSize: {
      get: function () {
        return ContextLimits._maximumTextureSize;
      },
    },

    /**
     * The maximum number of <code>vec4</code> varying variables supported by this WebGL implementation.
     * The minimum is eight.  Matrices and arrays count as multiple <code>vec4</code>s.
     * @memberof ContextLimits
     * @type {Number}
     * @see {@link https://www.khronos.org/opengles/sdk/docs/man/xhtml/glGet.xml|glGet} with <code>MAX_VARYING_VECTORS</code>.
     */
    maximumVaryingVectors: {
      get: function () {
        return ContextLimits._maximumVaryingVectors;
      },
    },

    /**
     * The maximum number of <code>vec4</code> vertex attributes supported by this WebGL implementation.  The minimum is eight.
     * @memberof ContextLimits
     * @type {Number}
     * @see {@link https://www.khronos.org/opengles/sdk/docs/man/xhtml/glGet.xml|glGet} with <code>MAX_VERTEX_ATTRIBS</code>.
     */
    maximumVertexAttributes: {
      get: function () {
        return ContextLimits._maximumVertexAttributes;
      },
    },

    /**
     * The maximum number of texture units that can be used from the vertex shader with this WebGL implementation.
     * The minimum is zero, which means the GL does not support vertex texture fetch.
     * @memberof ContextLimits
     * @type {Number}
     * @see {@link https://www.khronos.org/opengles/sdk/docs/man/xhtml/glGet.xml|glGet} with <code>MAX_VERTEX_TEXTURE_IMAGE_UNITS</code>.
     */
    maximumVertexTextureImageUnits: {
      get: function () {
        return ContextLimits._maximumVertexTextureImageUnits;
      },
    },

    /**
     * The maximum number of <code>vec4</code>, <code>ivec4</code>, and <code>bvec4</code>
     * uniforms that can be used by a vertex shader with this WebGL implementation.  The minimum is 16.
     * @memberof ContextLimits
     * @type {Number}
     * @see {@link https://www.khronos.org/opengles/sdk/docs/man/xhtml/glGet.xml|glGet} with <code>MAX_VERTEX_UNIFORM_VECTORS</code>.
     */
    maximumVertexUniformVectors: {
      get: function () {
        return ContextLimits._maximumVertexUniformVectors;
      },
    },

    /**
     * The minimum aliased line width, in pixels, supported by this WebGL implementation.  It will be at most one.
     * @memberof ContextLimits
     * @type {Number}
     * @see {@link https://www.khronos.org/opengles/sdk/docs/man/xhtml/glGet.xml|glGet} with <code>ALIASED_LINE_WIDTH_RANGE</code>.
     */
    minimumAliasedLineWidth: {
      get: function () {
        return ContextLimits._minimumAliasedLineWidth;
      },
    },

    /**
     * The maximum aliased line width, in pixels, supported by this WebGL implementation.  It will be at least one.
     * @memberof ContextLimits
     * @type {Number}
     * @see {@link https://www.khronos.org/opengles/sdk/docs/man/xhtml/glGet.xml|glGet} with <code>ALIASED_LINE_WIDTH_RANGE</code>.
     */
    maximumAliasedLineWidth: {
      get: function () {
        return ContextLimits._maximumAliasedLineWidth;
      },
    },

    /**
     * The minimum aliased point size, in pixels, supported by this WebGL implementation.  It will be at most one.
     * @memberof ContextLimits
     * @type {Number}
     * @see {@link https://www.khronos.org/opengles/sdk/docs/man/xhtml/glGet.xml|glGet} with <code>ALIASED_POINT_SIZE_RANGE</code>.
     */
    minimumAliasedPointSize: {
      get: function () {
        return ContextLimits._minimumAliasedPointSize;
      },
    },

    /**
     * The maximum aliased point size, in pixels, supported by this WebGL implementation.  It will be at least one.
     * @memberof ContextLimits
     * @type {Number}
     * @see {@link https://www.khronos.org/opengles/sdk/docs/man/xhtml/glGet.xml|glGet} with <code>ALIASED_POINT_SIZE_RANGE</code>.
     */
    maximumAliasedPointSize: {
      get: function () {
        return ContextLimits._maximumAliasedPointSize;
      },
    },

    /**
     * The maximum supported width of the viewport.  It will be at least as large as the visible width of the associated canvas.
     * @memberof ContextLimits
     * @type {Number}
     * @see {@link https://www.khronos.org/opengles/sdk/docs/man/xhtml/glGet.xml|glGet} with <code>MAX_VIEWPORT_DIMS</code>.
     */
    maximumViewportWidth: {
      get: function () {
        return ContextLimits._maximumViewportWidth;
      },
    },

    /**
     * The maximum supported height of the viewport.  It will be at least as large as the visible height of the associated canvas.
     * @memberof ContextLimits
     * @type {Number}
     * @see {@link https://www.khronos.org/opengles/sdk/docs/man/xhtml/glGet.xml|glGet} with <code>MAX_VIEWPORT_DIMS</code>.
     */
    maximumViewportHeight: {
      get: function () {
        return ContextLimits._maximumViewportHeight;
      },
    },

    /**
     * The maximum degree of anisotropy for texture filtering
     * @memberof ContextLimits
     * @type {Number}
     */
    maximumTextureFilterAnisotropy: {
      get: function () {
        return ContextLimits._maximumTextureFilterAnisotropy;
      },
    },

    /**
     * The maximum number of simultaneous outputs that may be written in a fragment shader.
     * @memberof ContextLimits
     * @type {Number}
     */
    maximumDrawBuffers: {
      get: function () {
        return ContextLimits._maximumDrawBuffers;
      },
    },

    /**
     * The maximum number of color attachments supported.
     * @memberof ContextLimits
     * @type {Number}
     */
    maximumColorAttachments: {
      get: function () {
        return ContextLimits._maximumColorAttachments;
      },
    },

    /**
     * The maximum number of samples supported for multisampling.
     * @memberof ContextLimits
     * @type {Number}
     */
    maximumSamples: {
      get: function () {
        return ContextLimits._maximumSamples;
      },
    },

    /**
     * High precision float supported (<code>highp</code>) in fragment shaders.
     * @memberof ContextLimits
     * @type {Boolean}
     */
    highpFloatSupported: {
      get: function () {
        return ContextLimits._highpFloatSupported;
      },
    },

    /**
     * High precision int supported (<code>highp</code>) in fragment shaders.
     * @memberof ContextLimits
     * @type {Boolean}
     */
    highpIntSupported: {
      get: function () {
        return ContextLimits._highpIntSupported;
      },
    },
  });
  var ContextLimits$1 = ContextLimits;

  /**
   * @private
   */
  function CubeMapFace(
    context,
    texture,
    textureTarget,
    targetFace,
    internalFormat,
    pixelFormat,
    pixelDatatype,
    size,
    preMultiplyAlpha,
    flipY,
    initialized
  ) {
    this._context = context;
    this._texture = texture;
    this._textureTarget = textureTarget;
    this._targetFace = targetFace;
    this._pixelDatatype = pixelDatatype;
    this._internalFormat = internalFormat;
    this._pixelFormat = pixelFormat;
    this._size = size;
    this._preMultiplyAlpha = preMultiplyAlpha;
    this._flipY = flipY;
    this._initialized = initialized;
  }

  Object.defineProperties(CubeMapFace.prototype, {
    pixelFormat: {
      get: function () {
        return this._pixelFormat;
      },
    },
    pixelDatatype: {
      get: function () {
        return this._pixelDatatype;
      },
    },
    _target: {
      get: function () {
        return this._targetFace;
      },
    },
  });

  /**
   * Copies texels from the source to the cubemap's face.
   * @param {Object} options Object with the following properties:
   * @param {Object} options.source The source {@link ImageData}, {@link HTMLImageElement}, {@link HTMLCanvasElement}, {@link HTMLVideoElement},
   *                              or an object with a width, height, and arrayBufferView properties.
   * @param {Number} [options.xOffset=0] An offset in the x direction in the cubemap where copying begins.
   * @param {Number} [options.yOffset=0] An offset in the y direction in the cubemap where copying begins.
   * @param {Boolean} [options.skipColorSpaceConversion=false] If true, any custom gamma or color profiles in the texture will be ignored.
   * @exception {DeveloperError} xOffset must be greater than or equal to zero.
   * @exception {DeveloperError} yOffset must be greater than or equal to zero.
   * @exception {DeveloperError} xOffset + source.width must be less than or equal to width.
   * @exception {DeveloperError} yOffset + source.height must be less than or equal to height.
   * @exception {DeveloperError} This CubeMap was destroyed, i.e., destroy() was called.
   *
   * @example
   * // Create a cubemap with 1x1 faces, and make the +x face red.
   * const cubeMap = new CubeMap({
   *   context : context
   *   width : 1,
   *   height : 1
   * });
   * cubeMap.positiveX.copyFrom({
   *   source: {
   *     width : 1,
   *     height : 1,
   *     arrayBufferView : new Uint8Array([255, 0, 0, 255])
   *   }
   * });
   */
  CubeMapFace.prototype.copyFrom = function (options) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.defined("options", options);
    //>>includeEnd('debug');

    const xOffset = defined.defaultValue(options.xOffset, 0);
    const yOffset = defined.defaultValue(options.yOffset, 0);

    //>>includeStart('debug', pragmas.debug);
    Check.Check.defined("options.source", options.source);
    Check.Check.typeOf.number.greaterThanOrEquals("xOffset", xOffset, 0);
    Check.Check.typeOf.number.greaterThanOrEquals("yOffset", yOffset, 0);
    if (xOffset + options.source.width > this._size) {
      throw new Check.DeveloperError(
        "xOffset + options.source.width must be less than or equal to width."
      );
    }
    if (yOffset + options.source.height > this._size) {
      throw new Check.DeveloperError(
        "yOffset + options.source.height must be less than or equal to height."
      );
    }
    //>>includeEnd('debug');

    const source = options.source;

    const gl = this._context._gl;
    const target = this._textureTarget;
    const targetFace = this._targetFace;

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(target, this._texture);

    const width = source.width;
    const height = source.height;
    let arrayBufferView = source.arrayBufferView;

    const size = this._size;
    const pixelFormat = this._pixelFormat;
    const internalFormat = this._internalFormat;
    const pixelDatatype = this._pixelDatatype;

    const preMultiplyAlpha = this._preMultiplyAlpha;
    const flipY = this._flipY;
    const skipColorSpaceConversion = defined.defaultValue(
      options.skipColorSpaceConversion,
      false
    );

    let unpackAlignment = 4;
    if (defined.defined(arrayBufferView)) {
      unpackAlignment = PixelFormat.PixelFormat.alignmentInBytes(
        pixelFormat,
        pixelDatatype,
        width
      );
    }

    gl.pixelStorei(gl.UNPACK_ALIGNMENT, unpackAlignment);

    if (skipColorSpaceConversion) {
      gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.NONE);
    } else {
      gl.pixelStorei(
        gl.UNPACK_COLORSPACE_CONVERSION_WEBGL,
        gl.BROWSER_DEFAULT_WEBGL
      );
    }

    let uploaded = false;
    if (!this._initialized) {
      if (xOffset === 0 && yOffset === 0 && width === size && height === size) {
        // initialize the entire texture
        if (defined.defined(arrayBufferView)) {
          gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
          gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);

          if (flipY) {
            arrayBufferView = PixelFormat.PixelFormat.flipY(
              arrayBufferView,
              pixelFormat,
              pixelDatatype,
              size,
              size
            );
          }
          gl.texImage2D(
            targetFace,
            0,
            internalFormat,
            size,
            size,
            0,
            pixelFormat,
            PixelFormat.PixelDatatype.toWebGLConstant(pixelDatatype, this._context),
            arrayBufferView
          );
        } else {
          // Only valid for DOM-Element uploads
          gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, preMultiplyAlpha);
          gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, flipY);

          gl.texImage2D(
            targetFace,
            0,
            internalFormat,
            pixelFormat,
            PixelFormat.PixelDatatype.toWebGLConstant(pixelDatatype, this._context),
            source
          );
        }
        uploaded = true;
      } else {
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);

        // initialize the entire texture to zero
        const bufferView = PixelFormat.PixelFormat.createTypedArray(
          pixelFormat,
          pixelDatatype,
          size,
          size
        );
        gl.texImage2D(
          targetFace,
          0,
          internalFormat,
          size,
          size,
          0,
          pixelFormat,
          PixelFormat.PixelDatatype.toWebGLConstant(pixelDatatype, this._context),
          bufferView
        );
      }
      this._initialized = true;
    }

    if (!uploaded) {
      if (defined.defined(arrayBufferView)) {
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);

        if (flipY) {
          arrayBufferView = PixelFormat.PixelFormat.flipY(
            arrayBufferView,
            pixelFormat,
            pixelDatatype,
            width,
            height
          );
        }
        gl.texSubImage2D(
          targetFace,
          0,
          xOffset,
          yOffset,
          width,
          height,
          pixelFormat,
          PixelFormat.PixelDatatype.toWebGLConstant(pixelDatatype, this._context),
          arrayBufferView
        );
      } else {
        // Only valid for DOM-Element uploads
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, preMultiplyAlpha);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, flipY);

        // Source: ImageData, HTMLImageElement, HTMLCanvasElement, or HTMLVideoElement
        gl.texSubImage2D(
          targetFace,
          0,
          xOffset,
          yOffset,
          pixelFormat,
          PixelFormat.PixelDatatype.toWebGLConstant(pixelDatatype, this._context),
          source
        );
      }
    }

    gl.bindTexture(target, null);
  };

  /**
   * Copies texels from the framebuffer to the cubemap's face.
   *
   * @param {Number} [xOffset=0] An offset in the x direction in the cubemap where copying begins.
   * @param {Number} [yOffset=0] An offset in the y direction in the cubemap where copying begins.
   * @param {Number} [framebufferXOffset=0] An offset in the x direction in the framebuffer where copying begins from.
   * @param {Number} [framebufferYOffset=0] An offset in the y direction in the framebuffer where copying begins from.
   * @param {Number} [width=CubeMap's width] The width of the subimage to copy.
   * @param {Number} [height=CubeMap's height] The height of the subimage to copy.
   *
   * @exception {DeveloperError} Cannot call copyFromFramebuffer when the texture pixel data type is FLOAT.
   * @exception {DeveloperError} Cannot call copyFromFramebuffer when the texture pixel data type is HALF_FLOAT.
   * @exception {DeveloperError} This CubeMap was destroyed, i.e., destroy() was called.
   * @exception {DeveloperError} xOffset must be greater than or equal to zero.
   * @exception {DeveloperError} yOffset must be greater than or equal to zero.
   * @exception {DeveloperError} framebufferXOffset must be greater than or equal to zero.
   * @exception {DeveloperError} framebufferYOffset must be greater than or equal to zero.
   * @exception {DeveloperError} xOffset + source.width must be less than or equal to width.
   * @exception {DeveloperError} yOffset + source.height must be less than or equal to height.
   * @exception {DeveloperError} This CubeMap was destroyed, i.e., destroy() was called.
   *
   * @example
   * // Copy the framebuffer contents to the +x cube map face.
   * cubeMap.positiveX.copyFromFramebuffer();
   */
  CubeMapFace.prototype.copyFromFramebuffer = function (
    xOffset,
    yOffset,
    framebufferXOffset,
    framebufferYOffset,
    width,
    height
  ) {
    xOffset = defined.defaultValue(xOffset, 0);
    yOffset = defined.defaultValue(yOffset, 0);
    framebufferXOffset = defined.defaultValue(framebufferXOffset, 0);
    framebufferYOffset = defined.defaultValue(framebufferYOffset, 0);
    width = defined.defaultValue(width, this._size);
    height = defined.defaultValue(height, this._size);

    //>>includeStart('debug', pragmas.debug);
    Check.Check.typeOf.number.greaterThanOrEquals("xOffset", xOffset, 0);
    Check.Check.typeOf.number.greaterThanOrEquals("yOffset", yOffset, 0);
    Check.Check.typeOf.number.greaterThanOrEquals(
      "framebufferXOffset",
      framebufferXOffset,
      0
    );
    Check.Check.typeOf.number.greaterThanOrEquals(
      "framebufferYOffset",
      framebufferYOffset,
      0
    );
    if (xOffset + width > this._size) {
      throw new Check.DeveloperError(
        "xOffset + source.width must be less than or equal to width."
      );
    }
    if (yOffset + height > this._size) {
      throw new Check.DeveloperError(
        "yOffset + source.height must be less than or equal to height."
      );
    }
    if (this._pixelDatatype === PixelFormat.PixelDatatype.FLOAT) {
      throw new Check.DeveloperError(
        "Cannot call copyFromFramebuffer when the texture pixel data type is FLOAT."
      );
    }
    if (this._pixelDatatype === PixelFormat.PixelDatatype.HALF_FLOAT) {
      throw new Check.DeveloperError(
        "Cannot call copyFromFramebuffer when the texture pixel data type is HALF_FLOAT."
      );
    }
    //>>includeEnd('debug');

    const gl = this._context._gl;
    const target = this._textureTarget;

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(target, this._texture);
    gl.copyTexSubImage2D(
      this._targetFace,
      0,
      xOffset,
      yOffset,
      framebufferXOffset,
      framebufferYOffset,
      width,
      height
    );
    gl.bindTexture(target, null);
    this._initialized = true;
  };

  /**
   * @private
   */
  const MipmapHint = {
    DONT_CARE: WebGLConstants.WebGLConstants.DONT_CARE,
    FASTEST: WebGLConstants.WebGLConstants.FASTEST,
    NICEST: WebGLConstants.WebGLConstants.NICEST,

    validate: function (mipmapHint) {
      return (
        mipmapHint === MipmapHint.DONT_CARE ||
        mipmapHint === MipmapHint.FASTEST ||
        mipmapHint === MipmapHint.NICEST
      );
    },
  };
  var MipmapHint$1 = Object.freeze(MipmapHint);

  /**
   * Enumerates all possible filters used when magnifying WebGL textures.
   *
   * @enum {Number}
   *
   * @see TextureMinificationFilter
   */
  const TextureMagnificationFilter = {
    /**
     * Samples the texture by returning the closest pixel.
     *
     * @type {Number}
     * @constant
     */
    NEAREST: WebGLConstants.WebGLConstants.NEAREST,
    /**
     * Samples the texture through bi-linear interpolation of the four nearest pixels. This produces smoother results than <code>NEAREST</code> filtering.
     *
     * @type {Number}
     * @constant
     */
    LINEAR: WebGLConstants.WebGLConstants.LINEAR,
  };

  /**
   * Validates the given <code>textureMinificationFilter</code> with respect to the possible enum values.
   * @param textureMagnificationFilter
   * @returns {Boolean} <code>true</code> if <code>textureMagnificationFilter</code> is valid.
   *
   * @private
   */
  TextureMagnificationFilter.validate = function (textureMagnificationFilter) {
    return (
      textureMagnificationFilter === TextureMagnificationFilter.NEAREST ||
      textureMagnificationFilter === TextureMagnificationFilter.LINEAR
    );
  };

  var TextureMagnificationFilter$1 = Object.freeze(TextureMagnificationFilter);

  /**
   * Enumerates all possible filters used when minifying WebGL textures.
   *
   * @enum {Number}
   *
   * @see TextureMagnificationFilter
   */
  const TextureMinificationFilter = {
    /**
     * Samples the texture by returning the closest pixel.
     *
     * @type {Number}
     * @constant
     */
    NEAREST: WebGLConstants.WebGLConstants.NEAREST,
    /**
     * Samples the texture through bi-linear interpolation of the four nearest pixels. This produces smoother results than <code>NEAREST</code> filtering.
     *
     * @type {Number}
     * @constant
     */
    LINEAR: WebGLConstants.WebGLConstants.LINEAR,
    /**
     * Selects the nearest mip level and applies nearest sampling within that level.
     * <p>
     * Requires that the texture has a mipmap. The mip level is chosen by the view angle and screen-space size of the texture.
     * </p>
     *
     * @type {Number}
     * @constant
     */
    NEAREST_MIPMAP_NEAREST: WebGLConstants.WebGLConstants.NEAREST_MIPMAP_NEAREST,
    /**
     * Selects the nearest mip level and applies linear sampling within that level.
     * <p>
     * Requires that the texture has a mipmap. The mip level is chosen by the view angle and screen-space size of the texture.
     * </p>
     *
     * @type {Number}
     * @constant
     */
    LINEAR_MIPMAP_NEAREST: WebGLConstants.WebGLConstants.LINEAR_MIPMAP_NEAREST,
    /**
     * Read texture values with nearest sampling from two adjacent mip levels and linearly interpolate the results.
     * <p>
     * This option provides a good balance of visual quality and speed when sampling from a mipmapped texture.
     * </p>
     * <p>
     * Requires that the texture has a mipmap. The mip level is chosen by the view angle and screen-space size of the texture.
     * </p>
     *
     * @type {Number}
     * @constant
     */
    NEAREST_MIPMAP_LINEAR: WebGLConstants.WebGLConstants.NEAREST_MIPMAP_LINEAR,
    /**
     * Read texture values with linear sampling from two adjacent mip levels and linearly interpolate the results.
     * <p>
     * This option provides a good balance of visual quality and speed when sampling from a mipmapped texture.
     * </p>
     * <p>
     * Requires that the texture has a mipmap. The mip level is chosen by the view angle and screen-space size of the texture.
     * </p>
     * @type {Number}
     * @constant
     */
    LINEAR_MIPMAP_LINEAR: WebGLConstants.WebGLConstants.LINEAR_MIPMAP_LINEAR,
  };

  /**
   * Validates the given <code>textureMinificationFilter</code> with respect to the possible enum values.
   *
   * @private
   *
   * @param textureMinificationFilter
   * @returns {Boolean} <code>true</code> if <code>textureMinificationFilter</code> is valid.
   */
  TextureMinificationFilter.validate = function (textureMinificationFilter) {
    return (
      textureMinificationFilter === TextureMinificationFilter.NEAREST ||
      textureMinificationFilter === TextureMinificationFilter.LINEAR ||
      textureMinificationFilter ===
        TextureMinificationFilter.NEAREST_MIPMAP_NEAREST ||
      textureMinificationFilter ===
        TextureMinificationFilter.LINEAR_MIPMAP_NEAREST ||
      textureMinificationFilter ===
        TextureMinificationFilter.NEAREST_MIPMAP_LINEAR ||
      textureMinificationFilter === TextureMinificationFilter.LINEAR_MIPMAP_LINEAR
    );
  };

  var TextureMinificationFilter$1 = Object.freeze(TextureMinificationFilter);

  /**
   * @private
   */
  const TextureWrap = {
    CLAMP_TO_EDGE: WebGLConstants.WebGLConstants.CLAMP_TO_EDGE,
    REPEAT: WebGLConstants.WebGLConstants.REPEAT,
    MIRRORED_REPEAT: WebGLConstants.WebGLConstants.MIRRORED_REPEAT,

    validate: function (textureWrap) {
      return (
        textureWrap === TextureWrap.CLAMP_TO_EDGE ||
        textureWrap === TextureWrap.REPEAT ||
        textureWrap === TextureWrap.MIRRORED_REPEAT
      );
    },
  };
  var TextureWrap$1 = Object.freeze(TextureWrap);

  /**
   * @private
   */
  function Sampler(options) {
    options = defined.defaultValue(options, defined.defaultValue.EMPTY_OBJECT);

    const wrapS = defined.defaultValue(options.wrapS, TextureWrap$1.CLAMP_TO_EDGE);
    const wrapT = defined.defaultValue(options.wrapT, TextureWrap$1.CLAMP_TO_EDGE);
    const minificationFilter = defined.defaultValue(
      options.minificationFilter,
      TextureMinificationFilter$1.LINEAR
    );
    const magnificationFilter = defined.defaultValue(
      options.magnificationFilter,
      TextureMagnificationFilter$1.LINEAR
    );
    const maximumAnisotropy = defined.defined(options.maximumAnisotropy)
      ? options.maximumAnisotropy
      : 1.0;

    //>>includeStart('debug', pragmas.debug);
    if (!TextureWrap$1.validate(wrapS)) {
      throw new Check.DeveloperError("Invalid sampler.wrapS.");
    }

    if (!TextureWrap$1.validate(wrapT)) {
      throw new Check.DeveloperError("Invalid sampler.wrapT.");
    }

    if (!TextureMinificationFilter$1.validate(minificationFilter)) {
      throw new Check.DeveloperError("Invalid sampler.minificationFilter.");
    }

    if (!TextureMagnificationFilter$1.validate(magnificationFilter)) {
      throw new Check.DeveloperError("Invalid sampler.magnificationFilter.");
    }

    Check.Check.typeOf.number.greaterThanOrEquals(
      "maximumAnisotropy",
      maximumAnisotropy,
      1.0
    );
    //>>includeEnd('debug');

    this._wrapS = wrapS;
    this._wrapT = wrapT;
    this._minificationFilter = minificationFilter;
    this._magnificationFilter = magnificationFilter;
    this._maximumAnisotropy = maximumAnisotropy;
  }

  Object.defineProperties(Sampler.prototype, {
    wrapS: {
      get: function () {
        return this._wrapS;
      },
    },
    wrapT: {
      get: function () {
        return this._wrapT;
      },
    },
    minificationFilter: {
      get: function () {
        return this._minificationFilter;
      },
    },
    magnificationFilter: {
      get: function () {
        return this._magnificationFilter;
      },
    },
    maximumAnisotropy: {
      get: function () {
        return this._maximumAnisotropy;
      },
    },
  });

  Sampler.equals = function (left, right) {
    return (
      left === right ||
      (defined.defined(left) &&
        defined.defined(right) &&
        left._wrapS === right._wrapS &&
        left._wrapT === right._wrapT &&
        left._minificationFilter === right._minificationFilter &&
        left._magnificationFilter === right._magnificationFilter &&
        left._maximumAnisotropy === right._maximumAnisotropy)
    );
  };

  Sampler.NEAREST = Object.freeze(
    new Sampler({
      wrapS: TextureWrap$1.CLAMP_TO_EDGE,
      wrapT: TextureWrap$1.CLAMP_TO_EDGE,
      minificationFilter: TextureMinificationFilter$1.NEAREST,
      magnificationFilter: TextureMagnificationFilter$1.NEAREST,
    })
  );

  /**
   * @private
   */
  function CubeMap(options) {
    options = defined.defaultValue(options, defined.defaultValue.EMPTY_OBJECT);

    //>>includeStart('debug', pragmas.debug);
    Check.Check.defined("options.context", options.context);
    //>>includeEnd('debug');

    const context = options.context;
    const source = options.source;
    let width;
    let height;

    if (defined.defined(source)) {
      const faces = [
        source.positiveX,
        source.negativeX,
        source.positiveY,
        source.negativeY,
        source.positiveZ,
        source.negativeZ,
      ];

      //>>includeStart('debug', pragmas.debug);
      if (
        !faces[0] ||
        !faces[1] ||
        !faces[2] ||
        !faces[3] ||
        !faces[4] ||
        !faces[5]
      ) {
        throw new Check.DeveloperError(
          "options.source requires positiveX, negativeX, positiveY, negativeY, positiveZ, and negativeZ faces."
        );
      }
      //>>includeEnd('debug');

      width = faces[0].width;
      height = faces[0].height;

      //>>includeStart('debug', pragmas.debug);
      for (let i = 1; i < 6; ++i) {
        if (
          Number(faces[i].width) !== width ||
          Number(faces[i].height) !== height
        ) {
          throw new Check.DeveloperError(
            "Each face in options.source must have the same width and height."
          );
        }
      }
      //>>includeEnd('debug');
    } else {
      width = options.width;
      height = options.height;
    }

    const size = width;
    const pixelDatatype = defined.defaultValue(
      options.pixelDatatype,
      PixelFormat.PixelDatatype.UNSIGNED_BYTE
    );
    const pixelFormat = defined.defaultValue(options.pixelFormat, PixelFormat.PixelFormat.RGBA);
    const internalFormat = PixelFormat.PixelFormat.toInternalFormat(
      pixelFormat,
      pixelDatatype,
      context
    );

    //>>includeStart('debug', pragmas.debug);
    if (!defined.defined(width) || !defined.defined(height)) {
      throw new Check.DeveloperError(
        "options requires a source field to create an initialized cube map or width and height fields to create a blank cube map."
      );
    }

    if (width !== height) {
      throw new Check.DeveloperError("Width must equal height.");
    }

    if (size <= 0) {
      throw new Check.DeveloperError("Width and height must be greater than zero.");
    }

    if (size > ContextLimits$1.maximumCubeMapSize) {
      throw new Check.DeveloperError(
        `Width and height must be less than or equal to the maximum cube map size (${ContextLimits$1.maximumCubeMapSize}).  Check maximumCubeMapSize.`
      );
    }

    if (!PixelFormat.PixelFormat.validate(pixelFormat)) {
      throw new Check.DeveloperError("Invalid options.pixelFormat.");
    }

    if (PixelFormat.PixelFormat.isDepthFormat(pixelFormat)) {
      throw new Check.DeveloperError(
        "options.pixelFormat cannot be DEPTH_COMPONENT or DEPTH_STENCIL."
      );
    }

    if (!PixelFormat.PixelDatatype.validate(pixelDatatype)) {
      throw new Check.DeveloperError("Invalid options.pixelDatatype.");
    }

    if (pixelDatatype === PixelFormat.PixelDatatype.FLOAT && !context.floatingPointTexture) {
      throw new Check.DeveloperError(
        "When options.pixelDatatype is FLOAT, this WebGL implementation must support the OES_texture_float extension."
      );
    }

    if (
      pixelDatatype === PixelFormat.PixelDatatype.HALF_FLOAT &&
      !context.halfFloatingPointTexture
    ) {
      throw new Check.DeveloperError(
        "When options.pixelDatatype is HALF_FLOAT, this WebGL implementation must support the OES_texture_half_float extension."
      );
    }
    //>>includeEnd('debug');

    const sizeInBytes =
      PixelFormat.PixelFormat.textureSizeInBytes(pixelFormat, pixelDatatype, size, size) * 6;

    // Use premultiplied alpha for opaque textures should perform better on Chrome:
    // http://media.tojicode.com/webglCamp4/#20
    const preMultiplyAlpha =
      options.preMultiplyAlpha ||
      pixelFormat === PixelFormat.PixelFormat.RGB ||
      pixelFormat === PixelFormat.PixelFormat.LUMINANCE;
    const flipY = defined.defaultValue(options.flipY, true);
    const skipColorSpaceConversion = defined.defaultValue(
      options.skipColorSpaceConversion,
      false
    );

    const gl = context._gl;
    const textureTarget = gl.TEXTURE_CUBE_MAP;
    const texture = gl.createTexture();

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(textureTarget, texture);

    function createFace(
      target,
      sourceFace,
      preMultiplyAlpha,
      flipY,
      skipColorSpaceConversion
    ) {
      let arrayBufferView = sourceFace.arrayBufferView;
      if (!defined.defined(arrayBufferView)) {
        arrayBufferView = sourceFace.bufferView;
      }

      let unpackAlignment = 4;
      if (defined.defined(arrayBufferView)) {
        unpackAlignment = PixelFormat.PixelFormat.alignmentInBytes(
          pixelFormat,
          pixelDatatype,
          width
        );
      }

      gl.pixelStorei(gl.UNPACK_ALIGNMENT, unpackAlignment);

      if (skipColorSpaceConversion) {
        gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.NONE);
      } else {
        gl.pixelStorei(
          gl.UNPACK_COLORSPACE_CONVERSION_WEBGL,
          gl.BROWSER_DEFAULT_WEBGL
        );
      }

      if (defined.defined(arrayBufferView)) {
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);

        if (flipY) {
          arrayBufferView = PixelFormat.PixelFormat.flipY(
            arrayBufferView,
            pixelFormat,
            pixelDatatype,
            size,
            size
          );
        }
        gl.texImage2D(
          target,
          0,
          internalFormat,
          size,
          size,
          0,
          pixelFormat,
          PixelFormat.PixelDatatype.toWebGLConstant(pixelDatatype, context),
          arrayBufferView
        );
      } else {
        // Only valid for DOM-Element uploads
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, preMultiplyAlpha);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, flipY);

        // Source: ImageData, HTMLImageElement, HTMLCanvasElement, or HTMLVideoElement
        gl.texImage2D(
          target,
          0,
          internalFormat,
          pixelFormat,
          PixelFormat.PixelDatatype.toWebGLConstant(pixelDatatype, context),
          sourceFace
        );
      }
    }

    if (defined.defined(source)) {
      createFace(
        gl.TEXTURE_CUBE_MAP_POSITIVE_X,
        source.positiveX,
        preMultiplyAlpha,
        flipY,
        skipColorSpaceConversion
      );
      createFace(
        gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
        source.negativeX,
        preMultiplyAlpha,
        flipY,
        skipColorSpaceConversion
      );
      createFace(
        gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
        source.positiveY,
        preMultiplyAlpha,
        flipY,
        skipColorSpaceConversion
      );
      createFace(
        gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
        source.negativeY,
        preMultiplyAlpha,
        flipY,
        skipColorSpaceConversion
      );
      createFace(
        gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
        source.positiveZ,
        preMultiplyAlpha,
        flipY,
        skipColorSpaceConversion
      );
      createFace(
        gl.TEXTURE_CUBE_MAP_NEGATIVE_Z,
        source.negativeZ,
        preMultiplyAlpha,
        flipY,
        skipColorSpaceConversion
      );
    } else {
      gl.texImage2D(
        gl.TEXTURE_CUBE_MAP_POSITIVE_X,
        0,
        internalFormat,
        size,
        size,
        0,
        pixelFormat,
        PixelFormat.PixelDatatype.toWebGLConstant(pixelDatatype, context),
        null
      );
      gl.texImage2D(
        gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
        0,
        internalFormat,
        size,
        size,
        0,
        pixelFormat,
        PixelFormat.PixelDatatype.toWebGLConstant(pixelDatatype, context),
        null
      );
      gl.texImage2D(
        gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
        0,
        internalFormat,
        size,
        size,
        0,
        pixelFormat,
        PixelFormat.PixelDatatype.toWebGLConstant(pixelDatatype, context),
        null
      );
      gl.texImage2D(
        gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
        0,
        internalFormat,
        size,
        size,
        0,
        pixelFormat,
        PixelFormat.PixelDatatype.toWebGLConstant(pixelDatatype, context),
        null
      );
      gl.texImage2D(
        gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
        0,
        internalFormat,
        size,
        size,
        0,
        pixelFormat,
        PixelFormat.PixelDatatype.toWebGLConstant(pixelDatatype, context),
        null
      );
      gl.texImage2D(
        gl.TEXTURE_CUBE_MAP_NEGATIVE_Z,
        0,
        internalFormat,
        size,
        size,
        0,
        pixelFormat,
        PixelFormat.PixelDatatype.toWebGLConstant(pixelDatatype, context),
        null
      );
    }
    gl.bindTexture(textureTarget, null);

    this._context = context;
    this._textureFilterAnisotropic = context._textureFilterAnisotropic;
    this._textureTarget = textureTarget;
    this._texture = texture;
    this._pixelFormat = pixelFormat;
    this._pixelDatatype = pixelDatatype;
    this._size = size;
    this._hasMipmap = false;
    this._sizeInBytes = sizeInBytes;
    this._preMultiplyAlpha = preMultiplyAlpha;
    this._flipY = flipY;
    this._sampler = undefined;

    const initialized = defined.defined(source);
    this._positiveX = new CubeMapFace(
      context,
      texture,
      textureTarget,
      gl.TEXTURE_CUBE_MAP_POSITIVE_X,
      internalFormat,
      pixelFormat,
      pixelDatatype,
      size,
      preMultiplyAlpha,
      flipY,
      initialized
    );
    this._negativeX = new CubeMapFace(
      context,
      texture,
      textureTarget,
      gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
      internalFormat,
      pixelFormat,
      pixelDatatype,
      size,
      preMultiplyAlpha,
      flipY,
      initialized
    );
    this._positiveY = new CubeMapFace(
      context,
      texture,
      textureTarget,
      gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
      internalFormat,
      pixelFormat,
      pixelDatatype,
      size,
      preMultiplyAlpha,
      flipY,
      initialized
    );
    this._negativeY = new CubeMapFace(
      context,
      texture,
      textureTarget,
      gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
      internalFormat,
      pixelFormat,
      pixelDatatype,
      size,
      preMultiplyAlpha,
      flipY,
      initialized
    );
    this._positiveZ = new CubeMapFace(
      context,
      texture,
      textureTarget,
      gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
      internalFormat,
      pixelFormat,
      pixelDatatype,
      size,
      preMultiplyAlpha,
      flipY,
      initialized
    );
    this._negativeZ = new CubeMapFace(
      context,
      texture,
      textureTarget,
      gl.TEXTURE_CUBE_MAP_NEGATIVE_Z,
      internalFormat,
      pixelFormat,
      pixelDatatype,
      size,
      preMultiplyAlpha,
      flipY,
      initialized
    );

    this.sampler = defined.defined(options.sampler) ? options.sampler : new Sampler();
  }

  Object.defineProperties(CubeMap.prototype, {
    positiveX: {
      get: function () {
        return this._positiveX;
      },
    },
    negativeX: {
      get: function () {
        return this._negativeX;
      },
    },
    positiveY: {
      get: function () {
        return this._positiveY;
      },
    },
    negativeY: {
      get: function () {
        return this._negativeY;
      },
    },
    positiveZ: {
      get: function () {
        return this._positiveZ;
      },
    },
    negativeZ: {
      get: function () {
        return this._negativeZ;
      },
    },
    sampler: {
      get: function () {
        return this._sampler;
      },
      set: function (sampler) {
        let minificationFilter = sampler.minificationFilter;
        let magnificationFilter = sampler.magnificationFilter;

        const mipmap =
          minificationFilter ===
            TextureMinificationFilter$1.NEAREST_MIPMAP_NEAREST ||
          minificationFilter ===
            TextureMinificationFilter$1.NEAREST_MIPMAP_LINEAR ||
          minificationFilter ===
            TextureMinificationFilter$1.LINEAR_MIPMAP_NEAREST ||
          minificationFilter === TextureMinificationFilter$1.LINEAR_MIPMAP_LINEAR;

        const context = this._context;
        const pixelDatatype = this._pixelDatatype;

        // float textures only support nearest filtering unless the linear extensions are supported, so override the sampler's settings
        if (
          (pixelDatatype === PixelFormat.PixelDatatype.FLOAT &&
            !context.textureFloatLinear) ||
          (pixelDatatype === PixelFormat.PixelDatatype.HALF_FLOAT &&
            !context.textureHalfFloatLinear)
        ) {
          minificationFilter = mipmap
            ? TextureMinificationFilter$1.NEAREST_MIPMAP_NEAREST
            : TextureMinificationFilter$1.NEAREST;
          magnificationFilter = TextureMagnificationFilter$1.NEAREST;
        }

        const gl = context._gl;
        const target = this._textureTarget;

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(target, this._texture);
        gl.texParameteri(target, gl.TEXTURE_MIN_FILTER, minificationFilter);
        gl.texParameteri(target, gl.TEXTURE_MAG_FILTER, magnificationFilter);
        gl.texParameteri(target, gl.TEXTURE_WRAP_S, sampler.wrapS);
        gl.texParameteri(target, gl.TEXTURE_WRAP_T, sampler.wrapT);
        if (defined.defined(this._textureFilterAnisotropic)) {
          gl.texParameteri(
            target,
            this._textureFilterAnisotropic.TEXTURE_MAX_ANISOTROPY_EXT,
            sampler.maximumAnisotropy
          );
        }
        gl.bindTexture(target, null);

        this._sampler = sampler;
      },
    },
    pixelFormat: {
      get: function () {
        return this._pixelFormat;
      },
    },
    pixelDatatype: {
      get: function () {
        return this._pixelDatatype;
      },
    },
    width: {
      get: function () {
        return this._size;
      },
    },
    height: {
      get: function () {
        return this._size;
      },
    },
    sizeInBytes: {
      get: function () {
        if (this._hasMipmap) {
          return Math.floor((this._sizeInBytes * 4) / 3);
        }
        return this._sizeInBytes;
      },
    },
    preMultiplyAlpha: {
      get: function () {
        return this._preMultiplyAlpha;
      },
    },
    flipY: {
      get: function () {
        return this._flipY;
      },
    },

    _target: {
      get: function () {
        return this._textureTarget;
      },
    },
  });

  /**
   * Generates a complete mipmap chain for each cubemap face.
   *
   * @param {MipmapHint} [hint=MipmapHint.DONT_CARE] A performance vs. quality hint.
   *
   * @exception {DeveloperError} hint is invalid.
   * @exception {DeveloperError} This CubeMap's width must be a power of two to call generateMipmap().
   * @exception {DeveloperError} This CubeMap's height must be a power of two to call generateMipmap().
   * @exception {DeveloperError} This CubeMap was destroyed, i.e., destroy() was called.
   *
   * @example
   * // Generate mipmaps, and then set the sampler so mipmaps are used for
   * // minification when the cube map is sampled.
   * cubeMap.generateMipmap();
   * cubeMap.sampler = new Sampler({
   *   minificationFilter : Cesium.TextureMinificationFilter.NEAREST_MIPMAP_LINEAR
   * });
   */
  CubeMap.prototype.generateMipmap = function (hint) {
    hint = defined.defaultValue(hint, MipmapHint$1.DONT_CARE);

    //>>includeStart('debug', pragmas.debug);
    if (this._size > 1 && !Math$1.CesiumMath.isPowerOfTwo(this._size)) {
      throw new Check.DeveloperError(
        "width and height must be a power of two to call generateMipmap()."
      );
    }
    if (!MipmapHint$1.validate(hint)) {
      throw new Check.DeveloperError("hint is invalid.");
    }
    //>>includeEnd('debug');

    this._hasMipmap = true;

    const gl = this._context._gl;
    const target = this._textureTarget;
    gl.hint(gl.GENERATE_MIPMAP_HINT, hint);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(target, this._texture);
    gl.generateMipmap(target);
    gl.bindTexture(target, null);
  };

  CubeMap.prototype.isDestroyed = function () {
    return false;
  };

  CubeMap.prototype.destroy = function () {
    this._context._gl.deleteTexture(this._texture);
    this._positiveX = destroyObject(this._positiveX);
    this._negativeX = destroyObject(this._negativeX);
    this._positiveY = destroyObject(this._positiveY);
    this._negativeY = destroyObject(this._negativeY);
    this._positiveZ = destroyObject(this._positiveZ);
    this._negativeZ = destroyObject(this._negativeZ);
    return destroyObject(this);
  };

  /**
   * @private
   */
  function Texture(options) {
    options = defined.defaultValue(options, defined.defaultValue.EMPTY_OBJECT);

    //>>includeStart('debug', pragmas.debug);
    Check.Check.defined("options.context", options.context);
    //>>includeEnd('debug');

    const context = options.context;
    let width = options.width;
    let height = options.height;
    const source = options.source;

    if (defined.defined(source)) {
      if (!defined.defined(width)) {
        width = defined.defaultValue(source.videoWidth, source.width);
      }
      if (!defined.defined(height)) {
        height = defined.defaultValue(source.videoHeight, source.height);
      }
    }

    const pixelFormat = defined.defaultValue(options.pixelFormat, PixelFormat.PixelFormat.RGBA);
    const pixelDatatype = defined.defaultValue(
      options.pixelDatatype,
      PixelFormat.PixelDatatype.UNSIGNED_BYTE
    );
    const internalFormat = PixelFormat.PixelFormat.toInternalFormat(
      pixelFormat,
      pixelDatatype,
      context
    );

    const isCompressed = PixelFormat.PixelFormat.isCompressedFormat(internalFormat);

    //>>includeStart('debug', pragmas.debug);
    if (!defined.defined(width) || !defined.defined(height)) {
      throw new Check.DeveloperError(
        "options requires a source field to create an initialized texture or width and height fields to create a blank texture."
      );
    }

    Check.Check.typeOf.number.greaterThan("width", width, 0);

    if (width > ContextLimits$1.maximumTextureSize) {
      throw new Check.DeveloperError(
        `Width must be less than or equal to the maximum texture size (${ContextLimits$1.maximumTextureSize}).  Check maximumTextureSize.`
      );
    }

    Check.Check.typeOf.number.greaterThan("height", height, 0);

    if (height > ContextLimits$1.maximumTextureSize) {
      throw new Check.DeveloperError(
        `Height must be less than or equal to the maximum texture size (${ContextLimits$1.maximumTextureSize}).  Check maximumTextureSize.`
      );
    }

    if (!PixelFormat.PixelFormat.validate(pixelFormat)) {
      throw new Check.DeveloperError("Invalid options.pixelFormat.");
    }

    if (!isCompressed && !PixelFormat.PixelDatatype.validate(pixelDatatype)) {
      throw new Check.DeveloperError("Invalid options.pixelDatatype.");
    }

    if (
      pixelFormat === PixelFormat.PixelFormat.DEPTH_COMPONENT &&
      pixelDatatype !== PixelFormat.PixelDatatype.UNSIGNED_SHORT &&
      pixelDatatype !== PixelFormat.PixelDatatype.UNSIGNED_INT
    ) {
      throw new Check.DeveloperError(
        "When options.pixelFormat is DEPTH_COMPONENT, options.pixelDatatype must be UNSIGNED_SHORT or UNSIGNED_INT."
      );
    }

    if (
      pixelFormat === PixelFormat.PixelFormat.DEPTH_STENCIL &&
      pixelDatatype !== PixelFormat.PixelDatatype.UNSIGNED_INT_24_8
    ) {
      throw new Check.DeveloperError(
        "When options.pixelFormat is DEPTH_STENCIL, options.pixelDatatype must be UNSIGNED_INT_24_8."
      );
    }

    if (pixelDatatype === PixelFormat.PixelDatatype.FLOAT && !context.floatingPointTexture) {
      throw new Check.DeveloperError(
        "When options.pixelDatatype is FLOAT, this WebGL implementation must support the OES_texture_float extension.  Check context.floatingPointTexture."
      );
    }

    if (
      pixelDatatype === PixelFormat.PixelDatatype.HALF_FLOAT &&
      !context.halfFloatingPointTexture
    ) {
      throw new Check.DeveloperError(
        "When options.pixelDatatype is HALF_FLOAT, this WebGL implementation must support the OES_texture_half_float extension. Check context.halfFloatingPointTexture."
      );
    }

    if (PixelFormat.PixelFormat.isDepthFormat(pixelFormat)) {
      if (defined.defined(source)) {
        throw new Check.DeveloperError(
          "When options.pixelFormat is DEPTH_COMPONENT or DEPTH_STENCIL, source cannot be provided."
        );
      }

      if (!context.depthTexture) {
        throw new Check.DeveloperError(
          "When options.pixelFormat is DEPTH_COMPONENT or DEPTH_STENCIL, this WebGL implementation must support WEBGL_depth_texture.  Check context.depthTexture."
        );
      }
    }

    if (isCompressed) {
      if (!defined.defined(source) || !defined.defined(source.arrayBufferView)) {
        throw new Check.DeveloperError(
          "When options.pixelFormat is compressed, options.source.arrayBufferView must be defined."
        );
      }

      if (PixelFormat.PixelFormat.isDXTFormat(internalFormat) && !context.s3tc) {
        throw new Check.DeveloperError(
          "When options.pixelFormat is S3TC compressed, this WebGL implementation must support the WEBGL_compressed_texture_s3tc extension. Check context.s3tc."
        );
      } else if (PixelFormat.PixelFormat.isPVRTCFormat(internalFormat) && !context.pvrtc) {
        throw new Check.DeveloperError(
          "When options.pixelFormat is PVRTC compressed, this WebGL implementation must support the WEBGL_compressed_texture_pvrtc extension. Check context.pvrtc."
        );
      } else if (PixelFormat.PixelFormat.isASTCFormat(internalFormat) && !context.astc) {
        throw new Check.DeveloperError(
          "When options.pixelFormat is ASTC compressed, this WebGL implementation must support the WEBGL_compressed_texture_astc extension. Check context.astc."
        );
      } else if (PixelFormat.PixelFormat.isETC2Format(internalFormat) && !context.etc) {
        throw new Check.DeveloperError(
          "When options.pixelFormat is ETC2 compressed, this WebGL implementation must support the WEBGL_compressed_texture_etc extension. Check context.etc."
        );
      } else if (PixelFormat.PixelFormat.isETC1Format(internalFormat) && !context.etc1) {
        throw new Check.DeveloperError(
          "When options.pixelFormat is ETC1 compressed, this WebGL implementation must support the WEBGL_compressed_texture_etc1 extension. Check context.etc1."
        );
      } else if (PixelFormat.PixelFormat.isBC7Format(internalFormat) && !context.bc7) {
        throw new Check.DeveloperError(
          "When options.pixelFormat is BC7 compressed, this WebGL implementation must support the EXT_texture_compression_bptc extension. Check context.bc7."
        );
      }

      if (
        PixelFormat.PixelFormat.compressedTextureSizeInBytes(
          internalFormat,
          width,
          height
        ) !== source.arrayBufferView.byteLength
      ) {
        throw new Check.DeveloperError(
          "The byte length of the array buffer is invalid for the compressed texture with the given width and height."
        );
      }
    }
    //>>includeEnd('debug');

    // Use premultiplied alpha for opaque textures should perform better on Chrome:
    // http://media.tojicode.com/webglCamp4/#20
    const preMultiplyAlpha =
      options.preMultiplyAlpha ||
      pixelFormat === PixelFormat.PixelFormat.RGB ||
      pixelFormat === PixelFormat.PixelFormat.LUMINANCE;
    const flipY = defined.defaultValue(options.flipY, true);
    const skipColorSpaceConversion = defined.defaultValue(
      options.skipColorSpaceConversion,
      false
    );

    let initialized = true;

    const gl = context._gl;
    const textureTarget = gl.TEXTURE_2D;
    const texture = gl.createTexture();

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(textureTarget, texture);

    let unpackAlignment = 4;
    if (defined.defined(source) && defined.defined(source.arrayBufferView) && !isCompressed) {
      unpackAlignment = PixelFormat.PixelFormat.alignmentInBytes(
        pixelFormat,
        pixelDatatype,
        width
      );
    }

    gl.pixelStorei(gl.UNPACK_ALIGNMENT, unpackAlignment);

    if (skipColorSpaceConversion) {
      gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.NONE);
    } else {
      gl.pixelStorei(
        gl.UNPACK_COLORSPACE_CONVERSION_WEBGL,
        gl.BROWSER_DEFAULT_WEBGL
      );
    }

    if (defined.defined(source)) {
      if (defined.defined(source.arrayBufferView)) {
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);

        // Source: typed array
        let arrayBufferView = source.arrayBufferView;
        let i, mipWidth, mipHeight;
        if (isCompressed) {
          gl.compressedTexImage2D(
            textureTarget,
            0,
            internalFormat,
            width,
            height,
            0,
            arrayBufferView
          );
          if (defined.defined(source.mipLevels)) {
            mipWidth = width;
            mipHeight = height;
            for (i = 0; i < source.mipLevels.length; ++i) {
              mipWidth = Math.floor(mipWidth / 2) | 0;
              if (mipWidth < 1) {
                mipWidth = 1;
              }
              mipHeight = Math.floor(mipHeight / 2) | 0;
              if (mipHeight < 1) {
                mipHeight = 1;
              }
              gl.compressedTexImage2D(
                textureTarget,
                i + 1,
                internalFormat,
                mipWidth,
                mipHeight,
                0,
                source.mipLevels[i]
              );
            }
          }
        } else {
          if (flipY) {
            arrayBufferView = PixelFormat.PixelFormat.flipY(
              arrayBufferView,
              pixelFormat,
              pixelDatatype,
              width,
              height
            );
          }
          gl.texImage2D(
            textureTarget,
            0,
            internalFormat,
            width,
            height,
            0,
            pixelFormat,
            PixelFormat.PixelDatatype.toWebGLConstant(pixelDatatype, context),
            arrayBufferView
          );

          if (defined.defined(source.mipLevels)) {
            mipWidth = width;
            mipHeight = height;
            for (i = 0; i < source.mipLevels.length; ++i) {
              mipWidth = Math.floor(mipWidth / 2) | 0;
              if (mipWidth < 1) {
                mipWidth = 1;
              }
              mipHeight = Math.floor(mipHeight / 2) | 0;
              if (mipHeight < 1) {
                mipHeight = 1;
              }
              gl.texImage2D(
                textureTarget,
                i + 1,
                internalFormat,
                mipWidth,
                mipHeight,
                0,
                pixelFormat,
                PixelFormat.PixelDatatype.toWebGLConstant(pixelDatatype, context),
                source.mipLevels[i]
              );
            }
          }
        }
      } else if (defined.defined(source.framebuffer)) {
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);

        // Source: framebuffer
        if (source.framebuffer !== context.defaultFramebuffer) {
          source.framebuffer._bind();
        }

        gl.copyTexImage2D(
          textureTarget,
          0,
          internalFormat,
          source.xOffset,
          source.yOffset,
          width,
          height,
          0
        );

        if (source.framebuffer !== context.defaultFramebuffer) {
          source.framebuffer._unBind();
        }
      } else {
        // Only valid for DOM-Element uploads
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, preMultiplyAlpha);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, flipY);

        // Source: ImageData, HTMLImageElement, HTMLCanvasElement, or HTMLVideoElement
        gl.texImage2D(
          textureTarget,
          0,
          internalFormat,
          pixelFormat,
          PixelFormat.PixelDatatype.toWebGLConstant(pixelDatatype, context),
          source
        );
      }
    } else {
      gl.texImage2D(
        textureTarget,
        0,
        internalFormat,
        width,
        height,
        0,
        pixelFormat,
        PixelFormat.PixelDatatype.toWebGLConstant(pixelDatatype, context),
        null
      );
      initialized = false;
    }
    gl.bindTexture(textureTarget, null);

    let sizeInBytes;
    if (isCompressed) {
      sizeInBytes = PixelFormat.PixelFormat.compressedTextureSizeInBytes(
        pixelFormat,
        width,
        height
      );
    } else {
      sizeInBytes = PixelFormat.PixelFormat.textureSizeInBytes(
        pixelFormat,
        pixelDatatype,
        width,
        height
      );
    }

    this._id = createGuid();
    this._context = context;
    this._textureFilterAnisotropic = context._textureFilterAnisotropic;
    this._textureTarget = textureTarget;
    this._texture = texture;
    this._internalFormat = internalFormat;
    this._pixelFormat = pixelFormat;
    this._pixelDatatype = pixelDatatype;
    this._width = width;
    this._height = height;
    this._dimensions = new Cartesian2.Cartesian2(width, height);
    this._hasMipmap = false;
    this._sizeInBytes = sizeInBytes;
    this._preMultiplyAlpha = preMultiplyAlpha;
    this._flipY = flipY;
    this._initialized = initialized;
    this._sampler = undefined;

    this.sampler = defined.defined(options.sampler) ? options.sampler : new Sampler();
  }

  /**
   * This function is identical to using the Texture constructor except that it can be
   * replaced with a mock/spy in tests.
   * @private
   */
  Texture.create = function (options) {
    return new Texture(options);
  };

  /**
   * Creates a texture, and copies a subimage of the framebuffer to it.  When called without arguments,
   * the texture is the same width and height as the framebuffer and contains its contents.
   *
   * @param {Object} options Object with the following properties:
   * @param {Context} options.context The context in which the Texture gets created.
   * @param {PixelFormat} [options.pixelFormat=PixelFormat.RGB] The texture's internal pixel format.
   * @param {Number} [options.framebufferXOffset=0] An offset in the x direction in the framebuffer where copying begins from.
   * @param {Number} [options.framebufferYOffset=0] An offset in the y direction in the framebuffer where copying begins from.
   * @param {Number} [options.width=canvas.clientWidth] The width of the texture in texels.
   * @param {Number} [options.height=canvas.clientHeight] The height of the texture in texels.
   * @param {Framebuffer} [options.framebuffer=defaultFramebuffer] The framebuffer from which to create the texture.  If this
   *        parameter is not specified, the default framebuffer is used.
   * @returns {Texture} A texture with contents from the framebuffer.
   *
   * @exception {DeveloperError} Invalid pixelFormat.
   * @exception {DeveloperError} pixelFormat cannot be DEPTH_COMPONENT, DEPTH_STENCIL or a compressed format.
   * @exception {DeveloperError} framebufferXOffset must be greater than or equal to zero.
   * @exception {DeveloperError} framebufferYOffset must be greater than or equal to zero.
   * @exception {DeveloperError} framebufferXOffset + width must be less than or equal to canvas.clientWidth.
   * @exception {DeveloperError} framebufferYOffset + height must be less than or equal to canvas.clientHeight.
   *
   *
   * @example
   * // Create a texture with the contents of the framebuffer.
   * const t = Texture.fromFramebuffer({
   *     context : context
   * });
   *
   * @see Sampler
   *
   * @private
   */
  Texture.fromFramebuffer = function (options) {
    options = defined.defaultValue(options, defined.defaultValue.EMPTY_OBJECT);

    //>>includeStart('debug', pragmas.debug);
    Check.Check.defined("options.context", options.context);
    //>>includeEnd('debug');

    const context = options.context;
    const gl = context._gl;

    const pixelFormat = defined.defaultValue(options.pixelFormat, PixelFormat.PixelFormat.RGB);
    const framebufferXOffset = defined.defaultValue(options.framebufferXOffset, 0);
    const framebufferYOffset = defined.defaultValue(options.framebufferYOffset, 0);
    const width = defined.defaultValue(options.width, gl.drawingBufferWidth);
    const height = defined.defaultValue(options.height, gl.drawingBufferHeight);
    const framebuffer = options.framebuffer;

    //>>includeStart('debug', pragmas.debug);
    if (!PixelFormat.PixelFormat.validate(pixelFormat)) {
      throw new Check.DeveloperError("Invalid pixelFormat.");
    }
    if (
      PixelFormat.PixelFormat.isDepthFormat(pixelFormat) ||
      PixelFormat.PixelFormat.isCompressedFormat(pixelFormat)
    ) {
      throw new Check.DeveloperError(
        "pixelFormat cannot be DEPTH_COMPONENT, DEPTH_STENCIL or a compressed format."
      );
    }
    Check.Check.defined("options.context", options.context);
    Check.Check.typeOf.number.greaterThanOrEquals(
      "framebufferXOffset",
      framebufferXOffset,
      0
    );
    Check.Check.typeOf.number.greaterThanOrEquals(
      "framebufferYOffset",
      framebufferYOffset,
      0
    );
    if (framebufferXOffset + width > gl.drawingBufferWidth) {
      throw new Check.DeveloperError(
        "framebufferXOffset + width must be less than or equal to drawingBufferWidth"
      );
    }
    if (framebufferYOffset + height > gl.drawingBufferHeight) {
      throw new Check.DeveloperError(
        "framebufferYOffset + height must be less than or equal to drawingBufferHeight."
      );
    }
    //>>includeEnd('debug');

    const texture = new Texture({
      context: context,
      width: width,
      height: height,
      pixelFormat: pixelFormat,
      source: {
        framebuffer: defined.defined(framebuffer)
          ? framebuffer
          : context.defaultFramebuffer,
        xOffset: framebufferXOffset,
        yOffset: framebufferYOffset,
        width: width,
        height: height,
      },
    });

    return texture;
  };

  Object.defineProperties(Texture.prototype, {
    /**
     * A unique id for the texture
     * @memberof Texture.prototype
     * @type {String}
     * @readonly
     * @private
     */
    id: {
      get: function () {
        return this._id;
      },
    },
    /**
     * The sampler to use when sampling this texture.
     * Create a sampler by calling {@link Sampler}.  If this
     * parameter is not specified, a default sampler is used.  The default sampler clamps texture
     * coordinates in both directions, uses linear filtering for both magnification and minification,
     * and uses a maximum anisotropy of 1.0.
     * @memberof Texture.prototype
     * @type {Object}
     */
    sampler: {
      get: function () {
        return this._sampler;
      },
      set: function (sampler) {
        let minificationFilter = sampler.minificationFilter;
        let magnificationFilter = sampler.magnificationFilter;
        const context = this._context;
        const pixelFormat = this._pixelFormat;
        const pixelDatatype = this._pixelDatatype;

        const mipmap =
          minificationFilter ===
            TextureMinificationFilter$1.NEAREST_MIPMAP_NEAREST ||
          minificationFilter ===
            TextureMinificationFilter$1.NEAREST_MIPMAP_LINEAR ||
          minificationFilter ===
            TextureMinificationFilter$1.LINEAR_MIPMAP_NEAREST ||
          minificationFilter === TextureMinificationFilter$1.LINEAR_MIPMAP_LINEAR;

        // float textures only support nearest filtering unless the linear extensions are supported, so override the sampler's settings
        if (
          (pixelDatatype === PixelFormat.PixelDatatype.FLOAT &&
            !context.textureFloatLinear) ||
          (pixelDatatype === PixelFormat.PixelDatatype.HALF_FLOAT &&
            !context.textureHalfFloatLinear)
        ) {
          minificationFilter = mipmap
            ? TextureMinificationFilter$1.NEAREST_MIPMAP_NEAREST
            : TextureMinificationFilter$1.NEAREST;
          magnificationFilter = TextureMagnificationFilter$1.NEAREST;
        }

        // WebGL 2 depth texture only support nearest filtering. See section 3.8.13 OpenGL ES 3 spec
        if (context.webgl2) {
          if (PixelFormat.PixelFormat.isDepthFormat(pixelFormat)) {
            minificationFilter = TextureMinificationFilter$1.NEAREST;
            magnificationFilter = TextureMagnificationFilter$1.NEAREST;
          }
        }

        const gl = context._gl;
        const target = this._textureTarget;

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(target, this._texture);
        gl.texParameteri(target, gl.TEXTURE_MIN_FILTER, minificationFilter);
        gl.texParameteri(target, gl.TEXTURE_MAG_FILTER, magnificationFilter);
        gl.texParameteri(target, gl.TEXTURE_WRAP_S, sampler.wrapS);
        gl.texParameteri(target, gl.TEXTURE_WRAP_T, sampler.wrapT);
        if (defined.defined(this._textureFilterAnisotropic)) {
          gl.texParameteri(
            target,
            this._textureFilterAnisotropic.TEXTURE_MAX_ANISOTROPY_EXT,
            sampler.maximumAnisotropy
          );
        }
        gl.bindTexture(target, null);

        this._sampler = sampler;
      },
    },
    pixelFormat: {
      get: function () {
        return this._pixelFormat;
      },
    },
    pixelDatatype: {
      get: function () {
        return this._pixelDatatype;
      },
    },
    dimensions: {
      get: function () {
        return this._dimensions;
      },
    },
    preMultiplyAlpha: {
      get: function () {
        return this._preMultiplyAlpha;
      },
    },
    flipY: {
      get: function () {
        return this._flipY;
      },
    },
    width: {
      get: function () {
        return this._width;
      },
    },
    height: {
      get: function () {
        return this._height;
      },
    },
    sizeInBytes: {
      get: function () {
        if (this._hasMipmap) {
          return Math.floor((this._sizeInBytes * 4) / 3);
        }
        return this._sizeInBytes;
      },
    },
    _target: {
      get: function () {
        return this._textureTarget;
      },
    },
  });

  /**
   * Copy new image data into this texture, from a source {@link ImageData}, {@link HTMLImageElement}, {@link HTMLCanvasElement}, or {@link HTMLVideoElement}.
   * or an object with width, height, and arrayBufferView properties.
   * @param {Object} options Object with the following properties:
   * @param {Object} options.source The source {@link ImageData}, {@link HTMLImageElement}, {@link HTMLCanvasElement}, or {@link HTMLVideoElement},
   *                        or an object with width, height, and arrayBufferView properties.
   * @param {Number} [options.xOffset=0] The offset in the x direction within the texture to copy into.
   * @param {Number} [options.yOffset=0] The offset in the y direction within the texture to copy into.
   * @param {Boolean} [options.skipColorSpaceConversion=false] If true, any custom gamma or color profiles in the texture will be ignored.
   *
   * @exception {DeveloperError} Cannot call copyFrom when the texture pixel format is DEPTH_COMPONENT or DEPTH_STENCIL.
   * @exception {DeveloperError} Cannot call copyFrom with a compressed texture pixel format.
   * @exception {DeveloperError} xOffset must be greater than or equal to zero.
   * @exception {DeveloperError} yOffset must be greater than or equal to zero.
   * @exception {DeveloperError} xOffset + source.width must be less than or equal to width.
   * @exception {DeveloperError} yOffset + source.height must be less than or equal to height.
   * @exception {DeveloperError} This texture was destroyed, i.e., destroy() was called.
   *
   * @example
   * texture.copyFrom({
   *  source: {
   *   width : 1,
   *   height : 1,
   *   arrayBufferView : new Uint8Array([255, 0, 0, 255])
   *  }
   * });
   */
  Texture.prototype.copyFrom = function (options) {
    //>>includeStart('debug', pragmas.debug);
    Check.Check.defined("options", options);
    //>>includeEnd('debug');

    const xOffset = defined.defaultValue(options.xOffset, 0);
    const yOffset = defined.defaultValue(options.yOffset, 0);

    //>>includeStart('debug', pragmas.debug);
    Check.Check.defined("options.source", options.source);
    if (PixelFormat.PixelFormat.isDepthFormat(this._pixelFormat)) {
      throw new Check.DeveloperError(
        "Cannot call copyFrom when the texture pixel format is DEPTH_COMPONENT or DEPTH_STENCIL."
      );
    }
    if (PixelFormat.PixelFormat.isCompressedFormat(this._pixelFormat)) {
      throw new Check.DeveloperError(
        "Cannot call copyFrom with a compressed texture pixel format."
      );
    }
    Check.Check.typeOf.number.greaterThanOrEquals("xOffset", xOffset, 0);
    Check.Check.typeOf.number.greaterThanOrEquals("yOffset", yOffset, 0);
    Check.Check.typeOf.number.lessThanOrEquals(
      "xOffset + options.source.width",
      xOffset + options.source.width,
      this._width
    );
    Check.Check.typeOf.number.lessThanOrEquals(
      "yOffset + options.source.height",
      yOffset + options.source.height,
      this._height
    );
    //>>includeEnd('debug');

    const source = options.source;

    const context = this._context;
    const gl = context._gl;
    const target = this._textureTarget;

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(target, this._texture);

    const width = source.width;
    const height = source.height;
    let arrayBufferView = source.arrayBufferView;

    const textureWidth = this._width;
    const textureHeight = this._height;
    const internalFormat = this._internalFormat;
    const pixelFormat = this._pixelFormat;
    const pixelDatatype = this._pixelDatatype;

    const preMultiplyAlpha = this._preMultiplyAlpha;
    const flipY = this._flipY;
    const skipColorSpaceConversion = defined.defaultValue(
      options.skipColorSpaceConversion,
      false
    );

    let unpackAlignment = 4;
    if (defined.defined(arrayBufferView)) {
      unpackAlignment = PixelFormat.PixelFormat.alignmentInBytes(
        pixelFormat,
        pixelDatatype,
        width
      );
    }

    gl.pixelStorei(gl.UNPACK_ALIGNMENT, unpackAlignment);

    if (skipColorSpaceConversion) {
      gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.NONE);
    } else {
      gl.pixelStorei(
        gl.UNPACK_COLORSPACE_CONVERSION_WEBGL,
        gl.BROWSER_DEFAULT_WEBGL
      );
    }

    let uploaded = false;
    if (!this._initialized) {
      if (
        xOffset === 0 &&
        yOffset === 0 &&
        width === textureWidth &&
        height === textureHeight
      ) {
        // initialize the entire texture
        if (defined.defined(arrayBufferView)) {
          gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
          gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);

          if (flipY) {
            arrayBufferView = PixelFormat.PixelFormat.flipY(
              arrayBufferView,
              pixelFormat,
              pixelDatatype,
              textureWidth,
              textureHeight
            );
          }
          gl.texImage2D(
            target,
            0,
            internalFormat,
            textureWidth,
            textureHeight,
            0,
            pixelFormat,
            PixelFormat.PixelDatatype.toWebGLConstant(pixelDatatype, context),
            arrayBufferView
          );
        } else {
          // Only valid for DOM-Element uploads
          gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, preMultiplyAlpha);
          gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, flipY);

          gl.texImage2D(
            target,
            0,
            internalFormat,
            pixelFormat,
            PixelFormat.PixelDatatype.toWebGLConstant(pixelDatatype, context),
            source
          );
        }
        uploaded = true;
      } else {
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);

        // initialize the entire texture to zero
        const bufferView = PixelFormat.PixelFormat.createTypedArray(
          pixelFormat,
          pixelDatatype,
          textureWidth,
          textureHeight
        );
        gl.texImage2D(
          target,
          0,
          internalFormat,
          textureWidth,
          textureHeight,
          0,
          pixelFormat,
          PixelFormat.PixelDatatype.toWebGLConstant(pixelDatatype, context),
          bufferView
        );
      }
      this._initialized = true;
    }

    if (!uploaded) {
      if (defined.defined(arrayBufferView)) {
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);

        if (flipY) {
          arrayBufferView = PixelFormat.PixelFormat.flipY(
            arrayBufferView,
            pixelFormat,
            pixelDatatype,
            width,
            height
          );
        }
        gl.texSubImage2D(
          target,
          0,
          xOffset,
          yOffset,
          width,
          height,
          pixelFormat,
          PixelFormat.PixelDatatype.toWebGLConstant(pixelDatatype, context),
          arrayBufferView
        );
      } else {
        // Only valid for DOM-Element uploads
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, preMultiplyAlpha);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, flipY);

        gl.texSubImage2D(
          target,
          0,
          xOffset,
          yOffset,
          pixelFormat,
          PixelFormat.PixelDatatype.toWebGLConstant(pixelDatatype, context),
          source
        );
      }
    }

    gl.bindTexture(target, null);
  };

  /**
   * @param {Number} [xOffset=0] The offset in the x direction within the texture to copy into.
   * @param {Number} [yOffset=0] The offset in the y direction within the texture to copy into.
   * @param {Number} [framebufferXOffset=0] optional
   * @param {Number} [framebufferYOffset=0] optional
   * @param {Number} [width=width] optional
   * @param {Number} [height=height] optional
   *
   * @exception {DeveloperError} Cannot call copyFromFramebuffer when the texture pixel format is DEPTH_COMPONENT or DEPTH_STENCIL.
   * @exception {DeveloperError} Cannot call copyFromFramebuffer when the texture pixel data type is FLOAT.
   * @exception {DeveloperError} Cannot call copyFromFramebuffer when the texture pixel data type is HALF_FLOAT.
   * @exception {DeveloperError} Cannot call copyFrom with a compressed texture pixel format.
   * @exception {DeveloperError} This texture was destroyed, i.e., destroy() was called.
   * @exception {DeveloperError} xOffset must be greater than or equal to zero.
   * @exception {DeveloperError} yOffset must be greater than or equal to zero.
   * @exception {DeveloperError} framebufferXOffset must be greater than or equal to zero.
   * @exception {DeveloperError} framebufferYOffset must be greater than or equal to zero.
   * @exception {DeveloperError} xOffset + width must be less than or equal to width.
   * @exception {DeveloperError} yOffset + height must be less than or equal to height.
   */
  Texture.prototype.copyFromFramebuffer = function (
    xOffset,
    yOffset,
    framebufferXOffset,
    framebufferYOffset,
    width,
    height
  ) {
    xOffset = defined.defaultValue(xOffset, 0);
    yOffset = defined.defaultValue(yOffset, 0);
    framebufferXOffset = defined.defaultValue(framebufferXOffset, 0);
    framebufferYOffset = defined.defaultValue(framebufferYOffset, 0);
    width = defined.defaultValue(width, this._width);
    height = defined.defaultValue(height, this._height);

    //>>includeStart('debug', pragmas.debug);
    if (PixelFormat.PixelFormat.isDepthFormat(this._pixelFormat)) {
      throw new Check.DeveloperError(
        "Cannot call copyFromFramebuffer when the texture pixel format is DEPTH_COMPONENT or DEPTH_STENCIL."
      );
    }
    if (this._pixelDatatype === PixelFormat.PixelDatatype.FLOAT) {
      throw new Check.DeveloperError(
        "Cannot call copyFromFramebuffer when the texture pixel data type is FLOAT."
      );
    }
    if (this._pixelDatatype === PixelFormat.PixelDatatype.HALF_FLOAT) {
      throw new Check.DeveloperError(
        "Cannot call copyFromFramebuffer when the texture pixel data type is HALF_FLOAT."
      );
    }
    if (PixelFormat.PixelFormat.isCompressedFormat(this._pixelFormat)) {
      throw new Check.DeveloperError(
        "Cannot call copyFrom with a compressed texture pixel format."
      );
    }

    Check.Check.typeOf.number.greaterThanOrEquals("xOffset", xOffset, 0);
    Check.Check.typeOf.number.greaterThanOrEquals("yOffset", yOffset, 0);
    Check.Check.typeOf.number.greaterThanOrEquals(
      "framebufferXOffset",
      framebufferXOffset,
      0
    );
    Check.Check.typeOf.number.greaterThanOrEquals(
      "framebufferYOffset",
      framebufferYOffset,
      0
    );
    Check.Check.typeOf.number.lessThanOrEquals(
      "xOffset + width",
      xOffset + width,
      this._width
    );
    Check.Check.typeOf.number.lessThanOrEquals(
      "yOffset + height",
      yOffset + height,
      this._height
    );
    //>>includeEnd('debug');

    const gl = this._context._gl;
    const target = this._textureTarget;

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(target, this._texture);
    gl.copyTexSubImage2D(
      target,
      0,
      xOffset,
      yOffset,
      framebufferXOffset,
      framebufferYOffset,
      width,
      height
    );
    gl.bindTexture(target, null);
    this._initialized = true;
  };

  /**
   * @param {MipmapHint} [hint=MipmapHint.DONT_CARE] optional.
   *
   * @exception {DeveloperError} Cannot call generateMipmap when the texture pixel format is DEPTH_COMPONENT or DEPTH_STENCIL.
   * @exception {DeveloperError} Cannot call generateMipmap when the texture pixel format is a compressed format.
   * @exception {DeveloperError} hint is invalid.
   * @exception {DeveloperError} This texture's width must be a power of two to call generateMipmap() in a WebGL1 context.
   * @exception {DeveloperError} This texture's height must be a power of two to call generateMipmap() in a WebGL1 context.
   * @exception {DeveloperError} This texture was destroyed, i.e., destroy() was called.
   */
  Texture.prototype.generateMipmap = function (hint) {
    hint = defined.defaultValue(hint, MipmapHint$1.DONT_CARE);

    //>>includeStart('debug', pragmas.debug);
    if (PixelFormat.PixelFormat.isDepthFormat(this._pixelFormat)) {
      throw new Check.DeveloperError(
        "Cannot call generateMipmap when the texture pixel format is DEPTH_COMPONENT or DEPTH_STENCIL."
      );
    }
    if (PixelFormat.PixelFormat.isCompressedFormat(this._pixelFormat)) {
      throw new Check.DeveloperError(
        "Cannot call generateMipmap with a compressed pixel format."
      );
    }
    if (!this._context.webgl2) {
      if (this._width > 1 && !Math$1.CesiumMath.isPowerOfTwo(this._width)) {
        throw new Check.DeveloperError(
          "width must be a power of two to call generateMipmap() in a WebGL1 context."
        );
      }
      if (this._height > 1 && !Math$1.CesiumMath.isPowerOfTwo(this._height)) {
        throw new Check.DeveloperError(
          "height must be a power of two to call generateMipmap() in a WebGL1 context."
        );
      }
    }
    if (!MipmapHint$1.validate(hint)) {
      throw new Check.DeveloperError("hint is invalid.");
    }
    //>>includeEnd('debug');

    this._hasMipmap = true;

    const gl = this._context._gl;
    const target = this._textureTarget;

    gl.hint(gl.GENERATE_MIPMAP_HINT, hint);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(target, this._texture);
    gl.generateMipmap(target);
    gl.bindTexture(target, null);
  };

  Texture.prototype.isDestroyed = function () {
    return false;
  };

  Texture.prototype.destroy = function () {
    this._context._gl.deleteTexture(this._texture);
    return destroyObject(this);
  };

  //This file is automatically rebuilt by the Cesium build process.
  var AspectRampMaterial = "uniform sampler2D image;\n\
\n\
czm_material czm_getMaterial(czm_materialInput materialInput)\n\
{\n\
    czm_material material = czm_getDefaultMaterial(materialInput);\n\
    vec4 rampColor = texture2D(image, vec2(materialInput.aspect / (2.0 * czm_pi), 0.5));\n\
    rampColor = czm_gammaCorrect(rampColor);\n\
    material.diffuse = rampColor.rgb;\n\
    material.alpha = rampColor.a;\n\
    return material;\n\
}\n\
";

  //This file is automatically rebuilt by the Cesium build process.
  var BumpMapMaterial = "uniform sampler2D image;\n\
uniform float strength;\n\
uniform vec2 repeat;\n\
\n\
czm_material czm_getMaterial(czm_materialInput materialInput)\n\
{\n\
    czm_material material = czm_getDefaultMaterial(materialInput);\n\
\n\
    vec2 st = materialInput.st;\n\
\n\
    vec2 centerPixel = fract(repeat * st);\n\
    float centerBump = texture2D(image, centerPixel).channel;\n\
\n\
    float imageWidth = float(imageDimensions.x);\n\
    vec2 rightPixel = fract(repeat * (st + vec2(1.0 / imageWidth, 0.0)));\n\
    float rightBump = texture2D(image, rightPixel).channel;\n\
\n\
    float imageHeight = float(imageDimensions.y);\n\
    vec2 leftPixel = fract(repeat * (st + vec2(0.0, 1.0 / imageHeight)));\n\
    float topBump = texture2D(image, leftPixel).channel;\n\
\n\
    vec3 normalTangentSpace = normalize(vec3(centerBump - rightBump, centerBump - topBump, clamp(1.0 - strength, 0.1, 1.0)));\n\
    vec3 normalEC = materialInput.tangentToEyeMatrix * normalTangentSpace;\n\
\n\
    material.normal = normalEC;\n\
    material.diffuse = vec3(0.01);\n\
\n\
    return material;\n\
}\n\
";

  //This file is automatically rebuilt by the Cesium build process.
  var CheckerboardMaterial = "uniform vec4 lightColor;\n\
uniform vec4 darkColor;\n\
uniform vec2 repeat;\n\
\n\
czm_material czm_getMaterial(czm_materialInput materialInput)\n\
{\n\
    czm_material material = czm_getDefaultMaterial(materialInput);\n\
\n\
    vec2 st = materialInput.st;\n\
\n\
    // From Stefan Gustavson's Procedural Textures in GLSL in OpenGL Insights\n\
    float b = mod(floor(repeat.s * st.s) + floor(repeat.t * st.t), 2.0);  // 0.0 or 1.0\n\
\n\
    // Find the distance from the closest separator (region between two colors)\n\
    float scaledWidth = fract(repeat.s * st.s);\n\
    scaledWidth = abs(scaledWidth - floor(scaledWidth + 0.5));\n\
    float scaledHeight = fract(repeat.t * st.t);\n\
    scaledHeight = abs(scaledHeight - floor(scaledHeight + 0.5));\n\
    float value = min(scaledWidth, scaledHeight);\n\
\n\
    vec4 currentColor = mix(lightColor, darkColor, b);\n\
    vec4 color = czm_antialias(lightColor, darkColor, currentColor, value, 0.03);\n\
\n\
    color = czm_gammaCorrect(color);\n\
    material.diffuse = color.rgb;\n\
    material.alpha = color.a;\n\
\n\
    return material;\n\
}\n\
";

  //This file is automatically rebuilt by the Cesium build process.
  var DotMaterial = "uniform vec4 lightColor;\n\
uniform vec4 darkColor;\n\
uniform vec2 repeat;\n\
\n\
czm_material czm_getMaterial(czm_materialInput materialInput)\n\
{\n\
    czm_material material = czm_getDefaultMaterial(materialInput);\n\
\n\
    // From Stefan Gustavson's Procedural Textures in GLSL in OpenGL Insights\n\
    float b = smoothstep(0.3, 0.32, length(fract(repeat * materialInput.st) - 0.5));  // 0.0 or 1.0\n\
\n\
    vec4 color = mix(lightColor, darkColor, b);\n\
    color = czm_gammaCorrect(color);\n\
    material.diffuse = color.rgb;\n\
    material.alpha = color.a;\n\
\n\
    return material;\n\
}\n\
";

  //This file is automatically rebuilt by the Cesium build process.
  var ElevationBandMaterial = "uniform sampler2D heights;\n\
uniform sampler2D colors;\n\
\n\
// This material expects heights to be sorted from lowest to highest.\n\
\n\
float getHeight(int idx, float invTexSize)\n\
{\n\
    vec2 uv = vec2((float(idx) + 0.5) * invTexSize, 0.5);\n\
#ifdef OES_texture_float\n\
    return texture2D(heights, uv).x;\n\
#else\n\
    return czm_unpackFloat(texture2D(heights, uv));\n\
#endif\n\
}\n\
\n\
czm_material czm_getMaterial(czm_materialInput materialInput)\n\
{\n\
    czm_material material = czm_getDefaultMaterial(materialInput);\n\
\n\
    float height = materialInput.height;\n\
    float invTexSize = 1.0 / float(heightsDimensions.x);\n\
\n\
    float minHeight = getHeight(0, invTexSize);\n\
    float maxHeight = getHeight(heightsDimensions.x - 1, invTexSize);\n\
\n\
    // early-out when outside the height range\n\
    if (height < minHeight || height > maxHeight) {\n\
        material.diffuse = vec3(0.0);\n\
        material.alpha = 0.0;\n\
        return material;\n\
    }\n\
\n\
    // Binary search to find heights above and below.\n\
    int idxBelow = 0;\n\
    int idxAbove = heightsDimensions.x;\n\
    float heightBelow = minHeight;\n\
    float heightAbove = maxHeight;\n\
\n\
    // while loop not allowed, so use for loop with max iterations.\n\
    // maxIterations of 16 supports a texture size up to 65536 (2^16).\n\
    const int maxIterations = 16;\n\
    for (int i = 0; i < maxIterations; i++) {\n\
        if (idxBelow >= idxAbove - 1) {\n\
            break;\n\
        }\n\
\n\
        int idxMid = (idxBelow + idxAbove) / 2;\n\
        float heightTex = getHeight(idxMid, invTexSize);\n\
\n\
        if (height > heightTex) {\n\
            idxBelow = idxMid;\n\
            heightBelow = heightTex;\n\
        } else {\n\
            idxAbove = idxMid;\n\
            heightAbove = heightTex;\n\
        }\n\
    }\n\
\n\
    float lerper = heightBelow == heightAbove ? 1.0 : (height - heightBelow) / (heightAbove - heightBelow);\n\
    vec2 colorUv = vec2(invTexSize * (float(idxBelow) + 0.5 + lerper), 0.5);\n\
    vec4 color = texture2D(colors, colorUv);\n\
\n\
    // undo preumultiplied alpha\n\
    if (color.a > 0.0) \n\
    {\n\
        color.rgb /= color.a;\n\
    }\n\
    \n\
    color.rgb = czm_gammaCorrect(color.rgb);\n\
\n\
    material.diffuse = color.rgb;\n\
    material.alpha = color.a;\n\
    return material;\n\
}\n\
";

  //This file is automatically rebuilt by the Cesium build process.
  var ElevationContourMaterial = "#ifdef GL_OES_standard_derivatives\n\
    #extension GL_OES_standard_derivatives : enable\n\
#endif\n\
\n\
uniform vec4 color;\n\
uniform float spacing;\n\
uniform float width;\n\
\n\
czm_material czm_getMaterial(czm_materialInput materialInput)\n\
{\n\
    czm_material material = czm_getDefaultMaterial(materialInput);\n\
\n\
    float distanceToContour = mod(materialInput.height, spacing);\n\
\n\
#ifdef GL_OES_standard_derivatives\n\
    float dxc = abs(dFdx(materialInput.height));\n\
    float dyc = abs(dFdy(materialInput.height));\n\
    float dF = max(dxc, dyc) * czm_pixelRatio * width;\n\
    float alpha = (distanceToContour < dF) ? 1.0 : 0.0;\n\
#else\n\
    float alpha = (distanceToContour < (czm_pixelRatio * width)) ? 1.0 : 0.0;\n\
#endif\n\
\n\
    vec4 outColor = czm_gammaCorrect(vec4(color.rgb, alpha * color.a));\n\
    material.diffuse = outColor.rgb;\n\
    material.alpha = outColor.a;\n\
\n\
    return material;\n\
}\n\
";

  //This file is automatically rebuilt by the Cesium build process.
  var ElevationRampMaterial = "uniform sampler2D image;\n\
uniform float minimumHeight;\n\
uniform float maximumHeight;\n\
\n\
czm_material czm_getMaterial(czm_materialInput materialInput)\n\
{\n\
    czm_material material = czm_getDefaultMaterial(materialInput);\n\
    float scaledHeight = clamp((materialInput.height - minimumHeight) / (maximumHeight - minimumHeight), 0.0, 1.0);\n\
    vec4 rampColor = texture2D(image, vec2(scaledHeight, 0.5));\n\
    rampColor = czm_gammaCorrect(rampColor);\n\
    material.diffuse = rampColor.rgb;\n\
    material.alpha = rampColor.a;\n\
    return material;\n\
}\n\
";

  //This file is automatically rebuilt by the Cesium build process.
  var FadeMaterial = "uniform vec4 fadeInColor;\n\
uniform vec4 fadeOutColor;\n\
uniform float maximumDistance;\n\
uniform bool repeat;\n\
uniform vec2 fadeDirection;\n\
uniform vec2 time;\n\
\n\
float getTime(float t, float coord)\n\
{\n\
    float scalar = 1.0 / maximumDistance;\n\
    float q  = distance(t, coord) * scalar;\n\
    if (repeat)\n\
    {\n\
        float r = distance(t, coord + 1.0) * scalar;\n\
        float s = distance(t, coord - 1.0) * scalar;\n\
        q = min(min(r, s), q);\n\
    }\n\
    return clamp(q, 0.0, 1.0);\n\
}\n\
\n\
czm_material czm_getMaterial(czm_materialInput materialInput)\n\
{\n\
    czm_material material = czm_getDefaultMaterial(materialInput);\n\
\n\
    vec2 st = materialInput.st;\n\
    float s = getTime(time.x, st.s) * fadeDirection.s;\n\
    float t = getTime(time.y, st.t) * fadeDirection.t;\n\
\n\
    float u = length(vec2(s, t));\n\
    vec4 color = mix(fadeInColor, fadeOutColor, u);\n\
\n\
    color = czm_gammaCorrect(color);\n\
    material.emission = color.rgb;\n\
    material.alpha = color.a;\n\
\n\
    return material;\n\
}\n\
";

  //This file is automatically rebuilt by the Cesium build process.
  var GridMaterial = "#ifdef GL_OES_standard_derivatives\n\
    #extension GL_OES_standard_derivatives : enable\n\
#endif\n\
\n\
uniform vec4 color;\n\
uniform float cellAlpha;\n\
uniform vec2 lineCount;\n\
uniform vec2 lineThickness;\n\
uniform vec2 lineOffset;\n\
\n\
czm_material czm_getMaterial(czm_materialInput materialInput)\n\
{\n\
    czm_material material = czm_getDefaultMaterial(materialInput);\n\
\n\
    vec2 st = materialInput.st;\n\
\n\
    float scaledWidth = fract(lineCount.s * st.s - lineOffset.s);\n\
    scaledWidth = abs(scaledWidth - floor(scaledWidth + 0.5));\n\
    float scaledHeight = fract(lineCount.t * st.t - lineOffset.t);\n\
    scaledHeight = abs(scaledHeight - floor(scaledHeight + 0.5));\n\
\n\
    float value;\n\
#ifdef GL_OES_standard_derivatives\n\
    // Fuzz Factor - Controls blurriness of lines\n\
    const float fuzz = 1.2;\n\
    vec2 thickness = (lineThickness * czm_pixelRatio) - 1.0;\n\
\n\
    // From \"3D Engine Design for Virtual Globes\" by Cozzi and Ring, Listing 4.13.\n\
    vec2 dx = abs(dFdx(st));\n\
    vec2 dy = abs(dFdy(st));\n\
    vec2 dF = vec2(max(dx.s, dy.s), max(dx.t, dy.t)) * lineCount;\n\
    value = min(\n\
        smoothstep(dF.s * thickness.s, dF.s * (fuzz + thickness.s), scaledWidth),\n\
        smoothstep(dF.t * thickness.t, dF.t * (fuzz + thickness.t), scaledHeight));\n\
#else\n\
    // Fuzz Factor - Controls blurriness of lines\n\
    const float fuzz = 0.05;\n\
\n\
    vec2 range = 0.5 - (lineThickness * 0.05);\n\
    value = min(\n\
        1.0 - smoothstep(range.s, range.s + fuzz, scaledWidth),\n\
        1.0 - smoothstep(range.t, range.t + fuzz, scaledHeight));\n\
#endif\n\
\n\
    // Edges taken from RimLightingMaterial.glsl\n\
    // See http://www.fundza.com/rman_shaders/surface/fake_rim/fake_rim1.html\n\
    float dRim = 1.0 - abs(dot(materialInput.normalEC, normalize(materialInput.positionToEyeEC)));\n\
    float sRim = smoothstep(0.8, 1.0, dRim);\n\
    value *= (1.0 - sRim);\n\
\n\
    vec4 halfColor;\n\
    halfColor.rgb = color.rgb * 0.5;\n\
    halfColor.a = color.a * (1.0 - ((1.0 - cellAlpha) * value));\n\
    halfColor = czm_gammaCorrect(halfColor);\n\
    material.diffuse = halfColor.rgb;\n\
    material.emission = halfColor.rgb;\n\
    material.alpha = halfColor.a;\n\
\n\
    return material;\n\
}\n\
";

  //This file is automatically rebuilt by the Cesium build process.
  var NormalMapMaterial = "uniform sampler2D image;\n\
uniform float strength;\n\
uniform vec2 repeat;\n\
\n\
czm_material czm_getMaterial(czm_materialInput materialInput)\n\
{\n\
    czm_material material = czm_getDefaultMaterial(materialInput);\n\
    \n\
    vec4 textureValue = texture2D(image, fract(repeat * materialInput.st));\n\
    vec3 normalTangentSpace = textureValue.channels;\n\
    normalTangentSpace.xy = normalTangentSpace.xy * 2.0 - 1.0;\n\
    normalTangentSpace.z = clamp(1.0 - strength, 0.1, 1.0);\n\
    normalTangentSpace = normalize(normalTangentSpace);\n\
    vec3 normalEC = materialInput.tangentToEyeMatrix * normalTangentSpace;\n\
    \n\
    material.normal = normalEC;\n\
    \n\
    return material;\n\
}\n\
";

  //This file is automatically rebuilt by the Cesium build process.
  var PolylineArrowMaterial = "#ifdef GL_OES_standard_derivatives\n\
#extension GL_OES_standard_derivatives : enable\n\
#endif\n\
\n\
uniform vec4 color;\n\
\n\
float getPointOnLine(vec2 p0, vec2 p1, float x)\n\
{\n\
    float slope = (p0.y - p1.y) / (p0.x - p1.x);\n\
    return slope * (x - p0.x) + p0.y;\n\
}\n\
\n\
czm_material czm_getMaterial(czm_materialInput materialInput)\n\
{\n\
    czm_material material = czm_getDefaultMaterial(materialInput);\n\
\n\
    vec2 st = materialInput.st;\n\
\n\
#ifdef GL_OES_standard_derivatives\n\
    float base = 1.0 - abs(fwidth(st.s)) * 10.0 * czm_pixelRatio;\n\
#else\n\
    float base = 0.975; // 2.5% of the line will be the arrow head\n\
#endif\n\
\n\
    vec2 center = vec2(1.0, 0.5);\n\
    float ptOnUpperLine = getPointOnLine(vec2(base, 1.0), center, st.s);\n\
    float ptOnLowerLine = getPointOnLine(vec2(base, 0.0), center, st.s);\n\
\n\
    float halfWidth = 0.15;\n\
    float s = step(0.5 - halfWidth, st.t);\n\
    s *= 1.0 - step(0.5 + halfWidth, st.t);\n\
    s *= 1.0 - step(base, st.s);\n\
\n\
    float t = step(base, materialInput.st.s);\n\
    t *= 1.0 - step(ptOnUpperLine, st.t);\n\
    t *= step(ptOnLowerLine, st.t);\n\
\n\
    // Find the distance from the closest separator (region between two colors)\n\
    float dist;\n\
    if (st.s < base)\n\
    {\n\
        float d1 = abs(st.t - (0.5 - halfWidth));\n\
        float d2 = abs(st.t - (0.5 + halfWidth));\n\
        dist = min(d1, d2);\n\
    }\n\
    else\n\
    {\n\
        float d1 = czm_infinity;\n\
        if (st.t < 0.5 - halfWidth && st.t > 0.5 + halfWidth)\n\
        {\n\
            d1 = abs(st.s - base);\n\
        }\n\
        float d2 = abs(st.t - ptOnUpperLine);\n\
        float d3 = abs(st.t - ptOnLowerLine);\n\
        dist = min(min(d1, d2), d3);\n\
    }\n\
\n\
    vec4 outsideColor = vec4(0.0);\n\
    vec4 currentColor = mix(outsideColor, color, clamp(s + t, 0.0, 1.0));\n\
    vec4 outColor = czm_antialias(outsideColor, color, currentColor, dist);\n\
\n\
    outColor = czm_gammaCorrect(outColor);\n\
    material.diffuse = outColor.rgb;\n\
    material.alpha = outColor.a;\n\
    return material;\n\
}\n\
";

  //This file is automatically rebuilt by the Cesium build process.
  var PolylineDashMaterial = "uniform vec4 color;\n\
uniform vec4 gapColor;\n\
uniform float dashLength;\n\
uniform float dashPattern;\n\
varying float v_polylineAngle;\n\
\n\
const float maskLength = 16.0;\n\
\n\
mat2 rotate(float rad) {\n\
    float c = cos(rad);\n\
    float s = sin(rad);\n\
    return mat2(\n\
        c, s,\n\
        -s, c\n\
    );\n\
}\n\
\n\
czm_material czm_getMaterial(czm_materialInput materialInput)\n\
{\n\
    czm_material material = czm_getDefaultMaterial(materialInput);\n\
\n\
    vec2 pos = rotate(v_polylineAngle) * gl_FragCoord.xy;\n\
\n\
    // Get the relative position within the dash from 0 to 1\n\
    float dashPosition = fract(pos.x / (dashLength * czm_pixelRatio));\n\
    // Figure out the mask index.\n\
    float maskIndex = floor(dashPosition * maskLength);\n\
    // Test the bit mask.\n\
    float maskTest = floor(dashPattern / pow(2.0, maskIndex));\n\
    vec4 fragColor = (mod(maskTest, 2.0) < 1.0) ? gapColor : color;\n\
    if (fragColor.a < 0.005) {   // matches 0/255 and 1/255\n\
        discard;\n\
    }\n\
\n\
    fragColor = czm_gammaCorrect(fragColor);\n\
    material.emission = fragColor.rgb;\n\
    material.alpha = fragColor.a;\n\
    return material;\n\
}\n\
";

  //This file is automatically rebuilt by the Cesium build process.
  var PolylineGlowMaterial = "uniform vec4 color;\n\
uniform float glowPower;\n\
uniform float taperPower;\n\
\n\
czm_material czm_getMaterial(czm_materialInput materialInput)\n\
{\n\
    czm_material material = czm_getDefaultMaterial(materialInput);\n\
\n\
    vec2 st = materialInput.st;\n\
    float glow = glowPower / abs(st.t - 0.5) - (glowPower / 0.5);\n\
\n\
    if (taperPower <= 0.99999) {\n\
        glow *= min(1.0, taperPower / (0.5 - st.s * 0.5) - (taperPower / 0.5));\n\
    }\n\
\n\
    vec4 fragColor;\n\
    fragColor.rgb = max(vec3(glow - 1.0 + color.rgb), color.rgb);\n\
    fragColor.a = clamp(0.0, 1.0, glow) * color.a;\n\
    fragColor = czm_gammaCorrect(fragColor);\n\
\n\
    material.emission = fragColor.rgb;\n\
    material.alpha = fragColor.a;\n\
\n\
    return material;\n\
}\n\
";

  //This file is automatically rebuilt by the Cesium build process.
  var PolylineOutlineMaterial = "uniform vec4 color;\n\
uniform vec4 outlineColor;\n\
uniform float outlineWidth;\n\
\n\
varying float v_width;\n\
\n\
czm_material czm_getMaterial(czm_materialInput materialInput)\n\
{\n\
    czm_material material = czm_getDefaultMaterial(materialInput);\n\
\n\
    vec2 st = materialInput.st;\n\
    float halfInteriorWidth =  0.5 * (v_width - outlineWidth) / v_width;\n\
    float b = step(0.5 - halfInteriorWidth, st.t);\n\
    b *= 1.0 - step(0.5 + halfInteriorWidth, st.t);\n\
\n\
    // Find the distance from the closest separator (region between two colors)\n\
    float d1 = abs(st.t - (0.5 - halfInteriorWidth));\n\
    float d2 = abs(st.t - (0.5 + halfInteriorWidth));\n\
    float dist = min(d1, d2);\n\
\n\
    vec4 currentColor = mix(outlineColor, color, b);\n\
    vec4 outColor = czm_antialias(outlineColor, color, currentColor, dist);\n\
    outColor = czm_gammaCorrect(outColor);\n\
\n\
    material.diffuse = outColor.rgb;\n\
    material.alpha = outColor.a;\n\
\n\
    return material;\n\
}\n\
";

  //This file is automatically rebuilt by the Cesium build process.
  var RimLightingMaterial = "uniform vec4 color;\n\
uniform vec4 rimColor;\n\
uniform float width;\n\
\n\
czm_material czm_getMaterial(czm_materialInput materialInput)\n\
{\n\
    czm_material material = czm_getDefaultMaterial(materialInput);\n\
\n\
    // See http://www.fundza.com/rman_shaders/surface/fake_rim/fake_rim1.html\n\
    float d = 1.0 - dot(materialInput.normalEC, normalize(materialInput.positionToEyeEC));\n\
    float s = smoothstep(1.0 - width, 1.0, d);\n\
\n\
    vec4 outColor = czm_gammaCorrect(color);\n\
    vec4 outRimColor = czm_gammaCorrect(rimColor);\n\
\n\
    material.diffuse = outColor.rgb;\n\
    material.emission = outRimColor.rgb * s;\n\
    material.alpha = mix(outColor.a, outRimColor.a, s);\n\
\n\
    return material;\n\
}\n\
";

  //This file is automatically rebuilt by the Cesium build process.
  var SlopeRampMaterial = "uniform sampler2D image;\n\
\n\
czm_material czm_getMaterial(czm_materialInput materialInput)\n\
{\n\
    czm_material material = czm_getDefaultMaterial(materialInput);\n\
    vec4 rampColor = texture2D(image, vec2(materialInput.slope / (czm_pi / 2.0), 0.5));\n\
    rampColor = czm_gammaCorrect(rampColor);\n\
    material.diffuse = rampColor.rgb;\n\
    material.alpha = rampColor.a;\n\
    return material;\n\
}\n\
";

  //This file is automatically rebuilt by the Cesium build process.
  var StripeMaterial = "uniform vec4 evenColor;\n\
uniform vec4 oddColor;\n\
uniform float offset;\n\
uniform float repeat;\n\
uniform bool horizontal;\n\
\n\
czm_material czm_getMaterial(czm_materialInput materialInput)\n\
{\n\
    czm_material material = czm_getDefaultMaterial(materialInput);\n\
\n\
    // Based on the Stripes Fragment Shader in the Orange Book (11.1.2)\n\
    float coord = mix(materialInput.st.s, materialInput.st.t, float(horizontal));\n\
    float value = fract((coord - offset) * (repeat * 0.5));\n\
    float dist = min(value, min(abs(value - 0.5), 1.0 - value));\n\
\n\
    vec4 currentColor = mix(evenColor, oddColor, step(0.5, value));\n\
    vec4 color = czm_antialias(evenColor, oddColor, currentColor, dist);\n\
    color = czm_gammaCorrect(color);\n\
\n\
    material.diffuse = color.rgb;\n\
    material.alpha = color.a;\n\
\n\
    return material;\n\
}\n\
";

  //This file is automatically rebuilt by the Cesium build process.
  var WaterMaterial = "// Thanks for the contribution Jonas\n\
// http://29a.ch/2012/7/19/webgl-terrain-rendering-water-fog\n\
\n\
uniform sampler2D specularMap;\n\
uniform sampler2D normalMap;\n\
uniform vec4 baseWaterColor;\n\
uniform vec4 blendColor;\n\
uniform float frequency;\n\
uniform float animationSpeed;\n\
uniform float amplitude;\n\
uniform float specularIntensity;\n\
uniform float fadeFactor;\n\
\n\
czm_material czm_getMaterial(czm_materialInput materialInput)\n\
{\n\
    czm_material material = czm_getDefaultMaterial(materialInput);\n\
\n\
    float time = czm_frameNumber * animationSpeed;\n\
\n\
    // fade is a function of the distance from the fragment and the frequency of the waves\n\
    float fade = max(1.0, (length(materialInput.positionToEyeEC) / 10000000000.0) * frequency * fadeFactor);\n\
\n\
    float specularMapValue = texture2D(specularMap, materialInput.st).r;\n\
\n\
    // note: not using directional motion at this time, just set the angle to 0.0;\n\
    vec4 noise = czm_getWaterNoise(normalMap, materialInput.st * frequency, time, 0.0);\n\
    vec3 normalTangentSpace = noise.xyz * vec3(1.0, 1.0, (1.0 / amplitude));\n\
\n\
    // fade out the normal perturbation as we move further from the water surface\n\
    normalTangentSpace.xy /= fade;\n\
\n\
    // attempt to fade out the normal perturbation as we approach non water areas (low specular map value)\n\
    normalTangentSpace = mix(vec3(0.0, 0.0, 50.0), normalTangentSpace, specularMapValue);\n\
\n\
    normalTangentSpace = normalize(normalTangentSpace);\n\
\n\
    // get ratios for alignment of the new normal vector with a vector perpendicular to the tangent plane\n\
    float tsPerturbationRatio = clamp(dot(normalTangentSpace, vec3(0.0, 0.0, 1.0)), 0.0, 1.0);\n\
\n\
    // fade out water effect as specular map value decreases\n\
    material.alpha = mix(blendColor.a, baseWaterColor.a, specularMapValue) * specularMapValue;\n\
\n\
    // base color is a blend of the water and non-water color based on the value from the specular map\n\
    // may need a uniform blend factor to better control this\n\
    material.diffuse = mix(blendColor.rgb, baseWaterColor.rgb, specularMapValue);\n\
\n\
    // diffuse highlights are based on how perturbed the normal is\n\
    material.diffuse += (0.1 * tsPerturbationRatio);\n\
\n\
    material.diffuse = material.diffuse;\n\
\n\
    material.normal = normalize(materialInput.tangentToEyeMatrix * normalTangentSpace);\n\
\n\
    material.specular = specularIntensity;\n\
    material.shininess = 10.0;\n\
\n\
    return material;\n\
}\n\
";

  //This file is automatically rebuilt by the Cesium build process.
  var WaJueMaterial = "czm_material czm_getMaterial(czm_materialInput materialInput)\n\
{\n\
    czm_material material = czm_getDefaultMaterial(materialInput);\n\
    return material;\n\
}";

  //This file is automatically rebuilt by the Cesium build process.
  var YanMoMaterial = "uniform vec4 floodVar;//（基础淹没高度，当前淹没高度，最大淹没高度,默认高度差(最大淹没高度 - 基础淹没高度)）\n\
czm_material czm_getMaterial(czm_materialInput materialInput)\n\
{\n\
    czm_material material = czm_getDefaultMaterial(materialInput);\n\
    material.alpha = (materialInput.height < floodVar.y) ? 0.3 : 0.0;\n\
    float rr = (materialInput.height < floodVar.y)?(materialInput.height-floodVar.x)/floodVar.w/2.0:0.0;\n\
    material.diffuse = vec3(1.0-rr,rr,0.0);\n\
    return material;\n\
}";

  /**
   * A Material defines surface appearance through a combination of diffuse, specular,
   * normal, emission, and alpha components. These values are specified using a
   * JSON schema called Fabric which gets parsed and assembled into glsl shader code
   * behind-the-scenes. Check out the {@link https://github.com/CesiumGS/cesium/wiki/Fabric|wiki page}
   * for more details on Fabric.
   * <br /><br />
   * <style type="text/css">
   *  #materialDescriptions code {
   *      font-weight: normal;
   *      font-family: Consolas, 'Lucida Console', Monaco, monospace;
   *      color: #A35A00;
   *  }
   *  #materialDescriptions ul, #materialDescriptions ul ul {
   *      list-style-type: none;
   *  }
   *  #materialDescriptions ul ul {
   *      margin-bottom: 10px;
   *  }
   *  #materialDescriptions ul ul li {
   *      font-weight: normal;
   *      color: #000000;
   *      text-indent: -2em;
   *      margin-left: 2em;
   *  }
   *  #materialDescriptions ul li {
   *      font-weight: bold;
   *      color: #0053CF;
   *  }
   * </style>
   *
   * Base material types and their uniforms:
   * <div id='materialDescriptions'>
   * <ul>
   *  <li>Color</li>
   *  <ul>
   *      <li><code>color</code>:  rgba color object.</li>
   *  </ul>
   *  <li>Image</li>
   *  <ul>
   *      <li><code>image</code>:  path to image.</li>
   *      <li><code>repeat</code>:  Object with x and y values specifying the number of times to repeat the image.</li>
   *  </ul>
   *  <li>DiffuseMap</li>
   *  <ul>
   *      <li><code>image</code>:  path to image.</li>
   *      <li><code>channels</code>:  Three character string containing any combination of r, g, b, and a for selecting the desired image channels.</li>
   *      <li><code>repeat</code>:  Object with x and y values specifying the number of times to repeat the image.</li>
   *  </ul>
   *  <li>AlphaMap</li>
   *  <ul>
   *      <li><code>image</code>:  path to image.</li>
   *      <li><code>channel</code>:  One character string containing r, g, b, or a for selecting the desired image channel. </li>
   *      <li><code>repeat</code>:  Object with x and y values specifying the number of times to repeat the image.</li>
   *  </ul>
   *  <li>SpecularMap</li>
   *  <ul>
   *      <li><code>image</code>: path to image.</li>
   *      <li><code>channel</code>: One character string containing r, g, b, or a for selecting the desired image channel. </li>
   *      <li><code>repeat</code>: Object with x and y values specifying the number of times to repeat the image.</li>
   *  </ul>
   *  <li>EmissionMap</li>
   *  <ul>
   *      <li><code>image</code>:  path to image.</li>
   *      <li><code>channels</code>:  Three character string containing any combination of r, g, b, and a for selecting the desired image channels. </li>
   *      <li><code>repeat</code>:  Object with x and y values specifying the number of times to repeat the image.</li>
   *  </ul>
   *  <li>BumpMap</li>
   *  <ul>
   *      <li><code>image</code>:  path to image.</li>
   *      <li><code>channel</code>:  One character string containing r, g, b, or a for selecting the desired image channel. </li>
   *      <li><code>repeat</code>:  Object with x and y values specifying the number of times to repeat the image.</li>
   *      <li><code>strength</code>:  Bump strength value between 0.0 and 1.0 where 0.0 is small bumps and 1.0 is large bumps.</li>
   *  </ul>
   *  <li>NormalMap</li>
   *  <ul>
   *      <li><code>image</code>:  path to image.</li>
   *      <li><code>channels</code>:  Three character string containing any combination of r, g, b, and a for selecting the desired image channels. </li>
   *      <li><code>repeat</code>:  Object with x and y values specifying the number of times to repeat the image.</li>
   *      <li><code>strength</code>:  Bump strength value between 0.0 and 1.0 where 0.0 is small bumps and 1.0 is large bumps.</li>
   *  </ul>
   *  <li>Grid</li>
   *  <ul>
   *      <li><code>color</code>:  rgba color object for the whole material.</li>
   *      <li><code>cellAlpha</code>: Alpha value for the cells between grid lines.  This will be combined with color.alpha.</li>
   *      <li><code>lineCount</code>:  Object with x and y values specifying the number of columns and rows respectively.</li>
   *      <li><code>lineThickness</code>:  Object with x and y values specifying the thickness of grid lines (in pixels where available).</li>
   *      <li><code>lineOffset</code>:  Object with x and y values specifying the offset of grid lines (range is 0 to 1).</li>
   *  </ul>
   *  <li>Stripe</li>
   *  <ul>
   *      <li><code>horizontal</code>:  Boolean that determines if the stripes are horizontal or vertical.</li>
   *      <li><code>evenColor</code>:  rgba color object for the stripe's first color.</li>
   *      <li><code>oddColor</code>:  rgba color object for the stripe's second color.</li>
   *      <li><code>offset</code>:  Number that controls at which point into the pattern to begin drawing; with 0.0 being the beginning of the even color, 1.0 the beginning of the odd color, 2.0 being the even color again, and any multiple or fractional values being in between.</li>
   *      <li><code>repeat</code>:  Number that controls the total number of stripes, half light and half dark.</li>
   *  </ul>
   *  <li>Checkerboard</li>
   *  <ul>
   *      <li><code>lightColor</code>:  rgba color object for the checkerboard's light alternating color.</li>
   *      <li><code>darkColor</code>: rgba color object for the checkerboard's dark alternating color.</li>
   *      <li><code>repeat</code>:  Object with x and y values specifying the number of columns and rows respectively.</li>
   *  </ul>
   *  <li>Dot</li>
   *  <ul>
   *      <li><code>lightColor</code>:  rgba color object for the dot color.</li>
   *      <li><code>darkColor</code>:  rgba color object for the background color.</li>
   *      <li><code>repeat</code>:  Object with x and y values specifying the number of columns and rows of dots respectively.</li>
   *  </ul>
   *  <li>Water</li>
   *  <ul>
   *      <li><code>baseWaterColor</code>:  rgba color object base color of the water.</li>
   *      <li><code>blendColor</code>:  rgba color object used when blending from water to non-water areas.</li>
   *      <li><code>specularMap</code>:  Single channel texture used to indicate areas of water.</li>
   *      <li><code>normalMap</code>:  Normal map for water normal perturbation.</li>
   *      <li><code>frequency</code>:  Number that controls the number of waves.</li>
   *      <li><code>animationSpeed</code>:  Number that controls the animations speed of the water.</li>
   *      <li><code>amplitude</code>:  Number that controls the amplitude of water waves.</li>
   *      <li><code>specularIntensity</code>:  Number that controls the intensity of specular reflections.</li>
   *  </ul>
   *  <li>RimLighting</li>
   *  <ul>
   *      <li><code>color</code>:  diffuse color and alpha.</li>
   *      <li><code>rimColor</code>:  diffuse color and alpha of the rim.</li>
   *      <li><code>width</code>:  Number that determines the rim's width.</li>
   *  </ul>
   *  <li>Fade</li>
   *  <ul>
   *      <li><code>fadeInColor</code>: diffuse color and alpha at <code>time</code></li>
   *      <li><code>fadeOutColor</code>: diffuse color and alpha at <code>maximumDistance</code> from <code>time</code></li>
   *      <li><code>maximumDistance</code>: Number between 0.0 and 1.0 where the <code>fadeInColor</code> becomes the <code>fadeOutColor</code>. A value of 0.0 gives the entire material a color of <code>fadeOutColor</code> and a value of 1.0 gives the the entire material a color of <code>fadeInColor</code></li>
   *      <li><code>repeat</code>: true if the fade should wrap around the texture coodinates.</li>
   *      <li><code>fadeDirection</code>: Object with x and y values specifying if the fade should be in the x and y directions.</li>
   *      <li><code>time</code>: Object with x and y values between 0.0 and 1.0 of the <code>fadeInColor</code> position</li>
   *  </ul>
   *  <li>PolylineArrow</li>
   *  <ul>
   *      <li><code>color</code>: diffuse color and alpha.</li>
   *  </ul>
   *  <li>PolylineDash</li>
   *  <ul>
   *      <li><code>color</code>: color for the line.</li>
   *      <li><code>gapColor</code>: color for the gaps in the line.</li>
   *      <li><code>dashLength</code>: Dash length in pixels.</li>
   *      <li><code>dashPattern</code>: The 16 bit stipple pattern for the line..</li>
   *  </ul>
   *  <li>PolylineGlow</li>
   *  <ul>
   *      <li><code>color</code>: color and maximum alpha for the glow on the line.</li>
   *      <li><code>glowPower</code>: strength of the glow, as a percentage of the total line width (less than 1.0).</li>
   *      <li><code>taperPower</code>: strength of the tapering effect, as a percentage of the total line length.  If 1.0 or higher, no taper effect is used.</li>
   *  </ul>
   *  <li>PolylineOutline</li>
   *  <ul>
   *      <li><code>color</code>: diffuse color and alpha for the interior of the line.</li>
   *      <li><code>outlineColor</code>: diffuse color and alpha for the outline.</li>
   *      <li><code>outlineWidth</code>: width of the outline in pixels.</li>
   *  </ul>
   *  <li>ElevationContour</li>
   *  <ul>
   *      <li><code>color</code>: color and alpha for the contour line.</li>
   *      <li><code>spacing</code>: spacing for contour lines in meters.</li>
   *      <li><code>width</code>: Number specifying the width of the grid lines in pixels.</li>
   *  </ul>
   *  <li>ElevationRamp</li>
   *  <ul>
   *      <li><code>image</code>: color ramp image to use for coloring the terrain.</li>
   *      <li><code>minimumHeight</code>: minimum height for the ramp.</li>
   *      <li><code>maximumHeight</code>: maximum height for the ramp.</li>
   *  </ul>
   *  <li>SlopeRamp</li>
   *  <ul>
   *      <li><code>image</code>: color ramp image to use for coloring the terrain by slope.</li>
   *  </ul>
   *  <li>AspectRamp</li>
   *  <ul>
   *      <li><code>image</code>: color ramp image to use for color the terrain by aspect.</li>
   *  </ul>
   *  <li>ElevationBand</li>
   *  <ul>
   *      <li><code>heights</code>: image of heights sorted from lowest to highest.</li>
   *      <li><code>colors</code>: image of colors at the corresponding heights.</li>
   * </ul>
   * </ul>
   * </ul>
   * </div>
   *
   * @alias Material
   *
   * @param {Object} [options] Object with the following properties:
   * @param {Boolean} [options.strict=false] Throws errors for issues that would normally be ignored, including unused uniforms or materials.
   * @param {Boolean|Function} [options.translucent=true] When <code>true</code> or a function that returns <code>true</code>, the geometry
   *                           with this material is expected to appear translucent.
   * @param {TextureMinificationFilter} [options.minificationFilter=TextureMinificationFilter.LINEAR] The {@link TextureMinificationFilter} to apply to this material's textures.
   * @param {TextureMagnificationFilter} [options.magnificationFilter=TextureMagnificationFilter.LINEAR] The {@link TextureMagnificationFilter} to apply to this material's textures.
   * @param {Object} options.fabric The fabric JSON used to generate the material.
   *
   * @constructor
   *
   * @exception {DeveloperError} fabric: uniform has invalid type.
   * @exception {DeveloperError} fabric: uniforms and materials cannot share the same property.
   * @exception {DeveloperError} fabric: cannot have source and components in the same section.
   * @exception {DeveloperError} fabric: property name is not valid. It should be 'type', 'materials', 'uniforms', 'components', or 'source'.
   * @exception {DeveloperError} fabric: property name is not valid. It should be 'diffuse', 'specular', 'shininess', 'normal', 'emission', or 'alpha'.
   * @exception {DeveloperError} strict: shader source does not use string.
   * @exception {DeveloperError} strict: shader source does not use uniform.
   * @exception {DeveloperError} strict: shader source does not use material.
   *
   * @see {@link https://github.com/CesiumGS/cesium/wiki/Fabric|Fabric wiki page} for a more detailed options of Fabric.
   *
   * @demo {@link https://sandcastle.cesium.com/index.html?src=Materials.html|Cesium Sandcastle Materials Demo}
   *
   * @example
   * // Create a color material with fromType:
   * polygon.material = Cesium.Material.fromType('Color');
   * polygon.material.uniforms.color = new Cesium.Color(1.0, 1.0, 0.0, 1.0);
   *
   * // Create the default material:
   * polygon.material = new Cesium.Material();
   *
   * // Create a color material with full Fabric notation:
   * polygon.material = new Cesium.Material({
   *     fabric : {
   *         type : 'Color',
   *         uniforms : {
   *             color : new Cesium.Color(1.0, 1.0, 0.0, 1.0)
   *         }
   *     }
   * });
   */
  function Material(options) {
    /**
     * The material type. Can be an existing type or a new type. If no type is specified in fabric, type is a GUID.
     * @type {String}
     * @default undefined
     */
    this.type = undefined;

    /**
     * The glsl shader source for this material.
     * @type {String}
     * @default undefined
     */
    this.shaderSource = undefined;

    /**
     * Maps sub-material names to Material objects.
     * @type {Object}
     * @default undefined
     */
    this.materials = undefined;

    /**
     * Maps uniform names to their values.
     * @type {Object}
     * @default undefined
     */
    this.uniforms = undefined;
    this._uniforms = undefined;

    /**
     * When <code>true</code> or a function that returns <code>true</code>,
     * the geometry is expected to appear translucent.
     * @type {Boolean|Function}
     * @default undefined
     */
    this.translucent = undefined;

    this._minificationFilter = defined.defaultValue(
      options.minificationFilter,
      TextureMinificationFilter$1.LINEAR
    );
    this._magnificationFilter = defined.defaultValue(
      options.magnificationFilter,
      TextureMagnificationFilter$1.LINEAR
    );

    this._strict = undefined;
    this._template = undefined;
    this._count = undefined;

    this._texturePaths = {};
    this._loadedImages = [];
    this._loadedCubeMaps = [];

    this._textures = {};

    this._updateFunctions = [];

    this._defaultTexture = undefined;

    initializeMaterial(options, this);
    Object.defineProperties(this, {
      type: {
        value: this.type,
        writable: false,
      },
    });

    if (!defined.defined(Material._uniformList[this.type])) {
      Material._uniformList[this.type] = Object.keys(this._uniforms);
    }
  }

  // Cached list of combined uniform names indexed by type.
  // Used to get the list of uniforms in the same order.
  Material._uniformList = {};

  /**
   * Creates a new material using an existing material type.
   * <br /><br />
   * Shorthand for: new Material({fabric : {type : type}});
   *
   * @param {String} type The base material type.
   * @param {Object} [uniforms] Overrides for the default uniforms.
   * @returns {Material} New material object.
   *
   * @exception {DeveloperError} material with that type does not exist.
   *
   * @example
   * const material = Cesium.Material.fromType('Color', {
   *     color : new Cesium.Color(1.0, 0.0, 0.0, 1.0)
   * });
   */
  Material.fromType = function (type, uniforms) {
    //>>includeStart('debug', pragmas.debug);
    if (!defined.defined(Material._materialCache.getMaterial(type))) {
      throw new Check.DeveloperError(`material with type '${type}' does not exist.`);
    }
    //>>includeEnd('debug');

    const material = new Material({
      fabric: {
        type: type,
      },
    });

    if (defined.defined(uniforms)) {
      for (const name in uniforms) {
        if (uniforms.hasOwnProperty(name)) {
          material.uniforms[name] = uniforms[name];
        }
      }
    }

    return material;
  };

  /**
   * Gets whether or not this material is translucent.
   * @returns {Boolean} <code>true</code> if this material is translucent, <code>false</code> otherwise.
   */
  Material.prototype.isTranslucent = function () {
    if (defined.defined(this.translucent)) {
      if (typeof this.translucent === "function") {
        return this.translucent();
      }

      return this.translucent;
    }

    let translucent = true;
    const funcs = this._translucentFunctions;
    const length = funcs.length;
    for (let i = 0; i < length; ++i) {
      const func = funcs[i];
      if (typeof func === "function") {
        translucent = translucent && func();
      } else {
        translucent = translucent && func;
      }

      if (!translucent) {
        break;
      }
    }
    return translucent;
  };

  /**
   * @private
   */
  Material.prototype.update = function (context) {
    this._defaultTexture = context.defaultTexture;

    let i;
    let uniformId;

    const loadedImages = this._loadedImages;
    let length = loadedImages.length;
    for (i = 0; i < length; ++i) {
      const loadedImage = loadedImages[i];
      uniformId = loadedImage.id;
      let image = loadedImage.image;

      // Images transcoded from KTX2 can contain multiple mip levels:
      // https://github.khronos.org/KTX-Specification/#_mip_level_array
      let mipLevels;
      if (Array.isArray(image)) {
        // highest detail mip should be level 0
        mipLevels = image.slice(1, image.length).map(function (mipLevel) {
          return mipLevel.bufferView;
        });
        image = image[0];
      }

      const sampler = new Sampler({
        minificationFilter: this._minificationFilter,
        magnificationFilter: this._magnificationFilter,
      });

      let texture;
      if (defined.defined(image.internalFormat)) {
        texture = new Texture({
          context: context,
          pixelFormat: image.internalFormat,
          width: image.width,
          height: image.height,
          source: {
            arrayBufferView: image.bufferView,
            mipLevels: mipLevels,
          },
          sampler: sampler,
        });
      } else {
        texture = new Texture({
          context: context,
          source: image,
          sampler: sampler,
        });
      }

      // The material destroys its old texture only after the new one has been loaded.
      // This will ensure a smooth swap of textures and prevent the default texture
      // from appearing for a few frames.
      const oldTexture = this._textures[uniformId];
      if (defined.defined(oldTexture) && oldTexture !== this._defaultTexture) {
        oldTexture.destroy();
      }

      this._textures[uniformId] = texture;

      const uniformDimensionsName = `${uniformId}Dimensions`;
      if (this.uniforms.hasOwnProperty(uniformDimensionsName)) {
        const uniformDimensions = this.uniforms[uniformDimensionsName];
        uniformDimensions.x = texture._width;
        uniformDimensions.y = texture._height;
      }
    }

    loadedImages.length = 0;

    const loadedCubeMaps = this._loadedCubeMaps;
    length = loadedCubeMaps.length;

    for (i = 0; i < length; ++i) {
      const loadedCubeMap = loadedCubeMaps[i];
      uniformId = loadedCubeMap.id;
      const images = loadedCubeMap.images;

      const cubeMap = new CubeMap({
        context: context,
        source: {
          positiveX: images[0],
          negativeX: images[1],
          positiveY: images[2],
          negativeY: images[3],
          positiveZ: images[4],
          negativeZ: images[5],
        },
        sampler: new Sampler({
          minificationFilter: this._minificationFilter,
          magnificationFilter: this._magnificationFilter,
        }),
      });

      this._textures[uniformId] = cubeMap;
    }

    loadedCubeMaps.length = 0;

    const updateFunctions = this._updateFunctions;
    length = updateFunctions.length;
    for (i = 0; i < length; ++i) {
      updateFunctions[i](this, context);
    }

    const subMaterials = this.materials;
    for (const name in subMaterials) {
      if (subMaterials.hasOwnProperty(name)) {
        subMaterials[name].update(context);
      }
    }
  };

  /**
   * Returns true if this object was destroyed; otherwise, false.
   * <br /><br />
   * If this object was destroyed, it should not be used; calling any function other than
   * <code>isDestroyed</code> will result in a {@link DeveloperError} exception.
   *
   * @returns {Boolean} True if this object was destroyed; otherwise, false.
   *
   * @see Material#destroy
   */
  Material.prototype.isDestroyed = function () {
    return false;
  };

  /**
   * Destroys the WebGL resources held by this object.  Destroying an object allows for deterministic
   * release of WebGL resources, instead of relying on the garbage collector to destroy this object.
   * <br /><br />
   * Once an object is destroyed, it should not be used; calling any function other than
   * <code>isDestroyed</code> will result in a {@link DeveloperError} exception.  Therefore,
   * assign the return value (<code>undefined</code>) to the object as done in the example.
   *
   * @exception {DeveloperError} This object was destroyed, i.e., destroy() was called.
   *
   *
   * @example
   * material = material && material.destroy();
   *
   * @see Material#isDestroyed
   */
  Material.prototype.destroy = function () {
    const textures = this._textures;
    for (const texture in textures) {
      if (textures.hasOwnProperty(texture)) {
        const instance = textures[texture];
        if (instance !== this._defaultTexture) {
          instance.destroy();
        }
      }
    }

    const materials = this.materials;
    for (const material in materials) {
      if (materials.hasOwnProperty(material)) {
        materials[material].destroy();
      }
    }
    return destroyObject(this);
  };

  function initializeMaterial(options, result) {
    options = defined.defaultValue(options, defined.defaultValue.EMPTY_OBJECT);
    result._strict = defined.defaultValue(options.strict, false);
    result._count = defined.defaultValue(options.count, 0);
    result._template = Resource.clone(
      defined.defaultValue(options.fabric, defined.defaultValue.EMPTY_OBJECT)
    );
    result._template.uniforms = Resource.clone(
      defined.defaultValue(result._template.uniforms, defined.defaultValue.EMPTY_OBJECT)
    );
    result._template.materials = Resource.clone(
      defined.defaultValue(result._template.materials, defined.defaultValue.EMPTY_OBJECT)
    );

    result.type = defined.defined(result._template.type)
      ? result._template.type
      : createGuid();

    result.shaderSource = "";
    result.materials = {};
    result.uniforms = {};
    result._uniforms = {};
    result._translucentFunctions = [];

    let translucent;

    // If the cache contains this material type, build the material template off of the stored template.
    const cachedMaterial = Material._materialCache.getMaterial(result.type);
    if (defined.defined(cachedMaterial)) {
      const template = Resource.clone(cachedMaterial.fabric, true);
      result._template = combine.combine(result._template, template, true);
      translucent = cachedMaterial.translucent;
    }

    // Make sure the template has no obvious errors. More error checking happens later.
    checkForTemplateErrors(result);

    // If the material has a new type, add it to the cache.
    if (!defined.defined(cachedMaterial)) {
      Material._materialCache.addMaterial(result.type, result);
    }

    createMethodDefinition(result);
    createUniforms(result);
    createSubMaterials(result);

    const defaultTranslucent =
      result._translucentFunctions.length === 0 ? true : undefined;
    translucent = defined.defaultValue(translucent, defaultTranslucent);
    translucent = defined.defaultValue(options.translucent, translucent);

    if (defined.defined(translucent)) {
      if (typeof translucent === "function") {
        const wrappedTranslucent = function () {
          return translucent(result);
        };
        result._translucentFunctions.push(wrappedTranslucent);
      } else {
        result._translucentFunctions.push(translucent);
      }
    }
  }

  function checkForValidProperties(object, properties, result, throwNotFound) {
    if (defined.defined(object)) {
      for (const property in object) {
        if (object.hasOwnProperty(property)) {
          const hasProperty = properties.indexOf(property) !== -1;
          if (
            (throwNotFound && !hasProperty) ||
            (!throwNotFound && hasProperty)
          ) {
            result(property, properties);
          }
        }
      }
    }
  }

  function invalidNameError(property, properties) {
    //>>includeStart('debug', pragmas.debug);
    let errorString = `fabric: property name '${property}' is not valid. It should be `;
    for (let i = 0; i < properties.length; i++) {
      const propertyName = `'${properties[i]}'`;
      errorString +=
        i === properties.length - 1 ? `or ${propertyName}.` : `${propertyName}, `;
    }
    throw new Check.DeveloperError(errorString);
    //>>includeEnd('debug');
  }

  function duplicateNameError(property, properties) {
    //>>includeStart('debug', pragmas.debug);
    const errorString = `fabric: uniforms and materials cannot share the same property '${property}'`;
    throw new Check.DeveloperError(errorString);
    //>>includeEnd('debug');
  }

  const templateProperties = [
    "type",
    "materials",
    "uniforms",
    "components",
    "source",
  ];
  const componentProperties = [
    "diffuse",
    "specular",
    "shininess",
    "normal",
    "emission",
    "alpha",
  ];

  function checkForTemplateErrors(material) {
    const template = material._template;
    const uniforms = template.uniforms;
    const materials = template.materials;
    const components = template.components;

    // Make sure source and components do not exist in the same template.
    //>>includeStart('debug', pragmas.debug);
    if (defined.defined(components) && defined.defined(template.source)) {
      throw new Check.DeveloperError(
        "fabric: cannot have source and components in the same template."
      );
    }
    //>>includeEnd('debug');

    // Make sure all template and components properties are valid.
    checkForValidProperties(template, templateProperties, invalidNameError, true);
    checkForValidProperties(
      components,
      componentProperties,
      invalidNameError,
      true
    );

    // Make sure uniforms and materials do not share any of the same names.
    const materialNames = [];
    for (const property in materials) {
      if (materials.hasOwnProperty(property)) {
        materialNames.push(property);
      }
    }
    checkForValidProperties(uniforms, materialNames, duplicateNameError, false);
  }

  function isMaterialFused(shaderComponent, material) {
    const materials = material._template.materials;
    for (const subMaterialId in materials) {
      if (materials.hasOwnProperty(subMaterialId)) {
        if (shaderComponent.indexOf(subMaterialId) > -1) {
          return true;
        }
      }
    }

    return false;
  }

  // Create the czm_getMaterial method body using source or components.
  function createMethodDefinition(material) {
    const components = material._template.components;
    const source = material._template.source;
    if (defined.defined(source)) {
      material.shaderSource += `${source}\n`;
    } else {
      material.shaderSource +=
        "czm_material czm_getMaterial(czm_materialInput materialInput)\n{\n";
      material.shaderSource +=
        "czm_material material = czm_getDefaultMaterial(materialInput);\n";
      if (defined.defined(components)) {
        const isMultiMaterial =
          Object.keys(material._template.materials).length > 0;
        for (const component in components) {
          if (components.hasOwnProperty(component)) {
            if (component === "diffuse" || component === "emission") {
              const isFusion =
                isMultiMaterial &&
                isMaterialFused(components[component], material);
              const componentSource = isFusion
                ? components[component]
                : `czm_gammaCorrect(${components[component]})`;
              material.shaderSource += `material.${component} = ${componentSource}; \n`;
            } else if (component === "alpha") {
              material.shaderSource += `material.alpha = ${components.alpha}; \n`;
            } else {
              material.shaderSource += `material.${component} = ${components[component]};\n`;
            }
          }
        }
      }
      material.shaderSource += "return material;\n}\n";
    }
  }

  const matrixMap = {
    mat2: Matrix2.Matrix2,
    mat3: Matrix2.Matrix3,
    mat4: Matrix2.Matrix4,
  };

  const ktx2Regex = /\.ktx2$/i;

  function createTexture2DUpdateFunction(uniformId) {
    let oldUniformValue;
    return function (material, context) {
      const uniforms = material.uniforms;
      const uniformValue = uniforms[uniformId];
      const uniformChanged = oldUniformValue !== uniformValue;
      const uniformValueIsDefaultImage =
        !defined.defined(uniformValue) || uniformValue === Material.DefaultImageId;
      oldUniformValue = uniformValue;

      let texture = material._textures[uniformId];
      let uniformDimensionsName;
      let uniformDimensions;

      if (uniformValue instanceof HTMLVideoElement) {
        // HTMLVideoElement.readyState >=2 means we have enough data for the current frame.
        // See: https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/readyState
        if (uniformValue.readyState >= 2) {
          if (uniformChanged && defined.defined(texture)) {
            if (texture !== context.defaultTexture) {
              texture.destroy();
            }
            texture = undefined;
          }

          if (!defined.defined(texture) || texture === context.defaultTexture) {
            const sampler = new Sampler({
              minificationFilter: material._minificationFilter,
              magnificationFilter: material._magnificationFilter,
            });
            texture = new Texture({
              context: context,
              source: uniformValue,
              sampler: sampler,
            });
            material._textures[uniformId] = texture;
            return;
          }

          texture.copyFrom({
            source: uniformValue,
          });
        } else if (!defined.defined(texture)) {
          material._textures[uniformId] = context.defaultTexture;
        }
        return;
      }

      if (uniformValue instanceof Texture && uniformValue !== texture) {
        material._texturePaths[uniformId] = undefined;
        const tmp = material._textures[uniformId];
        if (defined.defined(tmp) && tmp !== material._defaultTexture) {
          tmp.destroy();
        }
        material._textures[uniformId] = uniformValue;

        uniformDimensionsName = `${uniformId}Dimensions`;
        if (uniforms.hasOwnProperty(uniformDimensionsName)) {
          uniformDimensions = uniforms[uniformDimensionsName];
          uniformDimensions.x = uniformValue._width;
          uniformDimensions.y = uniformValue._height;
        }

        return;
      }

      if (uniformChanged && defined.defined(texture) && uniformValueIsDefaultImage) {
        // If the newly-assigned texture is the default texture,
        // we don't need to wait for a new image to load before destroying
        // the old texture.
        if (texture !== material._defaultTexture) {
          texture.destroy();
        }
        texture = undefined;
      }

      if (!defined.defined(texture)) {
        material._texturePaths[uniformId] = undefined;
        texture = material._textures[uniformId] = material._defaultTexture;

        uniformDimensionsName = `${uniformId}Dimensions`;
        if (uniforms.hasOwnProperty(uniformDimensionsName)) {
          uniformDimensions = uniforms[uniformDimensionsName];
          uniformDimensions.x = texture._width;
          uniformDimensions.y = texture._height;
        }
      }

      if (uniformValueIsDefaultImage) {
        return;
      }

      // When using the entity layer, the Resource objects get recreated on getValue because
      //  they are clonable. That's why we check the url property for Resources
      //  because the instances aren't the same and we keep trying to load the same
      //  image if it fails to load.
      const isResource = uniformValue instanceof Resource.Resource;
      if (
        !defined.defined(material._texturePaths[uniformId]) ||
        (isResource &&
          uniformValue.url !== material._texturePaths[uniformId].url) ||
        (!isResource && uniformValue !== material._texturePaths[uniformId])
      ) {
        if (typeof uniformValue === "string" || isResource) {
          const resource = isResource
            ? uniformValue
            : Resource.Resource.createIfNeeded(uniformValue);

          let promise;
          if (ktx2Regex.test(resource.url)) {
            promise = loadKTX2(resource.url);
          } else {
            promise = resource.fetchImage();
          }

          Promise.resolve(promise)
            .then(function (image) {
              material._loadedImages.push({
                id: uniformId,
                image: image,
              });
            })
            .catch(function () {
              if (defined.defined(texture) && texture !== material._defaultTexture) {
                texture.destroy();
              }
              material._textures[uniformId] = material._defaultTexture;
            });
        } else if (
          uniformValue instanceof HTMLCanvasElement ||
          uniformValue instanceof HTMLImageElement
        ) {
          material._loadedImages.push({
            id: uniformId,
            image: uniformValue,
          });
        }

        material._texturePaths[uniformId] = uniformValue;
      }
    };
  }

  function createCubeMapUpdateFunction(uniformId) {
    return function (material, context) {
      const uniformValue = material.uniforms[uniformId];

      if (uniformValue instanceof CubeMap) {
        const tmp = material._textures[uniformId];
        if (tmp !== material._defaultTexture) {
          tmp.destroy();
        }
        material._texturePaths[uniformId] = undefined;
        material._textures[uniformId] = uniformValue;
        return;
      }

      if (!defined.defined(material._textures[uniformId])) {
        material._texturePaths[uniformId] = undefined;
        material._textures[uniformId] = context.defaultCubeMap;
      }

      if (uniformValue === Material.DefaultCubeMapId) {
        return;
      }

      const path =
        uniformValue.positiveX +
        uniformValue.negativeX +
        uniformValue.positiveY +
        uniformValue.negativeY +
        uniformValue.positiveZ +
        uniformValue.negativeZ;

      if (path !== material._texturePaths[uniformId]) {
        const promises = [
          Resource.Resource.createIfNeeded(uniformValue.positiveX).fetchImage(),
          Resource.Resource.createIfNeeded(uniformValue.negativeX).fetchImage(),
          Resource.Resource.createIfNeeded(uniformValue.positiveY).fetchImage(),
          Resource.Resource.createIfNeeded(uniformValue.negativeY).fetchImage(),
          Resource.Resource.createIfNeeded(uniformValue.positiveZ).fetchImage(),
          Resource.Resource.createIfNeeded(uniformValue.negativeZ).fetchImage(),
        ];

        Promise.all(promises).then(function (images) {
          material._loadedCubeMaps.push({
            id: uniformId,
            images: images,
          });
        });

        material._texturePaths[uniformId] = path;
      }
    };
  }

  function createUniforms(material) {
    const uniforms = material._template.uniforms;
    for (const uniformId in uniforms) {
      if (uniforms.hasOwnProperty(uniformId)) {
        createUniform(material, uniformId);
      }
    }
  }

  // Writes uniform declarations to the shader file and connects uniform values with
  // corresponding material properties through the returnUniforms function.
  function createUniform(material, uniformId) {
    const strict = material._strict;
    const materialUniforms = material._template.uniforms;
    const uniformValue = materialUniforms[uniformId];
    const uniformType = getUniformType(uniformValue);

    //>>includeStart('debug', pragmas.debug);
    if (!defined.defined(uniformType)) {
      throw new Check.DeveloperError(
        `fabric: uniform '${uniformId}' has invalid type.`
      );
    }
    //>>includeEnd('debug');

    let replacedTokenCount;
    if (uniformType === "channels") {
      replacedTokenCount = replaceToken(material, uniformId, uniformValue, false);
      //>>includeStart('debug', pragmas.debug);
      if (replacedTokenCount === 0 && strict) {
        throw new Check.DeveloperError(
          `strict: shader source does not use channels '${uniformId}'.`
        );
      }
      //>>includeEnd('debug');
    } else {
      // Since webgl doesn't allow texture dimension queries in glsl, create a uniform to do it.
      // Check if the shader source actually uses texture dimensions before creating the uniform.
      if (uniformType === "sampler2D") {
        const imageDimensionsUniformName = `${uniformId}Dimensions`;
        if (getNumberOfTokens(material, imageDimensionsUniformName) > 0) {
          materialUniforms[imageDimensionsUniformName] = {
            type: "ivec3",
            x: 1,
            y: 1,
          };
          createUniform(material, imageDimensionsUniformName);
        }
      }

      // Add uniform declaration to source code.
      const uniformDeclarationRegex = new RegExp(
        `uniform\\s+${uniformType}\\s+${uniformId}\\s*;`
      );
      if (!uniformDeclarationRegex.test(material.shaderSource)) {
        const uniformDeclaration = `uniform ${uniformType} ${uniformId};`;
        material.shaderSource = uniformDeclaration + material.shaderSource;
      }

      const newUniformId = `${uniformId}_${material._count++}`;
      replacedTokenCount = replaceToken(material, uniformId, newUniformId);
      //>>includeStart('debug', pragmas.debug);
      if (replacedTokenCount === 1 && strict) {
        throw new Check.DeveloperError(
          `strict: shader source does not use uniform '${uniformId}'.`
        );
      }
      //>>includeEnd('debug');

      // Set uniform value
      material.uniforms[uniformId] = uniformValue;

      if (uniformType === "sampler2D") {
        material._uniforms[newUniformId] = function () {
          return material._textures[uniformId];
        };
        material._updateFunctions.push(createTexture2DUpdateFunction(uniformId));
      } else if (uniformType === "samplerCube") {
        material._uniforms[newUniformId] = function () {
          return material._textures[uniformId];
        };
        material._updateFunctions.push(createCubeMapUpdateFunction(uniformId));
      } else if (uniformType.indexOf("mat") !== -1) {
        const scratchMatrix = new matrixMap[uniformType]();
        material._uniforms[newUniformId] = function () {
          return matrixMap[uniformType].fromColumnMajorArray(
            material.uniforms[uniformId],
            scratchMatrix
          );
        };
      } else {
        material._uniforms[newUniformId] = function () {
          return material.uniforms[uniformId];
        };
      }
    }
  }

  // Determines the uniform type based on the uniform in the template.
  function getUniformType(uniformValue) {
    let uniformType = uniformValue.type;
    if (!defined.defined(uniformType)) {
      const type = typeof uniformValue;
      if (type === "number") {
        uniformType = "float";
      } else if (type === "boolean") {
        uniformType = "bool";
      } else if (
        type === "string" ||
        uniformValue instanceof Resource.Resource ||
        uniformValue instanceof HTMLCanvasElement ||
        uniformValue instanceof HTMLImageElement
      ) {
        if (/^([rgba]){1,4}$/i.test(uniformValue)) {
          uniformType = "channels";
        } else if (uniformValue === Material.DefaultCubeMapId) {
          uniformType = "samplerCube";
        } else {
          uniformType = "sampler2D";
        }
      } else if (type === "object") {
        if (Array.isArray(uniformValue)) {
          if (
            uniformValue.length === 4 ||
            uniformValue.length === 9 ||
            uniformValue.length === 16
          ) {
            uniformType = `mat${Math.sqrt(uniformValue.length)}`;
          }
        } else {
          let numAttributes = 0;
          for (const attribute in uniformValue) {
            if (uniformValue.hasOwnProperty(attribute)) {
              numAttributes += 1;
            }
          }
          if (numAttributes >= 2 && numAttributes <= 4) {
            uniformType = `vec${numAttributes}`;
          } else if (numAttributes === 6) {
            uniformType = "samplerCube";
          }
        }
      }
    }
    return uniformType;
  }

  // Create all sub-materials by combining source and uniforms together.
  function createSubMaterials(material) {
    const strict = material._strict;
    const subMaterialTemplates = material._template.materials;
    for (const subMaterialId in subMaterialTemplates) {
      if (subMaterialTemplates.hasOwnProperty(subMaterialId)) {
        // Construct the sub-material.
        const subMaterial = new Material({
          strict: strict,
          fabric: subMaterialTemplates[subMaterialId],
          count: material._count,
        });

        material._count = subMaterial._count;
        material._uniforms = combine.combine(
          material._uniforms,
          subMaterial._uniforms,
          true
        );
        material.materials[subMaterialId] = subMaterial;
        material._translucentFunctions = material._translucentFunctions.concat(
          subMaterial._translucentFunctions
        );

        // Make the material's czm_getMaterial unique by appending the sub-material type.
        const originalMethodName = "czm_getMaterial";
        const newMethodName = `${originalMethodName}_${material._count++}`;
        replaceToken(subMaterial, originalMethodName, newMethodName);
        material.shaderSource = subMaterial.shaderSource + material.shaderSource;

        // Replace each material id with an czm_getMaterial method call.
        const materialMethodCall = `${newMethodName}(materialInput)`;
        const tokensReplacedCount = replaceToken(
          material,
          subMaterialId,
          materialMethodCall
        );
        //>>includeStart('debug', pragmas.debug);
        if (tokensReplacedCount === 0 && strict) {
          throw new Check.DeveloperError(
            `strict: shader source does not use material '${subMaterialId}'.`
          );
        }
        //>>includeEnd('debug');
      }
    }
  }

  // Used for searching or replacing a token in a material's shader source with something else.
  // If excludePeriod is true, do not accept tokens that are preceded by periods.
  // http://stackoverflow.com/questions/641407/javascript-negative-lookbehind-equivalent
  function replaceToken(material, token, newToken, excludePeriod) {
    excludePeriod = defined.defaultValue(excludePeriod, true);
    let count = 0;
    const suffixChars = "([\\w])?";
    const prefixChars = `([\\w${excludePeriod ? "." : ""}])?`;
    const regExp = new RegExp(prefixChars + token + suffixChars, "g");
    material.shaderSource = material.shaderSource.replace(regExp, function (
      $0,
      $1,
      $2
    ) {
      if ($1 || $2) {
        return $0;
      }
      count += 1;
      return newToken;
    });
    return count;
  }

  function getNumberOfTokens(material, token, excludePeriod) {
    return replaceToken(material, token, token, excludePeriod);
  }

  Material._materialCache = {
    _materials: {},
    addMaterial: function (type, materialTemplate) {
      this._materials[type] = materialTemplate;
    },
    getMaterial: function (type) {
      return this._materials[type];
    },
  };

  /**
   * Gets or sets the default texture uniform value.
   * @type {String}
   */
  Material.DefaultImageId = "czm_defaultImage";

  /**
   * Gets or sets the default cube map texture uniform value.
   * @type {String}
   */
  Material.DefaultCubeMapId = "czm_defaultCubeMap";

  /**
   * Gets the name of the color material.
   * @type {String}
   * @readonly
   */
  Material.ColorType = "Color";
  Material._materialCache.addMaterial(Material.ColorType, {
    fabric: {
      type: Material.ColorType,
      uniforms: {
        color: new Color.Color(1.0, 0.0, 0.0, 0.5),
      },
      components: {
        diffuse: "color.rgb",
        alpha: "color.a",
      },
    },
    translucent: function (material) {
      return material.uniforms.color.alpha < 1.0;
    },
  });

  /**
   * Gets the name of the image material.
   * @type {String}
   * @readonly
   */
  Material.ImageType = "Image";
  Material._materialCache.addMaterial(Material.ImageType, {
    fabric: {
      type: Material.ImageType,
      uniforms: {
        image: Material.DefaultImageId,
        repeat: new Cartesian2.Cartesian2(1.0, 1.0),
        color: new Color.Color(1.0, 1.0, 1.0, 1.0),
      },
      components: {
        diffuse:
          "texture2D(image, fract(repeat * materialInput.st)).rgb * color.rgb",
        alpha: "texture2D(image, fract(repeat * materialInput.st)).a * color.a",
      },
    },
    translucent: function (material) {
      return material.uniforms.color.alpha < 1.0;
    },
  });

  /**
   * Gets the name of the diffuce map material.
   * @type {String}
   * @readonly
   */
  Material.DiffuseMapType = "DiffuseMap";
  Material._materialCache.addMaterial(Material.DiffuseMapType, {
    fabric: {
      type: Material.DiffuseMapType,
      uniforms: {
        image: Material.DefaultImageId,
        channels: "rgb",
        repeat: new Cartesian2.Cartesian2(1.0, 1.0),
      },
      components: {
        diffuse: "texture2D(image, fract(repeat * materialInput.st)).channels",
      },
    },
    translucent: false,
  });

  /**
   * Gets the name of the alpha map material.
   * @type {String}
   * @readonly
   */
  Material.AlphaMapType = "AlphaMap";
  Material._materialCache.addMaterial(Material.AlphaMapType, {
    fabric: {
      type: Material.AlphaMapType,
      uniforms: {
        image: Material.DefaultImageId,
        channel: "a",
        repeat: new Cartesian2.Cartesian2(1.0, 1.0),
      },
      components: {
        alpha: "texture2D(image, fract(repeat * materialInput.st)).channel",
      },
    },
    translucent: true,
  });

  /**
   * Gets the name of the specular map material.
   * @type {String}
   * @readonly
   */
  Material.SpecularMapType = "SpecularMap";
  Material._materialCache.addMaterial(Material.SpecularMapType, {
    fabric: {
      type: Material.SpecularMapType,
      uniforms: {
        image: Material.DefaultImageId,
        channel: "r",
        repeat: new Cartesian2.Cartesian2(1.0, 1.0),
      },
      components: {
        specular: "texture2D(image, fract(repeat * materialInput.st)).channel",
      },
    },
    translucent: false,
  });

  /**
   * Gets the name of the emmision map material.
   * @type {String}
   * @readonly
   */
  Material.EmissionMapType = "EmissionMap";
  Material._materialCache.addMaterial(Material.EmissionMapType, {
    fabric: {
      type: Material.EmissionMapType,
      uniforms: {
        image: Material.DefaultImageId,
        channels: "rgb",
        repeat: new Cartesian2.Cartesian2(1.0, 1.0),
      },
      components: {
        emission: "texture2D(image, fract(repeat * materialInput.st)).channels",
      },
    },
    translucent: false,
  });

  /**
   * Gets the name of the bump map material.
   * @type {String}
   * @readonly
   */
  Material.BumpMapType = "BumpMap";
  Material._materialCache.addMaterial(Material.BumpMapType, {
    fabric: {
      type: Material.BumpMapType,
      uniforms: {
        image: Material.DefaultImageId,
        channel: "r",
        strength: 0.8,
        repeat: new Cartesian2.Cartesian2(1.0, 1.0),
      },
      source: BumpMapMaterial,
    },
    translucent: false,
  });

  /**
   * Gets the name of the normal map material.
   * @type {String}
   * @readonly
   */
  Material.NormalMapType = "NormalMap";
  Material._materialCache.addMaterial(Material.NormalMapType, {
    fabric: {
      type: Material.NormalMapType,
      uniforms: {
        image: Material.DefaultImageId,
        channels: "rgb",
        strength: 0.8,
        repeat: new Cartesian2.Cartesian2(1.0, 1.0),
      },
      source: NormalMapMaterial,
    },
    translucent: false,
  });

  /**
   * Gets the name of the grid material.
   * @type {String}
   * @readonly
   */
  Material.GridType = "Grid";
  Material._materialCache.addMaterial(Material.GridType, {
    fabric: {
      type: Material.GridType,
      uniforms: {
        color: new Color.Color(0.0, 1.0, 0.0, 1.0),
        cellAlpha: 0.1,
        lineCount: new Cartesian2.Cartesian2(8.0, 8.0),
        lineThickness: new Cartesian2.Cartesian2(1.0, 1.0),
        lineOffset: new Cartesian2.Cartesian2(0.0, 0.0),
      },
      source: GridMaterial,
    },
    translucent: function (material) {
      const uniforms = material.uniforms;
      return uniforms.color.alpha < 1.0 || uniforms.cellAlpha < 1.0;
    },
  });

  /**
   * Gets the name of the stripe material.
   * @type {String}
   * @readonly
   */
  Material.StripeType = "Stripe";
  Material._materialCache.addMaterial(Material.StripeType, {
    fabric: {
      type: Material.StripeType,
      uniforms: {
        horizontal: true,
        evenColor: new Color.Color(1.0, 1.0, 1.0, 0.5),
        oddColor: new Color.Color(0.0, 0.0, 1.0, 0.5),
        offset: 0.0,
        repeat: 5.0,
      },
      source: StripeMaterial,
    },
    translucent: function (material) {
      const uniforms = material.uniforms;
      return uniforms.evenColor.alpha < 1.0 || uniforms.oddColor.alpha < 1.0;
    },
  });

  /**
   * Gets the name of the checkerboard material.
   * @type {String}
   * @readonly
   */
  Material.CheckerboardType = "Checkerboard";
  Material._materialCache.addMaterial(Material.CheckerboardType, {
    fabric: {
      type: Material.CheckerboardType,
      uniforms: {
        lightColor: new Color.Color(1.0, 1.0, 1.0, 0.5),
        darkColor: new Color.Color(0.0, 0.0, 0.0, 0.5),
        repeat: new Cartesian2.Cartesian2(5.0, 5.0),
      },
      source: CheckerboardMaterial,
    },
    translucent: function (material) {
      const uniforms = material.uniforms;
      return uniforms.lightColor.alpha < 1.0 || uniforms.darkColor.alpha < 1.0;
    },
  });

  /**
   * Gets the name of the dot material.
   * @type {String}
   * @readonly
   */
  Material.DotType = "Dot";
  Material._materialCache.addMaterial(Material.DotType, {
    fabric: {
      type: Material.DotType,
      uniforms: {
        lightColor: new Color.Color(1.0, 1.0, 0.0, 0.75),
        darkColor: new Color.Color(0.0, 1.0, 1.0, 0.75),
        repeat: new Cartesian2.Cartesian2(5.0, 5.0),
      },
      source: DotMaterial,
    },
    translucent: function (material) {
      const uniforms = material.uniforms;
      return uniforms.lightColor.alpha < 1.0 || uniforms.darkColor.alpha < 1.0;
    },
  });

  /**
   * Gets the name of the water material.
   * @type {String}
   * @readonly
   */
  Material.WaterType = "Water";
  Material._materialCache.addMaterial(Material.WaterType, {
    fabric: {
      type: Material.WaterType,
      uniforms: {
        baseWaterColor: new Color.Color(0.2, 0.3, 0.6, 1.0),
        blendColor: new Color.Color(0.0, 1.0, 0.699, 1.0),
        specularMap: Material.DefaultImageId,
        normalMap: Material.DefaultImageId,
        frequency: 10.0,
        animationSpeed: 0.01,
        amplitude: 1.0,
        specularIntensity: 0.5,
        fadeFactor: 1.0,
      },
      source: WaterMaterial,
    },
    translucent: function (material) {
      const uniforms = material.uniforms;
      return (
        uniforms.baseWaterColor.alpha < 1.0 || uniforms.blendColor.alpha < 1.0
      );
    },
  });

  /**
   * Gets the name of the yanmo material.
   * @type {String}
   * @readonly
   */
  Material.YanMoType = 'YanMo';
  Material._materialCache.addMaterial(Material.YanMoType, {
    fabric: {
      type: Material.YanMoType,
      source: YanMoMaterial
    },
    translucent: false
  });

  /**
   * Gets the name of the yanmo material.
   * @type {String}
   * @readonly
   */
  Material.WaJueType = 'WaJue';
  Material._materialCache.addMaterial(Material.WaJueType, {
    fabric: {
      type: Material.WaJueType,
      source: WaJueMaterial
    },
    translucent: false
  });

  /**
   * Gets the name of the rim lighting material.
   * @type {String}
   * @readonly
   */
  Material.RimLightingType = "RimLighting";
  Material._materialCache.addMaterial(Material.RimLightingType, {
    fabric: {
      type: Material.RimLightingType,
      uniforms: {
        color: new Color.Color(1.0, 0.0, 0.0, 0.7),
        rimColor: new Color.Color(1.0, 1.0, 1.0, 0.4),
        width: 0.3,
      },
      source: RimLightingMaterial,
    },
    translucent: function (material) {
      const uniforms = material.uniforms;
      return uniforms.color.alpha < 1.0 || uniforms.rimColor.alpha < 1.0;
    },
  });

  /**
   * Gets the name of the fade material.
   * @type {String}
   * @readonly
   */
  Material.FadeType = "Fade";
  Material._materialCache.addMaterial(Material.FadeType, {
    fabric: {
      type: Material.FadeType,
      uniforms: {
        fadeInColor: new Color.Color(1.0, 0.0, 0.0, 1.0),
        fadeOutColor: new Color.Color(0.0, 0.0, 0.0, 0.0),
        maximumDistance: 0.5,
        repeat: true,
        fadeDirection: {
          x: true,
          y: true,
        },
        time: new Cartesian2.Cartesian2(0.5, 0.5),
      },
      source: FadeMaterial,
    },
    translucent: function (material) {
      const uniforms = material.uniforms;
      return (
        uniforms.fadeInColor.alpha < 1.0 || uniforms.fadeOutColor.alpha < 1.0
      );
    },
  });

  /**
   * Gets the name of the polyline arrow material.
   * @type {String}
   * @readonly
   */
  Material.PolylineArrowType = "PolylineArrow";
  Material._materialCache.addMaterial(Material.PolylineArrowType, {
    fabric: {
      type: Material.PolylineArrowType,
      uniforms: {
        color: new Color.Color(1.0, 1.0, 1.0, 1.0),
      },
      source: PolylineArrowMaterial,
    },
    translucent: true,
  });

  /**
   * Gets the name of the polyline glow material.
   * @type {String}
   * @readonly
   */
  Material.PolylineDashType = "PolylineDash";
  Material._materialCache.addMaterial(Material.PolylineDashType, {
    fabric: {
      type: Material.PolylineDashType,
      uniforms: {
        color: new Color.Color(1.0, 0.0, 1.0, 1.0),
        gapColor: new Color.Color(0.0, 0.0, 0.0, 0.0),
        dashLength: 16.0,
        dashPattern: 255.0,
      },
      source: PolylineDashMaterial,
    },
    translucent: true,
  });

  /**
   * Gets the name of the polyline glow material.
   * @type {String}
   * @readonly
   */
  Material.PolylineGlowType = "PolylineGlow";
  Material._materialCache.addMaterial(Material.PolylineGlowType, {
    fabric: {
      type: Material.PolylineGlowType,
      uniforms: {
        color: new Color.Color(0.0, 0.5, 1.0, 1.0),
        glowPower: 0.25,
        taperPower: 1.0,
      },
      source: PolylineGlowMaterial,
    },
    translucent: true,
  });

  /**
   * Gets the name of the polyline outline material.
   * @type {String}
   * @readonly
   */
  Material.PolylineOutlineType = "PolylineOutline";
  Material._materialCache.addMaterial(Material.PolylineOutlineType, {
    fabric: {
      type: Material.PolylineOutlineType,
      uniforms: {
        color: new Color.Color(1.0, 1.0, 1.0, 1.0),
        outlineColor: new Color.Color(1.0, 0.0, 0.0, 1.0),
        outlineWidth: 1.0,
      },
      source: PolylineOutlineMaterial,
    },
    translucent: function (material) {
      const uniforms = material.uniforms;
      return uniforms.color.alpha < 1.0 || uniforms.outlineColor.alpha < 1.0;
    },
  });

  /**
   * Gets the name of the elevation contour material.
   * @type {String}
   * @readonly
   */
  Material.ElevationContourType = "ElevationContour";
  Material._materialCache.addMaterial(Material.ElevationContourType, {
    fabric: {
      type: Material.ElevationContourType,
      uniforms: {
        spacing: 100.0,
        color: new Color.Color(1.0, 0.0, 0.0, 1.0),
        width: 1.0,
      },
      source: ElevationContourMaterial,
    },
    translucent: false,
  });

  /**
   * Gets the name of the elevation contour material.
   * @type {String}
   * @readonly
   */
  Material.ElevationRampType = "ElevationRamp";
  Material._materialCache.addMaterial(Material.ElevationRampType, {
    fabric: {
      type: Material.ElevationRampType,
      uniforms: {
        image: Material.DefaultImageId,
        minimumHeight: 0.0,
        maximumHeight: 10000.0,
      },
      source: ElevationRampMaterial,
    },
    translucent: false,
  });

  /**
   * Gets the name of the slope ramp material.
   * @type {String}
   * @readonly
   */
  Material.SlopeRampMaterialType = "SlopeRamp";
  Material._materialCache.addMaterial(Material.SlopeRampMaterialType, {
    fabric: {
      type: Material.SlopeRampMaterialType,
      uniforms: {
        image: Material.DefaultImageId,
      },
      source: SlopeRampMaterial,
    },
    translucent: false,
  });

  /**
   * Gets the name of the aspect ramp material.
   * @type {String}
   * @readonly
   */
  Material.AspectRampMaterialType = "AspectRamp";
  Material._materialCache.addMaterial(Material.AspectRampMaterialType, {
    fabric: {
      type: Material.AspectRampMaterialType,
      uniforms: {
        image: Material.DefaultImageId,
      },
      source: AspectRampMaterial,
    },
    translucent: false,
  });

  /**
   * Gets the name of the elevation band material.
   * @type {String}
   * @readonly
   */
  Material.ElevationBandType = "ElevationBand";
  Material._materialCache.addMaterial(Material.ElevationBandType, {
    fabric: {
      type: Material.ElevationBandType,
      uniforms: {
        heights: Material.DefaultImageId,
        colors: Material.DefaultImageId,
      },
      source: ElevationBandMaterial,
    },
    translucent: true,
  });

  /**
   * An appearance for geometry on the surface of the ellipsoid like {@link PolygonGeometry}
   * and {@link RectangleGeometry}, which supports all materials like {@link MaterialAppearance}
   * with {@link MaterialAppearance.MaterialSupport.ALL}.  However, this appearance requires
   * fewer vertex attributes since the fragment shader can procedurally compute <code>normal</code>,
   * <code>tangent</code>, and <code>bitangent</code>.
   *
   * @alias EllipsoidSurfaceAppearance
   * @constructor
   *
   * @param {Object} [options] Object with the following properties:
   * @param {Boolean} [options.flat=false] When <code>true</code>, flat shading is used in the fragment shader, which means lighting is not taking into account.
   * @param {Boolean} [options.faceForward=options.aboveGround] When <code>true</code>, the fragment shader flips the surface normal as needed to ensure that the normal faces the viewer to avoid dark spots.  This is useful when both sides of a geometry should be shaded like {@link WallGeometry}.
   * @param {Boolean} [options.translucent=true] When <code>true</code>, the geometry is expected to appear translucent so {@link EllipsoidSurfaceAppearance#renderState} has alpha blending enabled.
   * @param {Boolean} [options.aboveGround=false] When <code>true</code>, the geometry is expected to be on the ellipsoid's surface - not at a constant height above it - so {@link EllipsoidSurfaceAppearance#renderState} has backface culling enabled.
   * @param {Material} [options.material=Material.ColorType] The material used to determine the fragment color.
   * @param {String} [options.vertexShaderSource] Optional GLSL vertex shader source to override the default vertex shader.
   * @param {String} [options.fragmentShaderSource] Optional GLSL fragment shader source to override the default fragment shader.
   * @param {Object} [options.renderState] Optional render state to override the default render state.
   *
   * @see {@link https://github.com/CesiumGS/cesium/wiki/Fabric|Fabric}
   *
   * @example
   * const primitive = new Cesium.Primitive({
   *   geometryInstances : new Cesium.GeometryInstance({
   *     geometry : new Cesium.PolygonGeometry({
   *       vertexFormat : Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT,
   *       // ...
   *     })
   *   }),
   *   appearance : new Cesium.EllipsoidSurfaceAppearance({
   *     material : Cesium.Material.fromType('Stripe')
   *   })
   * });
   */
  function EllipsoidSurfaceAppearance(options) {
    options = defined.defaultValue(options, defined.defaultValue.EMPTY_OBJECT);

    const translucent = defined.defaultValue(options.translucent, true);
    const aboveGround = defined.defaultValue(options.aboveGround, false);

    /**
     * The material used to determine the fragment color.  Unlike other {@link EllipsoidSurfaceAppearance}
     * properties, this is not read-only, so an appearance's material can change on the fly.
     *
     * @type Material
     *
     * @default {@link Material.ColorType}
     *
     * @see {@link https://github.com/CesiumGS/cesium/wiki/Fabric|Fabric}
     */
    this.material = defined.defined(options.material)
      ? options.material
      : Material.fromType(Material.ColorType);

    /**
     * When <code>true</code>, the geometry is expected to appear translucent.
     *
     * @type {Boolean}
     *
     * @default true
     */
    this.translucent = defined.defaultValue(options.translucent, true);

    this._vertexShaderSource = defined.defaultValue(
      options.vertexShaderSource,
      EllipsoidSurfaceAppearanceVS
    );
    this._fragmentShaderSource = defined.defaultValue(
      options.fragmentShaderSource,
      EllipsoidSurfaceAppearanceFS
    );
    this._renderState = Appearance.getDefaultRenderState(
      translucent,
      !aboveGround,
      options.renderState
    );
    this._closed = false;

    // Non-derived members

    this._flat = defined.defaultValue(options.flat, false);
    this._faceForward = defined.defaultValue(options.faceForward, aboveGround);
    this._aboveGround = aboveGround;
  }

  Object.defineProperties(EllipsoidSurfaceAppearance.prototype, {
    /**
     * The GLSL source code for the vertex shader.
     *
     * @memberof EllipsoidSurfaceAppearance.prototype
     *
     * @type {String}
     * @readonly
     */
    vertexShaderSource: {
      get: function () {
        return this._vertexShaderSource;
      },
    },

    /**
     * The GLSL source code for the fragment shader.  The full fragment shader
     * source is built procedurally taking into account {@link EllipsoidSurfaceAppearance#material},
     * {@link EllipsoidSurfaceAppearance#flat}, and {@link EllipsoidSurfaceAppearance#faceForward}.
     * Use {@link EllipsoidSurfaceAppearance#getFragmentShaderSource} to get the full source.
     *
     * @memberof EllipsoidSurfaceAppearance.prototype
     *
     * @type {String}
     * @readonly
     */
    fragmentShaderSource: {
      get: function () {
        return this._fragmentShaderSource;
      },
    },

    /**
     * The WebGL fixed-function state to use when rendering the geometry.
     * <p>
     * The render state can be explicitly defined when constructing a {@link EllipsoidSurfaceAppearance}
     * instance, or it is set implicitly via {@link EllipsoidSurfaceAppearance#translucent}
     * and {@link EllipsoidSurfaceAppearance#aboveGround}.
     * </p>
     *
     * @memberof EllipsoidSurfaceAppearance.prototype
     *
     * @type {Object}
     * @readonly
     */
    renderState: {
      get: function () {
        return this._renderState;
      },
    },

    /**
     * When <code>true</code>, the geometry is expected to be closed so
     * {@link EllipsoidSurfaceAppearance#renderState} has backface culling enabled.
     * If the viewer enters the geometry, it will not be visible.
     *
     * @memberof EllipsoidSurfaceAppearance.prototype
     *
     * @type {Boolean}
     * @readonly
     *
     * @default false
     */
    closed: {
      get: function () {
        return this._closed;
      },
    },

    /**
     * The {@link VertexFormat} that this appearance instance is compatible with.
     * A geometry can have more vertex attributes and still be compatible - at a
     * potential performance cost - but it can't have less.
     *
     * @memberof EllipsoidSurfaceAppearance.prototype
     *
     * @type VertexFormat
     * @readonly
     *
     * @default {@link EllipsoidSurfaceAppearance.VERTEX_FORMAT}
     */
    vertexFormat: {
      get: function () {
        return EllipsoidSurfaceAppearance.VERTEX_FORMAT;
      },
    },

    /**
     * When <code>true</code>, flat shading is used in the fragment shader,
     * which means lighting is not taking into account.
     *
     * @memberof EllipsoidSurfaceAppearance.prototype
     *
     * @type {Boolean}
     * @readonly
     *
     * @default false
     */
    flat: {
      get: function () {
        return this._flat;
      },
    },

    /**
     * When <code>true</code>, the fragment shader flips the surface normal
     * as needed to ensure that the normal faces the viewer to avoid
     * dark spots.  This is useful when both sides of a geometry should be
     * shaded like {@link WallGeometry}.
     *
     * @memberof EllipsoidSurfaceAppearance.prototype
     *
     * @type {Boolean}
     * @readonly
     *
     * @default true
     */
    faceForward: {
      get: function () {
        return this._faceForward;
      },
    },

    /**
     * When <code>true</code>, the geometry is expected to be on the ellipsoid's
     * surface - not at a constant height above it - so {@link EllipsoidSurfaceAppearance#renderState}
     * has backface culling enabled.
     *
     *
     * @memberof EllipsoidSurfaceAppearance.prototype
     *
     * @type {Boolean}
     * @readonly
     *
     * @default false
     */
    aboveGround: {
      get: function () {
        return this._aboveGround;
      },
    },
  });

  /**
   * The {@link VertexFormat} that all {@link EllipsoidSurfaceAppearance} instances
   * are compatible with, which requires only <code>position</code> and <code>st</code>
   * attributes.  Other attributes are procedurally computed in the fragment shader.
   *
   * @type VertexFormat
   *
   * @constant
   */
  EllipsoidSurfaceAppearance.VERTEX_FORMAT = VertexFormat.VertexFormat.POSITION_AND_ST;

  /**
   * Procedurally creates the full GLSL fragment shader source.  For {@link EllipsoidSurfaceAppearance},
   * this is derived from {@link EllipsoidSurfaceAppearance#fragmentShaderSource}, {@link EllipsoidSurfaceAppearance#flat},
   * and {@link EllipsoidSurfaceAppearance#faceForward}.
   *
   * @function
   *
   * @returns {String} The full GLSL fragment shader source.
   */
  EllipsoidSurfaceAppearance.prototype.getFragmentShaderSource =
    Appearance.prototype.getFragmentShaderSource;

  /**
   * Determines if the geometry is translucent based on {@link EllipsoidSurfaceAppearance#translucent} and {@link Material#isTranslucent}.
   *
   * @function
   *
   * @returns {Boolean} <code>true</code> if the appearance is translucent.
   */
  EllipsoidSurfaceAppearance.prototype.isTranslucent =
    Appearance.prototype.isTranslucent;

  /**
   * Creates a render state.  This is not the final render state instance; instead,
   * it can contain a subset of render state properties identical to the render state
   * created in the context.
   *
   * @function
   *
   * @returns {Object} The render state.
   */
  EllipsoidSurfaceAppearance.prototype.getRenderState =
    Appearance.prototype.getRenderState;

  //This file is automatically rebuilt by the Cesium build process.
  var PerInstanceColorAppearanceFS = "varying vec3 v_positionEC;\n\
varying vec3 v_normalEC;\n\
varying vec4 v_color;\n\
\n\
void main()\n\
{\n\
    vec3 positionToEyeEC = -v_positionEC;\n\
\n\
    vec3 normalEC = normalize(v_normalEC);\n\
#ifdef FACE_FORWARD\n\
    normalEC = faceforward(normalEC, vec3(0.0, 0.0, 1.0), -normalEC);\n\
#endif\n\
\n\
    vec4 color = czm_gammaCorrect(v_color);\n\
\n\
    czm_materialInput materialInput;\n\
    materialInput.normalEC = normalEC;\n\
    materialInput.positionToEyeEC = positionToEyeEC;\n\
    czm_material material = czm_getDefaultMaterial(materialInput);\n\
    material.diffuse = color.rgb;\n\
    material.alpha = color.a;\n\
\n\
    gl_FragColor = czm_phong(normalize(positionToEyeEC), material, czm_lightDirectionEC);\n\
}\n\
";

  //This file is automatically rebuilt by the Cesium build process.
  var PerInstanceColorAppearanceVS = "attribute vec3 position3DHigh;\n\
attribute vec3 position3DLow;\n\
attribute vec3 normal;\n\
attribute vec4 color;\n\
attribute float batchId;\n\
\n\
varying vec3 v_positionEC;\n\
varying vec3 v_normalEC;\n\
varying vec4 v_color;\n\
\n\
void main()\n\
{\n\
    vec4 p = czm_computePosition();\n\
\n\
    v_positionEC = (czm_modelViewRelativeToEye * p).xyz;      // position in eye coordinates\n\
    v_normalEC = czm_normal * normal;                         // normal in eye coordinates\n\
    v_color = color;\n\
\n\
    gl_Position = czm_modelViewProjectionRelativeToEye * p;\n\
}\n\
";

  //This file is automatically rebuilt by the Cesium build process.
  var PerInstanceFlatColorAppearanceFS = "varying vec4 v_color;\n\
\n\
void main()\n\
{\n\
    gl_FragColor = czm_gammaCorrect(v_color);\n\
}\n\
";

  //This file is automatically rebuilt by the Cesium build process.
  var PerInstanceFlatColorAppearanceVS = "attribute vec3 position3DHigh;\n\
attribute vec3 position3DLow;\n\
attribute vec4 color;\n\
attribute float batchId;\n\
\n\
varying vec4 v_color;\n\
\n\
void main()\n\
{\n\
    vec4 p = czm_computePosition();\n\
\n\
    v_color = color;\n\
\n\
    gl_Position = czm_modelViewProjectionRelativeToEye * p;\n\
}\n\
";

  /**
   * An appearance for {@link GeometryInstance} instances with color attributes.
   * This allows several geometry instances, each with a different color, to
   * be drawn with the same {@link Primitive} as shown in the second example below.
   *
   * @alias PerInstanceColorAppearance
   * @constructor
   *
   * @param {Object} [options] Object with the following properties:
   * @param {Boolean} [options.flat=false] When <code>true</code>, flat shading is used in the fragment shader, which means lighting is not taking into account.
   * @param {Boolean} [options.faceForward=!options.closed] When <code>true</code>, the fragment shader flips the surface normal as needed to ensure that the normal faces the viewer to avoid dark spots.  This is useful when both sides of a geometry should be shaded like {@link WallGeometry}.
   * @param {Boolean} [options.translucent=true] When <code>true</code>, the geometry is expected to appear translucent so {@link PerInstanceColorAppearance#renderState} has alpha blending enabled.
   * @param {Boolean} [options.closed=false] When <code>true</code>, the geometry is expected to be closed so {@link PerInstanceColorAppearance#renderState} has backface culling enabled.
   * @param {String} [options.vertexShaderSource] Optional GLSL vertex shader source to override the default vertex shader.
   * @param {String} [options.fragmentShaderSource] Optional GLSL fragment shader source to override the default fragment shader.
   * @param {Object} [options.renderState] Optional render state to override the default render state.
   *
   * @example
   * // A solid white line segment
   * const primitive = new Cesium.Primitive({
   *   geometryInstances : new Cesium.GeometryInstance({
   *     geometry : new Cesium.SimplePolylineGeometry({
   *       positions : Cesium.Cartesian3.fromDegreesArray([
   *         0.0, 0.0,
   *         5.0, 0.0
   *       ])
   *     }),
   *     attributes : {
   *       color : Cesium.ColorGeometryInstanceAttribute.fromColor(new Cesium.Color(1.0, 1.0, 1.0, 1.0))
   *     }
   *   }),
   *   appearance : new Cesium.PerInstanceColorAppearance({
   *     flat : true,
   *     translucent : false
   *   })
   * });
   *
   * // Two rectangles in a primitive, each with a different color
   * const instance = new Cesium.GeometryInstance({
   *   geometry : new Cesium.RectangleGeometry({
   *     rectangle : Cesium.Rectangle.fromDegrees(0.0, 20.0, 10.0, 30.0)
   *   }),
   *   attributes : {
   *     color : new Cesium.ColorGeometryInstanceAttribute(1.0, 0.0, 0.0, 0.5)
   *   }
   * });
   *
   * const anotherInstance = new Cesium.GeometryInstance({
   *   geometry : new Cesium.RectangleGeometry({
   *     rectangle : Cesium.Rectangle.fromDegrees(0.0, 40.0, 10.0, 50.0)
   *   }),
   *   attributes : {
   *     color : new Cesium.ColorGeometryInstanceAttribute(0.0, 0.0, 1.0, 0.5)
   *   }
   * });
   *
   * const rectanglePrimitive = new Cesium.Primitive({
   *   geometryInstances : [instance, anotherInstance],
   *   appearance : new Cesium.PerInstanceColorAppearance()
   * });
   */
  function PerInstanceColorAppearance(options) {
    options = defined.defaultValue(options, defined.defaultValue.EMPTY_OBJECT);

    const translucent = defined.defaultValue(options.translucent, true);
    const closed = defined.defaultValue(options.closed, false);
    const flat = defined.defaultValue(options.flat, false);
    const vs = flat
      ? PerInstanceFlatColorAppearanceVS
      : PerInstanceColorAppearanceVS;
    const fs = flat
      ? PerInstanceFlatColorAppearanceFS
      : PerInstanceColorAppearanceFS;
    const vertexFormat = flat
      ? PerInstanceColorAppearance.FLAT_VERTEX_FORMAT
      : PerInstanceColorAppearance.VERTEX_FORMAT;

    /**
     * This property is part of the {@link Appearance} interface, but is not
     * used by {@link PerInstanceColorAppearance} since a fully custom fragment shader is used.
     *
     * @type Material
     *
     * @default undefined
     */
    this.material = undefined;

    /**
     * When <code>true</code>, the geometry is expected to appear translucent so
     * {@link PerInstanceColorAppearance#renderState} has alpha blending enabled.
     *
     * @type {Boolean}
     *
     * @default true
     */
    this.translucent = translucent;

    this._vertexShaderSource = defined.defaultValue(options.vertexShaderSource, vs);
    this._fragmentShaderSource = defined.defaultValue(options.fragmentShaderSource, fs);
    this._renderState = Appearance.getDefaultRenderState(
      translucent,
      closed,
      options.renderState
    );
    this._closed = closed;

    // Non-derived members

    this._vertexFormat = vertexFormat;
    this._flat = flat;
    this._faceForward = defined.defaultValue(options.faceForward, !closed);
  }

  Object.defineProperties(PerInstanceColorAppearance.prototype, {
    /**
     * The GLSL source code for the vertex shader.
     *
     * @memberof PerInstanceColorAppearance.prototype
     *
     * @type {String}
     * @readonly
     */
    vertexShaderSource: {
      get: function () {
        return this._vertexShaderSource;
      },
    },

    /**
     * The GLSL source code for the fragment shader.
     *
     * @memberof PerInstanceColorAppearance.prototype
     *
     * @type {String}
     * @readonly
     */
    fragmentShaderSource: {
      get: function () {
        return this._fragmentShaderSource;
      },
    },

    /**
     * The WebGL fixed-function state to use when rendering the geometry.
     * <p>
     * The render state can be explicitly defined when constructing a {@link PerInstanceColorAppearance}
     * instance, or it is set implicitly via {@link PerInstanceColorAppearance#translucent}
     * and {@link PerInstanceColorAppearance#closed}.
     * </p>
     *
     * @memberof PerInstanceColorAppearance.prototype
     *
     * @type {Object}
     * @readonly
     */
    renderState: {
      get: function () {
        return this._renderState;
      },
    },

    /**
     * When <code>true</code>, the geometry is expected to be closed so
     * {@link PerInstanceColorAppearance#renderState} has backface culling enabled.
     * If the viewer enters the geometry, it will not be visible.
     *
     * @memberof PerInstanceColorAppearance.prototype
     *
     * @type {Boolean}
     * @readonly
     *
     * @default false
     */
    closed: {
      get: function () {
        return this._closed;
      },
    },

    /**
     * The {@link VertexFormat} that this appearance instance is compatible with.
     * A geometry can have more vertex attributes and still be compatible - at a
     * potential performance cost - but it can't have less.
     *
     * @memberof PerInstanceColorAppearance.prototype
     *
     * @type VertexFormat
     * @readonly
     */
    vertexFormat: {
      get: function () {
        return this._vertexFormat;
      },
    },

    /**
     * When <code>true</code>, flat shading is used in the fragment shader,
     * which means lighting is not taking into account.
     *
     * @memberof PerInstanceColorAppearance.prototype
     *
     * @type {Boolean}
     * @readonly
     *
     * @default false
     */
    flat: {
      get: function () {
        return this._flat;
      },
    },

    /**
     * When <code>true</code>, the fragment shader flips the surface normal
     * as needed to ensure that the normal faces the viewer to avoid
     * dark spots.  This is useful when both sides of a geometry should be
     * shaded like {@link WallGeometry}.
     *
     * @memberof PerInstanceColorAppearance.prototype
     *
     * @type {Boolean}
     * @readonly
     *
     * @default true
     */
    faceForward: {
      get: function () {
        return this._faceForward;
      },
    },
  });

  /**
   * The {@link VertexFormat} that all {@link PerInstanceColorAppearance} instances
   * are compatible with.  This requires only <code>position</code> and <code>normal</code>
   * attributes.
   *
   * @type VertexFormat
   *
   * @constant
   */
  PerInstanceColorAppearance.VERTEX_FORMAT = VertexFormat.VertexFormat.POSITION_AND_NORMAL;

  /**
   * The {@link VertexFormat} that all {@link PerInstanceColorAppearance} instances
   * are compatible with when {@link PerInstanceColorAppearance#flat} is <code>true</code>.
   * This requires only a <code>position</code> attribute.
   *
   * @type VertexFormat
   *
   * @constant
   */
  PerInstanceColorAppearance.FLAT_VERTEX_FORMAT = VertexFormat.VertexFormat.POSITION_ONLY;

  /**
   * Procedurally creates the full GLSL fragment shader source.  For {@link PerInstanceColorAppearance},
   * this is derived from {@link PerInstanceColorAppearance#fragmentShaderSource}, {@link PerInstanceColorAppearance#flat},
   * and {@link PerInstanceColorAppearance#faceForward}.
   *
   * @function
   *
   * @returns {String} The full GLSL fragment shader source.
   */
  PerInstanceColorAppearance.prototype.getFragmentShaderSource =
    Appearance.prototype.getFragmentShaderSource;

  /**
   * Determines if the geometry is translucent based on {@link PerInstanceColorAppearance#translucent}.
   *
   * @function
   *
   * @returns {Boolean} <code>true</code> if the appearance is translucent.
   */
  PerInstanceColorAppearance.prototype.isTranslucent =
    Appearance.prototype.isTranslucent;

  /**
   * Creates a render state.  This is not the final render state instance; instead,
   * it can contain a subset of render state properties identical to the render state
   * created in the context.
   *
   * @function
   *
   * @returns {Object} The render state.
   */
  PerInstanceColorAppearance.prototype.getRenderState =
    Appearance.prototype.getRenderState;

  /**
   * Values and type information for per-instance geometry attributes.
   *
   * @alias GeometryInstanceAttribute
   * @constructor
   *
   * @param {Object} options Object with the following properties:
   * @param {ComponentDatatype} options.componentDatatype The datatype of each component in the attribute, e.g., individual elements in values.
   * @param {Number} options.componentsPerAttribute A number between 1 and 4 that defines the number of components in an attributes.
   * @param {Boolean} [options.normalize=false] When <code>true</code> and <code>componentDatatype</code> is an integer format, indicate that the components should be mapped to the range [0, 1] (unsigned) or [-1, 1] (signed) when they are accessed as floating-point for rendering.
   * @param {Number[]} options.value The value for the attribute.
   *
   * @exception {DeveloperError} options.componentsPerAttribute must be between 1 and 4.
   *
   *
   * @example
   * const instance = new Cesium.GeometryInstance({
   *   geometry : Cesium.BoxGeometry.fromDimensions({
   *     dimensions : new Cesium.Cartesian3(1000000.0, 1000000.0, 500000.0)
   *   }),
   *   modelMatrix : Cesium.Matrix4.multiplyByTranslation(Cesium.Transforms.eastNorthUpToFixedFrame(
   *     Cesium.Cartesian3.fromDegrees(0.0, 0.0)), new Cesium.Cartesian3(0.0, 0.0, 1000000.0), new Cesium.Matrix4()),
   *   id : 'box',
   *   attributes : {
   *     color : new Cesium.GeometryInstanceAttribute({
   *       componentDatatype : Cesium.ComponentDatatype.UNSIGNED_BYTE,
   *       componentsPerAttribute : 4,
   *       normalize : true,
   *       value : [255, 255, 0, 255]
   *     })
   *   }
   * });
   *
   * @see ColorGeometryInstanceAttribute
   * @see ShowGeometryInstanceAttribute
   * @see DistanceDisplayConditionGeometryInstanceAttribute
   */
  function GeometryInstanceAttribute(options) {
    options = defined.defaultValue(options, defined.defaultValue.EMPTY_OBJECT);

    //>>includeStart('debug', pragmas.debug);
    if (!defined.defined(options.componentDatatype)) {
      throw new Check.DeveloperError("options.componentDatatype is required.");
    }
    if (!defined.defined(options.componentsPerAttribute)) {
      throw new Check.DeveloperError("options.componentsPerAttribute is required.");
    }
    if (
      options.componentsPerAttribute < 1 ||
      options.componentsPerAttribute > 4
    ) {
      throw new Check.DeveloperError(
        "options.componentsPerAttribute must be between 1 and 4."
      );
    }
    if (!defined.defined(options.value)) {
      throw new Check.DeveloperError("options.value is required.");
    }
    //>>includeEnd('debug');

    /**
     * The datatype of each component in the attribute, e.g., individual elements in
     * {@link GeometryInstanceAttribute#value}.
     *
     * @type ComponentDatatype
     *
     * @default undefined
     */
    this.componentDatatype = options.componentDatatype;

    /**
     * A number between 1 and 4 that defines the number of components in an attributes.
     * For example, a position attribute with x, y, and z components would have 3 as
     * shown in the code example.
     *
     * @type Number
     *
     * @default undefined
     *
     * @example
     * show : new Cesium.GeometryInstanceAttribute({
     *   componentDatatype : Cesium.ComponentDatatype.UNSIGNED_BYTE,
     *   componentsPerAttribute : 1,
     *   normalize : true,
     *   value : [1.0]
     * })
     */
    this.componentsPerAttribute = options.componentsPerAttribute;

    /**
     * When <code>true</code> and <code>componentDatatype</code> is an integer format,
     * indicate that the components should be mapped to the range [0, 1] (unsigned)
     * or [-1, 1] (signed) when they are accessed as floating-point for rendering.
     * <p>
     * This is commonly used when storing colors using {@link ComponentDatatype.UNSIGNED_BYTE}.
     * </p>
     *
     * @type Boolean
     *
     * @default false
     *
     * @example
     * attribute.componentDatatype = Cesium.ComponentDatatype.UNSIGNED_BYTE;
     * attribute.componentsPerAttribute = 4;
     * attribute.normalize = true;
     * attribute.value = [
     *   Cesium.Color.floatToByte(color.red),
     *   Cesium.Color.floatToByte(color.green),
     *   Cesium.Color.floatToByte(color.blue),
     *   Cesium.Color.floatToByte(color.alpha)
     * ];
     */
    this.normalize = defined.defaultValue(options.normalize, false);

    /**
     * The values for the attributes stored in a typed array.  In the code example,
     * every three elements in <code>values</code> defines one attributes since
     * <code>componentsPerAttribute</code> is 3.
     *
     * @type {Number[]}
     *
     * @default undefined
     *
     * @example
     * show : new Cesium.GeometryInstanceAttribute({
     *   componentDatatype : Cesium.ComponentDatatype.UNSIGNED_BYTE,
     *   componentsPerAttribute : 1,
     *   normalize : true,
     *   value : [1.0]
     * })
     */
    this.value = options.value;
  }

  /**
   * Creates a texture to look up per instance attributes for batched primitives. For example, store each primitive's pick color in the texture.
   *
   * @alias BatchTable
   * @constructor
   * @private
   *
   * @param {Context} context The context in which the batch table is created.
   * @param {Object[]} attributes An array of objects describing a per instance attribute. Each object contains a datatype, components per attributes, whether it is normalized and a function name
   *     to retrieve the value in the vertex shader.
   * @param {Number} numberOfInstances The number of instances in a batch table.
   *
   * @example
   * // create the batch table
   * const attributes = [{
   *     functionName : 'getShow',
   *     componentDatatype : ComponentDatatype.UNSIGNED_BYTE,
   *     componentsPerAttribute : 1
   * }, {
   *     functionName : 'getPickColor',
   *     componentDatatype : ComponentDatatype.UNSIGNED_BYTE,
   *     componentsPerAttribute : 4,
   *     normalize : true
   * }];
   * const batchTable = new BatchTable(context, attributes, 5);
   *
   * // when creating the draw commands, update the uniform map and the vertex shader
   * vertexShaderSource = batchTable.getVertexShaderCallback()(vertexShaderSource);
   * const shaderProgram = ShaderProgram.fromCache({
   *    // ...
   *    vertexShaderSource : vertexShaderSource,
   * });
   *
   * drawCommand.shaderProgram = shaderProgram;
   * drawCommand.uniformMap = batchTable.getUniformMapCallback()(uniformMap);
   *
   * // use the attribute function names in the shader to retrieve the instance values
   * // ...
   * attribute float batchId;
   *
   * void main() {
   *     // ...
   *     float show = getShow(batchId);
   *     vec3 pickColor = getPickColor(batchId);
   *     // ...
   * }
   */
  function BatchTable(context, attributes, numberOfInstances) {
    //>>includeStart('debug', pragmas.debug);
    if (!defined.defined(context)) {
      throw new Check.DeveloperError("context is required");
    }
    if (!defined.defined(attributes)) {
      throw new Check.DeveloperError("attributes is required");
    }
    if (!defined.defined(numberOfInstances)) {
      throw new Check.DeveloperError("numberOfInstances is required");
    }
    //>>includeEnd('debug');

    this._attributes = attributes;
    this._numberOfInstances = numberOfInstances;

    if (attributes.length === 0) {
      return;
    }

    // PERFORMANCE_IDEA: We may be able to arrange the attributes so they can be packing into fewer texels.
    // Right now, an attribute with one component uses an entire texel when 4 single component attributes can
    // be packed into a texel.
    //
    // Packing floats into unsigned byte textures makes the problem worse. A single component float attribute
    // will be packed into a single texel leaving 3 texels unused. 4 texels are reserved for each float attribute
    // regardless of how many components it has.
    const pixelDatatype = getDatatype(attributes);
    const textureFloatSupported = context.floatingPointTexture;
    const packFloats =
      pixelDatatype === PixelFormat.PixelDatatype.FLOAT && !textureFloatSupported;
    const offsets = createOffsets(attributes, packFloats);

    const stride = getStride(offsets, attributes, packFloats);
    const maxNumberOfInstancesPerRow = Math.floor(
      ContextLimits$1.maximumTextureSize / stride
    );

    const instancesPerWidth = Math.min(
      numberOfInstances,
      maxNumberOfInstancesPerRow
    );
    const width = stride * instancesPerWidth;
    const height = Math.ceil(numberOfInstances / instancesPerWidth);

    const stepX = 1.0 / width;
    const centerX = stepX * 0.5;
    const stepY = 1.0 / height;
    const centerY = stepY * 0.5;

    this._textureDimensions = new Cartesian2.Cartesian2(width, height);
    this._textureStep = new Matrix2.Cartesian4(stepX, centerX, stepY, centerY);
    this._pixelDatatype = !packFloats
      ? pixelDatatype
      : PixelFormat.PixelDatatype.UNSIGNED_BYTE;
    this._packFloats = packFloats;
    this._offsets = offsets;
    this._stride = stride;
    this._texture = undefined;

    const batchLength = 4 * width * height;
    this._batchValues =
      pixelDatatype === PixelFormat.PixelDatatype.FLOAT && !packFloats
        ? new Float32Array(batchLength)
        : new Uint8Array(batchLength);
    this._batchValuesDirty = false;
  }

  Object.defineProperties(BatchTable.prototype, {
    /**
     * The attribute descriptions.
     * @memberOf BatchTable.prototype
     * @type {Object[]}
     * @readonly
     */
    attributes: {
      get: function () {
        return this._attributes;
      },
    },
    /**
     * The number of instances.
     * @memberOf BatchTable.prototype
     * @type {Number}
     * @readonly
     */
    numberOfInstances: {
      get: function () {
        return this._numberOfInstances;
      },
    },
  });

  function getDatatype(attributes) {
    let foundFloatDatatype = false;
    const length = attributes.length;
    for (let i = 0; i < length; ++i) {
      if (attributes[i].componentDatatype !== ComponentDatatype.ComponentDatatype.UNSIGNED_BYTE) {
        foundFloatDatatype = true;
        break;
      }
    }
    return foundFloatDatatype ? PixelFormat.PixelDatatype.FLOAT : PixelFormat.PixelDatatype.UNSIGNED_BYTE;
  }

  function getAttributeType(attributes, attributeIndex) {
    const componentsPerAttribute =
      attributes[attributeIndex].componentsPerAttribute;
    if (componentsPerAttribute === 2) {
      return Cartesian2.Cartesian2;
    } else if (componentsPerAttribute === 3) {
      return Cartesian3.Cartesian3;
    } else if (componentsPerAttribute === 4) {
      return Matrix2.Cartesian4;
    }
    return Number;
  }

  function createOffsets(attributes, packFloats) {
    const offsets = new Array(attributes.length);

    let currentOffset = 0;
    const attributesLength = attributes.length;
    for (let i = 0; i < attributesLength; ++i) {
      const attribute = attributes[i];
      const componentDatatype = attribute.componentDatatype;

      offsets[i] = currentOffset;

      if (componentDatatype !== ComponentDatatype.ComponentDatatype.UNSIGNED_BYTE && packFloats) {
        currentOffset += 4;
      } else {
        ++currentOffset;
      }
    }

    return offsets;
  }

  function getStride(offsets, attributes, packFloats) {
    const length = offsets.length;
    const lastOffset = offsets[length - 1];
    const lastAttribute = attributes[length - 1];
    const componentDatatype = lastAttribute.componentDatatype;

    if (componentDatatype !== ComponentDatatype.ComponentDatatype.UNSIGNED_BYTE && packFloats) {
      return lastOffset + 4;
    }
    return lastOffset + 1;
  }

  const scratchPackedFloatCartesian4 = new Matrix2.Cartesian4();

  function getPackedFloat(array, index, result) {
    let packed = Matrix2.Cartesian4.unpack(array, index, scratchPackedFloatCartesian4);
    const x = Matrix2.Cartesian4.unpackFloat(packed);

    packed = Matrix2.Cartesian4.unpack(array, index + 4, scratchPackedFloatCartesian4);
    const y = Matrix2.Cartesian4.unpackFloat(packed);

    packed = Matrix2.Cartesian4.unpack(array, index + 8, scratchPackedFloatCartesian4);
    const z = Matrix2.Cartesian4.unpackFloat(packed);

    packed = Matrix2.Cartesian4.unpack(array, index + 12, scratchPackedFloatCartesian4);
    const w = Matrix2.Cartesian4.unpackFloat(packed);

    return Matrix2.Cartesian4.fromElements(x, y, z, w, result);
  }

  function setPackedAttribute(value, array, index) {
    let packed = Matrix2.Cartesian4.packFloat(value.x, scratchPackedFloatCartesian4);
    Matrix2.Cartesian4.pack(packed, array, index);

    packed = Matrix2.Cartesian4.packFloat(value.y, packed);
    Matrix2.Cartesian4.pack(packed, array, index + 4);

    packed = Matrix2.Cartesian4.packFloat(value.z, packed);
    Matrix2.Cartesian4.pack(packed, array, index + 8);

    packed = Matrix2.Cartesian4.packFloat(value.w, packed);
    Matrix2.Cartesian4.pack(packed, array, index + 12);
  }

  const scratchGetAttributeCartesian4 = new Matrix2.Cartesian4();

  /**
   * Gets the value of an attribute in the table.
   *
   * @param {Number} instanceIndex The index of the instance.
   * @param {Number} attributeIndex The index of the attribute.
   * @param {undefined|Cartesian2|Cartesian3|Cartesian4} [result] The object onto which to store the result. The type is dependent on the attribute's number of components.
   * @returns {Number|Cartesian2|Cartesian3|Cartesian4} The attribute value stored for the instance.
   *
   * @exception {DeveloperError} instanceIndex is out of range.
   * @exception {DeveloperError} attributeIndex is out of range.
   */
  BatchTable.prototype.getBatchedAttribute = function (
    instanceIndex,
    attributeIndex,
    result
  ) {
    //>>includeStart('debug', pragmas.debug);
    if (instanceIndex < 0 || instanceIndex >= this._numberOfInstances) {
      throw new Check.DeveloperError("instanceIndex is out of range.");
    }
    if (attributeIndex < 0 || attributeIndex >= this._attributes.length) {
      throw new Check.DeveloperError("attributeIndex is out of range");
    }
    //>>includeEnd('debug');

    const attributes = this._attributes;
    const offset = this._offsets[attributeIndex];
    const stride = this._stride;

    const index = 4 * stride * instanceIndex + 4 * offset;
    let value;

    if (
      this._packFloats &&
      attributes[attributeIndex].componentDatatype !== PixelFormat.PixelDatatype.UNSIGNED_BYTE
    ) {
      value = getPackedFloat(
        this._batchValues,
        index,
        scratchGetAttributeCartesian4
      );
    } else {
      value = Matrix2.Cartesian4.unpack(
        this._batchValues,
        index,
        scratchGetAttributeCartesian4
      );
    }

    const attributeType = getAttributeType(attributes, attributeIndex);
    if (defined.defined(attributeType.fromCartesian4)) {
      return attributeType.fromCartesian4(value, result);
    } else if (defined.defined(attributeType.clone)) {
      return attributeType.clone(value, result);
    }

    return value.x;
  };

  const setAttributeScratchValues = [
    undefined,
    undefined,
    new Cartesian2.Cartesian2(),
    new Cartesian3.Cartesian3(),
    new Matrix2.Cartesian4(),
  ];
  const setAttributeScratchCartesian4 = new Matrix2.Cartesian4();

  /**
   * Sets the value of an attribute in the table.
   *
   * @param {Number} instanceIndex The index of the instance.
   * @param {Number} attributeIndex The index of the attribute.
   * @param {Number|Cartesian2|Cartesian3|Cartesian4} value The value to be stored in the table. The type of value will depend on the number of components of the attribute.
   *
   * @exception {DeveloperError} instanceIndex is out of range.
   * @exception {DeveloperError} attributeIndex is out of range.
   */
  BatchTable.prototype.setBatchedAttribute = function (
    instanceIndex,
    attributeIndex,
    value
  ) {
    //>>includeStart('debug', pragmas.debug);
    if (instanceIndex < 0 || instanceIndex >= this._numberOfInstances) {
      throw new Check.DeveloperError("instanceIndex is out of range.");
    }
    if (attributeIndex < 0 || attributeIndex >= this._attributes.length) {
      throw new Check.DeveloperError("attributeIndex is out of range");
    }
    if (!defined.defined(value)) {
      throw new Check.DeveloperError("value is required.");
    }
    //>>includeEnd('debug');

    const attributes = this._attributes;
    const result =
      setAttributeScratchValues[
        attributes[attributeIndex].componentsPerAttribute
      ];
    const currentAttribute = this.getBatchedAttribute(
      instanceIndex,
      attributeIndex,
      result
    );
    const attributeType = getAttributeType(this._attributes, attributeIndex);
    const entriesEqual = defined.defined(attributeType.equals)
      ? attributeType.equals(currentAttribute, value)
      : currentAttribute === value;
    if (entriesEqual) {
      return;
    }

    const attributeValue = setAttributeScratchCartesian4;
    attributeValue.x = defined.defined(value.x) ? value.x : value;
    attributeValue.y = defined.defined(value.y) ? value.y : 0.0;
    attributeValue.z = defined.defined(value.z) ? value.z : 0.0;
    attributeValue.w = defined.defined(value.w) ? value.w : 0.0;

    const offset = this._offsets[attributeIndex];
    const stride = this._stride;
    const index = 4 * stride * instanceIndex + 4 * offset;

    if (
      this._packFloats &&
      attributes[attributeIndex].componentDatatype !== PixelFormat.PixelDatatype.UNSIGNED_BYTE
    ) {
      setPackedAttribute(attributeValue, this._batchValues, index);
    } else {
      Matrix2.Cartesian4.pack(attributeValue, this._batchValues, index);
    }

    this._batchValuesDirty = true;
  };

  function createTexture(batchTable, context) {
    const dimensions = batchTable._textureDimensions;
    batchTable._texture = new Texture({
      context: context,
      pixelFormat: PixelFormat.PixelFormat.RGBA,
      pixelDatatype: batchTable._pixelDatatype,
      width: dimensions.x,
      height: dimensions.y,
      sampler: Sampler.NEAREST,
      flipY: false,
    });
  }

  function updateTexture(batchTable) {
    const dimensions = batchTable._textureDimensions;
    batchTable._texture.copyFrom({
      source: {
        width: dimensions.x,
        height: dimensions.y,
        arrayBufferView: batchTable._batchValues,
      },
    });
  }

  /**
   * Creates/updates the batch table texture.
   * @param {FrameState} frameState The frame state.
   *
   * @exception {RuntimeError} The floating point texture extension is required but not supported.
   */
  BatchTable.prototype.update = function (frameState) {
    if (
      (defined.defined(this._texture) && !this._batchValuesDirty) ||
      this._attributes.length === 0
    ) {
      return;
    }

    this._batchValuesDirty = false;

    if (!defined.defined(this._texture)) {
      createTexture(this, frameState.context);
    }
    updateTexture(this);
  };

  /**
   * Gets a function that will update a uniform map to contain values for looking up values in the batch table.
   *
   * @returns {BatchTable.updateUniformMapCallback} A callback for updating uniform maps.
   */
  BatchTable.prototype.getUniformMapCallback = function () {
    const that = this;
    return function (uniformMap) {
      if (that._attributes.length === 0) {
        return uniformMap;
      }

      const batchUniformMap = {
        batchTexture: function () {
          return that._texture;
        },
        batchTextureDimensions: function () {
          return that._textureDimensions;
        },
        batchTextureStep: function () {
          return that._textureStep;
        },
      };
      return combine.combine(uniformMap, batchUniformMap);
    };
  };

  function getGlslComputeSt(batchTable) {
    const stride = batchTable._stride;

    // GLSL batchId is zero-based: [0, numberOfInstances - 1]
    if (batchTable._textureDimensions.y === 1) {
      return (
        `${
        "uniform vec4 batchTextureStep; \n" +
        "vec2 computeSt(float batchId) \n" +
        "{ \n" +
        "    float stepX = batchTextureStep.x; \n" +
        "    float centerX = batchTextureStep.y; \n" +
        "    float numberOfAttributes = float("
      }${stride}); \n` +
        `    return vec2(centerX + (batchId * numberOfAttributes * stepX), 0.5); \n` +
        `} \n`
      );
    }

    return (
      `${
      "uniform vec4 batchTextureStep; \n" +
      "uniform vec2 batchTextureDimensions; \n" +
      "vec2 computeSt(float batchId) \n" +
      "{ \n" +
      "    float stepX = batchTextureStep.x; \n" +
      "    float centerX = batchTextureStep.y; \n" +
      "    float stepY = batchTextureStep.z; \n" +
      "    float centerY = batchTextureStep.w; \n" +
      "    float numberOfAttributes = float("
    }${stride}); \n` +
      `    float xId = mod(batchId * numberOfAttributes, batchTextureDimensions.x); \n` +
      `    float yId = floor(batchId * numberOfAttributes / batchTextureDimensions.x); \n` +
      `    return vec2(centerX + (xId * stepX), centerY + (yId * stepY)); \n` +
      `} \n`
    );
  }

  function getComponentType(componentsPerAttribute) {
    if (componentsPerAttribute === 1) {
      return "float";
    }
    return `vec${componentsPerAttribute}`;
  }

  function getComponentSwizzle(componentsPerAttribute) {
    if (componentsPerAttribute === 1) {
      return ".x";
    } else if (componentsPerAttribute === 2) {
      return ".xy";
    } else if (componentsPerAttribute === 3) {
      return ".xyz";
    }
    return "";
  }

  function getGlslAttributeFunction(batchTable, attributeIndex) {
    const attributes = batchTable._attributes;
    const attribute = attributes[attributeIndex];
    const componentsPerAttribute = attribute.componentsPerAttribute;
    const functionName = attribute.functionName;
    const functionReturnType = getComponentType(componentsPerAttribute);
    const functionReturnValue = getComponentSwizzle(componentsPerAttribute);

    /*************新增开始**************/
    var attributeValueName =  "v_" + functionName;
    /*************新增结束**************/

    const offset = batchTable._offsets[attributeIndex];

    let glslFunction =
      `${functionReturnType} ${functionName}(float batchId) \n` +
      `{ \n` +
      `    vec2 st = computeSt(batchId); \n` +
      `    st.x += batchTextureStep.x * float(${offset}); \n`;

    if (
      batchTable._packFloats &&
      attribute.componentDatatype !== PixelFormat.PixelDatatype.UNSIGNED_BYTE
    ) {
      glslFunction +=
        "vec4 textureValue; \n" +
        "textureValue.x = czm_unpackFloat(texture2D(batchTexture, st)); \n" +
        "textureValue.y = czm_unpackFloat(texture2D(batchTexture, st + vec2(batchTextureStep.x, 0.0))); \n" +
        "textureValue.z = czm_unpackFloat(texture2D(batchTexture, st + vec2(batchTextureStep.x * 2.0, 0.0))); \n" +
        "textureValue.w = czm_unpackFloat(texture2D(batchTexture, st + vec2(batchTextureStep.x * 3.0, 0.0))); \n";
    } else {
      glslFunction += "    vec4 textureValue = texture2D(batchTexture, st); \n";
    }

    glslFunction += `    ${functionReturnType} value = textureValue${functionReturnValue}; \n`;

    if (
      batchTable._pixelDatatype === PixelFormat.PixelDatatype.UNSIGNED_BYTE &&
      attribute.componentDatatype === ComponentDatatype.ComponentDatatype.UNSIGNED_BYTE &&
      !attribute.normalize
    ) {
      glslFunction += "value *= 255.0; \n";
    } else if (
      batchTable._pixelDatatype === PixelFormat.PixelDatatype.FLOAT &&
      attribute.componentDatatype === ComponentDatatype.ComponentDatatype.UNSIGNED_BYTE &&
      attribute.normalize
    ) {
      glslFunction += "value /= 255.0; \n";
    }

    glslFunction += "    return value; \n" + "} \n";

    let varyingForAttribute = "varying " + functionReturnType + ' ' + attributeValueName + ";\n";
    return varyingForAttribute + glslFunction;
  }

  /**
   * Gets a function that will update a vertex shader to contain functions for looking up values in the batch table.
   *
   * @returns {BatchTable.updateVertexShaderSourceCallback} A callback for updating a vertex shader source.
   */
  BatchTable.prototype.getVertexShaderCallback = function () {
    const attributes = this._attributes;
    if (attributes.length === 0) {
      return function (source) {
        return source;
      };
    }

    let batchTableShader = "uniform highp sampler2D batchTexture; \n";
    batchTableShader += `${getGlslComputeSt(this)}\n`;

    /*************新增开始**************/
    var setValueBatchTableShader = [];
    /*************新增结束**************/

    const length = attributes.length;
    for (let i = 0; i < length; ++i) {
      batchTableShader += getGlslAttributeFunction(this, i);
      /*************新增开始**************/
      setValueBatchTableShader.push(setGlslAttributeValue(this,i));
      /*************新增结束**************/
    }

    /*************新增开始**************/
    setValueBatchTableShader = setValueBatchTableShader.join("");
    /*************新增结束**************/

    return function (source) {
      const mainIndex = source.indexOf("void main");
      const beforeMain = source.substring(0, mainIndex);
      const afterMain = source.substring(mainIndex);

      /*************新增开始**************/
      var length = afterMain.lastIndexOf('}');
      var a = afterMain.substr(0,length) + setValueBatchTableShader + afterMain.substr(length) ;
      return beforeMain + '\n' + batchTableShader + '\n' + a;
      /*************新增结束**************/
    };
  };

  /*************新增开始**************/
  BatchTable.prototype.NOTGlslAutoAttributeArray = function(){
    return ['czm_batchTable_color','czm_batchTable_pickColor','czm_batchTable_show','czm_batchTable_distanceDisplayCondition',
      'czm_batchTable_width','czm_batchTable_boundingSphereCenter3DHigh','czm_batchTable_boundingSphereCenter3DLow',
      'czm_batchTable_boundingSphereCenter2DHigh','czm_batchTable_boundingSphereCenter2DLow','czm_batchTable_boundingSphereRadius']
  };

  function setGlslAttributeValue(batchTable, attributeIndex) {

    var attributes = batchTable._attributes;
    var attribute = attributes[attributeIndex];
    var functionName = attribute.functionName;
    if(batchTable.NOTGlslAutoAttributeArray().indexOf(functionName) != -1){
      return "";
    }

    var attributeValueName =  "v_" + functionName;
    var getAttribute = "    " + attributeValueName + " = " + functionName + '(batchId);\n';
    return getAttribute;
  }

  /**
   * 设置fs来适配接受传入属性的头
   */
  BatchTable.prototype.setFSAttributesHeader = function(fs){
    var attributes = this._attributes;
    if (attributes.length === 0) {
      return fs;
    }
    var fsAttributesHeader = [];
    for (var i = 0; i < attributes.length; ++i) {
      var attribute = this._attributes[i];
      var functionName = attribute.functionName;
      var componentsPerAttribute = attribute.componentsPerAttribute;
      var functionReturnType = getComponentType(componentsPerAttribute);
      if(this.NOTGlslAutoAttributeArray().indexOf(functionName) != -1){
        continue;
      }
      var attributeValueName =  "v_" + functionName;
      var varyingForAttribute = "varying " + functionReturnType + ' ' + attributeValueName + ";";
      fsAttributesHeader.push(varyingForAttribute);
    }

    return fsAttributesHeader.join("\n") + "\n" + fs;
  };
  /*************新增结束**************/

  /**
   * Returns true if this object was destroyed; otherwise, false.
   * <br /><br />
   * If this object was destroyed, it should not be used; calling any function other than
   * <code>isDestroyed</code> will result in a {@link DeveloperError} exception.
   *
   * @returns {Boolean} <code>true</code> if this object was destroyed; otherwise, <code>false</code>.
   *
   * @see BatchTable#destroy
   */
  BatchTable.prototype.isDestroyed = function () {
    return false;
  };

  /**
   * Destroys the WebGL resources held by this object.  Destroying an object allows for deterministic
   * release of WebGL resources, instead of relying on the garbage collector to destroy this object.
   * <br /><br />
   * Once an object is destroyed, it should not be used; calling any function other than
   * <code>isDestroyed</code> will result in a {@link DeveloperError} exception.  Therefore,
   * assign the return value (<code>undefined</code>) to the object as done in the example.
   *
   * @exception {DeveloperError} This object was destroyed, i.e., destroy() was called.
   *
   * @see BatchTable#isDestroyed
   */
  BatchTable.prototype.destroy = function () {
    this._texture = this._texture && this._texture.destroy();
    return destroyObject(this);
  };

  let geometryTypes = {
      MultiPolygon : processMultiPolygon,
      Polygon : processPolygon
  };

  let displayAttribute = new GeometryInstanceAttribute({
      componentDatatype : ComponentDatatype.ComponentDatatype.FLOAT ,
      componentsPerAttribute : 1,
      normalize : true,
      value :new Float32Array([1])
  });

  let polygonInstances = [];
  let waterInstances = [];
  let outlineInstances = [];
  let ridingLanternInstances = [];
  let level = 0;
  let options = {};
  let idIndex = 2000000000;

  ContextLimits$1._maximumTextureSize = 16384;
        function getPrimitiveData(featureMap,l,opts, transferableObjects) {
            polygonInstances = [];
            waterInstances = [];
            outlineInstances = [];
            level = l;
            options = opts;
            processTopology(featureMap);
            return triangulates(transferableObjects);
       }

          function processTopology(featureMap){
              for(let key in featureMap){
                  if(options.ridingLanternLayerId && options.ridingLanternLayerId.indexOf(key) > -1){
                      let features = featureMap[key];
                      processRidingLantern(features);
                  }else if(options.waterLayerId && options.waterLayerId.indexOf(key) > -1){
                      let features = featureMap[key];
                      processWater(features);
                  } else {
                      let features = featureMap[key];
                      processFeatures(features);
                  }
              }
          }

         function processRidingLantern(features){
              let polygons = [];
             for(let i = 0;i<features.length;i++){
                 let feature = features[i];
                 polygons = polygons.concat(feature.polygons);
             }

              if(polygons.length == 0){
                  return;
              }

              let getRidingLanternGeometry = new GetRidingLanternGeometry({
                  positions:polygons,//[世界坐标集合]
                  height:options.ridingLanternHeight,//拉伸高度
                  speed:options.ridingLanternSpeed,//扫描速度
                  type :options.ridingLanternType,//扫描类型,1代表上下扫描，-1代表左右扫描
                  direction:1,//扫描方向,1，-1代表不同方向
                  // color:new Color(0.3,0.5,0.8,2.),
                  color:Cesium.Color.fromAlpha(Cesium.Color.fromCssColorString(options.ridingLanternColor),options.ridingLanternAlpha),
                  translucent:true
              });
             ridingLanternInstances = getRidingLanternGeometry.createGeometryInstances();
          }

          function processFeatures(features){
              if(features.length > 0){
                  let feature = features[0];
                  let typeHandler = geometryTypes[feature.type];
                  typeHandler(features);
              }
          }

          function processWater(features){
              for(let i = 0;i<features.length;i++){
                  let feature = features[i];
                  for(let j =0;j<feature.polygons.length;j++){
                      let positions = feature.polygons[j];
                      let polygonInstance = createWaterGeometry(feature.id,feature.properties,positions);
                      waterInstances.push(polygonInstance);
                  }
              }
          }

          function processPolygon(features) {
              let height = 0;
              let extrudedHeight = 0;
              for(let i = 0;i<features.length;i++){
                  let feature = features[i];

                  let style = feature.style;
                  let fillAttributes,strokeColor,strokeAttributes;

                  if(style){
                      let fillColor = getColor(style,'fillColor','fillOpacity');
                      fillAttributes = {color : ColorGeometryInstanceAttribute.fromColor(fillColor),display:displayAttribute};

                      if(style.stroke){
                          strokeColor = getColor(style,'strokeColor','strokeOpacity');
                          strokeAttributes = {color : ColorGeometryInstanceAttribute.fromColor(strokeColor),display:displayAttribute};
                      }
                  }


                  for(let j =0;j<feature.polygons.length;j++){
                      let positions = feature.polygons[j];
                      //房屋总高度
                      extrudedHeight = feature.totalHeight;
                      extrudedHeight = extrudedHeight?extrudedHeight:options.heightValue;
                      let polygonInstance = createPolygonGeometry(feature.id,feature.properties,positions,height,
                          extrudedHeight,fillAttributes);
                      polygonInstances.push(polygonInstance);

                      if(style && style.stroke){
                          let outlineInstance = createPolygonOutlineGeometry(feature.id,feature.properties,
                              positions,height,extrudedHeight,strokeAttributes);
                          outlineInstances.push(outlineInstance);
                      }
                  }
              }
          }

          function processMultiPolygon(features) {
              processPolygon(features);
          }


          function createWaterGeometry(id,properties,positions) {
              let height = 0;
              id = id +'_' +level+ '_water';
              return  new GeometryInstance.GeometryInstance({
                  id:id,
                  geometry:PolygonGeometry.PolygonGeometry.fromPositions({
                      height:height,
                      positions : positions,
                      vertexFormat :EllipsoidSurfaceAppearance.VERTEX_FORMAT
                  }),
                  attributes: {
                      display: displayAttribute
                  },
                  properties:properties
              });
          }


          function getColor(style,colorField,opacityField){
              let cf = style[colorField];
              if(options.hasOwnProperty('fillColor')){
                  cf = options.fillColor;
              }

              let color;
              if (defined.defined(cf)) {
                  color = Color.Color.fromCssColorString(cf);
                  if(!defined.defined(color)){
                      color = Color.Color.fromCssColorString('#ffffff');
                  }
                  color.alpha = 1.0;
              }

              let opacity = style[opacityField];
              if(options.hasOwnProperty('opacity')){
                  opacity = options.opacity;
              }

              if (defined.defined(opacity) && opacity !== 1.0) {
                  color.alpha = opacity;
              }
              return color;
          }

          function createPolygonGeometry(id,properties,positions,height,extrudedHeight,attributes) {
              id = id +'_' +level+ '_polygon';
              if(options.translucentMaterial){
                  let geometryInstance = new GeometryInstance.GeometryInstance({
                      id:id,
                      geometry:PolygonGeometry.PolygonGeometry.fromPositions({
                          height:height,
                          extrudedHeight:extrudedHeight,
                          positions : positions,
                      }),
                      properties:properties
                  });

                  if(attributes){
                      geometryInstance.attributes = attributes;
                  }

                  return geometryInstance;
              }else {
                  let geometryInstance = new GeometryInstance.GeometryInstance({
                      id:id,
                      geometry:PolygonGeometry.PolygonGeometry.fromPositions({
                          height:height,
                          extrudedHeight:extrudedHeight,
                          positions : positions,
                          vertexFormat :PerInstanceColorAppearance.VERTEX_FORMAT
                      }),
                      properties:properties
                  });

                  if(attributes){
                      geometryInstance.attributes = attributes;
                  }
                  return geometryInstance;
              }
          }

          function createPolygonOutlineGeometry(id,properties,positions,height,extrudedHeight,attributes){
              id = id +'_' +level+ '_polygonOutLine';
              let geometryInstance = new GeometryInstance.GeometryInstance({
                  id:id,
                  geometry:PolygonOutlineGeometry.PolygonOutlineGeometry.fromPositions({
                      height:height,
                      extrudedHeight:extrudedHeight,
                      positions : positions,
                      vertexFormat :PerInstanceColorAppearance.VERTEX_FORMAT
                  }),
                  properties:properties
              });

              if(attributes){
                  geometryInstance.attributes = attributes;
              }

              return geometryInstance;
          }

          //三角化
          function triangulate(instances,transferableObjects){
              let length = instances.length;
              if(length  == 0){
                  return null;
              }

              var clonedInstances = new Array(length);
              var instanceIds = [];

              var instance;
              var i;

              var geometryIndex = 0;
              for (i = 0; i < length; i++) {
                  instance = instances[i];
                  var geometry = instance.geometry;

                  var createdGeometry;
                  if (defined.defined(geometry.attributes) && defined.defined(geometry.primitiveType)) {
                      createdGeometry = cloneGeometry(geometry);
                  } else {
                      createdGeometry = geometry.constructor.createGeometry(geometry);
                  }

                  clonedInstances[geometryIndex++] = cloneInstance(instance, createdGeometry);
                  instanceIds.push(instance.id);
              }

              clonedInstances.length = geometryIndex;


              var ellipsoid = Cartesian2.Ellipsoid.WGS84;
              var projection = new GeographicProjection.GeographicProjection(ellipsoid);

              var result = PrimitivePipeline.PrimitivePipeline.combineGeometry({
                  instances : clonedInstances,
                  ellipsoid : projection.ellipsoid,
                  projection : projection,
                  elementIndexUintSupported :true,
                  scene3DOnly : false,
                  vertexCacheOptimize : false,
                  compressVertices : true,
                  modelMatrix : Matrix2.Matrix4.IDENTITY,
                  createPickOffsets : undefined
              });
              return PrimitivePipeline.PrimitivePipeline.packCombineGeometryResults(result, transferableObjects);
          }

          function cloneInstance(instance, geometry) {
              return {
                  geometry : geometry,
                  attributes: instance.attributes,
                  modelMatrix : Matrix2.Matrix4.clone(instance.modelMatrix),
                  pickPrimitive : instance.pickPrimitive,
                  id : instance.id
              };
          }

          function triangulates(transferableObjects){
              var polygonResults = triangulate(polygonInstances,transferableObjects);
              var waterResults = triangulate(waterInstances,transferableObjects);
              var outlineResults =  triangulate(outlineInstances,transferableObjects);
              var ridingLanternResults = triangulate(ridingLanternInstances,transferableObjects);

              let results = {};
              if(polygonResults){
                  let table = createBatchTable(polygonInstances,transferableObjects);
                  mergeAttributes(table,polygonResults);
                  results.polygon = polygonResults;
              }
              if(waterResults){
                  let table = createBatchTable(waterInstances,transferableObjects);
                  mergeAttributes(table,waterResults);
                  results.water = waterResults;
              }
              if(outlineResults){
                  let table = createBatchTable(outlineInstances,transferableObjects);
                  mergeAttributes(table,outlineResults);
                  results.outline = outlineResults;
              }

              if(ridingLanternResults){
                  let table = createBatchTable(ridingLanternInstances,transferableObjects);
                  mergeAttributes(table,ridingLanternResults);
                  results.ridingLantern = ridingLanternResults;
              }
              return results;
          }

          function mergeAttributes(table,result){
              result.attributes = table.attributes;
              result.attributeIndices = table.attributeIndices;
              result.batchValues = table.batchValues;
              result.propertiesMapBuffer = table.propertiesMapBuffer;
              result.pickId = table.pickId;
              result.ids = table.ids;
          }

          function cloneGeometry(geometry) {
              var attributes = geometry.attributes;
              var newAttributes = new GeometryAttributes.GeometryAttributes();
              for (var property in attributes) {
                  if (attributes.hasOwnProperty(property) && defined.defined(attributes[property])) {
                      newAttributes[property] = cloneAttribute(attributes[property]);
                  }
              }

              var indices;
              if (defined.defined(geometry.indices)) {
                  var sourceValues = geometry.indices;
                  if (Array.isArray(sourceValues)) {
                      indices = sourceValues.slice(0);
                  } else {
                      indices = new sourceValues.constructor(sourceValues);
                  }
              }

              return new GeometryAttribute.Geometry({
                  attributes : newAttributes,
                  indices : indices,
                  primitiveType : geometry.primitiveType,
                  boundingSphere : Transforms.BoundingSphere.clone(geometry.boundingSphere)
              });
          }

          function cloneAttribute(attribute) {
              var clonedValues;
              if (Array.isArray(attribute.values)) {
                  clonedValues = attribute.values.slice(0);
              } else {
                  clonedValues = new attribute.values.constructor(attribute.values);
              }
              return new GeometryAttribute.GeometryAttribute({
                  componentDatatype : attribute.componentDatatype,
                  componentsPerAttribute : attribute.componentsPerAttribute,
                  normalize : attribute.normalize,
                  values : clonedValues
              });
          }

      function createBatchTable(instances,transferableObjects) {
          /*************新增开始**************/
          /**
           * 往geometryInstances中增加需要的Plugin中默认的属性类型,并且检查是否是否含有Plugin中的属性
           */
          // primitive.primitivePlugin.checkAndAddAttributeIntoGeometryInstances(geometryInstances);
          /*************新增结束**************/
          var scratchGetAttributeCartesian2 = new Cartesian2.Cartesian2();
          var scratchGetAttributeCartesian3 = new Cartesian3.Cartesian3();
          var scratchGetAttributeCartesian4 = new Matrix2.Cartesian4();


          var context = {floatingPointTexture:true};
          var numberOfInstances = instances.length;
          var names = getCommonPerInstanceAttributeNames(instances);
          var length = names.length;

          var ids = [];

          var attributes = [];
          var attributeIndices = {};

          var firstInstance = instances[0];
          var instanceAttributes = firstInstance.attributes;

          var i;
          var name;
          var attribute;

          for (i = 0; i < length; ++i) {
              name = names[i];
              attribute = instanceAttributes[name];

              attributeIndices[name] = i;
              attributes.push({
                  functionName : 'czm_batchTable_' + name,
                  componentDatatype : attribute.componentDatatype,
                  componentsPerAttribute : attribute.componentsPerAttribute,
                  normalize : attribute.normalize
              });
          }

          if (names.indexOf('distanceDisplayCondition') !== -1) {
              attributes.push({
                  functionName : 'czm_batchTable_boundingSphereCenter3DHigh',
                  componentDatatype : ComponentDatatype.ComponentDatatype.FLOAT,
                  componentsPerAttribute : 3
              }, {
                  functionName : 'czm_batchTable_boundingSphereCenter3DLow',
                  componentDatatype : ComponentDatatype.ComponentDatatype.FLOAT,
                  componentsPerAttribute : 3
              }, {
                  functionName : 'czm_batchTable_boundingSphereCenter2DHigh',
                  componentDatatype : ComponentDatatype.ComponentDatatype.FLOAT,
                  componentsPerAttribute : 3
              }, {
                  functionName : 'czm_batchTable_boundingSphereCenter2DLow',
                  componentDatatype : ComponentDatatype.ComponentDatatype.FLOAT,
                  componentsPerAttribute : 3
              }, {
                  functionName : 'czm_batchTable_boundingSphereRadius',
                  componentDatatype : ComponentDatatype.ComponentDatatype.FLOAT,
                  componentsPerAttribute : 1
              });
              attributes.length - 5;
              attributes.length - 4;
              attributes.length - 3;
              attributes.length - 2;
              attributes.length - 1;
          }

          if (names.indexOf('offset') !== -1) {
              attributes.push({
                  functionName : 'czm_batchTable_offset2D',
                  componentDatatype : ComponentDatatype.ComponentDatatype.FLOAT,
                  componentsPerAttribute : 3
              });
              attributes.length - 1;
          }

          attributes.push({
              functionName : 'czm_batchTable_pickColor',
              componentDatatype : ComponentDatatype.ComponentDatatype.UNSIGNED_BYTE,
              componentsPerAttribute : 4,
              normalize : true
          });

          var attributesLength = attributes.length;
          var batchTable = new BatchTable(context, attributes, numberOfInstances);

          let pickId = idIndex;
          let propertiesMap = {};
          let properties = false;
          for (i = 0; i < numberOfInstances; ++i) {
              var instance = instances[i];
              if(instance.properties){
                  propertiesMap[instance.id] = instance.properties;
                  properties = true;
              }
              instanceAttributes = instance.attributes;

              for (var j = 0; j < length; ++j) {
                  name = names[j];
                  attribute = instanceAttributes[name];
                  var value = getAttributeValue(attribute.value,scratchGetAttributeCartesian2,scratchGetAttributeCartesian3,scratchGetAttributeCartesian4);
                  var attributeIndex = attributeIndices[name];
                  batchTable.setBatchedAttribute(i, attributeIndex, value);
              }

              ids.push(instance.id);
              idIndex++;
              var pickColor = Color.Color.fromRgba(idIndex);
              var color = scratchGetAttributeCartesian4;
              color.x = Color.Color.floatToByte(pickColor.red);
              color.y = Color.Color.floatToByte(pickColor.green);
              color.z = Color.Color.floatToByte(pickColor.blue);
              color.w = Color.Color.floatToByte(pickColor.alpha);

              batchTable.setBatchedAttribute(i, attributesLength - 1, color);
          }


          var batchValues = batchTable._batchValues;
          transferableObjects.push(batchValues.buffer);

          var propertiesMapBuffer;
          if(properties){
              var str = JSON.stringify(propertiesMap);
              propertiesMapBuffer = strToArrayBuffer(str);
          }else {
              propertiesMapBuffer = new ArrayBuffer(0);
          }

          transferableObjects.push(propertiesMapBuffer);
          return {attributes,attributeIndices,batchValues,propertiesMapBuffer,ids,pickId};
      }

      function strToArrayBuffer(str){
          var buf = new ArrayBuffer(str.length * 2); // 每个字符占用2个字节
          var bufView = new Uint16Array(buf);
          for (var i = 0, strLen = str.length; i < strLen; i++) {
              bufView[i] = str.charCodeAt(i);
          }
          return buf;
      }


  function getAttributeValue(value,scratchGetAttributeCartesian2,scratchGetAttributeCartesian3,scratchGetAttributeCartesian4) {
      var componentsPerAttribute = value.length;
      if (componentsPerAttribute === 1) {
          return value[0];
      } else if (componentsPerAttribute === 2) {
          return Cartesian2.Cartesian2.unpack(value, 0, scratchGetAttributeCartesian2);
      } else if (componentsPerAttribute === 3) {
          return Cartesian3.Cartesian3.unpack(value, 0, scratchGetAttributeCartesian3);
      } else if (componentsPerAttribute === 4) {
          return Matrix2.Cartesian4.unpack(value, 0, scratchGetAttributeCartesian4);
      }
  }

      function getCommonPerInstanceAttributeNames(instances) {
          var length = instances.length;

          var attributesInAllInstances = [];
          var attributes0 = instances[0].attributes;
          var name;

          for (name in attributes0) {
              if (attributes0.hasOwnProperty(name) && defined.defined(attributes0[name])) {
                  var attribute = attributes0[name];
                  var inAllInstances = true;

                  // Does this same attribute exist in all instances?
                  for (var i = 1; i < length; ++i) {
                      var otherAttribute = instances[i].attributes[name];

                      if (!defined.defined(otherAttribute) ||
                          (attribute.componentDatatype !== otherAttribute.componentDatatype) ||
                          (attribute.componentsPerAttribute !== otherAttribute.componentsPerAttribute) ||
                          (attribute.normalize !== otherAttribute.normalize)) {

                          inAllInstances = false;
                          break;
                      }
                  }

                  if (inAllInstances) {
                      attributesInAllInstances.push(name);
                  }
              }
          }
          return attributesInAllInstances;
      }

  return getPrimitiveData;

}));
//# sourceMappingURL=GetPrimitiveData.js.map
