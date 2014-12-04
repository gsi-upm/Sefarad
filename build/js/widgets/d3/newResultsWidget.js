// Results widget 3.0
var newResultsWidget = {
    // Widget name.
    name: "Results Table",
    // Widget description.
    description: "List of the query results with links to the info",
    // Path to the image of the widget.
    img: "img/results_vertical.png",
    // Type of the widget.
    type: "newResultsWidget",
    // Help display on the widget
    help: "This widget shows the total filtered results. The user can show or hide the different columns of the data, sort the elements by any of the attributes and search any result. If any result contains a link to the URI of its web resource, it can be directly accessed by clicking on it, so it will open a new tab. ",
    // Category of the widget (1: textFilter, 2: numericFilter, 3: graph, 5:results, 4: other, 6:map)
    cat: 5,



    render: function (loc) {

        if(loc != 'Left' && loc != 'Right') loc = 'Left';

        var id = 'A' + Math.floor(Math.random() * 10001);
        var configid = 'A' + Math.floor(Math.random() * 10001);
        var field = newResultsWidget.field || "";
        var properties = {
            "id": ko.observable(id),
            "configid": ko.observable(configid),
            "title": ko.observable(newResultsWidget.name),
            "type": ko.observable(newResultsWidget.type),
            "field": ko.observable(field),
            "collapsed": ko.observable(false),
            "showWidgetHelp": ko.observable(false),
            "help": ko.observable(newResultsWidget.help),
            "showWidgetConfiguration": ko.observable(false)
        };

        vm.addNewWidget(properties, loc);

        newResultsWidget.paintConfig(configid);
        newResultsWidget.paint(id);
    },

    paintConfig: function (configid) {
        d3.select('#' + configid).selectAll('div').remove();
        var div = d3.select('#' + configid);
        div.attr("align", "center");
    },

    paint: function (id) {

        //Here we save the visibility state of the columns (in case of existance) in order to repaint correctly
        var tableState = [];
        if (resultsTable != null) {
            for (i = 0; i < resultsTable.columns()[0].length; i++) {
                tableState [i] = resultsTable.column(i).visible();
            }
        }

        d3.select('#' + id).selectAll('div').remove();
        var div = d3.select('#' + id);
        div.attr("align", "center");

        var tablediv = div.append("div").attr("id", "tableDiv")
            .attr("style", "height: 100%; width: 100%");

        //Create the table
        var table = tablediv.append("table").attr("id", "resultsTable").attr("class", "cell-border").attr("cellspacing", "0").attr("style", "height: 100%; width: 100%");
        //.attr("class", "display");
        thead = table.append("thead");
        tbody = table.append("tbody");
        tfoot = table.append("tfoot");

        //Extract the data from vm variable
        var data = new Array();
        $.each(vm.filteredData(), function (index, item) {
            data.push(item);
        });

        //If we search with the faceted search (at the top of the page) and get no results (filteredData is null), we have to take the header info from non-filtered data
        if (data.length == 0) {

            data = new Array();
            $.each(vm.viewData(), function (index, item) {
                data.push(item);
            });

            //make a faceted search. Using a boolean in order to perform the search when the table is initialized.
            //searchDone = true;

        }

        try {


            //Print the header line
            var hrow = thead.append("tr");
            for (i = 0; i < Object.keys(data[0]).length; i++) {
                if (Object.keys(data[0])[i].match(/Resource/g) == null) {
                    hrow.append("th").text(Object.keys(data[0])[i]);
                }
                //hrow.append("th").text(Object.keys(data[0])[i]);
            }

            //Print the footer line
            var frow = tfoot.append("tr");
            for (i = 0; i < Object.keys(data[0]).length; i++) {
                if (Object.keys(data[0])[i].match(/Resource/g) == null) {
                    frow.append("th").text(Object.keys(data[0])[i]);
                }
            }

            //Print the data with links to dbpedia. data (+ dataResource as link)
            for (i = 0; i < data.length; i++) {
                var row = tbody.append("tr");
                for (j = 0; j < Object.keys(data[0]).length; j++) {
                    if (Object.keys(data[0])[j].match(/Resource/g) == null) //Pasamos de las columnas que acaben en ...Resource
                    {
                        var link = row.append("td").append("a");
                        link.attr("target", "_blank");
                        link.text(data[i][Object.keys(data[0])[j]].value());
                        for (m = 0; m < Object.keys(data[0]).length; m++) //Buscamos si tiene su columna ...Resource adjunta para ponerle su contenido de link
                        {
                            //construct the pattern
                            var resourceName = Object.keys(data[0])[j] + "Resource";
                            //look for the resource column
                            if (Object.keys(data[0])[m] == resourceName) {
                                link.attr("href", data[i][Object.keys(data[0])[m]].value());

                            }

                        }
                    }
                }
            }

        }catch(e){
            //Create the message div
            var message_div = div.append("div")
                .attr("id", "message_div");

            message_div.append("text")
                .text("No data to show");

            console.log("Results widget couldn't render the results. Probably they're empty.");
        }

        //Table inicialization depending on the language
        switch (vm.lang()[Object.keys(vm.lang())[0]]) {

            default:
                resultsTable = $('#resultsTable').DataTable({

                    dom: 'C<"clear">lfrtip',
                    "scrollX": true,

                    "scrollCollapse": true,
                    "destroy": true,
                    "language": {
                        "lengthMenu": "Display _MENU_ records per page",
                        "zeroRecords": "Nothing found - sorry",
                        "info": "Showing page _PAGE_ of _PAGES_",
                        "infoEmpty": "No records available",
                        "search": "Filter:",
                        "infoFiltered": "(filtered from _MAX_ total records)"
                    }
                    //"dom": 'C&gt;"clear"&lt;lfrtip'

                });
                break;

            case "Español":
                resultsTable = $('#resultsTable').DataTable({

                    dom: 'C<"clear">lfrtip',
                    "scrollX": true,

                    "scrollCollapse": true,
                    "destroy": true,
                    "language": {
                        "lengthMenu": "Mostrar _MENU_ resultados por página",
                        "zeroRecords": "No se encontraron resultados - lo sentimos",
                        "info": "Mostrando página _PAGE_ de _PAGES_",
                        "infoEmpty": "No hay resultados disponibles",
                        "search": "Filtrar:",
                        "infoFiltered": "(filtrados de _MAX_ resultados totales)"
                    }
                    //"dom": 'C&gt;"clear"&lt;lfrtip'

                });
                break;

        }


        //Hide the columns in order to the previous state
        if (tableState.length != 0) {
            for (i = 0; i < tableState.length; i++) {
                resultsTable.column(i).visible(tableState [i]);
            }
            $.fn.dataTable.ColVis.fnRebuild();
        }


        //if(searchDone == true) resultsTable.search('no results found').draw();
    }
};

// Global variables

var descriptionData;
var enabledColumn;
var searchDone;
var resultsTable;

//Debug variables;

