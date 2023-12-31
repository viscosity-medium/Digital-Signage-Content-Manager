import {
    FindFileRecursively, ItemFolderLimits,
    ScheduleItemInterface
} from "../Schedule.types";

export const changeItemLimitsRecursively = ({
    itemUniqueId,
    structure,
    itemLimits
}: FindFileRecursively): Array<ScheduleItemInterface> => {

    return structure.reduce((accumulator: Array<ScheduleItemInterface>, structureItem: ScheduleItemInterface) => {

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
                    limits: structureItem.uniqueId === itemUniqueId ? itemLimits as ItemFolderLimits : structureItem.limits,
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