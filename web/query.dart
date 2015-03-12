import 'package:angular/angular.dart';
import 'package:angular/application_factory.dart';
import 'dart:html';
import 'dart:js';
import 'dart:convert';

@Injectable()
class Query {
  final String STORAGE_KEY = 'querysSaved';
  String name = '';
  String query = '';
  List<String> querys = [];
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

      for (int i = 0; i < querys.length; i++) {
        OptionElement newQuery = new OptionElement();
        newQuery.text = querys[i]['name'].toString();
        select.children.add(newQuery);
      }
    }
  }

}
void main() {
  applicationFactory()
  .rootContextType(Query)
  .run();
}
