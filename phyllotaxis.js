//////////  SEIZURE WARNING  //////////
////////// START phyllotaxis //////////

/*
		TODO: Split these variables into globals.js 
*/
// Checkbox Values
var enableStrokeChecked = true;
var randomizeStrokeChecked;
var randomizeAngleChecked, randomizeColorChecked;

// Algorithm variables
var s = 0 
var n = 0;
var gr = 137.5;
let bgHue, bgSaturation, bgBrightness;
let grStep, c, stepSize, nodeX, nodeY, colorShift;
let colorSaturation, colorBrightness;
let strokeHue, strokeWidth, loopSpeed;
let strokeSaturation, strokeBrightness;

// Sliders
let bgHueSlider, bgSaturationSlider, bgBrightnessSlider; 
let cSlider, stepSlider, loopSpeedSlider;
let nodeXSlider, nodeYSlider, colorHueSlider;
let colorSaturationSlider, colorBrightnessSlider;
let strokeHueSlider, strokeSaturationSlider, strokeBrightnessSlider;
let strokeWidthSlider;


// Text 
let textBgHue, textBgSaturation, textBgBrightness;
let textGrStep, textC, textStep, textnodeX, textnodeY;
let textColorHue, textColorSaturation, textColorBrightness;
let textLoopSpeed, textStrokeHue, textStrokeWidth;
let textStrokeSaturation, textStrokeBrightness;

// Buttons
let playButton, pauseButton, restartButton, resetButton;

// Checkboxes - set global value?
let randomizeStrokeCheckbox; 
let randomizeColorCheckbox;
let muteAudio;

// Dropdown
let selectShape, enableSquare, enableTri;
let enableEllipse = true;
 
// UI
var canvas, drawingHeight, UIRefWidth, UIRefHeight, UIBox;
var resizeUIWidth, resizeUIHeight;
let img;	// Let users upload Image? // how do sound parameters affect sound?
 
// Both image preload and audio preload need to run server: 'python -m http.server'

// How graphics map to arpeggiator 
///////////////////////////////////////////////////////////////////////////////////////////////////////////
//  
//	Shape: 				osc type 
//	Angle:				scale type
//  Background color:	reverb/delay
//  Node color:			starting pitch	
//  Outline color:		filter attack
//	Outline width: 		osc attack
//	Radius:				filter cutoff
//  Rotation: 			arp direction (up/down)
//	Speed:				arp speed
//  Node Size:			osc decay
//  
//	Randomize Color:	random scale
//	Randomize Outline: 	random filter position
//
///////////////////////////////////////////////////////////////////////////////////////////////////////////

