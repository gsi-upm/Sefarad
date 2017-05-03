Installation
------------

Sefarad uses a Python web server, so for it installation is necessary to have Python installed.
In addition, Sefarad uses a RESTful search and analytics engine called Elasticsearch.

Installing Elasticsearch
~~~~~~~~~~~~~~~~~~~~~~~~

First of all you need to download Elasticsearch from `here <https://www.elastic.co/downloads/elasticsearch>`_

Unzip Elasticsearch and navigate to the folder:

.. code:: bash
   
   $ cd elasticsearch-5.x.x

If you are working in localhost you may need to change the configuration file called ``elasticsearch.yml`` located inside config directory.

Just add the following lines at the end:

.. code:: yaml

    http.cors.enabled : true
    http.cors.allow-origin : "*"
    http.cors.allow-methods: OPTIONS, HEAD, GET, POST, PUT, DELETE
    http.cors.allow-headers: X-Requested-With, X-Auth-Token, Content-Type, Content-Length

Then start the service:

.. code:: bash
   
   $ bin/elasticsearch


You can found our demo data inside ``elasticsearch/nodes`` folder. Copy this data inside your elasticsearch data folder to use it.


Installing Sefarad
~~~~~~~~~~~~~~~~~~

Once started, you need to clone the Github repository:
 
.. code:: bash

   $ git clone https://lab.cluster.gsi.dit.upm.es/sefarad/sefarad.git
   $ cd sefarad

Install all the requierements:

.. code:: bash
   
   $ sudo pip2 install -r requirements.txt

Install all Web components necessary for this demo:

.. code::bash 
   
   $ bower install

Running Sefarad
~~~~~~~~~~~~~~~

Finally, Sefarad is ready to start:

.. code:: bash 

   $ python2 web.py

Sefarad is now running at port 8080.

This sefarad instance elasticsearch's endpoint can be modified to GSI elasticsearch.
In order to try with your own data you need to change ``elasticsearch.jquery.js`` file inside scrpits directory.

Change the following lines:

.. code:: javascript

    this.host = 'localhost'
    this.port = 9200
    config.host = 'http://localhost:9200'


Is also possible to install Sefarad with Docker.

Install with docker
~~~~~~~~~~~~~~~~~~~

First of all, you need to clone the Github repository:
 
.. code:: bash

   $ git clone git@github.com:gsi-upm/sefarad
   $ cd sefarad

Install all Web components necessary for this demo:

.. code::bash 
   
   $ bower install

Finally, it is necessary to change your **ElasticSearch** configuration folder permissions.

.. code:: bash

    $ sudo chown -R 105 ./elasticsearch/config/

Running Sefarad
***************

Now the image is ready to run:

.. code:: bash

    $ sudo docker-compose up  

Sefarad is now running at port 80
