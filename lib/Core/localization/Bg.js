import LocaleHelper from './LocaleHelper.js';

const locale = {

    localeName : 'Bg',
    localeDesc : 'Български',
    localeCode : 'bg',
    localeRtl  : false,

    Object : {
        Yes      : 'Да',
        No       : 'Не',
        Cancel   : 'Отказ',
        Ok       : 'ОК',
        Week     : 'Седмица',
        None     : 'Няма',
        previous : 'Предишна',
        next     : 'Следваща',
        to       : 'до',
        at       : 'в',
        on       : 'на',
        editing  : what => `Редактиране на ${what}`,
        settings : 'Настройки',
        close    : 'Затвори',
        go       : 'Отиди',
        save     : 'Запази',
        cancel   : 'Отказ',
        revert   : 'Възстанови',
        collapse : 'Свиване',
        expand   : 'Разгръщане',
        today    : 'Днес',
        andNMore : n => `и още ${n}`
    },

    AIBase : {
        delayStatusTexts : [
            'Чакане',
            'Чакане ...',
            'Все още чакане',
            'Все още чакане ...'
        ],
        autoStartDialogMessage        : 'Искате ли да активирате AI гласово управление?',
        voiceActivationToast          : phrase => `Гласовото управление е активирано, използвайте фразата "${phrase}" за започване на разговор`,
        voiceControlNotSupportedToast : 'Гласовото управление не се поддържа на това устройство',
        voiceControlErrorToast        : 'Гласовото управление не може да бъде стартирано на вашето устройство',
        voiceControlSilenceToast      : phrase => `Гласовият разговор с AI приключи поради мълчание. Използвайте фразата ${phrase}, за да рестартирате разговора`,
        noAudioDetected               : 'Не е открит звук, моля опитайте отново',
        transcriptionErrorToast       : 'Транскрипцията не успя, моля, опитайте отново',
        playbackErrorToast            : 'Възпроизвеждането на аудио не успя, моля, проверете вашето аудио устройство',
        failed                        : '(неуспешно)',
        awaitingConfirmation          : 'Очаква потвърждение',
        timeoutToast                  : 'Съобщението изтече',
        readingStatusText             : modelName => `Четене на ${modelName}s`,
        updatingStatusText            : modelName => `Актуализиране на ${modelName}s`,
        removingStatusText            : modelName => `Премахване на ${modelName}s`,
        addingStatusText              : modelName => `Добавяне на ${modelName}`,
        filteringStatusText           : modelName => `Филтриране на ${modelName}s`,
        thinkingStatusText            : 'Мисля',
        processingStatusText          : 'Обработване'
    },

    AISettingsPanel : {
        highlight               : 'Подчертаване',
        verbosity               : 'Подробност',
        voiceActivation         : 'Гласова активация',
        enableVoiceActivation   : 'Активиране на гласова активация',
        voiceOnly               : 'Само глас',
        autostart               : 'Автоматично стартиране',
        dataChangeConfirmations : 'Потвърждение за промяна на данни',
        add                     : 'Добавяне',
        remove                  : 'Премахване',
        update                  : 'Актуализиране',
        planning                : 'Планиране',
        enablePlanning          : 'Разрешаване на планиране',
        aiModel                 : 'AI Модел',
        timeline                : 'Хронология',
        'in-view'               : 'В изглед',
        all                     : 'Всички',
        timeRangeContext        : 'Контекст на времевия диапазон'
    },

    ChatButton : {
        tooltipPartSeparator  : ' - ',
        speakingTooltip       : 'AI говори',
        recordingTooltip      : 'Записване',
        waitingTooltip        : 'AI мисли',
        startRecordingTooltip : 'Кликнете за начало',
        stopRecordingTooltip  : 'Кликнете за край',
        inactiveTooltip       : 'Не записва',
        openChatTooltip       : 'Кликнете с десен бутон за отваряне на чата'
    },

    ChatPanel : {
        messageFieldPlaceholder : 'Напишете съобщение',
        noConnectionTooltip     : 'Не е открита връзка, кликнете, за да опитате отново',
        undone                  : 'отменено',
        aborted                 : '(прекратено)',
        readAloudTooltip        : 'Прочетете съобщението на глас',
        confidenceTooltip       : confidence => `Увереност: ${confidence}%`,
        undoTooltip             : 'Отмяна на промените в данните',
        redoTooltip             : 'Възстановяване на промените в данните',
        thumbsUp                : 'Харесвам',
        thumbsDown              : 'Не харесвам',
        feedbackToast           : 'Благодарим ви за обратната връзка!',
        clearChat               : 'Изчистване на чата',
        closeChat               : 'Затвори чата',
        settings                : 'Настройки',
        closeSettings           : 'Затваряне на настройките'
    },

    CheckboxGroup : {
        wrongNbrOfOptionsSelected : min => `Изберете точно ${min}`,
        tooFewOptionsSelected     : min => `Изберете поне ${min}`,
        tooManyOptionsSelected    : max => `Изберете не повече от ${max}`
    },

    CodeEditor : {
        apply        : 'Приложи',
        autoApply    : 'Автоматично прилагане',
        downloadCode : 'Изтегли код'
    },

    ColorPicker : {
        noColor : 'Няма цвят'
    },

    Combo : {
        noResults          : 'Няма резултати',
        recordNotCommitted : 'Записът не може да бъде добавен',
        addNewValue        : value => `Добавете ${value}`
    },

    ConfirmationDialog : {
        highlight       : 'Подчертайте',
        preview         : 'Преглед',
        approve         : 'Одобрете',
        reject          : 'Отхвърлете',
        confirmAdd      : 'Потвърдете добавянето:',
        confirmUpdate   : 'Потвърдете актуализацията:',
        confirmRemove   : 'Потвърдете премахването:',
        confirmCopy     : 'Потвърдете копирането',
        confirmAssign   : 'Потвърдете назначаването',
        confirmReassign : 'Потвърдете преназначаването',
        confirmUnassign : 'Потвърдете отмяната на назначението',
        confirmLink     : 'Потвърдете връзката',
        confirmUnlink   : 'Потвърдете премахването на връзката'
    },

    FilePicker : {
        file : 'Файл'
    },

    Field : {
        badInput              : 'Невалидна стойност на полето',
        patternMismatch       : 'Стойността трябва да съответства на определен шаблон',
        rangeOverflow         : value => `Стойността трябва да е по-малка или равна на ${value.max}`,
        rangeUnderflow        : value => `Стойността трябва да е по-голяма или равна на ${value.min}`,
        stepMismatch          : 'Стойността трябва да съответства на стъпката',
        tooLong               : 'Стойността трябва да е по-къса',
        tooShort              : 'Стойността трябва да е по-дълга',
        typeMismatch          : 'Стойността трябва да бъде в специален формат',
        valueMissing          : 'Това поле е задължително',
        invalidValue          : 'Невалидна стойност на полето',
        minimumValueViolation : 'Нарушение на минималната стойност',
        maximumValueViolation : 'Нарушение на максималната стойност',
        fieldRequired         : 'Това поле е задължително',
        validateFilter        : 'Стойността трябва да бъде избрана от списъка'
    },

    DateField : {
        invalidDate : format => 'Невалиден формат на дата, очакваният формат е ' + format
    },

    DatePicker : {
        gotoPrevYear  : 'Преминаване към предишната година',
        gotoPrevMonth : 'Преминаване към предишния месец',
        gotoNextMonth : 'Преминаване към следващия месец',
        gotoNextYear  : 'Преминаване към следващата година',
        navigation    : 'Навигация за избор на дата'
    },

    Hint : {
        dontShowAgain : 'Не показвай отново'
    },

    NumberFormat : {
        locale   : 'bg',
        currency : 'BGN'
    },

    DurationField : {
        invalidUnit : 'Невалидна единица'
    },

    TimeField : {
        invalidTime : 'Невалидно въведено време'
    },

    TimePicker : {
        hour   : 'Час',
        minute : 'Минута',
        second : 'Секунда'
    },

    Tooltip : {
        loading : 'Зареждане...'
    },

    List : {
        loading   : 'Зареждане...',
        selectAll : 'Избери всички'
    },

    GridBase : {
        loadMask : 'Зареждане...',
        syncMask : 'Запазване на промените, моля, изчакайте...'
    },

    PagingToolbar : {
        firstPage         : 'Преминаване на първа страница',
        prevPage          : 'Преминаване на предишната страница',
        page              : 'Стр.',
        nextPage          : 'Преминаване на следващата страница',
        lastPage          : 'Преминаване на последната страница',
        reload            : 'Презареждане на текущата страница',
        noRecords         : 'Няма записи за показване',
        pageCountTemplate : data => `от ${data.lastPage}`,
        summaryTemplate   : data => `Показване на записи ${data.start} - ${data.end} от ${data.allCount}`
    },

    Popup : {
        close    : 'Затваряне на изскачащ прозорец',
        maximize : 'Максимизиране'
    },

    Splitter : {
        ariaLabel      : 'Разделител, използвайте клавишите със стрелки, за да промените размера на съседните панели',
        collapseLeft   : 'Свиване на левия панел',
        collapseRight  : 'Свиване на десния панел',
        collapseTop    : 'Свиване на горния панел',
        collapseBottom : 'Свиване на долния панел',
        expandLeft     : 'Разгъване на левия панел',
        expandRight    : 'Разгъване на десния панел',
        expandTop      : 'Разгъване на горния панел',
        expandBottom   : 'Разгъване на долния панел'
    },

    TabPanel : {
        containsInvalidFields : 'Разделът съдържа невалидни полета'
    },

    Toolbar : {
        showOverflowingItems : 'Показване на препълнените елементи',
        scrollForMore        : 'Превъртете за повече'
    },

    UndoRedo : {
        Undo           : 'Отмяна',
        Redo           : 'Повтаряне',
        UndoLastAction : 'Отмяна на последното действие',
        RedoLastAction : 'Повторно извършване на последното отменено действие',
        NoActions      : 'Няма елементи в опашката за отмяна'
    },

    FieldFilterPicker : {
        equals                 : 'е равно на',
        doesNotEqual           : 'не е равно на',
        isEmpty                : 'е празно',
        isNotEmpty             : 'не е празно',
        contains               : 'съдържа',
        doesNotContain         : 'не съдържа',
        startsWith             : 'започва с',
        endsWith               : 'свършва с',
        isOneOf                : 'е част от',
        isNotOneOf             : 'не е част от',
        isGreaterThan          : 'е по-голямо от',
        isLessThan             : 'е по-малко от',
        isGreaterThanOrEqualTo : 'е по-голямо от или равно на',
        isLessThanOrEqualTo    : 'е по-малко от или равно на',
        isBetween              : 'е между',
        isNotBetween           : 'не е между',
        isBefore               : 'е преди',
        isAfter                : 'е след',
        timeEquals             : 'времето е равно на',
        timeDoesNotEqual       : 'времето не е равно на',
        isToday                : 'е днес',
        isTomorrow             : 'е утре',
        isYesterday            : 'е вчера',
        isThisWeek             : 'е тази седмица',
        isNextWeek             : 'е следващата седмица',
        isLastWeek             : 'е миналата седмица',
        isThisMonth            : 'е този месец',
        isNextMonth            : 'е следващият месец',
        isLastMonth            : 'е миналият месец',
        isThisYear             : 'е тази година',
        isNextYear             : 'е следващата година',
        isLastYear             : 'е миналата година',
        isYearToDate           : 'е от началото на годината до днес',
        isTrue                 : 'е вярно',
        isFalse                : 'е грешно',
        selectAProperty        : 'Избор на свойство',
        selectAnOperator       : 'Избор на оператор',
        caseSensitive          : 'Чувствителност към малки и големи букви',
        and                    : 'и',
        dateFormat             : 'D/M/YY',
        selectValue            : 'Изберете стойност',
        selectOneOrMoreValues  : 'Избор на една или повече стойности',
        enterAValue            : 'Въвеждане на стойност',
        enterANumber           : 'Въвеждане на число',
        selectADate            : 'Избор на дата',
        selectATime            : 'Изберете час'
    },

    FieldFilterPickerGroup : {
        addFilter : 'Добавяне на филтър',
        applyCond : applied => applied ? 'Пропускане на филтъра (в момента приложен)' : 'Прилагане на филтъра (в момента пропуснат)'
    },

    DateHelper : {
        locale         : 'bg',
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
            { single : 'милисекунда', plural : 'милисекунди', abbrev : 'мсек' },
            { single : 'emillisecond', plural : 'ems', abbrev : 'ems' },
            { single : 'секунда', plural : 'секунди', abbrev : 'сек' },
            { single : 'esecond', plural : 'eseconds', abbrev : 'es' },
            { single : 'минута', plural : 'минути', abbrev : 'мин' },
            { single : 'eminute', plural : 'eminutes', abbrev : 'emin' },
            { single : 'час', plural : 'часа', abbrev : 'ч' },
            { single : 'ehour', plural : 'ehours', abbrev : 'eh' },
            { single : 'ден', plural : 'дни', abbrev : 'д' },
            { single : 'eday', plural : 'edays', abbrev : 'ed' },
            { single : 'седмица', plural : 'седмици', abbrev : 'сед' },
            { single : 'eweek', plural : 'eweeks', abbrev : 'ew' },
            { single : 'месец', plural : 'месеци', abbrev : 'мес' },
            { single : 'emonth', plural : 'emonths', abbrev : 'emon' },
            { single : 'тримесечие', plural : 'тримесечия', abbrev : 'трим' },
            { single : 'equarter', plural : 'equarters', abbrev : 'eq' },
            { single : 'година', plural : 'години', abbrev : 'год' },
            { single : 'eyear', plural : 'eyears', abbrev : 'eyr' },
            { single : 'десетилетие', plural : 'десетилетия', abbrev : 'десетил' },
            { single : 'edecade', plural : 'edecades', abbrev : 'edec' }
        ],
        unitAbbreviations : [
            ['милисек'],
            [],
            ['с', 'сек'],
            [],
            ['м', 'мин'],
            [],
            ['ч', 'часа'],
            [],
            ['д'],
            [],
            ['с', 'сед'],
            [],
            ['ме', 'мес', 'мсц'],
            [],
            ['тр', 'трим', 'тримес'],
            [],
            ['г', 'год'],
            [],
            ['дес'],
            []
        ],
        parsers : {
            L   : 'DD.MM.YYYY',
            LT  : 'HH:mm',
            LTS : 'HH:mm:ss A'
        },
        ordinalSuffix : number => {

            const lastDigit = number[number.length - 1];
            const suffix = { 1 : '-во', 2 : '-ро', 3 : '-то' }[lastDigit] || '-ти';

            return number + suffix;
        },
        decade : date => {
            const year = typeof date === 'number' ? date : date.getFullYear();
            return `${year - (year % 10)}те`;
        }
    }
};

export default LocaleHelper.publishLocale(locale);
