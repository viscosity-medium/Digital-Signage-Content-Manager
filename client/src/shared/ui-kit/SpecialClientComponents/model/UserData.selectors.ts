import {StateScheme} from "@/store/stateScheme";

export const getUserLogin = (state: StateScheme) => state.userData.login;
export const getUserPassWord = (state: StateScheme) => state.userData.password;