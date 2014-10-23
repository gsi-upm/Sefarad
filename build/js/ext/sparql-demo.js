//configuration

var endpointURI =  "http://146.148.28.139/eurosentiment/sparql-endpoint";
var googleSpreadsheetURI = "https://docs.google.com/spreadsheet/pub?key=0AoneFswCzkATdDFGTzFHdmpvNG93M2dfTG1jb001YXc&single=true&gid=23&output=csv";
var eurosentimentResourceNavigatorURLPrefix = "http://www.eurosentiment.eu/dataset/";       // if urls in the sparql results starts with such prefix
var eurosentimentResourceNavigatorURL = "http://portal.eurosentiment.eu/lr_navigator_demo"; // then later on click they will point to this navigator

// end of configuration

var queries = [];

var yasqe = YASQE(document.getElementById("yasqe"), {
	sparql: {
		showQueryButton: false,
		createShareLink: false,
		endpoint: endpointURI 
	}
});
var yasr = YASR(document.getElementById("yasr"), {
	//this way, the URLs in the results are prettified using the defined prefixes in the query
	getUsedPrefixes: yasqe.getPrefixesFromQuery
});

/**
* Set some of the hooks to link YASR and YASQE
*/
yasqe.options.sparql.handlers.success =  function(data, textStatus, xhr) {
	yasr.setResponse({response: data, contentType: xhr.getResponseHeader("Content-Type")});
};
yasqe.options.sparql.handlers.error = function(xhr, textStatus, errorThrown) {
	var exceptionMsg = textStatus + " (response status code " + xhr.status + ")";
	if (errorThrown && errorThrown.length) exceptionMsg += ": " + errorThrown;
	yasr.setResponse({exception: exceptionMsg});
};


function populateParametersSelect(allParamValues){
	var id = "#allParams";

	if( ! allParamValues || allParamValues == ""){
		$(id).hide();
		$("#dynamicParam").hide();
		return;
	}
	
	$(id).empty().show();
		
	var params = allParamValues.split(",");
	$(id).append('<option value="">choose parameters</option>');
	
	for(var i=0; i<params.length; i++){
		$(id).append('<option value="'+params[i].trim()+'">'+params[i].trim()+"</option>");
	}
}

function populateTemplateWithDynamicParams(queryTemplate, selectedParameter){
	queryTemplate = queryTemplate.replace(/<sentimentValue>|<aspect>/g, selectedParameter ); 
	return queryTemplate;
}

function populateTemplateWithStaticParams(queryTemplate, selectedParameters, paramNo){
	var parameterValues = selectedParameters.trim().split(/\s+/);
	
		if(parameterValues.length == 1){
			queryTemplate = queryTemplate.replace(/<domain>/g,   parameterValues[0] );
		}else if(parameterValues.length == 2){
			queryTemplate = queryTemplate.replace(/<domain>/g,   parameterValues[0] );
			queryTemplate = queryTemplate.replace(/<language>/g,   parameterValues[1] );
		}else if(parameterValues.length == 3 || parameterValues.length == 4 ){
			queryTemplate = queryTemplate.replace(/<domain>/g,   parameterValues[0] );
			queryTemplate = queryTemplate.replace(/<language>/g,   parameterValues[1] );
			queryTemplate = queryTemplate.replace(/<resource>/g,   parameterValues[2] );
			if(parameterValues.length == 4 ){
			    queryTemplate = queryTemplate.replace(/<translatein>/g,   parameterValues[3] );
		    }
		}
	return queryTemplate;
}



