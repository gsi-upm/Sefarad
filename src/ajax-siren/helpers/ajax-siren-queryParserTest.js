test( "pathToJson test", function() {
	
	equal( pathToJson( "boolean.json.category_code",false ), "category_code: false" );
	equal( pathToJson( "double.json.category_code",10 ), "category_code: xsd:double(10)" );
	equal( pathToJson( "string.json.category_code","software" ), "category_code: software" );
	equal( pathToJson( "string.json.category_code","software X" ), "category_code: 'software X'" );
	equal( pathToJson( "string.json.category_code","software 'X'" ), "category_code: \"software 'X'\"" );
	equal( pathToJson( "string.json.category_code","smith's" ), "category_code: smith's" );
	
	equal( pathToJson( "boolean.json.providerships.is_past", true ), "providerships: {is_past: true}" );
	equal( pathToJson( "double.json.providerships.is_past", 10 ), "providerships: {is_past: xsd:double(10)}" );
	equal( pathToJson( "string.json.providerships.is_past", "A" ), "providerships: {is_past: A}" );
	equal( pathToJson( "string.json.providerships.is_past", "A B" ), "providerships: {is_past: 'A B'}" );
	equal( pathToJson( "string.json.providerships.is_past", "A 'B'" ), "providerships: {is_past: \"A 'B'\"}" );
	equal( pathToJson( "string.json.providerships.is_past", "smith's" ), "providerships: {is_past: smith's}" );

	
	
	//double.json.investments.funding_round.raised_amount 
});


test( "unjsonize test", function() {
	var q = new QueryParser();

	deepEqual( q._unjsonize( { a : "--single-quote--b--single-quote--"}     ), "a: 'b'"  );
	deepEqual( q._unjsonize( { funding_rounds : {investments : { financial_org : "--star--", company : null, person : null }}} ), "funding_rounds: {investments: {financial_org: *, company: null, person: null}}" );
	deepEqual( q._unjsonize( { category_code : "--single-quote--null--single-quote--" }                                        ), "category_code: 'null'" );	
	deepEqual( q._unjsonize( { category_code : "--single-quote--software--single-quote--" }                                    ), "category_code: 'software'" );
	deepEqual( q._unjsonize( { funding_rounds : { funded_year : "xsd:long(2002)" }}           							       ), 'funding_rounds: {funded_year: xsd:long(2002)}' );
	deepEqual( q._unjsonize( { funding_rounds : { funded_month : "xsd:long(2)" }}                                              ), 'funding_rounds: {funded_month: xsd:long(2)}' );
	deepEqual( q._unjsonize( { funding_rounds : { round_code : "--single-quote--b--single-quote--" }}                          ), "funding_rounds: {round_code: 'b'}" );
	deepEqual( q._unjsonize( { offices : { country_code : "--single-quote--AND--single-quote--" }}                                                             ), "offices: {country_code: 'AND'}" );  
	
	deepEqual( q._unjsonize( { funding_rounds : { price: "xsd:double(100)" }}                                                 ), 'funding_rounds: {price: xsd:double(100)}' );
	deepEqual( q._unjsonize( { funding_rounds : { price: "xsd:double(100.1)" }} 											  ), 'funding_rounds: {price: xsd:double(100.1)}'  );
	deepEqual( q._unjsonize( { funding_rounds : { price: "xsd:double(1.1E7)" }} 											  ), 'funding_rounds: {price: xsd:double(1.1E7)}'  );
});


