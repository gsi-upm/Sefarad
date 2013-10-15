// New widget
var widgetA = {
		// Widget name.
		name: "WidgetA Name",
		// Widget description.
		description: "WidgetA, description",
		// Path to the image of the widget.
		img: "img/widgetA.png",
		// Type of the widget.
		type: "widgetAChart",
		// [OPTIONAL] data taken from this field.
		field: "hasPolarity",

		render: function () {
			var id = 'A' + Math.floor(Math.random() * 10001);
			var field = widgetA.field || "";
			vm.activeWidgetsLeft.push({"id":ko.observable(id),"title": ko.observable(widgetA.name), "type": ko.observable(widgetA.type), "field": ko.observable(field),"collapsed": ko.observable(false)});
			
			widgetA.paint(field, id, widgetA.type);
		},

		paint: function (field, id, type) {
			var t = ko.utils.getDataColumns(field);
	
			if(t==undefined){
				vm.newWidgetGetData(field, id);
			}else{
				console.log(t);
				$('#' + id + 'container').remove();
				var string = '<div id="' + id + 'container">';
				for (var i = 0; i < t.length; i++) {
					string += "<p>" + t[i].count + " tweets has " + t[i].facet + " polarity.</p>"
				}
				string += '</div>';
				$('#' + id).append(string);
			}

		}
	};