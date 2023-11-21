// rollup.config.js (building more than one bundle)
import path                     from 'path'
import { getBabelOutputPlugin } from '@rollup/plugin-babel';
import alias                    from '@rollup/plugin-alias';
import nodeResolve              from '@rollup/plugin-node-resolve'
import json                     from '@rollup/plugin-json';
import commonjs                 from '@rollup/plugin-commonjs';
import dynamicImportVariables   from 'rollup-plugin-dynamic-import-variables';
import vue                      from 'rollup-plugin-vue'
import copy                     from 'rollup-plugin-copy'
import { string }               from "rollup-plugin-string";
import { terser }               from 'rollup-plugin-terser';
import bootWebApp, { cdnHost }   from './app/boot.js';
import injectCssToDom           from './rollup/inject-css-to-dom';
import resolveLocalized         from './rollup/resolve-localized';
import stripBom                 from './rollup/strip-bom';
import livereload               from 'rollup-plugin-livereload'

const isWatchOn = process.argv.includes('--watch');
const outputDir = 'dist';
debugger;

let externals = [
  'require', 
];

export default async function er () {
debugger;

  externals = [...externals, ...await loadExternals()];

  return [
    bundle('boot.js')

  ];
}

function bundle(entryPoint, baseDir='app') {
debugger;
  const entryPointPath = path.join(baseDir||'', entryPoint);
  const targetDir      = path.join(`${outputDir}/${baseDir}`, path.dirname(entryPoint));

  return {
    input : entryPointPath,
    output: [{
      format   : 'amd',
      sourcemap: true,
      dir : targetDir,
      name : entryPoint.replace(/[^a-z0-9]/ig, "_"),
      exports: 'named'
    }],
    external: externals,
    plugins : [
      alias({ entries : [
        { find: /^~\/(.*)/,   replacement:`${process.cwd()}/${baseDir}/$1` },
      ]}),
      stripBom(),
      copy({
        verbose: true,
        flatten: false,
        copyOnce: isWatchOn,
        targets: [{
          src: [
            `${baseDir}/**/*.ejs`,
          ], 
          dest: path.join(targetDir) 
        }]
      }),
      string({ include: "**/*.html" }),
      json({ namedExports: true }),
      injectCssToDom(),
      vue(),
      dynamicImportVariables({ }),
      commonjs({ include: 'node_modules/**/*.js'}),
      nodeResolve({ browser: true, mainFields: [ 'browser', 'module', 'main' ] }),
      isWatchOn ? null : getBabelOutputPlugin({
        presets: [['@babel/preset-env', { targets: "> 0.25%, IE 10, not dead"}]],
        allowAllFormats: true
      }),
      isWatchOn ? null : terser({ mangle: false }), // DISABLE IN DEV
      isWatchOn ? livereload('dist') : null         // ENABLE IN DEV ONLY
    ]
  }
}

async function loadExternals() {

  const externals = [];

  //Define requireJS configuration (define() + config.paths ) as externals

  // Shim dependencies 
  const window     = { 
    location : { pathname: '/' },
    scbdApp  : { host: '' },
    alert    : () => {}
  }; 


  const defineJs   = (module) => { if(typeof(module)==='string') externals.push(module) };
  const requireJs  = ( )      => { };
  requireJs.config = (config) => { 
    const modules = [
      ...Object.keys(config.paths || {}),
      ...(config.packages || []).map(p=>p.name)
    ]
    modules.forEach(defineJs)
  }

  bootWebApp(window, requireJs, defineJs);

  return externals;
}