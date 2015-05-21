import 'package:angular/angular.dart';
import 'package:angular/application_factory.dart';
import 'dart:html';
import 'dart:js';
import 'dart:convert';
import 'authParam.dart';

@Injectable()
class DashboardPlaces extends AuthParam{

  var googleSign = new JsObject(context['loggead']);
  var host = "";
  List names;
  String query = '';
  String queryMongo = '';
  String type = '';
  String endPoint = '';
  String collection = '';
  String result = '';
  List querys = [];
  List params;
  List aux = [];
  List datasets = [];

  DashboardPlaces(){
    host = getHost();
    _loadQuery();
    _loadDataset();

  }

  _loadQuery() {
    var url = "http://$host/web/queries";

    // call the web server asynchronously
    var request = HttpRequest.getString(url).then((responseText){
      aux = JSON.decode(responseText);
      for(int i = 0; i < aux.length; i++){
        if(aux[i]["Endpoint"] == "http://tour-pedia.org/sparql?query=")
          querys.add(aux[i]);
      }
    });
    //var yasgui = new JsObject(context['yasgui']);
  }
  void _loadDataset(){
    var url = "http://$host/web/dataset";

    // call the web server asynchronously
    var request = HttpRequest.getString(url).then((responseText){
      datasets = JSON.decode(responseText);
      type = datasets[0]["Type"];
      endPoint = datasets[0]["Endpoint"];
      if ( window.localStorage.containsKey("datasetSaved")) {
        datasets.addAll(JSON.decode(window.localStorage["datasetSaved"]));
      }
    });
  }

  void saveResults(){
    if(googleSign.callMethod('isLoggead')) {
    }
  }

}

void main() {
  applicationFactory()
  .rootContextType(DashboardPlaces)
  .run();
}