//////////  SEIZURE WARNING  //////////
////////// START phyllotaxis //////////

/*
		TODO: Split these variables into globals.js 
*/
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
let strokeWidthSlider, volumeSlider;

// Text 
let textBgHue, textBgSaturation, textBgBrightness;
let textGrStep, textC, textStep, textnodeX, textnodeY;
let textColorHue, textColorSaturation, textColorBrightness;
let textLoopSpeed, textStrokeHue, textStrokeWidth;
let textStrokeSaturation, textStrokeBrightness;

// Buttons
let playButton, pauseButton, restartButton, resetButton;

// Checkboxes 
let randomizeStrokeCheckbox; 
let randomizeColorCheckbox;
let muteAudioCheckbox;

// Checkbox Values
var enableStrokeChecked = true;
var enableMuteAudioChecked = false;
var randomizeStrokeChecked = false;
//var randomizeAngleChecked 
var randomizeColorChecked = false;

// Dropdown
let selectShape, enableSquare, enableTri, selectDrawDimension;
let enable3D = false;
let enableEllipse = true;
 
// UI
var canvas, startButton, drawingHeight, UIRefWidth, UIRefHeight, UIBox;
var resizeUIWidth, resizeUIHeight;
let hasStarted = false;
let img;	// Let users upload Image? // how do sound parameters affect sound?

// Testing
var totalDrawCalls = 0;
var totalShapesDrawn = 0;
// need to cap graphics off at a certain level to avoid performance dedgradation
var totalPlaySoundCalls = 0;

// Sound 
const audioData = JSON.parse(data);
var isPlaying = false;
var volumeSliderValue;
var maxVol = -6;
var maxBpm = 300;
var vol, osc, bpm, delay; 

// How graphics map to arpeggiator 
///////////////////////////////////////////////////////////////////////////////////////////////////////////
//  							(ADSR?) (Gate?) (Slide?) (Octave?) (FM?) (Pitch Bend?)
//								(Noise Osc?)
//	Shape: 						osc type 
//	Angle:						scale type
//  Node Hue:					filter cutoff	
//  Node Saturation:
//	Node Brightness:
//  Background Color:		
//  Background Saturation:
//	Background Brightness:
//  Stroke color:				filter attack
//  Stroke Saturation:
//	Stroke Brightness:
//	Outline width: 				osc attack
//	Radius:						starting octave
//  Rotation: 					arp direction (up/down)
//	Speed:						bpm 
//  Node Size:					osc decay
//  X,Y coords???				start note? 
//	Randomize Color:			random scale
//	Randomize Outline: 			random filter position
//  Image?						sampler upload (provide defaults)
///////////////////////////////////////////////////////////////////////////////////////////////////////////

