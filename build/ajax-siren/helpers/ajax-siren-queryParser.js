function QueryParser(config){
  this.config = config;
  this.keywords = [];
  this.jsons = [];
}

QueryParser.prototype.generateQ = function(){
	var s ="";
	var keywordS = "";
	var jsonS = "";
	
	for(var i=0;i<this.keywords.length;i++){
		keywordS += this.keywords[i]+" ";
	}
	keywordS = this._trim(keywordS);
	
	
	//TODO: 
	// here when building the query from json fragments make sure that if there are 2 or more fragments with the same paths
	// the will be combined 
	// can not use JSON.parse for that as the jsons fragments are not valid json
	// it is a pitty because then it would be possible to use $.extend(true, {}, x, y);
	
	
	//var merge =[];
	
	for(var i=0;i<this.jsons.length;i++){
		
		// here merge the jsons parts which can be merged
		if(i != 0){
			jsonS += " AND ";
		}
		/*
		if(this.config && this.config.facetPaths){
			for(var j=0; j<this.config.facetPaths.length; j++){
				var path = this.config.facetPaths[j];
				// here check that json match the regex 
				var re = new RegExp(path.regex);
				var match = re.exec("{!keyword} "+this.jsons[i]);
				if(match){
					merge[i] = {
						merge: path.mergeId,
						json:  this.jsons[i]
					};
				}
			}	
		}
		*/
		
		jsonS += "( " + this._unjsonize(this._jsonize(this.jsons[i])) +" )";
	}
	
	
	if(this.config && this.config.merge){
		// here merged jsons which have common mergeId
		var all = {};
		//for(var i=1;i<merge.length;i++){
		for(var i=0;i<this.jsons.length;i++){
		    var toMerge = this._jsonize(this.jsons[i]);
			$.extend(true, all, toMerge);
		}
		
		jsonS = "";
		var first = true;
		for(var p in all){
			if(all.hasOwnProperty(p)){
				var o = {};
				o[p] = all[p];
				if(!first){
					jsonS += " AND ";
				}
				jsonS += "( "+ this._unjsonize( o ) +" )";
				first = false;
			}
		}
	}
	jsonS = this._trim(jsonS);
		
	
	var ret = "";
	if(keywordS != ""){
		ret += keywordS;
	}
	
	if(jsonS != ""){
		if( keywordS != "" ){
			ret += " AND "+jsonS;
		}else{
			ret += jsonS;
		}
	}
	
	return ret;
};


QueryParser.prototype._jsonize = function(psudoJson){
	
	// wrap strings in double quotes
	var s = psudoJson
	
	.replace(/(xsd\:long\(\d+\)|xsd\:double\([0-9E.]+\)|\b(?!null)[^'][A-Za-z0-9_]*?(?!')\b)/g, "\"$1\"");
	
	// turn single quotas in double quotas
	s = s.replace(/'(.*?)'/g,"\"--single-quote--$1--single-quote--\"")
	
	.replace(/\*/g,"\"--star--\"");
	
	// add extra {}
	s = "{"+s+"}";
	
	//return s;
	return JSON.parse(s);
};

QueryParser.prototype._unjsonize = function(realJson){
	var s = JSON.stringify(realJson);
	
	s = s
	.replace(/"--star--"/g,"*")
	// strip double quotes
	.replace(/"([A-Za-z0-9_-]+?)"/g,"$1")
	
	.replace(/--single-quote--/g,"'")
	// remove wrapping {}
	.replace(/^\{/,"").replace(/}$/,"")
	// add some spaces arround : 
	
	.replace(/:([^ ])/g,": $1")
	.replace(/,(?! )/g,", ")
	
	// replace extra space in xsd: long
	.replace(/"(xsd\:) (long\(\d+\))"/g,"$1$2")
	
	// replace extra space in xsd: double
	.replace(/"(xsd\:) (double\([0-9E.]+\))"/g,"$1$2");
	
	return s;
};

QueryParser.prototype._trim = function(s){
	s = ""+s;
	return s.replace(/^\s+|\s+$/g, '');
};

QueryParser.prototype._endsWith = function(s,pattern) {
    var d = s.length - pattern.length;
    return d >= 0 && s.lastIndexOf(pattern) === d;
};

QueryParser.prototype._startsWith = function(s,pattern) {
	    return s.indexOf(pattern) === 0;
};
// should return parsed object 
// {
//    keywords:[],
//    jsons:[]
// }
// Assumption to simplify as much as possible
// * all parts keywords and jsons are joinned via AND
// * AND is the ONLY allowed boolean operation 
// * no parenthesis 
 

