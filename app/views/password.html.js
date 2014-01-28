require('app').controller('PasswordController', ['$scope', '$location', '$http', '$window', function ($scope, $location, $http, $window) {

    if(!$scope.user.isAuthenticated)
        $location.path('/signin');

    //============================================================
    //
    //
    //============================================================
    $scope.actionChangePassword = function(data) {

        var credentials = { 'email': $scope.user.email, 'password': $scope.document.oldPassword };

        $http.post('/api/v2013/authentication/token', credentials).then(function onsuccess(success) {
        
            var headers = { Authorization: "Ticket " + success.data.authenticationToken };

            $http.put('/api/v2013/changepassword', angular.toJson($scope.document), { headers:headers }).success(function (data, status, headers, config) {
                
                $scope.error = "";

                alert("Thank you!\r\n\r\nYour password has been updated.")
                
                //$window.location = 'https://chm.cbd.int/';

            }).error(function (data, status, headers, config) {
                $scope.error = status;
                $scope.success = undefined;
            });
        }, function onerror(error) {

            $scope.password = "";
            $scope.isLoading = false;
            $scope.isForbidden = error.errorCode == 403;
            $scope.isNoService = error.errorCode == 404;
            $scope.isError = error.errorCode != 403 && error.errorCode != 404;
            $scope.error = error.error;
            if($scope.error == "")
                $scope.error = "Old password does not seem valid"
            throw error;
        });
    };

    //============================================================
    //
    //
    //============================================================
    $scope.updateComplexity =  function(){
        //debugger;
        $("#password").complexify({}, function (valid, complexity) {
            if (!valid) {
                $('#progress').css({'width':complexity + '%'}).removeClass('progressbarValid').addClass('progressbarInvalid');
            } else {
                $('#progress').css({'width':complexity + '%'}).removeClass('progressbarInvalid').addClass('progressbarValid');
            }
            $('#complexity').html(Math.round(complexity) + '%');
        });
    };
}]);

// angular.module('kmApp').compileProvider.directive('validLength', [function() {
//     return {
//         require: 'ngModel',
//         link: function(scope, elm, attrs, ctrl) {
//             var validator = function(value) {
//                 ctrl.$setValidity('length', (value||'').length>=10);
//                 return value;
//             };
//             ctrl.$parsers.unshift(validator);
//             ctrl.$formatters.unshift(validator);
//         }
//     };
// }]);

// angular.module('kmApp').compileProvider.directive('validPassword', [function() {
//     return {
//         require: 'ngModel',
//         link: function(scope, elm, attrs, ctrl) {
//             var validator = function(value) {
//                 var count = 0;
//                 count += (/[a-z]/g).test(value) ? 1 : 0;
//                 count += (/[A-Z]/g).test(value) ? 1 : 0;
//                 count += (/[0-9]/g).test(value) ? 1 : 0;
//                 count += (/[^0-9^A-Z^a-z]/g).test(value) ? 1 : 0;
//                 ctrl.$setValidity('password', (value||'').length>=10 && count>=2);
//                 return value;
//             };
//             ctrl.$parsers.unshift(validator);
//             ctrl.$formatters.unshift(validator);
//         }
//     };
// }]);