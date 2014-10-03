// Results widget 3.0
var newResultsWidget = {
    // Widget name.
    name: "new Results Widget",
    // Widget description.
    description: "List of the query results with links to the info",
    // Path to the image of the widget.
    img: "img/results_vertical.png",
    // Type of the widget.
    type: "newResultsWidget",
    // Help display on the widget
    help: "Results help",
    // Category of the widget (1: textFilter, 2: numericFilter, 3: graph, 5:results, 4: other, 6:map)
    cat: 5,

    render: function () {
        var id = 'A' + Math.floor(Math.random() * 10001);
        var configid = 'A' + Math.floor(Math.random() * 10001);
        var field = newResultsWidget.field || "";
        vm.activeWidgetsRight.push({
            "id": ko.observable(id),
            "configid": ko.observable(configid),
            "title": ko.observable(newResultsWidget.name),
            "type": ko.observable(newResultsWidget.type),
            "field": ko.observable(field),
            "collapsed": ko.observable(false),
            "showWidgetHelp": ko.observable(false),
            "help": ko.observable(newResultsWidget.help),
            "showWidgetConfiguration": ko.observable(false)
        });

        newResultsWidget.paintConfig(configid);
        newResultsWidget.paint(id);
    },

   paintConfig: function (configid) {
        d3.select('#' + configid).selectAll('div').remove();
        var div = d3.select('#' + configid);
        div.attr("align", "center");

        //Create filter toolbar
        var toolbar_div = div.append("div")
            .attr("id","toolbar");

        var filter_input = toolbar_div.append("input")
            .attr("id", "filter")
            .attr("type", "text")
            .attr("size", 100);       

    },

    paint: function (id) {
        d3.select('#' + id).selectAll('div').remove();
        var div = d3.select('#' + id);
        div.attr("align", "center");

        d3.select('#' + id).selectAll('table').remove();

        var table = div.append("table").attr("style", "margin-left: 5px"),
        thead = table.append("thead"),
        tbody = table.append("tbody");

        data = new Array();
        
        $.each(vm.shownSparqlData(), function(index, item) {             
            data.push(item);
        });       

        rows = d3.select("tbody");        
        rows.data(data.filter(function(d,i){return d;}))
        .enter()
        .append("tr");
        //.append("hr");
        rows.append("h2").text(function(d) {return d.university.value();});        
        rows.append("h4").text(function(d) {return d.country.value();});  
        rows.append("hr");      

        newResultsWidget.initnewResultsWidget();
    },
    

    initnewResultsWidget: function () {
       
        
    }
};

// Global variables
var newResultsWidget;
var data;
var rows;
