// New widget
var widgetBarras = {
	// Widget name.
	name: "Barras",
	// Widget description.
	description: "Barras",
	// Path to the image of the widget.
	img: "img/widgetBarras.png",
	// Type of the widget.
	type: "barrasChart",
	// [OPTIONAL] data taken from this field.
	// field: "created",

	render: function () {
		var id = 'A' + Math.floor(Math.random() * 10001);
		var field = widgetBarras.field || "";
		vm.activeWidgetsRight.push({"id":ko.observable(id),"title": ko.observable(widgetBarras.name), "type": ko.observable(widgetBarras.type), "field": ko.observable(field),"collapsed": ko.observable(false)});
		
		// widgetB.paint(field, id, widgetBarras.type);
		widgetBarras.paint(id);
	},

	options: {

	},

	// paint: function (field, id, type) {
	paint: function (id) {

		// Erase all the content of the widget
		$('#' + id).empty();

		$('#'+id).append("<div></div>")
		$('#' + id + ' > div').addClass('widget-configuration');

		for (var i = 0; i < vm.resultsGraphs().length; i++) {
			$('#' + id + ' > div').append('<input type="radio" name="group' + id + '" value="' + vm.resultsGraphs()[i].type() + '">' + vm.resultsGraphs()[i].type() + '</input>')
		}

		fieldSeleccionado = widgetBarras.options[id];

		$('input:radio').on('change', function(){
			fieldSeleccionado = $('input:radio[name=group' + id + ']:checked').val();
			widgetBarras.options[id] = fieldSeleccionado;
			widgetBarras.paint(id)
		});

		if (widgetBarras.options[id] != undefined) {
			$('#'+id).append('<div id="tooltip">' + widgetBarras.options[id].toUpperCase() + '</div>');
			$('input[name="group' + id + '"][value="' + widgetBarras.options[id] + '"]').prop('checked', true);
			$('#'+id + ' > .widget-configuration').hide();
		} else {
			$('#'+id).append('<div id="tooltip"></div>');
			$("#" + id + " > #tooltip").append("No hay ningún campo seleccionado.");
			return;
		}

		var t = ko.utils.getDataColumns(fieldSeleccionado);

		if(t==undefined){
			
			var params = {
				facet: true,
				'facet.field': fieldSeleccionado,
				'facet.limit': limit_items_tagcloud,
				'facet.sort': 'count',
				'facet.mincount': 1,
				'json.nl': 'map',
				'rows': vm.num_rows()
			};

			for (var name in params) {
				Manager.store.addByValue(name, params[name]);
			}

			// If it is a new Widget, not results Widget.
			if (fieldSeleccionado != id) {
				drawCharts = true;
			}

			Manager.doRequest();
			// vm.newWidgetGetData(field, id);
			return;
		}

		// console.log(t);
		// return;

		var arrayBarras = new Array();
		for (var i = 0; i < t.length; i++) {
			var value = parseFloat(t[i].facet);
			if (value < -0.1 || value > 0.1) {
				arrayBarras.push(value);
			}
		}
		console.log(arrayBarras);
		
		d3.select('#'+id).select('svg').remove();
		var div = d3.select('#'+id);
		div.attr("align", "center");
			
		//var data = datos;
		var margin1 = {top: 30, right: 15, bottom: 10, left: 15},
			width1 = 600 - margin1.left - margin1.right,
			height1 = 30*arrayBarras.length - margin1.top - margin1.bottom;
	
		var x0 = Math.max(-d3.min(arrayBarras), d3.max(arrayBarras));
	
		var x1 = d3.scale.linear()
			.domain([-x0, x0])
			.range([0, width1])
			.nice();
	
		var y1 = d3.scale.ordinal()
			.domain(d3.range(arrayBarras.length))
			.rangeRoundBands([0, height1], .2);
	
		var xAxis = d3.svg.axis()
			.scale(x1)
			.orient("top");
	
		var svg = div.append("svg:svg")
			.attr("width", width1 + margin1.left + margin1.right)
			.attr("height", height1 + margin1.top + margin1.bottom)
		  .append("g")
			.attr("transform", "translate(" + margin1.left + "," + margin1.top + ")");

		var text = svg.selectAll(".bar")
			.data(arrayBarras)
		  .enter().append("svg:text")
			//.attr("class", function(d) { return d < 0 ? "bar negative" : "bar positive"; })
			.attr("x", function(d, i) { 
				if (d < 0) {
					return x1(Math.min(0, d)) + 3;	
				} else {
					return Math.abs(x1(d) - x1(0)) + x1(Math.min(0, d)) - 3; 
				}
				
			})
			.attr("y", function(d, i) { return y1(i) + 11; })
			.attr("dy", ".35em")
		    .attr("text-anchor", function(d) {
		    	if (d < 0) {
		    		return "start";
		    	} else {
		    		return "end";
		    	}
		    })
			.style("font", "300 14px Helvetica Neue")
			.text(function(d, i) { return t[i].count});
			//.attr("width", function(d) { return Math.abs(x1(d) - x1(0)); })
			//.attr("height", y1.rangeBand());
	
		svg.selectAll(".bar")
			.data(arrayBarras)
		  .enter().append("rect")
			.attr("class", function(d) { return d < 0 ? "bar negative" : "bar positive"; })
			.attr("x", function(d) { return x1(Math.min(0, d)); })
			.attr("y", function(d, i) { return y1(i); })
			.style("fill-opacity", ".3")
			.attr("width", function(d) { return Math.abs(x1(d) - x1(0)); })
			.attr("height", y1.rangeBand());
	
		svg.append("g")
			.attr("class", "x axis")
			.call(xAxis);
	
		svg.append("g")
			.attr("class", "y axis")
		  .append("line")
			.attr("x1", x1(0))
			.attr("x2", x1(0))
			.attr("y1", 0)
			.attr("y2", height1);
	
	}
};