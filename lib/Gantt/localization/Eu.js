import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Scheduler/localization/Eu.js';

const locale = {

    localeName : 'Eu',
    localeDesc : 'Euskara',
    localeCode : 'eu-ES',
    localeRtl  : false,

    Object : {
        Save : 'Gorde'
    },

    CostColumn : {
        cost : 'Kostua'
    },

    IgnoreResourceCalendarColumn : {
        'Ignore resource calendar' : 'Ez ikusi baliabideen egutegia'
    },

    InactiveColumn : {
        Inactive : 'Inaktibo'
    },

    TaskInfoColumn : {
        info                     : 'Info',
        postponedConflictTooltip : 'Ebatzi gabeko programazio-gatazka bat dago gertaera honekin. Egin klik konpontzeko.'
    },

    ActualEffortColumn : {
        actualEffort : 'Benetako Ahalegina'
    },

    AddNewColumn : {
        'New Column' : 'Zutabe berria'
    },

    BaselineEffortColumn : {
        baselineEffort : 'Oinarrizko Ahalegina'
    },

    BaselineStartDateColumn : {
        baselineStart : 'Oinarri-lerroaren Hasiera'
    },

    BaselineEndDateColumn : {
        baselineEnd : 'Oinarri-lerroaren Bukaera'
    },

    BaselineDurationColumn : {
        baselineDuration : 'Oinarri-lerroaren Iraupena'
    },

    BaselineStartVarianceColumn : {
        startVariance : 'Hasierako bariantza'
    },

    BaselineEndVarianceColumn : {
        endVariance : 'Azken bariantza'
    },

    BaselineDurationVarianceColumn : {
        durationVariance : 'Bariantzaren Iraupena'
    },

    CalendarColumn : {
        Calendar : 'Egutegia'
    },

    EarlyStartDateColumn : {
        'Early Start' : 'Goiz Hasi'
    },

    EarlyEndDateColumn : {
        'Early End' : 'Goiz Bukatu'
    },

    LateStartDateColumn : {
        'Late Start' : 'Berandu Hasi'
    },

    LateEndDateColumn : {
        'Late End' : 'Berandu Bukatu'
    },

    TotalSlackColumn : {
        'Total Slack' : 'Erabateko Lasaiera'
    },

    ConstraintDateColumn : {
        'Constraint Date' : 'Murrizketa-data'
    },

    ConstraintTypeColumn : {
        'Constraint Type' : 'Murrizketa-mota'
    },

    DeadlineDateColumn : {
        Deadline : 'Epemuga'
    },

    DependencyColumn : {
        'Invalid dependency' : 'Mendekotasuna ez da baliozkoa'
    },

    DurationColumn : {
        Duration : 'Iraupena'
    },

    EffortColumn : {
        Effort : 'Esfortzua'
    },

    EndDateColumn : {
        Finish : 'Bukaera'
    },

    ManuallyScheduledColumn : {
        'Manually scheduled' : 'Eskuz programatua'
    },

    MilestoneColumn : {
        Milestone : 'Mugarria'
    },

    NameColumn : {
        Name : 'Izena'
    },

    NoteColumn : {
        Note : 'Oharra'
    },

    PercentDoneColumn : {
        '% Done' : '% Egina'
    },

    PlannedPercentDoneColumn : {
        plannedPercentDone : 'Aurreikusitako % Eginda'
    },

    PredecessorColumn : {
        Predecessors : 'Aurrekoak'
    },

    ResourceAssignmentColumn : {
        'Assigned Resources' : 'Esleitutako baliabideak',
        'more resources'     : 'baliabide gehiago'
    },

    RollupColumn : {
        Rollup : 'Biribilkatu'
    },

    SchedulingModeColumn : {
        'Scheduling Mode' : 'Programazio-modua'
    },

    SchedulingDirectionColumn : {
        schedulingDirection : 'Programazio-norabidea',
        inheritedFrom       : 'Hemendik heredatua',
        enforcedBy          : 'Honek aplikatzen du'
    },

    SequenceColumn : {
        Sequence : 'Sekuentzia'
    },

    ShowInTimelineColumn : {
        'Show in timeline' : 'Erakutsi denbora-lerroan'
    },

    StartDateColumn : {
        Start : 'Hasiera'
    },

    SuccessorColumn : {
        Successors : 'Ondorengoak'
    },

    TaskCopyPaste : {
        copyTask  : 'Kopiatu',
        cutTask   : 'Ebaki',
        pasteTask : 'Itsatsi'
    },

    WBSColumn : {
        WBS      : 'WBS',
        renumber : 'Berriz zenbakitu'
    },

    DependencyField : {
        invalidDependencyFormat : 'Dependetsia-formatu baliogabea'
    },

    ProjectLines : {
        'Project Start' : 'Proiektu-hasiera',
        'Project End'   : 'Proiektu-amaiera',
        statusDate      : 'Egoera-data'
    },

    TaskTooltip : {
        Start    : 'Hasiera',
        End      : 'Amaiera',
        Duration : 'Iraupena',
        Complete : 'Osatua'
    },

    BasicTaskEdit : {
        editTask        : 'Editatu',
        name            : 'Izena',
        percentComplete : '% osatuta',
        start           : 'Hasi',
        finish          : 'Amaitu',
        duration        : 'Iraupena'
    },

    AssignmentGrid : {
        Name     : 'Baliabidearen izena',
        Units    : 'Unitateak',
        unitsTpl : ({ value }) => value ? value + '%' : ''
    },

    AssignmentPicker : {
        quantity    : 'Kopurua',
        cost        : 'Kostua',
        quantityTpl : ({ record, value }) => `${value || 0} ${record.resource?.materialLabel || ''}`
    },

    Gantt : {
        Edit                   : 'Editatu',
        Indent                 : 'Koska',
        Outdent                : 'Zabalgarria',
        'Convert to milestone' : 'Bihurtu mugarri',
        Add                    : 'Gehitu...',
        'New task'             : 'Zeregin berria',
        'New milestone'        : 'Mugarri berria',
        'Task above'           : 'Goiko zeregina',
        'Task below'           : 'Beheko zeregina',
        'Delete task'          : 'Ezabatu',
        Milestone              : 'Mugarria',
        'Sub-task'             : 'Azpizeregina',
        Successor              : 'Ondorengoa',
        Predecessor            : 'Aurrekoa',
        changeRejected         : 'Programazio-motorrak aldaketak errefusatu ditu',
        linkTasks              : 'Erantsi mendekotasunak',
        unlinkTasks            : 'Ezabatu mendekotasunak',
        color                  : 'Kolorea'
    },

    EventSegments : {
        splitTask : 'Zeregina banatu'
    },

    Indicators : {
        earlyDates   : 'Hasiera/amaiera goiztiarra',
        lateDates    : 'Hasiera/amaiera berantiarra',
        Start        : 'Hasiera',
        End          : 'Amaiera',
        deadlineDate : 'Epemuga'
    },

    Versions : {
        indented      : 'koskatua',
        outdented     : 'zabaldua',
        cut           : 'Ebaki',
        pasted        : 'Itsastea',
        deletedTasks  : 'Ezabatutako zereginak',
        propertyNames : {
            baselines                   : 'Oinarriak',
            deadlineDate                : 'Epemuga',
            description                 : 'Deskribapena',
            endDate                     : 'Amaiera data',
            projectConstraintResolution : 'Proiektu-murrizketa ebazpena',
            rollup                      : 'Laburpena',
            taskIconCls                 : 'Zereginen ikonoa',
            wbsValue                    : 'WBS'
        }
    },

    ProjectEditor : {
        projectInformation : 'Proiektuaren informazioa',
        editorWidth        : 400
    },

    ProjectEditorGeneralTab : {
        general      : 'Orokorra',
        projectName  : 'Proiektuaren izena',
        start        : 'Hasiera data',
        finish       : 'Amaitzeko data',
        scheduleFrom : 'Ordutegia',
        calendar     : 'Egutegia',
        readOnly     : 'Irakurri Bakarrik',
        forward      : 'Proiektuaren hasiera data',
        backward     : 'Proiektuaren amaiera data'
    },

    ProjectEditorDescriptionTab : {
        description : 'Deskribapena'
    },

    ProjectEditorAdvancedTab : {
        advanced     : 'Aurreratua',
        hoursPerDay  : 'Eguneko Orduak',
        daysPerWeek  : 'Asteko egunak',
        daysPerMonth : 'Hileko egunak'
    }
};

export default LocaleHelper.publishLocale(locale);
