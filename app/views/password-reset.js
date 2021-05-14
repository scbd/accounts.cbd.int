define(['app', 'directives/input-email', './recaptcha.directive.js'], function(){

return ['$scope', '$http', '$location', function ($scope, $http, $location) {

    //============================================================
    //
    //
    //============================================================
    $scope.actionSubmit = function() {
        return $http.post('/api/v2013/users/'+encodeURIComponent($scope.email)+'/password-resets', {}, { headers : { 'x-captcha-v2-token' : $scope.grecaptchaToken } })
        .then(function(res) {

            $location.path('/password/reset/sent');

        }).catch(function(res) {

            $scope.error = res.data || res;
            $scope.resetCaptcha();
        });
    };
}];
});
