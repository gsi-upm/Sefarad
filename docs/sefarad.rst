What is Sefarad?
----------------

Sefarad is an environment developed to explore, analyse and visualize data. This environmet has a modular structure.

Architecture
============

Sefarad environment is divided in three main modules, each one is focused in one concrete task:

* Visualisation, the main function of this module is to represent data which were processed and draw different charts to visualize interesting data. This visualisation is structured in several dashboards, which are web pages oriented to display all the collected information . In addition, these dashboards are divided in other components (Polymer Web Components) that globally compound the dashboard itself.
* ElasticSearch [#f1]_, represents the persistence layer of the project and stores all the amount of data needed for the visualisation.
* Luigi, is used as an orchestrator to build sequences of tasks named pipelines through analytic services and elasticSearch, in order to facilitate analysis. Luigi is also used to populate elasticSearch with data. 

In this figure is a detailed view of the architecture described above.

.. image:: images/arch.png
  :height: 320px
  :scale: 100 %
  :align: center

.. rubric:: References

.. [#f1] http://elastic.co