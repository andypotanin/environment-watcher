/**
 * Build WP-Site
 *
 * @author potanin@UD
 * @version 2.0.0
 * @param grunt
 */
module.exports = function (grunt) {

  // Automatically Load Tasks
  require('load-grunt-tasks')(grunt, {
    pattern: 'grunt-*',
    config: './package.json',
    scope: [ 'devDependencies', 'dependencies' ]
  });

  // Build Configuration.
  grunt.initConfig({

    // Get Project Package.
    package: grunt.file.readJSON('package.json'),

    haproxy: {
      options: {},
      files: {
        'dest/default_options': ['src/testing', 'src/123']
      }
    },

    watch: {
      varnish: {
        files: '/Users/andy.potanin/Repositories/dockerfiles/veneer/proxy/etc/haproxy/*.cfg',
        tasks: ['shell:restartHAProxy']
      },
      haproxy: {
        files: '/Users/andy.potanin/Repositories/dockerfiles/veneer/varnish/etc/varnish/*.vcl',
        tasks: ['shell:restartVarnish']
      }
    },

    shell: {
      restartHAProxy: {
        command: function () {
          return 'sudo kill $(pidof haproxy) && echo "Restarted HAProxy."';
        }
      },
      restartVarnish: {
        command: function () {
          return 'sudo kill $(pidof varnish) && echo "Restarted Varnish."';
        }
      }
    },

    // Symbolic Links.
    symlink: {
      production: {
        files: {
          '.htaccess': 'wp-content/plugins/wp-veneer/lib/local/.htaccess',
          'wp-config.php': 'wp-content/plugins/wp-cluster/lib/class-config.php',
          'wp-content/db.php': 'wp-content/plugins/wp-cluster/lib/class-database.php',
          'wp-content/sunrise.php': 'wp-content/plugins/wp-cluster/lib/class-sunrise.php'
        }
      },
      db: {
        files: {
          'wp-content/db.php': 'wp-content/plugins/wp-cluster/lib/class-database.php'
        }
      },
      sunrise: {
        files: {
          'wp-content/sunrise.php': 'wp-content/plugins/wp-cluster/lib/class-sunrise.php'
        }
      }
    }

  });

  grunt.registerTask('default', function () {
    console.log('Done.');
  })

};

