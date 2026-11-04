import LocaleHelper from './LocaleHelper.js';

const locale = {

    localeName : 'Uk',
    localeDesc : 'Українська',
    localeCode : 'uk-UA',
    localeRtl  : false,

    Object : {
        Yes      : 'Так',
        No       : 'Ні',
        Cancel   : 'Скасувати',
        Ok       : 'OK',
        Week     : 'Тиждень',
        None     : 'Жодного',
        previous : 'Попередній',
        next     : 'Наступний',
        to       : 'до',
        at       : 'о',
        on       : 'на',
        editing  : what => `Редагування ${what}`,
        settings : 'Налаштування',
        close    : 'Закрити',
        go       : 'Йти',
        save     : 'Зберегти',
        cancel   : 'Скасувати',
        revert   : 'Повернути',
        collapse : 'Згорнути',
        expand   : 'Розгорнути',
        today    : 'Сьогодні',
        andNMore : n => `і ще ${n}`
    },

    AIBase : {
        delayStatusTexts : [
            'Очікування',
            'Очікування ...',
            'Все ще очікування',
            'Все ще очікування ...'
        ],
        autoStartDialogMessage        : 'Ви хочете увімкнути активацію голосу AI?',
        voiceActivationToast          : phrase => `Голосова активація увімкнена, використовуйте фразу "${phrase}" для початку розмови`,
        voiceControlNotSupportedToast : 'Голосове управління не підтримується на цьому пристрої',
        voiceControlErrorToast        : 'Голосове управління не вдалося запустити на вашому пристрої',
        voiceControlSilenceToast      : phrase => `Голосова розмова ШІ завершена через тишу. Використовуйте фразу ${phrase} для перезапуску розмови`,
        noAudioDetected               : 'Аудіо не виявлено, спробуйте ще раз',
        transcriptionErrorToast       : 'Транскрипція не вдалася, спробуйте ще раз',
        playbackErrorToast            : 'Відтворення аудіо не вдалося, перевірте ваш аудіо вихідний пристрій',
        failed                        : '(не вдалося)',
        awaitingConfirmation          : 'Очікування підтвердження',
        timeoutToast                  : 'Повідомлення завершилося за часом',
        readingStatusText             : modelName => `Читання ${modelName}s`,
        updatingStatusText            : modelName => `Оновлення ${modelName}s`,
        removingStatusText            : modelName => `Видалення ${modelName}s`,
        addingStatusText              : modelName => `Додавання ${modelName}`,
        filteringStatusText           : modelName => `Фільтрування ${modelName}s`,
        thinkingStatusText            : 'Обмірковування',
        processingStatusText          : 'Обробка'
    },

    AISettingsPanel : {
        highlight               : 'Виділити',
        verbosity               : 'Багатослівність',
        voiceActivation         : 'Активація голосу',
        enableVoiceActivation   : 'Увімкнути активацію голосу',
        voiceOnly               : 'Тільки голос',
        autostart               : 'Автозапуск',
        dataChangeConfirmations : 'Підтвердження змін даних',
        add                     : 'Додати',
        remove                  : 'Видалити',
        update                  : 'Оновити',
        planning                : 'Планування',
        enablePlanning          : 'Увімкнути планування',
        aiModel                 : 'Модель AI',
        timeline                : 'Хронологія',
        'in-view'               : 'У полі зору',
        all                     : 'Усі',
        timeRangeContext        : 'Контекст діапазону часу'
    },

    ChatButton : {
        tooltipPartSeparator  : ' - ',
        speakingTooltip       : 'ШІ говорить',
        recordingTooltip      : 'Запис',
        waitingTooltip        : 'ШІ думає',
        startRecordingTooltip : 'Натисніть, щоб почати',
        stopRecordingTooltip  : 'Натисніть, щоб зупинити',
        inactiveTooltip       : 'Не записується',
        openChatTooltip       : 'Клацніть правою кнопкою миші, щоб відкрити чат'
    },

    ChatPanel : {
        messageFieldPlaceholder : 'Введіть повідомлення',
        noConnectionTooltip     : "З'єднання не виявлено, натисніть, щоб спробувати ще раз",
        undone                  : 'скасовано',
        aborted                 : '(перервано)',
        readAloudTooltip        : 'Прочитати повідомлення вголос',
        confidenceTooltip       : confidence => `Довіра: ${confidence}%`,
        undoTooltip             : 'Скасувати зміни даних',
        redoTooltip             : 'Повторити зміни даних',
        thumbsUp                : 'Палець вгору',
        thumbsDown              : 'Палець вниз',
        feedbackToast           : 'Дякуємо за ваш відгук!',
        clearChat               : 'Очистити чат',
        closeChat               : 'Закрити чат',
        settings                : 'Налаштування',
        closeSettings           : 'Закрити налаштування'
    },

    CheckboxGroup : {
        wrongNbrOfOptionsSelected : min => `Виберіть рівно ${min}`,
        tooFewOptionsSelected     : min => `Виберіть щонайменше ${min}`,
        tooManyOptionsSelected    : max => `Виберіть не більше ніж ${max}`
    },

    CodeEditor : {
        apply        : 'Застосувати',
        autoApply    : 'Автоматично застосувати',
        downloadCode : 'Завантажити код'
    },

    ColorPicker : {
        noColor : 'Без кольору'
    },

    Combo : {
        noResults          : 'Немає результатів',
        recordNotCommitted : 'Не вдалося додати запис',
        addNewValue        : value => `Додати ${value}`
    },

    ConfirmationDialog : {
        highlight       : 'Виділити',
        preview         : 'Попередній перегляд',
        approve         : 'Підтвердити',
        reject          : 'Відхилити',
        confirmAdd      : 'Підтвердити додавання:',
        confirmUpdate   : 'Підтвердити оновлення:',
        confirmRemove   : 'Підтвердити видалення:',
        confirmCopy     : 'Підтвердити копіювання',
        confirmAssign   : 'Підтвердити призначення',
        confirmReassign : 'Підтвердити повторне призначення',
        confirmUnassign : 'Підтвердити скасування призначення',
        confirmLink     : 'Підтвердити посилання',
        confirmUnlink   : "Підтвердити від'єднання"
    },

    FilePicker : {
        file : 'Файл'
    },

    Field : {
        badInput              : 'Неприпустиме значення поля',
        patternMismatch       : 'Значення має відповідати певному шаблону',
        rangeOverflow         : value => `Значення повинно бути менше або дорівнювати ${value.max}`,
        rangeUnderflow        : value => `Значення повинно бути більше або дорівнювати ${value.min}`,
        stepMismatch          : 'Значення має відповідати кроку',
        tooLong               : 'Значення має бути коротшим',
        tooShort              : 'Значення має бути довшим',
        typeMismatch          : 'Значення потрібно вказати в спеціальному форматі',
        valueMissing          : 'Це обов’язкове поле',
        invalidValue          : 'Неприпустиме значення поля',
        minimumValueViolation : 'Не вказано мінімальну кількість значень',
        maximumValueViolation : 'Перевищено максимально допустиму кількість значень',
        fieldRequired         : 'Це обов’язкове поле',
        validateFilter        : 'Значення має бути вибрано зі списку'
    },

    DateField : {
        invalidDate : format => 'Неправильний формат дати, очікуваний формат: ' + format
    },

    DatePicker : {
        gotoPrevYear  : 'Перейти до попереднього року',
        gotoPrevMonth : 'Перейти до попереднього місяця',
        gotoNextMonth : 'Перейти до наступного місяця',
        gotoNextYear  : 'Перейти до наступного року',
        navigation    : 'Навігація вибору дати'
    },

    Hint : {
        dontShowAgain : 'Більше не показувати'
    },

    NumberFormat : {
        locale   : 'uk-UA',
        currency : 'UAH'
    },

    DurationField : {
        invalidUnit : 'Неприпустима одиниця'
    },

    TimeField : {
        invalidTime : 'Введено неприпустимий час'
    },

    TimePicker : {
        hour   : 'Година',
        minute : 'Хвилина',
        second : 'Секунда'
    },

    Tooltip : {
        loading : 'Завантаження...'
    },

    List : {
        loading   : 'Завантаження...',
        selectAll : 'Вибрати все'
    },

    GridBase : {
        loadMask : 'Завантаження...',
        syncMask : 'Триває збереження, зачекайте...'
    },

    PagingToolbar : {
        firstPage         : 'Перейти до першої сторінки',
        prevPage          : 'Перейти до попередньої сторінки',
        page              : 'Сторінка',
        nextPage          : 'Перейти до наступної сторінки',
        lastPage          : 'Перейти до останньої сторінки',
        reload            : 'Перезавантажити поточну сторінку',
        noRecords         : 'Немає записів для відображення',
        pageCountTemplate : data => `з ${data.lastPage}`,
        summaryTemplate   : data => `Відображаються записи ${data.start} - ${data.end} з ${data.allCount}`
    },

    Popup : {
        close    : 'Закрити',
        maximize : 'Максимізувати'
    },

    Splitter : {
        ariaLabel      : 'Розділювач, використовуйте клавіші зі стрілками для зміни розміру сусідніх панелей',
        collapseLeft   : 'Згорнути ліву панель',
        collapseRight  : 'Згорнути праву панель',
        collapseTop    : 'Згорнути верхню панель',
        collapseBottom : 'Згорнути нижню панель',
        expandLeft     : 'Розгорнути ліву панель',
        expandRight    : 'Розгорнути праву панель',
        expandTop      : 'Розгорнути верхню панель',
        expandBottom   : 'Розгорнути нижню панель'
    },

    TabPanel : {
        containsInvalidFields : 'Вкладка містить недійсні поля'
    },

    Toolbar : {
        showOverflowingItems : 'Показати переповнені елементи',
        scrollForMore        : 'Прокрутіть, щоб побачити більше'
    },

    UndoRedo : {
        Undo           : 'Скасувати',
        Redo           : 'Повторити',
        UndoLastAction : 'Скасувати останню дію',
        RedoLastAction : 'Повторити останню невиконану дію',
        NoActions      : 'У черзі скасування немає елементів'
    },

    FieldFilterPicker : {
        equals                 : 'дорівнює',
        doesNotEqual           : 'не дорівнює',
        isEmpty                : 'пусто',
        isNotEmpty             : 'не пустий',
        contains               : 'містить',
        doesNotContain         : 'не містить',
        startsWith             : 'починається з',
        endsWith               : 'закінчується на',
        isOneOf                : 'один із',
        isNotOneOf             : 'не один із',
        isGreaterThan          : 'більше',
        isLessThan             : 'менше',
        isGreaterThanOrEqualTo : 'більше або дорівнює',
        isLessThanOrEqualTo    : 'менше або дорівнює',
        isBetween              : 'між',
        isNotBetween           : 'не між',
        isBefore               : 'до',
        isAfter                : 'після',
        timeEquals             : 'час дорівнює',
        timeDoesNotEqual       : 'час не дорівнює',
        isToday                : 'сьогодні',
        isTomorrow             : 'завтра',
        isYesterday            : 'учора',
        isThisWeek             : 'цей тиждень',
        isNextWeek             : 'наступний тиждень',
        isLastWeek             : 'минулий тиждень',
        isThisMonth            : 'цей місяць',
        isNextMonth            : 'наступний місяць',
        isLastMonth            : 'минулий місяць',
        isThisYear             : 'цей рік',
        isNextYear             : 'наступний рік',
        isLastYear             : 'минулий рік',
        isYearToDate           : 'з початку року',
        isTrue                 : 'істина',
        isFalse                : 'хиба',
        selectAProperty        : 'Виберіть властивість',
        selectAnOperator       : 'Виберіть оператор',
        caseSensitive          : 'З урахуванням регістру',
        and                    : 'та',
        dateFormat             : 'Д/М/РР',
        selectValue            : 'Виберіть значення',
        selectOneOrMoreValues  : 'Виберіть одне або кілька значень',
        enterAValue            : 'Введіть значення',
        enterANumber           : 'Введіть кількість',
        selectADate            : 'Вибрати дату',
        selectATime            : 'Виберіть час'
    },

    FieldFilterPickerGroup : {
        addFilter : 'Додати фільтр',
        applyCond : applied => applied ? 'Пропустити фільтр (застосовано)' : 'Застосувати фільтр (пропущено)'
    },

    DateHelper : {
        locale         : 'uk-UA',
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
            { single : 'мілісекунда', plural : 'мілісекунди', abbrev : 'мс' },
            { single : 'emillisecond', plural : 'ems', abbrev : 'ems' },
            { single : 'секунда', plural : 'секунди', abbrev : 'с' },
            { single : 'esecond', plural : 'eseconds', abbrev : 'es' },
            { single : 'хвилина', plural : 'хвилини', abbrev : 'хв' },
            { single : 'eminute', plural : 'eminutes', abbrev : 'emin' },
            { single : 'година', plural : 'години', abbrev : 'год' },
            { single : 'ehour', plural : 'ehours', abbrev : 'eh' },
            { single : 'день', plural : 'дні', abbrev : 'дн.' },
            { single : 'eday', plural : 'edays', abbrev : 'ed' },
            { single : 'тиждень', plural : 'тижні', abbrev : 'тиж.' },
            { single : 'eweek', plural : 'eweeks', abbrev : 'ew' },
            { single : 'місяць', plural : 'місяці', abbrev : 'міс.' },
            { single : 'emonth', plural : 'emonths', abbrev : 'emon' },
            { single : 'квартал', plural : 'квартали', abbrev : 'кв.' },
            { single : 'equarter', plural : 'equarters', abbrev : 'eq' },
            { single : 'рік', plural : 'роки', abbrev : 'р.' },
            { single : 'eyear', plural : 'eyears', abbrev : 'eyr' },
            { single : 'десятиліття', plural : 'десятиліття', abbrev : 'дес.' },
            { single : 'edecade', plural : 'edecades', abbrev : 'edec' }
        ],
        unitAbbreviations : [
            ['мс'],
            [],
            ['с', 'с'],
            [],
            ['хв', 'хв'],
            [],
            ['год', 'год'],
            [],
            ['дн.'],
            [],
            ['тиж.', 'тиж.'],
            [],
            ['міс.', 'міс.', 'міс.'],
            [],
            ['кв.', 'кварт.', 'квр'],
            [],
            ['р.', 'р.'],
            [],
            ['дес.'],
            []
        ],
        parsers : {
            L   : 'ММ/ДД/РРРР',
            LT  : 'ГГ:хв A',
            LTS : 'ГГ:хв:сс A'
        },
        ordinalSuffix : number => {
            const hasSpecialCase = ['11', '12', '13'].find((n) => number.endsWith(n));

            let suffix = '-ий';

            if (!hasSpecialCase) {
                const lastDigit = number[number.length - 1];
                suffix = { 1 : '-ий', 2 : '-й', 3 : '-ій' }[lastDigit] || '-ий';
            }

            return number + suffix;
        },
        decade : date => {
            const year = typeof date === 'number' ? date : date.getFullYear();
            return `${year - (year % 10)}-ті`;
        }
    }
};

export default LocaleHelper.publishLocale(locale);
