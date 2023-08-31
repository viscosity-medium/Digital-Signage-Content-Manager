import {Div, Text} from "@/shared";
import {v4 as uuid} from "uuid";
import {ScheduleFolderInterface} from "@/widgets/Schedule/model/Schedule.types";
import {FC} from "react";

export interface FolderItemListProps{
    item: ScheduleFolderInterface
}

const FolderItemList: FC<FolderItemListProps> = ({
    item
}) => {

    const staticFolderName = "Папка";

    return (
        <Div
            className={"flex flex-col"}
        >
            {
                item.content.map((textContent, index) => {
                    const name =  textContent.type === "file" ? textContent.name  : staticFolderName;

                    return (
                        <Text
                            key={uuid()}
                            tag={"p"}
                            className={`text-[16px] ${name === staticFolderName && "text-[#fcd462]"}`}
                        >
                            {index+1}) {
                            name
                        }
                        </Text>
                    )

                })
            }
        </Div>
    );

};

export {FolderItemList};