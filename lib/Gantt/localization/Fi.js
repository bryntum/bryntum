import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Scheduler/localization/Fi.js';

const locale = {

    localeName : 'Fi',
    localeDesc : 'Suomi',
    localeCode : 'fi',
    localeRtl  : false,

    Object : {
        Save : 'Tallenna'
    },

    CostColumn : {
        cost : 'Maksaa'
    },

    IgnoreResourceCalendarColumn : {
        'Ignore resource calendar' : 'Ohita resurssikalenteri'
    },

    InactiveColumn : {
        Inactive : ' Ei aktiivinen'
    },

    TaskInfoColumn : {
        info                     : 'Tiedot',
        postponedConflictTooltip : 'Tämän tapahtuman kanssa on ratkaisematon aikatauluristiriita. Napsauta ratkaistaksesi sen.'
    },

    ActualEffortColumn : {
        actualEffort : 'Todellinen työmäärä'
    },

    AddNewColumn : {
        'New Column' : 'Uusi sarake'
    },

    BaselineEffortColumn : {
        baselineEffort : 'Perustyömäärä'
    },

    BaselineStartDateColumn : {
        baselineStart : 'Perusaikataulun alkamispäivä'
    },

    BaselineEndDateColumn : {
        baselineEnd : 'Perusaikataulun päättymispäivä'
    },

    BaselineDurationColumn : {
        baselineDuration : 'Perusaikataulun kesto'
    },

    BaselineStartVarianceColumn : {
        startVariance : 'Alkamisen varianssi'
    },

    BaselineEndVarianceColumn : {
        endVariance : 'Päättymisen varianssi'
    },

    BaselineDurationVarianceColumn : {
        durationVariance : 'Keston poikkeama'
    },

    CalendarColumn : {
        Calendar : 'Kalenteri'
    },

    EarlyStartDateColumn : {
        'Early Start' : 'Early Aloitus'
    },

    EarlyEndDateColumn : {
        'Early End' : 'Aikainen End'
    },

    LateStartDateColumn : {
        'Late Start' : 'Myöhäinen aloitus'
    },

    LateEndDateColumn : {
        'Late End' : 'Myöhäinen loppu'
    },

    TotalSlackColumn : {
        'Total Slack' : 'Yhteensä Slack'
    },

    ConstraintDateColumn : {
        'Constraint Date' : 'Rajoituspäivä'
    },

    ConstraintTypeColumn : {
        'Constraint Type' : 'Rajoitustyyppi'
    },

    DeadlineDateColumn : {
        Deadline : 'Määräaika'
    },

    DependencyColumn : {
        'Invalid dependency' : 'Virheellinen riippuvuus'
    },

    DurationColumn : {
        Duration : 'Kesto'
    },

    EffortColumn : {
        Effort : 'Vaivaa'
    },

    EndDateColumn : {
        Finish : 'Lopetus'
    },

    ManuallyScheduledColumn : {
        'Manually scheduled' : 'Manuaalisesti aikataulutettu'
    },

    MilestoneColumn : {
        Milestone : 'Virstanpylväs'
    },

    NameColumn : {
        Name : 'Nimi'
    },

    NoteColumn : {
        Note : 'Huomautus'
    },

    PercentDoneColumn : {
        '% Done' : '% Suoritettu'
    },

    PlannedPercentDoneColumn : {
        plannedPercentDone : 'Suunniteltu % Valmis'
    },

    PredecessorColumn : {
        Predecessors : 'Predecessors'
    },

    ResourceAssignmentColumn : {
        'Assigned Resources' : 'Määritetyt resurssit',
        'more resources'     : 'lisää resursseja'
    },

    RollupColumn : {
        Rollup : 'Rollup'
    },

    SchedulingModeColumn : {
        'Scheduling Mode' : 'Aikataulutustila'
    },

    SchedulingDirectionColumn : {
        schedulingDirection : 'Ajoituksen suunta',
        inheritedFrom       : 'Peritty',
        enforcedBy          : 'Pakotettu'
    },

    SequenceColumn : {
        Sequence : 'Sekvenssi'
    },

    ShowInTimelineColumn : {
        'Show in timeline' : 'Näytä aikajanalla'
    },

    StartDateColumn : {
        Start : 'Aloitus'
    },

    SuccessorColumn : {
        Successors : 'Seuraajat'
    },

    TaskCopyPaste : {
        copyTask  : 'Kopioi',
        cutTask   : 'Leikkaa',
        pasteTask : 'Liitä'
    },

    WBSColumn : {
        WBS      : 'WBS',
        renumber : 'Numeroi uudelleen'
    },

    DependencyField : {
        invalidDependencyFormat : 'Virheellinen riippuvuusmuoto'
    },

    ProjectLines : {
        'Project Start' : 'Projektin aloitus',
        'Project End'   : 'Projektin lopetus',
        statusDate      : 'Tilan päivämäärä'
    },

    TaskTooltip : {
        Start    : 'Aloitus',
        End      : 'Lopetus',
        Duration : 'Kesto',
        Complete : 'Täydennä'
    },

    BasicTaskEdit : {
        editTask        : 'Muokkaa',
        name            : 'Nimi',
        percentComplete : '% valmis',
        start           : 'Aloitus',
        finish          : 'Valmis',
        duration        : 'Kesto'
    },

    AssignmentGrid : {
        Name     : 'Resurssin nimi',
        Units    : 'Yksiköt',
        unitsTpl : ({ value }) => value ? value + '%' : ''
    },

    AssignmentPicker : {
        quantity    : 'Määrä',
        cost        : 'Kustannus',
        quantityTpl : ({ record, value }) => `${value || 0} ${record.resource?.materialLabel || ''}`
    },

    Gantt : {
        Edit                   : 'Muokkaa',
        Indent                 : 'Sisennä',
        Outdent                : 'Ulonna',
        'Convert to milestone' : 'Muunna virstanpylvääksi',
        Add                    : 'Lisää...',
        'New task'             : 'Uusi tehtävä',
        'New milestone'        : 'Uusi virstanpylväs',
        'Task above'           : 'Tehtävä yläpuolella',
        'Task below'           : 'Tehtävä alapuolella',
        'Delete task'          : 'Poista',
        Milestone              : 'Virstanpylväs',
        'Sub-task'             : 'Alatehtävä',
        Successor              : 'Seuraaja',
        Predecessor            : 'Edeltäjä',
        changeRejected         : 'Scheduling engine hylkäsi muutokset',
        linkTasks              : 'Lisää riippuvuuksia',
        unlinkTasks            : 'Poista riippuvuuksia',
        color                  : 'Väri'
    },

    EventSegments : {
        splitTask : 'Jaa tehtävä osiin'
    },

    Indicators : {
        earlyDates   : 'Aikainen aloitus/lopetus',
        lateDates    : 'Myöhäinen aloitus/lopetus',
        Start        : 'Aloitus',
        End          : 'Lopetus',
        deadlineDate : 'Määräaika'
    },

    Versions : {
        indented      : 'Sisennetty',
        outdented     : 'Ulonnettu',
        cut           : 'Leikattu',
        pasted        : 'Liitetty',
        deletedTasks  : 'Poistetut tehtävät',
        propertyNames : {
            baselines                   : 'Perusviivat',
            deadlineDate                : 'Määräaika',
            description                 : 'Kuvaus',
            endDate                     : 'Päättymispäivä',
            projectConstraintResolution : 'Projektin rajoitteen ratkaisu',
            rollup                      : 'Yhteenveto',
            taskIconCls                 : 'Tehtävän kuvake',
            wbsValue                    : 'WBS'
        }
    },

    ProjectEditor : {
        projectInformation : 'Hankkeen tiedot',
        editorWidth        : 400
    },

    ProjectEditorGeneralTab : {
        general      : 'Kenraali',
        projectName  : 'Projektin nimi',
        start        : 'Aloituspäivämäärä',
        finish       : 'Päättymispäivämäärä',
        scheduleFrom : 'Aikataulu alkaen',
        calendar     : 'Kalenteri',
        readOnly     : 'Vain luku',
        forward      : 'Projektin alkamispäivä',
        backward     : 'Projektin päättymispäivä'
    },

    ProjectEditorDescriptionTab : {
        description : 'Kuvaus'
    },

    ProjectEditorAdvancedTab : {
        advanced     : 'Edistynyt',
        hoursPerDay  : 'Tuntia päivässä',
        daysPerWeek  : 'Päiviä viikossa',
        daysPerMonth : 'Päiviä kuukaudessa'
    }
};

export default LocaleHelper.publishLocale(locale);
