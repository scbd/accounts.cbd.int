define(['angular'], function (angular) { 'use strict';

	var deps = ['ngRoute'];

    xangular.defineModules(deps);

    var app = angular.module('app', deps);

	app.config(['$httpProvider', function($httpProvider){

        $httpProvider.useApplyAsync(true);
        $httpProvider.interceptors.push('authenticationHttpIntercepter');

    }]);

	return app;
});
