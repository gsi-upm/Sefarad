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







    };



    //var selectFilter = function (e) {
    //    if (!e.target) {
    //        return;
    //    }
    //
    //    //_chart._computeOrderedGroups(_chart.data()).forEach(function (d, i) {
    //    //    if(e.target.key == d.key){
    //    //        d.value = 1;
    //    //    }else
    //    //    {
    //    //        d.value = 0;
    //    //    }
    //    //
    //    //});
    //
    //    //for (var j = 0; j < _dataMap.length; j++) {
    //    //    if (j == e.target.key) {
    //    //        _dataMap[e.target.key].i = 1;
    //    //    }else
    //    //    {
    //    //        _dataMap[j].i = 0;
    //    //    }
    //    //}
    //
    //
    //    var filter = e.target.key;
    //    dc.events.trigger(function () {
    //
    //        _chart.filter(filter);
    //        if(_chart.filters().indexOf(filter) != -1){
    //            _chart.mustReDrawBool(false);
    //        }else
    //        {
    //            _chart.map().closePopup(); //avoid showing the popup, cause we are deselecting.
    //        }
    //
    //        dc.redrawAll(_chart.chartGroup());
    //    });
    //};

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
                //Do your logic with the property here
                if(prop == "name" || prop == "designation"){  //This must be removed. Add a "column selector" control in widget preferences.
                    auxArray[i][prop] = data[i][prop].value;
                }

                j++;
            }

        }
        return auxArray;
    };



    return _chart;
};

