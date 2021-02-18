import * as ReactDOM from 'react-dom';
import * as React from 'react';
import * as Root from './root';

// import 'nes.css/css/nes.min.css';
import './index.css';

ReactDOM.render(
  <React.StrictMode>
    <Root.Component />
  </React.StrictMode>,
  document.getElementById('root')
);
