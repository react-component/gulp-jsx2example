import React from 'react';
import ReactDOM from 'react-dom';

import Picker from 'rmc-picker';

import 'rmc-picker/assets/index.css';

let items: Object[] = [];

for (var i = 0; i < 10; i++) {
  items.push({
    value: String(i),
    label: String(i * 2)
  });
}

ReactDOM.render(
  <Picker>
    {items}
  </Picker>
  , mountNode
);


interface LabelledValue {
    label: string;
}

function printLabel(labelledObj: LabelledValue) {
    console.log(labelledObj.label);
}

let myObj = {size: 10, label: "Size 10 Object"};
printLabel(myObj);
