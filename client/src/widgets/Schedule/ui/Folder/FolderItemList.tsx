import {Div, Text} from "@/shared";
import {v4 as uuid} from "uuid";
import {ScheduleFolderInterface} from "../../model/Schedule.types";
import {FC} from "react";
import "./folder.css";

export interface FolderItemListProps{
    item: ScheduleFolderInterface,
    condition: boolean
}

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
                item.content.map((textContent, index) => {
                    const name = textContent.type === "file" ? textContent.name  : `[ ${textContent.name} ]`;
                    const duration = (typeof textContent.limits.time === "string" && textContent.limits.time !== "default") ?
                        `(${textContent.limits.time.replace(/.*T\d{2}:|\..*$/gm, "")})` : "";

                    return (
                        <Text
                            key={uuid()}
                            tag={"p"}
                            className={`text-[16px] ${textColor}`}
                        >
                            {index+1}) { name } {duration}
                        </Text>
                    )

                })
            }
        </Div>
    );

};

export {FolderItemList};