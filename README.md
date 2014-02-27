![GSI Logo](http://www.gsi.dit.upm.es/templates/jgsi/images/logo.png)
![Sefarad Logo](./src/img/Logo3.png)
==================================

##Introduction
Sefarad is an application developed to explore data by making SPARQL queries to the endpoint you choose without writing more code. You can also create your own cores if you have a big collection of data ([LMF](https://code.google.com/p/lmf/) required). To view your data you can customize your own widgets and visualize it through them.

##Getting Started 
If you want to easy try Sefarad, just download this repository (cloning it to your computer or downloading it as a .zip) and open in your web browser the file `demo.html` located in the `build /` folder. 

We provide you everything you need to take your first steps in Sefarad through our [European Universities Demo](http://demos.gsi.dit.upm.es/sefarad/index.html#/sparql/universitiesDemo). Visit the [Case Study](https://www.youtube.com/watch?v=NJ8i2kpGGxs) video to learn more about the demo and the possibilities you have. Summarizing, we have make a SPARQL query for European Universities to [DBpedia](http://dbpedia.org/About) (We have set a limit of 50 results for improved performance). Furthermore, we have include some widgets that allows you to filter those universities by country/city, shows them into a map and show the total number of filtered universities.

Of course you may add the widgets you want just clicking _Add widget_ button. 

Let's _play_ with our demo and try yourself the possibilities it brings to you. 


##Developers
First of all, `Node.js version >= 0.8.0` is required. You can install it through [Node.js](http://nodejs.org/) website. Once you have installed it, you also need to install Grunt's command Line Interface (CLI). You can do this globally just running:

> Try using sudo

```shell
npm install -g grunt-cli
```
Assuming that you have installed all you need, you may start working. You should always works into `src/` directory. You can create, modify and remove everything you want. Upon having made every change you need, you may run the specific grunt command in order to generate the final executable project and pack it into `build/` folder. 

To perform the necessary _grunt.js_ tasks, you have to install the project dependencies listed in the file `package.json`. To do this, run the next command in the root folder (the folder where the file `package.json` is).
 
```shell
sudo npm install 
```
Now, it is as easy as run the specific grunt command depending on what you want to generate. You have the following posibilities:

> Note that this will overwrite the previous content of your `build/` directory. 

**_Sefarad default_**

If you want to work with a complete version of _Sefarad_, just run:

```shell
grunt
```
or

```shell
grunt default
```
That will generate all you need into `build/` folder. All you need is to run `index.html`.

**_Universities Demo_**

If you want to try our demo (which is completely provided within the repository), run:

```shell
grunt demo
```
Again, that will generate all you need into `build/` folder. This time, all you need is to run `demo.html`.


In order to make your own modifications, there are two files that are specially important: _sefarad.html_ and _js/mvvm.js_.

####Sefarad.html
Sefarad is developed as a _single page web application_. This file contains all the information about everything you could see in Sefarad. Each part of the html is set visible or invisible depending on the variable _page()_ (managed by the controller within _mvvm.js_). 

####mvvm.js


###Widgets
You will find all the available widgets into `src/js/widgets`. If you want to add your own widgets you should use the `D3.js` library (Drive-Data Documents), and situate it into `src/js/widgets/d3` folder, in which our _include-widgets- grunt task will search all t


For more information, visit the [Project Wiki](https://github.com/gsi-upm/Sefarad/wiki) or contact us through: http://gsi.dit.upm.es
