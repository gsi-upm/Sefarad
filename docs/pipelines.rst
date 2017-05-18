Luigi Pipelines
---------------

We use Luigi as orchestrator to build pipelines through our search and indexing system and the analytic services, in order to facilitate analysis. It handles dependency resolution, workflow management, visualization etc. Luigi needs a script describing the pipeline to follow.

These scripts describe tasks. This tasks has a execution sequence, i.e. the final task depend on the others. This means that for running the script you only need to call the final task.

For following steps, the example used is sefarad.py (this script is located inside Luigi folder) 

In our example tasks are: FetchDataTask, SenpyTask and ElasticsearchTask.

* **FetchDataTask**: The main goal of this task is to read the JSON file.
* **SenpyTask**: This task loads data fetched with previous task and send it to Senpy tool in order to analyse data retrieved and check sentiments expressed.
* **Elasticsearch**: This task loads JSON data contained in the file produced in the previous step into an Elasticsearch index.

Running Luigi pipelines
~~~~~~~~~~~~~~~~~~~~~~~

This command is for running your pipelines. You have to introduce your script name in modules and the end task of your script.

.. sourcecode:: bash

	$ sudo docker-compose run luigi --module <your-script-name> <your-final-task> --index <your-elasticsearch-index> --doc-type <your-elasticsearch-doctype> -- filename <your .json path> --local-scheduler

In our example:

.. sourcecode:: bash

	$ sudo docker-compose run luigi --module sefarad Elasticsearch --index elasticdemo --doc-type tweet --filename sefarad_demo.json --local-scheduler

Create your own pipelines like in the example and add them to Luigi folder is also necessary to add your JSON file to this folder, run them with the same command explained above. 
