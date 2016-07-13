'use strict';

var fs = require('fs');
var gutil = require('gulp-util');
var merge = require('lodash.merge');
var uniq = require('lodash.uniq');
var matchRequire = require('match-require');
var path = require('path');
var through2 = require('through2');

var codeTempelte = require('./lib/code-templete.js');
var webpackCompiler = require('./lib/compiler.js');
var markdown = require('./lib/markdown');
var xrender = require('./lib/xtpl');

var colors = gutil.colors;
var cwd = process.cwd();
var pkg = require(path.join(cwd, 'package.json'));
var jsx2examplePkg = require(path.join(__dirname, 'package.json'));

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
    cwd: process.cwd(),
    production: false
  }, options || {});

  for (var key in opts) {
    gutil.log(colors.magenta(jsx2examplePkg.name), key, ':', opts[key]);
  }

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
    var baseName = path.basename(chunk.path, extName);
    var dirName = path.dirname(chunk.path);

    if (
      extName !== '.js' && extName !== '.jsx' &&
      extName !== '.ts' && extName !== '.tsx'
    ) {
      return cb(null, chunk);
    }

    if (!fileCwd) {
      fileCwd = chunk.cwd;
    }

    if (!fileBase) {
      fileBase = chunk.base;
    }


    var source = chunk.contents.toString();

    if (opts.production) {
      source = replaceSrcToLib(source);
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
      _app: baseName + '.js',
      _common: 'common.js',
      _css: css,
      _code: source,
      _extName: extName.substr(1),
      opts: opts,
      jsx2examplePkg: jsx2examplePkg
    });

    var exampleHtml = xrender(renderData);

    chunk.contents = new Buffer(exampleHtml);

    chunk.path = path.join(dirName, baseName + '.html');

    filesName.push({
      name: baseName,
      url: path.relative(fileCwd, chunk.path)
    });
    gutil.log(colors.magenta(jsx2examplePkg.name), colors.green('create html file:'), baseName + '.html');

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

    var webpackConfig = {
      context: opts.cwd,
      resolve: {
        root: opts.cwd,
        alias: getAlias()
      },
      output: {
        path: opts.cwd,
        filename: '[name].js'
      }
    };

    if (opts.externalReact) {
      webpackConfig.externals = {
        'react': 'window.React',
        'react-dom': 'window.ReactDOM'
      };
    }

    webpackCompiler(commonJS, webpackConfig, function(err, files) {
      if (err) {
        console.log(err);
        done(new Error(err));
      }
      for (var i = 0; i < files.length; i++) {
        var file = files[i];
        self.push(file);
      }
      done();
    });
  });
};
