
var appStructure = function appStructure(rawJSON) {

  this.appCSS = "";
  this.appHtml = "";

  // window
  for (var i=0; i < rawJSON.Windows.length; i++) {
	  if (rawJSON.Windows[i].Name != rawJSON["Console Window"]) {
			appHtml += '<div id="' + rawJSON.Windows[i].Name + '" *ngIf="' + rawJSON.Windows[i].Name + 'Active">';
	  } else {
			appHtml += '<div id="' + rawJSON.Windows[i].Name + '">';
	  }
    //canvas
	for (var j=0; j < rawJSON.Canvases.length; j++) {
		if (rawJSON.Canvases[j].Window == rawJSON.Windows[i].Name) {
			var canvasName = rawJSON.Canvases[j].Name;
			appHtml += '<div id="' + canvasName + 'View">';
			
			// Stacked Canvas
			if (rawJSON.Canvases[j]["Canvas Type"] != "Tab") {
				for (var k=0; k < rawJSON.Blocks.length; k++) {
					for (var m=0; m < rawJSON.Blocks[k].Items.length; m++) {
						if (rawJSON.Blocks[k].Items[m].Canvas == canvasName){
							appHtml += '<app-' + rawJSON.Blocks[k].Name.toLowerCase().replace(/_/g,'-') + '></app-' + rawJSON.Blocks[k].Name.toLowerCase().replace(/_/g,'-')  + '>';
							break;
						}
					}
				}
			} else {
			// Tabbed Canvas
				var tabButtons = '<div class="tabButtonStrip">';
				var tabBlocks = "";
				for (var n=0; n < rawJSON.Canvases[j]["Tab Pages"].length; n++) {
					var tabName = rawJSON.Canvases[j]["Tab Pages"][n]["Name"];
					tabButtons += '<div class="tabButton" (click)="set' + canvasName + 'Tab(\'' + tabName + 'Tab\')">' + rawJSON.Canvases[j]["Tab Pages"][n]["Label"] + '</div>';

					tabBlocks += '<div *ngIf="isActive' + canvasName + 'Tab(\'' + tabName + 'Tab\')" id="' + tabName + 'Tab">';
					for (var k=0; k < rawJSON.Blocks.length; k++) {
						for (var m=0; m < rawJSON.Blocks[k].Items.length; m++) {
							if ((rawJSON.Blocks[k].Items[m].Canvas == canvasName)&&(rawJSON.Blocks[k].Items[m]["Tab Page"] == tabName)){
								tabBlocks += '<app-' + rawJSON.Blocks[k].Name.toLowerCase().replace(/_/g,'-') + '></app-' + rawJSON.Blocks[k].Name.toLowerCase().replace(/_/g,'-') + '>';
								break;
							}
						}
					}
					tabBlocks += '</div>';
				}
				tabButtons += '</div>';
				appHtml += tabButtons + tabBlocks;
			}
			appHtml += '</div>';
		}
	}
	appHtml += '</div>';
  }
  

  for (var j=0 ; j < rawJSON.Windows.length; j++) {
	  appCSS += "#" + rawJSON.Windows[j].Name + "{" + newLine;
	  appCSS += "  left:" + rawJSON.Windows[j]["X Position"] + "px;" + newLine;
	  appCSS += "  top:" + rawJSON.Windows[j]["Y Position"] + "px;" + newLine;
	  appCSS += "  width:" + rawJSON.Windows[j]["Width"] + "px;" + newLine;
	  appCSS += "  height:" + rawJSON.Windows[j]["Height"] + "px;" + newLine;
	  appCSS += "  position: relative;" + newLine;
	  appCSS += "}" + newLine + newLine;
	  }
	  
	  var toolbarHeight = 0;

  for (var j=0 ; j < rawJSON.Canvases.length; j++) {
	  if (rawJSON.Canvases[j].Name == "TOOLBAR") {
		  appCSS += "#" + rawJSON.Canvases[j].Name + "View {" + newLine;
		  appCSS += "  left: 0;" + newLine;
		  appCSS += "  top: 0;" + newLine;
		  appCSS += "  width: 100%;" + newLine;
		  appCSS += "  height:" + rawJSON.Canvases[j]["Height"] + "px;" + newLine;
		  appCSS += "  position: absolute;" + newLine;
		  appCSS += "}" + newLine + newLine;
		 // toolbarHeight = parseInt(rawJSON.Canvases[j]["Height"]);
	  } else if (rawJSON.Canvases[j]["Canvas Type"] == "Tab") {
		  var topDrop = parseInt(rawJSON.Canvases[j]["Viewport Y Position"]) + toolbarHeight;
		  appCSS += "#" + rawJSON.Canvases[j].Name + "View {" + newLine;
		  appCSS += "  left:" + rawJSON.Canvases[j]["Viewport X Position"] + "px;" + newLine;
		  appCSS += "  top:" + topDrop + "px;" + newLine;
		  appCSS += "  width:" + rawJSON.Canvases[j]["Viewport Width"] + "px;" + newLine;
		  appCSS += "  height:" + rawJSON.Canvases[j]["Viewport Height"] + "px;" + newLine;
		  appCSS += "  position: absolute;" + newLine;
		  appCSS += "}" + newLine + newLine;	  } else
	    {
		  var topDrop = parseInt(rawJSON.Canvases[j]["Viewport Y Position on Canvas"]) + toolbarHeight;
		  appCSS += "#" + rawJSON.Canvases[j].Name + "View {" + newLine;
		  appCSS += "  left:" + rawJSON.Canvases[j]["Viewport X Position on Canvas"] + "px;" + newLine;
		  appCSS += "  top:" + topDrop + "px;" + newLine;
		  appCSS += "  width:" + rawJSON.Canvases[j]["Width"] + "px;" + newLine;
		  appCSS += "  height:" + rawJSON.Canvases[j]["Height"] + "px;" + newLine;
		  appCSS += "  position: absolute;" + newLine;
		  appCSS += "}" + newLine + newLine;
	  }
  }
	  
  return { AppCSS : this.appCSS
         , AppHTML : this.appHtml}

}