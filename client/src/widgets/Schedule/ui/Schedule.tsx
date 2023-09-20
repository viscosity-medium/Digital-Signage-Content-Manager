'use client'

import {Button, Div, Text, UnorderedList} from "@/shared";
import {useSelector} from "react-redux";
import {useAppDispatch} from "../../../../store/store";
import {
    getActiveDirectoryScheduleItems,
    getScheduleActiveDirectoryId, getScheduleActiveDirectoryName,
    getScheduleActiveItemIndex,
    getScheduleStructure
} from "@/widgets/Schedule/model/Schedule.selectors";
import {useFetchScheduleStructure} from "@/widgets/Schedule/model/Schedule.hooks";
import { useRouter, useSearchParams } from 'next/navigation'
import {
    moveScheduleItem,
    onCloseCurrentFolderClick,
    onCreateFolderButtonClick,
    onSaveButtonClick,
    renderScheduleItemsHelper
} from "@/widgets/Schedule/model/Schedule.helpers";

const Schedule = () => {

    const dispatch = useAppDispatch();
    const activeDirectoryItems = useSelector(getActiveDirectoryScheduleItems);
    const activeDirectoryId = useSelector(getScheduleActiveDirectoryId);
    const activeDirectoryName = useSelector(getScheduleActiveDirectoryName);
    const activeItemIndex = useSelector(getScheduleActiveItemIndex);
    const scheduleStructure = useSelector(getScheduleStructure);
    const searchParams = useSearchParams();
    const router = useRouter();
    const structure = searchParams.get("structure");
    const defaultFolderName = "Корневой каталог"

    useFetchScheduleStructure();
    
    return (
        <Div
            className={"flex flex-col justify-between m-[50px] p-[50px] w-[100%] max-h-[100vh] border-[4px] border-solid border-white"}
        >
            <Div
                className={"flex flex-col max-h-[90%]"}
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
                                        onCloseCurrentFolderClick(
                                            dispatch,
                                            scheduleStructure,
                                            activeDirectoryId,
                                            router,
                                            structure
                                        )
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
                                        onCreateFolderButtonClick(
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
                    id={"unorderedTrackList"}
                    className={"overflow-y-scroll mt-[20px] h-[100%] pr-[16px]"}
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
            <Button
                className={"border-[3px] border-white rounded transition duration-300 hover:bg-[#00000033]"}
                onClick={()=>{
                    onSaveButtonClick(dispatch, scheduleStructure)
                }}
            >
                <Text
                    tag={"p"}
                    className={"py-[4px] px-[8px] text-[#fff] text-[20px]"}
                >
                    Сохранить изменения
                </Text>
            </Button>
        </Div>
    );
};

export {Schedule};