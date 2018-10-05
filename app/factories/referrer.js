/* jshint sub:true */

define(['app', 'services/return-url'], function (app) { 'use strict';

	app.factory('referrer', ['$location', 'returnUrl', function($location, returnUrl) {

			var referrer = document.referrer;
			//============================================================
			//
			//
			//============================================================
			function getReferrer() {

				if(returnUrl.has())                return returnUrl.get();
				if(referrer == $location.absUrl()) return;

				return referrer;

			}

			//============================================================
		    //
		    //
		    //============================================================
			function setReferrer(ref) { // remoteUpdate:=true

					referrer =ref;
			}

			return {
				get : getReferrer,
				set : setReferrer
			};
		}]);


});
