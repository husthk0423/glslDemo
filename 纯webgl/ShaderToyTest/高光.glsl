float czm_getSpecular(vec3 lightDirectionEC, vec3 toEyeEC, vec3 normalEC, float shininess)
{
    vec3 toReflectedLight = reflect(-lightDirectionEC, normalEC);  
    float specular = max(dot(toReflectedLight, toEyeEC), 0.0);  
    // pow has undefined behavior if both parameters <= 0.\n   
     // Prevent this by making sure shininess is at least czm_epsilon2.\n   
    return pow(specular, max(shininess, czm_epsilon2));
}