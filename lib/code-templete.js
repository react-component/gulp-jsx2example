var fs = require('fs');
var path = require('path');

var globalScript = fs.readFileSync(
  path.join(__dirname, '../static/global.js')
).toString();

module.exports = function(deps) {
  var code = [globalScript];

  for (var i = 0; i < deps.length; i++) {
    var dep = deps[i];
    if (/\.(less|css)$/.test(dep)) {
      code.push('require("' + dep + '");');
    } else {
      code.push('window["' + dep + '"] = require("' + dep + '");');
    }
  }

  return code.join('\n');
};
