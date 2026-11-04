import LocaleHelper from './LocaleHelper.js';

const locale = {

    localeName : 'Fi',
    localeDesc : 'Suomi',
    localeCode : 'fi',
    localeRtl  : false,

    Object : {
        Yes      : 'Kyllä',
        No       : 'Ei',
        Cancel   : 'Peruuta',
        Ok       : 'OK',
        Week     : 'Viikko',
        None     : 'Ei mitään',
        previous : 'Edellinen',
        next     : 'Seuraava',
        to       : 'asti',
        at       : 'klo',
        on       : 'päälle',
        editing  : what => `Muokataan ${what}`,
        settings : 'Asetukset',
        close    : 'Sulje',
        go       : 'Mene',
        save     : 'Tallenna',
        cancel   : 'Peruuta',
        revert   : 'Kumoa',
        collapse : 'Pienennä',
        expand   : 'Laajenna',
        today    : 'Tänään',
        andNMore : n => `ja ${n} lisää`
    },

    AIBase : {
        delayStatusTexts : [
            'Odotetaan',
            'Odotetaan ...',
            'Edelleen odotetaan',
            'Edelleen odotetaan ...'
        ],
        autoStartDialogMessage        : 'Haluatko ottaa käyttöön AI-äänikäynnistyksen?',
        voiceActivationToast          : phrase => `Ääniaktivointi käytössä, käytä lausetta "${phrase}" aloittaaksesi keskustelun`,
        voiceControlNotSupportedToast : 'Ääniohjausta ei tueta tällä laitteella',
        voiceControlErrorToast        : 'Ääniohjausta ei voitu käynnistää laitteellasi',
        voiceControlSilenceToast      : phrase => `AI-äänikeskustelu päättyi hiljaisuuden vuoksi. Käytä lausetta ${phrase} aloittaaksesi keskustelun uudelleen`,
        noAudioDetected               : 'Ääntä ei havaittu, yritä uudelleen',
        transcriptionErrorToast       : 'Puheentunnistus epäonnistui, yritä uudelleen',
        playbackErrorToast            : 'Äänentoisto epäonnistui, tarkista äänilaitteesi',
        failed                        : '(epäonnistui)',
        awaitingConfirmation          : 'Odotetaan vahvistusta',
        timeoutToast                  : 'Viesti aikakatkaistiin',
        readingStatusText             : modelName => `Luetaan ${modelName}s`,
        updatingStatusText            : modelName => `Päivitetään ${modelName}s`,
        removingStatusText            : modelName => `Poistetaan ${modelName}s`,
        addingStatusText              : modelName => `Lisätään ${modelName}`,
        filteringStatusText           : modelName => `Suodatetaan ${modelName}s`,
        thinkingStatusText            : 'Mietitään',
        processingStatusText          : 'Käsitellään'
    },

    AISettingsPanel : {
        highlight               : 'Korosta',
        verbosity               : 'Sanamäärä',
        voiceActivation         : 'Ääniohjaus',
        enableVoiceActivation   : 'Ota ääniohjaus käyttöön',
        voiceOnly               : 'Vain ääni',
        autostart               : 'Automaattinen käynnistys',
        dataChangeConfirmations : 'Tietojen muutoksen vahvistus',
        add                     : 'Lisää',
        remove                  : 'Poista',
        update                  : 'Päivitä',
        planning                : 'Suunnittelu',
        enablePlanning          : 'Ota suunnittelu käyttöön',
        aiModel                 : 'AI-malli',
        timeline                : 'Aikajana',
        'in-view'               : 'Näkyvissä',
        all                     : 'Kaikki',
        timeRangeContext        : 'Aikavälin konteksti'
    },

    ChatButton : {
        tooltipPartSeparator  : ' - ',
        speakingTooltip       : 'AI puhuu',
        recordingTooltip      : 'Äänitys',
        waitingTooltip        : 'AI ajattelee',
        startRecordingTooltip : 'Klikkaa aloittaaksesi',
        stopRecordingTooltip  : 'Klikkaa lopettaaksesi',
        inactiveTooltip       : 'Ei äänitystä',
        openChatTooltip       : 'Napsauta oikealla avatakseen keskustelun'
    },

    ChatPanel : {
        messageFieldPlaceholder : 'Kirjoita viesti',
        noConnectionTooltip     : 'Yhteyttä ei havaittu, napsauta yrittääksesi uudelleen',
        undone                  : 'peruttu',
        aborted                 : '(keskeytetty)',
        readAloudTooltip        : 'Lue viesti ääneen',
        confidenceTooltip       : confidence => `Luottamus: ${confidence}%`,
        undoTooltip             : 'Kumoa tietomuutokset',
        redoTooltip             : 'Tee tietomuutokset uudelleen',
        thumbsUp                : 'Peukku ylös',
        thumbsDown              : 'Peukku alas',
        feedbackToast           : 'Kiitos palautteestasi!',
        clearChat               : 'Tyhjennä keskustelu',
        closeChat               : 'Sulje keskustelu',
        settings                : 'Asetukset',
        closeSettings           : 'Sulje asetukset'
    },

    CheckboxGroup : {
        wrongNbrOfOptionsSelected : min => `Valitse tarkalleen ${min}`,
        tooFewOptionsSelected     : min => `Valitse vähintään ${min}`,
        tooManyOptionsSelected    : max => `Valitse enintään ${max}`
    },

    CodeEditor : {
        apply        : 'Käytä',
        autoApply    : 'Käytä automaattisesti',
        downloadCode : 'Lataa koodi'
    },

    ColorPicker : {
        noColor : 'Ei väriä'
    },

    Combo : {
        noResults          : 'Ei tuloksia',
        recordNotCommitted : 'Tietuetta ei voitu lisätä',
        addNewValue        : value => `Lisää ${value}`
    },

    ConfirmationDialog : {
        highlight       : 'Korosta',
        preview         : 'Esikatselu',
        approve         : 'Hyväksy',
        reject          : 'Hylkää',
        confirmAdd      : 'Vahvista lisäys:',
        confirmUpdate   : 'Vahvista päivitys:',
        confirmRemove   : 'Vahvista poisto:',
        confirmCopy     : 'Vahvista kopiointi',
        confirmAssign   : 'Vahvista määritys',
        confirmReassign : 'Vahvista uudelleenmääritys',
        confirmUnassign : 'Vahvista määrityksen poisto',
        confirmLink     : 'Vahvista linkki',
        confirmUnlink   : 'Vahvista linkin poisto'
    },

    FilePicker : {
        file : 'Tiedosto'
    },

    Field : {
        badInput              : 'Virheellinen kentän arvo',
        patternMismatch       : 'Arvon tulee vastata tiettyä mallia',
        rangeOverflow         : value => `Arvon tulee olla pienempi tai yhtä suuri kuin ${value.max}`,
        rangeUnderflow        : value => `Arvon tulee olla suurempi tai yhtä suuri kuin ${value.min}`,
        stepMismatch          : 'Arvon pitäisi sopia vaiheeseen',
        tooLong               : 'Arvon tulee olla lyhyempi',
        tooShort              : 'Arvon tulee olla pidempi',
        typeMismatch          : 'Arvon on oltava tietyssä muodossa',
        valueMissing          : 'Tämä kenttä on pakollinen',
        invalidValue          : 'Virheellinen kentän arvo',
        minimumValueViolation : 'Vähimmäisarvon ylitys',
        maximumValueViolation : 'Enimmäisarvon ylitys',
        fieldRequired         : 'Tämä kenttä on pakollinen',
        validateFilter        : 'Arvo pitää valita listasta'
    },

    DateField : {
        invalidDate : format => 'Virheellinen päivämääräsyöte, odotettu muoto on ' + format
    },

    DatePicker : {
        gotoPrevYear  : 'Siirry edelliseen vuoteen',
        gotoPrevMonth : 'Siirry edelliseen kuukauteen',
        gotoNextMonth : 'Siirry seuraavaan kuukauteen',
        gotoNextYear  : 'Siirry seuraavaan vuoteen',
        navigation    : 'Päivämäärän valitsimen navigointi'
    },

    Hint : {
        dontShowAgain : 'Älä näytä uudelleen'
    },

    NumberFormat : {
        locale   : 'fi',
        currency : 'EUR'
    },

    DurationField : {
        invalidUnit : 'Virheellinen yksikkö'
    },

    TimeField : {
        invalidTime : 'Virheellinen aika'
    },

    TimePicker : {
        hour   : 'Tunti',
        minute : 'Minuutti',
        second : 'Sekunti'
    },

    Tooltip : {
        loading : 'Ladataan...'
    },

    List : {
        loading   : 'Lataa...',
        selectAll : 'Valitse kaikki'
    },

    GridBase : {
        loadMask : 'Lataa...',
        syncMask : 'Tallentaa muutoksia, odota hetki...'
    },

    PagingToolbar : {
        firstPage         : 'Siirry ensimmäiselle sivulle',
        prevPage          : 'Siirry edelliselle sivulle',
        page              : 'Sivu',
        nextPage          : 'Siirry seuraavalle sivulle',
        lastPage          : 'Siirry viimeiselle sivulle',
        reload            : 'Lataa nykyinen sivu uudelleen',
        noRecords         : 'Ei näytettäviä tietueita',
        pageCountTemplate : data => `/ ${data.lastPage}`,
        summaryTemplate   : data => `Näytetään tietueita ${data.start} - ${data.end} / ${data.allCount}`
    },

    Popup : {
        close    : 'Sulje ponnahdusikkuna',
        maximize : 'Maksimoi'
    },

    Splitter : {
        ariaLabel      : 'Jakaja, käytä nuolinäppäimiä vierekkäisten paneelien koon muuttamiseen',
        collapseLeft   : 'Kutista vasen paneeli',
        collapseRight  : 'Kutista oikea paneeli',
        collapseTop    : 'Kutista ylin paneeli',
        collapseBottom : 'Kutista alin paneeli',
        expandLeft     : 'Laajenna vasen paneeli',
        expandRight    : 'Laajenna oikea paneeli',
        expandTop      : 'Laajenna ylin paneeli',
        expandBottom   : 'Laajenna alin paneeli'
    },

    TabPanel : {
        containsInvalidFields : 'Välilehti sisältää virheellisiä kenttiä'
    },

    Toolbar : {
        showOverflowingItems : 'Näytä ylivuotavat kohteet',
        scrollForMore        : 'Vieritä nähdäksesi lisää'
    },

    UndoRedo : {
        Undo           : 'Peruuta',
        Redo           : 'Tee uudelleen',
        UndoLastAction : 'Peruuta edellinen toiminto',
        RedoLastAction : 'Viimeisimmän tekemättömän toiminnon palauttaminen',
        NoActions      : 'Peruutusjonossa ei ole kohteita'
    },

    FieldFilterPicker : {
        equals                 : 'on sama',
        doesNotEqual           : 'ei ole sama',
        isEmpty                : 'on tyhjä',
        isNotEmpty             : 'ei ole tyhjä',
        contains               : 'sisältää',
        doesNotContain         : 'ei sisällä',
        startsWith             : 'alkaa',
        endsWith               : 'päättyy',
        isOneOf                : 'on yksi /',
        isNotOneOf             : 'ei ole yksi /',
        isGreaterThan          : 'on suurempi kuin',
        isLessThan             : 'on vähemmän kuin',
        isGreaterThanOrEqualTo : 'on suurempi tai yhtä suuri kuin',
        isLessThanOrEqualTo    : 'on pienempi tai yhtä suuri kuin',
        isBetween              : 'on välillä',
        isNotBetween           : 'ei ole välillä',
        isBefore               : 'on ennen',
        isAfter                : 'on jälkeen',
        timeEquals             : 'aika on yhtä kuin',
        timeDoesNotEqual       : 'aika ei ole yhtä kuin',
        isToday                : 'on tänään',
        isTomorrow             : 'on huomenna',
        isYesterday            : 'on eilinen',
        isThisWeek             : 'on tämä viikko',
        isNextWeek             : 'on seuraava viikko',
        isLastWeek             : 'on viimeinen viikko',
        isThisMonth            : 'on tämä kuukausi',
        isNextMonth            : 'on seuraava kuukausi',
        isLastMonth            : 'on edellinen kuukausi',
        isThisYear             : 'on tämä vuosi',
        isNextYear             : 'on seuraava vuosi',
        isLastYear             : 'on edellinen vuosi',
        isYearToDate           : 'on vuosi tähän päivään',
        isTrue                 : 'on tosi',
        isFalse                : 'on väärin',
        selectAProperty        : 'Valitse ominaisuus',
        selectAnOperator       : 'Valitse käyttäjä',
        caseSensitive          : 'Huomioi merkkikoko',
        and                    : 'ja',
        dateFormat             : 'D/M/YY',
        selectValue            : 'Valitse arvo',
        selectOneOrMoreValues  : 'Valitse yksi tai useampi arvo',
        enterAValue            : 'Syötä arvo',
        enterANumber           : 'Syötä numero',
        selectADate            : 'Valitse päivämäärä',
        selectATime            : 'Valitse aika'
    },

    FieldFilterPickerGroup : {
        addFilter : 'Lisää suodatin',
        applyCond : applied => applied ? 'Ohita suodatin (tällä hetkellä käytössä)' : 'Käytä suodatinta (tällä hetkellä ohitettu)'
    },

    DateHelper : {
        locale         : 'fi',
        weekStartDay   : 1,
        nonWorkingDays : {
            0 : true,
            6 : true
        },
        weekends : {
            0 : true,
            6 : true
        },
        unitNames : [
            { single : 'millisekunti', plural : 'ms', abbrev : 'ms' },
            { single : 'emillisecond', plural : 'ems', abbrev : 'ems' },
            { single : 'sekunti', plural : 'sekunttia', abbrev : 's' },
            { single : 'esecond', plural : 'eseconds', abbrev : 'es' },
            { single : 'minuutti', plural : 'minuuttia', abbrev : 'min' },
            { single : 'eminute', plural : 'eminutes', abbrev : 'emin' },
            { single : 'tunti', plural : 'tuntia', abbrev : 'h' },
            { single : 'ehour', plural : 'ehours', abbrev : 'eh' },
            { single : 'päivä', plural : 'päivää', abbrev : 'p' },
            { single : 'eday', plural : 'edays', abbrev : 'ed' },
            { single : 'viikko', plural : 'viikkoa', abbrev : 'vko' },
            { single : 'eweek', plural : 'eweeks', abbrev : 'ew' },
            { single : 'kuukausi', plural : 'kuukautta', abbrev : 'kk' },
            { single : 'emonth', plural : 'emonths', abbrev : 'emon' },
            { single : 'kvartaali', plural : 'kvartaalia', abbrev : 'q' },
            { single : 'equarter', plural : 'equarters', abbrev : 'eq' },
            { single : 'vuosi', plural : 'vuotta', abbrev : 'v' },
            { single : 'eyear', plural : 'eyears', abbrev : 'eyr' },
            { single : 'vuosikymmen', plural : 'vuosikymmen', abbrev : 'vuosikymmen' },
            { single : 'edecade', plural : 'edecades', abbrev : 'edec' }
        ],
        unitAbbreviations : [
            ['mil'],
            [],
            ['s', 'sek'],
            [],
            ['min', 'min'],
            [],
            ['tunti', 'h'],
            [],
            ['d'],
            [],
            ['viikko', 'vko'],
            [],
            ['kuukausi', 'kuukausi', 'kk'],
            [],
            ['kvartaali', 'kvartaali', 'q'],
            [],
            ['vuosi', 'v'],
            [],
            ['vuosikymmen'],
            []
        ],
        parsers : {
            L   : 'D.M.YYYY',
            LT  : 'HH:mm',
            LTS : 'HH:mm:ss A'
        },
        ordinalSuffix : number => number + '.',
        decade        : date => {
            const year = typeof date === 'number' ? date : date.getFullYear();
            return `${year - (year % 10)}-luku`;
        }
    }
};

export default LocaleHelper.publishLocale(locale);
