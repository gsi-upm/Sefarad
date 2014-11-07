/** Depending on the html route, redirect to a setup screen or directly to visualization screen */
self.routes = function () {
	console.log('ROUTES')
	if (self.serverURL() == "") {
		self.page(4);
		errorinroute = true;

	} else {
		// Client-side routes    
		sammyPlugin = $.sammy(function () {
			this.bind('redirectEvent', function (e, data) {
				this.redirect(data['url_data']);
			});

			this.get('#/login', function (context) {

				console.log("LOGIN");
				self.page(10);					
				load('/login.html');
			});

			this.get('#/main', function (context) {
				//window.location.href = 'file:///home/mtorresl/Dropbox/FTT/grunt2/Sefarad/build/index.html#/main/ftt';
				console.log("ERROR EN RUTA");

				setupMethod();
				self.page(3);
				errorinroute = true;
			});

			this.get('#/main/:coreId/admin', function () {

				self.core(this.params.coreId);
				coreSelected = this.params.coreId;

				var solr_baseURL = serverURL + 'solr/' + coreSelected + '/';
				self.solr_baseURL(solr_baseURL);

				self.adminMode(true);

				/** Cargamos la configuración para el core dado */
				loadCore();
			});

			this.get('#/main/:coreId', function () {

				self.core(this.params.coreId);
				coreSelected = this.params.coreId;

				var solr_baseURL = serverURL + 'solr/' + coreSelected + '/';
				self.solr_baseURL(solr_baseURL);

				if (!self.securityEnabled()) {
					self.adminMode(true);
				} else {
					self.adminMode(false);
					self.showConfigurationPanel(false);
				}

				/** Cargamos la configuración para el core dado */
				loadCore();
			});

			this.get('#/sparql', function () {
				sparqlmode = true;
				self.sparql = ko.observable(true);
				self.sparql = ko.observable(true);
				self.showSparqlPanel = ko.observable(true);

				if (!self.securityEnabled()) {
					self.adminMode(true);
				} else {
					self.adminMode(false);
					self.showConfigurationPanel(false);
				}
				init();

			});

			this.get('#/sparql/kukinet', function () {
				sparqlmode = true;

				self.sparql = ko.observable(true);
				self.sparql = ko.observable(true);
				configuration.template.pageTitle = "KukiNet";
				configuration.template.logoPath = "https://lh4.ggpht.com/u5vxDMD5XpZQdnN8ZPVdU9rw1QCcD4VL1dgZ6OLw5jh8i9Bdz4aCDSCROMwTuk9YwOEM=w124";
				self.getResultsSPARQL("SELECT ?text ?score ?category ?delivered ?latitude ?longitude ?username ?userdescription ?usercountry ?uservoted ?userreceived ?userscore WHERE { ?s <http://www.kukinet.com/text> ?text ; <http://www.kukinet.com/score> ?score ; <http://www.kukinet.com/category> ?category ; <http://www.kukinet.com/delivered> ?delivered ; <http://www.kukinet.com/latitude> ?latitude ; <http://www.kukinet.com/longitude> ?longitude ; <http://www.kukinet.com/username> ?username ; <http://www.kukinet.com/userdescription> ?userdescription ; <http://www.kukinet.com/usercountry> ?usercountry ; <http://www.kukinet.com/uservoted> ?uservoted ; <http://www.kukinet.com/userreceived> ?userreceived ; <http://www.kukinet.com/userscore> ?userscore ; } LIMIT 100");
				configuration.results.resultsLayout = [{
					Name: "Títulos",
					Value: "text"
				}, {
					Name: "Subtítulo",
					Value: "username"
				}, {
					Name: "Descripción",
					Value: "score"
				}, {
					Name: "Logo",
					Value: ""
				}, ];
				configuration.template.language = "Español";
				templateWidgetsRight.push({
					id: 0,
					title: 'Categoría',
					type: 'tagcloud',
					field: 'category',
					collapsed: false,
					query: '',
					value: [],
					values: [],
					limits: '',
					layout: 'horizontal',
					showWidgetConfiguration: false,
					help: "Help"
				});
				templateWidgetsLeft.push({
					id: 1,
					title: 'País',
					type: 'tagcloud',
					field: 'usercountry',
					collapsed: false,
					query: '',
					value: [],
					values: [],
					limits: '',
					layout: 'vertical',
					showWidgetConfiguration: false,
					help: "Help"
				});
				templateWidgetsLeft.push({
					"id": 2,
					"title": "Gráfico",
					"type": "barchart",
					"field": 'category',
					"collapsed": ko.observable(false),
					"help": "Help"
				});
				//templateWidgetsLeft.push({"id": 3,"title": "Mapa", "type": "map","collapsed": ko.observable(false)});
				templateWidgetsLeft.push({
					"id": 4,
					"title": "Gauge",
					"type": "radialgauge",
					"collapsed": ko.observable(false),
					"help": "Help"
				});

				self.adminMode(true);

				init();
			});				

			this.get('#/graph/:coreId', function (context) {

			});

			this.get('#/sparql/countriesDemo', function () {
				self.sparql = ko.observable(true);

				if (!self.securityEnabled()) {
					self.adminMode(true);
				} else {
					self.adminMode(false);
					self.showConfigurationPanel(false);
				}

				self.getDataPolygons();

				init();

				$(window).load(function () {
					var data = JSON.stringify(poligonosUsa.results.bindings);
					ko.mapping.fromJSON(data, self.viewData);
					updateWidgets(true);
					openLayers.render();
				});
			});
			                
            this.get('#/sparql/universitiesDemo', function () {
                console.log("UNIVERSITIES DEMO");
                self.sparql = ko.observable(true);
                vm.getResultsSPARQL("select distinct ?universityResource ?countryResource ?cityResource ?university ?city ?country ?latitude ?longitude where { { ?universityResource <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://dbpedia.org/ontology/University> ; <http://dbpedia.org/ontology/country> ?countryResource ; <http://dbpedia.org/ontology/country> <http://dbpedia.org/resource/Spain> ; <http://dbpedia.org/ontology/city> ?cityResource ; <http://www.w3.org/2000/01/rdf-schema#label> ?university ; <http://www.w3.org/2003/01/geo/wgs84_pos#lat> ?latitude ; <http://www.w3.org/2003/01/geo/wgs84_pos#long> ?longitude . ?countryResource <http://www.w3.org/2000/01/rdf-schema#label> ?country . ?cityResource <http://www.w3.org/2000/01/rdf-schema#label> ?city } UNION { ?universityResource <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://dbpedia.org/ontology/University> ; <http://dbpedia.org/ontology/country> ?countryResource ; <http://dbpedia.org/ontology/country> <http://dbpedia.org/resource/France> ; <http://dbpedia.org/ontology/city> ?cityResource ; <http://www.w3.org/2000/01/rdf-schema#label> ?university ; <http://www.w3.org/2003/01/geo/wgs84_pos#lat> ?latitude ; <http://www.w3.org/2003/01/geo/wgs84_pos#long> ?longitude . ?countryResource <http://www.w3.org/2000/01/rdf-schema#label> ?country . ?cityResource <http://www.w3.org/2000/01/rdf-schema#label> ?city } FILTER ( lang(?university) = 'en' && lang(?country) = 'en' && lang(?city) = 'en') }", "http://dbpedia.org/sparql");
                configuration.template.language = "English";
                configuration.template.pageTitle = "Universities Demo";
                configuration.results.resultsLayout = [{
                    Name: "Títulos",
                    Value: "university"
                }, {
                    Name: "Subtítulo",
                    Value: "country"
                }, {
                    Name: "Descripción",
                    Value: "city"
                }, {
                    Name: "Logo",
                    Value: ""
                }, ];
                templateWidgetsLeft.push({
                    id: 0,
                    title: 'Countries',
                    type: 'tagcloud',
                    field: 'country',
                    collapsed: false,
                    query: '',
                    value: [],
                    values: [],
                    limits: '',
                    layout: 'horizontal',
                    showWidgetConfiguration: false,
					help: 'Muestra los países en los que existen Universidades'
                });
                configuration.autocomplete.field = "university";
                self.securityEnabled(false);
                sparqlmode = true;
                init();

                //Adding widgets
                $(window).load(function () {
                	
                    //Add map widget
                    widgetMap.render();

                    // // Add results widget
   //                  self.activeWidgetsRight.push({
   //                      "id": ko.observable(0),
   //                      "title": ko.observable(self.lang().results),
   //                      "type": ko.observable("resultswidget"),
   //                      "collapsed": ko.observable(false),
   //                      "layout": ko.observable("vertical"),
   //                      "showWidgetConfiguration": ko.observable(false),
						// "help": 'Muestra las Universidades filtradas'
   //                  });

					newResultsWidget.render();

                    // Add resultstats widget
                    self.addResultStatsWidget();

                    // Add PieChart sgvizler wigdet
                    self.sgvizlerQuery("SELECT ?university ?students WHERE{ ?universityresource <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://dbpedia.org/ontology/University> ; <http://dbpedia.org/ontology/country> ?countryresource ; <http://www.w3.org/2000/01/rdf-schema#label> ?university . ?countryresource <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://dbpedia.org/class/yago/EuropeanCountries> . ?universityresource <http://dbpedia.org/ontology/numberOfStudents> ?students FILTER ( lang(?university) = 'en') } GROUP BY ?university LIMIT 50");
                    self.sgvizlerGraphType('google.visualization.PieChart');
                    self.sparql_baseURL("http://dbpedia.org/sparql");
                    self.addSgvizlerWidget("Total students by University");

                    // Add Gauge Widget
                    var id = Math.floor(Math.random() * 10001);
                    self.activeWidgetsLeft.push({
                        "id": ko.observable(id),
                        "title": ko.observable("Total Universities"),
                        "type": ko.observable("radialgauge"),
                        "collapsed": ko.observable(false),
						"help": "Muestra el total de universidades filtradas."
                    });
                    self.numberOfResults.valueHasMutated();                        
                });
            });

			this.get('#/sparql/smod', function () {
                console.log("SMOD DEMO");
                self.sparql = ko.observable(true);
                vm.getDataSmod();
                configuration.template.language = "English";
                configuration.template.pageTitle = "SmartOpenData";
                configuration.results.resultsLayout = [{
                    Name: "Parcel",
                    Value: "parcela"
                }, {
                    Name: "Area",
                    Value: "shape_area"
                }, {
                    Name: "Use",
                    Value: "uso"
                }, {
                    Name: "Image",
                    Value: ""
                }, ];
                templateWidgetsLeft.push({
                    id: 0,
                    title: 'Land Use',
                    type: 'tagcloud',
                    field: 'uso',
                    collapsed: false,
                    query: '',
                    value: [],
                    values: [],
                    limits: '',
                    layout: 'horizontal',
                    showWidgetConfiguration: false,
					help: 'Muestra los distintos usos de suelo existentes'
                });
                configuration.autocomplete.field = "parcela";
                self.securityEnabled(false);
                sparqlmode = true;
                init();

                //Adding widgets
                $(window).load(function () {
                	//Add openalayers map
                	openlayersMap.render();                    	
                	
                    // // Add results widget
                    self.activeWidgetsRight.push({
                        "id": ko.observable(0),
                        "title": ko.observable(self.lang().results),
                        "type": ko.observable("resultswidget"),
                        "collapsed": ko.observable(false),
                        "layout": ko.observable("vertical"),
                        "showWidgetConfiguration": ko.observable(false),
						"help": 'Muestra las parcelas filtradas'
                    });

                    // Add PieChart sgvizler wigdet
                    self.sgvizlerQuery("SELECT ?university ?students WHERE{ ?universityresource <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://dbpedia.org/ontology/University> ; <http://dbpedia.org/ontology/country> ?countryresource ; <http://www.w3.org/2000/01/rdf-schema#label> ?university . ?countryresource <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://dbpedia.org/class/yago/EuropeanCountries> . ?universityresource <http://dbpedia.org/ontology/numberOfStudents> ?students FILTER ( lang(?university) = 'en') } GROUP BY ?university LIMIT 50");
                    self.sgvizlerGraphType('google.visualization.PieChart');
                    self.sparql_baseURL("http://dbpedia.org/sparql");
                    self.addSgvizlerWidget("Total students by University");

                    //Add slider widget
                    self.newNumericFilterValue('shape_area');
                    self.slider = ko.observable([]);
					self.slider().push(minSliderValue, maxSliderValue);

					self.activeWidgetsLeft.push({
						"id": ko.observable(Math.floor(Math.random() * 10001)),
						"title": ko.observable("Shape Area"),
						"type": ko.observable("slider"),
						"field": ko.observable(self.newNumericFilterValue()),
						"collapsed": ko.observable(false),
						"value": ko.observable(((maxSliderValue - minSliderValue) / 100)),
						"values": self.slider,
						"limits": ko.observable([minSliderValue, maxSliderValue]),
						"help": "Seleccione el rango de areas en el que desea filtrar las parcelas"
					});

                    // Add Gauge Widget
                    var id = Math.floor(Math.random() * 10001);
                    self.activeWidgetsLeft.push({
                        "id": ko.observable(id),
                        "title": ko.observable("Filtered Parcels"),
                        "type": ko.observable("radialgauge"),
                        "collapsed": ko.observable(false),
						"help": "Muestra el numero total de parcelas filtradas."
                    });
                    self.numberOfResults.valueHasMutated();
                    	
                });
            });

			// this.notFound = function () {
			// 	console.log("no found sammy");
			// 	self.page(1);
			// 	errorinroute = true;
			// }
		}).run('#/main');
	}
}