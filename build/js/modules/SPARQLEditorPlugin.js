//-------------------------Eurosentiment SPARQLEDITOR code---------------------------------
//-----------------------------------------------------------------------------------------

//configuration

var eurosentimentEndpointURI = "http://146.148.28.139/eurosentiment/sparql-endpoint";
var googleSpreadsheetURI = "assets/EuroSentimentDemoSparqlQueries.csv";
// if urls in the sparql results starts with such prefix
var eurosentimentResourceNavigatorURLPrefix = "http://www.eurosentiment.eu/dataset/";
// then later on click they will point to this navigator
var eurosentimentResourceNavigatorURL = "http://portal.eurosentiment.eu/lr_navigator_demo";

var queries = [];

var yasqe = YASQE(document.getElementById("yasqe"), {
    sparql: {
        showQueryButton: false,
        createShareLink: false,        
        endpoint: "http://dbpedia.org/sparql"
    }
});
var yasr = YASR(document.getElementById("yasr"), {
    //this way, the URLs in the results are prettified using the defined prefixes in the query
    getUsedPrefixes: yasqe.getPrefixesFromQuery
});
yasr.setResponse({
    response: self.viewData    
});

// end of configuration


//ExecuteQuery function. Still not generalized, it takes 2restaurants" info from our endpoint at gsi's alpha
function executeQuery () {

    var restaurants_query = yasqe.getValue().replace(/(\r\n|\n|\r)/gm,"");    
    console.log(restaurants_query);   
    var temporal = 'http://alpha.gsi.dit.upm.es:3030/geo/query?query=' + encodeURIComponent(restaurants_query);
    var req = new XMLHttpRequest();
    req.open("GET", temporal, true);
    var params = encodeURIComponent(restaurants_query);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.setRequestHeader("Accept", "application/sparql-results+json");
    req.send();
    req.onreadystatechange = function() {
        if (req.readyState == 4){
            if (req.status == 200) {
                
                var res = eval ("(" + req.responseText + ")");
                var data = JSON.stringify(res.results.bindings);
                console.log(data);
                //ko.mapping.fromJSON(data, vm.viewData);
                //updateWidgets(true);  
                yasr.setResponse({
                    response: res,
                    contentType: req.getResponseHeader("Content-Type")
                });                  
            } else {
            }
        }
    };
    return false;
};



function populateQueryWithDynamicParams(queryTemplate, selectedParameter) {
    queryTemplate = queryTemplate.replace(/<sentimentValue>|<aspect>/g, selectedParameter);
    return queryTemplate;
}

//This function takes a list of parameter names and another list of parameters values.
//Then looks for every parameter name in the query code and replace it with its parameter value.
//parameterValues is a string containing all parameters values selected one after another ex:["Salamanca queso barato"]
function populateQueryWithStaticParams(query, parameterNames, parameterValues) {

    var pValues = parameterValues.trim().split(/\s+/);
    var pNames = parameterNames.trim().split(/\s+/);


    for (i = 0; i < pNames.length; i++) {
        var re = new RegExp("<" + pNames[i] + ">", "g");
        query = query.replace(re, pValues[i]);
    }
    return query;
}

$("#queryButton button").click(function(e) {
    e.preventDefault();
    executeQuery();
});

$("#querySelector").change(function() {
    // update param list 
    var i = $("#querySelector").val();
    var query = queries[i];
    var paramNo = query.paramNo;
    var description = query.description;
    var queryTemplate = query.queryTemplate.trim();
    var paramNames = query.paramNames;


    //put template query into the box (without replacing the parameters in the text)
    yasqe.setValue(queryTemplate);
    $("#description").text(description);

    //Create as many selectors as params for the selected query
    $("#paramSelector").empty();
    for (var i = 0; i < paramNo; i++) {
        var id = "selector"+i;
        var selectorAux = $("#paramSelector").append("<select class=form-control id="+id+">");

        //populate the selector with its parameter values
        populateParametersSelector("#selector"+i, query["param"+i]);

        //assign onChange function, we pass the index of the option chosen
        $("#selector"+i).change(function (handler) {
            //console.log("selectorOnChange for selector with id: " + handler.srcElement.attributes.id.value);
            onSelectorChange(handler.srcElement.attributes.id.value.slice(-1));
        });

    }

});

var onSelectorChange = function (selectorOrder){
    console.log("selectorOnChange for selector with order: " + selectorOrder);

    // update the query template using selected parameters
    var i = $("#querySelector").val();
    var query = queries[i];
    var queryTemplate = query.queryTemplate.trim();
    var paramNo = query.paramNo;
    var paramNames = query.paramNames;
    var pNames = paramNames.trim().split(/\s+/);

    var selectedParameters = "";

    //Now we compose a string with the selected parameters (or the param name if not chosen yet)
    for (var i = 0; i < paramNo; i++) {
       if($("#selector"+i).val() == "")
       {
           selectedParameters += "<"+pNames[i]+"> ";
           console.log("empty parameter");

       }
       else
       {
           console.log("value selected: "+ document.getElementById("selector"+i).value);
           //var values = query['param'+i].split(",");

           selectedParameters += (document.getElementById("selector"+i).value + " ");
       }

    }
    console.log(selectedParameters);
    //selectedParameters = $("#paramSelector").val();


    //var paramDefinition = query.paramNames;
    queryTemplate = populateQueryWithStaticParams(queryTemplate, paramNames, selectedParameters, paramNo);
    yasqe.setValue(queryTemplate);
};

