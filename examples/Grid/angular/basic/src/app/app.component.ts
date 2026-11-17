/**
 * App component script
 */
import { Component, ViewChild, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { gridProps } from './demo.config';
import { BryntumGridComponent } from '@bryntum/grid-angular-community';

import { Grid } from '@bryntum/grid-community';

@Component({
    selector      : 'app-root',
    templateUrl   : './app.component.html',
    styleUrls     : ['./app.component.scss'],
    encapsulation : ViewEncapsulation.None,
    standalone    : false
})
export class AppComponent implements AfterViewInit {

    // Bryntum Grid Angular wrapper reference
    @ViewChild(BryntumGridComponent, { static : false }) gridComponent!: BryntumGridComponent;

    grid!: Grid;

    columns = gridProps.columns;
    data = gridProps.data;

    ngAfterViewInit(): void {
        // Store grid instance
        this.grid = this.gridComponent.instance;
    }
}
