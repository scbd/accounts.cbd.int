(function(){ 'use strict';

curl.config({
    waitSeconds: 120,
    baseUrl : '/app',
    paths: {
        'async'           : 'libs/requirejs-plugins/src/async',
        'text'            : 'libs/requirejs-text/text',
        'lodash'          : 'libs/lodash/lodash.min',
        'urijs'           : 'libs/urijs/src'
    },
    plugins: {
        'text'            : 'libs/curl/src/curl/plugin/text'
    }
});

define('angular', window.angular);

curl(['angular', 'app', 'routes', 'template', 'authentication', 'providers/extended-route']).then(function (ng, app) {

    ng.element(document).ready(function () {
         ng.bootstrap(document, [app.name]);
    });
});

})();

// Fix Function.prototype.bind
Function.prototype.bind=Function.prototype.bind||function(b){if(typeof this!=="function"){throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");}var a=Array.prototype.slice,f=a.call(arguments,1),e=this,c=function(){},d=function(){return e.apply(this instanceof c?this:b||window,f.concat(a.call(arguments)));};c.prototype=this.prototype;d.prototype=new c();return d;};
// Fix IE Console
(function(a){a.console||(a.console={});for(var c="log info warn error debug trace dir group groupCollapsed groupEnd time timeEnd profile profileEnd dirxml assert count markTimeline timeStamp clear".split(" "),d=function(){},b=0;b<c.length;b++)a.console[c[b]]||(a.console[c[b]]=d)})(window); //jshint ignore:line
