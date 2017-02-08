Dashboards
==========

Available dashboards
--------------------

SPARQL DBpedia
~~~~~~~~~~~~~~

DBpedia is a crowd-sourced community effort to extract structured information from Wikipedia and make this information available on the Web. DBpedia allows you to ask sophisticated queries against Wikipedia, and to link the different data sets on the Web to Wikipedia data.

This dashboard provides a graphic interface to ask SPARQL queries against DBpedia.

.. image:: images/dbpedia.png
  :height: 400px
  :scale: 100 %
  :align: center

Tourpedia
~~~~~~~~~

TourPedia is the result of an European project. It is a demo of OpenNER (Open Polarity Enhanced Name Entity Recognition). It contains information about accommodations, restaurants, points of interest and attractions of different places in Europe.

TourPedia provides two main datasets: Places and Reviews. Each place contains useful information such as the name, the address and its URI to Facebook, Foursquare, GooglePlaces and Booking. Reviews contain also some useful details ready for us to exploit.

This dashboard also allows you to ask SPARQL quereies against our TourPedia database.

.. image:: images/tourpedia.png
  :height: 400px
  :scale: 100 %
  :align: center

Financial Twitter Tracker
~~~~~~~~~~~~~~~~~~~~~~~~~

Financial Twitter Tracker is an R&D project of GSI Group that contains information about people talking about brands in social media like Twitter, Facebook, and more...

This dashboard provides interactive Web Components to visualize people's opinion polarities and also has a SPARQL editor to ask queries about these opinions using RDF specifications.

.. image:: images/ftt.png
  :height: 400px
  :scale: 100 %
  :align: center

Footballmood
~~~~~~~~~~~~

Footballmood is an application developed for sentiment analysis of football in Twitter. This dashboard provides interactive Web Components to visualize people's opinion polarities and also has a SPARQL editor to ask queries about football players against DBpedia.

.. image:: images/footballmood.png
  :height: 400px
  :scale: 100 %
  :align: center

Aspects
~~~~~~~

Aspects dashboard is an analyser developed for aspects sentiment analysis of restaurant reviews. This is the result of analysis showed on a dashboard based on web components and D3.js. To view your data you can use widgets and visualize it through them.

The data used for the dashboard is the Semeval 2015 ABSA dataset (Task 12) for restaurant domain, available `here <http://alt.qcri.org/semeval2015/task12/>`_

.. image:: images/aspects.png
  :height: 400px
  :scale: 100 %
  :align: center

GSI Crawler
~~~~~~~~~~~

This dashboard is useful to the analysis of comments from external aplications like Amazon and Foursquare. The user will choose the type of analysis he wants to carry out (Emotions, Sentiments or Fake Analysis) and he will also supply, for instance, a direct URL to a Amazon’s Product. 

GSI Crawler will download the comments belonging to this element and, later, the pertinent analysis will be run using the Senpy tool. Once the analysis is finished, a summary of the result will be shown and the possibility of review each comment one by one will be also offered.

.. image:: images/gsicrawler.png
  :height: 400px
  :scale: 100 %
  :align: center

Developing your own dashboard
-----------------------------

In this section we will explain how to create new dashboards in Sefarad, or import existing ones. First of all you must create a new directory inside **elements** (e.g ``elements/my-dashboard``), and move inside all your dashboard files (e.g my-dashboard.html).

Afterwards, you have to create a new tab in left menu inside **index.html** file, and create a new section where your dashboard will be shown.

.. sourcecode:: html

	...
	<a data-route="my_dashboard_route" href="/my_dashboard_route">
    	<iron-icon icon="your_widget_icon"></iron-icon>
    	<span>My Dashboard</span>
	</a>
	...
	<section data-route="my_dashboard_route">
    	<my-dashboard></my-dashboard>
	</section>
	...

In addition, you have to define your dashboard structure as follows in **my-dashboard.html** file.

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
 

Finally, complete the ``routing.html`` and ``elements.html`` files located inside elements directory.

**routing.html**

.. sourcecode:: javascript

	...
	page('/my_dashboard_route',function(){
	    app.route = 'my_dashboard_route';
	    });
	...

**elements.html**

.. sourcecode:: html

	<link rel="import" href="../bower_components/my_component/my_component.html">
	<link rel="import" href="my-dashboard/index.html">

Remember to add your Polymer Web Components to ``bower_components`` directory if not included yet. Edit css if necessary.

After following these steps, build up Sefarad environment and you should visualize your dashboard successfully.