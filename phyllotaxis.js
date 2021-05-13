//////////  SEIZURE WARNING  //////////
////////// START phyllotaxis //////////


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
let grSlider, cSlider, stepSlider, loopSpeedSlider;
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

// Checkboxes
let enableStrokeCheckbox, randomizeStrokeCheckbox; 
let randomizeColorCheckbox, randomizeAngleCheckbox; 

 
// UI
 
let img;


/* ***************** NEED TWO SEPARATE CANVASES:
						1) Handle the drawing
						2) UI
 ********************/
 
const sketch = new p5( (drawing) => {
	
	drawing.setup = () => {
		let canvas = drawing.createCanvas(drawing.windowWidth * 0.75, drawing.windowHeight * 0.75);	
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
		
		for (var i = 0; i <= n; i += stepSize)
		{		
			//gr = grSlider.value();
			c = cSlider.value();
			
			var angle = i * gr;
			var r = c * drawing.sqrt(i);
			var x = r * drawing.cos(angle);
			var y = r * drawing.sin(angle);
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
			
			
			drawing.ellipse(x, y, nodeX, nodeY); 
			
			//drawing.rect(x, y, nodeX, nodeY);
			
			//drawing.triangle(x, y, x + nodeX, y + nodeY, x + (nodeX * 2), y) 
			
			//img.resize()
			//drawing.image(img, x - 100, y - 100);
			
		}
		
		// Text .concat(var.toFixed()) to show values
		textBgHue = drawing.createP('BG Hue');
		textBgHue.style("color", "#000000");
		textBgHue.position(105, 848);
		
		textBgSaturation = drawing.createP('BG Saturation');
		textBgSaturation.style('color', "#000000");
		textBgSaturation.position(355, 848);
		
		textBgBrightness = drawing.createP('BG Brightness');//.concat(bgBrightness.toFixed())
		textBgBrightness.style('color', '#000000');
		textBgBrightness.position(605, 848);
		
		textGrStep = drawing.createP('Angle rotation'); //.concat(grStep.toFixed())
		textGrStep.style("color", "#000000");
		textGrStep.position(105, 873);
		
		textC = drawing.createP('Radius'); //.concat(c.toFixed())
		textC.style("color", "#000000");
		textC.position(605, 873);
		
		textStep = drawing.createP('Step Size'); //.concat(stepSize.toFixed())
		textStep.style('color', '#000000');
		textStep.position(105, 922);
		
		textnodeX = drawing.createP('X Size'); //.concat(nodeX.toFixed())
		textnodeX.style('color', '#000000');
		textnodeX.position(355, 922);		

		textnodeY = drawing.createP('Y Size'); //.concat(nodeY.toFixed())
		textnodeY.style('color', '#000000');
		textnodeY.position(605, 922);
		
		textColorHue = drawing.createP('Node Hue'); //.concat(colorShift.toFixed())
		textColorHue.style('color', "#000000");
		textColorHue.position(105, 898);
		
		textColorSaturation = drawing.createP('Node Saturation'); //.concat(colorSaturation.toFixed())
		textColorSaturation.style('color', '#000000');
		textColorSaturation.position(355, 898);
		
		textColorBrightness = drawing.createP("Node Brightness"); //.concat(colorBrightness.toFixed())
		textColorBrightness.style('color', '#000000');
		textColorBrightness.position(605, 898);
		
		textLoopSpeed = drawing.createP('Loop Speed'); //.concat(loopSpeed.toFixed())
		textLoopSpeed.style('color', '#000000');
		textLoopSpeed.position(355, 873);
		
		n += loopSpeed;
		s += 5;
		gr += grStep;
	};
	
});

// Handle the UI
const ui = new p5( (menu) => {
	
	menu.setup = () => {
		menu.createCanvas(menu.windowWidth * 0.75, menu.windowHeight * 0.25);
		
		createMainButtons(menu);
		createCheckBoxes(menu);
		createSliders(menu);
	};
	
	menu.windowResized = () => {
		menu.resizeCanvas(menu.windowWidth * 0.75, menu.windowHeight * 0.25);
	};
	
	menu.draw = () => {
		menu.background(200);
	};
});


function createMainButtons(draw) {
	// Main Buttons 
	resetButton = draw.createButton("Reset");
	resetButton.position(540, 812);
	resetButton.mousePressed(resetCanvas);
	
	playButton = draw.createButton("Play");
	playButton.position(600, 812);
	playButton.mousePressed(playDrawing, draw);
	
	pauseButton = draw.createButton("Pause");
	pauseButton.position(650, 812);
	pauseButton.mousePressed(pauseDrawing, draw);
	
	restartButton = draw.createButton("Restart");
	restartButton.position(712, 812);
	restartButton.mousePressed(restartDrawing, draw);	
}

