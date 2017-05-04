Luigi Pipelines
---------------

We use Luigi as orchestrator to build pipelines through our search and indexing system and the analytic services, in order to facilitate analysis. It handles dependency resolution, workflow management, visualization etc. Luigi needs a script describing the pipeline to follow.

These scripts describe tasks. This tasks has a execution sequence, i.e. the final task depend on the others. This means that for running the script you only need to call the final task.

For following steps, the example used is sefarad.py (this script is located in https://lab.cluster.gsi.dit.upm.es/sefarad/sefarad-full/blob/master/sefarad.py) 

In our example tasks are: FetchDataTask, SenpyTask and ElasticsearchTask.

* **FetchDataTask**: The main goal of this task is to read the JSON file.
* **SenpyTask**: This task loads data fetched with previous task and send it to Senpy tool in order to analyse data retrieved and check sentiments expressed.
* **Elasticsearch**: This task loads JSON data contained in the file produced in the previous step into an Elasticsearch index.

Running Luigi pipelines
~~~~~~~~~~~~~~~~~~~~~~~

You need to install luigi and rdflib with pip:

.. sourcecode:: bash
	
	$ pip3 install rdflib luigi

This command is for running your pipelines. You have to introduce your script name in modules and the end task of your script.

.. sourcecode:: bash

	$ luigi --module <your-script-name> <your-final-task> --index <your-elasticsearch-index> --doc-type <your-elasticsearch-doctype> -- filename <your .json path> --local-scheduler

In our example:

.. sourcecode:: bash

	$ luigi --module sefarad Elasticsearch --index elasticdemo --doc-type tweet --filename sefarad_demo.json --local-scheduler

In case of error Luigi module not found just type this command:

	$ python3 -m luigi --module sefarad Elasticsearch --filename sefarad_demo.json --index elasticdemo --doc-type tweet --local-scheduler
	
