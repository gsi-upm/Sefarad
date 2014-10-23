Sparql queries demo for eurosentiment project
=============================================


## Installation

This demo is pure client side to run it just open index.html in your browser.

Note:    
In order to run correctly you need to be able to access these two url from your machine:    

```
var endpointURI = "http://54.201.101.125:8890/sparql";
var googleSpreadsheetURI = "https://docs.google.com/spreadsheet/pub?key=0AoneFswCzkATdDFGTzFHdmpvNG93M2dfTG1jb001YXc&single=true&gid=23&output=csv";


// if urls in the sparql results starts with such prefix
var eurosentimentResourceNavigatorURLPrefix = "http://www.eurosentiment.eu/dataset/";    
// then later on click they will point to this navigator
var eurosentimentResourceNavigatorURL = "http://portal.eurosentiment.eu/lr_navigator_demo";    
```


## Usage

Index page contains a dropdown where the query template can be selected.    
Once selected the template is loaded into textarea and depends on the number of parameters additional selects appears.    
When user selects additional parameters the query template is updated.    
On the right side of text area there is a button to execute the query.    
The query results apper under the text area.

## Query templates

Query templates, descriptions and parameters are defined in google spreadsheet and taken from there automatically when the page is loaded.

Copy of this spreadsheet in 2 formats attached 
EuroSentiment Demo Sparql Queries.ods
EuroSentiment Demo Sparql Queries.xlsx

In case something is wrong with current spredshhet published at:

```
https://docs.google.com/spreadsheet/pub?key=0AoneFswCzkATdDFGTzFHdmpvNG93M2dfTG1jb001YXc&single=true&gid=23&output=csv"
```
It can be restored from attached copies.
Once restored it must be made public via 
File->"Published on the web" option in Google Spreadsheet menu. 



