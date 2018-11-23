var newLine = "\n";

var Componentise = function Componentise(tableName) {
	return tableName.toLowerCase().replace(/_/g,'-');
}
var ComponentClassName = function ComponentClassName(tableName) {
	
	var componentClassName = "";
	var nameParts = tableName.split('_');
	for (var j=0; j < nameParts.length; j++) {
		componentClassName += nameParts[j][0].toUpperCase() + nameParts[j].slice(1).toLowerCase();
	}
	
	return componentClassName + "Component";
}
  
var componentModel = function componentModel(tableName, componentName) {
	

  var className = tableName;

  var component = "import { Component, OnInit } from '@angular\/core';" + newLine;
  component +="import { " + tableName + ", "+ tableName + "_dataset, " + tableName + "_row} from '../models/" + tableName + "'; "  + newLine + newLine;
  component +="@Component({" + newLine + "  selector: 'app-" + componentName + "', " + newLine;
  component +="  templateUrl: './" + componentName + ".component.html', " + newLine;
  component +="  styleUrls: ['./" + componentName + ".component.css'] " + newLine + "})" + newLine;
  component +=" export class " + ComponentClassName(tableName) + " implements OnInit {" + newLine + newLine;
  component +="  baseTable:" + tableName + " = new " + tableName + "();" + newLine;
  component +="  currentRow:" + tableName + "_row;" + newLine;
  component +="  dataSet:" + tableName + "_dataset;" + newLine;
  component +="  emptyRow : " + tableName + "_row = new " + tableName + "_row();" + newLine + newLine;
  component +="  constructor() {" + newLine;
  component +="    this.dataSet = new " + tableName + "_dataset();" + newLine;
  component +="    this.currentRow = this.dataSet.currentRow();" + newLine;
  component +="    this.baseTable = new " + tableName + "();" + newLine;
  component +="  }" + newLine;
  component +="   getDisplayedRow(index: number){" + newLine;
  component +="    if (this.dataSet.displayedRows[index] != undefined) {" + newLine;
  component +="      return this.dataSet.cachedRows[this.dataSet.displayedRows[index]];" + newLine;
  component +="    }" + newLine;
  component +="    return this.emptyRow;" + newLine;
  component +="  }" + newLine;

  component +="  recordExists(index: number){" + newLine;
  component +="    if (this.dataSet.displayedRows[index] != undefined ) {" + newLine;
  component +="      return true;" + newLine + newLine;
  component +="    }" + newLine;
  component +="    return false;" + newLine;
  component +="  }" + newLine + newLine;
  component +="  ngOnInit() {" + newLine + "  }" + newLine + "}";
  
  
  return component;
}

var columnModel = function columnModel() {

 var columnModelClass = "export class Column {" + newLine;
 columnModelClass += "  columnName: string;" + newLine;
 columnModelClass += "  columnType: string;" + newLine;
 columnModelClass += "  columnLength: number;" + newLine;
 columnModelClass += "  mandatory: boolean;" + newLine;
 columnModelClass += "  databaseColumn: boolean;" + newLine;
 columnModelClass += "  primaryKey: boolean;" + newLine;
 columnModelClass += "  copyValueFrom: string;" + newLine;
 columnModelClass += "}" + newLine;

	return  columnModelClass;
}

var tableModel = function tableModel() {

 var tableModelClass = "import { Column } from './column';"+ newLine + newLine;

 tableModelClass += "export class Table {" + newLine;
 tableModelClass += "  tableName: string;" + newLine;
 tableModelClass += "  databaseTable: boolean;" + newLine;
 tableModelClass += "  queryRecord: boolean;" + newLine;
 tableModelClass += "  insertRecord: boolean;" + newLine;
 tableModelClass += "  updateRecord: boolean;" + newLine;
 tableModelClass += "  deleteRecord: boolean;" + newLine;
 tableModelClass += "  queryCondition: string;" + newLine;
 tableModelClass += "  orderBy: string;" + newLine;
 tableModelClass += "  tableColumns: Column[];" + newLine;
 tableModelClass += "}" + newLine;

	return  tableModelClass;
}

var appComponentFile = function appComponentFile(allDatasets){
	
    var fileContent = "";
	for (var j=0; j < allDatasets.length; j++){
		var componentName = Componentise(dataSetNames[j]);
		fileContent += "<app-" + componentName + "></app-" + componentName + ">" + newLine;
	}
	return fileContent;
	
}



