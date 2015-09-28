
define(['app', 'lodash', 'authentication', 'directives/bootstrap/dual-list', '/app/views/forms-input-list.partial.html.js'], function(app, _) { 'use strict';

    return ["$http", "$http", "$browser", "authentication", '$scope' , '$filter', '$location', '$route', '$q', function ($http, authHttp, $browser, authentication, $scope, $filter, $location, $route, $q) {

    $http.get("/api/v2013/countries").then(function(result) {

        var sortedData = $filter('orderBy')(result.data, 'name.en');

        $scope.countries = _.map(sortedData, function(o) {
            return { code : o.code.toLowerCase(), name: o.name.en };
        });
    });

    $http.get("/api/v2013/roles", { cache: true }).then(function(response) {
        $scope.roleList = $filter('orderBy')(response.data, 'name');
    });

    //==================================
    //
    //==================================
    $scope.init = function() {

        if($route.current.params.id=='new') {
            $scope.initialRoles = [];
        } else {
            $http.get('/api/v2013/users/'+$route.current.params.id).success(function (data) {

                if(data.Government=="eur")
                    data.Government = "eu"; // BCH country patch

                $scope.document = data;                
                $scope.phones = ($scope.document.Phone||'').split(';');
                $scope.faxes  = ($scope.document.Fax  ||'').split(';');
                $scope.emailsCc  = ($scope.document.EmailsCc  ||'').split(';');
            }).error(function (data) {
                alert('ERROR\r\n----------------\r\n'+data.message);
            });

            $http.get('/api/v2013/users/'+$route.current.params.id+'/roles').success(function (data) {
                $scope.roles = data;
                $scope.initialRoles = data.slice(0); // clone array
            }).error(function (data) {
                alert('ERROR\r\n----------------\r\n'+data.message);
            });
        }
    };

    
    $scope.$watch('phones+faxes+emailsCc', function () {
        if($scope.document) {
            $scope.document.Phone = ($scope.phones||[]).join(';').replace(/^\s+|;$|\s+$/gm,'');
            $scope.document.Fax   = ($scope.faxes ||[]).join(';').replace(/^\s+|;$|\s+$/gm,'');
            $scope.document.EmailsCc   = ($scope.emailsCc ||[]).join(';').replace(/^\s+|;$|\s+$/gm,'');
        }
    });

    //==================================
    //
    //==================================
    $scope.onPostSave = function() {

        if($route.current.params.id=='new') {

            authHttp.post('/api/v2013/users/', angular.toJson($scope.document)).success(function (data) {
                $scope.document = data;
                $scope.actionUpdateRoles();

            }).error(function (data) {
                $scope.error = data.message;
            });

        } else {

            authHttp.put('/api/v2013/users/'+$scope.document.UserID, angular.toJson($scope.document)).success(function () {
                $scope.actionUpdateRoles();
            }).error(function (data) {
                $scope.error = data.message;
            });
        }
    };

    //==================================
    //
    //==================================
    $scope.actionUpdateRoles = function() {

        var rolesToGrant  = _.difference($scope.roles, $scope.initialRoles);
        var rolesToRevoke = _.difference($scope.initialRoles, $scope.roles);

        var tasks = [];

        rolesToGrant.forEach(function grantRole (role) {
            tasks.push(authHttp.put('/api/v2013/users/'+$scope.document.UserID+'/roles/'+role));
        });

        rolesToRevoke.forEach(function grantRole (role) {
            tasks.push(authHttp.delete('/api/v2013/users/'+$scope.document.UserID+'/roles/'+role));
        });

        $q.all(tasks).then(function done () {
            $location.path('/admin/users');
        });
    };

    $scope.init();

}];

});
