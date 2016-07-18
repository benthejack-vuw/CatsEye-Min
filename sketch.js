//CEM is short for catsEyeMin
//The settings and globals objects are intended to keep any catseye variables sandboxed away from the global javascript context


//feel free to experiment with changing these
var CEM_settings = {
	polygon_sides: 6 //hexagon - change this to 4 to see process as square, or 3 to see the process as a triangle
}

//although you should feel free to play with these, they aren't general settings.
var CEM_globals{
	step_num: 0
}

//steps is an array of functions, these functions will be called one at a time as the next button is pressed
var steps = [
	circle,
	angles,
	polygon,
	image_mask,
	image_flip,
	image_rotate,
	tile
]

function circle(){

}

function angles(){

}

function polygon(){

}

function image_mask(){

}

function image_flip(){

}

function image_rotate(){

}

function tile(){

}


function setup() {
	size(500,500);
}

function draw() {
  
}

function mousePressed(){
	
}