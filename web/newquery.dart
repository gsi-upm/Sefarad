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
  String value = '';
  List parameters = [];
  List parametersShow = [];
  RegExp regex = new RegExp("<[a-zA-Z0-9._%+-]+\>");
  List parameters0 = [];
  List parameters1 = [];
  List parameters2 = [];
  List parameters3 = [];
  List parameters4 = [];
  var input = querySelector('#queryNameSelector');
  var myEl = querySelector('#queryParams');
  var myEl2 = querySelector('#querySelector');
  var myEl3 = querySelector('#paramSelector');

  void saveParams(event){
    if(event.keyCode == 13) {
      saveParamsButton();
    }
  }

  void saveParamsButton(){
      var indexParam = parameters.indexOf(myEl3.value);
      switch (indexParam) {
        case 0:
          parameters0.add(params);
          parametersShow = parameters0;
          break;
        case 1:
          parameters1.add(params);
          parametersShow = parameters1;
          break;
        case 2:
          parameters2.add(params);
          parametersShow = parameters2;
          break;
        case 3:
          parameters3.add(params);
          parametersShow = parameters3;
          break;
        case 4:
          parameters4.add(params);
          parametersShow = parameters4;
          break;
      }
      myEl.value = "";
  }

  void update (){
    var indexParam = parameters.indexOf(myEl3.value);
    switch (indexParam) {
      case 0:
        parametersShow = parameters0;
        break;
      case 1:
        parametersShow = parameters1;
        break;
      case 2:
        parametersShow = parameters2;
        break;
      case 3:
        parametersShow = parameters3;
        break;
      case 4:
        parametersShow = parameters4;
        break;
      default:
        break;
    }
  }

  void removeParam(String param){
    var indexParam = parameters.indexOf(myEl3.value);
    switch (indexParam) {
      case 0:
        parameters0.remove(params);
        break;
      case 1:
        parameters1.remove(params);
        break;
      case 2:
        parameters2.remove(params);
        break;
      case 3:
        parameters3.remove(params);
        break;
      case 4:
        parameters4.remove(params);
        break;
      default:
        break;
    }
  }

  void clearFilters() {
    input.value = "";
    myEl2.value = "";
    parameters.clear();
    parameters0.clear();
    parameters1.clear();
    parameters2.clear();
    parameters3.clear();
    parameters4.clear();
  }

  void listParams(){
    parameters.clear();
    var matches = regex.allMatches(name);
    int i = 0;
    for(i =0; i<matches.length;i++){
      parameters.add(matches.elementAt(i).group(0).substring(1,matches.elementAt(i).group(0).length-1));
    }
  }

  void saveData(){

    querySelector('#saveError').classes.add("hide");
    querySelector('#saveSuccess').classes.add("hide");
//    if(!checkParamPattern()){
//      querySelector('#saveError').classes.remove("hide");
//      return;
//    }

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
        "Parameters0": parameters0,
        "Parameters1": parameters1,
        "Parameters2": parameters2,
        "Parameters3": parameters3,
        "Parameters4": parameters4,
    };
    var path = 'querys.json';
    //HttpRequest.request(path, method:'POST',requestHeaders: {"content-type": "application/json"},
        //sendData: JSON.encode(querys));
    querys.add(queryVar);
    querySelector('#saveSuccess').classes.remove("hide");
    window.localStorage[STORAGE_KEY] = JSON.encode(querys);
  }

  bool checkParamPattern(){

    if(name.contains('<') || name.contains('>')) {
      int start = name.indexOf('<');
      int end = name.indexOf('>');
      String compare = name.substring(start, end + 1);
      if (!myEl2.value.contains(compare))
        return false;
      else
        return true;
    }
    if(myEl2.value.contains('<') || myEl2.value.contains('>')) {
      int start = myEl2.value.indexOf('<');
      int end = myEl2.value.indexOf('>');
      String compare = myEl2.value.substring(start, end + 1);
      if (name.contains(compare))
        return false;
      else
        return true;
    }


    return true;
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