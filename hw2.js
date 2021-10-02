	
function setup() { "use strict";
  	
// Variables
	var sliderLength = 100; // length of slider x and y
	var canvas = document.getElementById('myCanvas');
  	
	// Slider variables
	var sliderX = document.getElementById('sliderX');
  	sliderX.value = sliderLength/2;
  	
	var sliderY = document.getElementById('sliderY');
  	sliderY.value = sliderLength/2;

	// Sling button variables
	var slingButton = document.getElementById('slingButton');

	// Position where the sling string should start/ Sling center
	var slingStartX = 80; // initial x position of sling string when page is loaded
	var slingStartY = 203; // initial y position of sling string when page is loaded

	// Sling string end position
	var stringEndPosX = 80; // increase: closer to slingshot
	var stringEndPosY = 203; // increase: pull string downward, aiming upwards
	var stringEndPosBeforeFireX = 0; // x position of string just before firing the sling
	var stringEndPosBeforeFireY = 0; // y position of string just before firing the sling

	// Rock variables
	var rockPosX = stringEndPosX + 10; // x position of the rock
	var rockPosY = stringEndPosY + 5; // y position of the rock
	var isReleased = false; // state of rock
	var speedOfRock = 7;// refresh timer of animator
	var rockAnimatorTracker = null; // interval call for animator
	var angle = 0; // angle of sling string vector
	var time = 1; // time of rock during motion
	var displacementOfStringX = 0; // horizontal length of sling string displaced
	var displacementOfStringY = 0; // vertical length of sling string displaced
	var gravity = -0.95; // gravity for rock projectile motion

	// Grass variables
	var grassAnimatorTracker = null; // interval call for animator
	var originalStartingGrassX = 20; // starting position of grass
	var startingGrassX = 20; // current x position of grass
	var startingGrassY = 297; // current y position of grass
	var numberOfGrassToTheRight = 4; // number of duplicated grasses
	var distanceBetweenGrass = 100; // distance between each grass
	var distanceChanged = 15; // distance between movement of the grasses
	var speedOfGrass = 450; // speed of movement of grasses

	// Sun and moon variables
	var sunPosX = canvas.style.width / 2;
	var sunPosY = 20;
	var moonPosX = canvas.style.width / 2;
	var moonPosY = 20;
	

	// This function defines a drawings on the canvas
  	function draw() {
    		var context = canvas.getContext('2d');
    		canvas.width = canvas.width;

		// Variables to store the changes made on the slider
    		var dx = sliderX.value;
    		var dy = sliderY.value;

		context.translate(50,0);
    
		// This function draws sling shot
    		function DrawSlingShot() {
      			// sling handle
			context.fillStyle = "red";
			context.fillRect(80, 235 + ((55-35)/2), 7, 50);
			context.strokeRect(80, 235 + ((55-35)/2), 7, 50);

			// sling pillar 1 (right)
			context.fillStyle = "red";
			context.fillRect(80, 200-10, 10, 45); 
			context.strokeRect(80, 200-10, 10, 45); // added 10 to 210 and 45 (above too)
			
			DrawRock();


			// sling pillar 2 (left)
			context.fillStyle = "red";
			context.fillRect(75, 215-10, 10, 50); 
			context.strokeRect(75, 215-10, 10, 50);// added 10 to 225 and 50 (above too)
			
			// sling pillar support
			context.strokeStyle = "black";
			context.beginPath();
			context.moveTo(85, 255);
			context.lineTo(90, 235);
			context.lineTo(85, 235);
			context.lineTo(85, 255);
			context.stroke();
			context.fillStyle = "red";
			context.fill();
    		}
   
		// This function draws string of sling shot
   		function DrawSling() {
      		context.strokeStyle= "black";
      		context.beginPath();
			context.moveTo(80, 203); //fixed 
			context.lineTo(stringEndPosX + ((dx-50)*2), stringEndPosY + ((dy-50)*2));
			context.moveTo(stringEndPosX + ((dx-50)*2), stringEndPosY + ((dy-50)*2));
			displacementOfStringX = ((dx-50)*2);
			displacementOfStringY = ((dy-50)*2);
			context.lineTo(75, 218); // fixed
      
      			context.stroke();
     		}
		
		// This function draws ground where sling shot stands
		function DrawPlatform(){
			
			context.save();
			context.translate(-50, 0);			
			context.beginPath();
			context.fillStyle = "brown";
			context.fillRect(0, 295, 3000, 5);
			context.restore();
		}

		// This function draws the rock
		function DrawRock(){
			context.beginPath();

			if(isReleased ==false){
				context.arc(rockPosX + ((dx-50)*2), rockPosY + ((dy-50)*2), 15, 0, 2 * Math.PI);
			}else{
				context.arc(rockPosX, rockPosY, 15, 0, 2 * Math.PI);
			}


			context.stroke();
			context.fillStyle = "grey";
			context.fill();
		}

		// This function draws aim assist for the sling shot
		function DrawAimAssist(){

			// Get gradient of 2 points
			context.save();
			var speedMultiplier = Math.sqrt(Math.pow(slingStartX - (stringEndPosX + displacementOfStringX), 2) + Math.pow((slingStartY - (stringEndPosY+ displacementOfStringY) ), 2)) / 100;

			// Straight line equation y =mx + c is defined
			var m = (slingStartY - (stringEndPosY+displacementOfStringY))/ (slingStartX - (stringEndPosX+displacementOfStringX));
			var c = slingStartY - (m* slingStartX);
			var isRight = false;
			var directionConstant = 0; // Stores positive or negative numbers to track sling string direction

			// Checks if sling string is drawn towards the right
			if(slingStartX > stringEndPosX + displacementOfStringX){
				isRight = true;
				directionConstant = 5;
			}else{
				isRight = false;
				directionConstant = -5;
			}		

			// Define drawing of aim assist
			context.strokeStyle = "blue";	
			context.beginPath();
			context.moveTo(slingStartX + 10, m*(slingStartX+ 10) + c);
			context.lineTo(slingStartX + (directionConstant)*8*speedMultiplier, m*(slingStartX+ (directionConstant)*8*speedMultiplier) + c);
			context.stroke();
			context.restore();
			
		}
		
		// This function draws welcome/ instruction message on the screen
		function DrawLoadingScreen(){
			
			context.font = context.font = '50px serif';
			context.fillText('Press \'Sling!\' to launch!', 10, 90);
		}

		// This function draws the grass 
		function DrawGrass(){
		
			context.save();
				
			var heightOfLeftBush = 10; // stores the position of small bush
			var heightOfRightBush = 25; // stores the position of large bush


			// Defines drawing of grasses
			context.beginPath();
			context.fillStyle = "green";
		
			// Draws the first bush
			context.arc(startingGrassX, startingGrassY, heightOfLeftBush, 0, 2 * Math.PI);
			context.arc(startingGrassX + 30, startingGrassY, heightOfRightBush, 0, 2* Math.PI );
			
			// Draws the remaining bushe(s)
			for(var i = 0; i< numberOfGrassToTheRight; i++){
				startingGrassX = startingGrassX + distanceBetweenGrass;
				context.arc(startingGrassX, startingGrassY, heightOfLeftBush, 0, 2 * Math.PI);
				context.arc(startingGrassX + 30, startingGrassY, heightOfRightBush, 0, 2* Math.PI);
				
			}

			startingGrassX = originalStartingGrassX; // Reset the position of the bush to create windy effect
			context.fill();
			context.restore();	
		}

		function DrawSunAndMoon(radOfSun, radOfMoon, scaleX, scaleY, speedOfSun){
			
			moonPosX = 1; // 180 opposite to the sun
			moonPosY = 1; // 180 opposite to the sun

			context.save();
			context.scale(scaleX, scaleY);
			// Color changing function
			function sunColorChanger(){
				// Make changes to color
				context.fillStyle = "yellow";
			}
			function moonColorChanger(){
				// Make changes to color
				context.fillStyle = "blue";
			}
			sunColorChanger();
			moonColorChanger();

			function updateSunMoonPhysics(){
				sunPosX ++;
				moonPosX --;
			}

			context.arc(sunPosX, sunPosY, radOfSun, 0, 2 * Math.PI);
			context.arc(moonPosX, moonPosY, radOfMoon, 0, 2* Math.PI);
			context.restore();
		}


		// Calls all necessary drawing functions
		if(isReleased == false){
			
			DrawLoadingScreen();
		}
		DrawGrass();
    	DrawSling();	
    	context.save();
		DrawAimAssist();
		DrawSlingShot();
		DrawPlatform();
		context.restore();
    
  	}
	
	// Animations
	function sunAndMoonAnimator(){
		
	}

	// This function animates the grass
	function grassAnimator(){

		// CallS draw
		draw();

		// Updates the position of all grasses
		distanceChanged = distanceChanged * -1;
		startingGrassX = startingGrassX + distanceChanged;
		
		// Stops grass animation when game ends/ rock reaches the ground & end of canvas
		if(rockPosX >=600 || rockPosX <= -50 || rockPosY >= 279){

			clearInterval(grassAnimatorTracker);
		}
	}

	// This function calculates distance
	function distance(slingCenterX, slingCenterY, drawbackX, drawbackY){
		
		return Math.sqrt(Math.pow((slingCenterX - drawbackX), 2) + Math.pow((slingCenterY - drawbackY), 2));
	}
	
	// This function calculates angle between two points
	function angleBetweenTwoPoints(drawbackX, drawbackY, slingCenterX, slingCenterY){
		//return Math.atan2((300 - slingCenterY)- drawbackY, slingCenterX - drawbackX);
		return Math.atan2(slingCenterY - drawbackY, slingCenterX - drawbackX);
		
	}

	// This function animates rock path using projectile motion
	function rockTravelPath(){
		// Defines trajectory

		// Defines angle of sling string
		angle = (Math.PI/2) - angleBetweenTwoPoints(stringEndPosBeforeFireX, stringEndPosBeforeFireY, slingStartX, slingStartY);
		
		// Defines distance of sling string being pulled
		var dist = Math.min(distance(slingStartX, slingStartY, stringEndPosBeforeFireX, stringEndPosBeforeFireY), 90);
		dist = dist/30;	// Tweeks the original distance so that it is smaller, to reduce speed

		// Updates displacement of rock using equations
		// x = v * t * cos(theta)
		// y = v * t * sin(theta) - (1/2)*g* (t^2)	
		rockPosX = ((dist*Math.sin(angle))*time) + rockPosX; // Stores x position of rock at each frame
		rockPosY = ((((dist*Math.cos(angle))*time) - ((1/2)*gravity*(time*time))) + rockPosY); // Stores the y position of rock at each frame

		// Draws the changes made to the position of the rock
		draw();

		time+=0.14; // Updates the time interval when rock is traveling in the air
		
		// Stops rock animation when reach x=500 or y=270 boundary is reached
		if(rockPosX >=600 || rockPosX <= -50 || rockPosY >= 279){
			
			clearInterval(rockAnimatorTracker);
			time = 1;
		}


		
	}	

	// This function tracks when the sling button is pressed
	function slingRelease(){
		
		// This function defines animation of sling string when it is released
		function slingAnimation(){

			// Checks if sling string is already fired, if not store the position that is last stretched before firing
			if(isReleased == false){
				stringEndPosBeforeFireX = stringEndPosX + displacementOfStringX;
				stringEndPosBeforeFireY = stringEndPosY + displacementOfStringY;
			}	
			
			// Updates the position of the slider, to spring back its original position
			sliderX.value = sliderLength/2;
			sliderY.value = sliderLength/2;
			
			// Updates the position of the sling once its fired
			stringEndPosX = 80;
			stringEndPosY = 203;
		
			// Position of rock when not be altered once fired	
			if(isReleased == false){
				rockPosX = 80 + 10;
				rockPosY = 203 + 5;
			}

			isReleased = true; // Updates the condition of string release to true
			draw();

			// Starts rock animator
			rockAnimatorTracker = setInterval(rockTravelPath, speedOfRock);
			
		}

		slingAnimation();
			

	}
  	
 	// Event listeners
	sliderX.addEventListener("input",draw); // Slider that reflects the X position of sling string
  	sliderY.addEventListener("input",draw); // Slider that reflects the Y position of sling string
	slingButton.addEventListener("click", slingRelease); // Button that fires the sling		
	grassAnimatorTracker = setInterval(grassAnimator, speedOfGrass); // Starts grass animator 
	
	// Updates drawn frame
  	draw();
}


window.onload = setup; // Defines function call upon window load up
