//CEM is short for catsEyeMin
//The settings and globals objects are intended to keep any catseye variables sandboxed away from the global javascript context


//feel free to experiment with changing these
var CEM_settings = {
	polygon_sides: 6 //hexagon - change this to 4 to see the process for a square, or 3 to see the process for a triangle
};

//although you should feel free to play with these, they aren't general settings intended for changing.
var CEM_globals = {
	step_num: 0
};

//steps is an array of functions, these functions will be called one at a time as the next button is pressed
CEM_globals.steps = [
	circle,
	angles,
	polygon,
	image_mask,
	image_flip,
	image_rotate,
	tile
];

function circle(){
	console.log("circle");
}

function angles(){
	console.log("angles");
}

function polygon(){
	console.log("polygon");
}

function image_mask(){
	console.log("image_mask");
}

function image_flip(){
	console.log("image_flip");
}

function image_rotate(){
	console.log("image_rotate");
}

function tile(){
	console.log("tile");
}

function next_step(){
	if(CEM_globals.step_num < CEM_globals.steps.length){
		current_step = CEM_globals.steps[CEM_globals.step_num]
		current_step();
		CEM_globals.step_num++;
	}
}


function setup() {
	createCanvas(500,500);
	button = createButton('next step');
	button.mousePressed(next_step);

}

function draw() {
  
}

function mousePressed(){
	
}