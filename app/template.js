define(['app','lodash'], function (app, _) { 'use strict';

	app.controller('TemplateController', ['$scope', '$window', 'authentication', '$q', function ($scope, $window, authentication, $q) {

		$scope.$on('$routeChangeStart', loadCurrentUser);

        $scope.actionSignOut = function () {
        	authentication.signOut();
        	$window.location.href = $window.location.href; // force page reload to clear everyting from memory
        };

        $scope.isAdmin = function() {
			return $scope.user && _.contains($scope.user.roles, "Administrator");
		};

		function loadCurrentUser() {

			return $q.when(authentication.getUser(), function (user) {
				$scope.user = user;
			});
		}
	}]);

});
