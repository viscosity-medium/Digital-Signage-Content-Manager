import {ChangeEvent} from "react";
import {AppDispatch} from "@/store/store";
import {authModuleActions} from "@/widgets/AuthModule/model/AuthModal.slice";

export const onSubmitButtonClick = ({ login, password }: { login: string, password: string }) => {

    if(typeof window !== "undefined"){
        window.localStorage.setItem("login", login);
        window.localStorage.setItem("password", password);
    }

};

export const onLoginInputChange = ({event, dispatch}: {event: ChangeEvent<HTMLInputElement>, dispatch: AppDispatch}) => {
    dispatch(authModuleActions.setLogin(event.target.value));
};

export const onPasswordInputChange = ({event, dispatch}: {event: ChangeEvent<HTMLInputElement>, dispatch: AppDispatch}) => {
    dispatch(authModuleActions.setPassword(event.target.value));
};