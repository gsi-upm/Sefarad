/**
 * Created by asaura on 27/02/15.
 */

var usersData = [];

var rawData = [];
var rawData2 = [];

var queryEndPoint = 'http://demos.gsi.dit.upm.es/fuseki/geo/query?query=';
var currentQuery = 'PREFIX drf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> PREFIX j.0: <http://inspire.jrc.ec.europa.eu/schemas/gn/3.0/> PREFIX j.1: <http://inspire.jrc.ec.europa.eu/schemas/ps/3.0/> PREFIX j.2: <http://inspire.jrc.ec.europa.eu/schemas/base/3.2/> PREFIX j.3: <http://www.opengis.net/ont/geosparql#> SELECT * WHERE { SERVICE <http://localhost:3030/slovakia/query> { ?res j.1:siteProtectionClassification ?spc . ?res j.1:LegalFoundationDate ?lfd . ?res j.1:LegalFoundationDocument ?lfdoc . ?res j.1:inspireId ?inspire . ?res j.1:siteName ?sitename . ?sitename j.0:GeographicalName ?gname . ?gname j.0:spelling ?spelling . ?spelling j.0:SpellingOfName ?spellingofname . ?spellingofname j.0:text ?name . ?inspire j.2:namespace ?namespace . ?inspire j.2:namespace ?localId . ?res j.1:siteDesignation ?siteDesignation . ?siteDesignation j.1:percentageUnderDesignation ?percentageUnderDesignation . ?siteDesignation j.1:designation ?designation . ?siteDesignation j.1:designationScheme ?designationScheme . } } LIMIT 1000';

var lastQuery = 'PREFIX drf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> PREFIX j.0: <http://inspire.jrc.ec.europa.eu/schemas/gn/3.0/> PREFIX j.1: <http://inspire.jrc.ec.europa.eu/schemas/ps/3.0/> PREFIX j.2: <http://inspire.jrc.ec.europa.eu/schemas/base/3.2/> PREFIX j.3: <http://www.opengis.net/ont/geosparql#> SELECT * WHERE { SERVICE <http://localhost:3030/slovakia/query> { ?res j.1:siteProtectionClassification ?spc . ?res j.1:LegalFoundationDate ?lfd . ?res j.1:LegalFoundationDocument ?lfdoc . ?res j.1:inspireId ?inspire . ?res j.1:siteName ?sitename . ?sitename j.0:GeographicalName ?gname . ?gname j.0:spelling ?spelling . ?spelling j.0:SpellingOfName ?spellingofname . ?spellingofname j.0:text ?name . ?inspire j.2:namespace ?namespace . ?inspire j.2:namespace ?localId . ?res j.1:siteDesignation ?siteDesignation . ?siteDesignation j.1:percentageUnderDesignation ?percentageUnderDesignation . ?siteDesignation j.1:designation ?designation . ?siteDesignation j.1:designationScheme ?designationScheme . } } LIMIT 100';

var ndx;
var ndx2;
var demo;

var widgetsReady = false;
var dataReady = false;

var tweetsReady = false;
var usersReady = false;

//var numWidgets; //each widget will deduct one from this number, until it reaches zero. The all widgets will be ready.

var intervalID;

$(document).load()
{
    var numWidgets;
    numWidgets = $(".dc-element").length;
}

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
    if(demo == 'places')
    {
        getPlacesRawData();
    }
    if(demo == 'tweets')
    {
        getTweetsData();
    }




    //render the loading screen for each widget (they must have the 'widget' class in their outer div):
    $(".widget").append('<div class="overlay"><i class="fa fa-refresh fa-spin"></i></div>');




    //initialize widgets:
    intervalID = setInterval(initializeWidgets, 500);

});


function calculateBounds (array)
{
    var Max = 0;
    var Min = Infinity;

    array.forEach(function(d) {
        if (d > Max) Max = d;
        if (d < Min) Min = d;
    });

    var intervalNumber = Math.ceil((Max - Min)/(24*3600*1000));
    var interval = (Max - Min)/intervalNumber;

};