const sketch = new p5( (drawing) => {
	drawing.setup = () => {
		canvas = drawing.createCanvas(drawing.windowWidth * 0.75, drawing.windowHeight * 0.75);	
		drawingHeight = drawing.windowHeight * 0.75;
		canvas.parent("sketch");
		canvas.center("horizontal");
		drawing.angleMode(drawing.DEGREES);
		drawing.colorMode(drawing.HSB);
	};
	
	drawing.windowResized = ()  => {
		drawing.resizeCanvas(drawing.windowWidth * 0.75, drawing.windowHeight* 0.75);
	};
	
/* 	drawing.preload = () => {
		img = drawing.loadImage("img/cat.png");
	}; */
	
	drawing.draw = () => {
		
		drawing.translate(drawing.width / 2, drawing.height / 2);
		
		stepSize = stepSlider.value(); 
		nodeX = nodeXSlider.value();
		nodeY = nodeYSlider.value();
		colorShift = colorHueSlider.value();
		bgHue = bgHueSlider.value();
		bgSaturation = bgSaturationSlider.value();
		bgBrightness = bgBrightnessSlider.value(); 
		drawing.background(bgHue, bgSaturation, bgBrightness);
		colorSaturation = colorSaturationSlider.value();
		colorBrightness = colorBrightnessSlider.value();
		loopSpeed = loopSpeedSlider.value();
		grStep = grStepSlider.value();
		strokeHue = strokeHueSlider.value();
		strokeSaturation = strokeSaturationSlider.value();
		strokeBrightness = strokeBrightnessSlider.value();
		strokeWidth = strokeWidthSlider.value();
		
		//const startTime = performance.now();
		for (var i = 0; i <= n; i += stepSize)
		{
			c = cSlider.value();
			
			var angle = i * gr;
			var r = c * drawing.sqrt(i);
			var x = r * drawing.cos(angle);
			var y = r * drawing.sin(angle);
			
			// Break out of loop if values fall outside canvas 
			// does this optimize anything???
/* 			if (Math.abs(x) > Math.abs(drawing.width) && Math.abs(y) > Math.abs(drawing.height)) {
				console.log("outside screen");
				break;
			} */
				
			// experiment with this for more randomization options
			var shift = drawing.cos(s + i * 0.5);
			shift = drawing.map(shift, -1, 1, 0, 360);
			
			if (randomizeColorChecked) {
				 
				// Color = angle % 256or shift % colorShift
				//fill(colorShift, colorSaturation, colorBrightness)
				drawing.fill(shift % colorShift % 256, colorSaturation, colorBrightness);			
			}

			else {
				drawing.fill(colorShift, colorSaturation, colorBrightness);
			}
			
			if (enableStrokeChecked) {
				
				if (randomizeStrokeChecked) {
					drawing.stroke(shift % 256, strokeSaturation, strokeBrightness);
					drawing.strokeWeight(strokeWidth);
				}
				
				else {
					drawing.stroke(strokeHue, strokeSaturation, strokeBrightness);
					drawing.strokeWeight(strokeWidth);
				}
				
			}	
			
			else {
				drawing.noStroke();
			}

 			if (Math.abs(x) < Math.abs(drawing.width) && Math.abs(y) < Math.abs(drawing.height)) {
				if (enableEllipse)
					drawing.ellipse(x, y, nodeX, nodeY); 
				
				if (enableSquare)
					drawing.rect(x, y, nodeX, nodeY);
				
				if (enableTri)
					drawing.triangle(x, y, x + nodeX, y + nodeY, x + (nodeX * 2), y) 				
				
			}
			
			/*
				 -> resizing node size should resize image
				 -> grey out randomize checkboxes
				 -> allow user to upload their own pictures (limit file/image size)
			img.resize(120, 120);
			drawing.image(img, x - 80, y - 80);
			*/
		}

		n += loopSpeed;
		s += 5;				// randomize color speed
		gr += grStep;		

		//const duration = performance.now() - startTime;
		//console.log(`drawing took: ${duration}ms`);
	};
	
});

// Handle the UI
const ui = new p5( (menu) => {
	
	menu.setup = () => {
		UIBox = menu.createCanvas(menu.windowWidth * 0.75, menu.windowHeight * 0.15);
		//r.parent("sketch");		
		UIBox.position(canvas.position().x, drawingHeight + canvas.position().y);
				
		UIRefWidth = canvas.position().x + 10;
		UIRefHeight = drawingHeight + canvas.position().y;
		
		resizeUIWidth = menu.windowWidth * 0.75;
		resizeUIHeight = menu.windowHeight * 0.15;		

		createMainButtons(menu, UIRefHeight, UIRefWidth);
		createCheckBoxes(menu, UIRefHeight, UIRefWidth);
		createSliders(menu, UIRefHeight, UIRefWidth, resizeUIHeight, resizeUIWidth);
		drawText(menu, UIRefHeight, UIRefWidth);
		createDropdown(menu, UIRefHeight, UIRefWidth);
	};
	
	menu.windowResized = () => {
		menu.resizeCanvas(menu.windowWidth * 0.75, menu.windowHeight * 0.15);
		
		UIRefWidth = canvas.position().x + 10;
		UIRefHeight = drawingHeight + canvas.position().y;
		console.log(`UIRefWidth: ${UIRefHeight}`);
		resizeUIWidth = menu.windowWidth * 0.75;
		resizeUIHeight = menu.windowHeight * 0.15;	
		console.log(`ResizeHeight: ${resizeUIHeight}`);
		
		menu.clear();
		createMainButtons(menu, UIRefHeight, UIRefWidth);
		createCheckBoxes(menu, UIRefHeight, UIRefWidth);
		createSliders(menu, UIRefHeight, UIRefWidth, resizeUIHeight, resizeUIWidth);
		drawText(menu, UIRefHeight, UIRefWidth);
		createDropdown(menu, UIRefHeight, UIRefWidth);
	};
	
	menu.draw = () => {
		menu.background(200);
	};
});