QueryParser.prototype.parse = function(q){
	
	if(q==null){
		return;
	}
	
	this.keywords = [];
	this.jsons = [];
	
	this.q = q.
	replace(/\(\s+\(/g,"((").
    replace(/\)\s+\)/g,"))");
    //replace(/\)\s+OR/g,")OR").
    //replace(/OR\s+\(/g,"OR(").
    //replace(/\)\s+AND/g,")AND").
    //replace(/AND\s+\(/g,"AND(").
    //replace(/\)\s+NOT/g,")NOT").
    //replace(/NOT\s+\(/g,"NOT(");
	
	// TODO: 
	// here it is important that in the query there are spaces around AND
	// if there are no spaces - we need a smart way to split only at the right AND 
	// - avoid splitting on AND which is part of some value inside json or part of the literal 
	// so split on: 
	//   AND
	//   AND(
	//   )AND(
	// but not on AND in: 
	//   ANDREAS 
	//   { value : 'AND' }
	
	var a = this.q.split(/ AND /);
	
	// trim all parts
	for(var i=0;i<a.length;i++){
		a[i] = this._trim(a[i]);
		// if it starts and ends with parenthesis remove them 
		if(this._startsWith(a[i],"(") && this._endsWith(a[i],")") ){
			a[i] = a[i].substring(1,a[i].length-1);
		}
		a[i] = this._trim(a[i]);
	}	
	
	// here test each part is it a keyword or a json 
	for(var i=0;i<a.length;i++){
		// simple test to match some jsons
		if(a[i].match(/[{}:]/)){
			
			//TODO:
			// here analyze json and if it can be separated to 2 or more pieces for 
			// according to provided paths then separate it 
			
			
			this.jsons.push(a[i]);
			continue;
		}
		
		
		// all the rest is a keyword
		
		// 1) split by spaces
		// TODO: 
		// here there might be a situation where the keyword contain spaces 
		// if it is enquoted  
		var k = a[i].split(" ");
		for(var j=0;j<k.length;j++){
			this.keywords.push( k[j] );
		}
	}
};

QueryParser.prototype.removeJson = function(json){
	var jsonsCopy = [];
	for(var i=0;i<this.jsons.length;i++){
		if(this.jsons[i] != this._trim(json)){
			// copy only different ones
			jsonsCopy.push(this.jsons[i]);
		}
	}
	this.jsons = jsonsCopy;
};


QueryParser.prototype.addJson = function(json){
	for(var i=0;i<this.jsons.length;i++){
		if(this.jsons[i] == this._trim(json)){
			return;
		}
	}
	this.jsons.push(json);
};

QueryParser.prototype.removeKeyword = function(keyword){
	var keywordsCopy = [];
	for(var i=0;i<this.keywords.length;i++){
		if(this.keywords[i] != keyword){
			keywordsCopy.push(this.keywords[i]);
		}
	}
	this.keywords = keywordsCopy;
};


QueryParser.prototype.addKeyword = function(keyword){
	for(var i=0;i<this.keywords.length;i++){
		if(this.keywords[i] == keyword){
			return;
		}
	}
	this.keywords.push(keyword);
};



QueryParser.prototype.getParsed = function(){
	// here return a copy of the arrays
	return {
		"keywords":JSON.parse(JSON.stringify(this.keywords)),
		"jsons":JSON.parse(JSON.stringify(this.jsons))
	};
};


function getRegexThatMatchedJson(regexes,json){
	for(var i=0;i<regexes.length;i++){
		var regexS = regexes[i].regex;
		var regex = new RegExp(regexS);
		
		var match = regex.exec(json);
        if(match){
			return regexes[i];
		}
	}
	return null;
}

// from regex:     "^(\{\!keyword\} )(category_code \: ')(.*)('\\s*)$"
// we should get:  "^(\{\!keyword\} )(category_code \: ')" 

function generatePrefixRegexString(regexS){
	
	var regex = /^\^(\(.*\))(\(.*\))(\(.*\))(\(.*\))\$$/;
	var match = regex.exec(regexS);
    if(match){
		return "^"+match[1]+match[2];
	}
	return null;
}

//from regex string it should produce the human readible name
// e.g: 
// 1) 
//  "^(\{\!keyword\} )(category_code \: ')(.*)('\\s*)$"
//  "category_code:",	
// 2) 
//  "^(\{\!keyword\} )(funding_rounds \: \{ funded_month \: )(.*)( \}\\s*)$"
//  "funding_rounds.funded_month:",	

function generateName(regexS){
	var regex = /^\^(\(.*\))\((.*)\)(\(.*\))(\(.*\))\$$/;
	var match = regex.exec(regexS);
    if(match){
		return   match[2].replace(/\s|'|{/g,"").replace(/:(?!$)/g, '.');
    }
	return null;
}

function pathToJson(p,v){
	
	 var datatype = p.substring(0,p.indexOf("."));
	
	 var ret = p
	  // strip datatype and field
	  .replace(/^.+?\..+?\./,"");
	 
	  //count dots
	  var dotsNumber = ret.replace(/[^.]/g,"").length;
	  
	  // replace all dots with :{
	  ret = ret.replace(/\./g,": {");
	  // add colon
	  ret += ": ";
		  
	  // add value - quote value if datatype is string and it contains white characters
	  if(datatype=="string" && v.indexOf(" ")!= -1 && v.indexOf("'") === -1){
		  ret += "'"+v+"'";
	  }else if(datatype=="string" && v.indexOf(" ")!= -1 && v.indexOf("'") != -1){
		  ret += '"' + v + '"';
	  }else if(datatype=="long"){
		  ret += "xsd:long("+v+")";	
	  }else if(datatype=="double"){
		  ret += "xsd:double("+v+")";	
	  }else{
		  ret += v; 
	  }
	  
	  for(var i=0;i<dotsNumber;i++){
		  ret+="}";
	  }
	
	  return ret;
}
