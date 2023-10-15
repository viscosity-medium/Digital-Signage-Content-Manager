import {useEffect} from "react";
import {fetchSidebarStructure} from "./Sidebar.asyncThunks";
import {useAppDispatch} from "@/store/store";
import {modalActions} from "../../Modal/model/Modal.slice";

export const useFetchSidebarStructure = () => {

    const dispatch = useAppDispatch();

    useEffect(()=>{
        (async ()=>{
            const serverResponse: any = await dispatch(fetchSidebarStructure())
            .then((serverResponse: any) => {
                return {
                    response: serverResponse.payload.response
                }
            })
            .catch(() => {
                return {
                    response: "",
                    error: "Сервер не смог загрузить данные\nОбратитесь к администрации ресурса"
                }
            });

            if(serverResponse.error){
                dispatch(modalActions.setModalIsShown(true));
                dispatch(modalActions.setModalContent(serverResponse));
            }

        })()
    },[dispatch]);

}