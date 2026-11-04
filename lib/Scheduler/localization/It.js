import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Engine/localization/It.js';
import '../../Grid/localization/It.js';

const locale = {

    localeName : 'It',
    localeDesc : 'Italiano',
    localeCode : 'it',
    localeRtl  : false,

    Object : {
        newEvent    : 'Nuovo evento',
        information : 'Informazioni',
        showDetails : 'Mostra dettagli'
    },

    ResourceInfoColumn : {
        eventCountText : data => data + ' event' + (data !== 1 ? 'i' : 'o')
    },

    ResourceCollapseColumn : {
        toggleResourceLayout : 'Attiva/disattiva la colonna del layout delle risorse. SPACE per il menu contestuale.'
    },

    Dependencies : {
        from    : 'Da',
        to      : 'A',
        valid   : 'Valido',
        invalid : 'Non valido'
    },

    DependencyType : {
        SS           : 'II',
        SF           : 'IF',
        FS           : 'FI',
        FF           : 'FF',
        StartToStart : 'Inizio-Inizio',
        StartToEnd   : 'Inizio-Fine',
        EndToStart   : 'Fine-Inizio',
        EndToEnd     : 'Fine-Fine',
        short        : [
            'II',
            'IF',
            'FI',
            'FF'
        ],
        long : [
            'Inizio-Inizio',
            'Inizio-Fine',
            'Fine-Inizio',
            'Fine-Fine'
        ]
    },

    DependencyEdit : {
        From              : 'Da',
        To                : 'A',
        Type              : 'Tipo',
        Lag               : 'Ritardo',
        color             : 'Colore',
        lineStyle         : 'Stile della linea',
        solid             : 'Solido',
        dashed            : 'Tratteggiato',
        dotted            : 'Punteggiato',
        dashDot           : 'Trattino-punto',
        longDash          : 'Trattino lungo',
        'Edit dependency' : 'Modifica dipendenza',
        Save              : 'Salva',
        Delete            : 'Elimina',
        Cancel            : 'Annulla',
        StartToStart      : 'Inizio-Inizio',
        StartToEnd        : 'Inizio-Fine',
        EndToStart        : 'Fine-Inizio',
        EndToEnd          : 'Fine-Fine',
        Active            : 'Attiva'
    },

    EventEdit : {
        Name           : 'Nome',
        Resource       : 'Risorsa',
        Start          : 'Inizio',
        startTime      : 'Ora di inizio',
        End            : 'Fine',
        endTime        : 'Ora di fine',
        Save           : 'Salva',
        Delete         : 'Elimina',
        Cancel         : 'Annulla',
        'Edit event'   : 'Modifica evento',
        Repeat         : 'Ripeti',
        editRecurrence : 'Modifica ricorrenza'
    },

    EventDrag : {
        eventOverlapsExisting   : 'L’evento si sovrappone a un evento esistente per questa risorsa',
        noDropOutsideTimeline   : 'L’evento non può essere lasciato completamente al di fuori della linea temporale',
        duplicateAssignmentDrag : "L'evento non può essere assegnato più volte alla stessa risorsa"
    },

    SchedulerBase : {
        'Add event'      : 'Aggiungi evento',
        'Delete event'   : 'Elimina evento',
        'Unassign event' : 'Annulla l’assegnazione dell’evento',
        color            : 'Colore',
        eventAriaLabel   : (eventRecord, startDate) => `${eventRecord.name}, inizia alle ${startDate} ${eventRecord.duration > 0 ? `per ${eventRecord.fullDuration.toString(false)}` : ''}`
    },

    TimeAxisHeaderMenu : {
        pickZoomLevel   : 'Zoom',
        activeDateRange : 'Intervallo di date',
        startText       : 'Data d’inizio',
        endText         : 'Data di fine',
        todayText       : 'Oggi'
    },

    TimeAxisColumn : {
        ariaLabel : (startDate, endDate) => `Asse temporale che mostra da ${startDate} a ${endDate}`
    },

    EventCopyPaste : {
        copyEvent  : 'Copia evento',
        cutEvent   : 'Taglia evento',
        pasteEvent : 'Incolla evento'
    },

    EventFilter : {
        filterEvents : 'Filtra attività',
        byName       : 'Per nome'
    },

    TimeRanges : {
        showCurrentTimeLine : 'Mostra linea temporale corrente'
    },

    PresetManager : {
        secondAndMinute : {
            displayDateFormat : 'll LTS',
            name              : 'Secondi'
        },
        minuteAndHour : {
            topDateFormat     : 'ddd DD/MM, H',
            displayDateFormat : 'll LST'
        },
        hourAndDay : {
            topDateFormat     : 'ddd DD/MM',
            middleDateFormat  : 'LST',
            displayDateFormat : 'll LST',
            name              : 'Giorno'
        },
        day : {
            name : 'Giorno/ore'
        },
        week : {
            name : 'Settimana/ore'
        },
        dayAndWeek : {
            displayDateFormat : 'll LST',
            name              : 'Settimana/giorni'
        },
        dayAndMonth : {
            name : 'Mese'
        },
        weekAndDay : {
            displayDateFormat : 'll LST',
            name              : 'Settimana'
        },
        weekAndMonth : {
            name : 'Settimane'
        },
        weekAndDayLetter : {
            name : 'Settimane/giorni lavorativi'
        },
        weekDateAndMonth : {
            name : 'Mesi/settimane'
        },
        monthAndYear : {
            name : 'Mesi'
        },
        year : {
            name : 'Anni'
        },
        manyYears : {
            name : 'Più anni'
        }
    },

    RecurrenceConfirmationPopup : {
        'delete-title'              : 'Stai per eliminare un evento',
        'delete-all-message'        : 'Vuoi eliminare tutte le occorrenze di questo evento?',
        'delete-further-message'    : 'Vuoi eliminare questa e tutte le future occorrenze di questo evento, o solo l’occorrenza selezionata?',
        'delete-only-this-message'  : 'Vuoi eliminare questa occorrenza di questo evento?',
        'delete-further-btn-text'   : 'Elimina tutti gli eventi futuri',
        'delete-only-this-btn-text' : 'Elimina solo questo evento',
        'update-title'              : 'Stai per modificare un evento ricorrente',
        'update-all-message'        : 'Vuoi modificare tutte le occorrenze di questo evento?',
        'update-further-message'    : 'Vuoi modificare solo questa occorrenza dell’evento o questa e tutte le future occorrenze?',
        'update-only-this-message'  : 'Vuoi modificare questa occorrenza di questo evento?',
        'update-further-btn-text'   : 'Tutti gli eventi futuri',
        'update-only-this-btn-text' : 'Solo questo evento',
        Yes                         : 'Sì',
        Cancel                      : 'Annulla',
        width                       : 600
    },

    RecurrenceLegend : {
        ' and '                         : ' e ',
        Daily                           : 'Ogni giorno',
        'Weekly on {1}'                 : ({ days }) => `Ogni settimana il ${days}`,
        'Monthly on {1}'                : ({ days }) => `Ogni mese il ${days}`,
        'Yearly on {1} of {2}'          : ({ days, months }) => `Ogni anno il ${days} di ${months}`,
        'Every {0} days'                : ({ interval }) => `Ogni ${interval} giorni`,
        'Every {0} weeks on {1}'        : ({ interval, days }) => `Ogni ${interval} settimane il ${days}`,
        'Every {0} months on {1}'       : ({ interval, days }) => `Ogni ${interval} mesi il ${days}`,
        'Every {0} years on {1} of {2}' : ({ interval, days, months }) => `Ogni ${interval} anni il ${days} di ${months}`,
        position1                       : 'il primo',
        position2                       : 'il secondo',
        position3                       : 'il terzo',
        position4                       : 'il quarto',
        position5                       : 'il quinto',
        'position-1'                    : 'l’ultimo',
        day                             : 'giorno',
        weekday                         : 'giorno della settimana',
        'weekend day'                   : 'giorno del fine settimana',
        daysFormat                      : ({ position, days }) => `${position} ${days}`
    },

    RecurrenceEditor : {
        'Repeat event'      : 'Ripeti evento',
        Cancel              : 'Annulla',
        Save                : 'Salva',
        Frequency           : 'Frequenza',
        Every               : 'Ogni',
        DAILYintervalUnit   : 'giorno/i',
        WEEKLYintervalUnit  : 'settimana/e',
        MONTHLYintervalUnit : 'mese/i',
        YEARLYintervalUnit  : 'anno/i',
        Each                : 'Ogni',
        on                  : 'Il',
        the                 : 'Nel',
        'On the'            : 'Il',
        'End repeat'        : 'Termina ripetizione',
        'time(s)'           : 'volta/e',
        Days                : 'Giorni',
        Months              : 'Mesi'
    },

    RecurrenceDaysCombo : {
        day           : 'giorno',
        weekday       : 'giorno della settimana',
        'weekend day' : 'giorno del fine settimana'
    },

    RecurrencePositionsCombo : {
        position1    : 'primo',
        position2    : 'secondo',
        position3    : 'terzo',
        position4    : 'quarto',
        position5    : 'quinto',
        'position-1' : 'ultimo'
    },

    RecurrenceStopConditionCombo : {
        Never     : 'Mai',
        After     : 'Dopo',
        'On date' : 'Alla data'
    },

    RecurrenceFrequencyCombo : {
        None    : 'Nessuna ripetizione',
        Daily   : 'Ogni giorno',
        Weekly  : 'Ogni settimana',
        Monthly : 'Ogni mese',
        Yearly  : 'Ogni anno'
    },

    RecurrenceCombo : {
        None   : 'Nessuna',
        Custom : 'Personalizza...'
    },

    Summary : {
        'Summary for' : date => `Riepilogo per ${date}`
    },

    ScheduleRangeCombo : {
        completeview : 'Programma completo',
        currentview  : 'Programma visibile',
        daterange    : 'Intervallo di date',
        completedata : 'Programma completo (per tutti gli eventi)'
    },

    SchedulerExportDialog : {
        'Schedule range' : 'Intervallo del programma',
        'Export from'    : 'Da',
        'Export to'      : 'A'
    },

    SinglePageExporterVertical : {
        verticalsinglepage : 'Pagina singola'
    },

    SinglePageUnscaledExporterVertical : {
        verticalsinglepageunscaled : 'Pagina singola (non scalata)'
    },

    MultiPageVerticalExporterVertical : {
        verticalmultipagevertical : 'Pagine multiple (verticale)'
    },

    ExcelExporter : {
        'No resource assigned' : 'Nessuna risorsa assegnata'
    },

    CrudManagerView : {
        serverResponseLabel : 'Risposta del server:'
    },

    DurationColumn : {
        Duration : 'Durata'
    },

    EventClusteringBase : {
        unnamed         : 'Senza nome',
        more            : count => `+ altri ${count}`,
        clusteredEvents : count => `${count} eventi raggruppati`
    },

    ResourceTimeRangeClustering : {
        clusteredEvents : count => `${count} intervalli raggruppati`
    },

    ConstraintTypePicker : {
        none                : 'Nessuno',
        assoonaspossible    : 'Il più presto possibile',
        aslateaspossible    : 'Il più tardi possibile',
        muststarton         : 'Deve iniziare il',
        mustfinishon        : 'Deve finire il',
        startnoearlierthan  : 'Inizio non prima di',
        startnolaterthan    : 'Inizio non oltre',
        finishnoearlierthan : 'Fine non prima di',
        finishnolaterthan   : 'Fine non oltre'
    },

    EventBuffer : {
        preamblePostambleDescription : ({ preamble, postamble }) => {
            let description = '';
            if (preamble) {
                description += `.${preamble.toString()} tempo di buffer prima dell'evento`;
            }
            if (postamble) {
                description += `.${postamble.toString()} tempo di buffer dopo l'evento`;
            }
            return description;
        }
    },

    SchedulingDirectionPicker : {
        Forward       : 'Avanti',
        Backward      : 'Indietro',
        inheritedFrom : 'Ereditato da',
        enforcedBy    : 'Impossato da'
    },

    CalendarField : {
        'Default calendar' : 'Calendario predefinito',
        editCalendar       : 'Modifica il calendario'
    },

    TaskEditorBase : {
        Information   : 'Informazioni sul compito',
        Save          : 'Salva',
        Cancel        : 'Annulla',
        Delete        : 'Elimina',
        calculateMask : 'Calcolo...',
        saveError     : 'Impossibile salvare, correggi prima gli errori',
        repeatingInfo : 'Visualizzare un evento ripetitivo',
        editRepeating : 'Modifica'
    },

    TaskEdit : {
        editEvent              : 'Modifica evento',
        ConfirmDeletionTitle   : 'Conferma eliminazione',
        ConfirmDeletionMessage : 'Vuoi davvero eliminare l’evento?'
    },

    GanttTaskEditor : {
        editorWidth : '52em'
    },

    SchedulerTaskEditor : {
        editorWidth : '33em'
    },

    SchedulerGeneralTab : {
        General      : 'Generale',
        Name         : 'Nome',
        Resources    : 'Risorse',
        '% complete' : '% completato',
        Duration     : 'Durata',
        Start        : 'Inizio',
        Finish       : 'Fine',
        Effort       : 'Sforzo',
        Preamble     : 'Preambolo',
        Postamble    : 'Postfazione'
    },

    GeneralTab : {
        General      : 'Generale',
        Name         : 'Nome',
        '% complete' : '% completato',
        Duration     : 'Durata',
        Start        : 'Inizio',
        Finish       : 'Fine',
        Effort       : 'Sforzo',
        Dates        : 'Date'
    },

    SchedulerAdvancedTab : {
        Advanced                   : 'Avanzato',
        Calendar                   : 'Calendario',
        'Scheduling mode'          : 'Modalità di programmazione',
        'Effort driven'            : 'Basato sullo sforzo',
        'Manually scheduled'       : 'Programmato manualmente',
        'Constraint type'          : 'Tipo di vincolo',
        'Constraint date'          : 'Data di vincolo',
        Inactive                   : 'Disattivo',
        'Ignore resource calendar' : 'Ignora il calendario delle risorse'
    },

    CalendarEditorDatePicker : {
        addException : 'Aggiungere eccezione',
        addWeek      : 'Aggiungi settimana'
    },

    CalendarEditorExceptionTab : {
        addException    : 'Aggiungere eccezione',
        removeException : "Rimuovere l'eccezione",
        noRows          : 'Nessuna eccezione aggiunta'
    },

    CalendarEditorWeekTab : {
        addWeek    : 'Aggiungi settimana',
        removeWeek : 'Rimuovere la settimana'
    },

    CalendarEditor : {
        daysAreWorkingByDefault    : 'I giorni funzionano per impostazione predefinita',
        workingTimeCalendar        : "Calendario dell'orario di lavoro",
        exceptions                 : 'Eccezioni',
        general                    : 'Generale',
        name                       : 'Nome',
        parent                     : 'Genitore',
        save                       : 'Salva',
        weeks                      : 'Settimane',
        error                      : 'Errore',
        inputErrors                : 'Ci sono errori di input. Si prega di correggere prima di salvare le modifiche.',
        delete                     : 'Eliminare',
        addCalendar                : 'Aggiungi un calendario',
        confirmation               : 'Conferma',
        removeCalendarWithChildren : 'Il calendario ha calendari infantili. Fai clic su "Sì" per rimuovere il calendario con i suoi figli.',
        removeCalendarAndLinks     : 'Il calendario è utilizzato da alcuni record. Fai clic su "Sì" per sbloccarli e rimuovere il calendario.',
        newException               : 'Nuova eccezione',
        newWeek                    : 'Nuova settimana'
    },

    CalendarEditorDateInfo : {
        isWorking    : ' sta lavorando',
        isNotWorking : ' non funziona',
        basedOn      : ' basato su:',
        byDefault    : 'Per impostazione predefinita',
        rangeTpl     : (start, end) => `Dalle ${start} alle ${end}`
    },

    CalendarEditorLegend : {
        workingDay    : 'Giorno lavorativo',
        nonWorkingDay : 'Giorno non di lavoro'
    },

    AvailabilityRangeError : {
        errorOverlap       : 'Ci sono gamme sovrapposte',
        errorMissingDate   : "Sono richiesti l'ora di inizio e fine",
        errorStartAfterEnd : "L'ora di inizio non può essere dopo l'ora di fine"
    },

    CalendarEditorExceptionPanel : {
        name                                 : 'Nome',
        from                                 : 'Da',
        to                                   : 'A',
        is                                   : 'È',
        nonWorking                           : 'Non funzionante',
        working                              : 'Lavorando',
        hours                                : 'Ore',
        repeat                               : 'Ripetere',
        repeatEnd                            : 'Ripeti fine',
        errorMissingDate                     : "È richiesto l'intervallo della data di eccezione",
        errorStartAfterEnd                   : '"From" date cannot be after the "To" date ',
        errorStartAndEndRepeatNumberMismatch : "L'eccezione dovrebbe iniziare e terminare lo stesso numero di volte"
    },

    CalendarEditorWeekPanel : {
        name        : 'Nome',
        from        : 'Da',
        to          : 'A',
        days        : 'Giorni',
        copyDay     : 'Copia giorno',
        pasteDay    : 'Giorno in pasta',
        stopCopying : 'Smettila di copiare'
    },

    CalendarEditorAvailabilityRangeContainer : {
        addRange    : 'Aggiungi gamma',
        removeRange : 'Rimuovere la gamma'
    },

    CalendarEditorWeekGrid : {
        errorStartAfterEnd           : '"From" date cannot be after the "To" date ',
        errorNoDefaultWeek           : 'È richiesta la configurazione della settimana',
        errorMultipleDefaultWeeks    : 'È specificata più di una settimana predefinita',
        errorNoWeekAvailability      : "La settimana deve fornire un po 'di tempo di lavoro",
        errorInvalidWeekAvailability : "La settimana ha errori di configurazione dell'orario di lavoro",
        noRows                       : 'Nessuna settimana aggiunta'
    },

    AdvancedTab : {
        Advanced                   : 'Avanzato',
        Calendar                   : 'Calendario',
        'Scheduling mode'          : 'Modalità di programmazione',
        'Effort driven'            : 'Basato sullo sforzo',
        'Manually scheduled'       : 'Programmato manualmente',
        'Constraint type'          : 'Tipo di vincolo',
        'Constraint date'          : 'Data di vincolo',
        Constraint                 : 'Vincolo',
        Rollup                     : 'Rollup',
        Inactive                   : 'Disattivo',
        'Ignore resource calendar' : 'Ignora il calendario delle risorse',
        'Scheduling direction'     : 'Direzione della pianificazione',
        projectBorder              : 'Bordo del progetto',
        ignore                     : 'Ignora',
        honor                      : 'Rispetta',
        askUser                    : "Chiedi all'utente"
    },

    DependencyTab : {
        Predecessors      : 'Precedenti',
        Successors        : 'Successivi',
        ID                : 'ID',
        Name              : 'Nome',
        Type              : 'Tipo',
        Lag               : 'Ritardo',
        cyclicDependency  : 'Dipendenza ciclica',
        invalidDependency : 'Dipendenza non valida',
        readOnlyTask      : "Impossibile collegare un'attività di sola lettura"
    },

    NotesTab : {
        Notes : 'Note'
    },

    ResourceCalendarColumn : {
        calendar : 'Calendario'
    },

    ResourceEdit : {
        editResource : 'Modifica risorsa'
    },

    ResourceEditor : {
        resourceInformation : 'Informazioni sulle risorse',
        costs               : 'Costi',
        save                : 'Salva',
        error               : 'Errore',
        inputErrors         : 'Sono presenti errori di immissione. Correggili prima di salvare le modifiche.',
        delete              : 'Eliminare',
        confirmation        : 'Conferma',
        removeUsedResource  : 'La risorsa è assegnata ad alcune attività. Fare clic su "Sì" per rimuovere comunque la risorsa.'
    },

    ResourceEditorGeneralTab : {
        calendar    : 'Calendario',
        general     : 'Generale',
        label       : 'Etichetta materiale',
        name        : 'Nome della risorsa',
        type        : 'Tipo',
        costAccrual : 'Accumulo di costi',
        labelHint   : 'ad esempio kg, tonnellate o scatole',
        maxUnits    : 'Unità massime'
    },

    ResourceCostAccrualColumn : {
        accrueAt : 'Matura a',
        prorated : 'Prorata',
        start    : 'Inizio',
        end      : 'FINE'
    },

    CostAccrualField : {
        prorated : 'Prorata',
        start    : 'Inizio',
        end      : 'FINE'
    },

    ResourceType : {
        work     : 'Lavoro',
        material : 'Materiale',
        cost     : 'Costo'
    },

    ResourceTypeColumn : {
        type : 'Tipo'
    },

    ResourceEditorRateTablesTab : {
        rateTable    : 'Tabella delle tariffe',
        newGroup     : 'Nuovo tavolo',
        removeGroup  : 'Rimuovi tabella',
        useByDefault : 'Utilizzare per impostazione predefinita per le assegnazioni delle risorse',
        noRates      : 'Nessuna tariffa'
    },

    ResourceGrid : {
        name          : 'Nome',
        materialLabel : 'Etichetta materiale',
        maxUnits      : 'Unità massime',
        cost          : 'Costo',
        noRows        : 'Nessuna risorsa'
    },

    ResourceRateTableContainer : {
        startDate    : 'Data di inizio',
        standardRate : 'Tariffa standard',
        perUseCost   : 'Costo per utilizzo',
        addRate      : 'Aggiungi tariffa',
        removeRate   : 'Rimuovi tariffa',
        name         : 'Nome',
        noRates      : 'Nessuna tariffa'
    },

    ResourceRateTableEditor : {
        rateTableInformation : 'Informazioni sulla tabella delle tariffe'
    },

    ResourcesTab : {
        unitsTpl    : ({ column, value }) => column.formatValue(value) + '%',
        quantityTpl : ({ record, value }) => `${value || 0} ${record.resource?.materialLabel || ''}`,
        quantity    : 'Quantità',
        Resources   : 'Risorse',
        Resource    : 'Risorsa',
        Units       : 'Unità',
        cost        : 'Costo',
        effort      : 'Sforzo',
        start       : 'Inizio',
        finish      : 'Fine',
        preamble    : 'Preambolo',
        postamble   : 'Postambolo'
    },

    RateTableColumn : {
        rateTable : 'Tabella delle tariffe'
    },

    RecurrenceTab : {
        title : 'Ripeti'
    },

    SchedulingModePicker : {
        Normal           : 'Normale',
        'Fixed Duration' : 'Durata fissa',
        'Fixed Units'    : 'Unità fisse',
        'Fixed Effort'   : 'Sforzo fisso'
    },

    ResourceHistogram : {
        barTipInRange         : '<b>{resource}</b> {startDate} - {endDate}<br><span class="{cls}">{allocated} di {available}</span> assegnato',
        barTipOnDate          : '<b>{resource}</b> on {startDate}<br><span class="{cls}">{allocated} di {available}</span> assegnato',
        groupBarTipAssignment : '<b>{resource}</b> - <span class="{cls}">{allocated} di {available}</span>',
        groupBarTipInRange    : '{startDate} - {endDate}<br><span class="{cls}">{allocated} di {available}</span> allocated:<br>{assignments}',
        groupBarTipOnDate     : 'Il {startDate}<br><span class="{cls}">{allocated} di {available}</span> assegnato:<br>{assignments}',
        plusMore              : 'altre +{value}'
    },

    ResourceUtilization : {
        effortRangeInfo       : '<div class="b-effort-range-data"><div class="b-effort-label">Sforzo</div><div class="b-effort-value {cls}">{allocated} di {available}</div></div>',
        effortInfo            : '<div class="b-effort-data"><div class="b-effort-label">Sforzo</div><div class="b-effort-value {cls}">{allocated}</div></div>',
        costInfo              : '<div class="b-cost-data"><div class="b-effort-label">Costo</div><div class="b-effort-value b-cost">{cost}</div></div>',
        quantityInfo          : '<div class="b-quantity-data"><div class="b-effort-label">Quantità</div><div class="b-effort-value b-quantity">{quantity}</div></div>',
        barTipInRange         : '<div class="b-on-date">{event} {startDate} - {endDate}</div><div class="b-summary-data">{effort-info}{cost-info}{quantity-info}</div>',
        barTipOnDate          : '<div class="b-on-date">{event} il {startDate}</div><div class="b-summary-data">{effort-info}{cost-info}{quantity-info}</div>',
        groupBarTipAssignment : '<div class="b-assignment"><div class="b-assignment-name">{event}</div>{effort-info}{cost-info}{quantity-info}</div>',
        groupBarTipInRange    : '<div class="b-on-date">Riepilogo per {startDate} - {endDate}</div><div class="b-summary-data">{effort-range-info}{cost-info}{quantity-info}</div><div class="b-assignments">{assignments}</div>',
        groupBarTipOnDate     : '<div class="b-on-date">Riepilogo per {startDate}</div><div class="b-summary-data">{effort-range-info}{cost-info}{quantity-info}</div><div class="b-assignments">{assignments}</div>',
        plusMore              : '+{value} altro',
        nameColumnText        : 'Risorsa / Evento'
    },

    SchedulingIssueResolutionPopup : {
        'Cancel changes'   : 'Annulla la modifica e non fare nulla',
        schedulingConflict : 'Conflitto di programmazione',
        emptyCalendar      : 'Errore di configurazione calendario',
        cycle              : 'Ciclo di programmazione',
        Apply              : 'Applica'
    },

    CycleResolutionPopup : {
        dependencyLabel        : 'Seleziona una dipendenza:',
        invalidDependencyLabel : 'Ci sono dipendenze non valide da risolvere:'
    },

    SchedulerProBase : {
        propagating     : 'Calcolo progetto',
        storePopulation : 'Caricamento dati',
        finalizing      : 'Finalizzazione risultati'
    },

    EventSegments : {
        splitEvent    : 'Dividi evento',
        renameSegment : 'Rinomina'
    },

    NestedEvents : {
        createGroup         : 'Raggruppa eventi selezionati',
        newGroupName        : 'Nuovo gruppo',
        deNestingNotAllowed : 'Denidificazione non consentita',
        nestingNotAllowed   : 'Nidificazione non consentita'
    },

    VersionGrid : {
        compare       : 'Confronta',
        description   : 'Descrizione',
        occurredAt    : 'Si è verificato il',
        rename        : 'Rinomina',
        restore       : 'Ripristina',
        stopComparing : 'Interrompi confronto'
    },

    Versions : {
        entityNames : {
            TaskModel       : 'compito',
            AssignmentModel : 'assegnazione',
            DependencyModel : 'link',
            ProjectModel    : 'progetto',
            ResourceModel   : 'risorsa',
            other           : 'oggetto'
        },
        entityNamesPlural : {
            TaskModel       : 'compiti',
            AssignmentModel : 'assegnazioni',
            DependencyModel : 'link',
            ProjectModel    : 'progetti',
            ResourceModel   : 'risorse',
            other           : 'oggetti'
        },
        transactionDescriptions : {
            update : 'Modificate {n} {entities}',
            add    : 'Aggiunte {n} {entities}',
            remove : 'Rimosse {n} {entities}',
            move   : 'Spostate {n} {entities}',
            mixed  : 'Modificate {n} {entities}'
        },
        propertyNames : {
            active                   : 'Attivo',
            allDay                   : 'Tutto il giorno',
            allowOverlap             : 'Consenti sovrapposizione',
            barMargin                : 'Margine barra',
            bidirectional            : 'Bidirezionale',
            calendar                 : 'Calendario',
            cls                      : 'Classe CSS',
            constraintDate           : 'Data vincolo',
            constraintType           : 'Tipo di vincolo',
            daysPerMonth             : 'Giorni per mese',
            daysPerWeek              : 'Giorni per settimana',
            delayFromParent          : 'Ritardo dal genitore',
            direction                : 'Direzione',
            drawDependencies         : 'Disegna dipendenze',
            duration                 : 'Durata',
            durationUnit             : 'Unità di durata',
            effort                   : 'Sforzo',
            effortDriven             : 'Guidato dallo sforzo',
            effortUnit               : 'Unità di sforzo',
            endDate                  : 'Data di fine',
            eventColor               : 'Colore',
            eventId                  : 'ID Evento',
            eventLayout              : 'Layout evento',
            eventStyle               : 'Stile barra',
            exceptionDates           : 'Date eccezioni',
            fixed                    : 'Fisso',
            from                     : 'Da',
            fromSide                 : 'Dal lato',
            hoursPerDay              : 'Ore per giorno',
            href                     : 'Collegamento',
            iconCls                  : 'Icona',
            id                       : 'ID',
            ignoreResourceCalendar   : 'Ignora calendario risorse',
            ignoreTimeZone           : 'Ignora fuso orario',
            image                    : 'Immagine',
            imageUrl                 : 'URL immagine',
            inactive                 : 'Inattivo',
            intervals                : 'Intervalli',
            lag                      : 'Ritardo',
            lagUnit                  : 'Unità di ritardo',
            lineStyle                : 'Stile linea',
            manuallyScheduled        : 'Pianificato manualmente',
            milestoneWidth           : 'Larghezza pietra miliare',
            name                     : 'Nome',
            note                     : 'Nota',
            parentId                 : 'ID Genitore',
            parentIndex              : 'Posizione',
            percentDone              : '% completato',
            postamble                : 'Postambolo',
            preamble                 : 'Preambolo',
            readOnly                 : 'Sola lettura',
            recurrenceRule           : 'Regola di ricorrenza',
            resourceId               : 'ID Risorsa',
            resourceMargin           : 'Margine risorsa',
            rowHeight                : 'Altezza riga',
            schedulingMode           : 'Modalità di pianificazione',
            segments                 : 'Segmenti',
            showAvatar               : 'Mostra avatar',
            showInTimeline           : 'Mostra nella timeline',
            startDate                : 'Data di inizio',
            stickyContents           : 'Contenuti adesivi',
            strokeColor              : 'Colore linea',
            style                    : 'Stile',
            target                   : 'Target collegamento',
            to                       : 'A',
            toSide                   : 'Al lato',
            type                     : 'Tipo',
            units                    : 'Unità',
            unscheduled              : 'Non pianificato',
            unspecifiedTimeIsWorking : 'Tempo non specificato è lavorativo',
            version                  : 'Versione'
        },
        intervals : {
            working    : 'Lavorativo',
            nonWorking : 'Non lavorativo',
            fromTo     : 'Da {from} a {to}',
            recurring  : 'Ricorrente a partire da {start} fino a {end}'
        },
        addEntity         : 'Aggiunto {type} **{name}**',
        removeEntity      : 'Rimosso {type} **{name}**',
        updateEntity      : 'Modificato {type} **{name}**',
        moveEntity        : 'Spostato {type} **{name}** da {from} a {to}',
        addDependency     : 'Aggiunto link da **{from}** a **{to}**',
        removeDependency  : 'Rimosso link da **{from}** a **{to}**',
        updateDependency  : 'Modificato link da **{from}** a **{to}**',
        addAssignment     : 'Assegnato **{resource}** a **{event}**',
        removeAssignment  : 'Rimossa assegnazione di **{resource}** da **{event}**',
        updateAssignment  : 'Modificata assegnazione di **{resource}** a **{event}**',
        noChanges         : 'Nessuna modifica',
        nullValue         : 'nessuno',
        versionDateFormat : 'M/D/YYYY h:mm a',
        savedAt           : 'Salvato alle {date}',
        autoSavedAt       : 'Salvato automaticamente alle {date}',
        undid             : 'Modifiche annullate',
        redid             : 'Modifiche ripristinate',
        editedTask        : 'Proprietà compito modificate',
        deletedTask       : 'Compito eliminato',
        movedTask         : 'Compito spostato',
        movedTasks        : 'Compiti spostati'
    }
};

export default LocaleHelper.publishLocale(locale);
