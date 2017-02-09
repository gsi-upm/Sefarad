Configure a custom data source
==============================

In this section we will explain how to save your custom datasets in elasticsearch databases and access through the elastic search browser interface.

Previous knowledge about Elasticsearch
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Elasticsearch [#f1]_ is a distributed, RESTful search and analytics engine capable of solving a growing number of use cases. As the heart of the Elastic Stack, it centrally stores your data so you can discover the expected and uncover the unexpected. Before import your own data, there are certain elements inside elasticsearch architecture that you should know:

* What is an index in Elasticsearch? Well, an index is some type of data organization mechanism, allowing the user to partition data a certain way.
* What is a type in Elasticsearch? A type in Elasticsearch represents a class of similar documents.

So if we exemplify all these concepts, imagine that your have a football tweet analysis scenario, **MyFootballTweet** will be your index. Within this index, you have three diferent types, **sentiments**, **emotions** and **fake** analysis.

Analyse and import your dataset to ElasticSearch
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

In this section we will explain how should be your dataset structure, how Luigi pipelines works and the workflow implemented depending on your data, how Senpy handle our data and returns the sentiment/emotion analysis, and finally how this data is saved in Elasticsearch and how to visualize it.

It is important to define correctly the text parameter, which would be the string that analyzed by Senpy.

Tweet datasets
**************

These datasets must have the following JSON structure. The text, id and @timestamp fields are mandatory,and the others are optional parameters:

.. sourcecode:: json

	[
	   {"user_location":"Spain",
	    "text":"Hello! This is the tweet that will be analyzed!",
	    "id":1234567890,
	    "@timestamp":"2016-04-05T16:02:58.000Z"
	   }
	]

Once we have our dataset well structured, the next step is to analyze every single tweet and store the result obtained in ElasticSearch. For that, you have to execute a Luigi pipeline that simplifies this workflow. Remind that ElasticSearch server must be up

1. Create a workspace directory and save your .json inside. Copy the pipeline.py from Sefarad directory to your own workspace directory.

2. Choose an index and doc_type for your data, depending on the analysis type you will perform. For example, in this case the index could be tweets and the doc_type sentiments.

3. Type the following commands in your terminal

.. code:: bash

	$ cd /my_workspace_dir
 	$ python pipeline_tweets.py Elasticsearch --filename <your_file_name> --analysis <your_analysis_type> --index <your_elasticsearch_index> --doc-type <your_elasticsearch_doc_type> --local-scheduler

*Note: filename should be written without extension. Ex: my_data.json -> filename = my_data*

After this, you could find the analyzed JSON obtained from Senpy inside your workspace directory and stored in ElasticSearch.
The analyzed JSON structure for a sentiment analysis would be:

.. sourcecode:: json

	[
	   {"user_location":"Spain",
	    "text":"Hello! This is the tweet that will be analyzed!",
	    "id":1234567890,
	    "@timestamp":"2016-04-05T16:02:58.000Z",
	    "sentimentAnalysis": "Full response received from Senpy",
	    "sentiment":"Sentiment result extracted from Senpy response",
	    "polarity":"Polarity result extracted from Senpy response"
	   }
	]

You can check the ElasticSearch entry (example with id 1234567890) through this url: ``http://localhost:9200/<your_elasticsearch_index>/<your_elasticsearch_doctype>/1234567890/_search?pretty``

Import your ElasticSearch indices
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Firstly, you have to locate your elasticsearch installation folder. Inside this folder you find ``data/nodes``, copy this folder into ``<sefarad-folder>/elasticsearch/nodes``

Restart your sefarad instance:

.. code:: bash

	$ docker-compose build
	$ docker-compose up

.. rubric:: References

.. [#f1] http://elastic.co
