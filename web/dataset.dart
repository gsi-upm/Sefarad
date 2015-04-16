import 'package:angular/angular.dart';
import 'package:angular/application_factory.dart';
import 'dart:html';
import "package:google_oauth2_client/google_oauth2_browser.dart";
import 'dart:convert';

@Injectable()
class Dataset {
  var host = "127.0.0.1:8080";
  String name = '';
  String type;
  String endPoint = '';
  String user = '';
  String password = '';
  String collection = '';
  String email = '';
  List datasets = [];
  var typeSelect = querySelector('#typeSelector');

  Dataset(){
    _loadDataset();
  }

  void login(){
    if(querySelector("#password").value == "admin")
      googleLogin.login();
    else {
      querySelector("#password").value = "";
      window.alert("Invalid Admin Password");
    }
  }

  void logout(){
      googleLogin.logout();
      resetProfile();
  }

  final googleLogin = new GoogleOAuth2(
      "675126827387-jrvg34sf52dni2o8o5kjgthc3abm8s0u.apps.googleusercontent.com",
      ["openid", "email"],
      tokenLoaded:loginCallback);

  static void loginCallback(Token clave) {
    final googlePlusURL = "https://www.googleapis.com/plus/v1/people/me";
    var request = new HttpRequest();
    request.open("GET", googlePlusURL);
    request.setRequestHeader("Authorization", "${clave.type} ${clave.data}");
    request.onReadyStateChange.listen((_) {
      if (request.readyState == HttpRequest.DONE &&
      (request.status == 200 || request.status == 0)) {
        printProfile(request.responseText);
      }
    });
    request.send();
  }

  void resetProfile(){

    querySelector(".user-name").text = "";
    querySelector(".user-name2").text = "";
    querySelector(".user-name3").text = "";
    querySelector(".user-image").setAttribute('src', "");
    querySelector(".user-image2").setAttribute('src', "");
    querySelector(".user-image3").setAttribute('src', "");
    querySelector(".user-div").style.backgroundImage =  "";
    querySelector(".sign").style.display = "inherit";
    querySelector(".user-bar").style.display = "none";
    querySelector(".user-side").style.display = "none";
  }

  static void printProfile(profile) {
    final myProfile = JSON.decode(profile);
    print(myProfile);
    querySelector(".user-name").text = myProfile['displayName'];
    querySelector(".user-name2").text = myProfile['displayName'];
    querySelector(".user-name3").text = myProfile['displayName'];
    querySelector(".user-name3").appendHtml('<small>' + myProfile['emails'][0]['value'] + '</small>');
    querySelector(".user-image").setAttribute('src', myProfile['image']['url']);
    querySelector(".user-image2").setAttribute('src', myProfile['image']['url']);
    querySelector(".user-image3").setAttribute('src', myProfile['image']['url']);
    querySelector(".user-div").style.backgroundImage =  "url(" + myProfile['cover']['coverPhoto']['url'] + ")";
    querySelector(".user-div").style.backgroundSize = "cover";
    querySelector(".sign").style.display = "none";
    querySelector(".user-bar").style.display = "inherit";
    querySelector(".user-side").style.display = "inherit";
  }

  void _loadDataset(){
    var url = "http://$host/dataset";

    // call the web server asynchronously
    var request = HttpRequest.getString(url).then((responseText){
      datasets = JSON.decode(responseText);
    });
  }

  void checkType(){
    if(typeSelect.value == "MongoDb") {
      querySelector('#collectionSec').style.display = "flex";
      querySelector('#loginUser').style.display = "flex";
    } else {
      querySelector('#collectionSec').style.display = "none";
      querySelector('#loginUser').style.display = "none";
    }
  }

  void clearFilters() {
    name = "";
    endPoint = "";
    collection = "";
    querySelector('#saveError').classes.add("hide");
    querySelector('#saveSuccess').classes.add("hide");
  }

  void saveData(){

    querySelector('#saveError').classes.add("hide");
    querySelector('#saveSuccess').classes.add("hide");
    if(!checkParamPattern()){
      querySelector('#saveError').classes.remove("hide");
      return;
    }

    var queryVar = {
        "Name" : name,
        "Type" : type,
        "Endpoint" : endPoint,
        "Collection" : collection,
        "User" : user,
        "Password" : password
    };
    datasets.add(queryVar);
    querySelector('#saveSuccess').classes.remove("hide");
    String jsonData = JSON.encode(datasets);

    var request = new HttpRequest();
    request.onReadyStateChange.listen((_) {
      if (request.readyState == HttpRequest.DONE &&
      (request.status == 200 || request.status == 0)) {
        // data saved OK.
        print(" Data saved successfully");

      }
    });
    var url = "http://$host/dataset";
    request.open("POST", url);
    request.send(jsonData);
  }

  bool checkParamPattern() {

    bool allRight = true;
    if(typeSelect.value == "")
      allRight = false;
    return allRight;
  }

  //Necessary to avoid a failure to Dart execution
  void toggleDialog1(e){
    return;
  }

}
void main() {
  applicationFactory()
  .rootContextType(Dataset)
  .run();
}