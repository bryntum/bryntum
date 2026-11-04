import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Engine/localization/Tr.js';
import '../../Grid/localization/Tr.js';

const locale = {

    localeName : 'Tr',
    localeDesc : 'Türkçe',
    localeCode : 'tr',
    localeRtl  : false,

    Object : {
        newEvent    : 'Yeni etkinlik',
        information : 'Bilgi',
        showDetails : 'Detayları göster'
    },

    ResourceInfoColumn : {
        eventCountText : data => data + ' etkinlik' + (data !== 1 ? 'ler' : '')
    },

    ResourceCollapseColumn : {
        toggleResourceLayout : 'Kaynak düzeni sütununu değiştir. Bağlam menüsü için SPACE.'
    },

    Dependencies : {
        from    : 'Şu tarihten',
        to      : 'Bu tarihe kadar',
        valid   : 'Geçerli',
        invalid : 'Geçersiz'
    },

    DependencyType : {
        SS           : 'BaBa',
        SF           : 'BaBi',
        FS           : 'BiBa',
        FF           : 'BiBi',
        StartToStart : 'Başlangıç-Başlangıç',
        StartToEnd   : 'Başlangıç-Bitiş',
        EndToStart   : 'Bitiş-Başlangıç',
        EndToEnd     : 'Bitiş-Bitiş',
        short        : [
            'BaBa',
            'BaBi',
            'BiBa',
            'BiBi'
        ],
        long : [
            'Başlangıç-Başlangıç',
            'Başlangıç-Bitiş',
            'Bitiş-Başlangıç',
            'Bitiş-Bitiş'
        ]
    },

    DependencyEdit : {
        From              : 'Şu tarihten',
        To                : 'Bu tarihe kadar',
        Type              : 'Tür',
        Lag               : 'Gecikme',
        color             : 'Renk',
        lineStyle         : 'Çizgi stili',
        solid             : 'Düz',
        dashed            : 'Kesik',
        dotted            : 'Noktalı',
        dashDot           : 'Kesik nokta',
        longDash          : 'Uzun kesik',
        'Edit dependency' : 'Bağımlılığı düzenle',
        Save              : 'Kaydet',
        Delete            : 'Sil',
        Cancel            : 'İptal et',
        StartToStart      : 'Başlangıç-Başlangıç',
        StartToEnd        : 'Başlangıç-Bitiş',
        EndToStart        : 'Bitiş-Başlangıç',
        EndToEnd          : 'Bitiş-Bitiş',
        Active            : 'Etkin'
    },

    EventEdit : {
        Name           : 'Ad',
        Resource       : 'Kaynak',
        Start          : 'Başlangıç',
        startTime      : 'Başlangıç saati',
        End            : 'Bitiş',
        endTime        : 'Bitiş saati',
        Save           : 'Kaydet',
        Delete         : 'Sil',
        Cancel         : 'İptal et',
        'Edit event'   : 'Etkinliği düzenle',
        Repeat         : 'Tekrarla',
        editRecurrence : 'Tekrarı düzenle'
    },

    EventDrag : {
        eventOverlapsExisting   : 'Etkinlik, bu kaynaktaki mevcut etkinlikle çakışıyor',
        noDropOutsideTimeline   : 'Etkinlik, zaman çizelgesinin tamamen dışına bırakılamaz',
        duplicateAssignmentDrag : 'Etkinlik aynı kaynağa birden çok kez atanamaz'
    },

    SchedulerBase : {
        'Add event'      : 'Etkinlik ekle',
        'Delete event'   : 'Etkinlik sil',
        'Unassign event' : 'Etkinlik atamasını kaldır',
        color            : 'Renk',
        eventAriaLabel   : (eventRecord, startDate) => `${eventRecord.name}, ${startDate} tarihinde başlıyor ${eventRecord.duration > 0 ? `${eventRecord.fullDuration.toString(false)} süresince` : ''}`
    },

    TimeAxisHeaderMenu : {
        pickZoomLevel   : 'Yakınlaştır',
        activeDateRange : 'Tarih aralığı',
        startText       : 'Başlangıç tarihi',
        endText         : 'Bitiş tarihi',
        todayText       : 'Bugün'
    },

    TimeAxisColumn : {
        ariaLabel : (startDate, endDate) => `Zaman ekseni ${startDate} ile ${endDate} gösteriyor`
    },

    EventCopyPaste : {
        copyEvent  : 'Etkinliği kopyala',
        cutEvent   : 'Etkinliği kes',
        pasteEvent : 'Etkinliği yapıştır'
    },

    EventFilter : {
        filterEvents : 'Etkinlikleri filtrele',
        byName       : 'Ada göre'
    },

    TimeRanges : {
        showCurrentTimeLine : 'Mevcut zaman çizelgesini göster'
    },

    PresetManager : {
        secondAndMinute : {
            displayDateFormat : 'll LTS',
            name              : 'Saniyeler'
        },
        minuteAndHour : {
            topDateFormat     : 'ddd DD.MM, hA',
            displayDateFormat : 'll LST'
        },
        hourAndDay : {
            topDateFormat     : 'ddd DD.MM',
            middleDateFormat  : 'LST',
            displayDateFormat : 'll LST',
            name              : 'Gün'
        },
        day : {
            name : 'Gün/saatler'
        },
        week : {
            name : 'Hafta/saatler'
        },
        dayAndWeek : {
            displayDateFormat : 'll LST',
            name              : 'Hafta/saatler'
        },
        dayAndMonth : {
            name : 'Ay'
        },
        weekAndDay : {
            displayDateFormat : 'll LST',
            name              : 'Hafta'
        },
        weekAndMonth : {
            name : 'Haftalar'
        },
        weekAndDayLetter : {
            name : 'Haftalar/haftanın günleri'
        },
        weekDateAndMonth : {
            name : 'Aylar/haftalar'
        },
        monthAndYear : {
            name : 'Aylar'
        },
        year : {
            name : 'Yıllar'
        },
        manyYears : {
            name : 'Bir çok yıl'
        }
    },

    RecurrenceConfirmationPopup : {
        'delete-title'              : 'Bir etkinliği siliyorsunuz',
        'delete-all-message'        : 'Bu etkinliğe ait tüm mesajları silmek istiyor musunuz?',
        'delete-further-message'    : 'Bunu ve bu etkinliğin gelecekteki tüm mesajlarını mı yoksa yalnızca seçilen mesajı mı silmek istiyorsunuz?',
        'delete-only-this-message'  : 'Bu etkinliğin bu oluşumunu silmek istiyor musunuz?',
        'delete-further-btn-text'   : 'Gelecekteki Tüm Etkinlikleri Sil',
        'delete-only-this-btn-text' : 'Yalnızca Bu Etkinliği Sil',
        'update-title'              : 'Tekrarlanan bir etkinliği değiştiriyorsunuz',
        'update-all-message'        : 'Bu etkinliğin tüm mesajlarını değiştirmek istiyor musunuz?',
        'update-further-message'    : 'Etkinliğin yalnızca bu mesajını mı yoksa bunu ve gelecekteki tüm mesajlarını mı değiştirmek istiyorsunuz?',
        'update-only-this-message'  : 'Bu etkinliğin bu oluşumunu değiştirmek istiyor musunuz?',
        'update-further-btn-text'   : 'Gelecekteki Tüm Etkinlikler',
        'update-only-this-btn-text' : 'Yalnızca Bu Etkinlik',
        Yes                         : 'Evet',
        Cancel                      : 'İptal Et',
        width                       : 600
    },

    RecurrenceLegend : {
        ' and '                         : ' ve ',
        Daily                           : 'Günlük',
        'Weekly on {1}'                 : ({ days }) => `Her hafta şu gün ${days}`,
        'Monthly on {1}'                : ({ days }) => `Her ay şu gün ${days}`,
        'Yearly on {1} of {2}'          : ({ days, months }) => `Her yıl şu günü${days} şu ayın ${months}`,
        'Every {0} days'                : ({ interval }) => `Her ${interval} gün`,
        'Every {0} weeks on {1}'        : ({ interval, days }) => `Her ${interval} haftada şu gün ${days}`,
        'Every {0} months on {1}'       : ({ interval, days }) => `Her ${interval} ayda şu gün ${days}`,
        'Every {0} years on {1} of {2}' : ({ interval, days, months }) => `Her ${interval} yıl, şu günü ${days} şu ayın ${months}`,
        position1                       : 'ilk gün',
        position2                       : 'ikinci gün',
        position3                       : 'üçüncü gün',
        position4                       : 'dördüncü gün',
        position5                       : 'beşinci gün',
        'position-1'                    : 'son gün ',
        day                             : 'gün',
        weekday                         : 'hafta içi',
        'weekend day'                   : 'hafta sonu',
        daysFormat                      : ({ position, days }) => `${position} ${days}`
    },

    RecurrenceEditor : {
        'Repeat event'      : 'Etkinliği tekrarla',
        Cancel              : 'İptal et',
        Save                : 'Kaydet',
        Frequency           : 'Sıklık',
        Every               : 'Her',
        DAILYintervalUnit   : 'gün(ler)de',
        WEEKLYintervalUnit  : 'hafta(lar)da',
        MONTHLYintervalUnit : 'ay(lar)da',
        YEARLYintervalUnit  : 'yıl(lar)da',
        Each                : 'Her',
        on                  : 'Açik',
        the                 : 'Her',
        'On the'            : 'Şu tarihte',
        'End repeat'        : 'Tekrarlamayı bitir',
        'time(s)'           : 'kere',
        Days                : 'Günler',
        Months              : 'Aylar'
    },

    RecurrenceDaysCombo : {
        day           : 'gün',
        weekday       : 'hafta içi',
        'weekend day' : 'hafta sonu'
    },

    RecurrencePositionsCombo : {
        position1    : 'ilk',
        position2    : 'ikinci',
        position3    : 'üçüncü',
        position4    : 'dördüncü',
        position5    : 'beşinci',
        'position-1' : 'son'
    },

    RecurrenceStopConditionCombo : {
        Never     : 'Hiçbir zaman',
        After     : 'Sonra',
        'On date' : 'Şu tarihte'
    },

    RecurrenceFrequencyCombo : {
        None    : 'Tekrar yok',
        Daily   : 'Günlük',
        Weekly  : 'Haftalık',
        Monthly : 'Aylık',
        Yearly  : 'Yıllık'
    },

    RecurrenceCombo : {
        None   : 'Hiçbiri',
        Custom : 'Özel...'
    },

    Summary : {
        'Summary for' : date => `Şu tarih için özet ${date}`
    },

    ScheduleRangeCombo : {
        completeview : 'Tüm planı göster',
        currentview  : 'Görünür plan',
        daterange    : 'Tarih aralığı',
        completedata : 'Tüm planı göster (tüm etkinlikler için)'
    },

    SchedulerExportDialog : {
        'Schedule range' : 'Plan aralığı',
        'Export from'    : 'Şuradan',
        'Export to'      : 'Buraya'
    },

    SinglePageExporterVertical : {
        verticalsinglepage : 'Tek sayfa'
    },

    SinglePageUnscaledExporterVertical : {
        verticalsinglepageunscaled : 'Tek sayfa (ölçeklenmemiş)'
    },

    MultiPageVerticalExporterVertical : {
        verticalmultipagevertical : 'Birden fazla sayfa (dikey)'
    },

    ExcelExporter : {
        'No resource assigned' : 'Atanmış kaynak yok'
    },

    CrudManagerView : {
        serverResponseLabel : 'Sunucu yanıtı:'
    },

    DurationColumn : {
        Duration : 'Süre'
    },

    EventClusteringBase : {
        unnamed         : 'İsimsiz',
        more            : count => `+ ${count} daha`,
        clusteredEvents : count => `${count} kümelenmiş etkinlik`
    },

    ResourceTimeRangeClustering : {
        clusteredEvents : count => `${count} kümelenmiş aralık`
    },

    ConstraintTypePicker : {
        none                : 'Hiçbiri',
        assoonaspossible    : 'Mümkün olan en kısa sürede',
        aslateaspossible    : 'Mümkün olan en geç',
        muststarton         : 'Şu tarihte başlamalı',
        mustfinishon        : 'Şu tarihte bitmeli',
        startnoearlierthan  : 'En erken şu tarihte başla',
        startnolaterthan    : 'En geç şu tarihte başla',
        finishnoearlierthan : 'En erken şu tarihte bitir',
        finishnolaterthan   : 'En geç şu tarihte bitir'
    },

    EventBuffer : {
        preamblePostambleDescription : ({ preamble, postamble }) => {
            let description = '';
            if (preamble) {
                description += `.${preamble.toString()} etkinlik öncesi tampon süresi`;
            }
            if (postamble) {
                description += `.${postamble.toString()} etkinlik sonrası tampon süresi`;
            }
            return description;
        }
    },

    SchedulingDirectionPicker : {
        Forward       : 'İleri',
        Backward      : 'Geri',
        inheritedFrom : 'Miras alınan',
        enforcedBy    : 'Zorunlu olarak'
    },

    CalendarField : {
        'Default calendar' : 'Varsayılan takvim',
        editCalendar       : 'Takvimi düzenle'
    },

    TaskEditorBase : {
        Information   : 'Görev bilgileri',
        Save          : 'Kaydet',
        Cancel        : 'İptal et',
        Delete        : 'Sil',
        calculateMask : 'Hesaplanıyor...',
        saveError     : 'Kaydedilemez, önce lütfen hataları düzeltin',
        repeatingInfo : 'Tekrarlanan bir olayı görüntüleme',
        editRepeating : 'Düzenle'
    },

    TaskEdit : {
        editEvent              : 'Etkinliği düzenle',
        ConfirmDeletionTitle   : 'Silmeyi onayla',
        ConfirmDeletionMessage : 'Etkinliği silmek istediğinizden emin misiniz?'
    },

    GanttTaskEditor : {
        editorWidth : '52em'
    },

    SchedulerTaskEditor : {
        editorWidth : '37em'
    },

    SchedulerGeneralTab : {
        General      : 'Genel',
        Name         : 'Ad',
        Resources    : 'Kaynaklar',
        '% complete' : '% tamamlandı',
        Duration     : 'Süre',
        Start        : 'Başlangıç',
        Finish       : 'Bitiş',
        Effort       : 'Harcanacak çaba',
        Preamble     : 'Giriş',
        Postamble    : 'Çıkış'
    },

    GeneralTab : {
        General      : 'Genel',
        Name         : 'Ad',
        '% complete' : '% tamamlandı',
        Duration     : 'Süre',
        Start        : 'Başlangıç',
        Finish       : 'Bitiş',
        Effort       : 'Harcanacak çaba',
        Dates        : 'Tarihler'
    },

    SchedulerAdvancedTab : {
        Advanced                   : 'Gelişmiş',
        Calendar                   : 'Takvim',
        'Scheduling mode'          : 'Planlama modu',
        'Effort driven'            : 'Sarfedilen efor temelli',
        'Manually scheduled'       : 'Manuel planlanmış',
        'Constraint type'          : 'Kısıtlama türü',
        'Constraint date'          : 'Kısıtlama tarihi',
        Inactive                   : 'Etkin olmayan',
        'Ignore resource calendar' : 'Kaynak takvimi yoksay'
    },

    CalendarEditorDatePicker : {
        addException : 'İstisna ekle',
        addWeek      : 'Hafta Ekle'
    },

    CalendarEditorExceptionTab : {
        addException    : 'İstisna ekle',
        removeException : 'İstisna Kaldır',
        noRows          : 'İstisna Eklendi'
    },

    CalendarEditorWeekTab : {
        addWeek    : 'Hafta Ekle',
        removeWeek : 'Haftayı Kaldır'
    },

    CalendarEditor : {
        daysAreWorkingByDefault    : 'Günler varsayılan olarak çalışıyor',
        workingTimeCalendar        : 'Çalışma zamanı takvimi',
        exceptions                 : 'İstisnalar',
        general                    : 'Genel',
        name                       : 'İsim',
        parent                     : 'Ebeveyn',
        save                       : 'Kaydetmek',
        weeks                      : 'Haftalar',
        error                      : 'Hata',
        inputErrors                : 'Girdi hataları var. Değişikliklerinizi kaydetmeden önce lütfen bunları düzeltin.',
        delete                     : 'Silmek',
        addCalendar                : 'Bir Takvim Ekle',
        confirmation               : 'Onayla',
        removeCalendarWithChildren : 'Takvimin çocuk takvimleri var. Takvimi çocuklarıyla kaldırmak için "Evet" i tıklayın.',
        removeCalendarAndLinks     : 'Takvim bazı kayıtlar tarafından kullanılır. Onları kaldırmak ve takvimi kaldırmak için "Evet" i tıklayın.',
        newException               : 'Yeni istisna',
        newWeek                    : 'Yeni hafta'
    },

    CalendarEditorDateInfo : {
        isWorking    : ' çalışıyor',
        isNotWorking : ' çalışmıyor',
        basedOn      : ' dayalı:',
        byDefault    : 'varsayılan olarak',
        rangeTpl     : (start, end) => `${start} - ${end}`
    },

    CalendarEditorLegend : {
        workingDay    : 'İş günü',
        nonWorkingDay : 'Tatil günü'
    },

    AvailabilityRangeError : {
        errorOverlap       : 'Üst üste binen aralıklar var',
        errorMissingDate   : 'Başlangıç ​​ve bitiş zamanı gereklidir',
        errorStartAfterEnd : 'Başlangıç ​​zamanı bitiş zamanından sonra olamaz'
    },

    CalendarEditorExceptionPanel : {
        name                                 : 'İsim',
        from                                 : 'İtibaren',
        to                                   : 'İle',
        is                                   : 'Dır-dir',
        nonWorking                           : 'Çalışmayan',
        working                              : 'Çalışma',
        hours                                : 'Saat',
        repeat                               : 'Tekrarlamak',
        repeatEnd                            : 'Tekrar sonlandır',
        errorMissingDate                     : 'İstisna tarih aralığı gereklidir',
        errorStartAfterEnd                   : '"From" date cannot be after the "To" date ',
        errorStartAndEndRepeatNumberMismatch : 'İstisna aynı sayıda başlamalı ve bitmeli'
    },

    CalendarEditorWeekPanel : {
        name        : 'İsim',
        from        : 'İtibaren',
        to          : 'İle',
        days        : 'Günler',
        copyDay     : 'Kopya Günü',
        pasteDay    : 'Günü Yapıştır',
        stopCopying : 'Kopyalamayı bırak'
    },

    CalendarEditorAvailabilityRangeContainer : {
        addRange    : 'Aralık Ekle',
        removeRange : 'Aralığı Kaldır'
    },

    CalendarEditorWeekGrid : {
        errorStartAfterEnd           : '"From" date cannot be after the "To" date ',
        errorNoDefaultWeek           : 'Hafta yapılandırması gerekli',
        errorMultipleDefaultWeeks    : 'Birden fazla varsayılan hafta belirtildi',
        errorNoWeekAvailability      : 'Hafta biraz çalışma süresi sağlamalı',
        errorInvalidWeekAvailability : 'Haftada çalışma zamanı yapılandırma hataları var',
        noRows                       : 'Haftalar eklenmedi'
    },

    AdvancedTab : {
        Advanced                   : 'Gelişmiş',
        Calendar                   : 'Takvim',
        'Scheduling mode'          : 'Planlama modu',
        'Effort driven'            : 'Sarfedilen efor temelli',
        'Manually scheduled'       : 'Manuel planlanmış',
        'Constraint type'          : 'Kısıtlama türü',
        'Constraint date'          : 'Kısıtlama tarihi',
        Constraint                 : 'Kısıtlama',
        Rollup                     : 'Toplama',
        Inactive                   : 'Etkin olmayan',
        'Ignore resource calendar' : 'Kaynak takvimi yoksay',
        'Scheduling direction'     : 'Planlama yönü',
        projectBorder              : 'Proje sınırı',
        ignore                     : 'Görmezden gelmek',
        honor                      : 'Onur',
        askUser                    : 'Kullanıcıya sor'
    },

    DependencyTab : {
        Predecessors      : 'Öncüller',
        Successors        : 'Ardıllar',
        ID                : 'Kimlik',
        Name              : 'Ad',
        Type              : 'Tür',
        Lag               : 'Gecikme',
        cyclicDependency  : 'Döngüsel bağımlılık',
        invalidDependency : 'Geçersiz bağımlılık',
        readOnlyTask      : 'Salt okunur görev bağlanamaz'
    },

    NotesTab : {
        Notes : 'Notlar'
    },

    ResourceCalendarColumn : {
        calendar : 'Takvim'
    },

    ResourceEdit : {
        editResource : 'Kaynağı düzenle'
    },

    ResourceEditor : {
        resourceInformation : 'Kaynak bilgileri',
        costs               : 'Maliyetler',
        save                : 'Kaydetmek',
        error               : 'Hata',
        inputErrors         : 'Giriş hataları var. Lütfen değişikliklerinizi kaydetmeden önce bunları düzeltin.',
        delete              : 'Silmek',
        confirmation        : 'Onay',
        removeUsedResource  : 'Kaynak bazı görevlere atanır. Kaynağı yine de kaldırmak için "Evet"i tıklayın.'
    },

    ResourceEditorGeneralTab : {
        calendar    : 'Takvim',
        general     : 'Genel',
        label       : 'Malzeme etiketi',
        name        : 'Kaynak adı',
        type        : 'Tip',
        costAccrual : 'Maliyet tahakkuku',
        labelHint   : 'örneğin kg, ton veya kutular',
        maxUnits    : 'Maksimum birimler'
    },

    ResourceCostAccrualColumn : {
        accrueAt : 'Tahakkuk tarihi',
        prorated : 'Orantılı',
        start    : 'Başlangıç',
        end      : 'Son'
    },

    CostAccrualField : {
        prorated : 'Orantılı',
        start    : 'Başlangıç',
        end      : 'Son'
    },

    ResourceType : {
        work     : 'İş',
        material : 'Malzeme',
        cost     : 'Maliyet'
    },

    ResourceTypeColumn : {
        type : 'Tip'
    },

    ResourceEditorRateTablesTab : {
        rateTable    : 'Fiyat tablosu',
        newGroup     : 'Yeni tablo',
        removeGroup  : 'Tabloyu kaldır',
        useByDefault : 'Kaynak atamaları için varsayılan olarak kullan',
        noRates      : 'Oran yok'
    },

    ResourceGrid : {
        name          : 'İsim',
        materialLabel : 'Malzeme etiketi',
        maxUnits      : 'Maksimum birim',
        cost          : 'Maliyet',
        noRows        : 'Kaynak yok'
    },

    ResourceRateTableContainer : {
        startDate    : 'Başlangıç ​​tarihi',
        standardRate : 'Standart ücret',
        perUseCost   : 'Kullanım başına maliyet',
        addRate      : 'Ücret ekle',
        removeRate   : 'Oranı kaldır',
        name         : 'İsim',
        noRates      : 'Oran yok'
    },

    ResourceRateTableEditor : {
        rateTableInformation : 'Tarife tablosu bilgileri'
    },

    ResourcesTab : {
        unitsTpl    : ({ column, value }) => column.formatValue(value) + '%',
        quantityTpl : ({ record, value }) => `${value || 0} ${record.resource?.materialLabel || ''}`,
        quantity    : 'Miktar',
        Resources   : 'Kaynaklar',
        Resource    : 'Kaynak',
        Units       : 'Birimler',
        cost        : 'Maliyet',
        effort      : 'Çaba',
        start       : 'Başlangıç',
        finish      : 'Sona ermek',
        preamble    : 'Önsöz',
        postamble   : 'Sonsöz'
    },

    RateTableColumn : {
        rateTable : 'Fiyat tablosu'
    },

    RecurrenceTab : {
        title : 'Yenile'
    },

    SchedulingModePicker : {
        Normal           : 'Normal',
        'Fixed Duration' : 'Sabit Süre',
        'Fixed Units'    : 'Sabit Birimler',
        'Fixed Effort'   : 'Sarfedilen Sabit Efor'
    },

    ResourceHistogram : {
        barTipInRange         : '<b>{resource}</b> {startDate} - {endDate}<br><span class="{cls}">{allocated} -den {available}</span> ayrıldı',
        barTipOnDate          : '<b>{resource}</b> on {startDate}<br><span class="{cls}">{allocated} -den {available}</span> ayrıldı',
        groupBarTipAssignment : '<b>{resource}</b> - <span class="{cls}">{allocated} -den {available}</span>',
        groupBarTipInRange    : '{startDate} - {endDate}<br><span class="{cls}">{allocated} -den {available}</span> allocated:<br>{assignments}',
        groupBarTipOnDate     : 'Şu gün {startDate}<br><span class="{cls}">{allocated} -den {available}</span> ayırldı:<br>{assignments}',
        plusMore              : '+{value} daha fazla'
    },

    ResourceUtilization : {
        effortRangeInfo       : '<div class="b-effort-range-data"><div class="b-effort-label">Çaba</div><div class="b-effort-value {cls}">{allocated} / {available}</div></div>',
        effortInfo            : '<div class="b-effort-data"><div class="b-effort-label">Çaba</div><div class="b-effort-value {cls}">{allocated}</div></div>',
        costInfo              : '<div class="b-cost-data"><div class="b-effort-label">Maliyet</div><div class="b-effort-value b-cost">{cost}</div></div>',
        quantityInfo          : '<div class="b-quantity-data"><div class="b-effort-label">Miktar</div><div class="b-effort-value b-quantity">{quantity}</div></div>',
        barTipInRange         : '<div class="b-on-date">{event} {startDate} - {endDate}</div><div class="b-summary-data">{effort-info}{cost-info}{quantity-info}</div>',
        barTipOnDate          : '<div class="b-on-date">{event} tarihinde {startDate}</div><div class="b-summary-data">{effort-info}{cost-info}{quantity-info}</div>',
        groupBarTipAssignment : '<div class="b-assignment"><div class="b-assignment-name">{event}</div>{effort-info}{cost-info}{quantity-info}</div>',
        groupBarTipInRange    : '<div class="b-on-date">Özet {startDate} - {endDate}</div><div class="b-summary-data">{effort-range-info}{cost-info}{quantity-info}</div><div class="b-assignments">{assignments}</div>',
        groupBarTipOnDate     : '<div class="b-on-date">Özet {startDate}</div><div class="b-summary-data">{effort-range-info}{cost-info}{quantity-info}</div><div class="b-assignments">{assignments}</div>',
        plusMore              : '+{value} daha fazla',
        nameColumnText        : 'Kaynak / Etkinlik'
    },

    SchedulingIssueResolutionPopup : {
        'Cancel changes'   : 'Değişikliği iptal et ve hiçbir şey yapma',
        schedulingConflict : 'Zamanlama çakışması',
        emptyCalendar      : 'Takvim yapılandırma hatası',
        cycle              : 'Planlama döngüsü',
        Apply              : 'Uygula'
    },

    CycleResolutionPopup : {
        dependencyLabel        : 'Lütfen bir bağımlılık seçin:',
        invalidDependencyLabel : 'İlgilenilmesi gereken geçersiz bağımlılıklar mevcut:'
    },

    SchedulerProBase : {
        propagating     : 'Proje hesaplanıyor',
        storePopulation : 'Veri yükleniyor',
        finalizing      : 'Sonuçlar tamamlanıyor'
    },

    EventSegments : {
        splitEvent    : 'Olayı böl',
        renameSegment : 'Yeniden adlandır'
    },

    NestedEvents : {
        createGroup         : 'Seçili etkinlikleri grupla',
        newGroupName        : 'Yeni Grup',
        deNestingNotAllowed : 'Ayırmaya izin verilmiyor',
        nestingNotAllowed   : 'İç içe yerleştirmeye izin verilmiyor'
    },

    VersionGrid : {
        compare       : 'Karşılaştır',
        description   : 'Açıklama',
        occurredAt    : 'Meydana geldiği tarih',
        rename        : 'Yeniden adlandır',
        restore       : 'Geri yükle',
        stopComparing : 'Karşılaştırmayı durdur'
    },

    Versions : {
        entityNames : {
            TaskModel       : 'görev',
            AssignmentModel : 'görevlendirme',
            DependencyModel : 'bağlantı',
            ProjectModel    : 'proje',
            ResourceModel   : 'kaynak',
            other           : 'nesne'
        },
        entityNamesPlural : {
            TaskModel       : 'görevler',
            AssignmentModel : 'görevlendirmeler',
            DependencyModel : 'bağlantılar',
            ProjectModel    : 'projeler',
            ResourceModel   : 'kaynaklar',
            other           : 'nesneler'
        },
        transactionDescriptions : {
            update : 'Değiştirildi {n} {entities}',
            add    : 'Eklendi {n} {entities}',
            remove : 'Kaldırıldı {n} {entities}',
            move   : 'Taşındı {n} {entities}',
            mixed  : 'Değiştirildi {n} {entities}'
        },
        propertyNames : {
            active                   : 'Aktif',
            allDay                   : 'Tüm gün',
            allowOverlap             : 'Çakışmaya izin ver',
            barMargin                : 'Çubuk boşluğu',
            bidirectional            : 'Çift yönlü',
            calendar                 : 'Takvim',
            cls                      : 'CSS sınıfı',
            constraintDate           : 'Kısıtlama tarihi',
            constraintType           : 'Kısıtlama türü',
            daysPerMonth             : 'Ay başına gün',
            daysPerWeek              : 'Hafta başına gün',
            delayFromParent          : 'Ebeveynden gecikme',
            direction                : 'Yön',
            drawDependencies         : 'Bağımlılıkları çiz',
            duration                 : 'Süre',
            durationUnit             : 'Süre birimi',
            effort                   : 'Çaba',
            effortDriven             : 'Çaba odaklı',
            effortUnit               : 'Çaba birimi',
            endDate                  : 'Bitiş tarihi',
            eventColor               : 'Renk',
            eventId                  : 'Etkinlik ID',
            eventLayout              : 'Etkinlik düzeni',
            eventStyle               : 'Çubuk stili',
            exceptionDates           : 'İstisna tarihleri',
            fixed                    : 'Sabit',
            from                     : 'Başlangıç',
            fromSide                 : 'Başlangıç tarafı',
            hoursPerDay              : 'Gün başına saat',
            href                     : 'Bağlantı',
            iconCls                  : 'Simge',
            id                       : 'ID',
            ignoreResourceCalendar   : 'Kaynak takvimini yok say',
            ignoreTimeZone           : 'Saat dilimini yok say',
            image                    : 'Resim',
            imageUrl                 : "Resim URL'si",
            inactive                 : 'Pasif',
            intervals                : 'Aralıklar',
            lag                      : 'Gecikme',
            lagUnit                  : 'Gecikme birimi',
            lineStyle                : 'Çizgi stili',
            manuallyScheduled        : 'Manuel olarak planlanmış',
            milestoneWidth           : 'Kilometre taşı genişliği',
            name                     : 'Ad',
            note                     : 'Not',
            parentId                 : 'Üst ID',
            parentIndex              : 'Pozisyon',
            percentDone              : '% tamamlandı',
            postamble                : 'Son ek',
            preamble                 : 'Ön ek',
            readOnly                 : 'Salt okunur',
            recurrenceRule           : 'Tekrar kuralı',
            resourceId               : 'Kaynak ID',
            resourceMargin           : 'Kaynak boşluğu',
            rowHeight                : 'Satır yüksekliği',
            schedulingMode           : 'Planlama modu',
            segments                 : 'Segmentler',
            showAvatar               : 'Avatarı göster',
            showInTimeline           : 'Zaman çizelgesinde göster',
            startDate                : 'Başlangıç tarihi',
            stickyContents           : 'Yapışkan içerikler',
            strokeColor              : 'Çizgi rengi',
            style                    : 'Stil',
            target                   : 'Bağlantı hedefi',
            to                       : 'Bitiş',
            toSide                   : 'Bitiş tarafı',
            type                     : 'Tür',
            units                    : 'Birimler',
            unscheduled              : 'Planlanmamış',
            unspecifiedTimeIsWorking : 'Belirtilmemiş zaman çalışıyor',
            version                  : 'Versiyon'
        },
        intervals : {
            working    : 'Çalışıyor',
            nonWorking : 'Çalışmıyor',
            fromTo     : '{from} ile {to} arasında',
            recurring  : '{start} tarihinde başlayarak {end} tarihinde sona eriyor'
        },
        addEntity         : 'Eklendi {type} **{name}**',
        removeEntity      : 'Kaldırıldı {type} **{name}**',
        updateEntity      : 'Değiştirildi {type} **{name}**',
        moveEntity        : 'Taşındı {type} **{name}** buradan {from} buraya {to}',
        addDependency     : 'Bağlantı buradan eklendi **{from}** buraya **{to}**',
        removeDependency  : 'Bağlantı buradan kaldırıldı **{from}** buraya **{to}**',
        updateDependency  : 'Bağlantı buradan düzenlendi **{from}** buraya **{to}**',
        addAssignment     : 'Atandı **{resource}** buraya **{event}**',
        removeAssignment  : 'Ataması kaldırıldı **{resource}** buraya **{event}**',
        updateAssignment  : 'Ataması düzenlendi **{resource}** buraya **{event}**',
        noChanges         : 'Değişiklik yok',
        nullValue         : 'yok',
        versionDateFormat : 'M/D/YYYY h:mm a',
        savedAt           : '{date} tarihinde kaydedildi',
        autoSavedAt       : '{date} tarihinde otomatik kaydedildi',
        undid             : 'Değişiklikleri geri aldı',
        redid             : 'Değişiklikleri yendien yaptı',
        editedTask        : 'Görev özelliklerini düzenledi',
        deletedTask       : 'Bir görevi sildi',
        movedTask         : 'Bir görevi taşıdı',
        movedTasks        : 'Görevler taşındı'
    }
};

export default LocaleHelper.publishLocale(locale);
