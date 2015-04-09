import 'package:angular/angular.dart';
import 'package:angular/application_factory.dart';
import 'dart:html';
import 'dart:js';
import 'dart:convert';

@Injectable()
class Query {
  List names;
  String query = '';
  List querys = [];
  List params;

  Query(){
    _loadQuery();
  }

  _loadQuery() {
    var url = "queries.json";
    var request = HttpRequest.getString(url).then(onDataLoaded);
    //var yasgui = new JsObject(context['yasgui']);
  }

  void onDataLoaded(String responseText) {
    //Decoding Error, should not happen
    if (querys == null)
      querys = [];
    querys = JSON.decode(responseText);
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
