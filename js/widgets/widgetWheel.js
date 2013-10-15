// New widget
var widgetWheel = {
		// Widget name.
		name: "Wheel",
		// Widget description.
		description: "Wheel",
		// Path to the image of the widget.
		img: "img/wheel.png",
		// Type of the widget.
		type: "wheelChart",
		// [OPTIONAL] data taken from this field.
		// field: "polarityValue",

		render: function () {
			var id = 'A' + Math.floor(Math.random() * 10001);
			var field = widgetWheel.field || "";
			vm.activeWidgetsRight.push({"id":ko.observable(id),"title": ko.observable(widgetWheel.name), "type": ko.observable(widgetWheel.type), "field": ko.observable(field),"collapsed": ko.observable(false)});

			widgetWheel.paint(field, id, widgetWheel.type);
		},

		paint: function (field, id, type) {

			if (vm.filteredData().length > 8) {
				console.log("Demasiados resultados");

				d3.select('#'+id).select('svg').remove();
				d3.select('#'+id).select('#tooltip').remove();

				$('#'+id).append('<div id="tooltip"></div>');
				$("#tooltip").append("Demasiados resultados, aumente el número de filtros.");

				return;

			}
			// var t = ko.utils.getDataColumns(field);

			// if(t==undefined){
			// 	vm.newWidgetGetData(field, id);
			// } else {

				// Wheel
				var array = new Array();
				$.each(vm.filteredData(), function(index, item) {


					var one;
					console.log(item.location()[0]);
					var location = new String(item.location()[0]);
					var resultOne = $.grep(array, function(e) { return e["name"].valueOf() == location.valueOf(); });

					if (resultOne.length == 0) {
						one = new Object();
						one["name"] = location;
						one["children"] = new Array();
						array.push(one);
					} else {
						one = resultOne[0];
					}

					var two = new Object();
					two["name"] = new String (item.organization());
					two["colour"] = "#2E64FE";

					one["children"].push(two);


					// // console.log(item);
					// var one;
					// var name = "";
					// /*
					// var resultOne = $.grep(array, function(e){ return e["name"].valueOf() == name.valueOf(); });
					// if (resultOne.length == 0) {
					// 	one = new Object();
					// 	one["name"] = name;
					// 	one["children"] = new Array();
					// 	array.push(one);
					// } else {
					// 	one = resultOne[0];
					// }
					// */
					// var two;
					// var polarity = new String(item.location()[0]);
					// var resultTwo = $.grep(array, function(e){ return e["name"].valueOf() == polarity.valueOf(); });
					// if (resultTwo.length == 0) {
					// 	two = new Object();
					// 	two["name"] = polarity;
					// 	two["children"] = new Array();
					// 	array.push(two);
					// 	// one["children"].push(two);
					// } else {
					// 	two = resultTwo[0];
					// }
					// var three = new Object();
					// three["name"] = new String(item.organization());
					// three["colour"] = "2E64FE";

					// /*********
					// var value = parseFloat(item.polarityValue());
					// //var hex = 5*Math.abs(value) + 250;
					// //var hexString = ("0" + hex.toString(16)).slice(-2);	
					// //console.log(hexString);
					// if (value <  -0.3) {
					// 	three["colour"] = "#FE2E2E";
					// } else if (value > 0.3) {
					// 	three["colour"] = "#2EFE2E"; 
					// } else {
					// 	three["colour"] = "#2E64FE"; 
					// }
					// *************/
					// two["children"].push(three);
				});
				console.log(array);
				//$("#vis").fadeOut();
				setTimeout(function() {
					updateWheel(JSON.stringify(array));
					// $("#vis").fadeIn();
				},300);


				// var arrayBarras = new Array();
				// $.each(self.filteredData(), function(index, item) {
				// 	var value = parseFloat(item. polarityValue());
				// 	if (value <  -0.1 || value > 0.1) {
				// 		arrayBarras.push(value);
				// 	}
				// });



				// Coffee Flavour Wheel by Jason Davies,
				// http://www.jasondavies.com/coffee-wheel/
				// License: http://www.jasondavies.com/coffee-wheel/LICENSE.txt
				var nodes;

				function updateWheel(jsonString) {
					var width = 460,
						height = 460,
						radius = Math.min(width, height) / 2,
						x = d3.scale.linear().range([0, 2 * Math.PI]),
						y = d3.scale.pow().exponent(1.3).domain([0, 1]).range([0, radius]),
						padding = 5,
						duration = 2000;

					d3.select('#'+id).select('svg').remove();
					d3.select('#'+id).select('#tooltip').remove();

					var div = d3.select('#'+id);
					div.attr("align", "center");


					var vis = div.append("svg")
						.attr("width", width + padding * 2)
						.attr("height", height + padding * 2)
						.append("g")
						.attr("transform", "translate(" + [radius + padding, radius + padding] + ")");


					var partition = d3.layout.partition()
						.sort(null)
						.value(function(d) { return 5.8 - d.depth; });

					var arc = d3.svg.arc()
						.startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x))); })
						.endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx))); })
						.innerRadius(function(d) { return Math.max(0, d.y ? y(d.y) : d.y); })
						.outerRadius(function(d) { return Math.max(0, y(d.y + d.dy)); });

					var json = JSON.parse(jsonString);
					/// d3.json(jsonString, function(json) {
					nodes = partition.nodes({children: json});

					var path = vis.selectAll("path").data(nodes);
					path.enter().append("path")
						.attr("id", function(d, i) { return "path-" + i; })
						.attr("d", arc)
						.attr("fill-rule", "evenodd")
						.style("fill", colour)
						.style("stroke", "#000")
						.on("click", click).on("mouseover",mouseover);

					var text = vis.selectAll("text").data(nodes);

					var textEnter = text.enter().append("text")
						.style("fill-opacity", 1)
						.style("fill", function(d) {
							return brightness(d3.rgb(colour(d))) < 125 ? "#eee" : "#000";
						})
						.attr("text-anchor", function(d) {
							return x(d.x + d.dx / 2) > Math.PI ? "end" : "start";
						})
						.attr("dy", ".2em")
						.attr("transform", function(d) {
							var multiline = (d.name || "").split(" ").length > 1,
								angle = x(d.x + d.dx / 2) * 180 / Math.PI - 90,
								rotate = angle + (multiline ? -.5 : 0);
							return "rotate(" + rotate + ")translate(" + (y(d.y) + padding) + ")rotate(" + (angle > 90 ? -180 : 0) + ")";
						})	
						.on("click", click).on("mouseover",mouseover);

					textEnter.append("tspan")
						.attr("x", 0)
						.text(function(d) { 
							if (d.depth > 0)
								//return d.depth ? d.name.split(" ")[0] : ""; 
								return d.name;
							else 
								return "";
						});

					$('#'+id).append('<div id="tooltip">Seleccione un banco para ver su contenido.</div>');



					/*textEnter.append("tspan")
					  .attr("x", 0)
					  .attr("dy", "1em")
					  .text(function(d) { return d.depth ? d.name.split(" ")[1] || "" : ""; });*/

					function mouseover(d) {
						console.log(d);
						console.log('mousevoer depth: ' + d.depth);
						$("#tooltip").remove();
						$('#'+id).append('<div id="tooltip"></div>');
						if(d.depth > 1){	
							//$("tooltip").remove();		
							$("#tooltip").append(d.name);
						}else{
							$("#tooltip").append("<br>");
						}
					}

					function click(d) {
					  	if(d.depth < 3){			
							path.transition()
							  .duration(duration)
							  .attrTween("d", arcTween(d));
							console.log("pinchando en:"+d.name);
							// Somewhat of a hack as we rely on arcTween updating the scales.
							text.style("visibility", function(e) {
								  return isParentOf(d, e) ? null : d3.select(this).style("visibility");
								})
							  .transition()
								.duration(duration)
								.attrTween("text-anchor", function(d) {
								  return function() {
									return x(d.x + d.dx / 2) > Math.PI ? "end" : "start";
								  };
								})
								.attrTween("transform", function(d) {
								  var multiline = (d.name || "").split(" ").length > 1;
								  return function() {
									var angle = x(d.x + d.dx / 2) * 180 / Math.PI - 90,
										rotate = angle + (multiline ? -.5 : 0);
									return "rotate(" + rotate + ")translate(" + (y(d.y) + padding) + ")rotate(" + (angle > 90 ? -180 : 0) + ")";
								  };
								})
								.style("fill-opacity", function(e) { return isParentOf(d, e) ? 1 : 1e-6; })
								.each("end", function(e) {
								  d3.select(this).style("visibility", isParentOf(d, e) ? null : "hidden");
								});
						}
					  }


					//});



					function isParentOf(p, c) {
						if (p === c) return true;
						if (p.children) {
							return p.children.some(function(d) {
						  		return isParentOf(d, c);
							});
					  	}
						return false;
					}

					function colour(d) {

						switch (d.depth) {
							case 0: 
								return "#012DAC";
							case 1:
								return "#0141F8";
							case 2:
								return "#2E64FE";
						}
						return "#FFF";
						// if (d.children) {
						// 	// There is a maximum of two children!
						// 	var colours = d.children.map(colour),
						// 		a = d3.hsl(colours[0]),
						// 		b = d3.hsl(colours[1]);

						// 	// L*a*b* might be better here...
						// 	return d3.hsl((a.h + b.h) / 2, a.s * 1.2, a.l / 1.2);
						// }
						// return d.colour || "#fff";
					}

					// Interpolate the scales!
					function arcTween(d) {
						var my = maxY(d),
							xd = d3.interpolate(x.domain(), [d.x, d.x + d.dx]),
							yd = d3.interpolate(y.domain(), [d.y, my]),
							yr = d3.interpolate(y.range(), [d.y ? 20 : 0, radius]);
						return function(d) {
							return function(t) { x.domain(xd(t)); y.domain(yd(t)).range(yr(t)); return arc(d); };
						};
					}

					function maxY(d) {
						return d.children ? Math.max.apply(Math, d.children.map(maxY)) : d.y + d.dy;
					}

					// http://www.w3.org/WAI/ER/WD-AERT/#color-contrast
					function brightness(rgb) {
						return rgb.r * .299 + rgb.g * .587 + rgb.b * .114;
					}


					function clickWithName(name) {
						for (var i=0; i < nodes.length; i++) {
							if (nodes[i].name == name) {
								console.log("knockout filter to wheel click");
								console.log(nodes[i]);
							}
						}
					}

				}
		// //$("#barras").fadeOut();
		// setTimeout(function() {
		// 	updateBarras(JSON.stringify(arrayBarras));
		// //$("#barras").fadeIn();
		// },300); 

				// console.log(t);
				// $('#' + id + 'container').remove();
				// var string = '<div id="' + id + 'container">';
				// for (var i = 0; i < t.length; i++) {
				// 	string += "<p>" + t[i].count + " tweets has " + t[i].facet + " polarity.</p>"
				// }
				// string += '</div>';
				// $('#' + id).append(string);
			}

		// }
	};