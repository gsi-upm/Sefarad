import 'package:angular/angular.dart';
import 'package:angular/application_factory.dart';
import 'dart:html';
import 'dart:js';
import 'dart:convert';
import 'authParam.dart';

@Injectable()
class DashboardRestaurants extends AuthParam{

  var googleSign = new JsObject(context['loggead']);
  var yasqe = new JsObject(context['jsYasqe']);
  var host = "";
  List names;
  String query = '';
  String queryMongo = '';
  String type = '';
  String endPoint = '';
  String collection = '';
  String result = '';
  List querys = [];
  List results = [];
  List aux = [];
  List datasets = [];

  DashboardRestaurants(){
    host = getHost();
    _loadQuery();
    _loadDataset();
    _loadResults();
  }

  _loadQuery() {
    var url = "http://$host/web/queries";

    // call the web server asynchronously
    var request = HttpRequest.getString(url).then((responseText){
      aux = JSON.decode(responseText);
      for(int i = 0; i < aux.length; i++){
        if(aux[i]["Endpoint"] == "http://demos.gsi.dit.upm.es/fuseki/restaurants/query?query=")
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

  void _loadResults(){
    var url = "http://$host/web/results";

    // call the web server asynchronously
    var request = HttpRequest.getString(url).then((responseText){
      results = JSON.decode(responseText);
    });
  }

  void showDefault(){
    if(googleSign.callMethod('isLoggead')) {
      for(int i = 0; i < results.length; i++){
        if(results[i]["Type"] == "Restaurants")
          results.removeAt(i);
      }
      String jsonData = JSON.encode(results);

      var request = new HttpRequest();
      request.onReadyStateChange.listen((_) {
        if (request.readyState == HttpRequest.DONE && (request.status == 200 || request.status == 0)) {
          // data saved OK.
          print(" Data saved successfully");
          window.location.reload();
        }
      });
      var url = "http://$host/web/results";
      request.open("POST", url);
      request.send(jsonData);
    }
  }

  void showInDashboard(){
    if(googleSign.callMethod('isLoggead')) {
      var data = yasqe.callMethod('getQuery');
      var resultVar = {
          "Type" : "Restaurants",
          "Query": data
      };
      for(int i = 0; i < results.length; i++){
        if(results[i]["Type"] == "Restaurants")
          results.removeAt(i);
      }
      results.add(resultVar);
      String jsonData = JSON.encode(results);

      var request = new HttpRequest();
      request.onReadyStateChange.listen((_) {
        if (request.readyState == HttpRequest.DONE && (request.status == 200 || request.status == 0)) {
          // data saved OK.
          print(" Data saved successfully");
          window.location.reload();
        }
      });
      var url = "http://$host/web/results";
      request.open("POST", url);
      request.send(jsonData);
    }
  }
}

void main() {
  applicationFactory()
  .rootContextType(DashboardRestaurants)
  .run();
}