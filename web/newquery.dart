import 'package:angular/angular.dart';
import 'package:angular/application_factory.dart';
import 'dart:html';
import 'dart:convert';

@Injectable()
class Query {
  final String STORAGE_KEY = 'querysSaved';
  static Storage localStorage = window.localStorage;
  String name = '';
  String query = '';
  String params = '';
  List<String> parameters = [];
  var input = querySelector('#queryNameSelector');
  var myEl = querySelector('#queryParams');
  var myEl2 = querySelector('#querySelector');

  void saveParams(event){
    if(event.keyCode == 13) {
      saveParamsButton();
    }
  }

  void saveParamsButton(){
      parameters.add(params);
      myEl.value = "";
  }

  void removeParam(String param){
    parameters.remove(param);
  }

  void clearFilters() {
    input.value = "";
    myEl2.value = "";
    parameters.clear();
  }

  void saveData(){
    List querys = [];
    if ( window.localStorage.containsKey(STORAGE_KEY)){
      querys = JSON.decode(window.localStorage[STORAGE_KEY]);

      if(querys == null) {
        querys = [];
      }
    }

    var queryVar = {
        "Name" : name,
        "Query" : myEl2.value,
        "Parameters": parameters
    };
    var path = 'querys.json';
    //HttpRequest.request(path, method:'POST',requestHeaders: {"content-type": "application/json"},
        //sendData: JSON.encode(querys));
    querys.add(queryVar);
    window.localStorage[STORAGE_KEY] = JSON.encode(querys);
  }

  //Necessary to avoid a failure to Dart execution
  void toggleDialog1(e){
    return;
  }

}
void main() {
  applicationFactory()
  .rootContextType(Query)
  .run();
}