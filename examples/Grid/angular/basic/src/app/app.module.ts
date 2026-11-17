/**
 * App module
 */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { AppErrorHandler } from './error.handler';

import { AppComponent } from './app.component';
import { BryntumCoreModule } from '@bryntum/core-angular-community';
import { BryntumGridModule } from '@bryntum/grid-angular-community';

@NgModule({
    declarations : [
        AppComponent
    ],
    imports : [
        BryntumCoreModule,
        BrowserModule,
        BryntumGridModule
    ],
    providers : [{ provide : ErrorHandler, useClass : AppErrorHandler }],
    bootstrap : [AppComponent]
})

export class AppModule {}
