// The MIT License
// Copyright © 2013 Inigo Quilez
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

// Intersecting quadratic Bezier segments in 3D. Used Microsoft's paper as
// pointed out by tayholliday in https://www.shadertoy.com/view/XsX3zf. Since
// 3D quadratic Bezier segments are planar, the 2D version can be used to compute
// the distance to the 3D curve.

// Related Shaders:
//     Cubic     Bezier - 2D BBox : https://www.shadertoy.com/view/XdVBWd 
//     Cubic     Bezier - 3D BBox : https://www.shadertoy.com/view/MdKBWt
//     Quadratic Bezier - 2D BBox : https://www.shadertoy.com/view/lsyfWc
//     Quadratic Bezier - 3D BBox : https://www.shadertoy.com/view/tsBfRD

// List of other 3D SDFs: https://www.shadertoy.com/playlist/43cXRl
//
// and https://iquilezles.org/articles/distfunctions

	
#define AA 1

// method 0 : approximate http://research.microsoft.com/en-us/um/people/hoppe/ravg.pdf
// method 1 : exact       https://www.shadertoy.com/view/ltXSDB
#define METHOD 1

// uv=0 : do not compute V, just U
// uv=1 : comptue U and V
#define COMPUTE_UV 1

// texture 0: checkers
// texture 1: organic
#define TEXTURE 0



//-----------------------------------------------------------------------------------

// b(t) = (1-t)^2*A + 2(1-t)t*B + t^2*C
vec3 bezier( vec3 A, vec3 B, vec3 C, float t )
{
    return (1.0-t)*(1.0-t)*A + 2.0*(1.0-t)*t*B + t*t*C;
}
// b'(t) = 2(t-1)*A + 2(1-2t)*B + 2t*C
vec3 bezier_dx( vec3 A, vec3 B, vec3 C, float t )
{
    return 2.0*(t-1.0)*A + 2.0*(1.0-2.0*t)*B + 2.0*t*C;
}
// b"(t) = 2*A - 4*B + 2*C
vec3 bezier_dx_dx( vec3 A, vec3 B, vec3 C, float t )
{
    return 2.0*A - 4.0*B + 2.0*C;
}

#if METHOD==1
float dot2( in vec3 v ) { return dot(v,v); }

vec2 sdBezier(vec3 pos, vec3 A, vec3 B, vec3 C)
{    
    vec3 a = B - A;
    vec3 b = A - 2.0*B + C;
    vec3 c = a * 2.0;
    vec3 d = A - pos;

    float kk = 1.0 / dot(b,b);
    float kx = kk * dot(a,b);
    float ky = kk * (2.0*dot(a,a)+dot(d,b)) / 3.0;
    float kz = kk * dot(d,a);      

    vec2 res;

    float p = ky - kx*kx;
    float p3 = p*p*p;
    float q = kx*(2.0*kx*kx - 3.0*ky) + kz;
    float q2 = q*q;
    float h = q2 + 4.0*p3;

    if(h >= 0.0) 
    { 
        h = sqrt(h);
        vec2 x = (vec2(h, -h) - q) / 2.0;
        
        #if 1
        // When p≈0 and p<0, h-q has catastrophic cancelation. So, we do
        // h=√(q²+4p³)=q·√(1+4p³/q²)=q·√(1+w) instead. Now we approximate
        // √ by a linear Taylor expansion into h≈q(1+½w) so that the q's
        // cancel each other in h-q. Expanding and simplifying further we
        // get x=vec2(p³/q,-p³/q-q). And using a second degree Taylor
        // expansion instead: x=vec2(k,-k-q) with k=(1-p³/q²)·p³/q
        if( abs(p)<0.001 )
        {
          //float k = p3/q;              // linear approx
            float k = (1.0-p3/q2)*p3/q;  // quadratic approx 
            x = vec2(k,-k-q);  
        }
        #endif
        
        vec2 uv = sign(x)*pow(abs(x), vec2(1.0/3.0));
        float t = clamp(uv.x+uv.y-kx, 0.0, 1.0);

        // 1 root
        res = vec2(dot2(d+(c+b*t)*t),t);
        
        //res = vec2( dot2( pos-bezier(A,B,C,t)), t );
    }
    else
    {
        float z = sqrt(-p);
        float v = acos( q/(p*z*2.0) ) / 3.0;
        float m = cos(v);
        float n = sin(v)*1.732050808;
        vec3 t = clamp( vec3(m+m,-n-m,n-m)*z-kx, 0.0, 1.0);
        
        // 3 roots, but only need two
        float dis = dot2(d+(c+b*t.x)*t.x);
        res = vec2(dis,t.x);

        dis = dot2(d+(c+b*t.y)*t.y);
        if( dis<res.x ) res = vec2(dis,t.y );
    }
    
    res.x = sqrt(res.x);
    return res;
}

