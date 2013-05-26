	
	var AnimateRotationReverse = function(cube)
	{
		var self = {};
		self.cube = cube;
		self.framesMax = 42;
		self.framesCount = 0;
		self.currentAngle = 0;
		try
		{
			self.afterFun = function()
			{
				controls.positionChanged(self.cube, self.cube.index, false);	
			}
			
			self.getRadians = function()
			{
				var degree;
				if (self.cube.rotationCount == 3)
				{
					degree = -90;
				}
				else
				{
					degree = self.cube.rotationCount * 90;	
				}
				
				var radians = degree*Math.PI/180;
				return radians;
			}
			
			self.animateX = function()
			{
				self.framesCount++;
				var group = groupS[self.cube.index];
				var step = self.radians/self.framesMax;
				group.rotation.x -= step;
				if (self.framesCount > self.framesMax)
				{
					group.rotation.x = self.currentAngle - self.radians;
					stage3D.callMeMaybe = null;
					self.afterFun();
				}
			}
			
			self.animateZ = function()
			{
				self.framesCount++;
				var group = groupS[self.cube.index];
				var step = self.radians/self.framesMax;
				group.rotation.z -= step;
				if (self.framesCount > self.framesMax)
				{
					group.rotation.z = self.currentAngle - self.radians;
					stage3D.callMeMaybe = null;
					self.afterFun();
				}
			}
			
			self.radians = self.getRadians(self.cube.rotationCount);
			var group = groupS[self.cube.index];
			if (cube.rotateAroundX == true)
			{
				self.currentAngle = group.rotation.x;
				stage3D.callMeMaybe = self.animateX;
			}
			else
			{
				self.currentAngle = group.rotation.z;
				stage3D.callMeMaybe = self.animateZ;
			}
		}
	    catch(err)
	    {
		    txt="Error in AnimateRotationReverse.\n\n";
		    txt+="Error description: " + err.message + "\n\n";
		    errorEvent(txt);
	    }
	}
	
	var AnimateRotation = function(cube)
	{
		var self = {};
		self.cube = cube;
		
		self.framesMax = 42;
		self.framesCount = 0;
		
		try
		{
			self.afterFun = function()
			{
				controls.positionChanged(self.cube, self.cube.index, true);	
			}
			
			self.getRadians = function()
			{
				var degree;
				if (self.cube.rotationCount == 3)
				{
					degree = -90;
				}
				else
				{
					degree = self.cube.rotationCount * 90;	
				}
				
				var radians = degree*Math.PI/180;
				return radians;
			}
			
			self.animateX = function()
			{
				self.framesCount++;
				var group = groupS[self.cube.index];
				var step = self.radians/self.framesMax;
				group.rotation.x += step;
				if (self.framesCount > self.framesMax)
				{
					group.rotation.x = self.radians;
					stage3D.callMeMaybe = null;
					self.afterFun();
				}
			}
			
			self.animateZ = function()
			{
				self.framesCount++;
				var group = groupS[self.cube.index];
				var step = self.radians/self.framesMax;
				group.rotation.z += step;
				if (self.framesCount > self.framesMax)
				{
					group.rotation.z = self.radians;
					stage3D.callMeMaybe = null;
					self.afterFun();
				}
			}
			
			self.radians = self.getRadians(self.cube.rotationCount);
			if (cube.rotateAroundX == true)
			{
				stage3D.callMeMaybe = self.animateX;
			}
			else
			{
				stage3D.callMeMaybe = self.animateZ;
			}
		}
	    catch(err)
	    {
		    txt="Error in AnimateRotation.\n\n";
		    txt+="Error description: " + err.message + "\n\n";
		    errorEvent(txt);
	    }
		//l.print("Error in AnimateRotation", "direction problem.");
		return self;
	}
	
	
	
	
	