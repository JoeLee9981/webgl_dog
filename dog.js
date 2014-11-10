

/****** SCALE MATRICES *********/

var torsoScaleMat = mat4(
	1.0, 0.0, 0.0, 0.0,
	0.0, 0.5, 0.0, 0.0,
	0.0, 0.0, 0.5, 0.0,
	0.0, 0.0, 0.0, 1.0
);

var upperLegScaleMat = mat4(
	0.2, 0.0, 0.0, 0.0,
	0.0, 0.5, 0.0, 0.0,
	0.0, 0.0, 0.2, 0.0,
	0.0, 0.0, 0.0, 1.0
);

var lowerLegScaleMat = mat4(
	0.18, 0.0, 0.0, 0.0,
	0.0, 0.47, 0.0, 0.0,
	0.0, 0.0, 0.18, 0.0,
	0.0, 0.0, 0.0, 1.0
);

var headScaleMat = mat4(
	0.48, 0.0, 0.0, 0.0,
	0.0, 0.48, 0.0, 0.0,
	0.0, 0.0, 0.48, 0.0,
	0.0, 0.0, 0.0, 1.0
);

var snoutScaleMat = mat4(
	0.45, 0.0, 0.0, 0.0,
	0.0, 0.38, 0.0, 0.0,
	0.0, 0.0, 0.48, 0.0,
	0.0, 0.0, 0.0, 1.0
);

var noseScaleMat = mat4(
	0.1, 0.0, 0.0, 0.0,
	0.0, 0.1, 0.0, 0.0,
	0.0, 0.0, 0.1, 0.0,
	0.0, 0.0, 0.0, 1.0
);

var eyeScaleMat = mat4(
	0.03, 0.0, 0.0, 0.0,
	0.0, 0.18, 0.0, 0.0,
	0.0, 0.0, 0.18, 0.0,
	0.0, 0.0, 0.0, 1.0
);

var pupilScaleMat = mat4(
	1.0, 0.0, 0.0, 0.0,
	0.0, 0.5, 0.0, 0.0,
	0.0, 0.0, 0.5, 0.0,
	0.0, 0.0, 0.0, 1.0
);

var earScaleMat = mat4(
	0.1, 0.0, 0.0, 0.0,
	0.0, 0.5, 0.0, 0.0,
	0.0, 0.0, 0.25, 0.0,
	0.0, 0.0, 0.0, 1.0
);

var tailScaleMat = mat4(
	0.1, 0.0, 0.0, 0.0,
	0.0, 0.7, 0.0, 0.0,
	0.0, 0.0, 0.1, 0.0,
	0.0, 0.0, 0.0, 1.0
);

var groundScale = mat4(
	20.0, 0.0, 0.0, 0.0,
	0.0,  1.0, 0.0, 0.0,
	0.0, 0.0, 20.0, 0.0,
	0.0, 0.0, 0.0, 1.0 );
	
/******************************************/


//Number of vertices in a cube
var NUM_VERTICES  = 36;

var NUM_TIMES_SUBDIVIDE = 5;

var BLACK = vec4(0.0, 0.0, 0.0, 1.0);
var WHITE = vec4(1.0, 1.0, 1.0, 1.0);

var CHROME_AMBI = vec4(0.25, 0.25, 0.25, 1.0);
var CHROME_DIFF = vec4(0.4, 0.4, 0.4, 1.0);
var CHROME_SPEC = vec4(0.774597, 0.774597, 0.774597, 1.0);
var CHROME_SHIN = 76.8;

var MAX_X = 5;
var MIN_X = -5;

//gl function and canvas
var canvas;
var gl;

//used to pause the animation
var isAnimating = true;

//modelView of the cube
var modelViewLoc;
var eye;
var at = vec3(0.0, 0.0, 0.0);
var up = vec3(0.0, 1.0, 0.0);

var lightDirection = vec4(0.0, -1.0, -1.0, 1.0);
var viewHeight = 0;

/* ********************* */


//model view stack
var modelViewStack = [];
var projectionMatrix;

//Initial view matrix (Identity)
var identityMat = mat4(
	1.0, 0.0, 0.0, 0.0,
	0.0, 1.0, 0.0, 0.0,
	0.0, 0.0, 1.0, 0.0,
	0.0, 0.0, 0.0, 1.0 );

//Array of cube points
var points = [];
var normals = [];

