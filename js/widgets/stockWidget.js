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

		options: {

		},


		paint: function (id) {

			$('#' + id).empty();	

			// d3.select('#'+id).select('svg').remove();
			// d3.select('#'+id).select('#tooltip').remove();

			/*
			*	Creamos los checks.
			*/

			$('#'+id).append("<div></div>")
			$('#' + id + ' > div').addClass('widget-configuration');

			for (key in Manager.response.facet_counts.facet_fields.entity) {
				$('#' + id + ' > div').append('<input type="radio" name="group' + id + '" value="' + key + '">' + key + '</input>')
			}

			valorSeleccionado = stockWidget.options[id];

			$('input:radio').on('change', function(){
				valorSeleccionado = $('input:radio[name=group' + id + ']:checked').val();
				stockWidget.options[id] = valorSeleccionado;
				stockWidget.paint(id)
			});

			if (stockWidget.options[id] != undefined) {
				$('#'+id).append('<div id="tooltip">' + stockWidget.options[id].toUpperCase() + '</div>');
				$('input[name="group' + id + '"][value="' + stockWidget.options[id] + '"]').prop('checked', true);
			} else {
				$('#'+id).append('<div id="tooltip"></div>');
				$("#" + id + " > #tooltip").append("No hay entidades seleccionadas.");
				return;
			}
			
			sentimentValue = {}

			for (var i = 0; i < vm.filteredData().length; i++) {
				for (var j = 0; j < vm.filteredData()[i].entity().length; j++) {
					if (valorSeleccionado == vm.filteredData()[i].entity()[j]) {
						fecha = vm.filteredData()[i].created()[0].substring(0, 10);
						sentimentValue[fecha] = vm.filteredData()[i].polarityValue();
					}
				}
			}
			console.log(sentimentValue);

			// Datos historicos
			bbva_historical = [["2012-01-02", 6.8], ["2012-01-03", 6.84], ["2012-01-04", 6.63], ["2012-01-05", 6.3], ["2012-01-06", 6.23], ["2012-01-09", 6.06], ["2012-01-10", 6.28], ["2012-01-11", 6.28], ["2012-01-12", 6.33], ["2012-01-13", 6.4], ["2012-01-16", 6.44], ["2012-01-17", 6.53], ["2012-01-18", 6.44], ["2012-01-19", 6.75], ["2012-01-20", 6.76], ["2012-01-23", 6.85], ["2012-01-24", 6.83], ["2012-01-25", 6.8], ["2012-01-26", 6.97], ["2012-01-27", 6.9], ["2012-01-30", 6.74], ["2012-01-31", 6.67], ["2012-02-01", 6.89], ["2012-02-02", 7.05], ["2012-02-03", 7.19], ["2012-02-06", 7.22], ["2012-02-07", 7.26], ["2012-02-08", 7.22], ["2012-02-09", 7.3], ["2012-02-10", 7.14], ["2012-02-13", 7.14], ["2012-02-14", 7.12], ["2012-02-15", 7.09], ["2012-02-16", 6.8], ["2012-02-17", 6.9], ["2012-02-20", 7.1], ["2012-02-21", 7.07], ["2012-02-22", 6.89], ["2012-02-23", 6.77], ["2012-02-24", 6.77], ["2012-02-27", 6.76], ["2012-02-28", 6.75], ["2012-02-29", 6.73], ["2012-03-01", 6.81], ["2012-03-02", 6.81], ["2012-03-05", 6.69], ["2012-03-06", 6.33], ["2012-03-07", 6.3], ["2012-03-08", 6.52], ["2012-03-09", 6.46], ["2012-03-12", 6.3], ["2012-03-13", 6.49], ["2012-03-14", 6.5], ["2012-03-15", 6.55], ["2012-03-16", 6.66], ["2012-03-19", 6.75], ["2012-03-20", 6.68], ["2012-03-21", 6.49], ["2012-03-22", 6.31], ["2012-03-23", 6.24], ["2012-03-26", 6.15], ["2012-03-27", 6.06], ["2012-03-28", 5.93], ["2012-03-29", 5.86], ["2012-03-30", 5.97], ["2012-04-02", 5.97], ["2012-04-03", 5.7], ["2012-04-04", 5.61], ["2012-04-05", 5.6], ["2012-04-06", 5.6], ["2012-04-09", 5.6], ["2012-04-10", 5.4], ["2012-04-11", 5.6], ["2012-04-12", 5.5], ["2012-04-13", 5.33], ["2012-04-16", 5.15], ["2012-04-17", 5.35], ["2012-04-18", 5.18], ["2012-04-19", 4.95], ["2012-04-20", 5.1], ["2012-04-23", 5.0], ["2012-04-24", 5.15], ["2012-04-25", 5.26], ["2012-04-26", 5.15], ["2012-04-27", 5.22], ["2012-04-30", 5.11], ["2012-05-01", 5.11], ["2012-05-02", 4.94], ["2012-05-03", 4.88], ["2012-05-04", 5.03], ["2012-05-07", 5.3], ["2012-05-08", 5.26], ["2012-05-09", 5.01], ["2012-05-10", 5.31], ["2012-05-11", 5.24], ["2012-05-14", 5.05], ["2012-05-15", 4.92], ["2012-05-16", 4.9], ["2012-05-17", 4.77], ["2012-05-18", 4.94], ["2012-05-21", 4.89], ["2012-05-22", 5.01], ["2012-05-23", 4.81], ["2012-05-24", 4.93], ["2012-05-25", 4.93], ["2012-05-28", 4.76], ["2012-05-29", 4.64], ["2012-05-30", 4.57], ["2012-05-31", 4.6], ["2012-06-01", 4.66], ["2012-06-04", 4.85], ["2012-06-05", 4.88], ["2012-06-06", 5.04], ["2012-06-07", 5.1], ["2012-06-08", 5.15], ["2012-06-11", 5.15], ["2012-06-12", 5.14], ["2012-06-13", 5.21], ["2012-06-14", 5.26], ["2012-06-15", 5.25], ["2012-06-18", 5.03], ["2012-06-19", 5.16], ["2012-06-20", 5.34], ["2012-06-21", 5.31], ["2012-06-22", 5.36], ["2012-06-25", 5.07], ["2012-06-26", 4.98], ["2012-06-27", 5.09], ["2012-06-28", 5.16], ["2012-06-29", 5.63], ["2012-07-02", 5.64], ["2012-07-03", 5.79], ["2012-07-04", 5.73], ["2012-07-05", 5.46], ["2012-07-06", 5.18], ["2012-07-09", 5.11], ["2012-07-10", 5.05], ["2012-07-11", 5.17], ["2012-07-12", 5.04], ["2012-07-13", 5.08], ["2012-07-16", 4.92], ["2012-07-17", 4.95], ["2012-07-18", 4.96], ["2012-07-19", 5.0], ["2012-07-20", 4.61], ["2012-07-23", 4.62], ["2012-07-24", 4.43], ["2012-07-25", 4.43], ["2012-07-26", 4.91], ["2012-07-27", 5.15], ["2012-07-30", 5.37], ["2012-07-31", 5.32], ["2012-08-01", 5.28], ["2012-08-02", 4.94], ["2012-08-03", 5.35], ["2012-08-06", 5.59], ["2012-08-07", 5.74], ["2012-08-08", 5.72], ["2012-08-09", 5.66], ["2012-08-10", 5.64], ["2012-08-13", 5.66], ["2012-08-14", 5.72], ["2012-08-15", 5.74], ["2012-08-16", 5.96], ["2012-08-17", 6.04], ["2012-08-20", 5.91], ["2012-08-21", 5.98], ["2012-08-22", 5.81], ["2012-08-23", 5.71], ["2012-08-24", 5.73], ["2012-08-27", 5.84], ["2012-08-28", 5.82], ["2012-08-29", 5.84], ["2012-08-30", 5.76], ["2012-08-31", 6.07], ["2012-09-03", 6.08], ["2012-09-04", 6.06], ["2012-09-05", 6.07], ["2012-09-06", 6.39], ["2012-09-07", 6.51], ["2012-09-10", 6.49], ["2012-09-11", 6.57], ["2012-09-12", 6.63], ["2012-09-13", 6.51], ["2012-09-14", 6.68], ["2012-09-17", 6.67], ["2012-09-18", 6.48], ["2012-09-19", 6.45], ["2012-09-20", 6.32], ["2012-09-21", 6.55], ["2012-09-24", 6.47], ["2012-09-25", 6.52], ["2012-09-26", 6.2], ["2012-09-27", 6.23], ["2012-09-28", 6.11], ["2012-10-01", 6.08], ["2012-10-02", 6.14], ["2012-10-03", 6.06], ["2012-10-04", 6.02], ["2012-10-05", 6.22], ["2012-10-08", 6.16], ["2012-10-09", 6.02], ["2012-10-10", 5.92], ["2012-10-11", 6.02], ["2012-10-12", 5.93], ["2012-10-15", 5.96], ["2012-10-16", 6.31], ["2012-10-17", 6.66], ["2012-10-18", 6.65], ["2012-10-19", 6.45], ["2012-10-22", 6.39], ["2012-10-23", 6.29], ["2012-10-24", 6.3], ["2012-10-25", 6.25], ["2012-10-26", 6.28], ["2012-10-29", 6.23], ["2012-10-30", 6.32], ["2012-10-31", 6.44], ["2012-11-01", 6.45], ["2012-11-02", 6.5], ["2012-11-05", 6.33], ["2012-11-06", 6.33], ["2012-11-07", 6.09], ["2012-11-08", 6.09], ["2012-11-09", 6.09], ["2012-11-12", 6.02], ["2012-11-13", 6.23], ["2012-11-14", 6.24], ["2012-11-15", 6.27], ["2012-11-16", 6.11], ["2012-11-19", 6.28], ["2012-11-20", 6.3], ["2012-11-21", 6.36], ["2012-11-22", 6.43], ["2012-11-23", 6.46], ["2012-11-26", 6.42], ["2012-11-27", 6.41], ["2012-11-28", 6.35], ["2012-11-29", 6.55], ["2012-11-30", 6.52], ["2012-12-03", 6.5], ["2012-12-04", 6.55], ["2012-12-05", 6.59], ["2012-12-06", 6.63], ["2012-12-07", 6.57], ["2012-12-10", 6.51], ["2012-12-11", 6.62], ["2012-12-12", 6.7], ["2012-12-13", 6.75], ["2012-12-14", 6.8], ["2012-12-17", 6.83], ["2012-12-18", 6.89], ["2012-12-19", 6.99], ["2012-12-20", 7.0], ["2012-12-21", 7.03], ["2012-12-24", 7.02], ["2012-12-25", 7.02], ["2012-12-26", 7.02], ["2012-12-27", 7.04], ["2012-12-28", 6.92], ["2012-12-31", 6.96]];

			// sentiment_historical = {};

			// sentimentValue = {}
			// for (var i = 0; i < vm.filteredData().length; i++) {
			// 	polarity = parseFloat(vm.filteredData()[i].polarityValue()[0])
			// 	fecha    = vm.filteredData()[i].created()[0].substring(0, 10);
			// 	// console.log(fecha);
			// 	sentimentValue[fecha] = polarity;
			// }		

			// // Sentimiento, se saca de LMF
			// sentimientoData = {}
			// for (var i = 0; i < vm.filteredData().length; i++) {
			// 	polarity = parseFloat(vm.filteredData()[i].polarityValue()[0])
			// 	fecha    = vm.filteredData()[i].created()[0].substring(0, 10);
			// 	// console.log(fecha);
			// 	sentimientoData[fecha] = polarity;
			// }
			// console.log(sentimientoData)

			// for (var i = 0; i < bbva_historical.length; i++) {
			// 	fecha = bbva_historical[i][0]
			// 	// fecha = fecha.split('-')
			// 	fecha = d3.format.parse(fecha)
			// 	console.log(fecha)
			// }

			data = []
			for (var i = 0; i < bbva_historical.length; i++) {
				data[i] = new Object();
				data[i].price = bbva_historical[i][1]
				fecha = bbva_historical[i][0]
				// console.log(fecha)
				data[i].date = fecha
				if (sentimentValue[fecha] == undefined) {
					data[i].sentiment = 0
				} else {
					data[i].sentiment = sentimentValue[fecha]
				}
			}
			// console.log(data)

			// var dataObject = {
			// 	price: [1, 2, 4, 7, 6, 9, 5, 7, 4, 2, 5, 8, 12, 15, 15, 16, 14, 17, 15, 16, 17, 18, 22, 23, 
			// 			24, 25, 22, 24, 27, 25, 24, 24, 23, 25, 26, 30, 29, 31, 31, 32, 33, 35, 32, 35, 40, 
			// 			42, 43, 45],
			// 	date:  ["01 Jan 2000", "01 Feb 2000", "01 Mar 2000", "01 Apr 2000", "01 May 2000", "01 Jun 2000", "01 Jul 2000", 
			// 			"01 Aug 2000", "01 Sep 2000", "01 Oct 2000", "01 Nov 2000", "01 Dec 2000", "01 Jan 2001", "01 Feb 2001", 
			// 			"01 Mar 2001", "01 Apr 2001", "01 May 2001", "01 Jun 2001", "01 Jul 2001", "01 Aug 2001", "01 Sep 2001", 
			// 			"01 Oct 2001", "01 Nov 2001", "01 Dec 2001", "01 Jan 2002", "01 Feb 2002", "01 Mar 2002", "01 Apr 2002", 
			// 			"01 May 2002", "01 Jun 2002", "01 Jul 2002", "01 Aug 2002", "01 Sep 2002", "01 Oct 2002", "01 Nov 2002", 
			// 			"01 Dec 2002", "01 Jan 2003", "01 Feb 2003", "01 Mar 2003", "01 Apr 2003", "01 May 2003", "01 Jun 2003", 
			// 			"01 Jul 2003", "01 Aug 2003", "01 Sep 2003", "01 Oct 2003", "01 Nov 2003", "01 Dec 2003"],
			// 	sentiment: [1, 0.95, 0.854, 0.8555, 0.748, 0.6523, 0.415, 0.5142, 0.5541, 0.3215, 0.124, -0.095, 
			// 				-0.254, -0.295, -0.3012, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
			// 				0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1]
			// }

			// console.log(dataObject.price.length);
			// console.log(dataObject.date.length);
			// console.log(dataObject.sentiment.length);

			var margin = {top: 10, right: 40, bottom: 100, left: 40},
    			margin2 = {top: 430, right: 40, bottom: 20, left: 40},
    			width = $('#' + id).width() - margin.left - margin.right,
    			height = 500 - margin.top - margin.bottom,
    			height2 = 500 - margin2.top - margin2.bottom;

			var parseDate = d3.time.format("%Y-%m-%d").parse;


			// var data = [];

			// for (var i = 0; i < dataObject.price.length; i++) {
			// 	data[i] = new Object();
			// 	data[i].price = dataObject.price[i].toString();
			// 	data[i].date  = dataObject.date[i];
			// 	data[i].sentiment = dataObject.sentiment[i];
			// }

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
				// .interpolate("basis")
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
			y.domain([d3.min(data.map(function(d) { return d.price; })), d3.max(data.map(function(d) { return d.price; }))]);
			x2.domain(x.domain());
			y2.domain(y.domain());


			y3.domain([-1, 1]);

			// y3.domain([ d3.min(data.map(function(d) { return d.sentiment; })), 
			// 			d3.max(data.map(function(d) { return d.sentiment; }))]);

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