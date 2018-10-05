define(['app'], function(){

    return ['$rootScope', '$window', 'apiToken', function ($rootScope, $window, apiToken) {
        apiToken.set(null);
        $window.location.href = $rootScope.returnUrl.get() || '/';
    }];
});