///////////////////////////////////////////////////////////////////////////////////////////////////////////
//		HELPER FUNCTIONS																				 //
///////////////////////////////////////////////////////////////////////////////////////////////////////////
function createMainButtons(draw, h, w) {
	// Main Buttons 
	resetButton = draw.createButton("Reset");
	resetButton.position(w + 350, h);
	resetButton.mousePressed(resetCanvas);
	
	playButton = draw.createButton("Play");
	playButton.position(w + 400, h);
	playButton.mousePressed(playDrawing, draw);
	
	pauseButton = draw.createButton("Pause");
	pauseButton.position(w + 440, h);
	pauseButton.mousePressed(pauseDrawing, draw);
	
	restartButton = draw.createButton("Restart");
	restartButton.position(w + 490, h);
	restartButton.mousePressed(restartDrawing, draw);	
}

function createCheckBoxes(draw, h, w) {
	
	randomizeStrokeCheckbox = draw.createCheckbox('Random Outline', false);
	randomizeStrokeCheckbox.position(w + 200, h);
	randomizeStrokeCheckbox.changed(enableRandomizeStrokeColorEvent);
	
	randomizeColorCheckbox = draw.createCheckbox('Random Color', false);
	randomizeColorCheckbox.position(w + 80, h);
	randomizeColorCheckbox.changed(enableRandomizeColorEvent);
	
}

function createDropdown(draw, h, w)
{
	selectShape = draw.createSelect();
	selectShape.position(w, h);
	selectShape.option("ellipse");
	selectShape.option("square");
	selectShape.option("triangle");
	selectShape.selected("ellipse");
	selectShape.changed(selectShapeEvent);
}

function createSliders(draw, h, w, rH, rW) {
	
	/* console.log(`resizeW: ${rW}`);
	console.log(`resizeH: ${rH}`); */
	
 	bgHueSlider = draw.createSlider(0, 360, 0, 0);
	bgHueSlider.style('width', '100px');
	bgHueSlider.position(w, h + 35);
	
	bgSaturationSlider = draw.createSlider(0, 100, 0, 0);
	bgSaturationSlider.style('width', '100px');
	bgSaturationSlider.position(w + 170, h + 35); 
	
	bgBrightnessSlider = draw.createSlider(0, 100, 0, 0);
	bgBrightnessSlider.style('width', '100px');
	bgBrightnessSlider.position(w + 373, h + 35); 
	
	grStepSlider = draw.createSlider(-0.005, 0.005, 0.0015, 0);
	grStepSlider.style('width', '100px');
	grStepSlider.position(w, h + 57);
	
	cSlider = draw.createSlider(1, 200, 10, 0);
	cSlider.style('width', '100px');
	cSlider.position(w + 170, h + 57);

	stepSlider = draw.createSlider(0.05, 4, 2, 0);
	stepSlider.style('width', '100px');
	stepSlider.position(w + 373, h + 57);
	
	colorHueSlider = draw.createSlider(0, 360, 200, 0);
	colorHueSlider.style('width', '100px');
	colorHueSlider.position(w, h + 81);
	
	colorSaturationSlider = draw.createSlider(0, 255, 255, 0);
	colorSaturationSlider.style('width', '100px');
	colorSaturationSlider.position(w + 170, h + 81);

	colorBrightnessSlider = draw.createSlider(0, 100, 100, 0);
	colorBrightnessSlider.style('width', '100px');
	colorBrightnessSlider.position(w + 373, h + 81);	

	loopSpeedSlider = draw.createSlider(0.5, 100, 1, 0);
	loopSpeedSlider.style('width', '100px');
	loopSpeedSlider.position(w, h + 102);

	nodeXSlider = draw.createSlider(1, 200, 25, 0);
	nodeXSlider.style('width', '100px');
	nodeXSlider.position(w + 170, h + 102);
	
	nodeYSlider = draw.createSlider(1, 200, 25, 0);
	nodeYSlider.style('width', '100px');
	nodeYSlider.position(w + 373, h + 102);
	
	strokeHueSlider = draw.createSlider(0, 360, 0, 0);
	strokeHueSlider.style('width', '100px');
	strokeHueSlider.position(w, h + 124);
	
	strokeSaturationSlider = draw.createSlider(0, 255, 255, 0);
	strokeSaturationSlider.style('width', '100px');
	strokeSaturationSlider.position(w + 170, h + 124);
	
	strokeBrightnessSlider = draw.createSlider(0, 100, 100, 0);
	strokeBrightnessSlider.style('width', '100px');
	strokeBrightnessSlider.position(w + 373, h + 124);
	
	strokeWidthSlider = draw.createSlider(0, 20, 1, 0);
	strokeWidthSlider.style('width', '100px');
	strokeWidthSlider.position(w, h + 146);
}

