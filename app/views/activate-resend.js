define(['app', 'directives/input-email'], function(){

return ['$scope', '$http', '$location', function ($scope, $http, $location) {

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
}];
});