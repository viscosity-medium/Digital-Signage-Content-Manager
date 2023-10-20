'use client'

import {Button, Div, Text, UnorderedList, useDebounce} from "@/shared";
import {useSelector} from "react-redux";
import {useAppDispatch} from "@/store/store";
import {
    getActiveDirectoryScheduleItems,
    getScheduleActiveDirectoryId,
    getScheduleActiveDirectoryName,
    getScheduleActiveItemIndex,
    getScheduleScrollProperties,
    getScheduleStructure
} from "../model/Schedule.selectors";
import {
    useAutoScrollToTop,
    useChangeFolderProperties,
    useFetchScheduleStructure,
    useInitScrollPropertiesStructure
} from "../model/hooks/Schedule.hooks";
import {useRouter, useSearchParams} from 'next/navigation'
import {renderScheduleItemsHelper} from "../model/helpers/ScheduleRender.helpers";
import {onAddNewFolderClick, onCloseCurrentFolderClick} from "../model/helpers/ScheduleEventListeners.helpers";
import {moveScheduleItem} from "../model/helpers/ScheduleDragAndDrop.helpers";
import {useEffect, useRef} from "react";
import {DeployBar} from "@/widgets/Schedule/ui/DeployBar/ui/DeployBar";
import {setNestedScrollProperties} from "@/widgets/Schedule/model/helpers/ScheduleScrollProperties.helpers";
import {scheduleActions} from "@/widgets/Schedule/model/Schedule.slice";

const Schedule = () => {

    const dispatch = useAppDispatch();
    const unOrderListRef = useRef<HTMLUListElement>(null);
    const activeDirectoryItems = useSelector(getActiveDirectoryScheduleItems);
    const activeDirectoryId = useSelector(getScheduleActiveDirectoryId);
    const activeDirectoryName = useSelector(getScheduleActiveDirectoryName);
    const activeItemIndex = useSelector(getScheduleActiveItemIndex);
    const scheduleStructure = useSelector(getScheduleStructure);
    const scrollProperties = useSelector(getScheduleScrollProperties);
    const searchParams = useSearchParams();
    const router = useRouter();
    const structure = searchParams.get("structure");
    const defaultFolderName = "Корневой каталог";

    const debouncedCallback = useDebounce({
        callback: (scrollTop: number[]) => {
            const newScrollProperties = setNestedScrollProperties({
                scrollTop: scrollTop[0],
                scrollProperties: scrollProperties
            });
            dispatch(scheduleActions.setScheduleScrollProperties(newScrollProperties));
        },
        timeout: 300
    });

    useChangeFolderProperties()
    useFetchScheduleStructure();
    useInitScrollPropertiesStructure();
    useAutoScrollToTop({unOrderListRef});

    useEffect(() => {

        console.log(structure);
        console.log(activeDirectoryId);

    }, [searchParams]);

    return (
        <Div
            className={"flex flex-col justify-between m-[50px] p-[20px] w-[100%] max-h-[100vh] border-[4px] border-solid border-white"}
        >
            <Div
                className={"flex flex-col max-h-[90%] pb-[16px]"}
            >
                <Div
                    className={"flex justify-between"}
                >
                    {
                        activeDirectoryId !== "rootDirectory" ? (
                            <>
                                <Button
                                    className={"self-start max-w-[250px] border-[3px] border-white rounded transition duration-300  hover:bg-[#00000033]"}
                                    onClick={()=>{
                                        onCloseCurrentFolderClick({
                                            dispatch,
                                            scheduleStructure,
                                            activeDirectoryId,
                                            router,
                                            structureParams: structure,
                                            scrollProperties
                                        })
                                    }}
                                >
                                    <Text
                                        tag={"p"}
                                        className={"py-[4px] px-[8px] text-[#fff] text-[20px]"}
                                    >
                                        Вернуться обратно
                                    </Text>
                                </Button>
                                <Div>
                                    <Text
                                        tag={"h2"}
                                        className={"text-[30px] text-[#fff] text-center"}
                                    >
                                        {
                                            activeDirectoryName !== "rootDirectory" ? activeDirectoryName : defaultFolderName
                                        }
                                    </Text>
                                </Div>
                                <Button
                                    className={"self-end max-w-[250px] border-[3px] border-white rounded transition duration-300 bg-[#fcd462] hover:bg-[#d7b451]"}
                                    onClick={()=>{
                                        onAddNewFolderClick(
                                            dispatch,
                                            scheduleStructure,
                                            activeDirectoryId,
                                            (activeItemIndex !== undefined ? activeItemIndex : activeDirectoryItems.length - 1)
                                        );
                                    }}
                                >
                                    <Text
                                        tag={"p"}
                                        className={"py-[4px] px-[8px] text-[#fff] text-[20px]"}
                                    >
                                        Добавить папку
                                    </Text>
                                </Button>
                            </>
                        ) : (
                            <Div
                                className={"w-[100%]"}
                            >
                                <Text
                                    tag={"h2"}
                                    className={"text-[30px] text-[#fff] text-center"}
                                >
                                    {
                                        defaultFolderName
                                    }
                                </Text>
                            </Div>
                        )
                    }
                </Div>
                <UnorderedList
                    onScroll={(event) => {
                        debouncedCallback(+event.currentTarget.scrollTop)
                    }}
                    reference={unOrderListRef}
                    className={"overflow-y-scroll mt-[20px] h-[100%] pr-[16px] unorderedTrackList"}
                >
                    {
                        activeDirectoryItems.map((item, index) => (
                            renderScheduleItemsHelper(
                                item,
                                index,
                                moveScheduleItem(
                                    dispatch,
                                    scheduleStructure,
                                    activeDirectoryItems,
                                    activeDirectoryId
                                )
                            )
                        ))
                    }
                </UnorderedList>
            </Div>
            <DeployBar/>
        </Div>
    );
};

export default Schedule