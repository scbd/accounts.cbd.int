define(['app', 'directives/input-email'], function(){

return ['$scope', '$http', '$location', function ($scope, $http, $location) {

    //============================================================
    //
    //
    //============================================================
    $scope.actionSubmit = function() {

        $http.post('/api/v2013/users/'+encodeURIComponent($scope.email)+'/password-resets', angular.toJson({})).then(function(res) {

            $location.path('/password/reset/sent');

        }).catch(function(res) {

            $scope.error = res.data || res;
        });
    };
}];
});
