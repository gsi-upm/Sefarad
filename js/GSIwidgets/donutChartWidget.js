/**
 * Created by asaura on 9/02/15.
 */

var donutChartWidget = {

    widgetDiv: "", //the id of the div where we are going to draw the chart
    data: {},
    param: "", //which param values to draw

    init: function () {

        //render the loading screen
        $("#" + this.widgetDiv).append('<div class="overlay" id="donnut-overlay"> </div> <div class="loading-img" id="donnut-loading-img"> </div>');

        //TO-DO: hacer que cuando se arrastre de un sitio a otro, se llame a su update.

    },

    update: function () {

        //Delete loading screen
        $("#donnut-overlay").remove();
        $("#donnut-loading-img").remove();

        //erase the content of our div.
        $("#chartDiv").html("");
        //create the div of our donnut chart
        $("#chartDiv").append('<div class="chart" id="donnutChart"></div>');

        if (this.data.length > 0) {

            var valuesCounter = []; //bidimensional array. First column for value name. Second for counter

            //loop through data values of the selected param and count coincidences
            loop1:
                for (var i = 0; i < this.data.length; i++) {
                    var name = this.data[i][this.param];
                    var found = false;
                    loop2:
                        for (var j = 0; j < valuesCounter.length; j++) {
                            if (name == valuesCounter[j]["label"]) {
                                found = true;
                                valuesCounter[j]["value"] += 1;
                                break loop2;
                            }
                        }
                    if (!found) {
                        valuesCounter[valuesCounter.length] = [];
                        valuesCounter[valuesCounter.length - 1]["label"] = name;
                        valuesCounter[valuesCounter.length - 1]["value"] = 1;
                    }
                }


            //finally, render the data
            var donut = new Morris.Donut({
                element: "donnutChart",
                resize: false,
                colors: ["#82A2C9", "#4D6E96", "#2B4A6F", "#132B49", "#041222", "#FFFE9D", "#E5E36C", "#AAA939", "#6F6E15", "#353403"],
                data: valuesCounter,
                hideHover: 'auto'
            });
        }
        else {
            var donut = new Morris.Donut({
                element: 'donnutChart',
                resize: false,
                colors: ["#3c8dbc"],
                data: [
                    {label: "No results", value: 0}
                ],
                hideHover: 'auto'
            });
        }

    }
}
