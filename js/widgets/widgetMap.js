// New widget
var widgetMap = {
	// Widget name.
	name: "Mapa",
	// Widget description.
	description: "Widget Mapa",
	// Path to the image of the widget.
	img: "img/map_widget.png",
	// Type of the widget.
	type: "widgetMap",
	// [OPTIONAL] data taken from this field.
	// field: "polarityValue",

	render: function () {
		var id = 'A' + Math.floor(Math.random() * 10001);
		var field = widgetMap.field || "";
		vm.activeWidgetsRight.push({"id":ko.observable(id),"title": ko.observable(widgetMap.name), "type": ko.observable(widgetMap	.type), "field": ko.observable(field),"collapsed": ko.observable(false)});
		
		// widgetMap.paint(field, id, widgetMap.type);
		widgetMap.paint(id);		},

	// paint: function (field, id, type) {	
	paint: function (id) {			
		
		d3.select('#'+id).selectAll('div').remove();
		var div = d3.select('#'+id);
		div.attr("align", "center");

		//Creamos mapa
		var map_div = div.append("div")
						.attr("id", "map")
					    .attr("class", "map");

		var myCenter=new google.maps.LatLng(40.42761,-3.703187);

		var mapProperties = {
			center:myCenter,
			zoom:5,
			mapTypeId:google.maps.MapTypeId.ROADMAP
		};

		var map=new google.maps.Map(map_div.node(),mapProperties);
		var bounds = new google.maps.LatLngBounds();

		//Añadimos markers con las ciudades filtradas
		$.each(vm.filteredData(), function(index, item) {

			var marker = new google.maps.Marker({
				position: new google.maps.LatLng(item.latitude(),item.longitude()),
			    title: item.nombre().toString(),
			    map: map,
			});

			//Ventana de info cuando clicamos el marker
			var contentString = '<div id="content">'+item.pais().toString()+'</div>';

			var infowindow = new google.maps.InfoWindow({
			    content: contentString
			});

			google.maps.event.addListener(marker, "click", function(){
				infowindow.open(map,marker);
			});

			//Añadimos a bound para re-centrar todos los marcadores
			bounds.extend(marker.position);
		});

		map.fitBounds(bounds);
	}
};