//Receives the id of the selector and populate it with the values of the corresponding parameter
function populateParametersSelector(id, values) {

    values = values.split(",");

    $(id).append('<option value="">choose parameters</option>');
    for (var i = 0; i < values.length; i++) {
        $(id).append('<option value="' + values[i].trim() + '">' + values[i].trim() + "</option>");
    }
}

//This doesn't work
//$(".Selector").change(function() {
//    // update the query template using selected parameters
//    var i = $("#querySelector").val();
//    var query = queries[i];
//    var queryTemplate = query.queryTemplate.trim();
//    var paramNo = query.paramNo;
//    var selectedParameters = $("#paramSelector").val();
//    var paramDefinition = query.paramNames;
//    queryTemplate = populateQueryWithStaticParams(queryTemplate, paramDefinition, selectedParameters, paramNo);
//    yasqe.setValue(queryTemplate);
//
//    if (paramNo != 4 && paramNo != 5) {
//        $("#dynamicParam").empty().hide();
//    }
//    // here fetch extra param automatically
//    if (paramNo == 4 || paramNo == 5) {
//        // use query 27 to get 10 to aspects
//        var queryForDynamicParameter = query.queryForDynamicParameter.split(",");
//        var dynamicQueryNo = parseInt(queryForDynamicParameter[0], 10);
//        var dynamicQuery = queries[dynamicQueryNo].queryTemplate;
//        // here take the static params and populate the query template
//        dynamicQuery = populateQueryWithStaticParams(dynamicQuery, paramDefinition, selectedParameters);
//
//
//        // here fire the ajax query and populate the dynamicParam select
//        // TODO: use 2 queries for positive ad negative sentiment values
//        $.ajax({
//            url: eurosentimentEndpointURI,
//            data: {
//                query: dynamicQuery
//            },
//            dataType: "json",
//            success: function(json) {
//
//                var results = [];
//                for (var i = 0; i < json.results.bindings.length; i++) {
//                    var binding = json.results.bindings[i];
//
//                    if (binding.sentiment && binding.sentiment.value) {
//                        results.push(binding.sentiment.value);
//                    } else if (binding.aspect && binding.aspect.value) {
//                        results.push(binding.aspect.value);
//                    }
//                }
//
//                if (results.length == 0) {
//                    alert("No results");
//                }
//                $("#dynamicParam").empty().append('<option>Choose option</option>');
//                for (var i = 0; i < results.length; i++) {
//                    $("#dynamicParam").append('<option>' + results[i] + '</option>')
//                }
//                $("#dynamicParam").show();
//            }
//        })
//
//    }
//});

$("#dynamicParam").change(function() {
    var i = $("#querySelector").val();
    var query = queries[i];
    var queryTemplate = query.queryTemplate.trim();
    var paramNo = query.paramNo
    var selectedParameters = $("#paramSelector").val();
    var selectedDynamicParam = $("#dynamicParam").val();
    var paramDefinition = query.paramNames;
    queryTemplate = populateQueryWithStaticParams(queryTemplate, paramDefinition, selectedParameters);
    queryTemplate = populateQueryWithDynamicParams(queryTemplate, selectedDynamicParam);
    yasqe.setValue(queryTemplate);
});

$(document).on("click", "a.uri", function(e) {
    var link = $(this).attr("href");
    if (link.indexOf(eurosentimentResourceNavigatorURLPrefix) == 0) {
        link = eurosentimentResourceNavigatorURL + "#conceptURI=" + encodeURIComponent(link);
        $(this).attr("href", link);
    }
})

//This function parse the csv table to take its data.
Papa.parse(
    googleSpreadsheetURI, {
        download: true,
        complete: function (json) {
            // here populate the list from the json data
            var paramNo;
            for (var i = 1; i < json.data.length; i++) {
                //How many params?
                paramNo = 0;
                try {
                    paramNo = parseInt(json.data[i][5], 10);
                } catch (e) {
                }

                queries.push({
                    linkedResources: json.data[i][0],
                    showInDemo: json.data[i][1].trim(),
                    name: json.data[i][2],
                    queryTemplate: json.data[i][3],
                    description: json.data[i][4],
                    paramNo: paramNo,
                    paramNames: json.data[i][6]
                });
                //Here we add a variable number of parameter rows, each with its values,
                //in the format: param0, param1...
                for (var j = 0; j < paramNo; j++) {
                    queries[i-1]["param" + j] = json.data[i][7 + j];
                }
            }

            //Here we populate the query form selector with query names
            var queryAux;
            for (i = 0; i < queries.length; i++) {
                queryAux = queries[i];
                if (queryAux.showInDemo == "yes") {
                    $("#querySelector").append('<option value="' + i + '">' + queryAux.name + "</option>");
                    //$("#queryName").append('<option value="'+i+'">'+ (i+2) +" "+query.name+"</option>");
                }
            }
            $("#querySelector").change();
        }
    });



//-----------------------------------------------------------------------------------------
