
precision mediump float;

uniform sampler2D previous;
uniform vec2 texel;

uniform sampler2D droplet;
uniform bool applyDrop;

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

	if( applyDrop ){
		//average = texture2D( droplet, uv ).r;
		//average = 0.2;
		//gl_FragColor = vec4( vec4( vec3( average ) , 1.0 );
		gl_FragColor = vec4( 1.0, 0.2, 0.5, 1.0 );
	}else{
		gl_FragColor = vec4( 0.5, 0.5, 0.5, 1.0 );
	}

	//average *= 0.9;


}

