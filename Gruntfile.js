module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    copy: {
      build: { files: [{ expand: true, src: ['src/**'], dest: 'tmp/' }] }
    },
    concat: {
      build: {
        src: ['legacy/notifier.js'],
        dest: 'tmp/src/legacy-notifier.js'
      }
    },
    bower: {
      dist: {
        dest: 'tmp/bower'
      }
    },
    browserify: {
      dist: {
        src: ['tmp/src/main.js'],
        dest: 'tmp/dist/<%= pkg.name %>.js'
      }
    },
    template: {
      options: {
        data: { pkg: grunt.file.readJSON('package.json') }
      },
      dist: {
        files: {
          'dist/<%= pkg.name %>.js': 'tmp/dist/<%= pkg.name %>.js'
        }
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'dist/<%= pkg.name %>.min.js': ['dist/<%= pkg.name %>.js']
        }
      }
    },
    jshint: {
      files: ['gruntfile.js', 'src/**/*.js'],
      options: {
        // options here to override JSHint defaults
        globals: {
          jQuery: true,
          console: true,
          module: true,
          document: true
        }
      }
    },
    watch: {
      files: ['<%= jshint.files %>', 'test/**/*.coffee'],
      tasks: ['test']
    },
    connect: {
      server: {
        options: {
          hostname: '*',
          port: 9001,
          base: '.',
          keepalive: true
        }
      }
    },
    mochacli: {
      all: ['test/**/*.coffee'],
      options: {
        compilers: [ 'coffee:coffee-script' ],
        files: 'test/**/*.coffee',
        bail: true,
        reporter: 'spec'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-bower');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-template');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-mocha-cli');

  grunt.registerTask('test', ['mochacli', 'jshint']);

  grunt.registerTask('build', ['copy', 'bower', 'concat', 'browserify', 'template', 'uglify']);
  grunt.registerTask('serve', ['connect']);
  grunt.registerTask('default', ['build']);

};
