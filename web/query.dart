import 'package:angular/angular.dart';
import 'package:angular/application_factory.dart';
import 'dart:html';
import 'dart:js';
import 'dart:convert';
import 'authParam.dart';

@Injectable()
class QueryList extends AuthParam{

  var googleSign = new JsObject(context['loggead']);
  var host = "";
  List querys = [];
  List params;
  bool altered = false;

  QueryList(){
    host = getHost();
    _loadQuery();
    window.onBeforeUnload.listen((BeforeUnloadEvent e) {
      if(altered)
        e.returnValue = "Modifications haven't been saved";
    });
  }

  _loadQuery() {
    var url = "http://$host/web/queries.json";

    // call the web server asynchronously
    var request = HttpRequest.getString(url).then((responseText){
      querys = JSON.decode(responseText);
    });
    //var yasgui = new JsObject(context['yasgui']);
  }

  void view (int index){

    int elementIndex = 0;
    bool showed = false;
    for(int i = 0; i<querySelector('.box-body').children[index].children.length; i++){
      if(querySelector('.box-body').children[index].children.elementAt(i).toString() == "table") {
        elementIndex = i;
        showed = true;
      }
    }
    if(!showed) {
      String el = '''
    <table class="table table-striped" style="width:80%; margin:auto;">

      <tbody>
        <tr>
          <td style="width: 50%"> Name </td>
          <td style="width: 50%">''' + querys[index]["Name"] + ''' </td>
        </tr>
        <tr>
          <td style="width: 50%"> Type </td>
          <td style="width: 50%">''' + querys[index]["Type"] + ''' </td>
        </tr>
        <tr>
          <td style="width: 50%"> Endpoint </td>
          <td style="width: 50%">''' + querys[index]["Endpoint"] + ''' </td>
        </tr>
        <tr>
          <td style="width: 50%"> Parameters 0 </td>
          <td style="width: 50%">''' + querys[index]["Parameters0"].toString() + ''' </td>
        </tr>
        <tr>
          <td style="width: 50%"> Parameters 1 </td>
          <td style="width: 50%">''' + querys[index]["Parameters1"].toString() + ''' </td>
        </tr>
        <tr>
          <td style="width: 50%"> Parameters 2 </td>
          <td style="width: 50%">''' + querys[index]["Parameters2"].toString() + ''' </td>
        </tr>
        <tr>
          <td style="width: 50%"> Parameters 3 </td>
          <td style="width: 50%">''' + querys[index]["Parameters3"].toString() + ''' </td>
        </tr>
        <tr>
          <td style="width: 50%"> Parameters 4 </td>
          <td style="width: 50%">''' + querys[index]["Parameters4"].toString() + ''' </td>
        </tr>
      </tbody>
    </table>
    ''';
      querySelector('.box-body').children[index].appendHtml(el);
    } else {
      querySelector('.box-body').children[index].children.removeAt(elementIndex);
    }
  }

