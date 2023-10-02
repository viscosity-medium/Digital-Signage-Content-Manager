export interface CalculateActiveInput {
    minDay: string,
    maxDay: string
}

export interface CalculateActiveOutput {
    lowerLimit: number | undefined
    upperLimit: number | undefined
}

export type CalculateActiveDays = (
    {minDay, maxDay}: CalculateActiveInput
) => CalculateActiveOutput

export type CalculateTimeDuration = ({timeDuration}: { timeDuration: string }) => number