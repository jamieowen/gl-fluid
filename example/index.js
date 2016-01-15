
var glslify			= require( 'glslify' );

var Texture			= require( 'gl-texture2d' );
var Shader			= require( 'gl-shader' );
var Fluid 			= require( '../Fluid' );

var drawTriangle 	= require( 'a-big-triangle' );

var baboon			= require( 'baboon-image' );

window.onload = function(){

	console.log( 'OK' );

	var raf = requestAnimationFrame;

	var canvas = document.createElement( 'canvas' );
	canvas.width = canvas.height = 512;
	document.body.appendChild( canvas );

	var gl = canvas.getContext( 'webgl' ) || canvas.getContext( 'webgl-experimental' ) || canvas.getContext( 'experimental-webgl' );

	var shader = Shader( gl,
		glslify( '../glsl/fluid.vert' ),
		glslify( './texture.frag' )
	);

	//var babs = Texture( gl, baboon );

	var fluid1d = Fluid( gl, {

		width: 256,
		height: 128,
		mode: '1d',
		wrap: false

	});

	var fluid2d = Fluid( gl, {

		width: 256,
		height: 256,
		mode: '2d',
		wrap: true

	});

	var drop = document.createElement( 'img' );
	drop.style.backgroundColor = '#00ffff';
	drop.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAYAAABccqhmAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA4ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDowOTc2YTkzNi05ZDdlLTRmY2ItODFjNC01ODEwMTdhNjhhNDEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MDUwNzBFRkFCMjczMTFFNThEODA4RUVBNkI5MEE2NjYiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MDUwNzBFRjlCMjczMTFFNThEODA4RUVBNkI5MEE2NjYiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDowOTc2YTkzNi05ZDdlLTRmY2ItODFjNC01ODEwMTdhNjhhNDEiIHN0UmVmOmRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDo5NzdkMTUxZC1mYWQwLTExNzgtYjZk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';
	document.body.appendChild( drop );

	var dropTex = null;
	drop.onload = function(){
		dropTex = Texture( gl, drop );
	};

	console.log( fluid1d, fluid2d );

	//fluid2d.droplet( 128, 128, 1.0, )

	var down = false;
	var pos  = { x:0,y:0 };

	canvas.addEventListener( 'mousedown', function(ev){
		down = true;
		setPosition( ev );
	});
	window.addEventListener( 'mouseup', function(){
		down = false;
	});
	canvas.addEventListener( 'mousemove', function( ev ){
		setPosition( ev );
	});
	var setPosition = function( ev ){
		pos.x = ev.offsetX;
		pos.y = ev.offsetY;
	};


	raf( function render(){

		gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
		gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

		if( down ){
			if( pos.x < 256 && pos.y < 256 ){
				fluid2d.droplet( pos.x, pos.y, 0.1, 1.0, dropTex );
			}
		}

		fluid1d.update();
		fluid2d.update();

		// draw previews..

		shader.bind();

		var h = gl.canvas.height;

		fluid2d.texture().bind();
		gl.viewport( 0, h-256, 256, 256 );
		drawTriangle(gl);

		//fluid1d.texture().bind();
		//gl.viewport( 256, 0, 256, 512 );
		//drawTriangle(gl);

		raf( render );
	});



};