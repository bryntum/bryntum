import LocaleHelper from './LocaleHelper.js';

const locale = {

    localeName : 'Tr',
    localeDesc : 'Türkçe',
    localeCode : 'tr',
    localeRtl  : false,

    Object : {
        Yes      : 'Evet',
        No       : 'Hayır',
        Cancel   : 'İptal et',
        Ok       : 'Tamam',
        Week     : 'Hafta',
        None     : 'Hiçbiri',
        previous : 'Önceki',
        next     : 'Sonraki',
        to       : 'kadar',
        at       : 'de',
        on       : 'üzerinde',
        editing  : what => `${what} düzenleniyor`,
        settings : 'Ayarlar',
        close    : 'Kapat',
        go       : 'Git',
        save     : 'Kaydet',
        cancel   : 'İptal et',
        revert   : 'Geri al',
        collapse : 'Daralt',
        expand   : 'Genişlet',
        today    : 'Bugün',
        andNMore : n => `ve ${n} daha`
    },

    AIBase : {
        delayStatusTexts : [
            'Bekleniyor',
            'Bekleniyor ...',
            'Hala bekleniyor',
            'Hala bekleniyor ...'
        ],
        autoStartDialogMessage        : 'AI ses aktivasyonunu etkinleştirmek istiyor musunuz?',
        voiceActivationToast          : phrase => `Sesli aktivasyon etkinleştirildi, bir konuşma başlatmak için "${phrase}" ifadesini kullanın`,
        voiceControlNotSupportedToast : 'Sesli kontrol bu cihazda desteklenmiyor',
        voiceControlErrorToast        : 'Sesli kontrol cihazınızda başlatılamadı',
        voiceControlSilenceToast      : phrase => `AI sesli konuşma sessizlik nedeniyle sona erdi. Konuşmayı yeniden başlatmak için ${phrase} ifadesini kullanın`,
        noAudioDetected               : 'Ses algılanmadı, lütfen tekrar deneyin',
        transcriptionErrorToast       : 'Transkripsiyon başarısız oldu, lütfen tekrar deneyin',
        playbackErrorToast            : 'Ses oynatma başarısız oldu, lütfen ses çıkış cihazınızı kontrol edin',
        failed                        : '(başarısız)',
        awaitingConfirmation          : 'Onay bekleniyor',
        timeoutToast                  : 'Mesaj zaman aşımına uğradı',
        readingStatusText             : modelName => `${modelName}ler okunuyor`,
        updatingStatusText            : modelName => `${modelName}ler güncelleniyor`,
        removingStatusText            : modelName => `${modelName}ler kaldırılıyor`,
        addingStatusText              : modelName => `${modelName} ekleniyor`,
        filteringStatusText           : modelName => `${modelName}ler filtreleniyor`,
        thinkingStatusText            : 'Düşünüyor',
        processingStatusText          : 'İşleniyor'
    },

    AISettingsPanel : {
        highlight               : 'Vurgula',
        verbosity               : 'Ayrıntı Seviyesi',
        voiceActivation         : 'Ses Aktivasyonu',
        enableVoiceActivation   : 'Ses Aktivasyonunu Etkinleştir',
        voiceOnly               : 'Sadece Ses',
        autostart               : 'Otomatik Başlat',
        dataChangeConfirmations : 'Veri Değişikliği Onayı',
        add                     : 'Ekle',
        remove                  : 'Kaldır',
        update                  : 'Güncelle',
        planning                : 'Planlama',
        enablePlanning          : 'Planlamayı etkinleştir',
        aiModel                 : 'Yapay Zeka Modeli',
        timeline                : 'Zaman Çizelgesi',
        'in-view'               : 'Görünümde',
        all                     : 'Tümü',
        timeRangeContext        : 'Zaman aralığı bağlamı'
    },

    ChatButton : {
        tooltipPartSeparator  : ' - ',
        speakingTooltip       : 'AI konuşuyor',
        recordingTooltip      : 'Kaydediliyor',
        waitingTooltip        : 'AI düşünüyor',
        startRecordingTooltip : 'Başlatmak için tıklayın',
        stopRecordingTooltip  : 'Durdurmak için tıklayın',
        inactiveTooltip       : 'Kaydedilmiyor',
        openChatTooltip       : 'Sohbeti açmak için sağ tıklayın'
    },

    ChatPanel : {
        messageFieldPlaceholder : 'Bir mesaj yazın',
        noConnectionTooltip     : 'Bağlantı algılanmadı, tekrar denemek için tıklayın',
        undone                  : 'geri alındı',
        aborted                 : '(iptal edildi)',
        readAloudTooltip        : 'Mesajı sesli oku',
        confidenceTooltip       : confidence => `Güven: ${confidence}%`,
        undoTooltip             : 'Veri değişikliklerini geri al',
        redoTooltip             : 'Veri değişikliklerini yeniden yap',
        thumbsUp                : 'Beğen',
        thumbsDown              : 'Beğenme',
        feedbackToast           : 'Geri bildiriminiz için teşekkürler!',
        clearChat               : 'Sohbeti Temizle',
        closeChat               : 'Sohbeti kapat',
        settings                : 'Ayarlar',
        closeSettings           : 'Ayarları Kapat'
    },

    CheckboxGroup : {
        wrongNbrOfOptionsSelected : min => `Tam olarak ${min} seçin`,
        tooFewOptionsSelected     : min => `En az ${min} seçin`,
        tooManyOptionsSelected    : max => `En fazla ${max} seçin`
    },

    CodeEditor : {
        apply        : 'Uygula',
        autoApply    : 'Otomatik uygula',
        downloadCode : 'Kodu İndir'
    },

    ColorPicker : {
        noColor : 'Renk yok'
    },

    Combo : {
        noResults          : 'Sonuç bulunamadı',
        recordNotCommitted : 'Kayıt eklenemedi',
        addNewValue        : value => `${value} ekle`
    },

    ConfirmationDialog : {
        highlight       : 'Vurgula',
        preview         : 'Önizleme',
        approve         : 'Onayla',
        reject          : 'Reddet',
        confirmAdd      : 'Ekleme onayı:',
        confirmUpdate   : 'Güncelleme onayı:',
        confirmRemove   : 'Kaldırma onayı:',
        confirmCopy     : 'Kopyalama onayı',
        confirmAssign   : 'Atama onayı',
        confirmReassign : 'Yeniden atama onayı',
        confirmUnassign : 'Atamayı kaldırma onayı',
        confirmLink     : 'Bağlantıyı onayla',
        confirmUnlink   : 'Bağlantıyı kaldırmayı onayla'
    },

    FilePicker : {
        file : 'Dosya'
    },

    Field : {
        badInput              : 'Geçersiz alan değeri',
        patternMismatch       : 'Değer, belirli bir düzenle eşleşmelidir',
        rangeOverflow         : value => `Değer, şundan küçük veya şuna eşit olmalıdır ${value.max}`,
        rangeUnderflow        : value => `Değer, şundan büyük veya şuna eşit olmalıdır ${value.min}`,
        stepMismatch          : 'Değer adıma uymalı',
        tooLong               : 'Değer daha kısa olmalı',
        tooShort              : 'Değer daha uzun olmalı',
        typeMismatch          : 'Değerin özel bir biçimde olması gerekmektedir',
        valueMissing          : 'Bu değer zorunludur',
        invalidValue          : 'Geçersiz alan değeri',
        minimumValueViolation : 'Minimum değer ihlali',
        maximumValueViolation : 'Maksimum değer ihlali',
        fieldRequired         : 'Bu alan zorunludur',
        validateFilter        : 'Değer listeden seçilmelidir'
    },

    DateField : {
        invalidDate : format => 'Geçersiz tarih girişi, beklenen format ' + format
    },

    DatePicker : {
        gotoPrevYear  : 'Önceki yıla git',
        gotoPrevMonth : 'Önceki aya git',
        gotoNextMonth : 'Sonraki aya git',
        gotoNextYear  : 'Sonraki yıla git',
        navigation    : 'Tarih seçici navigasyonu'
    },

    Hint : {
        dontShowAgain : 'Tekrar gösterme'
    },

    NumberFormat : {
        locale   : 'tr',
        currency : 'TRY'
    },

    DurationField : {
        invalidUnit : 'Geçersiz birim'
    },

    TimeField : {
        invalidTime : 'Geçersiz zaman girişi'
    },

    TimePicker : {
        hour   : 'Saat',
        minute : 'Dakika',
        second : 'Saniye'
    },

    Tooltip : {
        loading : 'Yükleniyor...'
    },

    List : {
        loading   : 'Yükleniyor...',
        selectAll : 'Tümünü Seç'
    },

    GridBase : {
        loadMask : 'Yükleniyor...',
        syncMask : 'Değişiklikler eşzamanlanıyor, lütfen bekleyin...'
    },

    PagingToolbar : {
        firstPage         : 'İlk sayfaya git',
        prevPage          : 'Önceki sayfaya git',
        page              : 'Sayfa',
        nextPage          : 'Sonraki sayfaya git',
        lastPage          : 'Son sayfaya git',
        reload            : 'Sayfayı yeniden yükle',
        noRecords         : 'Gösterilecek kayıt bulunamadı',
        pageCountTemplate : data => `nın ${data.lastPage}`,
        summaryTemplate   : data => `Kayıtlar görüntüleniyor ${data.start} - ${data.end} ‘nın ${data.allCount}`
    },

    Popup : {
        close    : 'Açılır pencereyi kapat',
        maximize : 'Maksimize Et'
    },

    Splitter : {
        ariaLabel      : 'Bölücü, komşu panelleri yeniden boyutlandırmak için ok tuşlarını kullanın',
        collapseLeft   : 'Sol paneli daralt',
        collapseRight  : 'Sağ paneli daralt',
        collapseTop    : 'Üst paneli daralt',
        collapseBottom : 'Alt paneli daralt',
        expandLeft     : 'Sol paneli genişlet',
        expandRight    : 'Sağ paneli genişlet',
        expandTop      : 'Üst paneli genişlet',
        expandBottom   : 'Alt paneli genişlet'
    },

    TabPanel : {
        containsInvalidFields : 'Sekme geçersiz alanlar içeriyor'
    },

    Toolbar : {
        showOverflowingItems : 'Taşan öğeleri göster',
        scrollForMore        : 'Daha fazlası için kaydır'
    },

    UndoRedo : {
        Undo           : 'Geri al',
        Redo           : 'Yinele',
        UndoLastAction : 'Son eylemi geri al',
        RedoLastAction : 'Son geri alınan eylemi yinele',
        NoActions      : 'Geri alma kuyruğunda öğe yok'
    },

    FieldFilterPicker : {
        equals                 : 'eşittir',
        doesNotEqual           : 'eşit değildir',
        isEmpty                : 'boş',
        isNotEmpty             : 'boş değil',
        contains               : 'içerir',
        doesNotContain         : 'içermez',
        startsWith             : 'ile başlar',
        endsWith               : 'ile biter',
        isOneOf                : 'onlardan biri',
        isNotOneOf             : 'onlardan biri değil',
        isGreaterThan          : 'büyüktür',
        isLessThan             : 'küçüktür',
        isGreaterThanOrEqualTo : 'büyük ya da eşittir',
        isLessThanOrEqualTo    : 'küçük ya da eşittir',
        isBetween              : 'arasındadır',
        isNotBetween           : 'arasında değildir',
        isBefore               : 'öncedir',
        isAfter                : 'sonradır',
        timeEquals             : 'zaman eşittir',
        timeDoesNotEqual       : 'zaman eşit değildir',
        isToday                : 'bugündür',
        isTomorrow             : 'yarındır',
        isYesterday            : 'dündür',
        isThisWeek             : 'bu haftadır',
        isNextWeek             : 'gelecek haftadır',
        isLastWeek             : 'geçen haftadır',
        isThisMonth            : 'bu aydır',
        isNextMonth            : 'gelecek aydır',
        isLastMonth            : 'geçen aydır',
        isThisYear             : 'bu yıldır',
        isNextYear             : 'gelecek yıldır',
        isLastYear             : 'geçen yıldır',
        isYearToDate           : 'yıl başından günümüze kadardır',
        isTrue                 : 'doğrudur',
        isFalse                : 'yanlıştır',
        selectAProperty        : 'Bir özellik seçin',
        selectAnOperator       : 'Bir işleç seçin',
        caseSensitive          : 'Büyük küçük harf duyarlı',
        and                    : 've',
        dateFormat             : 'D/M/YY',
        selectValue            : 'Bir değer seçin',
        selectOneOrMoreValues  : 'Bir ya da daha fazla değer seçin',
        enterAValue            : 'Bir değer girin',
        enterANumber           : 'Bir sayı girin',
        selectADate            : 'Bir tarih seçin',
        selectATime            : 'Saat seç'
    },

    FieldFilterPickerGroup : {
        addFilter : 'Filtre ekle',
        applyCond : applied => applied ? 'Filtreyi atla (şu anda uygulanıyor)' : 'Filtreyi uygula (şu anda atlandı)'
    },

    DateHelper : {
        locale         : 'tr',
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
            { single : 'milisaniye', plural : 'ms', abbrev : 'ms' },
            { single : 'emillisecond', plural : 'ems', abbrev : 'ems' },
            { single : 'saniye', plural : 'saniye', abbrev : 'sn' },
            { single : 'esecond', plural : 'eseconds', abbrev : 'es' },
            { single : 'dakika', plural : 'dakika', abbrev : 'dak.' },
            { single : 'eminute', plural : 'eminutes', abbrev : 'emin' },
            { single : 'saat', plural : 'saat', abbrev : 'sa' },
            { single : 'ehour', plural : 'ehours', abbrev : 'eh' },
            { single : 'gün', plural : 'gün', abbrev : 'gün' },
            { single : 'eday', plural : 'edays', abbrev : 'ed' },
            { single : 'hafta', plural : 'hafta', abbrev : 'hafta' },
            { single : 'eweek', plural : 'eweeks', abbrev : 'ew' },
            { single : 'ay', plural : 'ay', abbrev : 'ay' },
            { single : 'emonth', plural : 'emonths', abbrev : 'emon' },
            { single : 'mevsim', plural : 'mevsim', abbrev : 'mevsim' },
            { single : 'equarter', plural : 'equarters', abbrev : 'eq' },
            { single : 'yıl', plural : 'yıl', abbrev : 'yıl' },
            { single : 'eyear', plural : 'eyears', abbrev : 'eyr' },
            { single : 'onyıl', plural : 'onyıl', abbrev : 'onyıl' },
            { single : 'edecade', plural : 'edecades', abbrev : 'edec' }
        ],
        unitAbbreviations : [
            ['ms'],
            [],
            ['sn', 'sn'],
            [],
            ['d', 'dak'],
            [],
            ['s', 'sa'],
            [],
            ['gün'],
            [],
            ['hft', 'hafta'],
            [],
            ['ay', 'ay'],
            [],
            ['mev', 'mevsim'],
            [],
            ['y', 'yıl'],
            [],
            ['onyıl'],
            []
        ],
        parsers : {
            L   : 'DD.MM.YYYY',
            LT  : 'HH:mm',
            LTS : 'HH:mm:ss A'
        },
        ordinalSuffix : number => {
            const suffix = { 1 : '-inci' }[number] || '.';
            return number + suffix;
        },
        decade : date => {
            const year = typeof date === 'number' ? date : date.getFullYear();
            return `${year - (year % 10)}'ler`;
        }
    }
};

export default LocaleHelper.publishLocale(locale);
