import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Engine/localization/Ko.js';
import '../../Grid/localization/Ko.js';

const locale = {

    localeName : 'Ko',
    localeDesc : '한국어',
    localeCode : 'ko',
    localeRtl  : false,

    Object : {
        newEvent    : '새 일정',
        information : '정보',
        showDetails : '세부 정보 표시'
    },

    ResourceInfoColumn : {
        eventCountText : data => data + '일정 '
    },

    ResourceCollapseColumn : {
        toggleResourceLayout : '리소스 레이아웃 열 전환. SPACE로 컨텍스트 메뉴.'
    },

    Dependencies : {
        from    : '부터',
        to      : '까지',
        valid   : '유효함',
        invalid : '유효하지 않음'
    },

    DependencyType : {
        SS           : 'SS',
        SF           : 'SF',
        FS           : 'FS',
        FF           : 'FF',
        StartToStart : '시작에서 시작까지',
        StartToEnd   : '시작에서 마감까지',
        EndToStart   : '마감에서 시작까지',
        EndToEnd     : '마감에서 마감까지',
        short        : [
            'SS',
            'SF',
            'FS',
            'FF'
        ],
        long : [
            '시작에서 시작까지',
            '시작에서 마감까지',
            '마감에서 시작까지',
            '마감에서 마감까지'
        ]
    },

    DependencyEdit : {
        From              : '부터',
        To                : '까지',
        Type              : '유형',
        Lag               : '지연',
        color             : '색상',
        lineStyle         : '선 스타일',
        solid             : '실선',
        dashed            : '점선',
        dotted            : '점',
        dashDot           : '점선-점',
        longDash          : '긴 점선',
        'Edit dependency' : '의존 관계 편집',
        Save              : '저장',
        Delete            : '삭제',
        Cancel            : '취소',
        StartToStart      : '시작에서 시작까지',
        StartToEnd        : '시작에서 종료까지',
        EndToStart        : '종료에서 시작까지',
        EndToEnd          : '종료에서 종료까지',
        Active            : '활성화'
    },

    EventEdit : {
        Name           : '이름',
        Resource       : '리소스',
        Start          : '시작',
        startTime      : '시작 시간',
        End            : '종료',
        endTime        : '종료 시간',
        Save           : '저장',
        Delete         : '삭제',
        Cancel         : '취소',
        'Edit event'   : '일정 편집',
        Repeat         : '반복',
        editRecurrence : '반복 편집'
    },

    EventDrag : {
        eventOverlapsExisting   : '일정이 이 리소스에 대한 기존 일정과 겹칩니다',
        noDropOutsideTimeline   : '일정을 타임라인 외부로 완전히 드롭할 수 없습니다',
        duplicateAssignmentDrag : '이벤트를 동일한 리소스에 여러 번 할당할 수 없습니다'
    },

    SchedulerBase : {
        'Add event'      : '일정 추가',
        'Delete event'   : '일정 삭제',
        'Unassign event' : '일정 배정 해제',
        color            : '색',
        eventAriaLabel   : (eventRecord, startDate) => `${eventRecord.name}, 시작 시간: ${startDate} ${eventRecord.duration > 0 ? `${eventRecord.fullDuration.toString(false)} 동안` : ''}`
    },

    TimeAxisHeaderMenu : {
        pickZoomLevel   : '확대/축소',
        activeDateRange : '날짜 범위',
        startText       : '시작 날짜',
        endText         : '종료 날짜',
        todayText       : '오늘'
    },

    TimeAxisColumn : {
        ariaLabel : (startDate, endDate) => `시간 축이 ${startDate}에서 ${endDate}까지 표시됩니다`
    },

    EventCopyPaste : {
        copyEvent  : '일정 복사하기',
        cutEvent   : '일정 잘라내기',
        pasteEvent : '일정 붙여넣기'
    },

    EventFilter : {
        filterEvents : '작업 필터링',
        byName       : '이름으로'
    },

    TimeRanges : {
        showCurrentTimeLine : '현재 타임라인 표시'
    },

    PresetManager : {
        secondAndMinute : {
            displayDateFormat : 'll LTS',
            name              : '초'
        },
        minuteAndHour : {
            topDateFormat     : 'ddd MM-DD, hA',
            displayDateFormat : 'll LST'
        },
        hourAndDay : {
            topDateFormat     : 'ddd MM-DD',
            middleDateFormat  : 'LST',
            displayDateFormat : 'll LST',
            name              : '일'
        },
        day : {
            name : '일/시간'
        },
        week : {
            name : '주/시간'
        },
        dayAndWeek : {
            displayDateFormat : 'll LST',
            name              : '주/일'
        },
        dayAndMonth : {
            name : '달'
        },
        weekAndDay : {
            displayDateFormat : 'll LST',
            name              : '주'
        },
        weekAndMonth : {
            name : '주'
        },
        weekAndDayLetter : {
            name : '주/주말'
        },
        weekDateAndMonth : {
            name : '달/주'
        },
        monthAndYear : {
            name : '달'
        },
        year : {
            name : '년'
        },
        manyYears : {
            name : '여러 해'
        }
    },

    RecurrenceConfirmationPopup : {
        'delete-title'              : '일정을 삭제하는 중입니다',
        'delete-all-message'        : '이 일정의 모든 항목을 삭제하시겠습니까?',
        'delete-further-message'    : '이 일정 및 이 일정의 모든 향후 항목 또는, 선택한 항목만 삭제하시겠습니까?',
        'delete-only-this-message'  : '이 이벤트의 이 발생을 삭제하시겠습니까?',
        'delete-further-btn-text'   : '향후 모든 일정 삭제',
        'delete-only-this-btn-text' : '이 일정만 삭제',
        'update-title'              : '반복되는 일정을 변경하는 중입니다',
        'update-all-message'        : '이 일정의 모든 항목을 변경하시겠습니까?',
        'update-further-message'    : '이 일정 및 이 일정의 모든 향후 항목 또는, 이 항목만 변경하시겠습니까?',
        'update-only-this-message'  : '이 이벤트의 이 발생을 변경하시겠습니까?',
        'update-further-btn-text'   : '향후 모든 일정',
        'update-only-this-btn-text' : '이 일정만',
        Yes                         : '예',
        Cancel                      : '취소',
        width                       : 600
    },

    RecurrenceLegend : {
        ' and '                         : ' 및 ',
        Daily                           : '매일',
        'Weekly on {1}'                 : ({ days }) => `매주 ${days}일마다`,
        'Monthly on {1}'                : ({ days }) => `매달 ${days}일마다`,
        'Yearly on {1} of {2}'          : ({ days, months }) => `매년 ${months}월  ${days}일마다`,
        'Every {0} days'                : ({ interval }) => `매 ${interval} 일마다`,
        'Every {0} weeks on {1}'        : ({ interval, days }) => `매 ${interval} 주 간격으로 ${days}일마다`,
        'Every {0} months on {1}'       : ({ interval, days }) => `매 ${interval} 개월 간격으로  ${days}일마다`,
        'Every {0} years on {1} of {2}' : ({ interval, days, months }) => `매 ${interval} 년 간격으로 ${months}${days} 월 ${days}일마다`,
        position1                       : '첫 번째',
        position2                       : '두 번째',
        position3                       : '세 번째',
        position4                       : '네 번째',
        position5                       : '다섯 번째',
        'position-1'                    : '마지막',
        day                             : '일',
        weekday                         : '평일',
        'weekend day'                   : '주말',
        daysFormat                      : ({ position, days }) => `${position} ${days}`
    },

    RecurrenceEditor : {
        'Repeat event'      : '반복 일정',
        Cancel              : '취소',
        Save                : '저장',
        Frequency           : '빈도',
        Every               : '매',
        DAILYintervalUnit   : '일마다',
        WEEKLYintervalUnit  : '주마다',
        MONTHLYintervalUnit : '달마다',
        YEARLYintervalUnit  : '년마다',
        Each                : '각',
        on                  : '이하에',
        the                 : '이하에',
        'On the'            : '이하에',
        'End repeat'        : '반복 종료',
        'time(s)'           : '시간',
        Days                : '날',
        Months              : '달'
    },

    RecurrenceDaysCombo : {
        day           : '일',
        weekday       : '평일',
        'weekend day' : '주말'
    },

    RecurrencePositionsCombo : {
        position1    : '첫 번째',
        position2    : '두 번째',
        position3    : '세 번째',
        position4    : '네 번째',
        position5    : '다섯 번째',
        'position-1' : '마지막'
    },

    RecurrenceStopConditionCombo : {
        Never     : '한 번도 해당하지 않음',
        After     : '이후',
        'On date' : '날짜에'
    },

    RecurrenceFrequencyCombo : {
        None    : '반복 없음',
        Daily   : '매일',
        Weekly  : '매주',
        Monthly : '매달',
        Yearly  : '매년'
    },

    RecurrenceCombo : {
        None   : '없음',
        Custom : '사용자 설정...'
    },

    Summary : {
        'Summary for' : date => `${date} :다음의 요약`
    },

    ScheduleRangeCombo : {
        completeview : '스케줄 완료',
        currentview  : '스케줄 표시',
        daterange    : '날짜 범위',
        completedata : '전체 스케줄 (모든 일정)'
    },

    SchedulerExportDialog : {
        'Schedule range' : '스케줄 범위',
        'Export from'    : '부터',
        'Export to'      : '까지'
    },

    SinglePageExporterVertical : {
        verticalsinglepage : '단일 페이지'
    },

    SinglePageUnscaledExporterVertical : {
        verticalsinglepageunscaled : '단일 페이지 (비율 조정 없음)'
    },

    MultiPageVerticalExporterVertical : {
        verticalmultipagevertical : '여러 페이지(세로)'
    },

    ExcelExporter : {
        'No resource assigned' : '할당된 리소스 없음'
    },

    CrudManagerView : {
        serverResponseLabel : '서버 응답:'
    },

    DurationColumn : {
        Duration : '기간'
    },

    EventClusteringBase : {
        unnamed         : '이름 없음',
        more            : count => `+ ${count}개 더보기`,
        clusteredEvents : count => `클러스터된 이벤트 ${count}개`
    },

    ResourceTimeRangeClustering : {
        clusteredEvents : count => `클러스터된 범위 ${count}개`
    },

    ConstraintTypePicker : {
        none                : '없음',
        assoonaspossible    : '가능한 한 빨리',
        aslateaspossible    : '가능한 한 늦게',
        muststarton         : '에 시작해야 합니다',
        mustfinishon        : '에 마감해야 합니다',
        startnoearlierthan  : '이후에 시작',
        startnolaterthan    : '보다 늦지 않게 시작',
        finishnoearlierthan : '이후에 완료',
        finishnolaterthan   : '보다 늦지 않게 완료'
    },

    EventBuffer : {
        preamblePostambleDescription : ({ preamble, postamble }) => {
            let description = '';
            if (preamble) {
                description += `.${preamble.toString()} 이벤트 전 버퍼 시간`;
            }
            if (postamble) {
                description += `.${postamble.toString()} 이벤트 후 버퍼 시간`;
            }
            return description;
        }
    },

    SchedulingDirectionPicker : {
        Forward       : '앞으로',
        Backward      : '뒤로',
        inheritedFrom : '계승됨',
        enforcedBy    : '강제로 시행됨'
    },

    CalendarField : {
        'Default calendar' : '기본 캘린더',
        editCalendar       : '캘린더 편집'
    },

    TaskEditorBase : {
        Information   : '작업 정보',
        Save          : '저장',
        Cancel        : '취소',
        Delete        : '삭제',
        calculateMask : '계산 중...',
        saveError     : '저장할 수 없습니다. 먼저 오류를 수정하십시오',
        repeatingInfo : '반복 이벤트 보기',
        editRepeating : '편집'
    },

    TaskEdit : {
        editEvent              : '일정 편집',
        ConfirmDeletionTitle   : '삭제 확인',
        ConfirmDeletionMessage : '일정을 삭제하시겠습니까?'
    },

    GanttTaskEditor : {
        editorWidth : '52em'
    },

    SchedulerTaskEditor : {
        editorWidth : '39em'
    },

    SchedulerGeneralTab : {
        General      : '일반',
        Name         : '이름',
        Resources    : '리소스',
        '% complete' : '% 완료',
        Duration     : '기간',
        Start        : '시작',
        Finish       : '마침',
        Effort       : '업무',
        Preamble     : '프리앰블',
        Postamble    : '포스트앰블'
    },

    GeneralTab : {
        General      : '일반',
        Name         : '이름',
        '% complete' : '% 완료',
        Duration     : '기간',
        Start        : '시작',
        Finish       : '마감',
        Effort       : '업무',
        Dates        : '날짜'
    },

    SchedulerAdvancedTab : {
        Advanced                   : '고급',
        Calendar                   : '캘린더',
        'Scheduling mode'          : '스케줄 관리 모드',
        'Effort driven'            : '업무량 고정',
        'Manually scheduled'       : '수동으로 일정 예약',
        'Constraint type'          : '제한 유형',
        'Constraint date'          : '날짜 제한',
        Inactive                   : '비활성화',
        'Ignore resource calendar' : '리소스 일정 무시'
    },

    CalendarEditorDatePicker : {
        addException : '예외를 추가하십시오',
        addWeek      : '주 추가'
    },

    CalendarEditorExceptionTab : {
        addException    : '예외를 추가하십시오',
        removeException : '예외를 제거하십시오',
        noRows          : '예외가 추가되지 않았습니다'
    },

    CalendarEditorWeekTab : {
        addWeek    : '주 추가',
        removeWeek : '주를 제거하십시오'
    },

    CalendarEditor : {
        daysAreWorkingByDefault    : '날은 기본적으로 작동합니다',
        workingTimeCalendar        : '작업 시간 캘린더',
        exceptions                 : '예외',
        general                    : '일반적인',
        name                       : '이름',
        parent                     : '부모의',
        save                       : '구하다',
        weeks                      : '주',
        error                      : '오류',
        inputErrors                : '입력 오류가 있습니다. 변경 사항을 저장하기 전에 수정하십시오.',
        delete                     : '삭제',
        addCalendar                : '달력을 추가하십시오',
        confirmation               : '확인',
        removeCalendarWithChildren : '달력에는 자식 달력이 있습니다. "예"를 클릭하여 어린이로 달력을 제거하십시오.',
        removeCalendarAndLinks     : '캘린더는 일부 레코드에서 사용됩니다. "예"를 클릭하여 링크 해제하고 캘린더를 제거하십시오.',
        newException               : '새로운 예외',
        newWeek                    : '새로운 주'
    },

    CalendarEditorDateInfo : {
        isWorking    : ' 일하고 있습니다',
        isNotWorking : ' 작동 안됨',
        basedOn      : ' 기반 :',
        byDefault    : '기본적으로',
        rangeTpl     : (start, end) => `${start} ~ ${end}`
    },

    CalendarEditorLegend : {
        workingDay    : '일하는 날',
        nonWorkingDay : '일하는 날'
    },

    AvailabilityRangeError : {
        errorOverlap       : '겹치는 범위가 있습니다',
        errorMissingDate   : '시작 및 종료 시간이 필요합니다',
        errorStartAfterEnd : '시작 시간은 종료 시간 이후에있을 수 없습니다'
    },

    CalendarEditorExceptionPanel : {
        name                                 : '이름',
        from                                 : '에서',
        to                                   : '에게',
        is                                   : '~이다',
        nonWorking                           : '비 작동',
        working                              : '일하고 있는',
        hours                                : '시간',
        repeat                               : '반복하다',
        repeatEnd                            : '끝을 반복하십시오',
        errorMissingDate                     : '예외 날짜 범위가 필요합니다',
        errorStartAfterEnd                   : '"From" date cannot be after the "To" date ',
        errorStartAndEndRepeatNumberMismatch : '예외는 같은 횟수를 시작하고 끝내야합니다.'
    },

    CalendarEditorWeekPanel : {
        name        : '이름',
        from        : '에서',
        to          : '에게',
        days        : '날',
        copyDay     : '복사 일',
        pasteDay    : '페이스트 데이',
        stopCopying : '복사를 중지하십시오'
    },

    CalendarEditorAvailabilityRangeContainer : {
        addRange    : '범위를 추가하십시오',
        removeRange : '범위를 제거하십시오'
    },

    CalendarEditorWeekGrid : {
        errorStartAfterEnd           : '"From" date cannot be after the "To" date ',
        errorNoDefaultWeek           : '주 구성이 필요합니다',
        errorMultipleDefaultWeeks    : '둘 이상의 기본 주가 지정됩니다',
        errorNoWeekAvailability      : '주에는 근무 시간을 제공해야합니다',
        errorInvalidWeekAvailability : '주에는 작업 시간 구성 오류가 있습니다',
        noRows                       : '몇 주가 추가되지 않았습니다'
    },

    AdvancedTab : {
        Advanced                   : '고급',
        Calendar                   : '캘린더',
        'Scheduling mode'          : '스케줄 관리 모드',
        'Effort driven'            : '업무량 고정',
        'Manually scheduled'       : '수동으로 일정 예약',
        'Constraint type'          : '제한 유형',
        'Constraint date'          : '날짜 제한',
        Constraint                 : '제약 조건',
        Rollup                     : '롤업',
        Inactive                   : '비활성화',
        'Ignore resource calendar' : '리소스 일정 무시',
        'Scheduling direction'     : '일정 방향',
        projectBorder              : '프로젝트 국경',
        ignore                     : '무시하다',
        honor                      : '명예',
        askUser                    : '사용자에게 물어보십시오'
    },

    DependencyTab : {
        Predecessors      : '선행 활동 ',
        Successors        : '후행 활동',
        ID                : 'ID',
        Name              : '이름',
        Type              : '유형',
        Lag               : '지연',
        cyclicDependency  : '순환 의존 관계',
        invalidDependency : '의존 관계 유효하지 않음',
        readOnlyTask      : '읽기 전용 작업은 연결할 수 없습니다'
    },

    NotesTab : {
        Notes : '참고 '
    },

    ResourceCalendarColumn : {
        calendar : '달력'
    },

    ResourceEdit : {
        editResource : '리소스 수정'
    },

    ResourceEditor : {
        resourceInformation : '자원정보',
        costs               : '소송 비용',
        save                : '구하다',
        error               : '오류',
        inputErrors         : '입력 오류가 있습니다. 변경사항을 저장하기 전에 문제를 해결하세요.',
        delete              : '삭제',
        confirmation        : '확인',
        removeUsedResource  : '자원이 일부 작업에 할당되었습니다. 어쨌든 리소스를 제거하려면 "예"를 클릭하십시오.'
    },

    ResourceEditorGeneralTab : {
        calendar    : '달력',
        general     : '일반적인',
        label       : '소재 라벨',
        name        : '리소스 이름',
        type        : '유형',
        costAccrual : '비용 발생',
        labelHint   : '예를 들어 kg, 톤 또는 상자',
        maxUnits    : '최대 단위'
    },

    ResourceCostAccrualColumn : {
        accrueAt : '발생 시간:',
        prorated : '일할 계산됨',
        start    : '시작',
        end      : '끝'
    },

    CostAccrualField : {
        prorated : '일할 계산됨',
        start    : '시작',
        end      : '끝'
    },

    ResourceType : {
        work     : '일하다',
        material : '재료',
        cost     : '비용'
    },

    ResourceTypeColumn : {
        type : '유형'
    },

    ResourceEditorRateTablesTab : {
        rateTable    : '요금표',
        newGroup     : '새 테이블',
        removeGroup  : '테이블 삭제',
        useByDefault : '자원 할당에 기본적으로 사용',
        noRates      : '요금 없음'
    },

    ResourceGrid : {
        name          : '이름',
        materialLabel : '소재 라벨',
        maxUnits      : '최대 단위',
        cost          : '비용',
        noRows        : '리소스 없음'
    },

    ResourceRateTableContainer : {
        startDate    : '시작일',
        standardRate : '표준요금',
        perUseCost   : '사용당 비용',
        addRate      : '요금 추가',
        removeRate   : '요금 삭제',
        name         : '이름',
        noRates      : '요금 없음'
    },

    ResourceRateTableEditor : {
        rateTableInformation : '요금표 정보'
    },

    ResourcesTab : {
        unitsTpl    : ({ column, value }) => column.formatValue(value) + '%',
        quantityTpl : ({ record, value }) => `${value || 0} ${record.resource?.materialLabel || ''}`,
        quantity    : '수량',
        Resources   : '리소스',
        Resource    : '리소스',
        Units       : '단위',
        cost        : '비용',
        effort      : '노력',
        start       : '시작',
        finish      : '마치다',
        preamble    : '서문',
        postamble   : '후문'
    },

    RateTableColumn : {
        rateTable : '요금표'
    },

    RecurrenceTab : {
        title : '반복'
    },

    SchedulingModePicker : {
        Normal           : '정상',
        'Fixed Duration' : '고정 기간',
        'Fixed Units'    : '고정 단위',
        'Fixed Effort'   : '고정 업무'
    },

    ResourceHistogram : {
        barTipInRange         : '<b>{resource}</b> {startDate} - {endDate}<br><span class="{cls}">{allocated}  {available}</span> 할당',
        barTipOnDate          : '<b>{resource}</b> {startDate}<br><span class="{cls}">{allocated}  {available}</span> 할당',
        groupBarTipAssignment : '<b>{resource}</b> - <span class="{cls}">{allocated}  {available}</span>',
        groupBarTipInRange    : '{startDate} - {endDate}<br><span class="{cls}">{allocated}  {available}</span> 할당:<br>{assignments}',
        groupBarTipOnDate     : ' {startDate}<br><span class="{cls}">{allocated}  {available}</span> 할당:<br>{assignments}',
        plusMore              : '+{value} 추가'
    },

    ResourceUtilization : {
        effortRangeInfo       : '<div class="b-effort-range-data"><div class="b-effort-label">노력</div><div class="b-effort-value {cls}">{allocated} 중 {available}</div></div>',
        effortInfo            : '<div class="b-effort-data"><div class="b-effort-label">노력</div><div class="b-effort-value {cls}">{allocated}</div></div>',
        costInfo              : '<div class="b-cost-data"><div class="b-effort-label">비용</div><div class="b-effort-value b-cost">{cost}</div></div>',
        quantityInfo          : '<div class="b-quantity-data"><div class="b-effort-label">수량</div><div class="b-effort-value b-quantity">{quantity}</div></div>',
        barTipInRange         : '<div class="b-on-date">{event} {startDate} - {endDate}</div><div class="b-summary-data">{effort-info}{cost-info}{quantity-info}</div>',
        barTipOnDate          : '<div class="b-on-date">{event} {startDate}에</div><div class="b-summary-data">{effort-info}{cost-info}{quantity-info}</div>',
        groupBarTipAssignment : '<div class="b-assignment"><div class="b-assignment-name">{event}</div>{effort-info}{cost-info}{quantity-info}</div>',
        groupBarTipInRange    : '<div class="b-on-date">{startDate} - {endDate} 요약</div><div class="b-summary-data">{effort-range-info}{cost-info}{quantity-info}</div><div class="b-assignments">{assignments}</div>',
        groupBarTipOnDate     : '<div class="b-on-date">{startDate} 요약</div><div class="b-summary-data">{effort-range-info}{cost-info}{quantity-info}</div><div class="b-assignments">{assignments}</div>',
        plusMore              : '+{value} 추가',
        nameColumnText        : '자원 / 이벤트'
    },

    SchedulingIssueResolutionPopup : {
        'Cancel changes'   : '변경 사항을 취소하고 아무 것도 하지 않음',
        schedulingConflict : '스케줄링 충돌',
        emptyCalendar      : '캘린더 구성 오류',
        cycle              : '스케줄링 주기',
        Apply              : '적용'
    },

    CycleResolutionPopup : {
        dependencyLabel        : '의존 관계를 선택하십시오:',
        invalidDependencyLabel : '해결해야 하는 유효하지 않은 관련된 의존 관계가 있습니다:'
    },

    SchedulerProBase : {
        propagating     : '프로젝트 계산 중',
        storePopulation : '데이터 로드 중',
        finalizing      : '결과 마무리 중'
    },

    EventSegments : {
        splitEvent    : '일정 분할',
        renameSegment : '이름 바꾸기'
    },

    NestedEvents : {
        createGroup         : '선택한 이벤트 그룹화',
        newGroupName        : '새 그룹',
        deNestingNotAllowed : '네스팅 해제가 허용되지 않음',
        nestingNotAllowed   : '네스팅이 허용되지 않음'
    },

    VersionGrid : {
        compare       : '비교',
        description   : '설명',
        occurredAt    : '발생일',
        rename        : '이름 바꾸기',
        restore       : '복원',
        stopComparing : '비교 중지'
    },

    Versions : {
        entityNames : {
            TaskModel       : '할 일',
            AssignmentModel : '할당',
            DependencyModel : '링크',
            ProjectModel    : '프로젝트',
            ResourceModel   : '리소스',
            other           : '대상'
        },
        entityNamesPlural : {
            TaskModel       : '할 일',
            AssignmentModel : '할당',
            DependencyModel : '링크',
            ProjectModel    : '프로젝트',
            ResourceModel   : '리소스',
            other           : '대상'
        },
        transactionDescriptions : {
            update : '{n} {entities} 변경됨',
            add    : '{n} {entities} 추가됨',
            remove : '{n} {entities} 삭제됨',
            move   : '{n} {entities} 이동함',
            mixed  : '{n} {entities} 변경됨'
        },
        propertyNames : {
            active                   : '활성화',
            allDay                   : '종일',
            allowOverlap             : '겹침 허용',
            barMargin                : '바 여백',
            bidirectional            : '양방향',
            calendar                 : '달력',
            cls                      : 'CSS 클래스',
            constraintDate           : '제약 날짜',
            constraintType           : '제약 유형',
            daysPerMonth             : '월별 일수',
            daysPerWeek              : '주별 일수',
            delayFromParent          : '상위로부터의 지연',
            direction                : '방향',
            drawDependencies         : '의존성 그리기',
            duration                 : '기간',
            durationUnit             : '기간 단위',
            effort                   : '노력',
            effortDriven             : '노력 기반',
            effortUnit               : '노력 단위',
            endDate                  : '종료 날짜',
            eventColor               : '색상',
            eventId                  : '이벤트 ID',
            eventLayout              : '이벤트 레이아웃',
            eventStyle               : '바 스타일',
            exceptionDates           : '예외 날짜',
            fixed                    : '고정',
            from                     : '시작',
            fromSide                 : '시작 측면',
            hoursPerDay              : '일일 시간',
            href                     : '링크',
            iconCls                  : '아이콘',
            id                       : 'ID',
            ignoreResourceCalendar   : '리소스 캘린더 무시',
            ignoreTimeZone           : '시간대 무시',
            image                    : '이미지',
            imageUrl                 : '이미지 URL',
            inactive                 : '비활성화',
            intervals                : '간격',
            lag                      : '지연',
            lagUnit                  : '지연 단위',
            lineStyle                : '선 스타일',
            manuallyScheduled        : '수동 일정',
            milestoneWidth           : '마일스톤 너비',
            name                     : '이름',
            note                     : '노트',
            parentId                 : '상위 ID',
            parentIndex              : '위치',
            percentDone              : '% 완료',
            postamble                : '후주',
            preamble                 : '전주',
            readOnly                 : '읽기 전용',
            recurrenceRule           : '반복 규칙',
            resourceId               : '리소스 ID',
            resourceMargin           : '리소스 여백',
            rowHeight                : '행 높이',
            schedulingMode           : '일정 모드',
            segments                 : '세그먼트',
            showAvatar               : '아바타 표시',
            showInTimeline           : '타임라인에 표시',
            startDate                : '시작 날짜',
            stickyContents           : '고정 콘텐츠',
            strokeColor              : '선 색상',
            style                    : '스타일',
            target                   : '링크 대상',
            to                       : '종료',
            toSide                   : '종료 측면',
            type                     : '유형',
            units                    : '단위',
            unscheduled              : '미일정',
            unspecifiedTimeIsWorking : '미지정 시간은 작업 중',
            version                  : '버전'
        },
        intervals : {
            working    : '작업 중',
            nonWorking : '비작업 중',
            fromTo     : '{from}에서 {to}까지',
            recurring  : '{start}부터 {end}까지 반복'
        },
        addEntity         : '추가된 {type} **{name}**',
        removeEntity      : '삭제된 {type} **{name}**',
        updateEntity      : '변경된 {type} **{name}**',
        moveEntity        : '이동한 {type} **{name}** {from}에서 {to}으로',
        addDependency     : '**{from}**에서 **{to}**으로 추가된 링크',
        removeDependency  : '**{from}**에서 **{to}**으로 삭제된 링크',
        updateDependency  : '**{from}**에서 **{to}**으로 편집된 링크',
        addAssignment     : '**{resource}**를 **{event}**에 할당함',
        removeAssignment  : '**{event}**에서 **{resource}**로 삭제된 할당',
        updateAssignment  : '**{resource}**에서 **{event}**로 편집된 할당',
        noChanges         : '변경 사항 없음',
        nullValue         : '없음',
        versionDateFormat : 'M/D/YYYY h:mm a',
        savedAt           : '{date}에 저장됨',
        autoSavedAt       : '{date}에 자동 저장됨',
        undid             : '변경 취소',
        redid             : '다시한 변경 사항',
        editedTask        : '편집된 작업 속성',
        deletedTask       : '삭제된 작업',
        movedTask         : '이동된 할 일',
        movedTasks        : '이동된 할 일'
    }
};

export default LocaleHelper.publishLocale(locale);
