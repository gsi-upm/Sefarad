Installation
------------

There are two ways of using Sefarad, directly with python or building a docker image.

Using Python
~~~~~~~~~~~~

First of all you need to download Elasticsearch from `here <https://www.elastic.co/downloads/elasticsearch>`_

Unzip Elasticsearch and navigate to the folder, then start the service:

.. code:: bash
   
   $ cd elasticsearch-5.x.x
   $ bin/elasticsearch

Once started, you need to clone the Github repository:
 
.. code:: bash

   $ git clone git@github.com:gsi-upm/sefarad
   $ cd sefarad

Install all the requierements:

.. code:: bash
   
   $ sudo pip2 install -r requirements.txt

Finally, Sefarad is ready to start:

.. code:: bash 

   $ python2 web.py


Using a Docker image
~~~~~~~~~~~~~~~~~~~~

This way requires docker and docker-compose to work. You can download Docker `here <https://docs.docker.com/engine/installation/>`_

Docker-compose can be easily installed through pip.

.. code:: bash

   $ sudo pip install docker-compose

Building Sefarad
****************
   
First of all, you need to clone the Github repository:
 
.. code:: bash

   $ git clone git@github.com:gsi-upm/sefarad
   $ cd sefarad

Once cloned, we need to build the docker image:

.. code:: bash

    $ sudo docker-compose build

Finally, it is necessary to change your **ElasticSearch** configuration folder permissions.

.. code:: bash

    $ sudo chown -R 105 ./elasticsearch/config/

Running Sefarad
***************

Now the image is ready to run:

.. code:: bash

    $ sudo docker-compose up  
