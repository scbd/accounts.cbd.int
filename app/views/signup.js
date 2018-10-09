define(['app', 'directives/input-email', 'directives/security/password-rules'], function(){

return ['$scope', '$http', 'authentication', 'apiToken', 'user', function ($scope, $http, authentication, apiToken, user) {
    $scope.passwordType = 'password';

    if(user.isAuthenticated)
        $scope.$root.returnUrl.navigate('/');

    //============================================================
    //
    //
    //============================================================
    $scope.onPostSave = function(data) {
        $scope.isLoading = true;

        $http.post('/api/v2013/users/', angular.toJson($scope.document)).then(function () {

            var credentials = {  // auto signin
                'email':    $scope.document.Email, 
                'password': $scope.document.Password 
            };

            return $http.post('/api/v2013/authentication/token', credentials);

        }).then(function (res) {
    
            apiToken.set(res.data.authenticationToken);
            authentication.reset();

            $scope.$root.returnUrl.navigate('/signup/done');

        }).catch(function (res) {
            $scope.error = res.data || res;
        })
        .finally(function(){
            $scope.isLoading = false;
        });
    };

    $scope.togglePassword = function(){
        if($scope.passwordType == 'password')
            $scope.passwordType = 'text';
        else
            $scope.passwordType = 'password';
    }
}];
});
