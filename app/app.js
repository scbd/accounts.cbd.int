define(['angular', 'ngRoute', 'ngCookies'], function (ng) { 'use strict';

	var app = ng.module('app', ['ngRoute', 'ngCookies']);

	app.config(['$httpProvider', function($httpProvider){

        $httpProvider.useApplyAsync(true);
        $httpProvider.interceptors.push('authenticationHttpIntercepter');
        $httpProvider.interceptors.push('realmHttpIntercepter');

    }]);

	return app;
});
