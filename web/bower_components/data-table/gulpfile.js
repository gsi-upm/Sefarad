var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var clean = require('gulp-clean');
var livereload = require('gulp-livereload');
var serve = require('gulp-serve');
var streamify  = require('gulp-streamify');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var name = 'data-table';

gulp.task('clean-dist', function () {
  gulp.src('dist', { read: false })
    .pipe(clean());
});

gulp.task('browserify', function () {
  return browserify('./src/initializer.js')
    .bundle({ debug: true })
    //Pass desired output filename to vinyl-source-stream
    .pipe(source(name + '.js'))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('dist', function () {
  gulp.src('./dist/data-table.js')
    .pipe(streamify(uglify()))
    .pipe(rename(name + '.min.js'))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('serve', serve(['test', 'dist', 'bower_components']));

gulp.task('dev', function() {
  var server = livereload();

  gulp.start('default');
  gulp.start('serve');
  gulp.watch('./src/**/*.{js,hbs}', ['browserify']);
  gulp.watch('dist/*.js').on('change', function(file) {
    server.changed(file.path);
  });
});

gulp.task('default', ['clean-dist', 'browserify']);

