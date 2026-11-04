import Widget from '../Widget.js';
import DomHelper from '../../helper/DomHelper.js';
import DomSync from '../../helper/DomSync.js';
import StringHelper from '../../helper/StringHelper.js';
import Tooltip from '../Tooltip.js';
import Objects from '../../helper/util/Objects.js';

DomHelper.loadStylesheet('Core/widget/graph/Histogram.css');

// import Stylesheet from './Histogram.css' with { type: 'css' };
// DomHelper.applyStylesheet(Stylesheet, 'Histogram');

/**
 * @module Core/widget/graph/Histogram
 */

const
    ns = 'http://www.w3.org/2000/svg',
    // Outline series must overlay bars
    typePrio = {
        bar     : 1,
        outline : 2,
        text    : 3
    },
    byOrder = (l, r) => parseInt(l.order, 10) - parseInt(r.order, 10),
    byDatasetOrder = (l, r) => parseInt(l.dataset.order, 10) - parseInt(r.dataset.order, 10),
    getField = s => s.field,
    isSeriesEnabled = s => s && !s.disabled,
    returnFalse = () => false,
    classesDelimiter = /\s+/;

/**
 * An object representing a series settings.
 *
 * @typedef {Object} HistogramSeries
 * @property {'bar'|'outline'|'text'} [type] The series type specifying how it is rendered (defaults to `'bar'`):
 *  - `'bar'` solid bars (default visual)
 *  - `'outline'` outline only
 *  - `'text'` text-only display (no bar). Used by histogram subclasses such as
 *    Scheduler's `ResourceUtilization` to render aggregated values as text.
 * @property {String} [field] The name of the property to read value from. By default, this matches the series
 * identifier.
 * @property {Boolean} [stretch=false] Provide `true` to stretch the series bars to take the whole vertical space
 * Applicable to `bar` type series only.
 * @property {'none'|'sum'|'avg'|String} [aggregate] Aggregation strategy used when building histogram data for
 * group rows. Pass `'none'` to disable automatic aggregation when the consuming view aggregates the values
 * manually. Other strategies are interpreted by the histogram subclass implementation.
 * @property {Boolean} [disabled=false] Set to `true` to hide this series in the histogram. Useful when several
 * series are defined and the visible set is toggled at runtime.
 * @property {String} [id] The series identifier. When configuring the series this value is automatically taken from
 * the key name the series is provided. In the example code below, the series `id` will be set to `salary`:
 * ```javascript
 * series : {
 *     salary : {
 *         type : 'bar'
 *     },
 *     ...
 * }
 * ```
 */

/**
 * Displays a simple bar histogram based upon an array of data objects passed in the {@link #config-data} config.
 *
 * @extends Core/widget/Widget
 * @classtype histogram
 */
export default class Histogram extends Widget {
    //region Config

    static type = 'histogram';

    static $name = 'Histogram';

