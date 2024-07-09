#version 300 es
#define WEBGL_2

#ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
    precision highp int;
#else
    precision mediump float;
    precision mediump int;
    #define highp mediump
#endif

#define USE_IBL_LIGHTING
#define USE_SUN_LUMINANCE
#define HAS_c_PLANES
#define CLIPPING_PLANES_LENGTH 4
#define USE_CLIPPING_PLANES_FLOAT_TEXTURE
#define CLIPPING_PLANES_TEXTURE_WIDTH 4
#define CLIPPING_PLANES_TEXTURE_HEIGHT 2
#define HAS_TEXCOORD_0
#define USE_METALLIC_ROUGHNESS
#define HAS_BASE_COLOR_TEXTURE
#define TEXCOORD_BASE_COLOR v_texCoord_0
#define HAS_METALLIC_FACTOR
#define HAS_ROUGHNESS_FACTOR
#define LIGHTING_UNLIT
layout(location = 0) out vec4 czm_fragColor;
#define OUTPUT_DECLARATION

#define OES_texture_float_linear

#define OES_texture_float

uniform float czm_gamma;










struct czm_pbrParameters
{
    vec3 diffuseColor;
    float roughness;
    vec3 f0;
};
















const float czm_pi = 3.141592653589793;

uniform float czm_pixelRatio;
uniform vec2 czm_currentFrustum;
uniform float czm_orthographicIn3D;










const float czm_sceneMode2D = 2.0;

uniform float czm_sceneMode;
uniform vec4 czm_frustumPlanes;
uniform vec4 czm_viewport;
uniform float czm_log2FarDepthFromNearPlusOne;
uniform mat4 czm_inverseProjection;
uniform mat4 czm_viewportTransformation;










float czm_signNotZero(float value)
{
    return value >= 0.0 ? 1.0 : -1.0;
}

vec2 czm_signNotZero(vec2 value)
{
    return vec2(czm_signNotZero(value.x), czm_signNotZero(value.y));
}

vec3 czm_signNotZero(vec3 value)
{
    return vec3(czm_signNotZero(value.x), czm_signNotZero(value.y), czm_signNotZero(value.z));
}

vec4 czm_signNotZero(vec4 value)
{
    return vec4(czm_signNotZero(value.x), czm_signNotZero(value.y), czm_signNotZero(value.z), czm_signNotZero(value.w));
}







vec3 czm_linearToSrgb(vec3 linearIn) 
{
    return pow(linearIn, vec3(1.0/2.2));
}

vec4 czm_linearToSrgb(vec4 linearIn) 
{
    vec3 srgbOut = pow(linearIn.rgb, vec3(1.0/2.2));
    return vec4(srgbOut, linearIn.a);
}










vec3 czm_gammaCorrect(vec3 color) {
#ifdef HDR
    color = pow(color, vec3(czm_gamma));
#endif
    return color;
}

vec4 czm_gammaCorrect(vec4 color) {
#ifdef HDR
    color.rgb = pow(color.rgb, vec3(czm_gamma));
#endif
    return color;
}




vec3 czm_acesTonemapping(vec3 color) {
    float g = 0.985;
    float a = 0.065;
    float b = 0.0001;
    float c = 0.433;
    float d = 0.238;

    color = (color * (color + a) - b) / (color * (g * color + c) + d);

    color = clamp(color, 0.0, 1.0);

    return color;
}

uniform vec3 czm_lightDirectionEC;
vec3 lambertianDiffuse(vec3 diffuseColor)
{
    return diffuseColor / czm_pi;
}

vec3 fresnelSchlick2(vec3 f0, vec3 f90, float VdotH)
{
    return f0 + (f90 - f0) * pow(clamp(1.0 - VdotH, 0.0, 1.0), 5.0);
}

float smithVisibilityG1(float NdotV, float roughness)
{
    
    
    float k = (roughness + 1.0) * (roughness + 1.0) / 8.0;
    return NdotV / (NdotV * (1.0 - k) + k);
}

float smithVisibilityGGX(float roughness, float NdotL, float NdotV)
{
    return (
    smithVisibilityG1(NdotL, roughness) *
    smithVisibilityG1(NdotV, roughness)
    );
}

float GGX(float roughness, float NdotH)
{
    float roughnessSquared = roughness * roughness;
    float f = (NdotH * roughnessSquared - NdotH) * NdotH + 1.0;
    return roughnessSquared / (czm_pi * f * f);
}
































vec3 czm_pbrLighting(
vec3 positionEC,
vec3 normalEC,
vec3 lightDirectionEC,
vec3 lightColorHdr,
czm_pbrParameters pbrParameters
)
{
    vec3 v = -normalize(positionEC);
    vec3 l = normalize(lightDirectionEC);
    vec3 h = normalize(v + l);
    vec3 n = normalEC;
    float NdotL = clamp(dot(n, l), 0.001, 1.0);
    float NdotV = abs(dot(n, v)) + 0.001;
    float NdotH = clamp(dot(n, h), 0.0, 1.0);
    float LdotH = clamp(dot(l, h), 0.0, 1.0);
    float VdotH = clamp(dot(v, h), 0.0, 1.0);

    vec3 f0 = pbrParameters.f0;
    float reflectance = max(max(f0.r, f0.g), f0.b);
    vec3 f90 = vec3(clamp(reflectance * 25.0, 0.0, 1.0));
    vec3 F = fresnelSchlick2(f0, f90, VdotH);

    float alpha = pbrParameters.roughness;
    float G = smithVisibilityGGX(alpha, NdotL, NdotV);
    float D = GGX(alpha, NdotH);
    vec3 specularContribution = F * G * D / (4.0 * NdotL * NdotV);

    vec3 diffuseColor = pbrParameters.diffuseColor;
    
    vec3 diffuseContribution = (1.0 - F) * lambertianDiffuse(diffuseColor);

    
    return (diffuseContribution + specularContribution) * NdotL * lightColorHdr;
}

uniform vec3 czm_lightColorHdr;













