import {ScheduleFolderInterface, ScheduleItemInterface} from "../Schedule.types";
import dayjs, {Dayjs} from "dayjs";

const isoStringToSeconds = (item: ScheduleItemInterface) => {

    const timeDurationString = (typeof item.limits.time === "string" && item.limits.time !== "default") ?
        item.limits.time.replace(/.*T\d{2}:|\..*$/gm, "") : undefined;

    if(timeDurationString){
        const tuple = timeDurationString.split(":") as [string, string];

        return +tuple[0] * 60 + +tuple[1];
    } else {
        return undefined
    }

}

const countTotalFolderContentDuration = ({
    activeDirectoryItems
}: {
    activeDirectoryItems: ScheduleItemInterface[]
}) => {

    const totalTime = activeDirectoryItems.reduce((accumulator: number | undefined, currentContentItem) => {

        if(accumulator !== undefined){
            const itemTotalTime = isoStringToSeconds(currentContentItem);

            if(typeof itemTotalTime === "number"){
                return accumulator + itemTotalTime
            } else {
                return undefined
            }
        } else {
            return undefined
        }

    }, 0);

    return totalTime ? `(${totalTime})` : "";

}

const convertTimeIfNotDefault = (timeDuration: string | Dayjs) => {
    const tuple = dayjs(timeDuration).toString().replace(/^.*\s\d{2}:|\s\w{3}/gm, "").toString().split(":") as [string, string];
    return `(${+tuple[0] * 60 + +tuple[1]})`;
}

export const getItemDuration = ({item}: {item: ScheduleFolderInterface}) => {
    return item.limits.time !== "default" ?
        convertTimeIfNotDefault(item.limits.time) :
        countTotalFolderContentDuration({activeDirectoryItems: item.content});
}