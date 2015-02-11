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

    //other variables:
    stream: 1,
    param: "", //the field we have explore in data to get the values and render them.
    values: [], //[i]["value"]=value, [i]["quantity"]=quantity
    activeFilters: [],

    configid: "",
    id: "",

    filterIdGenerator: 0,

    create: function () {
        vm.createNewWidget(this);
    },


    render: function (loc) {

        if(loc != 'Left' && loc != 'Right') loc = 'Left';


        this.id = 'A' + Math.floor(Math.random() * 10001);
        this.configid = 'A' + Math.floor(Math.random() * 10001);
        var field = this.field || "";
        //var id = ko.observable(this.id);
        //var configid = ko.observable(this.configid);
        //var title = ko.observable(this.name);
        //var type = ko.observable(this.type);
        //var field = ko.observable(field);
        //var collapsed = ko.observable(false);
        //var showWidgetHelp = ko.observable(false);
        //var help = ko.observable(this.help);
        //var showWidgetConfiguration = ko.observable(false);


        var properties = {
            "id": ko.observable(this.id),
            "configid": ko.observable(this.configid),
            "title": ko.observable(this.name),
            "type": ko.observable(this.type),
            "field": ko.observable(field),
            "collapsed": ko.observable(false),
            "showWidgetHelp": ko.observable(false),
            "help": ko.observable(this.help),
            "showWidgetConfiguration": ko.observable(false)
        };

        vm.addNewWidget(properties, loc);

        //this.getValues(this.param);

        this.paintConfig(this.configid);
        this.paint(this.id);
    },

    paintConfig: function (configid) {

        d3.select('#' + configid).selectAll('div').remove();
        var div = d3.select('#' + configid);
        div.attr("align", "center");

        var configDiv = div.append("div");

        configDiv.append("span").text("Please select the data stream to filter:");
        configDiv.append("p");

        //var streamSelector = configDiv.append("select").attr("id", "streamSelector"+this.id).attr("onchange", "newTagCloud.onStreamSelectorChange()");
        var streamSelector = configDiv.append("select").attr("id", "streamSelector"+this.id).attr("onchange", "newTagCloud.streamSelectorChangedOnWidget("+this.id+")");
        //var streamSelector = configDiv.append("select").attr("id", "streamSelector"+this.id);
        //$('#streamSelector'+this.id).change(this.onStreamSelectorChange());
        //$('#streamSelector'+this.id).change(function () {});

        for (var i=0; i < vm.streams.length; i++)
        {
            var option = streamSelector.append("option").attr("value", vm.streams[i]["name"]).text(vm.streams[i]["name"]);
            if(i == this.stream) option.attr("selected", "selected");
        }

        configDiv.append("p");

        configDiv.append("span").text("Please select the param to filter:");
        configDiv.append("p");

        var paramSelector = configDiv.append("select").attr("id", "paramSelector"+this.id).attr("onchange", "newTagCloud.paramSelectorChangedOnWidget("+this.id+")");
        //var paramSelector = configDiv.append("select").attr("id", "paramSelector"+this.id);
        //$('#streamSelector'+this.id).change(this.onParamSelectorChange());

        for (property in vm.rawData[this.stream]()[0])
        {
            //we fill teh selector with calues except the id field and those endind in "Resource"
            if((property != "id") && (property.match(/Resource/g) == null))
            {
                paramSelector.append("option").attr("value", property).text(property);
            }
        }

        if(this.param == "") this.param = paramSelector[0][0].value;

        configDiv.append("p");


    },

    //static method, being called by the HTML selector and in charge of searching the widget object
    //that it belongs to.
    streamSelectorChangedOnWidget: function (object){

        //for each Widget in widgetX, iterate to find wich one matches the id, and call its
        //onStreamSelectorChange function

        var id = object[0].getAttribute("id");

        for (var j=0; j < vm.newActiveWidgets.length; j++)
        {
            if(vm.newActiveWidgets[j].id == id)
            {
                vm.newActiveWidgets[j].onStreamSelectorChange();
                break;
            }
        }

    },

    //static method, being called by the HTML selector and in charge of searching the widget object
    //that it belongs to.
    paramSelectorChangedOnWidget: function (object){

        //for each Widget in widgetX, iterate to find wich one matches the id, and call its
        //onStreamSelectorChange function

        var id = object[0].getAttribute("id");

        for (var j=0; j < vm.newActiveWidgets.length; j++)
        {
            if(vm.newActiveWidgets[j].id == id)
            {
                vm.newActiveWidgets[j].onParamSelectorChange();
                break;
            }
        }

    },

    //static method, being called by the HTML selector and in charge of searching the widget object
    //that it belongs to.
    onTagSelectedOnWidget: function (tag, object){

        //for each Widget in widgetX, iterate to find wich one matches the id, and call its
        //onStreamSelectorChange function

        var id = object[0].getAttribute("id");

        for (var j=0; j < vm.newActiveWidgets.length; j++)
        {
            if(vm.newActiveWidgets[j].id == id)
            {
                vm.newActiveWidgets[j].onTagSelected(tag);
                break;
            }
        }

    },



    paint: function (id) {

        d3.select('#' + id).selectAll('div').remove();
        d3.select('#' + id).selectAll('h2').remove();
        var div = d3.select('#' + id);
        div.attr("align", "center");
        div.attr("style", "max-height: 300px; overflow: scroll;");


        this.getValues(this.param);

        var tagsDiv = div.append("div").attr("class", "tagarea")
        var tag;
        var valueSpan;
        var countSpan;
        for (var j=0; j < this.values.length; j++)
        {
            tag = tagsDiv.append("a").attr("onClick", "newTagCloud.onTagSelectedOnWidget(this, "+this.id+")").attr("class", "tag").attr("style", "cursor: pointer;").attr("value", this.values[j]["value"]);
            valueSpan = tag.append("span").text(this.values[j]["value"]);
            countSpan = tag.append("span").attr("class", "count").text(this.values[j]["quantity"]);
        }
        



    },

    filterPrototype: {
        id: "",
        type: "union",
        parentId: "",
        param: "",
        filterValue: "",
        filterFunction: function (array)
        {
            //begin
            // items which [_param] is [_value].
            // saves in filterResults[1] the result

            var result = [];

            for (var i = 0; i < array.length; i++) {
                if (array[i]["_param"].value() == "_value") {
                    result.push(array[i]);
                }
            }
            return result;
            //end
        }
    },

    getValues: function (param) {

        this.values = [];

        loop1:
        for (var i=0; i < vm.rawData[this.stream]().length; i++)
        {
            var value = vm.rawData[this.stream]()[i][param].value();
            var found = false;

            loop2:
                for (var j=0; j < this.values.length; j++)
                {
                    if(this.values[j]["value"] == value)
                    {
                        this.values[j]["quantity"]++; //add 1 to quantity
                        found = true;
                    }
                }

            if(!found) //is a new value, so add a new entry to values[] with quantity=1
            {
                var length = this.values.length;
                this.values[length] = [];
                this.values[length]["value"] = value;
                this.values[length]["quantity"] = 1;
            }

        }
    },

    onStreamSelectorChange: function () {

        //remove al filters
        this.removeAllFilters();

        var selector = document.getElementById('streamSelector'+this.id);

        var text = selector.options[selector.selectedIndex].innerHTML;

        var streamNumber;
        loop1:
        for (var i=0; i < vm.streams.length; i++)
        {
            if(vm.streams[i]["name"] == text) {
                streamNumber = i;
                break loop1;
            }
        }

        console.log('stream selector has changed, value = '+ streamNumber);

        this.stream = streamNumber;

        d3.select('#' + this.id).selectAll('div').remove();
        this.paintConfig(this.configid); //just repaint the paintConfig area to update the params to filter.




    },

    onParamSelectorChange: function () {

        //remove al filters
        this.removeAllFilters();

        var selector = document.getElementById('paramSelector'+this.id);

        var text = selector.options[selector.selectedIndex].innerHTML;

        this.param = text;

        this.paint(this.id);

    },

    onTagSelected: function (tag) {

        if(tag.getAttribute("class") == "tag") //being selected
        {

            tag.setAttribute("class", "tag selected"); //Highlight the tab
            tag.setAttribute("filterId", this.id + this.filterIdGenerator); //leave info about the filter id associated



            //add filter to vm stream and to our local array
            this.addFilter(tag.getAttribute("value"));


        }else{
            if(tag.getAttribute("class") == "tag selected") //being unselected
            {
                tag.setAttribute("class", "tag"); //Restore the tab appearance

                //remove filter from vm stream
                this.removeFilter(tag.getAttribute("filterId"))
            }
        }




    },

    addFilter: function (value) {

        var filter = Object.create(this.filterPrototype);
        filter.id = this.id + this.filterIdGenerator;
        filter.param = this.param;
        filter.value = value;
        filter.parent = this.id;

        //for the filterFunction, we bake the param and the value on the function code:
        var stringFunction = filter.__proto__.filterFunction.toString();

        stringFunction = stringFunction.replace(/_param/g, this.param);
        stringFunction = stringFunction.replace(/_value/g, value);

        //crop the string to get just the body
        var begin = stringFunction.indexOf("//begin");
        var end = stringFunction.indexOf("//end");
        stringFunction = stringFunction.substring(begin, end);

        filter.filterFunction = new Function('array', stringFunction);

        //add its Id to our local array of active filters
        this.activeFilters.push(this.id + this.filterIdGenerator);
        this.filterIdGenerator ++;

        //finally add the filter to the stream pipeline
        vm.addFilter(filter, this.stream);

        //and update the filter Pipeline
        vm.filterPipeline();
    },

    removeFilter: function (filterId) {

        //pull from selectedValues for the filtering
        var index = this.activeFilters.indexOf(filterId);
        this.activeFilters.splice(index, 1);

        vm.removeFilter(filterId, this.stream);
        vm.filterPipeline();
    },

    removeAllFilters: function () {

        for (var i=0; i < this.activeFilters.length; i++)
        {
            vm.removeFilter(this.activeFilters[i], this.stream);
        }
        this.activeFilters = [];
        vm.filterPipeline();
    }




};







