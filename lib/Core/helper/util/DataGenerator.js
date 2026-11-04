import RandomGenerator from './RandomGenerator.js';
import DateHelper from '../DateHelper.js';

/**
 * @module Core/helper/util/DataGenerator
 */

const lorem = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
    'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui atione voluptatem sequi nesciunt.',
    'Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.',
    'Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur?',
    'Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?'
];

/**
 * Generates a pseudo random data for Grid records.
 * Used to provide data in examples.
 */
export default class DataGenerator {
    //region Random

    static reset() {
        this.rnd.reset();
        this.rndTime.reset();
        this.rndRating.reset();
    }

    //endregion

    static rnd = new RandomGenerator();
    static rndTime = new RandomGenerator();
    static rndRating = new RandomGenerator();
    static rndText = new RandomGenerator();

    //region Data arrays

    /**
     * Array with available city values
     * @static
     * @readonly
     * @member {String[]}
     */
    static get cities() {
        return [
            'Stockholm', 'Barcelona', 'Paris', 'Dubai', 'New York', 'San Francisco', 'Washington', 'Montreal'
        ];
    }

    static get namesWithAvatars() {
        return [
            'Adam', 'Amit', 'Angelo', 'Arcady', 'Arnold', 'Barbara', 'Celia', 'Chang', 'Dan', 'Daniel', 'Dave', 'David',
            'Don', 'Doug', 'Emilia', 'George', 'Gloria', 'Henrik', 'Hitomi', 'James', 'Jane', 'Jenny', 'John', 'Jong',
            'Karen', 'Kate', 'Lee', 'Linda', 'Lisa', 'Lola', 'Macy', 'Madison', 'Malik', 'Mark', 'Mary', 'Maxim',
            'Melissa', 'Mike', 'Rob', 'Steve'
        ];

        // none.png
    }

    /**
     * Array with available first name values
     * @static
     * @readonly
     * @member {String[]}
     */
    static get firstNames() {
        return [
            'Mike', 'Linda', 'Don', 'Karen', 'Doug', 'Jenny', 'Daniel', 'Melissa', 'John', 'Jane', 'Theo', 'Lisa',
            'Adam', 'Mary', 'Barbara', 'James', 'David'
        ];
    }

    /**
     * Array with available surname values
     * @static
     * @readonly
     * @member {String[]}
     */
    static get surNames() {
        return [
            'McGregor', 'Ewans', 'Scott', 'Smith', 'Johnson', 'Adams', 'Williams', 'Brown', 'Jones', 'Miller',
            'Davis', 'More', 'Wilson', 'Taylor', 'Anderson', 'Thomas', 'Jackson'
        ];
    }

    /**
     * Array with available team values
     * @static
     * @readonly
     * @member {String[]}
     */
    static get teams() {
        return [
            'Lions', 'Eagles', 'Tigers', 'Horses', 'Dogs', 'Cats', 'Panthers', 'Rats', 'Ducks', 'Cougars', 'Hens', 'Roosters'
        ];
    }

    /**
     * Array with available food values
     * @static
     * @readonly
     * @member {String[]}
     */
    static get foods() {
        return [
            'Pancake', 'Burger', 'Fish n chips', 'Carbonara', 'Taco', 'Salad', 'Bolognese', 'Mac n cheese', 'Waffles'
        ];
    }

    /**
     * Array with available color values
     * @static
     * @readonly
     * @member {String[]}
     */
    static get colors() {
        return [
            'Red', 'Pink', 'Magenta', 'Purple', 'Violet', 'Deep-purple', 'Indigo', 'Blue', 'Light-blue', 'Cyan', 'Teal',
            'Green', 'Light-green', 'Lime', 'Yellow', 'Amber', 'Orange', 'Deep-orange', 'Light-gray', 'Gray',
            'Black'
        ];
    }

    /**
     * Array with hex color values, parallel to {@link #property-colors-static colors} (same length and
     * order). Use the index of a name in `colors` to look up its hex value here.
     * @static
     * @readonly
     * @member {String[]}
     */
    static get hexColors() {
        return [
            '#e53935',
            '#d81b60',
            '#c200c2',
            '#8e24aa',
            '#5e35b1',
            '#4527a0',
            '#3949ab',
            '#1e88e5',
            '#03a9f4',
            '#3bc9db',
            '#00897b',
            '#43a047',
            '#8bc34a',
            '#c0ca33',
            '#fdd835',
            '#ffb300',
            '#fb8c00',
            '#f4511e',
            '#c0c0c0',
            '#757575',
            '#000000'
        ];
    }

    /**
     * Array with available skill values
     * @static
     * @readonly
     * @member {String[]}
     */
    static get skills() {
        return [
            'JavaScript', 'CSS', 'TypeScript', 'React', 'Vue', 'Angular', 'Java', 'PHP',
            'Python', 'C#', 'C++', 'BASIC', 'COBOL', 'FORTRAN', 'PASCAL', 'SQL'
        ];
    }