czm_pbrParameters czm_pbrMetallicRoughnessMaterial(
    vec3 baseColor,
    float metallic,
    float roughness
) 
{
    czm_pbrParameters results;

    
    
    roughness = clamp(roughness, 0.0, 1.0);
    results.roughness = roughness * roughness;

    
    metallic = clamp(metallic, 0.0, 1.0);
    const vec3 REFLECTANCE_DIELECTRIC = vec3(0.04);
    vec3 f0 = mix(REFLECTANCE_DIELECTRIC, baseColor, metallic);
    results.f0 = f0;

    
    results.diffuseColor = baseColor * (1.0 - f0) * (1.0 - metallic);

    return results;
}














czm_pbrParameters czm_pbrSpecularGlossinessMaterial(
    vec3 diffuse,
    vec3 specular,
    float glossiness
) 
{
    czm_pbrParameters results;

    
    float roughness = 1.0 - glossiness;
    results.roughness = roughness * roughness;

    results.diffuseColor = diffuse * (1.0 - max(max(specular.r, specular.g), specular.b));
    results.f0 = specular;

    return results;
}





















struct czm_modelMaterial {
    vec3 diffuse;
    float alpha;
    vec3 specular;
    float roughness;
    vec3 normalEC;
    float occlusion;
    vec3 emissive;
};









bool czm_backFacing()
{
    
    return gl_FrontFacing == false;
}







const float czm_epsilon3 = 0.001;














float czm_branchFreeTernary(bool comparison, float a, float b) {
    float useA = float(comparison);
    return a * useA + b * (1.0 - useA);
}














vec2 czm_branchFreeTernary(bool comparison, vec2 a, vec2 b) {
    float useA = float(comparison);
    return a * useA + b * (1.0 - useA);
}














vec3 czm_branchFreeTernary(bool comparison, vec3 a, vec3 b) {
    float useA = float(comparison);
    return a * useA + b * (1.0 - useA);
}














vec4 czm_branchFreeTernary(bool comparison, vec4 a, vec4 b) {
    float useA = float(comparison);
    return a * useA + b * (1.0 - useA);
}














float czm_metersPerPixel(vec4 positionEC, float pixelRatio)
{
    float width = czm_viewport.z;
    float height = czm_viewport.w;
    float pixelWidth;
    float pixelHeight;

    float top = czm_frustumPlanes.x;
    float bottom = czm_frustumPlanes.y;
    float left = czm_frustumPlanes.z;
    float right = czm_frustumPlanes.w;

    if (czm_sceneMode == czm_sceneMode2D || czm_orthographicIn3D == 1.0)
    {
        float frustumWidth = right - left;
        float frustumHeight = top - bottom;
        pixelWidth = frustumWidth / width;
        pixelHeight = frustumHeight / height;
    }
    else
    {
        float distanceToPixel = -positionEC.z;
        float inverseNear = 1.0 / czm_currentFrustum.x;
        float tanTheta = top * inverseNear;
        pixelHeight = 2.0 * distanceToPixel * tanTheta / height;
        tanTheta = right * inverseNear;
        pixelWidth = 2.0 * distanceToPixel * tanTheta / width;
    }

    return max(pixelWidth, pixelHeight) * pixelRatio;
}













float czm_metersPerPixel(vec4 positionEC)
{
    return czm_metersPerPixel(positionEC, czm_pixelRatio);
}


























vec4 czm_windowToEyeCoordinates(vec4 fragmentCoordinate)
{
    
    float x = 2.0 * (fragmentCoordinate.x - czm_viewport.x) / czm_viewport.z - 1.0;
    float y = 2.0 * (fragmentCoordinate.y - czm_viewport.y) / czm_viewport.w - 1.0;
    float z = (fragmentCoordinate.z - czm_viewportTransformation[3][2]) / czm_viewportTransformation[2][2];
    vec4 q = vec4(x, y, z, 1.0);

    
    q /= fragmentCoordinate.w;

    
    if (!(czm_inverseProjection == mat4(0.0))) 
    {
        q = czm_inverseProjection * q;
    }
    else
    {
        float top = czm_frustumPlanes.x;
        float bottom = czm_frustumPlanes.y;
        float left = czm_frustumPlanes.z;
        float right = czm_frustumPlanes.w;

        float near = czm_currentFrustum.x;
        float far = czm_currentFrustum.y;

        q.x = (q.x * (right - left) + left + right) * 0.5;
        q.y = (q.y * (top - bottom) + bottom + top) * 0.5;
        q.z = (q.z * (near - far) - near - far) * 0.5;
        q.w = 1.0;
    }

    return q;
}





















vec4 czm_windowToEyeCoordinates(vec2 fragmentCoordinateXY, float depthOrLogDepth)
{
    
#ifdef LOG_DEPTH
    float near = czm_currentFrustum.x;
    float far = czm_currentFrustum.y;
    float log2Depth = depthOrLogDepth * czm_log2FarDepthFromNearPlusOne;
    float depthFromNear = pow(2.0, log2Depth) - 1.0;
    float depthFromCamera = depthFromNear + near;
    vec4 windowCoord = vec4(fragmentCoordinateXY, far * (1.0 - near / depthFromCamera) / (far - near), 1.0);
    vec4 eyeCoordinate = czm_windowToEyeCoordinates(windowCoord);
    eyeCoordinate.w = 1.0 / depthFromCamera; 
    return eyeCoordinate;
#else
    vec4 windowCoord = vec4(fragmentCoordinateXY, depthOrLogDepth, 1.0);
    vec4 eyeCoordinate = czm_windowToEyeCoordinates(windowCoord);
#endif
    return eyeCoordinate;
}











