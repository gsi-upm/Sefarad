/**
 * Created by asaura on 5/02/15.
 */

var rawData = [];
var filteredData = [];

var datatable;
var nameDim;
var designationDim;

var map;

var filterone;

function print_filter(filter){
    var f=eval(filter);
    if (typeof(f.length) != "undefined")
    {

    }else
    {

    }
    if (typeof(f.top) != "undefined")
    {
        f=f.top(Infinity);
    }else
    {

    }
    if (typeof(f.dimension) != "undefined")
    {
        f=f.dimension(function(d) {
            return "";
        }).top(Infinity);
    }else
    {

    }
    console.log(filter+"("+f.length+") = "+JSON.stringify(f).replace("[","[\n\t").replace(/}\,/g,"},\n\t").replace("]","\n]"));
}



$( document ).ready(function() {

    //console.log( "ready!" );

    var testQuery = "select distinct ?universityResource ?countryResource ?cityResource ?university ?city ?country ?latitude ?longitude where { { ?universityResource <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://dbpedia.org/ontology/University> ; <http://dbpedia.org/ontology/country> ?countryResource ; <http://dbpedia.org/ontology/country> <http://dbpedia.org/resource/Spain> ; <http://dbpedia.org/ontology/city> ?cityResource ; <http://www.w3.org/2000/01/rdf-schema#label> ?university ; <http://www.w3.org/2003/01/geo/wgs84_pos#lat> ?latitude ; <http://www.w3.org/2003/01/geo/wgs84_pos#long> ?longitude . ?countryResource <http://www.w3.org/2000/01/rdf-schema#label> ?country . ?cityResource <http://www.w3.org/2000/01/rdf-schema#label> ?city } UNION { ?universityResource <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://dbpedia.org/ontology/University> ; <http://dbpedia.org/ontology/country> ?countryResource ; <http://dbpedia.org/ontology/country> <http://dbpedia.org/resource/France> ; <http://dbpedia.org/ontology/city> ?cityResource ; <http://www.w3.org/2000/01/rdf-schema#label> ?university ; <http://www.w3.org/2003/01/geo/wgs84_pos#lat> ?latitude ; <http://www.w3.org/2003/01/geo/wgs84_pos#long> ?longitude . ?countryResource <http://www.w3.org/2000/01/rdf-schema#label> ?country . ?cityResource <http://www.w3.org/2000/01/rdf-schema#label> ?city } FILTER ( lang(?university) = 'en' && lang(?country) = 'en' && lang(?city) = 'en') }";
    //executeSPARQLquery(testQuery, "http://dbpedia.org/sparql", 1); //universities data to stream 0

    getPolygonsFromEuro(); //slovakian data to rawData

    //configure widgets:
    initializeWidgets();






//    document.getElementById("makeDataTable").onclick = function ()
//    {
//        alldata = dateDim.top(Infinity);
//        RefreshTable(alldata);
//    };
//
//    datatable = $(".dc-data-table").dataTable({
//
//        "bDeferRender": true,
//        // Restricted data in table to 10 rows, make page load faster
//// Make sure your field names correspond to the column headers in your data file. Also make sure to have default empty values.
//        "aaData": dateDim.top(10),
//
//        "bDestroy": true,
//        "aoColumns": [
//            { "mData": "date", "sDefaultContent": " " },
//            { "mData": "http_200", "sDefaultContent": " " },
//            { "mData": "http_302", "sDefaultContent": " " },
//            { "mData": "total", "sDefaultContent": " " }
//
//
//        ]
//    });
//
//    function RefreshTable(alldata) {
//        datatable.fnClearTable();
//        datatable.fnAddData(alldata);
//        datatable.fnDraw();
//    };
    //dc.renderAll();












});







