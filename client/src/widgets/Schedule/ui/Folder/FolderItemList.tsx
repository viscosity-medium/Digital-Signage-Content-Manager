import {Div, Text} from "@/shared";
import {v4 as uuid} from "uuid";
import {ScheduleFolderInterface} from "@/widgets/Schedule/model/Schedule.types";
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

    const textColor = condition ? "whiteTextColor" : "blackTextColor";

    return (
        <Div
            className={"flex flex-col ml-[8px]"}
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