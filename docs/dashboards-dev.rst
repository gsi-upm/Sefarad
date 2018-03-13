Sefarad dashboards
------------------

Dashboard development
~~~~~~~~~~~~~~~~~~~~~

Sefarad dashboards are also based in web components. Each dashboard is a collection of Sefarad widgets that displays different data.

Sefarad dashboards are created the same way as Sefarad widgets. For more information visit Developing your own widgets section.

Fetching data from elasticsearch
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The main difference between widgets and dashboards is that dashboards fetch the data passed to widgets.
This process require elastic-client component:

.. sourcecode:: html

    <elastic-client 
      config='{"host": " <!-- ELASTICSEARCH ENDPOINT GOES HERE --> "}' 
      client="{{client}}"
      cluster-status="{{myStatus}}">
    </elastic-client>

After client creation is possible to make queries. Create a new function inside your dashboard Polymer Object.

.. sourcecode:: javascript

     _query: function() {
        var that = this;
          this.client.search({
          // undocumented params are appended to the query string
          index: "<!-- ELASTICSEARCH INDEX -->",
          type: "<!-- ELASTICSEARCH DOCTYPE -->",
          body: {
            size: 10,
            query: {
              bool: {
                must: [],
              }
            }   
          }
          }).then(function (resp) {
            that.data = resp;            
            });
        }

Elasticsearch results are stored in a Javascript object called data. This data is passed to widgets like this number-chart widget example:

.. sourcecode:: html

    <number-chart 
        data="{{data}}"
        object="restaurant"
        title="Restaurants"
        icon="maps:local-dining"
        stylebg="bg-yellow">
    </number-chart>
