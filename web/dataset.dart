import 'package:angular/angular.dart';
import 'package:angular/application_factory.dart';
import 'dart:html';
import 'dart:convert';
import 'signGoogle.dart';

@Injectable()
class Dataset extends SignGoogle{
  var host = "";
  String name = '';
  String type;
  String endPoint = '';
  String user = '';
  String password = '';
  String collection = '';
  String email = '';
  List datasets = [];
  var typeSelect = querySelector('#typeSelector');

  Dataset(){
    host = getHost();
    _loadDataset();
  }

  void _loadDataset(){
    var url = "http://$host/web/dataset";

    // call the web server asynchronously
    var request = HttpRequest.getString(url).then((responseText){
      datasets = JSON.decode(responseText);
    });
  }

  void checkType(){
    if(typeSelect.value == "MongoDb") {
      querySelector('#collectionSec').style.display = "flex";
      querySelector('#loginUser').style.display = "flex";
    } else {
      querySelector('#collectionSec').style.display = "none";
      querySelector('#loginUser').style.display = "none";
    }
  }

  void clearFilters() {
    name = "";
    endPoint = "";
    collection = "";
    querySelector('#saveError').classes.add("hide");
    querySelector('#saveSuccess').classes.add("hide");
  }

  void saveData(){

    if(isLogged()) {
      querySelector('#saveError').classes.add("hide");
      querySelector('#saveSuccess').classes.add("hide");
      if (!checkParamPattern()) {
        querySelector('#saveError').classes.remove("hide");
        return;
      }

      var queryVar = {
          "Name" : name,
          "Type" : type,
          "Endpoint" : endPoint,
          "Collection" : collection,
          "User" : user,
          "Password" : password
      };
      datasets.add(queryVar);
      querySelector('#saveSuccess').classes.remove("hide");
      String jsonData = JSON.encode(datasets);

      var request = new HttpRequest();
      request.onReadyStateChange.listen((_) {
        if (request.readyState == HttpRequest.DONE &&
        (request.status == 200 || request.status == 0)) {
          // data saved OK.
          print(" Data saved successfully");

        }
      });
      var url = "http://$host/web/dataset";
      request.open("POST", url);
      request.send(jsonData);
    } else {
      window.alert("Please sign in first. Also it's available a demo to try it on the website of GSI Group.");
    }
  }

  bool checkParamPattern() {

    bool allRight = true;
    if(typeSelect.value == "")
      allRight = false;
    return allRight;
  }

  //Necessary to avoid a failure to Dart execution
  void toggleDialog1(e){
    return;
  }

}
void main() {
  applicationFactory()
  .rootContextType(Dataset)
  .run();
}