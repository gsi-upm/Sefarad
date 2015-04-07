import 'package:angular/angular.dart';
import 'package:angular/application_factory.dart';
import 'dart:html';
import 'dart:convert';

@Injectable()
class Dataset {
  final String STORAGE_KEY = 'datasetSaved';
  static Storage localStorage = window.localStorage;
  String name = '';
  String type;
  String endPoint = '';
  String user = '';
  String password = '';
  String collection = '';
  var typeSelect = querySelector('#typeSelector');

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

    querySelector('#saveError').classes.add("hide");
    querySelector('#saveSuccess').classes.add("hide");
    if(!checkParamPattern()){
      querySelector('#saveError').classes.remove("hide");
      return;
    }

    List querys = [];
    if ( window.localStorage.containsKey(STORAGE_KEY)){
      querys = JSON.decode(window.localStorage[STORAGE_KEY]);

      if(querys == null) {
        querys = [];
      }
    }

    var queryVar = {
        "Name" : name,
        "Type" : type,
        "Endpoint" : endPoint,
        "Collection" : collection,
        "User" : user,
        "Password" : password
    };
    querys.add(queryVar);
    querySelector('#saveSuccess').classes.remove("hide");
    String jsonData = JSON.encode(querys);
    window.localStorage[STORAGE_KEY] = jsonData;
  }

  bool checkParamPattern(){

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