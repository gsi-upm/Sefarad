/**
 * Created by asaura on 17/11/14.
 */
// New widget

var newWidgetTemplate = { //IMPORTANT: the var name must match the name of the file without the .js extension

    // Widget name.
    name: "A brand new widget",
    // Widget description.
    description: "Offers some query templates with variable parameters",
    // Path to the image of the widget.
    img: "img/widgetImage.png",
    // Type of the widget. Must be unique between all widgets
    type: "type",
    // Help display on the widget
    help: "help",
    // Category of the widget (1: textFilter, 2: numericFilter, 3: graph, 5:results, 4: other, 6:map)
    cat: 4,

    create: function () {
        vm.createNewWidget(this);
    },

    render: function (loc) {

        loc = typeof loc !== 'undefined' ? loc : "Left";

        var id = 'A' + Math.floor(Math.random() * 10001);
        var configid = 'A' + Math.floor(Math.random() * 10001);
        var field = this.field || "";
        var properties = {
            "id": ko.observable(id),
            "configid": ko.observable(configid),
            "title": ko.observable(this.name),
            "type": ko.observable(this.type),
            "field": ko.observable(field),
            "collapsed": ko.observable(false),
            "showWidgetHelp": ko.observable(false),
            "help": ko.observable(this.help),
            "showWidgetConfiguration": ko.observable(false)
        };

        vm.addNewWidget(properties, loc);

        this.paintConfig(configid);
        this.paint(id);
    },

    paintConfig: function (configid) {
        d3.select('#' + configid).selectAll('div').remove();
        var div = d3.select('#' + configid);
        div.attr("align", "center");


        //CONFIGURATION AREA. HERE YOU CAN DRAW IT AND ADD ITS FUNCTIONALITY

    },

    paint: function (id) {

        d3.select('#' + id).selectAll('div').remove();
        var div = d3.select('#' + id);
        div.attr("align", "center");


        //HERE IS WHERE YOUR CODE CAN GET INFO, DRAW OR INJECT DATA.


    }
};



