import LocaleHelper from './LocaleHelper.js';

const locale = {

    localeName : 'PtBr',
    localeDesc : 'Português do Brasil',
    localeCode : 'pt-BR',
    localeRtl  : false,

    Object : {
        Yes      : 'Sim',
        No       : 'Não',
        Cancel   : 'Cancelar',
        Ok       : 'OK',
        Week     : 'Semana',
        None     : 'Nenhum',
        previous : 'Anterior',
        next     : 'Próximo',
        to       : 'a',
        at       : 'às',
        on       : 'em',
        editing  : what => `Editando ${what}`,
        settings : 'Configurações',
        close    : 'Fechar',
        go       : 'Ir',
        save     : 'Salvar',
        cancel   : 'Cancelar',
        revert   : 'Restaurar',
        collapse : 'Fechar',
        expand   : 'Expandir',
        today    : 'Hoje',
        andNMore : n => `e mais ${n}`
    },

    AIBase : {
        delayStatusTexts : [
            'Aguardando',
            'Aguardando ...',
            'Ainda aguardando',
            'Ainda aguardando ...'
        ],
        autoStartDialogMessage        : 'Você deseja ativar a ativação por voz da IA?',
        voiceActivationToast          : phrase => `Ativação por voz habilitada, use a frase "${phrase}" para iniciar uma conversa`,
        voiceControlNotSupportedToast : 'Controle por voz não é suportado neste dispositivo',
        voiceControlErrorToast        : 'O controle por voz não pôde ser iniciado em seu dispositivo',
        voiceControlSilenceToast      : phrase => `Conversa por voz da IA encerrada devido ao silêncio. Use a frase ${phrase} para reiniciar a conversa`,
        noAudioDetected               : 'Nenhum áudio detectado, por favor tente novamente',
        transcriptionErrorToast       : 'Falha na transcrição, tente novamente',
        playbackErrorToast            : 'Falha na reprodução de áudio, verifique seu dispositivo de saída de áudio',
        failed                        : '(falhou)',
        awaitingConfirmation          : 'Aguardando confirmação',
        timeoutToast                  : 'Mensagem expirou',
        readingStatusText             : modelName => `Lendo ${modelName}s`,
        updatingStatusText            : modelName => `Atualizando ${modelName}s`,
        removingStatusText            : modelName => `Removendo ${modelName}s`,
        addingStatusText              : modelName => `Adicionando ${modelName}`,
        filteringStatusText           : modelName => `Filtrando ${modelName}s`,
        thinkingStatusText            : 'Pensando',
        processingStatusText          : 'Processando'
    },

    AISettingsPanel : {
        highlight               : 'Destacar',
        verbosity               : 'Verbosidade',
        voiceActivation         : 'Ativação por Voz',
        enableVoiceActivation   : 'Ativar Ativação por Voz',
        voiceOnly               : 'Somente Voz',
        autostart               : 'Início Automático',
        dataChangeConfirmations : 'Confirmação de Alteração de Dados',
        add                     : 'Adicionar',
        remove                  : 'Remover',
        update                  : 'Atualizar',
        planning                : 'Planejamento',
        enablePlanning          : 'Ativar planejamento',
        aiModel                 : 'Modelo de IA',
        timeline                : 'Linha do tempo',
        'in-view'               : 'Em exibição',
        all                     : 'Todos',
        timeRangeContext        : 'Contexto do intervalo de tempo'
    },

    ChatButton : {
        tooltipPartSeparator  : ' - ',
        speakingTooltip       : 'A IA está falando',
        recordingTooltip      : 'Gravando',
        waitingTooltip        : 'IA pensando',
        startRecordingTooltip : 'Clique para iniciar',
        stopRecordingTooltip  : 'Clique para parar',
        inactiveTooltip       : 'Não está gravando',
        openChatTooltip       : 'Clique com o botão direito para abrir o chat'
    },

    ChatPanel : {
        messageFieldPlaceholder : 'Digite uma mensagem',
        noConnectionTooltip     : 'Nenhuma conexão detectada, clique para tentar novamente',
        undone                  : 'desfeito',
        aborted                 : '(abortado)',
        readAloudTooltip        : 'Ler mensagem em voz alta',
        confidenceTooltip       : confidence => `Confiança: ${confidence}%`,
        undoTooltip             : 'Desfazer alterações de dados',
        redoTooltip             : 'Refazer alterações de dados',
        thumbsUp                : 'Curtir',
        thumbsDown              : 'Não curtir',
        feedbackToast           : 'Obrigado pelo seu feedback!',
        clearChat               : 'Limpar chat',
        closeChat               : 'Fechar chat',
        settings                : 'Configurações',
        closeSettings           : 'Fechar configurações'
    },

    CheckboxGroup : {
        wrongNbrOfOptionsSelected : min => `Selecione exatamente ${min}`,
        tooFewOptionsSelected     : min => `Selecione pelo menos ${min}`,
        tooManyOptionsSelected    : max => `Selecione no máximo ${max}`
    },

    CodeEditor : {
        apply        : 'Aplicar',
        autoApply    : 'Aplicar automaticamente',
        downloadCode : 'Baixar código'
    },

    ColorPicker : {
        noColor : 'Sem cor'
    },

    Combo : {
        noResults          : 'Sem resultados',
        recordNotCommitted : 'Não foi possível adicionar o registo',
        addNewValue        : value => `Adicionar ${value}`
    },

    ConfirmationDialog : {
        highlight       : 'Destacar',
        preview         : 'Pré-visualizar',
        approve         : 'Aprovar',
        reject          : 'Rejeitar',
        confirmAdd      : 'Confirmar adição:',
        confirmUpdate   : 'Confirmar atualização:',
        confirmRemove   : 'Confirmar remoção:',
        confirmCopy     : 'Confirmar cópia',
        confirmAssign   : 'Confirmar atribuição',
        confirmReassign : 'Confirmar reatribuição',
        confirmUnassign : 'Confirmar desatribuição',
        confirmLink     : 'Confirmar link',
        confirmUnlink   : 'Confirmar desvinculação'
    },

    FilePicker : {
        file : 'Arquivo'
    },

    Field : {
        badInput              : 'Valor de campo inválido',
        patternMismatch       : 'O valor deve corresponder a um padrão específico',
        rangeOverflow         : value => `O valor deve ser inferior ou igual a ${value.max}`,
        rangeUnderflow        : value => `O valor deve ser superior ou igual a ${value.min}`,
        stepMismatch          : 'O valor deve corresponder ao passo',
        tooLong               : 'O valor deve ser mais curto',
        tooShort              : 'O valor deve ser mais comprido',
        typeMismatch          : 'O valor deve estar num formato especial',
        valueMissing          : 'Este campo é obrigatório',
        invalidValue          : 'Valor de campo inválido',
        minimumValueViolation : 'Erro de valor mínimo',
        maximumValueViolation : 'Erro de valor máximo',
        fieldRequired         : 'Este campo é obrigatório',
        validateFilter        : 'O valor deve ser selecionado a partir da lista'
    },

    DateField : {
        invalidDate : format => 'Entrada de data inválida, o formato esperado é ' + format
    },

    DatePicker : {
        gotoPrevYear  : 'Ir para o ano anterior',
        gotoPrevMonth : 'Ir para o mês anterior',
        gotoNextMonth : 'Ir para o mês seguinte',
        gotoNextYear  : 'Ir para o ano seguinte',
        navigation    : 'Navegação do seletor de data'
    },

    Hint : {
        dontShowAgain : 'Não mostrar novamente'
    },

    NumberFormat : {
        locale   : 'pt-BR',
        currency : 'BRL'
    },

    DurationField : {
        invalidUnit : 'Unidade inválida'
    },

    TimeField : {
        invalidTime : 'Hora inválida'
    },

    TimePicker : {
        hour   : 'Hora',
        minute : 'Minuto',
        second : 'Segundo'
    },

    Tooltip : {
        loading : 'Carregando...'
    },

    List : {
        loading   : 'Carregando...',
        selectAll : 'Selecionar Todos'
    },

    GridBase : {
        loadMask : 'Carregando...',
        syncMask : 'Salvando alterações, aguarde...'
    },

    PagingToolbar : {
        firstPage         : 'Ir para a primeira página',
        prevPage          : 'Ir para a página anterior',
        page              : 'Página',
        nextPage          : 'Ir para a página seguinte',
        lastPage          : 'Ir para a última página',
        reload            : 'Recarregar página atual',
        noRecords         : 'Sem registos',
        pageCountTemplate : data => `de ${data.lastPage}`,
        summaryTemplate   : data => `Mostrando registos ${data.start} - ${data.end} até ${data.allCount}`
    },

    Popup : {
        close    : 'Fechar mensagem pop-up',
        maximize : 'Maximizar'
    },

    Splitter : {
        ariaLabel      : 'Divisor, use as teclas de seta para redimensionar os painéis vizinhos',
        collapseLeft   : 'Recolher o painel esquerdo',
        collapseRight  : 'Recolher o painel direito',
        collapseTop    : 'Recolher o painel superior',
        collapseBottom : 'Recolher o painel inferior',
        expandLeft     : 'Expandir o painel esquerdo',
        expandRight    : 'Expandir o painel direito',
        expandTop      : 'Expandir o painel superior',
        expandBottom   : 'Expandir o painel inferior'
    },

    TabPanel : {
        containsInvalidFields : 'A aba contém campos inválidos'
    },

    Toolbar : {
        showOverflowingItems : 'Mostrar itens transbordantes',
        scrollForMore        : 'Role para mais'
    },

    UndoRedo : {
        Undo           : 'Desfazer',
        Redo           : 'Refazer',
        UndoLastAction : 'Desfazer a última ação',
        RedoLastAction : 'Refazer a última ação',
        NoActions      : 'Não existem itens na fila de ações'
    },

    FieldFilterPicker : {
        equals                 : 'igual a',
        doesNotEqual           : 'não é igual a',
        isEmpty                : 'está vazio',
        isNotEmpty             : 'não está vazio',
        contains               : 'contém',
        doesNotContain         : 'não contém',
        startsWith             : 'começa por',
        endsWith               : 'termina por',
        isOneOf                : 'é um de',
        isNotOneOf             : 'não é um de',
        isGreaterThan          : 'é maior do que',
        isLessThan             : 'é menor do que',
        isGreaterThanOrEqualTo : 'é maior do que ou igual a',
        isLessThanOrEqualTo    : 'é menor do que ou igual a',
        isBetween              : 'está entre',
        isNotBetween           : 'não está entre',
        isBefore               : 'está antes de',
        isAfter                : 'está depois de',
        timeEquals             : 'o tempo é igual',
        timeDoesNotEqual       : 'o tempo não é igual',
        isToday                : 'é hoje',
        isTomorrow             : 'é amanhã',
        isYesterday            : 'é ontem',
        isThisWeek             : 'é esta semana',
        isNextWeek             : 'é a próxima semana',
        isLastWeek             : 'é a semana passada',
        isThisMonth            : 'é este mês',
        isNextMonth            : 'é o próximo mês',
        isLastMonth            : 'é o último mês',
        isThisYear             : 'é este ano',
        isNextYear             : 'é o próximo ano',
        isLastYear             : 'é o último ano',
        isYearToDate           : 'é o ano até à data',
        isTrue                 : 'é verdadeiro',
        isFalse                : 'é falso',
        selectAProperty        : 'Selecione uma propriedade',
        selectAnOperator       : 'Selecione um operador',
        caseSensitive          : 'Case-sensitive',
        and                    : 'e',
        dateFormat             : 'D/M/YY',
        selectValue            : 'Selecione valor',
        selectOneOrMoreValues  : 'Selecione um ou mais valores',
        enterAValue            : 'Digite um valor',
        enterANumber           : 'Digite um número',
        selectADate            : 'Selecione uma data',
        selectATime            : 'Selecione hora'
    },

    FieldFilterPickerGroup : {
        addFilter : 'Adicionar filtro',
        applyCond : applied => applied ? 'Pular filtro (atualmente aplicado)' : 'Aplicar filtro (atualmente ignorado)'
    },

    DateHelper : {
        locale         : 'pt-BR',
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
            { single : 'milissegundo', plural : 'ms', abbrev : 'ms' },
            { single : 'emillisecond', plural : 'ems', abbrev : 'ems' },
            { single : 'segundo', plural : 'segundos', abbrev : 's' },
            { single : 'esecond', plural : 'eseconds', abbrev : 'es' },
            { single : 'minuto', plural : 'minutos', abbrev : 'min' },
            { single : 'eminute', plural : 'eminutes', abbrev : 'emin' },
            { single : 'hora', plural : 'horas', abbrev : 'h' },
            { single : 'ehour', plural : 'ehours', abbrev : 'eh' },
            { single : 'dia', plural : 'dias', abbrev : 'd' },
            { single : 'eday', plural : 'edays', abbrev : 'ed' },
            { single : 'semana', plural : 'semanas', abbrev : 'sem' },
            { single : 'eweek', plural : 'eweeks', abbrev : 'ew' },
            { single : 'mês', plural : 'meses', abbrev : 'mês' },
            { single : 'emonth', plural : 'emonths', abbrev : 'emon' },
            { single : 'trimestre', plural : 'trimestres', abbrev : 'trim' },
            { single : 'equarter', plural : 'equarters', abbrev : 'eq' },
            { single : 'ano', plural : 'anos', abbrev : 'a' },
            { single : 'eyear', plural : 'eyears', abbrev : 'eyr' },
            { single : 'década', plural : 'décadas', abbrev : 'dec' },
            { single : 'edecade', plural : 'edecades', abbrev : 'edec' }
        ],
        unitAbbreviations : [
            ['mil'],
            [],
            ['s', 'seg'],
            [],
            ['m', 'min'],
            [],
            ['h', 'hr'],
            [],
            ['d'],
            [],
            ['sem', 'seman'],
            [],
            ['m', 'mês', 'mes'],
            [],
            ['t', 'trim', 'trmt'],
            [],
            ['a', 'ano'],
            [],
            ['dec'],
            []
        ],
        parsers : {
            L   : 'DD/MM/YYYY',
            LT  : 'HH:mm',
            LTS : 'HH:mm:ss A'
        },
        ordinalSuffix : number => {
            return number + '°';
        },
        decade : date => {
            const year = typeof date === 'number' ? date : date.getFullYear();
            return `década de ${year - (year % 10)}`;
        }
    }
};

export default LocaleHelper.publishLocale(locale);