    static configurable = {
        /**
         * An array of data objects used to drive the histogram. The property/properties used
         * are defined in the {@link #config-series} option.
         * @config {Object[]}
         * @default
         */
        data : null,

        /**
         * The values to represent in bar form.
         * @config {Number[]}
         */
        values : null,

        /**
         * Object enumerating data series for the histogram.
         * The object keys are treated as series identifiers and values are objects that
         * can contain the following properties:
         *  - `type` A String, either `'bar'` or `'outline'`
         *  - `field` A String, the name of the property to use from the data objects in the {@link #config-data} option.
         * If the value is omitted the series identifier is used as the property name.
         * @config {Object<String, HistogramSeries>}
         */
        series : null,

        /**
         * By default, the bars are scaled based upon the detected max value across all the series.
         * A specific top value to represent the 100% height may be configured.
         * @config {Number}
         */
        topValue : null,

        element : {
            children : [{
                ns,
                tag                 : 'svg',
                reference           : 'svgElement',
                width               : '100%',
                height              : '100%',
                preserveAspectRatio : 'none',
                children            : [{
                    ns,
                    tag       : 'g',
                    reference : 'scaledSvgGroup'
                }, {
                    ns,
                    tag       : 'g',
                    reference : 'unscaledSvgGroup'
                }]
            }]
        },

        /**
         * By default, all bars are rendered, even those with zero height. Configure this as `true`
         * to omit zero height bars.
         * @config {Boolean}
         * @default
         */
        omitZeroHeightBars : false,

        /**
         * By default, the histogram calls {@link #config-getBarText} once per each datum.
         * So the function is supposed to output all the series values the way it needs.
         * Configure this as `false` to call the function for each series value
         * if you need to display the values separately or having different styling.
         * @config {Boolean}
         * @default
         */
        singleTextForAllBars : true,

        monitorResize : true,

        /**
         * A Function which returns a CSS class name to add to a rectangle element
         * representing a "bar"-type series value.
         * The following parameters are passed:
         * @config {Function}
         * @param {HistogramSeries} series The series being rendered
         * @param {DomConfig} domConfig The rectangle element configuration object
         * @param {Object} datum The datum being rendered
         * @param {Number} index The index of the datum being rendered
         * @returns {String} CSS class name of the rectangle element
         */
        getBarClass(series, domConfig, datum, index) {
            return '';
        },

        /**
         * A Function which returns a CSS class name to add to a path element
         * built for an `outline` type series.
         * The following parameters are passed:
         * @param {HistogramSeries} series The series being rendered
         * @param {Object[]} data The series data
         * @returns {String} CSS class name of the path element
         * @config {Function}
         */
        getOutlineClass(series, data) {
            return '';
        },

        /**
         * A Function which if provided should return a DOM configuration object for
         * a `path` element built for an `outline` type series.
         * The function accepts a default prepared DOM configuration
         * in an argument which then can be processed and returned.
         *
         * The following parameters are passed to the function:
         * @param {HistogramSeries} series The series being rendered
         * @param {DomConfig} domConfig The `path` element DOM configuration object
         * @param {Object[]} data The series data
         * @returns {Object} Resulting DOM configuration object. If no value returned the path is
         * not displayed.
         * @config {Function}
         */
        getOutlineDOMConfig(series, domConfig, data) {
            return domConfig;
        },

        /**
         * A Function which returns the tooltip text to display when hovering a bar.
         * The following parameters are passed:
         *
         * @config {Function}
         * @param {HistogramSeries} series The series being rendered
         * @param {DomConfig} domConfig The rectangle configuration object
         * @param {Object} datum The datum being rendered
         * @param {Number} index The index of the datum being rendered
         * @returns {String} Tip for the bar.
         */
        getBarTip(series, domConfig, datum, index) {},

        /**
         * A Function which returns the text to render inside a bar.
         * The following parameters are passed:
         * @param {Object} datum The datum being rendered
         * @param {Number} index The index of the datum being rendered
         * @param {HistogramSeries} series The series (provided if {@link #config-singleTextForAllBars}
         * is `false`)
         * @returns {String} Text to render in the bar.
         * @config {Function}
         */
        getBarText(datum, index, series) {
            return '';
        },

        /**
         * A Function which if provided should return a DOM configuration object for a bar
         * (a `RECT` element representing a single "bar"-type value).
         * The function accepts a default prepared DOM configuration
         * in an argument which then can be processed and returned.
         *
         * The following parameters are passed to the function:
         * @param {HistogramSeries} series The series being rendered
         * @param {DomConfig} domConfig The rectangle DOM configuration object
         * @param {Object} datum The datum being rendered
         * @param {Number} index The index of the datum being rendered
         * @returns {Object} Resulting DOM configuration object. If no value returned the bar is
         * not displayed.
         * @config {Function}
         */
        getBarDOMConfig : null,

        /**
         * A Function which if provided returns DOM configuration for a bar text
         * (a `TEXT` element accompanying a single "bar"-type value).
         * The function accepts a default prepared DOM configuration
         * in the first argument which then can be processed and returned.
         *
         * The following parameters are passed to the function:
         * @param {DomConfig} domConfig The text element DOM configuration object
         * @param {Object} datum The datum being rendered
         * @param {Number} index The index of the datum being rendered
         * @param {HistogramSeries} series The series (provided if {@link #config-singleTextForAllBars}
         * is `false`)
         * @returns {Object} Resulting DOM configuration object. If no value returned the text is
         * not displayed.
         * @config {Function}
         */
        getBarTextDOMConfig(domConfig, datum, index, series) {
            return domConfig;
        },

        getBarTextTip(renderData, datum, index, series) {}
    };

    static properties = {
        refreshSuspended : 0
    };

    //endregion

    //region Init

