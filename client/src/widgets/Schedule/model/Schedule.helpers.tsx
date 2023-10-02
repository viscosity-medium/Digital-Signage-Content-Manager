import {scheduleActions} from "@/widgets/Schedule/model/Schedule.slice";
import {ScheduleFileItem} from "@/widgets/Schedule/ui/ScheduleFileItem";
import update from "immutability-helper";
import {AppDispatch} from "../../../../store/store";
import {updateScheduleStructure, uploadXmlFilesOnMmsServer} from "@/widgets/Schedule/model/Schedule.asyncThunks";
import {ScheduleFolderItem} from "@/widgets/Schedule/ui/ScheduleFolderItem";
import {v4 as uuid} from "uuid";
import {ActiveItemsIndexesRange, ScheduleItemInterface} from "@/widgets/Schedule/model/Schedule.types";
import {Identifier} from "dnd-core";
import {modalActions} from "@/widgets/Modal/model/Modal.slice";
import {ChangeEvent, Dispatch, SetStateAction, MouseEvent} from "react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";

export const getChildrenFolderContent = (
    scheduleStructure: Array<ScheduleItemInterface>,
    activeDirectory: "rootDirectory" | string
): Array<ScheduleItemInterface> => {

    return scheduleStructure.reduce((accumulator:  Array<ScheduleItemInterface>, currentItem ) => {

        if(currentItem.type === "folder"){
            if(currentItem.uniqueId === activeDirectory){
                return currentItem["content"];
            } else {
                return [
                    ...accumulator,
                    ...getChildrenFolderContent(currentItem["content"], activeDirectory)];
            }
        } else {
            return accumulator
        }

    }, []);

}

export const getChildrenFolderName = (
    scheduleStructure: Array<ScheduleItemInterface>,
    activeDirectory: "rootDirectory" | string
): string => {

    return scheduleStructure.reduce((accumulator: string, currentItem ) => {

        if(currentItem.type === "folder"){
            if(currentItem.uniqueId === activeDirectory){
                return currentItem.name;
            } else {
                return accumulator + getChildrenFolderName(currentItem["content"], activeDirectory);
            }
        } else {
            return accumulator
        }

    }, "");

}

export const getParentFolderContent = (
    scheduleStructure: Array<ScheduleItemInterface>,
    activeDirectory: "rootDirectory" | string,
): Array<ScheduleItemInterface> => {

    return scheduleStructure.reduce(( accumulator: Array<ScheduleItemInterface>, currentItem ) => {

        if(currentItem.type === "folder"){
            if(currentItem.uniqueId === activeDirectory){
                return scheduleStructure;
            } else {
                return [
                    ...accumulator,
                    ...getParentFolderContent(currentItem["content"], activeDirectory)];
            }
        } else {
            return accumulator;
        }

    }, []);

}

export const getParentFolderId = (
    scheduleStructure: Array<ScheduleItemInterface>,
    activeDirectory: "rootDirectory" | string,
    parentFolderId?: string
): string | undefined => {

    return scheduleStructure.reduce(( accumulator: string | undefined, currentItem ) => {

        if(currentItem.type === "folder"){
            const folderId = currentItem.uniqueId;
            if(currentItem.uniqueId === activeDirectory){
                return parentFolderId;
            } else {
                return accumulator || getParentFolderId(currentItem["content"], activeDirectory, folderId);
            }
        } else {
            return accumulator;
        }

    }, undefined);

}

export const getParentFolderName = (
    scheduleStructure: Array<ScheduleItemInterface>,
    activeDirectory: "rootDirectory" | string,
    parentFolderName?: string
): string | undefined => {

    return scheduleStructure.reduce(( accumulator: string | undefined, currentItem ) => {

        if(currentItem.type === "folder"){
            
            const folderName = currentItem.name;
            
            if(currentItem.uniqueId === activeDirectory){
                return parentFolderName;
            } else {
                return accumulator || getParentFolderName(currentItem["content"], activeDirectory, folderName);
            }

        } else {
            return accumulator;
        }

    }, undefined);

}

