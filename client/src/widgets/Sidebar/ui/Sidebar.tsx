import {useEffect} from "react";
import {useAppDispatch} from "../../../../store/store";
import {fetchSidebarStructure} from "@/widgets/Sidebar/model/Sidebar.asyncThunks";
import {Aside, UnorderedList} from "@/shared";
import {createRecursiveContent} from "@/widgets/Sidebar/model/Sidebar.helpers";
import {getSidebarStructure} from "@/widgets/Sidebar/model/Sidebar.selectors";
import {useSelector} from "react-redux";

const Sidebar = () => {

    const dispatch = useAppDispatch();
    useEffect(()=>{
        dispatch(fetchSidebarStructure());
    },[]);

    const sidebarStructure = useSelector(getSidebarStructure);

    return (
        <Aside>
            <UnorderedList>
                {createRecursiveContent({structure: sidebarStructure})}
            </UnorderedList>
        </Aside>
    );

};

export {Sidebar};