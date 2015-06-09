define(['app', 'lodash', 'authentication', 'ngRoute', 'providers/extended-route'], function (app, _) { 'use strict';

    app.config(['extendedRouteProvider', '$locationProvider', function ($routeProvider, $locationProvider) {

        $locationProvider.html5Mode(true);
        $locationProvider.hashPrefix('!');

        $routeProvider.
            when('/',                     { templateUrl: '/app/views/index.html'                , resolveController : true }).
            when('/oauth2/authorize',     { templateUrl: '/app/views/signin.html'               , resolveController : true }).
            when('/activate',             { templateUrl: '/app/views/activate.html'             , resolveController : true }).
            when('/activate/resend',      { templateUrl: '/app/views/activate-resend.html'      , }).
            when('/password',             { templateUrl: '/app/views/password.html'             , resolveController : true, resolve : { user : securize() } }).
            when('/password/reset',       { templateUrl: '/app/views/password-reset.html'       , }).
            when('/password/reset/sent',  { templateUrl: '/app/views/password-reset-sent.html'  , }).
            when('/password/reset/set',   { templateUrl: '/app/views/password-reset-set.html'   , resolveController : true }).
            when('/password/reset/done',  { templateUrl: '/app/views/password-reset-done.html'  , }).
            when('/profile',              { templateUrl: '/app/views/profile.html'              , resolve : { user : securize() } }).
            when('/profile/done',         { templateUrl: '/app/views/profile-done.html'         , resolve : { user : securize() } }).
            when('/recovery',             { templateUrl: '/app/views/help/offline.html'         , }).
            when('/activity',             { templateUrl: '/app/views/help/offline.html'         , }).
            when('/signin',               { templateUrl: '/app/views/signin.html'               , resolveController : true, resolveUser : true }).
            when('/signout',              { templateUrl: '/app/views/signout.html'              , }).
            when('/signup',               { templateUrl: '/app/views/signup.html'               , }).
            when('/signup/done',          { templateUrl: '/app/views/signup-done.html'          , }).
            when('/help/403',             { templateUrl: '/app/views/help/403.html'             , }).
            when('/help/404',             { templateUrl: '/app/views/help/404.html'             , }).
            when('/admin/users',          { templateUrl: '/app/views/admin/users.html'          , resolveController : true, resolve : { user : securize(['Administrator']) } }).
            when('/admin/users/:id',      { templateUrl: '/app/views/admin/users-id.html'       , resolveController : true, resolve : { user : securize(['Administrator']) } }).
            otherwise({redirectTo:'/help/404'});
    }]);


    //============================================================
    //
    //
    //============================================================
    function securize(roles)
    {
        return ["$location", "$q", "authentication", function ($location, $q, authentication) {

            return $q.when(authentication.getUser()).then(function (user) {

                if (!user.isAuthenticated) {

                    $location.search({ returnUrl: $location.search().returnUrl || $location.url() });
                    $location.path('/signin');
                }
                else if (roles && !_.isEmpty(roles) && _.isEmpty(_.intersection(roles, user.roles))) {

                    console.log("securize: not authorized");

                    $location.search({ path: $location.url() });
                    $location.path('/help/403');
                }

                return user;
            });
        }];
    }});
