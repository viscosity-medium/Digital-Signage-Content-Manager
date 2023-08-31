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
                                    content: []
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

const createNewActiveDirectoryItems = (
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
    uniqueId: string
) => {

    const results = getChildrenFolderContent(scheduleStructure, uniqueId);

    dispatch(scheduleActions.setActiveDirectory(uniqueId));
    dispatch(scheduleActions.setActiveDirectoryItems(results));
    dispatch(scheduleActions.setActiveItem(null));

};

export const onSaveButtonClick = (dispatch: AppDispatch, scheduleStructure:  Array<ScheduleFileInterface | ScheduleFolderInterface>) => {
    dispatch(updateScheduleStructure({scheduleStructure}));
    dispatch(modalActions.setModalIsShown());
};


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

export const onDeleteButtonClick = (
    dispatch: AppDispatch,
    scheduleStructure: Array<ScheduleFileInterface | ScheduleFolderInterface>,
    activeDirectory: string,
    deleteIndex: number ) => {

    const newSchedule = createNewScheduleStructureByDeletion(scheduleStructure, activeDirectory, deleteIndex)
    const newFolderContent = createNewActiveDirectoryItemsAfterDeletion(newSchedule, activeDirectory)

    dispatch(scheduleActions.setScheduleStructure(newSchedule));
    dispatch(scheduleActions.setActiveDirectoryItems(newFolderContent));
};

export const onCloseCurrentFolderClick = (dispatch: AppDispatch, scheduleStructure:  Array<ScheduleFileInterface | ScheduleFolderInterface>, activeDirectory: string) => {

    const parentFolderItems = getParentFolderContent(scheduleStructure, activeDirectory);
    const parentFolderId = getParentFolderId(scheduleStructure, activeDirectory);

    dispatch(scheduleActions.setActiveDirectoryItems(parentFolderItems));
    if(parentFolderId){
        dispatch(scheduleActions.setActiveDirectory(parentFolderId));
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

    const newSchedule =  scheduleStructure.reduce((accumulator: Array<ScheduleFileInterface | ScheduleFolderInterface>, currentItem)=>{

        if(currentItem.type === "folder"){

            if(currentItem.uniqueId === activeDirectory){
                return [
                    ...accumulator,
                    {
                        ...currentItem,
                        content: currentItem.content.reduce((accum: any, currentItem, index)=>{

                            if(activeItemIndex === index){
                                return ([
                                        ...accum,
                                        {
                                            ...currentItem,
                                            name: newName
                                        },

                                    ]

                                )
                            } else {
                                return [
                                    ...accum,
                                    currentItem
                                ]
                            }

                        }, []),
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
    },[])

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
                moveScheduleItem={moveScheduleItem}
            />
        )
    } else {
        return (
            <ScheduleFolderItem
                key={`${item.uniqueId}`}
                item={item}
                index={index}
                moveScheduleItem={moveScheduleItem}
            />
        )
    }

}

export const onRightButtonClick = (setPopUpIsShown: Dispatch<SetStateAction<boolean>>) => {
    setPopUpIsShown(prevState => !prevState)
}

export const onChangeIsEditMode = (setIsEditMode: Dispatch<SetStateAction<boolean>>) => {
    setIsEditMode(prevState => !prevState);
}

export const onInputChange = (e: ChangeEvent<HTMLInputElement>, setFolderName:  Dispatch<SetStateAction<string>>) => {
    setFolderName(e.target.value)
}