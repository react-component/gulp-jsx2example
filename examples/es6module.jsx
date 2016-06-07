import React from 'react';
import ReactDOM from 'react-dom';

import {Button} from 'antd';

require('antd/dist/antd.less');

class App extends React.Component {
  render() {
    return (
      <div>
        <Button type="primary">主按钮</Button>
        <Button>次按钮</Button>
        <Button type="ghost">幽灵按钮</Button>
        <Button type="dashed">虚线按钮</Button>
      </div>
    )
  }
}

ReactDOM.render(
  <App />
  , mountNode);
