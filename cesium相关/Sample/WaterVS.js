const WaterVs =`
attribute vec3 position3DHigh;
attribute vec3 position3DLow;
attribute vec3 normal;
attribute vec2 st;
attribute float batchId;

varying vec3 v_positionEC;
varying vec3 v_normalEC;
varying vec2 v_st;

void main()
{
    vec4 p = czm_computePosition();

    v_positionEC = (czm_modelViewRelativeToEye * p).xyz;      
    v_normalEC = czm_normal * normal;                         
    v_st = st;

    gl_Position = czm_modelViewProjectionRelativeToEye * p;
}

`;
export default WaterVs;