test( "jsonize test", function() {
	var q = new QueryParser();

	deepEqual( q._jsonize("a : 'b'" ), { a : "--single-quote--b--single-quote--"} );
	deepEqual( q._jsonize("funding_rounds : {investments : { financial_org : *, company : null, person : null }}" ), { funding_rounds : {investments : { financial_org : "--star--", company : null, person : null }}} );
	deepEqual( q._jsonize("category_code : 'null'"), 							 { category_code : "--single-quote--null--single-quote--" } );	
	deepEqual( q._jsonize("category_code : 'software'"), 						 { category_code : "--single-quote--software--single-quote--" } );
	deepEqual( q._jsonize('funding_rounds : { funded_year : xsd:long(2002) } '), { funding_rounds : { funded_year : "xsd:long(2002)" }} );
	deepEqual( q._jsonize('funding_rounds : { funded_month : xsd:long(2) }'   ), { funding_rounds : { funded_month : "xsd:long(2)" }} );
	deepEqual( q._jsonize("funding_rounds : { round_code : 'b' } "),             { funding_rounds : { round_code : "--single-quote--b--single-quote--" }} );
	deepEqual( q._jsonize("offices : { country_code : 'AND' }"),                 { offices : { country_code : "--single-quote--AND--single-quote--" }} );  

	deepEqual( q._jsonize('funding_rounds : { price : xsd:double(100) } '),    { funding_rounds : { price : "xsd:double(100)" }} );
	deepEqual( q._jsonize('funding_rounds : { price : xsd:double(100.1) } '),    { funding_rounds : { price : "xsd:double(100.1)" }} );
	deepEqual( q._jsonize('funding_rounds : { price : xsd:double(1.1E7) } '),    { funding_rounds : { price : "xsd:double(1.1E7)" }} );
	
	
});

test( "parse test", function() {
  
	var q = new QueryParser();
	
	q.parse("USA");
	deepEqual(q.getParsed().keywords, ["USA"] );
	deepEqual(q.getParsed().jsons, [] );

	q.parse("category_code : 'software'");
	deepEqual(q.getParsed().keywords, [] );
	deepEqual(q.getParsed().jsons, ["category_code : 'software'"] );

	q.parse("USA AND ( category_code : 'software' )");
	deepEqual(q.getParsed().keywords, ["USA"] );
	deepEqual(q.getParsed().jsons, ["category_code : 'software'"] );
	
	q.parse("USA AND ( category_code : { name: 'software'} )");
	deepEqual(q.getParsed().keywords, ["USA"] );
	deepEqual(q.getParsed().jsons, ["category_code : { name: 'software'}"] );

	q.parse("USA AND ( category_code : 'software' ) AND ( category_code : 'web' )");
	deepEqual(q.getParsed().keywords, ["USA"] );
	deepEqual(q.getParsed().jsons, ["category_code : 'software'","category_code : 'web'"] );

});

test( "generateQ test ( merge=false )", function() {
	var q = new QueryParser();
	
	q.parse("USA");
	equal(q.generateQ(),"USA");
	
	q.parse("USA Canada");
	equal(q.generateQ(),"USA Canada");
});

test( "generateQ test ( merge=true )", function() {
	var q = new QueryParser({
		merge:true
		/*
		facetPaths:[
		    {
		        regex:"^(\{\!keyword\} )(\\s*x\\s*\:\\s*\)(.*)(\\s*)$",
		        mergeId:[0]
		    },
		    {
		        regex:"^(\{\!keyword\} )(\\s*a\\s*\:\\s*\{\\s*b\\s*\:\\s*)(.*)(\\s*\}\\s*)$",
		        mergeId:[1,1]
		    },
		    {
		        regex:"^(\{\!keyword\} )(\\s*a\\s*\:\\s*\{\\s*c\\s*\:\\s*)(.*)(\\s*\}\\s*)$",
		        mergeId:[1,2]
		    },
		    {
		        regex:"^(\{\!keyword\} )(\\s*A\\s*\:\\s*\{\\s*B\\s*\:\\s*)(.*)(\\s*\}\\s*)$",
		        mergeId:[2,1]
		    },
		    {
		        regex:"^(\{\!keyword\} )(\\s*A\\s*\:\\s*\{\\s*C\\s*\:\\s*)(.*)(\\s*\}\\s*)$",
		        mergeId:[2,2]
		    }
		]
		*/
	});
	
	q.parse("USA AND ( x: 'varx1' ) AND ( a: {b: 'varb1' })  AND ( a: {c: 'varc1' }) AND ( A: {B: 'varB1' }) AND ( A: {C: 'varC1' })");
	
	equal(q.generateQ(),"USA AND ( x: 'varx1' ) AND ( a: {b: 'varb1', c: 'varc1'} ) AND ( A: {B: 'varB1', C: 'varC1'} )");
	
});

