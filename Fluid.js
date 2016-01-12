
var Shader 		= require( 'gl-shader' );
var FBO	   		= require( 'gl-fbo' );
var Triangle	= require( 'a-big-triangle' );

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

	this.states = [
		FBO( gl, [ w, h ] ),
		FBO( gl, [ w, h ] )
	];

	console.log( this.states );

	if( mode === '1d' ){

	}

};

Fluid.prototype = {


};