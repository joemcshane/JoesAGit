var View = function(name, height, width, visible, formJSON) {

  this.name = name; 
  this.height = height;
  this.width = width;
  this.visible = visible;
  this.items = new Items(formJSON, name);


return { Name : name
       , Height : height
	   , Width : width
	   , Visible : visible 
	   , Items : this.items}
	
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
		,prompt
		,promptAttachmentEdge
		,summaryFunction
		,summarizedBlock
		,summarizedItem) {

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
			Prompt : prompt,
			PromptAttachmentEdge : promptAttachmentEdge,
			SummaryFunction : summaryFunction,
			SummarizedBlock : summarizedBlock,
			SummarizedItem : summarizedItem };
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
								, rawDataSets[i].Items[j]["Database"] == "Yes"
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

//TODO: Capture items
// Item type, canvas, height width font style, keyboard navigable, name, column name, prompt, justification, required, visible
// Add number of rows displayed

var viewDetails = function viewDetails(formJSON) {

   this.rawViews = formJSON.Canvases;
   
   this.viewNames = new Array(rawViews.length);
   this.views = new Array(rawViews.length);
   
   var i = 0 ;
   
   for (i=0; i < viewNames.length; i++) {
      viewNames[i] = rawViews[i].Name;
	  views[viewNames[i]] = 
	        new View(rawViews[i]["Name"],
			         rawViews[i]["Height"],
					 rawViews[i]["Width"],
					 rawViews[i]["Visible"],
					 formJSON)
	}
		
	return { viewNames : viewNames
	       , views : views
		   };
	  
   }
