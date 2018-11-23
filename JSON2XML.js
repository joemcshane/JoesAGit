// Convert JSON to XML

if (!String.prototype.encodeXML) {
  String.prototype.encodeXML = function () {
    return this.replace(/&/g, '&amp;')
               .replace(/</g, '&lt;')
               .replace(/>/g, '&gt;')
               .replace(/"/g, '&quot;')
               .replace(/'/g, '&apos;');
  };
}

if (!String.prototype.safeXMLTag) {
  String.prototype.safeXMLTag = function () {
    return this.replace(/ /g, '_')
               .replace(/'/g)
               .replace(/\//g);
  };
}


var JSON2XML = function JSON2XML(JSONobj, nodeName) {
	
	var groupName = "";
	
	
	if (Array.isArray(JSONobj)) {
		groupName = nodeName.safeXMLTag() + '_Group';
	} else {
		groupName = nodeName.safeXMLTag();
	}
	
	var xmlString = '<' + groupName + '>';

	for (var prop in JSONobj) {
		
		
		if (JSONobj[prop] == undefined) {
			continue;
		}
		
		var elementName = prop.safeXMLTag();

		
		if (Array.isArray(JSONobj)) {
			elementName = nodeName;
		}
		
		if (typeof JSONobj[prop] == "object") {
			xmlString += JSON2XML(JSONobj[prop], elementName);
		}
		else {
			xmlString += '<' + elementName + '>';
			xmlString += JSONobj[prop].replace(/&/g, '&amp;')
               .replace(/</g, '&lt;')
               .replace(/>/g, '&gt;')
               .replace(/"/g, '&quot;')
               .replace(/'/g, '&apos;');
			xmlString += '<\/' + elementName + '>';
		}
		
		elementName = "";
		
	}

	return xmlString  + '<\/' + groupName + '>';;

}

	
