/**
 * Created by asaura on 5/02/15.
 */

var rawData = [];
var filteredData = [];

var datatable;
var nameDim;
var designationDim;

function print_filter(filter){
    var f=eval(filter);
    if (typeof(f.length) != "undefined")
    {

    }else
    {

    }
    if (typeof(f.top) != "undefined")
    {
        f=f.top(Infinity);
    }else
    {

    }
    if (typeof(f.dimension) != "undefined")
    {
        f=f.dimension(function(d) {
            return "";
        }).top(Infinity);
    }else
    {

    }
    console.log(filter+"("+f.length+") = "+JSON.stringify(f).replace("[","[\n\t").replace(/}\,/g,"},\n\t").replace("]","\n]"));
}



$( document ).ready(function() {

    //console.log( "ready!" );

    var testQuery = "select distinct ?universityResource ?countryResource ?cityResource ?university ?city ?country ?latitude ?longitude where { { ?universityResource <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://dbpedia.org/ontology/University> ; <http://dbpedia.org/ontology/country> ?countryResource ; <http://dbpedia.org/ontology/country> <http://dbpedia.org/resource/Spain> ; <http://dbpedia.org/ontology/city> ?cityResource ; <http://www.w3.org/2000/01/rdf-schema#label> ?university ; <http://www.w3.org/2003/01/geo/wgs84_pos#lat> ?latitude ; <http://www.w3.org/2003/01/geo/wgs84_pos#long> ?longitude . ?countryResource <http://www.w3.org/2000/01/rdf-schema#label> ?country . ?cityResource <http://www.w3.org/2000/01/rdf-schema#label> ?city } UNION { ?universityResource <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://dbpedia.org/ontology/University> ; <http://dbpedia.org/ontology/country> ?countryResource ; <http://dbpedia.org/ontology/country> <http://dbpedia.org/resource/France> ; <http://dbpedia.org/ontology/city> ?cityResource ; <http://www.w3.org/2000/01/rdf-schema#label> ?university ; <http://www.w3.org/2003/01/geo/wgs84_pos#lat> ?latitude ; <http://www.w3.org/2003/01/geo/wgs84_pos#long> ?longitude . ?countryResource <http://www.w3.org/2000/01/rdf-schema#label> ?country . ?cityResource <http://www.w3.org/2000/01/rdf-schema#label> ?city } FILTER ( lang(?university) = 'en' && lang(?country) = 'en' && lang(?city) = 'en') }";
    //executeSPARQLquery(testQuery, "http://dbpedia.org/sparql", 1); //universities data to stream 0

    getPolygonsFromEuro(); //slovakian data to rawData

    //configure widgets:
    initializeWidgets();

    var data =
        [{
            "res": {
                "type": "uri",
                "value": "http://geop.sazp.sk/id/ProtectedSite/ProtectedSitesSK/SKNATS942"
            },
            "fGeom": {
                "type": "uri",
                "value": "http://geop.sazp.sk/id/ProtectedSite/ProtectedSitesSK/geometry/SKNATS942"
            },
            "fWKT": {
                "datatype": "http://www.opengis.net/ont/sf#wktLiteral",
                "type": "typed-literal",
                "value": "MULTIPOLYGON(((17.65642811769707 48.1686865811456, 17.65756980632113 48.168967289789705, 17.657608569434387 48.16896598338847, 17.65769639973905 48.16880183212624, 17.65822906926184 48.16887675030204, 17.658162164198007 48.16904403180126, 17.65787080479256 48.16900290282792, 17.657820580595104 48.16912727876681, 17.658159555536933 48.16923816997645, 17.658162796350194 48.169240788150056, 17.658316627007594 48.16928800535739, 17.65834533021153 48.16931486960582, 17.65835074989889 48.16932382229647, 17.658378852081928 48.16937010113979, 17.658354591607527 48.169461877558376, 17.658357479132654 48.16946435324316, 17.658368802339357 48.16947400120634, 17.658415213127103 48.16955557344484, 17.658483890261138 48.16962040798056, 17.658574688891033 48.16969509821308, 17.658613064219676 48.169718084877026, 17.658732827753102 48.16980549406354, 17.658787532278094 48.16982829652268, 17.658983505255176 48.16990113202145, 17.659210724068327 48.16995778512663, 17.659375564345368 48.16999477868778, 17.65937257571529 48.16995850701595, 17.659372507599986 48.1699576147455, 17.65936352673884 48.16984880803619, 17.659143752182235 48.169803529218335, 17.659025316390256 48.16978395914443, 17.65899701531068 48.169504285248614, 17.658996876374037 48.169502815030654, 17.659153447145076 48.16949653587131, 17.659319321565665 48.16948643900879, 17.65930987184587 48.16939581571377, 17.6592956466867 48.16927867787938, 17.65928925366523 48.16920712584244, 17.659280915959236 48.169184605071926, 17.659270729464794 48.16909430539911, 17.659270669761476 48.169093746651924, 17.65927051806441 48.16909207213542, 17.65926152285123 48.16898720492909, 17.65924861150651 48.16885492451801, 17.659240839531773 48.16880291385667, 17.65912888600179 48.16876872992051, 17.659133823214255 48.1687205437001, 17.659134148556824 48.168717345229055, 17.65913840976443 48.16867563760638, 17.659139591299226 48.16866713735671, 17.65918779776315 48.16831794626327, 17.659201501882972 48.1681886356563, 17.659207365805685 48.168133366882614, 17.659212123155974 48.16808842529354, 17.659286776577968 48.167811631990766, 17.65930787523574 48.16769532024675, 17.659342735721694 48.16755489069048, 17.659378346435098 48.167132221858424, 17.658860546760792 48.167000358360326, 17.658781659690202 48.167207548186056, 17.65892822865503 48.167253660411546, 17.659105746382583 48.167425020379234, 17.65903908256993 48.16768835835751, 17.6589484098566 48.16808652811579, 17.65895686566025 48.16808804997225, 17.658955549249306 48.16808836487376, 17.65855709936885 48.16801087085935, 17.656944578479465 48.16769889687779, 17.65694335498947 48.16770091033017, 17.656917357112256 48.167750666045016, 17.656733133350244 48.1681121071087, 17.65642811769707 48.1686865811456)))"
            },
            "spc": {
                "type": "literal",
                "value": "natureConservation ecological environment"
            },
            "lfd": {
                "type": "literal",
                "value": ""
            },
            "lfdoc": {
                "type": "literal",
                "value": ""
            },
            "inspire": {
                "type": "uri",
                "value": "http://geop.sazp.sk/id/ProtectedSite/ProtectedSitesSK/inspireId/SKNATS942"
            },
            "sitename": {
                "type": "uri",
                "value": "http://geop.sazp.sk/id/ProtectedSite/ProtectedSitesSK/siteName/SKNATS942"
            },
            "gname": {
                "type": "uri",
                "value": "http://geop.sazp.sk/id/ProtectedSite/ProtectedSitesSK/GeographicalName/SKNATS942"
            },
            "spelling": {
                "type": "uri",
                "value": "http://geop.sazp.sk/id/ProtectedSite/ProtectedSitesSK/spelling/SKNATS942"
            },
            "spellingofname": {
                "type": "uri",
                "value": "http://geop.sazp.sk/id/ProtectedSite/ProtectedSitesSK/SpellingOfName/SKNATS942"
            },
            "name": {
                "type": "literal",
                "xml:lang": "SL",
                "value": "Park pri Ihrisku"
            },
            "namespace": {
                "type": "literal",
                "value": "SK:GOV:MOE:SEA:PS"
            },
            "localId": {
                "type": "literal",
                "value": "SK:GOV:MOE:SEA:PS"
            },
            "siteDesignation": {
                "type": "uri",
                "value": "http://geop.sazp.sk/id/ProtectedSite/ProtectedSitesSK/siteDesignation/SKNATS942"
            },
            "percentageUnderDesignation": {
                "type": "literal",
                "value": ""
            },
            "designation": {
                "type": "literal",
                "value": "wildernessArea"
            },
            "designationScheme": {
                "type": "literal",
                "value": "IUCN"
            }
        }, {
            "res": {
                "type": "uri",
                "value": "http://geop.sazp.sk/id/ProtectedSite/ProtectedSitesSK/SKNATS64"
            },
            "fGeom": {
                "type": "uri",
                "value": "http://geop.sazp.sk/id/ProtectedSite/ProtectedSitesSK/geometry/SKNATS64"
            },
            "fWKT": {
                "datatype": "http://www.opengis.net/ont/sf#wktLiteral",
                "type": "typed-literal",
                "value": "MULTIPOLYGON(((17.944134922277904 48.67896025392237, 17.944130645546235 48.67896192144562, 17.944574100260567 48.679596852701295, 17.94547577326792 48.67963357262928, 17.945613905637238 48.67953377600467, 17.9458932869548 48.67966636876656, 17.946095903848367 48.67963168605003, 17.94628556957788 48.679394781795665, 17.946605517145414 48.679418792471765, 17.946835239479686 48.67908151539244, 17.94742958905762 48.678869005664296, 17.947203114754284 48.67793817557357, 17.94694037554666 48.67650759747258, 17.946920458439305 48.67650488102879, 17.946475947147416 48.67596341595464, 17.946600499569566 48.67549313622108, 17.946385089103575 48.67491981888597, 17.946091110217807 48.674481658068544, 17.946084781970573 48.67448342488742, 17.946085374578793 48.67447764419394, 17.94546246412343 48.67317435544234, 17.94402287862546 48.67324457049819, 17.944022076730437 48.67324318176868, 17.944032034553484 48.67324029140602, 17.944171477211725 48.67295375639543, 17.944524322887343 48.67268541314023, 17.943851672220926 48.67252613779285, 17.943894270723547 48.672393435113804, 17.943486825559344 48.672266267177186, 17.94347952195808 48.67227385636957, 17.943477992563164 48.67227114807598, 17.94292123954756 48.67240015727221, 17.941941997626998 48.67293130379951, 17.94295823212954 48.67344658672369, 17.94287095083366 48.673787310583364, 17.942854663729513 48.673786650604754, 17.942714493616275 48.67439505441465, 17.943945805086297 48.675669822908894, 17.94408737562745 48.67598695287334, 17.944074255003525 48.675985899962406, 17.94418200861709 48.67621417182415, 17.94407537391151 48.677235780718014, 17.944857756656415 48.67647100379971, 17.944931642337245 48.67670807706756, 17.944826393947373 48.67682080561621, 17.944558093315997 48.67747024077336, 17.944704115555037 48.677657516917975, 17.944638721485678 48.67783756800483, 17.944942441034485 48.678066730230526, 17.9447533046747 48.67825560924996, 17.944492928355896 48.678726975172914, 17.94427056822285 48.67885975535605, 17.944100441910876 48.67890910130951, 17.944134366656606 48.678959823086586, 17.944134922277904 48.67896025392237)))"
            },
            "spc": {
                "type": "literal",
                "value": "natureConservation ecological environment"
            },
            "lfd": {
                "type": "literal",
                "value": ""
            },
            "lfdoc": {
                "type": "literal",
                "value": ""
            },
            "inspire": {
                "type": "uri",
                "value": "http://geop.sazp.sk/id/ProtectedSite/ProtectedSitesSK/inspireId/SKNATS64"
            },
            "sitename": {
                "type": "uri",
                "value": "http://geop.sazp.sk/id/ProtectedSite/ProtectedSitesSK/siteName/SKNATS64"
            },
            "gname": {
                "type": "uri",
                "value": "http://geop.sazp.sk/id/ProtectedSite/ProtectedSitesSK/GeographicalName/SKNATS64"
            },
            "spelling": {
                "type": "uri",
                "value": "http://geop.sazp.sk/id/ProtectedSite/ProtectedSitesSK/spelling/SKNATS64"
            },
            "spellingofname": {
                "type": "uri",
                "value": "http://geop.sazp.sk/id/ProtectedSite/ProtectedSitesSK/SpellingOfName/SKNATS64"
            },
            "name": {
                "type": "literal",
                "xml:lang": "SL",
                "value": "Javorníček"
            },
            "namespace": {
                "type": "literal",
                "value": "SK:GOV:MOE:SEA:PS"
            },
            "localId": {
                "type": "literal",
                "value": "SK:GOV:MOE:SEA:PS"
            },
            "siteDesignation": {
                "type": "uri",
                "value": "http://geop.sazp.sk/id/ProtectedSite/ProtectedSitesSK/siteDesignation/SKNATS64"
            },
            "percentageUnderDesignation": {
                "type": "literal",
                "value": ""
            },
            "designation": {
                "type": "literal",
                "value": "strictNatureReserve"
            },
            "designationScheme": {
                "type": "literal",
                "value": "IUCN"
            }
        }, {
            "res": {
                "type": "uri",
                "value": "http://geop.sazp.sk/id/ProtectedSite/ProtectedSitesSK/SKNATS140"
            },
            "fGeom": {
                "type": "uri",
                "value": "http://geop.sazp.sk/id/ProtectedSite/ProtectedSitesSK/geometry/SKNATS140"
            },
            "fWKT": {
                "datatype": "http://www.opengis.net/ont/sf#wktLiteral",
                "type": "typed-literal",
                "value": "MULTIPOLYGON(((18.041424367249462 48.774817503822966, 18.041437950033224 48.77476069435934, 18.041618548442784 48.77454147778047, 18.041713009894007 48.77413633248902, 18.041617247661833 48.773810433941804, 18.04169966575787 48.77325863068138, 18.041762280351556 48.772839315058604, 18.041640755498015 48.77249305813999, 18.04156640016101 48.771923496414715, 18.041480060994335 48.7715853098459, 18.041357436552207 48.77110487233986, 18.041318427972545 48.77099820437696, 18.04053074563643 48.77114261212204, 18.04002308989105 48.771204421721656, 18.039557972463424 48.7712595522206, 18.03919772589569 48.77125668092616, 18.039268149544053 48.770939941971854, 18.039286257465882 48.77070264903407, 18.03916896214868 48.77057557112223, 18.038934913887374 48.770570918836626, 18.038530898849725 48.770547134717354, 18.03787986852378 48.77056354876125, 18.037601232546788 48.77054714320585, 18.037441591796412 48.77053774355359, 18.03682772712628 48.77048335561442, 18.036110653723863 48.77047762909291, 18.035704940772188 48.77051760327265, 18.035107474352575 48.770546290959395, 18.034426607439297 48.770579188111995, 18.033843292493966 48.77055394135147, 18.03281945989582 48.770542640565424, 18.032750483726037 48.77062202711558, 18.032450979513936 48.77079053950516, 18.032025021120525 48.77099654250981, 18.031649127177023 48.771263261022554, 18.031620596909395 48.77140281558056, 18.031640431382176 48.771615819742074, 18.031784467116413 48.77177195076226, 18.03203965105406 48.7718961232456, 18.032424387921345 48.771995828095406, 18.032924753477346 48.77210233504962, 18.033148796472833 48.77220541146667, 18.03332862897762 48.77231229918868, 18.03334854392465 48.77238379439515, 18.0333613384603 48.77242977758181, 18.033278436198614 48.772540435515594, 18.033054617564517 48.772687733971125, 18.032696766521955 48.772820718560695, 18.032288999695204 48.77296359385212, 18.032045068211133 48.773116131196026, 18.03195251572826 48.77322622900665, 18.031940488932925 48.773315396793926, 18.032027589706555 48.773461746509504, 18.032302423972148 48.77372830220267, 18.032437892348355 48.773948119240195, 18.032393705136204 48.77413168497497, 18.032339463177763 48.77416961338758, 18.032864049312753 48.77429977281643, 18.033577686730677 48.77449115017819, 18.034079884595656 48.77457503279378, 18.034745121222794 48.77466853463365, 18.035236440716673 48.77483323389984, 18.03583733255784 48.77509942791007, 18.03684398103643 48.77540307341194, 18.03783208290438 48.775692045074194, 18.03863275371385 48.77584778594083, 18.03917936223059 48.775907123564515, 18.03977217955984 48.77592843312143, 18.0401910782112 48.77602096672703, 18.040697803059718 48.776158949593736, 18.04089983914347 48.775814193179365, 18.04108680125561 48.77556896492225, 18.04138562069806 48.774979923209216, 18.041410635310843 48.77487510886814, 18.041424367249462 48.774817503822966)))"
            },
            "spc": {
                "type": "literal",
                "value": "natureConservation ecological environment"
            },
            "lfd": {
                "type": "literal",
                "value": ""
            },
            "lfdoc": {
                "type": "literal",
                "value": ""
            },
            "inspire": {
                "type": "uri",
                "value": "http://geop.sazp.sk/id/ProtectedSite/ProtectedSitesSK/inspireId/SKNATS140"
            },
            "sitename": {
                "type": "uri",
                "value": "http://geop.sazp.sk/id/ProtectedSite/ProtectedSitesSK/siteName/SKNATS140"
            },
            "gname": {
                "type": "uri",
                "value": "http://geop.sazp.sk/id/ProtectedSite/ProtectedSitesSK/GeographicalName/SKNATS140"
            },
            "spelling": {
                "type": "uri",
                "value": "http://geop.sazp.sk/id/ProtectedSite/ProtectedSitesSK/spelling/SKNATS140"
            },
            "spellingofname": {
                "type": "uri",
                "value": "http://geop.sazp.sk/id/ProtectedSite/ProtectedSitesSK/SpellingOfName/SKNATS140"
            },
            "name": {
                "type": "literal",
                "xml:lang": "SL",
                "value": "Povasky Inovec"
            },
            "namespace": {
                "type": "literal",
                "value": "SK:GOV:MOE:SEA:PS"
            },
            "localId": {
                "type": "literal",
                "value": "SK:GOV:MOE:SEA:PS"
            },
            "siteDesignation": {
                "type": "uri",
                "value": "http://geop.sazp.sk/id/ProtectedSite/ProtectedSitesSK/siteDesignation/SKNATS140"
            },
            "percentageUnderDesignation": {
                "type": "literal",
                "value": ""
            },
            "designation": {
                "type": "literal",
                "value": "strictNatureReserve"
            },
            "designationScheme": {
                "type": "literal",
                "value": "IUCN"
            }
        }, {
            "res": {
                "type": "uri",
                "value": "http://geop.sazp.sk/id/ProtectedSite/ProtectedSitesSK/SKNATS1078"
            },
            "fGeom": {
                "type": "uri",
                "value": "http://geop.sazp.sk/id/ProtectedSite/ProtectedSitesSK/geometry/SKNATS1078"
            },
            "fWKT": {
                "datatype": "http://www.opengis.net/ont/sf#wktLiteral",
                "type": "typed-literal",
                "value": "MULTIPOLYGON(((18.137961546608615 47.81823635659082, 18.137959095112624 47.818969465033, 18.137994001104055 47.81895121665966, 18.139506177219456 47.81816040481726, 18.13957349996843 47.81812519312946, 18.139029452693386 47.818059914008344, 18.138567987253555 47.818136152085515, 18.138063569077087 47.81821948408102, 18.137961546608615 47.81823635659082)))"
            },
            "spc": {
                "type": "literal",
                "value": "natureConservation ecological environment"
            },
            "lfd": {
                "type": "literal",
                "value": ""
            },
            "lfdoc": {
                "type": "literal",
                "value": ""
            },
            "inspire": {
                "type": "uri",
                "value": "http://geop.sazp.sk/id/ProtectedSite/ProtectedSitesSK/inspireId/SKNATS1078"
            },
            "sitename": {
                "type": "uri",
                "value": "http://geop.sazp.sk/id/ProtectedSite/ProtectedSitesSK/siteName/SKNATS1078"
            },
            "gname": {
                "type": "uri",
                "value": "http://geop.sazp.sk/id/ProtectedSite/ProtectedSitesSK/GeographicalName/SKNATS1078"
            },
            "spelling": {
                "type": "uri",
                "value": "http://geop.sazp.sk/id/ProtectedSite/ProtectedSitesSK/spelling/SKNATS1078"
            },
            "spellingofname": {
                "type": "uri",
                "value": "http://geop.sazp.sk/id/ProtectedSite/ProtectedSitesSK/SpellingOfName/SKNATS1078"
            },
            "name": {
                "type": "literal",
                "xml:lang": "SL",
                "value": "Komočín"
            },
            "namespace": {
                "type": "literal",
                "value": "SK:GOV:MOE:SEA:PS"
            },
            "localId": {
                "type": "literal",
                "value": "SK:GOV:MOE:SEA:PS"
            },
            "siteDesignation": {
                "type": "uri",
                "value": "http://geop.sazp.sk/id/ProtectedSite/ProtectedSitesSK/siteDesignation/SKNATS1078"
            },
            "percentageUnderDesignation": {
                "type": "literal",
                "value": ""
            },
            "designation": {
                "type": "literal",
                "value": "strictNatureReserve"
            },
            "designationScheme": {
                "type": "literal",
                "value": "IUCN"
            }
        }];

    var ndx = crossfilter(data);


    nameDim = ndx.dimension(function(d) {return d.name.value;});
    designationDim = ndx.dimension(function(d) {return d.designation.value;});

    var n = nameDim.group().reduceCount();


    var designationChart   = dc.pieChart("#chart-ring-year");
    designationChart
        .width(200).height(200)
        .dimension(nameDim)
        .group(n)
        .innerRadius(30);



    dc.renderAll();


    //var total_3= nameDim.filter(function(d) { if (d == "Park pri Ihrisku") {return d;} } );
    //var total_3= designationDim.filter(function(d) { if (d == "strictNatureReserve") {return d;} } );
    //print_filter("total_3");



//
//    var data = [
//        {date: "12/27/2012", http_404: 2, http_200: 190, http_302: 100},
//        {date: "12/28/2012", http_404: 2, http_200: 10, http_302: 100},
//        {date: "12/29/2012", http_404: 1, http_200: 300, http_302: 200},
//        {date: "12/30/2012", http_404: 2, http_200: 90, http_302: 0},
//        {date: "12/31/2012", http_404: 2, http_200: 90, http_302: 0},
//        {date: "01/01/2013", http_404: 2, http_200: 90, http_302: 0},
//        {date: "01/02/2013", http_404: 1, http_200: 10, http_302: 1},
//        {date: "01/03/2013", http_404: 2, http_200: 90, http_302: 0},
//        {date: "01/04/2013", http_404: 2, http_200: 90, http_302: 0},
//        {date: "01/05/2013", http_404: 2, http_200: 90, http_302: 0},
//        {date: "01/06/2013", http_404: 2, http_200: 200, http_302: 1},
//        {date: "01/07/2013", http_404: 1, http_200: 200, http_302: 100}
//    ];
//
//    var ndx = crossfilter(data);
//
//    var parseDate = d3.time.format("%m/%d/%Y").parse;
//
//    data.forEach(function(d) {
//        d.date = parseDate(d.date);
//        d.total= d.http_404+d.http_200+d.http_302;
//        d.Year=d.date.getFullYear();
//    });
//    print_filter("data");
//
//    var dateDim = ndx.dimension(function(d) {return d.date;});
//    var hits = dateDim.group().reduceSum(function(d) {return d.total;});
//    var status_200=dateDim.group().reduceSum(function(d) {return d.http_200;});
//    var status_302=dateDim.group().reduceSum(function(d) {return d.http_302;});
//    var status_404=dateDim.group().reduceSum(function(d) {return d.http_404;});
//
//    var minDate = dateDim.bottom(1)[0].date;
//    var maxDate = dateDim.top(1)[0].date;
//
//    var hitslineChart  = dc.lineChart("#chart-line-hitsperday");
//    hitslineChart
//        .width(500).height(200)
//        .dimension(dateDim)
//        .group(status_200,"200")
//        .stack(status_302,"302")
//        .stack(status_404,"404")
//        .renderArea(true)
//        .x(d3.time.scale().domain([minDate,maxDate]))
//        .brushOn(true)
//        .legend(dc.legend().x(50).y(10).itemHeight(13).gap(5))
//        .yAxisLabel("Hits per day");
//
//
//    var yearDim  = ndx.dimension(function(d) {return +d.Year;});
//    var year_total = yearDim.group().reduceSum(function(d) {return d.total;});
//
//    var yearRingChart   = dc.pieChart("#chart-ring-year");
//    yearRingChart
//        .width(150).height(150)
//        .dimension(yearDim)
//        .group(year_total)
//        .innerRadius(30);
//
//
//    document.getElementById("makeDataTable").onclick = function ()
//    {
//        alldata = dateDim.top(Infinity);
//        RefreshTable(alldata);
//    };
//
//    datatable = $(".dc-data-table").dataTable({
//
//        "bDeferRender": true,
//        // Restricted data in table to 10 rows, make page load faster
//// Make sure your field names correspond to the column headers in your data file. Also make sure to have default empty values.
//        "aaData": dateDim.top(10),
//
//        "bDestroy": true,
//        "aoColumns": [
//            { "mData": "date", "sDefaultContent": " " },
//            { "mData": "http_200", "sDefaultContent": " " },
//            { "mData": "http_302", "sDefaultContent": " " },
//            { "mData": "total", "sDefaultContent": " " }
//
//
//        ]
//    });
//
//    function RefreshTable(alldata) {
//        datatable.fnClearTable();
//        datatable.fnAddData(alldata);
//        datatable.fnDraw();
//    };




    //dc.renderAll();












});







