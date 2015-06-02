import 'package:angular/angular.dart';
import 'package:angular/application_factory.dart';
import 'dart:html';
import 'dart:js';
import 'dart:convert';
import 'authParam.dart';

@Injectable()
class DatasetList extends AuthParam{

  var googleSign = new JsObject(context['loggead']);
  var host = "";
  List datasets = [];
  bool altered = false;

  DatasetList(){
    host = getHost();
    print(host);
    _loadDataset();
    window.onBeforeUnload.listen((BeforeUnloadEvent e) {
      if(altered)
        e.returnValue = "Modifications haven't been saved";
    });
  }

  _loadDataset() {
    var url = "http://$host/web/dataset.json";

    // call the web server asynchronously
    var request = HttpRequest.getString(url).then((responseText){
      datasets = JSON.decode(responseText);
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
          <td style="width: 50%">''' + datasets[index]["Name"] + ''' </td>
        </tr>
        <tr>
          <td style="width: 50%"> Type </td>
          <td style="width: 50%">''' + datasets[index]["Type"] + ''' </td>
        </tr>
        <tr>
          <td style="width: 50%"> Endpoint </td>
          <td style="width: 50%">''' + datasets[index]["Endpoint"] + ''' </td>
        </tr>
        <tr>
          <td style="width: 50%"> Collection </td>
          <td style="width: 50%">''' + datasets[index]["Collection"] + ''' </td>
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
            <input class="form-control" id="datasetName" placeholder="Enter name" value="'''+ datasets[index]["Name"] +'''">
          </td>
        </tr>
        <tr>
          <td style="width: 50%; vertical-align: middle"> Type </td>
          <td style="width: 50%">
            <select id="datasetType" class="form-control">
              <option style="display:none" value="">Select a type</option>
              <option ''';
      if(datasets[index]["Type"]=="Sparql")
        el += '''selected>Sparql</option>
              <option>MongoDb</option>''';
      else
        el += '''>Sparql</option>
              <option selected>MongoDb</option>''';
      el += '''
            </select>
          </td>
        </tr>
        <tr''';
      if(!(datasets[index]["Type"]=="MongoDb"))
        el += '''
        style="display: none"''';
      el += '''>
          <td style="width: 50%; vertical-align: middle"> User </td>
          <td style="width: 50%">
            <input class="form-control" id="datasetUser" placeholder="Enter user" value="'''+ datasets[index]["User"] +'''">
          </td>
        </tr>
        <tr''';
      if(!(datasets[index]["Type"]=="MongoDb"))
        el += '''
        style="display: none"''';
      el += '''>
          <td style="width: 50%; vertical-align: middle"> Password </td>
          <td style="width: 50%">
            <input type="password" class="form-control" id="datasetPassword" placeholder="Enter password" value="'''+ datasets[index]["Password"] +'''">
          </td>
        </tr>
        <tr>
          <td style="width: 50%; vertical-align: middle"> Endpoint </td>
          <td style="width: 50%">
            <input class="form-control" id="datasetEndpoint" placeholder="Enter endpoint" value="'''+ datasets[index]["Endpoint"] +'''">
          </td>
        </tr>
        <tr>
          <td style="width: 50%; vertical-align: middle"> Collection </td>
          <td style="width: 50%">
            <input class="form-control" id="datasetCollection" placeholder="Enter collection" value="'''+ datasets[index]["Collection"] +'''">
          </td>
        </tr>
      </tbody>
    </table>
    ''';
      querySelector('.box-body').children[index].children[1].children[2].style.display = 'initial';
      querySelector('.box-body').children[index].appendHtml(el);
    } else {
      querySelector('.box-body').children[index].children.removeAt(elementIndex);
      querySelector('.box-body').children[index].children[1].children[2].style.display = 'none';
    }
  }

  void save (int index){
    var datasetVar = {
        "Name" : querySelector('#datasetName').value,
        "Type" : querySelector('#datasetType').value,
        "Endpoint" : querySelector('#datasetEndpoint').value,
        "Collection" : querySelector('#datasetCollection').value,
        "User" : querySelector('#datasetUser').value,
        "Password" : querySelector('#datasetPassword').value
    };
    datasets.removeAt(index);
    datasets.insert(index, datasetVar);
    altered = true;
  }

  void browse (int index){
    Uri endpoint = Uri.parse(datasets.elementAt(index)["Endpoint"]);
    print(endpoint.origin);
  }

  void remove(int index){
    datasets.removeAt(index);
    altered = true;
  }

  void saveData(){

    if(googleSign.callMethod('isLoggead')) {
      querySelector('#saveError').classes.add("hide");
      querySelector('#saveSuccess').classes.add("hide");
      String jsonData = JSON.encode(datasets);

      var request = new HttpRequest();
      request.onReadyStateChange.listen((_) {
        if (request.readyState == HttpRequest.DONE && (request.status == 200 || request.status == 0)) {
          // data saved OK.
          print(" Data saved successfully");
          querySelector('#saveSuccess').classes.remove("hide");
        }
      });
      var url = "http://$host/web/dataset.json";
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
  .rootContextType(DatasetList)
  .run();
}