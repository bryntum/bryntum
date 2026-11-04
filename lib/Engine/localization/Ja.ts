import LocaleHelper from '../../Core/localization/LocaleHelper.js'

const locale = {

    localeName : 'Ja',
    localeDesc : '日本語',
    localeCode : 'ja',
    localeRtl  : false,

    RemoveDependencyCycleEffectResolution : {
        descriptionTpl : '依存関係を削除する'
    },

    DeactivateDependencyCycleEffectResolution : {
        descriptionTpl : '依存関係を無効にする'
    },

    CycleEffectDescription : {
        descriptionTpl : 'サイクルが発見されました。サイクルを形成するのは:{0}'
    },

    EmptyCalendarEffectDescription : {
        descriptionTpl               : '「{2}」タスクは実行できません。 「{0}」カレンダーは、作業時間間隔を提供しません。',
        forwardDescriptionTpl        : '「{2}」タスクは実行できません。 「{0}」カレンダーには、{1}の後の作業時間はありません。',
        backwardDescriptionTpl       : '「{2}」タスクは実行できません。 「{0}」カレンダーには、{1}の前に作業時間がありません。',
        noIntersectionDescriptionTpl : '「{2}」タスクは実行できません。その「{0}」カレンダーとそのリソースカレンダーには、共通の作業時間がありません。'
    },

    Use24hrsEmptyCalendarEffectResolution : {
        descriptionTpl : '土日休みの24時間の日程表を使ってください。'
    },

    Use8hrsEmptyCalendarEffectResolution : {
        descriptionTpl : '土日休みの8時間の日程表（08:00-12:00、13:00-17:00）を使ってください。'
    },

    IgnoreProjectConstraintResolution : {
        descriptionTpl : 'プロジェクトの境界線を無視し、変更を進めます。'
    },

    ProjectConstraintConflictEffectDescription : {
        startDescriptionTpl : '{1}を開始するために「{0}」タスクを移動しました。これは、プロジェクト開始日{2}の前です。',
        endDescriptionTpl   : '「{0}」タスクを動かして{1}を終了しました。これは、プロジェクトの終了日{2}の後です。'
    },

    HonorProjectConstraintResolution : {
        descriptionTpl : 'プロジェクトの国境を称えるには、タスクを調整します。'
    },

    IgnoreResourceCalendarEmptyCalendarEffectResolution : {
        descriptionTpl : 'リソースカレンダーを無視し、独自のカレンダーのみでタスクをスケジュールします。'
    },

    ConflictEffectDescription : {
        descriptionTpl : 'スケジュール上の矛盾が発見されました：{0}が{1}と矛盾しています。'
    },

    ConstraintIntervalDescription : {
        dateFormat : 'LLL'
    },

    ProjectConstraintIntervalDescription : {
        startDateDescriptionTpl : 'プロジェクト開始日{0}',
        endDateDescriptionTpl   : 'プロジェクト終了日{0}'
    },

    DependencyType : {
        long : [
            '開始 – 開始',
            '開始 – 終了',
            '終了 – 開始',
            '終了 – 終了'
        ]
    },

    ManuallyScheduledParentConstraintIntervalDescription : {
        startDescriptionTpl : '手動スケジュール"{2}"は、その子が{0}以降に開始することを強制します',
        endDescriptionTpl   : '手動スケジュール"{2}"は、その子が{1}までに終了することを強制します'
    },

    DisableManuallyScheduledConflictResolution : {
        descriptionTpl : '"{0}"の手動スケジューリングを無効にする'
    },

    DependencyConstraintIntervalDescription : {
        descriptionTpl : '"{3}"から"{4}"までの依存関係({2})'
    },

    RemoveDependencyResolution : {
        descriptionTpl : '"{1}"から"{2}"までの依存関係を削除する'
    },

    DeactivateDependencyResolution : {
        descriptionTpl : '"{1}"から"{2}"までの依存関係を無効にする'
    },

    DateConstraintIntervalDescription : {
        startDateDescriptionTpl : 'タスク"{2}" {3} {0} 制約',
        endDateDescriptionTpl   : 'タスク"{2}" {3} {1} 制約',
        constraintTypeTpl       : {
            startnoearlierthan  : '指定日以降に開始',
            finishnoearlierthan : '指定日以降に終了',
            muststarton         : '指定日に開始',
            mustfinishon        : '指定日に終了',
            startnolaterthan    : '指定日までに開始',
            finishnolaterthan   : '指定日までに終了'
        }
    },

    RemoveDateConstraintConflictResolution : {
        descriptionTpl : 'タスク"{0}"の制約"{1}"を削除する'
    },

    PostponeDateConstraintConflictResolution : {
        descriptionTpl : '解決を延期し、タスク "{0}" に競合マーカーを付けてフラグを立てます'
    }
}

export default LocaleHelper.publishLocale(locale)
