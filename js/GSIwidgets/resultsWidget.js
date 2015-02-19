/**
 * Created by asaura on 11/02/15.
 */
var resultsWidget = {

    widgetDiv: "", //the id of the div where we are going to draw the chart
    data: {},
    resultsTable: null,
    colVis: null,


    init: function () {

        //render the loading screen
        $("#" + this.widgetDiv).append('<div class="overlay" id="results-overlay"> </div> <div class="loading-img" id="results-loading-img"> </div>');

    },

    update: function () {
        //Delete loading screen
        $("#results-overlay").remove();
        $("#results-loading-img").remove();

        //erase the content of our div.
        $("#resultsDiv").html("");
        var tablediv = d3.select('#resultsDiv');


        //Here we save the visibility state of the columns (in case of existance) in order to repaint correctly
        var tableState = [];
        if (this.resultsTable != null) {
            for (i = 0; i < this.resultsTable.columns()[0].length; i++) {
                tableState [i] = this.resultsTable.column(i).visible();
            }
            console.log('ResultsTable: Table columns state saved');
        }

        var table = tablediv.append("table").attr("id", "resultsTable").attr("class", "table table-bordered table-striped");

        thead = table.append("thead");
        tbody = table.append("tbody");
        tfoot = table.append("tfoot");

        //Extract the data from vm variable, taking out the polygon field
        var auxData = new Array();
        $.each(this.data, function (index, item) {
            //remove the polygon field
            var dataItem = $.extend({}, item);
            delete dataItem["fWKT"];
            auxData.push(dataItem);
        });

        //If we search with the faceted search (at the top of the page) and get no results (filteredData is null), we have to take the header info from non-filtered data
        if (auxData.length == 0) {
            auxData = new Array();
            $.each(this.data, function (index, item) {
                auxData.push(item);
            });
        }

        //Print the header line
        var hrow = thead.append("tr");
        for (i = 0; i < Object.keys(auxData[0]).length; i++) {
            if (Object.keys(auxData[0])[i].match(/Resource/g) == null) {
                hrow.append("th").text(Object.keys(auxData[0])[i]);
            }
        }

        //Print the footer line
        var frow = tfoot.append("tr");
        for (i = 0; i < Object.keys(auxData[0]).length; i++) {
            if (Object.keys(auxData[0])[i].match(/Resource/g) == null) {
                frow.append("th").text(Object.keys(auxData[0])[i]);
            }
        }

        //Print the data with links to dbpedia. data (+ dataResource as link)
        for (i = 0; i < auxData.length; i++) {
            var row = tbody.append("tr");
            for (j = 0; j < Object.keys(auxData[0]).length; j++) {
                if (Object.keys(auxData[0])[j].match(/Resource/g) == null) //Dont take the columns ending in ...Resource
                {
                    var link = row.append("td").append("a");
                    link.attr("target", "_blank");
                    link.text(auxData[i][Object.keys(auxData[0])[j]]);
                    for (m = 0; m < Object.keys(auxData[0]).length; m++) //Looks for its ...Resource column to add a link to its resource
                    {
                        //construct the pattern
                        var resourceName = Object.keys(auxData[0])[j] + "Resource";
                        //look for the resource column
                        if (Object.keys(auxData[0])[m] == resourceName) {
                            link.attr("href", auxData[i][Object.keys(auxData[0])[m]]);

                        }

                    }
                }
            }
        }

        //Table initialization
        this.resultsTable = $('#resultsTable').DataTable({

            "bPaginate": true,
            "bLengthChange": true,
            "bFilter": false,
            "bSort": true,
            "bInfo": true,
            "bAutoWidth": false

        });

        //Create the colVis button
        $(".ColVis").remove();
        this.colvis = new $.fn.dataTable.ColVis(this.resultsTable);
        $(this.colvis.button()).insertAfter('div.inf'); //This must be moved someday to some kind of configuration zone instead of being in the data zone.
        $.fn.dataTable.ColVis.fnRebuild();


        //Hide the columns in order to the previous state
        if (tableState.length != 0) {
            for (i = 0; i < tableState.length; i++) {
                this.resultsTable.column(i).visible(tableState [i]);
            }
            $.fn.dataTable.ColVis.fnRebuild();
        }


    }

};