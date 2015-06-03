/* jshint node:true */
module.exports = function(grunt) { 'use strict';

    // load all grunt tasks matching the ['grunt-*', '@*/grunt-*'] patterns
    require('load-grunt-tasks')(grunt);

    // Project configuration.
    grunt.initConfig({

        bower: {
            install: {
                options : {
                    targetDir : "./app/libs",
                    cleanTargetDir : true,
                    install : true,
                    copy : true,
                    bowerOptions : {
                        production : true
                    }
                }
             }
        },

        copy : {
            dist : {
                files : [{ //for glyph icons
                    expand: true,
                    dot: true,
                    cwd: 'bower_components/bootstrap-duallistbox/bootstrap/fonts/',
                    src: ['*.*'],
                    dest: 'app/libs/fonts'
                }, { //for font-awesome
                    expand: true,
                    dot: true,
                    cwd: 'bower_components/font-awesome/fonts/',
                    src: ['*.*'],
                    dest: 'app/libs/fonts'
                }]
            }
        }
    });

    grunt.registerTask('default',    ['bower', 'copy']);
};
