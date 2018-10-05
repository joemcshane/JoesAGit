var DataSet = function(name, database, tableName, queryAllowed, insertAllowed, updateAllowed, deleteAllowed, whereClause, orderByClause) {

  this.name = name; 
  this.database = database;
  this.queryAllowed = queryAllowed;
  this.insertAllowed = insertAllowed;
  this.updateAllowed = updateAllowed;
  this.deleteAllowed = deleteAllowed;
  this.whereClause= whereClause;
  this.orderByClause = orderByClause;


return { Name : name
       , Database : database
	   , TableName : tableName
	   , QueryAllowed : queryAllowed
	   , InsertAllowed : insertAllowed 
	   , UpdateAllowed : updateAllowed
	   , DeleteAllowed : deleteAllowed
	   , Condition : whereClause
	   , OrderBy : orderByClause }
	
}

var Field = function Field(name, type, length, mandatory, database, queryOnly, queryAllowed, updateAllowed, insertAllowed, deleteAllowed, primaryKey, copyValue) {
	
   this.name = name;
   this.type = type;
   this.length = length;
   this.mandatory = mandatory;
   this.database = database;
   this.queryOnly = queryOnly;
   this.queryAllowed = queryAllowed;
   this.updateAllowed = updateAllowed;
   this.insertAllowed = insertAllowed;
   this.deleteAllowed = deleteAllowed;
   this.primaryKey = primaryKey;
   this.copyValue = copyValue;
   
   return {
   		Name : name,
		Type : type,
		Length : length,
		Mandatory : mandatory,
		Database : database,
		QueryOnly : queryOnly,
		QueryAllowed : queryAllowed,
		InsertAllowed : insertAllowed,
		UpdateAllowed : updateAllowed,
		DeleteAllowed : deleteAllowed,
		PrimaryKey : primaryKey,
		CopyValue : copyValue}
   
}





