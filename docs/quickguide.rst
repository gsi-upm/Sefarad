Quick Guide
-----------

Here is a quick guide about basic use case of Sefarad. Is necessary to have the Sefarad instance running. If your don't have one check `Installation <http://sefarad.readthedocs.io/en/latest/installation.html>`_ section to obtain one.

Collect your tweets in a json file
**********************************

First of all, unanalysed tweets must be stored in a json file. For this example is used a tweets file called sefarad_demo.json
Available for download `here <https://lab.cluster.gsi.dit.upm.es/sefarad/sefarad-full/blob/master/sefarad_demo.json>`_
These tweets have the following structure:

.. sourcecode:: json

	{"user_location":"Spain",
	 "text":"Hello! This is the tweet that will be analyzed!",
	 "id":1234567890,
	 "@timestamp":"2016-04-05T16:02:58.000Z"
	}


Analyse and store your tweets with a Luigi pipeline
***************************************************

Once the tweets are located, download the demo Luigi pipeline sefarad.py. Available `here <https://lab.cluster.gsi.dit.upm.es/sefarad/sefarad-full/blob/master/sefarad.py>`_

Run the pipeline:

.. sourcecode:: bash

	$ python3 -m luigi --module sefarad Elasticsearch --filename sefarad_demo.json --index elasticdemo --doc-type tweet --local-scheduler

Now the analysed tweets are stored in an elasticsearch index called elasticdemo. Check it `here <http://localhost:9200/elasticdemo/_search?pretty>`_


Update widget and dashboard references
**************************************

Once index is working, is needed to change some Web Components parameters. For example, it is mandatory to update your elasticsearch index name and your elasticsearch doctype.

These changes must be done in the **dashboard-name.html** file, located in ``elements/dashboard-name``

In this example spain-chart web component is updated.

.. sourcecode:: html

	<spain-chart
		id="spain"
		index="elasticdemo"
		subindex="tweet"
		query="{{query}}"
		fields='["user.location", "sentiment"]'>
	</spain-chart>

Here is the same example with spider-chart web component.

.. sourcecode:: html

	<spider-chart
		index="elasticdemo"
		subindex="tweet"
		query="{{query}}"
		fields='["emotion", "text"]'>
	</spider-chart>
