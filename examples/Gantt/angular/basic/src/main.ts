import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

// Core and Enterprise tiers: register your license key before the first Bryntum component is created.
// The Community tier needs no key. See the Licensing guide.
// (globalThis.bryntum ??= {}).licenseKey = 'your-license-key';

if (environment.production) {
    enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
    .catch(err => console.error(err));
