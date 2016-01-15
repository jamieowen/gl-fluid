
var glslify         = require( 'glslify' );
var createShader    = require( 'gl-shader' );
var createFBO       = require( 'gl-fbo' );
var fillScreen      = require( 'a-big-triangle' );

var GlFluid = function( gl, width, height, calculateNormals, fboOpts )
{
    this.gl = gl;

    this.width = width;
    this.height = height;

    if( !fboOpts ){
        fboOpts = {
            preferFloat: true, // TODO : Need to check this.
            float: true
        }
    }

    this.attenuate1 = 0.99;
    this.attenuate2 = 0.98;

    this.wrapAround = false;

    this.calculateNormals = calculateNormals === undefined ? true : calculateNormals;

    this.states = [ createFBO( gl, this.width, this.height, fboOpts ),
                    createFBO( gl, this.width, this.height, fboOpts ) ];

    this.currentState = 0;

    this.updateShader = createShader( gl,
        glslify( './fluid.vert' ),
        glslify( './fluid-update.frag' )
    );

    this.dropShader = createShader(gl,
        glslify( './fluid.vert' ),
        glslify( './fluid-drop.frag' )
    );

    if( this.calculateNormals )
    {
        this.normalsShader = createShader( gl,
            glslify( './fluid.vert' ),
            glslify( './fluid-normals.frag' )
        );
    }

};

module.exports = function( gl, width, height )
{
    var fluid = new GlFluid( gl, width, height );
    return fluid;
};

GlFluid.prototype =
{
    simulate : function()
    {
        var gl = this.gl;

        var prevState    = this.states[ this.currentState ];
        var currentState = this.states[ this.currentState ^= 1 ];

        this.updateShader.bind();
        this.updateShader.uniforms.previous = prevState.color[0].bind();
        this.updateShader.uniforms.texel = [ 1.0 / this.width, 1.0 / this.height ];

        this.updateShader.uniforms.attenuate1 = this.attenuate1;
        this.updateShader.uniforms.attenuate2 = this.attenuate2;

        this.updateShader.uniforms.wrapAround = this.wrapAround;

        currentState.bind(); // bind fbo as drawing buffer.
        fillScreen( gl );
        gl.bindFramebuffer( gl.FRAMEBUFFER, null );

        if( this.calculateNormals )
        {
            prevState    = this.states[ this.currentState ];
            currentState = this.states[ this.currentState ^= 1 ];

            this.normalsShader.bind();
            this.normalsShader.uniforms.delta = this.updateShader.uniforms.texel;
            this.normalsShader.uniforms.texture = prevState.color[0].bind();

            currentState.bind();
            fillScreen( gl );
            gl.bindFramebuffer( gl.FRAMEBUFFER, null );
        }
    },

    addDrop: function( x, y, radius, strength )
    {
        var gl = this.gl;

        var prevState    = this.states[ this.currentState ];
        var currentState = this.states[ this.currentState ^= 1];

        x -= this.width/2;
        y -= this.height/2;

        this.dropShader.bind();
        this.dropShader.uniforms.center = [ x / this.width * 2, y / this.height * 2 ];
        this.dropShader.uniforms.strength = strength;
        this.dropShader.uniforms.radius = radius;
        this.dropShader.uniforms.fbo = prevState.color[0].bind();

        currentState.bind();
        fillScreen( gl );

        gl.bindFramebuffer( gl.FRAMEBUFFER, null );
    }

};

Object.defineProperties( GlFluid.prototype, {

    texture: {
        get : function(){
            return this.states[this.currentState].color[0];
        }
    }
});