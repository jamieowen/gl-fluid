
var Shader 		 = require( 'gl-shader' );
var FBO 		 = require( 'gl-fbo' );
var drawTriangle = require( 'a-big-triangle' );
var glslify 	 = require( 'glslify' );

var defaultOpts = {

	width: 256,
	height: 256,
	mode: '2d',

	wrap: true

};

var Fluid = function( gl, opts ){

	var w = opts.width || defaultOpts.width;
	var h = opts.height || defaultOpts.height;
	var mode = opts.mode || defaultOpts.mode;
	var wrap = opts.wrap || defaultOpts.wrap;

	this.gl	= gl;

	this._current = 0;
	this._mode 	  = mode;
	this._texel   = [ 1 / w, 1 / h ];
	this._shape   = [ w, h ];

	this.states = [
		FBO( gl, [ w, h ] ),
		FBO( gl, [ w, h ] )
	];

	this.states[0].wrap = gl.MIRRORED_REPEAT;
	this.states[1].wrap = gl.MIRRORED_REPEAT;

	var vs = glslify( './glsl/fluid.vert' );
	var fs;

	if( mode === '1d' ){
		fs = glslify( './glsl/fluid1d.frag' );
	}else
	if( mode === '2d' ){
		fs = glslify( './glsl/fluid2d.frag' );
	}

	this._shader = Shader( gl, vs, fs );

};

var create = function( gl, opts ){
	return new Fluid( gl, opts );
};

create.Fluid = Fluid;
module.exports = create;

Fluid.prototype = {

	update: function(){

		var gl = this.gl;

		var prev = this.states[ this._current ];
		var next = this.states[ this._current ^= 1 ];

		this._shader.bind();
		this._shader.uniforms.applyDrop = false;
		this._shader.uniforms.previous = prev.color[0].bind(0);
		this._shader.uniforms.texel = this._texel;

		next.bind();
		drawTriangle( gl );
		gl.bindFramebuffer( gl.FRAMEBUFFER, null );

	},

	droplet: function( x, y, scale, strength, texture ){

		var gl = this.gl;

		if( this._mode === '1d' ){
			// fake for now.
			//x = 1;
			//y = 10;
			console.log( x, y );
		}

		var prev = this.states[ this._current ];
		var next = this.states[ this._current ^= 1 ];

		if( typeof scale === 'number' ){
			scale = [ scale, scale ];
		}

		var shape = this._shape;//.slice(0,this._shape.length);
		//shape[1] = 256 * 1.01;
		//shape[0] = 256 * 0.99; // this gives some nice effects
		//shape[1] = 1;

		var scaleX   = texture.shape[0] * scale[0];
		var scaleY   = texture.shape[1] * scale[1];

		this._shader.bind();
		this._shader.uniforms.previous = prev.color[0].bind(0);
		this._shader.uniforms.applyDrop = true;
		this._shader.uniforms.droplet = texture.bind(1);

		this._shader.uniforms.drop_position = [ x, shape[1] - y ];
		this._shader.uniforms.drop_scale 	= [ scaleX, scaleY ];
		this._shader.uniforms.drop_strength = strength;

		if( this._mode === '1d' ){
			this._shader.uniforms.min = ( shape[1] - y ) - 1;
			this._shader.uniforms.max = ( shape[1] - y );
		}

		next.bind();

		//gl.viewport( 0, y-1, shape[0], shape[1] );
		//gl.viewport( 0,this._shape[y]/2, this._shape[0],this._shape[1] );
		//gl.viewport( -212,10, 0, 512 - 256 );

		drawTriangle(gl);
		gl.bindFramebuffer( gl.FRAMEBUFFER, null );

	},

	texture: function(){

		return this.states[ this._current ].color[0];

	}

};