import {useAppDispatch} from "@/store/store";
import {Aside, Button, Input, Text, UnorderedList} from "@/shared";
import {
    createSidebarContentRecursively, onGoogleStructureButtonClick, onInputChange
} from "@/widgets/Sidebar/model/Sidebar.helpers";
import {getSearchBarValue, getSidebarStructure} from "@/widgets/Sidebar/model/Sidebar.selectors";
import {useSelector} from "react-redux";
import {useFetchSidebarStructure} from "@/widgets/Sidebar/model/Sidebar.hooks";

const Sidebar = () => {

    const dispatch = useAppDispatch();
    const structure = useSelector(getSidebarStructure);
    const searchBarValue = useSelector(getSearchBarValue);

    useFetchSidebarStructure();

    return (
        <Aside
            className={"flex flex-col p-[12px] h-[100%] w-[100%]"}
        >
            <Button
                className={"w-[100%] border-[3px] border-[#65ff94] rounded transition duration-300 hover:bg-[#00000033]"}
                onClick={async () => {
                    await onGoogleStructureButtonClick(dispatch);
                }}
            >
                <Text
                    tag={"h3"}
                    className={"py-[4px] px-[8px] text-[#65ff94] text-[16px]"}
                >
                    Загрузить новые файлы с google-диска
                </Text>
            </Button>
            <Input
                value={searchBarValue}
                onChange={(event) => {
                    onInputChange(event, dispatch)
                }}
                placeholder={"Введите текст для поиска ..."}
                className={"mt-3 px-[12px] w-[100%] h-[32px]"}
            />
            <UnorderedList
                className={"flex-1 mt-3 overflow-y-scroll unorderedTrackList"}
            >
                {createSidebarContentRecursively({
                    structure,
                    searchBarValue
                })}
            </UnorderedList>
        </Aside>
    );

};

export {Sidebar};