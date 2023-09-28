import {ScheduleFolderInterface} from "../../types/scheduleStucture.types";
import {calculateTimeDuration} from "../../utilities/converter";

export const folderMultiItem = ({content, folderItem}: {content: string, folderItem: ScheduleFolderInterface}) => {

    const timeDuration = calculateTimeDuration({
        timeDuration: folderItem.limits.time
    })

    return(
    `   <TMultiItem>
            <Comment>'ENKA&#95;${folderItem.name}'</Comment>
            <DisplayTime>${folderItem.limits.timeIsActive ? timeDuration : -1}</DisplayTime>
            <Effect.TransitionNr>0</Effect.TransitionNr>
            <DefaultTime>15</DefaultTime>${
                folderItem.limits.timeIsActive ? `<AlwaysItemEnd>True</AlwaysItemEnd>` : ""
            }${
                folderItem.limits.randomIsActive ? `<Random>True</Random>` : ""
            }<Items>
                ${content}
            </Items>
        </TMultiItem>
    `
    )
}