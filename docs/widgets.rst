Web Components
==============

Web components are a set of web platform APIs that allow you to create new custom, reusable, encapsulated HTML tags to use in web pages and web apps. Custom components and widgets build on the Web Component standards, will work across modern browsers, and can be used with any JavaScript library or framework that works with HTML.

Web components are based on existing web standards. Features to support web components are currently being added to the HTML and DOM specs, letting web developers easily extend HTML with new elements with encapsulated styling and custom behavior.

Web Components library
~~~~~~~~~~~~~~~~~~~~~~

In Sefarad we have prebuilt Web Components in ``./bower_components`` folder. Here we can find a collection of elements made by the Polymer team, and others made by GSI-UPM team.

There is also an Online Web Components library `here <https://www.webcomponents.org/>`_.

Developing your own Web Components
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

In this section we will explain how to create new widgets in Sefarad, or import existing ones. 
First of all you must create a new directory inside ``./bower_components``, and move inside all your widget files.

``./bower_components/myweb-component``

Afterwards, you have to create a new file called ``myweb-component.html``. If you want to use other widgets you have to import them:

.. sourcecode:: html

	<link rel="import" href="../polymer/polymer.html">
	<link rel="import" href="../iron-icons/iron-icons.html">

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


Finally, complete the ``./elements/elements.html`` file to use your new widget globally.


> elements.html

.. sourcecode:: html

	<link rel="import" href="../bower_components/myweb_component/myweb_component.html">


Remember to add your Polymer Web Components to ``bower_components`` directory if not included yet. Edit css if necessary.

After following these steps, build up Sefarad environment and you should be able to use your new Web Component successfully.