//default configuration (overloaded by webservice)
		//"serverURL": "http://shannon.gsi.dit.upm.es/episteme/lmf/",
var configuration = {
	"widgetsLeft" : [],
	"widgetsRight" : [],
	"widgetsLeftTab1" : [],
	"widgetsRightTab1" : [],
	"endpoints" : {
		"serverURL": "http://localhost:8080/LMF/",
		"baseURL" : [""],
		"sparql_baseURL" : []
	},
	"template" : {
		"pageTitle" : "Episteme",
		"logoPath": "",
		"showMapWidget": false,
		"showResultsWidget": true,
		"language": "Español"
	},
    "results" : {
		"wcolor": "color-red",
		"wtitle": "Resultados",
		"wtype": "results",
		"wcollapsed" : false,
		"wgraphscollapsed" : false,
		"wshowConfig": false,
		"extra" : [],
		"resultsGraphs" : [],
		"resultsLayout" : [
		{
			Name: "Títulos",
			Value: "s"},
		{
			Name: "Subtítulo",
			Value: "p"},
		{
			Name: "Descripción",
			Value: "o"},
		{
			Name: "Logo",
			Value: "photo"},
	]},
	"autocomplete" : {
		"field": "",
		"actived": true},
	"searchengine" : {
	     	
	},
	"mapWidget" : {
		"latitude": "latitude",
		"longitude": "longitude"
	},
    "other" : {
        "sort":{
            "field":"name",
            "order":"asc"
        },
		"available_languages": ["Español"],
		"lightmode": false,
		"maxNumberOfResults": "100",
		"default_language": "Español",
		"showMap": true
    }
}