function createCheckBoxes(draw) {
	enableStrokeCheckbox = draw.createCheckbox('Outline', true);
	enableStrokeCheckbox.position(0, 800);
	enableStrokeCheckbox.changed(enableStrokeEvent);
	
	randomizeStrokeCheckbox = draw.createCheckbox('Randomize Outline', false);
	randomizeStrokeCheckbox.position(0, 825);
	randomizeStrokeCheckbox.changed(enableRandomizeStrokeColorEvent);
	
	randomizeColorCheckbox = draw.createCheckbox('Randomize Color', false);
	randomizeColorCheckbox.position(250, 800);
	randomizeColorCheckbox.changed(enableRandomizeColorEvent);
	
	randomizeAngleCheckbox = draw.createCheckbox('Randomize Angle', false);
	randomizeAngleCheckbox.position(250, 825);
	//randomizeAngleCheckbox.changed()
}

function createSliders(draw) {
 	bgHueSlider = draw.createSlider(0, 360, 0, 0);
	bgHueSlider.style('width', '100px');
	bgHueSlider.position(0, 850);
	
	bgSaturationSlider = draw.createSlider(0, 100, 0, 0);
	bgSaturationSlider.style('width', '100px');
	bgSaturationSlider.position(250, 850); 
	
	bgBrightnessSlider = draw.createSlider(0, 100, 0, 0);
	bgBrightnessSlider.style('width', '100px');
	bgBrightnessSlider.position(500, 850); 
	
	grStepSlider = draw.createSlider(0, .5, 0.005, 0);
	grStepSlider.style('width', '100px');
	grStepSlider.position(0, 875);
	
	cSlider = draw.createSlider(0, 100, 10, 0);
	cSlider.style('width', '100px');
	cSlider.position(500, 875);

	stepSlider = draw.createSlider(0.05, 4, 2, 0);
	stepSlider.style('width', '100px');
	stepSlider.position(0, 925);
	
	nodeXSlider = draw.createSlider(1, 100, 25, 0);
	nodeXSlider.style('width', '100px');
	nodeXSlider.position(250, 925);
	
	nodeYSlider = draw.createSlider(1, 100, 25, 0);
	nodeYSlider.style('width', '100px');
	nodeYSlider.position(500, 925);
	
	colorHueSlider = draw.createSlider(0, 360, 200, 0);
	colorHueSlider.style('width', '100px');
	colorHueSlider.position(0, 900);
	
	colorSaturationSlider = draw.createSlider(0, 255, 255, 0);
	colorSaturationSlider.style('width', '100px');
	colorSaturationSlider.position(250, 900);

	colorBrightnessSlider = draw.createSlider(0, 100, 100, 0);
	colorBrightnessSlider.style('width', '100px');
	colorBrightnessSlider.position(500, 900);
	
	loopSpeedSlider = draw.createSlider(0.5, 100, 2, 0);
	loopSpeedSlider.style('width', '100px');
	loopSpeedSlider.position(250, 875);
	
	strokeHueSlider = draw.createSlider(0, 360, 0, 0);
	strokeHueSlider.style('width', '100px');
	strokeHueSlider.position(0, 950);
	
	strokeSaturationSlider = draw.createSlider(0, 255, 0, 0);
	strokeSaturationSlider.style('width', '100px');
	strokeSaturationSlider.position(250, 950);
	
	strokeBrightnessSlider = draw.createSlider(0, 100, 100, 0);
	strokeBrightnessSlider.style('width', '100px');
	strokeBrightnessSlider.position(500, 950);
	
	strokeWidthSlider = draw.createSlider(0.5, 20, 1, 0);
	strokeWidthSlider.style('width', '100px');
	strokeWidthSlider.position(0, 975);
}
 

function enableStrokeEvent()
{
	if (this.checked) {
		enableStrokeChecked = true;
	}
	
	else {
		enableStrokeChecked = false;
	}
}

function enableRandomizeColorEvent()
{
	if (this.checked) {
		randomizeColorChecked = true;
	}
	
	else {
		randomizeColorChecked = false;
	}
}

function enableRandomizeStrokeColorEvent()
{
	if (this.checked) {
		randomizeStrokeChecked  = true;
	}
	
	else {
		randomizeStrokeChecked = false;
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
/* 	clear();
	s = 0;
	n = 0; */
	location.reload();
}
////////// END phyllotaxis //////////



