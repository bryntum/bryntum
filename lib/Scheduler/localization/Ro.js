import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Engine/localization/Ro.js';
import '../../Grid/localization/Ro.js';

const locale = {

    localeName : 'Ro',
    localeDesc : 'Română',
    localeCode : 'ro',
    localeRtl  : false,

    Object : {
        newEvent    : 'Eveniment nou',
        information : 'Informații',
        showDetails : 'Afișează detalii'
    },

    ResourceInfoColumn : {
        eventCountText : data => data + ' eveniment' + (data !== 1 ? 'e' : '')
    },

    ResourceCollapseColumn : {
        toggleResourceLayout : 'Comută coloana de aspect al resurselor. SPACE pentru meniul contextual.'
    },

    Dependencies : {
        from    : 'De la',
        to      : 'Până la',
        valid   : 'Valid',
        invalid : 'Nevalid'
    },

    DependencyType : {
        SS           : 'SS',
        SF           : 'SF',
        FS           : 'FS',
        FF           : 'FF',
        StartToStart : 'Start-la-start',
        StartToEnd   : 'Start-la-finalizare',
        EndToStart   : 'Finalizare-la-start',
        EndToEnd     : 'Finalizare-la-finalizare',
        short        : [
            'SS',
            'SF',
            'FS',
            'FF'
        ],
        long : [
            'Start-la-start',
            'Start-la-finalizare',
            'Finalizare-la-start',
            'Finalizare-la-finalizare'
        ]
    },

    DependencyEdit : {
        From              : 'De la',
        To                : 'Până la',
        Type              : 'Tip',
        Lag               : 'Întârziere',
        color             : 'Culoare',
        lineStyle         : 'Stil linie',
        solid             : 'Solid',
        dashed            : 'Linie întreruptă',
        dotted            : 'Punctat',
        dashDot           : 'Linie-punct',
        longDash          : 'Linie lungă',
        'Edit dependency' : 'Editare dependență',
        Save              : 'Salvare',
        Delete            : 'Ștergere',
        Cancel            : 'Anulare',
        StartToStart      : 'Start la start',
        StartToEnd        : 'Start la finalizare',
        EndToStart        : 'Finalizare la start',
        EndToEnd          : 'Finalizare la finalizare',
        Active            : 'Activ'
    },

    EventEdit : {
        Name           : 'Nume',
        Resource       : 'Resursă',
        Start          : 'Start',
        startTime      : 'Ora de început',
        End            : 'Finalizare',
        endTime        : 'Ora de sfârșit',
        Save           : 'Salvare',
        Delete         : 'Ștergere',
        Cancel         : 'Anulare',
        'Edit event'   : 'Editare eveniment',
        Repeat         : 'Repetare',
        editRecurrence : 'Editare recurență'
    },

    EventDrag : {
        eventOverlapsExisting   : 'Evenimentul se suprapune cu cel existent pentru această resursă',
        noDropOutsideTimeline   : 'Evenimentul nu poate fi lăsat complet în afara cronologiei',
        duplicateAssignmentDrag : 'Evenimentul nu poate fi atribuit aceluiași resurse de mai multe ori'
    },

    SchedulerBase : {
        'Add event'      : 'Adăugare eveniment',
        'Delete event'   : 'Ștergere eveniment',
        'Unassign event' : 'Anulare alocare eveniment',
        color            : 'Culoare',
        eventAriaLabel   : (eventRecord, startDate) => `${eventRecord.name}, începe la ${startDate} ${eventRecord.duration > 0 ? `pentru ${eventRecord.fullDuration.toString(false)}` : ''}`
    },

    TimeAxisHeaderMenu : {
        pickZoomLevel   : 'Zoom',
        activeDateRange : 'Interval dată',
        startText       : 'Data începerii',
        endText         : 'Data finalizării',
        todayText       : 'Azi'
    },

    TimeAxisColumn : {
        ariaLabel : (startDate, endDate) => `Axa timpului arată de la ${startDate} la ${endDate}`
    },

    EventCopyPaste : {
        copyEvent  : 'Copiere eveniment',
        cutEvent   : 'Decupare eveniment',
        pasteEvent : 'Lipire eveniment'
    },

    EventFilter : {
        filterEvents : 'Filtrare sarcini',
        byName       : 'În funcție de nume'
    },

    TimeRanges : {
        showCurrentTimeLine : 'Afișare cronologie curentă'
    },

    PresetManager : {
        secondAndMinute : {
            displayDateFormat : 'll LTS',
            name              : 'Secunde'
        },
        minuteAndHour : {
            topDateFormat     : 'ddd DD.MM, hA',
            displayDateFormat : 'll LST'
        },
        hourAndDay : {
            topDateFormat     : 'ddd DD.MM',
            middleDateFormat  : 'LST',
            displayDateFormat : 'll LST',
            name              : 'Zi'
        },
        day : {
            name : 'Zi/ore'
        },
        week : {
            name : 'Săptămână/ore'
        },
        dayAndWeek : {
            displayDateFormat : 'll LST',
            name              : 'Săptămână/zile'
        },
        dayAndMonth : {
            name : 'Lună'
        },
        weekAndDay : {
            displayDateFormat : 'll LST',
            name              : 'Săptămână'
        },
        weekAndMonth : {
            name : 'Săptămâni'
        },
        weekAndDayLetter : {
            name : 'Săptămâni/zile din săptămână'
        },
        weekDateAndMonth : {
            name : 'Luni/săptămâni'
        },
        monthAndYear : {
            name : 'Luni'
        },
        year : {
            name : 'Ani'
        },
        manyYears : {
            name : 'Ani multipli'
        }
    },

    RecurrenceConfirmationPopup : {
        'delete-title'              : 'Ștergeți un eveniment',
        'delete-all-message'        : 'Doriți să ștergeți toate aparițiile acestui eveniment?',
        'delete-further-message'    : 'Doriți să ștergeți evenimentul împreună cu toate aparițiile sale, sau doar apariția selectată?',
        'delete-only-this-message'  : 'Doriți să ștergeți această apariție a acestui eveniment?',
        'delete-further-btn-text'   : 'Ștergeți toate evenimentele viitoare',
        'delete-only-this-btn-text' : 'Ștergeți numai acest eveniment',
        'update-title'              : 'Modificați un eveniment repetitiv',
        'update-all-message'        : 'Doriți să modificați toate aparițiile acestui eveniment?',
        'update-further-message'    : 'Doriți să modificați doar această apariție a evenimentului sau pe aceasta și toate aparițiile viitoare?',
        'update-only-this-message'  : 'Doriți să schimbați această apariție a acestui eveniment?',
        'update-further-btn-text'   : 'Toate evenimentele viitoare',
        'update-only-this-btn-text' : 'Numai acest eveniment',
        Yes                         : 'Da',
        Cancel                      : 'Anulare',
        width                       : 600
    },

    RecurrenceLegend : {
        ' and '                         : ' și ',
        Daily                           : 'Zilnic',
        'Weekly on {1}'                 : ({ days }) => `Săptămânal, în zilele de ${days}`,
        'Monthly on {1}'                : ({ days }) => `Lunar, pe ${days}`,
        'Yearly on {1} of {2}'          : ({ days, months }) => `Anual, pe ${days} of ${months}`,
        'Every {0} days'                : ({ interval }) => `La fiecare ${interval} zile`,
        'Every {0} weeks on {1}'        : ({ interval, days }) => `La fiecare ${interval} săptămâni, în zilele de ${days}`,
        'Every {0} months on {1}'       : ({ interval, days }) => `La fiecare ${interval} luni pe ${days}`,
        'Every {0} years on {1} of {2}' : ({ interval, days, months }) => `La fiecare ${interval} ani, pe ${days} din ${months}`,
        position1                       : 'prima',
        position2                       : 'a doua',
        position3                       : 'a treia',
        position4                       : 'a patra',
        position5                       : 'a cincea',
        'position-1'                    : 'ultima',
        day                             : 'zi',
        weekday                         : 'zi lucrătoare',
        'weekend day'                   : 'zi de weekend',
        daysFormat                      : ({ position, days }) => `${position} ${days}`
    },

    RecurrenceEditor : {
        'Repeat event'      : 'Repetare eveniment',
        Cancel              : 'Anulare',
        Save                : 'Salvare',
        Frequency           : 'Frecvență',
        Every               : 'În fiecare',
        DAILYintervalUnit   : 'zi(le)',
        WEEKLYintervalUnit  : 'săptămână(i)',
        MONTHLYintervalUnit : 'lună(i)',
        YEARLYintervalUnit  : 'an(i)',
        Each                : 'Fiecare',
        on                  : 'Pe',
        the                 : 'În',
        'On the'            : 'Pe',
        'End repeat'        : 'Finalizare repetare',
        'time(s)'           : 'ora(e)',
        Days                : 'Zile',
        Months              : 'Luni'
    },

    RecurrenceDaysCombo : {
        day           : 'zi',
        weekday       : 'zi lucrătoare',
        'weekend day' : 'zi de weekend'
    },

    RecurrencePositionsCombo : {
        position1    : 'prima',
        position2    : 'a doua',
        position3    : 'a treia',
        position4    : 'a patra',
        position5    : 'a cincea',
        'position-1' : 'ultima'
    },

    RecurrenceStopConditionCombo : {
        Never     : 'Niciodată',
        After     : 'După',
        'On date' : 'La data'
    },

    RecurrenceFrequencyCombo : {
        None    : 'A nu se repeta',
        Daily   : 'Zilnic',
        Weekly  : 'Săptămânal',
        Monthly : 'Lunar',
        Yearly  : 'Anual'
    },

    RecurrenceCombo : {
        None   : 'Niciunul',
        Custom : 'Personalizat..'
    },

    Summary : {
        'Summary for' : date => `Sumar pentru ${date}`
    },

    ScheduleRangeCombo : {
        completeview : 'Program complet',
        currentview  : 'Program vizibil',
        daterange    : 'Interval de date',
        completedata : 'Program complet (pentru toate evenimentele)'
    },

    SchedulerExportDialog : {
        'Schedule range' : 'Programare interval',
        'Export from'    : 'De la',
        'Export to'      : 'Până la'
    },

    SinglePageExporterVertical : {
        verticalsinglepage : 'Pagină unică'
    },

    SinglePageUnscaledExporterVertical : {
        verticalsinglepageunscaled : 'Pagină unică (neajustată)'
    },

    MultiPageVerticalExporterVertical : {
        verticalmultipagevertical : 'Pagini multiple (vertical)'
    },

    ExcelExporter : {
        'No resource assigned' : 'Nicio resursă alocată'
    },

    CrudManagerView : {
        serverResponseLabel : 'Răspuns server:'
    },

    DurationColumn : {
        Duration : 'Durată'
    },

    EventClusteringBase : {
        unnamed         : 'Fără nume',
        more            : count => `+ încă ${count}`,
        clusteredEvents : count => `Evenimente grupate: ${count}`
    },

    ResourceTimeRangeClustering : {
        clusteredEvents : count => `Intervale grupate: ${count}`
    },

    ConstraintTypePicker : {
        none                : 'Niciunul',
        assoonaspossible    : 'Cât mai curând posibil',
        aslateaspossible    : 'Cât mai târziu posibil',
        muststarton         : 'Trebuie să înceapă la',
        mustfinishon        : 'Trebuie finalizat la',
        startnoearlierthan  : 'Începutul nu mai devreme de',
        startnolaterthan    : 'Începutul nu mai târziu de',
        finishnoearlierthan : 'Finalizare nu mai devreme de',
        finishnolaterthan   : 'Finalizare nu mai târziu de'
    },

    EventBuffer : {
        preamblePostambleDescription : ({ preamble, postamble }) => {
            let description = '';
            if (preamble) {
                description += `.${preamble.toString()} timp tampon înainte de eveniment`;
            }
            if (postamble) {
                description += `.${postamble.toString()} timp tampon după eveniment`;
            }
            return description;
        }
    },

    SchedulingDirectionPicker : {
        Forward       : 'Înainte',
        Backward      : 'Înapoi',
        inheritedFrom : 'Moștenit de la',
        enforcedBy    : 'Impus de'
    },

    CalendarField : {
        'Default calendar' : 'Calendar implicit',
        editCalendar       : 'Calendarul de editare'
    },

    TaskEditorBase : {
        Information   : 'Informații despre sarcină',
        Save          : 'Salvare',
        Cancel        : 'Anulare',
        Delete        : 'Ștergere',
        calculateMask : 'Se calculează...',
        saveError     : 'Salvare imposibilă, vă rugăm să corectați mai întâi eroarea',
        repeatingInfo : 'Vizualizare eveniment recurent',
        editRepeating : 'Editare'
    },

    TaskEdit : {
        editEvent              : 'Editare eveniment',
        ConfirmDeletionTitle   : 'Confirmare ștergere',
        ConfirmDeletionMessage : 'Sigur doriți să ștergeți evenimentul?'
    },

    GanttTaskEditor : {
        editorWidth : '52em'
    },

    SchedulerTaskEditor : {
        editorWidth : '33em'
    },

    SchedulerGeneralTab : {
        General      : 'Generalități',
        Name         : 'Nume',
        Resources    : 'Resurse',
        '% complete' : '% finalizat',
        Duration     : 'Durată',
        Start        : 'Start',
        Finish       : 'Finalizare',
        Effort       : 'Efort',
        Preamble     : 'Preambul',
        Postamble    : 'Epilog'
    },

    GeneralTab : {
        General      : 'Generalități',
        Name         : 'Nume',
        '% complete' : '% finalizat',
        Duration     : 'Durată',
        Start        : 'Start',
        Finish       : 'Finalizare',
        Effort       : 'Efort',
        Dates        : 'Date'
    },

    SchedulerAdvancedTab : {
        Advanced                   : 'Avansat',
        Calendar                   : 'Calendar',
        'Scheduling mode'          : 'Mod programare',
        'Effort driven'            : 'Motivat de efort ',
        'Manually scheduled'       : 'Programat manual',
        'Constraint type'          : 'Tip de restricționare',
        'Constraint date'          : 'Data restricționării',
        Inactive                   : 'Inactiv',
        'Ignore resource calendar' : 'Ignorați calendarul de resurse'
    },

    CalendarEditorDatePicker : {
        addException : 'Adăugați excepție',
        addWeek      : 'Adăugați săptămână'
    },

    CalendarEditorExceptionTab : {
        addException    : 'Adăugați excepție',
        removeException : 'Eliminați excepția',
        noRows          : 'Nu s -au adăugat excepții'
    },

    CalendarEditorWeekTab : {
        addWeek    : 'Adăugați săptămână',
        removeWeek : 'Îndepărtați săptămâna'
    },

    CalendarEditor : {
        daysAreWorkingByDefault    : 'Zilele funcționează implicit',
        workingTimeCalendar        : 'Calendarul timpului de lucru',
        exceptions                 : 'Excepții',
        general                    : 'General',
        name                       : 'Nume',
        parent                     : 'Mamă',
        save                       : 'Salvați',
        weeks                      : 'Săptămâni',
        error                      : 'Eroare',
        inputErrors                : 'Există erori de intrare. Vă rugăm să le reparați înainte de a vă salva modificările.',
        delete                     : 'Șterge',
        addCalendar                : 'Adăugați un calendar',
        confirmation               : 'Confirmare',
        removeCalendarWithChildren : 'Calendarul are calendare pentru copii. Faceți clic pe „Da” pentru a elimina calendarul cu copiii săi.',
        removeCalendarAndLinks     : 'Calendarul este folosit de unele înregistrări. Faceți clic pe „Da” pentru a le deconecta și elimina calendarul.',
        newException               : 'O nouă excepție',
        newWeek                    : 'Săptămâna nouă'
    },

    CalendarEditorDateInfo : {
        isWorking    : ' muncește',
        isNotWorking : ' nu funcționează',
        basedOn      : ' bazat pe:',
        byDefault    : 'în mod implicit',
        rangeTpl     : (start, end) => `${start} - ${end}`
    },

    CalendarEditorLegend : {
        workingDay    : 'Zi de lucru',
        nonWorkingDay : 'Ziua care nu lucrează'
    },

    AvailabilityRangeError : {
        errorOverlap       : 'Există intervale suprapuse',
        errorMissingDate   : 'Ora de pornire și de sfârșit este necesară',
        errorStartAfterEnd : 'Timpul de pornire nu poate fi după ora de sfârșit'
    },

    CalendarEditorExceptionPanel : {
        name                                 : 'Nume',
        from                                 : 'Din',
        to                                   : 'La',
        is                                   : 'Este',
        nonWorking                           : 'Non-prelucrare',
        working                              : 'Lucru',
        hours                                : 'Ore',
        repeat                               : 'Repeta',
        repeatEnd                            : 'Repetați capătul',
        errorMissingDate                     : 'Intervalul de date de excepție este necesar',
        errorStartAfterEnd                   : '"From" date cannot be after the "To" date ',
        errorStartAndEndRepeatNumberMismatch : 'Excepția ar trebui să înceapă și să încheie același număr de ori'
    },

    CalendarEditorWeekPanel : {
        name        : 'Nume',
        from        : 'Din',
        to          : 'La',
        days        : 'Zile',
        copyDay     : 'Ziua copiilor',
        pasteDay    : 'Lipiți ziua',
        stopCopying : 'Nu mai copiați'
    },

    CalendarEditorAvailabilityRangeContainer : {
        addRange    : 'Adăugați raza de acțiune',
        removeRange : 'Eliminați intervalul'
    },

    CalendarEditorWeekGrid : {
        errorStartAfterEnd           : '"From" date cannot be after the "To" date ',
        errorNoDefaultWeek           : 'Configurația săptămânii este necesară',
        errorMultipleDefaultWeeks    : 'Este specificat mai mult de o săptămână implicită',
        errorNoWeekAvailability      : 'Săptămâna trebuie să ofere ceva timp de lucru',
        errorInvalidWeekAvailability : 'Săptămâna are erori de configurare a timpului de lucru',
        noRows                       : 'Nu s -au adăugat săptămâni'
    },

    AdvancedTab : {
        Advanced                   : 'Avansat',
        Calendar                   : 'Calendar',
        'Scheduling mode'          : 'Mod programare',
        'Effort driven'            : 'Motivat de efort ',
        'Manually scheduled'       : 'Programat manual',
        'Constraint type'          : 'Tip de restricționare',
        'Constraint date'          : 'Data restricționării',
        Constraint                 : 'Restricționare',
        Rollup                     : 'Cumul',
        Inactive                   : 'Inactiv',
        'Ignore resource calendar' : 'Ignorați calendarul de resurse',
        'Scheduling direction'     : 'Direcția programării',
        projectBorder              : 'Granița proiectului',
        ignore                     : 'Ignora',
        honor                      : 'Onora',
        askUser                    : 'Întrebați utilizatorul'
    },

    DependencyTab : {
        Predecessors      : 'Predecesori',
        Successors        : 'Succesori',
        ID                : 'ID',
        Name              : 'Nume',
        Type              : 'Tip',
        Lag               : 'Întârziere',
        cyclicDependency  : 'Dependență ciclică',
        invalidDependency : 'Dependență nevalidă',
        readOnlyTask      : 'Nu se poate lega o sarcină doar în citire'
    },

    NotesTab : {
        Notes : 'Note'
    },

    ResourceCalendarColumn : {
        calendar : 'Calendar'
    },

    ResourceEdit : {
        editResource : 'Editați resursa'
    },

    ResourceEditor : {
        resourceInformation : 'Informații despre resurse',
        costs               : 'Costuri',
        save                : 'Salva',
        error               : 'Eroare',
        inputErrors         : 'Există erori de introducere. Remediați-le înainte de a salva modificările.',
        delete              : 'Şterge',
        confirmation        : 'Confirmare',
        removeUsedResource  : 'Resursa este atribuită unor sarcini. Faceți clic pe „Da” pentru a elimina resursa oricum.'
    },

    ResourceEditorGeneralTab : {
        calendar    : 'Calendaristic',
        general     : 'General',
        label       : 'Eticheta materialului',
        name        : 'Numele resursei',
        type        : 'Tip',
        costAccrual : 'Acumularea costurilor',
        labelHint   : 'de exemplu, kg, tone sau cutii',
        maxUnits    : 'Unități maxime'
    },

    ResourceCostAccrualColumn : {
        accrueAt : 'Acumulează la',
        prorated : 'Prorata',
        start    : 'Început',
        end      : 'Sfârşit'
    },

    CostAccrualField : {
        prorated : 'Prorata',
        start    : 'Început',
        end      : 'Sfârşit'
    },

    ResourceType : {
        work     : 'Lucru',
        material : 'Material',
        cost     : 'Cost'
    },

    ResourceTypeColumn : {
        type : 'Tip'
    },

    ResourceEditorRateTablesTab : {
        rateTable    : 'Tabelul de tarife',
        newGroup     : 'Masa noua',
        removeGroup  : 'Scoateți masa',
        useByDefault : 'Utilizați în mod implicit pentru alocarea resurselor',
        noRates      : 'Fara tarife'
    },

    ResourceGrid : {
        name          : 'Nume',
        materialLabel : 'Eticheta materialului',
        maxUnits      : 'Unități maxime',
        cost          : 'Cost',
        noRows        : 'Fără resurse'
    },

    ResourceRateTableContainer : {
        startDate    : 'Data de începere',
        standardRate : 'Tarif standard',
        perUseCost   : 'Cost pe utilizare',
        addRate      : 'Adaugă tarif',
        removeRate   : 'Eliminați rata',
        name         : 'Nume',
        noRates      : 'Fara tarife'
    },

    ResourceRateTableEditor : {
        rateTableInformation : 'Informații despre tabelul de tarife'
    },

    ResourcesTab : {
        unitsTpl    : ({ column, value }) => column.formatValue(value) + '%',
        quantityTpl : ({ record, value }) => `${value || 0} ${record.resource?.materialLabel || ''}`,
        quantity    : 'Cantitate',
        Resources   : 'Resurse',
        Resource    : 'Resursă',
        Units       : 'Unități',
        cost        : 'Cost',
        effort      : 'Efort',
        start       : 'Început',
        finish      : 'Termina',
        preamble    : 'Preambul',
        postamble   : 'Postambul'
    },

    RateTableColumn : {
        rateTable : 'Tabelul de tarife'
    },

    RecurrenceTab : {
        title : 'Repetare'
    },

    SchedulingModePicker : {
        Normal           : 'Normal',
        'Fixed Duration' : 'Durată fixă',
        'Fixed Units'    : 'Unități fixe',
        'Fixed Effort'   : 'Efort fix'
    },

    ResourceHistogram : {
        barTipInRange         : '<b>{resource}</b> {startDate} - {endDate}<br><span class="{cls}">{allocated} din {available}</span> alocat',
        barTipOnDate          : '<b>{resource}</b> on {startDate}<br><span class="{cls}">{allocated} din {available}</span> alocat',
        groupBarTipAssignment : '<b>{resource}</b> - <span class="{cls}">{allocated} din {available}</span>',
        groupBarTipInRange    : '{startDate} - {endDate}<br><span class="{cls}">{allocated} din {available}</span> allocated:<br>{assignments}',
        groupBarTipOnDate     : 'La {startDate}<br><span class="{cls}">{allocated} din {available}</span> alocat:<br>{assignments}',
        plusMore              : '+{value} mai mult'
    },

    ResourceUtilization : {
        effortRangeInfo       : '<div class="b-effort-range-data"><div class="b-effort-label">Efort</div><div class="b-effort-value {cls}">{allocated} din {available}</div></div>',
        effortInfo            : '<div class="b-effort-data"><div class="b-effort-label">Efort</div><div class="b-effort-value {cls}">{allocated}</div></div>',
        costInfo              : '<div class="b-cost-data"><div class="b-effort-label">Cost</div><div class="b-effort-value b-cost">{cost}</div></div>',
        quantityInfo          : '<div class="b-quantity-data"><div class="b-effort-label">Cantitate</div><div class="b-effort-value b-quantity">{quantity}</div></div>',
        barTipInRange         : '<div class="b-on-date">{event} {startDate} - {endDate}</div><div class="b-summary-data">{effort-info}{cost-info}{quantity-info}</div>',
        barTipOnDate          : '<div class="b-on-date">{event} pe {startDate}</div><div class="b-summary-data">{effort-info}{cost-info}{quantity-info}</div>',
        groupBarTipAssignment : '<div class="b-assignment"><div class="b-assignment-name">{event}</div>{effort-info}{cost-info}{quantity-info}</div>',
        groupBarTipInRange    : '<div class="b-on-date">Rezumat pentru {startDate} - {endDate}</div><div class="b-summary-data">{effort-range-info}{cost-info}{quantity-info}</div><div class="b-assignments">{assignments}</div>',
        groupBarTipOnDate     : '<div class="b-on-date">Rezumat pentru {startDate}</div><div class="b-summary-data">{effort-range-info}{cost-info}{quantity-info}</div><div class="b-assignments">{assignments}</div>',
        plusMore              : '+{value} mai mult',
        nameColumnText        : 'Resursă / Eveniment'
    },

    SchedulingIssueResolutionPopup : {
        'Cancel changes'   : 'Anulați modificarea și nu luați nicio acțiune',
        schedulingConflict : 'Conflict de programare',
        emptyCalendar      : 'Eroare de configurare calendar',
        cycle              : 'Ciclu de programare',
        Apply              : 'Aplicare'
    },

    CycleResolutionPopup : {
        dependencyLabel        : 'Vă rugăm să selectați o dependență:',
        invalidDependencyLabel : 'Există dependențe nevalide care trebuie adresate:'
    },

    SchedulerProBase : {
        propagating     : 'Se calculează proiectul',
        storePopulation : 'Se încarcă datele',
        finalizing      : 'Se finalizează rezultatele'
    },

    EventSegments : {
        splitEvent    : 'Împărțiți eveniment',
        renameSegment : 'Redenumire'
    },

    NestedEvents : {
        createGroup         : 'Grupează evenimentele selectate',
        newGroupName        : 'Grup nou',
        deNestingNotAllowed : 'Anularea imbricării nu este permisă',
        nestingNotAllowed   : 'Imbricarea nu este permisă'
    },

    VersionGrid : {
        compare       : 'Compară',
        description   : 'Descriere',
        occurredAt    : 'S-a întâmplat la',
        rename        : 'Redenumește',
        restore       : 'Restaurează',
        stopComparing : 'Oprește compararea'
    },

    Versions : {
        entityNames : {
            TaskModel       : 'sarcină',
            AssignmentModel : 'atribuire',
            DependencyModel : 'link',
            ProjectModel    : 'proiect',
            ResourceModel   : 'resursă',
            other           : 'obiect'
        },
        entityNamesPlural : {
            TaskModel       : 'sarcini',
            AssignmentModel : 'atribuiri',
            DependencyModel : 'link-uri',
            ProjectModel    : 'proiecte',
            ResourceModel   : 'resurse',
            other           : 'obiecte'
        },
        transactionDescriptions : {
            update : 'Schimbat {n} {entities}',
            add    : 'Adăugat {n} {entities}',
            remove : 'Înlăturat {n} {entities}',
            move   : 'Mutat {n} {entities}',
            mixed  : 'Schimbat {n} {entities}'
        },
        propertyNames : {
            active                   : 'Activ',
            allDay                   : 'Toată ziua',
            allowOverlap             : 'Permite suprapunerea',
            barMargin                : 'Margine bară',
            bidirectional            : 'Bidirecțional',
            calendar                 : 'Calendar',
            cls                      : 'Clasă CSS',
            constraintDate           : 'Data constrângerii',
            constraintType           : 'Tipul constrângerii',
            daysPerMonth             : 'Zile pe lună',
            daysPerWeek              : 'Zile pe săptămână',
            delayFromParent          : 'Întârziere de la părinte',
            direction                : 'Direcție',
            drawDependencies         : 'Desenează dependențe',
            duration                 : 'Durată',
            durationUnit             : 'Unitate de durată',
            effort                   : 'Efort',
            effortDriven             : 'Condus de efort',
            effortUnit               : 'Unitate de efort',
            endDate                  : 'Data de sfârșit',
            eventColor               : 'Culoare',
            eventId                  : 'ID Eveniment',
            eventLayout              : 'Aspect eveniment',
            eventStyle               : 'Stil bară',
            exceptionDates           : 'Date excepționale',
            fixed                    : 'Fix',
            from                     : 'De la',
            fromSide                 : 'Din partea',
            hoursPerDay              : 'Ore pe zi',
            href                     : 'Link',
            iconCls                  : 'Pictogramă',
            id                       : 'ID',
            ignoreResourceCalendar   : 'Ignoră calendarul resursei',
            ignoreTimeZone           : 'Ignoră fusul orar',
            image                    : 'Imagine',
            imageUrl                 : 'URL imagine',
            inactive                 : 'Inactiv',
            intervals                : 'Intervale',
            lag                      : 'Întârziere',
            lagUnit                  : 'Unitate de întârziere',
            lineStyle                : 'Stil linie',
            manuallyScheduled        : 'Programat manual',
            milestoneWidth           : 'Lățime reper',
            name                     : 'Nume',
            note                     : 'Notă',
            parentId                 : 'ID Părinte',
            parentIndex              : 'Poziție',
            percentDone              : '% realizat',
            postamble                : 'Postambul',
            preamble                 : 'Preambul',
            readOnly                 : 'Doar citire',
            recurrenceRule           : 'Regulă de recurență',
            resourceId               : 'ID Resursă',
            resourceMargin           : 'Margine resursă',
            rowHeight                : 'Înălțime rând',
            schedulingMode           : 'Mod de programare',
            segments                 : 'Segmente',
            showAvatar               : 'Afișează avatar',
            showInTimeline           : 'Afișează în cronologie',
            startDate                : 'Data de început',
            stickyContents           : 'Conținuturi lipicioase',
            strokeColor              : 'Culoare linie',
            style                    : 'Stil',
            target                   : 'Țintă link',
            to                       : 'Către',
            toSide                   : 'Către partea',
            type                     : 'Tip',
            units                    : 'Unități',
            unscheduled              : 'Neprogramat',
            unspecifiedTimeIsWorking : 'Timpul nespecificat este lucrativ',
            version                  : 'Versiune'
        },
        intervals : {
            working    : 'Lucrativ',
            nonWorking : 'Nelucrativ',
            fromTo     : 'De la {from} până la {to}',
            recurring  : 'Recurent începând cu {start} terminând cu {end}'
        },
        addEntity         : 'Adăugat {type} **{name}**',
        removeEntity      : 'Înlăturat {type} **{name}**',
        updateEntity      : 'Schimbat {type} **{name}**',
        moveEntity        : 'Mutat {type} **{name}** din {from} în {to}',
        addDependency     : 'Adăugat link din **{from}** în **{to}**',
        removeDependency  : 'Înlăturat link din **{from}** în **{to}**',
        updateDependency  : 'Editat link din **{from}** în **{to}**',
        addAssignment     : 'Atribuit **{resource}** în **{event}**',
        removeAssignment  : 'Înlăturat atribuire din **{resource}** din **{event}**',
        updateAssignment  : 'Editare atribuire din **{resource}** în **{event}**',
        noChanges         : 'Nicio schimbare',
        nullValue         : 'niciuna',
        versionDateFormat : 'M/D/YYYY h:mm a',
        savedAt           : 'Salvat la {date}',
        autoSavedAt       : 'Salvat automat la {date}',
        undid             : 'Anulat schimbări',
        redid             : 'Refăcut schimbări',
        editedTask        : 'Proprietățile sarcinii editate',
        deletedTask       : 'Sarcină ștearsă',
        movedTask         : 'Sarcină mutată',
        movedTasks        : 'Sarcini mutate'
    }
};

export default LocaleHelper.publishLocale(locale);