    construct(config) {
        const me = this;
        super.construct(config);
        me.scheduleRefresh = me.createOnFrame(me.refresh, [], me, true);
        me.refresh();
    }

    set tip(tip) {
        const me = this;

        me.tip?.destroy();

        if (tip) {
            me._tip = Tooltip.new({
                owner             : me,
                forElement        : me.svgElement,
                forSelector       : 'rect',
                internalListeners : {
                    beforeShow : 'up.onBeforeTipShow'
                }
            }, tip);
        }
        else {
            me._tip = null;
        }
    }

    onElementResize(...args) {
        super.onElementResize(...args);

        const svgRect = this.svgElement.getBoundingClientRect();

        this.scaledSvgGroup.setAttribute('transform', `scale(${svgRect.width} ${svgRect.height})`);
    }

    onBeforeTipShow({ source : tip }) {
        const index = parseInt(tip.activeTarget.dataset.index);

        tip.html = tip.contentTemplate({
            histogram : this,
            index
        });
    }

    updateRtl(value, ...args) {
        if (!this.isConfiguring) {
            this.scheduleRefresh();
            this.onElementResize();
        }

        return super.updateRtl(value, ...args);
    }

    updateSeries(value) {
        const
            me     = this,
            series = me._series = {};

        let
            index = 0,
            barSeriesCount = 0;

        for (const id in value) {
            // Providing
            //
            // "series" : {
            //     "foo" : false
            //     ...
            //
            // disables the "foo" series (that could be defined on a prototype level for example)

            const entry = value[id];

            if (entry && !entry.disabled) {

                const data = series[id] = entry.isModel ? entry.toJSON() : Objects.merge({}, entry);

                // default field name is series identifier
                if (!data.field) {
                    data.field = id;
                }

                // default type is "bar"
                if (!data.type) {
                    data.type = 'bar';
                }

                if (!('order' in data)) {
                    data.order = typePrio[data.type] * 10 + index;
                }

                if (!('index' in data)) {
                    data.index = data.type === 'bar' ? barSeriesCount : index;
                }

                if (data.type === 'bar') {
                    barSeriesCount++;
                }

                data.id = id;
                index++;
            }
        }

        // Calculate the top value from all the series
        if (!me.topValue && me._data) {
            me.topValue = me.getDataTopValue(me._data);
        }

        if (!me.refreshSuspended) {
            me.scheduleRefresh();
        }
    }

    getDataTopValue(data, series) {
        const fields = (series ? Object.values(series) : this.enabledSeries).map(getField);

        let result = 0, datum;

        for (let i = 0, { length } = data; i < length; i++) {
            datum = data[i];
            for (let j = 0, { length } = fields; j < length; j++) {
                result = Math.max(result, datum[fields[j]] || 0);
            }
        }

        return result;
    }

    updateData(data) {
        const me = this;

        me._data = data;

        // Calculate the top value from all the series
        if (!me.topValue && me._data && me._series) {
            me.topValue = me.getDataTopValue(data);
        }

        if (!me.refreshSuspended) {
            me.scheduleRefresh();
        }
    }

    updateTopValue(value) {
        const me = this;

        me._topValue = value;

        // Calculate the top value from all the series
        if (!value && me._data) {
            me._topValue = me.getDataTopValue(me._data);
        }

        if (!me.refreshSuspended) {
            me.scheduleRefresh();
        }
    }

    // Must exist from the start because configuration setters call it.
    // Once configured, will be replaced with a function which schedules a refresh for the next animation frame.
    scheduleRefresh() {

    }

    suspendRefresh() {
        this.refreshSuspended++;
    }

    resumeRefresh() {
        if (this.refreshSuspended) {
            this.refreshSuspended--;
        }
    }

    get enabledSeries() {
        const { series } = this;

        return series ? Object.values(series).filter(isSeriesEnabled) : [];
    }

