attribute vec2 position;
varying vec2 uv;

// a-big-triangle vertex shader....

void main()
{
    gl_Position = vec4(position,0.0,1.0);
    uv = 0.5 * (position+1.0);
}