var initializeWidgets = function () {

    resultsWidget.widgetDiv = "resultsWidget";
    resultsWidget.data = filteredData;
    resultsWidget.init();

    //-------------------------------------

    donutChartWidget.widgetDiv = "donnutChartWidget";
    donutChartWidget.param = "designation";
    donutChartWidget.data = filteredData;
    donutChartWidget.init();

    //-------------------------------------

    facetedSearchWidget.data = transformData(rawData);

    facetedSearchWidget.item_template = '<div class="item box box-solid bg-light-blue">' +
    '<h4><%= obj.name %></h4>' +
    '<h4><%= obj.designationScheme %></h4>' +
    '</div>';

    facetedSearchWidget.settings = {
        items: [],
        facets: {
            'designation': 'Designation',
            'designationScheme': 'Designation Scheme'
        },
        resultSelector: '#results',
        facetSelector: '#facets',
        state: {
            orderBy: false,
            filters: {}
        },
        resultTemplate: facetedSearchWidget.item_template,
        orderByOptions: {'designation': 'Designation', 'designationScheme': 'Designation Scheme'}
    };

    facetedSearchWidget.init();

    //-------------------------------------

    openLayersMapWidget.widgetDiv = 'mapDiv';
    openLayersMapWidget.data = rawData; //TO-DO: when filtering is repaired, set this to filteredData
    openLayersMapWidget.init();


    //render the loading screen for the three dc widgets:
    $("#crossFilterDCTest2").append('<div class="overlay"> </div> <div class="loading-img"> </div>');
    $("#crossFilterDCTest4").append('<div class="overlay"> </div> <div class="loading-img"> </div>');
    $("#leafletMapWidget").append('<div class="overlay"> </div> <div class="loading-img"> </div>');
};

var updateWidgets = function () {

    console.log("update widgets");
    donutChartWidget.update();
    resultsWidget.update();

    openLayersMapWidget.data = rawData;
    openLayersMapWidget.update();

};


var newDataReceived = function () {

    //Delete loading screen
    $(".overlay").remove();
    $(".loading-img").remove();

    var ndx = crossfilter(rawData);

    //add "total" filter as temporal value for cloropleth
    var idGen = 0
    rawData.forEach(function(d) {
        d.total= 1;
        d.id = idGen;
        idGen++;
    });

    nameDim = ndx.dimension(function(d) {return d.name.value;});
    designationDim = ndx.dimension(function(d) {return d.designation.value;});
    idDim = ndx.dimension(function(d) {return d.id;});

    var numDesignations = designationDim.group().reduceCount();
    var numNames = nameDim.group().reduceCount();
    var numId = idDim.group().reduceCount();

    var leafletchart = dc.leafletChoroplethChart("#leafletMap")
        .dimension(idDim)
        .group(numId)
        .center([42.69,25.42])
        .zoom(7)
        .geojson(sparqlToGeoJSON(rawData, false))
        .colors(['#fff7f3', '#fde0dd', '#fcc5c0', '#fa9fb5', '#f768a1', '#dd3497', '#ae017e', '#7a0177', '#49006a'])
        .colorDomain(function() {
            return [dc.utils.groupMin(this.group(), this.valueAccessor()),
                dc.utils.groupMax(this.group(), this.valueAccessor())];
        })
        .colorAccessor(function(d,i) {
            return d.value;
        })
        .featureKeyAccessor(function(feature) {
            return feature.properties.id;
        })
        .renderPopup(true)
        .popup(function(d,feature) {
            return feature.properties.name.value;
        });




    //var designationChart   = dc.pieChart("#chart-ring-year");
    //designationChart
    //    .width(200).height(200)
    //    .dimension(designationDim)
    //    .group(numDesignations)
    //    .innerRadius(30);

    //var nameChart   = dc.pieChart("#chart-ring-name");
    //nameChart
    //    .width(200).height(200)
    //    .dimension(nameDim)
    //    .group(numNames)
    //    .innerRadius(30);




    $("dc-element")[0].crossfilterObject = ndx;
    $("dc-element")[0].dimension = designationDim;
    $("dc-element")[0].group = numDesignations;
    $("dc-element")[0].init();


    dc.renderAll();



    facetedSearchWidget.data = transformData(rawData);
    facetedSearchWidget.update();
};


