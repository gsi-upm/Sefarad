/**
 * Created by asaura on 17/11/14.
 */
// Eurosentiment's SPARQL Editor
var sparqlEditorWidget = {
    // Widget name.
    name: "SPARQL Editor",
    // Widget description.
    description: "Offers some query templates with variable parameters",
    // Path to the image of the widget.
    img: "img/SPARQLeditor.png",
    // Type of the widget. Must be exactly the name of the .js file!
    type: "sparqlEditorWidget",
    // Help display on the widget
    help: "Results help",
    // Category of the widget (1: textFilter, 2: numericFilter, 3: graph, 5:results, 4: other, 6:map)
    cat: 4,

    render: function () {

        var id = 'A' + Math.floor(Math.random() * 10001);
        var configid = 'A' + Math.floor(Math.random() * 10001);
        var field = this.field || "";
        vm.activeWidgetsRight.push({
            "id": ko.observable(id),
            "configid": ko.observable(configid),
            "title": ko.observable(this.name),
            "type": ko.observable(this.type),
            "field": ko.observable(field),
            "collapsed": ko.observable(false),
            "showWidgetHelp": ko.observable(false),
            "help": ko.observable(this.help),
            "showWidgetConfiguration": ko.observable(false)
        });

        this.paintConfig(configid);
        this.paint(id);
    },

    paintConfig: function (configid) {
        d3.select('#' + configid).selectAll('div').remove();
        var div = d3.select('#' + configid);
        div.attr("align", "center");
    },

    paint: function (id) {

        d3.select('#' + id).selectAll('div').remove();
        var div = d3.select('#' + id);
        div.attr("align", "center");

        //Create the HTML:
        //
        //<h1>Directly query linked data in Eurosentiment</h1>
        //
        //<div id="queries">
        //    <label>Choose example query template and later query parameter values:</label><br />
        //    <select class="form-control" id="querySelector"></select>
        //    <div id="paramSelector"></div>
        //    <select class="form-control" id="dynamicParam"></select>
        //    <br/>
        //    Query description:
        //    <div id="description" ></div>
        //</div>
        //<div id="yasqe"></div>
        //    <div id="queryButton" ><button>Get results from sparql endpoint</button></div>
        //    <div id="yasr"></div>

        div.append("h2").text("Eurosentiment SPARQL query linked data");
        var queriesDiv = div.append("div").attr("id", "queries");
        queriesDiv.append("label").text("Choose example query template and later query parameter values:");
        queriesDiv.append("br");
        var querySelector = queriesDiv.append("select").attr("class", "form-control").attr("id", "querySelector").attr("style", "height: 100%; width: 100%");
        var paramSelector = queriesDiv.append("div").attr("id", "paramSelector");
        queriesDiv.append("br");
        queriesDiv.append("p").text("Query description");
        queriesDiv.append("div").attr("id", "description");
        var yasqeDiv = div.append("div").attr("id", "yasqe");
        var yasqeButtonDiv = div.append("div").attr("id", "queryButton");
        var yasqeButton = yasqeButtonDiv.append("button").text("Get results from SPARQL endpoint")
        var yasrDiv = div.append("div").attr("id", "yasr").attr("style", "width: 100%");

        //configuration

        var queries = [];

        var yasqe = YASQE(document.getElementById("yasqe"), {
            sparql: {
                showQueryButton: false,
                createShareLink: false,
                endpoint: "http://dbpedia.org/sparql"
            }
        });

        YASR.plugins.table.defaults.datatable.scrollX = true;
        YASR.plugins.table.defaults.datatable.scrollCollapse = true;
        YASR.plugins.table.defaults.datatable.autoWidth = true;
        YASR.plugins.table.defaults.datatable.scrollY = "300px";

        var yasr = YASR(document.getElementById("yasr"), {
            //this way, the URLs in the results are prettified using the defined prefixes in the query
            getUsedPrefixes: yasqe.getPrefixesFromQuery
        });
        yasr.setResponse({
            response: vm.viewData
        });





        // end of configuration


        //This function parse the csv table to take its data.
        var googleSpreadsheetURI = "assets/EuroSentimentDemoSparqlQueries.csv";
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
                            queries[i - 1]["param" + j] = json.data[i][7 + j];
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

        $(document).on("click", "a.uri", function (e) {
            var link = $(this).attr("href");
            if (link.indexOf(eurosentimentResourceNavigatorURLPrefix) == 0) {
                link = eurosentimentResourceNavigatorURL + "#conceptURI=" + encodeURIComponent(link);
                $(this).attr("href", link);
            }
        });

//Receives the id of the selector and populate it with the values of the corresponding parameter
        function populateParametersSelector(id, values) {

            values = values.split(",");

            $(id).append('<option value="">choose parameters</option>');
            for (var i = 0; i < values.length; i++) {
                $(id).append('<option value="' + values[i].trim() + '">' + values[i].trim() + "</option>");
            }
        }

        var onSelectorChange = function (selectorOrder) {
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
                if ($("#selector" + i).val() == "") {
                    selectedParameters += "<" + pNames[i] + "> ";
                    console.log("empty parameter");

                }
                else {
                    console.log("value selected: " + document.getElementById("selector" + i).value);
                    //var values = query['param'+i].split(",");

                    selectedParameters += (document.getElementById("selector" + i).value + " ");
                }

            }
            console.log(selectedParameters);
            //selectedParameters = $("#paramSelector").val();


            //var paramDefinition = query.paramNames;
            queryTemplate = populateQueryWithStaticParams(queryTemplate, paramNames, selectedParameters, paramNo);
            yasqe.setValue(queryTemplate);
        };


//ExecuteQuery function. Still not generalized, it takes "restaurants" info from our endpoint at gsi's alpha
        function executeQuery() {

            var restaurants_query = yasqe.getValue().replace(/(\r\n|\n|\r)/gm, "");
            console.log(restaurants_query);
            var temporal = 'http://alpha.gsi.dit.upm.es:3030/geo/query?query=' + encodeURIComponent(restaurants_query);
            var req = new XMLHttpRequest();
            req.open("GET", temporal, true);
            var params = encodeURIComponent(restaurants_query);
            req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            req.setRequestHeader("Accept", "application/sparql-results+json");
            req.send();
            req.onreadystatechange = function () {
                if (req.readyState == 4) {
                    if (req.status == 200) {

                        var res = eval("(" + req.responseText + ")");
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

        $("#queryButton button").click(function (e) {
            e.preventDefault();
            executeQuery();
        });

        $("#querySelector").change(function () {
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
                var id = "selector" + i;
                var selectorAux = $("#paramSelector").append("<select class=form-control id=" + id + ">");

                //populate the selector with its parameter values
                populateParametersSelector("#selector" + i, query["param" + i]);

                //assign onChange function, we pass the index of the option chosen
                $("#selector" + i).change(function (handler) {
                    //console.log("selectorOnChange for selector with id: " + handler.srcElement.attributes.id.value);
                    onSelectorChange(handler.srcElement.attributes.id.value.slice(-1));
                });

            }

        });





    }







};

