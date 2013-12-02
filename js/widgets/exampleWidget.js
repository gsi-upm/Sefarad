var exampleWidget = {
	name: 'Example Widget',

	description: 'Example widget to select the field of the data',

	img: 'img/stockwidget.png',

	type: 'exampleWidget',

	render: function() {
		var id = 'A' + Math.floor(Math.random() * 10001);
		var field = exampleWidget.field || "";
		vm.activeWidgetsRight.push({"id":ko.observable(id),"title": ko.observable(exampleWidget.name), "type": ko.observable(exampleWidget.type), "field": ko.observable(field),"collapsed": ko.observable(false)});

		// stockWidget.paint(field, id, stockWidget.type);
		exampleWidget.paint(id);
	},

	// Options to save 
	options: {

	},

	paint: function(id) {
		// Erase all the content of the widget
		$('#' + id).empty();

		$('#'+id).append("<div></div>")
		$('#' + id + ' > div').addClass('widget-configuration');

		for (var i = 0; i < vm.resultsGraphs().length; i++) {
			$('#' + id + ' > div').append('<input type="radio" name="group' + id + '" value="' + vm.resultsGraphs()[i].type() + '">' + vm.resultsGraphs()[i].type() + '</input>')
		}

		valorSeleccionado = exampleWidget.options[id];

		$('input:radio').on('change', function(){
			valorSeleccionado = $('input:radio[name=group' + id + ']:checked').val();
			exampleWidget.options[id] = valorSeleccionado;
			exampleWidget.paint(id)
		});

		if (exampleWidget.options[id] != undefined) {
			$('#'+id).append('<div id="tooltip">' + exampleWidget.options[id].toUpperCase() + '</div>');
			$('input[name="group' + id + '"][value="' + exampleWidget.options[id] + '"]').prop('checked', true);
			$('#'+id + ' > .widget-configuration').hide();
		} else {
			$('#'+id).append('<div id="tooltip"></div>');
			$("#" + id + " > #tooltip").append("No hay ningún campo seleccionado.");
			return;
		}

	}

}