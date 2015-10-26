define(['app', 'directives/security/password-rules'], function() {

    return ['$scope', '$location', '$http', function ($scope, $location, $http) {

    //============================================================
    //
    //
    //============================================================
    $scope.actionChangePassword = function() {

        $scope.error   = undefined;
        $scope.success = undefined;
        $scope.waiting = true;

        var credentials = { 'email': $scope.user.email, 'password': $scope.oldPassword };
        var newPassword = { 'password' : $scope.newPassword1 };

        $scope.oldPassword  = "";
        $scope.newPassword1 = "";
        $scope.newPassword2 = "";

        $http.post('/api/v2013/authentication/token', credentials).then(function onsuccess(success) {

            var headers = { Authorization: "Ticket " + success.data.authenticationToken };

            return $http.put('/api/v2013/changepassword', angular.toJson(newPassword), { headers:headers });

        }).then(function() {

            $scope.waiting = false;

            alert("Thank you!\r\n\r\nYour password has been updated.");

            //$window.location = 'https://chm.cbd.int/';

        }, function onerror(error) {

            $scope.waiting = false;

            if(error.status==400) {
                $scope.error = 'New passwords does not match rules: '+error.data.message;
            } else if(error.status==403) {
                $scope.error = 'The old password is incorrect.';
            } else {
                $scope.error = error.status;
            }
        });
    };

    //============================================================
    //
    //
    //============================================================
    $scope.$watch('newPassword1+newPassword2', function () {
        $scope.form.password2.$setValidity('match', $scope.newPassword1==$scope.newPassword2);
    });

}];

});
