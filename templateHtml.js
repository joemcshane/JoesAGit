var newLine = "\n";


var ItemHtml = function ItemHtml(canvasItem){

  var htmlString = "<div>" + newLine;
  var lowerName = canvasItem.Name.toLowerCase().trim()
  
  if (canvasItem.ItemType == "Text Item"){
	
	if (canvasItem.Prompt){
		htmlString += '<label id="' + lowerName + 'Label" for="' + lowerName + '">' + canvasItem.Prompt + '</label>';
	}
	
	htmlString += '<input [disabled]="!recordExists( i )"  id="' + lowerName + '" name="' + canvasItem.Name + '"';
	if (!canvasItem.Database || canvasItem.QueryOnly) {
		htmlString += ' [ngModel]="currentRow.' + canvasItem.Name + '">' + newLine;
    } else {
		htmlString += ' [(ngModel)]="currentRow.' + canvasItem.Name + '">' + newLine;
	}
  } 
  else if (canvasItem.ItemType == "Push Button"){
	htmlString += '<button  id="' + lowerName + '" name="' + canvasItem.Name + '" ';
	
	if (canvasItem.Icon) {
		htmlString += 'type="image" src="../../assets/' + canvasItem.Icon + '"></button>';
	} else {
		htmlString += '>' +canvasItem.Label + '</button>';
	}
  }
  
  htmlString += "</div>" + newLine;
  

  
  return htmlString;
  
}

var ItemCSS = function ItemCSS(canvasItem, displayedRows){
	
	var cssString = "";
	var idOrClass = "#";
	var isTable = ((displayedRows > 1)&&(canvasItem.NumberofItemsDisplayed != 1));
	if (isTable) {
		idOrClass=".";
	}
	var calcdHeight = parseInt(canvasItem.Height);
	if ( canvasItem.ItemType == "Text Item"){
		calcdHeight -= 4;
	} 
	
	var calcdWidth = parseInt(canvasItem.Width) -4;
	cssString += idOrClass + canvasItem.Name.toLowerCase() + "{ "+ newLine;
	cssString += "   width: " + calcdWidth + "px;" + newLine;
	cssString += "   height: " + calcdHeight + "px;" + newLine;
	cssString += "   padding: 0;" + newLine
	//cssString += "   font-size: 8px;" + newLine

// if this is a single item then place it exactly otherwise do not set the absolute position or top.
	if ((! isTable)|| (parseInt(canvasItem.NumberofItemsDisplayed) == 1)) {
		cssString += "   top: " + canvasItem.YPosition + "px;" + newLine;
		cssString += "   left: " + canvasItem.XPosition + "px;" + newLine;
		cssString += "   position: absolute;"+ newLine;
	}
	cssString += "}"+ newLine;

/* if this is a table item then place its header exactly.
	if (isTable) {
		
		cssString += '#' + canvasItem.Name.toLowerCase() + 'Header {';
		cssString += "   width: " + canvasItem.Width + "px;" + newLine;
		cssString += "   height: " + canvasItem.Height + "px;" + newLine;
		cssString += "   left: " + canvasItem.XPosition + "px;" + newLine;
		cssString += "   top: " + canvasItem.YPosition + "px;" + newLine;
		cssString += "   position: absolute;"+ newLine;
		cssString += "}"+ newLine;
	}
*/
// If this is an item with a label then set teh label before the item
	if ((canvasItem.Prompt != undefined)&&(canvasItem.Prompt != "")&&(canvasItem.LabelAttachEdge = "Start")&&(! isTable)) {
		
		var labelWidth = canvasItem.Prompt.length * 6.5;
		var labelXPosition = parseInt(canvasItem.XPosition) - labelWidth;
		
		cssString += "#" + canvasItem.Name.toLowerCase() + "Label { "+ newLine;
		cssString += "   width: " + labelWidth + "px;" + newLine;
		cssString += "   height: " + canvasItem.Height + "px;" + newLine;
		cssString += "   left: " + labelXPosition + "px;" + newLine;
		cssString += "   padding: 0;" + newLine
		cssString += "   top: " + canvasItem.YPosition + "px;" + newLine;
		cssString += "   position: absolute;"+ newLine;
		cssString += "   text-align: right;"+ newLine;
		cssString += "   padding-top: 2px;"+ newLine;
		cssString += "}"+ newLine;
	}
	
	return cssString;
}