#endif

#if METHOD==0

    #if 1
    // http://research.microsoft.com/en-us/um/people/hoppe/ravg.pdf
    // { dist, t, y (above the plane of the curve, x (away from curve in the plane of the curve))
	float det( vec2 a, vec2 b ) { return a.x*b.y - a.y*b.x; }
    vec2 sdBezier( vec3 p, vec3 va, vec3 vb, vec3 vc )
    {
      vec3 w = normalize( cross( vc-vb, va-vb ) );
      vec3 u = normalize( vc-vb );
      vec3 v =          ( cross( w, u ) );

      vec2 m = vec2( dot(va-vb,u), dot(va-vb,v) );
      vec2 n = vec2( dot(vc-vb,u), dot(vc-vb,v) );
      vec3 q = vec3( dot( p-vb,u), dot( p-vb,v), dot(p-vb,w) );
            
      float mq = det(m,q.xy);
      float nq = det(n,q.xy);
      float mn = det(m,n);
      float k1 = mq + nq;
        
      vec2  g = (k1+mn)*n + (k1-mn)*m;
    //float f = -4.0*mq*nq - (mn-mq+nq)*(mn-mq+nq);
      float f = -(mn*mn + 2.0*mn*(nq-mq)) - k1*k1;
      vec2  z = 0.5*f*vec2(g.y,-g.x)/dot(g,g);
    //float t = clamp( 0.5 + 0.5*det(z-q.xy,m+n)/mn, 0.0 ,1.0 );
      float t = clamp( 0.5 + 0.5*(det(z,m+n)+k1)/mn, 0.0 ,1.0 );
        
      vec2 cp = m*(1.0-t)*(1.0-t) + n*t*t - q.xy;
      return vec2(sqrt(dot(cp,cp)+q.z*q.z), t );
    }
    #else
    // my adaptation to 3d of http://research.microsoft.com/en-us/um/people/hoppe/ravg.pdf
    // { dist, t, y (above the plane of the curve, x (away from curve in the plane of the curve))
    vec2 sdBezier( vec3 p, vec3 b0, vec3 b1, vec3 b2 )
    {
        b0 -= p;
        b1 -= p;
        b2 -= p;
       
        vec3 b01 = cross(b0,b1);
        vec3 b12 = cross(b1,b2);
        vec3 b20 = cross(b2,b0);
        
        vec3 n =  b01+b12+b20;
        
        float a = -dot(b20,n);
        float b = -dot(b01,n);
        float d = -dot(b12,n);

        float m = -dot(n,n);
        
      //vec3  g = b*(b2-b1) + d*(b1-b0) + a*(b2-b0)*0.5;
        vec3  g =  (d-b)*b1 + (b+a*0.5)*b2 + (-d-a*0.5)*b0;
        float f = a*a*0.25-b*d;
        vec3  k = b0-2.0*b1+b2;
        float t = clamp((a*0.5+b-0.5*f*dot(g,k)/dot(g,g))/m, 0.0, 1.0 );
        
        return vec2(length(mix(mix(b0,b1,t), mix(b1,b2,t),t)),t);
    }
    #endif
 