export const moveScheduleItem = (
    dispatch: AppDispatch,
    directoryItems: Array<ScheduleItemInterface>,
    activeDirectoryItems: Array<ScheduleItemInterface>,
    activeDirectory: string
) => (dragIndex: number, hoverIndex: number) => {

    const newActiveItems = update(activeDirectoryItems, {
        $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, activeDirectoryItems[dragIndex]],
        ],
    });

    const recursiveEditInternalItems = (
        directoryItems: Array<ScheduleItemInterface>,
        newActiveItems: Array<ScheduleItemInterface>,
        activeDirectory: string
    ): Array<ScheduleItemInterface> => {

        return directoryItems.reduce((
            accumulator: Array<ScheduleItemInterface>,
            currentItem
        )=>{

            if(currentItem.type === "folder"){

                if(currentItem.uniqueId === activeDirectory){
                    return(
                        [
                            ...accumulator,
                            {
                                ...currentItem,
                                content: newActiveItems
                            }
                        ]
                    )
                } else {
                    return(
                        [
                            ...accumulator,
                            {
                                ...currentItem,
                                content: recursiveEditInternalItems(currentItem.content, newActiveItems, activeDirectory)
                            }
                        ]
                    )
                }
            } else {
                return ([
                    ...accumulator,
                    {
                        ...currentItem,
                    }
                ])
            }
        },[])
    };

    const newStructure = recursiveEditInternalItems(directoryItems, newActiveItems, activeDirectory);
    dispatch(scheduleActions.setActiveItemIndex(hoverIndex))
    dispatch(scheduleActions.setScheduleStructure(newStructure));
    dispatch(scheduleActions.setActiveDirectoryItems((
        newActiveItems
    )));

};

const createNewScheduleStructure = (
    scheduleStructure: Array<ScheduleItemInterface>,
    activeDirectory: string,
    activeItemIndex: number
): Array<ScheduleItemInterface>  => {

    return scheduleStructure.reduce((
        accumulator: Array<ScheduleItemInterface>,
        currentItem: ScheduleItemInterface
    ) => {

        if(currentItem.type === "folder"){

            if(currentItem.uniqueId === activeDirectory){

                const content = currentItem.content.reduce((accum: any, currentItem, index)=>{
                    if(activeItemIndex === index){
                        return ([
                                ...accum,
                                currentItem,
                                {
                                    type: "folder",
                                    name: "folder",
                                    uniqueId: uuid(),
                                    isEditable: true,
                                    content: [],
                                    "limits": {
                                        "date": {
                                            "start": "default",
                                            "end": "default"
                                        },
                                        "dateIsActive": false,
                                        "time": "default",
                                        "timeIsActive": false
                                    }
                                }
                            ]

                        )
                    } else {
                        return [
                            ...accum,
                            currentItem
                        ]
                    }

                }, [])

                return [
                    ...accumulator,
                    {
                        ...currentItem,
                        content: content?.length !== 0 ? content : [{
                            type: "folder",
                            name: "folder",
                            uniqueId: uuid(),
                            isEditable: true,
                            content: []
                        }]
                    }
                ];
            } else {
                return [
                    ...accumulator,
                    {
                        ...currentItem,
                        content: [
                            ...createNewScheduleStructure(currentItem.content, activeDirectory, activeItemIndex)
                        ]
                    }
                ];
            }

        } else {
            return [
                ...accumulator,
                currentItem
            ]
        }

    }, [])
}

export const createNewActiveDirectoryItems = (
    scheduleStructure: Array<ScheduleItemInterface>,
    activeDirectory: string
): Array<ScheduleItemInterface> => {

    return scheduleStructure.reduce((accum: Array<ScheduleItemInterface>, currentItem) => {

        if(currentItem.type === "folder"){
            if( currentItem.uniqueId === activeDirectory){
                return currentItem.content;
            } else {
                return [
                    ...accum,
                    ...createNewActiveDirectoryItems(currentItem.content, activeDirectory)];
            }
        } else {
            return accum;
        }

    }, []);

}

const createNewScheduleStructureByDeletion = (
    scheduleStructure: Array<ScheduleItemInterface>,
    activeDirectory: string,
    deleteIndex: number
): Array<ScheduleItemInterface>  => {

    return scheduleStructure.reduce((
        accumulator: Array<ScheduleItemInterface | any>,
        currentItem: ScheduleItemInterface
    ) => {

        if(currentItem.type === "folder"){

            if(currentItem.uniqueId === activeDirectory){
                return [
                    ...accumulator,
                    {
                        ...currentItem,
                        content: [
                            ...currentItem.content.filter((__, index)=>{ return deleteIndex !== index}),
                        ]
                    }
                ];
            } else {
                return [
                    ...accumulator,
                    {
                        ...currentItem,
                        content: [
                            ...createNewScheduleStructureByDeletion(currentItem.content, activeDirectory, deleteIndex)
                        ]
                    }
                ];
            }

        } else {
            return [
                ...accumulator,
                currentItem
            ]
        }

    }, [])
}

