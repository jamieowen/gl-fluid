precision highp float;

uniform sampler2D texture;
uniform vec2 delta;
varying vec2 uv;

void main()
{
    /* get vertex info */
    vec4 info = texture2D(texture, uv);

    /* update the normal */

    vec3 dx = vec3(delta.x, texture2D(texture, vec2(uv.x + delta.x, uv.y)).r - info.r, 0.0);
    vec3 dy = vec3(0.0, texture2D(texture, vec2(uv.x, uv.y + delta.y)).r - info.r, delta.y);
    info.ba = normalize(cross(dy, dx)).xz;

    gl_FragColor = info;
}