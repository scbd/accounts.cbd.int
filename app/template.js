define(['app','lodash', 'scbd-angularjs-services/authentication', 'scbd-branding/directives/header/header'], function (app, _) { 'use strict';

	app.controller('TemplateController', ['$scope', '$window', 'authentication', '$q', function ($scope, $window, authentication, $q) {

		$scope.$on("$routeChangeSuccess", function() { $scope.viewLoaded = true; });
		$scope.$on('$routeChangeStart', loadCurrentUser);

        $scope.$on('signOut', function(evt, data) {
            $window.location.reload();
        });
        
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

            require(["_slaask"], function(_slaask) {

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
                    _slaask.init('2aa724f97b4c0b41a2752528214cccb2');
                    _slaask.initialized = true;
                }
            });
        }, 1000));
        
	}]);

});
