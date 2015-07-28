define(['app', 'directives/security/password-rules'], function() {

    return['$scope', '$http', '$location', '$window', '$timeout', function ($scope, $http, $location, $window, $timeout) {

    //============================================================
    //
    //
    //============================================================
    $scope.actionChangePassword = function(data) {

        $scope.error   = undefined;
        $scope.success = undefined;
        $scope.waiting = true;

        var headers  = { Authorization: "Ticket " + $location.search().key };
        var document = { password: $scope.document.password, authenticationToken: $location.search().key };

        $http.put('/api/v2013/changepassword', angular.toJson($scope.document), { headers:headers }).then(function onsuccess(success) {

            $scope.waiting = false;

            alert("Thank you!\r\n\r\nYour password has been updated.")

           // $window.location = 'https://chm.cbd.int/';
           $location.path('/');

        }, function onerror(error) {

            $scope.waiting = false;

            if(error.status==400) {
                $scope.error = 'Passwords must contain at least one number, both upper and lower case letters, and be at least 10 characters long.';
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
    function init() {

        var headers = { Authorization: "Ticket " + $location.search().key };

        $http.get('/api/v2013/authentication/user', { headers: headers }).then(
            function onsuccess (response) {
                if(response.data.isAuthenticated) {
                    $timeout(function ontimeout() {
                        $scope.email = response.data.email;
                        $scope.initialized = true;
                    }, 800);
                } else {
                    $timeout(function ontimeout() {
                        $location.path('/activate/resend');
                    }, 3000);
                }
            }, function onerror (error) {
                console.log(error);
                $scope.error = error;
            });
    }

    //============================================================
    //
    //
    //============================================================
    $scope.$watch('document.password+document.confirmation', function () {
        if(!$scope.document) return;
        console.log($scope.document.password==$scope.document.confirmation);
        $scope.form.password2.$setValidity('match', $scope.document.password==$scope.document.confirmation);
    });

    init();

}];
});