var initializeWidgets = function () {

    resultsWidget.widgetDiv = "resultsWidget";
    resultsWidget.data = filteredData;
    resultsWidget.init();

    //-------------------------------------

    donutChartWidget.widgetDiv = "donnutChartWidget";
    donutChartWidget.param = "designation";
    donutChartWidget.data = filteredData;
    donutChartWidget.init();

    //-------------------------------------

    facetedSearchWidget.data = transformData(rawData);

    facetedSearchWidget.item_template = '<div class="item box box-solid bg-light-blue">' +
    '<h4><%= obj.name %></h4>' +
    '<h4><%= obj.designationScheme %></h4>' +
    '</div>';

    facetedSearchWidget.settings = {
        items: [],
        facets: {
            'designation': 'Designation',
            'designationScheme': 'Designation Scheme'
        },
        resultSelector: '#results',
        facetSelector: '#facets',
        state: {
            orderBy: false,
            filters: {}
        },
        resultTemplate: facetedSearchWidget.item_template,
        orderByOptions: {'designation': 'Designation', 'designationScheme': 'Designation Scheme'}
    };

    facetedSearchWidget.init();

    //-------------------------------------

    openLayersMapWidget.widgetDiv = 'mapDiv';
    openLayersMapWidget.data = rawData; //TO-DO: when filtering is repaired, set this to filteredData
    openLayersMapWidget.init();

};