  void edit (int index){
    int elementIndex = 0;
    bool showed = false;
    for(int i = 0; i<querySelector('.box-body').children[index].children.length; i++){
      if(querySelector('.box-body').children[index].children.elementAt(i).toString() == "table") {
        elementIndex = i;
        showed = true;
      }
    }
    if(!showed) {
      String el = '''
    <table class="table table-striped" style="width:80%; margin:auto;">

      <tbody>
        <tr>
          <td style="width: 50%; vertical-align: middle"> Name </td>
          <td style="width: 50%">
            <input class="form-control" id="queryName" placeholder="Enter name" value="'''+ querys[index]["Name"] +'''">
          </td>
        </tr>
        <tr>
          <td style="width: 50%; vertical-align: middle"> Type </td>
          <td style="width: 50%">
            <select id="queryType" class="form-control">
              <option style="display:none" value="">Select a type</option>
              <option ''';
      if(querys[index]["Type"]=="Sparql")
        el += '''selected>Sparql</option>
              <option>MongoDb</option>''';
      else
        el += '''>Sparql</option>
              <option selected>MongoDb</option>''';
      el += '''
            </select>
          </td>
        </tr>
        <tr>
          <td style="width: 50%; vertical-align: middle"> Endpoint </td>
          <td style="width: 50%">
            <input class="form-control" id="queryEndpoint" placeholder="Enter endpoint" value="'''+ querys[index]["Endpoint"] +'''">
          </td>
        </tr>
        <tr>
          <td style="width: 50%; vertical-align: middle"> Parameters 0 </td>
          <td style="width: 50%">
            <input class="form-control" id="queryParam0" placeholder="Enter value" value="'''+ querys[index]["Parameters0"].toString() +'''">
          </td>
        </tr>
        <tr>
          <td style="width: 50%; vertical-align: middle"> Parameters 1 </td>
          <td style="width: 50%">
            <input class="form-control" id="queryParam1" placeholder="Enter value" value="'''+ querys[index]["Parameters1"].toString() +'''">
          </td>
        </tr>
        <tr>
          <td style="width: 50%; vertical-align: middle"> Parameters 2 </td>
          <td style="width: 50%">
            <input class="form-control" id="queryParam2" placeholder="Enter value" value="'''+ querys[index]["Parameters2"].toString() +'''">
          </td>
        </tr>
        <tr>
          <td style="width: 50%; vertical-align: middle"> Parameters 3 </td>
          <td style="width: 50%">
            <input class="form-control" id="queryParam3" placeholder="Enter value" value="'''+ querys[index]["Parameters3"].toString() +'''">
          </td>
        </tr>
        <tr>
          <td style="width: 50%; vertical-align: middle"> Parameters 4 </td>
          <td style="width: 50%">
            <input class="form-control" id="queryParam4" placeholder="Enter value" value="'''+ querys[index]["Parameters4"].toString() +'''">
          </td>
        </tr>
      </tbody>
    </table>
    ''';
      querySelector('.box-body').children[index].children[1].children[1].style.display = 'initial';
      querySelector('.box-body').children[index].appendHtml(el);
    } else {
      querySelector('.box-body').children[index].children.removeAt(elementIndex);
      querySelector('.box-body').children[index].children[1].children[1].style.display = 'none';
    }
  }

  void save (int index){
    var queryVar = {
        "Name" : querySelector('#queryName').value,
        "Query" : querys.elementAt(index)["Query"],
        "Endpoint" : querySelector('#queryEndpoint').value,
        "Type" : querySelector('#queryType').value,
        "Parameters0": querySelector('#queryParam0').value,
        "Parameters1": querySelector('#queryParam1').value,
        "Parameters2": querySelector('#queryParam2').value,
        "Parameters3": querySelector('#queryParam3').value,
        "Parameters4": querySelector('#queryParam4').value,
        "Results": ""
    };
    querys.removeAt(index);
    querys.insert(index, queryVar);
    altered = true;
  }

  void remove(int index){
    querys.removeAt(index);
    altered = true;
  }

  void saveData(){

    if(googleSign.callMethod('isLoggead')){
      querySelector('#saveError').classes.add("hide");
      querySelector('#saveSuccess').classes.add("hide");
      String jsonData = JSON.encode(querys);

      var request = new HttpRequest();
      request.onReadyStateChange.listen((_) {
        if (request.readyState == HttpRequest.DONE && (request.status == 200 || request.status == 0)) {
          // data saved OK.
          print(" Data saved successfully");
          querySelector('#saveSuccess').classes.remove("hide");
        }
      });
      var url = "http://$host/web/queries.json";
      request.open("POST", url);
      request.send(jsonData);
    } else {
      window.alert("Please sign in first. Also it's available a demo to try it on the website of GSI Group.");
    }
  }

  //Necessary to avoid a failure to Dart execution
  void toggleDialog1(e){
    return;
  }

}

void main() {
  applicationFactory()
  .rootContextType(QueryList)
  .run();
}