/*
    <!-- Cube -->
    <script>
*/
	var findSolution;
	var firstCube;
	var solutionKeeper = [];
	var solutionMaxCount = 100;	
	var solutionCount;
	var tryCount = 0;
	var stopLoop = false;	
	
	// 3 x 3 default cube snake
	var cubeBoundX = 3;
	var cubeBoundY = 3;
	var cubeBoundZ = 3;
	/*
		var cubeBoundX = 4;
		var cubeBoundY = 3;
		var cubeBoundZ = 4;
	*/
	function vectorAdd(v1, v2)
	{
	    return [v1[0] + v2[0], v1[1] + v2[1], v1[2] + v2[2]];
	}
	
	function cloneVector(v)
	{
	    return v.slice(0);
	}
	
	function Same(v1, v2)
	{
	    if (v1[0] != v2[0]) return false;
	    if (v1[1] != v2[1]) return false;
	    if (v1[2] != v2[2]) return false;
	    return true;
	}
	
	function isZeroVector(vector)
	{
		if (vector[0] != 0) return false;
		if (vector[1] != 0) return false;
		if (vector[2] != 0) return false;
		return true;
	}
	
	function isNegativeDirection(v1, v2)
	{
		if (v1[0] != 0)
		{
			if (v1[0] == -v2[0])return true;
		}
		if (v1[1] != 0)
		{
			if (v1[1] == -v2[1]) return true;
		}
		if (v1[2] != 0)
		{
			if (v1[2] == -v2[2]) return true;
		}
		return false;
	}
	
	function rotateDirection(axis, direction)
	{
		if (Same(axis, direction) == true) return cloneVector(direction);
		if (isNegativeDirection(axis, direction) == true) return cloneVector(direction);
	    var resultX = 0;
	    var resultY = 0;
	    var resultZ = 0;
	    var result;
		
	    var x1 = axis[0];
	    var y1 = axis[1];
	    var z1 = axis[2];
	    
	    var x2 = direction[0];
	    var y2 = direction[1];
	    var z2 = direction[2];
	    
		function checkResult(axis, direction, result)
		{
			if (isZeroVector(result))
			{
				l.print("Eror in rotateDirection ", axis + " " + direction + " " + result);
			}
		}
		
	    if (z1 != 0)
	    {	
			resultY = z1 * x2;
			resultX = -z1 * y2;
			resultZ = 0;
			result = [resultX, resultY, resultZ];
			checkResult(axis, direction, result);
			return result;
	    }
	    
	    if (y1 != 0)
	    {
			resultZ = -y1*x2;
			resultX = y1*z2;
			
			resultY = 0;
			result = [resultX, resultY, resultZ];
			checkResult(axis, direction, result);
			return result;
	    }
	    
	    if (x1 != 0)
	    {
			resultZ = x1*y2;
			resultY = -x1*z2;
			resultX = 0;
			result = [resultX, resultY, resultZ];
			checkResult(axis, direction, result);
			return result;
	    }
	    var txt = "Error in rotateDirection. Axis is undefined." + axis + " direction " + direction;
	    errorEvent(txt);
	    return null;
	}
	
	function cloneSnake(cube)
	{
	    var index = cube.index;
	    var oldList = cube.cubeList;
	    var newList = [];
	    var oldCube;
	    var newCube;
	    for (var i = 0; i < oldList.length; i++)
	    {
			oldCube = oldList[i];
			newCube = new Cube(newList, cloneVector(oldCube.direction), oldCube.canRotate, oldCube.rotateAroundX);
			newCube.rotationCount = oldCube.rotationCount;
	    }
	    return newList[index];
	}
	
	function updateVector(destination, source)
	{
		destination[0] = source[0];
		destination[1] = source[1];
		destination[2] = source[2];
	}
	
	function collision(cube)
	{
	    var prevCube;
	    for (var i = 0; i < cube.index; i++)
	    {
			prevCube = cube.cubeList[i];
			if (Same(prevCube.position, cube.position))
			{
				//l.print("collision", collision);
				return true;
			}
	    }
	    return false;
	}
	
	function cubeInBound(cube)
	{
	    if (cube.position[0] > cubeBoundX) return false;
	    if (cube.position[1] > cubeBoundY) return false;
	    if (cube.position[2] > cubeBoundZ) return false;
		if (cube.position[0] < 1) return false;
	    if (cube.position[1] < 1) return false;
	    if (cube.position[2] < 1) return false;
	    return true;
	}
	
	var Cube = function(cubeList, direction, canRotate, rotateAroundX)
	{
	    var self = {};
		try
		{
			self.cubeList = cubeList;
			self.direction = direction;
			self.canRotate = canRotate;
			self.index = self.cubeList.length;
			self.child = null;
			self.rotationCount = 0;
			//for webGl only:
			self.rotateAroundX = rotateAroundX;
			
			if (cubeList.length == 0)
			{
				//first
				self.parent = null;
				self.position = [1, 1, 1];
			}
			else
			{
				self.parent = cubeList[cubeList.length - 1];
				self.position = vectorAdd(self.parent.position, self.parent.direction);
				self.parent.child = self;
			}
			
			self.parentRotation = function(axis)
			{
				/*
				if (self.index > 0)
				{
					l.print("parentRotation", self.index);
					l.print("axis ", "direction " + axis + " direction " + self.direction + " " + " position=" + self.position);
				}
				*/
				self.position = vectorAdd(self.parent.position, self.parent.direction);
				
				var newDirection = rotateDirection(axis, self.direction);
				/*
				if (self.index > 0)
				{
					l.print("self.position after, newDirection", self.position + " " + newDirection);
				}
				*/
				updateVector(self.direction, newDirection);			
				if (self.child != null)
				{
					self.child.parentRotation(axis);
				}
				
			}
			
			self.rotate = function()
			{
				/*
				if (self.index > 0)
				{
					l.print("rotate", self.index);
					l.print("self.parent.direction= ", self.parent.direction
							+ " direction " + self.direction + " "
							+ " position=" + self.position);
				}
				*/
				self.rotationCount++;
				var newDirection = rotateDirection(self.parent.direction, self.direction);
				/*
				if (self.index > 0)
				{
					l.print("self.position after, newDirection", self.position + " " + newDirection);
				}
				*/
				updateVector(self.direction, newDirection);
				if (self.child != null)
				{
					self.child.parentRotation(self.parent.direction);
				}
			}
			self.cubeList.push(self);
		}
	    catch(err)
	    {
		    txt="Error in Cube.\n\n";
		    txt+="Error description: " + err.message + "\n\n";
		    errorEvent(txt);
	    }
	    return self;
	}

	function report(cube, solutionIndex)
	{
		var c;
		var text;
		l.print("Solution ", solutionIndex);
		for (var i = 0; i < cube.cubeList.length; i++)
		{
			c = cube.cubeList[i];
			text = i + " pos=" + c.position + " dir=" + c.direction + " degree:" + c.rotationCount*90;
			l.print("", text);
		}
		l.print("", "");
	}
		
	var FindSolutions = function(lastRotatedCube)
	{
	    var self = {};
		
		tryCount++;
		if (stopLoop == true) return null;
		self.doNotRotate = function(cubeForRotation)
	    {
			var newCube = cloneSnake(cubeForRotation);
			var newSolution = new FindSolutions(newCube);
		}
		
	    self.rotate = function(cubeForRotation)
	    {
			if (cubeForRotation.child == null) return;
			for (var i = 0; i < 3; i++)
			{
				cubeForRotation.rotate();
				var cloneCube = cloneSnake(cubeForRotation);
				var newSolution = new FindSolutions(cloneCube);
			}
	    }
	    
	    var nextCube = null;
	    for (var i = lastRotatedCube.index + 1; i < lastRotatedCube.cubeList.length; i++)
	    {
			nextCube = lastRotatedCube.cubeList[i];
			if (cubeInBound(nextCube) == false)return null;
			if (collision(nextCube) == true)return null;
			if (nextCube.canRotate == true)
			{
				self.doNotRotate(nextCube);
				self.rotate(nextCube);
				return null;
			}
	    }
		
		if (nextCube == null)
		{
			l.print("Error findSolutions.nextCube == null", lastRotatedCube.index);
			return null;
		}
		
	    //last Cube
	    if (nextCube.index == (lastRotatedCube.cubeList.length -1))
	    {
			//found solution
			//l.print("found solution!!!", nextCube.cubeList);
			
			if (solutionKeeper.length > solutionMaxCount)
			{
				if (stopLoop == false)
				{
					stopLoop = true;
					l.print("Abort loop.", 'There is too many solutions.(More then ' + solutionMaxCount + ')', "#4444CC");
				}
				return null;
			}
			solutionKeeper.push(nextCube.cubeList);
			report(lastRotatedCube, solutionKeeper.length);
			return null;
	    }
	    var txt = "Unspecified error in FindSolutions.";
	    errorEvent(txt);
	    return null;
	}
	
	function createCubes(dimenzion, strCubes)
	{
		var canRotate;
		var direction_X = 0;
		var direction_Z = 2;
		var cubeS = [];
		
		cubeBoundX = dimenzion[0];
		cubeBoundY = dimenzion[1];
		cubeBoundZ = dimenzion[2];
	
		function charToBoolean(char)
		{
			if (char == "1")return true;
			else return false;
		}
		
		function insertCube(cubeS, previousDirection, rotatable)
		{
			var cube;
			var direction;
			if (rotatable == false)
			{
				direction = previousDirection;
				if (previousDirection == direction_X)
				{
					cube = new Cube(cubeS, [1, 0, 0], false, true);
				}
				else
				{
					cube = new Cube(cubeS, [0, 0, 1], false, false);
				}
				return direction;
			}
			else
			{
				if (previousDirection == direction_X)
				{
					direction = direction_Z;
					cube = new Cube(cubeS, [0, 0, 1], true, true);
				}
				else
				{
					direction = direction_X;
					cube = new Cube(cubeS, [1, 0, 0], true, false);
				}
				return direction;
			}
		}
		
		var char;
		var previousDirection = direction_Z;
		for (var i = 0; i < strCubes.length; i++)
		{
			var isRotatable = charToBoolean(strCubes[i]);
			previousDirection = insertCube(cubeS, previousDirection, isRotatable);
		}
		firstCube = cubeS[0];
	}
	
	function getSnakeCubeSolutionCount(dimension, cubeString)
	{
		createCubes(dimension, cubeString);
		var newCube = cloneSnake(firstCube);
		findSolution = new FindSolutions(newCube);
		return solutionKeeper.length;	
	}
	
	function freeSolutions()
	{
		var solution;
		for (var i = 0; i < solutionKeeper.length; i++)
		{
			solution = solutionKeeper[i];
			solution.length = 0;
		}
		solutionKeeper.length = 0;
	}
/*
    </script>
*/