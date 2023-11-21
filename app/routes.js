import app from '~/app.js';
import _ from 'lodash';
import './authentication';
// import 'providers/extended-route';
import '~/providers/realm';

import { securize, mapView, currentUser } from './mixin';
import * as angularViewWrapper from './views/shared/angular-view-wrapper'
// import * as vueViewWrapper     from './views/shared/vue-view-wrapper'

function logError(err) {
    console.log(err)
    throw err;
}

const routeTemplates = {
    'home'                 : { component: ()=>import('~/views/index.js'                ).catch(logError) },
    'oauth2_authorize'     : { component: ()=>import('~/views/oauth2/authorize.js'     ).catch(logError) },
    'activate_resend'      : { component: ()=>import('~/views/activate-resend.js'      ).catch(logError) },
    'password'             : { component: ()=>import('~/views/password.js'             ).catch(logError) },
    'password_reset'       : { component: ()=>import('~/views/password-reset.js'       ).catch(logError) },
    'password_reset_sent'  : { component: ()=>import('~/views/password-reset-sent.js'  ).catch(logError) },
    'password_reset_set'   : { component: ()=>import('~/views/password-reset-set.js'   ).catch(logError) },
    'profile'              : { component: ()=>import('~/views/profile.js'              ).catch(logError) },
    'profile_done'         : { component: ()=>import('~/views/profile-done.js'         ).catch(logError) },
    'recovery'             : { component: ()=>import('~/views/help/offline.js'         ).catch(logError) },
    'activity'             : { component: ()=>import('~/views/help/offline.js'         ).catch(logError) },
    'signin'               : { component: ()=>import('~/views/signin.js'               ).catch(logError) },
    'signout'              : { component: ()=>import('~/views/signout.js'              ).catch(logError) },
    'signup'               : { component: ()=>import('~/views/signup.js'               ).catch(logError) },
    'signup_done'          : { component: ()=>import('~/views/signup-done.js'          ).catch(logError) },
    'help_403'             : { component: ()=>import('~/views/help/403.js'             ).catch(logError) },
    'help_404'             : { component: ()=>import('~/views/help/404.js'             ).catch(logError) },
    'admin_users'          : { component: ()=>import('~/views/admin/users.js'          ).catch(logError) },
    'admin_users_id'       : { component: ()=>import('~/views/admin/users-id.js'       ).catch(logError) },
}

app.config(["$routeProvider", '$locationProvider', function ($routeProvider, $locationProvider) {
    
    $locationProvider.html5Mode(true);
    $locationProvider.hashPrefix("!");
    
    $routeProvider.
        when('/',                     { ...mapView(angularViewWrapper), resolve: { ...routeTemplates.home                ,  user: currentUser(), }}).
        when('/oauth2/authorize',     { ...mapView(angularViewWrapper), resolve: { ...routeTemplates.oauth2_authorize    ,  user: currentUser(), securized : securize() }}).
        when('/activate/resend',      { ...mapView(angularViewWrapper), resolve: { ...routeTemplates.activate_resend     ,  user: currentUser(), }}).
        when('/password',             { ...mapView(angularViewWrapper), resolve: { ...routeTemplates.password            ,  user: currentUser(), securized : securize()}}).
        when('/password/reset',       { ...mapView(angularViewWrapper), resolve: { ...routeTemplates.password_reset      ,  user: currentUser(), }}).
        when('/password/reset/sent',  { ...mapView(angularViewWrapper), resolve: { ...routeTemplates.password_reset_sent  , user: currentUser(),  }}).
        when('/password/reset/set',   { ...mapView(angularViewWrapper), resolve: { ...routeTemplates.password_reset_set   , user: currentUser(),  }}).        
        when('/profile',              { ...mapView(angularViewWrapper), resolve: { ...routeTemplates.profile             ,  user: currentUser(), securized : securize() }}).
        when('/profile/done',         { ...mapView(angularViewWrapper), resolve: { ...routeTemplates.profile_done        ,  user: currentUser(), securized : securize() }}).
        when('/recovery',             { ...mapView(angularViewWrapper), resolve: { ...routeTemplates.recovery            ,  user: currentUser(), }}).
        when('/activity',             { ...mapView(angularViewWrapper), resolve: { ...routeTemplates.activity            ,  user: currentUser(), }}).
        when('/signin',               { ...mapView(angularViewWrapper), resolve: { ...routeTemplates.signin              ,  user: currentUser(), }}).
        when('/signout',              { ...mapView(angularViewWrapper), resolve: { ...routeTemplates.signout             ,  user: currentUser(), }}).
        when('/signup',               { ...mapView(angularViewWrapper), resolve: { ...routeTemplates.signup              ,  user: currentUser()}}).
        when('/signup/done',          { ...mapView(angularViewWrapper), resolve: { ...routeTemplates.signup_done         ,  user: currentUser()}}).
        when('/help/403',             { ...mapView(angularViewWrapper), resolve: { ...routeTemplates.help_403            ,  user: currentUser(), }}).
        when('/help/404',             { ...mapView(angularViewWrapper), resolve: { ...routeTemplates.help_404            ,  user: currentUser(), }}).
        when('/admin/users',          { ...mapView(angularViewWrapper), resolve: { ...routeTemplates.admin_users         ,  user: currentUser(), securized : securize(['Administrator', 'Administrator-Accounts']) }, reloadOnSearch:false }).
        when('/admin/users/:id',      { ...mapView(angularViewWrapper), resolve: { ...routeTemplates.admin_users_id      ,  user: currentUser(), securized : securize(['Administrator', 'Administrator-Accounts'])  }}).
        
        otherwise({redirectTo:'/help/404'});
}]);

