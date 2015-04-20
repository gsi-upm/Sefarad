import 'package:angular/angular.dart';
import 'package:angular/application_factory.dart';
import 'signGoogle.dart';

@Injectable()
class Dashboard extends SignGoogle{

}

void main() {
  applicationFactory()
  .rootContextType(Dashboard)
  .run();
}