#endif

//-----------------------------------------------------------------------------------

vec3 hash3( float n ) { return fract(sin(vec3(n,n+7.3,n+13.7))*1313.54531); }

vec3 noise3( in float x )
{
    float p = floor(x);
    float f = fract(x);
    f = f*f*(3.0-2.0*f);
    return mix( hash3(p+0.0), hash3(p+1.0), f );
}

//-----------------------------------------------------------------------------------

vec3 map( vec3 p )
{
    vec3 a = vec3(0.0,-1.0,0.0);
    vec3 b = vec3(0.0, 0.0,0.0);
    vec3 c = vec3(0.0, 0.5,-0.5);
	float hm = 0.0;
	float id = 0.0;
    float am = 0.0;
    
    float dm = length(p-a);
    
    vec3 pb = vec3(1.0,0.0,0.0);
    float off = 0.0;
    for( int i=0; i<8; i++ )
	{	
        //vec3 bboxMi = min(a,min(b,c))-0.3;
    	//vec3 bboxMa = max(a,max(b,c))+0.3;
        
        vec2 h = sdBezier( p, a, b, c );
        float kh = (float(i) + h.y)/8.0;


        #if COMPUTE_UV==1
            vec3 bb = normalize(cross(b-a,c-a));
            vec3 qq = bezier(a,b,c,h.y);
            vec3 tq = normalize(bezier_dx(a,b,c,h.y));
            vec3 nq = normalize(cross(bb,tq));
            vec2 uv = vec2(dot(p-qq,nq),dot(p-qq,bb));
            float ad = acos( dot(pb,bb) );
            if( i==3 ) ad = -ad; // hack
            off += ad;
            float ka = atan(uv.y,uv.x) - off;
            pb = bb;
        #else
            float ka = 0.0;
        #endif
        
        // thickness
        float ra = 0.3 - 0.28*kh + 0.3*exp(-15.0*kh);
        float d = h.x - ra; // not accurate sdf, should use a cone better
        if( d<dm ) { dm=d; hm=kh; am = ka;}
		
        // grow next segment
        vec3 na = c;
		vec3 nb = c + (c-b);
		vec3 dir = normalize(-1.0+2.0*hash3( id+13.0 ));
		vec3 nc = nb + 1.0*dir*sign(-dot(c-b,dir));
		id += 3.71;
		a = na;
		b = nb;
		c = nc;
	}

	return vec3( dm*0.5, hm, am );
}

float map2( in vec3 pos )
{
    return min( pos.y+1.0, map(pos).x );
}

vec4 intersect( in vec3 ro, in vec3 rd )
{
    vec4 res = vec4( -1.0 );

    float maxd = 12.0;
    
    // plane
    float tp = (-1.0-ro.y)/rd.y;
    if( tp>0.0 )
    {
        vec3 pos = ro + rd*tp;
        res = vec4( tp, 0.025*length(pos.xz), 0.0, 0.0 );
        maxd = tp;
    }

    // tentacle
	const float precis = 0.001;
    float t = 2.0;
	float l = 0.0;
    float m = 0.0;
    for( int i=0; i<128; i++ )
    {
	    vec3 h = map( ro+rd*t );
        if( h.x<precis || t>maxd ) break;
        t += h.x;
		l = h.y;
        m = h.z;
    }
    if( t<maxd ) res = vec4( t, l, 1.0, m );

    return res;
}

// https://iquilezles.org/articles/normalsSDF
vec3 calcNormal( in vec3 pos )
{
    vec3 eps = vec3(0.002,0.0,0.0);

    float f = map(pos).x;
	return normalize( vec3(
           map(pos+eps.xyy).x - f,
           map(pos+eps.yxy).x - f,
           map(pos+eps.yyx).x - f ) );
}

