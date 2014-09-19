// Open Street Map Widget
var openStreetMap = {
    // Widget name.
    name: "Open Street Map",
    // Widget description.
    description: "Show data into an open street map",
    // Path to the image of the widget.
    img: "img/widgets/widgetMap.png",
    // Type of the widget.
    type: "openStreetMap",
    // Help display on the widget
    help: "OpenStreetMap help",
    // Category of the widget (1: textFilter, 2: numericFilter, 3: graph, 5:results, 4: other, 6:map)
    cat: 6,

    render: function() {
        var id = 'A' + Math.floor(Math.random() * 10001);
        var configid = 'A' + Math.floor(Math.random() * 10001);
        var field = widgetMap.field || "";
        vm.activeWidgetsRight.push({
            "id": ko.observable(id),
            "configid": ko.observable(configid),
            "title": ko.observable(widgetMap.name),
            "type": ko.observable(widgetMap.type),
            "field": ko.observable(field),
            "collapsed": ko.observable(false),
            "showWidgetHelp": ko.observable(false),
            "help": ko.observable(openlayersMap.help),
            "showWidgetConfiguration": ko.observable(false)
        });

        openStreetMap.paintConfig(configid);
        openStreetMap.paint(id);
    },

    paintConfig: function(configid) {
        d3.select('#' + configid).selectAll('div').remove();
        var div = d3.select('#' + configid);
        div.attr("align", "center");

    },

    paint: function(id) {
        d3.select('#' + id).selectAll('div').remove();
        var div = d3.select('#' + id);
        div.attr("align", "center");

        //Elements for showing
        if (vm.sparql) {
            data = vm.shownSparqlData();
        } else {
            data = vm.shownData();
        }

        //Create the map div
        var map_div = div.append("div")
            .attr("id", "map")
            .attr("class", "map");

        //Map configuration
        var maxZoom = 19;
        var baseUrl = "http://j.tile.openstreetmap.jp/{z}/{x}/{y}.png";
        var baseAttribution = 'Map data &copy; OpenStreetMap contributors, Tiles Courtesy of OpenStreetMap Japan';
        var subdomains = '1234';
        var clusterOptions = {
            showCoverageOnHover: false,
            maxClusterRadius: 50
        };
        var labelColumn = "title";
        var labelLatitude = "lat";
        var labelLongitude = "long";
        var opacity = 1.0;

        //Create the map
        var basemap = new L.TileLayer(baseUrl, {
            maxZoom: 19,
            attribution: baseAttribution,
            subdomains: subdomains,
            opacity: opacity
        });

        var center = new L.LatLng(0, 0);

        var map = new L.Map(map_div.node(), {
            center: center,
            zoom: 2,
            maxZoom: maxZoom,
            layers: [basemap]
        });

        var popupOpts = {
            autoPanPadding: new L.Point(5, 50),
            autoPan: true
        };

        var hits = 0;
        var total = 0;
        var filterString;
        var markers = new L.MarkerClusterGroup();
        var dataJson;

        var typeAheadSource = [];

        var points = L.geoJson(null, {
            onEachFeature: function(feature, layer) {
                var popup = '<div class="popup-content"><table class="table table-striped table-bordered table-condensed">';
                for (var clave in feature.properties) {
                    var title = clave;
                    var attr = feature.properties[clave];
                    if (title == labelColumn) {
                        layer.bindLabel(feature.properties[clave], {
                            className: 'map-label'
                        });
                    }
                    if (typeof attr === 'string' && attr.indexOf('http') === 0) {
                        attr = '<a target="_blank" href="' + attr + '">' + attr + '</a>';
                    }
                    if (attr) {
                        popup += '<tr><th>' + title + '</th><td>' + attr + '</td></tr>';
                    }
                }
                popup += "</table></popup-content>";
                layer.bindPopup(popup, popupOpts);
            },
            filter: function(feature, layer) {
                total += 1;
                if (!filterString) {
                    hits += 1;
                    return true;
                }
                var hit = false;
                var lowerFilterString = filterString.toLowerCase().strip();
                $.each(feature.properties, function(k, v) {
                    var value = v.toLowerCase();
                    if (value.indexOf(lowerFilterString) !== -1) {
                        hit = true;
                        hits += 1;
                        return false;
                    }
                });
                return hit;
            }
        });

        if (typeof(String.prototype.strip) === "undefined") {
            String.prototype.strip = function() {
                return String(this).replace(/^\s+|\s+$/g, '');
            };
        }

        map.addLayer(markers);

        $(document).ready( function() {
            $('body').modalmanager('loading').find('.modal-scrollable').off('click.modalmanager'); 
            console.log(query);
            qr = sendQuery(endpoint, query);
            qr.fail(
                function (xhr, textStatus, thrownError) {
                    $('body').modalmanager('removeLoading');
                    alert("Error: A '" + textStatus+ "' occurred.");
                }
            );
            qr.done(
                function (json) {
                    dataJson = [];
                    for(var i=0;i<json.results.bindings.length;i++) {
                        dataJson.push(openStreetMap._convSparqlJsonToGeoJson(json.results.bindings[i]));
                    }
                    typeAheadSource = openStreetMap.ArrayToSet(typeAheadSource);
                    $('#filter-string').typeahead({source: typeAheadSource});

                    $('body').modalmanager('removeLoading');
                    $('body').removeClass('modal-open');
                    openStreetMap.addSparqlJsonMarkers();
                }
            );

            $("#clear").click(function(evt){
                evt.preventDefault();
                $("#filter-string").val("").focus();
                openStreetMap.addSparqlJsonMarkers();
            });

        });

    },
        
    ArrayToSet: function(a) {
        var temp = {};
        for (var i = 0; i < a.length; i++)
            temp[a[i]] = true;
        var r = [];
        for (var k in temp)
            r.push(k);
        return r;
    },

    _getProperties : function(data) {
        var props = {};
        jQuery.each(data, function(key, value) {
            props[key] = value.value;

            var item = value.value.replace(/"/g, '');
            if (item.indexOf("http") !== 0 && isNaN(parseFloat(item))) {
                typeAheadSource.push(item);
                var words = item.split(/\W+/);
                for (var k = words.length - 1; k >= 0; k--) {
                    typeAheadSource.push(words[k]);
                }
            }
        });
        return props;
    },

    _convSparqlJsonToGeoJson : function(data) {
        var json = {};
        json["type"] = "Feature";
        json["properties"] = _openStreetMap.getProperties(data);
        json["geometry"] = {
            "type": "Point"
        };
        json["geometry"]["coordinates"] = [data[labelLongitude].value, data[labelLatitude].value];
        return json;
    },

    addSparqlJsonMarkers : function() {
        hits = 0;
        total = 0;


        map.removeLayer(markers);
        points.clearLayers();

        markers = new L.MarkerClusterGroup(clusterOptions);
        points.addData(dataJson);
        markers.addLayer(points);

        map.addLayer(markers);
        try {
            var bounds = markers.getBounds();
            if (bounds) {
                map.fitBounds(bounds);
            }
        } catch (err) {
            // pass
        }
        if (total > 0) {
            $('#search-results').html("Showing " + hits + " of " + total);
        }
        return false;
    }
};

var endpoint = "http://linkedgeodata.org/sparql";
var query = (function () {/*

PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX geo: <http://www.w3.org/2003/01/geo/wgs84_pos#>

SELECT DISTINCT ?link ?title ?lat ?long 
WHERE {
  ?link rdfs:label ?title; 
    geo:lat ?lat; 
    geo:long ?long .

  FILTER (
  
    ?lat > 40.52 && ?lat <  40.92 &&
    ?long > -116.56 && ?long < -85.36 &&
    lang(?title) = 'en'
  )
}

*/}).toString().match(/\n([\s\S]*)\n/)[1];

var sendQuery = function (e,q,f,t) {
    if (typeof f==="undefined") f="json";
    if (typeof t==="undefined") t=f;
    var promise;

    if (window.XDomainRequest) {
        
        promise = (
            function () {
                /*global XDomainRequest */
                var qx = $.Deferred(),
                xdr = new XDomainRequest(),
                url = e +
                "?query=" + q +
                "&output=" + t;
                xdr.open("GET", url);
                xdr.onload = function () {
                    var data;
                    if (myEndpointOutput === qfXML) {
                        data = $.parseXML(xdr.responseText);
                    } else {
                        data = $.parseJSON(xdr.responseText);
                    }
                    qx.resolve(data);
                };
                xdr.send();
                return qx.promise();
            }()
        );
    } else {
        promise = $.ajax({
            url: e,
            headers: {
                "Accept": "application/sparql-results+json"
            },
            data: {
                query: q,
                output: f
            },
            dataType: t
        });
    }
    return promise;
}