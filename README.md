gulp-jsx2example
================

[![npm version](http://img.shields.io/npm/v/gulp-jsx2example.svg)](https://www.npmjs.org/package/gulp-jsx2example)
[![npm download](http://img.shields.io/npm/dm/gulp-jsx2example.svg)](https://www.npmjs.org/package/gulp-jsx2example)

Compile JSX file to THML (react demo)

## Usage

```js
var jsx2example = require('gulp-jsx2example')

gulp.task('examples', ['clean:site'], function(){
  return gulp
    .src(['./examples/*.*'])
    .pipe(jsx2example())
    .pipe(gulp.dest('site/examples/'))
})

var webpack = require('gulp-webpack')
gulp.task('webpack', ['clean:build'], function() {
  return gulp
    .src(['./examples/*.*'])
    .pipe(webpack())
    .pipe(gulp.dest('site/examples/'))
```


```
./
├── README.md
└── examples
    ├── picker.js
    ├── simple-visible.js
    └── simple.js
```

** after **

```
./
├── README.md
├── site
│   ├── examples
│   │   ├── common.js
│   │   ├── common.js.map
│   │   ├── picker.html
│   │   ├── picker.js
│   │   ├── picker.js.map
│   │   ├── simple-visible.html
│   │   ├── simple-visible.js
│   │   ├── simple-visible.js.map
│   │   ├── simple.html
│   │   ├── simple.js
│   │   └── simple.js.map
│   └── index.html
└── examples
    ├── picker.js
    ├── simple-visible.js
    └── simple.js

```
