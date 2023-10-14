import {
    CalculateActiveDays,
    CalculateTimeDuration
} from "../types/converter.types";

export const calculateActiveDays: CalculateActiveDays = ({
    minDay,
    maxDay
}) => {

    const dateOfEasescreenCountdownIsoFormat = "1899-12-30T00:00:00+0000";
    const dateOfEasescreenCountdownMillisecondsFormat = new Date(dateOfEasescreenCountdownIsoFormat).getTime();
    const upperLimit: number | object = Math.floor(
        (new Date(maxDay.replace(/T.*/,"T00:00:00.000Z")).getTime() - new Date(dateOfEasescreenCountdownMillisecondsFormat).getTime()) / (1000*60*60*24)
    );
    const lowerLimit: number | object = Math.floor(
        (new Date(minDay.replace(/T.*/,"T00:00:00.000Z")).getTime() - new Date(dateOfEasescreenCountdownMillisecondsFormat).getTime()) / (1000*60*60*24)
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

export const calculateTimeDuration: CalculateTimeDuration = ({timeDuration}) => {

    const timeArray = timeDuration.replace(/.*T\d{1,2}:|\.\d*Z$/gm, "").split(":");
    const resultsTimeInSeconds: number = timeArray.reduce((accumulator: number, currentItem: string, index: number) =>{
        if(index === 0){
            return accumulator + (+currentItem * 60);
        } else if(index === 1){
            return accumulator + +currentItem ;
        }
    }, 0);

    return typeof resultsTimeInSeconds === "number" && !Number.isNaN(resultsTimeInSeconds) ? resultsTimeInSeconds : undefined;

}