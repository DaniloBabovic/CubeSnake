	
	var player;
	var controls;
	var Player = function()
	{
		var self = {};
		
		self.init = function()
		{
			self.position = -1;
			self.solutionIndex = 0;
			self.fordvard = true;	
		}
		
		self.keyDown = function(event)
		{
			if (event.keyCode == 38)
			{
				//up
				//stage3D.camera.position.z += 10; 
			}
			if (event.keyCode == 40)
			{
				//down
				//stage3D.camera.position.z -= 10;
			}
			
			if (event.keyCode == 39)
			{
				//stage3D.selectNext();
				//l.overwrite("key", "right");
			}
			if (event.keyCode == 37)
			{
				//stage3D.selectPrevious();
				//l.overwrite("key", "left");
			}
		    return false;
		}
		
		self.validateCubeString = function(strCubes)
		{
			var firstChar = strCubes[0];
			l.print("firstChar", firstChar);
			var lastChar = strCubes[strCubes.length - 1];
			if (firstChar == '1')
			{
				l.print("Validate Error", "First char can not be 1", "#FF0000");
				return false;
			}
			if (lastChar == '1')
			{
				l.print("Validate Error", "Last char can not be 1", "#FF0000");
				return false;
			}
			var char; 
			for (var i = 0; i < strCubes.length; i++)
			{
				char = strCubes[i];
				if ((char == '1') ||(char == '0'))
				{
					//ok
				}
				else
				{
					l.print("Validate Error", "Found ilegal char: " + strCubes[i], "#FF0000");
					return false;
				}
			}
			return true;
		}	
		
		self.updateSnake = function()
		{
			var input = document.getElementById("snakeStringInput");
			if (self.validateCubeString(input.value) == false)
			{
				l.print("Abort.", "Change string then try again.", "#FF0000");
				return;
			}
			freeSolutions();
			//l.print("inputStr", input.value);
			
			solutionCount = getSnakeCubeSolutionCount([3, 3, 3], input.value);
			stage3D.free();
			controls.insertComboBox();
			stage3D = new Stage3D();
			if (solutionCount > 0)
			{
				self.solutionIndex = 0;
				self.loadCubeSnake();
			}
			l.print("Found " + solutionCount + " solutions");
		}
		
		self.changeSolution = function(index)
		{
			try
			{
				self.position = -1;
				stage3D.free();
				stage3D = new Stage3D();
				self.solutionIndex = index;
				self.loadCubeSnake();
			}
			catch(err)
			{
				txt="Error in updateSnake.\n\n";
				txt+="Error description: " + err.message + "\n\n";
				errorEvent(txt);
			}
		}
		
		self.previousPosition = function()
		{
			if (stage3D.callMeMaybe != null)
			{
				l.print('Chill-lax', 'please.');
				return;
			}
			try
			{
				var cubeList = solutionKeeper[self.solutionIndex];
				var cube;
				var from;
				if (self.fordvard == true)
				{
					from = self.position;
				}
				else
				{
					from = self.position - 1;
				}
				for (var i = from; i > 0; i--)
				{
					cube = cubeList[i];
					if (cube.rotationCount > 0)
					{
						stage3D.selectCube(cube.index + 1);
						var animateRotation = new AnimateRotationReverse(cube);
						self.position = i;
						self.fordvard = false;
						return;
					}	
				}
			}
			catch(err)
			{
				txt="Error in previousPosition.\n\n";
				txt+="Error description: " + err.message + "\n\n";
				errorEvent(txt);
			}
			l.print("Player", "No more previous.");
		}
		
		self.nextPosition = function()
		{
			if (stage3D.callMeMaybe != null)
			{
				l.print('Chill-lax', 'please.');
				return;
			}
			try
			{
				var cubeList = solutionKeeper[self.solutionIndex];
				var cube;
				if (self.fordvard == true)
				{
					from = self.position + 1;
				}
				else
				{
					from = self.position;
				}
				for (var i = from; i < cubeList.length; i++)
				{
					cube = cubeList[i];
					if (cube.rotationCount > 0)
					{
						//stage3D.selected = groupS[cube.index + 1];
						stage3D.selectCube(cube.index + 1);
						var animateRotation = new AnimateRotation(cube);
						self.position = i;
						self.fordvard = true;
						return;
					}
				}
			}
			catch(err)
			{
				txt="Error in nextPosition.\n\n";
				txt+="Error description: " + err.message + "\n\n";
				errorEvent(txt);
			}
			l.print("Player", "No more next.");
		}
		
		self.loadCubeSnake = function()
		{
			//l.print("firstCube.cubeList.length", firstCube.cubeList.length);
			var cube;
			var look;
			var alpha;
			for (var i = 0; i < firstCube.cubeList.length; i++)
			{
				cube = firstCube.cubeList[i];
				if (cubeInBound(cube) == true)
				{
					look = stage3D.lookNormal;
					alpha = 0.4;
				}
				else
				{
					look = stage3D.lookWireframe;
					alpha = 0.1;
				}
				stage3D.addCube(cube, cube.position, cube.direction, look, alpha);
			}
		}
		try
		{
			self.init();
			self.loadCubeSnake();
			window.addEventListener("keydown", self.keyDown);
		}
		catch(err)
		{
			txt="Error in Player.create\n\n";
			txt+="Error description: " + err.message + "\n\n";
			errorEvent(txt);
		}
		return self;
	}
	
	var Controls = function()
	{
		self = {};
		self.controlsWidth = 300;
		self.height = 600;
		self.controlsTop = 10;
		self.controlsRight = true;
		self.styleSmall = 'style="font-size:10pt; color:white; font-family: tahoma;"';
		self.styleNormal = 'style="font-size:12pt; color:white; font-family: tahoma;"';
		self.styleLink = 'style="color:#777777;font-size:10pt; font-family: tahoma;"';
		self.url = 'href="http://www.mapalchemy.appspot.com/doc/map_alchemy.html"';
		
		self.insertComboBox = function()
		{
			var topDiv = 'divDemoTop';
			var i, theContainer, theSelect, theOptions, numOptions, anOption;
			theOptions = [];
			theContainer = document.getElementById('div_combo_solution');
			if (theContainer != null)
			{
				document.getElementById(topDiv).removeChild(theContainer);
			}
			
			for (var i = 0; i < solutionKeeper.length; i++)
			{
				theOptions.push('Solution ' + (i + 1));
			}
			theContainer = document.createElement('div');
			theContainer.id = 'div_combo_solution';
			var html =
				'<span ' + self.styleSmall + '>' +
					'Select solution:' +
				'<span></br>';
			
			theContainer.innerHTML = html;
			theSelect = document.createElement('select');
			theSelect.name = 'combo_ select_solution';
			theSelect.id = 'combo_solution';
			
			theSelect.onchange = function ()
			{
				//l.clear();
				l.print('Selected solution is: ' + (this.selectedIndex + 1));
				player.changeSolution(this.selectedIndex);
			};
			
			for (i = 0; i < theOptions.length; i++)
			{
				anOption = document.createElement('option');
				anOption.value = i;
				anOption.innerHTML = theOptions[i];
				theSelect.appendChild(anOption);
			}
			document.getElementById(topDiv).appendChild(theContainer);
			theContainer.appendChild(theSelect);
		}
		
		self.insertRootDiv = function()
		{
			self.y = self.controlsTop;
			self.width = self.controlsWidth - 20 +"px";
			if (self.controlsRight == true)
			{
				self.x = window.innerWidth - self.controlsWidth;
			}
			else
			{
				self.x = 10;
			}
			self.div = document.createElement('div');
			self.div.id = 'rootDiv';
			self.div.style.overflow = "auto";
			self.div.style.position = 'absolute';
			self.div.style.left = self.x + 'px';
			self.div.style.top = self.y + 'px';
			self.div.style.width = self.width;
			self.div.style.height = self.height;
			self.div.style.backgroundColor = '#111111';
			document.body.appendChild(self.div);
			
			self.topParagraph = document.createElement('p');
			self.topParagraph.textContent = " ";
			self.topParagraph.style="margin:0;font-size:10pt;line-height:10pt";	
			self.div.appendChild(self.topParagraph);
		}
		
		self.insertDivDemoTop = function()
		{
			self.html =
				'<span ' + self.styleNormal + '>' +
					'Cube snake  demo' +
				'</span></br>' +
				'<span ' + self.styleSmall + '>' +
					'by Danilo Babovic&nbsp&nbsp' +
				'</span>' +
				'<a ' + self.styleLink + ' ' + self.url + '>'+
					'more...' +
				'</a><br/><br/>'+
				'<span ' + self.styleSmall + '>' +
					'Snake string:' + 
				'</span><br/>' +
				'<input id="snakeStringInput" value="' +
					'001110110111010111101010100' +
				'" style="width:18em"></input><br/>' +
				'<button id="btnUpdateSnake" onclick="player.updateSnake()">' +
					'Change snake' +
				'</button><br/><br/>';
			
			var newParagraph = document.createElement('p');
			newParagraph.id = 'divDemoTop';
			newParagraph.innerHTML = self.html;
			self.div.appendChild(newParagraph, self.topParagraph);
			self.topParagraph = newParagraph;
			self.insertComboBox();
		}
		
		self.insertDivDemoPrevNext = function()
		{
			
			self.html =
				'<span ' + self.styleSmall + '>' +
					'Click > to play steps.' +
				'</span></br>' +
				'<button id="btnPrevious" onclick="player.previousPosition()"><</button>' +
				'<button id="btnNext" onclick="player.nextPosition()">></button>' +
				'<span id="spanPosition"  ' + self.styleSmall + '>' +
					'Position:' +
				'<span>' +
				'<span id="spanPosition"  ' + self.styleSmall + '>' +
					'1' +
				'<span><br/>';
				
			newParagraph = document.createElement('p');
			newParagraph.id = 'divDemoPrevNext';
			newParagraph.innerHTML = self.html;
			self.div.appendChild(newParagraph, self.topParagraph);
			self.topParagraph = newParagraph;
		}
			
		self.insertButtonShowControls = function()
		{
			self.html =
				'<button id="btnShowControls" onclick="controls.printControls()">' +
					'Show controls' +
				'</button><br/><br/>';
				
			newParagraph = document.createElement('p');
			newParagraph.id = 'divDemoPrevNext';
			newParagraph.innerHTML = self.html;
			self.div.appendChild(newParagraph, self.topParagraph);
			self.topParagraph = newParagraph;
		}
		
		self.printControls = function()
		{
			l.print("Mouse drag:", "Rotate around Y", "#CCCC44");
			l.print("Mouse wheel:", "Zoom to [0, 0, 0]", "#CCCC44");	
		}
		
		self.insertHTML = function()
		{
			try
			{
				self.insertRootDiv();
				self.insertDivDemoTop();
				self.insertDivDemoPrevNext();
				self.insertButtonShowControls();
			}
			catch(err)
			{
				txt="Error in insertHTML.\n\n";
				txt+="Error description: " + err.message + "\n\n";
				errorEvent(txt);
			}
		}
		
		self.positionChanged = function(cube, newPosition, direction)
		{
			document.getElementById('spanPosition').innerHTML = "Position " + newPosition;
			stage3D.positionChanged(cube, newPosition, direction);
		}
		
		self.insertHTML();
		return self;
	}
	
	
	
	
	
	
	
	