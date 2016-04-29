function camelize(str) {
  return str.replace(/(?:^|[-_])(\w)/g, function(_, c) {
    return c ? c.toUpperCase() : '';
  });
}

window.require = function(path) {
  var result = window;

  if (/\.(css|less)$/.test(path)) {
    return false;
  }

  var namespaces = path.split('/');
  namespaces.forEach(function(key, i) {
    if (i === 3) {
      key = camelize(key);
    };
    if (key != '@ali' && key !== 'lib') {
      if (result[key]) {
        result = result[key];
      } else {
        throw 'There should not have modules here: ' + path;
      }
    }
  });
  return result;
};


window.React = require('react')
window.ReactDOM = require('react-dom')
