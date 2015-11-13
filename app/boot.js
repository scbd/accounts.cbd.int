(function(){ 'use strict';

require.config({
    waitSeconds: 120,
    baseUrl : '/app',
    paths: {
        'angular'         : 'libs/angular-flex/angular-flex',
        'ngRoute'         : 'libs/angular-route/angular-route.min',
        'async'           : 'libs/requirejs-plugins/src/async',
        'text'            : 'libs/requirejs-text/text',
        'jquery'          : 'libs/jquery/dist/jquery.min',
        'bootstrap'       : 'libs/bootstrap/dist/js/bootstrap.min',
        'lodash'          : 'libs/lodash/lodash.min',
        'urijs'           : 'libs/urijs/src'
    },
    shim: {
        'libs/angular/angular.min' : { deps: ['jquery'] },
        'angular'                  : { deps: ['libs/angular/angular.min'] },
        'ngRoute'                  : { deps: ['angular'] },
        'bootstrap'                : { deps: ['jquery' ] }
    }
});

require(['angular', 'app', 'bootstrap', 'routes', 'template'], function (ng, app) {

    ng.element(document).ready(function () {
         ng.bootstrap(document, [app.name]);
    });
});

})();

Function.prototype.bind=Function.prototype.bind||function(b){if(typeof this!=="function"){throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");}var a=Array.prototype.slice,f=a.call(arguments,1),e=this,c=function(){},d=function(){return e.apply(this instanceof c?this:b||window,f.concat(a.call(arguments)));};c.prototype=this.prototype;d.prototype=new c();return d;};
