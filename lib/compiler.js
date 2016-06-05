var webpack = require('webpack');
var ProgressPlugin = require('webpack/lib/ProgressPlugin');

var path = require('path');
var fs = require('fs');
var MemoryFileSystem = require('memory-fs');
var memoryFs = new MemoryFileSystem();

var merge = require('lodash.merge');
var gutil = require('gulp-util');

var defaultConfig = require('../webpack.config.js');
var tempfilePath;
  /**
   * 异步 webpack 编译代码
   * @param  {String}   code     需要编译的代码
   * @param  {Function} callback 编辑完成回调
   */
module.exports = function(code, config, callback) {
  if (code) {
    tempfilePath = Date.now().toString(32) + '.js';
    tempfilePath = path.join(config.output.path, tempfilePath);

    var tempfileRelativePath = path.resolve(config.context, tempfilePath);

    config = merge({}, defaultConfig, config, {
      entry: tempfileRelativePath
    });

    fs.writeFileSync(tempfileRelativePath, code);
  }

  var compiler = webpack(config);
  compiler.outputFileSystem = memoryFs;

  var webpackAllAssets = [];
  compiler.apply(new ProgressPlugin(function(percentage, msg) {
    var stream = process.stderr;
    if (stream.isTTY && percentage < 0.71) {
      stream.cursorTo(0);
      stream.write('📦  ' + gutil.colors.magenta(msg));
      stream.clearLine(1);
    } else if (percentage === 1) {
      console.log(gutil.colors.green('\nwebpack: bundle build is now finished.'));
    }
  }));

  compiler.run(function(err) {
    try {
      tempfilePath && fs.unlinkSync(tempfilePath);
    } catch (err) {}
    if (err) {
      return callback(err);
    }
    callback(null, webpackAllAssets);
  });

  compiler.plugin('done', function(stats) {
    if (stats.hasErrors()) {
      console.log(stats.toString({
        colors: true
      }));
    }
  });


  compiler.plugin('after-emit', function(compilation, callback) {
    Object.keys(compilation.assets).forEach(function(outname) {
      if (compilation.assets[outname].emitted) {
        var path = memoryFs.join(compiler.outputPath, outname);
        if (path.indexOf('?') !== -1) {
          path = path.split('?')[0];
        }
        var contents = memoryFs.readFileSync(path);

        webpackAllAssets.push(new gutil.File({
          base: compiler.outputPath,
          path: path,
          contents: contents
        }));
      }
    });
    callback();
  });
};

process.on('exit', function() {
  try {
    tempfilePath && fs.unlink(tempfilePath, function() {});
  } catch (err) {

  }
});
