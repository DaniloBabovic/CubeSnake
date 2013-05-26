//globals
	
	//loger
	var l;
	var silentError = false;
	var logOrAlertError = true;
	//JS Error display
	function errorEvent(message)
	{
	    if (silentError) return;
	    if (logOrAlertError == true)
	    {
			l.print("Error", message, '#FF0000');
	    }
	    else
	    {
			alert(message);
	    }
	}
	
	//JS Logger
	var Logger = function ()
	{
	    // usage:
	    // l.print('main', 'test1');
	    var self = {};
	    try
	    {
			self.logerOn = true;
			self.printTime = false;
			
			self.loggerWidth = 300;
			self.loggerTop = 20;
			self.loggerRight = true;
			
			self.clear = function()
			{
				self.div.innerHTML = '';
				self.init();
			}
			
			self.header = function()
			{
				try
				{
					self.y = self.loggerTop;
					self.width = self.loggerWidth - 20 +"px";
					if (self.loggerRight == true)
					{
						self.x = window.innerWidth - self.loggerWidth;
					}
					else
					{
						self.x = 10;
					}
					self.height = window.innerHeight - self.y - 10 + "px";
					
					self.divHeader = document.createElement('div');
					self.divHeader.style.overflow = "auto";
					self.divHeader.style.position = 'absolute';
					self.divHeader.style.left = self.x + 'px';
					self.divHeader.style.top = self.y + 'px';
					self.divHeader.style.width = self.width;
					self.divHeader.style.height = 27 + 'px';			
					self.divHeader.style.backgroundColor = '#222222';
					self.divHeader.style.margin = "0px";
					self.divHeader.style.border = "0px";
					self.divHeader.style.padding = "0px";
					
					document.body.appendChild(self.divHeader);
					
					self.html =
					'<span style="color: #777777; margin: 5px">Logger</span>' + 
					'<button id="btnClearLoger" style="float: right; color: #FFFFFF; background-color:#111111;" onclick="l.clear()">' +
						'Clear' +
					'</button>';
				
					var newParagraph = document.createElement('span');
					newParagraph.id = 'htmlLogerHeader';
					newParagraph.innerHTML = self.html;
					self.divHeader.appendChild(newParagraph);
				}
				catch(err)
				{
					txt="Error in Logger.header\n";
					txt+="Error description: " + err.message + "\n";
					alert(txt);
				}
			}
			
			self.init = function()
			{
				self.header();
				self.y = self.loggerTop + 30;
				self.width = self.loggerWidth - 20 +"px";
				if (self.loggerRight == true)
				{
					self.x = window.innerWidth - self.loggerWidth;
				}
				else
				{
					self.x = 10;
				}
				self.height = window.innerHeight - self.y - 10 + "px";
				
				self.div = document.createElement('div');
				self.div.style.overflow = "auto";
				self.div.style.position = 'absolute';
				self.div.style.left = self.x + 'px';
				self.div.style.top = self.y + 'px';
				self.div.style.width = self.width;
				self.div.style.height = self.height;			
				self.div.style.backgroundColor = '#111111';
				self.divHeader.style.margin = "0px";
				self.divHeader.style.border = "0px";
				self.divHeader.style.padding = "0px";
				//self.div.style.backgroundColor = 'transparent';
				document.body.appendChild(self.div);

				self.topParagraph = document.createElement('p');
				self.topParagraph.textContent = " ";
				self.topParagraph.style="margin:0;font-size:10pt;line-height:10pt";
				self.div.appendChild(self.topParagraph);
				var newParagraph = document.createElement('span');
				newParagraph.innerHTML = '<span style="font-size:10pt; color:white; font-family: tahoma;">Logger: on<span></br>';
				self.div.insertBefore(newParagraph, self.topParagraph);
				self.topParagraph = newParagraph;
				
			}
			//append message
			self.print = function(funName, message, color)
			{
				if (self.logerOn == false)
				{
					return;
				}
				try
				{
					if(typeof color == "undefined")
					{
						color = "#FFFFFF";
					}
					if(typeof message == "undefined")
					{
						message = "";
					}
					if(typeof funName == "undefined")
					{
						funName = "";
					}
					var currentdate = new Date(); 
					var time = currentdate.getHours() + ":"  
					+ currentdate.getMinutes() + ":" 
					+ currentdate.getSeconds() + "."
					+ currentdate.getMilliseconds();
					
					var newParagraph = document.createElement('span');
					newParagraph.style = "font-size:8pt;";
					if (self.printTime == true)
					{
						newParagraph.innerHTML = '<span style="font-size:10pt; color:' + color + '; font-family: tahoma;">'
						+ time + " " + funName + " " + message + "<span></br>";
					}
					else
					{
						newParagraph.innerHTML = '<span style="font-size:10pt; color:' + color + '; font-family: tahoma;">'
						+ funName + " " + message + "<span></br>";
					}
					
					self.div.insertBefore(newParagraph, self.topParagraph);
					self.topParagraph = newParagraph;
				}
				catch(err)
				{
					txt = "Error in Logger.print\n";
					txt += "Error description: " + err.message;
					errorEvent(txt);
				}
			}
			
			//overwrite top message
			self.overwrite = function(funName, message, color)
			{
				if (self.logerOn == false)
				{
					return;
				}
				try
				{
					if(typeof color == "undefined")
					{
						color = "#FFFFFF";
					}
					if(typeof message == "undefined")
					{
						message = "";
					}
					if(typeof funName == "undefined")
					{
						funName = "";
					}
					var currentdate = new Date(); 
					var time = currentdate.getHours() + ":"  
						+ currentdate.getMinutes() + ":" 
						+ currentdate.getSeconds() + "."
						+ currentdate.getMilliseconds();
				
					if (self.printTime == true)
					{
						self.topParagraph.innerHTML = '<span style="font-size:10pt; ' + color + ':white; font-family: tahoma;">'
						+ time + " " + funName + " " + message + "<span></br>";
					}
					else
					{
						self.topParagraph.innerHTML = '<span style="font-size:10pt; color:' + color + '; font-family: tahoma;">'
						+ funName + " " + message + "<span></br>";
					}
				}
				catch(err)
				{
					txt="Error in Logger.overwrite\n";
					txt+="Error description: " + err.message + "\n";
					errorEvent(txt);
				}
			}
	    }
	    catch(err)
	    {
			txt="Error in Logger.\n\n";
			txt+="Error description: " + err.message + "\n\n";
			errorEvent(txt);
	    }		
	    return self;
	}
	
	
	
	