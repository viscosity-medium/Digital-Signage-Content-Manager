import {useEffect} from "react";
import {fetchSidebarStructure} from "@/widgets/Sidebar/model/Sidebar.asyncThunks";
import {useAppDispatch} from "../../../../store/store";

export const useFetchSidebarStructure = () => {

    const dispatch = useAppDispatch();

    useEffect(()=>{
        dispatch(fetchSidebarStructure());
    },[]);

}