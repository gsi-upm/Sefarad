// Do grunt-related things in here
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    processhtml: {
      options: {        
      },
      dist: {
        files: {
          'build/index.html': ['src/sefarad.html']
        }
      }
    },  
  });

  // Load plugins and tasks.
  grunt.loadTasks('grunt_tasks');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-processhtml');

  // Tasks.
  

  // Default tasks. 
  grunt.registerTask('default', ['include-widgets','processhtml']);

};  