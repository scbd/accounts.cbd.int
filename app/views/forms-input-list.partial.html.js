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
                required    : "@",
                icon        : "@"
            },
            link: function ($scope, $element, attrs, ngModelController)
            {
                $scope.skipLoad = false;
                $scope.texts    = [];
                if(!$scope.icon)
                    $scope.icon = 'fa-phone';
                    
                if(ngModelController) {
                    $scope.$watch('binding',function(oldVal,newval){
                        $scope.load();
                    });
                    $scope.$watch('binding', function() {
                        ngModelController.$setViewValue($scope.binding);
                    });
                }

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
            }
        }
    }]);
	
});