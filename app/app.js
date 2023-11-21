import angular from 'angular';

var deps = ['ngRoute', 'ngCookies'];

angular.defineModules(deps);

var app = angular.module('app', deps);

app.config(['$httpProvider', function($httpProvider){

    $httpProvider.useApplyAsync(true);
    $httpProvider.interceptors.push('authenticationHttpIntercepter');
    $httpProvider.interceptors.push('realmHttpIntercepter');

}]);

app.value("captchaSiteKeyV2", (document && document.documentElement.attributes['captcha-site-key-v2'].value));
app.value("captchaSiteKeyV3", (document && document.documentElement.attributes['captcha-site-key-v3'].value));

export default app;
