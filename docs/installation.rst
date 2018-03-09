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

Sefarad visualisation server is now running at port 8080, you can check with your web browser that the demos available have no data.

Loading demo data to visualisation server
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Demo data is loaded to ElasticSearch via python script. In a new terminal type:

.. code:: bash

    $ docker-compose run loader load_demo.py  

Now is time to check elasticsearch `here <http://localhost:9200/_cat/indices>`_ there should be list with all index available.

Finally, check your Sefarad visualisation environment visiting different demos available.