// https://iquilezles.org/articles/rmshadows
float softshadow( in vec3 ro, in vec3 rd, float mint, float k )
{
    float res = 1.0;
    float t = mint;
	float h = 1.0;
    for( int i=0; i<32; i++ )
    {
        h = map(ro + rd*t).x;
        res = min( res, k*h/t );
		t += clamp( h, 0.02, 2.0 );
        if( res<0.0001 ) break;
    }
    return clamp(res,0.0,1.0);
}

float calcAO( in vec3 pos, in vec3 nor )
{
    float occ = 0.0;
    float sca = 1.0;
    for( int i=0; i<8; i++ )
    {
        float h = 0.02 + 0.5*float(i)/7.0;
        float d = map2( pos + h*nor );
        occ += max(h-d,0.0)*sca;
        sca *= 0.9;
    }
    return clamp( 1.5 - occ, 0.0, 1.0 );
}

// https://iquilezles.org/articles/filterableprocedurals
float gridTexture( in vec2 p, vec2 w )
{
    
    vec2 i = (abs(fract((p-0.5*w)*0.5)-0.5)-
                  abs(fract((p+0.5*w)*0.5)-0.5))/w;
    return 0.5 - 2.0*i.x*i.y;  
}

// https://iquilezles.org/articles/filterableprocedurals
float gridTexture( in float p, in float dpdx, in float dpdy )
{
    float w =  0.01 + max(abs(dpdx),abs(dpdy));
    float i = (abs(fract((p-0.5*w)*0.5)-0.5)-
               abs(fract((p+0.5*w)*0.5)-0.5))/w;
    return 0.5 - 2.0*i;  
}

// https://iquilezles.org/articles/filteringrm
void calcPxy( in vec3 ro, in vec3 rd, in vec3 rdx, in vec3 rdy, in float t, in vec3 nor, out vec3 dpdx, out vec3 dpdy )
{
    dpdx = ro + t*rdx*dot(rd,nor)/dot(rdx,nor);
    dpdy = ro + t*rdy*dot(rd,nor)/dot(rdy,nor);
}


void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec3 tot = vec3(0.0);
    