var updateWidgets = function () {

    console.log("update widgets");
    donutChartWidget.update();
    resultsWidget.update();

    openLayersMapWidget.data = rawData;
    openLayersMapWidget.update();

};


var newDataReceived = function () {
    facetedSearchWidget.data = transformData(rawData);
    facetedSearchWidget.update();
};


//Smart Open Data Query
var getPolygonsFromEuro = function () {

    var polygonsfeuro_query = 'PREFIX drf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> PREFIX j.0: <http://inspire.jrc.ec.europa.eu/schemas/gn/3.0/> PREFIX j.1: <http://inspire.jrc.ec.europa.eu/schemas/ps/3.0/> PREFIX j.2: <http://inspire.jrc.ec.europa.eu/schemas/base/3.2/> PREFIX j.3: <http://www.opengis.net/ont/geosparql#> SELECT * WHERE { SERVICE <http://localhost:3030/slovakia/query> { ?res j.3:hasGeometry ?fGeom . ?fGeom j.3:asWKT ?fWKT . ?res j.1:siteProtectionClassification ?spc . ?res j.1:LegalFoundationDate ?lfd . ?res j.1:LegalFoundationDocument ?lfdoc . ?res j.1:inspireId ?inspire . ?res j.1:siteName ?sitename . ?sitename j.0:GeographicalName ?gname . ?gname j.0:spelling ?spelling . ?spelling j.0:SpellingOfName ?spellingofname . ?spellingofname j.0:text ?name . ?inspire j.2:namespace ?namespace . ?inspire j.2:namespace ?localId . ?res j.1:siteDesignation ?siteDesignation . ?siteDesignation j.1:percentageUnderDesignation ?percentageUnderDesignation . ?siteDesignation j.1:designation ?designation . ?siteDesignation j.1:designationScheme ?designationScheme . } } LIMIT 4';
    var temporal = 'http://demos.gsi.dit.upm.es/fuseki/slovakia/query?query=' + encodeURIComponent(polygonsfeuro_query);
    var req = new XMLHttpRequest();
    req.open("GET", temporal, true);
    var params = encodeURIComponent(polygonsfeuro_query);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.setRequestHeader("Accept", "application/sparql-results+json");
    //req.setRequestHeader("Content-length", params.length);
    //req.setRequestHeader("Connection", "close");
    req.send();
    console.log("polygons query sent");
    req.onreadystatechange = function () {
        if (req.readyState == 4) {
            if (req.status == 200) {
                console.log("polygons query response received");
                var res = eval("(" + req.responseText + ")");
                var data = JSON.stringify(res.results.bindings);
                rawData = JSON.parse(data);

                newDataReceived();

            } else {
            }
        }
    };
    return false;
};



