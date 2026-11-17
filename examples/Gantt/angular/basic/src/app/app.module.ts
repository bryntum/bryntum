/**
 * App module
 */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { AppErrorHandler } from './error.handler';

import { BryntumCoreModule } from '@bryntum/core-angular-community';
import { BryntumGridModule } from '@bryntum/grid-angular-community';
import { BryntumSchedulerModule } from '@bryntum/scheduler-angular-community';
import { BryntumGanttModule } from '@bryntum/gantt-angular-community';

import { AppComponent } from './app.component';

@NgModule({
    declarations : [
        AppComponent
    ],
    imports : [
        BryntumCoreModule,
        BrowserModule,
        BryntumGridModule,
        BryntumSchedulerModule,
        BryntumGanttModule
    ],
    providers : [{ provide : ErrorHandler, useClass : AppErrorHandler }],
    bootstrap : [AppComponent]
})

export class AppModule { }
