export const calculateActiveDays = ({
    minDay,
    maxDay
}: {
    minDay: string,
    maxDay: string
}): {
    lowerLimit: number | undefined
    upperLimit: number | undefined
} => {


    const dateOfEasescreenCountdownIsoFormat = "1899-12-30T00:00:00+0000";
    const dateOfEasescreenCountdownMillisecondsFormat = new Date(dateOfEasescreenCountdownIsoFormat).getTime();
    const upperLimit: number | object = Math.floor(
        (new Date(maxDay).getTime() - new Date(dateOfEasescreenCountdownMillisecondsFormat).getTime()) / (1000*60*60*24)
    );
    const lowerLimit: number | object = Math.floor(
        (new Date(minDay).getTime() - new Date(dateOfEasescreenCountdownMillisecondsFormat).getTime()) / (1000*60*60*24)
    );

    return {
        lowerLimit: (
            typeof lowerLimit === "number" && !Number.isNaN(lowerLimit)
        ) ? lowerLimit : undefined,
        upperLimit: (
            typeof upperLimit === "number" && !Number.isNaN(upperLimit)
        ) ? upperLimit : undefined
    };

}
