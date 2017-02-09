Quick Guide
-----------

Here is a quick guide to use your own data in Sefarad.

Configure your ElasticSearch index
**********************************
   
First of all, it is necessary to add your **ElasticSearch** nodes folder into elasticsearch directory.

.. code:: bash

    $ cp $PWD/nodes ./elasticsearch/nodes

Sefarad datasets must have the following JSON structure. The text, id and @timestamp fields are mandatory, and the others are optional parameters:

.. sourcecode:: json

	[
	   {"user_location":"Spain",
	    "text":"Hello! This is the tweet that will be analyzed!",
	    "id":1234567890,
	    "@timestamp":"2016-04-05T16:02:58.000Z"
	   }
	]


Update Dashboard Widgets
************************

Once indices are updated, is needed to change some Web Components parameters. For example, it is mandatory to update your elasticsearch index name and your elasticsearch doctype.

These changes must be done in the **dashboard-name.html** file, located in ``elements/dashboard-name``

In this example spain-chart web component is updated.

.. sourcecode:: html

	<spain-chart
		id="spain"
		index="<!-- add here your elasticsearch index name -->"
		subindex="<!-- add here your elasticsearch doctype -->"
		query="{{query}}"
		fields='["user.location", "sentiment"]'>
	</spain-chart>

Here is the same example with spider-chart web component.

.. sourcecode:: html

	<spider-chart
		index="<!-- add here your elasticsearch index name -->"
		subindex="<!-- add here your elasticsearch doctype -->"
		query="{{query}}"
		fields='["emotion", "text"]'>
	</spider-chart>
