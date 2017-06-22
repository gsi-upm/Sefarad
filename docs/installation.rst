Quick Start
------------

Sefarad installation is based in docker containers, only requirement is to have docker and docker-compose installed.

For docker installation in Ubuntu, visit this `link <https://store.docker.com/editions/community/docker-ce-server-ubuntu?tab=description>`_ 

Docker-compose installation detailed instructions are available `here <https://docs.docker.com/compose/install/>`_

Install with docker-compose
~~~~~~~~~~~~~~~~~~~~~~~~~~~

First of all, you need to clone the Github repository:
 
.. code:: bash

   $ git clone https://lab.cluster.gsi.dit.upm.es/sefarad/sefarad.git
   $ cd sefarad

Finally, it is necessary to change your **ElasticSearch** configuration folder permissions.

.. code:: bash

    $ sudo chown -R 105 ./elasticsearch/config/

Now the image is ready to run:

.. code:: bash

    $ sudo docker-compose up  

.. note::

  In case of failure bringing up the project try to build the image again using sudo docker-compose build and then run it again.

Sefarad visualisation server is now running at port 8080, you can check with your web browser that the dashboard has no data. The url is http://localhost:8080/demos/tourpedia

Loading demo data to visualisation server
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Loading data has been developed as a Luigi pipeline. We can found all necessary files inside ``luigi`` folder. You can check your Luigi central scheduler in http://localhost:8082. This central scheduler is helpful to check if your tasks are working properly.

Is also possible to configure email alerts in case of failure. This settings can be modified in docker-compose.yml file, inside environment variables for Luigi container.


For this demo first of all, we execute the Luigi pipeline called add_tweet.

There are some required parameters in this pipeline:

* index: Elasticsearch index were data is going to be stored
* doc-type: Elasticsearch doc-type inside the index.
* filename: This is our demo data collected in a JSON file.

After all this considerations, run the pipeline:

.. code:: bash

  $ sudo docker-compose exec luigi python -m luigi --module add_tweets Elasticsearch --index tourpedia --doc-type places --filename add_demo.json

Our Luigi Execution Summary should say:

.. code:: bash
  
  Scheduled 2 tasks of which:
  * 2 ran successfully:
      - 1 Elasticsearch(date=XXXX-XX-XX, filename=add_demo.json, index=tourpedia, doc_type=places)
      - 1 FetchDataTask(filename=add_demo.json)

  This progress looks :) because there were no failed tasks or missing external dependencies

Now is time to check our index in elasticsearch `here <http://localhost:9200/_cat/indices>`_ there should be a line with an index called tourpedia.

Finally, check your Sefarad visualisation environment has data reloading the http://localhost:8080/demos/tourpedia page.