float czm_unpackFloat(vec4 packedFloat)
{
    
    packedFloat = floor(packedFloat * 255.0 + 0.5);
    float sign = 1.0 - step(128.0, packedFloat[3]) * 2.0;
    float exponent = 2.0 * mod(packedFloat[3], 128.0) + step(128.0, packedFloat[2]) - 127.0;    
    if (exponent == -127.0)
    {
        return 0.0;
    }
    float mantissa = mod(packedFloat[2], 128.0) * 65536.0 + packedFloat[1] * 256.0 + packedFloat[0] + float(0x800000);
    float result = sign * exp2(exponent - 23.0) * mantissa;
    return result;
}

 









  vec3 czm_octDecode(vec2 encoded, float range)
  {
      if (encoded.x == 0.0 && encoded.y == 0.0) {
          return vec3(0.0, 0.0, 0.0);
      }

     encoded = encoded / range * 2.0 - 1.0;
     vec3 v = vec3(encoded.x, encoded.y, 1.0 - abs(encoded.x) - abs(encoded.y));
     if (v.z < 0.0)
     {
         v.xy = (1.0 - abs(v.yx)) * czm_signNotZero(v.xy);
     }

     return normalize(v);
  }










 vec3 czm_octDecode(vec2 encoded)
 {
    return czm_octDecode(encoded, 255.0);
 }

 








 vec3 czm_octDecode(float encoded)
 {
    float temp = encoded / 256.0;
    float x = floor(temp);
    float y = (temp - x) * 256.0;
    return czm_octDecode(vec2(x, y));
 }












  void czm_octDecode(vec2 encoded, out vec3 vector1, out vec3 vector2, out vec3 vector3)
 {
    float temp = encoded.x / 65536.0;
    float x = floor(temp);
    float encodedFloat1 = (temp - x) * 65536.0;

    temp = encoded.y / 65536.0;
    float y = floor(temp);
    float encodedFloat2 = (temp - y) * 65536.0;

    vector1 = czm_octDecode(encodedFloat1);
    vector2 = czm_octDecode(encodedFloat2);
    vector3 = czm_octDecode(vec2(x, y));
 }











vec4 czm_transformPlane(vec4 plane, mat4 transform) {
    vec4 transformedPlane = transform * plane;
    
    float normalMagnitude = length(transformedPlane.xyz);
    return transformedPlane / normalMagnitude;
}

uniform float czm_specularEnvironmentMapsMaximumLOD;
uniform vec2 czm_specularEnvironmentMapSize;
uniform sampler2D czm_specularEnvironmentMaps;





vec3 czm_sampleOctahedralProjectionWithFiltering(sampler2D projectedMap, vec2 textureSize, vec3 direction, float lod)
{
    direction /= dot(vec3(1.0), abs(direction));
    vec2 rev = abs(direction.zx) - vec2(1.0);
    vec2 neg = vec2(direction.x < 0.0 ? rev.x : -rev.x,
                    direction.z < 0.0 ? rev.y : -rev.y);
    vec2 uv = direction.y < 0.0 ? neg : direction.xz;
    vec2 coord = 0.5 * uv + vec2(0.5);
    vec2 pixel = 1.0 / textureSize;

    if (lod > 0.0)
    {
        
        float scale = 1.0 / pow(2.0, lod);
        float offset = ((textureSize.y + 1.0) / textureSize.x);

        coord.x *= offset;
        coord *= scale;

        coord.x += offset + pixel.x;
        coord.y += (1.0 - (1.0 / pow(2.0, lod - 1.0))) + pixel.y * (lod - 1.0) * 2.0;
    }
    else
    {
        coord.x *= (textureSize.y / textureSize.x);
    }

    
    #ifndef OES_texture_float_linear
        vec3 color1 = texture(projectedMap, coord + vec2(0.0, pixel.y)).rgb;
        vec3 color2 = texture(projectedMap, coord + vec2(pixel.x, 0.0)).rgb;
        vec3 color3 = texture(projectedMap, coord + pixel).rgb;
        vec3 color4 = texture(projectedMap, coord).rgb;

        vec2 texturePosition = coord * textureSize;

        float fu = fract(texturePosition.x);
        float fv = fract(texturePosition.y);

        vec3 average1 = mix(color4, color2, fu);
        vec3 average2 = mix(color1, color3, fu);

        vec3 color = mix(average1, average2, fv);
    #else
        vec3 color = texture(projectedMap, coord).rgb;
    #endif

    return color;
}















vec3 czm_sampleOctahedralProjection(sampler2D projectedMap, vec2 textureSize, vec3 direction, float lod, float maxLod) {
    float currentLod = floor(lod + 0.5);
    float nextLod = min(currentLod + 1.0, maxLod);

    vec3 colorCurrentLod = czm_sampleOctahedralProjectionWithFiltering(projectedMap, textureSize, direction, currentLod);
    vec3 colorNextLod = czm_sampleOctahedralProjectionWithFiltering(projectedMap, textureSize, direction, nextLod);

    return mix(colorNextLod, colorCurrentLod, nextLod - lod);
}

uniform vec3 czm_sphericalHarmonicCoefficients[9];















vec3 czm_sphericalHarmonics(vec3 normal, vec3 coefficients[9])
{
    vec3 L00 = coefficients[0];
    vec3 L1_1 = coefficients[1];
    vec3 L10 = coefficients[2];
    vec3 L11 = coefficients[3];
    vec3 L2_2 = coefficients[4];
    vec3 L2_1 = coefficients[5];
    vec3 L20 = coefficients[6];
    vec3 L21 = coefficients[7];
    vec3 L22 = coefficients[8];

    float x = normal.x;
    float y = normal.y;
    float z = normal.z;

    return
          L00
        + L1_1 * y
        + L10 * z
        + L11 * x
        + L2_2 * (y * x)
        + L2_1 * (y * z)
        + L20 * (3.0 * z * z - 1.0)
        + L21 * (z * x)
        + L22 * (x * x - y * y);
}

uniform samplerCube czm_environmentMap;






vec3 czm_srgbToLinear(vec3 srgbIn)
{
    return pow(srgbIn, vec3(2.2));
}

vec4 czm_srgbToLinear(vec4 srgbIn) 
{
    vec3 linearOut = pow(srgbIn.rgb, vec3(2.2));
    return vec4(linearOut, srgbIn.a);
}

uniform sampler2D czm_brdfLut;
uniform mat3 czm_temeToPseudoFixed;
uniform vec3 czm_ellipsoidRadii;
uniform mat3 czm_inverseViewRotation;
uniform mat4 czm_inverseView;


#line 0

