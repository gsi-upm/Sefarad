Developing your own dashboard
-----------------------------

In this section we will explain how to create new dashboards in Sefarad. First of all you can clone our dashboard development example from GitLab. Your dashboard should have the same files as this example.

.. sourcecode:: bash
	
	$ git clone https://lab.cluster.gsi.dit.upm.es/sefarad/demo-dashboard.git
	$ cd demo-dashboard

In addition, you have to define your dashboard structure as follows in **demo-dashboard.env.html** file, this is the main file of the development. Locate inside this file the `<template>` tag.

.. sourcecode:: html

  <template>
    <paper-tabs selected="{{selected}}">
      <paper-tab>Tab 1</paper-tab>
      <paper-tab>Tab 2</paper-tab>
    </paper-tabs>

    <iron-pages selected="{{selected}}">
      <div>
        TAB 1 CONTENT
      </div>
      <div>
        TAB 2 CONTENT
      </div>
    </iron-pages>
  </template>

Inside this `<template>` tag is your dashboard structure, as shown this sturcture has 2 tabs with no content. In this tutorial you will be able to fill them with Web Components. For the first tab we are going to use number-charts, install them adding following lines in `bower.json` file:

.. sourcecode:: json

	"number-chart": "number-chart#*"

Add this file to `imports.html`:

.. sourcecode:: html
	
	<link rel="import" href="/bower_components/number-chart/number-chart.html">


Now edit your TAB 1 CONTENT inside `demo-dashboard.env.html` with:

.. sourcecode:: html

	<div class="row">
	  <div class="col-md-4">
	    <number-chart
	      icon="info"
	      stylebg="bg-green"
	      subtitle="Total elements"
	      title="Total elements"
	      data="{{data}}">
	    </number-chart>
	  </div>
	  <div class="col-md-4">
	    <number-chart
	      icon="info"
	      stylebg="bg-aqua"
	      object="twitter"
	      aggKey="schema:author"
	      subtitle="Total elements"
	      title="Twitter"
	      data="{{data}}">
	    </number-chart>
	  </div>
	  <div class="col-md-4">
	    <number-chart
	      icon="info"
	      stylebg="bg-red"
	      object="facebook"
	      aggKey="schema:author"
	      subtitle="Total elements"
	      title="Facebook"
	      data="{{data}}">
	    </number-chart>
	  </div>
	</div>

Read all properties available for this Web Component in https://lab.cluster.gsi.dit.upm.es/sefarad/number-chart

Now run in order to install this web component:

.. sourcecode:: bash

	$ docker-compose up --build

Open in your Web Browser http://localhost:8080/ to check your new Web Components in Tab 1.

Now we are going to add some more web components to this tab, for example: a google-chart, a entities-chart, a social-media-chart and a happymap.

Installing them is like the previous one, we add them as dependencies in bower.json file:

.. sourcecode:: json

    "google-chart-elasticsearch": "google-chart-elasticsearch#^1.1.3",
    "entities-chart-ld": "entities-chart-ld#*",
    "social-media-chart": "social-media-chart#0.0.2",
    "happymap-element": "happymap-element#0.0.2"

Add this files to `imports.html`:

.. sourcecode:: html
	
	<link rel="import" href="/bower_components/google-chart-elasticsearch/google-chart.html">
	<link rel="import" href="/bower_components/entities-chart-ld/entities-chart.html">
	<link rel="import" href="/bower_components/social-media-chart/tweet-chart.html">
	<link rel="import" href="/bower_components/happymap-element/happymap-element.html">

Now add below previous web component inside `demo-dashboard.env.html`:

.. sourcecode:: html

        <div class="row"> 
          <div class="col-md-6">
            <google-chart
              field="marl:hasPolarity"
              data="{{data}}"             
              id='barsentiment'
              extra-id='1'
              type='column'
              filters="{{filters}}"
              icon='social:mood'
              options='{"title": "Sentiments"}'
              cols='[{"label": "Sentiment", "type": "string"},{"label": "Count", "type": "number"}]'>
            </google-chart>
          </div>
          <div class="col-md-6">
            <entities-chart
              field="topics.rdfs:subClassOf"
              data="{{data}}"
              title="Topics"
              icon="icons:list"
              param="{{param}}"
              id="entitieschart"
              filters="{{filters}}">
            </entities-chart>
          </div>
        </div>

        <div class="row"> 
          <div class="col-md-6">
            <div class="top-bar">
              <iron-icon icon="icons:list"></iron-icon>
              <span>Social Media Blogposts</span>
            </div>
           <tweet-chart 
              datos = "{{data}}"
              filters="{{filters}}">
          </div>
          <div class="col-md-6">
            <div class="top-bar">
              <iron-icon icon="maps:my-location"></iron-icon>
              <span>Geolocated News and Social Media</span>
            </div>
            <happymap-element data="[[getPlaces(data)]]"></happymap-element>
          </div>
        </div>

Now run in order to install this web components:

.. sourcecode:: bash

	$ docker-compose up --build

Open in your Web Browser http://localhost:8080/ to check your new Web Components in Tab 1.

Once you hace all your web components ready is time to retrieve data for your web components configuring your queries to ElasticSearch. This queries are set in Polymer Javascript inside *demo-dashboard.en.html*.

.. sourcecode:: javascript

	_clientChanged: function() {
	        console.log("ClientChanged");
	        ready = true;
	        this._query();
	      },
	_filtersChange: function() {
	        console.log("filtersChanged")
	        this._query();
	      },
	_query: function() {
	    //console.log("_query")
	    var that = this;
	    //console.log("Ready?: ", ready);
	    if(ready){
	      this.client.search({
	      // undocumented params are appended to the query string
	      index: "somedi",
	      body: {
	        size: 500,
	        query: {
	          bool: {
	            must: this.filters,
	          }
	        },
	        sort:{'schema:datePublished':{order: "desc"}},
	        aggs: {
	         type: {
	           terms: {
	             field: "@type.keyword",
	             order: {
	               _count: "desc"
	             }
	           }
	         },
	         'schema:author': {
	           terms: {
	             field: "schema:author.keyword",
	             order: {
	               _count: "desc"
	             }
	           }
	         },
	         'marl:hasPolarity': {
	           terms: {
	             field: "marl:hasPolarity.keyword",
	             size: 20,
	             order: {
	               _count: "desc"
	             } 
	           }
	         },
	         'entities.rdfs:subClassOf': {
	           terms: {
	             field: "entities.rdfs:subClassOf.keyword",
	             size: 20,
	             order: {
	               _count: "desc"
	             } 
	           }
	         },
	         'topics.rdfs:subClassOf': {
	           terms: {
	             field: "topics.rdfs:subClassOf.keyword",
	             size: 20,
	             order: {
	               _count: "desc"
	             } 
	           }
	         }
	        }
	      } 
	      }).then(function (resp) {
	        var myids = []
	        resp.hits.hits.forEach(function(entry){myids.push(entry._id)})
	        that.ids = myids;
	        //console.log(that.ids)
	        that.data = resp;
	        //console.log(that.data);
	        
	        });
	    }
	}

This JavaScript code make ElasticSearch queries and makes aggregtions on 'schema:author', 'marl:hasPolarity', 'entities.rdfs:subClassOf', 'topics.rdfs:subClassOf' fields. 
For more aggregations follow the same schema.

Finally we need to get coordinates for the map, this can be done adding a new function in Polymer JavaScript:

.. sourcecode:: javascript

	getPlaces: function(data){
	  var places = []
	  data.hits.hits.forEach( function (entry){
	    entry._source.entities.forEach(function(entity){
	      if ('latitude' in entity) {
	        places.push({'lat': entity.latitude, 'lon': entity.longitude, 'name': entry._source['schema:headline']})
	      }
	    })
	  })
	  return places
	}

If your data is not showing properly check your `.env` file for ElasticSearch endpoint configuration.