var appModuleFile = function appModuleFile(dataSetNames){
	
	var fileContent = "import { BrowserModule } from '@angular/platform-browser';" + newLine;
	fileContent += "import { NgModule } from '@angular/core';" + newLine;
	fileContent += "import { FormsModule } from '@angular/forms';" + newLine;
	fileContent += "import { AppComponent } from './app.component';" + newLine;
	
	for (var j=0; j < dataSetNames.length; j++) {
		var componentName = Componentise(dataSetNames[j]);
		fileContent += "import { " + ComponentClassName(dataSetNames[j])+ " } from './" + componentName + "/" + componentName +".component';" + newLine;
	}

	fileContent += "@NgModule({" + newLine;
	fileContent += "  declarations: [" + newLine;
	fileContent += "    AppComponent," + newLine;
	for (var j=0; j < dataSetNames.length; j++) {
		var componentName = Componentise(dataSetNames[j]);
		fileContent += "    " + ComponentClassName(dataSetNames[j]) + "," + newLine;
	}
	fileContent += "  ]," + newLine;
	fileContent += "  imports: [" + newLine;
	fileContent += "    BrowserModule," + newLine;
	fileContent += "    FormsModule" + newLine;
	fileContent += "  ]," + newLine;
	fileContent += "  providers: []," + newLine;
	fileContent += "  bootstrap: [AppComponent]" + newLine;
	fileContent += "})" + newLine;
	fileContent += "export class AppModule { }" + newLine;

	return fileContent;
}

// Generate files

var appComponent = function appComponent(canvases, windows, consoleWindow) {
	
	var componentCode = "import { Component } from '@angular/core';" + newLine + newLine;
    componentCode += "@Component({"+ newLine;
    componentCode += "selector: 'app-root',"+ newLine;
    componentCode += "templateUrl: './app.component.html',"+ newLine;
    componentCode += "styleUrls: ['./app.component.css']"+ newLine;
    componentCode += "})" + newLine;
    componentCode += "export class AppComponent {" + newLine;

	// Hide other windows
	for (var i=0; i < windows.length; i++) {
		if (windows[i].Name != consoleWindow) {
			componentCode += windows[i].Name + "Active: boolean = false; " + newLine ;
		}
	}	
	// if there are any tabbed canvases add the functions for them here.
	for (var i=0; i < canvases.length; i++) {
		if (canvases[i]["Canvas Type"] == "Tab") {
			var canvasName = canvases[i].Name;
			componentCode += "ActiveTab" + canvasName+" = '" + canvases[i]["Tab Pages"][0].Name + "Tab'; " + newLine + newLine;
			componentCode += "set" + canvasName + "Tab(tabName) {" + newLine;
			componentCode += "this.ActiveTab" + canvasName + " = tabName;" + newLine;
			componentCode += "}" + newLine + newLine;
			componentCode += "isActive" + canvasName + "Tab(tabName) :boolean  {" + newLine;
			componentCode += "return (tabName == this.ActiveTab" + canvasName + ");" + newLine;
			componentCode += "  }" + newLine + newLine;
		}
	}
	
    componentCode += "}" + newLine;
	
	
	return componentCode;
}

var generateFiles = function generateFiles(dataSetNames, views, models, viewCss, canvases, appStructureLayout, windows, consoleWindow) {

	var data = "";
   
   var zip = new JSZip();
   var allCSS = "";
   
   // We neeed to generate a zip file containing
   // 1. A directory for eah block with 3 files. 
   //    a) An html file for the view
   //    b) A ts file for the class and metadata
   //    c) a CSS file for the style
   // 2. A models directory for each block defining the model class, dataset and row for each "table" for each block
   
	for (var j=0; j < dataSetNames.length; j++) {
		var componentName = Componentise(dataSetNames[j]);
        var modelsZip = zip.folder(componentName);
		data = views[dataSetNames[j]]
		zip.file(componentName + "/" + componentName + ".component.html", data);
		zip.file(componentName + "/" + componentName + ".component.css", "");
		zip.file(componentName + "/" + componentName + ".component.ts", componentModel(dataSetNames[j], componentName));
		zip.file("models\/" + dataSetNames[j] + ".ts", models[dataSetNames[j]] + newLine + newLine + dataSetRows[dataSetNames[j]]);
        allCSS += viewCss[dataSetNames[j]];
	}
	allCSS += viewCss["Common"];
	
	zip.file("app.component.html", appStructureLayout.AppHTML);
	zip.file("app.module.ts", appModuleFile(dataSetNames));
	zip.file("common/table.ts", tableModel());
	zip.file("common/column.ts", columnModel());
	zip.file("app.component.css", appStructureLayout.AppCSS + allCSS);
	zip.file("app.component.ts", appComponent(canvases, windows, consoleWindow));
	zip.generateAsync({type:"blob"})
		.then(function (blob) {
			saveAs(blob, "appFiles.zip");
		});
}

