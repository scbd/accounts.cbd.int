define(['angular'], function (angular) { 'use strict';

	var deps = ['ngRoute'];

    angular.defineModules(deps);

    var app = angular.module('app', deps);

	return app;
});
