module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      all: ['Gruntfile.js', 'src/*.js']
    },
    copy: {
      main: {
        files: [
          { expand: false, src: 'src/SlackEmojiForLimeChat.js', dest: 'dist/RenameMe.js' },
          { expand: false, src: 'src/SlackEmojiForLimeChat.js', dest: 'example/HipLight.js' },
        ]
      }
    },
    watch : {
        scripts : {
            files : ['src/*.js'],
            tasks : ['default']
        }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.registerTask('default', ['jshint', 'copy']);
};