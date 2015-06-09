define(['app', 'angular', 'jquery'], function(app, angular, $){


    app.directive('formsInputList', [function() {
        return {
            restrict: 'EAC',
            templateUrl: '/app/views/forms-input-list.partial.html',
            replace: true,
            transclude: false,
            require : "ngModel",
            scope: {
                placeholder : "@",
                binding     : "=ngModel",
                required    : "@"
            },
            link: function ($scope, $element, attrs, ngModelController)
            {
                $scope.skipLoad = false;
                $scope.texts    = [];

                if(ngModelController) {
                    $scope.$watch('binding', $scope.load);
                    $scope.$watch('binding', function() {
                        ngModelController.$setViewValue($scope.binding);
                    });
                }
            },
            controller: ["$scope", function ($scope)
            {
                //==============================
                //
                //==============================
                $scope.load = function ()
                {
                    if($scope.skipLoad)
                    {
                        $scope.skipLoad = false;
                        return;
                    }

                    var oBinding = $scope.binding || [];

                    $scope.texts = [];

                    angular.forEach(oBinding, function(text)
                    {
                        $scope.texts.push({value : text});
                    });
                };

                //==============================
                //
                //==============================
                $scope.remove = function (index)
                {
                    $scope.texts.splice(index, 1);

                    $scope.save();
                };

                //==============================
                //
                //==============================
                $scope.save = function ()
                {
                    var oNewBinding = [];
                    var oText       = $scope.texts;

                    angular.forEach(oText, function(text)
                    {
                        if($.trim(text.value)!="")
                            oNewBinding.push($.trim(text.value));
                    });

                    if($scope.binding) {
                        $scope.binding  = !$.isEmptyObject(oNewBinding) ? oNewBinding : undefined;
                    }

                    $scope.skipLoad = true;
                };

                //==============================
                //
                //==============================
                $scope.getTexts = function ()
                {
                    if($scope.texts.length==0)
                        $scope.texts.push({value : ""});

                    var sLastValue = $scope.texts[$scope.texts.length-1].value;

                    //NOTE: IE can set value to 'undefined' for a moment
                    if(sLastValue && sLastValue!="")
                        $scope.texts.push({value : ""});

                    return $scope.texts;
                };

                //==============================
                //
                //==============================
                $scope.isRequired = function()
                {
                    return $scope.required!=undefined
                        && $.isEmptyObject($scope.binding);
                }
            }]
        }
    }]);



    return ['$scope', '$http', '$location', '$filter', '$timeout', 'user', function ($scope, authHttp, $location, $filter, $timeout, user) {


    //============================================================
    //
    //
    //============================================================
    function initialize() {

        authHttp.get('/api/v2013/users/' + $scope.user.userID).then(function onsuccess (response) {

            $scope.document = response.data;
            $scope.phones = ($scope.document.Phone||'').split(';');
            $scope.faxes  = ($scope.document.Fax  ||'').split(';');

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
    $scope.actionSave = function(data) {

        $scope.waiting = true;

        authHttp.put('/api/v2013/users/' + $scope.user.userID, angular.toJson($scope.document)).success(function (data, status, headers, config) {

            $location.path('/profile/done');

        }).error(function (data, status, headers, config) {
            $scope.waiting = false;
            $scope.error = data;
        });
    };

    $scope.$watch('phones+faxes', function (value) {
        if($scope.document) {
            $scope.document.Phone = ($scope.phones||[]).join('; ').replace(/^\s+|;$|\s+$/gm,'');
            $scope.document.Fax   = ($scope.faxes ||[]).join('; ').replace(/^\s+|;$|\s+$/gm,'');
        }
    });

    $timeout(initialize, 350);

}];
});
