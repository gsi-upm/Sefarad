/**
 * Created by asaura on 27/02/15.
 */

var rawData = [];
var queryEndPoint = 'http://alpha.gsi.dit.upm.es:3030/slovakiarefined/query';
var currentQuery = 'PREFIX drf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> PREFIX j.0: <http://inspire.jrc.ec.europa.eu/schemas/gn/3.0/> PREFIX j.1: <http://inspire.jrc.ec.europa.eu/schemas/ps/3.0/> PREFIX j.2: <http://inspire.jrc.ec.europa.eu/schemas/base/3.2/> PREFIX j.3: <http://www.opengis.net/ont/geosparql#> SELECT * WHERE { SERVICE <http://localhost:3030/slovakia/query> { ?res j.3:hasGeometry ?fGeom . ?fGeom j.3:asWKT ?fWKT . ?res j.1:siteProtectionClassification ?spc . ?res j.1:LegalFoundationDate ?lfd . ?res j.1:LegalFoundationDocument ?lfdoc . ?res j.1:inspireId ?inspire . ?res j.1:siteName ?sitename . ?sitename j.0:GeographicalName ?gname . ?gname j.0:spelling ?spelling . ?spelling j.0:SpellingOfName ?spellingofname . ?spellingofname j.0:text ?name . ?inspire j.2:namespace ?namespace . ?inspire j.2:namespace ?localId . ?res j.1:siteDesignation ?siteDesignation . ?siteDesignation j.1:percentageUnderDesignation ?percentageUnderDesignation . ?siteDesignation j.1:designation ?designation . ?siteDesignation j.1:designationScheme ?designationScheme . } } LIMIT 100';

var lastQuery = 'PREFIX drf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> PREFIX j.0: <http://inspire.jrc.ec.europa.eu/schemas/gn/3.0/> PREFIX j.1: <http://inspire.jrc.ec.europa.eu/schemas/ps/3.0/> PREFIX j.2: <http://inspire.jrc.ec.europa.eu/schemas/base/3.2/> PREFIX j.3: <http://www.opengis.net/ont/geosparql#> SELECT * WHERE { SERVICE <http://localhost:3030/slovakia/query> { ?res j.3:hasGeometry ?fGeom . ?fGeom j.3:asWKT ?fWKT . ?res j.1:siteProtectionClassification ?spc . ?res j.1:LegalFoundationDate ?lfd . ?res j.1:LegalFoundationDocument ?lfdoc . ?res j.1:inspireId ?inspire . ?res j.1:siteName ?sitename . ?sitename j.0:GeographicalName ?gname . ?gname j.0:spelling ?spelling . ?spelling j.0:SpellingOfName ?spellingofname . ?spellingofname j.0:text ?name . ?inspire j.2:namespace ?namespace . ?inspire j.2:namespace ?localId . ?res j.1:siteDesignation ?siteDesignation . ?siteDesignation j.1:percentageUnderDesignation ?percentageUnderDesignation . ?siteDesignation j.1:designation ?designation . ?siteDesignation j.1:designationScheme ?designationScheme . } } LIMIT 100';

var ndx;
var demo;

var widgetsReady = false;
var dataReady = false;

var numWidgets; //each widget will deduct one from this number, until it reaches zero. The all widgets will be ready.

var intervalID;

$( document ).ready(function() {

    widgetsReady = false;
    dataReady = false;


    //execute required queries:
    demo = $('body')[0].getAttribute('demo');
    if(demo == 'slovakia')
    {
        getPolygonsFromEuro();
    }
    if(demo == 'restaurants')
    {
        getRestaurantsRawData();
    }




    //render the loading screen for each widget (they must have the 'widget' class in their outer div):
    $(".widget").append('<div class="overlay"><i class="fa fa-refresh fa-spin"></i></div>');


    numWidgets = $(".dc-element").length;

    //initialize widgets:
    intervalID = setInterval(initializeWidgets, 500);

});

