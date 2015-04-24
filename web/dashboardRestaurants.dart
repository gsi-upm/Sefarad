import 'package:angular/angular.dart';
import 'package:angular/application_factory.dart';
import 'signGoogle.dart';

@Injectable()
class DashboardRestaurants extends SignGoogle{

}

void main() {
  applicationFactory()
  .rootContextType(DashboardRestaurants)
  .run();
}