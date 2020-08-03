import React, { useState, useEffect } from 'react';
import * as serviceWorker from './serviceWorker';
import Alert from 'react-bootstrap/Alert';
import { ExclamationTriangle } from 'react-bootstrap-icons';


export const ServiceWorkerWrapper = () => {
    const [showReload, setShowReload] = useState(false);
    const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);

    const onSWUpdate = (registration: ServiceWorkerRegistration) => {
        setShowReload(true);
        setWaitingWorker(registration.waiting);
    };

    useEffect(() => {
        serviceWorker.register({ onUpdate: onSWUpdate });
    }, []);

    const reloadPage = () => {
        waitingWorker?.postMessage({ type: 'SKIP_WAITING' });
        setShowReload(false);
        window.location.reload(true);
    }

    return (
        <Alert
            show={showReload}
            variant="primary"
            className="alert-global">
                <ExclamationTriangle />&nbsp;&nbsp;
                A new version of TacoTab is available! <Alert.Link onClick={reloadPage}>Click to reload.</Alert.Link>
        </Alert>
    );
}