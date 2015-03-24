/* global dc, L */
dc.customChart = function (_chart) {
    "use strict";

    _chart = dc.baseChart({});
    dc.registerChart(_chart, "");

    _chart.elementToUpdate = {};


    _chart._doRender = function () {

        var procData = transformData(_chart.dimension().top(Infinity));
        _chart.elementToUpdate.data = procData;

        _chart._postRender();

        return _chart._doRedraw();
    };


    _chart._postRender = function () {




    };

    _chart._doRedraw = function () {

        var procData = transformData(_chart.dimension().top(Infinity));
        _chart.elementToUpdate.data = procData;

        this.elementToUpdate.page = 1;




    };


    var transformData = function (data) {
        var auxArray = [];

        for (var i = 0; i < data.length; i++) {
            auxArray[i] = {};
            var j = 0;

            for (var prop in data[i]) {
                if (!data[i].hasOwnProperty(prop)) {
                    //The current property is not a direct property of p
                    continue;
                }

                //Do your logic with the property here

                //look into the paramSelector to see if we have to push this param into the table
                var found = false;


                for (var j = 0; j < _chart.elementToUpdate.columnSelector.length; j++) {
                    if (prop == _chart.elementToUpdate.columnSelector[j]) found = true;
                }



                if(found == true){  //This must be removed. Add a "column selector" control in widget preferences.
                    auxArray[i][prop] = data[i][prop].value;
                }

                j++;
            }

        }
        return auxArray;
    };



    return _chart;
};

