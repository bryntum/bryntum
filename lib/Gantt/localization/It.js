import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Scheduler/localization/It.js';

const locale = {

    localeName : 'It',
    localeDesc : 'Italiano',
    localeCode : 'it',
    localeRtl  : false,

    Object : {
        Save : 'Salva'
    },

    CostColumn : {
        cost : 'Costo'
    },

    IgnoreResourceCalendarColumn : {
        'Ignore resource calendar' : 'Ignora il calendario delle risorse'
    },

    InactiveColumn : {
        Inactive : 'Disattivo'
    },

    TaskInfoColumn : {
        info                     : 'Informazioni',
        postponedConflictTooltip : "C'è un conflitto di programmazione irrisolto con questo evento. Fare clic per risolverlo."
    },

    ActualEffortColumn : {
        actualEffort : 'Sforzo Effettivo'
    },

    AddNewColumn : {
        'New Column' : 'Nuova colonna'
    },

    BaselineEffortColumn : {
        baselineEffort : 'Sforzo di Base'
    },

    BaselineStartDateColumn : {
        baselineStart : 'Inizio previsto'
    },

    BaselineEndDateColumn : {
        baselineEnd : 'Fine prevista'
    },

    BaselineDurationColumn : {
        baselineDuration : 'Durata prevista'
    },

    BaselineStartVarianceColumn : {
        startVariance : 'Inizia varianza'
    },

    BaselineEndVarianceColumn : {
        endVariance : 'Fine varianza'
    },

    BaselineDurationVarianceColumn : {
        durationVariance : 'Varianza di durata'
    },

    CalendarColumn : {
        Calendar : 'Calendario'
    },

    EarlyStartDateColumn : {
        'Early Start' : 'Inizio anticipato'
    },

    EarlyEndDateColumn : {
        'Early End' : 'Fine anticipata'
    },

    LateStartDateColumn : {
        'Late Start' : 'Inizio ritardato'
    },

    LateEndDateColumn : {
        'Late End' : 'Fine ritardata'
    },

    TotalSlackColumn : {
        'Total Slack' : 'Slack totale'
    },

    ConstraintDateColumn : {
        'Constraint Date' : 'Data di vincolo'
    },

    ConstraintTypeColumn : {
        'Constraint Type' : 'Tipo di vincolo'
    },

    DeadlineDateColumn : {
        Deadline : 'Scadenza'
    },

    DependencyColumn : {
        'Invalid dependency' : 'Dipendenza non valida'
    },

    DurationColumn : {
        Duration : 'Durata'
    },

    EffortColumn : {
        Effort : ' Sforzo'
    },

    EndDateColumn : {
        Finish : 'Fine'
    },

    ManuallyScheduledColumn : {
        'Manually scheduled' : 'Programmato manualmente'
    },

    MilestoneColumn : {
        Milestone : 'Fase'
    },

    NameColumn : {
        Name : 'Nome'
    },

    NoteColumn : {
        Note : 'Nota'
    },

    PercentDoneColumn : {
        '% Done' : '% completato'
    },

    PlannedPercentDoneColumn : {
        plannedPercentDone : '% pianificato fatto'
    },

    PredecessorColumn : {
        Predecessors : 'Precedenti'
    },

    ResourceAssignmentColumn : {
        'Assigned Resources' : 'Risorse assegnate',
        'more resources'     : 'più risorse'
    },

    RollupColumn : {
        Rollup : 'Riepilogo'
    },

    SchedulingModeColumn : {
        'Scheduling Mode' : 'Modalità di programmazione'
    },

    SchedulingDirectionColumn : {
        schedulingDirection : 'Direzione di pianificazione',
        inheritedFrom       : 'Ereditato da',
        enforcedBy          : 'Impossato da'
    },

    SequenceColumn : {
        Sequence : 'Sequenza'
    },

    ShowInTimelineColumn : {
        'Show in timeline' : 'Mostra nella linea temporale'
    },

    StartDateColumn : {
        Start : 'Inizio'
    },

    SuccessorColumn : {
        Successors : 'Successivi'
    },

    TaskCopyPaste : {
        copyTask  : 'Copia',
        cutTask   : 'Taglia',
        pasteTask : 'Incolla'
    },

    WBSColumn : {
        WBS      : 'WBS',
        renumber : 'Rinumera'
    },

    DependencyField : {
        invalidDependencyFormat : 'Formato dipendenza non valido'
    },

    ProjectLines : {
        'Project Start' : 'Inizio del progetto',
        'Project End'   : 'Fine del progetto',
        statusDate      : 'Data dello stato'
    },

    TaskTooltip : {
        Start    : 'Inizio',
        End      : 'Fine',
        Duration : 'Durata',
        Complete : 'Completa'
    },

    BasicTaskEdit : {
        editTask        : 'Modifica',
        name            : 'Nome',
        percentComplete : '% completato',
        start           : 'Inizio',
        finish          : 'Fine',
        duration        : 'Durata'
    },

    AssignmentGrid : {
        Name     : 'Nome della risorsa',
        Units    : 'Unità',
        unitsTpl : ({ value }) => value ? value + '%' : ''
    },

    AssignmentPicker : {
        quantity    : 'Quantità',
        cost        : 'Costo',
        quantityTpl : ({ record, value }) => `${value || 0} ${record.resource?.materialLabel || ''}`
    },

    Gantt : {
        Edit                   : 'Modifica',
        Indent                 : 'Rientro',
        Outdent                : 'Elimina rientro',
        'Convert to milestone' : 'Converti in fase',
        Add                    : 'Aggiungi...',
        'New task'             : 'Nuova attività',
        'New milestone'        : 'Nuovo milestone',
        'Task above'           : 'Attività sopra',
        'Task below'           : 'Attività sotto',
        'Delete task'          : 'Elimina',
        Milestone              : 'Fase',
        'Sub-task'             : 'Sottoattività',
        Successor              : 'Successivo',
        Predecessor            : 'Precedente',
        changeRejected         : 'Il motore di programmazione ha rifiutato le modifiche',
        linkTasks              : 'Aggiungi dipendenze',
        unlinkTasks            : 'Rimuovi dipendenze',
        color                  : 'Colore'
    },

    EventSegments : {
        splitTask : 'Suddividi compito'
    },

    Indicators : {
        earlyDates   : 'Inizio/fine anticipato/a',
        lateDates    : 'Inizio/fine ritardato/a',
        Start        : 'Inizio',
        End          : 'Fine',
        deadlineDate : 'Scadenza'
    },

    Versions : {
        indented      : 'Rientrato',
        outdented     : 'Non rientrato',
        cut           : 'Tagliato',
        pasted        : 'Incollato',
        deletedTasks  : 'Compiti eliminati',
        propertyNames : {
            baselines                   : 'Linee di base',
            deadlineDate                : 'Scadenza',
            description                 : 'Descrizione',
            endDate                     : 'Data di fine',
            projectConstraintResolution : 'Risoluzione vincoli del progetto',
            rollup                      : 'Riepilogo',
            taskIconCls                 : 'Icona attività',
            wbsValue                    : 'WBS'
        }
    },

    ProjectEditor : {
        projectInformation : 'Informazioni sul progetto',
        editorWidth        : 400
    },

    ProjectEditorGeneralTab : {
        general      : 'Generale',
        projectName  : 'Nome del progetto',
        start        : 'Data di inizio',
        finish       : 'Data di fine',
        scheduleFrom : 'Pianifica da',
        calendar     : 'Calendario',
        readOnly     : 'Sola lettura',
        forward      : 'Data di inizio del progetto',
        backward     : 'Data di fine del progetto'
    },

    ProjectEditorDescriptionTab : {
        description : 'Descrizione'
    },

    ProjectEditorAdvancedTab : {
        advanced     : 'Avanzato',
        hoursPerDay  : 'Ore al giorno',
        daysPerWeek  : 'Giorni alla settimana',
        daysPerMonth : 'Giorni al mese'
    }
};

export default LocaleHelper.publishLocale(locale);