test( "addKeyword test  merge=false", function() {
	var q = new QueryParser();
	
	q.parse("USA");
	q.addKeyword("Canada");
	equal(q.generateQ(),"USA Canada");

	q.parse("USA");
	q.addKeyword("Canada");
	q.addKeyword("Poland");
	equal(q.generateQ(),"USA Canada Poland");

	q.parse("USA AND ( a: 'b')");
	q.addKeyword("Canada");
	equal(q.generateQ(),"USA Canada AND ( a: 'b' )");

});

test( "addKeyword test ( merge=true )", function() {
	var q = new QueryParser({
		merge:true
	});
	
	q.parse("USA");
	q.addKeyword("Canada");
	equal(q.generateQ(),"USA Canada");

	q.parse("USA");
	q.addKeyword("Canada");
	q.addKeyword("Poland");
	equal(q.generateQ(),"USA Canada Poland");

	q.parse("USA AND ( a: 'b')");
	q.addKeyword("Canada");
	equal(q.generateQ(),"USA Canada AND ( a: 'b' )");
});


test( "removeKeyword test ( merge=false )", function() {
	var q = new QueryParser();
	
	q.parse("USA Canada");
	q.removeKeyword("Canada");
	equal(q.generateQ(),"USA");

	q.parse("USA Canada Poland");
	q.removeKeyword("Canada");
	q.removeKeyword("Poland");
	equal(q.generateQ(),"USA");

	q.parse("USA Canada Poland AND (a: 'b')");
	q.removeKeyword("Canada");
	q.removeKeyword("Poland");
	equal(q.generateQ(),"USA AND ( a: 'b' )");

	q.parse("USA AND (a: 'b')");
	q.removeKeyword("USA");
	equal(q.generateQ(),"( a: 'b' )");

});

test( "removeKeyword test ( merge=true )", function() {
	var q = new QueryParser({
		merge:true
	});
	
	q.parse("USA Canada");
	q.removeKeyword("Canada");
	equal(q.generateQ(),"USA");

	q.parse("USA Canada Poland");
	q.removeKeyword("Canada");
	q.removeKeyword("Poland");
	equal(q.generateQ(),"USA");
	
	
	q.parse("USA Canada Poland AND (a: 'b')");
	q.removeKeyword("Canada");
	q.removeKeyword("Poland");
	equal(q.generateQ(),"USA AND ( a: 'b' )");

	q.parse("USA AND (a: 'b')");
	q.removeKeyword("USA");
	equal(q.generateQ(),"( a: 'b' )");
});

test( "addJson test ( merge=true )", function() {
	var q = new QueryParser({
		merge:true
	});
	
	q.parse("USA");
	q.addJson("a : 'b'");
	equal(q.generateQ(),"USA AND ( a: 'b' )");

	q.parse("USA");
	q.addJson("a : 'b'");
	q.addJson("c : 'd'");
	equal(q.generateQ(),"USA AND ( a: 'b' ) AND ( c: 'd' )");

});

test( "addJson test ( merge=false )" , function() {
	var q = new QueryParser();
	
	q.parse("USA");
	q.addJson("a : 'b'");
	equal(q.generateQ(),"USA AND ( a: 'b' )");

	q.parse("USA");
	q.addJson("a : 'b'");
	q.addJson("c : 'd'");
	equal(q.generateQ(),"USA AND ( a: 'b' ) AND ( c: 'd' )");

});


test( "production bugs test", function() {
	var q = new QueryParser();
	
	q.parse("USA AND ( category_code : 'software' ) AND ( funding_rounds : { funded_month : xsd:long(6) }   )" );

	ok(true);
});

test("long queries ",function(){
	
	var query = "USA AND ( category_code : 'other' ) AND ( funding_rounds : { funded_month : xsd:long(10) } ) AND ( funding_rounds : { funded_year : xsd:long(2000) } ) AND ( funding_rounds : { round_code : 'f' } ) AND ( offices : { country_code : 'CAN' } ) AND ( funding_rounds : {investments : { financial_org : *, company : null, person : null }} )";
	
	var qp = new QueryParser();
	qp.parse(query);
	
	ok(true);
});


