import {ScheduleFileItem} from "@/widgets/Schedule/ui/ScheduleFileItem";
import {ScheduleFolderItem} from "@/widgets/Schedule/ui/ScheduleFolderItem";
import {ScheduleItemInterface} from "@/widgets/Schedule/model/Schedule.types";

export const renderScheduleItemsHelper = (
    item: ScheduleItemInterface,
    index: number,
    moveScheduleItem: (dragIndex: number, hoverIndex: number) => void
) => {

    if(item.type === "file"){
        return (
            <ScheduleFileItem
                key={`${item.uniqueId}`}
                item={item}
                index={index}
                activeDirectoryId={item.uniqueId}
                moveScheduleItem={moveScheduleItem}
            />
        )
    } else {
        return (
            <ScheduleFolderItem
                key={`${item.uniqueId}`}
                item={item}
                index={index}
                activeDirectoryId={item.uniqueId}
                moveScheduleItem={moveScheduleItem}
            />
        )
    }

}