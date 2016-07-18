//CEM is short for catsEyeMin
//The settings and globals objects are intended to keep any catseye variables sandboxed away from the global javascript context


//feel free to experiment with changing these
var CEM_settings = {
	polygon_sides: 4, //hexagon - change this to 4 to see the process for a square, or 3 to see the process for a triangle
	polygon_radius: 100,
	image_path: "./assets/pic.jpg"
};

//although you should feel free to play with these, they aren't general settings intended for changing.
var CEM_globals = {
	step_num: 0,
	theta: 6.2831/CEM_settings.polygon_sides,
	image: null
};

//steps is an array of functions, these functions will be called one at a time as the next button is pressed
CEM_globals.steps = [
	circle,
	angles,
	angles2,
	image_mask,
	image_mask2,
	image_flip,
	image_rotate,
	tile
];

function circle(){
	stroke(200);
	noFill();
	ellipse(0, 0, CEM_settings.polygon_radius*2, CEM_settings.polygon_radius*2);
}

function angles(){
	var theta = CEM_globals.theta;
	var radius = CEM_settings.polygon_radius;

	var x1 = cos(theta*0-theta/2)*radius
	var y1 = sin(theta*0-theta/2)*radius
	var x2 = cos(theta*1-theta/2)*radius
	var y2 = sin(theta*1-theta/2)*radius

	line(0,0,x1, y1);
	stroke(255,0,0, 100);
	noFill();
	line(0,0,x2,y2);
	ellipse(x2,y2,5,5);
	arc(0,0,radius/2, radius/2, -theta/2, theta/2);
	fill(0);
	noStroke();


	text("θ = TWO_PI/polygon_sides\nx = cos(θ-θ/2)*radius\ny = sin(θ-θ/2)*radius",x2+10,y2+10);
	textAlign(CENTER);
	text("θ", radius/3, 0);
	textAlign(LEFT);

	return {x1: x1, y1: y1, x2: x2, y2: y2};
}

function angles2(){

	var pts = angles();	

	var xm = lerp(pts.x1,pts.x2,0.5);
	var ym = lerp(pts.y1,pts.y2,0.5);

	stroke(100);
	line(0,0,pts.x1, pts.y1);
	line(0,0, xm, ym);
	line(pts.x1,pts.y1,pts.x2,pts.y2);

	fill(100);
	ellipse(xm,ym,5,5);
	stroke(255,0,0, 100);
	noFill();
	line(0,0,pts.x2,pts.y2);

	return {x1: pts.x1, y1: pts.y1, x2: pts.x2, y2: pts.y2, xm: xm, ym: ym};

}

function image_mask(){
	background(255);
	image(CEM_globals.image,0,0);
	fill(255,100);
	noStroke();
	rect(0,-CEM_globals.image.height+1, CEM_globals.image.width, CEM_globals.image.height);
	circle();
	angles();
	angles2();

}

function image_mask2(){
	background(255);
	circle();
	pts = angles2();

	var mask = createGraphics(CEM_globals.image.width,CEM_globals.image.height);
	mask.clear();
	mask.fill(255);
	mask.triangle(0,0,pts.xm,pts.ym,pts.x2,pts.y2);
	var mask_img = mask.get();

	CEM_globals.image.mask(mask_img);

	image(CEM_globals.image,0,0);
}

function image_flip(){
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
		
		push();
		
		translate(width/2, height/2);
			current_step();
		pop();

		CEM_globals.step_num++;
	}
}


function setup() {
	createCanvas(500,500);
	stroke(200);
	button = createButton('next step');
	button.mousePressed(next_step);
	CEM_globals.image = loadImage(CEM_settings.image_path, function(){CEM_globals.image.resize(CEM_settings.polygon_radius,0);});
}

function draw() {
  
}

function mousePressed(){
	
}