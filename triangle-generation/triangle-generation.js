"use strict";

var gl;
var points;
var bufferId;


window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //
    //  Initialize our data for the Sierpinski Gasket
    //

    // doesn't work on Windows but does on Linux
    gl.lineWidth(5);
    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Load shaders and initialize attribute buffers

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Load the data into the GPU

    bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );

    // Associate out shader variables with our data buffer

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    render();
};


function render() {
    var angles = {};
    angles.deg = [
        parseInt(document.getElementById("angle1").value),
        parseInt(document.getElementById("angle2").value),
        parseInt(document.getElementById("angle3").value)
    ];
    // sort descending
    angles.deg.sort(function(a, b) {
        return b - a;
    });
    angles.rad = [
        radians(angles.deg[0]),
        radians(angles.deg[1]),
        radians(angles.deg[2])
    ];
    console.log(angles);
    var A = 0.5 * Math.sin(angles.rad[0]) / Math.sin(angles.rad[1]);
    var thirdPt = vec2(A * Math.cos(angles.rad[2]), A * Math.sin(angles.rad[2]));
    var vertices = [
        vec2(0, 0),
        vec2(0.5, 0),
        thirdPt
    ];
    console.log(vertices);
    points = [
        vertices[0], vertices[1],
        vertices[1], vertices[2],
        vertices[2], vertices[0]
    ];
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.LINES, 0, points.length );
}