#line 0
uniform vec2 model_iblFactor;
uniform mat3 model_iblReferenceFrameMatrix;
uniform float model_luminanceAtZenith;
uniform sampler2D model_clippingPlanes;
uniform vec4 model_clippingPlanesEdgeStyle;
uniform mat4 model_clippingPlanesMatrix;
uniform sampler2D u_baseColorTexture;
uniform float u_metallicFactor;
uniform float u_roughnessFactor;
uniform vec4 czm_pickColor;
in vec3 v_positionWC;
in vec3 v_positionEC;
in vec3 v_positionMC;
in vec2 v_texCoord_0;
struct ProcessedAttributes
{
    vec3 positionWC;
    vec3 positionEC;
    vec3 positionMC;
    vec2 texCoord_0;
};
struct SelectedFeature
{
    float _empty;
};
struct FeatureIds
{
    float _empty;
};
struct Metadata
{
    float _empty;
};
struct MetadataClass
{
    float _empty;
};
struct MetadataStatistics
{
    float _empty;
};
void setDynamicVaryings(inout ProcessedAttributes attributes)
{
    attributes.texCoord_0 = v_texCoord_0;
}
void initializeFeatureIds(out FeatureIds featureIds, ProcessedAttributes attributes)
{
}
void initializeFeatureIdAliases(inout FeatureIds featureIds)
{
}
void initializeMetadata(out Metadata metadata, out MetadataClass metadataClass, out MetadataStatistics metadataStatistics, ProcessedAttributes attributes)
{
}
vec3 simpleIBL(
    vec3 positionEC,
    vec3 normalEC,
    vec3 lightDirectionEC,
    vec3 lightColorHdr,
    czm_pbrParameters pbrParameters
) {
    vec3 v = -positionEC;
    vec3 positionWC = vec3(czm_inverseView * vec4(positionEC, 1.0));
    vec3 vWC = -normalize(positionWC);
    vec3 l = normalize(lightDirectionEC);
    vec3 n = normalEC;
    vec3 r = normalize(czm_inverseViewRotation * normalize(reflect(v, n)));

    float NdotL = clamp(dot(n, l), 0.001, 1.0);
    float NdotV = abs(dot(n, v)) + 0.001;

    
    float vertexRadius = length(positionWC);
    float horizonDotNadir = 1.0 - min(1.0, czm_ellipsoidRadii.x / vertexRadius);
    float reflectionDotNadir = dot(r, normalize(positionWC));
    
    r.x = -r.x;
    r = -normalize(czm_temeToPseudoFixed * r);
    r.x = -r.x;
    vec3 diffuseColor = pbrParameters.diffuseColor;
    float roughness = pbrParameters.roughness;
    vec3 specularColor = pbrParameters.f0;

    vec2 brdfLut = texture(czm_brdfLut, vec2(NdotV, roughness)).rg;
    vec3 iblColor = (diffuseColor * 0.667 * model_iblFactor.x) + (czm_srgbToLinear(specularColor * brdfLut.x + brdfLut.y) * model_iblFactor.y);
    float maximumComponent = max(max(lightColorHdr.x, lightColorHdr.y), lightColorHdr.z);
    vec3 lightColor = lightColorHdr / max(maximumComponent, 1.0);
    iblColor *= lightColor;

    return iblColor;
}

vec3 proceduralIBL(
vec3 positionEC,
vec3 normalEC,
vec3 lightDirectionEC,
vec3 lightColorHdr,
czm_pbrParameters pbrParameters
) {
    vec3 v = -positionEC;
    vec3 positionWC = vec3(czm_inverseView * vec4(positionEC, 1.0));
    vec3 vWC = -normalize(positionWC);
    vec3 l = normalize(lightDirectionEC);
    vec3 n = normalEC;
    vec3 r = normalize(czm_inverseViewRotation * normalize(reflect(v, n)));

    float NdotL = clamp(dot(n, l), 0.001, 1.0);
    float NdotV = abs(dot(n, v)) + 0.001;

    
    float vertexRadius = length(positionWC);
    float horizonDotNadir = 1.0 - min(1.0, czm_ellipsoidRadii.x / vertexRadius);
    float reflectionDotNadir = dot(r, normalize(positionWC));
    
    r.x = -r.x;
    r = -normalize(czm_temeToPseudoFixed * r);
    r.x = -r.x;

    vec3 diffuseColor = pbrParameters.diffuseColor;
    float roughness = pbrParameters.roughness;
    vec3 specularColor = pbrParameters.f0;

    float inverseRoughness = 1.04 - roughness;
    inverseRoughness *= inverseRoughness;
    vec3 sceneSkyBox = texture(czm_environmentMap, r).rgb * inverseRoughness;

    float atmosphereHeight = 0.05;
    float blendRegionSize = 0.1 * ((1.0 - inverseRoughness) * 8.0 + 1.1 - horizonDotNadir);
    float blendRegionOffset = roughness * -1.0;
    float farAboveHorizon = clamp(horizonDotNadir - blendRegionSize * 0.5 + blendRegionOffset, 1.0e-10 - blendRegionSize, 0.99999);
    float aroundHorizon = clamp(horizonDotNadir + blendRegionSize * 0.5, 1.0e-10 - blendRegionSize, 0.99999);
    float farBelowHorizon = clamp(horizonDotNadir + blendRegionSize * 1.5, 1.0e-10 - blendRegionSize, 0.99999);
    float smoothstepHeight = smoothstep(0.0, atmosphereHeight, horizonDotNadir);
    vec3 belowHorizonColor = mix(vec3(0.1, 0.15, 0.25), vec3(0.4, 0.7, 0.9), smoothstepHeight);
    vec3 nadirColor = belowHorizonColor * 0.5;
    vec3 aboveHorizonColor = mix(vec3(0.9, 1.0, 1.2), belowHorizonColor, roughness * 0.5);
    vec3 blueSkyColor = mix(vec3(0.18, 0.26, 0.48), aboveHorizonColor, reflectionDotNadir * inverseRoughness * 0.5 + 0.75);
    vec3 zenithColor = mix(blueSkyColor, sceneSkyBox, smoothstepHeight);
    vec3 blueSkyDiffuseColor = vec3(0.7, 0.85, 0.9);
    float diffuseIrradianceFromEarth = (1.0 - horizonDotNadir) * (reflectionDotNadir * 0.25 + 0.75) * smoothstepHeight;
    float diffuseIrradianceFromSky = (1.0 - smoothstepHeight) * (1.0 - (reflectionDotNadir * 0.25 + 0.25));
    vec3 diffuseIrradiance = blueSkyDiffuseColor * clamp(diffuseIrradianceFromEarth + diffuseIrradianceFromSky, 0.0, 1.0);
    float notDistantRough = (1.0 - horizonDotNadir * roughness * 0.8);
    vec3 specularIrradiance = mix(zenithColor, aboveHorizonColor, smoothstep(farAboveHorizon, aroundHorizon, reflectionDotNadir) * notDistantRough);
    specularIrradiance = mix(specularIrradiance, belowHorizonColor, smoothstep(aroundHorizon, farBelowHorizon, reflectionDotNadir) * inverseRoughness);
    specularIrradiance = mix(specularIrradiance, nadirColor, smoothstep(farBelowHorizon, 1.0, reflectionDotNadir) * inverseRoughness);

    
    #ifdef USE_SUN_LUMINANCE
    
    float LdotZenith = clamp(dot(normalize(czm_inverseViewRotation * l), vWC), 0.001, 1.0);
    float S = acos(LdotZenith);
    
    float NdotZenith = clamp(dot(normalize(czm_inverseViewRotation * n), vWC), 0.001, 1.0);
    
    float gamma = acos(NdotL);
    float numerator = ((0.91 + 10.0 * exp(-3.0 * gamma) + 0.45 * pow(NdotL, 2.0)) * (1.0 - exp(-0.32 / NdotZenith)));
    float denominator = (0.91 + 10.0 * exp(-3.0 * S) + 0.45 * pow(LdotZenith,2.0)) * (1.0 - exp(-0.32));
    float luminance = model_luminanceAtZenith * (numerator / denominator);
    #endif

    vec2 brdfLut = texture(czm_brdfLut, vec2(NdotV, roughness)).rg;
    vec3 iblColor = (diffuseIrradiance * diffuseColor * model_iblFactor.x) + (specularIrradiance * czm_srgbToLinear(specularColor * brdfLut.x + brdfLut.y) * model_iblFactor.y);
    float maximumComponent = max(max(lightColorHdr.x, lightColorHdr.y), lightColorHdr.z);
    vec3 lightColor = lightColorHdr / max(maximumComponent, 1.0);
    iblColor *= lightColor;

    #ifdef USE_SUN_LUMINANCE
    iblColor *= luminance;
    #endif

    return iblColor;
}

