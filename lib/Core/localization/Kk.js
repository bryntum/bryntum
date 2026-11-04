import LocaleHelper from './LocaleHelper.js';

const locale = {

    localeName : 'Kk',
    localeDesc : 'Қазақ тілі (KZ)',
    localeCode : 'kk-KZ',
    localeRtl  : false,

    Object : {
        Yes      : 'Иә',
        No       : 'Жоқ',
        Cancel   : 'Баc тарту',
        Ok       : 'OK',
        Week     : 'Апта',
        None     : 'Жоқ',
        previous : 'Алдыңғы',
        next     : 'Келесі',
        to       : 'дейін',
        at       : 'сағат',
        on       : 'үстінде',
        editing  : what => `${what} өңдеу`,
        settings : 'Параметрлер',
        close    : 'Жабу',
        go       : 'Бару',
        save     : 'Сақтау',
        cancel   : 'Бас тарту',
        revert   : 'Өзгерістерді бас тарту',
        collapse : 'Жиыру',
        expand   : 'Жаю',
        today    : 'Бүгін',
        andNMore : n => `және ${n} тағы`
    },

    AIBase : {
        delayStatusTexts : [
            'Күту',
            'Күту ...',
            'Әлі де күту',
            'Әлі де күту ...'
        ],
        autoStartDialogMessage        : 'AI дауыс активациясын қосқыңыз келе ме?',
        voiceActivationToast          : phrase => `Дауыстық активация қосылды, сөйлесуді бастау үшін "${phrase}" сөзін қолданыңыз`,
        voiceControlNotSupportedToast : 'Бұл құрылғыда дауыстық басқару қолдау көрсетілмейді',
        voiceControlErrorToast        : 'Құрылғыңызда дауыстық басқару іске қосылмады',
        voiceControlSilenceToast      : phrase => `AI дауыстық сөйлесуі үнсіздікке байланысты аяқталды. Сөйлесуді қайта бастау үшін ${phrase} сөзін қолданыңыз`,
        noAudioDetected               : 'Дыбыс анықталмады, қайтадан көріңіз',
        transcriptionErrorToast       : 'Транскрипция сәтсіз аяқталды, қайтадан көріңіз',
        playbackErrorToast            : 'Аудио ойнату сәтсіз аяқталды, аудио шығару құрылғысын тексеріңіз',
        failed                        : '(сәтсіздікке ұшырады)',
        awaitingConfirmation          : 'Растау күтілуде',
        timeoutToast                  : 'Хабарлама уақыты аяқталды',
        readingStatusText             : modelName => `${modelName}s оқу`,
        updatingStatusText            : modelName => `${modelName}s жаңарту`,
        removingStatusText            : modelName => `${modelName}s жою`,
        addingStatusText              : modelName => `${modelName} қосу`,
        filteringStatusText           : modelName => `${modelName}s сүзгілеу`,
        thinkingStatusText            : 'Ойлау',
        processingStatusText          : 'Өңдеу'
    },

    AISettingsPanel : {
        highlight               : 'Ерекшелеу',
        verbosity               : 'Сөзшеңдік',
        voiceActivation         : 'Дауыс активациясы',
        enableVoiceActivation   : 'Дауыс активациясын қосу',
        voiceOnly               : 'Тек дауыс',
        autostart               : 'Автоматты бастау',
        dataChangeConfirmations : 'Деректерді өзгерту растаулары',
        add                     : 'Қосу',
        remove                  : 'Жою',
        update                  : 'Жаңарту',
        planning                : 'Жоспарлау',
        enablePlanning          : 'Жоспарлауды қосу',
        aiModel                 : 'AI Моделі',
        timeline                : 'Уақыт шкаласы',
        'in-view'               : 'Көріністе',
        all                     : 'Барлығы',
        timeRangeContext        : 'Уақыт ауқымы контексті'
    },

    ChatButton : {
        tooltipPartSeparator  : ' - ',
        speakingTooltip       : 'AI сөйлеп жатыр',
        recordingTooltip      : 'Жазу',
        waitingTooltip        : 'AI ойлануда',
        startRecordingTooltip : 'Бастау үшін басыңыз',
        stopRecordingTooltip  : 'Тоқтату үшін басыңыз',
        inactiveTooltip       : 'Жазу жоқ',
        openChatTooltip       : 'Чатты ашу үшін оң жақты басыңыз'
    },

    ChatPanel : {
        messageFieldPlaceholder : 'Хабарлама жазыңыз',
        noConnectionTooltip     : 'Қосылым анықталмады, қайтадан көріңіз',
        undone                  : 'жойылды',
        aborted                 : '(тоқтатылды)',
        readAloudTooltip        : 'Хабарламаны дауыстап оқу',
        confidenceTooltip       : confidence => `Сенімділік: ${confidence}%`,
        undoTooltip             : 'Деректер өзгерістерін болдырмау',
        redoTooltip             : 'Деректер өзгерістерін қайталау',
        thumbsUp                : 'Жақсы',
        thumbsDown              : 'Жаман',
        feedbackToast           : 'Кері байланысыңыз үшін рахмет!',
        clearChat               : 'Чатты тазалау',
        closeChat               : 'Чатты жабу',
        settings                : 'Баптаулар',
        closeSettings           : 'Баптауларды жабу'
    },

    CheckboxGroup : {
        wrongNbrOfOptionsSelected : min => `Дәл ${min} таңдаңыз`,
        tooFewOptionsSelected     : min => `Кем дегенде ${min} таңдаңыз`,
        tooManyOptionsSelected    : max => `Ең көбі ${max} таңдаңыз`
    },

    CodeEditor : {
        apply        : 'Қолдану',
        autoApply    : 'Автоматты түрде қолдану',
        downloadCode : 'Кодты жүктеу'
    },

    ColorPicker : {
        noColor : 'Түсі жоқ'
    },

    Combo : {
        noResults          : 'Нәтижелер жоқ',
        recordNotCommitted : 'Жазбаны қосу мүмкін болмады',
        addNewValue        : value => `${value} қосу`
    },

    ConfirmationDialog : {
        highlight       : 'Ерекшелеу',
        preview         : 'Алдын ала қарау',
        approve         : 'Мақұлдау',
        reject          : 'Бас тарту',
        confirmAdd      : 'Қосу расталды:',
        confirmUpdate   : 'Жаңарту расталды:',
        confirmRemove   : 'Жою расталды:',
        confirmCopy     : 'Көшіру расталды',
        confirmAssign   : 'Тапсырма расталды',
        confirmReassign : 'Қайта тапсырма расталды',
        confirmUnassign : 'Тапсырманы алып тастау расталды',
        confirmLink     : 'Сілтемені растау',
        confirmUnlink   : 'Сілтемені ажыратуды растау'
    },

    FilePicker : {
        file : 'Файл'
    },

    Field : {
        badInput              : 'Жарамсыз өріс мәні',
        patternMismatch       : 'Мән белгілі бір үлгіге сәйкес келуі керек',
        rangeOverflow         : value => `Мән ${value.max} шамасынан аз немесе оған тең болуы керек`,
        rangeUnderflow        : value => `Мән ${value.min} шамасынан артық немесе оған тең болуы керек`,
        stepMismatch          : 'Мән қадамға сәйкес келуі керек',
        tooLong               : 'Мән қысқарақ болуы керек',
        tooShort              : 'Мән ұзағырақ болуы керек',
        typeMismatch          : 'Мән арнайы пішімде болуы керек',
        valueMissing          : 'Бұл өріс міндетті',
        invalidValue          : 'Жарамсыз өріс мәні',
        minimumValueViolation : 'Минималды мәннің бұзылуы',
        maximumValueViolation : 'Максималды мәннің бұзылуы',
        fieldRequired         : 'Бұл өріс міндетті',
        validateFilter        : 'Мән тізімнен таңдалуы керек'
    },

    DateField : {
        invalidDate : format => 'Қате күн енгізілді, күтілетін формат: ' + format
    },

    DatePicker : {
        gotoPrevYear  : 'Алдыңғы жылға өту',
        gotoPrevMonth : 'Алдыңғы айға өту',
        gotoNextMonth : 'Келесі айға өту',
        gotoNextYear  : 'Келесі жылға өту',
        navigation    : 'Күнді таңдау навигациясы'
    },

    Hint : {
        dontShowAgain : 'Қайта көрсетпеу'
    },

    NumberFormat : {
        locale   : 'kk-KZ',
        currency : 'KZT'
    },

    DurationField : {
        invalidUnit : 'Жарамсыз бірлік'
    },

    TimeField : {
        invalidTime : 'Жарамсыз уақытты енгізу'
    },

    TimePicker : {
        hour   : 'Сағат',
        minute : 'Минут',
        second : 'Секунд'
    },

    Tooltip : {
        loading : 'Жүктелуде...'
    },

    List : {
        loading   : 'Жүктелуде...',
        selectAll : 'Барлығын таңдау'
    },

    GridBase : {
        loadMask : 'Жүктелуде...',
        syncMask : 'Өзгерістер сақталуда, күте тұрыңыз...'
    },

    PagingToolbar : {
        firstPage         : 'Бірінші бетке өту',
        prevPage          : 'Алдыңғы бетке өту',
        page              : 'Бет',
        nextPage          : 'Келесі бетке өту',
        lastPage          : 'Соңғы бетке өту',
        reload            : 'Ағымдағы бетті қайта жүктеу',
        noRecords         : 'Көрсетілетін жазбалар жоқ',
        pageCountTemplate : data => `${data.lastPage} ішінен`,
        summaryTemplate   : data => `${data.start} жазбаларын көрсету - ${data.end} / ${data.allCount}`
    },

    Popup : {
        close    : 'Жабу',
        maximize : 'Үлкейту'
    },

    Splitter : {
        ariaLabel      : 'Бөлгіш, көрші панельдерді қайта өлшеу үшін көрсеткілерді пайдаланыңыз',
        collapseLeft   : 'Сол панельді жию',
        collapseRight  : 'Оң панельді жию',
        collapseTop    : 'Жоғарғы панельді жию',
        collapseBottom : 'Төменгі панельді жию',
        expandLeft     : 'Сол панельді жаю',
        expandRight    : 'Оң панельді жаю',
        expandTop      : 'Жоғарғы панельді жаю',
        expandBottom   : 'Төменгі панельді жаю'
    },

    TabPanel : {
        containsInvalidFields : 'Қойындыда жарамсыз өрістер бар'
    },

    Toolbar : {
        showOverflowingItems : 'Артық элементтерді көрсету',
        scrollForMore        : 'Көбірек үшін айналдырыңыз'
    },

    UndoRedo : {
        Undo           : 'Болдырмау',
        Redo           : 'Қайталау',
        UndoLastAction : 'Соңғы әрекетті болдырмау',
        RedoLastAction : 'Соңғы болдырмау әрекетін қайталау',
        NoActions      : 'Болдырмау кезек тізімінде элементтер жоқ'
    },

    FieldFilterPicker : {
        equals                 : 'тең',
        doesNotEqual           : 'тең емес',
        isEmpty                : 'бос',
        isNotEmpty             : 'бос емес',
        contains               : 'қамтиды',
        doesNotContain         : 'қамтымайды',
        startsWith             : 'басталады',
        endsWith               : 'былай аяқталады',
        isOneOf                : 'мынаның бірі',
        isNotOneOf             : 'мынаның бірі емес',
        isGreaterThan          : 'үлкенірек',
        isLessThan             : 'кем',
        isGreaterThanOrEqualTo : 'үлкен немесе тең',
        isLessThanOrEqualTo    : 'кем немесе тең',
        isBetween              : 'арасында',
        isNotBetween           : 'арасында емес',
        isBefore               : 'дейін',
        isAfter                : 'кейін',
        timeEquals             : 'уақыт тең',
        timeDoesNotEqual       : 'уақыт тең емес',
        isToday                : 'бүгін',
        isTomorrow             : 'ертең',
        isYesterday            : 'кеше',
        isThisWeek             : 'осы апта',
        isNextWeek             : 'келесі апта',
        isLastWeek             : 'өткен апта',
        isThisMonth            : 'осы ай',
        isNextMonth            : 'келесі ай',
        isLastMonth            : 'өткен ай',
        isThisYear             : 'осы жыл',
        isNextYear             : 'келесі жыл',
        isLastYear             : 'өткен жыл',
        isYearToDate           : 'жыл басынан осы күнге дейін',
        isTrue                 : 'шын',
        isFalse                : 'жалған',
        selectAProperty        : 'Сипатты таңдау',
        selectAnOperator       : 'Операторды таңдау',
        caseSensitive          : 'Регистрге тәуелді',
        and                    : 'және',
        dateFormat             : 'К/А/ЖЖ',
        selectValue            : 'Мәнді таңдаңыз',
        selectOneOrMoreValues  : 'Бір немесе бірнеше мәнді таңдаңыз',
        enterAValue            : 'Мән енгізіңіз',
        enterANumber           : 'Санды енгізіңіз',
        selectADate            : 'Күнді таңдау',
        selectATime            : 'Уақытты таңдаңыз'
    },

    FieldFilterPickerGroup : {
        addFilter : 'Сүзгі қосу',
        applyCond : applied => applied ? 'Сүзгіні өткізіп жіберу (қолданылған)' : 'Сүзгіні қолдану (қолданылмаған)'
    },

    DateHelper : {
        locale         : 'kk-KZ',
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
            { single : 'миллисекунд', plural : 'мс', abbrev : 'мс' },
            { single : 'emillisecond', plural : 'ems', abbrev : 'ems' },
            { single : 'секунд', plural : 'секунд', abbrev : 'с' },
            { single : 'esecond', plural : 'eseconds', abbrev : 'es' },
            { single : 'минут', plural : 'минут', abbrev : 'мин' },
            { single : 'eminute', plural : 'eminutes', abbrev : 'emin' },
            { single : 'сағат', plural : 'сағат', abbrev : 'сағ' },
            { single : 'ehour', plural : 'ehours', abbrev : 'eh' },
            { single : 'күн', plural : 'күн', abbrev : 'күн' },
            { single : 'eday', plural : 'edays', abbrev : 'ed' },
            { single : 'апта', plural : 'апта', abbrev : 'а' },
            { single : 'eweek', plural : 'eweeks', abbrev : 'ew' },
            { single : 'ай', plural : 'ай', abbrev : 'ай' },
            { single : 'emonth', plural : 'emonths', abbrev : 'emon' },
            { single : 'тоқсан', plural : 'тоқсан', abbrev : 'тоқсан' },
            { single : 'equarter', plural : 'equarters', abbrev : 'eq' },
            { single : 'жыл', plural : 'жыл', abbrev : 'жыл' },
            { single : 'eyear', plural : 'eyears', abbrev : 'eyr' },
            { single : 'онжылдық', plural : 'онжылдық', abbrev : 'онжылдық' },
            { single : 'edecade', plural : 'edecades', abbrev : 'edec' }
        ],
        unitAbbreviations : [
            ['мс'],
            [],
            ['с', 'сек'],
            [],
            ['м', 'мин'],
            [],
            ['сағ', 'сағ'],
            [],
            ['күн'],
            [],
            ['а', 'апта'],
            [],
            ['ай', 'ай', 'ай'],
            [],
            ['тоқсан', 'тоқсан', 'тоқсан'],
            [],
            ['ж', 'жыл'],
            [],
            ['онжылдық'],
            []
        ],
        parsers : {
            L   : 'АА/КК/ЖЖЖЖ',
            LT  : 'СС:мм ТД',
            LTS : 'СС:мм:сс ТД'
        },
        ordinalSuffix : number => {
            const hasSpecialCase = ['11', '12', '13'].find((n) => number.endsWith(n));

            let suffix = 'ші';

            if (!hasSpecialCase) {
                const lastDigit = number[number.length - 1];
                suffix = { 1 : 'ші', 2 : 'ші', 3 : 'ші', 4 : 'ші', 5 : 'ші', 7 : 'ші', 8 : 'ші', 50 : 'ші', 70 : 'ші', 80 : 'ші', 100 : 'ші' }[lastDigit] || 'шы';
            }

            return number + suffix;
        },
        decade : date => {
            const year = typeof date === 'number' ? date : date.getFullYear();
            return `${year - (year % 10)}-жылдар`;
        }
    }
};

export default LocaleHelper.publishLocale(locale);
