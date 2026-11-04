import LocaleHelper from '../../Core/localization/LocaleHelper.js';
import '../../Scheduler/localization/PtBr.js';

const locale = {

    localeName : 'PtBr',
    localeDesc : 'Português do Brasil',
    localeCode : 'pt-BR',
    localeRtl  : false,

    EventEdit : {
        Calendar  : 'Calendário',
        'All day' : 'Todo o dia',
        day       : 'Dia',
        week      : 'Semana',
        month     : 'Mês',
        year      : 'Ano',
        decade    : 'Década'
    },

    EventMenu : {
        duplicateEvent : 'Duplicar evento',
        copy           : 'copiar'
    },

    Calendar : {
        toggleSidebar : 'Alternar visibilidade da barra lateral',
        Today         : 'Hoje',
        Tomorrow      : 'Amanhã',
        next          : range => `Seguinte ${range}`,
        previous      : range => `Anterior ${range}`,
        plusMore      : value => `+${value} mais`,
        moreEvents    : value => `${value} mais eventos`,
        allDay        : 'Todo o dia',
        endsOn        : d => `Acaba em ${d}`,
        weekOfYear    : ([y, w]) => `Semana ${w}, ${y}`,
        loadFail      : 'Falha ao carregar dados do calendário. Contate o administrador do sistema',
        gotoDate      : 'Ir para a data',
        timeRange     : 'Intervalo de tempo',
        noResources   : 'Sem recursos',
        calendar      : 'Calendário',
        toolbar       : 'Barra de ferramentas do calendário',
        months        : 'Meses'
    },

    CalendarDrag : {
        holdCtrlForRecurrence : 'Segure continuamente CTRL para um evento recorrente'
    },

    CalendarMixin : {
        eventCount       : count => `${count || 'Sem'} evento${(count && count > 1) ? '' : 's'}`,
        allDayEventCount : count => `${count || 'Nenhum'} evento de dia inteiro${count === 1 ? '' : 's'}`
    },

    EventTip : {
        'Edit event' : 'Editar evento',
        timeFormat   : 'LST'
    },

    ModeSelector : {
        includeWeekends : 'Incluir finais-de-semana',
        weekends        : 'Finais-de-semana',
        switcherMenu    : 'Menu de alternância de visualização'
    },

    AgendaView : {
        Agenda : 'Agenda'
    },

    MonthView : {
        Month     : 'Mês',
        monthUnit : 'mês'
    },

    MultiWeekView : {
        multiWeek : 'Várias semanas'
    },

    WeekView : {
        weekUnit : 'semana'
    },

    YearView : {
        Year     : 'Ano',
        yearUnit : 'ano',
        noEvents : 'Sem eventos'
    },

    YearPlanner : {
        yearPlanner      : 'Planejador Anual',
        expandMonthRow   : 'Expandir linha do mês',
        collapseMonthRow : 'Recolher linha do mês'
    },

    EventList : {
        List   : 'Lista',
        Start  : 'Início',
        Finish : 'Fim',
        days   : count => `${count > 1 ? `${count} ` : ''}día${count === 1 ? '' : 's'}`
    },

    DayView : {
        Day                : 'Dia',
        dayUnit            : 'dia',
        daysUnit           : 'dias',
        expandAllDayRow    : 'Expandir a seção de todo o dia',
        collapseAllDayRow  : 'Fechar a seção de todo o dia',
        timeFormat         : 'LST',
        timeAxisTimeFormat : 'LST',
        noMatchingDates    : 'Nenhuma data correspondente'
    },

    DayAgendaView : {
        dayAgenda : 'Agenda do dia'
    },

    DayResourceView : {
        dayResourceView : 'Recursos diários'
    },

    MonthGrid : {
        monthGrid : 'Grade de mês'
    },

    Sidebar : {
        selectDate      : 'Selecionar data do calendário',
        matchEvents     : 'Eventos da partida',
        filterEvents    : 'Filtrar eventos pelo nome do evento',
        filterResources : 'Filtrar eventos pelo recurso selecionado'
    },

    WeekExpander : {
        expandTip   : 'Clique para expandir a fila',
        collapseTip : 'Clique para fechar a fila'
    },

    keyboardActions : {
        title   : 'Ações do teclado',
        content : 'Mostrar painel de ajuda : [?]\nBotão de seleção do modo de foco : [Home]\nAlterar visualização : [1] a [9] ou primeira letra do texto do botão seletor\nPróximo intervalo de tempo : [n]\nIntervalo de tempo anterior : [p]\nIr para hoje : [t]\nNavegar para a data : [g]\nIr para a célula do dia atual : [CTRL]+[d]\nNavegar entre eventos : [TAB]\nFocar na entrada do filtro de eventos da barra lateral : [/]\nCriar novo evento (focado na célula do dia) : [ENTER]\nExcluir evento focado : [DELETE]/[BACKSPACE]\nEditar o evento focado : [ENTER]\nInvocar menu de contexto no evento ou célula : [SHIFT+F10]/[SPACE]\nFocar do evento até a célula envolvente : [ESCAPE]\nNavegação de célula para célula : [TECLAS DE SETA]\nAtivar menu de intervalo (na visualização Agenda) : [CTRL]+[r]\nRecortar, copiar, colar eventos : [CTRL]+[x]/[c]/[v]\nAmpliar/reduzir apenas na visualização Dia : [+]/[-]'
    }
};

export default LocaleHelper.publishLocale(locale);