#if defined(DIFFUSE_IBL) || defined(SPECULAR_IBL)
vec3 textureIBL(
    vec3 positionEC,
    vec3 normalEC,
    vec3 lightDirectionEC,
    czm_pbrParameters pbrParameters
) {
    vec3 diffuseColor = pbrParameters.diffuseColor;
    float roughness = pbrParameters.roughness;
    vec3 specularColor = pbrParameters.f0;

    vec3 v = -positionEC;
    vec3 n = normalEC;
    vec3 l = normalize(lightDirectionEC);
    vec3 h = normalize(v + l);

    float NdotV = abs(dot(n, v)) + 0.001;
    float VdotH = clamp(dot(v, h), 0.0, 1.0);

    const mat3 yUpToZUp = mat3(
        -1.0, 0.0, 0.0,
        0.0, 0.0, -1.0,
        0.0, 1.0, 0.0
    );
    vec3 cubeDir = normalize(yUpToZUp * model_iblReferenceFrameMatrix * normalize(reflect(-v, n)));

    #ifdef DIFFUSE_IBL
        #ifdef CUSTOM_SPHERICAL_HARMONICS
        vec3 diffuseIrradiance = czm_sphericalHarmonics(cubeDir, model_sphericalHarmonicCoefficients);
        #else
        vec3 diffuseIrradiance = czm_sphericalHarmonics(cubeDir, czm_sphericalHarmonicCoefficients);
        #endif
    #else
    vec3 diffuseIrradiance = vec3(0.0);
    #endif

    #ifdef SPECULAR_IBL
    vec3 r0 = specularColor.rgb;
    float reflectance = max(max(r0.r, r0.g), r0.b);
    vec3 r90 = vec3(clamp(reflectance * 25.0, 0.0, 1.0));
    vec3 F = fresnelSchlick2(r0, r90, VdotH);

    vec2 brdfLut = texture(czm_brdfLut, vec2(NdotV, roughness)).rg;
      #ifdef CUSTOM_SPECULAR_IBL
      vec3 specularIBL = czm_sampleOctahedralProjection(model_specularEnvironmentMaps, model_specularEnvironmentMapsSize, cubeDir, roughness * model_specularEnvironmentMapsMaximumLOD, model_specularEnvironmentMapsMaximumLOD);
      #else
      vec3 specularIBL = czm_sampleOctahedralProjection(czm_specularEnvironmentMaps, czm_specularEnvironmentMapSize, cubeDir,  roughness * czm_specularEnvironmentMapsMaximumLOD, czm_specularEnvironmentMapsMaximumLOD);
      #endif
    specularIBL *= F * brdfLut.x + brdfLut.y;
    #else
    vec3 specularIBL = vec3(0.0);
    #endif

    return diffuseColor * diffuseIrradiance + specularColor * specularIBL;
}
#endif

vec3 imageBasedLightingStage(
    vec3 positionEC,
    vec3 normalEC,
    vec3 lightDirectionEC,
    vec3 lightColorHdr,
    czm_pbrParameters pbrParameters
) {
  #if defined(DIFFUSE_IBL) || defined(SPECULAR_IBL)
  
  return textureIBL(
      positionEC,
      normalEC,
      lightDirectionEC,
      pbrParameters
  );
  #else
      #ifdef LIGHTING_SIMPLE
      
      return simpleIBL(
          positionEC,
          normalEC,
          lightDirectionEC,
          lightColorHdr,
          pbrParameters
      );
      #else
      return proceduralIBL(
        positionEC,
        normalEC,
        lightDirectionEC,
        lightColorHdr,
        pbrParameters);
      #endif
  #endif
}

#ifdef USE_CLIPPING_PLANES_FLOAT_TEXTURE
vec4 getClippingPlane(
    highp sampler2D packedClippingPlanes,
    int clippingPlaneNumber,
    mat4 transform
) {
    int pixY = clippingPlaneNumber / CLIPPING_PLANES_TEXTURE_WIDTH;
    int pixX = clippingPlaneNumber - (pixY * CLIPPING_PLANES_TEXTURE_WIDTH);
    float pixelWidth = 1.0 / float(CLIPPING_PLANES_TEXTURE_WIDTH);
    float pixelHeight = 1.0 / float(CLIPPING_PLANES_TEXTURE_HEIGHT);
    float u = (float(pixX) + 0.5) * pixelWidth; 
    float v = (float(pixY) + 0.5) * pixelHeight;
    vec4 plane = texture(packedClippingPlanes, vec2(u, v));
    return czm_transformPlane(plane, transform);
}
#else