    /**
     * Array with available task values
     * @static
     * @readonly
     * @member {String[]}
     */
    static get tasks() {
        return [
            'Meetings', 'Documentation', 'Email communication', 'Project management', 'Budgeting',
            'Marketing and advertising', 'Customer service', 'Research and analysis', 'Data entry',
            'IT support', 'Employee management', 'Sales and business development',
            'Event planning', 'Graphic design', 'Writing and editing',
            'Presentation', 'Travel arrangements and expense management', 'Training and development',
            'Quality assurance', 'Customer support', 'Technical writing', 'Social media management', 'Translation',
            'Legal research', 'Data analysis and visualization', 'Video editing and production',
            'Network admin', 'Content creation', 'Market research', 'Public relations', 'Teaching and training',
            'Recruiting', 'Product development'
        ];
    }

    //endregion

    //region Generate data

    static generateName() {
        const
            {
                namesWithAvatars,
                surNames
            }         = this,
            firstName = namesWithAvatars[Math.round(Math.random() * (namesWithAvatars.length - 1))],
            surName   = surNames[Math.round(Math.random() * (surNames.length - 1))];

        return `${firstName} ${surName}`;
    }

    /**
     * Generates an array of objects with specified properties.
     *
     * @param {Number} count The number of objects to generate or an options object.
     * @privateparam {Boolean|Number} [randomHeight=false] If `true`, assigns random heights to objects.
     *   If a number is provided, it sets the maximum height.
     * @privateparam {Number} [initialId=1] The initial ID for the generated objects.
     * @yields {Object} An object representing a generated item with various properties.
     * @generator
     * @static
     */
    static * generate(count, randomHeight = false, initialId = 1) {
        let addSkills, rowCallback, useHexColors;

        if (typeof count === 'object') {
            randomHeight = count.randomHeight;
            initialId = count.initialId ?? 1;
            addSkills = count.addSkills;
            rowCallback = count.rowCallback;
            useHexColors = count.hexColors;
            count = count.count;
        }

        const
            me = this,
            {
                rnd, rndTime, rndRating, rndText,
                firstNames, surNames, teams, foods, colors, cities, skills, hexColors
            }  = me;

        for (let i = 0; i < count; i++) {
            const firstName = rnd.fromArray(firstNames),
                surName   = rnd.fromArray(surNames),
                name      = `${firstName} ${String.fromCharCode(65 + (i % 25))} ${surName}`,
                startDay  = rnd.nextRandom(60) + 1,
                start     = new Date(2025, 0, startDay),
                finish    = new Date(2025, 0, startDay + rnd.nextRandom(30) + 2),
                row       = {
                    id        : initialId > -1 ? i + initialId : undefined,
                    title     : 'Row ' + i,
                    name,
                    firstName,
                    surName,
                    city      : rnd.fromArray(cities),
                    team      : rnd.fromArray(cities) + ' ' + rnd.fromArray(teams),
                    age       : 10 + rnd.nextRandom(80),
                    food      : rnd.fromArray(foods),
                    color     : rnd.fromArray(useHexColors ? hexColors : colors),
                    score     : rnd.nextRandom(100) * 10,
                    rank      : rnd.nextRandom(100) + 1,
                    start,
                    finish,
                    time      : DateHelper.getTime(rndTime.nextRandom(24), rndTime.nextRandom(12) * 5),
                    percent   : rnd.nextRandom(100),
                    done      : rnd.nextRandom(100) < 50,
                    rating    : rndRating.nextRandom(5),
                    active    : startDay > 30,
                    relatedTo : Math.min(count - 1, i + initialId + rnd.nextRandom(10)),
                    notes     : lorem[rndText.nextRandom(7) + 1]
                };

            if (addSkills) {
                row.skills = rnd.randomArray(skills, typeof addSkills === 'number' ? addSkills : 7);
            }

            const additionalData = rowCallback?.(row);

            additionalData && Object.assign(row, additionalData);

            if (randomHeight) {
                row.rowHeight = rnd.nextRandom(randomHeight === true ? 20 : randomHeight) * 5 + 21;
            }

            yield row;
        }
    }

