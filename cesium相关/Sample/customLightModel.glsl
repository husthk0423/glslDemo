    vec4 CustomLight(vec3 normal,vec3 objectColor,float alpha)
    {
        //模拟光源方向(视图空间下)
        //console.log(viewer.scene.frameState.context.uniformState.lightDirectionEC);
        vec3 tempLightDirectionEC=vec3(-0.906973302953148,-0.024183740332040272,-0.42049325135346627);
        float spec=0.0;         
        //环境光
        float ambientStrength = 0.1;
        vec3 ambient = ambientStrength * czm_lightColor;
        //漫反射
        vec3 normEC = normalize(normal);
        float diff = max(dot(normEC, tempLightDirectionEC), 0.0);
        vec3 diffuse = diff * czm_lightColor;
        //镜面反射
        float specularStrength = 0.1;//光斑大小
        vec3 reflectDir = reflect(-tempLightDirectionEC, normEC);  
        spec = pow(max(dot(vec3(1.0), reflectDir), 0.0), 10.);//光斑亮度
        vec3 specular = specularStrength * spec * czm_lightColor;
        //光照方程(环境光+漫反射+镜面反射)
        vec3 result = (ambient + diffuse + specular) * objectColor;
        targetCol=vec4(result,alpha);
        return targetCol;
    }


    vec4 CustomLight(vec3 normal,vec3 diffuseColor,float alpha)
    {
        //模拟光源方向(视图空间下)
        //console.log(viewer.scene.frameState.context.uniformState.lightDirectionEC);
        vec3 tempLightDirectionEC=vec3(-0.906973302953148,-0.024183740332040272,-0.42049325135346627);
        float spec=0.0;  
        vec3 normEC = normalize(normal);       
        //环境光
        float ambientStrength = 0.1;
        vec3 ambient = ambientStrength * czm_lightColor;
        //漫反射
        vec3 diffuse =diffuseColor;
        //镜面反射
        float specularStrength = 0.05;//光斑大小
        vec3 reflectDir = reflect(-tempLightDirectionEC, normEC);  
        spec = pow(max(dot(vec3(1.0), reflectDir), 0.0), 10.);//光斑亮度
        vec3 specular = specularStrength * spec * czm_lightColor;
        //光照方程(环境光+漫反射+镜面反射)
        vec3 result = (ambient + diffuse + specular);
        targetCol=vec4(result,alpha);
        return targetCol;
    }



    SDK篇:
        1、拆分和分析“小浪底”特效实现方式（粒子特效+傅里叶快速变换+多个纹理坐标拆分）
        2、研究完成水流8个方向的二维向量
        3、编写弯曲水流流向Demo
        4、流动水效果加上颜色，亮度，流速参数
        5、高光（镜面反射）底层渲染逻辑研究,并编写镜面反射示例
        6、集成镜面反射在倒影水特效中，修改流动水中镜面反射
        7、整理和配合封装盒子裁剪和压平效果
        8、自定义光照模型(绕开czm_phong光照,可以自定义光源方向，不再依赖环境光实现高光效果)，
    项目支持篇:
        1、了解和熟悉tudou3d,火星3D
        2、抓取火星3.4.26中积雪shader(代表也覆盖雪）
        3、抓取火星火星3.5积雪效果（3dtiles中CustomShader,只在倾斜数据上积雪）
        4、解决鹤壁倾斜数据压平bug