vec4 getClippingPlane(
    highp sampler2D packedClippingPlanes,
    int clippingPlaneNumber,
    mat4 transform
) {
    int clippingPlaneStartIndex = clippingPlaneNumber * 2; 
    int pixY = clippingPlaneStartIndex / CLIPPING_PLANES_TEXTURE_WIDTH;
    int pixX = clippingPlaneStartIndex - (pixY * CLIPPING_PLANES_TEXTURE_WIDTH);
    float pixelWidth = 1.0 / float(CLIPPING_PLANES_TEXTURE_WIDTH);
    float pixelHeight = 1.0 / float(CLIPPING_PLANES_TEXTURE_HEIGHT);
    float u = (float(pixX) + 0.5) * pixelWidth; 
    float v = (float(pixY) + 0.5) * pixelHeight;
    vec4 oct32 = texture(packedClippingPlanes, vec2(u, v)) * 255.0;
    vec2 oct = vec2(oct32.x * 256.0 + oct32.y, oct32.z * 256.0 + oct32.w);
    vec4 plane;
    plane.xyz = czm_octDecode(oct, 65535.0);
    plane.w = czm_unpackFloat(texture(packedClippingPlanes, vec2(u + pixelWidth, v)));
    return czm_transformPlane(plane, transform);
}
#endif

float clip(vec4 fragCoord, sampler2D clippingPlanes, mat4 clippingPlanesMatrix) {
    vec4 position = czm_windowToEyeCoordinates(fragCoord);
    vec3 clipNormal = vec3(0.0);
    vec3 clipPosition = vec3(0.0);
    float pixelWidth = czm_metersPerPixel(position);
    
    #ifdef UNION_CLIPPING_REGIONS
    float clipAmount; 
    #else
    float clipAmount = 0.0;
    bool clipped = true;
    #endif

    for (int i = 0; i < CLIPPING_PLANES_LENGTH; ++i) {
        vec4 clippingPlane = getClippingPlane(clippingPlanes, i, clippingPlanesMatrix);
        clipNormal = clippingPlane.xyz;
        clipPosition = -clippingPlane.w * clipNormal;
        float amount = dot(clipNormal, (position.xyz - clipPosition)) / pixelWidth;
        
        #ifdef UNION_CLIPPING_REGIONS
        clipAmount = czm_branchFreeTernary(i == 0, amount, min(amount, clipAmount));
        if (amount <= 0.0) {
            discard;
        }
        #else
        clipAmount = max(amount, clipAmount);
        clipped = clipped && (amount <= 0.0);
        #endif
    }

    #ifndef UNION_CLIPPING_REGIONS
    if (clipped) {
        discard;
    }
    #endif
    
    return clipAmount;
}

void modelClippingPlanesStage(inout vec4 color)
{
    float clipDistance = clip(gl_FragCoord, model_clippingPlanes, model_clippingPlanesMatrix);
    vec4 clippingPlanesEdgeColor = vec4(1.0);
    clippingPlanesEdgeColor.rgb = vec3(0.7333, 0.8275, 0.3216);
    float clippingPlanesEdgeWidth = model_clippingPlanesEdgeStyle.a;
    
    if (clipDistance >0. && clipDistance < clippingPlanesEdgeWidth) {
        color = clippingPlanesEdgeColor;
    }
}



void geometryStage(out ProcessedAttributes attributes)
{
  attributes.positionMC = v_positionMC;
  attributes.positionEC = v_positionEC;

  #ifdef COMPUTE_POSITION_WC_CUSTOM_SHADER
  attributes.positionWC = v_positionWC;
  #endif

  #ifdef HAS_NORMALS
  
  attributes.normalEC = normalize(v_normalEC);
  #endif

  #ifdef HAS_TANGENTS
  attributes.tangentEC = normalize(v_tangentEC);
  #endif

  #ifdef HAS_BITANGENTS
  attributes.bitangentEC = normalize(v_bitangentEC);
  #endif

  
  setDynamicVaryings(attributes);
}


bool isDefaultStyleColor(vec3 color)
{
    return all(greaterThan(color, vec3(1.0 - czm_epsilon3)));
}

vec3 blend(vec3 sourceColor, vec3 styleColor, float styleColorBlend)
{
    vec3 blendColor = mix(sourceColor, styleColor, styleColorBlend);
    vec3 color = isDefaultStyleColor(styleColor.rgb) ? sourceColor : blendColor;
    return color;
}

vec2 computeTextureTransform(vec2 texCoord, mat3 textureTransform)
{
    return vec2(textureTransform * vec3(texCoord, 1.0));
}

#ifdef HAS_NORMALS
vec3 computeNormal(ProcessedAttributes attributes)
{
    
    vec3 ng = attributes.normalEC;

    vec3 normal = ng;
    #if defined(HAS_NORMAL_TEXTURE) && !defined(HAS_WIREFRAME)
    vec2 normalTexCoords = TEXCOORD_NORMAL;
        #ifdef HAS_NORMAL_TEXTURE_TRANSFORM
        normalTexCoords = computeTextureTransform(normalTexCoords, u_normalTextureTransform);
        #endif

        
        #ifdef HAS_BITANGENTS
        vec3 t = attributes.tangentEC;
        vec3 b = attributes.bitangentEC;
        mat3 tbn = mat3(t, b, ng);
        vec3 n = texture(u_normalTexture, normalTexCoords).rgb;
        normal = normalize(tbn * (2.0 * n - 1.0));
        #elif defined(WEBGL_2)
        
        vec3 positionEC = attributes.positionEC;
        vec3 pos_dx = dFdx(positionEC);
        vec3 pos_dy = dFdy(positionEC);
        vec3 tex_dx = dFdx(vec3(normalTexCoords,0.0));
        vec3 tex_dy = dFdy(vec3(normalTexCoords,0.0));
        vec3 t = (tex_dy.t * pos_dx - tex_dx.t * pos_dy) / (tex_dx.s * tex_dy.t - tex_dy.s * tex_dx.t);
        t = normalize(t - ng * dot(ng, t));
        vec3 b = normalize(cross(ng, t));
        mat3 tbn = mat3(t, b, ng);
        vec3 n = texture(u_normalTexture, normalTexCoords).rgb;
        normal = normalize(tbn * (2.0 * n - 1.0));
        #endif
    #endif

    #ifdef HAS_DOUBLE_SIDED_MATERIAL
    if (czm_backFacing()) {
        normal = -normal;
    }
    #endif

    return normal;
}
#endif

