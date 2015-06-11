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
  List results = [];
  List aux = [];

  Dashboard(){
    host = getHost();
    _loadResults();
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
        if(results[i]["Type"] == "Slovakia")
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
      var url = "http://$host/web/results";
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