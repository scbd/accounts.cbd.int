require('app').controller('PasswordController', ['$scope', '$location', '$http', '$window', function ($scope, $location, $http, $window) {

    if(!$scope.user.isAuthenticated)
        $location.path('/signin');

    //============================================================
    //
    //
    //============================================================
    $scope.actionChangePassword = function(data) {

        $scope.error   = undefined;
        $scope.success = undefined;
        $scope.waiting = true;

        var credentials = { 'email': $scope.user.email, 'password': $scope.document.oldPassword };

        $http.post('/api/v2013/authentication/token', credentials).then(function onsuccess(success) {

            var headers = { Authorization: "Ticket " + success.data.authenticationToken };

            return $http.put('/api/v2013/changepassword', angular.toJson($scope.document), { headers:headers });

        }).then(function onsuccess(success) {

            $scope.waiting = false;

            alert("Thank you!\r\n\r\nYour password has been updated.")

            //$window.location = 'https://chm.cbd.int/';

        }, function onerror(error) {

            $scope.waiting = false;

            if(error.status==400) {
                $scope.error = 'Passwords must contain at least one number, both upper and lower case letters, and be at least 10 characters long.';
            } else if(error.status==403) {
                $scope.error = 'The original password you is incorrect.';
            } else {
                $scope.error = error.status;
            }
        });
    };

    //============================================================
    //
    //
    //============================================================
    $scope.$watch('document.password+document.confirmation', function () {
        if(!$scope.document) return;
        console.log($scope.document.password==$scope.document.confirmation);
        $scope.form.password2.$setValidity('match', $scope.document.password==$scope.document.confirmation);
    })

}]);
