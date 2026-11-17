import { AfterViewInit, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { TaskBoard } from '@bryntum/taskboard-community';
import { BryntumTaskBoardComponent, BryntumTaskBoardProjectModelComponent } from '@bryntum/taskboard-angular-community';
import { projectProps, taskBoardProps } from './demo.config';

@Component({
    standalone    : false,
    selector      : 'app-root',
    templateUrl   : './app.component.html',
    styleUrls     : ['./app.component.scss'],
    encapsulation : ViewEncapsulation.None
})

export class AppComponent implements AfterViewInit {

    taskBoardProps = taskBoardProps;
    projectProps = projectProps;

    // Bryntum TaskBoard Angular wrapper reference
    @ViewChild(BryntumTaskBoardComponent, { static : false }) taskBoardComponent!: BryntumTaskBoardComponent;
    @ViewChild(BryntumTaskBoardProjectModelComponent, { static : true }) project!: BryntumTaskBoardProjectModelComponent;

    private taskBoard! : TaskBoard;

    ngAfterViewInit(): void {
        this.taskBoard = this.taskBoardComponent.instance;
    }
}
