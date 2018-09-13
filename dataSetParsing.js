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

   this.rawDataSets = formJSON.Blocks;

   this.dataSetNames = new Array(rawDataSets.length);
   this.dataSets = new Array(rawDataSets.length);
   
   for (i=0; i < rawDataSets.length; i++) {
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
	  
	  for (j=0; j < rawDataSets[i]["Items"].length; j++) {
	  
	    dataSets[dataSetNames[i]].FieldNames[j] = rawDataSets[i].Items[j]["Column Name"];
		if (dataSets[dataSetNames[i]].FieldNames) {
	//    dataSets[dataSetNames[i]].Fields[dataSets[dataSetNames[i]].FieldNames[j]] = 
	    dataSets[dataSetNames[i]].Fields[j] = 
		       new Field( rawDataSets[i].Items[j]["Column Name"]
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
	}	
	
	return { dataSetNames : dataSetNames 
		   , dataSets : dataSets };
	  
   }
