#iChannel1  "file://waternormals.jpg"
uniform float time;
void main(void)
{

     
    vec2 UV0=( gl_FragCoord.xy / 103.0 ) + vec2(time / 17.0, time / 29.0);
    vec2 UV1 = gl_FragCoord.xy / 107.0-vec2( time / -19.0, time / 31.0 );
    vec2 UV2 = gl_FragCoord.xy/vec2( 8907.0, 9803.0 ) + vec2( time / 101.0, time / 97.0 );
    vec2 UV3 = gl_FragCoord.xy/ vec2( 1091.0, 1027.0 ) - vec2( time / 109.0, time / -113.0 );


    // vec2 UV0=( gl_FragCoord.xy / 103.0 ) + vec2(time / 17.0, time / 29.0);
    // vec2 UV1 = gl_FragCoord.xy / 107.0-vec2( time / -19.0, time / 31.0 );
    // vec2 UV2 = gl_FragCoord.xy/vec2( 8907.0, 9803.0 ) + vec2( time / 101.0, time / 97.0 );
    // vec2 UV3 = gl_FragCoord.xy/ vec2( 1091.0, 1027.0 ) - vec2( time / 109.0, time / -113.0 );

    
    
    vec4 color=texture2D(iChannel1,UV0)+texture2D(iChannel1,UV1)+texture2D(iChannel1,UV2)+texture2D(iChannel1,UV3);

    // vec4 color=texture2D(iChannel1,UV0)+texture2D(iChannel1,UV1)+texture2D(iChannel1,UV2);
    // gl_FragColor=color;
    gl_FragColor=((color*0.5)-1.0)*vec4( 1.5, 1.2, 1.5,1.0);
}

