import app from '~/app';
import ng from 'angular';

app.factory('authentication', ["$http", "$q", '$rootScope', function($http, $q, $rootScope) {

    var currentUser = null;

    //============================================================
    //
    //
    //============================================================
    function getUser () {

        if(currentUser)
            return $q.when(currentUser);


        currentUser = $http.get('/api/v2013/authentication/user').then(function onsuccess (response) {

            currentUser = response.data;
            if (currentUser && currentUser.isAuthenticated && !currentUser.isEmailVerified) {
                $rootScope.$broadcast('event:auth-emailVerification', {
                    message: 'Email verification pending. Please verify you email before submitting any data.'
                });
            }

            return currentUser;

        }).catch(function () {

            currentUser = { userID: 1, name: 'anonymous', email: 'anonymous@domain', government: null, userGroups: null, isAuthenticated: false, isOffline: true, roles: [] };

            return currentUser;
        });

        return currentUser;
    }

    //============================================================
    //
    //
    //============================================================
    function signOut () {

        document.cookie = "authenticationToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
        document.cookie = "expiration=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";

        reset();

        return $http.delete('/api/v2013/authentication/token');

    }

    //============================================================
    //
    //
    //============================================================
    function reset () {

        currentUser = undefined;
    }

    return { getUser: getUser, signOut: signOut, reset: reset };

}]);

app.factory('apiToken', ["$cookies", function($cookies) {

    return {
        get : function() {
            return $cookies.get("authenticationToken");
        },
        set : function(token) {

            if(token) $cookies.put   ("authenticationToken", token, { path: '/', samesite: 'None', secure: true });
            else      $cookies.remove("authenticationToken",        { path: '/', samesite: 'None', secure: true });
        }
    };
}]);

app.factory('authenticationHttpIntercepter', ["$q", "apiToken", function($q, apiToken) {

    return {
        request: function(config) {

            var trusted = /^https:\/\/api.cbd.int\//i .test(config.url) ||
                                /^\/api\//i                 .test(config.url);

            var hasAuthorization = (config.headers||{}).hasOwnProperty('Authorization') ||
                                   (config.headers||{}).hasOwnProperty('authorization');

            if(!trusted || hasAuthorization) // no need to alter config
                return config;

            //Add token to http headers

            return $q.when(apiToken.get()).then(function(token) {

                if(token) {
                    config.headers = ng.extend(config.headers||{}, {
                        Authorization : "Token " + token
                    });
                }

                return config;
            });
        }
    };
}]);
