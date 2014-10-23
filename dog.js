//gl function and canvas
var canvas;
var gl;

//Number of vertices in a cube
var NUM_VERTICES  = 36;

var NUM_TIMES_SUBDIVIDE = 5;

//max and min speeds
var MAX_SPEED = 20;
var MIN_SPEED = -20;

var gl;

//used to pause the animation
var isAnimating = true;

//modelView of the cube
var modelViewLoc;


/* ********************* */
var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0);
var lightDiffuse = vec4(1.0, 1.0, 1.0, 1.0);
var lightSpecular = vec4(1.0, 1.0, 1.0, 1.0);


var ambientColor, diffuseColor, specularColor;
var lightPosition;

var reflectAmbient, reflectDiffuse, reflectSpecular;

var color, ambient, diffuse, specular;

var ambientProduct;


//model view stack
var modelViewStack = [];

//Initial view matrix (Identity)
var globalView = mat4(
	1.0, 0.0, 0.0, 0.0,
	0.0, 1.0, 0.0, 0.0,
	0.0, 0.0, 1.0, 0.0,
	0.0, 0.0, 0.0, 1.0 );

//Array of cube points
var points = [];
//Array of solid colors
var solidColors = [];
//Array of gradient colors
var gradientColors = [];

var va = vec4(0.0, 0.0, -1.0, 1);
var vb = vec4(0.0, 0.942809, 0.333333, 1);
var vc = vec4(-0.816497, -0.471405, 0.333333, 1);
var vd = vec4(0.816497, -0.471405, 0.333333, 1);

//Vertices of the cube
var vertices = [
	va, vb, vd,
	va, vc, vb,
	va, vc, vd,
	vb, vc, vd
];

//Color vertices used to color the cube
var colorVertices = [
	vec4(1.0, 0.0, 0.0, 1.0), 		//red
	vec4(1.0, 1.0, 1.0, 1.0),  		//white
	vec4(0.0, 1.0, 0.0, 1.0),  		//green
	vec4(0.0, 1.0, 1.0, 1.0), 		//cyan
	vec4(0.0, 0.0, 1.0, 1.0),  		//blue
	vec4(1.0, 0.0, 1.0, 1.0),		//magenta
	vec4(1.0, 1.0, 0.0, 1.0),		//yellow
	vec4(0.0, 0.0, 0.0, 1.0),		//Black
];

function tetrahedron(a, b, c, d, n) {
	divideTriangle(a, b, c, n);
	divideTriangle(d, c, b, n);
	divideTriangle(a, d, b, n);
	divideTriangle(a, c, d, n);
}

function divideTriangle(a, b, c, count) {
	if(count > 0) {
		var ab = normalize(mix(a, b, 0.5), true);
		var ac = normalize(mix(a, c, 0.5), true);
		var bc = normalize(mix(b, c, 0.5), true);
		divideTriangle(a, ab, ac, count - 1);
		divideTriangle(ab, b, bc, count - 1);
		divideTriangle(bc, c, ac, count - 1);
		divideTriangle(ab, bc, ac, count - 1);
	}
	else {
		triangle(a, b, c);
	}
}

function triangle(a, b, c) {
	points.push(a);
	points.push(b);
	points.push(c);
}

function setColors() {
	for(var i = 0; i < points.length; i++) {
		solidColors.push(colorVertices[i % 8]);
	}
}

window.onload = function init()
{
	//create the canvas and do gl set up calls
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
    
    gl.viewport( 0, 0, canvas.width, canvas.height );
    
    gl.clearColor( 0.5, 0.5, 0.5, 1.0 );
    gl.enable( gl.DEPTH_TEST ); 
    
    //Initialize shaders
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    
    gl.useProgram( program );
    
	//points = vertices;
	tetrahedron(va, vb, vc, vd, NUM_TIMES_SUBDIVIDE);
	setColors();
	
    //Setting and binding buffers
    vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );
    
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

	modelViewLoc = gl.getUniformLocation(program, "mvMatrix");
	//set the projection matrix
	var projectionMatrix = ortho(-2, 2, -2, 2, -2, 2);
	gl.uniformMatrix4fv( gl.getUniformLocation(program, "projectionMatrix"),  false, flatten(projectionMatrix) );
    
	//begin the render loop
	render();
}

function generateLightingModel() {
	ambientProduct = mult(lightAmbient, materialAmbient);
}

//Switches the color buffer
function setColorBuffer(colorArray)
{
	cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colorArray), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );
}

//Render loop to animate and manipulate the cubes
function render()
{

	/*if(isAnimating)
	{
		rotation = (rotation + speed) % 360;
		cubeSpinTheta[1] = (cubeSpinTheta[1] + 2) % 360;
		//cubeThetaGradient[1] = (cubeThetaGradient[1] + 2) % 360;
	} */
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	/*var mv = globalView;
	
	//spin the matrix to apply spin to the cube
	mv = mult(rotate(cubeSpinTheta[1], 0, 1, 0), mv);
	
	//push first instance of centered scaled modelView
	modelViewStack.push(mv);

	//Create the first 3 subgroups
	createSubgroups(mv, NUM_OF_SUBGROUPS, 8, -1);

	for(var i = 0; i < NUM_OF_SUBGROUPS; i++)
	{
		//grab the first view on the stack
		mv = modelViewStack.pop();
		//Create the cubes in each subgroup
		createSubgroups(mv, NUM_OF_CUBES, 4, 1);
		//Draw the cubes from the stack
		for(var j = 0; j < NUM_OF_CUBES; j++)
		{
			//set solid or gradient colors and offsets
			if(j % 2 == 0)
			{
				gl.uniform3fv(cubeThetaLoc, cubeThetaGradient);
				setColorBuffer(gradientColors);
			}
			else
			{
				gl.uniform3fv(cubeThetaLoc, cubeThetaSolid);
				setColorBuffer(solidColors);
			}
			//popl the view from the stack and draw
			mv = modelViewStack.pop();
			gl.uniformMatrix4fv(modelViewLoc, false,  flatten(mv));
			
		}
	} */
	setColorBuffer(solidColors);
	gl.drawArrays( gl.TRIANGLES, 0, points.length );
	
    requestAnimFrame( render );
}

