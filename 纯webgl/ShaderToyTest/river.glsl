
#iChannel1  "file://river1.png"



mat3 rotx(float a) { mat3 rot; rot[0] = vec3(0.7608, 0.8118, 0.5569); rot[1] = vec3(0.0, cos(a), -sin(a)); rot[2] = vec3(0.0, sin(a), cos(a)); return rot; }
mat3 roty(float a) { mat3 rot; rot[0] = vec3(cos(a), 0.0, sin(a)); rot[1] = vec3(0.0, 1.0, 0.0); rot[2] = vec3(-sin(a), 0.0, cos(a)); return rot; }


const float waterY = .0;
// light
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
    for (float i = 1.; i < (levels + 1.); i = i + 1.)
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


vec3 grad(in vec3 rp, float bump)
{
    float hc = mapHeightHQ(rp);
    vec2 off = vec2(1.1, 0.0);
    float hh = mapHeightHQ(rp + off.xyy);
    float hv = mapHeightHQ(rp + off.yyx);
    
    vec3 h = normalize(vec3(bump, hh - hc, 0.)); 
    vec3 v = normalize(vec3(0., hv - hc, bump));
    return -normalize(cross(h, v));
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
    // return vec3(hv);
}

vec3 texgrad(in sampler2D tex, in vec2 uv, float bump)
{
    float hc = dot(texture(tex, uv).rgb, vec3(.33));
    vec2 off = vec2(0.002, 0.0);
    float hh = dot(texture(tex, uv + off).rgb, vec3(.33));
    float hv = dot(texture(tex, uv + off.yx).rgb, vec3(.33));
    
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
 

vec4 colorSurface(in vec3 rp, in vec3 rd)
{
    vec4 color = vec4(0.);
    
    vec2 uv = rp.xz * .05;
    color  = pow(texture(iChannel1, uv), vec4(2.2));
    return color;

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



void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    //控制屏幕的颜色
    //  fragColor = vec4(0.6275, 0.898, 0.7686, 0.941);

	vec2 uv = ((fragCoord.xy / iResolution.xy) - vec2(.5)) * vec2(1.0, iResolution.y / iResolution.x);
    vec2 im = 1.5 * ((iMouse.xy / iResolution.xy) - vec2(0.5));
    
    vec3 rp = vec3(-.0, 17.5, -10.);
	// // camera    
    vec3 rd = normalize(vec3(uv, .4));
    vec3 _rp = rp;
    rp = roty(im.x * 5.) * rp;
    rp.y = (rotx(im.y * 1.5) * _rp).y;
    
    
    vec3 ro = rp;

    
    
    // // ground 
    bool hit = trace(rp, rd);
    _rp = rp;
    
 
    // water
    if(rp.y < waterY && mapEdge(rp) > -30.)
    {
        vec3 n = vec3(0.0, 1.0, 0.0);
        float t = (waterY - dot(ro, n))/dot(n, rd);
        if(t > 0.)
        {
            vec3 p = ro+rd*t;
            
            float T = 4.;
            
            // texture offsets for advection
            float cycle = mod(iTime, T)/T;
            float o1, o2 = 0.;
            float mv = getMixValue(cycle, o1, o2);
            //生成河流
            float dist = smoothstep(6., 1., shoreLine(p));
            
            // flow vec 
            vec2 sideFlow = (flowGrad(p))  * 3.;
            float h = mapHeightLQ(p);
            //生成河流
            vec2 flowFwd = flowGrad(vec3(shoreLine(vec3(0.0, 0.0, rp.z)), 0., rp.z)).yx * 3.;
            float mixval = dist;//smoothstep(-5., 0., dist);
            vec2 flow = mix(sideFlow, flowFwd, mixval);
            
            // 计算法线信息
            float speed = 50.;
            vec2 scale = vec2(.35, .4);
            float bmp = 0.1;
            vec3 g1 = seagrad(scale * p.xz, bmp, t);
            vec3 g2 = seagrad(scale * p.xz + flow * o2 * speed, bmp, t);
            
            vec3 g3 = seagrad(scale * p.xz + vec2(.1, .2) + flow * o1 * speed * .4, bmp, t);
            vec3 g4 = seagrad(scale * p.xz + vec2(.3, .2) + flow * o2 * speed * .4, bmp, t);
            
		    // vec3 gm = vec3(0.3961, 0.7098, 0.7216);
            //生成波纹

            vec3 gm =mix(g1,g2,mv); 
            gm += mix(g4, g3, mv);
            gm = normalize(gm);

            // fragColor+=vec4(scale * p.xz + flow * o1 * speed,1.0,0.0);
            fragColor+=vec4(g1,1.0);
            // // 漫反射
            // vec4 blue = vec4(0., 69., 129., 0.) / 255.;
            // float wd = dot(gm, ld);
            // wd = max(0.0, wd);
            // float wrp = 0.5;
            // wd = (wd+wrp)/(1.+wrp);
            // vec4 difcol = blue;
            
            // // 镜面反射
            // vec3 H = normalize(-rd + ld);
            // float specd = dot(H, gm);
            // specd = max(0.0, specd);
            // float sd = pow(max(0.0, specd), 59.0) * 1.;
            
            // // fres
            // float fres = 1.-max(0., dot(-rd,gm));//?光照方程中的影响因子
            // vec4 lightblue = vec4(151./255., 203./255., 220./255., 0.);
            // vec4 orange = vec4(0.5333, 0.3922, 0.2471, 0.0);
            // fres = pow(fres, 2.)* 1.;
            
            // // 颜色叠加
            // vec4 frescol = fres*orange;
            // //融合颜色
            // vec4 surfcol = frescol * .4 + difcol * wd * 0.2;
            // // fragColor +=surfcol;
            // vec3 refr = normalize(refract(rd, gm, .7));
            
            // bool hit = trace(p, refr);
            // //控制水中地表显示
            // vec4 bottomColor = colorSurface(p,refr);

            // float mx = 1.-smoothstep(-.1, 2., -refr.y);//融合因子
            // fragColor = mix(bottomColor, surfcol, mx);
            // // fragColor=vec4(0.9804, 0.9804, 0.9804, 0.1);


            // // 反射  水中加光照(颜色融合)
            // fragColor +=vec4(sd);
            // fragColor.a = 1.;
        }
    }
   

    
}