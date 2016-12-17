/* eslint-disable */
var ghpages = require('gh-pages');
var path = require('path');
var assert = require('assert');
var pkg = require('./package.json');

assert(pkg.repository.type === 'git', 'pkg.repository.git 必须为 git');
assert(pkg.repository.url, '不存在仓库地址! 请补全 pkg.repository.url 信息');

ghpages.publish(path.join(__dirname, 'site') + '/', {
  depth: 1,
  branch: 'gh-pages',
  repo: pkg.repository.url,
  message: pkg.version + ' Updates',
  logger: function(message) {
    console.log(message);
  }
}, function(err) {
  if (err) {
    console.log(err);
  } else {
    console.log('发布完毕!');
  }
});
