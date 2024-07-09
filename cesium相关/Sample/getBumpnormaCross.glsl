    vec3 getBumpnormaCross(vec2 st)
        {
            //水波时间
            float timeInterval=200.;
            float _WaveXSpeed=-0.005;
            float _WaveYSpeed=-0.111;  
            
            
            float o1, o2 = 0.;
            float cycle = mod(czm_frameNumber, timeInterval)/timeInterval;
            float mv = getMixValue(cycle, o1, o2);
            float _time=getInterval(timeInterval);
         
            //往上流
            vec2 shang_speed = _time* vec2(_WaveXSpeed, -_WaveYSpeed);
            //往下流
            vec2 xia_speed =vec2(_WaveXSpeed, _WaveYSpeed);
            vec2 xia_speed1 =vec2(-_WaveXSpeed, _WaveYSpeed);
             //往左流
            vec2 zuo_speed = _time* vec2(_WaveXSpeed, _WaveYSpeed);    
              //往右流
            vec2 you_speed = _time* vec2(-_WaveXSpeed, -_WaveYSpeed);
            vec3 bump1 = texture2D(WaveImage, fract(RepeatX*st)).rgb; 
            vec3 bump2 = texture2D(WaveImage, fract(RepeatX*st+o1*xia_speed)).rgb; 
            //叉乘得到法线分量
            vec3 bumpnormaCross1 = normalize(cross(bump1, bump2));
            vec3 bump3 =texture2D(WaveImage, fract(RepeatX*st)).rgb; 
            vec3 bump4 = texture2D(WaveImage, fract(RepeatX*st+o2*xia_speed1)).rgb; 
            //叉乘得到法线分量分量
            vec3 bumpnormaCross2 = normalize(cross(bump3, bump4));
            // //得到新的分量,保证水流连续
            vec3 bumpnormaCross=normalize(mix(bumpnormaCross2, bumpnormaCross1, mv));
    
            return bumpnormaCross;
            
        }