/*
 * grunt-haproxy
 * https://github.com/UsabilityDynamics/grunt-haproxy
 *
 * Copyright (c) 2014 Andy Potanin
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Automatically Load Tasks.
  require( 'load-grunt-tasks' )( grunt, {
    pattern: 'grunt-*',
    config: './package.json',
    scope: 'devDependencies'
  });

  // Project configuration.
  grunt.initConfig({

    // Get Project Package.
    package: grunt.file.readJSON( 'package.json' ),

    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp']
    },

    // Configuration to be run (and then tested).
    haproxy: {
      options: {
        check: false
      },
      wamp: {
        src: [ 'test/fixtures/haproxy-wamp.cfg' ],
        dest: [ '/var/run/haproxy-wamp.pid' ]
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    },

    watch: {
      haproxy: {
        files: 'test/fixtures/*.cfg',
        tasks: 'haproxy'
      }
    },

    // Notification.
    notify: {
      options: {
        title: "HAProxy",
        enabled: true,
        max_jshint_notifications: 3
      },
      haproxyStarted: {
        options: {
          message: 'Haproxy started.'
        }
      },
      haproxyFailed: {
        options: {
          message: 'Haproxy failed to start.'
        }
      },
      haproxyReloaded: {
        options: {
          message: 'Haproxy reloaded.'
        }
      },
      haproxyStopped: {
        options: {
          message: 'Haproxy stopped.'
        }
      }
    }


  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'haproxy', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['haproxy']);

};
