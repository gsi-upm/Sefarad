![GSI Logo](http://www.gsi.dit.upm.es/templates/jgsi/images/logo.png)
![Sefarad Logo](./images/Sefarad_Logo.png)
==================================

##Introduction
Sefarad is an application developed to explore data by making SPARQL queries to the endpoint you choose without writing more code. You can also create your own cores if you have a big collection of data ([LMF](https://code.google.com/p/lmf/) required). To view your data you can customize your own widgets and visualize it through them.

##Getting Started 
If you want to easy try Sefarad, just download this repository (cloning it to your computer or downloading it as a .zip) and open the main folder `sefarad-3.0/` in the bash console and run a simple server such as the python one `python -m SimpleHTTPServer <port>` and open the web browser with `localhost:<port>` in the url field and explore data.

To serve data for analysing, we use ElasticSearch and recover data using API REST petitions, injecting those data in widgets based on Web Components (Polymer) Technologies.

##Polymer - Web Components Technology
![Polymer logo](http://carlosortiz.co.uk/wp-content/uploads/2015/09/polymer-logo.jpg)
 
Polymer is a technology based on web components, so we could make a new component with diferent estructures of html, styles with css, and give some dinamic functions using Javascript.

Those components will be reusable only importing the tag `<component-tag></component-tag>` and they could share information using data binding among them.


##Deploying in Dokku

To deploy in dokku, there are two parts:

      1 - Elasticsearch-docker
      2 - Sefarad 3.0
For the first one, the only thing we have to do is deploy the service directly in dokku.
For the second one, as sefarad is build on JavaScript, it can't access to elasticsearch without making a proxy, for that reason it needs to lauch a Apache service and you have to make a proxy inside it listening the URL of JavaScript and redirecting to Elasticsearch. 
