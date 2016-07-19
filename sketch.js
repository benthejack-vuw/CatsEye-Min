//is not particularly clean code, this file is meant for process demonstration purposes only. 
//please see master branch for cleaner implementation.

//CEM is short for catsEyeMin
//The settings and globals objects are intended to keep any catseye variables sandboxed away from the global javascript context


//feel free to experiment with changing these
var CEM_settings = {
	polygon_sides: 6, //6 = hexagon, 4 = square, 3 = triangle
	polygon_radius: 200,
	image_path: "./assets/pic.jpg"
};

//these aren't general settings intended for changing.
var CEM_globals = {
	step_num: 0,
	theta: 6.2831/CEM_settings.polygon_sides,
	image: null
};

//steps is an array of functions, these functions will be called one at a time, in order, as the next button is pressed
CEM_globals.steps = [
	circle,
	angles,
	angles2,
	draw_poly,
	image_mask,
	image_mask2,
	image_flip,
	image_rotate,
	grid,
	tile
];

//this function returns 3 points, side point1, side point2, and the mid-point of these
function get_polygon_side_points(i){

	var theta = CEM_globals.theta;
	var radius = CEM_settings.polygon_radius;

	var pts = { 
				x1: cos(theta*i-theta/2)*radius,
				y1: sin(theta*i-theta/2)*radius,
				x2: cos(theta*(i+1)-theta/2)*radius,
				y2: sin(theta*(i+1)-theta/2)*radius,
			};

	pts.xM = lerp(pts.x1, pts.x2, 0.5);
	pts.yM = lerp(pts.y1, pts.y2, 0.5);

	return pts
}

function circle(){
	stroke(200);
	noFill();
	ellipse(0, 0, CEM_settings.polygon_radius*2, CEM_settings.polygon_radius*2);
}

function angles(){
	pts = get_polygon_side_points(0);
	line(0,0, pts.x1, pts.y1);
	noFill();
	line(0,0,pts.x2,pts.y2);
	ellipse(pts.x2,pts.y2,5,5);

	push();
		stroke(255,0,0, 100);
		arc(0,0,CEM_settings.polygon_radius/2, CEM_settings.polygon_radius/2, -CEM_globals.theta/2, CEM_globals.theta/2);
		
		fill(0);
		noStroke();
		text("θ = TWO_PI/polygon_sides\nx = cos(θ-θ/2)*radius\ny = sin(θ-θ/2)*radius",pts.x2+10,pts.y2+10);
		textAlign(CENTER);
		text("θ", CEM_settings.polygon_radius/3, 0);
		textAlign(LEFT);
	pop();
}

function angles2(){

	push();
	pts = get_polygon_side_points(0);

	stroke(100);
	line(0,0,pts.x1, pts.y1);
	line(0,0, pts.xM, pts.yM);
	line(pts.x1,pts.y1,pts.x2,pts.y2);

	fill(100);
	ellipse(pts.xM, pts.yM,5,5);
	stroke(255,0,0, 100);
	noFill();
	line(0,0,pts.x2,pts.y2);
	pop();

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
	draw_poly();
}

function image_mask2(){
	background(255);
	circle();
	draw_poly();
	pts = get_polygon_side_points(0);

	var mask = createGraphics(CEM_globals.image.width,CEM_globals.image.height);
	mask.clear();
	mask.fill(255);
	mask.triangle(0,0,pts.xM,pts.yM,pts.x2,pts.y2);
	var mask_img = mask.get();

	CEM_globals.image.mask(mask_img);

	image(CEM_globals.image,0,0);
}

function image_flip(){

	image(CEM_globals.image,0,0);
	var img_cp = CEM_globals.image.get();
	scale(1,-1);
	image(CEM_globals.image,0,0);

}

function image_rotate(){

	for(var i = 0; i < CEM_settings.polygon_sides; ++i){
		push();
			image_flip();
		pop();
		rotate(CEM_globals.theta);
	}

}

function get_grid_function(){
	var grid_function = null;
	grid_function = CEM_settings.polygon_sides == 3 ? tri_grid : grid_function;
	grid_function = CEM_settings.polygon_sides == 4 ? square_grid : grid_function;
	grid_function = CEM_settings.polygon_sides == 6 ? hex_grid : grid_function;
	return grid_function;
}

function grid(){
	
	background(255);

	var grid_function = get_grid_function();

	if(grid_function != null){
		translate(-width/2, -height/2);

		for(var i = 0; i < width/CEM_settings.polygon_radius*1.5; ++i){
			for(var j = 0; j < height/CEM_settings.polygon_radius*1.5; ++j){
				pt = grid_function(i,j);
				push();
					translate(pt.x, pt.y);
					scale(pt.sx, pt.sy);
					draw_poly();
					if(i == 2 && j == 2){
						image_rotate();
					}
				pop();
			}	
		}

	}

}

function tile(){
	
	var grid_function = get_grid_function()

	if(grid_function != null){
		translate(-width/2, -height/2);

		for(var i = 0; i < width/CEM_settings.polygon_radius*1.5; ++i){
			for(var j = 0; j < height/CEM_settings.polygon_radius*1.5; ++j){
				pt = grid_function(i,j);
				push();
					translate(pt.x, pt.y);
					scale(pt.sx, pt.sy);
					image_rotate();
				pop();
			}	
		}

	}

}

function draw_poly(){
	for(var i = 0; i < CEM_settings.polygon_sides; ++i){
		pts = get_polygon_side_points(i);
		line(pts.x1, pts.y1, pts.x2, pts.y2);
	}
}

function hex_grid(i,j){
	var pts = get_polygon_side_points(0);

	var w = 2 * dist(0,0,pts.xM,pts.yM);
	var h = CEM_settings.polygon_radius*2;
	var y_offset = dist(pts.xM,pts.yM,pts.x2,pts.y2);
	var x_offset = j % 2 == 0 ? 0 : w/2;
	return {x:(w*i)-x_offset, y:(h*j)-(j*y_offset),sx:1, sy:1};
}

function square_grid(i,j){
	var w = 2 * dist(0,0,pts.xM,pts.yM);
	var h = w;

	return {x:w*i, y:h*j, sx:1, sy:1};
}

function tri_grid(i, j){
	var wt = dist(0,0,pts.xM,pts.yM);
	var w = wt + CEM_settings.polygon_radius;
	var w_offset = i % 2 == 0 ? 0 : wt;
	w_offset = j%2 == 0 ? w_offset : -w_offset + CEM_settings.polygon_radius/2;
	var h_div2 = dist(pts.x1,pts.y1,pts.xM,pts.yM);
	var sx = (i%2 == 0 && j%2 == 0) || (i%2 == 1 && j%2 == 1) ? 1 : -1;
	return {x:i*w-w_offset, y:j*h_div2, sx:sx, sy:1};
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
	createCanvas(window.innerWidth,window.innerHeight-50);
	stroke(200);

	button = createButton('next step');
	button.mousePressed(next_step);
	CEM_globals.image = loadImage(CEM_settings.image_path, function(){CEM_globals.image.resize(CEM_settings.polygon_radius,0);});
}

function draw() {
  
}