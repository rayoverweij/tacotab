import React from 'react';
import ReactDOM from 'react-dom';
import './custom.scss';
import './index.scss';
import App from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
serviceWorker.register();