const recursiveRenameFolder = (
    scheduleStructure: Array<ScheduleItemInterface>,
    activeDirectory: string,
    activeItemIndex: number,
    newName: string
): Array<ScheduleItemInterface> => {

    return scheduleStructure.reduce((accumulator: Array<ScheduleItemInterface>, currentItem) => {

        if(currentItem.type === "folder"){
            if(currentItem.uniqueId === activeDirectory){
                return [
                    ...accumulator,
                    {
                        ...currentItem,
                        content: currentItem.content.reduce((accum: any, currentInnerItem, index)=>{
                            if(activeItemIndex === index){
                                return ([
                                        ...accum,
                                        {
                                            ...currentInnerItem,
                                            name: newName
                                        },

                                    ]

                                )
                            } else {
                                return [
                                    ...accum,
                                    currentInnerItem
                                ]
                            }

                        }, []),
                    }
                ];
            } else {
                console.log(currentItem)
                return [
                    ...accumulator,
                    {
                        ...currentItem,
                        content: [
                            ...recursiveRenameFolder(currentItem.content, activeDirectory, activeItemIndex, newName)
                        ]
                    }
                ];
            }

        } else {
            return [
                ...accumulator,
                currentItem
            ]
        }
    },[])
}

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

export const createArray = ({
    firstIndex,
    secondIndex
}: {
    firstIndex: number | undefined,
    secondIndex: number | undefined
}) => {

    if(secondIndex !== undefined){

        const firstIndexEdited = (firstIndex !== undefined ? firstIndex : 0);
        const bottomBorder = secondIndex - firstIndexEdited > 0 ? firstIndexEdited : secondIndex;
        const topBorder = secondIndex - firstIndexEdited > 0 ? secondIndex : firstIndexEdited;
        const result: number[] = Array(topBorder - bottomBorder + 1);

        for (let i = 0; i < result.length; ++i) {
            result[i] = bottomBorder + i;
        }

        return result;

    } else {
        return []
    }
}

export const copyScheduleElementToBuffer = ({
    dispatch,
    activeItemIndex,
    activeItemsIndexesRange,
    activeDirectoryScheduleItems
}: {
    dispatch: AppDispatch,
    activeItemIndex: number | undefined
    activeDirectoryScheduleItems: Array<ScheduleItemInterface>
    activeItemsIndexesRange: ActiveItemsIndexesRange | undefined
}) => {

    if(activeItemsIndexesRange){

        const {startIndex, endIndex} = activeItemsIndexesRange;
        const copiedItems = activeDirectoryScheduleItems.slice(startIndex, endIndex + 1);

        dispatch(scheduleActions.setCopyBuffer(copiedItems));

    } else if(activeItemIndex !== undefined){

        const copiedItems = activeDirectoryScheduleItems.slice(activeItemIndex, activeItemIndex + 1);

        dispatch(scheduleActions.setCopyBuffer(copiedItems));

    }

}

const pasteMultipleElementsRecursively = ({
    scheduleStructure,
    activeDirectoryId,
    copyAfterIndex,
    scheduleBufferDataToCopy
}: {
    copyAfterIndex: number
    activeDirectoryId: string
    scheduleStructure: Array<ScheduleItemInterface>
    scheduleBufferDataToCopy: Array<ScheduleItemInterface>,
}): Array<ScheduleItemInterface> => {
    return scheduleStructure.reduce((accumulator: Array<ScheduleItemInterface>, currentItem: ScheduleItemInterface)=> {

        if(currentItem.type === "folder"){

            if(currentItem.uniqueId === activeDirectoryId){

                const returnBufferDataWithNewIds = () => [
                    ...scheduleBufferDataToCopy.reduce((
                        bufferAccumulator: Array<ScheduleItemInterface>,
                        currentBufferItem: ScheduleItemInterface
                    ) => {
                        return [
                            ...bufferAccumulator,
                            {
                                ...currentBufferItem,
                                id: uuid(),
                                uniqueId: uuid(),
                            }
                        ]
                    },[])
                ];

                const content = currentItem.content.reduce((accum: Array<ScheduleItemInterface>, currentItem: ScheduleItemInterface, index)=>{
                    if(copyAfterIndex === index){
                        if(index !== 0){
                            return ([
                                ...accum,
                                currentItem,
                                ...returnBufferDataWithNewIds()
                            ])
                        } else {
                            return ([
                                ...accum,
                                ...returnBufferDataWithNewIds(),
                                currentItem,
                            ])
                        }
                    } else {
                        return [
                            ...accum,
                            currentItem
                        ]
                    }

                }, [])

                return [
                    ...accumulator,
                    {
                        ...currentItem,
                        content: content.length !== 0 ? content : returnBufferDataWithNewIds()
                    }
                ];

            } else {
                return [
                    ...accumulator,
                    {
                        ...currentItem,
                        content: pasteMultipleElementsRecursively({
                            scheduleStructure: currentItem.content,
                            copyAfterIndex,
                            activeDirectoryId,
                            scheduleBufferDataToCopy
                        })
                    }
                ]
            }

        } else if (currentItem.type === "file") {

            return [
                ...accumulator,
                currentItem
            ]

        }

        return accumulator
    }, [])
}

