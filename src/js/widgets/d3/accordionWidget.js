// accordionWidget 
var accordionWidget = {
    // Widget name.
    name: "Accordion Widget",
    // Widget description.
    description: "An accordion widget which shows different filters",
    // Path to the image of the widget.
    img: "img/widgets/widgetMap.png",
    // Type of the widget.
    type: "accordionWidget",
    // Help display on the widget
    help: "Accordion help",
    // Category of the widget (1: textFilter, 2: numericFilter, 3: graph, 5:results, 4: other, 6:map)
    cat: 1,

    render: function () {
        var id = 'A' + Math.floor(Math.random() * 10001);
        var configid = 'A' + Math.floor(Math.random() * 10001);
        var field = accordionWidget.field || "";
        vm.activeWidgetsRight.push({
            "id": ko.observable(id),
            "configid": ko.observable(configid),
            "title": ko.observable(accordionWidget.name),
            "type": ko.observable(accordionWidget.type),
            "field": ko.observable(field),
            "collapsed": ko.observable(false),
            "showWidgetHelp": ko.observable(false),
            "help": ko.observable(accordionWidget.help),
            "showWidgetConfiguration": ko.observable(false)
        });

        accordionWidget.paintConfig(configid);
        accordionWidget.paint(id);
    },

    paintConfig: function (configid) {
        d3.select('#' + configid).selectAll('div').remove();
        var div = d3.select('#' + configid);
        div.attr("align", "center");

    },

    paint: function (id) {
        d3.select('#' + id).selectAll('div').remove();
        var div = d3.select('#' + id);
        div.attr("align", "center");
       
    }

};

// global vars