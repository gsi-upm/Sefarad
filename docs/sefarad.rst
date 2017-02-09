What is Sefarad?
----------------

Sefarad is an application developed to explore data by making SPARQL queries to the endpoint you choose without writing more code. You can also create your own cores if you have a big collection of data (LMF required). To view your data you can customize your own widgets and visualize it through them.

Architecture
============

The modular architecture of Sefarad allows retrieving, storing and processing large amounts of information.

* Model-view, the main function of this module is to represent data which were processed and draw different charts to visualize interesting data. Model-view is structured in different dashboards.
* ElasticSearch [#f1]_, stores all the amount of data that needed for the model-view.
* SPARQL editor, the user could explore data stored in Fuseki service, either executing default queries that Sefarad will provide or queries that the user has created.  
* GSI Crawler, will download the comments belonging to this element and, later, the pertinent analysis will be run using the Senpy tool.

.. image:: architecture.png
  :height: 500px
  :width: 500px
  :scale: 100 %
  :align: center

.. rubric:: References

.. [#f1] http://elastic.co