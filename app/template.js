define(['app','underscore'], function (app, _) { 'use strict';

	app.controller('TemplateController', ['$scope', '$window', 'authentication','$rootScope', function ($scope, $window, authentication,$rootScope) {

        $scope.actionSignOut = function () {
        	authentication.signOut();
        	$window.location.href = $window.location.href; // force page reload to clear everyting from memory
        };

        $scope.isAdmin = function() {
			return $rootScope.user && _.contains($rootScope.user.roles, "Administrator");
		};

	}]);

});