test("query with AND string as value",function(){
	
	var query = "USA AND ( offices : { country_code : 'AND' }   )";
	var qp = new QueryParser();
	qp.parse(query);
	
	deepEqual(qp.getParsed().keywords, ["USA"] );
	deepEqual(qp.getParsed().jsons, ["offices : { country_code : 'AND' }"] );
	
});


test( "regex experiment", function() {
	var facetPathRegexes = [
		                   	{
		                   		name:"category_code : ",	
		                   		regex : "^(\{\!keyword\} )(category_code \: ')(.*)('\\s*)$"
		                   	},
		                   	{
		                   		name:"funding_rounds : funded_month : ",	
		                   		regex : "^(\{\!keyword\} )(funding_rounds \: \{ funded_month \: )(.*)( \}\\s*)$"
		                   	},
		                   	{
		                   		name:"funding_rounds : funded_year : ",	
		                   	    regex : "^(\{\!keyword\} )(funding_rounds \: \{ funded_year \: )(.*)( \}\\s*)$"
		                   	},
		                   	{
		                   		name:"funding_rounds : round_code : ",	
		                   		regex : "^(\{\!keyword\} )(funding_rounds \: \{ round_code \: ')(.*)(' \}\\s*)$"
		                   	},
		                   	{
		                   		name:"offices : country_code : ",	
		                   		regex : "^(\{\!keyword\} )(offices \: \{ country_code \: ')(.*)(' \}\\s*)$"
		                   	},
		                   	{
		                   		name:"funding_rounds : investments :",	
		                   		regex : "^(\{\!keyword\} )(funding_rounds \: \{investments \: )(\{.*\})(\}\\s*)$"
		                   	}
		                ];


equal( generateName(facetPathRegexes[0].regex),"category_code:" );	
equal( generateName(facetPathRegexes[1].regex),"funding_rounds.funded_month:" );	
equal( generateName(facetPathRegexes[2].regex),"funding_rounds.funded_year:" );	



equal( generatePrefixRegexString( facetPathRegexes[0].regex) , "^(\{\!keyword\} )(category_code \: ')"  );
equal( generatePrefixRegexString( facetPathRegexes[1].regex) , "^(\{\!keyword\} )(funding_rounds \: \{ funded_month \: )"  );
equal( generatePrefixRegexString( facetPathRegexes[2].regex) , "^(\{\!keyword\} )(funding_rounds \: \{ funded_year \: )"  );
equal( generatePrefixRegexString( facetPathRegexes[3].regex) , "^(\{\!keyword\} )(funding_rounds \: \{ round_code \: ')"  );
equal( generatePrefixRegexString( facetPathRegexes[4].regex) , "^(\{\!keyword\} )(offices \: \{ country_code \: ')"  );
equal( generatePrefixRegexString( facetPathRegexes[5].regex) , "^(\{\!keyword\} )(funding_rounds \: \{investments \: )" );

equal( getRegexThatMatchedJson( facetPathRegexes, "{\!keyword\} " + "category_code : 'XXX' " ) , facetPathRegexes[0] );
equal( getRegexThatMatchedJson( facetPathRegexes, "{\!keyword\} " + "category_code : 'XXX'" ) , facetPathRegexes[0] );

equal( getRegexThatMatchedJson( facetPathRegexes, "{\!keyword\} " + "funding_rounds : { funded_month : xsd:long(5) }  " ) , facetPathRegexes[1] );
equal( getRegexThatMatchedJson( facetPathRegexes, "{\!keyword\} " + "funding_rounds : { funded_month : xsd:long(5) }" ) , facetPathRegexes[1] );

equal( getRegexThatMatchedJson( facetPathRegexes, "{\!keyword\} " + "funding_rounds : { funded_year : xsd:long(2006) }  " ) , facetPathRegexes[2] );
equal( getRegexThatMatchedJson( facetPathRegexes, "{\!keyword\} " + "funding_rounds : { funded_year : xsd:long(2006) }" ) , facetPathRegexes[2] );



});

 