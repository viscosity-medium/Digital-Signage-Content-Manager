import {Div, Input, Text} from "@/shared";
import {onChangeIsEditMode, onInputChange, onSaveEditedFolderName} from "@/widgets/Schedule/model/Schedule.helpers";
import {FC, useState} from "react";
import {useAppDispatch} from "../../../../../store/store";
import {useSelector} from "react-redux";
import {
    getScheduleActiveDirectory,
    getScheduleActiveItem,
    getScheduleActiveItemIndex,
    getScheduleStructure
} from "@/widgets/Schedule/model/Schedule.selectors";
import {ScheduleFolderInterface} from "@/widgets/Schedule/model/Schedule.types";
import {Identifier} from "dnd-core";
import "../Folder/folder.css"

export interface FolderItemHeader {
    item: ScheduleFolderInterface
    handlerId: Identifier | null
}

const FolderItemHeader: FC<FolderItemHeader> = ({
    item,
    handlerId
}) => {

    const dispatch = useAppDispatch();
    const scheduleStructure = useSelector(getScheduleStructure);
    const activeDirectory = useSelector(getScheduleActiveDirectory);
    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const [folderName, setFolderName] = useState(item.name);
    const scheduleActiveItem = useSelector(getScheduleActiveItem);
    const activeItemIndex = useSelector(getScheduleActiveItemIndex);

    const folderColorLight = activeItemIndex !== undefined && handlerId === scheduleActiveItem ? "activeBackgroundColor" : "folderBackgroundColor";
    const textColor = activeItemIndex !== undefined && handlerId === scheduleActiveItem ? "whiteTextColor" : "blackTextColor";

    return (
        <Div
            className={`flex items-center self-end w-[45%] h-[20px] translate-y-[3px] px-[8px] rounded-t-md ${folderColorLight}`}
        >
            {
                isEditMode ? (
                    <Div
                        className={"w-full flex justify-end"}
                    >
                        <Input
                            className={`bg-[#fff0] w-[100%] outline-0 text-end text-[16px] ${textColor}`}
                            onKeyDown={(event)=>{
                                if(event.key === "Enter" && activeItemIndex){
                                    onChangeIsEditMode(setIsEditMode);
                                    onSaveEditedFolderName(dispatch, scheduleStructure, activeDirectory, activeItemIndex, folderName);
                                }
                            }}
                            onChange={(event)=>{
                                onInputChange(event, setFolderName)
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
                            className={`w-full min-h-[16px] text-end text-[16px] ${textColor}`}
                        >
                            {folderName}
                        </Text>
                    </Div>
                )
            }
        </Div>
    );
};

export {FolderItemHeader};