import {useDrag, useDrop} from "react-dnd";
import {Identifier, XYCoord} from "dnd-core";
import {AutoScrollToTop, DragItem, ScheduleItemProps, StaticFolders} from "../Schedule.types";
import {useEffect, useRef} from "react";
import {fetchScheduleStructure} from "../Schedule.asyncThunks";
import {useAppDispatch} from "@/store/store";
import {useRouter, useSearchParams} from "next/navigation";
import {scheduleActions} from "../Schedule.slice";
import {createNewActiveDirectoryItemsRecursively} from "../helpers/ScheduleItemsCreators.helpers";
import {useSelector} from "react-redux";
import {
    getFullDirectoriesPath,
    getScheduleActiveDirectoryId,
    getScheduleScrollProperties,
    getScheduleStructure
} from "../Schedule.selectors";
import {getChildrenFolderName} from "../helpers/ScheduleItemsGetters.helpers";
import {modalActions} from "../../../Modal/model/Modal.slice";
import {
    getCurrentDirectoryScrollProperties,
    initScrollPropertiesStructure
} from "@/widgets/Schedule/model/helpers/ScheduleScrollProperties.helpers";

export const useFetchScheduleStructure = () => {

    const dispatch = useAppDispatch();

    useEffect(() => {
        (async ()=>{
            const serverResponse: any = await dispatch(fetchScheduleStructure())
            .then((serverResponse: any) => {
                return {
                    response: serverResponse.payload.response
                }
            })
            .catch(() => {
                return {
                    response: "",
                    error: "Сервер не смог загрузить данные\nОбратитесь к администрации ресурса"
                }
            });

            if(serverResponse.error){
                dispatch(modalActions.setModalIsShown(true));
                dispatch(modalActions.setModalContent(serverResponse));
            }

        })()
    },[dispatch]);

}

export const useAutoScrollToTop = ({
    unOrderListRef
}: AutoScrollToTop) => {

    const activeDirectoryId = useSelector(getScheduleActiveDirectoryId);
    const scrollProperties = useSelector(getScheduleScrollProperties);

    useEffect(() => {

        const currentScrollProperties = getCurrentDirectoryScrollProperties({scrollProperties});

        if(unOrderListRef.current && unOrderListRef.current.scrollTop !== undefined && currentScrollProperties && currentScrollProperties.scrollTop !== undefined){
            unOrderListRef.current.scrollTop = currentScrollProperties.scrollTop;
        }

    }, [activeDirectoryId, unOrderListRef, scrollProperties]);

};

export const useChangeFolderProperties = () => {

    const dispatch = useAppDispatch();
    const router = useRouter();
    const searchParams = useSearchParams();
    const scheduleStructure = useSelector(getScheduleStructure);
    const fullDirectoriesPath = useSelector(getFullDirectoriesPath);
    const structureParams = searchParams.get("structure");
    const activeDirectoryId = structureParams?.replace(/.*\//, "");
    const searchParamsString = searchParams.get("structure");
    const searchParamsArray = searchParamsString?.split("/").filter(param => param);

    useEffect(() => {

        if( activeDirectoryId ){

            const folderName = getChildrenFolderName(scheduleStructure, activeDirectoryId) || "";
            const activeDirectoryItems = createNewActiveDirectoryItemsRecursively(
                scheduleStructure,
                activeDirectoryId
            );

            dispatch(scheduleActions.setActiveDirectoryId(activeDirectoryId));
            dispatch(scheduleActions.setActiveDirectoryItems(activeDirectoryItems));
            dispatch(scheduleActions.setActiveDirectoryName(folderName));

        }

        if(["", "/", null].includes(structureParams) || structureParams?.startsWith("undefined")){
            router.push(`/?structure=/rootDirectory`);
        }

    }, [dispatch, router, activeDirectoryId, structureParams, scheduleStructure]);


    useEffect(() => {

        if( !fullDirectoriesPath && searchParamsArray && searchParamsArray.length > 0 ){

            dispatch(scheduleActions.setFullDirectoriesPath(searchParamsArray));

        } else if(fullDirectoriesPath && searchParamsArray && activeDirectoryId) {

            if( !fullDirectoriesPath.includes(activeDirectoryId) ){

                const newFullDirectoriesPath = [...fullDirectoriesPath, activeDirectoryId];

                dispatch(scheduleActions.setFullDirectoriesPath(newFullDirectoriesPath));

            } else {

                const index = searchParamsArray.indexOf(activeDirectoryId);

                if (index > -1) {

                    searchParamsArray.filter((item) => item !== activeDirectoryId);
                    dispatch(scheduleActions.setFullDirectoriesPath(searchParamsArray));

                }

            }

        }

    }, [activeDirectoryId]);

};

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

export const useInitScrollPropertiesStructure = () => {

    const dispatch = useAppDispatch();
    const searchParams = useSearchParams();

    useEffect(() => {
        initScrollPropertiesStructure({dispatch, searchParams});
    }, []);

}