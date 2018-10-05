define(['app'], function (app) { 'use strict';

    return app.factory('returnUrl', ['$location', '$document', '$window', function($location, $document, $window) {

        var baseURI = parseUrl('/').baseURI;

        return  { 
            navigate: navigate,
            get:      getReturnUrl,
            set:      setReturnUrl,
            has:      function() { return getReturnUrl(); },
            goBack :  function(altUrl) { 
                
                var returnUrl = getReturnUrl();
                
                setReturnUrl(null);

                return navigate(returnUrl || altUrl || '/'); 
            }
        };

        //============================================================
        //
        //
        //============================================================
        function getReturnUrl() {

            var url = $location.search().returnUrl || $location.search().returnurl || $location.search()['return-url'];
            
            if(isTrusted(url))
                return url;
        }

        //============================================================
        //
        //
        //============================================================
        function setReturnUrl(url) {

            if(!isTrusted(url))
                url = null;

            $location.search('return-url', null);
            $location.search('returnurl',  null);
            $location.search('returnUrl',  url);
        }

        //============================================================
        //
        //
        //============================================================
        function navigate(url) {

            var parsedUrl = parseUrl(url);

            if(parsedUrl.hostname!=$location.host()) { 
                window.location.href = url;
            }
            else {
                $location.path(url);
            }                  
        }

        //============================================================
        //
        //
        //============================================================
        function isTrusted(unsafeUrl) {

            var trustedHosts = [
                "absch.cbd.int", 'training-absch.cbd.int', 'dev-absch.cbd.int',
                "eunomia.cbd.int",
                "bch.cbd.int",
                "chm.cbd.int", 'dev-chm.cbd.int',
                'lifeweb.cbd.int',
                "www.cbd.int",
                '192.168.1.68',
                "localhost"
            ];

            var url = parseUrl(unsafeUrl);

            if(url.hostname && ~trustedHosts.indexOf(url.hostname))
                return true;
        }

        //============================================================
        //
        //
        //============================================================
        function parseUrl(href) {
            try {
                var l = $document[0].createElement("a");
                l.href = href;
                return l;
            }
            catch(e) {
                console.error(e);
                return {};
            }
        }
	}]);
});
