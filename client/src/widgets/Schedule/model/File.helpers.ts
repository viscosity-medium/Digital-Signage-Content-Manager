import {
    FindFileRecursively,
    ScheduleItemInterface
} from "./Schedule.types";

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

        } else if(structureItem.type === "folder" && "randomIsActive" in itemLimits){

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