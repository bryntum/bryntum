export type ModelId = string | number

export type ModelInternalId = string | number

// Matches the ChronoGraph `CommitResult` of the higher tiers both ways
export type CommitResult = {
    rejectedWith? : any
}
