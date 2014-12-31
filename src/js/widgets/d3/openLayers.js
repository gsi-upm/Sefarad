// Openlayers Map widget
var openLayers = {
    // Widget name.
    name: "Open Street Map",
    // Widget description.
    description: "An Openlayers Map that shows shapes info",
    // Path to the image of the widget.
    img: "img/widgets/widgetMap.png",
    // Type of the widget.
    type: "openLayers",
    // Help display on the widget
    help: 'This is an Openlayers map which can represent any geospatial and geometric information in GeoJSON format. This widget draws in a OSM every geometric information contained in the filtered data.',
    // Category of the widget (1: textFilter, 2: numericFilter, 3: graph, 5:results, 4: other, 6:map)
    cat: 6,

    render: function (loc) {

        if (loc != 'Left' && loc != 'Right') loc = 'Right';

        var id = 'A' + Math.floor(Math.random() * 10001);
        var configid = 'A' + Math.floor(Math.random() * 10001);
        var field = openLayers.field || "";
        var properties = {
            "id": ko.observable(id),
            "configid": ko.observable(configid),
            "title": ko.observable(openLayers.name),
            "type": ko.observable(openLayers.type),
            "field": ko.observable(field),
            "collapsed": ko.observable(false),
            "showWidgetHelp": ko.observable(false),
            "help": ko.observable(openLayers.help),
            "showWidgetConfiguration": ko.observable(false)
        };
        vm.addNewWidget(properties, loc);

        openLayers.paintConfig(configid);
        openLayers.paint(id);
    },

    paintConfig: function (configid) {
        d3.select('#' + configid).selectAll('div').remove();
        var div = d3.select('#' + configid);
        div.attr("align", "center");

    },

    paint: function (id) {
        //console.log('Painting Map');
        d3.select('#' + id).selectAll('div').remove();
        var div = d3.select('#' + id);
        div.attr("align", "center");

        //Elements for showing
        var data = vm.filteredData();


        //Update filtered polygons
        var geometries = new Array();
        var geojson = new Object();
        //supplied by sparql-geojson on https://github.com/erfgoed-en-locatie/sparql-geojson
        geojson = sparqlToGeoJSON(vm.filteredData(), false);
        //console.log(geojson);

        //Create the map div
        var map_div = div.append("div")
            .attr("id", "layersmap")
            .attr("style", "height:400px");

        layersmap = new OpenLayers.Map('layersmap');

        //OpenStreetMap
        osm = new OpenLayers.Layer.OSM("");
        layersmap.addLayer(osm);

        // Transform polyons projection
        var geojson_format = new OpenLayers.Format.GeoJSON({
            internalProjection: layersmap.getProjectionObject().projCode,
            externalProjection: new OpenLayers.Projection("EPSG:4326")
        });

        var vector_layer = new OpenLayers.Layer.Vector('polygonslayer', {
            strategies: [new OpenLayers.Strategy.CenteredCluster({distance: 50, threshold: 3})]
        });
        layersmap.addLayer(vector_layer);

        selectControl = new OpenLayers.Control.SelectFeature(vector_layer,{
            onSelect: openLayers.onFeatureSelect,
            onUnselect: openLayers.onFeatureUnselect
        });

        vector_layer.addFeatures(geojson_format.read(geojson));

        layersmap.addControl(selectControl);
        layersmap.addControl(new OpenLayers.Control.MousePosition());
        selectControl.activate();

        layersmap.zoomToExtent(vector_layer.getDataExtent());

        // markers
        var markers = new OpenLayers.Layer.Markers("Markers");
        var size = new OpenLayers.Size(21, 25);
        var offset = new OpenLayers.Pixel(-(size.w / 2), -size.h);
        var icon = new OpenLayers.Icon('http://dev.openlayers.org/img/marker.png', size, offset);

        try {
            $.each(data, function (index, item) {
                markers.addMarker(new OpenLayers.Marker(new OpenLayers.LonLat(item.longitude.value(), item.latitude.value()).transform('EPSG:4326', layersmap.getProjectionObject().projCode), icon.clone()));
            });
            layersmap.addLayer(markers);
            layersmap.zoomToExtent(markers.getDataExtent());
        } catch (e) {
            //console.log("Open layer couldn't render the map. Probably there's no data to render.");
        }
    },

    onPopupClose: function (evt) {
        selectControl.unselect(selectedFeature);
    },

    onFeatureSelect: function (feature) {
        selectedFeature = feature;
        if(feature.cluster != undefined){
            popup = new OpenLayers.Popup.FramedCloud("chicken",
                feature.geometry.getBounds().getCenterLonLat(),
                null,
                "<div style='font-size:1em'>" + feature.cluster.length + " items" + "<br>" + "</div>",
                null,
                true,
                openLayers.onPopupClose);
            feature.popup = popup;
        }else{
            popup = new OpenLayers.Popup.FramedCloud("chicken",
                feature.geometry.getBounds().getCenterLonLat(),
                null,
                "<div style='font-size:1em'><strong>Name:</strong> " + feature.attributes.name.value() + "<br><strong>Area:</strong> " + feature.geometry.getArea() + "</div>",
                null,
                true,
                openLayers.onPopupClose);
            feature.popup = popup;
        }

        layersmap.addPopup(popup);
    },

    onFeatureUnselect: function (feature) {
        layersmap.removePopup(feature.popup);
        feature.popup.destroy();
        feature.popup = null;
    }
};

// Openlayers Map variables
var layersmap, drawControls, selectControl, selectedFeature;
var layer;