    /**
     * Builds the SVG content arrays from the current series and data without performing DOM updates.
     * Returns `null` if there are no enabled series.
     * @param {Object} [params] Parameters object
     * @param {Array} [params.args] Extra arguments to pass through to draw methods and callbacks
     * @returns {Object|null} Object with `scaledChildren`, `unscaledChildren`, and `topValue`, or `null`
     * @internal
     */
    buildSVGContent(params) {
        const
            me             = this,
            {
                enabledSeries,
                topValue,
                singleTextForAllBars
            }              = me,
            extraArgs        = params?.args || [],
            scaledChildren   = [],
            unscaledChildren = [];

        // bail out if there is no series provided
        if (!enabledSeries) {
            return null;
        }

        enabledSeries.sort(byOrder);

        for (const data of enabledSeries) {
            const elConfig = me[`draw${StringHelper.capitalize(data.type)}Series`](data, ...extraArgs);

            if (elConfig) {
                const { scaledElements, unscaledElements } = elConfig;

                if (scaledElements) {
                    if (Array.isArray(scaledElements)) {
                        scaledChildren.push(...scaledElements);
                    }
                    else {
                        scaledChildren.push(scaledElements);
                    }
                }

                if (unscaledElements) {
                    if (Array.isArray(unscaledElements)) {
                        unscaledChildren.push(...unscaledElements);
                    }
                    else {
                        unscaledChildren.push(unscaledElements);
                    }
                }
            }
        }

        // If drawing a single TEXT for all bars of this tick
        if (singleTextForAllBars) {
            unscaledChildren.push(...me.drawText(null, ...extraArgs));
        }

        // sort again since user could change order in a hook
        scaledChildren.sort(byDatasetOrder);
        unscaledChildren.sort(byDatasetOrder);

        return { scaledChildren, unscaledChildren, topValue };
    }

    refresh(params) {
        const
            me      = this,
            { _tip } = me,
            content = me.buildSVGContent(params);

        if (!content) {
            return;
        }

        const { scaledChildren, unscaledChildren, topValue } = content;

        DomSync.sync({
            domConfig : {
                width               : '100%',
                height              : '100%',
                preserveAspectRatio : 'none',
                direction           : me.rtl ? 'rtl' : 'ltr',
                dataset             : {
                    topValue
                },
                children : [
                    {
                        ns,
                        tag       : 'g',
                        reference : 'scaledSvgGroup',
                        children  : scaledChildren
                    },
                    {
                        ns,
                        tag       : 'g',
                        reference : 'unscaledSvgGroup',
                        children  : unscaledChildren
                    }
                ]
            },
            configEquality : returnFalse,
            targetElement  : me.svgElement
        });

        if (_tip && _tip.isVisible) {
            me.onBeforeTipShow({ source : _tip });
        }
    }

    drawBarSeries(series, ...args) {
        const
            me               = this,
            {
                topValue,
                data,
                omitZeroHeightBars,
                barStyle,
                singleTextForAllBars
            }                = me,
            {
                field,
                order,
                stretch
            }                = series,
            { length }       = data,
            defaultWidth     = 1 / length,
            scaledElements   = [],
            unscaledElements = [],
            seriesId         = StringHelper.createId(series.id),
            seriesIndex      = series.index,
            forceHeight      = stretch ? 1 : undefined;

        let startIndex = 0, increment = 1, leftEntries = length, width;

        if (me.rtl) {
            startIndex = length - 1;
            increment = -1;
        }

        for (let index = startIndex, x = 0; leftEntries > 0; index += increment, x += width, leftEntries--) {
            const datum = data[index];

            let domConfig = (datum.rectConfig = {
                ns,
                tag     : 'rect',
                dataset : {}
            });

            const
                value = datum[field],
                // limit height with topValue otherwise the histogram looks fine
                // yet the bar tooltip picks wrong Y-coordinate and there is an empty space between it and the bar
                height = value ? forceHeight || datum.height || (value > topValue ? topValue : value) / topValue : 0,
                y = 1 - height,
                barTip = me.callback('getBarTip', me, [series, domConfig, datum, index, ...args]);

            // use either provided width or the calculated value
            width = datum.width || defaultWidth;

            if (barStyle) {
                domConfig.style = barStyle;
            }
            else {
                delete domConfig.style;
            }

            Object.assign(domConfig.dataset, {
                index,
                order,
                series : seriesId
            });

            const
                rectClass = {
                    [`b-series-${seriesId}`]          : 1,
                    [`b-series-index-${seriesIndex}`] : 1
                },
                classes = me.callback('getBarClass', me, [series, domConfig, datum, index, ...args]);

            if (classes) {
                classes.split(classesDelimiter).forEach(cls => rectClass[cls] = 1);
            }

            Object.assign(domConfig, {
                x,
                y,
                width,
                height,
                class : rectClass
            });

            if (barTip) {
                domConfig.dataset.btip = barTip;
            }
            else {
                delete domConfig.dataset.btip;
            }

            if (me.getBarDOMConfig) {
                domConfig = me.getBarDOMConfig(series, domConfig, datum, index, ...args);
            }

            if (domConfig && (domConfig.height || !omitZeroHeightBars)) {
                scaledElements.push(domConfig);
            }

            // if we should have separate a text for each bar
            if (!singleTextForAllBars) {
                const left = `${(x + width / 2) * 100}%`;

                unscaledElements.push(me.drawTextEntry(datum, index, {
                    left,
                    x : left,
                    y : datum.y !== undefined ? datum.y : '100%'
                }, series, ...args));
            }
        }

        return {
            scaledElements,
            unscaledElements
        };
    }

