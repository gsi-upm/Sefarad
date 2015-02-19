/**
 * Created by asaura on 13/02/15.
 */

var openLayersMapWidget = {

    widgetDiv: "", //the id of the div where we are going to draw the chart
    data: {},

    map: {},
    mapview: {},

    init: function () {

        this.mapview = new ol.View({
            projection: 'EPSG:3857',
            center: [0, 0],
            zoom: 2
        });

        this.map = new ol.Map({
            layers: [
                new ol.layer.Tile({
                    style: 'Road',
                    source: new ol.source.MapQuest({layer: 'osm'})
                })
            ],
            target: 'mapDiv',
            controls: ol.control.defaults().extend([
                new ol.control.ScaleLine({
                    units: 'degrees'
                })
            ]),
            view: this.mapview,
            renderer: 'canvas'
        });


        //Each time the map widget is moved, its images are resized.
        $(".ui-sortable").sortable({
            stop: function (event, ui) {
                if (openLayersMapWidget.map != undefined) {
                    openLayersMapWidget.map.updateSize();
                }
            }
        });

    },


    update: function () {

        //clean the polygons layer:
        this.map.getLayers().forEach(function (lyr) {
            if (lyr.getProperties()['title'] == 'polygons') {
                openLayersMapWidget.map.removeLayer(lyr);

            }
            if (lyr.getProperties()['title'] == 'clusters') {
                openLayersMapWidget.map.removeLayer(lyr);

            }
        });

        //Update filtered polygons
        var geometries = new Array();
        var geojson = new Object();
        //supplied by sparql-geojson on https://github.com/erfgoed-en-locatie/sparql-geojson
        geojson = sparqlToGeoJSON(this.data, false);
        console.log(geojson);


        var vectorSource = new ol.source.GeoJSON({
            object: geojson,
            projection: 'EPSG:3857'
        });

        var vectorLayer = new ol.layer.Vector({
            title: 'polygons',
            source: vectorSource,
            projection: 'EPSG:4326'

        });


        this.map.addLayer(vectorLayer);


        //center the view in the layer's geometry:
        var extent = vectorLayer.getSource().getExtent();
        this.mapview.fitExtent(extent, this.map.getSize());


        var count = 20000;
        var features = new Array(count);
        var e = 4500000;
        for (var i = 0; i < count; ++i) {
            var coordinates = [2 * e * Math.random() - e, 2 * e * Math.random() - e];
            features[i] = new ol.Feature(new ol.geom.Point(coordinates));
        }

        var source = new ol.source.Vector({
            features: features
        });

        var clusterSource = new ol.source.Cluster({
            distance: 40,
            source: vectorSource
        });

        var styleCache = {};
        var clusters = new ol.layer.Vector({
            title: 'clusters',
            source: clusterSource,
            style: function (feature, resolution) {
                var size = feature.get('features').length;
                var style = styleCache[size];
                if (!style) {
                    style = [new ol.style.Style({
                        image: new ol.style.Circle({
                            radius: 10,
                            stroke: new ol.style.Stroke({
                                color: '#fff'
                            }),
                            fill: new ol.style.Fill({
                                color: '#3399CC'
                            })
                        }),
                        text: new ol.style.Text({
                            text: size.toString(),
                            fill: new ol.style.Fill({
                                color: '#fff'
                            })
                        })
                    })];
                    styleCache[size] = style;
                }
                return style;
            }
        });

        var raw = new ol.layer.Vector({
            source: source
        });


        this.map.addLayer(clusters);







    }


};