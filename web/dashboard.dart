import 'package:angular/angular.dart';
import 'package:angular/application_factory.dart';
import 'dart:html';
import 'dart:js';
import 'dart:convert';
import 'authParam.dart';

@Injectable()
class Dashboard extends AuthParam{

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

  Dashboard(){
    host = getHost();
    _loadQuery();
    _loadDataset();
    _loadResults();
  }

  _loadQuery() {
    var url = "http://$host/web/queries.json";

    // call the web server asynchronously
    var request = HttpRequest.getString(url).then((responseText){
      aux = JSON.decode(responseText);
      for(int i = 0; i < aux.length; i++){
        if(aux[i]["Endpoint"] == "http://demos.gsi.dit.upm.es/fuseki/geo/query?query=")
          querys.add(aux[i]);
      }
    });
    //var yasgui = new JsObject(context['yasgui']);
  }
  void _loadDataset(){
    var url = "http://$host/web/dataset.json";

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
    var url = "http://$host/web/results.json";

    // call the web server asynchronously
    var request = HttpRequest.getString(url).then((responseText){
      results = JSON.decode(responseText);
    });
  }

  void showInDashboard(){
    if(googleSign.callMethod('isLoggead')) {
      var data = yasqe.callMethod('getQuery');
      var resultVar = {
          "Type" : "Slovakia",
          "Query": data
      };
      for(int i = 0; i < results.length; i++){
        if(results[i]["Type"] == "Slovakia")
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
      var url = "http://$host/web/results.json";
      request.open("POST", url);
      request.send(jsonData);
    }
  }

}

void main() {
  applicationFactory()
  .rootContextType(Dashboard)
  .run();
}