Date.prototype.getWeekNumber = function(){
    var d = new Date(+this);
    d.setHours(0,0,0);
    d.setDate(d.getDate()+4-(d.getDay()||7));
    return Math.ceil((((d-new Date(d.getFullYear(),0,1))/8.64e7)+1)/7);
};

var initializeWidgets = function () {

    console.log("trying to initialize widgets");

    if(numWidgets == 0 && dataReady)
    {
        console.log("initialising widgets");

        var h = new function () {};

        //Delete loading screen
        $(".overlay").remove();
        $(".loading-img").remove();

        clearInterval(intervalID);


        var idGen = 0;

        if(demo == 'slovakia')
        {
            rawData.forEach(function(d) {
                d.total= 1;
                d.id = idGen;
                idGen++;
            });
        }

        if(demo == 'tweets')
        {
            //var dates = [];
            //rawData.forEach(function(d) {
            //    dates.push(d.created_at.$date);
            //});
            //
            //calculateBounds(dates);

            var hastags = [];
            rawData.forEach(function(d) {
                d.id = idGen;
                if (d.sentiment == undefined) d.sentiment = "neutral";

                aux = d.favorite_count;
                d.favorite_count = {};
                d.favorite_count.key = "favorite_count";
                d.favorite_count.value = aux;

                aux = d.retweet_count;
                d.retweet_count = {};
                d.retweet_count.key = "retweet_count";
                d.retweet_count.value = aux;

                aux = d.created_at.$date;
                d.created_at = {};
                d.created_at.key = "created_at";
                d.created_at.value = aux;

                var name = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                d.dayOfWeek = {};
                d.dayOfWeek.key = "dayOfWeek";
                d.dayOfWeek.value = name[new Date(aux).getDay()];

                var date = new Date (aux);
                date.setHours(0,0,0,0);

                d.created_at.value = date.getTime();


                aux = d.entities.hashtags;
                d.hashtags = {};
                d.hashtags.key = "hashtags";
                if (aux[0]!= undefined)
                {
                    d.hashtags.value = aux[0].text;
                }
                else
                {
                    d.hashtags.value = "ninguno";
                }

                if(hastags.indexOf(d.hashtags.value) == -1)
                    hastags.push(d.hashtags.value);
                idGen++;

                //var found = false;
                //
                //usersData.forEach(function(k) {
                //
                //    if (k.name == d.user.name)
                //    {
                //        found = true;
                //    }
                //});
                //
                //if(found == false) usersData.push(d.user);


            });
            //
            //var fill = d3.scale.category20();
            //cloud().size([1200, 300])
            //    .words(hastags.map(function(d) {
            //        return {text: d, size: 10 + Math.random() * 20};
            //    }))
            //    .padding(5)
            //    .rotate(function() { return ~~(Math.random() * 2) * 90; })
            //    .font("Impact")
            //    .fontSize(function(d) { return d.size; })
            //    .on("end", draw)
            //    .start();
            //function draw(words) {
            //    d3.select("#tag-cloud").append("svg")
            //        .attr("width", 1200)
            //        .attr("height", 300)
            //        .attr("id", "svg")
            //        .append("g")
            //        .attr("transform", "translate(600,150)")
            //        .selectAll("text")
            //        .data(words)
            //        .enter().append("text")
            //        .style("font-size", function(d) { return d.size + "px"; })
            //        .style("font-family", "Impact")
            //        .style("fill", function(d, i) { return fill(i); })
            //        .attr("text-anchor", "middle")
            //        .attr("transform", function(d) {
            //            return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            //        })
            //        .text(function(d) { return d.text; });
            //}

            //rawData2.forEach(function(d) {
            //    aux = d.followers_count;
            //    d.followers_count = {};
            //    d.followers_count.key = "followers_count";
            //    d.followers_count.value = aux;
            //
            //    aux = d.friends_count;
            //    d.friends_count = {};
            //    d.friends_count.key = "friends_count";
            //    d.friends_count.value = aux;
            //
            //    aux = d.favourites_count;
            //    d.favourites_count = {};
            //    d.favourites_count.key = "favourites_count";
            //    d.favourites_count.value = aux;
            //});
        }

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

                var st2 = d.foodtype.value;
                d.newFoodType = {};
                d.newFoodType.value = st2.substr(st2.lastIndexOf(',')+1, st.length).trim();

                var st3 = d.price.value.trim();
                var x = st3.lastIndexOf('€');
                d.newPrice = {};
                var rawQuantity = st3.substr(x+1, x+2);

                switch(rawQuantity) {
                    case "20":
                        d.newPrice.value = 15;
                        break;
                    case "21":
                        d.newPrice.value = 30;
                        break;
                    case "51":
                        d.newPrice.value = 70;
                        break;
                    default:
                        d.newPrice.value = 20;
                }

                rawData.forEach(function(d) {
                    d.total= 1;
                    d.id = idGen;
                    idGen++;
                });


            });
        }

        if(demo == 'places')
        {
            rawData.forEach(function(d) {

                var aux;

                aux = d.name;
                d.name = {};
                d.name.key = "name";
                d.name.value = aux;

                aux = d.category;
                d.category = {};
                d.category.key = "category";
                d.category.value = aux;

                aux = d.polarity;
                if (aux == undefined)
                {
                    aux = "not rated";
                }
                d.polarity = {};
                d.polarity.key = "polarity";
                d.polarity.value = aux;


                aux = d.address;
                if (aux == "")
                {
                    aux = "not specified"
                }
                d.address = {};
                d.address.key = "address";
                d.address.value = aux;

                aux = d.location;
                d.location = {};
                d.location.key = "location";
                d.location.value = aux;

                aux = d.numReviews;
                d.numReviews = {};
                d.numReviews.key = "numReviews";
                if(aux == undefined) aux = 0;
                d.numReviews.value = aux;


                var lat = d.lat;
                var lng = d.lng;
                d.geo = {};
                d.geo = lat+','+lng;


            });

            console.log("parse finished");
        }

        if (rawData2.length != 0)
        {
            ndx2 = crossfilter(rawData2);

            var dcElements = $(".dc-element");
            for (var i = 0; i < dcElements.length; i++) {
                if(dcElements[i].stream == 2){
                    dcElements[i].crossfilter = ndx2;
                    dcElements[i].geoJSON = rawData2;
                    dcElements[i].init();
                }
            }
        }

        ndx = crossfilter(rawData);

        var dcElements = $(".dc-element");
        for (var i = 0; i < dcElements.length; i++) {
            if(dcElements[i].stream != 2) {
                dcElements[i].crossfilter = ndx;
                dcElements[i].geoJSON = rawData;
                dcElements[i].init();
            }
        }

        dc.renderAll();
    }
};

