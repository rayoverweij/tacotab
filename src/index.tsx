import React from 'react';
import ReactDOM from 'react-dom';
import './custom.scss';
import './index.scss';
import App from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root')
);

serviceWorker.register();

// serviceWorker.register({
//     onUpdate: (registration: ServiceWorkerRegistration) => {
//         document.getElementById("alert-new-version-available")?.classList.add("show");
//         if( registration && registration.waiting ) {
//             registration.waiting.postMessage({type: 'SKIP_WAITING '});
//         }
//         window.location.reload(true);
//     }
// });
