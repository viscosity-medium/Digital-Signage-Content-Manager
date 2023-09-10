import {Div, Text} from "@/shared";
import {v4 as uuid} from "uuid";
import {ScheduleFolderInterface} from "@/widgets/Schedule/model/Schedule.types";
import {FC} from "react";
import {Identifier} from "dnd-core";
import "./folder.css";
import {useSelector} from "react-redux";
import {
    getScheduleActiveItem,
    getScheduleActiveItemIndex,
    getScheduleStructure
} from "@/widgets/Schedule/model/Schedule.selectors";

export interface FolderItemListProps{
    item: ScheduleFolderInterface,
    handlerId: Identifier | null

}

const FolderItemList: FC<FolderItemListProps> = ({
    item,
    handlerId
}) => {

    const scheduleActiveItem = useSelector(getScheduleActiveItem);
    const activeItemIndex = useSelector(getScheduleActiveItemIndex);
    const textColor = activeItemIndex !== undefined && handlerId === scheduleActiveItem ? "whiteTextColor" : "blackTextColor";

    return (
        <Div
            className={"flex flex-col"}
        >
            {
                item.content.map((textContent, index) => {
                    const name =  textContent.type === "file" ? textContent.name  : `[ ${textContent.name} ]`;

                    return (
                        <Text
                            key={uuid()}
                            tag={"p"}
                            className={`text-[16px] ${textColor}`}
                        >
                            {index+1}) { name }
                        </Text>
                    )

                })
            }
        </Div>
    );

};

export {FolderItemList};