var va = vec4(0.0, 0.0, -1.0, 1);
var vb = vec4(0.0, 0.942809, 0.333333, 1);
var vc = vec4(-0.816497, -0.471405, 0.333333, 1);
var vd = vec4(0.816497, -0.471405, 0.333333, 1);

var groundVertices = [
	vec4(-1.0, -1.3, -1.0),
	vec4( 1.0, -1.3,  1.0),
	vec4( 1.0, -1.3, -1.0),
	vec4(-1.0, -1.3, -1.0),
	vec4( 1.0, -1.3,  1.0),
	vec4(-1.0, -1.3,  1.0)
];
var groundNormals = [
	vec4(-1.0, -1.3, -1.0),
	vec4( 1.0, -1.3,  1.0),
	vec4( 1.0, -1.3, -1.0),
	vec4(-1.0, -1.3, -1.0),
	vec4( 1.0, -1.3,  1.0),
	vec4(-1.0, -1.3,  1.0)
];

var distance = 4;
var theta = Math.PI / 2;

var near = 0.3;
var far = 3.0;
var fovy = 40.0; 
var aspect = 1.0; 

var legTheta = 0;
var tailTheta = 0;
var legDirection = 1;
var tailDirection = 1;

var dogPos = vec3(0.0, 0.0, 0.0);
var speed = .002;
var dogDirection = -1;

var left = -1.0;
var right = 1.0;
var bottom = -1.0;
var top = 1.0;
var near = 1.0;
var far = 10.0;

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
	normals.push(a);
	normals.push(b);
	normals.push(c);
	
	points.push(a);
	points.push(b);
	points.push(c);
}

window.onload = function init()
{
	//create the canvas and do gl set up calls
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
    
    gl.viewport( 0, 0, canvas.width, canvas.height );
    
    gl.clearColor( 0.5, 0.5, 0.5, 1.0 );
	gl.clearDepth(100.0);
    gl.enable( gl.DEPTH_TEST ); 
	gl.depthFunc(gl.LEQUAL);
	//gl.viewport(10, 10, 10, 10);
    
    //Initialize shaders
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    
    gl.useProgram( program );
   
	tetrahedron(va, vb, vc, vd, NUM_TIMES_SUBDIVIDE);
	
	setSphereBuffers();
	normals = normalize(flatten(normals));
	groundNormals = normalize(flatten(groundVertices));
	modelViewLoc = gl.getUniformLocation(program, "mvMatrix");
    
	setDefaultLightingModel() 
	
	//Keypress event listener
	document.onkeypress = function(e) {
		var key = String.fromCharCode(e.keyCode);
		if(key == 'r')
		{
			dogPos = vec3(0.0, 0.0, 0.0);
		}

	}
	gl.uniform1f(gl.getUniformLocation(program, "useGoraud"), true);
	gl.uniform1f(gl.getUniformLocation(program, "usePhong"), false);
	
	setLightDirection(lightDirection);
	//begin the render loop
	render();
}

/*
 *	Event functions
 */
 function switchLightModel() {

	if(document.getElementById("vertexShading").checked) {
		gl.uniform1f(gl.getUniformLocation(program, "useGoraud"), true);
		gl.uniform1f(gl.getUniformLocation(program, "usePhong"), false);
	}
	else {
		gl.uniform1f(gl.getUniformLocation(program, "useGoraud"), false);
		gl.uniform1f(gl.getUniformLocation(program, "usePhong"), true);
	}
 }
 
 function rotateView() {
	var angle = document.getElementById("viewRotateSlider").value;
	document.getElementById("viewThetaLabel").innerHTML = angle;
	theta = radians(parseInt(angle)) + Math.PI / 2;
	
	//rotate the light
	var lightMat = mat4(
		lightDirection[0], 0.0, 0.0, 0.0,
		0.0, lightDirection[1], 0.0, 0.0,
		0.0, 0.0, lightDirection[2], 0.0,
		0.0, 0.0, 0.0, 1.0 );

	lightMat = mult(rotate(parseInt(angle), 0, 1, 0), lightMat);
	var direction = vec4(lightMat[0][0], lightMat[1][1], lightMat[2][2], 1.0);
	setLightDirection(direction);
 }
 
 function setHeight() {
	var height = document.getElementById("eyePointSlider").value;
	document.getElementById("eyePointLabel").innerHTML = height;
	viewHeight = parseInt(height);
 }
 
 function setSpeed() {
	speed = parseFloat(document.getElementById("dogSpeedSlider").value) / 1000.0;
	document.getElementById("dogSpeedLabel").innerHTML = speed * 1000;
	document.getElementById("debugLabel").innerHTML = "Dog speed set to: " + speed;
	
	if(speed == 0)
		isAnimating = false;
	else
		isAnimating = true;
 }
 