void materialStage(inout czm_modelMaterial material, ProcessedAttributes attributes, SelectedFeature feature)
{
    #ifdef HAS_NORMALS
    material.normalEC = computeNormal(attributes);
    #endif

    vec4 baseColorWithAlpha = vec4(1.0);
    
    #ifdef HAS_BASE_COLOR_TEXTURE
    vec2 baseColorTexCoords = TEXCOORD_BASE_COLOR;

        #ifdef HAS_BASE_COLOR_TEXTURE_TRANSFORM
        baseColorTexCoords = computeTextureTransform(baseColorTexCoords, u_baseColorTextureTransform);
        #endif

    baseColorWithAlpha = czm_srgbToLinear(texture(u_baseColorTexture, baseColorTexCoords));

        #ifdef HAS_BASE_COLOR_FACTOR
        baseColorWithAlpha *= u_baseColorFactor;
        #endif
    #elif defined(HAS_BASE_COLOR_FACTOR)
    baseColorWithAlpha = u_baseColorFactor;
    #endif

    #ifdef HAS_POINT_CLOUD_COLOR_STYLE
    baseColorWithAlpha = v_pointCloudColor;
    #elif defined(HAS_COLOR_0)
    vec4 color = attributes.color_0;
        
        #ifdef HAS_SRGB_COLOR
        color = czm_srgbToLinear(color);
        #endif
    baseColorWithAlpha *= color;
    #endif

    material.diffuse = baseColorWithAlpha.rgb;
    material.alpha = baseColorWithAlpha.a;

    #ifdef USE_CPU_STYLING
    material.diffuse = blend(material.diffuse, feature.color.rgb, model_colorBlend);
    #endif

    #ifdef HAS_OCCLUSION_TEXTURE
    vec2 occlusionTexCoords = TEXCOORD_OCCLUSION;
        #ifdef HAS_OCCLUSION_TEXTURE_TRANSFORM
        occlusionTexCoords = computeTextureTransform(occlusionTexCoords, u_occlusionTextureTransform);
        #endif
    material.occlusion = texture(u_occlusionTexture, occlusionTexCoords).r;
    #endif

    #ifdef HAS_EMISSIVE_TEXTURE
    vec2 emissiveTexCoords = TEXCOORD_EMISSIVE;
        #ifdef HAS_EMISSIVE_TEXTURE_TRANSFORM
        emissiveTexCoords = computeTextureTransform(emissiveTexCoords, u_emissiveTextureTransform);
        #endif

    vec3 emissive = czm_srgbToLinear(texture(u_emissiveTexture, emissiveTexCoords).rgb);
        #ifdef HAS_EMISSIVE_FACTOR
        emissive *= u_emissiveFactor;
        #endif
    material.emissive = emissive;
    #elif defined(HAS_EMISSIVE_FACTOR)
    material.emissive = u_emissiveFactor;
    #endif

    #if defined(LIGHTING_PBR) && defined(USE_SPECULAR_GLOSSINESS)
        #ifdef HAS_SPECULAR_GLOSSINESS_TEXTURE
        vec2 specularGlossinessTexCoords = TEXCOORD_SPECULAR_GLOSSINESS;
          #ifdef HAS_SPECULAR_GLOSSINESS_TEXTURE_TRANSFORM
          specularGlossinessTexCoords = computeTextureTransform(specularGlossinessTexCoords, u_specularGlossinessTextureTransform);
          #endif

        vec4 specularGlossiness = czm_srgbToLinear(texture(u_specularGlossinessTexture, specularGlossinessTexCoords));
        vec3 specular = specularGlossiness.rgb;
        float glossiness = specularGlossiness.a;
            #ifdef HAS_SPECULAR_FACTOR
            specular *= u_specularFactor;
            #endif

            #ifdef HAS_GLOSSINESS_FACTOR
            glossiness *= u_glossinessFactor;
            #endif
        #else
            #ifdef HAS_SPECULAR_FACTOR
            vec3 specular = clamp(u_specularFactor, vec3(0.0), vec3(1.0));
            #else
            vec3 specular = vec3(1.0);
            #endif

            #ifdef HAS_GLOSSINESS_FACTOR
            float glossiness = clamp(u_glossinessFactor, 0.0, 1.0);
            #else
            float glossiness = 1.0;
            #endif
        #endif

        #ifdef HAS_DIFFUSE_TEXTURE
        vec2 diffuseTexCoords = TEXCOORD_DIFFUSE;
            #ifdef HAS_DIFFUSE_TEXTURE_TRANSFORM
            diffuseTexCoords = computeTextureTransform(diffuseTexCoords, u_diffuseTextureTransform);
            #endif

        vec4 diffuse = czm_srgbToLinear(texture(u_diffuseTexture, diffuseTexCoords));
            #ifdef HAS_DIFFUSE_FACTOR
            diffuse *= u_diffuseFactor;
            #endif
        #elif defined(HAS_DIFFUSE_FACTOR)
        vec4 diffuse = clamp(u_diffuseFactor, vec4(0.0), vec4(1.0));
        #else
        vec4 diffuse = vec4(1.0);
        #endif
    czm_pbrParameters parameters = czm_pbrSpecularGlossinessMaterial(
      diffuse.rgb,
      specular,
      glossiness
    );
    material.diffuse = parameters.diffuseColor;
    
    
    material.alpha = diffuse.a;
    material.specular = parameters.f0;
    material.roughness = parameters.roughness;
    #elif defined(LIGHTING_PBR)
        #ifdef HAS_METALLIC_ROUGHNESS_TEXTURE
        vec2 metallicRoughnessTexCoords = TEXCOORD_METALLIC_ROUGHNESS;
            #ifdef HAS_METALLIC_ROUGHNESS_TEXTURE_TRANSFORM
            metallicRoughnessTexCoords = computeTextureTransform(metallicRoughnessTexCoords, u_metallicRoughnessTextureTransform);
            #endif

        vec3 metallicRoughness = texture(u_metallicRoughnessTexture, metallicRoughnessTexCoords).rgb;
        float metalness = clamp(metallicRoughness.b, 0.0, 1.0);
        float roughness = clamp(metallicRoughness.g, 0.04, 1.0);
            #ifdef HAS_METALLIC_FACTOR
            metalness *= u_metallicFactor;
            #endif

            #ifdef HAS_ROUGHNESS_FACTOR
            roughness *= u_roughnessFactor;
            #endif
        #else
            #ifdef HAS_METALLIC_FACTOR
            float metalness = clamp(u_metallicFactor, 0.0, 1.0);
            #else
            float metalness = 1.0;
            #endif

            #ifdef HAS_ROUGHNESS_FACTOR
            float roughness = clamp(u_roughnessFactor, 0.04, 1.0);
            #else
            float roughness = 1.0;
            #endif
        #endif
    czm_pbrParameters parameters = czm_pbrMetallicRoughnessMaterial(
      material.diffuse,
      metalness,
      roughness
    );
    material.diffuse = parameters.diffuseColor;
    material.specular = parameters.f0;
    material.roughness = parameters.roughness;
    #endif
}