    /**
     * Generates a pseudo random dataset. Used in Grid examples.
     * @param {Number|Object} count number of records, or an object with properties:
     * @param {Boolean} [count.randomHeight] Generate random row height
     * @param {Boolean} [count.initialId] Row initial id. Set -1 to disable Id generation. Defaults to 1.
     * @param {Boolean} [count.reset] Set true to ensure we get the same dataset on consecutive calls. Defaults to true
     * @param {Boolean} [count.rowCallback] A callback called for each row to allow appending extra data, returned data in
     * object form will be applied to the generated data
     * @param {Boolean} [count.addSkills] Add skills to the dataset
     * @param {Boolean} [randomHeight] Generate random row height
     * @param {Number} [initialId] Row initial id. Set -1 to disable Id generation. Defaults to 1.
     * @param {Boolean} [reset] Set true to ensure we get the same dataset on consecutive calls. Defaults to true
     * @returns {Object[]} Generated rows array
     */
    static generateData(count, randomHeight = false, initialId = 1, reset = true) {
        let args = count;

        if (typeof count !== 'object') {
            args = {
                count,
                randomHeight,
                initialId,
                reset
            };
        }

        args.reset !== false && this.reset();

        if (DataGenerator.overrideRowCount) {
            args.count = DataGenerator.overrideRowCount;
        }

        const
            rows      = [],
            generator = this.generate(args);

        for (let i = 0; i < args.count; i++) {
            rows.push(generator.next().value);
        }
        return rows;
    }

    /**
     * Generates a dataset of events, resources, and optionally dependencies.
     * @param {Object} config Configuration object
     * @param {Date} config.viewStartDate The start date for generating events
     * @param {Date} [config.viewEndDate] The end date for generating events
     * @param {Number} [config.nbrResources=50] Number of resources to generate
     * @param {Number} [config.nbrEvents=5] Number of events per resource
     * @param {Boolean} [config.dependencies] Whether to generate dependencies between events
     * @param {DurationUnit} [config.tickUnit='days'] The time unit for event duration ('days', 'hours', etc.)
     * @param {Number} [config.minDuration=2] Minimum duration for events
     * @param {Number} [config.maxDuration=10] Maximum duration for events
     * @param {Number} [config.gap=1] Gap between consecutive events
     * @param {Function} [config.eventCallback] Callback function called for each generated event
     * @returns {Object} Object containing generated data
     */
    static generateEvents({
        viewStartDate,
        viewEndDate,
        nbrResources = 50,
        nbrEvents = 5,
        dependencies,
        tickUnit = 'days',
        minDuration = 2,
        maxDuration = 10,
        gap = 1,
        eventCallback
    }) {
        const
            resources = this.generateData(nbrResources),
            events    = [];

        let startDate, endDate;

        const dependenciesArray = [];

        for (let i = 0; i <= nbrResources; i++) {

            for (let j = 0; j <= nbrEvents; j++) {
                const
                    duration = Math.round(Math.random() * (maxDuration - 1 - minDuration)) + minDuration,
                    eventId  = events.length + 1;

                startDate = j === 0 ? DateHelper.add(viewStartDate, Math.round(Math.random() * 3) * gap, tickUnit)
                    : DateHelper.add(endDate, gap, tickUnit);

                endDate = DateHelper.add(startDate, duration, tickUnit);

                events.push({
                    id         : eventId,
                    name       : this.tasks[(i + j) % (this.tasks.length - 1)],
                    startDate,
                    duration,
                    endDate,
                    resourceId : i
                });

                eventCallback?.(events[events.length - 1]);

                if (dependencies && i > 0) {
                    dependenciesArray.push({
                        id   : dependenciesArray.length + 1,
                        from : eventId - 1,
                        to   : eventId
                    });
                }
            }

        }

        return {
            resources,
            events,
            dependencies : dependenciesArray
        };
    }

    /**
     * Generates a pseudo random dataset with one scheduled event per resource & date tick.
     * @param {Object} data
     * @param {Boolean} [data.startDate] Start date of the first generated event
     * @param {Boolean} [data.endDate] End date of the last generated event
     * @param {Boolean} [data.nbrResources] Number of resources
     * @param {Boolean} [data.tickUnit] The tick unit for the time axis, defaults to `days`
     * @returns {Object[]} Generated rows array
     */
    static generateOneEventPerTickAndResource({
        startDate,
        endDate,
        nbrResources = 50,
        tickUnit = 'days'
    }) {
        const
            resources    = this.generateData(nbrResources),
            events       = [],
            visibleTicks = DateHelper.getDurationInUnit(startDate, endDate, tickUnit);

        for (let i = 0; i <= nbrResources; i++) {
            for (let j = 0; j < visibleTicks; j++) {
                events.push({
                    id           : events.length + 1,
                    resourceId   : i,
                    name         : this.tasks[(i + j) % (this.tasks.length - 1)],
                    startDate    : DateHelper.add(startDate, j, tickUnit),
                    duration     : 1,
                    durationUnit : tickUnit
                });
            }
        }

        return {
            resources,
            events
        };
    }

    /**
     * Generates pseudo random data for a Grid row.
     * @returns {Object} Generated row
     */
    static generateRow() {
        return DataGenerator.generateData(1, false, -1, false)[0];
    }

    //endregion
}