function setLightColors(ambient, diffuse, specular) {
	gl.uniform4fv(gl.getUniformLocation(program, "lightAmbient"), ambient);
	gl.uniform4fv(gl.getUniformLocation(program, "lightDiffuse"), diffuse);
	gl.uniform4fv(gl.getUniformLocation(program, "lightSpecular"), specular);
}
 
function setMaterialColors(ambient, diffuse, specular, shine) {
	gl.uniform4fv(gl.getUniformLocation(program, "materialAmbient"), ambient);
	gl.uniform4fv(gl.getUniformLocation(program, "materialDiffuse"), diffuse);
	gl.uniform4fv(gl.getUniformLocation(program, "materialSpecular"), specular);
	
	gl.uniform1f(gl.getUniformLocation(program, "shininess"), shine);
}

function setLightDirection(dir) {
	gl.uniform4fv(gl.getUniformLocation(program, "lightDirection"), dir);
}
 
function setDefaultLightingModel() {
	setLightColors(vec4(0.1, 0.1, 0.1, 1.0 ), vec4(1.0, 1.0, 1.0, 1.0), vec4(1.0, 1.0, 1.0, 1.0));
	setMaterialColors(CHROME_AMBI, CHROME_DIFF, CHROME_SPEC, 76.8);
}

function setAmbient(light, material) {
	gl.uniform4fv(gl.getUniformLocation(program, "lightAmbient"), light);
	gl.uniform4fv(gl.getUniformLocation(program, "materialAmbient"), material);
}

function setSpecular(light, material) {
	gl.uniform4fv(gl.getUniformLocation(program, "lightSpecular"), light);
	gl.uniform4fv(gl.getUniformLocation(program, "materialSpecular"), material);
}

function setDiffuse(light, material) {
	gl.uniform4fv(gl.getUniformLocation(program, "lightDiffuse"), light);
	gl.uniform4fv(gl.getUniformLocation(program, "materialDiffuse"), material);
}

function torso() {
	var mvMatrix = modelViewStack.pop();
	var instanceMatrix = mult(torsoScaleMat, mvMatrix);

	modelViewStack.push(instanceMatrix);
	
	drawObject(instanceMatrix, points.length);
}

function upperLeg(translateMat, dir) {
	var mvMatrix = modelViewStack[0];
	//scale the leg to shape and size
	var instanceMatrix = mult(upperLegScaleMat, mvMatrix);
	//apply animation rotation
	instanceMatrix = mult(translate(0, -.5, 0), instanceMatrix);
	instanceMatrix = mult(rotate(legTheta * dir, 0, 0, 1), instanceMatrix);
	//move the leg
	instanceMatrix = mult(translateMat, instanceMatrix);
	
	//push the translation to the stack
	modelViewStack.push(translateMat);
	
	lowerLeg(translate(0, -.8, 0), dir);
	
	drawObject(instanceMatrix, points.length);
	modelViewStack.pop();
}

function lowerLeg(translateMat, dir) {
	//grab the matrix on the top of stack
	var mvMatrix = translateMat;
	var rotation = (legTheta - 45);
	var instanceMatrix = mult(lowerLegScaleMat, identityMat);
	instanceMatrix = mult(translate(0, -0.3, 0), instanceMatrix);
	instanceMatrix = mult(rotate(-rotation, 0, 0, 1), instanceMatrix);
	instanceMatrix = mult(mvMatrix, instanceMatrix);
	instanceMatrix = mult(rotate(legTheta * dir, 0, 0, 1), instanceMatrix);
	instanceMatrix = mult(modelViewStack.pop(), instanceMatrix);

	modelViewStack.push(instanceMatrix);
	
	drawObject(instanceMatrix, points.length);
}

function legs() {
	upperLeg(translate(-.75, .1, .3), 1);
	upperLeg(translate(-.75, .1, -.3), 1);
	upperLeg(translate(.7, .1, .3), -1);
	upperLeg(translate(.7, .1, -.3), -1);
}