    changeGetBarDOMConfig(fn) {
        return fn ? this.bindCallback(fn) : null;
    }

    drawTextSeries(series, ...args) {
        return {
            unscaledElements : this.drawText(series, ...args)
        };
    }

    drawOutlineSeries(series, ...args) {
        const
            me             = this,
            {
                topValue,
                data
            }              = me,
            {
                field,
                order,
                id
            }              = series,
            { length }     = data,
            defaultWidth   = 1 / length,
            coords         = [],
            scaledElements = [];

        let
            domConfig = {
                ns,
                tag     : 'path',
                dataset : {
                    order,
                    id
                }
            },
            barWidth,
            command1    = 'M',
            command2    = 'L',
            startIndex  = 0,
            increment   = 1,
            leftEntries = length;

        if (me.rtl) {
            startIndex = length - 1;
            increment = -1;
        }

        for (let i = startIndex, x = 0; leftEntries > 0; i += increment, leftEntries--) {
            const barHeight = 1 - data[i][field] / topValue;

            // use either provided with or the calculated value
            barWidth = data[i].width || defaultWidth;

            coords.push(`${command1} ${x},${barHeight} ${command2} ${x += barWidth},${barHeight}`);
            command1 = command2 = '';
        }

        domConfig.class = `b-series-${series.id} b-series-index-${series.index} ` +
            me.callback('getOutlineClass', me, [series, data, ...args]);

        domConfig.d = coords.join(' ');

        domConfig = me.callback('getOutlineDOMConfig', me, [series, domConfig, data, ...args]);

        if (domConfig) {
            scaledElements.push(domConfig);
        }

        return {
            scaledElements
        };
    }

    drawTextEntry(entry, index, entryDomConfig, series, ...args) {
        const
            me       = this,
            { data } = me,
            barText  = me.callback('getBarText', me, [entry, index, series, ...args]);

        let domConfig;

        if (barText) {
            domConfig = me.callback('getBarTextDOMConfig', me, [
                {
                    ns,
                    tag       : 'text',
                    className : 'b-bar-legend',
                    html      : barText,
                    dataset   : {
                        index,
                        series : series?.id || series
                    },
                    ...entryDomConfig
                },
                data[index],
                index,
                series,
                ...args
            ]);

            if (domConfig) {
                const barTip = me.callback('getBarTextTip', me, [domConfig, data[index], index, series, ...args]);

                if (barTip) {
                    domConfig.dataset.btip = barTip;
                }
                else {
                    delete domConfig.dataset.btip;
                }
            }
        }

        return domConfig;
    }

    drawText(series, ...args) {
        const
            me                = this,
            { data }          = me,
            { length }        = data,
            defaultWidth      = 1 / length,
            defaultY          = '100%',
            unscaledSvgGroups = [];

        let startIndex = 0, increment = 1, leftEntries = length;

        if (me.rtl) {
            startIndex = length - 1;
            increment = -1;
        }

        for (let index = startIndex, width, x = 0; leftEntries > 0; index += increment, x += width, leftEntries--) {
            width = data[index].width || defaultWidth;

            const left = `${(x + width / 2) * 100}%`;

            const domConfig = me.drawTextEntry(data[index], index, {
                width,
                left,
                x : left,
                y : data[index].y !== undefined ? data[index].y : defaultY
            }, series, ...args);

            if (domConfig) {
                unscaledSvgGroups.push(domConfig);
            }
        }

        return unscaledSvgGroups;
    }

    //endregion
}

Histogram.initClass();
