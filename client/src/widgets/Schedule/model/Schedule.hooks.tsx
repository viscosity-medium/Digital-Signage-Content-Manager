import {useDrag, useDrop} from "react-dnd";
import {Identifier, XYCoord} from "dnd-core";
import {DragItem, ScheduleItemProps, StaticFolders} from "./Schedule.types";
import {useEffect, useRef} from "react";
import {fetchScheduleStructure} from "@/widgets/Schedule/model/Schedule.asyncThunks";
import {useAppDispatch} from "../../../../store/store";
import { useSearchParams } from "next/navigation";
import { scheduleActions } from "./Schedule.slice";

export const useFetchScheduleStructure = () => {

    const dispatch = useAppDispatch();
    const searchParams = useSearchParams();

    const structureParams = searchParams.get("structure");
    const initialActiveDirectory = structureParams?.replace(/.*\//, "")

    useEffect(()=>{
        
        if(initialActiveDirectory){
            dispatch(scheduleActions.setActiveDirectoryId(initialActiveDirectory));
        }

        dispatch(fetchScheduleStructure());
    },[]);

}

export const useDragAndDrop = ({
    item,
    index,
    moveScheduleItem,
    activeDirectoryId
}: ScheduleItemProps) => {

    const { rootDirectory, Yabloneviy, Uglovoi } = StaticFolders;

    const refListObject = useRef<HTMLLIElement>(null);
    const [{ handlerId }, drop] = useDrop<DragItem, void, { handlerId: Identifier | null }>({
        accept: "scheduleItem",
        collect(monitor) {
            return {
                handlerId: monitor.getHandlerId(),
            }
        },
        hover(item: DragItem, monitor) {

            if (!refListObject.current) {
                return
            }

            const dragIndex = item.index
            const hoverIndex = index

            if (dragIndex === hoverIndex) {
                return
            }

            const hoverBoundingRect = refListObject.current?.getBoundingClientRect()
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            const clientOffset = monitor.getClientOffset();
            const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top

            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return
            }

            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return
            }

            moveScheduleItem(dragIndex, hoverIndex);
            item.index = hoverIndex;
        },
    });

    const [{isDragging: opacity}, dragRef] = useDrag({
        type: "scheduleItem",
        item: () => ({
            id: item.uniqueId,
            index
        }),
        collect: (monitor) => ({
            isDragging: monitor.isDragging() ? 0 : 1
        })
    });

    dragRef(drop(refListObject));

    if([rootDirectory, Yabloneviy, Uglovoi].includes(activeDirectoryId as StaticFolders)){
        return {
            opacity: 1,
            handlerId,
            refListObject: null
        }
    }

    return {
        opacity,
        handlerId,
        refListObject
    }

}