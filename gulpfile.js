var jsx2example = require('./index.js');

var gulp = require('gulp');

gulp.task('default', function() {
  gulp.start(['site']);
});

gulp.task('site', function() {
  return gulp
    .src(['./examples/*.*'])
    .pipe(jsx2example({
      production: true,
      externalReact: true
    }, function updateWebpackConfig(webpackConfig) {
      console.log(webpackConfig);
      return webpackConfig;
    }))
    .pipe(gulp.dest('./site/examples'));
});
