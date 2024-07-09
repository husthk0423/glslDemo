

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



       //自定义光照模型
        vec4 CustomLightModel(vec3 v_positionEC,vec3 normal,vec3 diffuseColor,vec3 objectColor, vec3 sunPostionWC)
        {
           //太阳的世界坐标
           //vec3 p1 = vec3(-102129261722.38126,-97061756857.52246,56015807994.99599);
           vec4 targetCol=vec4(1.0);
            //太阳的视坐标
           vec3 tempLightDirectionEC= normalize(czm_viewRotation3D * sunPostionWC);
           float spec=0.0;
           float customalpha=0.5;
           vec3  specular=vec3(0.0);
           vec3 diffuse=vec3(0.0);

           //环境光
           float ambientStrength = 0.1;
           vec3 ambient = ambientStrength * czm_lightColor;
   
          //漫反射
           vec3 diffuse =diffuseColor;
           //镜面反射
           vec3 normEC = normalize(normal);
           float specularStrength = 0.25*(clamp(LightReflectSize,0.,1.));//光斑大小
           vec3 reflectDir = reflect(tempLightDirectionEC, normEC);
           vec3 normPositionEC = normalize(v_positionEC);
           spec = pow(max(dot(vec3(-normPositionEC), normalize(reflectDir)) * 3.0, 0.), 3.*(clamp(Lightgrade,0.,1.)));//光斑亮度
           specular= specularStrength * spec * czm_lightColor;
         

           //光照方程(环境光+漫反射+镜面反射)
           vec3 result = (ambient + diffuse + specular) * objectColor;
           targetCol=vec4(result,customalpha);
           return targetCol;
        }