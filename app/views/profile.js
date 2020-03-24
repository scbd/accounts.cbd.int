define(['app', 'angular', 'directives/forms-input-list', 'directives/input-email'], function(app, angular){

return ['$scope', '$http', '$location', '$filter', '$timeout', 'returnUrl', function ($scope, authHttp, $location, $filter, $timeout, returnUrl) {

    //============================================================
    //
    //
    //============================================================
    function initialize() {
        $scope.returnUrl = returnUrl.get() || '/';

        authHttp.get('/api/v2013/users/' + $scope.user.userID).then(function onsuccess (response) {

            $scope.document = response.data;
            $scope.phones = ($scope.document.Phone||'').split(';');
            $scope.faxes  = ($scope.document.Fax  ||'').split(';');
            $scope.emailsCc  = ($scope.document.EmailsCc  ||'').split(';');

        }).catch(function onerror (response) {
            $scope.error = response.data;
        });

        authHttp.get('/api/v2013/thesaurus/domains/countries/terms', { cache: true }).then(function onerror (response) {

            $scope.countries = $filter('orderBy')(response.data, 'name');

        }).catch(function onerror (response) {
            $scope.error = response.data;
        });

        authHttp.get('/api/v2013/roles', { cache: true }).then(function (response) {
    		var map = {};
    		response.data.forEach(function (role) {
    			map[role.roleId] = role;
    		});
    		$scope.roles = map;
	    });

        authHttp.get('/api/v2013/users/'+$scope.user.userID+'/roles').then(function (res) {
            $scope.userRoles = res.data;
        });
    }

    //============================================================
    //
    //
    //============================================================
    $scope.actionSave = function() {

        $scope.waiting = true;

        authHttp.put('/api/v2013/users/' + $scope.user.userID, angular.toJson($scope.document)).then(function () {

            $location.path('/profile/done');

        }).catch(function (data) {
            $scope.waiting = false;
            $scope.error = data;
        });
    };

    $scope.$watch('phones+faxes+emailsCc', function () {
        if($scope.document) {
            $scope.document.Phone = ($scope.phones||[]).join(';').replace(/^\s+|;$|\s+$/gm,'');
            $scope.document.Fax   = ($scope.faxes ||[]).join(';').replace(/^\s+|;$|\s+$/gm,'');
            $scope.document.EmailsCc   = ($scope.emailsCc ||[]).join(';').replace(/^\s+|;$|\s+$/gm,'');
        }
    });
    
    $timeout(initialize, 350);
    
    
}];
});
