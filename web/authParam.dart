import 'package:angular/angular.dart';
import 'package:angular/application_factory.dart';

@Injectable()
class AuthParam {
  var hostServer = "localhost:63342/Sefarad-2.0";

  String getHost() => hostServer;
}

void main() {
applicationFactory()
.rootContextType(AuthParam)
.run();
}