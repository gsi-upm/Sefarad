// New widget
var openlayersMap = {
    // Widget name.
    name: "Openlayers Map",
    // Widget description.
    description: "An Openlayers Map that shows shapes info",
    // Path to the image of the widget.
    img: "img/widgets/widgetMap.png",
    // Type of the widget.
    type: "openlayersMap",
    // Help display on the widget
    help: "OpenLayersMap help",
    // Category of the widget (1: textFilter, 2: numericFilter, 3: graph, 5:results, 4: other, 6:map)
    cat: 6,

    render: function () {
        var id = 'A' + Math.floor(Math.random() * 10001);
        var field = openlayersMap.field || "";
        vm.activeWidgetsRight.push({
            "id": ko.observable(id),
            "title": ko.observable(openlayersMap.name),
            "type": ko.observable(openlayersMap.type),
            "field": ko.observable(field),
            "collapsed": ko.observable(false),
            "showWidgetHelp": ko.observable(false),
            "help": ko.observable(openlayersMap.help)
        });

        openlayersMap.paint(id);
    },

    // paint: function (field, id, type) {  
    paint: function (id) {
        d3.select('#' + id).selectAll('div').remove();
        var div = d3.select('#' + id);
        div.attr("align", "center");

        //Create the map div
        var map_div = div.append("div")
            .attr("id", "openlayersmap")
            .attr("class", "olMap");

        openlayersMap.initopenlayersmap();

    },

    initopenlayersmap: function () {
        // if this is just a coverage or a group of them, disable a few items,
        // and default to jpeg format
        //Create the Openlayers Map
        var openlayersmap;
        var untiled;
        var tiled;
        var pureCoverage = false;
        var parcel = 'SmartOpenData:td_0201_mfe50';

        // pink tile avoidance
        OpenLayers.IMAGE_RELOAD_ATTEMPTS = 5;
        // make OL compute scale according to WMS spec
        OpenLayers.DOTS_PER_INCH = 25.4 / 0.28;

        format = 'image/png';
        if (pureCoverage) {
            document.getElementById('filterType').disabled = true;
            document.getElementById('filter').disabled = true;
            document.getElementById('antialiasSelector').disabled = true;
            document.getElementById('updateFilterButton').disabled = true;
            document.getElementById('resetFilterButton').disabled = true;
            document.getElementById('jpeg').selected = true;
            format = "image/jpeg";
        }

        var bounds = new OpenLayers.Bounds(
            58922.38499999978, 4637883.9998,
            192487.31350000037, 4726275.338900001
        );
        var options = {
            controls: [],
            maxExtent: bounds,
            maxResolution: 521.7380019531273,
            projection: "EPSG:2062",
            units: 'm'
        };
        openlayersmap = new OpenLayers.Map('openlayersmap', options);

        // setup tiled layer
        tiled = new OpenLayers.Layer.WMS(
            parcel + " - Tiled", "http://alpha.gsi.dit.upm.es:8080/geoserver/SmartOpenData/wms", {
                LAYERS: parcel,
                STYLES: '',
                format: format
            }, {
                buffer: 0,
                displayOutsideMaxExtent: true,
                isBaseLayer: true,
                yx: {
                    'EPSG:2062': false
                }
            }
        );

        // setup single tiled layer
        untiled = new OpenLayers.Layer.WMS(
            parcel + " - Untiled", "http://alpha.gsi.dit.upm.es:8080/geoserver/SmartOpenData/wms", {
                LAYERS: parcel,
                STYLES: '',
                format: format
            }, {
                singleTile: true,
                ratio: 1,
                isBaseLayer: true,
                yx: {
                    'EPSG:2062': false
                }
            }
        );

        openlayersmap.addLayers([tiled, untiled]);

        // build up all controls
        openlayersmap.addControl(new OpenLayers.Control.PanZoomBar({
            position: new OpenLayers.Pixel(2, 15)
        }));
        openlayersmap.addControl(new OpenLayers.Control.Navigation());
        openlayersmap.addControl(new OpenLayers.Control.Scale($('scale')));
        openlayersmap.addControl(new OpenLayers.Control.MousePosition({
            element: $('location')
        }));
        openlayersmap.zoomToExtent(bounds);
        //openlayersmap.zoomToMaxExtent();                

        // support GetFeatureInfo
        openlayersmap.events.register('click', openlayersmap, function (e) {
            var params = {
                REQUEST: "GetFeatureInfo",
                EXCEPTIONS: "application/vnd.ogc.se_xml",
                BBOX: openlayersmap.getExtent().toBBOX(),
                SERVICE: "WMS",
                INFO_FORMAT: 'text/html',
                QUERY_LAYERS: openlayersmap.layers[0].params.LAYERS,
                FEATURE_COUNT: 50,
                Layers: parcel,
                WIDTH: openlayersmap.size.w,
                HEIGHT: openlayersmap.size.h,
                format: format,
                styles: openlayersmap.layers[0].params.STYLES,
                srs: openlayersmap.layers[0].params.SRS
            };

            // handle the wms 1.3 vs wms 1.1 madness
            if (openlayersmap.layers[0].params.VERSION == "1.3.0") {
                params.version = "1.3.0";
                params.j = parseInt(e.xy.x);
                params.i = parseInt(e.xy.y);
            } else {
                params.version = "1.1.1";
                params.x = parseInt(e.xy.x);
                params.y = parseInt(e.xy.y);
            }

            // merge filters
            if (openlayersmap.layers[0].params.CQL_FILTER != null) {
                params.cql_filter = openlayersmap.layers[0].params.CQL_FILTER;
            }
            if (openlayersmap.layers[0].params.FILTER != null) {
                params.filter = openlayersmap.layers[0].params.FILTER;
            }
            if (openlayersmap.layers[0].params.FEATUREID) {
                params.featureid = openlayersmap.layers[0].params.FEATUREID;
            }
            OpenLayers.loadURL("http://alpha.gsi.dit.upm.es:8080/geoserver/SmartOpenData/wms", params, this, setHTML, setHTML);
            OpenLayers.Event.stop(e);
        });
    }
};