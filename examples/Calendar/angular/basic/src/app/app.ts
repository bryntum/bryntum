import { Component, ViewEncapsulation } from '@angular/core';
import { BryntumCoreModule } from '@bryntum/core-angular-community';
import { BryntumCalendarModule } from '@bryntum/calendar-angular-community';
import { calendarProps } from './demo.config';

@Component({
    selector      : 'app-root',
    imports       : [BryntumCoreModule, BryntumCalendarModule],
    templateUrl   : './app.html',
    styleUrl      : './app.scss',
    encapsulation : ViewEncapsulation.None
})
export class App {
    // Calendar configuration
    calendarProps = calendarProps;
}
