var jsx2example = require('./index.js')
var webpack = require('gulp-webpack')
var named = require('vinyl-named')

var gulp = require('gulp')

gulp.task('default', function() {
  gulp.start(['site', 'webpack'])
})

gulp.task('site', function() {
  return gulp
    .src(['./examples/*.*'])
    .pipe(jsx2example())
    .pipe(gulp.dest('./site/examples'))
})

gulp.task('webpack', function() {
  return gulp
    .src(['./examples/*.*'])
    .pipe(named())
    .pipe(webpack({
      devtool: "#source-map",
      module: {
        loaders: [{
          test: /\.jsx$/,
          exclude: /node_modules/,
          loader: 'babel'
        }, {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel'
        }]
      },
      plugins: [
        new webpack.webpack.optimize.CommonsChunkPlugin("common.js")
      ]
    }))
    .pipe(gulp.dest('site/examples/'))
})
