export default class VersionHelper {

    static setVersion(product : string, version : string) : void

    static getVersion(product : string) : string

    static semanticCompareVersion(version1 : string, version2 : string, comparison : '<=' | '<' | '=' | '>' | '>=') : boolean

    static checkVersion(version : string, operator : '<=' | '<' | '=' | '>' | '>=') : boolean

    static deprecate(invalidAsOfVersion : string, message : string) : void

    static get isTestEnv() : boolean

    static get isDebug() : boolean

}
