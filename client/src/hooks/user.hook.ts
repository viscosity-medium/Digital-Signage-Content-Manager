import {useEffect} from "react";
import {useDispatch} from "react-redux";
import {userDataActions} from "@/shared/ui-kit/SpecialClientComponents/model/UserData.slice";

export const useSetUserCredentials = () => {

    const dispatch = useDispatch();

    useEffect(() => {
        if(typeof window !== undefined){

            const login = window.localStorage.getItem("login");
            const password = window.localStorage.getItem("password");

            dispatch(userDataActions.setLogin(login));
            dispatch(userDataActions.setPassword(password));

        }
    },[]);

}