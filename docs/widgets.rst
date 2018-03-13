Sefarad widgets
===============

What are Sefarad widgets?
~~~~~~~~~~~~~~~~~~~~~~~~~

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

* **Yasgui**:
 Widget designed to ask SPARQL queries where you can select your endpoint.

 For more information visit yasgui repository on GitLab http://lab.cluster.gsi.dit.upm.es/sefarad/yasgui

* **Entities-chart**:
 Widget designed to visualize entities available in an elasticSearch index.

 For more information visit entities-chart repository on GitLab http://lab.cluster.gsi.dit.upm.es/sefarad/entities-chart

* **Happymap**:
 Widget that visualizes with different layers analyzed tweets by Senpy.

 For more information visit happymap repository on GitLab http://lab.cluster.gsi.dit.upm.es/sefarad/happymap

* **Date-slider**:
 Wigdet that visualizes a bar that return bounds proper to filter DB queries.

 For more information visit date-slider repository on GitLab http://lab.cluster.gsi.dit.upm.es/sefarad/timeline

* **Aspect-chart**:
 Widget designed to visualize differnts aspect present in reviews, each aspect is coloured in a different color.

 For more information visit aspect-chart repository on GitLab http://lab.cluster.gsi.dit.upm.es/sefarad/aspect-chart

* **People-chart**:
 Widget that visualize detected people's face and name in an elasticsearch index. 

 For more information visit people-chart repository on GitLab http://lab.cluster.gsi.dit.upm.es/sefarad/people-chart


* **Wordcloud**:
 Widget that provides a tag cloud, each tag is shown with different font size or color. 

 For more information visit wordcloud repository on GitLab http://lab.cluster.gsi.dit.upm.es/sefarad/wordcloud-element

There is also an Online Web Components library `here <https://www.webcomponents.org/>`_.

If you want to use some of this components just add them to your bower.json file as a dependency. More details on each widget repository.

Developing your own widgets
~~~~~~~~~~~~~~~~~~~~~~~~~~~

In this section we will explain how to create new widgets in Sefarad, or import existing ones. For the tutorial we are going to use number-chart widget mentioned above.
First of all you must create a new directory inside ``./bower_components``, and move inside all your widget files.

``./bower_components/number-chart``

Afterwards, you have to create a new file called ``number-chart.html``. If you want to use other widgets inside you have to import them:

.. sourcecode:: html

	<link rel="import" href="/bower_components/polymer/polymer.html">
	<link rel="import" href="/bower_components/iron-icons/iron-icons.html">
	<link rel="import" href="/bower_components/iron-icon/iron-icon.html">
	<link rel="import" href="/bower_components/iron-icons/maps-icons.html">
	<link rel="import" href="/bower_components/iron-icons/social-icons.html">


In addition, you have to define the HTML structure inside ``<template>`` tag. Sefarad widgets uses Polymer, so variables and data are passed inside curly braces. For more information about Polymer data binding visit Polymer documentation: https://www.polymer-project.org/1.0/docs/devguide/data-binding

.. sourcecode:: html

	<dom-module id="number-chart">

	<template>
	<! -- HERE GOES THE HTML STRUCTURE OF YOUR WIDGET -->
	<div class="info-box">
	  <div class$="{{stylebg}}">
	    <span class="info-box-icon"><iron-icon icon="{{icon}}"></iron-icon></span>
	    <div class="info-box-content">
	      <span class="info-box-text">{{title}}</span>
	      <span class="info-box-number">
	      <span id="number">{{number}}</span>
	      <div class="progress">
	        <div class="progress-bar progress-bar-name" id="barprogress" style="width: 50%"></div>
	      </div>
	      <span class="progress-description">{{ subtitle }}: {{ total }}</span>
	    </div>
	  </div>
	</div>
 	</template>

	</dom-module>

You may need some CSS rules to style your widget.

Below ``<template>`` tag is necessary to add javascript to define your component. 
Create a Polymer Object with following parts:
* is: String that defines the name of the widget.
* properties: Object with some widgets properties, add observers if you want to fire a funcion if that property changes. These properties are very useful to store data.
* functions: Javascript functions that can be callable by the widget, for example to edit some data or manage requests.

.. sourcecode:: javascript
	

	Polymer({
	  is: 'number-chart',
	  properties: {
	    icon: {
	      type: String,
	      value: "trending-up"
	    },
	    stylebg: {
	      type: String,
	      value: 'bg-yellow'
	    },
	    data: {
	      type: Object,
	      observer: '_dataChanged'              
	    },
	    title: {
	      type: String     
	    }
	  },
	  _dataChanged: function(){
	    var num = this.data.hits.total > 999 ? (this.data.hits.total/1000).toFixed(1) + 'k' : this.data.hits.total;
	    idNum.innerHTML = num;
	    this.total = num;
	    idBar.style.width = "100%";
    	
	  }
	});     
 
Is also necessary to specify dependencies for this widget using a bower.json file. The structure of this file is like this example:

.. sourcecode:: json

	{
	  "name": "number-chart",
	  "homepage": "https://lab.cluster.gsi.dit.upm.es/sefarad/number-chart",
	  "authors": [
	    "GSI-UPM"
	  ],
	  "description": "",
	  "main": "",
	  "license": "MIT",
	  "dependencies": {
	    "iron-icons": "PolymerElements/#iron-icons^1.1.0",
	    "polymer": "polymer#*"
	}

If you want to make your widget installable via bower you can register this package. This requires to have a git repository with all your widget code.

.. sourcecode:: bash

	$ bower register <my-package-name> <git-endpoint>

