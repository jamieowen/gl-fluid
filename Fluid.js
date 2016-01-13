
var Shader 		 = require( 'gl-shader' );
var FBO	   		 = require( 'gl-fbo' );
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

	this.states = [
		FBO( gl, [ w, h ] ),
		FBO( gl, [ w, h ] )
	];

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
		this._shader.uniforms.previous = prev.color[0].bind();

		next.bind();
		drawTriangle( gl );
		gl.bindFramebuffer( gl.FRAMEBUFFER, null );

	},

	brush: function( x, y, strength, texture, region ){

		if( !region ){
			region = {
				scale: 1,
				width: 32,
				height: 32
			}
		}

	}

};