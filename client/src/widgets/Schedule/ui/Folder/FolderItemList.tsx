import {Div, Text} from "@/shared";
import {v4 as uuid} from "uuid";
import {FolderItemListProps} from "../../model/Schedule.types";
import {FC} from "react";
import "./folder.css";
import {getFileItemDuration} from "../../model/helpers/ScheduleTimeConverters.helpers";

const FolderItemList: FC<FolderItemListProps> = ({
    item,
    condition
}) => {

    const textColor = condition ? "whiteTextColor" : "blueTextColor";

    return (
        <Div
            className={"z-[2] flex flex-col ml-[8px]"}
        >
            {
                item.content.map((innerItem, index) => {

                    const name = innerItem.type === "file" ? innerItem.name  : `[ ${innerItem.name} ]`;
                    const contentLength = innerItem.type === "folder" ? `#${innerItem.content.length}` : "";
                    const duration = getFileItemDuration({innerItem});

                    return (
                        <Text
                            key={uuid()}
                            tag={"p"}
                            className={`text-[16px] ${textColor}`}
                        >
                            {index+1}) { name } {contentLength} {duration}
                        </Text>
                    )

                })
            }
        </Div>
    );

};

export {FolderItemList};