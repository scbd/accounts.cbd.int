module.exports = function (grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg      : grunt.file.readJSON('package.json'),
    // autoprefixer: {
    //   options    : {
    //     browsers: ['> 1%']
    //   },
    //   single_file: {
    //     options: {
    //       // Target-specific options go here.
    //     },
    //     src    : 'assets/css/main.css',
    //     dest   : 'assets/css/main.css'
    //   }
    // },
    sass: {
      main: {
        options: {
          bundleExec: true,
          require: [
            './source/sass/sass_extensions.rb',
            'sass-globbing'
          ]
        },
        files: [
          {
            expand: true,
            cwd: 'source/sass/',
            src: ['*.scss', '!_*.scss'],
            dest: 'assets/css/',
            ext: '.css'
          }
        ]
      }
    },
    copy     : {
      main: {
        files: [
          {
            expand: true,
            cwd   : 'app/directives/',
            src   : ['**/*'],
            dest  : 'app_build/directives'
          },
          {
            expand: true,
            cwd   : 'app/views/',
            src   : ['**/*'],
            dest  : 'app_build/views'
          },
          {
            expand: true,
            cwd   : 'app/',
            src   : ['template.html', 'template.html.js'],
            dest  : 'app_build/'
          },
          {
            expand: true,
            cwd   : 'app/libs/',
            src   : ['**/*'],
            dest  : 'app_build/libs/'
          },
          {
            expand: true,
            cwd   : 'app/img/',
            src   : ['**/*'],
            dest  : 'app_build/img/'
          }
        ]
      }
    },
    csso: {
      compress: {
        options: {
          report: 'min'
        },
        files: {
          'app_build/css/main.css': ['app/css/main.css']
        }
      }
    },
    requirejs: {
      compile: {
        options: {
          "mainConfigFile"  : "app/js/boot.js",
          "baseUrl"         : "app/js",
          "dir"             : "app_build/js",
          "modules"         : [{
            "name": "boot"
          },{
            "name": "main"
          }],
          "optimize"        : "uglify",
          "skipDirOptimize" : true,
          "wrap"            : true,
          "removeCombined"  : true
        }
      }
    },
    uglify   : {
      main: {
        options: {
          mangle          : false,
          report          : 'min',
          sourceMappingURL: './source-map.js',
          sourceMap       : 'app_build/js/source-map.js'
        },
        files  : {
          //'app_build/js/main.js': ['app_build/js/main-src.js']
        }
      }
    },
    css: {
      compile: [/*'sass', */'autoprefixer'],
      compress: ['csso']
    },
    bower: {
      install: {
        //just run 'grunt bower:install' and you'll see files from your Bower packages in lib directory
      }
    }
  });

  //grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-csso');
  //grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-bower-task');

  // register css task to have option to separate styles compilation and build
  grunt.registerMultiTask('css', function () {
    grunt.task.run(this.data);
  });

  grunt.registerTask('build-js', ['bower', 'copy', 'requirejs', 'uglify']);
  grunt.registerTask('build-css', ['css']);
  grunt.registerTask('build', ['build-js', 'build-css']);

  grunt.registerTask('default', ['build']);

};