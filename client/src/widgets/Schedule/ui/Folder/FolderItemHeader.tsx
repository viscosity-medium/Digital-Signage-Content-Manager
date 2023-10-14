import {Div, Input, Text} from "@/shared";
import {FC, useState} from "react";
import {useAppDispatch} from "@/store/store";
import {useSelector} from "react-redux";
import {
    getScheduleActiveDirectoryId,
    getScheduleActiveItemIndex,
    getScheduleStructure
} from "@/widgets/Schedule/model/Schedule.selectors";
import {ScheduleFolderInterface} from "@/widgets/Schedule/model/Schedule.types";
import "../Folder/folder.css"
import {
    onChangeIsEditMode,
    onInputChange,
    onSaveEditedFolderName
} from "@/widgets/Schedule/model/helpers/ScheduleEventListeners.helpers";

export interface FolderItemHeaderProps {
    item: ScheduleFolderInterface
    condition: boolean
}

const FolderItemHeader: FC<FolderItemHeaderProps> = ({
    item,
    condition
}) => {

    const dispatch = useAppDispatch();
    const scheduleStructure = useSelector(getScheduleStructure);
    const activeDirectoryId = useSelector(getScheduleActiveDirectoryId);
    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const [folderName, setFolderName] = useState<string>(item.name);
    const activeItemIndex = useSelector(getScheduleActiveItemIndex);

    const folderColorLight = condition ? "activeBackgroundColor" : "folderBackgroundColor";
    const folderColorDark = condition ? "activeBackgroundColorDark" : "folderBackgroundColorDark";
    const textColor = condition ? "whiteTextColor" : "blueTextColor";

    return (
        <Div className={"relative z-[0] flex justify-between"}>
            <Div
                className={`flex items-center w-[40%] h-[20px] translate-y-[3px] px-[8px] rounded-t-md ${folderColorDark}`}
            />
            <Div
                className={"absolute w-[60%] h-[8px] bottom-0 translate-y-[3px] ml-[5%] rounded-t-[4px] bg-[#fff]"}
            />
            <Div
                className={`flex items-center w-[40%] h-[20px] translate-y-[3px] rounded-t-md ${folderColorLight}`}
            >
                {
                    isEditMode && item.isEditable ? (
                        <Div
                            className={"w-full flex justify-end"}
                        >
                            <Input
                                className={`bg-[#fff0] w-[100%] leading-[1.2] outline-0 text-end text-[16px] px-[8px] ${textColor} bg-[#ffffff33] rounded-t-md`}
                                onKeyDown={(event)=>{
                                    if(event.key === "Enter" && activeItemIndex !== undefined){
                                        onChangeIsEditMode(setIsEditMode);
                                        onSaveEditedFolderName(
                                            dispatch,
                                            scheduleStructure,
                                            activeDirectoryId,
                                            activeItemIndex,
                                            folderName
                                        );
                                    }
                                }}
                                onChange={(event)=>{
                                    onInputChange(event, setFolderName);
                                }}
                                value={folderName}
                            />
                        </Div>
                    ) : (
                        <Div
                            className={"w-full"}
                            onClick={()=>{
                                onChangeIsEditMode(setIsEditMode);
                            }}
                        >
                            <Text
                                tag={"p"}
                                className={`w-full min-h-[16px] leading-[1.2] px-[8px] text-end text-[16px] select-none ${textColor}`}
                            >
                                {folderName}
                            </Text>
                        </Div>
                    )
                }
            </Div>
        </Div>
    );
};

export {FolderItemHeader};