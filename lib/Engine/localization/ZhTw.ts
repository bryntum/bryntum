import LocaleHelper from '../../Core/localization/LocaleHelper.js';

const locale = {

    localeName : 'ZhTw',
    localeDesc : '繁體中文 (台灣)',
    localeCode : 'zh-TW',
    localeRtl  : false,

    RemoveDependencyCycleEffectResolution : {
        descriptionTpl : '移除相依性'
    },

    DeactivateDependencyCycleEffectResolution : {
        descriptionTpl : '停用相依性'
    },

    CycleEffectDescription : {
        descriptionTpl : '發現一個週期, 由以下組成: {0}'
    },

    EmptyCalendarEffectDescription : {
        descriptionTpl               : '「{0}」行事曆未提供任何工作時間間隔。',
        forwardDescriptionTpl        : '无法执行“{2}”任务。 “{0}”日历在 {1} 之后没有工作时间。',
        backwardDescriptionTpl       : '无法执行“{2}”任务。 “{0}”日历在 {1} 之前没有工作时间。',
        noIntersectionDescriptionTpl : '无法执行“{2}”任务。其“{0}”日历及其资源日历没有共同的工作时间。'
    },

    Use24hrsEmptyCalendarEffectResolution : {
        descriptionTpl : '使用 24 小時行事曆，星期六與星期日不工作。'
    },

    Use8hrsEmptyCalendarEffectResolution : {
        descriptionTpl : '使用 8 小時行事曆 (08:00-12:00，13:00-17:00)，星期六與星期日不工作。'
    },

    IgnoreProjectConstraintResolution : {
        descriptionTpl : '忽略项目边界并继续进行更改。'
    },

    ProjectConstraintConflictEffectDescription : {
        startDescriptionTpl : '您已将“{0}”任务移至 {1} 开始。这是在项目开始日期 {2} 之前。',
        endDescriptionTpl   : '您将“{0}”任务移至 {1} 完成。这是在项目结束日期 {2} 之后。'
    },

    HonorProjectConstraintResolution : {
        descriptionTpl : '调整任务以遵守项目边界。'
    },

    IgnoreResourceCalendarEmptyCalendarEffectResolution : {
        descriptionTpl : '忽略资源日历并仅使用其自己的日历来安排任务。'
    },

    ConflictEffectDescription : {
        descriptionTpl : '發現一個行程衝突: {0}與{1}衝突'
    },

    ConstraintIntervalDescription : {
        dateFormat : 'LLL'
    },

    ProjectConstraintIntervalDescription : {
        startDateDescriptionTpl : '專案開始日期 {0}',
        endDateDescriptionTpl   : '專案結束日期 {0}'
    },

    DependencyType : {
        long : [
            '開始到開始',
            '開始到完成',
            '完成到開始',
            '完成到完成'
        ]
    },

    ManuallyScheduledParentConstraintIntervalDescription : {
        startDescriptionTpl : '手動排程 "{2}" 强迫兒童在 {0} 之前開始',
        endDescriptionTpl   : '手動排程 "{2}" 强迫兒童在 {1} 之前結束'
    },

    DisableManuallyScheduledConflictResolution : {
        descriptionTpl : '為 "{0}" 禁用手動排程'
    },

    DependencyConstraintIntervalDescription : {
        descriptionTpl : '相依性 ({2}) 從 "{3}" 到 "{4}"'
    },

    RemoveDependencyResolution : {
        descriptionTpl : '移除相依性從 "{1}" 到 "{2}"'
    },

    DeactivateDependencyResolution : {
        descriptionTpl : '停用相依性從 "{1}" 到 "{2}"'
    },

    DateConstraintIntervalDescription : {
        startDateDescriptionTpl : '任務 "{2}" {3} {0} 限制',
        endDateDescriptionTpl   : '任務 "{2}" {3} {1} 限制',
        constraintTypeTpl       : {
            startnoearlierthan  : '最早開始時間',
            finishnoearlierthan : '最早完成時間',
            muststarton         : '必須於下列時間開始',
            mustfinishon        : '必須於下列時間完成',
            startnolaterthan    : '最晚開始時間',
            finishnolaterthan   : '最晚完成時間'
        }
    },

    RemoveDateConstraintConflictResolution : {
        descriptionTpl : '移除 "{1}" 任務限制 "{0}"'
    },

    PostponeDateConstraintConflictResolution : {
        descriptionTpl : '延遲解決並使用衝突標記標記任務 "{0}"'
    }
}

export default LocaleHelper.publishLocale(locale);
