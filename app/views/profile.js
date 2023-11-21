import app from '~/app';
import angular from 'angular';
import '~/directives/forms-input-list';
import '~/directives/input-email';

export { default as template } from './profile.html';
export default ['$scope', '$http', '$location', '$filter', '$timeout', 'returnUrl', '$q', function ($scope, authHttp, $location, $filter, $timeout, returnUrl, $q) {

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

        var rolePromises = [authHttp.get('/api/v2013/roles', { cache: true }), authHttp.get('/api/v2013/users/'+$scope.user.userID+'/roles')]
        
        $q.all(rolePromises)
        .then(function (response) {
            var map = {}
            _.each(response[0].data, function (role) {
                map[role.roleId] = role;
            });            
            $scope.userRoles = _.map(response[1].data, function(r){
                return map[r].name
            });
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
