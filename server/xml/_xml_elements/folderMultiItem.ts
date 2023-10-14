import {ScheduleFolderInterface} from "../../types/scheduleStucture.types";
import {calculateTimeDuration} from "../../utilities/converter";
import {MediaFolderProps} from "../../types/xml.types";

export const folderMultiItem = ({
    content,
    folderItem,
    dateLimits,
    timeDuration
}: MediaFolderProps) => {

    return(
    `   <TMultiItem>
            <Comment>'ENKA&#95;${folderItem.name}'</Comment>
            <DisplayTime>${folderItem.limits.timeIsActive ? timeDuration : -1}</DisplayTime>
            ${dateLimits.lowerLimit ?
                (`<MinDate>${dateLimits.lowerLimit}</MinDate>`) : ("")
            }
                            ${dateLimits.upperLimit ?
                (`<MaxDate>${dateLimits.upperLimit}</MaxDate>`) : ("")
            }
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