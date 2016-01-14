
precision mediump float;

uniform sampler2D previous;
uniform vec2 texel;

varying vec2 uv;

void main(){

	vec4 value = texture2D( previous, uv );

	vec2 dx = vec2( texel.x, 0.0 );

	float average = (
		texture2D( previous, uv + dx ).r +
		texture2D( previous, uv - dx ).r
		) * 0.5;


	gl_FragColor = vec4( 0.0, 0.0, 1.0, 1.0 );
}

