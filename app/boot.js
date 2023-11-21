export const cdnHost = 'https://cdn.jsdelivr.net/'

export const bundleUrls = {
    angularBundle : [ 
        'npm/jquery@2.2.4/dist/jquery.min.js',
        'npm/angular@1.7.4/angular.min.js',
        'gh/scbd/angular-flex/angular-flex.min.js',
        'npm/angular-route@1.7.4/angular-route.min.js',
        'npm/angular-cookies@1.7.4/angular-cookies.min.js',
        'npm/angular-sanitize@1.7.4/angular-sanitize.min.js',
        'npm/angular-animate@1.7.4/angular-animate.min.js',
        'npm/angular-aria@1.7.4/angular-aria.min.js',
        'npm/angular-cache@4.6.0/dist/angular-cache.min.js',
        'npm/lodash@4.17.15/lodash.min.js',
        'npm/requirejs@2.2.0/require.js'
    ].join(','),
    angularDependencies: [
        'npm/ngSmoothScroll@2.0.1/dist/angular-smooth-scroll.min.js',
    ].join(','),
    initialCss: [
        'npm/bootstrap@3.3.6/dist/css/bootstrap.min.css',     
        // 'npm/font-awesome@4.4.0/css/font-awesome.min.css' 
    ].join(','),
}
export default function bootApp(window, require, defineX) {

    const document =  window.document||{};

    var appVersion = '';
    if((document||{}).documentElement)
        appVersion = (((document||{}).documentElement||{}).attributes['app-version']||{}).value;

    require.config({
        baseUrl : 'app/',
        'paths': {
            'css'                       : cdnHost + 'npm/require-css@0.1.8/css.min',
            'text'                      : cdnHost + 'npm/requirejs-text@2.0.15/text',
            'json'                      : cdnHost + 'npm/requirejs-plugins@1.0.2/src/json',
            'async'                     : cdnHost + 'npm/requirejs-text@1.0.2/lib/async',
            'domReady'                  : cdnHost + 'npm/requirejs-domready@2.0.1/domReady',
            'vueFile'                   : cdnHost + 'npm/requirejs-vue@1.1.5/requirejs-vue',
            'shim'                      : cdnHost + 'gh/zetlen/require-shim@master/src/shim',

            // 'angular-vue'               : `${cdnHost}npm/@scbd/angular-vue@4.0.0/dist/index.min`,
            'bootstrap-duallistbox'     : `${cdnHost}gh/istvan-ujjmeszaros/bootstrap-duallistbox@2.1.1/bootstrap-duallistbox/jquery.bootstrap-duallistbox`
            
        },
        'shim': {
            'angular-flex'                  : { 'deps': ['angular'] },
            // 'angular-vue'                   : { 'deps': ['angular', 'vue']},
            'vueFile'                       : { 'deps': ['vue']},
            
        },
        // urlArgs: 'v=' + appVersion
        urlArgs: function(id, url) {

            // console.log(id)
            const hasHash  = (o)=> /-[a-f0-9]{8}$/i.test(o);
        
            if(hasHash(id))   return '';
            if(id.startsWith('http')) return '';
        
            const sep = url.indexOf('?') === -1 ? '?' : '&';
            return `${sep}v=${encodeURIComponent(appVersion)}`;
        }
    });
    //

    const noop = ()=>warnImport
    const warnImport = ()=>{ console.warn('lib loaded in bundle, import not required!'); }

    defineX('angular'              , ['bootstrap'],() =>window.angular);
    defineX('angular-flex'         , ['angular'], (ng)=>{ warnImport(); return ng; });
    defineX('angular-route'        , ['angular'], (ng)=>{ warnImport(); return ng; });
    defineX('angular-cookies'      , ['angular'], (ng)=>{ warnImport(); return ng; });
    defineX('angular-sanitize'     , ['angular'], (ng)=>{ warnImport(); return ng; });
    defineX('angular-animate'      , ['angular'], (ng)=>{ warnImport(); return ng; });
    defineX('angular-cache'        , ['angular'], (ng)=>{ warnImport(); });
    
    defineX('angular-dependencies' , ['angular', `${cdnHost}combine/${bundleUrls.angularDependencies}`], (ng)=>{ warnImport(); });
    
    defineX('lodash',   [], ()=>window._);
    defineX('bootstrap',[cdnHost + 'npm/bootstrap@3.3.6/dist/js/bootstrap.js'], (boostrap)=>{ return boostrap;});
    defineX('jquery',   [],()=>window.$);
    
    defineX('externalCss', [], ()=>warnImport)
    
    defineX('vue', ['Vue'],                              function(Vue){ return Vue; });
    defineX('Vue', [cdnHost+'npm/vue@2.6.12/dist/vue.min.js'], function(Vue){
        window.Vue = Vue;
        Vue.config.devtools = true;
        
        return Vue;
    })

    if(document?.documentElement) { // BOOT App
        const deps = [
          import('angular'),
          import('./app'),
          import('./template'),
          import(`./routes`),
          import('~/factories/host-that-sends')
        ];
    
        Promise.all(deps).then(([ng, { default: app }]) => {            
          ng.element(document).ready(function () {
            ng.bootstrap(document, [app.name]);
          });
        }).catch((e)=>{ 
            console.error('Error bootstrapping the app:', e) 
        });
      } 


}

