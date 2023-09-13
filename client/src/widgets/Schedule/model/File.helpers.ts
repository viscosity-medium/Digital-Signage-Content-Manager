import {
    FindFileRecursively,
    ScheduleFileInterface,
    ScheduleFolderInterface
} from "./Schedule.types";

export const changeFileLimitsRecursively = ({
    fileUniqueId,
    structure,
    itemLimits
}: FindFileRecursively): (ScheduleFileInterface | ScheduleFolderInterface)[] => {

    return structure.reduce((accumulator: (ScheduleFileInterface | ScheduleFolderInterface)[], structureItem) => {

        if(structureItem.type === "file"){

            if(structureItem.uniqueId === fileUniqueId){
                return [
                    ...accumulator,
                    {
                        ...structureItem,
                        limits: itemLimits
                    }
                ];
            } else {
                return [
                    ...accumulator,
                    structureItem
                ];
            }

        } else if(structureItem.type === "folder"){

            return [
                ...accumulator,
                {
                    ...structureItem,
                    content: [
                        ...changeFileLimitsRecursively({
                            structure: structureItem.content,
                            fileUniqueId,
                            itemLimits
                        })
                    ]
                }
            ];

        } else {
            return accumulator;
        }

    }, []);

}