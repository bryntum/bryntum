import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Scheduler/localization/Tr.js';

const locale = {

    localeName : 'Tr',
    localeDesc : 'Türkçe',
    localeCode : 'tr',
    localeRtl  : false,

    Object : {
        Save : 'Kaydet'
    },

    CostColumn : {
        cost : 'Maliyet'
    },

    IgnoreResourceCalendarColumn : {
        'Ignore resource calendar' : 'Kaynak takvimi yoksay'
    },

    InactiveColumn : {
        Inactive : 'Etkin olmayan'
    },

    TaskInfoColumn : {
        info                     : 'Bilgi',
        postponedConflictTooltip : 'Bu etkinlikle ilgili çözülmemiş bir zamanlama çakışması var. Çözümlemek için tıklayın.'
    },

    ActualEffortColumn : {
        actualEffort : 'Gerçek Çaba'
    },

    AddNewColumn : {
        'New Column' : 'Yeni Sütun'
    },

    BaselineEffortColumn : {
        baselineEffort : 'Temel Çaba'
    },

    BaselineStartDateColumn : {
        baselineStart : 'Orijinal Başlangıç'
    },

    BaselineEndDateColumn : {
        baselineEnd : 'Orijinal Bitiş'
    },

    BaselineDurationColumn : {
        baselineDuration : 'Orijinal Süre'
    },

    BaselineStartVarianceColumn : {
        startVariance : 'Başlangıç varyansı'
    },

    BaselineEndVarianceColumn : {
        endVariance : 'Bitiş varyansı'
    },

    BaselineDurationVarianceColumn : {
        durationVariance : 'Süre Varyansı'
    },

    CalendarColumn : {
        Calendar : 'Takvim'
    },

    EarlyStartDateColumn : {
        'Early Start' : 'Erken Başlangıç'
    },

    EarlyEndDateColumn : {
        'Early End' : 'Erken Bitiş'
    },

    LateStartDateColumn : {
        'Late Start' : 'Geç Başlangıç'
    },

    LateEndDateColumn : {
        'Late End' : 'Geç Bitiş'
    },

    TotalSlackColumn : {
        'Total Slack' : 'Toplam Erteleme'
    },

    ConstraintDateColumn : {
        'Constraint Date' : 'Kısıtlama Tarihi'
    },

    ConstraintTypeColumn : {
        'Constraint Type' : 'Kısıtlama Türü'
    },

    DeadlineDateColumn : {
        Deadline : 'Son tarihi'
    },

    DependencyColumn : {
        'Invalid dependency' : 'Geçersiz bağımlılık'
    },

    DurationColumn : {
        Duration : 'Süre'
    },

    EffortColumn : {
        Effort : 'Sarfedilecek efor'
    },

    EndDateColumn : {
        Finish : 'Bitiş tarihi'
    },

    ManuallyScheduledColumn : {
        'Manually scheduled' : 'Manuel planlanmış'
    },

    MilestoneColumn : {
        Milestone : 'Kilometre taşı'
    },

    NameColumn : {
        Name : 'Ad'
    },

    NoteColumn : {
        Note : 'Not'
    },

    PercentDoneColumn : {
        '% Done' : '% Tamamlandı'
    },

    PlannedPercentDoneColumn : {
        plannedPercentDone : 'Planlanan Tamamlanma Yüzdesi'
    },

    PredecessorColumn : {
        Predecessors : 'Öncüller'
    },

    ResourceAssignmentColumn : {
        'Assigned Resources' : 'Atanmış Kaynaklar',
        'more resources'     : 'daha fazla kaynak'
    },

    RollupColumn : {
        Rollup : 'Toplama'
    },

    SchedulingModeColumn : {
        'Scheduling Mode' : 'Planlama Modu'
    },

    SchedulingDirectionColumn : {
        schedulingDirection : 'Planlama yönü',
        inheritedFrom       : 'Miras alınan',
        enforcedBy          : 'Zorunlu olarak'
    },

    SequenceColumn : {
        Sequence : 'Dizi'
    },

    ShowInTimelineColumn : {
        'Show in timeline' : 'Zaman çizelgesinde göster'
    },

    StartDateColumn : {
        Start : 'Başlangıç tarihi'
    },

    SuccessorColumn : {
        Successors : 'Ardıllar'
    },

    TaskCopyPaste : {
        copyTask  : 'Kopyala',
        cutTask   : 'Kes',
        pasteTask : 'Yapıştır'
    },

    WBSColumn : {
        WBS      : 'İKY',
        renumber : 'Yeniden numaralandır'
    },

    DependencyField : {
        invalidDependencyFormat : 'Geçersiz bağımlılık biçimi'
    },

    ProjectLines : {
        'Project Start' : 'Proje başlangıcı',
        'Project End'   : 'Proje bitişi',
        statusDate      : 'Durum tarihi'
    },

    TaskTooltip : {
        Start    : 'Başlangıç',
        End      : 'Bitiş',
        Duration : 'Süre',
        Complete : 'Tamamlandı'
    },

    BasicTaskEdit : {
        editTask        : 'Düzenle',
        name            : 'Ad',
        percentComplete : '% tamamlandı',
        start           : 'Başlangıç',
        finish          : 'Bitiş',
        duration        : 'Süre'
    },

    AssignmentGrid : {
        Name     : 'Kaynak adı',
        Units    : 'Birimler',
        unitsTpl : ({ value }) => value ? value + '%' : ''
    },

    AssignmentPicker : {
        quantity    : 'Miktar',
        cost        : 'Maliyet',
        quantityTpl : ({ record, value }) => `${value || 0} ${record.resource?.materialLabel || ''}`
    },

    Gantt : {
        Edit                   : 'Düzenle',
        Indent                 : 'Girintile',
        Outdent                : 'Çıkıntıla',
        'Convert to milestone' : 'Kilometre taşına dönüştür',
        Add                    : 'Ekle...',
        'New task'             : 'Yeni görev',
        'New milestone'        : 'Yeni kilometre taşı',
        'Task above'           : 'Yukarıdaki görev',
        'Task below'           : 'Aşağıdaki görev',
        'Delete task'          : 'Görevi sil',
        Milestone              : 'Kilometre taşı',
        'Sub-task'             : 'Alt görev',
        Successor              : 'Ardıl',
        Predecessor            : 'Öncül',
        changeRejected         : 'Planlama motoru değişiklikleri reddetti',
        linkTasks              : 'Bağımlılıkları ekleyin',
        unlinkTasks            : 'Bağımlılıkları kaldırın',
        color                  : 'Renk'
    },

    EventSegments : {
        splitTask : 'Görevleri böl'
    },

    Indicators : {
        earlyDates   : 'Erken başlangıç/bitiş tarihi',
        lateDates    : 'Geç başlangıç/bitiş tarihi',
        Start        : 'Başlangıç tarihi',
        End          : 'Bitiş tarihi',
        deadlineDate : 'Son gün'
    },

    Versions : {
        indented      : 'Girintili',
        outdented     : 'Çıkıntılı',
        cut           : 'Kes',
        pasted        : 'yapıştırıldı',
        deletedTasks  : 'Görevler silindi',
        propertyNames : {
            baselines                   : 'Temel Çizgiler',
            deadlineDate                : 'Son Tarih',
            description                 : 'Açıklama',
            endDate                     : 'Bitiş tarihi',
            projectConstraintResolution : 'Proje kısıt çözümü',
            rollup                      : 'Toplama',
            taskIconCls                 : 'Görev simgesi',
            wbsValue                    : 'İş Kırılım Yapısı'
        }
    },

    ProjectEditor : {
        projectInformation : 'Proje bilgileri',
        editorWidth        : 400
    },

    ProjectEditorGeneralTab : {
        general      : 'Genel',
        projectName  : 'Proje Adı',
        start        : 'Başlangıç ​​Tarihi',
        finish       : 'Bitiş Tarihi',
        scheduleFrom : 'Planlama Başlangıç ​​Tarihi',
        calendar     : 'Takvim',
        readOnly     : 'Salt Okunur',
        forward      : 'Proje başlangıç ​​tarihi',
        backward     : 'Proje bitiş tarihi'
    },

    ProjectEditorDescriptionTab : {
        description : 'Tanım'
    },

    ProjectEditorAdvancedTab : {
        advanced     : 'Gelişmiş',
        hoursPerDay  : 'Günde Saat',
        daysPerWeek  : 'Haftalık Günler',
        daysPerMonth : 'Aylık Gün Sayısı'
    }
};

export default LocaleHelper.publishLocale(locale);