// Main drawing area 
const SketchSystem = new p5( (drawing) => {
	drawing.setup = () => {
		// optimize performance turn off warnings
		p5.disableFriendlyErrors = true;
		//img = drawing.loadImage("img/cat.png");
		startButton = drawing.createButton("Start");
		startButton.mousePressed(InitializeSoundSystem);

		//img = drawing.loadImage("img/cat.png");
/* 		if (enable3D)
		{
			canvas = drawing.createCanvas(drawing.windowWidth * 0.5, drawing.windowHeight * 0.75, drawing.WEBGL);
		} */
		// put 3D stuff in a separate sketch
		canvas = drawing.createCanvas(drawing.windowWidth * 0.75, drawing.windowHeight * 0.75);
		canvas.position(0, 25);
		drawingHeight = drawing.windowHeight * 0.75;
		canvas.parent("SketchSystem");
		canvas.center("horizontal");
		drawing.angleMode(drawing.DEGREES);
		drawing.colorMode(drawing.HSB);
		//draw into an off-screen graphics buffer
		// drawing.createGraphics 
		drawing.frameRate(30);
		//drawing.blendMode(drawing.MULTIPLY);
		//let d = drawing.pixelDensity();
		//drawing.loadPixels(1);
	};
	
	drawing.windowResized = ()  => {
		drawing.resizeCanvas(drawing.windowWidth * 0.75, drawing.windowHeight* 0.75);
	};
	
	drawing.preload = () => {
		//??? this doesn't work
		//img = drawing.loadImage("img/cat.png");
	};
	
	drawing.draw = () => {
		const totalStartTime = performance.now();			
		let fps = drawing.frameRate();
		let frameCount = drawing.frameCount;	
		//console.log(`FPS: ${fps.toFixed(2)}, frame cnt: ${frameCount}`);		
		
		var opt = false;
		if (hasStarted) {
						
			drawing.translate(drawing.width / 2, drawing.height / 2); // 2D
			//drawing.translate(drawing.width / 10, drawing.height / 10); // 3D
			drawing.background(bgHue, bgSaturation, bgBrightness);
			//drawing.background(img);
			
			if (drawing.WEBGL)
			{
				// 2D coordinate origin => upper left corner
				// 3D coordinate origin => center 
			}
			
			//draw into an off-screen graphics buffer
			// drawing.createGraphics 	
	
	
			// consolidate background/node color + saturation/brightness 
			//into one slider?
			stepSize 			= stepSlider.value(); 
			nodeX 				= nodeXSlider.value();
			nodeY 				= nodeYSlider.value();
			colorShift 			= colorHueSlider.value();
			bgHue 				= bgHueSlider.value();
			bgSaturation 		= bgSaturationSlider.value();
			bgBrightness 		= bgBrightnessSlider.value(); 
			colorSaturation 	= colorSaturationSlider.value();
			colorBrightness 	= colorBrightnessSlider.value();
			loopSpeed 			= loopSpeedSlider.value();
			grStep 				= grStepSlider.value();
			strokeHue 			= strokeHueSlider.value();
			strokeSaturation 	= strokeSaturationSlider.value();
			strokeBrightness 	= strokeBrightnessSlider.value();
			strokeWidth 		= strokeWidthSlider.value();
			
			volumeSliderValue 	= volumeSlider.value();
			if (frameCount % 5 == 0)
			{	
				PlaySound();
			}		
			
			for (var i = 0; i <= n; i += stepSize)	
			{					
				c = cSlider.value();
				
				var angle = i * gr;
				var r;
				var x;
				var y;
				
				let fps = drawing.frameRate();
				// use native js if performance is bad
				// this optimization causes jitter
/* 				if (fps < 30)
				{
					r = c * drawing.sqrt(i);
					x = r * Math.cos(angle);
					y = r * Math.sin(angle);	
					opt = true;
				} */				
				//else
				//{
					r = c * drawing.sqrt(i);
					x = r * drawing.cos(angle);
					y = r * drawing.sin(angle);	
				//}
				
				var shift = 0;
				// experiment with this for more randomization options
/* 				if (fps < 10)
				{
					shift = Math.cos(s + i * 0.5);
				} */
				//else
				//{
					shift = drawing.cos(s + i * 0.5);
				//}
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

				if (Math.abs(x) < Math.abs(drawing.width) || Math.abs(y) < Math.abs(drawing.height)) {
					
					/*//if (enable3D)
					//{
						let dirY = (drawing.mouseY / drawing.height - 0.5) *2;
						let dirX = (drawing.mouseX / drawing.width - 0.5) *2;	
						drawing.directionalLight(250, 250, 250, dirX, -dirY, 0.25);
						drawing.fill(colorShift, colorSaturation, colorBrightness);
						drawing.pointLight(colorShift, colorSaturation, colorBrightness, x, y, 0);
						drawing.sphere(nodeX, 10, 10);
						drawing.translate(x, y);
						drawing.rotateY(drawing.millis() / 10000);
						drawing.rotateX(drawing.millis() / 10000);
						drawing.rotateZ(drawing.millis() / 10000); 
					//} */
					
					if (enableEllipse)
					{
						
						// lerpColor (gradient)
						//drawing.updatePixels(x, y, 1, 1);
						drawing.ellipse(x, y, nodeX, nodeY);
					}
					
					if (enableSquare)
					{
						drawing.rect(x, y, nodeX, nodeY);
					}
					
					if (enableTri)
					{
						drawing.triangle(x, y, x + nodeX, y + nodeY, x + (nodeX * 2), y);
					}
				}
				
				else
				{
					//console.log("Did I make it here?");
					continue;
				}
								

				/*
					 -> resizing node size should resize image
					 -> grey out randomize checkboxes when image enabled
					 -> allow user to upload their own pictures? (limit file/image size)
					 -> allow user to upload their own audio samples? (limit duration)
				
				*/				
/* 				
			img.resize(100, 100);
				drawing.image(img, x - 80, y - 80);
				drawing.rotateX(drawing.frameCount * 0.01);
				drawing.rotateY(drawing.frameCount * 0.01);
				drawing.rotateZ(drawing.frameCount * 0.01);
				drawing.texture(img);
				drawing.noStroke()
				drawing.box(nodeX)
				drawing.translate(x, y);
				drawing.blend(img, x - 80, y - 80, 120, 120, x, y, 120, 120, DIFFERENCE);
				*/
			}
			
			n += loopSpeed;
			s += 10;				// randomize color speed
			gr += grStep;		
		}	
		/*
 		const totalDuration = performance.now() - totalStartTime;
		console.log(`Total drawing took: ${totalDuration}ms`); 
		*/
	};
	
});

