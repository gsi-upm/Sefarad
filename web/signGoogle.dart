import 'package:angular/angular.dart';
import 'package:angular/application_factory.dart';
import 'dart:html';
import "package:google_oauth2_client/google_oauth2_browser.dart";
import 'dart:convert';

@Injectable()
class SignGoogle {
  static bool logged = false;
  static var host = "localhost:1990";

  void login() {
    InputElement ie = querySelector("#password");
    if (ie.value == "admin")
      googleLogin.login();
    else {
      ie.value = "";
      window.alert("Invalid Admin Password");
    }
  }

  String getHost() => host;
  bool isLogged() => logged;

  void logout() {
    googleLogin.logout();
    logged = false;
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
        logged = true;
      }
    });
    request.send();
  }

  void resetProfile() {

    querySelector(".user-name").text = "";
    querySelector(".user-name2").text = "";
    querySelector(".user-name3").text = "";
    querySelector(".user-image").setAttribute('src', "");
    querySelector(".user-image2").setAttribute('src', "");
    querySelector(".user-image3").setAttribute('src', "");
    querySelector(".user-div").style.backgroundImage = "";
    querySelector(".sign").style.display = "inherit";
    querySelector(".user-bar").style.display = "none";
    querySelector(".user-side").style.display = "none";
  }

  static void printProfile(profile) {
    final myProfile = JSON.decode(profile);
    querySelector(".user-name").text = myProfile['displayName'];
    querySelector(".user-name2").text = myProfile['displayName'];
    querySelector(".user-name3").text = myProfile['displayName'];
    querySelector(".user-name3").appendHtml('<small>' + myProfile['emails'][0]['value'] + '</small>');
    querySelector(".user-image").setAttribute('src', myProfile['image']['url']);
    querySelector(".user-image2").setAttribute('src', myProfile['image']['url']);
    querySelector(".user-image3").setAttribute('src', myProfile['image']['url']);
    querySelector(".user-div").style.backgroundImage = "url(" + myProfile['cover']['coverPhoto']['url'] + ")";
    querySelector(".user-div").style.backgroundSize = "cover";
    querySelector(".sign").style.display = "none";
    querySelector(".user-bar").style.display = "inherit";
    querySelector(".user-side").style.display = "inherit";
  }
}

void main() {
applicationFactory()
.rootContextType(SignGoogle)
.run();
}