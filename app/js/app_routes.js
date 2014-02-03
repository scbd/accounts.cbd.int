'use strict';

define(['app', 'authentication'], function (app) {

	var resolveUser = ['$rootScope', 'authentication', function($rootScope, authentication) {
		return authentication.getUser().then(function (user) { $rootScope.user = user; return user; });
	}];

    app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
        $locationProvider.html5Mode(true);
        $locationProvider.hashPrefix('!');
    
        $routeProvider.
            when('/',                     { templateUrl: '/app/views/index.html'                , resolve: { user: resolveUser }}).
            when('/oauth2/authorize',     { templateUrl: '/app/views/oauth2/authorize.html'     , resolve: { user: resolveUser }}).
            when('/activate',             { templateUrl: '/app/views/activate.html'             , resolve: { user: resolveUser }}).
            when('/activate/resend',      { templateUrl: '/app/views/activate-resend.html'      , resolve: { user: resolveUser }}).
            when('/password',             { templateUrl: '/app/views/password.html'             , resolve: { user: resolveUser }}).
            when('/password/reset',       { templateUrl: '/app/views/password-reset.html'       , resolve: { user: resolveUser }}).
            when('/password/reset/done',  { templateUrl: '/app/views/password-reset-done.html'  , resolve: { user: resolveUser }}).
            when('/profile',              { templateUrl: '/app/views/profile.html'              , resolve: { user: resolveUser }}).
            when('/profile/done',         { templateUrl: '/app/views/profile-done.html'         , resolve: { user: resolveUser }}).
            when('/recovery',             { templateUrl: '/app/views/help/offline.html'         , resolve: { user: resolveUser }}).
            when('/activity',             { templateUrl: '/app/views/help/offline.html'         , resolve: { user: resolveUser }}).
            when('/signin',               { templateUrl: '/app/views/signin.html'               , resolve: { user: resolveUser }}).
            when('/signup',               { templateUrl: '/app/views/signup.html'               , resolve: { user: resolveUser }}).
            when('/signup/done',          { templateUrl: '/app/views/signup-done.html'          , resolve: { user: resolveUser }}).
            when('/help/403',             { templateUrl: '/app/views/help/403.html'             , resolve: { user: resolveUser }}).
            when('/help/404',             { templateUrl: '/app/views/help/404.html'             , resolve: { user: resolveUser }}).
            when('/admin/users',          { templateUrl: '/app/views/admin/users.html'          , resolve: { user: resolveUser }}).
            when('/admin/users/:id',      { templateUrl: '/app/views/admin/users-id.html'       , resolve: { user: resolveUser }}).
            otherwise({redirectTo:'/help/404'});
    }]);
});