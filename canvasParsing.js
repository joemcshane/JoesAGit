var View = function(name, height, width, visible, windowName, formJSON) {

  this.name = name; 
  this.height = height;
  this.width = width;
  this.visible = visible;
  this.windowName = windowName
  this.items = new Items(formJSON, name);


return { Name : this.name
       , Height : this.height
	   , Width : this.width
	   , Visible : this.visible 
	   , Window : this.windowName 
	   , Items : this.items}
	
}

var FormWindow = function FormWindow(name, title, xLocation, yLocation, width, height, allViews, allViewNames) {
	
	this.name = name;
	this.title = title;
	this.xLocation = xLocation;
	this.yLocation = yLocation;
	this.width = width;
	this.height = height;
	this.views = [];
	
	for(var k=0; k < allViews.length; k++){
		
		if (allViews[allViewNames[k]].Window == name) {
			this.views.push(allViewNames[k]);
		}
	}
	
	return { Name : this.name
		   , Title : this.title
	       , XLocation : this.xLocation
		   , YLocation : this.yLocation
		   , Width : this.width
		   , Height : this.height
		   , Views : this.views}
}

var DisplayItem = function DisplayItem(
		 name
		,dataSet
		,rowsDisplayed
		,enabled
		,itemType
		,justification
		,keyboardNavigable
		,required
		,formatMask
		,numberofItemsDisplayed
		,columnName
		,queryOnly
		,queryAllowed
		,updateAllowed
		,insertAllowed
		,database
		,visible
		,canvas
		,xPosition
		,yPosition
		,width
		,height
		,fontStyle
		,promptText
		,promptAttachmentEdge
		,summaryFunction
		,summarizedBlock
		,summarizedItem
		,label
		,icon
		,labelAttachmentEdge
		,labelOffset) {

	return {Name : name,
			DataSet : dataSet,
			RowsDisplayed : rowsDisplayed,
			Enabled : enabled,
			ItemType : itemType,
			Justification : justification,
			KeyboardNavigable : keyboardNavigable,
			Required : required,
			FormatMask : formatMask,
			NumberofItemsDisplayed : numberofItemsDisplayed,
			ColumnName : columnName,
			QueryOnly : queryOnly,
			QueryAllowed : queryAllowed,
			UpdateAllowed : updateAllowed,
			InsertAllowed : insertAllowed,
			Database : database,
			Visible : visible,
			Canvas : canvas,
			XPosition : xPosition,
			YPosition : yPosition,
			Width : width,
			Height : height,
			FontStyle : fontStyle,
			Prompt : promptText,
			PromptAttachmentEdge : promptAttachmentEdge,
			SummaryFunction : summaryFunction,
			SummarizedBlock : summarizedBlock,
			SummarizedItem : summarizedItem,
			Label : label,
			Icon : icon,
			LabelAttachmentEdge: labelAttachmentEdge,
			LabelOffset: labelOffset};
}

var Items = function Items(formJSON, canvasName) {
	
	this.items = new Array(100);
	
	this.rawDataSets = formJSON.Blocks;
	var x = 0, i = 0 , j = 0;
	
	for (i=0; i < rawDataSets.length; i++) {
	  	  
	  for (j=0; j < rawDataSets[i]["Items"].length; j++) {
	  
	    if (rawDataSets[i].Items[j]["Canvas"] == canvasName) {
			this.items[x++] = 
			     new DisplayItem( rawDataSets[i].Items[j]["Name"]
				                , rawDataSets[i].Name
				                , rawDataSets[i]["Number of Records Displayed"]
				                , rawDataSets[i].Items[j]["Enabled"] == "Yes"
								, rawDataSets[i].Items[j]["Item Type"]
								, rawDataSets[i].Items[j]["Justification"]
								, rawDataSets[i].Items[j]["Keyboard Navigable"] == "Yes"
								, rawDataSets[i].Items[j]["Required"] == "Yes"
								, rawDataSets[i].Items[j]["Format Mask"]
								, rawDataSets[i].Items[j]["Number of Items Displayed"]
								, rawDataSets[i].Items[j]["Column Name"]
								, rawDataSets[i].Items[j]["Query Only"] == "Yes"
								, rawDataSets[i].Items[j]["Query Allowed"] == "Yes"
								, rawDataSets[i].Items[j]["Update Allowed"] == "Yes"
								, rawDataSets[i].Items[j]["Insert Allowed"] == "Yes"
								, rawDataSets[i].Items[j]["Database Item"] == "Yes"
								, rawDataSets[i].Items[j]["Visible"] == "Yes"
								, rawDataSets[i].Items[j]["Canvas"] 
								, rawDataSets[i].Items[j]["X Position"] 
								, rawDataSets[i].Items[j]["Y Position"] 
								, rawDataSets[i].Items[j]["Width"] 
								, rawDataSets[i].Items[j]["Height"] 
								, rawDataSets[i].Items[j]["Font Style"] 
								, rawDataSets[i].Items[j]["Prompt"] 
								, rawDataSets[i].Items[j]["Prompt Attachment Edge"] 
								, rawDataSets[i].Items[j]["Summary Function"] 
								, rawDataSets[i].Items[j]["Summarized Block"] 
								, rawDataSets[i].Items[j]["Summarized Item"] 
								, rawDataSets[i].Items[j]["Label"] 
						        , rawDataSets[i].Items[j]["Iconic"] == "Yes" ? rawDataSets[i].Items[j]["Icon Filename"] : ""
						        , rawDataSets[i].Items[j]["Prompt Attachment Edge"]
						        , rawDataSets[i].Items[j]["Prompt Attachment Offset"]
								);
		}
	  }
	}	  
	trimmedItems = new Array(x);
	for (i=0; i < x; i++) {
	  trimmedItems[i] = this.items[i];
	}
	
	return trimmedItems;
}


var viewDetails = function viewDetails(formJSON) {

   this.rawViews = formJSON.Canvases;
   this.rawWindows = formJSON.Windows
   
   this.viewNames = new Array(rawViews.length);
   this.views = new Array(rawViews.length);
   this.windowNames = new Array(rawWindows.length);
   this.windows = new Array(rawWindows.length);
   
   for (var i=0; i < viewNames.length; i++) {
      viewNames[i] = rawViews[i].Name;
	  views[viewNames[i]] = 
	        new View(rawViews[i]["Name"],
			         rawViews[i]["Height"],
					 rawViews[i]["Width"],
					 rawViews[i]["Visible"],
					 rawViews[i]["Window"],
					 formJSON)
	}
	
	for (var j=0; j < windowNames.length; j++){
		windowNames[j] = rawWindows[j].Name;
		windows[windowNames[j]] = 
				new FormWindow ( rawWindows[j]["Name"]
							   , rawWindows[j]["Title"]
							   , rawWindows[j]["X Position"]
							   , rawWindows[j]["Y Position"]
							   , rawWindows[j]["Width"]
							   , rawWindows[j]["Height"]
							   , views
							   , viewNames);
	}
		
	return { viewNames : viewNames
	       , views : views
		   , windows : windows
		   };
	  
   }
