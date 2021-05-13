define(['grecaptcha', 'app', 'directives/input-email'], function(grecaptcha){

return ['$scope', '$http', '$location', '$q', function ($scope, $http, $location, $q) {

    //============================================================
    //
    //
    //============================================================
    $scope.actionSubmit = function() {

        return $q.resolve(grecaptcha.executeEx({action:"passwordreset"})).then(function(token) {

            return $http.post('/api/v2013/users/'+encodeURIComponent($scope.email)+'/password-resets', {}, { headers : { 'X-Captcha-Token' : token } });
        
        }).then(function(res) {

            $location.path('/password/reset/sent');

        }).catch(function(res) {

            $scope.error = res.data || res;
        });
    };
}];
});
