var jsx2example = require('../index.js')

var gulp = require('gulp')

gulp.task('default', function () {
  return gulp
    .src(['./examples/*.*'])
    .pipe(jsx2example())
    .pipe(gulp.dest('./build/examples'))
})
