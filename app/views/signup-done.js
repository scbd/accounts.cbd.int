define(['app'], function(){

  return ['$scope','referrer', function ($scope,referrer) {
      $scope.referrer = referrer.get();
  }];
});