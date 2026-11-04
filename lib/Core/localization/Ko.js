import LocaleHelper from './LocaleHelper.js';

const locale = {

    localeName : 'Ko',
    localeDesc : '한국어',
    localeCode : 'ko',
    localeRtl  : false,

    Object : {
        Yes      : '예',
        No       : '아니요',
        Cancel   : '취소',
        Ok       : '확인',
        Week     : '주',
        None     : '없음',
        previous : '이전',
        next     : '다음',
        to       : '까지',
        at       : '에',
        on       : '에',
        editing  : what => `${what} 편집 중`,
        settings : '설정',
        close    : '닫기',
        go       : '가다',
        save     : '저장',
        cancel   : '취소',
        revert   : '변경 사항 되돌리기',
        collapse : '접기',
        expand   : '펼치기',
        today    : '오늘',
        andNMore : n => `및 ${n}개 더`
    },

    AIBase : {
        delayStatusTexts : [
            '대기 중',
            '대기 중 ...',
            '여전히 대기 중',
            '여전히 대기 중 ...'
        ],
        autoStartDialogMessage        : 'AI 음성 활성화를 사용하시겠습니까?',
        voiceActivationToast          : phrase => `음성 활성화가 설정되었습니다. 대화 시작을 위해 "${phrase}"를 사용하세요`,
        voiceControlNotSupportedToast : '이 장치에서는 음성 제어가 지원되지 않습니다',
        voiceControlErrorToast        : '이 장치에서 음성 제어를 시작할 수 없습니다',
        voiceControlSilenceToast      : phrase => `AI 음성 대화가 침묵으로 인해 종료되었습니다. 대화를 다시 시작하려면 ${phrase}를 사용하세요`,
        noAudioDetected               : '오디오가 감지되지 않았습니다. 다시 시도해주세요',
        transcriptionErrorToast       : '전사에 실패했습니다. 다시 시도하세요',
        playbackErrorToast            : '오디오 재생에 실패했습니다. 오디오 출력 장치를 확인하세요',
        failed                        : '(실패함)',
        awaitingConfirmation          : '확인 대기 중',
        timeoutToast                  : '메시지 시간이 초과되었습니다',
        readingStatusText             : modelName => `${modelName}s 읽는 중`,
        updatingStatusText            : modelName => `${modelName}s 업데이트 중`,
        removingStatusText            : modelName => `${modelName}s 제거 중`,
        addingStatusText              : modelName => `${modelName} 추가 중`,
        filteringStatusText           : modelName => `${modelName}s 필터링 중`,
        thinkingStatusText            : '생각 중',
        processingStatusText          : '처리 중'
    },

    AISettingsPanel : {
        highlight               : '강조',
        verbosity               : '말수',
        voiceActivation         : '음성 활성화',
        enableVoiceActivation   : '음성 활성화 사용',
        voiceOnly               : '음성만',
        autostart               : '자동 시작',
        dataChangeConfirmations : '데이터 변경 확인',
        add                     : '추가',
        remove                  : '제거',
        update                  : '업데이트',
        planning                : '계획',
        enablePlanning          : '계획 활성화',
        aiModel                 : 'AI 모델',
        timeline                : '타임라인',
        'in-view'               : '보기 중',
        all                     : '모두',
        timeRangeContext        : '시간 범위 컨텍스트'
    },

    ChatButton : {
        tooltipPartSeparator  : ' - ',
        speakingTooltip       : 'AI가 말하고 있습니다',
        recordingTooltip      : '녹음 중',
        waitingTooltip        : 'AI가 생각 중',
        startRecordingTooltip : '클릭하여 시작',
        stopRecordingTooltip  : '클릭하여 중지',
        inactiveTooltip       : '녹음 중이 아님',
        openChatTooltip       : '오른쪽 클릭하여 채팅 열기'
    },

    ChatPanel : {
        messageFieldPlaceholder : '메시지를 입력하세요',
        noConnectionTooltip     : '연결이 감지되지 않았습니다. 다시 시도하려면 클릭하세요',
        undone                  : '취소됨',
        aborted                 : '(중단됨)',
        readAloudTooltip        : '메시지를 소리 내어 읽기',
        confidenceTooltip       : confidence => `신뢰도: ${confidence}%`,
        undoTooltip             : '데이터 변경 취소',
        redoTooltip             : '데이터 변경 다시 실행',
        thumbsUp                : '좋아요',
        thumbsDown              : '싫어요',
        feedbackToast           : '피드백 감사합니다!',
        clearChat               : '채팅 지우기',
        closeChat               : '채팅 닫기',
        settings                : '설정',
        closeSettings           : '설정 닫기'
    },

    CheckboxGroup : {
        wrongNbrOfOptionsSelected : min => `정확히 ${min}개 선택하세요`,
        tooFewOptionsSelected     : min => `${min}개 이상 선택하세요`,
        tooManyOptionsSelected    : max => `${max}개 이하로 선택하세요`
    },

    CodeEditor : {
        apply        : '적용',
        autoApply    : '자동 적용',
        downloadCode : '코드 다운로드'
    },

    ColorPicker : {
        noColor : '색 없음'
    },

    Combo : {
        noResults          : '결과 없음',
        recordNotCommitted : '기록을 추가할 수 없습니다',
        addNewValue        : value => `${value} 추가`
    },

    ConfirmationDialog : {
        highlight       : '강조',
        preview         : '미리보기',
        approve         : '승인',
        reject          : '거부',
        confirmAdd      : '추가 확인:',
        confirmUpdate   : '업데이트 확인:',
        confirmRemove   : '삭제 확인:',
        confirmCopy     : '복사 확인',
        confirmAssign   : '할당 확인',
        confirmReassign : '재할당 확인',
        confirmUnassign : '할당 취소 확인',
        confirmLink     : '링크 확인',
        confirmUnlink   : '링크 해제 확인'
    },

    FilePicker : {
        file : '파일'
    },

    Field : {
        badInput              : '잘못된 필드 값',
        patternMismatch       : '값은 특정 패턴과 일치해야 합니다',
        rangeOverflow         : value => `값은  ${value.max} 보다 작거나 같아야 합니다`,
        rangeUnderflow        : value => `값은  ${value.min} 보다 크거나 같아야 합니다`,
        stepMismatch          : '값은 단계에 맞아야 합니다',
        tooLong               : '값은 더 짧아야 합니다',
        tooShort              : '값은 더 길어야 합니다',
        typeMismatch          : '값은 특수 형식이어야 합니다',
        valueMissing          : '이 필드는 필수입니다',
        invalidValue          : '잘못된 필드 값',
        minimumValueViolation : '최소값 위반',
        maximumValueViolation : '최대값 위반',
        fieldRequired         : '이 필드는 필수입니다',
        validateFilter        : '목록에서 값을 선택해야 합니다'
    },

    DateField : {
        invalidDate : format => '잘못된 날짜 입력입니다. 예상 형식은 ' + format
    },

    DatePicker : {
        gotoPrevYear  : '전년도로 이동',
        gotoPrevMonth : '지난달로 이동',
        gotoNextMonth : '다음 달로 이동',
        gotoNextYear  : '내년으로 이동',
        navigation    : '날짜 선택기 탐색'
    },

    Hint : {
        dontShowAgain : '다시 표시하지 않기'
    },

    NumberFormat : {
        locale   : 'ko',
        currency : 'KRW'
    },

    DurationField : {
        invalidUnit : '잘못된 단위'
    },

    TimeField : {
        invalidTime : '잘못된 시간 입력'
    },

    TimePicker : {
        hour   : '시간',
        minute : '분',
        second : '초'
    },

    Tooltip : {
        loading : '로딩 중...'
    },

    List : {
        loading   : '로딩 중...',
        selectAll : '모두 선택'
    },

    GridBase : {
        loadMask : '로딩 중...',
        syncMask : '변경 내용 저장 중, 잠시 기다려 주십시오...'
    },

    PagingToolbar : {
        firstPage         : '첫 페이지로 이동',
        prevPage          : '이전 페이지로 이동',
        page              : '페이지',
        nextPage          : '다음 페이지로 이동',
        lastPage          : '마지막 페이지로 이동',
        reload            : '현재 페이지 새로고침',
        noRecords         : '표시할 기록 없음',
        pageCountTemplate : data => ` ${data.lastPage}`,
        summaryTemplate   : data => ` ${data.allCount}개 중 ${data.start} - ${data.end}  기록 표시하기`
    },

    Popup : {
        close    : '팝업 닫기',
        maximize : '최대화'
    },

    Splitter : {
        ariaLabel      : '분할기, 화살표 키를 사용하여 인접 패널의 크기를 조정하세요',
        collapseLeft   : '왼쪽 패널 접기',
        collapseRight  : '오른쪽 패널 접기',
        collapseTop    : '위쪽 패널 접기',
        collapseBottom : '아래쪽 패널 접기',
        expandLeft     : '왼쪽 패널 펼치기',
        expandRight    : '오른쪽 패널 펼치기',
        expandTop      : '위쪽 패널 펼치기',
        expandBottom   : '아래쪽 패널 펼치기'
    },

    TabPanel : {
        containsInvalidFields : '탭에 잘못된 필드가 포함되어 있습니다'
    },

    Toolbar : {
        showOverflowingItems : '넘치는 항목 보기',
        scrollForMore        : '더 보려면 스크롤하세요'
    },

    UndoRedo : {
        Undo           : '실행 취소',
        Redo           : '다시 실행',
        UndoLastAction : '마지막 작업 실행 취소',
        RedoLastAction : '마지막 실행 취소 작업 다시 실행',
        NoActions      : '실행 취소 대기열에 항목 없음'
    },

    FieldFilterPicker : {
        equals                 : '동일',
        doesNotEqual           : '동일하지 않음',
        isEmpty                : '비었음',
        isNotEmpty             : '비지 않았음',
        contains               : '포함함',
        doesNotContain         : '포함하지 않음',
        startsWith             : '이하로 시작함',
        endsWith               : '이하로 종료함',
        isOneOf                : '이하 중 하나',
        isNotOneOf             : '이하 중 하나가 아님',
        isGreaterThan          : '다음보다 더 많음',
        isLessThan             : '다음보다 더 적음',
        isGreaterThanOrEqualTo : '다음보다 더 많거나 동일함',
        isLessThanOrEqualTo    : '다음보다 더 적거나 동일함',
        isBetween              : '다음 사이임',
        isNotBetween           : '다음 사이가 아님',
        isBefore               : '다음 전임',
        isAfter                : '다음 후임',
        timeEquals             : '시간이 같다',
        timeDoesNotEqual       : '시간이 같지 않다',
        isToday                : '오늘임',
        isTomorrow             : '내일임',
        isYesterday            : '어제임',
        isThisWeek             : '이번주임',
        isNextWeek             : '다음주임',
        isLastWeek             : '저번주임',
        isThisMonth            : '이번달임',
        isNextMonth            : '다음달임',
        isLastMonth            : '저번달임',
        isThisYear             : '올해임',
        isNextYear             : '내년임',
        isLastYear             : '작년임',
        isYearToDate           : '지금까지임',
        isTrue                 : '맞음',
        isFalse                : '맞지 않음',
        selectAProperty        : '속성 선택',
        selectAnOperator       : '작업자 선택',
        caseSensitive          : '대소문자 구분',
        and                    : '및',
        dateFormat             : 'D/M/YY',
        selectValue            : '값을 선택하세요',
        selectOneOrMoreValues  : '하나 이상의 값 선택',
        enterAValue            : '값을 입력',
        enterANumber           : '숫자를 입력',
        selectADate            : '날짜를 선택',
        selectATime            : '시간 선택'
    },

    FieldFilterPickerGroup : {
        addFilter : '필터 추가',
        applyCond : applied => applied ? '필터 건너뛰기 (현재 적용됨)' : '필터 적용 (현재 건너뜀)'
    },

    DateHelper : {
        locale         : 'ko',
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
            { single : '1, 000분의1초', plural : 'ms', abbrev : 'ms' },
            { single : 'emillisecond', plural : 'ems', abbrev : 'ems' },
            { single : '초', plural : '초', abbrev : 's' },
            { single : 'esecond', plural : 'eseconds', abbrev : 'es' },
            { single : '분', plural : '분', abbrev : 'min' },
            { single : 'eminute', plural : 'eminutes', abbrev : 'emin' },
            { single : '시간', plural : '시간', abbrev : 'h' },
            { single : 'ehour', plural : 'ehours', abbrev : 'eh' },
            { single : '일', plural : '일', abbrev : 'd' },
            { single : 'eday', plural : 'edays', abbrev : 'ed' },
            { single : '주', plural : '주', abbrev : 'w' },
            { single : 'eweek', plural : 'eweeks', abbrev : 'ew' },
            { single : '달', plural : '달', abbrev : 'mon' },
            { single : 'emonth', plural : 'emonths', abbrev : 'emon' },
            { single : '분기', plural : '분기', abbrev : 'q' },
            { single : 'equarter', plural : 'equarters', abbrev : 'eq' },
            { single : '년', plural : '년', abbrev : 'yr' },
            { single : 'eyear', plural : 'eyears', abbrev : 'eyr' },
            { single : '10년', plural : '10년', abbrev : 'dec' },
            { single : 'edecade', plural : 'edecades', abbrev : 'edec' }
        ],
        unitAbbreviations : [
            ['mil'],
            [],
            ['s', 'sec'],
            [],
            ['m', 'min'],
            [],
            ['h', 'hr'],
            [],
            ['d'],
            [],
            ['w', 'wk'],
            [],
            ['mo', 'mon', 'mnt'],
            [],
            ['q', 'quar', 'qrt'],
            [],
            ['y', 'yr'],
            [],
            ['dec'],
            []
        ],
        parsers : {
            L   : 'YYYY-MM-DD',
            LT  : 'HH:mm',
            LTS : 'HH:mm:ss A'
        },
        ordinalSuffix : number => number + '번째',
        decade        : date => {
            const year = typeof date === 'number' ? date : date.getFullYear();
            return `${year - (year % 10)}년대`;
        }
    }
};

export default LocaleHelper.publishLocale(locale);
