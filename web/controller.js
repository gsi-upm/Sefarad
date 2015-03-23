/**
 * Created by asaura on 27/02/15.
 */

var rawData = [];
var queryEndPoint = 'http://alpha.gsi.dit.upm.es:3030/slovakiarefined/query';

$( document ).ready(function() {

    //execute required queries:
    getPolygonsFromEuro();

    //initialize widgets:
    initializeWidgets();

});

var initializeWidgets = function () {

    //render the loading screen for each widget (they must have the 'widget' class in their outer div):
    $(".widget").append('<div class="overlay"><i class="fa fa-refresh fa-spin"></i></div>');

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
    var designationDim = ndx.dimension(function(d) {return d.designation.value;});
    var numDesignations = designationDim.group().reduceCount();
    var idDim = ndx.dimension(function(d) {return d.id;});
    var numId = idDim.group().reduceCount();

    var nameDim = ndx.dimension(function(d) {return d.name.value;});
    var numNames = nameDim.group().reduceCount();

    //These lines will have to be done attending to the settings section of the object
    //If not set yet, initialize with default options (first dimension and group of the first crossfilter object)

    var dcElements = $(".dc-element");
    for (var i = 0; i < dcElements.length; i++) {

        if (dcElements[i].tagName == "LEAFLET-MAP")
        {
            dcElements[i].crossfilter = ndx;
            dcElements[i].dimension = idDim;
            dcElements[i].group = numId;
            dcElements[i].geoJSON = rawData;
            dcElements[i].init();
        };
        if (dcElements[i].tagName == "PIE-CHART")
        {
            dcElements[i].crossfilter = ndx;
            dcElements[i].dimension = designationDim;
            dcElements[i].group = numDesignations;
            dcElements[i].geoJSON = rawData;
            dcElements[i].init();
        };

        if (dcElements[i].tagName == "LINE-CHART")
        {
            dcElements[i].crossfilter = ndx;
            dcElements[i].dimension = designationDim;
            dcElements[i].group = numDesignations;
            dcElements[i].geoJSON = rawData;
            dcElements[i].init();
        };

        if (dcElements[i].tagName == "SORTABLE-TABLE")
        {
            dcElements[i].crossfilter = ndx;
            dcElements[i].dimension = nameDim;
            dcElements[i].group = numNames;
            dcElements[i].geoJSON = rawData;

            //var data = transformData(rawData);
            //dcElements[i].data = data;

            dcElements[i].init();
        };

        if (dcElements[i].tagName == "FACETED-SEARCH")
        {
            dcElements[i].crossfilter = ndx;

            dcElements[i].params = ["designation", "designationScheme"];


            //var data = transformData(rawData);
            //dcElements[i].data = data;

            dcElements[i].init();
        };


    }






    dc.renderAll();
};


//Smart Open Data Query
var getPolygonsFromEuro = function () {

    var polygonsfeuro_query = "PREFIX drf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> PREFIX j.0: <http://inspire.jrc.ec.europa.eu/schemas/gn/3.0/> PREFIX j.1: <http://inspire.jrc.ec.europa.eu/schemas/base/3.2/> PREFIX j.2: <http://inspire.jrc.ec.europa.eu/schemas/base/3.3/> PREFIX j.3: <http://www.opengis.net/ont/geosparql#> PREFIX j.4: <http://inspire.jrc.ec.europa.eu/schemas/ps/3.0/> SELECT * WHERE { ?res j.3:hasGeometry ?fGeom . ?fGeom j.3:asWKT ?fWKT . ?res j.4:siteProtectionClassification ?spc . ?res j.4:LegalFoundationDate ?lfd . ?res j.4:LegalFoundationDocument ?lfdoc . ?res j.4:inspireId ?inspire . ?res j.4:siteName ?sitename . ?res j.2:habitat ?habitat . ?res j.2:specie ?specie . ?res j.2:lat ?lat. ?res j.2:long ?long . ?res j.2:site_type ?site_type . ?res j.2:hasfactsheet ?hasfactsheet . ?res j.2:area ?area . ?res j.2:release_id ?release_id . ?sitename j.0:GeographicalName ?gname . ?gname j.0:spelling ?spelling . ?spelling j.0:SpellingOfName ?spellingofname . ?spellingofname j.0:text ?name . ?inspire j.1:namespace ?namespace . ?inspire j.1:localId ?localId . ?res j.4:siteDesignation ?siteDesignation . ?siteDesignation j.4:percentageUnderDesignation ?percentageUnderDesignation . ?siteDesignation j.4:designation ?designation . ?siteDesignation j.4:designationScheme ?designationScheme . } LIMIT 10 ";
    var temporal = queryEndPoint + '?query=' + encodeURIComponent(polygonsfeuro_query);
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



var transformData = function (data) {
    var auxArray = [];

    for (i = 0; i < data.length; i++) {
        auxArray[i] = {};
        var j = 0;

        for (prop in data[i]) {
            if (!data[i].hasOwnProperty(prop)) {
                //The current property is not a direct property of p
                continue;
            }
            //Do your logic with the property here
            //Do your logic with the property here
            if(prop == "name" || prop == "designation"){  //This must be removed. Add a "column selector" control in widget preferences.
                auxArray[i][prop] = data[i][prop].value;
            }

            j++;
        }

    }
    return auxArray;
};