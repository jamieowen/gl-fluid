
precision highp float;

uniform sampler2D previous;
uniform vec2 texel;

uniform float attenuate1;
uniform float attenuate2;

uniform bool wrapAround;

varying vec2 uv;

void main()
{
    vec4 fluid = texture2D(previous,uv);

    float average = 0.0;

    if( wrapAround )
    {
        vec2 up = vec2( uv.x, mod( uv.y + texel.y, 1.0 ) );
        vec2 down = vec2( uv.x, mod( uv.y - texel.y, 1.0 ) );

        vec2 left = vec2( mod( uv.x + texel.x, 1.0 ), uv.y );
        vec2 right = vec2( mod( uv.x - texel.x, 1.0 ), uv.y );

        average = (
            texture2D(previous, up).r +
            texture2D(previous, down).r +
            texture2D(previous, left).r +
            texture2D(previous, right).r
            ) * 0.25;
    }else{
        vec2 dx = vec2( texel.x, 0.0 );
        vec2 dy = vec2( 0.0, texel.y );

        average = (
            texture2D(previous, uv + dx).r +
            texture2D(previous, uv - dx).r +
            texture2D(previous, uv + dy).r +
            texture2D(previous, uv - dy).r
            ) * 0.25;
    }


    // r = height
    // g = velocity

    /* change the velocity to move toward the average */
    fluid.g += ( average - fluid.r ) * 2.0;

    /* attenuate the velocity a little so waves do not last forever */
    fluid.g *= attenuate1;
    //fluid.g *= 0.595;


    fluid.r += fluid.g;

    fluid.r *= attenuate2; // original seemed to have build up of r, that raised height

    gl_FragColor = fluid;
}

