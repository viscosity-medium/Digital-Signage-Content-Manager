import {onDeleteButtonClick} from "@/widgets/Schedule/model/Schedule.helpers";
import CrossSvg from "@/assets/cross.svg";
import {Button} from "@/shared";
import {useAppDispatch} from "../../../../../store/store";
import {useSelector} from "react-redux";
import {getScheduleActiveDirectory, getScheduleStructure} from "@/widgets/Schedule/model/Schedule.selectors";
import {FC} from "react";

interface FolderCloseButtonProps {
    index: number
}

const FolderCloseButton: FC<FolderCloseButtonProps> = ({
    index
}) => {

    const dispatch = useAppDispatch();
    const scheduleStructure = useSelector(getScheduleStructure);
    const activeDirectory = useSelector(getScheduleActiveDirectory);

    return (
        <div>
            <Button
                onClick={()=>{
                    onDeleteButtonClick(dispatch, scheduleStructure, activeDirectory, index)
                }}
                className={"absolute top-3 right-3 z-0"}
            >
                <CrossSvg
                    className={"w-[24px] fill-red-500"}
                />
            </Button>
        </div>
    );
};

export {FolderCloseButton};