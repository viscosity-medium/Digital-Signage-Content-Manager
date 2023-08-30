import {FC} from "react";
import {Button, Div, ListElement, Text} from "@/shared";
import {useDragAndDrop} from "@/widgets/Schedule/model/Schedule.hooks";
import {ScheduleFolderProps} from "@/widgets/Schedule/model/Schedule.types";
import {
    onDeleteButtonClick,
    onFolderElementDoubleClick,
    onListElementClick
} from "@/widgets/Schedule/model/Schedule.helpers";
import CrossSvg from "@/assets/cross.svg";
import {useAppDispatch} from "../../../../store/store";
import {useSelector} from "react-redux";
import {
    getScheduleActiveDirectory,
    getScheduleActiveItemIndex,
    getScheduleActiveItem,
    getScheduleStructure
} from "@/widgets/Schedule/model/Schedule.selectors";
import {v4 as uuid} from "uuid";

const ScheduleFolderItem: FC<ScheduleFolderProps> = ({
    item,
    index,
    moveScheduleItem
}) => {

    const dispatch = useAppDispatch();
    const scheduleStructure = useSelector(getScheduleStructure);
    const activeFolder = useSelector(getScheduleActiveDirectory);
    const scheduleActiveItem = useSelector(getScheduleActiveItem);
    const activeItemIndex = useSelector(getScheduleActiveItemIndex);
    const { opacity, handlerId, refListObject } = useDragAndDrop({item, index, moveScheduleItem});
    const folderName = "Папка";
    const folderColorLight = activeItemIndex !== undefined && handlerId === scheduleActiveItem ? "#6567e9" : "#fcd462";
    // const folderColorDark = handlerId === scheduleActiveItem ? "#5758c5" : "#e0bc56";
    return (
        <>
            <ListElement
                reference={refListObject}
                style={{opacity}}
                dataHandlerId={handlerId}
                onClick={()=>{
                    onListElementClick(dispatch, handlerId, index)
                }}
                onDragStart={()=>{
                    onListElementClick(dispatch, handlerId, index);
                }}
                onDoubleClick={()=>{
                    onFolderElementDoubleClick(dispatch, scheduleStructure , item.uniqueId)
                }}
                className={`flex flex-col relative justify-between min-h-[56px] mt-3 px-3 text-[24px] text-white cursor-pointer active:cursor-grabbing border-[3px] border-[${folderColorLight}] rounded`}
            >
                <Div
                    className={"flex flex-col"}
                >
                    {
                        item.content.map((textContent, index) => {
                            const name =  textContent.type === "file" ? textContent.name  : folderName;

                            return (
                                <Text
                                    key={uuid()}
                                    tag={"p"}
                                    className={`text-[16px] ${name === folderName && "text-[#fcd462]"}`}
                                >
                                    {index+1}) {
                                    name
                                }
                                </Text>
                            )

                        })
                    }
                </Div>
                <Button
                    onClick={()=>{
                        onDeleteButtonClick(dispatch, scheduleStructure, activeFolder, index)
                    }}
                    className={"absolute top-3 right-3 z-2"}
                >
                    <CrossSvg
                        className={"w-[24px] fill-red-500"}
                    />
                </Button>

                <Div
                    className={`absolute z-[0] w-[45%] h-[8px] border-[4px] border-[${folderColorLight}] top-[-8px] right-[-3px] rounded-t-md`}
                />
            </ListElement>
        </>
    );

};

export {ScheduleFolderItem};