import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Scheduler/localization/Ko.js';

const locale = {

    localeName : 'Ko',
    localeDesc : '한국어',
    localeCode : 'ko',
    localeRtl  : false,

    EventEdit : {
        Calendar  : '캘린더',
        'All day' : '하루 종일',
        day       : '일',
        week      : '주',
        month     : '월',
        year      : '년',
        decade    : '10년'
    },

    EventMenu : {
        duplicateEvent : '중복 일정',
        copy           : '복사하기'
    },

    Calendar : {
        toggleSidebar : '사이드바 표시 전환',
        Today         : '오늘',
        Tomorrow      : '내일',
        next          : range => `다음 ${range}`,
        previous      : range => `이전 ${range}`,
        plusMore      : value => `+${value} 추가`,
        moreEvents    : value => `${value}개의 추가 이벤트`,
        allDay        : '하루 종일',
        endsOn        : d => `${d}일에 종료 `,
        weekOfYear    : ([y, w]) => `${w}, ${y} 주 `,
        loadFail      : '캘린더 데이터 로드에 실패했습니다. 시스템 관리자에게 문의하십시오',
        gotoDate      : '날짜로 이동',
        timeRange     : '시간 범위',
        noResources   : '리소스 없음',
        calendar      : '캘린더',
        toolbar       : '캘린더 도구 모음',
        months        : '월들'
    },

    CalendarDrag : {
        holdCtrlForRecurrence : '반복되는 일정에 Ctrl 키 누르기 유지'
    },

    CalendarMixin : {
        eventCount       : count => `일정${count || ' 없음'}`,
        allDayEventCount : count => `${count || '없음'} 종일 이벤트${count === 1 ? '' : '들'}`
    },

    EventTip : {
        'Edit event' : '일정 편집',
        timeFormat   : 'LST'
    },

    ModeSelector : {
        includeWeekends : '주말 포함',
        weekends        : '주말',
        switcherMenu    : '보기 전환 메뉴'
    },

    AgendaView : {
        Agenda : '일정표'
    },

    MonthView : {
        Month     : '월',
        monthUnit : '달'
    },

    MultiWeekView : {
        multiWeek : '여러 주'
    },

    WeekView : {
        weekUnit : '주'
    },

    YearView : {
        Year     : '년',
        yearUnit : '년',
        noEvents : '이벤트가 없습니다'
    },

    YearPlanner : {
        yearPlanner      : '연간 계획',
        expandMonthRow   : '월 행 확장',
        collapseMonthRow : '월 행 축소'
    },

    EventList : {
        List   : '목록',
        Start  : '시작',
        Finish : '마감',
        days   : count => `${count > 1 ? `${count} ` : ''}${count === 1 ? '낮' : '날'}`
    },

    DayView : {
        Day                : '일',
        dayUnit            : '일',
        daysUnit           : '일',
        expandAllDayRow    : '하루 종일 섹션 펼치기',
        collapseAllDayRow  : '하루 종일 섹션 접기',
        timeFormat         : 'LST',
        timeAxisTimeFormat : 'LST',
        noMatchingDates    : '일치하는 날짜가 없습니다'
    },

    DayAgendaView : {
        dayAgenda : '하루 일정'
    },

    DayResourceView : {
        dayResourceView : '일일 자원'
    },

    MonthGrid : {
        monthGrid : '월 그리드'
    },

    Sidebar : {
        selectDate      : '달력 날짜 선택',
        matchEvents     : '경기 이벤트',
        filterEvents    : '이벤트 이름으로 이벤트 필터링',
        filterResources : '선택한 리소스로 이벤트 필터링'
    },

    WeekExpander : {
        expandTip   : '클릭하여 행 펼치기',
        collapseTip : '클릭하여 행 접기'
    },

    keyboardActions : {
        title   : '키보드 작업',
        content : '도움말 패널 표시 : [?]\n포커스 모드 선택 버튼 : [Home]\n보기 변경 : [1]에서 [9] 또는 선택 버튼 텍스트의 첫 글자\n다음 시간 범위 : [n]\n이전 시간 범위 : [p]\n오늘로 이동 : [t]\n날짜로 이동 : [g]\n현재 날짜 셀로 이동 : [CTRL]+[d]\n이벤트 간 탐색 : [TAB]\n사이드바 이벤트 필터 입력에 포커스 : [/]\n새 이벤트 생성 (날짜 셀에 포커스) : [ENTER]\n포커스된 이벤트 삭제 : [DELETE]/[BACKSPACE]\n포커스된 이벤트 편집 : [ENTER]\n이벤트 또는 셀에서 컨텍스트 메뉴 호출 : [SHIFT+F10]/[SPACE]\n이벤트에서 셀로 포커스 이동 : [ESCAPE]\n셀 간 탐색 : [↑]/[↓]/[←]/[→]\n범위 메뉴 활성화 (Agenda 보기에서) : [CTRL]+[r]\n이벤트 잘라내기, 복사, 붙여넣기 : [CTRL]+[x]/[c]/[v]\nDayView에서 확대/축소 : [+]/[-]'
    }
};

export default LocaleHelper.publishLocale(locale);
