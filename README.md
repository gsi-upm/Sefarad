![GSI Logo](http://www.gsi.dit.upm.es/templates/jgsi/images/logo.png)
![Sefarad Logo](./images/Sefarad_Logo.png)
==================================

Introduction
------------

Sefarad is an application developed to explore data by making SPARQL queries to the endpoint you choose without writing more code. You can also create your own cores if you have a big collection of data ([LMF](https://code.google.com/p/lmf/) required). To view your data you can customize your own widgets and visualize it through them.

Getting Started
---------------

First of all, you need to clone the Github repository:

```
$ git clone https://lab.cluster.gsi.dit.upm.es/sefarad/sefarad.git
$ cd sefarad
```

Install all the requirements:

```
$ sudo pip2 install -r requirements.txt
```

Install all Web components necessary for this demo:

```
$ bower install
```

Finally, Sefarad is ready to start:

```
$ python2 web.py
```
Sefarad server starts in port 8080

For more info visit our documentation on: <a href="http://sefarad.readthedocs.io" target="_blank">http://sefarad.readthedocs.io</a>

Polymer - Web Components Technology
-----------------------------------

![Polymer logo](http://carlosortiz.co.uk/wp-content/uploads/2015/09/polymer-logo.jpg)
 
Polymer is a technology based on web components, so we could make a new component with diferent estructures of html, styles with css, and give some dinamic functions using Javascript.

Those components will be reusable only importing the tag `<component-tag></component-tag>` and they could share information using data binding among them.

Demo
----

You can check out our Sefarad demo <a href="http://sefarad.cluster.gsi.dit.upm.es/">here</a> 

References
----------

<a href="http://www.gsi.dit.upm.es/administrator/components/com_jresearch/files/publications/tfgenriqueconde.pdf">[1]</a> Development of a Social Media Monitoring System based on
Elasticsearch and Web Components Technologies.

<a href="http://sefarad.readthedocs.io/en/latest/index.html">[2]</a>Read the Docs. Detailed documentation about Sefarad project.
<!--##Deploying in Dokku

To deploy in dokku, there are two parts:

      1 - Elasticsearch-docker
      2 - Sefarad 3.0
For the first one, the only thing we have to do is deploy the service directly in dokku.
For the second one, as sefarad is build on JavaScript, it can't access to elasticsearch without making a proxy, for that reason it needs to lauch a Apache service and you have to make a proxy inside it listening the URL of JavaScript and redirecting to Elasticsearch. -->

<!--
## ElasticSearch Pipeline
###Requirements
Install luigi
```
 pip install luigi
```
Install Elastic Search (https://www.elastic.co/guide/en/elasticsearch/reference/current/setup.html)
```
pip install elasticsearch

wget https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-5.0.1.deb
sha1sum elasticsearch-5.0.1.deb 
sudo dpkg -i elasticsearch-5.0.1.deb
```

Execute ElasticSearch inside instalation folder (default path /usr/share/elasticsearch
```
./bin/elasticsearch
```
-->

<!--###Run pipeline
First of all, place your scraped file inside the `analysis` folder located in Sefarad 3.0 project.
After this, execute from command line the luigi pipeline (`pipeline.py`):
```
python pipeline.py Elasticsearch --filename <your_file_name> --analysis <your_analysis_type> --index <your_elasticsearch_index> --doc-type <your_elasticsearch_doc_type> --local-scheduler
```

Now you can find your analized file inside `analysis/analyzed-<your_filename>.json-ld`. In order to visualize your analyzed file inside ElasticSearch environment type the following url in your browser:
```
http://localhost:9200/<your_elasticsearch_index>/<your_elasticsearch_doc_type>/_search?pretty
```
-->
