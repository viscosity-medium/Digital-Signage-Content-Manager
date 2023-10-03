import {Button, Div} from "@/shared";
import {FC, useState} from "react";
import DownArrowIcon from "@/assets/down-arrow.svg";
import {TimeLimitations} from "@/widgets/Schedule/ui/File/TimeLimitations";
import {ScheduleFolderInterface} from "@/widgets/Schedule/model/Schedule.types";
import {RandomOrder} from "@/widgets/Schedule/ui/File/RandomOrder";

import {onOpenExtraSettingsButtonClick} from "@/widgets/Schedule/model/helpers/ScheduleEventListeners.helpers";

export interface FolderExtraSettingsProps {
    item: ScheduleFolderInterface
    condition: boolean
}

const FolderExtraSettings: FC<FolderExtraSettingsProps> = ({
    item,
    condition
}) => {

    const [isOpen, setIsOpen] = useState<boolean>(item.limits.timeIsActive || item.limits.randomIsActive);

    const folderBackgroundColor = condition ? "activeBackgroundColorDark" : "folderBackgroundColorDark" ;
    const textColor = condition ? "whiteTextColor" : "blueTextColor";


    return (

        item.isEditable && item.content.length > 0 ?
        (
            <Div
                className={`absolute bottom-0 right-[60px] ${isOpen ? "translate-y-[0%]" : "translate-y-[100%]"} h-[60px] w-[auto] ${folderBackgroundColor} border-white border-[2px] border-b-0 rounded-t-[4px] transition duration-300`}
            >
                <Button
                    className={`absolute top-0 right-[8px] translate-y-[-100%] w-[24px] h-[16px] bg-[#ffffff60] ${folderBackgroundColor} border-white border-[2px] border-b-0 rounded-t-[4px] outline-none`}
                    onClick={()=>{
                        onOpenExtraSettingsButtonClick(setIsOpen);
                    }}
                >
                    <DownArrowIcon
                        className={`w-[16px] h-[100%] mx-[auto] ${isOpen ? "" : "rotate-180"} transition duration-300`}
                    />
                </Button>
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
        ) :
            null

    );

};

export {FolderExtraSettings};