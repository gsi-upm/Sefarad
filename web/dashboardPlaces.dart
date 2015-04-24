import 'package:angular/angular.dart';
import 'package:angular/application_factory.dart';
import 'signGoogle.dart';

@Injectable()
class DashboardPlaces extends SignGoogle{

}

void main() {
  applicationFactory()
  .rootContextType(DashboardPlaces)
  .run();
}