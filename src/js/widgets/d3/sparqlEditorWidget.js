/**
 * Created by asaura on 17/11/14.
 */
// Eurosentiment's SPARQL Editor
var sparqlEditorWidget = {
    // Widget name.
    name: "SPARQL Editor",
    // Widget description.
    description: "Offers some query templates with variable parameters",
    // Path to the image of the widget.
    img: "img/SPARQLeditor.png",
    // Type of the widget. Must be exactly the name of the .js file!
    type: "sparqlEditorWidget",
    // Help display on the widget
    help: "Results help",
    // Category of the widget (1: textFilter, 2: numericFilter, 3: graph, 5:results, 4: other, 6:map)
    cat: 4,

    render: function () {

        var id = 'A' + Math.floor(Math.random() * 10001);
        var configid = 'A' + Math.floor(Math.random() * 10001);
        var field = this.field || "";
        vm.activeWidgetsRight.push({
            "id": ko.observable(id),
            "configid": ko.observable(configid),
            "title": ko.observable(this.name),
            "type": ko.observable(this.type),
            "field": ko.observable(field),
            "collapsed": ko.observable(false),
            "showWidgetHelp": ko.observable(false),
            "help": ko.observable(this.help),
            "showWidgetConfiguration": ko.observable(false)
        });

        this.paintConfig(configid);
        this.paint(id);
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



