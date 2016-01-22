/* jshint sub:true */

define(['app'], function (app) { 'use strict';

	app.factory('referrer', [function() {

			var referrer = document.referrer;
			//============================================================
			//
			//
			//============================================================
			function getReferrer() {

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
