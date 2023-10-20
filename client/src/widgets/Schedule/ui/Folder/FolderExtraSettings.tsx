import {Button, Div} from "@/shared";
import {FC, useState} from "react";
import DownArrowIcon from "@/assets/down-arrow.svg";
import {TimeLimitations} from "../DisplaySettings/TimeLimitations";
import {ScheduleFolderInterface} from "../../model/Schedule.types";
import {RandomOrder} from "../DisplaySettings/RandomOrder";

import {onOpenFolderSettings} from "../../model/helpers/ScheduleEventListeners.helpers";
import {DateLimitations} from "../DisplaySettings/DateLimitations";

export interface FolderExtraSettingsProps {
    item: ScheduleFolderInterface
    condition: boolean
}

const FolderExtraSettings: FC<FolderExtraSettingsProps> = ({
    item,
    condition
}) => {

    const isOpenCondition = item.limits.timeIsActive || item.limits.randomIsActive;
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const folderBackgroundColor = condition ? "activeBackgroundColorDark" : "folderBackgroundColorDark" ;
    const textColor = condition ? "whiteTextColor" : "blueTextColor";

    return (

        item.isEditable && item.content.length > 0 ?
        (
            <Div
                className={`absolute z-[3] bottom-0 py-[4px] right-[60px] ${isOpen ? "translate-y-[0%]" : "translate-y-[100%]"} h-[auto] w-[auto] ${folderBackgroundColor} border-white border-[2px] border-b-0 rounded-t-[4px] transition duration-300`}
            >
                <Button
                    className={`absolute top-0 right-[8px] translate-y-[-100%] w-[24px] h-[16px] bg-[#ffffff60] ${folderBackgroundColor} border-white border-[2px] border-b-0 rounded-t-[4px] outline-none`}
                    onClick={()=>{
                        onOpenFolderSettings(setIsOpen);
                    }}
                >
                    <DownArrowIcon
                        className={`w-[16px] h-[100%] mx-[auto] ${isOpen ? "" : "rotate-180"} transition duration-300`}
                    />
                </Button>
                <Div>
                    <DateLimitations
                        item={item}
                        textColor={textColor}
                        fileUniqueId={item.uniqueId}
                    />
                    <TimeLimitations
                        item={item}
                        textColor={textColor}
                        fileUniqueId={item.uniqueId}
                    />
                    <RandomOrder
                        folderItem={item}
                        fileUniqueId={item.uniqueId}
                        condition={condition}
                    />
                </Div>
            </Div>
        ) :
            null

    );

};

export {FolderExtraSettings};