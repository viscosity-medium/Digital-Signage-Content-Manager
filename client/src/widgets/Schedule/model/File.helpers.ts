import {
    FindFileRecursively,
    ScheduleFileInterface,
    ScheduleFolderInterface
} from "./Schedule.types";

export const changeItemLimitsRecursively = ({
    itemUniqueId,
    structure,
    itemLimits
}: FindFileRecursively): (ScheduleFileInterface | ScheduleFolderInterface)[] => {

    return structure.reduce((accumulator: (ScheduleFileInterface | ScheduleFolderInterface)[], structureItem: any) => {

        if(structureItem.type === "file"){

            if(structureItem.uniqueId === itemUniqueId){
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
                    limits: structureItem.uniqueId === itemUniqueId ? itemLimits : structureItem.limits,
                    content: [
                        ...changeItemLimitsRecursively({
                            structure: structureItem.content,
                            itemUniqueId: itemUniqueId,
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