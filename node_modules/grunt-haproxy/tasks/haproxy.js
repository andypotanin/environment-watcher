/*
 * grunt-haproxy
 * https://github.com/UsabilityDynamics/grunt-haproxy
 *
 * Copyright (c) 2014 Andy Potanin
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  var spawn = require('child_process').spawn;

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('haproxy', 'Haproxy handler.', function() {

    // console.log( 'haproxy' );

    var done = this.async();
    var fs = require('fs');

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      punctuation: '.',
      separator: ', '
    });

    // sudo haproxy -f /etc/haproxy/apache-proxy.cfg

    // Iterate over all specified file groups.
    this.files.forEach(function(f) {

      var _restart;

      // Concat specified files.
      var src = f.src.filter(function(filepath) {

        var _path  = require( 'path' ).resolve( require( 'path' ).dirname( __dirname ) , filepath );

        if (fs.existsSync(f.dest[0])) {

          try {

            var pid = fs.readFileSync( f.dest[0], 'utf8' );

            process.kill( pid );

            fs.unlinkSync( f.dest[0] );

            _restart = true;


          } catch( error ) {
            //console.error( error );
          }

        }

        var _instance = spawn( 'haproxy', [
          '-f ', _path,
          '-p ', f.dest[0],
          '-D'
        ], {
          detached: true
        });

        _instance.stdout.on('data', function (data) {
          console.log(data);
        });

        _instance.stderr.on('data', function (data) {
          console.log('ps stderr: ' + data);
        });

        _instance.on('close', function (code) {

          //grep.stdin.end();

          console.log( 'Started', _instance.pid, f.dest, code );

          if( _restart ) {
            grunt.task.run( [ 'notify:haproxyReloaded' ] );
          } else {
            grunt.task.run( [ 'notify:haproxyStarted' ] );
          }

          done();

          if (code !== 0) {
            console.log('ps process exited with code ' + code);
          }

          //grunt.task.run( [ 'notify:haproxyFailed' ] );

          //done();

        });

      });


    });


  });

};
