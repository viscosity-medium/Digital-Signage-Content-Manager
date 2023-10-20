import {AppDispatch} from "@/store/store";
import {userDataActions} from "./UserData.slice";

export type CheckUserCredentials = "maer" | "digisky" | false;

export const setUserCredentials = ({
    dispatch
}:{
    dispatch: AppDispatch
}) => {
    const login = window.localStorage.getItem("login");
    const password = window.localStorage.getItem("password");

    dispatch(userDataActions.setLogin(login));
    dispatch(userDataActions.setPassword(password));
};

export const resetUserCredentials = ({
    dispatch
}:{
    dispatch: AppDispatch
}) => {
    dispatch(userDataActions.setLogin(""));
    dispatch(userDataActions.setPassword(""));
};

export const checkUserCredentials = ({ login, password }: {
    login: string | null | undefined,
    password: string | null | undefined
}): CheckUserCredentials  => {

    if(login === "MaerAdmin" && password === "SuperAdmin010"){
        return "maer"
    } else if (login === "DigiskyAdmin" && password === "Unsurpa55edAdm1n"){
        return "digisky"
    } else {
        return false
    }

}