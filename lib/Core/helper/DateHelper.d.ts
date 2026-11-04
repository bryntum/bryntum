export default class DateHelper {

    static parse (dateString : string | Date, format? : string) : Date

    static format(date : Date, format? : string) : string

    static as(toUnit : string, amount : number | string, fromUnit? : string) : number
    static add(date : string | Date, amount : number, unit? : string) : Date
    static diff(start : Date, end : Date, unit : string, fractional? : boolean) : number

    static min(first : Date, second : Date) : Date
    static max(first : Date, second : Date) : Date

    static isEqual(first : Date, second : Date, unit? : string) : boolean
    static isBefore(first : Date, second : Date) : boolean
    static isAfter(first : Date, second : Date) : boolean

    static compare(first : Date, second : Date, unit? : string) : number

    static normalizeUnit(unit : string) : string

    static constrain(date : Date, min : Date, max : Date) : Date

    static startOf(date : Date, unit? : string, clone? : boolean, weekStartDay? : number) : Date

    static endOf(date : Date) : Date

    static now() : Date
    static fromTime(ms : number) : Date
    static toTime(date : Date) : number
    static dayOfWeek(date : Date) : number
    static getTimeOfDay(date : Date, unit? : string) : number

    static clearTime(date : Date, clone? : boolean) : Date

    static set(date : Date, unit : string, amount : number) : Date

    static getStartOfNextDay(date : Date, clone? : boolean, noNeedToClearTime? : boolean) : Date

    static getEndOfPreviousDay(date : Date, noNeedToClearTime? : boolean) : Date

    static getNext(date : Date, unit : string, increment? : number, weekStartDate? : number) : Date

    static create(definition : {
        year          : number,
        month?        : number,
        date?         : number,
        hours?        : number,
        minutes?      : number,
        seconds?      : number,
        milliseconds? : number,
        amPm?         : number,
        timeZone?     : number
    }, strict? : boolean, clone? : boolean) : Date

    static clone(date : Date) : Date

    static isValidDate(date : any) : boolean

    static daysInMonth(date : Date) : number

    static daysInYear(date : Date) : number

    static get(date : Date, unit : string) : number

    static isMidnight(date : Date) : boolean

    static defaultFormat : string
    static defaultParseFormat : string
}
