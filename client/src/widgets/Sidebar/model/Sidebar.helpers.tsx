import {
    CreateRecursiveContent,
    InternalProperties,
    SidebarStructure,
    SidebarStructureItem
} from "./Sidebar.type";
import {SidebarFileItem} from "../ui/SidebarFileItem";
import {SidebarFolderItem} from "../ui/SidebarFolderItem";
import {AppDispatch} from "@/store/store";
import {scheduleActions} from "../../Schedule/model/Schedule.slice";
import {
    ScheduleFileInterface,
    ScheduleFolderInterface,
    ScheduleItemInterface
} from "../../Schedule/model/Schedule.types";
import {v4 as uuid} from "uuid";
import {ChangeEvent, Dispatch, SetStateAction} from "react";
import {sidebarActions} from "./Sidebar.slice";
import {fetchActualGoogleStructure} from "./Sidebar.asyncThunks";
import {modalActions} from "../../Modal/model/Modal.slice";
import {stringValidators} from "@/shared";


export const createNewSchedule = (
    scheduleStructure: Array<ScheduleItemInterface>,
    internalItem: SidebarStructureItem,
    activeDirectory: string,
    activeItemIndex: number
): Array<ScheduleItemInterface> => {

    return scheduleStructure.reduce((
        accumulator: Array<ScheduleItemInterface>,
        currentItem: ScheduleItemInterface
    ): Array<ScheduleItemInterface> => {

        if(currentItem.type === "folder"){

            if(currentItem.uniqueId === activeDirectory){

                const content = currentItem.content.reduce((accum: Array<ScheduleItemInterface>, currentItem, index) => {
                    if(activeItemIndex === index){

                        const newFolderItem: ScheduleFileInterface = {
                            id: internalItem.id,
                            name: internalItem.name,
                            thumbnailLink: internalItem.thumbnailLink,
                            type: "file",
                            mimeType: internalItem.mimeType,
                            uniqueId: uuid(),
                            limits: {
                                date: {
                                    start: "default",
                                    end: "default"
                                },
                                dateIsActive: false,
                                time: "default",
                                timeIsActive: false,
                            }
                        }

                        return ([
                                ...accum,
                                currentItem,
                                newFolderItem
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
                            id: internalItem.id,
                            name: internalItem.name,
                            thumbnailLink: internalItem.thumbnailLink,
                            mimeType: internalItem.mimeType,
                            type: "file",
                            uniqueId: uuid(),
                            limits: {
                                date: {
                                    start: "default",
                                    end: "default"
                                },
                                dateIsActive: false,
                                time: "default",
                                timeIsActive: false
                            }
                        }]
                    }
                ];
            } else {
                return [
                    ...accumulator,
                    {
                        ...currentItem,
                        content: createNewSchedule(currentItem.content, internalItem, activeDirectory, activeItemIndex)
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

const sortFolders = (a: SidebarStructure | SidebarStructureItem, b: SidebarStructure | SidebarStructureItem) => {

    if(a?.name === "yabloneviy" && b?.name === "uglovoi"){
        return -1
    } else if(a?.name === "day" && b?.name === "night") {
        return -1
    } else if(a?.name > b?.name) {
        return 1
    } else {
        return -1
    }

};

export const createSidebarContentRecursively = ({
    structure,
    searchBarValue
}: CreateRecursiveContent) => {

    const arrayOfItems = Object.values(structure);
    
    return arrayOfItems.map((singleItem) => {
        
        if(Array.isArray(singleItem)){

            const sortedArray = [...singleItem].sort(sortFolders);
            
            return sortedArray.map((internalItem) => {

                const internalProperties = Object.entries(internalItem) as InternalProperties;
                const protectiveCondition = stringValidators.validateItemName({name: internalItem.name as string});
                
                if(internalProperties[2][1] !== "folder" && !Array.isArray(internalProperties[0][1])){
                    
                    if((typeof internalItem.name === "string" && internalItem.name.match(searchBarValue) && protectiveCondition)){
                        
                        return (
                            <SidebarFileItem
                                key={`${internalItem.id}`}
                                internalItem={internalItem as SidebarStructureItem}
                            />
                        )

                    }

                } else {

                    return(
                        <SidebarFolderItem
                            key={`${internalProperties[0][0]}`}
                            internalProperties={internalProperties}
                        />
                    )

                }

            }).filter((item)=> item)
        }

    })

}

export const onListElementClick = (
    dispatch: AppDispatch,
    scheduleStructure: Array<ScheduleItemInterface>,
    internalItem: SidebarStructureItem,
    scheduleActiveDirectory: string,
    activeItemIndex: number
) => {

    const newSchedule = createNewSchedule(scheduleStructure, internalItem, scheduleActiveDirectory, activeItemIndex)
    const newFolderContent = createNewActiveDirectoryItems(newSchedule, scheduleActiveDirectory);

    dispatch(scheduleActions.setScheduleStructure(newSchedule));
    dispatch(scheduleActions.setActiveDirectoryItems(newFolderContent));
}

export const onInputChange = (event: ChangeEvent<HTMLInputElement>, dispatch: AppDispatch) => {

    const protectiveCondition = stringValidators.validateInputValue({event});

    if(protectiveCondition) {
        dispatch(sidebarActions.setSearchBarValue(event.target.value));
    }

}

export const onGoogleStructureButtonClick = async (dispatch: AppDispatch) => {

    dispatch(modalActions.setModalIsShown(true));
    dispatch(modalActions.setModalContent({
        response: "Ожидайте. Файлы загружаются из облачного хранилища google на сервер."
    }));

    const modalContent = await dispatch(fetchActualGoogleStructure()).then((serverResponse: any) => {
        return {
            response: serverResponse.payload.response
        }
    })
    .catch(() => {
        return {
            response: "",
            error: "Произошла ошибка: файлы из облачного хранилища google не были загружены на сервер"
        }
    });

    dispatch(modalActions.setModalIsShown(true));
    dispatch(modalActions.setModalContent(modalContent));

}

export const onFolderItemClick = ({setIsOpen}: {setIsOpen:  Dispatch<SetStateAction<boolean>>}) => {
    setIsOpen(prevState => !prevState);
};