function head() {
	var mvMatrix = modelViewStack[0];
	var translateMat = translate(-.75, .5, 0);
	modelViewStack.push(translateMat);
	
	var instanceMatrix = mult(headScaleMat, mvMatrix);
	instanceMatrix = mult(translateMat, instanceMatrix);
	snout();

	eyeBall(-30);
	modelViewStack.push(translateMat);
	eyeBall(30);
	modelViewStack.push(translateMat);
	
	setAmbient(vec4(0.0, 0.0, 0.0, 1.0), vec4(0.0, 0.0, 0.0, 1.0));
	setDiffuse(vec4(0.0, 0.0, 0.0, 1.0), vec4(0.0, 0.0, 0.0, 1.0));
	ear(90);
	modelViewStack.push(translateMat);
	ear(-90);
	setDefaultLightingModel();
	
	drawObject(instanceMatrix, points.length);
}

function ear(rotation) {
	var mvMatrix = translate(-0.5, 0.0, 0.0);
	
	var instanceMatrix = mult(rotate(-30, 0, 0, 1), earScaleMat);
	instanceMatrix = mult(mvMatrix, instanceMatrix);
	instanceMatrix = mult(rotate(rotation, 0, 1, 0), instanceMatrix);
	instanceMatrix = mult(modelViewStack.pop(), instanceMatrix);
	
	drawObject(instanceMatrix, points.length);
}

function snout() {
	var mvMatrix = modelViewStack.pop();
	modelViewStack.push(mvMatrix);
	mvMatrix = mult(translate(-.3, -.2, 0), mvMatrix);
	modelViewStack.push(mvMatrix);
	
	var instanceMatrix = mult(snoutScaleMat, identityMat);
	instanceMatrix = mult(mvMatrix, instanceMatrix);

	nose();
	setDefaultLightingModel();
	drawObject(instanceMatrix, points.length);

}

function eyeBall(rotation) {

	var mvMatrix = translate(-0.47, 0.0, 0.0);
	//mvMatrix = mult(rotate(45, 0, 0, 1), mvMatrix);
	//mvMatrix = mult(translateMat, modelViewStack.pop());
	
	var instanceMatrix = mult(eyeScaleMat, identityMat);
	instanceMatrix = mult(mvMatrix, instanceMatrix);
	instanceMatrix = mult(rotate(rotation, 0, 1, 0), instanceMatrix);
	instanceMatrix = mult(rotate(-30, 0, 0, 1), instanceMatrix);
	instanceMatrix = mult(modelViewStack.pop(), instanceMatrix);
	
	modelViewStack.push(instanceMatrix);
	
	pupil();

	setMaterialColors(WHITE, WHITE, WHITE, 100.0);
	
	drawObject(instanceMatrix, points.length);
	setDefaultLightingModel();
}

function pupil() {
	var mvMatrix = translate(-0.5, 0.0, 0.0);
	
	var instanceMatrix = pupilScaleMat;
	instanceMatrix = mult(mvMatrix, instanceMatrix);
	instanceMatrix = mult(modelViewStack.pop(), instanceMatrix);
	
	setMaterialColors(BLACK, BLACK, BLACK, 100.0);

	drawObject(instanceMatrix, points.length);
}

function nose() {
	var mvMatrix = mult(translate(-.3, .3, 0), modelViewStack.pop());
	var instanceMatrix = mult(noseScaleMat, identityMat);
	
	instanceMatrix = mult(mvMatrix, instanceMatrix);
	
	setAmbient(vec4(0.0, 0.0, 0.0, 1.0), vec4(0.0, 0.0, 0.0, 1.0));
	setDiffuse(vec4(0.0, 0.0, 0.0, 1.0), vec4(0.0, 0.0, 0.0, 1.0));
	drawObject(instanceMatrix, points.length);
}

