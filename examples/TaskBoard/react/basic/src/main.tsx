import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

// Core and Enterprise tiers: register your license key before the first Bryntum component is created.
// The Community tier needs no key. See the Licensing guide.
// (globalThis.bryntum ??= {}).licenseKey = 'your-license-key';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App />
    </StrictMode>
);
