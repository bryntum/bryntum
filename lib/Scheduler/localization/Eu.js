import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Engine/localization/Eu.js';
import '../../Grid/localization/Eu.js';

const locale = {

    localeName : 'Eu',
    localeDesc : 'Euskara',
    localeCode : 'eu-ES',
    localeRtl  : false,

    Object : {
        newEvent    : 'Gertaera berria',
        information : 'Informazioa',
        showDetails : 'Xehetasunak erakutsi'
    },

    ResourceInfoColumn : {
        eventCountText : data => data + ' gertaera' + (data !== 1 ? 's' : '')
    },

    ResourceCollapseColumn : {
        toggleResourceLayout : 'Errekurtsoen diseinuaren zutabea aldatu. SPACE testuinguru-menua.'
    },

    Dependencies : {
        from    : 'Hasiera',
        to      : 'Amaiera',
        valid   : 'Baliozkoa',
        invalid : 'Baliogabea'
    },

    DependencyType : {
        SS           : 'HH',
        SF           : 'HA',
        FS           : 'AH',
        FF           : 'AA',
        StartToStart : 'Hasieratik-hasierara',
        StartToEnd   : 'Hasieratik-amaierara',
        EndToStart   : 'Amaieratik-hasierara',
        EndToEnd     : 'Amaieratik-amaierara',
        short        : [
            'HH',
            'HA',
            'AH',
            'AA'
        ],
        long : [
            'Hasieratik-hasierara',
            'Hasieratik-amaierara',
            'Amaieratik-hasierara',
            'Amaieratik-amaierara'
        ]
    },

    DependencyEdit : {
        From              : 'Hasiera',
        To                : 'Amaiera',
        Type              : 'Mota',
        Lag               : 'Atzerapena',
        color             : 'Kolorea',
        lineStyle         : 'Lerro estiloa',
        solid             : 'Solidoa',
        dashed            : 'Marraztua',
        dotted            : 'Puntuzkoa',
        dashDot           : 'Marra-puntua',
        longDash          : 'Marra luzea',
        'Edit dependency' : 'Editatu mendekotasuna',
        Save              : 'Gorde',
        Delete            : 'Ezabatu',
        Cancel            : 'Utzi',
        StartToStart      : 'Hasieratik hasierara',
        StartToEnd        : 'Hasieratik amaierara',
        EndToStart        : 'Amaieratik hasierara',
        EndToEnd          : 'Amaieratik amaierara',
        Active            : 'Aktibo'
    },

    EventEdit : {
        Name           : 'Izena',
        Resource       : 'Baliabidea',
        Start          : 'Hasi',
        startTime      : 'Hasiera-ordua',
        End            : 'Amaiera',
        endTime        : 'Amaiera-ordua',
        Save           : 'Gorde',
        Delete         : 'Ezabatu',
        Cancel         : 'Utzi',
        'Edit event'   : 'Editatu gertaera',
        Repeat         : 'Errepikatu',
        editRecurrence : 'Editatu errepikapena'
    },

    EventDrag : {
        eventOverlapsExisting   : 'Gertaera baliabide honen gertaera batean gainjartzen da',
        noDropOutsideTimeline   : 'Baliteke gertaera guztiz ez kentzea denbora-lerrotik kanpo',
        duplicateAssignmentDrag : 'Ekitaldia ezin da baliabide berean hainbat aldiz esleitu'
    },

    SchedulerBase : {
        'Add event'      : 'Gehitu gertaera',
        'Delete event'   : 'Ezabatu gertaera',
        'Unassign event' : 'Kendu gertaeraren esleipena',
        color            : 'Kolorea',
        eventAriaLabel   : (eventRecord, startDate) => `${eventRecord.name}, hasten da ${startDate} ${eventRecord.duration > 0 ? `${eventRecord.fullDuration.toString(false)} irauten du` : ''}`
    },

    TimeAxisHeaderMenu : {
        pickZoomLevel   : 'Zooma',
        activeDateRange : 'Data-tartea',
        startText       : 'Hasiera-data',
        endText         : 'Amaiera-data',
        todayText       : 'Gaur'
    },

    TimeAxisColumn : {
        ariaLabel : (startDate, endDate) => `Denbora ardatza erakusten ${startDate} eta ${endDate}`
    },

    EventCopyPaste : {
        copyEvent  : 'Kopiatu gertaera',
        cutEvent   : 'Moztu gertaera',
        pasteEvent : 'Iraganeko gertaera'
    },

    EventFilter : {
        filterEvents : 'Iragazi zereginak',
        byName       : 'Izenaren arabera'
    },

    TimeRanges : {
        showCurrentTimeLine : 'Erakutsi uneko denbora-eskala'
    },

    PresetManager : {
        secondAndMinute : {
            displayDateFormat : 'll LTS',
            name              : 'Segundoak'
        },
        minuteAndHour : {
            topDateFormat     : 'ddd MM/DD, hA',
            displayDateFormat : 'll LST'
        },
        hourAndDay : {
            topDateFormat     : 'ddd MM/DD',
            middleDateFormat  : 'LST',
            displayDateFormat : 'll LST',
            name              : 'Eguna'
        },
        day : {
            name : 'Eguna/orduak'
        },
        week : {
            name : 'Astea/orduak'
        },
        dayAndWeek : {
            displayDateFormat : 'll LST',
            name              : 'Astea/egunak'
        },
        dayAndMonth : {
            name : 'Month'
        },
        weekAndDay : {
            displayDateFormat : 'll LST',
            name              : 'Astea'
        },
        weekAndMonth : {
            name : 'Asteak'
        },
        weekAndDayLetter : {
            name : 'Asteak/Lanegunak'
        },
        weekDateAndMonth : {
            name : 'Hilabeteak/Asteak'
        },
        monthAndYear : {
            name : 'Hilabeteak'
        },
        year : {
            name : 'Urteak'
        },
        manyYears : {
            name : 'Urte bat baino gehiago'
        }
    },

    RecurrenceConfirmationPopup : {
        'delete-title'              : 'Gertaera bat ezabatzera zoaz',
        'delete-all-message'        : 'Gertaera honen agerraldi guztiak ezabatu nahi dituzu?',
        'delete-further-message'    : 'Gertaeraren agerraldi hau bakarrik ezabatu nahi al duzu, edo hautatutakoa bakarrik?',
        'delete-only-this-message'  : 'Gertaera honen agerpen hau ezabatu nahi duzu?',
        'delete-further-btn-text'   : 'Ezabatu etorkizuneko gertaera guztiak',
        'delete-only-this-btn-text' : 'Ezabatu gertaera hau soilik',
        'update-title'              : 'Gertaera errepikari bat aldatzera zoaz',
        'update-all-message'        : 'Gertaera honen agerraldi guztiak aldatu nahi dituzu?',
        'update-further-message'    : 'Gertaeraren agerraldi hau bakarrik aldatu nahi al duzu, edo hau eta etorkizuneko guztiak?',
        'update-only-this-message'  : 'Gertaera honen agerpen hau aldatu nahi duzu?',
        'update-further-btn-text'   : 'Etorkizuneko gertaera guztiak',
        'update-only-this-btn-text' : 'Gertaera hau soilik',
        Yes                         : 'Bai',
        Cancel                      : 'Utzi',
        width                       : 600
    },

    RecurrenceLegend : {
        ' and '                         : ' eta ',
        Daily                           : 'Egunero',
        'Weekly on {1}'                 : ({ days }) => `${days} astean behin`,
        'Monthly on {1}'                : ({ days }) => `H${days} hilabetean behin`,
        'Yearly on {1} of {2}'          : ({ days, months }) => `${days} urtean behin, hilabete honetan: ${months}`,
        'Every {0} days'                : ({ interval }) => `${interval} egunean behin`,
        'Every {0} weeks on {1}'        : ({ interval, days }) => `${days} astean behin, egun honetan: ${interval}`,
        'Every {0} months on {1}'       : ({ interval, days }) => `${interval} hilean behin, egun honetan: ${days}`,
        'Every {0} years on {1} of {2}' : ({ interval, days, months }) => `${interval} urtean behin, ${months}ren ${days} egunean`,
        position1                       : 'lehen',
        position2                       : 'bigarren',
        position3                       : 'hirugarren',
        position4                       : 'laugarren',
        position5                       : 'bosgarren',
        'position-1'                    : 'azken',
        day                             : 'egun',
        weekday                         : 'asteguna',
        'weekend day'                   : 'asteburuko eguna',
        daysFormat                      : ({ position, days }) => `${position} ${days}`
    },

    RecurrenceEditor : {
        'Repeat event'      : 'Errepikatu gertaera',
        Cancel              : 'Utzi',
        Save                : 'Gorde',
        Frequency           : 'Maiztasuna',
        Every               : 'Maiztasuna:',
        DAILYintervalUnit   : 'egun',
        WEEKLYintervalUnit  : 'aste',
        MONTHLYintervalUnit : 'hilabete',
        YEARLYintervalUnit  : 'urte',
        Each                : 'Bakoitza',
        on                  : 'Du',
        the                 : 'Du',
        'On the'            : 'Egun honetan',
        'End repeat'        : 'Amaitu errepikapena',
        'time(s)'           : '(s) bider',
        Days                : 'Egunean',
        Months              : 'Hilean'
    },

    RecurrenceDaysCombo : {
        day           : 'egun',
        weekday       : 'asteguna',
        'weekend day' : 'asteburuko eguna'
    },

    RecurrencePositionsCombo : {
        position1    : 'lehen',
        position2    : 'bigarren',
        position3    : 'hirugarren',
        position4    : 'laugarren',
        position5    : 'bosgarren',
        'position-1' : 'azken'
    },

    RecurrenceStopConditionCombo : {
        Never     : 'Inoiz ez',
        After     : 'geroago',
        'On date' : 'Data honetan'
    },

    RecurrenceFrequencyCombo : {
        None    : 'Ez errepikatu',
        Daily   : 'Egunero',
        Weekly  : 'Astero egun honetan: {0}',
        Monthly : 'Hilero',
        Yearly  : 'Urtero'
    },

    RecurrenceCombo : {
        None   : 'Bat ere ez',
        Custom : 'Pertsonalizatua...'
    },

    Summary : {
        'Summary for' : date => `Laburpena ${date}`
    },

    ScheduleRangeCombo : {
        completeview : 'Antolaketa osoa',
        currentview  : 'Ikusgai dagoen antolaketa',
        daterange    : 'Data-tartea',
        completedata : 'Antolaketa osoa (gertaera guztietarako)'
    },

    SchedulerExportDialog : {
        'Schedule range' : 'Antolaketa-tartea',
        'Export from'    : 'Hasiera',
        'Export to'      : 'Amaiera'
    },

    SinglePageExporterVertical : {
        verticalsinglepage : 'Orri bakarra'
    },

    SinglePageUnscaledExporterVertical : {
        verticalsinglepageunscaled : 'Orri bakarra (eskalatu gabe)'
    },

    MultiPageVerticalExporterVertical : {
        verticalmultipagevertical : 'Orri anitzak (bertikala)'
    },

    ExcelExporter : {
        'No resource assigned' : 'Ez da esleitu baliabiderik'
    },

    CrudManagerView : {
        serverResponseLabel : 'Zerbitzariaren erantzuna:'
    },

    DurationColumn : {
        Duration : 'Iraupena'
    },

    EventClusteringBase : {
        unnamed         : 'Izenik gabe',
        more            : count => `+ ${count} gehiago`,
        clusteredEvents : count => `Taldekatutako gertaerak: ${count}`
    },

    ResourceTimeRangeClustering : {
        clusteredEvents : count => `Taldekatutako tarteak: ${count}`
    },

    ConstraintTypePicker : {
        none                : 'Bat ere ez',
        assoonaspossible    : 'Lehenbailehen',
        aslateaspossible    : 'Ahalik eta beranduen',
        muststarton         : 'Egun honetan hasi behar du',
        mustfinishon        : 'Egun honetan amaitu behar du',
        startnoearlierthan  : 'Ez hasi egun hau baino lehen',
        startnolaterthan    : 'Ez hasi egun hau baino gero',
        finishnoearlierthan : 'Ez amaitu egun hau baino lehenago',
        finishnolaterthan   : 'Ez amaitu egun hau baino geroago'
    },

    EventBuffer : {
        preamblePostambleDescription : ({ preamble, postamble }) => {
            let description = '';
            if (preamble) {
                description += `.${preamble.toString()} ekitaldiaren aurreko buffer denbora`;
            }
            if (postamble) {
                description += `.${postamble.toString()} ekitaldiaren ondorengo buffer denbora`;
            }
            return description;
        }
    },

    SchedulingDirectionPicker : {
        Forward       : 'Birbidali',
        Backward      : 'Atzera',
        inheritedFrom : 'Hemendik heredatua',
        enforcedBy    : 'Honek aplikatzen du'
    },

    CalendarField : {
        'Default calendar' : 'Egutegi lehenetsia',
        editCalendar       : 'Editatu egutegia'
    },

    TaskEditorBase : {
        Information   : 'Zereginen informazioa',
        Save          : 'Gorde',
        Cancel        : 'Utzi',
        Delete        : 'Ezabatu',
        calculateMask : 'Kalkulatzen...',
        saveError     : 'Ezin duzu gorde, mesedez, lehenbizi akatsak zuzendu',
        repeatingInfo : 'Gertaera errepikakor bat ikusten',
        editRepeating : 'Editatu'
    },

    TaskEdit : {
        editEvent              : 'Editatu gertaera',
        ConfirmDeletionTitle   : 'Berretsi ezabatu nahi duzula',
        ConfirmDeletionMessage : 'Ziur gertaera ezabatu nahi duzula?'
    },

    GanttTaskEditor : {
        editorWidth : '52em'
    },

    SchedulerTaskEditor : {
        editorWidth : '35em'
    },

    SchedulerGeneralTab : {
        General      : 'Orokorra',
        Name         : 'Izena',
        Resources    : 'Baliabideak',
        '% complete' : 'Osatutako %',
        Duration     : 'Iraupena',
        Start        : 'Hasi',
        Finish       : 'Bukatu',
        Effort       : 'Saioa',
        Preamble     : 'Hitzaurrea',
        Postamble    : 'Hitzostekoa'
    },

    GeneralTab : {
        General      : 'Orokorra',
        Name         : 'Izena',
        '% complete' : 'Osatutako %',
        Duration     : 'Iraupena',
        Start        : 'Hasi',
        Finish       : 'Bukatu',
        Effort       : 'Saioa',
        Dates        : 'Datak'
    },

    SchedulerAdvancedTab : {
        Advanced                   : 'Aurreratua',
        Calendar                   : 'Egutegia',
        'Scheduling mode'          : 'Programazio-modua',
        'Effort driven'            : 'Bultzatutako saioa',
        'Manually scheduled'       : 'Eskuz programatua',
        'Constraint type'          : 'Murrizketa-mota',
        'Constraint date'          : 'Mugaeguna',
        Inactive                   : 'Inaktiboa',
        'Ignore resource calendar' : 'Ez ikusi baliabideen egutegia'
    },

    CalendarEditorDatePicker : {
        addException : 'Gehitu salbuespena',
        addWeek      : 'Gehitu astea'
    },

    CalendarEditorExceptionTab : {
        addException    : 'Gehitu salbuespena',
        removeException : 'Kendu salbuespena',
        noRows          : 'Ez da salbuespenik gehitu'
    },

    CalendarEditorWeekTab : {
        addWeek    : 'Gehitu astea',
        removeWeek : 'Kendu astea'
    },

    CalendarEditor : {
        daysAreWorkingByDefault    : 'Egunak lehenespenez funtzionatzen ari dira',
        workingTimeCalendar        : 'Lanaldiaren egutegia',
        exceptions                 : 'Salbuespenak',
        general                    : 'Orokorra',
        name                       : 'Izena',
        parent                     : 'Gurasoa',
        save                       : 'Gorde',
        weeks                      : 'Asteak',
        error                      : 'Errorea',
        inputErrors                : 'Sarrerako akatsak daude. Mesedez, konpondu itzazu aldaketak gorde aurretik.',
        delete                     : 'Ezabatu',
        addCalendar                : 'Gehitu egutegi bat',
        confirmation               : 'Berrespena',
        removeCalendarWithChildren : 'Egutegiak umeen egutegiak ditu. Sakatu "Bai" bere seme-alabekin egutegia kentzeko.',
        removeCalendarAndLinks     : 'Erregistro batzuek erabiltzen dute egutegia. Egin klik "Bai" lotura kentzeko eta egutegia kentzeko.',
        newException               : 'Salbuespen berria',
        newWeek                    : 'Aste berria'
    },

    CalendarEditorDateInfo : {
        isWorking    : ' lanean ari da',
        isNotWorking : ' ez dabil',
        basedOn      : ' oinarrituta:',
        byDefault    : 'lehenetsiz',
        rangeTpl     : (start, end) => `${start} - ${end}`
    },

    CalendarEditorLegend : {
        workingDay    : 'Lanaldia',
        nonWorkingDay : 'Langabeko eguna'
    },

    AvailabilityRangeError : {
        errorOverlap       : 'Gainjarritako tarteak daude',
        errorMissingDate   : 'Hasiera eta amaiera orduak behar dira',
        errorStartAfterEnd : 'Hasiera-ordua ezin da izan amaiera-orduaren ondorengoa'
    },

    CalendarEditorExceptionPanel : {
        name                                 : 'Izena',
        from                                 : 'Bertatik',
        to                                   : 'To',
        is                                   : 'Da',
        nonWorking                           : 'Langabea',
        working                              : 'Lanean',
        hours                                : 'Orduak',
        repeat                               : 'Errepikatu',
        repeatEnd                            : 'Errepikatu amaiera',
        errorMissingDate                     : 'Salbuespen data-tartea beharrezkoa da',
        errorStartAfterEnd                   : '"Hasieratik" data ezin da izan "Noitik" dataren ondorengoa',
        errorStartAndEndRepeatNumberMismatch : 'Salbuespenak aldi berean hasi eta amaitu behar du'
    },

    CalendarEditorWeekPanel : {
        name        : 'Izena',
        from        : 'Bertatik',
        to          : 'To',
        days        : 'Egunak',
        copyDay     : 'Kopiaren eguna',
        pasteDay    : 'Itsatsi eguna',
        stopCopying : 'Utzi kopiatzeari'
    },

    CalendarEditorAvailabilityRangeContainer : {
        addRange    : 'Gehitu barrutia',
        removeRange : 'Kendu barrutia'
    },

    CalendarEditorWeekGrid : {
        errorStartAfterEnd           : '"Hasieratik" data ezin da izan "Noitik" dataren ondorengoa',
        errorNoDefaultWeek           : 'Asteko konfigurazioa beharrezkoa da',
        errorMultipleDefaultWeeks    : 'Aste lehenetsi bat baino gehiago zehazten da',
        errorNoWeekAvailability      : 'Asteak lanaldi bat eman behar du',
        errorInvalidWeekAvailability : 'Asteak lan-orduaren konfigurazio-erroreak ditu',
        noRows                       : 'Ez da asterik gehitu'
    },

    AdvancedTab : {
        Advanced                   : 'Aurreratua',
        Calendar                   : 'Egutegia',
        'Scheduling mode'          : 'Programazio-modua',
        'Effort driven'            : 'Bultzatutako saioa',
        'Manually scheduled'       : 'Eskuz programatua',
        'Constraint type'          : 'Murrizketa-mota',
        'Constraint date'          : 'Mugaeguna',
        Constraint                 : 'Murrizketa',
        Rollup                     : 'Bildu',
        Inactive                   : 'Inaktiboa',
        'Ignore resource calendar' : 'Ez ikusi baliabideen egutegia',
        'Scheduling direction'     : 'Programazioaren orientazioa',
        projectBorder              : 'Proiektuaren muga',
        ignore                     : 'Ez ikusi',
        honor                      : 'Ohore',
        askUser                    : 'Galdetu erabiltzaileari'
    },

    DependencyTab : {
        Predecessors      : 'Aurrekoak',
        Successors        : 'Ondorengoak',
        ID                : 'IDa',
        Name              : 'Izena',
        Type              : 'Mota',
        Lag               : 'Atzerapena',
        cyclicDependency  : 'Mendekotasun ziklikoa',
        invalidDependency : 'Mendekotasun baliogabea',
        readOnlyTask      : 'Ezin da irakurtzeko soilik den zeregina lotu'
    },

    NotesTab : {
        Notes : 'Notes'
    },

    ResourceCalendarColumn : {
        calendar : 'Egutegia'
    },

    ResourceEdit : {
        editResource : 'Editatu baliabidea'
    },

    ResourceEditor : {
        resourceInformation : 'Baliabideen informazioa',
        costs               : 'Kostuak',
        save                : 'Gorde',
        error               : 'Errorea',
        inputErrors         : 'Sarrerako akatsak daude. Mesedez, konpondu itzazu aldaketak gorde aurretik.',
        delete              : 'Ezabatu',
        confirmation        : 'Berrespena',
        removeUsedResource  : 'Baliabidea zeregin batzuei esleitzen zaie. Egin klik "Bai" baliabidea hala ere kentzeko.'
    },

    ResourceEditorGeneralTab : {
        calendar    : 'Egutegia',
        general     : 'Orokorra',
        label       : 'Materialaren etiketa',
        name        : 'Baliabidearen izena',
        type        : 'Mota',
        costAccrual : 'Kostuen sortzapena',
        labelHint   : 'adibidez, kg, tona edo kaxak',
        maxUnits    : 'Unitate maximoak'
    },

    ResourceCostAccrualColumn : {
        accrueAt : 'Sortu orduko',
        prorated : 'Prorratekatua',
        start    : 'Hasi',
        end      : 'Amaiera'
    },

    CostAccrualField : {
        prorated : 'Prorratekatua',
        start    : 'Hasi',
        end      : 'Amaiera'
    },

    ResourceType : {
        work     : 'Lana',
        material : 'Materiala',
        cost     : 'Kostua'
    },

    ResourceTypeColumn : {
        type : 'Mota'
    },

    ResourceEditorRateTablesTab : {
        rateTable    : 'Tarifen taula',
        newGroup     : 'Mahai berria',
        removeGroup  : 'Kendu mahaia',
        useByDefault : 'Erabili lehenespenez baliabideen esleipenetarako',
        noRates      : 'Tarifarik ez'
    },

    ResourceGrid : {
        name          : 'Izena',
        materialLabel : 'Materialaren etiketa',
        maxUnits      : 'Gehienezko unitateak',
        cost          : 'Kostua',
        noRows        : 'Baliabiderik ez'
    },

    ResourceRateTableContainer : {
        startDate    : 'Hasiera data',
        standardRate : 'Tarifa estandarra',
        perUseCost   : 'Erabilera bakoitzeko kostua',
        addRate      : 'Gehitu tarifa',
        removeRate   : 'Kendu tasa',
        name         : 'Izena',
        noRates      : 'Tarifarik ez'
    },

    ResourceRateTableEditor : {
        rateTableInformation : 'Tarifa taularen informazioa'
    },

    ResourcesTab : {
        unitsTpl    : ({ column, value }) => column.formatValue(value) + '%',
        quantityTpl : ({ record, value }) => `${value || 0} ${record.resource?.materialLabel || ''}`,
        quantity    : 'Kantitatea',
        Resources   : 'Baliabideak',
        Resource    : 'Baliabidea',
        Units       : 'Unitateak',
        cost        : 'Kostua',
        effort      : 'Esfortzua',
        start       : 'Hasi',
        finish      : 'Amaitu',
        preamble    : 'Sarrera',
        postamble   : 'Amaiera'
    },

    RateTableColumn : {
        rateTable : 'Tarifen taula'
    },

    RecurrenceTab : {
        title : 'Repeat'
    },

    SchedulingModePicker : {
        Normal           : 'Normala',
        'Fixed Duration' : 'Iraupen finkoa',
        'Fixed Units'    : 'Unitate finkoak',
        'Fixed Effort'   : 'Ahalegin finkoa'
    },

    ResourceHistogram : {
        barTipInRange         : '<b>{resource}</b> {startDate} - {endDate}<br><span class="{cls}">{allocated} {available}</span> esleituetatik',
        barTipOnDate          : '<b>{resource}</b> noiz {startDate}<br><span class="{cls}">{allocated} {available}</span> esleituetatik',
        groupBarTipAssignment : '<b>{resource}</b> - <span class="{cls}">{allocated} {available}</span>etatik',
        groupBarTipInRange    : '{startDate} - {endDate}<br><span class="{cls}">{allocated} {available}</span> esleituetatik:<br>{assignments}',
        groupBarTipOnDate     : 'Noiz {startDate}<br><span class="{cls}">{allocated} {available}</span> esleituetatik:<br>{assignments}',
        plusMore              : '+{value} gehiago'
    },

    ResourceUtilization : {
        effortRangeInfo       : '<div class="b-effort-range-data"><div class="b-effort-label">Ahalegina</div><div class="b-effort-value {cls}">{allocated} / {available}</div></div>',
        effortInfo            : '<div class="b-effort-data"><div class="b-effort-label">Ahalegina</div><div class="b-effort-value {cls}">{allocated}</div></div>',
        costInfo              : '<div class="b-cost-data"><div class="b-effort-label">Kostua</div><div class="b-effort-value b-cost">{cost}</div></div>',
        quantityInfo          : '<div class="b-quantity-data"><div class="b-effort-label">Kopurua</div><div class="b-effort-value b-quantity">{quantity}</div></div>',
        barTipInRange         : '<div class="b-on-date">{event} {startDate} - {endDate}</div><div class="b-summary-data">{effort-info}{cost-info}{quantity-info}</div>',
        barTipOnDate          : '<div class="b-on-date">{event} {startDate}an</div><div class="b-summary-data">{effort-info}{cost-info}{quantity-info}</div>',
        groupBarTipAssignment : '<div class="b-assignment"><div class="b-assignment-name">{event}</div>{effort-info}{cost-info}{quantity-info}</div>',
        groupBarTipInRange    : '<div class="b-on-date">Laburpena {startDate} - {endDate}</div><div class="b-summary-data">{effort-range-info}{cost-info}{quantity-info}</div><div class="b-assignments">{assignments}</div>',
        groupBarTipOnDate     : '<div class="b-on-date">Laburpena {startDate}an</div><div class="b-summary-data">{effort-range-info}{cost-info}{quantity-info}</div><div class="b-assignments">{assignments}</div>',
        plusMore              : '+{value} gehiago',
        nameColumnText        : 'Baliabidea / Gertaera'
    },

    SchedulingIssueResolutionPopup : {
        'Cancel changes'   : 'Utzi aldaketa bertan behera eta ez egin ezer',
        schedulingConflict : 'Antolaketa-gatazka',
        emptyCalendar      : 'Egutegiaren konfigurazio-errorea',
        cycle              : 'Antolaketa zikloa',
        Apply              : 'Aplikatu'
    },

    CycleResolutionPopup : {
        dependencyLabel        : 'Hautatu mendekotasun bat:',
        invalidDependencyLabel : 'Baliozkoak ez diren mendekotasunak daude eta konpondu egin behar dira:'
    },

    SchedulerProBase : {
        propagating     : 'Proiektua kalkulatzen',
        storePopulation : 'Datuak kargatzen',
        finalizing      : 'Emaitzak amaitzen'
    },

    EventSegments : {
        splitEvent    : 'Banatu gertaera',
        renameSegment : 'Aldatu izena'
    },

    NestedEvents : {
        createGroup         : 'Taldekatu hautatutako gertaerak',
        newGroupName        : 'Talde berria',
        deNestingNotAllowed : 'Ez da habiaratzea kentzerik onartzen',
        nestingNotAllowed   : 'Habiaratzea ez da onartzen'
    },

    VersionGrid : {
        compare       : 'Konparatu',
        description   : 'Deskribapena',
        occurredAt    : 'Non gertatua',
        rename        : 'Aldatu izena',
        restore       : 'Berrezarri',
        stopComparing : 'Utzi konparatzeari'
    },

    Versions : {
        entityNames : {
            TaskModel       : 'zeregina',
            AssignmentModel : 'esleipenaren',
            DependencyModel : 'esteka',
            ProjectModel    : 'proiektua',
            ResourceModel   : 'errekurtsoa',
            other           : 'objektua'
        },
        entityNamesPlural : {
            TaskModel       : 'zeregin',
            AssignmentModel : 'esleipenak',
            DependencyModel : 'estekak',
            ProjectModel    : 'proiektuak',
            ResourceModel   : 'errekurtsoak',
            other           : 'objektuak'
        },
        transactionDescriptions : {
            update : 'Aldatu {n} {entities}',
            add    : 'Gehitu {n} {entities}',
            remove : 'Ezabatu {n} {entities}',
            move   : 'Mugitu {n} {entities}',
            mixed  : 'Aldatu {n} {entities}'
        },
        propertyNames : {
            active                   : 'Aktibo',
            allDay                   : 'Egun osoa',
            allowOverlap             : 'Gainjartzea baimendu',
            barMargin                : 'Barra tartea',
            bidirectional            : 'Bikoitza',
            calendar                 : 'Egutegia',
            cls                      : 'CSS klasea',
            constraintDate           : 'Murrizketa data',
            constraintType           : 'Murrizketa mota',
            daysPerMonth             : 'Egunak hilabete bakoitzeko',
            daysPerWeek              : 'Egunak aste bakoitzeko',
            delayFromParent          : 'Atzerapena gurasotik',
            direction                : 'Norabidea',
            drawDependencies         : 'Mendekotasunak marraztu',
            duration                 : 'Iraupena',
            durationUnit             : 'Iraupen unitatea',
            effort                   : 'Ahalegina',
            effortDriven             : 'Ahaleginak bultzatuta',
            effortUnit               : 'Ahalegin unitatea',
            endDate                  : 'Amaiera data',
            eventColor               : 'Kolorea',
            eventId                  : 'Gertaera IDa',
            eventLayout              : 'Gertaera diseinua',
            eventStyle               : 'Barra estiloa',
            exceptionDates           : 'Salbuespen datak',
            fixed                    : 'Finkoa',
            from                     : 'Nondik',
            fromSide                 : 'Nondik alde',
            hoursPerDay              : 'Orduak egun bakoitzeko',
            href                     : 'Esteka',
            iconCls                  : 'Ikonoa',
            id                       : 'ID',
            ignoreResourceCalendar   : 'Baliabideen egutegia ez ikusi',
            ignoreTimeZone           : 'Ordu-eremua ez ikusi',
            image                    : 'Irudia',
            imageUrl                 : 'Irudiaren URLa',
            inactive                 : 'Inaktibo',
            intervals                : 'Tarteak',
            lag                      : 'Atzerapena',
            lagUnit                  : 'Atzerapen unitatea',
            lineStyle                : 'Lerro estiloa',
            manuallyScheduled        : 'Eskuz programatua',
            milestoneWidth           : 'Mugarri zabalera',
            name                     : 'Izena',
            note                     : 'Oharra',
            parentId                 : 'Guraso IDa',
            parentIndex              : 'Posizioa',
            percentDone              : '% eginda',
            postamble                : 'Postanbulu',
            preamble                 : 'Aurreanbulu',
            readOnly                 : 'Irakurketa soilik',
            recurrenceRule           : 'Errepikapen araua',
            resourceId               : 'Baliabide IDa',
            resourceMargin           : 'Baliabide tartea',
            rowHeight                : 'Errenkada altuera',
            schedulingMode           : 'Programazio modua',
            segments                 : 'Segmentuak',
            showAvatar               : 'Avatarra erakutsi',
            showInTimeline           : 'Kronologian erakutsi',
            startDate                : 'Hasiera data',
            stickyContents           : 'Edukia itsatsia',
            strokeColor              : 'Lerro kolorea',
            style                    : 'Estiloa',
            target                   : 'Estekaren helburua',
            to                       : 'Nora',
            toSide                   : 'Nora alde',
            type                     : 'Mota',
            units                    : 'Unitateak',
            unscheduled              : 'Programatu gabea',
            unspecifiedTimeIsWorking : 'Zehaztu gabeko denbora lanekoa da',
            version                  : 'Bertsioa'
        },
        intervals : {
            working    : 'Lan egiten',
            nonWorking : 'Lan egin gabe',
            fromTo     : '{from}tik {to}ra',
            recurring  : 'Errepikatzen {start}tik {end}ra amaituz'
        },
        addEntity         : 'Gehitu {type} **{name}**',
        removeEntity      : 'Ezabatu {type} **{name}**',
        updateEntity      : 'Aldatu {type} **{name}**',
        moveEntity        : 'Mugitu {type} **{name}** hemendik {from} hona {to}',
        addDependency     : 'Gehitu esteka hemendik **{from}** hona **{to}**',
        removeDependency  : 'Ezabatu esteka hemendik **{from}** hona **{to}**',
        updateDependency  : 'Editatu esteka hemendik **{from}** hona **{to}**',
        addAssignment     : 'Esleitu **{resource}** hona **{event}**',
        removeAssignment  : 'Ezabatu esleipen hau **{resource}** hemendik **{event}**',
        updateAssignment  : 'Editatu esleipen hau **{resource}** hemendik **{event}**',
        noChanges         : 'Aldaketarik ez',
        nullValue         : 'Bat ere ez',
        versionDateFormat : 'YYYY/M/D h:mm a',
        savedAt           : 'Gordeta {date} orduan',
        autoSavedAt       : 'Automatikoki gordeta {date} orduan',
        undid             : 'Desegin dira aldaketak',
        redid             : 'Berregin dira aldaketak',
        editedTask        : 'Editatu zereginaren propietateak',
        deletedTask       : 'Zeregin bat ezabatu da',
        movedTask         : 'Zeregina mugitu da',
        movedTasks        : 'Zereginak mugitu dira'
    }
};

export default LocaleHelper.publishLocale(locale);
