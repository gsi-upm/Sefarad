// New widget
var widgetDonutsR = {
		// Widget name.
		name: "Widget Donuts Ruben",
		// Widget description.
		description: "Widget Donuts Ruben",
		// Path to the image of the widget.
		img: "img/widgetDonutsR.png",
		// Type of the widget.
		type: "widgetDonutsR",
		// [OPTIONAL] data taken from this field.
		// field: "polarityValue",

		render: function () {
			var id = 'A' + Math.floor(Math.random() * 10001);
			var field = widgetDonutsR.field || "";
			vm.activeWidgetsRight.push({"id":ko.observable(id),"title": ko.observable(widgetDonutsR.name), "type": ko.observable(widgetDonutsR	.type), "field": ko.observable(field),"collapsed": ko.observable(false)});
			
			// widgetDonutsR.paint(field, id, widgetDonutsR.type);
			widgetDonutsR.paint(id);		},

		// paint: function (field, id, type) {	
		paint: function (id) {			
			
			d3.select('#'+id).selectAll('svg').remove();
			var div = d3.select('#'+id);
			div.attr("align", "center");

			var data = new Array();
			
			$.each(vm.filteredData(), function(index, item) {

				var bank = new Object();
				bank.organization = item.organization();
				bank.employees = item.employees();
				bank.managers = item.managers();

				data.push(bank);					
					
			});	

			var radius = 74,
			    padding = 10;

			var color = d3.scale.ordinal()
			    .range(["#98abc5", "#ff8c00"])
			    .domain(d3.keys(data[0]).filter(function(key) { return key !== "organization"; }));

			var arc = d3.svg.arc()
			    .outerRadius(radius)
			    .innerRadius(radius - 30);

			var pie = d3.layout.pie()
			    .sort(null)
			    .value(function(d) { return d.number; });

			data.forEach(function(d) {
			    d.ranges = color.domain().map(function(name) {
			      return {name: name, number: +d[name]};
			    });
			});

			var legend = div.append("svg")
			      .attr("class", "legend")
			      .attr("width", radius * 2 + padding)
			      .attr("height", radius * 2 + padding)
			    .selectAll("g")
			      .data(color.domain().slice().reverse())
			    .enter().append("g")
			      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

			legend.append("rect")
			      .attr("width", 18)
			      .attr("height", 18)
			      .style("fill", color)
			      .attr("transform", "translate(" + padding + "," + padding + ")");

			legend.append("text")
			      .attr("x", 24)
			      .attr("y", 9)
			      .attr("dy", ".35em")
			      .text(function(d) { return d; })
			      .attr("transform", "translate(" + padding + "," + padding + ")");

			var svg = div.selectAll(".pie")
			      .data(data)
			    .enter().append("svg")
			      .attr("class", "pie")
			      .attr("width", radius * 2 + padding)
			      .attr("height", radius * 2 + padding)
			    .append("g")
			      .attr("transform", "translate(" + [radius + padding, radius + padding] + ")");

			svg.selectAll(".arc")
			      .data(function(d) { return pie(d.ranges); })
			    .enter().append("path")
			      .attr("class", "arc")
			      .attr("d", arc)	
			      .style("fill", function(d) { return color(d.data.name); });

			svg.append("text")
			      .attr("dy", ".35em")
			      .style("text-anchor", "middle")
			      .text(function(d) { return d.organization; });

		}
};	