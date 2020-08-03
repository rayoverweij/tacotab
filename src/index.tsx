import React from 'react';
import ReactDOM from 'react-dom';
import './custom.scss';
import './index.scss';
import App from './App';
import { ServiceWorkerWrapper } from './ServiceWorkerWrapper';


ReactDOM.render(
    <React.StrictMode>
        <ServiceWorkerWrapper />
        <App />
    </React.StrictMode>,
    document.getElementById('root')
);
