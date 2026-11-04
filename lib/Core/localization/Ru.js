import LocaleHelper from './LocaleHelper.js';

const locale = {

    localeName : 'Ru',
    localeDesc : 'Русский',
    localeCode : 'ru',
    localeRtl  : false,

    Object : {
        Yes      : 'Да',
        No       : 'Нет',
        Cancel   : 'Отмена',
        Ok       : 'OK',
        Week     : 'Неделя',
        None     : 'Нет',
        previous : 'Previous',
        next     : 'Next',
        to       : 'до',
        at       : 'в',
        on       : 'на',
        editing  : what => `Редактирование ${what}`,
        settings : 'Настройки',
        close    : 'Закрыть',
        go       : 'Идти',
        save     : 'Сохранить',
        cancel   : 'Отмена',
        revert   : 'восстановить',
        collapse : 'Свернуть',
        expand   : 'Развернуть',
        today    : 'Сегодня',
        andNMore : n => `и ещё ${n}`
    },

    AIBase : {
        delayStatusTexts : [
            'Ожидание',
            'Ожидание ...',
            'Все еще ожидаем',
            'Все еще ожидаем ...'
        ],
        autoStartDialogMessage        : 'Вы хотите включить голосовую активацию ИИ?',
        voiceActivationToast          : phrase => `Голосовая активация включена, используйте фразу "${phrase}", чтобы начать разговор`,
        voiceControlNotSupportedToast : 'Голосовое управление не поддерживается на этом устройстве',
        voiceControlErrorToast        : 'Голосовое управление не удалось запустить на вашем устройстве',
        voiceControlSilenceToast      : phrase => `Голосовой разговор ИИ завершен из-за тишины. Используйте фразу ${phrase}, чтобы начать разговор заново`,
        noAudioDetected               : 'Аудио не обнаружено, пожалуйста, попробуйте снова',
        transcriptionErrorToast       : 'Не удалось выполнить транскрипцию, попробуйте еще раз',
        playbackErrorToast            : 'Не удалось воспроизвести аудио, проверьте устройство вывода звука',
        failed                        : '(не удалось)',
        awaitingConfirmation          : 'Ожидание подтверждения',
        timeoutToast                  : 'Время ожидания сообщения истекло',
        readingStatusText             : modelName => `Чтение ${modelName}s`,
        updatingStatusText            : modelName => `Обновление ${modelName}s`,
        removingStatusText            : modelName => `Удаление ${modelName}s`,
        addingStatusText              : modelName => `Добавление ${modelName}`,
        filteringStatusText           : modelName => `Фильтрация ${modelName}s`,
        thinkingStatusText            : 'Размышляю',
        processingStatusText          : 'Обработка'
    },

    AISettingsPanel : {
        highlight               : 'Выделить',
        verbosity               : 'Подробность',
        voiceActivation         : 'Активация голосом',
        enableVoiceActivation   : 'Включить активацию голосом',
        voiceOnly               : 'Только голос',
        autostart               : 'Автозапуск',
        dataChangeConfirmations : 'Подтверждение изменения данных',
        add                     : 'Добавить',
        remove                  : 'Удалить',
        update                  : 'Обновить',
        planning                : 'Планирование',
        enablePlanning          : 'Включить планирование',
        aiModel                 : 'Модель ИИ',
        timeline                : 'Хронология',
        'in-view'               : 'В поле зрения',
        all                     : 'Все',
        timeRangeContext        : 'Контекст временного диапазона'
    },

    ChatButton : {
        tooltipPartSeparator  : ' - ',
        speakingTooltip       : 'ИИ говорит',
        recordingTooltip      : 'Запись',
        waitingTooltip        : 'ИИ думает',
        startRecordingTooltip : 'Нажмите, чтобы начать',
        stopRecordingTooltip  : 'Нажмите, чтобы остановить',
        inactiveTooltip       : 'Не записывает',
        openChatTooltip       : 'Щелкните правой кнопкой мыши, чтобы открыть чат'
    },

    ChatPanel : {
        messageFieldPlaceholder : 'Введите сообщение',
        noConnectionTooltip     : 'Соединение не обнаружено, нажмите, чтобы попробовать снова',
        undone                  : 'отменено',
        aborted                 : '(прервано)',
        readAloudTooltip        : 'Прочитать сообщение вслух',
        confidenceTooltip       : confidence => `Уверенность: ${confidence}%`,
        undoTooltip             : 'Отменить изменения данных',
        redoTooltip             : 'Повторить изменения данных',
        thumbsUp                : 'Палец вверх',
        thumbsDown              : 'Палец вниз',
        feedbackToast           : 'Спасибо за ваш отзыв!',
        clearChat               : 'Очистить чат',
        closeChat               : 'Закрыть чат',
        settings                : 'Настройки',
        closeSettings           : 'Закрыть настройки'
    },

    CheckboxGroup : {
        wrongNbrOfOptionsSelected : min => `Выберите ровно ${min}`,
        tooFewOptionsSelected     : min => `Выберите как минимум ${min}`,
        tooManyOptionsSelected    : max => `Выберите не более ${max}`
    },

    CodeEditor : {
        apply        : 'Применить',
        autoApply    : 'Применить автоматически',
        downloadCode : 'Скачать код'
    },

    ColorPicker : {
        noColor : 'Нет цвета'
    },

    Combo : {
        noResults          : 'Нет результатов',
        recordNotCommitted : 'Запись не может быть добавлена',
        addNewValue        : value => `добавить ${value}`
    },

    ConfirmationDialog : {
        highlight       : 'Выделить',
        preview         : 'Предпросмотр',
        approve         : 'Одобрить',
        reject          : 'Отклонить',
        confirmAdd      : 'Подтвердите добавление:',
        confirmUpdate   : 'Подтвердите обновление:',
        confirmRemove   : 'Подтвердите удаление:',
        confirmCopy     : 'Подтвердите копирование',
        confirmAssign   : 'Подтвердите назначение',
        confirmReassign : 'Подтвердите переназначение',
        confirmUnassign : 'Подтвердите снятие назначения',
        confirmLink     : 'Подтвердить ссылку',
        confirmUnlink   : 'Подтвердить отмену ссылки'
    },

    FilePicker : {
        file : 'Файл'
    },

    Field : {
        badInput              : 'Недопустимое значение поля',
        patternMismatch       : 'Значение должно соответствовать определенному шаблону',
        rangeOverflow         : value => `Значение должно быть меньше или равно ${value.max}`,
        rangeUnderflow        : value => `Значение должно быть больше или равно ${value.min}`,
        stepMismatch          : 'Значение должно соответствовать шагу',
        tooLong               : 'Значение должно быть короче',
        tooShort              : 'Значение должно быть длиннее',
        typeMismatch          : 'Значение должно быть в специальном формате',
        valueMissing          : 'Поле не может быть пустым',
        invalidValue          : 'Недопустимое значение поля',
        minimumValueViolation : 'Нарушение минимального значения',
        maximumValueViolation : 'Нарушение максимального значения',
        fieldRequired         : 'Поле не может быть пустым',
        validateFilter        : 'Выберите значение из списка'
    },

    DateField : {
        invalidDate : format => 'Недопустимый ввод даты, ожидаемый формат: ' + format
    },

    DatePicker : {
        gotoPrevYear  : 'Перейти к предыдущему году',
        gotoPrevMonth : 'Перейти к предыдущему месяцу',
        gotoNextMonth : 'Перейти в следующий месяц',
        gotoNextYear  : 'Перейти в следующий год',
        navigation    : 'Навигация выбора даты'
    },

    Hint : {
        dontShowAgain : 'Больше не показывать'
    },

    NumberFormat : {
        locale   : 'ru',
        currency : 'RUB'
    },

    DurationField : {
        invalidUnit : 'Неверные единицы'
    },

    TimeField : {
        invalidTime : 'Неверный формат времени'
    },

    TimePicker : {
        hour   : 'Час',
        minute : 'Минуты',
        second : 'секунда'
    },

    Tooltip : {
        loading : 'Загрузка...'
    },

    List : {
        loading   : 'Загрузка...',
        selectAll : 'Выбрать все'
    },

    GridBase : {
        loadMask : 'Загрузка...',
        syncMask : 'Сохраняю данные, пожалуйста подождите...'
    },

    PagingToolbar : {
        firstPage         : 'Перейти на первую страницу',
        prevPage          : 'Перейти на предыдущую страницу',
        page              : 'страница',
        nextPage          : 'Перейти на следующую страницу',
        lastPage          : 'Перейти на последнюю страницу',
        reload            : 'Перезагрузить текущую страницу',
        noRecords         : 'Нет записей для отображения',
        pageCountTemplate : data => `из ${data.lastPage}`,
        summaryTemplate   : data => `Показаны записи ${data.start} - ${data.end} из ${data.allCount}`
    },

    Popup : {
        close    : 'Закрыть',
        maximize : 'Максимизировать'
    },

    Splitter : {
        ariaLabel      : 'Разделитель, используйте клавиши со стрелками для изменения размера соседних панелей',
        collapseLeft   : 'Свернуть левую панель',
        collapseRight  : 'Свернуть правую панель',
        collapseTop    : 'Свернуть верхнюю панель',
        collapseBottom : 'Свернуть нижнюю панель',
        expandLeft     : 'Развернуть левую панель',
        expandRight    : 'Развернуть правую панель',
        expandTop      : 'Развернуть верхнюю панель',
        expandBottom   : 'Развернуть нижнюю панель'
    },

    TabPanel : {
        containsInvalidFields : 'Вкладка содержит недопустимые поля'
    },

    Toolbar : {
        showOverflowingItems : 'Показать переполненные элементы',
        scrollForMore        : 'Прокрутите, чтобы увидеть больше'
    },

    UndoRedo : {
        Undo           : 'Отменить',
        Redo           : 'Повторить',
        UndoLastAction : 'Отменить последнее действие',
        RedoLastAction : 'Повторить последнее отмененное действие',
        NoActions      : 'Нет записей в очереди отмены'
    },

    FieldFilterPicker : {
        equals                 : 'равен',
        doesNotEqual           : 'не равен',
        isEmpty                : 'пустой',
        isNotEmpty             : 'не пустой',
        contains               : 'содержит',
        doesNotContain         : 'не содержит',
        startsWith             : 'начинается c',
        endsWith               : 'заканчивается на',
        isOneOf                : 'входит в',
        isNotOneOf             : 'не входит в',
        isGreaterThan          : 'больше чем',
        isLessThan             : 'меньше чем',
        isGreaterThanOrEqualTo : 'больше или равен',
        isLessThanOrEqualTo    : 'меньше или равен',
        isBetween              : 'между',
        isNotBetween           : 'не между',
        isBefore               : 'до',
        isAfter                : 'после',
        timeEquals             : 'время равно',
        timeDoesNotEqual       : 'время не равно',
        isToday                : 'сегодня',
        isTomorrow             : 'завтра',
        isYesterday            : 'вчера',
        isThisWeek             : 'эта неделя',
        isNextWeek             : 'следующая неделя',
        isLastWeek             : 'последняя неделя',
        isThisMonth            : 'этот месяц',
        isNextMonth            : 'следующий месяц',
        isLastMonth            : 'последний месяц',
        isThisYear             : 'этот год',
        isNextYear             : 'следующий год',
        isLastYear             : 'последний год',
        isYearToDate           : 'год по дате',
        isTrue                 : 'правда',
        isFalse                : 'ложь',
        selectAProperty        : 'Выбор свойства',
        selectAnOperator       : 'Выбор оператора',
        caseSensitive          : 'С учетом регистра',
        and                    : 'и',
        dateFormat             : 'D/M/YYYY',
        selectValue            : 'Выберите значение',
        selectOneOrMoreValues  : 'Выберите одно или несколько значений',
        enterAValue            : 'Введите значение',
        enterANumber           : 'Введите число',
        selectADate            : 'Выберите дату',
        selectATime            : 'Выбрать время'
    },

    FieldFilterPickerGroup : {
        addFilter : 'Добавить фильтр',
        applyCond : applied => applied ? 'Пропустить фильтр (сейчас применяется)' : 'Применить фильтр (сейчас пропущен)'
    },

    DateHelper : {
        locale         : 'ru',
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
            { single : 'миллисек', plural : 'миллисек', abbrev : 'мс' },
            { single : 'emillisecond', plural : 'ems', abbrev : 'ems' },
            { single : 'секунда', plural : 'секунд', abbrev : 'с' },
            { single : 'esecond', plural : 'eseconds', abbrev : 'es' },
            { single : 'минута', plural : 'минут', abbrev : 'мин' },
            { single : 'аминута', plural : 'аминут', abbrev : 'амин' },
            { single : 'час', plural : 'часов', abbrev : 'ч' },
            { single : 'ачас', plural : 'ачасов', abbrev : 'ач' },
            { single : 'день', plural : 'дней', abbrev : 'д' },
            { single : 'адень', plural : 'адней', abbrev : 'ад' },
            { single : 'неделя', plural : 'недели', abbrev : 'нед' },
            { single : 'анеделя', plural : 'анедели', abbrev : 'анед' },
            { single : 'месяц', plural : 'месяцев', abbrev : 'мес' },
            { single : 'амесяц', plural : 'амесяцев', abbrev : 'амес' },
            { single : 'квартал', plural : 'кварталов', abbrev : 'квар' },
            { single : 'аквартал', plural : 'акварталов', abbrev : 'аквар' },
            { single : 'год', plural : 'лет', abbrev : 'г' },
            { single : 'агод', plural : 'алет', abbrev : 'аг' },
            { single : 'десятилетие', plural : 'десятилетия', abbrev : 'дес' },
            { single : 'адесятилетие', plural : 'адесятилетия', abbrev : 'адес' }
        ],
        unitAbbreviations : [
            ['мс', 'мил'],
            ['амс', 'амил'],
            ['с', 'сек'],
            ['ас', 'асек'],
            ['м', 'мин'],
            ['ам', 'амин'],
            ['ч'],
            ['ач'],
            ['д', 'ден', 'дне'],
            ['ад', 'аден', 'адне'],
            ['н', 'нед'],
            ['ан', 'анед'],
            ['мес'],
            ['амес'],
            ['к', 'квар', 'квр'],
            ['ак', 'аквар', 'аквр'],
            ['г'],
            ['аг'],
            ['дес'],
            ['адес']
        ],
        parsers : {
            L   : 'DD.MM.YYYY',
            LT  : 'HH:mm',
            LTS : 'HH:mm:ss'
        },
        ordinalSuffix : number => `${number}-й`,
        decade        : date => {
            const year = typeof date === 'number' ? date : date.getFullYear();
            return `${year - (year % 10)}-ые`;
        }
    }
};

export default LocaleHelper.publishLocale(locale);
