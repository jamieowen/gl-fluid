
precision mediump float;

uniform sampler2D previous;
uniform vec2 texel;

uniform sampler2D droplet;
uniform bool applyDrop;
uniform vec2 drop_position;
uniform float drop_scale;
uniform float drop_strength;

varying vec2 uv;

void main(){

    // r = height
    // g = velocity

	if( applyDrop ){

		vec4 value = texture2D( previous, uv );

		vec2 size = vec2( 256.0, 256.0 );
 		vec2 samp = gl_FragCoord.xy - drop_position + ( size.xy * 0.5 );
		vec2 uv = samp / ( size * drop_scale );

		vec4 drop = texture2D( droplet, uv );

		//value.r = ( drop.r * drop.a );
		value.r += ( drop.r * drop.a );

		gl_FragColor = value;

	}else{

		vec4 value = texture2D( previous, uv );

		vec2 dx = vec2( texel.x, 0.0 );
		vec2 dy = vec2( 0.0, texel.y );

		float average = (
			texture2D( previous, uv + dx ).r +
			texture2D( previous, uv - dx ).r +
			texture2D( previous, uv + dy ).r +
			texture2D( previous, uv - dy ).r
			) * 0.25;

		value.g += ( average - value.r ) * 1.1;

		//value.g *= 0.95;
		value.r += value.g;
		value.r *= 0.94;

		value.b = 0.3;
		value.a = 1.0;
		gl_FragColor = value;

	}

	//average *= 0.9;

}

