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
			
			widgetBarras.paint(field, id, widgetA.type);
		},

		paint: function (field, id, type) {

			var arrayBarras = new Array();
			$.each(vm.filteredData(), function(index, item) {
				var value = parseFloat(item. polarityValue());
				if (value <  -0.1 || value > 0.1) {
					arrayBarras.push(value);
				}
			});
			
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
		
			var svg = div.append("svg")
				.attr("width", width1 + margin1.left + margin1.right)
				.attr("height", height1 + margin1.top + margin1.bottom)
			  .append("g")
				.attr("transform", "translate(" + margin1.left + "," + margin1.top + ")");
		
			svg.selectAll(".bar")
				.data(arrayBarras)
			  .enter().append("rect")
				.attr("class", function(d) { return d < 0 ? "bar negative" : "bar positive"; })
				.attr("x", function(d) { return x1(Math.min(0, d)); })
				.attr("y", function(d, i) { return y1(i); })
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