export const pasteCopiedElementsFromBufferToSchedule = ({
    dispatch,
    activeItemIndex,
    activeDirectoryId,
    scheduleStructure,
    scheduleBufferDataToCopy,
    activeItemsIndexesRange
}: {
    dispatch: AppDispatch,
    activeDirectoryId: string
    activeItemIndex: number | undefined
    scheduleStructure: Array<ScheduleItemInterface>
    scheduleBufferDataToCopy: Array<ScheduleItemInterface>,
    activeItemsIndexesRange: ActiveItemsIndexesRange | undefined
}) => {
    if(scheduleBufferDataToCopy.length !== 0 && activeItemsIndexesRange === undefined){

        const copyAfterIndex = activeItemIndex !== undefined ? activeItemIndex : 0;
        const newSchedule = pasteMultipleElementsRecursively({
            copyAfterIndex,
            scheduleStructure,
            activeDirectoryId,
            scheduleBufferDataToCopy
        });
        const newActiveDirectoryContent = createNewActiveDirectoryItems(newSchedule, activeDirectoryId);

        dispatch(scheduleActions.setScheduleStructure(newSchedule));
        dispatch(scheduleActions.setActiveDirectoryItems(newActiveDirectoryContent));

    }
}

export const onListElementClick = ({
    dispatch,
    handlerId,
    previousActiveElementIndex,
    activeElementIndex,
    mouseEvent
}:{
    dispatch: AppDispatch,
    handlerId: Identifier | null,
    activeElementIndex: number
    previousActiveElementIndex: number| undefined,
    mouseEvent: MouseEvent<HTMLLIElement>
}) => {

    if(!mouseEvent.shiftKey){
        dispatch(scheduleActions.setActiveItem(handlerId));
        dispatch(scheduleActions.setActiveItemIndex(activeElementIndex));
        dispatch(scheduleActions.setActiveItemsIndexesRange(undefined));
    }

    if(mouseEvent.shiftKey && activeElementIndex !== undefined) {
        dispatch(scheduleActions.setActiveItemsIndexesRange({
            startIndex: previousActiveElementIndex !== undefined ? previousActiveElementIndex : 0,
            endIndex: activeElementIndex
        }));
        dispatch(scheduleActions.setActiveItemIndex(undefined));
    }

};

export const onOpenExtraSettingsButtonClick = (setIsOpen: Dispatch<SetStateAction<boolean>>) => {
    setIsOpen(prevState => !prevState)
};

export const onChangeIsEditMode = (setIsEditMode: Dispatch<SetStateAction<boolean>>) => {
    setIsEditMode(prevState => !prevState);
}

export const onInputChange = (e: ChangeEvent<HTMLInputElement>, setFolderName:  Dispatch<SetStateAction<string>>) => {
    setFolderName(e.target.value)
}

export const onSaveEditedFolderName = (
    dispatch: AppDispatch,
    scheduleStructure: Array<ScheduleItemInterface>,
    activeDirectory: string,
    activeItemIndex: number,
    newName: string
) => {

    const newSchedule = recursiveRenameFolder(scheduleStructure, activeDirectory, activeItemIndex, newName)
    const newActiveDirectoryContent = createNewActiveDirectoryItems(newSchedule, activeDirectory)

    dispatch(scheduleActions.setScheduleStructure(newSchedule));
    dispatch(scheduleActions.setActiveDirectoryItems(newActiveDirectoryContent));

}

