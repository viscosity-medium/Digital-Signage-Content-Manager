import {scheduleActions} from "@/widgets/Schedule/model/Schedule.slice";
import {ScheduleFileItem} from "@/widgets/Schedule/ui/ScheduleFileItem";
import update from "immutability-helper";
import {AppDispatch} from "../../../../store/store";
import {updateScheduleStructure} from "@/widgets/Schedule/model/Schedule.asyncThunks";
import {ScheduleFolderItem} from "@/widgets/Schedule/ui/ScheduleFolderItem";
import {v4 as uuid} from "uuid";
import {ScheduleFileInterface, ScheduleFolderInterface} from "@/widgets/Schedule/model/Schedule.types";
import {Identifier} from "dnd-core";
import {modalActions} from "@/widgets/Modal/model/Modal.slice";
import {ChangeEvent, Dispatch, SetStateAction} from "react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";

export const getChildrenFolderContent = (
    scheduleStructure: Array<ScheduleFileInterface | ScheduleFolderInterface>,
    activeDirectory: "rootDirectory" | string
): Array<ScheduleFileInterface | ScheduleFolderInterface> => {

    return scheduleStructure.reduce((accumulator:  Array<ScheduleFileInterface | ScheduleFolderInterface>, currentItem ) => {

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
    scheduleStructure: Array<ScheduleFileInterface | ScheduleFolderInterface>,
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
    scheduleStructure: Array<ScheduleFileInterface | ScheduleFolderInterface>,
    activeDirectory: "rootDirectory" | string,
): Array<ScheduleFileInterface | ScheduleFolderInterface> => {

    return scheduleStructure.reduce(( accumulator: Array<ScheduleFileInterface | ScheduleFolderInterface>, currentItem ) => {

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
    scheduleStructure: Array<ScheduleFileInterface | ScheduleFolderInterface>,
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
    scheduleStructure: Array<ScheduleFileInterface | ScheduleFolderInterface>,
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
    directoryItems: Array<ScheduleFileInterface | ScheduleFolderInterface>,
    activeDirectoryItems: Array<ScheduleFileInterface | ScheduleFolderInterface>,
    activeDirectory: string
) => (dragIndex: number, hoverIndex: number) => {

    const newActiveItems = update(activeDirectoryItems, {
        $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, activeDirectoryItems[dragIndex]],
        ],
    });

    const recursiveEditInternalItems = (
        directoryItems: Array<ScheduleFileInterface | ScheduleFolderInterface>,
        newActiveItems: Array<ScheduleFileInterface | ScheduleFolderInterface>,
        activeDirectory: string
    ): Array<ScheduleFileInterface | ScheduleFolderInterface> => {

        return directoryItems.reduce((
            accumulator: Array<ScheduleFileInterface | ScheduleFolderInterface>,
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
    scheduleStructure: Array<ScheduleFileInterface | ScheduleFolderInterface>,
    activeDirectory: string,
    activeItemIndex: number
): Array<ScheduleFileInterface | ScheduleFolderInterface>  => {

    return scheduleStructure.reduce((
        accumulator: Array<ScheduleFileInterface | ScheduleFolderInterface | any>,
        currentItem: ScheduleFileInterface | ScheduleFolderInterface
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
    scheduleStructure: Array<ScheduleFileInterface | ScheduleFolderInterface>,
    activeDirectory: string
): Array<ScheduleFileInterface | ScheduleFolderInterface> => {

    return scheduleStructure.reduce((accum: Array<ScheduleFileInterface | ScheduleFolderInterface>, currentItem) => {

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
    scheduleStructure: Array<ScheduleFileInterface | ScheduleFolderInterface>,
    activeDirectory: string,
    deleteIndex: number
): Array<ScheduleFileInterface | ScheduleFolderInterface>  => {

    return scheduleStructure.reduce((
        accumulator: Array<ScheduleFileInterface | ScheduleFolderInterface | any>,
        currentItem: ScheduleFileInterface | ScheduleFolderInterface
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

const createNewActiveDirectoryItemsAfterDeletion = (
    scheduleStructure: Array<ScheduleFileInterface | ScheduleFolderInterface | any>,
    activeDirectory: string
): Array<ScheduleFileInterface | ScheduleFolderInterface | any> => {

    return scheduleStructure.reduce((accum: Array<ScheduleFileInterface | ScheduleFolderInterface>, currentItem) => {

        if(currentItem.type === "folder"){
            if( currentItem.uniqueId === activeDirectory){
                return [...currentItem.content];
            } else {
                return [
                    ...accum,
                    ...createNewActiveDirectoryItemsAfterDeletion(currentItem.content, activeDirectory)];
            }
        } else {
            return accum;
        }

    }, []);

}

const recursiveRenameFolder = (
    scheduleStructure: Array<ScheduleFileInterface | ScheduleFolderInterface>,
    activeDirectory: string,
    activeItemIndex: number,
    newName: string
): Array<ScheduleFileInterface | ScheduleFolderInterface> => {

    return scheduleStructure.reduce((accumulator: Array<ScheduleFileInterface | ScheduleFolderInterface>, currentItem) => {

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


export const onCreateFolderButtonClick = (
    dispatch: AppDispatch,
    scheduleStructure: Array<ScheduleFileInterface | ScheduleFolderInterface>,
    activeDirectory: string,
    activeItemIndex: number
) => {

    const newScheduleStructure = createNewScheduleStructure(scheduleStructure, activeDirectory, activeItemIndex);
    const newActiveDirectoryItems = createNewActiveDirectoryItems(newScheduleStructure, activeDirectory);

    dispatch(scheduleActions.setScheduleStructure(newScheduleStructure));
    dispatch(scheduleActions.setActiveDirectoryItems(newActiveDirectoryItems));

}

export const onListElementClick = (dispatch: AppDispatch, handlerId: Identifier | null, activeElementIndex: number ) => {
    dispatch(scheduleActions.setActiveItem(handlerId))
    dispatch(scheduleActions.setActiveItemIndex(activeElementIndex));
};

export const onFolderElementDoubleClick = (
    dispatch: AppDispatch,
    scheduleStructure: Array<ScheduleFileInterface | ScheduleFolderInterface>,
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

export const onSaveButtonClick = (dispatch: AppDispatch, scheduleStructure:  Array<ScheduleFileInterface | ScheduleFolderInterface>) => {
    dispatch(updateScheduleStructure({scheduleStructure}));
    dispatch(modalActions.setModalIsShown());
};

export const onDeleteButtonClick = (
    dispatch: AppDispatch,
    scheduleStructure: Array<ScheduleFileInterface | ScheduleFolderInterface>,
    activeDirectory: string,
    deleteIndex: number ) => {

    const newSchedule = createNewScheduleStructureByDeletion(scheduleStructure, activeDirectory, deleteIndex)
    const newFolderContent = createNewActiveDirectoryItemsAfterDeletion(newSchedule, activeDirectory)

    dispatch(scheduleActions.setScheduleStructure(newSchedule));
    dispatch(scheduleActions.setActiveDirectoryItems(newFolderContent));
    dispatch(scheduleActions.setActiveItemIndex(undefined));
};

export const onCloseCurrentFolderClick = (
    dispatch: AppDispatch, 
    scheduleStructure: Array<ScheduleFileInterface | ScheduleFolderInterface>, 
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

export const onSaveEditedFolderName = (
    dispatch: AppDispatch,
    scheduleStructure: Array<ScheduleFileInterface | ScheduleFolderInterface>,
    activeDirectory: string,
    activeItemIndex: number,
    newName: string
) => {

    const newSchedule = recursiveRenameFolder(scheduleStructure, activeDirectory, activeItemIndex, newName)
    const newActiveDirectoryContent = createNewActiveDirectoryItemsAfterDeletion(newSchedule, activeDirectory)

    dispatch(scheduleActions.setScheduleStructure(newSchedule));
    dispatch(scheduleActions.setActiveDirectoryItems(newActiveDirectoryContent));

}

export const renderScheduleItemsHelper = (
    item: ScheduleFileInterface | ScheduleFolderInterface,
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

export const onChangeIsEditMode = (setIsEditMode: Dispatch<SetStateAction<boolean>>) => {
    setIsEditMode(prevState => !prevState);
}

export const onInputChange = (e: ChangeEvent<HTMLInputElement>, setFolderName:  Dispatch<SetStateAction<string>>) => {
    setFolderName(e.target.value)
}