var formDetails = function formDetails(formJSON) {

	  var newLine = "\n";
   this.rawDataSets = formJSON.Blocks;

   this.dataSetNames = new Array(rawDataSets.length);
   this.dataSets = new Array(rawDataSets.length);
   this.dataSetRows = new Array(rawDataSets.length);
   this.models = new Array(rawDataSets.length);
   
   for (var i=0; i < rawDataSets.length; i++) {
	   
      dataSetNames[i] = rawDataSets[i].Name;
	  dataSets[dataSetNames[i]] = new DataSet(rawDataSets[i]["Name"]
	                  , rawDataSets[i]["Database Data Block"] == "Yes"
					  , rawDataSets[i]["Query Data Source Name"]
					  , rawDataSets[i]["Query Allowed"] == "Yes"
					  , rawDataSets[i]["Insert Allowed"] == "Yes"
					  , rawDataSets[i]["Update Allowed"] == "Yes"
					  , rawDataSets[i]["Delete Allowed"] == "Yes"
					  , rawDataSets[i]["WHERE Clause"]
					  , rawDataSets[i]["ORDER BY Clause"]);
	  
	  dataSets[dataSetNames[i]].FieldNames = new Array(rawDataSets[i]["Items"].length);
	  dataSets[dataSetNames[i]].Fields = new Array(rawDataSets[i]["Items"].length);
	  
	  for (var j=0; j < rawDataSets[i]["Items"].length; j++) {
	  
	    dataSets[dataSetNames[i]].FieldNames[j] = rawDataSets[i].Items[j]["Name"];
		if (dataSets[dataSetNames[i]].FieldNames ) {
	    dataSets[dataSetNames[i]].Fields[j] = 
		       new Field( rawDataSets[i].Items[j]["Name"]
			            , rawDataSets[i].Items[j]["Data Type"]
			            , rawDataSets[i].Items[j]["Maximum Length"]
			            , rawDataSets[i].Items[j]["Required"]
			            , rawDataSets[i].Items[j]["Database Item"]
			            , rawDataSets[i].Items[j]["Query Only"] == "Yes"
			            , rawDataSets[i].Items[j]["Query Allowed"] == "Yes"
			            , rawDataSets[i].Items[j]["Update Allowed"] == "Yes"
			            , rawDataSets[i].Items[j]["Insert Allowed"] == "Yes"
			            , rawDataSets[i].Items[j]["Delete Allowed"] == "Yes"
			            , rawDataSets[i].Items[j]["Primary Key"] == "Yes"
			            , rawDataSets[i].Items[j]["Copy Value from Item"]
						
						);
		}
	  }
	  
	  /* Models */
	 	models[dataSetNames[i]] = 
		    "import { Table } from '../common/table';" + newLine +
			"import { Column } from '../common/column';" + newLine + newLine +
			"export class " + dataSets[dataSetNames[i]].Name + " { "  + newLine;
			
			for (var k=0; k < dataSets[dataSetNames[i]].Fields.length; k++) {
				if (dataSets[dataSetNames[i]].Fields[k].Type) {
				  models[dataSetNames[i]] += dataSets[dataSetNames[i]].Fields[k].Name + ': Column = <Column>{ ';
				  models[dataSetNames[i]] += 'columnName: "' + dataSets[dataSetNames[i]].Fields[k].Name + '", ';
				  models[dataSetNames[i]] += 'columnType: "' + dataSets[dataSetNames[i]].Fields[k].Type + '", ';
				  models[dataSetNames[i]] += 'columnLength: ' + dataSets[dataSetNames[i]].Fields[k].Length + ', ';
				  models[dataSetNames[i]] += 'databaseColumn: ' + dataSets[dataSetNames[i]].Fields[k].Database + ' }; ' + newLine;
				}
			}
			
			/* Add table details */
			models[dataSetNames[i]] += 'table: Table = <Table>{ tableName: "' + dataSetNames[i] + '",' + newLine;
			models[dataSetNames[i]] += 'databaseTable: "' + dataSets[dataSetNames[i]].TableName + '",' + newLine;
			models[dataSetNames[i]] += 'queryRecord: "' + dataSets[dataSetNames[i]].QueryAllowed + '",' + newLine;
			models[dataSetNames[i]] += 'insertRecord: "' + dataSets[dataSetNames[i]].InsertAllowed + '",' + newLine;
			models[dataSetNames[i]] += 'updateRecord: "' + dataSets[dataSetNames[i]].UpdateAllowed + '",' + newLine;
			models[dataSetNames[i]] += 'deleteRecord: "' + dataSets[dataSetNames[i]].DeleteAllowed + '",' + newLine;
			models[dataSetNames[i]] += 'queryCondition: "' + dataSets[dataSetNames[i]].Condition + '",' + newLine;
			models[dataSetNames[i]] += 'orderBy: "' + dataSets[dataSetNames[i]].OrderBy + '"' + newLine ;
			
			models[dataSetNames[i]] += 'tableColumn: {' ;

			
			for (var k=0; k < dataSets[dataSetNames[i]].Fields.length; k++) {
				if (dataSets[dataSetNames[i]].Fields[k].Type) {

				if (k>0) {models[dataSetNames[i]] += ','}
 				models[dataSetNames[i]] += 'this.' + dataSets[dataSetNames[i]].Fields[k].Name;
					
				}
			}
			models[dataSetNames[i]] += '}' + newLine + '};';

  // rows
  			dataSetRows[dataSetNames[i]] = 'export class ' + dataSetNames[i] + '_row {' + newLine;
			
			for (var k=0; k < dataSets[dataSetNames[i]].Fields.length; k++) {
				if (dataSets[dataSetNames[i]].Fields[k].Type) {

				dataSetRows[dataSetNames[i]] += dataSets[dataSetNames[i]].Fields[k].Name + ':' ;
				if (dataSets[dataSetNames[i]].Fields[k].Type == "Number"){
					dataSetRows[dataSetNames[i]] += 'number;' + newLine;}
				else if (dataSets[dataSetNames[i]].Fields[k].Type == "Date"){
					dataSetRows[dataSetNames[i]] += 'Date;' + newLine;}
				else {
					dataSetRows[dataSetNames[i]] += 'string;' + newLine;}
					
				}
			}
			dataSetRows[dataSetNames[i]] += '};';


			
	}	
	
	return { dataSetNames : dataSetNames 
		   , dataSets : dataSets
		   , dataSetRows : dataSetRows
		   , models : models };
	  
   }
