//CEM is short for catsEyeMin
//The settings and globals objects are intended to keep any catseye variables sandboxed away from the global javascript context


//feel free to change these settings
var CEM_settings = {
	polygon_sides: 6, //6 = hexagon, 4 = square, 3 = triangle
	polygon_radius: 100, //size of the tile
	image_path: "./assets/pic.jpg" //image url if this tarts with a ./ it will be relative to the current directory
};

//these aren't general settings intended for changing.
var CEM_globals = {
	theta: 6.2831/CEM_settings.polygon_sides, //The angle inside one triangular segment of the polygon
	image: null
};

//this function returns 3 points that define a triangular segment of the polygon
function get_half_segment_points(){

	var theta = CEM_globals.theta;
	var radius = CEM_settings.polygon_radius;

	var pts = { 
				x1: cos(-theta/2)*radius,
				y1: sin(-theta/2)*radius,
				x2: cos(theta-theta/2)*radius,
				y2: sin(theta-theta/2)*radius
			};

	pts.xM = lerp(pts.x1, pts.x2, 0.5);
	pts.yM = lerp(pts.y1, pts.y2, 0.5);

	return pts
}

//masks off the input image to turn it into the correctly proportioned triangle 
//this uses the calculations in get_half_segment_points to create the triangle
function masked_image(){
	pts = get_half_segment_points();
	var triangle_mask = createGraphics(CEM_globals.image.width, CEM_globals.image.height);
	triangle_mask.clear();
	triangle_mask.fill(255);
	triangle_mask.stroke(255);
	triangle_mask.triangle(0,0,pts.x2,pts.y2,pts.xM, pts.yM);
	var tri_mask_cpy = triangle_mask.get(); 

	CEM_globals.image.mask(tri_mask_cpy);
	return CEM_globals.image;
}

//this creates an image which consists of the masked image, and a mirror image of the masked image
function polygon_segment(){
	var img = masked_image();

	var polygon_segment = createGraphics(CEM_settings.polygon_radius*2, CEM_settings.polygon_radius*2);
	polygon_segment.translate(polygon_segment.width/2, polygon_segment.height/2);
	polygon_segment.image(img);
	polygon_segment.scale(1,-1); //mirror the segment on the y axis
	polygon_segment.image(img);

	return polygon_segment.get();
}

//this function uses the polygon_segment to draw the polygon by rotating 
//and drawing it as many times as there are sides of the polygon
function draw_polygon(polygon_segment_image, pt){
	imageMode(CENTER);
	
	push();
		
		translate(pt.x,pt.y);
		scale(pt.sx, pt.sy);

		for(var i=0; i < CEM_settings.polygon_sides; ++i){
			image(polygon_segment_image, 0, 0);
			rotate(CEM_globals.theta);
		}

	pop();
}


//this is the main function, called after the image loads. 
//it creates a grid by using the appropriate grid_point function in a nested for-loop
//if the number of sides of the polygon is not 3, 4, or 6 it will only draw one polygon in the center of the canvas
function draw_catsEye_grid(){

	var polygon_segment_image = polygon_segment();
	var grid_function = get_grid_function();

	if(grid_function != null){
		for(var i = 0; i < width/CEM_settings.polygon_radius*1.5; ++i){
			for(var j = 0; j < height/CEM_settings.polygon_radius*1.5; ++j){
				pt = grid_function(i, j);
				draw_polygon(polygon_segment_image, pt);
			}	
		}
	}else{
		draw_polygon(polygon_segment_image, {x:width/2, y:height/2, sx:1, sy:1});
	}
}

//selects the correct grid function. if the number of sides of the polygon is not 3, 4, or 6 it returns null
function get_grid_function(){
	var grid_function = null;
	grid_function = CEM_settings.polygon_sides == 3 ? triangle_grid_point : grid_function;
	grid_function = CEM_settings.polygon_sides == 4 ? square_grid_point : grid_function;
	grid_function = CEM_settings.polygon_sides == 6 ? hexagon_grid_point : grid_function;
	return grid_function;
}

//the following three functions describe how to layout the grid of shapes. 
//they return a position and a scale (scale is used to mirror objects)
function hexagon_grid_point(i,j){
	var pts = get_half_segment_points(0);
	var w = 2 * dist(0,0,pts.xM,pts.yM);
	var h = CEM_settings.polygon_radius*2;
	var y_offset = dist(pts.xM,pts.yM,pts.x2,pts.y2);
	var x_offset = j % 2 == 0 ? 0 : w/2;
	
	return {
		x:(w*i)-x_offset,
	 	y:(h*j)-(j*y_offset),
	 	sx:1,
	 	sy:1
	};
}

function square_grid_point(i,j){
	var pts = get_half_segment_points(0);
	var w = 2 * dist(0,0,pts.xM,pts.yM);
	var h = w;

	return {
		x:w*i,
		y:h*j,
		sx:1,
		sy:1
	};
}

function triangle_grid_point(i, j){

	var pts = get_half_segment_points(0);
	var wt = dist(0,0,pts.xM,pts.yM);
	var w = wt + CEM_settings.polygon_radius;
	var w_offset = i % 2 == 0 ? 0 : wt;
	w_offset = j%2 == 0 ? w_offset : -w_offset + CEM_settings.polygon_radius/2;
	var h_div2 = dist(pts.x1,pts.y1,pts.xM,pts.yM);
	var sx = (i%2 == 0 && j%2 == 0) || (i%2 == 1 && j%2 == 1) ? 1 : -1;
	
	return {
		x:i*w-w_offset,
		y:j*h_div2,
		sx:sx,
		sy:1
	};
}

function setup() {
	createCanvas(window.innerWidth,window.innerHeight);
	//the following line loads the image and once loaded, resizes it and draws the grid
	CEM_globals.image = loadImage(CEM_settings.image_path, function(){
		CEM_globals.image.resize(CEM_settings.polygon_radius,0);
		draw_catsEye_grid();
	});
}

function draw() {
	noLoop();
}