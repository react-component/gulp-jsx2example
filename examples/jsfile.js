var React =  require('react');
var ReactDOM = require('react-dom');
var My = require('gulp-jsx2example/src/xx');

ReactDOM.render(
  <div className="a">
    Hello jsx2example
    <My />
  </div>,
  document.getElementById('__react-content')
);
