Installation
------------
Sefarad requires docker and docker-compose to work. You can download Docker `here <https://docs.docker.com/engine/installation/>`_

Docker-compose can be easily installed through pip.

.. code:: bash

   $ pip install docker-compose

Building Sefarad
****************
   
First of all, you need to clone the Github repository:
 
.. code:: bash

   $ git clone git@github.com:gsi-upm/sefarad
   $ cd sefarad

Once cloned, we need to build the docker image:

.. code:: bash

    $ sudo docker-compose build

Then, it is necessary to add your **ElasticSearch** nodes folder into elasticsearch directory.

.. code:: bash

    $ cp $PWD/nodes ./elasticsearch/nodes

Finally, it is necessary to change your **ElasticSearch** configuration folder permissions.

.. code:: bash

    $ sudo chown -R 105 ./elasticsearch/config/

Running Sefarad
***************

Now the image is ready to run:

.. code:: bash

    $ docker-compose up  
