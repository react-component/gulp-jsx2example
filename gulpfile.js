var jsx2example = require('./index.js')
var webpack = require('gulp-webpack')
var named = require('vinyl-named')

var gulp = require('gulp')

gulp.task('default', function() {
  gulp.start(['site'])
})

gulp.task('site', function() {
  return gulp
    .src(['./examples/*.*'])
    .pipe(jsx2example())
    .pipe(gulp.dest('./site/examples'))
})
