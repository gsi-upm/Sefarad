//configuration

var eurosentimentEndpointURI =  "http://146.148.28.139/eurosentiment/sparql-endpoint";
var googleSpreadsheetURI = "https://docs.google.com/spreadsheet/pub?key=0AoneFswCzkATdDFGTzFHdmpvNG93M2dfTG1jb001YXc&single=true&gid=23&output=csv";
var eurosentimentResourceNavigatorURLPrefix = "http://www.eurosentiment.eu/dataset/";       // if urls in the sparql results starts with such prefix
var eurosentimentResourceNavigatorURL = "http://portal.eurosentiment.eu/lr_navigator_demo"; // then later on click they will point to this navigator

// end of configuration

var queries = [];

var yasqe = YASQE(document.getElementById("yasqe"), {
	sparql: {
		showQueryButton: false,
		createShareLink: false,
		endpoint: eurosentimentEndpointURI 
	}
});