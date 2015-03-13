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
  List parameters = [];
  var input = querySelector('#queryNameSelector');
  var myEl2 = querySelector('#querySelector');

  void clearFilters() {
    input.value = "";
    myEl2.value = "";
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
      "Query" : myEl2.value
    };
    querys.add(queryVar);
    window.localStorage[STORAGE_KEY] = JSON.encode(querys);
  }

}
void main() {
  applicationFactory()
    .rootContextType(Query)
    .run();
}
