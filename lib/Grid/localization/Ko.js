import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Core/localization/Ko.js';

const emptyString = new String();

const locale = {

    localeName : 'Ko',
    localeDesc : '한국어',
    localeCode : 'ko',
    localeRtl  : false,

    ChecklistFilterCombo : {
        search      : '검색',
        selectAll   : '전체 선택',
        removeAll   : '전체 해제',
        filtersSet  : n => n === 1 ? `1개의 필터 설정됨` : `${n}개의 필터 설정됨`,
        noItems     : '결과가 없습니다',
        placeholder : '필터...',
        apply       : '적용'
    },

    ColumnPicker : {
        column          : '열',
        columnsMenu     : '열',
        hideColumn      : '열 숨기기',
        hideColumnShort : '숨기기',
        newColumns      : '신규 열',
        allColumns      : '모든 열',
        showName        : column => `열${column.text ? ` ${column.text}` : ''} 표시`,
        hideName        : column => `열${column.text ? ` ${column.text}` : ''} 숨기기`
    },

    Filter : {
        applyFilter   : '필터 적용',
        filter        : '필터',
        editFilter    : '필터 편집',
        on            : '켜기',
        before        : '이전',
        after         : '이후',
        equals        : '같음',
        lessThan      : '이하',
        moreThan      : '이상',
        removeFilter  : '필터 제거',
        disableFilter : '필터 비활성화'
    },

    FilterBar : {
        enableFilterBar  : '필터 막대 표시',
        disableFilterBar : '필터 막대 숨기기'
    },

    Group : {
        group                : '그룹',
        groupAscending       : '그룹 오름차순',
        groupDescending      : '그룹 내림차순',
        groupAscendingShort  : '오름차순',
        groupDescendingShort : '내림차순',
        stopGrouping         : '그룹화 중지',
        stopGroupingShort    : '중지'
    },

    HeaderMenu : {
        moveBefore     : text => ` "${text}" 이전으로 이동`,
        moveAfter      : text => ` "${text} 이후로 이동 "`,
        collapseColumn : '열 접기',
        expandColumn   : '열 펼치기'
    },

    ColumnRename : {
        rename : '이름 바꾸기'
    },

    ColumnResize : {
        resizeColumn : '열 크기 조정',
        width        : '너비',
        fitToData    : '데이터에 맞춤'
    },

    MergeCells : {
        mergeCells  : '셀 병합',
        menuTooltip : '이 열로 정렬할 때 같은 값으로 셀 병합'
    },

    Search : {
        searchForValue : '값 검색'
    },

    Sort : {
        sort                   : '정렬',
        sortAscending          : '오름차순 정렬',
        sortDescending         : '내림차순 정렬',
        multiSort              : '다중 정렬',
        removeSorter           : '정렬 제거',
        addSortAscending       : '오름차순 정렬 추가',
        addSortDescending      : '내림차순 정렬 추가',
        toggleSortAscending    : '오름차순으로 변경',
        toggleSortDescending   : '내림차순으로 변경',
        sortAscendingShort     : '오름차순',
        sortDescendingShort    : '내림차순',
        removeSorterShort      : '제거',
        addSortAscendingShort  : '+ 오름차순',
        addSortDescendingShort : '+ 내림차순'
    },

    Split : {
        split        : '나누기',
        unsplit      : '병합',
        horizontally : '가로로',
        vertically   : '세로로',
        both         : '둘 다',
        top          : '위',
        bottom       : '아래',
        left         : '왼쪽',
        right        : '오른쪽'
    },

    LockRows : {
        lockRow   : '행 잠금',
        unlockRow : '행 잠금 해제'
    },

    ActionColumn : {
        rowActions : '행 동작'
    },

    Column : {
        columnLabel : column => `${column.text ? `${column.text} 열. ` : ''}상황에 맞는 메뉴의 경우 SPACE 를 탭합니다${column.canSort ? ', 정렬하려면 ENTER' : ''}`,
        cellLabel   : emptyString
    },

    WidgetColumn : {
        rowWidgets : '행 위젯'
    },

    Checkbox : {
        toggleRowSelect : '행 선택 전환',
        toggleSelection : '전체 데이터세트 선택 전환',
        toggleName      : column => `전환 ${column.text || '값'}`
    },

    RatingColumn : {
        cellLabel : column => `${column.location?.record ? `${column.location.record.get(column.field) || 0} :평가` : ''} ${column.text ? column.text : ''}`
    },

    RowNumberColumn : {
        rowNumber : '행 번호'
    },

    GridBase : {
        loadFailedMessage  : '데이터 로드에 실패했습니다!',
        syncFailedMessage  : '데이터 동기화에 실패했습니다!',
        unspecifiedFailure : '알 수 없는 실패',
        networkFailure     : '네트워크 오류',
        parseFailure       : '서버 응답 분석에 실패했습니다',
        serverResponse     : '서버 응답:',
        noRows             : '표시할 기록 없음',
        moveColumnLeft     : '왼쪽 섹션으로 이동',
        moveColumnRight    : '오른쪽 섹션으로 이동',
        moveColumnTo       : region => ` ${region} 열로 이동`,
        filteredRecords    : n => n ? (n === 1 ? `1개의 행이 필터와 일치합니다` : `${n}개의 행이 필터와 일치합니다`) : '일치하는 행이 없습니다'
    },

    CellMenu : {
        removeRow : '삭제'
    },

    RowCopyPaste : {
        copyRecord  : '복사하기',
        cutRecord   : '잘라내기',
        pasteRecord : '붙여넣기',
        rows        : '행들',
        row         : '행'
    },

    CellCopyPaste : {
        copy  : '복사하기',
        cut   : '잘라내기',
        paste : '붙여넣기'
    },

    Charts : {
        chartDesigner : '차트 디자이너',
        newChart      : '새 차트',
        download      : '다운로드',
        settings      : '설정'
    },

    PdfExport : {
        'Waiting for response from server' : '서버 응답 대기 중...',
        'Export failed'                    : '내보내기 실패',
        'Server error'                     : '서버 오류',
        'Generating pages'                 : '페이지 생성 중...',
        'Click to abort'                   : '취소'
    },

    ExportDialog : {
        width          : '40em',
        labelWidth     : '12em',
        exportSettings : '내보내기 설정',
        export         : '내보내기',
        printSettings  : '인쇄 설정',
        print          : '인쇄',
        exporterType   : '페이지 번호 제어',
        cancel         : '취소',
        fileFormat     : '파일 형식',
        rows           : '행',
        alignRows      : '행 정렬',
        columns        : '열',
        paperFormat    : '용지 형식',
        orientation    : '방향',
        repeatHeader   : '헤더 반복'
    },

    ExportRowsCombo : {
        all     : '모든 행',
        visible : '행 표시'
    },

    ExportOrientationCombo : {
        portrait  : '인물',
        landscape : '풍경'
    },

    SinglePageExporter : {
        singlepage : '단일 페이지'
    },

    SinglePageUnscaledExporter : {
        singlepageunscaled : '단일 페이지 (비율 조정 없음)'
    },

    MultiPageExporter : {
        multipage     : '여러 페이지',
        exportingPage : ({ currentPage, totalPages }) => `${currentPage}/${totalPages} 페이지 내보내기`
    },

    MultiPageVerticalExporter : {
        multipagevertical : '여러 페이지 (세로)',
        exportingPage     : ({ currentPage, totalPages }) => `${currentPage}/${totalPages} 페이지 내보내기`
    },

    RowExpander : {
        loading            : '로딩 중',
        expand             : '펼치기',
        collapse           : '접기',
        columnDescription  : '행 세부 정보 전환',
        expandedRowContent : '확장된 행 내용'
    },

    TreeGroup : {
        group                  : '그룹화',
        stopGrouping           : '그룹화 중지',
        stopGroupingThisColumn : '이 열의 그룹화 해제'
    },

    AIFilter : {
        unsuccessfulFilterMessage : '필터 작업이 실패했습니다. 다시 시도해 주세요'
    },

    AIFilterField : {
        progressText : '필터링 중'
    },

    PinColumns : {
        pinColumn  : '열 고정',
        unpin      : '고정 없음',
        pinToStart : '시작에 고정',
        pinToEnd   : '끝에 고정'
    }
};

export default LocaleHelper.publishLocale(locale);
