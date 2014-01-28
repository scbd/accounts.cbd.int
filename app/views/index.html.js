require('app').controller('IndexController', ['$scope', '$location', '$window', 'authentication', function ($scope, $location, $window, authentication) {

	if(!$scope.user.isAuthenticated) {
		$location.path('/signin');
		return;		
	}

	$scope.actionSignOut = function () { 
    	authentication.signOut();
    	$window.location.href = '/signin'; // force page reload to clear everyting from memory 
    };

}]);