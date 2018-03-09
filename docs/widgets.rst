Sefarad widgets
===============

Sefarad widgets are based in web components. This web components are a set of web platform APIs that allow you to create new custom, reusable, encapsulated HTML tags to use in web pages and web apps. Custom components and widgets build on the Web Component standards, will work across modern browsers, and can be used with any JavaScript library or framework that works with HTML.

Web components are based on existing web standards. Features to support web components are currently being added to the HTML and DOM specs, letting web developers easily extend HTML with new elements with encapsulated styling and custom behavior.

Sefarad widget library
~~~~~~~~~~~~~~~~~~~~~~

In Sefarad we have prebuilt widgets developed by the GSI-UPM team:

* **Field-chart**:
 Widget designed to study sentiments present in elasticsearch document and visualize sentiment evolution over time. 
 X-axis describes time and Y-axis shows sentiment polarity evolution for each lapse of time. This web component obtains data from an elasticSearch index. 

 For more information visit field-chart repository on GitLab http://lab.cluster.gsi.dit.upm.es/sefarad/field-chart


* **Chernoff-faces**: 
 Widget designed to study sentiments present in elasticsearch document and visualize sentiment in chernoff faces.
 This web component obtains data from an elasticSearch index.

 For more information visit chernoff-faces repository on GitLab http://lab.cluster.gsi.dit.upm.es/sefarad/chernoff-faces


* **Number-chart**:
 Widget designed to show the size of results in an elasticsearch index.

 For more information visit number-chart repository on GitLab http://lab.cluster.gsi.dit.upm.es/sefarad/number-chart


* **Google-chart-elasticsearch**:
 Widget designed to visualize data with Google Charts but obtaining data from an elasticSearch index.

 For more information visit google-chart-elasticsearch repository on GitLab http://lab.cluster.gsi.dit.upm.es/sefarad/google-chart-elasticsearch

* **Liquid-fluid-d3**:
 Widget designed to show pergentage values with animation. This wigdet is developed using D3 for animations.

 For more information visit Liquid-fluid-d3 repository on GitLab http://lab.cluster.gsi.dit.upm.es/sefarad/liquid-fluid-d3

* **Material-search**:
 Searchbox designed to make queries to other web components. The query parameter is auto updated with the searchbox.

 For more information visit material-search repository on GitLab http://lab.cluster.gsi.dit.upm.es/sefarad/material-search

* **Spain-chart**:
 Widget designed to study sentiments and emotions present in Tweets and geolocate them in a map of Spain. In sentiment mode each province is coloured with the predominant sentiment: green means positive, grey neutral, red negative and dark grey means there is no data available for that province. In emotion mode each province is coloured also but with the predominant emotion: red means anger, purple disgust, green negative-fear, yellow joy, grey neutral and sadness blue. This web component obtains data from an elasticSearch index.

 For more information visit spain-chart repository on GitLab http://lab.cluster.gsi.dit.upm.es/sefarad/spain-chart

* **Spider-chart**:
 Widget designed to study categories present in Tweets. The axis in radar describes each category. This web component obtains data from an elasticSearch index.

 For more information visit spider-chart repository on GitLab http://lab.cluster.gsi.dit.upm.es/sefarad/spider-chart

* **Tweet-chart**:
 Widget designed to visualize Tweets and visualize each Tweet sentiment. Tweet background is coloured green if tweet's text is posive, red if it is negative or grey if neutral. This web component obtains data from an elasticSearch index.

 For more information visit tweet-chart repository on GitLab http://lab.cluster.gsi.dit.upm.es/sefarad/tweet-chart

* **Wheel-chart**:
 Widget designed to show entities and navigate through them.

 For more information visit wheel-chart repository on GitLab http://lab.cluster.gsi.dit.upm.es/sefarad/wheel-chart

* Yasgui
* Reviews-table
* Entities-chart
* Happymap
* Date-slider
* Aspect-chart
* People-chart
* Wordcloud

There is also an Online Web Components library `here <https://www.webcomponents.org/>`_.

If you want to use some of this components just add them to your bower.json file as a dependency.

Developing your own Web Components
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

In this section we will explain how to create new widgets in Sefarad, or import existing ones. 
First of all you must create a new directory inside ``./bower_components``, and move inside all your widget files.

``./bower_components/myweb-component``

Afterwards, you have to create a new file called ``myweb-component.html``. If you want to use other widgets you have to import them:

.. sourcecode:: html

	<link rel="import" href="/bower_components/polymer/polymer.html">
	<link rel="import" href="/bower_components/iron-icons/iron-icons.html">

In addition, you have to define the structure as follows.

.. sourcecode:: html

	<dom-module id="myweb-component">

 	<template>
	  	<paper-material elevation="1">
	  	<div class="top-bar">
	        	<iron-icon icon="{{icon}}"></iron-icon>
	        	<span>{{title}}</span>
	     	</div>
	 	</paper-material>
 	</template>

	</dom-module>


Inside ``<dom-module>`` tag you have to define your new Polymer element adding some JavaScript:

.. sourcecode:: javascript
	

	Polymer({
		is: 'myweb-component',
		properties: {
			icon: {
				type: String,
				value: "trending-up"
			},
			title: {
				type: String,     
			}
		},
		ready: function(){
			do_some_function();    	
		}
	});     
 
Is also necessary to specify dependencies for this widget using a bower.json file. The structure of this file is like this example:

.. sourcecode:: json

	{
	  "name": "myweb-component",
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

If you want to make your widget installable via bower you can register this package. This requires to have a git repository with all your widget code.

.. sourcecode:: bash

	$ bower register <my-package-name> <git-endpoint>


Finally, add a ``<link>`` tag in your dashboard to use your new widget inside it.

.. sourcecode:: html

	<link rel="import" href="/bower_components/myweb_component/myweb_component.html">


Edit css if necessary.