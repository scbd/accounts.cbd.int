define(['app', 'angular', 'directives/forms-input-list'], function(app, angular){

return ['$scope', '$http', '$location', '$filter', '$timeout', 'user', function ($scope, authHttp, $location, $filter, $timeout, user) {

    $scope.returnUrl = $location.search().returnurl || $location.search().returnUrl || '/';

    //============================================================
    //
    //
    //============================================================
    function initialize() {
        
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
    }

    //============================================================
    //
    //
    //============================================================
    $scope.actionSave = function() {

        $scope.waiting = true;

        authHttp.put('/api/v2013/users/' + $scope.user.userID, angular.toJson($scope.document)).success(function () {

            $location.path('/profile/done');

        }).error(function (data) {
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
