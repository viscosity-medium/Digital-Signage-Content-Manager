import {useEffect} from "react";
import {useDispatch} from "react-redux";
import {checkUserCredentials, setUserCredentials} from "./User.helpers";

export const useSetUserCredentials = () => {

    const dispatch = useDispatch();

    useEffect(() => {

        if(typeof window !== undefined){

            const login = window.localStorage.getItem("login");
            const password = window.localStorage.getItem("password");
            const userCredentials = checkUserCredentials({ login, password });

            if(userCredentials){
                setUserCredentials({dispatch});
            }

        }

    },[]);

}