var TableHtml = function TableHtml(canvasItems, rowCount, blockName){

//Build table for multi row items
  //Tables to have the following format
  var newLine = '\n'
    , tableHtmlHeader = "<thead><tr>"
	, tableHtmlBody = ""
	, summaryColumnsHtml = ""
	, summaryColumnsCSS = "";
  var HeaderHtml = [];
  var ColumnHtml = [];
  var XPositionOrdered = [];
  var XPosition = [];
  var rowCountArray = "[ 0";
  for (var m=1; m < rowCount; m++) {
	  rowCountArray += ',' + m;
  }
  rowCountArray += "]";
  
  var tableHtmlRepeat = '<tr *ngFor="let in of ' + rowCountArray + '; let i = index">' + newLine ;
  
  for (var n=0; n < canvasItems.length; n++) {
    
	var colIndex = -1;
	//TODO: displayed rows = 1?
	if (parseInt(canvasItems[n].NumberofItemsDisplayed) != 1) {
		colIndex++
		XPosition.push(parseInt(canvasItems[n].XPosition));
		XPositionOrdered.push(parseInt(canvasItems[n].XPosition));
		HeaderHtml.push('<th id="' + canvasItems[n].Name.toLowerCase() + 'Header" >' + canvasItems[n].Prompt + '</th>' + newLine);
		if (canvasItems[n].ItemType == "Text Item"){
			ColumnHtml.push('<td><input [disabled]="!recordExists( i )" class="'
							 + canvasItems[n].Name.toLowerCase() + '" name="' + canvasItems[n].Name.toLowerCase() + '_{{i}}" [(ngModel)]="getDisplayedRow(i).' 
							 + canvasItems[n].Name + '"></td>' + newLine);
		}
		else if (canvasItems[n].ItemType == "Push Button") {
			ColumnHtml.push('<td><button [disabled]="!recordExists( i )" class="'
					 + canvasItems[n].Name.toLowerCase() + '" name="' + canvasItems[n].Name.toLowerCase() + '_{{i}}" >' + canvasItems[n].Label + '</button></td>' + newLine);
		}
		else if (canvasItems[n].ItemType == "Display Item") {
			ColumnHtml.push('<td><div style="border: grey solid 1px" class="' + canvasItems[n].Name.toLowerCase() + '" id="' + canvasItems[n].Name.toLowerCase() + '_' + n + '" ></div></td>' + newLine);
		}
	} else {
		summaryColumnsHtml += ItemHtml(canvasItems[n]);
		summaryColumnsCSS += ItemCSS(canvasItems[n], 1);
	}
  }
  
  XPositionOrdered.sort(function(a, b){return a - b});
  
  for (var x=0; x < HeaderHtml.length; x++) {
	tableHtmlBody += ColumnHtml[XPosition.indexOf(XPositionOrdered[x])];
	tableHtmlHeader += HeaderHtml[XPosition.indexOf(XPositionOrdered[x])];
  }
  
  tableHtmlBody += '</tr></tbody>' + newLine;
  tableHtmlHeader += '</tr></thead>' + newLine;
  return '<table id="' + blockName + 'Table">' + newLine + tableHtmlHeader + tableHtmlRepeat + tableHtmlBody + newLine + '</table>' + newLine  + summaryColumnsHtml;
}

