	
	var stage3D;
	var controls;
	var groupS = [];
	var cubeMeshS = [];
	var arrowS = [];
	var insertCount = 0;
	
	var matirialDone;
	var matirialActive;
	var matirialOut;
	var matirialBetween;
	
	var Stage3D = function()
	{
		var self = {};
		
		self.setWindowsSize = function()
		{
			self.logerWidth = 300;
			self.windowWidth = window.innerWidth - self.logerWidth;
			self.windowHeight = window.innerHeight;
			self.windowHalfX = self.windowWidth/2;
			self.windowHalfY = self.windowHeight/2;
		}
		
		self.init = function()
		{
			self.hi = 'hi there :)';
			self.callMeMaybe = null;
			self.dummy = null;
			self.controls = null;
			self.selected = null;
			self.selectedIndex = 0;
			
			self.container = null;
			self.stats = null;
			self.camera = null;
			self.scene = null;
			self.renderer = null;
			self.geometry = null;
			self.axis = null;
			self.groupRoot = null;
			
			self.setWindowsSize();
			
			self.mouseX = 0;
			self.mouseY = 0;
			
			self.lookWireframe = 0;
			self.lookNormal = 1;
			
			self.cubeSize = 25;
			self.controls = null;
		}
		
		self.onWindowResize = function()
		{
			self.setWindowsSize();
			self.camera.aspect = self.windowWidth/self.windowHeight;
			self.camera.updateProjectionMatrix();
			self.renderer.setSize(self.windowWidth, self.windowHeight);
		}

		self.onDocumentMouseMove = function(event)
		{
			var x = event.clientX;
			var y = event.clientY;
			
			if (x > self.windowWidth)
			{
				x = self.windowHalfX + 40;
				y = self.windowHalfY - 40;
			}
			
			self.mouseX = (x - self.windowHalfX) * 5;
			self.mouseY = (y - self.windowHalfY) * 5;
		}

		self.animate = function()
		{
			requestAnimationFrame(self.animate);
			self.render();
			self.stats.update();
			if (self.controls != null)
			{
				self.controls.update();
			}
		}

		self.render = function()
		{
			if (self.callMeMaybe != null) self.callMeMaybe();
			if (self.selected == null)
			{
				self.camera.lookAt(self.scene.position);
			}
			else
			{
				self.camera.lookAt(self.selected.matrixWorld.getPosition());
			}
			self.renderer.render(self.scene, self.camera);
		}
		
		self.initMaterials = function()
		{
			try
			{
				matirialDone = new THREE.MeshNormalMaterial({color: 0x0000FF, opacity: 0.8});
				matirialActive = new THREE.MeshBasicMaterial({color: 0xff4444, opacity: 0.7});
				matirialOut = new THREE.MeshBasicMaterial({color: 0x00ffff, wireframe: true, side: THREE.DoubleSide, opacity: 0.2});
				matirialBetween = new THREE.MeshBasicMaterial({color: 0xFFFF00, opacity: 0.7});
			}
			catch(err)
			{
				txt="Error in creating materials.\n\n";
				txt+="Error description: " + err.message + "\n\n";
				alert(txt);
			}
		}
		
		self.getMaterial = function(lookLike, opacity)
		{
			if (lookLike == self.lookNormal)
			{
				return  matirialDone;
			}
			if (lookLike == self.lookWireframe)
			{
				return matirialOut;
			}
			return new THREE.MeshNormalMaterial({color: 0x0000FF, opacity: opacity });
		}
		
		self.positionChanged = function(selectedCube, index, directionFordvard)
		{
			if (index <0) return;
			var mesh;
			var nextIndex = -1;
			var cube;
			if (directionFordvard == true)
			{
				for (var i = index + 1; i < selectedCube.cubeList.length - 1; i++)
				{
					cube = selectedCube.cubeList[i];
					if (cube.canRotate == true)
					{
						nextIndex = i;
						break;
					}
				}
				if (nextIndex == -1)
				{
					nextIndex = selectedCube.cubeList.length;
				}
				else
				{
					mesh = cubeMeshS[nextIndex];
					mesh.material = matirialActive;
				}
				for (var i = 0; i < selectedCube.cubeList.length; i++)
				{
					mesh = cubeMeshS[i];
					if (i < nextIndex)
					{
						mesh.material = matirialDone;
					}
					if (i > nextIndex)
					{
						mesh.material = matirialOut;
					}
				}			
			}
			else
			{
				var prevIndex = -1;
				for (var i = index - 1; i > - 1; i--)
				{
					cube = selectedCube.cubeList[i];
					if (cube.canRotate == true)
					{
						prevIndex = i;
						break;
					}
				}
				
				if (nextIndex == -1)
				{
					nextIndex = selectedCube.cubeList.length;
				}
				else
				{
					mesh = cubeMeshS[prevIndex];
					mesh.material = matirialActive;
				}
				
				for (var i = 0; i < cubeMeshS.length; i++)
				{
					mesh = cubeMeshS[i];
					if (i < prevIndex)
					{
						mesh.material = matirialDone;
					}
					
					if ((i > prevIndex) && (i <= index))
					{
						mesh.material = matirialBetween;
					}
					if (i > index)
					{
						mesh.material = matirialOut;
					}
				}
				
				if (nextIndex != -1)
				{
					mesh = cubeMeshS[prevIndex];
					mesh.material = matirialActive;
				}
			}
		}
		
		self.addCube = function(cubeSolution, positionIndex, direction, lookLike, alpha)
		{			
			insertCount++;
			var group = new THREE.Object3D(direction);
			group.updateMatrix();
			if (groupS.length == 0)
			{
				self.scene.add(group);
			}
			else
			{
				var groupParent = groupS[groupS.length - 1];
				groupParent.add(group);
			}
			groupS.push(group);
			var material = self.getMaterial(lookLike, alpha);
			var geometry = new THREE.CubeGeometry(self.cubeSize, self.cubeSize, self.cubeSize);
			var mesh = new THREE.Mesh(geometry, material);
			
			group.materialCube = material;
			group.geometryCube = geometry;
			group.meshCube = mesh;
			
			var offset = self.cubeSize + 5;
			var x = 0;
			var y = 0;
			var z = 0;
			
			if (cubeSolution.index == 0)
			{
				x += offset/2;
				y += offset/2;
				z += offset/2;
			}
			else
			{
				var parentCubeSolution = cubeSolution.cubeList[cubeSolution.index - 1];
				var parentDirection = parentCubeSolution.direction;
				if (parentDirection[0] != 0)
				{
					x += offset;
				}
				if (parentDirection[1] != 0)
				{
					y += offset;
				}
				if (parentDirection[2] != 0)
				{
					z += offset;
				}
			}	
			group.position.x = x;
			group.position.y = y;
			group.position.z = z;
			
			mesh.matrixAutoUpdate = true;
			mesh.updateMatrix();
			group.add(mesh);
			cubeMeshS.push(mesh);
			var arrowArray = [cubeSolution.index, null];
			if (cubeSolution.canRotate == true)
			{
				var arrowColor = '#FFFFFF';
				var arrow = new THREE.ArrowHelper(new THREE.Vector3(direction[0], direction[1], direction[2]), new THREE.Vector3( 0, 0, 0 ), self.cubeSize/2, arrowColor);
				arrow.position.set	(
										-(direction[0]*self.cubeSize/4),
										-(direction[1]*self.cubeSize/4),
										-(direction[2]*self.cubeSize/4)
									);
				arrow.opacity = 0.1;
				group.add(arrow);
				arrowArray[1] = arrow;
			}
			arrowS.push(arrowArray);
			group.arrowArray = arrowArray;
		}
		
		self.addAxis = function()
		{
			self.axis = new THREE.AxisHelper(500);
			self.axis.position.set(0, 0, 0);
			self.scene.add(self.axis);
		}
		
		self.addGroup = function()
		{
			self.groupRoot = new THREE.Object3D();
			self.scene.add(self.groupRoot);
		}
		
		self.addRender = function()
		{
			self.renderer = new THREE.CanvasRenderer();
			self.renderer.setSize(self.windowWidth, self.windowHeight);
			self.renderer.sortObjects = false;
			self.container.appendChild(self.renderer.domElement);
		}
		
		self.addStats = function()
		{
			self.stats = new Stats();
			self.stats.domElement.style.position = 'absolute';
			self.stats.domElement.style.top = '0px';
			self.stats.domElement.style.zIndex = 100;
			self.container.appendChild(self.stats.domElement);
		}
		
		self.addEvents = function()
		{
			window.addEventListener('resize', self.onWindowResize, false);
			document.addEventListener('mousemove', self.onDocumentMouseMove, false);
		}
		
		self.addContainer = function()
		{
			self.container = document.createElement('div');
			self.container.style = '-moz-user-select: none;-webkit-user-select: none;';
			self.container.onselectstart = 'return false;'
			document.body.appendChild(self.container);
		}
		
		self.addCamera = function()
		{
			self.camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 1, 10000);
			self.camera.position.x = 200;
			self.camera.position.y = 200;
			self.camera.position.z = 100;
		}
		
		self.addBounds = function()
		{
			var sizeX;
			var sizeY;
			var sizeZ;
			
			var material = self.getMaterial(self.lookWireframe, 0.1);
			var geometry = new THREE.CubeGeometry(sizeX, sizeY, sizeZ);
			var mesh = new THREE.Mesh(geometry, material);
				
			mesh.position.x = sizeX/2;
			mesh.position.y = sizeY/2;
			mesh.position.z = sizeZ/2;
			
			mesh.matrixAutoUpdate = false;
			mesh.updateMatrix();
			self.groupRoot.add(mesh);
		}
		
		self.selectCube = function(index)
		{
			try
			{
				if (index < 0) index = 0;
				if (index > (groupS.length - 1)) index = groupS.length - 1;
				self.selected = groupS[index];
				self.selectedIndex = index;
				var arrow;
				for (var i = 0; i < arrowS.length - 1; i++)
				{
					arrow = arrowS[i];
					if (arrow[1] != null)
					{
						arrow[1].setColor('0xffffff');
					}
				}
				arrow = arrowS[index];
				if (arrow[1] != null)
				{
					arrow[1].setColor('0xff0000');
				}
			}
			catch(err)
			{
				txt = "Error in selectCube.\n\n";
				txt += "Error description: " + err.message + "\n\n";
				alert(txt);
			}
		}
		
		self.selectNext = function()
		{
			var index = self.selectedIndex + 1;
			self.selectCube(index);
		}
		
		self.selectPrevious = function()
		{
			var index = self.selectedIndex - 1;
			self.selectCube(index);
		}
		
		self.loadStage = function()
		{
			self.addContainer();
			
			self.addCamera();
			
			self.scene = new THREE.Scene();
			
			self.addAxis();
			self.addGroup();
			self.addRender();
			self.addStats();
			self.addEvents();
			self.addBounds();
			
			self.initMaterials();
			
			self.controls = null;
			self.controls = new THREE.OrbitControls( self.camera );
			if (self.controls != null)
			{
				self.controls.addEventListener('change', self.render );
			}
		}
		
		self.free = function()
		{
			window.removeEventListener('resize', self.onWindowResize, false);
			document.removeEventListener('mousemove', self.onDocumentMouseMove, false);
			self.controls.removeEventListener('change', self.render);
			var group;
			for (var i = 0; i < groupS.length; i++)
			{
				group = groupS[i];
				self.scene.remove(group);
				//self.scene.deallocateObject(group);
			}
			
			self.scene.remove(self.axis);
			//self.scene.deallocateObject(self.axis);
			
			groupS.length = 0;
			cubeMeshS.length = 0;
			arrowS.length = 0;
			self.callMeMaybe = null;
			self.selected = null;
			self.container.removeChild(self.stats.domElement);
			//self.container.parent.remove(self.container);
			//self.container.appendChild(self.stats.domElement);
			self.container.innerHTML = '';
			
			matirialDone = null;
			matirialActive = null;
			matirialOut = null;
			matirialBetween = null;
		}
		
		try
		{
			self.init();
			self.loadStage();
			self.animate();
		}
		catch(err)
		{
			txt="Error in Stage3D.\n\n";
			txt+="Error description: " + err.message + "\n\n";
			l.print("Error", txt);
		}
		return self;
	}
	
	