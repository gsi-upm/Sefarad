// Do grunt-related things in here
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {        
      },
      dist: {
        src: ['src/sefarad.html', 'src/knockout_templates/templates.html'],
        dest: 'bin/index.html',
      },
    },
  });

  // Load plugins and tasks.
  //grunt.task.loadTasks('tasksPath');
  grunt.loadNpmTasks('grunt-contrib-concat');

  // Default task(s).
  grunt.registerTask('default', ['concat']);

  // Custom tasks.
  // grunt.registerTask('default', 'Custom task.', function() {
  //   grunt.log.write('Example custom task...').ok();
  // });

};  