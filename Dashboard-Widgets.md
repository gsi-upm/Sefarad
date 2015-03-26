# Dashboard Widgets

Sefarad let the users define their own widgets that can read from common data and filter it.

This widgets are [Polymer](https://www.polymer-project.org/0.5/) web Components pluged inside the main content area (in a sortable div array that allows them to be dragged and dropped).

All web Components done with the Polymer frameworks should work just fine out-of-the-box. However, to take advantage of the Sefarad architecture, you may wish to implement filters and subscribe to data changes inside your widget, so lets see how we achieve this:

Sefarad filtering core is [crossfilter.js](https://github.com/square/crossfilter), a smart library that can handle, sort, and filter thousands of data entries.

In controller.js (our tiny main script) we load our data into a crossfilter object.
After loading the data, each widget in the dashboard is filled with an initial configuration.
Inside these initial parameters, controller.js pass to each widget the reference of the crossfilter object.
With this reference, each widget can create dimensions.

_**IMPORTANT NOTE**: The definition of the dimensions must be done inside each widget's code. Dimensions will depend on data parameters (that vary between datasets) and could be changed runtime via widget configuration if needed, so each widget is the responsible of creating dinamically the dimensions it is going to use._

But this is not enough to filter information in Sefarad. In top of crossfilter each widget must implement a [dc.js](http://dc-js.github.io/dc.js/) base chart object