function drawText(draw, h, w)
{
	// Text .concat(var.toFixed()) to show values
	textBgHue = draw.createP('BG Hue');
	textBgHue.style("color", "#000000");
	textBgHue.position(w + 102, h + 33); 

	textBgSaturation = draw.createP('BG Saturation');
	textBgSaturation.style('color', "#000000");
	textBgSaturation.position(w + 273, h + 33);

	textBgBrightness = draw.createP('BG Brightness');//.concat(bgBrightness.toFixed())
	textBgBrightness.style('color', '#000000');
	textBgBrightness.position(w + 475, h + 33);

	textGrStep = draw.createP('Rotation'); //.concat(grStep.toFixed())
	textGrStep.style("color", "#000000");
	textGrStep.position(w + 102, h + 55);

	textC = draw.createP('Radius'); //.concat(c.toFixed())
	textC.style("color", "#000000");
	textC.position(w + 273, h + 55);

	textStep = draw.createP('Angle Delta'); //.concat(stepSize.toFixed())
	textStep.style('color', '#000000');
	textStep.position(w + 475, h + 55);
	
	textColorHue = draw.createP('Node Hue'); //.concat(colorShift.toFixed())
	textColorHue.style('color', "#000000");
	textColorHue.position(w + 102, h + 77);

	textColorSaturation = draw.createP('Node Saturation'); //.concat(colorSaturation.toFixed())
	textColorSaturation.style('color', '#000000');
	textColorSaturation.position(w + 273, h + 77);

	textColorBrightness = draw.createP("Node Brightness"); //.concat(colorBrightness.toFixed())
	textColorBrightness.style('color', '#000000');
	textColorBrightness.position(w + 475, h + 77);

	textLoopSpeed = draw.createP('Speed'); //.concat(loopSpeed.toFixed())
	textLoopSpeed.style('color', '#000000');
	textLoopSpeed.position(w + 102, h + 100);

	textnodeX = draw.createP('X Size'); //.concat(nodeX.toFixed())
	textnodeX.style('color', '#000000');
	textnodeX.position(w + 273, h + 100);		

	textnodeY = draw.createP('Y Size'); //.concat(nodeY.toFixed())
	textnodeY.style('color', '#000000');
	textnodeY.position(w + 475, h + 100);

	textStrokeHue = draw.createP('Line Hue');
	textStrokeHue.style('color', '#000000');
	textStrokeHue.position(w + 102, h + 122);
	
	textStrokeSaturation = draw.createP('Line Saturation');
	textStrokeSaturation.style('color', "#000000");
	textStrokeSaturation.position(w + 273, h + 122);
	
	textStrokeBrightness = draw.createP('Line Brightness');
	textStrokeBrightness.style('color', "#000000");
	textStrokeBrightness.position(w + 475, h + 122);
	
	textStrokeWidth = draw.createP('Line Width');	
	textStrokeWidth.style('color', '#000000');
	textStrokeWidth.position(w + 102, h + 143);
}

function selectShapeEvent()
{
	//enableEllipse, enableSquare, enableTri
	let val = selectShape.value();
	
	switch (val) {
		case "ellipse":
			enableEllipse = true;
			enableSquare = false;
			enableTri = false;
			break;
		
		case "square":
			enableSquare = true;
			enableEllipse = false;
			enableTri = false;
			break;
			
		case "triangle":
			enableTri = true;
			enableEllipse = false;
			enableSquare = false;
			break;
		
		default: 
			enableEllipse = true;
			enableSquare = false;
			enableTri = false;
			break;
	}
}


function enableRandomizeColorEvent()
{
	if (this.checked) {
		if (randomizeColorChecked)
			randomizeColorChecked = false;
		else
			randomizeColorChecked = true;
	}
	
}

function enableRandomizeStrokeColorEvent()
{
	if (this.checked) {
		if (randomizeStrokeChecked)
			randomizeStrokeChecked = false;
		else
			randomizeStrokeChecked  = true;
	}
}


function restartDrawing(draw) {
	sketch.clear();
	s = 0;
	n = 0;
}

function pauseDrawing(draw) {
	sketch.noLoop();
}

function playDrawing(draw) {
	sketch.loop();
}

function resetCanvas() {
/*  	clear();
	s = 0;
	n = 0;  */
	location.reload();
}
////////// END phyllotaxis //////////



