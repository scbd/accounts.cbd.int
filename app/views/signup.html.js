require('app').controller('SignupController', ['$scope', '$http', '$location', '$filter','referrer', function ($scope, $http, $location, $filter,referrer) {
    $scope.passwordType = 'password';
    $scope.options = { countries: [] };

    $http.get("/api/v2013/thesaurus/domains/countries/terms", { cache: true }).then(function(o) {
        $scope.options.countries = $filter('orderBy')(o.data, 'name');
    });
console.log(referrer.get());
    //==================================
    //
    //==================================
    $scope.init = function() {

        if($route.current.params.id=='new') {
            $scope.initialRoles = [];
        } else {
            $http.get('/api/v2013/users/'+$route.current.params.id).success(function (data, status, headers, config) {
                $scope.document = data;
                $scope.loadPhones();
                $scope.loadFaxes();
                $scope.loadEmails();
            }).error(function (data, status, headers, config) {
                alert('ERROR\r\n----------------\r\n'+data);
            });

            $http.get('/api/v2013/users/'+$route.current.params.id+'/roles').success(function (data, status, headers, config) {
                $scope.roles = data;
                $scope.initialRoles = data.slice(0); // clone array
            }).error(function (data, status, headers, config) {
                alert('ERROR\r\n----------------\r\n'+data);
            });
        }
    };


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

}]);
