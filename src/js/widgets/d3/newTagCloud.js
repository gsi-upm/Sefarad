// Tag Cloud widget 2.0
// Author: Alejandro Saura Villanueva
var newTagCloud = {
    // Widget name.
    name: "New Tag Cloud Widget",
    // Widget description.
    description: "Performs faceted search",
    // Path to the image of the widget.
    img: "img/tagcloud_widget.png",
    // Type of the widget.
    type: "newTagCloudWidget",
    // Help display on the widget
    help: "This widget displays a tag cloud with all values of a selected field of the data.",
    // Category of the widget (1: textFilter, 2: numericFilter, 3: graph, 5:results, 4: other, 6:map) Obsolete
    cat: 4,


    render: function (loc) {

        if(loc != 'Left' && loc != 'Right') loc = 'Left';


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
    },

    paint: function (id) {

        //console.log('ResultsTable: Painting results table');


    }
};





