import 'package:angular/angular.dart';
import 'package:angular/application_factory.dart';
import 'dart:html';
import 'dart:convert';

@Injectable()
class Query {
  final String STORAGE_KEY = 'querysSaved';
  List names;
  String query = '';
  List querys = [];
  List params;
  final SelectElement select = querySelector('#querySelector');
  var myEl = querySelector('#queryOption');

  Query(){
    _loadQuery();
  }

  _loadQuery() {
    if (window.localStorage.containsKey(STORAGE_KEY)) {
      querys = JSON.decode(window.localStorage[STORAGE_KEY]);

      //Decoding Error, should not happen
      if (querys == null)
        querys = [];
    }
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
