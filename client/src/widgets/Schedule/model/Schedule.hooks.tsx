import {useDrag, useDrop} from "react-dnd";
import {Identifier, XYCoord} from "dnd-core";
import {DragItem, ScheduleItemProps, StaticFolders} from "./Schedule.types";
import {useEffect, useRef} from "react";
import {fetchScheduleStructure} from "@/widgets/Schedule/model/Schedule.asyncThunks";
import {useAppDispatch} from "@/store/store";
import {useRouter, useSearchParams} from "next/navigation";
import { scheduleActions } from "./Schedule.slice";
import {createNewActiveDirectoryItemsRecursively} from "@/widgets/Schedule/model/helpers/ScheduleItemsCreators.helpers";
import {useSelector} from "react-redux";
import {getScheduleStructure} from "@/widgets/Schedule/model/Schedule.selectors";
import {getChildrenFolderName} from "@/widgets/Schedule/model/helpers/ScheduleItemsGetters.helpers";

export const useFetchScheduleStructure = () => {

    const dispatch = useAppDispatch();
    const router = useRouter();
    const searchParams = useSearchParams();
    const scheduleStructure = useSelector(getScheduleStructure);
    const structureParams = searchParams.get("structure");
    const activeDirectoryId = structureParams?.replace(/.*\//, "");


    useEffect(() => {

        if(activeDirectoryId){

            const folderName = getChildrenFolderName(scheduleStructure, activeDirectoryId) || "";
            const activeDirectoryItems = createNewActiveDirectoryItemsRecursively(
                scheduleStructure,
                activeDirectoryId
            );

            dispatch(scheduleActions.setActiveDirectoryId(activeDirectoryId));
            dispatch(scheduleActions.setActiveDirectoryItems(activeDirectoryItems));
            dispatch(scheduleActions.setActiveDirectoryName(folderName))

        }

        if(["", "/", null].includes(structureParams) || structureParams?.startsWith("undefined")){
            router.push(`/?structure=/rootDirectory`)
        }

    }, [dispatch, router, activeDirectoryId, structureParams]);

    useEffect(()=>{

        dispatch(fetchScheduleStructure());

    },[dispatch]);

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