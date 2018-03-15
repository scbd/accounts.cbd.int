define(['app', 'angular','authentication'], function(app, angular) {

  return ['$scope', '$location', '$window', '$timeout','authentication', function($scope,  $location, $window, $timeout,authentication) {

    $scope.returnUrl = $location.search().returnurl || $location.search().returnUrl || $location.search().redirect_uri || '/';
    $scope.redirectTime = 5;


		$scope.actionSignOut = function () {

			authentication.signOut().finally(function () {
				$window.location.href = '/signin'; // force page reload to clear everyting from memory
        	});
	   };

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
