import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Engine/localization/Lt.js';
import '../../Grid/localization/Lt.js';

const locale = {

    localeName : 'LT',
    localeDesc : 'Lietuvių',
    localeCode : 'lt-LT',
    localeRtl  : false,

    Object : {
        newEvent    : 'Naujas įvykis',
        information : 'Information',
        showDetails : 'Rodyti išsamią informaciją'
    },

    ResourceInfoColumn : {
        eventCountText : data => data + ' įvykis' + (data !== 1 ? 's' : '')
    },

    ResourceCollapseColumn : {
        toggleResourceLayout : 'Perjungti išteklių išdėstymo stulpelį. SPACE kontekstiniam meniu.'
    },

    Dependencies : {
        from    : 'Nuo',
        to      : 'Iki',
        valid   : 'Galioja',
        invalid : 'Netinkama'
    },

    DependencyType : {
        SS           : 'PrPr',
        SF           : 'PrPa',
        FS           : 'PaPr',
        FF           : 'PaPa',
        StartToStart : 'Nuo pradžios iki pradžios',
        StartToEnd   : 'Nuo pradžios iki pabaigos',
        EndToStart   : 'Nuo pabaigos iki pradžios',
        EndToEnd     : 'Nuo pabaigos iki pabaigos',
        short        : [
            'PrPr',
            'PrPa',
            'PaPr',
            'PaPa'
        ],
        long : [
            'Nuo pradžios iki pradžios',
            'Nuo pradžios iki pabaigos',
            'Nuo pabaigos iki pradžios',
            'Nuo pabaigos iki pabaigos'
        ]
    },

    DependencyEdit : {
        From              : 'Nuo',
        To                : 'Iki',
        Type              : 'Tipas',
        Lag               : 'Lag',
        color             : 'Spalva',
        lineStyle         : 'Linijos stilius',
        solid             : 'Vientisa',
        dashed            : 'Brūkšninė',
        dotted            : 'Taškinė',
        dashDot           : 'Brūkšnys-taškas',
        longDash          : 'Ilgas brūkšnys',
        'Edit dependency' : 'Redaguoti priklausomybę',
        Save              : 'Įrašyti',
        Delete            : 'Naikinti',
        Cancel            : 'Atšaukti',
        StartToStart      : 'Nuo pradžios iki pradžios',
        StartToEnd        : 'Nuo pradžios iki pabaigos',
        EndToStart        : 'Nuo pabaigos iki pradžios',
        EndToEnd          : 'Tiesioginis',
        Active            : 'Aktyvus'
    },

    EventEdit : {
        Name           : 'Pavadinimas',
        Resource       : 'Ištekliai',
        Start          : 'Pradėti',
        startTime      : 'Pradžios laikas',
        End            : 'Baigti',
        endTime        : 'Pabaigos laikas',
        Save           : 'Įrašyti',
        Delete         : 'Naikinti',
        Cancel         : 'Atšaukti',
        'Edit event'   : 'Redaguoti įvykį',
        Repeat         : 'Kartoti',
        editRecurrence : 'Redaguoti pasikartojimą'
    },

    EventDrag : {
        eventOverlapsExisting   : 'Įvykis persidengia su esamu šio ištekliaus įvykiu',
        noDropOutsideTimeline   : 'Gali būti, kad įvykis nebus visiškai pašalintas už laiko planavimo juostos ribų',
        duplicateAssignmentDrag : 'Įvykis negali būti priskirtas tam pačiam ištekliui kelis kartus'
    },

    SchedulerBase : {
        'Add event'      : 'Įtraukti įvykį',
        'Delete event'   : 'Naikinti įvykį',
        'Unassign event' : 'Atšaukti įvykį',
        color            : 'Spalva',
        eventAriaLabel   : (eventRecord, startDate) => `${eventRecord.name}, prasideda ${startDate} ${eventRecord.duration > 0 ? `trukmė ${eventRecord.fullDuration.toString(false)}` : ''}`
    },

    TimeAxisHeaderMenu : {
        pickZoomLevel   : 'Mastelis',
        activeDateRange : 'Datų diapazonas',
        startText       : 'Pradžios data',
        endText         : 'Pabaigos data',
        todayText       : 'Šiandien'
    },

    TimeAxisColumn : {
        ariaLabel : (startDate, endDate) => `Laiko ašis rodo nuo ${startDate} iki ${endDate}`
    },

    EventCopyPaste : {
        copyEvent  : 'Kopijuoti įvykį',
        cutEvent   : 'Kirpti įvykį',
        pasteEvent : 'Įklijuoti įvykį'
    },

    EventFilter : {
        filterEvents : 'Filtruoti užduotis',
        byName       : 'Pagal pavadinimą'
    },

    TimeRanges : {
        showCurrentTimeLine : 'Rodyti dabartinę laiko planavimo juostą'
    },

    PresetManager : {
        secondAndMinute : {
            displayDateFormat : 'll LTS',
            name              : 'Sekundės'
        },
        minuteAndHour : {
            topDateFormat     : 'MM/DD, ddd, val.',
            displayDateFormat : 'll LST'
        },
        hourAndDay : {
            topDateFormat     : 'MM/DD, ddd',
            middleDateFormat  : 'LST',
            displayDateFormat : 'll LST',
            name              : 'Diena'
        },
        day : {
            name : 'Diena / valandos'
        },
        week : {
            name : 'Savaitė / valandos'
        },
        dayAndWeek : {
            displayDateFormat : 'll LST',
            name              : 'Savaitė / dienos'
        },
        dayAndMonth : {
            name : 'Mėnuo'
        },
        weekAndDay : {
            displayDateFormat : 'll LST',
            name              : 'Savaitė'
        },
        weekAndMonth : {
            name : 'Savaitės'
        },
        weekAndDayLetter : {
            name : 'Savaitės / savaitės dienos'
        },
        weekDateAndMonth : {
            name : 'Mėnesiai / savaitės'
        },
        monthAndYear : {
            name : 'Mėnesiai'
        },
        year : {
            name : 'Metai'
        },
        manyYears : {
            name : 'Keli metai'
        }
    },

    RecurrenceConfirmationPopup : {
        'delete-title'              : 'Naikinate įvykį',
        'delete-all-message'        : 'Ar norite naikinti visus šio įvykio atvejus?',
        'delete-further-message'    : 'Ar norite naikinti šį ir visus būsimus šio įvykio atvejus, ar tik pasirinktus atvejus?',
        'delete-only-this-message'  : 'Ar norite ištrinti šio įvykio šį atsitikimą?',
        'delete-further-btn-text'   : 'Naikinti visus būsimus įvykius',
        'delete-only-this-btn-text' : 'Naikinti tik šį įvykį',
        'update-title'              : 'Keičiate pasikartojantį įvykį',
        'update-all-message'        : 'Ar norite pakeisti visus šio įvykio atvejus?',
        'update-further-message'    : 'Ar norite keisti tik šį įvykio atvejį, ar šį ir visus būsimus atvejus?',
        'update-only-this-message'  : 'Ar norite pakeisti šio įvykio šį atsitikimą?',
        'update-further-btn-text'   : 'Visi būsimi įvykiai',
        'update-only-this-btn-text' : 'Tik šis įvykis',
        Yes                         : 'Taip',
        Cancel                      : 'Atšaukti',
        width                       : 600
    },

    RecurrenceLegend : {
        ' and '                         : ' and ',
        Daily                           : 'Kasdien',
        'Weekly on {1}'                 : ({ days }) => `Savaitinis ${days}`,
        'Monthly on {1}'                : ({ days }) => `Mėnesinis ${days}`,
        'Yearly on {1} of {2}'          : ({ days, months }) => `Metinis ${days} iš ${months}`,
        'Every {0} days'                : ({ interval }) => `Kas ${interval} dienas`,
        'Every {0} weeks on {1}'        : ({ interval, days }) => `Kas ${interval} savaites ${days}`,
        'Every {0} months on {1}'       : ({ interval, days }) => `Kas ${interval} mėnesius ${days}`,
        'Every {0} years on {1} of {2}' : ({ interval, days, months }) => `Kiekvienus ${interval} metus ${months} mėn. ${days}`,
        position1                       : 'pirmas',
        position2                       : 'sekundė',
        position3                       : 'trečias',
        position4                       : 'ketvirtas',
        position5                       : 'penktas',
        'position-1'                    : 'paskutinis',
        day                             : 'diena',
        weekday                         : 'darbo diena',
        'weekend day'                   : 'savaitgalis',
        daysFormat                      : ({ position, days }) => `${position} ${days}`
    },

    RecurrenceEditor : {
        'Repeat event'      : 'Kartoti įvykį',
        Cancel              : 'Atšaukti',
        Save                : 'Įrašyti',
        Frequency           : 'Dažnumas',
        Every               : 'Kas',
        DAILYintervalUnit   : 'diena (-os)',
        WEEKLYintervalUnit  : 'sav.',
        MONTHLYintervalUnit : 'mėnuo (-iai)',
        YEARLYintervalUnit  : 'metai',
        Each                : 'Kiekvienas',
        on                  : 'aukščiau',
        the                 : 'į',
        'On the'            : 'Data',
        'End repeat'        : 'Baigti kartoti',
        'time(s)'           : 'kartais (-ai)',
        Days                : 'Dienas',
        Months              : 'Mėnesius'
    },

    RecurrenceDaysCombo : {
        day           : 'diena',
        weekday       : 'darbo diena',
        'weekend day' : 'savaitgalis'
    },

    RecurrencePositionsCombo : {
        position1    : 'pirmas',
        position2    : 'antras',
        position3    : 'trečias',
        position4    : 'ketvirtas',
        position5    : 'penktas',
        'position-1' : 'paskutinis'
    },

    RecurrenceStopConditionCombo : {
        Never     : 'Niekada',
        After     : 'po',
        'On date' : 'Nustatytai datai'
    },

    RecurrenceFrequencyCombo : {
        None    : 'Nekartoti',
        Daily   : 'Kasdien',
        Weekly  : 'Kas savaitę {0}',
        Monthly : 'Kas mėnesį',
        Yearly  : 'Kasmet'
    },

    RecurrenceCombo : {
        None   : 'Nėra',
        Custom : 'Pasirinktinai...'
    },

    Summary : {
        'Summary for' : date => `Santrauka skirta ${date}`
    },

    ScheduleRangeCombo : {
        completeview : 'Įvykdytas grafikas',
        currentview  : 'Dabartinis grafikas',
        daterange    : 'Datų diapazonas',
        completedata : 'Užbaigti grafiką (visų įvykių)'
    },

    SchedulerExportDialog : {
        'Schedule range' : 'Grafiko intervalas',
        'Export from'    : 'Nuo',
        'Export to'      : 'Iki'
    },

    SinglePageExporterVertical : {
        verticalsinglepage : 'Viena puslapis'
    },

    SinglePageUnscaledExporterVertical : {
        verticalsinglepageunscaled : 'Viena puslapis (nekeistas mastelis)'
    },

    MultiPageVerticalExporterVertical : {
        verticalmultipagevertical : 'Kelios puslapiai (vertikalus)'
    },

    ExcelExporter : {
        'No resource assigned' : 'Nepriskirti ištekliai'
    },

    CrudManagerView : {
        serverResponseLabel : 'Serverio atsakas:'
    },

    DurationColumn : {
        Duration : 'Trukmė'
    },

    EventClusteringBase : {
        unnamed         : 'Be pavadinimo',
        more            : count => `+ dar ${count}`,
        clusteredEvents : count => `Sugrupuoti įvykiai: ${count}`
    },

    ResourceTimeRangeClustering : {
        clusteredEvents : count => `Sugrupuoti intervalai: ${count}`
    },

    ConstraintTypePicker : {
        none                : 'Nėra',
        assoonaspossible    : 'Kaip galima greičiau',
        aslateaspossible    : 'Kaip galima vėliau',
        muststarton         : 'Turi prasidėti',
        mustfinishon        : 'Turi baigtis',
        startnoearlierthan  : 'Pradėti ne anksčiau kaip',
        startnolaterthan    : 'Pradėti ne vėliau kaip',
        finishnoearlierthan : 'Baigti ne anksčiau kaip',
        finishnolaterthan   : 'Baigti ne vėliau kaip'
    },

    EventBuffer : {
        preamblePostambleDescription : ({ preamble, postamble }) => {
            let description = '';
            if (preamble) {
                description += `.${preamble.toString()} buferio laikas prieš įvykį`;
            }
            if (postamble) {
                description += `.${postamble.toString()} buferio laikas po įvykio`;
            }
            return description;
        }
    },

    SchedulingDirectionPicker : {
        Forward       : 'Pirmyn',
        Backward      : 'Atgal',
        inheritedFrom : 'Paveldėta iš',
        enforcedBy    : 'Įgalinta pagal'
    },

    CalendarField : {
        'Default calendar' : 'Numatytasis kalendorius',
        editCalendar       : 'Redaguoti kalendorių'
    },

    TaskEditorBase : {
        Information   : 'Užduoties informacija',
        Save          : 'Įrašyti',
        Cancel        : 'Atšaukti',
        Delete        : 'Naikinti',
        calculateMask : 'Skaičiuojama...',
        saveError     : 'Negalima išsaugoti, prašome pirma ištaisyti klaidas',
        repeatingInfo : 'Pasikartojančio įvykio peržiūra',
        editRepeating : 'Redaguoti'
    },

    TaskEdit : {
        editEvent              : 'Redaguoti įvykį',
        ConfirmDeletionTitle   : 'Patvirtinti naikinimą',
        ConfirmDeletionMessage : 'Ar tikrai norite panaikinti įvykį?'
    },

    GanttTaskEditor : {
        editorWidth : '52em'
    },

    SchedulerTaskEditor : {
        editorWidth : '35em'
    },

    SchedulerGeneralTab : {
        General      : 'Bendras',
        Name         : 'Pavadinimas',
        Resources    : 'Ištekliai',
        '% complete' : '% atlikta',
        Duration     : 'Trukmė',
        Start        : 'Pradžia',
        Finish       : 'Pabaiga',
        Effort       : 'Pastanga',
        Preamble     : 'Įvadas',
        Postamble    : 'Išvados'
    },

    GeneralTab : {
        General      : 'Bendras',
        Name         : 'Pavadinimas',
        '% complete' : '% atlikta',
        Duration     : 'Trukmė',
        Start        : 'Pradžia',
        Finish       : 'Pabaiga',
        Effort       : 'Pastanga',
        Dates        : 'Datos'
    },

    SchedulerAdvancedTab : {
        Advanced                   : 'Išplėstinis',
        Calendar                   : 'Kalendorius',
        'Scheduling mode'          : 'Planavimo režimas',
        'Effort driven'            : 'Remiantis pastangomis',
        'Manually scheduled'       : 'Suplanuota rankiniu būdu',
        'Constraint type'          : 'Apribojimo tipas',
        'Constraint date'          : 'Apribojimo data',
        Inactive                   : 'Neaktyvus',
        'Ignore resource calendar' : 'Ignoruoti ištekliaus kalendorių'
    },

    CalendarEditorDatePicker : {
        addException : 'Pridėti išimtį',
        addWeek      : 'Pridėti savaitę'
    },

    CalendarEditorExceptionTab : {
        addException    : 'Pridėti išimtį',
        removeException : 'Pašalinti išimtį',
        noRows          : 'Išimčių nepridėta'
    },

    CalendarEditorWeekTab : {
        addWeek    : 'Pridėti savaitę',
        removeWeek : 'Pašalinti savaitę'
    },

    CalendarEditor : {
        daysAreWorkingByDefault    : 'Dienos veikia pagal numatytuosius nustatymus',
        workingTimeCalendar        : 'Darbo laiko kalendorius',
        exceptions                 : 'Išimtys',
        general                    : 'Generolas',
        name                       : 'vardas',
        parent                     : 'Tėvas',
        save                       : 'Sutaupyti',
        weeks                      : 'Savaitės',
        error                      : 'Klaida',
        inputErrors                : 'Yra įvesties klaidų. Pataisykite juos prieš išsaugodami pakeitimus.',
        delete                     : 'Ištrinti',
        addCalendar                : 'Pridėti kalendorių',
        confirmation               : 'Patvirtinimas',
        removeCalendarWithChildren : 'Kalendoriuje yra vaikų kalendoriai. Spustelėkite „Taip“, kad pašalintumėte kalendorių su vaikais.',
        removeCalendarAndLinks     : 'Kalendorių naudoja kai kurie įrašai. Spustelėkite „Taip“, kad atsietumėte juos ir pašalintumėte kalendorių.',
        newException               : 'Nauja išimtis',
        newWeek                    : 'Nauja savaitė'
    },

    CalendarEditorDateInfo : {
        isWorking    : ' dirba',
        isNotWorking : ' neveikia',
        basedOn      : ' remiantis:',
        byDefault    : 'pagal nutylėjimą',
        rangeTpl     : (start, end) => `${start} - ${end}`
    },

    CalendarEditorLegend : {
        workingDay    : 'Darbo diena',
        nonWorkingDay : 'Nedarbo diena'
    },

    AvailabilityRangeError : {
        errorOverlap       : 'Yra sutampančių diapazonų',
        errorMissingDate   : 'Reikalingas pradžios ir pabaigos laikas',
        errorStartAfterEnd : 'Pradžios laikas negali būti vėlesnis nei pabaigos laikas'
    },

    CalendarEditorExceptionPanel : {
        name                                 : 'vardas',
        from                                 : 'Nuo',
        to                                   : 'Į',
        is                                   : 'Is',
        nonWorking                           : 'Neveikiantis',
        working                              : 'Darbas',
        hours                                : 'Valandos',
        repeat                               : 'Pakartokite',
        repeatEnd                            : 'Pakartokite pabaigą',
        errorMissingDate                     : 'Būtina nurodyti išimties dienų seką',
        errorStartAfterEnd                   : '„Nuo“ data negali būti vėlesnė nei „Iki“.',
        errorStartAndEndRepeatNumberMismatch : 'Išimtis turėtų prasidėti ir baigtis tiek pat kartų'
    },

    CalendarEditorWeekPanel : {
        name        : 'vardas',
        from        : 'Nuo',
        to          : 'Į',
        days        : 'Dienos',
        copyDay     : 'Kopijuoti dieną',
        pasteDay    : 'Įklijavimo diena',
        stopCopying : 'Nustokite kopijuoti'
    },

    CalendarEditorAvailabilityRangeContainer : {
        addRange    : 'Pridėti diapazoną',
        removeRange : 'Pašalinti diapazoną'
    },

    CalendarEditorWeekGrid : {
        errorStartAfterEnd           : '„Nuo“ data negali būti vėlesnė nei „Iki“.',
        errorNoDefaultWeek           : 'Reikalinga savaitės konfigūracija',
        errorMultipleDefaultWeeks    : 'Nurodyta daugiau nei viena numatytoji savaitė',
        errorNoWeekAvailability      : 'Savaitė turi suteikti šiek tiek darbo laiko',
        errorInvalidWeekAvailability : 'Savaitė turi darbo laiko konfigūracijos klaidų',
        noRows                       : 'Nepridėta jokių savaičių'
    },

    AdvancedTab : {
        Advanced                   : 'Išplėstinis',
        Calendar                   : 'Kalendorius',
        'Scheduling mode'          : 'Planavimo režimas',
        'Effort driven'            : 'Remiantis pastangos',
        'Manually scheduled'       : 'Suplanuota rankiniu būdu',
        'Constraint type'          : 'Apribojimo tipas',
        'Constraint date'          : 'Apribojimo data',
        Constraint                 : 'Apribojimas',
        Rollup                     : 'Rollup',
        Inactive                   : 'Neaktyvus',
        'Ignore resource calendar' : 'Ignoruoti ištekliaus kalendorių',
        'Scheduling direction'     : 'Planavimo kryptis',
        projectBorder              : 'Projekto siena',
        ignore                     : 'Ignoruoti',
        honor                      : 'Garbė',
        askUser                    : 'Paklausk vartotojo'
    },

    DependencyTab : {
        Predecessors      : 'Pirmtakai',
        Successors        : 'Perėmėjai',
        ID                : 'ID',
        Name              : 'Pavadinimas',
        Type              : 'Tipas',
        Lag               : 'Delsa',
        cyclicDependency  : 'Ciklinis priklausymas',
        invalidDependency : 'Negaliojantis priklausymas',
        readOnlyTask      : 'Negalima susieti tik skaitymui skirtos užduoties'
    },

    NotesTab : {
        Notes : 'Notes'
    },

    ResourceCalendarColumn : {
        calendar : 'Kalendorius'
    },

    ResourceEdit : {
        editResource : 'Redaguoti išteklius'
    },

    ResourceEditor : {
        resourceInformation : 'Išteklių informacija',
        costs               : 'Išlaidos',
        save                : 'Išsaugoti',
        error               : 'Klaida',
        inputErrors         : 'Yra įvesties klaidų. Pataisykite juos prieš išsaugodami pakeitimus.',
        delete              : 'Ištrinti',
        confirmation        : 'Patvirtinimas',
        removeUsedResource  : 'Išteklius priskiriamas kai kurioms užduotims. Spustelėkite „Taip“, kad vis tiek pašalintumėte šaltinį.'
    },

    ResourceEditorGeneralTab : {
        calendar    : 'Kalendorius',
        general     : 'Generolas',
        label       : 'Medžiagos etiketė',
        name        : 'Ištekliaus pavadinimas',
        type        : 'Tipas',
        costAccrual : 'Išlaidų kaupimas',
        labelHint   : 'pavyzdžiui, kg, tonos arba dėžės',
        maxUnits    : 'Maksimalus vienetų skaičius'
    },

    ResourceCostAccrualColumn : {
        accrueAt : 'Sukaupti',
        prorated : 'Proporcingas',
        start    : 'Pradėti',
        end      : 'Pabaiga'
    },

    CostAccrualField : {
        prorated : 'Proporcingas',
        start    : 'Pradėti',
        end      : 'Pabaiga'
    },

    ResourceType : {
        work     : 'Darbas',
        material : 'Medžiaga',
        cost     : 'Kaina'
    },

    ResourceTypeColumn : {
        type : 'Tipas'
    },

    ResourceEditorRateTablesTab : {
        rateTable    : 'Kainų lentelė',
        newGroup     : 'Naujas stalas',
        removeGroup  : 'Pašalinti lentelę',
        useByDefault : 'Pagal numatytuosius nustatymus naudokite išteklių priskyrimui',
        noRates      : 'Jokių tarifų'
    },

    ResourceGrid : {
        name          : 'Vardas',
        materialLabel : 'Medžiagos etiketė',
        maxUnits      : 'Maks. vienetai',
        cost          : 'Kaina',
        noRows        : 'Jokių išteklių'
    },

    ResourceRateTableContainer : {
        startDate    : 'Pradžios data',
        standardRate : 'Standartinis tarifas',
        perUseCost   : 'Naudojimo kaina',
        addRate      : 'Pridėti kursą',
        removeRate   : 'Pašalinti normą',
        name         : 'Vardas',
        noRates      : 'Jokių tarifų'
    },

    ResourceRateTableEditor : {
        rateTableInformation : 'Informacija apie tarifų lentelę'
    },

    ResourcesTab : {
        unitsTpl    : ({ column, value }) => column.formatValue(value) + '%',
        quantityTpl : ({ record, value }) => `${value || 0} ${record.resource?.materialLabel || ''}`,
        quantity    : 'Kiekis',
        Resources   : 'Ištekliai',
        Resource    : 'Ištekliai',
        Units       : 'Vienetai',
        cost        : 'Kaina',
        effort      : 'Pastangos',
        start       : 'Pradėti',
        finish      : 'Baigti',
        preamble    : 'Pradžia',
        postamble   : 'Pabaiga'
    },

    RateTableColumn : {
        rateTable : 'Kainų lentelė'
    },

    RecurrenceTab : {
        title : 'Repeat'
    },

    SchedulingModePicker : {
        Normal           : 'Normalus',
        'Fixed Duration' : 'Fiksuota trukmė',
        'Fixed Units'    : 'Fiksuoti vienetai',
        'Fixed Effort'   : 'Fiksuotos pastangos'
    },

    ResourceHistogram : {
        barTipInRange         : '<b>{resource}</b> {startDate} - {endDate}<br><span class="{cls}">{allocated} iš {available}</span> paskirto',
        barTipOnDate          : '<b>{resource}</b> (data){startDate}<br><span class="{cls}">{allocated} iš {available}</span> paskirto',
        groupBarTipAssignment : '<b>{resource}</b> - <span class="{cls}">{allocated} iš {available}</span>',
        groupBarTipInRange    : '{startDate} - {endDate}<br><span class="{cls}">{allocated} iš {available}</span> paskirto:<br>{assignments}',
        groupBarTipOnDate     : ' (data){startDate}<br><span class="{cls}">{allocated} iš {available}</span> paskirto:<br>{assignments}',
        plusMore              : '+{value} daugiau'
    },

    ResourceUtilization : {
        effortRangeInfo       : '<div class="b-effort-range-data"><div class="b-effort-label">Pastangos</div><div class="b-effort-value {cls}">{allocated} iš {available}</div></div>',
        effortInfo            : '<div class="b-effort-data"><div class="b-effort-label">Pastangos</div><div class="b-effort-value {cls}">{allocated}</div></div>',
        costInfo              : '<div class="b-cost-data"><div class="b-effort-label">Kaina</div><div class="b-effort-value b-cost">{cost}</div></div>',
        quantityInfo          : '<div class="b-quantity-data"><div class="b-effort-label">Kiekis</div><div class="b-effort-value b-quantity">{quantity}</div></div>',
        barTipInRange         : '<div class="b-on-date">{event} {startDate} - {endDate}</div><div class="b-summary-data">{effort-info}{cost-info}{quantity-info}</div>',
        barTipOnDate          : '<div class="b-on-date">{event} {startDate}</div><div class="b-summary-data">{effort-info}{cost-info}{quantity-info}</div>',
        groupBarTipAssignment : '<div class="b-assignment"><div class="b-assignment-name">{event}</div>{effort-info}{cost-info}{quantity-info}</div>',
        groupBarTipInRange    : '<div class="b-on-date">Santrauka {startDate} - {endDate}</div><div class="b-summary-data">{effort-range-info}{cost-info}{quantity-info}</div><div class="b-assignments">{assignments}</div>',
        groupBarTipOnDate     : '<div class="b-on-date">Santrauka {startDate}</div><div class="b-summary-data">{effort-range-info}{cost-info}{quantity-info}</div><div class="b-assignments">{assignments}</div>',
        plusMore              : '+{value} daugiau',
        nameColumnText        : 'Išteklius / Įvykis'
    },

    SchedulingIssueResolutionPopup : {
        'Cancel changes'   : 'Atšaukti keitimą ir nieko nedaryti',
        schedulingConflict : 'Planavimo neatitikimas',
        emptyCalendar      : 'Kalendoriaus konfigūravimo klaida',
        cycle              : 'Planavimo ciklas',
        Apply              : 'Taikyti'
    },

    CycleResolutionPopup : {
        dependencyLabel        : 'Pasirinkite priklausomybę:',
        invalidDependencyLabel : 'Yra netinkamų susijusių priklausomybių, į kurias reikia atsižvelgti:'
    },

    SchedulerProBase : {
        propagating     : 'Projekto skaičiavimas',
        storePopulation : 'Įkeliami duomenys',
        finalizing      : 'Baigiami rezultatai'
    },

    EventSegments : {
        splitEvent    : 'Perskirti įvykį',
        renameSegment : 'Pervardyti'
    },

    NestedEvents : {
        createGroup         : 'Grupuoti pasirinktus įvykius',
        newGroupName        : 'Nauja grupė',
        deNestingNotAllowed : 'Negalima įdėti dar kartą',
        nestingNotAllowed   : 'Negalima įdėti'
    },

    VersionGrid : {
        compare       : 'Palyginti',
        description   : 'Aprašymas',
        occurredAt    : 'Įvyko',
        rename        : 'Pervardyti',
        restore       : 'Atkurti',
        stopComparing : 'Sustabdyti lyginimą'
    },

    Versions : {
        entityNames : {
            TaskModel       : 'užduotis',
            AssignmentModel : 'priskyrimas',
            DependencyModel : 'saitas',
            ProjectModel    : 'projektas',
            ResourceModel   : 'išteklius',
            other           : 'objektas'
        },
        entityNamesPlural : {
            TaskModel       : 'užduotys',
            AssignmentModel : 'priskyrimai',
            DependencyModel : 'saitai',
            ProjectModel    : 'projektai',
            ResourceModel   : 'resources',
            other           : 'objektai'
        },
        transactionDescriptions : {
            update : 'Pakeista {n} {entities}',
            add    : 'Pridėta {n} {entities}',
            remove : 'Pašalinta {n} {entities}',
            move   : 'Perkelta {n} {entities}',
            mixed  : 'Pakeista {n} {entities}'
        },
        propertyNames : {
            active                   : 'Aktyvus',
            allDay                   : 'Visą dieną',
            allowOverlap             : 'Leisti persidengimą',
            barMargin                : 'Juostos kraštinė',
            bidirectional            : 'Dvikryptis',
            calendar                 : 'Kalendorius',
            cls                      : 'CSS klasė',
            constraintDate           : 'Apribojimo data',
            constraintType           : 'Apribojimo tipas',
            daysPerMonth             : 'Dienos per mėnesį',
            daysPerWeek              : 'Dienos per savaitę',
            delayFromParent          : 'Vėlavimas nuo tėvo',
            direction                : 'Kryptis',
            drawDependencies         : 'Piešti priklausomybes',
            duration                 : 'Trukmė',
            durationUnit             : 'Trukmės vienetas',
            effort                   : 'Pastangos',
            effortDriven             : 'Pastangomis pagrįstas',
            effortUnit               : 'Pastangų vienetas',
            endDate                  : 'Pabaigos data',
            eventColor               : 'Spalva',
            eventId                  : 'Įvykio ID',
            eventLayout              : 'Įvykio išdėstymas',
            eventStyle               : 'Juostos stilius',
            exceptionDates           : 'Išimties datos',
            fixed                    : 'Fiksuotas',
            from                     : 'Nuo',
            fromSide                 : 'Iš pusės',
            hoursPerDay              : 'Valandos per dieną',
            href                     : 'Nuoroda',
            iconCls                  : 'Piktograma',
            id                       : 'ID',
            ignoreResourceCalendar   : 'Ignoruoti išteklių kalendorių',
            ignoreTimeZone           : 'Ignoruoti laiko zoną',
            image                    : 'Vaizdas',
            imageUrl                 : 'Vaizdo URL',
            inactive                 : 'Neaktyvus',
            intervals                : 'Intervalai',
            lag                      : 'Vėlavimas',
            lagUnit                  : 'Vėlavimo vienetas',
            lineStyle                : 'Linijos stilius',
            manuallyScheduled        : 'Rankiniu būdu suplanuotas',
            milestoneWidth           : 'Etapo plotis',
            name                     : 'Pavadinimas',
            note                     : 'Pastaba',
            parentId                 : 'Tėvo ID',
            parentIndex              : 'Pozicija',
            percentDone              : '% atlikta',
            postamble                : 'Postambulas',
            preamble                 : 'Preambulas',
            readOnly                 : 'Tik skaitymui',
            recurrenceRule           : 'Pasikartojimo taisyklė',
            resourceId               : 'Išteklio ID',
            resourceMargin           : 'Išteklių kraštinė',
            rowHeight                : 'Eilutės aukštis',
            schedulingMode           : 'Planavimo režimas',
            segments                 : 'Segmentai',
            showAvatar               : 'Rodyti avatarą',
            showInTimeline           : 'Rodyti laiko juostoje',
            startDate                : 'Pradžios data',
            stickyContents           : 'Lipnus turinys',
            strokeColor              : 'Linijos spalva',
            style                    : 'Stilius',
            target                   : 'Nuorodos tikslas',
            to                       : 'Iki',
            toSide                   : 'Į pusę',
            type                     : 'Tipas',
            units                    : 'Vienetai',
            unscheduled              : 'Nesuplanuotas',
            unspecifiedTimeIsWorking : 'Nenurodytas laikas yra darbo',
            version                  : 'Versija'
        },
        intervals : {
            working    : 'Dirbama',
            nonWorking : 'Nedirbama',
            fromTo     : 'Nuo {from} iki {to}',
            recurring  : 'Pasikartojantis prasideda {start} baigiasi {end}'
        },
        addEntity         : 'Pridėta {type} **{name}**',
        removeEntity      : 'Pašalinta {type} **{name}**',
        updateEntity      : 'Pakeista {type} **{name}**',
        moveEntity        : 'Perkelta {type} **{name}** iš {from} į {to}',
        addDependency     : 'Pridėta nuoroda iš **{from}** į **{to}**',
        removeDependency  : 'Pašalinta nuoroda iš **{from}** į **{to}**',
        updateDependency  : 'Redaguota nuoroda iš **{from}** į **{to}**',
        addAssignment     : 'Priskirta **{resource}** į **{event}**',
        removeAssignment  : 'Pašalinti priskyrimą **{resource}** iš **{event}**',
        updateAssignment  : 'Redaguotas priskyrimas **{resource}** į **{event}**',
        noChanges         : 'Pakeitimų nėra',
        nullValue         : 'nėra',
        versionDateFormat : 'MMMMM/MM/DD val. min.',
        savedAt           : 'Išsaugota {date}',
        autoSavedAt       : 'Automatiškai išsaugota {date}',
        undid             : 'Atšaukti pakeitimus',
        redid             : 'Pertvarkyti pakeitimus',
        editedTask        : 'Redaguotos užduoties ypatybės',
        deletedTask       : 'Naikinti užduotį',
        movedTask         : 'Perkelta užduotis',
        movedTasks        : 'Perkeltos užduotys'
    }
};

export default LocaleHelper.publishLocale(locale);
