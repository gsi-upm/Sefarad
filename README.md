![GSI Logo](http://www.gsi.dit.upm.es/templates/jgsi/images/logo.png)
![Sefarad Logo](./images/Sefarad_Logo.png)
==================================

##Introduction
Sefarad is an application developed to explore data by making SPARQL queries to the endpoint you choose without writing more code. You can also create your own cores if you have a big collection of data ([LMF](https://code.google.com/p/lmf/) required). To view your data you can customize your own widgets and visualize it through them.

##Getting Started
###Requirements
Sefarad requires docker and docker-compose to work. You can download Docker <a href="https://docs.docker.com/engine/installation/">here</a>

Docker-compose can be easily installed through pip.
```
sudo pip2 install docker-compose

```
###Building Sefarad
First of all, you need to clone the Github repository:
```
git clone git@github.com:gsi-upm/sefarad
cd sefarad
```
Install and unzip last version of Elasticsearch from website https://www.elastic.co/downloads/elasticsearch.


Then, it is necessary to add your ElasticSearch nodes folder into elasticsearch directory.
```
cp $PWD/nodes ./elasticsearch/nodes

```
Finally, it is necessary to change your ElasticSearch configuration folder permissions.
```
sudo chown -R 105 ./elasticsearch/config/
```
###Running Sefarad
Now the image is ready to run. Build and run your docker images:

```
sudo docker-compose up
```
You can visualize Sefarad main page in your browser
 ```
 http://localhost:8000
 ```
<!--NEW
##Getting Started
If you want to easy try Sefarad, clone this repository and open the main folder
```
git clone https://github.com/gsi-upm/Sefarad.git
cd Sefarad
```
To run it
```
python launch.py
docker-compose up
```
Configure Elastic search
```
command
```
-->


##Polymer - Web Components Technology
![Polymer logo](http://carlosortiz.co.uk/wp-content/uploads/2015/09/polymer-logo.jpg)
 
Polymer is a technology based on web components, so we could make a new component with diferent estructures of html, styles with css, and give some dinamic functions using Javascript.

Those components will be reusable only importing the tag `<component-tag></component-tag>` and they could share information using data binding among them.

##Demo
You can check out our Sefarad demo <a href="http://sefarad.cluster.gsi.dit.upm.es/">here</a> 

##References
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