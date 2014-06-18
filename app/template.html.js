define(['app','underscore'], function (app) {
	'use strict';

	app.controller('TemplateController', ['$scope', '$window', 'authentication','$rootScope', function ($scope, $window, authentication,$rootScope) {

    	$scope.controller = "TemplateController";

    	_loadCss('/app/libs/font-awesome/css/font-awesome.css');
        //_loadCss('//fast.fonts.net/cssapi/ab363dc0-d9f9-4148-a52d-4dca15df47ba.css');

        $scope.actionSignOut = function () { 
        	authentication.signOut();
        	$window.location.href = $window.location.href; // force page reload to clear everyting from memory 
        };

        $scope.isAdmin = function(){        	
			return $rootScope.user && _.contains($rootScope.user.roles, "Administrator");
		}

	}]);

	function _loadCss(url) {
	    var link = document.createElement("link");
	    link.type = "text/css";
	    link.rel = "stylesheet";
	    link.href = url;
	    document.getElementsByTagName("head")[0].appendChild(link);
	}

	
});