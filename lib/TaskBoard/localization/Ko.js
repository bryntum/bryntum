import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Core/localization/Ko.js';

const locale = {

    localeName : 'Ko',
    localeDesc : '한국어',
    localeCode : 'ko',
    localeRtl  : false,

    GridBase : {
        loadFailedMessage : '데이터 로드에 실패했습니다!',
        syncFailedMessage : '데이터 동기화에 실패했습니다!'
    },

    CrudManagerView : {
        serverResponseLabel : '서버 응답:'
    },

    TaskBoard : {
        column                 : '열',
        columns                : '열',
        Columns                : '열',
        swimlane               : '업무 흐름도',
        swimlanes              : '업무 흐름도',
        Swimlanes              : '업무 흐름도',
        task                   : '작업',
        tasks                  : '작업',
        addTask                : 'L{TaskBoard.task} 추가 ',
        cancel                 : '취소',
        changeColumn           : 'L{TaskBoard.column} 변경',
        changeSwimlane         : 'L{TaskBoard.swimlane} 변경',
        collapse               : text => `${text} 접기`,
        color                  : '색상',
        description            : '설명',
        editTask               : 'L{TaskBoard.task} 편집',
        expand                 : text => `${text} 펼치기`,
        filterColumns          : 'L{TaskBoard.columns} 필터링하기',
        filterSwimlanes        : ' L{TaskBoard.swimlanes} 필터링하기',
        filterTasks            : 'L{TaskBoard.tasks} 필터링하기',
        lock                   : '잠그다',
        unlock                 : '터놓다',
        moveColumnLeft         : 'L{TaskBoard.column} 왼쪽으로 이동 ',
        moveColumnRight        : 'L{TaskBoard.column} 오른쪽으로 이동 ',
        moveColumnUp           : 'L{TaskBoard.column} 위로 이동 ',
        moveColumnDown         : 'L{TaskBoard.column} 아래로 이동 ',
        moveColumnOutOfGroup   : 'L{TaskBoard.column} 그룹 밖으로 이동 ',
        moveColumnIntoGroup    : 'L{TaskBoard.column} 그룹으로 이동 ',
        groupWithLeftNeighbor  : '왼쪽 인접 L{TaskBoard.column} 와(과) 그룹화',
        groupWithRightNeighbor : '오른쪽 인접 L{TaskBoard.column} 와(과) 그룹화',
        name                   : '이름',
        newTaskName            : '새 L{TaskBoard.task}',
        removeTask             : 'L{TaskBoard.task} 제거 ',
        removeTasks            : ' L{TaskBoard.tasks} 제거 ',
        resources              : '리소스',
        save                   : '저장',
        scrollToColumn         : 'L{TaskBoard.column}로 스크롤하기 ',
        scrollToSwimlane       : 'L{TaskBoard.swimlane}로 스크롤하기 ',
        showColumnMenu         : '열 메뉴 표시',
        showTask               : 'L{TaskBoard.task} 표시',
        unassigned             : '할당되지 않음',
        zoom                   : '확대/축소'
    },

    ColumnFilters : {
        show         : '열 필터 표시',
        toggle       : '열 필터 전환',
        clear        : '열 필터 지우기',
        badgeTooltip : count => `${count}개의 필터가 적용됨`
    },

    ColumnSort : {
        sort     : '열 정렬',
        sortedBy : ({ label, ascending }) =>
            `"${label}"을 기준으로 열이 ${ascending ? '오름차순' : '내림차순'}으로 정렬됨`,
        reset : '열 정렬 재설정'
    },

    TaskMenuItem : {
        showTaskMenu : '작업 메뉴 표시'
    },

    TodoListField : {
        add     : '추가',
        newTodo : '새로운 할 일'
    },

    UndoRedo : {
        UndoLastAction : '실행 취소',
        RedoLastAction : '다시 실행'
    },

    ColumnRename : {
        rename : '이름 바꾸기'
    },

    ColumnSearchField : {
        search    : '검색',
        matchMode : (mode) => `검색 모드: ${mode}`,
        literal   : '문자 그대로',
        and       : '모든 단어 (AND)',
        or        : '아무 단어 (OR)'
    }
};

export default LocaleHelper.publishLocale(locale);
