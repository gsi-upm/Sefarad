import 'package:angular/angular.dart';
import 'package:angular/application_factory.dart';
import 'dart:html';
import 'dart:convert';

@Injectable()
class Query {
  String type;
  String name = '';
  String query = '';
  String params = '';
  String value = '';
  String endPoint = '';
  List datasets = [];
  List parameters = [];
  List parametersShow = [];
  RegExp regex = new RegExp("<[a-zA-Z0-9._%+-]+\>");
  List parameters0 = [];
  List parameters1 = [];
  List parameters2 = [];
  List parameters3 = [];
  List parameters4 = [];
  var myEl2 = querySelector('#querySelector');
  var myEl3 = querySelector('#paramSelector');

  void saveParams(event){
    if(event.keyCode == 13) {
      saveParamsButton();
    }
  }

  String checkType(){
    var myEl4 = document.getElementById('typeSelector');
    int i;
    for(i = 0; i < datasets.length; i++){
      if(datasets[i]["Name"] == myEl4.value){
        type = datasets[i]["Type"];
        endPoint = datasets[i]["Endpoint"];
      }
    }
    if(type == "Sparql"){
      querySelector('#divSparql').style.display = "block";
      querySelector('#divMongodb').style.display = "none";
    } else {
      querySelector('#divSparql').style.display = "none";
      querySelector('#divMongodb').style.display = "block";
    }
    return type;
  }

  void _loadDataset(){
    HttpRequest.getString('dataset.json').then((myjson) {
      datasets = JSON.decode(myjson);
      type = datasets[0]["Type"];
      endPoint = datasets[0]["Endpoint"];
      if ( window.localStorage.containsKey("datasetSaved")) {
        datasets.addAll(JSON.decode(window.localStorage["datasetSaved"]));
      }
    });
  }

  Query(){
    _loadDataset();
  }

  void saveParamsButton(){
    var myEl = querySelector('#queryParams');
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
    name = "";
    myEl2.value = "";
    endPoint = "";
    parameters.clear();
    parameters0.clear();
    parameters1.clear();
    parameters2.clear();
    parameters3.clear();
    parameters4.clear();
    querySelector('#saveError').classes.add("hide");
    querySelector('#saveSuccess').classes.add("hide");
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
    if(type == "Sparql") {
      if (!checkParamPattern()) {
        querySelector('#saveError').classes.remove("hide");
        return;
      }

      List querys = [];
      if (window.localStorage.containsKey("querysSaved")) {
        querys = JSON.decode(window.localStorage["querysSaved"]);

        if (querys == null) {
          querys = [];
        }
      }

      var queryVar = {
          "Name" : name,
          "Query" : myEl2.value,
          "Endpoint" : endPoint,
          "Parameters0": parameters0,
          "Parameters1": parameters1,
          "Parameters2": parameters2,
          "Parameters3": parameters3,
          "Parameters4": parameters4,
      };
      querys.add(queryVar);
      querySelector('#saveSuccess').classes.remove("hide");
      String jsonData = JSON.encode(querys);
      window.localStorage["querysSaved"] = jsonData;
    } else {
      querySelector('#saveError').classes.remove("hide");
    }
  }

  bool checkParamPattern(){

    bool allRight = true;
    if(parameters.length != 0) {
      int i = 0;
      for(i = 0; i < parameters.length; i++) {
        String compare = "<" + parameters.elementAt(i) + ">";
        if (!myEl2.value.contains(compare))
          allRight = false;
      }
    }
    if(myEl2.value.contains('<') || myEl2.value.contains('>')) {
      var matches = regex.allMatches(myEl2.value);
      int i = 0;
      for(i =0; i<matches.length;i++){
        String compare = matches.elementAt(i).group(0);
        if (!name.contains(compare))
          allRight = false;
      }
    }
    return allRight;
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