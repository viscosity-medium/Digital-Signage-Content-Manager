import {SidebarStructure, SidebarStructureItem} from "@/widgets/Sidebar/model/Sidebar.type";
import {SidebarFileItem} from "@/widgets/Sidebar/ui/SidebarFileItem";
import {SidebarFolderItem} from "@/widgets/Sidebar/ui/SidebarFolderItem";
import {AppDispatch} from "../../../../store/store";
import {scheduleActions} from "@/widgets/Schedule/model/Schedule.slice";
import {ScheduleFileInterface, ScheduleFolderInterface} from "@/widgets/Schedule/model/Schedule.types";
import {v4 as uuid} from "uuid";


export const createNewSchedule = (
    scheduleStructure: Array<ScheduleFileInterface | ScheduleFolderInterface>,
    internalItem: ScheduleFileInterface | ScheduleFolderInterface | any,
    activeDirectory: string,
    activeItemIndex: number
): Array<ScheduleFileInterface | ScheduleFolderInterface> => {

    return scheduleStructure.reduce((
        accumulator: Array<ScheduleFileInterface | ScheduleFolderInterface | any>,
        currentItem: ScheduleFileInterface | ScheduleFolderInterface
    ) => {

        if(currentItem.type === "folder"){

            if(currentItem.uniqueId === activeDirectory){

                const content = currentItem.content.reduce((accum: any, currentItem, index) => {
                    if(activeItemIndex === index){
                        return ([
                                ...accum,
                                currentItem,
                                {
                                    id: internalItem.id,
                                    name: internalItem.name,
                                    thumbnailLink: internalItem.thumbnailLink,
                                    mimeType: internalItem.mimeType,
                                    type: "file",
                                    uniqueId: uuid()
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
                            id: internalItem.id,
                            name: internalItem.name,
                            thumbnailLink: internalItem.thumbnailLink,
                            mimeType: internalItem.mimeType,
                            type: "file",
                            uniqueId: uuid()
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

export const onListElementClick = (
    dispatch: AppDispatch,
    scheduleStructure: Array<ScheduleFileInterface | ScheduleFolderInterface>,
    internalItem: SidebarStructureItem,
    scheduleActiveDirectory: string,
    activeItemIndex: number
) => {

    const newSchedule = createNewSchedule(scheduleStructure, internalItem, scheduleActiveDirectory, activeItemIndex)
    const newFolderContent =  createNewActiveDirectoryItems(newSchedule, scheduleActiveDirectory);

    dispatch(scheduleActions.setScheduleStructure(newSchedule));
    dispatch(scheduleActions.setActiveDirectoryItems(newFolderContent));
}

export const createRecursiveContent = ({
    structure
}: {
    structure:  SidebarStructure
}) => {

    const arrayOfItems = Object.values(structure);
    
    return arrayOfItems.map((singleItem) => {
        
        if(Array.isArray(singleItem)){
            
            const sortFolders = (a: any, b: any) => {
            
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

            const sortedArray = [...singleItem].sort(sortFolders)

            return sortedArray.map((internalItem) => {

                const internalProperties = Object.entries(internalItem);
                
                if(internalProperties[2][1] !== "folder" && !Array.isArray(internalProperties[0][1])){

                    return (
                        <SidebarFileItem
                            key={`${internalItem.id}`}
                            internalItem={internalItem as SidebarStructureItem}
                        />
                    )

                } else {

                    return(
                        <SidebarFolderItem
                            key={`${internalProperties[0][0]}`}
                            internalProperties={internalProperties}
                        />
                    )

                }

            })
        }

    }).filter((item)=> item)

}