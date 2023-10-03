import {useEffect, useState} from "react";

export const useSetLocalStorageCredentials = () => {
    const [login, setLogin] = useState<string | null | undefined>(undefined);
    const [password, setPassword] = useState<string | null | undefined>(undefined);

    useEffect(()=>{
        if(typeof window !== undefined){
            setLogin(window.localStorage.getItem("login"))
            setPassword(window.localStorage.getItem("password"))
        }
    },[]);

    return {login, password}
}