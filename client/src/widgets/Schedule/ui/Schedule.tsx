'use client'

import {Button, Div, Text, UnorderedList} from "@/shared";
import {useSelector} from "react-redux";
import {useAppDispatch} from "../../../../store/store";
import {
    getActiveDirectoryScheduleItems,
    getScheduleActiveDirectory, getScheduleActiveItemIndex,
    getScheduleStructure
} from "@/widgets/Schedule/model/Schedule.selectors";
import {useFetchScheduleStructure} from "@/widgets/Schedule/model/Schedule.hooks";
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
    const activeDirectory = useSelector(getScheduleActiveDirectory);
    const scheduleStructure = useSelector(getScheduleStructure);

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
                        activeDirectory !== "rootDirectory" ? (
                            <Button
                                className={"self-start max-w-[250px] border-[3px] border-white rounded transition duration-300  hover:bg-[#00000033]"}
                                onClick={()=>{
                                    onCloseCurrentFolderClick(dispatch, scheduleStructure, activeDirectory)
                                }}
                            >
                                <Text
                                    tag={"p"}
                                    className={"py-[4px] px-[8px] text-[#fff] text-[20px]"}
                                >
                                    Вернуться обратно
                                </Text>
                            </Button>
                        ) : <Div/>
                    }
                    <Button
                        className={"self-end max-w-[250px] border-[3px] border-white rounded transition duration-300 bg-[#fcd462] hover:bg-[#d7b451]"}
                        onClick={()=>{
                            onCreateFolderButtonClick(dispatch, scheduleStructure, activeDirectory);
                        }}
                    >
                        <Text
                            tag={"p"}
                            className={"py-[4px] px-[8px] text-[#fff] text-[20px]"}
                        >
                            Добавить папку
                        </Text>
                    </Button>
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
                                    activeDirectory
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