import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Core and Enterprise tiers: register your license key before the first Bryntum component is created.
// The Community tier needs no key. See the Licensing guide.
// (globalThis.bryntum ??= {}).licenseKey = 'your-license-key';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
