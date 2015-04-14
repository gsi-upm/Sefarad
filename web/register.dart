import 'package:angular/angular.dart';
import 'package:angular/application_factory.dart';
import 'dart:html';
import 'dart:convert';

@Injectable()
class Register {
  var host = "127.0.0.1:8080";
  String name = '';
  String password = '';
  String email = '';
  String repass = '';
  static String p = r'^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$';
  RegExp regex = new RegExp(p);

  void saveUser(){
    if(!checkEmail() && checkPass()) {
      var queryVar = {
          "Name" : name,
          "Email" : email,
          "Password" : password
      };

      String jsonData = JSON.encode(queryVar);
      var request = new HttpRequest();
      request.onReadyStateChange.listen((_) {
        if (request.readyState == HttpRequest.DONE &&
        (request.status == 200 || request.status == 0)) {
          // data saved OK.
          print(" User saved successfully");

        }
      });
      var url = "http://$host/register";
      request.open("POST", url);
      request.send(jsonData);
    }
  }

  bool checkPass(){
    return (password != repass)?false:true;
  }

  bool checkEmail(){
    bool error = false;
    if(regex.hasMatch(email)){
      querySelector('#email').classes.add("has-success");
      querySelector('#email').classes.remove("has-error");
    } else {
      querySelector('#email').classes.add("has-error");
      querySelector('#email').classes.remove("has-success");
      error = true;
    }
    return error;
  }
  //Necessary to avoid a failure to Dart execution
  void toggleDialog1(e){
    return;
  }

}
void main() {
  applicationFactory()
  .rootContextType(Register)
  .run();
}