//SPARQL query function
var executeSPARQLquery = function (_query, endpoint) {

    $.ajax({
        type: 'GET',
        url: endpoint,
        data: {
            query: _query,
            output: 'json',
            format: 'json',
            debug: 'on',
            timeout: '0'
        },
        crossDomain: true,
        dataType: 'jsonp',
        beforeSend: function () {
            //$('#loading').show();
            console.log('SPARQL query sent');
        },
        complete: function () {
            //console.log('SPARQL query completed');
            //$('#loading').hide();
        },
        success: function (allData) {
            console.log('SPARQL Query success');

            rawData = JSON.parse(JSON.stringify(allData.results.bindings));

            //ko.mapping.fromJSON(data, self.rawData[streamNumber]);

            //process all data giving each item an unique id
            //self.giveUniqueIdentifier(self.rawData[streamNumber]());

            newDataReceived();
        },
        error: function () {
            console.log('SPARQL Query failed');
        }
    });
};

var transformData = function (data) {
    var auxArray = [];
    for (i = 0; i < data.length; i++) {
        auxArray[i] = [];
        var j = 0;

        for (prop in data[i]) {
            if (!data[i].hasOwnProperty(prop)) {
                //The current property is not a direct property of p
                continue;
            }
            //Do your logic with the property here
            auxArray[i][prop] = data[i][prop].value;

            j++;
        }

    }
    return auxArray;
};