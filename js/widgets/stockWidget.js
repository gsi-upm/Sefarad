// New widget
var stockWidget = {
		// Widget name.
		name: "stockWidget",
		// Widget description.
		description: "Stock visualizer",
		// Path to the image of the widget.
		img: "img/stockwidget.png",
		// Type of the widget.
		type: "stockWidget",
		// [OPTIONAL] data taken from this field.
		// field: "polarityValue",

		render: function () {
			var id = 'A' + Math.floor(Math.random() * 10001);
			var field = stockWidget.field || "";
			vm.activeWidgetsRight.push({"id":ko.observable(id),"title": ko.observable(stockWidget.name), "type": ko.observable(stockWidget.type), "field": ko.observable(field),"collapsed": ko.observable(false)});

			// stockWidget.paint(field, id, stockWidget.type);
			stockWidget.paint(id);
		},


		paint: function (id) {
		// paint: function (field, id, type) {

			d3.select('#'+id).select('svg').remove();
			d3.select('#'+id).select('#tooltip').remove();

			var dataObject = {
				price: [1, 2, 4, 7, 6, 9, 5, 7, 4, 2, 5, 8, 12, 15, 15, 16, 14, 17, 15, 16, 17, 18, 22, 23, 
						24, 25, 22, 24, 27, 25, 24, 24, 23, 25, 26, 30, 29, 31, 31, 32, 33, 35, 32, 35, 40, 
						42, 43, 45],
				date:  ["Jan 2000", "Feb 2000", "Mar 2000", "Apr 2000", "May 2000", "Jun 2000", "Jul 2000", 
						"Aug 2000", "Sep 2000", "Oct 2000", "Nov 2000", "Dec 2000", "Jan 2001", "Feb 2001", 
						"Mar 2001", "Apr 2001", "May 2001", "Jun 2001", "Jul 2001", "Aug 2001", "Sep 2001", 
						"Oct 2001", "Nov 2001", "Dec 2001", "Jan 2002", "Feb 2002", "Mar 2002", "Apr 2002", 
						"May 2002", "Jun 2002", "Jul 2002", "Aug 2002", "Sep 2002", "Oct 2002", "Nov 2002", 
						"Dec 2002", "Jan 2003", "Feb 2003", "Mar 2003", "Apr 2003", "May 2003", "Jun 2003", 
						"Jul 2003", "Aug 2003", "Sep 2003", "Oct 2003", "Nov 2003", "Dec 2003"],
				sentiment: [1, 0.95, 0.854, 0.8555, 0.748, 0.6523, 0.415, 0.5142, 0.5541, 0.3215, 0.124, -0.095, 
							-0.254, -0.295, -0.3012, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
							0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1]
			}

			console.log(dataObject.price.length);
			console.log(dataObject.date.length);
			console.log(dataObject.sentiment.length);

			var margin = {top: 10, right: 40, bottom: 100, left: 40},
    			margin2 = {top: 430, right: 40, bottom: 20, left: 40},
    			width = $('#' + id).width() - margin.left - margin.right,
    			height = 500 - margin.top - margin.bottom,
    			height2 = 500 - margin2.top - margin2.bottom;

			var parseDate = d3.time.format("%b %Y").parse;


			var data = [];

			for (var i = 0; i < dataObject.price.length; i++) {
				data[i] = new Object();
				data[i].price = dataObject.price[i].toString();
				data[i].date  = dataObject.date[i];
				data[i].sentiment = dataObject.sentiment[i];
			}

			// console.log(data);


			var x = d3.time.scale().range([0, width]),
				x2 = d3.time.scale().range([0, width]),
				y = d3.scale.linear().range([height, 0]),
				y2 = d3.scale.linear().range([height2, 0]),

				y3 = d3.scale.linear().range([height, 0]);

			var xAxis = d3.svg.axis().scale(x).orient("bottom"),
				xAxis2 = d3.svg.axis().scale(x2).orient("bottom"),
				yAxis = d3.svg.axis().scale(y).orient("left"),

				yAxis3 = d3.svg.axis().scale(y3).orient("right");

			var brush = d3.svg.brush()
				.x(x2)
				.on("brush", brushed);

			var line = d3.svg.line()
				.interpolate("basis")
				.x(function(d) { return x(d.date); })
				.y(function(d) { return y(d.price); })

			var line2 = d3.svg.line()
				//.interpolate("basis")
				.x(function(d) { return x(d.date); })
				.y(function(d) { return y3(d.sentiment); })

			var area = d3.svg.area()
				.interpolate("basis")
				.x(function(d) { return x(d.date); })
				.y0(height)
				.y1(function(d) { return y(d.price); });

			var area2 = d3.svg.area()
				.interpolate("monotone")
				.x(function(d) { return x2(d.date); })
				.y0(height2)
				.y1(function(d) { return y2(d.price); });


			var svg = d3.select('#'+id).append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom);

		
			svg.append("defs").append("clipPath")
				.attr("id", "clip")
				.append("rect")
				.attr("width", width)
				.attr("height", height);
		
			var focus = svg.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
			
			var sentiment = svg.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			var context = svg.append("g")
				.attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

			/*
			dataObject.forEach(function(d) {
				d.date = parseDate(d.date);
				d.price = +d.price;
			});
			*/

			data.forEach(function(d) {
				d.date = parseDate(d.date);
				d.price = +d.price;
			});

			x.domain(d3.extent(data.map(function(d) { return d.date; })));
			y.domain([0, d3.max(data.map(function(d) { return d.price; }))]);
			x2.domain(x.domain());
			y2.domain(y.domain());

			y3.domain([ d3.min(data.map(function(d) { return d.sentiment; })), 
						d3.max(data.map(function(d) { return d.sentiment; }))]);

			/*
			focus.append("path")
				.datum(data)
				.attr("clip-path", "url(#clip)")
				// .attr("stroke", "stee-blue")
				// .attr("stroke-width", "2")
				.attr("d", area);
			*/
			
			focus.append("path")
				.datum(data)
				.attr("clip-path", "url(#clip)")
				.attr("stroke", "steelblue")
				.attr("stroke-width", 2)
				.attr("fill", "none")
				.attr("d", line);

			focus.append("g")
				.attr("class", "x axis")
				.attr("transform", "translate(0," + height + ")")
				.call(xAxis);

			focus.append("g")
				.attr("class", "y axis")
				.call(yAxis);



			sentiment.append("path")
				.datum(data)
				.attr("clip-path", "url(#clip)")
				.attr("stroke", "black")
				.attr("stroke-width", 2)
				.attr("fill", "none")
				.attr("d", line2);

			sentiment.append("g")
				.attr("class", "y axis")
				.attr("transform", "translate(" + width + ", 0)")
				.call(yAxis3);




			context.append("path")
				.datum(data)

				.attr("fill", "steelblue")
				.attr("d", area2);

			context.append("g")
				.attr("class", "x axis")
				.attr("transform", "translate(0," + height2 + ")")
				.call(xAxis2);

			context.append("g")
				.attr("class", "x brush")
				.call(brush)
				.selectAll("rect")
				.attr("y", -6)
				.attr("height", height2 + 7);
			
			function brushed() {
				x.domain(brush.empty() ? x2.domain() : brush.extent());
				focus.select("path").attr("d", line);
				sentiment.select("path").attr("d", line2);
				focus.select(".x.axis").call(xAxis);
			}


		}
	};