void featureIdStage(out FeatureIds featureIds, ProcessedAttributes attributes) {
  initializeFeatureIds(featureIds, attributes);
  initializeFeatureIdAliases(featureIds);
}

void metadataStage(
  out Metadata metadata,
  out MetadataClass metadataClass,
  out MetadataStatistics metadataStatistics,
  ProcessedAttributes attributes
  )
{
  initializeMetadata(metadata, metadataClass, metadataStatistics, attributes);
}

#ifdef LIGHTING_PBR
vec3 computePbrLighting(czm_modelMaterial inputMaterial, ProcessedAttributes attributes)
{
    czm_pbrParameters pbrParameters;
    pbrParameters.diffuseColor = inputMaterial.diffuse;
    pbrParameters.f0 = inputMaterial.specular;
    pbrParameters.roughness = inputMaterial.roughness;
    
    #ifdef USE_CUSTOM_LIGHT_COLOR
    vec3 lightColorHdr = model_lightColorHdr;
    #else
    vec3 lightColorHdr = czm_lightColorHdr;
    #endif

    vec3 color = inputMaterial.diffuse;
    #ifdef HAS_NORMALS
    color = czm_pbrLighting(
        attributes.positionEC,
        inputMaterial.normalEC,
        czm_lightDirectionEC,
        lightColorHdr,
        pbrParameters
    );

        #ifdef USE_IBL_LIGHTING
        color += imageBasedLightingStage(
            attributes.positionEC,
            inputMaterial.normalEC,
            czm_lightDirectionEC,
            lightColorHdr,
            pbrParameters
        );
        #endif
    #endif

    color *= inputMaterial.occlusion;
    color += inputMaterial.emissive;

    
    
    
    
    #ifndef HDR 
    color = czm_acesTonemapping(color);
    #endif 

    return color;
}
#endif

void lightingStage(inout czm_modelMaterial material, ProcessedAttributes attributes)
{
    
    
    vec3 color = vec3(0.0);

    #ifdef LIGHTING_PBR
    color = computePbrLighting(material, attributes);
    #else 
    color = material.diffuse;
    #endif

    #ifdef HAS_POINT_CLOUD_COLOR_STYLE
    
    color = czm_gammaCorrect(color);
    #elif !defined(HDR)
    
    
    color = czm_linearToSrgb(color);
    #endif

    material.diffuse = color;
}

#if defined(HAS_NORMALS) && !defined(HAS_TANGENTS) && !defined(LIGHTING_UNLIT)
    #ifdef WEBGL_2
    
    #endif
#endif

czm_modelMaterial defaultModelMaterial()
{
    czm_modelMaterial material;
    material.diffuse = vec3(0.0);
    material.specular = vec3(1.0);
    material.roughness = 1.0;
    material.occlusion = 1.0;
    material.normalEC = vec3(0.0, 0.0, 1.0);
    material.emissive = vec3(0.0);
    material.alpha = 1.0;
    return material;
}

vec4 handleAlpha(vec3 color, float alpha)
{
    #ifdef ALPHA_MODE_MASK
    if (alpha < u_alphaCutoff) {
        discard;
    }
    #endif

    return vec4(color, alpha);
}

SelectedFeature selectedFeature;

void main()
{
    #ifdef HAS_MODEL_SPLITTER
    modelSplitterStage();
    #endif

    czm_modelMaterial material = defaultModelMaterial();

    ProcessedAttributes attributes;
    geometryStage(attributes);

    FeatureIds featureIds;
    featureIdStage(featureIds, attributes);

    Metadata metadata;
    MetadataClass metadataClass;
    MetadataStatistics metadataStatistics;
    metadataStage(metadata, metadataClass, metadataStatistics, attributes);

    #ifdef HAS_SELECTED_FEATURE_ID
    selectedFeatureIdStage(selectedFeature, featureIds);
    #endif

    #ifndef CUSTOM_SHADER_REPLACE_MATERIAL
    materialStage(material, attributes, selectedFeature);
    #endif

    #ifdef HAS_CUSTOM_FRAGMENT_SHADER
    customShaderStage(material, attributes, featureIds, metadata, metadataClass, metadataStatistics);
    #endif

    lightingStage(material, attributes);

    #ifdef HAS_SELECTED_FEATURE_ID
    cpuStylingStage(material, selectedFeature);
    #endif

    #ifdef HAS_MODEL_COLOR
    modelColorStage(material);
    #endif

    #ifdef HAS_PRIMITIVE_OUTLINE
    primitiveOutlineStage(material);
    #endif

    vec4 color = handleAlpha(material.diffuse, material.alpha);

    #ifdef HAS_CLIPPING_PLANES
    modelClippingPlanesStage(color);
    #endif

    #ifdef HAS_MULTI_CLIPPING_PLANES
    bool UNION_State=false;
    modelMultiClippingPlanesStage(color,UNION_State);
    #ifdef HAS_UNION_MULTI_CLIPPING_REGIONS
    if(!UNION_State)
    {
    discard;
    }
    #endif
    #endif

    #if defined(HAS_SILHOUETTE) && defined(HAS_NORMALS)
    silhouetteStage(color);
    #endif

    czm_fragColor = color;
}

