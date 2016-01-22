require('app').controller('SignupController', ['$scope', '$http', '$location', '$filter', function ($scope, $http, $location, $filter) {
    $scope.passwordType = 'password';
    $scope.options = { countries: [] };

    $http.get("/api/v2013/thesaurus/domains/countries/terms", { cache: true }).then(function(o) {
        $scope.options.countries = $filter('orderBy')(o.data, 'name');
    });
    
    console.log(document.referrer);
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


    $scope.togglePassword = function(){
        if($scope.passwordType == 'password')
            $scope.passwordType = 'text';
        else
            $scope.passwordType = 'password';
    }

}]);
