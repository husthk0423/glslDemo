#iChannel1  "file://river1.png"
#iChannel2  "file://river2.png"


void main() {


   //时间参数
   //********************************************************************
   //iGlobalTime,iTime 都是shaderToy中封装的时间，在外部用Uniform要重新赋值
  //  vec3 _color=vec3(iGlobalTime*0.1);
  //  gl_FragColor=vec4(_color,1.0);
   
   //or
   // vec3 _color=vec3(iTime*0.1);
   // gl_FragColor=vec4(_color,1.0);

   

   //动起来
   //利用时间参数动态改变UV
   //**********************************************************************
   float _t=mod(iTime,4.)/4.;
   vec2 uv = gl_FragCoord.xy/vec2(iResolution.x,_t);
  //  vec2 uv = gl_FragCoord.xy/vec2(_t,iResolution.y);
   vec4 color=texture2D(iChannel1,uv/2.);
   gl_FragColor=color;
    




  //噪声()






  
   //透明






   //镜面反射(因子)

  


  //漫反射(因子)
    




 

}