#if AA>1
    for( int m=0; m<AA; m++ )
    for( int n=0; n<AA; n++ )
    {
        // pixel coordinates
        vec2 o = vec2(float(m),float(n)) / float(AA) - 0.5;
        vec2 p = (2.0*(fragCoord+o)-iResolution.xy)/iResolution.y;
#else    
        vec2 p = (2.0*fragCoord-iResolution.xy)/iResolution.y;
#endif

        //-----------------------------------------------------
        // camera
        //-----------------------------------------------------

        float an = 1.0 - 0.15*iTime;

        vec3 ro = vec3(1.0+6.0*sin(an),1.0,5.0*cos(an));
        vec3 ta = vec3(1.0,0.0,0.0);

        // camera matrix
        vec3 ww = normalize( ta - ro );
        vec3 uu = normalize( cross(ww,vec3(0.0,1.0,0.0) ) );
        vec3 vv = normalize( cross(uu,ww));

        // create view ray
        vec3 rd = normalize( p.x*uu + p.y*vv + 3.0*ww );

        // ray differentials
        vec2 px = (2.0*(fragCoord+vec2(1.0,0.0))-iResolution.xy)/iResolution.y;
        vec2 py = (2.0*(fragCoord+vec2(0.0,1.0))-iResolution.xy)/iResolution.y;
        vec3 rdx = normalize( px.x*uu + px.y*vv + 3.0*ww );
        vec3 rdy = normalize( py.x*uu + py.y*vv + 3.0*ww );
        vec3 drddx = rdx;
        vec3 drddy = rdy;

        //-----------------------------------------------------
        // render
        //-----------------------------------------------------

        vec3 col = clamp( vec3(0.95,0.95,1.0) - 0.75*rd.y, 0.0, 1.0 );
        const vec3 lig = normalize(vec3(-0.2,0.6,0.9));
        float sun = pow( clamp( dot(rd,lig), 0.0, 1.0 ), 8.0 );
        col += 0.7*vec3(1.0,0.9,0.8)*pow(sun,4.0);
        col *= 0.9;
        vec3 bcol = col;

        // raymarch
        vec4 tmat = intersect(ro,rd);
        float t = tmat.x;
        if( tmat.z>-0.5 )
        {
            // geometry
            vec3 pos = ro + t*rd;
            vec3 nor = calcNormal(pos);
            if( tmat.z<0.5 )
                nor = vec3(0.0,1.0,0.0);
            vec3 ref = reflect( rd, nor );


            // derivatives
            vec3 dposdx;
            vec3 dposdy;
            calcPxy( ro, rd, rdx, rdy, t, nor, dposdx, dposdy );


            // materials
            vec3 mate = vec3(1.0);
            vec2 uv = tmat.yw;
            #if COMPUTE_UV==1
                if( tmat.z>0.5 )
                {
                    uv.y = mod(uv.y,6.283185);
                    uv = uv*vec2(10.0,1.0/6.283185) - vec2(0.4*iTime,0.0);
                    #if TEXTURE==0
                    //mate *= 0.5*gridTexture(uv*6.0);
                    mate *= smoothstep(-0.02,0.02,sin(uv.x*6.283185*4.0)*sin(uv.y*6.283185*4.0));
                    #else
                    vec3 te = texture(iChannel0,uv).xyz;
                    mate *= sqrt(te*te*te);
                    #endif
                }
                else
                {
                    #if TEXTURE==0
                          uv.x = 0.025*length(pos.xz);
                    float dudx = 0.025*length(dposdx.xz) - uv.x;
                    float dudy = 0.025*length(dposdy.xz) - uv.x;
                    mate *= 0.5*gridTexture(uv.x*65.0, dudx*65.0, dudy*65.0);
                    #else
                    uv = pos.xz*0.2;
                    vec3 te = texture(iChannel0,uv).xyz;
                    mate *= sqrt(te*te*te);
                    #endif
                }
            #else
                mate *= 0.5*gridTexture(uv.x*80.0);
            #endif
            
            
            

            float occ = calcAO( pos, nor );

            // lighting
            float sky = clamp(0.5+0.5*nor.y,0.0,1.0);
            float dif = max(dot(nor,lig),0.0);
            float bac = max(0.5 + 0.5*dot(nor,-lig),0.0);
            float sha = 0.0; if( dif>0.001 ) sha=softshadow( pos+0.01*nor, lig, 0.0005, 32.0 );
            float fre = clamp( 1.0 + dot(nor,rd), 0.0, 1.0 );
            float spe = max( 0.0, pow( clamp( dot(lig,reflect(rd,nor)), 0.0, 1.0), 8.0 ) );

            // lights
            vec3 brdf = vec3(0.0);
            brdf += 2.5*dif*vec3(1.00,0.90,0.80)*sha;
            brdf += 1.0*sky*vec3(0.15,0.20,0.30)*occ;
            brdf += 1.5*bac*vec3(0.10,0.10,0.10)*occ;
            brdf += 1.0*fre*fre*vec3(1.00,1.00,1.00)*(0.1+0.9*occ*dif);

            // surface-light interacion
            col = mate.xyz* brdf;
            col += spe*vec3(1.0,0.95,0.9)*sha*(0.1+0.9*fre*fre*fre)*occ;

            // fog
            col = mix( col, bcol, smoothstep(10.0,20.0,t) );
        }
		col += 0.4*vec3(1.0,0.8,0.7)*sun;
        tot += col;
#if AA>1
    }
    tot /= float(AA*AA);
#endif
    	
    // gamma
	tot = pow( clamp(tot,0.0,1.0), vec3(0.45) );

	fragColor = vec4( tot, 1.0 );
}