var initializeWidgets = function () {

    console.log("trying to initialize widgets");

    if(numWidgets == 0 && dataReady)
    {
        console.log("initialising widgets");

        //Delete loading screen
        $(".overlay").remove();
        $(".loading-img").remove();

        clearInterval(intervalID);

        ndx = crossfilter(rawData);
        var idGen = 0;

        if(demo == 'restaurants')
        {
            rawData.forEach(function(d) {
                var s = d.reservations.value.trim();
                var sub = s.substr(s.length - 3);
                d.newReservations = {};
                if (sub == 'Yes')
                {
                    d.newReservations.value = 'yes';
                } else
                {
                    d.newReservations.value = 'no';
                }

                var s = d.takeout.value.trim();
                var sub = s.substr(s.length - 2);
                d.newTakeout = {};
                if (sub == 'No')
                {
                    d.newTakeout.value = 'no';
                } else
                {
                    d.newTakeout.value = 'yes';
                }

                if(d.price.value == "")
                {
                    d.price.value = "€21-50";
                }

                var st = d.d.value;
                d.name = {};
                d.name.value = st.substr(st.lastIndexOf('/')+1, st.length).replace(/-/g," ");


            });
        }


        rawData.forEach(function(d) {
            d.total= 1;
            d.id = idGen;
            idGen++;
        });


        var dcElements = $(".dc-element");
        for (var i = 0; i < dcElements.length; i++) {
            dcElements[i].crossfilter = ndx;
            dcElements[i].geoJSON = rawData;
            dcElements[i].init();
        }

        dc.renderAll();
    }
};



//Smart Open Data Query
var getPolygonsFromEuro = function () {


    if (currentQuery != lastQuery) {

        var polygonsfeuro_query = currentQuery;
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

                    dataReady = true;
                    //newDataReceived();

                } else {
                }
            }
        };
        return false;
    }else
    {
        $.getJSON("assets/cache.json", function(result){
            console.log("polygons query response picked from local");
            var data = JSON.stringify(result);
            rawData = JSON.parse(data).results.bindings;
            dataReady = true;

            //newDataReceived();
        });
    }
};

var getRestaurantsRawData = function () {

    var restaurants_query = 'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> PREFIX geo: <http://www.opengis.net/ont/geosparql#> PREFIX geof: <http://www.opengis.net/def/function/geosparql/> PREFIX gnis: <http://smartopendata.gsi.dit.upm.es/rdf/gnis/> PREFIX gu: <http://smartopendata.gsi.dit.upm.es/rdf/gu/> PREFIX drf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> PREFIX dcterms: <http://purl.org/dc/terms/> PREFIX owl: <http://www.w3.org/2002/07/owl#> PREFIX dbpedia-owl: <http://dbpedia.org/property/> prefix text: <http://jena.apache.org/text#> PREFIX gp: <http://sefarad.gsi.dit.upm.es/rdf/gp/> PREFIX wgs84_pos: <http://www.w3.org/2003/01/geo/wgs84_pos#> SELECT * WHERE { SERVICE <http://localhost:3030/districts/query> { ?t gu:GEOCODIGO ?geocodigo . ?t gu:DESBDT ?district . ?t owl:sameAs ?dbpediaLink . } SERVICE <http://localhost:3030/restaurants/query> { ?d ?p ?o FILTER(REGEX(?o, ?district)) } SERVICE <http://localhost:3030/restaurants/query> { ?d gp:price ?price . ?d gp:foodtype ?foodtype . ?d gp:stars ?stars .  ?d gp:reservations ?reservations . ?d gp:takeout ?takeout . ?d wgs84_pos:latitude ?latitude  . ?d wgs84_pos:longitude ?longitude} } ';
    var temporal = 'http://demos.gsi.dit.upm.es/fuseki/restaurants/query?query=' + encodeURIComponent(restaurants_query);
    var req = new XMLHttpRequest();
    req.open("GET", temporal, true);
    var params = encodeURIComponent(restaurants_query);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.setRequestHeader("Accept", "application/sparql-results+json");
    //req.setRequestHeader("Content-length", params.length);
    //req.setRequestHeader("Connection", "close");
    req.send();
    console.log("restaurants query sent");
    req.onreadystatechange = function() {
        if (req.readyState == 4){
            if (req.status == 200) {
                console.log("restaurants query response received");
                var res = eval ("(" + req.responseText + ")");
                var data = JSON.stringify(res.results.bindings);

                rawData = JSON.parse(data);
                dataReady = true;

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