//Smart Open Data Query
var getPolygonsFromEuro = function () {

    var polygonsfeuro_query = 'PREFIX drf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> PREFIX j.0: <http://inspire.jrc.ec.europa.eu/schemas/gn/3.0/> PREFIX j.1: <http://inspire.jrc.ec.europa.eu/schemas/ps/3.0/> PREFIX j.2: <http://inspire.jrc.ec.europa.eu/schemas/base/3.2/> PREFIX j.3: <http://www.opengis.net/ont/geosparql#> SELECT * WHERE { SERVICE <http://localhost:3030/slovakia/query> { ?res j.3:hasGeometry ?fGeom . ?fGeom j.3:asWKT ?fWKT . ?res j.1:siteProtectionClassification ?spc . ?res j.1:LegalFoundationDate ?lfd . ?res j.1:LegalFoundationDocument ?lfdoc . ?res j.1:inspireId ?inspire . ?res j.1:siteName ?sitename . ?sitename j.0:GeographicalName ?gname . ?gname j.0:spelling ?spelling . ?spelling j.0:SpellingOfName ?spellingofname . ?spellingofname j.0:text ?name . ?inspire j.2:namespace ?namespace . ?inspire j.2:namespace ?localId . ?res j.1:siteDesignation ?siteDesignation . ?siteDesignation j.1:percentageUnderDesignation ?percentageUnderDesignation . ?siteDesignation j.1:designation ?designation . ?siteDesignation j.1:designationScheme ?designationScheme . } } LIMIT 100';
    var temporal = 'http://demos.gsi.dit.upm.es/fuseki/slovakia/query?query=' + encodeURIComponent(polygonsfeuro_query);
    var req = new XMLHttpRequest();
    req.open("GET", temporal, true);
    var params = encodeURIComponent(polygonsfeuro_query);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.setRequestHeader("Accept", "application/sparql-results+json");
    //req.setRequestHeader("Content-length", params.length);
    //req.setRequestHeader("Connection", "close");
    req.send();
    console.log("polygons query sent");
    req.onreadystatechange = function () {
        if (req.readyState == 4) {
            if (req.status == 200) {
                console.log("polygons query response received");
                var res = eval("(" + req.responseText + ")");
                var data = JSON.stringify(res.results.bindings);
                rawData = JSON.parse(data);

                newDataReceived();

            } else {
            }
        }
    };
    return false;
};



//SPARQL query function
var executeSPARQLquery = function (_query, endpoint) {

    $.ajax({
        type: 'GET',
        url: endpoint,
        data: {
            query: _query,
            output: 'json',
            format: 'json',
            debug: 'on',
            timeout: '0'
        },
        crossDomain: true,
        dataType: 'jsonp',
        beforeSend: function () {
            //$('#loading').show();
            console.log('SPARQL query sent');
        },
        complete: function () {
            //console.log('SPARQL query completed');
            //$('#loading').hide();
        },
        success: function (allData) {
            console.log('SPARQL Query success');

            rawData = JSON.parse(JSON.stringify(allData.results.bindings));

            //ko.mapping.fromJSON(data, self.rawData[streamNumber]);

            //process all data giving each item an unique id
            //self.giveUniqueIdentifier(self.rawData[streamNumber]());

            newDataReceived();
        },
        error: function () {
            console.log('SPARQL Query failed');
        }
    });
};

var transformData = function (data) {
    var auxArray = [];
    for (i = 0; i < data.length; i++) {
        auxArray[i] = [];
        var j = 0;

        for (prop in data[i]) {
            if (!data[i].hasOwnProperty(prop)) {
                //The current property is not a direct property of p
                continue;
            }
            //Do your logic with the property here
            auxArray[i][prop] = data[i][prop].value;

            j++;
        }

    }
    return auxArray;
};