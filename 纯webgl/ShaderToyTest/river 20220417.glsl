mat3 rotx(float a) { mat3 rot; rot[0] = vec3(1.0, 0.0, 0.0); rot[1] = vec3(0.0, cos(a), -sin(a)); rot[2] = vec3(0.0, sin(a), cos(a)); return rot; }
mat3 roty(float a) { mat3 rot; rot[0] = vec3(cos(a), 0.0, sin(a)); rot[1] = vec3(0.0, 1.0, 0.0); rot[2] = vec3(-sin(a), 0.0, cos(a)); return rot; }
const float waterY = .0;
const vec3 ld = normalize(vec3(0.0, 2.1, 14.0));
float hash( vec2 p ) {
	float h = dot(p,vec2(127.1,311.7));	
    return fract(sin(h)*43758.5453123);
}
float noise( in vec2 p ) {
    vec2 i = floor( p );
    vec2 f = fract( p );	
	vec2 u = f*f*(3.0-2.0*f);
    return -1.0+2.0*mix( mix( hash( i + vec2(0.0,0.0) ), 
                     hash( i + vec2(1.0,0.0) ), u.x),
                mix( hash( i + vec2(0.0,1.0) ), 
                     hash( i + vec2(1.0,1.0) ), u.x), u.y);
}
float water(vec2 uv) {
    uv += noise(uv * .8);        
    vec2 wv = 1.0-abs(sin(uv));
    return (wv.x + wv.y) * .5;
}
float getCurve(in vec3 rp)
{
    float x = sin(rp.z * .1) * 0.1;
    x = sin(rp.z * .001 - .0) * 0.1;
    return x;
}
float shoreLine(vec3 rp)
{
    return abs(getCurve(rp) + rp.x);
}
float river(vec2 uv)
{
    float s = 0.;
    const float levels = 4.;
    mat2 r;
    r[0] = vec2(0.4, 0.4);
    r[1] = vec2(-0.24, 0.27);
    for (float i = 1.; i < 5.; i ++)
    {
        uv *= r;
        s += water(uv * i * 2.);
    }
    s /= (levels + 1.);
    return s;
}
float mapEdge(in vec3 rp)
{
    rp.x += getCurve(rp);
    float edgeL = -1.;
    float difx = 1.-abs(rp.x);
    return difx;
}
float mapBottom(in vec3 rp)
{
    rp.x = getCurve(rp);
    float bottom = -.6;
    float ax = abs(rp.x);
    bottom += smoothstep(1., 10., ax);
    bottom += (0.5 + 0.5 * noise(rp.xz * .3)) * .5;
    float hill = smoothstep(65., 80., ax);
    bottom += hill * 15.;
    bottom += hill * sin(rp.z * .1) * 2.;
    bottom += hill * sin(rp.z * .15) * 1.;
    return bottom; 
}
float mapHeightHQ(in vec3 rp)
{
    float bottom = mapBottom(rp);
    float limit = smoothstep(45., 80., abs(rp.x)) * 3.; 
    bottom -= (0.4 * smoothstep(0.2, 0.5, noise(rp.xz * .13))) * limit;
    bottom += (0.3 * smoothstep(0.1, 0.5, noise(rp.xz * .33))) * limit;
    return rp.y - bottom;
}
float mapHeightLQ(in vec3 rp)
{
    return rp.y - mapBottom(rp);
}
vec3 seagrad(in vec2 uv, float bump, float t)
{
    uv *= 14.;
    float hc = river(uv);
    vec2 off = vec2(3./t, 0.0);
    float hh = river(uv + off);
    float hv = river(uv + off.yx);
    vec3 h = normalize(vec3(bump, hh - hc, 0.)); 
    vec3 v = normalize(vec3(0., hv - hc, bump));
    return -normalize(cross(h, v));
}
bool trace(inout vec3 rp, in vec3 rd)
{
    bool hit = false;
    vec3 ro = rp;
    vec3 prevp = rp;
    // rough height map tracing
    for (int i = 0; i < 350; ++i)
    {
        float dify = mapHeightLQ(rp);
        if(dify < 0.)
        {
            hit = true;
            break;
        }
        prevp = rp;
        rp += rd * max(0.15, dify);
        if(dot(ro - rp, ro - rp) > 150000.) break;
    }
    // detailed height map tracing
    if(hit)
    {
        hit = false;
        for (int i = 0; i < 25; ++i)
        {
            float dify = mapHeightHQ(rp);
            if(dify < 0.)
            {
                hit = true;
                break;
            }
            prevp = rp;
            rp += rd * max(0.1, dify * (1.0 + log2(1.0 + length(ro - rp) * 1.5)));
	        if(dot(ro - rp, ro - rp) > 150000.) break;
        }
    }
    // binary search the surface
    if(hit)
    {
        vec3 insidep = rp;
        vec3 outsidep = prevp;
        float cursor = 0.5;
        for (int i = 1; i < 20; ++i)
        {
        	rp = mix(outsidep, insidep, cursor);
            float dist = mapHeightHQ(rp);
            cursor += pow(0.5, float(i + 1)) * sign(dist);
        }
    }
    return hit; 
}
vec2 flowGrad(in vec3 rp)
{
    vec3 off = vec3(.02, 0.0, 0.0);
    float dc = mapEdge(rp);
    float dh = mapEdge(rp + off);
    float dv = mapEdge(rp + off.yyx);   
    return -vec2(dh - dc, dv - dc);
}
float getMixValue(float cycle, inout float offset1, inout float offset2)
{
    float mixval = cycle * 2.0;
    if(mixval > 1.0) mixval = 2.0 - mixval;
    offset1 = cycle;
    offset2 = mod(offset1 + .5, 1.0);   
    return mixval;
}
void mainImage( out vec4 gl_FragColor, in vec2 fragCoord )
{
	vec2 uv = ((fragCoord.xy / iResolution.xy) - vec2(.5)) * vec2(1.0, iResolution.y / iResolution.x);
    vec2 im = 1.5 * ((iMouse.xy / iResolution.xy) - vec2(0.5));
    vec3 rp = vec3(-.0, 17.5, -18.);
    vec3 rd = normalize(vec3(uv, .4));
    vec3 _rp = rp;
    rp = roty(im.x * 5.) * rp;
    rp.y = (rotx(im.y * 1.5) * _rp).y;
    vec3 ro = rp;
    bool hit = trace(rp, rd);
    vec3 n = vec3(0.0, 1.0, 0.0);
    float t = (- dot(ro, n))/dot(n, rd);
    //避免出现双层水
    // if(t >0.)
    // {
        vec3 p = ro+rd*t;
        float T = 4.;
        float cycle = mod(iTime, T)/T;
        float o1, o2 = 0.;
        float mv = getMixValue(cycle, o1, o2);
        //生成流向
        vec2 flowFwd = flowGrad(vec3(shoreLine(vec3(0.0, 0.0, rp.z)), 0., rp.z)).yx * 3.;
        vec2 flow = flowFwd;
        // 计算法线信息
        float speed = 50.;
        vec2 scale = vec2(.35, .4);
        float bmp = 0.05;
        //p.xz 控制近大远小
        vec3 g1 = seagrad(scale * p.xz + flow * o1 * speed, bmp, t);
        vec3 g2 = seagrad(scale * p.xz + flow * o2 * speed, bmp, t);
        vec3 g3 = seagrad(scale * p.xz + vec2(.1, .2) + flow * o1 * speed * .4, bmp, t);
        vec3 g4 = seagrad(scale * p.xz + vec2(.3, .2) + flow * o2 * speed * .4, bmp, t);
        vec3 gm =mix(g1,g2,mv); 
        gm += mix(g4, g3, mv);
        gm = normalize(gm);
        gl_FragColor = vec4(vec3(t),1.0);
        // gl_FragColor = vec4(vec3(p.x*0.03),1.0);
    // }
}