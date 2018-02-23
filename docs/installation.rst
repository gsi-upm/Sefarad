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

Now the image is ready to run:

.. code:: bash

    $ sudo docker-compose up  

.. note::

  In case of failure bringing up the project try to build the image again using sudo docker-compose build and then run it again.

Sefarad visualisation server is now running at port 8080, you can check with your web browser that the dashboard has no data. The url is http://localhost:8080/demos/tourpedia

Loading demo data to visualisation server
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

[CALL SCRIPT TO LOAD DATA]

Now is time to check our index in elasticsearch `here <http://localhost:9200/_cat/indices>`_ there should be a line with an index called tourpedia.

Finally, check your Sefarad visualisation environment has data reloading the http://localhost:8080/demos/tourpedia page.

