import LocaleHelper from './LocaleHelper.js';

const locale = {

    localeName : 'SrRs',
    localeDesc : 'Српски (ћирилица)',
    localeCode : 'sr-RS',
    localeRtl  : false,

    Object : {
        Yes      : 'Да',
        No       : 'Не',
        Cancel   : 'Откажи',
        Ok       : 'У реду',
        Week     : 'Седмица',
        None     : 'Ниједан',
        previous : 'Претходни',
        next     : 'Следећи',
        to       : 'до',
        at       : 'в',
        on       : 'на',
        editing  : what => `Редактирование ${what}`,
        settings : 'Настройки',
        close    : 'Закрыть',
        go       : 'Иди',
        save     : 'Сачувај',
        cancel   : 'Откажи',
        revert   : 'Врати',
        collapse : 'Скупи',
        expand   : 'Развиј',
        today    : 'Данас',
        andNMore : n => `и још ${n}`
    },

    AIBase : {
        delayStatusTexts : [
            'Чекање',
            'Чекање ...',
            'Још увек чекање',
            'Још увек чекање ...'
        ],
        autoStartDialogMessage        : 'Да ли желите да омогућите активацију гласа вештачке интелигенције?',
        voiceActivationToast          : phrase => `Активација гласа омогућена, користите фразу "${phrase}" за почетак разговора`,
        voiceControlNotSupportedToast : 'Контрола гласа није подржана на овом уређају',
        voiceControlErrorToast        : 'Контрола гласа није могла бити покренута на вашем уређају',
        voiceControlSilenceToast      : phrase => `AI разговор гласа је завршен због тишине. Користите фразу ${phrase} за поновно покретање разговора`,
        noAudioDetected               : 'Није откривен звук, молимо покушајте поново',
        transcriptionErrorToast       : 'Транскрипција није успела, молимо покушајте поново',
        playbackErrorToast            : 'Репродукција звука није успела, молимо проверите ваш уређај за аудио излаз',
        failed                        : '(није успело)',
        awaitingConfirmation          : 'Чека се потврда',
        timeoutToast                  : 'Порука је истекла',
        readingStatusText             : modelName => `Читање ${modelName}s`,
        updatingStatusText            : modelName => `Ажурирање ${modelName}s`,
        removingStatusText            : modelName => `Уклањање ${modelName}s`,
        addingStatusText              : modelName => `Додавање ${modelName}`,
        filteringStatusText           : modelName => `Филтрирање ${modelName}s`,
        thinkingStatusText            : 'Размишљање',
        processingStatusText          : 'Обрада'
    },

    AISettingsPanel : {
        highlight               : 'Истакни',
        verbosity               : 'Вербалност',
        voiceActivation         : 'Гласовна активација',
        enableVoiceActivation   : 'Омогући гласовну активацију',
        voiceOnly               : 'Само глас',
        autostart               : 'Аутоматски почетак',
        dataChangeConfirmations : 'Потврда промене података',
        add                     : 'Додај',
        remove                  : 'Уклони',
        update                  : 'Ажурирај',
        planning                : 'Планирање',
        enablePlanning          : 'Омогући планирање',
        aiModel                 : 'АИ модел',
        timeline                : 'Временска линија',
        'in-view'               : 'У приказу',
        all                     : 'Све',
        timeRangeContext        : 'Контекст временског опсега'
    },

    ChatButton : {
        tooltipPartSeparator  : ' - ',
        speakingTooltip       : 'АИ говори',
        recordingTooltip      : 'Снимање',
        waitingTooltip        : 'АИ размишља',
        startRecordingTooltip : 'Кликните за почетак',
        stopRecordingTooltip  : 'Кликните за заустављање',
        inactiveTooltip       : 'Није активно',
        openChatTooltip       : 'Десни клик за отварање чета'
    },

    ChatPanel : {
        messageFieldPlaceholder : 'Унесите поруку',
        noConnectionTooltip     : 'Није откривена веза, кликните за поновни покушај',
        undone                  : 'поништено',
        aborted                 : '(прекинуто)',
        readAloudTooltip        : 'Прочитајте поруку наглас',
        confidenceTooltip       : confidence => `Поверење: ${confidence}%`,
        undoTooltip             : 'Поништите промене података',
        redoTooltip             : 'Поновите промене података',
        thumbsUp                : 'Палац горе',
        thumbsDown              : 'Палац доле',
        feedbackToast           : 'Хвала вам на повратним информацијама!',
        clearChat               : 'Очисти разговор',
        closeChat               : 'Затвори чет',
        settings                : 'Подешавања',
        closeSettings           : 'Затвори подешавања'
    },

    CheckboxGroup : {
        wrongNbrOfOptionsSelected : min => `Изаберите тачно ${min}`,
        tooFewOptionsSelected     : min => `Изаберите најмање ${min}`,
        tooManyOptionsSelected    : max => `Изаберите највише ${max}`
    },

    CodeEditor : {
        apply        : 'Примени',
        autoApply    : 'Аутоматска примена',
        downloadCode : 'Преузми код'
    },

    ColorPicker : {
        noColor : 'Без боје'
    },

    Combo : {
        noResults          : 'Нема резултата',
        recordNotCommitted : 'Није могуће додати запис',
        addNewValue        : value => `Додај ${value}`
    },

    ConfirmationDialog : {
        highlight       : 'Истакните',
        preview         : 'Преглед',
        approve         : 'Одобрите',
        reject          : 'Одбаците',
        confirmAdd      : 'Потврдите додавање:',
        confirmUpdate   : 'Потврдите ажурирање:',
        confirmRemove   : 'Потврдите уклањање:',
        confirmCopy     : 'Потврдите копирање',
        confirmAssign   : 'Потврдите доделу',
        confirmReassign : 'Потврдите поновну доделу',
        confirmUnassign : 'Потврдите уклањање доделе',
        confirmLink     : 'Потврдите везу',
        confirmUnlink   : 'Потврдите уклањање везе'
    },

    FilePicker : {
        file : 'Датотека'
    },

    Field : {
        badInput              : 'Неважећа вредност поља',
        patternMismatch       : 'Вредност треба да се подудара са одређеним обрасцем',
        rangeOverflow         : value => `Вредност мора да буде мања или једнака са ${value.max}`,
        rangeUnderflow        : value => `Вредност мора да буде већа или једнака са ${value.min}`,
        stepMismatch          : 'Вредност треба да се уклапа у корак',
        tooLong               : 'Вредност треба да буде краћа',
        tooShort              : 'Вредност треба да буде дужа',
        typeMismatch          : 'Потребно је да вредност буде у посебном формату',
        valueMissing          : 'Ово поље је обавезно',
        invalidValue          : 'Неважећа вредност поља',
        minimumValueViolation : 'Кршење ограничења минималне вредности',
        maximumValueViolation : 'Кршење ограничења максималне вредности',
        fieldRequired         : 'Ово поље је обавезно',
        validateFilter        : 'Вредност мора да се изабере са листе'
    },

    DateField : {
        invalidDate : format => 'Неважећи унос датума, очекивани формат је ' + format
    },

    DatePicker : {
        gotoPrevYear  : 'Иди на претходну годину',
        gotoPrevMonth : 'Иди на претходни месец',
        gotoNextMonth : 'Иди на следећи месец',
        gotoNextYear  : 'Иди на следећу годину',
        navigation    : 'Навигација за избор датума'
    },

    Hint : {
        dontShowAgain : 'Не приказуј поново'
    },

    NumberFormat : {
        locale   : 'sr-RS',
        currency : 'RSD'
    },

    DurationField : {
        invalidUnit : 'Неважећа јединица'
    },

    TimeField : {
        invalidTime : 'Неважећи унос времена'
    },

    TimePicker : {
        hour   : 'Час',
        minute : 'Минут',
        second : 'Секунда'
    },

    Tooltip : {
        loading : 'Учитавање...'
    },

    List : {
        loading   : 'Учитавање...',
        selectAll : 'Изабери све'
    },

    GridBase : {
        loadMask : 'Учитавање...',
        syncMask : 'Чување промена, сачекајте...'
    },

    PagingToolbar : {
        firstPage         : 'Иди на прву страницу',
        prevPage          : 'Иди на претходну страницу',
        page              : 'Страница',
        nextPage          : 'Иди на следећу страницу',
        lastPage          : 'Иди на последњу страницу',
        reload            : 'Поново учитај тренутну страницу',
        noRecords         : 'Нема записа за приказивање',
        pageCountTemplate : data => `од ${data.lastPage}`,
        summaryTemplate   : data => `Приказ записа ${data.start} - ${data.end} oд ${data.allCount}`
    },

    Popup : {
        close    : 'Затвори',
        maximize : 'Максимизуј'
    },

    Splitter : {
        ariaLabel      : 'Разделник, користите тастере са стрелицама за промену величине суседних панела',
        collapseLeft   : 'Скупи леви панел',
        collapseRight  : 'Скупи десни панел',
        collapseTop    : 'Скупи горњи панел',
        collapseBottom : 'Скупи доњи панел',
        expandLeft     : 'Рашири леви панел',
        expandRight    : 'Рашири десни панел',
        expandTop      : 'Рашири горњи панел',
        expandBottom   : 'Рашири доњи панел'
    },

    TabPanel : {
        containsInvalidFields : 'Таб садржи неважећа поља'
    },

    Toolbar : {
        showOverflowingItems : 'Прикажи преливене ставке',
        scrollForMore        : 'Померите за више'
    },

    UndoRedo : {
        Undo           : 'Опозови',
        Redo           : 'Понови',
        UndoLastAction : 'Опозови последњу радњу',
        RedoLastAction : 'Понови последњу поништену радњу',
        NoActions      : 'Нема ставки у реду чекања за опозив'
    },

    FieldFilterPicker : {
        equals                 : 'једнако',
        doesNotEqual           : 'није једнако',
        isEmpty                : 'празно',
        isNotEmpty             : 'није празно',
        contains               : 'садржи',
        doesNotContain         : 'не садржи',
        startsWith             : 'почиње на',
        endsWith               : 'завршава се са',
        isOneOf                : 'један од',
        isNotOneOf             : 'није један од',
        isGreaterThan          : 'веће је од',
        isLessThan             : 'мање је од',
        isGreaterThanOrEqualTo : 'веће је од или једнако',
        isLessThanOrEqualTo    : 'мање је од или је једнако',
        isBetween              : 'између',
        isNotBetween           : 'није између',
        isBefore               : 'пре',
        isAfter                : 'после',
        timeEquals             : 'време је једнако',
        timeDoesNotEqual       : 'време није једнако',
        isToday                : 'данас',
        isTomorrow             : 'сутра',
        isYesterday            : 'јуче',
        isThisWeek             : 'ове седмице',
        isNextWeek             : 'следећа седмица',
        isLastWeek             : 'прошле недеље',
        isThisMonth            : 'овог месеца',
        isNextMonth            : 'следећи месец',
        isLastMonth            : 'прошлог месеца',
        isThisYear             : 'ове године',
        isNextYear             : 'следећа година',
        isLastYear             : 'прошле године',
        isYearToDate           : 'ове године до данас',
        isTrue                 : 'тачно',
        isFalse                : 'нетачно',
        selectAProperty        : 'Изаберите својство',
        selectAnOperator       : 'Изаберите оператора',
        caseSensitive          : 'Разликује велика и мала слова',
        and                    : 'и',
        dateFormat             : 'Д.M.ГГ.',
        selectValue            : 'Изаберите вредност',
        selectOneOrMoreValues  : 'Изаберите једну или више вредности',
        enterAValue            : 'Унесите вредност',
        enterANumber           : 'Унесите број',
        selectADate            : 'Изаберите датум',
        selectATime            : 'Изаберите време'
    },

    FieldFilterPickerGroup : {
        addFilter : 'Додај филтер',
        applyCond : applied => applied ? 'Прескочи филтер (тренутно примењен)' : 'Примени филтер (тренутно прескочен)'
    },

    DateHelper : {
        locale         : 'sr-RS',
        weekStartDay   : 0,
        nonWorkingDays : {
            0 : true,
            6 : true
        },
        weekends : {
            0 : true,
            6 : true
        },
        unitNames : [
            { single : 'милисекунда', plural : 'мс', abbrev : 'мс' },
            { single : 'emillisecond', plural : 'ems', abbrev : 'ems' },
            { single : 'секунда', plural : 'секунде', abbrev : 'с' },
            { single : 'esecond', plural : 'eseconds', abbrev : 'es' },
            { single : 'минут', plural : 'минута', abbrev : 'мин' },
            { single : 'eminute', plural : 'eminutes', abbrev : 'emin' },
            { single : 'час', plural : 'часова', abbrev : 'ч' },
            { single : 'ehour', plural : 'ehours', abbrev : 'eh' },
            { single : 'дан', plural : 'дана', abbrev : 'д' },
            { single : 'eday', plural : 'edays', abbrev : 'ed' },
            { single : 'седмица', plural : 'седмице', abbrev : 'сед' },
            { single : 'eweek', plural : 'eweeks', abbrev : 'ew' },
            { single : 'месец', plural : 'месеци', abbrev : 'мес' },
            { single : 'emonth', plural : 'emonths', abbrev : 'emon' },
            { single : 'квартал', plural : 'квартала', abbrev : 'к' },
            { single : 'equarter', plural : 'equarters', abbrev : 'eq' },
            { single : 'година', plural : 'године', abbrev : 'год.' },
            { single : 'eyear', plural : 'eyears', abbrev : 'eyr' },
            { single : 'деценија', plural : 'деценије', abbrev : 'дец' },
            { single : 'edecade', plural : 'edecades', abbrev : 'edec' }
        ],
        unitAbbreviations : [
            ['мил'],
            [],
            ['с', 'сек'],
            [],
            ['м', 'мин'],
            [],
            ['ч', 'ч.'],
            [],
            ['д'],
            [],
            ['сед', 'сд.'],
            [],
            ['ме', 'мес', 'мсц'],
            [],
            ['к', 'кварт.', 'кврт.'],
            [],
            ['г', 'год.'],
            [],
            ['дец'],
            []
        ],
        parsers : {
            L   : 'ДД.MM.ГГГГ.',
            LT  : 'ЧЧ:mm A',
            LTS : 'ЧЧ:мм:сс A'
        },
        ordinalSuffix : number => {
            const hasSpecialCase = ['11', '12', '13'].find((n) => number.endsWith(n));

            let suffix = '.';

            if (!hasSpecialCase) {
                const lastDigit = number[number.length - 1];
                suffix = { 1 : '.', 2 : '.', 3 : '.' }[lastDigit] || '.';
            }

            return number + suffix;
        },
        decade : date => {
            const year = typeof date === 'number' ? date : date.getFullYear();
            return `${year - (year % 10)}-их`;
        }
    }
};

export default LocaleHelper.publishLocale(locale);
