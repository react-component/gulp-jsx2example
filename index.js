'use strict';

var path = require('path');
var fs = require('fs');
var through2 = require('through2');
var gutil = require('gulp-util');
var merge = require('lodash.merge');
var uniq = require('lodash.uniq');
var matchRequire = require('match-require');

var xrender = require('./lib/xtpl');
var markdown = require('./lib/markdown');
var webpackCompiler = require('./lib/compiler.js');
var codeTempelte = require('./lib/code-templete.js');

var cwd = process.cwd();
var pkg = require(path.join(cwd, 'package.json'));
var srcPath = new RegExp('(["\']' + pkg.name + ')\/src\/', 'g');
var lessPath = new RegExp('(["\']' + pkg.name + ')\/assets\/([^.\'"]+).less', 'g');

function replaceSrcToLib(modName) {
  return modName.replace(srcPath, function(m, m1) {
    return m1 + '/lib/';
  }).replace(lessPath, function(m, m1, m2) {
    return m1 + '/assets/' + m2 + '.css';
  });
}

module.exports = function(options) {
  var requireModules = ['react', 'react-dom'];
  var opts = merge({
    readme: 'README.md',
    package: 'package.json',
    cwd: process.cwd()
  }, options || {});

  var filesName = [];
  var packagePath = path.join(opts.cwd, opts.package);
  var readmePath = path.join(opts.cwd, opts.readme);

  var packageInfo = {};
  var fileCwd, fileBase;

  if (fs.existsSync(packagePath)) {
    packageInfo = require(packagePath);
  }
  if (!fs.existsSync(readmePath)) {
    readmePath = '';
  }

  function jsx2example(chunk, enc, cb) {
    if (chunk.isNull()) {
      return cb(null, chunk);
    }

    if (chunk.isStream()) {
      return cb(new gutil.PluginError('gulp-jsx2example', 'Streaming not supported'));
    }

    var extName = path.extname(chunk.path);
    var basename = path.basename(chunk.path, extName);

    if (extName !== '.js' && extName !== '.jsx') {
      return cb(null, chunk);
    }

    if (!fileCwd) {
      fileCwd = chunk.cwd;
    }

    if (!fileBase) {
      fileBase = chunk.base;
    }


    var source = chunk.contents.toString();

    source = replaceSrcToLib(source);

    var fileSuffix = extName.substr(1);

    if (fileSuffix === 'jsx') {
      fileSuffix = 'js';
    }

    try {
      var deps = matchRequire.findAll(source);
      var ideps = matchRequire.findAllImports(source);
      Array.prototype.push.apply(requireModules, deps);
      Array.prototype.push.apply(requireModules, ideps);
    } catch (e) {
      return cb(e);
    }

    var css = '';
    var hasCss = false;

    requireModules.some(function(item) {
      if (/\.(css|less)$/.test(item)) {
        hasCss = true;
      }
    });

    if (hasCss) {
      css += '<link rel="stylesheet" href="common.css" />';
    }

    var fastclick = true;

    try {
      fastclick = require.resolve('fastclick');
    } catch (e) {
      fastclick = false;
    }

    var renderData = merge(packageInfo, {
      fastclick: fastclick,
      _app: basename + '.js',
      _common: 'common.js',
      _css: css,
      _code: source
    });

    var exampleHtml = xrender(renderData);

    chunk.contents = new Buffer(exampleHtml);
    chunk.path = chunk.path.replace(/\.(js|jsx)$/, '.html');

    filesName.push({
      name: basename,
      url: path.relative(fileCwd, chunk.path)
    });
    gutil.log(gutil.colors.green('create html file:'), basename + '.html');

    this.push(chunk);
    cb();
  }

  function getAlias() {
    var alias = {};

    alias[pkg.name] = cwd;

    return alias;
  }

  return through2({
    objectMode: true
  }, jsx2example, function(done) {
    requireModules = uniq(requireModules);

    gutil.log('import modules:', requireModules);

    var indexData = {
      _list: filesName
    };
    if (readmePath) {
      indexData._readme = markdown(readmePath);
    }

    indexData = merge(packageInfo, indexData);
    var indexHtml = xrender(indexData, 'index');

    var indexFile = new gutil.File({
      cwd: fileCwd,
      base: fileBase,
      path: 'index.html',
      contents: new Buffer(indexHtml)
    });
    this.push(indexFile);

    var exampleIndex = new gutil.File({
      cwd: fileCwd,
      base: fileBase,
      path: 'examples/index.html',
      contents: new Buffer('<script>location.href="../";</script>')
    });
    var self = this;
    self.push(exampleIndex);

    var commonJS = codeTempelte(requireModules);

    webpackCompiler(commonJS, {
      context: opts.cwd,
      resolve: {
        root: opts.cwd,
        alias: getAlias()
      },
      output: {
        path: opts.cwd,
        filename: 'common.js'
      }
    }, function(err, files) {
      for (var i = 0; i < files.length; i++) {
        var file = files[i];
        self.push(file);
      }
      done();
    });
  });
};
