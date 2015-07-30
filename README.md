gulp-jsx2example
================

[![npm version](http://img.shields.io/npm/v/gulp-jsx2example.svg)](https://www.npmjs.org/package/gulp-jsx2example)
[![npm download](http://img.shields.io/npm/dm/gulp-jsx2example.svg)](https://www.npmjs.org/package/gulp-jsx2example)

Compile JSX file to HTML (react demo)

## Usage

```js
return gulp
  .src(sourceFiles)
  .pipe(jsx2example(options));
```

## Options

```
{
  readme: 'README.md',      // readme file name, content will be render to index.html
  package: 'package.json',  // package file name, access repository information 
  cwd: process.cwd()
}
```

## Example
You can reference this repository `gulpfile.js`

The `examples` floder published to [http://noyobo.com/gulp-jsx2example/](http://noyobo.com/gulp-jsx2example/)

```js
var jsx2example = require('gulp-jsx2example')

gulp.task('examples', ['clean:site'], function(){
  return gulp
    .src(['./examples/*.*'])
    .pipe(jsx2example()) // jsx2example(options)
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
    ├── jsfile.js
    └── jsxfile.js
```

**after**

```
./
├── README.md
├── site
│   ├── examples
│   │   ├── common.js
│   │   ├── common.js.map
│   │   ├── jsfile.html
│   │   ├── jsfile.js
│   │   ├── jsfile.js.map
│   │   ├── jsxfile.html
│   │   ├── jsxfile.js
│   │   └── jsxfile.js.map
│   └── index.html
└── examples
    ├── jsfile.js
    └── jsxfile.js

```

## Publish

```bash
gh-pages -d site
```

> https://www.npmjs.com/package/gh-pages
