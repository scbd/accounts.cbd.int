define(['angular'], function (ng) { 'use strict';
console.log(ng)
	//var deps = ['ngRoute', 'ngCookies'];

    //angular.defineModules(deps);

    var app = ng.module('app', deps);

	app.config(['$httpProvider', function($httpProvider){

        $httpProvider.useApplyAsync(true);
        $httpProvider.interceptors.push('authenticationHttpIntercepter');
        $httpProvider.interceptors.push('realmHttpIntercepter');

    }]);

	return app;
});
