'use client'

import {DetailedHTMLProps, FC, HTMLAttributes} from "react";
import {useAppDispatch} from "@/store/store";
import {useSelector} from "react-redux";
import {
    getActiveDirectoryScheduleItems, getScheduleActiveDirectoryId, getScheduleActiveItemIndex,
    getScheduleActiveItemsIndexesRange,
    getScheduleBufferDataToCopy, getScheduleStructure
} from "@/widgets/Schedule/model/Schedule.selectors";
import {onBodyKeyDown} from "@/shared/ui-kit/__HtmlTags/Body/model/Body.helpers";

export interface BodyProps extends  DetailedHTMLProps<HTMLAttributes<HTMLBodyElement>, HTMLBodyElement>{}

const Body: FC<BodyProps> = ({
    className,
    ...otherProps
}) => {

    const dispatch = useAppDispatch();
    const scheduleStructure = useSelector(getScheduleStructure);
    const activeItemIndex = useSelector(getScheduleActiveItemIndex);
    const activeDirectoryId = useSelector(getScheduleActiveDirectoryId);
    const scheduleBufferDataToCopy = useSelector(getScheduleBufferDataToCopy);
    const activeItemsIndexesRange = useSelector(getScheduleActiveItemsIndexesRange);
    const activeDirectoryScheduleItems = useSelector(getActiveDirectoryScheduleItems);

    return (
        <body
            className={className}
            onKeyDown={(event)=>{
                onBodyKeyDown({
                    event,
                    dispatch,
                    activeItemIndex,
                    scheduleStructure,
                    activeDirectoryId,
                    activeItemsIndexesRange,
                    activeDirectoryScheduleItems,
                    scheduleBufferDataToCopy
                })
            }}
            {...otherProps}
        >

        </body>
    );
};

export {Body};