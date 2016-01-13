
//var glslify 	  = require( 'glslify' );
//var createContext = require( 'gl-context' );
//var createShader  = require( 'gl-shader' );


//var Batch 	= require( 'gl-sprite-batch' );

var Fluid = require( '../Fluid' );


window.onload = function(){

	console.log( 'OK' );

	var raf = requestAnimationFrame;



	var canvas = document.createElement( 'canvas' );
	canvas.width = canvas.height = 500;
	document.body.appendChild( canvas );

	var gl = canvas.getContext( 'webgl' ) || canvas.getContext( 'webgl-experimental' ) || canvas.getContext( 'experimental-webgl' );

	var fluid1d = Fluid( gl, {

		width: 256,
		height: 32,
		mode: '1d',
		wrap: false

	});

	var fluid2d = Fluid( gl, {

		width: 512,
		height: 512,
		mode: '2d',
		wrap: true

	});

	console.log( fluid1d, fluid2d );

	gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
	gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

	//var batch = Batch( gl,{ dynamic:true } );



	raf( function render(){

		fluid2d.update();

		raf( render );
	});



};