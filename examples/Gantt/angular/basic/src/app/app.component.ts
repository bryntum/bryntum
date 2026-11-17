import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { BryntumGanttComponent, BryntumGanttProjectModelComponent } from '@bryntum/gantt-angular-community';
import { ganttProps, projectProps } from './demo.config';

@Component({
    selector      : 'app-root',
    templateUrl   : './app.component.html',
    styleUrls     : ['./app.component.scss'],
    encapsulation : ViewEncapsulation.None,
    providers     : []
})
export class AppComponent {

    ganttProps = ganttProps;
    projectProps = projectProps;

    @ViewChild('ganttProject') project!: BryntumGanttProjectModelComponent;
    @ViewChild('gantt') ganttComponent!: BryntumGanttComponent;

}
