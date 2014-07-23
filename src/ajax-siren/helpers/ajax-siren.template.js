// contains common javascript functions required/used by templates
// functions used by the handlebar helpers and not defined here 
// should be in siren-faceted-browser.helper.js


	// ===========================
	// helpers used by handlebar 
	// ===========================
	
	Handlebars.registerHelper('getFirstEl', function(propertyName,el) {
		if(this[propertyName] && this[propertyName].length > 0){
			return  strip( this[propertyName][0] ).substring(0, 200);
		}
		return "";
	});	

	Handlebars.registerHelper('getAllEl', function(propertyName,el) {
		var result = "";
		if(this[propertyName] && this[propertyName].length > 0){
			for (var i = 0; i < this[propertyName].length; i++) {
				result = result + strip( this[propertyName][i] ) + ", ";
			}
			result = result.substring(0, result.length - 2);
		}
		return result;
	});	

	Handlebars.registerHelper('makeSafeId', function(el) {
		return makeSafeId(this["id"]);
	});
	
	Handlebars.registerHelper('getFirstElAsFloat', function(propertyName,el) {
		if(this[propertyName] && this[propertyName].length > 0){
			return  commaSeparateNumber(parseFloat(strip( this[propertyName][0] )));
		}
		return "";
	});
	
