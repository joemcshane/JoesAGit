var newLine = "\n";


var GeneratePackage = function GeneratePackage(packageName, schema, procedures){

	var packageTemplate = "CREATE OR REPLACE PACKAGE <Schema>.<PackageName> IS <Procedures> END <PackageName>;";
	var packageBodyTemplate = "CREATE OR REPLACE PACKAGE BODY <Schema>.<PackageName> IS <Procedures> END <PackageName>;";

	var packageDefinition = "";
	
	packageSpecDefinition = packageTemplate.replace(/<Schema>/g, schema)
	                                       .replace(/<PackageName>/g, packageName)
										   .replace('<Procedures>', procedures.Specifications.join(newLine));
	packageBodyDefinition = packageBodyTemplate.replace(/<Schema>/g, schema).replace(/<PackageName>/g, packageName).replace('<Procedures>', procedures.Definitions.join(newLine));

return packageSpecDefinition + newLine + newLine + packageBodyDefinition;
}

var  GenerateProcedures = function GenerateProcedures (rawJSON){
	
	var procedureNames = [];
	var specifications = [];
	var definitions = [];
	
	for (var pn=0; pn < rawJSON.Blocks.length; pn ++){
		
		procedureNames.push('SELECT_' + rawJSON.Blocks[pn].Name);
		specifications.push('(p_condition IN VARCHAR2)');
		
		var selectCode = "BEGIN" + newLine;
		selectCode += "-- Interpret JSON conditions"  + newLine;
		selectCode += "-- Generate Select with list of columns and conditions" + newLine;
		selectCode += "-- return JSON message from select" + newLine;
		selectCode += "END;" + newLine;
		
		definitions.push(selectCode);
		
	}
	
	
	return { Names: procedureNames
			, Specification: specifications
			, Definitions : definitions};
}