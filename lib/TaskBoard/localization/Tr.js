import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Core/localization/Tr.js';

const locale = {

    localeName : 'Tr',
    localeDesc : 'Türkçe',
    localeCode : 'tr',
    localeRtl  : false,

    GridBase : {
        loadFailedMessage : 'Veri yükleme başarısız!',
        syncFailedMessage : 'Veri senkronizasyonu başarısız!'
    },

    CrudManagerView : {
        serverResponseLabel : 'Sunucu yanıtı:'
    },

    TaskBoard : {
        column                 : 'sütun',
        columns                : 'sütunlar',
        Columns                : 'Sütunlar',
        swimlane               : 'kulvar',
        swimlanes              : 'kulvarlar',
        Swimlanes              : 'Kulvarlar',
        task                   : 'görev',
        tasks                  : 'görevler',
        addTask                : 'Ekle L{TaskBoard.task}',
        cancel                 : 'İptal et',
        changeColumn           : 'Değiştir L{TaskBoard.column}',
        changeSwimlane         : 'Değiştir L{TaskBoard.swimlane}',
        collapse               : text => `Daralt ${text}`,
        color                  : 'Renk',
        description            : 'Açıklama',
        editTask               : 'Düzenle L{TaskBoard.task}',
        expand                 : text => `Genişlet ${text}`,
        filterColumns          : 'Filtrele L{TaskBoard.columns}',
        filterSwimlanes        : 'Filtrele L{TaskBoard.swimlanes}',
        filterTasks            : 'Filtrele L{TaskBoard.tasks}',
        lock                   : 'Kilit',
        unlock                 : 'Kilidini aç',
        moveColumnLeft         : 'Taşı L{TaskBoard.column} sola',
        moveColumnRight        : 'Taşı L{TaskBoard.column} sağa',
        moveColumnUp           : 'Taşı L{TaskBoard.column} yukarı',
        moveColumnDown         : 'Taşı L{TaskBoard.column} aşağı',
        moveColumnOutOfGroup   : 'Taşı L{TaskBoard.column} gruptan dışarı',
        moveColumnIntoGroup    : 'Taşı L{TaskBoard.column} gruba',
        groupWithLeftNeighbor  : 'Sol komşu L{TaskBoard.column} ile grupla',
        groupWithRightNeighbor : 'Sağ komşu L{TaskBoard.column} ile grupla',
        name                   : 'Ad',
        newTaskName            : 'Yeni L{TaskBoard.task}',
        removeTask             : 'Kaldır L{TaskBoard.task}',
        removeTasks            : 'Kaldır L{TaskBoard.tasks}',
        resources              : 'Kaynaklar',
        save                   : 'Kaydet',
        scrollToColumn         : 'Şuraya kaydır L{TaskBoard.column}',
        scrollToSwimlane       : 'Şuraya kaydır L{TaskBoard.swimlane}',
        showColumnMenu         : 'Sütun menüsünü göster',
        showTask               : 'Görevi göster',
        unassigned             : 'Atanmamış',
        zoom                   : 'Yakınlaştır'
    },

    ColumnFilters : {
        show         : 'Sütun filtresini göster',
        toggle       : 'Sütun filtresini değiştir',
        clear        : 'Sütun filtrelerini temizle',
        badgeTooltip : count => `${count} filtre uygulanmış`
    },

    ColumnSort : {
        sort     : 'Sütunu sırala',
        sortedBy : ({ label, ascending }) =>
            `Sütun "${label}" ${ascending ? 'artan' : 'azalan'} olarak sıralandı`,
        reset : 'Sütun sıralamasını sıfırla'
    },

    TaskMenuItem : {
        showTaskMenu : 'Görev menüsünü göster'
    },

    TodoListField : {
        add     : 'Ekle',
        newTodo : 'Yeni yapılacaklar'
    },

    UndoRedo : {
        UndoLastAction : 'Geri al',
        RedoLastAction : 'Yinele'
    },

    ColumnRename : {
        rename : 'Yeniden adlandır'
    },

    ColumnSearchField : {
        search    : 'Ara',
        matchMode : (mode) => `Arama modu: ${mode}`,
        literal   : 'Kelime anlamı',
        and       : 'Tüm kelimeler (VE)',
        or        : 'Herhangi bir kelime (VEYA)'
    }
};

export default LocaleHelper.publishLocale(locale);