export const onCloseCurrentFolderClick = (
    dispatch: AppDispatch,
    scheduleStructure: Array<ScheduleItemInterface>,
    activeDirectoryId: string,
    router: AppRouterInstance,
    structureParams: string | null
) => {

    const parentFolderItems = getParentFolderContent(scheduleStructure, activeDirectoryId);
    const parentFolderId = getParentFolderId(scheduleStructure, activeDirectoryId);
    const parentFolderName = getParentFolderName(scheduleStructure, activeDirectoryId);

    dispatch(scheduleActions.setActiveDirectoryItems(parentFolderItems));

    if(parentFolderId && parentFolderName && structureParams){

        router.push(`/?structure=${structureParams.replace(/\/[^\/]*$/, "")}`);

        dispatch(scheduleActions.setActiveDirectoryId(parentFolderId));
        dispatch(scheduleActions.setActiveDirectoryName(parentFolderName));
        dispatch(scheduleActions.setActiveItem(null));

    }

}

export const onCreateFolderButtonClick = (
    dispatch: AppDispatch,
    scheduleStructure: Array<ScheduleItemInterface>,
    activeDirectory: string,
    activeItemIndex: number
) => {

    const newScheduleStructure = createNewScheduleStructure(scheduleStructure, activeDirectory, activeItemIndex);
    const newActiveDirectoryItems = createNewActiveDirectoryItems(newScheduleStructure, activeDirectory);

    dispatch(scheduleActions.setScheduleStructure(newScheduleStructure));
    dispatch(scheduleActions.setActiveDirectoryItems(newActiveDirectoryItems));

}

export const onFolderElementDoubleClick = (
    dispatch: AppDispatch,
    scheduleStructure: Array<ScheduleItemInterface>,
    uniqueId: string,
    folderName: string,
    router: AppRouterInstance,
    structureParams: string | null
) => {

    const results = getChildrenFolderContent(scheduleStructure, uniqueId);
    const previousUrl = structureParams !== null ? structureParams : "/rootDirectory";

    router.push(`/?structure=${previousUrl?.replace(/\/$/,"")}/${uniqueId}`)
    dispatch(scheduleActions.setActiveDirectoryId(uniqueId));
    dispatch(scheduleActions.setActiveDirectoryName(folderName));
    dispatch(scheduleActions.setActiveDirectoryItems(results));
    dispatch(scheduleActions.setActiveItem(null));
    dispatch(scheduleActions.setActiveItemIndex(undefined));

};

export const onSaveButtonClick = async (dispatch: AppDispatch, scheduleStructure:  Array<ScheduleItemInterface>) => {

    const modalContent = await dispatch(updateScheduleStructure({scheduleStructure}))
    .then((serverResponse: any) => {
        return {
            response: serverResponse.payload.response
        }
    })
    .catch(() => {
        return {
            response: "",
            error: "Произошла ошибка: расписание не было сохранено на сервере"
        }
    });

    dispatch(modalActions.setModalIsShown(true));
    dispatch(modalActions.setModalContent(modalContent));

};

export const onDeployButtonClick = async (dispatch: AppDispatch, scheduleStructure:  Array<ScheduleItemInterface>) => {
    const modalContent = await dispatch(uploadXmlFilesOnMmsServer({scheduleStructure}))
    .then((serverResponse: any) => {
        return {
            response: serverResponse.payload.response
        }
    })
    .catch(() => {
        return {
            response: "",
            error: "Произошла ошибка: xml-расписание не было загружено на mms-сервер"
        }
    });

    dispatch(modalActions.setModalIsShown(true));
    dispatch(modalActions.setModalContent(modalContent));
}

export const onDeleteButtonClick = (
    dispatch: AppDispatch,
    scheduleStructure: Array<ScheduleItemInterface>,
    activeDirectory: string,
    deleteIndex: number
) => {

    const newSchedule = createNewScheduleStructureByDeletion(scheduleStructure, activeDirectory, deleteIndex)
    const newFolderContent = createNewActiveDirectoryItems(newSchedule, activeDirectory)

    dispatch(scheduleActions.setScheduleStructure(newSchedule));
    dispatch(scheduleActions.setActiveDirectoryItems(newFolderContent));
    dispatch(scheduleActions.setActiveItemIndex(undefined));
};