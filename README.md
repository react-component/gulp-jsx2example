gulp-jsx2example
================

[![npm version](http://img.shields.io/npm/v/gulp-jsx2example.svg)](https://www.npmjs.org/package/gulp-jsx2example)
[![npm download](http://img.shields.io/npm/dm/gulp-jsx2example.svg)](https://www.npmjs.org/package/gulp-jsx2example)

Compile JSX file to HTML (REPL)

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

The `examples` floder published to [http://react-component.github.io/gulp-jsx2example/](http://react-component.github.io/gulp-jsx2example/)

```js
var jsx2example = require('gulp-jsx2example')

gulp.task('examples', ['clean:site'], function(){
  return gulp
    .src(['./examples/*.*'])
    .pipe(jsx2example()) // jsx2example(options)
    .pipe(gulp.dest('site/examples/'))
})
```


```
./
examples
├── es6module.jsx
├── jsfile.js
└── jsxfile.jsx
```

**after**

```
./
site
├── examples
│   ├── common.css
│   ├── common.js
│   ├── es6module.html
│   ├── index.html
│   ├── jsfile.html
│   └── jsxfile.html
└── index.html
examples
├── es6module.jsx
├── jsfile.js
└── jsxfile.jsx

```

## Publish

```bash
gh-pages -d site
```

> https://www.npmjs.com/package/gh-pages
