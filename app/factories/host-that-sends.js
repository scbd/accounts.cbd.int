/* jshint sub:true */

import app from '~/app';
import '~/services/return-url';

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
