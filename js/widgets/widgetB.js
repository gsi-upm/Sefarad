// New widget
var widgetB = {
		// Widget name.
		name: "WidgetB Name",
		// Widget description.
		description: "WidgetB, description",
		// Path to the image of the widget.
		img: "img/widgetB.png",
		// Type of the widget.
		type: "widgetBChart",

		render: function () {
			var id = 'B' + Math.floor(Math.random() * 10001);
			var field = widgetB.field || "";
			vm.activeWidgetsLeft.push({"id":ko.observable(id),"title": ko.observable(widgetB.name), "type": ko.observable(widgetB.type), "field": ko.observable(field),"collapsed": ko.observable(false)});
			
			widgetA.paint(field, id, widgetB.type);
		},

		paint: function (field, id, type) {
			$('#' + id + 'container').remove();
			$('#' + id).append('<div id="' + id + 'container"><p>Data from widget B</p></div>');
		}
	};