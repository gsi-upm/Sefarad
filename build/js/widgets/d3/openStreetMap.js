// New widget
var openStreetMap = {
    // Widget name.
    name: "openStreetMap",
    // Widget description.
    description: "description",
    // Path to the image of the widget.
    img: "img/widgets/widgetMap.png",
    // Type of the widget.
    type: "openStreetMap",
    // Help display on the widget
    help: "help",
    // Category of the widget (1: textFilter, 2: numericFilter, 3: graph, 5:results, 4: other, 6:map)
    cat: 6,

    render: function() {
        var id = 'A' + Math.floor(Math.random() * 10001);
        var configid = 'A' + Math.floor(Math.random() * 10001);
        var field = openStreetMap.field || "";
        vm.activeWidgetsRight.push({
            "id": ko.observable(id),
            "configid": ko.observable(configid),
            "title": ko.observable(openStreetMap.name),
            "type": ko.observable(openStreetMap.type),
            "field": ko.observable(field),
            "collapsed": ko.observable(false),
            "showWidgetHelp": ko.observable(false),
            "help": ko.observable(openStreetMap.help),
            "showWidgetConfiguration": ko.observable(false)

        });

        openStreetMap.paintConfig(configid);
        openStreetMap.paint(id);
    },

    paintConfig: function (configid) {
        d3.select('#' + configid).selectAll('div').remove();
        var div = d3.select('#' + configid);
        div.attr("align", "center");

    },

    paint: function(id) {
        d3.select('#' + id).selectAll('div').remove();
        var div = d3.select('#' + id);
        div.attr("align", "center");

        var map_div = div.append("div")
            .attr("id", "openmap")
            .attr("style", "height:400px");        

        map = new OpenLayers.Map(map_div.node(), {
                // Resoluties (pixels per meter) van de zoomniveaus:
                resolutions: [3440.64, 1720.32, 860.16, 430.08, 215.04, 107.52, 53.76, 26.88, 13.44, 6.72, 3.36, 1.68, 0.84, 0.42, 0.21],
                //units: 'm',
                controls: [
                    new OpenLayers.Control.TouchNavigation({
                        dragPanOptions: {
                            enableKinetic: true
                        }
                    }),
                    new OpenLayers.Control.MousePosition({
                        prefix: '<a target="_blank" ' +
                            'href="http://spatialreference.org/ref/epsg/4326/">' +
                            'EPSG:4326</a> coordinates: ',
                        separator: ' | ',
                        numDigits: 2
                    }),
                    new OpenLayers.Control.PanZoom(),
                    new OpenLayers.Control.Navigation()
                    
                ],
                projection: new OpenLayers.Projection("EPSG:3857"),
                displayProjection: new OpenLayers.Projection("EPSG:4326")       
            });

        //OpenStreetMap
        osm = new OpenLayers.Layer.OSM("");

        //Layer style for sparql results
        var vector_style = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default']);
        vector_style.strokeWidth = 2;
        vector_style.fillOpacity = 1;
        vector_style.strokeColor = 'red';

        parcels_vector_layer = new OpenLayers.Layer.Vector("Filter1", {
            format: new OpenLayers.Format.GeoJSON({
                internalProjection: new OpenLayers.Projection("EPSG:3857"),
                externalProjection: new OpenLayers.Projection("EPSG:4326")
            }),
            styleMap: new OpenLayers.StyleMap(vector_style),
            eventListeners: {
                'featureselected': function(evt) {
                    var feature = evt.feature;
                    var featuretext = "";
                    var featuretext1 = "information to show";
                    $.each(feature.attributes, function(key, value) {
                        if (feature.attributes[key].datatype != "http://www.opengis.net/ont/geosparql#wktLiteral") {
                            featuretext = featuretext +
                                key + ": " +
                                feature.attributes[key].value + " " + "<br>";
                        }
                    });
                    var popup = new OpenLayers.Popup.FramedCloud(
                        "popup",
                        feature.geometry.getBounds().getCenterLonLat(),
                        null,
                        featuretext1,
                        null,
                        true
                    );
                    feature.popup = popup;
                    map.addPopup(popup);
                },
                'featureunselected': function(evt) {
                    var feature = evt.feature;
                    map.removePopup(feature.popup);
                    feature.popup.destroy();
                    feature.popup = null;
                }
            }
        });

        finds_vector_layer = new OpenLayers.Layer.Vector("Filter2", {
            format: new OpenLayers.Format.GeoJSON({
                internalProjection: new OpenLayers.Projection("EPSG:3857"),
                externalProjection: new OpenLayers.Projection("EPSG:4326")
            }),
            eventListeners: {
                'featureselected': function(evt) {
                    var feature = evt.feature;
                    var featuretext = "";
                    $.each(feature.attributes, function(key, value) {
                        if (feature.attributes[key].datatype != "http://www.opengis.net/ont/geosparql#wktLiteral") {
                            featuretext = featuretext +
                                key + ": " +
                                feature.attributes[key].value + " " + "<br>";
                        }
                    });
                    var popup = new OpenLayers.Popup.FramedCloud(
                        "popup",
                        feature.geometry.getBounds().getCenterLonLat(),
                        null,
                        featuretext,
                        null,
                        true
                    );
                    feature.popup = popup;
                    map.addPopup(popup);
                },
                'featureunselected': function(evt) {
                    var feature = evt.feature;
                    map.removePopup(feature.popup);
                    feature.popup.destroy();
                    feature.popup = null;
                }
            }
        });

        map.addLayers([osm, parcels_vector_layer, finds_vector_layer]);

        map.setCenter(
            new OpenLayers.LonLat(-80.6, 35.1).transform(
                new OpenLayers.Projection("EPSG:4326"),
                map.getProjectionObject()
            ),
            13
        );

        map.events.on({
            "moveend": function() {
                zoomSPARQL(map.getExtent().transform(map.projection, map.displayProjection).toGeometry().toString());
                document.getElementById('resultstotal').innerHTML = "Just a minute";
            }
        });

        openStreetMap.updatePolygon();
    },

    updatePolygon: function() {
        console.log("entre aqui");

        var jsonfile = new XMLHttpRequest();
        jsonfile.open("GET", "http://localhost:3000/smartopendata.json", true);
        jsonfile.onreadystatechange = function() {
            if (jsonfile.readyState == 4) {
                if (jsonfile.status == 200) {
                    console.log("json leido");
                    var geojson = new Object();
                    geojson = JSON.parse(jsonfile.responseText);

                    $('#parcels-geojson-result').val(JSON.stringify(geojson));
                    parcels_vector_layer.destroyFeatures();
                    var geojson_format = new OpenLayers.Format.GeoJSON({
                        internalProjection: new OpenLayers.Projection("EPSG:3857"),
                        externalProjection: new OpenLayers.Projection("EPSG:4326")
                    });

                    parcels_vector_layer.addFeatures(geojson_format.read(geojson));
                }
            }
        };
        jsonfile.send(null);
    }
};

var selectControl, selectedFeature, popup, feature, map, osm, parcels_vector_layer, finds_vector_layer;
OpenLayers.IMAGE_RELOAD_ATTEMPTS = 3;
OpenLayers.Util.onImageLoadErrorColor = "transparent";