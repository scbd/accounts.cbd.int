define(['app', 'authentication'], function(){

	return ['$scope', '$location', '$window', 'authentication', 'user', function ($scope, $location, $window, authentication, user) {

		if(!user.isAuthenticated) {
			$location.replace();
			$location.path('/signin');
			return;
		}
		
		$scope.ready = true;

		$scope.actionSignOut = function () {

			authentication.signOut().finally(function () {
				$window.location.href = '/signin'; // force page reload to clear everyting from memory
        	});
	    };
	}];
});
