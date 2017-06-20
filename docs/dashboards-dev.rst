Developing your own dashboard
-----------------------------

In this section we will explain how to create new dashboards in Sefarad, or import existing ones. First of all you can clone our dashboard development example from GitLab. Your dashboard should have the same files as this example.

.. sourcecode:: bash
	
	$ git clone https://lab.cluster.gsi.dit.upm.es/sefarad/dashboard-tourpedia.git
	$ cd dashboard-tourpedia

In addition, you have to define your dashboard structure as follows in **my-dashboard.html** file, this is the main file of the development. In our example this file is called `dashboard-tourpedia.html`

.. sourcecode:: html

	<dom-module id="my-dashboard">

 	<template>
	  	<!--   dashboard content   -->
 	</template>

	</dom-module>


Inside ``<dom-module>`` tag you have to define your new Polymer dashboard adding some JavaScript:

.. sourcecode:: javascript
	

	Polymer({
		is: 'my-dashboard',
		properties: {
			// dashboard properties
		},
		ready: function(){
			do_some_function();    	
		}
	});

Is also necessary to specify dependencies (i.e your Widgets) for this dashboard using a bower.json file. The structure of this file is like this example:

.. sourcecode:: json

	{
	  "name": "my-dashboard",
	  "homepage": "https://lab.cluster.gsi.dit.upm.es/sefarad/your-dashboard-url",
	  "authors": [
	    "GSI-UPM"
	  ],
	  "description": "",
	  "main": "",
	  "license": "MIT",
	  "dependencies": {
	    "paper-card": "PolymerElements/paper-card#^1.1.4",
	    "polymer": "polymer#*",
	    "google-chart-elasticsearch": "google-chart-elasticsearch#*"
	}

If you want to make your dashboard installable via bower you can register this package. This requires to have a git repository with all your dashboard code.

.. sourcecode:: bash

	$ bower register <my-package-name> <git-endpoint>


Now is time to test your dashboard visualisation, create an `index.html` inside demo folder. You need to add your dashboard tags the same way as the dashboard-tourpedia example.

.. sourcecode:: html

	<my-dashboard client="{{client}}"></my-dashboard>

After index.html is working, create a Dockerfile as in the example.

* In the Dockerfile, you need to edit the following line:

.. sourcecode:: bash

	ENV NODE_PATH=/tmp/node_modules APP_NAME=<--- add your dashboard-name here --->

Now is time to run it using docker-compose.

.. sourcecode:: bash

	$ sudo docker-compose up

If your dashboard requires elasticsearch, just upload your data using Luigi pipelines.

.. sourcecode:: bash

	$ sudo docker-compose exec luigi python -m luigi --module add_tweets Elasticsearch --index tourpedia --doc-type places --filename add_demo.json --local-scheduler
