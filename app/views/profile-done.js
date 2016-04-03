define(['app', 'angular'], function(app, angular) {

  return ['$scope', '$location', '$window', '$timeout', function($scope,  $location, $window, $timeout) {

    $scope.returnUrl = $location.search().returnurl || $location.search().returnUrl || $location.search().redirect_uri || '/';
    $scope.redirectTime = 5;

    if($scope.returnUrl !== '/')
      var cancel = setInterval(function() {

        if ($scope.redirectTime === 0) {
          console.log($scope.redirectTime);
          clearInterval(cancel);
          $window.location.href = $scope.returnUrl;
        }
        $timeout(function() {
          if ($scope.redirectTime) $scope.redirectTime--;
        });
      }, 1000);

  }];
});
