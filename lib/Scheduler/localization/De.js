import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Engine/localization/De.js';
import '../../Grid/localization/De.js';

const locale = {

    localeName : 'De',
    localeDesc : 'Deutsch',
    localeCode : 'de-DE',
    localeRtl  : false,

    Object : {
        newEvent    : 'Neues Ereignis',
        information : 'Information',
        showDetails : 'Details anzeigen'
    },

    ResourceInfoColumn : {
        eventCountText : data => data + ' Ereignis' + (data !== 1 ? 'se' : '')
    },

    ResourceCollapseColumn : {
        toggleResourceLayout : 'Ressourcenlayout-Spalte umschalten. SPACE für Kontextmenü.'
    },

    Dependencies : {
        from    : 'Von',
        to      : 'Bis',
        valid   : 'Gültig',
        invalid : 'Ungültig'
    },

    DependencyType : {
        SS           : 'SS',
        SF           : 'SE',
        FS           : 'ES',
        FF           : 'EE',
        StartToStart : 'Start-zu-Start',
        StartToEnd   : 'Start-zu-Ende',
        EndToStart   : 'Ende-zu-Start',
        EndToEnd     : 'Ende-zu-Ende',
        short        : [
            'SS',
            'SE',
            'ES',
            'EE'
        ],
        long : [
            'Start-zu-Start',
            'Start-zu-Ende',
            'Ende-zu-Start',
            'Ende-zu-Ende'
        ]
    },

    DependencyEdit : {
        From              : 'Von',
        To                : 'Bis',
        Type              : 'Typ',
        Lag               : 'Lag',
        color             : 'Farbe',
        lineStyle         : 'Linienstil',
        solid             : 'Durchgezogen',
        dashed            : 'Gestrichelt',
        dotted            : 'Gepunktet',
        dashDot           : 'Strich-Punkt',
        longDash          : 'Langer Strich',
        'Edit dependency' : 'Abhängigkeit bearbeiten',
        Save              : 'Speichern',
        Delete            : 'Löschen',
        Cancel            : 'Abbrechen',
        StartToStart      : 'Start-zu-Start',
        StartToEnd        : 'Start-zu-Ende',
        EndToStart        : 'Ende-zu-Start',
        EndToEnd          : 'Ende-zu-Ende',
        Active            : 'Aktiv'
    },

    EventEdit : {
        Name           : 'Name',
        Resource       : 'Ressource',
        Start          : 'Start',
        startTime      : 'Startzeit',
        End            : 'Ende',
        endTime        : 'Endzeit',
        Save           : 'Speichern',
        Delete         : 'Löschen',
        Cancel         : 'Abbrechen',
        'Edit event'   : 'Ereignis bearbeiten',
        Repeat         : 'Wiederholen',
        editRecurrence : 'Wiederholung bearbeiten'
    },

    EventDrag : {
        eventOverlapsExisting   : 'Ereignis überschneidet sich mit bestehendem Ereignis für diese Ressource',
        noDropOutsideTimeline   : 'Das Ereignis darf nicht vollständig außerhalb der Zeitspanne liegen',
        duplicateAssignmentDrag : 'Ereignis kann nicht mehrfach derselben Ressource zugewiesen werden'
    },

    SchedulerBase : {
        'Add event'      : 'Ereignis hinzufügen',
        'Delete event'   : 'Ereignis löschen',
        'Unassign event' : 'Zuordnung des Ereignisses aufheben',
        color            : 'Farbe',
        eventAriaLabel   : (eventRecord, startDate) => `${eventRecord.name}, beginnt um ${startDate} ${eventRecord.duration > 0 ? `für ${eventRecord.fullDuration.toString(false)}` : ''}`
    },

    TimeAxisHeaderMenu : {
        pickZoomLevel   : 'Zoom',
        activeDateRange : 'Datumspanne',
        startText       : 'Startdatum',
        endText         : 'Enddatum',
        todayText       : 'Heute'
    },

    TimeAxisColumn : {
        ariaLabel : (startDate, endDate) => `Zeitachse zeigt ${startDate} bis ${endDate}`
    },

    EventCopyPaste : {
        copyEvent  : 'Ereignis kopieren',
        cutEvent   : 'Ereignis ausschneiden',
        pasteEvent : 'Ereignis einfügen'
    },

    EventFilter : {
        filterEvents : 'Aufgaben filtern',
        byName       : 'Nach Namen'
    },

    TimeRanges : {
        showCurrentTimeLine : 'Aktuelle Zeitleiste anzeigen'
    },

    PresetManager : {
        secondAndMinute : {
            displayDateFormat : 'll LTS',
            name              : 'Sekunden'
        },
        minuteAndHour : {
            topDateFormat     : 'ddd DD.MM, H',
            displayDateFormat : 'll LST'
        },
        hourAndDay : {
            topDateFormat     : 'ddd DD.MM',
            middleDateFormat  : 'LST',
            displayDateFormat : 'll LST',
            name              : 'Tag'
        },
        day : {
            name : 'Tag/Stunden'
        },
        week : {
            name : 'Woche/Stunden'
        },
        dayAndWeek : {
            displayDateFormat : 'll LST',
            name              : 'Woche/Tage'
        },
        dayAndMonth : {
            name : 'Monat'
        },
        weekAndDay : {
            displayDateFormat : 'll LST',
            name              : 'Woche'
        },
        weekAndMonth : {
            name : 'Wochen'
        },
        weekAndDayLetter : {
            name : 'Woche/Wochentage'
        },
        weekDateAndMonth : {
            name : 'Monate/Wochen'
        },
        monthAndYear : {
            name : 'Monate'
        },
        year : {
            name : 'Jahre'
        },
        manyYears : {
            name : 'Mehrere Jahre'
        }
    },

    RecurrenceConfirmationPopup : {
        'delete-title'              : 'Sie löschen ein Ereignis',
        'delete-all-message'        : 'Möchten Sie alle Vorkommnisse dieses Ereignisses löschen?',
        'delete-further-message'    : 'Möchten Sie dieses und alle zukünftigen Ereignisse dieses Ereignisses löschen, oder nur das ausgewählte Vorkommnis?',
        'delete-only-this-message'  : 'Möchten Sie dieses Vorkommen dieses Ereignisses löschen?',
        'delete-further-btn-text'   : 'Alle zukünftigen Ereignisse löschen',
        'delete-only-this-btn-text' : 'Nur dieses Ereignis löschen',
        'update-title'              : 'Sie ändern ein sich wiederholendes Ereignis',
        'update-all-message'        : 'Möchten Sie alle Vorkommnisse dieses Ereignisses ändern?',
        'update-further-message'    : 'Möchten Sie nur dieses Ereignis oder dieses und alle zukünftigen Vorkommnisse ändern?',
        'update-only-this-message'  : 'Möchten Sie dieses Vorkommen dieses Ereignisses ändern?',
        'update-further-btn-text'   : 'Alle zukünftigen Ereignisse',
        'update-only-this-btn-text' : 'Nur dieses Ereignis',
        Yes                         : 'Ja',
        Cancel                      : 'Abbrechen',
        width                       : 600
    },

    RecurrenceLegend : {
        ' and '                         : ' und ',
        Daily                           : 'Täglich',
        'Weekly on {1}'                 : ({ days }) => `Wöchentlich an ${days}`,
        'Monthly on {1}'                : ({ days }) => `Monatlich an ${days}`,
        'Yearly on {1} of {2}'          : ({ days, months }) => `Jährlich an ${days} von ${months}`,
        'Every {0} days'                : ({ interval }) => `Alle ${interval} Tage`,
        'Every {0} weeks on {1}'        : ({ interval, days }) => `Alle ${interval} Wochen an ${days}`,
        'Every {0} months on {1}'       : ({ interval, days }) => `Alle ${interval} Monate an ${days}`,
        'Every {0} years on {1} of {2}' : ({ interval, days, months }) => `Alle ${interval} Jahre an ${days} von ${months}`,
        position1                       : 'der erste',
        position2                       : 'der zweite',
        position3                       : 'der dritte',
        position4                       : 'der vierte',
        position5                       : 'der fünfte',
        'position-1'                    : 'der letzte',
        day                             : 'tag',
        weekday                         : 'wochentag',
        'weekend day'                   : 'wochenend tag',
        daysFormat                      : ({ position, days }) => `${position} ${days}`
    },

    RecurrenceEditor : {
        'Repeat event'      : 'Ereignis wiederholen',
        Cancel              : 'Abbrechen',
        Save                : 'Speichern',
        Frequency           : 'Frequenz',
        Every               : 'Alle',
        DAILYintervalUnit   : 'tag(e)',
        WEEKLYintervalUnit  : 'woche(n)',
        MONTHLYintervalUnit : 'monat(e)',
        YEARLYintervalUnit  : 'jahr(e)',
        Each                : 'jede',
        on                  : 'Ein',
        the                 : 'Der',
        'On the'            : 'am',
        'End repeat'        : 'Wiederholung beenden',
        'time(s)'           : 'mal(e)',
        Days                : 'Tage',
        Months              : 'Monate'
    },

    RecurrenceDaysCombo : {
        day           : 'tag',
        weekday       : 'wochentag',
        'weekend day' : 'wochend tag'
    },

    RecurrencePositionsCombo : {
        position1    : 'erste',
        position2    : 'zweite',
        position3    : 'dritte',
        position4    : 'vierte',
        position5    : 'fünfte',
        'position-1' : 'letzte'
    },

    RecurrenceStopConditionCombo : {
        Never     : 'Nie',
        After     : 'Nach',
        'On date' : 'Am Datum'
    },

    RecurrenceFrequencyCombo : {
        None    : 'Keine Wiederholung',
        Daily   : 'Täglich',
        Weekly  : 'Wöchentlich',
        Monthly : 'Monatlich',
        Yearly  : 'Jährlich'
    },

    RecurrenceCombo : {
        None   : 'Kein',
        Custom : 'Benutzerdefiniert...'
    },

    Summary : {
        'Summary for' : date => `Zusammenfassung für ${date}`
    },

    ScheduleRangeCombo : {
        completeview : 'Vollständiger Zeitplan',
        currentview  : 'Sichtbarer Zeitplan',
        daterange    : 'Datumsspanne',
        completedata : 'Vollständiger Zeitplan (für alle Ereignisse)'
    },

    SchedulerExportDialog : {
        'Schedule range' : 'Zeitplanbereich',
        'Export from'    : 'Von',
        'Export to'      : 'Bis'
    },

    SinglePageExporterVertical : {
        verticalsinglepage : 'Einzelne Seite'
    },

    SinglePageUnscaledExporterVertical : {
        verticalsinglepageunscaled : 'Einzelne Seite (unskaliert)'
    },

    MultiPageVerticalExporterVertical : {
        verticalmultipagevertical : 'Mehrere Seiten (vertikal)'
    },

    ExcelExporter : {
        'No resource assigned' : 'Keine Ressource zugewiesen'
    },

    CrudManagerView : {
        serverResponseLabel : 'Server Antwort:'
    },

    DurationColumn : {
        Duration : 'Dauer'
    },

    EventClusteringBase : {
        unnamed         : 'Unbenannt',
        more            : count => `+ ${count} weitere`,
        clusteredEvents : count => `${count} gruppierte Ereignisse`
    },

    ResourceTimeRangeClustering : {
        clusteredEvents : count => `${count} gruppierte Bereiche`
    },

    ConstraintTypePicker : {
        none                : 'Keine',
        assoonaspossible    : 'So bald wie möglich',
        aslateaspossible    : 'So spät wie möglich',
        muststarton         : 'Muss starten am',
        mustfinishon        : 'Muss fertig sein am',
        startnoearlierthan  : 'Darf nicht fürher als starten',
        startnolaterthan    : 'Nicht später als starten',
        finishnoearlierthan : 'Nicht früher als enden',
        finishnolaterthan   : 'Nicht später als enden'
    },

    EventBuffer : {
        preamblePostambleDescription : ({ preamble, postamble }) => {
            let description = '';
            if (preamble) {
                description += `.${preamble.toString()} Pufferzeit vor dem Ereignis`;
            }
            if (postamble) {
                description += `.${postamble.toString()} Pufferzeit nach dem Ereignis`;
            }
            return description;
        }
    },

    SchedulingDirectionPicker : {
        Forward       : 'Vorwärts',
        Backward      : 'Rückwärts',
        inheritedFrom : 'Geerbt von',
        enforcedBy    : 'Erzwungen von'
    },

    CalendarField : {
        'Default calendar' : 'Hauptkalender',
        editCalendar       : 'Kalender bearbeiten'
    },

    TaskEditorBase : {
        Information   : 'Aufgabeninformationen',
        Save          : 'Speichern',
        Cancel        : 'Abbrechen',
        Delete        : 'Löschen',
        calculateMask : 'Wird berechnet...',
        saveError     : 'Kann nicht gespeichert werden, bitte korrigieren Sie zuerst die Fehler',
        repeatingInfo : 'Ein sich wiederholendes Ereignis anzeigen',
        editRepeating : 'Bearbeiten'
    },

    TaskEdit : {
        editEvent              : 'Ereignis bearbeiten',
        ConfirmDeletionTitle   : 'Löschung bestätigen',
        ConfirmDeletionMessage : 'Sind Sie sicher, dass Sie das Ereignis löschen möchten?'
    },

    GanttTaskEditor : {
        editorWidth : '52em'
    },

    SchedulerTaskEditor : {
        editorWidth : '35em'
    },

    SchedulerGeneralTab : {
        General      : 'Generell',
        Name         : 'Name',
        Resources    : 'Ressourcen',
        '% complete' : '% vollständig',
        Duration     : 'Dauer',
        Start        : 'Start',
        Finish       : 'Ende',
        Effort       : 'Anstrengung',
        Preamble     : 'Präambel',
        Postamble    : 'Postambel'
    },

    GeneralTab : {
        General      : 'Allgemein',
        Name         : 'Name',
        '% complete' : '% Abgeschlossen',
        Duration     : 'Dauer',
        Start        : 'Anfang',
        Finish       : 'Ende',
        Effort       : 'Aufwand',
        Dates        : 'Termine'
    },

    SchedulerAdvancedTab : {
        Advanced                   : 'Fortgeschritten',
        Calendar                   : 'Kalender',
        'Scheduling mode'          : 'Planungsmodus',
        'Effort driven'            : 'Durch Aufwand gesteuert',
        'Manually scheduled'       : 'Manuell terminiert',
        'Constraint type'          : 'Art der Einschränkung',
        'Constraint date'          : 'Einschränkungsdatum',
        Inactive                   : 'Inaktiv',
        'Ignore resource calendar' : 'Ressourcenkalender ignorieren'
    },

    CalendarEditorDatePicker : {
        addException : 'Ausnahme hinzufügen',
        addWeek      : 'Woche hinzufügen'
    },

    CalendarEditorExceptionTab : {
        addException    : 'Ausnahme hinzufügen',
        removeException : 'Ausnahme entfernen',
        noRows          : 'Keine Ausnahmen hinzugefügt'
    },

    CalendarEditorWeekTab : {
        addWeek    : 'Woche hinzufügen',
        removeWeek : 'Woche entfernen'
    },

    CalendarEditor : {
        daysAreWorkingByDefault    : 'Die Tage funktionieren standardmäßig',
        workingTimeCalendar        : 'Arbeitszeit Kalender',
        exceptions                 : 'Ausnahmen',
        general                    : 'Allgemein',
        name                       : 'Name',
        parent                     : 'Elternteil',
        save                       : 'Speichern',
        weeks                      : 'Wochen',
        error                      : 'Fehler',
        inputErrors                : 'Es gibt Eingangsfehler. Bitte beheben Sie sie, bevor Sie Ihre Änderungen speichern.',
        delete                     : 'Löschen',
        addCalendar                : 'Fügen Sie einen Kalender hinzu',
        confirmation               : 'Bestätigung',
        removeCalendarWithChildren : 'Der Kalender hat Kinderkalender. Klicken Sie auf "Ja", um den Kalender mit seinen Kindern zu entfernen.',
        removeCalendarAndLinks     : 'Der Kalender wird von einigen Aufzeichnungen verwendet. Klicken Sie auf "Ja", um sie zu entfernen und den Kalender zu entfernen.',
        newException               : 'Neue Ausnahme',
        newWeek                    : 'Neue Woche'
    },

    CalendarEditorDateInfo : {
        isWorking    : ' funktioniert',
        isNotWorking : ' funktioniert nicht',
        basedOn      : ' bezogen auf:',
        byDefault    : 'standardmäßig',
        rangeTpl     : (start, end) => `${start} bis ${end}`
    },

    CalendarEditorLegend : {
        workingDay    : 'Arbeitstag',
        nonWorkingDay : 'Arbeitsfreier Tag'
    },

    AvailabilityRangeError : {
        errorOverlap       : 'Es gibt überlappende Bereiche',
        errorMissingDate   : 'Start- und Endzeit sind erforderlich',
        errorStartAfterEnd : 'Die Startzeit kann nicht nach der Endzeit sein'
    },

    CalendarEditorExceptionPanel : {
        name                                 : 'Name',
        from                                 : 'Aus',
        to                                   : 'Zu',
        is                                   : 'Ist',
        nonWorking                           : 'Nicht arbeitend',
        working                              : 'Arbeiten',
        hours                                : 'Std',
        repeat                               : 'Wiederholen',
        repeatEnd                            : 'Ende wiederholen',
        errorMissingDate                     : 'Ausnahmedatumbereich ist erforderlich',
        errorStartAfterEnd                   : '"Vom" Datum kann nicht nach dem "bis" Datum  sein',
        errorStartAndEndRepeatNumberMismatch : 'Die Ausnahme sollte die gleiche Häufigkeit beginnen und beenden'
    },

    CalendarEditorWeekPanel : {
        name        : 'Name',
        from        : 'Aus',
        to          : 'Zu',
        days        : 'Tage',
        copyDay     : 'Tag kopieren',
        pasteDay    : 'Tag einfügen',
        stopCopying : 'Hör auf zu kopieren'
    },

    CalendarEditorAvailabilityRangeContainer : {
        addRange    : 'Bereich hinzufügen',
        removeRange : 'Reichweite entfernen'
    },

    CalendarEditorWeekGrid : {
        errorStartAfterEnd           : '"Vom" Datum kann nicht nach dem "bis" Datum  sein',
        errorNoDefaultWeek           : 'Woche Konfiguration ist erforderlich',
        errorMultipleDefaultWeeks    : 'Mehr als eine Standardwoche wird angegeben',
        errorNoWeekAvailability      : 'Woche muss eine gewisse Arbeitszeit liefern',
        errorInvalidWeekAvailability : 'Woche hat Arbeitszeitkonfigurationsfehler',
        noRows                       : 'Keine Wochen hinzugefügt'
    },

    AdvancedTab : {
        Advanced                   : 'Erweitert',
        Calendar                   : 'Kalender',
        'Scheduling mode'          : 'Planungsmodus',
        'Effort driven'            : 'Leistungsgesteuert',
        'Manually scheduled'       : 'Manuell geplant',
        'Constraint type'          : 'Einschränkungsart',
        'Constraint date'          : 'Einschränkungsdatum',
        Constraint                 : 'Einschränkung',
        Rollup                     : 'Rollup',
        Inactive                   : 'Inaktiv',
        'Ignore resource calendar' : 'Terminplanung ignoriert Ressourcenkalender',
        'Scheduling direction'     : 'Terminierungsrichtung',
        projectBorder              : 'Projektgrenze',
        ignore                     : 'Ignorieren',
        honor                      : 'Ehre',
        askUser                    : 'Fragen Sie den Benutzer'
    },

    DependencyTab : {
        Predecessors      : 'Vorgänger',
        Successors        : 'Nachfolger',
        ID                : 'ID',
        Name              : 'Name',
        Type              : 'Typ',
        Lag               : 'Zeitabstand',
        cyclicDependency  : 'Zyklische Abhängigkeit',
        invalidDependency : 'Ungültige Abhängigkeit',
        readOnlyTask      : 'Eine schreibgeschützte Aufgabe kann nicht verknüpft werden'
    },

    NotesTab : {
        Notes : 'Notizen'
    },

    ResourceCalendarColumn : {
        calendar : 'Kalender'
    },

    ResourceEdit : {
        editResource : 'Ressource bearbeiten'
    },

    ResourceEditor : {
        resourceInformation : 'Ressourceninformationen',
        costs               : 'Kosten',
        save                : 'Speichern',
        error               : 'Fehler',
        inputErrors         : 'Es liegen Eingabefehler vor. Bitte beheben Sie diese, bevor Sie Ihre Änderungen speichern.',
        delete              : 'Löschen',
        confirmation        : 'Bestätigung',
        removeUsedResource  : 'Der Ressource sind einige Aufgaben zugeordnet. Klicken Sie auf „Ja“, um die Ressource trotzdem zu entfernen.'
    },

    ResourceEditorGeneralTab : {
        calendar    : 'Kalender',
        general     : 'Allgemein',
        label       : 'Materialetikett',
        name        : 'Ressourcenname',
        type        : 'Typ',
        costAccrual : 'Kostenabgrenzung',
        labelHint   : 'zum Beispiel kg, Tonnen oder Kartons',
        maxUnits    : 'Maximale Einheiten'
    },

    ResourceCostAccrualColumn : {
        accrueAt : 'Auflaufen bei',
        prorated : 'Anteilig',
        start    : 'Start',
        end      : 'Ende'
    },

    CostAccrualField : {
        prorated : 'Anteilig',
        start    : 'Start',
        end      : 'Ende'
    },

    ResourceType : {
        work     : 'Arbeiten',
        material : 'Material',
        cost     : 'Kosten'
    },

    ResourceTypeColumn : {
        type : 'Typ'
    },

    ResourceEditorRateTablesTab : {
        rateTable    : 'Tariftabelle',
        newGroup     : 'Neuer Tisch',
        removeGroup  : 'Tisch entfernen',
        useByDefault : 'Wird standardmäßig für die Ressourcenzuweisungen verwendet',
        noRates      : 'Keine Tarife'
    },

    ResourceGrid : {
        name          : 'Name',
        materialLabel : 'Materialetikett',
        maxUnits      : 'Maximale Einheiten',
        cost          : 'Kosten',
        noRows        : 'Keine Ressourcen'
    },

    ResourceRateTableContainer : {
        startDate    : 'Startdatum',
        standardRate : 'Standardtarif',
        perUseCost   : 'Kosten pro Nutzung',
        addRate      : 'Tarif hinzufügen',
        removeRate   : 'Rate entfernen',
        name         : 'Name',
        noRates      : 'Keine Tarife'
    },

    ResourceRateTableEditor : {
        rateTableInformation : 'Informationen zur Preistabelle'
    },

    ResourcesTab : {
        unitsTpl    : ({ column, value }) => column.formatValue(value) + '%',
        quantityTpl : ({ record, value }) => `${value || 0} ${record.resource?.materialLabel || ''}`,
        quantity    : 'Menge',
        Resources   : 'Ressourcen',
        Resource    : 'Ressource',
        Units       : 'Einheiten',
        cost        : 'Kosten',
        effort      : 'Bemühung',
        start       : 'Start',
        finish      : 'Beenden',
        preamble    : 'Präambel',
        postamble   : 'Postambel'
    },

    RateTableColumn : {
        rateTable : 'Tariftabelle'
    },

    RecurrenceTab : {
        title : 'Wiederholen'
    },

    SchedulingModePicker : {
        Normal           : 'Normal',
        'Fixed Duration' : 'Fixierte Dauer',
        'Fixed Units'    : 'Fixierte Einheiten',
        'Fixed Effort'   : 'Fixierter Effort'
    },

    ResourceHistogram : {
        barTipInRange         : '<b>{resource}</b> {startDate} - {endDate}<br><span class="{cls}">{allocated} von {available}</span> zugewiesen',
        barTipOnDate          : '<b>{resource}</b> on {startDate}<br><span class="{cls}">{allocated} von {available}</span> zugewiesen',
        groupBarTipAssignment : '<b>{resource}</b> - <span class="{cls}">{allocated} von {available}</span>',
        groupBarTipInRange    : '{startDate} - {endDate}<br><span class="{cls}">{allocated} von {available}</span> allocated:<br>{assignments}',
        groupBarTipOnDate     : 'Am {startDate}<br><span class="{cls}">{allocated} vom {available}</span> zugewiesen:<br>{assignments}',
        plusMore              : '+{value} mehr'
    },

    ResourceUtilization : {
        effortRangeInfo       : '<div class="b-effort-range-data"><div class="b-effort-label">Aufwand</div><div class="b-effort-value {cls}">{allocated} von {available}</div></div>',
        effortInfo            : '<div class="b-effort-data"><div class="b-effort-label">Aufwand</div><div class="b-effort-value {cls}">{allocated}</div></div>',
        costInfo              : '<div class="b-cost-data"><div class="b-effort-label">Kosten</div><div class="b-effort-value b-cost">{cost}</div></div>',
        quantityInfo          : '<div class="b-quantity-data"><div class="b-effort-label">Menge</div><div class="b-effort-value b-quantity">{quantity}</div></div>',
        barTipInRange         : '<div class="b-on-date">{event} {startDate} - {endDate}</div><div class="b-summary-data">{effort-info}{cost-info}{quantity-info}</div>',
        barTipOnDate          : '<div class="b-on-date">{event} am {startDate}</div><div class="b-summary-data">{effort-info}{cost-info}{quantity-info}</div>',
        groupBarTipAssignment : '<div class="b-assignment"><div class="b-assignment-name">{event}</div>{effort-info}{cost-info}{quantity-info}</div>',
        groupBarTipInRange    : '<div class="b-on-date">Zusammenfassung für {startDate} - {endDate}</div><div class="b-summary-data">{effort-range-info}{cost-info}{quantity-info}</div><div class="b-assignments">{assignments}</div>',
        groupBarTipOnDate     : '<div class="b-on-date">Zusammenfassung für {startDate}</div><div class="b-summary-data">{effort-range-info}{cost-info}{quantity-info}</div><div class="b-assignments">{assignments}</div>',
        plusMore              : '+{value} mehr',
        nameColumnText        : 'Ressource / Ereignis'
    },

    SchedulingIssueResolutionPopup : {
        'Cancel changes'   : 'Die Änderung rückgängig machen und nichts tun',
        schedulingConflict : 'Terminkonflikt',
        emptyCalendar      : 'Kalenderkonfigurationsfehler',
        cycle              : 'Planungszyklus',
        Apply              : 'Anwenden'
    },

    CycleResolutionPopup : {
        dependencyLabel        : 'Bitte wählen Sie eine Abhängigkeit:',
        invalidDependencyLabel : 'Es gibt ungültige Abhängigkeiten, die behoben werden müssen:'
    },

    SchedulerProBase : {
        propagating     : 'Projekt wird berechnet',
        storePopulation : 'Daten werden geladen',
        finalizing      : 'Ergebnisse werden finalisiert'
    },

    EventSegments : {
        splitEvent    : 'Ereignis aufteilen',
        renameSegment : 'Umbenennen'
    },

    NestedEvents : {
        createGroup         : 'Ausgewählte Ereignisse gruppieren',
        newGroupName        : 'Neue Gruppe',
        deNestingNotAllowed : 'De-nesting nicht erlaubt',
        nestingNotAllowed   : 'Nesting nicht erlaubt'
    },

    VersionGrid : {
        compare       : 'Vergleichen',
        description   : 'Beschreibung',
        occurredAt    : 'Trat auf bei',
        rename        : 'Umbenennen',
        restore       : 'Wiederherstellen',
        stopComparing : 'Vergleichen beenden'
    },

    Versions : {
        entityNames : {
            TaskModel       : 'Aufgabe',
            AssignmentModel : 'Zuweisung',
            DependencyModel : 'Verknüpfung',
            ProjectModel    : 'Projekt',
            ResourceModel   : 'Ressource',
            other           : 'Objekt'
        },
        entityNamesPlural : {
            TaskModel       : 'Aufgaben',
            AssignmentModel : 'Zuweisungen',
            DependencyModel : 'Verknüpfungen',
            ProjectModel    : 'Projekte',
            ResourceModel   : 'Ressourcen',
            other           : 'Objekte'
        },
        transactionDescriptions : {
            update : '{n} geändert(e) {entities}',
            add    : '{n} hinzugefügt(e) {entities}',
            remove : '{n} entfernt(e) {entities}',
            move   : '{n} verschoben(e) {entities}',
            mixed  : '{n} geändert(e) {entities}'
        },
        propertyNames : {
            active                   : 'Aktiv',
            allDay                   : 'Ganztägig',
            allowOverlap             : 'Überlappung erlauben',
            barMargin                : 'Balkenabstand',
            bidirectional            : 'Bidirektional',
            calendar                 : 'Kalender',
            cls                      : 'CSS-Klasse',
            constraintDate           : 'Einschränkungsdatum',
            constraintType           : 'Einschränkungstyp',
            daysPerMonth             : 'Tage pro Monat',
            daysPerWeek              : 'Tage pro Woche',
            delayFromParent          : 'Verzögerung vom Elternteil',
            direction                : 'Richtung',
            drawDependencies         : 'Abhängigkeiten zeichnen',
            duration                 : 'Dauer',
            durationUnit             : 'Dauereinheit',
            effort                   : 'Aufwand',
            effortDriven             : 'Aufwandsgetrieben',
            effortUnit               : 'Aufwandseinheit',
            endDate                  : 'Enddatum',
            eventColor               : 'Farbe',
            eventId                  : 'Ereignis-ID',
            eventLayout              : 'Ereignislayout',
            eventStyle               : 'Balkenstil',
            exceptionDates           : 'Ausnahmedaten',
            fixed                    : 'Festgelegt',
            from                     : 'Von',
            fromSide                 : 'Startseite',
            hoursPerDay              : 'Stunden pro Tag',
            href                     : 'Link',
            iconCls                  : 'Symbol',
            id                       : 'ID',
            ignoreResourceCalendar   : 'Ressourcenkalender ignorieren',
            ignoreTimeZone           : 'Zeitzone ignorieren',
            image                    : 'Bild',
            imageUrl                 : 'Bild-URL',
            inactive                 : 'Inaktiv',
            intervals                : 'Intervalle',
            lag                      : 'Verzögerung',
            lagUnit                  : 'Verzögerungseinheit',
            lineStyle                : 'Linienstil',
            manuallyScheduled        : 'Manuell geplant',
            milestoneWidth           : 'Meilensteinbreite',
            name                     : 'Name',
            note                     : 'Notiz',
            parentId                 : 'Eltern-ID',
            parentIndex              : 'Position',
            percentDone              : '% erledigt',
            postamble                : 'Nachsatz',
            preamble                 : 'Vorspann',
            readOnly                 : 'Schreibgeschützt',
            recurrenceRule           : 'Wiederholungsregel',
            resourceId               : 'Ressourcen-ID',
            resourceMargin           : 'Ressourcenabstand',
            rowHeight                : 'Zeilenhöhe',
            schedulingMode           : 'Planungsmodus',
            segments                 : 'Segmente',
            showAvatar               : 'Avatar anzeigen',
            showInTimeline           : 'In Zeitachse anzeigen',
            startDate                : 'Startdatum',
            stickyContents           : 'Haftende Inhalte',
            strokeColor              : 'Linienfarbe',
            style                    : 'Stil',
            target                   : 'Linkziel',
            to                       : 'Zu',
            toSide                   : 'Zielseite',
            type                     : 'Typ',
            units                    : 'Einheiten',
            unscheduled              : 'Nicht geplant',
            unspecifiedTimeIsWorking : 'Nicht spezifizierte Zeit ist Arbeitszeit',
            version                  : 'Version'
        },
        intervals : {
            working    : 'Arbeiten',
            nonWorking : 'Nicht arbeiten',
            fromTo     : 'Von {from} bis {to}',
            recurring  : 'Wiederkehrend ab {start} bis {end}'
        },
        addEntity         : '{type} **{name}** hinzugefügt',
        removeEntity      : '{type} **{name}** entfernt',
        updateEntity      : '{type} **{name}** geändert',
        moveEntity        : '{type} **{name}** von {from} nach {to} verschoben',
        addDependency     : 'Verknüpfung von **{from}** nach **{to}** hinzugefügt',
        removeDependency  : 'Verknüpfung von **{from}** nach **{to}** entfernt',
        updateDependency  : 'Verknüpfung von **{from}** nach **{to}** bearbeitet',
        addAssignment     : '**{resource}** zugewiesen zu **{event}**',
        removeAssignment  : 'Zuweisung von **{resource}** von **{event}** entfernt',
        updateAssignment  : 'Zuweisung von **{resource}** von **{event}** bearbeitet',
        noChanges         : 'Keine Änderungen',
        nullValue         : 'keine',
        versionDateFormat : 'M/D/YYYY h:mm a',
        savedAt           : 'Gespeichert am {date}',
        autoSavedAt       : 'Automatisch gespeichert am {date}',
        undid             : 'Änderungen rückgängig gemacht',
        redid             : 'Änderungen rückgängig gemacht',
        editedTask        : 'Aufgabeneigenschaften bearbeitet',
        deletedTask       : 'Eine Aufgabe gelöscht',
        movedTask         : 'Eine Aufgabe verschoben',
        movedTasks        : 'Aufgaben verschoben'
    }
};

export default LocaleHelper.publishLocale(locale);
