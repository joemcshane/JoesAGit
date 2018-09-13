var mapForm = function mapForm(formText) {
	
	
	
	this.formLines = formText.split("\n");
	this.levels = new Array(formLines.length);
	this.groups = new Array(formLines.length);
	this.dividers = new Array(formLines.length);
	this.keys = new Array(formLines.length);
	this.values = new Array(formLines.length);
	this.brackets = new Array(formLines.length);
	this.bracketIds = new Array(formLines.length);
	
	
	var TRIGGERKEY = "Trigger Text";
	var PROGRAMUNITKEY = "Program Unit Text";
	var DIVIDER =  "--------";

	var parseLine = function parseLine(lineText){
	  
	  
	    this.key = ''
		this.itemValue = '';
		if (lineText.match(/^\s+/)) {
			this.level = lineText.match(/^\s+/)[0].length;
		} else {
			this.level = -1;
		}
		
		//get the key and value
		var keyAndValue = lineText.trim().substring(2); //skip the first two padding characters
		var endOfKey = keyAndValue.search("   ");
		if (endOfKey == -1) {
		  this.key = keyAndValue;  // there is no value
		  this.itemValue = '';
		}
		else {
		  this.key = keyAndValue.substring(0,endOfKey);
  		  this.itemValue = keyAndValue.substring(endOfKey).trim();
		}
		
		return { level : level 
		       , key : key
		, value : itemValue };
		

	};
	
	var parseCode = function codeText(codeStart) {
	  
	  	var PROGRAMUNITEND = "Program Unit Type";
		var TRIGGEREND = "Fire in Enter-Query Mode";	

 	    this.key = formLines[codeStart].trim().substring(2);
		this.itemValue = '';
		this.codeLength = 0

        if (formLines[codeStart].match(/^\s+/)) {
			this.level = formLines[codeStart].match(/^\s+/)[0].length;
		} else {
			this.level = -1;
		}

		
	    var i = codeStart;
		
        i++;
        while ( formLines[i].search("Fire in Enter-Query Mode") == -1  && formLines[i].search("Program Unit Type") == -1 )
        {
          itemValue +=  formLines[i++].replace(/\t/g, '  ');
		  codeLength++;
        }
		return 	{ level : this.level
				, key : this.key
				, value : this.itemValue
				, codeLength : this.codeLength};
	  };	
	
	var inJSON = function inJSON(){
		
		var JSONform = '';
		var startChar = '{';
		for (i=0; i < formLines.length; i++) {
			
			if (keys[i]) { // ignore undefined.. that is code
				if (brackets[i]) {
					switch (brackets[i]) {
						case "Open" :
							JSONform += '{';
							startChar = '';
							break;
						case "Open Array" :
							JSONform += '[{';
							startChar = '';
							break;
						case "Array" :
							JSONform += '},{';
							startChar = '';
							break;
						case "Close Array" :
							JSONform += '}]';
							startChar = ',';
							break;
						case "Close" :
							JSONform += '}';
							startChar = ',';							
							break;
					}
				} else if ((brackets[i+1]) && (brackets[i+1] == "Open" || brackets[i+1] == "Open Array")) {
					JSONform += startChar + '"' + keys[i] + '":' ;
					startChar = ',';
				} else {
					JSONform += startChar + '"' + keys[i] + '":"' + values[i] + '"';
					startChar = ',';
				}
							
			}
			
		}
	JSONform += '}';
		
		return JSONform;
		
	};
	
	// Parse all of the lines (special parsing for triggers)
	for (i=0; i< formLines.length; i++){
		var line = "";
		if (formLines[i].search(TRIGGERKEY) > 0  || formLines[i].search(PROGRAMUNITKEY) > 0) {
			line = parseCode(i);
			this.keys[i] = line.key;
			this.values[i] = line.value;
			this.levels[i] = line.level;
			
			var miniJSON = '{"' + keys[i] + '":"' + values[i] + '"}';
			var testJSON = JSON.parse(miniJSON);
			
			i += line.codeLength;  // move the index on by the number of lines of the trigger..
		} else {
			line = parseLine(formLines[i]);
			this.keys[i] = line.key;
			this.values[i] = line.value;
			this.levels[i] = line.level;
		}
	}
	
	// Set open and closing flags
	var maxGroupId = 0
	  , currentGroupId = 0
	  , currentGroupName = "Form";
	var groupStack = [0];
	var groupStackName = [currentGroupName];

	for (i=0; i < formLines.length; i++){

	
		if ( keys[i] == DIVIDER ) {
			if (levels[i-1] < levels[i]) {
				brackets[i] = "Open";
				maxGroupId++;
				bracketIds[i] = maxGroupId;
				groupStack.push(maxGroupId);
				currentGroupId = maxGroupId;
				
				currentGroupName = keys[i-1];
				groupStackName.push(keys[i-1]);
				groups[i] = currentGroupName;
				
			} else if (((levels[i-1] >= levels[i]) && (levels[i+1] < levels[i])) || (!formLines[i+1])) {
				brackets[i] = "Close";
				currentGroupId = groupStack.pop();
				bracketIds[i] = currentGroupId;
				currentGroupId = groupStack[groupStack.length-1];

				currentGroupName = groupStackName.pop();
				groups[i] = currentGroupName;
				currentGroupName = groupStackName[groupStackName.length-1];
				
			} else {
				brackets[i] = "Array";
				bracketIds[i] = currentGroupId;
				groups[i] = currentGroupName;
				}
		} else {
			bracketIds[i] =  currentGroupId;
   		    groups[i] = currentGroupName;

		}
	}	
	
	
	//Set array starts and ends
	for (i=0; i < formLines.length; i++) {
		
		if (brackets[i] == "Array") {
			
			// find the start 
			var thisBracketId = bracketIds[i]; 
			for (j=0; j < formLines.length; j++) {
				if ((bracketIds[j] == bracketIds[i]) && brackets[j] == "Open") {
					brackets[j] = "Open Array";
				}
				if ((bracketIds[j] == bracketIds[i]) && brackets[j] == "Close") {
					brackets[j] = "Close Array";
				}
			}
		}
	}
	

	return  { inJSON : inJSON
            , formLines : formLines
            , keys : keys
            , values : values
            , levels : levels 
			, groups : groups
			, dividers : dividers
			, brackets : brackets
			};
			
}