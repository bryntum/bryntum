import WidgetTag from '../../Core/customElements/WidgetTag.js';

/**
 * @module Scheduler/customElements/TimelineBaseTag
 */

/**
 * Abstract base class for {@link Scheduler.customElements.SchedulerTag} and GanttTag.
 * Parses child `<column>`, `<resource>`, `<event>`, `<assignment>`, and `<dependency>` HTML elements
 * into the configuration objects expected by the timeline component.
 *
 * ## See also
 *
 * - {@link Scheduler.customElements.SchedulerTag} - the `<bryntum-scheduler>` custom element
 * - {@link Core.customElements.WidgetTag} - base custom-element infrastructure
 *
 * @extends Core/customElements/WidgetTag
 * @abstract
 * @skip-is-property
 */

export default class TimelineBaseTag extends WidgetTag {
    static $name = 'TimelineBaseTag';

    createInstance(config) {
        const
            me           = this,
            columns      = [],
            resources    = [],
            events       = [],
            assignments  = [],
            dependencies = [];

        // create columns and data
        for (const tag of me.children) {
            if (tag.tagName === 'COLUMN') {
                const columnConfig = Object.assign({}, tag.dataset);

                // if the column title is provide as the tag text
                if (!columnConfig.text && tag.innerHTML) {
                    columnConfig.text = tag.innerHTML;
                }

                if (columnConfig.width) {
                    columnConfig.width = parseInt(columnConfig.width);
                }

                if (columnConfig.flex) {
                    columnConfig.flex = parseInt(columnConfig.flex);
                }
                else if (!columnConfig.width) {
                    columnConfig.flex = 1;
                }

                columns.push(columnConfig);
            }
            else if (tag.tagName === 'DATA') {
                for (const storeType of tag.children) {
                    for (const record of storeType.children) {
                        const { tagName } = storeType;

                        let collection;

                        if (tagName === 'EVENTS' || tagName === 'TASKS') {
                            collection = events;
                        }
                        else if (tagName === 'RESOURCES') {
                            collection = resources;
                        }
                        else if (tagName === 'DEPENDENCIES') {
                            collection = dependencies;
                        }
                        else if (tagName === 'ASSIGNMENTS') {
                            collection = assignments;
                        }

                        me.processRecord(record, collection);
                    }
                }
            }
            else if (tag.tagName === 'PROJECT') {
                config.project = new me.projectModelClass({
                    autoLoad  : true,
                    transport : {
                        load : {
                            url : tag.dataset.loadUrl
                        }
                    }
                });
            }
        }

        if (columns.length) {
            config.columns = columns;
        }

        // Gantt gets mad if both project and inline data is supplied
        if (events.length) {
            config.events = events;
        }

        if (resources.length) {
            config.resources = resources;
        }

        if (dependencies.length) {
            config.dependencies = dependencies;
        }

        return new this.widgetClass(config);
    }

    processRecord(recordTag, output) {
        const row = {};

        Object.assign(row, this.convertDatasetToConfigs(recordTag.dataset, {}, true));

        if (recordTag.children.length) {
            row.children = [];
            for (const child of recordTag.children) {
                this.processRecord(child, row.children);
            }
        }

        output.push(row);
    }
}
