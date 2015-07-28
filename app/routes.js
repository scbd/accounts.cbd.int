define(['app', 'lodash', 'authentication', 'ngRoute', 'providers/extended-route'], function (app, _) { 'use strict';

    app.config(['extendedRouteProvider', '$locationProvider', function ($routeProvider, $locationProvider) {

        $locationProvider.html5Mode(true);
        $locationProvider.hashPrefix('!');

        $routeProvider.
            when('/',                     { templateUrl: '/app/views/index.html'                , resolveUser : true, resolveController : true }).
            when('/oauth2/authorize',     { templateUrl: '/app/views/signin.html'               , resolveUser : true, resolveController : true }).
            when('/activate',             { templateUrl: '/app/views/activate.html'             , resolveUser : true, resolveController : true }).
            when('/activate/resend',      { templateUrl: '/app/views/activate-resend.html'      , resolveUser : true, }).
            when('/password',             { templateUrl: '/app/views/password.html'             , resolveUser : true, resolveController : true, resolve : { securized : securize() } }).
            when('/password/reset',       { templateUrl: '/app/views/password-reset.html'       , resolveUser : true, }).
            when('/password/reset/sent',  { templateUrl: '/app/views/password-reset-sent.html'  , resolveUser : true, }).
            when('/password/reset/set',   { templateUrl: '/app/views/password-reset-set.html'   , resolveUser : true, resolveController : true }).
            when('/password/reset/done',  { templateUrl: '/app/views/password-reset-done.html'  , resolveUser : true, }).
            when('/profile',              { templateUrl: '/app/views/profile.html'              , resolveUser : true, resolveController : true, resolve : { securized : securize() } }).
            when('/profile/done',         { templateUrl: '/app/views/profile-done.html'         , resolveUser : true, resolve : { securized : securize() } }).
            when('/recovery',             { templateUrl: '/app/views/help/offline.html'         , resolveUser : true, }).
            when('/activity',             { templateUrl: '/app/views/help/offline.html'         , resolveUser : true, }).
            when('/signin',               { templateUrl: '/app/views/signin.html'               , resolveUser : true, resolveController : true }).
            when('/signout',              { templateUrl: '/app/views/signout.html'              , resolveUser : true, }).
            when('/signup',               { templateUrl: '/app/views/signup.html'               , resolveUser : true, }).
            when('/signup/done',          { templateUrl: '/app/views/signup-done.html'          , resolveUser : true, }).
            when('/help/403',             { templateUrl: '/app/views/help/403.html'             , resolveUser : true, }).
            when('/help/404',             { templateUrl: '/app/views/help/404.html'             , resolveUser : true, }).
            when('/admin/users',          { templateUrl: '/app/views/admin/users.html'          , resolveUser : true, resolveController : true, resolve : { securized : securize(['Administrator']) } }).
            when('/admin/users/:id',      { templateUrl: '/app/views/admin/users-id.html'       , resolveUser : true, resolveController : true, resolve : { securized : securize(['Administrator']) } }).
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
