define(['app', 'lodash'], function (app, _) { 'use strict';

    return app.factory('returnUrl', ['$location', '$document', '$window', function($location, $document, $window) {

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

            var url = $location.search().returnUrl || $location.search().returnurl || $location.search()['return-url']
                      || $location.search()['redirect_uri'];
            
            if(isTrusted(url)){
                return url;
            }
            else{
                console.log('not trusted url', url)
            }
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
            $location.search('redirect_uri',  null);
            $location.search('returnUrl',  url);
        }

        //============================================================
        //
        //
        //============================================================
        function navigate(url) {

            var parsedUrl = parseUrl(url);
            var returnUrl = getReturnUrl();

            if(parsedUrl.hostname!=$location.host()) { 
                window.location.href = url;
            }
            else {

                $location.url(url);
                
                if(returnUrl)
                    $location.search('returnUrl',  returnUrl); 

            }                  
        }

        //============================================================
        //
        //
        //============================================================
        function isTrusted(unsafeUrl) {

            var trustedHosts = [
                   /^cbd.int$/i,
                /.*\.cbd.int$/i,
                /^cbddev.xyz$/i,
             /.*\.cbddev.xyz$/i,
                 /^localhost$/i
            ];

            var url = parseUrl(unsafeUrl);

            return !!(url.hostname && _.some(trustedHosts, function(h) { return h.test(url.hostname); }));
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
