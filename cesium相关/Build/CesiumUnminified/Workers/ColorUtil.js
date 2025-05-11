/**
 * @license
 * Cesium - https://github.com/CesiumGS/cesium
 * Version 1.97
 *
 * Copyright 2011-2022 Cesium Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Columbus View (Pat. Pend.)
 *
 * Portions licensed separately.
 * See https://github.com/CesiumGS/cesium/blob/main/LICENSE.md for full licensing details.
 */

define((function () { 'use strict';

    class ColorUtil {
        constructor()
        {
            this.rgb = [];
            this.alpha = 255;
            this.hex = "";
        }

        fromHex(color)
        {
            color = color.toUpperCase();
            var regexpHex=/^#[0-9a-fA-F]{3,6}$/;//Hex

            if(regexpHex.test(color)){

                var hexArray = [];
                var count=1;

                for(var i=1;i<=3;i++){

                    if(color.length-2*i>3-i){
                        hexArray.push(Number("0x"+color.substring(count,count+2)));
                        count+=2;

                    }else {
                        hexArray.push(Number("0x"+color.charAt(count)+color.charAt(count)));
                        count+=1;
                    }
                }

                this.rgb = hexArray;
                this.hex = color;
            }
        }

        fromRGB(color)
        {
            var regexpRGB=/^(rgb|RGB)\([0-9]{1,3},\s?[0-9]{1,3},\s?[0-9]{1,3}\)$/;//RGB

            if(regexpRGB.test(color)){

                color = color.replace(/(\(|\)|rgb|RGB)*/g,"").split(",");

                var colorHex="#";

                for(var i=0;i<color.length;i++){

                    var hex = Number(color[i]).toString(16);
                    if(hex.length==1) hex = "0"+hex;
                    colorHex+=hex;
                }

                this.rgb = color;
                this.hex = colorHex;
            }
        }
    }

    return ColorUtil;

}));
//# sourceMappingURL=ColorUtil.js.map
