define(['app', 'lodash'], function (app, _) { 'use strict';

	app.controller('TemplateController', ['$scope', '$window', 'authentication', '$q', function ($scope, $window, authentication, $q) {

		$scope.$on("$routeChangeSuccess", function() { $scope.viewLoaded = true; });
		$scope.$on('$routeChangeStart', loadCurrentUser);

        $scope.actionSignOut = function () {
        	authentication.signOut().finally(function () {
				$window.location.href = $window.location.href; // force page reload to clear everyting from memory
        	});
        };

        $scope.isAdmin = function() {
			return $scope.user && _.contains($scope.user.roles, "Administrator");
		};

		function loadCurrentUser() {

			return $q.when(authentication.getUser(), function (user) {
				$scope.user = user;
			});
		}

        // $scope.$watch('user', _.debounce(function(user) {
		//
        //     if (!user)
        //         return;
		//
        //     require(["_slaask"], function(_slaask) {
		//
        //         if (user.isAuthenticated) {
        //             _slaask.identify(user.name, {
        //                 'user-id' : user.userID,
        //                 'name' : user.name,
        //                 'email' : user.email,
        //             });
		//
        //             if(_slaask.initialized) {
        //                 _slaask.slaaskSendUserInfos();
        //             }
        //         }
		//
        //         if(!_slaask.initialized) {
        //             _slaask.init('ae83e21f01860758210a799872e12ac4');
        //             _slaask.initialized = true;
        //         }
        //     });
        // }, 1000));

	}]);

});
