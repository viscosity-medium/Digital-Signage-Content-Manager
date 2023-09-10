import {ChangeEvent, useEffect} from "react";
import {useAppDispatch} from "../../../../store/store";
import {fetchSidebarStructure} from "@/widgets/Sidebar/model/Sidebar.asyncThunks";
import {Aside, Input, UnorderedList} from "@/shared";
import {createRecursiveContent} from "@/widgets/Sidebar/model/Sidebar.helpers";
import {getSearchBarValue, getSidebarStructure} from "@/widgets/Sidebar/model/Sidebar.selectors";
import {useSelector} from "react-redux";
import { sidebarActions } from "../model/Sidebar.slice";

const Sidebar = () => {

    const dispatch = useAppDispatch();
    const structure = useSelector(getSidebarStructure);
    const searchBarValue = useSelector(getSearchBarValue);

    useEffect(()=>{
        dispatch(fetchSidebarStructure());
    },[]);

    const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        dispatch(sidebarActions.setSearchBarValue(event.target.value))
    }

    return (
        <Aside
            className={"h-[100%] overflow-y-scroll"}
        >
            <Input
                value={searchBarValue}
                onChange={(event) => {onInputChange(event)}}
                placeholder={"Введите текст для поиска ..."}
                className={"mt-[20px] mx-[5%] px-[12px] w-[90%]"}
            />
            <UnorderedList>
                {createRecursiveContent({
                    structure,
                    searchBarValue
                })}
            </UnorderedList>
        </Aside>
    );

};

export {Sidebar};