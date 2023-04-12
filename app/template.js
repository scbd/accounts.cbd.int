define(['app','lodash', 'services/return-url'], function (app, _) { 'use strict';

	app.controller('TemplateController', ['$scope', '$rootScope', '$window', 'authentication', '$q', 'returnUrl', function ($scope, $rootScope, $window, authentication, $q, returnUrl) {

        $rootScope.returnUrl = returnUrl; // I know it's a bad idea

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

        $scope.$watch('user', _.debounce(function(user) {

            if (!user)
                return;

            require(["https://cdn.slaask.com/chat.js"], function() {

                const _slaask =  window._slaask
                
                if (user.isAuthenticated) {
                    _slaask.identify(user.name, {
                        'user-id' : user.userID,
                        'name' : user.name,
                        'email' : user.email,
                    });

                    if(_slaask.initialized) {
                        _slaask.slaaskSendUserInfos();
                    }
                }

                if(!_slaask.initialized) {
                    _slaask.init('ae83e21f01860758210a799872e12ac4');
                }
            });
        }, 1000));

	}]);

});
