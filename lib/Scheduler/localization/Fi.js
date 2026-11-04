import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Engine/localization/Fi.js';
import '../../Grid/localization/Fi.js';

const locale = {

    localeName : 'Fi',
    localeDesc : 'Suomi',
    localeCode : 'fi',
    localeRtl  : false,

    Object : {
        newEvent    : 'Uusi tapahtuma',
        information : 'Informaatio',
        showDetails : 'Näytä tiedot'
    },

    ResourceInfoColumn : {
        eventCountText : data => data + ' tapahtuma' + (data !== 1 ? 't' : '')
    },

    ResourceCollapseColumn : {
        toggleResourceLayout : 'Vaihda resurssiasettelun sarake. SPACE kontekstivalikkoa varten.'
    },

    Dependencies : {
        from    : 'From',
        to      : 'To',
        valid   : 'Voimassa',
        invalid : 'Virheellinen'
    },

    DependencyType : {
        SS           : 'SS',
        SF           : 'SF',
        FS           : 'FS',
        FF           : 'FF',
        StartToStart : 'Start-to-Start',
        StartToEnd   : 'Start-to-Finish',
        EndToStart   : 'Finish-to-Start',
        EndToEnd     : 'Finish-to-Finish',
        short        : [
            'SS',
            'SF',
            'FS',
            'FF'
        ],
        long : [
            'Start-to-Start',
            'Start-to-Finish',
            'Finish-to-Start',
            'Finish-to-Finish'
        ]
    },

    DependencyEdit : {
        From              : 'Lähettäjä',
        To                : 'Vastaanottaja',
        Type              : 'Tyyppi',
        Lag               : 'Lag',
        color             : 'Väri',
        lineStyle         : 'Viivatyylit',
        solid             : 'Yhtenäinen',
        dashed            : 'Katkoviiva',
        dotted            : 'Pisteviiva',
        dashDot           : 'Katko-piste',
        longDash          : 'Pitkä katko',
        'Edit dependency' : 'Muokkaa riippuvuutta',
        Save              : 'Tallenna',
        Delete            : 'Poista',
        Cancel            : 'Peruuta',
        StartToStart      : 'alusta alkuun',
        StartToEnd        : 'alusta loppuun',
        EndToStart        : 'maalista alkuun',
        EndToEnd          : 'maalista maaliin',
        Active            : 'Aktiivinen'
    },

    EventEdit : {
        Name           : 'Nimi',
        Resource       : 'Lähde',
        Start          : 'Start',
        startTime      : 'Aloitusaika',
        End            : 'Loppuun',
        endTime        : 'Lopetusaika',
        Save           : 'Tallenna',
        Delete         : 'Poista',
        Cancel         : 'Peruuta',
        'Edit event'   : 'Muokkaa tapahtumaa',
        Repeat         : 'Toista',
        editRecurrence : 'Muokkaa toistoa'
    },

    EventDrag : {
        eventOverlapsExisting   : 'Tapahtuma on päällekkäinen tämän resurssin olemassa olevan tapahtuman kanssa',
        noDropOutsideTimeline   : 'Tapahtumaa ei saa pudottaa kokonaan aikajanan ulkopuolelle',
        duplicateAssignmentDrag : 'Tapahtumaa ei voi määrittää samalle resurssille useita kertoja'
    },

    SchedulerBase : {
        'Add event'      : 'Lisää tapahtuma',
        'Delete event'   : 'Poista tapahtuma',
        'Unassign event' : 'Poista tapahtuma',
        color            : 'Väri',
        eventAriaLabel   : (eventRecord, startDate) => `${eventRecord.name}, alkaa ${startDate} ${eventRecord.duration > 0 ? `kestää ${eventRecord.fullDuration.toString(false)}` : ''}`
    },

    TimeAxisHeaderMenu : {
        pickZoomLevel   : 'Zoom',
        activeDateRange : 'Päiväysalue',
        startText       : 'Aloituspäivä',
        endText         : 'Lopetuspäivä',
        todayText       : 'Tänään'
    },

    TimeAxisColumn : {
        ariaLabel : (startDate, endDate) => `Aikajana näyttää ${startDate} - ${endDate}`
    },

    EventCopyPaste : {
        copyEvent  : 'Kopioi tapahtuma',
        cutEvent   : 'Leikkaa tapahtuma',
        pasteEvent : 'Liitä tapahtuma'
    },

    EventFilter : {
        filterEvents : 'Suodata tehtävät',
        byName       : 'nimien mukaan'
    },

    TimeRanges : {
        showCurrentTimeLine : 'Näytä nykyinen aikajana'
    },

    PresetManager : {
        secondAndMinute : {
            displayDateFormat : 'll LTS',
            name              : 'Sekuntia'
        },
        minuteAndHour : {
            topDateFormat     : 'ddd DD.MM, H',
            displayDateFormat : 'll LST'
        },
        hourAndDay : {
            topDateFormat     : 'ddd DD.MM',
            middleDateFormat  : 'LST',
            displayDateFormat : 'll LST',
            name              : 'Päivä'
        },
        day : {
            name : 'Päivä/tunnit'
        },
        week : {
            name : 'Viikko/tunnit'
        },
        dayAndWeek : {
            displayDateFormat : 'll LST',
            name              : 'Viikko/päivät'
        },
        dayAndMonth : {
            name : 'Kuukausi'
        },
        weekAndDay : {
            displayDateFormat : 'll LST',
            name              : 'Viikko'
        },
        weekAndMonth : {
            name : 'Viikkoa'
        },
        weekAndDayLetter : {
            name : 'Viikot/viikonpäivät'
        },
        weekDateAndMonth : {
            name : 'Kuukaudet/viikot'
        },
        monthAndYear : {
            name : 'Kuukaudet'
        },
        year : {
            name : 'Vuodet'
        },
        manyYears : {
            name : 'Useita vuosia'
        }
    },

    RecurrenceConfirmationPopup : {
        'delete-title'              : 'Olet poistamassa tapahtumaa',
        'delete-all-message'        : 'Haluatko poistaa tämän tapahtuman kaikki merkinnät?',
        'delete-further-message'    : 'Haluatko poistaa tämän tapahtuman ja kaikki tulevat tapahtumat vai vain valitun tapahtuman?',
        'delete-only-this-message'  : 'Haluatko poistaa tämän tapahtuman esiintymän?',
        'delete-further-btn-text'   : 'Poista kaikki tulevaisuuden tapahtumat',
        'delete-only-this-btn-text' : 'Poista vain tämä tapahtuma',
        'update-title'              : 'Olet muuttamassa toistuvaa tapahtumaa',
        'update-all-message'        : 'Haluatko muuttaa tämän tapahtuman kaikki merkinnät?',
        'update-further-message'    : 'Haluatko muuttaa vain tämän tapahtuman vai tämän ja kaikki tulevat tapahtumat?',
        'update-only-this-message'  : 'Haluatko muuttaa tämän tapahtuman esiintymää?',
        'update-further-btn-text'   : 'Kaikki tulevaisuuden tapahtumat',
        'update-only-this-btn-text' : 'Vain tämä tapahtuma',
        Yes                         : 'Kyllä',
        Cancel                      : 'Peruuta',
        width                       : 600
    },

    RecurrenceLegend : {
        ' and '                         : ' ja ',
        Daily                           : 'Päivittäin',
        'Weekly on {1}'                 : ({ days }) => `Viikoittain ${days}`,
        'Monthly on {1}'                : ({ days }) => `Kuukausittain ${days}`,
        'Yearly on {1} of {2}'          : ({ days, months }) => `Vuosittain ${days} of ${months}`,
        'Every {0} days'                : ({ interval }) => `Joka ${interval} days`,
        'Every {0} weeks on {1}'        : ({ interval, days }) => `Joka ${interval} viikko ${days}`,
        'Every {0} months on {1}'       : ({ interval, days }) => `Joka ${interval} kuukausi on ${days}`,
        'Every {0} years on {1} of {2}' : ({ interval, days, months }) => `Joka ${interval} vuosi ${days} of ${months}`,
        position1                       : 'the ensimmäinen',
        position2                       : 'toinen',
        position3                       : 'kolmas',
        position4                       : 'neljäs',
        position5                       : 'viides',
        'position-1'                    : 'the last',
        day                             : 'päivä',
        weekday                         : 'viikonpäivä',
        'weekend day'                   : 'viikonlopun päivä',
        daysFormat                      : ({ position, days }) => `${position} ${days}`
    },

    RecurrenceEditor : {
        'Repeat event'      : 'Toista tapahtuma',
        Cancel              : 'Peruuta',
        Save                : 'Tallenna',
        Frequency           : 'Taajuus',
        Every               : 'Joka',
        DAILYintervalUnit   : 'day(s)',
        WEEKLYintervalUnit  : 'viikkoa',
        MONTHLYintervalUnit : 'kuukautta',
        YEARLYintervalUnit  : 'vuotta',
        Each                : 'kukin',
        on                  : 'Kuukauden päivä',
        the                 : 'Ajankohta',
        'On the'            : 'Päivänä',
        'End repeat'        : 'Loppu toisto',
        'time(s)'           : 'ajastin(s)',
        Days                : 'Päivä',
        Months              : 'Kuukaudet'
    },

    RecurrenceDaysCombo : {
        day           : 'päivä',
        weekday       : 'viikonpäivä',
        'weekend day' : 'viikonlopun päivä'
    },

    RecurrencePositionsCombo : {
        position1    : 'ensimmäinen',
        position2    : 'toinen',
        position3    : 'kolmas',
        position4    : 'neljäs',
        position5    : 'viides',
        'position-1' : 'viimeinen'
    },

    RecurrenceStopConditionCombo : {
        Never     : 'Ei koskaan',
        After     : 'Jälkeen',
        'On date' : 'Päivänä'
    },

    RecurrenceFrequencyCombo : {
        None    : 'Ei toistoa',
        Daily   : 'Päivittäin',
        Weekly  : 'Viikoittain',
        Monthly : 'Kuukausittain',
        Yearly  : 'Vuosittain'
    },

    RecurrenceCombo : {
        None   : 'Ei ole',
        Custom : 'Kustomoitu...'
    },

    Summary : {
        'Summary for' : date => `Yhteenve ${date}`
    },

    ScheduleRangeCombo : {
        completeview : 'Täydellinen aikataulu',
        currentview  : 'Näkyvä aikataulu',
        daterange    : 'Päivämääräalue',
        completedata : 'Täydellinen aikataulu (kaikkien tapahtumien osalta)'
    },

    SchedulerExportDialog : {
        'Schedule range' : 'Aikataulualue',
        'Export from'    : 'Lähettäjä',
        'Export to'      : 'Vastaanottaja'
    },

    SinglePageExporterVertical : {
        verticalsinglepage : 'Yksi sivu'
    },

    SinglePageUnscaledExporterVertical : {
        verticalsinglepageunscaled : 'Yksi sivu (skaalaamaton)'
    },

    MultiPageVerticalExporterVertical : {
        verticalmultipagevertical : 'Useita sivuja (pystysuora)'
    },

    ExcelExporter : {
        'No resource assigned' : 'Resurssia ei määritetty'
    },

    CrudManagerView : {
        serverResponseLabel : 'Vastaus palvelimelta:'
    },

    DurationColumn : {
        Duration : 'Kesto'
    },

    EventClusteringBase : {
        unnamed         : 'Nimetön',
        more            : count => `+ ${count} lisää`,
        clusteredEvents : count => `Ryhmitellyt tapahtumat: ${count}`
    },

    ResourceTimeRangeClustering : {
        clusteredEvents : count => `Ryhmitellyt aikavälit: ${count}`
    },

    ConstraintTypePicker : {
        none                : 'Ei yhtään/mitään',
        assoonaspossible    : 'Mahdollisimman pian',
        aslateaspossible    : 'Mahdollisimman myöhään',
        muststarton         : 'On aloitettava',
        mustfinishon        : 'On lopetettava',
        startnoearlierthan  : 'Aloitus aikaisintaan',
        startnolaterthan    : 'Aloitus viimeistään',
        finishnoearlierthan : 'Lopetus aikaisintaan',
        finishnolaterthan   : 'Lopetus viimeistään'
    },

    EventBuffer : {
        preamblePostambleDescription : ({ preamble, postamble }) => {
            let description = '';
            if (preamble) {
                description += `.${preamble.toString()} puskuri aikaa ennen tapahtumaa`;
            }
            if (postamble) {
                description += `.${postamble.toString()} puskuri aikaa tapahtuman jälkeen`;
            }
            return description;
        }
    },

    SchedulingDirectionPicker : {
        Forward       : 'Eteenpäin',
        Backward      : 'Taaksepäin',
        inheritedFrom : 'Peritty',
        enforcedBy    : 'Pakotettu'
    },

    CalendarField : {
        'Default calendar' : 'Oletuskalenteri',
        editCalendar       : 'Muokata kalenteria'
    },

    TaskEditorBase : {
        Information   : 'Tehtävän tiedot',
        Save          : 'Tallenna',
        Cancel        : 'Peruuta',
        Delete        : 'Poista',
        calculateMask : 'Laskee...',
        saveError     : 'Ei voida tallentaa, korjaa virheet ensin',
        repeatingInfo : 'Näytetään toistuva tapahtuma',
        editRepeating : 'Muokkaa'
    },

    TaskEdit : {
        editEvent              : 'Muokkaa tapahtumaa',
        ConfirmDeletionTitle   : 'Vahvista poistaminen',
        ConfirmDeletionMessage : 'Haluatko varmasti poistaa tapahtuman?'
    },

    GanttTaskEditor : {
        editorWidth : '52em'
    },

    SchedulerTaskEditor : {
        editorWidth : '33em'
    },

    SchedulerGeneralTab : {
        General      : 'Yleistä',
        Name         : 'Nimi',
        Resources    : 'Lähteet',
        '% complete' : '% suoritettu',
        Duration     : 'Kesto',
        Start        : 'Alkaa',
        Finish       : 'Loppuun',
        Effort       : 'Effort',
        Preamble     : 'Johdanto',
        Postamble    : 'Jälkisanat'
    },

    GeneralTab : {
        General      : 'Yleistä',
        Name         : 'Nimi',
        '% complete' : '% suoritettu',
        Duration     : 'Kesto',
        Start        : 'Aloitus',
        Finish       : 'Lopetus',
        Effort       : 'Effort',
        Dates        : 'Päivämäärät'
    },

    SchedulerAdvancedTab : {
        Advanced                   : 'Edistynyt',
        Calendar                   : 'Kalenteri',
        'Scheduling mode'          : 'Scheduling mode',
        'Effort driven'            : 'Effort ohjaama',
        'Manually scheduled'       : 'Manuaalisesti aikataulutettu',
        'Constraint type'          : 'Rajoitustyyppi',
        'Constraint date'          : 'Rajoituspäivämäärä',
        Inactive                   : 'Ei-aktiivinen',
        'Ignore resource calendar' : 'Ohita resurssikalenteri'
    },

    CalendarEditorDatePicker : {
        addException : 'Lisää poikkeus',
        addWeek      : 'Lisää viikko'
    },

    CalendarEditorExceptionTab : {
        addException    : 'Lisää poikkeus',
        removeException : 'Poista poikkeus',
        noRows          : 'Ei poikkeuksia lisätty'
    },

    CalendarEditorWeekTab : {
        addWeek    : 'Lisää viikko',
        removeWeek : 'Poistaa viikko'
    },

    CalendarEditor : {
        daysAreWorkingByDefault    : 'Päivät työskentelevät oletuksena',
        workingTimeCalendar        : 'Työajan kalenteri',
        exceptions                 : 'Poikkeukset',
        general                    : 'Yleinen',
        name                       : 'Nimi',
        parent                     : 'Vanhempi',
        save                       : 'Tallentaa',
        weeks                      : 'Viikot',
        error                      : 'Virhe',
        inputErrors                : 'Tulovirheitä on. Korjaa ne ennen muutosten tallentamista.',
        delete                     : 'Poistaa',
        addCalendar                : 'Lisää kalenteri',
        confirmation               : 'Vahvistus',
        removeCalendarWithChildren : 'Kalenterissa on lasten kalentereita. Napsauta "Kyllä" poistaaksesi kalenterin lastensa kanssa.',
        removeCalendarAndLinks     : 'Jotkut tietueet käyttävät kalenteria. Napsauta "Kyllä" irrottaa ne ja poistaa kalenteri.',
        newException               : 'Uusi poikkeus',
        newWeek                    : 'Uusi viikko'
    },

    CalendarEditorDateInfo : {
        isWorking    : ' työskentelee',
        isNotWorking : ' ei toimi',
        basedOn      : ' perustuen:',
        byDefault    : 'oletuksena',
        rangeTpl     : (start, end) => `${start}–17.30`
    },

    CalendarEditorLegend : {
        workingDay    : 'Työpäivä',
        nonWorkingDay : 'Työpäivä'
    },

    AvailabilityRangeError : {
        errorOverlap       : 'On päällekkäisiä alueita',
        errorMissingDate   : 'Aloitus- ja lopetusaika vaaditaan',
        errorStartAfterEnd : 'Aloitusaika ei voi olla loppuajan jälkeen'
    },

    CalendarEditorExceptionPanel : {
        name                                 : 'Nimi',
        from                                 : '-Sta',
        to                                   : '-Lla',
        is                                   : 'On',
        nonWorking                           : 'Ei-työ',
        working                              : 'Toimiva',
        hours                                : 'Tuntia',
        repeat                               : 'Toistaa',
        repeatEnd                            : 'Toistaa loppu',
        errorMissingDate                     : 'Poikkeuspäivämäärä vaaditaan',
        errorStartAfterEnd                   : '"Päivämäärä ei voi olla" - "päivämäärä ',
        errorStartAndEndRepeatNumberMismatch : 'Poikkeuksen tulisi aloittaa ja lopettaa sama määrä kertoja'
    },

    CalendarEditorWeekPanel : {
        name        : 'Nimi',
        from        : '-Sta',
        to          : '-Lla',
        days        : 'Päivä',
        copyDay     : 'Kopiopäivä',
        pasteDay    : 'Liittää päivä',
        stopCopying : 'Lopettaa kopiointi'
    },

    CalendarEditorAvailabilityRangeContainer : {
        addRange    : 'Lisätä',
        removeRange : 'Poista alue'
    },

    CalendarEditorWeekGrid : {
        errorStartAfterEnd           : '"Päivämäärä ei voi olla" - "päivämäärä ',
        errorNoDefaultWeek           : 'Viikon kokoonpano tarvitaan',
        errorMultipleDefaultWeeks    : 'Määritetään useampi kuin yksi oletusviikko',
        errorNoWeekAvailability      : 'Viikon on tarjottava jonkin verran työaikaa',
        errorInvalidWeekAvailability : 'Viikolla on työajan määritysvirheitä',
        noRows                       : 'Ei viikkoja lisätty'
    },

    AdvancedTab : {
        Advanced                   : 'Edistynyt',
        Calendar                   : 'Kalenteri',
        'Scheduling mode'          : 'Aikataulutustila',
        'Effort driven'            : 'Effort ohjaama',
        'Manually scheduled'       : 'Manuaalisesti aikataulutettu',
        'Constraint type'          : 'Rajoitustyyppi',
        'Constraint date'          : 'Rajoituspäivämäärä',
        Constraint                 : 'Rajoitus',
        Rollup                     : 'Rollup',
        Inactive                   : 'Ei-aktiivinen',
        'Ignore resource calendar' : 'Ohita resurssikalenteri',
        'Scheduling direction'     : 'Aikataulusuunta',
        projectBorder              : 'Projektiraja',
        ignore                     : 'Jättää huomiotta',
        honor                      : 'Kunnia',
        askUser                    : 'Kysyä käyttäjää'
    },

    DependencyTab : {
        Predecessors      : 'Edeltäjät',
        Successors        : 'Seuraajat',
        ID                : 'ID',
        Name              : 'Nimi',
        Type              : 'Tyyppi',
        Lag               : 'Lag',
        cyclicDependency  : 'Syklinen riippuvuus',
        invalidDependency : 'Virheellinen riippuvuus',
        readOnlyTask      : 'Vain luku -tehtävää ei voi linkittää'
    },

    NotesTab : {
        Notes : 'Huomautukset'
    },

    ResourceCalendarColumn : {
        calendar : 'Kalenteri'
    },

    ResourceEdit : {
        editResource : 'Muokkaa resurssia'
    },

    ResourceEditor : {
        resourceInformation : 'Resurssitiedot',
        costs               : 'Kustannukset',
        save                : 'Tallentaa',
        error               : 'Virhe',
        inputErrors         : 'On syöttövirheitä. Korjaa ne ennen muutosten tallentamista.',
        delete              : 'Poistaa',
        confirmation        : 'Vahvistus',
        removeUsedResource  : 'Resurssi on kohdistettu joihinkin tehtäviin. Napsauta "Kyllä" poistaaksesi resurssin joka tapauksessa.'
    },

    ResourceEditorGeneralTab : {
        calendar    : 'Kalenteri',
        general     : 'Kenraali',
        label       : 'Materiaali etiketti',
        name        : 'Resurssin nimi',
        type        : 'Tyyppi',
        costAccrual : 'Kustannuskertymä',
        labelHint   : 'esimerkiksi kg, tonneja tai laatikoita',
        maxUnits    : 'Maksimiyksiköt'
    },

    ResourceCostAccrualColumn : {
        accrueAt : 'Kerää klo',
        prorated : 'Suhteutettu',
        start    : 'Aloita',
        end      : 'Loppu'
    },

    CostAccrualField : {
        prorated : 'Suhteutettu',
        start    : 'Aloita',
        end      : 'Loppu'
    },

    ResourceType : {
        work     : 'Työ',
        material : 'Materiaali',
        cost     : 'Maksaa'
    },

    ResourceTypeColumn : {
        type : 'Tyyppi'
    },

    ResourceEditorRateTablesTab : {
        rateTable    : 'Hinnastotaulukko',
        newGroup     : 'Uusi pöytä',
        removeGroup  : 'Poista pöytä',
        useByDefault : 'Käytä oletuksena resurssimäärityksessä',
        noRates      : 'Ei hintoja'
    },

    ResourceGrid : {
        name          : 'Nimi',
        materialLabel : 'Materiaali etiketti',
        maxUnits      : 'Max yksikköä',
        cost          : 'Maksaa',
        noRows        : 'Ei resursseja'
    },

    ResourceRateTableContainer : {
        startDate    : 'Aloituspäivämäärä',
        standardRate : 'Vakiohinta',
        perUseCost   : 'Käyttökohtainen hinta',
        addRate      : 'Lisää korko',
        removeRate   : 'Poista korko',
        name         : 'Nimi',
        noRates      : 'Ei hintoja'
    },

    ResourceRateTableEditor : {
        rateTableInformation : 'Hintataulukon tiedot'
    },

    ResourcesTab : {
        unitsTpl    : ({ column, value }) => column.formatValue(value) + '%',
        quantityTpl : ({ record, value }) => `${value || 0} ${record.resource?.materialLabel || ''}`,
        quantity    : 'Määrä',
        Resources   : 'Läheteet',
        Resource    : 'Lähde',
        Units       : 'Yksiköt',
        cost        : 'Maksaa',
        effort      : 'Vaivaa',
        start       : 'Aloita',
        finish      : 'Valmis',
        preamble    : 'Esipuhe',
        postamble   : 'Jälkikirjoitus'
    },

    RateTableColumn : {
        rateTable : 'Hinnastotaulukko'
    },

    RecurrenceTab : {
        title : 'Toista'
    },

    SchedulingModePicker : {
        Normal           : 'Normaali',
        'Fixed Duration' : 'Kiinteä kesto',
        'Fixed Units'    : 'Kiinteät yksiköt',
        'Fixed Effort'   : 'Kiinteä Vaivaa'
    },

    ResourceHistogram : {
        barTipInRange         : '<b>{resource}</b> {startDate} - {endDate}<br><span class="{cls}">{allocated} --sta {available}</span> kohdistettu',
        barTipOnDate          : '<b>{resource}</b> on {startDate}<br><span class="{cls}">{allocated} -sta {available}</span> kohdistettu',
        groupBarTipAssignment : '<b>{resource}</b> - <span class="{cls}">{allocated} -sta{available}</span>',
        groupBarTipInRange    : '{startDate} - {endDate}<br><span class="{cls}">{allocated} -sta{available}</span> allocated:<br>{assignments}',
        groupBarTipOnDate     : ' {startDate}<br><span class="{cls}">{allocated} -sta {available}</span> kohdistettu:<br>{assignments}',
        plusMore              : '+{value} lisää'
    },

    ResourceUtilization : {
        effortRangeInfo       : '<div class="b-effort-range-data"><div class="b-effort-label">Ponnistus</div><div class="b-effort-value {cls}">{allocated} / {available}</div></div>',
        effortInfo            : '<div class="b-effort-data"><div class="b-effort-label">Ponnistus</div><div class="b-effort-value {cls}">{allocated}</div></div>',
        costInfo              : '<div class="b-cost-data"><div class="b-effort-label">Kustannus</div><div class="b-effort-value b-cost">{cost}</div></div>',
        quantityInfo          : '<div class="b-quantity-data"><div class="b-effort-label">Määrä</div><div class="b-effort-value b-quantity">{quantity}</div></div>',
        barTipInRange         : '<div class="b-on-date">{event} {startDate} - {endDate}</div><div class="b-summary-data">{effort-info}{cost-info}{quantity-info}</div>',
        barTipOnDate          : '<div class="b-on-date">{event} {startDate}</div><div class="b-summary-data">{effort-info}{cost-info}{quantity-info}</div>',
        groupBarTipAssignment : '<div class="b-assignment"><div class="b-assignment-name">{event}</div>{effort-info}{cost-info}{quantity-info}</div>',
        groupBarTipInRange    : '<div class="b-on-date">Yhteenveto {startDate} - {endDate}</div><div class="b-summary-data">{effort-range-info}{cost-info}{quantity-info}</div><div class="b-assignments">{assignments}</div>',
        groupBarTipOnDate     : '<div class="b-on-date">Yhteenveto {startDate}</div><div class="b-summary-data">{effort-range-info}{cost-info}{quantity-info}</div><div class="b-assignments">{assignments}</div>',
        plusMore              : '+{value} lisää',
        nameColumnText        : 'Resurssi / Tapahtuma'
    },

    SchedulingIssueResolutionPopup : {
        'Cancel changes'   : 'Peruuta muutos, äläkä tee mitään',
        schedulingConflict : 'Aikatauluristiriita',
        emptyCalendar      : 'Kalenterin määritysvirhe',
        cycle              : 'Aikataulusykli',
        Apply              : 'Aseta'
    },

    CycleResolutionPopup : {
        dependencyLabel        : 'Valitse riippuvuus:',
        invalidDependencyLabel : 'Asiaan liittyy virheellisiä riippuvuuksia, jotka on käsiteltävä:'
    },

    SchedulerProBase : {
        propagating     : 'Laskee projektia',
        storePopulation : 'Lataa tietoja',
        finalizing      : 'Viimeistelee tuloksia'
    },

    EventSegments : {
        splitEvent    : 'Jaa tapahtuma osiin',
        renameSegment : 'Nimeä uudelleen'
    },

    NestedEvents : {
        createGroup         : 'Ryhmitä valitut tapahtumat',
        newGroupName        : 'Uusi ryhmä',
        deNestingNotAllowed : 'De-nesting ei allowed',
        nestingNotAllowed   : 'Nesting ei sallita'
    },

    VersionGrid : {
        compare       : 'Vertaa',
        description   : 'Kuvaus',
        occurredAt    : 'Tapahtui',
        rename        : 'Nimeä uudelleen',
        restore       : 'Palauta',
        stopComparing : 'Lopeta vertailu'
    },

    Versions : {
        entityNames : {
            TaskModel       : 'tehtävä',
            AssignmentModel : 'toimeksianto',
            DependencyModel : 'linkki',
            ProjectModel    : 'projekti',
            ResourceModel   : 'resurssi',
            other           : 'kohde'
        },
        entityNamesPlural : {
            TaskModel       : 'tehtävät',
            AssignmentModel : 'toimeksiannot',
            DependencyModel : 'linkit',
            ProjectModel    : 'projektit',
            ResourceModel   : 'resurssit',
            other           : 'kohteet'
        },
        transactionDescriptions : {
            update : 'Muutetut {n} {entities}',
            add    : 'Lisätyt {n} {entities}',
            remove : 'Poistetut {n} {entities}',
            move   : 'Siirretyt {n} {entities}',
            mixed  : 'Muutetut {n} {entities}'
        },
        propertyNames : {
            active                   : 'Aktiivinen',
            allDay                   : 'Koko päivä',
            allowOverlap             : 'Salli päällekkäisyys',
            barMargin                : 'Palkin marginaali',
            bidirectional            : 'Kaksisuuntainen',
            calendar                 : 'Kalenteri',
            cls                      : 'CSS-luokka',
            constraintDate           : 'Rajoituspäivämäärä',
            constraintType           : 'Rajoitustyyppi',
            daysPerMonth             : 'Päiviä kuukaudessa',
            daysPerWeek              : 'Päiviä viikossa',
            delayFromParent          : 'Viive vanhemmasta',
            direction                : 'Suunta',
            drawDependencies         : 'Piirrä riippuvuudet',
            duration                 : 'Kesto',
            durationUnit             : 'Keston yksikkö',
            effort                   : 'Ponnistus',
            effortDriven             : 'Ponnistukseen perustuva',
            effortUnit               : 'Ponnistuksen yksikkö',
            endDate                  : 'Päättymispäivämäärä',
            eventColor               : 'Väri',
            eventId                  : 'Tapahtuman ID',
            eventLayout              : 'Tapahtuman asettelu',
            eventStyle               : 'Palkin tyyli',
            exceptionDates           : 'Poikkeuspäivät',
            fixed                    : 'Kiinteä',
            from                     : 'Alkaen',
            fromSide                 : 'Alkaen puolelta',
            hoursPerDay              : 'Tunteja päivässä',
            href                     : 'Linkki',
            iconCls                  : 'Ikoni',
            id                       : 'ID',
            ignoreResourceCalendar   : 'Ohita resurssikalenteri',
            ignoreTimeZone           : 'Ohita aikavyöhyke',
            image                    : 'Kuva',
            imageUrl                 : 'Kuvan URL',
            inactive                 : 'Ei aktiivinen',
            intervals                : 'Välit',
            lag                      : 'Viive',
            lagUnit                  : 'Viiveen yksikkö',
            lineStyle                : 'Viivan tyyli',
            manuallyScheduled        : 'Manuaalisesti ajoitettu',
            milestoneWidth           : 'Virstanpylvään leveys',
            name                     : 'Nimi',
            note                     : 'Huomautus',
            parentId                 : 'Vanhemman ID',
            parentIndex              : 'Sijainti',
            percentDone              : '% valmis',
            postamble                : 'Jälkikirjoitus',
            preamble                 : 'Esipuhe',
            readOnly                 : 'Vain luku',
            recurrenceRule           : 'Toistumissääntö',
            resourceId               : 'Resurssin ID',
            resourceMargin           : 'Resurssin marginaali',
            rowHeight                : 'Rivin korkeus',
            schedulingMode           : 'Ajoitustila',
            segments                 : 'Segmentit',
            showAvatar               : 'Näytä avatar',
            showInTimeline           : 'Näytä aikajanalla',
            startDate                : 'Aloituspäivämäärä',
            stickyContents           : 'Tahmeat sisällöt',
            strokeColor              : 'Viivan väri',
            style                    : 'Tyyli',
            target                   : 'Linkin kohde',
            to                       : 'Päättyen',
            toSide                   : 'Päättyen puolelta',
            type                     : 'Tyyppi',
            units                    : 'Yksiköt',
            unscheduled              : 'Ei ajoitettu',
            unspecifiedTimeIsWorking : 'Määrittelemätön aika on työaikaa',
            version                  : 'Versio'
        },
        intervals : {
            working    : 'Työskentely',
            nonWorking : 'Ei työskentelyä',
            fromTo     : '{from} - {to}',
            recurring  : 'Toistuva alkaen {start} päättyen {end}'
        },
        addEntity         : 'Lisätty {type} **{name}**',
        removeEntity      : 'Poistettu {type} **{name}**',
        updateEntity      : 'Muutettu {type} **{name}**',
        moveEntity        : 'Siirretty {type} **{name}** kohdasta {from} kohtaan {to}',
        addDependency     : 'Lisätty linkki kohdasta **{from}** kohtaan **{to}**',
        removeDependency  : 'Poistettu linkki kohdasta **{from}** kohtaan **{to}**',
        updateDependency  : 'Muokattu linkki kohdasta **{from}** kohtaan **{to}**',
        addAssignment     : 'Määritetty **{resource}** tapahtumaan **{event}**',
        removeAssignment  : 'Poistettu toimeksianto **{resource}** tapahtumasta **{event}**',
        updateAssignment  : 'Muokattu toimeksianto **{resource}** tapahtumaan **{event}**',
        noChanges         : 'Ei muutoksia',
        nullValue         : 'ei lainkaan',
        versionDateFormat : 'M/D/YYYY h:mm a',
        savedAt           : 'Tallennettu {date}',
        autoSavedAt       : 'Automaattisesti tallennettu {date}',
        undid             : 'Peruutetut muutokset',
        redid             : 'Uudelleen tehdyt muutokset',
        editedTask        : 'Muokatut tehtävän ominaisuudet',
        deletedTask       : 'Tehtävä poistettu',
        movedTask         : 'Tehtävä siirretty',
        movedTasks        : 'Siirretyt tehtävät'
    }
};

export default LocaleHelper.publishLocale(locale);
