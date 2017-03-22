define(['app', 'directives/input-email', 'directives/security/password-rules'], function(){

return ['$scope', '$http', '$location', function ($scope, $http, $location) {
    $scope.passwordType = 'password';
    //============================================================
    //
    //
    //============================================================
    $scope.onPostSave = function(data) {
        $scope.isLoading = true;
        $http.post('/api/v2013/users/', angular.toJson($scope.document)).success(function (data, status, headers, config) {

            $location.path('/signup/done');

        }).error(function (data, status, headers, config) {
            $scope.error = data;
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
