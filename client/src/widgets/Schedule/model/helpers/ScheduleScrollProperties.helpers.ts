import {ReadonlyURLSearchParams} from "next/navigation";
import {ScheduleScrollProperties} from "../Schedule.types";
import {AppDispatch} from "@/store/store";
import {scheduleActions} from "../Schedule.slice";

export const initScrollPropertiesStructure = ({
    dispatch,
    searchParams
}: {
    dispatch: AppDispatch,
    searchParams: ReadonlyURLSearchParams
}) => {

    const searchParamsString = searchParams.get("structure");
    const searchParamsArray = searchParamsString?.split("/")
    .filter(param => param);

    const initializeScrollProperties = ({
        array = [],
        index
    }: {
        index: number,
        array: string[] | undefined
    }): ScheduleScrollProperties => {

        if(array && index + 1 < array.length){
            return {
                directoryId: array[index],
                scrollTop: 0,
                content: initializeScrollProperties({
                    index: index + 1,
                    array
                })
            }
        } else {
            return {
                scrollTop: 0,
                directoryId: array[index],
                content: undefined
            }
        }

    }

    const newStructure = initializeScrollProperties({
        array: searchParamsArray,
        index: 0
    });

    dispatch(scheduleActions.setScheduleScrollProperties(newStructure));

};



export const addNestedScrollProperties = ({
    scrollProperties,
    directoryId,
}: {
    directoryId: string,
    scrollProperties: ScheduleScrollProperties | undefined
}): ScheduleScrollProperties | undefined => {

    if (scrollProperties && scrollProperties.content) {
        return({
            ...scrollProperties,
            content: addNestedScrollProperties({
                directoryId: directoryId,
                scrollProperties: scrollProperties.content,
            })
        });
    } else if (scrollProperties) {
        return ({
            ...scrollProperties,
            content: {
                scrollTop: 0,
                directoryId,
                content: undefined
            }
        });
    }

};

export const removeNestedScrollProperties = ({
    scrollProperties,
}: {
    scrollProperties: ScheduleScrollProperties | undefined
}): ScheduleScrollProperties | undefined => {

    if ( scrollProperties && scrollProperties.content ) {
        return({
            ...scrollProperties,
            content: removeNestedScrollProperties({
                scrollProperties: scrollProperties.content,
            })
        });
    } else if (scrollProperties) {
        return undefined;
    }

};

export const setNestedScrollProperties = ({
    scrollTop,
    scrollProperties
}: {
    scrollTop: number,
    scrollProperties: ScheduleScrollProperties | undefined
}): ScheduleScrollProperties | undefined => {

    if ( scrollProperties && scrollProperties.content ) {
        return({
            ...scrollProperties,
            content: setNestedScrollProperties({
                scrollTop,
                scrollProperties: scrollProperties.content
            })
        });
    } else if (scrollProperties) {
        return {
            ...scrollProperties,
            scrollTop
        };
    }

};

export const getCurrentDirectoryScrollProperties = ({
    scrollProperties
}: {
    scrollProperties: ScheduleScrollProperties | undefined
}): ScheduleScrollProperties | undefined => {

    if ( scrollProperties && scrollProperties.content ) {
        return(
            getCurrentDirectoryScrollProperties({
                scrollProperties: scrollProperties.content
            })
        );
    } else if (scrollProperties) {
        return {
            ...scrollProperties,
        };
    }

};