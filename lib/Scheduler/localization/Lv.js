import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Engine/localization/Lv.js';
import '../../Grid/localization/Lv.js';

const locale = {

    localeName : 'Lv',
    localeDesc : 'Latviešu',
    localeCode : 'lv-LV',
    localeRtl  : false,

    Object : {
        newEvent    : 'Jauns notikums',
        information : 'Information',
        showDetails : 'Rādīt detaļas'
    },

    ResourceInfoColumn : {
        eventCountText : data => data + ' notikums' + (data !== 1 ? '(i)' : '')
    },

    ResourceCollapseColumn : {
        toggleResourceLayout : 'Pārslēgt resursu izkārtojuma kolonnu. SPACE konteksta izvēlnei.'
    },

    Dependencies : {
        from    : 'No',
        to      : 'Līdz',
        valid   : 'Derīgs',
        invalid : 'Nederīgs'
    },

    DependencyType : {
        SS           : 'SS',
        SF           : 'SB',
        FS           : 'BS',
        FF           : 'BB',
        StartToStart : 'No sākuma līdz sākumam',
        StartToEnd   : 'No sākuma līdz beigām',
        EndToStart   : 'No beigām līdz sākumam',
        EndToEnd     : 'No beigām līdz beigām',
        short        : [
            'SS',
            'SB',
            'BS',
            'BB'
        ],
        long : [
            'No sākuma līdz sākumam',
            'No sākuma līdz beigām',
            'No beigām līdz sākumam',
            'No beigām līdz beigām'
        ]
    },

    DependencyEdit : {
        From              : 'No',
        To                : 'Līdz',
        Type              : 'Tips',
        Lag               : 'Aizkave',
        color             : 'Krāsa',
        lineStyle         : 'Līnijas stils',
        solid             : 'Pilna',
        dashed            : 'Pārtraukta',
        dotted            : 'Punktota',
        dashDot           : 'Pārtraukta-punktota',
        longDash          : 'Garā pārtraukta',
        'Edit dependency' : 'Rediģēt atkarību',
        Save              : 'Saglabāt',
        Delete            : 'Dzēst',
        Cancel            : 'Atcelt',
        StartToStart      : 'No sākuma līdz sākumam',
        StartToEnd        : 'No sākuma līdz beigām',
        EndToStart        : 'No beigām līdz sākumam',
        EndToEnd          : 'No beigām līdz beigām',
        Active            : 'Aktīva'
    },

    EventEdit : {
        Name           : 'Nosaukums',
        Resource       : 'Resurss',
        Start          : 'Sākums',
        startTime      : 'Sākuma laiks',
        End            : 'Beigas',
        endTime        : 'Beigu laiks',
        Save           : 'Saglabāt',
        Delete         : 'Dzēst',
        Cancel         : 'Atcelt',
        'Edit event'   : 'Rediģēt notikumu',
        Repeat         : 'Atkārtot',
        editRecurrence : 'Rediģēt atkārtošanos'
    },

    EventDrag : {
        eventOverlapsExisting   : 'Notikums pārklājas ar esošu notikumu šim resursam',
        noDropOutsideTimeline   : 'Notikums var nebūt pilnībā atmests ārpus laika skalas',
        duplicateAssignmentDrag : 'Notikumu nevar vairākas reizes piešķirt vienam resursam'
    },

    SchedulerBase : {
        'Add event'      : 'Pievienot notikumu',
        'Delete event'   : 'Dzēst notikumu',
        'Unassign event' : 'Notikuma piešķires noņemšana',
        color            : 'Krāsa',
        eventAriaLabel   : (eventRecord, startDate) => `${eventRecord.name}, sākas plkst. ${startDate} ${eventRecord.duration > 0 ? `uz ${eventRecord.fullDuration.toString(false)}` : ''}`
    },

    TimeAxisHeaderMenu : {
        pickZoomLevel   : 'Tālummainīt',
        activeDateRange : 'Datumu diapazons',
        startText       : 'Sākuma datums',
        endText         : 'Beigu datums',
        todayText       : 'Today'
    },

    TimeAxisColumn : {
        ariaLabel : (startDate, endDate) => `Laika ass parāda no ${startDate} līdz ${endDate}`
    },

    EventCopyPaste : {
        copyEvent  : 'Kopēt notikumu',
        cutEvent   : 'Izgriezt notikumu',
        pasteEvent : 'Ielīmēt notikumu'
    },

    EventFilter : {
        filterEvents : 'Filtrēt uzdevumus',
        byName       : 'Pēc nosaukuma'
    },

    TimeRanges : {
        showCurrentTimeLine : 'Rādīt pašreizējo laika skalu'
    },

    PresetManager : {
        secondAndMinute : {
            displayDateFormat : 'll LTS',
            name              : 'Sekundes'
        },
        minuteAndHour : {
            topDateFormat     : 'ddd DD/MM, hA',
            displayDateFormat : 'll LST'
        },
        hourAndDay : {
            topDateFormat     : 'ddd DD/MM',
            middleDateFormat  : 'LST',
            displayDateFormat : 'll LST',
            name              : 'Diena'
        },
        day : {
            name : 'Diena/stundas'
        },
        week : {
            name : 'Nedēļa/stundas'
        },
        dayAndWeek : {
            displayDateFormat : 'll LST',
            name              : 'Nedēļa/dienas'
        },
        dayAndMonth : {
            name : 'Mēnesis'
        },
        weekAndDay : {
            displayDateFormat : 'll LST',
            name              : 'Nedēļa'
        },
        weekAndMonth : {
            name : 'Nedēļas'
        },
        weekAndDayLetter : {
            name : 'Nedēļas/darbdienas'
        },
        weekDateAndMonth : {
            name : 'Mēneši/nedēļas'
        },
        monthAndYear : {
            name : 'Mēneši'
        },
        year : {
            name : 'Gadi'
        },
        manyYears : {
            name : 'Vairāki gadi'
        }
    },

    RecurrenceConfirmationPopup : {
        'delete-title'              : 'Jūs dzēšat notikumu',
        'delete-all-message'        : 'Vai vēlaties izdzēst visus šī notikuma gadījumus?',
        'delete-further-message'    : 'Vai vēlaties dzēst šo un visus turpmākos šī notikuma gadījumus vai tikai atlasīto gadījumu?',
        'delete-only-this-message'  : 'Vai vēlaties dzēst šo notikuma gadījumu?',
        'delete-further-btn-text'   : 'Dzēst visus turpmākos notikumus',
        'delete-only-this-btn-text' : 'Dzēst tikai šo notikumu',
        'update-title'              : 'Jūs maināt atkārtotu notikumu',
        'update-all-message'        : 'Vai vēlaties mainīt visus šī notikuma gadījumus?',
        'update-further-message'    : 'Vai vēlaties mainīt tikai šo notikuma gadījumu vai arī šo un visus turpmākos gadījumus?',
        'update-only-this-message'  : 'Vai vēlaties mainīt šo notikuma gadījumu?',
        'update-further-btn-text'   : 'Visi turpmākie notikumi',
        'update-only-this-btn-text' : 'Tikai šis notikums',
        Yes                         : 'Jā',
        Cancel                      : 'Atcelt',
        width                       : 600
    },

    RecurrenceLegend : {
        ' and '                         : ' un ',
        Daily                           : 'Katru dienu',
        'Weekly on {1}'                 : ({ days }) => `Katru nedēļu šādās dienās: ${days}`,
        'Monthly on {1}'                : ({ days }) => `Katru mēnesi šādās dienās: ${days}`,
        'Yearly on {1} of {2}'          : ({ days, months }) => `Katru gadu šādās dienās: ${days}, šādos mēnešos: ${months}`,
        'Every {0} days'                : ({ interval }) => `Ik pēc ${interval} dienas(ām)`,
        'Every {0} weeks on {1}'        : ({ interval, days }) => `Ik pēc ${interval} nedēļas(ām): ${days}`,
        'Every {0} months on {1}'       : ({ interval, days }) => `Ik pēc ${interval} mēneša(iem): ${days}`,
        'Every {0} years on {1} of {2}' : ({ interval, days, months }) => `Ik pēc ${interval} gada(iem): ${days}, ${months}`,
        position1                       : 'pirmā',
        position2                       : 'otrā',
        position3                       : 'trešā',
        position4                       : 'ceturtā',
        position5                       : 'piektā',
        'position-1'                    : 'pēdējā',
        day                             : 'diena',
        weekday                         : 'darbdiena',
        'weekend day'                   : 'nedēļas nogales diena',
        daysFormat                      : ({ position, days }) => `${position} ${days}`
    },

    RecurrenceEditor : {
        'Repeat event'      : 'Atkārtot notikumu',
        Cancel              : 'Atcelt',
        Save                : 'Saglabāt',
        Frequency           : 'Biežums',
        Every               : 'Ik pēc',
        DAILYintervalUnit   : 'dienas(ām)',
        WEEKLYintervalUnit  : 'nedēļas(ām)',
        MONTHLYintervalUnit : 'mēneša(iem)',
        YEARLYintervalUnit  : 'gada(iem)',
        Each                : 'Katru',
        on                  : 'virs',
        the                 : 'uz',
        'On the'            : 'Šādā datumā:',
        'End repeat'        : 'Beigt atkārtošanu',
        'time(s)'           : 'reizi(es)',
        Days                : 'Dienas',
        Months              : 'Mēneša'
    },

    RecurrenceDaysCombo : {
        day           : 'diena',
        weekday       : 'darbdiena',
        'weekend day' : 'nedēļas nogales diena'
    },

    RecurrencePositionsCombo : {
        position1    : 'pirmais',
        position2    : 'otrais',
        position3    : 'trešais',
        position4    : 'ceturtais',
        position5    : 'piektais',
        'position-1' : 'pēdējais'
    },

    RecurrenceStopConditionCombo : {
        Never     : 'Nekad',
        After     : 'Pēc',
        'On date' : 'Datums'
    },

    RecurrenceFrequencyCombo : {
        None    : 'Neatkārtot',
        Daily   : 'Katru dienu',
        Weekly  : 'Ik nedēļu šādā dienā: {0}',
        Monthly : 'Ik mēnesi',
        Yearly  : 'Ik gadu'
    },

    RecurrenceCombo : {
        None   : 'Nav',
        Custom : 'Pielāgošana...'
    },

    Summary : {
        'Summary for' : date => `Kopsavilkums par ${date}`
    },

    ScheduleRangeCombo : {
        completeview : 'Viss grafiks',
        currentview  : 'Redzamais grafiks',
        daterange    : 'Datumu diapazons',
        completedata : 'Viss grafiks (visiem notikumiem)'
    },

    SchedulerExportDialog : {
        'Schedule range' : 'Grafika diapazons',
        'Export from'    : 'No',
        'Export to'      : 'Līdz'
    },

    SinglePageExporterVertical : {
        verticalsinglepage : 'Viena lapa'
    },

    SinglePageUnscaledExporterVertical : {
        verticalsinglepageunscaled : 'Viena lapa (nemainīta mēroga)'
    },

    MultiPageVerticalExporterVertical : {
        verticalmultipagevertical : 'Vairākas lapas (vertikāli)'
    },

    ExcelExporter : {
        'No resource assigned' : 'Nav piešķirtu resursu'
    },

    CrudManagerView : {
        serverResponseLabel : 'Servera atbilde:'
    },

    DurationColumn : {
        Duration : 'Ilgums'
    },

    EventClusteringBase : {
        unnamed         : 'Nenosaukts',
        more            : count => `+ vēl ${count}`,
        clusteredEvents : count => `Sakopoti notikumi: ${count}`
    },

    ResourceTimeRangeClustering : {
        clusteredEvents : count => `Sakopoti diapazoni: ${count}`
    },

    ConstraintTypePicker : {
        none                : 'Nav',
        assoonaspossible    : 'Pēc iespējas ātrāk',
        aslateaspossible    : 'Pēc iespējas vēlāk',
        muststarton         : 'Ir jāsākas:',
        mustfinishon        : 'Ir jābeidzas:',
        startnoearlierthan  : 'Sākt ne agrāk kā',
        startnolaterthan    : 'Sākt ne vēlāk kā',
        finishnoearlierthan : 'Pabeigt ne agrāk kā',
        finishnolaterthan   : 'Pabeigt ne vēlāk kā'
    },

    EventBuffer : {
        preamblePostambleDescription : ({ preamble, postamble }) => {
            let description = '';
            if (preamble) {
                description += `.${preamble.toString()} buferlaiks pirms notikuma`;
            }
            if (postamble) {
                description += `.${postamble.toString()} buferlaiks pēc notikuma`;
            }
            return description;
        }
    },

    SchedulingDirectionPicker : {
        Forward       : 'Uz priekšu',
        Backward      : 'Uz atpakaļu',
        inheritedFrom : 'Pārmantots no',
        enforcedBy    : 'Ieviesa'
    },

    CalendarField : {
        'Default calendar' : 'Noklusējuma kalendārs',
        editCalendar       : 'Rediģēt kalendāru'
    },

    TaskEditorBase : {
        Information   : 'Uzdevuma informācija',
        Save          : 'Saglabāt',
        Cancel        : 'Atcelt',
        Delete        : 'Dzēst',
        calculateMask : 'Notiek aprēķināšana...',
        saveError     : 'Nevar saglabāt, vispirms izlabojiet kļūdas',
        repeatingInfo : 'Atkārtota notikuma skatīšana',
        editRepeating : 'Rediģēt'
    },

    TaskEdit : {
        editEvent              : 'Rediģēt notikumu',
        ConfirmDeletionTitle   : 'Apstiprināt dzēšanu',
        ConfirmDeletionMessage : 'Vai tiešām vēlaties dzēst notikumu?'
    },

    GanttTaskEditor : {
        editorWidth : '44 em'
    },

    SchedulerTaskEditor : {
        editorWidth : '35 em'
    },

    SchedulerGeneralTab : {
        General      : 'Vispārīgs',
        Name         : 'Nosaukums',
        Resources    : 'Resursi',
        '% complete' : '% pabeigts(i)',
        Duration     : 'Ilgums',
        Start        : 'Sākums',
        Finish       : 'Beigas',
        Effort       : 'Pūliņi',
        Preamble     : 'Preambula',
        Postamble    : 'Postambula'
    },

    GeneralTab : {
        General      : 'Vispārīgs',
        Name         : 'Nosaukums',
        '% complete' : '% pabeigts(i)',
        Duration     : 'Ilgums',
        Start        : 'Sākums',
        Finish       : 'Beigas',
        Effort       : 'Pūliņi',
        Dates        : 'Datumi'
    },

    SchedulerAdvancedTab : {
        Advanced                   : 'Papildiespējas',
        Calendar                   : 'Kalendārs',
        'Scheduling mode'          : 'Plānošanas režīms',
        'Effort driven'            : 'Pēc pūliņu ieguldījuma',
        'Manually scheduled'       : 'Manuāli plānojams',
        'Constraint type'          : 'Ierobežojuma veids',
        'Constraint date'          : 'Ierobežojuma datums',
        Inactive                   : 'Neaktīvs',
        'Ignore resource calendar' : 'Ignorēt resursu kalendāru'
    },

    CalendarEditorDatePicker : {
        addException : 'Pievienot izņēmumu',
        addWeek      : 'Pievienojiet nedēļu'
    },

    CalendarEditorExceptionTab : {
        addException    : 'Pievienot izņēmumu',
        removeException : 'Noņemt izņēmumu',
        noRows          : 'Nav pievienoti izņēmumi'
    },

    CalendarEditorWeekTab : {
        addWeek    : 'Pievienojiet nedēļu',
        removeWeek : 'Noņemt nedēļu'
    },

    CalendarEditor : {
        daysAreWorkingByDefault    : 'Dienas darbojas pēc noklusējuma',
        workingTimeCalendar        : 'Darba laika kalendārs',
        exceptions                 : 'Izņēmumi',
        general                    : 'Ģenerālis',
        name                       : 'Vārds',
        parent                     : 'Vecāks',
        save                       : 'Saglabāt',
        weeks                      : 'Nedēļas',
        error                      : 'Kļūda',
        inputErrors                : 'Ir ievades kļūdas. Lūdzu, izlabojiet tās pirms izmaiņu saglabāšanas.',
        delete                     : 'Dzēst',
        addCalendar                : 'Pievienojiet kalendāru',
        confirmation               : 'Apstiprinājums',
        removeCalendarWithChildren : 'Kalendārā ir bērnu kalendāri. Noklikšķiniet uz "Jā", lai noņemtu kalendāru ar bērniem.',
        removeCalendarAndLinks     : 'Kalendāru izmanto daži ieraksti. Noklikšķiniet uz "Jā", lai tos atsaistītu un noņemtu kalendāru.',
        newException               : 'Jauns izņēmums',
        newWeek                    : 'Jauna nedēļa'
    },

    CalendarEditorDateInfo : {
        isWorking    : ' strādā',
        isNotWorking : ' nestrādā',
        basedOn      : ' balstoties uz:',
        byDefault    : 'pēc noklusējuma',
        rangeTpl     : (start, end) => `${start} - ${end}`
    },

    CalendarEditorLegend : {
        workingDay    : 'Darba diena',
        nonWorkingDay : 'Brīvdiena'
    },

    AvailabilityRangeError : {
        errorOverlap       : 'Ir diapazoni, kas pārklājas',
        errorMissingDate   : 'Jānorāda sākuma un beigu laiks',
        errorStartAfterEnd : 'Sākuma laiks nevar būt pēc beigu laika'
    },

    CalendarEditorExceptionPanel : {
        name                                 : 'Vārds',
        from                                 : 'No',
        to                                   : 'Uz',
        is                                   : 'Ir',
        nonWorking                           : 'Nestrādājošs',
        working                              : 'Darbojas',
        hours                                : 'Stundas',
        repeat                               : 'Atkārtojiet',
        repeatEnd                            : 'Atkārtojiet beigas',
        errorMissingDate                     : 'Nepieciešams izņēmuma datumu diapazons',
        errorStartAfterEnd                   : 'Datums “No” nevar būt pēc datuma “Līdz”.',
        errorStartAndEndRepeatNumberMismatch : 'Izņēmumam jāsākas un jābeidzas tikpat reižu'
    },

    CalendarEditorWeekPanel : {
        name        : 'Vārds',
        from        : 'No',
        to          : 'Uz',
        days        : 'Dienas',
        copyDay     : 'Kopēšanas diena',
        pasteDay    : 'Ielīmēšanas diena',
        stopCopying : 'Pārtrauciet kopēšanu'
    },

    CalendarEditorAvailabilityRangeContainer : {
        addRange    : 'Pievienot diapazonu',
        removeRange : 'Noņemt diapazonu'
    },

    CalendarEditorWeekGrid : {
        errorStartAfterEnd           : 'Datums “No” nevar būt pēc datuma “Līdz”.',
        errorNoDefaultWeek           : 'Nepieciešama nedēļas konfigurācija',
        errorMultipleDefaultWeeks    : 'Ir norādīta vairāk nekā viena noklusējuma nedēļa',
        errorNoWeekAvailability      : 'Nedēļai jāparedz zināms darba laiks',
        errorInvalidWeekAvailability : 'Nedēļā ir darba laika konfigurācijas kļūdas',
        noRows                       : 'Nav pievienotas nedēļas'
    },

    AdvancedTab : {
        Advanced                   : 'Papildiespējas',
        Calendar                   : 'Kalendārs',
        'Scheduling mode'          : 'Plānošanas režīms',
        'Effort driven'            : 'Pēc pūliņu ieguldījuma',
        'Manually scheduled'       : 'Manuāli plānojams',
        'Constraint type'          : 'Ierobežojuma veids',
        'Constraint date'          : 'Ierobežojuma datums',
        Constraint                 : 'Ierobežojums',
        Rollup                     : 'Saritinājums',
        Inactive                   : 'Neaktīvs',
        'Ignore resource calendar' : 'Ignorēt resursu kalendāru',
        'Scheduling direction'     : 'Plānošanas virziens',
        projectBorder              : 'Projekta robeža',
        ignore                     : 'Ignorēt',
        honor                      : 'Gods',
        askUser                    : 'Jautājiet lietotājam'
    },

    DependencyTab : {
        Predecessors      : 'Priekšgājēji',
        Successors        : 'Pēcnācēji',
        ID                : 'ID',
        Name              : 'Nosaukums',
        Type              : 'Tips',
        Lag               : 'Aizkave',
        cyclicDependency  : 'Cikliska atkarība',
        invalidDependency : 'Nederīga atkarība',
        readOnlyTask      : 'Nevar saistīt tikai lasāmu uzdevumu'
    },

    NotesTab : {
        Notes : 'Piezīmes'
    },

    ResourceCalendarColumn : {
        calendar : 'Kalendārs'
    },

    ResourceEdit : {
        editResource : 'Rediģēt resursu'
    },

    ResourceEditor : {
        resourceInformation : 'Informācija par resursiem',
        costs               : 'Izmaksas',
        save                : 'Saglabāt',
        error               : 'Kļūda',
        inputErrors         : 'Ir ievades kļūdas. Lūdzu, izlabojiet tās pirms izmaiņu saglabāšanas.',
        delete              : 'Dzēst',
        confirmation        : 'Apstiprinājums',
        removeUsedResource  : 'Resurss ir piešķirts dažiem uzdevumiem. Noklikšķiniet uz "Jā", lai jebkurā gadījumā noņemtu resursu.'
    },

    ResourceEditorGeneralTab : {
        calendar    : 'Kalendārs',
        general     : 'Ģenerālis',
        label       : 'Materiāla etiķete',
        name        : 'Resursa nosaukums',
        type        : 'Tips',
        costAccrual : 'Izmaksu uzkrājums',
        labelHint   : 'piemēram, kg, tonnas vai kastes',
        maxUnits    : 'Maksimālais vienību skaits'
    },

    ResourceCostAccrualColumn : {
        accrueAt : 'Uzkrāt plkst',
        prorated : 'Proporcionāli',
        start    : 'Sākt',
        end      : 'Beigas'
    },

    CostAccrualField : {
        prorated : 'Proporcionāli',
        start    : 'Sākt',
        end      : 'Beigas'
    },

    ResourceType : {
        work     : 'Darbs',
        material : 'Materiāls',
        cost     : 'Izmaksas'
    },

    ResourceTypeColumn : {
        type : 'Tips'
    },

    ResourceEditorRateTablesTab : {
        rateTable    : 'Tarifu tabula',
        newGroup     : 'Jauns galds',
        removeGroup  : 'Noņemt tabulu',
        useByDefault : 'Izmantot pēc noklusējuma resursu piešķiršanai',
        noRates      : 'Nav likmju'
    },

    ResourceGrid : {
        name          : 'Vārds',
        materialLabel : 'Materiāla etiķete',
        maxUnits      : 'Maksimālās vienības',
        cost          : 'Izmaksas',
        noRows        : 'Nav resursu'
    },

    ResourceRateTableContainer : {
        startDate    : 'Sākuma datums',
        standardRate : 'Standarta likme',
        perUseCost   : 'Maksa par lietošanu',
        addRate      : 'Pievienot likmi',
        removeRate   : 'Noņemt likmi',
        name         : 'Vārds',
        noRates      : 'Nav likmju'
    },

    ResourceRateTableEditor : {
        rateTableInformation : 'Tarifu tabulas informācija'
    },

    ResourcesTab : {
        unitsTpl    : ({ column, value }) => column.formatValue(value) + '%',
        quantityTpl : ({ record, value }) => `${value || 0} ${record.resource?.materialLabel || ''}`,
        quantity    : 'Daudzums',
        Resources   : 'Resursi',
        Resource    : 'Resurss',
        Units       : 'Vienības',
        cost        : 'Izmaksas',
        effort      : 'Pūles',
        start       : 'Sākt',
        finish      : 'Pabeigt',
        preamble    : 'Priekšvārds',
        postamble   : 'Pēcvārds'
    },

    RateTableColumn : {
        rateTable : 'Tarifu tabula'
    },

    RecurrenceTab : {
        title : 'Atkārtojiet'
    },

    SchedulingModePicker : {
        Normal           : 'Parasts',
        'Fixed Duration' : 'Fiksēts ilgums',
        'Fixed Units'    : 'Fiksētas vienības',
        'Fixed Effort'   : 'Fiksēti pūliņi'
    },

    ResourceHistogram : {
        barTipInRange         : '<b>{resource}</b> {startDate} - {endDate}<br><span class="{cls}">{allocated} no {available}</span> piešķirti',
        barTipOnDate          : '<b>{resource}</b> datumā {startDate}<br><span class="{cls}">{allocated} no {available}</span> piešķirti',
        groupBarTipAssignment : '<b>{resource}</b> - <span class="{cls}">{allocated} no {available}</span>',
        groupBarTipInRange    : '{startDate} - {endDate}<br><span class="{cls}">{allocated} no {available}</span> piešķirti:<br>{assignments}',
        groupBarTipOnDate     : 'Datumā {startDate}<br><span class="{cls}">{allocated} no {available}</span> piešķirti:<br>{assignments}',
        plusMore              : '+{value} vēl'
    },

    ResourceUtilization : {
        effortRangeInfo       : '<div class="b-effort-range-data"><div class="b-effort-label">Pūles</div><div class="b-effort-value {cls}">{allocated} no {available}</div></div>',
        effortInfo            : '<div class="b-effort-data"><div class="b-effort-label">Pūles</div><div class="b-effort-value {cls}">{allocated}</div></div>',
        costInfo              : '<div class="b-cost-data"><div class="b-effort-label">Izmaksas</div><div class="b-effort-value b-cost">{cost}</div></div>',
        quantityInfo          : '<div class="b-quantity-data"><div class="b-effort-label">Daudzums</div><div class="b-effort-value b-quantity">{quantity}</div></div>',
        barTipInRange         : '<div class="b-on-date">{event} {startDate} - {endDate}</div><div class="b-summary-data">{effort-info}{cost-info}{quantity-info}</div>',
        barTipOnDate          : '<div class="b-on-date">{event} {startDate}</div><div class="b-summary-data">{effort-info}{cost-info}{quantity-info}</div>',
        groupBarTipAssignment : '<div class="b-assignment"><div class="b-assignment-name">{event}</div>{effort-info}{cost-info}{quantity-info}</div>',
        groupBarTipInRange    : '<div class="b-on-date">Kopsavilkums par {startDate} - {endDate}</div><div class="b-summary-data">{effort-range-info}{cost-info}{quantity-info}</div><div class="b-assignments">{assignments}</div>',
        groupBarTipOnDate     : '<div class="b-on-date">Kopsavilkums par {startDate}</div><div class="b-summary-data">{effort-range-info}{cost-info}{quantity-info}</div><div class="b-assignments">{assignments}</div>',
        plusMore              : '+{value} vairāk',
        nameColumnText        : 'Resurss / Notikums'
    },

    SchedulingIssueResolutionPopup : {
        'Cancel changes'   : 'Atcelt izmaiņas un nedarīt neko',
        schedulingConflict : 'Plānošanas konflikts',
        emptyCalendar      : 'Kalendāra konfigurācijas kļūda',
        cycle              : 'Plānošanas cikls',
        Apply              : 'Piemērot'
    },

    CycleResolutionPopup : {
        dependencyLabel        : 'Lūdzu, atlasiet atkarību:',
        invalidDependencyLabel : 'Ir nederīgas atkarības, kuras ir jāatrisina:'
    },

    SchedulerProBase : {
        propagating     : 'Projekta aprēķināšana',
        storePopulation : 'Ielādē datus',
        finalizing      : 'Rezultātu pabeigšana'
    },

    EventSegments : {
        splitEvent    : 'Sadalīt notikumu',
        renameSegment : 'Pārdēvēt'
    },

    NestedEvents : {
        createGroup         : 'Grupēt atlasītos notikumus',
        newGroupName        : 'Jauna grupa',
        deNestingNotAllowed : 'Ligzdojuma noņemšana nav atļauta',
        nestingNotAllowed   : 'Ligzdojuma izveide nav atļauta'
    },

    VersionGrid : {
        compare       : 'Salīdzināt',
        description   : 'Apraksts',
        occurredAt    : 'Noticis:',
        rename        : 'Pārdēvēt',
        restore       : 'Atjaunot',
        stopComparing : 'Pārtraukt salīdzināšanu'
    },

    Versions : {
        entityNames : {
            TaskModel       : 'uzdevums',
            AssignmentModel : 'piešķire',
            DependencyModel : 'atkarība',
            ProjectModel    : 'projekts',
            ResourceModel   : 'resurss',
            other           : 'cits'
        },
        entityNamesPlural : {
            TaskModel       : 'uzdevumi',
            AssignmentModel : 'piešķires',
            DependencyModel : 'atkarības',
            ProjectModel    : 'projekti',
            ResourceModel   : 'resursi',
            other           : 'citi'
        },
        transactionDescriptions : {
            update : 'Mainīts(i) {n} {entities}',
            add    : 'Pievienots(i) {n} {entities}',
            remove : 'Noņemts(i) {n} {entities}',
            move   : 'Pārvietots(i) {n} {entities}',
            mixed  : 'Mainīts(i) {n} {entities}'
        },
        propertyNames : {
            active                   : 'Aktīvs',
            allDay                   : 'Visa diena',
            allowOverlap             : 'Atļaut pārklāšanos',
            barMargin                : 'Joslas mala',
            bidirectional            : 'Divvirzienu',
            calendar                 : 'Kalendārs',
            cls                      : 'CSS klase',
            constraintDate           : 'Ierobežojuma datums',
            constraintType           : 'Ierobežojuma veids',
            daysPerMonth             : 'Dienas mēnesī',
            daysPerWeek              : 'Dienas nedēļā',
            delayFromParent          : 'Aizkave no vecāka',
            direction                : 'Virziens',
            drawDependencies         : 'Zīmēt atkarības',
            duration                 : 'Ilgums',
            durationUnit             : 'Ilguma vienība',
            effort                   : 'Pūles',
            effortDriven             : 'Pūļu vadīts',
            effortUnit               : 'Pūļu vienība',
            endDate                  : 'Beigu datums',
            eventColor               : 'Krāsa',
            eventId                  : 'Notikuma ID',
            eventLayout              : 'Notikuma izkārtojums',
            eventStyle               : 'Joslas stils',
            exceptionDates           : 'Izņēmuma datumi',
            fixed                    : 'Fiksēts',
            from                     : 'No',
            fromSide                 : 'No puses',
            hoursPerDay              : 'Stundas dienā',
            href                     : 'Saite',
            iconCls                  : 'Ikona',
            id                       : 'ID',
            ignoreResourceCalendar   : 'Ignorēt resursu kalendāru',
            ignoreTimeZone           : 'Ignorēt laika joslu',
            image                    : 'Attēls',
            imageUrl                 : 'Attēla URL',
            inactive                 : 'Neaktīvs',
            intervals                : 'Intervāli',
            lag                      : 'Aizkave',
            lagUnit                  : 'Aizkaves vienība',
            lineStyle                : 'Līnijas stils',
            manuallyScheduled        : 'Manuāli plānots',
            milestoneWidth           : 'Mērķa platums',
            name                     : 'Nosaukums',
            note                     : 'Piezīme',
            parentId                 : 'Vecāka ID',
            parentIndex              : 'Pozīcija',
            percentDone              : '% pabeigts',
            postamble                : 'Pēcvārds',
            preamble                 : 'Priekšvārds',
            readOnly                 : 'Tikai lasāms',
            recurrenceRule           : 'Atkārtošanās noteikums',
            resourceId               : 'Resursa ID',
            resourceMargin           : 'Resursa mala',
            rowHeight                : 'Rindas augstums',
            schedulingMode           : 'Plānošanas režīms',
            segments                 : 'Segmenti',
            showAvatar               : 'Rādīt avatāru',
            showInTimeline           : 'Rādīt laika skalā',
            startDate                : 'Sākuma datums',
            stickyContents           : 'Līpošs saturs',
            strokeColor              : 'Līnijas krāsa',
            style                    : 'Stils',
            target                   : 'Saistes mērķis',
            to                       : 'Uz',
            toSide                   : 'Uz pusi',
            type                     : 'Tips',
            units                    : 'Vienības',
            unscheduled              : 'Neplānots',
            unspecifiedTimeIsWorking : 'Nenoteikts laiks ir darba laiks',
            version                  : 'Versija'
        },
        intervals : {
            working    : 'Strādājošs',
            nonWorking : 'Nestrādājošs',
            fromTo     : 'No {from} līdz {to}',
            recurring  : 'Atkārtojas sākot no {start} līdz {end}'
        },
        addEntity         : 'Pievienots {type} **{name}**',
        removeEntity      : 'Noņemts {type} **{name}**',
        updateEntity      : 'Mainīts {type} **{name}**',
        moveEntity        : 'Pārvietots {type} **{name}** no {from} līdz {to}',
        addDependency     : 'Pievienota saite no **{from}** līdz **{to}**',
        removeDependency  : 'Noņemta saite no **{from}** līdz **{to}**',
        updateDependency  : 'Rediģēta saite no **{from}** līdz **{to}**',
        addAssignment     : 'Piešķirts **{resource}** notikumam **{event}**',
        removeAssignment  : 'Noņemts **{resource}** piešķīrums no notikuma **{event}**',
        updateAssignment  : 'Rediģēts **{resource}** piešķīrums notikumam **{event}**',
        noChanges         : 'Nav mainīts',
        nullValue         : 'nav',
        versionDateFormat : 'D/M/YYYY h:mm a',
        savedAt           : 'Saglabāts {date}',
        autoSavedAt       : 'Automātiski saglabāts {date}',
        undid             : 'Atcēla izmaiņas',
        redid             : 'Atkārtoti veica izmaiņas',
        editedTask        : 'Rediģēja uzdevuma rekvizītus',
        deletedTask       : 'Izdzēsa uzdevumu',
        movedTask         : 'Pārvietoja uzdevumu',
        movedTasks        : 'Pārvietoja uzdevumus'
    }
};

export default LocaleHelper.publishLocale(locale);