//$(document).ready(function(){
function init(){
	
	$("#queryButton button").click(function(e){
		e.preventDefault();
		yasqe.query();
	});

	$("#queryName").change(function(){
		// update param list 
		var i = $("#queryName").val();
		var query = queries[i]; 
	    var description = query.description;
	    var allParamsValue = query.allParams;
		var queryTemplate = query.queryTemplate.trim();
	    
	    
		// put template query into the box
		yasqe.setValue(queryTemplate);
		$("#description").text(description);

		$("#allParam").hide();
		$("#dynamicParam").hide();

		// populate paramete select 
		populateParametersSelect(allParamsValue);

	});

	$("#allParams").change(function(){
		// update the query template using selected parameters 
		var i = $("#queryName").val();
		var query = queries[i]; 
		var queryTemplate = query.queryTemplate.trim();
	    var paramNo = query.paramNo
		var selectedParameters = $("#allParams").val();
		queryTemplate = populateTemplateWithStaticParams(queryTemplate, selectedParameters, paramNo);
		yasqe.setValue(queryTemplate);
	
		if(paramNo != 4 && paramNo != 5  ){
			$("#dynamicParam").empty().hide();
		}
		// here fetch extra param automatically 
		if(paramNo == 4 || paramNo == 5){
			// use query 27 to get 10 to aspects 
			var queryForDynamicParameter = query.queryForDynamicParameter.split(",");
			var dynamicQueryNo = parseInt(queryForDynamicParameter[0],10);
			var dynamicQuery = queries[ dynamicQueryNo ].queryTemplate;
			// here take the static params and populate the query template 
			dynamicQuery = populateTemplateWithStaticParams(dynamicQuery, selectedParameters, paramNo);

	
			// here fire the ajax query and populate the dynamicParam select 
			// TODO: use 2 queris for positive ad negative sentiment values 
			$.ajax({
				url: endpointURI ,
				data:{
					query:dynamicQuery
				},
				dataType:"json",
				success:function(json){

					var results = [];
					for(var i=0 ; i<json.results.bindings.length;i++){
						var binding = json.results.bindings[i];
						
						if(binding.sentiment && binding.sentiment.value){
							results.push(binding.sentiment.value);
						}else if(binding.aspect && binding.aspect.value){
							results.push(binding.aspect.value);
						}
					}

					if(results.length==0){
						alert("No results");
					}
					$("#dynamicParam").empty().append('<option>Choose option</option>');
					for(var i=0;i<results.length;i++){
						$("#dynamicParam").append('<option>'+results[i]+'</option>')
					}
					$("#dynamicParam").show();
				}
			})

		}
	});

	$("#dynamicParam").change(function(){
		var i = $("#queryName").val();
		var query = queries[i]; 
		var queryTemplate = query.queryTemplate.trim();
	    var paramNo = query.paramNo
		var selectedParameters = $("#allParams").val();
		var selectedDynamicParam = $("#dynamicParam").val();
		queryTemplate = populateTemplateWithStaticParams(queryTemplate, selectedParameters, paramNo);
		queryTemplate = populateTemplateWithDynamicParams(queryTemplate, selectedDynamicParam);
		yasqe.setValue(queryTemplate);
	});

	$(document).on("click", "a.uri", function(e){
		var link = $(this).attr("href");
		if(link.indexOf(eurosentimentResourceNavigatorURLPrefix)==0){
			link = eurosentimentResourceNavigatorURL +"#conceptURI="+ encodeURIComponent(link);
			$(this).attr("href", link);
		} 
	})

	Papa.parse(
		googleSpreadsheetURI,
		{
	    download: true,
	    complete:function(json){
	    	// here populate the list from the json data
	    	var paramNo;
	    	for(var i=1; i<json.data.length;i++){
	    		
	    		paramNo = 0;
	    		try{
					paramNo = parseInt(json.data[i][5], 10);
	    		}catch(e){}

	    		queries.push({
	    			linkedResources:json.data[i][0],
	    			showInDemo:json.data[i][1].trim(),
	    			name:json.data[i][2],
	    			queryTemplate:json.data[i][3],
	    			description:json.data[i][4],
	    			paramNo:paramNo, 
	    			allParams:json.data[i][6],
	    			queryForDynamicParameter:json.data[i][7]
	    		});
	    	}
	    	
	    	var query;
	    	
	    	for(i=0;i<queries.length; i++){
	    		query = queries[i];
	    		if(query.showInDemo == "yes"){
	    			$("#queryName").append('<option value="'+i+'">'+query.name+"</option>");
	    			//$("#queryName").append('<option value="'+i+'">'+ (i+2) +" "+query.name+"</option>");
	    		}
	    	}
	    	$("#queryName").change();
	    }
	});

}
