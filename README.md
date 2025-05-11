# Shader特效  
 应用于three.js和cesium的shader代码，遵循openglES、webgl1.0、webgl2.0语法              
 
 思路来自于shadertoy ,unity shader等， 
 
 shadertoy，地址：https://www.shadertoy.com/  
 
 vertexshaderart,地址：https://www.vertexshaderart.com/
 
 glslsandbox，地址：https://glslsandbox.com/  
 
 unityShader,冯乐乐版 《unity Shader入门精要》  

 3D数学和基础渲染基础，《3D数学基础：图形与游戏开发》
 
 
 末尾附联系方式，持续不断更新中.... 
# 代码示例 

```
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
```
# 项目截图 

![image](https://github.com/user-attachments/assets/ad25bf3f-800a-4db4-9721-2c8ccef7ac10)
<img width="1280" alt="微信图片_20250511165843" src="https://github.com/user-attachments/assets/54b6c03f-96be-4485-aa83-88ffab5eb96b" />
<img width="1280" alt="微信图片_20250511165839" src="https://github.com/user-attachments/assets/042c0b8c-994c-4aa1-9fb0-5c79ea4dc535" />
<img width="1280" alt="微信图片_20250511165835" src="https://github.com/user-attachments/assets/0e62bcbc-9419-465c-882e-7bf319a96c90" />
<img width="1280" alt="微信图片_20250511165831" src="https://github.com/user-attachments/assets/7afa48c3-025d-4d7c-9c21-e34e7e6c157b" />
<img width="1280" alt="微信图片_20250511165826" src="https://github.com/user-attachments/assets/b1abd70e-3eff-4e95-8a67-d1493f2997e5" />  

# 联系 
 ## 1 更多特效咨询、工作内推（武汉） 

 <img src="https://github.com/user-attachments/assets/16a23a4f-2687-4848-8be7-b39eae562ee1" width="400" height="400"> 
