import { createApp } from 'vue';
import App from './App.vue';

// Core and Enterprise tiers: register your license key before the first Bryntum component is created.
// The Community tier needs no key. See the Licensing guide.
// (globalThis.bryntum ??= {}).licenseKey = 'your-license-key';

createApp(App).mount('#app');
