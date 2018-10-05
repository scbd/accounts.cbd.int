define(['app', 'angular','authentication'], function(app, angular) {

  return ['$scope', '$location', '$window', '$timeout','authentication', function($scope,  $location, $window, $timeout,authentication) {

    $scope.redirectTime = 5;


		$scope.actionSignOut = function () {

			authentication.signOut().finally(function () {
				$window.location.href = '/signin'; // force page reload to clear everyting from memory
        	});
	   };

    if($scope.$root.returnUrl.has())
      var cancel = setInterval(function() {

        if ($scope.redirectTime === 0) {
          console.log($scope.redirectTime);
          clearInterval(cancel);
          $scope.$root.returnUrl.goBack();
        }
        $timeout(function() {
          if ($scope.redirectTime) $scope.redirectTime--;
        });
      }, 1000);

  }];
});
