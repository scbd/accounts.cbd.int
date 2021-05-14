define(['app', 'directives/input-email', './recaptcha.directive.js'], function(){

return ['$scope', '$http', '$location', function ($scope, $http, $location) {

    //============================================================
    //
    //
    //============================================================
    $scope.actionSubmit = function() {

        $http.post('/api/v2013/users/'+encodeURIComponent($scope.email)+'/activations', angular.toJson({}), { headers : { 'x-captcha-v2-token' : $scope.grecaptchaToken } })
        .then(function onsuccess(data, status, headers, config) {

            $location.path('/signup/done');

        }).catch(function (data, status, headers, config) {
            $scope.error = status;
            $scope.resetCaptcha();
        })
    };
}];
});
