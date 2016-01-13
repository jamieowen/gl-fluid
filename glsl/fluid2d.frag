
precision mediump float;

uniform sampler2D previous;
uniform vec2 texel;

varying vec2 uv;

void main(){

	vec4 value = texture2D( previous, uv );

	vec2 dx = vec2( texel.x, 0.0 );
	vec2 dy = vec2( 0.0, texel.y );

	float average = (
		texture2D( previous, uv + dx ).r +
		texture2D( previous, uv - dx ).r +
		texture2D( previous, uv + dy ).r +
		texture2D( previous, uv - dy ).r
		) * 0.25;


	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}