// Handle the UI
const UISystem = new p5( (menu) => {
	
	menu.setup = () => {
		// optimize performance turn off warnings
		p5.disableFriendlyErrors = true;
		UIBox = menu.createCanvas(menu.windowWidth * 0.5, menu.windowHeight * 0.25);
		//r.parent("SketchSystem");		
		UIBox.position(canvas.position().x, drawingHeight + canvas.position().y);
				
		UIRefWidth = canvas.position().x + 10;
		UIRefHeight = drawingHeight + canvas.position().y;
		
		resizeUIWidth = menu.windowWidth * 0.5;
		resizeUIHeight = menu.windowHeight * 0.25;		

		// In drawText use Text() to create slider names
		// will allow me to set textSize()?

		createMainButtons(menu, UIRefHeight, UIRefWidth);
		createCheckBoxes(menu, UIRefHeight, UIRefWidth);
		createSliders(menu, UIRefHeight, UIRefWidth, resizeUIHeight, resizeUIWidth);
		drawText(menu, UIRefHeight, UIRefWidth);
		createDropdown(menu, UIRefHeight, UIRefWidth);
	};
	
	menu.windowResized = () => {
		menu.resizeCanvas(menu.windowWidth * 0.5, menu.windowHeight * 0.25);
		
		UIRefWidth = canvas.position().x + 10;
		UIRefHeight = drawingHeight + canvas.position().y;
		
		//console.log(`UIRefWidth: ${UIRefHeight}`);
		resizeUIWidth = menu.windowWidth * 0.5;
		resizeUIHeight = menu.windowHeight * 0.25;	
		//console.log(`ResizeHeight: ${resizeUIHeight}`);
		
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
// DRAWING HELPER FUNCTIONS
///////////////////////////////////////////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////////////////////////////////////////////////
//		AUDIO HELPER FUNCTIONS																		     //
///////////////////////////////////////////////////////////////////////////////////////////////////////////
async function InitializeSoundSystem()
{
	hasStarted 		= true;
	isPlaying 		= true;
	// set volume and default params
	
	await Tone.start();
	console.log("audio is ready");
}

/*async*/ function PlaySound()
{
	// readFile 
	//var startOctIndex = 0;
	//var startNoteIndex = 0;
	//audioData.Octave4[startOctIndex]
	//audioData.major[startNoteIndex];	
	// loopSpeed = 0.001 - 100
	bpm = MapToRange(loopSpeed, 0.001, 100, 60, 300);
	vol = new Tone.Volume(volumeSliderValue).toDestination();
	//delay = new Tone.Delay(0.5).toDestination();
	osc = new Tone.Oscillator().connect(vol).toDestination();

	// set osc type
	if (enableEllipse)
	{
		osc.type = "sine1";
	}
	else if (enableSquare)
	{
		osc.type = "square1";
	}	
	else if (enableTri)
	{
		osc.type = "triangle1";
	}	
	
	if (!enableMuteAudioChecked) 
	{
		Tone.Transport.bpm.value = bpm;
		Tone.Transport.timeSignature = 4;
		osc.start(0).stop("+0.025");
	}	
}

function MapToRange(val, inRangeMin, inRangeMax, outRangeMin, outRangeMax)
{
	return (val - inRangeMin) * (outRangeMax - outRangeMin) / (inRangeMax - inRangeMin) + outRangeMin;
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////
//		UI HELPER FUNCTIONS																				 //
///////////////////////////////////////////////////////////////////////////////////////////////////////////
function createMainButtons(draw, h, w) {
	// Main Buttons 
	resetButton = draw.createButton("Reset");
	resetButton.position(w + 350, h);
	resetButton.mousePressed(resetCanvas);
	
	playButton = draw.createButton("Play");
	playButton.position(w + 400, h);
	playButton.mousePressed(function() {playDrawing(draw);});
	
	pauseButton = draw.createButton("Pause");
	pauseButton.position(w + 440, h);
	pauseButton.mousePressed(function() {pauseDrawing(draw);});
	
	restartButton = draw.createButton("Restart");
	restartButton.position(w + 490, h);
	restartButton.mousePressed(function() {restartDrawing(draw);});	
}

function createCheckBoxes(draw, h, w) {
	
	randomizeStrokeCheckbox = draw.createCheckbox('Random Outline', false);
	randomizeStrokeCheckbox.position(w + 200, h);
	randomizeStrokeCheckbox.changed(enableRandomizeStrokeColorEvent);
	
	randomizeColorCheckbox = draw.createCheckbox('Random Color', false);
	randomizeColorCheckbox.position(w + 80, h);
	randomizeColorCheckbox.changed(enableRandomizeColorEvent);
	
	muteAudioCheckbox = draw.createCheckbox('Mute Audio', false);
	muteAudioCheckbox.position(w + 600, h );
	muteAudioCheckbox.changed(enableMuteAudioEvent);
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
	
/* 	selectDrawDimension = draw.createSelect();
	selectDrawDimension.position(w, h + 180);
	selectDrawDimension.option("2D");
	selectDrawDimension.option("3D");
	selectDrawDimension.changed(function() {
		let val = selectShape.value();
		console.log("Is this called?");
		switch (val) {
			case "2D":
				enable3D = false;
				break;
			case "3D":
				enable3D = true;
				break;
			default:
				enable3D = false;
				break;
		}
		draw.setup();
	}); */
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

	loopSpeedSlider = draw.createSlider(0.001, 100, 0.5, 0);
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
	
	volumeSlider = draw.createSlider(-90, -6, -12, 0);
	volumeSlider.style('width', '100px');
	volumeSlider.position(w + 600, h+ 20);
}

function drawText(draw, h, w)
{
	// Text .concat(var.toFixed()) to show values
	textBgHue = draw.createP("BG Hue"); //.concat(bgHue.toFixed(2)); 
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
			enableEllipse 	= true;
			enableSquare 	= false;
			enableTri 		= false;
			break;
		
		case "square":
			enableSquare 	= true;
			enableEllipse 	= false;
			enableTri 		= false;
			break;
			
		case "triangle":
			enableTri 		= true;
			enableEllipse 	= false;
			enableSquare	= false;
			break;
		
		default: 
			enableEllipse 	= true;
			enableSquare 	= false;
			enableTri 		= false;
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

function enableMuteAudioEvent()
{
	if (this.checked) {
		if (enableMuteAudioChecked)
			enableMuteAudioChecked = false;
		else
			enableMuteAudioChecked = true;
	}
}

function restartDrawing(draw) {
	draw.clear();
	s = 0;
	n = 0;
}

function pauseDrawing(draw) {
	
	if (draw.isLooping())
	{
		draw.noLoop();
		console.log("Inside Pause");
	}
}

function playDrawing(draw) {
	
	if (!draw.isLooping())
	{
		draw.loop();
		console.log("Inside Play");
	}
}

function resetCanvas() {
/*  	clear();
	s = 0;
	n = 0;  */
	location.reload();
}
////////// END phyllotaxis //////////



