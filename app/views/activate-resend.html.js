require('app').controller('ActivateResendController', ['$scope', '$http', '$location', '$window', function ($scope, $http, $location, $window) {

    // if($scope.user.isAuthenticated) {
    //     authentication.signOut();
    // }

    //============================================================
    //
    //
    //============================================================
    $scope.actionSubmit = function() {

        $http.post('/api/v2013/users/'+encodeURIComponent($scope.email)+'/activations', angular.toJson({})).success(function onsuccess(data, status, headers, config) {

            $location.path('/signup/done');

        }).error(function (data, status, headers, config) {

            $scope.error = status;
        });
    };

    // init();

}]);

require('app').directive('validateEmail', [function() {
    var EMAIL_REGEXP = /^[-0-9a-zA-Z.+_]+@[-0-9a-zA-Z.+_]+\.[a-zA-Z]{2,4}$/; // TODO: ENSURE CONSISTENCY WITH BACK-END
    return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            ctrl.$parsers.unshift(function(viewValue) {
                if (!viewValue || EMAIL_REGEXP.test(viewValue)) {
                    ctrl.$setValidity('email', true);
                    return viewValue;
                } else {
                    ctrl.$setValidity('email', false);
                    return undefined;
                }
            });
        }
    };
}]);