var TableCSS = function TableCSS(canvasItems, rowCount, blockName){

//Build table for multi row items
  //Tables to have the following format
  var newLine = '\n'
    , tableCSS = '#' + blockName + 'Table {';
	
	var minX = 9999999999, minY=9999999999;
  for (var n=0; n < canvasItems.length; n++) {
    if (parseInt(canvasItems[n]["XPosition"]) < minX) {
		minX = parseInt(canvasItems[n]["XPosition"]);
	}
	if (parseInt(canvasItems[n]["YPosition"]) < minY) {
		minY = parseInt(canvasItems[n]["YPosition"]);
	}
  }
  tableCSS +=  '  position: absolute;' + newLine;
  tableCSS +=  '  left: ' + minX + 'px;' + newLine;
  tableCSS +=  '  top: ' + (minY -21) + 'px;' + newLine;
  tableCSS +=  '}' + newLine;
  
  return tableCSS;
}

//TODO: Can we generate CSS for the views too? Not just the items.

var BlockViews = function(CanvasItems, BlockNames, Blocks) {

  var newLine = "\n";
  this.blockViews = new Array(BlockNames.length);
  this.cssMetadata = new Array(BlockNames.length + 1);
  
  for(var i=0; i < BlockNames.length; i++) {
	blockViews[BlockNames[i]] = '<form #' + BlockNames[i] + '="ngForm">' + newLine;
	cssMetadata[BlockNames[i]] = "";

	  // we need the diaplayed records count from the blockViews
	  if (Blocks[BlockNames[i]].DisplayedRows < 2) {
		for (var j=0; j < CanvasItems.length; j++){
			
			if (CanvasItems[j]["DataSet"] == BlockNames[i]) {
				blockViews[CanvasItems[j]["DataSet"]] += ItemHtml(CanvasItems[j]);
			}
		}
	  } else {
		var tableItems = [];
		for (var k=0; k < CanvasItems.length; k++){
			if (CanvasItems[k]["DataSet"] == BlockNames[i]) {
					tableItems.push(CanvasItems[k]);
			}
		}
		blockViews[BlockNames[i]] += TableHtml(tableItems, Blocks[BlockNames[i]].DisplayedRows, BlockNames[i]);
		cssMetadata[BlockNames[i]] += TableCSS(tableItems, Blocks[BlockNames[i]].DisplayedRows, BlockNames[i]);
	  }
	  
	blockViews[BlockNames[i]] += newLine + '</form>' + newLine;
	
		for (var k=0; k < CanvasItems.length; k++){
			if (CanvasItems[k]["DataSet"] == BlockNames[i]) {
				if (CanvasItems[k].Visible) {
					cssMetadata[CanvasItems[k]["DataSet"]] += ItemCSS(CanvasItems[k], Blocks[BlockNames[i]].DisplayedRows);
				}
			}
		}
		
		// Add standard CSS components
		cssMetadata["Common"] = "";
		cssMetadata["Common"] += ".tabButtonStrip {" + newLine;
		cssMetadata["Common"] += "  height: 25px;" + newLine;
		cssMetadata["Common"] += "  width: 100%;" + newLine;
		cssMetadata["Common"] += "  }" + newLine;
		cssMetadata["Common"] += ".tabButton {" + newLine;
		cssMetadata["Common"] += "  display: inline-block;" + newLine;
		cssMetadata["Common"] += "  padding-left: 10px;" + newLine;
		cssMetadata["Common"] += "  border-left: 2px solid darkgrey;" + newLine;
		cssMetadata["Common"] += "  border-top: 2px solid darkgrey;" + newLine;
		cssMetadata["Common"] += "  border-right: 2px solid darkgrey;" + newLine;
		cssMetadata["Common"] += "  background: lightgrey;" + newLine;
		cssMetadata["Common"] += "}" + newLine + newLine;
		cssMetadata["Common"] += "body {" + newLine;
		cssMetadata["Common"] += "  font-size: 13px;" + newLine;
		cssMetadata["Common"] += "  background: lightgrey;" + newLine;
		cssMetadata["Common"] += "}" + newLine;
		}
  
  
  
  return { blockViews : blockViews ,
           cssMetadata: cssMetadata};

}