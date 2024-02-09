import app from '~/app';
import 'jquery'
import 'angular-route'
// import '~/components/scbd-angularjs-services/main'
// import 'ngDialog'
import 'angular-cookies'
import _ from 'lodash'

//============================================================
//
//============================================================
export function mapView(comp) {

    const template   = comp.template;
    const controller = comp.default;

    return { template, controller }
}
//============================================================
//
//============================================================
export function resolveLiteral(value) {
    return function () { return value; };
}

export function importQ(module) {
    var importFn = function ($q) {
      return $q(function (resolve, reject) {
        require([module], resolve, function (e) {
          console.error(e);
          reject(e);
        });
      });
    };
    importFn.$inject = ["$q"];
    return importFn;
}

//============================================================
//
//============================================================
export function injectRouteParams(params) {
  return ["$route", function ($route) {
    return _.defaults($route.current.params, params);
  }];
}

export function currentUser() {
  return ["$q", "authentication", function ($q, authentication) {
    return $q.when(authentication.getUser());
  }];
}

export function securize(roles)
{
    return ["$location", "$q", "authentication", "returnUrl", function ($location, $q, authentication, returnUrl) {

        return $q.when(authentication.getUser()).then(function (user) {
            if (!user.isAuthenticated) {

                $location.search({ returnurl: returnUrl.get() || $location.url() });
                $location.path('/signin');
            }
            else if (roles && !_.isEmpty(roles) && _.isEmpty(_.intersection(roles, user.roles))) {

                console.log("securize: not authorized");

                $location.search({ path: $location.url() });
                $location.path('/help/403');
            }

            return user;
        });
    }];
}
