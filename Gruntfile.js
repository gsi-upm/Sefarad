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
  grunt.loadTasks("./grunt_tasks");
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-processhtml');

  // Tasks.
  grunt.registerTask('include-widgets', function() {
    // var fs = require('fs');

    // var widgetsPath = 'src/js/widgets';
    // var sourceFile = 'src/_sefarad.html';
    // var destinationFile = 'src/sefarad.html';

    // // Update widgets to the html file.
    // var string1 = '';
    // var string2 = '\t\t<script type="text/javascript">\n\t\t\tvar widgetX = [';

    // fs.readdir(widgetsPath, function (err, files) {
    //   if (err) {
    //     console.log(err);
    //   } else {
    //     //console.log(files.toString());
    //     for (var i = 0; i < files.length; i++) {
    //       string1 += '\t\t<script type="text/javascript" src="js/widgets/' + files[i] + '"></script>\n';
    //       string2 += files[i].substring(0, files[i].length - 3) + ', ';
    //     }
        
    //     string2 = string2.substring(0, string2.length - 2);
    //     string2 += '];\n\t\t</script>\n\t';

    //     updateHTML();
    //   }
    // });

    // var updateHTML = function() {
    //   var finalString = '';
    //   fs.readFile(sourceFile, function (err, data) {
    //     if (err) {
    //       console.log(err);
    //     } else {
    //       var headPosition = data.toString().indexOf('<head>') + '<head>'.length + 1;
    //       //console.log(headStart);
    //       finalString += data.toString('utf8', 0, headPosition);
    //       finalString += string1;
    //       finalString += string2;
    //       finalString += data.toString('utf8', headPosition+1, data.length);
    //       //console.log(finalString);

    //       fs.writeFile (destinationFile, finalString, function(err) {
    //         if (err) {
    //           console.log(err);
    //         }
    //         console.log('Widgets actualizados.');
    //       })
     
    //     }
    //   });
    // }
  });

  // Default tasks. 
  grunt.registerTask('default', ['include-widgets','processhtml']);

};  