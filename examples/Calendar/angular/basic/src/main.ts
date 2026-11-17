import { ErrorHandler } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { AppErrorHandler } from './app/error.handler';

// Core and Enterprise tiers: register your license key before the first Bryntum component is created.
// The Community tier needs no key. See the Licensing guide.
// (globalThis.bryntum ??= {}).licenseKey = 'your-license-key';

bootstrapApplication(App, {
    providers : [
        // Surface errors instead of letting Angular swallow them (relied on by the Bryntum examples framework)
        { provide : ErrorHandler, useClass : AppErrorHandler }
    ]
}).catch(err => console.error(err));