function tail() {
	var mvMatrix = modelViewStack[0];
	
	var instanceMatrix = mult(translate(0.0, 0.5, 0.0), tailScaleMat);
	instanceMatrix = mult(rotate(tailTheta, 1, 0, 0), instanceMatrix);
	instanceMatrix = mult(translate(0.0, 0.3, 0.0), instanceMatrix);
	instanceMatrix = mult(rotate(-55, 0, 0, 1), instanceMatrix);
	instanceMatrix = mult(translate(0.5, 0.0, 0.0), instanceMatrix);
	
	setAmbient(vec4(0.0, 0.0, 0.0, 1.0), vec4(0.0, 0.0, 0.0, 1.0));
	setDiffuse(vec4(0.0, 0.0, 0.0, 1.0), vec4(0.0, 0.0, 0.0, 1.0));
	drawObject(instanceMatrix, points.length);
	setDefaultLightingModel();
}

function ground() {
	setMaterialColors(vec4(1.0, 1.0, 1.0, 1.0), vec4(0.5, 0.8, 0.1, 1.0), vec4(1.0, 1.0, 1.0), 230.0);
	setGroundBuffers();
	drawGround(groundScale, groundVertices.length);
	setSphereBuffers();
	setDefaultLightingModel();
}

function setGroundBuffers() {
	//Setting and binding buffers
	var nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(groundNormals), gl.STATIC_DRAW );
    
    var vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal);
	
    vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(groundVertices), gl.STATIC_DRAW );
    
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
}

function setSphereBuffers() {
	//Setting and binding buffers
	var nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normals), gl.STATIC_DRAW );
    
    var vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal);
	
	
    vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );
    
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
}

function drawObject(mvMatrix, vertexCount) {
	eye = rotateEye();
	
	var projectionMatrix = identityMat;
	projectionMatrix = mult(lookAt(eye, at, up), projectionMatrix);
	projectionMatrix = mult(perspective(fovy, aspect, near, far), projectionMatrix);
	
	projectionMatrix = mult(ortho(-7, 7, -7, 7, -7, 7), projectionMatrix);
	
	
	gl.uniformMatrix4fv( gl.getUniformLocation(program, "projectionMatrix"),  false, flatten(projectionMatrix) );
	
	//if walking left to right rotate the matrix
	if(dogDirection > 0)
		mvMatrix = mult(rotate(180, 0, 1, 0), mvMatrix);
		
	mvMatrix = walkTheDog(mvMatrix);
	
	var nMat = transpose(mvMatrix);
	
	gl.uniformMatrix4fv(gl.getUniformLocation(program, "normalMatrix"), false, flatten(nMat));
	
	gl.uniformMatrix4fv(modelViewLoc, false, flatten(mvMatrix));

	gl.drawArrays( gl.TRIANGLES, 0, vertexCount );
}

function drawGround(mvMatrix, vertexCount) {
	gl.uniformMatrix4fv(modelViewLoc, false, flatten(mvMatrix));

	var nMat = transpose(mvMatrix);
	
	gl.uniformMatrix4fv(gl.getUniformLocation(program, "normalMatrix"), false, flatten(nMat));
	
	gl.uniformMatrix4fv(modelViewLoc, false, flatten(mvMatrix));
	
	gl.drawArrays( gl.TRIANGLES, 0, vertexCount );
}

function animateDog() {
	/*
	 * Only animate if isAnimating is true, however return
	 *		legs and tail to start position
	 */
	if(isAnimating || legTheta != 0)
		legTheta += legDirection;
	if(legTheta == 45 || legTheta == -45) 
		legDirection *= -1;
	
	if(isAnimating || tailTheta != 0)
		tailTheta += tailDirection;
	if(tailTheta == 45 || tailTheta == -45)
		tailDirection *= -1;
}

function walkTheDog(mvMatrix) {
	if(isAnimating)
		dogPos[0] += speed * dogDirection;
	
	if(dogPos[0] <= MIN_X || dogPos[0] >= MAX_X)
		dogDirection *= -1;
	
	mvMatrix = mult(translate(dogPos[0], 0, 0), mvMatrix);

	return mvMatrix;
}

function rotateEye() {
	var eye = vec3(distance * Math.cos(theta), viewHeight, distance * Math.sin(theta));
	return eye;
}

//Render loop to animate and manipulate the cubes
function render() {
	modelViewstack = [];
	//set the projection matrix
	
	//if dog is not in motion pause
	animateDog();
	
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	var modelViewMatrix = identityMat;
	
	modelViewStack.push(modelViewMatrix);
	
	ground();
	
	legs();
	
	head();
	
	tail();
	
	torso();

	modelViewMatrix = modelViewStack.pop();
	
    requestAnimFrame( render );
}

