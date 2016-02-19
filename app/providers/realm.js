define(['app', 'angular'], function (app, angular) { 'use strict';

    app.provider("realm", {

        $get : [function() {
            return 'ACCOUNTS';
        }]
    });

    app.factory('realmHttpIntercepter', ['realm', function(realm) {

		return {
			request: function(config) {

				var trusted = /^https:\/\/api.cbd.int\//i .test(config.url) ||
							  /^\/api\//i                 .test(config.url);

				var hasRealm = (config.headers||{}).hasOwnProperty('Realm') ||
							   (config.headers||{}).hasOwnProperty('realm');

				if(trusted && !hasRealm) { // Inject realm
                    config.headers = config.headers || {};
                    config.headers.realm = realm;
                }

                return config;
			}
		};
	}]);

}); //define
