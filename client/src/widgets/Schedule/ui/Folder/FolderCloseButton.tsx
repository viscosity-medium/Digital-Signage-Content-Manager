import CrossSvg from "@/assets/cross.svg";
import {Button} from "@/shared";
import {useAppDispatch} from "@/store/store";
import {useSelector} from "react-redux";
import {getScheduleActiveDirectoryId, getScheduleStructure} from "../../model/Schedule.selectors";
import {FC} from "react";
import {ScheduleFolderInterface} from "../../model/Schedule.types";
import {onDeleteButtonClick} from "../../model/helpers/ScheduleEventListeners.helpers";

interface FolderCloseButtonProps {
    item: ScheduleFolderInterface
    index: number
    className: string | undefined
}

const FolderCloseButton: FC<FolderCloseButtonProps> = ({
    item,
    index,
    className
}) => {

    const dispatch = useAppDispatch();
    const scheduleStructure = useSelector(getScheduleStructure);
    const activeDirectoryId = useSelector(getScheduleActiveDirectoryId);

    if(item.isEditable){
        return (
            <Button
                className={className}
                onClick={(event)=>{
                    event.stopPropagation();
                    onDeleteButtonClick(dispatch, scheduleStructure, activeDirectoryId, index)
                }}
            >
                <CrossSvg
                    className={"w-[24px] fill-red-500"}
                />
            </Button>
        );
    } else {
        return null;
    }

};

export {FolderCloseButton};