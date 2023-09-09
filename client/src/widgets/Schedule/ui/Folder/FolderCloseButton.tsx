import {onDeleteButtonClick} from "@/widgets/Schedule/model/Schedule.helpers";
import CrossSvg from "@/assets/cross.svg";
import {Button} from "@/shared";
import {useAppDispatch} from "../../../../../store/store";
import {useSelector} from "react-redux";
import {getScheduleActiveDirectoryId, getScheduleStructure} from "@/widgets/Schedule/model/Schedule.selectors";
import {FC} from "react";
import {ScheduleFolderInterface} from "@/widgets/Schedule/model/Schedule.types";

interface FolderCloseButtonProps {
    item: ScheduleFolderInterface
    index: number
}

const FolderCloseButton: FC<FolderCloseButtonProps> = ({
    item,
    index
}) => {

    const dispatch = useAppDispatch();
    const scheduleStructure = useSelector(getScheduleStructure);
    const activeDirectoryId = useSelector(getScheduleActiveDirectoryId);

    if(item.isEditable){
        return (
            <div>
                <Button
                    onClick={()=>{
                        onDeleteButtonClick(dispatch, scheduleStructure, activeDirectoryId, index)
                    }}
                    className={"absolute top-3 right-3 z-0"}
                >
                    <CrossSvg
                        className={"w-[24px] fill-red-500"}
                    />
                </Button>
            </div>
        );
    } else {
        return null;
    }

};

export {FolderCloseButton};