function clearFilter(){
    var dcElements = $(".dc-element");
    for (var i = 0; i < dcElements.length; i++) {
        try{
            dcElements[i].clearFilter();
        } catch (e){

        }
    }
    dc.renderAll();
}



//Smart Open Data Query
var getPolygonsFromEuro = function () {

    if (currentQuery != lastQuery) {

        var polygonsfeuro_query = currentQuery;
        var temporal = queryEndPoint + encodeURIComponent(polygonsfeuro_query);
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


var getPlacesRawData = function () {

    $.getJSON("assets/totalReducedFinal.json", function(result){
        console.log("places data picked from local");
        //var data = JSON.stringify(result);
        //rawData = JSON.parse(data).results.bindings;
        rawData = result;
        dataReady = true;

        //newDataReceived();
    });
};


var getTweetsData = function () {

    $.getJSON("assets/tweets-visual.json", function(result){
        console.log("tweets data picked from local");
        //var data = JSON.stringify(result);
        //rawData = JSON.parse(data).results.bindings;
        rawData = result;
        tweetsReady = true;

        if(tweetsReady) dataReady = true;


        //newDataReceived();
    });
    //$.getJSON("assets/users.json", function(result){
    //    console.log("tweets data picked from local");
    //    //var data = JSON.stringify(result);
    //    //rawData = JSON.parse(data).results.bindings;
    //    rawData2 = result;
    //    usersReady = true;
    //
    //    if(tweetsReady && usersReady) dataReady = true;
    //
    //    //newDataReceived();
    //});
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