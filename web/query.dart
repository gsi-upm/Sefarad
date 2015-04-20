import 'package:angular/angular.dart';
import 'package:angular/application_factory.dart';
import 'dart:html';
import 'dart:core';
import 'dart:convert';
import 'signGoogle.dart';

@Injectable()
class Query extends SignGoogle{
  var host = "127.0.0.1:1990";
  List names;
  String query = '';
  String queryMongo = '';
  String type = '';
  String endPoint = '';
  String collection = '';
  String result = '';
  List querys = [];
  List params;
  List datasets = [];

  Query(){
    _loadQuery();
    _loadDataset();
  }

  _loadQuery() {
    var url = "http://$host/queries";

    // call the web server asynchronously
    var request = HttpRequest.getString(url).then((responseText){
      querys = JSON.decode(responseText);
    });
    //var yasgui = new JsObject(context['yasgui']);
  }

  void _loadDataset(){
    var url = "http://$host/dataset";

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

  String checkType(){
    var myEl4 = document.getElementById('querySelector');
    int i,j;
    int index;
    for(i = 0; i < querys.length; i++){
      if(querys[i]["Name"] == myEl4.value){
        for(j = 0; j < datasets.length; j++){
          if(querys[i]["Endpoint"] == datasets[j]["Endpoint"]){
            index = i;
            type = datasets[j]["Type"];
            endPoint = datasets[j]["Endpoint"];
            collection = datasets[j]["Collection"];
          }
        }
      }
    }
    if(type == "Sparql"){
      querySelector('#divSparql').style.display = "block";
      querySelector('#divMongodb').style.display = "none";
    } else {
      queryMongo = querys[index]["Query"];
      querySelector('#divSparql').style.display = "none";
      querySelector('#divMongodb').style.display = "block";
    }
    return type;
  }

  void saveResults(){
    if(isLogged()) {
      var myEl4 = document.getElementById('querySelector');

      int i = 0;
      for (i = 0; i < querys.length; i++) {
        if (querys[i]["Name"] == myEl4.value) {
          if (type == "Sparql")
            result = querySelector("#hiddenResults").value;
          querys[i]["Results"] = result;
        }
      }
      print(result);
      String jsonData = JSON.encode(querys);

      var request = new HttpRequest();
      request.onReadyStateChange.listen((_) {
        if (request.readyState == HttpRequest.DONE && (request.status == 200 || request.status == 0)) {
          // data saved OK.
          print(" Query executed successfully");
          window.location.reload();
        }
      });
      var url = "http://$host/queries";
      request.open("POST", url);
      request.send(jsonData);
    }
  }

  void executeMongoQuery(){

    querySelector("#divMongodb").children.remove(querySelector("#table"));
    var request = new HttpRequest();
    request.onReadyStateChange.listen((_) {
      if (request.readyState == HttpRequest.DONE && (request.status == 200 || request.status == 0)) {
        // data saved OK.
        result = request.responseText;
        List post = JSON.decode(request.responseText);
        buildUi(post);
        querySelector("#buttonSave").style.display = "block";
        querySelector('#querySuccess2').classes.remove("hide");
        print(" Query executed successfully");
      }
    });
    var url = "http://$host/mongodbquery";
    request.open("GET", url + "?" + collection + "&" + Uri.encodeComponent(querySelector("#queryMongo").value));
    request.send("");
  }

  void buildUi(List list) {

    List matchList = [];
    String s = list[0].toString().replaceAll(" ","");
    RegExp regex = new RegExp("[a-zA-Z0-9._%+-]+:");
    var matches = regex.allMatches(s);
    int i = 0;
    for(i =0; i<matches.length;i++){
      matchList.add(matches.elementAt(i).group(0).substring(0,matches.elementAt(i).group(0).length-1));
    }

    DivElement div = querySelector("#divMongodb");
    DivElement a = new Element.tag("div");
    a.id = "table";
    div.nodes.add(a);

    TableElement table = new TableElement();
    table.classes.add("google-visualization-table-table");
    table.style.width = "100%";
    table.id = "dataTable";
    Element head = table.createTHead();
    head.classes.add("google-visualization-table-tr-head");

    TableRowElement th = table.tHead.insertRow(-1);
    Element cell;
    TableSectionElement tBody = table.createTBody();
    int j = 0;
    for(i = 0; i < matchList.length; i++){
      cell = new Element.tag('th');
      cell.classes.add("google-visualization-table-th gradient unsorted");
      cell.text = matchList[i];
      th.insertAdjacentElement('beforeend', cell);
    };
    for(i = 0; i < list.length; i++){
      TableRowElement tRow = tBody.insertRow(i);
      tRow.classes.add("google-visualization-table-td");
      for(j = 0; j < matchList.length; j++){
        TableCellElement tCell = tRow.insertCell(j);
        tCell.text = list[i][matchList[j]];
      }
    }

    document.querySelector('#table').nodes.add(table);
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
