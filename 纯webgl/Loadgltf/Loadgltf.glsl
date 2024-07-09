// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
// Created by S.Guillitte

#iChannel1 "https://66.media.tumblr.com/tumblr_mcmeonhR1e1ridypxo1_500.jpg"

void main() {
   vec2 uv = (gl_FragCoord.xy / iResolution.xy);
   vec4 color=texture2D(iChannel1,uv);
   gl_FragColor=color;
}