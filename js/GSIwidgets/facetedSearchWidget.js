/**
 * Created by asaura on 5/02/15.
 */


var facetedSearchWidget = {

    widgetDiv: "facetedSearchWidget",
    data: [],
    item_template: '',
    facetsDiv: "facets",
    settings: {},

    //These are all possible params for the settings object:
    //
    //settings = {
    //    items: [{a: 2, b: 1, c: 2}, {a: 2, b: 2, c: 1}, {a: 1, b: 1, c: 1}, {a: 3, b: 3, c: 1}],
    //    facets: {'a': 'Title A', 'b': 'Title B', 'c': 'Title C'},
    //    resultSelector: '#results',
    //    facetSelector: '#facets',
    //    facetContainer: '<div class=facetsearch id=<%= id %> ></div>',
    //    facetTitleTemplate: '<h3 class=facettitle><%= title %></h3>',
    //    facetListContainer: '<div class=facetlist></div>',
    //    listItemTemplate: '<div class=facetitem id="<%= id %>"><%= name %> <span class=facetitemcount>(<%= count %>)</span></div>',
    //    bottomContainer: '<div class=bottomline></div>',
    //    orderByTemplate: '<div class=orderby><span class="orderby-title">Sort by: </span><ul><% _.each(options, function(value, key) { %>' +
    //    '<li class=orderbyitem id=orderby_<%= key %>>' +
    //    '<%= value %> </li> <% }); %></ul></div>',
    //    countTemplate: '<div class=facettotalcount><%= count %> Results</div>',
    //    deselectTemplate: '<div class=deselectstartover>Deselect all filters</div>',
    //    resultTemplate: '<div class=facetresultbox><%= name %></div>',
    //    noResults: '<div class=results>Sorry, but no items match these criteria</div>',
    //    orderByOptions: {'a': 'by A', 'b': 'by B', 'RANDOM': 'by random'},
    //    state: {
    //        orderBy: false,
    //        filters: {}
    //    },
    //    showMoreTemplate: '<a id=showmorebutton>Show more</a>',
    //    enablePagination: true,
    //    paginationCount: 20
    //
    //}

    init: function () {

        //render the loading screen
        $("#" + this.widgetDiv).append('<div class="overlay" id="facet-overlay"> </div> <div class="loading-img" id="facet-loading-img"> </div>');

    },

    update: function () {

        //erase the content of our facetsDiv.
        $("#" + this.facetsDiv).html("");

        //Delete loading screen
        $("#facet-overlay").remove();
        $("#facet-loading-img").remove();


        //first: empty items
        while (this.settings.items.length > 0) {
            this.settings.items.pop();
        }

        //second: copy rawData into items
        for (var i = 0, len = this.data.length; i < len; i++) {
            this.settings.items[i] = this.data[i];
        }

        if (this.settings.items != 0) {

            $(this.settings.resultSelector).bind("facetedsearchresultupdate", function () {
                updateWidgets();
            });

            $.facetelize(this.settings);

        }

    }


};






