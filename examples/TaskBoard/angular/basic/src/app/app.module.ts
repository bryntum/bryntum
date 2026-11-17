import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { BryntumCoreModule } from '@bryntum/core-angular-community';
import { BryntumTaskBoardModule } from '@bryntum/taskboard-angular-community';

import { AppComponent } from './app.component';

@NgModule({
    declarations : [
        AppComponent
    ],
    imports : [
        BrowserModule,
        BryntumCoreModule,
        BryntumTaskBoardModule
    ],
    providers : [],
    bootstrap : [AppComponent]
})
export class AppModule { }
