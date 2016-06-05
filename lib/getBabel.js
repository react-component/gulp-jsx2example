'use strict';

module.exports = function() {
  return {
    presets: [
      'es2015',
      'react',
      'stage-0'
    ].map(function(name) {
      return require.resolve('babel-preset-' + name);
    }),
    plugins: [
      'syntax-decorators',
      'add-module-exports',
      'transform-es2015-object-super'
    ].map(function(name) {
      return require.resolve('babel-plugin-' + name);
    })
  };
};
