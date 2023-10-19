import {ScheduleFileItem} from "../../ui/File/ScheduleFileItem";
import {ScheduleFolderItem} from "../../ui/Folder/ScheduleFolderItem";
import {ScheduleItemInterface} from "../Schedule.types";

export const renderScheduleItemsHelper = (
    item: ScheduleItemInterface,
    index: number,
    moveScheduleItem: (dragIndex: number, hoverIndex: number) => void
) => {

    if(item.type === "file"){
        return (
            <ScheduleFileItem
                key={`${item.uniqueId}__${item.id}__${item.name}`}
                item={item}
                index={index}
                activeDirectoryId={item.uniqueId}
                moveScheduleItem={moveScheduleItem}
            />
        )
    } else {
        return (
            <ScheduleFolderItem
                key={`${item.uniqueId}__${item.name}`}
                item={item}
                index={index}
                activeDirectoryId={item.uniqueId}
                moveScheduleItem={moveScheduleItem}
            />
        )
    }

}