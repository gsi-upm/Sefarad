//SPARQL-GeoJSON v.0.2-alpha
function sparqlToGeoJSON(sparqlJSON) {
        'use strict';
        var bindingindex, varindex, geometryType, wkt, coordinates, property;
        var geojson = {
                "type": "FeatureCollection",
                "features": []
        };

        for (bindingindex = 0; bindingindex < sparqlJSON.length; ++bindingindex) {

                for (var key in sparqlJSON[bindingindex]){                        
                                               
                //for (varindex = 0; varindex < sparqlJSON.head.vars.length; ++varindex) {
                        if ((sparqlJSON[bindingindex][key].datatype != undefined) && (sparqlJSON[bindingindex][key].datatype() === "http://www.opengis.net/ont/geosparql#wktLiteral" || sparqlJSON[bindingindex][key].datatype() === "http://www.openlinksw.com/schemas/virtrdf#Geometry")) {
                                //assumes the well-known text is valid!
                                wkt = sparqlJSON[bindingindex][key].value();

                                //chop off geometry type, already have that
                                coordinates = wkt.substr(wkt.indexOf("("), wkt.length);
                                //add extra [ and replace ( by [ 
                                coordinates = "[" + coordinates.split("(").join("[");
                                //replace ) by ] and add extra ]
                                coordinates = coordinates.split(")").join("]") + "]";
                                //replace , by ],[
                                coordinates = coordinates.split(",").join("],[");
                                //replace spaces with ,
                                coordinates = coordinates.split(" ").join(",");
                                //delete repeated ,,
                                var re = new RegExp(',,', 'g');
                                coordinates = coordinates.replace(re, '');

                                var polygon = new RegExp("POLYGON*");

                                //find substring left of first "(" occurrence for geometry type
                                switch (wkt.substr(0, wkt.indexOf("("))) {
                                case "POINT":
                                        geometryType = "Point";
					coordinates = coordinates.substr(1, coordinates.length - 2); //remove redundant [ and ] at beginning and end
                                        break;
                                case "MULTIPOINT":
                                        geometryType = "MultiPoint";
                                        break;
                                case "LINESTRING":
                                        geometryType = "Linestring";
                                        break;
                                case "MULTILINE":
                                        geometryType = "MultiLine";
                                        break;
                                case "POLYGON ":
                                        geometryType = "Polygon";
                                        break;
                                case "MULTIPOLYGON":
                                        geometryType = "MultiPolygon";
                                        break;
                                case "GEOMETRYCOLLECTION":
                                        geometryType = "GeometryCollection";
                                        break;
                                default:
                                        //invalid wkt!
                                        continue;
                                }


                                var feature = {
                                        "type": "Feature",
                                        "geometry": {
                                                "type": geometryType,
                                                "coordinates": eval('(' + coordinates + ')')
                                        },
                                        "properties": sparqlJSON[bindingindex]
                                };

                                geojson.features.push(feature);
                        }
                }
        }
        return geojson;
}